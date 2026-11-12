#!/usr/bin/env node
// tools/test_vocab.mjs — 영어 단어장 코어 단위 검사(브라우저 없이 Node 로). 쓰기: node tools/test_vocab.mjs
//   보는 것: 간격 계산(vocab/fsrs.js) · 기록 문자열과 재생 · 하루 경계 · 오늘 볼 카드 고르기와 한도(vocab/core.js)
//           · 두 기기 기록 합치기(core/sync.js) · 저장과 캐시 · 허브 카드 요약(core/hub.js)
//   하나라도 틀리면 exit 1. 화면은 tools/regress.py 의 [영어 단어장] 절이 봐요. 설계: specs/vocab.md
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm';
import { ROOT } from './load_content.mjs';
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
let pass = 0; const fails = [];
const ok = (cond, msg) => { if (cond) pass++; else { fails.push(msg); console.log('  ✗ ' + msg); } };
const eq = (a, b, msg) => ok(JSON.stringify(a) === JSON.stringify(b), `${msg} — 나온 값 ${JSON.stringify(a)} ≠ 기대 ${JSON.stringify(b)}`);
const near = (a, b, msg, tol = 1e-7) => ok(Math.abs(a - b) <= tol, `${msg} — 나온 값 ${a} ≠ 기대 ${b}`);
const section = (name) => console.log(`[${name}]`);

// 브라우저 대신: localStorage · window 흉내 + 사이트 파일을 한 덩어리로 읽기. decksSrc 를 주면 진짜 덱 대신 그 덱으로
const REAL_DECKS = ['vocab/decks/index.js', ...fs.readdirSync(path.join(ROOT, 'vocab/decks')).filter(f => f.endsWith('.js') && f !== 'index.js').sort().map(f => 'vocab/decks/' + f)].map(read).join('\n');
function world(decksSrc = REAL_DECKS, mem = new Map()) {
  const events = [];
  const ctx = { console, localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => { mem.set(k, String(v)); }, removeItem: (k) => { mem.delete(k); } }, window: { addEventListener() {}, dispatchEvent(e) { events.push(e.type); } }, CustomEvent: function (type) { this.type = type; } };
  vm.createContext(ctx);
  const store = 'var Store = { _get(k) { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; }, _set(k, v) { localStorage.setItem(k, JSON.stringify(v)); } };';
  vm.runInContext([store, read('core/sync.js'), read('core/hub.js'), read('vocab/fsrs.js'), read('vocab/core.js'), decksSrc, ';this.__o = { Sync, Hub, Fsrs, VocabDecks, VocabCore };'].join('\n'), ctx, { filename: 'vocab-bundle.js' });
  return Object.assign(ctx.__o, { mem, events });
}
const MIN = 60000, DAY = 86400000;
const T0 = Date.UTC(2026, 10, 12, 1, 0, 0);   // 2026-11-12 10:00 한국 시간
const KST = { tz: 540, roll: 4 };
const start = (decksSrc, mem) => { const w = world(decksSrc, mem); w.VocabCore.load(); w.VocabCore.setCfg(KST, T0 - 1000); return w; };
const deck = (id, n, extra = '') => `VocabDecks.add({ id: '${id}', name: '${id}', newPerDay: 10${extra} }); VocabDecks.notes('${id}', Array.from({ length: ${n} }, (_, i) => ({ id: 'w' + i, w: 'word' + i, ko: [['n', '낱말']], ex: [['A word' + i + ' here.', '낱말이에요.']] })));`;
// 한 장을 「알맞음 → 10분 뒤 알맞음」 으로 졸업시키기
const graduate = (C, ses, id, t) => { C.answer(ses, id, 3, t); C.answer(ses, id, 3, t + 10 * MIN); };

