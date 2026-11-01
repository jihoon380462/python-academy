// =====================================================================
// === UI ===  (화면·스타일·연출)
// =====================================================================

// ---------- 마스코트 SVG ----------
const MASCOT_COLORS = ['#3cb371', '#ff8c42', '#5b8def'];
function mascotSVG({ stage = 0, mood = 'normal', color = 0, accessory = 'none', size = 64 } = {}) {
  const c = MASCOT_COLORS[color % MASCOT_COLORS.length]; const dark = '#1f4d33';
  const eyes = mood === 'happy' ? `<path d="M22 30 q4 -5 8 0" stroke="${dark}" stroke-width="2.5" fill="none"/><path d="M38 30 q4 -5 8 0" stroke="${dark}" stroke-width="2.5" fill="none"/>`
    : mood === 'confused' ? `<circle cx="26" cy="30" r="3" fill="${dark}"/><circle cx="42" cy="30" r="2" fill="${dark}"/><path d="M36 20 q6 -4 8 2" stroke="${dark}" stroke-width="2" fill="none"/>`
    : `<circle cx="26" cy="30" r="3" fill="${dark}"/><circle cx="42" cy="30" r="3" fill="${dark}"/><circle cx="27" cy="29" r="1" fill="#fff"/><circle cx="43" cy="29" r="1" fill="#fff"/>`;
  const mouth = mood === 'happy' ? `<path d="M28 40 q6 6 12 0" stroke="${dark}" stroke-width="2" fill="none"/>` : mood === 'confused' ? `<path d="M30 42 q4 -3 8 0" stroke="${dark}" stroke-width="2" fill="none"/>` : `<path d="M30 40 q4 3 8 0" stroke="${dark}" stroke-width="2" fill="none"/>`;
  const tongue = `<path d="M34 46 l0 6 l-3 3 M34 52 l3 3" stroke="#e05" stroke-width="2" fill="none"/>`;
  let body;
  if (stage === 0) body = `<ellipse cx="34" cy="38" rx="18" ry="22" fill="#f4f1de" stroke="#cbbf9a" stroke-width="2"/><path d="M22 36 l6 6 l5 -8 l6 7 l5 -6" stroke="#cbbf9a" stroke-width="2" fill="none"/><circle cx="28" cy="30" r="2" fill="${dark}"/><circle cx="40" cy="30" r="2" fill="${dark}"/>`;
  else body = `<path d="M12 58 q-8 -14 8 -18 q12 -3 10 -14" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="34" rx="18" ry="16" fill="${c}"/><ellipse cx="34" cy="36" rx="12" ry="8" fill="rgba(255,255,255,.25)"/>${eyes}${mouth}${stage >= 1 ? tongue : ''}`;
  let hat = '';
  if (stage >= 2 && stage < 3) hat = `<circle cx="26" cy="30" r="6" stroke="#333" stroke-width="2" fill="none"/><circle cx="42" cy="30" r="6" stroke="#333" stroke-width="2" fill="none"/><path d="M32 30 h4" stroke="#333" stroke-width="2"/>`;
  if (stage >= 3) hat += `<path d="M18 40 q-10 18 2 28 l10 -10 l-4 -16 z" fill="#c0392b" opacity=".9"/>`;
  if (stage >= 4) hat += `<path d="M22 20 l4 -10 l8 8 l8 -8 l4 10 z" fill="#f1c40f" stroke="#b8860b" stroke-width="1.5"/>`;
  if (stage >= 5) body = body.replace(new RegExp(c, 'g'), '#e6b800');
  const acc = {
    glasses: `<circle cx="26" cy="30" r="6" stroke="#2c3e50" stroke-width="2" fill="rgba(135,206,250,.3)"/><circle cx="42" cy="30" r="6" stroke="#2c3e50" stroke-width="2" fill="rgba(135,206,250,.3)"/><path d="M32 30 h4" stroke="#2c3e50" stroke-width="2"/>`,
    cap: `<path d="M16 22 q18 -14 36 0 l0 4 l-36 0 z" fill="#e74c3c"/><path d="M48 26 l10 0 l-2 4 l-8 0 z" fill="#c0392b"/>`,
    bow: `<path d="M44 16 l8 -5 l0 10 z M44 16 l-8 -5 l0 10 z" fill="#ff69b4"/><circle cx="44" cy="16" r="2" fill="#c2185b"/>`,
    scarf: `<path d="M18 46 q16 8 32 0 l0 6 q-16 8 -32 0 z" fill="#e67e22"/><path d="M40 50 l6 12" stroke="#e67e22" stroke-width="6" stroke-linecap="round"/>`,
    tophat: `<rect x="22" y="4" width="24" height="16" fill="#222"/><rect x="16" y="18" width="36" height="4" fill="#222"/><rect x="22" y="14" width="24" height="3" fill="#c0392b"/>`,
    wizard: `<path d="M34 -2 l16 24 l-32 0 z" fill="#5b3ea8"/><circle cx="36" cy="10" r="2" fill="#ffd700"/><circle cx="30" cy="16" r="1.5" fill="#ffd700"/>`,
    headphone: `<path d="M16 32 q0 -22 18 -22 q18 0 18 22" stroke="#333" stroke-width="3" fill="none"/><rect x="12" y="28" width="8" height="12" rx="3" fill="#333"/><rect x="48" y="28" width="8" height="12" rx="3" fill="#333"/>`,
    flower: `<circle cx="48" cy="18" r="3" fill="#ff6b6b"/><circle cx="52" cy="14" r="3" fill="#ff6b6b"/><circle cx="44" cy="14" r="3" fill="#ff6b6b"/><circle cx="48" cy="10" r="3" fill="#ff6b6b"/><circle cx="48" cy="14" r="2.5" fill="#ffd93d"/>`,
    halo: `<ellipse cx="34" cy="8" rx="14" ry="4" stroke="#ffd700" stroke-width="3" fill="none"/>`,
    crown2: `<path d="M20 20 l5 -12 l9 8 l9 -8 l5 12 z" fill="#ffd700" stroke="#b8860b"/><circle cx="25" cy="10" r="2" fill="#e74c3c"/><circle cx="34" cy="14" r="2" fill="#3498db"/><circle cx="43" cy="10" r="2" fill="#2ecc71"/>`,
  }[accessory] || '';
  return `<svg class="mascot" viewBox="0 0 68 68" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${body}${hat}${acc}</svg>`;
}
function myMascot(opts = {}) { const d = Store.data; return mascotSVG({ stage: Game.mascotStage(Game.level().level), color: d.mascotColor, accessory: d.settings.accessory, ...opts }); }

