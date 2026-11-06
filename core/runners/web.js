// core/runners/web.js — 웹·HTTP·API 코스(Phase 4)의 러너: iframe srcdoc 샌드박스 + 가짜 API 서버 + 채점 체크 스크립트 (docs/EXPANSION.md 8절, v2.7.0 뼈대)
// 사용:
//   await Web.render(iframe, { html, css, js }, { onConsole({level,text}), onError({text,line}), onFetch(rec) }, { api:{ delay, failRate, failFirst, todos } })
//       → srcdoc 조립(css 는 <style>, js 는 <script>, 전체 문서(<html>)를 써도 됨). sandbox="allow-scripts allow-forms". 준비되면 resolve(최대 2.5초).
//       iframe 안 console.log/error · window.onerror · alert/confirm/prompt(팝업 금지 → 출력창) 가 postMessage 로 부모에게 온다.
//   가짜 API 서버: iframe 안 fetch 훅이 https://api.academy.local/... 를 처리(Web.api.routes 표). 요청·응답·상태·ms 가 onFetch 로 온다(네트워크 탭).
//   const results = await Web.check(iframe, checks)   → [{ text, ok, got, sel }]  (checks 의 모양은 Web.CHECK_DOC / specs/content-team.md C-W 절)
//   Web.highlight(iframe, sel)                         → 미리보기에서 해당 요소 outline 강조(실패 항목 클릭)
//   Web.parseCode(str)                                 → 저장된 JSON({html,css,js}) 또는 html 문자열을 { html, css, js } 로
// 설계: 부모·iframe 은 origin 이 다르므로(opaque) DOM 을 직접 못 만진다 → 모든 검사는 iframe 안의 bridge 스크립트가 실행하고 postMessage 로 결과만 돌려준다.
//       bridge(__academyBridge)는 toString() 으로 srcdoc 에 넣으므로 바깥 변수를 참조하면 안 된다(자기 완결).
const Web = {
  ORIGIN: 'https://api.academy.local',
  _frames: new Map(), _seq: 0, _bound: false,
  init() { if (this._bound) return; this._bound = true; window.addEventListener('message', (e) => this._onMessage(e)); },
  // 문제 저장값(JSON) 또는 html 문자열 → { html, css, js }
  parseCode(s) { if (s && typeof s === 'object') return { html: s.html || '', css: s.css || '', js: s.js || '' }; if (typeof s !== 'string') return { html: '', css: '', js: '' }; const t = s.trim(); if (t.startsWith('{')) { try { const o = JSON.parse(t); if (o && typeof o === 'object') return { html: o.html || '', css: o.css || '', js: o.js || '' }; } catch (e) {} } return { html: s, css: '', js: '' }; },
  // 정답 표기(p.solution): html + css/js 를 <style>/<script> 로 합친 한 문자열
  joinCode({ html = '', css = '', js = '' }) { let s = ''; if (css.trim()) s += `<style>\n${css}\n</style>\n`; s += html; if (js.trim()) s += `\n<script>\n${js}\n</script>`; return s; },
  // srcdoc 조립. 조각(html 만)이면 문서로 감싸고, 전체 문서면 head/body 에 끼워 넣는다
  srcdoc({ html = '', css = '', js = '' }, cfg) {
    const safe = (s, tag) => String(s).replace(new RegExp('</' + tag, 'gi'), '<\\/' + tag);
    const cfgJson = JSON.stringify(cfg).replace(/<\//g, '<\\/');
    const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><script>(${this._bridgeSrc()})(${cfgJson});</script><style id="__academy-base">html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}</style>${css.trim() ? `<style>\n${safe(css, 'style')}\n</style>` : ''}`;
    const tail = js.trim() ? `<script>/*${this.JS_MARK}*/\n${safe(js, 'script')}\n</script>` : '';
    if (/<html[\s>]/i.test(html)) {
      let doc = html;
      if (/<head[^>]*>/i.test(doc)) doc = doc.replace(/<head[^>]*>/i, (m) => m + head); else if (/<html[^>]*>/i.test(doc)) doc = doc.replace(/<html[^>]*>/i, (m) => m + '<head>' + head + '</head>'); else doc = head + doc;
      if (tail) { if (/<\/body>/i.test(doc)) doc = doc.replace(/<\/body>/i, tail + '</body>'); else doc += tail; }
      return doc;
    }
    return `<!DOCTYPE html><html lang="ko"><head>${head}</head><body>\n${html}\n${tail}</body></html>`;
  },
  JS_MARK: '__academy_js__',
  // JS 탭 코드가 srcdoc 의 몇 번째 줄부터 시작하는지(에러 줄 번호를 JS 탭 기준으로 바꿀 때) — <script> 태그가 있는 줄 번호
  jsLineOffset(doc) { const i = doc.indexOf('/*' + this.JS_MARK + '*/'); return i < 0 ? null : doc.slice(0, i).split('\n').length; },
  _bridgeSrc() { return this._src || (this._src = __academyBridge.toString()); },
  // iframe 에 그리고 bridge 가 준비될 때까지 기다린다
  render(iframe, code, handlers = {}, opts = {}) {
    this.init(); const token = 'w' + (++this._seq) + '_' + Math.random().toString(36).slice(2, 8);
    const old = iframe.__web; if (old) { this._frames.delete(old.token); old.pending.forEach((fn) => fn(null)); }
    const entry = { token, iframe, handlers, pending: new Map(), ready: false, readyResolve: null };
    iframe.__web = entry; this._frames.set(token, entry);
    if (!iframe.getAttribute('sandbox')) iframe.setAttribute('sandbox', 'allow-scripts allow-forms');
    const cfg = { token, api: opts.api || {} };
    const p = new Promise((res) => { entry.readyResolve = res; setTimeout(() => { if (!entry.ready) { entry.ready = true; res(false); } }, 2500); });
    const doc = this.srcdoc(this.parseCode(code), cfg); entry.jsOffset = this.jsLineOffset(doc);
    iframe.srcdoc = doc;
    return p;
  },
  _onMessage(e) {
    const d = e.data; if (!d || typeof d !== 'object' || !d.__web) return; const entry = this._frames.get(d.__web); if (!entry) return;
    if (e.source && entry.iframe.contentWindow && e.source !== entry.iframe.contentWindow) return;
    const h = entry.handlers || {};
    if (d.t === 'ready') { entry.ready = true; entry.readyResolve && entry.readyResolve(true); }
    else if (d.t === 'console') h.onConsole && h.onConsole({ level: d.level, text: d.text });
    else if (d.t === 'error') { /* 줄 번호는 srcdoc 기준 → JS 탭 기준으로(JS 탭 밖(html 안 script 등)이면 줄 없음) */ const ln = (d.line && entry.jsOffset && d.line > entry.jsOffset) ? d.line - entry.jsOffset : null; h.onError && h.onError({ text: d.text, line: ln, col: d.col }); }
    else if (d.t === 'net') h.onFetch && h.onFetch({ method: d.method, url: d.url, status: d.status, ms: d.ms, req: d.req, res: d.res, error: !!d.error });
    else if (d.t === 'checkResult') { const fn = entry.pending.get(d.id); if (fn) { entry.pending.delete(d.id); fn(d.result); } }
  },
  _post(iframe, msg) { const entry = iframe.__web; if (!entry || !iframe.contentWindow) return false; iframe.contentWindow.postMessage(Object.assign({ __web: entry.token }, msg), '*'); return true; },
  // 항목별 검사(순서대로). viewport 가 있는 항목은 부모가 iframe 폭을 바꾼 뒤 검사한다
  async check(iframe, checks) {
    const entry = iframe.__web; const out = [];
    if (!entry) return (checks || []).map((c) => ({ text: c.text, ok: false, got: '미리보기가 아직 없어요', sel: c.sel }));
    if (!entry.ready) await new Promise((r) => { const t0 = Date.now(); const tick = () => (entry.ready || Date.now() - t0 > 2500) ? r() : setTimeout(tick, 50); tick(); });
    const w0 = iframe.style.width;
    for (const c of (checks || [])) {
      if (c.viewport) { iframe.style.width = c.viewport + 'px'; await new Promise((r) => setTimeout(r, 120)); }
      const r = await this._checkOne(iframe, c);
      if (c.viewport) iframe.style.width = w0;
      out.push(r);
    }
    return out;
  },
  _checkOne(iframe, item) {
    const entry = iframe.__web; const id = 'c' + (++this._seq);
    return new Promise((res) => {
      const done = (r) => res(r || { text: item.text, ok: false, got: '응답 없음', sel: item.sel });
      entry.pending.set(id, done);
      const limit = 4000 + (item.wait || 0);
      setTimeout(() => { if (entry.pending.has(id)) { entry.pending.delete(id); done({ text: item.text, ok: false, got: '시간 초과(검사 응답 없음)', sel: item.sel }); } }, limit);
      if (!this._post(iframe, { t: 'check', id, item })) { entry.pending.delete(id); done(null); }
    });
  },
  highlight(iframe, sel) { return this._post(iframe, { t: 'highlight', sel }); },
  // 가짜 API 서버 설명(문서·네트워크 탭 도움말). 실제 처리는 bridge 안 makeApi
  api: {
    base: 'https://api.academy.local',
    routes: [
      { method: 'GET', path: '/todos', desc: '할 일 목록 → 200 [{id,title,done}]' },
      { method: 'POST', path: '/todos', desc: '{title} → 201 {id,title,done:false} · title 없으면 400' },
      { method: 'PUT', path: '/todos/:id', desc: '{done?,title?} → 200 바뀐 항목 · 없으면 404' },
      { method: 'DELETE', path: '/todos/:id', desc: '→ 204 · 없으면 404' },
      { method: 'GET', path: '/menu', desc: '카페 메뉴 5개 → 200 [{id,name,price}]' },
      { method: 'POST', path: '/orders', desc: '{items:[{id,qty}]} → 201 {orderId,total,items} · items 비면 400 · 없는 메뉴 404' },
      { method: 'GET', path: '/weather?city=서울', desc: '→ 200 {city,temp,sky} · city 없으면 400 · 모르는 도시 404 (서울·부산·대구·제주·강릉)' },
      { method: 'POST', path: '/login', desc: '{user,password} → 200 {token} · 틀리면 401 (student / academy)' },
      { method: 'GET', path: '/me', desc: '헤더 Authorization: Bearer <token> → 200 {user} · 없으면 401' },
    ],
    options: 'opts.api = { delay: ms(기본 300~800 무작위), failRate: 0~1(무작위 500), failFirst: n(처음 n번 500), todos: [{id,title,done}] }',
  },
  CHECK_DOC: `checks 항목: { text:'설명', sel:'CSS 선택자', 검사 하나 }  검사 = exists:true|false · count:n|{min,max} · equals:'글자가 정확히'(공백 정리 후) · contains:'글자 포함' · value:'입력값' · attr:{name,value?} · css:{prop,value}(색은 rgb 로 정규화, px 는 ±2) · js:'식(참이면 통과)'
  동작 뒤 검사: { text, click:'#btn', times?:n, then:{ sel, … } } · { text, input:{sel,value}, then:{…} } · { text, key:{sel,key:'Enter'}, then:{…} } · wait:ms(기본 300, 가짜 서버 응답이 끝날 때까지는 자동 대기) · viewport:390(그 폭에서 검사)`,
};

// ===== iframe 안에서 도는 bridge (자기 완결 — 바깥 변수 참조 금지) =====
function __academyBridge(cfg) {
  var TOKEN = cfg.token; var P = window.parent; var pendingNet = 0;
  function send(m) { m.__web = TOKEN; try { P.postMessage(m, '*'); } catch (e) {} }
  function fmt(a) { try { if (typeof a === 'string') return a; if (a instanceof Error) return a.name + ': ' + a.message; if (a && a.nodeType === 1) return '<' + a.tagName.toLowerCase() + (a.id ? ' id="' + a.id + '"' : '') + '>'; if (a === undefined) return 'undefined'; if (typeof a === 'function') return 'function ' + (a.name || ''); var s = JSON.stringify(a); return s === undefined ? String(a) : s; } catch (e) { return String(a); } }
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (k) { var o = console[k]; console[k] = function () { var args = Array.prototype.slice.call(arguments); send({ t: 'console', level: k, text: args.map(fmt).join(' ') }); try { o && o.apply(console, args); } catch (e) {} }; });
  window.alert = function (m) { send({ t: 'console', level: 'alert', text: String(m) }); };
  window.confirm = function (m) { send({ t: 'console', level: 'alert', text: 'confirm: ' + m + ' → 확인(true)' }); return true; };
  window.prompt = function (m, d) { send({ t: 'console', level: 'alert', text: 'prompt: ' + m + ' → "' + (d == null ? '' : d) + '"' }); return d == null ? '' : String(d); };
  window.addEventListener('error', function (e) { send({ t: 'error', text: e.message || '오류', line: e.lineno, col: e.colno }); });
  window.addEventListener('unhandledrejection', function (e) { send({ t: 'error', text: '(await/Promise) ' + fmt(e.reason) }); });
  // ---------- 가짜 API 서버 ----------
  function makeApi(opt) {
    var todos = (opt.todos || [{ id: 1, title: '우유 사기', done: false }, { id: 2, title: 'HTML 공부하기', done: true }]).map(function (t) { return { id: t.id, title: t.title, done: !!t.done }; });
    var nextId = todos.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1;
    var MENU = [{ id: 1, name: '아메리카노', price: 3000 }, { id: 2, name: '카페라떼', price: 3500 }, { id: 3, name: '바닐라라떼', price: 4000 }, { id: 4, name: '녹차', price: 3000 }, { id: 5, name: '치즈케이크', price: 5500 }];
    var WEATHER = { '서울': { temp: 18, sky: '맑음' }, '부산': { temp: 21, sky: '흐림' }, '대구': { temp: 20, sky: '맑음' }, '제주': { temp: 23, sky: '비' }, '강릉': { temp: 16, sky: '눈' } };
    var orders = []; var nextOrder = 1001; var calls = 0; var TOKEN_OK = 'token-student-1234';
    function res(status, body) { return { status: status, body: body }; }
    function route(method, path, query, body, headers) {
      calls++;
      if (opt.failFirst && calls <= opt.failFirst) return res(500, { error: '서버 오류(연습용)' });
      if (opt.failRate && Math.random() < opt.failRate) return res(500, { error: '서버 오류(연습용)' });
      var m;
      if (path === '/todos') {
        if (method === 'GET') return res(200, todos.map(function (t) { return { id: t.id, title: t.title, done: t.done }; }));
        if (method === 'POST') { if (!body || typeof body !== 'object' || !String(body.title || '').trim()) return res(400, { error: 'title 이 필요해요' }); var t = { id: nextId++, title: String(body.title).trim(), done: false }; todos.push(t); return res(201, t); }
        return res(405, { error: method + ' 은 지원하지 않아요' });
      }
      if ((m = path.match(/^\/todos\/(\d+)$/))) {
        var idx = -1; for (var i = 0; i < todos.length; i++) if (todos[i].id === +m[1]) idx = i;
        if (idx < 0) return res(404, { error: '그런 할 일이 없어요' });
        if (method === 'GET') return res(200, todos[idx]);
        if (method === 'PUT' || method === 'PATCH') { if (body && typeof body === 'object') { if (body.done != null) todos[idx].done = !!body.done; if (body.title != null) todos[idx].title = String(body.title); } return res(200, todos[idx]); }
        if (method === 'DELETE') { todos.splice(idx, 1); return res(204, null); }
        return res(405, { error: method + ' 은 지원하지 않아요' });
      }
      if (path === '/menu' && method === 'GET') return res(200, MENU);
      if (path === '/orders') {
        if (method === 'GET') return res(200, orders);
        if (method === 'POST') { var items = body && body.items; if (!Array.isArray(items) || !items.length) return res(400, { error: 'items 가 비어 있어요' }); var total = 0, out = []; for (var k = 0; k < items.length; k++) { var mi = null; for (var j = 0; j < MENU.length; j++) if (MENU[j].id === +items[k].id) mi = MENU[j]; if (!mi) return res(404, { error: '없는 메뉴 id ' + items[k].id }); var qty = Math.max(1, +items[k].qty || 1); total += mi.price * qty; out.push({ id: mi.id, name: mi.name, qty: qty, price: mi.price }); } var o = { orderId: nextOrder++, total: total, items: out, status: '접수' }; orders.push(o); return res(201, o); }
      }
      if (path === '/weather' && method === 'GET') { var city = query.city; if (!city) return res(400, { error: 'city 가 필요해요 (예: ?city=서울)' }); var w = WEATHER[city]; if (!w) return res(404, { error: city + ' 의 날씨는 몰라요' }); return res(200, { city: city, temp: w.temp, sky: w.sky }); }
      if (path === '/login' && method === 'POST') { if (body && body.user === 'student' && body.password === 'academy') return res(200, { token: TOKEN_OK, user: 'student' }); return res(401, { error: '아이디나 비밀번호가 틀렸어요' }); }
      if (path === '/me' && method === 'GET') { var auth = headers.authorization || ''; if (auth === 'Bearer ' + TOKEN_OK) return res(200, { user: 'student', name: '학생' }); return res(401, { error: '로그인이 필요해요 (Authorization 헤더)' }); }
      return res(404, { error: '그런 주소는 없어요: ' + method + ' ' + path });
    }
    return { route: route, delay: function () { return opt.delay != null ? +opt.delay : 300 + Math.floor(Math.random() * 500); } };
  }
  var api = makeApi(cfg.api || {});
  var realFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : null;
  function parseQuery(qs) { var q = {}; if (!qs) return q; qs.replace(/^\?/, '').split('&').forEach(function (kv) { if (!kv) return; var i = kv.indexOf('='); var k = i < 0 ? kv : kv.slice(0, i), v = i < 0 ? '' : kv.slice(i + 1); try { q[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' ')); } catch (e) { q[k] = v; } }); return q; }
  function headersOf(init, input) { var h = {}; var src = (init && init.headers) || (input && typeof input === 'object' && input.headers) || null; if (!src) return h; try { if (typeof Headers !== 'undefined' && src instanceof Headers) { src.forEach(function (v, k) { h[k.toLowerCase()] = v; }); return h; } if (Array.isArray(src)) { src.forEach(function (kv) { h[String(kv[0]).toLowerCase()] = String(kv[1]); }); return h; } Object.keys(src).forEach(function (k) { h[k.toLowerCase()] = String(src[k]); }); } catch (e) {} return h; }
  window.fetch = function (input, init) {
    init = init || {}; var url = typeof input === 'string' ? input : (input && input.url) || String(input); var method = ((init.method || (input && input.method)) || 'GET').toUpperCase();
    var m = url.match(/^https?:\/\/api\.academy\.local(\/[^?#]*)?(\?[^#]*)?/); var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    var ms = function () { return Math.round(((window.performance && performance.now) ? performance.now() : Date.now()) - t0); };
    if (!m) {
      if (!realFetch) return Promise.reject(new TypeError('이 미리보기에서는 fetch 를 쓸 수 없어요'));
      pendingNet++;
      return realFetch(input, init).then(function (r) { pendingNet--; send({ t: 'net', method: method, url: url, status: r.status, ms: ms(), req: init.body != null ? String(init.body) : '', res: '(외부 응답 · 본문은 표시하지 않아요)' }); return r; }, function (err) { pendingNet--; send({ t: 'net', method: method, url: url, status: 0, ms: ms(), req: init.body != null ? String(init.body) : '', res: '연결 실패: ' + (err && err.message) + ' — 이 코스의 가짜 서버 주소는 https://api.academy.local 이에요', error: true }); throw err; });
    }
    var path = m[1] || '/'; var query = parseQuery(m[2]); var raw = init.body; var body = null; var reqText = '';
    if (raw != null) { reqText = typeof raw === 'string' ? raw : (raw && typeof raw.get === 'function' ? '(FormData)' : String(raw)); try { body = JSON.parse(reqText); } catch (e) { body = reqText; } }
    pendingNet++;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        var r; try { r = api.route(method, path, query, body, headersOf(init, input)); } catch (e) { r = { status: 500, body: { error: '서버 내부 오류: ' + e.message } }; }
        var text = r.body == null ? '' : JSON.stringify(r.body); pendingNet--;
        send({ t: 'net', method: method, url: url, status: r.status, ms: ms(), req: reqText, res: text, error: r.status >= 400 });
        try { resolve(new Response(r.status === 204 ? null : text, { status: r.status, statusText: r.status === 200 ? 'OK' : r.status === 201 ? 'Created' : r.status === 204 ? 'No Content' : r.status === 400 ? 'Bad Request' : r.status === 401 ? 'Unauthorized' : r.status === 404 ? 'Not Found' : r.status === 405 ? 'Method Not Allowed' : 'Internal Server Error', headers: { 'Content-Type': 'application/json; charset=utf-8' } })); } catch (e) { reject(e); }
      }, api.delay());
    });
  };
  // ---------- 채점 체크 스크립트 ----------
  function norm(s) { return String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); }
  function all(sel) { try { return Array.prototype.slice.call(document.querySelectorAll(sel)); } catch (e) { return []; } }
  function colorOf(v) { var d = document.createElement('div'); d.style.color = ''; d.style.color = String(v); if (!d.style.color) return null; document.documentElement.appendChild(d); var c = getComputedStyle(d).color; d.remove(); return c; }
  function cssEq(prop, got, want) {
    got = norm(got).toLowerCase(); want = norm(want).toLowerCase(); if (got === want) return true;
    if (/color|background$/.test(prop) || /^(rgb|hsl|#)/.test(want)) { var cw = colorOf(want), cg = colorOf(got); if (cw && cg) return cw === cg; }
    if (/px$/.test(want) && /px$/.test(got)) return Math.abs(parseFloat(got) - parseFloat(want)) <= 2;
    if (/^-?[\d.]+$/.test(want) && /^-?[\d.]+(px)?$/.test(got)) return Math.abs(parseFloat(got) - parseFloat(want)) <= 2;
    if (prop === 'font-family' || prop === 'fontFamily') return got.replace(/["']/g, '').indexOf(want.replace(/["']/g, '')) >= 0;
    return false;
  }
  function evalCond(c) {
    if (c.js) { var v = (new Function('return (' + c.js + ')'))(); return { ok: !!v, got: fmt(v) }; }
    var els = c.sel ? all(c.sel) : [document.body];
    if (c.exists != null) return { ok: c.exists ? els.length > 0 : els.length === 0, got: els.length + '개' };
    if (c.count != null) { var n = els.length; var ok = typeof c.count === 'number' ? n === c.count : ((c.count.min == null || n >= c.count.min) && (c.count.max == null || n <= c.count.max)); return { ok: ok, got: n + '개' }; }
    if (!els.length) return { ok: false, got: (c.sel || '') + ' 요소가 없어요' };
    var el = els[0];
    if (c.equals != null) { var t = norm(el.textContent); return { ok: t === norm(c.equals), got: t || '(비어 있음)' }; }
    if (c.contains != null) { var t2 = norm(el.textContent); return { ok: t2.indexOf(norm(c.contains)) >= 0, got: t2 || '(비어 있음)' }; }
    if (c.value != null) return { ok: norm(el.value) === norm(c.value), got: el.value };
    if (c.attr) { var a = el.getAttribute(c.attr.name); var okA = c.attr.value == null ? a != null : norm(a) === norm(c.attr.value); return { ok: okA, got: a == null ? '(속성 없음)' : a }; }
    if (c.css) { var cs = getComputedStyle(el); var g = cs.getPropertyValue(c.css.prop) || cs[c.css.prop] || ''; return { ok: cssEq(c.css.prop, g, c.css.value), got: g || '(값 없음)' }; }
    return { ok: els.length > 0, got: els.length + '개' };
  }
  function settle(ms) { return new Promise(function (r) { var t0 = Date.now(); function tick() { var waited = Date.now() - t0; if (waited >= ms && (pendingNet === 0 || waited > 4000)) return setTimeout(r, 40); setTimeout(tick, 40); } tick(); }); }
  function runCheck(it) {
    var out = { text: it.text, ok: false, sel: it.sel || (it.then && it.then.sel) || it.click || (it.input && it.input.sel) || null };
    return new Promise(function (resolve) {
      var fail = function (g) { out.got = g; resolve(out); };
      try {
        var acted = false;
        if (it.input) { var ie = document.querySelector(it.input.sel); if (!ie) return fail('입력창 ' + it.input.sel + ' 이 없어요'); try { ie.focus(); } catch (e) {} ie.value = it.input.value; ie.dispatchEvent(new Event('input', { bubbles: true })); ie.dispatchEvent(new Event('change', { bubbles: true })); acted = true; }
        if (it.key) { var ke = document.querySelector(it.key.sel); if (!ke) return fail('요소 ' + it.key.sel + ' 이 없어요'); ['keydown', 'keypress', 'keyup'].forEach(function (tp) { ke.dispatchEvent(new KeyboardEvent(tp, { key: it.key.key || 'Enter', code: it.key.key || 'Enter', bubbles: true })); }); acted = true; }
        if (it.click) { var times = it.times || 1; for (var i = 0; i < times; i++) { var ce = document.querySelector(it.click); if (!ce) return fail('누를 요소 ' + it.click + ' 이 없어요'); ce.click(); } acted = true; }
        if (it.submit) { var fe = document.querySelector(it.submit); if (!fe) return fail('폼 ' + it.submit + ' 이 없어요'); if (fe.requestSubmit) fe.requestSubmit(); else fe.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); acted = true; }
        var ms = it.wait != null ? it.wait : (acted ? 300 : 0);
        (ms || acted ? settle(ms) : Promise.resolve()).then(function () { var r = evalCond(it.then || it); out.ok = !!r.ok; out.got = r.got; resolve(out); }).catch(function (e) { fail('검사 오류: ' + e.message); });
      } catch (e) { fail('검사 오류: ' + e.message); }
    });
  }
  var hl = [];
  function highlight(sel) { hl.forEach(function (h) { try { h.el.style.outline = h.o; h.el.style.outlineOffset = h.oo; } catch (e) {} }); hl = []; if (!sel) return; var els = all(sel); els.forEach(function (el) { hl.push({ el: el, o: el.style.outline, oo: el.style.outlineOffset }); el.style.outline = '3px solid #ff5252'; el.style.outlineOffset = '2px'; }); if (els[0] && els[0].scrollIntoView) try { els[0].scrollIntoView({ block: 'center' }); } catch (e) {} }
  window.addEventListener('message', function (e) { var d = e.data; if (!d || d.__web !== TOKEN) return; if (d.t === 'check') runCheck(d.item || {}).then(function (r) { send({ t: 'checkResult', id: d.id, result: r }); }); else if (d.t === 'highlight') highlight(d.sel); });
  function ready() { send({ t: 'ready' }); }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(ready, 0); else window.addEventListener('DOMContentLoaded', function () { setTimeout(ready, 0); });
}
