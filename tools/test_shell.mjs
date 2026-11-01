#!/usr/bin/env node
// tools/test_shell.mjs — 셸 시뮬레이터 자가 테스트 (Node). `node tools/test_shell.mjs`. WP-B에서 명령을 추가할 때마다 케이스를 늘린다.
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const Shell = require('../core/runners/shell.js');
let fails = 0; const eq = (a, b, msg) => { if (a !== b) { fails++; console.log('  ✗', msg, JSON.stringify(a), '!=', JSON.stringify(b)); } else console.log('  ✓', msg); };
const sh = Shell.create({ tree: { home: { me: { 'memo.txt': 'hello\n', src: { 'main.py': 'print(1)\n' } } } } });
eq(sh.exec('pwd').out, '/home/me\n', 'pwd');
eq(sh.exec('ls').out, 'memo.txt  src\n', 'ls');
eq(sh.exec('cd src && pwd').out, '/home/me/src\n', 'cd && pwd');
eq(sh.exec('cd ..; mkdir -p a/b/c && ls a/b').out, 'c\n', 'mkdir -p');
eq(sh.exec('cat memo.txt').out, 'hello\n', 'cat');
eq(sh.exec('cat nope').err, 'cat: nope: No such file or directory\n', 'cat 에러 문구');
eq(sh.exec('rm src').err, "rm: cannot remove 'src': Is a directory\n", 'rm 폴더 거부');
eq(sh.exec('rm -r src && ls').out, 'a  memo.txt\n', 'rm -r');
eq(sh.exec('echo "hi there"').out, 'hi there\n', 'echo 따옴표');
eq(sh.exec('foo').code, 127, 'command not found');
eq(sh.state().cwd, '/home/me', 'state.cwd');
eq(JSON.stringify(sh.state().tree.home.me.a), '{"b":{"c":{}}}', 'state.tree');
console.log(fails ? `✗ test_shell 실패 ${fails}` : '✓ test_shell OK'); process.exit(fails ? 1 : 0);
