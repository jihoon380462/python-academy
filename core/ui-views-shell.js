// core/ui-views-shell.js — 터미널·Git 코스 화면 플러그인 (v2.7.0 뼈대, DESIGN.md 16절 · EXPANSION.md 6절). terminal-git 코스 페이지에서만 로드된다.
//   ShellUI.term(host, opts)   공용 터미널 위젯: 검은 창(프롬프트 me@academy:~/경로 (브랜치)$ · ↑↓ 히스토리 · Tab 자동완성 · Ctrl+L) + 파일 트리 패널(현재 폴더 강조)
//                              + Git 저장소가 있으면 3칸 상태 뷰(작업 폴더/스테이징/저장소) + 커밋 그래프(SVG). `edit 파일` 은 편집창(textarea 모달, 충돌이면 내 것/상대 것/둘 다 버튼).
//   UI.modes.mission           미션형 문제: setup 으로 터미널을 만들고, 명령마다 Shell.state() 를 goals[].expect 와 Grader.matchState 로 대조해 체크리스트에 ✓.
//                              전부 달성하면 「✔ 제출하기」(id btnGrade) 가 켜진다. getCode() 는 명령 히스토리(줄바꿈). 「처음부터」로 초기 상태 복원.
//   UI.modes.parsons           명령 순서 맞히기 — core 의 ParsonsEditor 를 그대로 쓰되 줄 순서만 채점(Grader.checkParsons, 들여쓰기 0 으로 정규화).
//                              이 코스에는 Py(파이썬 러너)가 없어 core 의 parsons 화면(▶ 실행해 보기 → Py.ready)을 쓰면 ReferenceError 가 나므로 얇은 판을 등록한다.
//   UI.examples.shell          레슨 예제: pages[].example = { shell: 'pwd\nls', setup?: {...} } — 「다음 줄 실행 ▶」 로 한 줄씩 돌려 결과와 트리 변화를 보여 주고, 직접 쳐 볼 수도 있다.
//   채점·상태 비교 키는 core/engine.js 의 Grader.matchState(끝부분), 셸·Git 동작은 core/runners/shell.js. 둘 다 여기서 고치지 않는다.
const ShellUI = {
  MOBILE_CHIPS: ['ls', 'cd', 'pwd', '..', '-', '/', '~', '|', '>', 'git', 'Tab', '↑'],
  // 프롬프트: /home/me → ~, 저장소 안이면 (브랜치)
  ps1(sh) { const p = sh.cwd === Shell.HOME ? '~' : sh.cwd.startsWith(Shell.HOME + '/') ? '~' + sh.cwd.slice(Shell.HOME.length) : sh.cwd; let br = ''; if (sh.git && Git.inRepo(sh)) br = sh.git.head.branch ? ` (${sh.git.head.branch})` : ` (HEAD@${sh.git.head.detached})`; return `me@academy:${p}${br}$`; },
  quote(s) { if (!s.includes('"')) return `"${s}"`; if (!s.includes("'")) return `'${s}'`; return null; },
  // 공용 터미널 위젯. opts = { setup, onChange(sh, r, line)?, replay?:string[], compact?:bool(트리를 아래로), title? }
  term(host, opts = {}) {
    const self = this; const setup = opts.setup || {};
    host.classList.add('sh-host'); host.innerHTML = `<div class="sh-wrap ${opts.compact ? 'compact' : ''}">
      <div class="sh-term"><div class="sh-bar"><span class="sh-dots"><i></i><i></i><i></i></span><span class="sh-title">${esc(opts.title || '터미널')}</span><span class="grow"></span><span class="sh-slot"></span></div>
        <div class="sh-out" aria-live="polite"></div>
        <div class="sh-line"><span class="sh-ps1"></span><input class="sh-in" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" aria-label="명령 입력" placeholder="명령을 치고 Enter"></div>
        <div class="sh-chips">${this.MOBILE_CHIPS.map(c => `<button type="button" data-c="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      <aside class="sh-side"><div class="sh-panel sh-tree"><div class="sh-ph">파일 트리 <span class="muted small">현재 폴더는 파랗게</span></div><div class="sh-tree-body"></div></div></aside>
      <div class="sh-panel sh-git hide"><div class="sh-ph">Git 상태 <span class="muted small sh-git-br"></span><span class="grow"></span><span class="muted small">작업 폴더 → add → 스테이징 → commit → 저장소</span></div><div class="sh-cols"></div><div class="sh-graph"></div></div></div>`;
    const out = $('.sh-out', host), inp = $('.sh-in', host), ps = $('.sh-ps1', host);
    const T = { sh: null, hist: [], hi: 0, el: host };
    const scroll = () => { out.scrollTop = out.scrollHeight; };
    const line = (cls, text) => { if (text == null || text === '') return; const el = document.createElement('pre'); el.className = 'sh-o ' + cls; el.textContent = text.replace(/\n$/, ''); out.appendChild(el); };
    const echo = (cmd) => { const el = document.createElement('div'); el.className = 'sh-echo'; el.innerHTML = `<span class="sh-ps1">${esc(self.ps1(T.sh))}</span> <span class="sh-cmd">${esc(cmd)}</span>`; out.appendChild(el); };
    const refresh = () => { ps.textContent = self.ps1(T.sh); self.renderTree($('.sh-tree-body', host), T.sh); self.renderGit($('.sh-git', host), T.sh); };
    const reset = () => { T.sh = Shell.create(JSON.parse(JSON.stringify(setup))); T.hist = []; T.hi = 0; out.innerHTML = ''; refresh(); };
    // 명령 실행 (echo: 창에 프롬프트+명령 줄을 보여 줄지). edit 는 편집창을 띄운 뒤 onChange.
    const run = (cmd, { echo: show = true, quiet = false } = {}) => {
      cmd = String(cmd); if (!cmd.trim()) return null; if (show) echo(cmd); T.hist.push(cmd); T.hi = T.hist.length;
      const r = T.sh.exec(cmd); if (r.clear) out.innerHTML = '';
      if (!quiet) { line('', r.out); if (r.err) { line('err', r.err); const ex = Shell.explain(r.err); if (ex) { const k = document.createElement('div'); k.className = 'sh-ko'; k.innerHTML = `<b>${esc(ex.title)}</b> ${esc(ex.why)} <span class="sh-fix">→ ${esc(ex.fix || '')}</span>`; out.appendChild(k); } } }
      scroll(); refresh();
      if (r.code === 3 && T.sh.editQueue.length) { const abs = T.sh.editQueue.shift(); self.editFile(T.sh, abs, cmd).then(() => { refresh(); if (opts.onChange) opts.onChange(T.sh, r, cmd); }); return r; }
      if (opts.onChange) opts.onChange(T.sh, r, cmd); return r;
    };
    // Tab 자동완성: 첫 토큰은 명령(git 뒤는 서브명령), 그 외는 경로
    const complete = () => {
      const v = inp.value; const toks = v.split(/\s+/); const last = toks[toks.length - 1] || ''; let cands = [];
      if (toks.length === 1) cands = Object.keys(Shell.COMMANDS).filter(c => c.startsWith(last)).map(c => c + ' ');
      else if (toks[0] === 'git' && toks.length === 2) cands = Shell.COMMANDS.git.sub.filter(c => c.startsWith(last)).map(c => c + ' ');
      else { const i = last.lastIndexOf('/'); const dir = i >= 0 ? last.slice(0, i + 1) : ''; const pre = last.slice(i + 1); const n = T.sh.node(T.sh.resolve(dir || '.')); if (n && n.type === 'dir') cands = Object.keys(n.children).filter(k => k.startsWith(pre) && (pre.startsWith('.') || !k.startsWith('.'))).sort().map(k => dir + k + (n.children[k].type === 'dir' ? '/' : ' ')); }
      if (!cands.length) return; let common = cands[0]; for (const c of cands) { let j = 0; while (j < common.length && j < c.length && common[j] === c[j]) j++; common = common.slice(0, j); }
      if (cands.length > 1) { echo(v); line('', cands.map(c => c.trim()).join('  ') + '\n'); scroll(); }
      inp.value = v.slice(0, v.length - last.length) + (cands.length === 1 ? cands[0] : common);
    };
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); const v = inp.value; inp.value = ''; run(v); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (T.hi > 0) { T.hi--; inp.value = T.hist[T.hi] || ''; } return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); if (T.hi < T.hist.length) { T.hi++; inp.value = T.hist[T.hi] || ''; } return; }
      if (e.key === 'Tab') { e.preventDefault(); complete(); return; }
      if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); out.innerHTML = ''; return; }
      if (e.key === 'c' && e.ctrlKey && !inp.value) { e.preventDefault(); echo('^C'); return; }
    });
    $('.sh-term', host).addEventListener('click', (e) => { if (!e.target.closest('button') && !window.getSelection().toString()) inp.focus(); });
    $$('.sh-chips button', host).forEach(b => b.addEventListener('pointerdown', (e) => { e.preventDefault(); const c = b.dataset.c; if (c === 'Tab') complete(); else if (c === '↑') { if (T.hi > 0) { T.hi--; inp.value = T.hist[T.hi] || ''; } } else { const needSp = /^[a-z]+$/.test(c) && inp.value && !inp.value.endsWith(' '); inp.value += (needSp ? ' ' : '') + c + (/^[a-z]+$/.test(c) ? ' ' : ''); } inp.focus(); }));
    reset();
    if (opts.replay && opts.replay.length) { let n = 0; for (const l of opts.replay) { if (!l.trim() || /^edit\s+\S+$/.test(l.trim())) continue; echo(l); out.lastElementChild.classList.add('dim'); T.hist.push(l); T.sh.exec(l); n++; } T.hi = T.hist.length; refresh(); if (n) { const k = document.createElement('div'); k.className = 'sh-note'; k.textContent = `이전에 친 명령 ${n}개를 다시 실행해 이어서 해요 (결과는 history · 파일 트리로)`; out.appendChild(k); scroll(); } }
    return { get sh() { return T.sh; }, run, reset, refresh, focus: () => inp.focus(), history: () => T.sh.history.slice(), input: inp, destroy() { host.innerHTML = ''; } };
  },
  // ---------- 파일 트리 ----------
  renderTree(host, sh) {
    if (!host) return; const cwd = sh.cwd; const rows = [];
    const walk = (node, abs, depth, name) => { const isDir = node.type === 'dir'; const here = abs === cwd; const onPath = isDir && (cwd === abs || cwd.startsWith(abs + '/')); const hidden = name.startsWith('.');
      rows.push(`<div class="sh-tr ${here ? 'cur' : ''} ${hidden ? 'dot' : ''} ${isDir ? 'dir' : 'file'}" style="--d:${depth}" title="${esc(abs)}"><span class="sh-ti">${isDir ? (onPath ? '▾' : '▸') : '·'}</span><span class="sh-tn">${name === '' ? '/' : esc(name) + (isDir ? '/' : '')}</span>${here ? '<span class="sh-here">여기</span>' : ''}</div>`);
      if (isDir && (depth < 1 || onPath || depth < 6)) Object.keys(node.children).sort((a, b) => (node.children[b].type === 'dir') - (node.children[a].type === 'dir') || a.localeCompare(b)).forEach(k => { if (k === '.git') { rows.push(`<div class="sh-tr dot dir" style="--d:${depth + 1}"><span class="sh-ti">▸</span><span class="sh-tn">.git/</span><span class="muted small">(저장소)</span></div>`); return; } walk(node.children[k], abs + '/' + k, depth + 1, k); }); };
    walk(sh.root, '', 0, '');
    host.innerHTML = rows.join('');
    const cur = $('.sh-tr.cur', host); if (cur && cur.scrollIntoView) try { cur.scrollIntoView({ block: 'nearest' }); } catch (e) {}
  },
  // ---------- Git: 3칸 상태 뷰 + 커밋 그래프 ----------
  renderGit(panel, sh) {
    if (!panel) return; const g = sh.git; if (!g) { panel.classList.add('hide'); return; } panel.classList.remove('hide');
    const snap = Git.snapshot(sh); const wt = Git.worktree(sh, g); const head = Git.headSnap(g); const idx = g.index;
    const work = []; for (const p of Object.keys(wt)) { if (!(p in idx)) work.push([p, 'new', '새 파일']); else if (wt[p] !== idx[p]) work.push([p, 'mod', '고침']); } for (const p of Object.keys(idx)) if (!(p in wt)) work.push([p, 'del', '지움']);
    const staged = snap.staged.map(p => [p, p in head ? (p in idx ? 'mod' : 'del') : 'new', p in head ? (p in idx ? '고침' : '지움') : '새 파일']);
    const hc = Git.headCommit(g);
    const col = (title, items, empty) => `<div class="sh-col"><div class="sh-ch">${title}<span class="sh-cn">${items.length}</span></div>${items.length ? items.map(([p, k, lab]) => `<div class="sh-f ${k}"><span class="sh-fn">${esc(p)}</span><span class="sh-fl">${lab}</span></div>`).join('') : `<div class="sh-empty">${empty}</div>`}</div>`;
    $('.sh-git-br', panel).textContent = g.head.branch ? `브랜치 ${g.head.branch}` : `HEAD 분리됨 ${g.head.detached}`;
    $('.sh-cols', panel).innerHTML = col('작업 폴더', work, snap.conflicts.length ? '충돌 해결 중' : '변경 없음') + `<div class="sh-arrow" title="git add">add →</div>` + col('스테이징', staged, '비어 있음') + `<div class="sh-arrow" title="git commit">commit →</div>` + `<div class="sh-col"><div class="sh-ch">저장소<span class="sh-cn">${snap.commits}</span></div>${hc ? `<div class="sh-f cm"><span class="sh-fn"><code>${esc(hc.hash)}</code> ${esc(hc.message)}</span><span class="sh-fl">${Object.keys(hc.snapshot).length}파일</span></div>` : '<div class="sh-empty">커밋 없음</div>'}${snap.merging ? '<div class="sh-f warn"><span class="sh-fn">병합 중 (충돌)</span></div>' : ''}${snap.stash ? `<div class="sh-f"><span class="sh-fn">stash ${snap.stash}개</span></div>` : ''}</div>`;
    const gEl = $('.sh-graph', panel); const prev = this.graphState(gEl); gEl.innerHTML = this.graphSvg(sh, g); this.animateGraph(gEl, prev, g);
  },
  // 그래프 애니메이션 (v2.8.0): 다시 그리기 전 위치를 기억(graphState) → 새로 그린 뒤 이전 위치에서 새 위치로 옮김(animateGraph)
  //   새 커밋 = 피어남 · 이름표(브랜치·HEAD·origin/·tag) = 미끄러짐 · 새 선(merge 포함) = 그려짐 · 움직인 커밋 = 이동. 「무엇이 바뀌었나」 한 줄도 아래에.
  graphState(gEl) { if (!gEl || !gEl._drawn) return null; /* 첫 그리기(문제 열 때)는 애니메이션 없음 */ const at = (el) => ({ x: +el.dataset.x, y: +el.dataset.y }); const st = { c: {}, l: {}, e: new Set() }; gEl.querySelectorAll('[data-h]').forEach(el => st.c[el.dataset.h] = at(el)); gEl.querySelectorAll('[data-l]').forEach(el => st.l[el.dataset.l] = at(el)); gEl.querySelectorAll('[data-e]').forEach(el => st.e.add(el.dataset.e)); st.lab = gEl._labAt || {}; st.head = gEl._head; return st; },
  animateGraph(gEl, prev, g) {
    const labAt = {}; Object.entries(g.branches).forEach(([b, h]) => labAt[b] = h); Object.entries(g.tags || {}).forEach(([t, h]) => labAt['tag ' + t] = h); Object.entries(g.remoteTracking || {}).forEach(([b, h]) => labAt['origin/' + b] = h); if (g.head.detached) labAt.HEAD = g.head.detached; gEl._labAt = labAt; gEl._drawn = true; const headNow = g.head.branch || ('분리된 HEAD ' + String(g.head.detached || '').slice(0, 7)); gEl._head = headNow;
    const note = []; const short = (h) => h ? String(h).slice(0, 7) : '';
    if (prev) { const newC = Object.keys(g.commits).filter(h => !(h in prev.c) && gEl.querySelector(`[data-h="${h}"]`)); if (newC.length) note.push(`새 커밋 ${newC.map(short).join(', ')}`); for (const [n, h] of Object.entries(labAt)) { const was = prev.lab[n]; if (was && was !== h) note.push(`${n}: ${short(was)} → ${short(h)}`); else if (!was && Object.keys(prev.lab).length) note.push(`${n}: 새로 생김 (${short(h)})`); } for (const n of Object.keys(prev.lab)) if (!(n in labAt)) note.push(`${n}: 없어짐`); if (prev.head && prev.head !== headNow) note.unshift(`HEAD: ${prev.head} → ${headNow}`); }
    let nEl = gEl.querySelector('.sh-gnote'); if (note.length) { if (!nEl) { nEl = document.createElement('div'); nEl.className = 'sh-gnote'; gEl.appendChild(nEl); } nEl.textContent = '방금 바뀐 것: ' + note.slice(0, 4).join(' · '); }
    const svg = gEl.querySelector('svg'); if (!svg) return; if (prev && note.length) gEl.scrollLeft = gEl.scrollWidth; // 모바일: 가장 새 커밋이 보이게
    if (!prev || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const moved = []; const from = (el, p) => { const x = +el.dataset.x, y = +el.dataset.y; if (!p || (p.x === x && p.y === y)) return false; el.style.transition = 'none'; el.style.transform = `translate(${p.x}px,${p.y}px)`; moved.push([el, x, y]); return true; };
    svg.querySelectorAll('[data-h]').forEach(el => { const p = prev.c[el.dataset.h]; if (!p) el.classList.add('sh-born'); else from(el, p); });
    svg.querySelectorAll('[data-l]').forEach(el => { const p = prev.l[el.dataset.l]; if (!p) el.classList.add('sh-fade'); else from(el, p); });
    svg.querySelectorAll('[data-e]').forEach(el => { if (!prev.e.has(el.dataset.e)) { let len = 0; try { len = el.getTotalLength(); } catch (e) {} if (len) { el.style.strokeDasharray = len; el.style.strokeDashoffset = len; el.classList.add('sh-draw'); } } else if (moved.length) el.classList.add('sh-fade'); });
    if (!moved.length && !svg.querySelector('.sh-draw')) return; void svg.getBoundingClientRect();
    requestAnimationFrame(() => { moved.forEach(([el, x, y]) => { el.style.transition = ''; el.style.transform = `translate(${x}px,${y}px)`; }); svg.querySelectorAll('.sh-draw').forEach(el => { el.style.strokeDashoffset = '0'; }); });
  },
  graphSvg(sh, g) {
    const all = Object.values(g.commits).sort((a, b) => a.n - b.n); if (!all.length) return '<div class="sh-empty">커밋이 생기면 여기 그래프가 그려져요</div>';
    const list = all.slice(-14); const shown = new Set(list.map(c => c.hash)); const lane = {}; const used = {}; let maxLane = 0;
    // 레인 0 = 지금 브랜치(HEAD)의 첫 부모 사슬. 그 밖의 커밋은 첫 부모의 레인을 아직 아무 자식도 잇지 않았으면 그 레인을 잇고(일직선), 아니면 새 레인(가지)
    const tip = g.head.branch ? g.branches[g.head.branch] : g.head.detached; const mainline = new Set(); for (let h = tip; h && g.commits[h] && !mainline.has(h); h = g.commits[h].parents[0]) mainline.add(h);
    for (const c of list) { const p0 = c.parents[0]; if (mainline.has(c.hash)) lane[c.hash] = 0; else if (p0 && lane[p0] != null && lane[p0] !== 0 && !used[p0]) { lane[c.hash] = lane[p0]; used[p0] = true; } else lane[c.hash] = ++maxLane; }
    const labels = {}; const add = (h, t, cls) => { (labels[h] = labels[h] || []).push([t, cls]); };
    Object.entries(g.branches).forEach(([b, h]) => add(h, (g.head.branch === b ? 'HEAD → ' : '') + b, g.head.branch === b ? 'head' : 'br'));
    if (g.head.detached) add(g.head.detached, 'HEAD', 'head'); Object.entries(g.tags).forEach(([t, h]) => add(h, 'tag ' + t, 'tag')); Object.entries(g.remoteTracking || {}).forEach(([b, h]) => add(h, 'origin/' + b, 'remote'));
    const lw = (t) => t.length * 6.5 + 10; const stack0 = Math.max(1, ...list.filter(c => lane[c.hash] === 0).map(c => (labels[c.hash] || []).length)); const top = 8 + stack0 * 16;
    const X = (i) => 28 + i * 52, Y = (l) => top + 12 + l * 36; const H = Y(maxLane) + 28; let W = X(list.length - 1) + 60;
    const pos = {}; list.forEach((c, i) => pos[c.hash] = { x: X(i), y: Y(lane[c.hash]) });
    list.forEach((c) => { const ls = labels[c.hash] || []; if (lane[c.hash] !== 0) W = Math.max(W, pos[c.hash].x + 12 + ls.reduce((a, [t]) => a + lw(t) + 4, 0) + 10); else ls.forEach(([t]) => { W = Math.max(W, pos[c.hash].x - 8 + lw(t) + 10); }); });
    // v2.8.0 (TODO F2, EXPANSION 6절): 커밋·이름표·선마다 키(data-h / data-l / data-e)를 달고 위치는 style transform 으로 둔다 → animateGraph 가 이전 위치에서 새 위치로 옮긴다
    let s = `<svg class="sh-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="커밋 그래프">`;
    for (const c of list) for (const p of c.parents) if (shown.has(p)) { const a = pos[p], b = pos[c.hash]; const d = a.y === b.y ? `M${a.x},${a.y} L${b.x},${b.y}` : `M${a.x},${a.y} C${(a.x + b.x) / 2},${a.y} ${(a.x + b.x) / 2},${b.y} ${b.x},${b.y}`; s += `<path d="${d}" class="sh-ge" data-e="${p}>${c.hash}" data-g="${a.x},${a.y},${b.x},${b.y}"/>`; }
    list.forEach((c) => { const { x, y } = pos[c.hash]; const isHead = (g.head.branch && g.branches[g.head.branch] === c.hash) || g.head.detached === c.hash; s += `<g class="sh-gc ${isHead ? 'head' : ''}" data-h="${esc(c.hash)}" data-x="${x}" data-y="${y}" style="transform:translate(${x}px,${y}px)"><circle r="7"/><text class="sh-gh" y="20" text-anchor="middle">${esc(c.hash)}</text><title>${esc(c.hash)} ${esc(c.message)}</title></g>`;
      const ls = labels[c.hash] || []; const lab = (t, cls, lx, ly) => `<g class="sh-gl ${cls}" data-l="${esc(t.replace(/^HEAD → /, ''))}" data-x="${lx}" data-y="${ly}" style="transform:translate(${lx}px,${ly}px)"><rect width="${lw(t)}" height="14" rx="4"/><text x="5" y="10.5">${esc(t)}</text></g>`;
      if (lane[c.hash] === 0) ls.forEach(([t, cls], k) => { s += lab(t, cls, x - 8, y - 26 - k * 16); }); // 레인 0: 위로 쌓기
      else { let lx = x + 12; ls.forEach(([t, cls]) => { s += lab(t, cls, lx, y - 7); lx += lw(t) + 4; }); } }); // 다른 레인: 오른쪽에 나란히
    return s + '</svg>' + (all.length > list.length ? `<div class="muted small">앞 ${all.length - list.length}개 커밋은 생략</div>` : '');
  },
  // ---------- edit 파일명 → 편집창 (아래 ShellUI.editFile) — 저장은 _saveFrom: 파일에 쓰고, 히스토리의 `edit 파일` 줄을 `edit 파일 "내용"` 꼴로 바꿔 둔다(다시 열 때 재실행용)
  _saveFrom(sh, abs, text) { if (!text.endsWith('\n') && text !== '') text += '\n'; sh.writeFile(abs, text); const q = ShellUI.quote(text.replace(/\n/g, '\\n')); const last = sh.history.length - 1; if (q && last >= 0 && /^edit\s/.test(sh.history[last])) sh.history[last] = `edit ${abs} ${q}`; }, // 절대 경로로 적어 두어야 다른 폴더에서 다시 열어도 같은 파일에 써진다
};
// 편집창: UI.modal 은 버튼 value 만 돌려주므로 저장은 버튼 onClick 에서 _saveFrom 을 부른다. 충돌 파일이면 「내 것 유지/상대 것 유지/둘 다」 버튼.
ShellUI.editFile = function (sh, abs) {
  const name = abs.split('/').pop(); const cur = sh.readFile(abs); const text = cur == null ? '' : cur; const conflict = /^<<<<<<< /m.test(text);
  const resolve = (txt, which) => txt.replace(/<<<<<<< [^\n]*\n([\s\S]*?)=======\n([\s\S]*?)>>>>>>> [^\n]*\n?/g, (m, a, b) => which === 'ours' ? a : which === 'theirs' ? b : a + b);
  const pick = (which) => (ov) => { const ta = $('#shEdTa', ov); ta.value = resolve(ta.value, which); ta.focus(); return false; };
  const btns = [{ label: '취소', value: null }];
  if (conflict) btns.push({ label: '내 것 유지', onClick: pick('ours') }, { label: '상대 것 유지', onClick: pick('theirs') }, { label: '둘 다', onClick: pick('both') });
  btns.push({ label: '저장', cls: 'primary', value: 'save', onClick: (ov) => { ShellUI._saveFrom(sh, abs, $('#shEdTa', ov).value); } });
  return UI.modal({ title: `edit ${esc(name)}${cur == null ? ' <span class="muted small">(새 파일)</span>' : ''}`, wide: true, body: `${conflict ? '<div class="sh-conf">충돌 마커(<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> <code>=======</code> <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>)가 들어 있어요. 버튼으로 한쪽을 고르거나 직접 고친 뒤 저장 → <code>git add</code> → <code>git commit</code>.</div>' : ''}<textarea id="shEdTa" class="sh-ta" rows="${Math.min(18, Math.max(6, text.split('\n').length + 1))}" spellcheck="false">${esc(text)}</textarea><div class="muted small">저장하면 파일에 바로 씌어요. 실제 에디터(nano·vim)의 단축키는 여기서 배우지 않아요.</div>`, buttons: btns, onOpen: (ov) => { const ta = $('#shEdTa', ov); setTimeout(() => ta.focus(), 50); ta.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const s = ta.selectionStart; ta.value = ta.value.slice(0, s) + '    ' + ta.value.slice(ta.selectionEnd); ta.selectionStart = ta.selectionEnd = s + 4; } }); } }).then(v => v === 'save');
};

