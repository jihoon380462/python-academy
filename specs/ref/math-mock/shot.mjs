// 화면 찍기 + 재기(시안 · 기준 화면 공용). 쓰는 법: node specs/ref/math-mock/shot.mjs <작업.json>
// 작업.json = [{ url, out, size: 'phone'|'pc', js?: '페이지에서 실행할 식', full?: true, wait?: ms, theme?: 'dark'|'light', clip?: 선택자 }]
// 폰 = iPhone 13 흉내(390x844 · 터치 · 기기 배율은 Playwright 값), PC = 1440x900 · 배율 2. 숫자(높이 · 가로 넘침)는 여기서 재서 찍어요(LESSON R10).
import { createRequire } from 'node:module'; import fs from 'node:fs';
const require = createRequire('/usr/lib/node_modules/'); let pw; try { pw = require('playwright'); } catch (e) { pw = (await import('playwright')).default; }
const { chromium, devices } = pw;
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const browser = await chromium.launch();
const ctxs = { phone: await browser.newContext({ ...devices['iPhone 13'] }), pc: await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }),
  // 내가 확인하는 용도(배율 1): 폰은 터치 · 모바일 흉내 그대로, 화면 높이만 844
  phone1: await browser.newContext({ ...devices['iPhone 13'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }), pc1: await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }) };
for (const j of jobs) {
  // 작업에 viewport { w, h, dpr } 가 있으면 그 크기의 새 창으로(시안 모음 판처럼 폭이 다른 것)
  const ctx = j.viewport ? await browser.newContext({ viewport: { width: j.viewport.w, height: j.viewport.h }, deviceScaleFactor: j.viewport.dpr || 2 }) : ctxs[j.size || 'phone'];
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(String(e).slice(0, 160)));
  await page.goto(j.url, { waitUntil: 'load' }); await page.waitForTimeout(j.wait ?? 500);
  if (j.theme) await page.evaluate(t => document.documentElement.setAttribute('data-theme', t), j.theme);
  if (j.js) { await page.evaluate(j.js); await page.waitForTimeout(j.wait ?? 400); }
  const m = await page.evaluate(() => ({ w: innerWidth, h: innerHeight, docH: document.documentElement.scrollHeight, docW: document.documentElement.scrollWidth,
    over: [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > innerWidth + 1 && getComputedStyle(e).position !== 'fixed' && !e.closest('pre,.bk-res-w,.bk-dex-chips,[data-scroll-x]'); }).slice(0, 3).map(e => e.tagName + '.' + String(e.className).slice(0, 30)),
    font: getComputedStyle(document.body).fontFamily.slice(0, 60) }));
  if (j.clip) { const el = await page.$(j.clip); await el.screenshot({ path: j.out }); } else await page.screenshot({ path: j.out, fullPage: j.full !== false });
  console.log(`${j.out.split('/').pop()} [${j.size || 'phone'}] 화면 ${m.w}x${m.h} · 문서 높이 ${m.docH}px = 화면 ${(m.docH / m.h).toFixed(1)}장 · 가로 ${m.docW}px${m.docW > m.w ? ' ⚠ 가로 넘침' : ''}${m.over.length ? ' 넘친 요소 ' + m.over.join(',') : ''}${errs.length ? ' ⚠ 에러 ' + errs.join(' | ') : ''}`);
  await page.close(); if (j.viewport) await ctx.close();
}
await browser.close();
