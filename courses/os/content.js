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
<ul><li>자식: <code>os._exit(3)</code> — 3 을 남기고 끝.</li><li>부모: <code>_, status = os.waitpid(pid, 0)</code> — 그 자식이 끝날 때까지 기다렸다가 상태를 받아요. 상태에서 종료 코드를 꺼내는 건 <code>os.waitstatus_to_exitcode(status)</code>.</li><li><code>os.wait()</code> 는 「아무 자식이나 하나 끝날 때까지」 기다려요(자식 PID 와 상태를 돌려줘요).</li><li><code>os.waitpid(-1, os.WNOHANG)</code> 은 <b>기다리지 않고</b> 확인만 해요 — 끝난 자식이 있으면 거두고, 없으면 바로 <code>(0, 0)</code> 을 돌려줘요. 뒤에서 도는 자식을 가끔 거둘 때 써요(챕터 4 「미니 셸 완성」).</li></ul>
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
<ul><li><code>os.write(번호, 바이트)</code> 는 print 를 거치지 않고 그 번호에 바로 써요(그래서 글자를 <code>.encode()</code> 로 바이트로). <code>print(…, file=sys.stderr)</code> 는 print 를 2번으로 보내요 — 에러 글은 이쪽으로.</li><li><code>sys.stdin.readline()</code> 은 0번에서 <b>한 줄</b>을 읽어요. 입력이 끝나면(파이프가 끝나거나 <kbd>Ctrl</kbd>+<kbd>D</kbd>) 빈 글자 <code>""</code> 를 돌려줘요.</li><li><code>sys.stdin.isatty()</code> 는 「0번이 사람이 치는 터미널인가」. 터미널에서 그냥 돌리면 <code>True</code>, <code>echo 값 | python3 파일.py</code> 처럼 파이프로 넣으면 <code>False</code> 예요.</li></ul>
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
<p>실행하면 <code>3</code> 이 나와요(낱말 3개). bash 의 <code>echo 하나 둘 셋 | wc -w</code> 와 같아요. 셸은 입력한 줄을 <code>line.split("|")</code> 로 단계마다 나눠, 단계 사이마다 파이프를 하나씩 만들어 이렇게 이어요.</p>
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
import time
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
for _ in range(50):          # 운영체제가 끝난 스레드를 치울 틈(최대 0.5초)
    if threads() == 1:
        break
    time.sleep(0.01)
print("끝난 뒤 Threads:", threads())</pre>
<p><code>threading.Event()</code> 는 「신호 깃발」 — <code>go.wait()</code> 는 깃발이 올라갈 때까지 기다리고 <code>go.set()</code> 이 깃발을 올려요. 실행하면 <code>일하는 중 Threads: 4</code>, <code>끝난 뒤 Threads: 1</code>. <code>join()</code> 은 파이썬 쪽 일이 끝나면 바로 돌아오고, 운영체제가 그 스레드를 실제로 치우는 데는 아주 잠깐 더 걸려요 — 그래서 바쁜 컴퓨터에서는 바로 세면 4 가 나올 수 있어, 1 이 될 때까지 잠깐 기다렸다 세요. 터미널에서는 <code>ps -o pid,nlwp,cmd</code> 의 NLWP 칸(스레드 수)으로도 봐요.</p>` + OS_DATE,
      example: { code: 'import threading\nimport time\ndef threads():\n    with open("/proc/self/status") as f:\n        for line in f:\n            if line.startswith("Threads:"):\n                return int(line.split()[1])\ngo = threading.Event()\nworkers = [threading.Thread(target=go.wait) for _ in range(3)]\nfor t in workers:\n    t.start()\nprint("일하는 중 Threads:", threads())\ngo.set()\nfor t in workers:\n    t.join()\nfor _ in range(50):          # 운영체제가 끝난 스레드를 치울 틈(최대 0.5초)\n    if threads() == 1:\n        break\n    time.sleep(0.01)\nprint("끝난 뒤 Threads:", threads())' } },
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
// ================= 챕터 3 메모리 =================
{ id: 'K10', ch: 3, n: 10, title: '가상 메모리: 프로세스마다 자기만의 주소', mode: 'text', tutorSummary: '프로세스마다 0 부터 시작하는 자기만의 주소 공간(코드 · 데이터 · 힙 · 스택 · 라이브러리). /proc/self/maps 한 줄 = 주소 범위 · 권한(r w x p) · 파일. fork 한 자식은 같은 주소를 보지만 실제 메모리는 따로 — 쓸 때만 복사(copy-on-write)라서 fork 가 빠름.',
  pages: [
    { title: '주소 공간: 코드 · 데이터 · 힙 · 스택', html: `<p>프로그램이 보는 메모리 주소는 <b>진짜 RAM 의 주소가 아니에요</b>. 커널은 프로세스마다 <b>자기만의 주소 공간</b>을 하나씩 만들어 줘요. 그래서 두 프로세스가 같은 주소에 값을 써도 서로 부딪히지 않아요. 이게 <b>가상 메모리</b>예요.</p>
<div class="bk-layers" role="img" aria-label="주소 공간: 위에서부터 스택 · 라이브러리 · 힙 · 데이터 · 코드"><div class="bk-layer v"><b>스택 (stack)</b><span>함수를 부를 때마다 쌓이는 칸 — 지역 변수 · 돌아갈 자리</span></div><div class="bk-layer h"><b>라이브러리 · mmap</b><span>libc 같은 공용 코드 · 큰 덩어리 메모리</span></div><div class="bk-layer g"><b>힙 (heap)</b><span>실행 중에 필요할 때 받아 쓰는 칸</span></div><div class="bk-layer h"><b>데이터 · 코드</b><span>프로그램 파일에서 읽어 온 값과 명령</span></div></div>
<p>파이썬의 모든 값(목록 · 딕셔너리 · 글자)은 힙과 mmap 칸 어딘가에 있어요. <code>id(값)</code> 은 CPython 에서 그 값이 있는 <b>가상 주소</b>예요.</p>
<pre class="code">nums = [1, 2, 3]
addr = id(nums)
print("nums 가 있는 가상 주소:", hex(addr))</pre>
<p>주소 숫자는 실행할 때마다 달라요(보안을 위해 커널이 시작 위치를 섞어요 — ASLR).</p>` + OS_DATE,
      example: { code: 'nums = [1, 2, 3]\naddr = id(nums)\nprint("nums 가 있는 가상 주소:", hex(addr))' } },
    { title: '/proc/self/maps: 내 주소 공간의 지도', html: `<p><code>/proc/self/maps</code> 는 내 주소 공간의 <b>지도</b>예요. 한 줄이 한 구역이에요.</p>
