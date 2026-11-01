// core/storage.js — 저장소 (스키마 v2). localStorage `academy.*` 조각으로 나눠 저장하되, 코드에서는 `Store.data` 한 객체로 다룬다.
//   academy.profile          XP·레벨·뱃지·스트릭·일일 목표·마스코트·설정·updatedAt·resetAt (전 코스 공통)
//   academy.course.<id>      문제별 상태·코드·별점·복습·레슨 진행·체크업·타임어택·도전 (코스별)
//   academy.tutor.<id>       선생님 대화 (코스별)
//   academy.works            내 작품 (공통)
//   academy.backup.v1        v1(python_academy_save) 원본 보관 — 마이그레이션 후에도 지우지 않음
//   academy.sync             기기 연동 설정 (core/sync.js가 관리, 동기화 대상 아님)
// v1 키 `python_academy_save`가 있고 v2가 없으면 첫 load()에서 자동 마이그레이션한다.
const Store = {
  data: null, course: 'python',
  KEYS: { profile: 'academy.profile', works: 'academy.works', backup: 'academy.backup.v1', v1: 'python_academy_save', course: (id) => 'academy.course.' + id, tutor: (id) => 'academy.tutor.' + id },
  COURSE_FIELDS: ['problems', 'lessons', 'myProblems', 'bestTimes', 'dailyChallenge', 'checkups', 'polished', 'examplesEdited', 'chapterPerfect'],
  blank() {
    return { v: CONFIG.SCHEMA_VERSION, nick: '', mascotColor: 0, onboarded: false, xp: 0, badges: [], badgeDates: {}, stats: {}, problems: {}, lessons: {},
      streak: { cur: 0, best: 0, last: null }, days: {}, dailyGoal: 5, dailyGoalDates: {},
      settings: { theme: 'dark', font: 1, sound: true, vibrate: true, anim: 2, apiKey: '', model: CONFIG.TUTOR.defaultModel, editorTheme: 'classic', confetti: 'rainbow', soundSet: 'bell', accessory: 'none', turtleSpeed: 6 },
      works: [], tutorChats: {}, myProblems: [], bestTimes: {}, dailyChallenge: null, checkups: {}, playgroundXp: { date: '', amount: 0 }, polished: {}, examplesEdited: {}, reviewToday: { date: '', count: 0 }, chapterPerfect: {}, last: null };
  },
  _get(k) { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch (e) { console.warn('저장 데이터 읽기 실패', k, e); return null; } },
  _set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  // 조각 → 한 객체
  assemble(course = this.course) {
    const prof = this._get(this.KEYS.profile); if (!prof) return null;
    const d = Object.assign(this.blank(), prof); d.settings = Object.assign(this.blank().settings, prof.settings || {});
    const c = this._get(this.KEYS.course(course)) || {}; this.COURSE_FIELDS.forEach(f => { if (c[f] !== undefined) d[f] = c[f]; });
    d.tutorChats = this._get(this.KEYS.tutor(course)) || {}; d.works = this._get(this.KEYS.works) || [];
    return d;
  },
  // 한 객체 → 조각
  split(d = this.data, course = this.course) {
    const prof = {}; const c = {};
    for (const k of Object.keys(d)) { if (k === 'works' || k === 'tutorChats') continue; (this.COURSE_FIELDS.includes(k) ? c : prof)[k] = d[k]; }
    this._set(this.KEYS.profile, prof); this._set(this.KEYS.course(course), c); this._set(this.KEYS.tutor(course), d.tutorChats || {}); this._set(this.KEYS.works, d.works || []);
  },
  hasV2() { return localStorage.getItem(this.KEYS.profile) != null; },
  // v1(단일 키) → v2. 원본은 academy.backup.v1 에 보관. 돌려주는 값: 마이그레이션 했는지
  migrateV1() {
    const raw = localStorage.getItem(this.KEYS.v1); if (!raw || this.hasV2()) return false;
    let d; try { d = JSON.parse(raw); } catch (e) { console.warn('v1 데이터 손상', e); return false; }
    try { localStorage.setItem(this.KEYS.backup, raw); } catch (e) {}
    const full = Object.assign(this.blank(), d); full.settings = Object.assign(this.blank().settings, d.settings || {}); full.v = CONFIG.SCHEMA_VERSION;
    this.split(full, 'python'); // v1은 파이썬 코스뿐
    try { localStorage.removeItem(this.KEYS.v1); } catch (e) {}
    const sy = localStorage.getItem('python_academy_sync'); if (sy) { try { localStorage.setItem('academy.sync', sy); localStorage.removeItem('python_academy_sync'); } catch (e) {} }
    console.info('저장 데이터를 v2로 옮겼어요 (원본: academy.backup.v1)'); return true;
  },
  // 설정의 "v1 데이터 다시 가져오기": 백업을 현재 데이터와 병합하지 않고 통째로 복원
  restoreV1Backup() { const raw = localStorage.getItem(this.KEYS.backup); if (!raw) throw new Error('백업이 없어요'); const d = JSON.parse(raw); this.data = Object.assign(this.blank(), d); this.data.settings = Object.assign(this.blank().settings, d.settings || {}); this.migrate(); this.save(); },
  hasV1Backup() { return localStorage.getItem(this.KEYS.backup) != null; },
  load(course) {
    if (course) this.course = course;
    try { this.migrateV1(); const d = this.assemble(); if (d) { this.data = d; this.migrate(); return; } } catch (e) { console.warn('저장 데이터 읽기 실패', e); }
    this.data = this.blank();
  },
  migrate() { /* 향후 스키마 변경 시 v 비교해 변환 */ this.data.v = CONFIG.SCHEMA_VERSION; },
  save(opt = {}) {
    if (!opt.silent) { this.data.updatedAt = Date.now(); if (typeof Sync !== 'undefined' && Sync.on) Sync.schedulePush(); }
    try { this.split(); } catch (e) { console.warn('저장 실패(용량?)', e); }
  },
  // 다른 코스의 조각 읽기 (허브용, 쓰지 않음)
  courseData(id) { return this._get(this.KEYS.course(id)) || {}; },
  // 전체 용량(바이트) — 4MB 넘으면 설정에 정리 버튼
  usage() { let n = 0; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith('academy.')) n += byteLen(localStorage.getItem(k) || ''); } return n; },
  cleanupCodes() { let n = 0; for (const [id, p] of Object.entries(this.data.problems)) { if (p.status === 'clear' && p.code) { p.code = null; p.mode = null; n++; } } this.save(); return n; },
  prob(id) { const d = this.data; if (!d.problems[id]) d.problems[id] = { status: 'none', stars: 0, hints: 0, attempts: 0, fails: 0, code: null, mode: null, firstTry: null, answerSeen: false, tutorAsked: false, review: null, clearedAt: null }; return d.problems[id]; },
  setCode(id, code, mode) { const p = this.prob(id); if (code != null && byteLen(code) <= CONFIG.MAX_CODE_SAVE_BYTES) { p.code = code; p.mode = mode; } this.save(); },
  exportJSON() { return JSON.stringify(this.data, null, 1); },
  // 모든 코스 묶음 백업 (v2.2.4, NEXT.md F8): localStorage의 academy.* 전부 (API 키·연동 토큰은 제외)
  exportBundle() { const keys = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (!k || !k.startsWith('academy.') || k === this.KEYS.backup || k === 'academy.sync') continue; const v = this._get(k); if (v == null) continue; if (k === this.KEYS.profile && v.settings) { v.settings = Object.assign({}, v.settings); delete v.settings.apiKey; } keys[k] = v; } return JSON.stringify({ format: 'academy-bundle', v: CONFIG.SCHEMA_VERSION, app: CONFIG.APP_VERSION, at: Date.now(), keys }, null, 1); },
  importBundle(text) { const b = JSON.parse(text); if (b && b.format === 'academy-bundle' && b.keys) { const apiKey = this.data.settings.apiKey; for (const [k, v] of Object.entries(b.keys)) if (k.startsWith('academy.') && k !== 'academy.sync') this._set(k, v); this.load(this.course); if (apiKey && !this.data.settings.apiKey) { this.data.settings.apiKey = apiKey; this.save(); } return 'bundle'; } this.importJSON(text); return 'single'; },
  importJSON(text) { const d = JSON.parse(text); if (!d || typeof d !== 'object' || !('problems' in d)) throw new Error('형식이 맞지 않아요'); this.data = Object.assign(this.blank(), d); this.data.settings = Object.assign(this.blank().settings, d.settings || {}); this.migrate(); this.save(); },
  reset() { this.data = this.blank(); this.data.resetAt = Date.now(); this.save(); },
  resetProblem(id) { delete this.data.problems[id]; delete this.data.tutorChats[id]; this.save(); },
};
