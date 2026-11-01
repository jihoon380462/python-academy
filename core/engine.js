// core/engine.js — 콘텐츠 인덱스(Content)·채점(Grader). 언어별 실행은 runners/ 뒤에 있음
// ---------- 콘텐츠 인덱스 & 자체 검사 ----------
const Content = {
  lessonMap: {}, problemMap: {}, byLesson: {},
  init() {
    LESSONS.forEach(l => { this.lessonMap[l.id] = l; this.byLesson[l.id] = []; if (l.terms && typeof GLOSSARY !== 'undefined') for (const [k, v] of Object.entries(l.terms)) if (!(k in GLOSSARY)) GLOSSARY[k] = v; }); // 레슨이 정의한 용어는 공용 용어집에 합류(코스별 용어)
    PROBLEMS.forEach(p => { this.problemMap[p.id] = p; (this.byLesson[p.lesson] = this.byLesson[p.lesson] || []).push(p); });
    // 자체 검사
    const seen = new Set(); const warn = (m) => console.warn('[콘텐츠 검사] ' + m);
    PROBLEMS.forEach(p => {
      if (seen.has(p.id)) warn(`id 중복: ${p.id}`); seen.add(p.id);
      if (!this.lessonMap[p.lesson]) warn(`없는 레슨 참조: ${p.id} → ${p.lesson}`);
      if (['block','code'].includes(p.type) && !(p.tests && p.tests.length)) warn(`테스트 없는 실행형 문제: ${p.id}`);
      if (p.type === 'bug' && !(p.bug && p.bug.tests && p.bug.tests.length)) warn(`테스트 없는 버그 문제: ${p.id}`);
      if (!(p.hints && p.hints.length >= 3)) warn(`힌트 3개 미만: ${p.id}`);
      if (!(p.tags && p.tags.length)) warn(`개념 태그 없음: ${p.id}`);
      if (p.boss && this.tests(p).length < 5) warn(`보스 테스트 5개 미만: ${p.id}`);
    });
    LESSONS.forEach(l => { if (!l.boss && l.id !== LESSONS[0].id && this.byLesson[l.id].length < 4) warn(`문제 4개 미만 레슨: ${l.id}`); });
  },
  lesson(id) { return this.lessonMap[id]; },
  problem(id) { return this.problemMap[id]; },
  problemsOf(lid) { return this.byLesson[lid] || []; },
  tests(p) { return p.type === 'bug' ? (p.bug.tests || []) : (p.tests || []); },
  lessonsOfChapter(ch) { return LESSONS.filter(l => l.ch === ch); },
  orderedLessons() { return LESSONS.slice(); },
  blocksUpTo(lid) { // 누적 툴박스
    const out = ['text_print','py_print_many']; const idx = LESSONS.findIndex(l => l.id === lid);
    for (let i = 0; i <= idx; i++) (LESSONS[i].blocks || []).forEach(b => { if (!out.includes(b)) out.push(b); });
    return out;
  },
  // {{식}} 치환. params 없으면 vary 기본값(첫 값)
  defaultParams(p) { const out = {}; if (p.vary) for (const k in p.vary) out[k] = p.vary[k][0]; return out; },
  randomParams(p) { const out = {}; if (p.vary) for (const k in p.vary) { const r = p.vary[k]; out[k] = (r.length === 2 && typeof r[0] === 'number' && typeof r[1] === 'number' && r[1] > r[0] + 1) ? r[0] + Math.floor(Math.random() * (r[1] - r[0] + 1)) : r[Math.floor(Math.random() * r.length)]; } return out; },
  // {{식}} 계산기: 숫자·파라미터 이름·+ - * / % 괄호만 지원 (eval 금지 환경에서도 동작)
  evalExpr(src, params) {
    const toks = src.match(/\d+(?:\.\d+)?|[A-Za-z_]\w*|[-+*/%()]/g) || []; let i = 0;
    const peek = () => toks[i], next = () => toks[i++];
    const atom = () => { const t = next(); if (t === '(') { const v = expr(); next(); return v; } if (t === '-') return -atom(); if (/^\d/.test(t)) return Number(t); if (t in params) return typeof params[t] === 'number' ? params[t] : String(params[t]); throw new Error('bad token ' + t); };
    const term = () => { let v = atom(); while (['*', '/', '%'].includes(peek())) { const op = next(), r = atom(); v = op === '*' ? v * r : op === '/' ? v / r : v % r; } return v; };
    const expr = () => { let v = term(); while (['+', '-'].includes(peek())) { const op = next(), r = term(); v = op === '+' ? v + r : v - r; } return v; };
    const v = expr(); if (i < toks.length) throw new Error('trailing'); return v;
  },
  // 블록 문제 따라하기 가이드. 손으로 쓴 guide가 있으면 그것, 없으면 정답 코드 줄에서 자동 생성
  guideFor(p, mode = 'block') {
    if (mode === 'text') return this.textGuideFor(p);
    if (mode === 'parsons') return this.parsonsGuideFor(p);
    const hand = p.guide || (typeof GUIDES !== 'undefined' && GUIDES[p.id]);
    if (hand) { const params = p.params || {}; const sub = (x) => typeof x !== 'string' ? x : x.replace(/\{\{([^}]+)\}\}/g, (m, e) => { try { return String(this.evalExpr(e, params)); } catch (err) { return m; } }); return hand.map(g => ({ ...g, t: sub(g.t), c: Array.isArray(g.c) ? g.c.map(sub) : sub(g.c) })); }
    if (p.type !== 'block' || !p.solution) return null;
    const steps = []; const lines = p.solution.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]; const t = raw.trim(); if (!t) continue;
      const ind = raw.length - raw.trimStart().length; const inside = ind > 0 ? '위 블록의 <b>안쪽(ㄷ자 안)</b>에 ' : '';
      let txt = null, cat = null, m;
      if ((m = t.match(/^print\((.*)\)$/))) { txt = `${inside}<b>출력</b> 블록을 붙이고, 안쪽이 <code>${esc(m[1])}</code> 가 되게 만드세요.`; cat = '출력'; }
      else if ((m = t.match(/^(\w+) = int\(input\(\)\)$/))) { txt = `<b>변수</b> 메뉴에서 <b>변수 만들기…</b>로 <code>${m[1]}</code> 을 만들고, <b>${m[1]} = 0</b> 블록을 끌어온 뒤 0 자리에 <b>값·계산</b> 메뉴의 <b>숫자로 int( 입력 받기 )</b> 블록을 끼우세요.`; cat = '변수'; }
      else if ((m = t.match(/^(\w+) = input\(\)$/))) { txt = `변수 <code>${m[1]}</code> 을 만들고 <b>${m[1]} = 0</b> 블록의 0 자리에 <b>출력</b> 메뉴의 <b>입력 받기 input()</b> 블록을 끼우세요.`; cat = '변수'; }
      else if ((m = t.match(/^(\w+) \+= (.*)$/))) { txt = `${inside}<b>변수</b> 메뉴의 <b>${m[1]} += 1</b> 블록을 붙이세요 (값: <code>${esc(m[2])}</code>).`; cat = '변수'; }
      else if ((m = t.match(/^(\w+) = (.*)$/))) { txt = `<b>변수</b> 메뉴에서 <b>변수 만들기…</b>로 <code>${m[1]}</code> 을 만들고, <b>${m[1]} = 0</b> 블록을 끌어와 값을 <code>${esc(m[2])}</code> 로 바꾸세요.`; cat = '변수'; }
      else if ((m = t.match(/^for (\w+) in range\((.*)\):$/))) { txt = `${inside}<b>반복</b> 메뉴의 <b>i 를 1 부터 5 까지 반복</b> 블록을 붙이고 범위를 <code>range(${esc(m[2])})</code> 에 맞게 고치세요. (끝 숫자는 마지막으로 셀 숫자)`; cat = '반복'; }
      else if ((m = t.match(/^for (\w+) in (\w+):$/))) { txt = `${inside}<b>반복</b> 메뉴의 <b>… 의 각 항목 … 에 대해</b> 블록을 붙이고, 항목 이름을 <code>${m[1]}</code>, 리스트 자리에 <code>${m[2]}</code> 변수 블록을 끼우세요.`; cat = '반복'; }
      else if ((m = t.match(/^while (.*):$/))) { txt = `${inside}<b>반복</b> 메뉴의 <b>~인 동안 반복</b> 블록을 붙이고 조건을 <code>${esc(m[1])}</code> 로 만드세요.`; cat = '반복'; }
      else if ((m = t.match(/^if (.*):$/))) { txt = `${inside}<b>조건</b> 메뉴의 <b>만약</b> 블록을 붙이고, 옆 빈칸에 비교 블록으로 <code>${esc(m[1])}</code> 을 만드세요.`; cat = '조건'; }
      else if ((m = t.match(/^elif (.*):$/))) { txt = `만약 블록의 <b>⚙ 톱니바퀴</b>를 눌러 <b>아니고 만약</b>을 추가하고 조건을 <code>${esc(m[1])}</code> 로 만드세요.`; cat = '조건'; }
      else if (t === 'else:') { txt = `만약 블록의 <b>⚙ 톱니바퀴</b>를 눌러 <b>아니면</b>을 추가하세요.`; cat = '조건'; }
      else if ((m = t.match(/^def (\w+)\((.*)\):$/))) { txt = `<b>함수</b> 메뉴의 <b>함수 만들기</b> 블록을 끌어와 이름을 <code>${m[1]}</code> 로 바꾸세요.${m[2] ? ` (⚙로 매개변수 <code>${esc(m[2])}</code> 추가)` : ''}`; cat = '함수'; }
      else if ((m = t.match(/^return (.*)$/))) { txt = `함수 안에 <b>돌려주기 (return)</b> 블록을 넣고 값을 <code>${esc(m[1])}</code> 로.`; cat = '함수'; }
      else if ((m = t.match(/^(\w+)\((.*)\)$/))) { txt = `<b>함수</b> 메뉴에 생긴 <b>${m[1]}</b> 부르기 블록을 붙이세요.`; cat = '함수'; }
      else txt = `${inside}다음 코드가 되도록 블록을 붙이세요: <code>${esc(t)}</code>`;
      steps.push({ t: txt, c: t, cat, auto: true });
    }
    steps.push({ t: '다 만들었으면 <b>▶ 실행</b>으로 결과를 확인하고, <b>✔ 제출하기</b>를 누르세요!' });
    return steps;
  },
  // 텍스트(타자) 문제 따라하기 가이드: 정답 코드를 한 줄씩 "무슨 뜻인지 + 그대로 치면 되는 코드"로 풀어 준다. 초반 레슨(L0~L5)만.
  TEXT_GUIDE_LESSONS: null, // null = 모든 레슨 (v2.0.1부터). 특정 레슨만 켜려면 ['L0', ...]
  textGuideFor(p) {
    const hand = (typeof GUIDES_TEXT !== 'undefined' && GUIDES_TEXT[p.id]);
    if (hand) return hand;
    const sol = p.solution || (p.parsons && p.parsons.solution); if (!sol || (this.TEXT_GUIDE_LESSONS && !this.TEXT_GUIDE_LESSONS.includes(p.lesson))) return null;
    const steps = []; const lines = sol.split('\n'); let prevColon = false;
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i]; const t = raw.trim(); if (!t) continue;
      const ind = raw.length - raw.trimStart().length; const lvl = Math.round(ind / 4);
      let why = '', m;
      if ((m = t.match(/^print\((.*)\)$/))) why = `<b>print( )</b> 는 괄호 안의 것을 화면에 보여줘요.${/^["']/.test(m[1]) ? ' 글자는 <b>따옴표</b>로 감싸야 해요.' : /,/.test(m[1]) ? ' 쉼표로 나누면 띄어쓰기로 이어서 보여줘요.' : ' 변수나 계산 결과는 따옴표 <b>없이</b> 써요.'}`;
      else if ((m = t.match(/^(\w+) = int\(input\(\)\)$/))) why = `<b>input()</b> 으로 입력 한 줄을 받고, <b>int( )</b> 로 숫자로 바꿔서 변수 <code>${m[1]}</code> 에 담아요. (입력은 글자로 들어오니까 숫자로 바꿔야 계산돼요)`;
      else if ((m = t.match(/^(\w+) = input\(\)$/))) why = `<b>input()</b> 으로 입력 한 줄을 받아 변수 <code>${m[1]}</code> 에 담아요.`;
      else if ((m = t.match(/^(\w+) \+= (.*)$/))) why = `<code>${m[1]} += ${esc(m[2])}</code> 는 "<code>${m[1]}</code> 에 ${esc(m[2])} 을 더해서 다시 담아라"예요. (<code>${m[1]} = ${m[1]} + ${esc(m[2])}</code> 와 같아요)`;
      else if ((m = t.match(/^(\w+) = (\w+) \+ (.*)$/)) && m[1] === m[2]) why = `<code>${m[1]}</code> 에 ${esc(m[3])} 을 더해서 <code>${m[1]}</code> 에 다시 담아요. 오른쪽을 먼저 계산하고 왼쪽 상자에 넣는다고 생각하세요.`;
      else if ((m = t.match(/^(\w+) = (.*)$/))) why = `<b>=</b> 는 "같다"가 아니라 <b>"오른쪽 값을 왼쪽 이름에 담아라"</b>예요. 변수 <code>${m[1]}</code> 에 <code>${esc(m[2])}</code> 을 담아요.`;
      else if ((m = t.match(/^for (\w+) in range\((.*)\):$/))) why = `<b>for</b> 반복문이에요. <code>${m[1]}</code> 이 <code>range(${esc(m[2])})</code> 의 숫자를 하나씩 받으며 아래 들여쓴 줄을 반복해요. 줄 끝 <b>콜론(:)</b>을 꼭 붙이세요.`;
      else if ((m = t.match(/^for (\w+) in (\w+):$/))) why = `<code>${m[2]}</code> 안의 항목을 하나씩 <code>${m[1]}</code> 에 담아 가며 반복해요. 줄 끝에 <b>콜론(:)</b>!`;
      else if ((m = t.match(/^while (.*):$/))) why = `<b>while</b> 은 조건 <code>${esc(m[1])}</code> 이 참인 동안 아래 줄을 계속 반복해요. 줄 끝에 <b>콜론(:)</b>!`;
      else if ((m = t.match(/^if (.*):$/))) why = `<b>if</b> 는 "만약 <code>${esc(m[1])}</code> 이면"이에요. 참일 때만 아래 들여쓴 줄이 실행돼요. 줄 끝에 <b>콜론(:)</b>!`;
      else if ((m = t.match(/^elif (.*):$/))) why = `<b>elif</b> 는 "아니고 만약 <code>${esc(m[1])}</code> 이면". 위 if가 거짓일 때만 검사해요. if 와 <b>같은 위치</b>(들여쓰기 없이)에 쓰고 끝에 콜론(:)!`;
      else if (t === 'else:') why = `<b>else</b> 는 "위 조건이 전부 아니면". if 와 <b>같은 위치</b>에 쓰고 끝에 <b>콜론(:)</b>!`;
      else if ((m = t.match(/^def (\w+)\((.*)\):$/))) why = `<b>def</b> 로 함수 <code>${m[1]}</code> 을 만들어요.${m[2] ? ` 괄호 안 <code>${esc(m[2])}</code> 은 받을 값의 이름이에요.` : ''} 줄 끝에 <b>콜론(:)</b>!`;
      else if ((m = t.match(/^return (.*)$/))) why = `<b>return</b> 은 함수의 결과를 돌려줘요. 함수 안이라서 들여쓰기가 있어요.`;
      else if ((m = t.match(/^import (\w+)$/))) why = `<b>import</b> 로 <code>${m[1]}</code> 도구 상자를 가져와요. 맨 위에 한 번만 쓰면 돼요.`;
      else if ((m = t.match(/^turtle\.(\w+)\((.*)\)$/))) why = `거북이에게 명령해요: <code>${m[1]}</code>${{ forward: '= 앞으로 가기', left: '= 왼쪽으로 돌기', right: '= 오른쪽으로 돌기', backward: '= 뒤로 가기', circle: '= 원 그리기', penup: '= 펜 들기', pendown: '= 펜 내리기', color: '= 색 바꾸기' }[m[1]] || ''}${m[2] ? ` (괄호 안 <code>${esc(m[2])}</code> 만큼)` : ''}.`;
      else if ((m = t.match(/^(\w+)\.append\((.*)\)$/))) why = `리스트 <code>${m[1]}</code> 의 맨 끝에 <code>${esc(m[2])}</code> 을 추가해요.`;
      else if (t === 'break') why = `<b>break</b> 는 "지금 당장 반복에서 빠져나가라"예요. 반복문 안에서만 써요.`;
      else if (t === 'continue') why = `<b>continue</b> 는 "이번 회차는 여기서 그만두고 다음 회차로"예요.`;
      else if (t === 'try:') why = `<b>try</b> 는 "일단 해 봐"예요. 아래 들여쓴 줄에서 에러가 나면 멈추지 않고 <b>except</b> 로 넘어가요. 줄 끝에 <b>콜론(:)</b>!`;
      else if ((m = t.match(/^except(?: (\w+))?(?: as (\w+))?:$/))) why = `<b>except</b> 는 "에러가 나면 이렇게 해"예요.${m[1] ? ` <code>${m[1]}</code> 은 잡을 에러의 이름이에요.` : ''} try 와 <b>같은 위치</b>에 쓰고 끝에 콜론(:)!`;
      else if ((m = t.match(/^from (\w+) import (\w+)$/))) why = `<code>${m[1]}</code> 도구 상자에서 <code>${m[2]}</code> 하나만 꺼내 와요.`;
      else if ((m = t.match(/^class (\w+)(?:\((\w+)\))?:$/))) why = `<b>class</b> 로 <code>${m[1]}</code> 이라는 <b>설계도</b>를 만들어요.${m[2] ? ` 괄호 안 <code>${m[2]}</code> 의 기능을 물려받아요(상속).` : ''} 줄 끝에 <b>콜론(:)</b>! 클래스 이름은 대문자로 시작해요.`;
      else if ((m = t.match(/^def __init__\((.*)\):$/))) why = `<b>__init__</b> 은 "만들어질 때 자동으로 실행되는" 특별한 함수예요. 첫 번째 <code>self</code> 는 "나 자신"이고, 뒤의 값들은 만들 때 받아요. 클래스 안이라 들여쓰기가 있어요.`;
      else if ((m = t.match(/^def (\w+)\(self(?:, (.*))?\):$/))) why = `클래스 안의 함수(메서드) <code>${m[1]}</code> 이에요. 첫 번째 <code>self</code> 는 항상 "나 자신"이고 부를 때는 안 넣어요.${m[2] ? ` 뒤의 <code>${esc(m[2])}</code> 은 받을 값.` : ''} 끝에 콜론(:)!`;
      else if ((m = t.match(/^self\.(\w+) = (.*)$/))) why = `<code>self.${m[1]}</code> 은 "나의 ${m[1]}" 상자예요. 거기에 <code>${esc(m[2])}</code> 을 담아 둬요. 그래야 다른 메서드에서도 꺼내 쓸 수 있어요.`;
      else if ((m = t.match(/^self\.(\w+) ([+-])= (.*)$/))) why = `"나의 ${m[1]}" 값에서 <code>${esc(m[3])}</code> 만큼 ${m[2] === '+' ? '더해요' : '빼요'}.`;
      else if ((m = t.match(/^(\w+)\.(\w+) ([+-])= (.*)$/))) why = `<code>${m[1]}</code> 의 <code>${m[2]}</code> 값에서 <code>${esc(m[4])}</code> 만큼 ${m[3] === '+' ? '더해요' : '빼요'}.`;
      else if ((m = t.match(/^(\w+)\.(\w+) = (.*)$/))) why = `<code>${m[1]}</code> 의 <code>${m[2]}</code> 에 <code>${esc(m[3])}</code> 을 담아요.`;
      else if ((m = t.match(/^(\w+(?:, \w+)+) = input\(\)\.split\(\)$/))) why = `입력 한 줄을 <b>띄어쓰기로 잘라</b>(<code>split()</code>) 여러 변수 <code>${m[1]}</code> 에 한꺼번에 나눠 담아요. (전부 글자 상태예요)`;
      else if ((m = t.match(/^(\w+(?:, \w+)+) = (.*)$/))) why = `오른쪽 값들을 순서대로 <code>${m[1]}</code> 에 한꺼번에 나눠 담아요.`;
      else if ((m = t.match(/^with open\(([^,]+), *"?(\w)"?.*\) as (\w+):$/))) why = `파일 ${esc(m[1])} 을 ${m[2] === 'w' ? '<b>쓰기</b>' : m[2] === 'a' ? '<b>이어 쓰기</b>' : '<b>읽기</b>'} 모드로 열어 <code>${m[3]}</code> 이라고 불러요. <b>with</b> 를 쓰면 다 쓴 뒤 파일이 자동으로 닫혀요. 끝에 콜론(:)!`;
      else if ((m = t.match(/^(\w+)\.write\((.*)\)$/))) why = `파일 <code>${m[1]}</code> 에 <code>${esc(m[2])}</code> 을 써요. 줄을 바꾸려면 <code>"\\n"</code> 을 붙여야 해요.`;
      else if ((m = t.match(/^for (\w+), (\w+) in (\w+)\.items\(\):$/))) why = `딕셔너리 <code>${m[3]}</code> 의 <b>키와 값을 한 쌍씩</b> 꺼내 <code>${m[1]}</code>, <code>${m[2]}</code> 에 담으며 반복해요. 끝에 콜론(:)!`;
      else if ((m = t.match(/^for (\w+), (\w+) in (.+):$/))) why = `<code>${esc(m[3])}</code> 의 항목(두 개짜리 묶음)을 <code>${m[1]}</code>, <code>${m[2]}</code> 로 나눠 받으며 반복해요. 끝에 콜론(:)!`;
      else if ((m = t.match(/^for (\w+) in (.+):$/))) why = `<code>${esc(m[2])}</code> 의 항목을 하나씩 <code>${m[1]}</code> 에 담아 가며 반복해요. 끝에 콜론(:)!`;
      else if ((m = t.match(/^(\w+)\[(.+)\] = (\w+)\.get\(\2, 0\) \+ (.*)$/))) why = `딕셔너리에서 <code>${esc(m[2])}</code> 의 값을 꺼내되 <b>없으면 0</b>(<code>get(키, 0)</code>)으로 보고, 거기에 ${esc(m[4])} 을 더해 다시 저장해요. "개수 세기"의 정석이에요.`;
      else if ((m = t.match(/^(\w+)\[(.+)\] = (.*)$/))) why = `딕셔너리 <code>${m[1]}</code> 에 키 <code>${esc(m[2])}</code> → 값 <code>${esc(m[3])}</code> 을 넣어요. (키가 이미 있으면 값이 바뀌어요)`;
      else if ((m = t.match(/^random\.seed\((.*)\)$/))) why = `<code>random.seed(…)</code> 는 랜덤의 <b>씨앗</b>을 심어요. 같은 씨앗이면 "랜덤"도 매번 같은 순서로 나와서, 채점이 결과를 맞춰 볼 수 있어요.`;
      else if ((m = t.match(/^(\w+)\.sort\((.*)\)$/))) why = `리스트 <code>${m[1]}</code> 을 제자리에서 정렬해요.${/key=lambda/.test(m[2]) ? ' <code>key=lambda …</code> 는 "무엇을 기준으로 줄 세울지"예요.' : ''}${/reverse=True/.test(m[2]) ? ' <code>reverse=True</code> 는 큰 것부터.' : ''}`;
      else if ((m = t.match(/^(\w+)\.(\w+)\((.*)\)$/))) why = `<code>${m[1]}</code> 에게 <code>${m[2]}</code> 를 시켜요(메서드 호출).${m[3] ? ` 괄호 안 <code>${esc(m[3])}</code> 을 넘겨요.` : ''}`;
      else if ((m = t.match(/^(\w+)\((.*)\)$/))) why = `만들어 둔 함수 <code>${m[1]}</code> 을 불러요(실행해요).`;
      else why = `이 줄을 그대로 치세요.`;
      let indTxt = '';
      if (lvl > 0) indTxt = ` <span class="coach-ind">앞에 <b>빈칸 ${lvl * 4}칸</b>${lvl === 1 ? '(스페이스 4번 또는 Tab 1번)' : `(Tab ${lvl}번)`} — 위 줄의 "안쪽"이라는 뜻이에요.</span>`;
      else if (prevColon) indTxt = '';
      else if (i > 0 && steps.length && steps[steps.length - 1].lvl > 0) indTxt = ` <span class="coach-ind">들여쓰기 <b>없이</b> 맨 앞에서 시작해요 (반복/조건에서 나왔다는 뜻).</span>`;
      const code = '    '.repeat(lvl) + t;
      steps.push({ t: `${why}${indTxt}<div class="coach-code"><span class="muted small">이렇게 치세요 (${steps.length + 1}번째 줄)</span><pre class="code"><code>${esc(code)}</code></pre><button class="btn xs coach-copy" data-code="${esc(code)}">📋 복사</button></div>`, c: t, lvl, auto: true });
      prevColon = t.endsWith(':');
    }
    if (!steps.length) return null;
    steps.push({ t: '다 쳤으면 <b>▶ 실행</b>으로 결과를 확인하고, <b>✔ 제출하기</b>를 누르세요!' });
    return steps;
  },
  // Parsons(줄 맞추기) 푸는 방법 가이드: 사용법 한 단계 + 줄마다 "어떤 줄을 어디에, 들여쓰기 몇 칸" + 함정 줄 주의
  parsonsGuideFor(p) {
    const sol = p.parsons && p.parsons.solution; if (!sol) return null;
    const lines = Grader.parsonsLines(sol); const steps = [];
    steps.push({ t: `<b>사용법</b>: 왼쪽 <b>사용 가능한 줄</b>에서 줄을 <b>누르면</b> 오른쪽 <b>내 코드</b>에 추가돼요. 순서는 <b>▲▼</b>(또는 ⠿ 끌기), 들여쓰기는 <b>◀▶</b>로 바꿔요. ✕는 다시 빼기. 정답은 <b>${lines.length}줄</b>이에요${(p.parsons.distractors || []).length ? ` — 쓰면 안 되는 <b>함정 줄 ${p.parsons.distractors.length}개</b>가 섞여 있어요` : ''}.`, c: '@pz:any' });
    lines.forEach((l, k) => { const prev = lines[k - 1]; let indTxt = ''; if (l.indent > 0 && (!prev || prev.indent < l.indent)) indTxt = ` 그리고 <b>▶를 ${l.indent}번</b> 눌러 안쪽으로 들여쓰세요 (위 줄의 "안쪽"이라는 뜻).`; else if (l.indent > 0) indTxt = ` 들여쓰기는 위 줄과 같게(▶ ${l.indent}번).`; if (prev && prev.indent > 0 && l.indent === 0) indTxt = ' 들여쓰기 <b>없이</b> 맨 왼쪽(반복/조건에서 나왔다는 뜻).';
      const why = l.text.endsWith(':') ? ' 끝에 콜론(:)이 있는 줄은 아래 줄들을 "안쪽"에 거느려요.' : '';
      steps.push({ t: `<b>${k + 1}번째 줄</b>: <code>${esc(l.text)}</code> 를 눌러 추가하세요.${indTxt}${why}`, c: '@pz:' + k }); });
    steps.push({ t: `${lines.length}줄이 순서·들여쓰기까지 맞으면 <b>✔ 제출하기</b>! 애매하면 <b>▶ 실행해 보기</b>로 결과를 먼저 확인하세요.` });
    return steps;
  },
  instantiate(p, params) {
    if (!p.vary) return p;
    if (!params || !Object.keys(params).length) params = this.defaultParams(p);
    const keys = Object.keys(params), vals = keys.map(k => params[k]);
    const sub = (s) => typeof s !== 'string' ? s : s.replace(/\{\{([^}]+)\}\}/g, (m, e) => { try { return String(this.evalExpr(e, params)); } catch (err) { return m; } });
    const q = JSON.parse(JSON.stringify(p)); q.params = params;
    q.prompt = sub(q.prompt); q.solution = sub(q.solution); q.starter = sub(q.starter); q.inputExample = sub(q.inputExample);
    q.hints = (q.hints || []).map(sub);
    if (q.guide) q.guide = q.guide.map(g => ({ ...g, t: sub(g.t), c: Array.isArray(g.c) ? g.c.map(sub) : sub(g.c) }));
    if (q.tests) q.tests = q.tests.map(t => ({ ...t, input: sub(t.input), output: sub(t.output), call: sub(t.call), ret: sub(t.ret) }));
    q.varied = JSON.stringify(params) !== JSON.stringify(this.defaultParams(p));
    return q;
  },
};


