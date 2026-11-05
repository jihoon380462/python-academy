#!/usr/bin/env node
// tools/test_shell.mjs — 셸·Git 시뮬레이터 자가 테스트 (Node). `node tools/test_shell.mjs`. 검증 명령 묶음에 포함(NEXT.md 0절).
import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const Shell = require('../core/runners/shell.js');
let fails = 0, n = 0; const eq = (a, b, msg) => { n++; if (a !== b) { fails++; console.log('  ✗', msg, '\n      got:', JSON.stringify(a), '\n      want:', JSON.stringify(b)); } else console.log('  ✓', msg); };
const ok = (c, msg) => { n++; if (!c) { fails++; console.log('  ✗', msg); } else console.log('  ✓', msg); };

console.log('[셸]');
{ const sh = Shell.create({ tree: { home: { me: { 'memo.txt': 'hello\nworld\n', src: { 'main.py': 'print(1)\n', 'util.py': 'x = 1\n' }, 'notes.md': '# a\n' } } } });
  eq(sh.exec('pwd').out, '/home/me\n', 'pwd');
  eq(sh.exec('ls').out, 'memo.txt  notes.md  src/\n', 'ls (폴더는 /)');
  // PR#94 P1-08·P1-19: 파이프·> 로 나가면 한 줄에 하나(진짜 셸처럼), -1, 2> · 2>&1 · /dev/null
  eq(sh.exec('ls | wc -l').out.trim(), '3', 'ls | wc -l = 항목 수');
  eq(sh.exec('ls | head -n 1').out, 'memo.txt\n', 'ls | head -n 1');
  eq(sh.exec('ls -1').out, 'memo.txt\nnotes.md\nsrc/\n', 'ls -1');
  eq(sh.exec('ls > list.txt && cat list.txt').out, 'memo.txt\nnotes.md\nsrc\n', 'ls > 파일 은 한 줄에 하나');
  sh.exec('rm list.txt');
  eq(sh.exec('cat nope.txt 2>/dev/null').err, '', '2>/dev/null 은 에러를 버림');
  eq(sh.exec('ls > /dev/null').out, '', '> /dev/null 은 출력을 버림');
  eq(sh.exec('cat nope.txt 2>&1 | wc -l').out.trim(), '1', '2>&1 은 에러를 출력으로');
  eq(sh.exec('cat nope.txt 2> err.txt && cat err.txt').out, '', '2> 파일: 실패라 && 뒤는 안 감');
  ok((sh.exec('cat err.txt').out || '').includes('No such file'), '2> 파일 에 에러가 적힘'); sh.exec('rm err.txt');
  eq(sh.exec('cd src && pwd').out, '/home/me/src\n', 'cd && pwd');
  eq(sh.exec('cd ..; mkdir -p a/b/c && ls a/b').out, 'c/\n', 'mkdir -p');
  eq(sh.exec('cat memo.txt').out, 'hello\nworld\n', 'cat');
  eq(sh.exec('cat nope').err, 'cat: nope: No such file or directory\n', 'cat 에러 문구');
  eq(sh.exec('echo hi > out.txt && cat out.txt').out, 'hi\n', '리다이렉션 >');
  eq(sh.exec('echo again >> out.txt && cat out.txt').out, 'hi\nagain\n', '리다이렉션 >>');
  eq(sh.exec('ls src/*.py').out, 'src/main.py\nsrc/util.py\n', '와일드카드 *');
  eq(sh.exec('cat memo.txt | wc -l').out, '2\n', '파이프 | wc -l');
  eq(sh.exec('grep -n world memo.txt').out, '2:world\n', 'grep -n');
  eq(sh.exec('grep -r print .').out, './src/main.py:print(1)\n', 'grep -r');
  eq(sh.exec('grep zzz memo.txt').code, 1, 'grep 매치 없음 → code 1');
  eq(sh.exec('find . -name "*.py"').out, './src/main.py\n./src/util.py\n', 'find -name');
  eq(sh.exec('head -n 1 memo.txt').out, 'hello\n', 'head -n');
  eq(sh.exec('tail -n 1 memo.txt').out, 'world\n', 'tail -n');
  eq(sh.exec('cp memo.txt copy.txt && cat copy.txt').out, 'hello\nworld\n', 'cp');
  eq(sh.exec('cp src dst').err, "cp: -r not specified; omitting directory 'src'\n", 'cp 폴더 -r 없음');
  eq(sh.exec('cp -r src dst && ls dst').out, 'main.py  util.py\n', 'cp -r');
  eq(sh.exec('mv copy.txt renamed.txt && ls renamed.txt').out, 'renamed.txt\n', 'mv 이름 바꾸기');
  eq(sh.exec('mv renamed.txt a/ && ls a').out, 'b/  renamed.txt\n', 'mv 폴더로');
  eq(sh.exec('rm src').err, "rm: cannot remove 'src': Is a directory\n", 'rm 폴더 거부');
  eq(sh.exec('rm -r dst && ls').out, 'a/  memo.txt  notes.md  out.txt  src/\n', 'rm -r');
  eq(sh.exec('rm -rf /').code, 1, 'rm -rf / 거부');
  eq(sh.exec('echo $HOME').out, '/home/me\n', '$HOME');
  eq(sh.exec('cd ~ && pwd').out, '/home/me\n', '~');
  eq(sh.exec('foo').code, 127, 'command not found');
  ok(sh.exec('tree src').out.includes('├── main.py') && sh.exec('tree src').out.includes('1 directories, 2 files') === false, 'tree 출력');
  eq(sh.exec('history | tail -n 1').out.trim().endsWith('history | tail -n 1'), true, 'history 파이프');
  eq(sh.exec('edit memo.txt').code, 3, 'edit → 편집기 요청 code 3');
  eq(sh.exec('edit memo.txt "new text"').out + sh.exec('cat memo.txt').out, 'new text\n', 'edit 파일 "내용" (테스트용 직접 쓰기)');
  eq(sh.state().cwd, '/home/me', 'state.cwd');
  eq(JSON.stringify(sh.state().tree.home.me.a), '{"b":{"c":{}},"renamed.txt":"hello\\nworld\\n"}', 'state.tree');
}

