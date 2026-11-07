// core/ui-views-book.js — 「교과서」 모드 (v2.9.0, 사용자 결정 2026-11-06)
// 코스 폴더에 book.js 가 있고 전역 BOOK 이 정의돼 있으면 켜진다(파이썬 v2.9.0 · 터미널·Git v2.10.0). 코스마다 다른 글귀는 BOOK.meta, 빈 레슨 쪽은 BOOK.lessonPages. book.js 가 없는 코스는 이 파일을 불러오지 않는다.
//   사용자 말: 「학습은 repeat 만 있고 완강해도 혼자 create 는 못 할 것 같다 · 메인은 파이썬 설치와 VS Code 실행법 · 챕터는 문법 설명과 예제(문장으로 된 문제)만 ·
//              문제와 그에 필요한 문법을 나열 · 어차피 나만 쓸 건데 억지로 붙잡을 필요 없다」
//   → 문제·채점·타자 연습·복습·XP·잠금은 v2.19.0(N13)에 archive/classic/ 로 옮겼다. 실행은 사용자의 VS Code 에서.
// BOOK = { setup: { title, pages:[{title, html}] }, tasks: { 레슨id: [{ title, text, needs:[[이름, '레슨id/쪽'], ...], io?:[{input, output}], pid?, answer? }] } }
//   pid 가 있으면 그 문제의 첫 테스트를 입력 예·출력 예로, solution 을 예시 답으로 쓴다(정답 검증은 run_solutions 가 이미 함).
(function () {
  if (typeof BOOK === 'undefined') return;
  // v2.19.0 N13: 예전 문제집 화면(?classic=1)은 archive/classic/ 로 옮겨서 교과서 화면만 있어요
  document.documentElement.classList.add('book-mode');
  // 브라우저 실행 안 함 — 파이썬 엔진(수십 MB)도 안 받음. v2.15.0 알고리즘 교과서(BOOK.meta.viz): 레슨 예제의 「👀 그림으로 보기」·「👣 한 줄씩 보기」를 누를 때만 받음
  const pyRealStart = typeof Py !== 'undefined' ? Py.start.bind(Py) : null; // 파이썬 엔진(수십 MB)은 알고리즘 레슨의 「👀 그림으로 보기」·「👣 한 줄씩 보기」를 누를 때만 받음
  const SETUP_ID = 'SETUP';
  // 코스마다 다른 글귀(v2.10.0: 터미널·Git 도 교과서) — book.js 의 BOOK.meta 가 덮어씀. 기본값 = 파이썬
  const M = Object.assign({
    kicker: '🐍 파이썬 교과서', hero: '읽고, VS Code 에서 직접 만들어 보기',
    heroP: '레슨은 문법 설명이에요. 각 레슨 끝 「만들어 보기」에 문장으로 된 문제와 그 문제에 필요한 문법이 있어요. 채점·점수·잠금은 없어요 — 필요한 곳부터 펴 보면 돼요.',
    dexName: '파이썬 문법 도감', dexShort: '문법 도감', dexWhat: '배운 문법', dexHint: '검색해서 바로 찾기(실전은 오픈북)',
    dexExamples: '<code>split</code>, <code>정렬</code>, <code>딕셔너리</code>, <code>파일</code>', dexPlaceholder: '🔍 문법 찾기 — split, 정렬, 딕셔너리, open …', dexAlt: '「자르기」 대신 <code>split</code>',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/library/index.html" target="_blank" rel="noopener">docs.python.org/ko</a>',
    dexRun: '예제는 📋 복사해서 VS Code 에서 바로 돌려 볼 수 있고', builtinsName: '자주 쓰는 내장 함수', builtinsSub: 'import 없이 바로', builtinsChip: '🧰 내장 함수',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣고 실행해 보세요', exampleLabel: '예제 코드 — 복사해서 VS Code 에서 실행해 보세요',
    makeIntro: 'VS Code 에서 빈 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요.', fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에',
    setupLabel: '먼저 이 명령을 붙여 넣어 연습 폴더를 만드세요', answerLabel: '예시 답',
    makeTail: '막히면 「필요한 문법」을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.', needsLabel: '필요한 문법',
    checkLabel: '확인 코드', startLabel: '시작 코드 — 복사해서 「# 여기에」 를 채우세요', outLabel: '출력 예', inLabel: '입력 예 <span class="muted small">(터미널에 치는 값)</span>', homeNote: '',
  }, BOOK.meta || {});
  // v2.22.4 N15 B4: 교과서엔 「보스」 가 없음 — 챕터 끝 레슨 이름은 「만들어 보기: 과제」, 돌아가기 글귀도 같은 이름으로
  const lTitle = (l) => !l ? '' : l.boss ? String(l.title).replace(/^보스:\s*/, '만들어 보기: ') : l.title;
  const lName = (l) => l.boss ? `「${lTitle(l)}」` : `레슨 ${l.n ?? ''} 「${l.title}」`;
  const chName = (ch) => ((CHAPTERS || []).find(c => c.ch === ch) || {}).name || '';
  const lessonsOf = (ch) => LESSONS.filter(l => l.ch === ch && (!l.mock || ((BOOK.tasks || {})[l.id] || []).length)); // 모의고사는 교과서가 문제를 채웠을 때만(v2.15.0 알고리즘: 코딩테스트 15문제)
  // 「필요한 문법」 = [실제 문법(코드), '레슨/쪽', 설명] — v2.9.2 사용자 「분명히 필요 문법을 넣으라고 했다」(별명 대신 실제 코드)
  const pageLink = (ref) => { const [lid, pg] = String(ref).split('/'); return { lid, pg: +pg || 0 }; };
  const tasksOf = (l) => ((BOOK.tasks || {})[l.id] || []).map(t => BookDerive.task(t, t.pid ? Content.problem(t.pid) : null, BOOK)); // v2.15.0: 모양 바꾸기는 core/book-derive.js(검사 tools/check_book.mjs 와 같은 함수)
  // 본문 속 「▶ 실행해 보기」 같은 이 앱 버튼 안내는 VS Code 기준으로
  const bookText = (html) => String(html || '')
    .replace(/<b>▶?\s*실행해 보기<\/b>/g, '<b>VS Code 에서 실행</b>').replace(/▶\s*실행해 보세요/g, 'VS Code 에서 실행해 보세요').replace(/아래 예제를\s*(?:<b>)?▶?\s*실행(?:<\/b>)?해 보세요/g, '아래 예제를 VS Code 에 붙여 실행해 보세요')
    .replace(/<b>한 줄씩 보기<\/b>/g, '한 줄씩 따라가 보기')
    .replace(/<details class="lp-more"><summary>([^<]*)<\/summary>/g, '<div class="bk-more"><div class="bk-more-h">$1</div>').replace(/<\/details>/g, '</div>'); // v2.9.4 사용자 「문법을 숨길 필요 없잖아, 실전은 오픈북」: 접힌 더 알아보기를 펼쳐서
  // prereq(v2.12.1, 사용자 「나중에 할 거니까 레슨 6번은 설정을 해야 한다고 강조해」): BOOK.meta.prereq = { lessons:[…], chapters:[…], ref:'T6/2', title, html }
  //   → 그 레슨의 1쪽·만들어 보기 맨 위와 그 챕터 목차 위에 경고 상자 + 「설정 쪽 보기」 단추(돌아오기 있음)
  //   v2.12.2 사용자 「필수 사항은 강조하고」 — 여러 개(배열)도 됨: 코스마다 「먼저 할 것」 이 여럿(설치 · 설정 파일 · 다른 교과서의 설치)
  // v2.13.0 SQL 교과서: 결과가 「열 | 열」 표면 진짜 표로(DB Browser 결과 칸처럼). meta.outTable 일 때만
  const resBox = (out, raw) => { const ls = String(out).split('\n'); if (!M.outTable || raw) return `<pre class="code">${esc(out)}</pre>`; const cell = (r, tag) => `<tr>${r.split(' | ').map(x => `<${tag}${x === 'NULL' ? ' class="null"' : ''}>${esc(x)}</${tag}>`).join('')}</tr>`; return `<div class="bk-res-w"><table class="bk-res"><thead>${cell(ls[0], 'th')}</thead><tbody>${ls.slice(1).map(r => cell(r, 'td')).join('')}</tbody></table><div class="muted small">${ls.length - 1}행</div></div>`; };
  const PRES = [].concat(M.prereq || []);
  const preBox = (list) => list.map(p => `<div class="bk-warn bk-prereq"><b>⚠ ${p.title}</b><div>${p.html}</div>${p.ref ? `<button class="btn small bk-prereq-go" data-ref="${p.ref}">${p.btn || '설정하는 쪽 보기'} ›</button>` : ''}</div>`).join('');
  const preFor = (lid) => PRES.filter(p => (p.lessons || []).includes(lid));
  const preForCh = (ch) => PRES.filter(p => (p.chapters || []).length && ch === Math.min(...p.chapters));
  const bindPre = (root, back) => $$('.bk-prereq-go', root).forEach(b => b.onclick = () => { const [pl, pp] = b.dataset.ref.split('/'); UI.go('lesson', { lessonId: pl, page: +pp, back }); });
  // lessonPages(v2.10.0): 레슨 쪽 통째로(content.js 에서 아직 「준비 중」인 레슨을 교과서가 채울 때)
  const basePages = (l) => (BOOK.lessonPages || {})[l.id] || l.pages || [];
  const ready = (l) => !l.draft || !!(BOOK.lessonPages || {})[l.id] || !!((BOOK.tasks || {})[l.id] || []).length;
  // v2.22.3 검수: 만들어 보기(마지막 쪽) 끝에서 목차 대신 다음 레슨으로 — 목차 순서(챕터 → 레슨)대로, 준비 중은 건너뜀
  const nextLesson = (id) => { const flat = (CHAPTERS || []).map(c => c.ch).flatMap(ch => lessonsOf(ch)).filter(ready); if (id === SETUP_ID) return flat[0] || null; const i = flat.findIndex(x => x.id === id); return i >= 0 ? flat[i + 1] || null : null; };
  const bookPages = (l) => basePages(l).map((pg, i) => { const key = `${l.id}/${i}`; const tt = (BOOK.titles || {})[key]; const o = (BOOK.pages || {})[key]; if (!o) return tt ? { ...pg, title: tt } : pg; let html = o.html || pg.html; (o.rep || []).forEach(([a, b]) => { html = html.split(a).join(b); }); return { ...pg, title: o.title || tt || pg.title, html, example: o.example || pg.example }; });
  const codeLbl = (label) => { const [a, ...b] = String(label || '예제 코드').split(' — '); return b.length ? `<b class="bk-lbl-a">${esc(a)}</b><span class="bk-lbl-more"><span class="bk-lbl-dash"> — </span>${esc(b.join(' — '))}</span>` : esc(a); }; // v2.22.4 N15 A5: 폰에서는 「 — 」 앞(예: 예제 코드)이 첫 줄, 뒤 설명은 다음 줄(음절 중간에서 안 끊기게)
  const codeBox = (code, label) => `<div class="bk-code"><div class="bk-code-h"><span>${codeLbl(label)}</span><button class="btn xs bk-copy" data-code="${esc(code)}">📋 복사</button></div><pre class="code">${esc(code)}</pre></div>`;
  // v2.22.4 N15 A4·A6: 짧은 글 속 코드는 한 덩어리로(줄 중간에서 안 끊김) · 옆으로 더 있는 코드 상자는 오른쪽 끝을 흐리게(끝까지 밀면 사라짐)
  const polish = (root) => { $$('.bk-art code, .bk-dex code, .bk-task code', root).forEach(c => { if (!c.closest('pre') && c.textContent.length <= 20) c.classList.add('nw'); });
    $$('pre.code', root).forEach(pre => { const upd = () => pre.classList.toggle('more-r', pre.scrollLeft + pre.clientWidth < pre.scrollWidth - 4); upd(); if (!pre._mr) { pre._mr = 1; pre.addEventListener('scroll', upd, { passive: true }); } }); };
  const bindCopy = (root) => $$('.bk-copy', root).forEach(b => b.onclick = async () => { try { await navigator.clipboard.writeText(b.dataset.code); UI.toast(M.copyToast); } catch (e) { UI.toast('복사가 막혀 있어요. 코드를 길게 눌러 선택해 복사하세요'); } });

  // ---------- 홈: 시작하기(설치·VS Code) + 챕터·레슨 목록 ----------
  Views.home = (root) => {
    const d = Store.data; const readOf = (id) => (d.lessons[id] || {}).read;
    const setup = BOOK.setup;
    const chs = (CHAPTERS || []).map(c => c.ch).filter(ch => lessonsOf(ch).length);
    root.innerHTML = `<div class="page bk-home">
      <div class="bk-hero"><div class="lp-kicker">${M.kicker}</div><h1 class="lp-h">${M.hero}</h1>
        <p class="muted">${M.heroP}</p></div>
      <button class="card bk-dex-card" id="bkDex"><span class="bk-setup-ic">📚</span><span class="bk-dex-t"><b>${M.dexName}</b><span class="muted small">${M.dexWhat} ${dexEntries().length}개${(BOOK.builtins || []).length ? ` + ${M.builtinsName} ${(BOOK.builtins || []).length}개` : ''}를 한곳에 — ${M.dexHint}</span></span><span class="bk-go">›</span></button>
      <div class="card bk-setup"><div class="bk-setup-h"><span class="bk-setup-ic">🛠</span><div><b>${esc(setup.title)}</b><div class="muted small">처음 한 번만 하면 돼요</div></div></div>
        <ol class="bk-steps">${setup.pages.map((p, i) => `<li><button class="bk-step" data-sp="${i}"><span class="bk-step-n">${i + 1}</span><span class="bk-step-t">${esc(p.title)}</span>${readOf(SETUP_ID + '_' + i) ? '<span class="bk-done">✓</span>' : ''}<span class="bk-go">›</span></button></li>`).join('')}</ol></div>
      ${chs.map(ch => `<section class="bk-ch"><h2 class="bk-ch-h"><span class="bk-ch-n">${String(ch).padStart(2, '0')}</span>${esc(chName(ch))}</h2>${preBox(preForCh(ch))}<div class="bk-list">${lessonsOf(ch).map(l => { const tk = tasksOf(l).length; if (!ready(l)) return `<div class="bk-l soon"><span class="bk-l-n">${l.boss ? '🛠' : esc(String(l.n ?? ''))}</span><span class="bk-l-t">${esc(lTitle(l))}<span class="bk-l-sub muted">준비 중 — 다음 업데이트에 채워져요</span></span></div>`; return `<button class="bk-l ${l.boss ? 'boss' : ''}" data-l="${l.id}"><span class="bk-l-n">${l.boss ? '🛠' : esc(String(l.n ?? ''))}</span><span class="bk-l-t">${esc(lTitle(l))}<span class="bk-l-sub muted">${l.boss ? `챕터를 묶는 큰 문제${tasksOf(l).filter(t => /^🏠/.test(t.title)).length ? ` · 🏠 생활 프로그램 ${tasksOf(l).filter(t => /^🏠/.test(t.title)).length}개` : ''}` : `설명 ${bookPages(l).length}쪽${tk ? ` · 만들어 보기 ${tk}개` : ''}`}</span></span>${readOf(l.id) ? '<span class="bk-done">✓</span>' : ''}<span class="bk-go">›</span></button>`; }).join('')}</div></section>`).join('')}
    </div>`;
    $('#bkDex').onclick = () => UI.go('dogam');
    bindPre(root, { label: '☰ 목차로 돌아가기', view: 'home', params: {} });
    $$('[data-sp]', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: SETUP_ID, page: +b.dataset.sp }));
    $$('[data-l]', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: b.dataset.l, page: 0 })); /* v2.9.1 사용자 「왜 1번부터가 아니라 이상한 곳부터」: 예전 문제집 화면이 남긴 쪽 번호(요약 쪽 = 마지막+1)로 열리던 것 — 목차에서는 늘 1쪽부터 */
  };

  // ---------- 레슨: 설명 쪽들 + 마지막 「만들어 보기」 ----------
  // 돌아가기(v2.9.4 사용자 「갈 수 있게만 하지 말고 다시 올 수 있게 해」): 다른 화면으로 보내는 버튼은 params.back = { label, view, params } 을 같이 넘기고, 받는 화면은 맨 위에 「← label」 을 그린다
  // v2.15.0 알고리즘 교과서(BOOK.meta.viz): 예제 코드 + 입력 예 + 「👀 그림으로 보기」(정렬·탐색 애니메이션) · 「👣 한 줄씩 보기」(줄마다 변수 표)
  //   예전 문제집 화면의 시각화를 그대로 씀(core/visualize.js Viz.runAndShow · core/ui-views-main.js TracePanel). 누를 때만 파이썬 엔진을 받아 이 예제 코드를 브라우저에서 돌림
  //   코드 칸은 줄마다 나눠서 지금 실행 중인 줄을 칠함(예전 화면의 에디터 대신 — setTraceLine 만 있으면 됨)
  const exCode = (ex) => ex && (ex.code || ex.shell || ex.sql);
  const vizOn = (ex) => !!(M.viz && pyRealStart && ex && ex.code && (ex.visualize || ex.trace));
  const exampleBox = (pg) => { const ex = pg.example; const code = exCode(ex); if (!code) return ''; const v = vizOn(ex);
    const box = v ? `<div class="bk-code"><div class="bk-code-h"><span>${codeLbl(ex.label || M.exampleLabel)}</span><button class="btn xs bk-copy" data-code="${esc(code)}">📋 복사</button></div><pre class="code bk-lined" id="bkExCode">${code.split('\n').map((ln, i) => `<span class="bk-ln" data-ln="${i + 1}">${esc(ln)}\n</span>`).join('')}</pre></div>` : codeBox(code, ex.label || M.exampleLabel);
    const inp = ex.stdin ? `<div class="bk-io"><div><div class="lbl">${M.inLabel}</div><pre class="code">${esc(String(ex.stdin).replace(/\n$/, ''))}</pre></div></div>` : '';
    if (!v) return box + inp;
    return box + inp + `<div class="card bk-viz"><div class="bk-viz-bar">${ex.visualize ? '<button class="btn accent" id="bkViz">👀 그림으로 보기</button>' : ''}${ex.trace ? '<button class="btn" id="bkTrace">👣 한 줄씩 보기</button>' : ''}</div><div class="muted small bk-viz-note" id="bkVizNote">${ex.visualize ? '이 예제 코드를 돌리며 변수가 바뀌는 모습을 그림으로 보여 줘요' : '이 예제 코드를 한 줄씩 돌리며 변수 값을 표로 보여 줘요'}${Py.ready ? '' : ' · 처음 한 번은 파이썬 엔진을 받아요(몇 초 걸려요 — 이 자리에 진행률이 나와요)'}</div><div id="bkVizHost" class="bk-viz-host"></div></div>`; };
  const bindViz = (root, pg) => { const ex = pg && pg.example; if (!vizOn(ex)) return; const host = $('#bkVizHost', root); const pre = $('#bkExCode', root);
    const ed = { setTraceLine(n) { pre.classList.add('lim'); $$('.bk-ln', pre).forEach(s => s.classList.toggle('on', +s.dataset.ln === n)); const on = n && $(`.bk-ln[data-ln="${n}"]`, pre); if (on && pre.scrollHeight > pre.clientHeight) pre.scrollTop = Math.max(0, on.offsetTop - pre.clientHeight / 2); } };
    const prep = () => { if (!Py.ready) { const show = () => { if (!Py.ready && host.isConnected && !host.querySelector('.viz, .trace')) host.innerHTML = `<div class="muted">${Py.failed ? '⚠ 파이썬 엔진을 받지 못했어요 — 인터넷 연결을 확인하고 다시 눌러 보세요' : `파이썬 엔진을 받는 중… ${Py.progress || 0}% (처음 한 번만, 다음부터는 바로 돼요)`}</div>`; }; if (!prep.hooked) { Py.onState(show); prep.hooked = true; } Py.start(); show(); } }; /* v2.19.0 N13: 예전 오른쪽 아래 진행 표시(Loader)는 보관 — 진행률을 그림 자리에 */
    const vb = $('#bkViz', root); if (vb) vb.onclick = async () => { prep(); await Viz.runAndShow(host, { code: ex.code, input: ex.stdin || '', spec: ex.visualize, editor: ed, title: pg.title }); };
    const tb = $('#bkTrace', root); if (tb) tb.onclick = async () => { prep(); const r = await Py.run({ code: ex.code, input: ex.stdin || '', trace: true }); if (!host.isConnected) return; if (r.trace && r.trace.length) { TracePanel.show(host, r, ed); } else host.innerHTML = `<div class="errbox"><b>${esc(r.ename || '오류')}</b>: ${esc(r.emsg || '')}</div>`; };
  };
  const backBar = (back) => back ? `<button class="btn bk-back" id="bkBack">← ${esc(back.label)}</button>` : '';
  const bindBack = (back) => { const b = $('#bkBack'); if (b && back) b.onclick = () => UI.go(back.view, back.params || {}); };
  // v2.15.3 사용자 「방향키 ← 누르면 이전, → 누르면 다음 · 만들어 보기에서 목차로 가는 건 키를 넣지 말고」: 레슨·시작하기 쪽에서 ← → 로 쪽 넘기기
  //   입력칸·그림 플레이어의 슬라이더(input)·창(modal)·Ctrl/Alt/⌘ 조합일 때는 그대로 둠. 리스너는 하나만(화면이 바뀌면 bkKeys.root 가 화면에서 빠져 아무것도 안 함)
  let bkKeys = null;
  document.addEventListener('keydown', (e) => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; if (!bkKeys || UI.view !== 'lesson' || !bkKeys.root.isConnected || !bkKeys.root.querySelector('.bk-lesson')) return;
    const t = e.target || {}; if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName || '') || t.isContentEditable || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || document.querySelector('.modal-ov')) return;
    e.preventDefault(); (e.key === 'ArrowLeft' ? bkKeys.prev : bkKeys.next)(); });
  Views.lesson = (root, { lessonId, page = 0, back = null, task = null }) => {
    const isSetup = lessonId === SETUP_ID;
    const l = isSetup ? { id: SETUP_ID, title: BOOK.setup.title, pages: BOOK.setup.pages, ch: null } : Content.lesson(lessonId);
    if (!l || (!isSetup && !ready(l))) { UI.go('home', {}, false); return; } // 아직 안 채운 레슨(주소로 들어와도)은 목차로
    UI.params.lessonTitle = l.title;
    const pages = bookPages(l); const tasks = isSetup ? [] : tasksOf(l); const hasMake = tasks.length > 0;
    const total = pages.length + (hasMake ? 1 : 0);
    if (!total) { UI.go('home', {}, false); return; }
    let cur = clamp(page, 0, total - 1);
    const d = Store.data;
    const render = () => {
      const isMake = hasMake && cur === pages.length; const pg = pages[cur];
      const rk = isSetup ? SETUP_ID + '_' + cur : l.id; const wasRead = !!(d.lessons[rk] || {}).read;
      if (isSetup) { d.lessons[rk] = { read: 1 }; } else { d.lessons[l.id] = d.lessons[l.id] || {}; d.lessons[l.id].page = cur; if (cur === total - 1) d.lessons[l.id].read = 1; }
      Store.save({ silent: wasRead || !(d.lessons[rk] || {}).read }); // v2.19.0: 레슨을 처음 다 읽었을 때만 기기 연동으로 올림(쪽 넘김은 이 기기에만)
      const nxt = nextLesson(l.id); const kicker = isSetup ? '🛠 시작하기' : l.boss ? `🛠 ${esc(chName(l.ch))} · 만들어 보기` : `LESSON ${String(l.n ?? '').padStart(2, '0')} <span class="muted">· ${esc(chName(l.ch))}</span>`;
      const tabs = `<div class="bk-tabs">${pages.map((p, i) => `<button class="bk-tab ${i === cur ? 'on' : ''}" data-pg="${i}" title="${esc(p.title)}">${i + 1}</button>`).join('')}${hasMake ? `<button class="bk-tab make ${cur === pages.length ? 'on' : ''}" data-pg="${pages.length}">🛠 만들어 보기</button>` : ''}</div>`;
      let body;
      if (isMake) {
        body = `<h1 class="lp-h">🛠 ${l.boss ? esc(lTitle(l)) : '만들어 보기'}</h1><p class="muted">${M.makeIntro.replace('{file}', esc((l.n != null ? 'l' + String(l.n).padStart(2, '0') : (l.id || '').toLowerCase()) + '_1' + M.fileExt))} ${M.makeTail}</p>${preBox(preFor(l.id))}
          <ol class="bk-tasks">${tasks.map((t, i) => `<li class="card bk-task" data-ti="${i}"><div class="bk-task-h"><span class="bk-task-n">${i + 1}</span><b>${esc(t.title)}</b></div><div class="bk-task-p lp-html">${UI.terms(t.text)}</div>
            ${t.setup ? codeBox(t.setup, M.setupLabel) : ''}${t.start ? codeBox(t.start, M.startLabel) : ''}${t.given ? codeBox(t.given, '이 코드를 복사해서 고쳐 보세요') : ''}${t.prep ? `<div class="bk-prep"><div class="lbl">${M.prepLabel} <code>${esc(t.prep.name)}</code> 을 만들고 아래 내용을 붙여 넣으세요</div>${codeBox(t.prep.text, t.prep.name)}</div>` : ''}${/sys\.stdin\.read/.test(t.answer || '') ? '<div class="muted small bk-tip">💡 「끝까지」 읽는 프로그램이에요. VS Code 터미널에 입력을 다 붙여 넣은 뒤 <b>Windows: <kbd>Ctrl</kbd>+<kbd>Z</kbd> → <kbd>Enter</kbd></b>, Mac: <kbd>Ctrl</kbd>+<kbd>D</kbd> 를 누르면 입력이 끝나요.</div>' : ''}
            ${t.checks && t.checks.length ? `<div class="bk-checks"><div class="lbl">${M.checksLabel || '브라우저에서 확인할 것'}</div><ul>${t.checks.map(c => `<li>☐ ${esc(c.text)}${c.viewport ? ` <span class="muted small">(폰 ${c.viewport}px 폭에서)</span>` : ''}</li>`).join('')}</ul></div>` : ''}<!-- v2.14.0 웹 교과서: 확인 목록(검사는 tools/run_web_solutions.py) -->
            ${t.check ? codeBox(t.check, M.checkLabel) : ''}${t.io && t.io.length ? `<div class="bk-io bk-ios${t.io.length > 1 ? ' multi' : ''}">${t.io.map((c, ci) => `<div class="bk-io-case">${t.io.length > 1 ? `<div class="bk-io-n">예 ${ci + 1}</div>` : ''}${c.input != null && String(c.input).length ? `<div><div class="lbl">${M.inLabel}</div><pre class="code">${esc(c.input)}</pre></div>` : ''}<div><div class="lbl">${M.outLabel}</div>${resBox(c.output, t.py || t.runPy)}</div></div>`).join('')}</div>${t.py ? `<div class="bk-io">${t.py.input ? `<div><div class="lbl">입력</div><pre class="code">${esc(t.py.input)}</pre></div>` : ''}<div><div class="lbl">${M.pyLabel || '실행 결과'}</div><pre class="code">${esc(t.py.output)}</pre></div></div>` : ''}${M.homeNote && t.io.some(c => /\/c\/Users\/me/.test(c.output)) ? `<div class="muted small bk-tip">💡 ${M.homeNote}</div>` : ''}` : ''}
            ${t.needs && t.needs.length ? `<div class="bk-needs"><span class="lbl">${M.needsLabel}</span>${t.needs.map(([syn, ref, desc]) => { const { lid, pg: pn } = pageLink(ref); const ll = lid === SETUP_ID ? { n: '', title: BOOK.setup.title } : Content.lesson(lid); const where = lid === SETUP_ID ? '시작하기' : ll ? `레슨 ${ll.n ?? ''}` : ''; return `<button class="bk-need" data-ti="${i}" data-nl="${esc(lid)}" data-np="${pn}" title="${ll ? esc(`${where} ${ll.title}`) : ''}"><code class="bk-syn">${esc(syn)}</code><span class="bk-need-d">${esc(desc || '')}</span><span class="bk-need-w muted small">${esc(where)} ›</span></button>`; }).join('')}</div>` : ''}
            ${t.answer ? `<details class="bk-ans"><summary><span class="bk-ans-m" aria-hidden="true"></span>${M.answerLabel} 보기</summary>${codeBox(t.answer, M.answerLabel)}</details>` : ''}</li>`).join('')}</ol>`;
      } else {
        // v2.18.0 수학 교과서(N12): 쓰임 한 컷(scene) · 만지는 그림(figure + 슬라이더, core/figure.js) · 식(KaTeX) — MathUI 가 있는 코스(수학)에서만
        const mathOn = typeof MathUI !== 'undefined' && typeof Fig !== 'undefined';
        const preLinks = cur === 0 && M.prereqLinks && (l.prereq || []).length ? `<div class="bk-prelinks"><span class="lbl">먼저 보면 좋은 레슨</span>${l.prereq.map(id => Content.lesson(id)).filter(Boolean).map(pl => `<button class="lnk bk-prelink" data-pl="${pl.id}">레슨 ${esc(String(pl.n ?? ''))} ${esc(pl.title)} ›</button>`).join('')}</div>` : '';
        body = (cur === 0 ? preBox(preFor(l.id)) : '') + preLinks + `<h1 class="lp-h">${esc(pg.title)}</h1>${pg.scene ? `<div class="lp-scene">${UI.terms(pg.scene)}</div>` : ''}${mathOn && pg.figure ? '<div class="lp-fig bk-fig" id="bkFig"></div>' : ''}<div class="lp-body lp-html">${UI.terms(bookText(pg.html))}</div>${mathOn && pg.formula ? '<div class="lp-formula bk-formula"><div class="lbl">∑ 식</div><div id="bkFormula"></div></div>' : ''}${exampleBox(pg)}`;
      }
      root.innerHTML = `<div class="page bk-lesson">${backBar(back)}<div class="bk-crumb"><button class="lnk" id="bkHome">☰ 목차</button><span class="muted">/</span><span>${kicker}</span><span class="grow"></span><button class="lnk" id="bkDexL">📚 ${M.dexShort}</button></div>
        <div class="lp-kicker">${isSetup ? '' : esc(l.boss ? '' : l.title)}</div>${tabs}<article class="bk-art">${body}</article>
        <div class="bk-nav"><button class="btn" id="bkPrev" title="이전 쪽 (키보드 ←)" ${cur === 0 ? 'disabled' : ''}>← 이전</button><button class="btn accent" id="bkNext" ${cur < total - 1 ? 'title="다음 쪽 (키보드 →)"' : ''}>${cur < total - 1 ? (hasMake && cur === pages.length - 1 ? '🛠 만들어 보기 →' : '다음 →') : (nxt ? '다음 레슨 →' : '☰ 목차로')}</button></div>${cur === total - 1 && nxt ? `<p class="bk-next-hint muted small">다음: ${nxt.boss ? '🛠 ' : `레슨 ${esc(String(nxt.n ?? ''))} `}「${esc(lTitle(nxt))}」 <span class="nw">· <button class="lnk" id="bkToc">☰ 목차로</button></span></p>` : ''}</div>`;
      UI.bindTerms(root); bindCopy(root); polish(root); if (!isMake) bindViz(root, pg);
      if (!isMake && $('#bkFig', root)) MathUI.lessonFigure($('#bkFig', root), l, pg, null); if (!isMake && $('#bkFormula', root)) MathUI.formula($('#bkFormula', root), pg.formula);
      $$('.bk-prelink', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: b.dataset.pl, page: 0, back: { label: `${lName(l)}로 돌아가기`, view: 'lesson', params: { lessonId: l.id, page: cur, back } } }));
      bindBack(back); bindPre(root, { label: isMake ? (l.boss ? `${lName(l)}로 돌아가기` : `「${l.title}」 만들어 보기로 돌아가기`) : `${lName(l)}로 돌아가기`, view: 'lesson', params: { lessonId: l.id, page: cur, back } }); $('#bkHome').onclick = () => UI.go('home'); $('#bkDexL').onclick = () => UI.go('dogam', { back: { label: isSetup ? '시작하기로 돌아가기' : `${lName(l)}로 돌아가기`, view: 'lesson', params: { lessonId: l.id, page: cur, back } } });
      $$('.bk-tab', root).forEach(b => b.onclick = () => { cur = +b.dataset.pg; render(); window.scrollTo(0, 0); });
      $('#bkPrev').onclick = () => { if (cur > 0) { cur--; render(); window.scrollTo(0, 0); } };
      $('#bkNext').onclick = () => { if (cur < total - 1) { cur++; render(); window.scrollTo(0, 0); } else if (nxt) { UI.go('lesson', { lessonId: nxt.id, page: 0 }); window.scrollTo(0, 0); } else UI.go('home'); }; if ($('#bkToc')) $('#bkToc').onclick = () => UI.go('home');
      bkKeys = { root, prev: () => { if (cur > 0) { cur--; render(); window.scrollTo(0, 0); } }, next: () => { if (cur < total - 1) { cur++; render(); window.scrollTo(0, 0); } } }; // ← → 키(아래 전역 처리) — 마지막 쪽(만들어 보기)에서 → 는 목차로 가지 않음
      $$('.bk-need', root).forEach(b => b.onclick = () => UI.go('lesson', { lessonId: b.dataset.nl, page: +b.dataset.np, back: { label: `만들어 보기 ${+b.dataset.ti + 1}번 문제로 돌아가기`, view: 'lesson', params: { lessonId: l.id, page: pages.length, task: +b.dataset.ti, back } } }));
      if (isMake && task != null) { const el = $(`.bk-task[data-ti="${task}"]`, root); if (el) setTimeout(() => { el.scrollIntoView({ block: 'start' }); el.classList.add('bk-flash'); }, 30); task = null; }
    };
    render();
  };
  // ---------- 파이썬 문법 도감 (v2.9.4 사용자 「문법을 숨길 필요 없잖아, 어차피 실전은 전부 오픈북이니까. 파이썬 문법 도감 만들어」) ----------
  // 항목 = 코드가 있는 레슨 쪽 하나. 이름 = 쪽 제목(BOOK.titles 적용), 설명 = 본문 첫 문단, 예제 = 본문 첫 코드 상자(없으면 예제 코드). 레슨을 고치면 도감도 같이 바뀜.
  const deHtml = (h) => String(h || '').replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').replace(/\[\[레슨:([A-Za-z0-9_]+)\]\]/g, (m, id) => { const l = Content.lessonMap && Content.lessonMap[id]; return l ? `레슨 ${l.n}` : '레슨'; }).replace(/\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g, '$1').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#92;/g, '\\').replace(/&#91;/g, '[').replace(/&#93;/g, ']').replace(/&amp;/g, '&');
  let _dex = null;
  const dexEntries = () => {
    if (_dex) return _dex; _dex = [];
    LESSONS.filter(l => !l.boss && !l.mock && ready(l) && basePages(l).length).forEach(l => bookPages(l).forEach((pg, i) => {
      const pre = (String(pg.html).match(/<pre>([\s\S]*?)<\/pre>/) || [])[1]; const code = pre != null ? deHtml(pre) : (pg.example && (pg.example.code || pg.example.shell || pg.example.sql)) || ''; if (!code.trim()) return;
      const p1 = (String(pg.html).match(/<p>([\s\S]*?)<\/p>/) || [])[1] || ''; let desc = deHtml(p1).replace(/\s+/g, ' ').trim(); const cut = desc.search(/[.?!요](?:\s|$)/); if (cut > 20 && cut < 160) desc = desc.slice(0, cut + 1); else if (desc.length > 160) desc = desc.slice(0, 158) + '…';
      _dex.push({ lid: l.id, pg: i, ch: l.ch, n: l.n, lesson: l.title, name: pg.title, desc, code, hay: (pg.title + ' ' + desc + ' ' + code + ' ' + l.title).toLowerCase() });
    }));
    return _dex;
  };
  const dexBuiltins = () => (BOOK.builtins || []).map(b => ({ ...b, hay: (b.name + ' ' + b.desc + ' ' + (b.code || '') + ' 내장 함수').toLowerCase() }));
  Views.dogam = (root, { back = null, restore = false } = {}) => {
    const all = dexEntries(); const bis = dexBuiltins(); const chs = [...new Set(all.map(e => e.ch))];
    const st = UI._dex = UI._dex || { q: '', ch: 'all', y: 0 }; if (!restore) st.y = 0;
    root.innerHTML = `<div class="page bk-dex">${backBar(back)}<div class="bk-crumb"><button class="lnk" id="bkHome">☰ 목차</button><span class="muted">/</span><span>📚 ${M.dexName}</span></div>
      <h1 class="lp-h">📚 ${M.dexName}</h1><p class="muted">${M.dexWhat} ${all.length}개${bis.length ? ` + ${M.builtinsName} ${bis.length}개` : ''}. 코드나 한국어로 검색하세요(예: ${M.dexExamples}). ${M.dexRun}, 「레슨 ›」 을 누르면 자세한 설명으로 가요.</p>
      <div class="bk-dex-bar"><input id="dexQ" type="search" placeholder="${esc(M.dexPlaceholder)}" value="${esc(st.q)}" autocomplete="off" aria-label="문법 찾기"><div class="bk-dex-chips"><button class="chip-btn ${st.ch === 'all' ? 'on' : ''}" data-ch="all">전체</button>${bis.length ? `<button class="chip-btn ${st.ch === 'builtin' ? 'on' : ''}" data-ch="builtin">${M.builtinsChip}</button>` : ''}${chs.map(c => `<button class="chip-btn ${String(st.ch) === String(c) ? 'on' : ''}" data-ch="${c}">${esc(chName(c))}</button>`).join('')}</div><div class="muted small" id="dexN"></div></div>
      <div id="dexList"></div></div>`;
    const draw = () => {
      const terms = st.q.toLowerCase().split(/\s+/).filter(Boolean);
      const hit = st.ch === 'builtin' ? [] : all.filter(e => (st.ch === 'all' || String(e.ch) === String(st.ch)) && terms.every(t => e.hay.includes(t)));
      const bhit = (st.ch === 'all' || st.ch === 'builtin') ? bis.filter(e => terms.every(t => e.hay.includes(t))) : [];
      $('#dexN').textContent = terms.length || st.ch !== 'all' ? `${hit.length + bhit.length}개 찾음` : '';
      let last = null; let html = '';
      if (bhit.length) { html += `<h2 class="bk-dex-l"><span class="bk-ch-n">🧰</span>${M.builtinsName} <span class="muted small">· ${M.builtinsSub}</span></h2>`; bhit.forEach(e => { const [bl, bp] = String(e.ref || '').split('/'); const bL = bl && Content.lesson(bl);
        html += `<article class="card bk-dex-e bi"><div class="bk-dex-h"><h3><code class="bk-syn">${esc(e.name)}</code></h3>${bL ? `<button class="lnk bk-dex-go" data-l="${bl}" data-p="${+bp || 0}">레슨 ${esc(String(bL.n ?? ''))} · ${(+bp || 0) + 1}쪽 ›</button>` : ''}</div><p class="bk-dex-d">${esc(e.desc)}</p>${e.code ? codeBox(e.code, '예제') : '' /* v2.22.1: 단축키·메뉴처럼 붙여 넣을 게 없는 항목은 📋 상자 없이 */}${e.output != null ? `<div class="bk-io">${e.input ? `<div><div class="lbl">입력</div><pre class="code">${esc(e.input)}</pre></div>` : ''}<div><div class="lbl">결과</div><pre class="code">${esc(e.output)}</pre></div></div>` : ''}</article>`; }); }
      hit.forEach(e => { if (e.lid !== last) { html += `<h2 class="bk-dex-l"><span class="bk-ch-n">${esc(String(e.n ?? ''))}</span>${esc(e.lesson)} <span class="muted small">· ${esc(chName(e.ch))}</span></h2>`; last = e.lid; }
        html += `<article class="card bk-dex-e"><div class="bk-dex-h"><h3>${esc(e.name)}</h3><button class="lnk bk-dex-go" data-l="${e.lid}" data-p="${e.pg}">레슨 ${esc(String(e.n ?? ''))} · ${e.pg + 1}쪽 ›</button></div>${e.desc ? `<p class="bk-dex-d">${esc(e.desc)}</p>` : ''}${codeBox(e.code, '예제')}</article>`; });
      $('#dexList').innerHTML = html || `<div class="card muted">「${esc(st.q)}」 는 도감에 없어요. 다른 말로 찾아보거나(예: ${M.dexAlt}), ${M.dexDocs} 를 찾아보세요.</div>`;
      bindCopy(root); polish(root); $$('.bk-dex-go', root).forEach(b => b.onclick = () => { st.y = window.scrollY; UI.go('lesson', { lessonId: b.dataset.l, page: +b.dataset.p, back: { label: '📚 도감으로 돌아가기' + (st.q ? ` (「${st.q}」 검색)` : ''), view: 'dogam', params: { back, restore: true } } }); });
    };
    let t = null; $('#dexQ').oninput = (ev) => { clearTimeout(t); t = setTimeout(() => { st.q = ev.target.value.trim(); draw(); }, 120); };
    $$('[data-ch]', root).forEach(b => b.onclick = () => { st.ch = b.dataset.ch; $$('[data-ch]', root).forEach(x => x.classList.toggle('on', x === b)); draw(); });
    $('#bkHome').onclick = () => UI.go('home'); bindBack(back);
    draw(); if (restore && st.y) setTimeout(() => window.scrollTo(0, st.y), 30);
  };
  { const rt = UI.renderTopbar.bind(UI); UI.renderTopbar = () => { rt(); const tt = $('.tb-title'); if (!tt) return; if (UI.view === 'dogam') tt.textContent = M.dexName; else if (UI.view === 'lesson') { const ll = Content.lesson((UI.params || {}).lessonId); if (ll && ll.boss) tt.textContent = '🛠 만들어 보기'; else if ((UI.params || {}).lessonId === 'SETUP') tt.textContent = '🛠 시작하기'; } }; /* 교과서엔 「보스」 가 없음 */ }
  { const hf = UI.hashFor.bind(UI); UI.hashFor = (view, params) => view === 'dogam' ? '#dogam' : hf(view, params); }
  // 문제 화면 주소(#problem/ID, 예전 링크)는 그 레슨의 「만들어 보기」로
  Views.problem = (root, { pid, lessonId }) => { const p = Content.problem(pid); const lid = lessonId || (p && p.lesson); const l = lid && Content.lesson(lid); UI.go('lesson', { lessonId: lid || 'L0', page: l ? bookPages(l).length : 0 }, false); };
})();
