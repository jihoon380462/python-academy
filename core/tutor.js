// core/tutor.js — AI 선생님(Claude API 호출 + 패널 UI)
// ---------- 선생님 (Claude API) ----------
const Tutor = {
  async call({ system, messages, onText, maxTokens }) {
    const key = Store.data.settings.apiKey; if (!key) throw new Error('NOKEY');
    let res;
    try {
      res = await fetch(CONFIG.TUTOR.url, { method: 'POST', headers: { 'x-api-key': key, 'anthropic-version': CONFIG.TUTOR.version, 'anthropic-dangerous-direct-browser-access': 'true', 'content-type': 'application/json' },
        body: JSON.stringify({ model: Store.data.settings.model || CONFIG.TUTOR.defaultModel, max_tokens: maxTokens || CONFIG.TUTOR.maxTokens, system, messages, stream: true }) });
    } catch (e) { throw new Error('NET'); }
    if (res.status === 401 || res.status === 403) throw new Error('AUTH'); if (res.status === 429) throw new Error('RATE'); if (!res.ok) { let m = ''; try { m = (await res.json()).error?.message || ''; } catch (e) {} throw new Error('HTTP ' + res.status + (m ? ': ' + m : '')); }
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '', full = '';
    while (true) { const { done, value } = await reader.read(); if (done) break; buf += dec.decode(value, { stream: true }); const lines = buf.split('\n'); buf = lines.pop();
      for (const line of lines) { if (!line.startsWith('data:')) continue; const js = line.slice(5).trim(); if (!js || js === '[DONE]') continue; try { const ev = JSON.parse(js); if (ev.type === 'content_block_delta' && ev.delta && ev.delta.text) { full += ev.delta.text; if (onText) onText(ev.delta.text, full); } if (ev.type === 'error') throw new Error(ev.error?.message || 'API error'); } catch (e) { if (e.message && e.message !== 'Unexpected token') { /* ignore parse */ } } } }
    return full;
  },
  errMsg(e) { const m = e && e.message || ''; if (m === 'NOKEY') return T.noKey; if (m === 'AUTH') return T.keyBad; if (m === 'RATE') return T.rateLimit; if (m === 'NET') return T.netErr; return '오류: ' + m; },
  async test() { return this.call({ system: '한 단어로만 답해.', messages: [{ role: 'user', content: '안녕' }], maxTokens: 20 }); },
  context({ lesson, problem, code, lastRun, hints, answerSeen, trace, pageHtml }) {
    const parts = [];
    if (lesson) parts.push(`[현재 레슨] ${lesson.title}\n[핵심 개념] ${lesson.tutorSummary || ''}`);
    if (pageHtml) parts.push(`[설명 내용]\n${pageHtml.replace(/<[^>]+>/g, '').slice(0, 1500)}`);
    if (problem) parts.push(`[문제] ${problem.title}\n${problem.prompt.replace(/<[^>]+>/g, '')}`);
    if (code != null) parts.push(`[사용자의 현재 코드]\n${code}`);
    if (lastRun) parts.push(`[마지막 실행 결과]\n${lastRun}`);
    if (hints != null) parts.push(`[사용한 힌트 단계] ${hints}/3`);
    if (answerSeen) parts.push(`[사용자는 이 문제의 "정답 보기"를 이미 열었음 → 전체 코드 설명 허용]`);
    if (trace) parts.push(`[한 줄씩 보기 현재 단계] ${trace}`);
    return parts.join('\n\n');
  },
};