// ---------- 미션형 문제 ----------
//   p = { type:'mission', setup:{cwd?, tree, git?, remote?}, goals:[{text, expect}], expect?:{...}(최종 비교; 없으면 goals 의 expect 를 전부 합침), forbid?:['rm -rf /'], solution:'명령\n명령', xp, hints[3], tags }
UI.modes.mission = {
  label: '미션',
  mount(host, p, ctx) {
    const goals = p.goals || []; let term = null; let allDone = false;
    host.innerHTML = `<div class="ms"><div class="ms-goals"><div class="ms-gh">목표 <span class="ms-gn" id="msGoalN"></span><span class="grow"></span><span class="muted small">명령을 칠 때마다 확인해요</span></div><ol class="ms-list" id="msGoals">${goals.map((g, i) => `<li class="ms-g" data-g="${i}"><span class="ms-chk"></span><span class="ms-gt">${UI.terms(g.text)}</span></li>`).join('')}${p.forbid && p.forbid.length ? `<li class="ms-g rule" data-g="forbid"><span class="ms-chk"></span><span class="ms-gt">쓰면 안 되는 명령: ${p.forbid.map(f => `<code>${esc(f)}</code>`).join(' ')}</span></li>` : ''}</ol></div>
      <div class="ms-term" id="msTerm"></div>
      <div class="row ms-actions"><button class="btn accent" id="btnGrade" disabled>✔ 제출하기</button><button class="btn" id="msReset" title="초기 상태로 되돌려요 (명령 기록도 지워요)">↺ 처음부터</button><span class="muted small" id="msNote"></span></div></div>`;
    const check = () => {
      if (!term) return; const st = term.sh.state(); let done = 0;
      goals.forEach((g, i) => { const ok = Grader.matchState(st, g.expect || {}).ok; const li = $(`.ms-g[data-g="${i}"]`, host); if (li) { const was = li.classList.contains('done'); li.classList.toggle('done', ok); if (ok && !was && term.history().length) li.classList.add('pop'); } if (ok) done++; });
      let ruleOk = true; if (p.forbid && p.forbid.length) { ruleOk = Grader.matchState(st, { forbid: p.forbid }).ok; const li = $('.ms-g[data-g="forbid"]', host); if (li) { li.classList.toggle('done', ruleOk); li.classList.toggle('broken', !ruleOk); } }
      allDone = done === goals.length && ruleOk; $('#msGoalN', host).textContent = `${done}/${goals.length}`; const b = $('#btnGrade', host); if (b) { if (b.disabled && allDone) { const pr = document.querySelector('#pvResult'); if (pr && pr.querySelector('.result.bad')) pr.innerHTML = ''; } b.disabled = !allDone; } const note = $('#msNote', host); if (note) note.textContent = allDone ? '목표를 모두 달성했어요 — 제출하세요' : (!ruleOk ? '금지된 명령을 썼어요 — 「처음부터」로 되돌리세요' : '');
    };
    const replay = (!ctx.fresh && ctx.rec && ctx.rec.mode === 'mission' && typeof ctx.rec.code === 'string' && ctx.rec.code.trim()) ? ctx.rec.code.split('\n') : null;
    term = ShellUI.term($('#msTerm', host), { setup: p.setup || {}, replay, onChange: () => check() });
    check(); if (!UI.isMobile()) setTimeout(() => term.focus(), 80);
    const grade = () => {
      const st = term.sh.state(); const fails = []; const seen = new Set(); // 같은 이유는 한 번만(목표와 expect 가 겹치므로)
      goals.forEach(g => { const r = Grader.matchState(st, g.expect || {}); if (!r.ok) { const why = r.fails.filter(f => !seen.has(f)); r.fails.forEach(f => seen.add(f)); fails.push(`${g.text.replace(/<[^>]+>/g, '')}${why.length ? ' — ' + why.join(', ') : ''}`); } });
      const ex = p.expect ? p.expect : Object.assign({}, ...goals.map(g => g.expect || {})); const r2 = Grader.matchState(st, Object.assign({}, ex, p.forbid ? { forbid: p.forbid } : {})); r2.fails.forEach(f => { if (!seen.has(f)) { seen.add(f); fails.push(f); } });
      if (fails.length) { ctx.submit({ ok: false, msg: `아직이에요. 남은 목표: <ul class="ms-left">${fails.map(f => `<li>${esc(f)}</li>`).join('')}</ul>` }); return; }
      ctx.submit({ ok: true, detail: `<div class="ms-done muted">목표 ${goals.length}개 모두 달성 · 명령 ${term.history().length}개로 해냈어요${p.solution ? ` · 정답 예시는 ${p.solution.split('\n').filter(l => l.trim()).length}개` : ''}</div>` });
    };
    $('#btnGrade', host).onclick = grade;
    $('#msReset', host).onclick = async () => { if (term.history().length && !await UI.confirm('처음 상태로 되돌리고 명령 기록을 지울까요?', '처음부터')) return; term.reset(); check(); $$('.ms-g', host).forEach(li => li.classList.remove('pop', 'broken')); if (typeof Store !== 'undefined' && ctx.pid) Store.setCode(ctx.pid, '', 'mission'); term.focus(); };
    return { getCode: () => term.history().join('\n'), submit: grade, destroy() { term.destroy(); } };
  },
};

