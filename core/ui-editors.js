// core/ui-editors.js — 텍스트/블록/Parsons 에디터
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
      this.mods = { core, python, view, state, commands, language, setLines, lineField, guides, hs, theme }; return this.mods;
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
    const wrap = document.createElement('div'); wrap.className = 'ted-fb'; wrap.innerHTML = `<pre class="ted-gutter"></pre><textarea class="ted-ta" spellcheck="false" autocapitalize="off" autocorrect="off" ${this.readOnly ? 'readonly' : ''}></textarea>`;
    this.parent.appendChild(wrap); this.fb = wrap; this.ta = $('textarea', wrap); this.gut = $('.ted-gutter', wrap); this.ta.value = value; this.updateGutter();
    this.ta.addEventListener('input', (e) => { if (e.data === ':') this.autoDedentTA(); this.updateGutter(); this.onChange && this.onChange(this.getValue()); });
    this.ta.addEventListener('scroll', () => { this.gut.scrollTop = this.ta.scrollTop; });
    this.ta.addEventListener('focus', () => QuickKeys.show(this)); this.ta.addEventListener('blur', () => setTimeout(() => { if (document.activeElement !== this.ta) QuickKeys.hide(); }, 150));
    this.ta.addEventListener('keydown', (e) => {
      const ta = this.ta; if (e.key === 'Tab') { e.preventDefault(); this.insert('    ', 4); }
      else if (e.key === 'Enter') { e.preventDefault(); const pos = ta.selectionStart; const before = ta.value.slice(0, pos); const line = before.slice(before.lastIndexOf('\n') + 1); let ind = line.match(/^ */)[0]; if (/:\s*$/.test(line)) ind += '    '; this.insert('\n' + ind, 1 + ind.length); }
    });
  }
  autoDedentTA() { const ta = this.ta; const pos = ta.selectionStart; const lines = ta.value.split('\n'); let acc = 0, idx = 0; for (let k = 0; k < lines.length; k++) { if (pos <= acc + lines[k].length) { idx = k; break; } acc += lines[k].length + 1; idx = k; } const t = dedentTarget(lines, idx); if (t == null) return; const cur = lines[idx]; const ind = cur.match(/^ */)[0].length; if (t === ind) return; lines[idx] = ' '.repeat(t) + cur.trimStart(); ta.value = lines.join('\n'); const np = pos - (ind - t); ta.selectionStart = ta.selectionEnd = Math.max(0, np); }
  updateGutter() { if (!this.gut) return; const n = this.ta.value.split('\n').length; this.gut.textContent = Array.from({ length: n }, (_, i) => i + 1).join('\n'); }
  buildCM(m, value) {
    const { core, python, view, state, commands, language } = m; this.m = m;
    this.lineEffect = m.setLines; const host = document.createElement('div'); host.className = 'ted-cm';
    this.cm = new view.EditorView({ doc: value, parent: host, extensions: [core.basicSetup, python.python(), view.keymap.of([commands.indentWithTab]), language.indentUnit.of('    '), language.syntaxHighlighting(m.hs), m.theme, m.lineField, m.guides, view.EditorView.editable.of(!this.readOnly), view.EditorView.updateListener.of(u => { if (u.docChanged) { this.autoDedentCM(u); if (this.onChange) this.onChange(this.getValue()); } }), view.EditorView.domEventHandlers({ focus: () => QuickKeys.show(this), blur: () => setTimeout(() => { if (!this.cm || !this.cm.hasFocus) QuickKeys.hide(); }, 150) })] });
    if (this.fb) this.fb.remove(); this.fb = null; this.ta = null; this.parent.appendChild(host); if (this.lines.length) this.setLines(this.lines);
  }
  autoDedentCM(u) { try { let typedColon = false; u.changes.iterChanges((fa, ta, fb, tb, ins) => { if (ins.toString() === ':') typedColon = true; }); if (!typedColon || this._dedenting) return; const doc = this.cm.state.doc; const head = this.cm.state.selection.main.head; const ln = doc.lineAt(head); const lines = []; for (let k = 1; k <= ln.number; k++) lines.push(doc.line(k).text); const t = dedentTarget(lines, ln.number - 1); if (t == null) return; const ind = ln.text.match(/^ */)[0].length; if (t === ind) return; this._dedenting = true; this.cm.dispatch({ changes: { from: ln.from, to: ln.from + ind, insert: ' '.repeat(t) } }); this._dedenting = false; } catch (e) { this._dedenting = false; } }
  getValue() { return this.cm ? this.cm.state.doc.toString() : this.ta.value; }
  setValue(v) { if (this.cm) this.cm.dispatch({ changes: { from: 0, to: this.cm.state.doc.length, insert: v } }); else { this.ta.value = v; this.updateGutter(); } }
  focus() { this.cm ? this.cm.focus() : this.ta.focus(); }
  insert(text, cursorOffset) { if (this.cm) { const sel = this.cm.state.selection.main; this.cm.dispatch({ changes: { from: sel.from, to: sel.to, insert: text }, selection: { anchor: sel.from + cursorOffset } }); } else { const ta = this.ta, s = ta.selectionStart, e = ta.selectionEnd; ta.value = ta.value.slice(0, s) + text + ta.value.slice(e); ta.selectionStart = ta.selectionEnd = s + cursorOffset; this.updateGutter(); this.onChange && this.onChange(ta.value); } }
  moveCursor(d) { if (this.cm) { const p = clamp(this.cm.state.selection.main.head + d, 0, this.cm.state.doc.length); this.cm.dispatch({ selection: { anchor: p } }); } else { const p = clamp(this.ta.selectionStart + d, 0, this.ta.value.length); this.ta.selectionStart = this.ta.selectionEnd = p; } }
  setLines(arr) { this.lines = arr; if (this.cm) this.cm.dispatch({ effects: this.lineEffect.of(arr) }); }
  setErrorLine(n) { this.setLines(n ? [{ line: n, cls: 'err-line' }] : []); }
  setTraceLine(n) { this.setLines(n ? [{ line: n, cls: 'trace-line' }] : []); if (this.cm && n) { try { const l = this.cm.state.doc.line(Math.min(n, this.cm.state.doc.lines)); this.cm.dispatch({ effects: this.m.view.EditorView.scrollIntoView(l.from, { y: 'center' }) }); } catch (e) {} } }
  setHighlightLines(ls) { this.setLines(ls.map(l => ({ line: l, cls: 'hl-line' }))); }
  destroy() { this.destroyed = true; if (this.cm) this.cm.destroy(); this.parent.innerHTML = ''; }
}