console.log('[Git 기초: init / add / commit / status / log / diff / restore / reset]');
{ const sh = Shell.create({ tree: { home: { me: { proj: {} } } }, cwd: '/home/me/proj' });
  eq(sh.exec('git status').code, 128, 'init 전 status → not a git repository');
  ok(sh.exec('git init').out.startsWith('Initialized empty Git repository in /home/me/proj/.git/'), 'git init');
  ok(sh.exec('git status').out.includes('No commits yet'), 'status: No commits yet');
  sh.exec('echo print(1) > main.py'); ok(sh.exec('git status').out.includes('Untracked files') && sh.exec('git status').out.includes('\tmain.py'), 'status: untracked');
  sh.exec('git add main.py'); ok(sh.exec('git status').out.includes('new file:   main.py'), 'add → staged new file');
  const c1 = sh.exec('git commit -m "first"'); ok(/\[main \(root-commit\) [0-9a-f]{7}\] first/.test(c1.out), 'commit root');
  ok(sh.exec('git status').out.includes('nothing to commit, working tree clean'), 'status clean');
  sh.exec('echo print(2) >> main.py'); ok(sh.exec('git status').out.includes('modified:   main.py') && sh.exec('git status').out.includes('not staged'), 'status: modified (unstaged)');
  ok(sh.exec('git diff').out.includes('+print(2)') && !sh.exec('git diff --staged').out, 'diff 작업↔스테이징');
  sh.exec('git add .'); ok(sh.exec('git diff --staged').out.includes('+print(2)'), 'diff --staged');
  sh.exec('git commit -m "second"'); const log = sh.exec('git log --oneline').out.split('\n').filter(Boolean); eq(log.length, 2, 'log 2줄'); ok(log[0].includes('(HEAD -> main) second'), 'log 최신이 위 + HEAD 라벨');
  eq(sh.exec('git commit -m "nothing"').code, 1, '변경 없이 commit → 실패');
  sh.exec('echo bad >> main.py'); sh.exec('git restore main.py'); eq(sh.exec('cat main.py').out, 'print(1)\nprint(2)\n', 'restore 파일 되돌리기');
  sh.exec('echo x > x.txt && git add x.txt && git restore --staged x.txt'); ok(sh.exec('git status').out.includes('Untracked files'), 'restore --staged');
  sh.exec('rm x.txt');
  sh.exec('git reset --soft HEAD~1'); ok(sh.exec('git status').out.includes('Changes to be committed') && sh.exec('git log --oneline').out.split('\n').filter(Boolean).length === 1, 'reset --soft: 커밋만 취소, 스테이징 유지');
  sh.exec('git commit -m "second again"'); sh.exec('git reset --mixed HEAD~1'); ok(sh.exec('git status').out.includes('not staged') && sh.exec('cat main.py').out.includes('print(2)'), 'reset --mixed: 스테이징 취소, 작업 유지');
  sh.exec('git reset --hard HEAD'); eq(sh.exec('cat main.py').out, 'print(1)\n', 'reset --hard: 작업까지 되돌림');
  sh.exec('echo "*.log" > .gitignore && echo junk > debug.log && git add -A'); ok(!sh.exec('git status').out.includes('debug.log') && sh.exec('git status').out.includes('.gitignore'), '.gitignore 무시');
  sh.exec('git commit -m "ignore"'); ok(sh.exec('git commit --amend -m "ignore logs"').out.includes('ignore logs') && sh.exec('git log --oneline').out.split('\n')[0].includes('ignore logs'), 'commit --amend');
  const st = sh.state().git; eq(st.branches.join(','), 'main', 'state.git.branches'); eq(st.head, 'main', 'state.git.head'); eq(st.clean, true, 'state.git.clean');
}