<pre class="code">55d0a1c00000-55d0a1c21000 rw-p 00000000 00:00 0      [heap]
7ffc8e3a1000-7ffc8e3c2000 rw-p 00000000 00:00 0      [stack]
7f2b4c600000-7f2b4c628000 r--p 00000000 08:02 1835   /usr/lib/x86_64-linux-gnu/libc.so.6</pre>
<table class="kb"><tbody><tr><td>앞 두 숫자</td><td>그 구역의 시작 · 끝 주소(16진수)</td></tr><tr><td><code>r w x p</code></td><td>읽기 · 쓰기 · 실행 · 나만 쓰는 복사본(private). 코드 칸은 <code>r-xp</code>(실행은 되고 쓰기는 안 됨), 데이터 칸은 <code>rw-p</code></td></tr><tr><td>끝</td><td>그 칸을 채운 파일(<code>/usr/bin/python3…</code> · <code>libc.so.6</code>) 또는 <code>[heap]</code> · <code>[stack]</code> 같은 이름</td></tr></tbody></table>
<pre class="code">with open("/proc/self/maps") as f:
    lines = f.read().splitlines()
names = [line.split()[-1] for line in lines]
print("[heap] 있음:", "[heap]" in names)
print("[stack] 있음:", "[stack]" in names)
perms = [line.split()[1] for line in lines]
print("실행할 수 있는 칸이 있나요?", "r-xp" in perms)</pre>
<p>터미널에서는 <code>cat /proc/$$/maps</code>(bash 의 지도)나 <code>pmap -x $$</code>(칸마다 크기)로 봐요. 코드 칸에 쓰기가 막혀 있어서, 프로그램이 자기 명령을 실수로 덮어쓰면 <b>Segmentation fault</b>(허락 안 된 칸을 만짐)로 멈춰요.</p>` + OS_DATE,
      example: { code: 'with open("/proc/self/maps") as f:\n    lines = f.read().splitlines()\nnames = [line.split()[-1] for line in lines]\nprint("[heap] 있음:", "[heap]" in names)\nprint("[stack] 있음:", "[stack]" in names)\nperms = [line.split()[1] for line in lines]\nprint("실행할 수 있는 칸이 있나요?", "r-xp" in perms)' } },
    { title: '같은 주소, 다른 메모리: 쓸 때만 복사', html: `<p>레슨 2 에서 자식이 money 를 바꿔도 부모는 그대로였죠. 그런데 자식이 보는 <b>주소</b>는 부모와 똑같아요.</p>
<pre class="code">import os
data = [0]
addr = id(data)
pid = os.fork()
if pid == 0:
    data[0] = 1
    print("자식: 주소가 같나요?", id(data) == addr, "· 값", data[0], flush=True)
    os._exit(0)
os.waitpid(pid, 0)
print("부모: 값", data[0])</pre>
<p>실행하면 <code>자식: 주소가 같나요? True · 값 1</code> 다음에 <code>부모: 값 0</code>. <b>같은 가상 주소</b>가 두 프로세스에서 <b>다른 진짜 메모리</b>를 가리키는 거예요. 가상 주소를 진짜 메모리로 바꿔 주는 표(<b>페이지 표</b> — 다음 레슨)가 프로세스마다 따로 있어서 그래요.</p>
<p><b>쓸 때만 복사</b>(copy-on-write): fork 할 때 커널은 부모의 메모리를 바로 복사하지 않아요. 둘이 같은 진짜 메모리를 「읽기 전용」 으로 같이 보다가, <b>누군가 쓰는 순간</b> 그 칸(페이지)만 복사해요. 그래서 큰 프로그램도 fork 가 아주 빨라요(셸이 명령마다 fork 해도 괜찮은 이유).</p>` + OS_DATE,
      example: { code: 'import os\ndata = [0]\naddr = id(data)\npid = os.fork()\nif pid == 0:\n    data[0] = 1\n    print("자식: 주소가 같나요?", id(data) == addr, "· 값", data[0], flush=True)\n    os._exit(0)\nos.waitpid(pid, 0)\nprint("부모: 값", data[0])' } },
  ],
  summary: ['가상 메모리: 프로세스마다 자기만의 주소 공간(코드 · 데이터 · 힙 · mmap · 스택)', '/proc/self/maps 한 줄 = 주소 범위 · 권한 r w x p · 파일 또는 [heap] [stack]', 'fork 자식: 같은 주소 · 다른 진짜 메모리 — 쓸 때만 복사(copy-on-write)'] },

{ id: 'K11', ch: 3, n: 11, title: '페이지와 페이지 폴트', mode: 'text', tutorSummary: '메모리는 4096바이트 페이지 단위(os.sysconf("SC_PAGE_SIZE")). 페이지 표가 가상 페이지 → 진짜 칸(프레임)을 이어 줌(TLB 는 그 빠른 메모). 처음 만지는 페이지는 페이지 폴트 → 커널이 그때 칸을 줌(minor) · 디스크에서 읽어야 하면 major. resource.getrusage(...).ru_minflt. mmap 으로 잡기만 하면 RSS 그대로, 만지면 늘어남(bytearray 는 0 으로 채워서 바로 늘어남). VSZ vs RSS.',
  pages: [
    { title: '페이지: 4096바이트짜리 칸', html: `<p>커널은 메모리를 한 바이트씩이 아니라 <b>페이지</b>라는 일정한 크기의 칸으로 나눠 다뤄요. x86-64 리눅스의 기본 페이지는 <b>4096바이트(4KB)</b>예요.</p>
<ul><li><b>페이지 표</b>: 「내 가상 페이지 몇 번 → 진짜 RAM 의 칸(프레임) 몇 번」 을 적은 표. 프로세스마다 하나씩 있어요(레슨 10 의 「같은 주소, 다른 메모리」).</li><li>CPU 는 주소를 쓸 때마다 이 표를 찾아요. 매번 찾으면 느려서 최근 것을 기억해 두는 작은 칸(<b>TLB</b>)이 CPU 안에 있어요.</li></ul>
<pre class="code">import os
print("페이지 크기:", os.sysconf("SC_PAGE_SIZE"), "바이트")</pre>
<p>실행하면 <code>페이지 크기: 4096 바이트</code>. 터미널에서는 <code>getconf PAGE_SIZE</code>. 그러니까 100MB 는 페이지 25,600장이에요.</p>` + OS_DATE,
      example: { code: 'import os\nprint("페이지 크기:", os.sysconf("SC_PAGE_SIZE"), "바이트")' } },
    { title: '페이지 폴트: 처음 만질 때 칸을 받아요', html: `<p>메모리를 「100MB 주세요」 하고 받아도, 커널은 <b>진짜 칸을 바로 주지 않아요</b>. 주소만 예약해 두고, 그 페이지를 <b>처음 만지는 순간</b> CPU 가 「표에 없어요!」 하고 커널을 불러요. 이게 <b>페이지 폴트</b>예요. 커널은 그때 빈 칸을 하나 주고 표에 적은 뒤 하던 일을 계속하게 해요(필요할 때만 준다 — demand paging).</p>
