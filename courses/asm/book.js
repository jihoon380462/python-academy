// courses/asm/book.js — 「어셈블리어 교과서」 데이터 (v2.31.0, 설계 specs/asm-course.md). 화면은 core/ui-views-book.js(다른 교과서와 같은 틀).
// 연습: 리눅스 교과서(UB1)에서 만든 우분투 VM(x86-64) 안의 nasm · ld · gcc · gdb + (권장) Windows 의 VS Code → Remote - SSH(리눅스 교과서).
// tasks 두 종류(check_book 의 BOOK.check === 'asm'):
//   ① 빌드해서 돌리는 문제 — answer(NASM, 여러 파일이면 「; ==== 파일: 이름 ====」 줄로 나눔)를 tools/asm_book_run.py 가 nasm · ld(또는 gcc -no-pie)로 빌드 · 실행해 io 의 출력 예와 비교.
//      종료 코드를 보는 문제는 echoExit: true — 출력 바로 뒤에 「echo $?」 의 숫자(진짜 터미널처럼)
//   ② gdb · objdump · 설치처럼 화면에서 보는 것 — noRun: true + checks(「내 화면에서 확인할 것」 ☐) — checks 가 없으면 check_book 실패
const BOOK = {
  check: 'asm',
  meta: {
    prereq: [
      { lessons: ['R0', 'RB1', 'RB2', 'RB3', 'RB4'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 1 · 준비물 보기',
        title: '먼저 꼭! 리눅스 교과서의 우분투 연습장(UB1)이 있어야 해요',
        html: '이 교과서의 코드는 <b>우분투 VM(x86-64) 안에서</b> 빌드하고 실행해요. Windows · Mac(Apple 칩)에서는 같은 코드가 안 돌아요 — 실행 파일 모양(ELF)도, 시스템 콜 번호도 리눅스 x86-64 것이에요. 아직이면 <a href="../linux/#lesson/UB1" target="_blank" rel="noopener">리눅스 교과서 「만들어 보기: 내 우분투 연습장 완성」 ↗</a> 부터. VS Code 는 리눅스 교과서의 <b>Remote - SSH</b> 로 VM 안의 폴더를 열어서 써요.' },
      { lessons: ['R2'], chapters: [1], ref: 'SETUP/0', btn: '시작하기 1 · 설치 명령 보기',
        title: '먼저 꼭! nasm 을 설치해요',
        html: '우분투 터미널에서 한 번: <code>sudo apt install nasm gdb build-essential</code>. 확인은 <code>nasm -v</code>(「NASM version 2.…」)와 <code>gcc --version</code>.' },
      { lessons: ['R13', 'RB3'], chapters: [3],
        title: 'printf 를 부르기 전에 스택을 16바이트에 맞춰요',
        html: '<code>main</code> 에 들어오자마자 <code>push rbp</code> 한 번(돌아가기 전에 <code>pop rbp</code>). 안 맞추면 어떤 컴퓨터에서는 <code>printf</code> 안에서 바로 <code>Segmentation fault</code> 가 나요. 왜 그런지는 레슨 12 「호출 규약」.' },
    ],
    kicker: '🧩 어셈블리어 교과서 · 공용', hero: 'CPU 가 진짜 하는 일을 명령 하나하나로',
    heroP: '파이썬 한 줄 아래에서 CPU 는 무엇을 할까요? 리눅스 교과서에서 만든 <b>우분투 VM</b> 에서 x86-64 <b>NASM</b> 으로 레지스터 · 시스템 콜 · 반복 · 메모리 · 스택 · 함수를 직접 써 보고, 마지막엔 <b>C 와 섞어</b> 컴파일러가 만든 코드를 읽어요.',
    dexName: '어셈블리어 도감', dexShort: '도감', dexWhat: '명령·코드', dexHint: '「점프」「스택」 처럼 한국어로도 찾기',
    dexExamples: '<code>mov</code>, <code>syscall</code>, <code>cmp</code>, <code>push</code>', dexPlaceholder: '🔍 찾기 — mov, syscall, 점프, 스택 …', dexAlt: '「옮기기」 대신 <code>mov</code>',
    dexDocs: 'NASM 공식 설명서 <a href="https://www.nasm.us/docs.php" target="_blank" rel="noopener">nasm.us/docs</a> · x86-64 명령 찾아보기 <a href="https://www.felixcloutier.com/x86/" target="_blank" rel="noopener">felixcloutier.com/x86</a> · 리눅스 시스템 콜 번호는 <code>/usr/include/x86_64-linux-gnu/asm/unistd_64.h</code>',
    dexRun: '코드는 📋 복사해서 우분투의 .asm 파일에 붙여 빌드할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '시스템 콜 · 레지스터', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. 우분투의 .asm 파일에 붙여 넣어요 — VS Code Remote - SSH 면 그냥 Ctrl+V',
    exampleLabel: '예제 코드 — 우분투에서 nasm · ld 로 빌드해 실행',
    makeIntro: '우분투의 <code>~/asm</code> 폴더에 파일(예: <code>{file}</code>)을 만들고(VS Code Remote - SSH), <b>VS Code 터미널(= 우분투의 bash)</b>에서 빌드해 실행한 뒤 「출력 예」 와 비교해요. 빌드는 <code>nasm -f elf64 파일.asm -o 파일.o</code> → <code>ld 파일.o -o 파일</code> → <code>./파일</code>(C 와 섞거나 printf 를 쓰면 <code>ld</code> 대신 <code>gcc -no-pie</code>). 종료 코드를 보는 문제는 <code>./파일; echo $?</code>.',
    makeTail: '막히면 「필요한 명령」 을 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.asm', answerLabel: '예시 답', needsLabel: '필요한 명령', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 우분투 VM 에서 어셈블리 빌드할 준비',
    pages: [
      { title: '1. 준비물: 우분투 VM · nasm · gcc · gdb', html: `<p>이 교과서는 <b>리눅스 교과서에서 만든 우분투 VM</b> 에서 해요. 우리가 쓰는 x86-64 리눅스 어셈블리는 Windows 에서는 빌드해도 실행이 안 돼요 — 실행 파일 모양(ELF)과 커널에게 부탁하는 방법(시스템 콜)이 운영체제마다 달라서예요.</p>
<table class="kb"><tbody><tr><td><b>우분투 VM</b></td><td>리눅스 교과서 「만들어 보기: 내 우분투 연습장 완성」(UB1)까지. 스냅샷이 있으면 실험이 꼬여도 금방 되돌려요</td></tr><tr><td><b>VS Code</b></td><td>Windows 의 VS Code → <b>Remote - SSH</b> 로 VM 에 접속(리눅스 교과서). 그러면 파일은 VM 안에 저장되고, VS Code 터미널은 VM 의 bash 예요</td></tr><tr><td><b>도구 설치</b></td><td>VM 의 터미널에서 한 번: <code>sudo apt install nasm gdb build-essential</code> — <code>nasm</code>(어셈블러) · <code>gdb</code>(디버거) · <code>gcc</code> · <code>ld</code>(링커, build-essential 안에)</td></tr><tr><td><b>확인</b></td><td><code>nasm -v</code> 가 「NASM version 2.…」, <code>gcc --version</code> 이 버전을, <code>uname -m</code> 이 <code>x86_64</code> 를 보여 주면 준비 끝</td></tr><tr><td><b>연습 폴더</b></td><td><code>mkdir -p ~/asm</code> — 앞으로 만드는 파일은 전부 여기에</td></tr></tbody></table>
<div class="bk-warn"><b><code>uname -m</code> 이 <code>aarch64</code> 면</b> — Apple 칩 Mac 의 VM 처럼 CPU 가 ARM 이에요. 이 교과서의 x86-64 코드는 그 VM 에서는 안 돌아요. x86-64(인텔 · AMD) PC 의 VirtualBox 에서 해 주세요.</div>`,
        example: { label: '예제 명령 — 우분투 터미널에서', shell: 'sudo apt install nasm gdb build-essential\nnasm -v\ngcc --version\nuname -m\nmkdir -p ~/asm && cd ~/asm' } },
      { title: '2. 쓰는 법: 저장 → 빌드 세 줄 → 실행', html: `<ol><li>레슨의 예제 코드를 📋 복사해 VS Code 에서 <code>~/asm</code> 에 <code>.asm</code> 파일로 저장해요(예: <code>hello.asm</code>).</li><li>VS Code 터미널(<kbd>Ctrl</kbd>+<kbd>\`</kbd>, VM 의 bash)에서 <b>빌드 세 줄</b>:<pre>nasm -f elf64 hello.asm -o hello.o
ld hello.o -o hello
./hello</pre><code>nasm</code> 이 사람이 읽는 명령을 기계어 조각(<code>hello.o</code>)으로, <code>ld</code> 가 그 조각을 실행 파일(<code>hello</code>)로 묶어요. 뜻은 레슨 0 · 레슨 2 에서 자세히.</li><li>화면에 나온 것을 「출력 예」 와 비교해요. 종료 코드를 보는 예제는 <code>./hello; echo $?</code> — 마지막 숫자가 프로그램이 돌려준 값이에요.</li></ol>
<div class="bk-step-box"><b>C 와 섞을 때(레슨 13~)</b><br><code>ld</code> 대신 <code>gcc -no-pie</code> 로 묶어요. 예: <code>nasm -f elf64 add.asm -o add.o</code> → <code>gcc -no-pie main.c add.o -o prog</code> → <code>./prog</code></div>
<div class="bk-step-box"><b>세 줄을 매번 치기 싫으면</b><br>터미널의 ↑ 키로 앞 명령을 다시 불러와요. 또는 한 줄로: <code>nasm -f elf64 hello.asm -o hello.o &amp;&amp; ld hello.o -o hello &amp;&amp; ./hello</code> — <code>&amp;&amp;</code> 는 「앞이 성공하면 다음」 이라, 에러가 나면 거기서 멈춰요.</div>
<p class="muted small">VS Code 확장 「The Netwide Assembler (NASM)」 같은 것을 깔면 색이 칠해져요(선택). 없어도 빌드 · 실행은 똑같아요.</p>`,
        example: { label: '예제 명령 — 우분투 터미널에서', shell: 'cd ~/asm\nnasm -f elf64 hello.asm -o hello.o\nld hello.o -o hello\n./hello\necho $?' } },
    ],
  },
  builtins: [],
  tasks: {},
};
