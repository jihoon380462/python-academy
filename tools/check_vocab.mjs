#!/usr/bin/env node
// tools/check_vocab.mjs — 영어 단어장 덱 데이터 검사(v2.46.0). 쓰기: node tools/check_vocab.mjs  (CI content 작업이 돌려요)
//   ① 덱 노트 파일(vocab/decks/*.js)이 전부 vocab/index.html 에 올바른 순서로 들어 있는지 — 빠지면 그 노트가 화면에 안 나와요.
//      스크립트 · 스타일 줄의 ?v= 가 모두 지금 APP_VERSION 인지(아니면 stamp 가 못 바꿔 오프라인 캐시가 낡아요)
//   ②-2 덱 안팎에서 글자까지 같은 예문이 없는지(여럿이 나눠 쓴 파일을 합칠 때 생겨요)
//   ② 덱 · 노트의 칸 모양(specs/vocab.md 3절): id · 품사 · 뜻 · 예문 · 순위 · forms(예문에 나온 모양만). 한 줄이라도 틀리면 어느 덱 어느 노트인지 알려 줘요
//   ③ 허브 설정: 「필수교양」 이 맨 앞 묶음이고 단어장이 deck 으로 들어 있는지
//   ④ 지시서(specs/vocab.md)의 덱별 노트 수 표가 실제와 같은지(문서 숫자가 낡지 않게 — LESSON.md R15),
//      지시서의 「어려운 경우 본보기」 줄이 덱에 든 같은 노트와 글자까지 같은지
//   ④-3 상태 문장: 지시서 덱 표의 상태 칸이 데이터(노트 수 · sample)와 맞는지, HANDOFF · TODO 0절 「영어 단어장」 줄에 덱마다 「이름 N개」 가 실제 수로 있는지,
//      채우는 중인 덱(sample)이 없는데 그 두 줄이나 지시서 0절에 「채우는 중」 이 남았는지(LESSON.md R15 두 번째)
//   ⑤ 기초 덱: 차례표(vocab/sources/base-order.tsv)가 원문 목록과 맞는지, 노트의 rank · id · w 가 차례표와 같은지, 출처 표기가 있는지,
//      노트가 제 차례의 파일(base-NNNN.js)에 들어 있는지, 예문이 쉬운지(14낱말까지 · 차례표 밖 낱말은 예문마다 1개까지)
//   ⑥ 듣기 덱(specs/vocab.md W2): pron 은 듣기 덱에서만(W3), 접사 노트는 affix 품사와 forms(W3), 듣기 덱의 pron 이 「강세 대문자 철자 [한글 소리]」 모양인지, say 가 있으면 카드가 읽기 · 듣기 둘인지,
//      낱말이 아닌 w(기호 · 식)에 say 가 있는지, 예문이 16낱말까지인지
//   ⑦ 한 덱 파일 안에서 같은 첫 두 낱말로 시작하는 예문이 12개까지인지(3절 — 같은 문장 틀만 되풀이하지 않게)
//   빈 틀(ko: [], ex: [] — tools/vocab_base_order.mjs --file 이 만든 것)이 남아 있으면 덱마다 한 줄로 알려 줘요
//   파일을 못 읽거나 실행하다 에러가 나면 통과가 아니라 실패예요(LESSON.md R6). 코어의 계산은 tools/test_vocab.mjs 가 봐요.
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import { ROOT } from './load_content.mjs';
import { build as buildBaseOrder, FILE_SIZE } from './vocab_base_order.mjs';
const errors = []; const err = (m) => errors.push(m);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const HANGUL = /[가-힣]/;
try {
  // ① 파일과 불러오는 순서
  const files = fs.readdirSync(path.join(ROOT, 'vocab/decks')).filter(f => f.endsWith('.js')).sort();
  const html = read('vocab/index.html'); const srcs = [...html.matchAll(/<script src="([^"?]+)/g)].map(m => m[1]);
  { const ver = (read('core/config.js').match(/APP_VERSION:\s*'([^']+)'/) || [])[1];
    for (const m of html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"]+)"/g)) { const v = /\?v=([0-9.]+)$/.exec(m[1]); if (!v || v[1] !== ver) err(`vocab/index.html: ${m[1]} 의 ?v= 가 지금 버전(${ver})이 아니에요 — 줄을 ?v=${ver} 로 쓰고 node tools/stamp.mjs 를 돌려요`); } }
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
  vm.runInContext(read('vocab/core.js') + '\n;this.__D = VocabDecks;', ctx, { filename: 'vocab/core.js' });
  const D = ctx.__D; const POS = Object.keys(D.POS); const TPL = Object.keys(D.TPL); const fileOfNote = new Map();   // 노트 → 그 노트가 든 덱 파일
  for (const s of deckSrcs.filter(s => files.includes(s.slice(6)))) { const before = new Map(D.list.map(d => [d.id, d.notes.length])); vm.runInContext(read('vocab/' + s), ctx, { filename: 'vocab/' + s }); for (const d of D.list) for (const n of d.notes.slice(before.get(d.id) || 0)) fileOfNote.set(n, s.slice(6)); }
  const isBlank = (n) => n && Array.isArray(n.ko) && !n.ko.length && Array.isArray(n.ex) && !n.ex.length;

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
    { const blanks = d.notes.filter(isBlank); if (blanks.length) err(`${dw}: 빈 틀 ${blanks.length}개가 남았어요 — ko · ex 를 채워요(첫 빈 틀: ${fileOfNote.get(blanks[0])} 의 ${blanks[0].id})`); }
    if (ranked && ranked !== d.notes.length) err(`${dw}: rank 는 모든 노트에 있거나 모두 없어야 해요(${ranked}/${d.notes.length})`);
    for (const n of d.notes) {
      const w = `${d.id}/${n && n.id}`;
      if (!n || !IDRE.test(n.id || '')) { err(`${w}: 노트 id 는 영어 소문자 · 숫자 · 하이픈`); continue; }
      if (ids.has(n.id)) err(`${w}: 노트 id 가 겹쳐요`); ids.add(n.id);
      if (isBlank(n)) continue;   // 빈 틀은 위에서 한 줄로 알렸어요
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
      // forms 는 예문에서 그 낱말을 굵게 보여 주는 데만 써요 → 예문에 실제로 나온 모양만(안 나온 모양은 note 에). 단어 자신은 적지 않아요
      if (Array.isArray(n.forms) && Array.isArray(n.ex)) { const all = n.ex.map(e => (Array.isArray(e) && typeof e[0] === 'string' ? e[0] : '')).join(' \n ');
        for (const f of n.forms) { if (typeof f !== 'string' || !f.trim()) continue;
          const hit = /^[A-Za-z][A-Za-z' -]*$/.test(f) ? new RegExp('\\b' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(all) : all.toLowerCase().includes(f.toLowerCase());
          if (f.toLowerCase() === n.w.toLowerCase()) err(`${w}: forms 에 단어 자신(「${f}」)은 적지 않아요`); else if (!hit) err(`${w}: forms 의 「${f}」 가 예문에 없어요 — forms 에는 예문에 나온 모양만 적어요(다른 모양은 note 에)`); } }
      for (const k of ['note', 'say', 'pron']) if (n[k] !== undefined) text(w, n[k], k === 'note' ? 90 : 60, k);
      if (n.tpl !== undefined && (!Array.isArray(n.tpl) || !n.tpl.length || n.tpl.some(t => !TPL.includes(t)))) err(`${w}: tpl 은 ${TPL.join(' · ')} 중에서`);
      if (n.rank != null) { if (!Number.isInteger(n.rank) || n.rank <= lastRank) err(`${w}: rank(순위)는 앞 노트(${lastRank})보다 큰 정수여야 해요 — 순위 순서대로 넣어요`); lastRank = n.rank; }
      const known = ['id', 'w', 'ko', 'ex', 'forms', 'note', 'say', 'pron', 'tpl', 'rank']; for (const k of Object.keys(n)) if (!known.includes(k)) err(`${w}: 모르는 칸 「${k}」 — 쓸 수 있는 칸: ${known.join(' ')}`);
    }
    const cards = D.cards(d.id); const by = {}; for (const c of cards) by[c.tpl] = (by[c.tpl] || 0) + 1;
    console.log(d.notes.length ? `✓ ${d.id}: 노트 ${d.notes.length} · 카드 ${cards.length} (${Object.entries(by).map(([t, n]) => `${D.TPL[t]} ${n}`).join(' · ')})${d.sample ? ' · 표본' : ''}` : `· ${d.id}: 준비 중(노트 0)`);
  }

  // ②-2 예문이 덱 안팎에서 글자까지 겹치지 않는지(같은 문장을 두 카드에서 외우지 않게 — 여럿이 나눠 쓴 파일을 합칠 때 생겨요)
  //      뜻이 둘 이상인데 예문이 하나뿐인 노트 수도 알려 줘요(에러는 아니에요 — 둘째 뜻 예문을 더할 수 있으면 더해요)
  { const seen = new Map(); let one = 0;
    for (const d of D.list) for (const n of d.notes) { if (!n || isBlank(n) || !Array.isArray(n.ex)) continue;
      if (Array.isArray(n.ko) && n.ko.length >= 2 && n.ex.length < 2) one++;
      for (const e of n.ex) { if (!Array.isArray(e) || typeof e[0] !== 'string') continue; const k = e[0].toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim(); const at = `${d.id}/${n.id}`;
        if (seen.has(k)) err(`예문이 겹쳐요: 「${e[0]}」 (${seen.get(k)} · ${at}) — 한쪽을 다른 문장으로 바꿔요`); else seen.set(k, at); } }
    console.log(`예문 ${seen.size}개 겹침 검사 · 뜻이 둘 이상인데 예문이 하나뿐인 노트 ${one}개`); }

  // ⑥ 듣기 덱(specs/vocab.md W2)
  { const L = D.byId.listen; let n6 = 0;
    if (L) for (const n of L.notes) { if (!n || isBlank(n)) continue; const w = `listen/${n.id}`; n6++;
      if (typeof n.pron !== 'string') err(`${w}: 듣기 덱 노트는 pron 이 있어야 해요(「pa-RAM-e-ter [퍼래미러]」 모양 — W2)`);
      else if (!/^[^\[\]]*[A-Z][^\[\]]* \[[^\[\]]*[가-힣][^\[\]]*\]$/.test(n.pron)) err(`${w}: pron 은 「강세 음절을 대문자로 쓴 철자 [한글 소리]」 모양이에요(지금 「${n.pron}」)`);
      const tpl = n.tpl || L.tpl;
      if (n.say !== undefined && !(tpl.includes('r') && tpl.includes('l'))) err(`${w}: say 가 있는 노트(기호 · 식 · 코드)는 tpl: ['r', 'l'] 이에요`);
      if (typeof n.w === 'string' && !/^[A-Za-z][A-Za-z' -]*[.?!]?$/.test(n.w) && n.say === undefined) err(`${w}: 낱말이 아닌 w 「${n.w}」 에는 강의에서 읽는 말(say)이 있어야 해요`);
      for (const e of n.ex || []) if (Array.isArray(e) && typeof e[0] === 'string' && e[0].split(/\s+/).filter(Boolean).length > 16) err(`${w}: 예문이 16낱말을 넘어요 「${e[0]}」`); }
    // W3: pron(소리 적기)은 듣기 덱에서만 · 개발 덱의 접사 노트(w 가 un- · -able 모양)는 품사 affix 와 예문 속 낱말(forms)
    for (const d of D.list) for (const n of d.notes) { if (!n || isBlank(n)) continue; const w = `${d.id}/${n.id}`;
      if (d.id !== 'listen' && n.pron !== undefined) err(`${w}: pron(소리 적기)은 듣기 덱에서만 써요(W2 · W3)`);
      if (d.id === 'dev' && typeof n.w === 'string' && /^[a-z]+-$|^-[a-z]+$/.test(n.w) && (!Array.isArray(n.ko) || !n.ko.some(k => Array.isArray(k) && k[0] === 'affix') || !Array.isArray(n.forms) || !n.forms.length)) err(`${w}: 접사 노트 「${n.w}」 는 품사 affix 와, 예문에 나온 낱말을 적은 forms 가 있어야 해요(W3)`); }
    if (L) console.log(`듣기 덱 규칙(W2): 노트 ${n6}개 — pron 모양 · say 와 카드 종류 · 예문 16낱말`); }
  // ⑦ 한 파일 안에서 같은 첫 두 낱말로 시작하는 예문은 12개까지(3절). 갈래를 섞어 합친 파일에서 한 문장 틀이 몰리지 않게
  { const by = new Map(); for (const d of D.list) for (const n of d.notes) { const f = fileOfNote.get(n); if (!f || !n || !Array.isArray(n.ex)) continue;
      for (const e of n.ex) { if (!Array.isArray(e) || typeof e[0] !== 'string') continue; const k = e[0].toLowerCase().replace(/[^a-z0-9' ]/g, ' ').trim().split(/\s+/).slice(0, 2).join(' '); const key = f + '\t' + k; by.set(key, (by.get(key) || 0) + 1); } }
    let top = 0; for (const [key, c] of by) { top = Math.max(top, c); if (c > 12) { const [f, k] = key.split('\t'); err(`decks/${f}: 「${k} …」 로 시작하는 예문이 ${c}개예요 — 한 파일에 12개까지(같은 문장 틀만 되풀이하지 않게, 3절)`); } }
    console.log(`예문 첫 두 낱말: 한 파일 안에서 가장 많이 겹친 것 ${top}개(12개까지)`); }

  // ⑤ 기초 덱과 차례표
  { const b = buildBaseOrder(); const tsv = path.join(ROOT, 'vocab/sources/base-order.tsv');
    if (!fs.existsSync(tsv) || fs.readFileSync(tsv, 'utf8') !== b.text) err('vocab/sources/base-order.tsv 가 원문 목록과 달라요 — node tools/vocab_base_order.mjs 로 다시 만들어요(손으로 고치지 않아요)');
    if (!fs.existsSync(path.join(ROOT, 'vocab/sources/README.md'))) err('vocab/sources/README.md(출처와 라이선스 표기)가 없어요');
    const base = D.byId.base; const byNo = new Map(b.rows.map(r => [r.no, r]));
    if (base && base.notes.length) {
      if (!/CC BY-SA 4\.0/.test(base.credit || '') || !/New General Service List/.test(base.credit || '')) err('덱 base: credit 에 목록 이름(New General Service List)과 라이선스(CC BY-SA 4.0)를 적어요 — 공개 목록의 조건이에요');
      const known = new Set(); for (const r of b.rows) { known.add(r.word.toLowerCase()); for (const f of r.forms.split(',')) if (f) known.add(f.toLowerCase()); }
      const inList = (t) => known.has(t) || t.split("'").every(p => !p || known.has(p));   // don't → don + t 처럼 줄임말은 조각마다
      let oneOut = 0;
      for (const n of base.notes) { const w = `base/${n.id}`; if (n.rank == null) { err(`${w}: 기초 덱의 노트에는 rank(차례표의 no)가 있어야 해요`); continue; } const r = byNo.get(n.rank); if (!r) err(`${w}: rank ${n.rank} 가 차례표에 없어요`); else if (r.id !== n.id || r.word !== n.w) err(`${w}: 차례표 ${n.rank}번은 id 「${r.id}」 · 단어 「${r.word}」 예요 — 노트의 id · w · rank 를 차례표 그대로 써요`);
        const f = fileOfNote.get(n) || ''; const m = /^base-(\d{4})\.js$/.exec(f); if (!m || (+m[1] - 1) % FILE_SIZE !== 0 || n.rank < +m[1] || n.rank > +m[1] + FILE_SIZE - 1) err(`${w}: 차례 ${n.rank} 의 노트가 ${f} 에 있어요 — 기초 노트는 제 차례의 파일에 둬요(node tools/vocab_base_order.mjs --status 가 파일과 범위를 보여 줘요)`);
        if (isBlank(n) || !Array.isArray(n.ex)) continue;
        n.ex.forEach((e, i) => { if (!Array.isArray(e) || typeof e[0] !== 'string') return; const toks = e[0].match(/[A-Za-z]+(?:'[A-Za-z]+)*/g) || []; const own = new Set([n.w, ...(n.forms || [])].map(x => String(x).toLowerCase()));
          const out = toks.filter((t, k) => !(k > 0 && /^[A-Z]/.test(t) && t !== 'I') /* 문장 가운데의 대문자 낱말은 이름으로 봐요 */).map(t => t.toLowerCase()).filter(t => !own.has(t) && !inList(t));
          if (toks.length > 14) err(`${w}: 예문 ${i + 1} 이 ${toks.length}낱말이에요 — 14낱말까지(짧고 쉬운 문장으로)`);
          if (out.length >= 2) err(`${w}: 예문 ${i + 1} 에 차례표 밖 낱말이 ${out.length}개예요(${out.join(', ')}) — 쉬운 낱말로 바꿔요(예문마다 1개까지)`); else if (out.length) oneOut++; }); }
      console.log(`기초 예문: 차례표 밖 낱말이 하나 든 예문 ${oneOut}개(예문마다 1개까지 허용)`);
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
  // ④-2 지시서의 「어려운 경우 본보기」: 덱에 이미 든 노트와 글자까지 같은지(지시서와 덱이 따로 놀지 않게), 아직 없는 줄도 차례표 · forms 규칙에 맞는지
  { const m = /### 어려운 경우 본보기[\s\S]*?```js\n([\s\S]*?)```/.exec(spec); let list = null;
    if (m) { try { list = vm.runInNewContext('[' + m[1] + ']'); } catch (e) { err('specs/vocab.md: 「어려운 경우 본보기」 의 js 블록을 읽지 못했어요: ' + e.message); } } else err('specs/vocab.md: 「어려운 경우 본보기」 의 js 블록이 없어요');
    const J = (n) => JSON.stringify(Object.keys(n).sort().map(k => [k, n[k]])); const baseNotes = new Map(((D.byId.base || {}).notes || []).map(n => [n.id, n])); const order = new Map(buildBaseOrder().rows.map(r => [r.no, r]));
    for (const e of list || []) { const w = `specs/vocab.md 본보기 「${e && e.id}」`; const r = order.get(e.rank);
      if (!r || r.id !== e.id || r.word !== e.w) { err(`${w}: id · w · rank 가 차례표와 달라요`); continue; }
      const n = baseNotes.get(e.id); if (n && J(n) !== J(e)) err(`${w}: 덱에 든 노트와 달라요 — 한쪽을 고쳤으면 다른 쪽도 같이 고쳐요`);
      const all = (e.ex || []).map(x => x[0]).join(' \n '); for (const f of e.forms || []) if (!new RegExp('\\b' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i').test(all)) err(`${w}: forms 의 「${f}」 가 예문에 없어요`); }
    if (list) console.log(`지시서 본보기 ${list.length}줄: 덱에 든 ${list.filter(e => baseNotes.has(e.id)).length}줄과 같음`); }
  // ④-3 상태 문장(LESSON.md R15 두 번째): 기초 덱을 다 채운 뒤에도 TODO · 지시서 0절에 「채우는 중」 이 남았어요.
  //      지시서 덱 표의 상태 칸, HANDOFF · TODO 0절 「영어 단어장」 줄의 「덱 이름 N개」 를 실제 덱과 대조해요
  { const filling = D.list.filter(d => d.sample).map(d => d.id); const fmt = (x) => x.toLocaleString('en-US');
    for (const m of spec.matchAll(/^\| `([a-z0-9-]+)` \|[^|\n]*\| \d+ \|([^|\n]*)\|/gm)) { const d = D.byId[m[1]]; if (!d) continue;
      const st = m[2].trim(); const n = counts[m[1]] || 0;
      if (!n && !st.startsWith('준비 중')) err(`specs/vocab.md: 덱 표 \`${m[1]}\` 줄 — 노트가 없으니 상태가 「준비 중」 으로 시작해요(지금 「${st}」)`);
      if (n && !d.sample && !st.startsWith('다 채웠어요')) err(`specs/vocab.md: 덱 표 \`${m[1]}\` 줄 — 다 채운 덱(덱 정의에 sample 없음)이니 상태가 「다 채웠어요」 로 시작해요(지금 「${st}」)`);
      if (d.sample && st.startsWith('다 채웠어요')) err(`specs/vocab.md: 덱 표 \`${m[1]}\` 줄 — 상태가 「다 채웠어요」 인데 덱 정의에 sample 이 남아 있어요. 다 채웠으면 sample 을 지워요`); }
    const sec0 = spec.split(/^## 1\./m)[0].split(/^## 0\./m)[1];
    if (sec0 === undefined) err('specs/vocab.md: 0절(「## 0.」)을 못 찾았어요');
    else if (!filling.length && sec0.includes('채우는 중')) err('specs/vocab.md 0절: 채우는 중인 덱(덱 정의에 sample)이 없는데 「채우는 중」 이 남아 있어요');
    for (const f of ['HANDOFF.md', 'TODO.md']) { const line = (read(f).match(/^\| 영어 단어장[^|\n]*\|([^\n]*)\|[ \t]*$/m) || [])[1];
      if (line === undefined) { err(`${f}: 0절의 「| 영어 단어장 … | … |」 줄을 못 찾았어요`); continue; }
      for (const d of D.list) if (counts[d.id] && !line.includes(`${d.name} ${fmt(counts[d.id])}개`)) err(`${f}: 0절 「영어 단어장」 줄에 「${d.name} ${fmt(counts[d.id])}개」 가 없어요 — 덱을 채우면 이 줄도 같은 PR 에서 고쳐요`);
      if (!filling.length && line.includes('채우는 중')) err(`${f}: 0절 「영어 단어장」 줄에 「채우는 중」 이 남아 있어요 — 채우는 중인 덱(덱 정의에 sample)이 없어요`); }
    console.log(`상태 문장: 지시서 덱 표의 상태 칸 · HANDOFF · TODO 0절 「영어 단어장」 줄 대조(채우는 중인 덱: ${filling.length ? filling.join(', ') : '없음'})`); }
  console.log(`덱 ${D.list.length}개 · 노트 ${Object.values(counts).reduce((a, b) => a + b, 0)}개`);
} catch (e) { err('검사하다 멈췄어요: ' + (e && e.stack || e)); }
if (errors.length) { console.error(`✗ check_vocab 에러 ${errors.length}개`); errors.slice(0, 60).forEach(e => console.error('  ' + e)); if (errors.length > 60) console.error(`  … 외 ${errors.length - 60}개`); process.exit(1); }
console.log('✓ check_vocab OK');
