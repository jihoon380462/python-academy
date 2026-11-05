// core/game.js — XP·레벨·콤보·뱃지·스트릭(Game), 복습 큐(Review)
// ---------- 게임 시스템 ----------
const Game = {
  levelFromXp(xp) { let L = 1, need = CONFIG.xpForLevel(1), acc = 0; while (L < CONFIG.MAX_LEVEL && xp >= acc + need) { acc += need; L++; need = CONFIG.xpForLevel(L); } return { level: L, into: xp - acc, need: L >= CONFIG.MAX_LEVEL ? 0 : need }; },
  level() { return this.levelFromXp(Store.data.xp); },
  title(level) { return CONFIG.TITLES[Math.min(CONFIG.TITLES.length - 1, Math.floor((level - 1) / 5))]; },
  mascotStage(level) { let s = 0; CONFIG.MASCOT_STAGES.forEach((L, i) => { if (level >= L) s = i; }); return s; },
  combo: 0, noHintStreak: 0, sessionEvents: [],
  stat(key, delta = 1) { const s = Store.data.stats; s[key] = (s[key] || 0) + delta; return s[key]; },
  statMax(key, v) { const s = Store.data.stats; if ((s[key] || 0) < v) s[key] = v; },
  comboMult() { for (const [n, m] of CONFIG.COMBO_MULT) if (this.combo >= n) return m; return 1; },
  addXp(amount, reason = '') { amount = Math.round(amount); if (amount <= 0) return { amount: 0, levelUps: [] }; const before = this.level().level; Store.data.xp += amount; const after = this.level().level; const ups = []; for (let L = before + 1; L <= after; L++) ups.push({ level: L, title: this.title(L), titleChanged: this.title(L) !== this.title(L - 1), stageChanged: CONFIG.MASCOT_STAGES.includes(L) }); Store.save(); return { amount, levelUps: ups }; },
  // 문제 클리어 처리 → 이벤트 목록 반환
  clearProblem(p, { mode, hints, firstTry, usedTutor, inReview, inChallenge, inTimeAttack }) {
    const rec = Store.prob(p.id); const d = Store.data; const events = []; const wasClear = rec.status === 'clear';
    const stars = rec.answerSeen ? 0 : 3 - Math.min(3, hints);
    const rerun = wasClear && !inReview && !inChallenge && !inTimeAttack && stars <= rec.stars; // 이미 클리어한 문제를 그냥 다시 제출(별 향상 없음): XP·콤보·일일 횟수 없음 (v2.2.7)
    let xp = p.xp || CONFIG.XP[p.type] || 10;
    if (p.boss) xp = this.bossXp(p);
    xp *= CONFIG.HINT_XP_MULT[Math.min(3, rec.answerSeen ? 3 : hints)];
    if (firstTry && !wasClear) xp *= 1 + CONFIG.FIRST_TRY_BONUS;
    if (inChallenge) xp *= CONFIG.DAILY_CHALLENGE_MULT;
    // 콤보
    if (!inTimeAttack && !rerun) { if (hints === 0 && !rec.answerSeen) { this.combo++; } else { this.combo = 0; } }
    this.statMax('maxCombo', this.combo);
    xp *= this.comboMult();
    if (wasClear && !inReview && !inChallenge) xp = Math.round(xp * 0.3); // 별이 올라간 다시 풀기는 30%
    if (rerun) xp = 0;
    if (inReview) xp = CONFIG.REVIEW_XP_BONUS_PER;
    // 기록
    rec.status = 'clear'; rec.clearedAt = Date.now();
    if (!wasClear || stars > rec.stars) rec.stars = Math.max(rec.stars, stars);
    if (!wasClear) { rec.firstTry = !!firstTry; if (p.drill) this.stat('drillClears'); else this.stat('clears'); if (firstTry) this.stat('firstTryClears'); if (rec.fails >= 5) this.stat('fail5Clear'); if (rec.hadError) this.stat('errorsOvercome'); }
    if (hints === 0 && !rec.answerSeen) { this.noHintStreak++; this.statMax('noHintStreak', this.noHintStreak); } else this.noHintStreak = 0;
    if (mode === 'text' && p.type === 'code') this.stat('textClears'); if (p.type === 'parsons') this.stat('parsonsClears');
    { const ll = Content.lesson(p.lesson); if (ll && ll.practical) { const allPr = PROBLEMS.filter(q => q.project && (Content.lesson(q.lesson) || {}).practical); /* QA #73: 연습 문제(C8)는 마스터 조건이 아님 */ if (allPr.every(q => q.id === p.id || Store.prob(q.id).status === 'clear')) this.stat('master_' + Store.course); } } // 실전 챕터 전부 클리어 → 코스 마스터
    if (p.boss && !p.mock && Content.problemsOf(p.lesson).every(q => q.id === p.id || Store.prob(q.id).status === 'clear')) { d.stats['boss_' + p.lesson] = 1; this.stat('bossClears'); if (Store.course === 'algo' && !d.lessons['bossMarked_' + p.lesson]) { d.lessons['bossMarked_' + p.lesson] = 1; this.stat('algoBosses'); } }
    if (this.isGraph()) { const ll = Content.lesson(p.lesson); if (ll && this.lessonDone(ll)) { if (LESSONS.filter(x => x.ch === ll.ch).every(x => this.lessonDone(x))) d.stats['math_area_' + ll.ch] = 1; d.stats.mathNodes = LESSONS.filter(x => this.lessonDone(x)).length; d.stats.mathStarNodes = LESSONS.filter(x => x.star && this.lessonDone(x)).length; } } // 수학 공간: 영역 완료·노드 수·★ 노드 수 (뱃지용)
    if (usedTutor) this.stat('tutorBreakthrough');
    const h = new Date().getHours(); if (h >= 0 && h < 4) this.stat('nightClear');
    // 복습 큐
    if (!inReview && !rerun && Review.reviewable(p)) { const stage = (hints > 0 || rec.fails >= 3) ? 0 : 1; /* 힌트·3회 실패는 1일, 깔끔한 클리어는 3일부터 */ rec.review = { stage, due: addDays(todayKey(), CONFIG.REVIEW_INTERVALS[stage]) }; } /* QA #148: 실전 프로젝트·모의고사·타자 연습은 복습 후보가 아니므로 일정도 안 붙임(허브 큐와 숫자가 어긋나던 것) */
    // 일일/스트릭
    const today = todayKey(); if (!rerun) { d.days[today] = (d.days[today] || 0) + 1; } this.touchStreak();
    if (d.days[today] === d.dailyGoal && !d.dailyGoalDates[today]) { d.dailyGoalDates[today] = true; this.stat('dailyGoalsMet'); events.push({ type: 'dailyGoal' }); Store.data.xp += CONFIG.DAILY_GOAL_BONUS; }
    // 레슨 전체 별 3
    const lp = Content.problemsOf(p.lesson); if (lp.length && lp.every(q => Store.prob(q.id).stars === 3) && !d.lessons['star3_' + p.lesson]) { d.lessons['star3_' + p.lesson] = true; this.stat('lessonsAll3'); }
    if (PROBLEMS.every(q => Store.prob(q.id).status === 'clear')) d.stats.allClear = 1;
    const r = this.addXp(xp); events.push({ type: 'xp', amount: r.amount, stars, combo: this.combo, mult: this.comboMult(), rerun }); r.levelUps.forEach(u => events.push({ type: 'levelUp', ...u }));
    this.checkChapterPerfect(p);
    this.checkBadges().forEach(b => events.push({ type: 'badge', badge: b }));
    Store.save(); return events;
  },
  bossXp(p) { const lesson = Content.lesson(p.lesson); const chProbs = PROBLEMS.filter(q => Content.lesson(q.lesson).ch === lesson.ch && !q.boss); const sum = chProbs.reduce((a, q) => a + (q.xp || CONFIG.XP[q.type] || 10), 0); return Math.max(60, Math.round(sum * CONFIG.BOSS_XP_RATIO)); },
  failProblem(p) { const rec = Store.prob(p.id); rec.fails++; rec.attempts++; this.combo = 0; this.noHintStreak = 0; if (rec.status !== 'clear') rec.status = 'try'; Store.save(); },
  recordError(p) { this.stat('errors'); if (p) Store.prob(p.id).hadError = true; Store.save(); },
  checkChapterPerfect(p) { const lesson = Content.lesson(p.lesson); const ch = lesson.ch; if (!ch) return; const probs = PROBLEMS.filter(q => Content.lesson(q.lesson).ch === ch); if (probs.every(q => { const r = Store.prob(q.id); return r.status === 'clear' && r.stars === 3 && r.firstTry; })) Store.data.stats['perfect_' + ch] = 1; },
  checkBadges() { const d = Store.data; const got = []; BADGES.forEach(b => { if (d.badges.includes(b.id)) return; const [k, v] = b.cond; if ((d.stats[k] || 0) >= v) { d.badges.push(b.id); d.badgeDates[b.id] = Date.now(); got.push(b); } }); if (got.length) Store.save(); return got; },
  touchStreak() { const s = Store.data.streak; const today = todayKey(); if (s.last === today) return; if (s.last && daysBetween(s.last, today) === 1) s.cur++; else if (s.last && daysBetween(s.last, today) > 1) s.cur = 1; else if (!s.last) s.cur = 1; s.last = today; s.best = Math.max(s.best, s.cur); this.statMax('bestStreak', s.best); },
  currentStreak() { const s = Store.data.streak; if (!s.last) return 0; const gap = daysBetween(s.last, todayKey()); return gap <= 1 ? s.cur : 0; },
  isUnlocked(item) { if (!item.unlock) return true; if (item.unlock.level) return this.level().level >= item.unlock.level; if (item.unlock.badge) return Store.data.badges.includes(item.unlock.badge); return false; },
  unlockText(item) { if (!item.unlock) return ''; if (item.unlock.level) return `레벨 ${item.unlock.level}`; const b = BADGES.find(x => x.id === item.unlock.badge); return b ? `뱃지 "${b.secret ? '???' : b.name}"` : ''; },
  // 잠금: 보스를 깨야 다음 챕터
  // 「모르겠어요」 집계 (v2.2.8): lessons.confused = {'L3:1': n} → [{lesson, count, pages:[...]}] 많이 누른 순
  confusedLessons() { const c = Store.data.lessons.confused || {}; const by = {}; Object.entries(c).forEach(([k, n]) => { const [lid, pg] = k.split(':'); const l = Content.lessonMap[lid]; if (!l) return; by[lid] = by[lid] || { lesson: l, count: 0, pages: [] }; by[lid].count += n; by[lid].pages.push(+pg); }); return Object.values(by).sort((a, b) => b.count - a.count); },
  // 학습 통계 (v2.2.8): 통계 화면·프로필이 쓴다
  stats14() { const today = todayKey(); const days = []; for (let i = 13; i >= 0; i--) { const k = addDays(today, -i); days.push({ key: k, n: Store.data.days[k] || 0, dow: '일월화수목금토'[new Date(k + 'T00:00:00').getDay()] }); } return days; },
  summary() { const d = Store.data; let clear = 0, fails = 0, attempts = 0, stars = [0, 0, 0, 0], tried = 0; PROBLEMS.forEach(p => { const r = d.problems[p.id]; if (!r) return; if (r.attempts || r.status === 'clear') tried++; if (r.status === 'clear') { clear++; stars[Math.min(3, r.stars || 0)]++; } fails += r.fails || 0; attempts += r.attempts || 0; }); const byType = {}; PROBLEMS.forEach(p => { const r = d.problems[p.id]; const t = p.type; byType[t] = byType[t] || { total: 0, clear: 0 }; byType[t].total++; if (r && r.status === 'clear') byType[t].clear++; }); return { total: PROBLEMS.length, clear, tried, fails, attempts, stars, byType, rate: attempts ? Math.round(100 * clear / Math.max(1, clear + fails)) : null }; },
  // 지식 지도 코스(수학 공간, CONFIG.COURSES[].map === 'graph'): 챕터 = 영역(순서 없음), 노드는 prereq 전부 완료 시 열림 (v2.3.0)
  isGraph() { const cc = CONFIG.COURSES.find(c => c.id === Store.course); return !!(cc && cc.map === 'graph'); },
  chapterOpen(ch) { if (this.isGraph()) return true; if (ch <= 1) return true; if (Store.data.settings.unlockAll) return true; let prevBoss = null; for (let c = ch - 1; c >= 1 && !prevBoss; c--) prevBoss = LESSONS.find(l => l.boss && l.ch === c); /* 바로 앞 챕터에 보스가 없으면(실전 챕터) 그 앞의 보스를 본다 (v2.2.19) */ return !prevBoss || !!Store.data.stats['boss_' + prevBoss.id]; },
  lessonOpen(l) { if (this.isGraph()) { if (Store.data.settings.unlockAll) return true; return (l.prereq || []).every(id => { const q = Content.lessonMap[id]; return !q || this.lessonDone(q); }); } if (!this.chapterOpen(l.ch)) return false; const idx = LESSONS.findIndex(x => x.id === l.id); if (idx === 0) return true; const prev = LESSONS[idx - 1]; if (prev.ch !== l.ch) return true; return this.lessonDone(prev); },
  lessonDone(l) { if (l.mock) return !!Store.data.stats['boss_' + l.id]; let ps = Content.problemsOf(l.id); if (l.practical) { const pj = ps.filter(p => p.project); if (pj.length) ps = pj; } /* QA #72: 실전 레슨은 프로젝트만 완료 조건(연습 문제는 선택) */ return ps.length > 0 && ps.every(p => Store.prob(p.id).status === 'clear'); },
  // 수학 노드 숙련도 링 0~3: ① 탐구(탐구 퀴즈 전부 클리어 또는 그림 페이지를 끝까지 봄) ② 풀이(문제 전부) ③ 유지(복습 2단계 이상) (v2.3.0)
  mastery(l) { const ps = Content.problemsOf(l.id); if (!ps.length) return 0; const ex = ps.filter(p => p.kind === 'explore'); const lp = Store.data.lessons[l.id] || {}; const m1 = ex.length ? ex.every(p => Store.prob(p.id).status === 'clear') : (lp.page || 0) >= (l.pages || []).length; const m2 = this.lessonDone(l); const m3 = m2 && ps.every(p => (Store.prob(p.id).review || {}).stage >= 2); return m3 ? 3 : m2 ? 2 : m1 ? 1 : 0; },
  lessonStars(l) { const ps = Content.problemsOf(l.id); if (!ps.length) return 0; return Math.min(...ps.map(p => Store.prob(p.id).stars)); },
  currentLesson() { for (const l of LESSONS) { if (this.lessonOpen(l) && !this.lessonDone(l)) return l; } return LESSONS[LESSONS.length - 1]; },
};