<table class="kb"><tbody><tr><td><b>minor</b> 폴트</td><td>빈 칸만 주면 되는 것 — 빨라요</td></tr><tr><td><b>major</b> 폴트</td><td>디스크(스왑 · 파일)에서 읽어 와야 하는 것 — 수천 배 느려요</td></tr></tbody></table>
<p><code>mmap.mmap(-1, 크기)</code> 로 메모리를 잡으면 이게 그대로 보여요. 잡기만 하면 실제 사용량(<b>RSS</b>, <code>VmRSS</code>)은 그대로고, 페이지마다 한 바이트씩 만지면 그만큼 늘어요. <code>resource.getrusage(resource.RUSAGE_SELF).ru_minflt</code> 는 지금까지의 minor 폴트 수예요. (<code>mmap.mmap(-1, 크기)</code> 의 기본은 fork 한 자식과 <b>같이 쓰는</b> 메모리예요. 나만 쓰는 메모리는 <code>flags=mmap.MAP_PRIVATE</code> — 레슨 10 의 「쓸 때만 복사」 는 이쪽이에요.)</p>
<pre class="code">import mmap, resource
def rss_mb():
    with open("/proc/self/status") as f:
        for line in f:
            if line.startswith("VmRSS:"):
                return int(line.split()[1]) / 1024
def faults():
    return resource.getrusage(resource.RUSAGE_SELF).ru_minflt
r0 = rss_mb()
m = mmap.mmap(-1, 50 * 1024 * 1024)
r1, f1 = rss_mb(), faults()
for i in range(0, len(m), 4096):
    m[i] = 1
r2, f2 = rss_mb(), faults()
print("잡기만 했을 때 거의 그대로인가요?", r1 - r0 &lt; 5)
print("다 만지니 약 50MB 늘었나요?", 45 &lt; r2 - r1 &lt; 60)
print("페이지 폴트가 1만 번 넘게 났나요?", f2 - f1 &gt; 10000)</pre>
<p class="muted small">파이썬의 <code>bytearray(크기)</code> 는 만들 때 0 으로 다 채워서(= 다 만져서) 바로 RSS 가 늘어요. 그래서 이 실험은 <code>mmap</code> 으로 해요.</p>` + OS_DATE,
      example: { code: 'import mmap, resource\ndef rss_mb():\n    with open("/proc/self/status") as f:\n        for line in f:\n            if line.startswith("VmRSS:"):\n                return int(line.split()[1]) / 1024\ndef faults():\n    return resource.getrusage(resource.RUSAGE_SELF).ru_minflt\nr0 = rss_mb()\nm = mmap.mmap(-1, 50 * 1024 * 1024)\nr1, f1 = rss_mb(), faults()\nfor i in range(0, len(m), 4096):\n    m[i] = 1\nr2, f2 = rss_mb(), faults()\nprint("잡기만 했을 때 거의 그대로인가요?", r1 - r0 < 5)\nprint("다 만지니 약 50MB 늘었나요?", 45 < r2 - r1 < 60)\nprint("페이지 폴트가 1만 번 넘게 났나요?", f2 - f1 > 10000)' } },
    { title: 'VSZ 와 RSS · /usr/bin/time -v', html: `<table class="kb"><tbody><tr><td><b>VSZ</b> (VmSize)</td><td>잡아 둔 <b>주소</b>의 합 — 아직 안 만진 것까지. 크게 보여도 걱정할 필요 없어요</td></tr><tr><td><b>RSS</b> (VmRSS)</td><td>지금 <b>진짜 RAM</b> 에 올라와 있는 양 — 이게 실제로 쓰는 메모리</td></tr></tbody></table>
<p><code>ps -o pid,vsz,rss,cmd</code> 로 둘을 나란히 봐요(단위 KB). 파이썬 하나도 VSZ 는 수십 MB, RSS 는 10MB 남짓이에요.</p>
<p>프로그램 하나를 처음부터 끝까지 돌리며 세려면 <code>/usr/bin/time -v</code> 를 앞에 붙여요(없으면 <code>sudo apt install time</code> — bash 의 <code>time</code> 과 다른 프로그램이라 전체 경로로).</p>
<pre class="code">/usr/bin/time -v python3 k11.py
…
	Maximum resident set size (kbytes): 63188
	Major (requiring I/O) page faults: 0
	Minor (reclaiming a frame) page faults: 14218
…</pre>
<p>「Maximum resident set size」 가 RSS 의 최댓값, 그 아래 두 줄이 major · minor 폴트 수예요. major 가 많으면 메모리가 모자라 디스크를 오가고 있다는 뜻(레슨 13)이에요.</p>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'ps -o pid,vsz,rss,cmd\n/usr/bin/time -v python3 -c "x = b\'a\' * 50_000_000" 2>&1 | grep -E "Maximum resident|page faults"' } },
  ],
  summary: ['페이지 = 4096바이트 칸 · 페이지 표(가상 페이지 → 진짜 칸) · TLB', '페이지 폴트: 처음 만질 때 커널이 칸을 줌(minor) · 디스크에서 읽으면 major · ru_minflt', 'mmap 으로 잡기만 하면 RSS 그대로 · VSZ(주소) vs RSS(진짜 RAM) · /usr/bin/time -v'] },

