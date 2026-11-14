// 글자 크기 「아주 크게」(data-font=3) · 좁은 폰(320)에서 가로 넘침이 없는지. 쓰는 법(build.py 다음에): node specs/ref/math-mock/font_test.mjs [index.html 경로]
import { createRequire } from 'node:module'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const require = createRequire('/usr/lib/node_modules/'); let pw; try { pw = require('playwright'); } catch (e) { pw = (await import('playwright')).default; }
const HERE = path.dirname(fileURLToPath(import.meta.url)), FILE = path.resolve(process.argv[2] || path.join(HERE, '.out/dist/index.html'));
const { chromium, devices } = pw; const U = 'file://' + FILE + '?bare=1&';
const browser = await chromium.launch(); let bad = 0;
for (const [name, w, font] of [['폰 390 · 글자 아주 크게', 390, '3'], ['좁은 폰 320 · 보통 글자', 320, '1'], ['좁은 폰 320 · 글자 아주 크게', 320, '3']]) {
  const ctx = await browser.newContext({ ...devices['iPhone 13'], viewport: { width: w, height: 844 }, deviceScaleFactor: 1 }); const page = await ctx.newPage();
  for (const q of ['s=lesson&v=A&p=0', 's=lesson&v=A&p=1', 's=lesson&v=A&p=2', 's=lesson&v=A&p=3', 's=lesson&v=A&p=4', 's=lesson&v=A&p=5', 's=lesson&v=A&p=7&k=3&demo=1', 's=lesson&v=B', 's=lesson&v=C&step=9&lines=9', 's=toc&t=1', 's=toc&t=2']) {
    await page.goto(U + q); await page.evaluate(f => document.documentElement.setAttribute('data-font', f), font); await page.waitForTimeout(200);
    const r = await page.evaluate(() => { const over = document.documentElement.scrollWidth - innerWidth; const els = [...document.querySelectorAll('#view *')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.right > innerWidth + 1 && !e.closest('.mxb-bar'); }).slice(0, 3).map(e => e.tagName + '.' + String(e.className.baseVal ?? e.className).slice(0, 24) + ':' + Math.round(e.getBoundingClientRect().right)); return { over, els }; });
    if (r.over > 0 || r.els.length) { bad++; console.log(`✗ [${name}] ${q} — 넘침 ${r.over}px ${r.els.join(' ')}`); }
  }
  console.log(`[${name}] 확인 끝`); await ctx.close();
}
await browser.close(); console.log(bad ? `넘친 화면 ${bad}곳` : '가로 넘침 0곳');
