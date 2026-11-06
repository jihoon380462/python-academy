// core/ui-views-web.js — 웹·HTTP·API 코스 화면 (v2.7.0 뼈대, docs/EXPANSION.md 8절). 웹 코스 페이지(courses/web/index.html)에서만 로드된다.
//   WebUI.workspace(host, opts)   HTML/CSS/JS 세 탭 편집기 + 미리보기 iframe(폰/PC 폭) + 출력(console)·네트워크·검사 결과 탭. 문제 화면과 레슨 예제가 같이 쓴다.
//   UI.modes.web                  문제 유형 'web' — p.web = { tabs:['html','css','js'] 중 쓰는 것, starter:{html,css,js}, checks:[…], free?:true, api?:{…} }
//                                 「✔ 제출하기」 → Web.check 결과를 체크리스트로, 전부 ✓ 면 ctx.submit({ok:true}). 실패 항목 클릭 → 미리보기에서 그 요소 강조.
//                                 free:true(「예쁘게 꾸미세요」) 는 채점 없이 「완료로 표시」 버튼이 ok 제출(XP 는 p.xp 고정 소액).
//   UI.examples.web               레슨 예제 — pages[].example = { web:{ html, css?, js? }, api?:{…} } → 편집기 + 미리보기 + 「원래대로」
//   저장: getCode() = JSON.stringify({html,css,js}) → Store.setCode(core) → rec.code 로 복원. 정답 보기는 p.solution(합친 html 문자열)을 core 가 그대로 보여 준다.
const WebUI = {
  TAB_LABEL: { html: 'HTML', css: 'CSS', js: 'JS' },
  LEVEL_LABEL: { log: '', info: 'ℹ', warn: '⚠', error: '✗', debug: '·', alert: '🔔 alert' },
  // host 에 작업판을 그린다. opts = { tabs, code:{html,css,js}, api?, onChange?(code), extraButtons?:html, panels?:['console','net','check'], autoRefresh?:true, compact?:bool }
  workspace(host, opts = {}) {
    const tabs = (opts.tabs && opts.tabs.length ? opts.tabs : ['html', 'css', 'js']).filter(t => this.TAB_LABEL[t]);
    const panels = opts.panels || ['console', 'net', 'check'];
    const uid = 'w' + Math.random().toString(36).slice(2, 7);
    host.classList.add('web-ws'); if (opts.compact) host.classList.add('compact');
    host.innerHTML = `<div class="web-ed">
        <div class="web-tabs" role="tablist">${tabs.map((t, i) => `<button class="web-tab ${i === 0 ? 'on' : ''}" data-tab="${t}" role="tab">${this.TAB_LABEL[t]}</button>`).join('')}<span class="grow"></span>${opts.extraButtons || ''}</div>
        ${tabs.map((t, i) => `<div class="web-pane ${i === 0 ? 'on' : ''}" data-pane="${t}"><div class="web-ted" id="${uid}-${t}"></div></div>`).join('')}
      </div>
      <div class="web-pv">
        <div class="web-pv-bar"><span class="web-pv-title">미리보기</span><span class="grow"></span><button class="btn xs web-w on" data-w="pc" title="PC 폭">PC</button><button class="btn xs web-w" data-w="phone" title="폰 폭(390px)">폰</button><label class="web-auto small muted"><input type="checkbox" class="web-autochk" ${opts.autoRefresh === false ? '' : 'checked'}> 자동 갱신</label><button class="btn xs web-refresh" title="미리보기를 다시 그려요">새로 고침</button></div>
        <div class="web-frame-wrap"><iframe class="web-frame" sandbox="allow-scripts allow-forms" title="미리보기"></iframe></div>
        <div class="web-panels"><div class="web-ptabs">${panels.map((p, i) => `<button class="web-ptab ${i === 0 ? 'on' : ''}" data-p="${p}">${{ console: '출력', net: '네트워크', check: '검사 결과' }[p]} <span class="web-cnt" data-cnt="${p}"></span></button>`).join('')}<span class="grow"></span><button class="btn xs web-clear" title="출력·네트워크 기록 지우기">지우기</button></div>
          ${panels.includes('console') ? `<pre class="out web-console on" data-panel="console"><span class="muted">console.log(…) 와 에러, alert 가 여기 나와요</span></pre>` : ''}
          ${panels.includes('net') ? `<div class="web-net" data-panel="net"><div class="muted small web-net-empty">가짜 서버(<code>${esc(Web.api.base)}</code>)로 간 요청이 여기 쌓여요. 줄을 누르면 요청·응답 본문이 보여요.</div><table class="web-net-t hide"><thead><tr><th>방법</th><th>주소</th><th>상태</th><th>시간</th></tr></thead><tbody></tbody></table></div>` : ''}
          ${panels.includes('check') ? `<div class="web-check" data-panel="check"><div class="muted small">제출하면 항목별 결과가 여기 나와요. 실패한 항목을 누르면 미리보기에서 그 요소가 빨갛게 표시돼요.</div></div>` : ''}
        </div>
      </div>`;
    const code = Object.assign({ html: '', css: '', js: '' }, opts.code || {});
    const editors = {}; let timer = null; let consoleN = 0, netN = 0;
    const iframe = $('.web-frame', host); const consoleEl = $('.web-console', host); const netBody = $('.web-net-t tbody', host); const netTable = $('.web-net-t', host); const netEmpty = $('.web-net-empty', host); const checkEl = $('.web-check', host);
    const getCode = () => { const o = {}; tabs.forEach(t => o[t] = editors[t].getValue()); return { html: o.html || '', css: o.css || '', js: o.js || '' }; };
    const setCnt = (p, n) => { const c = $(`.web-cnt[data-cnt="${p}"]`, host); if (c) c.textContent = n ? `(${n})` : ''; };
    const showPanel = (p) => { $$('.web-ptab', host).forEach(b => b.classList.toggle('on', b.dataset.p === p)); $$('[data-panel]', host).forEach(el => el.classList.toggle('on', el.dataset.panel === p)); };
    const log = (level, text) => { if (!consoleEl) return; if (!consoleN) consoleEl.innerHTML = ''; consoleN++; setCnt('console', consoleN); const line = document.createElement('div'); line.className = `web-line ${level}`; const tag = this.LEVEL_LABEL[level] || ''; line.textContent = (tag ? tag + ' ' : '') + text; consoleEl.appendChild(line); consoleEl.scrollTop = consoleEl.scrollHeight; if (level === 'error') consoleEl.classList.add('haserr'); };
    const netRow = (r) => { if (!netBody) return; netN++; setCnt('net', netN); netTable.classList.remove('hide'); netEmpty.classList.add('hide'); const tr = document.createElement('tr'); tr.className = r.error ? 'bad' : (r.status >= 200 && r.status < 300 ? 'ok' : ''); const path = r.url.replace(/^https?:\/\/api\.academy\.local/, ''); tr.innerHTML = `<td><b>${esc(r.method)}</b></td><td class="web-net-url" title="${esc(r.url)}">${esc(path || r.url)}</td><td>${r.status || '—'}</td><td>${r.ms} ms</td>`; const detail = document.createElement('tr'); detail.className = 'web-net-detail hide'; detail.innerHTML = `<td colspan="4"><div class="lbl">요청 ${esc(r.method)} ${esc(r.url)}</div><pre class="code">${esc(r.req || '(본문 없음)')}</pre><div class="lbl">응답 ${r.status || '—'}</div><pre class="code">${esc(r.res || '(본문 없음)')}</pre></td>`; tr.onclick = () => detail.classList.toggle('hide'); netBody.appendChild(tr); netBody.appendChild(detail); };
    const clearPanels = () => { consoleN = 0; netN = 0; setCnt('console', 0); setCnt('net', 0); if (consoleEl) { consoleEl.innerHTML = '<span class="muted">console.log(…) 와 에러, alert 가 여기 나와요</span>'; consoleEl.classList.remove('haserr'); } if (netBody) { netBody.innerHTML = ''; netTable.classList.add('hide'); netEmpty.classList.remove('hide'); } };
    const render = () => { clearPanels(); return Web.render(iframe, getCode(), { onConsole: (m) => log(m.level, m.text), onError: (e) => log('error', `${e.text}${e.line ? ` (${e.line}번째 줄)` : ''}`), onFetch: (r) => netRow(r) }, { api: opts.api || {} }); };
    const schedule = () => { if (!$('.web-autochk', host).checked) return; clearTimeout(timer); timer = setTimeout(render, 500); };
    tabs.forEach(t => { editors[t] = new TextEditor($(`#${uid}-${t}`, host), { lang: t, value: code[t] || '', onChange: (v) => { opts.onChange && opts.onChange(getCode()); schedule(); } }); });
    $$('.web-tab', host).forEach(b => b.onclick = () => { $$('.web-tab', host).forEach(x => x.classList.toggle('on', x === b)); $$('.web-pane', host).forEach(p => p.classList.toggle('on', p.dataset.pane === b.dataset.tab)); });
    $$('.web-w', host).forEach(b => b.onclick = () => { $$('.web-w', host).forEach(x => x.classList.toggle('on', x === b)); host.classList.toggle('phone', b.dataset.w === 'phone'); });
    $('.web-refresh', host).onclick = () => { clearTimeout(timer); render(); };
    $('.web-clear', host).onclick = clearPanels;
    $$('.web-ptab', host).forEach(b => b.onclick = () => showPanel(b.dataset.p));
    render();
    return {
      iframe, editors, tabs, getCode, render, log, showPanel, clearPanels,
      setCode(c) { tabs.forEach(t => editors[t].setValue(c[t] || '')); clearTimeout(timer); render(); },
      // 체크 결과 목록. onPick(item) 은 실패 항목 클릭
      showChecks(results, onPick) { if (!checkEl) return; checkEl.innerHTML = `<ul class="web-chk">${results.map((r, i) => `<li class="${r.ok ? 'ok' : 'bad'}" data-i="${i}" ${r.ok ? '' : 'title="누르면 미리보기에서 그 요소를 표시해요"'}><span class="web-chk-m">${r.ok ? '✓' : '✗'}</span><span class="web-chk-t">${esc(r.text)}</span>${!r.ok && r.got != null ? `<span class="web-chk-g muted small">지금: ${esc(String(r.got)).slice(0, 80)}</span>` : ''}</li>`).join('')}</ul>`; $$('.web-chk li.bad', checkEl).forEach(li => li.onclick = () => { $$('.web-chk li', checkEl).forEach(x => x.classList.toggle('sel', x === li)); onPick && onPick(results[+li.dataset.i]); }); showPanel('check'); },
      destroy() { clearTimeout(timer); Object.values(editors).forEach(e => { try { e.destroy(); } catch (x) {} }); const entry = iframe.__web; if (entry) Web._frames.delete(entry.token); host.innerHTML = ''; },
    };
  },
  checklistHtml(results) { return `<ul class="web-chk done">${results.map(r => `<li class="${r.ok ? 'ok' : 'bad'}"><span class="web-chk-m">${r.ok ? '✓' : '✗'}</span>${esc(r.text)}</li>`).join('')}</ul>`; },
};

