// vocab/app.js — 영어 단어장 화면: 덱 목록 · 덱 개요 · 학습(카드) · 찾아보기 · 통계 · 설정. 계산은 vocab/core.js, 규칙과 남은 일은 specs/vocab.md
//   주소(해시): (없음) 덱 목록 · #deck/<덱 id|all> 덱 개요 · #study/<덱 id|all> 학습 · #known/<덱 id|all> 아는 단어 넘기기 · #browse 찾아보기 · #stats 통계
//   화면 흐름은 Anki 와 같아요: 덱 → 지금 학습 → 카드 앞면 → 「정답 보기」 → 다시 · 어려움 · 알맞음 · 쉬움(버튼 위에 다음에 나올 때)
const VocabApp = {
  view: 'decks', sel: null, ses: null, cur: null, pickInfo: null, waitTimer: null, kn: null,
  bq: '', bf: 'all', bn: 200,   // 찾아보기: 검색어 · 고른 상태 · 한 번에 그리는 줄 수
  RATES: [[1, 'again', '다시'], [2, 'hard', '어려움'], [3, 'good', '알맞음'], [4, 'easy', '쉬움']],
  KIND: { new: '새 카드', learn: '학습 중', rev: '복습' },
  // 스피커 그림(선 아이콘 — 이모지는 기기마다 다르게 보여서)
  sound(size = 22) { return `<svg class="v-ico" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6.5 9H3v6h3.5L11 19z"/><path d="M15.5 8.8a4.5 4.5 0 0 1 0 6.4"/><path d="M18.4 6a8.5 8.5 0 0 1 0 12"/></svg>`; },

  // ---------- 소리(브라우저의 읽어 주기 기능) ----------
  tts: {
    spoken: [],   // 검사가 무엇을 읽었는지 볼 때 써요
    ok() { return typeof speechSynthesis !== 'undefined' && typeof SpeechSynthesisUtterance !== 'undefined'; },
    voice() {
      const vs = speechSynthesis.getVoices().filter(v => /^en([-_]|$)/i.test(v.lang));
      return vs.find(v => /en[-_]US/i.test(v.lang) && /natural|google|samantha|aria|jenny|zira/i.test(v.name)) || vs.find(v => /en[-_]US/i.test(v.lang)) || vs[0] || null;
    },
    speak(text) {
      if (!this.ok() || !text) return false;
      try {
        speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = 0.95;
        const v = this.voice(); if (v) u.voice = v;
        speechSynthesis.speak(u); this.spoken.push(text); return true;
      } catch (e) { return false; }
    },
    stop() { try { if (this.ok()) speechSynthesis.cancel(); } catch (e) {} },
  },

  // ---------- 작은 도우미 ----------
  deckIds(sel) { if (sel === 'all') return VocabDecks.ready().map(d => d.id); const d = VocabDecks.byId[sel]; return d && d.notes.length ? [sel] : []; },
  deckName(sel) { return sel === 'all' ? '전체' : (VocabDecks.byId[sel] || {}).name || ''; },
  cnt(n, cls, cur) { return `<span class="vn ${cls}${n ? '' : ' zero'}${cur ? ' cur' : ''}">${n}</span>`; },
  // 예문에서 단어(와 forms 의 다른 모양)를 굵게. 글자는 조각마다 이스케이프해요
  hl(en, note) {
    // v2.46.5: 끝의 문장 부호 · '(Freeze! · I'm good. · bussin')를 떼고 골라요 — 속어 덱의 말이 예문에서 굵게 안 보이던 것
    const forms = [note.w, ...(note.forms || [])].map(x => String(x).replace(/[.!?,']+$/, '')).filter(x => /^[A-Za-z0-9][A-Za-z0-9' -]*$/.test(x)).sort((a, b) => b.length - a.length);
    if (!forms.length) return esc(en);
    const re = new RegExp('\\b(' + forms.map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')\\b', 'gi');
    let out = '', last = 0, m;
    while ((m = re.exec(en))) { out += esc(en.slice(last, m.index)) + '<b>' + esc(m[0]) + '</b>'; last = m.index + m[0].length; }
    return out + esc(en.slice(last));
  },
  // 같은 단어 한 장(v2.46.9): 다른 덱 카드로 보고 있는 단어는 그 대표 카드의 기록으로 상태를 보여요
  recId(id) { const c = VocabDecks.card(id); const rep = c && VocabCore.covered(c) ? VocabCore.repOf(c) : null; return rep ? rep.id : id; },
  deckShort(id) { return ({ base: '기초', slang: '속어', listen: '듣기', dev: '개발', acad: '학술' })[id] || VocabDecks.byId[id].name; },
  stOf(id) { const c = VocabDecks.card(id); return c ? VocabCore.stateOf(c) : 'new'; },   // 상태 셈은 코어 한 곳(통계도 같은 셈)
  stLabel(id) { const r = VocabCore.recs[this.recId(id)]; const s = this.stOf(id); return s === 'known' ? '아는 단어' : s === 'new' ? '새 카드' : s === 'rev' ? '복습' : r.st === 3 ? '다시 학습' : '학습 중'; },
  dueText(id, now) {
    const r = VocabCore.recs[this.recId(id)]; const s = this.stOf(id); if (s === 'new' || s === 'known') return '';
    if (s === 'learn') { const m = Math.ceil((r.due - now) / 60000); return m <= 0 ? '지금' : `${m}분 뒤`; }
    const d = VocabCore.day(r.due) - VocabCore.day(now); return d === 0 ? '오늘' : d < 0 ? `${-d}일 밀림` : `${d}일 뒤`;
  },
  dateText(ms) { const d = new Date(ms); return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; },
  afterChange() { if (Sync.on) Sync.schedulePush(30000); },   // 카드마다 올리지 않고, 30초 쉬면(또는 화면을 떠나면) 한 번
  saved(okFlag) { if (!okFlag) UI.toast('⚠ 저장하지 못했어요. 브라우저 저장 공간이 꽉 찼을 수 있어요', 4000); this.afterChange(); },

  // ---------- 상단바 ----------
  topbar() {
    const br = this.view === 'browse', st = this.view === 'stats';
    $('#topbar').innerHTML = `<a class="tb-btn tb-hub" href="../index.html" title="아카데미 허브로" aria-label="아카데미 허브로">${UI.icon('hub')}</a>
      <a class="tb-btn vt-tab ${br || st ? '' : 'on'}" href="#">덱</a><a class="tb-btn vt-tab ${br ? 'on' : ''}" href="#browse">찾아보기</a><a class="tb-btn vt-tab ${st ? 'on' : ''}" href="#stats">통계</a><div class="tb-title"></div>
      ${Sync.on ? `<button class="tb-btn tb-sync ${Sync.state}" id="tbSync" title="기기 연동: ${Sync.state === 'err' ? esc(Sync.msg) : '마지막 동기화 ' + Sync.ago() + ' (누르면 지금 동기화)'}">${Sync.icon()}</button>` : ''}${UI.isMobile() ? '' : `<button class="tb-btn only-pc" id="tbKeys" title="키보드 단축키 (?)" aria-label="키보드 단축키">${UI.icon('keys')}</button>`}<button class="tb-btn" id="tbSettings" title="단어장 설정" aria-label="단어장 설정">${UI.icon('settings')}</button>`;
    $('#tbSettings').onclick = () => this.settings();
    const k = $('#tbKeys'); if (k) k.onclick = () => this.shortcuts();
    const sy = $('#tbSync'); if (sy) sy.onclick = () => { if (Sync.state === 'err') UI.toast('⚠ ' + esc(Sync.msg)); Sync.syncNow(true); };
  },

  // ---------- 길 찾기 ----------
  route() {
    const [v, id] = location.hash.slice(1).split('/'); clearTimeout(this.waitTimer); this.tts.stop();
    if (v === 'browse' || v === 'stats') this.view = v;
    else if ((v === 'deck' || v === 'study' || v === 'known') && this.deckIds(id).length) { this.view = v; this.sel = id; }
    else this.view = 'decks';
    if (this.view !== 'known') this.kn = null;   // 넘기기 화면을 떠나면 고르던 것은 버려요(넘긴 것은 이미 저장됐어요)
    this.render();
  },
  render() {
    this.topbar(); window.scrollTo(0, 0);
    if (this.view === 'browse') return this.viewBrowse();
    if (this.view === 'stats') return this.viewStats();
    if (this.view === 'deck') return this.viewDeck();
    if (this.view === 'study') return this.viewStudy();
    if (this.view === 'known') return this.viewKnown();
    return this.viewDecks();
  },
  // 기록이 밖에서 바뀌었을 때(기기 연동 · 다른 탭 · 설정) 지금 화면을 다시 그려요. 답을 보고 있는 카드는 건드리지 않아요
  refresh() { if (this.view === 'study') { if (!this.cur || !this.cur.shown) this.nextCard(); } else if (this.view === 'known' && this.kn) this.knownRefresh(); else this.render(); },

  // ---------- 덱 목록 ----------
  viewDecks() {
    const now = VocabCore.now(); const today = VocabCore.day(now); const ready = VocabDecks.ready();
    const row = (sel, name, desc, tag) => { const c = VocabCore.scan(this.deckIds(sel), now).counts; return `<a class="vd-row" href="#deck/${esc(sel)}" data-deck="${esc(sel)}"><span class="vd-name">${esc(name)}${tag || ''}<span class="vd-desc">${esc(desc)}</span></span>${this.cnt(c.new, 'new')}${this.cnt(c.learn, 'learn')}${this.cnt(c.rev, 'rev')}</a>`; };
    const rows = VocabDecks.list.map(d => d.notes.length
      ? row(d.id, d.name, d.desc, d.sample ? `<span class="vd-tag">${d.notes.length <= 50 ? `표본 ${d.notes.length}개` : '채우는 중'}</span>` : '')
      : `<div class="vd-row soon"><span class="vd-name">${esc(d.name)}<span class="vd-desc">${esc(d.desc)}</span></span><span class="vd-soon">준비 중</span></div>`).join('');
    const seen = Object.values(VocabCore.recs).filter(r => r.last && VocabCore.day(r.last) === today).length;
    $('#view').innerHTML = `<div class="page vocab">
      <h1 class="v-h">영어 단어장</h1>
      <p class="muted v-lead">카드를 보고 뜻을 떠올린 뒤, 얼마나 잘 떠올랐는지 넷 중 하나를 눌러요. 잘 아는 카드는 점점 드물게, 헷갈리는 카드는 자주 나와요.</p>
      <div class="card v-decks"><div class="vd-row vd-head"><span>덱</span><span>새 카드</span><span>학습</span><span>복습</span></div>
        ${ready.length > 1 ? row('all', '전체', '모든 덱을 섞어서') : ''}${rows}</div>
      <div class="muted small v-foot">오늘 본 카드 ${seen}장 · 하루는 새벽 ${VocabCore.data.cfg.roll}시에 바뀌어요</div>
      <details class="card v-how"><summary>처음이라면 — 네 버튼은 이렇게 눌러요</summary><ol>
        <li><b>다시</b>: 못 떠올렸어요. 조금 뒤에 또 나와요.</li>
        <li><b>어려움</b>: 떠올리긴 했는데 오래 걸렸어요. 못 떠올렸으면 이것 말고 꼭 「다시」 를 눌러요.</li>
        <li><b>알맞음</b>: 떠올렸어요. 보통은 이걸 눌러요.</li>
        <li><b>쉬움</b>: 보자마자 알았어요. 훨씬 나중에 나와요.</li></ol>
        <p class="muted small">버튼 위의 글자(예: &lt;10분, 4일)는 그 버튼을 누르면 카드가 다시 나오는 때예요. 이미 아는 단어는 덱을 눌러 「아는 단어 한꺼번에 넘기기」 로, 한 장씩은 카드의 「더 보기」 에서 넘길 수 있어요.</p></details>
    </div>`;
  },

  // ---------- 덱 개요 ----------
  viewDeck() {
    const ids = this.deckIds(this.sel); const now = VocabCore.now(); const sc = VocabCore.scan(ids, now); const c = sc.counts; const todo = c.new + c.learn + c.rev;
    const wk = new Set(); const cards = ids.flatMap(id => VocabDecks.cards(id)).filter(x => { const k = VocabDecks.wordKey(x.note); if (wk.has(k)) return false; wk.add(k); return true; });   // 「전체」 에서도 같은 단어는 한 장(v2.46.9)
    const seen = cards.filter(x => this.stOf(x.id) !== 'new').length; const known = cards.filter(x => this.stOf(x.id) === 'known').length; const shared = cards.filter(x => VocabDecks.group(x).some(y => y.deck !== x.deck)).length;
    const d = VocabDecks.byId[this.sel]; const desc = this.sel === 'all' ? '모든 덱을 섞어서 봐요' : d.desc;
    const unseen = this.knownList(ids); const fresh = unseen.filter(x => !x.passed).length;   // fresh: 넘기기 화면에서 아직 안 보여 준 단어
    $('#view').innerHTML = `<div class="page vocab"><a class="btn sm" href="#">← 덱 목록</a>
      <div class="card v-over" style="margin-top:10px"><h2>${esc(this.deckName(this.sel))}</h2><div class="muted">${esc(desc)}</div>
        <div class="v-cnt"><div>${this.cnt(c.new, 'new')}<small>새 카드</small></div><div>${this.cnt(c.learn, 'learn')}<small>학습</small></div><div>${this.cnt(c.rev, 'rev')}<small>복습</small></div></div>
        ${this.limitRow(ids)}
        ${todo ? `<a class="btn primary big" id="vStart" href="#study/${esc(this.sel)}">지금 학습</a>` : `<div><b>오늘 할 카드를 다 했어요 🎉</b></div>${sc.moreNew ? `<div class="row center"><button class="btn" id="vMoreNew">새 카드 ${Math.min(5, sc.moreNew)}장 더 하기</button></div>` : ''}`}
        ${unseen.length ? `<div class="v-known"><a class="btn sm" id="vKnown" href="#known/${esc(this.sel)}">아는 단어 한꺼번에 넘기기</a>${fresh ? `<div class="muted small">아직 안 본 단어 ${fresh}개 — 아는 단어를 먼저 넘겨 두면 모르는 단어만 카드로 나와요.</div>` : ''}</div>` : ''}
        <div class="muted small" style="margin-top:14px">카드 ${cards.length}장 · 본 카드 ${seen}장${known ? ` · 아는 단어로 넘긴 카드 ${known}장` : ''}${shared ? `<br>다른 덱과 같은 단어 ${shared}개는 덱마다 따로 나오지 않고 한 장으로 봐요` : ''}</div>
        ${d && d.credit ? `<div class="muted small" style="margin-top:6px">${esc(d.credit)}</div>` : ''}</div></div>`;
    const mn = $('#vMoreNew'); if (mn) mn.onclick = () => { VocabCore.addExtra(ids, Math.min(5, sc.moreNew)); location.hash = '#study/' + this.sel; };
    const lb = $('#vLimit'); if (lb) lb.onclick = () => this.limitSheet(this.sel);
    $$('#view [data-limit]').forEach(b => { b.onclick = () => this.limitSheet(b.dataset.limit); });
  },
  // 덱 개요의 하루 한도 줄: 덱 하나는 단추 하나, 「전체」 는 덱마다 칩(누르면 그 덱의 시트)
  limitRow(ids) {
    if (this.sel !== 'all') return `<div class="v-limit"><button class="btn sm" id="vLimit">하루 새 카드 ${VocabCore.newLimit(this.sel)}장 · 바꾸기 ›</button></div>`;
    return `<div class="v-limit"><span class="muted small">하루 새 카드 — 누르면 바꿔요</span>${ids.map(id => `<button class="chip-btn" data-limit="${esc(id)}">${esc(VocabDecks.byId[id].name)} ${VocabCore.newLimit(id)}장</button>`).join('')}</div>`;
  },

  // ---------- 하루 한도 시트(v2.46.8 — 사용자가 고른 시안: 저장 단추 없이 누르거나 치면 바로 저장) ----------
  //   폰에서는 아래에서 올라오는 시트, 넓은 화면에서는 가운데 창(vocab.css .v-sheet). 「✓ 저장됨 · 되돌리기」 는 바로 앞 값으로 돌려요.
  //   직접 친 수는 치다 멈추면(0.5초) · Enter · 칸을 벗어날 때 · 창을 닫을 때 저장해요(15 를 치는 도중의 1 을 저장하지 않게)
  NEW_PICKS: [5, 10, 15, 20, 30], REV_PICKS: [[100, '100'], [200, '200'], [500, '500'], [9999, '제한 없음']],
  limitSheet(id) {
    const d = VocabDecks.byId[id]; if (!d) return; const cfg = VocabCore.data.cfg;
    let prev = null, timer = 0, direct = !this.NEW_PICKS.includes(VocabCore.newLimit(id));
    const body = `<div class="vs-h">하루 새 카드 <span class="muted small">(누르면 바로 저장)</span></div>
      <div class="chips" id="vlNew">${this.NEW_PICKS.map(n => `<button class="chip-btn" data-n="${n}">${n}</button>`).join('')}<button class="chip-btn" data-n="direct">직접…</button></div>
      <div class="vl-direct" id="vlDirect"><input class="input" id="vlInput" type="number" inputmode="numeric" min="0" max="${VocabCore.NEW_MAX}" aria-label="${esc(d.name)} 하루 새 카드"><span>장</span><span class="muted small">0 ~ ${VocabCore.NEW_MAX}</span></div>
      <div class="vl-info" id="vlInfo"></div>
      <div class="vs-h">하루 복습 상한 <span class="muted small">(덱마다 · 모든 덱 같은 값)</span></div>
      <div class="chips" id="vlRev"></div>
      <div class="muted small vl-note">복습이 상한을 넘으면 남은 복습은 다음 날로 미뤄져요</div>
      <div class="row vl-all"><button class="btn" id="vlAll"></button></div>`;
    const title = `<span>${esc(d.name)} · 하루 한도</span><span class="vl-saved" id="vlSaved" hidden>✓ 저장됨<button class="lnk" id="vlUndo">되돌리기</button></span>`;
    UI.modal({ title, body, buttons: [{ label: T.close }], onOpen: (ov) => {
      ov.classList.add('v-sheet'); const inp = $('#vlInput', ov);
      const paint = () => {
        const n = VocabCore.newLimit(id); const now = VocabCore.now(); const today = VocabCore.day(now); const cards = VocabDecks.cards(id);
        $$('#vlNew [data-n]', ov).forEach(b => b.classList.toggle('on', b.dataset.n === 'direct' ? direct : !direct && +b.dataset.n === n));
        $('#vlDirect', ov).hidden = !direct; if (direct && document.activeElement !== inp) inp.value = n;
        const left = cards.filter(c => this.stOf(c.id) === 'new').length;
        const intro = cards.filter(c => { const r = VocabCore.recs[c.id]; return r && r.intro && VocabCore.day(r.intro) === today; }).length;
        $('#vlInfo', ov).innerHTML = (!left ? '이 덱의 새 카드를 다 봤어요' : !n ? '새 카드를 꺼내지 않아요(복습만 해요)' : `새 카드 <b>${n}장</b>이면 안 본 카드 ${left.toLocaleString()}장을 <b>약 ${Math.ceil(left / n)}일</b> 뒤에 다 봐요`)
          + `<div class="muted small">오늘 이 덱에서 새 카드 ${intro}장을 봤어요 · 지금 남은 새 카드 ${VocabCore.scan([id], now).counts.new}장</div>`;
        const rv = cfg.maxRev; const picks = this.REV_PICKS.some(([v]) => v === rv) ? this.REV_PICKS : [...this.REV_PICKS, [rv, String(rv)]];
        $('#vlRev', ov).innerHTML = picks.map(([v, l]) => `<button class="chip-btn${v === rv ? ' on' : ''}" data-r="${v}">${l}</button>`).join('');
        const same = VocabDecks.ready().every(x => VocabCore.newLimit(x.id) === n); const all = $('#vlAll', ov);
        all.textContent = same ? `모든 덱이 ${n}장이에요` : `모든 덱을 ${n}장으로 맞추기`; all.disabled = same;
        $('#vlSaved', ov).hidden = !prev;
      };
      const behind = () => { if (this.view === 'deck') this.viewDeck(); else this.refresh(); };   // 뒤의 덱 화면 숫자도 바로(맨 위로 튀지 않게 덱 화면만)
      const apply = (fn) => { prev = { newPerDay: Object.assign({}, cfg.newPerDay), maxRev: cfg.maxRev }; this.saved(fn()); paint(); behind(); };
      const commit = () => {
        clearTimeout(timer); const s = inp.value.trim(); if (!/^[0-9]+$/.test(s)) return;
        const n = Math.min(VocabCore.NEW_MAX, +s); if (String(n) !== s) inp.value = n;
        if (n !== VocabCore.newLimit(id)) apply(() => VocabCore.setNewLimit(id, n));
      };
      $$('#vlNew [data-n]', ov).forEach(b => { b.onclick = () => {
        if (b.dataset.n === 'direct') { direct = true; paint(); inp.value = VocabCore.newLimit(id); inp.focus(); inp.select(); return; }
        direct = false; const n = +b.dataset.n; if (n !== VocabCore.newLimit(id)) apply(() => VocabCore.setNewLimit(id, n)); else paint();
      }; });
      inp.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(commit, 500); });
      inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); commit(); } });
      inp.addEventListener('change', commit);
      $('#vlRev', ov).onclick = (e) => { const b = e.target.closest('[data-r]'); if (b && +b.dataset.r !== cfg.maxRev) apply(() => VocabCore.setMaxRev(+b.dataset.r)); };
      $('#vlAll', ov).onclick = () => { const n = VocabCore.newLimit(id); apply(() => VocabCore.setNewLimit(VocabDecks.ready().map(x => x.id), n)); };
      $('#vlUndo', ov).onclick = () => { if (!prev) return; const p = prev; prev = null; this.saved(VocabCore.setCfg(p)); direct = !this.NEW_PICKS.includes(VocabCore.newLimit(id)); paint(); behind(); };
      // 창을 닫을 때(닫기 · 바깥 · Esc) 치던 수가 남았으면 저장
      $$('.modal-btns button', ov).forEach(b => b.addEventListener('click', commit, true)); ov.addEventListener('click', (e) => { if (e.target === ov) commit(); }, true);
      paint();
    } });
  },

  // ---------- 아는 단어 한꺼번에 넘기기 ----------
  //   아직 안 본 단어를 덱 순서대로 20개씩 보여 주고, 아는 것만 눌러 표시한 뒤 한꺼번에 「아는 단어」 로 넘겨요. 뜻은 일부러 안 보여 줘요(뜻을 보고 안다고 누르지 않게).
  //   한 화면을 넘기면 표시한 단어는 's', 나머지는 'p'(보고 지나감)로 남아요(VocabCore.sweep). 그래서 덱에 단어가 더 들어온 뒤 다시 와도 지나간 단어는 빼고 이어서 보여 줘요.
  //   「앞 화면으로」 는 그 화면에서 남긴 기록을 무효로 돌리고, 골랐던 그대로 다시 보여 줘요.
  KNOWN_PAGE: 20,
  // 넘기기 화면에 올릴 수 있는 노트: 아직 안 본 것 가운데 읽기 카드가 있는 것. 글자를 보고 고르는 화면이라, 소리로만 배우는 노트(듣기 덱)는 올리지 않아요
  knownList(ids) { return VocabCore.unseenNotes(ids).filter(x => x.tpl.includes('r')); },
  // again: 전에 보고 지나간 단어도 다시 보여 줘요
  knownStart(again) {
    const ids = this.deckIds(this.sel); const passed = this.knownList(ids).filter(x => x.passed).length;
    this.kn = { sel: this.sel, ses: VocabCore.session(ids), again: !!again, skipped: again ? 0 : passed, shown: new Set(), picked: new Set(), page: null, low: 0, hist: [], total: 0 };
  },
  knownPage() { const kn = this.kn; return this.knownList(this.deckIds(kn.sel)).filter(x => !kn.shown.has(x.key) && (kn.again || !x.passed)).slice(0, this.KNOWN_PAGE); },
  viewKnown() {
    if (!this.kn || this.kn.sel !== this.sel) this.knownStart(false);
    const kn = this.kn; if (!kn.page) kn.page = this.knownPage();
    const page = kn.page; const sel = esc(this.sel);
    const back = kn.hist.length ? '<div class="row"><button class="btn sm" id="vkBack">← 앞 화면으로</button></div>' : '';
    const lead = kn.hist.length ? '뜻이 바로 떠오르는 단어만 눌러요.' : '뜻이 바로 떠오르는 단어만 눌러요. 헷갈리는 단어는 누르지 않아요 — 카드로 배우는 게 나아요. 넘긴 단어는 카드로 나오지 않고, 찾아보기의 「아는 단어」 에서 언제든 되돌릴 수 있어요.';
    const again = kn.skipped ? `<button class="btn sm" id="vkAgain">지나간 단어 ${kn.skipped}개도 다시 보기</button>` : '';
    const warn = kn.low >= 2 ? `<div class="card vk-warn"><span><b>여기부터는 모르는 단어가 더 많아 보여요.</b> 남은 단어는 카드로 배우는 게 좋아요.</span><a class="btn sm primary" href="#study/${sel}">지금 학습</a></div>` : '';
    const body = page.length
      ? `${kn.skipped ? `<div class="muted small vk-skip">전에 보고 지나간 단어 ${kn.skipped}개는 빼고 보여 줘요. ${again}</div>` : ''}${warn}
        <div class="vk-grid">${page.map(x => `<button class="vk-w${kn.picked.has(x.key) ? ' on' : ''}" data-k="${esc(x.key)}" lang="en" aria-pressed="${kn.picked.has(x.key)}">${esc(x.note.w)}</button>`).join('')}</div>
        <div class="muted small v-foot" id="vkCount"></div>
        <div class="vk-act"><button class="btn" id="vkAll"></button><button class="btn primary" id="vkNext"></button></div>`
      : `<div class="card v-done"><h2>${kn.hist.length ? '끝까지 봤어요' : '넘길 단어가 없어요'}</h2><p class="muted">${kn.hist.length ? `이번에 ${kn.total}개를 아는 단어로 넘겼어요. 나머지는 카드로 나와요.` : '아직 안 본 단어를 모두 한 번씩 봤어요.'}</p><div class="row center">${again}<a class="btn primary" href="#deck/${sel}">덱으로 돌아가기</a></div></div>`;
    $('#view').innerHTML = `<div class="page vocab"><a class="btn sm" href="#deck/${sel}">← 덱</a>
      <h1 class="v-h">아는 단어 넘기기</h1>
      ${page.length ? `<p class="muted v-lead">${lead}</p>` : ''}
      ${body}${back}</div>`;
    const on = (id, fn) => { const el = $(id); if (el) el.onclick = fn; };
    const labels = () => {
      if (!page.length) return; const n = kn.picked.size;
      $('#vkCount').textContent = `이 화면 ${page.length}개 중 ${n}개 표시 · 이번에 넘긴 단어 ${kn.total}개`;
      $('#vkAll').textContent = n === page.length ? '표시 모두 지우기' : '이 화면 전부 알아요';
      $('#vkNext').textContent = n ? `표시한 ${n}개 넘기고 다음` : '아는 단어 없음 · 다음';
    };
    const paint = () => { $$('.vk-w').forEach(b => { const v = kn.picked.has(b.dataset.k); b.classList.toggle('on', v); b.setAttribute('aria-pressed', v); }); labels(); };
    // 표시는 화면을 다시 그리지 않고 그 단추만 바꿔요(키보드로 누를 때 초점이 그대로 있게)
    $$('.vk-w').forEach(b => { b.onclick = () => { const k = b.dataset.k; if (kn.picked.has(k)) kn.picked.delete(k); else kn.picked.add(k); paint(); }; });
    on('#vkAll', () => { if (kn.picked.size === page.length) kn.picked.clear(); else page.forEach(x => kn.picked.add(x.key)); paint(); });
    on('#vkNext', () => {
      const pick = page.filter(x => kn.picked.has(x.key)); const rest = page.filter(x => !kn.picked.has(x.key));
      const wrote = VocabCore.sweep(kn.ses, pick.flatMap(x => x.cards), rest.flatMap(x => x.cards)); if (wrote) this.saved(VocabCore.saveOk);
      kn.hist.push({ page, picked: kn.picked, n: pick.length, low: kn.low, wrote: !!wrote });
      kn.total += pick.length; kn.low = pick.length * 2 < page.length ? kn.low + 1 : 0;   // 아는 단어가 절반이 안 되는 화면이 두 번 이어지면 그만하자고 알려요
      page.forEach(x => kn.shown.add(x.key)); kn.picked = new Set(); kn.page = null; this.viewKnown(); window.scrollTo(0, 0);
    });
    on('#vkBack', () => {
      const h = kn.hist.pop(); if (!h) return;
      if (h.wrote) { VocabCore.undo(kn.ses); this.saved(VocabCore.saveOk); }
      kn.total -= h.n; kn.low = h.low; h.page.forEach(x => kn.shown.delete(x.key)); kn.page = h.page; kn.picked = h.picked;
      this.viewKnown(); window.scrollTo(0, 0); UI.toast(h.n ? `넘긴 ${h.n}개를 풀었어요` : '앞 화면으로 돌아왔어요', 1500);
    });
    on('#vkAgain', () => { this.knownStart(true); this.viewKnown(); });
    labels();
    const first = $('.vk-w'); if (first) try { first.focus({ preventScroll: true }); } catch (e) {}
  },
  // 기록이 밖에서 바뀌었을 때: 그사이 다른 기기에서 배웠거나 넘긴 단어를 지금 화면에서 빼요. 고른 것이 없으면 화면을 새로 뽑아요
  knownRefresh() {
    const kn = this.kn; const live = new Set(this.knownList(this.deckIds(kn.sel)).map(x => x.key));
    for (const k of [...kn.picked]) if (!live.has(k)) kn.picked.delete(k);
    if (kn.page) { kn.page = kn.picked.size ? kn.page.filter(x => live.has(x.key)) : null; if (kn.page && !kn.page.length) kn.page = null; }
    this.viewKnown();
  },

  // ---------- 학습 ----------
  viewStudy() {
    if (!this.ses || this.ses.sel !== this.sel) this.ses = Object.assign(VocabCore.session(this.deckIds(this.sel)), { sel: this.sel });
    this.nextCard();
  },
  nextCard() {
    clearTimeout(this.waitTimer); const p = VocabCore.pick(this.ses); this.pickInfo = p;
    this.cur = p.card ? { card: p.card, kind: p.kind, shown: false, typed: '' } : null;
    this.renderStudy();
    if (this.cur && VocabCore.data.cfg.auto && this.cur.card.tpl !== 't') this.say();
  },
  cardHtml(cur) {
    const n = cur.card.note; const t = cur.card.tpl; const can = this.tts.ok();
    const word = `<div class="vc-word" lang="en">${esc(n.w)}</div>`;
    const sayBtn = can ? `<button class="vc-say" id="vSay" title="소리 듣기 (R)" aria-label="소리 듣기">${this.sound()}</button>` : '';
    const senses = n.ko.map(([pos, ko]) => `<div class="vc-sense"><span class="vc-pos">${esc(VocabDecks.POS[pos] || pos)}</span>${esc(ko)}</div>`).join('');
    const kind = `<div class="vc-kind">${this.sel === 'all' ? esc(VocabDecks.byId[cur.card.deck].name) + ' · ' : ''}${this.KIND[cur.kind]} · ${VocabDecks.TPL[t]}</div>`;
    if (!cur.shown) {
      if (t === 'l') return kind + (can ? `<button class="btn big" id="vSay">${this.sound()} 소리 듣기</button><div class="vc-hint">소리를 듣고 뜻을 떠올려 보세요</div>` : word + '<div class="vc-hint">이 기기는 영어 소리를 낼 수 없어서 글자로 보여 줘요</div>');
      if (t === 't') return kind + senses + '<input class="input vc-type" id="vType" placeholder="영어 철자를 쳐 보세요" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" lang="en">';
      return kind + word + sayBtn;
    }
    const ex = this.exHtml(n); const more = this.otherDecks(cur.card); const own = more ? `<div class="vc-deckh">${esc(VocabDecks.byId[cur.card.deck].name)}</div>` : '';
    const tail = ex + (n.note ? `<div class="vc-note">${esc(n.note)}</div>` : '') + (n.pron ? `<div class="vc-pron">소리: ${esc(n.pron)}</div>` : '');
    const hr = '<hr class="vc-hr" id="vAnswer">';
    if (t === 't') {
      const typed = (cur.typed || '').trim(); const right = typed.toLowerCase() === String(n.w).toLowerCase();
      const cmp = !typed ? '' : right ? `<div class="vc-typed"><span class="good">✓ ${esc(typed)}</span></div>` : `<div class="vc-typed">내가 친 것: <span class="bad">${esc(typed)}</span></div>`;
      return kind + senses + cmp + hr + word + sayBtn + tail + more;
    }
    return kind + word + sayBtn + hr + own + senses + tail + more;
  },
  exHtml(n) { const can = this.tts.ok(); return (n.ex || []).map(([en, ko]) => `<div class="vc-ex"><div class="vc-ex-en" lang="en">${this.hl(en, n)}${can ? `<button class="vc-say sm" data-say="${esc(en)}" title="예문 듣기" aria-label="예문 듣기">${this.sound(18)}</button>` : ''}</div><div class="vc-ex-ko">${esc(ko)}</div></div>`).join(''); },
  // 같은 단어 한 장(v2.46.9): 다른 덱에 있는 같은 단어의 뜻 · 예문 · 쓰임을 덱 이름 아래 모아요. 앞에서 나온 뜻과 글자까지 같은 뜻 줄은 한 번만
  otherDecks(card) {
    const others = VocabDecks.group(card).filter(x => x.deck !== card.deck); if (!others.length) return '';
    const shown = new Set(card.note.ko.map(([p, k]) => p + '|' + k)); const done = new Set();
    return others.map(x => { if (done.has(x.key)) return ''; done.add(x.key); const n = x.note;
      const ko = n.ko.filter(([p, k]) => !shown.has(p + '|' + k)); ko.forEach(([p, k]) => shown.add(p + '|' + k));
      return `<div class="vc-other"><div class="vc-deckh">${esc(VocabDecks.byId[x.deck].name)}</div>${ko.map(([pos, k]) => `<div class="vc-sense"><span class="vc-pos">${esc(VocabDecks.POS[pos] || pos)}</span>${esc(k)}</div>`).join('')}${this.exHtml(n)}${n.note ? `<div class="vc-note">${esc(n.note)}</div>` : ''}${n.pron ? `<div class="vc-pron">소리: ${esc(n.pron)}</div>` : ''}</div>`; }).join('');
  },
  renderStudy() {
    const p = this.pickInfo; const cur = this.cur; const c = p.counts; const ses = this.ses;
    const top = `<div class="v-top"><a class="btn sm" href="#deck/${esc(this.sel)}">← 덱</a><span class="v-deckname">${esc(this.deckName(this.sel))}</span></div>`;
    const counts = `<div class="v-counts" title="새 카드 + 학습 + 복습">${this.cnt(c.new, 'new', cur && cur.kind === 'new')}<span class="plus">+</span>${this.cnt(c.learn, 'learn', cur && cur.kind === 'learn')}<span class="plus">+</span>${this.cnt(c.rev, 'rev', cur && cur.kind === 'rev')}</div>`;
    const tools = `<div class="v-tools"><button class="btn sm" id="vUndo" title="되돌리기 (Z)" ${ses.undo.length ? '' : 'disabled'}>↶ 되돌리기</button>${cur ? '<button class="btn sm" id="vMore">더 보기</button>' : '<span></span>'}</div>`;
    let stage, action;
    if (!cur) {
      if (p.wait) {
        const m = Math.max(1, Math.ceil((p.wait - VocabCore.now()) / 60000));
        stage = `<div class="card v-done"><h2>잠깐 쉬어요</h2><p class="muted">약 ${m}분 뒤에 다시 볼 카드가 ${c.learn}장 있어요.</p><div class="row center"><button class="btn primary" id="vNow">지금 바로 보기</button><a class="btn" href="#">덱 목록으로</a></div></div>`;
        this.waitTimer = setTimeout(() => { if (this.view === 'study' && !this.cur) this.nextCard(); }, Math.min(15000, Math.max(1000, p.wait - VocabCore.now())));
      } else {
        stage = `<div class="card v-done"><h2>오늘 할 카드를 다 했어요 🎉</h2><p class="muted">이번에 ${ses.done}번 눌렀어요. 다음 카드는 잊을 때쯤 다시 나와요.</p><div class="row center">${p.moreNew ? `<button class="btn" id="vMoreNew">새 카드 ${Math.min(5, p.moreNew)}장 더 하기</button>` : ''}<a class="btn primary" href="#">덱 목록으로</a></div></div>`;
      }
      action = '';
    } else {
      stage = `<div class="card v-card" data-card="${esc(cur.card.id)}" data-shown="${cur.shown ? 1 : 0}">${this.cardHtml(cur)}</div>`;
      if (!cur.shown) action = '<button class="btn primary big v-show" id="vShow">정답 보기</button>';
      else { const lab = VocabCore.preview(cur.card.id); action = `<div class="v-rate">${this.RATES.map(([g, cls, name]) => `<button class="vr ${cls}" data-g="${g}" title="${name} (${g})"><small>${esc(lab[g])}</small><b>${name}</b></button>`).join('')}</div>`; }
    }
    $('#view').innerHTML = `<div class="v-study">${top}<div class="v-stage">${stage}</div><div class="v-bar">${counts}${action}${tools}</div></div>`;
    const on = (sel, fn) => { const el = $(sel); if (el) el.onclick = fn; };
    on('#vShow', () => this.show()); on('#vSay', () => this.say()); on('#vUndo', () => this.undo()); on('#vMore', () => this.more());
    on('#vMoreNew', () => { VocabCore.addExtra(this.ses.decks, Math.min(5, p.moreNew)); this.nextCard(); });
    on('#vNow', () => { const sc = VocabCore.scan(this.ses.decks); if (sc.learn.length) { this.cur = { card: sc.learn[0], kind: 'learn', shown: false, typed: '' }; this.pickInfo = Object.assign({}, p, { counts: sc.counts }); this.renderStudy(); } });
    $$('.vr').forEach(b => { b.onclick = () => this.rate(+b.dataset.g); });
    $$('[data-say]').forEach(b => { b.onclick = () => this.tts.speak(b.dataset.say); });
    const focus = $('#vType') || $('#vShow') || $('.vr.good'); if (focus) try { focus.focus({ preventScroll: true }); } catch (e) {}
  },
  // 소리: 노트의 say(기호 · 식을 읽는 말), 없으면 같은 단어 무리(다른 덱)의 say, 없으면 낱말 그대로(v2.46.9)
  sayText(card) { if (card.note.say) return card.note.say; const g = VocabDecks.group(card).find(x => x.note.say); return g ? g.note.say : card.note.w; },
  say() { if (this.cur) this.tts.speak(this.sayText(this.cur.card)); },
  show() {
    if (!this.cur || this.cur.shown) return;
    const ty = $('#vType'); if (ty) this.cur.typed = ty.value;
    this.cur.shown = true; this.renderStudy();
    if (this.cur.card.tpl === 't' && VocabCore.data.cfg.auto) this.say();
  },
  rate(g) {
    if (!this.cur || !this.cur.shown) return;
    VocabCore.answer(this.ses, this.cur.card.id, g); this.saved(VocabCore.saveOk);
    this.nextCard();
  },
  undo() {
    const id = VocabCore.undo(this.ses); if (!id) return;
    this.afterChange(); clearTimeout(this.waitTimer);
    const card = VocabDecks.card(id); const sc = VocabCore.scan(this.ses.decks);
    this.cur = { card, kind: VocabCore.kindOf(id), shown: false, typed: '' }; this.pickInfo = { counts: sc.counts, wait: 0, moreNew: sc.moreNew };
    this.renderStudy(); UI.toast('되돌렸어요', 1200);
  },
  // 「더 보기」: Anki 의 More 처럼 이 카드에만 하는 일
  more() {
    const cur = this.cur; if (!cur) return;
    UI.modal({ title: '더 보기', body: `<p class="muted" style="margin-top:0"><b lang="en">${esc(cur.card.note.w)}</b> 카드에 할 일을 골라요.</p><div style="display:flex;flex-direction:column;gap:8px"><button class="btn" id="vmKnown">이미 아는 단어예요 — 다시 안 나오게</button><button class="btn" id="vmInfo">카드 정보</button></div>`, buttons: [{ label: T.close }],
      onOpen: (ov) => {
        $('#vmKnown', ov).onclick = () => { ov.remove(); this.markKnown(cur.card); };
        $('#vmInfo', ov).onclick = () => { ov.remove(); this.info(cur.card.id); };
      } });
  },
  markKnown(card) {
    VocabCore.mark(this.view === 'study' ? this.ses : null, VocabCore.noteCards(card).map(c => c.id), 's'); this.afterChange();
    UI.toast(this.view === 'study' ? '아는 단어로 넘겼어요 · 되돌리기로 취소할 수 있어요' : '아는 단어로 넘겼어요', 2200);
    if (this.view === 'study') this.nextCard(); else this.render();
  },

  // ---------- 카드 정보(학습 · 찾아보기 공용) ----------
  info(id) {
    if (!VocabDecks.card(id)) return; id = this.recId(id);   // 다른 덱 카드로 보는 같은 단어면 그 대표 카드의 기록 · 동작으로(v2.46.9)
    const card = VocabDecks.card(id); const n = card.note; const r = VocabCore.recs[id]; const now = VocabCore.now(); const st = this.stOf(id);
    const names = { 1: '다시', 2: '어려움', 3: '알맞음', 4: '쉬움', 0: '(되돌림)', s: '아는 단어로 넘김', u: '넘김 풀기', f: '처음부터 다시', p: '넘기기 화면에서 지나감' };
    const hist = VocabCore.parse(VocabCore.data.log[id] || '').slice(-6).map(([t, c]) => `${this.dateText(VocabCore.abs(t))} ${names[c] || c}`).join('<br>');
    const rows = [['덱', esc(VocabDecks.byId[card.deck].name)], ['카드 종류', VocabDecks.TPL[card.tpl]], ['상태', this.stLabel(id)]];
    { const ds = [...new Set(VocabDecks.group(card).map(x => x.deck))]; if (ds.length > 1) rows.push(['같은 단어', `${ds.map(x => esc(VocabDecks.byId[x].name)).join(' · ')} — 한 장으로 봐요`]); }
    if (st === 'rev' || st === 'learn') rows.push(['다음에 볼 때', `${this.dueText(id, now)} (${this.dateText(r.due)})`]);
    if (r && r.n) rows.push(['누른 횟수', `${r.n}번 · 틀린 횟수 ${r.lapses}번`]);
    if (r && r.st === 2) rows.push(['간격', VocabCore.daysLabel(r.sd)], ['안정도', `${r.s.toFixed(1)}일 (이만큼 지나면 떠올릴 확률 90%)`], ['난이도', `${r.d.toFixed(1)} / 10`]);
    if (hist) rows.push(['최근 기록', hist]);
    const body = `<div class="vc-word" style="font-size:1.6em" lang="en">${esc(n.w)}</div>${n.ko.map(([pos, ko]) => `<div><span class="vc-pos" style="font-size:.8em">${esc(VocabDecks.POS[pos] || pos)}</span>${esc(ko)}</div>`).join('')}
      ${(n.ex || []).map(([en, ko]) => `<div style="margin-top:8px"><div lang="en">${this.hl(en, n)}</div><div class="muted">${esc(ko)}</div></div>`).join('')}${n.note ? `<div class="vc-note">${esc(n.note)}</div>` : ''}${this.otherDecks(card)}
      <table class="vi-table">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}</table>`;
    const done = (msg) => { this.afterChange(); UI.toast(msg, 1800); if (this.view === 'study') this.nextCard(); else this.render(); };
    const buttons = [];
    if (st === 'known') buttons.push({ label: '다시 배우기', onClick: () => { VocabCore.mark(null, VocabCore.noteCards(card).map(c => c.id), 'u'); done('다시 나오게 했어요'); } });
    else buttons.push({ label: '아는 단어로 넘기기', onClick: () => { this.markKnown(card); } });
    if (r && r.n) buttons.push({ label: '처음부터 다시', onClick: () => { VocabCore.mark(null, [id], 'f'); done('새 카드로 돌렸어요'); } });
    buttons.push({ label: T.close, cls: 'primary' });
    UI.modal({ title: '카드 정보', wide: true, body, buttons, onOpen: (ov) => { $$('[data-say]', ov).forEach(x => { x.onclick = () => this.tts.speak(x.dataset.say); }); } });   // 다른 덱 예문의 소리 단추(v2.46.9)
  },

  // ---------- 찾아보기 ----------
  viewBrowse() {
    const wk = new Set(); const all = [];   // 같은 단어는 한 줄(v2.46.9): 대표 카드(공부를 시작한 덱), 아직이면 먼저 나오는 덱의 카드
    for (const d of VocabDecks.ready()) for (const c of VocabDecks.cards(d.id)) { const k = VocabDecks.wordKey(c.note); if (wk.has(k)) continue; wk.add(k); all.push(VocabCore.repOf(c) || c); }
    const F = [['all', '전체'], ['new', '새 카드'], ['learn', '학습 중'], ['rev', '복습'], ['known', '아는 단어']];
    $('#view').innerHTML = `<div class="page vocab"><h1 class="v-h">찾아보기</h1><p class="muted v-lead">단어를 누르면 카드 정보가 열려요. 아는 단어로 넘긴 카드도 여기서 되돌릴 수 있어요.</p>
      <div class="vb-bar"><input class="input" id="vbQ" type="search" placeholder="단어나 뜻으로 찾기" value="${esc(this.bq)}" autocomplete="off" style="flex:1;min-width:180px"></div>
      <div class="vb-bar" id="vbF">${F.map(([k, l]) => `<button class="v-chip ${this.bf === k ? 'on' : ''}" data-f="${k}">${l}</button>`).join('')}</div>
      <div class="muted small v-foot" id="vbN"></div><div class="card vb-list" id="vbL"></div><div class="row center" id="vbMore"></div></div>`;
    const draw = () => {
      const now = VocabCore.now(); const q = this.bq.trim().toLowerCase();
      const hit = all.filter(c => (this.bf === 'all' || this.stOf(c.id) === this.bf) && (!q || String(c.note.w).toLowerCase().includes(q) || VocabDecks.group(c).some(x => x.note.ko.some(([, ko]) => ko.toLowerCase().includes(q)))));
      $('#vbN').textContent = `${hit.length}장${hit.length > this.bn ? ` 중 ${this.bn}장을 보여 줘요` : ''}`;
      $('#vbL').innerHTML = hit.slice(0, this.bn).map(c => { const st = this.stOf(c.id); const due = this.dueText(c.id, now); return `<button class="vb-row" data-id="${esc(c.id)}"><span class="vb-w"><span lang="en">${esc(c.note.w)}</span>${c.tpl !== 'r' ? ` <small class="vb-tpl">${VocabDecks.TPL[c.tpl]}</small>` : ''}${(() => { const ds = [...new Set(VocabDecks.group(c).map(x => x.deck))]; return ds.length > 1 ? ` <small class="vb-tpl">${ds.map(x => this.deckShort(x)).join(' · ')}</small>` : ''; })()}</span><span class="vb-ko">${esc(c.note.ko.map(([, ko]) => ko).join(' · '))}</span><span class="vb-st"><span class="vn ${st === 'known' ? 'zero' : st}">${this.stLabel(c.id)}</span>${due ? `<small>${due}</small>` : ''}</span></button>`; }).join('') || '<div class="muted" style="padding:14px">맞는 카드가 없어요.</div>';
      $('#vbMore').innerHTML = hit.length > this.bn ? '<button class="btn" id="vbMoreBtn">더 보기</button>' : '';
      const mb = $('#vbMoreBtn'); if (mb) mb.onclick = () => { this.bn += 200; draw(); };
      $$('.vb-row').forEach(b => { b.onclick = () => this.info(b.dataset.id); });
    };
    let timer = null; $('#vbQ').oninput = (e) => { this.bq = e.target.value; this.bn = 200; clearTimeout(timer); timer = setTimeout(draw, 120); };
    $$('#vbF .v-chip').forEach(b => { b.onclick = () => { this.bf = b.dataset.f; this.bn = 200; $$('#vbF .v-chip').forEach(x => x.classList.toggle('on', x === b)); draw(); }; });
    draw();
  },

  // ---------- 통계 (specs/vocab.md W5 — 사용자가 고른 시안 「1 + 3」: 한 장 요약 + 날마다 맞힌 비율 선 그래프) ----------
  // 위에서 아래로: 오늘 · 최근 30일 누른 횟수 · 복습 맞힌 비율 · 앞으로 30일 복습 · 카드 상태. 모든 덱을 합친 숫자예요. 계산은 VocabCore.stats
  //   막대 · 날짜 칸을 누르면(PC 는 마우스를 올리면) 그날 숫자가 그래프 위에 떠요. 키보드는 ← → 로 옆 날짜
  //   색은 차트 전용 토큰(--st-*, vocab.css): 라이트 · 다크 바탕에서 색약 검사를 통과한 단계. 쌓는 순서는 복습 · 새 카드 · 학습(빨강과 초록이 맞닿지 않게)
  ST_DAYS: 30,
  stDate(d, wd) { const x = new Date(d * VocabCore.DAY); return `${x.getUTCMonth() + 1}월 ${x.getUTCDate()}일${wd ? `(${'일월화수목금토'[x.getUTCDay()]})` : ''}`; },   // 하루 번호 → 그 공부 날의 달력 날짜
  viewStats() {
    const s = VocabCore.stats(VocabCore.now(), this.ST_DAYS); const D = s.days, t = D[D.length - 1], F = s.due, S = s.states;
    const tot = (x) => x.new + x.learn + x.rev; const sum = (k) => D.reduce((a, x) => a + x[k], 0); const pct = (a, b) => Math.round(100 * a / b); const f = (n) => n.toLocaleString('ko-KR');
    const all = sum('new') + sum('learn') + sum('rev'), rv = sum('rev'), ag = sum('again'); const lows = D.filter(x => x.rev >= 3).map(x => pct(x.rev - x.again, x.rev));
    const sec = (id, title, small, body) => `<section class="card st-card" id="${id}"><h2 class="st-h">${title}${small ? `<small>${small}</small>` : ''}</h2>${body}</section>`;
    const nums = (arr) => `<div class="st-nums">${arr.map(([v, l]) => `<div class="st-num"><b>${v}</b><small>${l}</small></div>`).join('')}</div>`;
    const empty = (msg) => `<p class="muted small st-empty">${msg}</p>`;
    $('#view').innerHTML = `<div class="page vocab st-page"><h1 class="v-h">통계</h1>
      <p class="muted v-lead">날마다 얼마나 눌렀는지, 복습을 얼마나 맞혔는지, 앞으로 얼마나 나올지 봐요. 모든 덱을 합친 숫자예요.</p>
      ${sec('stToday', '오늘', this.stDate(t.d, true), nums([[f(tot(t)), '누른 횟수'], [f(t.new), '새 카드'], [f(t.rev), '복습'], [t.rev ? pct(t.rev - t.again, t.rev) + '%' : '–', '복습 맞힘']]))}
      ${sec('stDays', '최근 30일', all ? `모두 ${f(all)}번` : '', all ? this.stBars(D) + this.stLegend([['rev', '복습', sum('rev')], ['new', '새 카드', sum('new')], ['learn', '학습', sum('learn')]]) : empty('최근 30일에 누른 카드가 없어요. 덱에서 공부를 시작하면 날마다 여기에 쌓여요.'))}
      ${sec('stAcc', '복습 맞힌 비율', '최근 30일', rv ? `<div class="st-big">${pct(rv - ag, rv)}%</div><p class="muted small st-meta">목표는 90%예요. 간격 계산기가 이만큼 기억하도록 다음 날짜를 정해요.</p>${this.stAcc(D)}${nums([[lows.length ? Math.min(...lows) + '%' : '–', '가장 낮은 날'], [f(ag) + '번', '다시 누름'], [f(rv) + '번', '복습']])}` : empty('아직 복습한 카드가 없어요. 새 카드를 배우고 하루 이틀 뒤부터 복습이 나와요.'))}
      ${sec('stDue', '앞으로 30일 복습', F.some(v => v) ? `내일 ${f(F[1])}장` : '', F.some(v => v) ? this.stDue(F, s.today) : empty('나올 복습 카드가 아직 없어요.'))}
      ${sec('stState', '카드 상태', `모두 ${f(S.total)}장`, this.stState(S))}
    </div>`;
    this.stTips($('#view .st-page'));
  },
  // 그래프 하나 = 누르는 곳 하나 · 키보드로 닿는 곳 하나(Tab 한 번). 날짜 칸은 단추가 아니에요 — 누른 자리에서 가장 가까운 날을 골라요(stTips).
  //   cur: 키보드로 닿으면 먼저 보여 줄 칸(오늘 · 앞으로 30일은 내일). 고른 날의 숫자는 숨은 알림 칸(st-live)으로 화면 읽기 프로그램도 읽어요
  stChart(label, cur, inner, cls = '') { return `<div class="st-chart${cls}" tabindex="0" role="group" aria-label="${esc(label)}. 왼쪽 · 오른쪽 화살표로 날짜를 옮기면 그날 숫자를 읽어 줘요" data-cur="${cur}">${inner}<div class="st-live" aria-live="polite"></div></div>`; },
  // 막대 그래프 틀: 왼쪽 2.75em 은 눈금 글자 자리(막대 · 막대 위 숫자와 안 겹치게), 흐린 선은 맨 위 · 가운데만, 아래 끝에 처음 · 끝 날짜
  stFrame(H, top, unit, cols, a, b) {
    const yl = (at, s) => `<span class="st-y" style="bottom:${at - 6}px">${s}</span>`;
    return `<div class="st-plot" aria-hidden="true" style="height:${H + 18}px"><div class="st-grid" style="bottom:${H}px"></div><div class="st-grid" style="bottom:${Math.round(H / 2)}px"></div>${yl(H, top + unit)}${yl(Math.round(H / 2), top / 2)}<div class="st-bars">${cols}</div></div>`
      + `<div class="st-axis" aria-hidden="true"><span>${a}</span><span>${b}</span></div>`;
  },
  stCol(tip, inner) { return `<span class="st-col" data-tip="${esc(tip)}"><span class="st-stack">${inner}</span></span>`; },
  // 최근 30일 누른 횟수: 쌓은 막대(아래부터 복습 · 새 카드 · 학습), 맨 위 칸만 둥근 끝, 오늘 막대에만 숫자
  stBars(D) {
    const tot = (x) => x.new + x.learn + x.rev; const top = Math.ceil(Math.max(1, ...D.map(tot)) / 10) * 10; const H = 112; const last = D.length - 1;
    const cols = D.map((x, i) => {
      const n = tot(x); const ks = ['rev', 'new', 'learn'].filter(k => x[k]);
      const segs = ks.map((k, j) => `<i class="st-seg ${k}${j === ks.length - 1 ? ' top' : ''}" style="height:${Math.max(2, Math.round(x[k] / top * H))}px"></i>`).join('');
      return this.stCol(`${i === last ? '오늘 · ' : ''}${this.stDate(x.d, true)}\n${n ? `${n}번 — 복습 ${x.rev} · 새 카드 ${x.new} · 학습 ${x.learn}` : '누른 카드 없음'}`, segs + (i === last && n ? `<em class="st-lab">${n}</em>` : ''));
    }).join('');
    return this.stChart('최근 30일 날마다 누른 횟수 막대그래프', last, this.stFrame(H, top, '번', cols, this.stDate(D[0].d), '오늘'));
  },
  // 앞으로 30일 복습: 날마다 나올 복습 카드(첫 칸은 오늘 — 밀린 것 포함), 내일 막대에만 숫자
  stDue(F, today) {
    const top = Math.ceil(Math.max(1, ...F) / 10) * 10; const H = 92;
    const cols = F.map((v, i) => this.stCol(`${i === 0 ? '오늘(밀린 것 포함)' : (i === 1 ? '내일 · ' : '') + this.stDate(today + i, true)}\n복습 ${v}장`,
      (v ? `<i class="st-seg rev top" style="height:${Math.max(2, Math.round(v / top * H))}px"></i>` : '') + (i === 1 && v ? `<em class="st-lab">${v}</em>` : ''))).join('');
    return this.stChart('앞으로 30일 날마다 나올 복습 카드 막대그래프', 1, this.stFrame(H, top, '장', cols, '오늘', this.stDate(today + F.length - 1)));
  },
  // 복습 맞힌 비율 선: 복습이 3번 이상인 날만 잇고(적은 날은 들쭉날쭉해서 — 숫자는 누르면 보여요), 빈 날에서 끊겨요. 목표 90% 점선.
  //   아래 끝은 가장 낮은 날보다 10% 아래, 많아야 70% — 선이 위에 몰리지 않게. 눈금 글자는 왼쪽 자리에 따로
  //   선(svg)은 폭에 맞춰 늘이고 굵기는 그대로(non-scaling-stroke), 점 · 글자는 HTML 이라 찌그러지지 않아요. 높이는 h px 로 정해져 있어요
  stAcc(D) {
    const PW = 300, h = 140, last = D.length - 1; const P = D.map(x => x.rev >= 3 ? Math.round(100 * (x.rev - x.again) / x.rev) : null);
    const lo = Math.max(0, Math.min(70, Math.floor((Math.min(100, ...P.filter(p => p !== null)) - 5) / 10) * 10));
    const X = (i) => 4 + i * (PW - 8) / last, Y = (p) => Math.round(8 + (100 - Math.max(lo, p)) / (100 - lo) * (h - 16));
    const pt = (i, p, cls = '') => `<i class="st-pt${cls}" style="left:${(X(i) / PW * 100).toFixed(2)}%;top:${Y(p)}px"></i>`;
    const yl = (p, s, dy = 0) => `<span class="st-y" style="top:${Y(p) - 6 + dy}px">${s}</span>`;
    let d = '', pts = '', end = -1;
    P.forEach((p, i) => { if (p === null) return; const join = i > 0 && P[i - 1] !== null; d += `${join ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p)} `; end = i; if (!join && (i === last || P[i + 1] === null)) pts += pt(i, p); });
    const hits = D.map((x, i) => `<span class="st-hit" data-tip="${esc(`${i === last ? '오늘 · ' : ''}${this.stDate(x.d, true)}\n${x.rev ? `맞힘 ${Math.round(100 * (x.rev - x.again) / x.rev)}% — 복습 ${x.rev}번 중 다시 ${x.again}번${x.rev < 3 ? '(3번이 안 돼 선에서 뺐어요)' : ''}` : '복습 없음'}`)}"></span>`).join('');
    return this.stChart('날마다 복습 맞힌 비율 선 그래프. 점선은 목표 90%', last, `<div class="st-plot" aria-hidden="true" style="height:${h}px">${yl(100, '100%')}${yl(90, '90%')}${yl(90, '목표', 13)}${yl(lo, lo + '%')}<div class="st-area">`
      + `<svg viewBox="0 0 ${PW} ${h}" preserveAspectRatio="none" width="100%" height="${h}"><line class="st-goal" x1="0" x2="${PW}" y1="${Y(90)}" y2="${Y(90)}"/><line class="st-base" x1="0" x2="${PW}" y1="${Y(lo)}" y2="${Y(lo)}"/><path class="st-line" d="${d.trim()}"/></svg>`
      + `${pts}${end >= 0 ? pt(end, P[end], ' end') : ''}<div class="st-hits">${hits}</div></div></div><div class="st-axis" aria-hidden="true"><span>${this.stDate(D[0].d)}</span><span>오늘</span></div>`, ' st-acc');
  },
  stLegend(items) { return `<div class="st-legend">${items.map(([k, l, n]) => `<span><i class="st-key ${k}"></i>${l} <b>${n.toLocaleString('ko-KR')}</b></span>`).join('')}</div>`; },
  // 카드 상태 띠(복습 · 아는 단어 · 학습 중 · 새 카드 — 맞닿는 색끼리 색약 검사 통과). 0 이 아닌 칸은 아주 적어도 보이게 최소 폭
  stState(S) {
    const ks = [['rev', '복습'], ['known', '아는 단어'], ['learn', '학습 중'], ['new', '새 카드']]; const w = ks.map(([k]) => S[k] ? Math.max(1.5, 100 * S[k] / S.total) : 0); const sc = 100 / (w.reduce((a, b) => a + b, 0) || 1);
    return `<div class="st-state" role="img" aria-label="${esc(ks.map(([k, l]) => `${l} ${S[k]}장`).join(', '))}">${ks.map(([k], i) => w[i] ? `<i class="st-seg ${k}" style="width:${(w[i] * sc).toFixed(2)}%"></i>` : '').join('')}</div>`
      + this.stLegend(ks.map(([k, l]) => [k, l, S[k]]));
  },
  // 그래프를 누르면(PC 는 마우스를 올리면) 누른 자리에서 가장 가까운 날의 숫자를 그래프 위에 띄워요. 다른 곳을 누르거나 Esc 면 닫혀요.
  //   키보드: 그래프에 Tab 으로 닿으면 cur 칸 숫자, ← → 로 옆 날짜, Home · End 로 처음 · 끝
  stTips(root) {
    let tip = null, cur = null;
    const hide = () => { if (tip) tip.remove(); if (cur) cur.classList.remove('on'); tip = cur = null; };
    const show = (c, say) => {
      const box = c.closest('.st-chart');
      if (c !== cur) {
        hide(); cur = c; c.classList.add('on'); tip = document.createElement('div'); tip.className = 'st-tip'; tip.setAttribute('aria-hidden', 'true'); tip.textContent = c.dataset.tip; box.appendChild(tip);
        const r = c.getBoundingClientRect(), br = box.getBoundingClientRect(); const x = r.left - br.left + r.width / 2;
        tip.style.left = Math.round(Math.max(0, Math.min(box.clientWidth - tip.offsetWidth, x - tip.offsetWidth / 2))) + 'px';
      }
      if (say) box.querySelector('.st-live').textContent = c.dataset.tip.replace('\n', ' ');
    };
    const cells = (box) => [...box.querySelectorAll('[data-tip]')];
    const near = (box, x) => { let best = null, bd = Infinity; for (const c of cells(box)) { const r = c.getBoundingClientRect(); const dd = Math.abs(r.left + r.width / 2 - x); if (dd < bd) { bd = dd; best = c; } } return best; };
    const chartOf = (el) => (el && el.closest ? el.closest('.st-chart') : null);
    root.addEventListener('click', (e) => { const box = chartOf(e.target); if (!box) { hide(); return; } const c = near(box, e.clientX); if (c) show(c, false); });
    // 마우스를 올려 보기는 마우스가 있는 기기에서만(폰은 누르기만). 「숫자가 떠 있는 그래프」 를 떠날 때만 닫아요
    if (window.matchMedia && matchMedia('(hover: hover)').matches) {
      root.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; const box = chartOf(e.target); if (!box) return; const c = near(box, e.clientX); if (c) show(c, false); });
      root.addEventListener('pointerout', (e) => { if (e.pointerType !== 'mouse' || !cur) return; const box = cur.closest('.st-chart'), to = e.relatedTarget; if (box.contains(e.target) && !(to && box.contains(to))) hide(); });
    }
    const isChart = (el) => !!(el && el.classList && el.classList.contains('st-chart'));
    root.addEventListener('focusin', (e) => { const box = e.target; if (!isChart(box) || !box.matches(':focus-visible')) return; const cs = cells(box); show(cs[Math.max(0, Math.min(cs.length - 1, +box.dataset.cur))], true); });
    root.addEventListener('focusout', (e) => { if (cur && e.target === cur.closest('.st-chart')) hide(); });
    root.addEventListener('keydown', (e) => {
      const box = e.target; if (!isChart(box)) return; if (e.key === 'Escape') { hide(); return; }
      const cs = cells(box); const i = cur && box.contains(cur) ? cs.indexOf(cur) : +box.dataset.cur;
      const j = e.key === 'ArrowLeft' ? i - 1 : e.key === 'ArrowRight' ? i + 1 : e.key === 'Home' ? 0 : e.key === 'End' ? cs.length - 1 : null; if (j === null) return;
      e.preventDefault(); const k = Math.max(0, Math.min(cs.length - 1, j)); box.dataset.cur = k; show(cs[k], true);
    });
  },

  // ---------- 설정 ----------
  // 화면 설정(테마 · 글자 크기)은 프로필 조각의 그 칸만 고쳐 써요 — 이 페이지가 들고 있는 다른 코스 기록으로 덮어쓰지 않게
  setSetting(k, v) {
    const p = Store._get(Store.KEYS.profile) || {}; p.settings = Object.assign({}, p.settings, { [k]: v }); p.updatedAt = Date.now();
    try { Store._set(Store.KEYS.profile, p); } catch (e) {}
    Store.data.settings[k] = v; Store.data.updatedAt = p.updatedAt; UI.applyTheme(); if (Sync.on) Sync.schedulePush();
  },
  settings() {
    const cfg = VocabCore.data.cfg; const s = Store.data.settings; const decks = VocabDecks.ready();
    const seg = (name, cur, opts) => `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button data-v="${v}" class="${String(cur) === String(v) ? 'on' : ''}">${l}</button>`).join('')}</div>`;
    const body = `<div class="vs-h">하루에 꺼낼 새 카드</div>
      ${decks.map(d => `<div class="vs-row"><span>${esc(d.name)}</span><input class="input" type="number" inputmode="numeric" min="0" max="200" data-new="${esc(d.id)}" value="${VocabCore.newLimit(d.id)}" aria-label="${esc(d.name)} 하루 새 카드"></div>`).join('')}
      <div class="vs-row"><span>덱마다 하루 복습 상한</span><input class="input" type="number" inputmode="numeric" min="10" max="9999" id="vsRev" value="${cfg.maxRev}" aria-label="하루 복습 상한"></div>
      <div class="vs-h">소리</div><div class="vs-row"><span>카드가 나오면 자동으로 읽어 주기</span>${seg('auto', cfg.auto ? 1 : 0, [[1, '켬'], [0, '끔']])}</div>
      ${this.tts.ok() ? '' : '<div class="muted small">이 브라우저는 읽어 주기 기능이 없어요.</div>'}
      <div class="vs-h">화면</div><div class="vs-row"><span>테마</span>${seg('theme', s.theme, [['dark', '다크'], ['light', '라이트']])}</div>
      <div class="vs-row"><span>글자 크기</span>${seg('font', s.font, [[0, '작게'], [1, '보통'], [2, '크게'], [3, '아주 크게']])}</div>
      <div class="vs-h">기록</div><div class="muted small">간격 계산은 FSRS-6, 목표 기억률 90%예요. 복습 기록은 이 브라우저에 저장되고, 허브 설정의 기기 연동을 켜면 폰과 PC 가 이어져요.</div>
      <div class="row"><button class="btn danger" id="vsReset">단어장 기록 초기화</button></div>`;
    UI.modal({ title: '단어장 설정', wide: true, body, buttons: [{ label: T.close }, { label: T.save, cls: 'primary', onClick: (ov) => {
      const np = Object.assign({}, cfg.newPerDay); $$('[data-new]', ov).forEach(i => { const v = clamp(Math.round(+i.value || 0), 0, 200); if (v === VocabDecks.byId[i.dataset.new].newPerDay) delete np[i.dataset.new]; else np[i.dataset.new] = v; });
      const okFlag = VocabCore.setCfg({ newPerDay: np, maxRev: clamp(Math.round(+$('#vsRev', ov).value || 200), 10, 9999), auto: $('[data-seg=auto] .on', ov).dataset.v === '1' });
      this.saved(okFlag); UI.toast('설정을 저장했어요', 1500); this.refresh();
    } }], onOpen: (ov) => {
      $$('.seg', ov).forEach(g => $$('button', g).forEach(b => { b.onclick = () => { $$('button', g).forEach(x => x.classList.toggle('on', x === b)); const k = g.dataset.seg; if (k === 'theme') this.setSetting('theme', b.dataset.v); if (k === 'font') this.setSetting('font', +b.dataset.v); }; }));
      $('#vsReset', ov).onclick = async () => {
        if (!await UI.confirm('단어장의 복습 기록을 모두 지울까요? 모든 카드가 새 카드로 돌아가요. 되돌릴 수 없어요.', '지우기')) return;
        if (!await UI.confirm('정말 지울까요? 연동된 다른 기기의 단어장 기록도 다음 동기화 때 지워져요.', '정말 지우기')) return;
        this.ses = null; this.saved(VocabCore.resetAll()); ov.remove(); UI.toast('단어장 기록을 지웠어요'); location.hash = ''; this.route();
      };
    } });
  },
  shortcuts() {
    const rows = [['Space · Enter', '정답 보기 / 답을 본 뒤에는 「알맞음」'], ['1 · 2 · 3 · 4', '다시 · 어려움 · 알맞음 · 쉬움'], ['R', '소리 다시 듣기'], ['Z', '되돌리기'], ['Esc', '창 닫기'], ['?', '이 안내']];
    return UI.modal({ title: '⌨ 키보드 단축키', body: `<table class="kb"><tbody>${rows.map(([k, v]) => `<tr><td><kbd>${esc(k)}</kbd></td><td>${esc(v)}</td></tr>`).join('')}</tbody></table><div class="muted small" style="margin-top:8px">학습 화면에서 써요. 철자를 치는 카드에서는 Enter 가 「정답 보기」 예요.</div>` });
  },
  onKey(e) {
    if (this.view !== 'study' || document.querySelector('.modal-ov') || e.ctrlKey || e.metaKey || e.altKey) return;
    const tag = e.target.tagName; const k = e.key;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) { if (k === 'Enter' && e.target.id === 'vType') { e.preventDefault(); this.show(); } return; }
    if (k === ' ' || k === 'Enter') { if (tag === 'BUTTON' || tag === 'A') return; /* 버튼 위에서는 브라우저가 누르기로 처리 */ e.preventDefault(); if (this.cur) { if (this.cur.shown) this.rate(3); else this.show(); } return; }
    if (this.cur && this.cur.shown && '1234'.includes(k)) { e.preventDefault(); this.rate(+k); return; }
    if (k === 'r' || k === 'R') { this.say(); return; }
    if (k === 'z' || k === 'Z') this.undo();
  },

  // ---------- 시작 ----------
  boot() {
    Store.load('python'); UI.applyTheme(); Offline.register('../sw.js');
    VocabCore.load(); VocabCore.saveCache();   // 허브 카드가 읽는 요약을 새로 만들고 「낡음」 표시를 지워요
    UI.renderTopbar = () => this.topbar(); UI.shortcuts = () => this.shortcuts();
    window.addEventListener('hashchange', () => this.route());
    document.addEventListener('keydown', (e) => this.onKey(e));
    // 기기 연동이 다른 기기의 기록을 받아 합쳤을 때 · 다른 탭이 저장했을 때: 저장된 것을 다시 읽어 화면에 반영
    window.addEventListener('academy:vocab', () => { VocabCore.load(); VocabCore.saveCache(); this.refresh(); });
    window.addEventListener('storage', (e) => {
      if (e.key === VocabCore.KEY) { VocabCore.load(); this.refresh(); }
      else if (e.key === Store.KEYS.profile) { const d = Store.assemble(); if (d) { Store.data = d; UI.applyTheme(); } }
    });
    Sync.hook = () => this.topbar();
    this.route(); Sync.init();
  },
};
window.addEventListener('DOMContentLoaded', () => VocabApp.boot());
