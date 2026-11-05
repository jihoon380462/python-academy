// core/runners/sql.js — SQL 러너 (v2.7.0 뼈대, EXPANSION.md 7절). sql.js(SQLite wasm) 를 CDN 에서 받아 브라우저 안에서 진짜 SQLite 를 돌린다.
//   Sql.start()            엔진 받기(한 번만). 실패하면 Sql.unavailable = true, Sql.reason 에 이유 — 화면은 「SQLite 엔진을 받지 못했어요」 + 재시도
//   Sql.ready              엔진 준비 여부 · Sql.onState(fn) 상태 바뀔 때 알림
//   Sql.fresh(datasetId)   SQL_DATASETS[datasetId](courses/<코스>/datasets.js) 로 새 메모리 DB
//   Sql.exec(db, query)    → { columns, rows, ms, changes } 또는 { error: { msg(SQLite 원문), ko(한국어 풀이) } }. 여러 문장이면 마지막 결과 집합
//   Sql.explain(msg, db)   SQLite 에러 → 한국어 풀이(흔한 것 7개 + 비슷한 표·열 이름 추천)
//   Sql.isDangerous(query) WHERE 없는 DELETE/UPDATE 면 { kind } (실행은 하되 화면이 「모든 행이 바뀌었어요!」 경고)
//   CDN 주소는 CONFIG 를 건드리지 않고 여기 상수로 둔다(코스 플러그인 규칙, DESIGN.md 16절). sw.js 캐시 대상이 아니라 처음엔 인터넷이 필요하다.
const Sql = {
  VERSION: '1.13.0',
  URL: 'https://cdn.jsdelivr.net/npm/sql.js@1.13.0/dist/sql-wasm.js',   // + 같은 폴더의 sql-wasm.wasm (locateFile)
  TIMEOUT_MS: 30000,
  ready: false, unavailable: false, reason: '', phase: 'idle', SQL: null, loading: null, _ls: [],
  onState(fn) { this._ls.push(fn); },
  _emit() { this._ls.forEach(fn => { try { fn(this); } catch (e) { console.warn('Sql.onState', e); } }); },
  start() {
    if (this.ready) return Promise.resolve(this.SQL);
    if (this.loading) return this.loading;
    this.unavailable = false; this.reason = ''; this.phase = 'loading'; this._emit();
    this.loading = new Promise((resolve, reject) => {
      const fail = (why) => { this.loading = null; this.phase = 'failed'; this.unavailable = true; this.reason = why; this._emit(); reject(new Error(why)); };
      const timer = setTimeout(() => fail('시간 초과(' + Math.round(this.TIMEOUT_MS / 1000) + '초)'), this.TIMEOUT_MS);
      const go = () => {
        if (typeof initSqlJs !== 'function') return fail('initSqlJs 가 없어요');
        const base = this.URL.slice(0, this.URL.lastIndexOf('/') + 1);
        initSqlJs({ locateFile: (f) => base + f }).then(SQL => { clearTimeout(timer); this.SQL = SQL; this.ready = true; this.phase = 'ready'; this.loading = null; this._emit(); resolve(SQL); }).catch(e => { clearTimeout(timer); fail('wasm 초기화 실패: ' + (e && e.message || e)); });
      };
      if (typeof initSqlJs === 'function') return go();
      const old = document.querySelector('script[data-sqljs]'); if (old) old.remove();
      const s = document.createElement('script'); s.src = this.URL; s.async = true; s.dataset.sqljs = '1';
      s.onload = go; s.onerror = () => { clearTimeout(timer); fail('스크립트를 받지 못했어요(인터넷 연결 필요)'); };
      document.head.appendChild(s);
    });
    return this.loading;
  },
  fresh(datasetId) {
    if (!this.ready) throw new Error('SQLite 엔진이 아직 준비되지 않았어요');
    const sets = typeof SQL_DATASETS !== 'undefined' ? SQL_DATASETS : {}; const sql = sets[datasetId || 'cafe'];
    if (!sql) throw new Error('데이터셋이 없어요: ' + datasetId);
    const db = new this.SQL.Database(); db.exec(sql); return db;
  },
  // 문자열·주석을 걷어낸 쿼리(키워드 검사용)
  _strip(q) { return String(q || '').replace(/'(?:[^']|'')*'/g, "''").replace(/"(?:[^"]|"")*"/g, '""').replace(/--[^\n]*/g, ' ').replace(/\/\*[\s\S]*?\*\//g, ' '); },
  isDangerous(query) {
    const stmts = this._strip(query).split(';').map(s => s.trim()).filter(Boolean);
    for (const s of stmts) { const m = s.match(/^(delete|update)\b/i); if (m && !/\bwhere\b/i.test(s)) return { kind: m[1].toUpperCase() }; }
    return null;
  },
  exec(db, query) {
    const t0 = performance.now();
    try {
      const res = db.exec(String(query || ''));
      const ms = Math.max(1, Math.round(performance.now() - t0));
      const dml = /\b(insert|update|delete|replace)\b/i.test(this._strip(query));
      const changes = dml ? db.getRowsModified() : 0;
      const last = res.length ? res[res.length - 1] : { columns: [], values: [] };
      const rows = last.values.map(r => r.map(v => this.cell(v)));
      return { columns: last.columns.slice(), rows, ms, changes, statements: res.length };
    } catch (e) {
      const msg = String(e && e.message || e); return { error: { msg, ko: this.explain(msg, db) } };
    }
  },
  cell(v) { if (v == null) return null; if (typeof v === 'number') return v; if (v instanceof Uint8Array) return '(blob ' + v.length + ' bytes)'; return String(v); },
  // ---------- 스키마 ----------
  tables(db) { try { const r = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"); return r.length ? r[0].values.map(v => String(v[0])) : []; } catch (e) { return []; } },
  columns(db, table) { try { const r = db.exec(`PRAGMA table_info("${String(table).replace(/"/g, '""')}")`); return r.length ? r[0].values.map(v => ({ name: String(v[1]), type: String(v[2] || ''), notnull: !!v[3], pk: !!v[5] })) : []; } catch (e) { return []; } },
  count(db, table) { try { const r = db.exec(`SELECT COUNT(*) FROM "${String(table).replace(/"/g, '""')}"`); return r.length ? Number(r[0].values[0][0]) : 0; } catch (e) { return 0; } },
  sample(db, table, n = 3) { try { const r = db.exec(`SELECT * FROM "${String(table).replace(/"/g, '""')}" LIMIT ${Number(n) || 3}`); return r.length ? { columns: r[0].columns, rows: r[0].values.map(row => row.map(v => this.cell(v))) } : { columns: [], rows: [] }; } catch (e) { return { columns: [], rows: [] }; } },
  // ---------- 에러 한국어 풀이 ----------
  _dist(a, b) { a = a.toLowerCase(); b = b.toLowerCase(); const m = a.length, n = b.length; const d = Array.from({ length: m + 1 }, (_, i) => [i]); for (let j = 1; j <= n; j++) d[0][j] = j; for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); return d[m][n]; },
  _near(name, cands) { const scored = cands.map(c => [this._dist(name, c), c]).filter(([d, c]) => d <= Math.max(2, Math.floor(c.length / 3)) || c.toLowerCase().includes(name.toLowerCase())).sort((a, b) => a[0] - b[0]); return scored.slice(0, 3).map(x => x[1]); },
  explain(msg, db) {
    const m = String(msg || ''); let x;
    const tbls = db ? this.tables(db) : []; const cols = db ? [...new Set(tbls.flatMap(t => this.columns(db, t).map(c => c.name)))] : [];
    if ((x = m.match(/no such table:\s*([\w.]+)/i))) { const near = this._near(x[1].split('.').pop(), tbls); return `「${x[1]}」라는 표가 없어요. 표 이름을 확인해 보세요.${near.length ? ' 비슷한 표: ' + near.join(', ') : tbls.length ? ' 있는 표: ' + tbls.join(', ') : ''}`; }
    if ((x = m.match(/no such column:\s*([\w.]+)/i))) { const near = this._near(x[1].split('.').pop(), cols); return `「${x[1]}」라는 열이 없어요. 열 이름을 확인해 보세요(글자를 비교하려면 작은따옴표 ' ' 로 감싸야 해요).${near.length ? ' 비슷한 열: ' + near.join(', ') : ''}`; }
    if ((x = m.match(/ambiguous column name:\s*([\w.]+)/i))) return `「${x[1]}」열이 여러 표에 있어요. 어느 표의 열인지 표이름.열이름 으로 적어 주세요(예: menu.id).`;
    if ((x = m.match(/no such function:\s*(\w+)/i))) return `「${x[1]}」이라는 함수는 없어요. 철자를 확인해 보세요(COUNT, SUM, AVG, MIN, MAX, LENGTH, UPPER…).`;
    if (/incomplete input/i.test(m)) return '문장이 끝나지 않았어요. 괄호 ( ) 나 따옴표가 닫혔는지, 뒤에 빠진 말은 없는지 보세요.';
    if ((x = m.match(/near "([^"]*)":\s*syntax error/i))) return `문법이 틀렸어요. 「${x[1]}」근처를 보세요 — 쉼표가 빠졌거나 많지 않은지, 키워드 철자(SELECT·FROM·WHERE)와 순서가 맞는지 확인해 보세요.`;
    if (/syntax error/i.test(m)) return '문법이 틀렸어요. 쉼표·따옴표·괄호와 키워드 순서(SELECT → FROM → WHERE → GROUP BY → ORDER BY → LIMIT)를 확인해 보세요.';
    if (/misuse of aggregate/i.test(m)) return '집계 함수(COUNT·SUM·AVG…)는 WHERE 에서 쓸 수 없어요. 그룹 조건은 HAVING 에 쓰세요.';
    if ((x = m.match(/(UNIQUE|NOT NULL|FOREIGN KEY|CHECK) constraint failed(?::\s*([\w.]+))?/i))) { const k = x[1].toUpperCase(); const col = x[2] ? `(${x[2]})` : ''; return k === 'UNIQUE' ? `이미 같은 값이 있어요${col}. UNIQUE·PRIMARY KEY 열에는 같은 값을 두 번 넣을 수 없어요.` : k === 'NOT NULL' ? `비워 둘 수 없는 열${col}에 값이 없어요. NOT NULL 열은 INSERT 할 때 꼭 값을 넣어야 해요.` : k === 'FOREIGN KEY' ? '다른 표에 없는 id 를 가리키고 있어요. 외래 키는 상대 표에 있는 값이어야 해요.' : `CHECK 조건${col}에 어긋나는 값이에요.`; }
    if (/datatype mismatch/i.test(m)) return '자료형이 안 맞아요. 숫자 열에 글자를 넣었거나 PRIMARY KEY 에 숫자가 아닌 값을 넣지 않았는지 보세요.';
    if (/table \w+ already exists/i.test(m)) return '같은 이름의 표가 이미 있어요. 다른 이름을 쓰거나 「데이터 초기화」로 처음 상태로 돌아가세요.';
    if (/has no column named\s*(\w+)/i.test(m)) { x = m.match(/table (\w+) has no column named (\w+)/i); return `「${x ? x[1] : '표'}」에 「${x ? x[2] : ''}」열이 없어요. INSERT 의 열 이름을 스키마 패널과 맞춰 보세요.`; }
    return 'SQLite 가 실행하지 못했어요. 위 영문 메시지의 단어를 보고 어느 부분인지 찾아보세요.';
  },
};