// ---------------------------------------------------------------- 간격 계산
section('간격 계산 FSRS-6');
{
  const { Fsrs } = world('');
  const W = Fsrs.DEFAULT_W; const e = Fsrs.make({}); const r8 = (x) => Math.round(x * 1e8) / 1e8;
  eq(W.length, 21, '기본 매개변수 21개');
  near(e.recall(10, 10), 0.9, '안정도만큼 날이 지나면 기억할 확률 0.9');
  ok(e.recall(1, 10) > e.recall(5, 10) && e.recall(5, 10) > e.recall(30, 10), '날이 지날수록 기억할 확률이 내려감');
  near(e.params.modifier, 1, '목표 기억률 0.9 → 간격 = 안정도');
  const p = e.preview(null, T0);
  eq([1, 2, 3, 4].map(g => p[g].state), [1, 1, 1, 2], '새 카드: 다시 · 어려움 · 알맞음은 학습 중, 쉬움은 바로 복습 카드');
  eq([1, 2, 3].map(g => (p[g].due - T0) / MIN), [1, 6, 10], '새 카드 학습 단계: 다시 1분 · 어려움 6분 · 알맞음 10분');
  eq([1, 2, 3, 4].map(g => p[g].step), [0, 0, 1, 0], '알맞음만 다음 단계로');
  eq([1, 2, 3, 4].map(g => p[g].s), [W[0], W[1], W[2], W[3]], '처음 안정도 = w0~w3');
  eq([1, 2, 3, 4].map(g => p[g].d), [1, 2, 3, 4].map(g => Math.min(10, Math.max(1, r8(W[4] - Math.exp((g - 1) * W[5]) + 1)))), '처음 난이도 공식 w4 − e^((g−1)·w5) + 1');
  eq([p[4].sd, (p[4].due - T0) / DAY], [8, 8], '새 카드 쉬움 = 8일 뒤(안정도 8.2956 반올림)');
  eq([1, 2, 3, 4].map(g => [p[g].reps, p[g].lapses, p[g].last]), [1, 2, 3, 4].map(() => [1, 0, T0]), '누른 횟수 1 · 틀린 횟수 0 · 마지막 시각');
  // 졸업: 알맞음 → 10분 뒤 알맞음
  const g1 = p[3]; const g2 = e.next(g1, g1.due, 3);
  eq([g2.state, g2.step, g2.reps], [2, 0, 2], '알맞음 두 번이면 복습 카드로 졸업');
  near(g2.s, r8(W[2] * Math.max(1, Math.pow(W[2], -W[19]) * Math.exp(W[17] * W[18]))), '같은 날 다시 본 안정도 공식');
  eq([g2.sd, g2.due - g1.due], [Math.max(1, Math.round(g2.s)), Math.max(1, Math.round(g2.s)) * DAY], '졸업 간격 = 안정도 반올림, 다음 시각 = 지금 + 간격');
  // 제때 알맞음을 누르면 간격이 늘어남
  let c = g2; let grows = true, ordered = true; const seq = [];
  for (let i = 0; i < 8; i++) { const q = e.preview(c, c.due); if (!(q[2].sd <= q[3].sd && q[3].sd < q[4].sd)) ordered = false; if (q[3].sd <= c.sd) grows = false; seq.push(q[3].sd); c = q[3]; }
  ok(grows, '제때 알맞음을 누르면 간격이 계속 늘어남: ' + seq.join(' → '));
  ok(ordered, '같은 카드에서 어려움 ≤ 알맞음 < 쉬움');
  // 복습에서 틀림
  const lap = e.next(c, c.due, 1);
  eq([lap.state, (lap.due - c.due) / MIN, lap.lapses, lap.sd], [3, 10, 1, 0], '복습에서 다시 → 다시 학습 · 10분 뒤 · 틀린 횟수 +1');
  ok(lap.s < c.s && lap.d > c.d, '틀리면 안정도는 줄고 난이도는 오름');
  const back = e.next(lap, lap.due, 3);
  ok(back.state === 2 && back.sd >= 1 && back.sd < c.sd, `다시 학습을 마치면 복습 카드로, 간격은 틀리기 전(${c.sd}일)보다 짧게(${back.sd}일)`);
  eq((e.next(lap, lap.due, 2).due - lap.due) / MIN, 15, '다시 학습 중 어려움 = 단계의 1.5배(15분)');
  // 늦게 복습하면(밀린 카드) 제때 한 것보다 안정도가 더 크게 늘어남
  ok(e.next(g2, g2.due + 20 * DAY, 3).s > e.next(g2, g2.due, 3).s, '밀렸는데도 맞히면 더 크게 늘어남');
  // 「어려움」 방식 둘
  const s1 = e.next(null, T0, 3);
  eq([(e.next(s1, s1.due, 2).due - s1.due) / MIN, e.next(s1, s1.due, 2).step], [10, 1], '둘째 단계에서 어려움 = 그 단계(10분)를 되풀이(Anki 방식)');
  eq((Fsrs.make({ hardStyle: 'tsfsrs' }).next(s1, s1.due, 2).due - s1.due) / MIN, 6, '원본(ts-fsrs) 방식은 늘 6분');
  eq([(e.next(s1, s1.due, 1).due - s1.due) / MIN, e.next(s1, s1.due, 1).step], [1, 0], '학습 중 다시 = 첫 단계(1분)로');
  // 흩뜨리기
  const ef = Fsrs.make({ fuzz: true });
  eq(ef.preview(c, c.due), ef.preview(c, c.due), '흩뜨리기는 같은 입력에 늘 같은 결과(기록 재생이 가능)');
  let inRange = true; const spread = new Set();
  for (let i = 0; i < 400; i++) {
    const s = 3 + i * 0.7; const base = e.interval(s, 0, 'x'); const f = ef.interval(s, 0, 'seed' + i);
    const delta = 1 + 0.15 * Math.max(Math.min(base, 7) - 2.5, 0) + 0.1 * Math.max(Math.min(base, 20) - 7, 0) + 0.05 * Math.max(base - 20, 0);
    if (f < Math.max(2, Math.round(base - delta)) || f > Math.round(base + delta)) inRange = false;
    if (base === 100) spread.add(ef.interval(s, 0, 'k' + i));
  }
  ok(inRange, '흩뜨린 간격은 정해진 범위 안');
  const many = new Set(); for (let i = 0; i < 60; i++) many.add(ef.interval(100, 0, 'seed' + i));
  ok(many.size >= 5 && Math.min(...many) >= 93 && Math.max(...many) <= 107, `100일 간격은 씨앗에 따라 93~107일로 흩어짐(${[...many].sort((a, b) => a - b).join(',')})`);
  eq([ef.interval(1.4, 0, 'a'), ef.interval(2.2, 0, 'b')], [1, 2], '2.5일 미만은 흩뜨리지 않음');
  // 하루 번호로 지난 날을 셈
  const eDay = Fsrs.make({ dayOf: (ms) => Math.floor((ms + 540 * MIN - 4 * 3600000) / DAY) });
  const late = eDay.next(null, Date.UTC(2026, 10, 12, 18, 50), 3);   // 한국 03:50
  ok(eDay.next(late, late.due, 3).s !== e.next(late, late.due, 3).s, '새벽 4시를 넘기면 「다음 날」 로 계산(같은 날 공식이 아님)');
  let threw = false; try { e.next(null, T0, 5); } catch (x) { threw = true; } ok(threw, '없는 버튼은 에러');
}

