// core/app.js — 교과서 코스 페이지의 바탕(v2.19.0 N13): 화면 등록부(Views) · 설정 · 용어집 · 에러 사전 · 한 줄씩 보기 패널 · 시작(boot).
//   레슨·목차·도감 화면은 core/ui-views-book.js. 예전 문제집 화면(문제 풀기·채점·XP·뱃지·복습·타자 연습·선생님 등)은
//   archive/classic/ 로 옮겼어요(전부 되돌리려면 브랜치 classic-v2.18.0).
const Views = {};

// ---------- 👣 한 줄씩 보기 패널 (알고리즘 교과서 레슨 예제 — core/ui-views-book.js 의 bindViz 가 씀) ----------
const TracePanel = {
  show(host, r, editor) {
    const steps = r.trace || []; if (!steps.length) { host.innerHTML = '<div class="muted">기록할 단계가 없어요.</div>'; return; }
    let i = 0;
    host.innerHTML = `<div class="trace"><div class="tr-head"><b>${T.stepRun}</b> <span class="muted" id="trPos"></span> ${r.truncated ? `<span class="warn">너무 길어서 ${CONFIG.TRACE_MAX_STEPS}단계까지만 보여줘요</span>` : ''}<button class="btn xs" id="trClose">${T.close}</button></div><div class="tr-ctrl"><button class="btn sm" id="trPrev">◀</button><input type="range" id="trSlider" min="0" max="${steps.length - 1}" value="0"><button class="btn sm" id="trNext">▶</button></div><div class="tr-body"><div class="tr-vars"><div class="tr-stack" id="trStack"></div><table id="trTable"></table></div><div class="tr-out"><div class="lbl">여기까지의 출력</div><pre id="trOut"></pre></div></div></div>`;
    let prev = {};
    const render = () => { const s = steps[i]; $('#trPos').textContent = `${i + 1}/${steps.length} · ${s.line}번 줄`; $('#trSlider').value = i; editor && editor.setTraceLine(s.line); $('#trStack').innerHTML = (s.stack || []).filter(x => x !== '<module>').map(n => `<span class="chip">${esc(n)}()</span>`).join(' → ') || '<span class="muted">메인</span>'; const rows = Object.entries(s.vars || {}); $('#trTable').innerHTML = rows.length ? `<tr><th>변수</th><th>값</th></tr>` + rows.map(([k, v]) => `<tr class="${prev[k] !== v ? 'changed' : ''}"><td>${esc(k)}</td><td><code>${esc(v)}</code></td></tr>`).join('') : '<tr><td class="muted">아직 변수가 없어요</td></tr>'; $('#trOut').textContent = s.out || ''; prev = { ...s.vars }; this.cur = s; };
    $('#trPrev').onclick = () => { if (i > 0) { i--; render(); } }; $('#trNext').onclick = () => { if (i < steps.length - 1) { i++; render(); } }; $('#trSlider').oninput = (e) => { i = +e.target.value; render(); }; $('#trClose').onclick = () => { host.innerHTML = ''; editor && editor.setTraceLine(null); this.cur = null; };
    render();
  },
  cur: null,
};

