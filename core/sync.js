// =====================================================================
// === SYNC ===  기기 연동 (PC ↔ 모바일). GitHub Gist(비공개)에 진행 데이터를 저장해 여러 기기에서 이어서 한다.
//   - 토큰(classic, gist 권한)만 있으면 됨. 두 번째 기기는 "연동 코드"(토큰+gist id) 붙여넣기 한 번으로 끝.
//   - 저장할 때마다(디바운스 3초) 올리고, 앱 시작·화면 복귀 때 내려받아 합친다. 클로드 API 키는 동기화하지 않는다.
// =====================================================================
const Sync = {
  KEY: 'academy.sync', FILE: 'python_academy_save.json', DESC: '파이썬 아카데미 진행 데이터 (자동 동기화 · 지우지 마세요)',
  API: 'https://api.github.com', TOKEN_URL: 'https://github.com/settings/tokens/new?scopes=gist&description=python-academy-sync',
  DEBOUNCE_MS: 3000, CODE_PREFIX: 'PA-SYNC:', FORMAT: 'academy-sync-2',
  cfg: null, timer: null, state: 'off', msg: '', busy: false, pending: false, hook: null,
  get on() { return !!(this.cfg && this.cfg.token && this.cfg.gistId); },
  load() { try { this.cfg = JSON.parse(localStorage.getItem(this.KEY) || 'null'); } catch (e) { this.cfg = null; } this.state = this.on ? 'idle' : 'off'; },
  saveCfg() { try { if (this.cfg) localStorage.setItem(this.KEY, JSON.stringify(this.cfg)); else localStorage.removeItem(this.KEY); } catch (e) {} },
  set(state, msg = '') { this.state = state; this.msg = msg; try { if (this.hook) this.hook(); } catch (e) {} if (UI.view && UI.view !== 'settings' && UI.renderTopbar) UI.renderTopbar(); },
  statusText() { return { syncing: '🔄 동기화 중…', ok: '✅ 연동됨 · 마지막 동기화 ' + this.ago(), err: '⚠ ' + this.msg, dirty: '✏ 변경됨 · 곧 올려요', idle: '☁ 연동됨 · 마지막 동기화 ' + this.ago() }[this.state] || ''; },

  // ----- GitHub API -----
  async api(method, path, body, token) {
    let res;
    try { res = await fetch(this.API + path, { method, headers: { Authorization: 'Bearer ' + (token || this.cfg.token), Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', ...(body ? { 'Content-Type': 'application/json' } : {}) }, body: body ? JSON.stringify(body) : undefined }); }
    catch (e) { throw new Error('NET'); }
    if (res.status === 401) throw new Error('AUTH');
    if (res.status === 404 || res.status === 403) { const have = res.headers.get('x-oauth-scopes'); const tk = token || this.cfg.token; if (/^github_pat_/.test(tk)) throw new Error('FINE'); if (have != null && !/\bgist\b/.test(have)) throw new Error('SCOPE'); if (res.status === 403) throw new Error('RATE'); throw new Error('NOTFOUND'); }
    if (res.status === 429) throw new Error('RATE');
    if (!res.ok) { let m = ''; try { m = (await res.json()).message || ''; } catch (e) {} throw new Error('HTTP ' + res.status + (m ? ': ' + m : '')); }
    if (res.status === 204) return null; return res.json();
  },
  errMsg(e) { const m = e && e.message || ''; return { NET: '인터넷 연결을 확인해 주세요', AUTH: '토큰이 틀렸거나 만료됐어요', SCOPE: '토큰에 gist 권한이 없어요 (토큰 만들 때 gist 체크)', FINE: 'Fine-grained 토큰은 gist를 지원하지 않아요. Tokens (classic)으로 만들어 주세요', NOTFOUND: '저장소(gist)를 찾을 수 없어요. 연동을 해제하고 다시 연결해 주세요', RATE: 'GitHub 요청 한도예요. 잠시 후 다시 시도해 주세요' }[m] || ('오류: ' + m); },

  // ----- 데이터 -----
  // QA #67: 예전에는 지금 열린 코스 하나의 Store.data 를 올려서, 다른 코스 페이지가 받으면 그 코스 기록에 섞였다.
  //   형식 2 = 모든 코스 묶음 { format, updatedAt, profile, courses:{id:조각}, tutor:{id:대화}, works }. 옛 형식(problems 가 맨 위)도 받아서 id 로 코스를 나눠 합친다.
  bundle() { try { Store.split(); } catch (e) {} const courses = {}, tutor = {}; Store.keysWithPrefix('academy.course.').forEach(c => courses[c] = Store._get(Store.KEYS.course(c)) || {}); Store.keysWithPrefix('academy.tutor.').forEach(c => tutor[c] = Store._get(Store.KEYS.tutor(c)) || {}); const profile = Store._get(Store.KEYS.profile) || {}; return { format: this.FORMAT, updatedAt: profile.updatedAt || 0, profile, courses, tutor, works: Store._get(Store.KEYS.works) || [] }; },
  payload() { const b = JSON.parse(JSON.stringify(this.bundle())); if (b.profile.settings) delete b.profile.settings.apiKey; b.syncDevice = this.deviceName(); return b; },
  fromLegacy(r) { // 옛 형식(Store.data 한 덩어리) → 묶음. 문제·레슨·선생님 대화는 id 로 코스를 나누고, 나머지 코스 칸(체크업 등)은 파이썬으로
    const F = Store.COURSE_FIELDS; const profile = {}; const courses = {}; const tutor = {}; const put = (c, f, k, v) => { const o = courses[c] || (courses[c] = {}); (o[f] || (o[f] = {}))[k] = v; };
    for (const [k, v] of Object.entries(r)) { if (k === 'works' || k === 'tutorChats' || k === 'syncDevice') continue; if (!F.includes(k)) { profile[k] = v; continue; } if ((k === 'problems' || k === 'lessons') && v && typeof v === 'object') { for (const [id, rec] of Object.entries(v)) put(Store.courseOfId(id) || 'python', k, id, rec); } else (courses.python || (courses.python = {}))[k] = v; }
    for (const [id, chat] of Object.entries(r.tutorChats || {})) { const c = Store.courseOfId(id) || 'python'; (tutor[c] || (tutor[c] = {}))[id] = chat; }
    return { format: this.FORMAT, updatedAt: r.updatedAt || 0, profile, courses, tutor, works: r.works || [] };
  },
  deviceName() { const ua = navigator.userAgent; return /Android/i.test(ua) ? '안드로이드' : /iPhone|iPad/i.test(ua) ? '아이폰/아이패드' : /Windows/i.test(ua) ? 'Windows PC' : /Mac/i.test(ua) ? 'Mac' : '다른 기기'; },
  makeCode() { return this.CODE_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify({ t: this.cfg.token, g: this.cfg.gistId })))); },
  parseInput(text) { text = (text || '').trim(); if (text.startsWith(this.CODE_PREFIX)) { try { const o = JSON.parse(decodeURIComponent(escape(atob(text.slice(this.CODE_PREFIX.length))))); if (o.t && o.g) return { token: o.t, gistId: o.g }; } catch (e) {} throw new Error('연동 코드 형식이 맞지 않아요'); } if (/^(ghp_|github_pat_|gho_)/.test(text) || text.length >= 30) return { token: text }; throw new Error('토큰 또는 연동 코드를 붙여넣어 주세요'); },

  // 두 기기의 데이터 합치기. 둘 다 바뀐 경우 필드별로 합친다(진행은 많은 쪽, 설정은 최근 쪽).
  merge(local, remote) {
    const lt = local.updatedAt || 0, rt = remote.updatedAt || 0;
    if ((local.resetAt || 0) > rt) return local; if ((remote.resetAt || 0) > lt) return remote; // 한쪽에서 "전체 초기화"했으면 그쪽을 따른다
    const newerR = rt >= lt;
    const RANK = { none: 0, try: 1, clear: 2 };
    const mv = (a, b, path) => {
      if (a === undefined || a === null) return b; if (b === undefined || b === null) return a;
      const key = path[path.length - 1];
      if (Array.isArray(a) && Array.isArray(b)) { const seen = new Set(); const out = []; for (const x of (newerR ? [...b, ...a] : [...a, ...b])) { const k = x && typeof x === 'object' && x.id != null ? 'id:' + x.id : JSON.stringify(x); if (!seen.has(k)) { seen.add(k); out.push(x); } } return out; }
      if (typeof a === 'object' && typeof b === 'object') { const out = {}; for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) out[k] = mv(a[k], b[k], [...path, k]); return out; }
      if (typeof a === 'number' && typeof b === 'number') { if (path[0] === 'bestTimes') return Math.min(a, b); if (['updatedAt', 'resetAt', 'date', 'last', 'cur', 'dailyGoal', 'mascotColor', 'page', 'amount', 'count'].includes(key) || path[0] === 'settings') return newerR ? b : a; return Math.max(a, b); }
      if (typeof a === 'boolean' && typeof b === 'boolean') return path[0] === 'settings' ? (newerR ? b : a) : (a || b);
      if (key === 'status' && RANK[a] != null && RANK[b] != null) return RANK[b] > RANK[a] ? b : RANK[a] > RANK[b] ? a : (newerR ? b : a);
      if (typeof a === 'string' && typeof b === 'string' && (a === '' || b === '')) return a || b; // 빈 값보다 채워진 값
      return newerR ? b : a;
    };
    const out = mv(local, remote, []); out.updatedAt = Math.max(lt, rt); return out;
  },
  apply(remote) { // 내려받은 데이터를 로컬에 반영 (API 키는 로컬 것 유지). 코스별로 따로 합친다(QA #67)
    const apiKey = Store.data.settings.apiKey; const strip = (d) => { const o = Object.assign({}, d); delete o.updatedAt; delete o.syncDevice; delete o.last; return JSON.stringify(o); };
    const before = strip(Store.data); const sigBefore = this.progressSig(); const L = this.bundle(); const R = remote && remote.format === this.FORMAT ? remote : this.fromLegacy(remote || {});
    const fresh = !this.cfg.lastSyncAt && !(L.profile.xp) && !Object.values(L.courses).some(c => Object.keys(c.problems || {}).length) && !(L.works || []).length; // 이 기기는 처음 연동 + 아직 아무것도 안 함 → 다른 기기 것을 통째로
    const lt = L.updatedAt || 0, rt = R.updatedAt || 0, lr = L.profile.resetAt || 0, rr = (R.profile || {}).resetAt || 0;
    const mergeObj = (a, b) => { if (fresh) return b != null ? JSON.parse(JSON.stringify(b)) : a; if (a == null) return b; if (b == null) return a; const o = this.merge(Object.assign({}, a, { updatedAt: lt, resetAt: lr }), Object.assign({}, b, { updatedAt: rt, resetAt: rr })); if (!('resetAt' in a) && !('resetAt' in b)) delete o.resetAt; return o; };
    const prof = mergeObj(L.profile, R.profile); prof.updatedAt = Math.max(lt, rt); if (prof.settings) prof.settings.apiKey = apiKey; Store._set(Store.KEYS.profile, prof);
    for (const c of new Set([...Object.keys(L.courses), ...Object.keys(R.courses || {})])) { const o = mergeObj(L.courses[c], (R.courses || {})[c]); if (o) { delete o.updatedAt; delete o.resetAt; Store._set(Store.KEYS.course(c), o); } }
    for (const c of new Set([...Object.keys(L.tutor), ...Object.keys(R.tutor || {})])) { const o = mergeObj(L.tutor[c], (R.tutor || {})[c]); if (o) { delete o.updatedAt; delete o.resetAt; Store._set(Store.KEYS.tutor(c), o); } }
    const w = fresh ? (R.works || L.works) : this.merge({ works: L.works || [], updatedAt: lt }, { works: R.works || [], updatedAt: rt }).works; Store._set(Store.KEYS.works, w || []);
    try { Store.untangle(); } catch (e) {} // 옛 형식이 섞어 둔 것까지 정리
    const d = Store.assemble(); Store.data = Object.assign(Store.blank(), d); Store.data.settings = Object.assign(Store.blank().settings, d.settings || {}); Store.data.settings.apiKey = apiKey; Store.migrate(); Store.save({ silent: true });
    this.lastPullProgress = this.progressSig() !== sigBefore; /* 사용자 요청(11/5): 토스트는 진행이 실제로 들어왔을 때만 */
    return strip(Store.data) !== before;
  },
  // 다른 기기에서 「진행」이 들어왔는지 보는 서명 — 클리어 수·별 합·XP·작품 수 (설정·키 순서·메타가 바뀐 건 세지 않음)
  progressSig() { try { let clears = 0, stars = 0; Store.keysWithPrefix('academy.course.').forEach(c => { const o = Store._get(Store.KEYS.course(c)) || {}; for (const id in (o.problems || {})) { const r = o.problems[id]; if (r && r.status === 'clear') { clears++; stars += r.stars || 0; } } }); const prof = Store._get(Store.KEYS.profile) || {}; const w = Store._get(Store.KEYS.works); return `${clears}|${stars}|${prof.xp || 0}|${Array.isArray(w) ? w.length : 0}`; } catch (e) { return ''; } },

  // ----- 연결 -----
  async connect(text) {
    const { token, gistId } = this.parseInput(text); this.set('syncing', '연결 중…');
    let id = gistId;
    if (!id) { const list = await this.api('GET', '/gists?per_page=100', null, token); const g = list.find(x => x.files && x.files[this.FILE]); id = g ? g.id : (await this.api('POST', '/gists', { description: this.DESC, public: false, files: { [this.FILE]: { content: JSON.stringify(this.payload()) } } }, token)).id; }
    else { await this.api('GET', '/gists/' + id, null, token); }
    this.cfg = { token, gistId: id, lastSyncAt: 0, lastRemoteUpdated: 0, lastLocalUpdated: 0 }; this.saveCfg(); this.state = 'idle';
    await this.syncNow(true); return id;
  },
  disconnect() { clearTimeout(this.timer); this.cfg = null; this.saveCfg(); this.set('off'); },

  // ----- 동기화 -----
  async pull() {
    const g = await this.api('GET', '/gists/' + this.cfg.gistId); const f = g.files && g.files[this.FILE]; if (!f) throw new Error('NOTFOUND');
    let text = f.content; if (f.truncated) { const r = await fetch(f.raw_url); text = await r.text(); }
    let remote; try { remote = JSON.parse(text); } catch (e) { return false; } if (!remote || typeof remote !== 'object' || !(remote.format === this.FORMAT || 'problems' in remote)) return false;
    if ((remote.updatedAt || 0) === this.cfg.lastRemoteUpdated && (Store.data.updatedAt || 0) <= this.cfg.lastLocalUpdated) return false; // 양쪽 다 그대로
    const changed = this.apply(remote); this.cfg.lastRemoteUpdated = remote.updatedAt || 0; this.saveCfg(); return changed;
  },
  async push() {
    const data = this.payload(); await this.api('PATCH', '/gists/' + this.cfg.gistId, { files: { [this.FILE]: { content: JSON.stringify(data) } } });
    this.cfg.lastRemoteUpdated = data.updatedAt || 0; this.cfg.lastLocalUpdated = data.updatedAt || 0; this.cfg.lastSyncAt = Date.now(); this.saveCfg();
  },
  async syncNow(force = false) { // 내려받아 합치고, 로컬이 바뀌었으면 올린다
    if (!this.on) return false; if (this.busy) { this.pending = true; return false; } this.busy = true; clearTimeout(this.timer);
    try {
      this.set('syncing'); const changed = await this.pull();
      if (force || (Store.data.updatedAt || 0) > this.cfg.lastLocalUpdated || changed) await this.push();
      this.cfg.lastSyncAt = Date.now(); this.saveCfg(); this.set('ok');
      if (changed) { if (!this._quiet && this.lastPullProgress && this.toastOk()) UI.toast('☁ 다른 기기의 진행 상황을 가져왔어요', 1500); if (UI.view && !['problem', 'lesson'].includes(UI.view)) UI.go(UI.view, UI.params, false); else UI.renderTopbar(); }
      return changed;
    } catch (e) { this.set('err', this.errMsg(e)); console.warn('sync', e); return false; }
    finally { this.busy = false; if (this.pending) { this.pending = false; this.schedulePush(); } }
  },
  // 사용자 요청(11/5: 팝업은 적당히): 진행이 실제로 들어온 때만, 한 기기에서 10분에 한 번만
  toastOk() { const KEY = 'pa_sync_toast_at'; let last = 0; try { last = +localStorage.getItem(KEY) || 0; } catch (e) {} if (Date.now() - last < 10 * 60 * 1000) return false; try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} return true; },
  async quietSync() { this._quiet = true; try { return await this.syncNow(); } finally { this._quiet = false; } }, // 복귀·온라인 복구 때는 토스트 없이
  schedulePush() { if (!this.on) return; clearTimeout(this.timer); this.state = 'dirty'; this.timer = setTimeout(() => this.syncNow(), this.DEBOUNCE_MS); },
  flush() { if (!this.on || this.state !== 'dirty') return; clearTimeout(this.timer); this.syncNow(); },
  ago() { const t = this.cfg && this.cfg.lastSyncAt; if (!t) return '아직 안 함'; const s = Math.round((Date.now() - t) / 1000); return s < 60 ? '방금' : s < 3600 ? Math.round(s / 60) + '분 전' : s < 86400 ? Math.round(s / 3600) + '시간 전' : Math.round(s / 86400) + '일 전'; },
  icon() { return { off: '', idle: '☁', dirty: '☁', syncing: '🔄', ok: '☁', err: '⚠' }[this.state] || '☁'; },
  init() {
    this.load(); if (!this.on) return;
    this.syncNow();
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') this.quietSync(); else this.flush(); });
    window.addEventListener('pagehide', () => this.flush()); window.addEventListener('online', () => this.quietSync());
  },
  // 설정 화면 카드
  card() {
    const on = this.on; const st = this.statusText();
    return `<div class="card sync"><div class="card-h">📱 기기 연동 (PC ↔ 모바일)</div>
      ${on ? `<div id="syncSt" class="small">${st}</div><div class="muted small" style="margin:6px 0 8px">읽은 레슨·설정이 자동으로 맞춰져요. 레슨을 끝까지 읽으면 잠시 뒤 올라가고, 다른 기기에서는 페이지를 열 때 받아와요.</div>
        <div class="row"><button class="btn primary" id="syncNow">🔄 지금 동기화</button><button class="btn" id="syncCode">📋 연동 코드 복사</button><button class="btn" id="syncOff">연동 해제</button></div>
        <div class="muted small" style="margin-top:8px">다른 기기에서: 이 사이트 열기 → ⚙ 설정 → 이 칸에 <b>연동 코드 붙여넣기 → 연동하기</b>. 끝!</div>`
      : `<div class="muted small" style="margin-bottom:8px">PC에서 읽던 곳을 폰에서 이어서 읽을 수 있어요. 내 GitHub 계정의 <b>비공개 gist</b>에 저장되고, 다른 사람은 못 봐요.</div>
        <div class="muted small" style="margin-bottom:8px"><b>처음 한 번(PC):</b> ① <a href="${this.TOKEN_URL}" target="_blank" rel="noopener">이 링크</a>를 열어 GitHub 로그인 → ② Expiration을 <b>No expiration</b>으로 → ③ 맨 아래 <b>Generate token</b> → ④ 나온 <code>ghp_…</code>를 아래 칸에 붙여넣고 연동하기 (gist 권한은 링크에 미리 체크돼 있어요)<br><b>두 번째 기기(폰):</b> PC 설정에서 복사한 <b>연동 코드</b>를 아래 칸에 붙여넣고 연동하기</div>
        <div class="row"><input class="input" type="password" id="syncIn" placeholder="ghp_… 토큰 또는 PA-SYNC:… 연동 코드" autocomplete="off" style="flex:1;min-width:200px"><button class="btn primary" id="syncGo">연동하기</button></div><div id="syncSt" class="small" style="margin-top:6px"></div>`}
    </div>`;
  },
  bind(root, rerender) {
    const stEl = $('#syncSt', root);
    const go = $('#syncGo', root); if (go) go.onclick = async () => { const v = $('#syncIn', root).value; go.disabled = true; stEl.textContent = '🔄 연결 중…'; try { await this.connect(v); UI.toast('☁ 연동 완료!'); rerender(); await this.showCode('연동 완료! 폰에서도 이어서 하려면'); } catch (e) { stEl.textContent = '❌ ' + (e.message && /^(AUTH|NET|SCOPE|FINE|NOTFOUND|RATE|HTTP)/.test(e.message) ? this.errMsg(e) : e.message); this.set('off'); go.disabled = false; } };
    const now = $('#syncNow', root); if (now) now.onclick = async () => { await this.syncNow(true); rerender(); };
    const code = $('#syncCode', root); if (code) code.onclick = () => this.showCode('연동 코드');
    const off = $('#syncOff', root); if (off) off.onclick = async () => { if (!await UI.confirm('이 기기의 연동을 해제할까요? (저장된 진행 데이터는 그대로예요. gist도 남아 있어서 다시 연결하면 이어져요)', '해제')) return; this.disconnect(); rerender(); };
    this.hook = () => { if (!document.body.contains(root)) { this.hook = null; return; } const el = $('#syncSt', root); if (el && this.on) el.textContent = this.statusText(); };
  },
  async showCode(title) {
    const code = this.makeCode(); let copied = false; try { await navigator.clipboard.writeText(code); copied = true; } catch (e) {}
    await UI.modal({ title: '📋 ' + title, wide: true, body: `<p>${copied ? '연동 코드를 <b>복사했어요</b>.' : '아래 코드를 길게 눌러 <b>전체 선택 → 복사</b>하세요.'} 다른 기기(폰)에서 이 사이트를 열고 <b>⚙ 설정 → 📱 기기 연동</b> 칸에 붙여넣은 뒤 <b>연동하기</b>를 누르면 끝이에요.</p><textarea class="input" readonly style="width:100%;height:90px;font-family:var(--mono);font-size:.8em;word-break:break-all">${esc(code)}</textarea><p class="muted small">이 코드에는 GitHub 토큰이 들어 있어요. 카카오톡 "나와의 채팅"처럼 나만 보는 곳으로 보내세요.</p>`, buttons: [{ label: '다시 복사', onClick: () => { try { navigator.clipboard.writeText(code); UI.toast('복사했어요'); } catch (e) {} return false; } }, { label: T.close, cls: 'primary' }], onOpen: (ov) => { const ta = $('textarea', ov); ta.onclick = () => ta.select(); } });
  },
};