// ---------- 채점 ----------
const Grader = {
  norm(s, ic) { let t = String(s ?? '').replace(/\r/g, '').split('\n').map(l => l.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '').replace(/^\n+/, ''); return ic ? t.toLowerCase() : t; },
  normTests(p) { // 테스트 최소 2개 보장(입력 없는 문제는 동일 테스트 복제)
    const t = Content.tests(p).slice(); if (t.length === 1) t.push({ ...t[0] }); return t;
  },
  solutionCache: {},
  async expected(p, test, idx) { // 정답 코드 실행으로 기대값 계산
    const key = p.id + '|' + JSON.stringify(p.params || {}) + '|' + idx; if (this.solutionCache[key]) return this.solutionCache[key];
    const sol = p.type === 'bug' ? p.bug.solution : p.solution;
    let out = ''; const r = await Py.run({ code: sol, input: test._input != null ? test._input : await this.testInput(test), call: test.call || null, files: this.testFiles(p, test), outFiles: p.files && p.files.outputs || null, onOut: (t, e) => { if (!e) out += t; }, timeoutMs: CONFIG.RUN_TIMEOUT_MS * 3 });
    const v = { out, ret: r.ret, segs: r.segs, ok: r.ok, outFiles: r.outFiles || {} }; this.solutionCache[key] = v; return v;
  },
  inputCache: {},
  // 큰 입력은 문자열 대신 파이썬 식(inputGen)으로 적어 두고 실행해서 만든다 (n=10^5 같은 코딩테스트 입력)
  // 실전 프로젝트의 파일 입력: 테스트 고정 파일 → 없으면 문제의 샘플 파일
  testFiles(p, t) { if (t && t.files) return t.files; const up = p.files && p.files.upload; return up && up.sample != null ? [{ name: up.name || 'data.csv', text: up.sample }] : null; },
  async testInput(t) { if (!t.inputGen) return t.input || ''; if (this.inputCache[t.inputGen]) return this.inputCache[t.inputGen]; let out = ''; const r = await Py.run({ code: 'import sys\nsys.stdout.write(str(' + t.inputGen + '))', onOut: (x, e) => { if (!e) out += x; } }); if (!r.ok) throw new Error('inputGen 실패: ' + (r.emsg || '')); this.inputCache[t.inputGen] = out; return out; },
  async runTests(p, code, onEach) {
    const tests = this.normTests(p); const results = []; let passed = 0;
    const limitSec = p.limits && p.limits.time ? p.limits.time : null; const limitMs = limitSec ? limitSec * 1000 * CONFIG.ALGO.slowdown * (Py.speedFactor || 1) : null;
    for (let i = 0; i < tests.length; i++) {
      const t = tests[i]; let out = '', err = ''; let input = '';
      try { input = await this.testInput(t); } catch (e) { results.push({ idx: i, ok: false, input: '', expected: '', actual: '', error: e.message, hidden: false, note: '', raw: {} }); continue; }
      t._input = input;
      const r = await Py.run({ code, input, call: t.call || null, files: this.testFiles(p, t), outFiles: p.files && p.files.outputs || null, onOut: (txt, e) => { if (e) err += txt; else out += txt; }, timeoutMs: limitMs ? Math.max(CONFIG.RUN_TIMEOUT_MS, limitMs * 1.5) : null });
      let ok = false, expected = t.output, actual = out, note = '';
      const tooSlow = limitMs && r.ok && r.ms != null && r.ms > limitMs;
      if (p.turtle) {
        const ex = await this.expected(p, t, i); const a = r.segs || [], b = ex.segs || [];
        ok = r.ok && a.length === b.length && a.every((s, k) => s.every((v, j) => Math.abs(v - b[k][j]) <= 1.5));
        expected = `선 ${b.length}개`; actual = r.ok ? `선 ${a.length}개` : '에러';
        if (r.ok && a.length !== b.length) note = `선의 개수가 달라요 (기대 ${b.length}, 내 그림 ${a.length})`;
        else if (r.ok && !ok) note = '선의 위치가 달라요';
      } else if (t.call) {
        let exp = t.ret; if (exp === '__COMPUTED__' || p.varied) { const ex = await this.expected(p, t, i); exp = ex.ret; }
        ok = r.ok && r.ret === exp; expected = `${t.call} → ${exp}`; actual = r.ok ? `${r.ret}` : '에러';
      } else {
        let exp = t.output; if (exp === '__COMPUTED__' || p.varied) { const ex = await this.expected(p, t, i); exp = ex.out; }
        ok = r.ok && this.norm(out, p.ignoreCase) === this.norm(exp, p.ignoreCase); expected = exp;
        if (ok && t.outFile) { // 실전: 결과 파일 내용도 확인 (기대는 정답 코드가 만든 파일)
          const ex = await this.expected(p, t, i); const mine = (r.outFiles || {})[t.outFile]; const want = (ex.outFiles || {})[t.outFile];
          if (mine == null) { ok = false; note = `${t.outFile} 파일이 만들어지지 않았어요`; actual = out + `\n(${t.outFile} 없음)`; }
          else if (this.norm(mine) !== this.norm(want || '')) { ok = false; note = `${t.outFile} 내용이 달라요`; expected = exp + `\n--- ${t.outFile} ---\n` + (want || ''); actual = out + `\n--- ${t.outFile} ---\n` + mine; }
        }
      }
      if (tooSlow) { ok = false; note = `⏱ 시간 초과 (제한 ${limitSec}초, 내 코드 ${(r.ms / 1000 / CONFIG.ALGO.slowdown / (Py.speedFactor || 1)).toFixed(1)}초 상당) — 더 빠른 자료구조나 방법이 필요해요`; actual = '(시간 초과)'; }
      if (r.timeout && limitMs) { note = `⏱ 시간 초과 (제한 ${limitSec}초) — 더 빠른 자료구조나 방법이 필요해요`; }
      const res = { idx: i, ok, input: t.inputGen ? (input.length <= 300 ? input : `(큰 입력 · ${input.length}자)`) : (t.input || ''), expected, actual, error: r.ok ? '' : (Py.explain(r) + (r.tb ? '\n' + r.tb : '')), hidden: i === tests.length - 1, note, raw: r, ms: r.ms };
      results.push(res); if (ok) passed++;
      if (onEach) onEach(res, i, tests.length);
      if (r.timeout) break;
    }
    return { passed, total: tests.length, results, allPass: passed === tests.length };
  },
  parsonsLines(sol) { return sol.split('\n').filter(l => l.trim() !== '').map(l => ({ indent: Math.floor((l.match(/^ */)[0].length) / 4), text: l.trim() })); },
  checkParsons(p, arranged) { // arranged: [{text, indent}]
    const sol = this.parsonsLines(p.parsons.solution); const wrong = [];
    if (arranged.length !== sol.length) { arranged.forEach((a, i) => { if (!sol[i] || sol[i].text !== a.text || sol[i].indent !== a.indent) wrong.push(i); }); return { ok: false, wrong, lengthMismatch: true }; }
    arranged.forEach((a, i) => { if (sol[i].text !== a.text || sol[i].indent !== a.indent) wrong.push(i); });
    return { ok: wrong.length === 0, wrong };
  },
  checkFill(p, answers) { const wrong = []; p.fill.blanks.forEach((b, i) => { const a = (answers[i] || '').trim(); if (!b.a.some(x => x.trim() === a)) wrong.push(i); }); return { ok: wrong.length === 0, wrong }; },
};
