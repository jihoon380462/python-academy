// vocab/core.js — 영어 단어장의 코어(화면 없음). 덱 등록부 · 복습 기록 · 오늘 볼 카드 고르기 · 저장. 설계와 규칙: specs/vocab.md
//
// 한눈에
//   덱(VocabDecks)   덱 = 노트 묶음. 노트 하나(단어 하나)가 카드를 한 장 이상 만들어요. 카드 id = 「덱/노트/종류」
//                    종류: r 읽기(영어 → 뜻) · l 듣기(소리 → 뜻) · t 쓰기(뜻 → 철자)
//   기록(log)        카드마다 「사건 문자열」 하나. 사건 = 시각 6글자(36진수, 2026-01-01 UTC 부터 흐른 초) + 종류 1글자
//                    종류: 1 다시 · 2 어려움 · 3 알맞음 · 4 쉬움 · 0 되돌림(무효) · s 아는 단어로 넘김 · u 넘김 풀기 · f 처음부터 다시
//                          p 넘기기 화면에서 보고 지나감(상태 계산은 모르는 글자를 건너뛰어요 — 넘기기 화면만 읽어요)
//   상태(recs)       기록을 처음부터 다시 계산(replay)한 결과. 기록만 진짜고 상태는 언제든 다시 만들 수 있어요.
//                    그래서 두 기기의 기록은 「합집합」 으로 합치면 끝나요(core/sync.js 의 mergeVocab).
//   하루             한국 시간 새벽 4시에 바뀌어요(Anki 와 같은 방식 — cfg.tz 분 · cfg.roll 시).
//
// 저장 (localStorage)
//   academy.vocab        { v, mt, resetAt, cfg, log }  — 기기 연동으로 오가는 것
//   academy.vocab.cache  { v, sig, recs, extra, sum }  — 이 기기만. 상태 캐시 + 허브 카드용 요약(sum)

// ---------- 덱 등록부 ----------
const VocabDecks = {
  list: [], byId: {}, _card: null,
  TPL: { r: '읽기', l: '듣기', t: '쓰기' },
  POS: { n: '명사', v: '동사', adj: '형용사', adv: '부사', prep: '전치사', conj: '접속사', pron: '대명사', det: '한정사', art: '관사', aux: '조동사', num: '수사', int: '감탄사', phr: '표현', abbr: '줄임말', sym: '기호', affix: '접사' },
  // 덱 정보 등록(vocab/decks/index.js). 노트가 없는 덱은 화면에 「준비 중」 으로 나와요
  add(meta) {
    if (this.byId[meta.id]) throw new Error('덱 id 가 겹쳐요: ' + meta.id);
    const d = Object.assign({ tpl: ['r'], newPerDay: 10, desc: '', credit: '' }, meta); d.notes = [];
    this.list.push(d); this.byId[d.id] = d; this._card = null; return d;
  },
  // 노트 넣기(vocab/decks/<덱>*.js). 여러 파일로 나눠 넣어도 돼요 — 넣은 순서가 새 카드가 나오는 순서
  notes(deckId, arr) {
    const d = this.byId[deckId]; if (!d) throw new Error('없는 덱에 노트를 넣었어요: ' + deckId);
    d.notes.push(...arr); d._cards = null; this._card = null;
  },
  // 덱의 카드 목록: 노트 순서 → 카드 종류 순서
  cards(deckId) {
    const d = this.byId[deckId]; if (!d) return [];
    if (!d._cards) { d._cards = []; d.notes.forEach((n, i) => { for (const t of (n.tpl || d.tpl)) d._cards.push({ id: `${d.id}/${n.id}/${t}`, key: `${d.id}/${n.id}`, deck: d.id, note: n, tpl: t, idx: i }); }); }
    return d._cards;
  },
  card(id) { if (!this._card) { this._card = {}; for (const d of this.list) for (const c of this.cards(d.id)) this._card[c.id] = c; } return this._card[id] || null; },
  ready() { return this.list.filter(d => d.notes.length); },
};

