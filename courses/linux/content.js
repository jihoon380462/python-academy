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
// ================= 챕터 2 리눅스답게 쓰기 =================
{ id: 'U5', ch: 2, n: 5, title: '같은 bash, 다른 집', mode: 'text', tutorSummary: '우분투 터미널도 Git Bash 와 같은 bash — 터미널 교과서 명령이 그대로. 다른 점: 드라이브 글자 없이 / 하나, 집은 /home/이름, 대소문자 구분, 줄 끝 LF. 모르는 명령은 man·--help, 명령의 정체는 type·which.',
  pages: [
    { title: '같은 것: 터미널 교과서의 명령 전부', html: `<p>우분투 터미널(<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>)도 Git Bash 와 같은 <b>bash</b> 예요. 터미널·Git 교과서에서 배운 명령은 <b>그대로</b> 돼요.</p>
<table class="kb"><tbody><tr><td><code>pwd</code> · <code>ls -la</code> · <code>cd</code></td><td>어디 · 무엇이 · 이동 — <a href="../terminal-git/#lesson/T1" target="_blank" rel="noopener">터미널 레슨 1 ↗</a></td></tr><tr><td><code>mkdir -p</code> · <code>cp -r</code> · <code>mv</code> · <code>rm -r</code></td><td>만들고 복사하고 옮기고 지우기 — <a href="../terminal-git/#lesson/T2" target="_blank" rel="noopener">레슨 2 ↗</a></td></tr><tr><td><code>cat</code> · <code>less</code> · <code>echo … &gt; 파일</code></td><td>파일 보기와 쓰기 — <a href="../terminal-git/#lesson/T3" target="_blank" rel="noopener">레슨 3 ↗</a></td></tr><tr><td><code>grep</code> · <code>find</code></td><td>찾기 — <a href="../terminal-git/#lesson/T4" target="_blank" rel="noopener">레슨 4 ↗</a></td></tr><tr><td><code>|</code> · <code>&gt;&gt;</code> · <code>&&</code></td><td>조합 — <a href="../terminal-git/#lesson/T5" target="_blank" rel="noopener">레슨 5 ↗</a></td></tr></tbody></table>
<p>이 교과서의 「만들어 보기」 는 <b>준비 명령</b>으로 연습 폴더(<code>~/linux-study/…</code>)를 처음 상태로 만든 뒤 시작해요. 준비 명령을 붙여 넣고, 문제의 명령을 치고, <b>확인 명령</b>의 결과가 「이렇게 나오면 성공」 과 같으면 완성이에요(터미널 교과서와 같은 방식).</p>` + LX_DATE, example: { shell: 'pwd\necho $HOME\nls -la ~' } },
    { title: '다른 것: / 하나 · /home/me · 대소문자 · 줄 끝', html: `<p>Git Bash 는 Windows 위에서 흉내 낸 bash 라서, 진짜 리눅스와 몇 가지가 달라요.</p>
<ul><li><b>드라이브 글자가 없어요.</b> Git Bash 의 <code>/c/Users/me</code> 같은 건 없고, 모든 게 <b>뿌리 <code>/</code> 하나</b> 아래에 있어요. 내 집(홈)은 <code>/home/me</code>(<code>me</code> 는 설치 때 정한 사용자 이름), 줄여서 <code>~</code>.</li><li><b>대소문자를 구분해요.</b> Windows 에서는 <code>Notes.txt</code> 와 <code>notes.txt</code> 가 같은 파일이지만, 리눅스에서는 <b>다른 두 파일</b>이에요. <code>cd documents</code> 는 <code>Documents</code> 폴더로 안 들어가요.</li><li><b>점(.)으로 시작하는 이름은 숨김 파일</b>이에요. <code>~/.bashrc</code> 처럼 설정 파일이 많아요 — <code>ls -a</code> 로 보여요.</li><li><b>줄 끝 글자가 달라요.</b> Windows 메모장은 줄 끝에 <code>\\r\\n</code>(CRLF), 리눅스는 <code>\\n</code>(LF)만 써요. Windows 에서 만든 스크립트를 우분투에서 돌리면 <code>bad interpreter: /bin/bash^M</code> 같은 에러가 나요(레슨 9). VS Code 오른쪽 아래의 <b>CRLF</b> 를 눌러 <b>LF</b> 로 바꾸면 돼요.</li></ul>` + LX_DATE, example: { shell: 'mkdir -p ~/linux-study/case && cd ~/linux-study/case\ntouch Notes.txt notes.txt\nls\ncd ~' } },
    { title: 'man · --help · type · which: 명령의 설명서와 정체', html: `<p>모르는 명령은 설명서를 봐요.</p>
<table class="kb"><tbody><tr><td><code>man ls</code></td><td>설명서(manual). 화살표·<kbd>Space</kbd> 로 넘기고, <kbd>/</kbd>+글자로 찾기, <kbd>q</kbd> 로 나오기</td></tr><tr><td><code>ls --help</code></td><td>짧은 도움말. 길면 <code>ls --help | less</code></td></tr><tr><td><code>type cd</code></td><td>그 이름이 무엇인지: <code>cd is a shell builtin</code>(bash 안에 들어 있는 명령)</td></tr><tr><td><code>type -t ls</code></td><td>한 단어로: <code>file</code>(디스크에 있는 프로그램) · <code>builtin</code> · <code>alias</code></td></tr><tr><td><code>which python3</code></td><td>그 프로그램 파일이 어디 있나: <code>/usr/bin/python3</code></td></tr></tbody></table>
<p>프로그램은 대부분 <code>/usr/bin</code> 에 있어요. 다음 레슨에서 이런 폴더들의 지도를 그려요.</p>` + LX_DATE, example: { shell: 'type cd\ntype -t ls\nwhich python3\nman ls' } },
  ],
  summary: ['우분투 터미널 = 같은 bash, 터미널 교과서 명령 그대로', '/ 하나 · 집은 /home/이름 · 대소문자 구분 · 숨김은 점(.) · 줄 끝 LF', 'man · --help 로 설명서, type · which 로 정체'] },

