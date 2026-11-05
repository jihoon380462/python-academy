// tools/validate/web.mjs — 웹·HTTP·API 코스 전용 필드 규칙 (validate_content.mjs 가 부른다, DESIGN.md 16절). 문제 유형 'web' 의 p.web 모양 + 예제 example.web 검사.
const TABS = ['html', 'css', 'js'];
const COND_KEYS = ['exists', 'count', 'equals', 'contains', 'value', 'attr', 'css', 'js']; // text 는 체크리스트 문구라서 글자 비교는 equals/contains
const ACT_KEYS = ['click', 'input', 'key', 'submit'];
const hasCond = (c) => c && COND_KEYS.some(k => c[k] != null);
export default async (course, { err, warn }) => {
  for (const p of course.PROBLEMS) {
    const where = p.id;
    if (p.type === 'web') {
      const w = p.web;
      if (!w || typeof w !== 'object') { err(`${where}: web 문제는 web:{ tabs, starter, checks } 필드가 필요해요`); continue; }
      if (w.tabs != null) { if (!Array.isArray(w.tabs) || !w.tabs.length || w.tabs.some(t => !TABS.includes(t))) err(`${where}: web.tabs 는 ['html','css','js'] 중에서 1개 이상`); if (Array.isArray(w.tabs) && new Set(w.tabs).size !== w.tabs.length) err(`${where}: web.tabs 중복`); }
      if (!w.starter || typeof w.starter !== 'object') err(`${where}: web.starter 는 { html, css?, js? } 객체`);
      else { for (const k of Object.keys(w.starter)) { if (!TABS.includes(k)) err(`${where}: web.starter.${k} — html/css/js 만`); else if (typeof w.starter[k] !== 'string') err(`${where}: web.starter.${k} 는 문자열`); } const tabs = w.tabs || TABS; for (const k of Object.keys(w.starter)) if (w.starter[k] && !tabs.includes(k)) err(`${where}: starter.${k} 가 있는데 tabs 에 '${k}' 가 없어요(편집기에 안 보임)`); }
      if (w.free) { if (Array.isArray(w.checks) && w.checks.length) warn(`${where}: free 문제의 checks 는 쓰이지 않아요(채점 없음)`); if ((p.xp || 0) > 15) warn(`${where}: free(자유 과제) XP 는 고정 소액(10 안팎)으로`); }
      else {
        if (!Array.isArray(w.checks) || !w.checks.length) err(`${where}: web.checks 가 비어 있어요 (자유 과제면 web.free:true)`);
        else w.checks.forEach((c, i) => {
          const at = `${where} checks[${i}]`;
          if (!c || typeof c !== 'object') return err(`${at}: 객체여야 해요`);
          if (!c.text || typeof c.text !== 'string') err(`${at}: text(체크리스트 문구) 필요`);
          const acts = ACT_KEYS.filter(k => c[k] != null);
          if (acts.length) { if (!hasCond(c.then) && !hasCond(c)) err(`${at}: ${acts.join('/')} 뒤에 검사할 then:{ sel, … } 이 필요해요`); if (c.input && !(c.input.sel && c.input.value != null)) err(`${at}: input 은 {sel, value}`); if (c.key && !(c.key.sel)) err(`${at}: key 는 {sel, key?}`); }
          else if (!hasCond(c)) err(`${at}: 검사 키가 하나도 없어요 (${COND_KEYS.join('/')} 중 하나)`);
          const cond = c.then || c; const n = COND_KEYS.filter(k => cond[k] != null).length; if (n > 1) warn(`${at}: 검사 키가 ${n}개 — 첫 번째(${COND_KEYS.find(k => cond[k] != null)})만 적용돼요. 항목을 나누세요`);
          if (!cond.js && !cond.sel && cond.exists == null && cond.count == null) err(`${at}: sel(선택자)이 없어요`);
          if (cond.css && !(cond.css.prop && cond.css.value != null)) err(`${at}: css 는 {prop, value}`);
          if (cond.attr && !cond.attr.name) err(`${at}: attr 은 {name, value?}`);
          if (cond.count != null && !(typeof cond.count === 'number' || (typeof cond.count === 'object' && (cond.count.min != null || cond.count.max != null)))) err(`${at}: count 는 숫자 또는 {min,max}`);
          if (c.viewport != null && !(typeof c.viewport === 'number' && c.viewport >= 320)) err(`${at}: viewport 는 320 이상 숫자(px)`);
          if (c.wait != null && !(typeof c.wait === 'number' && c.wait <= 3000)) err(`${at}: wait 는 3000ms 이하 숫자`);
        });
        if (typeof p.solution !== 'string' || !p.solution.trim()) err(`${where}: solution(정답 html 문자열, css/js 는 <style>/<script> 로 합침) 필요`);
      }
      if (w.api) { for (const k of Object.keys(w.api)) if (!['delay', 'failRate', 'failFirst', 'todos'].includes(k)) err(`${where}: web.api.${k} — delay/failRate/failFirst/todos 만`); if (w.api.failRate && !w.free) warn(`${where}: api.failRate(무작위 실패)는 채점이 흔들려요 — failFirst 로`); }
      if (p.tests && p.tests.length) err(`${where}: web 문제는 tests 를 쓰지 않아요(checks 로)`);
    } else if (p.web) err(`${where}: type 이 '${p.type}' 인데 web 필드가 있어요`);
    if (p.type === 'parsons' && p.parsons && /<\w+/.test(p.parsons.solution || '')) { const lines = String(p.parsons.solution).split('\n').filter(l => l.trim()); if (lines.some(l => /^ *\t/.test(l) || (l.match(/^ */)[0].length % 2))) err(`${where}: HTML parsons 는 들여쓰기 2칸 단위`); }
  }
  for (const l of course.LESSONS) (l.pages || []).forEach((pg, i) => { const ex = pg.example; if (!ex) return; if (ex.code != null) err(`레슨 ${l.id} p${i}: example.code(파이썬)는 이 코스에서 안 돼요 — example.web:{html,css,js}`); if (ex.web != null) { if (typeof ex.web !== 'object') return err(`레슨 ${l.id} p${i}: example.web 은 {html, css?, js?}`); for (const k of Object.keys(ex.web)) if (!TABS.includes(k) || typeof ex.web[k] !== 'string') err(`레슨 ${l.id} p${i}: example.web.${k} — html/css/js 문자열만`); if (ex.web.html == null) err(`레슨 ${l.id} p${i}: example.web.html 이 필요해요`); } });
  const lessonsDone = course.LESSONS.filter(l => !l.draft && !l.boss); for (const l of lessonsDone) { const probs = course.PROBLEMS.filter(p => p.lesson === l.id); if (probs.length < 3) warn(`레슨 ${l.id}: 문제 ${probs.length}개 (3개 이상 권장)`); }
};