// ---------- 설정 ----------
Views.settings = (root) => {
  const s = Store.data.settings;
  root.innerHTML = `<div class="page settings"><h2>${T.settings}</h2>
    <div class="card"><div class="card-h">화면</div><div class="srow"><span>테마</span><div class="seg"><button data-theme="dark" class="${s.theme === 'dark' ? 'on' : ''}">다크</button><button data-theme="light" class="${s.theme === 'light' ? 'on' : ''}">라이트</button></div></div><div class="srow"><span>글자 크기</span><div class="seg">${[0, 1, 2, 3].map(i => `<button data-font="${i}" class="${s.font === i ? 'on' : ''}">${['작게', '보통', '크게', '아주 크게'][i]}</button>`).join('')}</div></div><div class="srow"><span>고대비</span><div class="seg"><button data-contrast="0" class="${!s.contrast ? 'on' : ''}">보통</button><button data-contrast="1" class="${s.contrast ? 'on' : ''}">높게</button></div></div><div class="srow"><span>애니메이션</span><div class="seg">${[0, 1, 2].map(i => `<button data-anim="${i}" class="${s.anim === i ? 'on' : ''}">${['끔', '약하게', '보통'][i]}</button>`).join('')}</div></div></div>
    <div class="card"><div class="card-h">찾아보기</div><div class="srow"><span>${T.glossary} / ${T.errorDict}</span><div class="row"><button class="btn sm" id="sGl">용어집</button><button class="btn sm" id="sEr">에러 사전</button></div></div></div>
    ${Sync.card()}
    <div class="card"><div class="card-h">진행 데이터 <small>${(Store.usage() / 1024).toFixed(0)}KB 사용</small></div><div class="muted small" style="margin-bottom:6px">이 사이트는 <b>완전 무료</b>이고 사이트 가입이 없어요. 읽은 레슨은 이 브라우저에만 저장되니 기기를 바꾸거나 브라우저 데이터를 지우기 전에 <b>백업 파일</b>을 받아 두거나 위의 <b>기기 연동</b>을 켜 두세요.</div><div class="row"><button class="btn" id="sExport">📤 백업 파일 저장 (모든 코스)</button><button class="btn" id="sImport">📥 가져오기</button><input type="file" id="sImportFile" accept=".json" style="display:none"></div><div class="srow" id="sOffline"><span>📴 오프라인 캐시</span><span class="muted small" id="sOfflineMsg">확인 중…</span></div><div class="row" style="margin-top:8px"><button class="btn danger" id="sReset">전체 초기화</button></div></div>
    <div class="muted small center">${T.appName} v${CONFIG.APP_VERSION}</div></div>`;
  const re = () => { Store.save(); UI.applyTheme(); UI.renderTopbar(); Views.settings(root); };
  $$('[data-theme]', root).forEach(b => b.onclick = () => { s.theme = b.dataset.theme; re(); });
  $$('[data-font]', root).forEach(b => b.onclick = () => { s.font = +b.dataset.font; re(); }); $$('[data-contrast]', root).forEach(b => b.onclick = () => { s.contrast = b.dataset.contrast === '1'; re(); });
  $$('[data-anim]', root).forEach(b => b.onclick = () => { s.anim = +b.dataset.anim; re(); });
  const back = { label: '설정으로 돌아가기', view: 'settings', params: {} };
  $('#sGl').onclick = () => UI.go('glossary', { back }); $('#sEr').onclick = () => UI.go('errors', { back });
  (async () => { const el = $('#sOfflineMsg'); if (!el) return; if (!/^https?:/.test(location.protocol) || !('serviceWorker' in navigator)) { el.textContent = '이 환경에선 쓸 수 없어요'; return; } const st = await Offline.status(); if (!st) { el.textContent = '준비 중 — 페이지를 한 번 새로고침하면 켜져요'; return; } el.innerHTML = `앱 ${st.shell}/${st.total} · 그림·수식 도구 ${st.cdn}개 저장됨 — 한 번 열어 본 화면은 인터넷 없이도 돼요<span style="display:block;margin-top:6px"><button class="btn sm" id="sOfflineClear">🧹 캐시 지우기</button></span>`; const b = $('#sOfflineClear'); if (b) b.onclick = async () => { await Offline.clear(); UI.toast('오프라인 캐시를 지웠어요. 새로고침하면 다시 받아요'); Views.settings(root); }; })();
  Sync.bind(root, () => Views.settings(root));
  $('#sExport').onclick = () => { const a = document.createElement('a'); a.download = `academy_backup_${todayKey()}.json`; a.href = URL.createObjectURL(new Blob([Store.exportBundle()], { type: 'application/json' })); a.click(); UI.toast(T.exported + ' (모든 코스)'); };
  $('#sImport').onclick = () => $('#sImportFile').click(); $('#sImportFile').onchange = async (e) => { const f = e.target.files[0]; if (!f) return; if (!await UI.confirm(T.importConfirm)) return; try { const kind = Store.importBundle(await f.text()); UI.applyTheme(); UI.toast(kind === 'bundle' ? '모든 코스 데이터를 불러왔어요' : '불러왔어요'); UI.go('home'); } catch (err) { UI.toast('불러오기 실패: ' + err.message); } };
  $('#sReset').onclick = async () => { if (!await UI.confirm(T.confirmReset, '초기화')) return; if (!await UI.confirm(T.confirmReset2, '정말 초기화')) return; Store.reset(); UI.applyTheme(); if (Sync.on) { UI.toast('초기화를 다른 기기에도 알리는 중…'); await Sync.syncNow(true); } location.reload(); };
};

