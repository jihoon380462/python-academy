// core/hub.js — 허브(index.html). "오늘 뭐 할까"에 3초 안에 답한다. 러너(Pyodide·CodeMirror)는 받지 않는다.
// 읽는 것: academy.profile + 각 코스 조각(진행률). 쓰는 것: 없음(설정·초기화는 코스 페이지의 설정 화면에서).
const Hub = {
  courseUrl(c, hash = '') { return c.path + (hash ? '#' + hash : ''); },
  // 코스 진행 요약. 지금은 파이썬 콘텐츠만 로드되어 있으므로 다른 코스는 저장 조각의 문제 수로만 계산
  progress(c) {
    const cd = Store.courseData(c.id); const probs = cd.problems || {};
    if (c.id === Store.course) { const total = PROBLEMS.length; const cleared = PROBLEMS.filter(p => (probs[p.id] || {}).status === 'clear').length; const stars = PROBLEMS.reduce((s, p) => s + ((probs[p.id] || {}).stars || 0), 0); return { total, cleared, stars, maxStars: total * 3, pct: total ? Math.round(100 * cleared / total) : 0 }; }
    const ids = Object.keys(probs); const cleared = ids.filter(id => probs[id].status === 'clear').length; const stars = ids.reduce((s, id) => s + (probs[id].stars || 0), 0); const total = c.total || 0; return { total, cleared, stars, maxStars: total * 3, pct: total ? Math.round(100 * cleared / total) : 0 };
  },
  // 복습 큐를 코스 공통으로(v2.2.4, NEXT.md F1): 각 코스 저장 조각의 problems[].review.due 만 보면 되므로 콘텐츠가 없어도 셀 수 있다
  // 교과서 코스(c.book, v2.10.1): 채점이 없으니 「읽은 레슨 n/m」. 읽음 표시는 코스 조각의 lessons[레슨id].read (시작하기 SETUP_n 은 빼고)
  bookProgress(c) { const ls = (c.id === Store.course ? Store.data.lessons : Store.courseData(c.id).lessons) || {}; const pat = new RegExp((CONFIG.COURSE_ID_PATTERNS || {})[c.id] || '^$'); const read = Math.min(c.lessons || 0, Object.keys(ls).filter(k => ls[k] && ls[k].read && pat.test(k)).length); return { read, total: c.lessons || 0, pct: c.lessons ? Math.round(100 * read / c.lessons) : 0 }; },
  reviewDue() { const today = todayKey(); return CONFIG.COURSES.filter(c => c.ready && !c.book).map(c => { const probs = Store.courseData(c.id).problems || {}; const n = Object.values(probs).filter(r => r && r.status === 'clear' && r.review && r.review.due <= today).length; return { c, n }; }).filter(x => x.n); },
  locked(c) { if (!c.requires) return false; if (Store.data.settings.unlockAll) return false; return !Store.data.stats['boss_' + c.requires.boss]; }, // 보스 클리어 통계는 프로필(공통)에 있음
  ring(pct, color) { const r = 26, C = 2 * Math.PI * r; return `<svg class="ring" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" transform="rotate(-90 32 32)"/><text x="32" y="36" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">${pct}%</text></svg>`; },
  render() {
    const d = Store.data; const lv = Game.level(); const streak = Game.currentStreak(); const today = todayKey(); const todayCount = d.days[today] || 0; const rd = this.reviewDue(); const py = CONFIG.COURSES.find(c => c.id === 'python');
    const last = d.last && d.last.view ? d.last : null; const lastP = last && last.params.pid && Content.problemMap[last.params.pid]; const lastL = last && last.params.lessonId && Content.lessonMap[last.params.lessonId];
    const cur = py.book ? LESSONS.find(l => !l.mock && !(d.lessons[l.id] || {}).read) : Game.currentLesson(); // v2.10.1: 교과서는 「안 읽은 첫 레슨」
    const lessonOfP = lastP && Content.lessonMap[lastP.lesson];
    const lastCourse = last && last.course && last.course !== 'python' ? CONFIG.COURSES.find(c => c.id === last.course) : null;
    const contCourse = lastCourse || py;
    const contHash = lastCourse ? (last.params.pid ? `problem/${last.params.pid}` : last.params.lessonId ? `lesson/${last.params.lessonId}` : '') : last ? (last.view === 'problem' && lastP ? `problem/${lastP.id}` : lastL ? `lesson/${lastL.id}` : '') : (cur ? `lesson/${cur.id}` : '');
    const contLabel = lastCourse ? (lastCourse.book ? `${esc(lastCourse.name)} 교과서 이어서 읽기` : lastCourse.space ? `${esc(lastCourse.name)} 이어서 하기` : lastCourse.book ? `${esc(lastCourse.name)} 교과서 이어서 읽기` : `${esc(lastCourse.name)} 코스 이어서 하기`) : last && lastP && py.book ? `레슨 "${esc(lessonOfP ? lessonOfP.title : lastP.title)}" 만들어 보기 이어서` : last && lastP ? `${esc(lastP.title)} 이어서 풀기` : last && lastL ? `레슨 "${esc(lastL.title)}" 이어서 보기` : cur ? `레슨 "${esc(cur.title)}" ${py.book ? '읽기' : '시작하기'}` : '파이썬 코스 열기';
    const game = Game.showGame(); /* v2.6.0 ④·⑤: 허브는 마스코트·레벨·스트릭 없이 깔끔하게(설정 「게임 요소 보기」를 켜면 표시) */
    $('#topbar').innerHTML = `<div class="tb-title"><span class="tb-brand">${esc(T.appName)}</span>${game ? ` <span class="muted small">${esc(d.nick || '학습자')} · Lv.${lv.level} ${esc(Game.title(lv.level))}</span>` : ''}</div>
      ${game ? `<div class="tb-xp" title="레벨 ${lv.level}"><span class="tb-lv">Lv.${lv.level}</span><div class="xpbar"><div class="xpfill" style="width:${lv.need ? Math.round(100 * lv.into / lv.need) : 100}%"></div></div><span class="tb-xpn">${lv.into}/${lv.need || '최대'}</span></div>
      <div class="tb-streak ${streak ? 'on' : ''}" title="${T.streak}">🔥${streak}</div>` : ''}
      ${Sync.on ? `<a class="tb-btn tb-sync ${Sync.state}" href="${this.courseUrl(py, 'settings')}" title="기기 연동: 마지막 동기화 ${Sync.ago()}">${Sync.icon()}</a>` : ''}<a class="tb-btn" href="${this.courseUrl(py, 'settings')}" title="${T.settings}">${UI.icon('settings')}</a>`;
    $('#view').innerHTML = `<div class="page hub">
      <div class="hub-top"><div class="hub-kicker">코드 학습</div><h1 class="hub-title">${esc(T.appName)}</h1><p class="muted hub-lead">📖 교과서 코스(파이썬·알고리즘·터미널·Git·SQL·웹·Vim)는 읽고 내 컴퓨터(VS Code·Git Bash·DB Browser·Vim)에서 직접 만들어 보고, 수학 코스는 브라우저에서 바로 실행하며 배워요. 계정은 필요 없어요.</p></div>
      <div class="card hub-today"><div class="card-h">오늘의 할 일</div>
        <a class="btn primary big hub-cont" href="${this.courseUrl(contCourse, contHash)}">▶ ${contLabel}</a>
        <div class="hub-stats"><span>문제 코스(수학) 오늘 <b>${Math.min(todayCount, d.dailyGoal)}/${d.dailyGoal}</b></span><span>복습 큐 <b>${rd.reduce((a, x) => a + x.n, 0)}</b>개${rd.length ? ' · ' + rd.map(x => `<a href="${this.courseUrl(x.c, 'review')}">${esc(x.c.name)} ${x.n}</a>`).join(' · ') : ''}</span></div>
      </div>
      <h2 class="hub-h">코스</h2>
      <div class="hub-courses">${CONFIG.COURSES.filter(c => !c.space).map(c => this.courseCard(c)).join('')}</div>
      ${CONFIG.COURSES.some(c => c.space) ? `<h2 class="hub-h">공용 <small class="muted">코스 순서와 무관 — 언제든</small></h2><div class="hub-courses hub-spaces">${CONFIG.COURSES.filter(c => c.space).map(c => this.courseCard(c)).join('')}</div>` : ''}
      <div class="muted small center hub-foot">${T.appName} v${CONFIG.APP_VERSION} · <b>완전 무료</b> · 계정 없음 · 진행은 내 기기에만 저장(설정에서 백업·기기 연동) · 한 번 연 뒤엔 오프라인도 OK</div>
    </div>`;
  },
  courseCard(c) {
    const pr = this.progress(c); const ready = !!c.ready; const locked = ready && this.locked(c);
    const bp = c.book ? this.bookProgress(c) : null;
    const body = bp ? `<div class="hc-body">${this.ring(bp.pct, 'var(--primary)')}<div class="hc-txt"><div class="hc-sub">📖 교과서 · 읽은 레슨 ${bp.read}/${bp.total}</div><div class="hc-sub muted">${c.bookNote ? esc(c.bookNote) : bp.read >= bp.total ? '다 읽었어요 🎉' : '채점 없이 읽고 내 컴퓨터에서 만들어 보기'}</div></div></div>`
      : ready
      ? `<div class="hc-body">${this.ring(pr.pct, 'var(--primary)')}<div class="hc-txt"><div class="hc-sub">${pr.cleared}/${pr.total} 문제${Game.showGame() ? ` · ★ ${pr.stars}/${pr.maxStars}` : ''}</div><div class="hc-sub muted">${pr.cleared >= pr.total ? '완주! 🎉' : `남은 문제 ${pr.total - pr.cleared}개`}</div></div></div>`
      : `<div class="hc-body"><div class="hc-soon">준비 중 <small>${c.preview ? '· 미리보기 열림' : `(Phase ${c.phase})`}</small></div>${c.requires && !c.preview ? `<div class="hc-sub muted">🔒 ${esc(c.requires.label)}</div>` : ''}</div>`;
    const lockNote = locked ? `<div class="hc-sub muted">🔒 ${esc(c.requires.label)} <span class="small">(설정에서 "전제 무시" 가능)</span></div>` : '';
    const glyph = { python: 'Py', algo: 'Al', 'terminal-git': '>_', sql: 'SQL', web: '</>', math: '∑', vim: 'Vi', github: 'Gh' }[c.id] || (c.name || '?').slice(0, 1); const inner = `<div class="hc-head"><span class="hc-glyph" aria-hidden="true">${esc(glyph)}</span><span class="hc-name">${esc(c.name)}</span>${locked ? '<span class="chip">🔒</span>' : ''}${c.space ? '<span class="chip">공용</span>' : ''}</div><div class="hc-desc muted small">${esc(c.desc)}${c.hubLabel ? ` · ${esc(c.hubLabel)}` : ''}</div>${body}${lockNote}`;
    /* v2.7.0: preview 코스(뼈대 단계)는 잠금 없이 열림 — 허브 카드는 「준비 중 · 미리보기」 */
    return (ready && !locked) || c.preview ? `<a class="card hc ${ready ? 'ready' : 'soon preview'}" href="${this.courseUrl(c)}" style="--hc:var(--primary)">${inner}</a>` : `<div class="card hc ${ready ? 'locked' : 'soon'}">${inner}</div>`;
  },
};
window.addEventListener('DOMContentLoaded', () => {
  Store.load('python'); Content.init(); (Store.data.myProblems || []).forEach(np => { if (!Content.problemMap[np.id]) { Content.problemMap[np.id] = np; PROBLEMS.push(np); } });
  UI.applyTheme(); Sync.load(); Offline.register('sw.js');
  Hub.render();
  if (Sync.on) { Sync.hook = () => Hub.render(); Sync.syncNow().then(ch => { if (ch) Hub.render(); }); }
});
