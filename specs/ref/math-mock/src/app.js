// 수학 교과서 화면 시안 — 한 파일에서 쪽 짜임(A · B · C) · 답 확인(가 · 나 · 다) · 목차(ㄱ · ㄴ)를 바꿔 봐요.
// 실제 사이트의 core/ui.css 와 교과서 화면(core/ui-views-book.js)의 마크업 · 클래스를 그대로 써요. 시안에만 있는 것은 mx- 로 시작해요.
// 주소 값: s=lesson|toc · v=A|B|C · k=1|2|3 · t=1|2 · p=쪽(A) · step=펼친 카드 수(C) · lines=예제 풀이 줄 수(C) · demo=1(답 확인 본보기 상태) · at=요소 id 로 스크롤 · bare=1(시안 고르기 줄 숨김)
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const Q = new URLSearchParams(location.search);
  const S = { s: Q.get('s') || 'lesson', v: Q.get('v') || 'A', k: Q.get('k') || '1', t: Q.get('t') || '1', p: +(Q.get('p') || 0), step: +(Q.get('step') || 1), lines: {}, open: {}, chOpen: { 1: true }, back: null };
  const bare = Q.get('bare') === '1';
  const L = LESSON, PARTS = L.parts;
  const CSTEPS = [...PARTS, { id: 'practice', kind: 'practice', title: '연습 문제', short: '연습 문제' }, { id: 'mistakes', kind: 'mistakes', title: '자주 하는 실수', short: '자주 하는 실수' }];
  if (Q.get('lines')) PARTS.filter(p => p.kind === 'example').forEach(p => { S.lines[p.id] = +Q.get('lines'); });
  if (Q.get('demo')) { if (S.k === '1') S.open[0] = true; else if (S.k === '2') S.open[0] = { a: true }; else S.open[0] = { n: 2 }; }
  const isMobile = () => matchMedia('(max-width:767px)').matches;
  const icon = (n) => `<svg class="ico" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_P[n] || ''}</svg>`;
  const topbar = (title) => { $('#topbar').innerHTML = `<a class="tb-btn tb-hub" href="#" title="아카데미 허브로" aria-label="아카데미 허브로">${icon('hub')}</a><button class="tb-btn" id="tbHome" title="목차" aria-label="목차">${icon('home')}</button><div class="tb-title">${esc(title)}</div>${isMobile() ? '' : `<button class="tb-btn only-pc" title="키보드 단축키" aria-label="키보드 단축키">${icon('keys')}</button>`}<button class="tb-btn" title="설정" aria-label="설정">${icon('settings')}</button>`; $('#tbHome').onclick = () => go({ s: 'toc' }); $('.tb-hub').onclick = (e) => e.preventDefault(); };
  const sync = () => { const q = new URLSearchParams(); q.set('s', S.s); if (S.s === 'lesson') { q.set('v', S.v); q.set('k', S.k); if (S.v === 'A') q.set('p', S.p); if (S.v === 'C') q.set('step', S.step); } else q.set('t', S.t); if (bare) q.set('bare', '1'); try { history.replaceState(null, '', location.pathname + '?' + q); } catch (e) {} };
  const go = (patch, keepScroll) => { Object.assign(S, patch); render(); sync(); if (!keepScroll) window.scrollTo(0, 0); };
  const flash = (el) => { if (!el) return; el.scrollIntoView({ block: 'start' }); el.classList.remove('bk-flash'); void el.offsetWidth; el.classList.add('bk-flash'); };

  // ---------- 같이 쓰는 조각 ----------
  const stepsHtml = (steps, upto) => `<ol class="mx-steps">${steps.slice(0, upto == null ? steps.length : upto).map(s => `<li><span>${s}</span></li>`).join('')}</ol>`;
  const ansHtml = (a) => `<div class="mx-ans"><b class="mx-ans-l">답</b><span>${a}</span></div>`;
  const partBody = (pt, lines) => {
    if (pt.kind !== 'example') return (pt.scene ? `<div class="lp-scene">${pt.scene}</div>` : '') + pt.html();
    const n = lines == null ? pt.steps.length : Math.min(lines, pt.steps.length), done = n >= pt.steps.length;
    return `<div class="mx-q"><span class="mx-q-l">문제</span>${pt.q}</div><p>${pt.lead}</p>${stepsHtml(pt.steps, n)}${lines != null && !done ? `<button class="btn sm mx-line" data-ex="${pt.id}">풀이 다음 줄 보기 <span class="muted">(${n}/${pt.steps.length})</span></button>` : ''}${done ? (pt.why ? `<p class="mx-why">${pt.why}</p>` : '') + (pt.after ? pt.after() : '') + ansHtml(pt.answer) : ''}`;
  };
  const partOf = (id) => CSTEPS.find(p => p.id === id);
  const practiceIntro = () => `<p class="muted">먼저 손으로 직접 풀어 보세요. 다 풀었으면 답을 펴서 맞춰 보고, 막히면 풀이를 보세요. 풀이 과정이 달라도 답이 같으면 맞아요.</p>`;
  const reveal = (t, i) => {
    const o = S.open[i] || {}, tot = t.steps.length;
    if (S.k === '1') return `<details class="bk-ans" data-ti="${i}" ${S.open[i] ? 'open' : ''}><summary><span class="bk-ans-m" aria-hidden="true"></span>답과 풀이 보기</summary>${ansHtml(t.answer)}<div class="lbl">풀이</div>${stepsHtml(t.steps)}</details>`;
    if (S.k === '2') return `<div class="mx-acts"><button class="btn sm" data-act="a" data-ti="${i}" aria-expanded="${!!o.a}">${o.a ? '답 숨기기' : '답만 보기'}</button><button class="btn sm" data-act="s" data-ti="${i}" aria-expanded="${!!o.s}">${o.s ? '풀이 숨기기' : '풀이 보기'}</button></div>${o.a ? ansHtml(t.answer) : ''}${o.s ? `<div class="lbl">풀이</div>${stepsHtml(t.steps)}` : ''}`;
    const n = o.n || 0;
    return `<div class="mx-acts"><button class="btn sm" data-act="a" data-ti="${i}" aria-expanded="${!!o.a}">${o.a ? '답 숨기기' : '답만 보기'}</button><button class="btn sm" data-act="n" data-ti="${i}" ${n >= tot ? 'disabled' : ''}>${n >= tot ? '풀이를 다 봤어요' : n ? '한 줄 더 보기' : '풀이 한 줄 보기'} <span class="muted">(${n}/${tot})</span></button>${n < tot ? `<button class="lnk" data-act="all" data-ti="${i}">전부 보기</button>` : ''}${n ? `<button class="lnk" data-act="r" data-ti="${i}">풀이 접기</button>` : ''}</div>${o.a ? ansHtml(t.answer) : ''}${n ? `<div class="lbl">풀이 — ${n < tot ? '여기까지 보고 다음 줄은 직접 해 보세요' : '끝까지'}</div>${stepsHtml(t.steps, n)}` : ''}`;
  };
  const practiceHtml = () => `<ol class="bk-tasks">${L.practice.map((t, i) => `<li class="card bk-task" id="task-${i}" data-ti="${i}"><div class="bk-task-h"><span class="bk-task-n">${i + 1}</span><b>${t.home ? '🏠 ' : ''}${esc(t.title)}</b></div><div class="bk-task-p lp-html">${t.q}</div>${reveal(t, i)}<div class="mx-see-w"><button class="lnk mx-see" data-see="${t.see}" data-ti="${i}">막히면 다시 보기: ${esc(partOf(t.see).short)} ›</button></div></li>`).join('')}</ol>`;
  const bindPractice = (root, rerender) => {
    $$('details.bk-ans', root).forEach(d => d.addEventListener('toggle', () => { S.open[+d.dataset.ti] = d.open; }));
    $$('[data-act]', root).forEach(b => b.onclick = () => { const i = +b.dataset.ti, o = (S.open[i] && typeof S.open[i] === 'object') ? S.open[i] : (S.open[i] = {}); const a = b.dataset.act; if (a === 'a') o.a = !o.a; else if (a === 's') o.s = !o.s; else if (a === 'n') o.n = Math.min((o.n || 0) + 1, L.practice[i].steps.length); else if (a === 'all') o.n = L.practice[i].steps.length; else if (a === 'r') o.n = 0; rerender(); });
  };
  const mistakesHtml = () => `<div class="mx-misses">${L.mistakes.map(m => `<div class="mx-miss"><b class="mx-miss-t">${m.t}</b><div class="mx-miss-r bad"><span class="mx-mark" aria-hidden="true">✗</span><span><span class="mx-miss-k">틀린 예</span>${m.bad}</span></div><div class="mx-miss-r good"><span class="mx-mark" aria-hidden="true">✓</span><span><span class="mx-miss-k">바른 예</span>${m.good}</span></div><p class="muted small">${m.tip}</p></div>`).join('')}</div>`;
  const crumb = () => `<div class="bk-crumb"><button class="lnk" id="bkHome">☰ 목차</button><span class="muted">/</span><span>레슨 ${L.n} <span class="muted">· ${esc(L.chName)}</span></span><span class="grow"></span><button class="lnk" id="bkDexL">📚 도감</button></div>`;
  const nextHint = () => `<p class="bk-next-hint muted small">다음: 레슨 ${L.next.n} 「${esc(L.next.title)}」 <span class="nw">· <button class="lnk" id="bkToc">☰ 목차로</button></span></p>`;
  const bindCommon = (root) => { const h = $('#bkHome', root); if (h) h.onclick = () => go({ s: 'toc' }); const t = $('#bkToc', root); if (t) t.onclick = () => go({ s: 'toc' }); $$('.mx-line', root).forEach(b => b.onclick = () => { const id = b.dataset.ex; S.lines[id] = (S.lines[id] || 1) + 1; render(); }); };

  // ---------- A. 쪽 넘기기 (지금 교과서와 같은 틀) ----------
  const viewA = (root) => {
    const total = PARTS.length + 1; S.p = Math.max(0, Math.min(S.p, total - 1)); const isPr = S.p === PARTS.length, pt = PARTS[S.p];
    const tabs = `<div class="bk-tabs">${PARTS.map((p, i) => `<button class="bk-tab ${i === S.p ? 'on' : ''}" data-pg="${i}" title="${esc(p.title)}">${i + 1}</button>`).join('')}<button class="bk-tab make ${isPr ? 'on' : ''}" data-pg="${PARTS.length}">✏️ 연습 문제</button></div>`;
    const body = isPr ? `<h1 class="lp-h">✏️ 연습 문제</h1>${practiceIntro()}${practiceHtml()}<h2 class="mx-h2">자주 하는 실수</h2><p class="muted">다 풀고 나서 한 번 훑어보세요.</p>${mistakesHtml()}` : `<h1 class="lp-h">${pt.title}</h1><div class="lp-body lp-html">${partBody(pt)}</div>`;
    root.innerHTML = `<div class="page bk-lesson">${S.back ? `<button class="btn bk-back" id="bkBack">← ${esc(S.back.label)}</button>` : ''}${crumb()}<div class="lp-kicker">${esc(L.title)}</div>${tabs}<article class="bk-art">${body}</article>
      <div class="bk-nav"><button class="btn" id="bkPrev" title="이전 쪽 (키보드 ←)" ${S.p === 0 ? 'disabled' : ''}>← 이전</button><button class="btn accent" id="bkNext" title="다음 쪽 (키보드 →)">${S.p < total - 1 ? (S.p === PARTS.length - 1 ? '✏️ 연습 문제 →' : '다음 →') : '다음 레슨 →'}</button></div>${isPr ? nextHint() : ''}</div>`;
    const to = (p) => go({ p, back: null });
    $$('.bk-tab', root).forEach(b => b.onclick = () => to(+b.dataset.pg));
    $('#bkPrev').onclick = () => { if (S.p > 0) to(S.p - 1); }; $('#bkNext').onclick = () => { if (S.p < total - 1) to(S.p + 1); };
    if ($('#bkBack')) $('#bkBack').onclick = () => { const b = S.back; go({ p: b.p, back: null }, true); flash($('#task-' + b.ti)); };
    $$('.mx-see', root).forEach(b => b.onclick = () => go({ p: PARTS.findIndex(p => p.id === b.dataset.see), back: { label: `연습 문제 ${+b.dataset.ti + 1}번으로 돌아가기`, p: PARTS.length, ti: +b.dataset.ti } }));
    bindPractice(root, () => { const y = scrollY; render(); scrollTo(0, y); }); bindCommon(root);
  };

  // ---------- B. 한 장 스크롤 ----------
  const viewB = (root) => {
    const firstOf = (k) => (PARTS.find(p => p.kind === k) || {}).id;
    const kick = Object.fromEntries([[firstOf('why'), '왜 배우나'], ...PARTS.filter(p => p.kind === 'concept').map((p, i) => [p.id, `개념 ${i + 1}`])]);
    const groups = [[firstOf('why'), '왜 배우나'], [firstOf('concept'), '개념'], [firstOf('example'), '예제'], ['practice', '연습'], ['mistakes', '실수']];
    const groupOf = (id) => { const p = PARTS.find(x => x.id === id); return p ? firstOf(p.kind) : id; };
    const sec = (id, title, body, k) => `<section class="mxb-sec" id="sec-${id}" data-sec="${id}"><h2 class="mxb-h">${k ? `<span class="mxb-k">${k}</span>` : ''}${title}</h2>${body}</section>`;
    root.innerHTML = `<div class="mxb-wrap"><nav class="mxb-rail" aria-label="이 레슨의 차례"><div class="lbl">이 레슨의 차례</div>${CSTEPS.map(p => `<button class="mxb-rl" data-go="${p.id}">${esc(p.short)}</button>`).join('')}</nav>
      <div class="page bk-lesson mxb-main">${crumb()}<h1 class="lp-h mxb-title">${esc(L.title)}</h1><p class="muted mxb-sub">${esc(L.sub)}</p>
      <div class="mxb-bar" aria-label="이 레슨의 차례">${groups.map(([id, name]) => `<button class="chip-btn" data-go="${id}" data-g="${id}">${name}</button>`).join('')}</div>
      <article class="bk-art">${PARTS.map(pt => sec(pt.id, pt.title, `<div class="lp-body lp-html">${partBody(pt)}</div>`, kick[pt.id])).join('')}
        ${sec('practice', '✏️ 연습 문제', practiceIntro() + practiceHtml())}${sec('mistakes', '자주 하는 실수', mistakesHtml())}</article>
      <div class="bk-nav"><button class="btn" id="bTop">↑ 맨 위로</button><button class="btn accent" id="bkNext">다음 레슨 →</button></div>${nextHint()}</div></div>`;
    const jump = (id) => { const el = $('#sec-' + id, root); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    $$('[data-go]', root).forEach(b => b.onclick = () => jump(b.dataset.go)); $('#bTop').onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
    $$('.mx-see', root).forEach(b => b.onclick = () => flash($('#sec-' + b.dataset.see, root)));
    const mark = (id) => { $$('.mxb-rl', root).forEach(x => x.classList.toggle('on', x.dataset.go === id)); $$('.mxb-bar .chip-btn', root).forEach(x => { const on = x.dataset.g === groupOf(id); x.classList.toggle('on', on); if (on && x.scrollIntoView && x.parentElement.scrollWidth > x.parentElement.clientWidth) x.parentElement.scrollLeft = x.offsetLeft - 16; }); };
    const spy = () => { const secs = $$('.mxb-sec', root); let cur = secs[0]; for (const s of secs) if (s.getBoundingClientRect().top <= 140) cur = s; mark(cur.dataset.sec); };
    if (viewB.off) viewB.off(); const on = () => { if (root.querySelector('.mxb-wrap')) spy(); }; addEventListener('scroll', on, { passive: true }); viewB.off = () => removeEventListener('scroll', on); spy();
    bindPractice(root, () => { const y = scrollY; render(); scrollTo(0, y); }); bindCommon(root);
  };

  // ---------- C. 단계 카드 ----------
  const viewC = (root) => {
    const tot = CSTEPS.length; S.step = Math.max(1, Math.min(S.step, tot));
    const body = (pt) => pt.kind === 'practice' ? practiceIntro() + practiceHtml() : pt.kind === 'mistakes' ? mistakesHtml() : `<div class="lp-body lp-html">${partBody(pt, pt.kind === 'example' ? (S.lines[pt.id] || 1) : null)}</div>`;
    const nx = CSTEPS[S.step];
    root.innerHTML = `<div class="page bk-lesson mxc">${crumb()}<div class="lp-kicker">${esc(L.title)}</div>
      <div class="mxc-prog"><span class="mxc-count"><b>${S.step}</b> / ${tot} 단계</span><div class="mxc-bar" role="progressbar" aria-valuemin="1" aria-valuemax="${tot}" aria-valuenow="${S.step}" aria-label="이 레슨의 진행"><i style="width:${Math.round(S.step / tot * 100)}%"></i></div>${S.step < tot ? '<button class="lnk" id="cAll">모두 펼치기</button>' : '<button class="lnk" id="cReset">처음부터</button>'}</div>
      <article class="bk-art mxc-list">${CSTEPS.slice(0, S.step).map((pt, i) => `<section class="card mxc-card ${i === S.step - 1 ? 'cur' : ''}" id="c-${pt.id}"><div class="mxc-h"><span class="bk-task-n">${i + 1}</span><h2>${pt.kind === 'practice' ? '✏️ ' : ''}${pt.title}</h2></div>${body(pt)}</section>`).join('')}</article>
      ${nx ? `<button class="btn accent mxc-next" id="cNext">다음 단계: ${esc(nx.short)} ↓</button><p class="muted small mxc-hint only-pc-hint">키보드 Enter 로도 넘어가요</p>` : `<div class="bk-nav"><button class="btn" id="cReset2">처음부터 다시</button><button class="btn accent" id="bkNext">다음 레슨 →</button></div>${nextHint()}`}</div>`;
    const next = () => { if (S.step >= tot) return; S.step++; render(); sync(); const el = $('#c-' + CSTEPS[S.step - 1].id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    viewC.next = next;
    if ($('#cNext')) $('#cNext').onclick = next; if ($('#cAll')) $('#cAll').onclick = () => { PARTS.forEach(p => { if (p.kind === 'example') S.lines[p.id] = p.steps.length; }); go({ step: tot }, true); };
    ['#cReset', '#cReset2'].forEach(s => { if ($(s)) $(s).onclick = () => { S.lines = {}; go({ step: 1 }); }; });
    $$('.mx-see', root).forEach(b => b.onclick = () => flash($('#c-' + b.dataset.see, root)));
    bindPractice(root, () => { const y = scrollY; render(); scrollTo(0, y); }); bindCommon(root);
  };

  // ---------- 목차 ----------
  const READ = new Set([0]); // 시안: 레슨 0 만 읽은 것으로
  const hero = () => `<div class="bk-hero"><div class="lp-kicker">📐 수학 교과서</div><h1 class="lp-h">읽고, 손으로 직접 풀어 보기</h1><p class="muted">레슨은 개념 설명과 예제 풀이예요. 레슨 끝 「연습 문제」 는 손으로 풀고 답을 맞춰 봐요. 채점·점수·잠금은 없어요 — 필요한 곳부터 펴 보면 돼요.</p><p class="muted small">지금은 중학교 1학년 범위예요(2022 개정 교육과정 순서).</p></div>
    <button class="card bk-dex-card" id="bkDex"><span class="bk-setup-ic">📚</span><span class="bk-dex-t"><b>수학 도감</b><span class="muted small">배운 용어 · 공식을 한곳에 — 검색해서 바로 찾기</span></span><span class="bk-go">›</span></button>`;
  const row = (l) => `<button class="bk-l" data-l="${l.n}"><span class="bk-l-n">${l.n}</span><span class="bk-l-t">${esc(l.title)}<span class="bk-l-sub muted">${esc(l.sub)}</span></span>${READ.has(l.n) ? '<span class="bk-done" aria-label="읽음">✓</span>' : ''}<span class="bk-go">›</span></button>`;
  const viewToc1 = (root) => {
    root.innerHTML = `<div class="page bk-home">${hero()}${TOC.map(c => `<section class="bk-ch"><h2 class="bk-ch-h"><span class="bk-ch-n">${String(c.ch).padStart(2, '0')}</span>${esc(c.name)}</h2><div class="bk-list">${c.lessons.map(row).join('')}</div></section>`).join('')}</div>`;
    $$('[data-l]', root).forEach(b => b.onclick = () => go({ s: 'lesson', p: 0, step: 1, back: null }));
  };
  const viewToc2 = (root) => {
    root.innerHTML = `<div class="page bk-home">${hero()}<div class="mxt-list">${TOC.map(c => { const open = !!S.chOpen[c.ch], a = c.lessons[0].n, b = c.lessons[c.lessons.length - 1].n, rd = c.lessons.filter(l => READ.has(l.n)).length;
      return `<section class="mxt-ch ${open ? 'open' : ''}"><button class="mxt-h" data-ch="${c.ch}" aria-expanded="${open}"><span class="bk-ch-n">${String(c.ch).padStart(2, '0')}</span><span class="mxt-t"><b>${esc(c.name)}</b><span class="muted small">${a === b ? `레슨 ${a}` : `레슨 ${a} ~ ${b}`} — ${c.lessons.map(l => esc(l.title)).join(', ')}</span></span><span class="mxt-r muted small">읽음 ${rd}/${c.lessons.length}</span><span class="mxt-chev" aria-hidden="true">${open ? '▾' : '▸'}</span></button>${open ? `<div class="bk-list">${c.lessons.map(row).join('')}</div>` : ''}</section>`; }).join('')}</div></div>`;
    $$('.mxt-h', root).forEach(b => b.onclick = () => { const ch = +b.dataset.ch; S.chOpen[ch] = !S.chOpen[ch]; const y = scrollY; render(); scrollTo(0, y); });
    $$('[data-l]', root).forEach(b => b.onclick = () => go({ s: 'lesson', p: 0, step: 1, back: null }));
  };

  // ---------- 시안 고르기 줄 (실제 화면에는 없어요) ----------
  const sw = () => { const el = $('#mkSw'); if (!el) return; const opt = (v, cur, label) => `<option value="${v}" ${v === cur ? 'selected' : ''}>${label}</option>`;
    el.innerHTML = `<b>시안 고르기</b><span class="mk-note">이 줄은 시안을 바꿔 보는 용도예요(실제 화면에는 없어요)</span>
      <label>화면 <select id="swS">${opt('lesson', S.s, '레슨')}${opt('toc', S.s, '목차')}</select></label>
      ${S.s === 'lesson' ? `<label>쪽 짜임 <select id="swV">${opt('A', S.v, 'A · 쪽 넘기기')}${opt('B', S.v, 'B · 한 장 스크롤')}${opt('C', S.v, 'C · 단계 카드')}</select></label><label>답 확인 <select id="swK">${opt('1', S.k, '가 · 한꺼번에')}${opt('2', S.k, '나 · 답 먼저, 풀이 따로')}${opt('3', S.k, '다 · 풀이 한 줄씩')}</select></label>` : `<label>목차 <select id="swT">${opt('1', S.t, 'ㄱ · 펼친 목록')}${opt('2', S.t, 'ㄴ · 챕터 접기')}</select></label>`}`;
    $('#swS').onchange = (e) => go({ s: e.target.value }); if ($('#swV')) $('#swV').onchange = (e) => go({ v: e.target.value, p: 0, step: 1, back: null }); if ($('#swK')) $('#swK').onchange = (e) => { S.open = {}; go({ k: e.target.value }, true); }; if ($('#swT')) $('#swT').onchange = (e) => go({ t: e.target.value }); };

  const render = () => {
    const root = $('#view'); if (viewB.off) { viewB.off(); viewB.off = null; }
    if (S.s === 'toc') { root.className = 'view-home'; topbar('홈'); (S.t === '2' ? viewToc2 : viewToc1)(root); }
    else { root.className = 'view-lesson'; topbar(isMobile() ? `레슨 ${L.n}` : L.title); ({ A: viewA, B: viewB, C: viewC }[S.v] || viewA)(root); }
    sw();
  };
  document.addEventListener('keydown', (e) => { const t = e.target || {}; if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName || '') || e.ctrlKey || e.metaKey || e.altKey) return; if (S.s !== 'lesson') return;
    if (S.v === 'A' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { e.preventDefault(); const total = PARTS.length + 1; const p = S.p + (e.key === 'ArrowRight' ? 1 : -1); if (p >= 0 && p < total) go({ p, back: null }); }
    else if (S.v === 'C' && e.key === 'Enter' && t.tagName !== 'BUTTON' && t.tagName !== 'SUMMARY') { e.preventDefault(); if (viewC.next) viewC.next(); } });
  if (bare) document.documentElement.classList.add('mk-bare');
  render();
  const at = Q.get('at'); if (at) requestAnimationFrame(() => { const el = document.getElementById(at); if (el) { scrollTo(0, Math.max(0, el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0))); dispatchEvent(new Event('scroll')); } });
})();
