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
    fileExt: '.asm', prepLabel: '준비 파일 — .asm 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 명령', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
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
  builtins: [ // 「📋 자주 보는 표」 — 도감에 따로(설계 7절). 실행은 안 함(check_book 은 asm 의 builtins 를 건너뜀)
    { name: 'write — rax = 1', desc: '글자 쓰기. rdi = 1(화면), rsi = 글자 주소, rdx = 길이 → rax = 쓴 바이트 수.', code: 'mov rax, 1\nmov rdi, 1\nmov rsi, msg\nmov rdx, len\nsyscall', ref: 'R2/2' },
    { name: 'exit — rax = 60', desc: '프로그램 끝내기. rdi = 종료 코드(0~255, echo $? 로 봄).', code: 'mov rax, 60\nmov rdi, 0\nsyscall', ref: 'R2/2' },
    { name: 'read — rax = 0', desc: '입력 받기. rdi = 0(키보드), rsi = 버퍼 주소, rdx = 최대 길이 → rax = 받은 바이트 수(줄바꿈 포함).', code: 'mov rax, 0\nmov rdi, 0\nlea rsi, [buf]\nmov rdx, 64\nsyscall', ref: 'R9/0' },
    { name: 'syscall 이 바꾸는 레지스터', desc: 'syscall 뒤에는 rax(결과) · rcx · r11 이 바뀌어요. 반복 카운터는 rbx 같은 다른 레지스터에.', code: '; 바뀜: rax rcx r11\n; 그대로: rbx rbp rsp rsi rdi rdx r8~r10 r12~r15', ref: 'R6/3' },
    { name: '레지스터 16개', desc: '64비트 이름 — 작은 이름은 eax(32) · ax(16) · al(8), r8 은 r8d · r8w · r8b.', code: 'rax rbx rcx rdx rsi rdi rbp rsp\nr8  r9  r10 r11 r12 r13 r14 r15', ref: 'R1/0' },
    { name: '빌드 세 줄', desc: '어셈블(nasm) → 링크(ld) → 실행. C 와 섞거나 printf 를 쓰면 ld 대신 gcc -no-pie.', code: 'nasm -f elf64 hello.asm -o hello.o\nld hello.o -o hello\n./hello\necho $?', ref: 'R2/3' },
    { name: '조건 점프', desc: 'cmp a, b 다음에 — 부호 있는 수는 jl · jle · jg · jge, 부호 없는 수는 jb · jbe · ja · jae, 같음 je · 다름 jne.', code: 'cmp rax, rbx\nje  같음\njl  작음      ; rax < rbx (부호 있음)\njb  작음_u    ; rax < rbx (부호 없음)', ref: 'R5/2' },
  ],
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
    R3: [
      { title: '사칙연산 한 줄을 종료 코드로', text: '((7 + 5) × 3 − 6) ÷ 4 를 계산해 종료 코드로 보여 주세요. 나누기는 몫만 남겨요(파이썬의 <code>//</code>). 순서대로 한 줄씩 — 괄호 안부터.',
        needs: [['add rax, 5', 'R3/0', '더하기 · 빼기는 sub'], ['imul rax, 3', 'R3/1', '곱하기'], ['cqo   idiv rbx', 'R3/2', '나누기 — 몫은 rax'], ['mov rdi, rax   mov rax, 60   syscall', 'R3/0', '결과를 종료 코드로']],
        echoExit: true,
        io: [{ output: '7' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 7\n    add rax, 5          ; 12\n    imul rax, 3         ; 36\n    sub rax, 6          ; 30\n    mov rbx, 4\n    cqo\n    idiv rbx            ; 몫 7 (나머지 2 는 rdx)\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '섭씨 37도는 화씨로 몇 도', text: '화씨 = 섭씨 × 9 ÷ 5 + 32 예요. 섭씨 37 을 화씨로 바꿔 종료 코드로 보여 주세요(나누기는 몫만). 곱하기를 나누기보다 <b>먼저</b> 해야 버려지는 부분이 적어요 — 37 ÷ 5 를 먼저 하면 7 이 되어 버려요.',
        needs: [['imul rax, 9', 'R3/1', '× 9'], ['cqo   idiv rbx', 'R3/2', '÷ 5 — rbx 에 5'], ['add rax, 32', 'R3/0', '+ 32']],
        echoExit: true,
        io: [{ output: '98' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 37         ; 섭씨\n    imul rax, 9         ; 333\n    mov rbx, 5\n    cqo\n    idiv rbx            ; 66 (나머지 3 은 버림)\n    add rax, 32         ; 98\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '137초는 몇 분 몇 초', text: '137 을 60 으로 나눠 몫(분)과 나머지(초)를 구하고, 「분 × 100 + 초」 를 종료 코드로 보여 주세요. 2분 17초면 <code>217</code> 처럼 읽혀요.',
        needs: [['cqo   idiv rbx', 'R3/2', '몫 rax · 나머지 rdx'], ['imul rax, 100', 'R3/1', '분을 백의 자리로'], ['add rax, rdx', 'R3/0', '나머지(초) 더하기']],
        echoExit: true,
        io: [{ output: '217' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 137        ; 초\n    mov rbx, 60\n    cqo\n    idiv rbx            ; rax = 2 (분), rdx = 17 (초)\n    imul rax, 100       ; 200\n    add rax, rdx        ; 217\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: 'cqo 를 빼먹은 나눗셈 고치기', text: '아래 코드는 −9 ÷ 2 의 몫 −4 를 종료 코드로 보여 주려고 해요. −4 는 종료 코드로 <code>252</code> 여야 하는데 <code>251</code> 이 나와요. 한 줄만 고쳐 보세요. 힌트: idiv 가 나누는 건 rax 가 아니라 rdx:rax 예요 — rdx 에 0 을 넣으면 그 128비트가 −9 일까요?',
        given: 'section .text\nglobal _start\n_start:\n    mov rax, -9\n    mov rbx, 2\n    mov rdx, 0          ; idiv 앞 준비?\n    idiv rbx            ; 몫 → rax\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall',
        needs: [['cqo', 'R3/2', 'rdx 를 rax 의 부호로 채우기'], ['mov rax, -9', 'R3/3', '음수는 2의 보수 — 252 는 −4']],
        echoExit: true,
        io: [{ output: '252' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, -9\n    mov rbx, 2\n    cqo                 ; rdx 를 전부 1 로 → rdx:rax = -9\n    idiv rbx            ; 몫 -4, 나머지 -1\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
    ],
    R4: [
      { title: '두 수의 홀짝', text: '12345 와 678 이 각각 홀수인지 <code>and</code> 로 알아내, 「첫 수의 결과 × 10 + 둘째 수의 결과」 를 종료 코드로 보여 주세요. 홀수는 1, 짝수는 0 이라 <code>10</code> 이면 「홀수, 짝수」 예요.',
        needs: [['and rax, 1', 'R4/3', '홀수면 1, 짝수면 0'], ['imul rax, 10', 'R3/1', '두 결과를 한 숫자로'], ['add rax, rbx', 'R3/0', '더하기']],
        echoExit: true,
        io: [{ output: '10' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 12345\n    and rax, 1          ; 홀수 → 1\n    mov rbx, 678\n    and rbx, 1          ; 짝수 → 0\n    imul rax, 10\n    add rax, rbx        ; 10\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '비트 세 개 켜기: 2⁷ + 2⁴ + 1', text: '1 을 <code>shl</code> 로 밀어 2⁷(128)과 2⁴(16)을 만들고, <code>or</code> 로 1 과 함께 합쳐 종료 코드로 보여 주세요. 2진수로 <code>1001 0001</code> 이에요. 겹치지 않는 비트끼리는 or 가 더하기와 같아요.',
        needs: [['shl rax, 7', 'R4/2', '1 을 7칸 밀면 2⁷'], ['or rax, rbx', 'R4/0', '켜기']],
        echoExit: true,
        io: [{ output: '145' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 1\n    shl rax, 7          ; 128 = 1000 0000\n    mov rbx, 1\n    shl rbx, 4          ; 16  = 0001 0000\n    or  rax, rbx        ; 1001 0000\n    or  rax, 1          ; 1001 0001 = 145\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: 'imul 없이 × 10', text: '23 × 10 을 <code>imul</code> 없이 해 보세요. ×10 = ×8 + ×2 라서 「(n 을 3칸 민 것) + (n 을 1칸 민 것)」 이에요. 컴파일러도 곱하기를 이렇게 바꿔치기하곤 해요.',
        needs: [['shl rax, 3', 'R4/2', '× 8'], ['mov rbx, rax', 'R3/0', '원래 값을 복사해 두기'], ['add rax, rbx', 'R3/0', '× 8 + × 2']],
        echoExit: true,
        io: [{ output: '230' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, 23\n    mov rbx, rax        ; rbx = 23\n    shl rax, 3          ; 23 × 8 = 184\n    shl rbx, 1          ; 23 × 2 = 46\n    add rax, rbx        ; 184 + 46 = 230\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '어떤 글자든 대문자로 고치기', text: '아래 코드는 글자를 대문자로 바꾸려고 <code>xor</code> 를 썼어요. 그런데 이미 대문자인 <code>G</code> 를 넣으면 소문자 g(<code>103</code>)가 돼요. 한 줄을 고쳐서 <code>G</code> 든 <code>g</code> 든 대문자 G(<code>71</code>)가 나오게 하세요. 두 글자를 다 넣어 보고 확인해요.',
        given: 'section .text\nglobal _start\n_start:\n    mov rax, \'G\'\n    xor al, 0x20        ; 대문자로?\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall',
        needs: [['and al, 0xDF', 'R4/4', '0x20 자리 끄기 = 늘 대문자'], ['xor al, 0x20', 'R4/4', '뒤집기라 대문자는 소문자로']],
        echoExit: true,
        io: [{ output: '71' }],
        answer: 'section .text\nglobal _start\n_start:\n    mov rax, \'G\'        ; \'g\' 로 바꿔도 71\n    and al, 0xDF        ; 0x20 자리 끄기 → 늘 대문자\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
    ],
    RB1: [
      { title: '합 · 차 · 곱 — 합은 종료 코드로', text: '챕터 1 을 묶어 「계산 결과 알림」 프로그램 <code>calc.asm</code> 을 만들어요. 세 문제에 걸쳐 조금씩 키워요.<ol><li>두 수 a = 60 은 <code>r8</code>, b = 45 는 <code>r9</code> 에 넣어요.</li><li>합 · 차 · 곱을 각각 <code>r12</code> · <code>r13</code> · <code>r14</code> 에 계산해요(a · b 는 그대로 두고 복사해서).</li><li>제목 <code>계산 결과 알림</code> 한 줄을 write 로 찍어요.</li><li>합을 종료 코드로 끝내요.</li></ol><div class="bk-warn"><b>syscall 은 rcx 와 r11 을 망가뜨려요</b> — 커널이 돌아올 자리를 거기에 적어 두거든요. 그리고 rax 에는 결과(write 는 쓴 바이트 수)가 들어와요. 오래 둘 값은 rbx · r8 ~ r10 · r12 ~ r15 에 두세요.</div>',
        needs: [['title db "…", 10   title_len equ $ - title', 'R2/1', '글자와 길이'], ['mov rax, 1   mov rdi, 1   syscall', 'R2/2', 'write — 1번(화면)에 쓰기'], ['mov r12, r8   add r12, r9', 'R3/0', '복사해서 더하기 · 빼기는 sub'], ['imul r14, r9', 'R3/1', '곱하기']],
        echoExit: true,
        io: [{ output: '계산 결과 알림\n105' }],
        answer: 'section .data\ntitle     db "계산 결과 알림", 10\ntitle_len equ $ - title\n\nsection .text\nglobal _start\n_start:\n    mov r8, 60          ; a\n    mov r9, 45          ; b\n    mov r12, r8\n    add r12, r9         ; r12 = 합\n    mov r13, r8\n    sub r13, r9         ; r13 = 차\n    mov r14, r8\n    imul r14, r9        ; r14 = 곱\n\n    ; 제목 한 줄\n    mov rsi, title\n    mov rdx, title_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    mov rdi, r12        ; 합을 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '합이 100 을 넘었나 — 점프 없이 고르기', text: '「합이 100 을 넘으면 <code>합은 100 넘음</code>, 아니면 <code>합은 100 이하</code>」 를 찍어요. 갈래(점프)는 [[레슨:R5]] 에서 배우니, 여기서는 <b>계산으로 고르는</b> 방법을 써요.<ol><li>두 메시지를 <b>같은 길이로</b> 나란히 적어요(「이하」 와 「넘음」 은 둘 다 6바이트라 한 줄이 18바이트).</li><li><code>100 − 합</code> 을 계산해요. 합이 100 보다 크면 음수라 맨 왼쪽 비트가 1 이에요([[레슨:R3]] 2의 보수).</li><li><code>shr rax, 63</code> 으로 맨 왼쪽 비트만 남기면 넘었을 때 1, 아니면 0.</li><li>그 0 · 1 에 한 줄 길이를 곱해 메시지 주소에 더하면, 찍을 줄의 주소가 돼요.</li></ol><pre>msg_sum → 합은 100 이하\\n 합은 100 넘음\\n\n          ↑ +0            ↑ +18</pre>',
        needs: [['sub rax, r12', 'R3/3', '100 − 합 — 넘으면 음수'], ['shr rax, 63', 'R4/2', '맨 왼쪽(부호) 비트만 남기기'], ['imul rax, sum_len', 'R3/1', '0 또는 한 줄 길이'], ['mov rsi, msg_sum   add rsi, rax', 'R2/2', '찍을 줄의 주소']],
        echoExit: true,
        io: [{ output: '계산 결과 알림\n합은 100 넘음\n105' }],
        answer: 'section .data\ntitle     db "계산 결과 알림", 10\ntitle_len equ $ - title\nmsg_sum   db "합은 100 이하", 10     ; 0번 줄\nsum_len   equ $ - msg_sum             ; 한 줄 길이(18바이트)\n          db "합은 100 넘음", 10     ; 1번 줄 — 길이가 똑같아야 해요\n\nsection .text\nglobal _start\n_start:\n    mov r8, 60          ; a\n    mov r9, 45          ; b\n    mov r12, r8\n    add r12, r9         ; r12 = 합\n    mov r13, r8\n    sub r13, r9         ; r13 = 차\n    mov r14, r8\n    imul r14, r9        ; r14 = 곱\n\n    ; 제목 한 줄\n    mov rsi, title\n    mov rdx, title_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    ; 합이 100 을 넘었나: 100 - 합 이 음수면 맨 왼쪽 비트가 1\n    mov rax, 100\n    sub rax, r12        ; 100 - 합\n    shr rax, 63         ; 맨 왼쪽 비트만 → 넘으면 1, 아니면 0\n    imul rax, sum_len   ; 0 또는 18\n    mov rsi, msg_sum\n    add rsi, rax        ; 고른 줄의 주소\n    mov rdx, sum_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    mov rdi, r12        ; 합을 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '차는 홀수? 곱은 1000 넘음? — 알림 완성', text: '같은 방법으로 두 줄을 더해 알림을 완성해요.<ul><li>차가 짝수면 <code>차는 짝수</code>, 홀수면 <code>차는 홀수</code> — 고르는 수는 <code>and rax, 1</code>([[레슨:R4]]).</li><li>곱이 1000 을 넘으면 <code>곱은 1000 넘음</code>, 아니면 <code>곱은 1000 이하</code> — 합과 같은 방법.</li></ul>종료 코드는 그대로 합이에요.',
        needs: [['and rax, 1', 'R4/3', '차의 홀짝 → 0 또는 1'], ['shr rax, 63', 'R4/2', '곱이 1000 을 넘었나'], ['add rsi, rax', 'R3/0', '고른 줄의 주소']],
        echoExit: true,
        io: [{ output: '계산 결과 알림\n합은 100 넘음\n차는 홀수\n곱은 1000 넘음\n105' }],
        answer: 'section .data\ntitle     db "계산 결과 알림", 10\ntitle_len equ $ - title\nmsg_sum   db "합은 100 이하", 10     ; 0번 줄\nsum_len   equ $ - msg_sum             ; 한 줄 길이(18바이트)\n          db "합은 100 넘음", 10     ; 1번 줄 — 길이가 똑같아야 해요\nmsg_diff  db "차는 짝수", 10\ndiff_len  equ $ - msg_diff\n          db "차는 홀수", 10\nmsg_prod  db "곱은 1000 이하", 10\nprod_len  equ $ - msg_prod\n          db "곱은 1000 넘음", 10\n\nsection .text\nglobal _start\n_start:\n    mov r8, 60          ; a\n    mov r9, 45          ; b\n    mov r12, r8\n    add r12, r9         ; r12 = 합\n    mov r13, r8\n    sub r13, r9         ; r13 = 차\n    mov r14, r8\n    imul r14, r9        ; r14 = 곱\n\n    ; 제목 한 줄\n    mov rsi, title\n    mov rdx, title_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    ; 합이 100 을 넘었나: 100 - 합 이 음수면 맨 왼쪽 비트가 1\n    mov rax, 100\n    sub rax, r12        ; 100 - 합\n    shr rax, 63         ; 맨 왼쪽 비트만 → 넘으면 1, 아니면 0\n    imul rax, sum_len   ; 0 또는 18\n    mov rsi, msg_sum\n    add rsi, rax        ; 고른 줄의 주소\n    mov rdx, sum_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    ; 차의 홀짝: 맨 오른쪽 비트\n    mov rax, r13\n    and rax, 1          ; 홀수면 1\n    imul rax, diff_len\n    mov rsi, msg_diff\n    add rsi, rax\n    mov rdx, diff_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    ; 곱이 1000 을 넘었나\n    mov rax, 1000\n    sub rax, r14        ; 1000 - 곱\n    shr rax, 63\n    imul rax, prod_len\n    mov rsi, msg_prod\n    add rsi, rax\n    mov rdx, prod_len\n    mov rax, 1          ; write\n    mov rdi, 1          ; 1 = 화면(stdout)\n    syscall\n\n    mov rdi, r12        ; 합을 종료 코드로\n    mov rax, 60         ; exit\n    syscall' },
      { title: '숫자를 바꿔 다시 돌려 보기', text: '완성한 <code>calc.asm</code> 의 a · b 두 줄만 바꿔 다시 빌드 · 실행해 보세요. 점프 없이 고른 메시지가 숫자에 따라 바뀌는지, 종료 코드는 어떻게 보이는지 확인해요.',
        noRun: true,
        needs: [['mov r8, 30   mov r9, 20', 'R1/1', 'a · b 바꾸기'], ['and rax, 1', 'R4/3', '음수도 맨 오른쪽 비트로 홀짝'], ['sub rax, 5', 'R3/3', '음수 결과 — 2의 보수']],
        checks: [{ text: 'a = 30, b = 20 이면 `합은 100 이하` · `차는 짝수` · `곱은 1000 이하` 가 나오고 `echo $?` 는 50 이에요' }, { text: 'a = 200, b = 100 이면 `합은 100 넘음` 인데 `echo $?` 는 300 이 아니라 44 예요(종료 코드는 아래 8비트만 — 300 − 256)' }, { text: 'a = 5, b = 9 면 차가 −4 여도 `차는 짝수` 가 나와요(2의 보수에서도 맨 오른쪽 비트가 홀짝)' }, { text: 'a = 50, b = 50 이면 합이 딱 100 이라 `합은 100 이하` 예요(100 − 100 = 0 은 음수가 아니니까)' }],
        answer: 'nasm -f elf64 calc.asm -o calc.o && ld calc.o -o calc && ./calc; echo $?\n# a = 30, b = 20 으로 바꾼 뒤\n계산 결과 알림\n합은 100 이하\n차는 짝수\n곱은 1000 이하\n50' },
    ],
    R5: [
      { title: "큰 수 고르기",
        text: "<code>rax</code> 에 23, <code>rbx</code> 에 58 을 넣고 둘 중 <b>큰 수</b>를 종료 코드로 돌려주세요. 두 값을 바꿔 넣어도(58, 23) 똑같이 58 이 나와야 해요.",
        needs: [["cmp rax, rbx   jge done", "R5/2", "부호 있게 「크거나 같으면」 점프"], ["mov rdi, rax", "R5/1", "일단 하나를 답으로 두고, 아니면 고치기"], ["jmp done   done:", "R5/0", "라벨로 건너뛰기"]],
        echoExit: true,
        io: [{"output": "58"}],
        answer: "section .text\nglobal _start\n_start:\n    mov rax, 23\n    mov rbx, 58\n    mov rdi, rax        ; 일단 rax 가 크다고 보고\n    cmp rax, rbx\n    jge done            ; rax >= rbx 면 그대로\n    mov rdi, rbx        ; 아니면 rbx 가 답\ndone:\n    mov rax, 60\n    syscall" },
      { title: "짝수면 「짝수」 출력",
        text: "<code>rax</code> 의 수(14)가 짝수면 <code>짝수</code>, 홀수면 <code>홀수</code> 를 출력하세요. 맨 끝 비트만 남기는 <code>and rax, 1</code>([[레슨:R4]]) 바로 뒤에 점프해요 — <code>and</code> 도 플래그를 바꾸니까요. 15 로 바꿔 넣으면 <code>홀수</code> 가 나와야 해요.",
        needs: [["and rax, 1   jnz odd", "R5/1", "계산도 플래그를 바꿔요 — 0 이 아니면 점프"], ["jmp print", "R5/3", "if 쪽 끝에서 else 건너뛰기"], ["mov rsi, msg   mov rdx, len", "R5/3", "갈래마다 찍을 것만 정하고 write 는 한 번"]],
        io: [{"output": "짝수"}],
        answer: "section .data\neven_msg db \"짝수\", 10\neven_len equ $ - even_msg\nodd_msg db \"홀수\", 10\nodd_len equ $ - odd_msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, 14\n    and rax, 1          ; 맨 끝 비트만 (0 이면 짝수)\n    jnz odd             ; 0 이 아니면 홀수\n    mov rsi, even_msg\n    mov rdx, even_len\n    jmp print\nodd:\n    mov rsi, odd_msg\n    mov rdx, odd_len\nprint:\n    mov rax, 1          ; write\n    mov rdi, 1\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
      { title: "세 갈래: 얼음 · 물 · 수증기",
        text: "<code>rax</code> 의 온도(25)가 0 보다 작으면 <code>얼음</code>, 100 이상이면 <code>수증기</code>, 나머지는 <code>물</code> 을 출력하세요. 파이썬의 <code>if</code> · <code>elif</code> · <code>else</code> 예요 — <code>cmp</code> 와 점프를 두 번 써요. -5 와 120 으로도 바꿔 넣어 보세요.",
        needs: [["cmp rax, 0   jl ice", "R5/2", "부호 있게 「작으면」 — 음수도 맞게"], ["cmp rax, 100   jge steam", "R5/2", "「크거나 같으면」"], ["jmp print", "R5/3", "갈래 끝에서 나머지 건너뛰기"]],
        io: [{"output": "물"}],
        answer: "section .data\nice_msg   db \"얼음\", 10\nice_len   equ $ - ice_msg\nwater_msg db \"물\", 10\nwater_len equ $ - water_msg\nsteam_msg db \"수증기\", 10\nsteam_len equ $ - steam_msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, 25         ; 온도\n    cmp rax, 0\n    jl  ice             ; 0 보다 작으면 얼음\n    cmp rax, 100\n    jge steam           ; 100 이상이면 수증기\n    mov rsi, water_msg  ; 나머지는 물\n    mov rdx, water_len\n    jmp print\nice:\n    mov rsi, ice_msg\n    mov rdx, ice_len\n    jmp print\nsteam:\n    mov rsi, steam_msg\n    mov rdx, steam_len\nprint:\n    mov rax, 1          ; write\n    mov rdi, 1\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
      { title: "고치기: 빚이 있는데 「괜찮아요」",
        text: "잔액이 -3000 원인데 아래 코드는 <code>괜찮아요</code> 를 찍어요. 점프 명령 하나만 고쳐서 <code>빚이 있어요</code> 가 나오게 하세요. 힌트: -3000 을 부호 없이 보면 아주 큰 수예요.",
        needs: [["cmp rax, 0   jl minus", "R5/2", "less 는 부호 있음, below 는 부호 없음"]],
        given: "section .data\ndebt_msg db \"빚이 있어요\", 10\ndebt_len equ $ - debt_msg\nok_msg   db \"괜찮아요\", 10\nok_len   equ $ - ok_msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, -3000      ; 잔액\n    cmp rax, 0\n    jb  minus           ; 0 보다 작으면?\n    mov rsi, ok_msg\n    mov rdx, ok_len\n    jmp print\nminus:\n    mov rsi, debt_msg\n    mov rdx, debt_len\nprint:\n    mov rax, 1\n    mov rdi, 1\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall",
        io: [{"output": "빚이 있어요"}],
        answer: "section .data\ndebt_msg db \"빚이 있어요\", 10\ndebt_len equ $ - debt_msg\nok_msg   db \"괜찮아요\", 10\nok_len   equ $ - ok_msg\n\nsection .text\nglobal _start\n_start:\n    mov rax, -3000      ; 잔액\n    cmp rax, 0\n    jl  minus           ; 부호 있게 보고 0 보다 작으면\n    mov rsi, ok_msg\n    mov rdx, ok_len\n    jmp print\nminus:\n    mov rsi, debt_msg\n    mov rdx, debt_len\nprint:\n    mov rax, 1\n    mov rdi, 1\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
    ],
    R6: [
      { title: "1~100 합",
        text: "1 부터 100 까지 더해서 합이 5050 이면 <code>합은 5050</code>, 아니면 <code>틀렸어요</code> 를 출력하세요. 5050 은 255 보다 커서 종료 코드로는 안 보여요(256 으로 나눈 나머지 186 이 나와요). 그래서 <code>cmp</code> 로 맞는지 확인해요.",
        needs: [["add rax, rcx   dec rcx   jnz sum", "R6/2", "카운터를 줄이며 더하기"], ["cmp rax, 5050   jne wrong", "R5/1", "같은지 보고 두 갈래"]],
        io: [{"output": "합은 5050"}],
        answer: "section .data\nok_msg  db \"합은 5050\", 10\nok_len  equ $ - ok_msg\nbad_msg db \"틀렸어요\", 10\nbad_len equ $ - bad_msg\n\nsection .text\nglobal _start\n_start:\n    mov rcx, 100        ; 100, 99, …, 1\n    mov rax, 0          ; 합\nsum:\n    add rax, rcx\n    dec rcx\n    jnz sum\n    cmp rax, 5050\n    jne wrong\n    mov rsi, ok_msg\n    mov rdx, ok_len\n    jmp print\nwrong:\n    mov rsi, bad_msg\n    mov rdx, bad_len\nprint:\n    mov rax, 1          ; write\n    mov rdi, 1\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
      { title: "별 n 개 찍기",
        text: "<code>rbx</code> 에 n = 7 을 넣고 <code>*</code> 를 7 개 한 줄로 찍은 뒤 줄을 바꾸세요. <code>write</code> 로 1바이트(<code>*</code>)를 7 번, 마지막에 줄바꿈 1바이트를 한 번 써요. n 을 3 으로 바꾸면 <code>***</code>.",
        needs: [["mov rbx, 7   dec rbx   jnz stars", "R6/0", "n 번 반복 — 카운터는 syscall 이 안 바꾸는 rbx"], ["mov rax, 1   syscall", "R6/0", "반복 안에서 rax 를 매번 다시"], ["mov rdx, 1", "R6/0", "1바이트만 쓰기"]],
        io: [{"output": "*******"}],
        answer: "section .data\nstar    db \"*\"\nnl      db 10\n\nsection .text\nglobal _start\n_start:\n    mov rbx, 7          ; n\nstars:\n    mov rax, 1          ; write — 반복 안에서 매번\n    mov rdi, 1\n    mov rsi, star\n    mov rdx, 1          ; 1바이트\n    syscall\n    dec rbx\n    jnz stars\n    mov rax, 1          ; 마지막에 줄바꿈\n    mov rdi, 1\n    mov rsi, nl\n    mov rdx, 1\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
      { title: "팩토리얼",
        text: "5! = 5 × 4 × 3 × 2 × 1 을 반복으로 계산해 종료 코드로 돌려주세요. 6! = 720 은 255 를 넘어서 종료 코드로는 208(720 을 256 으로 나눈 나머지)이 보여요.",
        needs: [["imul rax, rcx", "R6/2", "거듭제곱처럼 곱하기를 반복"], ["dec rcx   jnz fact", "R6/2", "rcx 가 0 이 될 때까지"]],
        echoExit: true,
        io: [{"output": "120"}],
        answer: "section .text\nglobal _start\n_start:\n    mov rcx, 5          ; 5, 4, 3, 2, 1\n    mov rax, 1          ; 결과\nfact:\n    imul rax, rcx       ; rax = rax × rcx\n    dec rcx\n    jnz fact\n    mov rdi, rax        ; 종료 코드 = 120\n    mov rax, 60\n    syscall" },
      { title: "고치기: 끝나지 않는 「야옹」",
        text: "「야옹」 을 세 번 찍으려던 코드인데 끝없이 찍혀요. <kbd>Ctrl</kbd>+<kbd>C</kbd> 로 멈추고(또는 <code>timeout 3 ./meow</code>), 왜 안 끝나는지 찾아 고치세요.",
        needs: [["syscall", "R6/3", "rax · rcx · r11 을 바꿔요"], ["mov rbx, 3   dec rbx   jnz again", "R6/0", "syscall 이 안 바꾸는 레지스터를 카운터로"]],
        given: "section .data\nmsg     db \"야옹\", 10\nlen     equ $ - msg\n\nsection .text\nglobal _start\n_start:\n    mov rcx, 3          ; 세 번\nagain:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, len\n    syscall\n    dec rcx\n    jnz again\n    mov rax, 60\n    mov rdi, 0\n    syscall",
        io: [{"output": "야옹\n야옹\n야옹"}],
        answer: "section .data\nmsg     db \"야옹\", 10\nlen     equ $ - msg\n\nsection .text\nglobal _start\n_start:\n    mov rbx, 3          ; 세 번 — syscall 이 rcx 를 바꾸니 rbx 로\nagain:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, msg\n    mov rdx, len\n    syscall\n    dec rbx\n    jnz again\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
    ],
    R7: [
      { title: "두 변수 바꾸기",
        text: "<code>a dq 3</code>, <code>b dq 8</code> 의 값을 서로 바꾸세요(파이썬의 <code>a, b = b, a</code>). 메모리 → 메모리는 안 되니 레지스터 두 개를 거쳐요. 확인은 종료 코드 <b>a × 10 + b</b> — 바꿨으면 83, 그대로면 38 이에요(곱하기는 [[레슨:R3]] 의 <code>imul</code>).",
        needs: [["mov rax, [a]   mov [b], rax", "R7/1", "메모리 읽기 · 쓰기"], ["add rdi, [b]", "R7/1", "계산에 메모리 값을 바로"], ["default rel", "R7/4", "파일 맨 위 한 줄"]],
        echoExit: true,
        io: [{"output": "83"}],
        answer: "default rel\n\nsection .data\na       dq 3\nb       dq 8\n\nsection .text\nglobal _start\n_start:\n    mov rax, [a]            ; rax = 3\n    mov rbx, [b]            ; rbx = 8\n    mov [a], rbx            ; a = 8\n    mov [b], rax            ; b = 3\n    mov rdi, [a]            ; 확인: a × 10 + b\n    mov rcx, 10\n    imul rdi, rcx\n    add rdi, [b]\n    mov rax, 60\n    syscall" },
      { title: "결과를 메모리에 저장하고 출력",
        text: "<code>x dq 5</code> 와 <code>y dq 4</code> 를 더한 값을 <code>section .bss</code> 의 <code>buf resb 2</code> 에 <b>글자</b>로 저장하고(숫자 글자 하나 + 줄바꿈), <code>write</code> 로 buf 를 찍으세요. 숫자 하나(0~9)에 <code>'0'</code>(아스키 48)을 더하면 그 숫자의 글자가 돼요.",
        needs: [["add rax, [y]", "R7/1", "메모리 값을 바로 더하기"], ["mov [buf], al", "R7/2", "al 이 1바이트라 1바이트만 저장"], ["mov byte [buf + 1], 10", "R7/2", "숫자를 넣을 땐 크기를"], ["lea rsi, [buf]", "R7/3", "write 에는 주소를"]],
        io: [{"output": "9"}],
        answer: "default rel\n\nsection .data\nx       dq 5\ny       dq 4\n\nsection .bss\nbuf     resb 2                  ; 글자 하나 + 줄바꿈\n\nsection .text\nglobal _start\n_start:\n    mov rax, [x]\n    add rax, [y]                ; 9\n    add rax, '0'                ; 숫자 9 → 글자 '9'\n    mov [buf], al               ; 1바이트만 저장\n    mov byte [buf + 1], 10      ; 줄바꿈\n    mov rax, 1                  ; write\n    mov rdi, 1\n    lea rsi, [buf]              ; buf 의 주소\n    mov rdx, 2\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall" },
      { title: "고치기: operation size not specified",
        text: "아래 코드는 nasm 이 <code>error: operation size not specified</code> 를 두 번 내요. count 가 8바이트(<code>resq 1</code>) 자리라는 걸 알려 줘서 종료 코드 15 가 나오게 고치세요.",
        needs: [["mov qword [count], 10", "R7/2", "숫자를 메모리에 넣을 땐 크기를"]],
        echoExit: true,
        given: "default rel\n\nsection .bss\ncount   resq 1\n\nsection .text\nglobal _start\n_start:\n    mov [count], 10\n    add [count], 5\n    mov rdi, [count]\n    mov rax, 60\n    syscall",
        io: [{"output": "15"}],
        answer: "default rel\n\nsection .bss\ncount   resq 1\n\nsection .text\nglobal _start\n_start:\n    mov qword [count], 10    ; 8바이트 자리에 10\n    add qword [count], 5     ; 15\n    mov rdi, [count]\n    mov rax, 60\n    syscall" },
    ],
    R8: [
      { title: "배열의 합", text: "<code>nums dq 12, 7, 30, 5, 21</code> 의 합을 종료 코드로 돌려주세요. 칸 수는 손으로 적지 말고 <code>equ</code> 로 nasm 이 세게 해요 — 그러면 칸을 늘려도 코드는 그대로예요.",
        needs: [["add rdi, [rbx + rcx*8]", "R8/1", "칸 값을 바로 더하기"], ["lea rbx, [nums]", "R8/0", "배열의 시작 주소"], ["n equ ($ - nums) / 8", "R8/0", "칸 수"]],
        echoExit: true,
        io: [{ output: "75" }],
        answer: `default rel\nsection .data\nnums dq 12, 7, 30, 5, 21\nn    equ ($ - nums) / 8\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [nums]\n    mov rdi, 0              ; 합\n    mov rcx, 0              ; 칸 번호\n.loop:\n    cmp rcx, n\n    jge .done\n    add rdi, [rbx + rcx*8]  ; 합 += nums[rcx]\n    inc rcx\n    jmp .loop\n.done:\n    mov rax, 60             ; 종료 코드 = 합\n    syscall` },
      { title: "영하의 날 중 가장 따뜻한 날", text: "어느 주의 아침 기온이 <code>temps dq -5, -12, -3, -40, -8</code> 이에요. 가장 높은 기온을 찾아 종료 코드로 돌려주세요. 답은 -3 인데, 종료 코드는 0~255 라 <b>253</b> 으로 보여요([[레슨:R3]] 의 2의 보수). 「지금까지 가장 큰 값」 을 0 으로 시작하면 왜 틀리는지도 생각해 봐요.",
        needs: [["mov rdi, [rbx]", "R8/1", "0 이 아니라 0번 칸에서 시작"], ["cmp rax, rdi   jle .skip", "R8/1", "부호 있는 비교로 건너뛰기"]],
        echoExit: true,
        io: [{ output: "253" }],
        answer: `default rel\nsection .data\ntemps dq -5, -12, -3, -40, -8\nn     equ ($ - temps) / 8\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [temps]\n    mov rdi, [rbx]          ; 0 이 아니라 0번 칸에서 시작\n    mov rcx, 1\n.loop:\n    cmp rcx, n\n    jge .done\n    mov rax, [rbx + rcx*8]\n    cmp rax, rdi\n    jle .skip               ; 부호 있는 비교(jle)\n    mov rdi, rax\n.skip:\n    inc rcx\n    jmp .loop\n.done:\n    mov rax, 60             ; -3 → 종료 코드 253\n    syscall` },
      { title: "두 문자열의 길이 합", text: "<code>s1 db \"hello\", 0</code> 과 <code>s2 db \"assembly\", 0</code> 의 길이를 각각 0 바이트까지 세어, 둘을 더한 값을 종료 코드로 돌려주세요(0 바이트는 안 세요).",
        needs: [["cmp byte [rbx + rcx], 0", "R8/2", "0 바이트면 끝"], ["inc rcx   jmp .count", "R8/2", "한 칸 더"], ["lea rbx, [s2]", "R8/0", "두 번째 문자열로 바꾸기"]],
        echoExit: true,
        io: [{ output: "13" }],
        answer: `default rel\nsection .data\ns1 db "hello", 0\ns2 db "assembly", 0\n\nsection .text\nglobal _start\n_start:\n    mov rdi, 0              ; 두 길이의 합\n    lea rbx, [s1]\n    mov rcx, 0\n.count1:\n    cmp byte [rbx + rcx], 0\n    je .done1\n    inc rcx\n    jmp .count1\n.done1:\n    add rdi, rcx            ; + 5\n    lea rbx, [s2]\n    mov rcx, 0\n.count2:\n    cmp byte [rbx + rcx], 0\n    je .done2\n    inc rcx\n    jmp .count2\n.done2:\n    add rdi, rcx            ; + 8\n    mov rax, 60\n    syscall` },
      { title: "대소문자 뒤집기", text: "<code>msg db \"Hello, ASM World 2026!\", 10, 0</code> 에서 대문자는 소문자로, 소문자는 대문자로 바꿔 출력하세요. 숫자 · 기호 · 빈칸은 그대로예요. 두 범위(<code>'A'</code>~<code>'Z'</code>, <code>'a'</code>~<code>'z'</code>) 중 하나에 들면 <code>xor al, 0x20</code> 하나로 뒤집혀요.",
        needs: [["mov al, [rbx + rcx]", "R8/3", "한 글자 읽기"], ["cmp al, 'a'   jb .keep", "R8/3", "범위 밖이면 건너뛰기"], ["xor al, 0x20", "R8/3", "대 ↔ 소 뒤집기"], ["mov [rbx + rcx], al", "R8/3", "제자리에 쓰기"]],
        io: [{ output: "hELLO, asm wORLD 2026!" }],
        answer: `default rel\nsection .data\nmsg db "Hello, ASM World 2026!", 10, 0\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [msg]\n    mov rcx, 0\n.next:\n    mov al, [rbx + rcx]\n    cmp al, 0\n    je .print\n    cmp al, 'A'\n    jb .keep                ; 'A' 보다 작으면 글자가 아님\n    cmp al, 'Z'\n    jbe .flip               ; 'A'~'Z' 면 뒤집기\n    cmp al, 'a'\n    jb .keep                ; 'Z' 와 'a' 사이의 기호\n    cmp al, 'z'\n    ja .keep\n.flip:\n    xor al, 0x20            ; 대 ↔ 소(0x20 자리 비트 하나 뒤집기)\n    mov [rbx + rcx], al\n.keep:\n    inc rcx\n    jmp .next\n.print:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, rbx\n    mov rdx, rcx\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
    ],
    R9: [
      { title: "이름 받아 인사하기", text: "<code>이름이 뭐예요? </code> 를 찍고 이름 한 줄을 받아 <code>안녕하세요, 이름님!</code> 을 출력하세요. read 가 받은 글자 끝에는 줄바꿈이 붙어 있으니, 마지막 바이트가 10 이면 길이에서 1 을 빼고 찍어요. 고정 글자 세 개(<code>이름이 뭐예요? </code> · <code>안녕하세요, </code> · <code>님!</code>+줄바꿈)는 <code>section .data</code> 에 <code>equ $ - 이름</code> 길이와 함께 두세요. 터미널에서는 내가 친 이름도 보이지만 출력 예에는 프로그램이 찍은 것만 있어요.",
        needs: [["mov rax, 0   mov rdi, 0   syscall", "R9/0", "read — 표준 입력에서 받기"], ["cmp byte [rbx + r12 - 1], 10", "R9/0", "끝의 줄바꿈 빼기"], ["mov rax, 1   syscall", "R9/1", "write 를 세 번"]],
        io: [{ input: "민수\n", output: "이름이 뭐예요? 안녕하세요, 민수님!" }, { input: "Ada\n", output: "이름이 뭐예요? 안녕하세요, Ada님!" }],
        answer: `default rel\nsection .data\nask     db "이름이 뭐예요? "\nask_len equ $ - ask\nhi      db "안녕하세요, "\nhi_len  equ $ - hi\ntail    db "님!", 10\ntail_len equ $ - tail\n\nsection .bss\nname resb 64\n\nsection .text\nglobal _start\n_start:\n    mov rax, 1              ; 묻기\n    mov rdi, 1\n    lea rsi, [ask]\n    mov rdx, ask_len\n    syscall\n    mov rax, 0              ; read(0, name, 64)\n    mov rdi, 0\n    lea rsi, [name]\n    mov rdx, 64\n    syscall\n    mov r12, rax            ; 받은 길이\n    lea rbx, [name]\n    cmp byte [rbx + r12 - 1], 10\n    jne .greet              ; 끝이 줄바꿈이 아니면 그대로\n    dec r12                 ; 줄바꿈은 빼기\n.greet:\n    mov rax, 1\n    mov rdi, 1\n    lea rsi, [hi]\n    mov rdx, hi_len\n    syscall\n    mov rax, 1\n    mov rdi, 1\n    lea rsi, [name]\n    mov rdx, r12\n    syscall\n    mov rax, 1\n    mov rdi, 1\n    lea rsi, [tail]\n    mov rdx, tail_len\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
      { title: "고치기: 한 글자만 찍히는 echo", text: "아래 프로그램은 받은 줄을 그대로 찍으려는 건데, 무엇을 넣어도 <b>첫 글자 하나만</b> 나와요. 줄 하나만 고쳐서 받은 줄이 전부 나오게 하세요.",
        given: `default rel\nsection .bss\nbuf resb 64\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, buf, 64)\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n    mov rax, 1              ; write(1, buf, 받은 길이)\n    mov rdi, 1\n    lea rsi, [buf]\n    mov rdx, rax\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall`,
        needs: [["mov rdx, rax", "R9/1", "rax 를 바꾸기 전에 길이 옮기기"]],
        io: [{ input: "hello, read\n", output: "hello, read" }],
        answer: `default rel\nsection .bss\nbuf resb 64\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, buf, 64)\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n    mov rdx, rax            ; 받은 길이를 먼저 rdx 로\n    mov rax, 1              ; 그다음에 rax 를 write 번호로\n    mov rdi, 1\n    lea rsi, [buf]\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
      { title: "두 수 더하기", text: "한 줄에 빈칸으로 나눈 두 수(예: <code>37 45</code>)를 받아 합을 10진으로 출력하세요. 첫 수는 숫자가 아닌 글자(빈칸)에서 멈추고, 그 빈칸 하나를 건너뛴 뒤 같은 방법으로 둘째 수를 만들어요. 출력은 [[레슨:R9]] 의 숫자 출력 덩어리를 그대로 붙여 써요.",
        needs: [["movzx rdx, byte [rbx + rcx]", "R9/2", "글자 1바이트 읽기"], ["sub rdx, '0'   imul r12, 10   add r12, rdx", "R9/2", "글자 → 정수"], ["sub rsp, 32 … div rcx … add rsp, 32", "R9/4", "숫자 출력 덩어리 — rdi 를 10진으로"]],
        io: [{ input: "37 45\n", output: "82" }, { input: "99 99\n", output: "198" }],
        answer: `default rel\nsection .bss\nbuf resb 64\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, buf, 64) — 예: "37 45\\n"\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n    lea rbx, [buf]\n    mov rcx, 0              ; 몇 번째 글자\n    mov r12, 0              ; 첫 수\n.first:\n    movzx rdx, byte [rbx + rcx]\n    cmp rdx, '0'\n    jb .gap\n    cmp rdx, '9'\n    ja .gap\n    sub rdx, '0'\n    imul r12, 10\n    add r12, rdx\n    inc rcx\n    jmp .first\n.gap:\n    inc rcx                 ; 사이의 빈칸 하나 건너뛰기\n    mov r13, 0              ; 둘째 수\n.second:\n    movzx rdx, byte [rbx + rcx]\n    cmp rdx, '0'\n    jb .add\n    cmp rdx, '9'\n    ja .add\n    sub rdx, '0'\n    imul r13, 10\n    add r13, rdx\n    inc rcx\n    jmp .second\n.add:\n    mov rdi, r12\n    add rdi, r13            ; rdi = 첫 수 + 둘째 수\n    ; ---- 숫자 출력: rdi 를 10진 글자 + 줄바꿈으로 ----\n    sub rsp, 32             ; 글자 버퍼 32바이트(스택)\n    mov rax, rdi\n    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움\n    mov byte [rsi], 10      ; 맨 끝은 줄바꿈\n    mov r8, 1               ; 지금까지 글자 수\n    mov rcx, 10\n    test rax, rax\n    jns .digits\n    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'\n.digits:\n    xor edx, edx\n    div rcx                 ; rax = 몫, rdx = 나머지(0~9)\n    add dl, '0'\n    dec rsi\n    mov [rsi], dl\n    inc r8\n    test rax, rax\n    jnz .digits\n    test rdi, rdi\n    jns .write\n    dec rsi\n    mov byte [rsi], '-'\n    inc r8\n.write:\n    mov rax, 1              ; write(1, rsi, r8)\n    mov rdx, r8\n    mov rdi, 1\n    syscall\n    add rsp, 32\n    ; ---- 여기까지 ----\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
      { title: "1 부터 n 까지 더하기", text: "수 n 을 한 줄 받아 1 + 2 + … + n 을 출력하세요. 100 이면 5050 처럼 255 보다 큰 수가 나오니 종료 코드 말고 숫자 출력 덩어리로 찍어요.",
        needs: [["movzx rdx, byte [rbx + rcx]   sub rdx, '0'", "R9/2", "n 만들기"], ["cmp rcx, r12   jg .print", "R9/4", "반복 — i 가 n 을 넘으면 끝"], ["sub rsp, 32 … div rcx … add rsp, 32", "R9/4", "숫자 출력 덩어리 — rdi 를 10진으로"]],
        io: [{ input: "100\n", output: "5050" }, { input: "10\n", output: "55" }],
        answer: `default rel\nsection .bss\nbuf resb 64\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, buf, 64)\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n    lea rbx, [buf]\n    mov rcx, 0\n    mov r12, 0              ; n\n.digit:\n    movzx rdx, byte [rbx + rcx]\n    cmp rdx, '0'\n    jb .sum\n    cmp rdx, '9'\n    ja .sum\n    sub rdx, '0'\n    imul r12, 10\n    add r12, rdx\n    inc rcx\n    jmp .digit\n.sum:\n    mov rdi, 0              ; 합\n    mov rcx, 1              ; i = 1\n.add:\n    cmp rcx, r12\n    jg .print               ; i 가 n 을 넘으면 끝\n    add rdi, rcx\n    inc rcx\n    jmp .add\n.print:\n    ; ---- 숫자 출력: rdi 를 10진 글자 + 줄바꿈으로 ----\n    sub rsp, 32             ; 글자 버퍼 32바이트(스택)\n    mov rax, rdi\n    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움\n    mov byte [rsi], 10      ; 맨 끝은 줄바꿈\n    mov r8, 1               ; 지금까지 글자 수\n    mov rcx, 10\n    test rax, rax\n    jns .digits\n    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'\n.digits:\n    xor edx, edx\n    div rcx                 ; rax = 몫, rdx = 나머지(0~9)\n    add dl, '0'\n    dec rsi\n    mov [rsi], dl\n    inc r8\n    test rax, rax\n    jnz .digits\n    test rdi, rdi\n    jns .write\n    dec rsi\n    mov byte [rsi], '-'\n    inc r8\n.write:\n    mov rax, 1              ; write(1, rsi, r8)\n    mov rdx, r8\n    mov rdi, 1\n    syscall\n    add rsp, 32\n    ; ---- 여기까지 ----\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
    ],
    RB2: [
      { title: "누적 합을 한 줄씩", text: "챕터 2 묶기예요. <code>nums dq 15, -7, 300, 0, -1024</code> 를 앞에서부터 더해 가며, 더할 때마다 <b>지금까지의 합</b>을 한 줄씩 출력하세요. 숫자 출력 덩어리는 반복 안에 <b>한 번만</b> 두고, 칸 번호 · 배열 주소 · 합은 덩어리가 안 건드리는 <code>rbx</code> · <code>r12</code> · <code>r13</code> 에 둬요. 음수도 <code>-716</code> 처럼 나와야 해요.",
        needs: [["add r13, [rbx + r12*8]", "R8/1", "칸 값을 합에 더하기"], ["mov rdi, r13", "R9/4", "찍을 수는 rdi 에"], ["test rax, rax   jns .digits   neg rax", "R9/4", "음수 처리"], ["inc r12   cmp r12, n   jl .next", "R9/4", "덩어리를 반복 안에"]],
        io: [{ output: "15\n8\n308\n308\n-716" }],
        answer: `default rel\nsection .data\nnums dq 15, -7, 300, 0, -1024\nn    equ ($ - nums) / 8\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [nums]         ; rbx · r12 · r13 은 숫자 출력 덩어리가 안 건드려요\n    mov r12, 0              ; 칸 번호\n    mov r13, 0              ; 누적 합\n.next:\n    add r13, [rbx + r12*8]  ; 합 += nums[r12]\n    mov rdi, r13\n    ; ---- 숫자 출력: rdi 를 10진 글자 + 줄바꿈으로 ----\n    sub rsp, 32             ; 글자 버퍼 32바이트(스택)\n    mov rax, rdi\n    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움\n    mov byte [rsi], 10      ; 맨 끝은 줄바꿈\n    mov r8, 1               ; 지금까지 글자 수\n    mov rcx, 10\n    test rax, rax\n    jns .digits\n    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'\n.digits:\n    xor edx, edx\n    div rcx                 ; rax = 몫, rdx = 나머지(0~9)\n    add dl, '0'\n    dec rsi\n    mov [rsi], dl\n    inc r8\n    test rax, rax\n    jnz .digits\n    test rdi, rdi\n    jns .write\n    dec rsi\n    mov byte [rsi], '-'\n    inc r8\n.write:\n    mov rax, 1              ; write(1, rsi, r8)\n    mov rdx, r8\n    mov rdi, 1\n    syscall\n    add rsp, 32\n    ; ---- 여기까지 ----\n    inc r12\n    cmp r12, n\n    jl .next\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
      { title: "한 줄을 거꾸로", text: "한 줄을 받아 글자 순서를 거꾸로 뒤집어 출력하세요(끝의 줄바꿈은 뒤집지 말고 빼 둔 뒤, 출력 끝에 다시 하나). 받은 버퍼 <code>line</code> 을 뒤에서부터 읽어 다른 버퍼 <code>back</code> 에 앞에서부터 쓰면 돼요. 영어 · 숫자 · 기호만 넣어요 — 한글은 한 글자가 3바이트라 바이트를 뒤집으면 글자가 깨져요([[레슨:R10]] 에서 스택으로도 뒤집어 봐요).",
        needs: [["mov rax, 0   syscall", "R9/0", "한 줄 받기"], ["cmp byte [rbx + rcx - 1], 10", "R9/0", "끝의 줄바꿈 빼기"], ["mov al, [rbx + rcx]   mov [rdi + r8], al", "R8/3", "한 바이트씩 옮기기"], ["back resb 65", "R9/0", "뒤집은 줄을 담을 버퍼"]],
        io: [{ input: "Hello, asm 2026\n", output: "6202 msa ,olleH" }, { input: "abc\n", output: "cba" }],
        answer: `default rel\nsection .bss\nline resb 64                ; 받은 줄\nback resb 65                ; 뒤집은 줄 + 줄바꿈\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, line, 64)\n    mov rdi, 0\n    lea rsi, [line]\n    mov rdx, 64\n    syscall\n    mov rcx, rax            ; rcx = 받은 길이\n    lea rbx, [line]\n    cmp rcx, 0\n    je .ready               ; 아무것도 없으면 줄바꿈만\n    cmp byte [rbx + rcx - 1], 10\n    jne .ready\n    dec rcx                 ; 끝의 줄바꿈은 빼고 뒤집기\n.ready:\n    lea rdi, [back]\n    mov r8, 0               ; back 에 쓸 자리(앞에서부터)\n.copy:\n    cmp rcx, 0\n    je .print\n    dec rcx                 ; line 은 뒤에서부터\n    mov al, [rbx + rcx]\n    mov [rdi + r8], al\n    inc r8\n    jmp .copy\n.print:\n    mov byte [rdi + r8], 10 ; 끝에 줄바꿈\n    inc r8\n    mov rax, 1              ; write(1, back, r8)\n    mov rsi, rdi\n    mov rdi, 1\n    mov rdx, r8\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
      { title: "정수 계산기: 합 · 차 · 곱", text: "한 줄에 빈칸으로 나눈 두 정수 a b 를 받아 <code>a + b</code>, <code>a - b</code>, <code>a × b</code> 를 한 줄씩 출력하세요. 수 앞에 <code>-</code> 가 올 수 있어요 — 첫 글자가 <code>'-'</code> 면 표시해 두고 건너뛴 뒤 숫자를 만들고, 다 만든 뒤 <code>neg</code>. 두 수는 <code>vals resq 2</code> 에, 세 결과는 <code>res resq 3</code> 에 저장한 다음 반복으로 하나씩 찍어요.",
        needs: [["cmp byte [rbx + rcx], '-'", "R9/2", "부호 글자 보기"], ["movzx rdx, byte [rbx + rcx]   imul rax, 10", "R9/2", "글자 → 정수"], ["mov [rsi + r12*8], rax", "R8/0", "배열 칸에 저장"], ["imul rax, [rsi + 8]", "R8/0", "메모리 값과 곱하기"], ["sub rsp, 32 … div rcx … add rsp, 32", "R9/4", "숫자 출력 덩어리 — rdi 를 10진으로"]],
        io: [{ input: "-15 4\n", output: "-11\n-19\n-60" }, { input: "123 -45\n", output: "78\n168\n-5535" }],
        answer: `default rel\nsection .bss\nbuf  resb 64\nvals resq 2                 ; 읽은 두 수\nres  resq 3                 ; 합 · 차 · 곱\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, buf, 64) — 예: "-15 4\\n"\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n    lea rbx, [buf]\n    mov rcx, 0              ; 몇 번째 글자\n    mov r12, 0              ; 몇 번째 수(0, 1)\n.number:\n    mov rax, 0              ; 만드는 수\n    mov r9, 0               ; 1 이면 음수\n    cmp byte [rbx + rcx], '-'\n    jne .digit\n    mov r9, 1\n    inc rcx                 ; '-' 건너뛰기\n.digit:\n    movzx rdx, byte [rbx + rcx]\n    cmp rdx, '0'\n    jb .end\n    cmp rdx, '9'\n    ja .end\n    sub rdx, '0'\n    imul rax, 10\n    add rax, rdx\n    inc rcx\n    jmp .digit\n.end:\n    cmp r9, 0\n    je .store\n    neg rax\n.store:\n    lea rsi, [vals]\n    mov [rsi + r12*8], rax\n    inc rcx                 ; 빈칸(또는 줄바꿈) 건너뛰기\n    inc r12\n    cmp r12, 2\n    jl .number\n\n    lea rsi, [vals]         ; 계산해서 res 에 저장\n    lea rdi, [res]\n    mov rax, [rsi]\n    add rax, [rsi + 8]\n    mov [rdi], rax          ; 합\n    mov rax, [rsi]\n    sub rax, [rsi + 8]\n    mov [rdi + 8], rax      ; 차\n    mov rax, [rsi]\n    imul rax, [rsi + 8]\n    mov [rdi + 16], rax     ; 곱\n\n    lea rbx, [res]\n    mov r12, 0\n.next:\n    mov rdi, [rbx + r12*8]\n    ; ---- 숫자 출력: rdi 를 10진 글자 + 줄바꿈으로 ----\n    sub rsp, 32             ; 글자 버퍼 32바이트(스택)\n    mov rax, rdi\n    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움\n    mov byte [rsi], 10      ; 맨 끝은 줄바꿈\n    mov r8, 1               ; 지금까지 글자 수\n    mov rcx, 10\n    test rax, rax\n    jns .digits\n    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'\n.digits:\n    xor edx, edx\n    div rcx                 ; rax = 몫, rdx = 나머지(0~9)\n    add dl, '0'\n    dec rsi\n    mov [rsi], dl\n    inc r8\n    test rax, rax\n    jnz .digits\n    test rdi, rdi\n    jns .write\n    dec rsi\n    mov byte [rsi], '-'\n    inc r8\n.write:\n    mov rax, 1              ; write(1, rsi, r8)\n    mov rdx, r8\n    mov rdi, 1\n    syscall\n    add rsp, 32\n    ; ---- 여기까지 ----\n    inc r12\n    cmp r12, 3\n    jl .next\n    mov rax, 60\n    mov rdi, 0\n    syscall` },
    ],
    R10: [
      { title: '두 레지스터 바꾸기', text: `<code>rax = 7</code>, <code>rbx = 3</code> 에서 시작해 <b>스택만 써서</b> 둘을 바꾸세요(<code>rax = 3</code>, <code>rbx = 7</code>). 확인은 종료 코드 <code>rax × 10 + rbx</code> 로 해요. 바뀌었으면 37 이에요.`, echoExit: true,
        needs: [['push rax   push rbx   pop rax   pop rbx', 'R10/1', '나중에 넣은 것이 먼저 나와요'], ['mov rax, 60   syscall', 'R10/0', 'rdi 가 종료 코드']],
        io: [{ output: `37` }],
        answer: `section .text
global _start
_start:
    mov rax, 7
    mov rbx, 3
    push rax                ; 7 을 맡김
    push rbx                ; 3 을 맡김
    pop rax                 ; rax = 3
    pop rbx                 ; rbx = 7
    mov rdi, rax
    mov rdx, 10
    imul rdi, rdx           ; 3 × 10
    add rdi, rbx            ; + 7
    mov rax, 60
    syscall` },
      { title: '세 값 거꾸로', text: `<code>rax = 1</code>, <code>rbx = 2</code>, <code>rcx = 3</code> 을 스택으로 거꾸로(<code>rax = 3</code> · <code>rbx = 2</code> · <code>rcx = 1</code>) 바꾼 뒤, 세 숫자를 글자로 바꿔(<code>add al, '0'</code>) <code>buf</code> 에 차례로 넣고 줄바꿈과 함께 <code>write</code> 하세요.`,
        needs: [['push rax   push rbx   push rcx', 'R10/1', '세 개 쌓기'], ['pop rax   pop rbx   pop rcx', 'R10/1', '마지막에 넣은 3 이 rax 로']],
        io: [{ output: `321` }],
        answer: `default rel
section .bss
buf resb 4
section .text
global _start
_start:
    mov rax, 1
    mov rbx, 2
    mov rcx, 3
    push rax
    push rbx
    push rcx
    pop rax                 ; rax = 3
    pop rbx                 ; rbx = 2
    pop rcx                 ; rcx = 1
    lea rsi, [buf]
    add al, '0'             ; 숫자 → 글자
    mov [rsi], al
    add bl, '0'
    mov [rsi + 1], bl
    add cl, '0'
    mov [rsi + 2], cl
    mov byte [rsi + 3], 10
    mov rax, 1              ; write(1, buf, 4)
    mov rdi, 1
    mov rdx, 4
    syscall
    mov rax, 60
    mov rdi, 0
    syscall` },
      { title: '끝나지 않는 별 고치기', text: `별 다섯 개를 한 줄에 찍으려는 코드인데, 실행하면 별이 끝없이 나와요(<kbd>Ctrl</kbd>+<kbd>C</kbd> 로 멈춰요). 왜 그런지 찾아 두 줄을 더해 고치세요.`,
        given: `default rel
section .data
star db "*"
nl db 10
section .text
global _start
_start:
    mov rcx, 5              ; 별 다섯 개
again:
    mov rax, 1              ; write(1, star, 1)
    mov rdi, 1
    lea rsi, [star]
    mov rdx, 1
    syscall
    dec rcx
    jnz again
    mov rax, 1              ; 줄바꿈
    mov rdi, 1
    lea rsi, [nl]
    mov rdx, 1
    syscall
    mov rax, 60
    mov rdi, 0
    syscall`,
        needs: [['push rcx   syscall   pop rcx', 'R10/2', 'syscall 은 rcx · r11 을 바꿔요']],
        io: [{ output: `*****` }],
        answer: `default rel
section .data
star db "*"
nl db 10
section .text
global _start
_start:
    mov rcx, 5              ; 별 다섯 개
again:
    push rcx                ; syscall 앞에서 맡기고
    mov rax, 1              ; write(1, star, 1)
    mov rdi, 1
    lea rsi, [star]
    mov rdx, 1
    syscall
    pop rcx                 ; 끝나면 되찾기
    dec rcx
    jnz again
    mov rax, 1              ; 줄바꿈
    mov rdi, 1
    lea rsi, [nl]
    mov rdx, 1
    syscall
    mov rax, 60
    mov rdi, 0
    syscall` },
      { title: '스택으로 한 줄 뒤집기', text: `<code>read</code> 로 한 줄(영어 · 숫자, 64바이트 안)을 받아, 끝의 줄바꿈은 빼고 글자를 하나씩 <code>push</code> 했다가 <code>pop</code> 해서 거꾸로 찍으세요. 끝에는 줄바꿈 하나.`,
        needs: [['mov al, [rsi + rcx]   push rax', 'R10/3', '앞에서부터 쌓기'], ['pop rax   mov [rdi + rcx], al', 'R10/3', '꺼내면 거꾸로']],
        io: [{ input: `hello\n`, output: `olleh` }, { input: `abc 123\n`, output: `321 cba` }, { input: `x\n`, output: `x` }],
        answer: `default rel
section .bss
inbuf resb 64
outbuf resb 64
section .text
global _start
_start:
    mov rax, 0              ; read(0, inbuf, 64)
    mov rdi, 0
    lea rsi, [inbuf]
    mov rdx, 64
    syscall
    mov rbx, rax            ; rbx = 받은 바이트 수
    cmp byte [rsi + rbx - 1], 10
    jne no_newline
    dec rbx                 ; 끝의 줄바꿈은 빼고 뒤집기
no_newline:
    xor ecx, ecx
push_loop:
    xor eax, eax
    mov al, [rsi + rcx]
    push rax
    inc rcx
    cmp rcx, rbx
    jl push_loop
    lea rdi, [outbuf]
    xor ecx, ecx
pop_loop:
    pop rax
    mov [rdi + rcx], al
    inc rcx
    cmp rcx, rbx
    jl pop_loop
    mov byte [rdi + rcx], 10
    mov rax, 1              ; write(1, outbuf, rbx + 1)
    mov rsi, rdi
    mov rdi, 1
    mov rdx, rbx
    inc rdx
    syscall
    mov rax, 60
    mov rdi, 0
    syscall` },
    ],
    R11: [
      { title: 'print_int 로 제곱 다섯 줄', text: `<code>square</code> 함수(<code>rdi</code> 를 받아 제곱을 <code>rax</code> 로)를 만들고, 1 부터 5 까지 제곱을 <code>print_int</code> 로 한 줄씩 찍으세요. 반복 횟수를 지키는 것도 잊지 말고요. <code>print_int</code> 는 레슨 그대로 붙여 써요.`,
        needs: [['call square   mov rdi, rax', 'R11/1', '인자 rdi, 결과 rax'], ['call print_int', 'R11/2', '숫자 한 줄 출력'], ['push rcx   call print_int   pop rcx', 'R11/3', '반복 횟수 맡기기']],
        io: [{ output: `1
4
9
16
25` }],
        answer: `section .text
global _start
_start:
    mov rcx, 1              ; n = 1, 2, … 5
again:
    push rcx                ; square · print_int 가 rcx 를 바꿀 수 있으니 맡김
    mov rdi, rcx
    call square             ; rax = n × n
    mov rdi, rax
    call print_int
    pop rcx
    inc rcx
    cmp rcx, 5
    jle again
    mov rax, 60
    mov rdi, 0
    syscall
square:                     ; rax = rdi × rdi
    mov rax, rdi
    imul rax, rdi
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: 'strlen 함수', text: `0 으로 끝나는 글자의 주소를 <code>rdi</code> 로 받아 길이(0 앞까지의 바이트 수)를 <code>rax</code> 로 돌려주는 <code>strlen</code> 을 만드세요. <code>"hello"</code> 와 <code>"어셈블리어"</code> 의 길이를 찍어요. 한글은 한 글자가 3바이트예요.`,
        needs: [['strlen:   …   ret', 'R11/0', '함수 = ret 으로 끝나는 라벨'], ['lea rdi, [s1]   call strlen', 'R11/1', '인자는 rdi, 결과는 rax'], ['mov rdi, rax   call print_int', 'R11/2', '길이 찍기']],
        io: [{ output: `5
15` }],
        answer: `default rel
section .data
s1 db "hello", 0
s2 db "어셈블리어", 0
section .text
global _start
_start:
    lea rdi, [s1]
    call strlen
    mov rdi, rax
    call print_int          ; 5
    lea rdi, [s2]
    call strlen
    mov rdi, rax
    call print_int          ; 15 (한글 한 글자 = 3바이트)
    mov rax, 60
    mov rdi, 0
    syscall
strlen:                     ; rax = rdi 에서 0 바이트 앞까지의 길이
    xor eax, eax
.next:
    cmp byte [rdi + rax], 0
    je .done
    inc rax
    jmp .next
.done:
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: '재귀 팩토리얼', text: `자기 자신을 부르는 <code>fact</code> 로 5!, 10!, 20! 을 한 줄씩 찍으세요. 20! 은 64비트에 들어가는 가장 큰 팩토리얼이에요(21! 은 넘쳐요).`,
        needs: [['push rdi   dec rdi   call fact   pop rdi', 'R11/4', '내 n 을 맡기고 자신을 부르기'], ['imul rax, rdi', 'R11/4', 'n × (n-1)!']],
        io: [{ output: `120
3628800
2432902008176640000` }],
        answer: `section .text
global _start
_start:
    mov rdi, 5
    call fact
    mov rdi, rax
    call print_int
    mov rdi, 10
    call fact
    mov rdi, rax
    call print_int
    mov rdi, 20
    call fact
    mov rdi, rax
    call print_int
    mov rax, 60
    mov rdi, 0
    syscall
fact:                       ; rax = rdi!
    cmp rdi, 1
    jg .more
    mov rax, 1
    ret
.more:
    push rdi
    dec rdi
    call fact
    pop rdi
    imul rax, rdi
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: 'Segmentation fault 고치기', text: `<code>triple(14)</code> 로 42 를 찍으려는데 <code>Segmentation fault</code> 가 나요. <code>ret</code> 이 어디로 점프하는지 생각해 보고 한 줄을 더해 고치세요.`,
        given: `section .text
global _start
_start:
    mov rdi, 14
    call triple
    mov rdi, rax
    call print_int          ; 42 가 나와야 해요
    mov rax, 60
    mov rdi, 0
    syscall
triple:                     ; rax = rdi × 3
    push rbx                ; rbx 를 쓸 거라 맡김
    mov rbx, rdi
    add rbx, rdi
    add rbx, rdi
    mov rax, rbx
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret`,
        needs: [['push rbx   …   pop rbx   ret', 'R11/3', 'ret 앞에서 스택을 제자리로'], ['ret', 'R11/0', '꼭대기를 꺼내 점프']],
        io: [{ output: `42` }],
        answer: `section .text
global _start
_start:
    mov rdi, 14
    call triple
    mov rdi, rax
    call print_int          ; 42 가 나와야 해요
    mov rax, 60
    mov rdi, 0
    syscall
triple:                     ; rax = rdi × 3
    push rbx                ; rbx 를 쓸 거라 맡김
    mov rbx, rdi
    add rbx, rdi
    add rbx, rdi
    mov rax, rbx
    pop rbx                 ; ret 앞에서 꼭 되찾기
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
    ],
    R12: [
      { title: '인자 3개: clamp(x, lo, hi)', text: `<code>clamp(x, lo, hi)</code> 를 만드세요. x 가 lo 보다 작으면 lo, hi 보다 크면 hi, 아니면 x 를 <code>rax</code> 로 돌려줘요. <code>clamp(15, 0, 10)</code> · <code>clamp(-3, 0, 10)</code> · <code>clamp(7, 0, 10)</code> 을 찍어요.`,
        needs: [['mov rdi, 15   mov rsi, 0   mov rdx, 10   call clamp', 'R12/0', '인자 1 · 2 · 3 = rdi · rsi · rdx'], ['mov rax, rdi   …   ret', 'R12/0', '결과는 rax']],
        io: [{ output: `10
0
7` }],
        answer: `section .text
global _start
_start:
    mov rdi, 15
    mov rsi, 0
    mov rdx, 10
    call clamp
    mov rdi, rax
    call print_int          ; 10
    mov rdi, -3
    mov rsi, 0
    mov rdx, 10
    call clamp
    mov rdi, rax
    call print_int          ; 0
    mov rdi, 7
    mov rsi, 0
    mov rdx, 10
    call clamp
    mov rdi, rax
    call print_int          ; 7
    mov rax, 60
    mov rdi, 0
    syscall
clamp:                      ; clamp(x, lo, hi): x 를 lo ~ hi 안으로
    mov rax, rdi
    cmp rax, rsi
    jge .not_low
    mov rax, rsi            ; x < lo 면 lo
.not_low:
    cmp rax, rdx
    jle .done
    mov rax, rdx            ; x > hi 면 hi
.done:
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: '지역 변수 두 칸: print_hms', text: `초를 받아 시 · 분 · 초를 한 줄씩 찍는 <code>print_hms(초)</code> 를 만드세요. <code>print_int</code> 를 부르면 레지스터가 바뀌니까, 남은 초는 스택 프레임의 지역 변수(<code>[rbp - 8]</code> · <code>[rbp - 16]</code>)에 둬요. 3725 초와 86399 초를 찍어요.`,
        needs: [['push rbp   mov rbp, rsp   sub rsp, 16', 'R12/2', '스택 프레임 만들기'], ['mov [rbp - 8], rdx   mov rax, [rbp - 8]', 'R12/2', '지역 변수에 두고 꺼내기'], ['leave   ret', 'R12/2', '프레임 정리하고 돌아가기']],
        io: [{ output: `1
2
5
23
59
59` }],
        answer: `section .text
global _start
_start:
    mov rdi, 3725
    call print_hms          ; 1 시간 2 분 5 초
    mov rdi, 86399
    call print_hms          ; 23 시간 59 분 59 초
    mov rax, 60
    mov rdi, 0
    syscall
print_hms:                  ; print_hms(초): 시 · 분 · 초를 한 줄씩
    push rbp
    mov rbp, rsp
    sub rsp, 16             ; [rbp - 8] = 남은 초, [rbp - 16] = 마지막 초
    mov rax, rdi
    xor edx, edx
    mov rcx, 3600
    div rcx                 ; rax = 시, rdx = 남은 초
    mov [rbp - 8], rdx
    mov rdi, rax
    call print_int          ; 시
    mov rax, [rbp - 8]
    xor edx, edx
    mov rcx, 60
    div rcx                 ; rax = 분, rdx = 초
    mov [rbp - 16], rdx
    mov rdi, rax
    call print_int          ; 분
    mov rdi, [rbp - 16]
    call print_int          ; 초
    leave
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: '규약 어긴 square 고치기', text: `1² + 2² + 3² = 14 를 찍어야 하는데 18 이 나와요. <code>_start</code> 는 규약대로 합계를 <code>rbx</code> 에 뒀어요. 규약을 어긴 쪽은 <code>square</code> 예요. <code>_start</code> 는 그대로 두고 <code>square</code> 만 고치세요.`,
        given: `section .text
global _start
_start:
    xor ebx, ebx            ; rbx = 합계
    mov r12, 1              ; r12 = n
again:
    mov rdi, r12
    call square
    add rbx, rax            ; 합계 += n × n
    inc r12
    cmp r12, 3
    jle again
    mov rdi, rbx
    call print_int          ; 1 + 4 + 9 = 14 가 나와야 해요
    mov rax, 60
    mov rdi, 0
    syscall
square:                     ; rax = rdi × rdi
    mov rbx, rdi
    imul rbx, rdi
    mov rax, rbx
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret`,
        needs: [['push rbx   …   pop rbx', 'R12/1', 'rbx 는 불리는 쪽이 지킴']],
        io: [{ output: `14` }],
        answer: `section .text
global _start
_start:
    xor ebx, ebx            ; rbx = 합계
    mov r12, 1              ; r12 = n
again:
    mov rdi, r12
    call square
    add rbx, rax            ; 합계 += n × n
    inc r12
    cmp r12, 3
    jle again
    mov rdi, rbx
    call print_int          ; 1 + 4 + 9 = 14 가 나와야 해요
    mov rax, 60
    mov rdi, 0
    syscall
square:                     ; rax = rdi × rdi
    push rbx                ; 불리는 쪽이 rbx 를 지킴
    mov rbx, rdi
    imul rbx, rdi
    mov rax, rbx
    pop rbx
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
    ],
    R13: [
      { title: '구구단 7단', text: `<code>printf</code> 로 <code>7 x 1 = 7</code> 부터 <code>7 x 9 = 63</code> 까지 찍으세요. 단(7)과 곱하는 수는 <code>printf</code> 를 불러도 지켜지는 레지스터에 두고, push 수로 정렬을 맞춰요. 빌드는 <code>gcc -no-pie</code>.`,
        needs: [['extern printf   global main', 'R13/0', 'C 라이브러리 쓰기 · main 에서 시작'], ['lea rdi, [fmt]   xor eax, eax   call printf', 'R13/1', '형식 주소 · 가변 인자 규칙'], ['push rbp   push rbx   push r12', 'R13/3', 'push 홀수 번 = 16바이트 정렬']],
        io: [{ output: `7 x 1 = 7
7 x 2 = 14
7 x 3 = 21
7 x 4 = 28
7 x 5 = 35
7 x 6 = 42
7 x 7 = 49
7 x 8 = 56
7 x 9 = 63` }],
        answer: `default rel
section .data
fmt db "%ld x %ld = %ld", 10, 0
section .text
global main
extern printf
main:
    push rbp
    push rbx
    push r12                ; push 세 번 — 16바이트 정렬
    mov r12, 7              ; 단
    mov rbx, 1              ; 곱하는 수 1 ~ 9
again:
    lea rdi, [fmt]
    mov rsi, r12
    mov rdx, rbx
    mov rcx, r12
    imul rcx, rbx
    xor eax, eax
    call printf
    inc rbx
    cmp rbx, 9
    jle again
    pop r12
    pop rbx
    pop rbp
    xor eax, eax
    ret` },
      { title: '배열을 printf 로', text: `<code>arr dq 3, 1, 4, 1, 5, 9</code> 의 칸을 <code>arr[번호] = 값</code> 모양으로 한 줄씩 찍고, 마지막 줄에 <code>합 = …</code> 을 찍으세요.`,
        needs: [['fmt db "arr[%ld] = %ld", 10, 0', 'R13/1', '%ld 두 개 = rsi · rdx'], ['push rbp   push rbx   push r12', 'R13/3', '번호 · 합을 지켜지는 레지스터에']],
        io: [{ output: `arr[0] = 3
arr[1] = 1
arr[2] = 4
arr[3] = 1
arr[4] = 5
arr[5] = 9
합 = 23` }],
        answer: `default rel
section .data
arr dq 3, 1, 4, 1, 5, 9
n equ 6
fmt db "arr[%ld] = %ld", 10, 0
fmt_sum db "합 = %ld", 10, 0
section .text
global main
extern printf
main:
    push rbp
    push rbx                ; rbx = 번호
    push r12                ; r12 = 합
    xor ebx, ebx
    mov r12, 0
again:
    lea rax, [arr]
    mov rdx, [rax + rbx*8]  ; 3번째 인자: arr[번호]
    add r12, rdx
    lea rdi, [fmt]
    mov rsi, rbx            ; 2번째 인자: 번호
    xor eax, eax
    call printf
    inc rbx
    cmp rbx, n
    jl again
    lea rdi, [fmt_sum]
    mov rsi, r12
    xor eax, eax
    call printf
    pop r12
    pop rbx
    pop rbp
    xor eax, eax
    ret` },
      { title: '글자 길이 printf', text: `글자 하나를 받아 <code>글자: 길이 바이트</code> 한 줄을 찍는 함수 <code>show</code> 를 만들고, <code>main</code> 에서 <code>"hello"</code> · <code>"안녕"</code> · <code>"x86-64"</code> 로 불러요. 길이는 C 라이브러리의 <code>strlen</code> 으로. <code>show</code> 에 들어온 순간의 정렬도 따져 봐요.`,
        needs: [['extern printf, strlen', 'R13/2', '여럿을 한 줄에'], ['"%s: %ld 바이트", 10, 0', 'R13/1', '%s 에는 주소'], ['push rbx   …   pop rbx', 'R13/3', '들어오면 16의 배수 + 8 → push 한 번']],
        io: [{ output: `hello: 5 바이트
안녕: 6 바이트
x86-64: 6 바이트` }],
        answer: `default rel
section .data
s1 db "hello", 0
s2 db "안녕", 0
s3 db "x86-64", 0
fmt db "%s: %ld 바이트", 10, 0
section .text
global main
extern printf, strlen
main:
    push rbp                ; 이제 rsp 는 16의 배수
    lea rdi, [s1]
    call show
    lea rdi, [s2]
    call show
    lea rdi, [s3]
    call show
    pop rbp
    xor eax, eax
    ret
show:                       ; show(s): 「s: 길이 바이트」 한 줄
    push rbx                ; 들어오면 16의 배수 + 8 → push 한 번으로 맞춤
    mov rbx, rdi            ; s 를 지켜지는 rbx 에
    call strlen             ; rax = 길이
    lea rdi, [fmt]
    mov rsi, rbx
    mov rdx, rax
    xor eax, eax
    call printf
    pop rbx
    ret` },
      { title: 'syscall 대신 ret 으로', text: `이 프로그램은 터미널에서 <code>./prog</code> 로 돌리면 글자가 잘 보여요. 그런데 <code>./prog | cat; echo $?</code> 이나 <code>./prog &gt; out.txt</code> 로 돌리면 글자가 사라지고 종료 코드 7 만 남아요. <code>main</code> 답게 <code>ret</code> 으로 끝내 고치세요. 종료 코드는 그대로 7 이에요.`, echoExit: true,
        given: `default rel
section .data
msg db "끝까지 보여요?", 10, 0
section .text
global main
extern printf
main:
    push rbp
    lea rdi, [msg]
    xor eax, eax
    call printf
    mov rax, 60             ; exit(7)
    mov rdi, 7
    syscall`,
        needs: [['pop rbp   mov eax, 7   ret', 'R13/2', 'main 의 rax = 종료 코드'], ['printf', 'R13/2', '글자를 모아 뒀다가 내보냄(버퍼)']],
        io: [{ output: `끝까지 보여요?
7` }],
        answer: `default rel
section .data
msg db "끝까지 보여요?", 10, 0
section .text
global main
extern printf
main:
    push rbp
    lea rdi, [msg]
    xor eax, eax
    call printf
    pop rbp
    mov eax, 7              ; return 7 → 종료 코드 7
    ret` },
    ],
    RB3: [
      { title: '① strlen · print_str · print_int', text: `챕터 3 의 함수 모음을 만들어요. 모두 <b>호출 규약대로</b>(인자 <code>rdi</code>, 결과 <code>rax</code>, <code>rbx</code> 를 쓰면 <code>push</code> · <code>pop</code>). 시작은 <code>global main</code>, 빌드는 <code>gcc -no-pie</code>, 끝은 <code>ret</code>.<ul><li><code>strlen(s)</code> → 0 앞까지의 바이트 수</li><li><code>print_str(s)</code> → s 와 줄바꿈을 <code>write</code></li><li><code>show_len(s)</code> → s 한 줄, 길이 한 줄(<code>print_int</code>)</li></ul><code>main</code> 에서 <code>"hello"</code> · <code>"어셈블리"</code> · 빈 글자(0 하나)로 <code>show_len</code> 을 불러요. C 라이브러리에도 <code>strlen</code> 이 있지만, <code>global</code> 을 안 붙인 라벨은 이 파일 안에서만 쓰여서 부딪치지 않아요.`,
        needs: [['strlen:   …   ret', 'R11/0', '함수 = ret 으로 끝나는 라벨'], ['push rbx   mov rbx, rdi   …   pop rbx', 'R12/1', '부르는 동안 인자 간직하기'], ['call print_int', 'R11/2', '숫자 출력 함수'], ['global main   ret', 'R13/0', 'gcc -no-pie 로 빌드']],
        io: [{ output: `hello
5
어셈블리
12

0` }],
        answer: `default rel
section .data
s1 db "hello", 0
s2 db "어셈블리", 0
s3 db 0                     ; 빈 글자: 0 바이트 하나뿐
nl db 10
section .text
global main
main:
    push rbp
    lea rdi, [s1]
    call show_len
    lea rdi, [s2]
    call show_len
    lea rdi, [s3]
    call show_len
    pop rbp
    xor eax, eax            ; return 0
    ret
show_len:                   ; show_len(s): s 한 줄, 길이 한 줄
    push rbx
    mov rbx, rdi            ; s 를 지켜지는 rbx 에
    call print_str
    mov rdi, rbx
    call strlen
    mov rdi, rax
    call print_int
    pop rbx
    ret
strlen:                     ; rax = 0 바이트 앞까지의 길이
    xor eax, eax
.next:
    cmp byte [rdi + rax], 0
    je .done
    inc rax
    jmp .next
.done:
    ret
print_str:                  ; print_str(s): s 와 줄바꿈을 write
    push rbx
    mov rbx, rdi
    call strlen
    mov rdx, rax            ; write(1, s, 길이)
    mov rsi, rbx
    mov rdi, 1
    mov rax, 1
    syscall
    mov rax, 1              ; write(1, nl, 1)
    mov rdi, 1
    lea rsi, [nl]
    mov rdx, 1
    syscall
    pop rbx
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: '② to_upper: 한 줄을 대문자로', text: `<code>to_upper(s)</code> 를 만드세요. s 의 <code>a</code>~<code>z</code> 를 <b>그 자리에서</b> <code>A</code>~<code>Z</code> 로 바꾸고, 다른 바이트(숫자 · 기호 · 한글)는 그대로 둬요. <code>main</code> 은 <code>read</code> 로 한 줄을 받아 끝의 줄바꿈을 0 으로 바꾸고, <code>to_upper</code> → ① 의 <code>print_str</code> 순서로 불러요.`,
        needs: [['to_upper:   …   ret', 'R11/0', '함수로 만들기'], ['lea rdi, [buf]   call to_upper', 'R11/1', '인자는 rdi(글자의 주소)'], ['global main', 'R13/0', 'main 에서 시작']],
        io: [{ input: `hello, asm!\n`, output: `HELLO, ASM!` }, { input: `Ubuntu 24.04 LTS\n`, output: `UBUNTU 24.04 LTS` }, { input: `안녕 abc\n`, output: `안녕 ABC` }],
        answer: `default rel
section .data
nl db 10
section .bss
buf resb 256
section .text
global main
main:
    push rbp
    mov rax, 0              ; read(0, buf, 255)
    mov rdi, 0
    lea rsi, [buf]
    mov rdx, 255
    syscall
    mov byte [rsi + rax], 0         ; 받은 끝에 0
    cmp byte [rsi + rax - 1], 10
    jne .ready
    mov byte [rsi + rax - 1], 0     ; 줄바꿈도 0 으로
.ready:
    lea rdi, [buf]
    call to_upper
    lea rdi, [buf]
    call print_str
    pop rbp
    xor eax, eax
    ret
to_upper:                   ; to_upper(s): s 의 a~z 를 그 자리에서 A~Z 로
.next:
    mov al, [rdi]
    cmp al, 0
    je .done
    cmp al, 'a'
    jb .skip
    cmp al, 'z'
    ja .skip
    xor al, 0x20            ; 소문자 → 대문자
    mov [rdi], al
.skip:
    inc rdi
    jmp .next
.done:
    ret
strlen:                     ; rax = 0 바이트 앞까지의 길이
    xor eax, eax
.next:
    cmp byte [rdi + rax], 0
    je .done
    inc rax
    jmp .next
.done:
    ret
print_str:                  ; print_str(s): s 와 줄바꿈을 write
    push rbx
    mov rbx, rdi
    call strlen
    mov rdx, rax
    mov rsi, rbx
    mov rdi, 1
    mov rax, 1
    syscall
    mov rax, 1
    mov rdi, 1
    lea rsi, [nl]
    mov rdx, 1
    syscall
    pop rbx
    ret` },
      { title: '③ max_of(arr, n)', text: `qword 배열의 주소와 칸 수를 받아 가장 큰 값을 돌려주는 <code>max_of(arr, n)</code> 을 만드세요(음수도 있어요, n 은 1 이상). <code>[3, -7, 12, 5]</code> · <code>[-5, -2, -9]</code> · <code>[42]</code> 로 불러 <code>print_int</code> 로 찍어요.`,
        needs: [['lea rdi, [arr1]   mov rsi, 4   call max_of', 'R12/0', '인자 1 = rdi, 인자 2 = rsi'], ['mov rdi, rax   call print_int', 'R11/2', '결과 찍기']],
        io: [{ output: `12
-2
42` }],
        answer: `default rel
section .data
arr1 dq 3, -7, 12, 5
arr2 dq -5, -2, -9
arr3 dq 42
section .text
global main
main:
    push rbp
    lea rdi, [arr1]
    mov rsi, 4
    call max_of
    mov rdi, rax
    call print_int          ; 12
    lea rdi, [arr2]
    mov rsi, 3
    call max_of
    mov rdi, rax
    call print_int          ; -2
    lea rdi, [arr3]
    mov rsi, 1
    call max_of
    mov rdi, rax
    call print_int          ; 42
    pop rbp
    xor eax, eax
    ret
max_of:                     ; max_of(arr, n): 가장 큰 값 (n 은 1 이상)
    mov rax, [rdi]          ; 일단 0번 칸
    mov rcx, 1
.next:
    cmp rcx, rsi
    jge .done
    mov rdx, [rdi + rcx*8]
    cmp rdx, rax
    jle .skip
    mov rax, rdx            ; 더 크면 바꿈
.skip:
    inc rcx
    jmp .next
.done:
    ret
; print_int: rdi 의 정수(부호 있음)를 10진 글자 + 줄바꿈으로 출력. rax rcx rdx rsi rdi r8 r11 을 씀(규약상 부르는 쪽이 지킬 레지스터)
print_int:
    sub rsp, 32             ; 글자 버퍼 32바이트(스택)
    mov rax, rdi
    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움
    mov byte [rsi], 10      ; 맨 끝은 줄바꿈
    mov r8, 1               ; 지금까지 글자 수
    mov rcx, 10
    test rax, rax
    jns .digits
    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'
.digits:
    xor edx, edx
    div rcx                 ; rax = 몫, rdx = 나머지(0~9)
    add dl, '0'
    dec rsi
    mov [rsi], dl
    inc r8
    test rax, rax
    jnz .digits
    test rdi, rdi
    jns .write
    dec rsi
    mov byte [rsi], '-'
    inc r8
.write:
    mov rax, 1              ; write(1, rsi, r8)
    mov rdx, r8
    mov rdi, 1
    syscall
    add rsp, 32
    ret` },
      { title: '④ 모두 모아 printf 한 줄', text: `<code>"hello asm"</code> 을 <code>to_upper</code> 로 바꾸고, <code>strlen</code> 으로 길이를, <code>max_of</code> 로 <code>nums dq 4, 8, -15, 16, 23, -42</code> 의 최댓값을 구해 <code>printf</code> 한 번으로 찍으세요. 함수를 부르는 동안 길이 · 최댓값은 <code>rbx</code> · <code>r12</code> 에 간직하고, push 수로 정렬을 맞춰요.<br><span class="muted small">이 문제는 숫자를 <code>printf</code> 로만 찍어요. <code>write</code> 로 바로 쓰는 <code>print_int</code> 와 글자를 모아 뒀다 쓰는 <code>printf</code> 를 섞으면 나오는 순서가 뒤바뀔 수 있어요.</span>`,
        needs: [['push rbp   push rbx   push r12', 'R13/3', 'push 세 번 = 정렬 · 지킬 레지스터 맡기기'], ['mov rbx, rax', 'R12/1', '부르는 동안 간직할 값은 rbx · r12'], ['lea rdi, [fmt]   lea rsi, [name]   mov rdx, rbx   mov rcx, r12   xor eax, eax   call printf', 'R13/1', '인자 넷: 형식 · %s · %ld · %ld']],
        io: [{ output: `HELLO ASM / 9 글자 / 최댓값 23` }],
        answer: `default rel
section .data
name db "hello asm", 0
nums dq 4, 8, -15, 16, 23, -42
fmt db "%s / %ld 글자 / 최댓값 %ld", 10, 0
section .text
global main
extern printf
main:
    push rbp
    push rbx
    push r12                ; push 세 번 → printf 앞 rsp 가 16의 배수
    lea rdi, [name]
    call to_upper           ; name 이 그 자리에서 대문자로
    lea rdi, [name]
    call strlen
    mov rbx, rax            ; rbx = 길이 (함수를 더 불러도 지켜짐)
    lea rdi, [nums]
    mov rsi, 6
    call max_of
    mov r12, rax            ; r12 = 최댓값
    lea rdi, [fmt]
    lea rsi, [name]
    mov rdx, rbx
    mov rcx, r12
    xor eax, eax
    call printf
    pop r12
    pop rbx
    pop rbp
    xor eax, eax
    ret
to_upper:                   ; to_upper(s): a~z → A~Z
.next:
    mov al, [rdi]
    cmp al, 0
    je .done
    cmp al, 'a'
    jb .skip
    cmp al, 'z'
    ja .skip
    xor al, 0x20
    mov [rdi], al
.skip:
    inc rdi
    jmp .next
.done:
    ret
strlen:                     ; rax = 0 바이트 앞까지의 길이
    xor eax, eax
.next:
    cmp byte [rdi + rax], 0
    je .done
    inc rax
    jmp .next
.done:
    ret
max_of:                     ; max_of(arr, n): 가장 큰 값
    mov rax, [rdi]
    mov rcx, 1
.next:
    cmp rcx, rsi
    jge .done
    mov rdx, [rdi + rcx*8]
    cmp rdx, rax
    jle .skip
    mov rax, rdx
.skip:
    inc rcx
    jmp .next
.done:
    ret` },
    ],
    R14: [
      { title: '두 수 더하기 · 빼기: add 와 sub', text: '<code>calc.asm</code> 에 함수 둘 — <code>long add(long a, long b)</code>(a + b) 와 <code>long sub(long a, long b)</code>(a − b) — 을 만들고, <code>main.c</code> 가 차례로 <code>add(2, 3)</code> · <code>add(-10, 4)</code> · <code>add(5000000000, 5000000000)</code> · <code>sub(10, 3)</code> · <code>sub(3, 10)</code> 를 불러 한 줄씩 찍게 하세요. 빌드는 <code>nasm -f elf64 calc.asm -o calc.o</code> → <code>gcc -no-pie main.c calc.o -o calc</code> → <code>./calc</code>. 50억은 32비트에 안 들어가니 <code>long</code> · <code>rax</code> 로 해야 맞아요.',
        needs: [['long add(long a, long b);', 'R14/0', 'C 쪽 선언 — main 위에'], ['global add', 'R14/0', 'asm 쪽에서 이름 내놓기'], ['gcc -no-pie main.c calc.o -o calc', 'R14/1', 'C 와 .o 를 묶기'], ['printf("%ld\\n", add(2, 3));', 'R14/0', 'long 을 10진으로 찍기']],
        io: [{ output: '5\n-6\n10000000000\n7\n-7' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long add(long a, long b);
long sub(long a, long b);

int main(void) {
    printf("%ld\\n", add(2, 3));
    printf("%ld\\n", add(-10, 4));
    printf("%ld\\n", add(5000000000, 5000000000));
    printf("%ld\\n", sub(10, 3));
    printf("%ld\\n", sub(3, 10));
    return 0;
}
; ==== 파일: calc.asm ====
section .text
global add
global sub
add:                        ; rdi = a, rsi = b → rax = a + b
    mov rax, rdi
    add rax, rsi
    ret
sub:                        ; rdi = a, rsi = b → rax = a - b
    mov rax, rdi
    sub rax, rsi
    ret` },
      { title: '배열 합: sum(long *arr, long n)', text: '<code>long sum(long *arr, long n)</code> 을 어셈블리로 만드세요 — 배열의 앞 <code>n</code> 칸을 더해 돌려줘요. <code>main.c</code> 에서 <code>long a[5] = {3, 1, 4, 1, 5};</code> · <code>long b[3] = {1000000000000, -2, 3};</code> 를 만들고 <code>sum(a, 5)</code> · <code>sum(b, 3)</code> · <code>sum(a, 0)</code> 을 찍어요. 칸이 0개면 0 이어야 해요.',
        needs: [['long sum(long *arr, long n);', 'R14/3', '배열 = 첫 칸의 주소'], ['add rax, [rdi + rcx*8]', 'R14/3', 'rcx 번째 칸(8바이트씩)'], ['cmp rcx, rsi   jge .done', 'R14/3', 'n 칸 다 했으면 끝'], ['long a[5] = {3, 1, 4, 1, 5};', 'R14/3', 'C 배열 만들기']],
        io: [{ output: '14\n1000000000001\n0' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long sum(long *arr, long n);

int main(void) {
    long a[5] = {3, 1, 4, 1, 5};
    long b[3] = {1000000000000, -2, 3};
    printf("%ld\\n", sum(a, 5));
    printf("%ld\\n", sum(b, 3));
    printf("%ld\\n", sum(a, 0));
    return 0;
}
; ==== 파일: sum.asm ====
section .text
global sum
sum:                        ; rdi = 배열 주소, rsi = 칸 수 → rax = 합
    xor eax, eax            ; rax = 합 0
    xor ecx, ecx            ; rcx = 칸 번호 0
.loop:
    cmp rcx, rsi
    jge .done
    add rax, [rdi + rcx*8]
    inc rcx
    jmp .loop
.done:
    ret` },
      { title: '문자열 거꾸로: reverse(char *s)', text: '<code>void reverse(char *s)</code> 를 어셈블리로 만드세요. 문자열을 <b>그 자리에서</b> 거꾸로 뒤집는데, 맨 끝의 줄바꿈(10)은 제자리에 둬요(줄바꿈이나 0 을 만나기 전까지만 뒤집기). <code>main.c</code> 는 <code>fgets</code> 로 한 줄씩 읽어 <code>reverse</code> 를 부르고 <code>printf("%s", line)</code> 로 찍어요. 방법: 앞 손가락 <code>rdi</code>, 끝 손가락 <code>rsi</code>(마지막 글자)를 두고 두 바이트를 바꾼 뒤 서로 한 칸씩 다가가요. 만나거나 지나치면 끝. 한글은 한 글자가 3바이트라 뒤집으면 깨지니 영어로만 해 봐요.',
        needs: [['fgets(line, sizeof line, stdin)', 'R14/4', 'C 가 한 줄 읽기(끝이면 NULL)'], ['void reverse(char *s);', 'R14/4', '문자열 = 첫 글자의 주소'], ['mov al, [rdi]   mov [rdi], al', 'R14/4', '바이트 읽고 그 자리에 쓰기'], ['cmp rdi, rsi   jae .done', 'R14/4', '두 손가락이 만나면 끝(주소는 부호 없는 비교)']],
        io: [{ input: 'hello\nasm and C\nracecar\n', output: 'olleh\nC dna msa\nracecar' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

void reverse(char *s);

int main(void) {
    char line[100];
    while (fgets(line, sizeof line, stdin) != NULL) {
        reverse(line);
        printf("%s", line);
    }
    return 0;
}
; ==== 파일: reverse.asm ====
section .text
global reverse
reverse:                    ; rdi = 문자열 주소. 줄바꿈이나 0 앞까지 뒤집기
    mov rsi, rdi            ; rsi 로 끝 찾기
.find:
    mov al, [rsi]
    cmp al, 0
    je .found
    cmp al, 10
    je .found
    inc rsi
    jmp .find
.found:
    dec rsi                 ; rsi = 마지막 글자
.swap:
    cmp rdi, rsi
    jae .done               ; 만나거나 지나치면 끝
    mov al, [rdi]
    mov dl, [rsi]
    mov [rdi], dl
    mov [rsi], al
    inc rdi
    dec rsi
    jmp .swap
.done:
    ret` },
      { title: '큰 수에서 틀리는 곱셈 고치기', text: '아래 <code>mul</code> 은 작은 수는 맞는데 <code>mul(100000, 100000)</code> 이 <code>1410065408</code>, <code>mul(-3, 5)</code> 가 <code>4294967281</code> 로 나와요. C 는 <code>long</code> 이라고 선언했는데 어셈블리는 어떤 크기의 레지스터를 쓰고 있나요? 고쳐서 <code>42</code> · <code>10000000000</code> · <code>-15</code> 가 나오게 하세요.',
        given: `// ==== 파일: main.c ====
#include <stdio.h>

long mul(long a, long b);

int main(void) {
    printf("%ld\\n", mul(6, 7));
    printf("%ld\\n", mul(100000, 100000));
    printf("%ld\\n", mul(-3, 5));
    return 0;
}
; ==== 파일: mul.asm ====
section .text
global mul
mul:                        ; rdi = a, rsi = b → rax = a * b
    mov eax, edi
    imul eax, esi
    ret`,
        needs: [['mov rax, rdi', 'R14/2', 'long 은 64비트 이름(rdi · rax)으로'], ['mov eax, edi', 'R14/2', '32비트에 쓰면 위 32비트가 0 — 버그의 원인'], ['imul rax, rsi', 'R14/2', '64비트 곱하기']],
        io: [{ output: '42\n10000000000\n-15' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long mul(long a, long b);

int main(void) {
    printf("%ld\\n", mul(6, 7));
    printf("%ld\\n", mul(100000, 100000));
    printf("%ld\\n", mul(-3, 5));
    return 0;
}
; ==== 파일: mul.asm ====
section .text
global mul
mul:                        ; rdi = a, rsi = b → rax = a * b
    mov rax, rdi            ; long 이니 64비트 이름으로
    imul rax, rsi
    ret` },
    ],
    R15: [
      { title: '내 C 를 어셈블리로: square.c', text: '<code>square.c</code> 에 <code>long square(long x) { return x * x; }</code> 한 함수만 쓰고, <code>-O0</code> 과 <code>-O2</code> 로 각각 <code>gcc -S</code> 해서 비교해 보세요. 두 번째는 <code>-o square2.s</code> 로 다른 이름에 저장해요.', noRun: true,
        needs: [['gcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables square.c', 'R15/0', 'C → 인텔 문법 .s'], ['QWORD PTR -8[rbp]', 'R15/0', '= NASM 의 qword [rbp - 8]'], ['gcc -S -O2 -masm=intel -fno-asynchronous-unwind-tables square.c -o square2.s', 'R15/2', '최적화하면']],
        checks: [{ text: '`square.s` 에 `.globl square` 줄이 있어요(= NASM 의 `global square`)' }, { text: '`-O0` 쪽 `square:` 에 `push rbp` · `mov QWORD PTR -8[rbp], rdi` · `imul rax, rax` · `pop rbp` 가 있어요' }, { text: '`-O2` 쪽(`square2.s`)의 `square:` 는 `endbr64` 다음 `imul rdi, rdi` · `mov rax, rdi` · `ret` 세 줄뿐이에요(gcc 버전에 따라 조금 달라도 돼요)' }],
        answer: 'cd ~/asm\n# square.c 내용: long square(long x) { return x * x; }\ngcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables square.c\ngcc -S -O2 -masm=intel -fno-asynchronous-unwind-tables square.c -o square2.s\ncat square.s\ncat square2.s' },
      { title: '어셈블리를 읽고 C 로: if', text: '어떤 C 함수 <code>long mystery(long a, long b)</code> 를 <code>gcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables</code> 로 바꿨더니 이렇게 나왔어요. 읽고 <b>같은 일을 하는 C 함수</b>를 쓴 뒤, <code>main</code> 에서 <code>mystery(3, 10)</code> · <code>mystery(10, 3)</code> · <code>mystery(-5, 5)</code> 를 찍으세요. (C 파일 하나라 빌드는 <code>gcc -no-pie main.c -o main</code>.)<pre>mystery:\n    endbr64\n    push    rbp\n    mov     rbp, rsp\n    mov     QWORD PTR -8[rbp], rdi\n    mov     QWORD PTR -16[rbp], rsi\n    mov     rax, QWORD PTR -8[rbp]\n    cmp     rax, QWORD PTR -16[rbp]\n    jge     .L2\n    mov     rax, QWORD PTR -16[rbp]\n    sub     rax, QWORD PTR -8[rbp]\n    jmp     .L3\n.L2:\n    mov     rax, QWORD PTR -8[rbp]\n    sub     rax, QWORD PTR -16[rbp]\n.L3:\n    pop     rbp\n    ret</pre><code>-8[rbp]</code> 가 <code>a</code>, <code>-16[rbp]</code> 가 <code>b</code> 예요. gcc 는 <code>if</code> 의 <b>반대</b> 조건으로 건너뛰어요 — <code>jge</code> 로 건너뛰면 원래 조건은?',
        needs: [['if (a > b) return a;', 'R15/1', 'if 는 cmp + 반대 조건 점프'], ['mov rax, QWORD PTR -8[rbp]', 'R15/0', '-O0 은 인자를 스택에 두고 꺼내 씀'], ['long mystery(long a, long b) { … }', 'R15/0', 'C 함수 정의']],
        io: [{ output: '7\n7\n10' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long mystery(long a, long b) {
    if (a < b)
        return b - a;
    return a - b;
}

int main(void) {
    printf("%ld\\n", mystery(3, 10));
    printf("%ld\\n", mystery(10, 3));
    printf("%ld\\n", mystery(-5, 5));
    return 0;
}` },
      { title: '어셈블리를 읽고 C 로: for', text: '이번엔 반복이 있는 <code>long mystery2(long n)</code> 이에요(같은 명령으로 만든 <code>-O0</code> 결과). 읽고 같은 일을 하는 C 를 쓴 뒤 <code>mystery2(0)</code> · <code>mystery2(4)</code> · <code>mystery2(10)</code> 을 찍으세요.<pre>mystery2:\n    endbr64\n    push    rbp\n    mov     rbp, rsp\n    mov     QWORD PTR -24[rbp], rdi\n    mov     QWORD PTR -16[rbp], 1\n    mov     QWORD PTR -8[rbp], 0\n    jmp     .L5\n.L6:\n    mov     rdx, QWORD PTR -16[rbp]\n    mov     rax, rdx\n    add     rax, rax\n    add     rax, rdx\n    mov     QWORD PTR -16[rbp], rax\n    add     QWORD PTR -8[rbp], 1\n.L5:\n    mov     rax, QWORD PTR -8[rbp]\n    cmp     rax, QWORD PTR -24[rbp]\n    jl      .L6\n    mov     rax, QWORD PTR -16[rbp]\n    pop     rbp\n    ret</pre>변수 셋: <code>-24[rbp]</code> = n, <code>-16[rbp]</code> = 결과(처음 1), <code>-8[rbp]</code> = 반복 번호(처음 0). <code>.L6</code> 의 세 줄 <code>mov rax, rdx</code> · <code>add rax, rax</code> · <code>add rax, rdx</code> 는 결과에 무엇을 곱하는 걸까요?',
        needs: [['for (long i = 0; i < n; i++)', 'R15/1', 'for → 초기화 · jmp 검사 · 몸통 · i++ · 검사'], ['add QWORD PTR -8[rbp], 1', 'R15/1', 'i++'], ['cmp rax, QWORD PTR -24[rbp]   jl .L6', 'R15/1', '조건이 맞으면 위로']],
        io: [{ output: '1\n81\n59049' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long mystery2(long n) {
    long r = 1;
    for (long i = 0; i < n; i++)
        r = r * 3;
    return r;
}

int main(void) {
    printf("%ld\\n", mystery2(0));
    printf("%ld\\n", mystery2(4));
    printf("%ld\\n", mystery2(10));
    return 0;
}` },
      { title: 'objdump 로 내 실행 파일 읽기', text: '[[레슨:R14]] 만들어 보기 1 의 <code>calc</code>(<code>add</code> · <code>sub</code>)를 <code>objdump</code> 로 열어, 내가 쓴 함수와 C 가 그것을 부르는 곳을 찾아보세요.', noRun: true,
        needs: [['objdump -d -M intel --disassemble=add calc', 'R15/3', '함수 하나만 보기'], ['objdump -d -M intel calc | less', 'R15/3', '전부 보기'], ['objdump -d calc', 'R15/4', 'AT&T 로 보기']],
        checks: [{ text: '`<add>:` 와 `<sub>:` 아래 명령이 내 `calc.asm` 과 같아요(`mov rax,rdi` · `add rax,rsi` · `ret`)' }, { text: '`<main>:` 안의 `call 주소 <add>` 의 주소가 `<add>:` 앞의 주소와 같아요' }, { text: '`call` 바로 앞에 `mov esi,0x3` · `mov edi,0x2` 처럼 인자를 넣는 줄이 보여요' }, { text: '`call ... <printf@plt>` 줄이 보여요' }, { text: '`-M intel` 을 빼면 같은 줄이 `mov %rdi,%rax` 처럼(순서 반대 · %) 보여요' }],
        answer: 'objdump -d -M intel --disassemble=add calc\nobjdump -d -M intel --disassemble=sub calc\nobjdump -d -M intel calc | less      # /main 으로 찾기, q 로 나가기\nobjdump -d --disassemble=add calc' },
    ],
    R16: [
      { title: 'gdb 로 레지스터 따라가기', text: '아래 <code>trace.asm</code> 을 <code>-g -F dwarf</code> 로 빌드해 gdb 에서 <code>break _start</code> → <code>run</code> 한 뒤, <code>stepi</code> 를 한 번씩 할 때마다 <code>rax</code> · <code>rbx</code> · <code>rcx</code> 가 어떻게 바뀌는지 따라가 보세요. <b>stepi 전에 값을 먼저 짐작</b>하고 확인하면 좋아요.<pre class="code">section .text\nglobal _start\n_start:\n    mov rax, 5\n    mov rbx, 3\n    add rax, rbx\n    imul rax, rax\n    mov rcx, rax\n    shr rcx, 2\n    sub rax, rcx\n    mov rdi, rax\n    mov rax, 60\n    syscall</pre>',
        noRun: true,
        needs: [['nasm -f elf64 -g -F dwarf trace.asm -o trace.o', 'R16/0', '줄 번호 정보 넣기'], ['break _start   run   stepi', 'R16/1', '멈추고 한 명령씩'], ['info registers rax rbx', 'R16/1', '레지스터 보기'], ['p $rax', 'R16/1', '10진으로 하나만']],
        checks: [{ text: '`run` 직후 멈춘 줄이 `trace.asm:4` 의 `mov rax, 5` 예요(아직 실행 전)' }, { text: '`stepi` 3번 뒤(`imul` 줄에서 멈춤) `info registers rax rbx` 가 `rax 0x8 8` · `rbx 0x3 3` 이에요' }, { text: '한 번 더 `stepi` 하면 `p $rax` 가 `64`, 두 번 더 하면 `info registers rcx` 가 `0x10 16` 이에요' }, { text: '`sub` 뒤 `p $rax` 가 `48`, `continue` 하면 `exited with code 060`(8진수 = 48)이고 터미널에서 `./trace; echo $?` 도 `48` 이에요' }],
        answer: 'nasm -f elf64 -g -F dwarf trace.asm -o trace.o\nld trace.o -o trace\ngdb ./trace\n(gdb) break _start\n(gdb) run\n(gdb) stepi            ← 3번\n(gdb) info registers rax rbx\n(gdb) stepi\n(gdb) p $rax\n(gdb) stepi            ← 2번\n(gdb) info registers rcx\n(gdb) stepi\n(gdb) p $rax\n(gdb) continue' },
      { title: '폴트 난 줄 찾기', text: '아래 <code>strbug.asm</code> 은 <code>"hello"</code> 의 길이 5 를 종료 코드로 돌려주려는데 <code>Segmentation fault</code> 로 죽어요. 아직 고치지 말고, gdb 로 <b>어느 줄에서</b> · <b>누가 불러서</b> · <b>어떤 레지스터 값 때문에</b> 죽는지 찾아보세요.<pre class="code">default rel\n\nsection .data\nmsg:    db "hello", 0\n\nsection .text\nglobal _start\nstrlen:                     ; rdi = 0 으로 끝나는 문자열 주소 → rax = 길이\n    xor eax, eax\n.next:\n    cmp byte [rdi + rax], 0\n    je .done\n    inc rax\n    jmp .next\n.done:\n    ret\n_start:\n    mov rdi, [msg]          ; 문자열을 strlen 에게\n    call strlen\n    mov rdi, rax            ; exit(길이)\n    mov rax, 60\n    syscall</pre>',
        noRun: true,
        needs: [['run', 'R16/3', '폴트 난 명령에서 멈춤'], ['bt', 'R16/3', '누가 불렀나'], ['info registers rdi rax', 'R16/3', '그 줄에 쓰인 레지스터'], ['x/s &msg', 'R16/2', '메모리의 문자열 보기']],
        checks: [{ text: '`run` 하면 `Program received signal SIGSEGV` 와 함께 11번 줄 `cmp byte [rdi + rax], 0` 에서 멈춰요(`strlen` 안)' }, { text: '`bt` 의 `#1` 이 `_start () at strbug.asm:19` — `call strlen` 바로 뒤예요' }, { text: '`info registers rdi` 의 16진 끝부분이 `6f6c6c6568` 이에요 — 68 65 6c 6c 6f 는 h e l l o 의 아스키, 주소가 아니라 글자 바이트예요' }, { text: '`x/s &msg` 는 `"hello"` — 문자열은 제자리에 잘 있어요. 범인은 18번 줄의 `mov` 예요' }],
        answer: 'nasm -f elf64 -g -F dwarf strbug.asm -o strbug.o\nld strbug.o -o strbug\ngdb ./strbug\n(gdb) run\n(gdb) bt\n(gdb) info registers rdi rax\n(gdb) x/s &msg' },
      { title: '폴트 고치기: 길이 5', text: '바로 앞 문제의 <code>strbug.asm</code> 을 고쳐서 <code>./strbug; echo $?</code> 가 <code>5</code> 가 되게 하세요. 한 줄만 바꾸면 돼요.',
        given: 'default rel\n\nsection .data\nmsg:    db "hello", 0\n\nsection .text\nglobal _start\nstrlen:                     ; rdi = 0 으로 끝나는 문자열 주소 → rax = 길이\n    xor eax, eax\n.next:\n    cmp byte [rdi + rax], 0\n    je .done\n    inc rax\n    jmp .next\n.done:\n    ret\n_start:\n    mov rdi, [msg]          ; 문자열을 strlen 에게\n    call strlen\n    mov rdi, rax            ; exit(길이)\n    mov rax, 60\n    syscall',
        needs: [['lea rdi, [msg]', 'R16/3', '값이 아니라 주소를 넘기기'], ['mov rdi, [msg]', 'R16/3', '그 자리의 8바이트(글자들)를 읽음 — 버그']],
        echoExit: true,
        io: [{ output: '5' }],
        answer: 'default rel\n\nsection .data\nmsg:    db "hello", 0\n\nsection .text\nglobal _start\nstrlen:                     ; rdi = 0 으로 끝나는 문자열 주소 → rax = 길이\n    xor eax, eax\n.next:\n    cmp byte [rdi + rax], 0\n    je .done\n    inc rax\n    jmp .next\n.done:\n    ret\n_start:\n    lea rdi, [msg]          ; 고침: 문자열의 주소를\n    call strlen\n    mov rdi, rax            ; exit(길이)\n    mov rax, 60\n    syscall' },
    ],
    RB4: [
      { title: '단어 세기: count_words(char *s)', text: '<b>C 와 어셈블리로 작은 <code>wc</code></b>를 만들어요. 일은 이렇게 나눠요.<ol><li><code>main.c</code>: <code>fgets</code> 로 stdin 을 한 줄씩 읽어, 줄 수를 세고 <code>count_words(line)</code> 이 돌려준 값을 더해요. 다 읽으면 <code>printf</code> 로 <code>줄: n</code> · <code>단어: n</code>. 더하기는 파이썬처럼 <code>words += count_words(line);</code></li><li><code>count.asm</code>: <code>long count_words(char *s)</code> — 0 으로 끝나는 문자열에서 <b>단어</b>(빈칸 · 줄바꿈(10) · 탭(9)이 아닌 글자가 이어진 덩어리) 수를 돌려줘요. 「지금 단어 안에 있나」 를 레지스터 하나(예: <code>rcx</code> 0/1)에 두고, 단어 밖에서 글자를 만나는 순간 하나 세요.</li></ol>빌드 · 실행은 <code>nasm -f elf64 count.asm -o count.o</code> → <code>gcc -no-pie main.c count.o -o wc</code> → <code>./wc &lt; words.txt</code>(아래 준비 파일). 빈칸이 두 개 겹쳐도, 빈 줄이어도, 한글이어도 맞게 세야 해요.',
        prep: { name: 'words.txt', text: 'the quick brown fox\njumps over  the lazy dog\n\n안녕 어셈블리 그리고 C\n' },
        needs: [['while (fgets(line, sizeof line, stdin) != NULL)', 'R14/4', '한 줄씩 끝까지 읽기'], ['long count_words(char *s);', 'R14/4', '문자열 = 첫 글자의 주소'], ['mov dl, [rdi]   cmp dl, 0', 'R14/4', '한 바이트 읽고 끝(0)인지'], ['gcc -no-pie main.c count.o -o wc', 'R14/1', 'C 와 묶기'], ['printf("단어: %ld\\n", words);', 'R14/0', 'long 출력']],
        io: [{ input: 'the quick brown fox\njumps over  the lazy dog\n\n안녕 어셈블리 그리고 C\n', output: '줄: 4\n단어: 13' }, { input: '   hello    world  \n\n\tasm\tand\tC\n', output: '줄: 3\n단어: 5' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long count_words(char *s);

int main(void) {
    char line[256];
    long lines = 0;
    long words = 0;
    while (fgets(line, sizeof line, stdin) != NULL) {
        lines += 1;
        words += count_words(line);
    }
    printf("줄: %ld\\n", lines);
    printf("단어: %ld\\n", words);
    return 0;
}
; ==== 파일: count.asm ====
section .text
global count_words

count_words:                ; rdi = 0 으로 끝나는 문자열 → rax = 단어 수
    xor eax, eax            ; rax = 단어 수
    xor ecx, ecx            ; rcx = 1 이면 지금 단어 안
.next:
    mov dl, [rdi]
    cmp dl, 0
    je .done
    cmp dl, ' '
    je .gap
    cmp dl, 10              ; 줄바꿈
    je .gap
    cmp dl, 9               ; 탭
    je .gap
    cmp rcx, 1              ; 글자 — 단어 밖에 있었으면 새 단어 시작
    je .step
    inc rax
    mov rcx, 1
    jmp .step
.gap:
    mov rcx, 0              ; 빈칸 — 단어 밖
.step:
    inc rdi
    jmp .next
.done:
    ret` },
      { title: '글자 세기 더하기: count_char(char *s, int c)', text: '<code>count.asm</code> 에 <code>long count_char(char *s, int c)</code> 를 더하세요 — 문자열에 글자 <code>c</code> 가 몇 번 나오는지 돌려줘요. <code>main.c</code> 는 줄마다 <code>count_char(line, \'e\')</code> 와 <code>count_char(line, \'o\')</code> 도 더해서 <code>e: n</code> · <code>o: n</code> 을 마지막에 찍어요. C 의 작은따옴표 <code>\'e\'</code> 는 NASM 의 <code>\'e\'</code> 처럼 그 글자의 아스키 번호(101)예요. <code>c</code> 는 <code>int</code> 라서 <code>esi</code> 로 오는데, 바이트끼리 비교할 땐 그 맨 아래 1바이트 이름 <code>sil</code> 을 써요: <code>cmp dl, sil</code>.',
        needs: [['long count_char(char *s, int c);', 'R14/2', 'int 인자는 esi(그 맨 아래 바이트 sil)'], ['cmp dl, sil', 'R14/2', '글자 하나와 c 비교'], ['e += count_char(line, \'e\');', 'R14/4', '줄마다 더하기'], ['global count_char', 'R14/0', '두 번째 함수도 내놓기']],
        io: [{ input: 'the quick brown fox\njumps over  the lazy dog\n\n안녕 어셈블리 그리고 C\n', output: '줄: 4\n단어: 13\ne: 3\no: 4' }, { input: 'one two three\nfour\n', output: '줄: 2\n단어: 4\ne: 3\no: 3' }],
        answer: `// ==== 파일: main.c ====
#include <stdio.h>

long count_words(char *s);
long count_char(char *s, int c);

int main(void) {
    char line[256];
    long lines = 0;
    long words = 0;
    long e = 0;
    long o = 0;
    while (fgets(line, sizeof line, stdin) != NULL) {
        lines += 1;
        words += count_words(line);
        e += count_char(line, 'e');
        o += count_char(line, 'o');
    }
    printf("줄: %ld\\n", lines);
    printf("단어: %ld\\n", words);
    printf("e: %ld\\n", e);
    printf("o: %ld\\n", o);
    return 0;
}
; ==== 파일: count.asm ====
section .text
global count_words
global count_char

count_words:                ; rdi = 0 으로 끝나는 문자열 → rax = 단어 수
    xor eax, eax            ; rax = 단어 수
    xor ecx, ecx            ; rcx = 1 이면 지금 단어 안
.next:
    mov dl, [rdi]
    cmp dl, 0
    je .done
    cmp dl, ' '
    je .gap
    cmp dl, 10              ; 줄바꿈
    je .gap
    cmp dl, 9               ; 탭
    je .gap
    cmp rcx, 1              ; 글자 — 단어 밖에 있었으면 새 단어 시작
    je .step
    inc rax
    mov rcx, 1
    jmp .step
.gap:
    mov rcx, 0              ; 빈칸 — 단어 밖
.step:
    inc rdi
    jmp .next
.done:
    ret

count_char:                 ; rdi = 문자열, esi = 찾을 글자(int) → rax = 개수
    xor eax, eax
.next:
    mov dl, [rdi]
    cmp dl, 0
    je .done
    cmp dl, sil             ; sil = rsi 의 맨 아래 1바이트
    jne .step
    inc rax
.step:
    inc rdi
    jmp .next
.done:
    ret` },
      { title: 'gdb 로 count_char 안 들여다보기', text: '완성한 <code>wc</code> 를 <code>-g</code> 로 다시 빌드해 1번의 <code>words.txt</code> 를 넣고 gdb 에서 <code>count_char</code> 가 불릴 때 멈추고, C 가 넘겨준 인자와 돌려받는 값을 직접 보세요.', noRun: true,
        needs: [['gcc -g -no-pie main.c count.o -o wc', 'R16/4', '양쪽 다 -g'], ['break count_char', 'R16/4', '어셈블리 함수에서 멈추기'], ['run < words.txt', 'R16/1', '입력을 파일에서'], ['x/s $rdi', 'R16/2', '넘어온 문자열 보기'], ['finish   p $rax', 'R16/4', '돌려준 값']],
        checks: [{ text: '`run < words.txt` 하면 `Breakpoint 1, count_char () at count.asm:…` 에서 멈춰요' }, { text: '`bt` 의 `#1` 이 `main () at main.c:…` — `e += count_char(line, \'e\');` 줄이에요' }, { text: '`info registers rsi` 가 `0x65 101`, `p/c $rsi` 가 `101 \'e\'` 예요' }, { text: '`x/s $rdi` 가 첫 줄 `"the quick brown fox\\n"` 이에요' }, { text: '`finish` 뒤 `p $rax` 가 `1`(첫 줄의 e 는 the 의 하나), 한 번 `continue` 하면 이번엔 `rsi` 가 `0x6f`(\'o\')예요' }],
        answer: 'nasm -f elf64 -g -F dwarf count.asm -o count.o\ngcc -g -no-pie main.c count.o -o wc\ngdb ./wc\n(gdb) break count_char\n(gdb) run < words.txt\n(gdb) bt\n(gdb) info registers rdi rsi\n(gdb) p/c $rsi\n(gdb) x/s $rdi\n(gdb) finish\n(gdb) p $rax\n(gdb) continue\n(gdb) info registers rsi' },
    ],
  },
};