// ---------------------------------------------------------------- 기록 문자열 · 하루
section('기록 문자열 · 하루 경계');
{
  const { VocabCore: C } = start();
  eq(C.parse(C.enc(123456) + '3' + C.enc(123999) + 's'), [[123456, '3'], [123999, 's']], '사건 = 시각 6글자 + 종류 1글자');
  ok(C.abs(C.rel(T0)) === T0 && C.rel(T0) > 0, '시각 왕복');
  let a = C.append('', 100, '3'); a = C.append(a.str, 100, '4');
  eq(C.parse(a.str).map(x => x[0]), [100, 101], '같은 초에 또 누르면 1초 뒤로');
  a = C.append(a.str, 50, '1');
  eq(C.parse(a.str).map(x => x[0]), [100, 101, 102], '시계가 뒤로 가도 순서를 지킴');
  eq(C.parse(C.voidAt(a.str, 101)).map(x => x[1]), ['3', '0', '1'], '되돌리기는 그 사건만 무효(0)로');
  eq(C.voidAt(a.str, 999), a.str, '없는 시각은 그대로');
  eq(C.hash('abc'), C.hash('abc'), '해시는 같은 글자에 같은 값'); ok(C.hash(a.str) !== C.hash(C.voidAt(a.str, 101)), '되돌리면 해시가 달라짐');
  const d1 = C.day(Date.UTC(2026, 10, 12, 18, 59, 59)), d2 = C.day(Date.UTC(2026, 10, 12, 19, 0, 0));
  eq(d2 - d1, 1, '한국 시간 새벽 4시에 하루가 바뀜');
  eq(C.dayStart(d2), Date.UTC(2026, 10, 12, 19, 0, 0), '하루의 시작 시각');
  eq([C.daysLabel(1), C.daysLabel(29), C.daysLabel(45), C.daysLabel(400)], ['1일', '29일', '1.5개월', '1.1년'], '간격 글자');
}