console.log('[브랜치·병합·충돌·rebase·stash]');
{ const sh = Shell.create({ cwd: '/home/me/p', git: { root: '/home/me/p', commits: [{ message: 'init', files: { 'a.txt': 'one\n', 'b.txt': 'b\n' } }] } });
  eq(sh.exec('git branch').out, '* main\n', 'branch 목록');
  ok(sh.exec('git switch -c feat').out.includes("Switched to a new branch 'feat'"), 'switch -c');
  sh.exec('echo two >> a.txt && git commit -am "feat work"'); sh.exec('git switch main'); eq(sh.exec('cat a.txt').out, 'one\n', 'switch 시 작업 트리 교체');
  ok(sh.exec('git merge feat').out.includes('Fast-forward'), 'fast-forward merge'); eq(sh.exec('cat a.txt').out, 'one\ntwo\n', 'ff 후 파일');
  sh.exec('git switch -c side && echo side > b.txt && git commit -am "side b"'); sh.exec('git switch main && echo main-c > c.txt && git add c.txt && git commit -m "main c"');
  ok(sh.exec('git merge side').out.includes("Merge made by the 'ort' strategy"), '3-way merge (다른 파일)'); eq(sh.exec('cat b.txt').out, 'side\n', '3-way 결과'); ok(sh.exec('git log --oneline --graph').out.split('\n')[0].startsWith('* '), 'log --graph');
  sh.exec('git switch -c conf && echo X > a.txt && git commit -am "conf a"'); sh.exec('git switch main && echo Y > a.txt && git commit -am "main a"');
  const m = sh.exec('git merge conf'); ok(m.code !== 0 && m.err.includes('CONFLICT (content): Merge conflict in a.txt'), '충돌 감지');
  ok(sh.exec('cat a.txt').out.includes('<<<<<<< HEAD') && sh.exec('cat a.txt').out.includes('>>>>>>> conf'), '충돌 마커 삽입'); ok(sh.exec('git status').out.includes('Unmerged paths'), 'status: unmerged');
  eq(sh.exec('git commit -m "x"').code, 1, '충돌 중 commit 거부');
  sh.exec('git merge --abort'); eq(sh.exec('cat a.txt').out, 'Y\n', 'merge --abort 복구');
  sh.exec('git merge conf'); sh.exec('edit a.txt "XY"'); sh.exec('git add a.txt'); const mc = sh.exec('git commit -m "resolve"'); eq(mc.code, 0, '충돌 해소 후 commit'); const top = sh.state().git.log.slice(-1)[0]; eq(top.parents.length, 2, '병합 커밋 부모 2개'); eq(sh.state().git.conflicts.length, 0, '마커 없음');
  // rebase
  sh.exec('git switch -c rb && echo r > r.txt && git add r.txt && git commit -m "rb1"'); sh.exec('git switch main && echo m > m.txt && git add m.txt && git commit -m "m1"'); sh.exec('git switch rb');
  ok(sh.exec('git rebase main').out.includes('Successfully rebased'), 'rebase'); const lg = sh.exec('git log --oneline').out.split('\n').filter(Boolean); ok(lg[0].includes('rb1') && lg[1].includes('m1'), 'rebase 후 일직선 역사'); eq(sh.exec('cat m.txt').out, 'm\n', 'rebase 후 파일 포함');
  // stash
  sh.exec('echo wip >> r.txt'); ok(sh.exec('git stash').out.startsWith('Saved working directory'), 'stash push'); eq(sh.exec('cat r.txt').out, 'r\n', 'stash 후 작업 트리 깨끗'); ok(sh.exec('git stash list').out.includes('stash@{0}'), 'stash list'); sh.exec('git stash pop'); eq(sh.exec('cat r.txt').out, 'r\nwip\n', 'stash pop 복원');
  eq(sh.exec('git branch -d rb').code, 1, '지금 서 있는 브랜치 삭제 거부');
  sh.exec('git switch main'); eq(sh.exec('git branch -d side').out, 'Deleted branch side.\n', 'branch -d (병합됨)'); eq(sh.exec('git branch -d rb').code, 1, 'branch -d 미병합 거부');
  sh.exec('git tag v1'); ok(sh.exec('git log --oneline').out.includes('tag: v1'), 'tag');
}