// ---------- 명령 순서 맞히기 (parsons, 줄 순서만) ----------
UI.modes.parsons = {
  label: '명령 순서',
  mount(host, p, ctx) {
    host.innerHTML = `<div class="muted small ms-pzhint">명령을 올바른 순서로 놓으세요. 들여쓰기는 없어요 — 순서만 봐요.</div><div class="ms-pz" id="pvPz"></div><div class="row"><button class="btn accent" id="btnGrade">✔ 제출하기</button></div>`;
    let state = null; try { if (!ctx.fresh && ctx.rec && ctx.rec.mode === 'parsons' && ctx.rec.code) state = JSON.parse(ctx.rec.code); } catch (e) {}
    const ed = new ParsonsEditor($('#pvPz', host), { problem: p, state });
    const submit = () => { const arranged = ed.getArranged().map(a => ({ text: a.text, indent: 0 })); const r = Grader.checkParsons(p, arranged); if (r.ok) { ctx.submit({ ok: true, detail: p.parsons && p.parsons.why ? `<div class="muted">${esc(p.parsons.why)}</div>` : '' }); return; } ed.markWrong(r.wrong); ctx.submit({ ok: false, msg: r.lengthMismatch ? '명령 개수가 달라요. 함정 줄이 섞이지 않았는지, 빠진 명령은 없는지 보세요.' : '빨간 줄의 순서를 다시 보세요.' }); };
    $('#btnGrade', host).onclick = submit;
    return { getCode: () => JSON.stringify(ed.getState()), submit, destroy() { ed.destroy(); } };
  },
};