// ---------------------------------------------------------------- 고르기 (진짜 덱: 기초 10장)
section('오늘 볼 카드 — 기초 덱 표본');
{
  const { VocabCore: C, VocabDecks: D, Hub } = start();
  const base = D.byId.base; const n = base.notes.length; const lim = Math.min(n, base.newPerDay);
  const ses = C.session(['base']); let t = T0; let p = C.pick(ses, t);
  eq(p.counts, { new: lim, learn: 0, rev: 0 }, '첫날: 새 카드 = 하루 한도');
  eq([p.kind, p.card.id], ['new', `base/${base.notes[0].id}/r`], '새 카드는 덱에 적힌 순서대로');
  const lab = C.preview(p.card.id, t);
  eq([lab[1], lab[2], lab[3]], ['<1분', '<6분', '<10분'], '새 카드의 버튼 글자: 다시 · 어려움 · 알맞음');
  ok(/^\d+일$/.test(lab[4]) && parseInt(lab[4], 10) >= 6 && parseInt(lab[4], 10) <= 10, `새 카드 쉬움 = 8일을 6~10일로 흩뜨린 값(${lab[4]})`);
  const order = [];
  for (let i = 0; i < lim; i++) { p = C.pick(ses, t); order.push(p.card.note.id); C.answer(ses, p.card.id, 3, t); t += 5000; }
  eq(order, base.notes.slice(0, lim).map(x => x.id), '한도만큼 새 카드를 차례로');
  p = C.pick(ses, t);
  eq([p.kind, p.counts], ['learn', { new: 0, learn: lim, rev: 0 }], '새 카드가 끝나면 10분이 안 됐어도 학습 카드를 미리 보여 줌(20분 안)');
  eq(p.card.note.id, base.notes[0].id, '먼저 누른 카드부터');
  for (let i = 0; i < lim; i++) { p = C.pick(ses, t); C.answer(ses, p.card.id, 3, t); t += 5000; }
  p = C.pick(ses, t);
  eq([p.card, p.wait, p.counts], [null, 0, { new: 0, learn: 0, rev: 0 }], '모두 졸업하면 오늘은 끝');
  eq(ses.done, lim * 2, '누른 횟수');
  const sum = C.summary(t);
  eq([sum.decks.base.total, sum.decks.base.unseen, sum.decks.base.intro], [n, n - lim, lim], '요약: 전체 · 안 본 카드 · 오늘 배운 카드');
  eq(Hub.vocabToday(sum, t), { new: 0, learn: 0, rev: 0, total: n, seen: lim }, '허브 요약(오늘): 할 카드 없음');
  // 다음 복습 날
  const firstDue = Math.min(...Object.keys(sum.decks.base.due).map(Number));
  const at = C.dayStart(firstDue) + 6 * 3600000;   // 그날 오전 10시
  const sc = C.scan(['base'], at);
  ok(sc.review.length > 0 && sc.counts.learn === 0, `복습 날이 되면 복습 카드가 나옴(${sc.review.length}장)`);
  eq(Hub.vocabToday(sum, at).rev, sc.counts.rev, '허브 요약(나중 날) = 실제 훑은 수');
  eq(Hub.vocabToday(sum, at).new, sc.counts.new, '허브 요약의 새 카드 수 = 실제 훑은 수');
  const rv = C.pick(C.session(['base']), at);
  eq(rv.kind, n > lim ? rv.kind : 'rev', '복습 카드를 고름');
  ok(/일$/.test(C.preview(sc.review[0].id, at)[3]) && /^<10분$/.test(C.preview(sc.review[0].id, at)[1]), '복습 카드의 버튼 글자: 다시 <10분 · 알맞음 n일');
}