// ---------- 용어집 / 에러 사전 ----------
// 돌아가기(사용자 「갈 수 있게만 하지 말고 다시 올 수 있게」): 들어온 화면이 params.back 을 주면 맨 위에 「← 그 화면으로」, 용어집에서 레슨으로 갈 때도 돌아오는 버튼을 넘김
const backBtn = (back) => back ? `<button class="btn bk-back" id="pgBack">← ${esc(back.label)}</button>` : '';
const bindBackBtn = (root, back) => { const b = $('#pgBack', root); if (b && back) b.onclick = () => UI.go(back.view, back.params || {}); };
Views.glossary = (root, { back = null } = {}) => { const learned = Store.data.lessons.terms || {}; const where = {}; LESSONS.forEach(l => (l.pages || []).forEach((pg, i) => (String(pg.html || '').match(/\[\[([^\]]+)\]\]/g) || []).forEach(m => { const t = m.slice(2, -2); (where[t] = where[t] || []); if (!where[t].some(x => x[0] === l)) where[t].push([l, i]); })));
  const entries = Object.entries(GLOSSARY).sort((a, b) => (learned[b[0]] ? 1 : 0) - (learned[a[0]] ? 1 : 0));
  root.innerHTML = `<div class="page">${backBtn(back)}<h2>${T.glossary}</h2><div class="muted">레슨에서 밑줄 친 용어를 누르면 여기에 모여요. 배운 용어가 위에 와요.</div><div class="gl">${entries.map(([t, def]) => `<div class="gl-item ${learned[t] ? 'learned' : ''}"><b>${esc(t)}</b><span>${esc(def)}</span>${where[t] ? `<div class="gl-where">${where[t].map(([l, i]) => `<a data-l="${l.id}" data-p="${i}">레슨 ${esc(String(l.n ?? ''))}</a>`).join(' ')}</div>` : ''}</div>`).join('')}</div></div>`;
  bindBackBtn(root, back); $$('[data-l]', root).forEach(a => a.onclick = () => UI.go('lesson', { lessonId: a.dataset.l, page: +a.dataset.p || 0, back: { label: '용어집으로 돌아가기', view: 'glossary', params: { back } } })); };
Views.errors = (root, { name, back = null } = {}) => { root.innerHTML = `<div class="page">${backBtn(back)}<h2>🩺 ${T.errorDict}</h2><div class="muted">에러는 컴퓨터가 보내는 힌트예요. 이름을 눌러 펼쳐 보세요.</div><div class="errs">${ERRORS.map(e => `<details class="err" ${e.name === name ? 'open' : ''}><summary><code>${esc(e.name)}</code> ${esc(e.title)}</summary><div class="err-b"><p><b>왜 나나요?</b> ${esc(e.why)}</p><p><b>자주 하는 실수</b></p><pre class="code bad">${esc(e.bad)}</pre><p><b>고치는 법</b></p><pre class="code good">${esc(e.fix)}</pre></div></details>`).join('')}</div></div>`;
  const o = $('details[open]', root); if (o) setTimeout(() => o.scrollIntoView({ block: 'start' }), 50); bindBackBtn(root, back); };

// ---------- 시작 ----------
window.addEventListener('DOMContentLoaded', () => {
  Store.load(document.body.dataset.course || 'python'); Content.init();
  UI.applyTheme(); Offline.register('../../sw.js'); Sync.load();
  Store.data.onboarded = true; Store.save({ silent: true }); // 교과서는 닉네임·하루 목표를 묻지 않음
  UI._bootHash = location.hash; UI.initHistory(); /* PR#94 P1-02: 첫 화면이 주소를 덮기 전에 딥링크를 잡아 둔다 */
  UI.go('home', {}, false);
  // 허브·다른 코스에서 온 딥링크: #lesson/L1 · #lesson/SETUP(시작하기) · #dogam · #settings · 예전 #problem/L3P2(그 레슨의 만들어 보기로)
  const h = (UI._bootHash || '').slice(1); if (h) { const [v, id] = h.split('/'); try { if (v === 'problem' && Content.problemMap[id]) UI.go('problem', { pid: id, lessonId: Content.problemMap[id].lesson }); else if (v === 'lesson' && id === 'SETUP' && typeof BOOK !== 'undefined' && BOOK.setup) UI.go('lesson', { lessonId: 'SETUP', page: 0 }); else if (v === 'lesson' && Content.lessonMap[id]) UI.go('lesson', { lessonId: id, page: Math.max(0, Math.min(((Store.data.lessons || {})[id] || {}).page || 0, ((Content.lessonMap[id].pages || []).length || 1) - 1)) }); else if (Views[v] && !id) UI.go(v); } catch (e) { console.warn('deep link', e); } }
  Sync.init(); // 연동돼 있으면 다른 기기 진행 상황을 내려받아 합친다
});
