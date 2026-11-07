// courses/asm/content.js — 「어셈블리어 교과서」 (v2.31.0, 사용자 공용 코스 T10 「x86-64 · NASM · 우분투」 11/6 · 다음 코스 「1」 11/7). 설계: specs/asm-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 리눅스 교과서에서 만든 우분투 VM(x86-64) 안의 nasm · ld · gcc · gdb.
// 레슨 쪽 example.code = NASM 소스(check_book 이 tools/asm_book_run.py 로 nasm · ld 또는 gcc -no-pie 로 빌드해 실제 실행 — CI 우분투 x86-64) · example.shell = 터미널 명령(안 돌림).
//   여러 파일이면 「; ==== 파일: add.asm ====」 · 「// ==== 파일: main.c ====」 줄로 나눔. example.echoExit: true 면 출력 뒤에 echo $? 의 숫자.
const COURSE = { id: 'asm', name: '어셈블리어', runner: 'none', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 우분투 VM 에서 x86-64 NASM 어셈블리를 가르치는 선생님이다. 명령 하나가 레지스터·메모리를 어떻게 바꾸는지 늘 값으로 보여 주고, gdb 로 확인하게 한다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#6d4c41' },
  { ch: 1, name: '첫 어셈블리', color: '#4f6bed' },
  { ch: 2, name: '흐름과 메모리', color: '#2ea043' },
  { ch: 3, name: '스택과 함수', color: '#d97706' },
  { ch: 4, name: 'C 와 어셈블리 사이', color: '#9c27b0' },
];
const ASM_TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }]; // v2.31.0 뼈대: 아직 안 채운 레슨 — draft:true 라 목차에 「준비 중」
const LESSONS = [
{ id: 'R0', ch: 0, n: 0, title: '어셈블리어란', mode: 'text',
  tutorSummary: 'CPU 는 기계어(바이트)만 안다. 파이썬은 바이트코드를 python3 프로그램이 처리, C 는 gcc 가 기계어로. 어셈블리어는 기계어 명령 하나하나에 사람이 읽는 이름을 붙인 것(mov rax, 60 → NASM 은 b8 3c 00 00 00, 다른 어셈블러는 48 c7 c0 3c 00 00 00 처럼 더 길게도). nasm -f elf64 가 .o(기계어 조각), ld 가 실행 파일(ELF). 이 교과서는 x86-64 · NASM 인텔 문법(mov 받는쪽, 주는쪽) · 우분투. objdump 기본인 AT&T 문법(mov $0x3c,%eax — 순서 반대, % · $)은 읽기만.',
  terms: { '기계어': 'CPU 가 바로 읽는 명령. 바이트(0~255 숫자)들이에요. 예: 0f 05 = syscall', '어셈블러': '어셈블리어 글자 파일을 기계어로 바꾸는 프로그램. 이 교과서는 NASM(nasm 명령)', '링커': '기계어 조각(.o)들을 묶어 실행 파일을 만드는 프로그램. 이 교과서는 ld', 'ELF': '리눅스의 실행 파일 · 오브젝트 파일 모양. Windows 의 .exe 는 다른 모양(PE)이라 서로 안 돌아요' },
  pages: [
    { title: '기계어와 어셈블리어: mov rax, 60', html: `<p>CPU 는 사실 <b>숫자</b>만 알아요. 「rax 라는 칸에 60 을 넣어라」 같은 명령도 CPU 에게는 <code>b8 3c 00 00 00</code> 같은 바이트 몇 개예요. 이렇게 바이트로 된 명령이 [[기계어]]예요.</p>
<p>우리가 아는 파이썬과 C 는 이렇게 달라요.</p>
<table class="kb"><tbody><tr><td><b>파이썬</b></td><td><code>python3 hello.py</code> 를 치면 파이썬이 내 코드를 <b>바이트코드</b>로 바꾸고, <code>/usr/bin/python3</code> 라는 프로그램이 그걸 하나씩 처리해요. 그 <code>python3</code> 프로그램 자체가 기계어예요</td></tr><tr><td><b>C</b></td><td><code>gcc</code> 가 C 코드를 처음부터 <b>기계어</b>로 바꿔 실행 파일을 만들어요. 실행할 때는 CPU 가 바로 읽어요</td></tr><tr><td><b>어셈블리어</b></td><td>기계어 명령 하나하나에 <b>사람이 읽는 이름</b>을 붙인 것. 어셈블리어 한 줄 = 기계어 명령 하나</td></tr></tbody></table>
<pre>어셈블리어 (사람이 씀)       기계어 (CPU 가 읽음)
mov rax, 60          →     b8 3c 00 00 00
mov rdi, 42          →     bf 2a 00 00 00
syscall              →     0f 05</pre>
<p>16진수 <code>3c</code> 는 10진수로 60, <code>2a</code> 는 42 예요. 숫자가 바이트 안에 그대로 들어 있죠? 이 세 줄은 「프로그램을 끝내고, 끝난 결과로 42 를 남겨라」 라는 뜻이에요. 지금은 한 줄 한 줄의 뜻을 몰라도 괜찮아요. [[레슨:R1]] 과 [[레슨:R2]] 에서 자세히 배워요.</p>
<p>아래 예제를 우분투의 <code>~/asm/exit42.asm</code> 으로 저장하고 시작하기 2쪽의 세 줄로 빌드해요(파일 이름만 <code>exit42</code> 로 바꿔서). 그리고 <code>./exit42; echo $?</code> 로 실행하면 <code>42</code> 가 보여요. <code>echo $?</code> 는 「방금 끝난 프로그램이 남긴 숫자(종료 코드)」 를 보여 주는 bash 명령이에요.</p>
<p class="muted small">책이나 인터넷에서는 <code>mov rax, 60</code> 이 <code>48 c7 c0 3c 00 00 00</code> 처럼 더 긴 바이트로 나오기도 해요. 같은 일을 하는 기계어가 여러 개 있어서, NASM 은 그중 가장 짧은 것을 골라요. 왜 같은 일인지는 [[레슨:R1]] 3쪽에서 알게 돼요.</p>`,
      example: { label: '예제 코드 — exit42.asm 으로 저장, 빌드 후 ./exit42; echo $?', echoExit: true, code: `section .text
global _start
_start:
    mov rax, 60         ; 60 = 「프로그램 끝내기(exit)」 부탁의 번호
    mov rdi, 42         ; 끝날 때 남길 숫자(종료 코드)
    syscall             ; 커널에게 부탁!` } },
    { title: '어셈블러와 링커: nasm → ld → 실행', html: `<p>글자로 쓴 <code>exit42.asm</code> 이 실행 파일이 되기까지는 두 단계예요.</p>
<pre>exit42.asm    글자 파일 (사람이 쓴 어셈블리어)
   |
   |  nasm -f elf64 exit42.asm -o exit42.o
   v           ← 어셈블러: 글자 → 기계어
exit42.o      기계어 조각 (아직 실행은 못 해요)
   |
   |  ld exit42.o -o exit42
   v           ← 링커: 조각을 묶어 실행 파일로
exit42        실행 파일 → ./exit42 로 실행</pre>
<table class="kb"><tbody><tr><td><b>nasm</b></td><td>[[어셈블러]]. 어셈블리어 한 줄 한 줄을 기계어 바이트로 바꿔 <b>오브젝트 파일</b>(<code>.o</code>)을 만들어요. <code>-f elf64</code> 는 「64비트 리눅스 모양으로」</td></tr><tr><td><b>ld</b></td><td>[[링커]]. <code>.o</code> 조각(여러 개일 수도 있어요)을 묶고, 「어디서부터 실행하나」 를 정해 <b>실행 파일</b>을 만들어요</td></tr><tr><td><b>ELF</b></td><td>리눅스 실행 파일의 모양([[ELF]]). Windows 의 <code>.exe</code> 와 모양이 달라서 Windows 에서는 이 파일이 안 돌아요</td></tr></tbody></table>
<p>왜 굳이 두 단계일까요? 큰 프로그램은 파일 여러 개로 나눠 쓰고, 각각을 <code>.o</code> 로 만든 뒤 마지막에 한 번에 묶어요. 나중에 C 파일과 어셈블리 파일을 섞을 때([[레슨:R14]]) 이 방법을 써요.</p>
<p><code>file</code> 명령으로 두 파일의 정체를 볼 수 있어요.</p>
<pre>exit42.o: ELF 64-bit LSB relocatable, x86-64, ...
exit42:   ELF 64-bit LSB executable, x86-64, ...</pre>
<p><code>relocatable</code> 은 「아직 자리가 안 정해진 조각」, <code>executable</code> 은 「실행할 수 있는 파일」 이에요. 조각인 <code>./exit42.o</code> 를 실행하려 하면 <code>Permission denied</code> 가 나와요.</p>`,
      example: { label: '예제 명령 — 우분투 터미널에서(~/asm 에 exit42.asm 이 있을 때)', shell: 'cd ~/asm\nnasm -f elf64 exit42.asm -o exit42.o\nld exit42.o -o exit42\nfile exit42.o exit42\n./exit42; echo $?' } },
    { title: '왜 배우나: 디버거 · 성능 · 보안', html: `<p>요즘 어셈블리어로 큰 프로그램을 처음부터 만드는 일은 거의 없어요. 그래도 배우는 이유는 <b>읽을 줄 알면</b> 보이는 것이 많아서예요.</p>
<table class="kb"><tbody><tr><td><b>컴퓨터가 진짜 하는 일</b></td><td>파이썬의 <code>x = x + 1</code> 한 줄 아래에는 「값을 칸에 가져오기 → 더하기 → 다시 넣기」 같은 명령이 여러 개 있어요. 변수 · 함수 호출 · 스택이 실제로 무엇인지 손으로 만져 봐요</td></tr><tr><td><b>디버거</b></td><td>프로그램이 죽었을 때 디버거(<code>gdb</code>)는 결국 어셈블리를 보여 줘요. 읽을 줄 알면 어느 명령에서 왜 죽었는지 보여요 — [[레슨:R16]]</td></tr><tr><td><b>성능</b></td><td>컴파일러가 내 C 코드를 어떤 기계어로 바꿨는지 읽으면 왜 빠른지, 왜 느린지 보여요 — [[레슨:R15]]</td></tr><tr><td><b>보안</b></td><td>해킹 기법, 악성 프로그램 분석, 「버퍼 넘침」 같은 버그는 전부 기계어 수준의 이야기예요</td></tr><tr><td><b>운영체제</b></td><td>운영체제 교과서에서 본 「시스템 콜」 을 이 교과서에서는 명령 하나(<code>syscall</code>)로 직접 불러요 — [[레슨:R2]]</td></tr></tbody></table>
<p>이 교과서의 목표는 「어셈블리로 다 만들기」 가 아니라 <b>짧은 프로그램을 직접 써 보고, 남이 만든 기계어를 읽을 수 있게 되는 것</b>이에요. 하나하나가 짧고 단순한 명령이라, 천천히 보면 생각보다 어렵지 않아요.</p>` },
    { title: '이 교과서의 약속: mov 받는쪽, 주는쪽', html: `<p>어셈블리어는 CPU 종류마다, 운영체제마다, 어셈블러마다 조금씩 달라요. 이 교과서는 이렇게 정해요.</p>
<table class="kb"><tbody><tr><td><b>CPU</b></td><td><b>x86-64</b>(인텔 · AMD 의 64비트 CPU). 폰이나 Apple 칩 Mac 의 ARM CPU 는 명령이 아예 달라요. 우분투에서 <code>uname -m</code> 이 <code>x86_64</code> 면 OK</td></tr><tr><td><b>운영체제</b></td><td><b>우분투 리눅스</b>. 커널에게 부탁하는 방법(시스템 콜 번호)이 운영체제마다 달라요</td></tr><tr><td><b>어셈블러</b></td><td><b>NASM</b> — <code>nasm</code> 명령</td></tr><tr><td><b>문법</b></td><td><b>인텔 문법</b>. <code>mov rax, 60</code> 은 「rax ← 60」. <b>받는 쪽이 앞</b>, 주는 쪽이 뒤예요. 파이썬의 <code>rax = 60</code> 과 같은 방향이라 읽기 쉬워요</td></tr></tbody></table>
<p>그런데 리눅스의 도구들(<code>objdump</code> · <code>gcc</code>)은 기본으로 <b>AT&amp;T 문법</b>을 보여 줘요. 같은 명령인데 모양이 이래요.</p>
<pre>인텔 (NASM, 이 교과서)   mov eax, 0x3c       받는 쪽 ← 주는 쪽
AT&amp;T (objdump 기본)      mov $0x3c,%eax      주는 쪽 → 받는 쪽</pre>
<p>AT&amp;T 문법은 <b>순서가 반대</b>이고, 레지스터 앞에 <code>%</code>, 숫자 앞에 <code>$</code> 가 붙어요. 이 교과서는 AT&amp;T 로 쓰지는 않고, 보이면 <b>읽을 줄만</b> 알면 돼요. <code>objdump</code> 에 <code>-M intel</code> 을 붙이면 인텔 문법으로 보여 줘요.</p>
<pre>$ objdump -d -M intel exit42

0000000000401000 &lt;_start&gt;:
  401000:  b8 3c 00 00 00   mov    eax,0x3c
  401005:  bf 2a 00 00 00   mov    edi,0x2a
  40100a:  0f 05            syscall</pre>
<p>왼쪽 <code>401000</code> 은 그 명령이 놓인 <b>주소</b>, 가운데가 <b>기계어 바이트</b>, 오른쪽이 그 바이트를 다시 읽은 <b>어셈블리어</b>예요. 1쪽의 표와 같은 바이트가 보이죠? (<code>mov rax</code> 가 <code>mov eax</code> 로 보이는 이유는 [[레슨:R1]] 3쪽에서.)</p>`,
      example: { label: '예제 명령 — 우분투 터미널에서(2쪽에서 만든 exit42 가 있을 때)', shell: 'cd ~/asm\nobjdump -d -M intel exit42\nobjdump -d exit42' } },
  ],
  summary: ['CPU 는 기계어(바이트)만 알고, 어셈블리어는 그 명령 하나하나의 이름', 'nasm 이 .asm → .o(기계어 조각), ld 가 .o → 실행 파일(ELF)', 'x86-64 · 우분투 · NASM 인텔 문법(mov 받는쪽, 주는쪽) — AT&T(%rax, $60)는 읽기만'] },
{ id: 'R1', ch: 1, n: 1, title: '레지스터와 mov', mode: 'text',
  tutorSummary: '레지스터 = CPU 안의 64비트 저장 칸 16개(rax rbx rcx rdx rsi rdi rbp rsp r8~r15). rsp 는 스택용이라 건드리지 않음. mov 받는쪽, 주는쪽 — mov rax, 5 · mov rbx, rax(복사, 받는 쪽의 옛 값은 사라짐). 숫자는 10진 · 0x 16진 · 0b 2진. 작은 이름 eax(32) · ax(16) · al(8) 은 같은 칸의 아래쪽. eax 에 쓰면 위 32비트가 0, ax · al 에 쓰면 나머지는 그대로. 결과 보기: mov rdi, 값 → mov rax, 60 → syscall → echo $?. 종료 코드는 0~255(맨 아래 8비트) — 300 은 44. rax 의 결과는 mov rax, 60 전에 rdi 로 옮기기.',
  terms: { '레지스터': 'CPU 안에 있는 아주 빠른 저장 칸. x86-64 는 일반용이 16개, 하나에 64비트(8바이트)', '종료 코드': '프로그램이 끝날 때 남기는 숫자(0~255). bash 에서 echo $? 로 봐요. 0 은 「잘 끝남」' },
  pages: [
    { title: '레지스터 16개: rax rbx … r15', html: `<p>파이썬에서는 변수를 원하는 만큼, 원하는 이름으로 만들어요. CPU 안에는 그런 자유가 없어요. <b>이름이 정해진 저장 칸 16개</b>가 있고, 계산은 거의 이 칸들 안에서 해요. 이 칸이 [[레지스터]]예요.</p>
<pre> CPU 안의 레지스터 16개 (하나에 64비트 = 8바이트)
 rax   rbx   rcx   rdx
 rsi   rdi   rbp   rsp
 r8    r9    r10   r11
 r12   r13   r14   r15</pre>
<table class="kb"><tbody><tr><td><code>rax rbx rcx rdx</code></td><td>일반용. 특히 <code>rax</code> 는 계산 결과 · 시스템 콜 번호를 둘 때 자주 써요</td></tr><tr><td><code>rsi rdi</code></td><td>일반용. 시스템 콜이나 함수에 값을 넘길 때 많이 써요(<code>rdi</code> 는 이번 레슨 4쪽에서 바로 써요)</td></tr><tr><td><code>rbp rsp</code></td><td>스택용. 특히 <code>rsp</code> 는 <b>건드리지 마세요</b> — [[레슨:R10]] 에서 배워요</td></tr><tr><td><code>r8</code> ~ <code>r15</code></td><td>64비트 CPU 가 되면서 새로 생긴 8개. 그래서 이름이 숫자예요</td></tr></tbody></table>
<p>레지스터 하나에는 <b>64비트 정수 하나</b>가 들어가요. 파이썬 변수처럼 문자열이나 리스트를 통째로 넣을 수는 없어요. 「이 칸은 숫자, 이 칸은 글자」 같은 타입도 없어요. 그냥 0 과 1 이 64개 있을 뿐이고, 그걸 어떻게 쓸지는 내가 정해요.</p>
<p>왜 칸이 이렇게 적을까요? 레지스터는 CPU 바로 안에 있어서 메모리보다 훨씬 빠르지만, 그만큼 비싸서 많이 못 만들어요. 그래서 「메모리에서 레지스터로 가져와 → 계산하고 → 다시 메모리로」 가 기본 흐름이에요(메모리는 [[레슨:R7]]).</p>
<p>아래 예제는 레지스터 세 개에 값을 넣고, 그중 <code>r12</code> 의 값을 종료 코드로 남겨요. 실행하면 <code>9</code> 가 보여요. 끝의 세 줄은 [[레슨:R0]] 에서 본 「끝내기」 예요(4쪽에서 자세히).</p>`,
      example: { label: '예제 코드 — reg.asm 으로 저장, 빌드 후 ./reg; echo $?', echoExit: true, code: `section .text
global _start
_start:
    mov rax, 7          ; rax 칸에 7
    mov rbx, 8          ; rbx 칸에 8
    mov r12, 9          ; r12 칸에 9

    mov rax, 60         ; 끝내기(exit) 번호
    mov rdi, r12        ; 종료 코드 = r12 의 값
    syscall` } },
    { title: 'mov rax, 5 · mov rbx, rax · 0x · 0b', html: `<p>레지스터에 값을 넣는 명령이 <code>mov</code>(move)예요. <b>받는 쪽이 앞</b>, 주는 쪽이 뒤예요.</p>
<table class="kb"><tbody><tr><td><code>mov rax, 5</code></td><td>rax 에 5 를 넣어요. 파이썬의 <code>rax = 5</code></td></tr><tr><td><code>mov rbx, rax</code></td><td>rax 의 값을 rbx 에 <b>복사</b>해요. 파이썬의 <code>rbx = rax</code>. rax 는 그대로 남고, rbx 에 있던 옛 값은 사라져요</td></tr><tr><td><code>mov 5, rax</code></td><td><b>안 돼요.</b> 숫자 5 는 받는 쪽이 될 수 없어요(값을 담을 칸이 아니니까)</td></tr></tbody></table>
<p>이름은 move(옮기기)지만 실제로는 <b>복사</b>예요. 주는 쪽이 비지 않아요.</p>
<p>숫자는 세 가지로 쓸 수 있어요. 셋 다 CPU 안에서는 똑같은 비트예요.</p>
<table class="kb"><tbody><tr><td><code>42</code></td><td>10진수(그냥 쓰면)</td></tr><tr><td><code>0x2a</code></td><td>16진수 — 앞에 <code>0x</code>. 기계어 · 주소를 볼 때 많이 나와요</td></tr><tr><td><code>0b101010</code></td><td>2진수 — 앞에 <code>0b</code>. 비트 하나하나를 정할 때([[레슨:R4]])</td></tr></tbody></table>
<p>파이썬에서도 <code>0x2a</code> · <code>0b101010</code> 이라고 쓰면 42 예요. 헷갈리면 터미널에서 <code>python3 -c "print(0x2a)"</code> 로 확인해 보세요.</p>
<p>아래 예제는 rbx 에 3 을 넣었다가, rax 의 값으로 덮어써요. 실행하면 <code>16</code> 이 보여요. 3 은 덮어써져서 사라졌어요.</p>`,
      example: { label: '예제 코드 — mov.asm 으로 저장, 빌드 후 ./mov; echo $?', echoExit: true, code: `section .text
global _start
_start:
    mov rax, 0x10       ; 16진수 10 = 10진수 16
    mov rbx, 0b11       ; 2진수 11 = 10진수 3
    mov rbx, rax        ; rbx = rax 의 값(16). 옛 값 3 은 사라짐

    mov rax, 60         ; 끝내기(exit) 번호
    mov rdi, rbx        ; 종료 코드 = rbx
    syscall` } },
    { title: '같은 칸의 작은 이름: eax · ax · al', html: `<p>레지스터 하나는 64비트지만, 그 <b>아래쪽 일부</b>만 부르는 이름도 있어요. 새 칸이 아니라 <b>같은 칸의 일부</b>예요.</p>
<pre>bit 63          32 31     16 15   8 7    0
   +--------------+---------+------+------+
   |              |         |      |  al  |
   +--------------+---------+------+------+
   |<------------------ rax (64) -------->|
                  |<-------- eax (32) --->|
                            |<-- ax (16)->|
                                   |<al 8>|</pre>
<table class="kb"><tbody><tr><td><b>64비트</b></td><td><code>rax</code></td><td><code>rbx</code></td><td><code>rcx</code></td><td><code>rdi</code></td><td><code>r8</code></td></tr><tr><td><b>32비트</b></td><td><code>eax</code></td><td><code>ebx</code></td><td><code>ecx</code></td><td><code>edi</code></td><td><code>r8d</code></td></tr><tr><td><b>16비트</b></td><td><code>ax</code></td><td><code>bx</code></td><td><code>cx</code></td><td><code>di</code></td><td><code>r8w</code></td></tr><tr><td><b>8비트</b></td><td><code>al</code></td><td><code>bl</code></td><td><code>cl</code></td><td><code>dil</code></td><td><code>r8b</code></td></tr></tbody></table>
<p>작은 이름에 값을 쓸 때 <b>위쪽이 어떻게 되는지</b>가 이름마다 달라요. 꼭 기억할 규칙은 하나예요.</p>
<pre>mov rax, -1     rax = 0xFFFFFFFFFFFFFFFF  (64비트 전부 1)
mov eax, 5      rax = 0x0000000000000005  ← 32비트 이름: 위 32비트가 0 이 됨

mov rax, -1     rax = 0xFFFFFFFFFFFFFFFF
mov al, 5       rax = 0xFFFFFFFFFFFFFF05  ← 8비트 이름: 맨 아래 8비트만 바뀜</pre>
<p><b>32비트 이름(<code>eax</code>)에 쓰면 위 32비트가 0 으로 지워지고, 16 · 8비트 이름(<code>ax</code> · <code>al</code>)에 쓰면 나머지는 그대로</b>예요. 그래서 <code>mov rax, 60</code> 과 <code>mov eax, 60</code> 은 결과가 똑같아요. [[레슨:R0]] 에서 NASM 이 <code>mov rax, 60</code> 을 더 짧은 <code>mov eax, 60</code> 의 기계어로 바꾼 이유예요.</p>
<p>아래 예제는 rbx 를 0 으로 만든 뒤 맨 아래 8비트(<code>bl</code>)에만 200 을 넣고, rbx <b>전체</b>를 종료 코드로 남겨요. 실행하면 <code>200</code> 이 보여요 — <code>bl</code> 이 rbx 의 일부라서요.</p>
<p class="muted small">종료 코드는 맨 아래 8비트만 보여 줘서(4쪽), 위쪽이 0 이 되는 모습은 화면에 안 보여요. 레지스터 전체를 눈으로 보는 방법은 [[레슨:R16]] 의 gdb 예요.</p>`,
      example: { label: '예제 코드 — small.asm 으로 저장, 빌드 후 ./small; echo $?', echoExit: true, code: `section .text
global _start
_start:
    mov rbx, 0          ; rbx 64비트 전체를 0 으로
    mov bl, 200         ; 맨 아래 8비트(bl)에만 200

    mov rax, 60         ; 끝내기(exit) 번호
    mov rdi, rbx        ; rbx 전체 → 200 (bl 이 rbx 의 일부)
    syscall` } },
    { title: '결과 보기: mov rdi, 값 → exit → echo $?', html: `<p>아직 화면에 글자를 찍는 법은 몰라요(다음 레슨에서). 그동안은 계산 결과를 [[종료 코드]]로 봐요. 지금까지 예제마다 쓴 끝의 세 줄이 그거예요.</p>
<table class="kb"><tbody><tr><td><code>mov rax, 60</code></td><td>rax 에 60 = 「프로그램 끝내기(exit)」 부탁의 번호</td></tr><tr><td><code>mov rdi, 값</code></td><td>rdi 에 남길 숫자(종료 코드)</td></tr><tr><td><code>syscall</code></td><td>커널에게 부탁! 이 줄에서 프로그램이 끝나요</td></tr></tbody></table>
<p>왜 하필 rax 와 rdi 인지, <code>syscall</code> 이 무엇인지는 [[레슨:R2]] 에서 자세히 배워요. 지금은 「끝내기 세 줄」 로 외워 두면 돼요. 끝난 뒤 bash 에서 <code>echo $?</code> 를 치면 그 숫자가 보여요. 보통 <b>0 은 「잘 끝남」</b>, 0 이 아니면 「뭔가 문제」 라는 약속이에요.</p>
<div class="bk-warn"><b>결과가 rax 에 있으면 먼저 rdi 로</b> — <code>mov rax, 60</code> 을 먼저 하면 rax 에 있던 결과가 60 으로 덮어써져요. 결과를 <code>mov rdi, rax</code> 로 옮긴 <b>다음에</b> <code>mov rax, 60</code>.</div>
<p>종료 코드는 <b>0~255</b> 만 돼요. 레지스터의 맨 아래 8비트(<code>dil</code>)만 남기 때문이에요. 그보다 큰 수는 256 으로 나눈 나머지가 보여요.</p>
<table class="kb"><tbody><tr><td><code>mov rdi, 255</code></td><td>255</td></tr><tr><td><code>mov rdi, 256</code></td><td>0 (256 = 256 × 1 + 0)</td></tr><tr><td><code>mov rdi, 300</code></td><td>44 (300 = 256 × 1 + 44)</td></tr></tbody></table>
<p>파이썬으로 확인하면 <code>300 % 256</code> 이 44 예요. 아래 예제를 실행하면 <code>44</code> 가 보여요. 계산 결과가 255 보다 클 수 있으면 종료 코드로는 제대로 못 봐요 — 큰 숫자를 글자로 찍는 방법은 챕터 2 끝에서 만들어요.</p>`,
      example: { label: '예제 코드 — big.asm 으로 저장, 빌드 후 ./big; echo $?', echoExit: true, code: `section .text
global _start
_start:
    mov rbx, 300        ; 계산 결과가 300 이라고 하면

    mov rdi, rbx        ; 결과를 먼저 rdi 로
    mov rax, 60         ; 그다음에 끝내기 번호
    syscall             ; 종료 코드는 0~255 → 300 은 44 로 보임` } },
  ],
  summary: ['레지스터 = CPU 안의 64비트 칸 16개(rax rbx rcx rdx rsi rdi rbp rsp r8~r15) — rsp 는 건드리지 않기', 'mov 받는쪽, 주는쪽(복사) · 숫자는 42 · 0x2a · 0b101010 · eax 에 쓰면 위 32비트가 0', '결과 보기: mov rdi, 값 → mov rax, 60 → syscall → echo $? (0~255)'] },
{ id: 'R2', ch: 1, n: 2, title: '첫 프로그램: write 와 exit 시스템 콜', mode: 'text',
  tutorSummary: 'section .data(데이터) / section .text(코드), global _start(ld 가 시작할 이름), _start: 라벨, 주석 ;. msg db "글자", 10 — 바이트를 늘어놓기(10 = 줄바꿈, 한글은 한 글자 3바이트). len equ $ - msg — $ 는 지금 위치, 길이(바이트 수)를 이름으로. 시스템 콜: rax 에 번호(write=1 · exit=60), 인자는 rdi rsi rdx, syscall. write(1, msg, len) = rdi=1(화면) rsi=msg(주소, mov rsi, msg) rdx=len. 돌려준 값은 rax(write 는 찍은 바이트 수). 빌드 nasm -f elf64 · ld · ./hello. 에러: nasm 은 「파일:줄: error:」, -f elf64 를 빼면 16-bit mode, global _start 를 빼면 ld: warning: cannot find entry symbol _start, exit 을 빼면 Segmentation fault(종료 코드 139).',
  terms: { '섹션': '어셈블리 파일 안의 칸. section .data 는 데이터, section .text 는 명령(코드)을 둬요', '라벨': '코드나 데이터의 자리에 붙인 이름표. _start: 처럼 이름 뒤에 콜론, msg 처럼 데이터 앞에. 쓰면 그 자리의 주소가 돼요', '시스템 콜': '프로그램이 커널에게 하는 부탁(화면에 쓰기 · 파일 읽기 · 끝내기 …). x86-64 리눅스에서는 rax 에 번호를 넣고 syscall' },
  pages: [
    { title: '파일 모양: section · global _start', html: `<p>[[레슨:R1]] 까지는 계산하고 종료 코드로 끝내기만 했어요. 이번에는 화면에 <b>글자</b>를 찍어 봐요. 먼저 파일 전체의 모양부터 볼게요. 아래 예제가 이 교과서의 기본 모양이에요.</p>
<table class="kb"><tbody><tr><td><code>section .data</code></td><td>여기서부터 <b>데이터</b>(찍을 글자, 숫자)를 두는 [[섹션]]이에요</td></tr><tr><td><code>section .text</code></td><td>여기서부터 <b>명령(코드)</b>을 두는 섹션이에요. 이름은 text 지만 글자가 아니라 코드예요(옛날부터 그렇게 불러요)</td></tr><tr><td><code>global _start</code></td><td>「<code>_start</code> 라는 이름을 파일 밖(<code>ld</code>)에도 알려 줘」. <code>ld</code> 는 이 이름이 있는 곳부터 실행을 시작해요</td></tr><tr><td><code>_start:</code></td><td>[[라벨]]. 이름 뒤에 콜론. 「바로 다음 명령의 자리」 에 붙인 이름표예요. 프로그램은 여기서 시작해 <b>위에서 아래로 한 줄씩</b> 실행돼요</td></tr><tr><td><code>; 설명</code></td><td>주석. <code>;</code> 부터 줄 끝까지는 무시해요(파이썬의 <code>#</code>)</td></tr></tbody></table>
<p>모양 규칙: 라벨(<code>_start:</code> · <code>msg</code>)은 줄 맨 앞에, 명령은 빈칸 4개 들여 써요. 파이썬과 달리 들여쓰기에 뜻은 없지만, 이렇게 쓰면 라벨이 눈에 잘 띄어요.</p>
<p>실행 파일이 메모리에 올라가면 <code>.text</code> 는 코드 자리에, <code>.data</code> 는 데이터 자리에 놓여요. 운영체제 교과서에서 본 <a href="../os/#lesson/K10" target="_blank" rel="noopener">운영체제 교과서 「가상 메모리」 ↗</a> 의 그 지도예요.</p>
<p>아래 예제를 <code>hello.asm</code> 으로 저장해 빌드하고 <code>./hello</code> 로 실행하면 <code>안녕, 어셈블리!</code> 가 찍혀요. 명령 하나하나의 뜻은 다음 쪽부터 봐요.</p>`,
      example: { label: '예제 코드 — hello.asm 으로 저장, 빌드 후 ./hello', code: `section .data
msg db "안녕, 어셈블리!", 10    ; 찍을 글자들 + 줄바꿈(10)
len equ $ - msg                 ; 글자들의 길이(바이트 수)

section .text
global _start
_start:
    mov rax, 1          ; 1 = write(쓰기)
    mov rdi, 1          ; 어디에? 1 = 화면(표준 출력)
    mov rsi, msg        ; 무엇을? msg 가 있는 주소
    mov rdx, len        ; 몇 바이트?
    syscall             ; 커널에게 부탁!

    mov rax, 60         ; 60 = exit(끝내기)
    mov rdi, 0          ; 종료 코드 0 = 잘 끝남
    syscall` } },
    { title: 'db 로 글자 놓기 · equ $ - msg 로 길이', html: `<p><code>section .data</code> 의 두 줄을 볼게요.</p>
<pre>msg db "안녕", 10
len equ $ - msg</pre>
<table class="kb"><tbody><tr><td><code>msg</code></td><td>라벨. 이 데이터가 놓인 <b>자리(주소)</b>의 이름이에요. 콜론은 붙여도 되고 안 붙여도 돼요</td></tr><tr><td><code>db</code></td><td>define byte — 「바이트를 여기에 차례로 놓아라」. 쉼표로 여러 개를 이어 써요</td></tr><tr><td><code>"안녕"</code></td><td>글자는 그 글자의 바이트들로 바뀌어요. 영어 · 숫자 · 기호는 한 글자 1바이트, <b>한글은 한 글자 3바이트</b>(UTF-8)</td></tr><tr><td><code>10</code></td><td>줄바꿈 글자의 번호. 파이썬의 <code>"\\n"</code> 이에요. NASM 의 <code>"..."</code> 안에서는 <code>\\n</code> 이 줄바꿈이 <b>안 돼서</b> 이렇게 숫자로 붙여요</td></tr></tbody></table>
<p>그러면 메모리에는 바이트 7개가 놓여요.</p>
<pre>msg →  [ec][95][88] [eb][85][95] [0a]
        ---- 안 ---  ---- 녕 ---  줄바꿈(10)</pre>
<p><code>write</code> 에게는 「몇 바이트를 찍을지」 도 알려 줘야 해요. 손으로 세면 틀리기 쉬워서 NASM 에게 세게 해요.</p>
<table class="kb"><tbody><tr><td><code>$</code></td><td>「지금 이 자리」 의 주소. <code>len</code> 줄에서 <code>$</code> 는 바로 위 데이터가 끝난 자리예요</td></tr><tr><td><code>$ - msg</code></td><td>끝난 자리 − 시작 자리 = <b>바이트 수</b></td></tr><tr><td><code>len equ …</code></td><td>equ = 「이 이름은 이 숫자다」. 메모리에 놓이는 데이터가 아니라 <b>이름 붙인 숫자</b>예요. 그래서 <code>len</code> 줄은 꼭 <code>msg</code> 줄 <b>바로 아래</b>에</td></tr></tbody></table>
<p>아래 예제는 <code>안녕</code> 을 찍고, 길이 <code>len</code> 을 종료 코드로 남겨요. 실행하면 <code>안녕</code> 아래에 7 이 보여요. 글자는 두 개지만 바이트는 3 + 3 + 1 = 7 이에요.</p>`,
      example: { label: '예제 코드 — len.asm 으로 저장, 빌드 후 ./len; echo $?', echoExit: true, code: `section .data
msg db "안녕", 10        ; 안(3바이트) + 녕(3바이트) + 줄바꿈(1바이트)
len equ $ - msg          ; = 7

section .text
global _start
_start:
    mov rax, 1          ; write
    mov rdi, 1          ; 화면
    mov rsi, msg        ; 무엇을
    mov rdx, len        ; 몇 바이트(7)
    syscall

    mov rax, 60         ; exit
    mov rdi, len        ; 종료 코드 = 길이
    syscall` } },
    { title: '시스템 콜: rax 에 번호 · syscall', html: `<p>내 프로그램은 화면에 직접 글자를 못 써요. 화면 · 파일 · 키보드는 커널이 관리하니까 커널에게 <b>부탁</b>해야 해요. 이 부탁이 [[시스템 콜]]이에요. 시스템 콜이 무엇이고 언제 일어나는지는 <a href="../os/#lesson/K14" target="_blank" rel="noopener">운영체제 교과서 「시스템 콜」 ↗</a> 에서 봤어요. 여기서는 그걸 <b>직접 부르는 법</b>을 배워요.</p>
<p>x86-64 리눅스의 규칙은 이래요.</p>
<ol><li><code>rax</code> 에 <b>무슨 부탁인지(번호)</b>를 넣어요.</li><li><code>rdi</code> · <code>rsi</code> · <code>rdx</code> 에 차례로 <b>부탁에 필요한 값(인자)</b>을 넣어요.</li><li><code>syscall</code> — 커널로 넘어가 부탁을 처리하고 돌아와요. <b>결과는 <code>rax</code></b> 에 들어 있어요.</li></ol>
<table class="kb"><tbody><tr><th>부탁</th><th>rax</th><th>rdi</th><th>rsi</th><th>rdx</th></tr><tr><td>write(쓰기)</td><td><code>1</code></td><td>어디에(1 = 화면)</td><td>글자가 있는 주소</td><td>몇 바이트</td></tr><tr><td>exit(끝내기)</td><td><code>60</code></td><td>종료 코드</td><td>—</td><td>—</td></tr></tbody></table>
<p><code>write</code> 의 <code>rdi = 1</code> 은 <b>파일 디스크립터</b> 1번, 「표준 출력」 이에요. 터미널에서는 화면이죠(<a href="../os/#lesson/K15" target="_blank" rel="noopener">운영체제 교과서 「파일 디스크립터」 ↗</a>). 파이썬으로 쓰면 <code>os.write(1, b"Hello, asm!\\n")</code> 와 거의 같은 부탁이에요.</p>
<p><code>mov rsi, msg</code> 는 <code>msg</code> 의 <b>글자가 아니라 주소</b>(자리 번호)를 rsi 에 넣어요. 커널은 그 주소부터 rdx 바이트만큼 읽어서 찍어요. 주소와 값은 [[레슨:R7]] 에서 더 자세히 봐요.</p>
<p>번호는 외우지 않아도 돼요. 우분투의 <code>/usr/include/x86_64-linux-gnu/asm/unistd_64.h</code> 에 전부 적혀 있어요(read 0 · write 1 · exit 60).</p>
<p>아래 예제는 <code>write</code> 가 돌려준 값(찍은 바이트 수)을 종료 코드로 남겨요. 실행하면 <code>Hello, asm!</code> 아래에 <code>12</code> 가 보여요 — 글자 11개 + 줄바꿈 1개예요. <code>mov rdi, rax</code> 를 <code>mov rax, 60</code> <b>앞에</b> 둔 것도 보세요([[레슨:R1]] 4쪽의 경고).</p>`,
      example: { label: '예제 코드 — ret.asm 으로 저장, 빌드 후 ./ret; echo $?', echoExit: true, code: `section .data
msg db "Hello, asm!", 10
len equ $ - msg

section .text
global _start
_start:
    mov rax, 1          ; write
    mov rdi, 1          ; 화면
    mov rsi, msg        ; 무엇을
    mov rdx, len        ; 몇 바이트
    syscall             ; 돌아오면 rax = 찍은 바이트 수

    mov rdi, rax        ; 그 값을 종료 코드로(먼저 옮기기!)
    mov rax, 60         ; exit
    syscall` } },
    { title: '빌드 세 줄: nasm · ld · ./hello', html: `<p>시작하기 2쪽과 [[레슨:R0]] 에서 본 세 줄을 이제 한 글자씩 읽어 볼게요.</p>
<table class="kb"><tbody><tr><td><code>nasm -f elf64 hello.asm -o hello.o</code></td><td><b>어셈블</b>. <code>-f elf64</code> = 「64비트 리눅스(ELF) 모양으로」, <code>-o hello.o</code> = 「결과 파일 이름」. 성공하면 아무 말도 안 해요</td></tr><tr><td><code>ld hello.o -o hello</code></td><td><b>링크</b>. <code>hello.o</code> 를 실행 파일 <code>hello</code> 로. <code>global _start</code> 를 보고 시작 자리를 정해요. 성공하면 역시 조용해요</td></tr><tr><td><code>./hello</code></td><td><b>실행</b>. <code>./</code> 는 「지금 폴더의」. 종료 코드를 보려면 <code>./hello; echo $?</code></td></tr></tbody></table>
<p>리눅스 명령은 <b>성공하면 조용하고, 실패하면 말해요</b>. 세 줄 중 어디서 글자가 나왔는지가 문제를 찾는 첫 단서예요.</p>
<div class="bk-step-box"><b>고쳤으면 세 줄을 다시</b><br><code>.asm</code> 을 고치고 <code>./hello</code> 만 다시 치면 <b>옛날 실행 파일</b>이 돌아요. 고칠 때마다 nasm → ld → 실행을 처음부터. 한 줄로 쓰면 편해요: <code>nasm -f elf64 hello.asm -o hello.o &amp;&amp; ld hello.o -o hello &amp;&amp; ./hello</code> — <code>&amp;&amp;</code> 는 「앞이 성공했을 때만 다음」 이라, 에러가 나면 거기서 멈춰요.</div>
<p>파일 이름은 자유예요. <code>two.asm</code> 이면 <code>two.o</code> · <code>two</code> 로 세 군데를 같이 바꿔요.</p>`,
      example: { label: '예제 명령 — 우분투 터미널에서(~/asm 에 hello.asm 이 있을 때)', shell: 'cd ~/asm\nnasm -f elf64 hello.asm -o hello.o\nld hello.o -o hello\n./hello\nls -l hello.asm hello.o hello' } },
    { title: '에러 읽기 · exit 을 빼면?', html: `<p>처음에는 에러가 자주 나요. 당연해요. 에러 글자를 읽으면 <b>어디가</b> 틀렸는지 거의 알려 줘요.</p>
<p><b>nasm 의 에러</b>는 <code>파일:줄 번호: error: 내용</code> 모양이에요. 그 줄 번호로 가서 보면 돼요. 아래 줄 번호는 1쪽의 <code>hello.asm</code> 기준이에요(VS Code 왼쪽에 줄 번호가 보여요).</p>
<table class="kb"><tbody><tr><td><code>hello.asm:8: error: parser: instruction expected</code></td><td>8번째 줄의 명령 이름이 틀렸어요. 예: <code>mov rax, 1</code> 을 <code>mvo rax, 1</code> 로</td></tr><tr><td><code>hello.asm:9: error: comma, colon, decorator or end of line expected after operand</code></td><td>9번째 줄에 쉼표가 빠졌어요. 예: <code>mov rdi 1</code></td></tr><tr><td><code>hello.asm:11: error: symbol &#96;lne' not defined</code></td><td>그런 이름이 없어요. <code>len</code> 을 <code>lne</code> 로 쓴 것 같은 오타이거나, <code>len equ $ - msg</code> 줄을 빠뜨렸어요</td></tr><tr><td><code>error: instruction not supported in 16-bit mode</code></td><td><code>nasm</code> 에 <code>-f elf64</code> 를 빠뜨렸어요. 64비트 레지스터를 쓰는 줄마다 이 에러가 나와요</td></tr></tbody></table>
<p><b>ld 의 말</b>도 두 가지만 알아 두면 돼요.</p>
<table class="kb"><tbody><tr><td><code>ld: cannot find hello.o: No such file or directory</code></td><td>nasm 이 실패해서 <code>hello.o</code> 가 안 생겼어요. 위쪽의 nasm 에러부터 고쳐요</td></tr><tr><td><code>ld: warning: cannot find entry symbol _start; defaulting to 0000000000401000</code></td><td><code>global _start</code> 를 빠뜨렸거나 <code>_start:</code> 이름에 오타가 있어요. 경고라 실행 파일은 생기고 <b>우연히</b> 돌기도 하지만, 꼭 고쳐요</td></tr></tbody></table>
<p><b>exit 을 빼면?</b> 마지막 <code>mov rax, 60</code> · <code>syscall</code> 을 지우고 빌드하면 에러 없이 빌드되고, 실행하면 글자는 찍힌 뒤 이렇게 끝나요.</p>
<pre>$ ./hello; echo $?
안녕, 어셈블리!
Segmentation fault (core dumped)
139</pre>
<p>CPU 는 「여기서 끝」 을 모르고 <code>syscall</code> 다음 바이트를 계속 명령으로 읽어요. 거기에는 내 코드가 없으니 허락되지 않은 메모리를 건드리고, 커널이 그 프로그램을 멈춰요. 이게 <b>세그멘테이션 폴트</b>예요. 종료 코드 139 는 「시그널 11(SIGSEGV)로 멈춤」(128 + 11)이라는 뜻이에요.</p>
<div class="bk-warn"><b>세그멘테이션 폴트는 VM 이 망가진 게 아니에요</b> — 멈춘 건 내 프로그램 하나뿐이에요. 커널이 막아 줬으니 우분투도, 다른 프로그램도 멀쩡해요. 코드를 고치고 다시 빌드하면 돼요. 파이썬과 달리 어셈블리는 <b>끝내기를 내가 직접</b> 해야 해요.</div>` },
  ],
  summary: ['파일 모양: section .data(데이터) → section .text → global _start → _start: · 주석은 ;', 'msg db "글자", 10 · len equ $ - msg · 시스템 콜은 rax 에 번호(write=1 · exit=60), rdi rsi rdx 에 인자, syscall', 'nasm -f elf64 → ld → ./실행 · 에러는 「파일:줄」 부터 · exit 을 빼면 Segmentation fault'] },
{ id: 'R3', ch: 1, n: 3, title: '계산: add · sub · imul · idiv', mode: 'text',
  tutorSummary: 'add rax, rbx 는 rax += rbx(결과는 받는 쪽), sub · inc · dec · neg. imul rax, rbx / imul rax, 10 / imul rcx, rbx, 3. idiv rbx 는 rdx:rax 를 나눔 — cqo 먼저, 몫 rax 나머지 rdx, 숫자로는 못 나눔, 0 으로 나누면 Floating point exception. 음수는 2의 보수(뒤집고 1 더하기, 종료 코드 255 = -1). 64비트를 넘으면 위가 잘림(넘침).',
  terms: { '2의 보수': '음수를 비트로 적는 방법. 양수의 비트를 전부 뒤집고 1 을 더해요. −1 은 비트가 전부 1, 맨 왼쪽 비트가 1 이면 음수', '넘침': '계산 결과가 레지스터 크기(64비트)를 넘어 위쪽이 버려지는 것. 오버플로(overflow)' },
  pages: [
    { title: 'add rax, rbx · sub · inc · dec', html: `<p>계산 명령도 <code>mov</code> 처럼 <b>받는 쪽이 앞</b>이에요. <code>add rax, rbx</code> 는 「rax 에 rbx 를 더해서 <b>rax 에</b> 넣어라」 — 파이썬의 <code>rax += rbx</code> 예요. 뒤의 rbx 는 그대로예요.</p>
<table class="kb"><tbody><tr><td><code>add rax, rbx</code></td><td>rax = rax + rbx</td></tr><tr><td><code>sub rax, 5</code></td><td>rax = rax − 5 (주는 쪽에는 숫자도 돼요)</td></tr><tr><td><code>inc rax</code></td><td>rax = rax + 1</td></tr><tr><td><code>dec rbx</code></td><td>rbx = rbx − 1</td></tr></tbody></table>
<p>예제를 한 줄씩 따라가면 레지스터가 이렇게 바뀌어요.</p>
<pre>명령             rax   rbx
mov rax, 10       10     -
mov rbx, 3        10     3
add rax, rbx      13     3
sub rax, 5         8     3
inc rax            9     3
dec rbx            9     2
add rax, rbx      11     2</pre>
<p>결과는 [[레슨:R1]] 에서처럼 <code>rdi</code> 에 옮기고 <code>exit</code> 해요. 빌드한 뒤 <code>./calc; echo $?</code> 로 실행하면 <code>11</code>.</p>
<div class="bk-warn"><b>파이썬의 「c = a + b」 같은 모양은 없어요</b> — 계산 명령은 두 칸(받는 쪽, 주는 쪽)이고 결과는 늘 받는 쪽에 덮어써요. 원래 값을 남기려면 먼저 <code>mov rcx, rax</code> 로 복사하고 <code>add rcx, rbx</code>. 받는 쪽에 숫자를 쓰면(<code>add 5, rax</code>) nasm 이 <code>invalid combination of opcode and operands</code> 라고 해요.</div>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 10         ; rax = 10\n    mov rbx, 3          ; rbx = 3\n    add rax, rbx        ; rax = 10 + 3 = 13\n    sub rax, 5          ; rax = 13 - 5 = 8\n    inc rax             ; rax = 9\n    dec rbx             ; rbx = 2\n    add rax, rbx        ; rax = 9 + 2 = 11\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'imul rax, rbx — 곱하기', html: `<p>곱하기는 <code>imul</code>(integer multiply — 부호 있는 정수 곱하기)이에요. 쓰는 모양이 세 가지예요.</p>
<table class="kb"><tbody><tr><td><code>imul rax, rbx</code></td><td>rax = rax × rbx</td></tr><tr><td><code>imul rax, 10</code></td><td>rax = rax × 10</td></tr><tr><td><code>imul rcx, rbx, 3</code></td><td>rcx = rbx × 3 — 세 칸 모양(받는 쪽, 곱할 레지스터, 숫자). rbx 는 그대로라 복사가 필요 없어요</td></tr></tbody></table>
<p>예제는 6 × 7 = 42 를 rax 에, 7 × 3 = 21 을 rcx 에 만들고 둘을 더해요. 실행하면 <code>63</code>.</p>
<p class="muted small">64비트 × 64비트는 128비트까지 커질 수 있어요. 이 모양의 imul 은 아래 64비트만 남겨요(넘침은 이 레슨 마지막 쪽). 부호 없는 곱하기 <code>mul</code> 도 있지만 이 교과서는 imul 만 써요.</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 6\n    mov rbx, 7\n    imul rax, rbx       ; rax = 6 × 7 = 42\n    imul rcx, rbx, 3    ; rcx = 7 × 3 = 21 (rbx 는 그대로)\n    add rax, rcx        ; rax = 42 + 21 = 63\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'idiv rbx · cqo — 몫과 나머지', html: `<p>나누기는 조금 특별해요. <code>idiv rbx</code> 는 칸이 하나뿐이고, 나눌 수는 <b>정해진 자리</b>에 미리 넣어 둬요.</p>
<pre>  rdx:rax     ← 나눌 수 (rdx 와 rax 를 이어 붙인 128비트)
÷ rbx         ← idiv 뒤에 쓴 레지스터
= 몫은 rax, 나머지는 rdx</pre>
<p>나눌 수는 보통 rax 하나에 들어 있으니 rdx 를 rax 에 맞게 채워야 해요. 그게 <code>cqo</code> — rax 가 양수면 rdx 를 전부 0 으로, 음수면 전부 1 로 채워 「rdx:rax = rax」 가 되게 해요. 그래서 <b>idiv 바로 앞에는 늘 cqo</b>.</p>
<table class="kb"><tbody><tr><td><code>mov rax, 47</code></td><td>나눌 수</td></tr><tr><td><code>mov rbx, 5</code></td><td>나누는 수 — <code>idiv 5</code> 처럼 숫자는 못 써요, 레지스터에 넣어서</td></tr><tr><td><code>cqo</code></td><td>rdx:rax = 47</td></tr><tr><td><code>idiv rbx</code></td><td>rax = 9 (몫) · rdx = 2 (나머지)</td></tr></tbody></table>
<p>파이썬의 <code>47 // 5</code> 와 <code>47 % 5</code> 를 한 번에 하는 셈이에요. 종료 코드는 숫자 하나뿐이라 예제는 「몫 × 10 + 나머지」 로 묶었어요. 실행하면 <code>92</code> — 몫 9, 나머지 2.</p>
<div class="bk-warn"><b>0 으로 나누면 프로그램이 멈춰요</b> — rbx 가 0 이면 터미널에 <code>Floating point exception (core dumped)</code> 가 나오고 끝나요(<code>echo $?</code> 는 136). 이름은 「부동소수점」 이지만 정수 나눗셈 에러예요. VM 이 망가진 게 아니라 그 프로그램만 멈춘 거예요.</div>
<p class="muted small">음수를 나누면 몫은 0 쪽으로 버려져요. −9 ÷ 2 는 몫 −4 · 나머지 −1 이에요(파이썬 <code>-9 // 2</code> 는 −5 라 달라요).</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 47         ; 나눌 수\n    mov rbx, 5          ; 나누는 수\n    cqo                 ; rdx:rax = 47 (rdx 를 rax 의 부호로 채움)\n    idiv rbx            ; 몫 rax = 9, 나머지 rdx = 2\n    imul rax, 10        ; 9 × 10 = 90\n    add rax, rdx        ; 90 + 2 = 92\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'neg · 음수와 2의 보수', html: `<p><code>sub rax, 5</code> 로 3 − 5 를 하면 rax 는 −2 가 돼요. 그런데 레지스터에는 「−」 를 적는 칸이 따로 없어요. 음수는 [[2의 보수]]로 적어요.</p>
<pre> 2 = 0000 0000 … 0000 0010
−2 = 1111 1111 … 1111 1110   ← 2 의 비트를 전부 뒤집고(…1101) 1 더하기
−1 = 1111 1111 … 1111 1111   ← 64비트가 전부 1</pre>
<p>맨 왼쪽 비트가 1 이면 음수로 봐요. 이렇게 적으면 더하기 회로 하나로 빼기까지 돼요 — −2 + 2 를 비트로 더하면 받아올림이 맨 왼쪽 밖으로 빠져나가고 0 만 남아요.</p>
<p><code>neg rax</code> 는 부호를 뒤집어요(rax = −rax). 하는 일이 바로 「비트를 다 뒤집고 1 더하기」 예요.</p>
<p>종료 코드는 rdi 의 아래 8비트만 보여 줘요([[레슨:R1]]). −1 의 아래 8비트는 <code>1111 1111</code> = 255, −2 는 254, −3 은 253 … 예제는 3 − 5 = −2 에 −1 을 더해요. 실행하면 <code>253</code> — −3 이에요.</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 3\n    sub rax, 5          ; rax = 3 - 5 = -2\n    mov rbx, 1\n    neg rbx             ; rbx = -1 (부호 뒤집기)\n    add rax, rbx        ; rax = -2 + (-1) = -3\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: '넘침: 64비트를 넘으면 잘려요', html: `<p>레지스터는 64칸짜리 상자라서 결과가 64비트를 넘으면 <b>넘친 위쪽은 버려져요</b>. 이게 [[넘침]](오버플로)이에요. 파이썬 정수는 얼마든지 커지지만 레지스터는 아니에요.</p>
<pre>  0xFFFFFFFFFFFFFFFF    ← 64비트가 전부 1
+ 0x000000000000002B    ← 43
= 0x1000000000000002A   ← 65번째 자리의 1 은 버려짐
→ rax = 0x2A = 42</pre>
<p>실행하면 <code>42</code>. 같은 64비트를 부호 있는 수로 보면 0xFFFFFFFFFFFFFFFF 는 −1 이라 −1 + 43 = 42 — 이것도 맞아요. 비트는 같고, <b>부호 있게 볼지 없게 볼지는 사람(과 다음에 쓰는 명령)이 정해요</b>.</p>
<table class="kb"><tbody><tr><td><b>부호 없이</b></td><td>0 ~ 18446744073709551615 (2⁶⁴ − 1)</td></tr><tr><td><b>부호 있게</b></td><td>−9223372036854775808 ~ 9223372036854775807</td></tr></tbody></table>
<p>가장 큰 양수 0x7FFFFFFFFFFFFFFF 에 1 을 더하면 0x8000000000000000 — 맨 왼쪽 비트가 켜져서 가장 작은 음수가 돼요. CPU 는 이런 일이 생겼다는 표시(플래그)를 남겨 두는데, 그건 [[레슨:R5]] 에서 봐요.</p>
<div class="bk-warn"><b>종료 코드가 잘리는 것과는 다른 이야기예요</b> — 종료 코드가 0~255 인 건 운영체제가 rdi 의 아래 8비트만 넘겨줘서고([[레슨:R1]]), 넘침은 계산 자체가 64비트에서 잘리는 거예요.</div>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 0xFFFFFFFFFFFFFFFF ; 64비트가 전부 1\n    add rax, 43         ; 넘친 맨 위 1 은 버려짐 → 42\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
  ],
  summary: ['add · sub · imul 은 앞(받는 쪽) 레지스터에 결과', 'idiv 는 cqo 먼저 — 몫 rax, 나머지 rdx', '음수는 2의 보수(255 = −1) · 64비트를 넘으면 잘림'] },
{ id: 'R4', ch: 1, n: 4, title: '비트 연산: and · or · xor · shl · shr', mode: 'text',
  tutorSummary: '비트 자리별 계산(결과는 받는 쪽): and 로 고르기, or 로 켜기, xor 로 뒤집기, not 은 전부 뒤집기. xor rax, rax = 0(mov rax, 0 보다 짧음), and rbx, 0xFF 는 아래 8비트. shl = ×2ⁿ, shr = ÷2ⁿ(부호 없음), sar 는 부호 유지. and rax, 1 로 홀짝, and rax, 7 은 8 로 나눈 나머지. 아스키 대소문자는 0x20 한 비트 차이: xor al, 0x20 뒤집기, and al, 0xDF 늘 대문자. 알고리즘 교과서 A17 비트 연산과 짝.',
  terms: { '마스크': '골라내거나 켜거나 뒤집을 비트 자리에만 1 을 둔 수. and · or · xor 의 뒤에 와요' },
  pages: [
    { title: 'and · or · xor — 비트 자리별 계산', html: `<p>비트 연산은 두 수를 2진수로 세로로 맞춰 놓고 <b>같은 자리끼리</b> 계산해요. 개념은 <a href="../algo/#lesson/A17" target="_blank" rel="noopener">알고리즘 교과서 「비트 연산」 ↗</a> 에서 파이썬 <code>&amp;</code> <code>|</code> <code>^</code> 로 봤어요. 어셈블리에서는 명령 이름이 그대로고, 결과는 역시 받는 쪽(앞)에 들어가요.</p>
<table class="kb"><tbody><tr><td><code>and rax, rbx</code></td><td>둘 다 1 이면 1</td><td><b>고르기</b> — 마스크가 1 인 자리만 남김</td></tr><tr><td><code>or rax, rbx</code></td><td>하나라도 1 이면 1</td><td><b>켜기</b> — 마스크 자리를 1 로</td></tr><tr><td><code>xor rax, rbx</code></td><td>서로 다르면 1</td><td><b>뒤집기</b> — 마스크 자리를 0 ↔ 1</td></tr><tr><td><code>not rax</code></td><td>전부 뒤집기</td><td>칸이 하나</td></tr></tbody></table>
<p>뒤에 오는 수를 [[마스크]]라고 생각하면 쉬워요 — 「어느 자리를 건드릴지」 를 1 로 표시한 수예요. 숫자는 <code>0b</code> 로 2진수 그대로 써도 돼요([[레슨:R1]]).</p>
<pre>              1100 1100   rax = 204
and 마스크    1010 1010 → 1000 1000  (136)
or  마스크    0000 0011 → 1000 1011  (139)
xor 마스크    1111 1111 → 0111 0100  (116)</pre>
<p>실행하면 <code>116</code>.</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 0b11001100 ; 204\n    and rax, 0b10101010 ; 고르기 → 0b10001000 (136)\n    or  rax, 0b00000011 ; 켜기   → 0b10001011 (139)\n    xor rax, 0b11111111 ; 뒤집기 → 0b01110100 (116)\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'xor rax, rax 로 0 · and 0xFF', html: `<p>자기 자신과 xor 하면 모든 자리가 「같음」 이라 전부 0 이에요. 그래서 <code>xor rax, rax</code> 는 rax 를 0 으로 만들어요. <code>mov rax, 0</code> 과 결과는 같은데 기계어가 더 짧아서, 컴파일러가 만든 코드([[레슨:R15]])에서 아주 자주 봐요.</p>
<pre>mov rax, 0     →  b8 00 00 00 00   (5바이트)
xor rax, rax   →  48 31 c0         (3바이트)
xor eax, eax   →  31 c0            (2바이트)</pre>
<p><code>xor eax, eax</code> 도 rax 전체가 0 이 돼요 — 32비트 이름에 쓰면 위 32비트가 0 이 되니까요([[레슨:R1]]). 바이트는 <code>objdump -d -M intel 파일.o</code> 로 직접 볼 수 있어요.</p>
<p>and 는 「아래 8비트만 고르기」 에도 써요. <code>and rbx, 0xFF</code> 의 0xFF 는 <code>1111 1111</code> 이라 아래 8칸만 남기고 위는 전부 0 으로 만들어요. 300 = <code>1 0010 1100</code> → <code>0010 1100</code> = 44 — 종료 코드가 큰 수를 잘라 보여 주는 것([[레슨:R1]])과 같은 일이에요. 실행하면 <code>44</code>.</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 300\n    mov rbx, rax        ; rbx = 300\n    and rbx, 0xFF       ; 아래 8비트만 → 44\n    xor rax, rax        ; rax = 0\n    add rax, rbx        ; rax = 0 + 44\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'shl · shr · sar — 비트 밀기', html: `<p><code>shl rax, 3</code> 은 비트를 왼쪽으로 3칸 밀고 오른쪽 빈칸은 0 으로 채워요. 2진수에서 한 칸 = ×2 라서 3칸은 ×8 이에요(파이썬 <code>&lt;&lt;</code>). <code>shr rax, 1</code> 은 오른쪽으로 밀어요 = ÷2. 떨어져 나간 비트는 버려서 몫만 남아요(파이썬 <code>&gt;&gt;</code>).</p>
<pre>5            = 0000 0101
shl rax, 3   = 0010 1000   (40 = 5 × 8)
shr rax, 1   = 0001 0100   (20 = 40 ÷ 2)</pre>
<p>음수에 shr 을 쓰면 왼쪽 빈칸이 0 으로 채워져서 맨 왼쪽(부호) 비트가 0 이 돼요 — 엉뚱한 큰 양수가 돼요. 부호를 지키며 나누려면 <code>sar</code>(산술 시프트). 빈칸을 원래 맨 왼쪽 비트로 채워요.</p>
<pre>−16          = 1111 … 1111 0000
shr rbx, 2   = 0011 … 1111 1100   (4611686018427387900 — 엉뚱한 수)
sar rbx, 2   = 1111 … 1111 1100   (−4 = −16 ÷ 4)</pre>
<p>예제는 5 → 40 → 20 과 −16 → −4 를 더해요. 실행하면 <code>16</code>.</p>
<p class="muted small">shl 은 imul 보다 빨라서 컴파일러가 ×8 같은 곱을 shl 로 바꾸곤 해요. 밀 칸 수에는 숫자나 <code>cl</code>(rcx 의 아래 8비트)만 쓸 수 있어요. sar 는 아래쪽으로 버려서 −7 을 sar 1 하면 −4 예요(idiv 는 −3).</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 5\n    shl rax, 3          ; 5 × 8 = 40\n    shr rax, 1          ; 40 ÷ 2 = 20\n    mov rbx, -16\n    sar rbx, 2          ; -16 ÷ 4 = -4 (부호를 지킴)\n    add rax, rbx        ; 20 + (-4) = 16\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'and rax, 1 — 홀짝과 나머지', html: `<p>2진수의 맨 오른쪽 비트(1 의 자리)는 홀수면 1, 짝수면 0 이에요. 그래서 <code>and rax, 1</code> 하면 홀수 1 · 짝수 0 — idiv 없이 「2 로 나눈 나머지」 예요. 같은 방법으로 <code>and rax, 7</code> 은 8 로 나눈 나머지, <code>and rax, 15</code> 는 16 으로 나눈 나머지예요(2의 거듭제곱 − 1 을 마스크로).</p>
<pre>1234567  = … 1101 0110 1000 0111
and 1    =                     1   → 홀수
and 7    =                   111   → 7 (8 로 나눈 나머지)</pre>
<p>예제는 두 결과를 「홀짝 × 10 + 나머지」 로 묶어요. 실행하면 <code>17</code>.</p>
<p>음수도 돼요. −3 은 2의 보수로 <code>…1111 1101</code>([[레슨:R3]])이라 and 1 → 1, 홀수예요.</p>
<p class="muted small">「홀수면 이걸 해라」 같은 갈래는 [[레슨:R5]] 의 비교와 점프로 만들어요. 지금은 결과를 숫자로 보기만 해요.</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, 1234567\n    mov rbx, rax\n    and rax, 1          ; 홀짝: 홀수면 1\n    and rbx, 7          ; 8 로 나눈 나머지 = 7\n    imul rax, 10\n    add rax, rbx        ; 1 × 10 + 7 = 17\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
    { title: 'xor al, 0x20 — 대문자 ↔ 소문자', html: `<p>글자도 숫자예요(아스키 번호). 영어 대문자와 소문자는 정확히 32(0x20)씩 떨어져 있고, 2진수로 보면 <b>딱 한 비트</b>(0x20 자리)만 달라요.</p>
<table class="kb"><tbody><tr><th>글자</th><th>10진</th><th>16진</th><th>2진</th></tr><tr><td>A</td><td>65</td><td>0x41</td><td>0100 0001</td></tr><tr><td>a</td><td>97</td><td>0x61</td><td>0110 0001</td></tr><tr><td>G</td><td>71</td><td>0x47</td><td>0100 0111</td></tr><tr><td>g</td><td>103</td><td>0x67</td><td>0110 0111</td></tr></tbody></table>
<table class="kb"><tbody><tr><td><code>xor al, 0x20</code></td><td>뒤집기 — 대문자 ↔ 소문자</td></tr><tr><td><code>and al, 0xDF</code></td><td>0x20 자리 끄기 — 늘 대문자 (0xDF = 1101 1111)</td></tr><tr><td><code>or al, 0x20</code></td><td>0x20 자리 켜기 — 늘 소문자</td></tr></tbody></table>
<p>글자 하나는 1바이트라 al(rax 의 아래 8비트, [[레슨:R1]])로 다뤄요. NASM 에서 <code>'a'</code> 처럼 작은따옴표로 쓰면 그 글자의 번호(97)예요. 실행하면 <code>65</code> — 표에서 A 예요.</p>
<div class="bk-warn"><b>영어 글자에만 돼요</b> — 숫자 1(0x31)이나 ! 에 xor 0x20 을 하면 엉뚱한 글자가 되고, 한글은 UTF-8 로 한 글자가 3바이트라 이 방법이 안 맞아요. 글자인지 먼저 확인하는 건 [[레슨:R5]] 의 비교, 문자열 전체를 바꾸는 건 [[레슨:R8]].</div>
<p class="muted small">바꾼 글자를 화면에 찍으려면 메모리에 다시 써야 해서([[레슨:R7]]) 지금은 종료 코드로 번호만 봐요.</p>`,
      example: { code: 'section .text\nglobal _start\n_start:\n    mov rax, \'a\'        ; rax = 97 (0x61)\n    xor al, 0x20        ; 0x20 자리 뒤집기 → 65 (0x41) = \'A\'\n    mov rdi, rax        ; 결과를 종료 코드로\n    mov rax, 60         ; exit\n    syscall', echoExit: true } },
  ],
  summary: ['and 고르기 · or 켜기 · xor 뒤집기 · xor rax, rax 는 0', 'shl ×2 · shr ÷2 · 음수는 sar', 'and rax, 1 홀짝 · xor al, 0x20 대소문자'] },
{ id: 'RB1', ch: 1, boss: true, title: '만들어 보기: 계산 결과 알림', mode: 'text',
  tutorSummary: '챕터 1 묶기 — calc.asm: 두 수(r8 · r9)의 합 · 차 · 곱을 r12 · r13 · r14 에, 제목은 write, 합은 종료 코드로. 갈래(점프)는 아직 없으니 메시지는 계산으로 고름: 같은 길이 메시지 두 줄을 나란히 두고, 100 - 합 을 shr 63 해서 0/1(넘었나), and 1 로 홀짝, 그 수 × 한 줄 길이를 주소에 더해 write. syscall 은 rcx · r11 을 망가뜨림.', pages: [], summary: [] },
{ id: 'R5', ch: 2, n: 5, title: '비교와 점프: cmp · jmp · je · jl', mode: 'text',
  tutorSummary: '라벨(줄 맨 앞 이름:)과 jmp(무조건 건너뛰기). cmp a, b 는 a - b 를 해 보고 결과는 버리고 플래그(ZF SF CF OF)만 남김 — 바로 다음 조건 점프가 플래그를 봄. je jne jl jle jg jge(부호 있음), jb jbe ja jae(부호 없음), jz = je · jnz = jne. -1 은 부호 없게 보면 가장 큰 수. if/else 는 「반대 조건으로 else 로 점프 → if 쪽 → jmp 끝」. cmp 5, rax 는 에러, mov 는 플래그를 안 바꿈.',
  terms: { '라벨': '코드의 한 자리에 붙인 이름(줄 맨 앞에 이름:). 점프할 곳이 돼요', '플래그': 'cmp · add · dec 같은 명령이 결과를 보고 남기는 1비트짜리 표시(ZF · SF · CF · OF). 조건 점프가 이걸 보고 갈지 말지 정해요' },
  pages: [
    { title: '라벨과 jmp: 무조건 건너뛰기', html: `<p>지금까지의 프로그램은 위에서 아래로 한 줄씩 실행됐어요. CPU 는 늘 「다음 줄」 을 실행해요. <code>jmp</code>(jump) 는 「다음 줄 말고 저기로 가」 예요.</p>
<p>「저기」 는 [[라벨]]로 정해요. 줄 맨 앞(들여쓰기 없이)에 이름과 <code>:</code> 를 쓰면 그 자리에 이름이 붙어요. 늘 쓰던 <code>_start:</code> 도 라벨이에요. 이름은 영어 글자 · 숫자 · <code>_</code> 로, 숫자로 시작하면 안 돼요.</p>
<pre class="code">    mov rdi, 1          ; 종료 코드 1
    jmp done            ; done: 이 붙은 줄로 가요
    mov rdi, 99         ; 건너뜀 — 실행되지 않아요
done:
    mov rax, 60         ; 여기부터 다시 한 줄씩</pre>
<p>예제를 <code>jump.asm</code> 으로 저장해 빌드하고 <code>./jump; echo $?</code> 로 실행하면 종료 코드가 99 가 아니라 1 이에요. <code>mov rdi, 99</code> 를 건너뛰었으니까요.</p>
<p>파이썬에는 이런 「아무 데로나 가기」 가 없어요. 대신 <code>if</code> · <code>while</code> · <code>for</code> 가 있죠. 어셈블리에는 그런 문장이 없어서, <b>점프로 if 와 반복을 직접 만들어요</b>. 이 레슨에서 if 를, [[레슨:R6]] 에서 반복을 만들어요.</p>`,
      example: { echoExit: true, code: `section .text
global _start
_start:
    mov rdi, 1          ; 종료 코드 1
    jmp done            ; done 으로 바로 건너뛰어요
    mov rdi, 99         ; 이 줄은 실행되지 않아요
done:
    mov rax, 60         ; exit
    syscall` } },
    { title: 'cmp 와 플래그 · je · jne', html: `<p><code>cmp a, b</code> 는 <b>a − b 를 계산해 보고, 결과는 버려요</b>. 대신 결과가 어땠는지를 [[플래그]]에 남겨요. 플래그는 CPU 안에 있는 1비트짜리 표시예요.</p>
<table class="kb"><tbody><tr><td><b>ZF</b>(Zero)</td><td>결과가 0 이면 1 → a 와 b 가 같아요</td></tr><tr><td><b>SF</b>(Sign)</td><td>결과가 음수면 1</td></tr><tr><td><b>CF</b>(Carry)</td><td>부호 없는 수로 빼다가 「빌려 왔으면」 1 → 부호 없이 a &lt; b</td></tr><tr><td><b>OF</b>(Overflow)</td><td>부호 있는 수로 계산이 넘쳤으면 1</td></tr></tbody></table>
<pre>cmp rax, 5        (rax = 5)
  5 − 5 = 0   → 결과는 버리고 플래그만
  ZF = 1        0 이 나왔어요 (같아요)
  SF = 0        음수가 아니에요
  CF = 0        빌려 오지 않았어요</pre>
<p>바로 다음의 <b>조건 점프</b>가 플래그를 보고 갈지 말지 정해요. <code>je 라벨</code>(jump if equal)은 ZF = 1 이면, <code>jne</code>(not equal)는 ZF = 0 이면 점프해요. 점프하지 않으면 그냥 다음 줄로 가요.</p>
<p>예제는 rax 가 5 일 때만 <code>mov rdi, 1</code> 까지 와요. 실행하면 종료 코드가 1 이에요. <code>mov rax, 5</code> 를 <code>mov rax, 6</code> 으로 바꾸면 <code>jne</code> 가 점프해서 0 이 나와요.</p>
<ul><li><code>cmp</code> 의 앞쪽은 레지스터여야 해요(메모리도 되는데 [[레슨:R7]] 에서). <code>cmp 5, rax</code> 는 nasm 에러예요.</li><li><code>add</code> · <code>sub</code> · <code>dec</code> · <code>and</code> 같은 계산도 플래그를 바꿔요. 그래서 <code>and rax, 1</code>([[레슨:R4]] 의 홀짝) 바로 뒤에 <code>jz</code>(0 이면 점프 — <code>je</code> 와 같은 명령) · <code>jnz</code>(0 이 아니면) 를 쓸 수 있어요.</li><li><code>mov</code> 는 플래그를 안 바꿔요. 그래서 <code>cmp</code> 와 점프 사이에 <code>mov</code> 는 끼워도 돼요.</li></ul>`,
      example: { echoExit: true, code: `section .text
global _start
_start:
    mov rax, 5
    mov rdi, 0          ; 기본은 0
    cmp rax, 5          ; 5 - 5 = 0 → ZF = 1
    jne done            ; 같지 않으면(ZF = 0) done 으로
    mov rdi, 1          ; 같을 때만 여기까지 와요
done:
    mov rax, 60
    syscall` } },
    { title: '조건 점프 표: jl · jg · jb · ja', html: `<p><code>cmp a, b</code> 바로 다음에 쓰는 조건 점프예요. 「a 가 b 보다 어떤가」 로 읽어요.</p>
<table class="kb"><tbody><tr><th>명령</th><th>점프하는 때</th><th>파이썬</th></tr><tr><td><code>je</code> · <code>jne</code></td><td>같다 · 다르다</td><td><code>==</code> · <code>!=</code></td></tr><tr><td><code>jl</code> · <code>jle</code></td><td>작다 · 작거나 같다 (less) — 부호 있음</td><td><code>&lt;</code> · <code>&lt;=</code></td></tr><tr><td><code>jg</code> · <code>jge</code></td><td>크다 · 크거나 같다 (greater) — 부호 있음</td><td><code>&gt;</code> · <code>&gt;=</code></td></tr><tr><td><code>jb</code> · <code>jbe</code></td><td>작다 · 작거나 같다 (below) — 부호 없음</td><td></td></tr><tr><td><code>ja</code> · <code>jae</code></td><td>크다 · 크거나 같다 (above) — 부호 없음</td><td></td></tr><tr><td><code>jz</code> · <code>jnz</code></td><td>결과가 0 · 0 아님 (<code>je</code> · <code>jne</code> 와 같은 명령)</td><td></td></tr></tbody></table>
<p>왜 두 벌일까요? 64비트 안의 비트는 똑같아도 <b>보는 방법</b>이 둘이라서예요. −1 은 2의 보수로 <code>0xFFFFFFFFFFFFFFFF</code>([[레슨:R3]])예요. 부호 있게 보면 −1, 부호 없게 보면 <b>가장 큰 수</b>예요. <code>cmp</code> 는 똑같이 빼 보기만 하고, <b>어떤 점프를 고르느냐</b>로 「어떻게 볼지」 정해요.</p>
<p>외우는 법: <b>less · greater 는 부호 있음</b>, <b>below · above 는 부호 없음</b>. 음수가 나올 수 있는 값이면 <code>jl</code> · <code>jg</code> 쪽을 써요.</p>
<p>예제는 −1 과 1 을 비교해요. 실행하면 종료 코드가 1 이에요(<code>jl</code> 은 −1 &lt; 1 이라 점프). <code>jl</code> 을 <code>jb</code> 로 바꾸고 다시 실행하면 2 예요 — 부호 없이 보면 −1 이 1 보다 커서 점프하지 않아요.</p>`,
      example: { echoExit: true, code: `section .text
global _start
_start:
    mov rax, -1
    mov rbx, 1
    cmp rax, rbx        ; -1 과 1 을 비교
    jl  less            ; 부호 있게: -1 < 1 → 점프
    mov rdi, 2          ; 점프하지 않으면 2
    jmp done
less:
    mov rdi, 1          ; 점프하면 1
done:
    mov rax, 60
    syscall` } },
    { title: 'if / else 모양 만들기', html: `<p>파이썬의 if / else 를 점프로 바꿔 볼게요.</p>
<pre class="code">a = 17
b = 42
if a &gt; b:
    print("a 가 커요")
else:
    print("b 가 커요")</pre>
<p>어셈블리는 늘 이 모양이에요.</p>
<pre>    cmp a, b
    j(반대 조건) else_part   ; 조건이 거짓이면 else 로
    … if 쪽 …
    jmp end_if               ; else 를 건너뛰기
else_part:
    … else 쪽 …
end_if:
    … 이어서 …</pre>
<ol><li><b>반대 조건</b>으로 점프해요. 「a &gt; b 면 if 쪽」 이니 그 반대 「a &lt;= b 면 else 로」 → <code>jle</code>. 조건이 맞으면 점프하지 않고 아래의 if 쪽으로 흘러가요.</li><li>if 쪽 끝의 <code>jmp</code> 를 잊지 마세요. 빼먹으면 if 쪽을 실행한 뒤 else 쪽까지 이어서 실행해요.</li><li>갈래가 셋(<code>elif</code>)이면 <code>cmp</code> 와 점프를 한 번 더 써요 — 「만들어 보기」 에서.</li></ol>
<p>예제는 두 갈래 모두 「무엇을 찍을지」(<code>rsi</code> · <code>rdx</code>)만 정하고, <code>write</code> 는 <code>print:</code> 에서 한 번 불러요. 실행하면 <code>b 가 커요</code> 가 나와요. <code>mov rax, 17</code> 을 <code>mov rax, 50</code> 으로 바꾸면 <code>a 가 커요</code>.</p>`,
      example: { code: `section .data
msg_a   db "a 가 커요", 10
len_a   equ $ - msg_a
msg_b   db "b 가 커요", 10
len_b   equ $ - msg_b

section .text
global _start
_start:
    mov rax, 17         ; a
    mov rbx, 42         ; b
    cmp rax, rbx
    jle else_part       ; a > b 의 반대(a <= b)면 else 로
    mov rsi, msg_a      ; if 쪽: "a 가 커요"
    mov rdx, len_a
    jmp print           ; else 쪽을 건너뛰어요
else_part:
    mov rsi, msg_b      ; else 쪽: "b 가 커요"
    mov rdx, len_b
print:
    mov rax, 1          ; write
    mov rdi, 1          ; stdout
    syscall
    mov rax, 60         ; exit
    mov rdi, 0
    syscall` } },
  ],
  summary: ['cmp a, b 는 a − b 를 해 보고 결과는 버리고 플래그(ZF · SF · CF · OF)만 남겨요 — 바로 다음 점프가 그걸 봐요', 'je · jne · jl · jle · jg · jge 는 부호 있음, jb · ja 는 부호 없음(−1 이 가장 큰 수)', 'if / else = 반대 조건으로 else 로 점프 → if 쪽 → jmp 로 끝으로'] },
{ id: 'R6', ch: 2, n: 6, title: '반복 만들기', mode: 'text',
  tutorSummary: '카운터 반복: mov rbx, n → 몸통 → dec rbx → jnz 위로(dec 가 ZF 를 바꿈). while 모양: 몸통 → inc/계산 → cmp → jl 위로(do-while), 0 번일 수 있으면 위에서 cmp + jge 끝. 1~n 합(add rdi, rcx · dec rcx · jnz), 거듭제곱(imul). loop 명령 = dec rcx + jnz(rcx 만, 잘 안 씀). syscall 은 rcx · r11 을 바꾸고 결과를 rax 에 넣음 → 반복 안에서 write 하면 카운터는 rbx, rax 는 매번 다시. 끝 조건이 틀리면 안 끝남 → Ctrl+C(종료 코드 130), timeout 3 ./prog.',
  pages: [
    { title: '카운터 반복: dec · jnz', html: `<p>파이썬의 <code>for _ in range(3):</code> 처럼 「n 번 하기」 는 <b>카운터</b>로 만들어요. 레지스터에 n 을 넣고, 한 번 돌 때마다 1 씩 줄이고, 0 이 아니면 위로 점프해요.</p>
<pre>    mov rbx, 3      ; 카운터
again:              ; ← 여기로 돌아와요
    … 몸통 …
    dec rbx         ; 1 줄이기 — 0 이 되면 ZF = 1
    jnz again       ; 0 이 아니면(ZF = 0) 다시</pre>
<p><code>dec</code> 도 계산이라 [[플래그]]를 바꿔요([[레슨:R5]]). 그래서 <code>cmp</code> 없이 바로 <code>jnz</code> 를 쓸 수 있어요. 따라가 보면:</p>
<table class="kb"><tbody><tr><td>rbx = 3</td><td>몸통 → <code>dec</code> → 2 · ZF = 0 → 점프</td></tr><tr><td>rbx = 2</td><td>몸통 → <code>dec</code> → 1 · ZF = 0 → 점프</td></tr><tr><td>rbx = 1</td><td>몸통 → <code>dec</code> → 0 · ZF = 1 → 점프 안 함, 아래로</td></tr></tbody></table>
<p>몸통이 정확히 3 번 돌아요. 실행하면 「야호」 가 세 줄 나와요.</p>
<div class="bk-warn"><b><code>syscall</code> 은 <code>rcx</code> · <code>r11</code> 을 바꾸고 결과를 <code>rax</code> 에 넣어요</b> — 그래서 반복 안에서 <code>write</code> 를 부를 때는 카운터를 <code>rcx</code> 가 아닌 <code>rbx</code> 같은 레지스터에 두고, <code>mov rax, 1</code> 도 반복 <b>안에서</b> 매번 다시 넣어요(첫 <code>write</code> 가 끝나면 <code>rax</code> 는 쓴 바이트 수예요).</div>`,
      example: { code: `section .data
msg     db "야호", 10
len     equ $ - msg

section .text
global _start
_start:
    mov rbx, 3          ; 카운터: 3 번
again:
    mov rax, 1          ; write (syscall 이 rax 를 바꾸니 매번 다시)
    mov rdi, 1
    mov rsi, msg
    mov rdx, len
    syscall
    dec rbx             ; 3 → 2 → 1 → 0
    jnz again           ; 0 이 아니면 again 으로
    mov rax, 60
    mov rdi, 0
    syscall` } },
    { title: 'while 모양: cmp · jl', html: `<p>몇 번 돌지 미리 모를 때는 <code>cmp</code> + 조건 점프로 「조건이 맞는 동안」 돌려요. 1 을 계속 두 배 해서 100 을 넘을 때까지 몇 번 걸리는지 세 볼게요.</p>
<pre class="code">x = 1
count = 0
while True:
    x = x * 2
    count += 1
    if not (x &lt; 100):
        break</pre>
<p>어셈블리에서는 몸통 <b>맨 아래</b>에서 검사하고, 조건이 맞으면 위로 점프해요. <code>cmp rax, 100</code> → <code>jl grow</code> 가 「rax &lt; 100 이면 또」 예요. 두 배는 <code>shl rax, 1</code>([[레슨:R4]]).</p>
<p>실행하면 종료 코드가 7 이에요. 1 → 2 → 4 → 8 → 16 → 32 → 64 → 128, 일곱 번 만에 100 을 넘었어요.</p>
<p>아래에서 검사하면 몸통이 <b>적어도 한 번</b>은 돌아요. 처음부터 조건이 거짓일 수도 있는 진짜 <code>while</code> 은 <b>위에서</b> 검사해요. 이때는 반대 조건으로 빠져나가요([[레슨:R5]] 의 if 와 같은 요령).</p>
<pre>    mov rbx, 0
check:
    cmp rbx, 5
    jge done        ; while rbx &lt; 5 의 반대(rbx &gt;= 5)면 끝
    … 몸통 …
    inc rbx
    jmp check       ; 다시 검사하러
done:</pre>`,
      example: { echoExit: true, code: `section .text
global _start
_start:
    mov rax, 1          ; 값
    mov rdi, 0          ; 몇 번 두 배 했나
grow:
    shl rax, 1          ; rax × 2
    inc rdi             ; 횟수 + 1
    cmp rax, 100
    jl  grow            ; 아직 100 보다 작으면 또
    mov rax, 60         ; 종료 코드 = rdi
    syscall` } },
    { title: '1~n 합 · 거듭제곱', html: `<p>1 부터 10 까지 더하기예요. 카운터 <code>rcx</code> 를 10 에서 1 까지 줄이면서 그 값을 합에 더해요. 더하는 순서만 거꾸로(10 + 9 + … + 1)고 합은 같아요.</p>
<pre class="code">total = 0
for i in range(10, 0, -1):
    total += i</pre>
<p>실행하면 종료 코드가 55 예요. 이 반복 안에는 <code>syscall</code> 이 없어서 <code>rcx</code> 를 카운터로 써도 괜찮아요.</p>
<p><b>거듭제곱</b>도 같은 모양이에요. 3⁴ 이면 「1 에 3 을 4 번 곱하기」.</p>
<pre class="code">    mov rax, 1          ; 결과
    mov rbx, 3          ; 밑
    mov rcx, 4          ; 4 번
power:
    imul rax, rbx       ; rax = rax × 3
    dec rcx
    jnz power           ; rax = 81</pre>
<div class="bk-warn"><b>종료 코드는 0~255 까지예요</b> — 1~23 의 합(276)부터는 256 으로 나눈 나머지만 보여요([[레슨:R1]]). 큰 결과를 10진 숫자로 찍는 법은 [[레슨:R9]] 에서 만들어요. 그 전까지는 「맞으면 메시지 찍기」([[레슨:R5]] 의 <code>cmp</code>)로 확인해요.</div>`,
      example: { echoExit: true, code: `section .text
global _start
_start:
    mov rcx, 10         ; n = 10 (10, 9, …, 1 을 더해요)
    mov rdi, 0          ; 합
sum:
    add rdi, rcx        ; 합 += rcx
    dec rcx
    jnz sum             ; rcx 가 0 이 될 때까지
    mov rax, 60         ; 종료 코드 = 합
    syscall` } },
    { title: 'loop 명령(rcx)과 syscall', html: `<p>「<code>dec rcx</code> + <code>jnz</code>」 를 한 명령으로 줄인 <code>loop 라벨</code> 도 있어요. <b><code>rcx</code> 만</b> 카운터로 쓸 수 있어요.</p>
<pre>    mov rcx, 5
again:
    … 몸통 …
    loop again      ; rcx − 1, 0 이 아니면 again 으로</pre>
<p>실행하면 5 + 4 + 3 + 2 + 1 이라 종료 코드가 15 예요.</p>
<p>있다는 것만 알아 두세요. 요즘 CPU 에서는 <code>dec</code> + <code>jnz</code> 가 더 빨라서 컴파일러(gcc)는 <code>loop</code> 를 거의 안 써요. 이 교과서도 앞으로 <code>dec</code> + <code>jnz</code> · <code>cmp</code> + 점프를 써요.</p>
<p>그리고 <code>loop</code> 몸통에 <code>syscall</code> 을 넣으면 안 끝나요. <code>syscall</code> 이 돌아올 때 이 레지스터들을 바꾸거든요.</p>
<table class="kb"><tbody><tr><td><code>rax</code></td><td>결과(<code>write</code> 면 쓴 바이트 수)</td></tr><tr><td><code>rcx</code></td><td><code>syscall</code> 명령이 「돌아올 주소」 를 적어 두는 데 써서 망가져요</td></tr><tr><td><code>r11</code></td><td>플래그를 맡겨 두는 데 써서 망가져요</td></tr><tr><td>나머지</td><td>그대로(<code>rbx</code> · <code>rdi</code> · <code>rsi</code> · <code>rdx</code> · <code>r12</code> …)</td></tr></tbody></table>
<p><code>rcx</code> 가 0 이 될 일이 없으니 반복이 끝나지 않아요. 그래서 출력하는 반복의 카운터는 <code>rbx</code> 에 두어요.</p>`,
      example: { echoExit: true, code: `section .text
global _start
_start:
    mov rcx, 5          ; loop 는 rcx 를 카운터로 써요
    mov rdi, 0
again:
    add rdi, rcx        ; 5 + 4 + 3 + 2 + 1
    loop again          ; rcx - 1, 0 이 아니면 again 으로
    mov rax, 60         ; 종료 코드 = 15
    syscall` } },
    { title: '끝나지 않는 반복 → Ctrl+C', html: `<p>끝 조건이 틀리면 반복이 영원히 돌아요. 화면이 멈춘 것처럼 보이거나, 같은 글자가 끝없이 쏟아져요.</p>
<div class="bk-warn"><b>끝나지 않는 프로그램은 VM 이 망가진 게 아니에요</b> — 그 터미널에서 <kbd>Ctrl</kbd>+<kbd>C</kbd> 를 누르면 그 프로그램만 멈춰요. 그다음 <code>echo $?</code> 는 130(Ctrl+C 로 멈춤)이에요. VM 도, 다른 터미널도 멀쩡해요. [[레슨:R2]] 의 <code>Segmentation fault</code> 처럼 이것도 그 프로그램 하나의 문제예요.</div>
<p>자주 하는 실수 세 가지예요.</p>
<pre>; ① 카운터를 줄이는 걸 빼먹음 — rbx 는 영원히 3
    mov rbx, 3
again:
    … 몸통 …
    cmp rbx, 0
    jne again           ; dec rbx 가 없어요

; ② 카운터를 넣는 줄이 라벨 아래 — 돌 때마다 다시 3
again:
    mov rbx, 3
    … 몸통 …
    dec rbx
    jnz again

; ③ 몸통에 syscall 이 있는데 카운터가 rcx — syscall 이 rcx 를 바꿔요
    mov rcx, 3
again:
    … write …
    syscall
    dec rcx
    jnz again</pre>
<p>처음 돌려 보는 반복은 <code>timeout 3 ./prog</code> 로 실행해도 좋아요. 3초가 지나도 안 끝나면 알아서 멈추고, <code>echo $?</code> 가 124 예요.</p>`,
      example: { label: '예제 명령 — 우분투 터미널에서(끝나지 않는 forever.asm)', shell: 'nasm -f elf64 forever.asm -o forever.o\nld forever.o -o forever\n./forever\n# 안 끝나면 Ctrl+C\necho $?\ntimeout 3 ./forever\necho $?' } },
  ],
  summary: ['n 번 반복 = mov rbx, n → 몸통 → dec rbx → jnz 위로 (dec 가 ZF 를 바꿔요)', 'while 모양 = cmp + jl 로 위로(아래에서 검사), 0 번일 수 있으면 위에서 cmp + jge 로 빠져나가기', 'syscall 은 rcx · r11 · rax 를 바꿔요 — 안 끝나면 Ctrl+C'] },
{ id: 'R7', ch: 2, n: 7, title: '메모리와 주소: [ ]', mode: 'text',
  tutorSummary: 'section .data 의 db(1) dw(2) dd(4) dq(8) 바이트, .bss 의 resb resq(처음엔 0). 이름 = 주소, [이름] = 그 주소의 값: mov rax, [num] 읽기 · mov [num], rax 쓰기, 메모리 → 메모리는 안 됨. 크기를 모르면 operation size not specified → byte · word · dword · qword. lea rsi, [msg] = 주소 자체(메모리를 안 읽음). default rel = [이름] 을 rip(다음 명령 주소) 기준 거리로 — 어디에 올려도 맞고 gcc(PIE)에서도 링크됨. 이제부터 맨 위 default rel + lea rsi, [msg].',
  terms: { '주소': '메모리의 바이트마다 붙은 번호. 라벨 이름(msg · num)은 그 자리의 주소예요', 'rip': '「다음에 실행할 명령의 주소」 를 가진 특별한 레지스터. 점프는 사실 rip 를 바꾸는 일이에요' },
  pages: [
    { title: '자리 만들기: db · dq · resb · resq', html: `<p>레지스터는 16개뿐이라 값을 오래 · 많이 두려면 <b>메모리</b>를 써요. 메모리는 바이트가 한 줄로 늘어선 긴 띠이고, 바이트마다 번호([[주소]])가 있어요. <code>section .data</code> 에 이름을 붙여 자리를 만들어요. [[레슨:R2]] 의 <code>msg db "…"</code> 도 그거였어요.</p>
<table class="kb"><tbody><tr><td><code>db</code></td><td>1바이트씩 (byte) — 글자 · 작은 수</td><td><code>small db 7</code> · <code>name db "kim", 10</code></td></tr><tr><td><code>dw</code></td><td>2바이트 (word)</td><td><code>mid dw 300</code></td></tr><tr><td><code>dd</code></td><td>4바이트 (double word)</td><td><code>big dd 70000</code></td></tr><tr><td><code>dq</code></td><td>8바이트 (quad word) — 64비트 레지스터 하나만큼</td><td><code>age dq 30</code></td></tr></tbody></table>
<p>처음 값이 필요 없는 자리는 <code>section .bss</code> 에 크기만 잡아요. <code>buf resb 16</code> 은 「16바이트」, <code>count resq 1</code> 은 「8바이트짜리 하나」 예요. 실행하면 전부 0 으로 시작하고, 실행 파일에는 크기만 적혀서 파일이 커지지 않아요.</p>
<pre>주소 0x402000 →
 small  mid     big            age
 [07]   [2C 01] [70 11 01 00]  [1E 00 00 00 00 00 00 00]  [6B 69 6D 0A] …
  7      300     70000          30                         k  i  m  \\n</pre>
<p>여러 바이트짜리 수는 <b>작은 쪽 바이트가 앞</b>에 놓여요(300 = 0x012C → <code>2C 01</code>, 리틀 엔디언). <code>gdb</code> 로 메모리를 들여다볼 때([[레슨:R16]]) 다시 봐요. 이 자리들이 프로세스 메모리 지도의 「데이터」 칸이에요 — <a href="../os/#lesson/K10" target="_blank" rel="noopener">운영체제 교과서 「가상 메모리」 ↗</a>.</p>
<p>예제 맨 위의 <code>default rel</code> 은 5쪽에서 설명해요. 우선 따라 쓰세요. 실행하면 <code>age</code> 자리의 값을 읽어서 종료 코드가 30 이에요. 읽는 법은 다음 쪽에서.</p>`,
      example: { echoExit: true, code: `default rel                 ; 주소를 rip 기준으로 (5쪽)

section .data
small   db 7                ; 1바이트
mid     dw 300              ; 2바이트
big     dd 70000            ; 4바이트
age     dq 30               ; 8바이트
name    db "kim", 10        ; 1바이트씩 4개

section .bss
buf     resb 16             ; 16바이트 자리 (처음엔 0)
count   resq 1              ; 8바이트 하나

section .text
global _start
_start:
    mov rdi, [age]          ; age 자리의 값 30 (다음 쪽)
    mov rax, 60
    syscall` } },
    { title: '읽기 · 쓰기: mov rax, [num]', html: `<p>어셈블리에서 <b>이름은 주소</b>예요. <code>x</code> 는 「0x402000 번지」 같은 숫자일 뿐이에요. 그 주소에 <b>들어 있는 값</b>을 말하려면 대괄호를 씌워요.</p>
<table class="kb"><tbody><tr><td><code>mov rax, [x]</code></td><td>읽기 — x 번지에서 8바이트를 읽어 rax 에</td></tr><tr><td><code>mov [y], rax</code></td><td>쓰기 — rax 의 8바이트를 y 번지에</td></tr><tr><td><code>add rax, [x]</code></td><td>계산에도 바로 써요 — rax += (x 번지의 값)</td></tr><tr><td><code>add [y], rax</code></td><td>메모리 쪽에 더하기도 돼요 — (y 번지의 값) += rax</td></tr></tbody></table>
<p>파이썬의 <code>y = x + 5</code> 는 이렇게 돼요: 읽기 → 계산 → 쓰기.</p>
<pre>        메모리                        레지스터
x  → [ 10 ] ── mov rax, [x] ──→  rax = 10
                                  add rax, 5   → rax = 15
y  → [ 15 ] ←── mov [y], rax ──</pre>
<p>실행하면 종료 코드가 15 예요.</p>
<div class="bk-warn"><b>메모리 → 메모리는 한 번에 안 돼요</b> — <code>mov [y], [x]</code> 는 nasm 에러(invalid combination of opcode and operands)예요. 한 명령에 <code>[ ]</code> 는 하나만. 레지스터를 거쳐서 두 줄로 옮겨요.</div>`,
      example: { echoExit: true, code: `default rel

section .data
x       dq 10

section .bss
y       resq 1

section .text
global _start
_start:
    mov rax, [x]            ; 읽기: rax = 10
    add rax, 5              ; rax = 15
    mov [y], rax            ; 쓰기: y 자리에 15
    mov rdi, [y]            ; 다시 읽어서 종료 코드로
    mov rax, 60
    syscall` } },
    { title: '크기 정하기: byte · qword', html: `<p><code>[ ]</code> 는 「어디서부터」 만 알려 줘요. <b>몇 바이트</b>를 읽고 쓸지는 다른 쪽(레지스터)의 크기로 정해져요.</p>
<table class="kb"><tbody><tr><td><code>mov rax, [n]</code></td><td>rax 가 8바이트라 8바이트</td></tr><tr><td><code>mov al, [n]</code></td><td>al 이 1바이트라 1바이트([[레슨:R1]] 의 작은 이름)</td></tr><tr><td><code>mov [n], 5</code></td><td>5 는 크기가 없어서 nasm 이 몰라요 → <code>error: operation size not specified</code></td></tr></tbody></table>
<p>숫자를 메모리에 바로 넣을 때는 크기를 붙여요.</p>
<table class="kb"><tbody><tr><td><code>byte</code></td><td>1바이트</td><td><code>mov byte [letter], 'A'</code></td></tr><tr><td><code>word</code></td><td>2바이트</td><td><code>mov word [w], 300</code></td></tr><tr><td><code>dword</code></td><td>4바이트</td><td><code>mov dword [d], 70000</code></td></tr><tr><td><code>qword</code></td><td>8바이트</td><td><code>mov qword [total], 7</code></td></tr></tbody></table>
<p><code>db</code> 로 만든 1바이트 자리를 <code>rax</code> 로 읽으면 뒤에 붙은 이웃 7바이트까지 딸려 와요. <b>만든 크기대로</b> 읽고 쓰세요. <code>[nums + 2]</code> 는 「nums 에서 2바이트 뒤」 예요(배열은 [[레슨:R8]] 에서).</p>
<p>예제는 1바이트 30 을 <code>al</code> 로 읽어(<code>rax</code> 를 먼저 0 으로) 8바이트 자리 total(7)에 더해요. 실행하면 종료 코드가 37 이에요.</p>`,
      example: { echoExit: true, code: `default rel

section .data
nums    db 10, 20, 30       ; 1바이트씩 3개

section .bss
total   resq 1              ; 8바이트

section .text
global _start
_start:
    mov qword [total], 7    ; 크기를 말해야 해요: 8바이트에 7
    mov rax, 0
    mov al, [nums + 2]      ; al 이 1바이트라 1바이트만: 30
    add [total], rax        ; rax 가 8바이트라 8바이트로: 37
    add byte [nums], 1      ; nums 첫 칸 10 → 11 (1바이트)
    mov rdi, [total]
    mov rax, 60
    syscall` } },
    { title: 'lea rsi, [msg]: 주소 자체', html: `<p><code>write</code> 에는 글자가 <b>어디 있는지</b>(주소)를 줘야 해요. 값이 아니라요. 그럴 때 쓰는 게 <code>lea</code>(load effective address)예요. <code>[ ]</code> 안의 주소를 <b>계산만 하고 메모리는 읽지 않아요</b>.</p>
<pre>           주소          메모리
msg  →  0x402000  :  [h] [e] [l] [l] [o] [\\n]

mov al, [msg]    → al  = 'h'         그 주소에 있는 값
lea rsi, [msg]   → rsi = 0x402000    주소 그 자체</pre>
<p>[[레슨:R2]] 에서는 <code>mov rsi, msg</code> 로 주소를 넣었어요. 이제부터는 <code>lea rsi, [msg]</code> 로 써요. 왜 바꾸는지는 다음 쪽에서.</p>
<p>예제는 먼저 <code>mov byte [msg], 'J'</code> 로 첫 바이트를 바꾸고(<b>값</b>을 고침), <code>lea rsi, [msg]</code> 로 <b>주소</b>를 넘겨 찍어요. 실행하면 <code>Jello</code> 가 나와요. <code>section .data</code> 는 실행 중에 고칠 수 있는 자리라서 돼요.</p>`,
      example: { code: `default rel

section .data
msg     db "hello", 10
len     equ $ - msg

section .text
global _start
_start:
    mov byte [msg], 'J'     ; 값 바꾸기: 첫 바이트 'h' → 'J'
    mov rax, 1              ; write
    mov rdi, 1
    lea rsi, [msg]          ; 주소 자체를 rsi 에
    mov rdx, len
    syscall
    mov rax, 60
    mov rdi, 0
    syscall` } },
    { title: 'default rel: rip 기준 주소', html: `<p>CPU 에는 「다음에 실행할 명령의 주소」 를 가진 [[rip]] 라는 레지스터가 있어요. 맨 위의 <code>default rel</code> 은 nasm 에게 「<code>[msg]</code> 를 <b>rip 에서 얼마나 떨어졌나</b>로 적어 줘」 라는 뜻이에요. 그러면 프로그램이 메모리의 어느 주소에 올라가도 거리는 같으니 늘 맞아요.</p>
<p>없으면 nasm 은 <code>0x402000</code> 같은 주소를 명령 안에 통째로 박아요. <code>ld</code> 로 만든 작은 프로그램은 그래도 돌지만, 실행할 때마다 주소가 바뀌는 프로그램(gcc 의 기본, PIE)에서는 링크부터 실패해요(<code>relocation R_X86_64_32S … can not be used when making a PIE object</code>).</p>
<pre>objdump -d -M intel prog   (빌드한 실행 파일 읽기)
  48 b8 00 20 40 00 00 00 00 00   movabs rax,0x402000       ← mov rax, msg
  48 8d 1d ef 0f 00 00            lea    rbx,[rip+0xfef]   ← lea rbx, [msg]</pre>
<p>실행 파일을 읽는 <code>objdump</code> 는 [[레슨:R15]] 에서 배워요. 두 줄 모두 결국 같은 주소예요. 예제가 그걸 <code>cmp</code> 로 확인해요 — 실행하면 <code>같은 주소</code> 가 나와요.</p>
<div class="bk-step-box"><b>이제부터의 약속</b><br>파일 맨 위에 <code>default rel</code> 한 줄, 주소는 <code>lea rsi, [msg]</code>, 값은 <code>mov rax, [num]</code>. 다음 레슨부터 늘 이 모양이에요.</div>`,
      example: { code: `default rel                 ; 이 파일의 [이름] 은 rip 기준

section .data
msg     db "같은 주소", 10
len     equ $ - msg

section .text
global _start
_start:
    mov rax, msg            ; 레슨 2 방식: 주소를 숫자로 통째로
    lea rbx, [msg]          ; 새 방식: rip 에서의 거리로 계산
    cmp rax, rbx
    jne done                ; 다르면 아무것도 안 찍고 끝
    mov rax, 1
    mov rdi, 1
    lea rsi, [msg]
    mov rdx, len
    syscall
done:
    mov rax, 60
    mov rdi, 0
    syscall` } },
  ],
  summary: ['db 1 · dw 2 · dd 4 · dq 8 바이트(.data), resb · resq 는 크기만(.bss, 처음엔 0)', '이름 = 주소, [이름] = 그 주소의 값 — 숫자를 넣을 땐 byte · qword 로 크기를', 'lea rsi, [msg] 는 주소 자체 · 맨 위에 default rel(rip 기준)'] },
{ id: 'R8', ch: 2, n: 8, title: '배열과 문자열', mode: 'text',
  tutorSummary: "배열 arr dq 3, 1, 4 — 칸 i 는 시작 주소 + i×8. lea rbx, [arr] 후 [rbx + rcx*8](크기 1·2·4·8). 칸 수 n equ ($ - arr) / 8. 합은 add rdi, [rbx + rcx*8] 반복, 최댓값은 0번 칸에서 시작해 cmp + jle 로 건너뛰기. 문자열은 1바이트 배열 [rbx + rcx], 끝에 0(널 문자) — cmp byte [rbx + rcx], 0 까지 세면 길이. mov al, [rbx + rcx] 로 읽고 'a'~'z' 면 sub al, 32 해서 mov [rbx + rcx], al. syscall 은 rcx · r11 을 바꿈. [arr + rcx*8] 은 ld 에선 되지만 PIE 에선 링크 에러라 lea 먼저.",
  terms: { "배열": "같은 크기의 값을 메모리에 빈틈없이 이어 둔 것. i 번 칸은 시작 주소 + i × 크기", "널 문자": "값이 0 인 바이트. 문자열의 끝 표시로 써서, 0 을 만날 때까지 세면 길이가 된다" },
  pages: [
    { title: "배열 dq 3, 1, 4 · [rbx + rcx*8]", html: `<p>파이썬 리스트 <code>[3, 1, 4, 1, 5]</code> 를 어셈블리로 만들면 <code>dq</code> 로 8바이트 값을 <b>빈틈없이 이어</b> 두는 거예요. 같은 크기의 칸이 줄지어 있는 이 모양이 [[배열]]이에요. 이름 <code>arr</code> 은 [[레슨:R7]] 에서처럼 <b>맨 앞 칸의 주소</b>예요.</p>\n<pre class="code">arr dq 3, 1, 4, 1, 5\n\n주소     arr+0   arr+8   arr+16  arr+24  arr+32\n값         3       1       4       1       5\n칸 번호    0       1       2       3       4</pre>\n<p>칸 번호 <code>i</code> 의 자리는 <b>시작 주소 + i × 8</b> 이에요. 이 계산을 대괄호 안에 그대로 써요.</p>\n<pre class="code">lea rbx, [arr]          ; rbx = 시작 주소\nmov rcx, 2              ; 2번 칸\nmov rax, [rbx + rcx*8]  ; 시작 + 16 바이트 자리 → rax = 4</pre>\n<table class="kb"><tbody><tr><td><code>[기준 + 번호*크기 + 수]</code></td><td>대괄호 안에서 CPU 가 주소를 계산해요. 기준 · 번호는 레지스터, 크기는 <b>1 · 2 · 4 · 8</b> 중 하나, 수는 고정된 숫자</td></tr><tr><td><code>[rbx + rcx*8]</code></td><td><code>dq</code>(8바이트) 배열의 rcx 번 칸</td></tr><tr><td><code>[rbx + 8]</code></td><td>1번 칸(번호가 정해져 있으면 숫자로)</td></tr><tr><td><code>[rbx + rcx]</code></td><td><code>db</code>(1바이트) 배열 — 문자열(3쪽)</td></tr></tbody></table>\n<p>칸 수는 nasm 이 세게 해요. <code>n equ ($ - arr) / 8</code> — [[레슨:R2]] 의 <code>$ - msg</code> 는 바이트 수라서 8 로 나누면 칸 수예요. 예제는 2번 칸(4)에 칸 수(5)를 더해 종료 코드로 보여 줘요. 실행하면 <code>9</code>.</p>\n<div class="bk-warn"><b>크기를 빼먹으면 엉뚱한 값</b> — <code>dq</code> 배열에서 <code>[rbx + rcx]</code> 라고 쓰면 1바이트씩만 옮겨 가서, 칸과 칸 사이의 바이트가 섞인 값을 읽어요. 에러도 안 나요. <code>dq</code> 면 <code>*8</code>, <code>dd</code> 면 <code>*4</code>.</div>\n<p class="muted small"><code>[arr + rcx*8]</code> 처럼 이름에 바로 번호를 붙여도 <code>ld</code> 로 만드는 이 교과서의 프로그램에서는 돌아가요. 다만 <code>default rel</code> 의 rip 기준 주소에는 번호 레지스터를 붙일 수 없어서, nasm 이 그 줄만 옛날식 절대 주소로 바꿔요. 그런 코드는 gcc 의 기본 빌드(PIE)에서 링크 에러가 나요. 그래서 이 교과서는 <code>lea</code> 로 시작 주소를 먼저 레지스터에 넣어요.</p>`,
      example: { code: `default rel\nsection .data\narr dq 3, 1, 4, 1, 5\nn   equ ($ - arr) / 8       ; 칸 수 = 바이트 수 ÷ 8 = 5\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [arr]          ; rbx = 배열이 시작하는 주소\n    mov rcx, 2              ; 2번 칸(0번부터 셈)\n    mov rdi, [rbx + rcx*8]  ; 시작 + 2×8 바이트 자리의 값 = 4\n    add rdi, n              ; 4 + 칸 수 5\n    mov rax, 60\n    syscall`, echoExit: true } },
    { title: "합과 최댓값: 칸을 하나씩 돌기", html: `<p>배열 전체를 다루려면 [[레슨:R6]] 의 반복으로 칸 번호 <code>rcx</code> 를 0, 1, 2 … 로 올려요. <b>합</b>은 칸 값을 하나씩 더하면 돼요. <code>add</code> 는 메모리의 값을 바로 더할 수 있어요.</p>\n<pre class="code">    lea rbx, [arr]\n    mov rdi, 0              ; 합\n    mov rcx, 0              ; 칸 번호\n.loop:\n    cmp rcx, n\n    jge .done               ; 칸 번호가 n 이 되면 끝\n    add rdi, [rbx + rcx*8]  ; 합 += arr[rcx]\n    inc rcx\n    jmp .loop\n.done:</pre>\n<p><b>최댓값</b>은 파이썬으로 이렇게 찾죠.</p>\n<pre class="code">best = arr[0]\nfor i in range(1, n):\n    if arr[i] &gt; best:\n        best = arr[i]</pre>\n<p>예제가 같은 모양이에요. <code>rdi</code> 가 <code>best</code>, <code>rcx</code> 가 <code>i</code> 예요. 「더 크지 않으면(<code>jle</code>) 바꾸는 줄을 건너뛴다」 로 if 를 만들어요([[레슨:R5]]). 실행하면 <code>41</code>.</p>\n<ul><li>처음 값은 <b>0 이 아니라 0번 칸</b>으로 둬요. 0 으로 시작하면 값이 전부 음수인 배열에서 답이 0 이 돼요</li><li>값에 음수가 있을 수 있으니 부호 있는 비교 <code>jle</code> · <code>jg</code> 를 써요(<code>jbe</code> · <code>ja</code> 는 부호 없음)</li></ul>`,
      example: { code: `default rel\nsection .data\narr dq 27, 8, 41, 15, 33\nn   equ ($ - arr) / 8\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [arr]\n    mov rdi, [rbx]          ; 지금까지 가장 큰 값 = 0번 칸\n    mov rcx, 1              ; 1번 칸부터 비교\n.loop:\n    cmp rcx, n\n    jge .done               ; 칸을 다 봤으면 끝\n    mov rax, [rbx + rcx*8]\n    cmp rax, rdi\n    jle .skip               ; 더 크지 않으면 건너뜀\n    mov rdi, rax            ; 더 크면 바꿔 둠\n.skip:\n    inc rcx\n    jmp .loop\n.done:\n    mov rax, 60             ; rdi = 가장 큰 값\n    syscall`, echoExit: true } },
    { title: "문자열 db \"…\", 0 · 0 바이트까지 세기", html: `<p>문자열은 <b>1바이트 칸의 배열</b>이에요. 영어 · 숫자 · 기호는 한 글자가 1바이트(아스키 번호)라서 칸 번호에 <code>*1</code> 이 붙고, 그래서 생략해 <code>[rbx + rcx]</code> 로 써요.</p>\n<pre class="code">msg db "Hello, asm!", 10, 0\n\n칸 번호   0   1    2    3    4   …   10  11  12\n글자      H   e    l    l    o   …   !   줄  끝\n바이트    72  101  108  108  111 …   33  10  0</pre>\n<p>길이를 아는 방법은 두 가지예요.</p>\n<table class="kb"><tbody><tr><td><code>len equ $ - msg</code></td><td>nasm 이 <b>빌드할 때</b> 세요([[레슨:R2]]). 코드에 적힌 글자에만 쓸 수 있어요</td></tr><tr><td>끝에 <code>0</code> 바이트</td><td>프로그램이 <b>실행 중에</b> 0 을 만날 때까지 세요. 입력처럼 밖에서 온 글자, C 의 문자열([[레슨:R13]] · [[레슨:R14]])이 이 방식이에요</td></tr></tbody></table>\n<p>끝 표시로 쓰는 값 0 의 바이트를 [[널 문자]]라고 해요. 세는 반복은 이래요. 대괄호만 있고 레지스터가 없어 크기를 모르니 <code>byte</code> 를 붙여요([[레슨:R7]]).</p>\n<pre class="code">    mov rcx, 0\n.count:\n    cmp byte [rbx + rcx], 0 ; 이 칸이 0 이면 끝\n    je .done\n    inc rcx\n    jmp .count\n.done:                      ; rcx = 길이(0 은 안 셈)</pre>\n<p>예제는 센 길이만큼 <code>write</code> 하고 그 길이를 종료 코드로 돌려줘요. 실행하면 <code>Hello, asm!</code> 다음 줄에 <code>12</code>(줄바꿈까지 12바이트).</p>\n<div class="bk-warn"><b><code>syscall</code> 은 <code>rcx</code> 와 <code>r11</code> 을 바꿔요</b> — 커널에 다녀오면서 두 레지스터를 덮어써요. 그래서 예제는 길이를 <code>syscall</code> 전에 <code>r12</code> 로 옮겨 둬요. 반복 중에 <code>syscall</code> 을 부르면 카운터도 <code>rcx</code> 말고 <code>rbx</code> · <code>r12</code> 같은 데 두세요.</div>`,
      example: { code: `default rel\nsection .data\nmsg db "Hello, asm!", 10, 0     ; 끝에 0 바이트 하나\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [msg]\n    mov rcx, 0              ; 글자 수\n.count:\n    cmp byte [rbx + rcx], 0 ; 0 바이트면 끝\n    je .done\n    inc rcx\n    jmp .count\n.done:\n    mov r12, rcx            ; 길이를 따로 둠(syscall 이 rcx 를 바꿔요)\n    mov rax, 1              ; write(1, msg, 길이)\n    mov rdi, 1\n    mov rsi, rbx\n    mov rdx, r12\n    syscall\n    mov rax, 60\n    mov rdi, r12            ; 종료 코드 = 길이\n    syscall`, echoExit: true } },
    { title: "한 글자씩 바꾸기: mov al · 'a' ~ 'z'", html: `<p>글자 하나는 1바이트라서 <code>rax</code> 의 맨 아래 1바이트 이름 <code>al</code>([[레슨:R1]])로 읽고 써요.</p>\n<pre class="code">mov al, [rbx + rcx]     ; 읽기 — al 이 1바이트라 크기를 알아요\nmov [rbx + rcx], al     ; 제자리에 쓰기</pre>\n<p>nasm 에서 <code>'a'</code> 는 그 글자의 번호(97)예요. 소문자는 <code>'a'</code>~<code>'z'</code> 사이에 있으니 「<code>'a'</code> 보다 작거나 <code>'z'</code> 보다 크면 건너뛴다」 로 골라요. 글자 번호는 부호가 없는 수라 <code>jb</code> · <code>ja</code> 를 써요.</p>\n<table class="kb"><tbody><tr><td><code>'A'</code> 65 ~ <code>'Z'</code> 90</td><td><code>'a'</code> 97 ~ <code>'z'</code> 122</td></tr><tr><td colspan="2">소문자 − 32 = 대문자. 32 는 <code>0x20</code>, 비트 하나라서 [[레슨:R4]] 의 <code>xor al, 0x20</code> 은 대 ↔ 소를 뒤집어요</td></tr></tbody></table>\n<p>예제는 0 바이트를 만날 때까지 한 글자씩 보고, 소문자만 <code>sub al, 32</code> 로 바꿔 제자리에 써요. 끝나면 <code>rcx</code> 가 곧 길이라서 그대로 <code>write</code> 해요. 실행하면 <code>HELLO, ASM 2026!</code>.</p>\n<ul><li><code>section .data</code> 의 글자는 실행 중에 바꿔 쓸 수 있어요. <code>section .text</code>(코드)는 못 써요 — 쓰면 Segmentation fault</li><li>한글은 UTF-8 로 한 글자가 3바이트이고 바이트 번호가 128 이상이라 <code>'z'</code> 보다 커서 그대로 남아요</li></ul>`,
      example: { code: `default rel\nsection .data\nmsg db "Hello, asm 2026!", 10, 0\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [msg]\n    mov rcx, 0\n.next:\n    mov al, [rbx + rcx]     ; 한 글자(1바이트) 읽기\n    cmp al, 0\n    je .print               ; 0 이면 끝\n    cmp al, 'a'\n    jb .keep                ; 'a' 보다 작으면 그대로\n    cmp al, 'z'\n    ja .keep                ; 'z' 보다 크면 그대로\n    sub al, 32              ; 소문자 → 대문자('a' 97 → 'A' 65)\n    mov [rbx + rcx], al     ; 바꾼 글자를 제자리에 쓰기\n.keep:\n    inc rcx\n    jmp .next\n.print:\n    mov rax, 1\n    mov rdi, 1\n    mov rsi, rbx\n    mov rdx, rcx            ; 센 길이만큼\n    syscall\n    mov rax, 60\n    mov rdi, 0\n    syscall` } },
  ],
  summary: ["배열은 같은 크기 칸을 이어 둔 것 — lea rbx, [arr] 하고 i 번 칸은 [rbx + rcx*8](dq) · [rbx + rcx](db)", "합 · 최댓값은 rcx 로 칸을 하나씩 돌며 add · cmp(최댓값은 0번 칸에서 시작)", "문자열은 바이트 배열 — 0 바이트까지 세면 길이, mov al 로 읽어 바꾸고 제자리에 쓰기"] },
{ id: 'R9', ch: 2, n: 9, title: '입력 받기: read 시스템 콜', mode: 'text',
  tutorSummary: "read: rax=0, rdi=0(표준 입력), rsi=버퍼(section .bss 의 buf resb 64, lea rsi, [buf]), rdx=최대 바이트 → rax 에 받은 수(줄바꿈 포함, 0 이면 입력 끝 Ctrl+D). echo 는 mov rdx, rax 를 mov rax, 1 보다 먼저. 끝 줄바꿈 빼기 cmp byte [rbx + rax - 1], 10. 글자 → 정수: movzx rdx, byte [rbx + rcx], '0'~'9' 사이인지 jb/ja, sub rdx, '0', imul rax, 10, add rax, rdx. 정수 → 글자: sub rsp, 32 버퍼, 끝에 줄바꿈, xor edx, edx · div rcx(10) 의 나머지 + '0' 을 dec rsi 하며 뒤에서부터, test rax, rax · jnz. 음수는 test/jns · neg 하고 끝에 '-'. 이 덩어리(rdi 입력, rax rcx rdx rsi rdi r8 r11 바뀜)가 레슨 11 에서 print_int 함수가 됨.",
  terms: { "버퍼": "읽거나 쓸 바이트를 잠깐 담아 두는 메모리 칸. read 는 받은 글자를 여기에 넣는다", "표준 입력": "번호 0 의 입력 통로(stdin). 보통 키보드, 파이프나 < 로 바꿀 수 있다" },
  pages: [
    { title: "read 시스템 콜 · 버퍼 resb 64", html: `<p>[[레슨:R2]] 의 <code>write</code> 가 「여기 있는 바이트를 1번(화면)에 써 줘」 였다면, <code>read</code> 는 반대로 「0번에서 바이트를 받아 여기에 담아 줘」 예요. 0번은 [[표준 입력]], 보통 키보드예요(<a href="../os/#lesson/K15" target="_blank" rel="noopener">운영체제 교과서 「파일 디스크립터와 버퍼」 ↗</a>).</p>\n<table class="kb"><tbody><tr><td><code>rax</code></td><td><b>0</b> — read 의 번호(write 는 1, exit 은 60)</td></tr><tr><td><code>rdi</code></td><td><b>0</b> — 어디서 받나(표준 입력)</td></tr><tr><td><code>rsi</code></td><td>받은 바이트를 담을 [[버퍼]]의 주소 — <code>lea rsi, [buf]</code></td></tr><tr><td><code>rdx</code></td><td>최대 몇 바이트까지 — 버퍼 크기</td></tr><tr><td>돌아오면 <code>rax</code></td><td>실제로 받은 바이트 수. <b>0</b> 이면 입력 끝(<kbd>Ctrl</kbd>+<kbd>D</kbd>), 음수면 에러</td></tr></tbody></table>\n<p>버퍼는 처음 값이 필요 없으니 [[레슨:R7]] 의 <code>section .bss</code> 에 <code>buf resb 64</code> 로 만들어요. 파이썬의 <code>os.read(0, 64)</code> 와 같은 부탁이에요.</p>\n<p>실행하면 프로그램이 <b>멈춰서 기다려요</b>. 터미널에 <code>hello</code> 를 치고 <kbd>Enter</kbd> 를 누르면 그때 read 가 돌아와요. 받은 바이트는 <b>줄바꿈까지</b> 6개라서, 예제의 입력으로 실행하면 종료 코드가 <code>6</code> 이에요. 매번 치기 싫으면 <code>echo hello | ./read1; echo $?</code> 처럼 파이프로 넣어도 돼요.</p>\n<p>끝의 줄바꿈을 빼고 싶으면 마지막 바이트(받은 수 − 1 번 칸)가 10 인지 보고 길이에서 1 을 빼요.</p>\n<pre class="code">    lea rbx, [buf]\n    cmp byte [rbx + rax - 1], 10    ; 마지막 글자가 줄바꿈?\n    jne .keep\n    dec rax                         ; 그러면 하나 덜 셈\n.keep:</pre>\n<div class="bk-warn"><b>버퍼보다 길게 치면</b> — 64바이트까지만 받고, 남은 글자는 터미널에 그대로 남아 있다가 프로그램이 끝난 뒤 <b>bash 가 명령으로 읽어요</b>(「command not found」 가 뜨기도 해요). 버퍼를 넉넉히 잡거나, 다음 쪽처럼 끝까지 반복해서 받아요.</div>`,
      example: { code: `default rel\nsection .bss\nbuf resb 64                 ; 받은 글자를 담을 64바이트\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read 는 0번\n    mov rdi, 0              ; 0 = 표준 입력(키보드)\n    lea rsi, [buf]          ; 여기에 담아 줘\n    mov rdx, 64             ; 최대 64바이트까지\n    syscall                 ; 돌아오면 rax = 실제로 받은 바이트 수\n    mov rdi, rax\n    mov rax, 60             ; 받은 바이트 수를 종료 코드로\n    syscall`, stdin: "hello\n", echoExit: true } },
    { title: "받은 그대로 찍기: read → write", html: `<p>받은 바이트를 그대로 <code>write</code> 하면 들어온 것을 되돌려 찍는 프로그램이 돼요. 이때 순서가 중요해요. read 가 돌려준 길이는 <code>rax</code> 에 있는데, write 를 부르려면 <code>rax</code> 에 1 을 넣어야 하니까요.</p>\n<pre class="code">    mov rdx, rax            ; ① 받은 길이를 먼저 옮기고\n    mov rax, 1              ; ② 그다음에 write 번호</pre>\n<p>순서를 바꾸면 <code>rdx</code> 에 1 이 들어가 한 글자만 찍혀요. 레지스터는 덮어쓰면 그만이라 「아직 쓸 값이 들어 있나」 를 늘 따져요.</p>\n<p>예제는 read 가 0(입력 끝)을 돌려줄 때까지 반복해요. 리눅스의 <code>cat</code> 이 하는 일이에요.</p>\n<ul><li>터미널에서는 한 줄 칠 때마다(<kbd>Enter</kbd>) read 가 한 번 돌아와 그 줄을 찍어요. 끝내려면 빈 줄에서 <kbd>Ctrl</kbd>+<kbd>D</kbd></li><li><code>./echo1 &lt; memo.txt</code> 처럼 파일을 넣으면 64바이트씩 나눠 받아 전부 찍어요</li><li>바이트를 그대로 옮기기만 하니 한글도 그대로 나와요</li></ul>\n<p>예제의 두 줄 입력으로 실행하면 <code>첫 줄</code> 과 <code>second line</code> 이 그대로 나와요.</p>`,
      example: { code: `default rel\nsection .bss\nbuf resb 64\n\nsection .text\nglobal _start\n_start:\n.again:\n    mov rax, 0              ; read(0, buf, 64)\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n    cmp rax, 0\n    jle .end                ; 0 = 입력 끝(Ctrl+D), 음수 = 에러\n    mov rdx, rax            ; 받은 만큼만 — rax 를 바꾸기 전에 옮겨 둬요\n    mov rax, 1              ; write(1, buf, 받은 수)\n    mov rdi, 1\n    lea rsi, [buf]\n    syscall\n    jmp .again              ; 다음 줄 받으러\n.end:\n    mov rax, 60\n    mov rdi, 0\n    syscall`, stdin: "첫 줄\nsecond line\n" } },
    { title: "글자 → 정수: - '0' 하고 × 10", html: `<p>키보드로 <code>472</code> 를 치면 read 가 받는 건 수 472 가 아니라 글자 세 개 <code>'4'</code> <code>'7'</code> <code>'2'</code>, 바이트로 52 · 55 · 50 이에요. 숫자 글자의 번호는 <code>'0'</code>(48)부터 차례라서 <b>글자 − <code>'0'</code></b> 이 그 자리의 숫자예요.</p>\n<p>파이썬으로는 이렇게 만들죠.</p>\n<pre class="code">n = 0\nfor c in "472":\n    n = n * 10 + (ord(c) - ord("0"))</pre>\n<table class="kb"><tbody><tr><td>처음</td><td>n = 0</td></tr><tr><td><code>'4'</code></td><td>0 × 10 + 4 = 4</td></tr><tr><td><code>'7'</code></td><td>4 × 10 + 7 = 47</td></tr><tr><td><code>'2'</code></td><td>47 × 10 + 2 = 472</td></tr><tr><td>줄바꿈(10)</td><td>숫자 글자가 아니니 끝</td></tr></tbody></table>\n<p>어셈블리로는 새 명령 하나가 필요해요. <code>movzx rdx, byte [rbx + rcx]</code> 는 <b>1바이트를 읽어 64비트 레지스터에 넣고 위는 0 으로 채워요</b>. <code>mov rdx, [rbx + rcx]</code> 는 8바이트를 읽어 버리고, <code>mov dl, …</code> 는 위쪽에 남은 값이 그대로라서 더하기에 못 써요.</p>\n<pre class="code">    movzx rdx, byte [rbx + rcx] ; 글자 1바이트 → rdx\n    cmp rdx, '0'\n    jb .done                ; '0' 보다 작거나\n    cmp rdx, '9'\n    ja .done                ; '9' 보다 크면 숫자가 아님 → 끝\n    sub rdx, '0'            ; 글자 → 숫자\n    imul rax, 10            ; 지금까지 × 10\n    add rax, rdx            ; + 이번 자리</pre>\n<p>예제는 받은 수를 두 배 해서 종료 코드로 보여 줘요. 입력 <code>123</code> 으로 실행하면 <code>246</code>. 종료 코드는 255 까지라 더 큰 수는 못 봐요 — 그래서 다음 쪽에서 수를 글자로 찍어요.</p>`,
      example: { code: `default rel\nsection .bss\nbuf resb 64\n\nsection .text\nglobal _start\n_start:\n    mov rax, 0              ; read(0, buf, 64)\n    mov rdi, 0\n    lea rsi, [buf]\n    mov rdx, 64\n    syscall\n\n    lea rbx, [buf]\n    mov rax, 0              ; 지금까지 만든 수\n    mov rcx, 0              ; 몇 번째 글자\n.digit:\n    movzx rdx, byte [rbx + rcx] ; 글자 1바이트 → rdx(위는 0 으로)\n    cmp rdx, '0'\n    jb .done                ; 숫자 글자가 아니면 끝\n    cmp rdx, '9'\n    ja .done\n    sub rdx, '0'            ; '7'(55) - '0'(48) = 7\n    imul rax, 10            ; 지금까지 × 10\n    add rax, rdx            ; + 이번 자리\n    inc rcx\n    jmp .digit\n.done:\n    mov rdi, rax\n    add rdi, rdi            ; 두 배로 해서\n    mov rax, 60             ; 종료 코드로 보기\n    syscall`, stdin: "123\n", echoExit: true } },
    { title: "정수 → 글자: div 10 · 뒤에서부터 채우기", html: `<p>이번엔 반대로 수 472 를 글자 <code>"472"</code> 로 바꿔요. 10 으로 나눈 <b>나머지</b>가 맨 끝 자리예요.</p>\n<table class="kb"><tbody><tr><td>472 ÷ 10</td><td>몫 47, 나머지 <b>2</b></td></tr><tr><td>47 ÷ 10</td><td>몫 4, 나머지 <b>7</b></td></tr><tr><td>4 ÷ 10</td><td>몫 0, 나머지 <b>4</b> → 몫이 0 이니 끝</td></tr></tbody></table>\n<p>자리가 <b>끝에서부터</b> 나오니까, 버퍼도 <b>뒤에서부터 앞으로</b> 채워요. 맨 끝엔 줄바꿈을 미리 넣어 둬요.</p>\n<pre class="code">버퍼 32바이트                           rsp+31\n[ … 빈칸 … ][ '4' ][ '7' ][ '2' ][ 줄바꿈 ]\n              ↑ 다 채운 뒤의 rsi\nwrite(1, rsi, 글자 수 4)</pre>\n<p>새로 쓰는 명령이에요.</p>\n<table class="kb"><tbody><tr><td><code>xor edx, edx</code><br><code>div rcx</code></td><td>[[레슨:R3]] 의 <code>idiv</code> 의 부호 없는 짝. <code>rdx:rax</code> 를 <code>rcx</code>(10)로 나눠 몫은 <code>rax</code>, 나머지는 <code>rdx</code>. 나누기 전에 <code>rdx</code> 를 0 으로(<code>edx</code> 에 쓰면 위 32비트도 0 — [[레슨:R1]])</td></tr><tr><td><code>add dl, '0'</code></td><td>나머지(0~9)에 48 을 더해 글자로. <code>dl</code> 은 <code>rdx</code> 의 맨 아래 1바이트</td></tr><tr><td><code>dec rsi</code><br><code>mov [rsi], dl</code></td><td>한 칸 앞으로 가서 글자 쓰기</td></tr><tr><td><code>test rax, rax</code></td><td><code>and</code> 해 보고 결과는 버리고 <b>플래그만</b>(<code>cmp</code> 의 and 판). 자기 자신과 하면 「0 인가 · 음수인가」 를 봐요. 이어서 <code>jnz</code> 는 「0 이 아니면」</td></tr><tr><td><code>sub rsp, 32</code><br><code>add rsp, 32</code></td><td>버퍼 자리 빌리기 · 돌려주기. <code>rsp</code> 는 스택이라는 메모리의 꼭대기 주소예요([[레슨:R10]] 에서 자세히). 지금은 「32바이트 빈 버퍼가 생기고, 끝나면 돌려준다」 로 충분해요</td></tr></tbody></table>\n<p>나누기를 <b>먼저 하고 나서</b> 몫을 검사해서, 0 도 <code>"0"</code> 한 글자로 찍혀요. 예제는 472 를 찍어요. 실행하면 <code>472</code> — 이제 255 보다 큰 수도 보여요.</p>`,
      example: { code: `section .text\nglobal _start\n_start:\n    mov rdi, 472            ; 출력할 수\n    sub rsp, 32             ; 글자 버퍼 32바이트(스택)\n    mov rax, rdi\n    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움\n    mov byte [rsi], 10      ; 맨 끝은 줄바꿈\n    mov r8, 1               ; 지금까지 글자 수\n    mov rcx, 10\n.digits:\n    xor edx, edx\n    div rcx                 ; rax = 몫, rdx = 나머지(0~9)\n    add dl, '0'\n    dec rsi\n    mov [rsi], dl\n    inc r8\n    test rax, rax\n    jnz .digits             ; 몫이 0 이 될 때까지\n    mov rax, 1              ; write(1, rsi, r8)\n    mov rdx, r8\n    mov rdi, 1\n    syscall\n    add rsp, 32             ; 빌린 32바이트 돌려주기\n    mov rax, 60\n    mov rdi, 0\n    syscall` } },
    { title: "test · neg 로 음수까지: 숫자 출력 완성", html: `<p>음수는 부호를 떼고 찍은 뒤 앞에 <code>-</code> 를 붙여요. 앞 쪽 코드에 두 군데만 더해요.</p>\n<ol><li>나누기 전에: <code>test rax, rax</code> → <code>jns</code>(부호 플래그가 꺼져 있으면, 곧 0 이상이면 건너뜀) → 음수면 <code>neg rax</code> 로 양수로</li><li>자리를 다 채운 뒤: 원래 수는 아직 <code>rdi</code> 에 있으니 <code>test rdi, rdi</code> 로 다시 보고, 음수였으면 한 칸 더 앞에 <code>'-'</code></li></ol>\n<p>이렇게 완성한 덩어리가 이 교과서의 <b>숫자 출력 코드</b>예요. 숫자를 <code>rdi</code> 에 넣고 이 덩어리를 지나가면 10진 글자 + 줄바꿈이 찍혀요. 앞으로 숫자를 찍을 땐 예제의 「숫자 출력」 부터 「여기까지」 를 그대로 복사해 써요.</p>\n<table class="kb"><tbody><tr><td>넣는 것</td><td><code>rdi</code> = 찍을 수(음수도 돼요)</td></tr><tr><td>바뀌는 레지스터</td><td><code>rax rcx rdx rsi rdi r8 r11</code>(<code>r11</code> 은 <code>syscall</code> 이 바꿔요)</td></tr><tr><td>안 바뀌는 레지스터</td><td><code>rbx rbp r12 r13 r14 r15</code> — 반복 카운터 · 배열 주소는 여기에</td></tr></tbody></table>\n<p>예제는 배열의 세 수를 반복하며 찍어요. 칸 번호를 <code>rcx</code> 가 아니라 <code>r12</code> 에 둔 게 그 때문이에요. 실행하면 <code>0</code>, <code>1234567</code>, <code>-42</code> 가 한 줄씩 나와요.</p>\n<div class="bk-warn"><b>한 프로그램에 한 번만 붙여요</b> — 덩어리 안의 <code>.digits</code> · <code>.write</code> 라벨이 두 번 나오면 nasm 이 「redefined」 에러를 내요. 여러 수를 찍을 땐 예제처럼 반복 안에 하나만 두고 <code>rdi</code> 만 바꿔요.</div>\n<p>같은 코드를 이곳저곳에서 쓰고 싶어지죠. [[레슨:R11]] 에서는 이 덩어리 앞에 이름 <code>print_int:</code> 를, 끝에 <code>ret</code> 를 붙여 <b>함수</b>로 만들고 <code>call print_int</code> 로 어디서든 불러요. 덩어리 속 코드는 한 글자도 안 바뀌어요.</p>`,
      example: { code: `default rel\nsection .data\nnums dq 0, 1234567, -42\n\nsection .text\nglobal _start\n_start:\n    lea rbx, [nums]         ; rbx · r12 는 아래 덩어리가 안 건드려요\n    mov r12, 0              ; 몇 번째 칸\n.next:\n    mov rdi, [rbx + r12*8]  ; 출력할 수를 rdi 에\n    ; ---- 숫자 출력: rdi 를 10진 글자 + 줄바꿈으로 (레슨 11 에서 함수 print_int 가 돼요) ----\n    sub rsp, 32             ; 글자 버퍼 32바이트(스택)\n    mov rax, rdi\n    lea rsi, [rsp + 31]     ; 버퍼 끝에서부터 거꾸로 채움\n    mov byte [rsi], 10      ; 맨 끝은 줄바꿈\n    mov r8, 1               ; 지금까지 글자 수\n    mov rcx, 10\n    test rax, rax\n    jns .digits\n    neg rax                 ; 음수면 양수로 바꿔 두고 나중에 '-'\n.digits:\n    xor edx, edx\n    div rcx                 ; rax = 몫, rdx = 나머지(0~9)\n    add dl, '0'\n    dec rsi\n    mov [rsi], dl\n    inc r8\n    test rax, rax\n    jnz .digits\n    test rdi, rdi\n    jns .write\n    dec rsi\n    mov byte [rsi], '-'\n    inc r8\n.write:\n    mov rax, 1              ; write(1, rsi, r8)\n    mov rdx, r8\n    mov rdi, 1\n    syscall\n    add rsp, 32\n    ; ---- 여기까지 (rax rcx rdx rsi rdi r8 r11 이 바뀜) ----\n    inc r12\n    cmp r12, 3\n    jl .next\n    mov rax, 60\n    mov rdi, 0\n    syscall` } },
  ],
  summary: ["read 는 rax=0 · rdi=0 · rsi=버퍼 · rdx=최대 — 받은 바이트 수(줄바꿈 포함)가 rax, 0 이면 입력 끝", "글자 → 정수: movzx 로 한 바이트, - '0', 지금까지 × 10 + 이번 자리", "정수 → 글자: div 10 의 나머지 + '0' 을 버퍼 뒤에서부터, 음수는 neg 하고 '-' — 이 덩어리가 레슨 11 의 print_int"] },
{ id: 'RB2', ch: 2, boss: true, title: '만들어 보기: 숫자를 출력하는 프로그램', mode: 'text',
  tutorSummary: "챕터 2 묶기 — 레슨 9 의 숫자 출력 덩어리(rdi → 10진 글자 + 줄바꿈, rax rcx rdx rsi rdi r8 r11 바뀜)를 반복 안에 두고 rbx · r12 · r13 으로 배열을 돌며 누적 합 찍기, read 한 줄을 다른 버퍼에 거꾸로 복사해 출력(줄바꿈 제외, 영어·숫자만), '-' 가 붙을 수 있는 두 정수를 읽어 합 · 차 · 곱을 resq 3 에 저장하고 한 줄씩 출력. 이 덩어리가 레슨 11 의 print_int 함수가 됨.", pages: [], summary: [] },
{ id: 'R10', ch: 3, n: 10, title: '스택: push · pop · rsp', mode: 'text',
  tutorSummary: '스택은 프로그램마다 있는 메모리 한 덩어리, 높은 주소에서 낮은 주소로(아래로) 자라고 rsp 가 꼭대기 주소. push rax = sub rsp, 8 + mov [rsp], rax · pop rbx = mov rbx, [rsp] + add rsp, 8 — 늘 8바이트, 나중에 넣은 것이 먼저 나옴. syscall 은 rcx · r11 을 바꾸니 반복 횟수는 push rcx / pop rcx 로 맡김. 글자를 차례로 push 했다가 pop 하면 거꾸로. push 한 만큼 pop.',
  terms: { '스택': '프로그램마다 있는 메모리 한 덩어리. 높은 주소에서 낮은 주소 쪽으로(아래로) 쌓이고 rsp 가 꼭대기 주소를 가리킨다. 나중에 넣은 것이 먼저 나온다' },
  pages: [
    { title: '스택과 rsp: 아래로 자라는 메모리', html: `<p>지금까지 값은 레지스터나 <code>section .data</code> · <code>.bss</code> 의 이름 붙은 칸에 뒀어요. 프로그램에는 이름 없이 <b>잠깐 쓰는 메모리</b>도 있어요. 바로 [[스택]]이에요. 리눅스는 프로그램을 시작할 때 스택 자리를 마련하고, <code>rsp</code> 레지스터에 그 <b>꼭대기 주소</b>를 넣어 줘요(메모리 지도는 <a href="../os/#lesson/K10" target="_blank" rel="noopener">운영체제 교과서 「가상 메모리」 ↗</a>).</p>
<pre>높은 주소
  ┌────────┐
  │   10   │  첫 번째 push
  ├────────┤
  │   20   │
  ├────────┤
  │   30   │  ← rsp (꼭대기 = 마지막 push)
  └────────┘
낮은 주소   ↓ 쌓을수록 주소가 작아져요</pre>
<p>스택은 접시 더미처럼 <b>꼭대기에서만</b> 넣고 빼요. 특이한 점은 <b>아래로 자란다</b>는 것이에요. 하나 쌓을 때마다 <code>rsp</code> 가 8 씩 <b>작아져요</b>.</p>
<p>예제는 처음 <code>rsp</code> 를 <code>rbx</code> 에 적어 두고, 값 세 개를 쌓은 뒤 「처음 − 지금」 을 종료 코드로 내요. 실행하면 <code>24</code> — 8바이트씩 세 번 내려갔어요.</p>
<p class="muted small">주소 자체는 실행할 때마다 달라요(리눅스가 보안을 위해 섞어요). 그래서 주소 대신 차이를 봐요.</p>`,
      example: { code: `section .text
global _start
_start:
    mov rbx, rsp            ; 지금 꼭대기 주소를 rbx 에 적어 둠
    push 10
    push 20
    push 30                 ; 세 번 push → 8바이트 × 3 만큼 아래로
    mov rdi, rbx
    sub rdi, rsp            ; 처음 꼭대기 - 지금 꼭대기 = 내려간 바이트 수
    mov rax, 60
    syscall`, echoExit: true } },
    { title: 'push rax · pop rbx', html: `<p><code>push</code> 는 꼭대기에 하나 쌓고, <code>pop</code> 은 꼭대기에서 하나 꺼내요. 한 번에 늘 <b>8바이트</b>(64비트 레지스터 하나)예요.</p>
<table class="kb"><tbody><tr><td><code>push rax</code></td><td><code>sub rsp, 8</code> 하고 <code>mov [rsp], rax</code> — 8 내려가서 그 자리에 저장</td></tr><tr><td><code>pop rbx</code></td><td><code>mov rbx, [rsp]</code> 하고 <code>add rsp, 8</code> — 꼭대기 값을 꺼내고 8 올라감</td></tr><tr><td><code>push 10</code></td><td>숫자도 바로 쌓을 수 있어요(8바이트로)</td></tr><tr><td><code>mov rax, [rsp + 8]</code></td><td>꺼내지 않고 읽기만 — 꼭대기 바로 위 칸(하나 먼저 넣은 값)</td></tr></tbody></table>
<p><b>나중에 넣은 것이 먼저 나와요.</b> 예제는 5 → 7 순서로 넣고 두 번 꺼내요.</p>
<pre>push (5)       push (7)       pop rbx        pop rcx
│ 5 │ ← rsp    │ 5 │          │ 5 │ ← rsp    (처음 그대로)
               │ 7 │ ← rsp    rbx = 7        rcx = 5</pre>
<p>실행하면 <code>75</code> — 십의 자리가 먼저 꺼낸 7, 일의 자리가 나중에 꺼낸 5 예요.</p>
<ul><li><code>push eax</code> 처럼 32비트 이름은 안 돼요. <code>nasm</code> 이 <code>error: instruction not supported in 64-bit mode</code> 라고 해요</li><li>꺼낸 칸의 값은 지워지지 않고 그냥 「빈 자리」 로 쳐요. 다음 <code>push</code> 가 덮어써요</li></ul>
<div class="bk-warn"><b>push 한 만큼 pop</b> — 넣고 안 꺼내면 <code>rsp</code> 가 제자리로 안 돌아와요. 다음 레슨의 함수에서는 이게 바로 <code>Segmentation fault</code> 로 이어져요.</div>`,
      example: { code: `section .text
global _start
_start:
    mov rax, 5
    push rax                ; 꼭대기에 5
    mov rax, 7
    push rax                ; 꼭대기에 7 (5 는 그 아래)
    pop rbx                 ; rbx = 7 — 나중에 넣은 것이 먼저
    pop rcx                 ; rcx = 5
    mov rdi, rbx
    mov rdx, 10
    imul rdi, rdx           ; rdi = 7 × 10
    add rdi, rcx            ; rdi = 70 + 5
    mov rax, 60
    syscall`, echoExit: true } },
    { title: '값 맡기기: syscall 앞 push rcx', html: `<p>레지스터는 16개뿐이라 금방 모자라요. 레지스터를 잠깐 다른 일에 써야 할 때, 원래 값을 스택에 <b>맡겼다가</b> 되찾아요.</p>
<p>진짜로 자주 만나는 경우가 있어요. <code>syscall</code> 은 일을 마치고 돌아올 때 <b><code>rcx</code> 와 <code>r11</code> 을 바꿔 놔요</b>. CPU 가 돌아올 자리를 거기에 적어 두거든요. 그래서 반복 횟수를 <code>rcx</code> 에 두고 반복 안에서 <code>syscall</code> 을 부르면 횟수가 엉망이 돼요.</p>
<pre>again:
    push rcx        ; 맡기고
    ...             ; rcx 가 바뀌는 일(syscall)
    pop rcx         ; 되찾기
    dec rcx
    jnz again</pre>
<p>실행하면 「안녕!」 이 세 줄 나와요. <code>push rcx</code> · <code>pop rcx</code> 두 줄을 지우고 다시 빌드하면 끝나지 않고 계속 찍어요. <kbd>Ctrl</kbd>+<kbd>C</kbd> 로 멈추면 돼요([[레슨:R6]]).</p>
<p class="muted small">맡길 때와 되찾을 때 레지스터가 달라도 돼요. <code>push rcx</code> 하고 <code>pop rdx</code> 하면 rcx 의 값이 rdx 로 가요.</p>`,
      example: { code: `default rel
section .data
msg db "안녕!", 10
len equ $ - msg
section .text
global _start
_start:
    mov rcx, 3              ; 세 번 반복
again:
    push rcx                ; syscall 이 rcx 를 바꾸니 스택에 맡김
    mov rax, 1              ; write(1, msg, len)
    mov rdi, 1
    lea rsi, [msg]
    mov rdx, len
    syscall
    pop rcx                 ; 맡긴 값 되찾기
    dec rcx
    jnz again
    mov rax, 60
    mov rdi, 0
    syscall` } },
    { title: '뒤집기: 쌓았다가 거꾸로 꺼내기', html: `<p>나중에 넣은 것이 먼저 나오니까, 글자를 앞에서부터 하나씩 <code>push</code> 하고 다시 <code>pop</code> 하면 <b>거꾸로</b> 나와요. 파이썬의 <code>s[::-1]</code> 을 손으로 만드는 셈이에요.</p>
<ol><li>앞에서부터: <code>al</code> 에 글자 하나 → <code>push rax</code>. 글자 하나도 8바이트 칸 하나를 써요</li><li>다시 앞에서부터 <code>buf</code> 칸에: <code>pop rax</code> → <code>mov [rdi + rcx], al</code></li><li>끝에 줄바꿈(10)을 붙여 <code>write</code></li></ol>
<pre>"stack" 을 push 한 뒤      pop 하는 순서
│ s │                      k → c → a → t → s
│ t │
│ a │
│ c │
│ k │ ← rsp</pre>
<p>실행하면 <code>kcats</code>. 넣은 횟수(5)와 꺼낸 횟수(5)가 같아서 <code>rsp</code> 도 제자리로 돌아와요.</p>
<p class="muted small">한글은 한 글자가 3바이트라 바이트 단위로 뒤집으면 깨져요. 이 레슨의 뒤집기는 영어 · 숫자로 해요.</p>`,
      example: { code: `default rel
section .data
msg db "stack"
len equ $ - msg
section .bss
buf resb 16
section .text
global _start
_start:
    lea rsi, [msg]
    xor ecx, ecx            ; rcx = 0 (몇 번째 글자)
push_loop:
    xor eax, eax
    mov al, [rsi + rcx]     ; 글자 하나를 al 에
    push rax                ; 스택에 쌓기
    inc rcx
    cmp rcx, len
    jl push_loop
    lea rdi, [buf]
    xor ecx, ecx
pop_loop:
    pop rax                 ; 나중에 쌓은 글자부터 나옴
    mov [rdi + rcx], al
    inc rcx
    cmp rcx, len
    jl pop_loop
    mov byte [rdi + rcx], 10    ; 끝에 줄바꿈
    mov rax, 1              ; write(1, buf, len + 1)
    mov rsi, rdi
    mov rdi, 1
    mov rdx, len + 1
    syscall
    mov rax, 60
    mov rdi, 0
    syscall` } },
  ],
  summary: ['rsp 가 꼭대기, 쌓을수록 주소가 작아짐(아래로 자람)', 'push 는 sub rsp, 8 + 저장 · pop 은 꺼내고 add rsp, 8', '나중에 넣은 것이 먼저 — 맡기기 · 뒤집기, push 한 만큼 pop'] },
{ id: 'R11', ch: 3, n: 11, title: '함수: call 과 ret', mode: 'text',
  tutorSummary: 'call f = 돌아올 주소(다음 명령)를 push 하고 f 로 점프, ret = 꼭대기 주소를 pop 해서 점프. 함수 = ret 으로 끝나는 라벨, _start 의 exit 아래에 둠. 인자는 rdi(둘째 rsi), 결과는 rax. 레슨 9 의 숫자 출력 코드에 print_int: 라벨과 ret → call print_int(rax rcx rdx rsi rdi r8 r11 을 바꿈). 부른 쪽 rcx 가 망가지면 push rcx / pop rcx, 함수 안 push/pop 짝이 안 맞으면 ret 이 엉뚱한 곳으로 → Segmentation fault. 재귀 팩토리얼은 push rdi · call fact · pop rdi · imul.',
  terms: { '돌아올 주소': 'call 바로 다음 명령의 주소. call 이 스택에 넣고, ret 이 꺼내서 그리로 점프한다', '재귀': '함수가 자기 자신을 부르는 것. 부를 때마다 돌아올 주소가 스택에 하나씩 쌓인다' },
  pages: [
    { title: 'call 과 ret: 갔다가 돌아오기', html: `<p>파이썬의 함수처럼, 같은 코드를 여러 곳에서 불러 쓰고 싶어요. 라벨로 <code>jmp</code> 하면 갈 수는 있지만 <b>어디로 돌아와야 할지</b> 몰라요. 그래서 명령 두 개가 짝으로 있어요.</p>
<table class="kb"><tbody><tr><td><code>call say_hi</code></td><td>다음 명령의 주소([[돌아올 주소]])를 <code>push</code> 하고 <code>say_hi</code> 로 점프</td></tr><tr><td><code>ret</code></td><td>꼭대기에서 주소를 <code>pop</code> 해서 그리로 점프</td></tr></tbody></table>
<pre>call say_hi 하는 순간            ret 하는 순간
  │ 돌아올 주소 │ ← rsp           그 주소를 꺼내서 점프
  다음은 say_hi 의 첫 줄           다음은 call 바로 아랫줄</pre>
<p>예제는 <code>say_hi</code> 를 두 번 불러요. 두 번 다 「부른 곳 바로 다음 줄」 로 돌아와서 인사가 두 줄 나와요.</p>
<ul><li>어셈블리에서 함수는 따로 있는 게 아니라 <b><code>ret</code> 으로 끝나는 라벨</b>이에요</li><li>함수는 <code>_start</code> 의 마지막 <code>syscall</code>(exit) <b>아래</b>에 둬요. exit 이 없으면 <code>_start</code> 가 그대로 흘러 내려가 함수 몸통으로 들어가 버려요</li></ul>`,
      example: { code: `default rel
section .data
hi db "안녕하세요", 10
hi_len equ $ - hi
section .text
global _start
_start:
    call say_hi             ; say_hi 로 갔다가 바로 다음 줄로 돌아옴
    call say_hi             ; 한 번 더
    mov rax, 60
    mov rdi, 0
    syscall
say_hi:
    mov rax, 1              ; write(1, hi, hi_len)
    mov rdi, 1
    lea rsi, [hi]
    mov rdx, hi_len
    syscall
    ret                     ; 스택 꼭대기의 돌아올 주소로` } },
    { title: '인자는 rdi, 결과는 rax', html: `<p>함수에 값을 넘기고(인자) 받아 오는(결과) 방법도 약속이 있어요. 첫 인자는 <code>rdi</code>, 둘째는 <code>rsi</code> 에 넣고 부르면, 함수는 결과를 <code>rax</code> 에 넣고 <code>ret</code> 해요. 전체 순서는 [[레슨:R12]] 에서 봐요.</p>
<table class="kb"><tbody><tr><td>파이썬</td><td><code>result = square(12)</code></td></tr><tr><td>어셈블리</td><td><code>mov rdi, 12</code> → <code>call square</code> → 결과는 <code>rax</code></td></tr></tbody></table>
<pre>square:                 ; rax = rdi × rdi
    mov rax, rdi
    imul rax, rdi
    ret</pre>
<p>함수 위에 「무엇을 받아 무엇을 돌려주나」 를 주석 한 줄로 적어 두면 부를 때 헷갈리지 않아요. 예제는 결과를 종료 코드로 보여 줘요. 실행하면 <code>144</code>.</p>`,
      example: { code: `section .text
global _start
_start:
    mov rdi, 12             ; 인자: rdi = 12
    call square             ; 결과: rax = 144
    mov rdi, rax
    mov rax, 60
    syscall
square:                     ; rax = rdi × rdi
    mov rax, rdi
    imul rax, rdi
    ret`, echoExit: true } },
    { title: 'print_int 를 함수로', html: `<p>[[레슨:R9]] 에서 정수를 10진 글자로 바꿔 찍는 코드를 만들었죠. 그 코드 앞에 라벨 <code>print_int:</code>, 끝에 <code>ret</code> — 이제 <code>call print_int</code> 한 줄로 어디서든 숫자를 찍어요.</p>
<table class="kb"><tbody><tr><td>받는 것</td><td><code>rdi</code> = 찍을 정수(음수도 돼요)</td></tr><tr><td>하는 일</td><td>10진 글자 + 줄바꿈을 <code>write</code></td></tr><tr><td>바꿔 놓는 레지스터</td><td><code>rax rcx rdx rsi rdi r8 r11</code> — 부르고 나면 이 값들은 달라져 있어요</td></tr></tbody></table>
<ul><li><code>sub rsp, 32</code> 로 스택에서 32바이트를 빌려 글자 버퍼로 쓰고, <code>ret</code> 앞의 <code>add rsp, 32</code> 로 돌려줘요. 빌린 만큼 돌려줘야 <code>ret</code> 이 돌아올 주소를 제대로 찾아요([[레슨:R10]])</li><li><code>.digits</code> · <code>.write</code> 처럼 점으로 시작하는 라벨은 바로 위 라벨(<code>print_int</code>)에 딸린 <b>지역 라벨</b>이에요. 다른 함수에 <code>.digits</code> 가 또 있어도 부딪치지 않아요</li></ul>
<p>실행하면 0, 1234567, -42 가 한 줄씩 나와요. 앞으로 숫자를 찍는 예제는 이 함수를 그대로 붙여 써요.</p>`,
      example: { code: `section .text
global _start
_start:
    mov rdi, 0
    call print_int
    mov rdi, 1234567
    call print_int
    mov rdi, -42
    call print_int
    mov rax, 60
    mov rdi, 0
    syscall
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
    ret` } },
    { title: '레지스터 지키기: push · pop', html: `<p>함수와 부른 쪽은 같은 레지스터를 같이 써요. 부른 쪽이 <code>rcx</code> 에 반복 횟수를 두고 <code>call print_int</code> 하면? <code>print_int</code> 는 안에서 <code>rcx</code> 를 10 으로 바꾸고, <code>syscall</code> 도 <code>rcx</code> 를 바꿔요. 돌아오면 횟수가 사라져 있어요.</p>
<pre>    mov rcx, 1
again:
    mov rdi, rcx
    call print_int      ; ← 여기서 rcx 가 망가짐
    inc rcx
    cmp rcx, 3
    jle again           ; 1 만 찍고 끝나 버려요</pre>
<p>고치는 법은 [[레슨:R10]] 의 「맡기기」 그대로예요. <b>부르기 전에 <code>push rcx</code>, 돌아와서 <code>pop rcx</code></b>. 예제를 실행하면 1, 2, 3 이 한 줄씩 나와요.</p>
<p>반대로 <b>함수 쪽</b>이 부른 쪽의 레지스터를 지켜 줄 수도 있어요. 함수 첫 줄에 <code>push rbx</code>, <code>ret</code> 바로 앞에 <code>pop rbx</code>. 어느 레지스터를 누가 지킬지는 다음 레슨의 약속이 정해 줘요.</p>
<div class="bk-warn"><b>ret 앞에서 스택이 제자리인지</b> — <code>ret</code> 은 꼭대기에 있는 값을 「돌아올 주소」 라고 믿고 점프해요. 함수 안에서 <code>push</code> 하고 <code>pop</code> 을 빼먹으면 엉뚱한 곳으로 점프해서 <code>Segmentation fault</code>. 함수 안의 push 와 pop 은 늘 짝을 맞춰요.</div>`,
      example: { code: `section .text
global _start
_start:
    mov rcx, 1              ; rcx = 1, 2, 3
again:
    push rcx                ; print_int 가 rcx 를 바꾸니 맡김
    mov rdi, rcx
    call print_int
    pop rcx                 ; 되찾기
    inc rcx
    cmp rcx, 3
    jle again
    mov rax, 60
    mov rdi, 0
    syscall
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
    ret` } },
    { title: '재귀: 자기를 부르는 fact', html: `<p>함수가 자기 자신을 불러도 돼요([[재귀]]). <code>call</code> 할 때마다 돌아올 주소가 스택에 하나씩 쌓이니까, 몇 겹으로 불러도 하나씩 제자리로 돌아와요.</p>
<table class="kb"><tbody><tr><td>파이썬</td><td><code>def fact(n): return 1 if n &lt;= 1 else n * fact(n - 1)</code></td></tr><tr><td>어셈블리</td><td><code>rdi</code> ≤ 1 이면 <code>rax = 1</code>. 아니면 <code>rdi</code> 를 맡기고 <code>fact(rdi - 1)</code> 을 부른 뒤 곱하기</td></tr></tbody></table>
<p><code>push rdi</code> 가 핵심이에요. 안쪽 <code>fact</code> 가 <code>rdi</code> 를 1 씩 줄여 가니까, 내 n 은 스택에 맡겨 뒀다가 돌아와서 꺼내 곱해요. <code>fact(3)</code> 이 가장 깊이 들어갔을 때의 스택이에요.</p>
<pre>│ _start 로 돌아올 주소    │
│ n = 3                    │  fact(3) 이 맡긴 것
│ fact(3) 으로 돌아올 주소 │
│ n = 2                    │  fact(2) 가 맡긴 것
│ fact(2) 로 돌아올 주소   │ ← rsp   지금 fact(1): rax = 1 하고 ret</pre>
<p>돌아오면서 2 × 1 → 3 × 2 순서로 곱해요. 실행하면 <code>120</code> 과 <code>3628800</code>.</p>`,
      example: { code: `section .text
global _start
_start:
    mov rdi, 5
    call fact
    mov rdi, rax
    call print_int          ; 5! = 120
    mov rdi, 10
    call fact
    mov rdi, rax
    call print_int          ; 10! = 3628800
    mov rax, 60
    mov rdi, 0
    syscall
fact:                       ; rax = rdi! (rdi 가 1 이하면 1)
    cmp rdi, 1
    jg .more
    mov rax, 1              ; 끝: 1! = 1
    ret
.more:
    push rdi                ; 내 n 을 맡김
    dec rdi
    call fact               ; rax = (n-1)!
    pop rdi                 ; 내 n 되찾기
    imul rax, rdi           ; rax = n × (n-1)!
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
    ret` } },
  ],
  summary: ['call 은 돌아올 주소를 push 하고 점프, ret 은 pop 해서 점프', '인자는 rdi(둘째 rsi), 결과는 rax — call print_int 로 숫자 출력', '망가질 레지스터는 push/pop, 함수 안 push·pop 은 짝을 맞춤'] },
{ id: 'R12', ch: 3, n: 12, title: '호출 규약(System V AMD64)', mode: 'text',
  tutorSummary: '리눅스 x86-64 의 System V AMD64 규약: 인자 rdi rsi rdx rcx r8 r9(7번째부터 스택), 결과 rax. 바뀌어도 되는 것(부르는 쪽이 지킴) rax rcx rdx rsi rdi r8~r11, 그대로여야 하는 것(불리는 쪽이 지킴) rbx rbp r12~r15 · rsp. 스택 프레임 push rbp · mov rbp, rsp · sub rsp, 16 · [rbp - 8] · leave · ret. call 하는 순간 rsp 는 16의 배수 — 함수에 들어오면 16n + 8, push rbp 로 다시 16n. 시스템 콜의 4번째 인자는 r10.',
  terms: { '호출 규약': '함수를 부르는 쪽과 불리는 쪽이 지키는 약속. 인자 레지스터의 순서, 결과 레지스터, 누가 어느 레지스터를 지킬지, 스택 정렬을 정한다', '스택 프레임': '함수 하나가 스택에서 쓰는 자기 칸. rbp 를 기준점으로 [rbp - 8] 처럼 지역 변수를 둔다' },
  pages: [
    { title: '인자 rdi rsi rdx rcx r8 r9', html: `<p>내가 만들고 내가 부르는 함수는 아무 레지스터나 써도 돌아가요. 하지만 남이 만든 함수(C 라이브러리의 <code>printf</code>, C 컴파일러가 만든 함수)와 섞으려면 <b>모두가 같은 약속</b>을 지켜야 해요. 그 약속이 [[호출 규약]]이고, 리눅스 x86-64 는 <b>System V AMD64</b> 규약을 써요.</p>
<table class="kb"><tbody><tr><td>인자 1 ~ 6</td><td><code>rdi</code> · <code>rsi</code> · <code>rdx</code> · <code>rcx</code> · <code>r8</code> · <code>r9</code> (이 순서)</td></tr><tr><td>7번째부터</td><td>스택으로(이 교과서는 6개까지만)</td></tr><tr><td>결과</td><td><code>rax</code></td></tr></tbody></table>
<p>예제의 <code>digits3(a, b, c)</code> 는 a × 100 + b × 10 + c 를 돌려줘요. 파이썬의 <code>digits3(1, 2, 3)</code> 이 어셈블리에선 <code>rdi = 1</code> · <code>rsi = 2</code> · <code>rdx = 3</code> 을 넣고 <code>call digits3</code>. 실행하면 <code>123</code> 과 <code>987</code>.</p>
<p class="muted small">시스템 콜도 거의 같지만 4번째 인자만 <code>rcx</code> 대신 <code>r10</code> 이에요. <code>syscall</code> 이 <code>rcx</code> 를 쓰니까요([[레슨:R10]]). 이 교과서의 시스템 콜은 인자가 3개까지라 만날 일은 드물어요.</p>`,
      example: { code: `section .text
global _start
_start:
    mov rdi, 1              ; 1번째 인자 a
    mov rsi, 2              ; 2번째 인자 b
    mov rdx, 3              ; 3번째 인자 c
    call digits3
    mov rdi, rax
    call print_int          ; 123
    mov rdi, 9
    mov rsi, 8
    mov rdx, 7
    call digits3
    mov rdi, rax
    call print_int          ; 987
    mov rax, 60
    mov rdi, 0
    syscall
digits3:                    ; rax = a × 100 + b × 10 + c
    mov rax, rdi
    mov rcx, 100
    imul rax, rcx           ; a × 100
    mov rcx, 10
    imul rsi, rcx           ; b × 10
    add rax, rsi
    add rax, rdx
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
    ret` } },
    { title: '지킬 레지스터: rbx rbp r12~r15', html: `<p>함수를 부르면 어떤 레지스터는 바뀌어도 되고, 어떤 건 그대로여야 해요. 규약이 둘로 나눠 놨어요.</p>
<table class="kb"><tbody><tr><td><b>바뀌어도 되는 것</b><br>(부르는 쪽이 지킴)</td><td><code>rax rcx rdx rsi rdi r8 r9 r10 r11</code> — 함수가 마음대로 써요. 부른 뒤에도 그 값이 필요하면 <b>부르는 쪽이</b> 미리 <code>push</code> 해 둬요</td></tr><tr><td><b>그대로여야 하는 것</b><br>(불리는 쪽이 지킴)</td><td><code>rbx rbp r12 r13 r14 r15</code> 와 <code>rsp</code> — 함수가 쓰고 싶으면 <b>함수가</b> 처음에 <code>push</code>, <code>ret</code> 앞에 <code>pop</code></td></tr></tbody></table>
<p>그래서 <b>함수를 여러 번 부르는 동안 간직할 값</b>(반복 횟수, 합계)은 <code>rbx</code> · <code>r12</code> 같은 「그대로」 쪽에 두면 편해요. [[레슨:R11]] 처럼 부를 때마다 <code>push rcx</code> · <code>pop rcx</code> 하지 않아도 돼요.</p>
<p>예제의 <code>_start</code> 는 횟수를 <code>rbx</code> 에 두고 <code>cube</code> 와 <code>print_int</code> 를 불러요. <code>cube</code> 는 안에서 <code>rbx</code> 를 쓰지만 처음에 맡기고 끝에 돌려놔서 규약을 지켜요. <code>print_int</code> 는 <code>rbx</code> 를 아예 안 써요(첫 줄 주석). 실행하면 <code>27</code>, 8, 1 이 한 줄씩.</p>`,
      example: { code: `section .text
global _start
_start:
    mov rbx, 3              ; rbx = 3, 2, 1 — 부르는 동안 지켜지는 레지스터
again:
    mov rdi, rbx
    call cube               ; rax = rbx³
    mov rdi, rax
    call print_int          ; print_int 도 rbx 는 안 건드림
    dec rbx
    jnz again
    mov rax, 60
    mov rdi, 0
    syscall
cube:                       ; rax = rdi × rdi × rdi — 안에서 rbx 를 씀
    push rbx                ; 불린 쪽이 rbx 를 지킴
    mov rbx, rdi
    imul rbx, rdi
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
    ret` } },
    { title: '스택 프레임: push rbp · leave', html: `<p>레지스터만으로 모자라거나, 다른 함수를 부르는 동안 값을 안전하게 둬야 할 때 <b>지역 변수</b>를 스택에 만들어요. 함수 하나가 스택에서 쓰는 자기 칸을 [[스택 프레임]]이라고 해요. 모양은 늘 같아요.</p>
<pre>show_sum:
    push rbp            ; ① 부른 쪽의 rbp 를 맡기고(rbp 는 지킬 레지스터)
    mov rbp, rsp        ; ② rbp = 내 칸의 기준점
    sub rsp, 16         ; ③ 지역 변수 8바이트 두 칸
    ...                 ;    [rbp - 8] · [rbp - 16] 으로 씀
    leave               ; ④ = mov rsp, rbp 하고 pop rbp
    ret</pre>
<pre>        │ 돌아올 주소      │
rbp  →  │ 맡긴 rbp         │
        │ [rbp - 8]  = a   │
rsp  →  │ [rbp - 16] = b   │   함수를 더 부르면 이 아래로 쌓임</pre>
<p><code>rsp</code> 는 <code>push</code> · <code>call</code> 할 때마다 움직이지만 <code>rbp</code> 는 함수가 끝날 때까지 그대로예요. 그래서 지역 변수를 <code>[rbp - 8]</code> 처럼 늘 같은 이름으로 불러요. 끝에서 <code>leave</code> 한 줄이 <code>rsp</code> 와 <code>rbp</code> 를 처음대로 되돌려요.</p>
<p>예제의 <code>show_sum(a, b)</code> 는 <code>print_int</code> 를 세 번 불러요. <code>print_int</code> 가 <code>rsi</code> · <code>rdi</code> 를 바꿔도 a 와 b 는 지역 변수 칸에 남아 있어요. 실행하면 20, 22, 42 가 한 줄씩.</p>
<p class="muted small"><code>print_int</code> 의 <code>sub rsp, 32</code> 도 지역 변수(글자 버퍼)예요. <code>rbp</code> 없이 <code>rsp</code> 기준으로 쓴 간단한 모양이에요. <code>gcc</code> 가 만든 함수는 대부분 <code>push rbp</code> · <code>mov rbp, rsp</code> 로 시작해요([[레슨:R15]]).</p>`,
      example: { code: `section .text
global _start
_start:
    mov rdi, 20
    mov rsi, 22
    call show_sum           ; 20, 22, 42 를 한 줄씩
    mov rax, 60
    mov rdi, 0
    syscall
show_sum:                   ; show_sum(a, b): a, b, a + b 를 출력
    push rbp                ; ① 부른 쪽의 rbp 를 맡기고
    mov rbp, rsp            ; ② rbp = 내 칸의 기준점
    sub rsp, 16             ; ③ 지역 변수 두 칸(8바이트 × 2)
    mov [rbp - 8], rdi      ; a
    mov [rbp - 16], rsi     ; b
    call print_int          ; a (rdi 그대로)
    mov rdi, [rbp - 16]
    call print_int          ; b — print_int 가 rsi 를 바꿨어도 칸에는 남아 있음
    mov rdi, [rbp - 8]
    add rdi, [rbp - 16]
    call print_int          ; a + b
    leave                   ; = mov rsp, rbp + pop rbp
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
    ret` } },
    { title: '스택 16바이트 정렬', html: `<p>규약의 마지막 약속은 <b><code>call</code> 하는 순간 <code>rsp</code> 가 16 의 배수</b>여야 한다는 거예요. C 라이브러리 함수 안에는 16바이트를 한 번에 옮기는 명령(SSE 의 <code>movaps</code> 같은)이 있어요. 그 명령은 주소가 16 의 배수가 아니면 그 자리에서 멈춰요(<code>Segmentation fault</code>).</p>
<table class="kb"><tbody><tr><td><code>_start</code> 에 들어온 순간</td><td>16 의 배수(리눅스가 맞춰 줌)</td></tr><tr><td>함수에 들어온 순간</td><td>16 의 배수 + 8 — <code>call</code> 이 돌아올 주소 8바이트를 넣어서</td></tr><tr><td><code>push rbp</code> 뒤</td><td>다시 16 의 배수 — 스택 프레임이 <code>push rbp</code> 로 시작하면 저절로 맞아요</td></tr><tr><td><code>sub rsp, N</code></td><td>N 을 16 의 배수(16 · 32 …)로 하면 정렬이 안 깨져요</td></tr></tbody></table>
<p>예제는 <code>rsp</code> 를 16 으로 나눈 나머지를 찍어요. <code>and rdi, 15</code> 는 아래 4비트만 고르는 것이라 16 으로 나눈 나머지와 같아요([[레슨:R4]]). 실행하면 0(<code>_start</code>), 8(<code>check</code> 에 들어온 순간), 0(<code>push rbp</code> 뒤)이 한 줄씩 나와요.</p>
<div class="bk-warn"><b>내 함수끼리는 틀려도 돌아가요</b> — 지금까지의 함수(<code>print_int</code> · <code>fact</code>)는 정렬이 틀려도 잘 돌아요. 그래서 실수를 모르고 지나가기 쉬워요. <code>printf</code> 같은 C 라이브러리를 부르는 [[레슨:R13]] 부터는 꼭 지켜요.</div>`,
      example: { code: `section .text
global _start
_start:
    mov rdi, rsp
    and rdi, 15             ; rsp 를 16 으로 나눈 나머지
    call print_int          ; _start 에서: 0
    call check
    mov rax, 60
    mov rdi, 0
    syscall
check:
    mov rdi, rsp
    and rdi, 15
    push rbp                ; 8바이트 더 내려감
    call print_int          ; 들어온 순간: 8
    mov rdi, rsp
    and rdi, 15
    call print_int          ; push rbp 뒤: 0
    pop rbp
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
    ret` } },
  ],
  summary: ['인자는 rdi rsi rdx rcx r8 r9, 결과는 rax', 'rbx rbp r12~r15 는 불리는 쪽이 지킨다(push … pop)', '스택 프레임 push rbp · mov rbp, rsp · leave, call 앞 rsp 는 16의 배수'] },
{ id: 'R13', ch: 3, n: 13, title: 'C 라이브러리 부르기: printf', mode: 'text',
  tutorSummary: 'extern puts · extern printf, strlen 으로 C 라이브러리 함수를 쓰고 global main · main: 에서 시작(C 라이브러리의 시작 코드가 main 을 call, main 은 ret 으로 끝남). 빌드 nasm -f elf64 → gcc -no-pie x.o -o x(-no-pie 가 없으면 PIE relocation 에러, GNU-stack 경고는 무해). C 글자는 0 으로 끝남(db "…", 10, 0). printf: rdi 형식 주소 · rsi rdx rcx … 값 · %ld(64비트) %d %s(주소) %c · xor eax, eax(가변 인자: al = xmm 인자 수). strlen · printf 도 결과는 rax(printf 는 찍은 바이트 수). main 의 rax = 종료 코드. printf 뒤에 syscall exit 하면 버퍼가 안 나감 → ret. main 에 들어오면 rsp 는 16n + 8 → push 를 홀수 번(push rbp · push rbx · push r12).',
  terms: { '가변 인자': 'printf 처럼 인자 개수가 정해지지 않은 함수. 부르기 전에 al 에 「xmm 레지스터로 넘긴 실수 인자 개수」 를 넣는다(정수만이면 0)' },
  pages: [
    { title: 'extern · main · gcc -no-pie', html: `<p>지금까지는 C 라이브러리 없이 커널에게 직접 부탁했어요(<code>syscall</code>). 이제 C 프로그래머가 쓰는 함수(<code>puts</code> · <code>printf</code> · <code>strlen</code>)를 어셈블리에서 불러 봐요. 바뀌는 건 세 가지예요.</p>
<table class="kb"><tbody><tr><td><code>extern puts</code></td><td>「<code>puts</code> 는 다른 곳(C 라이브러리)에 있어요」 — 링크할 때 찾아 붙여요</td></tr><tr><td><code>global main</code> · <code>main:</code></td><td><code>_start</code> 대신 <code>main</code>. C 라이브러리가 자기 <code>_start</code> 에서 준비를 마친 뒤 <code>main</code> 을 <code>call</code> 해요. 그래서 <code>main</code> 은 보통 함수처럼 <code>ret</code> 으로 끝나요</td></tr><tr><td><code>gcc -no-pie</code></td><td><code>ld</code> 대신 <code>gcc</code> 로 링크 — C 라이브러리와 시작 코드를 같이 묶어 줘요</td></tr></tbody></table>
<p>C 의 글자는 끝에 <b>0 바이트</b>가 있어야 해요(<code>db "…", 0</code>, [[레슨:R8]]). 길이를 따로 받지 않고 0 을 만날 때까지 읽거든요. <code>puts</code> 는 글자를 찍고 줄바꿈을 알아서 붙여요. <code>main</code> 첫 줄의 <code>push rbp</code> 는 4쪽에서 설명해요.</p>
<pre>nasm -f elf64 hello_c.asm -o hello_c.o
gcc -no-pie hello_c.o -o hello_c
./hello_c</pre>
<ul class="small"><li><code>-no-pie</code> 를 빼면 <code>relocation R_X86_64_PC32 … can not be used when making a PIE object</code> 에러가 나요. 요즘 gcc 는 실행 파일을 메모리 어디에 놓아도 되게(PIE) 만드는데, 우리 코드의 <code>call printf</code> 는 그 모양이 아니라서예요</li><li>우분투 24.04 에서는 <code>missing .note.GNU-stack section implies executable stack</code> 경고가 보일 수 있어요. 실행 파일은 잘 만들어져요. 없애고 싶으면 파일 맨 끝에 <code>section .note.GNU-stack noalloc noexec nowrite progbits</code> 한 줄</li><li><code>ld</code> 로 링크하면 <code>undefined reference to puts</code> — C 라이브러리를 안 붙여서예요</li></ul>`,
      example: { code: `default rel
section .data
msg db "안녕, C 라이브러리!", 0    ; C 의 문자열은 0 으로 끝나요
section .text
global main
extern puts
main:
    push rbp                ; 스택 맞추기(4쪽)
    lea rdi, [msg]          ; puts(msg)
    call puts               ; 줄바꿈은 puts 가 붙여 줌
    pop rbp
    mov eax, 0              ; return 0 → 종료 코드 0
    ret` } },
    { title: 'printf: rdi 형식 · xor eax, eax', html: `<p><code>printf</code> 는 파이썬의 <code>%</code> 서식과 비슷해요. 첫 인자는 <b>형식 글자의 주소</b>, 그 뒤로 <code>%</code> 자리에 들어갈 값이 규약 순서대로([[레슨:R12]]) 들어가요.</p>
<table class="kb"><tbody><tr><td>C</td><td><code>printf("%ld + %ld = %ld\\n", 3, 4, 7);</code></td></tr><tr><td>어셈블리</td><td><code>rdi</code> = 형식 주소 · <code>rsi</code> = 3 · <code>rdx</code> = 4 · <code>rcx</code> = 7 → <code>xor eax, eax</code> → <code>call printf</code></td></tr></tbody></table>
<table class="kb"><tbody><tr><td><code>%ld</code></td><td>64비트 정수(C 의 <code>long</code>) — 레지스터 하나 통째로</td></tr><tr><td><code>%d</code></td><td>32비트 정수(<code>int</code>) — 아래 절반(<code>esi</code> …)만 봐요</td></tr><tr><td><code>%s</code></td><td>0 으로 끝나는 글자 — 값 대신 <b>주소</b>를 넘겨요</td></tr><tr><td><code>%c</code></td><td>글자 하나</td></tr></tbody></table>
<p><b><code>xor eax, eax</code> 는 왜?</b> <code>printf</code> 처럼 인자 개수가 정해지지 않은 함수([[가변 인자]])는 「실수(소수) 인자를 xmm 레지스터로 몇 개 넘겼나」 를 <code>al</code> 에서 읽어요. 우리는 정수만 넘기니 0 이에요. 빼먹으면 <code>al</code> 에 남은 아무 값 때문에 가끔 이상하게 동작해요.</p>
<p>형식 글자 끝의 <code>10</code> 은 C 의 <code>\\n</code>(줄바꿈), 마지막 <code>0</code> 은 글자의 끝 표시예요. 실행하면 <code>3 + 4 = 7</code>.</p>`,
      example: { code: `default rel
section .data
fmt db "%ld + %ld = %ld", 10, 0
section .text
global main
extern printf
main:
    push rbp
    mov rsi, 3              ; 2번째 인자: 첫 %ld
    mov rdx, 4              ; 3번째 인자: 둘째 %ld
    mov rcx, rsi
    add rcx, rdx            ; 4번째 인자: 셋째 %ld = 7
    lea rdi, [fmt]          ; 1번째 인자: 형식 글자의 주소
    xor eax, eax            ; 실수 인자 0개 (가변 인자 규칙)
    call printf
    pop rbp
    xor eax, eax
    ret` } },
    { title: 'strlen · main 의 rax = 종료 코드', html: `<p>C 라이브러리 함수도 규약대로 결과를 <code>rax</code> 에 돌려줘요. <code>strlen(s)</code> 는 0 앞까지의 바이트 수를, <code>printf</code> 는 <b>찍은 바이트 수</b>를 돌려줘요. <code>extern printf, strlen</code> 처럼 한 줄에 여럿 적어도 돼요.</p>
<p><code>main</code> 도 함수라서 <code>ret</code> 할 때의 <code>rax</code> 가 결과예요. C 라이브러리는 그 값으로 <code>exit</code> 을 불러요. 그래서 <b><code>main</code> 의 <code>rax</code> = 종료 코드</b>예요(C 의 <code>return 0;</code>). 예제는 <code>printf</code> 가 돌려준 값을 그대로 돌려줘요.</p>
<p>실행하면 <code>assembly 는 8 바이트</code> 다음 줄에 <code>25</code> — 「assembly」 8 + 「 는 」 5(한글 3 + 빈칸 2) + 「8」 1 + 「 바이트」 10 + 줄바꿈 1 이에요.</p>
<div class="bk-warn"><b>printf 를 썼으면 syscall 로 끝내지 말고 ret</b> — <code>printf</code> 는 글자를 바로 내보내지 않고 모아 뒀다가(버퍼) 한꺼번에 써요. <code>main</code> 에서 <code>ret</code> 하면 C 라이브러리가 남은 글자를 다 내보내고 끝내요. 하지만 <code>mov rax, 60</code> · <code>syscall</code> 로 바로 끝내면 모아 둔 글자가 사라질 수 있어요. 터미널에선 멀쩡해 보여도 <code>./prog &gt; out.txt</code> 나 <code>./prog | cat</code> 에서는 텅 비어요(<a href="../os/#lesson/K15" target="_blank" rel="noopener">운영체제 교과서 「파일 디스크립터와 버퍼」 ↗</a>).</div>`,
      example: { code: `default rel
section .data
word1 db "assembly", 0
fmt db "%s 는 %ld 바이트", 10, 0
section .text
global main
extern printf, strlen
main:
    push rbp
    lea rdi, [word1]
    call strlen             ; rax = 8
    lea rdi, [fmt]
    lea rsi, [word1]        ; %s 자리: 글자의 주소
    mov rdx, rax            ; %ld 자리: 길이
    xor eax, eax
    call printf             ; rax = 찍은 바이트 수
    pop rbp
    ret                     ; rax 그대로 → 종료 코드`, echoExit: true } },
    { title: '정렬: main 에서 push 홀수 번', html: `<p>[[레슨:R12]] 의 약속은 「<code>call</code> 하는 순간 <code>rsp</code> 는 16 의 배수」 였죠. <code>main</code> 도 C 라이브러리가 <code>call</code> 한 함수라서, 들어온 순간 <code>rsp</code> 는 <b>16 의 배수 + 8</b> 이에요. 그래서 <code>main</code> 첫 줄에서 <code>push rbp</code> 를 해요.</p>
<table class="kb"><tbody><tr><td><code>main</code> 에 들어옴</td><td>16 의 배수 + 8</td></tr><tr><td><code>push rbp</code></td><td>16 의 배수 — 여기서 <code>call printf</code> 해도 돼요</td></tr><tr><td><code>push rbx</code> 까지</td><td>16 의 배수 + 8 — 이대로 부르면 위험</td></tr><tr><td><code>push r12</code> 까지</td><td>16 의 배수 — 다시 안전</td></tr></tbody></table>
<p>규칙 하나로 외워요. <b>함수 처음에 <code>push</code> 를 홀수 번</b>(1 · 3 · 5 번). 짝수 번이 되면 <code>sub rsp, 8</code> 을 하나 더해 맞추고, 끝에서 <code>add rsp, 8</code> 로 돌려놔요. <code>pop</code> 은 넣은 반대 순서로 해요.</p>
<p>예제는 n 을 <code>rbx</code>, 끝 값을 <code>r12</code> 에 둬요. 둘 다 「불리는 쪽이 지킬」 레지스터라 <code>printf</code> 를 몇 번 불러도 그대로예요. 대신 <code>main</code> 도 함수라서 이 둘을 맡겼다가 돌려놔야 하고, 그러다 보니 push 가 세 번 — 마침 홀수예요. 실행하면 <code>1 의 제곱은 1</code> 부터 <code>5 의 제곱은 25</code> 까지 다섯 줄.</p>
<div class="bk-warn"><b>정렬이 틀리면</b> — <code>printf</code> 안에서 <code>Segmentation fault</code> 가 나요. 그런데 C 라이브러리 버전이나 넘긴 값에 따라 <b>될 때도 있어서</b> 더 헷갈려요. 「내 컴퓨터에선 됐는데」 를 막으려면 늘 push 수를 세어 봐요.</div>`,
      example: { code: `default rel
section .data
fmt db "%ld 의 제곱은 %ld", 10, 0
section .text
global main
extern printf
main:
    push rbp                ; 1번 — 들어올 때 16의 배수 + 8 → 이제 16의 배수
    push rbx                ; 2번 — 다시 + 8
    push r12                ; 3번 — 다시 16의 배수 (홀수 번)
    mov rbx, 1              ; rbx = n (printf 가 지켜 줌)
    mov r12, 5              ; r12 = 끝 값
again:
    lea rdi, [fmt]
    mov rsi, rbx
    mov rdx, rbx
    imul rdx, rbx           ; n × n
    xor eax, eax
    call printf
    inc rbx
    cmp rbx, r12
    jle again
    pop r12                 ; 넣은 반대 순서로
    pop rbx
    pop rbp
    xor eax, eax
    ret` } },
  ],
  summary: ['extern printf + global main + gcc -no-pie, 끝은 ret', 'rdi 에 형식 주소, rsi · rdx · rcx 에 값, xor eax, eax', 'main 의 rax = 종료 코드, push 를 홀수 번 해서 16바이트 정렬'] },
{ id: 'RB3', ch: 3, boss: true, title: '만들어 보기: 내 함수 모음', mode: 'text',
  tutorSummary: '챕터 3 묶기 — print_int · strlen · print_str · to_upper · max_of(arr, n) 를 호출 규약대로(인자 rdi rsi, 결과 rax, rbx 는 push/pop 으로 지킴) 만들고 global main 에서 차례로 부르기(gcc -no-pie, ret 으로 끝). 마지막엔 결과를 rbx · r12 에 간직하고 push 세 번으로 정렬해 printf 한 줄. write 로 찍는 함수와 printf 는 한 프로그램에서 섞지 않음(버퍼 순서).', pages: [], summary: [] },
{ id: 'R14', ch: 4, n: 14, title: 'C 에서 어셈블리 함수 부르기', mode: 'text',
  tutorSummary: 'main.c + add.asm 두 파일. C 쪽 선언 long add(long a, long b); · asm 쪽 global add. 빌드는 nasm -f elf64 add.asm -o add.o → gcc -no-pie main.c add.o -o prog(우분투 24.04 의 ld 는 「missing .note.GNU-stack」 경고 — 무해, section .note.GNU-stack noalloc noexec nowrite progbits 한 줄로 없앰). 에러: undefined reference to add(global 이나 add.o 빠짐). 타입 → 레지스터 크기: char = dil/sil/al, int = edi/esi/eax, long·포인터 = rdi/rsi/rax. int 를 long 으로 늘릴 땐 movsxd rax, edi. 배열 이름 = 첫 칸 주소(long *arr → [rdi + rcx*8]), 문자열 = 0 으로 끝나는 바이트의 주소(char *s). fgets(line, sizeof line, stdin) 로 C 가 한 줄 읽고 asm 이 고침. 문자열 리터럴은 고치면 폴트.',
  terms: { '선언': 'C 에서 함수의 이름 · 인자 타입 · 돌려주는 타입만 적고 몸통은 없는 줄(long add(long a, long b);). 「이런 함수가 어딘가 있어요」 라는 약속', '포인터': '어떤 값이 있는 곳의 주소를 담는 C 의 타입. long * 는 「long 이 있는 곳의 주소」, char * 는 「글자(바이트)가 있는 곳의 주소」. 레지스터에서는 그냥 64비트 숫자' },
  pages: [
    { title: 'main.c 와 add.asm: 선언과 global', html: `<p>지금까지는 어셈블리 파일 하나가 프로그램 전부였어요. 이번엔 <b>C 파일</b>이 프로그램의 주인(<code>main</code>)이고, 어셈블리는 그 C 가 부르는 <b>함수 하나</b>만 맡아요. 실제로 어셈블리는 대개 이렇게 써요 — 꼭 손으로 짜야 하는 작은 부분만.</p>
<p>C 는 처음이죠. 이 챕터에 필요한 만큼만 읽어요.</p>
<pre class="code">#include &lt;stdio.h&gt;              // printf 를 쓰겠다는 줄(파이썬의 import 비슷)

long add(long a, long b);       // 선언: 「add 라는 함수가 어딘가 있어요」

int main(void) {                // 프로그램은 main 에서 시작
    long x = add(2, 3);         // long = 64비트 정수. 변수는 타입을 먼저 적어요
    printf("%ld\\n", x);         // %ld 자리에 x 를 10진수로
    printf("%ld\\n", add(40, 2));
    return 0;                   // 종료 코드 0
}</pre>
<table class="kb"><tbody><tr><td><code>{ }</code></td><td>블록(파이썬의 들여쓰기 대신)</td></tr><tr><td><code>;</code></td><td>문장 끝마다</td></tr><tr><td><code>//</code></td><td>주석(어셈블리의 <code>;</code>)</td></tr><tr><td><code>long x = …;</code></td><td>64비트 정수 변수 만들기</td></tr></tbody></table>
<p>C 쪽 [[선언]] <code>long add(long a, long b);</code> 은 몸통 없이 <b>모양만</b> 적은 줄이에요. 몸통은 <code>add.asm</code> 에 있고, 그 이름을 다른 파일이 찾을 수 있게 <code>global add</code> 로 내놓아요. <code>_start</code> 를 내놓던 바로 그 <code>global</code> 이에요.</p>
<pre class="code">section .text
global add
add:                        ; rdi = a, rsi = b → rax = a + b
    mov rax, rdi
    add rax, rsi
    ret</pre>
<p>C 컴파일러는 [[레슨:R12]] 의 호출 규약을 그대로 지켜요. 첫 인자는 <code>rdi</code>, 둘째는 <code>rsi</code> 에 넣고 <code>call add</code>, 돌아오면 <code>rax</code> 를 결과로 써요. 그래서 규약대로 짠 함수는 C 가 그냥 부를 수 있어요. 실행하면 <code>5</code> 와 <code>42</code> 가 한 줄씩 나와요.</p>`,
      example: { label: '예제 코드 — main.c + add.asm, gcc -no-pie 로 묶어 실행', code: `// ==== 파일: main.c ====
#include <stdio.h>

long add(long a, long b);       // add 는 다른 파일(add.asm)에 있어요

int main(void) {
    long x = add(2, 3);
    printf("%ld\\n", x);
    printf("%ld\\n", add(40, 2));
    return 0;
}
; ==== 파일: add.asm ====
section .text
global add
add:                        ; rdi = a, rsi = b → rax = a + b
    mov rax, rdi
    add rax, rsi
    ret` } },
    { title: 'gcc -no-pie main.c add.o 로 묶기', html: `<p>두 파일은 이렇게 빌드해요. 어셈블리는 늘 하던 대로 <code>nasm</code>, 나머지는 <code>gcc</code> 한 줄이에요.</p>
<pre class="code">nasm -f elf64 add.asm -o add.o
gcc -no-pie main.c add.o -o prog
./prog</pre>
<p><code>gcc</code> 는 두 가지를 한꺼번에 해요. ① <code>main.c</code> 를 기계어(<code>main.o</code>, 따로 파일로 남기지는 않음)로 바꾸고 ② 그것을 <code>add.o</code>, C 라이브러리(<code>printf</code> 가 들어 있음), <b>시작 코드</b>와 묶어 실행 파일을 만들어요.</p>
<pre>main.c  ──gcc──▶ (main.o) ──┐
add.asm ──nasm─▶  add.o  ───┼──▶ prog
C 라이브러리 · 시작 코드 ────┘</pre>
<p>그래서 우리 파일에는 <code>_start</code> 가 없어요. 시작 코드 안의 <code>_start</code> 가 준비를 하고 <code>main</code> 을 부르고, <code>main</code> 이 돌려준 값(<code>return 0</code> → <code>eax</code>)이 종료 코드가 돼요. [[레슨:R13]] 에서 <code>main</code> 을 어셈블리로 썼을 때와 같은 구조예요.</p>
<table class="kb"><tbody><tr><td><code>undefined reference to 'add'</code></td><td>링크하다 <code>add</code> 를 못 찾았어요. <code>add.asm</code> 에 <code>global add</code> 가 없거나, gcc 명령에 <code>add.o</code> 를 빼먹었어요</td></tr><tr><td><code>implicit declaration of function 'add'</code></td><td>C 에 선언 줄이 없어요. gcc 13 은 경고, 14 부터는 에러예요. 늘 <code>main</code> 위에 선언을 적어요</td></tr><tr><td>엉뚱한 숫자가 나옴</td><td>선언의 타입과 어셈블리가 쓰는 레지스터 크기가 달라요(다음 쪽)</td></tr></tbody></table>
<div class="bk-warn"><b>missing .note.GNU-stack section implies executable stack</b> — 우분투 24.04 에서 <code>gcc</code> 로 nasm 의 <code>.o</code> 를 묶으면 이 경고가 두 줄 나와요. 「이 파일은 스택에서 코드를 실행해도 되는지 말이 없네요」 라는 뜻이고 <code>prog</code> 는 잘 만들어져요. 없애고 싶으면 <code>.asm</code> 파일 끝에 <code>section .note.GNU-stack noalloc noexec nowrite progbits</code> 한 줄을 붙여요(gcc 가 만든 <code>.o</code> 에는 이 표시가 저절로 들어가요 — [[레슨:R15]]).</div>`,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'cd ~/asm\nnasm -f elf64 add.asm -o add.o\ngcc -no-pie main.c add.o -o prog\n./prog' } },
    { title: 'int 는 edi, long 은 rdi', html: `<p>C 의 변수에는 <b>크기</b>가 있어요. 함수는 선언에 적힌 크기만큼의 레지스터 이름을 써요 — [[레슨:R1]] 의 「같은 상자의 작은 이름」 이에요.</p>
<table class="kb"><tbody><tr><th>C 타입</th><th>크기</th><th>인자 1 · 2</th><th>결과</th><th>printf</th></tr><tr><td><code>char</code></td><td>1바이트</td><td><code>dil</code> · <code>sil</code></td><td><code>al</code></td><td><code>%c</code></td></tr><tr><td><code>int</code></td><td>4바이트</td><td><code>edi</code> · <code>esi</code></td><td><code>eax</code></td><td><code>%d</code></td></tr><tr><td><code>long</code></td><td>8바이트</td><td><code>rdi</code> · <code>rsi</code></td><td><code>rax</code></td><td><code>%ld</code></td></tr><tr><td>[[포인터]] <code>long *</code> · <code>char *</code></td><td>8바이트</td><td><code>rdi</code> · <code>rsi</code></td><td><code>rax</code></td><td><code>%s</code>(문자열)</td></tr></tbody></table>
<p>규약은 「<code>int</code> 인자를 받으면 <code>rdi</code> 의 위 32비트는 아무 값이나 있을 수 있다」 고 해요. 그래서 <code>int</code> 는 <code>edi</code> 만 믿고, <code>long</code> 으로 돌려줄 땐 부호를 살려 늘려야 해요.</p>
<pre class="code">int twice(int x);           // int → edi, 결과 eax
long widen_bad(int x);      // int 를 받아 long 으로 — 틀린 버전
long widen(int x);          // 맞는 버전</pre>
<pre class="code">twice:
    mov eax, edi
    add eax, eax
    ret
widen_bad:
    mov eax, edi            ; eax 에 쓰면 위 32비트는 0
    ret
widen:
    movsxd rax, edi         ; 맨 위 비트(부호)를 위 32비트에 채워 늘리기
    ret</pre>
<p>실행하면 <code>-42</code>, <code>4294967295</code>, <code>-1</code>. <code>int</code> 의 -1 은 <code>0xFFFFFFFF</code> 예요. <code>mov eax, edi</code> 는 위를 0 으로 채우니 64비트로 보면 <code>0x00000000FFFFFFFF</code> = 4294967295 가 되고, <code>movsxd</code> 는 위를 1 로 채워 <code>0xFFFFFFFFFFFFFFFF</code> = -1 을 지켜요. 이 교과서는 헷갈리지 않게 숫자는 거의 <code>long</code> 으로 주고받아요.</p>`,
      example: { label: '예제 코드 — main.c + num.asm', code: `// ==== 파일: main.c ====
#include <stdio.h>

int twice(int x);
long widen_bad(int x);
long widen(int x);

int main(void) {
    printf("%d\\n", twice(-21));
    printf("%ld\\n", widen_bad(-1));
    printf("%ld\\n", widen(-1));
    return 0;
}
; ==== 파일: num.asm ====
section .text
global twice
global widen_bad
global widen
twice:                      ; int x → edi, 결과 int → eax
    mov eax, edi
    add eax, eax
    ret
widen_bad:                  ; int 를 받아 long 으로 돌려주기(틀린 버전)
    mov eax, edi            ; eax 에 쓰면 위 32비트는 0
    ret
widen:                      ; 맞는 버전
    movsxd rax, edi         ; 부호를 살려 64비트로 늘리기
    ret` } },
    { title: '배열 넘기기: long *arr 는 주소', html: `<p>C 의 배열은 같은 타입의 칸이 메모리에 <b>붙어 있는</b> 것이에요. [[레슨:R8]] 의 <code>dq 3, 1, 4, 1</code> 과 똑같은 모양이에요.</p>
<pre class="code">long nums[4] = {3, 1, 4, 1};    // long 4칸(8바이트씩)
double_all(nums, 4);            // 배열 이름을 넘기면 = 첫 칸의 주소
printf("%ld %ld %ld %ld\\n", nums[0], nums[1], nums[2], nums[3]);</pre>
<p>선언은 <code>void double_all(long *arr, long n);</code> 이에요. <code>long *</code> 는 「long 이 있는 곳의 주소」([[포인터]]), <code>void</code> 는 「돌려주는 값 없음」. 레지스터에 들어오는 건 그냥 주소 숫자라서, 어셈블리에선 늘 하던 대로 <code>[rdi + rcx*8]</code> 로 칸을 읽고 써요.</p>
<pre>rdi = nums 의 주소
  [rdi]    [rdi+8]  [rdi+16]  [rdi+24]
  3        1        4         1         ← 부르기 전
  6        2        8         2         ← double_all 뒤</pre>
<pre class="code">double_all:                 ; rdi = 배열 주소, rsi = 칸 수
    xor ecx, ecx            ; rcx = 칸 번호 0
.loop:
    cmp rcx, rsi
    jge .done
    mov rax, [rdi + rcx*8]
    add rax, rax
    mov [rdi + rcx*8], rax  ; C 의 배열을 그 자리에서 고침
    inc rcx
    jmp .loop
.done:
    ret</pre>
<p>어셈블리가 C 의 메모리를 직접 고쳤으니 <code>main</code> 이 다시 읽으면 바뀐 값이 보여요. 실행하면 <code>6 2 8 2</code>. <code>nums[0]</code> 은 파이썬처럼 0 번째 칸이에요.</p>`,
      example: { label: '예제 코드 — main.c + arr.asm', code: `// ==== 파일: main.c ====
#include <stdio.h>

void double_all(long *arr, long n);

int main(void) {
    long nums[4] = {3, 1, 4, 1};
    double_all(nums, 4);
    printf("%ld %ld %ld %ld\\n", nums[0], nums[1], nums[2], nums[3]);
    return 0;
}
; ==== 파일: arr.asm ====
section .text
global double_all
double_all:                 ; rdi = 배열 주소, rsi = 칸 수
    xor ecx, ecx            ; rcx = 칸 번호 0
.loop:
    cmp rcx, rsi
    jge .done
    mov rax, [rdi + rcx*8]
    add rax, rax
    mov [rdi + rcx*8], rax  ; C 의 배열을 그 자리에서 고침
    inc rcx
    jmp .loop
.done:
    ret` } },
    { title: '문자열 넘기기: char *s 와 fgets', html: `<p>C 의 문자열은 [[레슨:R8]] 의 「0 으로 끝나는 바이트 배열」 그대로예요. 함수에는 첫 글자의 주소(<code>char *s</code>)가 가요. 이번엔 C 가 <b>입력을 한 줄씩 읽어</b> 어셈블리에게 넘겨요.</p>
<pre class="code">char line[100];                                     // 글자 100개 자리
while (fgets(line, sizeof line, stdin) != NULL) {   // 한 줄 읽기. 입력이 끝나면 NULL
    to_upper(line);                                 // 어셈블리가 그 자리에서 고침
    printf("%s", line);                             // 0 까지 찍기(줄바꿈은 line 안에)
}</pre>
<table class="kb"><tbody><tr><td><code>while (조건) { … }</code></td><td>파이썬의 <code>while 조건:</code></td></tr><tr><td><code>fgets(line, sizeof line, stdin)</code></td><td>stdin 에서 한 줄을 <code>line</code> 에 넣고 끝에 0 을 붙여요. 줄바꿈(10)도 들어가요. 더 읽을 게 없으면 <code>NULL</code></td></tr><tr><td><code>!=</code></td><td>파이썬과 같은 「다르면」</td></tr></tbody></table>
<pre class="code">to_upper:                   ; rdi = 0 으로 끝나는 문자열 주소
.next:
    mov al, [rdi]
    cmp al, 0
    je .done
    cmp al, 'a'
    jb .skip                ; 'a' 보다 작으면 그대로
    cmp al, 'z'
    ja .skip                ; 'z' 보다 크면 그대로(한글 바이트도 여기로)
    sub al, 32              ; 'a'(97) → 'A'(65)
    mov [rdi], al
.skip:
    inc rdi
    jmp .next
.done:
    ret</pre>
<p>입력이 <code>hello asm</code> · <code>C 와 함께</code> 두 줄이면, 실행하면 <code>HELLO ASM</code> 다음 줄에 <code>C 와 함께</code>. 한글의 바이트는 0x80 보다 커서(<code>ja</code>, 부호 없는 비교) 건드리지 않아요.</p>
<div class="bk-warn"><b>따옴표 문자열은 고치면 폴트</b> — <code>char *s = "hello"; to_upper(s);</code> 처럼 따옴표 문자열을 바로 넘겨 고치면 <code>Segmentation fault</code> 예요. 따옴표 문자열은 「읽기만」 하는 메모리에 있어서요. 고칠 문자열은 위처럼 배열(<code>char line[100]</code>)에 담아요.</div>`,
      example: { label: '예제 코드 — main.c + upper.asm (입력 두 줄)', stdin: 'hello asm\nC 와 함께\n', code: `// ==== 파일: main.c ====
#include <stdio.h>

void to_upper(char *s);

int main(void) {
    char line[100];
    while (fgets(line, sizeof line, stdin) != NULL) {
        to_upper(line);
        printf("%s", line);
    }
    return 0;
}
; ==== 파일: upper.asm ====
section .text
global to_upper
to_upper:                   ; rdi = 0 으로 끝나는 문자열 주소
.next:
    mov al, [rdi]
    cmp al, 0
    je .done
    cmp al, 'a'
    jb .skip                ; 'a' 보다 작으면 그대로
    cmp al, 'z'
    ja .skip                ; 'z' 보다 크면 그대로(한글 바이트도 여기로)
    sub al, 32              ; 'a'(97) → 'A'(65)
    mov [rdi], al
.skip:
    inc rdi
    jmp .next
.done:
    ret` } },
  ],
  summary: ['C 에서 선언, asm 에서 global', 'int 는 edi, long 은 rdi', '포인터 = 주소'] },
{ id: 'R15', ch: 4, n: 15, title: 'C 가 어떻게 바뀌나: gcc -S · objdump -d', mode: 'text',
  tutorSummary: 'gcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables add.c → add.s(인텔 문법 어셈블리). -O0 은 인자를 스택(QWORD PTR -8[rbp] = qword [rbp-8])에 저장했다 다시 꺼냄, push rbp · mov rbp, rsp · pop rbp 프레임, endbr64 는 CET 표시. if (a > b) → cmp + 반대 조건 jle 로 건너뛰기, for → 초기화 · jmp 검사 · 몸통 · i++ · cmp + jle 위로. -O2: add → lea rax, [rdi+rsi], max → cmovge, 상수 인자 sum_to(100) 은 컴파일 때 5050 으로(반복 사라짐), 우분투 -O2 는 printf → __printf_chk. objdump -d -M intel prog: 주소 · 바이트 · 명령, call 401190 <add>, printf@plt(PIE 면 NASM 은 call printf wrt ..plt — 그래서 -no-pie). AT&T: 순서 반대(주는쪽, 받는쪽), %rax, $3, movq 크기 글자, -8(%rbp) = [rbp-8]. 출력은 gcc 버전에 따라 조금 다름(우분투 24.04 gcc 13.3 기준).',
  pages: [
    { title: 'gcc -S -O0 -masm=intel: C 를 .s 로', html: `<p>[[레슨:R14]] 에서는 어셈블리를 손으로 짰어요. 그럼 C 로 짠 함수는 <code>gcc</code> 가 어떤 어셈블리로 바꿀까요? <code>gcc -S</code> 가 그 중간 결과를 파일(<code>.s</code>)로 보여 줘요. C 함수 하나를 써 봐요.</p>
<pre class="code">long add(long a, long b) {      // 파이썬의 def add(a, b):
    return a + b;
}</pre>
<pre class="code">gcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables add.c
cat add.s</pre>
<table class="kb"><tbody><tr><td><code>-S</code></td><td>기계어까지 가지 말고 어셈블리(<code>add.s</code>)에서 멈추기</td></tr><tr><td><code>-O0</code></td><td>최적화 안 함 — C 한 줄이 그대로 몇 줄로(읽기 쉬움)</td></tr><tr><td><code>-masm=intel</code></td><td>이 교과서의 인텔 문법으로(없으면 AT&amp;T, 5쪽)</td></tr><tr><td><code>-fno-asynchronous-unwind-tables</code></td><td><code>.cfi_…</code> 같은 디버거용 줄을 빼기</td></tr></tbody></table>
<pre>        .file   "add.c"
        .intel_syntax noprefix
        .text
        .globl  add
        .type   add, @function
add:
        endbr64
        push    rbp
        mov     rbp, rsp
        mov     QWORD PTR -8[rbp], rdi
        mov     QWORD PTR -16[rbp], rsi
        mov     rdx, QWORD PTR -8[rbp]
        mov     rax, QWORD PTR -16[rbp]
        add     rax, rdx
        pop     rbp
        ret
        .size   add, .-add
        .ident  "GCC: (Ubuntu 13.3.0-6ubuntu2~24.04.1) 13.3.0"
        .section        .note.GNU-stack,"",@progbits
        …(아래 몇 줄 더)</pre>
<p class="muted small">우분투 24.04 의 gcc 13.3 으로 만든 그대로예요(탭은 빈칸으로). gcc 버전에 따라 조금씩 달라요.</p>
<ul><li><code>.globl add</code> = NASM 의 <code>global add</code>. 점(<code>.</code>)으로 시작하는 줄은 명령이 아니라 어셈블러에게 하는 말이에요.</li><li><code>push rbp</code> · <code>mov rbp, rsp</code> · <code>pop rbp</code> 는 [[레슨:R12]] 의 스택 프레임이에요.</li><li><code>QWORD PTR -8[rbp]</code> 는 NASM 으로 <code>qword [rbp - 8]</code>. <code>-O0</code> 은 인자를 일단 스택에 저장했다가 다시 꺼내요. 느리지만 변수마다 자리가 있어 gdb 로 보기 좋아요.</li><li><code>endbr64</code> 는 「여기로 점프해 와도 돼요」 표시(보안 기능). 없어도 똑같이 돌아요.</li></ul>`,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'cd ~/asm\ngcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables add.c\ncat add.s' } },
    { title: 'if 와 for 는 cmp 와 점프로', html: `<p>C 의 <code>if</code> 와 <code>for</code> 가 어떻게 되는지 보면, [[레슨:R5]] · [[레슨:R6]] 에서 손으로 만든 모양과 거의 같아요.</p>
<pre class="code">long max(long a, long b) {
    if (a &gt; b)
        return a;
    return b;
}

long sum_to(long n) {
    long s = 0;
    for (long i = 1; i &lt;= n; i++)   // i = 1 부터, i &lt;= n 인 동안, 한 번마다 i 를 1 늘림
        s += i;
    return s;
}</pre>
<p><code>for (시작; 조건; 한 번 끝날 때마다)</code> 는 파이썬의 <code>for i in range(1, n + 1):</code> 과 같은 반복이에요. <code>i++</code> 는 <code>i += 1</code>. <code>gcc -S -O0 -masm=intel -fno-asynchronous-unwind-tables</code> 의 결과예요(함수 부분만, 오른쪽 <code>;</code> 설명은 덧붙인 것).</p>
<pre>max:
    endbr64
    push    rbp
    mov     rbp, rsp
    mov     QWORD PTR -8[rbp], rdi    ; a
    mov     QWORD PTR -16[rbp], rsi   ; b
    mov     rax, QWORD PTR -8[rbp]
    cmp     rax, QWORD PTR -16[rbp]
    jle     .L4                       ; a &lt;= b 면 건너뛰기
    mov     rax, QWORD PTR -8[rbp]    ; return a
    jmp     .L5
.L4:
    mov     rax, QWORD PTR -16[rbp]   ; return b
.L5:
    pop     rbp
    ret</pre>
<pre>sum_to:
    endbr64
    push    rbp
    mov     rbp, rsp
    mov     QWORD PTR -24[rbp], rdi   ; n
    mov     QWORD PTR -16[rbp], 0     ; s = 0
    mov     QWORD PTR -8[rbp], 1      ; i = 1
    jmp     .L7                       ; 먼저 검사로
.L8:
    mov     rax, QWORD PTR -8[rbp]
    add     QWORD PTR -16[rbp], rax   ; s += i
    add     QWORD PTR -8[rbp], 1      ; i++
.L7:
    mov     rax, QWORD PTR -8[rbp]
    cmp     rax, QWORD PTR -24[rbp]
    jle     .L8                       ; i &lt;= n 이면 위로
    mov     rax, QWORD PTR -16[rbp]   ; return s
    pop     rbp
    ret</pre>
<table class="kb"><tbody><tr><td><code>if (a &gt; b)</code></td><td><code>cmp</code> 다음에 <b>반대</b> 조건 <code>jle</code> 로 「참일 때 할 일」 을 건너뛰어요. else 쪽 끝에는 <code>jmp</code></td></tr><tr><td><code>for</code></td><td>초기화 → 아래의 검사로 <code>jmp</code> → 몸통 → <code>i++</code> → 검사 <code>cmp</code> + <code>jle</code> 로 위로. 검사를 아래에 두는 게 gcc 의 버릇이에요</td></tr><tr><td><code>.L4</code> · <code>.L7</code></td><td>gcc 가 지은 라벨 이름. 번호는 파일마다 달라요</td></tr></tbody></table>
<p>예제는 이 두 함수를 C 로만 써서 <code>main</code> 에서 불러요. 실행하면 <code>7</code> 과 <code>5050</code>.</p>`,
      example: { label: '예제 코드 — C 만(main.c)', code: `// ==== 파일: main.c ====
#include <stdio.h>

long max(long a, long b) {
    if (a > b)
        return a;
    return b;
}

long sum_to(long n) {
    long s = 0;
    for (long i = 1; i <= n; i++)
        s += i;
    return s;
}

int main(void) {
    printf("%ld\\n", max(3, 7));
    printf("%ld\\n", sum_to(100));
    return 0;
}` } },
    { title: '-O2: 짧아지고, 반복이 사라지기도', html: `<p><code>-O0</code> 을 <code>-O2</code>(최적화 2단계)로 바꾸면 gcc 가 열심히 줄여요. 실제 프로그램은 보통 <code>-O2</code> 로 빌드해요.</p>
<pre class="code">gcc -S -O2 -masm=intel -fno-asynchronous-unwind-tables f.c</pre>
<pre>add:                         max:
    endbr64                      endbr64
    lea     rax, [rdi+rsi]       cmp     rdi, rsi
    ret                          mov     rax, rsi
                                 cmovge  rax, rdi
                                 ret</pre>
<ul><li>스택을 안 써요. 인자는 레지스터에 둔 채로 계산해요 — 우리가 손으로 짠 것과 비슷하죠.</li><li><code>lea rax, [rdi+rsi]</code>: <code>lea</code> 는 주소 계산 모양을 <b>덧셈기</b>로도 써요. 메모리는 안 읽고 <code>rdi + rsi</code> 를 <code>rax</code> 에.</li><li><code>cmovge rax, rdi</code>: 「앞의 비교가 <code>&gt;=</code> 면 mov」. 점프 없는 if 예요.</li></ul>
<p>더 놀라운 건 <b>값이 정해진 계산</b>이에요. <code>main</code> 에서 <code>printf("%ld\\n", sum_to(100));</code> 를 부르는 <code>sum.c</code> 를 <code>-O2</code> 로 보면:</p>
<pre>main:
        endbr64
        sub     rsp, 8
        mov     edx, 5050
        mov     edi, 2
        xor     eax, eax
        lea     rsi, .LC0[rip]
        call    __printf_chk@PLT
        xor     eax, eax
        add     rsp, 8
        ret</pre>
<p><code>sum_to</code> 를 부르지도, 반복하지도 않아요. gcc 가 <b>컴파일할 때</b> 1~100 의 합 5050 을 미리 계산해 숫자로 박아 넣었어요. (우분투의 gcc 는 <code>-O2</code> 에서 <code>printf</code> 를 안전 검사판 <code>__printf_chk</code> 로 바꿔서, 형식이 <code>rsi</code> · 값이 <code>rdx</code> 로 한 칸씩 밀렸어요.) <code>sum_to</code> 함수 자체는 남는데, 두 개씩 더하는 모양으로 바뀌어 읽기 훨씬 어려워요.</p>
<p class="muted small">그래서 「C 가 어떻게 바뀌나」 를 공부할 땐 <code>-O0</code>, 「컴파일러가 얼마나 잘하나」 를 볼 땐 <code>-O2</code>. gdb 로 한 줄씩 볼 프로그램도 <code>-O0</code> 이 편해요.</p>`,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'gcc -S -O2 -masm=intel -fno-asynchronous-unwind-tables f.c\ncat f.s\ngcc -S -O2 -masm=intel -fno-asynchronous-unwind-tables sum.c\ngrep -A 10 "^main:" sum.s' } },
    { title: 'objdump -d -M intel 로 실행 파일 읽기', html: `<p><code>gcc -S</code> 는 C 소스가 있어야 해요. 이미 만들어진 <b>실행 파일</b>은 <code>objdump -d</code>(disassemble, 기계어 → 어셈블리)로 읽어요. [[레슨:R14]] 의 <code>prog</code> 를 열어 봐요.</p>
<pre class="code">objdump -d -M intel prog | less              # 전부(q 로 나가기)
objdump -d -M intel --disassemble=add prog   # add 함수만</pre>
<pre>0000000000401126 &lt;main&gt;:
  401126:   f3 0f 1e fa             endbr64
  40112a:   55                      push   rbp
  40112b:   48 89 e5                mov    rbp,rsp
  40112e:   48 83 ec 10             sub    rsp,0x10
  401132:   be 03 00 00 00          mov    esi,0x3
  401137:   bf 02 00 00 00          mov    edi,0x2
  40113c:   e8 4f 00 00 00          call   401190 &lt;add&gt;
  401141:   48 89 45 f8             mov    QWORD PTR [rbp-0x8],rax
  …
  40115b:   e8 d0 fe ff ff          call   401030 &lt;printf@plt&gt;
  …

0000000000401190 &lt;add&gt;:
  401190:   48 89 f8                mov    rax,rdi
  401193:   48 01 f0                add    rax,rsi
  401196:   c3                      ret</pre>
<table class="kb"><tbody><tr><td>맨 앞 <code>401190:</code></td><td>그 명령이 놓인 주소(16진)</td></tr><tr><td>가운데 <code>48 89 f8</code></td><td>진짜 기계어 바이트([[레슨:R0]] 에서 본 것). <code>--no-show-raw-insn</code> 을 붙이면 안 보여요</td></tr><tr><td>오른쪽</td><td>그 바이트를 다시 읽은 명령</td></tr></tbody></table>
<ul><li><code>&lt;add&gt;</code> 의 세 줄은 우리가 쓴 <code>add.asm</code> 그대로예요. <code>main</code> 의 <code>call 401190 &lt;add&gt;</code> 가 바로 그 주소로 가요.</li><li><code>main</code> 은 gcc 가 <code>-O0</code> 으로 만든 코드라 <code>x</code> 를 <code>[rbp-0x8]</code> 에 저장했다 꺼내요. <code>add(2, 3)</code> 의 <code>long</code> 인자를 <code>mov edi, 0x2</code> 처럼 32비트로 넣는 것도 보여요 — 위 32비트는 저절로 0 이 되니까요([[레슨:R1]]).</li><li>목록 위쪽에는 우리가 안 쓴 <code>_start</code> 도 있어요. [[레슨:R14]] 에서 말한 C 라이브러리의 시작 코드예요.</li><li><code>printf@plt</code>: <code>printf</code> 는 공유 라이브러리(libc) 안에 있어서, 실행할 때 진짜 주소를 찾아 주는 <b>PLT</b> 라는 다리를 거쳐 불러요. gcc 의 기본(PIE)으로 묶으면 NASM 에서도 <code>call printf wrt ..plt</code> 처럼 이 다리를 적어야 해서, 이 교과서는 <code>-no-pie</code> 로 그냥 <code>call printf</code> 를 써요. 이름만 알아 두면 돼요.</li></ul>`,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'objdump -d -M intel prog | less\nobjdump -d -M intel --disassemble=add prog\nobjdump -d -M intel add.o' } },
    { title: 'AT&T 문법 읽기: %rax · $3 · 순서 반대', html: `<p><code>-masm=intel</code> · <code>-M intel</code> 을 빼면 gcc · objdump · gdb 는 <b>AT&amp;T 문법</b>으로 보여 줘요. 리눅스 쪽 자료에 흔하니 읽을 줄은 알아야 해요. 같은 <code>add</code> 를 <code>gcc -S -O0 -fno-asynchronous-unwind-tables add.c</code> 로:</p>
<pre>add:                                  ; 인텔로 쓰면
        endbr64
        pushq   %rbp                  ; push rbp
        movq    %rsp, %rbp            ; mov rbp, rsp
        movq    %rdi, -8(%rbp)        ; mov qword [rbp-8], rdi
        movq    %rsi, -16(%rbp)       ; mov qword [rbp-16], rsi
        movq    -8(%rbp), %rdx        ; mov rdx, [rbp-8]
        movq    -16(%rbp), %rax       ; mov rax, [rbp-16]
        addq    %rdx, %rax            ; add rax, rdx
        popq    %rbp                  ; pop rbp
        ret</pre>
<table class="kb"><tbody><tr><td><b>순서가 반대</b></td><td><code>movq %rdi, -8(%rbp)</code> 는 「주는쪽, 받는쪽」. 인텔은 「받는쪽, 주는쪽」 — 가장 헷갈리는 차이예요</td></tr><tr><td><code>%</code></td><td>레지스터 앞에: <code>%rax</code></td></tr><tr><td><code>$</code></td><td>숫자 앞에: <code>$0x3</code> = 인텔의 <code>3</code>(objdump 의 <code>mov $0x3,%esi</code> = <code>mov esi, 3</code>)</td></tr><tr><td>끝 글자</td><td>크기: <code>q</code> 8바이트 · <code>l</code> 4 · <code>w</code> 2 · <code>b</code> 1(<code>movq</code> = <code>mov qword</code>)</td></tr><tr><td><code>-8(%rbp)</code></td><td>메모리 <code>[rbp-8]</code>. <code>(%rdi,%rax,1)</code> = <code>[rdi+rax*1]</code></td></tr></tbody></table>
<p>gdb 도 처음엔 AT&amp;T 로 보여 줘요. 인텔로 바꾸는 법은 [[레슨:R16]] 에서.</p>`,
      example: { label: '예제 명령 — 우분투 터미널에서', shell: 'gcc -S -O0 -fno-asynchronous-unwind-tables add.c\ncat add.s\nobjdump -d --disassemble=add prog' } },
  ],
  summary: ['gcc -S -masm=intel', '-O2 는 반복도 없앤다', 'objdump -d -M intel 로 실행 파일 읽기'] },
{ id: 'R16', ch: 4, n: 16, title: 'gdb 로 한 줄씩', mode: 'text',
  tutorSummary: 'nasm -f elf64 -g -F dwarf 로 줄 번호 정보, ld 그대로, gdb ./prog. ~/.gdbinit 에 set disassembly-flavor intel. layout asm · layout regs(TUI, Ctrl+X A 로 끄기). break _start · run · stepi(si) · nexti(ni) · continue · info registers rax · p $rax · p/x. 멈춘 줄은 아직 실행 전. 종료 코드는 8진수(exited with code 052 = 42). x/s &msg · x/4cb · x/4xb · x/3i $rip · x/4gx $rsp(_start 에서 argc 1, argv[0] 주소). 폴트: run 하면 SIGSEGV 와 그 줄, bt 로 부른 곳, 그 줄의 레지스터가 주소 같은지(작은 수 · 글자 바이트면 lea 대신 mov 를 쓴 것). C 와 섞으면 gcc -g -no-pie, break add · bt(#1 main at main.c) · finish 후 p $rax.',
  pages: [
    { title: 'nasm -g -F dwarf 와 gdb ./prog', html: `<p>프로그램이 이상하게 돌 때, 레지스터 값을 <b>한 명령씩</b> 직접 보면 금방 찾아요. 그 도구가 <code>gdb</code>(GNU 디버거)예요. 먼저 빌드할 때 「이 기계어는 몇 번째 줄」 표를 같이 넣어요.</p>
<pre class="code">nasm -f elf64 -g -F dwarf step.asm -o step.o    # -g: 디버그 정보, -F dwarf: 그 모양
ld step.o -o step
gdb ./step</pre>
<p><code>(gdb)</code> 가 나오면 gdb 에게 명령을 치는 곳이에요. 나갈 땐 <code>quit</code>(또는 <code>q</code>).</p>
<div class="bk-step-box"><b>처음 한 번: 인텔 문법으로</b><br>gdb 는 기본이 AT&amp;T 문법([[레슨:R15]])이에요. 터미널에서 <code>echo 'set disassembly-flavor intel' &gt;&gt; ~/.gdbinit</code> 한 번이면, 앞으로 gdb 를 켤 때마다 인텔 문법으로 보여 줘요.</div>
<table class="kb"><tbody><tr><td><code>layout asm</code></td><td>화면 위쪽에 명령 목록, 지금 줄에 표시</td></tr><tr><td><code>layout regs</code></td><td>레지스터 창 + 명령 창. <code>stepi</code> 할 때마다 바뀐 레지스터가 강조돼요</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>X</kbd> → <kbd>A</kbd></td><td>창 화면 끄기/켜기(<code>tui disable</code> 도 같음)</td></tr></tbody></table>
<p>이 레슨에서 따라갈 프로그램이에요. 그냥 실행하면 <code>gdb</code> 를 찍고 종료 코드 <code>42</code> 로 끝나요.</p>`,
      example: { label: '예제 코드 — step.asm (./step; echo $?)', echoExit: true, code: `default rel

section .data
msg:    db "gdb", 10
len     equ $ - msg
        db 0                ; x/s 가 여기서 멈추게(write 는 len 만큼만 써요)

section .text
global _start
_start:
    mov rax, 6
    mov rbx, 7
    imul rax, rbx           ; rax = 42
    mov r12, rax            ; 결과를 r12 에 맡겨 둠
    mov rax, 1              ; write(1, msg, len)
    mov rdi, 1
    lea rsi, [msg]
    mov rdx, len
    syscall
    mov rax, 60             ; exit(r12)
    mov rdi, r12
    syscall` } },
    { title: 'break _start · run · stepi', html: `<p><code>break</code> 로 멈출 곳을 정하고 <code>run</code> 으로 시작해요. 그다음 <code>stepi</code> 로 한 명령씩. 우분투에서 실제로 한 화면이에요(주소 · 경로는 컴퓨터마다 달라요).</p>
<pre>(gdb) break _start
Breakpoint 1 at 0x401000: file step.asm, line 11.
(gdb) run
Starting program: /home/me/asm/step

Breakpoint 1, _start () at step.asm:11
11          mov rax, 6
(gdb) info registers rax rbx
rax            0x0                 0
rbx            0x0                 0
(gdb) stepi
12          mov rbx, 7
(gdb) stepi
13          imul rax, rbx           ; rax = 42
(gdb) info registers rax rbx
rax            0x6                 6
rbx            0x7                 7
(gdb) stepi
14          mov r12, rax            ; 결과를 r12 에 맡겨 둠
(gdb) p $rax
$1 = 42
(gdb) p/x $rax
$2 = 0x2a
(gdb) continue
Continuing.
gdb
[Inferior 1 (process 2626) exited with code 052]</pre>
<p>gdb 가 보여 주는 줄은 <b>이제 실행할</b> 줄이에요. 11번 줄에서 멈췄을 땐 아직 <code>mov rax, 6</code> 전이라 <code>rax</code> 가 0 이에요. <code>info registers</code> 는 16진 · 10진을 같이, <code>p $rax</code> 는 10진, <code>p/x</code> 는 16진.</p>
<table class="kb"><tbody><tr><td><code>break _start</code> · <code>b 13</code></td><td>라벨이나 줄 번호에서 멈추기</td></tr><tr><td><code>run</code> · <code>r</code></td><td>처음부터 실행(<code>run &lt; 파일</code> 이면 입력을 그 파일에서)</td></tr><tr><td><code>stepi</code> · <code>si</code></td><td>명령 하나 실행. <code>call</code> 이면 함수 안으로 들어가요</td></tr><tr><td><code>nexti</code> · <code>ni</code></td><td>명령 하나. <code>call</code> 은 통째로 실행하고 다음 줄에서</td></tr><tr><td><code>continue</code> · <code>c</code></td><td>다음 멈출 곳(또는 끝)까지</td></tr><tr><td><code>info registers</code> · <code>i r</code></td><td>레지스터 전부, 뒤에 이름을 쓰면 그것만</td></tr></tbody></table>
<div class="bk-warn"><b>exited with code 052 는 52 가 아니에요</b> — gdb 는 종료 코드를 <b>8진수</b>로 보여 줘요(앞의 0 이 8진 표시). 052 = 5×8 + 2 = 42, <code>echo $?</code> 의 42 와 같아요.</div>`,
      example: { label: '예제 명령 — gdb 안에서', shell: 'gdb ./step\n(gdb) break _start\n(gdb) run\n(gdb) info registers rax rbx\n(gdb) stepi\n(gdb) stepi\n(gdb) info registers rax rbx\n(gdb) stepi\n(gdb) p $rax\n(gdb) continue\n(gdb) quit' } },
    { title: 'x/s &msg · x/4gx $rsp', html: `<p>레지스터 말고 <b>메모리</b>는 <code>x</code>(examine)로 봐요. 모양은 <code>x/개수 형식 크기 주소</code>.</p>
<pre>(gdb) x/s &amp;msg
0x402000 &lt;msg&gt;:  "gdb\\n"
(gdb) x/4cb &amp;msg
0x402000 &lt;msg&gt;:  103 'g'  100 'd'  98 'b'  10 '\\n'
(gdb) x/4xb &amp;msg
0x402000 &lt;msg&gt;:  0x67  0x64  0x62  0x0a
(gdb) x/3i $rip
=&gt; 0x40100e &lt;_start+14&gt;:  mov    r12,rax
   0x401011 &lt;_start+17&gt;:  mov    eax,0x1
   0x401016 &lt;_start+22&gt;:  mov    edi,0x1
(gdb) x/4gx $rsp
0x7fffffffc3d0:  0x0000000000000001  0x00007fffffffcafa
0x7fffffffc3e0:  0x0000000000000000  0x00007fffffffcb62</pre>
<table class="kb"><tbody><tr><td><code>&amp;msg</code></td><td>라벨 <code>msg</code> 의 주소. <code>$rsp</code> · <code>$rdi</code> 처럼 레지스터 값을 주소로 써도 돼요</td></tr><tr><td><code>s</code></td><td>0 바이트까지 문자열로. 그래서 <code>step.asm</code> 은 <code>msg</code> 뒤에 <code>db 0</code> 을 뒀어요(없으면 뒤의 쓰레기도 이어서 보여요)</td></tr><tr><td><code>c</code> · <code>x</code> · <code>d</code></td><td>글자 · 16진 · 10진</td></tr><tr><td><code>b</code> · <code>g</code></td><td>크기: 1바이트 · 8바이트(qword). <code>w</code> 는 4, <code>h</code> 는 2</td></tr><tr><td><code>i</code></td><td>명령으로 읽기. <code>$rip</code> 는 다음에 실행할 명령의 주소</td></tr></tbody></table>
<ul><li><code>x/3i</code> 를 보면 우리가 쓴 <code>mov rax, 1</code> 이 <code>mov eax,0x1</code> 이에요. 결과가 같으니 nasm 이 더 짧은 기계어로 바꿨어요(32비트에 쓰면 위가 0, [[레슨:R1]]).</li><li><code>_start</code> 에서 <code>x/4gx $rsp</code> 는 커널이 스택에 놓아 준 것을 보여 줘요([[레슨:R10]]). 맨 위 <code>1</code> 은 명령줄 낱말 수(argc), 다음은 프로그램 이름 문자열의 주소예요. <code>x/s 0x7fffffffcafa</code> 처럼 그 주소를 그대로 치면 <code>"/home/me/asm/step"</code> 이 보여요. 주소는 컴퓨터마다 달라요.</li></ul>`,
      example: { label: '예제 명령 — gdb 안에서 (_start 에서 멈춘 뒤)', shell: '(gdb) x/s &msg\n(gdb) x/4cb &msg\n(gdb) x/4xb &msg\n(gdb) x/3i $rip\n(gdb) x/4gx $rsp' } },
    { title: '폴트 찾기: run · bt · info registers', html: `<p><code>Segmentation fault (core dumped)</code> 는 어디서 났는지 안 알려 줘요. gdb 에서 그냥 <code>run</code> 하면 <b>폴트 난 그 명령에서</b> 멈춰요. 이 프로그램은 배열 세 칸의 합을 종료 코드로 돌려주려다 죽어요.</p>
<pre class="code">default rel

section .data
nums:   dq 3, 1, 4

section .text
global _start
sum3:                       ; rdi = 배열 주소 → rax = 세 수의 합
    mov rax, [rdi]
    add rax, [rdi + 8]
    add rax, [rdi + 16]
    ret
_start:
    mov rdi, [nums]         ; 배열을 sum3 에게
    call sum3
    mov rdi, rax            ; exit(합)
    mov rax, 60
    syscall</pre>
<pre>(gdb) run
Starting program: /home/me/asm/fault

Program received signal SIGSEGV, Segmentation fault.
sum3 () at fault.asm:9
9           mov rax, [rdi]
(gdb) bt
#0  sum3 () at fault.asm:9
#1  0x0000000000401018 in _start () at fault.asm:15
(gdb) info registers rdi
rdi            0x3                 3</pre>
<p>읽는 순서는 늘 같아요.</p>
<ol><li><b>멈춘 줄</b>: 9번 <code>mov rax, [rdi]</code> — 메모리를 읽다 죽었어요.</li><li><b><code>bt</code>(backtrace)</b>: 누가 불렀나. <code>#0</code> 이 지금 함수, <code>#1</code> 이 그걸 부른 곳(15번 <code>call sum3</code> 바로 뒤).</li><li><b>그 줄의 레지스터</b>: <code>rdi</code> 가 <code>3</code>. 주소라면 <code>0x402000</code> · <code>0x7fff…</code> 같은 큰 수여야 하는데, 3 은 배열의 <b>첫 값</b>이에요.</li></ol>
<p>범인은 14번 줄이에요. <code>mov rdi, [nums]</code> 는 nums 자리의 <b>값</b>을 읽고, 주소를 넘기려면 <code>lea rdi, [nums]</code>([[레슨:R7]])여야 해요. 예제는 고친 코드예요 — 그렇게 고치고 실행하면 종료 코드는 3 + 1 + 4 = 8.</p>
<div class="bk-step-box"><b>레지스터가 이런 모양이면</b><br><code>0x0</code> · 작은 수 → 주소 대신 값이나 빈 레지스터를 넘겼어요. <code>0x6f6c6c6568</code> 처럼 글자 바이트가 늘어선 모양 → 문자열 주소 대신 <b>문자열 내용</b>을 읽어 넣었어요(16진 두 자리씩 아스키 코드).</div>`,
      example: { label: '예제 코드 — 고친 fault.asm (./fault; echo $?)', echoExit: true, code: `default rel

section .data
nums:   dq 3, 1, 4

section .text
global _start
sum3:                       ; rdi = 배열 주소 → rax = 세 수의 합
    mov rax, [rdi]
    add rax, [rdi + 8]
    add rax, [rdi + 16]
    ret
_start:
    lea rdi, [nums]         ; 고침: 값이 아니라 주소를
    call sum3
    mov rdi, rax            ; exit(합)
    mov rax, 60
    syscall` } },
    { title: 'C 와 함께: break add · bt · finish', html: `<p>C 와 섞은 프로그램도 똑같이 봐요. 양쪽 다 <code>-g</code> 를 붙여 빌드해요.</p>
<pre class="code">nasm -f elf64 -g -F dwarf add.asm -o add.o
gcc -g -no-pie main.c add.o -o prog
gdb ./prog</pre>
<p>[[레슨:R14]] 의 <code>main.c</code> + <code>add.asm</code> 이에요. 어셈블리 함수 이름에 <code>break</code> 를 걸면 C 가 그 함수를 부를 때마다 멈춰요.</p>
<pre>(gdb) break add
Breakpoint 1 at 0x401190: file add.asm, line 4.
(gdb) run
Starting program: /home/me/asm/prog
…

Breakpoint 1, add () at add.asm:4
4           mov rax, rdi
(gdb) bt
#0  add () at add.asm:4
#1  0x0000000000401141 in main () at main.c:6
(gdb) info registers rdi rsi
rdi            0x2                 2
rsi            0x3                 3
(gdb) finish
Run till exit from #0  add () at add.asm:4
0x0000000000401141 in main () at main.c:6
6           long x = add(2, 3);
(gdb) p $rax
$1 = 5</pre>
<ul><li><code>bt</code> 의 <code>#1 main () at main.c:6</code>: C 의 6번 줄 <code>long x = add(2, 3);</code> 이 불렀어요. C 와 어셈블리 줄이 한 목록에 같이 나와요.</li><li><code>info registers rdi rsi</code>: C 가 규약대로 2 와 3 을 넣어 줬는지 직접 확인.</li><li><code>finish</code>: 이 함수가 <code>ret</code> 할 때까지 실행하고 부른 쪽에서 멈춰요. 돌려준 값은 <code>p $rax</code>.</li><li><code>continue</code> 하면 다음 <code>add(40, 2)</code> 에서 다시 멈춰요. 멈춤을 지우려면 <code>delete</code>.</li></ul>
<p class="muted small">gdb 안에서 <code>run</code> 하는 프로그램이 <code>printf</code> 로 찍은 글자는 줄바꿈이 나올 때 바로 보이지 않을 수도 있어요(출력을 모아 두었다 찍어서). 프로그램이 끝나면 다 나와요.</p>`,
      example: { label: '예제 명령 — 우분투 터미널 · gdb 안에서', shell: 'nasm -f elf64 -g -F dwarf add.asm -o add.o\ngcc -g -no-pie main.c add.o -o prog\ngdb ./prog\n(gdb) break add\n(gdb) run\n(gdb) bt\n(gdb) info registers rdi rsi\n(gdb) finish\n(gdb) p $rax\n(gdb) continue' } },
  ],
  summary: ['nasm -g -F dwarf 로 빌드', 'stepi 로 한 명령씩', 'info registers · x 로 들여다보기'] },
{ id: 'RB4', ch: 4, boss: true, title: '만들어 보기: C 와 함께 만드는 단어 세기', mode: 'text',
  tutorSummary: '교과서 묶기 — C(main.c)가 fgets 로 stdin 을 한 줄씩 읽고(./wc < words.txt), 어셈블리(count.asm)의 count_words(char *s) 가 단어 수(빈칸 · 줄바꿈 · 탭이 아닌 글자 덩어리, 「단어 안」 표시 레지스터), count_char(char *s, int c) 가 글자 c 의 수(cmp dl, sil)를 세고, C 가 printf 로 줄 · 단어 · e · o 를 출력. gdb 로 break count_char · bt · info registers rsi(0x65 = e) · x/s $rdi · finish · p $rax.', pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