// ---------- 문제 유형 'web' ----------
UI.modes.web = {
  label: '웹 페이지 만들기',
  mount(host, p, ctx) {
    const w = p.web || {}; const starter = Object.assign({ html: '', css: '', js: '' }, w.starter || {});
    const saved = ctx.rec && ctx.rec.mode === 'web' && ctx.rec.code ? Web.parseCode(ctx.rec.code) : null;
    const tabs = (w.tabs && w.tabs.length) ? w.tabs : ['html', 'css', 'js'].filter(t => starter[t] != null && (t === 'html' || starter[t] !== ''));
    const free = !!w.free; const checks = w.checks || [];
    const extra = `<button class="btn xs web-reset" title="처음 코드로 되돌려요">↺ 처음 코드로</button>`;
    host.innerHTML = `<div class="web-mode"><div class="web-host"></div><div class="row web-actions">${free ? `<button class="btn accent" id="btnGrade">✔ 완료로 표시</button><span class="muted small">자유 과제라 채점이 없어요. 마음에 들게 만들었으면 완료로 표시하세요.</span>` : `<button class="btn accent" id="btnGrade">✔ 제출하기 <kbd>Ctrl+Shift+Enter</kbd></button><span class="muted small">${checks.length}개 항목을 검사해요</span>`}</div></div>`;
    const ws = WebUI.workspace($('.web-host', host), { tabs, code: saved || starter, api: w.api || {}, extraButtons: extra, panels: free ? ['console', 'net'] : ['console', 'net', 'check'] });
    $('.web-reset', host).onclick = async () => { if (!await UI.confirm('지금 쓴 코드를 지우고 처음 코드로 되돌릴까요?', '되돌리기')) return; ws.setCode(starter); };
    let busy = false;
    const submit = async () => {
      if (busy) return; busy = true; const btn = $('#btnGrade', host); if (btn) btn.disabled = true;
      try {
        if (free) { ctx.submit({ ok: true, detail: `<div class="muted">완료로 표시했어요. 더 꾸미고 싶으면 언제든 다시 열어서 고칠 수 있어요.</div>` }); return; }
        await ws.render(); if (!checks.length) { ctx.submit({ ok: true, detail: '<div class="muted">검사 항목이 없는 문제예요.</div>' }); return; }
        const results = await Web.check(ws.iframe, checks);
        ws.showChecks(results, (r) => { if (r.sel) Web.highlight(ws.iframe, r.sel); });
        const bad = results.filter(r => !r.ok);
        if (!bad.length) ctx.submit({ ok: true, detail: WebUI.checklistHtml(results) });
        else ctx.submit({ ok: false, msg: `${results.length}개 중 ${bad.length}개 항목이 아직이에요: ${bad.map(r => esc(r.text)).join(' · ')} — 미리보기 아래 「검사 결과」 탭의 빨간 항목을 누르면 그 요소가 표시돼요.` });
      } finally { busy = false; if (btn) btn.disabled = false; }
    };
    $('#btnGrade', host).onclick = submit;
    return { getCode: () => JSON.stringify(ws.getCode()), submit, destroy: () => ws.destroy() };
  },
};

// ---------- 레슨 예제 { web: {html, css, js} } ----------
UI.examples.web = {
  mount(host, example, ctx) {
    const code = Object.assign({ html: '', css: '', js: '' }, example.web || {}); const tabs = ['html', 'css', 'js'].filter(t => t === 'html' || (code[t] && code[t].trim()));
    host.classList.add('web-example');
    const ws = WebUI.workspace(host, { tabs, code, api: example.api || {}, compact: true, panels: example.api || /fetch\s*\(/.test(code.js || '') ? ['console', 'net'] : ['console'], extraButtons: `<button class="btn sm web-reset" title="원래 코드로">원래대로</button>` });
    $('.web-reset', host).onclick = () => ws.setCode(code);
    return { destroy: () => ws.destroy() };
  },
};
