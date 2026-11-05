// core/visualize.js — 알고리즘 시각화 엔진 (EXPANSION.md 5절). 파이썬 러너의 구조 스냅샷(step.vis)을 캔버스에 그린다.
//   spec(문제·예제의 visualize 필드): { kind, var, ...옵션 }
//     bars      { var:'a', hl:['i','j'], range?:[lo,hi] }           숫자 리스트 → 막대. hl 변수가 가리키는 인덱스 강조
//     boxes     { var:'stack', orient:'v'|'h', top?:'top' }           스택·큐 → 상자 줄
//     linked    { var:'head', next:'next', val:'val', cur?:'cur' }      노드 객체 → 화살표 체인
//     tree      { var:'root', left:'left', right:'right', val:'val', cur?:'node', order?:'visited' }
//     graph     { var:'graph', visited?:'visited', cur?:'node', queue?:'queue', dist?:'dist' }  인접 리스트 dict → 힘 기반 배치
//     grid      { var:'grid', visited?:'visited', pos?:['r','c'] | 'pos'(튜플 변수), path?:'path' }  2차원 리스트 → 격자 (숫자·한 글자 문자('.' 제외)는 칸에 표시)
//     table     { var:'dp', hl?:['i','j'] }                            1·2차원 리스트 → 표 (DP)
//     callstack { }                                                     step.stack·fn·vars → 호출 스택 트리
//   Viz.player(host, { steps, spec, onLine }) : 재생·일시정지·한 단계·슬라이더·속도. 단계 간 변화만 트윈(막대·상자).
//   Viz.runAndShow(host, { code, input, spec, editor }) : 코드를 추적 실행해 플레이어로 (내 코드 모드·데모 모드 공용)
const Viz = {
  css(name, fb) { const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim(); return v || fb; },
  theme() { return { bg: this.css('--surface', '#181b26'), fg: this.css('--text', '#e6e8f0'), muted: this.css('--muted', '#8b90a8'), border: this.css('--border', '#2d3247'), primary: this.css('--primary', '#1a73e8'), accent: this.css('--accent', '#2ea043'), warn: this.css('--warn', '#ffb347'), danger: this.css('--danger', '#ff5d6c'), gold: this.css('--gold', '#ffd166'), surface2: this.css('--surface2', '#222636') }; },
  num(v) { return typeof v === 'number' ? v : (typeof v === 'string' && v.trim() !== '' && !isNaN(+v)) ? +v : null; },
  get(snap, name) { if (!name) return undefined; if (Array.isArray(name)) return name.map(n => snap[n]); return snap[name]; },
  // ---------- 개별 그림 ----------
  // 각 draw는 (ctx, W, H, snap, spec, prevSnap, t[0..1 트윈 진행]) 를 받는다
  drawBars(ctx, W, H, snap, spec, prev, t, th) {
    const a = (this.get(snap, spec.var) || []).filter(x => x !== '...'); const n = a.length; if (!n) return this.empty(ctx, W, H, '리스트가 비어 있어요', th);
    const vals = a.map(x => this.num(x)); const max = Math.max(1, ...vals.map(v => Math.abs(v ?? 0))); const pad = 24, gap = Math.max(2, Math.min(10, 300 / n)); const bw = (W - pad * 2 - gap * (n - 1)) / n; const base = H - 34;
    const hl = {}; (spec.hl || []).forEach((name, k) => { const i = this.num(snap[name]); if (i != null && i >= 0 && i < n) hl[i] = k; });
    const pa = prev && (this.get(prev, spec.var) || []); const pos = (i) => pad + i * (bw + gap);
    // 트윈: 값이 자리를 바꿨으면 이전 위치에서 새 위치로 미끄러짐
    const from = {}; if (pa && pa.length === n) { const used = new Set(); a.forEach((v, i) => { if (pa[i] === v) { from[i] = i; used.add(i); } }); a.forEach((v, i) => { if (from[i] != null) return; const j = pa.findIndex((x, k) => x === v && !used.has(k)); if (j >= 0) { from[i] = j; used.add(j); } }); }
    a.forEach((v, i) => { const h = Math.max(2, (Math.abs(vals[i] ?? 0) / max) * (base - 30)); const x0 = from[i] != null ? pos(from[i]) : pos(i); const x = x0 + (pos(i) - x0) * t; const col = hl[i] != null ? [th.danger, th.warn, th.gold][hl[i] % 3] : th.primary;
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x, base - h, bw, h, Math.min(4, bw / 2)); ctx.fill();
      if (bw >= 16) { ctx.fillStyle = th.fg; ctx.font = `${Math.min(13, bw * 0.8)}px sans-serif`; ctx.textAlign = 'center'; ctx.fillText(String(a[i]), x + bw / 2, base - h - 4); }
      if (bw >= 12) { ctx.fillStyle = th.muted; ctx.font = '11px sans-serif'; ctx.fillText(String(i), x + bw / 2, base + 14); } });
    let lx = pad; (spec.hl || []).forEach((name, k) => { if (snap[name] === undefined) return; ctx.fillStyle = [th.danger, th.warn, th.gold][k % 3]; ctx.fillRect(lx, H - 12, 10, 10); ctx.fillStyle = th.fg; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${name} = ${snap[name]}`, lx + 14, H - 3); lx += 90; });
  },
  drawBoxes(ctx, W, H, snap, spec, prev, t, th) {
    const a = (this.get(snap, spec.var) || []); const n = a.length; const vert = (spec.orient || 'v') === 'v';
    ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`${spec.var} (${n}개)${spec.label ? ' · ' + spec.label : ''}`, 10, 16);
    if (!n) { ctx.fillStyle = th.muted; ctx.textAlign = 'center'; ctx.fillText('(비어 있음)', W / 2, H / 2); }
    const pn = prev ? (this.get(prev, spec.var) || []).length : n; const grow = n > pn;
    if (vert) { const bw = Math.min(160, W - 40), bh = Math.min(32, (H - 50) / Math.max(n, 1)); const x = (W - bw) / 2; const bottom = H - 10;
      a.forEach((v, i) => { const y = bottom - (i + 1) * (bh + 3); const isNew = grow && i === n - 1; const s = isNew ? 0.5 + 0.5 * t : 1; ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.scale(s, s); ctx.fillStyle = i === n - 1 ? th.accent : th.primary; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = `${Math.min(14, bh - 6)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(v), 0, 0); ctx.restore(); });
      ctx.strokeStyle = th.border; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 8, 24); ctx.lineTo(x - 8, bottom + 2); ctx.lineTo(x + bw + 8, bottom + 2); ctx.lineTo(x + bw + 8, 24); ctx.stroke();
      if (n) { ctx.fillStyle = th.accent; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText('← ' + (spec.top || 'top'), x + bw + 14, bottom - n * (bh + 3) + bh / 2 + 4); }
    } else { const bh = 36, bw = Math.min(90, (W - 40) / Math.max(n, 1) - 4); const y = H / 2 - bh / 2; let x = 20;
      a.forEach((v, i) => { const isNew = grow && i === n - 1; const s = isNew ? 0.5 + 0.5 * t : 1; ctx.save(); ctx.translate(x + bw / 2, y + bh / 2); ctx.scale(s, s); ctx.fillStyle = i === 0 ? th.accent : th.primary; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(v), 0, 0); ctx.restore(); x += bw + 4; });
      ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText('앞(먼저 나감) →', 20, y - 8); ctx.textAlign = 'right'; ctx.fillText('← 뒤(새로 들어옴)', W - 20, y - 8); }
  },
  drawLinked(ctx, W, H, snap, spec, prev, t, th) {
    let node = this.get(snap, spec.var); const nodes = []; const seen = new Set(); const nk = spec.next || 'next', vk = spec.val || 'val';
    while (node && typeof node === 'object' && !node.__ref && nodes.length < 40) { if (seen.has(node.__id)) break; seen.add(node.__id); nodes.push(node); node = node[nk]; }
    if (!nodes.length) return this.empty(ctx, W, H, `${spec.var} 가 비어 있어요 (None)`, th);
    const cur = spec.cur ? this.get(snap, spec.cur) : null; const curId = cur && cur.__id;
    const bw = 64, bh = 40, gap = 34; const totalW = nodes.length * bw + (nodes.length - 1) * gap; const scale = Math.min(1, (W - 30) / totalW); ctx.save(); ctx.translate((W - totalW * scale) / 2, H / 2 - bh / 2); ctx.scale(scale, scale);
    nodes.forEach((nd, i) => { const x = i * (bw + gap); const hl = curId && nd.__id === curId; ctx.fillStyle = hl ? th.warn : th.primary; ctx.beginPath(); ctx.roundRect(x, 0, bw, bh, 8); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '15px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(nd[vk]), x + bw * 0.38, bh / 2); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.beginPath(); ctx.moveTo(x + bw * 0.74, 4); ctx.lineTo(x + bw * 0.74, bh - 4); ctx.stroke();
      if (i < nodes.length - 1) { ctx.strokeStyle = th.fg; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + bw * 0.87, bh / 2); ctx.lineTo(x + bw + gap - 4, bh / 2); ctx.stroke(); ctx.fillStyle = th.fg; ctx.beginPath(); ctx.moveTo(x + bw + gap, bh / 2); ctx.lineTo(x + bw + gap - 9, bh / 2 - 5); ctx.lineTo(x + bw + gap - 9, bh / 2 + 5); ctx.fill(); }
      else { ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText('→ None', x + bw + 4, bh / 2); } });
    ctx.restore(); ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(`${spec.var} → ${nodes.length}개 노드${spec.cur ? ` · ${spec.cur}=주황` : ''}`, 10, 16);
  },
  drawTree(ctx, W, H, snap, spec, prev, t, th) {
    const root = this.get(snap, spec.var); if (!root || typeof root !== 'object') return this.empty(ctx, W, H, `${spec.var} 가 비어 있어요 (None)`, th);
    const lk = spec.left || 'left', rk = spec.right || 'right', vk = spec.val || 'val'; const cur = spec.cur ? this.get(snap, spec.cur) : null; const curId = cur && cur.__id; const order = spec.order ? (this.get(snap, spec.order) || []) : [];
    const list = []; let idx = 0; const depthMax = { d: 0 };
    const walk = (nd, d) => { if (!nd || typeof nd !== 'object' || nd.__ref || d > 8) return; walk(nd[lk], d + 1); nd.__x = idx++; nd.__d = d; depthMax.d = Math.max(depthMax.d, d); list.push(nd); walk(nd[rk], d + 1); };
    walk(root, 0); const n = idx; const r = 16; const sx = (W - 40) / Math.max(n, 1), sy = Math.min(60, (H - 50) / (depthMax.d + 1)); const px = (nd) => 20 + (nd.__x + 0.5) * sx, py = (nd) => 24 + nd.__d * sy;
    ctx.strokeStyle = th.border; ctx.lineWidth = 2; list.forEach(nd => { [lk, rk].forEach(k => { const c = nd[k]; if (c && typeof c === 'object' && c.__x != null) { ctx.beginPath(); ctx.moveTo(px(nd), py(nd)); ctx.lineTo(px(c), py(c)); ctx.stroke(); } }); });
    list.forEach(nd => { const oi = order.findIndex ? order.findIndex(v => v === nd[vk]) : -1; const hl = curId && nd.__id === curId; ctx.fillStyle = hl ? th.warn : oi >= 0 ? th.accent : th.primary; ctx.beginPath(); ctx.arc(px(nd), py(nd), r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(nd[vk]), px(nd), py(nd)); if (oi >= 0) { ctx.fillStyle = th.gold; ctx.font = 'bold 11px sans-serif'; ctx.fillText(String(oi + 1), px(nd) + r, py(nd) - r); } });
    ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(`${spec.var} · 노드 ${n}개${spec.order ? ' · 노란 숫자 = 방문 순서' : ''}`, 10, 14);
  },
  layoutCache: {},
  graphLayout(keys, edges, W, H) {
    const key = keys.join(',') + '|' + W + 'x' + H; if (this.layoutCache[key]) return this.layoutCache[key];
    const n = keys.length; const pos = {}; keys.forEach((k, i) => { const a = (i / n) * Math.PI * 2; pos[k] = { x: W / 2 + Math.cos(a) * Math.min(W, H) * 0.35, y: H / 2 + Math.sin(a) * Math.min(W, H) * 0.35 }; });
    const idx = Object.fromEntries(keys.map((k, i) => [k, i])); const k2 = (W * H) / Math.max(n, 1) * 0.6;
    for (let it = 0; it < 200; it++) { const disp = keys.map(() => ({ x: 0, y: 0 }));
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = pos[keys[i]], b = pos[keys[j]]; let dx = a.x - b.x, dy = a.y - b.y; let d2 = dx * dx + dy * dy || 0.01; const f = k2 / d2; disp[i].x += dx * f; disp[i].y += dy * f; disp[j].x -= dx * f; disp[j].y -= dy * f; }
      edges.forEach(([u, v]) => { if (idx[u] == null || idx[v] == null) return; const a = pos[u], b = pos[v]; const dx = a.x - b.x, dy = a.y - b.y; const d = Math.sqrt(dx * dx + dy * dy) || 0.01; const f = (d * d) / Math.sqrt(k2) * 0.004; disp[idx[u]].x -= dx * f; disp[idx[u]].y -= dy * f; disp[idx[v]].x += dx * f; disp[idx[v]].y += dy * f; });
      const temp = 8 * (1 - it / 200) + 0.5; keys.forEach((k, i) => { const d = Math.sqrt(disp[i].x ** 2 + disp[i].y ** 2) || 0.01; const m = Math.min(d, temp); pos[k].x = Math.max(30, Math.min(W - 30, pos[k].x + disp[i].x / d * m)); pos[k].y = Math.max(30, Math.min(H - 30, pos[k].y + disp[i].y / d * m)); }); }
    this.layoutCache[key] = pos; return pos;
  },
  drawGraph(ctx, W, H, snap, spec, prev, t, th) {
    const g = this.get(snap, spec.var); if (!g || typeof g !== 'object') return this.empty(ctx, W, H, `${spec.var} 가 비어 있어요`, th);
    const keys = Object.keys(g).filter(k => k !== '...'); const edges = []; const weights = {};
    keys.forEach(u => { const adj = g[u]; const list = Array.isArray(adj) ? adj : (adj && typeof adj === 'object' ? Object.entries(adj).map(([v, w]) => [v, w]) : []); list.forEach(item => { let v = item, w = null; if (Array.isArray(item)) { v = item[0]; w = item[1]; } v = String(v); if (!keys.includes(v)) keys.push(v); edges.push([u, v]); if (w != null) weights[u + '>' + v] = w; }); });
    const pos = this.graphLayout(keys, edges, W, H - 20); const visited = spec.visited ? (this.get(snap, spec.visited) || []) : []; const vis = Array.isArray(visited) ? visited : visited.__set ? visited.__set : Object.keys(visited); const visS = new Set(vis.map(String)); const cur = spec.cur ? String(this.get(snap, spec.cur) ?? '') : null; const queue = spec.queue ? (this.get(snap, spec.queue) || []) : []; const qS = new Set(queue.map(String)); const dist = spec.dist ? (this.get(snap, spec.dist) || {}) : null;
    const drawn = new Set(); ctx.lineWidth = 2; edges.forEach(([u, v]) => { const key = [u, v].sort().join('|'); const a = pos[u], b = pos[v]; if (!a || !b) return; ctx.strokeStyle = visS.has(u) && visS.has(v) ? th.accent : th.border; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); const w = weights[u + '>' + v]; if (w != null && !drawn.has(key)) { drawn.add(key); ctx.fillStyle = th.surface2; const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2; ctx.beginPath(); ctx.arc(mx, my, 10, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = th.warn; ctx.font = 'bold 11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(w), mx, my); } });
    keys.forEach(k => { const p = pos[k]; if (!p) return; const r = 17; ctx.fillStyle = k === cur ? th.warn : visS.has(k) ? th.accent : qS.has(k) ? th.gold : th.primary; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(k, p.x, p.y); if (dist && dist[k] != null) { ctx.fillStyle = th.fg; ctx.font = '11px sans-serif'; ctx.fillText(String(dist[k]), p.x, p.y + r + 10); } });
    ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(`${spec.var}${spec.visited ? ' · 초록=방문' : ''}${spec.cur ? ' · 주황=현재' : ''}${spec.queue ? ' · 노랑=대기' : ''}${spec.dist ? ' · 숫자=거리' : ''}`, 10, H - 6);
  },
  drawGrid(ctx, W, H, snap, spec, prev, t, th) {
    const g = this.get(snap, spec.var); if (!Array.isArray(g) || !g.length) return this.empty(ctx, W, H, `${spec.var} 가 비어 있어요`, th);
    const rows = g.length, cols = Math.max(...g.map(r => Array.isArray(r) ? r.length : 0)); const cs = Math.min(40, (W - 20) / cols, (H - 30) / rows); const ox = (W - cs * cols) / 2, oy = 24;
    const visited = spec.visited ? (this.get(snap, spec.visited) || null) : null; const vset = new Set(); if (visited) { const arr = Array.isArray(visited) ? visited : visited.__set || []; arr.forEach(v => { if (Array.isArray(v)) vset.add(v[0] + ',' + v[1]); }); if (Array.isArray(visited) && Array.isArray(visited[0]) && typeof visited[0][0] !== 'number') {} }
    const vgrid = visited && Array.isArray(visited) && Array.isArray(visited[0]) && visited.length === rows && (typeof visited[0][0] === 'boolean' || typeof visited[0][0] === 'number') ? visited : null;
    const pos = spec.pos ? (Array.isArray(spec.pos) ? spec.pos.map(n => this.num(snap[n])) : (Array.isArray(snap[spec.pos]) ? snap[spec.pos].map(v => this.num(v)) : null)) : null; const path = spec.path ? (this.get(snap, spec.path) || []) : []; const pset = new Set(path.map(p => Array.isArray(p) ? p[0] + ',' + p[1] : ''));
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { const v = Array.isArray(g[r]) ? g[r][c] : undefined; const x = ox + c * cs, y = oy + r * cs; const wall = v === 1 || v === '#' || v === true; const key = r + ',' + c;
      ctx.fillStyle = wall ? th.border : pset.has(key) ? th.gold : (vgrid ? !!vgrid[r][c] : vset.has(key)) ? th.accent : th.surface2; ctx.fillRect(x + 1, y + 1, cs - 2, cs - 2);
      if (!wall && ((typeof v === 'number' && v !== 0) || (typeof v === 'string' && v.length === 1 && v !== '.' && v !== ' ')) && cs >= 18) { ctx.fillStyle = th.fg; ctx.font = `${Math.min(12, cs / 2.5)}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(v), x + cs / 2, y + cs / 2); }
      if (pos && pos[0] === r && pos[1] === c) { ctx.fillStyle = th.warn; ctx.beginPath(); ctx.arc(x + cs / 2, y + cs / 2, cs * 0.3, 0, Math.PI * 2); ctx.fill(); } }
    ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(`${spec.var} ${rows}×${cols}${spec.visited ? ' · 초록=방문' : ''}${spec.pos ? ' · 주황=현재' : ''}${spec.path ? ' · 노랑=경로' : ''}`, 10, 14);
  },
  drawTable(ctx, W, H, snap, spec, prev, t, th) {
    let g = this.get(snap, spec.var); if (!Array.isArray(g) || !g.length) return this.empty(ctx, W, H, `${spec.var} 가 비어 있어요`, th);
    const two = Array.isArray(g[0]); if (!two) g = [g]; const rows = g.length, cols = Math.max(...g.map(r => r.length)); const cw = Math.min(56, (W - 40) / (cols + 1)), ch = Math.min(30, (H - 30) / (rows + 1)); const ox = 20, oy = 24;
    const pg = prev ? this.get(prev, spec.var) : null; const pgrid = pg && Array.isArray(pg) ? (Array.isArray(pg[0]) ? pg : [pg]) : null; const hl = spec.hl ? spec.hl.map(n => this.num(snap[n])) : null;
    ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let c = 0; c < cols; c++) { ctx.fillStyle = th.muted; ctx.fillText(String(c), ox + cw + c * cw + cw / 2, oy + ch / 2); }
    for (let r = 0; r < rows; r++) { if (two) { ctx.fillStyle = th.muted; ctx.fillText(String(r), ox + cw / 2, oy + ch + r * ch + ch / 2); }
      for (let c = 0; c < cols; c++) { const v = g[r][c]; const x = ox + cw + c * cw, y = oy + ch + r * ch; const changed = pgrid && (!pgrid[r] || pgrid[r][c] !== v); const isHl = hl && (two ? (hl[0] === r && hl[1] === c) : hl[0] === c);
        ctx.fillStyle = isHl ? th.warn : changed ? th.accent : (v == null || v === 0 || v === -1 || v === Infinity) ? th.surface2 : th.primary; ctx.fillRect(x + 1, y + 1, cw - 2, ch - 2);
        ctx.fillStyle = v == null ? th.muted : '#fff'; ctx.font = `${Math.min(13, cw / 3.2)}px sans-serif`; ctx.fillText(v == null ? '·' : String(v), x + cw / 2, y + ch / 2); } }
    ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(`${spec.var} · 초록=방금 바뀜${spec.hl ? ' · 주황=지금 칸' : ''}`, 10, 14);
  },
  drawCallstack(ctx, W, H, step, spec, prev, t, th) {
    const stack = (step.stack || []).filter(s => s !== '<module>'); const n = stack.length; ctx.fillStyle = th.muted; ctx.font = '12px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`호출 스택 · 깊이 ${n}`, 10, 16);
    if (!n) { ctx.fillStyle = th.muted; ctx.textAlign = 'center'; ctx.fillText('(함수 밖: 메인)', W / 2, H / 2); return; }
    const bh = Math.min(34, (H - 40) / n), bw = Math.min(260, W - 60); const x = 30, bottom = H - 10; const vars = step.vars || {};
    stack.forEach((fn, i) => { const y = bottom - (i + 1) * (bh + 3); const top = i === n - 1; const s = top && prev && (prev.stack || []).length < step.stack.length ? 0.6 + 0.4 * t : 1; ctx.save(); ctx.translate(x + bw / 2 + i * 10, y + bh / 2); ctx.scale(s, s); ctx.fillStyle = top ? th.warn : th.primary; ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 6); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = `${Math.min(13, bh - 10)}px monospace`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; const args = top ? Object.entries(vars).filter(([k]) => !k.startsWith('_')).slice(0, 4).map(([k, v]) => `${k}=${v}`).join(', ') : ''; ctx.fillText(`${fn}(${args})`.slice(0, 34), -bw / 2 + 8, 0); ctx.restore(); });
  },
  empty(ctx, W, H, msg, th) { ctx.fillStyle = th.muted; ctx.font = '13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(msg, W / 2, H / 2); },
  // ---------- 한 프레임 ----------
  frame(canvas, spec, step, prevStep, t = 1) {
    const ctx = canvas.getContext('2d'); const dpr = window.devicePixelRatio || 1; const W = canvas.clientWidth || 600, H = canvas.clientHeight || 260;
    if (canvas.width !== W * dpr || canvas.height !== H * dpr) { canvas.width = W * dpr; canvas.height = H * dpr; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const th = this.theme(); ctx.fillStyle = th.bg; ctx.fillRect(0, 0, W, H);
    const snap = (step && step.vis) || {}; const prev = prevStep && prevStep.vis || null;
    try { const fn = { bars: 'drawBars', boxes: 'drawBoxes', linked: 'drawLinked', tree: 'drawTree', graph: 'drawGraph', grid: 'drawGrid', table: 'drawTable', callstack: 'drawCallstack' }[spec.kind];
      if (!fn) return this.empty(ctx, W, H, '알 수 없는 시각화: ' + spec.kind, th);
      if (spec.kind === 'callstack') this.drawCallstack(ctx, W, H, step || {}, spec, prevStep, t, th); else this[fn](ctx, W, H, snap, spec, prev, t, th);
    } catch (e) { this.empty(ctx, W, H, '그리기 오류: ' + e.message, th); }
  },
  // ---------- 플레이어 ----------
  player(host, { steps, spec, onLine, truncated, title }) {
    const specs = Array.isArray(spec) ? spec : [spec]; if (!steps || !steps.length) { host.innerHTML = '<div class="muted">기록된 단계가 없어요. 코드가 실행되는지 먼저 확인하세요.</div>'; return null; }
    // 시각화 변수가 바뀐 단계만 남긴다 (설명 줄 하나하나가 아니라 "그림이 변하는 순간")
    const keyOf = (s) => JSON.stringify([s.vis, specs.some(x => x.kind === 'callstack') ? s.stack : null]); const frames = []; let last = null; steps.forEach((s, i) => { const k = keyOf(s); if (k !== last) { frames.push({ ...s, idx: i }); last = k; } }); if (frames.length && frames[frames.length - 1].idx !== steps.length - 1) frames.push({ ...steps[steps.length - 1], idx: steps.length - 1 });
    let i = 0, playing = false, timer = null, raf = null; const speeds = [0.25, 0.5, 1, 2, 4]; let sp = 2;
    host.innerHTML = `<div class="viz"><div class="viz-head"><b>👀 ${esc(title || '시각화')}</b> <span class="muted" id="vzPos"></span>${truncated ? `<span class="warn small">너무 길어서 ${CONFIG.ALGO.traceMaxSteps}단계까지만</span>` : ''}<span class="grow"></span><button class="btn xs" id="vzClose">${T.close}</button></div>
      <div class="viz-canvases">${specs.map((s, k) => `<canvas class="viz-c" data-k="${k}"></canvas>`).join('')}</div>
      <div class="viz-ctrl"><button class="btn sm" id="vzFirst" title="처음">⏮</button><button class="btn sm" id="vzPrev">◀</button><button class="btn sm primary" id="vzPlay">▶ 재생</button><button class="btn sm" id="vzNext">▶</button><input type="range" id="vzSlider" min="0" max="${frames.length - 1}" value="0"><button class="btn sm" id="vzSpeed" title="속도">×1</button></div>
      <div class="viz-out muted small" id="vzOut"></div></div>`;
    const cvs = $$('.viz-c', host); const render = (t = 1) => { if (!cvs[0].isConnected) { /* QA #61: 닫거나 다시 그린 뒤 남은 재생 타이머·애니메이션 정리 */ playing = false; clearInterval(timer); timer = null; if (raf) cancelAnimationFrame(raf); raf = null; return; } const f = frames[i], p = i > 0 ? frames[i - 1] : null; cvs.forEach((c, k) => this.frame(c, specs[k], f, p, t)); $('#vzPos', host).textContent = `${i + 1}/${frames.length} · ${f.line}번 줄${f.fn && f.fn !== '<module>' ? ` · ${f.fn}()` : ''}`; $('#vzSlider', host).value = i; const o = $('#vzOut', host); o.textContent = (f.out || '').split('\n').slice(-3).join('\n'); if (onLine) onLine(f.line); };
    const tween = () => { if (raf) cancelAnimationFrame(raf); const anim = Store.data.settings.anim; if (!anim) return render(1); const t0 = performance.now(), dur = 220 / speeds[sp]; const tick = (now) => { const t = Math.min(1, (now - t0) / dur); render(t < 1 ? t * (2 - t) : 1); if (t < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); };
    const go = (k) => { i = Math.max(0, Math.min(frames.length - 1, k)); tween(); };
    const stop = () => { playing = false; clearInterval(timer); timer = null; const pb = $('#vzPlay', host); if (pb) pb.textContent = '▶ 재생'; };
    const play = () => { if (i >= frames.length - 1) i = 0; playing = true; $('#vzPlay', host).textContent = '⏸ 멈춤'; timer = setInterval(() => { if (i >= frames.length - 1) { stop(); return; } go(i + 1); }, 700 / speeds[sp]); };
    $('#vzPlay', host).onclick = () => playing ? stop() : play(); $('#vzPrev', host).onclick = () => { stop(); go(i - 1); }; $('#vzNext', host).onclick = () => { stop(); go(i + 1); }; $('#vzFirst', host).onclick = () => { stop(); go(0); };
    $('#vzSlider', host).oninput = (e) => { stop(); go(+e.target.value); }; $('#vzSpeed', host).onclick = () => { sp = (sp + 1) % speeds.length; $('#vzSpeed', host).textContent = '×' + speeds[sp]; if (playing) { stop(); play(); } };
    $('#vzClose', host).onclick = () => { stop(); host.innerHTML = ''; if (onLine) onLine(null); };
    const ro = new ResizeObserver(() => { if (!host.isConnected || !cvs[0].isConnected) { ro.disconnect(); return; } render(1); }); cvs.forEach(c => ro.observe(c)); render(1);
    return { stop, go, play, get index() { return i; }, frames };
  },
  // 코드를 추적 실행해서 플레이어로 (lesson 데모·문제 "시각화" 버튼 공용)
  async runAndShow(host, { code, input = '', spec, editor, title, autoplay = true }) {
    if (!host) return null;
    const specs = Array.isArray(spec) ? spec : [spec]; const vars = [...new Set(specs.flatMap(s => [s.var, s.cur, s.visited, s.queue, s.dist, s.order, s.path, ...(s.hl || []), ...(Array.isArray(s.pos) ? s.pos : s.pos ? [s.pos] : [])].filter(Boolean)))];
    host.innerHTML = '<div class="muted">실행하며 기록하는 중…</div>';
    const r = await Py.run({ code, input, trace: true, vis: vars, maxsteps: CONFIG.ALGO.traceMaxSteps, timeoutMs: CONFIG.RUN_TIMEOUT_MS * 2 });
    if (!r.ok && !(r.trace && r.trace.length)) { host.innerHTML = `<div class="errbox"><b>${esc(r.ename || '오류')}</b>: ${esc(r.emsg || '')}<br><span class="errko">💡 ${esc(Py.explain(r))}</span></div>`; return null; }
    const pl = this.player(host, { steps: r.trace || [], spec: specs, truncated: r.truncated, title, onLine: (ln) => { if (editor && editor.setTraceLine) editor.setTraceLine(ln); } });
    if (pl && autoplay && Store.data.settings.anim) pl.play(); return pl;
  },
};
