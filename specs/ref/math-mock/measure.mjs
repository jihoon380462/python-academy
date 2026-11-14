// 시안 화면의 길이를 재요(찍지는 않아요) — 설명 글 · 설계 문서의 숫자는 이 출력을 그대로 옮겨요(LESSON R10).
// 쓰는 법(build.py 다음에): node specs/ref/math-mock/measure.mjs [index.html 경로 — 안 주면 .out/dist/index.html]
import { createRequire } from 'node:module'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const require = createRequire('/usr/lib/node_modules/'); let pw; try { pw = require('playwright'); } catch (e) { pw = (await import('playwright')).default; }
const HERE = path.dirname(fileURLToPath(import.meta.url)), FILE = path.resolve(process.argv[2] || path.join(HERE, '.out/dist/index.html'));
const { chromium, devices } = pw; const U = 'file://' + FILE + '?bare=1&';
const browser = await chromium.launch();
const sizes = { '폰 390x844': { ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }, 'PC 1440x900': { viewport: { width: 1440, height: 900 } } };
const jobs = [['A 1쪽 나누어떨어진다', 's=lesson&v=A&p=0'], ['A 2쪽 약수', 's=lesson&v=A&p=1'], ['A 3쪽 배수', 's=lesson&v=A&p=2'], ['A 4쪽 관계', 's=lesson&v=A&p=3'], ['A 5쪽 예제 1', 's=lesson&v=A&p=4'], ['A 6쪽 예제 2', 's=lesson&v=A&p=5'], ['A 7쪽 예제 3', 's=lesson&v=A&p=6'],
  ['A 연습 문제 쪽(답 접힘 · 가)', 's=lesson&v=A&p=7&k=1'], ['A 연습 문제 쪽(답 접힘 · 나)', 's=lesson&v=A&p=7&k=2'], ['A 연습 문제 쪽(답 접힘 · 다)', 's=lesson&v=A&p=7&k=3'],
  ['B 레슨 전체', 's=lesson&v=B'], ['C 1단계만', 's=lesson&v=C&step=1'], ['C 9단계 모두(예제 풀이 다 폄)', 's=lesson&v=C&step=9&lines=9'], ['목차 ㄱ 펼친 목록', 's=toc&t=1'], ['목차 ㄴ 챕터 접기(챕터 1만 폄)', 's=toc&t=2']];
for (const [name, opt] of Object.entries(sizes)) {
  const ctx = await browser.newContext(opt); const page = await ctx.newPage(); console.log(`== ${name} ==`);
  for (const [label, q] of jobs) { await page.goto(U + q); await page.waitForTimeout(250); const m = await page.evaluate(() => ({ h: document.documentElement.scrollHeight, vh: innerHeight, over: document.documentElement.scrollWidth - innerWidth })); console.log(`${label}: ${m.h}px = 화면 ${(m.h / m.vh).toFixed(1)}장${m.over > 0 ? ' ⚠ 가로 넘침 ' + m.over + 'px' : ''}`); }
  await ctx.close();
}
await browser.close();
