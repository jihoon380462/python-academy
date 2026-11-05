// core/ui-views-sql.js — 데이터베이스(SQL) 코스 화면 (v2.7.0 뼈대, EXPANSION.md 7절 · DESIGN.md 16절 플러그인 계약). SQL 코스 페이지에서만 로드된다.
//   UI.modes.sql      문제 유형 'sql': 왼쪽 쿼리 편집기(TextEditor) + ▶ 실행 + 오른쪽 결과 표(열 정렬·50행 페이지·행 수·ms) + 스키마 패널 + 데이터 초기화 + ✔ 제출(btnGrade → ctx.submit)
//   UI.examples.sql   레슨 예제 { sql: '쿼리', dataset?: 'cafe', schema?: false, autoRun?: false }: 편집기 + 실행 + 결과 표
//   SqlUI.grade(p, query)   채점 — p.sql = { dataset, expect: { kind: 'rows' | 'state', query?, ordered?, columns?, table? } } (아래 grade 주석)
//   엔진(core/runners/sql.js)을 못 받으면 모든 화면이 「SQLite 엔진을 받지 못했어요」 안내 + 재시도 버튼으로 폴백하고 깨지지 않는다.
const SqlUI = {
  PAGE: 50,
  esc: (s) => esc(s),
  cellHtml(v) { return v == null ? '<i class="sql-null">NULL</i>' : esc(typeof v === 'number' ? SqlUI.num(v) : v); },
  num(v) { return Number.isInteger(v) ? String(v) : String(Math.round(v * 100) / 100); },
  // 엔진 안내 상자 (받는 중 / 실패 + 재시도). ready 면 빈 문자열
  engineNotice() {
    if (Sql.ready) return '';
    if (Sql.unavailable) return `<div class="sql-notice err"><b>SQLite 엔진을 받지 못했어요</b><span>(인터넷 연결 필요 · ${esc(Sql.reason || '')})</span><button class="btn sm" data-sqlretry>다시 시도</button></div>`;
    return `<div class="sql-notice"><span class="sql-spin"></span>SQLite 엔진을 받고 있어요(약 1.5MB)…</div>`;
  },
  bindRetry(root, after) { $$('[data-sqlretry]', root).forEach(b => b.onclick = () => { b.disabled = true; Sql.start().then(() => after && after()).catch(() => after && after()); }); },
  // ---------- 결과 표 ----------
  // host 에 { columns, rows, ms, changes } 를 표로. 열 머리 클릭 = 정렬(오름↔내림), 50행 페이지, 행 수·ms
  table(host, res, opt = {}) {
    if (!host) return; if (!res) { host.innerHTML = ''; return; }
    if (res.error) { host.innerHTML = `<div class="sql-err"><div class="sql-err-raw">${esc(res.error.msg)}</div><div class="sql-err-ko">💡 ${esc(res.error.ko || '')}</div></div>`; return; }
    const st = host._sqlSt = host._sqlSt && host._sqlSt.res === res ? host._sqlSt : { res, sort: null, dir: 1, page: 0 };
    const rows = st.sort == null ? res.rows : res.rows.slice().sort((a, b) => { const x = a[st.sort], y = b[st.sort]; if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1; return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), 'ko')) * st.dir; });
    const pages = Math.max(1, Math.ceil(rows.length / this.PAGE)); st.page = Math.min(st.page, pages - 1); const from = st.page * this.PAGE; const view = rows.slice(from, from + this.PAGE);
    const head = res.columns.map((c, i) => `<th data-col="${i}" class="${st.sort === i ? (st.dir > 0 ? 'asc' : 'desc') : ''}" title="눌러서 정렬">${esc(c)}</th>`).join('');
    const body = view.map((r, k) => `<tr>${r.map((v, i) => `<td class="${opt.mark && opt.mark[from + k] && opt.mark[from + k][i] ? 'diff' : ''}${typeof v === 'number' ? ' n' : ''}">${this.cellHtml(v)}</td>`).join('')}</tr>`).join('');
    const meta = `${res.columns.length ? `${rows.length}행` : '결과 행 없음'}${res.changes ? ` · <b>${res.changes}행 바뀜</b>` : ''}${res.ms != null ? ` · ${res.ms} ms` : ''}`;
    const pager = pages > 1 ? `<span class="sql-pager"><button class="btn xs" data-pg="-1" ${st.page ? '' : 'disabled'}>◀</button> ${from + 1}–${Math.min(rows.length, from + this.PAGE)} / ${rows.length} <button class="btn xs" data-pg="1" ${st.page < pages - 1 ? '' : 'disabled'}>▶</button></span>` : '';
    host.innerHTML = `${opt.title ? `<div class="sql-tbl-title">${opt.title}</div>` : ''}${res.columns.length ? `<div class="sql-tbl-wrap"><table class="sql-tbl"><thead><tr>${head}</tr></thead><tbody>${body || `<tr><td colspan="${res.columns.length}" class="muted">(0행)</td></tr>`}</tbody></table></div>` : ''}<div class="sql-tbl-meta muted small">${meta}${pager}</div>`;
    $$('th[data-col]', host).forEach(th => th.onclick = () => { const i = +th.dataset.col; if (st.sort === i) st.dir = -st.dir; else { st.sort = i; st.dir = 1; } st.page = 0; this.table(host, res, opt); });
    $$('[data-pg]', host).forEach(b => b.onclick = () => { st.page += +b.dataset.pg; this.table(host, res, opt); });
  },
  // ---------- 스키마 패널 ----------
  schema(host, db, editor) {
    if (!host) return; if (!db) { host.innerHTML = `<div class="sql-sch-h">표</div><div class="muted small">엔진이 준비되면 표 목록이 나와요</div>`; return; }
    const open = host._sqlOpen || (host._sqlOpen = {});
    const tbls = Sql.tables(db);
    host.innerHTML = `<div class="sql-sch-h">표 <span class="muted small">(이름을 누르면 편집기에 넣어요)</span></div>` + tbls.map(t => { const cols = Sql.columns(db, t); const n = Sql.count(db, t); const on = !!open[t]; const smp = on ? Sql.sample(db, t, 3) : null;
      return `<div class="sql-sch-t ${on ? 'on' : ''}" data-t="${esc(t)}"><div class="sql-sch-row"><button class="sql-sch-tog" data-tog="${esc(t)}" title="열 보기">${on ? '▾' : '▸'}</button><button class="sql-sch-name" data-ins="${esc(t)}">${esc(t)}</button><span class="muted small">${n}행</span></div>${on ? `<div class="sql-sch-cols">${cols.map(c => `<button class="sql-sch-col" data-ins="${esc(c.name)}" title="편집기에 넣기"><span>${esc(c.name)}</span><small>${esc(c.type.toLowerCase())}${c.pk ? ' · PK' : ''}${c.notnull && !c.pk ? ' · NOT NULL' : ''}</small></button>`).join('')}</div><div class="sql-sch-smp"></div>` : ''}</div>`; }).join('');
    $$('[data-tog]', host).forEach(b => b.onclick = () => { open[b.dataset.tog] = !open[b.dataset.tog]; this.schema(host, db, editor); });
    $$('[data-ins]', host).forEach(b => b.onclick = () => { if (editor) { editor.insert(b.dataset.ins, b.dataset.ins.length); editor.focus(); } });
    $$('.sql-sch-t.on', host).forEach(el => { const smp = Sql.sample(db, el.dataset.t, 3); this.table($('.sql-sch-smp', el), { columns: smp.columns, rows: smp.rows }, { title: '샘플 3행' }); });
  },
  // ---------- 작업판 ----------
  // host 에 편집기 + 실행 + 결과 + (스키마) 를 그린다. opt = { value, dataset, schema(bool), extra(html: 실행 버튼 앞), after(html: 실행 버튼 뒤), onChange, onRun, onReady, compact, runId }
  // 돌려주는 것: { editor, db, run(), resetDb(), getQuery(), setQuery(), destroy(), out(결과 host) }
  workbench(host, opt = {}) {
    const dataset = opt.dataset || 'cafe'; const w = { db: null, destroyed: false };
    host.classList.add('sqlw'); if (opt.compact) host.classList.add('compact');
    host.innerHTML = `<div class="sqlw-main"><div class="sqlw-head"><span class="ex2-tab">query.sql</span><span class="muted small sqlw-ds">데이터셋: ${esc(dataset)}</span><span class="grow"></span>${opt.extra || ''}<button class="btn sm" data-dbreset title="표를 처음 상태로 되돌려요">데이터 초기화</button><button class="btn primary" id="${opt.runId || 'sqlRun'}">▶ 실행 <kbd>Ctrl+Enter</kbd></button>${opt.after || ''}</div><div class="sqlw-ed"></div><div class="sqlw-engine"></div><div class="sqlw-warn"></div><div class="sqlw-out"></div></div>${opt.schema === false ? '' : `<aside class="sqlw-side"><div class="sqlw-schema"></div></aside>`}`;
    const edHost = $('.sqlw-ed', host); const out = $('.sqlw-out', host); const eng = $('.sqlw-engine', host); const warn = $('.sqlw-warn', host); const sch = $('.sqlw-schema', host);
    w.out = out; w.editor = new TextEditor(edHost, { value: opt.value || '', onChange: opt.onChange || null, lang: 'sql' });
    w.getQuery = () => w.editor.getValue(); w.setQuery = (v) => w.editor.setValue(v);
    const renderEngine = () => { if (w.destroyed) return; eng.innerHTML = this.engineNotice(); this.bindRetry(eng, renderEngine); const rb = $('#' + (opt.runId || 'sqlRun'), host); if (rb) rb.disabled = !Sql.ready && Sql.unavailable; if (Sql.ready && !w.db) { try { w.db = Sql.fresh(dataset); } catch (e) { eng.innerHTML = `<div class="sql-notice err"><b>데이터셋을 만들지 못했어요</b><span>${esc(e.message)}</span></div>`; } if (sch) this.schema(sch, w.db, w.editor); if (w.db && opt.onReady) opt.onReady(w); } };
    w.resetDb = () => { if (!Sql.ready) return; try { if (w.db) w.db.close(); } catch (e) {} w.db = Sql.fresh(dataset); warn.innerHTML = ''; out.innerHTML = ''; if (sch) this.schema(sch, w.db, w.editor); UI.toast('표를 처음 상태로 되돌렸어요'); };
    w.run = () => {
      if (w.destroyed) return null; const q = w.getQuery(); if (!q.trim()) { UI.toast('쿼리를 먼저 쓰세요'); return null; }
      if (!Sql.ready) { if (!Sql.unavailable) { Sql.start().catch(() => {}); UI.toast('SQLite 엔진을 받고 있어요…'); } renderEngine(); return null; }
      if (!w.db) renderEngine(); if (!w.db) return null;
      Audio.click(); Game.stat('runs'); Game.stat('sqlRuns'); const danger = Sql.isDangerous(q); const r = Sql.exec(w.db, q);
      this.table(out, r); if (sch) this.schema(sch, w.db, w.editor);
      warn.innerHTML = danger && !r.error ? `<div class="sql-notice warn"><b>모든 행이 ${danger.kind === 'DELETE' ? '지워졌어요' : '바뀌었어요'}!</b><span>WHERE 조건이 없어서 ${danger.kind} 가 표 전체(${r.changes}행)에 적용됐어요. 실제 서비스였다면 큰일이에요.</span><button class="btn sm" data-dbreset>데이터 초기화</button></div>` : '';
      $$('[data-dbreset]', warn).forEach(b => b.onclick = w.resetDb);
      if (opt.onRun) opt.onRun(r, q); return r;
    };
    $$('[data-dbreset]', host).forEach(b => b.onclick = w.resetDb); $('#' + (opt.runId || 'sqlRun'), host).onclick = w.run;
    host.addEventListener('keydown', (e) => { if (e.ctrlKey && !e.shiftKey && e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); w.run(); } });
    w._onState = () => renderEngine(); Sql.onState(w._onState); renderEngine(); if (!Sql.ready && !Sql.unavailable) Sql.start().catch(() => {});
    if (sch) this.schema(sch, w.db, w.editor);
    w.destroy = () => { w.destroyed = true; Sql._ls = Sql._ls.filter(f => f !== w._onState); try { if (w.db) w.db.close(); } catch (e) {} w.db = null; w.editor.destroy(); host.innerHTML = ''; };
    return w;
  },
  // ---------- 채점 ----------
  // p.sql = { dataset: 'cafe', expect: { kind: 'rows' | 'state', query?: 기대 결과를 만들 쿼리(없으면 p.solution), ordered?: 행 순서 검사, columns?: 열 이름 검사, table?: state 일 때 비교할 표 } }
  //   rows  : 사용자 쿼리 결과 집합 vs 정답 쿼리 결과 집합. 기본은 열 순서·행 순서 무시(열 이름이 같으면 이름으로 맞추고, 다르면 행 안의 값을 정렬해 비교), 실수는 소수 2자리 반올림
  //   state : 사용자 쿼리(여러 문장 가능)를 새 DB 에 실행한 뒤 table 의 전체 행 vs 정답을 실행한 뒤의 전체 행(열 이름·행 순서 무시)
  //   → { ok, msg(실패 html: 원인 + 기대/내 결과 표 두 개 + 행 수 힌트), detail(성공 html: 내 결과 표), mine, expected }
  norm(v) { if (v == null) return null; if (typeof v === 'number') return Number.isInteger(v) ? v : Math.round(v * 100) / 100; return String(v); },
  key(row) { return JSON.stringify(row); },
  grade(p, query) {
    const spec = p.sql || {}; const ex = spec.expect || { kind: 'rows' }; const dataset = spec.dataset || 'cafe'; const solQ = ex.query || p.solution || '';
    if (!Sql.ready) return { ok: false, msg: `SQLite 엔진이 준비되지 않아 채점할 수 없어요. ${Sql.unavailable ? '인터넷 연결을 확인하고 「다시 시도」를 눌러 주세요.' : '잠시 뒤 다시 제출해 보세요.'}` };
    if (!String(query || '').trim()) return { ok: false, msg: '쿼리를 먼저 쓰세요.' };
    const run = (q, forState) => { const db = Sql.fresh(dataset); try { let r = Sql.exec(db, q); if (r.error) return r; if (forState) r = Sql.exec(db, `SELECT * FROM "${String(ex.table || '').replace(/"/g, '""')}"`); return r; } finally { try { db.close(); } catch (e) {} } };
    const state = ex.kind === 'state';
    const mineR = run(query, state); if (mineR.error) return { ok: false, msg: `쿼리가 실행되지 않았어요.<div class="sql-err"><div class="sql-err-raw">${esc(mineR.error.msg)}</div><div class="sql-err-ko">💡 ${esc(mineR.error.ko || '')}</div></div>` };
    const expR = run(solQ, state); if (expR.error) return { ok: false, msg: `정답 쿼리에 문제가 있어요(문제 데이터 오류): ${esc(expR.error.msg)}` };
    const ordered = !!ex.ordered && !state; const checkCols = state || !!ex.columns;
    // 열 맞추기
    const lc = (a) => a.map(c => String(c).toLowerCase());
    const eCols = lc(expR.columns), mCols = lc(mineR.columns);
    let colMap = null; const sameNames = eCols.length === mCols.length && eCols.every(c => mCols.includes(c)) && new Set(mCols).size === mCols.length;
    if (checkCols && !sameNames) { const miss = eCols.filter(c => !mCols.includes(c)), extra = mCols.filter(c => !eCols.includes(c)); return this.fail(p, `열 이름이 달라요.${miss.length ? ` 빠진 열: <code>${miss.map(esc).join('</code>, <code>')}</code>.` : ''}${extra.length ? ` 기대에 없는 열: <code>${extra.map(esc).join('</code>, <code>')}</code>.` : ''} ${state ? '' : 'AS 로 열 이름을 문제가 요구한 대로 붙여 보세요.'}`, expR, mineR); }
    if (eCols.length !== mCols.length) return this.fail(p, `열 개수가 달라요. 기대 ${eCols.length}열, 내 결과 ${mCols.length}열이에요. SELECT 뒤의 열 목록을 보세요.`, expR, mineR);
    if (sameNames) colMap = eCols.map(c => mCols.indexOf(c));
    const canon = (rows, map) => rows.map(r => { let cells = (map ? map.map(i => r[i]) : r.slice()).map(v => this.norm(v)); if (!map && !sameNames) cells = cells.slice().sort((a, b) => String(a).localeCompare(String(b))); return cells; });
    const E = canon(expR.rows, null), M = canon(mineR.rows, colMap);
    const sortRows = (rs) => rs.map((r, i) => ({ r, i })).sort((a, b) => this.key(a.r).localeCompare(this.key(b.r)));
    const Es = ordered ? E.map((r, i) => ({ r, i })) : sortRows(E), Ms = ordered ? M.map((r, i) => ({ r, i })) : sortRows(M);
    const expView = { columns: expR.columns, rows: Es.map(x => x.r), ms: null }; const mineView = { columns: sameNames ? expR.columns : mineR.columns, rows: Ms.map(x => x.r), ms: null };
    if (E.length !== M.length) { const d = M.length - E.length; const hint = state ? `표에 행이 ${Math.abs(d)}개 ${d > 0 ? '더 많아요' : '적어요'}. INSERT/DELETE 횟수나 WHERE 조건을 보세요.` : d > 0 ? `${d}행이 더 나왔어요. WHERE 조건이 빠졌거나 느슨하지 않은지 보세요.` : `${-d}행이 덜 나왔어요. WHERE 조건이 너무 좁거나 LIMIT 이 작지 않은지 보세요.`; return this.fail(p, `행 수가 달라요(기대 ${E.length}행, 내 결과 ${M.length}행). ${hint}`, expView, mineView, this.markRows(Es, Ms), ordered ? '(빨간 칸이 다른 곳이에요.)' : null); }
    const mark = this.markRows(Es, Ms); const nDiff = mark.m.reduce((n, r) => n + r.filter(Boolean).length, 0);
    if (nDiff) { let why = ordered && this.key(E.slice().sort((a, b) => this.key(a).localeCompare(this.key(b)))) === this.key(M.slice().sort((a, b) => this.key(a).localeCompare(this.key(b)))) ? '행의 내용은 같은데 순서가 달라요. ORDER BY 의 열이나 ASC/DESC 를 보세요.' : `${nDiff}개 셀이 달라요. 빨간 칸을 비교해 보세요.`; return this.fail(p, why, expView, mineView, mark, ordered ? '(빨간 칸이 다른 곳이에요.)' : null); }
    const okTitle = `✓ 기대한 결과와 같아요 · ${state ? `표 ${esc(ex.table)} 의 상태 일치 · ${M.length}행` : `${M.length}행${ordered ? ' · 순서까지 일치' : ''}`}`; return { ok: true, detail: `<div class="sql-ok"><b>${okTitle}</b></div>`, okTitle, mine: mineR, expected: expR };
  },
  markRows(Es, Ms) { const n = Math.max(Es.length, Ms.length); const e = [], m = []; for (let i = 0; i < n; i++) { const a = Es[i] ? Es[i].r : null, b = Ms[i] ? Ms[i].r : null; const w = Math.max(a ? a.length : 0, b ? b.length : 0); const er = [], mr = []; for (let j = 0; j < w; j++) { const diff = !a || !b || this.key(a[j]) !== this.key(b[j]); er.push(diff); mr.push(diff); } e.push(er); m.push(mr); } return { e, m }; },
  fail(p, why, expView, mineView, mark, note) { const id = 'sqd' + uid(); const html = `<div class="sql-fail-why">${why}</div><div class="sql-diff" id="${id}"><div class="sql-diff-col"><div class="sql-diff-h">기대한 결과</div><div class="sql-diff-t" data-side="e"></div></div><div class="sql-diff-col"><div class="sql-diff-h">내 결과</div><div class="sql-diff-t" data-side="m"></div></div></div><div class="muted small">${mark ? (note || '(행 순서를 무시하는 문제라 양쪽을 정렬해서 비교했어요. 빨간 칸이 다른 곳이에요.)') : ''}</div>`; setTimeout(() => { const box = document.getElementById(id); if (!box) return; this.table($('[data-side=e]', box), expView, { mark: mark && mark.e }); this.table($('[data-side=m]', box), mineView, { mark: mark && mark.m }); }, 0); return { ok: false, msg: html }; },
};

