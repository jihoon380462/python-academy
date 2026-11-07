// core/hub.js — 허브(index.html). 「오늘 뭐 할까」 에 3초 안에 답한다. v2.19.0 N13: 코스가 전부 교과서라 콘텐츠·러너를 읽지 않고
//   각 코스 저장 조각의 「읽은 레슨」 만 센다(문제 수·복습·잠금·레벨은 옛 문제집 화면과 함께 archive/classic/core/hub.js).
const Hub = {
  courseUrl(c, hash = '') { return c.path + (hash ? '#' + hash : ''); },
  // 「읽은 레슨 n/m」 — 읽음 표시는 코스 조각의 lessons[레슨id].read (시작하기 SETUP_n 은 빼고)
  bookProgress(c) { const ls = (c.id === Store.course ? Store.data.lessons : Store.courseData(c.id).lessons) || {}; const pat = new RegExp((CONFIG.COURSE_ID_PATTERNS || {})[c.id] || '^$'); const read = Math.min(c.lessons || 0, Object.keys(ls).filter(k => ls[k] && ls[k].read && pat.test(k)).length); return { read, total: c.lessons || 0, pct: c.lessons ? Math.round(100 * read / c.lessons) : 0 }; },
  ring(pct, color) { const r = 26, C = 2 * Math.PI * r; return `<svg class="ring" viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="${r}" fill="none" stroke="var(--surface2)" stroke-width="7"/><circle cx="32" cy="32" r="${r}" fill="none" stroke="${color}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}" transform="rotate(-90 32 32)"/><text x="32" y="36" text-anchor="middle" font-size="14" font-weight="800" fill="var(--text)">${pct}%</text></svg>`; },
  render() {
    const d = Store.data; const py = CONFIG.COURSES.find(c => c.id === 'python');
    const last = d.last && d.last.course ? d.last : null; const lastCourse = last ? CONFIG.COURSES.find(c => c.id === last.course && c.ready) : null;
    const contCourse = lastCourse || py; const contHash = lastCourse && last.params && last.params.lessonId ? `lesson/${last.params.lessonId}` : '';
    const contLabel = lastCourse ? `${esc(lastCourse.name)} 교과서 이어서 읽기` : `${esc(py.name)} 교과서부터 시작하기`;
    const books = CONFIG.COURSES.filter(c => c.ready && c.book).sort((a, b) => !!a.space - !!b.space).map(c => esc(c.short || c.name)).join('·');
    /* v2.17.1: 안내 문구는 COURSES 에서 만든다(코스가 늘어도 빠지지 않게). GitHub 교과서는 내 GitHub 계정을 쓰므로 「계정 필요 없음」 은 빼고 「사이트 가입 없음」 */
    const lead = `📖 교과서 코스(${books})는 설명을 읽고 내 컴퓨터에서 직접 만들어 봐요 — VS Code·Git Bash·DB Browser·Vim, GitHub 는 내 계정으로. 채점·점수·잠금 없이 필요한 곳부터 펴 보면 돼요. 사이트 가입은 필요 없어요.`;
    $('#topbar').innerHTML = `<div class="tb-title"><span class="tb-brand">${esc(T.appName)}</span></div>
      ${Sync.on ? `<a class="tb-btn tb-sync ${Sync.state}" href="${this.courseUrl(py, 'settings')}" title="기기 연동: 마지막 동기화 ${Sync.ago()}">${Sync.icon()}</a>` : ''}<a class="tb-btn" href="${this.courseUrl(py, 'settings')}" title="${T.settings}">${UI.icon('settings')}</a>`;
    $('#view').innerHTML = `<div class="page hub">
      <div class="hub-top"><div class="hub-kicker">코드 학습</div><h1 class="hub-title">${esc(T.appName)}</h1><p class="muted hub-lead">${lead}</p></div>
      <div class="card hub-today"><div class="card-h">이어서 하기</div>
        <a class="btn primary big hub-cont" href="${this.courseUrl(contCourse, contHash)}">▶ ${contLabel}</a>
      </div>
      <h2 class="hub-h">코스</h2>
      <div class="hub-courses">${CONFIG.COURSES.filter(c => !c.space).map(c => this.courseCard(c)).join('')}</div>
      ${CONFIG.COURSES.some(c => c.space) ? `<h2 class="hub-h">공용 <small class="muted">코스 순서와 무관 — 언제든</small></h2><div class="hub-courses hub-spaces">${CONFIG.COURSES.filter(c => c.space).map(c => this.courseCard(c)).join('')}</div>` : ''}
      <div class="muted small center hub-foot">${T.appName} v${CONFIG.APP_VERSION} · <b>완전 무료</b> · 사이트 가입 없음 · 진행은 내 기기에만 저장(설정에서 백업·기기 연동) · 한 번 연 뒤엔 오프라인도 OK</div>
    </div>`;
  },
  courseCard(c) {
    const bp = this.bookProgress(c);
    const body = `<div class="hc-body">${this.ring(bp.pct, 'var(--primary)')}<div class="hc-txt"><div class="hc-sub">📖 교과서 · 읽은 레슨 ${bp.read}/${bp.total}</div><div class="hc-sub muted">${c.bookNote ? esc(c.bookNote) : bp.read >= bp.total ? '다 읽었어요 🎉' : '채점 없이 읽고 내 컴퓨터에서 만들어 보기'}</div></div></div>`;
    const glyph = { python: 'Py', algo: 'Al', 'terminal-git': '>_', sql: 'SQL', web: '</>', api: '{ }', math: '∑', vim: 'Vi', github: 'Gh', linux: 'Lx', os: 'OS', asm: 'As', cs: 'CS', llm: 'AI' }[c.id] || (c.name || '?').slice(0, 1); const inner = `<div class="hc-head"><span class="hc-glyph" aria-hidden="true">${esc(glyph)}</span><span class="hc-name">${esc(c.name)}</span></div><div class="hc-desc muted small">${esc(c.desc)}${c.hubLabel ? ` · ${esc(c.hubLabel)}` : ''}</div>${body}`;
    return c.ready ? `<a class="card hc ready" href="${this.courseUrl(c)}" style="--hc:var(--primary)">${inner}</a>` : `<div class="card hc soon">${inner}</div>`;
  },
};
window.addEventListener('DOMContentLoaded', () => {
  Store.load('python');
  UI.applyTheme(); Sync.load(); Offline.register('sw.js');
  Hub.render();
  if (Sync.on) { Sync.hook = () => Hub.render(); Sync.syncNow().then(ch => { if (ch) Hub.render(); }); }
});