{ id: 'U6', ch: 2, n: 6, title: '리눅스 폴더 지도', mode: 'text', tutorSummary: '/ 아래: home(사람들 집) · root(관리자 집) · etc(설정) · var/log(기록) · usr/bin(프로그램) · tmp(임시) · media(CD·USB) · dev(장치) · proc(지금 도는 것). /etc/os-release 를 grep·cut 으로 읽기. 「모든 게 파일」: /proc/cpuinfo · /proc/meminfo · /dev/null.',
  pages: [
    { title: '/ 아래 큰 방들: home · etc · var/log · usr/bin · tmp', html: `<p><code>ls /</code> 를 치면 리눅스의 큰 방들이 보여요. 어느 우분투든 같은 자리에 같은 것이 있어요.</p>
<table class="kb"><tbody><tr><td><code>/home</code></td><td>사람들의 집. 내 집은 <code>/home/me</code> — 내 파일은 여기에만 둬요</td></tr><tr><td><code>/root</code></td><td>관리자(root)의 집</td></tr><tr><td><code>/etc</code></td><td><b>설정 파일</b>들(글자 파일). 시스템을 바꾸는 곳이라 고치려면 <code>sudo</code></td></tr><tr><td><code>/var/log</code></td><td><b>기록(로그)</b>. 무슨 일이 있었는지 남는 곳(레슨 11)</td></tr><tr><td><code>/usr/bin</code></td><td><b>프로그램</b>들. <code>ls</code> · <code>python3</code> · <code>git</code> 이 여기</td></tr><tr><td><code>/tmp</code></td><td>임시 파일. 다시 켜면 비워져요</td></tr><tr><td><code>/media</code></td><td>CD·USB 가 꽂히는 곳 — 레슨 3 의 Guest Additions CD 가 <code>/media/me/VBox_GAs_…</code> 였죠</td></tr><tr><td><code>/dev</code> · <code>/proc</code></td><td>장치 · 지금 돌고 있는 것(3쪽)</td></tr></tbody></table>
<p>Windows 와 비교하면 <code>C:\\Users</code> ≈ <code>/home</code>, <code>C:\\Program Files</code> ≈ <code>/usr/bin</code>·<code>/usr/lib</code>, 레지스트리 ≈ <code>/etc</code> 의 글자 파일들이에요.</p>` + LX_DATE, example: { shell: 'ls /\nls /etc | head\nls /usr/bin | wc -l' } },
    { title: '/etc/os-release 읽기: grep · cut · tr', html: `<p>설정 파일은 대부분 <b>사람이 읽을 수 있는 글자</b>예요. 이 우분투가 어떤 판인지 적힌 <code>/etc/os-release</code> 를 열어 봐요.</p>
<pre class="code">PRETTY_NAME="Ubuntu 26.04.1 LTS"
NAME="Ubuntu"
VERSION_ID="26.04"
VERSION_CODENAME=resolute
…</pre>
<p>한 줄만 뽑아서 값만 남기려면 명령을 이어 붙여요(터미널 교과서의 파이프).</p>
<ol><li><code>grep '^VERSION_ID=' /etc/os-release</code> — <code>^</code> 는 「줄 맨 앞」. → <code>VERSION_ID="26.04"</code></li><li><code>| cut -d= -f2</code> — <code>=</code> 로 나눈(<code>-d=</code>) 두 번째 칸(<code>-f2</code>). → <code>"26.04"</code></li><li><code>| tr -d '"'</code> — 따옴표 글자를 지우기(<code>-d</code>). → <code>26.04</code></li></ol>
<p>이렇게 「설정 파일 하나 → 필요한 줄 → 필요한 칸」 으로 좁히는 게 리눅스에서 정보를 꺼내는 기본 모양이에요.</p>` + LX_DATE, example: { shell: "cat /etc/os-release\ngrep '^VERSION_ID=' /etc/os-release | cut -d= -f2 | tr -d '\"'" } },
    { title: '「모든 게 파일」: /proc · /dev/null', html: `<p>리눅스는 장치나 지금 돌고 있는 상태까지 <b>파일처럼</b> 보여 줘요. 그래서 <code>cat</code> · <code>grep</code> 으로 다 읽을 수 있어요.</p>
<table class="kb"><tbody><tr><td><code>/proc/cpuinfo</code></td><td>CPU 정보. VM 에 준 4개가 보여요 — <code>nproc</code> 는 개수만</td></tr><tr><td><code>/proc/meminfo</code></td><td>메모리. <code>MemTotal</code> 이 VM 에 준 8GB 근처</td></tr><tr><td><code>/proc/uptime</code></td><td>켜진 지 몇 초</td></tr><tr><td><code>/dev/null</code></td><td>「버리는 곳」. <code>명령 2&gt;/dev/null</code> 은 에러 글자를 버리기</td></tr></tbody></table>
<p><code>/proc</code> 의 파일들은 디스크에 있는 게 아니라, 읽는 순간 커널이 만들어 주는 거예요. 운영체제 교과서에서 프로세스·메모리를 이 자리로 들여다봐요.</p>` + LX_DATE, example: { shell: 'nproc\ngrep "model name" /proc/cpuinfo | head -1\ngrep MemTotal /proc/meminfo\nls /nope 2>/dev/null' } },
  ],
  summary: ['/home 집 · /etc 설정 · /var/log 기록 · /usr/bin 프로그램 · /tmp 임시', '설정 파일 → grep 으로 줄 → cut·tr 로 칸', '/proc 는 지금 상태, /dev/null 은 버리는 곳'] },

{ id: 'U7', ch: 2, n: 7, title: 'apt 로 프로그램 설치', mode: 'text', tutorSummary: '패키지 = 프로그램 묶음, 저장소 = 우분투가 운영하는 프로그램 가게. sudo apt update(목록 새로) → apt search · show → sudo apt install · remove · autoremove. 어셈블리 준비: build-essential · nasm · gdb. 앱 센터는 snap 이라는 다른 가게. 설치 기록은 /var/log/apt/history.log.',
  pages: [
    { title: '패키지와 저장소: apt update 는 목록, upgrade 는 실제', html: `<p>Windows 는 프로그램마다 사이트에서 설치 파일을 받아요. 우분투는 <b>저장소</b>라는 공식 가게가 있고, <code>apt</code> 명령으로 거기서 <b>패키지</b>(프로그램 묶음)를 받아 설치해요. 가짜 설치 파일을 받을 걱정이 적고, 업데이트도 한 번에 돼요.</p>
<table class="kb"><tbody><tr><td><code>sudo apt update</code></td><td>가게의 <b>목록</b>만 새로 받기(아무것도 안 깔아요). 설치 전에 먼저</td></tr><tr><td><code>sudo apt upgrade</code></td><td>깔린 것들을 <b>실제로</b> 새 판으로</td></tr><tr><td><code>sudo apt install 이름</code></td><td>설치. 필요한 다른 패키지(의존성)도 같이 깔아요</td></tr></tbody></table>
<p>설치·삭제는 시스템을 바꾸는 일이라 <code>sudo</code> 가 필요하고, 찾기·보기는 그냥 돼요. 같은 시간에 다른 설치(업데이트 창 등)가 돌고 있으면 <code>Could not get lock</code> 이 나와요 — 잠깐 기다렸다 다시 해요.</p>` + LX_DATE, example: { shell: 'sudo apt update\napt list --upgradable' } },
    { title: 'apt search · show · install · remove · autoremove', html: `<table class="kb"><tbody><tr><td><code>apt search 낱말</code></td><td>이름·설명에 그 낱말이 있는 패키지 찾기</td></tr><tr><td><code>apt show 이름</code></td><td>설명 · 판(Version) · 크기 보기</td></tr><tr><td><code>sudo apt install -y 이름 이름2</code></td><td>여러 개 한 번에. <code>-y</code> 는 「계속할까요?」 에 미리 Yes</td></tr><tr><td><code>sudo apt remove 이름</code></td><td>지우기(설정 파일은 남김) · <code>purge</code> 는 설정까지</td></tr><tr><td><code>sudo apt autoremove</code></td><td>이제 아무도 안 쓰는 의존성 정리</td></tr><tr><td><code>apt list --installed | grep 낱말</code></td><td>깔린 것 중에서 찾기</td></tr></tbody></table>
<p>앞으로 쓸 것들을 미리 깔아요. <code>build-essential</code> 은 C 컴파일러 <code>gcc</code> 와 <code>make</code> 묶음, <code>nasm</code> 은 어셈블러, <code>gdb</code> 는 디버거 — 어셈블리어 교과서의 도구예요.</p>` + LX_DATE, example: { shell: 'apt search nasm\napt show nasm\nsudo apt install -y tree htop git build-essential nasm gdb\nnasm -v\ngcc --version | head -1' } },
    { title: 'snap 은 다른 가게 · 설치 기록 /var/log/apt/history.log', html: `<p>우분투의 <b>App Center</b>(앱 센터 — Dock 의 가방 모양)에서 설치하는 프로그램은 대부분 <b>snap</b> 이라는 다른 방식이에요. 프로그램이 필요한 걸 통째로 품고 와서 크고, 자동으로 업데이트돼요. Firefox 도 snap 이에요.</p>
<table class="kb"><tbody><tr><td><code>snap list</code></td><td>snap 으로 깔린 것</td></tr><tr><td><code>apt list --installed | wc -l</code></td><td>apt 로 깔린 것의 개수</td></tr></tbody></table>
<p>이 교과서는 터미널 도구를 <b>apt</b> 로 깔아요. 같은 프로그램을 두 가게에서 깔면 어느 쪽이 실행되는지 헷갈리니 하나로.</p>
<p>apt 는 무엇을 언제 깔았는지 <code>/var/log/apt/history.log</code> 에 적어 둬요. 실수로 무언가를 지웠을 때 여기서 확인해요.</p>` + LX_DATE, example: { shell: 'snap list\ngrep Commandline /var/log/apt/history.log | tail -3' } },
  ],
  summary: ['sudo apt update(목록) → sudo apt install 이름 / remove / autoremove', 'apt search · apt show 로 찾고 보기', 'App Center 는 snap, 설치 기록은 /var/log/apt/history.log'] },

