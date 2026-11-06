// courses/github/book.js — 「GitHub 교과서」 데이터 (v2.16.0, 설계 specs/github-course.md). 화면은 core/ui-views-book.js(다른 교과서와 같은 틀).
// 연습: 사용자의 진짜 GitHub 계정(github.com) + Git Bash. 계정은 하나(이용약관) → 혼자 작성자·리뷰어 두 역할.
// tasks 두 종류(check_book 의 BOOK.check === 'github'):
//   ① GitHub 화면에서 하는 것 — noRun: true + checks(「내 GitHub 화면에서 확인할 것」 ☐, 글만) + answer(단계). 자동 검사 불가 → checks 가 없으면 check_book 실패
//   ② 내 컴퓨터 Git 으로 하는 것 — setup(준비 명령, 원격은 로컬 bare 저장소로 대신) + answer + check → io[0].output 과 bash 실행 결과 비교(터미널 교과서와 같은 방식)
// 화면 이름: docs.github.com 원문(github/docs 저장소 2026-11)으로 확인 — 예: data/reusables/repositories/initialize-with-readme.md 「Toggle Add README to On」
const GS = (name) => `cd ~ && mkdir -p github-study && cd github-study && rm -rf ${name} && mkdir ${name} && cd ${name}`;
const BOOK = {
  check: 'github',
  meta: {
    prereq: [
      { lessons: ['G0'], chapters: [1], ref: 'SETUP/0', btn: '시작하기 1 · 준비물 보기',
        title: '먼저 꼭! 터미널·Git 교과서 레슨 6(Git 설정)·레슨 16(실제 GitHub 첫 push)',
        html: '이 교과서는 <b>Git 명령을 다시 가르치지 않아요</b>. 이름·이메일 설정(<code>git config --global user.name</code>)과 GitHub 계정·첫 push 로그인이 안 돼 있으면 레슨 1 부터 막혀요. 확인: Git Bash 에서 <code>git config --global user.name</code> 이 내 이름을 보여 주고, 내 GitHub 에 저장소가 하나 이상 있으면 준비 끝.' },
      { lessons: ['G1'],
        title: '꼭! 2단계 인증(2FA)과 복구 코드 저장',
        html: 'GitHub 은 코드를 올리는 계정에 2FA 를 요구해요. 켤 때 받는 <b>복구 코드</b>(<code>github-recovery-codes.txt</code>)를 잃어버리고 폰까지 잃으면 계정을 되찾기 어려워요. 1쪽 그대로 하고, 복구 코드는 저장소 폴더가 아닌 안전한 곳에.' },
      { lessons: ['G2', 'G3', 'G4', 'GB1'], ref: 'G1/1', btn: '레슨 1 · 2쪽 이메일 비공개 보기',
        title: '공개 저장소의 커밋에는 이메일이 그대로 남아요 — 레슨 1 의 noreply 설정 먼저',
        html: '<b>Settings → Emails → ☑ Keep my email addresses private</b> 를 켜고, 내 컴퓨터는 <code>git config --global user.email "숫자+아이디@users.noreply.github.com"</code>. 이미 올린 커밋은 안 바뀌어요 — 공개 저장소를 만들기 전에 해 두세요.' },
    ],
    kicker: '🐙 GitHub 교과서', hero: '내 진짜 GitHub 계정으로 올리고, 같이 고치고, 공개하기',
    heroP: 'Git 명령은 터미널·Git 교과서에서 배웠죠. 여기서는 <b>GitHub 이라는 웹 서비스</b>로 저장소를 꾸미고, Pull Request 로 협업하고, Actions·Pages 로 자동화·공개해요. 연습은 전부 내 계정의 진짜 화면에서 — 레슨 끝 「만들어 보기」 의 ☐ 목록을 내 화면에서 확인하면 완성이에요.',
    dexName: 'GitHub 도감', dexShort: '도감', dexWhat: '화면·명령', dexHint: '「비공개」「라이선스」 처럼 한국어로도 찾기',
    dexExamples: '<code>README</code>, <code>SSH</code>, <code>라이선스</code>, <code>pull</code>', dexPlaceholder: '🔍 찾기 — README, SSH, 라이선스, 2FA …', dexAlt: '「설명 파일」 대신 <code>README</code>',
    dexDocs: 'GitHub 공식 문서 <a href="https://docs.github.com/ko" target="_blank" rel="noopener">docs.github.com/ko</a>',
    dexRun: '명령은 📋 복사해서 Git Bash 에, Markdown 은 README 에 붙여 볼 수 있고', builtinsName: 'Markdown · 자주 쓰는 것', builtinsSub: 'README·이슈·PR·코멘트 어디서나', builtinsChip: '📝 Markdown',
    copyToast: '📋 복사했어요. Git Bash 창에서 마우스 오른쪽 → Paste (또는 Shift+Insert)', exampleLabel: '예제 명령 — Git Bash 에서',
    makeIntro: '브라우저의 <b>내 GitHub</b> 과 <b>Git Bash</b> 를 같이 열어 두고 해요. 「내 GitHub 화면에서 확인할 것」 ☐ 을 하나씩 확인하면 완성이에요. 명령이 있는 문제는 먼저 <b>준비 명령</b>을 Git Bash 에 붙여 넣어 연습 폴더(<code>~/github-study</code>)를 처음 상태로 만들어요.',
    makeTail: '막히면 「필요한 화면·명령」 을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 화면 이름이 조금 다르면 같은 자리의 비슷한 글자를 찾으세요(GitHub 은 화면을 자주 다듬어요).',
    fileExt: '', setupLabel: '준비 명령 — Git Bash 에 붙여 넣기(연습 폴더를 처음 상태로)', answerLabel: '예시 답', needsLabel: '필요한 화면·명령',
    checkLabel: '확인 명령', outLabel: '이렇게 나오면 성공', inLabel: '입력', checksLabel: '내 GitHub 화면에서 확인할 것',
    homeNote: '<code>/c/Users/me</code> 의 <code>me</code> 자리는 내 Windows 사용자 이름이에요',
  },
  setup: {
    title: '시작하기: 내 GitHub 계정으로 공부할 준비',
    pages: [
      { title: '1. 준비물: Git 설정과 첫 push (터미널·Git 교과서 6·16)', html: `<p>이 교과서는 터미널·Git 교과서 다음이에요. 아래 세 가지가 돼 있으면 바로 시작해요. 안 돼 있으면 그 레슨을 먼저(새 탭으로 열려요 — 이 화면은 그대로 있어요).</p>
<div class="bk-step-box"><b>① Git for Windows 와 Git Bash</b><br>시작 메뉴에 <b>Git Bash</b> 가 있고, 열어서 <code>git --version</code> 이 버전을 보여 주면 OK. → <a href="../terminal-git/#lesson/SETUP" target="_blank" rel="noopener">터미널·Git 교과서 시작하기 ↗</a></div>
<div class="bk-step-box"><b>② 이름·이메일 설정</b><pre>git config --global user.name
git config --global user.email</pre>둘 다 값이 나오면 OK(이메일은 레슨 1 에서 noreply 로 바꿔요). → <a href="../terminal-git/#lesson/T6" target="_blank" rel="noopener">터미널·Git 교과서 레슨 6 ↗</a></div>
<div class="bk-step-box"><b>③ GitHub 계정과 첫 push</b><br><a href="https://github.com/" target="_blank" rel="noopener">github.com</a> 에 로그인되고, 내 저장소가 하나 이상 있으면 OK. push 할 때 뜨는 로그인 창(<b>Sign in with your browser</b>)도 한 번 해 봤어야 해요. → <a href="../terminal-git/#lesson/T16" target="_blank" rel="noopener">터미널·Git 교과서 레슨 16 ↗</a></div>
<p class="muted small">이 교과서에서 새로 배우는 Git 명령은 거의 없어요. 「필요한 화면·명령」 에 Git 명령이 나오면 터미널·Git 교과서의 그 레슨을 펴 보세요.</p>` },
      { title: '2. 꼭! 계정 안전: 2FA 와 이메일 비공개', html: `<p>공개 저장소를 만들기 <b>전에</b> 두 가지를 꼭 해요. 자세한 화면은 레슨 1 에 있어요.</p>
<div class="bk-step-box"><b>① 2단계 인증(2FA)</b><br>내 사진 → <b>Settings</b> → <b>Password and authentication</b> → <b>Enable two-factor authentication</b>. 끝에 받는 <b>복구 코드를 꼭 저장</b>.</div>
<div class="bk-step-box"><b>② 이메일 비공개</b><br>내 사진 → <b>Settings</b> → <b>Emails</b> → ☑ <b>Keep my email addresses private</b> → 그 아래 보이는 <code>숫자+아이디@users.noreply.github.com</code> 을 Git Bash 에서 <code>git config --global user.email "…"</code>.</div>
<div class="bk-warn"><b>비밀번호·토큰·복구 코드는 저장소에 절대 넣지 않아요.</b> 공개 저장소는 전 세계 누구나, 지운 뒤에도 기록(커밋)에서 볼 수 있어요.</div>` },
      { title: '3. 연습 폴더와 연습 저장소', html: `<p>두 군데에서 연습해요.</p>
<div class="bk-step-box"><b>① 내 컴퓨터: <code>~/github-study</code></b><br>「만들어 보기」 의 준비 명령이 이 폴더 안에 문제마다 따로 폴더를 만들어요(<code>~/github-study/g2-2</code> 처럼). GitHub 대신 같은 폴더의 <code>remote.git</code> 을 원격으로 써서, 실수해도 내 진짜 저장소는 안전해요.</div>
<div class="bk-step-box"><b>② GitHub: 연습 저장소 <code>github-study</code></b><br>레슨 2 에서 <b>Public</b> 으로 하나 만들어요. 웹에서 고치기·PR·Actions 연습은 전부 여기서. 망가지면 <b>Settings → 맨 아래 Danger Zone → Delete this repository</b> 로 지우고 다시 만들면 돼요.</div>
<p>실제로 보여 주고 싶은 프로젝트(보스 1)는 따로 깔끔한 저장소로 만들어요.</p>` },
      { title: '4. 이 교과서 쓰는 법', html: `<ul><li><b>레슨</b> — GitHub 화면을 「어느 화면 → 어느 칸 → 무슨 글자」 로 설명해요. 영어 글자 그대로 + 괄호에 뜻. 쪽 맨 아래 「2026년 11월 기준」 이 있어요 — 글자가 조금 바뀌어도 같은 자리에 있어요.</li>
<li><b>예제 명령</b> — 📋 복사 → Git Bash 에 붙여 넣기. 원격은 내 컴퓨터 폴더로 대신해요(진짜 GitHub 에 안 올라가요).</li>
<li><b>🛠 만들어 보기</b> — GitHub 화면 문제는 ☐ 목록을 내 화면에서 확인, 명령 문제는 준비 명령 → 내가 친 명령 → 「확인 명령」 결과가 「이렇게 나오면 성공」 과 같으면 완성.</li>
<li><b>혼자 두 역할</b> — 계정은 하나(이용약관). 챕터 2 부터는 작성자와 리뷰어를 번갈아 해요.</li>
<li><b>📚 GitHub 도감</b> — 「라이선스」「SSH」 처럼 찾아 쓰세요.</li></ul>` },
    ],
  },
  // 도감 맨 앞 「📝 Markdown · 자주 쓰는 것」 — 실행 결과가 없는 문법 모음(check_book 은 ref 쪽만 확인)
  builtins: [
    { name: '# 제목 · ## 작은 제목', desc: '# 개수가 단계. # 뒤에 빈칸 하나.', code: '# todo-cli\n## 실행 방법', ref: 'G4/0' },
    { name: '- 목록 · 1. 번호 목록', desc: '두 칸 들여 쓰면 하위 항목.', code: '- 추가\n- 목록\n  - 완료한 것만\n1. 설치\n2. 실행', ref: 'G4/0' },
    { name: '**굵게** · *기울임* · `코드`', desc: '줄 안에서 강조하기.', code: '**꼭** 저장하세요. `python todo.py` 로 실행.', ref: 'G4/0' },
    { name: '[글자](주소) · ![설명](그림)', desc: '링크와 그림. 그림 설명은 그림이 안 보일 때 대신 나오는 글.', code: '[GitHub 문서](https://docs.github.com/ko)\n![실행 화면](images/screen.png)', ref: 'G4/0' },
    { name: '```python 코드 블록', desc: '첫 줄 ``` + 언어, 마지막 줄 ```. text · bash 도.', code: '```python\nprint("안녕")\n```', ref: 'G4/1' },
    { name: '| 표 |', desc: '머리줄 다음 줄에 | --- |.', code: '| 명령 | 하는 일 |\n| --- | --- |\n| `add` | 추가 |', ref: 'G4/1' },
    { name: '- [ ] 체크박스', desc: '이슈·PR 에서는 눌러서 체크돼요.', code: '- [x] 추가 기능\n- [ ] 마감일 기능', ref: 'G4/1' },
    { name: '> 인용 · --- 가로줄', desc: '남의 말·주의 · 구역 나누기.', code: '> 주의: 비밀번호는 넣지 마세요\n\n---', ref: 'G4/1' },
    { name: 'git remote add origin 주소 · git push -u origin main', desc: '내 폴더를 빈 GitHub 저장소에 처음 올리기.', code: 'git remote add origin https://github.com/내아이디/저장소.git\ngit branch -M main\ngit push -u origin main', ref: 'G2/2' },
    { name: 'git pull --no-edit → git push', desc: '「rejected (fetch first)」 = GitHub 쪽이 앞서 있음. 받아서 합치고 다시.', code: 'git pull --no-edit\ngit push', ref: 'G3/3' },
    { name: 'git push -u origin 브랜치 → Compare & pull request', desc: '브랜치를 올리면 저장소 화면에 노란 띠. 그 브랜치로 PR.', code: 'git switch -c readme-usage\ngit commit -am "README 에 사용법 추가"\ngit push -u origin readme-usage', ref: 'G5/1' },
    { name: '```suggestion', desc: '리뷰 코멘트에 고칠 코드를 넣으면 작성자가 Commit suggestion 으로 바로 받아요.', code: '```suggestion\nif not line:\n    continue\n```', ref: 'G6/1' },
    { name: 'Closes #3 · Fixes #3', desc: 'PR 설명(또는 커밋 메시지)에 쓰면 main 에 합쳐질 때 이슈가 자동으로 닫혀요.', code: 'Closes #3', ref: 'G9/2' },
    { name: 'git fetch --prune · git branch -D', desc: 'squash 로 합친 뒤 내 컴퓨터 뒷정리. -d 가 not fully merged 로 거절하면 Merged 확인 후 -D.', code: 'git switch main\ngit pull\ngit fetch --prune\ngit branch -D readme-usage', ref: 'G7/1' },
    { name: 'git pull origin main --no-edit', desc: 'PR 충돌을 내 컴퓨터에서 풀 때: main 을 내 브랜치로 받아 와 합치기.', code: 'git switch readme-usage\ngit pull origin main --no-edit', ref: 'G8/2' },
    { name: 'ssh-keygen · ssh -T git@github.com', desc: 'SSH 열쇠 만들기와 연결 확인.', code: 'ssh-keygen -t ed25519 -C "noreply 주소"\nclip < ~/.ssh/id_ed25519.pub\nssh -T git@github.com', ref: 'G1/2' },
  ],
  tasks: {
    G0: [
      { title: '내 GitHub 둘러보기', text: '내 계정의 화면을 한 바퀴 돌아봐요. 터미널·Git 교과서 레슨 16 에서 올린 저장소를 열고, 탭을 하나씩 눌러 무엇이 있는지 보세요.', noRun: true,
        needs: [['Your profile · Your repositories', 'G0/1', '오른쪽 위 내 사진 메뉴'], ['Code · Issues · Pull requests · Actions · Settings', 'G0/1', '저장소 이름 아래 탭']],
        checks: [{ text: '내 프로필 주소 https://github.com/내아이디 가 열려요' }, { text: 'Your repositories 에 레슨 16 에서 올린 저장소가 보여요' }, { text: '그 저장소의 Code · Issues · Pull requests · Actions · Settings 탭을 하나씩 눌러 봤어요' }, { text: '초록 Code 단추를 눌러 HTTPS 주소와 SSH 주소 두 가지를 찾았어요' }],
        answer: '1. 오른쪽 위 내 사진 → Your profile (주소창에 github.com/내아이디)\n2. 내 사진 → Your repositories → 레슨 16 의 저장소\n3. 이름 아래 탭: Code → Issues → Pull requests → Actions → Settings\n4. Code 탭의 초록 Code 단추 → Local 탭 → HTTPS / SSH' },
    ],
    G1: [
      { title: '2단계 인증 켜기', text: '인증 앱으로 2FA 를 켜고 복구 코드를 안전한 곳에 저장하세요. 끝나면 로그아웃했다가 다시 로그인해서 6자리 숫자를 물어보는지 확인해요.', noRun: true,
        needs: [['Settings → Password and authentication', 'G1/0', '계정 설정의 Access 묶음'], ['Enable two-factor authentication', 'G1/0', '2FA 켜기 단추'], ['Download · I have saved my recovery codes', 'G1/0', '복구 코드 저장']],
        checks: [{ text: 'Password and authentication 화면의 Two-factor authentication 칸에 「Enabled」 가 보여요' }, { text: 'github-recovery-codes.txt 를 저장소가 아닌 안전한 곳에 옮겼어요' }, { text: '다시 로그인할 때 앱의 6자리 숫자를 물어봐요' }],
        answer: '1. 인증 앱 설치\n2. 내 사진 → Settings → Password and authentication → Enable two-factor authentication\n3. QR 찍기 → 앱의 6자리를 Verify the code from the app 칸에\n4. Save your recovery codes → Download → 파일을 안전한 곳으로 → I have saved my recovery codes\n5. 로그아웃 → 로그인해서 6자리를 묻는지 확인' },
      { title: 'noreply 주소로 커밋하게 하기', text: 'GitHub Emails 화면에서 내 noreply 주소를 찾아, 내 컴퓨터의 Git 이 그 주소로 커밋하게 설정하세요. 결과 예는 <code>12345678+me@users.noreply.github.com</code> 으로 한 거예요 — 숫자와 아이디는 내 것으로.',
        needs: [['Settings → Emails → Keep my email addresses private', 'G1/1', '이메일 비공개'], ['git config --global user.email "…"', 'G1/1', 'Git 에 새 주소 알려 주기']],
        setup: 'cd ~', answer: 'git config --global user.email "12345678+me@users.noreply.github.com"', check: 'git config --global user.email', io: [{ output: '12345678+me@users.noreply.github.com' }] },
      { title: 'SSH 키로 push 하기', text: 'SSH 열쇠를 만들어 GitHub 에 등록하고, 레슨 16 에서 올린 저장소의 원격 주소를 SSH 로 바꿔서 로그인 창 없이 push 해 보세요.', noRun: true,
        needs: [['ssh-keygen -t ed25519 -C "주소"', 'G1/2', '열쇠 한 쌍 만들기'], ['Settings → SSH and GPG keys → New SSH key', 'G1/2', '공개 열쇠 등록'], ['git remote set-url origin git@github.com:아이디/저장소.git', 'G1/2', '원격을 SSH 주소로']],
        checks: [{ text: 'ssh -T git@github.com 이 「Hi 내아이디! You\'ve successfully authenticated」 를 보여 줘요' }, { text: 'SSH and GPG keys 화면에 내가 붙인 Title(예: 내 노트북)의 키가 있어요' }, { text: 'git remote -v 가 git@github.com:… 주소를 보여 줘요' }, { text: '고친 파일을 커밋하고 git push 했는데 로그인 창 없이 올라갔어요' }],
        answer: 'ssh-keygen -t ed25519 -C "12345678+me@users.noreply.github.com"\n(Enter 세 번)\nclip < ~/.ssh/id_ed25519.pub\n(GitHub: Settings → SSH and GPG keys → New SSH key → Title · Key 붙여 넣기 → Add SSH key)\nssh -T git@github.com\ncd ~/레슨16저장소\ngit remote set-url origin git@github.com:내아이디/저장소.git\ngit remote -v\necho "SSH 로 올림" >> README.md\ngit commit -am "SSH 로 push 해 보기"\ngit push' },
    ],
    G2: [
      { title: '연습 저장소 github-study 만들기', text: 'New repository 화면에서 <code>github-study</code> 를 <b>Public</b> 으로 만드세요. README 는 켜고, .gitignore 는 Python, 라이선스는 MIT License 로.', noRun: true,
        needs: [['+ → New repository', 'G2/0', '오른쪽 위 + 메뉴'], ['Add README · Add .gitignore · Add license', 'G2/0', '세 가지 미리 넣기'], ['Create repository', 'G2/0', '만들기']],
        checks: [{ text: 'Code 탭에 README.md · .gitignore · LICENSE 세 파일이 있어요' }, { text: '오른쪽 About 칸에 「MIT license」 가 보여요' }, { text: '.gitignore 를 열면 __pycache__/ 줄이 있어요' }, { text: '커밋 수가 1(Initial commit)이에요' }],
        answer: '1. + → New repository\n2. Repository name: github-study · Public\n3. Add README: On · Add .gitignore: Python · Add license: MIT License\n4. Create repository' },
      { title: '내 폴더를 빈 원격에 올리기', text: '준비 명령은 커밋이 두 개 있는 내 프로젝트(<code>mine</code>)와 비어 있는 원격(<code>../remote.git</code>, GitHub 의 빈 저장소 대신)을 만들고 <code>mine</code> 으로 들어가요. 원격을 <code>origin</code> 으로 연결하고 main 을 올려, 앞으로 그냥 <code>git push</code> 하면 되게 하세요.',
        needs: [['git remote add origin 주소', 'G2/2', '원격 연결'], ['git push -u origin main', 'G2/2', '처음 올리기(-u 로 짝 맺기)']],
        setup: GS('g2-2') + '\ngit init -q --bare remote.git\nmkdir mine && cd mine && git init -q -b main\necho "print(\'할 일\')" > todo.py && git add . && git commit -qm "할 일 프로그램 시작"\necho "# todo" > README.md && git add . && git commit -qm "README 추가"',
        answer: 'git remote add origin ../remote.git\ngit push -u origin main', check: 'git log --oneline origin/main | wc -l\ngit status -sb | head -1', io: [{ output: '2\n## main...origin/main' }] },
      { title: 'README 가 먼저 있는 원격에 올리기', text: '이번 원격은 GitHub 에서 README 를 켜고 만든 것처럼 이미 커밋(Initial commit)이 하나 있어요. 내 폴더(<code>mine</code>, 준비 명령이 여기로 들어가요)를 연결해 올리면 거절돼요. 두 기록을 합쳐서 올리세요.',
        needs: [['! [rejected] … (fetch first)', 'G2/2', '원격에 내가 모르는 커밋'], ['git pull origin main --allow-unrelated-histories --no-edit', 'G2/2', '서로 모르는 두 기록 합치기'], ['git push -u origin main', 'G2/2', '다시 올리기']],
        setup: GS('g2-3') + '\ngit init -q --bare remote.git\ngit clone -q remote.git web && cd web && echo "# todo-cli" > README.md && git add . && git commit -qm "Initial commit" && git push -q origin main && cd ..\nmkdir mine && cd mine && git init -q -b main && echo "print(1)" > app.py && git add . && git commit -qm "앱 시작"\ngit remote add origin ../remote.git',
        answer: 'git push -u origin main\ngit pull origin main --allow-unrelated-histories --no-edit\ngit push -u origin main', check: 'git ls-files\ngit log --oneline | wc -l\ngit status -sb | head -1', io: [{ output: 'README.md\napp.py\n3\n## main...origin/main' }] },
    ],
    G3: [
      { title: '웹에서 README 고치고 기록 보기', text: '연습 저장소 <code>github-study</code> 의 README 에 한 줄을 브라우저에서 더하고 main 에 바로 커밋하세요. 그다음 그 변경을 History 와 Blame 에서 찾아요.', noRun: true,
        needs: [['연필(Edit file) → Commit changes…', 'G3/0', '웹에서 고치기'], ['Commit directly to the main branch', 'G3/0', 'main 에 바로'], ['History · Blame', 'G3/1', '기록 보기']],
        checks: [{ text: '저장소 첫 화면 커밋 수가 하나 늘었어요' }, { text: 'README 의 History 에 내가 쓴 커밋 메시지가 맨 위에 있어요' }, { text: '그 커밋을 누르면 넣은 줄이 초록으로 보여요' }, { text: 'Blame 에서 그 줄 옆에 내 커밋이 표시돼요' }],
        answer: '1. github-study → README.md → 연필 단추\n2. 맨 아래에 한 줄 쓰기 → Preview 로 확인\n3. Commit changes… → Commit message: README 에 소개 한 줄 → Commit directly to the main branch → Commit changes\n4. 파일 위 History → 맨 위 커밋 누르기\n5. 파일 위 Blame' },
      { title: '거절된 push 해결하기', text: '준비 명령은 「웹에서 README 를 고친 것」 처럼 원격이 한 칸 앞선 상태를 만들고, 내 컴퓨터(<code>mine</code>)에는 다른 커밋이 하나 있어요. 지금 <code>git push</code> 하면 거절돼요. 받아서 합친 다음 올리세요.',
        needs: [['! [rejected] … (fetch first)', 'G3/3', 'GitHub 쪽이 앞섬'], ['git pull --no-edit', 'G3/3', '받아서 합치기'], ['git push', 'G3/3', '다시 올리기']],
        setup: GS('g3-2') + '\ngit init -q --bare remote.git\ngit clone -q remote.git mine && cd mine && echo "# 메모" > README.md && git add . && git commit -qm "시작" && git push -q origin main && cd ..\ngit clone -q remote.git web && cd web && echo "오타 고침" >> README.md && git commit -qam "웹에서 README 고침" && git push -q && cd ..\ncd mine && echo "print(1)" > app.py && git add . && git commit -qm "앱 추가"',
        answer: 'git pull --no-edit\ngit push', check: 'git status -sb | head -1\ngit log --oneline | wc -l\ntail -1 README.md', io: [{ output: '## main...origin/main\n4\n오타 고침' }] },
      { title: 'github.dev 로 두 파일 한꺼번에', text: '연습 저장소에서 <kbd>.</kbd> 키로 github.dev 를 열고, README 와 새 파일 <code>notes.md</code> 두 개를 한 커밋으로 올리세요.', noRun: true,
        needs: [['. 키 → github.dev', 'G3/2', '브라우저 안 VS Code'], ['Source Control → Commit & Push', 'G3/2', '한 번에 커밋']],
        checks: [{ text: '주소가 github.dev/내아이디/github-study 로 바뀌었어요' }, { text: '커밋 하나에 README.md 와 notes.md 두 파일이 같이 들어갔어요(github.com 에서 그 커밋을 열어 확인)' }, { text: '원래 화면으로 돌아왔어요(☰ → Go to Repository)' }],
        answer: '1. github.com/내아이디/github-study 에서 . 키\n2. README.md 고치기, 탐색기에서 새 파일 notes.md 만들고 한 줄\n3. 왼쪽 Source Control → 메시지 「노트 추가」 → Commit & Push\n4. ☰ → Go to Repository → 커밋 기록에서 확인' },
    ],
    G4: [
      { title: 'README 를 6칸 틀로 다시 쓰기', text: '연습 저장소의 README 를 「제목+소개 → 화면 → 준비물 → 실행 → 사용법(표) → 라이선스」 순서로 다시 쓰세요. 내 파이썬 교과서 프로젝트 하나를 소개하는 글로요.', noRun: true,
        needs: [['# 제목 · ## 작은 제목', 'G4/0', '제목 단계'], ['```text · ```bash', 'G4/1', '코드 블록'], ['| 명령 | 하는 일 |', 'G4/1', '표'], ['## 화면 · ## 준비물 · ## 실행 · ## 사용법 · ## 라이선스', 'G4/2', '좋은 README 순서']],
        checks: [{ text: 'Preview(또는 저장소 첫 화면)에서 ## 제목 여섯 개가 보여요' }, { text: '실행 명령이 회색 코드 상자로 보이고 오른쪽에 복사 단추가 있어요' }, { text: '사용법 표가 칸으로 나뉘어 보여요' }, { text: '처음 보는 사람이 30초 안에 「무엇이고 어떻게 돌리나」 알 수 있어요' }],
        answer: '# todo-cli\n\n터미널에서 쓰는 할 일 관리 프로그램이에요.\n\n## 화면\n\n```text\n> add 우유 사기\n추가: 우유 사기\n```\n\n## 준비물\n\n- Python 3.12 이상\n\n## 실행\n\n```bash\npython todo.py\n```\n\n## 사용법\n\n| 명령 | 하는 일 |\n| --- | --- |\n| `add 할일` | 추가 |\n| `list` | 목록 |\n\n## 라이선스\n\nMIT License' },
      { title: '체크박스로 할 일 적기', text: 'README 맨 아래에 「## 다음에 할 것」 을 만들고 체크박스 세 개를 적으세요. 하나는 이미 한 것(<code>[x]</code>)으로.', noRun: true,
        needs: [['- [ ] 할 일 · - [x] 한 일', 'G4/1', '체크박스']],
        checks: [{ text: '저장소 첫 화면에 네모 칸 세 개가 보이고 하나는 체크돼 있어요' }, { text: '- 와 [ 사이, ] 와 글자 사이에 빈칸이 하나씩 있어요(없으면 그냥 글자로 보여요)' }],
        answer: '## 다음에 할 것\n\n- [x] 할 일 추가\n- [ ] 마감일\n- [ ] 완료한 것 숨기기' },
    ],
    GB1: [
      { title: '🏠 내 파이썬 프로젝트 공개', text: '파이썬 교과서에서 만든 프로그램 하나(보스 B1~B7 중 하나, 예: 메모장 앱)를 <b>새 공개 저장소</b>로 올리세요. 빈 저장소로 만들고 내 폴더에서 push, README 는 레슨 4 의 틀로, 라이선스는 MIT, <code>.gitignore</code> 는 Python 용으로.', noRun: true,
        needs: [['+ → New repository (세 칸 끄고)', 'G2/0', '빈 저장소'], ['git remote add origin · git push -u origin main', 'G2/2', '내 폴더 올리기'], ['Add file → Create new file → LICENSE → Choose a license template', 'G2/1', '나중에 라이선스'], ['## 화면 · ## 실행 · ## 사용법 · ## 라이선스', 'G4/2', 'README 틀']],
        checks: [{ text: '저장소 첫 화면에 README 가 「제목·화면·실행·사용법·라이선스」 로 보여요' }, { text: 'About 칸에 MIT license, 파일 목록에 .gitignore 가 있어요' }, { text: '__pycache__ 폴더나 .env 같은 파일이 올라가 있지 않아요' }, { text: '내 컴퓨터에서 git clone 한 다음 README 의 실행 명령 그대로 하면 돌아가요' }],
        answer: '1. + → New repository → 이름(예: memo-app) · Public · Add README Off · No .gitignore · No license → Create repository\n2. 내 프로젝트 폴더에서 (아직 Git 이 아니면 git init -b main 먼저)\n   git remote add origin https://github.com/내아이디/memo-app.git\n   git push -u origin main\n3. Add file → Create new file → .gitignore 이름으로 → 내용에 __pycache__/ · .venv/ · .env → Commit changes\n4. Add file → Create new file → LICENSE → Choose a license template → MIT License → Review and submit → Commit changes\n5. 내 컴퓨터에서 git pull → README.md 를 레슨 4 틀로 고치고 commit · push\n6. 다른 폴더에 git clone 해서 README 대로 실행해 보기' },
      { title: '의미 있는 커밋 3개 남기기', text: '보스 저장소에 「무엇을 왜」 가 보이는 커밋 세 개를 더 올리세요(예: 기능 하나 추가 · 버그 하나 고침 · README 에 실행 화면 추가). 커밋 이메일은 noreply 로.', noRun: true,
        needs: [['git config --global user.email "…noreply…"', 'G1/1', 'noreply 주소'], ['History', 'G3/1', '기록 확인']],
        checks: [{ text: '저장소 커밋 기록 맨 위 세 개의 메시지만 읽어도 무엇이 바뀌었는지 알 수 있어요' }, { text: 'git log --format="%s | %ae" -3 의 이메일이 전부 users.noreply.github.com 으로 끝나요' }],
        answer: 'git log --format="%s | %ae" -3\n예:\n완료한 할 일 숨기기 옵션 추가 | 12345678+me@users.noreply.github.com\n빈 입력이면 멈추던 버그 고침 | 12345678+me@users.noreply.github.com\nREADME 에 실행 화면 추가 | 12345678+me@users.noreply.github.com' },
    ],
    G5: [
      { title: '브랜치를 원격에 올리기', text: '준비 명령은 원격(<code>../remote.git</code>)과 연결된 저장소(<code>work</code>)로 들어가요. <code>fix-typo</code> 브랜치를 만들어 README 에 한 줄을 더해 커밋하고, 그 브랜치를 원격에 올려서 앞으로 그냥 <code>git push</code> 하면 되게 하세요.',
        needs: [['git switch -c 브랜치', 'G5/1', '새 브랜치로'], ['git push -u origin 브랜치', 'G5/1', '브랜치를 원격에']],
        setup: GS('g5-1') + '\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\necho "# todo" > README.md && git add . && git commit -qm "시작" && git push -q origin main',
        answer: 'git switch -c fix-typo\necho "오타 고침" >> README.md\ngit commit -am "README 오타 고침"\ngit push -u origin fix-typo', check: 'git ls-remote --heads origin | sed "s/.*refs.heads.//"\ngit status -sb | head -1', io: [{ output: 'fix-typo\nmain\n## fix-typo...origin/fix-typo' }] },
      { title: '첫 Pull Request 열기', text: '연습 저장소 <code>github-study</code> 에서 브랜치를 하나 만들어 push 하고, 그 브랜치로 PR 을 여세요. 설명은 「무엇 · 왜 · 확인 방법」 세 칸으로.', noRun: true,
        needs: [['Compare & pull request', 'G5/1', '노란 띠'], ['base: main ← compare: 브랜치', 'G5/1', '합칠 방향'], ['Create pull request', 'G5/1', '만들기']],
        checks: [{ text: 'Pull requests 탭에 내 PR 이 초록 「Open」 으로 있어요' }, { text: '맨 위가 「wants to merge 1 commit into main from 내브랜치」 예요' }, { text: '설명에 ## 무엇 · ## 왜 · ## 확인 방법 세 칸이 보여요' }, { text: 'Files changed 탭에 바꾼 줄이 초록으로 보여요' }],
        answer: 'git clone https://github.com/내아이디/github-study.git (처음이면)\ncd github-study\ngit switch -c readme-usage\n(README 에 사용법 표 추가)\ngit commit -am "README 에 사용법 추가"\ngit push -u origin readme-usage\n→ 저장소 화면 노란 띠 Compare & pull request\n→ base: main ← compare: readme-usage 확인 → 제목 · 설명 세 칸 → Create pull request' },
    ],
    G6: [
      { title: '내 PR 에 리뷰 남기고 반영하기', text: '레슨 5 에서 연 PR 에 리뷰어가 된 셈 치고 줄 코멘트 2개와 Suggestion 1개를 남기세요(Submit review → Comment). 그다음 작성자로 돌아가 Suggestion 을 Commit suggestion 으로 받아들이고, 다른 코멘트 하나는 내 컴퓨터에서 고쳐 push 하세요.', noRun: true,
        needs: [['Files changed → + → Start a review', 'G6/0', '줄 코멘트'], ['```suggestion', 'G6/1', '고칠 코드 제안'], ['Commit suggestion', 'G6/1', '제안 받아들이기'], ['Submit review → Comment', 'G6/2', '리뷰 보내기(내 PR 은 Comment 만)']],
        checks: [{ text: 'Conversation 에 「내아이디 reviewed」 와 코멘트 3개가 보여요' }, { text: 'Suggestion 을 받아들인 커밋 「Apply suggestions from code review」(또는 내가 쓴 메시지)이 Commits 탭에 있어요' }, { text: '내 컴퓨터에서 git pull 한 뒤 고친 커밋을 push 했고, 그것도 Commits 탭에 붙었어요' }, { text: '처리한 대화는 Resolve conversation 으로 접었어요' }],
        answer: '(리뷰어) Files changed → 줄 + → 코멘트 → Start a review (두 번)\n         또 다른 줄 + → ± Insert a suggestion → 코드 고치기 → Add review comment\n         Submit review → 요약 → Comment → Submit review\n(작성자) 제안 코멘트의 Commit suggestion → Commit changes\n         git pull\n         (다른 코멘트대로 고치기)\n         git commit -am "리뷰 반영: 빈 입력 안내"\n         git push\n         각 대화에 답글 → Resolve conversation' },
      { title: '리뷰 반영 커밋을 같은 PR 에 붙이기', text: '준비 명령은 PR 브랜치 <code>fix-input</code> 가 원격에 올라가 있고 웹에서 Suggestion 을 하나 받아들인 상태(원격이 한 칸 앞섬)를 만들어요. 내 컴퓨터의 그 브랜치에서 받아 온 다음, 리뷰대로 <code>todo.py</code> 끝에 <code>print("빈 입력이에요")</code> 를 더해 커밋하고 올리세요.',
        needs: [['git pull', 'G6/1', '웹에서 받아들인 제안 먼저 받기'], ['git commit -am · git push', 'G5/2', '같은 브랜치 = 같은 PR']],
        setup: GS('g6-2') + '\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\necho "print(1)" > todo.py && git add . && git commit -qm "시작" && git push -q origin main\ngit switch -qc fix-input && echo "line = input()" >> todo.py && git commit -qam "입력 받기" && git push -q -u origin fix-input && cd ..\ngit clone -q -b fix-input remote.git web && cd web && echo "# 빈 입력 처리" >> todo.py && git commit -qam "Apply suggestions from code review" && git push -q && cd ../work',
        answer: 'git pull --no-edit\necho \'print("빈 입력이에요")\' >> todo.py\ngit commit -am "리뷰 반영: 빈 입력 안내"\ngit push', check: 'git log --oneline origin/fix-input | wc -l\ntail -1 todo.py\ngit status -sb | head -1', io: [{ output: '4\nprint("빈 입력이에요")\n## fix-input...origin/fix-input' }] },
    ],
    G7: [
      { title: 'Squash and merge 로 합치기', text: '레슨 6 의 PR 을 <b>Squash and merge</b> 로 합치고 GitHub 쪽 브랜치를 지우세요.', noRun: true,
        needs: [['Squash and merge → Confirm squash and merge', 'G7/0', '커밋 하나로 합치기'], ['Delete branch', 'G7/0', 'GitHub 쪽 브랜치 지우기']],
        checks: [{ text: 'PR 맨 위에 보라색 「Merged」 가 붙었어요' }, { text: '저장소 커밋 기록 맨 위가 「PR 제목 (#번호)」 커밋 하나예요(여러 커밋이 아니라)' }, { text: 'Delete branch 를 눌러 브랜치 목록(Code 탭의 브랜치 ▾)에서 그 브랜치가 없어졌어요' }],
        answer: 'PR 아래 초록 단추 옆 ▾ → Squash and merge → 메시지 확인 → Confirm squash and merge → Delete branch' },
      { title: 'squash 뒤 내 컴퓨터 뒷정리', text: '준비 명령은 GitHub 에서 PR 이 squash 로 합쳐지고 브랜치가 지워진 상태를 만들고, 아직 정리 안 한 내 컴퓨터(<code>work</code>, 지금 <code>readme-usage</code> 브랜치)로 들어가요. main 으로 옮겨 최신으로 받고, 지워진 원격 브랜치 흔적을 지우고, 다 쓴 브랜치를 지우세요(squash 라 <code>-d</code> 가 거절하면 Merged 를 확인했다고 치고 <code>-D</code>).',
        needs: [['git switch main · git pull', 'G7/1', '합친 결과 받기'], ['git fetch --prune', 'G7/1', '지운 원격 브랜치 흔적'], ['git branch -D 브랜치', 'G7/1', 'squash 뒤엔 -d 가 거절']],
        setup: GS('g7-2') + '\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\necho "# todo" > README.md && git add . && git commit -qm "시작" && git push -q origin main\ngit switch -qc readme-usage && echo "## 사용법" >> README.md && git commit -qam "사용법" && echo "- add" >> README.md && git commit -qam "add 설명" && git push -q -u origin readme-usage && cd ..\ngit clone -q remote.git web && cd web && git merge -q --squash origin/readme-usage && git commit -qm "README 에 사용법 (#1)" && git push -q origin main && git push -q origin --delete readme-usage && cd ../work',
        answer: 'git switch main\ngit pull\ngit fetch --prune\ngit branch -d readme-usage\ngit branch -D readme-usage', check: 'git branch\ngit branch -r | grep -c readme-usage\ngit log --format=%s -1', io: [{ output: '* main\n0\nREADME 에 사용법 (#1)' }] }, // git branch -a 는 Git 버전에 따라 origin/HEAD 줄이 더 나와서(2.48+) 내 브랜치·원격 흔적을 따로 셈
    ],
    G8: [
      { title: '웹에서 PR 충돌 풀기', text: '연습 저장소에서 일부러 충돌을 만들어 웹에서 풀어 보세요: ① 브랜치 <code>price</code> 에서 README 첫 줄을 바꿔 push · PR 열기 ② 그사이 main 에서(웹 연필로) 같은 첫 줄을 다르게 바꿔 커밋 ③ PR 에 충돌 상자가 뜨면 웹에서 풀고 합치기.', noRun: true,
        needs: [['This branch has conflicts that must be resolved', 'G8/0', '충돌 상자'], ['Resolve conflicts → Mark as resolved → Commit merge', 'G8/1', '웹에서 풀기']],
        checks: [{ text: 'PR 에 「This branch has conflicts that must be resolved」 가 떴어요' }, { text: '편집기에서 마커 세 줄을 다 지우고 Mark as resolved → Commit merge 했어요' }, { text: 'PR 이 「This branch has no conflicts with the base branch」 로 바뀌고 합쳐졌어요' }, { text: '내 컴퓨터 price 브랜치에서 git pull 하니 「Merge branch \'main\' into price」 커밋이 받아졌어요' }],
        answer: 'git switch -c price → README 첫 줄 바꾸기 → commit → git push -u origin price → PR 열기\n웹: main 의 README → 연필 → 같은 첫 줄을 다르게 → Commit directly to the main branch\nPR → Resolve conflicts → 남길 모양으로 고치고 마커 지우기 → Mark as resolved → Commit merge\n→ Squash and merge (또는 Merge pull request)' },
      { title: '내 컴퓨터에서 PR 충돌 풀기', text: '준비 명령은 PR 브랜치 <code>sale</code>(라떼 4800)와 그사이 바뀐 main(라떼 5000)을 만들고 <code>work</code> 의 <code>sale</code> 브랜치로 들어가요. main 을 받아 와 합치고, 충돌은 <b>라떼 4800</b> 을 남기는 쪽으로 풀어서 올리세요.',
        needs: [['git pull origin main --no-edit', 'G8/2', 'main 을 내 브랜치로'], ['<<<<<<< ======= >>>>>>>', 'G8/1', '마커 지우기'], ['git add · git commit --no-edit · git push', 'G8/2', '해결 커밋 올리기']],
        setup: GS('g8-2') + '\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\nprintf \'%s\\n\' "아메리카노 4000" "라떼 4500" > menu.txt && git add . && git commit -qm "메뉴판" && git push -q origin main\ngit switch -qc sale && printf \'%s\\n\' "아메리카노 4000" "라떼 4800" > menu.txt && git commit -qam "라떼 할인" && git push -q -u origin sale && cd ..\ngit clone -q remote.git web && cd web && printf \'%s\\n\' "아메리카노 4000" "라떼 5000" > menu.txt && git commit -qam "라떼 인상" && git push -q && cd ../work',
        answer: 'git pull origin main --no-edit\n(menu.txt 를 열어 「라떼 4800」 만 남기고 마커 지우기)\nprintf \'%s\\n\' "아메리카노 4000" "라떼 4800" > menu.txt\ngit add menu.txt\ngit commit --no-edit\ngit push', run: 'git pull -q origin main --no-edit\nprintf \'%s\\n\' "아메리카노 4000" "라떼 4800" > menu.txt\ngit add menu.txt\ngit commit -q --no-edit\ngit push -q', check: 'cat menu.txt\ngit status -sb | head -1\ngit log --oneline origin/sale | wc -l', io: [{ output: '아메리카노 4000\n라떼 4800\n## sale...origin/sale\n4' }] },
    ],
    G9: [
      { title: '버그 이슈 쓰기', text: '연습 저장소에 버그 이슈 하나를 「재현 방법 · 기대 · 실제 · 환경」 네 칸으로 쓰고, Label <code>bug</code> 와 Assignee(나)를 붙이세요.', noRun: true,
        needs: [['Issues → New issue → Submit new issue', 'G9/0', '이슈 만들기'], ['## 재현 방법 · ## 기대 · ## 실제', 'G9/0', '버그 보고 틀'], ['Labels · Assignees', 'G9/1', '꼬리표 · 담당']],
        checks: [{ text: 'Issues 탭에 내 이슈가 「Open」 으로 번호(#n)와 함께 있어요' }, { text: '오른쪽 Labels 에 bug, Assignees 에 내 사진이 있어요' }, { text: '설명에 네 칸이 Markdown 제목으로 보여요' }, { text: 'Issues 검색 칸에 is:open label:bug 를 치면 이 이슈가 나와요' }],
        answer: 'Issues → New issue → (템플릿 화면이면 Open a blank issue)\n제목: 빈 입력에서 IndexError\n설명: ## 재현 방법 / ## 기대 / ## 실제 / ## 환경\n→ Submit new issue → 오른쪽 Labels: bug · Assignees: assign yourself' },
      { title: 'Closes #번호 로 이슈 자동으로 닫기', text: '위 이슈를 고치는 PR 을 열고 설명에 <code>Closes #번호</code> 를 쓴 다음 합치세요. 이슈가 저절로 닫혀야 해요.', noRun: true,
        needs: [['Closes #3 · Fixes #3', 'G9/2', '닫는 낱말 + 번호'], ['Squash and merge', 'G7/0', '합치기']],
        checks: [{ text: 'PR 을 만든 직후 이슈 오른쪽 Development 칸에 그 PR 이 보여요' }, { text: 'PR 을 합치자 이슈가 보라색 「Closed」 로 바뀌었어요' }, { text: '이슈 기록에 「closed this as completed in #PR번호」 가 보여요' }],
        answer: 'git switch -c fix-empty-input → 고치기 → commit → push -u\nPR 설명 첫 줄: Closes #3\n→ Create pull request → Squash and merge → 이슈 확인' },
    ],
    G10: [
      { title: '보드 만들고 카드 옮기기', text: '내 계정에 Board 프로젝트를 만들어 연습 저장소의 이슈 2개와 메모 카드 1개를 넣고, 하나를 In Progress 로 옮기세요.', noRun: true,
        needs: [['Projects → New project → Board → Create project', 'G10/0', '보드 만들기'], ['+ Add item → #', 'G10/1', '이슈를 카드로'], ['Todo · In Progress · Done', 'G10/0', '칸']],
        checks: [{ text: '프로필의 Projects 탭에 새 보드가 있어요' }, { text: 'Todo 에 이슈 카드 2개(번호가 보이는 카드)와 메모 카드 1개가 있어요' }, { text: '카드 하나를 In Progress 로 끌어 옮겼어요' }, { text: '⋯ → Workflows 에서 닫히면 Done 으로 옮기는 자동화가 켜져 있는 걸 봤어요' }],
        answer: '프로필 → Projects → New project → Board → Project name: github-study 할 일 → Create project\nTodo 칸 + Add item → # → github-study → 이슈 고르기 (두 번)\n+ Add item → 「README 그림 넣기」 (메모 카드)\n카드 하나를 In Progress 로 끌기\n⋯ → Workflows 확인' },
    ],
    GB2: [
      { title: '🏠 혼자 하는 협업 한 바퀴', text: '보스 1 의 내 프로젝트 저장소에서 챕터 2 전체를 한 바퀴 돌려요: ① 이슈 2개(버그 1 · 기능 1, Label · 보드에 카드) ② 이슈마다 브랜치 → PR(설명에 <code>Closes #n</code>) ③ 각 PR 에 리뷰(줄 코멘트 · Suggestion → 반영) ④ 둘 중 하나는 일부러 충돌을 만들어 풀기 ⑤ 둘 다 Squash and merge ⑥ 내 컴퓨터 뒷정리.', noRun: true,
        needs: [['Issues → New issue', 'G9/0', '이슈'], ['Closes #n', 'G9/2', '이슈 연결'], ['```suggestion · Commit suggestion', 'G6/1', '리뷰 반영'], ['Resolve conflicts · git pull origin main', 'G8/1', '충돌'], ['Squash and merge', 'G7/0', '합치기'], ['git fetch --prune · git branch -D', 'G7/1', '뒷정리']],
        checks: [{ text: 'Issues 탭: 이슈 2개가 모두 Closed(PR 로 닫힘)' }, { text: 'Pull requests 탭 → Closed: PR 2개가 Merged, 각각 리뷰 코멘트가 있음' }, { text: '커밋 기록 맨 위 두 개가 「PR 제목 (#번호)」 squash 커밋' }, { text: '보드의 두 카드가 자동으로 Done' }, { text: '내 컴퓨터 git branch 에 main 만, git branch -r 에 지운 브랜치가 없음(origin/HEAD -> origin/main 줄은 있어도 돼요)' }],
        answer: '이슈 #1(bug) · #2(enhancement) → 보드에 추가\n#1: git switch -c fix-… → 고치기 → push → PR(Closes #1) → 리뷰(Comment·Suggestion) → 반영 → Squash and merge\n#2: git switch -c feat-… → 같은 줄을 #1 과 다르게 고쳐 충돌 → 웹 Resolve conflicts 또는 git pull origin main → Squash and merge\ngit switch main · git pull · git fetch --prune · git branch -D …' },
    ],
  },
};