// ---------------------------------------------------------------- 한도 · 섞기 · 형제 · 되돌리기
section('한도 · 섞기 · 형제 카드 · 되돌리기 · 표시');
{
  // 하루 새 카드 한도와 「더 하기」
  let w = start(deck('big', 40)); let C = w.VocabCore; let ses = C.session(['big']); let t = T0;
  for (let i = 0; i < 10; i++) { const p = C.pick(ses, t); graduate(C, ses, p.card.id, t); t += 1000; }
  t += 11 * MIN; let p = C.pick(ses, t);
  eq([p.card, p.moreNew], [null, 30], '한도 10장을 채우면 새 카드는 더 안 나옴(남은 30장)');
  C.addExtra(['big'], 5, t); eq(C.scan(['big'], t).counts.new, 5, '오늘만 5장 더');
  eq(w.Hub.vocabToday(C.summary(t), t).new, 5, '허브 요약도 더 한 5장을 셈');
  const nextDay = C.dayStart(C.day(t) + 1) + 3600000;
  eq(C.scan(['big'], nextDay).counts.new, 10, '다음 날에는 다시 한도만큼(더 하기는 그날만)');
  eq(w.Hub.vocabToday(C.summary(t), nextDay).new, 10, '허브 요약도 다음 날 한도를 다시 셈');
  C.setCfg({ newPerDay: { big: 3 } }, t); eq(C.scan(['big'], nextDay).counts.new, 3, '설정에서 덱별 하루 새 카드 수를 바꿈');
  // 복습과 새 카드 섞기
  w = start(deck('mix', 40)); C = w.VocabCore; ses = C.session(['mix']); t = T0;
  for (let i = 0; i < 10; i++) { const q = C.pick(ses, t); graduate(C, ses, q.card.id, t); t += 1000; }
  const dueDay = Math.max(...Object.values(C.recs).map(r => C.day(r.due))); t = C.dayStart(dueDay) + 6 * 3600000;
  ses = C.session(['mix']); const sc = C.scan(['mix'], t);
  eq([sc.counts.new, sc.counts.rev], [10, 10], '복습 날: 새 카드 10 · 복습 10');
  const kinds = []; for (let i = 0; i < 6; i++) { const q = C.pick(ses, t); kinds.push(q.kind); C.answer(ses, q.card.id, 3, t); t += 2000; }
  eq(kinds, ['rev', 'new', 'rev', 'new', 'rev', 'new'], '복습과 새 카드를 고르게 섞음');
  // 하루 복습 상한
  C.setCfg({ maxRev: 4 }, t); eq(C.scan(['mix'], t).counts.rev, 1, '하루 복습 상한 4장 중 3장을 했으면 1장 남음');
  // 형제 카드(같은 노트의 읽기 · 듣기)는 같은 날 겹쳐 내지 않음
  w = start(deck('sib', 3, ", tpl: ['r', 'l']")); C = w.VocabCore; ses = C.session(['sib']); t = T0;
  eq(C.scan(['sib'], t).fresh.map(c => c.id), ['sib/w0/r', 'sib/w1/r', 'sib/w2/r'], '새 카드는 노트마다 한 장씩만');
  graduate(C, ses, 'sib/w0/r', t);
  ok(!C.scan(['sib'], t + 11 * MIN).fresh.some(c => c.id === 'sib/w0/l'), '읽기 카드를 본 날에는 그 노트의 듣기 카드를 꺼내지 않음');
  ok(C.scan(['sib'], C.dayStart(C.day(t) + 1) + 3600000).fresh.some(c => c.id === 'sib/w0/l'), '다음 날에는 듣기 카드가 새 카드로');
  // 되돌리기
  w = start(deck('u', 5)); C = w.VocabCore; ses = C.session(['u']); t = T0;
  C.answer(ses, 'u/w0/r', 3, t); const before = JSON.stringify(C.recs['u/w0/r']); C.answer(ses, 'u/w0/r', 1, t + 60000);
  eq(C.undo(ses, t + 61000), 'u/w0/r', '되돌리기는 마지막에 누른 카드를 돌려줌');
  eq([JSON.stringify(Object.assign({}, C.recs['u/w0/r'], { h: 0 })) === JSON.stringify(Object.assign(JSON.parse(before), { h: 0 })), ses.done], [true, 1], '되돌리면 그 전 상태 그대로');
  eq(C.parse(C.data.log['u/w0/r']).map(x => x[1]), ['3', '0'], '기록에는 무효 표시로 남음');
  C.undo(ses, t + 62000); eq([C.kindOf('u/w0/r'), ses.done, C.undo(ses, t)], ['new', 0, null], '끝까지 되돌리면 새 카드 · 더 되돌릴 것 없음');
  // 아는 단어로 넘기기 · 풀기 · 처음부터 다시
  C.mark(ses, ['u/w1/r'], 's', t);
  ok(!C.scan(['u'], t).fresh.some(c => c.id === 'u/w1/r') && C.summary(t).decks.u.known === 1, '아는 단어로 넘기면 안 나오고 요약에 1장');
  C.undo(ses, t + 1000); ok(C.scan(['u'], t).fresh.some(c => c.id === 'u/w1/r'), '넘기기도 되돌릴 수 있음');
  C.mark(null, ['u/w1/r'], 's', t + 2000); C.mark(null, ['u/w1/r'], 'u', t + 3000); ok(C.scan(['u'], t).fresh.some(c => c.id === 'u/w1/r'), '넘김 풀기');
  graduate(C, ses, 'u/w2/r', t); C.mark(null, ['u/w2/r'], 'f', t + 20 * MIN);
  eq([C.recs['u/w2/r'].st, C.recs['u/w2/r'].intro, C.kindOf('u/w2/r')], [0, 0, 'new'], '처음부터 다시 = 새 카드로');
  // 저장한 상태 = 기록을 처음부터 다시 계산한 상태
  ok(Object.keys(C.recs).every(id => JSON.stringify(C.recs[id]) === JSON.stringify(C.replay(C.data.log[id]))), '상태는 언제나 기록을 다시 계산한 값과 같음');
  // 전체 초기화
  C.resetAll(t + 30 * MIN); eq([Object.keys(C.data.log).length, Object.keys(C.recs).length, C.data.resetAt], [0, 0, C.rel(t + 30 * MIN)], '기록 초기화');
  ok(C.append('', C.data.resetAt, '3').t > C.data.resetAt, '초기화 뒤의 사건은 초기화 시각보다 뒤');
}