{ id: 'U8', ch: 2, n: 8, title: '사용자와 권한', mode: 'text', tutorSummary: 'whoami·id·groups(sudo 그룹이면 관리자 명령 가능). ls -l 의 -rwxr-xr-x = 종류 + 나(u)·그룹(g)·남(o) × 읽기 r·쓰기 w·실행 x. chmod 글자(u+x, go-r)·숫자(r4 w2 x1 → 600·644·755). 폴더의 x = 들어가기. sudo = 그 명령만 root 로, chown 은 주인 바꾸기.',
  pages: [
    { title: 'whoami · id · groups: 나는 누구', html: `<p>리눅스는 처음부터 <b>여러 사람이 한 컴퓨터를 같이 쓰는</b> 걸 전제로 만들어졌어요. 그래서 모든 파일에 「주인」 과 「누가 무엇을 해도 되는지」 가 붙어 있어요.</p>
<table class="kb"><tbody><tr><td><code>whoami</code></td><td>지금 나의 사용자 이름 → <code>me</code></td></tr><tr><td><code>id</code></td><td>번호까지: <code>uid=1000(me) gid=1000(me) groups=1000(me),4(adm),27(sudo),…</code></td></tr><tr><td><code>groups</code></td><td>내가 속한 그룹들</td></tr></tbody></table>
<p>설치 때 만든 첫 사용자는 <b><code>sudo</code> 그룹</b>에 들어가 있어요. 그래서 <code>sudo</code> 로 관리자 명령을 쓸 수 있어요. 관리자 자신은 <b><code>root</code></b>(번호 0)라는 사용자예요.</p>` + LX_DATE, example: { shell: 'whoami\nid\ngroups' } },
    { title: 'ls -l 읽기: -rw-r--r-- = 나 · 그룹 · 남', html: `<p><code>ls -l</code> 의 맨 앞 10글자가 권한이에요.</p>
<pre class="code">-rw-r--r-- 1 me me  120 11월 7 10:00 note.txt
drwxr-xr-x 2 me me 4096 11월 7 10:00 photos</pre>
<p>맨 앞 10글자를 <b>1 + 3 + 3 + 3</b> 으로 끊어 읽어요. 셋째·넷째 칸(<code>me me</code>)은 주인과 그룹이에요.</p>
<table class="kb"><tbody><tr><td><code>-</code> / <code>d</code></td><td>종류 — <code>-</code> 파일 · <code>d</code> 폴더</td></tr><tr><td><code>rw-</code></td><td><b>나</b>(주인, u)의 권한</td></tr><tr><td><code>r--</code></td><td><b>그룹</b>(g)의 권한</td></tr><tr><td><code>r--</code></td><td><b>남</b>(그 밖의 모두, o)의 권한</td></tr></tbody></table>
<table class="kb"><tbody><tr><td><code>r</code></td><td>읽기(read) — 파일 내용 보기 · 폴더 목록 보기</td></tr><tr><td><code>w</code></td><td>쓰기(write) — 고치기 · 폴더 안에 만들고 지우기</td></tr><tr><td><code>x</code></td><td>실행(execute) — 프로그램으로 돌리기 · <b>폴더는 「들어가기」</b>(<code>cd</code>)</td></tr><tr><td><code>-</code></td><td>그 권한 없음</td></tr></tbody></table>
<p><code>-rw-r--r--</code> 는 「나는 읽고 쓰기, 그룹과 남은 읽기만」 이에요. 새 파일은 보통 이 모양(<code>644</code>), 새 폴더는 <code>drwxr-xr-x</code>(<code>755</code>)로 만들어져요.</p>` + LX_DATE, example: { shell: 'ls -l ~\nls -ld /etc /root' } },
    { title: 'chmod: u+x · go-r · 600 · 755', html: `<p>권한은 <code>chmod</code> 로 바꿔요. 두 가지로 쓸 수 있어요.</p>
<p><b>글자로</b>: 누구(<code>u</code> 나 · <code>g</code> 그룹 · <code>o</code> 남 · <code>a</code> 모두) + 더하기/빼기(<code>+</code> <code>-</code>) + 무엇(<code>r</code> <code>w</code> <code>x</code>).</p>
<pre class="code">chmod u+x run.sh      # 나에게 실행 권한 더하기
chmod go-r secret.txt # 그룹·남의 읽기 빼기</pre>
<p><b>숫자로</b>: <code>r</code>=4, <code>w</code>=2, <code>x</code>=1 을 더해서 나·그룹·남 세 자리.</p>
<table class="kb"><tbody><tr><td><code>600</code></td><td><code>rw-------</code> 나만 읽고 쓰기 — 비밀 메모 · SSH 키</td></tr><tr><td><code>644</code></td><td><code>rw-r--r--</code> 보통 파일</td></tr><tr><td><code>700</code></td><td><code>rwx------</code> 나만 들어가는 폴더</td></tr><tr><td><code>755</code></td><td><code>rwxr-xr-x</code> 보통 폴더 · 모두 실행할 수 있는 프로그램</td></tr></tbody></table>
<p>지금 숫자는 <code>stat -c '%a %n' 파일</code> 로 볼 수 있어요(<code>%a</code> 권한 숫자, <code>%n</code> 이름).</p>` + LX_DATE, example: { shell: "mkdir -p ~/linux-study/perm && cd ~/linux-study/perm\necho 비밀 > secret.txt\nstat -c '%a %n' secret.txt\nchmod 600 secret.txt\nls -l secret.txt\ncd ~" } },
    { title: 'sudo · chown · root: 관리자로 한 번만', html: `<p><code>sudo 명령</code> 은 「그 명령 하나만 root 로」 예요. 비밀번호는 내 비밀번호(설치 때 정한 것)이고, 몇 분 동안은 다시 안 물어요.</p>
<ul><li><code>/etc</code> 의 설정을 고치거나 프로그램을 깔 때만 <code>sudo</code>. 내 집(<code>~</code>) 안의 일에는 필요 없어요 — 거기서 <code>sudo</code> 로 파일을 만들면 주인이 <code>root</code> 가 돼서 나중에 내가 못 고쳐요.</li><li>그렇게 주인이 바뀐 파일은 <code>sudo chown me:me 파일</code> 로 되돌려요(<code>주인:그룹</code>). 폴더 통째로는 <code>-R</code>.</li><li><b>root 로 로그인해서 쓰지 않아요.</b> 실수 하나가 시스템 전체를 지울 수 있어서, 필요한 순간만 <code>sudo</code>.</li></ul>
<div class="bk-step-box"><b>그대로 치면 안 되는 것</b><br><code>sudo rm -rf /</code>(전부 지우기), <code>sudo chmod -R 777 /</code>(모두에게 모든 권한), 인터넷에서 본 <code>curl … | sudo bash</code>(모르는 스크립트를 관리자로 실행). 이 VM 은 스냅샷이 있으니 망가져도 되지만, 진짜 서버에서는 되돌릴 수 없어요.</div>` + LX_DATE, example: { shell: 'sudo touch ~/oops.txt\nls -l ~/oops.txt\nsudo chown $USER:$USER ~/oops.txt\nls -l ~/oops.txt\nrm ~/oops.txt' } },
  ],
  summary: ['whoami · id · groups — sudo 그룹이면 관리자 명령 가능', 'rwx × 나·그룹·남, 폴더의 x 는 들어가기', 'chmod u+x / 600 · 644 · 755, sudo 는 한 명령만, chown 으로 주인 되돌리기'] },