// ---------- 레슨 예제: { shell:'pwd\nls', setup?:{...} } ----------
UI.examples.shell = {
  mount(host, example, ctx) {
    const lines = String(example.shell || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')); let i = 0;
    host.innerHTML = `<div class="ex-sh"><div class="ex-sh-head"><span class="ex2-tab">예제 명령</span><span class="grow"></span><button class="btn sm" id="exShReset">처음부터</button><button class="btn sm" id="exShAll">전부 실행</button><button class="btn primary sm" id="exShNext">다음 줄 실행 ▶</button></div><ol class="ex-sh-lines">${lines.map((l, k) => `<li data-k="${k}"><code>${esc(l)}</code></li>`).join('')}</ol><div class="ex-sh-term" id="exShTerm"></div><div class="muted small ex-sh-note">▶ 를 누르면 한 줄씩 실행돼요. 아래 입력줄에 직접 쳐 봐도 돼요.</div></div>`;
    const term = ShellUI.term($('#exShTerm', host), { setup: example.setup || {}, compact: true });
    const mark = () => { $$('.ex-sh-lines li', host).forEach(li => { const k = +li.dataset.k; li.classList.toggle('done', k < i); li.classList.toggle('next', k === i); }); const nb = $('#exShNext', host); if (nb) nb.disabled = i >= lines.length; };
    const step = () => { if (i >= lines.length) return; term.run(lines[i++]); mark(); };
    $('#exShNext', host).onclick = step; $('#exShAll', host).onclick = () => { while (i < lines.length) step(); };
    $('#exShReset', host).onclick = () => { term.reset(); i = 0; mark(); };
    mark();
    return { destroy() { term.destroy(); } };
  },
};