console.log('[원격: remote / push / pull / clone / 동료 푸시 충돌]');
{ const sh = Shell.create({ cwd: '/home/me/p', git: { root: '/home/me/p', commits: [{ message: 'init', files: { 'README.md': '# p\n' } }] } });
  eq(sh.exec('git push').code, 128, 'remote 없이 push → 실패');
  sh.exec('git remote add origin https://github.com/me/p.git'); ok(sh.exec('git remote -v').out.includes('origin\thttps://github.com/me/p.git (push)'), 'remote -v');
  eq(sh.exec('git push').code, 128, 'upstream 없이 push → 안내');
  ok(sh.exec('git push -u origin main').out.includes('[new branch]      main -> main'), 'push -u'); eq(sh.state().git.remoteBranches.origin.join(','), 'main', '원격 브랜치 생김');
  ok(sh.exec('git status').out.includes("up to date with 'origin/main'"), 'status 추적 정보');
  sh.exec('echo a > a.txt && git add a.txt && git commit -m "a"'); ok(sh.exec('git status').out.includes('ahead of'), 'ahead 표시'); eq(sh.exec('git push').code, 0, 'push (upstream 설정됨)');
  // 동료가 원격에 푸시한 상황 시뮬레이션: 원격 저장소에 직접 커밋을 심는다
  const r = sh.remotes.origin; const base = r.branches.main; const h = Shell.hash('peer1'); r.commits[h] = { hash: h, parents: [base], message: 'peer adds b', snapshot: Object.assign({}, r.commits[base].snapshot, { 'b.txt': 'peer\n' }), n: ++r.seq, author: '동료' }; r.branches.main = h;
  sh.exec('echo c > c.txt && git add c.txt && git commit -m "c"'); const p = sh.exec('git push'); ok(p.code !== 0 && p.err.includes('[rejected]') && p.err.includes('fetch first'), 'push 거부(원격이 앞섬)');
  const pl = sh.exec('git pull'); eq(pl.code, 0, 'pull → 자동 병합'); eq(sh.exec('cat b.txt').out, 'peer\n', 'pull 후 동료 파일'); ok(sh.exec('git log --oneline').out.includes("Merge branch 'main' of"), '병합 커밋 메시지');
  eq(sh.exec('git push').code, 0, '병합 후 push 성공');
  // 같은 파일 충돌
  const h2 = Shell.hash('peer2'); const b2 = r.branches.main; r.commits[h2] = { hash: h2, parents: [b2], message: 'peer edits a', snapshot: Object.assign({}, r.commits[b2].snapshot, { 'a.txt': 'peer-a\n' }), n: ++r.seq, author: '동료' }; r.branches.main = h2;
  sh.exec('echo my-a > a.txt && git commit -am "my a"'); const pl2 = sh.exec('git pull'); ok(pl2.code !== 0 && pl2.err.includes('CONFLICT'), 'pull 충돌'); ok(sh.exec('cat a.txt').out.includes('>>>>>>> origin/main') || sh.exec('cat a.txt').out.includes('>>>>>>>'), 'pull 충돌 마커');
  sh.exec('edit a.txt "both"'); sh.exec('git add a.txt && git commit -m "resolve a"'); eq(sh.exec('git push').code, 0, '충돌 해소 후 push'); eq(sh.state().git.conflicts.length, 0, '마커 없음');
  // clone
  const sh2 = Shell.create({ cwd: '/home/me', remote: { commits: [{ message: 'init', files: { 'README.md': 'hi\n' } }, { message: 'more', files: { 'x.txt': 'x\n' } }] } });
  ok(sh2.exec('git clone https://github.com/team/origin.git').out.includes("Cloning into 'origin'"), 'clone'); sh2.exec('cd origin'); eq(sh2.exec('cat x.txt').out, 'x\n', 'clone 작업 트리'); eq(sh2.exec('git log --oneline').out.split('\n').filter(Boolean).length, 2, 'clone 역사'); ok(sh2.exec('git status').out.includes("up to date with 'origin/main'"), 'clone 추적');
}