// ---------- 복습 ----------
const Review = {
  /* QA #148: 복습 후보 기준 — 실전 프로젝트·모의고사·타자 연습은 제외. due()·candidates()·clearProblem 이 같은 기준을 쓴다 */
  reviewable(p) { if (!p || p.project || p.drill) return false; const l = Content.lesson(p.lesson) || {}; return !l.mock; },
  /* 옛 저장(v2.3.19 전)에 붙어 있던 프로젝트·모의고사·타자 연습의 일정을 지운다 — 허브 큐(hub.js reviewDue 는 콘텐츠 없이 저장만 봄)와 홈 숫자를 맞추기 위해 */
  prune() { let n = 0; const drop = (id) => { const r = Store.data.problems[id]; if (r && r.review) { delete r.review; n++; } }; PROBLEMS.forEach(p => { if (!this.reviewable(p)) drop(p.id); }); (typeof Content !== 'undefined' && Content.allDrills ? Content.allDrills() : []).forEach(d => drop(d.id)); if (n) Store.save({ silent: true }); return n; },
  due() { this.prune(); const today = todayKey(); return PROBLEMS.filter(p => { const r = Store.prob(p.id); return this.reviewable(p) && r.status === 'clear' && r.review && r.review.due <= today; }); },
  afterReview(p, success, hints) { const r = Store.prob(p.id); const st = r.review ? r.review.stage : 0; const next = (success && hints === 0) ? Math.min(CONFIG.REVIEW_INTERVALS.length - 1, st + 1) : 0; r.review = { stage: next, due: addDays(todayKey(), CONFIG.REVIEW_INTERVALS[next]) }; /* 11/4: 틀린 뒤 맞혀도 복습 한 개로 셈(단계는 0 = 내일 다시) */ { Game.stat('reviewsDone'); const rt = Store.data.reviewToday; if (rt.date !== todayKey()) { rt.date = todayKey(); rt.count = 0; } rt.count++; } Store.save(); },
  tagStats() { const tags = {}; PROBLEMS.forEach(p => { const r = Store.prob(p.id); p.tags.forEach(t => { tags[t] = tags[t] || { total: 0, clear: 0, attempts: 0, fails: 0 }; const s = tags[t]; s.total++; if (r.status === 'clear') s.clear++; s.attempts += r.attempts; s.fails += r.fails; }); }); return tags; },
  weakest() { const ts = this.tagStats(); let w = null, wr = 2; Object.entries(ts).forEach(([t, s]) => { if (s.attempts + s.clear === 0) return; const rate = s.clear / Math.max(1, s.clear + s.fails); if (rate < wr) { wr = rate; w = t; } }); return w; },
  /* 사용자 요청(11/4) 「챕터 6까지 했는데 아무거나 던지는 건 무책임하다」 — 복습 고르기를 약점·챕터 고르게·밀린 날짜로.
     plan({ mode:'due'|'extra', lessonIds, n }) → { items:[{ id, ch, lesson, kind:'due'|'weak', reasons:[…] }], dueCount, poolCount }
     · due  = 오늘의 복습: 다시 볼 날(review.due)이 된 문제가 먼저. 모자라면 약점(틀림·힌트·정답 보기·별 낮음·약한 주제) 문제로 채움
     · extra = 더 복습하기: 범위 안 클리어 문제 전부에서 약점·오래된 순
     · 점수 = 밀린 날 + 약점 + 약한 주제 + 최근 챕터 가산, 고를 때마다 같은 챕터 −18·같은 레슨 −30 → 한 챕터에 몰리지 않게 */
  tagRates() { const out = {}; Object.entries(this.tagStats()).forEach(([t, s]) => { const n = s.clear + s.fails; if (n >= 3) out[t] = s.clear / n; }); return out; },
  weakTags(k = 3) { return Object.entries(this.tagRates()).filter(([, r]) => r < 0.75).sort((a, b) => a[1] - b[1]).slice(0, k); },
  candidates(lessonIds) { const set = lessonIds && lessonIds.length ? new Set(lessonIds) : null; return PROBLEMS.filter(p => { if (!this.reviewable(p)) return false; if (set && !set.has(p.lesson)) return false; return Store.prob(p.id).status === 'clear'; }); },
  plan({ mode = 'due', lessonIds = null, n = CONFIG.REVIEW_SIZE || 5 } = {}) {
    const today = todayKey(); const rates = this.tagRates(); const pool = this.candidates(lessonIds);
    const dayDiff = (a, b) => Math.round((new Date(a) - new Date(b)) / 864e5);
    const chOf = (p) => (Content.lesson(p.lesson) || {}).ch; const maxCh = Math.max(0, ...pool.map(chOf).filter(x => x != null));
    const info = pool.map(p => { const r = Store.prob(p.id); const reasons = []; let s = 0, weak = 0;
      const due = !!(r.review && r.review.due <= today);
      if (due) { const od = Math.max(0, dayDiff(today, r.review.due)); const iv = CONFIG.REVIEW_INTERVALS[r.review.stage || 0]; s += 40 + Math.min(od, 30) * 1.5; reasons.push(od > 0 ? `다시 볼 날이 ${od}일 지났어요 (${iv}일 간격 복습)` : `오늘 다시 볼 날이에요 (${iv}일 간격 복습)`); }
      if (r.answerSeen) { weak += 15; reasons.push('정답 보기를 열었던 문제예요'); }
      if (r.fails > 0) { weak += Math.min(r.fails, 5) * 6; reasons.push(`지금까지 ${r.fails}번 틀렸어요`); }
      if (r.hints > 0) { weak += Math.min(r.hints, 3) * 7; reasons.push(`힌트 ${r.hints}개를 보고 풀었어요`); }
      else if (r.stars && r.stars < 3) { weak += (3 - r.stars) * 5; reasons.push(`별 ${'★'.repeat(r.stars)}${'☆'.repeat(3 - r.stars)} — 더 깔끔하게 풀어 봐요`); }
      const wt = (p.tags || []).filter(t => rates[t] != null && rates[t] < 0.75).sort((a, b) => rates[a] - rates[b])[0];
      if (wt) { weak += (0.75 - rates[wt]) * 40; reasons.push(`#${wt} 주제 정답률 ${Math.round(rates[wt] * 100)}% — 약한 주제예요`); }
      const age = r.clearedAt ? Math.min(30, (Date.now() - r.clearedAt) / 864e5) : 30; if (mode === 'extra') s += age * 0.5;
      const ch = chOf(p); if (ch === maxCh) s += 6; else if (ch === maxCh - 1) s += 3;
      return { p, id: p.id, ch, lesson: p.lesson, due, weak, score: s + weak + Math.random() * 2, kind: due ? 'due' : 'weak', reasons }; });
    let cand = info; if (mode === 'due') { const dueOnes = info.filter(x => x.due); const fill = dueOnes.length < n ? info.filter(x => !x.due && x.weak > 0) : []; fill.forEach(x => x.reasons.unshift('약점 보강 — 다시 볼 날보다 먼저 한 번 더')); cand = dueOnes.concat(fill); }
    const picked = []; const byCh = {}, byL = {}; const left = cand.slice();
    while (picked.length < n && left.length) { let bi = 0, bv = -Infinity; left.forEach((x, i) => { const v = x.score - 18 * (byCh[x.ch] || 0) - 30 * (byL[x.lesson] || 0); if (v > bv) { bv = v; bi = i; } }); const x = left.splice(bi, 1)[0]; picked.push(x); byCh[x.ch] = (byCh[x.ch] || 0) + 1; byL[x.lesson] = (byL[x.lesson] || 0) + 1; }
    picked.forEach(x => { if (!x.reasons.length) x.reasons.push(mode === 'extra' ? '잊지 않게 한 번 더 — 오래전에 푼 문제예요' : '잊기 전에 한 번 더'); x.reasons = x.reasons.slice(0, 3); delete x.p; });
    return { items: picked, dueCount: info.filter(x => x.due).length, poolCount: pool.length };
  },
  quizPool(uptoLesson) { const idx = LESSONS.findIndex(l => l.id === uptoLesson); return PROBLEMS.filter(p => ['quiz', 'fill'].includes(p.type) && LESSONS.findIndex(l => l.id === p.lesson) <= idx); },
};