// ---------- 문제 유형 'sql' ----------
UI.modes.sql = {
  label: '쿼리 작성',
  mount(host, p, ctx) {
    const spec = p.sql || {}; const saved = ctx.rec && ctx.rec.code != null && ctx.rec.mode === 'sql' ? ctx.rec.code : null; const start = saved != null ? saved : (p.starter || '');
    const w = SqlUI.workbench(host, { value: start, dataset: spec.dataset || 'cafe', extra: `<button class="btn sm" data-qreset title="처음 쿼리로">↺ 처음 쿼리로</button>`, after: `<button class="btn accent" id="btnGrade">✔ 제출하기</button>` });
    $$('[data-qreset]', host).forEach(b => b.onclick = () => { w.setQuery(p.starter || ''); });
    let grading = false;
    const submit = () => { if (grading) return; grading = true; const q = w.getQuery(); const r = SqlUI.grade(p, q); grading = false; if (r.ok) { Game.stat('sqlClears'); if (r.mine) SqlUI.table(w.out, { ...r.mine, ms: null }, { title: r.okTitle || '✓ 기대한 결과와 같아요' }); /* core 의 onClear 가 #pvResult 를 자기 상자로 덮으므로 결과 표는 작업판 출력 칸에 */ } ctx.submit(r); };
    $('#btnGrade', host).onclick = submit;
    return { getCode: () => w.getQuery(), submit, destroy: () => w.destroy() };
  },
};
// ---------- 레슨 예제 { sql } ----------
UI.examples.sql = {
  mount(host, example, ctx) {
    const orig = String(example.sql || ''); let ran = false;
    const w = SqlUI.workbench(host, { value: orig, dataset: example.dataset || 'cafe', schema: example.schema !== false, compact: true, runId: 'exSqlRun', extra: `<button class="btn sm" data-exreset title="원래 쿼리로">원래대로</button>`, onReady: (wb) => { if (example.autoRun !== false && !ran) { ran = true; wb.run(); } } });
    $$('[data-exreset]', host).forEach(b => b.onclick = () => w.setQuery(orig));
    return { destroy: () => w.destroy() };
  },
};