// ---------- 코어 ----------
const VocabCore = {
  KEY: 'academy.vocab', CACHE: 'academy.vocab.cache',
  EPOCH: Date.UTC(2026, 0, 1) / 1000,   // 사건 시각의 기준(초)
  DAY: 86400000,
  LEARN_AHEAD: 20 * 60000,               // 다른 카드가 없으면 20분 안에 돌아올 학습 카드를 미리 보여 줘요(Anki 기본값)
  clockOffset: 0,                        // 검사가 시간을 건너뛸 때만 써요
  data: null, recs: {}, extra: null, eng: null, saveOk: true,   // saveOk: 마지막 저장이 됐는지(화면이 보고 알려 줘요)
  now() { return Date.now() + this.clockOffset; },
  // 저장소(검사에서 바꿔 끼울 수 있게 따로)
  store: {
    get(k) { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch (e) { return null; } },
    set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  },

  // ----- 시각 · 하루 -----
  day(ms, cfg = this.data.cfg) { return Math.floor((ms + cfg.tz * 60000 - cfg.roll * 3600000) / this.DAY); },
  dayStart(day, cfg = this.data.cfg) { return day * this.DAY - cfg.tz * 60000 + cfg.roll * 3600000; },
  rel(ms) { return Math.max(0, Math.floor(ms / 1000) - this.EPOCH); },
  abs(rel) { return (rel + this.EPOCH) * 1000; },

  // ----- 사건 문자열 -----
  enc(rel) { return rel.toString(36).padStart(6, '0'); },
  parse(str) { const out = []; for (let i = 0; str && i + 7 <= str.length; i += 7) out.push([parseInt(str.slice(i, i + 6), 36), str[i + 6]]); return out; },
  lastRel(str) { return str && str.length >= 7 ? parseInt(str.slice(str.length - 7, str.length - 1), 36) : -1; },
  // 사건 덧붙이기. 시각은 늘 앞 사건보다 뒤(시계가 어긋난 기기에서도 순서가 지켜지게) · 초기화 시각보다 뒤
  append(str, rel, code) { str = str || ''; const t = Math.max(rel, this.lastRel(str) + 1, (this.data ? this.data.resetAt : 0) + 1); return { str: str + this.enc(t) + code, t }; },
  // 되돌리기: 그 시각의 사건을 지우지 않고 「무효(0)」 로 바꿔요 — 다른 기기에 이미 올라간 사건도 합칠 때 무효가 이겨요
  voidAt(str, rel) { const key = this.enc(rel); for (let i = 0; i + 7 <= str.length; i += 7) if (str.slice(i, i + 6) === key) return str.slice(0, i + 6) + '0' + str.slice(i + 7); return str; },
  hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; },

  // ----- 설정 · 계산기 -----
  blank() { return { v: 1, mt: 0, resetAt: 0, cfg: {}, log: {} }; },
  // t 설정을 바꾼 시각 · tz 시간대(분, 한국 540) · roll 하루가 바뀌는 시 · newPerDay 덱별 하루 새 카드 · maxRev 덱별 하루 복습 상한 · auto 소리 자동 재생
  defaults() { return { t: 0, tz: -new Date().getTimezoneOffset(), roll: 4, newPerDay: {}, maxRev: 200, auto: true }; },
  // 간격 계산 규칙은 여기 한 곳. 바꾸면 모든 카드의 지난 기록이 새 규칙으로 다시 계산돼요(sig 가 바뀌어 캐시도 버려짐) — specs/vocab.md 4절
  engine(cfg) { return Fsrs.make({ retention: 0.9, fuzz: true, steps: [1, 10], relearn: [10], dayOf: (ms) => this.day(ms, cfg) }); },
  sig(cfg) { return ['fsrs6', 'r0.9', 'steps1,10', 'relearn10', 'fuzz', 'hard-anki', cfg.tz, cfg.roll].join('|'); },

  // ----- 기록 → 상태 -----
  // 돌려주는 값: { h 기록 해시, st 상태, due 다음 시각, s 안정도, d 난이도, reps, lapses, step, sd 간격(일), last 마지막으로 누른 때,
  //               intro 처음 배운 때, rev 복습 카드로서 마지막으로 누른 때, susp 아는 단어로 넘김, n 누른 횟수 }
  replay(str) {
    let c = null; const r = { h: this.hash(str), intro: 0, rev: 0, susp: 0, n: 0 };
    for (const [rel, code] of this.parse(str)) {
      const ms = this.abs(rel);
      if (code >= '1' && code <= '4') { if (!c) r.intro = ms; else if (c.state === 2) r.rev = ms; c = this.eng.next(c, ms, +code); r.n++; }
      else if (code === 'f') { c = null; r.intro = 0; }
      else if (code === 's') r.susp = 1;
      else if (code === 'u') r.susp = 0;
    }
    const m = c ? { st: c.state, due: c.due, s: c.s, d: c.d, reps: c.reps, lapses: c.lapses, step: c.step, sd: c.sd, last: c.last } : { st: 0, due: 0, s: 0, d: 0, reps: 0, lapses: 0, step: 0, sd: 0, last: 0 };
    return this.unpack(this.pack(Object.assign(r, m))); // 칸 순서를 PACK 순서로 고정 — 캐시에서 읽은 상태와 글자까지 같게
  },
  cardOf(rec) { return rec && rec.st !== 0 ? { state: rec.st, due: rec.due, s: rec.s, d: rec.d, reps: rec.reps, lapses: rec.lapses, step: rec.step, sd: rec.sd, last: rec.last } : null; },
  PACK: ['h', 'st', 'due', 's', 'd', 'reps', 'lapses', 'step', 'sd', 'last', 'intro', 'rev', 'susp', 'n'],
  pack(rec) { return this.PACK.map(k => rec[k]); },
  unpack(arr) { const r = {}; this.PACK.forEach((k, i) => { r[k] = arr[i]; }); return r; },

  // ----- 읽기 · 쓰기 -----
  load() {
    const raw = this.store.get(this.KEY) || {}; const d = Object.assign(this.blank(), raw);
    d.cfg = Object.assign(this.defaults(), raw.cfg || {}); d.cfg.newPerDay = Object.assign({}, d.cfg.newPerDay); d.log = d.log || {};
    this.data = d; this.eng = this.engine(d.cfg);
    const cache = this.store.get(this.CACHE) || {}; const cached = cache.v === 1 && cache.sig === this.sig(d.cfg) ? (cache.recs || {}) : {};
    this.recs = {};
    for (const deck of VocabDecks.list) for (const c of VocabDecks.cards(deck.id)) {
      const str = d.log[c.id]; if (!str) continue;
      const a = cached[c.id]; this.recs[c.id] = a && a[0] === this.hash(str) ? this.unpack(a) : this.replay(str);
    }
    this.extra = cache.extra || null;
    return this;
  },
  // 저장: 기록(연동되는 조각)과 상태 캐시를 같이. 돌려주는 값은 성공했는지(용량이 차면 false)
  save(now = this.now()) {
    this.data.mt = now;
    try { this.store.set(this.KEY, { v: 1, mt: this.data.mt, resetAt: this.data.resetAt, cfg: this.data.cfg, log: this.data.log }); } catch (e) { this.saveOk = false; return false; }
    this.saveCache(now); this.saveOk = true; return true;
  },
  saveCache(now = this.now()) {
    const recs = {}; for (const id in this.recs) recs[id] = this.pack(this.recs[id]);
    try { this.store.set(this.CACHE, { v: 1, sig: this.sig(this.data.cfg), recs, extra: this.extra, sum: this.summary(now) }); } catch (e) {}
  },
  setCfg(patch, now = this.now()) {
    const before = this.sig(this.data.cfg); Object.assign(this.data.cfg, patch); this.data.cfg.t = now;
    if (this.sig(this.data.cfg) !== before) { this.eng = this.engine(this.data.cfg); for (const id in this.recs) this.recs[id] = this.replay(this.data.log[id]); }
    return this.save(now);
  },
  // 단어장 기록 전부 지우기. 다른 기기에 남은 옛 사건도 합칠 때 버려지게 초기화 시각을 남겨요
  resetAll(now = this.now()) { this.data.resetAt = this.rel(now); this.data.log = {}; this.recs = {}; this.extra = null; return this.save(now); },

  // ----- 오늘 볼 카드 -----
  newLimit(deckId) { const v = this.data.cfg.newPerDay[deckId]; return Number.isFinite(v) ? v : VocabDecks.byId[deckId].newPerDay; },
  // 하루 한도 정하기(v2.46.8 하루 한도 시트 · 설정 창): 새 카드는 덱마다 0 ~ 200장, 복습 상한은 모든 덱 같은 값 10 ~ 9999장(9999 = 제한 없음).
  //   덱 기본값과 같으면 사용자 칸에서 지워 기본을 따르게 해요. setCfg 가 바꾼 시각(t)을 남겨 기기 연동 때 새 설정이 이겨요
  NEW_MAX: 200, REV_MIN: 10, REV_MAX: 9999,
  setNewLimit(deckIds, v, now = this.now()) {
    const n = Math.min(this.NEW_MAX, Math.max(0, Math.round(+v) || 0)); const np = Object.assign({}, this.data.cfg.newPerDay);
    for (const id of [].concat(deckIds)) { const d = VocabDecks.byId[id]; if (!d) continue; if (n === d.newPerDay) delete np[id]; else np[id] = n; }
    return this.setCfg({ newPerDay: np }, now);
  },
  setMaxRev(v, now = this.now()) { return this.setCfg({ maxRev: Math.min(this.REV_MAX, Math.max(this.REV_MIN, Math.round(+v) || 200)) }, now); },
  extraFor(deckId, today) { return this.extra && this.extra.day === today ? (this.extra.by[deckId] || 0) : 0; },
  // 오늘만 새 카드를 n장 더(이 기기에서만 기억해요)
  addExtra(deckIds, n, now = this.now()) {
    const today = this.day(now); if (!this.extra || this.extra.day !== today) this.extra = { day: today, by: {} };
    for (const id of deckIds) this.extra.by[id] = (this.extra.by[id] || 0) + n;
    this.saveCache(now);
  },
  // 덱들을 훑어 오늘 볼 카드를 셋으로 나눠요: fresh 새 카드 · learn 학습 중(몇 분 뒤 다시) · review 복습
  //   한도: 덱마다 하루 새 카드 수 · 하루 복습 상한. 같은 노트의 다른 카드는 같은 날 겹쳐 내지 않아요(형제 카드 미루기)
  scan(deckIds, now = this.now()) {
    const cfg = this.data.cfg; const today = this.day(now); const out = { fresh: [], learn: [], review: [], moreNew: 0 };
    for (const id of deckIds) {
      const cards = VocabDecks.cards(id); if (!cards.length) continue;
      const seen = new Set(); let intro = 0, revDone = 0;
      for (const c of cards) { const r = this.recs[c.id]; if (!r) continue; if (r.last && this.day(r.last) === today) seen.add(c.key); if (r.intro && this.day(r.intro) === today) intro++; if (r.rev && this.day(r.rev) === today) revDone++; }
      let newLeft = Math.max(0, this.newLimit(id) + this.extraFor(id, today) - intro); const revLeft = Math.max(0, cfg.maxRev - revDone);
      const due = []; const taken = new Set();
      for (const c of cards) {
        const r = this.recs[c.id];
        if (!r || (r.st === 0 && !r.susp)) { if (seen.has(c.key) || taken.has(c.key)) continue; if (newLeft > 0) { out.fresh.push(c); taken.add(c.key); newLeft--; } else out.moreNew++; continue; }
        if (r.susp) continue;
        if (r.st === 1 || r.st === 3) { out.learn.push(c); continue; }
        if (this.day(r.due) <= today && !(seen.has(c.key) && this.day(r.last) !== today)) due.push(c);
      }
      due.sort((a, b) => this.dueOrder(a, today) - this.dueOrder(b, today));
      out.review.push(...due.slice(0, revLeft));
    }
    out.learn.sort((a, b) => this.recs[a.id].due - this.recs[b.id].due);
    if (deckIds.length > 1) out.review.sort((a, b) => this.dueOrder(a, today) - this.dueOrder(b, today));
    out.counts = { new: out.fresh.length, learn: out.learn.length, rev: out.review.length };
    return out;
  },
  // 복습 순서: 밀린 날이 오래된 것부터, 같은 날끼리는 날마다 다르게 섞어요(카드 id + 오늘 번호의 해시)
  dueOrder(c, today) { return this.day(this.recs[c.id].due) + (this.hash(c.id + '@' + today) % 100000) / 100000; },
  session(deckIds) { return { decks: deckIds.filter(id => VocabDecks.byId[id]), sinceNew: 0, done: 0, undo: [] }; },
  // 다음 카드 한 장. 순서: 지금 다시 볼 학습 카드 → 복습과 새 카드를 고르게 섞기 → 20분 안에 돌아올 학습 카드
  //   돌려주는 값: { card, kind: 'new'|'learn'|'rev', counts, wait: 기다려야 하면 그 시각, moreNew: 한도 밖에 남은 새 카드 수 }
  pick(session, now = this.now()) {
    const sc = this.scan(session.decks, now); const L = sc.learn; let card = null, kind = '';
    if (L.length && this.recs[L[0].id].due <= now) { card = L[0]; kind = 'learn'; }
    else {
      const R = sc.review.length, N = sc.fresh.length;
      if (N && (!R || session.sinceNew + 1 >= Math.max(1, Math.round((R + N) / N)))) { card = sc.fresh[0]; kind = 'new'; }
      else if (R) { card = sc.review[0]; kind = 'rev'; }
      else if (L.length && this.recs[L[0].id].due <= now + this.LEARN_AHEAD) { card = L[0]; kind = 'learn'; }
    }
    return { card, kind, counts: sc.counts, wait: !card && L.length ? this.recs[L[0].id].due : 0, moreNew: sc.moreNew };
  },
  kindOf(cardId) { const r = this.recs[cardId]; return !r || r.st === 0 ? 'new' : r.st === 2 ? 'rev' : 'learn'; },
  // 네 버튼을 누르면 각각 언제 다시 나오나 — 버튼 위에 적는 글자
  preview(cardId, now = this.now()) {
    const at = this.abs(this.rel(now)); const p = this.eng.preview(this.cardOf(this.recs[cardId]), at); const out = {};
    for (const g of [1, 2, 3, 4]) out[g] = this.ivlLabel(p[g], at);
    return out;
  },
  ivlLabel(card, at) {
    if (card.state !== 2 || card.sd === 0) { const m = Math.max(1, Math.round((card.due - at) / 60000)); return m < 60 ? `<${m}분` : m < 1440 ? `<${Math.round(m / 60)}시간` : `${Math.round(m / 1440)}일`; }
    return this.daysLabel(card.sd);
  },
  daysLabel(n) { return n < 30 ? `${n}일` : n < 365 ? `${(n / 30).toFixed(1)}개월` : `${(n / 365).toFixed(1)}년`; },

  // ----- 누르기 · 되돌리기 -----
  put(cardId, code, now) { const a = this.append(this.data.log[cardId], this.rel(now), code); this.data.log[cardId] = a.str; this.recs[cardId] = this.replay(a.str); return a.t; },
  answer(session, cardId, g, now = this.now()) {
    if (![1, 2, 3, 4].includes(g)) throw new Error('버튼은 1~4 여야 해요: ' + g);
    const kind = this.kindOf(cardId); const t = this.put(cardId, String(g), now);
    if (session) { session.undo.push({ ev: [[cardId, t]], kind, sinceNew: session.sinceNew }); session.sinceNew = kind === 'new' ? 0 : kind === 'rev' ? session.sinceNew + 1 : session.sinceNew; session.done++; }
    this.save(now); return this.recs[cardId];
  },
  // 표시 남기기: 's' 아는 단어로 넘김 · 'u' 넘김 풀기 · 'f' 처음부터 다시. 카드 여러 장을 한 묶음으로(되돌리기도 한 번에)
  mark(session, cardIds, code, now = this.now()) {
    if (!['s', 'u', 'f'].includes(code)) throw new Error('모르는 표시: ' + code);
    const ev = cardIds.map(id => [id, this.put(id, code, now)]);
    if (session) session.undo.push({ ev, kind: 'mark', sinceNew: session.sinceNew });
    this.save(now); return ev;
  },
  // 마지막 한 번을 되돌려요. 돌려주는 값: 되돌린 첫 카드 id(없으면 null)
  undo(session, now = this.now()) {
    const u = session && session.undo.pop(); if (!u) return null;
    for (const [id, t] of u.ev) { this.data.log[id] = this.voidAt(this.data.log[id], t); this.recs[id] = this.replay(this.data.log[id]); }
    session.sinceNew = u.sinceNew; if (u.kind !== 'mark') session.done = Math.max(0, session.done - 1);
    this.save(now); return u.ev[0][0];
  },
  noteCards(card) { return VocabDecks.cards(card.deck).filter(c => c.key === card.key); },

  // ----- 아는 단어 한꺼번에 넘기기 (화면: vocab/app.js 의 viewKnown) -----
  has(str, code) { for (let i = 6; str && i < str.length; i += 7) if (str[i] === code) return true; return false; },
  // 아직 한 장도 안 본 노트: 카드가 모두 새 카드이고 넘기지도 않은 것을 덱 순서대로
  //   돌려주는 값: [{ key 노트 열쇠, deck, note, cards: [카드 id …], tpl: [카드 종류 …], passed }]
  //   passed: 넘기기 화면에서 이미 보고 지나갔거나('p') 넘겼다가 푼('u') 단어. 화면은 이것을 빼고 이어서 보여 줘요
  unseenNotes(deckIds) {
    const out = [];
    for (const id of deckIds) {
      const by = new Map();
      for (const c of VocabDecks.cards(id)) {
        let g = by.get(c.key); if (!g) { g = { key: c.key, deck: id, note: c.note, cards: [], tpl: [], passed: false, fresh: true }; by.set(c.key, g); }
        g.cards.push(c.id); g.tpl.push(c.tpl); const r = this.recs[c.id]; if (!r) continue;
        if (r.st !== 0 || r.susp) g.fresh = false; else if (this.has(this.data.log[c.id], 'p') || this.has(this.data.log[c.id], 'u')) g.passed = true;
      }
      for (const g of by.values()) if (g.fresh) out.push({ key: g.key, deck: g.deck, note: g.note, cards: g.cards, tpl: g.tpl, passed: g.passed });
    }
    return out;
  },
  // 넘기기 화면의 한 화면을 한 묶음으로 남겨요: known 의 카드는 's'(아는 단어로 넘김), passed 의 카드는 'p'(보고 지나감 — 간격 계산과 무관).
  //   되돌리기 한 번에 둘 다 풀려요. 이미 'p' 가 있는 카드에는 또 적지 않아요(기록이 불어나지 않게). 돌려주는 값: 남긴 사건 수
  sweep(session, knownIds, passedIds, now = this.now()) {
    const ev = knownIds.map(id => [id, this.put(id, 's', now)]);
    for (const id of passedIds) if (!this.has(this.data.log[id], 'p')) ev.push([id, this.put(id, 'p', now)]);
    if (!ev.length) return 0;
    if (session) session.undo.push({ ev, kind: 'mark', sinceNew: session.sinceNew });
    this.save(now); return ev.length;
  },

  // ----- 허브 카드용 요약 (core/hub.js 가 캐시에서 읽어요 — 허브는 덱 데이터 · 계산기를 불러오지 않아요) -----
  //   due 는 복습 카드의 「하루 번호 → 장 수」 표라서, 허브는 날이 바뀌어도 오늘 몫을 셀 수 있어요
  summary(now = this.now()) {
    const cfg = this.data.cfg; const today = this.day(now); const sum = { day: today, tz: cfg.tz, roll: cfg.roll, maxRev: cfg.maxRev, decks: {} };
    for (const d of VocabDecks.ready()) {
      const o = { name: d.name, total: 0, unseen: 0, known: 0, newPerDay: this.newLimit(d.id), extra: this.extraFor(d.id, today), intro: 0, rev: 0, learn: 0, due: {} };
      for (const c of VocabDecks.cards(d.id)) {
        o.total++; const r = this.recs[c.id];
        if (!r) { o.unseen++; continue; }
        if (r.intro && this.day(r.intro) === today) o.intro++; if (r.rev && this.day(r.rev) === today) o.rev++;
        if (r.susp) { o.known++; continue; }
        if (r.st === 0) o.unseen++; else if (r.st === 2) { const k = Math.min(this.day(r.due), today + 400); o.due[k] = (o.due[k] || 0) + 1; } else o.learn++;
      }
      sum.decks[d.id] = o;
    }
    return sum;
  },
};