console.log('[미션 채점 Grader.matchState]');
{ const fs = require('node:fs'); const vm = require('node:vm'); const path = require('node:path'); const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
  const ctx = { console }; vm.createContext(ctx); vm.runInContext(['core/config.js', 'core/util.js', 'shared/errors.js', 'shared/glossary.js', 'shared/badges.js', 'courses/python/content.js', 'core/storage.js', 'core/sync.js', 'core/engine.js', 'core/runners/shell.js'].map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n') + '\n;this.__G=Grader;this.__S=Shell;', ctx);
  const G = ctx.__G, S = ctx.__S;
  const sh = S.create({ cwd: '/home/me', tree: { home: { me: { projects: { web: { 'index.html': '' }, api: {} } } } } });
  eq(G.matchState(sh.state(), { cwd: '/home/me/projects/web' }).ok, false, '미션: cwd 불일치');
  sh.exec('cd ~/projects/web'); eq(G.matchState(sh.state(), { cwd: '/home/me/projects/web', files: { '/home/me/projects/web/index.html': '' }, dirs: ['/home/me/projects/api'] }).ok, true, '미션: cwd·files·dirs');
  eq(G.matchState(sh.state(), { commits: 1 }).fails[0], 'git 저장소가 아니에요 (git init 부터)', '미션: git 없음 안내');
  sh.exec('git init && echo a > a.txt && git add . && git commit -m "first commit" && git switch -c feat');
  const r = G.matchState(sh.state(), { commits: 1, branches: ['main', 'feat'], head: 'feat', clean: true, messages: ['first'], forbid: ['rm -rf /'], historyIncludes: ['git add'] }); eq(r.ok, true, '미션: git 항목 전부 통과 ' + JSON.stringify(r.fails));
  eq(G.matchState(sh.state(), { pushed: true }).fails[0], 'feat 브랜치를 origin 에 push 해야 해요', '미션: pushed 안내');
  sh.exec('git remote add origin https://x/y.git && git push -u origin feat'); eq(G.matchState(sh.state(), { pushed: true, remoteBranches: { origin: ['feat'] } }).ok, true, '미션: pushed');
  sh.exec('echo b > b.txt && git add . && git commit -m "b"'); eq(G.matchState(sh.state(), { pushed: true }).fails[0], '마지막 커밋이 아직 push 되지 않았어요', '미션: 커밋 후 미push');
}
console.log(fails ? `✗ test_shell 실패 ${fails}/${n}` : `✓ test_shell OK (${n})`); process.exit(fails ? 1 : 0);
