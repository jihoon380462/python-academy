#!/usr/bin/env node
// tools/check_book_par.mjs — check_book 을 교과서마다 따로 띄워 동시에 돌린다(v2.39.0 CI 줄이기).
// `node tools/check_book_par.mjs [동시에 몇 개, 기본 CPU 수]`
// - 교과서 하나 = 프로세스 하나(`node tools/check_book.mjs <코스>`). 검사 내용은 check_book.mjs 그대로.
// - 오래 걸리는 교과서를 먼저 시작해서(아래 HEAVY) 마지막에 큰 것 하나만 남아 기다리는 일을 줄인다.
// - 출력은 교과서마다 모아 두었다가 끝난 순서대로 한 덩어리씩 찍는다(섞이지 않게). 하나라도 실패하면 끝 코드 1.
import fs from 'fs'; import os from 'os'; import path from 'path'; import { spawn } from 'child_process';
const R = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const N = Math.max(1, +process.argv[2] || os.cpus().length);
const HEAVY = ['data', 'ml', 'python', 'llm', 'debug', 'cs', 'algo', 'math', 'oop', 'ai', 'os', 'asm', 'api', 'vim']; // CI 기록(v2.37.0)에서 오래 걸린 순
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
