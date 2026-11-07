// courses/linux/book.js — 「리눅스 교과서」 데이터 (v2.21.0, 설계 specs/linux-course.md · 결정 TODO D13). 화면은 core/ui-views-book.js(다른 교과서와 같은 틀).
// 연습: 사용자의 Windows PC 의 VirtualBox 7.2 + 그 안의 Ubuntu Desktop 26.04 LTS.
// tasks 두 종류(check_book 의 BOOK.check === 'linux' — GitHub 교과서와 같은 방식):
//   ① 화면에서 하는 것(VirtualBox·설치·설정·apt·systemctl) — noRun: true + checks(「내 화면에서 확인할 것」 ☐) + answer(단계). 자동 검사 불가 → checks 가 없으면 check_book 실패
//   ② 파일·권한·스크립트 명령(챕터 2부터) — setup + answer + check → bash 실행 결과를 io[0].output 과 비교
const BOOK = {
  check: 'linux',
  meta: {
    prereq: [
      { lessons: ['U1'], chapters: [1], ref: 'U1/0', btn: '레슨 1 · 가상화 확인 보기',
        title: '먼저 꼭! CPU 가상화가 켜져 있어야 해요',
        html: '<b>작업 관리자(Ctrl+Shift+Esc) → 성능 → CPU → 오른쪽 아래 「가상화: 사용」</b>. 「사용 안 함」 이면 BIOS 의 Intel <b>VT-x</b> / AMD <b>SVM Mode</b> 를 켜야 VM 이 돌아요. VM 창 오른쪽 아래에 🐢 거북이가 보이면 레슨 1 의 3쪽.' },
      { lessons: ['U2'],
        title: '메모리 6GB 이상 · 디스크 40GB 여유 — 「디스크 지우기」 는 가상 디스크만',
        html: '우분투 26.04 데스크톱의 공식 최소는 <b>메모리 6GB · 디스크 25GB</b>예요. 이 교과서는 VM 에 <b>8GB · 40GB</b> 를 줘요 — PC 메모리가 16GB 이상이면 편해요(PC 메모리의 절반을 넘기지 않기). 설치 화면의 <b>Erase disk and install Ubuntu</b> 가 지우는 건 방금 만든 <b>빈 가상 디스크</b>(VirtualBox VMs 폴더의 파일)예요 — Windows 디스크는 안 건드려요. 단 <b>VM 창 안에서</b> 하는지 꼭 확인.' },
      { lessons: ['U4', 'UB1'], chapters: [2, 3], ref: 'U4/1', btn: '레슨 4 · 스냅샷 찍기 보기',
        title: '위험한 실험 전에는 스냅샷',
        html: '권한·서비스·시스템 파일을 만지기 전에 <b>Machine → Take Snapshot</b>. 꼬이면 VM 을 끄고 <b>Snapshots → Restore</b> 로 1분 만에 원래대로예요.' },
    ],
    kicker: '🐧 리눅스 교과서', hero: '내 PC 안에 망가져도 되는 우분투를 만들고, 리눅스답게 써 보기',
    heroP: 'Windows 위에 <b>VirtualBox</b> 를 깔고 그 안에 <b>Ubuntu 26.04 LTS</b> 를 설치해요. 실수해도 <b>스냅샷</b>으로 1분 만에 되돌릴 수 있는 연습장이에요. 여기서 익힌 우분투가 앞으로 운영체제·어셈블리어 교과서의 연습장이 돼요. 레슨 끝 「만들어 보기」 의 ☐ 목록을 내 화면에서 확인하면 완성이에요.',
    dexName: '리눅스 도감', dexShort: '도감', dexWhat: '화면·명령', dexHint: '「스냅샷」「가상화」 처럼 한국어로도 찾기',
    dexExamples: '<code>apt</code>, <code>스냅샷</code>, <code>Guest Additions</code>, <code>가상화</code>', dexPlaceholder: '🔍 찾기 — apt, 스냅샷, 클립보드, 가상화 …', dexAlt: '「설치 프로그램」 대신 <code>apt</code>',
    dexDocs: 'VirtualBox 매뉴얼 <a href="https://www.virtualbox.org/manual/" target="_blank" rel="noopener">virtualbox.org/manual</a> · 우분투 문서 <a href="https://documentation.ubuntu.com/desktop/" target="_blank" rel="noopener">documentation.ubuntu.com</a>',
    dexRun: '명령은 📋 복사해서 우분투 터미널(Ctrl+Alt+T)에 붙여 넣을 수 있고', builtinsName: '우분투 · 자주 쓰는 것', builtinsSub: '터미널·VirtualBox 어디서나', builtinsChip: '⌨ 자주 쓰는 것',
    copyToast: '📋 복사했어요. 우분투 터미널에서 Ctrl+Shift+V 로 붙여 넣어요(클립보드 공유를 켠 뒤 — 레슨 3)', exampleLabel: '예제 명령 — 우분투 터미널(Ctrl+Alt+T)에서',
    makeIntro: '<b>VirtualBox</b> 창과 이 사이트를 나란히 두고 해요(시작하기 3쪽). 「내 화면에서 확인할 것」 ☐ 을 하나씩 확인하면 완성이에요.',
    makeTail: '막히면 「필요한 화면·명령」 을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 화면 글자가 조금 다르면 같은 자리의 비슷한 글자를 찾으세요(VirtualBox·우분투는 판마다 화면을 다듬어요).',
    fileExt: '', setupLabel: '준비 명령 — 우분투 터미널에 붙여 넣기', answerLabel: '예시 답', needsLabel: '필요한 화면·명령',
    checkLabel: '확인 명령', outLabel: '이렇게 나오면 성공', inLabel: '입력', checksLabel: '내 화면에서 확인할 것',
    homeNote: '<code>/home/me</code> 의 <code>me</code> 자리는 설치 때 정한 내 우분투 사용자 이름이에요',
  },
  setup: {
    title: '시작하기: 우분투 연습장을 만들 준비',
    pages: [
      { title: '1. 준비물: 내 PC 가 VM 을 돌릴 수 있나', html: `<p>이 교과서는 <b>Windows 10/11 (64비트)</b> PC 하나로 해요. 아래를 확인해요(확인하는 화면은 레슨 0·1 에 자세히 있어요).</p>
<table class="kb"><tbody><tr><td><b>메모리</b></td><td><b>16GB 이상</b>이면 편해요. VM 에 8GB 를 주고도 Windows 가 넉넉해요. 8GB PC 라면 VM 에 6GB 가 한계라 느릴 수 있어요</td></tr><tr><td><b>디스크</b></td><td>C 드라이브(또는 VM 을 둘 드라이브)에 <b>여유 40GB 이상</b> + ISO 몇 GB</td></tr><tr><td><b>CPU 가상화</b></td><td>작업 관리자 → 성능 → CPU → <b>가상화: 사용</b>(레슨 1)</td></tr><tr><td><b>인터넷</b></td><td>ISO 와 업데이트를 받아요</td></tr><tr><td><b>시간</b></td><td>설치까지 처음 한 번 1시간쯤 — 레슨 2 는 시간 날 때 한 번에</td></tr></tbody></table>` },
      { title: '2. 명령 줄이 처음이면: 터미널·Git 교과서 먼저', html: `<p>우분투 터미널도 Git Bash 와 같은 <b>bash</b> 예요. <code>pwd</code> · <code>ls</code> · <code>cd</code> · <code>mkdir</code> · <code>cp</code> · <code>mv</code> · <code>rm</code> · <code>cat</code> · <code>grep</code> · 파이프(<code>|</code>)는 이 교과서가 다시 가르치지 않아요.</p>
<div class="bk-step-box"><b>터미널·Git 교과서 명령어 편(레슨 0~5)</b><br>처음이면 먼저 보고 오세요 — <a href="../terminal-git/#lesson/T0" target="_blank" rel="noopener">터미널·Git 교과서 레슨 0 ↗</a>(새 탭으로 열려요 — 이 화면은 그대로 있어요). 챕터 1(설치)은 명령을 몰라도 할 수 있어요. 명령은 챕터 2 부터 많이 써요.</div>` },
      { title: '3. 창 나란히: Win+← / Win+→', html: `<p>VirtualBox 창과 이 사이트를 <b>반씩</b> 두고 해요.</p>
<ol><li>이 사이트 창을 클릭 → <kbd>Win</kbd>+<kbd>←</kbd> (왼쪽 절반)</li><li>VirtualBox 창을 클릭 → <kbd>Win</kbd>+<kbd>→</kbd> (오른쪽 절반)</li></ol>
<p>VM 창 안을 클릭하면 키보드·마우스가 우분투로 들어가요. 빠져나올 땐 <b>오른쪽 <kbd>Ctrl</kbd></b>(Host 키). 폰으로 이 사이트를 보면서 PC 로 해도 좋아요.</p>
<div class="bk-step-box"><b>예제 명령 복사</b><br>레슨의 예제 명령은 📋 로 복사할 수 있어요. 우분투 터미널에 붙이려면 <b>클립보드 공유</b>(레슨 3)를 먼저 켜고 <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>. 그 전에는 보고 직접 쳐요.</div>` },
    ],
  },
  builtins: [
    { name: 'Ctrl+Alt+T', desc: '우분투 터미널 열기.', code: 'Ctrl+Alt+T', ref: 'U3/0' },
    { name: 'Ctrl+Shift+C · Ctrl+Shift+V', desc: '터미널에서 복사 · 붙여넣기(그냥 Ctrl+C 는 명령 멈추기).', code: 'Ctrl+Shift+V', ref: 'U3/0' },
    { name: 'sudo apt update && sudo apt upgrade', desc: '프로그램 목록 새로 받기 + 깔린 것 새 판으로. 비밀번호는 화면에 안 보여요.', code: 'sudo apt update && sudo apt upgrade -y', ref: 'U3/0' },
    { name: 'lsb_release -a', desc: '우분투 판 보기(Release: 26.04).', code: 'lsb_release -a', ref: 'U3/0' },
    { name: 'uname -r', desc: '지금 리눅스 커널 판(7.0…).', code: 'uname -r', ref: 'U3/0' },
    { name: 'sudo reboot · sudo poweroff', desc: '다시 시작 · 끄기. VM 은 창을 닫지 말고 우분투 안에서 끄기.', code: 'sudo poweroff', ref: 'U4/2' },
    { name: '오른쪽 Ctrl (Host 키)', desc: 'VM 창에 갇힌 마우스·키보드를 Windows 로 빼기.', code: '오른쪽 Ctrl', ref: 'U0/2' },
    { name: 'Machine → Take Snapshot', desc: '켜진 VM 창에서 스냅샷 찍기.', code: 'Machine → Take Snapshot', ref: 'U4/1' },
    { name: 'Snapshots → Take · Restore · Delete', desc: 'VirtualBox 관리 창에서 스냅샷 찍기 · 되돌리기(끄고) · 지우기.', code: 'Snapshots → Restore', ref: 'U4/2' },
    { name: 'Devices → Shared Clipboard → Bidirectional', desc: 'Windows ↔ 우분투 클립보드 공유(Guest Additions 필요).', code: 'Devices → Shared Clipboard → Bidirectional', ref: 'U3/1' },
    { name: 'Devices → Insert Guest Additions CD Image', desc: 'Guest Additions 설치 CD 넣기.', code: 'Devices → Insert Guest Additions CD Image', ref: 'U3/1' },
    { name: 'Super+Space', desc: '입력 소스 바꾸기(en ↔ ko). Super = Windows 로고 키.', code: 'Super+Space', ref: 'U3/2' },
    { name: 'bcdedit /set hypervisorlaunchtype off · auto', desc: '🐢 없애기 · 되돌리기(Windows 관리자 터미널, 다시 시작 필요).', code: 'bcdedit /set hypervisorlaunchtype off', ref: 'U1/2' },
  ],
  tasks: {
    U0: [
      { title: '내 PC 여유 확인', text: '이 PC 가 VM 을 돌릴 수 있는지 숫자로 확인해요. 작업 관리자와 Windows 설정에서 메모리·CPU·디스크를 보세요.', noRun: true,
        needs: [['Win+← · Win+→', 'U0/2', '창 나란히'], ['VirtualBox (호스트 · 게스트)', 'U0/0', '세 겹 그림']],
        checks: [{ text: '작업 관리자 → 성능 → 메모리: 전체 메모리가 16GB 이상이에요(8GB 면 VM 에 6GB 만 줄 수 있어요)' }, { text: '작업 관리자 → 성능 → CPU: 「논리 프로세서」 가 8 이상이에요(VM 에 4개를 줘도 절반)' }, { text: '설정 → 시스템 → 저장소: VM 을 둘 드라이브의 여유가 45GB 이상이에요' }, { text: '이 사이트와 다른 창 하나를 Win+← / Win+→ 로 나란히 놔 봤어요' }],
        answer: '1. Ctrl+Shift+Esc → 성능 → 메모리 (전체 GB)\n2. 성능 → CPU (논리 프로세서 수)\n3. 시작 → 설정 → 시스템 → 저장소 (C: 의 사용 가능 공간)\n4. 창 클릭 → Win+← , 다른 창 → Win+→' },
    ],
    U1: [
      { title: '가상화 확인', text: '이 PC 의 CPU 가상화가 켜져 있는지 확인하세요. 꺼져 있으면 BIOS 에서 켜고 다시 확인해요.', noRun: true,
        needs: [['Virtualization: Enabled', 'U1/0', '작업 관리자 → 성능 → CPU'], ['Intel VT-x · SVM Mode', 'U1/0', 'BIOS 에서 켜는 칸']],
        checks: [{ text: '작업 관리자 → 성능 → CPU 의 오른쪽 아래에 「가상화: 사용」 이 보여요' }],
        answer: '1. Ctrl+Shift+Esc → 성능 → CPU → 「가상화: 사용」\n2. (사용 안 함이면) 다시 시작 → Del/F2 → Advanced → CPU Configuration → Intel Virtualization Technology 또는 SVM Mode → Enabled → F10 → Yes\n3. Windows 로 돌아와 1 을 다시 확인' },
      { title: 'VirtualBox 7.2 설치', text: '공식 사이트에서 VirtualBox 7.2 를 받아 설치하고 버전을 확인하세요.', noRun: true,
        needs: [['virtualbox.org → Download → Windows hosts', 'U1/1', '공식 설치 파일'], ['Help → About Oracle VirtualBox', 'U1/1', '버전 확인']],
        checks: [{ text: '시작 메뉴에 Oracle VirtualBox 가 있어요' }, { text: 'VirtualBox 의 Help → About Oracle VirtualBox 에 7.2.10 이상의 버전이 보여요' }],
        answer: '1. virtualbox.org → Download → VirtualBox 7.2.x platform packages → Windows hosts\n2. 받은 .exe 실행 → Next … (구성 요소 그대로) → 네트워크 경고 Yes → Install → Finish\n3. VirtualBox 실행 → Help → About Oracle VirtualBox → 버전 확인' },
    ],
    U2: [
      { title: 'VM 만들고 우분투 설치', text: '<code>ubuntu-study</code> 라는 VM 을 메모리 8GB · CPU 4 · 디스크 40GB 로 만들고, 우분투 26.04 를 설치 화면을 직접 보며 설치하세요. 켜기 전에 3D 가속이 꺼져 있는지도 봐요.', noRun: true,
        needs: [['Home → New', 'U2/1', '새 VM 만들기'], ['Base Memory 8192 MB · Processors 4 · Disk Size 40 GB', 'U2/1', 'VM 사양'], ['Enable 3D Acceleration', 'U2/1', '끈 채로'], ['Erase disk and install Ubuntu', 'U2/2', '가상 디스크만 지움'], ['Create your account', 'U2/2', '사용자 이름·비밀번호'], ['remove the installation medium · ENTER', 'U2/3', '처음 다시 켤 때']],
        checks: [{ text: 'VirtualBox 왼쪽 목록에 ubuntu-study 가 있고, 고르면 오른쪽에 Base Memory 8192 MB · Processors 4 가 보여요' }, { text: 'Settings → Display 에서 Graphics Controller 가 VMSVGA, 3D 가속은 꺼져 있어요' }, { text: 'VM 을 켜면 우분투 로그인 화면이 나오고, 내 비밀번호로 바탕화면까지 들어가요' }, { text: 'VM 창 오른쪽 아래가 🐢 거북이가 아니라 V 모양이에요(거북이면 레슨 1 의 3쪽)' }],
        answer: '1. ubuntu.com/download/desktop → Ubuntu 26.04.x LTS Download → ISO 를 받기 폴더에\n2. VirtualBox → Home → New → Name: ubuntu-study · ISO Image: 받은 ISO · 무인 설치 안 씀 · Base Memory 8192 MB · Processors 4 · Disk Size 40 GB → Finish\n3. Settings → Display → VMSVGA · ☐ Enable 3D Acceleration → OK\n4. Start → English → Next … → Install Ubuntu → Interactive installation → Default selection → Erase disk and install Ubuntu → No encryption → Create your account → Seoul → Install\n5. Restart now → 「remove the installation medium」 에서 Enter → 로그인' },
    ],
    U3: [
      { title: '업데이트와 Guest Additions', text: '우분투를 최신으로 업데이트하고, 스냅샷을 하나 찍은 뒤 Guest Additions 를 설치해서 창 크기 맞추기와 클립보드 공유를 켜세요.', noRun: true,
        needs: [['sudo apt update && sudo apt upgrade', 'U3/0', '업데이트'], ['Machine → Take Snapshot', 'U3/1', '설치 전에 한 장'], ['Devices → Insert Guest Additions CD Image', 'U3/1', 'CD 넣기'], ['sudo sh ./VBoxLinuxAdditions.run', 'U3/1', '설치 실행'], ['Devices → Shared Clipboard → Bidirectional', 'U3/1', '클립보드 공유']],
        checks: [{ text: '터미널에서 sudo apt update 를 다시 치면 끝 무렵에 「All packages are up to date.」 가 보여요' }, { text: 'VM 창 크기를 마우스로 바꾸면 우분투 화면도 따라 바뀌어요' }, { text: 'Windows 에서 복사한 글자를 우분투 터미널에 Ctrl+Shift+V 로 붙일 수 있어요' }, { text: 'Snapshots 목록에 「업데이트 끝」 이 있어요' }],
        answer: '1. Ctrl+Alt+T → sudo apt update && sudo apt upgrade -y → (필요하면) sudo reboot\n2. Machine → Take Snapshot → 업데이트 끝 → OK\n3. sudo apt install -y build-essential linux-headers-$(uname -r)\n4. Devices → Insert Guest Additions CD Image (자동 실행 창은 Cancel)\n5. cd /media/$USER/VBox_GAs_* → sudo sh ./VBoxLinuxAdditions.run → sudo reboot\n6. Devices → Shared Clipboard → Bidirectional' },
      { title: '한글 입력 켜기', text: '입력 소스에 Korean (Hangul) 을 더하고, 터미널이나 텍스트 편집기에서 한글을 쳐 보세요.', noRun: true,
        needs: [['Settings → Keyboard → Input Sources', 'U3/2', '입력 소스 칸'], ['+ Add Input Source… → Korean (Hangul)', 'U3/2', '한글 더하기'], ['Super+Space', 'U3/2', '입력 소스 바꾸기'], ['sudo apt install -y ibus-hangul', 'U3/2', '목록에 없을 때']],
        checks: [{ text: 'Settings → Keyboard → Input Sources 에 Korean (Hangul) 이 있어요' }, { text: 'Super+Space 를 누르면 오른쪽 위 표시가 en ↔ ko 로 바뀌어요' }, { text: 'Show Apps → Text Editor 에 「안녕 우분투」 를 쳤어요' }],
        answer: '1. Show Apps → Settings → Keyboard\n2. Input Sources → + Add Input Source… → Korean → Korean (Hangul) → Add\n   (목록에 없으면: sudo apt install -y ibus-hangul → Log Out → 다시 로그인 → 2)\n3. Super+Space 로 ko → 한/영 키(또는 Shift+Space)로 한글\n4. Text Editor 에 안녕 우분투' },
    ],
    U4: [
      { title: '스냅샷 한 바퀴', text: '「깨끗한 상태」 스냅샷을 찍고, 홈 폴더에 파일을 만든 다음, 그 스냅샷으로 되돌려 파일이 사라지는 걸 확인하세요.', noRun: true,
        needs: [['Snapshots → Take', 'U4/1', '관리 창에서 찍기'], ['sudo poweroff', 'U4/2', '되돌리기 전에 끄기'], ['Snapshots → Restore', 'U4/2', '되돌리기']],
        checks: [{ text: 'Snapshots 에 이름을 붙인 스냅샷이 새로 생겼어요' }, { text: 'Restore 하고 켠 뒤 ls ~/snap-test.txt 가 「No such file or directory」 를 보여요' }, { text: '필요 없는 연습용 스냅샷 하나를 Delete 로 지워 봤어요' }],
        answer: '1. sudo poweroff → 관리 창 → ubuntu-study → Snapshots → Take → 이름 「스냅샷 연습 전」 → OK\n2. Start → 터미널: echo "스냅샷 연습" > ~/snap-test.txt → ls -l ~/snap-test.txt → sudo poweroff\n3. Snapshots → 「스냅샷 연습 전」 → Restore (지금 상태 남기기는 끔)\n4. Start → ls ~/snap-test.txt → No such file or directory\n5. 연습용 스냅샷 → Delete' },
    ],
    UB1: [
      { title: '내 우분투 연습장 완성', text: '챕터 1 을 모아 앞으로 쓸 연습장을 완성하세요. 아래가 전부 되면 마지막으로 꺼진 상태에서 스냅샷 「연습장 완성」 을 찍어요 — 다음 챕터부터 망가지면 여기로 돌아와요.', noRun: true,
        needs: [['lsb_release -a', 'U3/0', '우분투 판 보기'], ['Devices → Shared Clipboard → Bidirectional', 'U3/1', '클립보드'], ['Korean (Hangul)', 'U3/2', '한글 입력'], ['Snapshots → Take', 'U4/1', '스냅샷']],
        checks: [{ text: '터미널의 lsb_release -a 에 Release: 26.04 가 보여요' }, { text: 'sudo apt update 끝에 「All packages are up to date.」' }, { text: 'VM 창 크기를 바꾸면 화면이 따라오고, Windows ↔ 우분투 복사·붙여넣기가 돼요' }, { text: 'Super+Space 로 한글을 쳐요' }, { text: 'VM 창 오른쪽 아래에 🐢 가 없어요' }, { text: 'Snapshots 에 「업데이트 끝」 과 「연습장 완성」 두 개 이상이 있어요' }],
        answer: '1. lsb_release -a → Release: 26.04\n2. sudo apt update && sudo apt upgrade -y\n3. 창 크기·클립보드 확인 (안 되면 레슨 3 의 Guest Additions 다시)\n4. Super+Space → ko → 한글\n5. 오른쪽 아래 상태 표시줄 확인 (🐢 면 레슨 1 의 3쪽)\n6. sudo poweroff → Snapshots → Take → 「연습장 완성」' },
    ],
  },
};
