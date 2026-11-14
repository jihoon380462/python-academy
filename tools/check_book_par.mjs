#!/usr/bin/env node
// tools/check_book_par.mjs — check_book 을 교과서마다 따로 띄워 동시에 돌린다(v2.39.0 CI 줄이기).
// `node tools/check_book_par.mjs [동시에 몇 개, 기본 CPU 수]`
// - 교과서 하나 = 프로세스 하나(`node tools/check_book.mjs <코스>`). 검사 내용은 check_book.mjs 그대로.
// - 오래 걸리는 교과서를 먼저 시작해서(아래 HEAVY) 마지막에 큰 것 하나만 남아 기다리는 일을 줄인다.
// - 출력은 교과서마다 모아 두었다가 끝난 순서대로 한 덩어리씩 찍는다(섞이지 않게). 하나라도 실패하면 끝 코드 1.
import fs from 'fs'; import os from 'os'; import path from 'path'; import { spawn } from 'child_process';
const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const N = Math.max(1, +process.argv[2] || os.cpus().length);
// 오래 걸린 순(11/15 pyfork 적용 뒤 로컬 측정, 초): python 49.3 · llm 41.7 · vim 33.5 · ml 29.0 · data 24.9 · files 12.4 · debug 11.8 · auto 11.0 · api 9.4 ·
//   os 8.0 · asm 7.7 · cs 5.9 · algo 5.3 · ai 3.7 · oop 2.8 · terminal-git 2.6 · github 2.6 · sql 2.5 · linux 1.1 · web 0.1. 합 265초 ÷ 4 = 66초가 하한이라 순서는 거의 최선.
//   (pyfork 전 CI 11/15: data 97.5 · ml 88.9 · python 58.4 · llm 47.3 · vim 33.5 … — 예전 목록(v2.37.0)은 vim · files · auto 가 뒤에 있어 끝에 셋이 남아 기다렸어요)
const HEAVY = ['python', 'llm', 'vim', 'ml', 'data', 'files', 'debug', 'auto', 'api', 'os', 'asm', 'cs', 'algo', 'ai', 'oop', 'terminal-git', 'github', 'sql', 'linux', 'web'];
const all = fs.readdirSync(R + '/courses').filter(d => fs.existsSync(`${R}/courses/${d}/book.js`));
const queue = [...HEAVY.filter(c => all.includes(c)), ...all.filter(c => !HEAVY.includes(c))];
let fails = 0; let running = 0; const t0 = Date.now();
const runOne = (cid) => new Promise((resolve) => {
  const t = Date.now(); const out = [];
  const p = spawn(process.execPath, [path.join(R, 'tools/check_book.mjs'), cid], { cwd: R });
  p.stdout.on('data', (b) => out.push(b)); p.stderr.on('data', (b) => out.push(b));
  p.on('close', (code) => {
    if (code !== 0) fails++;
    process.stdout.write(Buffer.concat(out).toString() + `   (${cid} ${((Date.now() - t) / 1000).toFixed(1)}초${code ? ' · 실패' : ''})\n`);
    resolve();
  });
});
await new Promise((done) => {
  const next = () => {
    if (!queue.length && !running) return done();
    while (running < N && queue.length) { running++; runOne(queue.shift()).then(() => { running--; next(); }); }
  };
  next();
});
console.log(`check_book_par: 교과서 ${all.length}개 · 동시에 ${N}개 · ${((Date.now() - t0) / 1000).toFixed(1)}초 · 실패 ${fails}`);
process.exit(fails ? 1 : 0);
