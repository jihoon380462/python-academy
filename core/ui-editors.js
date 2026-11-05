// core/ui-editors.js — 텍스트/Parsons 에디터 (블록(Blockly) 에디터는 v2.4.0에서 삭제 — 전부 타자)
// ---------- 텍스트 에디터 (CodeMirror 6, 실패 시 textarea 대체) ----------
const CM = {
  modsPromise: null, mods: null, failed: false,
  load() {
    if (this.mods) return Promise.resolve(this.mods); if (this.failed) return Promise.reject(new Error('cm failed'));
    if (!this.modsPromise) this.modsPromise = (async () => {
      const urls = CONFIG.CM; const [core, python, view, state, commands, language, hl] = await Promise.all([urls.core, urls.python, urls.view, urls.state, urls.commands, urls.language, 'https://cdn.jsdelivr.net/npm/@lezer/highlight@1/+esm'].map(u => import(u)));
      const setLines = state.StateEffect.define();
      const lineField = state.StateField.define({ create: () => view.Decoration.none, update(deco, tr) { for (const e of tr.effects) if (e.is(setLines)) { const arr = e.value.filter(x => x.line >= 1 && x.line <= tr.state.doc.lines).sort((a, b) => a.line - b.line); return view.Decoration.set(arr.map(x => view.Decoration.line({ class: x.cls }).range(tr.state.doc.line(x.line).from))); } return deco.map(tr.changes); }, provide: f => view.EditorView.decorations.from(f) });
      const guides = view.ViewPlugin.fromClass(class { constructor(v) { this.deco = this.build(v); } update(u) { if (u.docChanged || u.viewportChanged) this.deco = this.build(u.view); } build(v) { const b = new state.RangeSetBuilder(); const doc = v.state.doc; const max = Math.min(doc.lines, 3000); for (let i = 1; i <= max; i++) { const line = doc.line(i); const n = Math.floor((line.text.match(/^ */)[0].length) / 4); if (n > 0) b.add(line.from, line.from, view.Decoration.line({ class: 'cm-ind cm-ind-' + Math.min(n, 8) })); } return b.finish(); } }, { decorations: v => v.deco });
      const hs = language.HighlightStyle.define([{ tag: hl.tags.keyword, color: 'var(--ed-kw)', fontWeight: 'bold' }, { tag: [hl.tags.string, hl.tags.special(hl.tags.string)], color: 'var(--ed-str)' }, { tag: hl.tags.number, color: 'var(--ed-num)' }, { tag: hl.tags.comment, color: 'var(--ed-com)', fontStyle: 'italic' }, { tag: [hl.tags.function(hl.tags.variableName), hl.tags.function(hl.tags.propertyName)], color: 'var(--ed-num)' }, { tag: hl.tags.bool, color: 'var(--ed-kw)' }, { tag: hl.tags.operator, color: 'var(--ed-fg)' }]);
      const theme = view.EditorView.theme({ '&': { backgroundColor: 'var(--ed-bg)', color: 'var(--ed-fg)', fontSize: 'var(--code-size)', height: '100%' }, '.cm-content': { fontFamily: 'var(--mono)', caretColor: 'var(--ed-fg)' }, '.cm-gutters': { backgroundColor: 'var(--ed-bg)', color: 'var(--ed-com)', borderRight: '1px solid rgba(128,128,128,.2)' }, '.cm-activeLine': { backgroundColor: 'rgba(128,128,128,.12)' }, '.cm-activeLineGutter': { backgroundColor: 'rgba(128,128,128,.12)' }, '&.cm-focused .cm-cursor': { borderLeftColor: 'var(--ed-fg)' }, '&.cm-focused .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(100,150,255,.35) !important' }, '.cm-line.err-line': { backgroundColor: 'rgba(255,80,80,.22)' }, '.cm-line.trace-line': { backgroundColor: 'rgba(255,215,0,.28)' }, '.cm-line.hl-line': { backgroundColor: 'rgba(80,160,255,.22)' } });
      /* QA #121: 줄 앞 공백에서 백스페이스 한 번 = 들여쓰기 한 단계(4칸) 지우기 */
      const smartBack = (v) => { const sel = v.state.selection.main; if (!sel.empty || v.state.selection.ranges.length > 1) return false; const line = v.state.doc.lineAt(sel.head); const before = line.text.slice(0, sel.head - line.from); if (!before.length || /[^ ]/.test(before)) return false; const n = before.length % 4 || 4; v.dispatch({ changes: { from: sel.head - n, to: sel.head }, selection: { anchor: sel.head - n }, userEvent: 'delete.backward' }); return true; };
      let backKey = []; try { backKey = [state.Prec.highest(view.keymap.of([{ key: 'Backspace', run: smartBack }]))]; } catch (e) {}
      /* QA #122: 줄 앞 공백을 한 칸마다 점으로, 4의 배수가 아니면 빨갛게 — 3칸·5칸 헷갈림 */
      let leads = []; try { leads = [view.ViewPlugin.fromClass(class { constructor(v) { this.deco = this.build(v); } update(u) { if (u.docChanged || u.viewportChanged) this.deco = this.build(u.view); } build(v) { const b = new state.RangeSetBuilder(); for (const { from, to } of v.visibleRanges) { let pos = from; while (pos <= to) { const line = v.state.doc.lineAt(pos); const n = line.text.match(/^ */)[0].length; if (n > 0) b.add(line.from, line.from + n, view.Decoration.mark({ class: n % 4 ? 'cm-lead cm-lead-odd' : 'cm-lead' })); pos = line.to + 1; } } return b.finish(); } }, { decorations: v => v.deco })]; } catch (e) {}
      this.mods = { core, python, view, state, commands, language, setLines, lineField, guides, hs, theme, backKey, leads }; return this.mods;
    })().catch(e => { console.info('CodeMirror 로드 실패, 기본 에디터 사용'); this.failed = true; throw e; });
    return this.modsPromise;
  },
};