{ id: 'U9', ch: 2, n: 9, title: '내가 만든 명령', mode: 'text', tutorSummary: '셸 스크립트: 첫 줄 #!/bin/bash, chmod +x, ./이름 으로 실행($1 은 첫 인자). ./ 가 필요한 이유는 PATH. ~/bin 을 만들면 우분투 ~/.profile 이 다음 로그인부터 PATH 에 넣어 줌 — 바로 쓰려면 ~/.bashrc 에 export PATH="$HOME/bin:$PATH" + source. alias 이름=\'명령\' 도 ~/.bashrc 에. CRLF 면 bad interpreter.',
  pages: [
    { title: '셸 스크립트: #!/bin/bash · chmod +x · ./hello.sh', html: `<p>자주 치는 명령 여러 줄을 <b>파일 하나</b>에 적어 두면 한 번에 실행할 수 있어요. 이게 <b>셸 스크립트</b>예요.</p>
<pre class="code">#!/bin/bash
echo "안녕하세요, $1"
date +%F</pre>
<ul><li>첫 줄 <code>#!/bin/bash</code>(셔뱅)는 「이 파일은 bash 로 돌려 줘」 라는 표시예요.</li><li><code>$1</code> 은 실행할 때 붙인 <b>첫 번째 말</b>(인자). <code>./hello.sh 우분투</code> → <code>안녕하세요, 우분투</code>.</li><li>만든 파일은 실행 권한이 없어요(<code>644</code>). <code>chmod +x hello.sh</code> 로 붙여요.</li><li>실행은 <code>./hello.sh</code> — 「지금 폴더(<code>.</code>)의 hello.sh」. 왜 <code>./</code> 가 필요한지는 다음 쪽.</li></ul>
<p>Windows 에서 만든 파일이면 <code>/bin/bash^M: bad interpreter</code> 가 날 수 있어요. 줄 끝이 CRLF 라서예요(레슨 5) — 우분투에서 <code>sed -i 's/\\r$//' hello.sh</code> 로 고쳐요.</p>` + LX_DATE, example: { shell: "mkdir -p ~/linux-study/script && cd ~/linux-study/script\nprintf '#!/bin/bash\\necho \"안녕하세요, $1\"\\n' > hello.sh\nchmod +x hello.sh\n./hello.sh 우분투\ncd ~" } },
    { title: 'PATH 와 ~/bin: 어디서나 이름만으로', html: `<p><code>ls</code> 는 <code>./</code> 없이 되는데 내 스크립트는 왜 <code>./</code> 가 필요할까요? bash 는 이름만 친 명령을 <b><code>PATH</code> 에 적힌 폴더들에서만</b> 찾기 때문이에요.</p>
<pre class="code">echo $PATH
/home/me/.local/bin:/usr/local/bin:/usr/bin:/bin:…</pre>
<p><code>:</code> 로 나뉜 폴더를 앞에서부터 찾아요. 지금 폴더는 여기 없어서 <code>./</code> 를 붙여야 해요(남이 놓아 둔 같은 이름의 파일이 실수로 실행되지 않게 일부러 그래요).</p>
<p>내 명령을 어디서나 쓰려면 <b><code>~/bin</code></b> 폴더에 넣고 그 폴더를 PATH 에 더해요.</p>
<ol><li><code>mkdir -p ~/bin</code> 하고 스크립트를 거기로(<code>.sh</code> 를 빼고 명령 이름처럼 <code>~/bin/greet</code>).</li><li><code>~/.bashrc</code>(터미널을 열 때마다 읽는 설정) 맨 끝에 <code>export PATH="$HOME/bin:$PATH"</code> 한 줄.</li><li><code>source ~/.bashrc</code>(지금 창에 다시 읽히기) 또는 터미널을 새로 열기.</li></ol>
<p class="muted small">우분투의 <code>~/.profile</code> 은 <code>~/bin</code> 이 있으면 다음 <b>로그인</b>부터 알아서 PATH 에 넣어 줘요. 2 는 「지금 바로」 쓰려고 하는 거예요.</p>` + LX_DATE, example: { shell: 'echo $PATH\nmkdir -p ~/bin\ncp ~/linux-study/script/hello.sh ~/bin/greet\necho \'export PATH="$HOME/bin:$PATH"\' >> ~/.bashrc\nsource ~/.bashrc\ngreet 우분투\ntype -t greet' } },
    { title: "alias 이름='명령' 과 ~/.bashrc", html: `<p>짧은 별명은 스크립트까지 안 만들고 <b>alias</b> 로 해요.</p>
<pre class="code">alias up='sudo apt update && sudo apt upgrade -y'
alias ..='cd ..'</pre>
<ul><li>그냥 치면 <b>지금 창에서만</b> 살아 있어요. 계속 쓰려면 <code>~/.bashrc</code> 끝에 같은 줄을 적고 <code>source ~/.bashrc</code>.</li><li><code>alias</code> 만 치면 지금 있는 별명 목록이 나와요. 우분투는 처음부터 <code>ll</code>(= <code>ls -alF</code>) · <code>la</code> · <code>l</code> 을 넣어 둬요.</li><li><code>=</code> 앞뒤에 빈칸이 있으면 안 돼요(<code>alias up = …</code> 은 에러).</li><li>별명을 지우려면 <code>unalias up</code>, 영원히 지우려면 <code>~/.bashrc</code> 의 그 줄을 지워요.</li></ul>
<p><code>~/.bashrc</code> 를 고칠 때는 <code>&gt;&gt;</code>(끝에 덧붙이기)를 써요. <code>&gt;</code> 하나면 <b>파일 전체를 덮어써서</b> 우분투가 넣어 둔 설정이 사라져요. 겁나면 먼저 <code>cp ~/.bashrc ~/.bashrc.bak</code>.</p>` + LX_DATE, example: { shell: "cp ~/.bashrc ~/.bashrc.bak\necho \"alias up='sudo apt update && sudo apt upgrade -y'\" >> ~/.bashrc\nsource ~/.bashrc\nalias\ntype up" } },
  ],
  summary: ['#!/bin/bash · chmod +x · ./이름, $1 은 첫 인자', '이름만으로 실행 = PATH 의 폴더 → ~/bin + export PATH="$HOME/bin:$PATH"', "alias 이름='명령' 을 ~/.bashrc 에 (>> 로 덧붙이기) → source ~/.bashrc"] },

