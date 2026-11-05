// core/ui-editors.js — 텍스트/Parsons 에디터 (블록(Blockly) 에디터는 v2.4.0에서 삭제 — 전부 타자)
// ---------- 텍스트 에디터 (CodeMirror 6, 실패 시 textarea 대체) ----------
const CM = {
  modsPromise: null, mods: null, failed: false, langP: {},
  lang(id) { /* v2.7.0: 파이썬 외 언어 모듈(sql·html·css·js)을 필요할 때만 CDN 에서 — 실패해도 편집기는 뜸 */ if (!id || id === 'python' || !this.mods) return Promise.resolve(); if (!this.langP[id]) { const u = { sql: '@codemirror/lang-sql@6', html: '@codemirror/lang-html@6', css: '@codemirror/lang-css@6', js: '@codemirror/lang-javascript@6' }[id]; this.langP[id] = u ? import(`https://cdn.jsdelivr.net/npm/${u}/+esm`).then(mod => { const ext = id === 'js' ? mod.javascript() : mod[id](); this.mods.langs = this.mods.langs || {}; this.mods.langs[id] = ext; }).catch(() => {}) : Promise.resolve(); } return this.langP[id]; },
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
      /* QA #122: 줄 앞 공백을 한 칸마다 점으로, 4의 배수가 아니면 빨갛게 — 3칸·5칸 헷갈림. QA #159: 괄호 안에서 이어 쓰는 줄·공백뿐인 줄은 빨갛게 안 함(들여쓰기 규칙 밖) */
      let leads = []; try { leads = [view.ViewPlugin.fromClass(class { constructor(v) { this.deco = this.build(v); } update(u) { if (u.docChanged || u.viewportChanged) this.deco = this.build(u.view); } build(v) { const b = new state.RangeSetBuilder(); const doc = v.state.doc; const depth = bracketDepths(Array.from({ length: Math.min(doc.lines, 3000) }, (_, i) => doc.line(i + 1).text)); for (const { from, to } of v.visibleRanges) { let pos = from; while (pos <= to) { const line = doc.lineAt(pos); const n = line.text.match(/^ */)[0].length; if (n > 0) b.add(line.from, line.from + n, view.Decoration.mark({ class: n % 4 && n < line.text.length && !depth[line.number - 1] ? 'cm-lead cm-lead-odd' : 'cm-lead' })); pos = line.to + 1; } } return b.finish(); } }, { decorations: v => v.deco })]; } catch (e) {}
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
/* QA #159: 줄마다 「이 줄이 시작될 때 열린 괄호 수」 — 괄호 안에서 이어 쓰는 줄은 들여쓰기 칸 수 경고에서 뺀다 (문자열·주석 속 괄호는 대충 걷어냄, 세 따옴표 문자열은 안 봄) */
function bracketDepths(lines) { let d = 0; return lines.map(l => { const at = d; const t = l.replace(/(["'])(?:\\.|(?!\1).)*\1/g, '""').replace(/#.*$/, ''); for (const ch of t) { if ('([{'.includes(ch)) d++; else if (')]}'.includes(ch) && d > 0) d--; } return at; }); }
class TextEditor {
  constructor(parent, { value = '', onChange = null, readOnly = false, lang = 'python' } = {}) { /* v2.7.0: lang 'python'|'sql'|'html'|'css'|'js' — 파이썬이 아니면 들여쓰기 규칙·빠른 키·경고를 끄고 CodeMirror 언어 모듈을 따로 받음(없으면 하이라이트 없이) */
    this.parent = parent; this.lang = lang; this.py = lang === 'python'; this.onChange = onChange; this.readOnly = readOnly; this.cm = null; this.ta = null; this.value = value; this.lines = []; this.destroyed = false;
    parent.classList.add('ted'); parent.innerHTML = '';
    this.buildFallback(value); // 즉시 쓸 수 있게 먼저 textarea, CM이 준비되면 교체
    CM.load().then(m => CM.lang(this.lang).then(() => m)).then(m => { if (this.destroyed) return; this.buildCM(m, this.getValue()); }).catch(() => {});
  }
  buildFallback(value) {
    const wrap = document.createElement('div'); wrap.className = 'ted-fb'; wrap.innerHTML = `<pre class="ted-gutter"></pre><textarea class="ted-ta" wrap="off" spellcheck="false" autocapitalize="off" autocorrect="off" ${this.readOnly ? 'readonly' : ''}></textarea>`;
    this.parent.appendChild(wrap); this.fb = wrap; this.ta = $('textarea', wrap); this.gut = $('.ted-gutter', wrap); this.ta.value = value; this.updateGutter(); /* QA #122: 기본 편집기는 점을 못 그려서 커서 줄 들여쓰기 칸 수를 글자로. QA #159: 괄호 안 이어 쓰는 줄·공백뿐인 줄은 경고 없이 칸 수만 */ const ind = document.createElement('div'); ind.className = 'ted-ind'; wrap.appendChild(ind); const showInd = this._showInd = () => { const ta = this.ta; if (!ta) return; const pos = ta.selectionStart; const st = ta.value.lastIndexOf('\n', pos - 1) + 1; const lines = ta.value.slice(0, st).split('\n'); const cur = ta.value.slice(st).split('\n')[0]; const n = (cur.match(/^ */) || [''])[0].length; const inBr = n > 0 && bracketDepths(lines)[lines.length - 1] > 0; const blank = n > 0 && n === cur.length; const odd = n % 4 !== 0 && !inBr && !blank; ind.textContent = n && this.py ? `들여쓰기 ${n}칸${odd ? ' ⚠ 4의 배수가 아니에요' : inBr ? ' (괄호 안)' : ''}` : ''; ind.classList.toggle('odd', odd); }; ['input', 'keyup', 'click', 'focus'].forEach(ev => this.ta.addEventListener(ev, showInd));
    this.ta.addEventListener('input', (e) => { if (e.data === ':' && this.py) this.autoDedentTA(); this.updateGutter(); this.onChange && this.onChange(this.getValue()); });
    this.ta.addEventListener('scroll', () => { this.gut.scrollTop = this.ta.scrollTop; });
    this.ta.addEventListener('focus', () => { if (this.py) QuickKeys.show(this); }); this.ta.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== this.ta) QuickKeys.hide(); }, 150));
    this.ta.addEventListener('keydown', (e) => {
      const ta = this.ta; if (e.isComposing || e.keyCode === 229) return; /* QA #159: 한글 조합 중엔 건드리지 않음 */
      if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); this.insert('    ', 4); }
      else if (e.key === 'Backspace' && !e.ctrlKey && !e.altKey && !e.metaKey && ta.selectionStart === ta.selectionEnd) { /* QA #121(사용자 제보 11/4): 줄 앞 공백에서는 한 번에 들여쓰기 한 단계(4칸)를 지워요. QA #159: Ctrl/Alt/Cmd+⌫(낱말 지우기)는 브라우저 기본대로 */ const pos = ta.selectionStart; const before = ta.value.slice(ta.value.lastIndexOf('\n', pos - 1) + 1, pos); if (before.length && !/[^ ]/.test(before)) { e.preventDefault(); const n = before.length % 4 || 4; this.taEdit(pos - n, pos, '', pos - n); } }
      else if (e.key === 'Enter' && !e.ctrlKey && !e.altKey && !e.metaKey) { e.preventDefault(); const pos = ta.selectionStart; const before = ta.value.slice(0, pos); const line = before.slice(before.lastIndexOf('\n') + 1); let ind = line.match(/^ */)[0]; if (this.py ? /:\s*$/.test(line) : /[{(\[]\s*$/.test(line)) ind += '    '; this.insert('\n' + ind, 1 + ind.length); }
    });
  }
  /* QA #156: 값을 ta.value= 로 바꾸면 실행 취소(Ctrl+Z) 기록이 통째로 날아가요 — execCommand(insertText/delete)로 브라우저 편집 기록에 남기고, 안 되는 환경만 예전 방식(그때는 input 이벤트가 안 나므로 직접 갱신) */
  taEdit(s, e, text, cursor) { const ta = this.ta; if (!ta || (s === e && !text)) return; const want = ta.value.slice(0, s) + text + ta.value.slice(e); let ok = false; try { if (document.activeElement !== ta) ta.focus(); ta.setSelectionRange(s, e); ok = document.execCommand(text ? 'insertText' : 'delete', false, text) && ta.value === want; } catch (_) { ok = false; } if (!ok) { ta.value = want; ta.setSelectionRange(cursor, cursor); this.updateGutter(); this.onChange && this.onChange(want); } else ta.setSelectionRange(cursor, cursor); this._showInd && this._showInd(); }
  autoDedentTA() { const ta = this.ta; const pos = ta.selectionStart; const lines = ta.value.split('\n'); let acc = 0, idx = 0; for (let k = 0; k < lines.length; k++) { if (pos <= acc + lines[k].length) { idx = k; break; } acc += lines[k].length + 1; idx = k; } const t = dedentTarget(lines, idx); if (t == null) return; const cur = lines[idx]; const ind = cur.match(/^ */)[0].length; if (t === ind) return; this.taEdit(acc, acc + ind, ' '.repeat(t), Math.max(acc, pos - (ind - t))); }
  updateGutter() { if (!this.gut) return; const n = this.ta.value.split('\n').length; this.gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); }
  buildCM(m, value) {
    const { core, python, view, state, commands, language } = m; this.m = m;
    this.lineEffect = m.setLines; const host = document.createElement('div'); host.className = 'ted-cm';
    this.cm = new view.EditorView({ doc: value, parent: host, extensions: [core.basicSetup, ...(this.py ? [python.python()] : (m.langs && m.langs[this.lang] ? [m.langs[this.lang]] : [])), ...(m.backKey || []), view.keymap.of([commands.indentWithTab]), ...(this.py ? (m.leads || []) : []), language.indentUnit.of('    '), language.syntaxHighlighting(m.hs), m.theme, m.lineField, m.guides, view.EditorView.editable.of(!this.readOnly), view.EditorView.updateListener.of(u => { if (u.docChanged) { if (this.py) this.autoDedentCM(u); if (this.onChange) this.onChange(this.getValue()); } }), view.EditorView.domEventHandlers({ focus: () => QuickKeys.show(this), blur: () => setTimeout(() => { if (!this.cm || !this.cm.hasFocus) QuickKeys.hide(); }, 150) })] });
    if (this.fb) this.fb.remove(); this.fb = null; this.ta = null; this.parent.appendChild(host); if (this.lines.length) this.setLines(this.lines);
  }
  autoDedentCM(u) { try { let typedColon = false; u.changes.iterChanges((fa, ta, fb, tb, ins) => { if (ins.toString() === ':') typedColon = true; }); if (!typedColon || this._dedenting) return; const doc = this.cm.state.doc; const head = this.cm.state.selection.main.head; const ln = doc.lineAt(head); const lines = []; for (let k = 1; k <= ln.number; k++) lines.push(doc.line(k).text); const t = dedentTarget(lines, ln.number - 1); if (t == null) return; const ind = ln.text.match(/^ */)[0].length; if (t === ind) return; this._dedenting = true; this.cm.dispatch({ changes: { from: ln.from, to: ln.from + ind, insert: ' '.repeat(t) } }); this._dedenting = false; } catch (e) { this._dedenting = false; } }
  getValue() { return this.cm ? this.cm.state.doc.toString() : this.ta.value; }
  setValue(v) { if (this.cm) this.cm.dispatch({ changes: { from: 0, to: this.cm.state.doc.length, insert: v } }); else { this.ta.value = v; this.updateGutter(); this._showInd && this._showInd(); /* QA #159: 「처음 코드로」 뒤 칸 수 표시 갱신 */ } }
  focus() { this.cm ? this.cm.focus() : this.ta.focus(); }
  insert(text, cursorOffset) { if (this.cm) { const sel = this.cm.state.selection.main; this.cm.dispatch({ changes: { from: sel.from, to: sel.to, insert: text }, selection: { anchor: sel.from + cursorOffset } }); } else { const ta = this.ta, s = ta.selectionStart, e = ta.selectionEnd; this.taEdit(s, e, text, s + cursorOffset); } }
  dedentLine() { if (this.cm) { const doc = this.cm.state.doc; const ln = doc.lineAt(this.cm.state.selection.main.head); const n = Math.min(4, (ln.text.match(/^ */) || [''])[0].length); if (n) this.cm.dispatch({ changes: { from: ln.from, to: ln.from + n, insert: '' } }); } else { const ta = this.ta; const pos = ta.selectionStart; const ls = ta.value.lastIndexOf('\n', pos - 1) + 1; const n = Math.min(4, (ta.value.slice(ls).match(/^ */) || [''])[0].length); if (n) this.taEdit(ls, ls + n, '', Math.max(ls, pos - n)); } }
  moveCursor(d) { if (this.cm) { const p = clamp(this.cm.state.selection.main.head + d, 0, this.cm.state.doc.length); this.cm.dispatch({ selection: { anchor: p } }); } else { const p = clamp(this.ta.selectionStart + d, 0, this.ta.value.length); this.ta.selectionStart = this.ta.selectionEnd = p; this._showInd && this._showInd(); } }
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
