// core/ui-views-book.js — 「교과서」 모드 (v2.9.0, 사용자 결정 2026-11-06)
// 코스 폴더에 book.js 가 있고 전역 BOOK 이 정의돼 있으면 켜진다(지금은 파이썬만). 다른 코스는 이 파일을 불러오지 않는다.
//   사용자 말: 「학습은 repeat 만 있고 완강해도 혼자 create 는 못 할 것 같다 · 메인은 파이썬 설치와 VS Code 실행법 · 챕터는 문법 설명과 예제(문장으로 된 문제)만 ·
//              문제와 그에 필요한 문법을 나열 · 어차피 나만 쓸 건데 억지로 붙잡을 필요 없다」
//   → 문제·채점·타자 연습·복습·XP·잠금은 화면에서 숨긴다(콘텐츠는 content.js 에 그대로). 실행은 사용자의 VS Code 에서.
// BOOK = { setup: { title, pages:[{title, html}] }, tasks: { 레슨id: [{ title, text, needs:[[이름, '레슨id/쪽'], ...], io?:[{input, output}], pid?, answer? }] } }
//   pid 가 있으면 그 문제의 첫 테스트를 입력 예·출력 예로, solution 을 예시 답으로 쓴다(정답 검증은 run_solutions 가 이미 함).
(function () {
  if (typeof BOOK === 'undefined') return;
  if (/[?&]classic\b/.test(location.search)) return; // 예전 문제집 화면(회귀 테스트·비교용): courses/python/index.html?classic=1
  document.documentElement.classList.add('book-mode');
  Game.showGame = () => false; // XP·레벨·스트릭·콤보·뱃지 팝업 없음
  if (typeof Py !== 'undefined') Py.start = () => {}; // 브라우저 실행 안 함 — 파이썬 엔진(수십 MB)도 안 받음
  if (typeof Onboarding !== 'undefined') Onboarding.start = async () => { Store.data.onboarded = true; Store.save(); }; // 닉네임·하루 목표 묻기 없음
  const SETUP_ID = 'SETUP';
  const chName = (ch) => ((CHAPTERS || []).find(c => c.ch === ch) || {}).name || '';
  const lessonsOf = (ch) => LESSONS.filter(l => l.ch === ch && !l.mock);
  // 「필요한 문법」 = [실제 문법(코드), '레슨/쪽', 설명] — v2.9.2 사용자 「분명히 필요 문법을 넣으라고 했다」(별명 대신 실제 코드)
  const pageLink = (ref) => { const [lid, pg] = String(ref).split('/'); return { lid, pg: +pg || 0 }; };
  const tasksOf = (l) => {
    const own = (BOOK.tasks || {})[l.id] || [];
    return own.map(t => { const p = t.pid ? Content.problem(t.pid) : null; const tests = p ? (p.tests || []) : []; const io = t.io || (p && p.project ? tests.filter(c => !c.files && !c.inputGen && c.output !== '__COMPUTED__').filter((c, i, ok) => ok.findIndex(d => d.stage === c.stage) === i).slice(0, 4) : tests[0] ? [tests[0]] : []); /* 실전 프로젝트는 명령(단계)마다 하나씩 */ const up = p && p.files && p.files.upload; return { ...t, text: t.text === '@prompt' && p ? String(p.prompt).replace(/<p>📎[\s\S]*?<\/p>/g, '') : t.text, io, answer: t.answer || (p && p.solution) || '', given: t.given && p ? (t.given === true ? p.starter : t.given) : '', prep: up && up.sample ? { name: up.name, text: up.sample } : (t.prep || null) }; });
  };
  // 본문 속 「▶ 실행해 보기」 같은 이 앱 버튼 안내는 VS Code 기준으로
  const bookText = (html) => String(html || '')
    .replace(/<b>▶?\s*실행해 보기<\/b>/g, '<b>VS Code 에서 실행</b>').replace(/▶\s*실행해 보세요/g, 'VS Code 에서 실행해 보세요').replace(/아래 예제를\s*(?:<b>)?▶?\s*실행(?:<\/b>)?해 보세요/g, '아래 예제를 VS Code 에 붙여 실행해 보세요')
    .replace(/<b>한 줄씩 보기<\/b>/g, '한 줄씩 따라가 보기');
  const codeBox = (code, label) => `<div class="bk-code"><div class="bk-code-h"><span>${esc(label || '예제 코드')}</span><button class="btn xs bk-copy" data-code="${esc(code)}">📋 복사</button></div><pre class="code">${esc(code)}</pre></div>`;
  const bindCopy = (root) => $$('.bk-copy', root).forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.code); UI.toast('📋 복사했어요. VS Code 의 .py 파일에 붙여 넣고 실행해 보세요'); } catch (e) { UI.toast('복사가 막혀 있어요. 코드를 길게 눌러 선택해 복사하세요'); } });

  // ---------- 홈: 시작하기(설치·VS Code) + 챕터·레슨 목록 ----------
  Views.home = (root) => {
    const d = Store.data; const readOf = (id) => (d.lessons[id] || {}).read;
    const setup = BOOK.setup;
    const chs = (CHAPTERS || []).map(c => c.ch).filter(ch => lessonsOf(ch).length);
    root.innerHTML = `<div class="page bk-home">
      <div class="bk-hero"><div class="lp-kicker">🐍 파이썬 교과서</div><h1 class="lp-h">읽고, VS Code 에서 직접 만들어 보기</h1>
        <p class="muted">레슨은 문법 설명이에요. 각 레슨 끝 「만들어 보기」에 문장으로 된 문제와 그 문제에 필요한 문법이 있어요. 채점·점수·잠금은 없어요 — 필요한 곳부터 펴 보면 돼요.</p></div>
      <div class="card bk-setup"><div class="bk-setup-h"><span class="bk-setup-ic">🛠</span><div><b>${esc(setup.title)}</b><div class="muted small">처음 한 번만 하면 돼요</div></div></div>
        <ol class="bk-steps">${setup.pages.map((p, i) => `<li><button class="bk-step" data-sp="${i}"><span class="bk-step-n">${i + 1}</span><span class="bk-step-t">${esc(p.title)}</span>${readOf(SETUP_ID + '_' + i) ? '<span class="bk-done">✓</span>' : ''}<span class="bk-go">›</span></button></li>`).join('')}</ol></div>
      ${chs.map(ch => `<section class="bk-ch"><h2 class="bk-ch-h"><span class="bk-ch-n">${String(ch).padStart(2, '0')}</span>${esc(chName(ch))}</h2><div class="bk-list">${lessonsOf(ch).map(l => { const tk = tasksOf(l).length; return `<button class="bk-l ${l.boss ? 'boss' : ''}" data-l="${l.id}"><span class="bk-l-n">${l.boss ? '🛠' : esc(String(l.n ?? ''))}</span><span class="bk-l-t">${esc(l.boss ? l.title.replace(/^보스:\s*/, '만들어 보기: ') : l.title)}<span class="bk-l-sub muted">${l.boss ? '챕터를 묶는 큰 문제' : `설명 ${(l.pages || []).length}쪽${tk ? ` · 만들어 보기 ${tk}개` : ''}`}</span></span>${readOf(l.id) ? '<span class="bk-done">✓</span>' : ''}<span class="bk-go">›</span></button>`; }).join('')}</div></section>`).join('')}
    </div>`;
    $$('[data-sp]', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: SETUP_ID, page: +b.dataset.sp }));
    $$('[data-l]', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: b.dataset.l, page: 0 })); /* v2.9.1 사용자 「왜 1번부터가 아니라 이상한 곳부터」: 예전 문제집 화면이 남긴 쪽 번호(요약 쪽 = 마지막+1)로 열리던 것 — 목차에서는 늘 1쪽부터 */
  };

  // ---------- 레슨: 설명 쪽들 + 마지막 「만들어 보기」 ----------
  Views.lesson = (root, { lessonId, page = 0 }) => {
    const isSetup = lessonId === SETUP_ID;
    const l = isSetup ? { id: SETUP_ID, title: BOOK.setup.title, pages: BOOK.setup.pages, ch: null } : Content.lesson(lessonId);
    if (!l) { UI.go('home', {}, false); return; }
    UI.params.lessonTitle = l.title;
    const pages = (l.pages || []).map((pg, i) => { const key = `${l.id}/${i}`; const tt = (BOOK.titles || {})[key]; const o = (BOOK.pages || {})[key]; if (!o) return tt ? { ...pg, title: tt } : pg; let html = o.html || pg.html; (o.rep || []).forEach(([a, b]) => { html = html.split(a).join(b); }); return { ...pg, title: o.title || tt || pg.title, html }; }); const tasks = isSetup ? [] : tasksOf(l); const hasMake = tasks.length > 0;
    const total = pages.length + (hasMake ? 1 : 0);
    if (!total) { UI.go('home', {}, false); return; }
    let cur = clamp(page, 0, total - 1);
    const d = Store.data;
    const render = () => {
      const isMake = hasMake && cur === pages.length; const pg = pages[cur];
      if (isSetup) { d.lessons[SETUP_ID + '_' + cur] = { read: 1 }; } else { d.lessons[l.id] = d.lessons[l.id] || {}; d.lessons[l.id].page = cur; if (cur === total - 1) d.lessons[l.id].read = 1; }
      Store.save({ silent: true });
      const kicker = isSetup ? '🛠 시작하기' : l.boss ? `🛠 ${esc(chName(l.ch))} · 만들어 보기` : `LESSON ${String(l.n ?? '').padStart(2, '0')} <span class="muted">· ${esc(chName(l.ch))}</span>`;
      const tabs = `<div class="bk-tabs">${pages.map((p, i) => `<button class="bk-tab ${i === cur ? 'on' : ''}" data-pg="${i}" title="${esc(p.title)}">${i + 1}</button>`).join('')}${hasMake ? `<button class="bk-tab make ${cur === pages.length ? 'on' : ''}" data-pg="${pages.length}">🛠 만들어 보기</button>` : ''}</div>`;
      let body;
      if (isMake) {
        body = `<h1 class="lp-h">🛠 만들어 보기</h1><p class="muted">VS Code 에서 빈 파일(예: <code>${esc(l.n != null ? 'l' + String(l.n).padStart(2, '0') : (l.id || '').toLowerCase())}_1.py</code>)을 만들고 직접 짜 보세요. 막히면 「필요한 문법」을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.</p>
          <ol class="bk-tasks">${tasks.map((t, i) => `<li class="card bk-task"><div class="bk-task-h"><span class="bk-task-n">${i + 1}</span><b>${esc(t.title)}</b></div><div class="bk-task-p lp-html">${UI.terms(t.text)}</div>
            ${t.given ? codeBox(t.given, '이 코드를 복사해서 고쳐 보세요') : ''}${t.prep ? `<div class="bk-prep"><div class="lbl">준비 파일 — .py 파일과 같은 폴더에 <code>${esc(t.prep.name)}</code> 을 만들고 아래 내용을 붙여 넣으세요</div>${codeBox(t.prep.text, t.prep.name)}</div>` : ''}${/sys\.stdin\.read/.test(t.answer || '') ? '<div class="muted small bk-tip">💡 「끝까지」 읽는 프로그램이에요. VS Code 터미널에 입력을 다 붙여 넣은 뒤 <b>Windows: <kbd>Ctrl</kbd>+<kbd>Z</kbd> → <kbd>Enter</kbd></b>, Mac: <kbd>Ctrl</kbd>+<kbd>D</kbd> 를 누르면 입력이 끝나요.</div>' : ''}
            ${t.io && t.io.length ? `<div class="bk-io">${t.io.map(c => `${c.input != null && String(c.input).length ? `<div><div class="lbl">입력 예 <span class="muted small">(터미널에 치는 값)</span></div><pre class="code">${esc(c.input)}</pre></div>` : ''}<div><div class="lbl">출력 예</div><pre class="code">${esc(c.output)}</pre></div>`).join('')}</div>` : ''}
            ${t.needs && t.needs.length ? `<div class="bk-needs"><span class="lbl">필요한 문법</span>${t.needs.map(([syn, ref, desc]) => { const { lid, pg: pn } = pageLink(ref); const ll = lid === SETUP_ID ? { n: '', title: BOOK.setup.title } : Content.lesson(lid); const where = lid === SETUP_ID ? '시작하기' : ll ? `레슨 ${ll.n ?? ''}` : ''; return `<button class="bk-need" data-nl="${esc(lid)}" data-np="${pn}" title="${ll ? esc(`${where} ${ll.title}`) : ''}"><code class="bk-syn">${esc(syn)}</code><span class="bk-need-d">${esc(desc || '')}</span><span class="bk-need-w muted small">${esc(where)} ›</span></button>`; }).join('')}</div>` : ''}
            ${t.answer ? `<details class="bk-ans"><summary>예시 답 보기</summary>${codeBox(t.answer, '예시 답')}</details>` : ''}</li>`).join('')}</ol>`;
      } else {
        body = `<h1 class="lp-h">${esc(pg.title)}</h1><div class="lp-body lp-html">${UI.terms(bookText(pg.html))}</div>${pg.example && pg.example.code ? codeBox(pg.example.code, '예제 코드 — 복사해서 VS Code 에서 실행해 보세요') : ''}`;
      }
      root.innerHTML = `<div class="page bk-lesson"><div class="bk-crumb"><button class="lnk" id="bkHome">☰ 목차</button><span class="muted">/</span><span>${kicker}</span></div>
        <div class="lp-kicker">${isSetup ? '' : esc(l.boss ? '' : l.title)}</div>${tabs}<article class="bk-art">${body}</article>
        <div class="bk-nav"><button class="btn" id="bkPrev" ${cur === 0 ? 'disabled' : ''}>← 이전</button><button class="btn accent" id="bkNext">${cur < total - 1 ? (hasMake && cur === pages.length - 1 ? '🛠 만들어 보기 →' : '다음 →') : '☰ 목차로'}</button></div></div>`;
      UI.bindTerms(root); bindCopy(root);
      $('#bkHome').onclick = () => UI.go('home');
      $$('.bk-tab', root).forEach(b => b.onclick = () => { cur = +b.dataset.pg; render(); window.scrollTo(0, 0); });
      $('#bkPrev').onclick = () => { if (cur > 0) { cur--; render(); window.scrollTo(0, 0); } };
      $('#bkNext').onclick = () => { if (cur < total - 1) { cur++; render(); window.scrollTo(0, 0); } else UI.go('home'); };
      $$('.bk-need', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: b.dataset.nl, page: +b.dataset.np }));
    };
    render();
  };
  // 문제 화면 주소(#problem/ID, 예전 링크)는 그 레슨의 「만들어 보기」로
  Views.problem = (root, { pid, lessonId }) => { const p = Content.problem(pid); const lid = lessonId || (p && p.lesson); const l = lid && Content.lesson(lid); UI.go('lesson', { lessonId: lid || 'L0', page: l ? (l.pages || []).length : 0 }, false); };
  ['review', 'typing', 'challenge', 'timeattack', 'checkup', 'mock', 'reviewMore', 'weakness'].forEach(v => { if (Views[v]) Views[v] = () => UI.go('home', {}, false); });
})();
