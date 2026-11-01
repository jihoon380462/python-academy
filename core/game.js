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
    let xp = p.xp || CONFIG.XP[p.type] || 10;
    if (p.boss) xp = this.bossXp(p);
    xp *= CONFIG.HINT_XP_MULT[Math.min(3, rec.answerSeen ? 3 : hints)];
    if (p.dual && mode === 'text') xp *= CONFIG.TEXT_MODE_MULT;
    if (firstTry && !wasClear) xp *= 1 + CONFIG.FIRST_TRY_BONUS;
    if (inChallenge) xp *= CONFIG.DAILY_CHALLENGE_MULT;
    // 콤보
    if (!inTimeAttack) { if (hints === 0 && !rec.answerSeen) { this.combo++; } else { this.combo = 0; } }
    this.statMax('maxCombo', this.combo);
    xp *= this.comboMult();
    if (wasClear && !inReview && !inChallenge) xp = Math.round(xp * 0.3); // 다시 풀기는 30%
    if (inReview) xp = CONFIG.REVIEW_XP_BONUS_PER;
    // 기록
    rec.status = 'clear'; rec.clearedAt = Date.now();
    if (!wasClear || stars > rec.stars) rec.stars = Math.max(rec.stars, stars);
    if (!wasClear) { rec.firstTry = !!firstTry; this.stat('clears'); if (firstTry) this.stat('firstTryClears'); if (rec.fails >= 5) this.stat('fail5Clear'); if (rec.hadError) this.stat('errorsOvercome'); }
    if (hints === 0 && !rec.answerSeen) { this.noHintStreak++; this.statMax('noHintStreak', this.noHintStreak); } else this.noHintStreak = 0;
    if (mode === 'text' && p.type === 'code') this.stat('textClears'); if (p.type === 'parsons') this.stat('parsonsClears');
    { const ll = Content.lesson(p.lesson); if (ll && ll.practical) { const allPr = PROBLEMS.filter(q => (Content.lesson(q.lesson) || {}).practical); if (allPr.every(q => q.id === p.id || Store.prob(q.id).status === 'clear')) this.stat('master_' + Store.course); } } // 실전 챕터 전부 클리어 → 코스 마스터
    if (p.boss && !p.mock && Content.problemsOf(p.lesson).every(q => q.id === p.id || Store.prob(q.id).status === 'clear')) { d.stats['boss_' + p.lesson] = 1; this.stat('bossClears'); if (Store.course === 'algo' && !d.lessons['bossMarked_' + p.lesson]) { d.lessons['bossMarked_' + p.lesson] = 1; this.stat('algoBosses'); } }
    if (usedTutor) this.stat('tutorBreakthrough');
    const h = new Date().getHours(); if (h >= 0 && h < 4) this.stat('nightClear');
    // 복습 큐
    if (!inReview) { const stage = (hints > 0 || rec.fails >= 3) ? 0 : 1; /* 힌트·3회 실패는 1일, 깔끔한 클리어는 3일부터 */ rec.review = { stage, due: addDays(todayKey(), CONFIG.REVIEW_INTERVALS[stage]) }; }
    // 일일/스트릭
    const today = todayKey(); d.days[today] = (d.days[today] || 0) + 1; this.touchStreak();
    if (d.days[today] === d.dailyGoal && !d.dailyGoalDates[today]) { d.dailyGoalDates[today] = true; this.stat('dailyGoalsMet'); events.push({ type: 'dailyGoal' }); Store.data.xp += CONFIG.DAILY_GOAL_BONUS; }
    // 레슨 전체 별 3
    const lp = Content.problemsOf(p.lesson); if (lp.length && lp.every(q => Store.prob(q.id).stars === 3) && !d.lessons['star3_' + p.lesson]) { d.lessons['star3_' + p.lesson] = true; this.stat('lessonsAll3'); }
    if (PROBLEMS.every(q => Store.prob(q.id).status === 'clear')) d.stats.allClear = 1;
    const r = this.addXp(xp); events.push({ type: 'xp', amount: r.amount, stars, combo: this.combo, mult: this.comboMult() }); r.levelUps.forEach(u => events.push({ type: 'levelUp', ...u }));
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
  chapterOpen(ch) { if (ch <= 1) return true; const prevBoss = LESSONS.find(l => l.boss && l.ch === ch - 1); return !prevBoss || !!Store.data.stats['boss_' + prevBoss.id]; },
  lessonOpen(l) { if (!this.chapterOpen(l.ch)) return false; const idx = LESSONS.findIndex(x => x.id === l.id); if (idx === 0) return true; const prev = LESSONS[idx - 1]; if (prev.ch !== l.ch) return true; return this.lessonDone(prev); },
  lessonDone(l) { if (l.mock) return !!Store.data.stats['boss_' + l.id]; const ps = Content.problemsOf(l.id); return ps.length > 0 && ps.every(p => Store.prob(p.id).status === 'clear'); },
  lessonStars(l) { const ps = Content.problemsOf(l.id); if (!ps.length) return 0; return Math.min(...ps.map(p => Store.prob(p.id).stars)); },
  currentLesson() { for (const l of LESSONS) { if (this.lessonOpen(l) && !this.lessonDone(l)) return l; } return LESSONS[LESSONS.length - 1]; },
};

// ---------- 복습 ----------
const Review = {
  due() { const today = todayKey(); return PROBLEMS.filter(p => { const r = Store.prob(p.id); return r.status === 'clear' && r.review && r.review.due <= today; }); },
  afterReview(p, success, hints) { const r = Store.prob(p.id); const st = r.review ? r.review.stage : 0; const next = (success && hints === 0) ? Math.min(CONFIG.REVIEW_INTERVALS.length - 1, st + 1) : 0; r.review = { stage: next, due: addDays(todayKey(), CONFIG.REVIEW_INTERVALS[next]) }; if (success) { Game.stat('reviewsDone'); const rt = Store.data.reviewToday; if (rt.date !== todayKey()) { rt.date = todayKey(); rt.count = 0; } rt.count++; } Store.save(); },
  tagStats() { const tags = {}; PROBLEMS.forEach(p => { const r = Store.prob(p.id); p.tags.forEach(t => { tags[t] = tags[t] || { total: 0, clear: 0, attempts: 0, fails: 0 }; const s = tags[t]; s.total++; if (r.status === 'clear') s.clear++; s.attempts += r.attempts; s.fails += r.fails; }); }); return tags; },
  weakest() { const ts = this.tagStats(); let w = null, wr = 2; Object.entries(ts).forEach(([t, s]) => { if (s.attempts + s.clear === 0) return; const rate = s.clear / Math.max(1, s.clear + s.fails); if (rate < wr) { wr = rate; w = t; } }); return w; },
  quizPool(uptoLesson) { const idx = LESSONS.findIndex(l => l.id === uptoLesson); return PROBLEMS.filter(p => ['quiz', 'fill'].includes(p.type) && LESSONS.findIndex(l => l.id === p.lesson) <= idx); },
};
