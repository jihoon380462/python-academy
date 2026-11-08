// courses/github/content.js — 「GitHub 교과서」 (v2.16.0, 사용자 결정: T8 GitHub 가 가장 중요 11/3 · 설계대로 만들기 선택 11/6). 설계: specs/github-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 사용자의 진짜 GitHub 계정(github.com) + Git Bash + VS Code.
// 화면 이름은 docs.github.com 원문(github/docs 저장소, 2026-11)으로 확인한 영어 글자 그대로 + 괄호 안 한국어 뜻. GitHub 화면이 바뀌면 여기를 고치고 QA 문서에 적어요.
// 레슨 쪽 example.shell = Git Bash 에 칠 명령. 「만들어 보기」·시작하기·도감 도구 상자는 book.js. 검사: node tools/check_book.mjs github
const COURSE = { id: 'github', name: 'GitHub', runner: 'none', bench: false,
  tutorPersona: '너는 GitHub 을 처음 쓰는 성인에게 진짜 계정으로 저장소·PR·Actions 를 가르치는 선생님이다. 화면은 「어느 화면 → 어느 칸 → 무슨 글자」 로 말한다.' };
const CHAPTERS = [
  { ch: 1, name: '내 저장소를 제대로', color: '#8250df' },
  { ch: 2, name: 'Pull Request 로 협업', color: '#1f883d' },
  { ch: 3, name: '세상에 내놓기', color: '#0969da' },
  { ch: 4, name: '자동화와 안전', color: '#bf3989' },
  { ch: 5, name: '한 걸음 더', color: '#57606a' },
];
const GH_DATE = '<p class="muted small">이 쪽의 GitHub 화면 이름은 2026년 11월 기준(docs.github.com)이에요. 글자가 조금 바뀌어도 같은 자리에 있어요.</p>';
const LESSONS = [
// ================= 챕터 1 내 저장소를 제대로 =================
{ id: 'G0', ch: 1, n: 0, title: 'GitHub 은 무엇을 해 주나', mode: 'text', tutorSummary: 'Git 은 내 컴퓨터의 기록 도구, GitHub 은 그 저장소를 올려 두고 남과 같이 쓰는 웹 서비스. 저장소 화면의 탭(Code·Issues·Pull requests·Actions·Settings). 계정 하나로 작성자·리뷰어 두 역할.',
  pages: [
    { title: 'Git 과 GitHub: 내 컴퓨터 vs 웹 서비스', html: `<p><b>Git</b> 은 내 컴퓨터에서 파일의 기록(커밋)을 남기는 프로그램이고, <b>GitHub</b> 은 그 저장소를 인터넷에 올려 두고 <b>남과 같이 보고 고치는 웹 서비스</b>예요. 터미널·Git 교과서에서 배운 건 거의 다 앞쪽(Git)이에요. 이 교과서는 뒤쪽(GitHub)이에요.</p>
<pre class="code">내 컴퓨터 (Git Bash)
  작업 폴더 · 커밋 · 브랜치
        │
  git push ▼   ▲ git pull
        │
github.com (웹)
  저장소(원격)
  + Pull Request · 리뷰
  + Issues · Actions · Pages</pre>
<p>GitHub 이 Git 에 <b>더해 주는 것</b>들이 이 교과서의 차례예요.</p>
<table class="kb"><tbody><tr><td><b>Pull Request</b></td><td>「이 브랜치를 main 에 합쳐 주세요」 요청 + 리뷰(챕터 2)</td></tr><tr><td><b>Issues · Projects</b></td><td>할 일·버그를 적고 관리(챕터 2)</td></tr><tr><td><b>Pages · Releases</b></td><td>사이트 공개·버전 배포(챕터 3)</td></tr><tr><td><b>Actions</b></td><td>push 할 때마다 테스트를 자동으로 돌리는 로봇(챕터 4)</td></tr></tbody></table>
<p>이 사이트(파이썬 아카데미)도 이렇게 운영돼요: 브랜치 → Pull Request → 자동 검사 초록 체크 → 합치기 → 사이트 자동 배포. 마지막 「만들어 보기: 이 사이트처럼 운영하기」 에서 내 저장소를 똑같이 만들어요.</p>` },
    { title: '저장소 화면 둘러보기: Code · Issues · Pull requests · Actions · Settings', html: `<p>아무 저장소나 열면(예: 내 저장소 <code>https://github.com/내아이디/저장소이름</code>) 이름 아래에 <b>탭</b>이 한 줄 있어요.</p>
<table class="kb"><tbody><tr><td><b>Code</b></td><td>파일 목록과 README. 초록 <b>Code</b> 버튼 → <b>Local</b> 탭에 clone 주소(HTTPS · SSH)</td></tr><tr><td><b>Issues</b></td><td>할 일·버그 글 목록</td></tr><tr><td><b>Pull requests</b></td><td>합쳐 달라는 요청 목록</td></tr><tr><td><b>Actions</b></td><td>자동 실행(워크플로) 기록 — 초록 ✓ · 빨간 ✗</td></tr><tr><td><b>Settings</b></td><td>저장소 설정(이름 바꾸기·Pages·보호 규칙·비밀값). 내 저장소에서만 보여요. 창이 좁으면 <b>⋯</b> 메뉴 안에 있어요</td></tr></tbody></table>
<p>Code 탭 오른쪽 위에는 <b>⭐ Star</b>(즐겨찾기) · <b>Fork</b>(내 계정으로 복사, 챕터 3) · <b>Watch</b>(알림 받기)가 있어요. 왼쪽 위 브랜치 버튼(<code>main ▾</code>)로 다른 브랜치의 파일을 볼 수 있어요.</p>
<p>내 프로필은 <code>https://github.com/내아이디</code> — 오른쪽 위 내 사진을 누르면 <b>Your profile</b> · <b>Your repositories</b> · <b>Settings</b>(계정 설정) 메뉴가 나와요. <b>저장소 Settings 와 계정 Settings 는 다른 곳</b>이에요. 이 교과서는 늘 어느 쪽인지 적어 둘게요.</p>` + GH_DATE },
    { title: '이 교과서 쓰는 법: 계정 하나로 두 역할', html: `<p>연습은 전부 <b>내 진짜 GitHub 계정</b>으로 해요. 사이트 안 가짜 화면은 없어요 — 실제 화면을 보며 익혀야 나중에 바로 쓸 수 있어요.</p>
<div class="bk-step-box"><b>계정은 하나만</b><br>GitHub 이용약관에는 「한 사람은 무료 개인 계정을 하나만」 이라는 규칙이 있어요. 그래서 친구 역할을 할 두 번째 계정을 만들지 않고, <b>나 혼자 작성자와 리뷰어를 번갈아</b> 해요. 단 <b>내가 연 Pull Request 는 내가 승인(Approve)할 수 없어요</b> — 리뷰는 코멘트·제안으로 연습하고, 승인이 필요한 규칙은 0명으로 둬요(챕터 4).</div>
<div class="bk-step-box"><b>화면 이름</b><br>GitHub 은 한국어 화면이 없어요. 이 교과서는 <b>영어 글자 그대로</b> 적고 괄호에 뜻을 달아요: <b>Settings</b>(설정) → <b>Emails</b>(이메일) → ☑ <b>Keep my email addresses private</b>(내 이메일 비공개).</div>
<div class="bk-step-box"><b>내 컴퓨터 쪽</b><br>명령은 Git Bash 에서 쳐요(터미널·Git 교과서와 같아요). 예제 명령은 연습 폴더 <code>~/github-study</code> 에서 해요.</div>
<p>레슨 마지막 쪽 「🛠 만들어 보기」 는 <b>「확인할 것」 ☐ 목록</b>을 내 GitHub 화면에서 하나씩 확인하는 식이에요. 내 컴퓨터 쪽 명령이 들어간 문제는 「이렇게 나오면 성공」 결과도 있어요.</p>` },
  ],
  summary: ['Git = 내 컴퓨터 기록, GitHub = 올려 두고 같이 쓰는 웹', '저장소 탭: Code · Issues · Pull requests · Actions · Settings', '계정 하나로 작성자·리뷰어 두 역할'] },
{ id: 'G1', ch: 1, n: 1, title: '계정 다듬기와 로그인 방식', mode: 'text', tutorSummary: '2FA(TOTP 앱, 복구 코드 저장) 필수. Settings → Emails → Keep my email addresses private, noreply 주소를 git config user.email 로. HTTPS(Git Credential Manager) 복습과 SSH 키(ssh-keygen -t ed25519, Settings → SSH and GPG keys → New SSH key, ssh -T git@github.com).',
  pages: [
    { title: '꼭! 2단계 인증(2FA) 켜기', html: `<p>2단계 인증(2FA)은 비밀번호에 더해 <b>폰 앱의 6자리 숫자</b>까지 있어야 로그인되게 하는 거예요. GitHub 은 코드를 올리는 계정에 2FA 를 요구해요 — 안 켜 두면 어느 날 「2FA 를 켜야 계속할 수 있어요」 화면으로 막혀요.</p>
<div class="bk-step-box"><b>① 앱 준비</b><br>폰에 인증 앱을 깔아요(Google Authenticator · Microsoft Authenticator 등 아무거나 — 6자리 숫자가 30초마다 바뀌는 앱).</div>
<div class="bk-step-box"><b>② 설정 화면</b><br>github.com 오른쪽 위 <b>내 사진</b> → <b>Settings</b> → 왼쪽 메뉴 <b>Access</b> 묶음의 <b>Password and authentication</b> → 「Two-factor authentication」 칸의 <b>Enable two-factor authentication</b>.</div>
<div class="bk-step-box"><b>③ QR 찍기</b><br>「Scan the QR code」 아래 QR 을 앱으로 찍어요(앱에서 + → QR 코드 스캔). 찍을 수 없으면 <b>setup key</b> 를 눌러 나온 글자를 앱에 직접 넣어요. 앱에 생긴 6자리를 「Verify the code from the app」 칸에 넣어요.</div>
<div class="bk-step-box"><b>④ 복구 코드 — 제일 중요해요</b><br>「Save your recovery codes」 의 <b>Download</b> 를 눌러 받은 <code>github-recovery-codes.txt</code> 를 <b>안전한 곳</b>(비밀번호 관리자·종이에 적어 서랍)에 둬요. 폰을 잃어버리면 이것만이 계정을 되찾는 길이에요. 그다음 <b>I have saved my recovery codes</b>.</div>
<div class="bk-warn"><b>복구 코드를 저장소에 올리지 마세요.</b> <code>github-study</code> 같은 연습 폴더에 넣어 두면 실수로 push 될 수 있어요. 다운로드 폴더에서 바로 옮기세요.</div>
<p>이제 로그인할 때 비밀번호 다음에 앱의 6자리를 물어요. Git Bash 의 push 는 그대로예요(Git Credential Manager 가 브라우저 로그인으로 처리해요).</p>` + GH_DATE },
    { title: '이메일 비공개와 noreply 주소', html: `<p><b>공개 저장소의 커밋에는 커밋한 사람의 이메일이 그대로 남아요.</b> 누구나 <code>git log</code> 로 볼 수 있어요. GitHub 은 대신 쓸 수 있는 <b>noreply 주소</b>를 줘요.</p>
<div class="bk-step-box"><b>① 비공개 켜기</b><br>내 사진 → <b>Settings</b> → 왼쪽 <b>Access</b> 묶음의 <b>Emails</b> → ☑ <b>Keep my email addresses private</b>.</div>
<div class="bk-step-box"><b>② 내 noreply 주소 찾기</b><br>체크하면 바로 아래 설명에 내 주소가 보여요: <code>12345678+내아이디@users.noreply.github.com</code> 모양(숫자는 내 계정 번호). 이 주소를 복사해요.</div>
<div class="bk-step-box"><b>③ 내 컴퓨터의 Git 에 알려 주기</b><br>Git Bash 에서(터미널·Git 교과서 레슨 6 에서 넣은 이메일을 바꾸는 거예요):<pre>git config --global user.email "12345678+내아이디@users.noreply.github.com"
git config --global user.email</pre>두 번째 줄이 방금 넣은 주소를 보여 주면 끝. 이제부터 만드는 커밋은 이 주소로 기록돼요.</div>
<p class="muted small">이미 올린 커밋의 이메일은 바뀌지 않아요. 앞으로의 커밋부터예요. 웹에서 고칠 때(레슨 3)는 ① 의 설정이 자동으로 noreply 를 써요.</p>` + GH_DATE, example: { shell: 'git config --global user.email "12345678+me@users.noreply.github.com"\ngit config --global user.email', label: '예제 명령 — 숫자와 아이디를 내 것으로 바꿔서' } },
    { title: 'HTTPS 로그인(복습)과 SSH 키', html: `<p>push 할 때 「나 맞아요」 를 증명하는 방법은 두 가지예요.</p>
<table class="kb"><tbody><tr><td><b>HTTPS</b> <code>https://github.com/…</code></td><td>터미널·Git 교과서 레슨 16 에서 한 것. 첫 push 때 뜬 창에서 <b>Sign in with your browser</b> 로 로그인하면 Git for Windows 의 Git Credential Manager 가 기억해요. 대부분 이것으로 충분해요</td></tr><tr><td><b>SSH</b> <code>git@github.com:…</code></td><td>내 컴퓨터에 <b>열쇠 한 쌍</b>(비밀 열쇠 + 공개 열쇠)을 만들고, 공개 열쇠를 GitHub 에 등록. 로그인 창 없이 push. 회사·서버에서 자주 써요</td></tr></tbody></table>
<div class="bk-step-box"><b>① 열쇠 만들기</b> (Git Bash)<pre>ssh-keygen -t ed25519 -C "내 noreply 주소"</pre>저장 위치를 물으면 <kbd>Enter</kbd>(기본 <code>~/.ssh/id_ed25519</code>), 암호(passphrase)는 정해도 되고 비워도 돼요(<kbd>Enter</kbd> 두 번).</div>
<div class="bk-step-box"><b>② 공개 열쇠 복사</b><pre>clip &lt; ~/.ssh/id_ed25519.pub</pre>클립보드에 <code>ssh-ed25519 AAAA… noreply주소</code> 모양의 <b>공개 열쇠</b> 한 줄이 복사돼요(<code>clip</code> = 받은 글을 클립보드에 넣는 Windows 명령, <code>&lt;</code> = 파일 내용을 그 명령에 넘기기). <b>끝이 <code>.pub</code> 인 쪽만</b> — <code>.pub</code> 없는 파일은 비밀 열쇠라 절대 남에게 주지 않아요.</div>
<div class="bk-step-box"><b>③ GitHub 에 등록</b><br>내 사진 → <b>Settings</b> → 왼쪽 <b>Access</b> 묶음의 <b>SSH and GPG keys</b> → <b>New SSH key</b> → 「Title」 칸에 <code>내 노트북</code> 처럼 이름, 종류는 Authentication 그대로, 「Key」 칸에 붙여 넣기 → <b>Add SSH key</b>.</div>
<div class="bk-step-box"><b>④ 확인</b><pre>ssh -T git@github.com</pre>처음엔 「Are you sure you want to continue connecting」 에 <code>yes</code>. <code>Hi 내아이디! You've successfully authenticated…</code> 가 나오면 성공.</div>
<p>이미 HTTPS 로 연결한 저장소를 SSH 로 바꾸려면 저장소 폴더에서 <code>git remote set-url origin git@github.com:내아이디/저장소.git</code> → <code>git remote -v</code> 로 확인.</p>` + GH_DATE, example: { shell: 'ssh-keygen -t ed25519 -C "12345678+me@users.noreply.github.com"\nclip < ~/.ssh/id_ed25519.pub\nssh -T git@github.com', label: '예제 명령 — ② 와 ③ 사이에 GitHub 화면에서 키 등록' } },
  ],
  summary: ['2FA: Settings → Password and authentication, 복구 코드 꼭 저장', 'Emails → Keep my email addresses private + noreply 주소를 git config', 'HTTPS(로그인 창) 또는 SSH 키(ssh-keygen → SSH and GPG keys)'] },
{ id: 'G2', ch: 1, n: 2, title: '저장소 만들기 제대로', mode: 'text', tutorSummary: '+ → New repository: Owner, Repository name(영문·숫자·.-_ 100자), Description, 공개/비공개, Add README 켜기, Add .gitignore(Python), Add license(MIT) → Create repository. 라이선스가 없으면 남이 쓸 권리가 없음. 나중에 Add file → Create new file → LICENSE → Choose a license template. 이미 있는 폴더는 빈 저장소에 remote add + push -u, 내용 있는 저장소면 거절 → pull --allow-unrelated-histories.',
  pages: [
    { title: 'New repository 화면의 칸마다', html: `<p>github.com 오른쪽 위 <b>+</b>(Create something new) → <b>New repository</b>. 화면의 칸을 위에서부터 채워요.</p>
<table class="kb"><tbody><tr><td><b>Owner</b></td><td>내 아이디 그대로</td></tr><tr><td><b>Repository name</b></td><td>영문·숫자·<code>.</code> <code>-</code> <code>_</code> 만, 100자까지. 띄어쓰기 대신 <code>-</code> — 예: <code>todo-cli</code>. 이 이름이 주소가 돼요(<code>github.com/내아이디/todo-cli</code>)</td></tr><tr><td><b>Description</b></td><td>한 줄 소개(선택). 「파이썬으로 만든 할 일 관리 프로그램」</td></tr><tr><td>공개 범위</td><td><b>Public</b>(누구나 봄 · 연습은 이것) / <b>Private</b>(나와 초대한 사람만)</td></tr><tr><td><b>Add README</b></td><td><b>On</b> 으로 — 첫 화면에 보이는 설명 파일 <code>README.md</code> 를 만들어 줘요</td></tr><tr><td><b>Add .gitignore</b></td><td><b>Python</b> 고르기 — <code>__pycache__/</code> · <code>.venv/</code> · <code>.env</code> 같은 올리면 안 되는 것들 목록(터미널·Git 교과서 레슨 10)</td></tr><tr><td><b>Add license</b></td><td><b>MIT License</b> — 다음 쪽에서 이유</td></tr></tbody></table>
<p>맨 아래 <b>Create repository</b>. 파일 세 개(<code>README.md</code> · <code>.gitignore</code> · <code>LICENSE</code>)와 커밋 하나(Initial commit)가 있는 저장소가 생겨요.</p>
<div class="bk-warn"><b>이미 내 컴퓨터에 만든 프로젝트를 올릴 거면</b> 세 칸을 전부 <b>끄고</b>(Off · No .gitignore · No license) 빈 저장소로 만드는 게 편해요. 켜면 GitHub 쪽에 커밋이 생겨서 첫 push 가 거절돼요(3쪽).</div>` + GH_DATE },
    { title: '라이선스는 왜: 없으면 「써도 된다」 가 아니에요', html: `<p>코드를 공개해도 <b>라이선스가 없으면 법적으로는 「모든 권리는 만든 사람에게」</b> 예요. 남이 보고 배울 수는 있어도 가져다 쓰거나 고쳐서 배포할 권리가 없어요. 「누구나 써도 돼요」 라고 하려면 라이선스 파일을 둬야 해요.</p>
<table class="kb"><tbody><tr><td><b>MIT License</b></td><td>제일 흔한 「마음대로 쓰되 저작권 줄은 남기고, 문제가 생겨도 책임은 안 져요」. 연습·개인 프로젝트에 무난</td></tr><tr><td><b>Apache License 2.0</b></td><td>MIT 와 비슷 + 특허 조항</td></tr><tr><td><b>GNU GPLv3</b></td><td>「이 코드를 고쳐서 배포하면 그것도 GPL 로 공개해야 해요」</td></tr></tbody></table>
<p>고르기 어려우면 <a href="https://choosealicense.com/" target="_blank" rel="noopener">choosealicense.com</a> 이 질문 몇 개로 골라 줘요.</p>
<div class="bk-step-box"><b>나중에 라이선스 넣기</b><br>저장소 Code 탭 → <b>Add file</b> → <b>Create new file</b> → 파일 이름 칸에 <code>LICENSE</code>(대문자) → 이름 칸 아래에 생기는 <b>Choose a license template</b> → 왼쪽에서 <b>MIT License</b> → <b>Review and submit</b> → <b>Commit changes…</b>.</div>
<p class="muted small">이 교과서는 법률 상담이 아니에요. 회사 코드나 남의 코드가 섞인 프로젝트는 그 규칙을 먼저 따르세요.</p>` + GH_DATE },
    { title: '이미 있는 폴더를 새 저장소에 올리기', html: `<p>내 컴퓨터에 이미 커밋이 있는 프로젝트(예: 파이썬 교과서에서 만든 것)를 올리는 두 경우예요.</p>
<div class="bk-step-box"><b>① 빈 저장소에 올리기 — 권장</b><br>New repository 에서 README · .gitignore · license 를 <b>전부 끄고</b> 만들면, 다음 화면(Quick setup)에 명령이 나와요. 내 프로젝트 폴더에서:<pre>git remote add origin https://github.com/내아이디/todo-cli.git
git branch -M main
git push -u origin main</pre>터미널·Git 교과서 레슨 11·16 과 같아요. <code>-u</code> 는 「앞으로 그냥 <code>git push</code> 하면 여기로」.</div>
<div class="bk-step-box"><b>② 이미 README 를 만들어 버렸으면</b><br>GitHub 쪽에도 커밋(Initial commit)이 있어서 push 가 거절돼요:<pre class="code">! [rejected]        main -&gt; main (fetch first)
hint: Updates were rejected because the remote contains work that you do not
hint: have locally.</pre>두 기록이 서로 모르는 사이라 한 번 합쳐 줘야 해요:<pre>git pull origin main --allow-unrelated-histories --no-edit
git push -u origin main</pre>README 가 둘 다 있으면 충돌이 나요 — 터미널·Git 교과서 레슨 13 처럼 고치고 <code>git add</code> · <code>git commit</code>.</div>
<p>예제는 GitHub 대신 내 컴퓨터의 폴더(<code>remote.git</code>)를 원격으로 써서 ② 를 그대로 해 보는 거예요(터미널·Git 교과서 레슨 11 의 「가짜 GitHub」 와 같은 방법).</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g2 && mkdir g2 && cd g2\ngit init -q --bare remote.git\ngit clone -q remote.git web && cd web && echo "# todo-cli" > README.md && git add . && git commit -qm "Initial commit" && git push -q origin main && cd ..\nmkdir mine && cd mine && git init -q -b main && echo "print(1)" > app.py && git add . && git commit -qm "앱 시작"\ngit remote add origin ../remote.git\ngit push -u origin main\ngit pull origin main --allow-unrelated-histories --no-edit\ngit push -u origin main\ngit log --oneline --graph', label: '예제 명령 — 「README 를 만들어 버린」 원격에 내 폴더 올리기(첫 push 는 일부러 거절돼요)' } },
  ],
  summary: ['+ → New repository: 이름 · Public · Add README · .gitignore Python · MIT', '라이선스가 없으면 남이 쓸 권리가 없음', '내 폴더는 빈 저장소에 remote add + push -u, 아니면 pull --allow-unrelated-histories'] },
{ id: 'G3', ch: 1, n: 3, title: '웹에서 고치고 기록 보기', mode: 'text', tutorSummary: '연필(Edit file) → Preview → Commit changes… → Commit message, main 에 바로/새 브랜치. History·커밋 diff·Blame. . 키로 github.dev. 웹에서 고친 뒤 내 컴퓨터에서 push 하면 거절(fetch first) → git pull 먼저.',
  pages: [
    { title: '연필로 고치기와 Commit changes 창', html: `<p>작은 오타는 브라우저에서 바로 고쳐도 돼요. 이것도 진짜 커밋이 돼요.</p>
<div class="bk-step-box"><b>① 열기</b><br>Code 탭에서 파일(예: <code>README.md</code>)을 누르고, 파일 내용 위 오른쪽의 <b>연필 버튼</b>(Edit file).</div>
<div class="bk-step-box"><b>② 고치고 미리 보기</b><br>고친 뒤 위쪽 <b>Preview</b> 탭으로 어떻게 보일지 확인(Markdown 은 레슨 4).</div>
<div class="bk-step-box"><b>③ 커밋</b><br>오른쪽 위 초록 <b>Commit changes…</b> → 창이 떠요. 「Commit message」 칸에 무엇을 바꿨는지(<code>README 오타 고침</code>) → 아래 두 동그라미 중 하나:
<ul><li><b>Commit directly to the <code>main</code> branch</b> — main 에 바로</li><li><b>Create a new branch for this commit and start a pull request</b> — 새 브랜치로 → Pull Request(PR, 챕터 2). 혼자 하는 연습 저장소는 첫째도 괜찮아요</li></ul>
→ <b>Commit changes</b>.</div>
<p class="muted small">연필 옆 ▾(More edit options)를 누르면 <b>github.dev</b>(3쪽)로도 열 수 있어요.</p>` + GH_DATE },
    { title: 'History · 커밋 하나 보기 · Blame', html: `<p>GitHub 은 <code>git log</code> 를 화면으로 보여 줘요.</p>
<table class="kb"><tbody><tr><td>저장소 첫 화면의 <b>🕘 커밋 수</b>(예: 「12 Commits」)</td><td>저장소 전체 기록 = <code>git log</code></td></tr><tr><td>파일을 연 화면 위 <b>History</b></td><td>그 파일만의 기록 = <code>git log --oneline 파일</code></td></tr><tr><td>기록에서 커밋 하나 누르기</td><td>그 커밋이 바꾼 줄: 빨강 = 지운 줄, 초록 = 넣은 줄 = <code>git show</code></td></tr><tr><td>파일 화면 위 <b>Blame</b></td><td>줄마다 「누가 언제 어느 커밋에서 이 줄을 썼나」 — 이상한 줄이 언제 들어왔는지 찾을 때</td></tr></tbody></table>
<p>커밋 화면의 주소(<code>…/commit/a1b2c3d…</code>)는 그 변경을 가리키는 고정 주소예요. 이슈나 PR 에 붙여 「이 커밋에서 깨졌어요」 라고 쓸 수 있어요.</p>` + GH_DATE },
    { title: 'github.dev: . 키로 VS Code 처럼', html: `<p>저장소 화면에서 키보드 <kbd>.</kbd>(마침표)를 누르면 <b>github.dev</b> 가 열려요 — 브라우저 안의 VS Code 예요. 설치 없이 여러 파일을 한꺼번에 고칠 때 좋아요(<kbd>&gt;</kbd> 를 누르면 새 탭으로).</p>
<ul><li>왼쪽 탐색기에서 파일을 열어 고쳐요. 고친 파일 옆에 <b>M</b> 이 붙어요.</li><li>왼쪽 세로 줄의 <b>Source Control</b>(가지 모양) → 메시지 칸에 커밋 메시지 → <b>Commit &amp; Push</b>.</li><li>코드를 <b>실행</b>하지는 못해요(터미널이 없어요). 실행은 내 컴퓨터 VS Code 에서 해요.</li></ul>
<p>원래 화면으로 돌아가려면 왼쪽 위 ☰ 메뉴 → <b>Go to Repository</b>, 또는 주소의 <code>github.dev</code> 를 <code>github.com</code> 으로.</p>` + GH_DATE },
    { title: '웹에서 고친 뒤 내 컴퓨터는 git pull 먼저', html: `<p>웹에서 커밋을 하나 하면 <b>GitHub 쪽이 한 칸 앞서요</b>. 내 컴퓨터는 그걸 몰라요. 그 상태로 내 컴퓨터에서 커밋하고 push 하면 거절돼요:</p>
<pre class="code">! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'https://github.com/…'</pre>
<p>해결은 늘 같아요: <b>먼저 받아서 합치고(pull), 다시 push</b>.</p>
<pre>git pull --no-edit
git push</pre>
<p>습관으로 만들면 거절을 거의 안 만나요: <b>작업 시작 전에 <code>git pull</code></b>. 웹에서 고친 날은 꼭 먼저 pull 해요.</p>
<p>예제는 같은 원격을 두 군데에 clone 해서 「웹에서 고친 쪽」(web)과 「내 컴퓨터」(mine)를 흉내 내요.</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g3 && mkdir g3 && cd g3\ngit init -q --bare remote.git\ngit clone -q remote.git mine && cd mine && echo "# 메모" > README.md && git add . && git commit -qm "시작" && git push -q origin main && cd ..\ngit clone -q remote.git web && cd web && echo "오타 고침" >> README.md && git commit -qam "웹에서 README 고침" && git push -q && cd ..\ncd mine && echo "print(1)" > app.py && git add . && git commit -qm "앱 추가"\ngit push\ngit pull --no-edit\ngit push\ngit log --oneline --graph', label: '예제 명령 — 첫 push 는 일부러 거절돼요' } },
  ],
  summary: ['연필 → Preview → Commit changes…', 'History · 커밋 diff · Blame = git log · show 를 화면으로', '. 키로 github.dev', '웹에서 고쳤으면 내 컴퓨터는 git pull 먼저'] },
{ id: 'G4', ch: 1, n: 4, title: 'README 를 문서답게 (Markdown)', mode: 'text', tutorSummary: 'Markdown: # 제목, - 목록, **굵게**, [링크](주소), ![그림](경로), 코드 블록 ```python, 표 | 칸 |, 체크박스 - [ ]. Preview 로 확인. 좋은 README 순서: 무엇·화면·설치·실행·예시·라이선스.',
  pages: [
    { title: 'Markdown 기본: # 제목 · 목록 · 굵게 · 링크', html: `<p><code>README.md</code> 의 <code>.md</code> 는 <b>Markdown</b> — 기호 몇 개로 제목·목록·굵게를 표시하는 글 형식이에요. GitHub 이 예쁘게 바꿔서 보여 줘요. 이슈·PR·코멘트에도 똑같이 써요.</p>
<table class="kb"><tbody><tr><td><code># 제목</code> · <code>## 작은 제목</code></td><td><code>#</code> 개수가 단계(1~6). <code>#</code> 뒤에 빈칸 하나</td></tr><tr><td><code>- 항목</code> · <code>1. 항목</code></td><td>목록 · 번호 목록. 두 칸 들여 쓰면 하위 항목</td></tr><tr><td><code>**굵게**</code> · <code>*기울임*</code></td><td><b>굵게</b> · <i>기울임</i></td></tr><tr><td><code>[글자](https://…)</code></td><td>링크</td></tr><tr><td><code>![설명](images/screen.png)</code></td><td>그림(저장소 안 파일 경로나 주소). 설명은 그림이 안 보일 때 대신 나오는 글</td></tr><tr><td><code>\`코드\`</code></td><td>줄 안의 짧은 코드</td></tr><tr><td>빈 줄</td><td>문단 나누기 — 줄만 바꾸면 이어서 한 문단이 돼요</td></tr></tbody></table>` + GH_DATE, example: { code: '# todo-cli\n\n터미널에서 쓰는 **할 일 관리** 프로그램이에요.\n\n## 할 수 있는 것\n\n- 할 일 추가 · 목록 · 완료\n- 파일(`todo.json`)에 저장\n\n자세한 문법은 [GitHub 문서](https://docs.github.com/ko/get-started/writing-on-github)를 보세요.', label: '예제 — README.md 에 붙여 넣고 Preview 탭으로 보기' } },
    { title: '코드 블록 ```python · 표 · 체크박스', html: `<table class="kb"><tbody><tr><td>코드 블록</td><td>줄 맨 앞에 <code>\`\`\`python</code>, 코드 줄들, 마지막 줄 <code>\`\`\`</code>. 언어 이름을 쓰면 색이 칠해져요(<code>bash</code> · <code>text</code> 도)</td></tr><tr><td>표</td><td><code>| 명령 | 하는 일 |</code> 다음 줄 <code>| --- | --- |</code>, 그다음 줄부터 내용</td></tr><tr><td>체크박스</td><td><code>- [ ] 할 일</code> · <code>- [x] 한 일</code>. 이슈·PR 에서는 눌러서 바로 체크돼요</td></tr><tr><td>인용</td><td><code>&gt; 글</code></td></tr><tr><td>가로줄</td><td><code>---</code> 한 줄</td></tr></tbody></table>
<p>입력과 출력을 보여 줄 때는 <code>\`\`\`text</code> 블록이 깔끔해요. 백틱(<code>\`</code>)은 키보드 숫자 1 왼쪽 키예요(한글 상태면 영어로 바꾸고).</p>` + GH_DATE, example: { code: '## 실행 방법\n\n```bash\npython todo.py\n```\n\n## 명령\n\n| 명령 | 하는 일 |\n| --- | --- |\n| `add 우유` | 할 일 추가 |\n| `list` | 목록 보기 |\n\n## 할 일\n\n- [x] 추가 기능\n- [ ] 마감일 기능', label: '예제 — 코드 블록 · 표 · 체크박스' } },
    { title: '좋은 README 의 순서', html: `<p>처음 온 사람이 <b>30초 안에</b> 「이게 뭐고, 어떻게 돌리나」 를 알게 하는 게 목표예요. 이 순서면 거의 다 돼요.</p>
<ol><li><b>제목 + 한 줄 소개</b> — 무엇을 하는 프로그램인가</li><li><b>화면/예시</b> — 실행 결과 한 덩이(<code>\`\`\`text</code>) 또는 스크린숏</li><li><b>준비물</b> — Python 3.12 이상 같은 것</li><li><b>설치·실행</b> — 복사해서 바로 칠 수 있는 명령</li><li><b>사용법</b> — 명령·입력 형식(표가 좋아요)</li><li><b>라이선스</b> — 「MIT License」 한 줄</li></ol>
<p>남의 README 를 많이 보는 게 제일 빨리 늘어요. GitHub 첫 화면 위 검색에서 관심 있는 주제를 찾아 별(⭐)이 많은 저장소의 README 를 읽어 보세요.</p>`, example: { code: '# todo-cli\n\n터미널에서 쓰는 할 일 관리 프로그램 — 파이썬 교과서 레슨 41(실전 3: 할 일 관리 앱)으로 만들었어요.\n\n## 화면\n\n```text\n> add 우유 사기\n추가: 우유 사기\n> list\n1. [ ] 우유 사기\n```\n\n## 준비물\n\n- Python 3.12 이상\n\n## 실행\n\n```bash\ngit clone https://github.com/내아이디/todo-cli.git\ncd todo-cli\npython todo.py\n```\n\n## 사용법\n\n| 명령 | 하는 일 |\n| --- | --- |\n| `add 할일` | 추가 |\n| `list` | 목록 |\n\n## 라이선스\n\nMIT License', label: '예제 — README 틀(내 프로젝트 이름으로 바꿔서)' } },
  ],
  summary: ['# 제목 · - 목록 · **굵게** · [링크](주소)', '```python 코드 블록 · | 표 | · - [ ] 체크박스', '좋은 README: 무엇 → 화면 → 준비물 → 실행 → 사용법 → 라이선스'] },
{ id: 'GB1', ch: 1, boss: true, title: '보스: 내 파이썬 프로젝트 공개', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 1 종합. 파이썬 교과서에서 만든 프로그램 하나를 README·.gitignore·LICENSE 갖춘 공개 저장소로. 의미 있는 커밋 3개, noreply 이메일.' },
// ================= 챕터 2 Pull Request 로 협업 (v2.16.1) =================
{ id: 'G5', ch: 2, n: 5, title: '브랜치에서 Pull Request 열기', mode: 'text', tutorSummary: 'main 에 바로 올리지 않는 이유. git switch -c → push -u → 노란 띠 Compare & pull request → base ← compare, 제목·설명 → Create pull request / Create draft pull request. PR 화면 탭: Conversation · Commits · Checks · Files changed.',
  pages: [
    { title: '왜 main 에 바로 올리지 않나', html: `<p>지금까지는 고친 걸 <code>main</code> 에 바로 커밋하고 push 했어요. 혼자면 괜찮지만, 여럿이 쓰거나 <b>main 이 늘 잘 돌아가야</b> 하는 저장소(이 사이트처럼 main = 실제 배포)에서는 위험해요.</p>
<p>그래서 <b>브랜치에서 고치고 → Pull Request(PR)로 「합쳐 주세요」 요청 → 확인 → 합치기</b> 순서로 해요.</p>
<pre class="code">main ──●──────────────●── (합친 뒤)
        \\            /
         ●──●──●────   ← 내 브랜치: 고친 커밋들
              PR: 「이걸 main 에 합쳐 주세요」 → 리뷰 · 자동 검사 · 합치기</pre>
<table class="kb"><tbody><tr><td>리뷰</td><td>합치기 전에 다른 사람(또는 나)이 바뀐 줄을 보고 코멘트</td></tr><tr><td>자동 검사</td><td>PR 마다 테스트가 돌아 초록 ✓ 가 떠야 합치기(챕터 4)</td></tr><tr><td>기록</td><td>「왜 이렇게 바꿨나」 가 PR 설명·대화로 남아요. 몇 달 뒤 찾아보기 좋아요</td></tr></tbody></table>
<p>혼자 쓰는 저장소에서도 PR 로 하는 습관을 들이면, 나중에 팀에 가서도 그대로예요. 이 사이트의 모든 업데이트도 PR 로 올라가요.</p>` },
    { title: 'Compare & pull request → Create pull request', html: `<div class="bk-step-box"><b>① 내 컴퓨터: 브랜치에서 고치고 올리기</b><pre>git switch -c readme-usage
(README 고치기)
git commit -am "README 에 사용법 추가"
git push -u origin readme-usage</pre>브랜치 이름은 무엇을 하는지 영어로 짧게 — <code>readme-usage</code>, <code>fix-empty-input</code>(터미널·Git 교과서 레슨 12).</div>
<div class="bk-step-box"><b>② GitHub: 노란 띠</b><br>push 하고 저장소 화면을 열면 파일 목록 위에 노란 띠가 떠요 → <b>Compare &amp; pull request</b>. 띠가 없으면 <b>Pull requests</b> 탭 → <b>New pull request</b>.</div>
<div class="bk-step-box"><b>③ 합칠 방향</b><br>맨 위 두 칸: <b>base: main</b> ← <b>compare: readme-usage</b>. 「compare 의 커밋을 base 에 합친다」 는 뜻이에요. 그 아래 「Able to merge」(충돌 없음)가 보이면 좋아요.</div>
<div class="bk-step-box"><b>④ 제목과 설명</b><br>제목 = 무엇을(<code>README 에 사용법 추가</code>). 설명 칸에는 세 줄이면 충분해요:<pre>## 무엇
README 에 명령 표를 넣었어요.
## 왜
처음 온 사람이 실행 방법을 몰라서.
## 확인 방법
Preview 에서 표가 보이는지.</pre></div>
<div class="bk-step-box"><b>⑤ 만들기</b><br><b>Create pull request</b>. 아직 덜 됐으면 버튼 옆 ▾ → <b>Create draft pull request</b> → <b>Draft pull request</b>(초안 — 「아직 합치지 마세요」 표시).</div>
<p>PR 화면 탭: <b>Conversation</b>(대화·설명) · <b>Commits</b>(이 PR 의 커밋들) · <b>Checks</b>(자동 검사) · <b>Files changed</b>(바뀐 줄). PR 은 번호가 붙어요(<code>#1</code>) — 이슈와 같은 번호 줄이에요.</p>` + GH_DATE, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g5 && mkdir g5 && cd g5\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\necho "# todo" > README.md && git add . && git commit -qm "시작" && git push -q origin main\ngit switch -c readme-usage\necho "## 사용법" >> README.md\ngit commit -am "README 에 사용법 추가"\ngit push -u origin readme-usage\ngit branch -a', label: '예제 명령 — 브랜치를 원격에 올리기까지(PR 은 GitHub 화면에서)' } },
    { title: 'PR 을 연 뒤에도 브랜치에 커밋하면 PR 에 붙어요', html: `<p>PR 은 「브랜치」 를 가리켜요. 그래서 PR 을 연 뒤에 같은 브랜치에 커밋을 더 push 하면 <b>PR 에 자동으로 붙어요</b>. 고칠 게 생기면 PR 을 닫고 새로 열 필요 없이 그냥 커밋하고 push 하면 돼요.</p>
<pre>git switch readme-usage
(더 고치기)
git commit -am "표에 list 명령 추가"
git push</pre>
<p class="muted small"><code>-am</code> = <code>-a</code>(Git 이 이미 아는 파일의 바뀐 것을 add 까지 같이 — 새 파일은 따로 <code>git add</code>) + <code>-m</code>(메시지). 이 교과서에서 자주 써요.</p>
<p>PR 의 Commits 탭에 커밋이 하나 늘고, Conversation 에 「내아이디 added 1 commit」 이 보여요.</p>
<div class="bk-warn"><b>main 에서 고치고 있지 않은지</b> 늘 확인해요: Git Bash 프롬프트 끝의 <code>(main)</code> / <code>(readme-usage)</code>. PR 을 연 다음 실수로 main 에 커밋하면 터미널·Git 교과서 레슨 15 ② 「main 에 잘못 커밋 → 브랜치로 옮기기」.</div>` },
  ],
  summary: ['브랜치 → push → Compare & pull request', 'base ← compare, 제목 + 무엇·왜·확인 방법', '같은 브랜치에 push 하면 PR 에 붙음'] },
{ id: 'G6', ch: 2, n: 6, title: '코드 리뷰: 줄 코멘트와 Suggestion', mode: 'text', tutorSummary: 'Files changed 탭, 줄에 마우스 → + (Add a comment), Start a review / Add single comment. Insert a suggestion 로 suggestion 블록 → 작성자가 Commit suggestion. Submit review: Comment / Approve / Request changes. 내 PR 은 Approve·Request changes 불가.',
  pages: [
    { title: 'Files changed 에서 줄마다 코멘트', html: `<p>리뷰는 「바뀐 줄을 보며 질문·제안 남기기」 예요. PR 화면의 <b>Files changed</b> 탭에서 해요.</p>
<div class="bk-step-box"><b>① 줄 고르기</b><br>코멘트하고 싶은 줄에 마우스를 올리면 줄 번호 옆에 파란 <b>+</b> 가 나와요 → 누르기. 여러 줄이면 + 를 누른 채 끌어요.</div>
<div class="bk-step-box"><b>② 코멘트 쓰기</b><br>칸에 Markdown 으로 쓰고:
<ul><li><b>Start a review</b> — 「검토 중」 으로 모아 뒀다가 마지막에 한꺼번에 보내기(보내기 전엔 나만 보여요)</li><li><b>Add single comment</b> — 지금 바로 하나만</li></ul></div>
<div class="bk-step-box"><b>③ 좋은 코멘트</b><br>사람이 아니라 코드에 대해, 이유와 함께: 「여기서 입력이 비면 <code>IndexError</code> 가 날 것 같아요. <code>if not line:</code> 로 먼저 막으면 어때요?」. 칭찬도 리뷰예요(「이 함수 이름 좋네요」).</div>
<p class="muted small">파일 하나를 다 봤으면 파일 이름 오른쪽의 <b>Viewed</b> 칸을 체크해 접어 둘 수 있어요.</p>` + GH_DATE },
    { title: 'Suggestion: 고칠 코드를 바로 제안하기', html: `<p>「이렇게 바꾸면 어때요」 를 말 대신 <b>코드로</b> 남기는 기능이에요. 작성자는 버튼 하나로 받아들일 수 있어요.</p>
<div class="bk-step-box"><b>① 리뷰어: 제안 넣기</b><br>줄 코멘트 칸 위 도구 막대의 <b>±</b> 모양 버튼(Insert a suggestion)를 누르면 그 줄이 이런 블록으로 들어가요 — 안의 코드를 원하는 모양으로 고쳐요:<pre>\`\`\`suggestion
if not line:
    continue
\`\`\`</pre>→ <b>Start a review</b> 또는 <b>Add single comment</b>. 리뷰를 한 번 시작하면 다음 코멘트부터 버튼이 <b>Add review comment</b> 로 바뀌어요.</div>
<div class="bk-step-box"><b>② 작성자: 받아들이기</b><br>Conversation 이나 Files changed 의 그 코멘트에 <b>Commit suggestion</b> → 커밋 메시지 확인 → <b>Commit changes</b>. 브랜치에 커밋이 하나 생겨요. 여러 개를 한 커밋으로 받으려면 <b>Add suggestion to batch</b> 를 여러 번 → <b>Commit suggestions</b>.</div>
<div class="bk-warn"><b>내 컴퓨터는 git pull</b> — 웹에서 Commit suggestion 을 했으면 GitHub 쪽 브랜치가 한 칸 앞서요(레슨 3 과 같은 상황). 그 브랜치에서 더 고치기 전에 <code>git pull</code>.</div>` + GH_DATE },
    { title: 'Submit review: Comment · Approve · Request changes', html: `<p>Start a review 로 모은 코멘트는 마지막에 한꺼번에 보내요: Files changed 오른쪽 위 <b>Submit review</b> → 요약 한 줄 → 셋 중 하나 → <b>Submit review</b>.</p>
<table class="kb"><tbody><tr><td><b>Comment</b></td><td>의견만(찬성·반대 표시 없이)</td></tr><tr><td><b>Approve</b></td><td>「합쳐도 돼요」</td></tr><tr><td><b>Request changes</b></td><td>「이건 고쳐야 합쳐요」</td></tr></tbody></table>
<div class="bk-step-box"><b>혼자 연습할 때</b><br><b>내가 연 PR 에는 Approve · Request changes 를 고를 수 없어요</b>(GitHub 규칙). 그래서 이 교과서는 리뷰를 <b>Comment</b> 로 연습해요. 리뷰어 모자를 쓴 셈 치고 코멘트·Suggestion 을 남기고, 작성자 모자로 바꿔 받아들이거나 답글을 다는 식이에요.</div>
<p>작성자가 코멘트를 다 처리했으면 그 대화의 <b>Resolve conversation</b> 을 눌러 접어요. 「무엇을 고쳤는지」 답글을 한 줄 남기면 더 좋아요(「고쳤어요 — a1b2c3d」).</p>` + GH_DATE },
  ],
  summary: ['Files changed → 줄의 + → Start a review / Add single comment', 'Insert a suggestion → 작성자가 Commit suggestion', 'Submit review: Comment · Approve · Request changes (내 PR 은 Comment 만)'] },
{ id: 'G7', ch: 2, n: 7, title: '합치는 방법 세 가지와 뒷정리', mode: 'text', tutorSummary: 'Merge pull request(merge commit) / Squash and merge / Rebase and merge, Confirm …, Delete branch. 로컬: git switch main, git pull, git fetch --prune, squash 뒤 git branch -d 는 not fully merged → PR 이 merged 인지 보고 -D.',
  pages: [
    { title: 'Create a merge commit · Squash and merge · Rebase and merge', html: `<p>PR 화면 맨 아래 초록 버튼 옆 <b>▾</b> 에서 합치는 방법을 골라요. 결과 기록 모양이 달라요.</p>
<pre class="code">PR 브랜치 커밋: A, B, C

① Create a merge commit
main ─●──────────M
       └─A─B─C──┘
   (A·B·C 그대로 + 합친 커밋 M)

② Squash and merge
main ─●──S
   (A·B·C 를 커밋 하나 S 로)

③ Rebase and merge
main ─●──A'─B'─C'
   (main 끝에 하나씩 다시 쌓기)</pre>
<table class="kb"><tbody><tr><td><b>Merge pull request</b><br>(Create a merge commit)</td><td>기록을 그대로 다 남겨요. 큰 기능·여러 사람 작업</td></tr><tr><td><b>Squash and merge</b></td><td>main 에는 PR 하나 = 커밋 하나. 「오타 고침」 같은 작은 커밋이 많을 때 깔끔. <b>이 사이트가 쓰는 방식</b>(커밋 끝에 <code>(#117)</code> 처럼 PR 번호가 붙어요)</td></tr><tr><td><b>Rebase and merge</b></td><td>합친 커밋 없이 한 줄로. 커밋 번호(해시)는 새로 생겨요(터미널·Git 교과서 레슨 14)</td></tr></tbody></table>
<p>고른 뒤 <b>Confirm merge</b> · <b>Confirm squash and merge</b> · <b>Confirm rebase and merge</b>. 다 되면 PR 위에 보라색 <b>Merged</b> 가 붙고 <b>Delete branch</b> 버튼이 나와요 → 눌러서 GitHub 쪽 브랜치를 지워요(필요하면 <b>Restore branch</b> 로 되살릴 수 있어요).</p>` + GH_DATE },
    { title: '합친 뒤 내 컴퓨터 뒷정리', html: `<p>GitHub 에서 합쳤어도 <b>내 컴퓨터는 아직 모르는 상태</b>예요. 네 줄로 정리해요.</p>
<pre>git switch main
git pull
git fetch --prune
git branch -d readme-usage</pre>
<table class="kb"><tbody><tr><td><code>git pull</code></td><td>합친 결과(squash 면 커밋 S)를 내 main 으로</td></tr><tr><td><code>git fetch --prune</code></td><td>GitHub 에서 지운 브랜치의 흔적(<code>origin/readme-usage</code>)도 지우기 — <code>git pull</code> 만으로는 안 지워져요</td></tr><tr><td><code>git branch -d</code></td><td>다 쓴 내 브랜치 지우기</td></tr></tbody></table>
<div class="bk-warn"><b>Squash 로 합쳤으면 <code>-d</code> 가 거절해요</b><pre class="code">error: the branch 'readme-usage' is not fully merged.</pre>squash 는 A·B·C 를 <b>새 커밋 S</b> 로 만들어서, Git 이 보기엔 A·B·C 가 main 에 없거든요. GitHub 의 PR 에 보라색 <b>Merged</b> 가 붙은 걸 확인했으면 <code>git branch -D readme-usage</code>(대문자 D = 강제로 지우기). 확인 안 하고 -D 하면 진짜 안 합친 작업을 잃을 수 있어요.</div>
<p>예제는 GitHub 에서 squash 로 합친 상황을 흉내 내서(다른 폴더에서 <code>git merge --squash</code>), 뒷정리를 해 보는 거예요.</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g7 && mkdir g7 && cd g7\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\necho "# todo" > README.md && git add . && git commit -qm "시작" && git push -q origin main\ngit switch -qc readme-usage && echo "## 사용법" >> README.md && git commit -qam "사용법" && echo "- add" >> README.md && git commit -qam "add 설명" && git push -q -u origin readme-usage && cd ..\ngit clone -q remote.git web && cd web && git merge -q --squash origin/readme-usage && git commit -qm "README 에 사용법 (#1)" && git push -q origin main && git push -q origin --delete readme-usage && cd ../work\ngit switch main\ngit pull\ngit fetch --prune\ngit branch -d readme-usage\ngit branch -D readme-usage\ngit branch -a\ngit log --oneline', label: '예제 명령 — squash 뒤 -d 는 일부러 거절돼요' } },
  ],
  summary: ['merge commit · squash · rebase — 기록 모양이 다름', 'Confirm … → Merged → Delete branch', '내 컴퓨터: switch main → pull → fetch --prune → branch -d(squash 면 -D)'] },
{ id: 'G8', ch: 2, n: 8, title: 'PR 에 충돌이 나면', mode: 'text', tutorSummary: 'This branch has conflicts that must be resolved. 웹: Resolve conflicts → 마커 지우고 고치기 → Mark as resolved → Commit merge. 로컬: git switch 브랜치 → git pull origin main(또는 git merge main) → 충돌 고치기 → add → commit → push.',
  pages: [
    { title: '「This branch has conflicts that must be resolved」', html: `<p>내가 PR 을 연 사이에 main 이 같은 줄을 다르게 바꾸면, PR 아래에 회색 상자가 떠요: <b>This branch has conflicts that must be resolved</b>. 초록 합치기 버튼이 막혀요. 터미널·Git 교과서 레슨 13 의 충돌이 GitHub 에서 생긴 거예요 — 푸는 곳만 둘 중 하나를 고르면 돼요.</p>
<table class="kb"><tbody><tr><td><b>웹에서</b>(2쪽)</td><td>충돌이 간단한 글자일 때. 브라우저에서 끝</td></tr><tr><td><b>내 컴퓨터에서</b>(3쪽)</td><td>코드가 돌아가는지 실행해 보며 고쳐야 할 때·파일이 많을 때</td></tr></tbody></table>
<p>어느 쪽이든 결과는 같아요: <b>main 을 내 브랜치에 합치는 커밋</b>이 생기고, PR 이 다시 「합칠 수 있음」 이 돼요.</p>` + GH_DATE },
    { title: '웹에서: Resolve conflicts → Mark as resolved → Commit merge', html: `<div class="bk-step-box"><b>① 열기</b><br>PR 아래 충돌 상자의 <b>Resolve conflicts</b>. 편집기에 충돌 파일이 마커와 함께 열려요:<pre class="code">&lt;&lt;&lt;&lt;&lt;&lt;&lt; readme-usage
라떼 4800
=======
라떼 5000
&gt;&gt;&gt;&gt;&gt;&gt;&gt; main</pre>위가 내 브랜치, 아래가 main 이에요.</div>
<div class="bk-step-box"><b>② 고치기</b><br>남길 모양으로 고치고 <b>마커 세 줄을 지워요</b>(<code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> · <code>=======</code> · <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>). 한쪽만 남겨도, 섞어도 돼요.</div>
<div class="bk-step-box"><b>③ 완료</b><br>파일마다 오른쪽 위 <b>Mark as resolved</b> → 다 됐으면 <b>Commit merge</b>. PR 화면으로 돌아오면 「This branch has no conflicts with the base branch」 와 초록 버튼이 보여요.</div>
<div class="bk-warn">웹에서 풀면 GitHub 쪽 내 브랜치에 합친 커밋이 생겨요 → 내 컴퓨터의 그 브랜치에서 더 고치기 전에 <code>git pull</code>.</div>` + GH_DATE },
    { title: '내 컴퓨터에서: main 을 내 브랜치로 받아 와 풀기', html: `<pre>git switch sale
git pull origin main --no-edit
(충돌! 파일을 열어 고치고 마커 지우기)
git add menu.txt
git commit --no-edit
git push</pre>
<p><code>git pull origin main</code> = 「GitHub 의 main 을 받아서 지금 브랜치(내 PR 브랜치)에 합쳐」. 충돌 해결은 터미널·Git 교과서 레슨 13 과 똑같아요. push 하면 PR 이 바로 「충돌 없음」 으로 바뀌어요.</p>
<p>예제는 원격의 main 과 내 브랜치가 같은 줄(라떼 가격)을 다르게 바꾼 상태를 만들고, 내 컴퓨터에서 풀어 보는 거예요. 고치는 줄은 <code>printf</code> 로 대신 썼어요(실제로는 편집기로).</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g8 && mkdir g8 && cd g8\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\nprintf \'%s\\n\' "아메리카노 4000" "라떼 4500" > menu.txt && git add . && git commit -qm "메뉴판" && git push -q origin main\ngit switch -qc sale && printf \'%s\\n\' "아메리카노 4000" "라떼 4800" > menu.txt && git commit -qam "라떼 할인" && git push -q -u origin sale && cd ..\ngit clone -q remote.git web && cd web && printf \'%s\\n\' "아메리카노 4000" "라떼 5000" > menu.txt && git commit -qam "라떼 인상" && git push -q && cd ../work\ngit pull origin main --no-edit\ncat menu.txt\nprintf \'%s\\n\' "아메리카노 4000" "라떼 4800" > menu.txt\ngit add menu.txt\ngit commit --no-edit\ngit push\ngit log --oneline --graph', label: '예제 명령 — 충돌은 일부러 나요' } },
  ],
  summary: ['This branch has conflicts → 합치기 막힘', '웹: Resolve conflicts → 마커 지우기 → Mark as resolved → Commit merge', '내 컴퓨터: 브랜치에서 git pull origin main → 고치기 → add · commit · push'] },
{ id: 'G9', ch: 2, n: 9, title: 'Issues 로 할 일 관리', mode: 'text', tutorSummary: 'Issues → New issue → 제목·설명(재현·기대·실제) → Submit new issue. Labels · Assignees · Milestone. PR 설명에 Closes #3 / Fixes #3 → 기본 브랜치에 합쳐지면 이슈 자동 닫힘. Settings → Features → Issues → Set up templates.',
  pages: [
    { title: '이슈 쓰기: 재현 방법 · 기대 · 실제', html: `<p><b>이슈</b>는 저장소의 할 일·버그·아이디어 글이에요. 혼자 쓰는 저장소에서도 「다음에 할 것」 메모장으로 좋아요.</p>
<div class="bk-step-box"><b>만들기</b><br>저장소 <b>Issues</b> 탭 → <b>New issue</b>(템플릿이 있으면 고르는 화면이 나와요 — 빈 글로 쓰려면 <b>Open a blank issue</b>) → 제목 · 설명 → <b>Submit new issue</b>. 이슈에도 번호가 붙어요(<code>#3</code>).</div>
<p>버그 이슈는 남이 <b>그대로 따라 해서 같은 버그를 볼 수 있게</b> 써요(파이썬 교과서 레슨 47 「디버깅 사고법」 과 같은 생각):</p>
<pre>## 재현 방법
1. python todo.py
2. 아무것도 안 치고 Enter

## 기대
「빈 입력이에요」 안내

## 실제
IndexError: list index out of range (todo.py 12번째 줄)

## 환경
Windows 11 · Python 3.15</pre>
<p>코멘트에서 <code>#3</code> 처럼 번호를 쓰면 그 이슈·PR 로 가는 링크가 돼요. 커밋 해시(<code>a1b2c3d</code>)도 링크가 돼요.</p>` + GH_DATE },
    { title: 'Labels · Assignees · Milestone', html: `<p>이슈 화면 오른쪽 칸들로 정리해요(이슈를 만들 때도, 나중에도).</p>
<table class="kb"><tbody><tr><td><b>Labels</b></td><td>종류 꼬리표: <code>bug</code> · <code>enhancement</code>(기능) · <code>documentation</code> · <code>good first issue</code>(처음 오는 사람용) 등이 기본으로 있어요. Issues 탭 → <b>Labels</b> 에서 새로 만들 수도 있어요</td></tr><tr><td><b>Assignees</b></td><td>누가 할지. 혼자면 나 — 「assign yourself」</td></tr><tr><td><b>Milestone</b></td><td>묶음·마감: 「v1.0」 처럼. Issues 탭 → <b>Milestones</b> → <b>New milestone</b> 에서 만들면 진행률 막대가 생겨요</td></tr></tbody></table>
<p>Issues 목록 위 검색 칸에서 거르기: <code>is:open label:bug</code> · <code>assignee:@me</code> · <code>milestone:v1.0</code>.</p>` + GH_DATE },
    { title: 'Closes #3: PR 이 합쳐지면 이슈가 저절로 닫혀요', html: `<p>PR 설명에 <b>닫는 낱말 + 이슈 번호</b>를 쓰면 둘이 연결되고, <b>그 PR 이 기본 브랜치(main)에 합쳐질 때 이슈가 자동으로 닫혀요</b>.</p>
<pre>Closes #3</pre>
<p>쓸 수 있는 낱말: <code>close</code> · <code>closes</code> · <code>closed</code> · <code>fix</code> · <code>fixes</code> · <code>fixed</code> · <code>resolve</code> · <code>resolves</code> · <code>resolved</code>. 여러 개면 각각: <code>Fixes #3, fixes #5</code>.</p>
<ul><li>연결되면 이슈 오른쪽 <b>Development</b> 칸에 PR 이 보여요.</li><li>main 이 아닌 브랜치로 합치는 PR 이면 자동으로 안 닫혀요.</li><li>커밋 메시지에 써도 돼요(<code>git commit -m "빈 입력 처리 (Fixes #3)"</code>) — main 에 들어갈 때 닫혀요.</li></ul>
<div class="bk-step-box"><b>이슈 템플릿 (선택)</b><br>저장소 <b>Settings</b> → <b>General</b> 의 「Features」 칸 → <b>Issues</b> 아래 <b>Set up templates</b> → <b>Add template</b> ▾ → <b>Bug report</b> → <b>Propose changes</b> → <b>Commit changes</b>. <code>.github/ISSUE_TEMPLATE/bug_report.md</code> 가 생기고, 다음부터 New issue 에서 그 틀을 고를 수 있어요. PR 틀은 <code>.github/pull_request_template.md</code> 파일을 만들면 돼요.</div>` + GH_DATE },
  ],
  summary: ['Issues → New issue → Submit new issue (재현·기대·실제)', 'Labels · Assignees · Milestone, 검색 is:open label:bug', 'PR 설명에 Closes #3 → main 에 합쳐지면 이슈 자동 닫힘'] },
{ id: 'G10', ch: 2, n: 10, title: 'Projects 보드', mode: 'text', tutorSummary: '프로필 → Projects → New project → Start from scratch: Board → Project name → Create project. Todo / In Progress / Done 칸, + Add item 으로 이슈·PR 추가, 카드 끌어 옮기기, 기본 Workflows(닫히면 Done).',
  pages: [
    { title: '보드 만들기: Projects → New project → Board', html: `<p>이슈가 많아지면 「지금 뭘 하고 있지?」 를 한눈에 보고 싶어져요. <b>Projects</b> 는 이슈·PR 을 카드로 놓는 칸반 보드예요.</p>
<div class="bk-step-box"><b>만들기</b><br>내 프로필(<code>github.com/내아이디</code>) → 위 <b>Projects</b> 탭 → <b>New project</b> → 「Start from scratch」 의 <b>Board</b> → 「Project name」 칸에 <code>todo-cli 할 일</code> → <b>Create project</b>.</div>
<p>칸 세 개가 생겨요: <b>Todo</b>(할 것) · <b>In Progress</b>(하는 중) · <b>Done</b>(끝). 칸은 「Status」 값이라서 이름을 바꾸거나 칸을 더할 수 있어요.</p>
<p class="muted small">프로젝트는 저장소가 아니라 <b>내 계정</b>에 붙어요. 그래서 여러 저장소의 이슈를 한 보드에 모을 수도 있어요. 저장소 화면에서 보이게 하려면 저장소 <b>Projects</b> 탭 → <b>Link a project</b>.</p>` + GH_DATE },
    { title: '카드 넣고 옮기기, 그리고 자동으로 Done', html: `<ul><li><b>이슈 넣기</b>: 칸 맨 아래 <b>+ Add item</b> → <code>#</code> 를 치면 저장소 고르기 → 이슈 번호 고르기. 또는 이슈 화면 오른쪽 <b>Projects</b> 칸에서 보드 고르기.</li><li><b>메모 카드</b>: + Add item 에 그냥 글을 쓰면 「초안(draft)」 카드 — 나중에 이슈로 바꿀 수 있어요.</li><li><b>옮기기</b>: 카드를 끌어서 In Progress 로. 일을 시작할 때 옮기는 게 습관이에요.</li></ul>
<div class="bk-step-box"><b>자동으로 Done</b><br>보드 오른쪽 위 <b>⋯</b> → <b>Workflows</b> 에 기본으로 켜진 자동화가 있어요: 이슈가 닫히거나 PR 이 합쳐지면 그 카드를 <b>Done</b> 으로. 레슨 9 의 <code>Closes #3</code> 과 같이 쓰면 「PR 합치기 → 이슈 닫힘 → 카드 Done」 이 한 번에 돼요.</div>` + GH_DATE },
  ],
  summary: ['프로필 → Projects → New project → Board', 'Todo · In Progress · Done, + Add item 으로 이슈', 'Workflows: 닫히면·합쳐지면 자동 Done'] },
{ id: 'GB2', ch: 2, boss: true, title: '보스: 혼자 하는 협업 한 바퀴', mode: 'text', pages: [], summary: [], tutorSummary: '이슈 2개 → 브랜치 2개 → PR 2개(줄 코멘트·Suggestion 반영) → 하나는 충돌 해결 → squash → 이슈 자동 닫힘 → 보드 Done.' },
// ================= 챕터 3 세상에 내놓기 (v2.16.2) =================
{ id: 'G11', ch: 3, n: 11, title: 'fork 와 오픈소스 첫 기여', mode: 'text', tutorSummary: 'Fork → Owner · Repository name · Copy the main branch only → Create fork. clone 내 fork, git remote add upstream 원래주소, git fetch upstream, git merge upstream/main, push. 웹 Sync fork → Update branch. 첫 기여: firstcontributions/first-contributions — Contributors.md 에 이름, PR base 는 원래 저장소.',
  pages: [
    { title: 'fork = 남의 저장소를 내 계정으로 복사', html: `<p>남의 공개 저장소는 내가 push 할 권한이 없어요. 그래서 <b>fork</b> 로 내 계정에 복사본을 만들고, 거기서 고친 다음 <b>원래 저장소로 PR</b> 을 보내요. 오픈소스 기여는 거의 다 이렇게 해요.</p>
<pre class="code">원래 저장소 (upstream)   남아이디/프로젝트
      │ Fork
      ▼
내 fork (origin)         내아이디/프로젝트   ← 내가 push 하는 곳
      │ git clone
      ▼
내 컴퓨터

PR:  내아이디/프로젝트 의 브랜치  ──▶  남아이디/프로젝트 의 main</pre>
<div class="bk-step-box"><b>Fork 하기</b><br>원래 저장소 오른쪽 위 <b>Fork</b> → 「Owner」 는 나, 「Repository name」 은 그대로, ☑ <b>Copy the main branch only</b>(보통 그대로) → <b>Create fork</b>. 내 계정에 <code>내아이디/프로젝트</code> 가 생기고 이름 아래에 「forked from 남아이디/프로젝트」 가 보여요.</div>
<table class="kb"><tbody><tr><td><b>branch</b></td><td>같은 저장소 안의 갈래 — 권한이 있을 때(내 저장소)</td></tr><tr><td><b>fork</b></td><td>다른 계정으로 저장소째 복사 — 권한이 없을 때(남의 저장소)</td></tr><tr><td><b>clone</b></td><td>GitHub 의 저장소를 내 컴퓨터로 복사</td></tr></tbody></table>
<p class="muted small">내 저장소는 내 계정으로 fork 할 수 없어요(이미 내 거라서). 그래서 연습은 공개 연습 저장소로 해요(3쪽).</p>` + GH_DATE },
    { title: 'upstream 연결하고 원래 저장소 따라가기', html: `<p>내가 fork 한 뒤에도 원래 저장소는 계속 바뀌어요. 내 fork 는 저절로 따라가지 않아요. 두 방법이 있어요.</p>
<div class="bk-step-box"><b>① 웹: Sync fork</b><br>내 fork 화면의 파일 목록 위 <b>Sync fork</b> ▾ → 「This branch is N commits behind」 확인 → <b>Update branch</b>. 그다음 내 컴퓨터는 <code>git pull</code>.</div>
<div class="bk-step-box"><b>② 내 컴퓨터: upstream 원격 더하기</b><pre>git remote add upstream https://github.com/남아이디/프로젝트.git
git remote -v
git fetch upstream
git switch main
git merge upstream/main
git push</pre><code>origin</code> = 내 fork(push 하는 곳), <code>upstream</code> = 원래 저장소(받기만). 이름은 관습이에요.</div>
<p>새 기여를 시작할 때마다 먼저 main 을 upstream 에 맞춘 다음 브랜치를 만들면, PR 에 충돌이 덜 나요.</p>
<p>예제는 내 컴퓨터 폴더로 「원래 저장소(upstream.git)」 와 「내 fork(fork.git)」 를 만들어서 ② 를 해 보는 거예요.</p>` + GH_DATE, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g11 && mkdir g11 && cd g11\ngit init -q --bare upstream.git && git clone -q upstream.git owner && cd owner && echo "# 프로젝트" > README.md && git add . && git commit -qm "시작" && git push -q origin main && cd ..\ngit clone -q --bare upstream.git fork.git\ngit clone -q fork.git mine\ncd owner && echo "새 기능" >> README.md && git commit -qam "원래 저장소에 새 커밋" && git push -q && cd ../mine\ngit remote add upstream ../upstream.git\ngit remote -v\ngit fetch upstream\ngit switch main\ngit merge upstream/main\ngit push\ngit log --oneline', label: '예제 명령 — 원래 저장소의 새 커밋을 내 fork 로' } },
    { title: '첫 기여: first-contributions 에 내 이름 올리기', html: `<p><a href="https://github.com/firstcontributions/first-contributions" target="_blank" rel="noopener">firstcontributions/first-contributions</a> 는 「첫 PR 연습용」 으로 유명한 공개 저장소예요. <code>Contributors.md</code> 에 내 이름 한 줄을 넣는 PR 을 보내면 받아 줘요(2026-11 에도 하루에 수십 개씩 합쳐지고 있어요). README 에 한국어 안내도 있어요.</p>
<ol><li>그 저장소에서 <b>Fork</b> → <b>Create fork</b></li><li>내 fork 를 clone: <code>git clone https://github.com/내아이디/first-contributions.git</code></li><li><code>cd first-contributions</code> → <code>git switch -c add-내아이디</code></li><li><code>Contributors.md</code> 를 열어 <b>처음도 끝도 아닌 중간 아무 곳</b>에 내 이름(또는 아이디) 한 줄 → 저장</li><li><code>git add Contributors.md</code> → <code>git commit -m "Add 내아이디 to Contributors list"</code> → <code>git push -u origin add-내아이디</code></li><li>내 fork 화면의 노란 띠 <b>Compare &amp; pull request</b> → 맨 위가 <b>base repository: firstcontributions/first-contributions · base: main</b> ← <b>head repository: 내아이디/first-contributions · compare: add-내아이디</b> 인지 확인 → <b>Create pull request</b></li></ol>
<div class="bk-warn"><b>공개 기록이에요.</b> 넣은 이름과 아이디는 전 세계에 보여요. 실명이 싫으면 아이디만 넣어요. 커밋 이메일이 noreply 인지 먼저 확인하세요(레슨 1).</div>
<p><b>진짜 프로젝트에 기여할 때</b>는: README 와 <code>CONTRIBUTING.md</code> 를 먼저 읽기 · 이슈 목록에서 <code>good first issue</code> Label(꼬리표, 레슨 9) 찾기 · 큰 작업은 PR 전에 이슈로 「이거 해도 될까요?」 묻기 · PR 은 작게, 설명에 무엇·왜·확인 방법.</p>` + GH_DATE },
  ],
  summary: ['Fork → Create fork = 내 계정으로 복사', 'origin = 내 fork, upstream = 원래 — fetch upstream · merge · push, 웹은 Sync fork', '첫 기여: first-contributions 의 Contributors.md'] },
{ id: 'G12', ch: 3, n: 12, title: 'GitHub Pages 두 가지 방법', mode: 'text', tutorSummary: 'Settings → Code, planning, and automation → Pages → Build and deployment → Source: Deploy from a branch(Branch main · /(root) → Save) 또는 GitHub Actions. 주소 https://아이디.github.io/저장소/, 아이디.github.io 저장소는 루트. index.html(대소문자), 404.html, 링크는 상대 경로, 무료 계정은 공개 저장소에서만 Pages(유료로 비공개에서 켜도 사이트는 공개).',
  pages: [
    { title: 'Deploy from a branch: 저장소의 파일을 그대로 사이트로', html: `<p><b>GitHub Pages</b> 는 저장소의 HTML 파일을 무료로 인터넷 주소에 올려 주는 기능이에요. 웹 교과서 레슨 28 에서 해 봤다면 복습이에요.</p>
<div class="bk-step-box"><b>켜기</b><br>저장소 <b>Settings</b> → 왼쪽 「Code, planning, and automation」 의 <b>Pages</b> → 「Build and deployment」 의 「Source」 를 <b>Deploy from a branch</b> → Branch 칸에서 <b>main</b> · 폴더 <b>/ (root)</b> → <b>Save</b>.</div>
<div class="bk-step-box"><b>기다리기</b><br>1~2분 뒤 같은 화면 위에 「Your site is live at <code>https://내아이디.github.io/저장소/</code>」 와 <b>Visit site</b>. 진행은 <b>Actions</b> 탭의 「pages build and deployment」 에서 볼 수 있어요. 그 뒤로는 main 에 push 할 때마다 저절로 다시 올라가요.</div>
<p>첫 화면 파일(entry)은 <code>index.html</code> 이에요. 없으면 <code>index.md</code> 나 <code>README.md</code> 를 찾아요. 이름은 <b>대소문자를 가려요</b> — <code>Index.html</code> 은 안 돼요.</p>` + GH_DATE },
    { title: 'Source: GitHub Actions — 이 사이트가 쓰는 방식', html: `<p>Source 를 <b>GitHub Actions</b> 로 고르면, 브랜치의 파일을 그대로 올리는 대신 <b>워크플로(자동 실행 파일)가 만든 결과</b>를 올려요. 올리기 <b>전에 검사</b>를 할 수 있다는 게 핵심이에요 — 이 사이트는 「검사(verify)가 통과해야만 배포」 해요.</p>
<div class="bk-step-box"><b>켜기</b><br>Settings → Pages → Source: <b>GitHub Actions</b> → 아래에 추천 워크플로들이 보여요 → 그냥 HTML 사이트면 <b>Static HTML</b> 의 <b>Configure</b> → <code>.github/workflows/static.yml</code> 이 편집기로 열림 → <b>Commit changes…</b>.</div>
<p>그 파일 안에서 중요한 줄은 두 개예요(자세한 읽기는 챕터 4):</p>
<pre class="code">- uses: actions/upload-pages-artifact   ← 올릴 파일 묶기
- uses: actions/deploy-pages            ← 사이트로 배포</pre>
<table class="kb"><tbody><tr><td><b>Deploy from a branch</b></td><td>설정 한 번이면 끝. 그냥 HTML·README 사이트</td></tr><tr><td><b>GitHub Actions</b></td><td>배포 전에 검사·빌드가 필요할 때. 이 사이트처럼 「테스트 통과 → 배포」</td></tr></tbody></table>` + GH_DATE },
    { title: '주소 · 404 · 링크 경로 · 공개 범위', html: `<table class="kb"><tbody><tr><td>프로젝트 사이트</td><td>저장소 <code>todo-cli</code> → <code>https://내아이디.github.io/todo-cli/</code></td></tr><tr><td>내 대표 사이트</td><td>저장소 이름을 딱 <code>내아이디.github.io</code> 로 만들면 → <code>https://내아이디.github.io/</code></td></tr><tr><td>없는 주소</td><td>저장소 맨 위에 <code>404.html</code> 을 두면 「없는 페이지」 화면을 내 것으로</td></tr></tbody></table>
<div class="bk-warn"><b>링크를 <code>/</code> 로 시작하면 깨져요</b><br>프로젝트 사이트는 주소 끝에 <code>/todo-cli/</code> 가 붙어요. 그래서 <code>&lt;link href="/style.css"&gt;</code> 는 <code>내아이디.github.io/style.css</code>(없는 곳)를 찾아요. <b>앞의 <code>/</code> 를 빼서</b> <code>href="style.css"</code> 처럼 상대 경로로 써요. 내 컴퓨터(Live Server)에서는 되는데 Pages 에서만 CSS 가 안 먹으면 거의 이거예요.</div>
<div class="bk-warn"><b>사이트는 공개예요</b> — 무료 계정은 <b>공개 저장소</b>에서만 Pages 를 켤 수 있고(비공개 저장소는 유료 Pro 부터), 유료로 비공개 저장소에서 켜도 사이트 자체는 인터넷에 공개돼요. 비밀번호·개인 정보가 든 파일을 올리지 마세요.</div>
<p>예제는 <code>/</code> 로 시작하는 링크를 찾아 상대 경로로 바꾸는 명령이에요(<code>grep -n</code> 은 터미널·Git 교과서 레슨 4. <code>sed -i 's#찾을#바꿀#g' 파일</code> = 파일 안의 글자를 전부 찾아 바꾸고 그 파일에 저장하는 명령 — 터미널·Git 교과서에는 없어서 몰라도 돼요. VS Code 의 바꾸기(<kbd>Ctrl</kbd>+<kbd>H</kbd>)로 해도 같아요).</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g12 && mkdir g12 && cd g12\nprintf \'%s\\n\' \'<link rel="stylesheet" href="/style.css">\' \'<script src="/app.js"></script>\' \'<a href="/about.html">소개</a>\' > index.html\ngrep -n \'="/\' index.html\nsed -i \'s#="/#="#g\' index.html\ncat index.html', label: '예제 명령 — / 로 시작하는 링크를 상대 경로로' } },
  ],
  summary: ['Settings → Pages → Deploy from a branch → main · /(root) → Save', 'Source: GitHub Actions = 검사 뒤 배포(이 사이트)', '주소 아이디.github.io/저장소/, index.html, 링크는 / 없이, 사이트는 공개'] },
{ id: 'G13', ch: 3, n: 13, title: '태그와 Releases', mode: 'text', tutorSummary: 'git tag -a v1.0.0 -m, git tag, git push origin v1.0.0 (태그는 따로 push). 버전 큰.중간.작은. Releases → Draft a new release → Choose a tag(Create new tag, Target main) → Release title → Generate release notes → Publish release.',
  pages: [
    { title: '태그: 커밋에 붙이는 버전 이름', html: `<p>「v1.0 은 어느 커밋이었지?」 를 커밋 해시 대신 이름으로 찾게 하는 게 <b>태그</b>예요. 브랜치와 달리 <b>움직이지 않는</b> 이름표예요.</p>
<pre>git tag -a v1.0.0 -m "첫 공개 버전"
git tag
git show v1.0.0 --stat
git push origin v1.0.0</pre>
<table class="kb"><tbody><tr><td><code>git tag -a 이름 -m 설명</code></td><td>지금 커밋에 설명이 있는 태그(annotated). <code>-a</code> 없이 <code>git tag v1.0.0</code> 이면 이름만 있는 가벼운 태그</td></tr><tr><td><code>git push origin v1.0.0</code></td><td><b>태그는 그냥 <code>git push</code> 로는 안 올라가요</b>. 따로 올리거나 <code>git push --tags</code>(전부)</td></tr><tr><td><code>git switch --detach v1.0.0</code></td><td>그 버전의 파일로 잠깐 돌아가 보기(끝나면 <code>git switch main</code>)</td></tr></tbody></table>
<div class="bk-step-box"><b>버전 번호 읽기: 큰.중간.작은</b><br><code>v2.16.1</code>(이 사이트) — <b>큰</b> 수 = 예전 것과 안 맞는 큰 변화 · <b>중간</b> = 기능 추가 · <b>작은</b> = 고침. 처음 공개는 보통 <code>v1.0.0</code>, 아직 실험이면 <code>v0.1.0</code>.</div>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g13 && mkdir g13 && cd g13\ngit init -q --bare remote.git && git clone -q remote.git work && cd work\necho "print(1)" > todo.py && git add . && git commit -qm "첫 기능" && git push -q origin main\ngit tag -a v1.0.0 -m "첫 공개 버전"\ngit tag\ngit push origin v1.0.0\ngit ls-remote --tags origin', label: '예제 명령 — 태그 만들고 올리기' } },
    { title: 'Releases: 버전마다 공개 페이지 만들기', html: `<p><b>Release</b> 는 태그에 「무엇이 바뀌었나」 설명과 내려받을 파일을 붙인 공개 페이지예요. 쓰는 사람은 Releases 만 보면 돼요.</p>
<div class="bk-step-box"><b>만들기</b><br>저장소 Code 탭 오른쪽 칸의 <b>Releases</b> → <b>Draft a new release</b> → <b>Choose a tag</b> ▾ 에서 올려 둔 <code>v1.0.0</code> 고르기(없으면 <code>v1.0.0</code> 을 쳐서 <b>Create new tag</b> → <b>Target</b> 은 main) → 「Release title」 칸에 <code>v1.0.0 첫 공개</code> → 설명 칸 위 <b>Generate release notes</b>(합친 PR 목록을 자동으로 써 줘요) → <b>Publish release</b>.</div>
<ul><li>아직 시험판이면 <b>This is a pre-release</b> 체크.</li><li>설명을 나중에 쓰려면 <b>Save draft</b>.</li><li>Release 마다 <b>Source code (zip)</b> 가 자동으로 붙어요 — Git 을 모르는 사람도 받을 수 있어요.</li></ul>
<p>릴리스 노트는 「무엇이 새로 됐나 · 무엇을 고쳤나 · 주의할 것」 순서면 충분해요. PR 제목을 잘 써 왔다면 Generate release notes 가 거의 다 해 줘요.</p>` + GH_DATE },
  ],
  summary: ['git tag -a v1.0.0 -m … → git push origin v1.0.0 (따로 push)', '버전 = 큰.중간.작은', 'Releases → Draft a new release → Choose a tag → Generate release notes → Publish release'] },
{ id: 'GB3', ch: 3, boss: true, title: '보스: 포트폴리오 공개', mode: 'text', pages: [], summary: [], tutorSummary: '저장소 2개 README, Pages, v1.0.0 릴리스, 프로필 README(아이디/아이디 저장소).' },
// ================= 챕터 4 자동화와 안전 (v2.16.3) =================
{ id: 'G14', ch: 4, n: 14, title: 'GitHub Actions 첫 워크플로', mode: 'text', tutorSummary: '.github/workflows/test.yml: name, on: [push, pull_request], jobs.test.runs-on ubuntu-latest, steps: actions/checkout@v7, actions/setup-python@v7(python-version 3.13), run: python test_todo.py. 종료 코드 0 = 초록 ✓, 아니면 빨간 ✗. Actions 탭 → 실행 → job → 단계 펼쳐 로그 맨 아래. 공개 저장소 무료.',
  pages: [
    { title: '워크플로 = push 할 때마다 도는 로봇', html: `<p><b>GitHub Actions</b> 는 「저장소에 무슨 일이 생기면(push · PR) GitHub 의 컴퓨터가 내가 정한 명령을 실행」 하게 하는 기능이에요. 제일 흔한 쓰임은 <b>테스트 자동 실행</b>이에요 — 사람이 깜빡해도 로봇은 매번 돌려요.</p>
<pre class="code">git push
   │
   ▼
GitHub 이 .github/workflows/*.yml 을 읽음
   │
   ▼
GitHub 의 컴퓨터(runner, ubuntu)를 하나 빌려
  ① 저장소 받기  ② 파이썬 준비  ③ python test_todo.py
   │
   ▼
끝 코드 0 → 초록 ✓   ·   에러(0 아님) → 빨간 ✗</pre>
<table class="kb"><tbody><tr><td><b>workflow</b>(워크플로)</td><td>자동 실행 하나의 설명 파일. <code>.github/workflows/</code> 폴더의 <code>.yml</code></td></tr><tr><td><b>job</b></td><td>한 컴퓨터에서 차례로 하는 일 묶음</td></tr><tr><td><b>step</b></td><td>job 안의 한 단계 — 남이 만든 동작(<code>uses:</code>) 또는 명령(<code>run:</code>)</td></tr><tr><td><b>runner</b></td><td>그 일을 해 주는 GitHub 의 컴퓨터</td></tr><tr><td><b>끝 코드</b></td><td>프로그램이 끝나며 남기는 숫자. 0 = 성공, 그 밖 = 실패(3쪽에서 직접 봐요)</td></tr></tbody></table>
<div class="bk-warn"><b>공개 저장소는 무료</b>예요. 비공개 저장소는 한 달 무료 시간이 정해져 있어요 — 연습은 공개 저장소로.</div>` },
    { title: 'test.yml 한 줄씩', html: `<p>파이썬 교과서 레슨 46 「테스트 작성」 처럼 <code>assert</code> 로 쓴 <code>test_todo.py</code> 가 있다고 해요(실패하면 에러로 끝나는 파일). 저장소에 <code>.github/workflows/test.yml</code> 을 만들어요 — 폴더 이름의 점(<code>.github</code>)과 철자가 정확해야 GitHub 이 찾아요.</p>
<pre>name: test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-python@v7
        with:
          python-version: "3.13"
      - run: python test_todo.py</pre>
<table class="kb"><tbody><tr><td><code>name: test</code></td><td>Actions 탭에 보일 이름</td></tr><tr><td><code>on: [push, pull_request]</code></td><td>언제 — push 할 때, PR 이 열리거나 바뀔 때</td></tr><tr><td><code>jobs:</code> → <code>test:</code></td><td>job 이름(레슨 15 의 보호 규칙에서 이 이름을 골라요)</td></tr><tr><td><code>runs-on: ubuntu-latest</code></td><td>GitHub 이 빌려줄 컴퓨터 종류(리눅스)</td></tr><tr><td><code>uses: actions/checkout@v7</code></td><td>저장소 파일 받기 — 거의 모든 워크플로의 첫 단계</td></tr><tr><td><code>uses: actions/setup-python@v7</code> + <code>with:</code></td><td>파이썬 3.13 준비</td></tr><tr><td><code>run: python test_todo.py</code></td><td>내 테스트 실행. pytest 를 쓰면 <code>run: pip install pytest</code> 다음 <code>run: python -m pytest</code></td></tr></tbody></table>
<div class="bk-warn"><b>YAML 은 들여쓰기가 문법이에요</b> — 빈칸 두 칸씩, <kbd>Tab</kbd> 은 안 돼요(VS Code 는 .yml 에서 Tab 을 빈칸으로 바꿔 줘요). <code>-</code> 뒤에 빈칸 하나. 틀리면 Actions 탭에 「Invalid workflow file」 이 떠요.</div>` + GH_DATE },
    { title: 'Actions 탭에서 결과 읽기: 빨간 ✗ 를 만나면', html: `<p>push 하고 저장소 <b>Actions</b> 탭을 열면 실행 목록이 있어요. 노란 ● = 도는 중, 초록 ✓ = 성공, 빨간 ✗ = 실패. 커밋 목록·PR 에도 같은 표시가 붙어요.</p>
<div class="bk-step-box"><b>실패 원인 찾기</b><br>빨간 실행을 누름 → 왼쪽 job 이름(<code>test</code>) → 빨간 ✗ 가 붙은 단계(<code>Run python test_todo.py</code>)를 펼침 → <b>맨 아래 줄부터</b> 읽어요. 파이썬 교과서 레슨 47 「디버깅 사고법」 의 트레이스백 읽기와 똑같아요:<pre class="code">  File "test_todo.py", line 7, in test_add
    assert add([], "우유") == ["우유"]
AssertionError
Error: Process completed with exit code 1.</pre></div>
<ul><li>내 컴퓨터에서 같은 테스트를 돌려 재현 → 고치기 → commit · push → 새 실행이 저절로 시작돼요.</li><li>코드는 그대로인데 다시 돌려 보고 싶으면 실행 화면 오른쪽 위 <b>Re-run jobs</b>.</li><li>「내 컴퓨터에선 되는데 Actions 에서만 실패」 는 보통 ① push 안 한 파일 ② 내 컴퓨터에만 깔린 패키지(<code>pip install</code> 단계 빠짐) ③ Windows 경로(<code>C:\\</code>)를 코드에 적은 것이에요.</li></ul>
<p>예제는 내 컴퓨터에서 「끝 코드」 를 직접 보는 거예요. <code>$?</code> 는 바로 앞 명령의 끝 코드 — 0 이면 Actions 가 초록이에요.</p>` + GH_DATE, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g14 && mkdir g14 && cd g14\nprintf \'%s\\n\' \'def add(items, x):\' \'    return items + [x]\' > todo.py\nprintf \'%s\\n\' \'from todo import add\' \'assert add([], "우유") == ["우유"]\' \'print("테스트 통과")\' > test_todo.py\npython test_todo.py\necho "끝 코드: $?"\nprintf \'%s\\n\' \'def add(items, x):\' \'    return items\' > todo.py\npython test_todo.py\necho "끝 코드: $?"', label: '예제 명령 — 두 번째는 일부러 실패(끝 코드 1 = 빨간 ✗)' } },
  ],
  summary: ['.github/workflows/test.yml: on · jobs · runs-on · steps', 'checkout@v6 → setup-python@v5 → run: python test_todo.py', '끝 코드 0 = 초록 ✓, Actions 탭 → 단계 펼쳐 맨 아래 줄'] },
{ id: 'G15', ch: 4, n: 15, title: 'PR 에 초록 체크 + 보호 규칙', mode: 'text', tutorSummary: 'PR 아래 All checks have passed / Some checks were not successful, Details. Settings → Code, planning, and automation → Rulesets → New ruleset → New branch ruleset: Ruleset name, Disabled → Active, Target branches → Add target → Include default branch, ☑ Require a pull request before merging(승인 0), ☑ Require status checks to pass before merging → Add checks(test), Block force pushes → Create. main 에 바로 push → 거절.',
  pages: [
    { title: 'PR 의 Checks: 초록 ✓ 를 보고 합치기', html: `<p>워크플로가 <code>pull_request</code> 에도 돌게 해 두면(레슨 14), PR 아래에 검사 결과 상자가 생겨요.</p>
<table class="kb"><tbody><tr><td>✓ <b>All checks have passed</b></td><td>테스트 통과 — 합쳐도 돼요</td></tr><tr><td>✗ <b>Some checks were not successful</b></td><td>실패 — 옆 <b>Details</b> 로 로그를 보고, 같은 브랜치에 고친 커밋을 push 하면 다시 돌아요</td></tr><tr><td>● 노란 점</td><td>도는 중 — 기다려요</td></tr></tbody></table>
<p>PR 의 <b>Checks</b> 탭에서도 같은 결과와 로그를 볼 수 있어요. 이 사이트의 모든 PR 도 <code>verify</code> 라는 검사가 초록이어야 합쳐져요 — 그런데 지금은 <b>빨간 ✗ 여도 합치기 버튼을 누를 수는 있어요</b>. 「초록이 아니면 못 합치게」 하려면 다음 쪽의 보호 규칙이 필요해요.</p>` + GH_DATE },
    { title: 'Rulesets: main 을 지키는 규칙 만들기', html: `<div class="bk-step-box"><b>① 들어가기</b><br>저장소 <b>Settings</b> → 왼쪽 「Code, planning, and automation」 묶음의 <b>Rulesets</b>(펼쳐지면 그 아래 <b>Rulesets</b> 를 한 번 더) → <b>New ruleset</b> → <b>New branch ruleset</b>.</div>
<div class="bk-step-box"><b>② 이름과 켜기</b><br>「Ruleset name」 칸에 <code>main 보호</code>. 처음엔 <b>Disabled</b> 로 되어 있는 버튼을 눌러 <b>Active</b> 로 — Disabled 면 만들어도 아무것도 막지 않아요.</div>
<div class="bk-step-box"><b>③ 어느 브랜치에</b><br>「Target branches」 → <b>Add target</b> → <b>Include default branch</b>(= main).</div>
<div class="bk-step-box"><b>④ 규칙 고르기</b><ul><li>☑ <b>Restrict deletions</b> · ☑ <b>Block force pushes</b> — 처음부터 켜져 있어요. 그대로 둬요.</li><li>☑ <b>Require a pull request before merging</b> — main 에 바로 push 금지, PR 로만. 펼쳐지는 추가 설정의 <b>승인 수(Required approvals)는 0</b> — 혼자라서(내 PR 은 내가 Approve 못 해요, 레슨 6).</li><li>☑ <b>Require status checks to pass before merging</b> → <b>Add checks</b> → 검색 칸에 <code>test</code>(레슨 14 의 job 이름) → 고르기. 목록에 안 보이면 워크플로를 한 번 이상 돌린 뒤에 다시 찾아요.</li></ul></div>
<div class="bk-step-box"><b>⑤ 저장</b><br>맨 아래 <b>Create</b> 를 눌러요.</div>
<p class="muted small">「Bypass list」 에 나를 넣으면 나는 규칙을 건너뛸 수 있어요. 연습할 때는 비워 둬야 규칙이 나한테도 걸려요.</p>` + GH_DATE },
    { title: '이제 main 에 바로 push 하면', html: `<p>규칙이 켜진 뒤 main 에서 커밋하고 <code>git push</code> 하면 거절돼요. 글은 이런 모양이에요(조금 다를 수 있어요):</p>
<pre class="code">remote: error: GH013: Repository rule violations found for refs/heads/main.
remote: - Changes must be made through a pull request.
 ! [remote rejected] main -&gt; main (push declined due to repository rule violations)</pre>
<p>고장이 아니라 <b>규칙이 일하는 것</b>이에요. 그 커밋을 브랜치로 옮겨서 PR 로 보내요(터미널·Git 교과서 레슨 15 ②):</p>
<pre>git switch -c fix-typo
git push -u origin fix-typo
git switch main
git reset --hard origin/main</pre>
<p>PR 에서는 테스트가 초록이 될 때까지 합치기 버튼이 회색이에요 — 「Merging is blocked」. 이게 이 사이트가 운영되는 방식이에요: <b>검사를 통과한 것만 main 에 들어가고, main 에 들어간 것만 배포돼요</b>.</p>
<p>예제는 내 컴퓨터 원격(<code>remote.git</code>)에 GitHub 의 규칙과 비슷한 「main 에 바로 push 금지」 훅(push 를 받을 때 원격이 저절로 돌리는 검사 파일 — 이 예제에서만 써요, 몰라도 돼요)을 걸어 거절을 직접 보는 거예요.</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g15 && mkdir g15 && cd g15\ngit init -q --bare remote.git && git clone -q remote.git work && cd work && echo "# todo" > README.md && git add . && git commit -qm "시작" && git push -q origin main && cd ..\nprintf \'%s\\n\' \'#!/bin/sh\' \'while read old new ref; do [ "$ref" = refs/heads/main ] && { echo "규칙: main 에 바로 push 금지 — PR 로 보내세요"; exit 1; }; done; exit 0\' > remote.git/hooks/pre-receive && chmod +x remote.git/hooks/pre-receive\ncd work && echo "오타 고침" >> README.md && git commit -qam "오타 고침"\ngit push\ngit switch -c fix-typo\ngit push -u origin fix-typo\ngit switch main\ngit reset --hard origin/main\ngit log --oneline --all', label: '예제 명령 — main 으로의 push 는 일부러 거절돼요(진짜 GitHub 규칙은 Settings 에서)' } },
  ],
  summary: ['PR: All checks have passed / Some checks were not successful → Details', 'Settings → Rulesets → New branch ruleset → Active · default branch', 'Require a pull request(승인 0) + Require status checks(test) → main 바로 push 거절'] },
{ id: 'G16', ch: 4, n: 16, title: '비밀 지키기', mode: 'text', tutorSummary: '.env 에 비밀, .gitignore 에 .env, git check-ignore. Settings → Security → Secrets and variables → Actions → New repository secret(Name·Secret → Add secret), 워크플로 env: X: ${{ secrets.X }}, 로그엔 ***. Push protection(공개 저장소 기본 켜짐). 올렸으면 폐기가 먼저.',
  pages: [
    { title: '비밀은 .env 에, .env 는 .gitignore 에', html: `<p>API 키·비밀번호·토큰을 코드에 그대로 쓰면, 공개 저장소에 올리는 순간 <b>전 세계가 봐요</b>. 다음 커밋에서 지워도 <b>예전 커밋에는 그대로 남아요</b>. 그래서 처음부터 코드 밖에 둬요.</p>
<pre># .env  (저장소에 안 올리는 파일)
API_KEY=abc123진짜키

# app.py
import os
key = os.environ.get("API_KEY")</pre>
<p><code>.env</code> 를 <code>.gitignore</code> 에 한 줄 넣으면 Git 이 못 본 척해요(터미널·Git 교과서 레슨 10). 확인은:</p>
<pre>git check-ignore -v .env</pre>
<p><code>.gitignore:1:.env	.env</code> 처럼 「몇 번째 줄 규칙에 걸렸다」 가 나오면 무시되고 있는 거예요. 아무것도 안 나오면 <b>올라갈 수 있는 상태</b>예요.</p>
<p class="muted small"><code>.env</code> 를 읽어 <code>os.environ</code> 에 넣으려면 보통 <code>python-dotenv</code> 패키지를 써요(<code>pip install python-dotenv</code> → <code>from dotenv import load_dotenv; load_dotenv()</code>). 그리고 저장소에는 값 없이 이름만 적은 <code>.env.example</code> 을 올려 두면 다른 사람이 무엇이 필요한지 알아요.</p>`, example: { shell: 'cd ~ && mkdir -p github-study && cd github-study && rm -rf g16 && mkdir g16 && cd g16\ngit init -q -b main\necho "API_KEY=abc123" > .env && echo "print(1)" > app.py\ngit status --short\necho ".env" > .gitignore\ngit status --short\ngit check-ignore -v .env', label: '예제 명령 — .gitignore 전후로 git status 가 어떻게 바뀌나' } },
    { title: 'Actions 의 비밀값: secrets', html: `<p>워크플로가 비밀(배포 토큰 등)을 써야 하면 파일에 쓰지 않고 <b>저장소 설정에 숨겨 두고 이름으로 불러요</b>.</p>
<div class="bk-step-box"><b>① 넣기</b><br>저장소 <b>Settings</b> → 왼쪽 「Security」(화면에 따라 「Security and quality」) 묶음의 <b>Secrets and variables</b> → <b>Actions</b> → <b>Secrets</b> 탭 → <b>New repository secret</b> → 「Name」 칸 <code>API_KEY</code> · 「Secret」 칸에 값 → <b>Add secret</b>. 넣은 뒤엔 나도 값을 다시 볼 수 없어요(바꾸기만).</div>
<div class="bk-step-box"><b>② 워크플로에서 쓰기</b><pre>      - run: python app.py
        env:
          API_KEY: \${{ secrets.API_KEY }}</pre>코드에서는 <code>os.environ["API_KEY"]</code>. 실행 로그에 그 값이 찍히면 GitHub 이 <code>***</code> 로 가려요.</div>
<ul><li>fork 에서 온 PR 의 워크플로에는 secrets 가 안 넘어가요(남이 훔쳐 가지 못하게).</li><li><code>GITHUB_TOKEN</code> 은 GitHub 이 실행마다 자동으로 주는 임시 열쇠라 따로 안 넣어도 돼요.</li></ul>` + GH_DATE },
    { title: '실수로 올렸으면: 지우기보다 폐기가 먼저', html: `<div class="bk-step-box"><b>Push protection — GitHub 이 먼저 막아 줘요</b><br>공개 저장소에 토큰처럼 생긴 글자(GitHub 토큰·클라우드 키 등)가 든 커밋을 push 하면, 내 계정의 <b>Push protection</b>(기본으로 켜져 있음)이 push 를 거절하고 어느 커밋 · 어느 파일 · 몇째 줄인지 알려 줘요:<pre class="code">remote:    locations:
remote:      - commit: 8728dbe67
remote:        path: README.md:4</pre>→ 그 줄을 지우고, 마지막 커밋이면 <code>git add 파일</code> → <code>git commit --amend --no-edit</code>(터미널·Git 교과서 레슨 15 ①) → 다시 push.</div>
<div class="bk-warn"><b>이미 올라갔으면 순서가 중요해요</b><ol><li><b>그 비밀을 폐기(revoke)</b> — 키를 준 곳에서 지우고 새로 발급. GitHub 토큰이면 내 사진 → Settings → <b>Developer settings</b> → <b>Personal access tokens</b> 에서 삭제. 공개된 순간 이미 누가 복사했을 수 있어서, 기록을 지우는 것보다 이게 먼저예요.</li><li>새 비밀은 <code>.env</code> · secrets 에 넣어요.</li><li>기록에서 지우기는 그다음 — push 전이면 터미널·Git 교과서 레슨 15 ⑤, push 뒤에는 기록 다시 쓰기라 어려워요. 그래서 1 번이 핵심이에요.</li></ol></div>
<p class="muted small">저장소 Settings → 「Security」 의 <b>Advanced Security</b>(또는 Code security) 화면에서 <b>Dependabot alerts</b> 를 켜면, 내가 쓰는 패키지에 알려진 보안 문제가 생겼을 때 알려 줘요.</p>` + GH_DATE },
  ],
  summary: ['.env 에 비밀 + .gitignore, git check-ignore -v .env', 'Settings → Secrets and variables → Actions → New repository secret → ${{ secrets.X }}', 'Push protection 이 막아 줌 · 올렸으면 폐기 먼저'] },
{ id: 'GB4', ch: 4, boss: true, title: '보스: 이 사이트처럼 운영하기', mode: 'text', pages: [], summary: [], tutorSummary: '보호 규칙 + 테스트 워크플로 + PR → 초록 체크 → squash → Pages 자동 배포. 이 사이트의 ci.yml·pages.yml 읽기.' },
{ id: 'G17', ch: 5, n: 17, title: '터미널에서 GitHub: gh', mode: 'text', tutorSummary: 'winget install --id GitHub.cli, gh auth login(GitHub.com · HTTPS · Login with a web browser), gh repo create 이름 --public --source=. --push, gh pr create --fill, gh pr checks, gh pr merge --squash --delete-branch, gh issue create.',
  pages: [
    { title: 'gh 설치와 로그인', html: `<p><b>gh</b>(GitHub CLI)는 GitHub 화면에서 하던 일을 Git Bash 명령으로 하는 공식 도구예요. 챕터 2~4 를 손에 익힌 뒤에 쓰면 빨라져요 — 화면을 먼저 알아야 명령이 무슨 뜻인지 보여요.</p>
<div class="bk-step-box"><b>① 설치</b><br>Windows 의 명령 프롬프트나 PowerShell 에서 <code>winget install --id GitHub.cli</code>(또는 <a href="https://cli.github.com/" target="_blank" rel="noopener">cli.github.com</a> 에서 설치 파일). <b>Git Bash 를 껐다 다시 열고</b> <code>gh --version</code>.</div>
<div class="bk-step-box"><b>② 로그인</b><pre>gh auth login</pre>질문에 화살표 키 + Enter 로: <b>GitHub.com</b> → 방식 <b>HTTPS</b> → Git 도 이 계정으로 로그인할지 <b>Yes</b> → <b>Login with a web browser</b> → 화면에 나온 8자리 코드를 복사하고 Enter → 브라우저에 코드 붙여 넣기 → <b>Authorize</b>. <code>gh auth status</code> 로 확인.</div>` },
    { title: '자주 쓰는 gh 명령', html: `<table class="kb"><tbody><tr><td><code>gh repo create todo-cli --public --source=. --push</code></td><td>지금 폴더로 새 공개 저장소 만들고 올리기(레슨 2 를 한 줄로)</td></tr><tr><td><code>gh repo clone 아이디/저장소</code></td><td>clone</td></tr><tr><td><code>gh pr create --fill</code></td><td>지금 브랜치로 PR — 제목·설명을 커밋 메시지로 채움(레슨 5)</td></tr><tr><td><code>gh pr list</code> · <code>gh pr view 3 --web</code></td><td>PR 목록 · 3번 PR 을 브라우저로</td></tr><tr><td><code>gh pr checks</code></td><td>지금 브랜치 PR 의 자동 검사 결과(레슨 15)</td></tr><tr><td><code>gh pr merge --squash --delete-branch</code></td><td>squash 로 합치고 브랜치 지우기(레슨 7)</td></tr><tr><td><code>gh issue create</code> · <code>gh issue list</code></td><td>이슈 만들기 · 목록(레슨 9)</td></tr><tr><td><code>gh release create v1.0.0 --generate-notes</code></td><td>릴리스(레슨 13)</td></tr></tbody></table>
<p>이 사이트는 이 명령들과 같은 일을 하는 GitHub API 로 PR 을 만들고 검사를 기다렸다 합쳐요. 화면 · 명령 · API 모두 같은 일을 하는 다른 손잡이예요.</p>`, example: { shell: 'gh auth status\ngit switch -c readme-gh\necho "gh 로 만든 PR" >> README.md\ngit commit -am "README: gh 연습"\ngit push -u origin readme-gh\ngh pr create --fill\ngh pr checks\ngh pr merge --squash --delete-branch', label: '예제 명령 — 연습 저장소를 받아 둔 ~/github-study/repo 에서(진짜 GitHub 에 PR 이 생겨요)' } },
  ],
  summary: ['winget install --id GitHub.cli → gh auth login', 'gh pr create --fill · gh pr checks · gh pr merge --squash --delete-branch', 'gh repo create · gh issue create · gh release create'] },
];
const PROBLEMS = []; // v2.19.0 N13: 이 코스의 옛 문제는 archive/classic/courses/github/content.js // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