{ id: 'UB2', ch: 2, boss: true, title: '보스: 내 도구 상자', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 2 종합. ~/bin 에 명령 3개(bigfiles · mkday · diskuse) + ~/.bashrc 에 PATH 와 alias. 스냅샷 「도구 상자」.' },
// ================= 챕터 3 시스템 들여다보기 =================
{ id: 'U10', ch: 3, n: 10, title: '프로세스 보기와 멈추기', mode: 'text', tutorSummary: '프로세스 = 실행 중인 프로그램(번호 PID). ps aux · ps -ef · pgrep · htop(F9 kill · F10 나가기). 명령 & = 백그라운드, $! = 방금 띄운 PID, jobs · fg · bg, Ctrl+C(멈춤) · Ctrl+Z(잠깐 세움). kill PID(정중히 SIGTERM) → 안 되면 kill -9(SIGKILL).',
  pages: [
    { title: '프로세스와 PID: ps aux · pgrep · htop', html: `<p>프로그램이 실행되면 <b>프로세스</b>가 돼요. 리눅스는 프로세스마다 번호(<b>PID</b>)를 붙여요. 같은 프로그램을 두 번 켜면 프로세스도 둘, PID 도 둘이에요.</p>
<table class="kb"><tbody><tr><td><code>ps aux</code></td><td>모든 프로세스 목록. <code>USER</code>(누구) · <code>PID</code> · <code>%CPU</code> · <code>%MEM</code> · <code>COMMAND</code>(무엇)</td></tr><tr><td><code>ps aux | grep python3</code></td><td>그중 python3 만(맨 끝에 <code>grep</code> 자신도 한 줄 나와요)</td></tr><tr><td><code>pgrep -a python3</code></td><td>이름으로 찾아 PID 와 명령 줄만</td></tr><tr><td><code>htop</code></td><td>움직이는 표. 위는 CPU·메모리 막대, 아래는 프로세스. <kbd>F6</kbd> 정렬 · <kbd>F9</kbd> 멈추기 · <kbd>F10</kbd>(또는 <kbd>q</kbd>) 나가기</td></tr></tbody></table>
<p>PID 1 번은 <b>systemd</b> — 우분투가 켜질 때 커널이 가장 먼저 띄우고, 나머지를 전부 띄우는 「모든 프로세스의 부모」 예요(다음 레슨의 서비스도 systemd 가 관리해요). 설정 앱의 <b>Resources</b>(시스템 모니터)도 같은 정보를 그림으로 보여 줘요.</p>` + LX_DATE, example: { shell: 'ps aux | head -5\npgrep -a systemd | head -3\nhtop' } },
    { title: '& · jobs · fg · Ctrl+C · Ctrl+Z: 앞과 뒤', html: `<p>터미널에서 명령을 치면 끝날 때까지 터미널을 차지해요(<b>앞</b>). 끝에 <code>&</code> 를 붙이면 <b>뒤(백그라운드)</b>에서 돌고 터미널은 바로 돌아와요.</p>
<table class="kb"><tbody><tr><td><code>sleep 100 &</code></td><td>뒤에서 실행. <code>[1] 4321</code> = 작업 번호 1, PID 4321</td></tr><tr><td><code>echo $!</code></td><td>방금 뒤로 띄운 것의 PID</td></tr><tr><td><code>jobs</code></td><td>이 터미널이 띄운 작업 목록</td></tr><tr><td><code>fg</code> · <code>fg %1</code></td><td>작업을 다시 앞으로</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>앞의 것을 <b>멈추기</b>(끝내기)</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>Z</kbd> → <code>bg</code></td><td>앞의 것을 <b>잠깐 세우고</b>(Stopped) → 뒤에서 이어 돌리기</td></tr></tbody></table>
<p>터미널 창을 닫으면 거기서 띄운 작업도 대부분 같이 끝나요. 창을 닫아도 계속 돌아야 하는 건 다음 레슨의 <b>서비스</b>로 만들어요.</p>` + LX_DATE, example: { shell: 'sleep 100 &\necho $!\njobs\nfg' } },
    { title: 'kill PID · kill -9: 정중히, 안 되면 강제로', html: `<p>멈추지 않는 프로그램은 PID 를 찾아 <b>신호(시그널)</b>를 보내요.</p>
<table class="kb"><tbody><tr><td><code>kill 4321</code></td><td>「정리하고 끝내 줘」(SIGTERM). 프로그램이 파일을 저장하는 등 뒷정리를 할 기회가 있어요 — <b>먼저 이것</b></td></tr><tr><td><code>kill %1</code></td><td>작업 번호로(이 터미널에서 띄운 것)</td></tr><tr><td><code>kill -9 4321</code></td><td>「지금 당장」(SIGKILL). 뒷정리 없이 커널이 끊어요 — <b>마지막 수단</b></td></tr><tr><td><code>pkill -x 이름</code></td><td>이름이 정확히 같은 것 전부</td></tr></tbody></table>
<p>남의(다른 사용자·root 의) 프로세스는 <code>sudo</code> 가 있어야 멈출 수 있어요. 무엇인지 모르는 시스템 프로세스는 멈추지 마세요 — 화면이 꺼지거나 로그아웃될 수 있어요(그래도 이 VM 은 다시 켜면 돼요).</p>
<p>연습: 무한 반복 파이썬을 띄우고 <code>htop</code> 에서 CPU 를 잡아먹는 걸 본 다음 멈춰 봐요(아래 예제).</p>` + LX_DATE, example: { shell: 'python3 -c "while True: pass" &\npgrep -a python3\nkill $!\npgrep -a python3' } },
  ],
  summary: ['ps aux · pgrep -a · htop 으로 보기, PID 1 은 systemd', '& 뒤로 · jobs · fg · Ctrl+C 멈춤 · Ctrl+Z 잠깐 세움', 'kill PID 먼저, 안 되면 kill -9'] },

{ id: 'U11', ch: 3, n: 11, title: '서비스와 로그', mode: 'text', tutorSummary: '서비스 = systemd 가 관리하는 늘 켜진 프로그램. systemctl status · start · stop · restart · enable · disable(--now). openssh-server 설치 → 우분투는 ssh.socket 이 22번에서 기다리다 접속이 오면 ssh.service 를 켬. 로그: journalctl -u 이름 · -f · -b -p err · --since, 옛 방식 /var/log.',
  pages: [
    { title: '서비스와 systemctl status · start · stop · enable', html: `<p><b>서비스</b>는 창 없이 뒤에서 <b>늘 켜져 있는</b> 프로그램이에요(Windows 의 「서비스」 와 같은 뜻). 우분투에서는 PID 1 의 <b>systemd</b> 가 서비스를 켜고, 죽으면 다시 켜고, 부팅 때 자동으로 띄워요.</p>
<table class="kb"><tbody><tr><td><code>systemctl status cups</code></td><td>상태 보기(<code>q</code> 로 나오기). 초록 <code>active (running)</code> = 돌고 있음</td></tr><tr><td><code>sudo systemctl stop cups</code> · <code>start</code> · <code>restart</code></td><td>지금 끄기 · 켜기 · 다시 켜기</td></tr><tr><td><code>sudo systemctl enable cups</code> · <code>disable</code></td><td>부팅 때 <b>자동으로</b> 켤지 말지(지금 상태는 안 바뀜)</td></tr><tr><td><code>sudo systemctl disable --now cups</code></td><td>자동 끄기 + 지금도 끄기</td></tr><tr><td><code>systemctl list-units --type=service --state=running</code></td><td>지금 돌고 있는 서비스 전부</td></tr></tbody></table>
<p><code>cups</code> 는 프린터 서비스예요. VM 에서는 프린터를 안 쓰니 연습용으로 꺼 봐도 돼요(다시 <code>enable --now</code> 로 되돌려요).</p>` + LX_DATE, example: { shell: 'systemctl status cups\nsystemctl is-active cups\nsystemctl is-enabled cups\nsystemctl list-units --type=service --state=running | head' } },
    { title: 'openssh-server 설치와 ssh.socket', html: `<p>다음 레슨에서 Windows 에서 이 VM 으로 <b>SSH 접속</b>을 할 거예요. 그러려면 VM 안에 SSH <b>서버</b> 서비스가 있어야 해요.</p>
<pre class="code">sudo apt install -y openssh-server</pre>
<p>우분투의 SSH 서버는 조금 특별하게 켜져요. 처음부터 서버가 도는 게 아니라 <b><code>ssh.socket</code></b> 이 22번 문(포트)에서 <b>기다리다가</b>, 접속이 오면 그때 <b><code>ssh.service</code></b> 를 켜요(소켓 활성화 — 안 쓸 때 메모리를 아껴요).</p>
<table class="kb"><tbody><tr><td><code>systemctl status ssh.socket</code></td><td><code>active (listening)</code> 이면 준비 끝</td></tr><tr><td><code>systemctl status ssh</code></td><td>아직 아무도 안 들어왔으면 <code>inactive</code> 여도 <b>정상</b> — 접속하면 <code>active (running)</code></td></tr></tbody></table>
<p>VM 안에서 자기 자신에게 들어가 볼 수도 있어요: <code>ssh me@localhost</code> → 처음엔 <code>Are you sure you want to continue connecting (yes/no/[fingerprint])?</code> 에 <code>yes</code> → 비밀번호 → 나올 땐 <code>exit</code>.</p>` + LX_DATE, example: { shell: 'sudo apt install -y openssh-server\nsystemctl status ssh.socket\nssh $USER@localhost\nexit\nsystemctl status ssh' } },
    { title: 'journalctl -u · -f · -b -p err: 무슨 일이 있었나', html: `<p>서비스들이 남기는 기록(<b>로그</b>)은 systemd 의 <b>journal</b> 에 모여요. 문제가 생기면 제일 먼저 보는 곳이에요.</p>
<table class="kb"><tbody><tr><td><code>journalctl -u ssh</code></td><td>ssh 서비스의 기록만(<kbd>q</kbd> 로 나오기, <kbd>G</kbd> 맨 끝)</td></tr><tr><td><code>journalctl -u ssh -f</code></td><td>새 줄이 생길 때마다 따라 보기(follow) — <kbd>Ctrl</kbd>+<kbd>C</kbd> 로 그만</td></tr><tr><td><code>journalctl -b -p err</code></td><td>이번 부팅(<code>-b</code>) 뒤의 에러(<code>-p err</code>) 이상만</td></tr><tr><td><code>journalctl --since "10 min ago"</code></td><td>최근 10분</td></tr><tr><td><code>ls /var/log</code></td><td>옛날 방식의 글자 로그들(<code>apt/</code> · <code>auth.log</code> 등)</td></tr></tbody></table>
<p>연습: 터미널 두 개를 열어 하나에서 <code>journalctl -u ssh -f</code> 를 켜 두고, 다른 하나에서 <code>ssh $USER@localhost</code> 로 들어갔다 나와 보세요. 접속·로그아웃 기록이 실시간으로 올라와요.</p>` + LX_DATE, example: { shell: 'journalctl -u ssh --no-pager | tail -5\njournalctl -b -p err --no-pager | tail -5\nls /var/log' } },
  ],
  summary: ['서비스 = systemd 가 관리하는 늘 켜진 프로그램', 'systemctl status · start · stop · enable · disable --now', 'openssh-server: ssh.socket 이 기다리다 ssh.service 를 켬 · 로그는 journalctl -u · -f'] },

{ id: 'U12', ch: 3, n: 12, title: '디스크와 메모리', mode: 'text', tutorSummary: 'df -h(남은 공간, / 의 Use%) · du -sh *(어디가 큰가, sort -h) · free -h(available 이 실제 여유) · lsblk(디스크와 파티션). 스냅샷은 Windows 쪽 디스크를 먹음. 정리: apt autoremove · apt clean · journalctl --vacuum-size.',
  pages: [
    { title: 'df -h · du -sh: 남은 공간과 큰 폴더', html: `<table class="kb"><tbody><tr><td><code>df -h</code></td><td>디스크마다 크기·사용·남음·사용률. <code>-h</code> 는 사람이 읽기 좋게(G·M). 내 우분투는 <code>/</code> 줄을 봐요</td></tr><tr><td><code>df -h /</code></td><td><code>/</code> 하나만</td></tr><tr><td><code>du -sh 폴더</code></td><td>그 폴더 전체 크기(<code>-s</code> 합계)</td></tr><tr><td><code>du -sh * | sort -h</code></td><td>지금 폴더의 항목별 크기, 작은 것부터(<code>sort -h</code> 는 1K·2M·3G 를 알아봐요)</td></tr><tr><td><code>du -sk * | sort -rn | head -3</code></td><td>KB 숫자로, 큰 것부터 3개 — 뒤에 <code>| cut -f2</code> 를 붙이면 이름만(탭으로 나뉜 두 번째 칸)</td></tr></tbody></table>
<p>VM 디스크는 레슨 2 에서 40GB 로 만들었어요. <code>df -h /</code> 의 Size 가 40G 근처예요. 남은 공간이 10% 아래로 내려가면 업데이트가 실패하기 시작해요.</p>` + LX_DATE, example: { shell: 'df -h /\ncd ~ && du -sh * 2>/dev/null | sort -h\nsudo du -sh /var/log /usr' } },
    { title: 'free -h · lsblk: 메모리와 디스크 모양', html: `<pre class="code">               total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.1Gi       3.0Gi        50Mi       2.8Gi       5.4Gi
Swap:          3.8Gi          0B       3.8Gi</pre>
<ul><li><b>available</b> 이 「지금 더 쓸 수 있는 메모리」 예요. <code>free</code> 가 작아 보여도 괜찮아요 — 리눅스는 빈 메모리를 파일 캐시(<code>buff/cache</code>)로 써 두다가 필요하면 바로 내줘요.</li><li><b>Swap</b> 은 메모리가 모자랄 때 디스크를 대신 쓰는 곳이에요. Swap 의 used 가 계속 크면 VM 메모리가 부족한 거예요.</li></ul>
<p><code>lsblk</code> 는 디스크와 그 안의 조각(파티션)을 나무 모양으로 보여 줘요. <code>sda</code>(40G 가상 디스크) 아래 <code>sda1</code>·<code>sda2</code> … 와 <code>/</code>·<code>/boot/efi</code> 같은 자리가 보여요. 운영체제 교과서에서 파일 시스템을 볼 때 다시 써요.</p>` + LX_DATE, example: { shell: 'free -h\nlsblk\nlsblk -f' } },
    { title: '꽉 차면: 스냅샷 · apt autoremove · journalctl --vacuum-size', html: `<p>가상 디스크는 「쓴 만큼만 커지는」 파일(레슨 2)이라, VM 안에서 지워도 <b>Windows 쪽 파일은 줄어들지 않아요</b>. 그리고 <b>스냅샷마다</b> 그 뒤에 바뀐 부분이 Windows 디스크에 따로 쌓여요.</p>
<table class="kb"><tbody><tr><td><b>Windows 쪽이 찰 때</b></td><td>VirtualBox 관리 창 → Snapshots 에서 필요 없는 스냅샷을 <b>Delete</b></td></tr><tr><td><code>sudo apt autoremove</code></td><td>아무도 안 쓰는 패키지 정리(옛 커널 포함)</td></tr><tr><td><code>sudo apt clean</code></td><td>받아 둔 설치 파일(<code>/var/cache/apt</code>) 지우기</td></tr><tr><td><code>sudo journalctl --vacuum-size=100M</code></td><td>로그를 100MB 만 남기고 지우기</td></tr><tr><td><code>du -sh ~/* | sort -h</code></td><td>내 집에서 큰 것 찾기</td></tr></tbody></table>
<p>40GB 로 모자라면 VM 을 끄고 VirtualBox 의 <b>Media</b>(왼쪽 막대) 에서 디스크 크기를 늘릴 수 있지만, 우분투 안에서 파티션까지 늘려야 해서 이 교과서에서는 다루지 않아요 — 처음에 넉넉히 만드는 게 쉬워요.</p>` + LX_DATE, example: { shell: 'sudo apt autoremove -y\nsudo apt clean\nsudo journalctl --vacuum-size=100M\ndf -h /' } },
  ],
  summary: ['df -h / 로 남은 공간, du -sh * | sort -h 로 큰 것 찾기', 'free -h 는 available 을 보기, lsblk 는 디스크 모양', '찰 때: 스냅샷 Delete · apt autoremove · apt clean · journalctl --vacuum-size'] },

{ id: 'U13', ch: 3, n: 13, title: '네트워크와 SSH', mode: 'text', tutorSummary: 'ip a(VM 은 NAT 라 10.0.2.15) · ping -c 3 · curl -I. VirtualBox Settings → Network → Adapter 1(NAT) → Port Forwarding: Host IP 127.0.0.1 · Host Port 2222 · Guest Port 22. Windows 터미널: ssh -p 2222 me@127.0.0.1. ~/.ssh/config 의 Host ubuntu-study. VS Code Remote - SSH 로 VM 안 폴더 열기.',
  pages: [
    { title: 'ip a · ping · curl: VM 의 네트워크', html: `<table class="kb"><tbody><tr><td><code>ip a</code></td><td>내 네트워크 카드와 주소. <code>lo</code>(자기 자신 127.0.0.1)와 <code>enp0s3</code>(가상 랜) — 주소가 보통 <code>10.0.2.15</code></td></tr><tr><td><code>ping -c 3 ubuntu.com</code></td><td>상대가 대답하는지 3번(<code>-c</code> 없으면 <kbd>Ctrl</kbd>+<kbd>C</kbd> 까지 계속)</td></tr><tr><td><code>curl -I https://ubuntu.com</code></td><td>웹 페이지의 머리말만(<code>HTTP/2 200</code> 이면 OK) — 웹 교과서의 그 HTTP</td></tr></tbody></table>
<p>VirtualBox 의 기본 네트워크는 <b>NAT</b> 예요. VM 은 VirtualBox 가 만든 작은 가상 공유기 뒤에 있어서, 밖(인터넷)으로는 나갈 수 있지만 <b>밖에서 VM 으로는 바로 못 들어와요</b>. 집 공유기 뒤의 PC 와 같은 모양이에요.</p>
<pre class="code">인터넷 ── Windows(호스트) ── [VirtualBox NAT] ── VM 10.0.2.15
                     ▲ 2222                        ▲ 22
                     └──── 포트 포워딩 ────────────┘</pre>
<p>그래서 Windows 에서 VM 의 SSH(22번)로 들어가려면 「Windows 의 2222번으로 오는 걸 VM 의 22번으로 넘겨 줘」 라는 <b>포트 포워딩</b>을 걸어요.</p>` + LX_DATE, example: { shell: 'ip a\nping -c 3 ubuntu.com\ncurl -I https://ubuntu.com' } },
    { title: 'Settings → Network → Port Forwarding: 127.0.0.1 · 2222 → 22', html: `<p>VM 이 켜져 있어도 돼요. VirtualBox 관리 창에서:</p>
<ol><li><code>ubuntu-study</code> → <b>Settings</b> → <b>Network</b> → <b>Adapter 1</b> 탭.</li><li><b>Attached to</b> 가 <b>NAT</b> 인지 확인 → 아래 <b>Advanced</b> 를 펼치면 <b>Port Forwarding</b> 버튼.</li><li>오른쪽의 <b>+</b>(규칙 더하기)로 한 줄:</li></ol>
<table class="kb"><tbody><tr><td><b>Name</b></td><td><code>ssh</code></td></tr><tr><td><b>Protocol</b></td><td><code>TCP</code></td></tr><tr><td><b>Host IP</b></td><td><code>127.0.0.1</code> — 내 PC 안에서만 접속되게(비우면 같은 와이파이의 다른 기기도 시도할 수 있어요)</td></tr><tr><td><b>Host Port</b></td><td><code>2222</code></td></tr><tr><td><b>Guest IP</b></td><td>비워 둠</td></tr><tr><td><b>Guest Port</b></td><td><code>22</code></td></tr></tbody></table>
<p><b>OK</b> → <b>OK</b>. 이제 Windows 의 <b>터미널</b>(PowerShell — Windows 11 에는 ssh 가 들어 있어요)에서:</p>
<pre class="code">ssh -p 2222 me@127.0.0.1</pre>
<p>처음엔 <code>Are you sure you want to continue connecting (yes/no/[fingerprint])?</code> 에 <code>yes</code>, 그다음 우분투 비밀번호. 프롬프트가 <code>me@ubuntu-study:~$</code> 로 바뀌면 Windows 창에서 VM 을 쓰고 있는 거예요. 나올 땐 <code>exit</code>.</p>` + LX_DATE },
    { title: '~/.ssh/config · 키로 로그인: ssh ubuntu-study', html: `<p>매번 <code>-p 2222 me@127.0.0.1</code> 을 치기 번거로우니 Windows 쪽에 <b>별명</b>을 적어 둬요. 파일은 <code>C:\\Users\\내이름\\.ssh\\config</code>(확장자 없음 — 메모장으로 만들 때 「모든 파일」 로 저장).</p>
<pre class="code">Host ubuntu-study
    HostName 127.0.0.1
    Port 2222
    User me</pre>
<p>이제 <code>ssh ubuntu-study</code> 만 치면 돼요.</p>
<p>비밀번호 대신 <b>키</b>로 들어가게 하려면(GitHub 교과서의 SSH 키와 같은 원리) Windows 터미널에서:</p>
<ol><li><code>ssh-keygen -t ed25519</code> → 물음에 <kbd>Enter</kbd> 몇 번 → <code>C:\\Users\\내이름\\.ssh\\id_ed25519.pub</code>(공개 키)가 생겨요.</li><li>공개 키를 VM 의 <code>~/.ssh/authorized_keys</code> 끝에 붙여요(Windows 에는 <code>ssh-copy-id</code> 가 없어서 한 줄로):<br><code>type $env:USERPROFILE\\.ssh\\id_ed25519.pub | ssh ubuntu-study "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat &gt;&gt; ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"</code></li><li>다시 <code>ssh ubuntu-study</code> — 비밀번호를 안 물으면 성공.</li></ol>
<p><code>~/.ssh</code> 는 <code>700</code>, <code>authorized_keys</code> 는 <code>600</code> 이어야 해요(레슨 8). 남이 쓸 수 있으면 SSH 가 키를 믿지 않아요.</p>` + LX_DATE },
    { title: 'VS Code → Remote - SSH: VM 안의 폴더를 Windows 에서', html: `<p>이제 <b>Windows 의 VS Code</b> 로 <b>VM 안의 파일</b>을 직접 고치고, VS Code 안의 터미널은 VM 의 bash 가 되게 할 수 있어요. 운영체제·어셈블리어 교과서는 이 방식으로 해요(Windows 에서 편하게 쓰고, 실행은 우분투에서).</p>
<ol><li>Windows 의 VS Code → 왼쪽 <b>Extensions</b>(네모 4개) → <code>Remote - SSH</code> 검색 → Microsoft 것을 <b>Install</b>.</li><li><kbd>F1</kbd> → <b>Remote-SSH: Connect to Host...</b> → 목록의 <code>ubuntu-study</code>(앞 쪽의 config 덕분) 고르기.</li><li>새 창이 열리고 플랫폼을 물으면 <b>Linux</b>. 처음엔 VM 안에 VS Code 서버를 설치하느라 1~2분 걸려요.</li><li>왼쪽 아래가 초록(파란) 칸에 <b>SSH: ubuntu-study</b> 로 바뀌면 연결된 거예요.</li><li><b>File</b> → <b>Open Folder…</b> → <code>/home/me/linux-study</code> → <b>OK</b>.</li><li><b>Terminal</b> → <b>New Terminal</b> — 프롬프트가 <code>me@ubuntu-study</code> 면 VM 안이에요.</li></ol>
<p>여기서 저장하는 파일은 <b>VM 안에</b> 저장되고, 줄 끝도 자동으로 LF 예요(레슨 5 의 CRLF 걱정이 없어요). 연결을 끊으려면 왼쪽 아래 초록 칸 → <b>Close Remote Connection</b>.</p>` + LX_DATE },
  ],
  summary: ['ip a · ping -c 3 · curl -I, VM 은 NAT 뒤(10.0.2.15)', 'Port Forwarding: Host IP 127.0.0.1 · 2222 → Guest 22 → ssh -p 2222 me@127.0.0.1', '~/.ssh/config 의 Host 별명 + 키 로그인 → VS Code Remote - SSH'] },

{ id: 'U14', ch: 3, n: 14, title: '예약 작업', mode: 'text', tutorSummary: 'cron: crontab -e(처음엔 편집기 nano 고르기) · crontab -l. 다섯 칸 = 분 시 일 월 요일(*/5 = 5분마다). 명령은 ~/bin 스크립트로 — cron 의 PATH 는 짧고 % 는 특수 글자. 출력은 >> 로그 2>&1. 백업은 tar -czf 묶음.tar.gz -C 기준 폴더, 확인은 tar -tzf.',
  pages: [
    { title: 'tar -czf: 폴더를 묶음 파일 하나로', html: `<p>백업은 보통 폴더를 <b>묶음 파일 하나</b>로 만들어 다른 곳에 두는 거예요. 리눅스의 기본 도구는 <code>tar</code> 예요(Windows 의 zip 과 비슷).</p>
<table class="kb"><tbody><tr><td><code>tar -czf 묶음.tar.gz 폴더</code></td><td>만들기: <code>c</code>(create) <code>z</code>(gzip 으로 압축) <code>f</code>(파일 이름은 다음 말)</td></tr><tr><td><code>tar -czf ~/backup/notes.tar.gz -C ~ notes</code></td><td><code>-C ~</code> = 「집으로 가서」 <code>notes</code> 를 묶기 — 묶음 안 경로가 <code>notes/…</code> 로 깔끔해요</td></tr><tr><td><code>tar -tzf 묶음.tar.gz</code></td><td>안에 무엇이 있나 목록(<code>t</code>)</td></tr><tr><td><code>tar -xzf 묶음.tar.gz -C 어디</code></td><td>풀기(<code>x</code>)</td></tr></tbody></table>
<p>날짜를 이름에 넣으면 여러 개를 쌓을 수 있어요: <code>notes-$(date +%F).tar.gz</code> → <code>notes-2026-11-07.tar.gz</code>.</p>` + LX_DATE, example: { shell: 'mkdir -p ~/notes ~/backup\necho "할 일" > ~/notes/todo.txt\ntar -czf ~/backup/notes-$(date +%F).tar.gz -C ~ notes\nls ~/backup\ntar -tzf ~/backup/notes-*.tar.gz' } },
    { title: 'crontab -e: 분 시 일 월 요일', html: `<p><b>cron</b> 은 「정해진 시각마다 명령 실행」 을 맡는 서비스예요. 내 예약표는 <code>crontab -e</code> 로 고쳐요(처음엔 편집기를 물어요 — <code>1</code>(nano)이 가장 쉬워요. 저장 <kbd>Ctrl</kbd>+<kbd>O</kbd> → <kbd>Enter</kbd>, 나가기 <kbd>Ctrl</kbd>+<kbd>X</kbd>).</p>
<pre class="code"># 분  시  일  월  요일  명령
  */5  *   *   *   *     /home/me/bin/backup-notes >> /home/me/backup/cron.log 2>&1
  30   2   *   *   *     /home/me/bin/backup-notes     ← 매일 새벽 2시 30분
  0    9   *   *   1-5   …                            ← 평일 아침 9시</pre>
<ul><li><code>*</code> 는 「아무 때나(전부)」, <code>*/5</code> 는 「5마다」, <code>1-5</code> 는 범위(요일 0·7=일, 1=월 … 5=금).</li><li><code>crontab -l</code> 로 지금 예약표 보기. 지우려면 <code>crontab -e</code> 에서 그 줄을 지우기.</li><li>VM 이 꺼져 있던 시각의 작업은 건너뛰어요(켜진 뒤 몰아서 하지 않아요).</li></ul>` + LX_DATE },
    { title: 'cron 의 함정: 짧은 PATH · % · 출력은 로그로', html: `<p>터미널에서 잘 되던 명령이 cron 에서는 조용히 안 되는 일이 흔해요. 이유는 셋이에요.</p>
<ol><li><b>PATH 가 짧아요</b>(<code>/usr/bin:/bin</code> 정도). <code>~/bin</code> 의 내 명령이나 <code>~</code> 도 모를 수 있어요 → 예약표에는 <b>전체 경로</b>(<code>/home/me/bin/backup-notes</code>)를 써요.</li><li><b><code>%</code> 는 cron 의 특수 글자</b>예요(줄바꿈으로 바뀌어요). <code>date +%F</code> 를 예약표에 그대로 쓰면 깨져요 → 날짜가 들어가는 일은 <b>스크립트 안에</b> 넣고, 예약표에는 스크립트 이름만.</li><li><b>출력이 화면에 안 나와요.</b> 에러를 보려면 <code>&gt;&gt; 로그파일 2&gt;&amp;1</code> 로 출력과 에러(<code>2</code>)를 같은 로그에 덧붙여요.</li></ol>
<p>그래서 모양은 늘 같아요: <b>「스크립트 하나(~/bin) + 예약표 한 줄(전체 경로 + 로그)」</b>. 잘 도는지는 로그(<code>tail ~/backup/cron.log</code>)와 <code>journalctl -u cron</code> 으로 봐요.</p>` + LX_DATE, example: { shell: "crontab -l\njournalctl -u cron --no-pager | tail -5" } },
  ],
  summary: ['tar -czf 묶음.tar.gz -C 기준 폴더 · tar -tzf 로 확인', 'crontab -e: 분 시 일 월 요일 + 명령, crontab -l 로 보기', '예약표엔 스크립트 전체 경로 + >> 로그 2>&1 (PATH 짧음 · % 특수)'] },

{ id: 'UB3', ch: 3, boss: true, title: '보스: 스스로 돌아가는 VM', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 3 종합. ~/bin/nightly: notes 백업 + 디스크 사용률이 LIMIT(기본 90) 이상이면 경고를 로그에. cron 매일 + Windows 에서 SSH 로 로그 확인.' },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
