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
  // v2.46.5: 카드가 있는 덱이 여럿이면 허브는 모두를 합쳐 세요 — 비교도 카드가 있는 모든 덱을 훑은 값으로(덱 수와 상관없게)
  const all = Object.keys(sum.decks).filter(id => sum.decks[id].total > 0);
  eq(C.scan(['base'], t).counts, { new: 0, learn: 0, rev: 0 }, '기초 덱: 오늘 할 카드 없음');
  const scT = C.scan(all, t);
  eq(Hub.vocabToday(sum, t), { new: scT.counts.new, learn: scT.counts.learn, rev: scT.counts.rev, total: all.reduce((a, id) => a + sum.decks[id].total, 0), seen: lim }, '허브 요약(오늘) = 모든 덱을 훑은 수 · 본 카드는 기초 덱에서 누른 만큼');
  // 다음 복습 날
  const firstDue = Math.min(...Object.keys(sum.decks.base.due).map(Number));
  const at = C.dayStart(firstDue) + 6 * 3600000;   // 그날 오전 10시
  const sc = C.scan(['base'], at);
  ok(sc.review.length > 0 && sc.counts.learn === 0, `복습 날이 되면 복습 카드가 나옴(${sc.review.length}장)`);
  const scAll = C.scan(all, at);
  eq(Hub.vocabToday(sum, at).rev, scAll.counts.rev, '허브 요약(나중 날) = 모든 덱을 실제 훑은 수');
  eq(Hub.vocabToday(sum, at).new, scAll.counts.new, '허브 요약의 새 카드 수 = 모든 덱을 실제 훑은 수');
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

