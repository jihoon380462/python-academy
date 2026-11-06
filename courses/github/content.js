// courses/github/content.js — 「GitHub 교과서」 (v2.16.0, 사용자 「T8 GitHub 가장 중요」 11/3 · 「1」 = 설계대로 만들기 11/6). 설계: specs/github-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 사용자의 진짜 GitHub 계정(github.com) + Git Bash + VS Code.
// 화면 이름은 docs.github.com 원문(github/docs 저장소, 2026-11)으로 확인한 영어 글자 그대로 + 괄호 안 한국어 뜻. GitHub 화면이 바뀌면 여기를 고치고 QA 문서에 적어요.
// 레슨 쪽 example.shell = Git Bash 에 칠 명령. 「만들어 보기」·시작하기·도감 도구 상자는 book.js. 검사: node tools/check_book.mjs github
const COURSE = { id: 'github', name: 'GitHub', runner: 'none', bench: false,
  tutorPersona: '너는 GitHub 을 처음 쓰는 성인에게 진짜 계정으로 저장소·PR·Actions 를 가르치는 선생님이다. 화면은 「어느 화면 → 어느 칸 → 무슨 글자」 로 말한다.' };
const CHECKUPS = { after: {}, upto: {} };
const WEAKNESS_TAGS = ['계정', '저장소', 'PR', '리뷰', 'Actions', '공개'];
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
<p>이 사이트(파이썬 아카데미)도 이렇게 운영돼요: 브랜치 → Pull Request → 자동 검사 초록 체크 → 합치기 → 사이트 자동 배포. 마지막 보스에서 내 저장소를 똑같이 만들어요.</p>` },
    { title: '저장소 화면 둘러보기: Code · Issues · Pull requests · Actions · Settings', html: `<p>아무 저장소나 열면(예: 내 저장소 <code>https://github.com/내아이디/저장소이름</code>) 이름 아래에 <b>탭</b>이 한 줄 있어요.</p>
<table class="kb"><tbody><tr><td><b>Code</b></td><td>파일 목록과 README. 초록 <b>Code</b> 단추를 누르면 clone 주소(HTTPS · SSH)</td></tr><tr><td><b>Issues</b></td><td>할 일·버그 글 목록</td></tr><tr><td><b>Pull requests</b></td><td>합쳐 달라는 요청 목록</td></tr><tr><td><b>Actions</b></td><td>자동 실행(워크플로) 기록 — 초록 ✓ · 빨간 ✗</td></tr><tr><td><b>Settings</b></td><td>저장소 설정(이름 바꾸기·Pages·보호 규칙·비밀값). 내 저장소에서만 보여요. 창이 좁으면 <b>⋯</b> 메뉴 안에 있어요</td></tr></tbody></table>
<p>Code 탭 오른쪽 위에는 <b>⭐ Star</b>(즐겨찾기) · <b>Fork</b>(내 계정으로 복사, 챕터 3) · <b>Watch</b>(알림 받기)가 있어요. 왼쪽 위 브랜치 단추(<code>main ▾</code>)로 다른 브랜치의 파일을 볼 수 있어요.</p>
<p>내 프로필은 <code>https://github.com/내아이디</code> — 오른쪽 위 내 사진을 누르면 <b>Your profile</b> · <b>Your repositories</b> · <b>Settings</b>(계정 설정) 메뉴가 나와요. <b>저장소 Settings 와 계정 Settings 는 다른 곳</b>이에요. 이 교과서는 늘 어느 쪽인지 적어 둘게요.</p>` + GH_DATE },
    { title: '이 교과서 쓰는 법: 계정 하나로 두 역할', html: `<p>연습은 전부 <b>내 진짜 GitHub 계정</b>으로 해요. 사이트 안 가짜 화면은 없어요 — 실제 화면을 보며 익혀야 나중에 바로 쓸 수 있어요.</p>
<div class="bk-step-box"><b>계정은 하나만</b><br>GitHub 이용약관에는 「한 사람은 무료 개인 계정을 하나만」 이라는 규칙이 있어요. 그래서 친구 역할을 할 두 번째 계정을 만들지 않고, <b>나 혼자 작성자와 리뷰어를 번갈아</b> 해요. 단 <b>내가 연 Pull Request 는 내가 승인(Approve)할 수 없어요</b> — 리뷰는 코멘트·제안으로 연습하고, 승인이 필요한 규칙은 0명으로 둬요(챕터 4).</div>
<div class="bk-step-box"><b>화면 이름</b><br>GitHub 은 한국어 화면이 없어요. 이 교과서는 <b>영어 글자 그대로</b> 적고 괄호에 뜻을 달아요: <b>Settings</b>(설정) → <b>Emails</b>(이메일) → ☑ <b>Keep my email addresses private</b>(내 이메일 비공개).</div>
<div class="bk-step-box"><b>내 컴퓨터 쪽</b><br>명령은 Git Bash 에서 쳐요(터미널·Git 교과서와 같음). 예제 명령은 연습 폴더 <code>~/github-study</code> 에서 해요.</div>
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
<div class="bk-step-box"><b>② 공개 열쇠 복사</b><pre>clip &lt; ~/.ssh/id_ed25519.pub</pre>클립보드에 <code>ssh-ed25519 AAAA… 주소</code> 한 줄이 복사돼요. <b>끝이 <code>.pub</code> 인 쪽만</b> — <code>.pub</code> 없는 파일은 비밀 열쇠라 절대 남에게 주지 않아요.</div>
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
<div class="bk-step-box"><b>① 열기</b><br>Code 탭에서 파일(예: <code>README.md</code>)을 누르고, 파일 내용 위 오른쪽의 <b>연필 단추</b>(Edit file).</div>
<div class="bk-step-box"><b>② 고치고 미리 보기</b><br>고친 뒤 위쪽 <b>Preview</b> 탭으로 어떻게 보일지 확인(Markdown 은 레슨 4).</div>
<div class="bk-step-box"><b>③ 커밋</b><br>오른쪽 위 초록 <b>Commit changes…</b> → 창이 떠요. 「Commit message」 칸에 무엇을 바꿨는지(<code>README 오타 고침</code>) → 아래 두 동그라미 중 하나:
<ul><li><b>Commit directly to the <code>main</code> branch</b> — main 에 바로</li><li><b>Create a new branch for this commit and start a pull request</b> — 새 브랜치로 → PR(챕터 2). 혼자 하는 연습 저장소는 첫째도 괜찮아요</li></ul>
→ <b>Commit changes</b>.</div>
<p class="muted small">연필 옆 ▾(More edit options)를 누르면 <b>github.dev</b>(3쪽)로도 열 수 있어요.</p>` + GH_DATE },
    { title: 'History · 커밋 하나 보기 · Blame', html: `<p>GitHub 은 <code>git log</code> 를 화면으로 보여 줘요.</p>
<table class="kb"><tbody><tr><td>저장소 첫 화면의 <b>🕘 커밋 수</b>(예: 「12 Commits」)</td><td>저장소 전체 기록 = <code>git log</code></td></tr><tr><td>파일을 연 화면 위 <b>History</b></td><td>그 파일만의 기록 = <code>git log -- 파일</code></td></tr><tr><td>기록에서 커밋 하나 누르기</td><td>그 커밋이 바꾼 줄: 빨강 = 지운 줄, 초록 = 넣은 줄 = <code>git show</code></td></tr><tr><td>파일 화면 위 <b>Blame</b></td><td>줄마다 「누가 언제 어느 커밋에서 이 줄을 썼나」 — 이상한 줄이 언제 들어왔는지 찾을 때</td></tr></tbody></table>
<p>커밋 화면의 주소(<code>…/commit/a1b2c3d…</code>)는 그 변경을 가리키는 고정 주소예요. 이슈나 PR 에 붙여 「이 커밋에서 깨졌어요」 라고 쓸 수 있어요.</p>` + GH_DATE },
    { title: 'github.dev: . 키로 VS Code 처럼', html: `<p>저장소 화면에서 키보드 <kbd>.</kbd>(마침표)를 누르면 <b>github.dev</b> 가 열려요 — 브라우저 안의 VS Code 예요. 설치 없이 여러 파일을 한꺼번에 고칠 때 좋아요(<kbd>&gt;</kbd> 를 누르면 새 탭으로).</p>
<ul><li>왼쪽 탐색기에서 파일을 열어 고쳐요. 고친 파일 옆에 <b>M</b> 이 붙어요.</li><li>왼쪽 세로 줄의 <b>Source Control</b>(가지 모양) → 메시지 칸에 커밋 메시지 → <b>Commit &amp; Push</b>.</li><li>코드를 <b>실행</b>하지는 못해요(터미널이 없어요). 실행은 내 컴퓨터 VS Code 에서.</li></ul>
<p>원래 화면으로 돌아가려면 왼쪽 위 ☰ 메뉴 → <b>Go to Repository</b>, 또는 주소의 <code>github.dev</code> 를 <code>github.com</code> 으로.</p>` + GH_DATE },
    { title: '웹에서 고친 뒤 내 컴퓨터는 git pull 먼저', html: `<p>웹에서 커밋을 하나 하면 <b>GitHub 쪽이 한 칸 앞서요</b>. 내 컴퓨터는 그걸 몰라요. 그 상태로 내 컴퓨터에서 커밋하고 push 하면 거절돼요:</p>
<pre class="code">! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'https://github.com/…'</pre>
<p>해결은 늘 같아요: <b>먼저 받아서 합치고(pull), 다시 push</b>.</p>
<pre>git pull --no-edit
git push</pre>
<p>습관으로 만들면 거절을 거의 안 만나요: <b>작업 시작 전에 <code>git pull</code></b>. 웹에서 고친 날은 꼭.</p>
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
<p>남의 README 를 많이 보는 게 제일 빨리 늘어요. GitHub 첫 화면 위 검색에서 관심 있는 주제를 찾아 별(⭐)이 많은 저장소의 README 를 읽어 보세요.</p>`, example: { code: '# todo-cli\n\n터미널에서 쓰는 할 일 관리 프로그램 — 파이썬 교과서 보스 B5 로 만들었어요.\n\n## 화면\n\n```text\n> add 우유 사기\n추가: 우유 사기\n> list\n1. [ ] 우유 사기\n```\n\n## 준비물\n\n- Python 3.12 이상\n\n## 실행\n\n```bash\ngit clone https://github.com/내아이디/todo-cli.git\ncd todo-cli\npython todo.py\n```\n\n## 라이선스\n\nMIT License', label: '예제 — README 틀(내 프로젝트 이름으로 바꿔서)' } },
  ],
  summary: ['# 제목 · - 목록 · **굵게** · [링크](주소)', '```python 코드 블록 · | 표 | · - [ ] 체크박스', '좋은 README: 무엇 → 화면 → 준비물 → 실행 → 사용법 → 라이선스'] },
{ id: 'GB1', ch: 1, boss: true, title: '보스: 내 파이썬 프로젝트 공개', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 1 종합. 파이썬 교과서에서 만든 프로그램 하나를 README·.gitignore·LICENSE 갖춘 공개 저장소로. 의미 있는 커밋 3개, noreply 이메일.' },
// ================= 챕터 2 Pull Request 로 협업 (다음 업데이트) =================
{ id: 'G5', ch: 2, n: 5, title: '브랜치에서 Pull Request 열기', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'switch -c → push → Compare & pull request → base ← compare, 제목·설명, Draft.' },
{ id: 'G6', ch: 2, n: 6, title: '코드 리뷰: 줄 코멘트와 Suggestion', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'Files changed, 줄 코멘트, suggestion 블록 → Commit suggestion, Review changes(Comment/Approve/Request changes), 내 PR 은 Approve 불가.' },
{ id: 'G7', ch: 2, n: 7, title: '병합 세 가지와 뒷정리', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'merge commit / squash / rebase, Delete branch, 로컬 pull · branch -d · fetch --prune.' },
{ id: 'G8', ch: 2, n: 8, title: 'PR 에 충돌이 나면', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'This branch has conflicts → Resolve conflicts 편집기, 또는 로컬에서 main 병합 후 push.' },
{ id: 'G9', ch: 2, n: 9, title: 'Issues 로 할 일 관리', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '이슈 쓰기, Labels·Assignees·Milestone, Closes #3, 이슈 템플릿.' },
{ id: 'G10', ch: 2, n: 10, title: 'Projects 보드', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'Projects → Board, Todo/In Progress/Done, 이슈·PR 카드.' },
{ id: 'GB2', ch: 2, boss: true, title: '보스: 혼자 하는 협업 한 바퀴', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '이슈 → 브랜치 → PR → 리뷰 → 충돌 → squash → 이슈 자동 닫힘.' },
// ================= 챕터 3 세상에 내놓기 (다음 업데이트) =================
{ id: 'G11', ch: 3, n: 11, title: 'fork 와 오픈소스 첫 기여', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'fork, upstream, Sync fork, CONTRIBUTING, 첫 기여 PR.' },
{ id: 'G12', ch: 3, n: 12, title: 'GitHub Pages 두 가지 방법', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'Deploy from a branch(웹 W13) vs GitHub Actions, 주소 규칙, 404.' },
{ id: 'G13', ch: 3, n: 13, title: '태그와 Releases', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'git tag v1.0.0, push 태그, Draft a new release, Generate release notes.' },
{ id: 'GB3', ch: 3, boss: true, title: '보스: 포트폴리오 공개', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '저장소 2개 README, Pages, v1.0.0, 프로필 README.' },
// ================= 챕터 4 자동화와 안전 (다음 업데이트) =================
{ id: 'G14', ch: 4, n: 14, title: 'GitHub Actions 첫 워크플로', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '.github/workflows/test.yml, on, jobs, runs-on, checkout, setup-python, pytest, Actions 탭 로그.' },
{ id: 'G15', ch: 4, n: 15, title: 'PR 에 초록 체크 + 보호 규칙', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'Checks, Rulesets: Require a pull request before merging, Require status checks to pass before merging, Block force pushes.' },
{ id: 'G16', ch: 4, n: 16, title: '비밀 지키기', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '.gitignore .env, Secrets and variables → Actions, secrets.X, Push protection, 토큰 폐기 먼저.' },
{ id: 'GB4', ch: 4, boss: true, title: '보스: 이 사이트처럼 운영하기', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '보호 규칙 + verify 워크플로 + PR → 초록 체크 → squash → Pages 자동 배포.' },
{ id: 'G17', ch: 5, n: 17, title: '터미널에서 GitHub: gh', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'gh auth login, gh repo create, gh pr create --fill, gh pr checks, gh pr merge --squash.' },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
const DRILLS = [];
const GUIDES = {};
