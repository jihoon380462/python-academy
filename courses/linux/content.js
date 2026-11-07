// courses/linux/content.js — 「리눅스 교과서」 (v2.21.0, 사용자 공용 코스 「리눅스는 우분투, 가상 VM 설치 및 적용」 11/6 · 「T9 리눅스 먼저」·결정 D13 11/7). 설계: specs/linux-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 사용자의 Windows PC 에 설치한 VirtualBox + 그 안의 Ubuntu Desktop 26.04 LTS.
// 화면 이름은 VirtualBox 7.2 매뉴얼(virtualbox.org/manual) · Ubuntu 문서(documentation.ubuntu.com)로 확인한 영어 글자 그대로 + 괄호 안 한국어 뜻. 화면이 바뀌면 여기를 고치고 QA 문서에 적어요.
// 레슨 쪽 example.shell = 우분투 터미널에 칠 명령(CI 에서는 안 돌림 — apt·sudo 가 있어서). 「만들어 보기」·시작하기·도감 도구 상자는 book.js. 검사: node tools/check_book.mjs linux
const COURSE = { id: 'linux', name: '리눅스(우분투)', runner: 'none', bench: false,
  tutorPersona: '너는 리눅스를 처음 쓰는 성인에게 VirtualBox 안의 우분투로 가르치는 선생님이다. 화면은 「어느 창 → 어느 탭 → 어느 칸 → 무슨 글자」 로 말한다.' };