// else:/elif/except/finally 를 치면 짝이 되는 if/try 와 같은 들여쓰기로 자동으로 맞춘다 (초보자가 백스페이스로 지우지 않게)
function dedentTarget(lines, idx) {
  const cur = lines[idx]; const m = cur.match(/^( +)(else|elif\b.*|except\b.*|finally):\s*$/); if (!m) return null;
  const ind = m[1].length;
  for (let k = idx - 1; k >= 0; k--) { const l = lines[k]; if (!l.trim()) continue; const li = l.match(/^ */)[0].length; if (li < ind) { if (/^\s*(if|elif|else|try|except|for|while|with)\b/.test(l)) return li; return li; } }
  return 0;
}
class TextEditor {
  constructor(parent, { value = '', onChange = null, readOnly = false } = {}) {
    this.parent = parent; this.onChange = onChange; this.readOnly = readOnly; this.cm = null; this.ta = null; this.value = value; this.lines = []; this.destroyed = false;
    parent.classList.add('ted'); parent.innerHTML = '';
    this.buildFallback(value); // 즉시 쓸 수 있게 먼저 textarea, CM이 준비되면 교체
    CM.load().then(m => { if (this.destroyed) return; this.buildCM(m, this.getValue()); }).catch(() => {});
  }
  buildFallback(value) {
    const wrap = document.createElement('div'); wrap.className = 'ted-fb'; wrap.innerHTML = `<pre class="ted-gutter"></pre><textarea class="ted-ta" wrap="off" spellcheck="false" autocapitalize="off" autocorrect="off" ${this.readOnly ? 'readonly' : ''}></textarea>`;
    this.parent.appendChild(wrap); this.fb = wrap; this.ta = $('textarea', wrap); this.gut = $('.ted-gutter', wrap); this.ta.value = value; this.updateGutter(); /* QA #122: 기본 편집기는 점을 못 그려서 커서 줄 들여쓰기 칸 수를 글자로 */ const ind = document.createElement('div'); ind.className = 'ted-ind'; wrap.appendChild(ind); const showInd = () => { const ta = this.ta; if (!ta) return; const pos = ta.selectionStart; const st = ta.value.lastIndexOf('\n', pos - 1) + 1; const n = (ta.value.slice(st).match(/^ */) || [''])[0].length; ind.textContent = n ? `들여쓰기 ${n}칸${n % 4 ? ' ⚠ 4의 배수가 아니에요' : ''}` : ''; ind.classList.toggle('odd', n % 4 !== 0); }; ['input', 'keyup', 'click', 'focus'].forEach(ev => this.ta.addEventListener(ev, showInd));
    this.ta.addEventListener('input', (e) => { if (e.data === ':') this.autoDedentTA(); this.updateGutter(); this.onChange && this.onChange(this.getValue()); });
    this.ta.addEventListener('scroll', () => { this.gut.scrollTop = this.ta.scrollTop; });
    this.ta.addEventListener('focus', () => QuickKeys.show(this)); this.ta.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== this.ta) QuickKeys.hide(); }, 150));
    this.ta.addEventListener('keydown', (e) => {
      const ta = this.ta; if (e.key === 'Tab') { e.preventDefault(); this.insert('    ', 4); }
      else if (e.key === 'Backspace' && ta.selectionStart === ta.selectionEnd) { /* QA #121(사용자 제보 11/4): 줄 앞 공백에서는 한 번에 들여쓰기 한 단계(4칸)를 지워요 */ const pos = ta.selectionStart; const before = ta.value.slice(ta.value.lastIndexOf('\n', pos - 1) + 1, pos); if (before.length && !/[^ ]/.test(before)) { e.preventDefault(); const n = before.length % 4 || 4; ta.value = ta.value.slice(0, pos - n) + ta.value.slice(pos); ta.selectionStart = ta.selectionEnd = pos - n; this.updateGutter(); this.onChange && this.onChange(this.getValue()); } }
      else if (e.key === 'Enter') { e.preventDefault(); const pos = ta.selectionStart; const before = ta.value.slice(0, pos); const line = before.slice(before.lastIndexOf('\n') + 1); let ind = line.match(/^ */)[0]; if (/:\s*$/.test(line)) ind += '    '; this.insert('\n' + ind, 1 + ind.length); }
    });
  }
  autoDedentTA() { const ta = this.ta; const pos = ta.selectionStart; const lines = ta.value.split('\n'); let acc = 0, idx = 0; for (let k = 0; k < lines.length; k++) { if (pos <= acc + lines[k].length) { idx = k; break; } acc += lines[k].length + 1; idx = k; } const t = dedentTarget(lines, idx); if (t == null) return; const cur = lines[idx]; const ind = cur.match(/^ */)[0].length; if (t === ind) return; lines[idx] = ' '.repeat(t) + cur.trimStart(); ta.value = lines.join('\n'); const np = pos - (ind - t); ta.selectionStart = ta.selectionEnd = Math.max(0, np); }
  updateGutter() { if (!this.gut) return; const n = this.ta.value.split('\n').length; this.gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); }
  buildCM(m, value) {
    const { core, python, view, state, commands, language } = m; this.m = m;
    this.lineEffect = m.setLines; const host = document.createElement('div'); host.className = 'ted-cm';
    this.cm = new view.EditorView({ doc: value, parent: host, extensions: [core.basicSetup, python.python(), ...(m.backKey || []), view.keymap.of([commands.indentWithTab]), ...(m.leads || []), language.indentUnit.of('    '), language.syntaxHighlighting(m.hs), m.theme, m.lineField, m.guides, view.EditorView.editable.of(!this.readOnly), view.EditorView.updateListener.of(u => { if (u.docChanged) { this.autoDedentCM(u); if (this.onChange) this.onChange(this.getValue()); } }), view.EditorView.domEventHandlers({ focus: () => QuickKeys.show(this), blur: () => setTimeout(() => { if (!this.cm || !this.cm.hasFocus) QuickKeys.hide(); }, 150) })] });
    if (this.fb) this.fb.remove(); this.fb = null; this.ta = null; this.parent.appendChild(host); if (this.lines.length) this.setLines(this.lines);
  }
  autoDedentCM(u) { try { let typedColon = false; u.changes.iterChanges((fa, ta, fb, tb, ins) => { if (ins.toString() === ':') typedColon = true; }); if (!typedColon || this._dedenting) return; const doc = this.cm.state.doc; const head = this.cm.state.selection.main.head; const ln = doc.lineAt(head); const lines = []; for (let k = 1; k <= ln.number; k++) lines.push(doc.line(k).text); const t = dedentTarget(lines, ln.number - 1); if (t == null) return; const ind = ln.text.match(/^ */)[0].length; if (t === ind) return; this._dedenting = true; this.cm.dispatch({ changes: { from: ln.from, to: ln.from + ind, insert: ' '.repeat(t) } }); this._dedenting = false; } catch (e) { this._dedenting = false; } }
  getValue() { return this.cm ? this.cm.state.doc.toString() : this.ta.value; }
  setValue(v) { if (this.cm) this.cm.dispatch({ changes: { from: 0, to: this.cm.state.doc.length, insert: v } }); else { this.ta.value = v; this.updateGutter(); } }
  focus() { this.cm ? this.cm.focus() : this.ta.focus(); }
  insert(text, cursorOffset) { if (this.cm) { const sel = this.cm.state.selection.main; this.cm.dispatch({ changes: { from: sel.from, to: sel.to, insert: text }, selection: { anchor: sel.from + cursorOffset } }); } else { const ta = this.ta, s = ta.selectionStart, e = ta.selectionEnd; ta.value = ta.value.slice(0, s) + text + ta.value.slice(e); ta.selectionStart = ta.selectionEnd = s + cursorOffset; this.updateGutter(); this.onChange && this.onChange(ta.value); } }
  dedentLine() { if (this.cm) { const doc = this.cm.state.doc; const ln = doc.lineAt(this.cm.state.selection.main.head); const n = Math.min(4, (ln.text.match(/^ */) || [''])[0].length); if (n) this.cm.dispatch({ changes: { from: ln.from, to: ln.from + n, insert: '' } }); } else { const ta = this.ta; const pos = ta.selectionStart; const ls = ta.value.lastIndexOf('\n', pos - 1) + 1; const n = Math.min(4, (ta.value.slice(ls).match(/^ */) || [''])[0].length); if (n) { ta.value = ta.value.slice(0, ls) + ta.value.slice(ls + n); ta.selectionStart = ta.selectionEnd = Math.max(ls, pos - n); this.updateGutter(); this.onChange && this.onChange(this.getValue()); } } }
  moveCursor(d) { if (this.cm) { const p = clamp(this.cm.state.selection.main.head + d, 0, this.cm.state.doc.length); this.cm.dispatch({ selection: { anchor: p } }); } else { const p = clamp(this.ta.selectionStart + d, 0, this.ta.value.length); this.ta.selectionStart = this.ta.selectionEnd = p; } }
  setLines(arr) { this.lines = arr; if (this.cm) this.cm.dispatch({ effects: this.lineEffect.of(arr) }); }
  setErrorLine(n) { this.setLines(n ? [{ line: n, cls: 'err-line' }] : []); }
  setTraceLine(n) { this.setLines(n ? [{ line: n, cls: 'trace-line' }] : []); if (this.cm && n) { try { const l = this.cm.state.doc.line(Math.min(n, this.cm.state.doc.lines)); this.cm.dispatch({ effects: this.m.view.EditorView.scrollIntoView(l.from, { y: 'center' }) }); } catch (e) {} } }
  setHighlightLines(ls) { this.setLines(ls.map(l => ({ line: l, cls: 'hl-line' }))); }
  destroy() { this.destroyed = true; if (this.cm) this.cm.destroy(); this.parent.innerHTML = ''; }
}