// ---------- 선생님 패널 ----------
Tutor.ui = {
  ctx: null, el: null, busy: false,
  init() { this.el = $('#tutorPanel'); },
  open(ctx) {
    this.ctx = ctx; const el = this.el; el.classList.add('open'); const key = ctx.key || 'global'; const chats = Store.data.tutorChats; chats[key] = chats[key] || [];
    const extra = ctx.free && !ctx.preset ? '' : ctx.review ? `<button class="chip-btn" data-x="review">📝 내 코드 리뷰</button>` : ctx.problem ? `<button class="chip-btn" data-x="similar">🎲 비슷한 문제 하나 더</button>${ctx.cleared ? `<button class="chip-btn" data-x="review">📝 내 코드 리뷰</button>` : ''}` : ctx.lesson ? `<button class="chip-btn" data-x="analogy">🔁 이 개념 다른 비유로</button>` : '';
    el.innerHTML = `<div class="tp-head"><span>💬 클로드 선생님</span><div><button class="btn xs" id="tpClear">대화 지우기</button><button class="btn xs" id="tpClose">✕</button></div></div><div class="tp-chips">${(ctx.free ? [] : T.chips).map(c => `<button class="chip-btn" data-q="${esc(c)}">${esc(c)}</button>`).join('')}${extra}</div>${Store.data.settings.apiKey ? '' : `<div class="tp-nokey"><b>🔑 선생님을 쓰려면 API 키가 필요해요</b><div class="small muted">클로드 API 키를 한 번만 넣으면 막힐 때 질문하고 코드 리뷰를 받을 수 있어요. 키 없이도 💡 힌트와 🔓 정답 보기는 돼요.</div><button class="btn primary sm" id="tpGoSettings">⚙ 설정에서 키 넣기</button></div>`}<div class="tp-log" id="tpLog"></div><div class="tp-in"><textarea id="tpText" rows="2" placeholder="${Store.data.settings.apiKey ? '질문을 적어 보세요' : T.noKey}"></textarea><button class="btn primary" id="tpSend">보내기</button></div><div class="tp-foot muted small">이번 세션 질문 <span id="tpCount">${this.count || 0}</span>회 · 모델 ${esc(Store.data.settings.model)}${Store.data.settings.apiKey ? '' : ` · <a id="tpSettings">설정에서 키 넣기</a>`}</div>`;
    $('#tpClose').onclick = () => this.close(); $('#tpClear').onclick = () => { chats[key] = []; Store.save(); this.renderLog(); }; $('#tpSend').onclick = () => this.send($('#tpText').value); $('#tpText').onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send($('#tpText').value); } }; const ts = $('#tpSettings'); if (ts) ts.onclick = () => { this.close(); UI.go('settings'); }; const tg = $('#tpGoSettings'); if (tg) tg.onclick = () => { this.close(); UI.go('settings'); setTimeout(() => { const k = $('#sKey'); if (k) { k.scrollIntoView({ block: 'center' }); k.focus(); } }, 150); };
    $$('[data-q]', el).forEach(b => b.onclick = () => this.send(b.dataset.q)); $$('[data-x]', el).forEach(b => b.onclick = () => this.special(b.dataset.x));
    this.renderLog(); if (ctx.preset) this.send(ctx.preset);
  },
  close() { if (this.el) this.el.classList.remove('open'); },
  log() { const key = this.ctx ? (this.ctx.key || 'global') : 'global'; return Store.data.tutorChats[key] = Store.data.tutorChats[key] || []; },
  renderLog() { const log = $('#tpLog'); if (!log) return; log.innerHTML = this.log().map(m => `<div class="msg ${m.role}">${m.role === 'assistant' ? this.md(m.content) : esc(m.content)}</div>`).join('') || `<div class="muted small">무엇이든 물어보세요. 정답을 바로 주진 않지만 길을 알려 줘요. 질문은 별점·XP에 영향이 없어요.</div>`; log.scrollTop = log.scrollHeight; },
  md(s) { return esc(s).replace(/```(?:python)?\n?([\s\S]*?)```/g, (m, c) => `<pre class="code">${c}</pre>`).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); },
  systemPrompt() { const c = this.ctx; const sys = c.free ? T.tutorSystemFree : T.tutorSystem; const ctxText = Tutor.context({ lesson: c.lesson, problem: c.problem, code: c.getCode ? c.getCode() : null, lastRun: c.getLastRun ? c.getLastRun() : null, hints: c.hints, answerSeen: c.answerSeen, trace: TracePanel.cur ? `${TracePanel.cur.line}번 줄, 변수: ${JSON.stringify(TracePanel.cur.vars)}` : null, pageHtml: c.pageHtml }); const persona = typeof COURSE !== 'undefined' && COURSE.tutorPersona ? '\n\n[이 코스의 선생님 지침]\n' + COURSE.tutorPersona : ''; return sys + persona + '\n\n[맥락]\n' + ctxText; },
  async send(text, { hidden = false, system = null, onDone = null } = {}) {
    text = (text || '').trim(); if (!text || this.busy) return; if (!Store.data.settings.apiKey) { UI.toast(T.noKey); return; }
    const log = this.log(); if (!hidden) log.push({ role: 'user', content: text }); const ta = $('#tpText'); if (ta) ta.value = ''; this.busy = true; this.count = (this.count || 0) + 1; const cnt = $('#tpCount'); if (cnt) cnt.textContent = this.count; Game.stat('tutorAsks');
    const msgs = (hidden ? log.concat([{ role: 'user', content: text }]) : log).slice(-12).map(m => ({ role: m.role, content: m.content })); const entry = { role: 'assistant', content: '' }; log.push(entry); this.renderLog(); const logEl = $('#tpLog');
    try { const full = await Tutor.call({ system: system || this.systemPrompt(), messages: msgs, onText: (t, f) => { entry.content = f; const last = logEl && logEl.lastElementChild; if (last) { last.innerHTML = this.md(f); logEl.scrollTop = logEl.scrollHeight; } } }); entry.content = full; if (onDone) onDone(full); }
    catch (e) { entry.content = '⚠ ' + Tutor.errMsg(e); }
    this.busy = false; Store.save(); this.renderLog();
  },
  async special(kind) {
    const c = this.ctx;
    if (kind === 'analogy') return this.send('지금 설명하는 개념을 방금과는 다른 비유로 다시 설명해 주세요.');
    if (kind === 'review') { return this.send('방금 통과한 제 코드를 리뷰해 주세요. 더 파이썬다운 쓰기, 변수 이름, 불필요한 줄을 3가지 이내로만 짚어 주세요.', { onDone: () => { if (c.onPolished) { UI.toast('리뷰를 받았어요. 코드를 고쳐 다시 통과시키면 다듬기 XP!'); Store.prob(c.problem.id).reviewed = true; Store.save(); } } }); }
    if (kind === 'similar') {
      const p = c.problem; const schema = `{"title":"...","prompt":"...(HTML 없이)","starter":"...","solution":"...","tests":[{"input":"...","output":"..."},{"input":"...","output":"..."},{"input":"...","output":"..."}],"hints":["방향","구체","거의 정답"]}`;
      const ask = async () => { let json = ''; await this.send(`현재 문제와 같은 개념(${p.tags.join(', ')})을 연습하는 새 문제를 하나 만들어 주세요. 반드시 아래 JSON 형식만 출력하고 다른 말은 쓰지 마세요. tests는 3개, 각 output은 solution을 그 input으로 실행했을 때의 정확한 표준 출력이어야 해요. 코드는 지금 레슨 범위 안의 문법만 쓰세요.\n${schema}`, { hidden: true, onDone: (f) => { json = f; } }); const m = json.match(/\{[\s\S]*\}/); if (!m) throw new Error('형식 오류'); return JSON.parse(m[0]); };
      const verify = async (q) => { for (const t of q.tests) { let out = ''; const r = await Py.run({ code: q.solution, input: t.input || '', onOut: (x, e) => { if (!e) out += x; } }); if (!r.ok || Grader.norm(out) !== Grader.norm(t.output)) return false; } return true; };
      try { let q = await ask(); let ok = await verify(q); if (!ok) { q = await ask(); ok = await verify(q); } if (!ok) { this.log().push({ role: 'assistant', content: '지금은 만들 수 없어요. 잠시 후 다시 시도해 주세요.' }); this.renderLog(); return; }
        const np = { id: 'MY_' + uid(), lesson: p.lesson, type: 'code', title: '🎲 ' + q.title, prompt: esc(q.prompt).replace(/\n/g, '<br>'), tags: p.tags, hints: q.hints && q.hints.length >= 3 ? q.hints : ['문제를 다시 읽어 보세요', '원래 문제의 풀이를 떠올리세요', q.solution.split('\n')[0]], starter: q.starter || '', solution: q.solution, tests: q.tests, myProblem: true };
        Store.data.myProblems.push(np); Content.problemMap[np.id] = np; Content.byLesson[np.lesson] = Content.byLesson[np.lesson] || []; Content.byLesson[np.lesson].push(np); PROBLEMS.push(np); Store.save();
        this.log().push({ role: 'assistant', content: `새 문제 "${q.title}"를 만들었어요! 내 문제집에 저장했고, 복습 큐에도 들어가요.` }); this.renderLog(); UI.toast('🎲 새 문제가 준비됐어요'); setTimeout(() => { this.close(); if (c.onNewProblem) c.onNewProblem(np); }, 800);
      } catch (e) { this.log().push({ role: 'assistant', content: '지금은 만들 수 없어요. (' + (e.message || '') + ')' }); this.renderLog(); }
    }
  },
};
