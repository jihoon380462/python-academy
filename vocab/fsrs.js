// vocab/fsrs.js — 복습 간격 계산기(FSRS-6). 순수 계산만 해요: 화면 · 저장 · 시계를 건드리지 않아요.
//
// 무엇을 하나
//   카드의 기억 상태(안정도 s · 난이도 d)와 「언제, 어느 버튼을 눌렀나」 를 받아 다음 상태와 다음 복습 시각을 돌려줘요.
//   버튼은 Anki 와 같은 넷이에요: 1 다시 · 2 어려움 · 3 알맞음 · 4 쉬움.
//
// 어디서 왔나 (출처 · 라이선스)
//   공식 · 기본 매개변수 · 학습 단계 · 간격 흩뜨리기는 open-spaced-repetition 의 ts-fsrs 5.4.2(FSRS-6) 소스를 읽고
//   같은 계산을 이 파일로 옮긴 것이에요. 원본: MIT License, Copyright (c) 2026 Open Spaced Repetition.
//   흩뜨리기 난수 Alea 는 Johannes Baagøe 의 알고리즘(MIT)이에요. 라이선스 전문: vocab/LICENSE-fsrs.txt
//
// 원본과 일부러 다르게 한 곳 (셋뿐)
//   ① 「어려움」 을 둘째 단계부터 누르면 그 단계의 간격을 되풀이해요(Anki 방식). 원본은 늘 첫 두 단계의 평균이에요.
//      make({ hardStyle: 'tsfsrs' }) 로 원본 방식을 고를 수 있어요 — tools/vocab_fsrs_crosscheck.mjs 가 대조할 때 써요.
//   ② 지난 날 수를 UTC 날짜가 아니라 make({ dayOf }) 가 주는 「하루 번호」 로 세요. 하루가 바뀌는 때를 vocab/core.js 가 정해요.
//   ③ 흩뜨리기 씨앗은 「복습 시각(초)_복습 횟수」 예요. 소수 계산 결과를 넣지 않아서 기기가 달라도 같은 값이 나와요.
//
// 카드 모양: { state, due, s, d, reps, lapses, step, sd, last }
//   state 0 새 카드 · 1 학습 중 · 2 복습 · 3 다시 학습 / due · last 는 밀리초 시각 / sd 는 잡힌 간격(일) / step 은 학습 단계 번호
const Fsrs = (() => {
  const DAY = 86400000, MIN = 60000;
  const S_MIN = 0.001, S_MAX = 36500;
  const NEW = 0, LEARNING = 1, REVIEW = 2, RELEARNING = 3;
  const DEFAULT_W = Object.freeze([0.212, 1.2931, 2.3065, 8.2956, 6.4133, 0.8334, 3.0194, 0.001, 1.8722, 0.1666, 0.796, 1.4835, 0.0614, 0.2629, 1.6483, 0.6014, 1.8729, 0.5425, 0.0912, 0.0658, 0.1542]);
  const FUZZ_RANGES = [[2.5, 7, 0.15], [7, 20, 0.1], [20, Infinity, 0.05]]; // [시작, 끝, 비율] — 간격이 길수록 조금 더 넓게 흩뜨려요
  const EMPTY = Object.freeze({ state: NEW, due: 0, s: 0, d: 0, reps: 0, lapses: 0, step: 0, sd: 0, last: 0 });
  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
  const round8 = (x) => Math.round(x * 1e8) / 1e8;

  // Alea 난수: 씨앗 글자에서 0 이상 1 미만의 수 하나(첫 번째 값)
  function aleaFirst(seed) {
    let n = 4022871197;
    const mash = (data) => {
      data = String(data);
      for (let i = 0; i < data.length; i++) {
        n += data.charCodeAt(i);
        let h = 0.02519603282416938 * n;
        n = h >>> 0; h -= n; h *= n;
        n = h >>> 0; h -= n;
        n += h * 4294967296;
      }
      return (n >>> 0) * 2.3283064365386963e-10;
    };
    let s0 = mash(' '); let s1 = mash(' '); let s2 = mash(' ');
    s0 -= mash(seed); if (s0 < 0) s0 += 1;
    s1 -= mash(seed); if (s1 < 0) s1 += 1;
    s2 -= mash(seed); if (s2 < 0) s2 += 1;
    const t = 2091639 * s0 + 1 * 2.3283064365386963e-10;
    return t - (t | 0);
  }

  // opt: { w, retention, maxInterval, fuzz, steps(분), relearn(분), dayOf(ms) → 하루 번호, hardStyle }
  function make(opt = {}) {
    const w = Array.from(opt.w || DEFAULT_W);
    if (w.length !== 21 || w.some(x => !Number.isFinite(x))) throw new Error('FSRS-6 매개변수는 숫자 21개여야 해요');
    const retention = opt.retention || 0.9;
    if (!(retention > 0 && retention <= 1)) throw new Error('목표 기억률은 0 보다 크고 1 이하여야 해요');
    const maxInterval = opt.maxInterval || 36500;
    const fuzz = !!opt.fuzz;
    const steps = Array.from(opt.steps || [1, 10]);      // 새 카드 학습 단계(분)
    const relearn = Array.from(opt.relearn || [10]);     // 틀린 카드 다시 학습 단계(분)
    const dayOf = opt.dayOf || ((ms) => Math.floor(ms / DAY));
    const hardStyle = opt.hardStyle || 'anki';

    const decay = -w[20];
    const factor = round8(Math.exp(Math.pow(decay, -1) * Math.log(0.9)) - 1);
    const modifier = round8((Math.pow(retention, 1 / decay) - 1) / factor); // 목표 기억률 0.9 면 1 — 간격 = 안정도
    const initD4 = round8(w[4] - Math.exp(3 * w[5]) + 1);                    // 「쉬움」 으로 시작한 카드의 난이도(되돌림 기준)

    // 기억할 확률: 안정도 s 인 카드를 t 일 뒤에 떠올릴 확률. t = s 이면 0.9
    const recall = (t, s) => round8(Math.pow(1 + factor * t / s, decay));
    const initS = (g) => Math.max(w[g - 1], 0.1);
    const initD = (g) => round8(w[4] - Math.exp((g - 1) * w[5]) + 1);
    const nextD = (d, g) => {
      const moved = d + round8(-w[6] * (g - 3) * (10 - d) / 9);
      return clamp(round8(w[7] * initD4 + (1 - w[7]) * moved), 1, 10);
    };
    // 맞혔을 때 · 틀렸을 때 · 같은 날 다시 봤을 때의 새 안정도
    const recallS = (d, s, r, g) => round8(clamp(s * (1 + Math.exp(w[8]) * (11 - d) * Math.pow(s, -w[9]) * (Math.exp((1 - r) * w[10]) - 1) * (g === 2 ? w[15] : 1) * (g === 4 ? w[16] : 1)), S_MIN, S_MAX));
    const forgetS = (d, s, r) => round8(clamp(w[11] * Math.pow(d, -w[12]) * (Math.pow(s + 1, w[13]) - 1) * Math.exp((1 - r) * w[14]), S_MIN, S_MAX));
    const shortS = (s, g) => {
      const sinc = Math.pow(s, -w[19]) * Math.exp(w[17] * (g - 3 + w[18]));
      return round8(clamp(s * (g >= 2 ? Math.max(sinc, 1) : sinc), S_MIN, S_MAX));
    };
    // 기억 상태 한 걸음: (난이도 d, 안정도 s) + 지난 날 수 t + 버튼 g → 새 (d, s). r 을 주면 그 값을 써요
    const memory = (d, s, t, g, r) => {
      if (d === 0 && s === 0) return { d: clamp(initD(g), 1, 10), s: initS(g) };
      if (r === undefined) r = recall(t, s);
      let ns;
      if (t === 0) ns = shortS(s, g);
      else if (g === 1) ns = clamp(round8(s / Math.exp(w[17] * w[18])), S_MIN, forgetS(d, s, r));
      else ns = recallS(d, s, r, g);
      return { d: nextD(d, g), s: ns };
    };
    // 안정도 → 간격(일). 2.5일 이상이면 씨앗으로 조금 흩뜨려요(같은 날 배운 카드가 늘 같이 몰려오지 않게)
    const interval = (s, elapsed, seed) => {
      const iv = Math.min(Math.max(1, Math.round(s * modifier)), maxInterval);
      if (!fuzz || iv < 2.5) return Math.round(iv);
      let delta = 1;
      for (const [a, b, f] of FUZZ_RANGES) delta += f * Math.max(Math.min(iv, b) - a, 0);
      const capped = Math.min(iv, maxInterval);
      let lo = Math.max(2, Math.round(capped - delta));
      const hi = Math.min(Math.round(capped + delta), maxInterval);
      if (capped > elapsed) lo = Math.max(lo, elapsed + 1);
      lo = Math.min(lo, hi);
      return Math.floor(aleaFirst(seed) * (hi - lo + 1) + lo);
    };
    // 학습 단계표: 지금 상태 · 단계에서 버튼마다 { min: 몇 분 뒤, next: 다음 단계 }. 표에 없는 버튼은 「졸업」(복습 카드가 됨)
    const stepPlan = (prevState, cur) => {
      const list = prevState === REVIEW || prevState === RELEARNING ? relearn : steps;
      const n = list.length; const plan = {};
      if (n === 0 || cur >= n) return plan;
      const at = Math.max(0, cur);
      if (prevState === REVIEW) { plan[1] = { min: list[at], next: 0 }; return plan; }
      plan[1] = { min: list[0], next: 0 };
      const firstHard = n === 1 ? Math.round(list[0] * 1.5) : Math.round((list[0] + list[1]) / 2);
      plan[2] = { min: hardStyle === 'tsfsrs' || cur === 0 ? firstHard : list[at], next: cur };
      const after = list[cur + 1];
      if (after) plan[3] = { min: Math.round(after), next: cur + 1 };
      return plan;
    };
    // 버튼 결과를 카드에 적기: 단계가 남았으면 몇 분 뒤 다시, 아니면 복습 카드로 졸업
    const settle = (card, g, toState, prevState, cur, now, elapsed, seed) => {
      const p = stepPlan(prevState, cur)[g];
      const min = Math.max(0, p ? p.min : 0); const next = Math.max(0, p ? p.next : 0);
      if (min > 0 && min < 1440) { card.step = next; card.sd = 0; card.state = toState; card.due = now + Math.round(min) * MIN; return card; }
      card.state = REVIEW;
      if (min >= 1440) { card.step = next; card.due = now + Math.round(min) * MIN; card.sd = Math.floor(min / 1440); return card; }
      const iv = interval(card.s, elapsed, seed);
      card.step = 0; card.sd = iv; card.due = now + iv * DAY;
      return card;
    };

    // 네 버튼 각각을 눌렀을 때의 다음 카드: { 1: 카드, 2: 카드, 3: 카드, 4: 카드 }. card 가 null 이면 새 카드
    function preview(card, now) {
      const c = card || EMPTY; const prev = c.state; const cur = c.step || 0;
      const elapsed = prev !== NEW && c.last ? Math.max(0, dayOf(now) - dayOf(c.last)) : 0;
      const reps = c.reps + 1; const seed = Math.floor(now / 1000) + '_' + reps;
      const blank = (m) => ({ state: prev, due: c.due, s: m.s, d: m.d, reps, lapses: c.lapses, step: cur, sd: c.sd, last: now });
      const out = {};
      if (prev === REVIEW) {
        const r = recall(elapsed, c.s);
        const again = blank(memory(c.d, c.s, elapsed, 1, r)); const hard = blank(memory(c.d, c.s, elapsed, 2, r));
        const good = blank(memory(c.d, c.s, elapsed, 3, r)); const easy = blank(memory(c.d, c.s, elapsed, 4, r));
        let hi = interval(hard.s, elapsed, seed); let gi = interval(good.s, elapsed, seed);
        hi = Math.min(hi, gi); gi = Math.max(gi, hi + 1);
        const ei = Math.max(interval(easy.s, elapsed, seed), gi + 1);
        for (const [x, iv] of [[hard, hi], [good, gi], [easy, ei]]) { x.state = REVIEW; x.step = 0; x.sd = iv; x.due = now + iv * DAY; }
        settle(again, 1, RELEARNING, prev, cur, now, elapsed, seed); again.lapses += 1;
        out[1] = again; out[2] = hard; out[3] = good; out[4] = easy;
        return out;
      }
      const to = prev === NEW ? LEARNING : prev;
      for (const g of [1, 2, 3, 4]) out[g] = settle(blank(memory(c.d, c.s, elapsed, g)), g, to, prev, cur, now, elapsed, seed);
      return out;
    }
    function next(card, now, g) {
      if (![1, 2, 3, 4].includes(g)) throw new Error('버튼은 1~4 여야 해요: ' + g);
      return preview(card, now)[g];
    }
    // 지금 이 카드를 떠올릴 확률(복습 카드만 뜻이 있어요)
    function retrievability(card, now) { return card && card.s > 0 ? recall(Math.max(0, dayOf(now) - dayOf(card.last)), card.s) : 0; }

    return { preview, next, retrievability, recall, interval, params: { w, retention, maxInterval, fuzz, steps, relearn, hardStyle, decay, factor, modifier } };
  }

  return { make, DEFAULT_W, STATE: { NEW, LEARNING, REVIEW, RELEARNING }, VERSION: 'FSRS-6 · ts-fsrs 5.4.2 기준' };
})();