// ---------- 블록 에디터 (Blockly) ----------
const Blocks = {
  loadPromise: null, failed: false,
  load() {
    if (window.Blockly && window.python) return Promise.resolve();
    if (!this.loadPromise) this.loadPromise = (async () => { await loadScript(CONFIG.BLOCKLY.core); await loadScript(CONFIG.BLOCKLY.python); try { await loadScript(CONFIG.BLOCKLY.ko); } catch (e) {} this.setup(); })().catch(e => { this.failed = true; throw e; });
    return this.loadPromise;
  },
  gen() { return (window.python && python.pythonGenerator) || Blockly.Python; },
  setup() {
    // 블록을 끼울 때 붙는 판정 범위를 넓게 (기본 28px → 초보자가 대충 가져가도 붙도록)
    try { Blockly.config.snapRadius = 64; Blockly.config.connectingSnapRadius = 84; Blockly.config.currentConnectionPreference = 20; } catch (e) {}
    const RES = new Set('False,None,True,and,as,assert,break,class,continue,def,del,elif,else,except,finally,for,from,global,if,import,in,is,lambda,nonlocal,not,or,pass,raise,return,try,while,with,yield,print,input,int,str,len,list,dict,range'.split(','));
    // Blockly 기본 창(window.prompt/confirm/alert) 대신 앱 안의 모달 사용 — 변수 만들기/이름 바꾸기/지우기
    try {
      // 추천 변수 이름: 지금 문제의 정답 코드에 나오는 이름 먼저, 그다음 자주 쓰는 이름
      const suggest = () => { const out = []; try { if (UI.view === 'problem' && UI.params.pid) { const p = Content.problem(UI.params.pid); const sol = (p && p.solution) || ''; for (const m of sol.matchAll(/^\s*([A-Za-z_]\w*)\s*(?:\+|-|\*)?=/gm)) out.push(m[1]); for (const m of sol.matchAll(/\bfor\s+([A-Za-z_]\w*)\s+in\b/g)) out.push(m[1]); } } catch (e) {} for (const g of ['name', 'age', 'score', 'count', 'total', 'i', 'answer', 'items']) out.push(g); return [...new Set(out.filter(n => !RES.has(n)))].slice(0, 8); };
      Blockly.dialog.setPrompt((msg, def, cb) => { const isNew = !def; UI.prompt(isNew ? '🧰 새 변수 만들기' : '✏️ 변수 이름 바꾸기', '예: age, name, score', def || '', { ok: isNew ? '만들기' : '바꾸기', cancel: '취소', chips: suggest(), hint: '변수는 값을 담아 두는 <b>이름표 붙은 상자</b>예요.<br>영어 소문자로 짓고 띄어쓰기 대신 _ 를 쓰세요. (예: <code>my_age</code>)' }).then(v => cb(v === null ? null : v.replace(/\s+/g, '_'))); });
      Blockly.dialog.setConfirm((msg, cb) => { UI.confirm(msg, '확인', '취소').then(cb); });
      Blockly.dialog.setAlert((msg, cb) => { UI.modal({ title: '알림', body: `<p>${esc(msg)}</p>` }).then(() => cb && cb()); });
    } catch (e) { console.info('Blockly dialog override skipped', e); }
    const gen = this.gen(); const Order = (window.python && python.Order) || { ATOMIC: 0, FUNCTION_CALL: 2.2, MEMBER: 2.1, MULTIPLICATIVE: 5, NONE: 99 };
    gen.INDENT = '    ';
    const origInit = gen.init.bind(gen); gen.init = (ws) => { origInit(ws); gen.definitions_['variables'] = ''; };
    // 변수 이름: 파이썬 식별자로 유효하면 그대로 사용 (한글 허용)
    const origGV = gen.getVariableName.bind(gen);
    gen.getVariableName = (nameOrId) => { try { const ws = gen._ws; const v = ws && (ws.getVariableById ? ws.getVariableById(nameOrId) : null); const nm = v ? (v.name || (v.getName && v.getName())) : null; if (nm && /^[^\W\d][\w]*$/u.test(nm) && !RES.has(nm)) return nm; } catch (e) {} return origGV(nameOrId); };
    const origWTC = gen.workspaceToCode.bind(gen); gen.workspaceToCode = (ws) => { gen._ws = ws; return origWTC(ws); };
    Blockly.Msg.VARIABLES_DEFAULT_NAME = 'item'; Blockly.Msg.TEXT_PRINT_TITLE = '출력 %1'; Blockly.Msg.CONTROLS_REPEAT_TITLE = '%1번 반복'; Blockly.Msg.CONTROLS_IF_MSG_IF = '만약'; Blockly.Msg.CONTROLS_IF_MSG_ELSEIF = '아니고 만약'; Blockly.Msg.CONTROLS_IF_MSG_ELSE = '아니면'; Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_WHILE = '~인 동안 반복'; Blockly.Msg.CONTROLS_WHILEUNTIL_OPERATOR_UNTIL = '~일 때까지 반복'; Blockly.Msg.CONTROLS_FOREACH_TITLE = '%2 의 각 항목 %1 에 대해'; Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK = '반복 탈출 (break)'; Blockly.Msg.CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE = '다음 회차로 (continue)'; Blockly.Msg.VARIABLES_SET = '%1 = %2'; Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE = '함수 만들기'; Blockly.Msg.PROCEDURES_DEFRETURN_RETURN = '돌려주기 (return)'; Blockly.Msg.LISTS_CREATE_WITH_INPUT_WITH = '리스트'; Blockly.Msg.LISTS_LENGTH_TITLE = '%1 의 개수 len';
    const def = (json) => Blockly.defineBlocksWithJsonArray([json]);
    const V = (t) => gen.valueToCode(t.b, t.n, Order.NONE) || t.d;
    const F = (name, fn) => { gen.forBlock[name] = fn; };
    def({ type: 'py_print_many', message0: '출력 %1 %2 %3 %4', args0: [{ type: 'input_value', name: 'A' }, { type: 'input_value', name: 'B' }, { type: 'input_value', name: 'C' }, { type: 'input_value', name: 'D' }], inputsInline: true, previousStatement: null, nextStatement: null, colour: 160, tooltip: '여러 값을 띄어쓰기로 이어 한 줄에 출력 (print(a, b, c))' });
    F('py_print_many', (b) => { const vs = ['A', 'B', 'C', 'D'].map(n => gen.valueToCode(b, n, Order.NONE)).filter(x => x); return 'print(' + vs.join(', ') + ')\n'; });
    def({ type: 'py_input', message0: '입력 받기 input()', output: 'String', colour: 160, tooltip: '입력값 칸에서 한 줄을 읽어요 (문자열)' });
    F('py_input', () => ['input()', Order.FUNCTION_CALL]);
    def({ type: 'py_int', message0: '숫자로 int( %1 )', args0: [{ type: 'input_value', name: 'X' }], output: 'Number', colour: 230, tooltip: '글자를 정수로 바꿔요' });
    F('py_int', (b) => ['int(' + (gen.valueToCode(b, 'X', Order.NONE) || '0') + ')', Order.FUNCTION_CALL]);
    def({ type: 'py_float', message0: '소수로 float( %1 )', args0: [{ type: 'input_value', name: 'X' }], output: 'Number', colour: 230 });
    F('py_float', (b) => ['float(' + (gen.valueToCode(b, 'X', Order.NONE) || '0') + ')', Order.FUNCTION_CALL]);
    def({ type: 'py_str', message0: '글자로 str( %1 )', args0: [{ type: 'input_value', name: 'X' }], output: 'String', colour: 160 });
    F('py_str', (b) => ['str(' + (gen.valueToCode(b, 'X', Order.NONE) || "''") + ')', Order.FUNCTION_CALL]);
    def({ type: 'py_floordiv', message0: '%1 ÷ %2 의 몫 //', args0: [{ type: 'input_value', name: 'A', check: 'Number' }, { type: 'input_value', name: 'B', check: 'Number' }], inputsInline: true, output: 'Number', colour: 230 });
    F('py_floordiv', (b) => [(gen.valueToCode(b, 'A', Order.MULTIPLICATIVE) || '0') + ' // ' + (gen.valueToCode(b, 'B', Order.MULTIPLICATIVE) || '1'), Order.MULTIPLICATIVE]);
    def({ type: 'py_change', message0: '%1 += %2', args0: [{ type: 'field_variable', name: 'VAR', variable: 'count' }, { type: 'input_value', name: 'N' }], previousStatement: null, nextStatement: null, colour: 330, tooltip: '변수에 값을 더해 다시 저장 (x += n)' });
    F('py_change', (b) => gen.getVariableName(b.getFieldValue('VAR')) + ' += ' + (gen.valueToCode(b, 'N', Order.NONE) || '1') + '\n');
    def({ type: 'py_for_range', message0: '%1 를 %2 부터 %3 까지 반복 %4 %5', args0: [{ type: 'field_variable', name: 'VAR', variable: 'i' }, { type: 'input_value', name: 'FROM', check: 'Number' }, { type: 'input_value', name: 'TO', check: 'Number' }, { type: 'input_dummy' }, { type: 'input_statement', name: 'DO' }], inputsInline: true, previousStatement: null, nextStatement: null, colour: 120, tooltip: 'for i in range(시작, 끝 + 1): 끝 숫자까지 포함해요' });
    F('py_for_range', (b) => { const v = gen.getVariableName(b.getFieldValue('VAR')); const from = gen.valueToCode(b, 'FROM', Order.NONE) || '0'; const to = gen.valueToCode(b, 'TO', Order.NONE) || '0'; let body = gen.statementToCode(b, 'DO') || gen.PASS; const toExpr = /^-?\d+$/.test(to) ? String(Number(to) + 1) : to + ' + 1'; const rng = (from === '0' && /^\d+$/.test(toExpr)) ? `range(${toExpr})` : `range(${from}, ${toExpr})`; return `for ${v} in ${rng}:\n${body}`; });
    def({ type: 'py_index', message0: '%1 의 %2 번째 (0부터)', args0: [{ type: 'input_value', name: 'L' }, { type: 'input_value', name: 'I' }], inputsInline: true, output: null, colour: 260, tooltip: '리스트[번호]' });
    F('py_index', (b) => [(gen.valueToCode(b, 'L', Order.MEMBER) || '[]') + '[' + (gen.valueToCode(b, 'I', Order.NONE) || '0') + ']', Order.MEMBER]);
    def({ type: 'py_append', message0: '%1 끝에 %2 추가 append', args0: [{ type: 'input_value', name: 'L' }, { type: 'input_value', name: 'V' }], inputsInline: true, previousStatement: null, nextStatement: null, colour: 260 });
    F('py_append', (b) => (gen.valueToCode(b, 'L', Order.MEMBER) || 'items') + '.append(' + (gen.valueToCode(b, 'V', Order.NONE) || 'None') + ')\n');
    def({ type: 'py_pop', message0: '%1 의 마지막 꺼내기 pop', args0: [{ type: 'input_value', name: 'L' }], output: null, colour: 260 });
    F('py_pop', (b) => [(gen.valueToCode(b, 'L', Order.MEMBER) || 'items') + '.pop()', Order.FUNCTION_CALL]);
    def({ type: 'py_fstring', message0: 'f문장 %1 의 {} 자리에 %2', args0: [{ type: 'field_input', name: 'TEXT', text: '값은 {} 이에요' }, { type: 'input_value', name: 'V' }], inputsInline: true, output: 'String', colour: 160, tooltip: 'f"..." 문자열. {} 자리에 값이 들어가요' });
    F('py_fstring', (b) => { const t = b.getFieldValue('TEXT').replace(/"/g, '\\"'); const v = gen.valueToCode(b, 'V', Order.NONE) || "''"; return ['f"' + t.replace('{}', '{' + v + '}') + '"', Order.ATOMIC]; });
    def({ type: 'py_dict_new', message0: '빈 딕셔너리 {}', output: null, colour: 20 });
    F('py_dict_new', () => ['{}', Order.ATOMIC]);
    def({ type: 'py_dict_get', message0: '%1 에서 %2 찾기', args0: [{ type: 'input_value', name: 'D' }, { type: 'input_value', name: 'K' }], inputsInline: true, output: null, colour: 20 });
    F('py_dict_get', (b) => [(gen.valueToCode(b, 'D', Order.MEMBER) || 'd') + '[' + (gen.valueToCode(b, 'K', Order.NONE) || "''") + ']', Order.MEMBER]);
    def({ type: 'py_dict_set', message0: '%1 의 %2 에 %3 넣기', args0: [{ type: 'input_value', name: 'D' }, { type: 'input_value', name: 'K' }, { type: 'input_value', name: 'V' }], inputsInline: true, previousStatement: null, nextStatement: null, colour: 20 });
    F('py_dict_set', (b) => (gen.valueToCode(b, 'D', Order.MEMBER) || 'd') + '[' + (gen.valueToCode(b, 'K', Order.NONE) || "''") + '] = ' + (gen.valueToCode(b, 'V', Order.NONE) || 'None') + '\n');
  },
  CATS: [['출력', 160, ['text_print', 'py_print_many', 'text', 'text_join', 'py_fstring', 'py_input', 'py_str']], ['변수', 330, ['variables_set', 'variables_get', 'py_change']], ['값·계산', 230, ['math_number', 'math_arithmetic', 'math_modulo', 'py_floordiv', 'py_int', 'py_float']], ['조건', 210, ['controls_if', 'logic_compare', 'logic_operation', 'logic_negate', 'logic_boolean']], ['반복', 120, ['py_for_range', 'controls_repeat_ext', 'controls_whileUntil', 'controls_flow_statements', 'controls_forEach']], ['리스트', 260, ['lists_create_with', 'lists_length', 'py_index', 'py_append', 'py_pop', 'py_dict_new', 'py_dict_get', 'py_dict_set']], ['함수', 290, ['procedures_defnoreturn', 'procedures_defreturn', 'procedures_callnoreturn', 'procedures_callreturn', 'procedures_ifreturn']]],
  toolbox(allowed) {
    const shadow = { text_print: { TEXT: { shadow: { type: 'text', fields: { TEXT: '안녕' } } } }, math_arithmetic: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } }, math_modulo: { DIVIDEND: { shadow: { type: 'math_number', fields: { NUM: 7 } } }, DIVISOR: { shadow: { type: 'math_number', fields: { NUM: 2 } } } }, py_floordiv: { A: { shadow: { type: 'math_number', fields: { NUM: 7 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 2 } } } }, logic_compare: { A: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, B: { shadow: { type: 'math_number', fields: { NUM: 1 } } } }, controls_repeat_ext: { TIMES: { shadow: { type: 'math_number', fields: { NUM: 3 } } } }, py_for_range: { FROM: { shadow: { type: 'math_number', fields: { NUM: 1 } } }, TO: { shadow: { type: 'math_number', fields: { NUM: 5 } } } }, py_change: { N: { shadow: { type: 'math_number', fields: { NUM: 1 } } } }, py_index: { I: { shadow: { type: 'math_number', fields: { NUM: 0 } } } }, py_int: { X: { shadow: { type: 'py_input' } } }, variables_set: { VALUE: { shadow: { type: 'math_number', fields: { NUM: 0 } } } } };
    const contents = [];
    const guide = { kind: 'label', text: '👉 블록을 끌어서 흰 바탕에 놓으세요' };
    for (const [name, colour, types] of this.CATS) { const use = types.filter(t => allowed.includes(t)); if (!use.length) continue; const cat = { kind: 'category', name, colour: String(colour) }; if (name === '변수') { cat.custom = 'VARIABLE'; } else if (name === '함수') { cat.custom = 'PROCEDURE'; } else cat.contents = [guide].concat(use.map(t => ({ kind: 'block', type: t, inputs: shadow[t] }))); contents.push(cat); }
    // 카테고리가 하나뿐이면(초반 레슨) 메뉴를 누를 필요 없이 블록이 바로 보이는 플라이아웃 도구상자 사용
    if (contents.length === 1 && contents[0].contents) return { kind: 'flyoutToolbox', contents: contents[0].contents, _single: true };
    return { kind: 'categoryToolbox', contents };
  },
};

class BlockEditor {
  constructor(parent, { allowed, onChange, state }) {
    this.parent = parent; this.onChange = onChange; this.ws = null; this.destroyed = false; parent.classList.add('bed'); parent.innerHTML = `<div class="bed-loading">블록 도구를 불러오는 중…</div>`;
    Blocks.load().then(() => { if (this.destroyed) return; this.build(allowed, state); }).catch(e => { parent.innerHTML = `<div class="bed-loading">블록 도구를 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요.</div>`; });
  }
  build(allowed, state) {
    this.parent.innerHTML = ''; const div = document.createElement('div'); div.className = 'bed-ws'; this.parent.appendChild(div);
    const mobile = UI.isMobile(); const tb = Blocks.toolbox(allowed); const single = !!tb._single; delete tb._single;
    this.parent.classList.toggle('horiz', mobile); this.parent.classList.toggle('single', single);
    this.ws = Blockly.inject(div, { toolbox: tb, horizontalLayout: mobile, toolboxPosition: mobile ? 'end' : 'start', scrollbars: true, trashcan: true, zoom: { controls: true, wheel: true, startScale: mobile ? 0.85 : 1.1, maxScale: 2, minScale: 0.4, pinch: true }, move: { scrollbars: true, drag: true, wheel: false }, renderer: 'zelos', grid: { spacing: 20, length: 2, colour: 'rgba(128,128,128,.15)', snap: true } });
    if (state) { try { Blockly.serialization.workspaces.load(state, this.ws); } catch (e) { console.warn('블록 상태 복원 실패', e); } }
    // 빈 작업판 안내: 블록이 하나도 없을 때만 보임
    const guide = document.createElement('div'); guide.className = 'bed-guide';
    const from = mobile ? '아래' : '왼쪽', arrow = mobile ? '⬇' : '⬅';
    const demo = `<div class="bg-demo" aria-hidden="true"><span class="bg-blk">출력 ❝안녕❞</span><span class="bg-hand">👆</span></div>`;
    guide.innerHTML = single
      ? `<div class="bg-arrow">${arrow}</div><div class="bg-t">${from}에 있는 <b>블록을 손가락(마우스)으로 끌어서</b><br>이 흰 바탕에 놓으세요</div>${demo}<div class="bg-s">꾹 누른 채 끌고 와서 손을 떼면 돼요 · 놓으면 오른쪽에 파이썬 코드가 자동으로 만들어져요</div>`
      : `<div class="bg-arrow">${arrow}</div><div class="bg-t"><b>①</b> ${from} 메뉴(출력·변수…)를 눌러 블록을 꺼내고<br><b>②</b> 블록을 끌어서 이 흰 바탕에 놓으세요</div>${demo}<div class="bg-s">꾹 누른 채 끌고 와서 손을 떼면 돼요 · 놓으면 오른쪽에 파이썬 코드가 자동으로 만들어져요</div>`;
    this.parent.appendChild(guide); this.guide = guide;
    const updGuide = () => { if (!this.ws) return; guide.classList.toggle('hide', this.ws.getAllBlocks(false).length > 0); };
    updGuide();
    // 여러 카테고리일 때 작업판이 비어 있으면 첫 메뉴를 자동으로 열어 블록을 바로 보여줌
    if (!single && !this.ws.getAllBlocks(false).length) { setTimeout(() => { try { const t = this.ws && this.ws.getToolbox(); if (t && t.selectItemByPosition) t.selectItemByPosition(0); } catch (e) {} }, 120); }
    this.ws.addChangeListener((ev) => { if (ev.isUiEvent) { if (ev.type === Blockly.Events.SELECTED && this.onSelect) this.onSelect(ev.newElementId); return; } updGuide(); this.onChange && this.onChange(this.getCode()); });
    setTimeout(() => this.resize(), 50); this._rs = () => this.resize(); addEventListener('resize', this._rs);
    this.onChange && this.onChange(this.getCode());
  }
  resize() { if (this.ws) Blockly.svgResize(this.ws); }
  getCode() { if (!this.ws) return ''; try { let code = Blocks.gen().workspaceToCode(this.ws); return code.replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '').replace(/\s+$/, ''); } catch (e) { return '# ' + e.message; } }
  getState() { return this.ws ? Blockly.serialization.workspaces.save(this.ws) : null; }
  blockLines(blockId) { // 블록 → 코드 줄 번호들
    if (!this.ws || !blockId) return []; const b = this.ws.getBlockById(blockId); if (!b) return []; const gen = Blocks.gen(); let top = b; while (top.outputConnection && top.getParent()) top = top.getParent();
    try { gen.init(this.ws); let c = gen.blockToCode(top, true); if (Array.isArray(c)) c = c[0]; gen.isInitialized = false; const full = this.getCode().split('\n'); const first = (c || '').split('\n').filter(x => x.trim())[0]; if (!first) return []; const n = (c || '').split('\n').filter(x => x.trim()).length; const idx = full.findIndex(l => l.trim() === first.trim()); if (idx < 0) return []; return Array.from({ length: n }, (_, i) => idx + i + 1); } catch (e) { return []; }
  }
  blockForLine(line) { if (!this.ws) return null; const text = (this.getCode().split('\n')[line - 1] || '').trim(); if (!text) return null; for (const b of this.ws.getAllBlocks(false)) { if (b.outputConnection) continue; const ls = this.blockLines(b.id); if (ls.includes(line)) return b.id; } return null; }
  highlight(id) { if (this.ws) try { this.ws.highlightBlock(id); } catch (e) {} }
  destroy() { this.destroyed = true; removeEventListener('resize', this._rs); if (this.ws) try { this.ws.dispose(); } catch (e) {} this.parent.innerHTML = ''; }
}

// ---------- Parsons 에디터 ----------
class ParsonsEditor {
  constructor(parent, { problem, state }) {
    this.parent = parent; this.p = problem; parent.classList.add('parsons'); const lines = Grader.parsonsLines(problem.parsons.solution).map(l => l.text); const extra = (problem.parsons.distractors || []).map(s => s.trim());
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