// ---------- Parsons 에디터 ----------
class ParsonsEditor {
  constructor(parent, { problem, state, onChange = null }) {
    this.parent = parent; this.p = problem; this.onChange = onChange; parent.classList.add('parsons'); const lines = Grader.parsonsLines(problem.parsons.solution).map(l => l.text); const extra = (problem.parsons.distractors || []).map(s => s.trim());
    const all = lines.concat(extra); const seedSort = all.map((t, i) => ({ t, k: Math.sin(i * 9301 + t.length * 49297) })).sort((a, b) => a.k - b.k).map(x => x.t);
    this.bank = seedSort.map(t => ({ id: uid(), text: t })); this.answer = [];
    if (state && state.answer) { this.answer = state.answer.map(a => ({ id: uid(), text: a.text, indent: a.indent })); const used = {}; this.answer.forEach(a => used[a.text] = (used[a.text] || 0) + 1); this.bank = this.bank.filter(b => { if (used[b.text]) { used[b.text]--; return false; } return true; }); }
    this.render();
  }
  getState() { return { answer: this.answer.map(a => ({ text: a.text, indent: a.indent })) }; }
  getCode() { return this.answer.map(a => '    '.repeat(a.indent) + a.text).join('\n'); }
  render() {
    const el = this.parent; el.innerHTML = `<div class="pz-col"><div class="pz-head">사용 가능한 줄 <small>(눌러서 추가)</small></div><div class="pz-list pz-bank"></div></div><div class="pz-col"><div class="pz-head">내 코드 <small>(드래그로 순서, ◀▶로 들여쓰기)</small></div><div class="pz-list pz-answer"></div></div>`;
    const bank = $('.pz-bank', el), ans = $('.pz-answer', el);
    this.bank.forEach(b => { const t = document.createElement('div'); t.className = 'pz-tile'; t.innerHTML = `<code>${esc(b.text)}</code>`; t.onclick = () => { this.bank = this.bank.filter(x => x !== b); this.answer.push({ ...b, indent: 0 }); Audio.click(); this.render(); }; bank.appendChild(t); });
    if (!this.answer.length) ans.innerHTML = `<div class="pz-empty">왼쪽(위) 줄을 눌러 여기에 추가하세요</div>`;
    this.answer.forEach((a, i) => {
      const t = document.createElement('div'); t.className = 'pz-tile pz-ans'; t.dataset.i = i; t.style.setProperty('--ind', a.indent);
      t.innerHTML = `<span class="pz-grip" title="드래그">⠿</span><button class="pz-b" data-a="l" title="왼쪽으로">◀</button><button class="pz-b" data-a="r" title="오른쪽으로">▶</button><span class="pz-ind">${'│&nbsp;&nbsp;&nbsp;'.repeat(a.indent)}</span><code>${esc(a.text)}</code><button class="pz-b" data-a="u" title="위로">▲</button><button class="pz-b" data-a="d" title="아래로">▼</button><button class="pz-b pz-x" data-a="x" title="빼기">✕</button>`;
      $$('button', t).forEach(btn => btn.onclick = (e) => { e.stopPropagation(); const k = btn.dataset.a; if (k === 'l') a.indent = Math.max(0, a.indent - 1); if (k === 'r') a.indent = Math.min(4, a.indent + 1); if (k === 'u' && i > 0) { this.answer.splice(i, 1); this.answer.splice(i - 1, 0, a); } if (k === 'd' && i < this.answer.length - 1) { this.answer.splice(i, 1); this.answer.splice(i + 1, 0, a); } if (k === 'x') { this.answer.splice(i, 1); this.bank.push({ id: a.id, text: a.text }); } Audio.click(); this.render(); });
      this.drag(t, i); ans.appendChild(t);
    });
    if (this.wrong) this.wrong.forEach(i => { const t = $(`.pz-ans[data-i="${i}"]`, el); if (t) t.classList.add('wrong'); });
    if (this.onChange && this._rendered) this.onChange(); this._rendered = true;
  }
  drag(tile, idx) {
    const grip = $('.pz-grip', tile); let ghost = null, startX = 0, startInd = 0;
    grip.addEventListener('pointerdown', (e) => {
      e.preventDefault(); grip.setPointerCapture(e.pointerId); startX = e.clientX; startInd = this.answer[idx].indent; ghost = tile.cloneNode(true); ghost.className += ' pz-ghost'; document.body.appendChild(ghost); tile.classList.add('dragging');
      const move = (ev) => { ghost.style.left = (ev.clientX - 30) + 'px'; ghost.style.top = (ev.clientY - 18) + 'px'; const dx = ev.clientX - startX; this.answer[idx].indent = clamp(startInd + Math.round(dx / 40), 0, 4); const over = document.elementFromPoint(ev.clientX, ev.clientY); const t = over && over.closest('.pz-ans'); $$('.pz-ans', this.parent).forEach(x => x.classList.remove('over')); if (t && t !== tile) t.classList.add('over'); };
      const up = (ev) => { grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', up); ghost.remove(); tile.classList.remove('dragging'); const over = document.elementFromPoint(ev.clientX, ev.clientY); const t = over && over.closest('.pz-ans'); const item = this.answer[idx]; if (t && t !== tile) { const j = +t.dataset.i; this.answer.splice(idx, 1); this.answer.splice(j, 0, item); } Audio.click(); this.render(); };
      grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', up);
    });
  }
  markWrong(idxs) { this.wrong = idxs; this.render(); setTimeout(() => { this.wrong = null; }, 1500); }
  getArranged() { return this.answer.map(a => ({ text: a.text, indent: a.indent })); }
  destroy() { this.parent.innerHTML = ''; }
}
