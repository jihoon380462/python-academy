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
  tasks: {
    R0: [
      { title: '종료 코드 42 로 끝나는 프로그램', text: '1쪽의 예제를 <code>~/asm/exit42.asm</code> 으로 만들어 빌드하고 <code>./exit42; echo $?</code> 로 실행해 보세요. 복사해도 되지만, 세 줄뿐이니 <b>직접 쳐 보면</b> 더 좋아요(빈칸 4개 들여쓰기 · 쉼표까지). <code>42</code> 가 보이면 첫 어셈블리 프로그램 완성이에요. 다 되면 42 를 다른 수로 바꿔 다시 빌드해 보세요.', echoExit: true,
        needs: [['mov rax, 60   mov rdi, 42   syscall', 'R0/0', '끝내면서 42 남기기'], ['nasm -f elf64 exit42.asm -o exit42.o', 'R0/1', '어셈블(글자 → 기계어 조각)'], ['ld exit42.o -o exit42', 'R0/1', '링크(조각 → 실행 파일)']],
        io: [{ output: '42' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 60         ; 60 = 끝내기(exit)\n    mov rdi, 42         ; 종료 코드\n    syscall             ; 커널에게 부탁!' },
      { title: '기계어 바이트 보기: objdump -d', text: '1번에서 만든 <code>exit42</code> 를 <code>objdump -d -M intel exit42</code> 로 열어, 1쪽 표의 기계어 바이트를 찾아보세요. 그다음 <code>-M intel</code> 을 빼고 <code>objdump -d exit42</code> 로 한 번 더 — 같은 명령이 AT&amp;T 문법으로 어떻게 보이는지 비교해요.', noRun: true,
        needs: [['objdump -d -M intel exit42', 'R0/3', '인텔 문법으로 기계어 보기'], ['mov $0x3c,%eax', 'R0/3', 'AT&T 문법 읽기(순서 반대 · % · $)']],
        checks: [{ text: '`objdump -d -M intel exit42` 에서 `mov    eax,0x3c` 줄 왼쪽에 `b8 3c 00 00 00` 이 있어요' }, { text: '`syscall` 줄 왼쪽에 `0f 05` 가 있고, `mov    edi,0x2a` 의 `0x2a` 가 42 예요(`python3 -c "print(0x2a)"`)' }, { text: '`objdump -d exit42` 에서는 같은 줄이 `mov    $0x3c,%eax` — 숫자가 앞, 레지스터가 뒤에 `%` 를 달고 있어요' }],
        answer: 'cd ~/asm\nobjdump -d -M intel exit42\nobjdump -d exit42\npython3 -c "print(0x3c, 0x2a)"' },
      { title: '조각 파일과 실행 파일: file', text: '<code>file exit42.o exit42</code> 로 두 파일의 정체를 보고, 조각 파일 <code>./exit42.o</code> 를 실행해 보세요(안 되는 게 정상이에요). <code>ls -l</code> 로 크기와 권한도 비교해요.', noRun: true,
        needs: [['file exit42.o exit42', 'R0/1', '파일의 정체 보기'], ['ld exit42.o -o exit42', 'R0/1', '조각을 실행 파일로']],
        checks: [{ text: '`file` 에서 `exit42.o` 는 `ELF 64-bit LSB relocatable`, `exit42` 는 `ELF 64-bit LSB executable` 이에요' }, { text: '`./exit42.o` 를 치면 `Permission denied` 가 나와요' }, { text: '`ls -l exit42.o exit42` 에서 `exit42` 에만 실행 권한 `x` 가 있어요(`-rwxr-xr-x`)' }],
        answer: 'cd ~/asm\nfile exit42.o exit42\n./exit42.o\nls -l exit42.o exit42' },
    ],
    R1: [
      { title: '16진수를 종료 코드로 보기', text: 'rbx 에 <b>16진수</b> <code>0x64</code> 를 넣고, 그 값을 rdi 로 옮겨 끝내세요. <code>echo $?</code> 는 10진수로 보여 줘요 — 몇이 나올지 먼저 맞혀 보고 실행해요.', echoExit: true,
        needs: [['mov rbx, 0x64', 'R1/1', '16진수로 넣기'], ['mov rdi, rbx', 'R1/1', '레지스터 복사(받는쪽, 주는쪽)'], ['mov rax, 60   syscall', 'R1/3', '끝내기 세 줄']],
        io: [{ output: '100' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rbx, 0x64       ; 16진수 64 = 10진수 100\n\n    mov rax, 60         ; 끝내기(exit)\n    mov rdi, rbx        ; 종료 코드 = rbx\n    syscall' },
      { title: '두 레지스터의 값 바꾸기', text: 'rax 에 10, rbx 에 20 을 넣은 뒤 두 값을 <b>서로 바꾸세요</b>. 파이썬의 <code>a, b = b, a</code> 같은 명령은 없어서, 빈 레지스터 하나(rcx)에 잠깐 맡겨야 해요. 바꾼 뒤 rax 를 종료 코드로 남기면 <code>20</code> 이 나와야 해요. (끝내기 번호를 넣기 <b>전에</b> rax 를 rdi 로!)', echoExit: true,
        needs: [['mov rcx, rax', 'R1/1', '잠깐 맡기기(복사)'], ['mov rdi, rax   mov rax, 60', 'R1/3', '결과를 먼저 rdi 로']],
        io: [{ output: '20' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 10\n    mov rbx, 20\n    mov rcx, rax        ; rcx = 10 (잠깐 맡기기)\n    mov rax, rbx        ; rax = 20\n    mov rbx, rcx        ; rbx = 10\n\n    mov rdi, rax        ; 결과를 먼저 rdi 로\n    mov rax, 60         ; 끝내기(exit)\n    syscall' },
      { title: '큰 수가 잘리는 것 보기', text: '종료 코드로 <code>1000</code> 을 남겨 보세요. 0~255 만 되니까 1000 그대로는 안 나와요. 무엇이 나올지 <code>python3 -c "print(1000 % 256)"</code> 로 먼저 계산해 보고 맞는지 확인해요.', echoExit: true,
        needs: [['mov rdi, 1000', 'R1/3', '종료 코드는 맨 아래 8비트만'], ['1000 % 256', 'R1/3', '256 으로 나눈 나머지']],
        io: [{ output: '232' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 60         ; 끝내기(exit)\n    mov rdi, 1000       ; 1000 = 256 × 3 + 232\n    syscall             ; 종료 코드는 232' },
    ],
    R2: [
      { title: 'Hello, World!', text: '화면에 <code>Hello, World!</code> 를 한 줄 찍고 종료 코드 0 으로 끝나는 프로그램을 만드세요. 1쪽의 <code>hello.asm</code> 에서 글자만 바꾸면 돼요 — 길이는 <code>equ $ - msg</code> 가 알아서 세요.',
        needs: [['msg db "Hello, World!", 10', 'R2/1', '글자 + 줄바꿈 놓기'], ['len equ $ - msg', 'R2/1', '길이 세기'], ['mov rax, 1   mov rdi, 1   mov rsi, msg   mov rdx, len   syscall', 'R2/2', 'write 부탁'], ['nasm -f elf64 hello.asm -o hello.o', 'R2/3', '빌드 세 줄']],
        io: [{ output: 'Hello, World!' }],
        answer: 'section .data\nmsg db "Hello, World!", 10\nlen equ $ - msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, 1          ; write\n    mov rdi, 1          ; 화면\n    mov rsi, msg        ; 무엇을\n    mov rdx, len        ; 몇 바이트\n    syscall\n\n    mov rax, 60         ; exit\n    mov rdi, 0          ; 잘 끝남\n    syscall' },
      { title: '두 줄 찍기: write 두 번', text: '첫 줄 <code>어셈블리</code>, 둘째 줄 <code>재밌어요</code> 를 찍으세요. 글자 묶음을 <b>두 개</b>(<code>msg1</code> · <code>msg2</code>, 길이도 <code>len1</code> · <code>len2</code>) 만들고 <code>write</code> 를 <b>두 번</b> 불러요. 시스템 콜이 돌아오면 rax 가 바뀌어 있으니, 두 번째 write 앞에서도 <code>mov rax, 1</code> 을 다시 해야 해요.',
        needs: [['msg2 db "재밌어요", 10   len2 equ $ - msg2', 'R2/1', '두 번째 글자 묶음 · 그 길이'], ['mov rax, 1   syscall', 'R2/2', 'write 다시 부르기(rax 는 결과로 바뀜)']],
        io: [{ output: '어셈블리\n재밌어요' }],
        answer: 'section .data\nmsg1 db "어셈블리", 10\nlen1 equ $ - msg1         ; msg1 바로 아래\nmsg2 db "재밌어요", 10\nlen2 equ $ - msg2         ; msg2 바로 아래\n\nsection .text\nglobal _start\n_start:\n    mov rax, 1          ; write — 첫 줄\n    mov rdi, 1\n    mov rsi, msg1\n    mov rdx, len1\n    syscall             ; 돌아오면 rax = 찍은 바이트 수\n\n    mov rax, 1          ; write — 둘째 줄(rax 를 다시 1 로)\n    mov rdi, 1\n    mov rsi, msg2\n    mov rdx, len2\n    syscall\n\n    mov rax, 60         ; exit\n    mov rdi, 0\n    syscall' },
      { title: '찍고 나서 종료 코드 3 으로 끝내기', text: '<code>끝!</code> 한 줄을 찍고 <b>종료 코드 3</b> 으로 끝나는 프로그램을 만드세요. <code>./end; echo $?</code> 로 실행하면 글자 아래에 3 이 보여야 해요.', echoExit: true,
        needs: [['mov rax, 60   mov rdi, 3   syscall', 'R2/2', 'exit 부탁(rdi = 종료 코드)'], ['./end; echo $?', 'R2/3', '실행하고 종료 코드 보기']],
        io: [{ output: '끝!\n3' }],
        answer: 'section .data\nmsg db "끝!", 10\nlen equ $ - msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, 1          ; write\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, len\n    syscall\n\n    mov rax, 60         ; exit\n    mov rdi, 3          ; 종료 코드 3\n    syscall' },
      { title: '에러 세 개 고치기', text: '아래 코드는 빌드도 안 되고, 고쳐서 빌드해도 실행하면 <code>Segmentation fault</code> 가 나요. nasm 이 알려 주는 <b>줄 번호</b>를 따라 하나씩 고치고, 마지막에 무엇이 빠졌는지 찾아 <code>고쳤어요!</code> 가 찍히고 잘 끝나게 만드세요. (틀린 곳: 명령 이름 오타 하나 · 쉼표 하나 · 빠진 것 하나)',
        given: 'section .data\nmsg db "고쳤어요!", 10\nlen equ $ - msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, 1\n    mvo rdi, 1\n    mov rsi msg\n    mov rdx, len\n    syscall',
        needs: [['error: parser: instruction expected', 'R2/4', 'nasm 에러의 줄 번호 읽기'], ['mov rax, 60   syscall', 'R2/4', 'exit 을 빼면 Segmentation fault']],
        io: [{ output: '고쳤어요!' }],
        answer: 'section .data\nmsg db "고쳤어요!", 10\nlen equ $ - msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, 1\n    mov rdi, 1          ; mvo → mov\n    mov rsi, msg        ; 쉼표 빠짐\n    mov rdx, len\n    syscall\n\n    mov rax, 60         ; 빠진 것: exit\n    mov rdi, 0\n    syscall' },
    ],
  },
};