const CHAPTERS = [
  { ch: 1, name: '우분투 연습장 만들기', color: '#e95420' },
  { ch: 2, name: '리눅스답게 쓰기', color: '#772953' },
  { ch: 3, name: '시스템 들여다보기', color: '#2c6e9b' },
];
const LX_DATE = '<p class="muted small">이 쪽의 화면 이름은 VirtualBox 7.2 · Ubuntu 26.04 LTS 기준(2026년 11월)이에요. 글자가 조금 바뀌어도 같은 자리에 있어요.</p>';
const TODO = (t) => [{ title: '준비 중', html: `<p>이 레슨은 다음 판에서 채워요. 다룰 것: ${t}</p>` }];
const LESSONS = [
// ================= 챕터 1 우분투 연습장 만들기 =================
{ id: 'U0', ch: 1, n: 0, title: '리눅스·우분투·가상 머신', mode: 'text', tutorSummary: '리눅스 = 커널(하드웨어와 프로그램 사이의 관리자), 우분투 = 리눅스에 데스크톱·프로그램을 묶은 배포판. VirtualBox 는 Windows 안에 가상의 컴퓨터를 만들어 그 안에 우분투를 설치. 망가져도 스냅샷으로 되돌림.',
  pages: [
    { title: '리눅스 · 우분투 · VirtualBox: 세 겹 그림', html: `<p><b>리눅스</b>는 원래 <b>커널</b>의 이름이에요. 커널은 CPU·메모리·디스크 같은 하드웨어와 프로그램 사이에서 「누가 언제 무엇을 쓸지」 정하는 관리자예요. Windows 에도 커널이 있지만, 그건 Windows 와 한 몸이라 따로 부르지 않을 뿐이에요.</p>
<p>커널만으로는 화면도 프로그램도 없어요. 그래서 리눅스 커널에 <b>데스크톱 화면 · 터미널 · 프로그램 설치 도구</b>를 묶어서 나눠 주는데, 이 묶음을 <b>배포판</b>이라고 해요. <b>우분투(Ubuntu)</b>는 가장 많이 쓰는 배포판 중 하나예요. 이 교과서는 <b>Ubuntu 26.04 LTS</b>(2026년 4월 출시, 2031년 4월까지 보안 업데이트)를 써요. LTS 는 「오래 지원하는 판」 이라는 뜻이에요.</p>
<p>우분투를 내 PC 에 바로 깔면 Windows 를 지우거나 나눠야 해요. 그래서 <b>VirtualBox</b> 라는 프로그램으로 Windows 안에 <b>가상의 컴퓨터(가상 머신, VM)</b>를 하나 만들고, 그 안에 우분투를 설치해요.</p>
<pre class="code">┌─────────────────────────────┐
│ Ubuntu 26.04 (게스트)          │  ← 이 교과서에서 쓰는 리눅스
├─────────────────────────────┤
│ VirtualBox (가상의 컴퓨터)     │  ← Windows 의 프로그램 하나
├─────────────────────────────┤
│ Windows 11 (호스트)            │  ← 지금 쓰는 내 PC
└─────────────────────────────┘</pre>
<p>바깥의 진짜 PC(Windows)를 <b>호스트</b>, 안의 가상 PC(우분투)를 <b>게스트</b>라고 불러요. 게스트 안에서 무엇을 지우든 호스트 Windows 는 그대로예요.</p>` + LX_DATE },
    { title: '왜 가상 머신에서 배우나', html: `<p>가상 머신으로 배우면 좋은 점이 셋 있어요.</p>
<table class="kb"><tbody><tr><td><b>망가져도 돼요</b></td><td>권한을 잘못 바꾸거나 중요한 파일을 지워도 Windows 는 멀쩡해요. 최악이면 VM 을 지우고 다시 만들면 끝이에요.</td></tr><tr><td><b>스냅샷</b></td><td>「지금 상태」 를 사진처럼 찍어 두고, 실험이 꼬이면 1분 만에 그 순간으로 되돌려요(레슨 4).</td></tr><tr><td><b>다음 교과서의 연습장</b></td><td>운영체제 교과서(프로세스·메모리)와 어셈블리어 교과서(<code>nasm</code>·<code>gdb</code>)를 이 우분투에서 해요.</td></tr></tbody></table>
<p>Windows 에는 리눅스를 터미널로만 쓰는 <b>WSL</b> 도 있어요. 이 교과서는 VirtualBox 를 써요. 우분투의 <b>데스크톱 화면</b>까지 있는 「통째로 한 대」 를 다뤄야 부팅·서비스·네트워크까지 볼 수 있기 때문이에요. 둘은 한 PC 에서 같이 쓰기 까다로울 수 있는데, 그 얘기는 레슨 1 의 🐢 에서 해요.</p>
<p>터미널 명령(<code>pwd</code> · <code>ls</code> · <code>cd</code> · 파이프)은 이미 <a href="../terminal-git/#lesson/T0" target="_blank" rel="noopener">터미널·Git 교과서 ↗</a> 에서 배운 그대로예요. 우분투의 터미널도 Git Bash 와 같은 <b>bash</b> 라서, 이 교과서는 그걸 다시 가르치지 않고 <b>리눅스를 관리하며 쓰는 법</b>에 집중해요.</p>` + LX_DATE },
    { title: '이 교과서 쓰는 법: 창 나란히 · 오른쪽 Ctrl', html: `<p>VM 창과 이 사이트를 <b>나란히</b> 두면 편해요. Windows 에서 창을 고르고 <kbd>Win</kbd>+<kbd>←</kbd> 를 누르면 왼쪽 절반, 다른 창에서 <kbd>Win</kbd>+<kbd>→</kbd> 를 누르면 오른쪽 절반을 차지해요.</p>
<p>VM 창을 클릭하면 키보드·마우스가 <b>게스트(우분투)로 들어가요</b>. 마우스가 VM 창 밖으로 안 나오면 <b>오른쪽 <kbd>Ctrl</kbd></b> 을 한 번 누르세요. VirtualBox 는 이 키를 <b>Host 키</b>라고 부르고, 「게스트에서 빠져나오기」 에 써요(설정에서 바꿀 수 있어요). Guest Additions 를 설치하면(레슨 3) 마우스가 자연스럽게 드나들어서 거의 안 쓰게 돼요.</p>
<p>레슨 끝 「🛠 만들어 보기」 에는 <b>내 화면에서 확인할 것 ☐</b> 목록이 있어요. 하나씩 내 화면에서 확인하면 완성이에요. 설치 같은 일은 자동으로 검사할 수 없어서, 「무엇이 보이면 성공인지」 를 자세히 적어 뒀어요.</p>
<div class="bk-step-box"><b>습관 하나</b><br>위험해 보이는 실험(권한 바꾸기, 시스템 파일 고치기) 전에는 <b>스냅샷</b>을 찍어요. 레슨 4 에서 배워요.</div>` + LX_DATE },
  ],
  summary: ['리눅스 = 커널, 우분투 = 리눅스 + 데스크톱·프로그램을 묶은 배포판', 'VirtualBox = Windows(호스트) 안의 가상 PC → 그 안에 우분투(게스트)', '마우스가 갇히면 오른쪽 Ctrl(Host 키)'] },

{ id: 'U1', ch: 1, n: 1, title: '가상화 켜기와 VirtualBox 설치', mode: 'text', tutorSummary: '작업 관리자 → 성능 → CPU → 가상화: 사용 확인(아니면 BIOS 의 Intel VT-x / AMD SVM). virtualbox.org 에서 7.2.x(7.2.10 이상 — 우분투 26.04 의 커널 7.0 지원) 설치. VM 창 오른쪽 아래 🐢 = Hyper-V 계열이 가상화를 쥐고 있어 느린 모드 → 메모리 무결성·Hyper-V·가상 머신 플랫폼 끄기 + bcdedit /set hypervisorlaunchtype off, 되돌리기는 다시 켜고 Auto.',
  pages: [
    { title: '작업 관리자 → 성능 → CPU → 「가상화: 사용」', html: `<p>가상 머신은 CPU 의 <b>가상화 기능</b>이 켜져 있어야 제 속도로 돌아요. 먼저 확인해요.</p>
<ol><li><kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Esc</kbd> 로 <b>작업 관리자</b>를 열어요.</li><li>왼쪽(또는 위)의 <b>성능</b> 탭 → <b>CPU</b> 를 골라요.</li><li>오른쪽 아래 글자 중 <b>가상화: 사용</b>(영어 화면은 <code>Virtualization: Enabled</code>)이 보이면 통과예요.</li></ol>
<p><b>「사용 안 함」</b> 이면 PC 를 켤 때 들어가는 <b>BIOS(UEFI) 설정</b>에서 켜야 해요.</p>
<ul><li>들어가는 키는 PC 마다 달라요 — 켜자마자 <kbd>Del</kbd> 또는 <kbd>F2</kbd> 를 여러 번(노트북은 <kbd>F2</kbd>·<kbd>F10</kbd>·<kbd>Esc</kbd> 가 흔해요). 화면에 잠깐 나오는 안내 글자를 보세요.</li><li>Intel CPU 는 <b>Intel Virtualization Technology</b>(VT-x), AMD CPU 는 <b>SVM Mode</b> 라는 칸을 <b>Enabled</b> 로. 보통 <b>Advanced</b> → <b>CPU Configuration</b> 근처에 있어요.</li><li>저장하고 나오기는 보통 <kbd>F10</kbd> → <b>Yes</b>.</li></ul>
<p class="muted small">메뉴 이름은 메인보드 회사마다 달라요. 못 찾으면 「메인보드(노트북) 모델 이름 + 가상화 켜기」 로 검색하면 사진과 함께 나와요.</p>` + LX_DATE },
    { title: 'virtualbox.org → Download → VirtualBox 7.2 설치', html: `<p>VirtualBox 는 무료예요. <b>꼭 공식 사이트</b>에서 받아요.</p>
<ol><li>브라우저에서 <a href="https://www.virtualbox.org/" target="_blank" rel="noopener">virtualbox.org ↗</a> → 위 메뉴 <b>Download</b>.</li><li>가장 위 <b>VirtualBox 7.2.x platform packages</b> 묶음에서 <b>Windows hosts</b>(Windows 용 설치 파일)를 받아요. 2026년 11월 기준 최신은 <b>7.2.22</b> 예요.</li><li>받은 <code>VirtualBox-7.2.xx-…-Win.exe</code> 를 실행 → <b>Next</b> 를 눌러 가요. 설치할 부분(USB · Networking · Python support)은 <b>그대로</b> 둬요.</li><li>도중에 「네트워크가 잠깐 끊긴다」 는 경고(Network Interfaces)가 나오면 <b>Yes</b> — 설치하는 동안 인터넷이 몇 초 끊겨요. 「장치 소프트웨어를 설치할까요?」 창도 <b>설치</b>.</li><li>Python 관련 경고(Missing Dependencies)가 나오면 <b>Yes</b> 로 계속해도 돼요. 파이썬에서 VirtualBox 를 조종하는 기능만 빠져요(이 교과서는 안 써요).</li><li><b>Install</b> → <b>Finish</b>. 바탕화면이나 시작 메뉴에 <b>Oracle VirtualBox</b> 가 생겨요.</li></ol>
<div class="bk-step-box"><b>버전이 중요해요</b><br>우분투 26.04 는 리눅스 커널 <b>7.0</b> 을 써요. VirtualBox 는 <b>7.2.8</b> 부터 커널 7.0 을 지원하기 시작했고, 그 뒤 판에서 화면·클립보드 문제를 더 고쳤어요. <b>7.2.10 이상</b>, 되도록 최신 7.2.x 를 쓰세요. 이미 깔려 있다면 VirtualBox 의 <b>Help → About Oracle VirtualBox</b> 에서 버전을 확인해요. 보안 업데이트가 자주 나오니 가끔 다시 확인하세요.</div>` + LX_DATE },
    { title: '🐢 거북이가 보이면: Hyper-V · 메모리 무결성 · 가상 머신 플랫폼', html: `<p>VM 을 켰을 때 창 <b>오른쪽 아래 상태 표시줄</b>에 <b>초록 거북이 🐢</b> 가 보이면, VirtualBox 가 CPU 의 가상화 기능을 직접 못 쓰고 <b>아주 느린 모드</b>로 돌고 있다는 뜻이에요. VirtualBox 매뉴얼은 이걸 「Hyper-V 같은 Windows 의 하이퍼바이저가 돌고 있다」 는 표시라고 설명해요. 정상이면 거북이 대신 <b>V 모양</b>이 보여요.</p>
<p>Windows 11 은 여러 기능이 그 하이퍼바이저를 몰래 켜요: <b>메모리 무결성</b>(보안 기능), <b>Hyper-V</b>, <b>가상 머신 플랫폼</b>(WSL2 가 씀), <b>Windows 하이퍼바이저 플랫폼</b>, <b>Windows 샌드박스</b>. 거북이를 없애려면 이것들을 꺼요.</p>
<ol><li><b>메모리 무결성 끄기</b>: 시작 → <b>Windows 보안</b> → <b>장치 보안</b> → <b>코어 격리 세부 정보</b> → <b>메모리 무결성</b> 을 <b>끔</b>.</li><li><b>Windows 기능 끄기</b>: 시작 → 「Windows 기능 켜기/끄기」 검색 → 목록에서 ☐ <b>Hyper-V</b> · ☐ <b>가상 머신 플랫폼</b>(Virtual Machine Platform) · ☐ <b>Windows 하이퍼바이저 플랫폼</b>(Windows Hypervisor Platform) · ☐ <b>Windows 샌드박스</b> — 켜져 있는 것만 끄고 <b>확인</b>.</li><li><b>부팅 설정</b>: 시작 → 「터미널」 검색 → 마우스 오른쪽 → <b>관리자 권한으로 실행</b> → 아래 명령.</li></ol>
<pre class="code">bcdedit /set hypervisorlaunchtype off</pre>
<ol start="4"><li><b>다시 시작</b> 한 뒤 VM 을 켜서 거북이가 사라졌는지 봐요.</li></ol>
<div class="bk-step-box"><b>대가 — 알고 끄기</b><br>끄면 <b>WSL2 · Docker Desktop · Windows 샌드박스</b> 가 안 돌아요. 메모리 무결성은 악성 프로그램이 Windows 의 깊은 곳을 건드리지 못하게 막는 <b>보안 기능</b>이라, 끄면 그만큼 보호가 약해져요. 그래서 모르는 프로그램을 설치하지 않는 습관이 더 중요해져요.</div>
<div class="bk-step-box"><b>되돌리기 — 다시 원래대로</b><br>위 1·2 를 반대로(메모리 무결성 <b>켬</b>, 기능 ☑ 켜기) 하고, 관리자 터미널에서 <code>bcdedit /set hypervisorlaunchtype auto</code> → 다시 시작. 지금 상태는 <code>bcdedit /enum | findstr -i hypervisorlaunchtype</code> 로 볼 수 있어요(<code>Off</code> 면 꺼짐).</div>
<p>WSL2·Docker 를 계속 써야 하면 거북이를 그대로 둬도 <b>되긴 해요</b>. 다만 설치가 몇 배 오래 걸리고 화면이 끊길 수 있어요.</p>` + LX_DATE },
  ],
  summary: ['작업 관리자 → 성능 → CPU → 가상화: 사용 (아니면 BIOS 의 VT-x / SVM Mode)', 'virtualbox.org → Download → Windows hosts, 7.2.10 이상(최신 7.2.x)', '🐢 = 느린 모드 → 메모리 무결성·Hyper-V·가상 머신 플랫폼 끄기 + bcdedit … off (되돌리기는 auto)'] },

{ id: 'U2', ch: 1, n: 2, title: 'VM 만들고 우분투 설치', mode: 'text', tutorSummary: 'ubuntu.com 에서 Ubuntu Desktop 26.04 LTS ISO. VirtualBox Home → New: 이름·ISO, 무인 설치 끄기, Base Memory 8192MB · Processors 4 · Disk Size 40GB. Settings → Display: VMSVGA, 3D 가속 끄기(26.04 알려진 문제). 설치 화면: 영어 · Interactive · Default selection · Erase disk(가상 디스크만) · No encryption · 계정 · Seoul.',
  pages: [
    { title: 'ubuntu.com → Download → Ubuntu Desktop 26.04 LTS (ISO)', html: `<p>우분투 설치 파일은 <b>ISO</b> 라는 한 덩어리 파일이에요(설치 DVD 를 파일로 만든 것). VirtualBox 는 이 파일을 가상 DVD 처럼 넣어서 설치해요.</p>
<ol><li><a href="https://ubuntu.com/download/desktop" target="_blank" rel="noopener">ubuntu.com/download/desktop ↗</a> 을 열어요.</li><li><b>Ubuntu 26.04.x LTS</b> 의 <b>Download</b> 버튼(지금은 26.04.1 — 26.04 에 그동안의 업데이트를 합친 판이에요)을 눌러요. 기부 안내 화면이 나오면 <b>Not now, take me to the download</b> 처럼 「지금은 아니고 내려받기」 쪽을 눌러도 돼요.</li><li><code>ubuntu-26.04.1-desktop-amd64.iso</code> 같은 이름으로 몇 GB 가 내려받아져요. <b>받기 폴더</b>에 그대로 두세요.</li></ol>
<p class="muted small">ISO 는 설치가 끝나면 지워도 돼요. 다시 설치할 일이 있을 것 같으면 남겨 두세요.</p>` + LX_DATE },
    { title: 'Home → New: Name · ISO Image · Base Memory · Processors · Disk Size', html: `<p>VirtualBox 를 열고 왼쪽 세로 막대의 <b>Home</b> → <b>New</b> 를 눌러요. 창이 단계별(Basic)로 나와요.</p>
<ul><li><b>Name</b> — <code>ubuntu-study</code> (영어·숫자로 — 나중에 명령에서 부르기 편해요)</li><li><b>VM Folder</b> — 그대로(내 사용자 폴더의 <code>VirtualBox VMs</code>)</li><li><b>ISO Image</b> — ▾ → <b>Other…</b> → 받기 폴더의 <code>ubuntu-26.04.1-desktop-amd64.iso</code>. 고르면 아래 OS 칸이 <b>Linux · Ubuntu (64-bit)</b> 로 저절로 채워져요</li><li><b>무인 설치 칸</b> — 설치 화면을 직접 보며 배우려고 <b>무인 설치(Unattended Installation)를 쓰지 않아요</b>. 판에 따라 모양이 달라요 — 7.2 는 ☐ <b>Install OS Using Unattended Installation</b> 을 <b>끄고</b>, 예전 모양이면 ☑ <b>Skip Unattended Installation</b> 을 <b>켜요</b>. 어느 쪽이든 「사용자 이름·비밀번호를 미리 넣는 칸」 이 안 나오면 맞게 한 거예요</li><li><b>Base Memory</b> — <b>8192 MB</b>(8GB). 우분투 26.04 데스크톱의 공식 최소가 6GB 예요</li><li><b>Processors</b> — <b>4</b>개. 막대의 초록 구역 안에서 — 내 PC 스레드 수의 <b>절반을 넘기지 않기</b></li><li><b>Use EFI</b> — 그대로 둬요</li><li><b>Disk Size</b> — <b>40 GB</b>. 처음부터 40GB 를 차지하지 않고 <b>쓴 만큼만 커지는</b> 파일(동적 할당)로 만들어져요 — 「미리 전부 할당(Pre-allocate)」 같은 칸이 보이면 끈 채로</li></ul>
<p>마지막에 <b>Finish</b>. 왼쪽 목록(Machines)에 <code>ubuntu-study</code> 가 <b>Powered Off</b> 로 생겨요.</p>
<div class="bk-step-box"><b>켜기 전에 하나 — 3D 가속 끄기</b><br><code>ubuntu-study</code> 를 고르고 <b>Settings</b> → <b>Display</b> → <b>Graphics Controller</b> 가 <b>VMSVGA</b> 인지 보고, ☐ <b>Enable 3D Acceleration</b> 은 <b>끈 채로</b> → <b>OK</b>. 우분투 26.04 공식 안내에 「VirtualBox 에서 3D 가속을 켜면 바탕화면 등이 제대로 안 그려진다」 는 알려진 문제가 있어요.</div>` + LX_DATE },
    { title: '우분투 설치 화면 따라가기: Interactive · Erase disk · Create your account', html: `<p><code>ubuntu-study</code> 를 고르고 <b>Start</b>(초록 화살표). 새 창에서 우분투가 켜져요. 처음 검은 화면에서 <b>Try or Install Ubuntu</b> 가 골라진 채로 넘어가요(그냥 기다리면 돼요).</p>
<p>설치 언어는 <b>English</b> 를 골라요. 이 교과서의 화면 이름과 똑같이 보이고, 에러 문장을 검색하기도 쉬워요. 한글 입력은 레슨 3 에서 따로 켜요.</p>
<ol><li><b>Choose your language</b>: <b>English</b> → <b>Next</b></li><li><b>Accessibility</b>: 그대로 <b>Next</b></li><li><b>Keyboard layout</b>: <b>Korean</b> → <b>Korean</b> (또는 English (US) — 둘 다 영어 자판은 같아요) → <b>Next</b></li><li><b>Internet connection</b>: 유선(가상 랜)으로 이미 연결돼 있어요 → <b>Next</b></li><li><b>Try or install Ubuntu</b>: <b>Install Ubuntu</b> → <b>Next</b></li><li><b>Type of installation</b>: <b>Interactive installation</b> → <b>Next</b></li><li><b>Applications</b>: <b>Default selection</b> → <b>Next</b></li><li><b>Optimise your computer</b>(추가 소프트웨어): 가상 머신에는 필요 없어서 ☐ 그대로 → <b>Next</b></li><li><b>Disk setup</b>: <b>Erase disk and install Ubuntu</b> → <b>Next</b>. 지우는 건 방금 만든 <b>빈 가상 디스크</b>예요</li><li><b>암호화(Encryption)</b>: <b>No encryption</b>(연습장이라 필요 없어요). 「hardware-backed encryption 에 문제가 있다(가상 머신에서 실행 중)」 같은 경고가 나오면 그건 가상 머신이라 그래요 — 암호화를 안 고르면 돼요</li><li><b>Create your account</b>: <b>Your name</b>(아무거나) · <b>Your computer's name</b>(<code>ubuntu-study</code>) · <b>Your username</b>(영어 소문자, 예: <code>me</code>) · 비밀번호 두 번 · ☑ <b>Require my password to log in</b></li><li><b>Select your timezone</b>: 지도에서 서울 근처를 누르거나 <b>Location</b> 칸에 <code>Seoul</code></li><li>마지막 확인 화면(<b>Review your choices</b> / Ready to install): <b>Install</b></li></ol>
<p>설치는 PC 에 따라 10~30분 걸려요. 끝나면 <b>Restart now</b>.</p>
<div class="bk-step-box"><b>비밀번호를 꼭 기억</b><br>이 비밀번호는 로그인뿐 아니라 <code>sudo</code>(관리자 명령)에도 써요. 잊으면 되찾기가 번거로워요 — 어딘가 안전한 곳에 적어 두세요.</div>` + LX_DATE },
    { title: '처음 켜고 로그인: 「remove the installation medium」 · Enter', html: `<p>다시 시작할 때 검은 화면에 <b>Please remove the installation medium, then press ENTER</b> 가 나오면, VM 창을 클릭하고 <kbd>Enter</kbd> 를 눌러요. 설치 DVD(ISO)는 이제 필요 없다는 뜻이에요.</p>
<p>혹시 다시 설치 화면이 나오면 ISO 가 아직 꽂혀 있는 거예요. VM 창 위 메뉴 <b>Devices</b> → <b>Optical Drives</b> 에서 ISO 를 빼는 항목을 고르고, <b>Machine</b> → <b>Reset</b> 으로 다시 켜요.</p>
<p>로그인 화면에서 내 이름을 누르고 비밀번호를 넣으면 우분투 바탕화면이 나와요. 처음 몇 장의 안내 창(Ubuntu Pro · 진단 정보 보내기 등)은 <b>Skip</b> / <b>Next</b> 로 넘겨도 돼요.</p>
<ul><li>왼쪽 세로 막대가 <b>Dock</b>(자주 쓰는 프로그램), 왼쪽 아래 점 9개가 <b>Show Apps</b>(모든 프로그램)예요.</li><li>오른쪽 위 전원 모양을 누르면 끄기·다시 시작이 있어요. VM 은 그냥 창을 닫지 말고 <b>우분투 안에서 끄는 게</b> 좋아요(진짜 PC 의 전원 버튼을 뽑지 않는 것과 같아요).</li><li>VM 창이 작고 글자가 흐린 건 아직 Guest Additions 가 없어서예요 — 레슨 3 에서 고쳐요.</li></ul>` + LX_DATE },
  ],
  summary: ['ISO = 설치 DVD 파일, ubuntu.com/download/desktop 에서', 'New: Base Memory 8192MB · Processors 4 · Disk Size 40GB, 무인 설치는 안 씀, 3D 가속 끔', '설치: English · Interactive · Erase disk(가상 디스크만) · No encryption · 비밀번호 기억'] },

{ id: 'U3', ch: 1, n: 3, title: '첫 부팅 뒤 할 일', mode: 'text', tutorSummary: 'Ctrl+Alt+T 터미널 → sudo apt update && sudo apt upgrade. 스냅샷 후 Guest Additions: build-essential·linux-headers 설치 → Devices → Insert Guest Additions CD Image → VBoxLinuxAdditions.run → 재부팅. Devices → Shared Clipboard → Bidirectional. 한글: Settings → Keyboard → Input Sources → Add Input Source → Korean (Hangul), Super+Space 로 바꾸기.',
  pages: [
    { title: 'Ctrl+Alt+T 터미널 → sudo apt update && sudo apt upgrade', html: `<p>우분투에서 터미널은 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> 로 열어요(또는 Show Apps → <b>Terminal</b>). 처음 할 일은 <b>업데이트</b>예요.</p>
<ul><li><code>sudo</code> 는 「이 명령만 관리자로」 라는 뜻이에요. 처음 쓰면 비밀번호를 물어요 — <b>쳐도 화면에 아무것도 안 보이는 게 정상</b>이에요(점도 안 찍혀요). 다 치고 <kbd>Enter</kbd>.</li><li><code>apt update</code> 는 「설치할 수 있는 프로그램 목록을 새로 받기」, <code>apt upgrade</code> 는 「깔린 것들을 새 판으로 바꾸기」 예요. <code>&&</code> 는 앞이 성공하면 뒤를 이어서 하라는 뜻(터미널·Git 교과서와 같아요).</li><li>도중에 <code>Do you want to continue? [Y/n]</code> 이 나오면 <kbd>Y</kbd> → <kbd>Enter</kbd>. 끝나고 다시 시작하라고 하면 <code>sudo reboot</code>.</li></ul>
<p>터미널에서 복사·붙여넣기는 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> / <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd> 예요(그냥 <kbd>Ctrl</kbd>+<kbd>C</kbd> 는 「실행 중인 명령 멈추기」 라서). Windows 에서 복사한 걸 붙이려면 다음 쪽의 클립보드 공유가 먼저 필요해요 — 그 전에는 직접 쳐요.</p>` + LX_DATE, example: { shell: 'sudo apt update && sudo apt upgrade -y\nlsb_release -a\nuname -r' } },
    { title: 'Guest Additions: Devices → Insert Guest Additions CD Image · Shared Clipboard → Bidirectional', html: `<p><b>Guest Additions</b> 는 게스트(우분투) 안에 까는 VirtualBox 의 도우미예요. 깔면 <b>창 크기에 맞춰 화면이 바뀌고</b>, <b>Windows ↔ 우분투 클립보드</b>가 공유되고, 마우스가 창을 자연스럽게 드나들어요.</p>
<p>시스템에 프로그램을 끼워 넣는 일이라, 먼저 <b>스냅샷</b>을 찍어 두면 안심이에요: VM 창 메뉴 <b>Machine</b> → <b>Take Snapshot</b> → 이름 <code>업데이트 끝</code> → <b>OK</b>(자세한 건 레슨 4).</p>
<ol><li>터미널에서 만들기 도구를 깔아요(아래 예제 첫 줄). Guest Additions 는 지금 커널에 맞춰 조금씩 컴파일되기 때문에 <code>gcc</code>·<code>make</code>·커널 헤더(<code>linux-headers-$(uname -r)</code>)가 필요해요.</li><li>VM 창 위 메뉴 <b>Devices</b> → <b>Insert Guest Additions CD Image</b>. 우분투 왼쪽 Dock 에 CD 모양이 생겨요(「자동 실행할까?」 창이 뜨면 <b>Cancel</b> — 아래 명령으로 할 거예요).</li><li>예제의 나머지 줄로 CD 안의 <code>VBoxLinuxAdditions.run</code> 을 관리자로 실행 → 끝나면 <code>sudo reboot</code>.</li><li>다시 켜지면 VM 창 크기를 마우스로 바꿔 봐요. 우분투 화면이 따라 바뀌면 성공이에요(안 되면 VM 창 메뉴 <b>View</b> → <b>Auto-resize Guest Display</b> 가 켜져 있는지).</li><li>클립보드: VM 창 메뉴 <b>Devices</b> → <b>Shared Clipboard</b> → <b>Bidirectional</b>(양방향). 기본은 Disabled(꺼짐)예요.</li></ol>
<p class="muted small">CD 폴더 이름(<code>VBox_GAs_7.2.22</code>)의 숫자는 내 VirtualBox 판이에요. 그래서 예제는 <code>VBox_GAs_*</code> 로 「무엇이든」 을 써요. 실행 중에 에러가 나면 마지막 몇 줄을 읽어 보고 <code>sudo rcvboxadd setup</code> 으로 다시 해 볼 수 있어요.</p>` + LX_DATE, example: { shell: 'sudo apt install -y build-essential linux-headers-$(uname -r)\ncd /media/$USER/VBox_GAs_*\nsudo sh ./VBoxLinuxAdditions.run\nsudo reboot' } },
    { title: '한글 입력: Settings → Keyboard → Input Sources → Add Input Source → Korean (Hangul)', html: `<p>영어로 설치했으니 한글 입력을 따로 켜요.</p>
<ol><li>왼쪽 아래 Show Apps → <b>Settings</b> → 왼쪽 목록 <b>Keyboard</b>.</li><li><b>Input Sources</b> 칸의 <b>+ Add Input Source…</b> → <b>Korean</b> → <b>Korean (Hangul)</b> → <b>Add</b>.</li><li>입력 소스 바꾸기는 <kbd>Super</kbd>+<kbd>Space</kbd>(<kbd>Super</kbd> = Windows 로고 키). 오른쪽 위에 <code>en</code> / <code>ko</code> 가 보여요.</li><li><code>ko</code> 상태에서 한글 ↔ 영어는 키보드의 <kbd>한/영</kbd> 키, 또는 <kbd>Shift</kbd>+<kbd>Space</kbd>.</li></ol>
<p><b>목록에 Korean (Hangul) 이 없으면</b> 한글 입력 엔진이 안 깔린 거예요. 아래 예제로 깔고 <b>로그아웃했다가 다시 로그인</b>(오른쪽 위 전원 → Log Out)한 뒤 2 를 다시 해요.</p>
<p class="muted small">Windows 의 <kbd>Win</kbd> 키는 VM 창 안에서는 우분투의 <kbd>Super</kbd> 키로 가요(VM 창이 키보드를 잡고 있을 때). 안 먹으면 VM 창을 한 번 클릭하고 다시 해 보세요.</p>` + LX_DATE, example: { shell: 'sudo apt install -y ibus-hangul' } },
  ],
  summary: ['Ctrl+Alt+T → sudo apt update && sudo apt upgrade (비밀번호는 안 보이는 게 정상)', 'Guest Additions: 스냅샷 → build-essential·헤더 → Insert Guest Additions CD Image → VBoxLinuxAdditions.run → 재부팅', 'Devices → Shared Clipboard → Bidirectional · Keyboard → Input Sources → Korean (Hangul)'] },

{ id: 'U4', ch: 1, n: 4, title: '스냅샷: 되돌릴 수 있는 연습', mode: 'text', tutorSummary: '스냅샷 = VM 의 그 순간 상태 사진. 켜진 VM 창: Machine → Take Snapshot. VirtualBox 관리 창: VM 고르기 → Snapshots → Take / Restore. 되돌리기는 VM 을 끈 뒤 Restore. 스냅샷은 디스크 공간을 먹으니 필요 없는 건 Delete.',
  pages: [
    { title: '스냅샷은 그 순간의 사진', html: `<p><b>스냅샷</b>은 VM 의 디스크(와 원하면 켜져 있던 상태까지)를 <b>그 순간 그대로</b> 저장해 두는 거예요. 게임의 「저장하기」 와 같아요. 실험이 꼬이면 그 시점으로 <b>되돌리기(Restore)</b> 하면 끝이에요.</p>
<pre class="code">깨끗한 설치 ──▶ 업데이트 끝 ──▶ 연습장 완성 ──▶ (지금)
   📷             📷              📷
                                   └─ 망가지면 「연습장 완성」 으로 Restore</pre>
<ul><li>스냅샷은 <b>나무 모양</b>으로 쌓여요. 되돌린 뒤 다른 실험을 하면 가지가 하나 더 생겨요.</li><li>스냅샷마다 그 뒤에 바뀐 부분을 따로 저장해서 <b>디스크 공간을 먹어요</b>. 필요 없어진 스냅샷은 <b>Delete</b> 로 정리해요(지워도 지금 상태는 그대로예요).</li><li>스냅샷은 <b>백업이 아니에요</b>. VM 파일 자체가 지워지거나 망가지면 스냅샷도 같이 없어져요. 정말 중요한 파일은 VM 밖(Windows)에도 두세요.</li></ul>` + LX_DATE },
    { title: '찍기: Machine → Take Snapshot · Snapshots → Take', html: `<p>찍는 곳은 두 군데예요.</p>
<table class="kb"><tbody><tr><td><b>VM 이 켜져 있을 때</b></td><td>VM 창 위 메뉴 <b>Machine</b> → <b>Take Snapshot</b> → 이름(예: <code>연습장 완성</code>)과 설명 → <b>OK</b></td></tr><tr><td><b>VirtualBox 관리 창에서</b></td><td>왼쪽 목록에서 <code>ubuntu-study</code> 를 고르고 → 오른쪽 위 탭 중 <b>Snapshots</b> → 도구 막대의 <b>Take</b> → 이름 → <b>OK</b></td></tr></tbody></table>
<p><b>꺼진 상태</b>에서 찍는 게 가장 깔끔해요(디스크만 저장돼서 작고 빨라요). 켜진 채로 찍으면 열려 있던 창·프로그램 상태까지 저장돼서 더 커요.</p>
<p>이름은 「무엇을 끝낸 상태인지」 로 지어요: <code>깨끗한 설치</code> · <code>업데이트 끝</code> · <code>Guest Additions</code> · <code>권한 실험 전</code>. 나중에 목록만 보고 고를 수 있게요.</p>` + LX_DATE },
    { title: '되돌리기: 끄고 → Snapshots → Restore', html: `<p>되돌리기는 <b>VM 을 끈 다음</b>에 해요.</p>
<ol><li>우분투 안에서 끄기(오른쪽 위 전원 → <b>Power Off</b>), 또는 터미널에서 <code>sudo poweroff</code>.</li><li>VirtualBox 관리 창 → <code>ubuntu-study</code> → <b>Snapshots</b> → 돌아갈 스냅샷을 골라 → 도구 막대의 <b>Restore</b>.</li><li>「지금 상태도 스냅샷으로 남길까요?」 같은 질문이 나오면, 지금 상태가 필요 없으면 체크를 끄고 <b>Restore</b>.</li><li><b>Start</b> 로 켜면 그 순간으로 돌아가 있어요.</li></ol>
<p>연습: 홈 폴더에 파일을 하나 만들고(아래 예제), 끄고, 그 파일이 없던 스냅샷으로 Restore 해 보세요. 다시 켜서 <code>ls ~/snap-test.txt</code> 를 치면 <code>No such file or directory</code> 가 나와요 — 파일이 생기기 전으로 돌아간 거예요.</p>` + LX_DATE, example: { shell: 'echo "스냅샷 연습" > ~/snap-test.txt\nls -l ~/snap-test.txt\nsudo poweroff' } },
  ],
  summary: ['스냅샷 = 그 순간의 저장, 되돌리기 = Restore (VM 을 끈 뒤)', '켜진 창: Machine → Take Snapshot · 관리 창: Snapshots → Take / Restore / Delete', '공간을 먹으니 정리하고, 백업 대신은 아님'] },

{ id: 'UB1', ch: 1, boss: true, title: '보스: 내 우분투 연습장 완성', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 1 종합. 업데이트 · Guest Additions(화면 크기·클립보드) · 한글 입력 · 스냅샷 두 개 · lsb_release -a 로 26.04 확인 · 거북이 없음.' },
// ================= 챕터 2 리눅스답게 쓰기 (다음 판) =================
{ id: 'U5', ch: 2, n: 5, draft: true, title: '같은 bash, 다른 집', mode: 'text', tutorSummary: 'Git Bash 와 같은 bash. 드라이브 글자 없음, /home/이름, 대소문자 구분, man·--help.', pages: TODO('Git Bash 와 같은 것·다른 것, /home, 대소문자, man·--help·which'), summary: [] },
{ id: 'U6', ch: 2, n: 6, draft: true, title: '리눅스 폴더 지도', mode: 'text', tutorSummary: '/ 아래 home·etc·var/log·usr/bin·tmp·dev·proc.', pages: TODO('/ 아래 폴더들, /etc/os-release, 「모든 게 파일」'), summary: [] },
{ id: 'U7', ch: 2, n: 7, draft: true, title: 'apt 로 프로그램 설치', mode: 'text', tutorSummary: 'apt update·upgrade·search·install·remove·show.', pages: TODO('패키지·저장소, apt update/upgrade/install/remove, 어셈블리 준비(build-essential·nasm·gdb)'), summary: [] },
{ id: 'U8', ch: 2, n: 8, draft: true, title: '사용자와 권한', mode: 'text', tutorSummary: 'whoami·id·ls -l 의 rwx·chmod·chown·sudo.', pages: TODO('whoami·id, rwx 읽기, chmod 글자·숫자, sudo'), summary: [] },
{ id: 'U9', ch: 2, n: 9, draft: true, title: '내가 만든 명령', mode: 'text', tutorSummary: '#!/bin/bash·chmod +x·PATH·~/bin·~/.bashrc·alias.', pages: TODO('셸 스크립트, PATH 와 ~/bin, .bashrc, alias'), summary: [] },
{ id: 'UB2', ch: 2, boss: true, draft: true, title: '보스: 내 도구 상자', mode: 'text', tutorSummary: '~/bin 명령 3개 + alias 2개.', pages: TODO('~/bin 에 명령 3개 + alias 2개 + 스냅샷'), summary: [] },
// ================= 챕터 3 시스템 들여다보기 (다음 판) =================
{ id: 'U10', ch: 3, n: 10, draft: true, title: '프로세스 보기와 멈추기', mode: 'text', tutorSummary: 'ps·htop·&·jobs·fg·Ctrl+C/Z·kill.', pages: TODO('ps aux·htop, 백그라운드, Ctrl+C·Ctrl+Z, kill'), summary: [] },
{ id: 'U11', ch: 3, n: 11, draft: true, title: '서비스와 로그', mode: 'text', tutorSummary: 'systemctl status/start/enable·journalctl.', pages: TODO('systemctl, journalctl, /var/log, openssh-server'), summary: [] },
{ id: 'U12', ch: 3, n: 12, draft: true, title: '디스크와 메모리', mode: 'text', tutorSummary: 'df -h·du -sh·free -h·lsblk.', pages: TODO('df·du·free·lsblk, 가상 디스크가 꽉 차면'), summary: [] },
{ id: 'U13', ch: 3, n: 13, draft: true, title: '네트워크와 SSH', mode: 'text', tutorSummary: 'ip a·ping·curl, NAT 포트 포워딩 2222→22, ssh, VS Code Remote-SSH.', pages: TODO('ip·ping·curl, 포트 포워딩, Windows 에서 ssh, VS Code Remote-SSH'), summary: [] },
{ id: 'U14', ch: 3, n: 14, draft: true, title: '예약 작업', mode: 'text', tutorSummary: 'crontab -e 다섯 칸·tar 백업·로그.', pages: TODO('cron 다섯 칸, tar 백업, cron 의 짧은 PATH'), summary: [] },
{ id: 'UB3', ch: 3, boss: true, draft: true, title: '보스: 스스로 돌아가는 VM', mode: 'text', tutorSummary: '백업 스크립트 + cron + 디스크 경고 + SSH 로 확인.', pages: TODO('백업 스크립트 + cron + 디스크 경고 + SSH'), summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
