// courses/os/content.js — 「운영체제 교과서」 (v2.23.0, 사용자 공용 코스 「운영체제는 중요해서 따로 뺐다 — 운영체제 섹션에서 자세히」 11/6 · 「전부 추천대로」 11/7). 설계: specs/os-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 리눅스 교과서에서 만든 VirtualBox 의 Ubuntu 26.04 VM 안의 python3.
// 레슨 쪽 example.code = 파이썬(check_book 이 python3 로 실제 실행 — CI 도 리눅스라 os.fork·/proc 이 있음) · example.shell = 우분투 터미널에 칠 명령(안 돌림).
// 자식 프로세스는 os._exit 로 끝내서 출력 버퍼가 안 비워짐 → 자식의 print 와 fork 바로 앞의 print 에는 flush=True(K2 1쪽에서 가르침).
// 본문 <pre> 에는 「print(x)  # 값」 주석을 쓰지 않음(check_book ⑨ 가 그 코드를 실행하는데 fork 가 들어 있으면 검사기가 갈라짐).
const COURSE = { id: 'os', name: '운영체제', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 우분투 VM 에서 직접 일으켜 보며 운영체제를 가르치는 선생님이다. 원리를 말한 뒤 꼭 /proc·ps·작은 파이썬 코드로 눈에 보이게 한다.' };
const CHAPTERS = [
  { ch: 1, name: '프로세스', color: '#4f6bed' },
  { ch: 2, name: 'CPU 나눠 쓰기와 동기화', color: '#2ea043' },
  { ch: 3, name: '메모리', color: '#d97706' },
  { ch: 4, name: '시스템 콜과 파일 시스템', color: '#9c27b0' },
];
const OS_DATE = '<p class="muted small">이 쪽의 명령·결과는 Ubuntu 26.04 LTS 의 python3 기준(2026년 11월)이에요. PID 숫자는 할 때마다 달라요.</p>';
const LESSONS = [
// ================= 챕터 1 프로세스 =================
{ id: 'K0', ch: 1, n: 0, title: '운영체제가 하는 일', mode: 'text', tutorSummary: '운영체제(커널) = 프로그램들과 하드웨어 사이의 관리자: CPU·메모리를 나눠 주고, 파일을 저장하고, 장치를 다룸. 프로그램 = 디스크의 파일, 프로세스 = 실행 중인 것(PID). 프로그램은 하드웨어를 직접 못 만지고 커널에게 부탁(시스템 콜).',
  pages: [
    { title: '운영체제 = 프로그램과 하드웨어 사이의 관리자', html: `<p>컴퓨터에서는 프로그램 수십 개가 <b>CPU 몇 개 · 메모리 하나 · 디스크 하나</b>를 같이 써요. 누가 언제 CPU 를 쓸지, 메모리의 어느 칸을 누구에게 줄지, 파일을 디스크 어디에 둘지 정하는 관리자가 <b>운영체제</b>, 그 한가운데가 <b>커널</b>이에요. 리눅스 교과서에서 본 「리눅스 = 커널」 이 바로 이것이에요.</p>
<div class="bk-layers" role="img" aria-label="위에서부터 프로그램들 · 커널 · 하드웨어 세 겹"><div class="bk-layer v"><b>프로그램들 (python3 · bash · 파이어폭스 …)</b><span>내가 만들고 실행하는 것</span></div><div class="bk-layer g"><b>커널 (리눅스)</b><span>나눠 주고 지켜 주는 관리자</span></div><div class="bk-layer h"><b>하드웨어 (CPU · 메모리 · 디스크 · 장치)</b><span>실제 기계</span></div></div>
<p>커널이 하는 큰일은 넷이고, 이 교과서의 챕터도 이 순서예요.</p>
<table class="kb"><tbody><tr><td><b>프로세스 관리</b></td><td>프로그램을 실행하고 끝내고, 서로 쪽지(시그널)를 주고받게 해요 — 챕터 1</td></tr><tr><td><b>CPU 나눠 주기</b></td><td>CPU 하나를 여러 프로그램이 번갈아 쓰게 해요. 같이 쓰는 데이터가 꼬이지 않게 하는 법도 — 챕터 2</td></tr><tr><td><b>메모리 나눠 주기</b></td><td>프로그램마다 자기만의 메모리가 있는 것처럼 보이게 해요 — 챕터 3</td></tr><tr><td><b>파일과 장치</b></td><td>디스크에 파일을 저장하고, 키보드·화면 같은 장치를 다뤄요 — 챕터 4</td></tr></tbody></table>` + OS_DATE },
    { title: '프로그램 vs 프로세스: os.getpid()', html: `<p><b>프로그램</b>은 디스크에 있는 파일이에요. 예를 들어 <code>/usr/bin/python3</code>. <b>프로세스</b>는 그 프로그램이 <b>지금 실행 중인 것</b>이에요. 같은 프로그램을 두 번 실행하면 프로세스가 둘 생겨요.</p>
<p>커널은 프로세스마다 번호를 붙여요. 이게 <b>PID</b>(Process ID)예요. 파이썬에서는 <code>os.getpid()</code> 로 내 PID 를, <code>os.getppid()</code> 로 나를 실행한 <b>부모</b>의 PID 를 알 수 있어요.</p>
<pre class="code">import os
print("내 PID:", os.getpid())
print("나를 실행한 부모의 PID:", os.getppid())</pre>
<p>우분투 터미널에서 이 파일을 두 번 실행하면 <b>내 PID</b> 는 매번 다르고, <b>부모의 PID</b> 는 늘 같아요. 부모는 내가 명령을 친 그 터미널의 <b>bash</b> 예요(<code>echo $$</code> 가 bash 의 PID).</p>` + OS_DATE,
      example: { code: 'import os\nprint("내 PID:", os.getpid())\nprint("나를 실행한 부모의 PID:", os.getppid())' } },
    { title: '사용자 모드와 커널 모드 (맛보기)', html: `<p>내 프로그램은 하드웨어를 <b>직접 만지지 못해요</b>. 파일을 읽거나 화면에 글자를 쓰고 싶으면 커널에게 <b>부탁</b>해요. 이 부탁을 <b>시스템 콜</b>이라고 해요.</p>
<ul><li>내 코드가 도는 동안 CPU 는 <b>사용자 모드</b> — 할 수 있는 일이 제한돼요(남의 메모리 읽기, 디스크 직접 쓰기 같은 건 막혀 있어요).</li><li>시스템 콜을 부르면 CPU 가 <b>커널 모드</b>로 바뀌어 커널 코드가 대신 일하고, 끝나면 다시 사용자 모드로 돌아와요.</li><li><code>print("hi")</code> 한 줄 아래에도 <code>write</code> 라는 시스템 콜이 있어요. 챕터 4(레슨 14)에서 <code>strace</code> 로 직접 봐요.</li></ul>
<p>이렇게 나눠 두니까 프로그램 하나가 잘못돼도 다른 프로그램이나 커널은 멀쩡해요. 이 교과서에서 「망가뜨려 보는」 실험을 해도 우분투가 버티는 이유예요(그래도 실험 전에는 스냅샷).</p>` + OS_DATE },
  ],
  summary: ['커널 = 프로그램과 하드웨어 사이의 관리자(프로세스 · CPU · 메모리 · 파일)', '프로그램 = 디스크의 파일, 프로세스 = 실행 중인 것(PID) — os.getpid() · os.getppid()', '하드웨어 일은 시스템 콜로 커널에게 부탁(사용자 모드 → 커널 모드)'] },

{ id: 'K1', ch: 1, n: 1, title: '/proc 으로 프로세스 들여다보기', mode: 'text', tutorSummary: 'ps -o pid,ppid,stat,cmd 로 부모·자식, pstree -p 로 나무 모양. /proc/<PID>/status(Name·State·Pid·PPid·Threads·VmRSS), /proc/self = 지금 읽는 나. 상태 글자 R 실행 · S 잠 · D 기다림(못 깨움) · T 멈춤 · Z 좀비.',
  pages: [
    { title: 'ps -o pid,ppid,stat,cmd: 부모와 자식', html: `<p>리눅스 교과서 레슨 10 에서 <code>ps aux</code> 로 프로세스 목록을 봤어요. 이번엔 <b>누가 누구를 실행했나</b>를 봐요.</p>
<pre class="code">ps -o pid,ppid,stat,cmd
    PID    PPID STAT CMD
   2841    2833 Ss   bash
   3107    2841 R+   ps -o pid,ppid,stat,cmd</pre>
<ul><li><b>PID</b> 내 번호 · <b>PPID</b> 부모 번호 · <b>STAT</b> 상태(다음 쪽) · <b>CMD</b> 실행한 명령.</li><li><code>ps</code> 의 PPID(2841)가 <code>bash</code> 의 PID 예요. 터미널의 bash 가 <code>ps</code> 를 낳은 거예요.</li><li><code>pstree -p $$</code> 는 같은 관계를 나무 모양으로 그려요(<code>$$</code> = 지금 bash 의 PID). <code>pstree</code> 가 없으면 <code>sudo apt install psmisc</code>.</li></ul>
<p>모든 프로세스는 부모가 있어요. 끝까지 거슬러 올라가면 PID <b>1</b> 번 <b>systemd</b> 가 나와요 — 부팅 때 커널이 맨 처음 실행하는 프로세스예요.</p>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'echo $$\nps -o pid,ppid,stat,cmd\npstree -p $$\nps -o pid,cmd -p 1' } },
    { title: '/proc/<PID>/status: 커널이 보여 주는 프로세스 카드', html: `<p><code>/proc</code> 은 디스크에 있는 폴더가 아니라 <b>커널이 지금 상태를 파일처럼 보여 주는 창</b>이에요(리눅스 교과서 레슨 6 「모든 게 파일」). 프로세스마다 <code>/proc/PID번호/</code> 폴더가 있고, 그 안의 <code>status</code> 가 그 프로세스의 카드예요.</p>
<table class="kb"><tbody><tr><td><code>Name</code></td><td>프로그램 이름</td></tr><tr><td><code>State</code></td><td>상태(<code>R (running)</code> · <code>S (sleeping)</code> …)</td></tr><tr><td><code>Pid</code> · <code>PPid</code></td><td>내 번호 · 부모 번호</td></tr><tr><td><code>Threads</code></td><td>안에서 도는 일꾼(스레드) 수 — 챕터 2</td></tr><tr><td><code>VmRSS</code></td><td>지금 실제로 쓰는 메모리 — 챕터 3</td></tr></tbody></table>
<p><b><code>/proc/self</code></b> 는 「지금 이 파일을 읽고 있는 나」 예요. 파이썬이 <code>/proc/self/status</code> 를 열면 파이썬 자신의 카드가 나와요.</p>
<pre class="code">import os
with open("/proc/self/status") as f:
    for line in f:
        if line.split(":")[0] in ("Name", "State", "Pid", "PPid", "Threads"):
            print(line.strip())</pre>` + OS_DATE,
      example: { code: 'import os\nwith open("/proc/self/status") as f:\n    for line in f:\n        if line.split(":")[0] in ("Name", "State", "Pid", "PPid", "Threads"):\n            print(line.strip())\nprint("os.getpid() =", os.getpid())' } },
    { title: '상태 글자: R · S · D · T · Z', html: `<p><code>ps</code> 의 <b>STAT</b> 과 <code>status</code> 의 <b>State</b> 는 같은 글자예요.</p>
<table class="kb"><tbody><tr><td><b>R</b> running</td><td>지금 CPU 를 쓰고 있거나, 쓸 차례를 기다리는 중</td></tr><tr><td><b>S</b> sleeping</td><td>무언가를 기다리며 자는 중(입력 · 시간 · 네트워크). 대부분의 프로세스는 늘 S 예요</td></tr><tr><td><b>D</b> disk sleep</td><td>디스크 같은 장치를 기다리는 중 — 이때는 시그널로도 못 깨워요(잠깐이면 정상)</td></tr><tr><td><b>T</b> stopped</td><td>멈춰 세워 둔 것(Ctrl+Z). <code>fg</code> 로 다시 움직여요</td></tr><tr><td><b>Z</b> zombie</td><td>끝났는데 부모가 아직 결과를 안 가져간 것 — 레슨 2</td></tr></tbody></table>
<p>뒤에 붙는 글자도 있어요: <code>s</code> 는 세션의 대장(로그인한 bash 등), <code>+</code> 는 지금 터미널 앞에 있는 것, <code>l</code> 은 스레드가 여럿.</p>
<p>직접 보기: <code>sleep 100 &amp;</code> 로 뒤에서 자게 두고 <code>ps -o pid,stat,cmd</code> → <b>S</b>. <code>fg</code> 로 앞으로 가져와 <kbd>Ctrl</kbd>+<kbd>Z</kbd> → 다시 <code>ps</code> → <b>T</b>. 끝으로 <code>kill %1</code>.</p>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'sleep 100 &\nps -o pid,stat,cmd\nkill %1' } },
  ],
  summary: ['ps -o pid,ppid,stat,cmd · pstree -p $$ — 부모(PPID)와 자식', '/proc/PID/status: Name · State · Pid · PPid · Threads · VmRSS, /proc/self = 나', '상태 R 실행 · S 잠 · D 장치 기다림 · T 멈춤 · Z 좀비'] },

{ id: 'K2', ch: 1, n: 2, title: 'fork: 나를 둘로', mode: 'text', tutorSummary: 'os.fork() 는 한 번 불러 두 번 돌아옴(부모는 자식 PID, 자식은 0). 자식은 부모의 복사본 — 변수를 바꿔도 부모는 그대로. 자식은 os._exit(코드) 로 끝내고, 부모는 os.waitpid(pid, 0) 로 기다려 os.waitstatus_to_exitcode 로 종료 코드를 꺼냄. 안 기다리면 좀비(Z). 파이프로 출력할 때는 버퍼 때문에 print(..., flush=True).',
  pages: [
    { title: 'os.fork(): 한 번 불러 두 번 돌아와요', html: `<p><code>os.fork()</code> 를 부르면 커널이 지금 프로세스를 <b>통째로 복사</b>해 자식을 하나 만들어요. 그래서 <code>fork()</code> 는 <b>두 프로세스에서 각각 한 번씩</b>, 모두 두 번 돌아와요.</p>
<ul><li><b>부모</b>에게는 자식의 PID(양수)를 돌려줘요.</li><li><b>자식</b>에게는 <code>0</code> 을 돌려줘요. 그래서 <code>if pid == 0:</code> 으로 「나는 자식인가」 를 가려요.</li></ul>
<pre class="code">import os
pid = os.fork()
if pid == 0:
    print("자식: 내 PID", os.getpid(), "· 부모", os.getppid(), flush=True)
    os._exit(0)
os.waitpid(pid, 0)
print("부모: 자식", pid, "이 끝났어요")</pre>
<p>자식은 할 일을 마치면 <code>os._exit(0)</code> 으로 바로 끝내요. 이걸 안 쓰면 자식이 <code>if</code> 아래로 계속 내려가 <b>부모가 할 일까지 해 버려요</b>. 부모는 <code>os.waitpid(pid, 0)</code> 으로 자식이 끝날 때까지 기다려요(다음 쪽).</p>
<div class="bk-step-box"><b>print 에 flush=True 를 붙이는 이유</b><br>출력이 터미널이 아니라 파일·파이프로 갈 때 <code>print</code> 는 글자를 <b>모아 두었다가</b> 한 번에 써요(버퍼). <code>os._exit</code> 는 이 모아 둔 걸 쓰지 않고 바로 끝나서 자식의 글이 사라질 수 있어요. 또 <code>fork</code> 는 모아 둔 글까지 복사해서 같은 줄이 두 번 나올 수도 있어요. 그래서 <b>자식의 print</b> 와 <b>fork 바로 앞의 print</b> 에는 <code>flush=True</code>(「지금 바로 써」)를 붙여요.</div>` + OS_DATE,
      example: { code: 'import os\npid = os.fork()\nif pid == 0:\n    print("자식: 내 PID", os.getpid(), "· 부모", os.getppid(), flush=True)\n    os._exit(0)\nos.waitpid(pid, 0)\nprint("부모: 자식", pid, "이 끝났어요")' } },
    { title: '자식은 복사본: 바꿔도 부모는 그대로', html: `<p>자식은 부모의 변수까지 <b>복사</b>해서 가져가요. 복사본이라서 자식이 값을 바꿔도 부모의 값은 그대로예요.</p>
<pre class="code">import os
money = 100
pid = os.fork()
if pid == 0:
    money -= 30
    print("자식의 money:", money, flush=True)
    os._exit(0)
os.waitpid(pid, 0)
print("부모의 money:", money)</pre>
<p>실행하면 <code>자식의 money: 70</code> 다음에 <code>부모의 money: 100</code> 이 나와요. 두 프로세스는 메모리가 <b>따로따로</b>예요. 커널이 프로세스마다 자기만의 메모리를 주기 때문이에요(챕터 3 「가상 메모리」). 그래서 자식이 부모에게 결과를 알려 주려면 따로 길이 필요해요. 가장 간단한 길이 다음 쪽의 <b>종료 코드</b>, 더 많은 걸 주고받는 길은 레슨 5 의 <b>파이프</b>예요.</p>` + OS_DATE,
      example: { code: 'import os\nmoney = 100\npid = os.fork()\nif pid == 0:\n    money -= 30\n    print("자식의 money:", money, flush=True)\n    os._exit(0)\nos.waitpid(pid, 0)\nprint("부모의 money:", money)' } },
    { title: 'os.waitpid · 종료 코드 · 좀비와 고아', html: `<p>자식은 끝날 때 <b>종료 코드</b>(0~255 의 숫자)를 남겨요. 0 은 「잘 끝남」, 그 밖은 「무언가 잘못됨」 이 약속이에요(bash 의 <code>echo $?</code> 가 이 숫자).</p>
<ul><li>자식: <code>os._exit(3)</code> — 3 을 남기고 끝.</li><li>부모: <code>_, status = os.waitpid(pid, 0)</code> — 그 자식이 끝날 때까지 기다렸다가 상태를 받아요. 상태에서 종료 코드를 꺼내는 건 <code>os.waitstatus_to_exitcode(status)</code>.</li><li><code>os.wait()</code> 는 「아무 자식이나 하나 끝날 때까지」 기다려요(자식 PID 와 상태를 돌려줘요).</li></ul>
<pre class="code">import os
pid = os.fork()
if pid == 0:
    print("자식: 3 을 남기고 끝낼게요", flush=True)
    os._exit(3)
_, status = os.waitpid(pid, 0)
print("자식의 종료 코드:", os.waitstatus_to_exitcode(status))</pre>
<p>실행하면 마지막 줄이 <code>자식의 종료 코드: 3</code> 이에요.</p>
<table class="kb"><tbody><tr><td><b>좀비</b>(Z)</td><td>자식은 끝났는데 부모가 아직 <code>wait</code> 를 안 한 것. 커널은 종료 코드를 부모에게 줄 때까지 카드(PID)를 남겨 둬요. <code>ps</code> 에 <code>&lt;defunct&gt;</code> 로 보여요. 부모가 <code>wait</code> 하거나 부모가 끝나면 사라져요</td></tr><tr><td><b>고아</b></td><td>부모가 먼저 끝난 자식. 커널이 「거두는 프로세스」(보통 1번 systemd, 데스크톱에서는 로그인한 사용자의 systemd 일 수도)를 새 부모로 붙여 줘서, 끝나면 그쪽이 <code>wait</code> 해 줘요</td></tr></tbody></table>` + OS_DATE,
      example: { code: 'import os\npid = os.fork()\nif pid == 0:\n    print("자식: 3 을 남기고 끝낼게요", flush=True)\n    os._exit(3)\n_, status = os.waitpid(pid, 0)\nprint("자식의 종료 코드:", os.waitstatus_to_exitcode(status))' } },
  ],
  summary: ['pid = os.fork() — 부모는 자식 PID, 자식은 0 이 돌아옴', '자식은 복사본(메모리 따로) · 할 일 끝나면 os._exit(코드) · print 에 flush=True', '_, status = os.waitpid(pid, 0) → os.waitstatus_to_exitcode(status) · 안 기다리면 좀비(Z)'] },

{ id: 'K3', ch: 1, n: 3, title: 'exec: 다른 프로그램으로 바꿔 타기', mode: 'text', tutorSummary: 'os.execvp(이름, [이름, 인자…]) 는 지금 프로세스를 다른 프로그램으로 바꿈(PID 그대로, 아래 줄은 실행 안 됨). 없는 프로그램이면 FileNotFoundError → 자식은 os._exit(127). 셸 = fork + exec + wait. cd 는 셸이 직접(os.chdir — 자식의 폴더만 바뀌니까). subprocess.run 이 이걸 대신 해 줌.',
  pages: [
    { title: 'os.execvp: 지금 프로세스가 다른 프로그램이 돼요', html: `<p><code>fork</code> 는 나를 복사할 뿐이에요. 다른 프로그램을 실행하려면 <b>exec</b> 를 써요. <code>os.execvp("echo", ["echo", "안녕"])</code> 은 <b>지금 이 프로세스의 내용을 <code>echo</code> 프로그램으로 통째로 갈아 끼워요</b>.</p>
<pre class="code">import os
print("바뀌기 전 PID:", os.getpid(), flush=True)
os.execvp("sh", ["sh", "-c", "echo 바뀐 뒤 PID: $$"])
print("이 줄은 실행되지 않아요")</pre>
<ul><li><b>PID 는 그대로</b>예요. 같은 프로세스가 다른 프로그램이 된 거라서요.</li><li>exec 가 성공하면 <b>아래 줄은 영영 실행되지 않아요</b>. 파이썬 코드가 사라지고 그 자리에 <code>sh</code> 가 들어앉았으니까요.</li><li>두 번째 칸은 <b>프로그램이 받을 목록</b>이고, 첫 칸은 관례대로 프로그램 이름이에요(<code>["ls", "-l", "/tmp"]</code>). <code>p</code> 는 「PATH 에서 찾기」 — <code>ls</code> 만 써도 <code>/usr/bin/ls</code> 를 찾아요.</li><li>그런 프로그램이 없으면 <code>FileNotFoundError</code> 가 나요. 자식이라면 <code>except FileNotFoundError:</code> 에서 알리고 <code>os._exit(127)</code> 로 끝내요(127 = bash 가 「명령 없음」 에 쓰는 번호).</li></ul>` + OS_DATE,
      example: { code: 'import os\nprint("바뀌기 전 PID:", os.getpid(), flush=True)\nos.execvp("sh", ["sh", "-c", "echo 바뀐 뒤 PID: $$"])\nprint("이 줄은 실행되지 않아요")' } },
    { title: 'fork + exec + wait = 셸이 명령을 실행하는 법', html: `<p>터미널에서 <code>ls</code> 를 치면 bash 는 이렇게 해요.</p>
<ol><li><b>fork</b> — bash 가 자기를 복사해 자식을 만들어요.</li><li><b>exec</b> — 자식이 <code>ls</code> 로 갈아타요. (bash 자신은 그대로 남아야 다음 명령을 받으니까, 직접 exec 하지 않고 자식이 해요.)</li><li><b>wait</b> — bash 는 자식이 끝날 때까지 기다렸다가 종료 코드를 <code>$?</code> 에 넣고 다음 프롬프트를 보여 줘요.</li></ol>
<pre class="code">import os
def run(cmd):
    pid = os.fork()
    if pid == 0:
        os.execvp(cmd[0], cmd)
    _, status = os.waitpid(pid, 0)
    return os.waitstatus_to_exitcode(status)
print("date 의 종료 코드:", run(["date", "+%Y"]), flush=True)
print("ls 의 종료 코드:", run(["ls", "/없는폴더"]))</pre>
<p>실행하면 연도 다음에 <code>date 의 종료 코드: 0</code>, <code>ls</code> 의 에러 글 다음에 <code>ls 의 종료 코드: 2</code> 가 나와요.</p>
<p><b>그런데 <code>cd</code> 는 이렇게 못 해요.</b> 자식이 <code>cd</code> 로 폴더를 바꿔도 바뀌는 건 <b>자식의 폴더</b>뿐이고, 자식은 곧 끝나요(레슨 2 「자식은 복사본」). 그래서 셸은 <code>cd</code> 를 자식에게 시키지 않고 <b>자기가 직접</b> 해요 — 파이썬으로는 <code>os.chdir(경로)</code>. <code>exit</code> 도 셸 자신이 끝나는 거라 직접 해요. 이런 걸 <b>내장 명령</b>이라고 해요(<code>type cd</code> → <code>cd is a shell builtin</code>).</p>` + OS_DATE,
      example: { code: 'import os\ndef run(cmd):\n    pid = os.fork()\n    if pid == 0:\n        os.execvp(cmd[0], cmd)\n    _, status = os.waitpid(pid, 0)\n    return os.waitstatus_to_exitcode(status)\nprint("date 의 종료 코드:", run(["date", "+%Y"]), flush=True)\nprint("ls 의 종료 코드:", run(["ls", "/없는폴더"]))' } },
    { title: 'subprocess.run: 평소엔 이걸로', html: `<p>보통의 파이썬 프로그램에서 다른 프로그램을 실행할 때는 <code>subprocess.run</code> 을 써요. 안에서 하는 일은 이 레슨에서 손으로 한 <b>fork + exec + wait</b> 와 같아요(파이썬이 Windows 에서도 되게 감싸 둔 것).</p>
<pre class="code">import subprocess
r = subprocess.run(["echo", "subprocess 가 대신 해 줘요"], capture_output=True, text=True)
print("출력:", r.stdout.strip())
print("종료 코드:", r.returncode)</pre>
<table class="kb"><tbody><tr><td><code>capture_output=True</code></td><td>자식의 출력을 화면 대신 <code>r.stdout</code> · <code>r.stderr</code> 로 받기(레슨 5 의 파이프로 만들어요)</td></tr><tr><td><code>text=True</code></td><td>바이트 대신 글자(str)로</td></tr><tr><td><code>r.returncode</code></td><td>종료 코드(<code>waitpid</code> 로 받은 그것)</td></tr><tr><td><code>shell=True</code></td><td>명령 한 줄을 <code>sh -c</code> 에 맡기기 — 남이 준 글자를 넣으면 위험해서 되도록 목록으로</td></tr></tbody></table>
<p>이 교과서는 원리를 보려고 <code>os.fork</code> · <code>os.execvp</code> 를 직접 쓰지만, 평소에는 <code>subprocess.run</code> 을 쓰면 돼요.</p>` + OS_DATE,
      example: { code: 'import subprocess\nr = subprocess.run(["echo", "subprocess 가 대신 해 줘요"], capture_output=True, text=True)\nprint("출력:", r.stdout.strip())\nprint("종료 코드:", r.returncode)' } },
  ],
  summary: ['os.execvp(이름, [이름, 인자…]) — 같은 PID 로 다른 프로그램이 됨, 아래 줄은 실행 안 됨', '없는 프로그램 → FileNotFoundError → 자식은 os._exit(127)', '셸 = fork + exec + wait, cd · exit 는 셸이 직접(os.chdir) · 평소엔 subprocess.run'] },

{ id: 'K4', ch: 1, n: 4, title: '시그널: 프로세스에게 보내는 쪽지', mode: 'text', tutorSummary: '시그널 = 커널이 프로세스에 전하는 짧은 알림: SIGINT(2, Ctrl+C) · SIGTERM(15, kill 기본) · SIGKILL(9, 못 막음) · SIGTSTP(Ctrl+Z) · SIGCONT · SIGCHLD. signal.signal(번호, 함수) 로 받으면 할 일, os.kill(pid, 번호) 로 보냄. SIG_IGN 무시 · SIG_DFL 원래대로(무시는 exec 뒤에도 남음).',
  pages: [
    { title: '시그널 = 커널이 전하는 짧은 쪽지', html: `<p><b>시그널</b>은 「멈춰」「끝내」「잠깐 서」 같은 아주 짧은 알림이에요. 키보드나 다른 프로세스가 보내면 커널이 받는 프로세스에게 전해 줘요. 리눅스 교과서 레슨 10 의 <code>kill</code> 은 사실 <b>시그널을 보내는 명령</b>이에요.</p>
<table class="kb"><tbody><tr><td><code>SIGINT</code> (2)</td><td><kbd>Ctrl</kbd>+<kbd>C</kbd> — 「그만해」. 프로그램이 받아서 정리할 수 있어요</td></tr><tr><td><code>SIGTERM</code> (15)</td><td><code>kill PID</code> 의 기본 — 「정리하고 끝내」</td></tr><tr><td><code>SIGKILL</code> (9)</td><td><code>kill -9 PID</code> — 커널이 바로 없애요. <b>못 막고 정리도 못 해요</b>(마지막 수단)</td></tr><tr><td><code>SIGTSTP</code> (20) · <code>SIGCONT</code> (18)</td><td><kbd>Ctrl</kbd>+<kbd>Z</kbd> 로 멈춤 · <code>fg</code>/<code>bg</code> 로 다시</td></tr><tr><td><code>SIGCHLD</code> (17)</td><td>「자식이 끝났어요」 — 커널이 부모에게</td></tr></tbody></table>
<p>번호는 리눅스(x86-64) 기준이에요. 전체 목록은 <code>kill -l</code>. 명령에는 번호 대신 이름을 쓰는 게 읽기 좋아요(<code>kill -TERM 3107</code>).</p>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'kill -l\nsleep 100 &\nkill -TERM %1\njobs' } },
    { title: 'signal.signal: Ctrl+C 를 받으면 정리하고 끝내기', html: `<p>시그널을 받았을 때 할 일을 내가 정할 수 있어요. <code>signal.signal(시그널, 함수)</code> 로 <b>처리 함수</b>를 걸어 두면, 그 시그널이 오면 하던 일을 잠깐 멈추고 그 함수를 불러요.</p>
<pre class="code">import os, signal, sys
def on_int(signum, frame):
    print("정리 중… 저장하고 끝낼게요")
    sys.exit(0)
signal.signal(signal.SIGINT, on_int)
print("일하는 중", flush=True)
os.kill(os.getpid(), signal.SIGINT)
print("여기는 안 와요")</pre>
<ul><li>처리 함수는 <code>(signum, frame)</code> 두 개를 받아요(받은 시그널 번호 · 그때 실행 중이던 자리).</li><li><code>os.kill(PID, 시그널)</code> 은 시그널을 <b>보내는</b> 함수예요. 이름과 달리 꼭 죽이는 건 아니에요. 여기서는 연습으로 <b>나에게</b> Ctrl+C 를 보냈어요 — 터미널에서 직접 <kbd>Ctrl</kbd>+<kbd>C</kbd> 를 눌러도 똑같아요.</li><li>실행하면 <code>일하는 중</code> 다음에 <code>정리 중… 저장하고 끝낼게요</code> 가 나오고 끝나요. 「여기는 안 와요」 는 안 나와요.</li></ul>
<p>파이썬은 처리 함수를 안 걸어도 SIGINT 를 <code>KeyboardInterrupt</code> 예외로 바꿔 줘요(Ctrl+C 를 누르면 보이던 그 빨간 글). <code>signal.signal</code> 은 그걸 내가 정한 동작으로 바꾸는 거예요. 처리 함수 없이 받고 싶으면 <code>try: … except KeyboardInterrupt:</code> 로 그 예외를 잡아도 돼요.</p>` + OS_DATE,
      example: { code: 'import os, signal, sys\ndef on_int(signum, frame):\n    print("정리 중… 저장하고 끝낼게요")\n    sys.exit(0)\nsignal.signal(signal.SIGINT, on_int)\nprint("일하는 중", flush=True)\nos.kill(os.getpid(), signal.SIGINT)\nprint("여기는 안 와요")' } },
    { title: '자식에게 SIGTERM 보내기 · SIG_IGN 과 SIG_DFL', html: `<p>부모는 자식의 PID 를 알아서 시그널을 보낼 수 있어요. 시그널로 끝난 자식은 종료 코드가 <b>음수</b>로 나와요(<code>-15</code> = SIGTERM 으로 끝남).</p>
<pre class="code">import os, signal, time
pid = os.fork()
if pid == 0:
    while True:
        time.sleep(1)
time.sleep(0.2)
os.kill(pid, signal.SIGTERM)
_, status = os.waitpid(pid, 0)
code = os.waitstatus_to_exitcode(status)
print("종료 코드:", code)
print("받은 시그널:", signal.Signals(-code).name)</pre>
<p>실행하면 <code>종료 코드: -15</code> 와 <code>받은 시그널: SIGTERM</code> 이 나와요. <code>signal.Signals(15).name</code> 은 번호를 이름으로 바꿔 줘요.</p>
<table class="kb"><tbody><tr><td><code>signal.signal(signal.SIGINT, signal.SIG_IGN)</code></td><td>그 시그널을 <b>무시</b>. 셸이 Ctrl+C 에 죽지 않는 방법이에요</td></tr><tr><td><code>signal.signal(signal.SIGINT, signal.SIG_DFL)</code></td><td><b>원래대로</b>(SIGINT 는 원래 「끝내기」)</td></tr></tbody></table>
<p>주의할 점: <b>무시(SIG_IGN)는 exec 뒤에도 남아요</b>. 셸이 Ctrl+C 를 무시한 채로 자식을 만들어 <code>sleep</code> 으로 갈아타면 <code>sleep</code> 도 Ctrl+C 에 안 멈춰요. 그래서 셸은 자식에서 exec 하기 직전에 <code>SIG_DFL</code> 로 되돌려요. 「만들어 보기: 미니 셸」 에서 그대로 써요.</p>` + OS_DATE,
      example: { code: 'import os, signal, time\npid = os.fork()\nif pid == 0:\n    while True:\n        time.sleep(1)\ntime.sleep(0.2)\nos.kill(pid, signal.SIGTERM)\n_, status = os.waitpid(pid, 0)\ncode = os.waitstatus_to_exitcode(status)\nprint("종료 코드:", code)\nprint("받은 시그널:", signal.Signals(-code).name)' } },
  ],
  summary: ['SIGINT(Ctrl+C) · SIGTERM(kill 기본) · SIGKILL(못 막음) · SIGTSTP/SIGCONT · SIGCHLD', 'signal.signal(시그널, 함수(signum, frame)) 로 받기 · os.kill(PID, 시그널) 로 보내기', '시그널로 끝나면 종료 코드 음수 · SIG_IGN 무시(exec 뒤에도 남음) · SIG_DFL 원래대로'] },

{ id: 'K5', ch: 1, n: 5, title: '파이프와 리다이렉트는 어떻게 만들어지나', mode: 'text', tutorSummary: '파일 디스크립터 0 stdin · 1 stdout · 2 stderr(/proc/self/fd). os.write(1, 바이트). sys.stdin.readline() 은 0번에서 한 줄(끝이면 ""), sys.stdin.isatty() 는 0번이 터미널인지. 리다이렉트 = os.open 한 파일을 os.dup2(fd, 1) 로 1번에 끼우기(O_TRUNC 는 >, O_APPEND 는 >>). 파이프 = os.pipe() 의 읽는 끝 r · 쓰는 끝 w 를 두 자식의 1번·0번에 dup2, 안 쓰는 끝은 꼭 close.',
  pages: [
    { title: '파일 디스크립터 0 · 1 · 2', html: `<p>프로세스가 연 파일·터미널·파이프에는 커널이 <b>번호</b>를 붙여요. 이 번호가 <b>파일 디스크립터</b>(fd)예요. 모든 프로세스는 처음부터 세 개를 열고 태어나요.</p>
<table class="kb"><tbody><tr><td><b>0</b> stdin</td><td>입력 — 보통 키보드(터미널). <code>input()</code> · <code>sys.stdin.readline()</code> 이 여기서 읽어요</td></tr><tr><td><b>1</b> stdout</td><td>출력 — 보통 화면. <code>print</code> 가 여기로 써요</td></tr><tr><td><b>2</b> stderr</td><td>에러 출력 — 보통 화면. 에러 글은 여기로</td></tr></tbody></table>
<pre class="code">import os, sys
os.write(1, "1번(stdout)에 바로 쓰기\n".encode())
os.write(2, "2번(stderr)에 쓰기\n".encode())
print("0번이 터미널인가요?", sys.stdin.isatty())</pre>
<ul><li><code>os.write(번호, 바이트)</code> 는 print 를 거치지 않고 그 번호에 바로 써요(그래서 글자를 <code>.encode()</code> 로 바이트로).</li><li><code>sys.stdin.readline()</code> 은 0번에서 <b>한 줄</b>을 읽어요. 입력이 끝나면(파이프가 끝나거나 <kbd>Ctrl</kbd>+<kbd>D</kbd>) 빈 글자 <code>""</code> 를 돌려줘요.</li><li><code>sys.stdin.isatty()</code> 는 「0번이 사람이 치는 터미널인가」. 터미널에서 그냥 돌리면 <code>True</code>, <code>echo 값 | python3 파일.py</code> 처럼 파이프로 넣으면 <code>False</code> 예요.</li></ul>
<p><code>ls -l /proc/self/fd</code> 로 보면 0·1·2 가 모두 지금 터미널(<code>/dev/pts/0</code> 같은 것)을 가리켜요.</p>` + OS_DATE,
      example: { code: 'import os, sys\nos.write(1, "1번(stdout)에 바로 쓰기\\n".encode())\nos.write(2, "2번(stderr)에 쓰기\\n".encode())\nprint("0번이 터미널인가요?", sys.stdin.isatty())' } },
    { title: '리다이렉트 = os.dup2 로 1번을 바꿔 끼우기', html: `<p>bash 의 <code>echo 안녕 &gt; out.txt</code> 는 이렇게 만들어져요: 자식이 <b>out.txt 를 열고</b>, 그 번호를 <b>1번 자리에 복사해 끼운 뒤</b> <code>echo</code> 로 갈아타요. <code>echo</code> 는 평소처럼 1번에 썼을 뿐인데 글이 파일로 가요.</p>
<pre class="code">import os
pid = os.fork()
if pid == 0:
    fd = os.open("out.txt", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)
    os.dup2(fd, 1)
    os.close(fd)
    os.execvp("echo", ["echo", "파일로 갔어요"])
os.waitpid(pid, 0)
with open("out.txt") as f:
    print("out.txt 내용:", f.read().strip())</pre>
<table class="kb"><tbody><tr><td><code>os.open(이름, 플래그, 권한)</code></td><td>파일을 열고 번호(fd)를 받아요. 권한 <code>0o644</code> 는 새로 만들 때 <code>-rw-r--r--</code>(리눅스 교과서 레슨 8)</td></tr><tr><td><code>os.O_WRONLY | os.O_CREAT | os.O_TRUNC</code></td><td>쓰기만 · 없으면 만들기 · 있으면 비우고 처음부터 = bash 의 <code>&gt;</code></td></tr><tr><td><code>os.O_APPEND</code></td><td><code>O_TRUNC</code> 대신 쓰면 끝에 덧붙이기 = bash 의 <code>&gt;&gt;</code></td></tr><tr><td><code>os.dup2(fd, 1)</code></td><td>fd 가 가리키는 것을 <b>1번 자리에도</b> 끼우기. 그 뒤 원래 fd 는 <code>os.close(fd)</code></td></tr></tbody></table>
<p>실행하면 화면에는 <code>out.txt 내용: 파일로 갔어요</code> 만 나와요. <code>echo</code> 의 글은 파일로 갔으니까요. <code>2&gt;</code> 는 같은 방법으로 2번 자리를 바꾸는 거예요.</p>` + OS_DATE,
      example: { code: 'import os\npid = os.fork()\nif pid == 0:\n    fd = os.open("out.txt", os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o644)\n    os.dup2(fd, 1)\n    os.close(fd)\n    os.execvp("echo", ["echo", "파일로 갔어요"])\nos.waitpid(pid, 0)\nwith open("out.txt") as f:\n    print("out.txt 내용:", f.read().strip())' } },
    { title: 'os.pipe 로 echo … | wc -w 만들기', html: `<p><b>파이프</b>는 커널 안의 작은 통로예요. <code>r, w = os.pipe()</code> 를 부르면 <b>읽는 끝 r</b> 과 <b>쓰는 끝 w</b> 두 번호를 받아요. w 에 쓴 바이트가 r 에서 나와요.</p>
<pre class="code">import os
r, w = os.pipe()
if os.fork() == 0:
    os.dup2(w, 1)
    os.close(r)
    os.close(w)
    os.execvp("echo", ["echo", "하나", "둘", "셋"])
if os.fork() == 0:
    os.dup2(r, 0)
    os.close(r)
    os.close(w)
    os.execvp("wc", ["wc", "-w"])
os.close(r)
os.close(w)
os.wait()
os.wait()</pre>
<ol><li>첫째 자식: 쓰는 끝 w 를 <b>1번</b>에 끼우고 <code>echo</code> 로 → echo 의 출력이 파이프로 들어가요.</li><li>둘째 자식: 읽는 끝 r 을 <b>0번</b>에 끼우고 <code>wc -w</code> 로 → wc 가 키보드 대신 파이프에서 읽어요.</li><li>부모: 두 끝을 다 닫고, 자식 둘을 <code>os.wait()</code> 로 기다려요.</li></ol>
<p>실행하면 <code>3</code> 이 나와요(낱말 3개). bash 의 <code>echo 하나 둘 셋 | wc -w</code> 와 같아요.</p>
<div class="bk-step-box"><b>안 쓰는 끝은 꼭 닫기</b><br><code>wc</code> 는 「쓰는 끝이 <b>모두</b> 닫혀야」 입력이 끝났다고 알아요. 부모나 둘째 자식이 w 를 열어 둔 채면 wc 는 영원히 기다려요(프로그램이 멈춘 것처럼 보여요). 그래서 끼운 뒤에는 원래 번호를 닫고, 부모도 둘 다 닫아요.</div>` + OS_DATE,
      example: { code: 'import os\nr, w = os.pipe()\nif os.fork() == 0:\n    os.dup2(w, 1)\n    os.close(r)\n    os.close(w)\n    os.execvp("echo", ["echo", "하나", "둘", "셋"])\nif os.fork() == 0:\n    os.dup2(r, 0)\n    os.close(r)\n    os.close(w)\n    os.execvp("wc", ["wc", "-w"])\nos.close(r)\nos.close(w)\nos.wait()\nos.wait()' } },
  ],
  summary: ['fd 0 stdin · 1 stdout · 2 stderr — sys.stdin.readline() · sys.stdin.isatty() · os.write(1, 바이트)', '리다이렉트 = os.open(…, O_WRONLY|O_CREAT|O_TRUNC 또는 O_APPEND) → os.dup2(fd, 1) → exec', '파이프 = r, w = os.pipe() → 두 자식의 1번·0번에 dup2 · 안 쓰는 끝은 꼭 close'] },

{ id: 'KB1', ch: 1, boss: true, title: '보스: 내 미니 셸 1단계', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 1 종합. mysh.py: 한 줄 읽기 → 빈 줄 건너뛰기 · exit · cd(os.chdir, 셸이 직접) → fork · 자식은 SIG_DFL 로 되돌리고 execvp(없으면 127) · 부모는 waitpid 로 종료 코드, 0 이 아니면 [종료 코드 n]. 셸은 SIGINT 무시. 터미널일 때만 프롬프트.' },

// ================= 챕터 2 CPU 나눠 쓰기와 동기화 =================
{ id: 'K6', ch: 2, n: 6, title: '스케줄링: 누가 먼저 CPU 를 쓰나', mode: 'text', tutorSummary: 'CPU 코어 하나는 한 번에 하나만 — 커널이 아주 짧게 번갈아 줘서 동시에 도는 것처럼 보임(문맥 교환, /proc/self/status 의 voluntary_ctxt_switches). FCFS · SJF · 라운드 로빈 간트 차트와 평균 대기 시간. 리눅스는 EEVDF(커널 6.6~): 공평하게 + nice 로 몫 조절(nice -n 10 · renice · os.nice).',
  pages: [
    { title: '문맥 교환: 번갈아 쓰니까 동시에 도는 것처럼', html: `<p>CPU 코어 하나는 한 번에 <b>한 가지 일</b>만 해요(<code>nproc</code> 이 코어 수 — VM 은 4). 그런데 프로세스는 수백 개예요. 커널은 코어를 아주 짧게(수 밀리초) 이 프로세스 저 프로세스에 번갈아 줘서, 사람 눈에는 <b>동시에 도는 것처럼</b> 보이게 해요.</p>
<ul><li><b>준비 큐</b>: CPU 를 쓸 차례를 기다리는 프로세스들의 줄(상태 R). 무언가를 기다리며 자는 프로세스(상태 S)는 줄에 없어요.</li><li><b>문맥 교환</b>: 지금 하던 프로세스의 자리(어디까지 했는지 · 레지스터 값)를 저장하고 다음 프로세스의 자리를 불러오는 일. 공짜가 아니라서 너무 자주 하면 손해예요.</li><li><b>스케줄러</b>: 줄에서 다음에 누구를 고를지 정하는 커널의 부분 — 이 레슨의 주인공.</li></ul>
<p><code>/proc/self/status</code> 의 <code>voluntary_ctxt_switches</code> 는 「스스로 CPU 를 내놓은 횟수」(잠들기 · 입력 기다리기), <code>nonvoluntary_ctxt_switches</code> 는 「차례가 끝나 빼앗긴 횟수」 예요.</p>
<pre class="code">import time
def switches():
    d = {}
    with open("/proc/self/status") as f:
        for line in f:
            key, value = line.split(":", 1)
            d[key] = int(value) if value.strip().isdigit() else value.strip()
    return d["voluntary_ctxt_switches"]
a = switches()
time.sleep(0.1)
b = switches()
print("잠들면 스스로 내놓은 횟수가 늘었나요?", b > a)</pre>` + OS_DATE,
      example: { code: 'import time\ndef switches():\n    d = {}\n    with open("/proc/self/status") as f:\n        for line in f:\n            key, value = line.split(":", 1)\n            d[key] = int(value) if value.strip().isdigit() else value.strip()\n    return d["voluntary_ctxt_switches"]\na = switches()\ntime.sleep(0.1)\nb = switches()\nprint("잠들면 스스로 내놓은 횟수가 늘었나요?", b > a)' } },
    { title: '간트 차트: 먼저 온 순 · 짧은 것 먼저 · 번갈아', figure: { kind: 'gantt', jobs: [{ n: 'A', at: 0, bt: 5 }, { n: 'B', at: 1, bt: 3 }, { n: 'C', at: 2, bt: 1 }, { n: 'D', at: 3, bt: 2 }], height: 230, mheight: 245, note: '같은 작업 4개를 세 가지 방법으로' },
      params: [{ id: 'q', label: '번갈아 쓰는 시간 q', min: 1, max: 6, step: 1, default: 2 }],
      observe: ['평균 대기가 가장 작은 줄은 어느 것인가요? 왜 그럴까요?', 'q 를 1 → 6 으로 키우면 「번갈아」 줄은 어느 줄과 똑같아지나요?', '짧은 것 먼저(SJF)에서 A 처럼 긴 작업 뒤에 짧은 작업이 계속 오면 어떻게 될까요?'],
      html: `<p>위 그림은 <b>간트 차트</b>예요. 가로가 시간, 칸 하나가 「그 시간에 CPU 를 쓴 작업」 이에요. 작업은 A(0에 와서 5만큼) · B(1, 3) · C(2, 1) · D(3, 2).</p>
<table class="kb"><tbody><tr><td><b>먼저 온 순</b> (FCFS)</td><td>줄 선 순서대로 끝까지. 간단하지만 긴 작업 뒤의 짧은 작업이 오래 기다려요</td></tr><tr><td><b>짧은 것 먼저</b> (SJF)</td><td>기다리는 것 중 가장 짧은 것부터. 평균 대기가 가장 작아요. 하지만 실제 커널은 「얼마나 걸릴지」 를 미리 모르고, 긴 작업은 짧은 게 계속 오면 굶을 수 있어요</td></tr><tr><td><b>번갈아</b> (라운드 로빈, RR)</td><td>q 만큼씩 돌아가며. 다 못 끝내면 줄 맨 뒤로. 모두가 금방 차례를 받아서 화면이 멈추지 않아요(대화형 프로그램에 좋아요)</td></tr></tbody></table>
<p><b>대기 시간</b> = 끝난 시각 − 온 시각 − 실행 시간(일은 안 하고 줄만 선 시간). q 가 너무 작으면 문맥 교환이 많아져 손해, 너무 크면 먼저 온 순과 같아져요.</p>
<p>코드로 옮기면: 먼저 온 순은 <code>t = max(t, at) + bt</code>(앞 작업이 끝난 때와 이 작업이 온 때 중 늦은 때부터 시작). 번갈아는 줄(<code>from collections import deque</code>)을 두고 <code>line.popleft()</code> 로 앞에서 꺼내 q 만큼 하고, 남았으면 <code>line.append(name)</code> 로 뒤에 넣어요.</p>` + OS_DATE },
    { title: '리눅스의 스케줄러와 nice', html: `<p>리눅스는 위의 어느 하나도 그대로 쓰지 않아요. 지금 커널(6.6~)의 기본 스케줄러는 <b>EEVDF</b> 예요. 아주 거칠게 말하면 <b>「지금까지 덜 받은 프로세스에게 먼저, 그중 마감이 이른 것부터」</b> — 번갈아 주되 공평하게 맞춰 가는 방식이에요.</p>
<p>공평의 「몫」 은 <b>nice 값</b>으로 조절해요. <b>-20(가장 많이) ~ 19(가장 적게)</b>, 기본은 0. 「nice(착하다)」 가 클수록 남에게 양보해요.</p>
<table class="kb"><tbody><tr><td><code>nice -n 10 python3 busy.py &amp;</code></td><td>nice 10 으로 실행(양보하는 쪽)</td></tr><tr><td><code>ps -o pid,ni,cmd</code></td><td>NI 칸이 nice 값</td></tr><tr><td><code>renice -n 15 -p PID</code></td><td>도는 중에 바꾸기. 값을 <b>낮추는</b>(더 달라는) 건 <code>sudo</code> 가 필요해요</td></tr><tr><td><code>os.nice(5)</code></td><td>파이썬에서 내 nice 를 5 올리고 새 값을 돌려줘요. <code>os.nice(0)</code> 은 지금 값 보기</td></tr></tbody></table>
<pre class="code">import os
before = os.nice(0)
after = os.nice(5)
print("nice 가 5 올랐나요?", after - before == 5)</pre>
<p>CPU 가 남으면 nice 와 상관없이 다 받아요. 차이는 <b>서로 다툴 때</b>만 보여요 — 「만들어 보기」 에서 코어 하나에 둘을 묶어 직접 봐요.</p>` + OS_DATE,
      example: { code: 'import os\nbefore = os.nice(0)\nafter = os.nice(5)\nprint("nice 가 5 올랐나요?", after - before == 5)' } },
  ],
  summary: ['코어 하나는 한 번에 하나 — 커널이 번갈아 줌(문맥 교환 · 준비 큐)', '간트 차트: FCFS · SJF(평균 대기 최소 · 굶음) · 라운드 로빈(q) — 대기 = 끝 − 도착 − 실행', '리눅스 EEVDF: 공평하게 + nice(-20~19, 기본 0) 로 몫 조절 · nice -n · renice · os.nice'] },

{ id: 'K7', ch: 2, n: 7, title: '스레드: 한 프로세스 안의 여러 일꾼', mode: 'text', tutorSummary: '스레드 = 한 프로세스 안의 여러 일꾼, 메모리를 같이 씀(fork 와 반대). threading.Thread(target=함수, args=(…)) · start() · join(). /proc/self/status 의 Threads. CPython 의 GIL: 파이썬 코드는 한 번에 한 스레드만 → 기다리기(sleep·입출력)는 겹쳐서 빨라지고 계산은 안 빨라짐.',
  pages: [
    { title: '프로세스 vs 스레드: 메모리를 같이 써요', html: `<p>레슨 2 에서 <code>fork</code> 한 자식은 메모리가 <b>복사본</b>이라 money 를 바꿔도 부모는 그대로였어요. <b>스레드</b>는 반대예요. 한 프로세스 안에서 일꾼을 여럿 두는 것이라 <b>메모리를 같이 써요</b>.</p>
<pre class="code">import threading
money = 100
def spend():
    global money
    money -= 30
t = threading.Thread(target=spend)
t.start()
t.join()
print("main 이 본 money:", money)</pre>
<p>실행하면 <code>main 이 본 money: 70</code> — 일꾼이 바꾼 값이 그대로 보여요.</p>
<table class="kb"><tbody><tr><td></td><td><b>프로세스(fork)</b> · <b>스레드</b></td></tr><tr><td>메모리</td><td>따로(복사본) · <b>같이</b></td></tr><tr><td>만들기</td><td>무거움(통째 복사) · 가벼움</td></tr><tr><td>하나가 죽으면</td><td>나머지는 멀쩡 · 프로세스 전체가 같이 위험</td></tr><tr><td>주고받기</td><td>종료 코드 · 파이프 · 파일 · 그냥 변수(대신 조심 — 레슨 8)</td></tr></tbody></table>` + OS_DATE,
      example: { code: 'import threading\nmoney = 100\ndef spend():\n    global money\n    money -= 30\nt = threading.Thread(target=spend)\nt.start()\nt.join()\nprint("main 이 본 money:", money)' } },
    { title: 'threading.Thread · start · join · Threads:', html: `<table class="kb"><tbody><tr><td><code>t = threading.Thread(target=함수, args=(값,))</code></td><td>일꾼 만들기(아직 안 움직여요). <code>args</code> 는 튜플 — 값이 하나면 <code>(값,)</code></td></tr><tr><td><code>t.start()</code></td><td>일 시작 — 이 줄은 바로 돌아오고, 일꾼은 옆에서 따로 돌아요</td></tr><tr><td><code>t.join()</code></td><td>그 일꾼이 끝날 때까지 기다리기(프로세스의 <code>waitpid</code> 같은 것)</td></tr></tbody></table>
<p>일꾼이 도는 동안 <code>/proc/self/status</code> 의 <code>Threads:</code> 를 보면 늘어나 있어요. 처음부터 있던 <b>메인 스레드</b> 하나 + 내가 만든 수예요.</p>
<pre class="code">import threading
def threads():
    with open("/proc/self/status") as f:
        for line in f:
            if line.startswith("Threads:"):
                return int(line.split()[1])
go = threading.Event()
workers = [threading.Thread(target=go.wait) for _ in range(3)]
for t in workers:
    t.start()
print("일하는 중 Threads:", threads())
go.set()
for t in workers:
    t.join()
print("끝난 뒤 Threads:", threads())</pre>
<p><code>threading.Event()</code> 는 「신호 깃발」 — <code>go.wait()</code> 는 깃발이 올라갈 때까지 기다리고 <code>go.set()</code> 이 깃발을 올려요. 실행하면 <code>일하는 중 Threads: 4</code>, <code>끝난 뒤 Threads: 1</code>. 터미널에서는 <code>ps -o pid,nlwp,cmd</code> 의 NLWP 칸(스레드 수)으로도 봐요.</p>` + OS_DATE,
      example: { code: 'import threading\ndef threads():\n    with open("/proc/self/status") as f:\n        for line in f:\n            if line.startswith("Threads:"):\n                return int(line.split()[1])\ngo = threading.Event()\nworkers = [threading.Thread(target=go.wait) for _ in range(3)]\nfor t in workers:\n    t.start()\nprint("일하는 중 Threads:", threads())\ngo.set()\nfor t in workers:\n    t.join()\nprint("끝난 뒤 Threads:", threads())' } },
    { title: 'GIL 맛보기: 기다리기는 겹치고, 계산은 번갈아', html: `<p>보통 쓰는 파이썬(CPython)에는 <b>GIL</b>(전역 인터프리터 락)이 있어요. <b>파이썬 코드는 한 번에 한 스레드만</b> 실행돼요. 그래서 효과가 둘로 갈려요.</p>
<ul><li><b>기다리는 일</b>(<code>time.sleep</code> · 파일 · 네트워크)은 기다리는 동안 GIL 을 내놓아서 <b>겹쳐서</b> 돌아요 → 스레드로 빨라져요.</li><li><b>계산만 하는 일</b>(큰 반복문)은 서로 번갈아 돌 뿐이라 스레드를 늘려도 <b>안 빨라져요</b>. 계산을 나누려면 프로세스를 여럿(<code>multiprocessing</code>) 써요.</li></ul>
<pre class="code">import threading, time
start = time.time()
workers = [threading.Thread(target=time.sleep, args=(1,)) for _ in range(5)]
for t in workers:
    t.start()
for t in workers:
    t.join()
took = time.time() - start
print("1초짜리 다섯 개가 약 1초에 끝났나요?", 0.9 &lt;= took &lt; 1.6)</pre>
<p>하나씩 했으면 5초인데 1초 남짓이에요. 다운로드 여러 개를 동시에 받는 프로그램이 스레드를 쓰는 이유예요(「만들어 보기: 다운로드 대기열」).</p>
<p class="muted small">파이썬 3.13 부터 GIL 이 없는 판(따로 설치하는 <code>python3.13t</code>)도 시험 중이에요. 우분투의 기본 <code>python3</code> 는 GIL 이 있는 판이에요.</p>` + OS_DATE,
      example: { code: 'import threading, time\nstart = time.time()\nworkers = [threading.Thread(target=time.sleep, args=(1,)) for _ in range(5)]\nfor t in workers:\n    t.start()\nfor t in workers:\n    t.join()\ntook = time.time() - start\nprint("1초짜리 다섯 개가 약 1초에 끝났나요?", 0.9 <= took < 1.6)' } },
  ],
  summary: ['스레드 = 한 프로세스 안의 일꾼 — 메모리를 같이 씀(fork 는 복사본)', 'threading.Thread(target=함수, args=(값,)) · start() · join() · Threads: 칸 · threading.Event', 'GIL: 기다리기(sleep·입출력)는 겹쳐서 빨라짐, 계산은 안 빨라짐(→ multiprocessing)'] },

{ id: 'K8', ch: 2, n: 8, title: '경쟁 상태와 락', mode: 'text', tutorSummary: '같은 변수를 두 스레드가 읽기 → 더하기 → 쓰기 하면 사이에 끼어들어 한쪽 결과가 덮임(경쟁 상태). 일부러 time.sleep(0) 틈을 넣으면 매번 보임(200 대신 100 남짓). threading.Lock + with lock: 으로 그 세 단계를 한 번에(임계 구역) → 늘 200. 락 구간은 짧게.',
  pages: [
    { title: '읽고 → 더하고 → 쓰기 사이에 끼어들면', html: `<p>통장 잔액 <code>balance</code> 를 일꾼 둘이 1원씩 100번 올려요. 200원이 돼야 하죠. 그런데 「1 올리기」 는 사실 세 단계예요: <b>① 읽기 → ② 더하기 → ③ 쓰기</b>.</p>
<table class="kb"><tbody><tr><td>T1</td><td>① 잔액 5 를 읽음</td></tr><tr><td>T2</td><td>① 잔액 5 를 읽음 (T1 이 쓰기 전에 끼어듦)</td></tr><tr><td>T1</td><td>② ③ 6 을 씀</td></tr><tr><td>T2</td><td>② ③ 6 을 씀 → <b>T1 의 1원이 사라짐</b></td></tr></tbody></table>
<p>이게 <b>경쟁 상태</b>(race condition)예요. 누가 먼저 하느냐에 따라 결과가 달라지는 버그라서, 어쩌다 한 번 틀리고 다시 하면 맞는 <b>가장 잡기 어려운 버그</b> 중 하나예요.</p>
<p>파이썬에서는 GIL 때문에 이 끼어들기가 잘 안 일어나서 보기 어려워요. 그래서 읽기와 쓰기 사이에 <code>time.sleep(0)</code>(「잠깐 차례를 넘김」)을 넣어 <b>일부러 틈</b>을 만들어요. 그러면 매번 틀려요.</p>
<pre class="code">import threading, time
balance = 0
def deposit():
    global balance
    for _ in range(100):
        now = balance
        time.sleep(0)
        balance = now + 1
workers = [threading.Thread(target=deposit) for _ in range(2)]
for t in workers:
    t.start()
for t in workers:
    t.join()
print("잔액:", balance, "(200 이어야 해요)")</pre>
<p>실행할 때마다 200 대신 <b>100 남짓</b>이 나와요. 숫자는 매번 조금씩 달라요.</p>` + OS_DATE,
      example: { code: 'import threading, time\nbalance = 0\ndef deposit():\n    global balance\n    for _ in range(100):\n        now = balance\n        time.sleep(0)\n        balance = now + 1\nworkers = [threading.Thread(target=deposit) for _ in range(2)]\nfor t in workers:\n    t.start()\nfor t in workers:\n    t.join()\nprint("잔액:", balance, "(200 이어야 해요)")' } },
    { title: 'threading.Lock · with lock: 으로 한 번에', html: `<p><b>락</b>(Lock, 자물쇠)은 「이 구간은 한 번에 한 일꾼만」 이라는 약속이에요. 먼저 잠근 일꾼이 풀 때까지 다른 일꾼은 앞에서 기다려요. 락으로 지키는 구간을 <b>임계 구역</b>이라고 해요.</p>
<pre class="code">import threading, time
balance = 0
lock = threading.Lock()
def deposit():
    global balance
    for _ in range(100):
        with lock:
            now = balance
            time.sleep(0)
            balance = now + 1
workers = [threading.Thread(target=deposit) for _ in range(2)]
for t in workers:
    t.start()
for t in workers:
    t.join()
print("잔액:", balance)</pre>
<ul><li><code>with lock:</code> 은 들어갈 때 <code>lock.acquire()</code>(잠그기), 나올 때 <code>lock.release()</code>(풀기)를 해 줘요. 안에서 에러가 나도 풀어 줘서 <code>with</code> 를 쓰는 게 안전해요.</li><li>틈(<code>sleep(0)</code>)이 그대로 있어도 다른 일꾼은 락 앞에서 기다리니까 끼어들 수 없어요. 실행하면 늘 <code>잔액: 200</code>.</li></ul>` + OS_DATE,
      example: { code: 'import threading, time\nbalance = 0\nlock = threading.Lock()\ndef deposit():\n    global balance\n    for _ in range(100):\n        with lock:\n            now = balance\n            time.sleep(0)\n            balance = now + 1\nworkers = [threading.Thread(target=deposit) for _ in range(2)]\nfor t in workers:\n    t.start()\nfor t in workers:\n    t.join()\nprint("잔액:", balance)' } },
    { title: '임계 구역은 짧게 · 한 줄이어도 한 번이 아니에요', html: `<ul><li><b>락은 짧게</b>: 락 안에서 오래 걸리는 일(다운로드 · 큰 계산 · <code>sleep</code>)을 하면 다른 일꾼이 모두 줄 서서 기다려 스레드를 쓴 의미가 없어져요. 「공유 변수를 읽고 쓰는 몇 줄」 만 감싸요.</li><li><b>한 줄이어도 안전하지 않아요</b>: <code>balance += 1</code> 도 안에서는 읽기 · 더하기 · 쓰기 여러 단계예요. <code>dis</code> 모듈로 보면 파이썬이 실제로 하는 작은 명령들이 보여요.</li><li><b>같이 쓰는 것만 지켜요</b>: 일꾼마다 자기 지역 변수는 락이 필요 없어요. 결과를 모을 때 <code>results.append(값)</code> 처럼 공유 목록에 넣는 곳은 짧게 락으로(또는 다음 레슨의 <code>queue.Queue</code>).</li></ul>
<pre class="code">import dis
dis.dis("balance += 1")</pre>
<p>출력에 <code>LOAD_NAME</code>(읽기) · <code>BINARY_OP</code>(더하기) · <code>STORE_NAME</code>(쓰기)이 따로 있어요. 그 사이 어디서든 다른 스레드로 차례가 넘어갈 수 있어요.</p>` + OS_DATE,
      example: { code: 'import dis\ndis.dis("balance += 1")' } },
  ],
  summary: ['경쟁 상태: 읽기 → 더하기 → 쓰기 사이에 끼어들면 한쪽이 덮임(어쩌다 틀리는 버그)', 'lock = threading.Lock() · with lock: 으로 임계 구역을 한 번에 한 일꾼만', '락은 짧게 · += 도 여러 단계(dis) · 공유하는 것만 지키기'] },

{ id: 'K9', ch: 2, n: 9, title: '교착 상태와 기다리는 줄', mode: 'text', tutorSummary: '교착 상태: 락 둘을 서로 반대 순서로 잡으면 서로 놓기를 영원히 기다림(그림). 조건 넷(한 번에 하나 · 쥔 채 기다림 · 못 빼앗음 · 빙 둘러 기다림) 중 하나를 깨면 됨 — 락은 늘 같은 순서로. lock.acquire(timeout=초) 로 알아채기. queue.Queue: put · get 이 락과 기다림을 대신(생산자-소비자), 끝 신호 None.',
  pages: [
    { title: '교착 상태: 서로 놓기를 기다리며', figure: { kind: 'deadlock', height: 230, mheight: 250, note: '「한 걸음」 을 눌러 진행' },
      params: [{ id: 'same', label: '락 잡는 순서 (0 반대 · 1 같음)', min: 0, max: 1, step: 1, default: 0 }],
      observe: ['반대 순서(0)에서 몇 걸음째에 둘 다 멈추나요?', '같은 순서(1)로 바꾸면 T2 는 무엇을 기다리나요? 그 기다림은 언젠가 끝나나요?', '락이 셋(A·B·C)이면 「늘 같은 순서」 를 어떻게 정하면 될까요?'],
      html: `<p>일꾼 T1 은 <b>A 다음 B</b>, T2 는 <b>B 다음 A</b> 를 잡아야 일을 할 수 있어요. T1 이 A 를, T2 가 B 를 잡은 순간 둘 다 상대가 쥔 락을 기다려요. 아무도 놓지 않으니 <b>영원히</b> 멈춰요. 이게 <b>교착 상태</b>(deadlock)예요.</p>
<p>교착은 네 조건이 <b>모두</b> 맞을 때만 생겨요. 하나만 깨면 안 생겨요.</p>
<table class="kb"><tbody><tr><td>① 한 번에 하나</td><td>락은 한 일꾼만 쥘 수 있어요(락의 본분이라 못 깸)</td></tr><tr><td>② 쥔 채 기다림</td><td>A 를 쥔 채 B 를 기다려요</td></tr><tr><td>③ 못 빼앗음</td><td>남의 락을 억지로 뺏을 수 없어요</td></tr><tr><td>④ 빙 둘러 기다림</td><td>T1 → T2 → T1 로 기다림이 고리가 돼요 — <b>늘 같은 순서로 잡으면 고리가 안 생겨요</b></td></tr></tbody></table>` + OS_DATE },
    { title: 'acquire(timeout=…) 로 알아채고, 같은 순서로 고치기', html: `<p><code>lock.acquire(timeout=0.5)</code> 는 0.5초 기다려도 못 잡으면 <code>False</code> 를 돌려줘요. 영원히 멈추는 대신 「교착인가 봐」 를 알아챌 수 있어요(②를 깨는 방법 — 못 잡으면 쥔 걸 놓고 물러나요).</p>
<pre class="code">import threading
A, B = threading.Lock(), threading.Lock()
both_hold = threading.Barrier(2)
stuck = []
def worker(first, second):
    with first:
        both_hold.wait()
        if second.acquire(timeout=0.5):
            second.release()
        else:
            stuck.append(True)
t1 = threading.Thread(target=worker, args=(A, B))
t2 = threading.Thread(target=worker, args=(B, A))
t1.start(); t2.start(); t1.join(); t2.join()
print("교착이 있었나요?", len(stuck) &gt; 0)</pre>
<p><code>threading.Barrier(2)</code> 는 「둘 다 여기 올 때까지 기다리기」 — 둘 다 첫 락을 쥔 다음에 두 번째를 시도하게 해서 교착을 <b>매번</b> 일으켜요. 실행하면 <code>교착이 있었나요? True</code>.</p>
<p><b>고치기</b>: T2 의 <code>args=(B, A)</code> 를 <code>(A, B)</code> 로 — 둘 다 A 먼저. 그러면 T2 는 A 앞에서 기다리다가 T1 이 다 쓰고 놓으면 들어가요(그림의 「같은 순서」).</p>` + OS_DATE,
      example: { code: 'import threading\nA, B = threading.Lock(), threading.Lock()\nboth_hold = threading.Barrier(2)\nstuck = []\ndef worker(first, second):\n    with first:\n        both_hold.wait()\n        if second.acquire(timeout=0.5):\n            second.release()\n        else:\n            stuck.append(True)\nt1 = threading.Thread(target=worker, args=(A, B))\nt2 = threading.Thread(target=worker, args=(B, A))\nt1.start(); t2.start(); t1.join(); t2.join()\nprint("교착이 있었나요?", len(stuck) > 0)' } },
    { title: 'queue.Queue: 생산자와 소비자', html: `<p>일을 만드는 쪽(<b>생산자</b>)과 처리하는 쪽(<b>소비자</b>)을 나누면 편해요. 그 사이의 줄이 <code>queue.Queue</code> 예요. 안에 락과 「비었으면 기다리기」 가 다 들어 있어서 <b>내가 락을 안 써도</b> 안전해요.</p>
<table class="kb"><tbody><tr><td><code>q.put(값)</code></td><td>줄 끝에 넣기</td></tr><tr><td><code>q.get()</code></td><td>줄 앞에서 꺼내기 — 비어 있으면 들어올 때까지 <b>기다려요</b></td></tr><tr><td><code>None</code> 끝 신호</td><td>소비자 수만큼 <code>q.put(None)</code> 을 넣어 「이제 그만」 을 알려요</td></tr></tbody></table>
<pre class="code">import threading, queue
q = queue.Queue()
done = []
lock = threading.Lock()
def consumer():
    while True:
        n = q.get()
        if n is None:
            break
        with lock:
            done.append(n * 10)
workers = [threading.Thread(target=consumer) for _ in range(2)]
for t in workers:
    t.start()
for n in range(1, 6):
    q.put(n)
for _ in workers:
    q.put(None)
for t in workers:
    t.join()
print(sorted(done))</pre>
<p>누가 어떤 일을 맡을지는 매번 달라서 결과를 <code>sorted</code> 로 정렬해 찍어요. 실행하면 <code>[10, 20, 30, 40, 50]</code>.</p>` + OS_DATE,
      example: { code: 'import threading, queue\nq = queue.Queue()\ndone = []\nlock = threading.Lock()\ndef consumer():\n    while True:\n        n = q.get()\n        if n is None:\n            break\n        with lock:\n            done.append(n * 10)\nworkers = [threading.Thread(target=consumer) for _ in range(2)]\nfor t in workers:\n    t.start()\nfor n in range(1, 6):\n    q.put(n)\nfor _ in workers:\n    q.put(None)\nfor t in workers:\n    t.join()\nprint(sorted(done))' } },
  ],
  summary: ['교착 = 서로 쥔 락을 기다리며 영원히 멈춤 — 네 조건 중 하나만 깨면 됨', '늘 같은 순서로 잡기 · lock.acquire(timeout=초) 로 알아채기 · threading.Barrier 로 재현', 'queue.Queue: put · get(비면 기다림) · 끝 신호 None — 락을 대신'] },

{ id: 'KB2', ch: 2, boss: true, title: '보스: 다운로드 대기열', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 2 종합. 가짜 다운로드 12개(time.sleep)를 queue.Queue 에 넣고 일꾼 스레드 3개가 나눠 처리. 진행 수는 락으로, 일꾼별 처리 수를 모아 합계 12. 걸린 시간이 하나씩 할 때의 1/3 정도. Ctrl+C 로 깔끔하게 멈추기.' },
// ================= 챕터 3 메모리 (다음 업데이트) =================
{ id: 'K10', ch: 3, n: 10, title: '가상 메모리: 프로세스마다 자기만의 주소', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '코드·데이터·힙·스택 · /proc/self/maps · copy-on-write.' },
{ id: 'K11', ch: 3, n: 11, title: '페이지와 페이지 폴트', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '4096바이트 페이지 · 페이지 표 · 페이지 폴트 · VmRSS.' },
{ id: 'K12', ch: 3, n: 12, title: '페이지 교체: 자리가 모자라면 누구를 뺄까', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'FIFO · LRU · OPT(페이지 교체 표 그림) · 벨라디의 이상 · 스왑.' },
{ id: 'K13', ch: 3, n: 13, title: '메모리가 모자라면', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '스왑 · vmstat · OOM killer · 메모리가 새는 프로그램 잡기.' },
{ id: 'KB3', ch: 3, boss: true, draft: true, title: '보스: 페이지 교체 실험실', mode: 'text', pages: [], summary: [], tutorSummary: 'FIFO·LRU·OPT 폴트 수 표 + 프레임 1~6.' },
// ================= 챕터 4 시스템 콜과 파일 시스템 (다음 업데이트) =================
{ id: 'K14', ch: 4, n: 14, title: '시스템 콜: 커널에게 부탁하기', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '사용자 모드 → 커널 모드 · strace -e trace=write · strace -c · C 맛보기.' },
{ id: 'K15', ch: 4, n: 15, title: '파일 디스크립터와 버퍼', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: '/proc/self/fd · 닫지 않으면 · 버퍼 · flush · os.fsync.' },
{ id: 'K16', ch: 4, n: 16, title: '파일 시스템: inode 와 링크', mode: 'text', draft: true, pages: [], summary: [], tutorSummary: 'inode · ls -i · stat · 하드 링크 · 심볼릭 링크 · df -i.' },
{ id: 'KB4', ch: 4, boss: true, draft: true, title: '보스: 미니 셸 완성', mode: 'text', pages: [], summary: [], tutorSummary: '파이프 · 리다이렉트 · 백그라운드 & · 좀비 거두기 · Ctrl+C.' },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
