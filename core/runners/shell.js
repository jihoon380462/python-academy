// core/runners/shell.js — 터미널·Git 코스(Phase 2, v2.3.0)의 가상 파일시스템 + 셸 + Git 시뮬레이터 **뼈대**.
// 상태: 뼈대(v2.2.0에서 추가). VFS와 기본 셸 명령 8개는 동작, 파이프·리다이렉션·Git은 TODO. 채우는 순서는 NEXT.md WP-B 참고.
// 설계(EXPANSION.md 6절): 실제 셸·isomorphic-git을 쓰지 않고 메모리 트리 위에 직접 구현 → 결과가 결정적이라 채점(grader:'state')이 쉽다.
//   사용:  const sh = Shell.create(setupJson);  sh.exec('mkdir -p a/b && ls a')  →  { out:'b\n', err:'', code:0 }
//          sh.state()  → { cwd, tree:{...}, git:{commits, branches, head, staged, remote} }  (Grader.state 가 기대값과 비교)
//   setupJson 형식: { cwd?: '/home/me', tree: { 'home': { 'me': { 'memo.txt': 'hello', 'src': {} } } } }  — 객체=폴더, 문자열=파일 내용
//   에러 메시지는 bash 원문(영문) 그대로 내고, 한국어 풀이는 shared/errors.js 의 셸 섹션(ERRORS.shell, TODO)에서 찾는다.
const Shell = {
  HOME: '/home/me',
  create(setup) { const sh = Object.create(this.proto); sh.root = this.buildTree((setup && setup.tree) || { home: { me: {} } }); sh.cwd = (setup && setup.cwd) || this.HOME; sh.history = []; sh.git = null; sh.env = { HOME: this.HOME, USER: 'me' }; if (!sh.node(sh.cwd)) sh.mkdirp(sh.cwd); return sh; },
  buildTree(obj) { const dir = { type: 'dir', children: {} }; for (const [k, v] of Object.entries(obj)) dir.children[k] = typeof v === 'string' ? { type: 'file', content: v } : this.buildTree(v); return dir; },
  // 지원 명령 표 — 레슨/놀이터의 자동완성·칩·문서(DESIGN.md 14절 "지원 명령 표")가 이 목록을 쓴다. 구현한 것만 impl:true 로 바꿀 것.
  COMMANDS: {
    pwd: { impl: true }, ls: { impl: true, flags: ['-l', '-a'] }, cd: { impl: true }, mkdir: { impl: true, flags: ['-p'] }, touch: { impl: true }, cat: { impl: true }, echo: { impl: true }, rm: { impl: true, flags: ['-r', '-f'] },
    cp: { impl: false, flags: ['-r'] }, mv: { impl: false }, head: { impl: false, flags: ['-n'] }, tail: { impl: false, flags: ['-n'] }, wc: { impl: false, flags: ['-l', '-w', '-c'] }, grep: { impl: false, flags: ['-n', '-i', '-r'] }, find: { impl: false, flags: ['-name'] }, tree: { impl: false }, history: { impl: false }, clear: { impl: false },
    edit: { impl: false, note: '가상 편집기: edit 파일 → UI가 편집창을 띄우고 저장하면 VFS에 씀(nano/vim 대신)' },
    git: { impl: false, sub: ['init', 'status', 'add', 'commit', 'log', 'diff', 'restore', 'reset', 'branch', 'switch', 'checkout', 'merge', 'rebase', 'stash', 'remote', 'push', 'pull', 'clone', 'tag'] },
  },
  proto: {
    // ---------- 경로·트리 ----------
    resolve(p) { if (!p) return this.cwd; p = p.replace(/^~(?=\/|$)/, Shell.HOME).replace(/\$HOME/g, Shell.HOME); const parts = (p.startsWith('/') ? [] : this.cwd.split('/').filter(Boolean)); for (const seg of p.split('/')) { if (!seg || seg === '.') continue; if (seg === '..') parts.pop(); else parts.push(seg); } return '/' + parts.join('/'); },
    node(abs) { let n = this.root; for (const seg of abs.split('/').filter(Boolean)) { if (n.type !== 'dir' || !n.children[seg]) return null; n = n.children[seg]; } return n; },
    parentOf(abs) { const parts = abs.split('/').filter(Boolean); const name = parts.pop(); return { dir: this.node('/' + parts.join('/')), name }; },
    mkdirp(abs) { let n = this.root; for (const seg of abs.split('/').filter(Boolean)) { if (!n.children[seg]) n.children[seg] = { type: 'dir', children: {} }; n = n.children[seg]; if (n.type !== 'dir') return null; } return n; },
    // ---------- 실행 ----------
    // 한 줄을 받아 실행. && ; 로 나눈 각 명령을 차례로. TODO(WP-B): 파이프 |, 리다이렉션 > >>, 와일드카드 *, 따옴표 안 공백, 환경변수 $VAR
    exec(line) { this.history.push(line); let out = '', err = '', code = 0; for (const seg of this.split(line)) { if (seg.op === '&&' && code !== 0) break; const r = this.one(seg.cmd); out += r.out; err += r.err; code = r.code; } return { out, err, code }; },
    split(line) { const segs = []; let cur = '', op = ';', q = null; for (let i = 0; i < line.length; i++) { const ch = line[i]; if (q) { cur += ch; if (ch === q) q = null; continue; } if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; } if (line.startsWith('&&', i)) { segs.push({ cmd: cur.trim(), op }); cur = ''; op = '&&'; i++; continue; } if (ch === ';') { segs.push({ cmd: cur.trim(), op }); cur = ''; op = ';'; continue; } cur += ch; } if (cur.trim()) segs.push({ cmd: cur.trim(), op }); return segs.filter(s => s.cmd); },
    argv(cmd) { const a = []; let cur = '', q = null, had = false; for (const ch of cmd) { if (q) { if (ch === q) q = null; else cur += ch; continue; } if (ch === '"' || ch === "'") { q = ch; had = true; continue; } if (/\s/.test(ch)) { if (cur || had) { a.push(cur); cur = ''; had = false; } continue; } cur += ch; } if (cur || had) a.push(cur); return a; },
    one(cmd) { const a = this.argv(cmd); if (!a.length) return { out: '', err: '', code: 0 }; const name = a[0], args = a.slice(1); const flags = args.filter(x => x.startsWith('-')), rest = args.filter(x => !x.startsWith('-')); const fn = this.cmds[name]; if (!fn) return { out: '', err: `bash: ${name}: command not found\n`, code: 127 }; try { return fn.call(this, rest, flags, args); } catch (e) { return { out: '', err: `${name}: ${e.message}\n`, code: 1 }; } },
    ok(out = '') { return { out, err: '', code: 0 }; },
    fail(err) { return { out: '', err: err + '\n', code: 1 }; },
    // ---------- 명령 (bash 와 같은 문구) ----------
    cmds: {
      pwd() { return this.ok(this.cwd + '\n'); },
      cd(rest) { const target = this.resolve(rest[0] || '~'); const n = this.node(target); if (!n) return this.fail(`bash: cd: ${rest[0]}: No such file or directory`); if (n.type !== 'dir') return this.fail(`bash: cd: ${rest[0]}: Not a directory`); this.cwd = target; return this.ok(); },
      ls(rest, flags) { const targets = rest.length ? rest : ['.']; const all = flags.includes('-a'), long = flags.includes('-l'); let out = ''; for (const t of targets) { const abs = this.resolve(t); const n = this.node(abs); if (!n) { out += `ls: cannot access '${t}': No such file or directory\n`; continue; } if (n.type === 'file') { out += t + '\n'; continue; } const names = Object.keys(n.children).sort(); if (targets.length > 1) out += `${t}:\n`; const rows = (all ? ['.', '..'] : []).concat(names.filter(x => all || !x.startsWith('.'))); out += long ? rows.map(x => { const c = n.children[x]; return `${c && c.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--'} 1 me me ${c && c.type === 'file' ? c.content.length : 4096} ${x}`; }).join('\n') + (rows.length ? '\n' : '') : rows.join('  ') + (rows.length ? '\n' : ''); } return this.ok(out); },
      mkdir(rest, flags) { if (!rest.length) return this.fail('mkdir: missing operand'); let err = ''; for (const t of rest) { const abs = this.resolve(t); if (flags.includes('-p')) { this.mkdirp(abs); continue; } const { dir, name } = this.parentOf(abs); if (!dir || dir.type !== 'dir') { err += `mkdir: cannot create directory '${t}': No such file or directory\n`; continue; } if (dir.children[name]) { err += `mkdir: cannot create directory '${t}': File exists\n`; continue; } dir.children[name] = { type: 'dir', children: {} }; } return { out: '', err, code: err ? 1 : 0 }; },
      touch(rest) { if (!rest.length) return this.fail('touch: missing file operand'); for (const t of rest) { const abs = this.resolve(t); const { dir, name } = this.parentOf(abs); if (!dir) return this.fail(`touch: cannot touch '${t}': No such file or directory`); if (!dir.children[name]) dir.children[name] = { type: 'file', content: '' }; } return this.ok(); },
      cat(rest) { let out = '', err = ''; for (const t of rest) { const n = this.node(this.resolve(t)); if (!n) err += `cat: ${t}: No such file or directory\n`; else if (n.type === 'dir') err += `cat: ${t}: Is a directory\n`; else out += n.content; } return { out, err, code: err ? 1 : 0 }; },
      echo(rest, flags, args) { return this.ok(args.filter(x => x !== '-n').map(x => x.replace(/\$HOME/g, Shell.HOME)).join(' ') + (flags.includes('-n') ? '' : '\n')); }, // TODO(WP-B): > >> 리다이렉션은 exec 단계에서 처리
      rm(rest, flags) { if (!rest.length) return this.fail('rm: missing operand'); let err = ''; for (const t of rest) { const abs = this.resolve(t); if (abs === '/' || abs === Shell.HOME) { err += `rm: it is dangerous to operate recursively on '${t}'\n`; continue; } const { dir, name } = this.parentOf(abs); const n = dir && dir.children[name]; if (!n) { if (!flags.includes('-f')) err += `rm: cannot remove '${t}': No such file or directory\n`; continue; } if (n.type === 'dir' && !flags.includes('-r')) { err += `rm: cannot remove '${t}': Is a directory\n`; continue; } delete dir.children[name]; } return { out: '', err, code: err ? 1 : 0 }; },
      // TODO(WP-B): cp mv head tail wc grep find tree history clear edit — COMMANDS 표 참고
      git(rest) { return this.fail("git: 아직 구현 전 (NEXT.md WP-B 3단계). 내부 모델 초안은 Shell.gitModel 참고"); },
    },
    // ---------- 채점용 상태 ----------
    // Grader(grader:'state')는 문제의 expect 와 이 결과를 비교한다. expect 에 적힌 항목만 본다 (EXPANSION.md 6절 "채점").
    state() { const tree = (n) => n.type === 'file' ? n.content : Object.fromEntries(Object.entries(n.children).map(([k, v]) => [k, tree(v)])); return { cwd: this.cwd, tree: tree(this.root), history: this.history.slice(), git: this.git ? this.git.snapshot() : null }; },
  },
  // ---------- Git 내부 모델 초안 (TODO WP-B 3단계에서 채움) ----------
  // commit: { hash(7자리), parents:[hash], message, snapshot:{path:content}, time }  · branches: {name: hash} · head: {branch} | {detached: hash}
  // staged: {path:content|null(삭제)} · remote: { name:'origin', branches:{}, commits:{} } · stash: [snapshot]
  gitModel() { return { commits: {}, branches: {}, head: { branch: 'main' }, staged: {}, remote: null, stash: [], snapshot() { return { commits: Object.keys(this.commits).length, branches: Object.keys(this.branches), head: this.head, staged: Object.keys(this.staged), remote: this.remote ? { branches: Object.keys(this.remote.branches) } : null }; } }; },
};
if (typeof module !== 'undefined') module.exports = Shell; // tools/test_shell.mjs 에서 Node로 자가 테스트