// ---------- 공통 UI 헬퍼 ----------
const UI = {
  view: null, params: null, history: [],
  toast(msg, ms = 2500) { const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg; $('#toasts').appendChild(t); requestAnimationFrame(() => t.classList.add('show')); setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, ms); },
  modal({ title, body, buttons = [{ label: T.close }], onOpen, wide }) {
    return new Promise(resolve => {
      const ov = document.createElement('div'); ov.className = 'modal-ov';
      ov.innerHTML = `<div class="modal ${wide ? 'wide' : ''}" role="dialog"><div class="modal-title">${title}</div><div class="modal-body">${body}</div><div class="modal-btns">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-i="${i}">${b.label}</button>`).join('')}</div></div>`;
      document.body.appendChild(ov); const close = (v) => { ov.remove(); resolve(v); };
      $$('.modal-btns button', ov).forEach(b => b.onclick = () => { const btn = buttons[+b.dataset.i]; if (btn.onClick && btn.onClick(ov) === false) return; close(btn.value !== undefined ? btn.value : +b.dataset.i); });
      ov.addEventListener('click', e => { if (e.target === ov && !buttons.some(b => b.block)) close(null); });
      if (onOpen) onOpen(ov);
    });
  },
  async confirm(msg, ok = '확인', cancel = '취소') { const r = await this.modal({ title: '확인', body: `<p>${msg}</p>`, buttons: [{ label: cancel, value: false }, { label: ok, cls: 'primary', value: true }] }); return r === true; },
  prompt(title, placeholder = '', value = '', opt = {}) { return new Promise(resolve => { const ov = document.createElement('div'); ov.className = 'modal-ov'; ov.innerHTML = `<div class="modal"><div class="modal-title">${title}</div><div class="modal-body">${opt.hint ? `<p class="muted" style="margin:0 0 8px;font-size:.92em;line-height:1.5">${opt.hint}</p>` : ''}<input class="input" placeholder="${esc(placeholder)}" value="${esc(value)}" maxlength="40" autocomplete="off" spellcheck="false"></div><div class="modal-btns"><button class="btn" data-a="c">${opt.cancel || T.close}</button><button class="btn primary" data-a="ok">${opt.ok || T.save}</button></div></div>`; document.body.appendChild(ov); const inp = $('input', ov); setTimeout(() => inp.focus(), 50); const done = (v) => { ov.remove(); resolve(v); }; $('[data-a=c]', ov).onclick = () => done(null); $('[data-a=ok]', ov).onclick = () => done(inp.value.trim() || null); inp.onkeydown = (e) => { if (e.key === 'Enter') done(inp.value.trim() || null); }; }); },
  isMobile() { return innerWidth < 768; },
  applyTheme() { const s = Store.data.settings; document.documentElement.dataset.theme = s.theme; document.documentElement.dataset.font = s.font; document.documentElement.dataset.anim = s.anim; const et = INVENTORY.editorTheme.find(x => x.id === s.editorTheme) || INVENTORY.editorTheme[0]; for (const k in et.css) document.documentElement.style.setProperty('--ed-' + k, et.css[k]); },
  go(view, params = {}, push = true) { if (push && this.view) this.history.push([this.view, this.params]); this.view = view; this.params = params; if (this.current && this.current.destroy) try { this.current.destroy(); } catch (e) {} this.current = null; Tutor.ui && Tutor.ui.close(); const root = $('#view'); root.className = 'view-' + view; root.scrollTop = 0; window.scrollTo(0, 0); const V = Views[view]; const seq = ++this._seq; const res = V(root, params); if (seq !== this._seq) return; /* 뷰 안에서 다른 화면으로 넘어간 경우 */ this.current = res || null; this.renderTopbar(); },
  _seq: 0,
  back() { const h = this.history.pop(); if (h) this.go(h[0], h[1], false); else this.go('home', {}, false); },
  renderTopbar() {
    const d = Store.data; const lv = Game.level(); const streak = Game.currentStreak();
    const title = this.view === 'lesson' || this.view === 'problem' ? (this.params.lessonTitle || '') : ({ home: T.home, playground: T.playground, badges: T.badges, profile: T.profile, settings: T.settings, inventory: T.inventory, glossary: T.glossary, errors: T.errorDict, weakness: T.weakness, review: T.review, challenge: T.dailyChallenge, timeattack: T.timeAttack, checkup: T.checkup }[this.view] || '');
    $('#topbar').innerHTML = `<button class="tb-btn" id="tbHome" title="${T.home}">${this.view === 'home' ? myMascot({ size: 30 }) : '🏠'}</button><div class="tb-title">${esc(title)}</div>
      <div class="tb-xp" title="레벨 ${lv.level} · ${Game.title(lv.level)}"><span class="tb-lv">Lv.${lv.level}</span><div class="xpbar"><div class="xpfill" style="width:${lv.need ? Math.round(100 * lv.into / lv.need) : 100}%"></div></div><span class="tb-xpn">${lv.into}/${lv.need || '최대'}</span></div>
      ${Game.combo >= 2 ? `<div class="tb-combo t${Game.combo >= 10 ? 3 : Game.combo >= 5 ? 2 : Game.combo >= 3 ? 1 : 0}" title="${T.combo}">⚡×${Game.combo}</div>` : ''}<div class="tb-streak ${streak ? 'on' : ''}" title="${T.streak}">🔥${streak}</div>
      ${typeof Sync !== 'undefined' && Sync.on ? `<button class="tb-btn tb-sync ${Sync.state}" id="tbSync" title="기기 연동: ${Sync.state === 'err' ? Sync.msg : '마지막 동기화 ' + Sync.ago() + ' (누르면 지금 동기화)'}">${Sync.icon()}</button>` : ''}<button class="tb-btn" id="tbSettings" title="${T.settings}">⚙</button>`;
    $('#tbHome').onclick = () => UI.go('home'); $('#tbSettings').onclick = () => UI.go('settings'); const sy = $('#tbSync'); if (sy) sy.onclick = () => { if (Sync.state === 'err') UI.toast('⚠ ' + Sync.msg); Sync.syncNow(true); };
  },
  // 연출
  async celebrate(events, anchorEl) {
    for (const ev of events) {
      if (ev.type === 'xp') { Confetti.burst(140); Audio.clear(); Haptic.tap(40); this.flyXp(ev.amount, ev.stars, anchorEl); if (ev.combo >= 3) { Audio.combo(ev.combo); } await sleep(500); }
      else if (ev.type === 'levelUp') { await this.levelUpOverlay(ev); }
      else if (ev.type === 'badge') { this.badgeFly(ev.badge); await sleep(400); }
      else if (ev.type === 'dailyGoal') { this.toast(`🎯 ${T.goalDone} +${CONFIG.DAILY_GOAL_BONUS} XP`); }
    }
    this.renderTopbar();
  },
  flyXp(amount, stars, anchor) { const el = document.createElement('div'); el.className = 'xp-fly'; el.innerHTML = `<div class="xp-num">+${amount} XP</div><div class="xp-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`; document.body.appendChild(el); const r = anchor ? anchor.getBoundingClientRect() : { left: innerWidth / 2 - 60, top: innerHeight / 2 }; el.style.left = Math.max(10, Math.min(innerWidth - 150, r.left)) + 'px'; el.style.top = (r.top - 20) + 'px'; setTimeout(() => el.remove(), 1600); },
  levelUpOverlay(ev) { return new Promise(res => { Audio.levelUp(); Confetti.rain(220); const ov = document.createElement('div'); ov.className = 'levelup-ov'; ov.innerHTML = `<div class="levelup"><div class="lu-mascot">${myMascot({ size: 120, mood: 'happy' })}</div><div class="lu-title">${T.levelUp}</div><div class="lu-level">Lv.${ev.level}</div>${ev.titleChanged ? `<div class="lu-newtitle">${T.newTitle}: <b>${ev.title}</b></div>` : ''}${ev.stageChanged ? `<div class="lu-stage">마스코트가 진화했어요!</div>` : ''}<button class="btn primary" id="luOk">계속</button></div>`; document.body.appendChild(ov); $('#luOk').onclick = () => { ov.remove(); res(); }; }); },
  badgeFly(b) { Audio.badge(); const el = document.createElement('div'); el.className = 'badge-fly'; el.innerHTML = `<div class="bf-icon">${b.icon}</div><div><div class="bf-t">${T.badgeGet}</div><div class="bf-n">${esc(b.name)}</div></div>`; document.body.appendChild(el); setTimeout(() => el.classList.add('in'), 20); setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 400); }, 2600); },
  shake(el) { if (!el || Store.data.settings.anim === 0) return; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); setTimeout(() => el.classList.remove('shake'), 500); },
  terms(html) { html = html.replace(/<b>(실행해 보기|실행|제출하기|힌트|정답 보기|선생님에게 물어보기|한 줄씩 보기|놀이터로 가져가기|다음|확인)<\/b>/g, (m, t) => `<span class="uibtn ${['실행해 보기','실행'].includes(t) ? 'primary' : t === '제출하기' || t === '확인' ? 'accent' : t === '선생님에게 물어보기' ? 'tutor' : ''}">${t === '실행해 보기' || t === '실행' ? '▶ ' : t === '힌트' ? '💡 ' : t === '선생님에게 물어보기' ? '💬 ' : t === '정답 보기' ? '🔓 ' : t === '제출하기' ? '✔ ' : ''}${t}</span>`); return html.replace(/\[\[([^\]]+)\]\]/g, (m, t) => GLOSSARY[t] ? `<dfn class="term" data-term="${esc(t)}" title="${esc(GLOSSARY[t])}">${esc(t)}</dfn>` : t); },
  bindTerms(root) { $$('dfn.term', root).forEach(d => d.onclick = (e) => { e.stopPropagation(); $$('.term-pop').forEach(p => p.remove()); const pop = document.createElement('div'); pop.className = 'term-pop'; pop.innerHTML = `<b>${esc(d.dataset.term)}</b> ${esc(GLOSSARY[d.dataset.term])}`; document.body.appendChild(pop); const r = d.getBoundingClientRect(); pop.style.left = Math.min(innerWidth - 280, r.left) + 'px'; pop.style.top = (r.bottom + 6 + scrollY) + 'px'; const learned = Store.data.lessons.terms = Store.data.lessons.terms || {}; learned[d.dataset.term] = true; setTimeout(() => document.addEventListener('click', () => pop.remove(), { once: true }), 10); }); },
  annotate(code) { // 정답 코드에 줄마다 주석
    const rules = [[/^\s*import |^\s*from /, '도구 상자(모듈) 가져오기'], [/^\s*def /, '함수 정의 (이름과 재료)'], [/^\s*class /, '클래스(설계도) 정의'], [/^\s*return/, '결과를 돌려주고 함수 끝'], [/^\s*for .* in range/, '정해진 횟수만큼 반복'], [/^\s*for /, '하나씩 꺼내며 반복'], [/^\s*while True/, '멈출 때까지 무한 반복 (break로 탈출)'], [/^\s*while /, '조건이 참인 동안 반복'], [/^\s*if /, '조건 검사'], [/^\s*elif /, '앞 조건이 아니면 이 조건 검사'], [/^\s*else/, '모든 조건이 아닐 때'], [/^\s*try/, '에러가 날 수 있는 부분 시작'], [/^\s*except/, '에러가 났을 때 할 일'], [/^\s*break/, '반복 즉시 탈출'], [/^\s*continue/, '다음 회차로'], [/^\s*with open/, '파일 열기 (자동으로 닫힘)'], [/input\(\)/, '입력 받기 (문자열)'], [/\.append\(/, '리스트 끝에 추가'], [/\.pop\(/, '마지막 값 꺼내기'], [/^\s*print\(/, '화면에 출력'], [/\.write\(/, '파일에 쓰기'], [/\.read/, '파일 읽기'], [/^\s*[\w.\[\]"']+\s*\+=/, '값을 더해서 다시 저장'], [/^\s*self\.\w+\s*=/, '객체의 속성에 저장'], [/^\s*[\w, ]+\s*=\s*/, '변수에 값 저장']];
    return code.split('\n').map(l => { if (!l.trim() || l.trim().startsWith('#')) return l; const r = rules.find(([re]) => re.test(l)); return r ? `${l}  # ${r[1]}` : l; }).join('\n');
  },
  codeHtml(code) { return `<pre class="code">${esc(code)}</pre>`; },
  stars(n) { return `<span class="stars">${'★'.repeat(n)}<span class="dim">${'★'.repeat(3 - n)}</span></span>`; },
};

// ---------- 로딩 오버레이 (Pyodide) ----------
const Loader = {
  el: null,
  init() { this.el = $('#pyload'); Py.onState(() => this.render()); this.render(); },
  render() {
    const el = this.el; if (!el) return;
    if (Py.ready && Py.main && !this.mainNoticeShown) { this.mainNoticeShown = true; UI.toast('⚠ 이 환경에서는 보조 실행기로 동작해요. 무한루프 자동 중단이 없으니 while 조건을 꼭 확인하세요.', 6000); }
    if (Py.ready || Py.phase === 'idle') { el.classList.add('hide'); return; }
    el.classList.remove('hide');
    if (this.minimized) { el.innerHTML = `<button class="pl-pill ${Py.failed ? 'err' : ''}" id="plPill">${Py.failed ? (Py.sandboxed ? '⚠ 미리보기에선 실행 불가' : '⚠ 파이썬 엔진 연결 실패 · 다시 시도') : `🐍 ${Py.progress}%`}</button>`; $('#plPill').onclick = () => { this.minimized = false; if (Py.failed && !Py.sandboxed) Py.start(); this.render(); }; return; }
    if (Py.failed) { const sandbox = Py.sandboxed; el.innerHTML = `<div class="pl-box"><button class="pl-x" id="plHide" title="접기">✕</button><div class="pl-err">⚠ ${sandbox ? '이 미리보기 화면에서는 파이썬 엔진을 내려받을 수 없어요' : T.loadFail}</div><div class="pl-detail">${sandbox ? '파일을 저장한 뒤 Chrome 같은 브라우저에서 직접 열면 전부 동작해요. 설명과 퀴즈는 여기서도 볼 수 있어요.' : esc(Py.error || '')}</div>${sandbox ? '' : `<button class="btn primary" id="plRetry">${T.retry}</button>`}</div>`; const rb = $('#plRetry'); if (rb) rb.onclick = () => Py.start(); $('#plHide').onclick = () => { this.minimized = true; this.render(); }; return; }
    const phase = (Py.phase === 'init' ? '파이썬을 깨우는 중' : Py.phase === 'download' ? `파이썬 엔진 내려받는 중 (약 ${CONFIG.PYODIDE_SIZE_MB}MB)` : T.loadingPy) + (Py.main ? ' · 보조 실행기' : '');
    el.innerHTML = `<div class="pl-box"><button class="pl-x" id="plHide" title="접기">✕</button><div class="pl-mascot">${myMascot({ size: 56 })}</div><div class="pl-text">${phase}</div><div class="pl-bar"><div class="pl-fill" style="width:${Py.progress}%"></div></div><div class="pl-pct">${Py.progress}%</div><div class="pl-note">처음 한 번만 받아요. 그동안 설명과 퀴즈는 먼저 볼 수 있어요.</div></div>`;
    $('#plHide').onclick = () => { this.minimized = true; this.render(); };
  },
};

// ---------- 모바일 퀵 키 ----------
const QuickKeys = {
  el: null, target: null,
  init() { this.el = $('#quickkeys'); const keys = ['Tab', ':', '(', ')', '[', ']', '{', '}', '"', '=', ',', 'print', '←', '→']; this.el.innerHTML = keys.map(k => `<button data-k="${esc(k)}">${esc(k)}</button>`).join(''); $$('button', this.el).forEach(b => { b.addEventListener('pointerdown', (e) => { e.preventDefault(); this.press(b.dataset.k); }); }); },
  show(ed) { this.target = ed; if (UI.isMobile()) this.el.classList.add('show'); },
  hide() { this.el.classList.remove('show'); this.target = null; },
  press(k) { const ed = this.target; if (!ed) return; const pairs = { '(': '()', '[': '[]', '{': '{}', '"': '""' }; if (k === 'Tab') ed.insert('    ', 4); else if (k === '←') ed.moveCursor(-1); else if (k === '→') ed.moveCursor(1); else if (pairs[k]) ed.insert(pairs[k], 1); else ed.insert(k, k.length); ed.focus(); },
};