{ id: 'K12', ch: 3, n: 12, title: '페이지 교체: 자리가 모자라면 누구를 뺄까', mode: 'text', tutorSummary: 'RAM 칸(프레임)이 모자라면 한 페이지를 내보내고 새 페이지를 들임. FIFO(먼저 들어온 것) · LRU(가장 오래 안 쓴 것) · OPT(가장 늦게 쓸 것 — 미래를 알아야 해서 비교용). 교과서 참조 20개 · 프레임 3: FIFO 15 · LRU 12 · OPT 9. FIFO 는 프레임을 늘려도 폴트가 늘 수 있음(벨라디의 이상 1 2 3 4 1 2 5 1 2 3 4 5: 3칸 9 · 4칸 10). 리눅스는 LRU 흉내(최근에 썼나 표시) + 스왑.',
  pages: [
    { title: '페이지 교체 표: FIFO · LRU · OPT', figure: { kind: 'pagereplace', height: 250, mheight: 250, note: '같은 참조 순서를 다른 방법으로' },
      params: [{ id: 'algo', label: '방법 (0 FIFO · 1 LRU · 2 OPT)', min: 0, max: 2, step: 1, default: 0 }, { id: 'frames', label: '프레임 수', min: 1, max: 6, step: 1, default: 3 }, { id: 'set', label: '예 (0 교과서 · 1 벨라디)', min: 0, max: 1, step: 1, default: 0 }],
      observe: ['교과서 예 · 프레임 3에서 FIFO · LRU · OPT 의 폴트 수는 각각 몇 번인가요?', 'OPT 가 늘 가장 적은 이유는? 진짜 커널은 왜 OPT 를 못 쓸까요?', '프레임을 1 → 6 으로 늘리면 폴트는 어떻게 바뀌나요?'],
      html: `<p>RAM 의 칸(<b>프레임</b>)은 정해져 있어요. 다 찼는데 새 페이지가 필요하면 <b>하나를 내보내야</b> 해요(내보낸 건 스왑으로 — 레슨 13). 누구를 내보낼지 정하는 게 <b>페이지 교체</b>예요. 그림의 위 줄은 프로그램이 만지는 페이지 번호 순서(<b>참조 순서</b>), 아래는 칸마다 든 페이지예요.</p>
<table class="kb"><tbody><tr><td><b>FIFO</b></td><td>가장 <b>먼저 들어온</b> 것을 내보내요. 간단하지만 자주 쓰는 페이지도 오래됐다고 내보내요</td></tr><tr><td><b>LRU</b></td><td>가장 <b>오래 안 쓴</b> 것을 내보내요. 「요즘 안 쓴 건 앞으로도 안 쓸 것」 이라는 짐작 — 보통 잘 맞아요</td></tr><tr><td><b>OPT</b></td><td>앞으로 <b>가장 늦게 쓸</b> 것을 내보내요. 폴트가 가장 적은 최고의 방법이지만 <b>미래를 알아야</b> 해서 진짜로는 못 써요 — 다른 방법이 얼마나 잘하나 재는 잣대</td></tr></tbody></table>
<p>코드로 OPT 를 만들 때는 칸에 든 페이지마다 <code>ref.index(page, t + 1)</code>(지금 차례 t 뒤에서 처음 다시 쓰는 자리)를 찾고, 다시 안 쓰면 <code>except ValueError:</code> 에서 「끝없이 먼 것」 으로 쳐서 가장 먼 것을 내보내요.</p>` + OS_DATE },
    { title: '벨라디의 이상: 칸을 늘렸는데 폴트가 늘어요', html: `<p>보통은 프레임을 늘리면 폴트가 줄어요. 그런데 <b>FIFO 는 늘렸는데 오히려 늘 수 있어요</b>. 1969년에 이걸 찾은 사람의 이름을 따서 <b>벨라디의 이상</b>(Belady's anomaly)이라고 해요. 그림에서 「예」 를 1(벨라디), 방법을 0(FIFO)으로 두고 프레임을 3 → 4 로 바꿔 보세요.</p>
<pre class="code">def fifo(ref, n):
    frames = []
    faults = 0
    for page in ref:
        if page not in frames:
            faults += 1
            if len(frames) == n:
                frames.pop(0)
            frames.append(page)
    return faults
ref = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]
for n in (3, 4):
    print(f"프레임 {n}: 폴트 {fifo(ref, n)}번")</pre>
<p>실행하면 <code>프레임 3: 폴트 9번</code>, <code>프레임 4: 폴트 10번</code>. <code>frames.pop(0)</code> 이 「가장 먼저 들어온 것 내보내기」 예요. LRU 는 같은 목록을 「최근에 쓴 순서」 로 두면 돼요 — 이미 있는 페이지를 쓰면 <code>frames.remove(page)</code> 뒤 <code>frames.append(page)</code> 로 끝에 옮기고, 내보낼 땐 똑같이 맨 앞(<code>pop(0)</code>)이 가장 오래 안 쓴 것이에요. LRU 와 OPT 는 이런 일이 생기지 않아요(칸이 많을 때 든 페이지가 칸이 적을 때 든 페이지를 늘 다 포함해서).</p>` + OS_DATE,
      example: { code: 'def fifo(ref, n):\n    frames = []\n    faults = 0\n    for page in ref:\n        if page not in frames:\n            faults += 1\n            if len(frames) == n:\n                frames.pop(0)\n            frames.append(page)\n    return faults\nref = [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5]\nfor n in (3, 4):\n    print(f"프레임 {n}: 폴트 {fifo(ref, n)}번")' } },
    { title: '진짜 커널은: LRU 흉내 · 스왑', html: `<p>LRU 를 정확히 하려면 메모리를 만질 때마다 「언제 썼나」 를 적어야 해서 너무 느려요. 그래서 리눅스는 <b>LRU 를 흉내</b> 내요.</p>
<ul><li>CPU 가 페이지를 만지면 페이지 표에 <b>「최근에 썼음」 표시</b>를 켜 줘요. 커널은 가끔 이 표시를 보고 끄면서 「자주 쓰는 줄(active)」 · 「한동안 안 쓴 줄(inactive)」 을 나눠요.</li><li>자리가 모자라면 <b>안 쓴 줄 끝</b>부터 내보내요. 파일에서 읽어 온 페이지(캐시)는 그냥 버리면 되고(다시 읽으면 됨), 프로그램이 만든 데이터는 <b>스왑</b>(디스크의 대피 칸)에 써 둬요.</li></ul>
<table class="kb"><tbody><tr><td><code>free -h</code></td><td><code>Swap:</code> 줄 — 스왑 크기와 쓰는 양</td></tr><tr><td><code>swapon --show</code></td><td>스왑이 어디 있나(우분투는 보통 스왑 <b>파일</b>)</td></tr><tr><td><code>cat /proc/sys/vm/swappiness</code></td><td>캐시 대신 데이터를 얼마나 쉽게 스왑으로 내보낼지(기본 60)</td></tr></tbody></table>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'free -h\nswapon --show\ncat /proc/sys/vm/swappiness' } },
  ],
  summary: ['프레임이 차면 한 페이지를 내보냄 — FIFO(먼저 들어온) · LRU(오래 안 쓴) · OPT(가장 늦게 쓸, 비교용)', '교과서 예 프레임 3: FIFO 15 · LRU 12 · OPT 9 · 벨라디의 이상(FIFO 3칸 9 → 4칸 10)', '리눅스: 「최근에 썼음」 표시로 LRU 흉내 · 캐시는 버리고 데이터는 스왑 · free -h · swapon --show'] },

{ id: 'K13', ch: 3, n: 13, title: '메모리가 모자라면', mode: 'text', tutorSummary: 'free -h 의 available 이 진짜 여유. vmstat 1 의 si/so(스왑 드나듦)가 계속 0 이 아니면 메모리 부족(스래싱). RAM + 스왑이 바닥나면 OOM killer 가 oom_score 가 큰 프로세스를 SIGKILL(journalctl -k). 메모리가 새는 프로그램은 VmRSS 가 계속 늘어남 → 캐시 크기 제한(collections.deque(maxlen=)).',
  pages: [
    { title: 'free 와 vmstat 1: 모자란지 보는 법', html: `<pre class="code">free -h
               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.1Gi       3.9Gi        48Mi       1.9Gi       5.4Gi
Swap:          4.0Gi          0B       4.0Gi</pre>
<ul><li><b>free</b> 가 작아도 괜찮아요. 리눅스는 남는 RAM 을 파일 캐시(<b>buff/cache</b>)로 써 두고, 필요하면 바로 비워요. 진짜 여유는 <b>available</b> 이에요.</li><li><code>vmstat 1</code> 은 1초마다 한 줄씩 보여 줘요. <b>si</b>(스왑에서 들어옴) · <b>so</b>(스왑으로 나감)가 계속 0 이 아니면 RAM 이 모자라 디스크를 오가는 중이에요. 이게 심해져 일보다 들락날락에 시간을 다 쓰는 상태를 <b>스래싱</b>이라고 해요 — 화면이 거의 멈춰요.</li></ul>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'free -h\nvmstat 1 5' } },
    { title: 'OOM killer: 바닥나면 커널이 하나를 끝내요', html: `<p>RAM 과 스왑이 <b>모두</b> 바닥나면 커널은 시스템 전체가 멈추지 않게 프로세스 하나를 골라 <b>SIGKILL</b>(레슨 4 — 못 막음)로 끝내요. 이걸 <b>OOM killer</b>(Out Of Memory)라고 해요.</p>
<ul><li>누구를 고를지는 <code>/proc/PID/oom_score</code> 의 점수로 정해요 — 메모리를 많이 쓰는 프로세스일수록 커요.</li><li>당한 프로그램은 아무 말 없이 사라져요(셸에는 <code>Killed</code>). 무슨 일이 있었는지는 커널 기록에 남아요: <code>journalctl -k | grep -i "out of memory"</code>(리눅스 교과서 레슨 11).</li><li>중요한 프로세스는 <code>/proc/PID/oom_score_adj</code> 를 낮춰(-1000 이면 절대 안 고름, <code>sudo</code> 필요) 보호할 수 있어요.</li></ul>
<pre class="code">with open("/proc/self/oom_score") as f:
    score = f.read().strip()
print("내 oom_score 를 읽었나요?", score.isdigit())</pre>
<p class="muted small">일부러 OOM 을 일으키는 실험은 VM 을 아주 느리게 만들어서 이 교과서는 하지 않아요. 해 보고 싶으면 꼭 스냅샷 뒤에.</p>` + OS_DATE,
      example: { code: 'with open("/proc/self/oom_score") as f:\n    score = f.read().strip()\nprint("내 oom_score 를 읽었나요?", score.isdigit())' } },
    { title: '메모리가 새는 프로그램 잡기', html: `<p>쓰고 나서 버리지 않는 값이 계속 쌓이면 RSS 가 끝없이 늘어요. 이걸 <b>메모리 누수</b>라고 해요. 파이썬은 안 쓰는 값을 알아서 치워 주지만, <b>목록 · 딕셔너리에 계속 넣기만 하면</b> 「아직 쓰는 값」 이라 못 치워요(예: 끝없이 커지는 캐시 · 기록).</p>
<pre class="code">from collections import deque
def rss_mb():
    with open("/proc/self/status") as f:
        for line in f:
            if line.startswith("VmRSS:"):
                return int(line.split()[1]) / 1024
start = rss_mb()
history = []
for _ in range(5):
    history.append(b"x" * (10 * 1024 * 1024))
leak = rss_mb() - start
history = None
start = rss_mb()
recent = deque(maxlen=2)
for _ in range(5):
    recent.append(b"x" * (10 * 1024 * 1024))
kept = rss_mb() - start
print("다 모으면 40MB 넘게 늘었나요?", leak &gt; 40)
print("최근 2개만 두면 35MB 안쪽인가요?", kept &lt; 35)</pre>
<p><code>deque(maxlen=2)</code> 는 3번째를 넣으면 가장 오래된 것을 스스로 버려요. 딕셔너리로 만든 캐시라면 딕셔너리가 넣은 순서를 기억하니까, 너무 커질 때 <code>next(iter(cache))</code>(가장 먼저 넣은 키)를 <code>del cache[key]</code> 로 지우면 같은 효과예요. 도는 프로그램이 새는지는 터미널에서 <code>watch -n 1 grep VmRSS /proc/PID/status</code> 로 1초마다 RSS 를 보면 알 수 있어요 — 일이 끝나도 숫자가 계속 오르기만 하면 의심해요.</p>` + OS_DATE,
      example: { code: 'from collections import deque\ndef rss_mb():\n    with open("/proc/self/status") as f:\n        for line in f:\n            if line.startswith("VmRSS:"):\n                return int(line.split()[1]) / 1024\nstart = rss_mb()\nhistory = []\nfor _ in range(5):\n    history.append(b"x" * (10 * 1024 * 1024))\nleak = rss_mb() - start\nhistory = None\nstart = rss_mb()\nrecent = deque(maxlen=2)\nfor _ in range(5):\n    recent.append(b"x" * (10 * 1024 * 1024))\nkept = rss_mb() - start\nprint("다 모으면 40MB 넘게 늘었나요?", leak > 40)\nprint("최근 2개만 두면 35MB 안쪽인가요?", kept < 35)' } },
  ],
  summary: ['free -h 의 available 이 진짜 여유 · vmstat 1 의 si/so 가 계속이면 스래싱', 'RAM + 스왑이 바닥나면 OOM killer 가 oom_score 큰 프로세스를 SIGKILL(journalctl -k)', '누수 = 계속 넣기만 하는 목록·딕셔너리 → VmRSS 가 계속 오름 · deque(maxlen=) 로 크기 제한'] },

