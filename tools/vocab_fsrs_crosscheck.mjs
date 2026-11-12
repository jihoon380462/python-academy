#!/usr/bin/env node
// tools/vocab_fsrs_crosscheck.mjs — vocab/fsrs.js 가 참조 구현(ts-fsrs)과 같은 숫자를 내는지 무작위 복습 기록으로 대조해요.
//   CI 에는 넣지 않아요: 참조 라이브러리를 저장소에 두지 않기 때문이에요. 간격 계산을 고쳤거나 참조 버전을 올릴 때 한 번 돌려요.
//   쓰기:  (임시 폴더에서) npm pack ts-fsrs@5.4.2 → tar xzf ts-fsrs-5.4.2.tgz
//          node tools/vocab_fsrs_crosscheck.mjs <그 폴더>/package/dist/index.cjs [카드 수=300] [카드마다 복습 수=40]
//   맞추는 조건: 우리 쪽은 hardStyle 'tsfsrs'(「어려움」 을 참조 방식으로) · 하루 번호 = UTC 날짜 · 흩뜨리기 씨앗 = 「복습 시각(초)_횟수」.
//   이 셋 말고는 vocab/core.js 가 쓰는 설정과 같아요(목표 기억률 0.9 · 학습 단계 1분 10분 · 다시 학습 10분 · 흩뜨리기 켬).
import fs from 'node:fs'; import path from 'node:path'; import vm from 'node:vm'; import { createRequire } from 'node:module';
import { ROOT } from './load_content.mjs';
const libPath = process.argv[2]; const CARDS = +process.argv[3] || 300; const STEPS = +process.argv[4] || 40;
if (!libPath || !fs.existsSync(libPath)) { console.error('참조 라이브러리 경로를 주세요: node tools/vocab_fsrs_crosscheck.mjs <ts-fsrs>/package/dist/index.cjs'); process.exit(2); }
const F = createRequire(import.meta.url)(path.resolve(libPath));
const ctx = {}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(ROOT, 'vocab/fsrs.js'), 'utf8') + ';this.__F = Fsrs;', ctx);
const mine = ctx.__F.make({ fuzz: true, hardStyle: 'tsfsrs' });
const ref = F.fsrs({ enable_fuzz: true });
ref.useStrategy(F.StrategyMode.SEED, function () { return Math.floor(this.review_time.getTime() / 1000) + '_' + this.current.reps; });
let seed = 20261112; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const pickGrade = () => { const x = rnd(); return x < 0.15 ? 1 : x < 0.3 ? 2 : x < 0.85 ? 3 : 4; };
const same = (a, b) => a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a)));
const view = (m) => ({ state: m.state, due: m.due, s: m.s, d: m.d, reps: m.reps, lapses: m.lapses, step: m.step, sd: m.sd });
const viewRef = (c) => ({ state: c.state, due: c.due.getTime(), s: c.stability, d: c.difficulty, reps: c.reps, lapses: c.lapses, step: c.learning_steps, sd: c.scheduled_days });
let checked = 0; const bad = [];
for (let i = 0; i < CARDS && bad.length < 5; i++) {
  let t = Date.UTC(2026, 0, 2) + Math.floor(rnd() * 300 * 86400) * 1000; let m = null; let r = F.createEmptyCard(new Date(t)); const trail = [];
  for (let k = 0; k < STEPS; k++) {
    const g = pickGrade(); trail.push(g);
    // 네 버튼 미리 보기 전부 대조
    const pm = mine.preview(m, t); const pr = ref.repeat(r, new Date(t));
    for (const q of [1, 2, 3, 4]) { const a = view(pm[q]), b = viewRef(pr[q].card); for (const key of Object.keys(a)) { checked++; if (!same(a[key], b[key])) bad.push(`카드 ${i} · ${k + 1}번째(버튼 기록 ${trail.join('')}) · 버튼 ${q} 의 ${key}: 우리 ${a[key]} ≠ 참조 ${b[key]}`); } }
    if (bad.length) break;
    m = pm[g]; r = pr[g].card;
    // 다음에 볼 때: 학습 중이면 대개 제때 또는 조금 늦게, 복습이면 예정일 앞뒤로(일찍 · 제때 · 늦게)
    const wait = m.state === 2 ? Math.max(1, Math.round(m.sd * (0.3 + rnd() * 1.9))) * 86400000 + Math.floor(rnd() * 3600) * 1000 : (rnd() < 0.8 ? m.due - t + Math.floor(rnd() * 600) * 1000 : Math.floor(rnd() * 3 * 86400) * 1000 + 60000);
    t += Math.max(1000, Math.round(wait / 1000) * 1000);
  }
}
console.log(`참조: ${F.FSRSVersion} · 카드 ${CARDS}장 × 복습 ${STEPS}번 · 대조한 값 ${checked}개`);
if (bad.length) { console.error(`✗ 다른 곳 ${bad.length}개`); bad.forEach(x => console.error('  ' + x)); process.exit(1); }
console.log('✓ vocab/fsrs.js 와 참조 구현의 결과가 모두 같아요');