// ---------------------------------------------------------------- 두 기기 기록 합치기
section('기록 합치기(기기 연동)');
{
  const { Sync: S, VocabCore: C, mem, events } = start(deck('m', 5));
  const E = (t, c) => C.enc(t) + c;
  eq(S.mergeVocabLog(E(1, '3') + E(5, '3'), E(1, '3') + E(9, '4')), E(1, '3') + E(5, '3') + E(9, '4'), '사건의 합집합을 시각 순으로');
  eq(S.mergeVocabLog(E(1, '3') + E(5, '3'), E(1, '3') + E(5, '0')), E(1, '3') + E(5, '0'), '같은 시각이면 되돌림(0)이 이김');
  eq(S.mergeVocabLog(E(1, '3') + E(5, '3'), E(9, '4'), 5), E(9, '4'), '초기화 시각 이전 사건은 버림');
  eq([S.mergeVocabLog('', ''), S.mergeVocabLog(undefined, E(1, '3')), S.mergeVocabLog(E(1, '3'), undefined)], ['', E(1, '3'), E(1, '3')], '빈 기록');
  // 무작위 기록으로: 순서 · 묶는 차례 · 횟수와 무관
  let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  let law = true;
  for (let k = 0; k < 200; k++) {
    const pool = Array.from({ length: 12 }, (_, i) => [i * 3 + 1, '1234'[Math.floor(rnd() * 4)]]);
    const mk = () => pool.filter(() => rnd() < 0.6).map(([t, c]) => E(t, rnd() < 0.15 ? '0' : c)).join('');
    const a = mk(), b = mk(), c = mk();
    if (S.mergeVocabLog(a, b) !== S.mergeVocabLog(b, a)) law = false;
    if (S.mergeVocabLog(S.mergeVocabLog(a, b), c) !== S.mergeVocabLog(a, S.mergeVocabLog(b, c))) law = false;
    if (S.mergeVocabLog(a, a) !== a || S.mergeVocabLog(S.mergeVocabLog(a, b), b) !== S.mergeVocabLog(a, b)) law = false;
  }
  ok(law, '합치기는 어느 쪽부터 · 몇 번을 해도 같은 결과(무작위 200번)');
  const A = { v: 1, mt: 10, resetAt: 0, cfg: { t: 5, maxRev: 100 }, log: { x: E(1, '3'), y: E(2, '3') } };
  const B = { v: 1, mt: 20, resetAt: 0, cfg: { t: 9, maxRev: 50 }, log: { x: E(1, '3') + E(7, '4'), z: E(3, '1') } };
  const M = S.mergeVocab(A, B);
  eq([M.mt, M.cfg.maxRev, Object.keys(M.log).sort(), M.log.x], [20, 50, ['x', 'y', 'z'], E(1, '3') + E(7, '4')], '조각 합치기: 설정은 최근 쪽 · 기록은 카드마다 합집합');
  eq(JSON.stringify(S.mergeVocab(B, A).log) === JSON.stringify(M.log) && S.mergeVocab(B, A).cfg.maxRev === 50, true, '조각 합치기도 순서와 무관');
  eq(Object.keys(S.mergeVocab(Object.assign({}, A, { resetAt: 2 }), B).log).sort(), ['x', 'z'], '한쪽에서 초기화했으면 그 전 사건은 양쪽에서 버림');
  eq([S.mergeVocab(null, B), S.mergeVocab(A, null), S.mergeVocab(null, null)], [B, A, null], '한쪽이 비었으면 다른 쪽');
  // 내려받은 조각을 로컬에 반영
  const ses = C.session(['m']); graduate(C, ses, 'm/w0/r', T0);
  const local = JSON.parse(mem.get('academy.vocab')); const remote = { v: 1, mt: local.mt - 5, resetAt: 0, cfg: local.cfg, log: { 'm/w1/r': E(C.rel(T0), '4') } };
  eq(S.applyVocab(remote), true, '다른 기기의 새 기록이 있으면 바뀜');
  const merged = JSON.parse(mem.get('academy.vocab'));
  eq([Object.keys(merged.log).sort(), merged.mt > local.mt], [['m/w0/r', 'm/w1/r'], true], '양쪽 기록이 다 남고, 로컬만 가진 것도 있었으니 새 도장');
  eq([JSON.parse(mem.get('academy.vocab.cache')).stale, events.includes('academy:vocab')], [1, true], '상태 캐시에 낡음 표시 + 단어장 페이지에 알림');
  eq(S.applyVocab(remote), false, '같은 것을 또 받으면 바뀌지 않음');
  eq(S.applyVocab(null), false, '단어장 조각이 없는 옛 데이터는 건너뜀');
  eq(S.vocabMt(), merged.mt, '바뀐 시각 도장');
  C.load(); eq([C.kindOf('m/w0/r'), C.kindOf('m/w1/r')], ['rev', 'rev'], '다시 읽으면 합친 기록대로(쉬움 = 바로 복습 카드)');
}

