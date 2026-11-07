// courses/asm/content.js — 「어셈블리어 교과서」 (v2.31.0, 사용자 공용 코스 T10 「x86-64 · NASM · 우분투」 11/6 · 다음 코스 「1」 11/7). 설계: specs/asm-course.md
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 리눅스 교과서에서 만든 우분투 VM(x86-64) 안의 nasm · ld · gcc · gdb.
// 레슨 쪽 example.code = NASM 소스(check_book 이 tools/asm_book_run.py 로 nasm · ld 또는 gcc -no-pie 로 빌드해 실제 실행 — CI 우분투 x86-64) · example.shell = 터미널 명령(안 돌림).
//   여러 파일이면 「; ==== 파일: add.asm ====」 · 「// ==== 파일: main.c ====」 줄로 나눔. example.echoExit: true 면 출력 뒤에 echo $? 의 숫자.
const COURSE = { id: 'asm', name: '어셈블리어', runner: 'none', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 우분투 VM 에서 x86-64 NASM 어셈블리를 가르치는 선생님이다. 명령 하나가 레지스터·메모리를 어떻게 바꾸는지 늘 값으로 보여 주고, gdb 로 확인하게 한다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#6d4c41' },
  { ch: 1, name: '첫 어셈블리 — 레지스터 · 시스템 콜 · 계산', color: '#4f6bed' },
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
<table class="kb"><tbody><tr><td><b>부탁</b></td><td><b>rax</b></td><td><b>rdi</b></td><td><b>rsi</b></td><td><b>rdx</b></td></tr><tr><td>write(쓰기)</td><td><code>1</code></td><td>어디에(1 = 화면)</td><td>글자가 있는 주소</td><td>몇 바이트</td></tr><tr><td>exit(끝내기)</td><td><code>60</code></td><td>종료 코드</td><td>—</td><td>—</td></tr></tbody></table>
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
{ id: 'R3', ch: 1, n: 3, title: '계산: add · sub · imul · idiv', mode: 'text', draft: true,
  tutorSummary: 'add · sub · inc · dec · neg. imul rax, rbx. idiv 는 rdx:rax 를 나눔 — cqo 먼저, 몫 rax 나머지 rdx. 64비트를 넘으면 잘림, 음수는 2의 보수(종료 코드 255 = -1).',
  pages: ASM_TODO('add · sub · inc · dec · imul · idiv(cqo) · 넘침과 2의 보수'), summary: ['add · sub · imul 은 앞 레지스터에 결과', 'idiv 는 cqo 먼저, 몫 rax 나머지 rdx', '음수는 2의 보수'] },
{ id: 'R4', ch: 1, n: 4, title: '비트 연산: and · or · xor · shl · shr', mode: 'text', draft: true,
  tutorSummary: 'and 로 고르기, or 로 켜기, xor 로 뒤집기, xor rax, rax = 0. shl = ×2, shr = ÷2, sar 는 부호 유지. and rax, 1 로 홀짝, xor al, 0x20 으로 대소문자.',
  pages: ASM_TODO('and · or · xor · shl · shr · sar · 홀짝 · 대소문자'), summary: ['and 고르기 · or 켜기 · xor 뒤집기', 'shl ×2 · shr ÷2', 'xor rax, rax 는 0'] },
{ id: 'RB1', ch: 1, boss: true, title: '만들어 보기: 계산 결과 알림', mode: 'text', draft: true,
  tutorSummary: '챕터 1 묶기 — 레지스터 · 계산 · write · exit 로 계산 결과를 종료 코드와 메시지로.', pages: [], summary: [] },
{ id: 'R5', ch: 2, n: 5, title: '비교와 점프: cmp · jmp · je · jl', mode: 'text', draft: true,
  tutorSummary: '라벨과 jmp. cmp a, b 는 빼 보고 플래그(ZF SF CF OF)만 남김. je jne jl jle jg jge(부호 있음), jb ja(부호 없음). if/else 모양.',
  pages: ASM_TODO('라벨과 jmp · cmp 와 플래그 · 조건 점프 표 · if/else 모양'), summary: ['cmp 는 빼 보고 플래그만', 'je · jne · jl · jg 로 갈래', '부호 없으면 jb · ja'] },
{ id: 'R6', ch: 2, n: 6, title: '반복 만들기', mode: 'text', draft: true,
  tutorSummary: '카운터 + dec + jnz, cmp + jl 로 while 모양. 1~n 합, 거듭제곱. loop(rcx) 은 있다는 것만. 끝 조건이 틀리면 안 끝남 → Ctrl+C.',
  pages: ASM_TODO('카운터 반복 · while 모양 · 1~n 합 · loop 명령 · 끝나지 않는 반복'), summary: ['dec + jnz 로 n 번', 'cmp + jl 로 조건 반복', '안 끝나면 Ctrl+C'] },
{ id: 'R7', ch: 2, n: 7, title: '메모리와 주소: [ ]', mode: 'text', draft: true,
  tutorSummary: 'db dw dd dq · .bss 의 resb resq. mov rax, [num] 읽기 · mov [num], rax 쓰기 · byte qword 크기. lea rsi, [msg] 는 주소 자체. default rel.',
  pages: ASM_TODO('db/dq · resb · [이름] 읽고 쓰기 · 크기 · lea · default rel'), summary: ['[이름] 은 그 주소의 값', 'lea 는 주소 자체', '크기는 byte · qword'] },
{ id: 'R8', ch: 2, n: 8, title: '배열과 문자열', mode: 'text', draft: true,
  tutorSummary: 'arr dq 3, 1, 4 와 [arr + rcx*8]. 합 · 최댓값. 문자열은 바이트 배열, 0 으로 끝남, 길이 세기, 한 글자씩 대문자로.',
  pages: ASM_TODO('배열 주소 계산 · 합과 최댓값 · 0 으로 끝나는 문자열 · 글자 바꾸기'), summary: ['[arr + rcx*8] 로 칸', '문자열은 바이트 배열', '0 을 만날 때까지 세기'] },
{ id: 'R9', ch: 2, n: 9, title: '입력 받기: read 시스템 콜', mode: 'text', draft: true,
  tutorSummary: 'read(rax=0), rdi=0 stdin, 버퍼 resb 64, 돌려준 길이 rax. 받은 글자 되돌려 찍기. 글자 숫자 → 정수(빼기 문자 0, × 10), 정수 → 10진 글자(나눗셈 반복, 거꾸로).',
  pages: ASM_TODO('read · 버퍼 · echo · 글자 → 정수 · 정수 → 10진 글자'), summary: ['read 는 rax=0, 받은 길이는 rax', "글자 - '0' 이 숫자", '정수는 10 으로 나눠 거꾸로 글자로'] },
{ id: 'RB2', ch: 2, boss: true, title: '만들어 보기: 숫자를 출력하는 프로그램', mode: 'text', draft: true,
  tutorSummary: '챕터 2 묶기 — 정수를 10진 글자로 바꿔 write, 한 줄 입력을 거꾸로 출력.', pages: [], summary: [] },
{ id: 'R10', ch: 3, n: 10, title: '스택: push · pop · rsp', mode: 'text', draft: true,
  tutorSummary: '스택은 아래로 자라는 메모리, rsp 가 꼭대기. push = sub rsp, 8 + 저장, pop 은 반대. 값 맡기기, 뒤집기.',
  pages: ASM_TODO('스택 그림 · push/pop · rsp · 값 맡기기 · 뒤집기'), summary: ['rsp 가 꼭대기, 아래로 자람', 'push 는 sub rsp, 8 + 저장', '나중에 넣은 것이 먼저 나옴'] },
{ id: 'R11', ch: 3, n: 11, title: '함수: call 과 ret', mode: 'text', draft: true,
  tutorSummary: 'call = 돌아올 주소 push + 점프, ret = pop 해서 점프. 인자는 레지스터, 결과는 rax. 레지스터 지키기 push/pop. 재귀 팩토리얼.',
  pages: ASM_TODO('call · ret · 인자와 결과 · 레지스터 지키기 · 재귀'), summary: ['call 은 돌아올 주소를 push', '결과는 rax', '망가뜨릴 레지스터는 push/pop'] },
{ id: 'R12', ch: 3, n: 12, title: '호출 규약(System V AMD64)', mode: 'text', draft: true,
  tutorSummary: '인자 rdi rsi rdx rcx r8 r9, 결과 rax. 불리는 쪽이 지킬 것 rbx rbp r12~r15. 스택 프레임 push rbp · mov rbp, rsp · sub rsp, 16 · leave. 스택 16바이트 정렬.',
  pages: ASM_TODO('인자 순서 · 지켜야 할 레지스터 · 스택 프레임 · 16바이트 정렬'), summary: ['인자는 rdi rsi rdx rcx r8 r9', 'rbx rbp r12~r15 는 지킨다', 'call 앞 rsp 는 16의 배수'] },
{ id: 'R13', ch: 3, n: 13, title: 'C 라이브러리 부르기: printf', mode: 'text', draft: true,
  tutorSummary: 'extern printf · global main · gcc -no-pie. printf 는 rdi 에 형식, rsi 에 값, xor eax, eax. puts · strlen. main 의 rax 가 종료 코드. 스택 정렬.',
  pages: ASM_TODO('extern · main · gcc -no-pie · printf 인자 · puts · 정렬 경고'), summary: ['extern printf + gcc -no-pie', 'rdi 형식, rsi 값, eax = 0', 'main 에서 push rbp 로 정렬'] },
{ id: 'RB3', ch: 3, boss: true, title: '만들어 보기: 내 함수 모음', mode: 'text', draft: true,
  tutorSummary: '챕터 3 묶기 — print_int · strlen · to_upper · max_of 를 규약대로 만들고 main 에서 부르기.', pages: [], summary: [] },
{ id: 'R14', ch: 4, n: 14, title: 'C 에서 어셈블리 함수 부르기', mode: 'text', draft: true,
  tutorSummary: 'main.c + add.asm, C 선언 long add(long a, long b); asm 은 global add. gcc -no-pie main.c add.o. int = edi, long = rdi, 포인터 = 주소. 배열 · 문자열 넘기기.',
  pages: ASM_TODO('두 파일 · global · 선언 · 타입과 레지스터 크기 · 포인터'), summary: ['C 에서 선언, asm 에서 global', 'int 는 edi, long 은 rdi', '포인터 = 주소'] },
{ id: 'R15', ch: 4, n: 15, title: 'C 가 어떻게 바뀌나: gcc -S · objdump -d', mode: 'text', draft: true,
  tutorSummary: 'gcc -S -O0 -masm=intel 로 C → 어셈블리, if · for · 함수의 모양. -O2 로 바뀌는 것. objdump -d -M intel. AT&T 문법 읽는 법.',
  pages: ASM_TODO('gcc -S · -O0 과 -O2 · objdump -d · AT&T 읽기'), summary: ['gcc -S -masm=intel', '-O2 는 반복도 없앤다', 'objdump -d -M intel 로 실행 파일 읽기'] },
{ id: 'R16', ch: 4, n: 16, title: 'gdb 로 한 줄씩', mode: 'text', draft: true,
  tutorSummary: 'nasm -g -F dwarf, gdb ./prog, layout asm · layout regs, break _start, run, stepi, info registers, x/s · x/4gx $rsp, bt 로 폴트 찾기.',
  pages: ASM_TODO('-g 로 빌드 · break/run/stepi · 레지스터와 메모리 보기 · 폴트 찾기'), summary: ['nasm -g -F dwarf 로 빌드', 'stepi 로 한 명령씩', 'info registers · x 로 들여다보기'] },
{ id: 'RB4', ch: 4, boss: true, title: '만들어 보기: C 와 함께 만드는 단어 세기', mode: 'text', draft: true,
  tutorSummary: '교과서 묶기 — C 가 입력을 읽고 어셈블리 함수가 단어 · 글자를 세고 C 가 출력, gdb 로 들여다보기.', pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
