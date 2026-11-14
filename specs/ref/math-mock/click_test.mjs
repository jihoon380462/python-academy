// 시안 파일을 실제로 눌러 보는 검사 — 탭 · 키보드 · 다음 단계 · 답 펴기 · 다시 보기와 돌아오기 · 챕터 접기 · 시안 고르기. 쓰는 법(build.py 다음에): node specs/ref/math-mock/click_test.mjs [index.html 경로 — 안 주면 .out/dist/index.html]
import { createRequire } from 'node:module'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const require = createRequire('/usr/lib/node_modules/'); let pw; try { pw = require('playwright'); } catch (e) { pw = (await import('playwright')).default; }
const { chromium, devices } = pw;
const HERE = path.dirname(fileURLToPath(import.meta.url)), FILE = path.resolve(process.argv[2] || path.join(HERE, '.out/dist/index.html'));
const U = 'file://' + FILE;
const browser = await chromium.launch(); let fails = 0, n = 0; const errs = [];
const ok = (cond, name, extra = '') => { n++; if (!cond) fails++; console.log(`${cond ? '✓' : '✗'} ${name}${extra ? ' — ' + extra : ''}`); };
for (const [label, ctxOpt] of [['폰', { ...devices['iPhone 13'] }], ['PC', { viewport: { width: 1440, height: 900 } }]]) {
  const ctx = await browser.newContext(ctxOpt); const page = await ctx.newPage(); page.on('pageerror', e => errs.push(label + ': ' + String(e).slice(0, 200)));
  const t = (sel) => page.locator(sel);
  // A. 쪽 넘기기
  await page.goto(U + '?s=lesson&v=A'); await page.waitForTimeout(300);
  ok(await t('.bk-tab.on').innerText() === '1', `[${label}] A: 처음은 1쪽`);
  await t('.bk-tab[data-pg="2"]').click(); ok((await t('h1.lp-h').innerText()).startsWith('배수'), `[${label}] A: 탭 3 → 배수 쪽`);
  await t('#bkNext').click(); ok((await t('h1.lp-h').innerText()).startsWith('약수와 배수의 관계'), `[${label}] A: 다음 → 관계 쪽`);
  if (label === 'PC') { await page.keyboard.press('ArrowLeft'); ok((await t('h1.lp-h').innerText()).startsWith('배수'), '[PC] A: ← 키로 이전 쪽'); await page.keyboard.press('ArrowRight'); }
  await t('.bk-tab.make').click(); ok((await t('h1.lp-h').innerText()).includes('연습 문제'), `[${label}] A: 연습 문제 탭`);
  ok(await t('.bk-task').count() === 6, `[${label}] 연습 문제 6개`); ok(await t('.mx-miss').count() === 3, `[${label}] 자주 하는 실수 3개`);
  await t('#task-0 summary').click(); ok(await t('#task-0 .mx-ans').isVisible(), `[${label}] 가: 답과 풀이 펴짐`);
  await t('#task-3 .mx-see').click(); ok(await t('#bkBack').isVisible() && (await t('h1.lp-h').innerText()).startsWith('예제 2'), `[${label}] 다시 보기 → 예제 2 쪽 + 돌아가기 단추`);
  await t('#bkBack').click(); ok((await t('h1.lp-h').innerText()).includes('연습 문제') && await t('#task-0 .mx-ans').isVisible(), `[${label}] 돌아가기 → 연습 문제(펴 둔 답 그대로)`);
  // 답 확인 나 · 다
  await page.goto(U + '?s=lesson&v=A&p=7&k=2'); await page.waitForTimeout(200);
  await t('#task-2 [data-act="a"]').click(); ok(await t('#task-2 .mx-ans').isVisible() && await t('#task-2 .mx-steps').count() === 0, `[${label}] 나: 답만 보임`);
  await t('#task-2 [data-act="s"]').click(); ok(await t('#task-2 .mx-steps li').count() === 5, `[${label}] 나: 풀이 5줄 보임`);
  await page.goto(U + '?s=lesson&v=A&p=7&k=3'); await page.waitForTimeout(200);
  for (let i = 0; i < 3; i++) await t('#task-0 [data-act="n"]').click(); ok(await t('#task-0 .mx-steps li').count() === 3 && await t('#task-0 .mx-ans').count() === 0, `[${label}] 다: 풀이 3줄만, 답은 아직 안 보임`);
  for (let i = 0; i < 3; i++) await t('#task-0 [data-act="n"]').click(); ok(await t('#task-0 [data-act="n"]').isDisabled(), `[${label}] 다: 6줄 다 보면 단추 꺼짐`);
  await t('#task-1 [data-act="all"]').click(); ok(await t('#task-1 .mx-steps li').count() === 4, `[${label}] 다: 전부 보기 → 4줄 한 번에`);
  await t('#task-0 [data-act="r"]').click(); ok(await t('#task-0 .mx-steps').count() === 0, `[${label}] 다: 풀이 접기`);
  // B. 한 장 스크롤
  await page.goto(U + '?s=lesson&v=B'); await page.waitForTimeout(300);
  ok(await t('.mxb-sec').count() === 9, `[${label}] B: 절 9개`);
  if (label === '폰') { await t('.mxb-bar [data-go="ex1"]').click(); await page.waitForTimeout(1800); /* 부드러운 스크롤이 끝날 때까지(긴 거리는 1초 넘게) */ ok(await t('.mxb-bar .chip-btn.on').innerText() === '예제', '[폰] B: 차례 줄 「예제」 → 그 절로 가고 표시가 바뀜'); ok(await page.evaluate(() => getComputedStyle(document.querySelector('.mxb-rail')).display) === 'none', '[폰] B: 옆 차례는 숨김'); }
  else { await t('.mxb-rl[data-go="practice"]').click(); await page.waitForTimeout(1800); /* 부드러운 스크롤이 끝날 때까지(긴 거리는 1초 넘게) */ ok(await t('.mxb-rl.on').innerText() === '연습 문제', '[PC] B: 옆 차례 「연습 문제」 → 그 절로 가고 표시가 바뀜'); ok(await page.evaluate(() => getComputedStyle(document.querySelector('.mxb-bar')).display) === 'none', '[PC] B: 위 차례 줄은 숨김'); }
  // C. 단계 카드
  await page.goto(U + '?s=lesson&v=C'); await page.waitForTimeout(300);
  ok(await t('.mxc-card').count() === 1, `[${label}] C: 처음은 카드 1장`);
  for (let i = 0; i < 4; i++) { await t('#cNext').click(); await page.waitForTimeout(120); }
  ok(await t('.mxc-card').count() === 5 && (await t('.mxc-card.cur h2').innerText()).startsWith('예제 1'), `[${label}] C: 다음 단계 4번 → 카드 5장, 지금은 예제 1`);
  ok(await t('#c-ex1 .mx-steps li').count() === 1 && await t('#c-ex1 .mx-ans').count() === 0, `[${label}] C: 예제는 풀이 첫 줄만`);
  for (let i = 0; i < 6; i++) await t('#c-ex1 .mx-line').click(); ok(await t('#c-ex1 .mx-steps li').count() === 7 && await t('#c-ex1 .mx-ans').isVisible() && await t('#c-ex1 .mx-why').isVisible(), `[${label}] C: 풀이 다음 줄 6번 → 7줄 + 까닭 + 답`);
  if (label === 'PC') { await page.keyboard.press('Enter'); await page.waitForTimeout(150); ok(await t('.mxc-card').count() === 6, '[PC] C: Enter 로 다음 단계'); } else { await t('#cNext').click(); await page.waitForTimeout(150); }
  for (let i = 0; i < 3; i++) { await t('#cNext').click(); await page.waitForTimeout(150); }
  ok(await t('.mxc-card').count() === 9 && await t('#cNext').count() === 0 && await t('#bkNext').isVisible(), `[${label}] C: 끝까지 가면(9단계) 「다음 레슨」`);
  // 목차
  await page.goto(U + '?s=toc&t=1'); await page.waitForTimeout(200); ok(await t('.bk-l').count() === 35 && await t('.bk-ch').count() === 9, `[${label}] 목차 ㄱ: 챕터 9 · 레슨 35`);
  await page.goto(U + '?s=toc&t=2'); await page.waitForTimeout(200); ok(await t('.mxt-ch').count() === 9 && await t('.bk-l').count() === 4, `[${label}] 목차 ㄴ: 챕터 9, 펴진 것은 챕터 1의 레슨 4`);
  await t('.mxt-h[data-ch="2"]').click(); ok(await t('.bk-l').count() === 10, `[${label}] 목차 ㄴ: 챕터 2 를 누르면 레슨 6개가 더 펴짐`);
  await t('.bk-l[data-l="1"]').click(); ok(await t('.bk-lesson').count() === 1, `[${label}] 목차 → 레슨`);
  // 시안 고르기 줄
  await page.selectOption('#swV', 'C'); ok(await t('.mxc-prog').count() === 1, `[${label}] 시안 고르기: 쪽 짜임 C`);
  await page.selectOption('#swS', 'toc'); await page.selectOption('#swT', '2'); ok(await t('.mxt-ch').count() === 9, `[${label}] 시안 고르기: 목차 ㄴ`);
  // 가로 넘침
  for (const q of ['s=lesson&v=A&p=7&k=3', 's=lesson&v=B', 's=lesson&v=C&step=9&lines=9', 's=toc&t=1', 's=toc&t=2']) { await page.goto(U + '?' + q); await page.waitForTimeout(200); const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth); ok(over <= 0, `[${label}] 가로 넘침 없음 (${q})`, over > 0 ? over + 'px 넘침' : ''); }
  await ctx.close();
}
ok(errs.length === 0, '페이지 에러 0', errs.join(' | '));
await browser.close(); console.log(`\n검사 ${n}개 · 실패 ${fails}`); process.exit(fails ? 1 : 0);