// ---------------------------------------------------------------- 저장 · 캐시
section('저장 · 캐시');
{
  const mem = new Map(); let w = start(deck('s', 6), mem); let C = w.VocabCore; const ses = C.session(['s']);
  graduate(C, ses, 's/w0/r', T0); C.answer(ses, 's/w1/r', 1, T0 + 1000); C.mark(ses, ['s/w2/r'], 's', T0 + 2000);
  const snap = JSON.stringify(C.recs); const saved = JSON.parse(mem.get('academy.vocab'));
  eq([saved.v, Object.keys(saved.log).length, saved.cfg.tz, saved.cfg.roll], [1, 3, 540, 4], '연동되는 조각: 기록 · 설정');
  ok(Object.values(saved.log).every(s => s.length % 7 === 0 && /^[0-9a-z]+$/.test(s)), '기록은 7글자 단위의 숫자 · 소문자');
  w = world(deck('s', 6), mem); C = w.VocabCore; let replays = 0; const orig = C.replay; C.replay = function (s) { replays++; return orig.call(this, s); }; C.load();
  eq([JSON.stringify(C.recs) === snap, replays], [true, 0], '다시 열면 캐시에서 같은 상태(다시 계산 0번)');
  const cache = JSON.parse(mem.get('academy.vocab.cache')); cache.sig = 'old'; mem.set('academy.vocab.cache', JSON.stringify(cache));
  w = world(deck('s', 6), mem); C = w.VocabCore; C.load(); eq(JSON.stringify(C.recs) === snap, true, '계산 규칙 표시가 다르면 캐시를 버리고 기록에서 다시 계산 — 결과는 같음');
  mem.delete('academy.vocab.cache'); w = world(deck('s', 6), mem); C = w.VocabCore; C.load(); eq(JSON.stringify(C.recs) === snap, true, '캐시가 없어도 기록만으로 복원');
  // 덱에서 사라진 카드의 기록은 지우지 않고 보관
  w = world(deck('s', 1), mem); C = w.VocabCore; C.load(); C.answer(null, 's/w0/r', 3, T0 + 5 * DAY);
  eq([Object.keys(C.recs), Object.keys(JSON.parse(mem.get('academy.vocab')).log).length], [['s/w0/r'], 3], '없어진 카드의 기록은 남겨 둠(덱에 다시 생기면 이어짐)');
  // 저장소가 꽉 찼을 때
  C.store = { get: () => null, set: () => { throw new Error('quota'); } }; eq(C.save(T0), false, '저장 실패를 알려 줌');
}

console.log(fails.length ? `✗ test_vocab 실패 ${fails.length}개 (통과 ${pass}개)` : `✓ test_vocab OK — ${pass}개 통과`);
process.exit(fails.length ? 1 : 0);