{ id: 'KB3', ch: 3, boss: true, title: '보스: 페이지 교체 실험실', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 3 종합. FIFO · LRU · OPT 를 함수로 만들어 교과서 참조 20개로 프레임 1~5 의 폴트 수 표를 찍고, 벨라디 예로 FIFO 의 이상을 확인. 브라우저 그림과 숫자가 같은지 비교.' },
// ================= 챕터 4 시스템 콜과 파일 시스템 =================
{ id: 'K14', ch: 4, n: 14, title: '시스템 콜: 커널에게 부탁하기', mode: 'text', tutorSummary: '시스템 콜 = 사용자 모드 프로그램이 커널에게 하는 부탁(write · openat · read · close · mmap · clone · execve · wait4 · exit_group). print 아래에도 write. os.write(1, 바이트) 는 거의 그대로 write. strace -e trace=write · strace -c(몇 번) · strace -f(자식까지). C 로 만든 hello 는 수십 번, 파이썬은 수백 번(시작할 때 모듈을 읽어서).',
  pages: [
    { title: 'print 한 줄 아래: write', html: `<p>레슨 0 에서 「프로그램은 하드웨어를 직접 못 만지고 커널에게 부탁해요」 라고 했어요. 그 부탁이 <b>시스템 콜</b>이에요. 화면(터미널)에 글자를 쓰는 부탁은 <code>write</code> 예요.</p>
<pre class="code">strace -e trace=write python3 -c 'print("hi")'
write(1, "hi\\n", 3)                       = 3
+++ exited with 0 +++</pre>
<p><code>strace</code> 는 프로그램이 부르는 시스템 콜을 하나하나 보여 줘요(없으면 <code>sudo apt install strace</code>). <code>write(1, "hi\\n", 3) = 3</code> 은 「1번(stdout)에 3바이트를 써 줘 → 3바이트 썼어요」.</p>
<p>파이썬의 <code>os.write</code> 는 이 부탁을 거의 그대로 해요. 돌려주는 값은 <b>실제로 쓴 바이트 수</b>예요.</p>
<pre class="code">import os
n = os.write(1, "안녕\n".encode())
print("쓴 바이트:", n)</pre>
<p>실행하면 <code>안녕</code> 다음에 <code>쓴 바이트: 7</code>. 한글은 UTF-8 로 한 글자에 3바이트라서 「안녕」 6 + 줄바꿈 1 이에요.</p>` + OS_DATE,
      example: { code: 'import os\nn = os.write(1, "안녕\\n".encode())\nprint("쓴 바이트:", n)' } },
    { title: 'strace -c: 무엇을 몇 번 부탁하나', html: `<p><code>strace -c</code> 는 하나하나 대신 <b>종류별 횟수</b>를 표로 보여 줘요.</p>
<pre class="code">strace -c ls
% time     seconds  usecs/call     calls    errors syscall
…
  0.00    0.000000           0        17           mmap
  0.00    0.000000           0         8           close
…
100.00    0.000190           2        70         6 total</pre>
<p>이 교과서에서 쓴 파이썬 함수는 대부분 시스템 콜 하나와 짝이에요.</p>
<table class="kb"><tbody><tr><td><code>open</code> · <code>os.open</code></td><td><code>openat</code></td></tr><tr><td><code>f.read()</code> · <code>os.read</code></td><td><code>read</code></td></tr><tr><td><code>print</code> · <code>os.write</code></td><td><code>write</code></td></tr><tr><td><code>os.fork()</code></td><td><code>clone</code>(리눅스에서 fork 는 clone 으로)</td></tr><tr><td><code>os.execvp</code></td><td><code>execve</code></td></tr><tr><td><code>os.waitpid</code></td><td><code>wait4</code></td></tr><tr><td><code>os._exit</code></td><td><code>exit_group</code></td></tr><tr><td><code>mmap.mmap</code></td><td><code>mmap</code></td></tr></tbody></table>
<p><code>strace -f</code> 는 자식 프로세스까지 따라가요. 레슨 3 의 「fork + exec + wait」 프로그램을 <code>strace -f -e trace=clone,execve,wait4 python3 k03.py</code> 로 돌리면 세 부탁이 차례로 보여요.</p>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'sudo apt install -y strace\nstrace -c ls > /dev/null\nstrace -e trace=write python3 -c \'print("hi")\'' } },
    { title: 'C 맛보기: 파이썬 아래의 아래', html: `<p>파이썬은 내 코드를 읽어 실행해 주는 큰 프로그램(<code>python3</code>)이에요. 그래서 <code>print("hi")</code> 한 줄을 돌려도 파이썬 자신이 시작하며 모듈 파일을 여럿 열고 읽어요. 같은 일을 <b>C</b> 로 짜면 기계어로 바로 바뀐 작은 프로그램이 돼요.</p>
<pre class="code">#include &lt;stdio.h&gt;
int main(void) {
    printf("hi\\n");
    return 0;
}</pre>
<ol><li>위 내용을 <code>hello.c</code> 로 저장(<code>gcc</code> 는 리눅스 교과서 레슨 7 의 <code>build-essential</code> 로 이미 깔려 있어요).</li><li><code>gcc -o hello hello.c</code> — C 코드를 실행 파일 <code>hello</code> 로 바꿔요(컴파일).</li><li><code>./hello</code> → <code>hi</code></li><li><code>strace -c ./hello</code> 와 <code>strace -c python3 -c 'print("hi")'</code> 의 맨 아래 <code>total</code> 을 비교해요.</li></ol>
<p>C 의 hello 는 시스템 콜이 <b>수십 번</b>, 파이썬은 <b>수백 번</b>이에요. 화면에 쓰는 마지막 <code>write</code> 는 둘 다 똑같이 한 번이고요. 어셈블리어 교과서(예정)에서는 이 <code>write</code> 를 함수도 없이 CPU 명령 <code>syscall</code> 로 직접 불러요.</p>` + OS_DATE,
      example: { label: '예제 명령 — 우분투 터미널에서(hello.c 를 저장한 폴더)', shell: "gcc -o hello hello.c\n./hello\nstrace -c ./hello 2>&1 | tail -1\nstrace -c python3 -c 'print(\"hi\")' 2>&1 | tail -1" } },
  ],
  summary: ['시스템 콜 = 커널에게 하는 부탁 — print 아래에도 write(1, …)', 'strace -e trace=이름 · strace -c(횟수) · strace -f(자식까지) — open→openat · fork→clone · exec→execve', 'C 의 hello 는 수십 번, 파이썬은 수백 번(시작할 때 모듈을 읽어서) · gcc -o hello hello.c'] },

{ id: 'K15', ch: 4, n: 15, title: '파일 디스크립터와 버퍼', mode: 'text', tutorSummary: '파일을 열면 비어 있는 가장 작은 번호(fd, 보통 3 부터)를 받음 — f.fileno() · /proc/self/fd. 닫지 않으면 계속 쌓여 한도(ulimit -n · resource.RLIMIT_NOFILE)에서 Too many open files → with 로 닫기. 파이썬 파일은 버퍼에 모았다가 씀(flush 전에는 파일 크기 0) · os.fsync 는 디스크까지 · os.write 는 버퍼 없음.',
  pages: [
    { title: '/proc/self/fd: 지금 열어 둔 번호들', html: `<p>레슨 5 에서 0 · 1 · 2 를 봤죠. 파일을 <b>열면</b> 커널이 비어 있는 <b>가장 작은 번호</b>를 줘요. 처음 연 파일은 보통 <b>3</b> 이에요.</p>
<pre class="code">import os
before = len(os.listdir("/proc/self/fd"))
f = open("note.txt", "w")
print("받은 번호:", f.fileno())
opened = len(os.listdir("/proc/self/fd"))
print("열린 번호가 하나 늘었나요?", opened == before + 1)
f.close()
closed = len(os.listdir("/proc/self/fd"))
print("닫으니 원래대로?", closed == before)</pre>
<ul><li><code>f.fileno()</code> 는 파이썬 파일 뒤에 있는 진짜 번호(fd)예요.</li><li><code>/proc/self/fd</code> 폴더에는 지금 열어 둔 번호마다 이름이 하나씩 있어요. 터미널에서 <code>ls -l /proc/$$/fd</code> 로 보면 어느 파일을 가리키는지도 보여요.</li><li>번호는 <b>프로세스마다</b> 따로예요. fork 한 자식은 부모의 번호표를 복사해 받아요 — 레슨 5 에서 파이프 끝을 자식에게 넘길 수 있었던 이유예요.</li></ul>` + OS_DATE,
      example: { code: 'import os\nbefore = len(os.listdir("/proc/self/fd"))\nf = open("note.txt", "w")\nprint("받은 번호:", f.fileno())\nopened = len(os.listdir("/proc/self/fd"))\nprint("열린 번호가 하나 늘었나요?", opened == before + 1)\nf.close()\nclosed = len(os.listdir("/proc/self/fd"))\nprint("닫으니 원래대로?", closed == before)' } },
    { title: '닫지 않으면: 한도와 with', html: `<p>번호에는 <b>한도</b>가 있어요(우분투 기본은 한 프로세스에 1024개). 파일을 열기만 하고 닫지 않는 코드가 오래 돌면 번호가 바닥나서 <code>OSError: [Errno 24] Too many open files</code> 로 멈춰요.</p>
<pre class="code">import os, resource
soft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)
print("한도가 있나요?", soft &gt; 0)
before = len(os.listdir("/proc/self/fd"))
kept = [open("note.txt", "w") for _ in range(3)]
now = len(os.listdir("/proc/self/fd"))
print("닫지 않은 3개:", now - before)
for f in kept:
    f.close()
for _ in range(3):
    with open("note.txt", "w") as f:
        f.write("x")
now = len(os.listdir("/proc/self/fd"))
print("with 로 3번:", now - before)</pre>
<p>실행하면 <code>닫지 않은 3개: 3</code>, <code>with 로 3번: 0</code>. <code>with</code> 는 블록이 끝나면(에러가 나도) 닫아 줘요. 터미널에서는 <code>ulimit -n</code> 이 한도예요.</p>` + OS_DATE,
      example: { code: 'import os, resource\nsoft, hard = resource.getrlimit(resource.RLIMIT_NOFILE)\nprint("한도가 있나요?", soft > 0)\nbefore = len(os.listdir("/proc/self/fd"))\nkept = [open("note.txt", "w") for _ in range(3)]\nnow = len(os.listdir("/proc/self/fd"))\nprint("닫지 않은 3개:", now - before)\nfor f in kept:\n    f.close()\nfor _ in range(3):\n    with open("note.txt", "w") as f:\n        f.write("x")\nnow = len(os.listdir("/proc/self/fd"))\nprint("with 로 3번:", now - before)' } },
    { title: '버퍼 · flush · os.fsync', html: `<p>시스템 콜은 공짜가 아니라서, 파이썬은 <code>f.write</code> 를 할 때마다 <code>write</code> 를 부르지 않고 <b>버퍼</b>에 모았다가 한 번에 써요(레슨 2 의 <code>flush=True</code> 가 이것).</p>
<pre class="code">import os
f = open("buf.txt", "w")
f.write("hello")
print("flush 전 파일 크기:", os.path.getsize("buf.txt"))
f.flush()
print("flush 뒤 파일 크기:", os.path.getsize("buf.txt"))
os.fsync(f.fileno())
f.close()</pre>
<table class="kb"><tbody><tr><td><code>f.flush()</code></td><td>파이썬 버퍼 → 커널로(<code>write</code>). 이제 다른 프로그램이 읽으면 보여요</td></tr><tr><td><code>os.fsync(fd)</code></td><td>커널의 캐시 → <b>디스크</b>까지. 정전이 나도 남아야 하는 저장(데이터베이스 · 설정)에서 써요</td></tr><tr><td><code>os.write(fd, 바이트)</code></td><td>파이썬 버퍼 없이 바로 <code>write</code></td></tr></tbody></table>
<p>실행하면 <code>flush 전 파일 크기: 0</code>, <code>flush 뒤 파일 크기: 5</code>. <code>close()</code> 도 닫기 전에 flush 해 줘요 — 그래서 보통은 신경 쓸 일이 없지만, 다른 프로세스와 같은 파일을 볼 때는 이 순서가 중요해요.</p>` + OS_DATE,
      example: { code: 'import os\nf = open("buf.txt", "w")\nf.write("hello")\nprint("flush 전 파일 크기:", os.path.getsize("buf.txt"))\nf.flush()\nprint("flush 뒤 파일 크기:", os.path.getsize("buf.txt"))\nos.fsync(f.fileno())\nf.close()' } },
  ],
  summary: ['열면 비어 있는 가장 작은 번호(보통 3) — f.fileno() · /proc/self/fd · 자식은 번호표를 복사', '번호에는 한도(ulimit -n · RLIMIT_NOFILE) — 안 닫으면 Too many open files → with', '버퍼: flush 전엔 파일 크기 0 · flush = 커널로 · os.fsync = 디스크까지 · os.write 는 버퍼 없음'] },

{ id: 'K16', ch: 4, n: 16, title: '파일 시스템: inode 와 링크', mode: 'text', tutorSummary: '파일의 진짜 몸통은 inode(번호 · 크기 · 권한 · 데이터 위치 · 링크 수), 이름은 폴더 안의 「이름 → inode 번호」 한 줄. ls -i · stat · os.stat(...).st_ino / st_nlink. 이름 바꾸기(os.rename)는 inode 그대로. 하드 링크(os.link · ln) = 같은 inode 에 이름 하나 더(원본 지워도 읽힘), 심볼릭 링크(os.symlink · ln -s) = 경로를 적은 작은 파일(원본 지우면 깨짐). 지우기(os.remove) = 링크 수 줄이기 — 0 이 되고 아무도 안 열고 있을 때 공간이 비워짐. df -i.',
  pages: [
    { title: '이름 ≠ 파일: inode', html: `<p>디스크의 파일에는 <b>inode</b> 라는 카드가 하나씩 있어요. 카드에는 번호 · 크기 · 주인 · 권한 · 만든·고친 시각 · <b>데이터가 디스크 어디에 있나</b> · <b>링크 수</b>가 적혀 있어요. 그런데 <b>파일 이름은 카드에 없어요</b>.</p>
<p>이름은 <b>폴더</b> 안에 있어요. 폴더는 사실 「이름 → inode 번호」 줄들의 목록이에요. 그래서 이름을 바꾸는 건 폴더의 한 줄만 고치는 거라 아무리 큰 파일도 순식간이에요.</p>
<pre class="code">import os
with open("a.txt", "w") as f:
    f.write("안녕\n")
before = os.stat("a.txt").st_ino
os.rename("a.txt", "b.txt")
print("이름을 바꿔도 inode 가 같나요?", os.stat("b.txt").st_ino == before)
print("크기:", os.stat("b.txt").st_size, "바이트")
os.remove("b.txt")</pre>
<p>실행하면 <code>이름을 바꿔도 inode 가 같나요? True</code>, <code>크기: 7 바이트</code>. 터미널에서는 <code>ls -i</code>(앞 숫자가 inode 번호)와 <code>stat 파일</code>(카드 전체)로 봐요.</p>` + OS_DATE,
      example: { code: 'import os\nwith open("a.txt", "w") as f:\n    f.write("안녕\\n")\nbefore = os.stat("a.txt").st_ino\nos.rename("a.txt", "b.txt")\nprint("이름을 바꿔도 inode 가 같나요?", os.stat("b.txt").st_ino == before)\nprint("크기:", os.stat("b.txt").st_size, "바이트")\nos.remove("b.txt")' } },
    { title: '하드 링크와 심볼릭 링크', html: `<table class="kb"><tbody><tr><td><b>하드 링크</b> <code>ln 원본 새이름</code> · <code>os.link</code></td><td>같은 inode 에 <b>이름을 하나 더</b> 붙여요. 두 이름은 완전히 같은 파일 — 원본을 지워도 다른 이름으로 그대로 읽혀요. 링크 수(<code>st_nlink</code>)가 2 가 돼요</td></tr><tr><td><b>심볼릭 링크</b> <code>ln -s 원본 새이름</code> · <code>os.symlink</code></td><td><b>원본의 경로를 적은 작은 파일</b>(바로 가기). 자기 inode 가 따로 있고, 원본을 지우면 <b>깨져요</b>(가리키는 곳이 없음). 폴더 · 다른 디스크도 가리킬 수 있어요</td></tr></tbody></table>
<pre class="code">import os
for name in ("a.txt", "hard.txt", "soft.txt"):
    if os.path.lexists(name):
        os.remove(name)
with open("a.txt", "w") as f:
    f.write("안녕\n")
os.link("a.txt", "hard.txt")
os.symlink("a.txt", "soft.txt")
print("하드 링크는 같은 inode:", os.stat("hard.txt").st_ino == os.stat("a.txt").st_ino)
print("링크 수:", os.stat("a.txt").st_nlink)
os.remove("a.txt")
with open("hard.txt") as f:
    print("원본을 지운 뒤 하드 링크:", f.read().strip())
print("심볼릭 링크는 깨졌나요?", not os.path.exists("soft.txt"))</pre>
<p>실행하면 <code>링크 수: 2</code>, <code>원본을 지운 뒤 하드 링크: 안녕</code>, <code>심볼릭 링크는 깨졌나요? True</code>. 깨진 심볼릭 링크도 이름은 남아 있어서 지울 땐 <code>os.path.lexists</code>(링크 자체가 있나)로 찾아요. <code>ls -l</code> 에서 심볼릭 링크는 <code>soft.txt -&gt; a.txt</code> 처럼 보여요.</p>` + OS_DATE,
      example: { code: 'import os\nfor name in ("a.txt", "hard.txt", "soft.txt"):\n    if os.path.lexists(name):\n        os.remove(name)\nwith open("a.txt", "w") as f:\n    f.write("안녕\\n")\nos.link("a.txt", "hard.txt")\nos.symlink("a.txt", "soft.txt")\nprint("하드 링크는 같은 inode:", os.stat("hard.txt").st_ino == os.stat("a.txt").st_ino)\nprint("링크 수:", os.stat("a.txt").st_nlink)\nos.remove("a.txt")\nwith open("hard.txt") as f:\n    print("원본을 지운 뒤 하드 링크:", f.read().strip())\nprint("심볼릭 링크는 깨졌나요?", not os.path.exists("soft.txt"))' } },
    { title: '지우기 = 링크 수 줄이기 · df -i', html: `<p><code>rm</code> · <code>os.remove</code> 는 사실 「폴더에서 이름 한 줄을 지우고 링크 수를 1 줄이기」 예요(시스템 콜 이름도 <code>unlink</code>). 공간이 진짜로 비워지는 건 <b>링크 수가 0 이고, 그 파일을 열고 있는 프로세스도 없을 때</b>예요.</p>
<pre class="code">import os
with open("log.txt", "w") as f:
    f.write("아직 읽을 수 있어요\n")
f = open("log.txt")
os.remove("log.txt")
print("이름은 사라졌나요?", not os.path.exists("log.txt"))
print("연 채로 읽기:", f.read().strip())
f.close()</pre>
<p>실행하면 이름은 사라졌는데 열어 둔 번호로는 끝까지 읽혀요. 「큰 로그 파일을 지웠는데 디스크가 안 비어요」 의 범인이 이것이에요 — 아직 그 파일을 열고 있는 프로그램을 다시 시작해야 비워져요.</p>
<p><code>df -i</code> 는 inode 카드가 얼마나 남았나를 보여 줘요. 아주 작은 파일이 수백만 개면 공간이 남아도 카드가 바닥나 「No space left on device」 가 날 수 있어요.</p>` + OS_DATE,
      example: { code: 'import os\nwith open("log.txt", "w") as f:\n    f.write("아직 읽을 수 있어요\\n")\nf = open("log.txt")\nos.remove("log.txt")\nprint("이름은 사라졌나요?", not os.path.exists("log.txt"))\nprint("연 채로 읽기:", f.read().strip())\nf.close()' } },
  ],
  summary: ['inode = 파일 카드(번호 · 크기 · 권한 · 데이터 위치 · 링크 수) · 이름은 폴더에(이름 → inode) · ls -i · stat · os.stat', '하드 링크(os.link · ln) = 같은 inode 에 이름 하나 더 · 심볼릭 링크(os.symlink · ln -s) = 경로 쪽지(원본 지우면 깨짐)', '지우기 = 링크 수 줄이기(unlink) — 0 이고 아무도 안 열 때 비워짐 · df -i'] },

{ id: 'KB4', ch: 4, boss: true, title: '보스: 미니 셸 완성', mode: 'text', pages: [], summary: [], tutorSummary: '교과서 종합. KB1 셸에 파이프(|, 여러 단계) · 리다이렉트(> · >>) · 뒤에서 돌리기(&) + 끝난 자식 거두기(os.waitpid(-1, os.WNOHANG) — 좀비 방지) · 에러 글은 2번으로. Ctrl+C 는 앞에서 도는 명령만.' },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