section('하루 한도 정하기(v2.46.8 하루 한도 시트)');
{
  const w = start(deck('lim', 40) + deck('lim2', 6)); const C = w.VocabCore; let t = T0;
  ok(C.setNewLimit('lim', 3, t) === true, '하루 새 카드 정하기: 저장되면 true');
  eq([C.newLimit('lim'), C.data.cfg.newPerDay.lim, C.data.cfg.t], [3, 3, t], '덱 하나의 하루 새 카드를 3장으로(바꾼 시각도 남겨 기기 연동 때 새 설정이 이김)');
  C.setNewLimit('lim', 10, t); eq(['lim' in C.data.cfg.newPerDay, C.newLimit('lim')], [false, 10], '덱 기본값(10)과 같으면 사용자 칸에서 지워 기본을 따름');
  C.setNewLimit('lim', 999, t); eq(C.newLimit('lim'), 200, '200장보다 크면 200');
  C.setNewLimit('lim', -4, t); eq(C.newLimit('lim'), 0, '0보다 작으면 0');
  C.setNewLimit('lim', '7', t); eq(C.newLimit('lim'), 7, '글자로 온 수도 받음');
  C.setNewLimit(['lim', 'lim2', 'nope'], 6, t); eq([C.newLimit('lim'), C.newLimit('lim2'), 'nope' in C.data.cfg.newPerDay], [6, 6, false], '여러 덱을 한 번에(없는 덱은 건너뜀)');
  // 하루 중간에 바꾸기: 오늘 4장 본 뒤 2장으로 줄이면 오늘은 0장, 8장으로 늘리면 바로 4장
  const ses = C.session(['lim']); for (let i = 0; i < 4; i++) { const p = C.pick(ses, t); graduate(C, ses, p.card.id, t); t += 1000; }
  C.setNewLimit('lim', 2, t); eq(C.scan(['lim'], t + 11 * MIN).counts.new, 0, '오늘 4장 본 뒤 2장으로 줄이면 오늘은 새 카드가 더 안 나옴');
  C.setNewLimit('lim', 8, t); eq(C.scan(['lim'], t + 11 * MIN).counts.new, 4, '8장으로 늘리면 바로 4장 더');
  C.setMaxRev(5, t); eq(C.data.cfg.maxRev, 10, '복습 상한은 10장보다 작게 못 함');
  C.setMaxRev(1e9, t); eq(C.data.cfg.maxRev, 9999, '복습 상한은 9999장보다 크게 못 함(9999 = 제한 없음)');
  C.setMaxRev(300, t); eq(C.data.cfg.maxRev, 300, '복습 상한 300장');
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

// ---------------------------------------------------------------- 아는 단어 한꺼번에 넘기기
section('아는 단어 한꺼번에 넘기기');
{
  let w = start(deck('k', 8)); let C = w.VocabCore; let ses = C.session(['k']); const t = T0;
  const look = (ids) => C.unseenNotes(ids).map(x => [x.note.id, x.passed]);
  const fresh = (...ns) => ns.map(i => ['w' + i, false]);
  eq(look(['k']), fresh(0, 1, 2, 3, 4, 5, 6, 7), '아직 안 본 노트를 덱 순서대로');
  eq(C.unseenNotes(['k'])[0], { key: 'k/w0', deck: 'k', note: w.VocabDecks.byId.k.notes[0], cards: ['k/w0/r'], tpl: ['r'], passed: false }, '노트마다 열쇠 · 카드 · 카드 종류');
  graduate(C, ses, 'k/w0/r', t); C.mark(null, ['k/w1/r'], 's', t);
  eq(look(['k']), fresh(2, 3, 4, 5, 6, 7), '배운 노트 · 아는 단어로 넘긴 노트는 빠짐');
  // 한 화면 넘기기: w2 · w3 은 아는 단어, w4 · w5 는 보고 지나감
  const ks = C.session(['k']);
  eq(C.sweep(ks, ['k/w2/r', 'k/w3/r'], ['k/w4/r', 'k/w5/r'], t + 1000), 4, '한 화면 = 표시한 것 s + 나머지 p, 사건 4개');
  eq(look(['k']), [['w4', true], ['w5', true], ['w6', false], ['w7', false]], '넘긴 것은 빠지고, 지나간 것은 passed 로 남음');
  eq([C.recs['k/w4/r'].st, C.recs['k/w4/r'].susp, C.kindOf('k/w4/r'), C.parse(C.data.log['k/w4/r']).map(x => x[1])], [0, 0, 'new', ['p']], '지나간 단어는 여전히 새 카드(p 는 간격 계산과 무관)');
  ok(C.scan(['k'], t + 2000).fresh.some(c => c.id === 'k/w4/r') && !C.scan(['k'], t + 2000).fresh.some(c => c.id === 'k/w2/r'), '지나간 단어는 카드로 나오고, 넘긴 단어는 안 나옴');
  eq([C.summary(t + 2000).decks.k.known, C.summary(t + 2000).decks.k.unseen], [3, 4], '요약: 아는 단어 3장 · 안 본 카드 4장');
  eq([C.sweep(ks, [], ['k/w4/r', 'k/w5/r'], t + 3000), ks.undo.length, C.data.log['k/w4/r'].length], [0, 1, 7], '이미 지나간 단어에는 또 적지 않음(기록이 불어나지 않게) · 되돌릴 것도 안 쌓임');
  ok(Object.keys(C.recs).every(id => JSON.stringify(C.recs[id]) === JSON.stringify(C.replay(C.data.log[id]))), '넘긴 뒤에도 상태 = 기록을 다시 계산한 값');
  // 다시 열어도(캐시) 같은 목록
  const again = world(deck('k', 8), w.mem); again.VocabCore.load();
  eq(again.VocabCore.unseenNotes(['k']).map(x => [x.note.id, x.passed]), look(['k']), '다시 열어도 같은 목록');
  // 되돌리기 한 번에 한 화면 전체
  eq(C.undo(ks, t + 4000), 'k/w2/r', '되돌리기 한 번에 한 화면');
  eq(look(['k']), fresh(2, 3, 4, 5, 6, 7), '되돌리면 그 화면의 넘김 · 지나감이 모두 풀림');
  eq(C.undo(ks, t + 5000), null, '더 되돌릴 것 없음');
  // 넘겼다가 푼 단어 · 학습 화면에서 되돌린 단어
  C.mark(null, ['k/w2/r'], 's', t + 6000); C.mark(null, ['k/w2/r'], 'u', t + 7000);
  eq(look(['k']).filter(x => x[1]).map(x => x[0]), ['w2'], '넘겼다가 푼 단어는 넘기기 화면에서 다시 묻지 않음');
  C.mark(ses, ['k/w3/r'], 's', t + 8000); C.undo(ses, t + 9000);
  eq(look(['k']).find(x => x[0] === 'w3'), ['w3', false], '넘기기를 되돌린(무효) 단어는 아직 안 물어본 단어');
  // 다른 기기와 합치기: p 도 합집합 · 같은 시각이면 되돌림이 이김
  const E = (tt, c) => C.enc(tt) + c;
  eq([w.Sync.mergeVocabLog(E(1, 'p'), E(1, 'p') + E(5, 's')), w.Sync.mergeVocabLog(E(1, 'p'), E(1, '0'))], [E(1, 'p') + E(5, 's'), E(1, '0')], '지나감 표시도 다른 기록처럼 합쳐짐');
  // 카드가 두 장인 노트(읽기 · 듣기): 둘 다 새 카드일 때만 「안 본 노트」
  w = start(deck('kk', 3, ", tpl: ['r', 'l']")); C = w.VocabCore; ses = C.session(['kk']);
  eq([C.unseenNotes(['kk']).length, C.unseenNotes(['kk'])[0].cards, C.unseenNotes(['kk'])[0].tpl], [3, ['kk/w0/r', 'kk/w0/l'], ['r', 'l']], '노트 하나에 카드 두 장');
  C.answer(ses, 'kk/w0/l', 3, t); eq(C.unseenNotes(['kk']).map(x => x.note.id), ['w1', 'w2'], '한 장이라도 배운 노트는 빠짐');
  eq(C.sweep(null, ['kk/w1/r', 'kk/w1/l'], ['kk/w2/r', 'kk/w2/l'], t + 1000), 4, '세션 없이도 남길 수 있음');
  eq([C.unseenNotes(['kk']).map(x => [x.note.id, x.passed]), C.summary(t + 2000).decks.kk.known], [[['w2', true]], 2], '노트의 카드를 모두 넘김');
  // 덱 여러 개: 덱 순서대로 이어 붙임
  w = start(deck('a1', 2) + deck('a2', 2)); C = w.VocabCore;
  eq(C.unseenNotes(['a1', 'a2']).map(x => x.key), ['a1/w0', 'a1/w1', 'a2/w0', 'a2/w1'], '여러 덱은 덱 순서대로');
}

// ---------------------------------------------------------------- 차례표 · 덱 파일 틀 (tools/vocab_base_order.mjs)
section('기초 덱 차례표 · 덱 파일 틀');
{
  const T = await import('./vocab_base_order.mjs'); const b = T.build(); const rows = b.rows; const st = b.stats;
  eq([rows.length, st.total, st.ngsl + st.spokenOnly], [2833, 2833, 2833], '차례표 = NGSL 전부 + NGSL-S 에만 있는 단어');
  ok(rows.every((r, i) => r.no === i + 1), '차례는 1 부터 빠짐없이');
  ok(new Set(rows.map(r => r.id)).size === rows.length && rows.every(r => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id)), '노트 id 는 겹치지 않고, 소문자 · 숫자 · 붙임표만');
  ok(new Set(rows.map(r => r.word.toLowerCase())).size === rows.length, '단어는 겹치지 않음');
  const head = rows.slice(0, st.spokenFirst), tail = rows.slice(st.spokenFirst);
  ok(head.every((r, i) => r.spoken !== '' && (i === 0 || r.spoken > head[i - 1].spoken)), `앞 ${st.spokenFirst}개는 말 목록 순위대로`);
  ok(tail.every((r, i) => r.spoken === '' && r.ngsl !== '' && (i === 0 || r.ngsl > tail[i - 1].ngsl)), '나머지는 NGSL 순위대로');
  eq(T.ARTIFACTS.map(a => { const r = rows.find(x => x.id === a); return [!!r && r.spoken === '', !!r && r.no > st.spokenFirst]; }), T.ARTIFACTS.map(() => [true, true]), '녹취 표시 낱말은 말 순위를 쓰지 않고 뒤쪽(NGSL 순위 자리)에');
  eq([rows.slice(0, 5).map(r => r.word), rows[rows.length - 1].word], [['be', 'the', 'you', 'and', 'it'], 'thirst'], '맨 앞 다섯과 맨 끝');
  eq(read('vocab/sources/base-order.tsv'), b.text, '저장된 차례표 = 원문에서 다시 만든 것');
  eq([T.fileOf(1), T.fileOf(200), T.fileOf(201), T.fileOf(2833)], ['base-0001.js', 'base-0001.js', 'base-0201.js', 'base-2801.js'], '차례 → 덱 파일 이름');
  // 노트 한 줄 쓰기 → 다시 읽기: 따옴표 · 역슬래시 · 줄바꿈 · 모든 칸
  const parse = (text) => { const out = []; vm.runInNewContext(text, { VocabDecks: { notes: (id, arr) => out.push(...arr) } }); return out; };
  const tricky = [
    { id: 'do', w: 'do', rank: 1, ko: [['v', '하다'], ['aux', '(의문문 · 부정문을 만드는 말)']], ex: [["I don't know.", '저는 몰라요.'], ['He said "do it" twice.', '그는 「해」 라고 두 번 말했어요.']], forms: ['does', 'did', "don't"], note: "it's \"both\" kinds \\ of quotes", say: 'do', pron: '두', tpl: ['r', 'l'] },
    { id: 'i', w: 'I', rank: 2, ko: [['pron', '나']], ex: [['I am here.', '저는 여기 있어요.']], note: 'line one\nline two' },
  ];
  eq(parse("VocabDecks.notes('base', [\n" + tricky.map(T.fmt).join('\n') + '\n]);'), tricky, '노트 쓰기 → 다시 읽기: 한 글자도 안 바뀜');
  let threw = ''; try { T.fmt({ id: 'x', w: 'x', rank: 3, ko: [], ex: [], extra: 1 }); } catch (e) { threw = e.message; }
  ok(threw.includes('extra'), '도구가 모르는 칸이 있으면 조용히 버리지 않고 멈춤');
  // 덱 파일 틀: 이미 쓴 노트는 그대로, 나머지는 빈 틀
  const n3 = { id: rows[2].id, w: rows[2].word, rank: 3, ko: [['pron', '너, 당신']], ex: [['You are right.', '당신 말이 맞아요.']] };
  const made = parse(T.fileText(1, rows, new Map([[3, n3]])));
  eq([made.length, made.map(n => n.rank).join() === rows.slice(0, 200).map(r => r.no).join(), made[2], made[0], made.filter(T.isBlank).length], [200, true, n3, { id: 'be', w: 'be', rank: 1, ko: [], ex: [] }, 199], '틀 = 차례 1 ~ 200, 쓴 노트는 그대로 · 나머지는 차례표의 id · 단어가 든 빈 틀');
  eq(parse(T.fileText(2801, rows, new Map())).map(n => n.rank), rows.slice(2800).map(r => r.no), '마지막 파일은 남은 차례만(2801 ~ 2833)');
  eq(parse(T.fileText(1, rows, new Map([[3, n3]]), false)), [n3], '빈 틀 없이 쓴 노트만');
  // 진행 상황: 빈 틀은 채운 것으로 세지 않음
  const s1 = T.status(rows, [...made], () => true);
  eq([s1.files.length, s1.files[0], s1.done, s1.total, s1.next], [15, { f: 'base-0001.js', start: 1, end: 200, done: 1, total: 200, exists: true }, 1, 2833, 1], '빈 틀 199개는 안 채운 것 → 다음에 할 파일은 그대로 1');
  const full = made.map(n => (T.isBlank(n) ? Object.assign({}, n, { ko: [['n', '뜻']], ex: [['An example.', '예문.']] }) : n));
  eq([T.status(rows, full, () => true).files[0].done, T.status(rows, full, () => true).next], [200, 201], '다 채우면 다음 파일로');
  // 덱 파일 다시 만들기: 여러 번 돌려도 같고, 채운 노트를 잃지 않음
  const p1 = T.planFile(1, rows, { notes: made, byFile: { 'base-0001.js': made } });
  eq([p1.f, p1.end, p1.kept, p1.blanks, parse(p1.text)], ['base-0001.js', 200, 1, 199, made], '채우다 만 파일에 다시 돌려도 그대로(쓴 것 1 · 빈 틀 199)');
  const shuffled = [made[5], Object.assign({ ex: n3.ex, ko: n3.ko }, { id: n3.id, w: n3.w, rank: 3 }), made[0]];
  eq(parse(T.planFile(1, rows, { notes: shuffled, byFile: { 'base-0001.js': shuffled } }).text), made, '순서가 섞였거나 칸 순서가 달라도 차례대로 다시 씀');
  const fails2 = (fn) => { try { fn(); return ''; } catch (e) { return e.message; } };
  ok(fails2(() => T.planFile(1, rows, { notes: [], byFile: { 'base-0201.js': [n3] } })).includes('다른 파일'), '같은 차례의 노트가 다른 파일에 있으면 멈춤');
  ok(fails2(() => T.planFile(201, rows, { notes: [], byFile: { 'base-0201.js': [n3] } })).includes('범위'), '파일 범위 밖의 노트가 있으면 멈춤(조용히 버리지 않음)');
  ok(fails2(() => T.planFile(1, rows, { notes: [], byFile: { 'base-0001.js': [n3, Object.assign({}, n3, { id: 'dup' })] } })).includes('두 번'), '차례가 같은 노트가 둘이면 멈춤');
  ok(fails2(() => T.planFile(2, rows, { notes: [], byFile: {} })).includes('첫 차례') && fails2(() => T.planFile(NaN, rows, { notes: [], byFile: {} })).includes('첫 차례'), '파일의 첫 차례가 아니면 멈춤');
  // 지금 저장소의 덱: 파일마다 다시 만들어도 채운 노트가 그대로
  const deckNow = T.loadBase(); const stNow = T.status(rows, deckNow.notes);
  eq(stNow.done, deckNow.notes.filter(n => !T.isBlank(n)).length, '지금 덱: 진행 상황의 합 = 채운 노트 수');
  ok(Object.keys(deckNow.byFile).every(f => { const m = /^base-(\d{4})\.js$/.exec(f); if (!m) return false; const p = T.planFile(+m[1], rows, deckNow); return p.kept === deckNow.byFile[f].filter(n => !T.isBlank(n)).length; }), '지금 덱: 파일마다 다시 만들어도 채운 노트를 잃지 않음');
}

console.log(fails.length ? `✗ test_vocab 실패 ${fails.length}개 (통과 ${pass}개)` : `✓ test_vocab OK — ${pass}개 통과`);
process.exit(fails.length ? 1 : 0);
