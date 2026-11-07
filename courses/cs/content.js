// courses/cs/content.js — 「CS 교과서」 (v2.32.0, 사용자 공용 코스 T1 「컴퓨터가 실제로 어떻게 돌아가나 · 운영체제는 맛보기」 · 다음 코스 「1번진행」 11/7). 설계: specs/cs-course.md
// 교과서 모드. 연습은 내 PC 의 VS Code + 파이썬. example.code = 파이썬(check_book 이 python3 로 실제 실행).
const COURSE = { id: 'cs', name: 'CS', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 CS 을 작은 파이썬 코드로 직접 만들어 보며 가르치는 선생님이다. 원리를 말한 뒤 꼭 코드가 찍는 값으로 보여 준다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#3f51b5' },
  { ch: 1, name: '정보를 숫자로', color: '#4f6bed' },
  { ch: 2, name: '회로에서 CPU 까지', color: '#2ea043' },
  { ch: 3, name: '운영체제 맛보기', color: '#d97706' },
  { ch: 4, name: '네트워크', color: '#00897b' },
  { ch: 5, name: '보안 기초', color: '#c62828' },
];
const CS_TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }]; // v2.32.0 뼈대: 아직 안 채운 레슨 — draft:true 라 목차에 「준비 중」
const LESSONS = [
{ id: 'C0', ch: 0, n: 0, title: '컴퓨터는 무엇을 하나', mode: 'text',
  tutorSummary: '컴퓨터가 하는 일은 입력 → 처리 → 저장 → 출력(input · 계산 · 파일 · print). 저장은 메모리(빠르고 끄면 지워짐)와 저장 장치(SSD, 꺼도 남음) 두 가지. 층 그림: 앱 → 파이썬 → 운영체제 → CPU · 메모리 → 회로, 층마다 바로 아래 층만 쓴다(platform.system · os.cpu_count 로 아래 층 물어보기). 모든 건 숫자 — ord("A") 65, chr(66) "B", 색은 세 숫자, 소리는 잰 숫자의 줄. 이 교과서의 길: 숫자 → 회로 · CPU → 운영체제 → 네트워크 → 보안.',
  terms: { 'CPU': '중앙 처리 장치. 명령을 하나씩 아주 빨리 실행해 계산하는 부품', '메모리': 'RAM. 실행 중인 프로그램과 값이 잠깐 머무는 곳. 빠르지만 전원을 끄면 지워진다', '저장 장치': 'SSD · 하드 디스크. 파일이 있는 곳. 메모리보다 느리지만 크고, 전원을 꺼도 남는다', '운영체제': 'Windows · macOS · 리눅스처럼 프로그램들과 하드웨어 사이에서 CPU · 메모리 · 파일 · 화면을 나눠 주는 관리자 프로그램' },
  pages: [
    { title: '입력 → 처리 → 저장 → 출력', html: `<p>컴퓨터가 하는 일은 크게 넷이에요. <b>받고(입력) → 계산하고(처리) → 남기고(저장) → 보여 줘요(출력)</b>. 지금까지 짠 파이썬 코드도 전부 이 넷의 조합이에요.</p>
<table class="kb"><tbody><tr><th>단계</th><th>파이썬에서</th><th>맡는 부품</th></tr>
<tr><td>입력</td><td><code>input()</code></td><td>키보드 · 마우스 · 마이크 · 카메라</td></tr>
<tr><td>처리</td><td><code>+</code> · <code>if</code> · 함수</td><td>[[CPU]]</td></tr>
<tr><td>저장</td><td>변수 · <code>open(…, "w")</code></td><td>[[메모리]](잠깐) · [[저장 장치]](오래)</td></tr>
<tr><td>출력</td><td><code>print()</code></td><td>화면 · 스피커 · 프린터</td></tr></tbody></table>
<pre>name = input("이름: ")              # 입력 — 키보드\ngreeting = "안녕, " + name + "!"    # 처리 — CPU\nwith open("memo.txt", "w", encoding="utf-8") as f:\n    f.write(greeting)                # 저장 — SSD 의 파일\nprint(greeting)                      # 출력 — 화면</pre>
<p><b>저장이 두 가지</b>인 게 중요해요.</p>
<ul><li>변수 <code>greeting</code> 은 메모리에 있어요. 아주 빠르지만, 프로그램이 끝나거나 전원을 끄면 사라져요</li><li><code>memo.txt</code> 는 저장 장치(SSD)에 있어요. 메모리보다 느리지만 크고, 컴퓨터를 꺼도 남아요</li></ul>
<p>그래서 프로그램은 실행할 때 파일을 메모리로 읽어 와서 계산하고, 남길 것만 다시 파일로 써요. 둘이 얼마나 빠르기가 다른지는 [[레슨:C8]] 에서 숫자로 봐요.</p>`,
      example: { code: `name = input("이름: ")
greeting = "안녕, " + name + "!"
with open("memo.txt", "w", encoding="utf-8") as f:
    f.write(greeting)
print(greeting)

with open("memo.txt", encoding="utf-8") as f:
    print("파일에 남은 것:", f.read())`, stdin: '민수' } },
    { title: '층 그림: 앱 → 파이썬 → 운영체제 → CPU', html: `<p><code>print("Hi")</code> 한 줄이 화면에 글자를 띄우기까지 여러 층이 차례로 일을 넘겨요. 층마다 <b>바로 아래 층만</b> 알면 돼요. 파이썬 코드를 짤 때 CPU 회로를 몰라도 되는 이유예요.</p>
<table class="kb"><tbody><tr><th>층</th><th>하는 일</th><th>이 교과서</th></tr>
<tr><td>앱</td><td>내 .py 파일 · 브라우저 · 게임</td><td>지금까지 짠 것</td></tr>
<tr><td>파이썬</td><td>내 코드를 읽고 한 줄씩 실행</td><td>[[레슨:C9]]</td></tr>
<tr><td>[[운영체제]]</td><td>Windows · macOS — 프로그램들에게 CPU · 메모리 · 파일 · 화면을 나눠 줌</td><td>[[레슨:C10]] · [[레슨:C11]]</td></tr>
<tr><td>CPU · 메모리</td><td>명령을 하나씩 실행 · 값을 잠깐 보관</td><td>[[레슨:C7]] · [[레슨:C8]]</td></tr>
<tr><td>회로</td><td>0 과 1 전기 신호를 게이트로 계산</td><td>[[레슨:C5]] · [[레슨:C6]]</td></tr></tbody></table>
<p>이 층들은 컴퓨터 한 대 안의 이야기예요. 다른 컴퓨터와 숫자를 주고받는 <b>네트워크</b>([[레슨:C12]])와, 그 숫자를 지키는 <b>보안</b>([[레슨:C16]])은 그 옆으로 이어져요.</p>
<p>같은 .py 파일이 Windows 에서도 Mac 에서도 돌아가는 건 파이썬과 운영체제가 아래 층의 차이를 가려 주기 때문이에요. 반대로 일부러 아래 층을 물어볼 수도 있어요.</p>
<pre>import os\nimport platform\n\nprint(platform.system())    # 운영체제 이름 — 예: Windows\nprint(platform.release())   # 운영체제 판 — 예: 11\nprint(platform.machine())   # CPU 종류 — 예: AMD64\nprint(os.cpu_count())       # CPU 코어 수 — 예: 8</pre>
<p>이 네 줄은 컴퓨터마다 다르게 나와요. 만들어 보기에서 내 컴퓨터로 찍어 봐요. 아래 예제는 층마다 함수 하나로 흉내 낸 거예요. 위 층이 아래 층 함수를 부르며 일을 넘겨요.</p>`,
      example: { code: `def circuit(bits):
    print("      회로: 전기 신호", bits)

def cpu(n):
    print("    CPU: 숫자", n, "처리")
    circuit(f"{n:08b}")

def operating_system(text):
    print("  운영체제: 화면에", text, "그리기")
    for ch in text:
        cpu(ord(ch))

def python(code):
    print("파이썬:", code, "실행")
    operating_system("Hi")

python('print("Hi")')` } },
    { title: '모든 건 숫자 — ord("A") 는 65', html: `<p>컴퓨터 안에는 0 과 1 뿐이에요. 그래서 글자 · 그림 · 소리 · 프로그램까지 <b>전부 숫자로 바꿔서</b> 담아요. 「무엇을 어떤 숫자로」 규칙만 정하면 돼요.</p>
<pre>print(ord("A"))     # 65 — 글자 → 번호\nprint(chr(66))      # B — 번호 → 글자\nprint(ord("가"))    # 44032\norange = (255, 136, 0)                    # 주황색 = 빨강 · 초록 · 파랑 세 숫자\nsound = [0, 12539, 23170, 30273, 32767]   # 소리 = 1초에 수만 번 잰 높이</pre>
<p><code>ord</code> 는 글자의 번호를, <code>chr</code> 는 번호의 글자를 알려 줘요. 서로 거꾸로예요.</p>
<table class="kb"><tbody><tr><th>무엇</th><th>숫자로 바꾸는 규칙</th><th>레슨</th></tr>
<tr><td>개수 · 크기</td><td>2진수 · 바이트</td><td>[[레슨:C1]]</td></tr>
<tr><td>글자</td><td>ASCII · 유니코드 · UTF-8</td><td>[[레슨:C2]]</td></tr>
<tr><td>음수 · 소수</td><td>2의 보수 · 부동소수점</td><td>[[레슨:C3]]</td></tr>
<tr><td>그림 · 소리</td><td>픽셀의 RGB · 소리 샘플</td><td>[[레슨:C4]]</td></tr>
<tr><td>프로그램</td><td>명령도 숫자 — 장난감 CPU</td><td>[[레슨:C7]]</td></tr></tbody></table>
<p>이 교과서는 이 길을 따라가요: <b>숫자</b>(챕터 1) → 그 숫자를 계산하는 <b>회로와 CPU</b>(챕터 2) → 프로그램들을 관리하는 <b>운영체제</b>(챕터 3) → 숫자를 다른 컴퓨터로 보내는 <b>네트워크</b>(챕터 4) → 숫자를 지키는 <b>보안</b>(챕터 5). 말로만 하지 않고, 작은 파이썬 코드로 <b>직접 흉내 내며</b> 봐요.</p>`,
      example: { code: `word = "Hi 가"
for ch in word:
    print(ch, "→", ord(ch))

secret = [67, 83]
text = ""
for n in secret:
    text += chr(n)
print(text)

b = "가".encode()
print(list(b))` } },
  ],
  summary: ['컴퓨터는 입력 → 처리 → 저장 → 출력, 저장은 메모리(잠깐)와 저장 장치(오래)', '앱 → 파이썬 → 운영체제 → CPU · 메모리 → 회로, 층마다 바로 아래 층만 쓴다', '모든 건 숫자 — ord("A") 는 65, chr(66) 은 "B"'] },
{ id: 'C1', ch: 1, n: 1, title: '비트와 바이트 · 2진수 · 16진수', mode: 'text',
  tutorSummary: '비트 = 0/1 스위치 하나, n비트는 2**n 가지, 8비트 = 1바이트 = 0~255. 2진수 자리 값 1 · 2 · 4 · 8. bin(13) "0b1101", hex(255) "0xff", int("1101", 2), int("ff", 16), f"{n:08b}" · f"{n:02x}". 16진수 1자리 = 4비트, 1바이트 = 16진수 2자리. KB = 1000, KiB = 1024 — 1TB 디스크가 탐색기에서 931GB. bytes([72, 105]) 는 0~255 의 줄(못 바꿈), .hex(" ") · bytes.fromhex, bytearray 는 바꿀 수 있음, 256 이상은 ValueError. 수학은 수학 공간 M1_binary.',
  terms: { '비트': '0 또는 1 하나를 담는 가장 작은 칸. 전기가 흐르나 안 흐르나 스위치 하나', '바이트': '비트 8개 묶음. 0~255(256 가지)를 담는다. 파일 · 메모리 크기를 세는 단위', '16진수': '0~9 와 a~f(10~15)로 세는 수. 1자리가 2진수 4자리라 1바이트를 딱 2자리로 적는다' },
  pages: [
    { title: '비트 · 바이트 — 8비트는 256 가지', html: `<p>컴퓨터 안의 가장 작은 칸은 [[비트]]예요. 전기가 흐르면 1, 안 흐르면 0 — 스위치 하나예요. 하나로는 두 가지(0, 1)뿐이지만 여러 개를 나란히 놓으면 <b>하나 더할 때마다 경우가 두 배</b>가 돼요.</p>
<pre>print(2 ** 1)    # 2 — 0, 1\nprint(2 ** 2)    # 4 — 00, 01, 10, 11\nprint(2 ** 8)    # 256 — 비트 8개\nprint(2 ** 16)   # 65536</pre>
<p>비트 8개를 묶은 것이 [[바이트]]예요. 1바이트는 <code>00000000</code> 부터 <code>11111111</code> 까지, 10진수로 <b>0~255</b>(256 가지)를 담아요. 파일 크기 · 메모리 크기는 다 바이트로 세요.</p>
<p>2진수는 10진수와 세는 법이 같아요. 10진수는 자리 값이 1 · 10 · 100 …(10배씩), 2진수는 자리 값이 1 · 2 · 4 · 8 …(2배씩)이에요. 1 이 있는 자리 값만 더하면 10진수가 돼요.</p>
<pre>2진수     1    0    1    1\n자리 값   8    4    2    1\n          8 +  0 +  2 +  1  = 11</pre>
<p>2진법 · 16진법 자체의 수학(나머지로 바꾸기 · 자리 값)은 <a href="../math/#lesson/M1_binary" target="_blank" rel="noopener">수학 공간 「0과 1로 세기」 ↗</a> 에 자세히 있어요. 이 교과서는 컴퓨터가 그 숫자를 <b>어떻게 담고 쓰는지</b>를 봐요.</p>`,
      example: { code: `for bits in [1, 2, 4, 8, 16, 32]:
    print(bits, "비트 →", 2 ** bits, "가지")

digits = "1011"
total = 0
for i in range(len(digits)):
    place = 2 ** (len(digits) - 1 - i)
    total += int(digits[i]) * place
    print(digits[i], "×", place)
print("=", total)` } },
    { title: 'bin · hex · int("ff", 16)', html: `<p>파이썬은 2진수 · 16진수로 바꾸는 함수를 갖고 있어요.</p>
<pre>print(bin(13))          # 0b1101\nprint(hex(255))         # 0xff\nprint(int("1101", 2))   # 13\nprint(int("ff", 16))    # 255\nprint(0b1101, 0xff)     # 13 255</pre>
<ul><li><code>0b</code> 는 「2진수예요」, <code>0x</code> 는 「16진수예요」 표시. 코드에 <code>0b1101</code> · <code>0xff</code> 처럼 바로 적어도 돼요</li><li><code>int(글자, 2)</code> · <code>int(글자, 16)</code> — 뒤의 숫자가 「몇 진수로 읽을까」 예요</li></ul>
<p>[[16진수]]는 0~9 다음에 a(10) · b · c · d · e · f(15)를 써요. 16 = 2⁴ 라서 <b>2진수 4자리 = 16진수 1자리</b>, 그래서 <b>1바이트 = 16진수 딱 2자리</b>예요. <code>11111111</code> 보다 <code>ff</code> 가 짧고 읽기 쉬워서, 바이트를 보여 줄 때는 거의 늘 16진수를 써요.</p>
<pre>print(f"{13:08b}")   # 00001101 — 8자리 2진수, 빈 앞자리는 0\nprint(f"{10:02x}")   # 0a — 2자리 16진수\nprint(f"{255:X}")    # FF — 대문자 16진수</pre>
<p>f-string 의 <code>:</code> 뒤에 <code>b</code>(2진) · <code>x</code>(16진)를 쓰고, 그 앞 숫자는 자릿수예요. <code>0b</code> · <code>0x</code> 표시 없이 숫자만 나와서 표를 찍기 좋아요.</p>`,
      example: { code: `print("10진  2진수      16진")
for n in [0, 1, 2, 3, 7, 8, 9, 10, 15, 16, 128, 255]:
    print(f"{n:>4}  {n:08b}  {n:02x}")

print(bin(13), hex(255))
print(int("1101", 2), int("ff", 16), int("FF", 16))` } },
    { title: 'KB 는 1000 · KiB 는 1024', html: `<p>바이트가 많아지면 단위를 붙여요. 그런데 단위가 <b>두 가지</b>라 헷갈려요.</p>
<table class="kb"><tbody><tr><th>10진 단위</th><th>바이트</th><th>2진 단위</th><th>바이트</th></tr>
<tr><td>KB(킬로바이트)</td><td>1000</td><td>KiB(키비바이트)</td><td>1024 = 2¹⁰</td></tr>
<tr><td>MB</td><td>1000²</td><td>MiB</td><td>1024² = 2²⁰</td></tr>
<tr><td>GB</td><td>1000³</td><td>GiB</td><td>1024³ = 2³⁰</td></tr>
<tr><td>TB</td><td>1000⁴</td><td>TiB</td><td>1024⁴ = 2⁴⁰</td></tr></tbody></table>
<p>메모리는 2진수 주소로 만들어서 1024 단위가 딱 맞고, 디스크 회사는 1000 단위로 팔아요. Windows 탐색기는 1024 로 나누면서 이름은 「KB · GB」 라고 적어요. 그래서 <b>1TB SSD 가 탐색기에서는 931GB</b> 로 보여요. 없어진 게 아니라 단위가 달라요.</p>
<pre>print(10 ** 12 / 2 ** 30)   # 931.3225746154785</pre>
<ul><li>인터넷 속도는 <b>비트</b>로 세요(소문자 b). 100Mbps = 초당 1억 비트 = 초당 12.5MB(바이트)</li><li>아래 예제의 <code>human(n)</code> 은 1024 로 나눌 수 있는 동안 계속 나누면서 단위를 하나씩 올려요</li></ul>`,
      example: { code: `def human(n):
    units = ["B", "KiB", "MiB", "GiB", "TiB"]
    i = 0
    while n >= 1024 and i < len(units) - 1:
        n = n / 1024
        i += 1
    return f"{n:.1f} {units[i]}"

print(human(500))
print(human(2048))
print(human(5_000_000))
print(human(10 ** 12))
print(100_000_000 / 8 / 1_000_000, "MB/s")` } },
    { title: 'bytes([72, 105]) · bytearray', html: `<p>파이썬에서 바이트를 담는 그릇이 <code>bytes</code> 예요. <b>0~255 숫자의 줄</b>이에요. 앞에 <code>b</code> 를 붙인 글자로 적을 수도 있어요.</p>
<pre>data = bytes([72, 105, 33])\nprint(data)            # b'Hi!'\nprint(list(data))      # [72, 105, 33]\nprint(data[0])         # 72 — 한 칸은 숫자\nprint(data[0:2])       # b'Hi' — 자르면 bytes\nprint(len(data))       # 3\nprint(data.hex(" "))   # 48 69 21</pre>
<ul><li><code>print</code> 는 글자로 읽히는 숫자(32~126)는 글자로, 나머지는 <code>&#92;x</code> + 16진 두 자리로 보여 줘요. <code>bytes([0, 200])</code> 은 <code>b'&#92;x00&#92;xc8'</code>. 속은 그냥 숫자예요</li><li><code>for b in data:</code> 로 돌면 한 칸씩 <b>숫자</b>가 나와요</li><li><code>bytes.fromhex("48 69 21")</code> 은 거꾸로 16진 글자 → bytes</li><li>256 이상은 못 넣어요: <code>bytes([256])</code> 은 <code>ValueError: bytes must be in range(0, 256)</code></li></ul>
<p><code>bytes</code> 는 문자열처럼 <b>못 바꿔요</b>. 한 칸씩 고치거나 붙이려면 <code>bytearray</code> 를 써요.</p>
<pre>buf = bytearray(b"Hi!")\nbuf[0] = 104           # 104 는 h\nbuf.append(63)         # 63 은 ?\nprint(buf)             # bytearray(b'hi!?')\nprint(bytes(buf))      # b'hi!?'</pre>
<p>파일 · 네트워크 · 그림 · 소리는 결국 전부 이런 바이트의 줄이에요. 다음 레슨부터 그 줄을 글자 · 음수 · 색 · 소리로 읽는 규칙을 봐요.</p>`,
      example: { code: `data = bytes([72, 105, 33])
print(data, list(data), data.hex(" "))
for b in data:
    print(b, f"{b:08b}", chr(b))

print(bytes.fromhex("48 69 21"))
print(bytes([0, 200]))
try:
    bytes([256])
except ValueError as e:
    print("ValueError:", e)

buf = bytearray(data)
buf[0] = 104
buf.append(63)
print(buf)` } },
  ],
  summary: ['8비트 = 1바이트 = 0~255, n비트는 2 ** n 가지', 'bin · hex · int("ff", 16) · f"{n:08b}" — 1바이트는 16진수 2자리', 'KB 는 1000, KiB 는 1024 · bytes 는 0~255 숫자의 줄(bytearray 는 고칠 수 있음)'] },
{ id: 'C2', ch: 1, n: 2, title: '글자를 숫자로: ASCII · 유니코드 · UTF-8', mode: 'text',
  tutorSummary: 'ASCII 는 영어 · 숫자 · 기호 128개 표(A 65, a 97, 0 48, 대소문자 32 차이), ord · chr. 유니코드는 세상 모든 글자에 번호(코드 포인트, U+AC00 = 가, f"U+{cp:04X}"), 한글은 가~힣 가나다 순. UTF-8 은 코드 포인트를 1~4바이트로 바꾸는 규칙(0xxxxxxx / 110xxxxx 10xxxxxx / 1110xxxx 10xxxxxx 10xxxxxx / 11110xxx …) — "가".encode() 는 ea b0 80, len 1 vs 3, decode 로 거꾸로. 깨진 글자: utf-8 바이트를 cp949 로 읽으면 깨지고(errors="replace" 는 �), cp949 파일을 utf-8 로 읽으면 UnicodeDecodeError. 깨진 채 저장하면 못 되살림 — 파일은 그대로 두고 encoding 만 바꿔 다시 읽기. 파이썬 교과서 L17B.',
  terms: { 'ASCII': '영어 대소문자 · 숫자 · 기호 · 조종 글자 128개(0~127)에 번호를 붙인 1960년대 미국 표. 7비트', '유니코드': '세상 모든 글자에 번호 하나씩(코드 포인트)을 붙인 표. U+AC00 처럼 16진수로 적는다', 'UTF-8': '유니코드 번호를 1~4바이트로 바꾸는 규칙. 영어는 1바이트(ASCII 그대로), 한글은 3바이트. 지금의 기본', 'cp949': '한국 Windows 의 옛 기본 인코딩. 한글 한 글자를 2바이트로. 엑셀 CSV 가 자주 이걸로 저장된다' },
  pages: [
    { title: 'ord("A") 는 65 — ASCII 표', html: `<p>글자도 숫자로 저장해요. 「A 는 65, B 는 66 …」 처럼 <b>글자마다 번호를 정한 표</b>만 있으면 돼요. 1960년대 미국에서 만든 표가 [[ASCII]](아스키)예요. 영어 대소문자 · 숫자 · 기호 · 띄어쓰기까지 128개(0~127)라 7비트면 충분해요.</p>
<pre>print(ord("A"))       # 65\nprint(ord("a"))       # 97\nprint(ord("0"))       # 48\nprint(ord(" "))       # 32\nprint(chr(66))        # B\nprint(chr(65 + 32))   # a</pre>
<ul><li><code>ord(글자)</code> → 번호, <code>chr(번호)</code> → 글자. 서로 거꾸로예요</li><li>대문자와 소문자는 딱 <b>32</b> 차이예요. 2진수로는 한 비트(<code>0100000</code>)만 달라요</li><li>숫자 글자 <code>"7"</code> 의 번호는 7 이 아니라 55 예요. <code>ord("7") - ord("0")</code> → 7. <code>int("7")</code> 이 속에서 하는 일이 이거예요</li><li>0~31 은 화면에 안 보이는 「조종 글자」 예요. 줄바꿈 <code>"&#92;n"</code> 은 10, 탭 <code>"&#92;t"</code> 은 9</li></ul>
<p>예제는 눈에 보이는 ASCII 글자(32~126)를 16개씩 표로 찍어요. 왼쪽 숫자가 그 줄 첫 글자의 번호예요.</p>`,
      example: { code: `for start in [32, 48, 64, 80, 96, 112]:
    row = []
    for n in range(start, start + 16):
        if n < 127:
            row.append(chr(n))
    print(start, " ".join(row))

print(ord("7") - ord("0"))
print(ord("\\n"), ord("\\t"))` } },
    { title: 'U+AC00 — 유니코드 코드 포인트', html: `<p>ASCII 에는 한글이 없어요. 나라마다 자기 표를 따로 만들다 보니(한국은 [[cp949]], 일본은 Shift-JIS …) 여러 나라 글자를 한 파일에 섞을 수가 없었어요. 그래서 <b>세상 모든 글자에 번호 하나씩</b>을 주기로 한 표가 [[유니코드]]예요. 그 번호를 <b>코드 포인트</b>라고 하고 <code>U+</code> 뒤에 16진수로 적어요.</p>
<pre>cp = ord("가")\nprint(cp)               # 44032\nprint(hex(cp))          # 0xac00\nprint(f"U+{cp:04X}")    # U+AC00\nprint(chr(cp + 1))      # 각\nprint("&#92;uac00")          # 가 — 코드 포인트로 글자 적기</pre>
<table class="kb"><tbody><tr><th>글자</th><th>코드 포인트</th><th>10진</th></tr>
<tr><td>A</td><td>U+0041</td><td>65 — ASCII 와 같은 번호</td></tr>
<tr><td>é</td><td>U+00E9</td><td>233</td></tr>
<tr><td>가</td><td>U+AC00</td><td>44032 — 한글 첫 글자</td></tr>
<tr><td>힣</td><td>U+D7A3</td><td>55203 — 한글 마지막 글자</td></tr>
<tr><td>😀</td><td>U+1F600</td><td>128512</td></tr></tbody></table>
<p>한글 「가」~「힣」 11172 글자는 <b>가나다 순으로 줄지어</b> 번호가 붙어 있어요. 그래서 <code>"가" &lt;= ch &lt;= "힣"</code> 으로 한글인지 알 수 있고, <code>sorted</code> 가 한글을 가나다 순으로 줄 세워요. 유니코드의 자리는 <code>U+10FFFF</code> 까지, 110만 개가 넘어요.</p>
<details class="lp-more"><summary>💡 더 알아보기</summary><p>한글 번호는 식으로 정해져 있어요: (초성 × 21 + 중성) × 28 + 종성 + 44032. 「한」 은 ㅎ(18) · ㅏ(0) · ㄴ(4) 라서 (18 × 21 + 0) × 28 + 4 + 44032 = 54620 = <code>U+D55C</code>.</p></details>`,
      example: { code: `for ch in ["A", "é", "가", "각", "힣", "😀"]:
    cp = ord(ch)
    print(ch, f"U+{cp:04X}", cp)

print("가" <= "한" <= "힣", "가" <= "A" <= "힣")
print(sorted(["다", "가", "나"]))
print("\\uac00\\ud55c")` } },
    { title: '"가".encode() · UTF-8 은 1~4바이트', html: `<p>코드 포인트는 번호일 뿐이에요. 파일에 저장하거나 네트워크로 보내려면 <b>바이트</b>로 바꿔야 해요. 번호를 바이트로 바꾸는 규칙을 인코딩이라고 하고, 지금 거의 모든 곳(웹 · VS Code · 파이썬 소스 파일)의 기본이 [[UTF-8]]이에요.</p>
<pre>b = "가".encode()         # 괄호를 비우면 "utf-8"\nprint(b)                  # b'&#92;xea&#92;xb0&#92;x80'\nprint(b.hex(" "))         # ea b0 80\nprint(len("가"), len(b))  # 1 3 — 글자 1개, 바이트 3개\nprint(b.decode())         # 가 — 바이트 → 글자</pre>
<p>UTF-8 은 번호 크기에 따라 <b>1~4바이트</b>를 써요. 첫 바이트의 앞쪽 비트가 「나까지 몇 바이트짜리야」 를 알려 주고, 이어지는 바이트는 늘 <code>10</code> 으로 시작해요.</p>
<table class="kb"><tbody><tr><th>코드 포인트</th><th>바이트</th><th>비트 모양(x 에 번호를 채움)</th></tr>
<tr><td>U+0000 ~ U+007F</td><td>1</td><td><code>0xxxxxxx</code> — ASCII 와 똑같음</td></tr>
<tr><td>U+0080 ~ U+07FF</td><td>2</td><td><code>110xxxxx 10xxxxxx</code></td></tr>
<tr><td>U+0800 ~ U+FFFF</td><td>3</td><td><code>1110xxxx 10xxxxxx 10xxxxxx</code> — 한글</td></tr>
<tr><td>U+10000 ~ U+10FFFF</td><td>4</td><td><code>11110xxx 10xxxxxx 10xxxxxx 10xxxxxx</code> — 이모지</td></tr></tbody></table>
<p>「가」(U+AC00)를 손으로 바꿔 봐요. 3바이트 칸이라 x 자리가 4 + 6 + 6 = 16개예요. 번호를 16자리 2진수로 적고 4 · 6 · 6 자리로 잘라 앞에 <code>1110</code> · <code>10</code> · <code>10</code> 을 붙여요.</p>
<pre>cp = ord("가")\nbits = f"{cp:016b}"\nprint(bits)                    # 1010110000000000\nparts = ["1110" + bits[:4], "10" + bits[4:10], "10" + bits[10:]]\nprint(parts)                   # ['11101010', '10110000', '10000000']\nfor p in parts:\n    print(f"{int(p, 2):02x}")  # ea, b0, 80</pre>
<p>규칙대로 만든 <code>ea b0 80</code> 이 <code>"가".encode()</code> 와 똑같아요. 영어는 1바이트 그대로라 <b>ASCII 파일은 그대로 UTF-8 파일</b>이기도 해요. 옛 파일과 잘 맞아서 UTF-8 이 널리 퍼졌어요.</p>`,
      example: { code: `for ch in ["A", "é", "가", "😀"]:
    b = ch.encode()
    print(ch, len(b), "바이트", b.hex(" "))

cp = ord("가")
bits = f"{cp:016b}"
parts = ["1110" + bits[:4], "10" + bits[4:10], "10" + bits[10:]]
print(parts)
mine = bytes([int(p, 2) for p in parts])
print(mine, mine == "가".encode())
print(mine.decode())` } },
    { title: '깨진 글자 — utf-8 을 cp949 로 읽으면', html: `<p>같은 바이트도 <b>어떤 규칙으로 읽느냐</b>에 따라 다른 글자가 돼요. 쓴 규칙과 읽는 규칙이 다르면 글자가 깨져요. 한국 Windows 의 옛 기본 규칙이 [[cp949]](한글 한 글자 2바이트)라서 자주 만나요.</p>
<pre>data = "안녕".encode("utf-8")\nprint(data.hex(" "))                            # ec 95 88 eb 85 95\nprint(data.decode("cp949", errors="replace"))   # �븞�뀞\nprint(data.decode("utf-8"))                     # 안녕</pre>
<ul><li>cp949 는 「두 바이트씩 한 글자」 로 끊어 읽어서 엉뚱한 글자와 <code>�</code>(못 읽은 자리)가 나와요</li><li><code>errors="replace"</code> 가 없으면 <code>UnicodeDecodeError</code> 로 멈춰요</li></ul>
<p>반대도 있어요. 엑셀이 만든 CSV 는 cp949 로 저장되는 일이 많아서, UTF-8 로 읽으면 첫 바이트부터 멈춰요. 파일을 <code>"rb"</code> 로 열면 글자로 바꾸지 않은 <b>바이트 그대로</b>를 읽을 수 있어요.</p>
<pre>excel = "이름,점수".encode("cp949")\nwith open("scores.csv", "wb") as f:\n    f.write(excel)\nwith open("scores.csv", "rb") as f:\n    data = f.read()          # 바이트 그대로\nprint(data.hex(" "))         # c0 cc b8 a7 2c c1 a1 bc f6\nprint(data.decode("cp949"))  # 이름,점수 — 맞는 규칙이면 멀쩡</pre>
<div class="bk-warn"><b>깨진 글자를 저장하면 못 되살려요</b> — 화면의 <code>�</code> 는 「못 읽은 바이트를 버렸다」 는 뜻이에요. 깨진 채로 다시 저장하면 원래 바이트가 사라져요. 깨져 보이면 <b>파일은 그대로 두고, 읽는 규칙(encoding)만 바꿔서</b> 다시 열어요.</div>
<p>파이썬에서 파일을 열 때 늘 <code>encoding="utf-8"</code> 을 적는 이유가 이거예요. Windows 의 기본이 cp949 라 빼먹으면 Windows 에서만 깨져요. 자세한 함정은 <a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩 · JSON」 ↗</a> 에 있어요.</p>`,
      example: { code: `data = "안녕".encode("utf-8")
print(data.hex(" "))
print(data.decode("cp949", errors="replace"))

excel = "이름,점수".encode("cp949")
with open("scores.csv", "wb") as f:
    f.write(excel)
with open("scores.csv", "rb") as f:
    raw = f.read()
try:
    print(raw.decode("utf-8"))
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", e)
print(raw.decode("cp949"))

for enc in ["utf-8", "cp949"]:
    b = "안녕".encode(enc)
    print(enc, len(b), "바이트")` } },
  ],
  summary: ['ord · chr 로 글자 ↔ 번호, ASCII 는 128개 · 유니코드는 모든 글자(U+AC00 = 가)', 'UTF-8 은 글자마다 1~4바이트 — "가".encode() 는 ea b0 80', '깨진 글자는 쓴 규칙과 읽은 규칙이 달라서 — 파일은 두고 encoding 만 바꿔 읽기'] },
{ id: 'C3', ch: 1, n: 3, title: '음수와 소수', mode: 'text',
  tutorSummary: '8비트 음수는 2의 보수: -n 은 256 - n(= -n % 256), 비트를 뒤집고 1 더하기, 맨 앞 비트 1 = 음수, -128~127, 덧셈 회로 그대로 뺄셈. n.to_bytes(1, "big", signed=True) · int.from_bytes(…, signed=True), 칸을 넘으면 넘침(127 + 1 → -128). 0.1 + 0.2 는 0.30000000000000004 — 0.1 은 2진수로 끝없는 수라 잘려 담김, math.isclose · round. float 는 64비트 IEEE 754: 부호 1 · 지수 11(+1023) · 가수 52, struct.pack(">d", x) 로 비트 보기, -6.25 = -1.5625 × 2². 돈은 가장 작은 단위의 정수(원 · 센트)나 Decimal("0.1")(글자로!), quantize(ROUND_HALF_UP). 수학은 수학 공간 M1_float.',
  terms: { '2의 보수': '음수를 비트로 적는 방법. 8비트에서 -n 은 256 - n. 비트를 모두 뒤집고 1 을 더해도 같다. 덧셈 회로로 뺄셈까지 할 수 있다', '넘침': '정해진 비트 칸보다 큰 값이 되어 넘친 자리가 버려지는 것. 8비트 부호 있는 수에서 127 + 1 이 -128 이 된다(overflow)', '부동소수점': '소수를 「1.xxx × 2^지수」 모양으로 담는 방법. 파이썬 float 는 64비트(부호 1 · 지수 11 · 가수 52)' },
  pages: [
    { title: '음수는 2의 보수 · signed=True', html: `<p>바이트 하나는 0~255 예요. 음수는 어떻게 담을까요? 컴퓨터는 [[2의 보수]]라는 방법을 써요. 8비트에서 <b>-n 은 256 - n</b> 으로 적어요.</p>
<pre>print(256 - 1)             # 255 — -1 은 11111111\nprint(f"{256 - 5:08b}")    # 11111011 — -5\nprint(f"{-5 % 256:08b}")   # 11111011 — % 256 도 같은 일</pre>
<table class="kb"><tbody><tr><th>비트</th><th>부호 없이(0~255)</th><th>2의 보수(-128~127)</th></tr>
<tr><td><code>00000000</code></td><td>0</td><td>0</td></tr>
<tr><td><code>00000001</code></td><td>1</td><td>1</td></tr>
<tr><td><code>01111111</code></td><td>127</td><td>127 — 가장 큰 수</td></tr>
<tr><td><code>10000000</code></td><td>128</td><td>-128 — 가장 작은 수</td></tr>
<tr><td><code>11111011</code></td><td>251</td><td>-5</td></tr>
<tr><td><code>11111111</code></td><td>255</td><td>-1</td></tr></tbody></table>
<ul><li>맨 앞 비트가 1 이면 음수예요</li><li>손으로 바꾸는 법: <b>비트를 모두 뒤집고 1 을 더해요</b>. 5 = <code>00000101</code> → 뒤집기 <code>11111010</code> → +1 → <code>11111011</code></li><li>좋은 점: 음수도 <b>보통 덧셈 그대로</b> 더해요. <code>00000101</code>(5) + <code>11111011</code>(-5) = <code>1 00000000</code> → 넘친 9번째 비트를 버리면 0. 그래서 CPU 는 뺄셈 회로를 따로 안 만들고 덧셈기로 빼요([[레슨:C6]])</li></ul>
<p>파이썬은 <code>to_bytes</code> · <code>int.from_bytes</code> 에 <code>signed=True</code> 를 주면 2의 보수로 바꿔요. <code>"big"</code> 은 큰 자리 바이트부터 적는 순서예요(1바이트면 상관없어요).</p>
<pre>print((-5).to_bytes(1, "big", signed=True))            # b'&#92;xfb'\nprint(int.from_bytes(b"&#92;xfb", "big", signed=True))   # -5\nprint(int.from_bytes(b"&#92;xfb", "big"))                # 251 — signed 가 없으면</pre>
<p>파이썬의 int 는 크기 제한이 없지만, 파일 · 네트워크 · CPU 안에서는 8 · 16 · 32 · 64비트처럼 칸이 정해져 있어요. 칸을 넘으면 [[넘침]]이 생겨요. 8비트에서 127 + 1 은 128 이 아니라 -128 이 돼요.</p>`,
      example: { code: `for n in [0, 1, 5, 127, -1, -5, -128]:
    b = n.to_bytes(1, "big", signed=True)
    print(f"{n:>5}  {b[0]:08b}  {b.hex()}")

try:
    (128).to_bytes(1, "big", signed=True)
except OverflowError as e:
    print("OverflowError:", e)

x = 127
raw = bytes([(x + 1) % 256])
print(x, "+ 1 =", int.from_bytes(raw, "big", signed=True))` } },
    { title: '0.1 + 0.2 == 0.3 은 False', html: `<pre>print(0.1 + 0.2)          # 0.30000000000000004\nprint(0.1 + 0.2 == 0.3)   # False\nprint(f"{0.1:.20f}")      # 0.10000000000000000555</pre>
<p>10진수로 1/3 을 적으면 0.3333… 끝이 없죠. 2진수에서는 <b>0.1 이 그래요</b>. 0.0001100110011… 이 끝없이 이어져요. 컴퓨터는 정해진 칸(64비트)에서 잘라 담으니, 0.1 은 사실 「0.1 에 아주 가까운 수」 예요. 그런 수끼리 더하면 작은 오차가 드러나요.</p>
<ul><li>2진수로 딱 떨어지는 수(0.5 · 0.25 · 0.75 …, 분모가 2 · 4 · 8 …)는 오차가 없어요. <code>0.5 + 0.25 == 0.75</code> 는 True</li><li>그래서 float 는 <code>==</code> 대신 「충분히 가까운가」 로 비교해요: <code>math.isclose(0.1 + 0.2, 0.3)</code> 은 True</li><li>보여 줄 때는 반올림해요: <code>round(0.1 + 0.2, 2)</code> 는 0.3</li></ul>
<p>예제의 아래쪽은 0.1 을 2진 소수로 바꿔요. 2를 곱해서 1 을 넘으면 그 자리가 1 이에요(10진 소수를 10 곱해 가며 한 자리씩 꺼내는 것과 같아요). <code>0011</code> 이 끝없이 되풀이돼요.</p>
<p>왜 끝이 없는지, float 점들이 얼마나 촘촘한지는 <a href="../math/#lesson/M1_float" target="_blank" rel="noopener">수학 공간 「컴퓨터가 소수를 못 담는 이유」 ↗</a> 에서 그림으로 볼 수 있어요.</p>`,
      example: { code: `import math

print(0.1 + 0.2, 0.1 + 0.2 == 0.3)
print(f"{0.1:.20f}")
print(0.5 + 0.25 == 0.75)
print(math.isclose(0.1 + 0.2, 0.3), round(0.1 + 0.2, 2))

total = 0
for i in range(10):
    total += 0.1
print("0.1 을 10번:", total)

x = 0.1
digits = ""
for i in range(24):
    x = x * 2
    if x >= 1:
        digits += "1"
        x = x - 1
    else:
        digits += "0"
print("0.1 = 0." + digits + "…(2진)")` } },
    { title: 'struct.pack 으로 float 비트 보기', html: `<p>파이썬의 float 는 64비트 [[부동소수점]](IEEE 754 라는 국제 규칙)이에요. 10진수의 「1.5 × 10³」 처럼, <b>2진수로 「1.xxx × 2^지수」</b> 모양으로 담아요. 64칸을 셋으로 나눠 써요.</p>
<table class="kb"><tbody><tr><th>칸</th><th>비트 수</th><th>담는 것</th></tr>
<tr><td>부호</td><td>1</td><td>0 = 양수, 1 = 음수</td></tr>
<tr><td>지수</td><td>11</td><td>지수 + 1023 (음수 지수도 담으려고 1023 을 더해 둠)</td></tr>
<tr><td>가수</td><td>52</td><td>「1.」 뒤의 2진 숫자들</td></tr></tbody></table>
<p><code>struct.pack("&gt;d", x)</code> 는 float 를 그 8바이트로 바꿔 줘요. <code>d</code> 는 64비트 float, <code>&gt;</code> 는 큰 자리부터예요. 그 바이트를 정수로 읽어 64자리 2진수로 찍으면 칸이 보여요.</p>
<pre>import struct\n\nraw = struct.pack("&gt;d", -6.25)\nprint(raw.hex())        # c019000000000000\nn = int.from_bytes(raw, "big")\nbits = f"{n:064b}"\nprint(bits[0], bits[1:12], bits[12:20])   # 1 10000000001 10010000</pre>
<table class="kb"><tbody><tr><th>칸</th><th>비트</th><th>뜻</th></tr>
<tr><td>부호</td><td><code>1</code></td><td>음수</td></tr>
<tr><td>지수</td><td><code>10000000001</code> = 1025</td><td>1025 - 1023 = 2 → × 2²</td></tr>
<tr><td>가수</td><td><code>1001000…</code></td><td>1.1001(2진) = 1 + 1/2 + 1/16 = 1.5625</td></tr></tbody></table>
<p>모으면 -1 × 1.5625 × 4 = <b>-6.25</b>. 가수가 52비트뿐이라 10진수로 15~16자리까지만 정확해요. 그보다 긴 수는 잘려요. <code>0.1 + 0.2</code> 의 오차가 17번째 자리에 나온 이유예요.</p>
<pre>print(2 ** 53 + 1.0)   # 9007199254740992.0 — 더한 1 이 사라졌어요</pre>`,
      example: { code: `import struct

def float_bits(x):
    raw = struct.pack(">d", x)
    n = int.from_bytes(raw, "big")
    bits = f"{n:064b}"
    return bits[0], bits[1:12], bits[12:]

for x in [1.0, -6.25, 0.1]:
    s, e, m = float_bits(x)
    print(x, "부호", s, "지수", e, "=", int(e, 2) - 1023, "가수", m[:12] + "…")

print(2 ** 53 + 1.0)` } },
    { title: '돈은 정수(원) · Decimal("0.1")', html: `<p>돈 계산에서 0.30000000000000004 는 곤란해요. 방법이 두 가지 있어요.</p>
<ol><li><b>가장 작은 단위의 정수로</b> 세요. 원은 원래 정수, 달러는 센트(1/100 달러)로. 정수 덧셈에는 오차가 없어요</li><li><b><code>decimal</code> 모듈</b>로 10진수 그대로 계산해요. 꼭 <b>글자로</b> 만들어요. <code>Decimal(0.1)</code> 은 이미 틀린 float 를 그대로 옮겨 와요</li></ol>
<pre>from decimal import Decimal\n\nprint(Decimal("0.1") + Decimal("0.2"))   # 0.3\nprint(Decimal("0.1") + Decimal("0.2") == Decimal("0.3"))   # True\nprint(Decimal(0.1))   # 0.1000000000000000055511151231257827021181583404541015625</pre>
<pre>prices = [19.99, 5.01, 0.1, 0.2]   # 달러\nprint(sum(prices))                 # 25.299999999999997\ncents = [1999, 501, 10, 20]        # 센트\ntotal = sum(cents)\nprint(total // 100, total % 100)   # 25 30 — 25달러 30센트</pre>
<ul><li>나누기 · 이자처럼 가장 작은 단위 밑으로 떨어지면 <b>언제 · 어떻게 반올림할지</b>를 정해야 해요. <code>quantize(Decimal("1"), rounding=ROUND_HALF_UP)</code> 는 「1 의 자리까지, 5 이상 올림」</li><li>파이썬의 <code>round(2.5)</code> 는 3 이 아니라 2 예요(짝수 쪽으로). 돈은 규칙을 직접 정하는 quantize 가 안전해요</li><li>float 는 과학 계산 · 그래픽 · 게임처럼 「아주 조금 틀려도 되고 빨라야 하는」 곳에 써요</li></ul>`,
      example: { code: `from decimal import Decimal, ROUND_HALF_UP

prices = [19.99, 5.01, 0.1, 0.2]
print("float:", sum(prices))

cents = [1999, 501, 10, 20]
total = sum(cents)
print("센트:", total, "→", total // 100, "달러", total % 100, "센트")

d = [Decimal("19.99"), Decimal("5.01"), Decimal("0.1"), Decimal("0.2")]
print("Decimal:", sum(d))

each = Decimal("10000") / 3
print("1만 원을 셋이:", each)
won = each.quantize(Decimal("1"), rounding=ROUND_HALF_UP)
print("원 단위로:", won)
print(round(2.5), round(3.5))` } },
  ],
  summary: ['음수는 2의 보수 — 8비트에서 -n 은 256 - n, signed=True', '0.1 + 0.2 는 딱 0.3 이 아님 — float 는 부호 · 지수 · 가수 64비트', '돈은 정수(원 · 센트)나 Decimal("글자")'] },
{ id: 'C4', ch: 1, n: 4, title: '그림과 소리도 숫자', mode: 'text',
  tutorSummary: '픽셀 = 빨강 · 초록 · 파랑 세 숫자(0~255, 3바이트), 색 코드 "#ff8800" 은 16진 두 자리씩(int(code[1:3], 16)), 밝기 = 0.299R + 0.587G + 0.114B. 이미지 용량 = 가로 × 세로 × 3바이트(1920×1080 은 약 5.9MiB), 압축: 무손실(PNG · zip — 되풀이 줄이기, RLE, zlib)과 손실(JPG · MP3). 흑백 그림 = 밝기 숫자의 2차원 리스트 img[y][x], 밝기를 글자 " .:-=+*#%@" 로 찍기. 소리 = 1초에 44100 번 잰 16비트 숫자(샘플링 빈도 · 비트 깊이), math.sin 으로 440Hz, wave 모듈로 .wav 저장(머리말 44바이트 + 샘플 × 2바이트), to_bytes(2, "little", signed=True).',
  terms: { '픽셀': '화면 · 그림을 이루는 아주 작은 점 하나. 보통 빨강 · 초록 · 파랑 세 숫자(각 0~255)로 색을 정한다', '압축': '같은 내용을 더 적은 바이트로 적는 것. 풀면 똑같아지는 무손실(PNG · zip)과, 덜 중요한 부분을 버리는 손실(JPG · MP3)이 있다', 'RLE': '같은 값이 몇 번 이어지는지 세어 적는 가장 쉬운 압축(run-length encoding). 흰 점 12개 → (흰, 12)', '샘플': '소리의 높이(공기 압력)를 한 번 잰 숫자. 1초에 몇 번 재나가 샘플링 빈도, 몇 비트로 적나가 비트 깊이' },
  pages: [
    { title: '픽셀 = RGB · "#ff8800"', html: `<p>화면은 아주 작은 점, [[픽셀]]이 바둑판처럼 모인 거예요. 픽셀 하나는 빛의 세 가지 색 <b>빨강(R) · 초록(G) · 파랑(B)</b> 을 얼마나 켤지 0~255 숫자 셋으로 정해요. 한 색에 1바이트씩, 픽셀 하나에 3바이트예요.</p>
<table class="kb"><tbody><tr><th>색</th><th>(R, G, B)</th><th>색 코드</th></tr>
<tr><td>검정</td><td>(0, 0, 0)</td><td><code>#000000</code> — 다 끔</td></tr>
<tr><td>흰색</td><td>(255, 255, 255)</td><td><code>#ffffff</code> — 다 켬</td></tr>
<tr><td>빨강</td><td>(255, 0, 0)</td><td><code>#ff0000</code></td></tr>
<tr><td>주황</td><td>(255, 136, 0)</td><td><code>#ff8800</code></td></tr>
<tr><td>회색</td><td>(128, 128, 128)</td><td><code>#808080</code> — 셋이 같으면 회색</td></tr></tbody></table>
<p>웹 · 그림 프로그램의 색 코드 <code>#ff8800</code> 은 세 바이트를 16진수 두 자리씩 붙여 쓴 거예요([[레슨:C1]]).</p>
<pre>code = "#ff8800"\nr = int(code[1:3], 16)\ng = int(code[3:5], 16)\nb = int(code[5:7], 16)\nprint(r, g, b)                      # 255 136 0\nprint(f"#{r:02x}{g:02x}{b:02x}")    # #ff8800</pre>
<p>빛이라서 셋 다 켜면 흰색이에요(물감과 반대). 사람 눈은 초록을 가장 밝게 느껴서, 색을 <b>밝기 하나</b>로 줄일 때는 <code>0.299 × R + 0.587 × G + 0.114 × B</code> 로 섞어요. 흑백 사진이 이렇게 만들어져요.</p>`,
      example: { code: `colors = {"검정": "#000000", "흰색": "#ffffff", "주황": "#ff8800", "하늘": "#87ceeb"}
for name, code in colors.items():
    r = int(code[1:3], 16)
    g = int(code[3:5], 16)
    b = int(code[5:7], 16)
    gray = round(0.299 * r + 0.587 * g + 0.114 * b)
    print(name, code, (r, g, b), "밝기", gray)

r, g, b = 255, 136, 0
print(f"#{r:02x}{g:02x}{b:02x}")` } },
    { title: '가로 × 세로 × 3 — 이미지 용량 · 압축', html: `<pre>w, h = 1920, 1080\nsize = w * h * 3\nprint(size)                       # 6220800\nprint(round(size / 2 ** 20, 1))   # 5.9 — MiB</pre>
<p>Full HD 화면 한 장이 약 6MB 예요. 1초에 60장이면 356MiB, 2시간 영화면 2.4TiB 가 넘어요. 휴대폰 사진(4000 × 3000)은 한 장에 34MiB 인데 실제 jpg 파일은 3~5MB 쯤이죠. <b>[[압축]]</b> 덕분이에요.</p>
<ul><li><b>무손실 압축</b>(PNG · zip): 되풀이를 줄여 적어요. 흰 점 1000개를 「흰색 × 1000」 으로. 풀면 원래와 <b>똑같아요</b>. 글 · 프로그램 · 스크린숏에 써요</li><li><b>손실 압축</b>(JPG · MP3 · 동영상): 사람 눈 · 귀가 잘 못 느끼는 부분을 버려요. 훨씬 작아지지만 원래대로 못 돌아가요. 사진 · 음악 · 영상에 써요</li></ul>
<p>되풀이 줄이기의 가장 쉬운 꼴이 같은 값이 몇 번 이어지나 세기, [[RLE]]예요. 파이썬에 든 <code>zlib</code>(zip · PNG 가 쓰는 방식)으로 진짜 압축도 해 볼 수 있어요. 같은 값만 이어진 흰 그림은 아주 작아지고, <code>zlib.decompress</code> 로 풀면 원래와 똑같아요.</p>`,
      example: { code: `import zlib

row = [255] * 12 + [0] * 3 + [255] * 5
runs = []
for v in row:
    if runs and runs[-1][0] == v:
        runs[-1][1] += 1
    else:
        runs.append([v, 1])
print(len(row), "칸 →", runs)

white = bytes([255, 255, 255]) * 10000
small = zlib.compress(white)
print("흰 픽셀 1만 개:", len(white), "→", len(small), "바이트")
print("풀면 똑같나:", zlib.decompress(small) == white)

w, h = 4000, 3000
print("휴대폰 사진:", w * h * 3, "바이트 =", round(w * h * 3 / 2 ** 20, 1), "MiB")` } },
    { title: '흑백 그림 = 숫자 표 img[y][x]', html: `<p>흑백 그림은 픽셀마다 밝기 숫자 하나(0 = 검정 ~ 255 = 흰색)예요. 그러니 그림은 그냥 <b>숫자 표</b>, 파이썬으로는 리스트의 리스트예요.</p>
<pre>img = [\n    [0, 0, 255, 0, 0],\n    [0, 255, 255, 255, 0],\n    [255, 255, 255, 255, 255],\n]\nprint(len(img[0]), "×", len(img))   # 5 × 3 — 가로 × 세로\nprint(img[1][2])                    # 255 — 1번 줄의 2번 칸</pre>
<ul><li>좌표는 <code>img[y][x]</code> — 줄(세로 위치)이 먼저, 칸(가로 위치)이 나중이에요</li><li>그림 프로그램 대부분이 <b>왼쪽 위가 (0, 0)</b> 이고, 아래로 갈수록 y 가 커져요(수학 그래프와 반대)</li><li>색 그림은 칸마다 숫자 하나 대신 <code>(R, G, B)</code> 세 개가 들어 있어요</li></ul>
<p>밝기를 글자로 바꿔 찍으면 터미널에서 그림이 보여요. 비어 보이는 글자부터 꽉 찬 글자까지 늘어놓은 줄 <code>" .:-=+*#%@"</code>(10글자)에서, 밝기 0~255 를 0~9 번 글자로 골라요: <code>chars[v * 9 // 255]</code>. 어두운 바탕의 터미널에서는 밝은 곳이 꽉 찬 글자로 보여요.</p>`,
      example: { code: `img = [
    [0,   0,   200, 200, 200, 200, 0,   0],
    [0,   200, 0,   0,   0,   0,   200, 0],
    [200, 0,   255, 0,   0,   255, 0,   200],
    [200, 0,   0,   0,   0,   0,   0,   200],
    [200, 0,   255, 0,   0,   255, 0,   200],
    [200, 0,   0,   255, 255, 0,   0,   200],
    [0,   200, 0,   0,   0,   0,   200, 0],
    [0,   0,   200, 200, 200, 200, 0,   0],
]
chars = " .:-=+*#%@"
for row in img:
    line = ""
    for v in row:
        line += chars[v * 9 // 255] * 2
    print(line)

print("0번 ~ 9번 글자:", repr(chars))` } },
    { title: 'wave 로 1초 삐 — 샘플링 · 비트 깊이', html: `<p>소리는 공기가 떨리는 거예요. 마이크는 그 떨림(공기 압력)을 <b>1초에 수만 번 재서 숫자로</b> 적어요. 한 번 잰 값이 [[샘플]], 1초에 몇 번 재나가 <b>샘플링 빈도</b>, 한 번을 몇 비트로 적나가 <b>비트 깊이</b>예요.</p>
<table class="kb"><tbody><tr><th>무엇</th><th>음악 CD · 보통 wav</th><th>옛 전화</th></tr>
<tr><td>샘플링 빈도</td><td>1초에 44100 번(44.1kHz)</td><td>1초에 8000 번</td></tr>
<tr><td>비트 깊이</td><td>16비트(-32768 ~ 32767)</td><td>8비트</td></tr>
<tr><td>채널</td><td>2(왼쪽 · 오른쪽)</td><td>1</td></tr>
<tr><td>1분 용량</td><td>44100 × 2바이트 × 2 × 60 ≈ 10.6MB</td><td>8000 × 1 × 1 × 60 = 480KB</td></tr></tbody></table>
<p>「라」 음(440Hz)은 1초에 440번 떨려요. <code>math.sin</code> 으로 그 떨림을 샘플마다 계산하면 -1 ~ 1 사이 값이 나오고, 16비트 정수로 늘려서 저장해요.</p>
<pre>import math\n\nfor i in range(4):\n    t = i / 44100                         # i 번째 샘플의 시각(초)\n    v = math.sin(2 * math.pi * 440 * t)   # -1 ~ 1\n    print(i, round(v * 32767))</pre>
<p>예제는 이 샘플 44100개를 <code>wave</code> 모듈로 <code>beep.wav</code> 에 저장해요. 샘플 하나는 [[레슨:C3]] 의 <code>to_bytes(2, "little", signed=True)</code> 로 2바이트가 돼요(wav 는 작은 자리 바이트부터 적어요, <code>"little"</code>). 파일 크기는 머리말 44바이트 + 44100 × 2바이트예요.</p>
<p>VS Code 왼쪽 탐색기에서 <code>beep.wav</code> 를 오른쪽 클릭 → 「파일 탐색기에 표시」 → 더블 클릭하면 1초 동안 「삐—」 소리가 나요(소리를 줄이고 들어 보세요). <code>FREQ</code> 를 바꿔 다시 돌리면 음 높이가 바뀌어요.</p>
<p>다시 읽을 때는 <code>wave.open("beep.wav", "rb")</code> 로 열고 <code>w.getnframes()</code>(샘플 수) · <code>w.getframerate()</code>(1초에 몇 번)를 물어봐요. 둘을 나누면 길이(초)예요.</p>`,
      example: { code: `import math
import os
import wave

RATE = 44100      # 1초에 44100 번
FREQ = 440        # 「라」 — 1초에 440 번 떨림
samples = []
for i in range(RATE):
    t = i / RATE
    v = math.sin(2 * math.pi * FREQ * t)
    samples.append(round(v * 0.3 * 32767))   # 0.3 = 소리 크기 30%

data = bytearray()
for s in samples:
    data += s.to_bytes(2, "little", signed=True)

with wave.open("beep.wav", "wb") as w:
    w.setnchannels(1)       # 채널 1개(모노)
    w.setsampwidth(2)       # 샘플 하나 2바이트 = 16비트
    w.setframerate(RATE)
    w.writeframes(data)

print("샘플", len(samples), "개 · 앞 4개:", samples[:4])
print("beep.wav", os.path.getsize("beep.wav"), "바이트")

with wave.open("beep.wav", "rb") as w:
    n = w.getnframes()
    rate = w.getframerate()
print("다시 읽기:", n, "샘플 ÷", rate, "=", n / rate, "초")` } },
  ],
  summary: ['픽셀 = (R, G, B) 세 숫자, "#ff8800" 은 16진 두 자리씩', '이미지 용량 = 가로 × 세로 × 3바이트 — 그래서 압축(무손실 · 손실)', '소리는 1초에 44100 번 잰 16비트 숫자 — wave 로 저장'] },
{ id: 'CB1', ch: 1, boss: true, title: '만들어 보기: 나만의 인코더', mode: 'text',
  tutorSummary: '챕터 1 묶기 — 글자 → UTF-8 바이트 → 16진 · 2진 덤프 → 다시 글자, 바이트 수 · 글자 수 비교 표(utf-8 · utf-16 · cp949), 명령(enc · dec · bin · count · 끝)으로 도는 인코더 프로그램. ord · f"U+{cp:04X}" · encode · hex(" ") · f"{b:08b}" · bytes.fromhex · decode · UnicodeDecodeError.', pages: [], summary: [] },
{ id: 'C5', ch: 2, n: 5, title: '논리 게이트', mode: 'text',
  tutorSummary: '게이트 = 0/1(전기 신호)을 받아 정해진 규칙으로 0/1 을 내는 작은 회로, 트랜지스터 몇 개로 만든다. AND 둘 다 · OR 하나라도 · XOR 서로 다르면 · NOT 거꾸로 — 진리표로 모든 경우. 파이썬에선 0/1 에 a & b · a | b · a ^ b · 1 - a(~a 는 -2 가 나와서 안 됨, 2의 보수). 게이트를 함수(def AND(a, b))로 옮기고 결과를 다른 게이트에 넣어 이으면 큰 회로 — XOR = AND(OR, NOT(AND)). NAND(NOT AND) 하나로 NOT(NAND(a, a)) · AND · OR 를 전부 만든다(만능 게이트, NAND 플래시). 정수에 & | ^ 를 쓰면 자리마다 동시에 — 게이트를 나란히 놓은 것(골라내기 & 0b1111 · 켜기 | · 뒤집기 ^).',
  terms: { '게이트': '0/1 신호를 받아 정해진 규칙대로 0/1 을 내는 작은 회로. 트랜지스터 몇 개로 만들어요', '트랜지스터': '전기로 켜고 끄는 아주 작은 스위치. 요즘 CPU 에는 수십억 개가 들어 있어요', '진리표': '입력이 될 수 있는 모든 경우와 그때의 출력을 적은 표', 'NAND': 'NOT AND — AND 의 결과를 뒤집은 게이트. 이것 하나로 모든 게이트를 만들 수 있어요' },
  pages: [
    { title: 'a & b · a | b · a ^ b — 진리표', html: `<p>CPU 안은 아주 작은 스위치인 [[트랜지스터]] 수십억 개로 되어 있어요. 전기가 흐르면 <b>1</b>, 안 흐르면 <b>0</b> — [[레슨:C1]] 의 비트가 바로 이 전기 신호예요. 트랜지스터 몇 개를 묶어 「0/1 을 받아 정해진 규칙대로 0/1 을 내는」 작은 회로를 만들면, 그게 [[게이트]]예요.</p>
<p>기본 게이트는 넷이에요. 입력이 될 수 있는 경우를 빠짐없이 적은 표를 [[진리표]]라고 해요. 입력이 둘이면 경우는 00 · 01 · 10 · 11 네 가지예요.</p>
<pre> a  b │ AND  OR  XOR
 0  0 │  0    0    0
 0  1 │  0    1    1
 1  0 │  0    1    1
 1  1 │  1    1    0

 a │ NOT
 0 │  1
 1 │  0</pre>
<table class="kb"><tbody><tr><th>게이트</th><th>말로 하면</th><th>파이썬(0/1 에서)</th></tr>
<tr><td>AND</td><td>둘 <b>다</b> 1 이면 1</td><td><code>a &amp; b</code></td></tr>
<tr><td>OR</td><td><b>하나라도</b> 1 이면 1</td><td><code>a | b</code></td></tr>
<tr><td>XOR</td><td><b>서로 다르면</b> 1</td><td><code>a ^ b</code></td></tr>
<tr><td>NOT</td><td>거꾸로</td><td><code>1 - a</code></td></tr></tbody></table>
<p>생활 속에도 있어요. 「안전띠를 매고 <b>그리고</b> 문이 닫혀야 출발」 은 AND, 「현관 <b>또는</b> 베란다 센서가 울리면 경보」 는 OR 예요. 계단 위아래 스위치로 켜고 끄는 전등은 XOR — 어느 쪽 스위치든 하나를 바꾸면 불이 바뀌어요.</p>
<div class="bk-warn"><b>NOT 은 ~a 가 아니에요</b> — 파이썬의 <code>~1</code> 은 <code>-2</code> 예요. <code>~</code> 는 정수의 비트를 전부 뒤집고, 맨 앞 비트가 1 이 된 수를 2의 보수로 음수로 읽기 때문이에요([[레슨:C3]]). 0/1 하나만 뒤집을 때는 <code>1 - a</code> 나 <code>a ^ 1</code> 을 써요.</div>`,
      example: { code: `print(" a  b │ AND  OR  XOR")
for a in (0, 1):
    for b in (0, 1):
        print(f" {a}  {b} │  {a & b}    {a | b}    {a ^ b}")

print()
print(" a │ NOT")
for a in (0, 1):
    print(f" {a} │  {1 - a}")

print()
print("~1 =", ~1, "   1 - 1 =", 1 - 1, "   1 ^ 1 =", 1 ^ 1)` } },
    { title: 'def AND(a, b): — 함수로 게이트', html: `<p>게이트는 「규칙」 이라서 파이썬 함수로 그대로 옮길 수 있어요. 이번엔 기호 없이 if 로 규칙만 적어 볼게요. 파이썬의 <code>and</code> · <code>or</code> · <code>not</code> 은 이미 쓰는 낱말이라, 회로 그림처럼 함수 이름을 대문자로 지었어요.</p>
<pre>def AND(a, b):
    if a == 1 and b == 1:
        return 1
    return 0

def OR(a, b):
    if a == 1 or b == 1:
        return 1
    return 0

def NOT(a):
    if a == 1:
        return 0
    return 1

print(AND(1, 0), OR(1, 0), NOT(1))   # 0 1 0</pre>
<p>진짜 회로에서는 한 게이트의 출력 선을 다른 게이트의 입력에 이어요. 함수로는 <b>한 함수의 결과를 다른 함수에 넣는 것</b>이 그거예요. XOR 를 AND · OR · NOT 으로 만들어 볼게요. XOR 는 「하나라도 1」 <b>그리고</b> 「둘 다 1 은 아님」 이에요.</p>
<pre>a, b ──► OR  ──────────┐
                       ├──► AND ──► XOR
a, b ──► AND ──► NOT ──┘</pre>
<pre>def XOR(a, b):
    either = OR(a, b)      # 하나라도 1
    both = AND(a, b)       # 둘 다 1
    return AND(either, NOT(both))</pre>
<p>작은 게이트를 이어 큰 회로를 만들고, 큰 회로를 이어 더 큰 회로를 만들어요. 다음 레슨의 덧셈기도, 그다음의 CPU 도 결국 이렇게 이은 거예요. 예제는 만든 XOR 가 <code>a ^ b</code> 와 네 경우 모두 같은지 확인해요.</p>`,
      example: { code: `def AND(a, b):
    if a == 1 and b == 1:
        return 1
    return 0

def OR(a, b):
    if a == 1 or b == 1:
        return 1
    return 0

def NOT(a):
    if a == 1:
        return 0
    return 1

def XOR(a, b):
    either = OR(a, b)
    both = AND(a, b)
    return AND(either, NOT(both))

print(" a  b │ XOR │ a ^ b 와 같나")
for a in (0, 1):
    for b in (0, 1):
        print(f" {a}  {b} │  {XOR(a, b)}  │ {XOR(a, b) == a ^ b}")` } },
    { title: 'NAND(a, a) — NAND 하나로 다 만들기', html: `<p>[[NAND]] 는 「NOT AND」 — AND 의 결과를 뒤집은 게이트예요. 둘 다 1 일 때만 0 이에요.</p>
<pre> a  b │ NAND
 0  0 │  1
 0  1 │  1
 1  0 │  1
 1  1 │  0</pre>
<p>놀라운 점이 있어요. NAND <b>한 가지만</b> 있으면 다른 게이트를 전부 만들 수 있어요.</p>
<ul><li><b>NOT</b> — 같은 신호를 두 입력에 다 넣어요. <code>NAND(a, a)</code> 는 a 가 1 이면 0, 0 이면 1</li>
<li><b>AND</b> — NAND 를 한 번 더 뒤집어요. <code>NOT(NAND(a, b))</code></li>
<li><b>OR</b> — 「둘 다 0 은 아님」 이에요. 둘을 먼저 뒤집고 NAND 해요. <code>NAND(NOT(a), NOT(b))</code></li></ul>
<pre>def NAND(a, b):
    return 1 - (a &amp; b)

def NOT(a):
    return NAND(a, a)

def AND(a, b):
    return NOT(NAND(a, b))

def OR(a, b):
    return NAND(NOT(a), NOT(b))

print(NOT(0), AND(1, 1), OR(0, 1))   # 1 1 1</pre>
<p>그래서 칩 공장은 NAND(그리고 짝꿍인 NOR) 를 작고 빠르게 만드는 데 힘을 쏟아요. 한 가지 블록만 잘 만들면 그걸로 뭐든 쌓을 수 있으니까요. SSD 에 쓰는 「NAND 플래시」 메모리도 저장 칸을 NAND 게이트 모양으로 이어서 붙은 이름이에요.</p>
<p>XOR 도 NAND 4개로 만들 수 있어요. 만들어 보기에서 직접 해 봐요.</p>`,
      example: { code: `def NAND(a, b):
    return 1 - (a & b)

def NOT(a):
    return NAND(a, a)

def AND(a, b):
    return NOT(NAND(a, b))

def OR(a, b):
    return NAND(NOT(a), NOT(b))

print(" a  b │ NAND  AND  OR")
for a in (0, 1):
    for b in (0, 1):
        print(f" {a}  {b} │  {NAND(a, b)}     {AND(a, b)}    {OR(a, b)}")

ok = True
for a in (0, 1):
    if NOT(a) != 1 - a:
        ok = False
    for b in (0, 1):
        if AND(a, b) != a & b or OR(a, b) != a | b:
            ok = False
print("NAND 로 만든 NOT · AND · OR 가 진짜와 같나:", ok)` } },
    { title: '8개를 한꺼번에: 0b1100 & 0b1010', html: `<p>지금까지는 비트 하나씩이었어요. CPU 는 게이트를 <b>나란히</b> 놓고 여러 비트를 한 번에 계산해요. 64비트 CPU 라면 AND 게이트 64개가 나란히 있어서 64자리를 동시에 해요.</p>
<p>파이썬의 <code>&amp;</code> · <code>|</code> · <code>^</code> 를 정수에 쓰면 <b>자리마다</b> 따로 계산해요. 같은 자리끼리 위아래로 보면 돼요.</p>
<pre>    1100        1100        1100
  &amp; 1010      | 1010      ^ 1010
  ──────      ──────      ──────
    1000        1110        0110</pre>
<pre>a = 0b1100
b = 0b1010
print(format(a &amp; b, "04b"))   # 1000
print(format(a | b, "04b"))   # 1110
print(format(a ^ b, "04b"))   # 0110</pre>
<p><code>0b1100</code> 은 2진수로 적은 12 예요. <code>format(x, "04b")</code> 는 x 를 2진수 4자리로 보여 줘요([[레슨:C1]] 의 <code>bin</code> 과 비슷한데, 앞의 0b 없이 0 을 채워 자리를 맞춰요). 이런 「비트 묶음 계산」 은 이렇게 써요.</p>
<ul><li><b>골라내기</b> — <code>x &amp; 0b1111</code> 은 아래 4비트만 남겨요. 나머지 자리는 0 과 AND 라서 0 이 돼요</li>
<li><b>켜기</b> — <code>x | 0b0001</code> 은 맨 오른쪽 비트를 1 로 만들어요</li>
<li><b>뒤집기</b> — <code>x ^ 0b1111</code> 은 아래 4비트를 뒤집어요. 1 과 XOR 하면 뒤집히고, 0 과 하면 그대로예요</li></ul>
<p>비트 연산을 문제 풀이에 쓰는 법은 <a href="../algo/#lesson/A17" target="_blank" rel="noopener">알고리즘 교과서 「비트 연산」 ↗</a>, 같은 일을 하는 진짜 CPU 명령(<code>and</code> · <code>or</code> · <code>xor</code>)은 <a href="../asm/#lesson/R4" target="_blank" rel="noopener">어셈블리어 교과서 「비트 연산」 ↗</a> 에서 봐요.</p>`,
      example: { code: `a = 0b1100
b = 0b1010
print("a     ", format(a, "04b"))
print("b     ", format(b, "04b"))
print("a & b ", format(a & b, "04b"))
print("a | b ", format(a | b, "04b"))
print("a ^ b ", format(a ^ b, "04b"))

x = 0b10110110
print()
print("x          ", format(x, "08b"))
print("x & 0b1111 ", format(x & 0b1111, "08b"), "← 아래 4비트만")
print("x | 0b0001 ", format(x | 0b0001, "08b"), "← 맨 오른쪽 켜기")
print("x ^ 0b1111 ", format(x ^ 0b1111, "08b"), "← 아래 4비트 뒤집기")` } },
  ],
  summary: ['게이트는 0/1 을 받아 0/1 을 내는 회로 — AND 둘 다 · OR 하나라도 · XOR 서로 다르면 · NOT 거꾸로', '게이트의 출력을 다른 게이트에 이어 큰 회로를 만든다 — NAND 하나로 전부 만들 수 있다', '정수의 & | ^ 는 자리마다 동시에 — 게이트를 나란히 놓은 것'] },
{ id: 'C6', ch: 2, n: 6, title: '덧셈기: 게이트로 더하기', mode: 'text',
  tutorSummary: '2진 한 자리 더하기 1 + 1 = 10 — 합 자리는 XOR, 올림은 AND 라서 게이트 두 개가 반가산기 half_add(a, b) → (합, 올림). 오른쪽에서 올라온 올림까지 셋을 더하는 전가산기 full_add(a, b, c) = 반가산기 두 개 + OR(올림 둘). 전가산기 8개를 오른쪽 끝 자리부터 올림을 넘겨 가며 줄줄이 이으면 8비트 덧셈기 add8(x, y) — to_bits(format(n, "08b")) · from_bits(int(글자, 2)). 마지막 올림이 1 이면 넘침(200 + 100 → 44, 8비트만 남음) — 파이썬 int 는 안 넘치지만 CPU 레지스터는 칸 수가 정해져 있다. 뺄셈은 x + NOT(y) + 1(2의 보수) — 같은 덧셈기에 뒤집는 게이트와 첫 올림 1 만 더하면 된다. 이게 CPU 안의 계산 장치(ALU)의 뼈대.',
  terms: { '반가산기': '2진수 한 자리 두 개를 더해 합과 올림을 내는 회로. XOR 하나 + AND 하나', '전가산기': '한 자리 두 개와 아래 자리에서 올라온 올림까지 셋을 더하는 회로. 반가산기 둘 + OR 하나', '올림': '한 자리에서 넘쳐 바로 윗자리로 넘기는 1. 영어로 carry', '넘침': '결과가 정해진 비트 수(8비트면 0~255)를 넘는 것. 넘친 윗자리는 버려져요. 영어로 overflow', 'ALU': 'CPU 안의 계산 장치(Arithmetic Logic Unit). 덧셈기 · 게이트 묶음으로 더하기 · 빼기 · AND · OR 를 해요' },
  pages: [
    { title: 'half_add(a, b): 합은 XOR · 올림은 AND', html: `<p>2진수 한 자리끼리 더하면 경우가 넷이에요. 1 + 1 은 2 인데, 2진수로 2 는 <code>10</code> — 이 자리는 0 이고 윗자리로 <b>1 을 올려요</b>([[올림]]).</p>
<pre> a + b │ 올림  합 │ 10진
 0 + 0 │  0    0  │  0
 0 + 1 │  0    1  │  1
 1 + 0 │  0    1  │  1
 1 + 1 │  1    0  │  2</pre>
<p>표를 [[레슨:C5]] 의 진리표와 견줘 보세요. <b>합</b> 칸은 XOR(서로 다르면 1)와 똑같고, <b>올림</b> 칸은 AND(둘 다 1 이면 1)와 똑같아요. 그래서 게이트 두 개면 한 자리 덧셈 회로가 돼요. 이걸 [[반가산기]]라고 해요.</p>
<pre>a ─┬──► XOR ──► 합
b ─┼──►
   └──► AND ──► 올림</pre>
<pre>def half_add(a, b):
    return a ^ b, a &amp; b       # (합, 올림)

print(half_add(1, 1))   # (0, 1)</pre>
<p>함수 하나가 값 두 개를 돌려줘요(<code>return 합, 올림</code>). 받을 때는 <code>s, c = half_add(1, 1)</code> 처럼 나눠 받아요. 「반」 이라는 이름이 붙은 건 <b>아래 자리에서 올라온 올림</b>을 못 받아서예요. 그건 다음 쪽의 전가산기가 해요.</p>`,
      example: { code: `def half_add(a, b):
    s = a ^ b      # 합 = XOR
    c = a & b      # 올림 = AND
    return s, c

print(" a + b │ 올림  합 │ 10진")
for a in (0, 1):
    for b in (0, 1):
        s, c = half_add(a, b)
        print(f" {a} + {b} │  {c}    {s}  │  {c * 2 + s}")` } },
    { title: 'full_add(a, b, c) — 올림까지 셋', html: `<p>여러 자리 수를 더할 때, 둘째 자리부터는 <b>셋</b>을 더해요. a 자리, b 자리, 그리고 오른쪽 자리에서 올라온 올림 c. 이걸 하는 회로가 [[전가산기]]예요. 반가산기 두 개와 OR 하나로 만들어요.</p>
<ol><li>반가산기로 <code>a + b</code> → 합 s1, 올림 c1</li>
<li>반가산기로 <code>s1 + c</code> → 최종 합 s, 올림 c2</li>
<li>올림은 c1 이나 c2 중 하나라도 1 이면 1 → <code>OR(c1, c2)</code> (둘이 동시에 1 이 되는 일은 없어요)</li></ol>
<pre>a, b ──► 반가산기① ── s1 ──►┐
             │                반가산기② ──► 합 s
             c1         c ──►┘     │
             │                     c2
             └──────► OR ◄─────────┘
                      │
                      ▼
                     올림</pre>
<pre>def full_add(a, b, c):
    s1, c1 = half_add(a, b)
    s, c2 = half_add(s1, c)
    return s, c1 | c2

print(full_add(1, 1, 1))   # (1, 1)</pre>
<p>1 + 1 + 1 = 3 = 2진수 <code>11</code> 이라서 합 1, 올림 1 이에요. 예제는 입력 8가지를 모두 찍고, <code>올림 × 2 + 합</code> 이 정말 <code>a + b + c</code> 와 같은지 확인해요.</p>`,
      example: { code: `def half_add(a, b):
    return a ^ b, a & b

def full_add(a, b, c):
    s1, c1 = half_add(a, b)
    s, c2 = half_add(s1, c)
    return s, c1 | c2

print(" a b c │ 올림 합 │ 맞나")
for a in (0, 1):
    for b in (0, 1):
        for c in (0, 1):
            s, carry = full_add(a, b, c)
            ok = carry * 2 + s == a + b + c
            print(f" {a} {b} {c} │  {carry}    {s} │ {ok}")` } },
    { title: 'add8(x, y) — 전가산기 8개를 줄줄이', html: `<p>8비트 수 두 개를 더하려면 전가산기 8개를 한 줄로 놓아요. 맨 오른쪽 자리부터 더하고, 거기서 나온 올림을 <b>바로 왼쪽 전가산기</b>에 넘겨요. 손으로 하는 세로셈과 똑같아요.</p>
<pre> 올림   1 1 0 0 1 0 0 0
        0 1 1 0 0 1 0 0    100
      + 0 0 1 1 0 1 1 1     55
      ─────────────────
        1 0 0 1 1 0 1 1    155</pre>
<p>파이썬으로는 수를 비트 리스트로 바꿔서 해요. <code>format(n, "08b")</code> 로 2진수 8자리 글자를 만들고([[레슨:C1]]), 글자 하나씩 숫자로 바꿔요. 되돌릴 때는 <code>int(글자, 2)</code> 예요.</p>
<pre>def add8(x, y):
    a = to_bits(x)
    b = to_bits(y)
    out = [0] * 8
    carry = 0
    for i in range(7, -1, -1):      # 오른쪽 끝(7번)부터 왼쪽으로
        out[i], carry = full_add(a[i], b[i], carry)
    return from_bits(out), carry</pre>
<p>올림이 왼쪽으로 한 칸씩 퍼져 가서 「줄줄이 올림 덧셈기」 라고 불러요. 진짜 CPU 는 올림을 미리 내다보는 더 빠른 회로를 쓰지만, 하는 일은 같아요.</p>
<p><b>[[넘침]]</b> — 맨 왼쪽 전가산기에서도 올림이 나오면 8비트에 담을 자리가 없어요. 200 + 100 = 300 인데, 8비트에는 <code>300 - 256 = 44</code> 만 남고 마지막 올림 1 은 버려져요. 파이썬의 int 는 알아서 커져서 안 넘치지만, CPU 의 레지스터는 칸 수(8 · 32 · 64비트)가 정해져 있어서 넘쳐요. <a href="../asm/#lesson/R3" target="_blank" rel="noopener">어셈블리어 교과서 「계산: add · sub」 ↗</a> 의 「넘침」 쪽에서 64비트 CPU 가 정말 그렇게 잘라 내는 걸 봐요.</p>`,
      example: { code: `def XOR(a, b):
    return a ^ b

def AND(a, b):
    return a & b

def OR(a, b):
    return a | b

def half_add(a, b):
    return XOR(a, b), AND(a, b)

def full_add(a, b, c):
    s1, c1 = half_add(a, b)
    s, c2 = half_add(s1, c)
    return s, OR(c1, c2)

def to_bits(n):
    return [int(ch) for ch in format(n, "08b")]   # 왼쪽이 큰 자리

def from_bits(bits):
    text = ""
    for b in bits:
        text += str(b)
    return int(text, 2)

def add8(x, y, show=False):
    a = to_bits(x)
    b = to_bits(y)
    out = [0] * 8
    carry = 0
    for i in range(7, -1, -1):
        old = carry
        out[i], carry = full_add(a[i], b[i], carry)
        if show:
            print(f"  오른쪽 {8 - i}번째 자리: {a[i]} + {b[i]} + 올림 {old} → 합 {out[i]}, 올림 {carry}")
    return from_bits(out), carry

result, carry = add8(100, 55, show=True)
print("100 + 55 =", result, " 마지막 올림", carry)
print()
result, carry = add8(200, 100)
print("200 + 100 =", result, " 마지막 올림", carry, "← 넘침! 300 - 256 = 44 만 남음")` } },
    { title: '뺄셈 x − y = x + (y 뒤집기) + 1', html: `<p>빼기 회로를 따로 만들 필요가 없어요. [[레슨:C3]] 의 2의 보수가 「−y = y 의 비트를 다 뒤집고 + 1」 이었죠. 그러니까</p>
<pre>x − y  =  x + (−y)  =  x + (y 를 뒤집은 것) + 1</pre>
<p>비트 뒤집기는 NOT 게이트 8개, 「+ 1」 은 맨 오른쪽 전가산기에 넣는 첫 올림을 0 대신 <b>1</b> 로 주면 끝이에요. 덧셈기 하나로 더하기와 빼기를 다 해요. 8비트 뒤집기는 [[레슨:C5]] 에서 본 <code>^</code> 로 <code>y ^ 0b11111111</code> 이에요.</p>
<pre>  9 − 4:   9 + (4 뒤집은 것 251) + 1 = 261 → 8비트만 남기면   5
  4 − 9:   4 + (9 뒤집은 것 246) + 1 = 251 → 부호 있는 수로 읽으면 −5</pre>
<p>251 은 맨 왼쪽 비트가 1 이라서, 「부호 있는 8비트」 로 읽으면 <code>251 - 256 = -5</code> 예요. CPU 는 같은 비트를 내놓고, 그걸 부호 없는 수(251)로 읽을지 부호 있는 수(−5)로 읽을지는 프로그램이 정해요.</p>
<p>CPU 안에는 이렇게 덧셈기 · 게이트 묶음을 모아 둔 계산 장치 [[ALU]] 가 있어요. 「더해라 · 빼라 · AND 해라」 신호에 따라 회로 일부를 켜고 꺼요. 다음 레슨에서 CPU 가 이 ALU 에게 일을 시키는 법을 봐요.</p>`,
      example: { code: `for x, y in [(9, 4), (4, 9), (100, 1)]:
    flipped = y ^ 0b11111111      # 8비트 뒤집기 (NOT 8개)
    total = x + flipped + 1
    result = total % 256          # 8비트만 남기기
    if result >= 128:
        signed = result - 256
    else:
        signed = result
    print(f"{x} - {y}: {format(x, '08b')} + {format(flipped, '08b')} + 1 → {format(result, '08b')} = {result} (부호 있게 읽으면 {signed})")` } },
  ],
  summary: ['한 자리 더하기: 합은 XOR, 올림은 AND — 반가산기', '전가산기(올림까지 셋)를 8개 줄줄이 이으면 8비트 덧셈기, 마지막 올림은 넘침', '뺄셈 = 뒤집고 + 1 을 더하기 — 같은 덧셈기로'] },
{ id: 'C7', ch: 2, n: 7, title: 'CPU 가 명령을 실행하는 법', mode: 'text',
  tutorSummary: '명령도 숫자 — 프로그램은 메모리 칸에 든 숫자들이고, 데이터도 같은 메모리에 있다(CPU 는 PC 가 가리키는 칸만 명령으로 읽음). 이 교과서의 장난감 CPU: 명령 7개(0 HALT · 1 LOAD r, 주소(r = mem[주소]) · 2 ADD r, s · 3 SUB r, s · 4 JMP 주소 · 5 JZ r, 주소(r 이 0 이면 점프) · 6 PRINT r), 레지스터 R0~R3, 메모리 16칸. 명령 한 칸 = 4자리 10진수 [명령 번호][레지스터][두 자리] — 1014 = LOAD R0, 14, 해석은 word // 1000 · word // 100 % 10 · word % 100. CPU 는 가져오기(word = mem[pc], pc += 1) → 해석(decode) → 실행을 끝없이 반복, 프로그램 카운터(PC)는 다음 명령의 칸 번호, 점프는 PC 를 바꾸는 것. run(mem) 은 while True + if/elif 로 HALT 까지. 글자 명령(LOAD R0, 14)을 숫자로 바꾸는 게 어셈블러(assemble). 진짜 CPU(x86-64)는 명령 수천 개 · 레지스터 rax~r15 · 명령은 바이트(mov rax, 60 → b8 3c 00 00 00) · 1초에 수십억 번 — 어셈블리어 교과서. CB2 에서 이 CPU 를 명령 8개(7 STORE) · 메모리 32칸으로 키운다.',
  terms: { '레지스터': 'CPU 안에 있는 아주 빠른 작은 칸 몇 개. 계산할 값을 여기에 올려놓고 해요', '프로그램 카운터': '다음에 가져올 명령이 메모리 몇 번 칸에 있는지 가리키는 레지스터. 줄여서 PC', '명령어 집합': '그 CPU 가 알아듣는 명령의 목록과 숫자 모양. CPU 종류마다 달라요(x86-64 · ARM …)', '어셈블러': '글자로 적은 명령(어셈블리어)을 CPU 가 읽는 숫자(기계어)로 바꾸는 프로그램', '클록': 'CPU 가 한 걸음씩 움직이게 박자를 맞추는 신호. 3 GHz 면 1초에 30억 번' },
  pages: [
    { title: '명령도 숫자: 1014 = LOAD R0, 14', html: `<p>메모리는 번호 붙은 칸들이고, 칸마다 숫자가 하나씩 들어 있어요. 놀랍게도 <b>프로그램도 그 칸에 든 숫자</b>예요. CPU 는 칸에서 숫자를 꺼내 「아, 이건 더하라는 뜻」 하고 알아들어요. 어떤 숫자가 어떤 명령인지 정한 약속을 [[명령어 집합]]이라고 해요.</p>
<p>이 교과서의 <b>장난감 CPU</b> 를 정해 볼게요. 계산할 값을 올려놓는 [[레지스터]]는 R0 · R1 · R2 · R3 네 개, 메모리는 0~15번 16칸, 명령은 7개예요.</p>
<table class="kb"><tbody><tr><th>번호</th><th>명령</th><th>모양</th><th>하는 일</th></tr>
<tr><td>0</td><td>HALT</td><td><code>HALT</code></td><td>멈추기</td></tr>
<tr><td>1</td><td>LOAD</td><td><code>LOAD R0, 14</code></td><td>메모리 14번 칸의 값을 R0 에</td></tr>
<tr><td>2</td><td>ADD</td><td><code>ADD R0, R1</code></td><td>R0 = R0 + R1</td></tr>
<tr><td>3</td><td>SUB</td><td><code>SUB R0, R1</code></td><td>R0 = R0 − R1</td></tr>
<tr><td>4</td><td>JMP</td><td><code>JMP 2</code></td><td>다음엔 2번 칸 명령으로</td></tr>
<tr><td>5</td><td>JZ</td><td><code>JZ R0, 6</code></td><td>R0 이 0 이면 6번 칸으로, 아니면 그냥 다음</td></tr>
<tr><td>6</td><td>PRINT</td><td><code>PRINT R0</code></td><td>R0 의 값을 화면에</td></tr></tbody></table>
<p>명령 하나는 <b>4자리 숫자 하나</b>로 적어요. 천의 자리가 명령 번호, 백의 자리가 레지스터, 끝 두 자리가 칸 번호(또는 둘째 레지스터)예요.</p>
<pre> 1014  →  1 │ 0 │ 14  →  LOAD R0, 14
 5006  →  5 │ 0 │ 06  →  JZ R0, 6
 3001  →  3 │ 0 │ 01  →  SUB R0, R1
 6000  →  6 │ 0 │ 00  →  PRINT R0</pre>
<p>숫자를 자리별로 쪼개는 건 몫(<code>//</code>)과 나머지(<code>%</code>)예요.</p>
<pre>word = 1014
print(word // 1000)       # 1  — 명령 번호
print(word // 100 % 10)   # 0  — 레지스터
print(word % 100)         # 14 — 칸 번호</pre>
<p>예제는 「3, 2, 1 을 세는」 프로그램이 들어 있는 메모리 16칸을 읽어 명령으로 풀어 봐요. 14번 · 15번 칸의 3 · 1 은 명령이 아니라 <b>데이터</b>예요. CPU 는 숫자만 봐서는 명령인지 데이터인지 몰라요. 다음 쪽의 PC 가 가리키는 칸을 명령으로 읽을 뿐이에요. 진짜 CPU 는 10진 자리 대신 2진 비트를 잘라서 같은 일을 해요([[레슨:C1]]).</p>`,
      example: { code: `NAMES = ["HALT", "LOAD", "ADD", "SUB", "JMP", "JZ", "PRINT"]

def decode(word):
    op = word // 1000          # 천의 자리: 명령 번호
    r = word // 100 % 10       # 백의 자리: 레지스터
    x = word % 100             # 끝 두 자리: 주소나 레지스터
    return op, r, x

def show(word):
    op, r, x = decode(word)
    name = NAMES[op]
    if op == 0:
        return name
    if op == 4:
        return f"{name} {x}"
    if op == 6:
        return f"{name} R{r}"
    if op in (2, 3):
        return f"{name} R{r}, R{x}"
    return f"{name} R{r}, {x}"

mem = [1014, 1115, 5006, 6000, 3001, 4002, 0, 0,
       0, 0, 0, 0, 0, 0, 3, 1]

print("칸  숫자  뜻")
for addr in range(7):
    print(f"{addr:>2}  {mem[addr]:>4}  {show(mem[addr])}")
print(" …  (7~13번 칸은 비어 있음)")
print(f"14  {mem[14]:>4}  데이터 — 셀 시작 수")
print(f"15  {mem[15]:>4}  데이터 — 1 씩 빼려고")` } },
    { title: 'word = mem[pc] — 가져오기 · 해석 · 실행', html: `<p>CPU 가 하는 일은 딱 세 가지를 <b>끝없이</b> 되풀이하는 거예요.</p>
<ol><li><b>가져오기</b>(fetch) — [[프로그램 카운터]](PC)가 가리키는 칸의 숫자를 꺼내요. 그리고 PC 를 1 늘려 다음 칸을 가리켜요</li>
<li><b>해석</b>(decode) — 숫자를 쪼개 무슨 명령인지, 어느 레지스터 · 칸인지 알아내요</li>
<li><b>실행</b>(execute) — 레지스터 값을 바꾸거나([[레슨:C6]] 의 덧셈기 · ALU 가 여기서 일해요), 화면에 찍거나, PC 를 바꿔요</li></ol>
<pre>        ┌──────────────────────────────┐
        ▼                              │
  ① 가져오기 word = mem[pc]; pc += 1   │
        ▼                              │
  ② 해석    op, r, x = decode(word)    │
        ▼                              │
  ③ 실행    레지스터 · PC 바꾸기 ───────┘</pre>
<p><b>점프는 PC 를 바꾸는 것</b>이에요. <code>JMP 2</code> 는 「pc = 2」 일 뿐이고, 다음 가져오기가 2번 칸에서 일어나요. 반복문(<code>while</code>)도 if 도, CPU 에서는 전부 이 점프로 돼요.</p>
<p>3, 2, 1 프로그램의 처음 몇 단계를 손으로 따라가 볼게요. R0 은 셀 수, R1 은 1 이에요.</p>
<table class="kb"><tbody><tr><th>PC</th><th>가져온 숫자</th><th>명령</th><th>실행 뒤</th></tr>
<tr><td>0</td><td>1014</td><td>LOAD R0, 14</td><td>R0 = 3</td></tr>
<tr><td>1</td><td>1115</td><td>LOAD R1, 15</td><td>R1 = 1</td></tr>
<tr><td>2</td><td>5006</td><td>JZ R0, 6</td><td>R0 은 3 — 점프 안 함</td></tr>
<tr><td>3</td><td>6000</td><td>PRINT R0</td><td>화면에 3</td></tr>
<tr><td>4</td><td>3001</td><td>SUB R0, R1</td><td>R0 = 2</td></tr>
<tr><td>5</td><td>4002</td><td>JMP 2</td><td>PC = 2 — 다시 JZ 로</td></tr></tbody></table>
<p>진짜 CPU 는 이 한 바퀴를 [[클록]]에 맞춰 1초에 수십억 번 돌아요. 예제는 한 바퀴를 하는 <code>step(pc)</code> 함수를 만들어 8번만 불러 봐요.</p>`,
      example: { code: `NAMES = ["HALT", "LOAD", "ADD", "SUB", "JMP", "JZ", "PRINT"]

def decode(word):
    op = word // 1000          # 천의 자리: 명령 번호
    r = word // 100 % 10       # 백의 자리: 레지스터
    x = word % 100             # 끝 두 자리: 주소나 레지스터
    return op, r, x

def show(word):
    op, r, x = decode(word)
    name = NAMES[op]
    if op == 0:
        return name
    if op == 4:
        return f"{name} {x}"
    if op == 6:
        return f"{name} R{r}"
    if op in (2, 3):
        return f"{name} R{r}, R{x}"
    return f"{name} R{r}, {x}"

mem = [1014, 1115, 5006, 6000, 3001, 4002, 0, 0,
       0, 0, 0, 0, 0, 0, 3, 1]
reg = [0, 0, 0, 0]

def step(pc):
    word = mem[pc]             # ① 가져오기
    pc = pc + 1
    op, r, x = decode(word)    # ② 해석
    if op == 1:                # ③ 실행
        reg[r] = mem[x]
    elif op == 3:
        reg[r] = reg[r] - reg[x]
    elif op == 4:
        pc = x
    elif op == 5:
        if reg[r] == 0:
            pc = x
    elif op == 6:
        print("   화면 →", reg[r])
    print(f"{show(word):<12} 다음 PC={pc}  R={reg}")
    return pc

pc = 0
for n in range(8):
    pc = step(pc)` } },
    { title: 'run(mem): while True: 로 HALT 까지', html: `<p>한 바퀴(<code>step</code>)를 <code>while True:</code> 안에 넣고, HALT 를 만나면 <code>break</code> 로 멈추면 CPU 가 완성돼요. 명령 7개가 if · elif 7갈래예요.</p>
<pre>def run(mem):
    reg = [0, 0, 0, 0]
    pc = 0
    while True:
        word = mem[pc]             # ① 가져오기
        pc = pc + 1
        op, r, x = decode(word)    # ② 해석
        if op == 0:                # ③ 실행 — HALT
            break
        elif op == 1:              # LOAD r, 주소
            reg[r] = mem[x]
        elif op == 2:              # ADD r, s
            reg[r] = reg[r] + reg[x]
        elif op == 3:              # SUB r, s
            reg[r] = reg[r] - reg[x]
        elif op == 4:              # JMP 주소
            pc = x
        elif op == 5:              # JZ r, 주소
            if reg[r] == 0:
                pc = x
        elif op == 6:              # PRINT r
            print(reg[r])</pre>
<p>3, 2, 1 프로그램을 넣고 <code>run(mem)</code> 을 부르면 3 · 2 · 1 을 찍고 멈춰요. 셀 수를 바꾸고 싶으면 프로그램(0~6번 칸)은 그대로 두고 <b>데이터 칸(14번)만</b> 바꾸면 돼요. 예제는 <code>trace=True</code> 로 한 단계마다 명령 · PC · 레지스터도 찍어요.</p>
<div class="bk-warn"><b>끝나지 않는 프로그램</b> — HALT 에 닿지 못하면(예: <code>JMP 0</code> 만 계속) while True 가 영원히 돌아요. VS Code 터미널에서 <b>Ctrl+C</b> 로 멈춰요. 진짜 CPU 도 똑같이 멈추지 않아요. [[레슨:CB2]] 에서는 「최대 단계」 를 둬서 막아요.</div>`,
      example: { code: `NAMES = ["HALT", "LOAD", "ADD", "SUB", "JMP", "JZ", "PRINT"]

def decode(word):
    op = word // 1000          # 천의 자리: 명령 번호
    r = word // 100 % 10       # 백의 자리: 레지스터
    x = word % 100             # 끝 두 자리: 주소나 레지스터
    return op, r, x

def show(word):
    op, r, x = decode(word)
    name = NAMES[op]
    if op == 0:
        return name
    if op == 4:
        return f"{name} {x}"
    if op == 6:
        return f"{name} R{r}"
    if op in (2, 3):
        return f"{name} R{r}, R{x}"
    return f"{name} R{r}, {x}"

def run(mem, trace=False):
    reg = [0, 0, 0, 0]
    pc = 0
    while True:
        word = mem[pc]             # ① 가져오기
        if trace:
            print(f"   PC={pc:>2}  {show(word):<12} 실행 전 R={reg}")
        pc = pc + 1
        op, r, x = decode(word)    # ② 해석
        if op == 0:                # ③ 실행 — HALT
            break
        elif op == 1:              # LOAD r, 주소
            reg[r] = mem[x]
        elif op == 2:              # ADD r, s
            reg[r] = reg[r] + reg[x]
        elif op == 3:              # SUB r, s
            reg[r] = reg[r] - reg[x]
        elif op == 4:              # JMP 주소
            pc = x
        elif op == 5:              # JZ r, 주소
            if reg[r] == 0:
                pc = x
        elif op == 6:              # PRINT r
            print(reg[r])

mem = [1014, 1115, 5006, 6000, 3001, 4002, 0, 0,
       0, 0, 0, 0, 0, 0, 3, 1]

print("— 그냥 실행")
run(mem)

print("— 한 단계씩 보기 (셀 수를 2 로)")
mem[14] = 2
run(mem, trace=True)` } },
    { title: '진짜 CPU: mov rax, 60 · 어셈블러', html: `<p>1014 같은 숫자를 직접 적기는 힘들어요. 그래서 사람은 <code>LOAD R0, 14</code> 처럼 <b>글자로</b> 적고, 그걸 숫자로 바꾸는 프로그램을 써요. 이 프로그램이 [[어셈블러]]고, 글자로 적은 명령이 <b>어셈블리어</b>예요.</p>
<pre>OPS = {"HALT": 0, "LOAD": 1, "ADD": 2, "SUB": 3, "JMP": 4, "JZ": 5, "PRINT": 6}

def assemble(line):
    parts = line.replace(",", " ").split()    # "LOAD R0, 14" → ["LOAD", "R0", "14"]
    name = parts[0]
    nums = []
    for p in parts[1:]:
        n = p.replace("R", "")                # "R0" → "0", "14" → "14"
        nums.append(int(n))
    if name == "JMP":
        nums = [0] + nums                     # JMP 는 레지스터 자리가 비어요
    nums = nums + [0, 0]                      # 모자라는 자리는 0
    return OPS[name] * 1000 + nums[0] * 100 + nums[1]

print(assemble("LOAD R0, 14"))   # 1014
print(assemble("JMP 2"))         # 4002</pre>
<p>모르는 이름(<code>"MOVE R0, 1"</code>)을 넣으면 <code>OPS[name]</code> 에서 KeyError 가 나요. 진짜 어셈블러는 번역하기 전에 <code>if name not in OPS:</code> 로 검사해서 「몇 번째 줄: 모르는 명령」 이라고 알려 줘요.</p>
<p>진짜 CPU 도 원리는 같아요. 다만 크기가 달라요.</p>
<table class="kb"><tbody><tr><th></th><th>장난감 CPU</th><th>진짜 CPU (x86-64)</th></tr>
<tr><td>명령</td><td>7개</td><td>수천 개(mov · add · cmp · jmp · call …)</td></tr>
<tr><td>레지스터</td><td>R0~R3</td><td>rax · rbx … r15 16개(칸마다 64비트)</td></tr>
<tr><td>명령 모양</td><td>10진 4자리 숫자</td><td>바이트 1~15개 — <code>mov rax, 60</code> → <code>b8 3c 00 00 00</code></td></tr>
<tr><td>빠르기</td><td>파이썬 while 한 바퀴</td><td>1초에 수십억 번, 여러 명령을 겹쳐서</td></tr></tbody></table>
<p>진짜 레지스터와 명령은 어셈블리어 교과서에서 우분투 VM 으로 직접 돌려 봐요.</p>
<ul><li><a href="../asm/#lesson/R0" target="_blank" rel="noopener">어셈블리어 교과서 「어셈블리어란」 ↗</a> — 기계어 바이트와 어셈블러(nasm)</li>
<li><a href="../asm/#lesson/R1" target="_blank" rel="noopener">「레지스터와 mov」 ↗</a> — rax … r15, LOAD 에 해당하는 mov</li>
<li><a href="../asm/#lesson/R5" target="_blank" rel="noopener">「비교와 점프」 ↗</a> · <a href="../asm/#lesson/R6" target="_blank" rel="noopener">「반복 만들기」 ↗</a> — JMP · JZ 에 해당하는 jmp · je, 1~n 합</li></ul>
<details class="lp-more"><summary>💡 더 알아보기</summary><p>진짜 CPU 는 공장 줄처럼 일해요. 한 명령을 실행하는 동안 다음 명령을 해석하고, 그다음 명령을 가져와요(파이프라인). 점프가 어디로 갈지 미리 짐작해서 가져오기도 해요. 그래서 한 바퀴씩 도는 장난감보다 훨씬 빨라요.</p></details>`,
      example: { code: `OPS = {"HALT": 0, "LOAD": 1, "ADD": 2, "SUB": 3, "JMP": 4, "JZ": 5, "PRINT": 6}

def assemble(line):
    parts = line.replace(",", " ").split()
    name = parts[0]
    nums = []
    for p in parts[1:]:
        n = p.replace("R", "")
        nums.append(int(n))
    if name == "JMP":
        nums = [0] + nums
    nums = nums + [0, 0]
    return OPS[name] * 1000 + nums[0] * 100 + nums[1]

NAMES = ["HALT", "LOAD", "ADD", "SUB", "JMP", "JZ", "PRINT"]

def decode(word):
    op = word // 1000          # 천의 자리: 명령 번호
    r = word // 100 % 10       # 백의 자리: 레지스터
    x = word % 100             # 끝 두 자리: 주소나 레지스터
    return op, r, x

def show(word):
    op, r, x = decode(word)
    name = NAMES[op]
    if op == 0:
        return name
    if op == 4:
        return f"{name} {x}"
    if op == 6:
        return f"{name} R{r}"
    if op in (2, 3):
        return f"{name} R{r}, R{x}"
    return f"{name} R{r}, {x}"

def run(mem, trace=False):
    reg = [0, 0, 0, 0]
    pc = 0
    while True:
        word = mem[pc]             # ① 가져오기
        if trace:
            print(f"   PC={pc:>2}  {show(word):<12} 실행 전 R={reg}")
        pc = pc + 1
        op, r, x = decode(word)    # ② 해석
        if op == 0:                # ③ 실행 — HALT
            break
        elif op == 1:              # LOAD r, 주소
            reg[r] = mem[x]
        elif op == 2:              # ADD r, s
            reg[r] = reg[r] + reg[x]
        elif op == 3:              # SUB r, s
            reg[r] = reg[r] - reg[x]
        elif op == 4:              # JMP 주소
            pc = x
        elif op == 5:              # JZ r, 주소
            if reg[r] == 0:
                pc = x
        elif op == 6:              # PRINT r
            print(reg[r])

program = [
    "LOAD R0, 14",
    "LOAD R1, 15",
    "ADD R0, R1",
    "PRINT R0",
    "HALT",
]
mem = [0] * 16
for addr, line in enumerate(program):
    mem[addr] = assemble(line)
    print(f"{addr:>2}  {line:<12} → {mem[addr]}")
mem[14] = 5
mem[15] = 7
print("메모리:", mem)
print("실행 결과:")
run(mem)` } },
  ],
  summary: ['프로그램도 메모리의 숫자 — 1014 = LOAD R0, 14 (명령 번호 · 레지스터 · 칸)', 'CPU 는 가져오기 → 해석 → 실행을 끝없이, PC 가 다음 칸을 가리키고 점프는 PC 를 바꾼다', '글자 명령을 숫자로 바꾸는 게 어셈블러 — 진짜 CPU 는 어셈블리어 교과서'] },
{ id: 'C8', ch: 2, n: 8, title: '메모리 계층과 캐시', mode: 'text',
  tutorSummary: '가까울수록 빠르고 작다 — 레지스터(0.3 ns) · L1 캐시(1 ns) · L2(4 ns) · L3(15 ns) · RAM(100 ns) · SSD(100 µs) · HDD(10 ms), 1 클록을 1초로 늘리면 RAM 5분 · SSD 4일 · HDD 1년. CPU 는 RAM 을 기다리지 않으려고 캐시(작고 빠른 사본)를 둔다. 맞히면 적중(hit), 없으면 실패(miss) → RAM 에서 블록(캐시 라인, 보통 64바이트)을 통째로 가져온다. 캐시가 잘 맞는 이유는 지역성: 시간(방금 쓴 건 곧 또 — 반복문의 변수) · 공간(옆 칸을 곧 — 리스트를 차례로). 꽉 차면 LRU(가장 오래 안 쓴 것)를 버린다 — 파이썬 흉내 simulate(blocks, size) 로 적중 세기. functools.lru_cache 는 같은 생각으로 함수 결과를 기억(cache_info). 2차원 배열은 줄 단위로 붙어 있어서 a[r][c] 를 행 순서로 돌면 적중, 열 순서면 실패투성이 — 파이썬 리스트로 시간을 재면 차이가 잘 안 보이니 개념만(C · numpy 에서 큼).',
  terms: { '캐시': 'CPU 가까이 둔 작고 빠른 메모리. 자주 쓰는 RAM 내용의 사본을 담아 둬요', '적중': '찾는 값이 캐시에 있어서 바로 쓰는 것. 영어로 hit. 없으면 실패(miss)', '캐시 라인': '캐시가 RAM 에서 한 번에 가져오는 덩어리. 보통 64바이트. 이 레슨에서는 「블록」 이라고도 불러요', '지역성': '프로그램이 방금 쓴 것(시간)과 그 옆(공간)을 곧 또 쓰는 성질. 캐시가 잘 맞는 이유', 'LRU': 'Least Recently Used — 캐시가 꽉 찼을 때 가장 오래 안 쓴 것부터 버리는 방법' },
  pages: [
    { title: 'RAM 100 ns · SSD 100 µs — 속도 표', html: `<p>[[레슨:C7]] 의 CPU 는 명령마다 메모리를 읽었어요. 그런데 진짜 RAM 은 CPU 보다 <b>수백 배 느려요</b>. 그래서 컴퓨터는 저장하는 곳을 층층이 둬요. 위로 갈수록 빠르고, 작고, 비싸요.</p>
<table class="kb"><tbody><tr><th>어디</th><th>크기(대략)</th><th>한 번 읽기(대략)</th><th>1 클록 = 1초로 늘리면</th></tr>
<tr><td>레지스터</td><td>수백 바이트</td><td>0.3 ns</td><td>1초</td></tr>
<tr><td>L1 캐시</td><td>32~64 KB</td><td>1 ns</td><td>3초</td></tr>
<tr><td>L2 캐시</td><td>1~2 MB</td><td>4 ns</td><td>13초</td></tr>
<tr><td>L3 캐시</td><td>수십 MB</td><td>15 ns</td><td>50초</td></tr>
<tr><td>RAM</td><td>8~32 GB</td><td>100 ns</td><td>약 6분</td></tr>
<tr><td>SSD</td><td>0.5~2 TB</td><td>100 µs</td><td>약 4일</td></tr>
<tr><td>HDD</td><td>몇 TB</td><td>10 ms</td><td>약 1년</td></tr></tbody></table>
<p>ns(나노초)는 10억분의 1초, µs(마이크로초)는 100만분의 1초, ms 는 1000분의 1초예요. 숫자는 컴퓨터마다 다른 <b>대략</b>이에요. 중요한 건 <b>몇 배씩 차이 나는지</b>예요.</p>
<p>오른쪽 칸이 「사람 시간」 비유예요. CPU 가 한 박자(약 0.3 ns)를 1초로 느낀다면, RAM 에서 값 하나 가져오는 데 6분을 멍하니 기다리고, SSD 는 나흘, HDD 는 1년이에요. 그래서 CPU 바로 옆에 [[캐시]]를 둬요. 자주 쓰는 RAM 내용의 <b>사본</b>을 담아 두는 작고 빠른 메모리예요.</p>
<ul><li>L1 · L2 · L3 은 CPU 칩 안에 있어요. 숫자가 작을수록 가깝고 빠르고 작아요</li>
<li>RAM 은 전원을 끄면 지워져요. SSD · HDD 는 남아요 — 그래서 파일은 SSD 에, 실행 중인 프로그램은 RAM 에 있어요</li></ul>
<p>예제는 표의 「사람 시간」 을 직접 계산해요. <code>ns / 0.3</code> 이 「한 박자가 1초일 때 몇 초」 예요.</p>`,
      example: { code: `levels = [
    ("레지스터", 0.3),
    ("L1 캐시", 1),
    ("L2 캐시", 4),
    ("L3 캐시", 15),
    ("RAM", 100),
    ("SSD", 100_000),
    ("HDD", 10_000_000),
]
for name, ns in levels:
    sec = ns / 0.3                # 한 박자(0.3 ns)를 1초로 늘리면
    print(f"{name:<8} {ns:>12,} ns → 사람 시간 {sec:>12,.0f}초")` } },
    { title: 'block = addr // 64 — 지역성', html: `<p>캐시는 작아요. 그런데도 잘 맞히는 건 프로그램에 버릇이 있어서예요. 이 버릇을 [[지역성]]이라고 해요.</p>
<ul><li><b>시간 지역성</b> — 방금 쓴 것은 곧 또 써요. 반복문의 <code>total</code> · <code>i</code> 는 한 바퀴마다 다시 써요</li>
<li><b>공간 지역성</b> — 방금 쓴 것의 <b>옆 칸</b>을 곧 써요. 리스트를 0번 · 1번 · 2번 … 차례로 읽는 게 그래요</li></ul>
<p>공간 지역성을 살리려고, 캐시는 값 하나만 가져오지 않고 그 둘레를 <b>덩어리째</b> 가져와요. 이 덩어리가 [[캐시 라인]](이 레슨에서는 「블록」)이고 보통 64바이트예요. 주소를 64 로 나눈 몫이 블록 번호예요. 같은 블록에 있으면 한 번에 같이 들어와요.</p>
<pre>주소 1024 ~ 1087  →  블록 16   (1024 // 64 = 16)
주소 1088 ~ 1151  →  블록 17</pre>
<p>4바이트 정수가 1024번지부터 줄지어 있는 배열을 차례로 읽으면, 정수 16개가 한 블록이에요. 첫 정수는 캐시에 없어서 실패(miss) — 블록을 통째로 가져와요. 나머지 15개는 이미 와 있어서 [[적중]](hit)이에요. 예제는 정수 20개를 읽으며 어느 게 실패인지 찍어요.</p>`,
      example: { code: `BLOCK = 64          # 캐시 라인 크기(바이트)
start = 1024        # 배열이 시작하는 주소
seen = set()        # 이미 가져온 블록들(캐시가 아주 크다고 칠게요)
hits = 0
for i in range(20):
    addr = start + 4 * i            # 정수 하나 = 4바이트
    block = addr // BLOCK
    if block in seen:
        hits += 1
        result = "적중"
    else:
        seen.add(block)
        result = "실패 → 블록을 통째로 가져옴"
    print(f"a[{i:>2}] 주소 {addr}  블록 {block}  {result}")
print(f"적중 {hits} / 20 = {hits / 20:.0%}")` } },
    { title: 'if block in cache: — 적중 · 실패 세기', html: `<p>캐시가 꽉 차면 무언가를 버려야 새 블록을 넣을 수 있어요. 흔한 방법이 [[LRU]] — <b>가장 오래 안 쓴 것</b>부터 버려요(시간 지역성: 오래 안 쓴 건 앞으로도 안 쓸 것 같으니까). 리스트로 흉내 내 볼게요. 앞쪽이 오래된 것, 뒤쪽이 방금 쓴 것이에요.</p>
<pre>def simulate(blocks, size):
    cache = []                    # 앞쪽 = 오래 안 쓴 것, 뒤쪽 = 방금 쓴 것
    hits = 0
    for block in blocks:
        if block in cache:        # 적중
            hits += 1
            cache.remove(block)
            cache.append(block)   # 방금 썼으니 맨 뒤로
        else:                     # 실패 — RAM 에서 가져오기
            if len(cache) == size:
                cache.pop(0)      # 꽉 찼으면 가장 오래 안 쓴 것 버리기
            cache.append(block)
    return hits

print(simulate([1, 2, 1, 3, 1, 2], 2))   # 2</pre>
<ol><li><code>block in cache</code> 면 적중 — 세고, 그 블록을 맨 뒤로 옮겨요(방금 썼으니까)</li>
<li>아니면 실패 — 꽉 찼으면 맨 앞(가장 오래 안 쓴 것)을 <code>pop(0)</code> 으로 버리고, 새 블록을 맨 뒤에 넣어요</li></ol>
<p>적중률(적중 ÷ 전체)이 속도를 정해요. 적중률 95% 와 90% 는 비슷해 보이지만, 실패가 5% 에서 10% 로 <b>두 배</b>예요. 실패 하나가 적중 백 번만큼 느리니 큰 차이예요.</p>
<p>파이썬에도 같은 생각의 도구가 있어요. 함수 위에 <code>@functools.lru_cache</code> 를 붙이면, 같은 인자로 부른 결과를 기억해 두었다가 다시 계산하지 않고 돌려줘요. 꽉 차면 LRU 로 버려요. <code>@</code> 는 <a href="../python/#lesson/L18D" target="_blank" rel="noopener">파이썬 교과서 「데코레이터」 ↗</a> 예요.</p>
<pre>import functools

@functools.lru_cache(maxsize=2)
def square(n):
    print("  계산", n)
    return n * n

for n in [2, 3, 2, 4, 3]:
    print(n, "→", square(n))
print(square.cache_info())</pre>
<p>2 는 두 번째부터 「계산」 없이 나와요. 4 를 넣을 때 칸이 둘뿐이라 가장 오래 안 쓴 3 을 버려서, 마지막 3 은 다시 계산해요. <code>cache_info()</code> 는 적중(hits) · 실패(misses) 수를 알려 줘요.</p>`,
      example: { code: `def simulate(blocks, size):
    cache = []                    # 앞쪽 = 오래 안 쓴 것, 뒤쪽 = 방금 쓴 것
    hits = 0
    for block in blocks:
        if block in cache:        # 적중
            hits += 1
            cache.remove(block)
            cache.append(block)   # 방금 썼으니 맨 뒤로
        else:                     # 실패 — RAM 에서 가져오기
            if len(cache) == size:
                cache.pop(0)      # 꽉 찼으면 가장 오래 안 쓴 것 버리기
            cache.append(block)
    return hits

blocks = [1, 2, 3, 1, 4, 1, 2, 5, 1, 2]
for size in [2, 3, 4]:
    hits = simulate(blocks, size)
    print(f"캐시 {size}칸: 적중 {hits} / {len(blocks)} = {hits / len(blocks):.0%}")

import functools

@functools.lru_cache(maxsize=2)
def square(n):
    print("  계산", n)
    return n * n

print()
for n in [2, 3, 2, 4, 3]:
    print(n, "→", square(n))
print(square.cache_info())` } },
    { title: '행 순서 vs 열 순서: a[r][c] 의 주소', html: `<p>2차원 배열(표)은 메모리에서 <b>한 줄로</b> 놓여요. 0행을 다 놓고, 그다음 1행 … 이렇게요. 그래서 <code>a[r][c]</code> 의 주소는 <code>시작 + (r × 열 수 + c) × 4</code> 예요(정수 하나 4바이트).</p>
<pre>16 × 16 표, 정수 4바이트 → 한 행 = 64바이트 = 블록 하나

행 순서 a[0][0] a[0][1] … a[0][15] a[1][0] …   → 같은 블록을 16번씩
열 순서 a[0][0] a[1][0] … a[15][0] a[0][1] …   → 매번 다른 블록</pre>
<p>행 순서로 돌면 블록 하나를 가져와 16칸을 다 써요. 열 순서로 돌면 한 칸 쓰고 다음 행(다른 블록)으로 가요. 캐시가 4블록뿐이면 16행을 도는 동안 처음 블록은 이미 버려져서 <b>매번 실패</b>예요. 같은 계산인데 도는 순서만 바꿔서 적중률이 94% 와 0% 로 갈려요.</p>
<pre>for r in range(16):          # 행 순서 — 빠름
    for c in range(16):
        total += a[r][c]

for c in range(16):          # 열 순서 — 캐시 실패투성이
    for r in range(16):
        total += a[r][c]</pre>
<div class="bk-warn"><b>파이썬으로 시간을 재 보면 차이가 잘 안 보여요</b> — 파이썬 리스트는 숫자 자체가 아니라 「숫자가 있는 곳」 을 담고, 한 줄 한 줄 처리하는 데 드는 시간이 훨씬 커서 캐시 효과가 묻혀요. 잴 때마다 들쭉날쭉하기도 해요. 이 쪽은 <b>개념</b>만 가져가세요. C 나 numpy 처럼 숫자가 진짜로 붙어 있는 배열에서는 몇 배씩 차이 나요.</div>`,
      example: { code: `def simulate(blocks, size):
    cache = []                    # 앞쪽 = 오래 안 쓴 것, 뒤쪽 = 방금 쓴 것
    hits = 0
    for block in blocks:
        if block in cache:        # 적중
            hits += 1
            cache.remove(block)
            cache.append(block)   # 방금 썼으니 맨 뒤로
        else:                     # 실패 — RAM 에서 가져오기
            if len(cache) == size:
                cache.pop(0)      # 꽉 찼으면 가장 오래 안 쓴 것 버리기
            cache.append(block)
    return hits

ROWS = COLS = 16
start = 0

def address(r, c):
    return start + (r * COLS + c) * 4

row_order = []
for r in range(ROWS):
    for c in range(COLS):
        row_order.append(address(r, c) // 64)

col_order = []
for c in range(COLS):
    for r in range(ROWS):
        col_order.append(address(r, c) // 64)

print("행 순서 처음 블록들:", row_order[:20])
print("열 순서 처음 블록들:", col_order[:20])
for name, blocks in [("행 순서", row_order), ("열 순서", col_order)]:
    hits = simulate(blocks, 4)
    print(f"{name}: 적중 {hits} / {len(blocks)} = {hits / len(blocks):.1%}")` } },
  ],
  summary: ['가까울수록 빠르고 작다 — 레지스터 · 캐시 · RAM · SSD 는 수백~수십만 배 차이', '지역성(방금 쓴 것 · 옆 칸) 덕분에 작은 캐시가 잘 맞고, 블록을 통째로 가져온다', '적중률이 속도를 정한다 — 꽉 차면 LRU, 배열은 붙어 있는 순서대로 돌기'] },
{ id: 'C9', ch: 2, n: 9, title: '컴파일러와 인터프리터', mode: 'text',
  tutorSummary: 'CPU 는 기계어만 읽으니 사람 말(코드)을 바꾸는 길이 둘 — 컴파일러는 실행 전에 통째로 미리 번역(C · Rust · Go → 실행 파일, 실행은 빠르고 문법 에러는 실행 전에), 인터프리터는 실행하면서 한 줄씩 그때그때(셸 · 계산기). 파이썬은 둘을 섞음: 먼저 파일 전체를 바이트코드로 컴파일(그래서 SyntaxError 는 한 줄도 실행 전에, compile · exec, __pycache__ 의 .pyc), 그다음 파이썬 가상 머신이 바이트코드를 하나씩 — dis.dis(함수) · dis.get_instructions 로 LOAD_FAST · BINARY_OP + · RETURN_VALUE(버전마다 조금 다름). C 는 gcc 가 미리 기계어로(lea eax, [rdi+rsi] · ret, 어셈블리어 교과서 gcc -S). 장난감 컴파일러: "7 + 5 - 2" → C7 장난감 CPU 숫자. JIT 는 실행하면서 자주 도는 부분만 기계어로(PyPy · 자바스크립트 V8 · 자바). 그래서 빠르기가 다름 — timeit 으로 for 더하기 vs sum()(C 로 짠 내장) 비교, 숫자는 컴퓨터 · 실행마다 다름.',
  terms: { '컴파일러': '프로그램 전체를 실행하기 전에 미리 기계어(또는 다른 말)로 번역해 두는 프로그램. 예: C 의 gcc', '인터프리터': '프로그램을 실행하면서 한 줄(한 명령)씩 그때그때 읽고 처리하는 프로그램', '바이트코드': '파이썬이 내 코드를 먼저 바꿔 두는 중간 명령. CPU 가 아니라 파이썬 가상 머신이 읽어요', 'JIT': 'Just-In-Time 컴파일 — 실행하는 도중에 자주 도는 부분을 골라 기계어로 바꿔 빠르게 하는 방법' },
  pages: [
    { title: '미리 번역 vs 그때그때: compile · exec', html: `<p>CPU 는 [[레슨:C7]] 에서 본 것처럼 기계어 숫자만 읽어요. 그래서 사람이 쓴 코드를 기계어로 바꾸는 길이 둘 있어요.</p>
<table class="kb"><tbody><tr><th></th><th>컴파일러</th><th>인터프리터</th></tr>
<tr><td>언제 바꾸나</td><td>실행 <b>전에</b> 통째로</td><td>실행<b>하면서</b> 한 줄씩</td></tr>
<tr><td>비유</td><td>책 한 권을 미리 번역해 둔 번역서</td><td>옆에서 한 문장씩 통역</td></tr>
<tr><td>결과물</td><td>실행 파일(.exe) — 다음엔 번역 없이 바로</td><td>따로 없음 — 실행할 때마다 다시</td></tr>
<tr><td>문법 실수</td><td>실행 전에 다 찾아 줌</td><td>그 줄에 가서야 앎</td></tr>
<tr><td>예</td><td>C · C++ · Rust · Go</td><td>셸(터미널 명령), 계산기</td></tr></tbody></table>
<p>[[컴파일러]]로 만든 실행 파일은 CPU 가 바로 읽어서 빨라요. 대신 고칠 때마다 다시 번역해야 하고, Windows 용 .exe 는 맥에서 안 돌아요. [[인터프리터]]는 바로 고쳐 바로 돌리기 편하지만, 실행할 때마다 읽고 해석하느라 느려요.</p>
<p><b>파이썬은 둘을 섞어요.</b> 먼저 파일 전체를 [[바이트코드]]라는 중간 명령으로 <b>컴파일</b>하고, 그다음 파이썬 가상 머신(인터프리터)이 바이트코드를 하나씩 실행해요. 그래서 이런 일이 생겨요.</p>
<ul><li>세 번째 줄에 괄호를 안 닫으면(<code>SyntaxError</code>) — 첫 줄도 실행 안 되고 바로 에러. 실행 전에 통째로 번역하다 걸려서예요</li>
<li>세 번째 줄에 없는 변수를 쓰면(<code>NameError</code>) — 앞 두 줄은 실행되고 그 줄에서 에러. 번역은 됐고, 실행하다 걸려서예요</li></ul>
<p>파이썬의 <code>compile(글자, 파일 이름, "exec")</code> 이 바로 그 「바이트코드로 번역」 이고, <code>exec(…)</code> 가 실행이에요. 예제로 두 경우를 견줘 봐요. 한 번 번역한 바이트코드는 <code>__pycache__</code> 폴더의 <code>.pyc</code> 파일로 남겨 두기도 해요(import 한 모듈).</p>`,
      example: { code: `run_error = 'print("하나")\\nprint("둘")\\nprint(없는변수)'
syntax_error = 'print("하나")\\nprint("둘")\\nprint("셋"'

for name, src in [("실행 중 에러", run_error), ("문법 에러", syntax_error)]:
    print("---", name)
    try:
        code = compile(src, "test.py", "exec")   # ① 통째로 바이트코드로
        print("(번역 성공 — 이제 실행)")
        exec(code)                                # ② 하나씩 실행
    except SyntaxError as e:
        print("SyntaxError — 번역에서 걸려서 한 줄도 실행 안 됨:", e.msg)
    except NameError as e:
        print("NameError — 실행하다 걸림, 앞 두 줄은 이미 실행됨:", e)` } },
    { title: 'dis.dis(add) — 파이썬 바이트코드 보기', html: `<p>파이썬이 만든 바이트코드는 <code>dis</code> 모듈로 볼 수 있어요(disassemble, 「숫자를 글자 명령으로 풀기」).</p>
<pre>import dis

def add(a, b):
    return a + b

dis.dis(add)</pre>
<p>파이썬 3.12 에서는 이렇게 나와요.</p>
<pre>  3           0 RESUME                   0

  4           2 LOAD_FAST                0 (a)
              4 LOAD_FAST                1 (b)
              6 BINARY_OP                0 (+)
             10 RETURN_VALUE</pre>
<ul><li><code>LOAD_FAST a</code> · <code>LOAD_FAST b</code> — a 와 b 를 꺼내 올려놓기. [[레슨:C7]] 장난감 CPU 의 LOAD 같은 거예요</li>
<li><code>BINARY_OP +</code> — 올려놓은 둘을 더하기. ADD 예요</li>
<li><code>RETURN_VALUE</code> — 결과를 돌려주기</li>
<li>왼쪽의 4 는 내 코드의 줄 번호, 0 · 2 · 4 … 는 바이트코드 안의 위치(장난감 CPU 의 칸 번호 같은 것)예요. <code>RESUME</code> 은 파이썬이 안에서 쓰는 준비 명령이라 넘어가요</li></ul>
<p>장난감 CPU 와 다른 점은, 레지스터 R0 · R1 대신 <b>스택</b>(접시 쌓기)에 값을 쌓았다가 위에서부터 꺼내 계산한다는 거예요. 그래도 「명령 하나씩 가져와 실행」 은 똑같아요. 파이썬 가상 머신은 C 로 짠 커다란 <code>while</code> + 갈래 — 우리가 만든 <code>run</code> 과 같은 모양이에요.</p>
<p>명령을 하나씩 꺼내 쓰고 싶으면 <code>dis.get_instructions(함수)</code> 예요. 명령마다 <code>opname</code>(이름) · <code>argrepr</code>(읽기 좋은 인자)가 있어요.</p>
<div class="bk-warn"><b>버전마다 조금 달라요</b> — 바이트코드는 파이썬 내부 약속이라 버전이 바뀌면 달라져요. 3.13 은 <code>LOAD_FAST_LOAD_FAST (a, b)</code> 처럼 둘을 한 명령으로 합치고, 위치 숫자는 안 보여 줘요. 내 화면이 위와 조금 달라도 괜찮아요. <code>BINARY_OP</code> 는 3.11 부터 같아요.</div>`,
      example: { code: `import dis
import sys

def add(a, b):
    return a + b

print("파이썬", sys.version.split()[0])
dis.dis(add)

print()
print("명령 하나씩:")
for ins in dis.get_instructions(add):
    print(" ", ins.opname, ins.argrepr)

def area(w, h):
    return w * h + 10

print()
print("w * h + 10 의 계산 명령만:")
for ins in dis.get_instructions(area):
    if ins.opname == "BINARY_OP":
        print(" ", ins.opname, ins.argrepr)` } },
    { title: 'gcc 는 미리 기계어로 · 내 작은 컴파일러', html: `<p>C 는 [[컴파일러]] 언어예요. <code>gcc</code> 가 실행 전에 C 코드를 CPU 의 기계어로 통째로 바꿔 실행 파일을 만들어요.</p>
<pre>int add(int a, int b) {
    return a + b;
}</pre>
<p><code>gcc -O2 -S</code> 로 어떤 명령이 됐는지 보면 x86-64 에서는 단 두 줄이에요(인자 a · b 는 레지스터 rdi · rsi 로 들어와요).</p>
<pre>add:
    lea  eax, [rdi+rsi]    ; eax = a + b
    ret                    ; 돌아가기  — 기계어로는 8d 04 37 c3, 4바이트</pre>
<p>파이썬 바이트코드처럼 「누가 하나씩 읽어 줄」 필요 없이 CPU 가 바로 읽어요. 직접 해 보는 건 <a href="../asm/#lesson/R15" target="_blank" rel="noopener">어셈블리어 교과서 「C 가 어떻게 바뀌나: gcc -S · objdump -d」 ↗</a> 에서 우분투로 해요.</p>
<p>컴파일러가 하는 일을 작게 흉내 내 볼게요. <code>"7 + 5 - 2"</code> 같은 글자를 [[레슨:C7]] 장난감 CPU 의 기계어 숫자로 <b>미리</b> 바꿔 메모리에 담아요. 숫자들은 메모리 끝 칸부터 넣고, 명령은 0번 칸부터 넣어요.</p>
<pre>"7 + 5 - 2"  →  LOAD R0, 15   (15번 칸 = 7)
                LOAD R1, 14   (14번 칸 = 5)
                ADD R0, R1
                LOAD R1, 13   (13번 칸 = 2)
                SUB R0, R1
                PRINT R0
                HALT</pre>
<p>한 번 번역해 두면 그 숫자들(실행 파일)은 몇 번이든 번역 없이 바로 돌릴 수 있어요. 이게 컴파일러가 빠른 이유예요.</p>
<p><b>[[JIT]]</b> — 둘의 중간도 있어요. 처음엔 인터프리터처럼 돌다가, <b>자주 도는 부분</b>을 실행 도중에 기계어로 바꿔 빠르게 해요. 이름만 알아 두세요: PyPy(빠른 파이썬), 크롬의 자바스크립트(V8), 자바. 파이썬 3.13 에도 실험용 JIT 가 들어갔어요(기본은 꺼져 있어요).</p>`,
      example: { code: `def compile_expr(text):
    # "7 + 5 - 2" → 장난감 CPU(C7) 기계어가 든 메모리 16칸
    tokens = text.split()
    nums = tokens[0::2]          # ["7", "5", "2"]
    ops = tokens[1::2]           # ["+", "-"]
    mem = [0] * 16
    code = []
    slot = 15                    # 숫자는 끝 칸부터
    mem[slot] = int(nums[0])
    code.append(1000 + slot)     # LOAD R0, 칸
    for op, n in zip(ops, nums[1:]):
        slot -= 1
        mem[slot] = int(n)
        code.append(1100 + slot) # LOAD R1, 칸
        if op == "+":
            code.append(2001)    # ADD R0, R1
        else:
            code.append(3001)    # SUB R0, R1
    code.append(6000)            # PRINT R0
    code.append(0)               # HALT
    for addr, word in enumerate(code):
        mem[addr] = word
    return mem

NAMES = ["HALT", "LOAD", "ADD", "SUB", "JMP", "JZ", "PRINT"]

def decode(word):
    op = word // 1000          # 천의 자리: 명령 번호
    r = word // 100 % 10       # 백의 자리: 레지스터
    x = word % 100             # 끝 두 자리: 주소나 레지스터
    return op, r, x

def run(mem):
    reg = [0, 0, 0, 0]
    pc = 0
    while True:
        word = mem[pc]             # ① 가져오기
        pc = pc + 1
        op, r, x = decode(word)    # ② 해석
        if op == 0:                # ③ 실행 — HALT
            break
        elif op == 1:              # LOAD r, 주소
            reg[r] = mem[x]
        elif op == 2:              # ADD r, s
            reg[r] = reg[r] + reg[x]
        elif op == 3:              # SUB r, s
            reg[r] = reg[r] - reg[x]
        elif op == 4:              # JMP 주소
            pc = x
        elif op == 5:              # JZ r, 주소
            if reg[r] == 0:
                pc = x
        elif op == 6:              # PRINT r
            print(reg[r])

mem = compile_expr("7 + 5 - 2")
print("번역 결과(기계어):", mem)
print("실행:")
run(mem)
run(mem)
print("다른 식:")
run(compile_expr("10 + 20 + 30 - 1"))` } },
    { title: 'timeit 으로 빠르기 재기: for vs sum()', html: `<p>그래서 언어마다, 같은 언어에서도 쓰는 방법마다 빠르기가 달라요. 파이썬의 <code>timeit</code> 모듈로 재 봐요. <code>timeit.timeit(함수, number=20)</code> 은 함수를 20번 돌린 시간(초)을 돌려줘요.</p>
<pre>import timeit

def loop_sum():
    total = 0
    for i in range(100_000):
        total += i
    return total

def builtin_sum():
    return sum(range(100_000))

print(timeit.timeit(loop_sum, number=20))
print(timeit.timeit(builtin_sum, number=20))</pre>
<p>어느 PC 에서 한 번 잰 예예요. <b>숫자는 컴퓨터마다, 잴 때마다 달라요.</b></p>
<pre>for 로 더하기: 0.053초 (20번)
sum() 으로:    0.021초 (20번)</pre>
<ul><li><b>for 로 더하기</b> — 한 바퀴마다 바이트코드 여러 개(값 꺼내기 · 더하기 · 저장 · 다음 i)를 파이썬 가상 머신이 하나씩 읽고 처리해요</li>
<li><b>sum()</b> — 파이썬에 들어 있는 함수라 <b>C 로 짜서 미리 기계어로 컴파일</b>되어 있어요. 반복이 기계어 안에서 돌아요</li></ul>
<p>그래서 파이썬에서는 「직접 for 를 돌리기보다 들어 있는 함수(<code>sum</code> · <code>sorted</code> · <code>join</code>)를 쓰기」 가 보통 더 빨라요. 숫자 계산을 많이 하는 numpy 가 빠른 것도 속이 C 로 컴파일되어 있어서예요. 같은 일을 C 로 짜면 보통 이것보다도 몇십 배 빨라요.</p>
<div class="bk-warn"><b>시간은 늘 들쭉날쭉</b> — 다른 프로그램 · 전원 설정 · 캐시([[레슨:C8]]) 때문에 잴 때마다 달라요. 비교할 때는 같은 PC 에서 여러 번 재고, 「몇 배 차이」 를 보세요.</div>`,
      example: { code: `import timeit

def loop_sum():
    total = 0
    for i in range(100_000):
        total += i
    return total

def builtin_sum():
    return sum(range(100_000))

print("답이 같나:", loop_sum() == builtin_sum())
t1 = timeit.timeit(loop_sum, number=20)
t2 = timeit.timeit(builtin_sum, number=20)
print(f"for 로 더하기: {t1:.3f}초 (20번)")
print(f"sum() 으로:    {t2:.3f}초 (20번)")
print(f"sum() 이 약 {t1 / t2:.1f}배 빨라요 — 숫자는 컴퓨터 · 실행마다 달라요")` } },
  ],
  summary: ['컴파일러는 미리 통째로, 인터프리터는 실행하며 한 줄씩 — 파이썬은 바이트코드로 컴파일한 뒤 하나씩 실행', 'dis 로 바이트코드(LOAD_FAST · BINARY_OP)를 본다 — 장난감 CPU 의 LOAD · ADD 와 같은 생각', '그래서 빠르기가 다르다 — C 로 컴파일된 sum() 이 for 보다 빠름, timeit 숫자는 매번 달라요'] },
{ id: 'CB2', ch: 2, boss: true, title: '만들어 보기: 장난감 CPU 시뮬레이터', mode: 'text',
  tutorSummary: '챕터 2 묶기 — C7 의 장난감 CPU 를 그대로 키운다: 명령 8개(0 HALT · 1 LOAD r, 칸 · 2 ADD r, s · 3 SUB r, s · 4 JMP 칸 · 5 JZ r, 칸 · 6 PRINT r · 7 STORE r, 칸 = mem[칸] = r), 레지스터 R0~R3, 메모리 32칸, 명령 = 4자리 10진수(7231 = STORE R2, 31). ① run(mem) 이 가져오기 → 해석 → 실행을 하며 단계마다 「단계 · PC · 명령 · 레지스터」 를 찍고 HALT 에서 단계 수 ② 어셈블러(assemble)로 글자 프로그램 목록을 숫자로 — 곱하기 a × b 는 더하기를 b 번(JZ · ADD · SUB · JMP), 결과를 STORE 로 31번 칸에 ③ 최대 단계(max_steps)로 끝나지 않는 반복 막기, PC · 칸이 메모리 밖이거나 모르는 명령이면 멈추고 알리기 ④ 입력으로 프로그램과 DATA 줄을 받아 먼저 다 번역(모르는 명령이면 실행 안 함 — C9 의 컴파일러)하고 실행.',
  pages: [], summary: [] },
{ id: 'C10', ch: 3, n: 10, title: '운영체제가 하는 일', mode: 'text',
  tutorSummary: '운영체제(커널) = 프로그램들과 하드웨어 사이의 관리자: CPU 차례 · 메모리 칸 · 파일 · 장치. 프로그램 = 디스크의 파일, 프로세스 = 실행 중인 것(PID, os.getpid · os.getppid, subprocess 로 자식 프로세스). 프로그램은 하드웨어를 직접 못 만지고 커널에게 부탁(시스템 콜) — open() · print() 도 속에서는 os.open · os.write. 맛보기만 — 자세히는 운영체제 교과서 K0 · K6 · K10 · K16.',
  terms: { '커널': '운영체제의 한가운데. CPU · 메모리 · 디스크 · 장치를 직접 다루고 프로그램들에게 나눠 주는 관리자 프로그램', '프로세스': '실행 중인 프로그램 하나. 같은 프로그램 파일을 두 번 켜면 프로세스가 둘', 'PID': '프로세스 번호(Process ID). 운영체제가 프로세스마다 붙여 주는 번호로, 켤 때마다 달라요', '시스템 콜': '프로그램이 운영체제(커널)에게 「이것 좀 해 주세요」 하고 부탁하는 정해진 창구. 파일 열기 · 쓰기 · 프로그램 켜기 같은 일' },
  pages: [
    { title: '운영체제 = 프로그램과 기계 사이의 관리자', html: `<p>지금 내 컴퓨터에서는 VS Code · 브라우저 · 메신저 · 파이썬 같은 프로그램 수십 개가 <b>CPU 몇 개 · 메모리 하나 · 디스크 하나</b>를 같이 써요. 서로 마구 쓰면 엉망이 되겠죠. 그래서 가운데에 <b>관리자</b>가 있어요. 그게 <b>운영체제</b>(Windows · macOS · 리눅스)이고, 그 한가운데 프로그램이 [[커널]]이에요.</p><pre>프로그램들   VS Code · 크롬 · python …\n     ↓ 부탁해요(시스템 콜)      ↑ 결과\n운영체제     Windows · 리눅스 — 한가운데가 커널\n     ↓ 진짜로 시켜요            ↑ 신호\n하드웨어     CPU · 메모리 · 디스크 · 키보드 · 화면 · 네트워크</pre><p>운영체제가 하는 일은 크게 네 가지예요.</p><table class="kb"><tbody><tr><th>무엇을</th><th>운영체제가 하는 일</th><th>이 교과서에서</th></tr><tr><td>CPU</td><td>누가 언제 계산할지 차례를 정해요</td><td>[[레슨:C11]] 번갈아 쓰기</td></tr><tr><td>메모리</td><td>프로그램마다 칸을 나눠 주고, 남의 칸은 못 보게 막아요</td><td>[[레슨:C11]] 자기 메모리</td></tr><tr><td>파일</td><td>바이트에 이름을 붙여 디스크에 저장해요</td><td>[[레슨:C11]] 파일 = 이름 붙은 바이트</td></tr><tr><td>장치</td><td>키보드 · 화면 · 네트워크 카드를 다뤄요</td><td>챕터 4 네트워크</td></tr></tbody></table><p>예제를 실행하면 내 운영체제 이름과 CPU 코어 수가 나와요. 코어 수는 컴퓨터마다 달라요(4 · 8 · 16 …). 그런데 켜 둔 프로그램은 훨씬 많죠? 코어보다 많은 프로그램이 「동시에」 도는 비밀이 다음 레슨이에요.</p>`,
      example: { code: `import os\nimport platform\n\nprint("운영체제:", platform.system())\nprint("CPU 코어 수:", os.cpu_count())\n\njobs = [\n    ("CPU", "누가 언제 계산할지 차례 정하기"),\n    ("메모리", "프로그램마다 칸 나눠 주기"),\n    ("파일", "이름 붙여 디스크에 저장하기"),\n    ("장치", "키보드 · 화면 · 네트워크 다루기"),\n]\nfor what, job in jobs:\n    print(what, "→", job)` } },
    { title: '프로그램 vs 프로세스 · os.getpid()', html: `<p><b>프로그램</b>은 디스크에 있는 <b>파일</b>이에요(<code>python.exe</code>, 내가 만든 <code>hello.py</code>). 그 파일을 실행하면 운영체제가 메모리에 올리고 번호를 붙여 줘요. 이렇게 <b>실행 중인 것</b>이 [[프로세스]]이고, 번호가 [[PID]]예요.</p><ul><li>같은 프로그램을 두 번 켜면 → 프로세스 둘, PID 둘 (메모장 창 두 개처럼)</li><li>프로그램을 끄면 → 프로세스가 사라지고, PID 는 나중에 다른 프로세스가 다시 쓸 수 있어요</li></ul><pre>import os\nprint(os.getpid())    # 내 PID — 실행할 때마다 달라요\nprint(os.getppid())   # 부모 PID — 나를 켠 프로세스(터미널)</pre><p>프로세스는 다른 프로세스를 켤 수 있어요. 켠 쪽이 <b>부모</b>, 켜진 쪽이 <b>자식</b>이에요. VS Code 터미널(부모)이 <code>python hello.py</code>(자식)를 켜는 것처럼요. 파이썬에서는 <code>subprocess</code> 로 켜요.</p><table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>subprocess.run([sys.executable, "-c", 코드])</code></td><td>자식 파이썬을 켜고 <b>끝날 때까지 기다려요</b>. <code>capture_output=True, text=True</code> 면 자식이 찍은 글을 <code>.stdout</code> 으로 받아요</td></tr><tr><td><code>p = subprocess.Popen([...])</code></td><td>켜기만 하고 <b>안 기다려요</b>. 여러 개를 동시에 켤 때. 자식의 PID 는 <code>p.pid</code>, 자식에게 글을 보내고 끝날 때까지 찍은 글을 받으려면 <code>out, _ = p.communicate(글)</code></td></tr></tbody></table><p><code>sys.executable</code> 은 지금 돌고 있는 파이썬 프로그램 파일의 경로예요. 예제를 실행하면 마지막 줄에 <code>자식의 부모가 나인가: True</code> 가 나와요.</p><div class="bk-warn"><b>PID 숫자는 외우지 않아요</b> — 실행할 때마다 달라져요. 그래서 이 교과서의 「만들어 보기」 는 PID 를 그대로 찍지 않고 「서로 다른가」 · 「부모가 나인가」 처럼 <code>True</code> / <code>False</code> 로 확인해요.</div><p>내 컴퓨터의 프로세스 목록은 <b>작업 관리자</b>(<code>Ctrl</code> + <code>Shift</code> + <code>Esc</code>) → 「세부 정보」 탭에서 볼 수 있어요. PID 열이 바로 이 번호예요. 예제는 너무 빨리 끝나서 목록에서 찾기 어려워요. 끝에 <code>input("엔터 ▶ ")</code> 을 넣으면 엔터를 누를 때까지 프로세스가 살아 있어서 찾아볼 수 있어요.</p>`,
      example: { code: `import os\nimport subprocess\nimport sys\n\nprint("나(이 파이썬) PID:", os.getpid())\nprint("나를 켠 부모 PID:", os.getppid())\nprint("프로그램 파일:", sys.executable)\n\n# 같은 프로그램(python)을 하나 더 켜기 — 자식 프로세스\nchild = "import os; print(os.getpid(), os.getppid())"\nresult = subprocess.run([sys.executable, "-c", child], capture_output=True, text=True)\nkid, kid_parent = result.stdout.split()\nprint("자식 PID:", kid)\nprint("자식의 부모가 나인가:", int(kid_parent) == os.getpid())` } },
    { title: '시스템 콜: open() 도 os.write 로 부탁', html: `<p>프로그램은 디스크나 화면을 <b>직접 만지지 못해요</b>. 아무 프로그램이나 디스크를 마음대로 쓰면 남의 파일을 지울 수도 있으니까요. 그래서 정해진 창구로 커널에게 <b>부탁</b>해요. 이 창구가 [[시스템 콜]]이에요.</p><pre>내 코드      open("memo.txt", "w") · f.write("안녕")\n파이썬 속    os.open(…) · os.write(…)\n시스템 콜    open · write   ← 여기서 커널로 넘어가요\n커널         디스크의 어느 칸인지 찾아 진짜로 써요\n하드웨어     SSD</pre><p><code>print</code> · <code>open</code> · <code>input</code> 도 속에서는 다 시스템 콜이에요. <code>os</code> 모듈에는 시스템 콜과 거의 같은 모양의 함수가 있어서, 한 겹 아래를 직접 불러 볼 수 있어요.</p><table class="kb"><tbody><tr><th>코드</th><th>커널에게 하는 부탁</th></tr><tr><td><code>fd = os.open(이름, os.O_WRONLY | os.O_CREAT | os.O_TRUNC)</code></td><td>「쓰기용으로 열어 주세요(없으면 만들고, 있으면 비우고)」 → 번호표(fd, 파일 설명자)를 받아요</td></tr><tr><td><code>os.write(fd, 바이트)</code></td><td>「이 바이트를 써 주세요」 → <b>실제로 쓴 바이트 수</b>를 돌려줘요</td></tr><tr><td><code>os.close(fd)</code></td><td>「다 썼어요」 → 번호표 반납</td></tr><tr><td><code>os.path.getsize(이름)</code></td><td>「이 파일 크기가 몇 바이트예요?」</td></tr></tbody></table><p>커널에게는 글자가 아니라 <b>바이트</b>를 줘요. 그래서 <code>"안녕 OS".encode()</code> 로 바꿔서 넘기고, 실행하면 <code>써 준 바이트: 9</code> 가 나와요. 한글 한 글자가 UTF-8 로 3바이트라서 「안녕」 이 6바이트예요([[레슨:C2]]).</p><div class="bk-step-box"><b>더 알아보기 → 운영체제 교과서</b><br>여기까지가 맛보기예요. 진짜 리눅스(우분투 VM)에서 커널을 직접 들여다보려면 운영체제 교과서로 가요.<ul><li><a href="../os/#lesson/K0" target="_blank" rel="noopener">운영체제 교과서 「운영체제가 하는 일」 ↗</a> — 커널 · 프로세스 · 시스템 콜</li><li><a href="../os/#lesson/K6" target="_blank" rel="noopener">운영체제 교과서 「스케줄링: 누가 먼저 CPU 를 쓰나」 ↗</a> — 번갈아 쓰기의 여러 방법</li><li><a href="../os/#lesson/K10" target="_blank" rel="noopener">운영체제 교과서 「가상 메모리: 프로세스마다 자기만의 주소」 ↗</a> — 주소 공간 · 페이지</li><li><a href="../os/#lesson/K16" target="_blank" rel="noopener">운영체제 교과서 「파일 시스템: inode 와 링크」 ↗</a> — 파일 이름과 몸통</li></ul></div>`,
      example: { code: `import os\n\n# open() 이 속에서 하는 일을 직접: os.open → os.write → os.close\nfd = os.open("memo.txt", os.O_WRONLY | os.O_CREAT | os.O_TRUNC)\nprint("운영체제가 준 번호(fd):", fd)\nn = os.write(fd, "안녕 OS".encode())\nprint("써 준 바이트:", n)\nos.close(fd)\n\nprint("파일 크기:", os.path.getsize("memo.txt"), "바이트")\nwith open("memo.txt", encoding="utf-8") as f:\n    print("다시 읽기:", f.read())` } },
  ],
  summary: ['운영체제(커널)는 CPU · 메모리 · 파일 · 장치를 나눠 주는 관리자', '프로그램은 파일, 프로세스는 실행 중인 것 — PID 는 켤 때마다 달라요', '프로그램은 시스템 콜로 커널에게 부탁해요(os.open · os.write)'] },
{ id: 'C11', ch: 3, n: 11, title: '여러 프로그램을 번갈아 · 메모리 나눠 주기', mode: 'text',
  tutorSummary: 'CPU 코어 하나는 한 번에 하나 — 운영체제가 아주 짧은 시간 조각씩 번갈아 줘서 동시에 도는 것처럼 보임(라운드 로빈을 리스트 pop(0) · append 로 흉내, 시간 줄 AABBCCAACA). 조각이 작으면 반응이 빠르지만 문맥 교환이 늘어 손해. 프로세스마다 자기 주소 공간(코드 · 데이터 · 힙 · 스택) — 자식 프로세스는 내 변수를 못 바꾸고, 같은 주소도 페이지 표로 다른 RAM 칸(스레드는 같은 프로세스라 메모리 공유). 파일 = 이름 붙은 바이트(os.stat().st_size, "rb"). 맛보기만 — 운영체제 교과서 K0 · K6 · K10 · K16.',
  terms: { '라운드 로빈': '줄 선 프로그램들에게 CPU 를 같은 크기의 시간 조각씩 차례로 돌려 주는 방법. 다 못 하면 줄 맨 뒤로', '문맥 교환': 'CPU 를 다른 프로세스에게 넘길 때 지금 하던 상태(레지스터 · 다음 명령 위치)를 저장하고 다음 것의 상태를 불러오는 일', '주소 공간': '프로세스 하나가 보는 자기만의 메모리 주소 범위. 코드 · 데이터 · 힙 · 스택이 들어 있고, 다른 프로세스의 것과 겹치지 않게 운영체제가 진짜 RAM 칸에 이어 줘요' },
  pages: [
    { title: '라운드 로빈: 조금씩 번갈아 쓰기', html: `<p>CPU 코어 하나는 한 번에 <b>한 가지 일</b>만 해요([[레슨:C7]]). 그런데 켜 둔 프로세스는 수백 개예요. 운영체제는 코어를 아주 짧게(몇 밀리초) 이 프로세스, 저 프로세스에게 번갈아 줘요. 너무 빨리 바뀌어서 사람 눈에는 <b>동시에</b> 도는 것처럼 보여요.</p><p>가장 단순한 방법이 [[라운드 로빈]]이에요. 놀이공원 줄처럼 차례로 <b>조각 하나</b>씩 주고, 다 못 했으면 줄 맨 뒤로 보내요.</p><pre>A ■■■■■   (일 5)\nB ■■      (일 2)      조각 = 2\nC ■■■     (일 3)\n\n시각  0  1  2  3  4  5  6  7  8  9  10\n      A  A  B  B  C  C  A  A  C  A\n            B 끝(4)        C 끝(9)  A 끝(10)</pre><p>예제는 이 줄 서기를 리스트로 흉내 내요. <code>jobs.pop(0)</code> 이 줄 맨 앞을 꺼내고, 일이 남았으면 <code>jobs.append(job)</code> 으로 맨 뒤에 다시 세워요. 실행하면 맨 끝에 <code>시간 줄: AABBCCAACA</code> 가 나와요.</p><div class="bk-warn"><b>흉내라서 숫자는 단순하게</b> — 진짜 운영체제는 시간 조각이 몇 밀리초이고, 급한 프로그램(키보드 · 화면)을 먼저 주는 등 훨씬 똑똑해요. 그래도 「조금씩 번갈아」 는 같아요.</div>`,
      example: { code: `jobs = [["A", 5], ["B", 2], ["C", 3]]   # [이름, 남은 일]\nq = 2          # 한 번에 주는 시간 조각\nt = 0          # 지금 시각\ntimeline = ""\n\nwhile jobs:\n    job = jobs.pop(0)                 # 줄 맨 앞\n    run = min(q, job[1])\n    job[1] -= run\n    print(f"{t:>2}~{t + run:<2}  {job[0]} 실행 (남은 일 {job[1]})")\n    t += run\n    timeline += job[0] * run\n    if job[1] > 0:\n        jobs.append(job)              # 다 못 했으면 줄 맨 뒤로\n    else:\n        print(f"        {job[0]} 끝! 시각 {t}")\n\nprint("시간 줄:", timeline)` } },
    { title: '조각 크기 · 문맥 교환의 값', html: `<p>CPU 를 넘길 때마다 운영체제는 하던 일을 저장하고(레지스터 값 · 다음 명령 위치) 다음 프로세스의 것을 불러와요. 이것이 [[문맥 교환]]이에요. 책을 읽다가 다른 책으로 바꿀 때 책갈피를 꽂고 다른 책의 책갈피를 찾는 것과 같아요. 그동안은 아무 일도 못 하니 <b>공짜가 아니에요</b>.</p><p>예제는 같은 일(A 5 · B 2 · C 3)을 조각 크기만 바꿔 돌려요.</p><table class="kb"><tbody><tr><th>조각</th><th>짧은 일 B 가 끝나는 시각</th><th>CPU 넘겨주기</th><th>느낌</th></tr><tr><td>1</td><td>5</td><td>10번</td><td>모두가 조금씩 바로 반응 — 대신 바꾸는 비용이 많아요</td></tr><tr><td>2</td><td>4</td><td>6번</td><td>중간</td></tr><tr><td>10</td><td>7</td><td>3번</td><td>먼저 온 일이 끝날 때까지 — 바꾸기는 적지만 B 가 한참 기다려요</td></tr></tbody></table><p>조각이 너무 크면 앞의 긴 일 때문에 마우스 · 키보드가 굳은 것처럼 느껴지고, 너무 작으면 바꾸는 데 시간을 다 써요. 그래서 운영체제는 그 사이의 알맞은 크기를 골라요. 어떤 일을 먼저 줄지 고르는 여러 방법(먼저 온 순서 · 짧은 것 먼저 · 우선순위)은 운영체제 교과서 K6 에서 진짜 리눅스로 봐요.</p>`,
      example: { code: `def round_robin(jobs, q):\n    left = dict(jobs)\n    queue = list(left)\n    t = 0\n    turns = 0\n    done = {}\n    while queue:\n        name = queue.pop(0)\n        run = min(q, left[name])\n        left[name] -= run\n        t += run\n        turns += 1\n        if left[name] > 0:\n            queue.append(name)\n        else:\n            done[name] = t\n    return done, turns\n\njobs = {"A": 5, "B": 2, "C": 3}\nfor q in [1, 2, 10]:\n    done, turns = round_robin(jobs, q)\n    print(f"조각 {q:>2}: 끝난 시각 {done} · CPU 넘겨주기 {turns}번")` } },
    { title: '프로그램마다 자기 메모리 · 주소 공간', html: `<p>운영체제는 프로세스마다 <b>자기만의 메모리</b>를 줘요. 이것을 [[주소 공간]]이라고 해요. 프로세스가 보는 주소 100 은 진짜 RAM 의 100번 칸이 아니라, 운영체제가 이어 준 <b>어떤 칸</b>이에요.</p><pre>프로세스 A 가 보는 메모리        프로세스 B 가 보는 메모리\n 낮은 주소  코드(명령들)            낮은 주소  코드\n            데이터(전역 변수)                  데이터\n            힙 ↓ (리스트 · 객체)               힙 ↓\n              …                                …\n 높은 주소  스택 ↑ (함수 호출)      높은 주소  스택 ↑\n        \\                              /\n         └── 운영체제가 진짜 RAM 의 서로 다른 칸에 이어 줘요 ──┘</pre><p>그래서 한 프로그램이 망가져도 다른 프로그램의 메모리는 멀쩡하고, 남의 비밀번호를 몰래 읽을 수도 없어요. 예제의 앞부분은 이걸 직접 봐요. 자식 프로세스에서 <code>x = 100</code> 으로 바꿔도 내 <code>x</code> 는 그대로 1 이에요.</p><p>뒷부분은 「이어 주는 표」(페이지 표)를 흉내 내요. 메모리를 4096바이트짜리 <b>페이지</b>로 나누고, 프로세스마다 「내 페이지 몇 번 → RAM 몇 번 칸」 표를 둬요.</p><pre>PAGE = 4096\ntables = {"A": {0: 7}, "B": {0: 2}}\nprint(tables["A"][0] * PAGE + 100)   # 28772\nprint(tables["B"][0] * PAGE + 100)   # 8292</pre><p>같은 주소 100 인데 A 는 RAM 28772번, B 는 8292번이에요. 표에 없는 페이지(<code>page not in tables[proc]</code>)를 건드리면 운영체제가 막아요(프로그램이 「메모리 접근 위반」 으로 꺼지는 게 이것).</p><div class="bk-warn"><b>스레드는 달라요</b> — <code>t = threading.Thread(target=함수)</code> 로 만들고 <code>t.start()</code> 로 시작, <code>t.join()</code> 으로 끝날 때까지 기다리는 스레드는 <b>같은 프로세스 안</b>에서 도는 또 하나의 실행 줄기라서 메모리(변수)를 <b>같이 써요</b>. 챕터 4 에서 서버와 클라이언트를 한 파일에 둘 때 이 스레드를 써요.</div>`,
      example: { code: `import subprocess\nimport sys\n\n# 1) 자식 프로세스는 내 변수를 못 바꿔요\nx = 1\nchild = "x = 1\\nx = 100\\nprint(x)"\nresult = subprocess.run([sys.executable, "-c", child], capture_output=True, text=True)\nprint("자식 프로세스의 x:", result.stdout.strip())\nprint("내 x:", x)\n\n# 2) 같은 주소 100 도 프로세스마다 다른 RAM 칸 — 페이지 표 흉내\nPAGE = 4096\ntables = {\n    "A": {0: 7, 1: 3},   # A 의 페이지 0 → RAM 7번 칸, 페이지 1 → 3번 칸\n    "B": {0: 2, 1: 5},\n}\n\ndef to_real(proc, addr):\n    page = addr // PAGE\n    offset = addr % PAGE\n    frame = tables[proc][page]\n    return frame * PAGE + offset\n\nfor proc in ["A", "B"]:\n    print(proc, "의 주소 100 → 진짜 RAM", to_real(proc, 100))` } },
    { title: '파일 = 이름 붙은 바이트 · os.stat()', html: `<p>디스크는 그냥 바이트가 아주 많이 늘어선 곳이에요. 운영체제가 그 바이트 묶음에 <b>이름</b>을 붙이고, 크기 · 만든 시각 · 위치를 따로 적어 둔 게 <b>파일</b>이에요. <code>os.stat(이름)</code> 으로 그 기록을 볼 수 있어요.</p><table class="kb"><tbody><tr><th>코드</th><th>값</th></tr><tr><td><code>os.stat(이름).st_size</code></td><td>파일 크기(바이트)</td></tr><tr><td><code>os.stat(이름).st_mtime</code></td><td>마지막으로 고친 시각(1970년부터 몇 초)</td></tr><tr><td><code>open(이름, "rb").read()</code></td><td>글자로 바꾸지 않은 <b>바이트 그대로</b></td></tr></tbody></table><p>예제를 실행하면 <code>글자 수: 5</code> 인데 <code>파일 크기: 9 바이트</code> 예요. 파일에 들어 있는 건 글자가 아니라 UTF-8 바이트이기 때문이에요(「안」 · 「녕」 은 3바이트씩). <code>"rb"</code> 로 읽으면 진짜 내용이 <code>b'\\xec\\x95\\x88…'</code> 같은 바이트로 보여요.</p><div class="bk-warn"><b>Windows 의 줄바꿈은 2바이트</b> — 글자 모드(<code>"w"</code>)로 <code>"\\n"</code> 을 쓰면 Windows 에서는 <code>\\r\\n</code> 두 바이트가 돼요. 그래서 같은 글도 Windows 와 리눅스에서 파일 크기가 다를 수 있어요. 예제는 줄바꿈 없이 써서 어디서나 9바이트예요.</div><div class="bk-step-box"><b>더 알아보기 → 운영체제 교과서</b><br>여기까지가 맛보기예요. 진짜 리눅스(우분투 VM)에서 커널을 직접 들여다보려면 운영체제 교과서로 가요.<ul><li><a href="../os/#lesson/K0" target="_blank" rel="noopener">운영체제 교과서 「운영체제가 하는 일」 ↗</a> — 커널 · 프로세스 · 시스템 콜</li><li><a href="../os/#lesson/K6" target="_blank" rel="noopener">운영체제 교과서 「스케줄링: 누가 먼저 CPU 를 쓰나」 ↗</a> — 번갈아 쓰기의 여러 방법</li><li><a href="../os/#lesson/K10" target="_blank" rel="noopener">운영체제 교과서 「가상 메모리: 프로세스마다 자기만의 주소」 ↗</a> — 주소 공간 · 페이지</li><li><a href="../os/#lesson/K16" target="_blank" rel="noopener">운영체제 교과서 「파일 시스템: inode 와 링크」 ↗</a> — 파일 이름과 몸통</li></ul></div>`,
      example: { code: `import os\n\ntext = "안녕 hi"\nwith open("hello.txt", "w", encoding="utf-8") as f:\n    f.write(text)\n\nprint("글자 수:", len(text))\ninfo = os.stat("hello.txt")\nprint("파일 크기:", info.st_size, "바이트")\n\nwith open("hello.txt", "rb") as f:   # b = 바이트 그대로\n    data = f.read()\nprint("진짜 내용:", data)\nprint("16진:", data.hex(" "))` } },
  ],
  summary: ['CPU 는 아주 짧은 조각씩 번갈아 줘서 동시에 도는 것처럼 보여요(라운드 로빈)', '프로세스마다 자기 주소 공간 — 남의 메모리는 못 봐요', '파일은 이름 붙은 바이트 — os.stat 으로 크기를 봐요'] },
{ id: 'C12', ch: 4, n: 12, title: '패킷과 계층', mode: 'text',
  tutorSummary: '긴 데이터는 작은 패킷으로 잘라 보냄(msg[i:i + SIZE], 다시 b"".join, 한글은 조각 중간에서 잘려도 합친 뒤 decode). 4층: 링크(이더넷 · 와이파이, MAC) · 인터넷(IP 주소) · 전송(TCP · UDP, 포트) · 응용(HTTP · DNS) — 보내는 쪽은 층마다 머리말을 붙이고(봉투 속 봉투) 받는 쪽은 거꾸로 벗김. struct.pack("!HHI", …) 로 머리말 바이트를 만들고 unpack 으로 풂(! = 네트워크 순서, H 2바이트, I 4바이트). 체크섬으로 망가짐 확인.',
  terms: { '패킷': '네트워크로 한 번에 보내는 작은 데이터 덩어리. 앞에 머리말(누가 · 누구에게 · 몇 번째)이 붙어요', '계층': '네트워크 일을 층으로 나눈 것. 아래층은 위층이 무엇을 보내는지 몰라도 되고, 층마다 자기 머리말만 봐요', '머리말': '패킷 앞에 붙는 정해진 크기의 정보(주소 · 포트 · 순서 번호 · 길이). 헤더라고도 해요', '체크섬': '데이터 바이트로 계산한 작은 숫자. 받는 쪽이 다시 계산해서 다르면 오는 길에 망가진 것' },
  pages: [
    { title: '잘라 보내기: 패킷 · msg[i:i + 8]', html: `<p>사진 한 장(수 MB)을 인터넷으로 보낼 때 한 덩어리로 보내지 않아요. 작은 조각으로 잘라서 보내요. 이 조각이 [[패킷]]이에요. 보통 한 패킷에 1500바이트 정도가 들어가요.</p><ul><li><b>선을 같이 써요</b> — 한 사람이 큰 파일을 보내는 동안 다른 사람도 사이사이 끼어 보낼 수 있어요</li><li><b>망가지면 그 조각만</b> 다시 보내요 — 처음부터 다 보낼 필요가 없어요</li><li><b>조각마다 다른 길</b>로 가도 돼요 — 받는 쪽이 번호대로 다시 맞춰요</li></ul><p>예제는 글 하나를 8바이트씩 잘라요. 바이트 줄([[레슨:C1]])은 리스트처럼 <code>msg[i:i + 8]</code> 로 잘라져요. 받은 쪽은 <code>b"".join(packets)</code> 로 다시 붙인 다음에 글자로 바꿔요.</p><div class="bk-warn"><b>합친 다음에 decode</b> — 한글은 3바이트라서 조각 경계에서 글자가 반으로 잘릴 수 있어요. 조각 하나만 <code>decode()</code> 하면 깨지거나 에러가 나요(예제의 <code>0번 패킷만 글자로</code> 줄에 <code>�</code> 가 보여요). 다 모아서 바꿔야 해요.</div>`,
      example: { code: `msg = "안녕하세요! 네트워크 공부 중".encode()\nprint("보낼 바이트:", len(msg))\n\nSIZE = 8          # 패킷 하나에 담을 바이트(진짜는 보통 1500 정도)\npackets = []\nfor i in range(0, len(msg), SIZE):\n    packets.append(msg[i:i + SIZE])\n\nfor no, p in enumerate(packets):\n    print(no, p.hex(" "))\n\nprint("0번 패킷만 글자로:", packets[0].decode(errors="replace"))\nwhole = b"".join(packets)\nprint("다시 합침:", whole.decode())` } },
    { title: '4층: 링크 · 인터넷 · 전송 · 응용', html: `<p>네트워크는 일을 네 개의 [[계층]]으로 나눠요. 층마다 맡은 일이 하나씩이고, 자기 [[머리말]]만 봐요.</p><table class="kb"><tbody><tr><th>층</th><th>맡은 일</th><th>머리말에 적는 것</th><th>예</th></tr><tr><td>응용</td><td>프로그램끼리의 약속</td><td>요청 · 응답 내용</td><td>HTTP · DNS</td></tr><tr><td>전송</td><td>어느 프로그램에게, 빠짐없이</td><td>포트 · 순서 번호</td><td>TCP · UDP</td></tr><tr><td>인터넷</td><td>어느 컴퓨터에게(먼 길 찾기)</td><td>IP 주소</td><td>IPv4 · IPv6</td></tr><tr><td>링크</td><td>바로 옆 기계까지 한 칸</td><td>MAC 주소</td><td>이더넷 · 와이파이</td></tr></tbody></table><p>편지를 봉투에 넣고, 그 봉투를 또 큰 봉투에 넣는 것과 같아요. 보내는 쪽은 <b>위층부터</b> 머리말을 붙이고, 받는 쪽은 <b>바깥 봉투부터</b> 벗겨요.</p><pre>┌ 이더넷 머리말 ┬ IP 머리말 ┬ TCP 머리말 ┬ HTTP 데이터 ┐\n│ 내 MAC→공유기  │ 내 IP→서버 │ 51000→80   │ GET /index  │\n└───────────────┴───────────┴────────────┴─────────────┘\n 링크 층이 봄      인터넷 층     전송 층       응용 층</pre><p>덕분에 와이파이를 유선으로 바꿔도(링크 층) 브라우저(응용 층)는 아무것도 몰라도 돼요. 예제는 이 봉투를 글자로 흉내 내요. 진짜 머리말은 글자가 아니라 정해진 자리의 바이트예요 — 다음 쪽.</p>`,
      example: { code: `data = "GET /index.html"\n\n# 보내는 쪽: 위층부터 차례로 봉투에 넣어요\npacket = data\npacket = "[TCP 51000→80]" + packet\npacket = "[IP 192.168.0.10→203.0.113.5]" + packet\npacket = "[이더넷 내 MAC→공유기 MAC]" + packet\nprint("선으로 나가는 모양:")\nprint(packet)\n\n# 받는 쪽: 바깥 봉투부터 하나씩 벗겨요\nprint()\nfor layer in ["링크", "인터넷", "전송"]:\n    end = packet.index("]") + 1\n    print(f"{layer} 층이 벗김: {packet[:end]}")\n    packet = packet[end:]\nprint("응용 층이 받은 것:", packet)` } },
    { title: 'struct.pack("!HHI", …) 로 머리말', html: `<p>진짜 머리말은 「몇 번째 바이트부터 몇 바이트가 무엇」 이 정해진 바이트 줄이에요. 파이썬의 <code>struct</code> 모듈이 숫자를 정해진 크기의 바이트로 바꿔(<code>pack</code>) 주고, 거꾸로 풀어(<code>unpack</code>) 줘요.</p><table class="kb"><tbody><tr><th>글자</th><th>뜻</th></tr><tr><td><code>!</code></td><td>네트워크 순서 — 큰 자리 바이트 먼저(맨 앞에 한 번)</td></tr><tr><td><code>B</code></td><td>1바이트 수(0~255)</td></tr><tr><td><code>H</code></td><td>2바이트 수(0~65535) — 포트가 이 크기</td></tr><tr><td><code>I</code></td><td>4바이트 수(0~약 42억) — 순서 번호 · IPv4 주소가 이 크기</td></tr></tbody></table><pre>import struct\nheader = struct.pack("!HHI", 51000, 80, 1)\nprint(len(header))        # 8\nprint(header.hex(" "))    # c7 38 00 50 00 00 00 01\nprint(struct.unpack("!HHI", header))   # (51000, 80, 1)</pre><p>51000 은 16진수로 <code>c738</code>, 80 은 <code>0050</code> 이에요. 받는 쪽도 같은 모양 <code>"!HHI"</code> 를 알고 있으니 앞 8바이트를 잘라 풀면 돼요. 머리말 뒤 <code>packet[8:]</code> 가 데이터예요. TCP 머리말도 이렇게 「보내는 포트 2바이트 · 받는 포트 2바이트 · 순서 번호 4바이트 …」 로 시작해요.</p>`,
      example: { code: `import struct\n\n# 보내는 포트 · 받는 포트 · 순서 번호 → 머리말 8바이트\nheader = struct.pack("!HHI", 51000, 80, 1)\nprint(len(header), "바이트")\nprint(header.hex(" "))\n\nsrc, dst, seq = struct.unpack("!HHI", header)\nprint(src, dst, seq)\n\npacket = header + "안녕".encode()\nprint("패킷 전체:", len(packet), "바이트")\nprint("머리말 뒤 데이터:", packet[8:].decode())` } },
    { title: '체크섬: 망가졌나 확인 · unpack', html: `<p>전선 · 전파를 지나는 동안 비트 하나가 뒤집힐 수 있어요. 그래서 보내는 쪽은 데이터로 작은 숫자를 계산해 머리말에 넣어요. 이 숫자가 [[체크섬]]이에요. 받는 쪽은 같은 계산을 다시 해서 다르면 「망가졌다」 고 버리고 다시 보내 달라고 해요.</p><pre>data = "안녕".encode()\nprint(sum(data) % 65536)   # 1038</pre><p>예제의 머리말은 <code>"!IHH"</code> — 순서 번호 4바이트 · 길이 2바이트 · 체크섬 2바이트예요. 패킷을 만든 뒤 가는 길에 한 비트를 뒤집으면(<code>^= 1</code>) 받는 쪽 계산이 달라져서 마지막 값이 <code>False</code> 로 바뀌어요.</p><details class="lp-more"><summary>💡 더 알아보기</summary><p>진짜 IP · TCP 의 체크섬은 2바이트씩 더하는 조금 다른 계산이고, 이더넷 · 와이파이는 더 튼튼한 CRC(<code>zlib.crc32</code>)를 써요. 「데이터로 숫자를 계산해 같이 보내고, 받는 쪽이 다시 계산해 비교」 는 같아요. 일부러 바꾼 것까지 막으려면 챕터 5 의 해시가 필요해요.</p></details>`,
      example: { code: `import struct\n\ndef make(seq, data):\n    check = sum(data) % 65536          # 체크섬: 바이트를 다 더한 값\n    return struct.pack("!IHH", seq, len(data), check) + data\n\ndef open_packet(packet):\n    seq, length, check = struct.unpack("!IHH", packet[:8])\n    data = packet[8:8 + length]\n    ok = sum(data) % 65536 == check\n    return seq, data, ok\n\np = make(7, "안녕".encode())\nprint(p.hex(" "))\nprint(open_packet(p))\n\nbroken = bytearray(p)\nbroken[9] ^= 1                         # 가는 길에 한 비트가 뒤집힘\narrived = bytes(broken)\nprint(open_packet(arrived))` } },
  ],
  summary: ['데이터는 패킷으로 잘라 보내고, 받는 쪽이 다시 합쳐요', '4층(링크 · 인터넷 · 전송 · 응용) — 층마다 머리말을 붙이고 거꾸로 벗겨요', 'struct.pack · unpack 으로 머리말 바이트를 만들고 풀어요'] },
{ id: 'C13', ch: 4, n: 13, title: 'IP 주소와 길 찾기', mode: 'text',
  tutorSummary: 'IPv4 = 4바이트(0~255 넷, 약 43억 개, ipaddress.ip_address · packed · int), IPv6 = 16바이트. 서브넷 /24 = 앞 24비트가 같은 동네(ip_network · netmask · num_addresses · ip in net). 사설(10/8 · 172.16/12 · 192.168/16, is_private) · 공인 · 127.0.0.1 내 컴퓨터(is_loopback), 공유기가 NAT 로 공인 하나를 나눠 씀. 라우터는 목적지 전체 길을 모르고 라우팅 표에서 가장 길게 맞는 줄(prefixlen 큰 것)의 다음 칸만 앎 — tracert 로 보기(☐).',
  terms: { 'IP 주소': '인터넷에서 컴퓨터를 찾는 주소. IPv4 는 4바이트(192.168.0.10), IPv6 는 16바이트', '서브넷': '앞부분 비트가 같은 주소들의 묶음(같은 동네). /24 는 앞 24비트가 같다는 뜻', '사설 주소': '집 · 회사 안에서만 쓰는 주소(10. · 172.16~31. · 192.168.). 인터넷에서는 직접 안 보여요', '라우터': '패킷을 받아 다음 칸으로 넘겨 주는 기계. 집의 공유기도 라우터예요' },
  pages: [
    { title: 'IPv4 · IPv6 · ip_address()', html: `<p>패킷의 인터넷 층 머리말에는 받는 컴퓨터의 [[IP 주소]]가 적혀요. IPv4 주소 <code>192.168.0.10</code> 은 사실 <b>4바이트</b>예요. 점으로 나눈 숫자 넷이 바이트 하나씩(0~255)이에요.</p><pre>192   .168   .0     .10\n11000000 10101000 00000000 00001010   ← 32비트 = 4바이트</pre><p>4바이트로 만들 수 있는 주소는 2<sup>32</sup> = 약 43억 개뿐이라 이미 모자라요. 그래서 16바이트짜리 <b>IPv6</b>(<code>2001:db8::1</code>)가 나왔어요. 16진수 네 자리씩 8묶음이고, <code>::</code> 는 「0 이 이어지는 부분 줄임」 이에요.</p><p>파이썬의 <code>ipaddress</code> 모듈이 주소를 읽고 계산해 줘요.</p><pre>import ipaddress\na = ipaddress.ip_address("192.168.0.10")\nprint(a.version)         # 4\nprint(list(a.packed))    # [192, 168, 0, 10]\nprint(int(a))            # 3232235530</pre><p>주소도 결국 숫자예요. <code>int(a)</code> 는 4바이트를 한 숫자로 읽은 값이에요([[레슨:C1]]의 2진수).</p>`,
      example: { code: `import ipaddress\n\na = ipaddress.ip_address("192.168.0.10")\nprint("버전:", a.version)\nprint("바이트 넷:", list(a.packed))\nprint("숫자 하나로:", int(a))\nprint("IPv4 주소 개수:", 2 ** 32)\n\nb = ipaddress.ip_address("2001:db8::1")\nprint("버전:", b.version, "· 바이트", len(b.packed))\nprint("줄이지 않은 모양:", b.exploded)\nprint("IPv6 주소 개수:", 2 ** 128)` } },
    { title: '서브넷 /24 · ip_network(…)', html: `<p>주소 끝의 <code>/24</code> 는 「앞 24비트가 같은 주소끼리 한 동네」 라는 뜻이에요. 이 동네가 [[서브넷]]이에요. 같은 서브넷 안에서는 공유기를 거치지 않고 바로 보내요.</p><pre>192.168.0.0/24\n11000000 10101000 00000000 | xxxxxxxx\n└──────── 앞 24비트: 동네 ─┘ └ 8비트: 집 번호(256개)</pre><pre>import ipaddress\nnet = ipaddress.ip_network("192.168.0.0/24")\nprint(net.netmask)         # 255.255.255.0\nprint(net.num_addresses)   # 256</pre><table class="kb"><tbody><tr><th>표기</th><th>넷마스크</th><th>주소 개수</th></tr><tr><td><code>/8</code></td><td>255.0.0.0</td><td>16,777,216</td></tr><tr><td><code>/16</code></td><td>255.255.0.0</td><td>65,536</td></tr><tr><td><code>/24</code></td><td>255.255.255.0</td><td>256</td></tr><tr><td><code>/30</code></td><td>255.255.255.252</td><td>4</td></tr></tbody></table><p>넷마스크는 앞 비트들이 1 인 32비트예요. 동네 안에서 첫 주소(<code>.0</code>)는 동네 이름, 끝 주소(<code>.255</code>)는 「모두에게」 라서 컴퓨터에는 그 둘을 뺀 254개를 줘요. <code>ip in net</code> 으로 같은 동네인지 바로 알 수 있어요. 컴퓨터 주소에서 그 동네를 구할 때는 <code>ip_network("192.168.0.77/24", strict=False)</code> → <code>192.168.0.0/24</code> 처럼 <code>strict=False</code> 를 붙여요(안 붙이면 「집 번호가 붙어 있다」 고 에러).</p>`,
      example: { code: `import ipaddress\n\nnet = ipaddress.ip_network("192.168.0.0/24")\nprint("넷마스크:", net.netmask)\nprint("주소 개수:", net.num_addresses)\nprint("처음 · 끝:", net[0], net[-1])\n\nmask = int(net.netmask)\nprint("넷마스크 비트:", f"{mask:032b}")\n\nfor text in ["192.168.0.77", "192.168.1.77"]:\n    ip = ipaddress.ip_address(text)\n    print(text, "는 같은 동네?", ip in net)\n\nhome = ipaddress.ip_network("192.168.0.77/24", strict=False)\nprint("192.168.0.77 의 동네:", home)` } },
    { title: '사설 · 공인 · 127.0.0.1 · is_private', html: `<p>집 공유기에 붙은 노트북 · 휴대폰은 보통 <code>192.168.0.x</code> 같은 [[사설 주소]]를 받아요. 이 주소는 집 안에서만 통해요. 인터넷으로 나갈 때는 공유기가 자기의 <b>공인 주소</b> 하나로 바꿔서 내보내고, 답이 오면 다시 누구 것인지 찾아 돌려줘요(NAT). 그래서 집집마다 같은 <code>192.168.0.10</code> 을 써도 괜찮아요.</p><table class="kb"><tbody><tr><th>범위</th><th>종류</th></tr><tr><td><code>10.0.0.0/8</code></td><td>사설</td></tr><tr><td><code>172.16.0.0/12</code> (172.16 ~ 172.31)</td><td>사설</td></tr><tr><td><code>192.168.0.0/16</code></td><td>사설</td></tr><tr><td><code>127.0.0.0/8</code> — 보통 <code>127.0.0.1</code></td><td><b>내 컴퓨터 자신</b>(루프백) — 밖으로 안 나가요</td></tr><tr><td>그 밖의 대부분</td><td>공인(인터넷에서 보이는 주소)</td></tr></tbody></table><p><code>ip.is_private</code> · <code>ip.is_loopback</code> 이 이 표를 대신 봐 줘요. 루프백도 사설에 들어가서 <code>is_loopback</code> 을 먼저 봐요. 예제에서 <code>172.32.0.1</code> 은 172.31 을 넘어서 공인이에요.</p><p>챕터 4 의 서버 실습은 전부 <code>127.0.0.1</code> 만 써요. 패킷이 내 컴퓨터 밖으로 나가지 않으니 인터넷이 없어도 되고, 남이 접속할 걱정도 없어요.</p><pre>PS&gt; ipconfig\n   IPv4 주소 . . . . . . . . . : 192.168.0.23     ← 내 사설 주소(집마다 달라요)\n   기본 게이트웨이 . . . . . . : 192.168.0.1      ← 공유기</pre><p>VS Code 터미널에서 <code>ipconfig</code> 를 쳐 보면 내 사설 주소와 공유기 주소가 나와요(숫자는 집마다 달라요).</p>`,
      example: { code: `import ipaddress\n\nfor text in ["192.168.0.10", "10.1.2.3", "172.20.0.1", "172.32.0.1", "8.8.8.8", "127.0.0.1"]:\n    ip = ipaddress.ip_address(text)\n    if ip.is_loopback:\n        kind = "내 컴퓨터(루프백)"\n    elif ip.is_private:\n        kind = "사설"\n    else:\n        kind = "공인"\n    print(f"{text:<13} {kind}")` } },
    { title: '라우터는 다음 칸만 · 라우팅 표', html: `<p>서울에서 부산의 서버까지 패킷이 갈 때, 처음부터 끝까지 길을 아는 기계는 없어요. [[라우터]]마다 <b>라우팅 표</b>만 있어요. 「이 동네로 가는 건 저 옆 라우터에게」. 패킷은 라우터를 한 칸씩 건너가요.</p><p>표에서 맞는 줄이 여럿이면 <b>가장 자세한 줄</b>(<code>/</code> 뒤 숫자 = <code>prefixlen</code> 이 큰 것)을 골라요. <code>0.0.0.0/0</code> 은 모든 주소에 맞는 「기본 길」 이라 다른 줄이 없을 때만 써요.</p><pre>내 PC ─▶ 공유기 ─▶ 통신사 라우터 ─▶ … ─▶ 서버 쪽 라우터 ─▶ 서버\n          한 칸       한 칸                  한 칸</pre><p>진짜 길은 <code>tracert</code> 로 볼 수 있어요(인터넷이 필요해서 내 화면에서만 해 봐요).</p><pre>PS&gt; tracert -d 8.8.8.8\n  1    1 ms    1 ms    1 ms  192.168.0.1      ← 우리 집 공유기\n  2    5 ms    4 ms    5 ms  10.x.x.x         ← 통신사 안(사설 주소일 수도)\n  3    …\n  9   32 ms   31 ms   32 ms  8.8.8.8          ← 도착</pre><p>한 줄이 라우터 한 칸이에요. <code>-d</code> 는 이름을 찾지 않고 주소만 보여 줘서 빨라요. <code>*</code> 만 찍히는 줄은 그 라우터가 대답을 안 해 주는 거라 괜찮아요.</p>`,
      example: { code: `import ipaddress\n\ntable = [\n    ("192.168.0.0/24", "바로 전달(같은 동네)"),\n    ("10.0.0.0/8", "회사 VPN 라우터"),\n    ("0.0.0.0/0", "공유기 → 인터넷(기본 길)"),\n]\n\ndef next_hop(dst):\n    ip = ipaddress.ip_address(dst)\n    best = None\n    for net_text, hop in table:\n        net = ipaddress.ip_network(net_text)\n        if ip in net and (best is None or net.prefixlen > best[0].prefixlen):\n            best = (net, hop)\n    return best\n\nfor dst in ["192.168.0.20", "10.3.4.5", "203.0.113.5"]:\n    net, hop = next_hop(dst)\n    print(f"{dst:<13} → {net} 줄 → {hop}")` } },
  ],
  summary: ['IPv4 는 4바이트, IPv6 는 16바이트 — ipaddress 로 읽고 계산해요', '/24 는 앞 24비트가 같은 동네(서브넷), 사설 주소는 공유기가 NAT 로 나눠 써요', '127.0.0.1 은 내 컴퓨터 — 라우터는 표를 보고 다음 칸만 알아요'] },
{ id: 'C14', ch: 4, n: 14, title: 'DNS: 이름을 주소로', mode: 'text',
  tutorSummary: 'DNS = 이름(example.com) → IP 주소 전화번호부(socket.gethostbyname, localhost 는 hosts 파일로 127.0.0.1). 기록 종류 A · AAAA · CNAME · MX. 묻는 차례: 내 PC 캐시 → 공유기 → 통신사 DNS 서버(→ 루트 · .com · 그 이름 담당 서버) — 찾으면 캐시에 저장. nslookup · ipconfig /displaydns 는 ☐. 흉내: 딕셔너리 + 캐시 + TTL(정해진 now 값으로 — 진짜는 time.time()).',
  terms: { 'DNS': 'Domain Name System. 사람이 외우는 이름(example.com)을 컴퓨터가 쓰는 IP 주소로 바꿔 주는 인터넷 전화번호부', '캐시': '한 번 알아낸 답을 가까이 적어 두었다가 다음에 바로 쓰는 것', 'TTL': 'Time To Live. 캐시에 적어 둔 답을 몇 초 동안 믿을지. 지나면 버리고 다시 물어요' },
  pages: [
    { title: 'DNS: 이름 → 주소 · gethostbyname()', html: `<p>패킷에는 IP 주소가 필요한데, 사람은 <code>203.0.113.7</code> 대신 <code>school.test</code> 같은 이름을 외워요. 이름을 주소로 바꿔 주는 인터넷의 전화번호부가 [[DNS]]예요. 브라우저에 주소를 치면 맨 먼저 DNS 에 물어요.</p><pre>import socket\nprint(socket.gethostbyname("localhost"))   # 보통 127.0.0.1</pre><p><code>localhost</code> 는 DNS 서버에 묻지 않고 내 컴퓨터의 <b>hosts 파일</b>(Windows 는 <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code>)에서 바로 찾아요. 그래서 인터넷이 없어도 돼요. 다른 이름은 인터넷이 있어야 해서 예제는 딕셔너리로 흉내 내요.</p><table class="kb"><tbody><tr><th>기록 종류</th><th>뜻</th><th>예</th></tr><tr><td>A</td><td>이름 → IPv4 주소</td><td>school.test → 203.0.113.7</td></tr><tr><td>AAAA</td><td>이름 → IPv6 주소</td><td>school.test → 2001:db8::7</td></tr><tr><td>CNAME</td><td>「이 이름은 저 이름의 별명」</td><td>www.school.test → school.test</td></tr><tr><td>MX</td><td>이 이름으로 오는 메일을 받는 서버</td><td>school.test → mail.school.test</td></tr></tbody></table><div class="bk-warn"><b>예제 이름은 연습용</b> — <code>.test</code> 이름과 <code>203.0.113.x</code> · <code>198.51.100.x</code> 주소는 책 · 연습에 쓰라고 정해 둔 것이라 진짜 인터넷의 누구와도 겹치지 않아요.</div>`,
      example: { code: `import socket\n\nprint("localhost →", socket.gethostbyname("localhost"))\n\n# DNS 는 커다란 전화번호부 — 흉내\nphonebook = {\n    "school.test": "203.0.113.7",\n    "shop.test": "198.51.100.20",\n}\nfor name in ["school.test", "shop.test", "nobody.test"]:\n    print(name, "→", phonebook.get(name, "없는 이름(NXDOMAIN)"))` } },
    { title: '묻는 차례: 캐시 → 공유기 → DNS 서버', html: `<p>매번 멀리 있는 DNS 서버까지 물으면 느려요. 그래서 가까운 곳부터 차례로 물어요. 한 번 알아낸 답은 [[캐시]]에 적어 두고요.</p><ol><li><b>내 PC 의 캐시</b> — 최근에 물어본 이름이면 바로 끝</li><li><b>공유기</b> — 집의 다른 기기가 물어본 이름이면 끝</li><li><b>통신사 DNS 서버</b> — 그래도 모르면 이 서버가 대신 찾아요: 루트 서버 → <code>.com</code> 담당 → <code>example.com</code> 담당 서버 순서로 물어서</li></ol><p>예제를 실행하면 처음 <code>news.test</code> 는 DNS 서버까지 가고, 두 번째는 내 PC 캐시에서 바로 찾아요.</p><p>진짜 DNS 에는 <code>nslookup</code> 으로 직접 물어볼 수 있어요(인터넷이 필요해서 내 화면에서만).</p><pre>PS&gt; nslookup example.com\n서버:    공유기 또는 통신사 DNS 이름\nAddress:  192.168.0.1\n\n권한 없는 응답:          ← 캐시에서 온 답이라는 뜻\n이름:    example.com\nAddresses:  (IPv6 주소)\n          (IPv4 주소)</pre><p><code>ipconfig /displaydns</code> 를 치면 내 PC 의 DNS 캐시 목록과 남은 TTL(초)이 보여요.</p>`,
      example: { code: `my_cache = {"school.test": "203.0.113.7"}\nrouter_cache = {"shop.test": "198.51.100.20"}\ndns_server = {\n    "school.test": "203.0.113.7",\n    "shop.test": "198.51.100.20",\n    "news.test": "198.51.100.33",\n}\nsteps = [("내 PC 캐시", my_cache), ("공유기", router_cache), ("DNS 서버", dns_server)]\n\ndef resolve(name):\n    print(name, "을(를) 찾아요")\n    for where, table in steps:\n        if name in table:\n            print(f"  {where}: 찾았어요 → {table[name]}")\n            my_cache[name] = table[name]       # 다음엔 바로\n            return table[name]\n        print(f"  {where}: 몰라요")\n    print("  없는 이름이에요")\n    return None\n\nresolve("news.test")\nresolve("news.test")\nresolve("nobody.test")` } },
    { title: '흉내: 딕셔너리 캐시 + TTL', html: `<p>서버의 주소가 바뀔 수도 있어서, 캐시의 답은 영원히 믿지 않아요. DNS 답에는 [[TTL]](「몇 초 동안 믿어도 돼」)이 붙어 와요. TTL 이 지나면 캐시에서 버리고 다시 물어요.</p><p>예제의 <code>DnsCache</code> 는 이름마다 <code>(주소, 버릴 시각)</code> 을 적어 둬요. 버릴 시각 = 넣은 시각 + TTL 이에요.</p><pre>cache.put("school.test", "203.0.113.7", ttl=60, now=0)\ncache.get("school.test", now=30)   # 203.0.113.7 — 아직 믿어요\ncache.get("school.test", now=60)   # None — 60초가 지나 버렸어요</pre><div class="bk-warn"><b>시각은 정해진 값으로</b> — 예제는 언제 돌려도 같은 결과가 나오게 <code>now</code> 를 직접 넘겨요. 진짜 프로그램에서는 <code>time.time()</code>(지금 시각, 초)을 써요.</div><p>TTL 이 길면 DNS 서버에 덜 물어서 빠르지만, 서버 주소를 바꾸면 사람들 캐시에서 옛 주소가 사라질 때까지 기다려야 해요. 그래서 이사하기 전에는 TTL 을 짧게 줄여 둬요.</p>`,
      example: { code: `class DnsCache:\n    def __init__(self):\n        self.items = {}               # 이름: (주소, 버릴 시각)\n\n    def put(self, name, addr, ttl, now):\n        self.items[name] = (addr, now + ttl)\n\n    def get(self, name, now):\n        if name not in self.items:\n            return None\n        addr, until = self.items[name]\n        if now >= until:              # TTL 이 지났어요\n            del self.items[name]\n            return None\n        return addr\n\ncache = DnsCache()\ncache.put("school.test", "203.0.113.7", ttl=60, now=0)\nfor now in [0, 30, 59, 60, 61]:\n    print(f"{now:>2}초:", cache.get("school.test", now))` } },
  ],
  summary: ['DNS 는 이름을 IP 주소로 바꾸는 전화번호부', '가까운 캐시부터 묻고, 찾은 답은 캐시에 적어 둬요', 'TTL 이 지나면 버리고 다시 물어요'] },
{ id: 'C15', ch: 4, n: 15, title: 'TCP: 빠짐없이 순서대로', mode: 'text',
  tutorSummary: 'TCP = 연결(3단계 악수 SYN · SYN-ACK · ACK) + 순서 번호 + 확인(ACK) + 안 오면 다시 보내기 → 빠짐없이 순서대로(바이트 흐름). UDP(SOCK_DGRAM)는 연결 · 확인 없이 던지기(sendto · recvfrom) — 빠르지만 잃을 수 있음(영상 통화 · 게임 · DNS). 포트 = 컴퓨터 안의 어느 프로그램(80 HTTP · 443 HTTPS · 53 DNS, bind 에 0 이면 운영체제가 빈 포트, getsockname 으로 확인). socket 서버(bind · listen · accept · recv · sendall)와 클라이언트(create_connection)를 한 파일에 스레드로 — CI 도 됨, 진짜는 두 터미널(포트 50007). 줄 단위는 makefile 의 readline. HTTP 는 TCP 위의 글자(GET … HTTP/1.0\\r\\n…) → HTTP·API·SDK 교과서.',
  terms: { 'TCP': '전송 층의 약속. 연결을 맺고, 조각마다 번호를 붙이고, 받았다는 확인(ACK)이 안 오면 다시 보내서 빠짐없이 순서대로 전해요', 'UDP': '전송 층의 다른 약속. 연결 · 확인 없이 바로 던져요. 빠르지만 잃거나 순서가 바뀔 수 있어요', '포트': '한 컴퓨터 안에서 어느 프로그램에게 갈지 고르는 번호(0~65535). IP 주소가 건물이면 포트는 호실', '소켓': '프로그램이 네트워크로 주고받는 창구. 운영체제가 만들어 주고, 주소와 포트를 붙여 써요' },
  pages: [
    { title: '3단계 악수 · 순서 번호 · ACK', html: `<p>패킷은 가는 길에 사라지기도 하고, 늦게 출발한 것이 먼저 도착하기도 해요. [[TCP]]는 그래도 <b>빠짐없이 순서대로</b> 전해 주는 약속이에요. 방법은 네 가지예요.</p><ol><li><b>연결(3단계 악수)</b> — 데이터 전에 「보낼게」 · 「그래, 나도」 · 「좋아」 를 주고받아 서로 시작 번호를 맞춰요</li><li><b>순서 번호</b> — 조각마다 번호를 붙여요. 받는 쪽은 번호대로 다시 줄 세워요</li><li><b>확인(ACK)</b> — 받는 쪽이 「여기까지 받았어, 다음은 몇 번」 을 돌려보내요</li><li><b>다시 보내기</b> — 정해진 시간 안에 ACK 가 안 오면 그 조각을 다시 보내요</li></ol><pre>클라이언트                          서버\n   │ ── SYN (내 번호 100) ─────────▶ │\n   │ ◀── SYN-ACK (내 번호 300, 101 줘) ── │\n   │ ── ACK (301 줘) ──────────────▶ │\n   │        연결됨 — 이제 데이터        │</pre><p>예제는 조각 셋을 보내는데 1번 조각이 한 번 사라져요. ACK 가 안 오니까 다시 보내고, 받는 쪽은 번호로 맞춰서 <code>받은 쪽이 맞춘 글: 안녕하세요!</code> 를 만들어요(실행하면 이 줄이 맨 끝에 나와요).</p><p>그래서 TCP 로 받는 프로그램은 「바이트가 빠짐없이 순서대로 흘러온다」 고 믿고 써요. 이것을 <b>바이트 흐름</b>이라고 해요. 진짜 순서 번호는 조각 번호가 아니라 「몇 번째 바이트」 예요.</p>`,
      example: { code: `# 1) 연결: 3단계 악수\nprint("클라이언트 → 서버  SYN      (내 번호는 100 부터)")\nprint("서버 → 클라이언트  SYN-ACK  (내 번호는 300 부터, 다음엔 101 줘)")\nprint("클라이언트 → 서버  ACK      (다음엔 301 줘)")\nprint("연결됨!")\nprint()\n\n# 2) 조각마다 번호 · 받으면 ACK · 안 오면 다시\npieces = ["안녕", "하세", "요!"]\nlost_once = {1}      # 1번 조각은 처음에 사라진다고 정해 둠(진짜로는 그때그때 달라요)\nreceived = {}\nfor seq, data in enumerate(pieces):\n    tries = 0\n    while True:\n        tries += 1\n        if seq in lost_once and tries == 1:\n            print(f"보냄 {seq}번 '{data}' … 사라짐! ACK 가 안 와요 → 다시 보내기")\n            continue\n        received[seq] = data\n        print(f"보냄 {seq}번 '{data}' → ACK {seq + 1} (다음엔 {seq + 1}번 줘)")\n        break\n\ntext = "".join(received[i] for i in sorted(received))\nprint("받은 쪽이 맞춘 글:", text)` } },
    { title: 'TCP vs UDP · SOCK_DGRAM', html: `<p>전송 층에는 약속이 하나 더 있어요. [[UDP]]는 악수도 확인도 없이 <b>그냥 던져요</b>.</p><table class="kb"><tbody><tr><th></th><th>TCP</th><th>UDP</th></tr><tr><td>연결</td><td>먼저 3단계 악수</td><td>없음 — 바로 보냄</td></tr><tr><td>빠짐 · 순서</td><td>빠짐없이 순서대로(다시 보내기)</td><td>잃을 수도, 순서가 바뀔 수도</td></tr><tr><td>빠르기</td><td>확인을 기다려서 조금 느림</td><td>빠름</td></tr><tr><td>쓰는 곳</td><td>웹(HTTP) · 메일 · 파일 · 채팅</td><td>영상 통화 · 게임 · DNS 질문</td></tr><tr><td>파이썬</td><td><code>socket.SOCK_STREAM</code></td><td><code>socket.SOCK_DGRAM</code></td></tr></tbody></table><p>영상 통화는 0.1초 전 화면이 늦게 오느니 그냥 건너뛰는 게 나아서 UDP 를 써요. 웹 페이지는 글자 하나라도 빠지면 안 되니 TCP 예요.</p><p>[[소켓]]은 운영체제가 만들어 주는 네트워크 창구예요. UDP 소켓은 <code>sendto(바이트, (주소, 포트))</code> 로 던지고 <code>recvfrom(1024)</code> 로 받아요(누가 보냈는지도 같이). 예제는 내 컴퓨터 안(<code>127.0.0.1</code>)에서 소켓 둘끼리 주고받아요.</p>`,
      example: { code: `import socket\n\na = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)    # UDP\na.bind(("127.0.0.1", 0))\na.settimeout(3)\nb = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nb.bind(("127.0.0.1", 0))\n\n# 연결 없이 바로 던져요 — 받는 주소를 매번 같이\nb.sendto("안녕 UDP".encode(), a.getsockname())\ndata, sender = a.recvfrom(1024)\nprint("받음:", data.decode())\nprint("보낸 쪽 주소가 b 인가:", sender == b.getsockname())\na.close()\nb.close()` } },
    { title: '포트 · bind(("127.0.0.1", 0))', html: `<p>IP 주소로 컴퓨터까지 왔어요. 그런데 그 컴퓨터에는 브라우저 · 메신저 · 게임이 다 네트워크를 써요. 어느 프로그램에게 줄지는 [[포트]] 번호로 골라요. 주소가 건물이면 포트는 호실이에요.</p><table class="kb"><tbody><tr><th>포트</th><th>누가 쓰나</th></tr><tr><td>80 · 443</td><td>웹 서버(HTTP · HTTPS)</td></tr><tr><td>53</td><td>DNS 서버</td></tr><tr><td>22</td><td>SSH(원격 터미널)</td></tr><tr><td>1024 ~ 49151</td><td>여러 프로그램이 등록해서 쓰는 번호 — 연습 서버는 50007 처럼 아무도 안 쓰는 번호로</td></tr><tr><td>49152 ~ 65535</td><td>운영체제가 그때그때 빌려 주는 번호(클라이언트 쪽)</td></tr></tbody></table><p>서버는 <code>bind((주소, 포트))</code> 로 「이 주소 · 포트로 오는 건 나에게」 라고 운영체제에 등록해요. 포트를 <b>0</b> 으로 주면 운영체제가 지금 비어 있는 번호를 아무거나 골라 줘요. 고른 번호는 <code>getsockname()</code> 으로 알아내요.</p><pre>s = socket.socket()\ns.bind(("127.0.0.1", 0))\nhost, port = s.getsockname()   # ('127.0.0.1', 운영체제가 고른 번호)</pre><div class="bk-warn"><b>이 교과서의 예제 · 예시 답은 포트 0</b> — 정해진 번호를 쓰면 그 번호를 이미 다른 프로그램이 쓸 때 <code>Address already in use</code> 로 멈춰요. 포트 0 이면 언제 어디서 돌려도 안 겹쳐요. 터미널 둘에서 따로 켤 때만 서버 · 클라이언트가 미리 약속한 번호(50007)를 써요.</div><p>내 컴퓨터에서 지금 손님을 기다리는 포트는 PowerShell 의 <code>netstat -an | findstr LISTENING</code> 으로 볼 수 있어요.</p>`,
      example: { code: `import socket\n\ns = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\ns.bind(("127.0.0.1", 0))          # 포트 0 = 「빈 포트 아무거나 주세요」\nhost, port = s.getsockname()\nprint("주소:", host)\nprint("운영체제가 고른 포트:", port)\nprint("1024 보다 큰가:", port > 1024)\ns.close()\n\nknown = {80: "HTTP", 443: "HTTPS", 53: "DNS", 22: "SSH"}\nfor number, name in known.items():\n    print(f"{number:>4} → {name}")` } },
    { title: '서버 · 클라이언트를 한 파일에(스레드)', html: `<p>TCP 서버와 클라이언트는 이렇게 주고받아요.</p><table class="kb"><tbody><tr><th>서버</th><th>클라이언트</th></tr><tr><td><code>srv.bind(("127.0.0.1", 0))</code> 주소 · 포트 등록</td><td></td></tr><tr><td><code>srv.listen()</code> 손님 받을 준비</td><td></td></tr><tr><td><code>conn, addr = srv.accept()</code> 올 때까지 기다림</td><td><code>c = socket.create_connection(("127.0.0.1", port))</code> 접속(3단계 악수)</td></tr><tr><td><code>data = conn.recv(1024)</code> 받기</td><td><code>c.sendall(바이트)</code> 보내기</td></tr><tr><td><code>conn.sendall(바이트)</code> 답하기</td><td><code>c.recv(1024)</code> 답 받기</td></tr></tbody></table><p><code>accept()</code> 는 손님이 올 때까지 <b>멈춰 기다려요</b>. 그래서 한 파일에 둘 다 두려면 서버를 [[레슨:C11]]의 <b>스레드</b>(<code>threading.Thread</code>)에서 돌리고, 메인 줄기가 클라이언트가 돼요. 예제를 실행하면 <code>클라이언트: 받음 메아리: 안녕</code> 이 나와요. 이렇게 하면 터미널 하나로도, 시험할 때도 돌아가요.</p><p><b>진짜로는 두 터미널</b>에서 따로 켜요. 서버를 먼저 켜 두고(터미널 1), VS Code 터미널 오른쪽 위 <b>+</b> 로 새 터미널(2)을 열어 클라이언트를 켜요.</p><pre># server.py — 터미널 1 에서 먼저: python server.py\nimport socket\n\nsrv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nsrv.bind(("127.0.0.1", 50007))      # 둘이 미리 정한 포트\nsrv.listen()\nprint("기다리는 중… (끄려면 Ctrl+C)")\nwhile True:\n    conn, addr = srv.accept()\n    with conn:\n        print("접속:", addr)\n        data = conn.recv(1024)\n        conn.sendall("메아리: ".encode() + data)</pre><pre># client.py — 터미널 2 에서: python client.py\nimport socket\n\nc = socket.create_connection(("127.0.0.1", 50007))\nc.sendall(input("보낼 말: ").encode())\nprint(c.recv(1024).decode())\nc.close()</pre><div class="bk-warn"><b>서버 프로그램은 두 터미널에서</b> — 서버가 안 켜져 있으면 클라이언트는 <code>ConnectionRefusedError</code>(아무도 안 기다려요)예요. Windows 방화벽 창이 뜨면 「개인 네트워크」 만 허용하세요. <code>127.0.0.1</code> 만 쓰니까 밖에서는 못 들어와요. 서버는 <code>Ctrl</code> + <code>C</code> 로 꺼요.</div><p>TCP 는 <b>바이트 흐름</b>이라 「메시지 하나 = <code>recv</code> 한 번」 이 아니에요. 긴 글은 나눠 오고, 짧은 글 둘이 붙어 오기도 해요. 그래서 줄 단위로 주고받을 때는 끝에 <code>"\\n"</code> 을 붙여 보내고, 받는 쪽은 소켓을 파일처럼 만들어 한 줄씩 읽어요.</p><pre>f = conn.makefile("r", encoding="utf-8")\nline = f.readline()        # "\\n" 까지 한 줄 — 나눠 와도 모아 줘요\nfor line in f:             # 상대가 닫을 때까지 한 줄씩\n    ...</pre><p><code>makefile</code> 은 속에서 온 바이트를 <b>버퍼</b>에 모아 두었다가 줄바꿈이 오면 한 줄을 꺼내 줘요. 한글이 조각 경계에서 잘려도 다 모은 뒤에 글자로 바꾸니 안 깨져요([[레슨:C12]]). 손으로 하면 이래요 — [[레슨:CB3]] 에서 직접 만들어 봐요.</p><pre>buf = b""\nbuf += chunk                       # recv 로 온 바이트를 모으고\nwhile b"\\n" in buf:\n    line, buf = buf.split(b"\\n", 1)   # 줄바꿈 앞까지가 한 줄</pre>`,
      example: { code: `import socket\nimport threading\n\n# 서버 준비: 내 컴퓨터(127.0.0.1)의 빈 포트에서 기다리기\nsrv = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\nsrv.bind(("127.0.0.1", 0))\nsrv.listen()\nport = srv.getsockname()[1]\n\ndef serve():\n    conn, addr = srv.accept()          # 손님이 올 때까지 기다림\n    with conn:\n        data = conn.recv(1024)\n        print("서버: 받음", data.decode())\n        conn.sendall("메아리: ".encode() + data)\n\nt = threading.Thread(target=serve)     # 서버는 스레드에서\nt.start()\n\n# 클라이언트: 같은 파일 안에서 접속\nc = socket.create_connection(("127.0.0.1", port), timeout=3)   # 3단계 악수\nc.sendall("안녕".encode())\nreply = c.recv(1024)\nprint("클라이언트: 받음", reply.decode())\nc.close()\nt.join()\nsrv.close()` } },
    { title: 'HTTP 는 TCP 위의 글자', html: `<p>웹 브라우저가 쓰는 HTTP 는 따로 있는 마법이 아니에요. TCP 연결 위로 정해진 모양의 <b>글자</b>를 보내는 약속이에요.</p><pre>보내는 글(요청)                     받는 글(응답)\nGET /hello HTTP/1.0                HTTP/1.0 200 OK\nHost: localhost                    Content-Type: text/plain; charset=utf-8\n(빈 줄)                            Content-Length: 13\n                                   (빈 줄)\n                                   안녕, HTTP!</pre><p>줄 끝은 <code>\\r\\n</code>, 머리말이 끝나면 빈 줄 하나예요. 예제는 파이썬의 작은 웹 서버(<code>http.server</code>)를 스레드로 켜고, 브라우저 대신 TCP 소켓으로 이 글자를 직접 보내요. 실행하면 첫 줄에 <code>HTTP/1.0 200 OK</code> 가 나와요.</p><p>층으로 보면 이래요. HTTP(응용) → TCP(전송, 포트 80 · 443) → IP(인터넷) → 와이파이(링크). 브라우저에 주소를 치면 ① DNS 로 이름을 주소로([[레슨:C14]]) ② TCP 연결 ③ 이 글자를 보내요. HTTPS 는 ②와 ③ 사이에 암호를 한 겹 더 씌워요(챕터 5).</p><div class="bk-step-box"><b>HTTP 를 더 알고 싶으면</b><br>요청 줄 · 헤더 · 상태 코드 · JSON, 그리고 <code>requests</code> 로 진짜 API 부르기와 내 서버 만들기는 <a href="../api/#lesson/H1" target="_blank" rel="noopener">HTTP·API·SDK 교과서 「요청 한 줄씩: 주소 · 메서드 · 헤더 · 본문」 ↗</a> 에서 해요. 이 교과서는 그 <b>아래</b>(패킷 · IP · DNS · TCP)까지예요.</div>`,
      example: { code: `import socket\nimport threading\nfrom http.server import BaseHTTPRequestHandler, HTTPServer\n\nclass Hello(BaseHTTPRequestHandler):\n    def do_GET(self):\n        body = "안녕, HTTP!".encode()\n        self.send_response(200)\n        self.send_header("Content-Type", "text/plain; charset=utf-8")\n        size = str(len(body))\n        self.send_header("Content-Length", size)\n        self.end_headers()\n        self.wfile.write(body)\n\n    def log_message(self, *args):      # 서버 기록 줄은 안 찍기\n        pass\n\nserver = HTTPServer(("127.0.0.1", 0), Hello)\nport = server.server_address[1]\nthreading.Thread(target=server.handle_request).start()   # 요청 하나만 받고 끝\n\n# 브라우저 대신 TCP 소켓으로 HTTP 글자를 직접 보내요\nc = socket.create_connection(("127.0.0.1", port), timeout=3)\nc.sendall(b"GET /hello HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n")\nanswer = b""\nwhile True:\n    chunk = c.recv(1024)\n    if not chunk:                      # 서버가 다 보내고 닫았어요\n        break\n    answer += chunk\nc.close()\nserver.server_close()\n\nhead, body = answer.split(b"\\r\\n\\r\\n", 1)\nlines = head.decode().split("\\r\\n")\nprint(lines[0])\nfor line in lines[1:]:\n    if line.startswith("Content-"):\n        print(line)\nprint()\nprint(body.decode())` } },
  ],
  summary: ['TCP 는 악수 · 순서 번호 · ACK · 다시 보내기로 빠짐없이 순서대로', 'UDP 는 확인 없이 빠르게, 포트로 프로그램을 골라요', 'socket 으로 직접 주고받고, HTTP 는 그 위의 글자예요'] },
{ id: 'CB3', ch: 4, boss: true, title: '만들어 보기: 내 컴퓨터 안의 채팅', mode: 'text',
  tutorSummary: '챕터 4 묶기 — localhost TCP 채팅. 바이트 흐름에서 줄 나누기(버퍼에 모아 b"\\n" 로 자르고 다 모은 줄만 decode), 서버는 접속마다 스레드 하나(handle) + 공유 딕셔너리 clients 는 threading.Lock, 첫 줄 /nick 이름, 받은 줄은 모두에게 [이름] 글(broadcast), /quit 이면 나가기 알림. 더하기: /who · /to 이름 귓속말 · 이름 겹침 막기. 시험은 한 파일(서버 스레드 + 포트 0 + 클라이언트를 메인에서 차례로), 진짜는 세 터미널(포트 50007, 클라이언트는 받기 스레드 + input 보내기).', pages: [], summary: [] },
{ id: 'C16', ch: 5, n: 16, title: "해시: 데이터의 지문", mode: 'text',
  tutorSummary: "해시 함수는 어떤 길이의 바이트든 정해진 길이의 짧은 값(지문)으로 바꾼다. hashlib.sha256(바이트).hexdigest() 는 16진 64글자(32바이트 = 256비트). 글자는 .encode() 로 UTF-8 바이트로 바꿔 넣는다(C2). 같은 데이터는 언제나 같은 지문, 한 글자만 바뀌어도 지문의 절반쯤이 바뀐다(눈사태 효과). 정보를 버리므로 되돌릴 수 없고 거꾸로 가는 길은 넣어 보고 비교하기뿐 — 4자리 PIN 처럼 짧은 건 다 넣어 보면 찾는다(C18 로). 넣을 수 있는 것은 끝이 없고 지문은 2**256 가지라 충돌은 반드시 있지만 SHA-256 은 찾을 수 없다. 장난감으로 지문을 앞 2글자만 쓰면 금방 충돌. MD5 · SHA-1 은 충돌 찾는 법이 알려져 보안에 안 쓴다. 쓰임: 다운로드 체크섬(open(…, \"rb\") 로 읽어 update 로 조각씩), Windows 의 Get-FileHash, Git 커밋 id 와 파일 id(sha1(b\"blob 길이\\0\" + 내용) = git hash-object).",
  terms: {"해시": "아무 길이의 데이터를 정해진 길이의 짧은 값(지문)으로 바꾸는 함수, 또는 그 값. 같은 데이터는 늘 같은 값, 되돌릴 수 없다", "충돌": "서로 다른 데이터가 같은 해시 값을 갖는 것. 반드시 있지만 좋은 해시(SHA-256)에서는 찾을 수 없다", "체크섬": "받은 파일이 원래 파일과 똑같은지 확인하려고 함께 알려 주는 해시 값"},
  pages: [
    { title: "hashlib.sha256 · 무엇이든 64글자 지문", html: `<p>[[해시]] 함수는 아무리 긴 데이터를 넣어도 <b>정해진 길이의 짧은 값</b>을 돌려줘요. 사람의 지문처럼, 데이터가 같으면 지문도 같아요. 파이썬에는 <code>hashlib</code> 모듈에 들어 있어요.</p><pre>import hashlib\n\nh = hashlib.sha256("hello".encode())\nprint(h.hexdigest())        # 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824\nprint(len(h.digest()))      # 32 — 32바이트 = 256비트\nprint(len(h.hexdigest()))   # 64 — 16진 글자 64개</pre><ul><li>해시는 <b>바이트</b>를 받아요. 글자는 <code>.encode()</code> 로 UTF-8 바이트로 바꿔서 넣어요([[레슨:C2]]). 처음부터 바이트면 <code>b"hello"</code> 처럼 써요</li><li><code>digest()</code> 는 바이트 32개, <code>hexdigest()</code> 는 그 바이트를 16진 글자로 쓴 거예요. 1바이트가 16진 2글자라서 64글자예요([[레슨:C1]])</li><li>SHA-256 의 256 은 「지문이 256비트」 라는 뜻이에요</li></ul><p>넣는 데이터가 0바이트든 책 한 권이든 지문 길이는 똑같아요.</p><pre>import hashlib\n\nprint(hashlib.sha256(b"").hexdigest()[:16])                      # e3b0c44298fc1c14 — 빈 데이터도 지문이 있어요\nprint(hashlib.sha256(("긴 글 " * 1000).encode()).hexdigest()[:16])   # 2b875ad2a4df0296</pre><p>지문으로 쓰려면 세 가지가 꼭 맞아야 해요. 이 레슨에서 하나씩 봐요.</p><table class="kb"><tbody><tr><th>성질</th><th>뜻</th></tr><tr><td>같으면 같다</td><td>같은 데이터는 언제, 어느 컴퓨터에서 해도 같은 지문</td></tr><tr><td>조금만 달라도 딴판</td><td>한 글자만 바뀌어도 지문이 완전히 달라짐</td></tr><tr><td>되돌릴 수 없다</td><td>지문만 보고 원래 데이터를 알아낼 수 없음</td></tr></tbody></table>`,
      example: { code: `import hashlib\n\nfor text in ["hello", "hello", "Hello", "가", "긴 글 " * 1000]:\n    data = text.encode()\n    h = hashlib.sha256(data).hexdigest()\n    print(f"{len(data):5} 바이트 → {h[:16]}… ({len(h)}글자)")` } },
    { title: "\"hello\" 와 \"hellp\" · 한 글자에 딴판", html: `<p>마지막 글자 하나만 바꿔 볼게요.</p><pre>import hashlib\n\nfor w in ["hello", "hellp", "Hello"]:\n    print(w, hashlib.sha256(w.encode()).hexdigest()[:16])</pre><pre>hello 2cf24dba5fb0a30e\nhellp fdd7585e08c4e2af\nHello 185f8db32271fe25</pre><p>비슷한 데이터인데 지문은 <b>하나도 안 닮았어요</b>. 비트로 세어 보면 256비트 중 <b>절반쯤</b>이 바뀌어요. 이걸 「눈사태 효과」 라고 해요. 작은 돌 하나가 산 전체를 무너뜨리듯 한 비트가 전부를 흔들어요.</p><pre>import hashlib\n\na = hashlib.sha256(b"hello").digest()\nb = hashlib.sha256(b"hellp").digest()\nbits = sum(bin(x ^ y).count("1") for x, y in zip(a, b))\nprint(bits)   # 131 — 256비트 중에</pre><ul><li><code>x ^ y</code> 는 XOR — 두 바이트에서 <b>다른 비트만 1</b>이 돼요([[레슨:C5]])</li><li><code>bin(…).count("1")</code> 로 그 1 을 세면 「다른 비트 수」 예요</li></ul><p>그래서 해시는 「<b>같은가, 다른가</b>」 만 알려 줘요. 지문이 비슷하다고 데이터가 비슷한 게 아니고, 데이터를 살짝 고쳐 지문을 그대로 두는 것도 안 돼요. 파일이 한 바이트라도 바뀌었는지 잡아내는 데 딱 맞아요.</p>`,
      example: { code: `import hashlib\n\na = hashlib.sha256(b"hello").hexdigest()\nb = hashlib.sha256(b"hellp").hexdigest()\nprint(a)\nprint(b)\nmarks = "".join("^" if x != y else " " for x, y in zip(a, b))\nprint(marks)\nprint("다른 16진 글자:", marks.count("^"), "/ 64")\n\nda = hashlib.sha256(b"hello").digest()\ndb = hashlib.sha256(b"hellp").digest()\nbits = sum(bin(x ^ y).count("1") for x, y in zip(da, db))\nprint("다른 비트:", bits, "/ 256")` } },
    { title: "되돌릴 수 없음 · 충돌은 있지만 못 찾음", html: `<p>책 한 권을 넣어도 지문은 32바이트예요. 그 안에 책 내용이 다 들어갈 수는 없으니, 해시는 정보를 <b>버려요</b>. 그래서 지문에서 데이터로 거꾸로 가는 계산이 없어요.</p><p>거꾸로 갈 방법은 하나뿐이에요. <b>후보를 하나씩 넣어 보고 지문을 비교하기</b>. 후보가 적으면 이걸로 금방 찾아요. 4자리 PIN 은 10000개만 넣어 보면 끝나요.</p><pre>import hashlib\n\ntarget = hashlib.sha256(b"4821").hexdigest()   # 새어 나간 PIN 지문\nfor i in range(10000):\n    pin = f"{i:04d}"\n    if hashlib.sha256(pin.encode()).hexdigest() == target:\n        print("찾았어요:", pin)\n        break</pre><p>그래서 「지문만 저장하면 안전」 이 아니에요. 비밀번호를 어떻게 지키는지는 [[레슨:C18]] 에서 봐요.</p><p>[[충돌]]도 생각해 봐요. 넣을 수 있는 데이터는 끝이 없는데 지문은 2<sup>256</sup> 가지뿐이니, <b>같은 지문을 갖는 서로 다른 데이터</b>가 반드시 있어요. 하지만 2<sup>256</sup> 은 78자리 수라서 세상의 컴퓨터를 다 모아도 하나를 찾을 수 없어요.</p><p>지문을 앞 2글자(256가지)만 쓰는 장난감 해시라면 금방 부딪혀요. 예제에서 몇 개 만에 부딪히는지 보세요.</p><div class="bk-warn"><b>MD5 · SHA-1 은 보안에 쓰지 않기</b> — 오래된 해시인 MD5 와 SHA-1 은 충돌을 일부러 만드는 방법이 알려졌어요. <code>hashlib.md5</code> 도 있지만 보안에는 <code>sha256</code> 이상을 써요.</div>`,
      example: { code: `import hashlib\n\nprint(len(str(2 ** 256)), "자리 수 —", 2 ** 256)\n\ntarget = hashlib.sha256(b"4821").hexdigest()\nfor i in range(10000):\n    pin = f"{i:04d}"\n    if hashlib.sha256(pin.encode()).hexdigest() == target:\n        print("PIN 찾았어요:", pin, "/", i + 1, "번 넣어 봄")\n        break\n\nseen = {}\ni = 0\nwhile True:\n    m = f"msg{i}"\n    short = hashlib.sha256(m.encode()).hexdigest()[:2]   # 앞 2글자만 = 256가지\n    if short in seen:\n        print("충돌:", seen[short], "와", m, "→ 둘 다", short)\n        break\n    seen[short] = m\n    i += 1\nprint(i + 1, "개 만에 부딪혔어요")` } },
    { title: "파일 지문 open(…, \"rb\") · Git 커밋 id", html: `<p>프로그램을 내려받는 페이지에 <code>SHA256: 3a7f…</code> 같은 긴 글자가 적혀 있을 때가 있어요. 그게 [[체크섬]]이에요. 받은 파일의 지문을 내가 만들어서 같으면 <b>한 바이트도 안 깨지고, 아무도 안 바꾼</b> 파일이에요.</p><pre>import hashlib\n\ndef file_sha256(path):\n    h = hashlib.sha256()\n    with open(path, "rb") as f:\n        while True:\n            chunk = f.read(65536)\n            if not chunk:\n                break\n            h.update(chunk)\n    return h.hexdigest()</pre><ul><li><code>"rb"</code> 는 글자가 아니라 <b>바이트 그대로</b> 읽기예요. 지문은 바이트로 만드니까요</li><li>큰 파일은 한 번에 다 읽지 않고 64KB 씩 <code>update</code> 로 넣어요. 조각으로 넣어도 한 번에 넣은 것과 지문이 같아요</li><li>Windows 에서는 PowerShell 의 <code>Get-FileHash 파일이름</code> 이 같은 지문을 대문자로 보여 줘요. 비교할 때는 <code>.strip().lower()</code> 로 빈칸을 떼고 소문자로 맞춰요</li></ul><p><b>Git 의 커밋 id 도 해시예요.</b> <code>git log</code> 에 보이는 <code>a1b2c3d…</code> 는 그 커밋의 내용(파일들의 지문 · 앞 커밋의 id · 작성자 · 시간 · 메시지)을 해시한 값이에요. 그래서 옛 커밋 하나를 몰래 고치면 그 id 가 바뀌고, 그 id 를 품은 뒤의 커밋 id 도 줄줄이 다 바뀌어서 바로 티가 나요. GitHub 화면의 커밋 주소도 이 id 예요(<a href="../github/#lesson/G3" target="_blank" rel="noopener">GitHub 교과서 「웹에서 고치고 기록 보기」 ↗</a>).</p><p>Git 이 파일 하나에 붙이는 id 는 이렇게 만들어요. Git 은 원래 SHA-1 을 써요(SHA-256 으로 옮겨 가는 중).</p><pre>import hashlib\n\ndata = b"hello\\n"\nheader = f"blob {len(data)}\\0".encode()   # 「blob 6」 + 0 바이트\nprint(hashlib.sha1(header + data).hexdigest())   # ce013625030ba8dba906f756967f9e9ca394464a</pre><p>Git Bash 에서 <code>echo hello | git hash-object --stdin</code> 을 치면 똑같은 값이 나와요.</p>`,
      example: { code: `import hashlib\n\nwith open("app.txt", "w", encoding="utf-8") as f:\n    f.write("설치 파일이라고 생각해요\\n" * 1000)\n\ndef file_sha256(path):\n    h = hashlib.sha256()\n    with open(path, "rb") as f:\n        while True:\n            chunk = f.read(65536)\n            if not chunk:\n                break\n            h.update(chunk)\n    return h.hexdigest()\n\nwith open("app.txt", "rb") as f:\n    whole = hashlib.sha256(f.read()).hexdigest()\nprint("조각으로:", file_sha256("app.txt")[:16])\nprint("한 번에:", whole[:16])\nprint("같아요?", whole == file_sha256("app.txt"))\n\ndata = b"hello\\n"\nheader = f"blob {len(data)}\\0".encode()\nprint("Git 파일 id:", hashlib.sha1(header + data).hexdigest())` } },
  ],
  summary: ["hashlib.sha256(바이트).hexdigest() 는 어떤 데이터든 64글자 지문 — 같으면 같고, 한 글자만 달라도 딴판", "해시는 되돌릴 수 없어서 넣어 보고 비교할 뿐 — 짧은 PIN 은 다 넣어 보면 찾는다", "다운로드 체크섬 · Git 커밋 id 가 해시 — 파일이 한 바이트라도 바뀌었는지 안다"] },
{ id: 'C17', ch: 5, n: 17, title: "암호화: 잠그고 풀기", mode: 'text',
  tutorSummary: "암호화는 열쇠로 평문을 암호문으로 잠그고 다시 푸는 것(해시와 달리 되돌릴 수 있다). 카이사르는 알파벳을 k 칸 밀기(chr((ord(c) - ord(\"A\") + k) % 26 + ord(\"A\"))) — 열쇠가 25개뿐이라 다 넣어 보면 풀린다. XOR 은 바이트마다 data ^ key, 같은 열쇠로 두 번 하면 제자리 → 대칭 암호(진짜는 AES). 짧은 열쇠를 cycle 로 되풀이하면 원문 일부를 알 때 암호문 ^ 원문 = 열쇠. 대칭의 문제는 열쇠를 어떻게 건네나 — 공개키(열린 자물쇠를 나눠 줌)와 열쇠 나눠 갖기(작은 수 Diffie-Hellman: pow(g, a, p), 둘 다 같은 수가 됨). 작은 RSA: p=61 q=53 n=3233 phi=3120 e=17 d=pow(e, -1, phi)=2753, 잠그기 pow(m, e, n) 풀기 pow(c, d, n), 서명은 거꾸로. 안전한 이유는 큰 n 의 소인수 분해가 어려움(진짜는 2048비트). HTTPS 자물쇠 = 인증서 서명(공개키) + 열쇠 나눠 갖기 + 대칭 암호 + 바뀌었나 확인. 직접 만든 암호는 원리 보기용, 진짜는 검증된 라이브러리.",
  terms: {"평문": "잠그기 전의 원래 데이터. 잠근 것은 암호문", "대칭 암호": "잠그는 열쇠와 푸는 열쇠가 같은 암호. 빠르지만 열쇠를 미리 나눠 가져야 한다(AES 등)", "공개키 암호": "잠그는 열쇠(공개키)는 누구에게나 주고, 푸는 열쇠(개인키)는 나만 가지는 암호(RSA 등)"},
  pages: [
    { title: "카이사르 caesar(글, 3) · 열쇠는 25개뿐", html: `<p>해시는 되돌릴 수 없었죠. <b>암호화</b>는 다시 풀 수 있어요. 열쇠로 [[평문]]을 잠가 암호문을 만들고, 열쇠가 있는 사람만 다시 풀어요.</p><p>가장 오래된 암호 하나가 카이사르 암호예요. 알파벳을 정해진 칸 수만큼 <b>밀어서</b> 써요. 3칸이면 A→D, B→E … Z 다음은 다시 A 로 돌아가서 X→A 예요.</p><pre>def shift(c, k):\n    if "A" &lt;= c &lt;= "Z":\n        return chr((ord(c) - ord("A") + k) % 26 + ord("A"))\n    return c   # 알파벳이 아니면 그대로\n\ndef caesar(text, k):\n    return "".join(shift(c, k) for c in text)\n\nsecret = caesar("HELLO WORLD", 3)\nprint(secret)               # KHOOR ZRUOG\nprint(caesar(secret, -3))   # HELLO WORLD</pre><ul><li><code>ord(c) - ord("A")</code> 로 A=0 … Z=25 번호를 만들어요([[레슨:C2]] 의 ord · chr)</li><li><code>% 26</code> 이 끝을 넘으면 처음으로 돌려요. 25+3 = 28 → 2 = C</li><li>잠글 때 +3, 풀 때 −3. <b>같은 열쇠 3</b> 으로 잠그고 풀어요</li></ul><p>약점은 열쇠가 1~25 <b>25개뿐</b>이라는 거예요. 다 넣어 보고 말이 되는 줄을 고르면 끝이에요. 예제가 25줄을 다 찍어요. 또 같은 글자는 늘 같은 글자로 바뀌어서, 영어에서 제일 많이 나오는 E 가 무엇으로 바뀌었는지만 봐도 풀려요.</p>`,
      example: { code: `def shift(c, k):\n    if "A" <= c <= "Z":\n        return chr((ord(c) - ord("A") + k) % 26 + ord("A"))\n    return c\n\ndef caesar(text, k):\n    return "".join(shift(c, k) for c in text)\n\nsecret = caesar("MEET AT NOON", 7)\nprint("암호문:", secret)\nprint("열쇠를 모를 때 — 다 넣어 보기")\nfor k in range(1, 26):\n    print(f"{k:2}: {caesar(secret, -k)}")` } },
    { title: "XOR data ^ key · 두 번 하면 제자리", html: `<p>컴퓨터 암호는 알파벳이 아니라 <b>바이트</b>를 바꿔요. 가장 간단한 건 XOR 이에요([[레슨:C5]] 의 그 게이트). 두 비트가 같으면 0, 다르면 1 이고, 파이썬에서는 <code>^</code> 예요.</p><pre>print(5 ^ 3)       # 6\nprint(5 ^ 3 ^ 3)   # 5 — 같은 수로 두 번 XOR 하면 제자리</pre><table class="kb"><tbody><tr><th></th><th>비트</th></tr><tr><td>5</td><td>0101</td></tr><tr><td>^ 3(열쇠)</td><td>0011</td></tr><tr><td>= 6(잠금)</td><td>0110</td></tr><tr><td>^ 3(열쇠)</td><td>0011</td></tr><tr><td>= 5(풀림)</td><td>0101</td></tr></tbody></table><p>바이트마다 열쇠 바이트로 XOR 하면 잠기고, 같은 열쇠로 한 번 더 하면 풀려요.</p><pre>from itertools import cycle\n\ndef xor(data, key):\n    return bytes(b ^ k for b, k in zip(data, cycle(key)))\n\nkey = b"k3y"   # 시험용 고정 열쇠 — 진짜는 secrets.token_bytes(32)\nlocked = xor("안녕, 비밀이에요".encode(), key)\nprint(locked.hex()[:16])           # 87a6f180b6ec4713\nprint(xor(locked, key).decode())   # 안녕, 비밀이에요</pre><ul><li><code>cycle(key)</code> 는 열쇠를 k, 3, y, k, 3, y … 끝없이 되풀이해요. <code>zip</code> 은 짧은 쪽(데이터)이 끝나면 멈춰요</li><li><code>locked.hex()</code> 는 바이트를 16진 글자로 바꿔 보여 주고, 16진 글자로 받은 건 <code>bytes.fromhex(글)</code> 로 바이트로 되돌려요</li><li>잠그는 열쇠와 푸는 열쇠가 같아서 [[대칭 암호]]라고 해요. 진짜로 쓰는 대칭 암호 AES 도 생각은 같아요. 열쇠로 바이트를 섞고 같은 열쇠로 되돌리는데, 훨씬 복잡하게 여러 번 섞어서 아직 아무도 못 풀었어요</li></ul><div class="bk-warn"><b>짧은 열쇠를 되풀이하면 약해요</b> — 원문의 앞부분을 짐작할 수 있으면(편지는 「안녕」 으로 시작하겠죠) <code>암호문 ^ 원문 = 열쇠</code> 가 나와요. 예제에서 열쇠를 알아내 봐요.</div>`,
      example: { code: `from itertools import cycle\n\ndef xor(data, key):\n    return bytes(b ^ k for b, k in zip(data, cycle(key)))\n\nprint(5 ^ 3, 5 ^ 3 ^ 3)\n\nkey = b"k3y"\nmsg = "안녕, 비밀이에요".encode()\nlocked = xor(msg, key)\nprint("원문", len(msg), "바이트 →", locked.hex())\nprint("풀기:", xor(locked, key).decode())\nprint("틀린 열쇠:", xor(locked, b"abc").decode(errors="replace"))\n\nguess = "안녕".encode()            # 앞부분을 짐작\nfound = xor(locked[:3], guess[:3])  # 암호문 ^ 원문\nprint("알아낸 열쇠:", found)` } },
    { title: "열쇠 나눠 갖기 pow(g, a, p)", html: `<p>대칭 암호의 진짜 문제는 <b>열쇠를 어떻게 건네나</b> 예요. 인터넷으로 열쇠를 보내면 중간에서 엿보는 사람도 열쇠를 봐요. 처음 들어간 쇼핑몰과 미리 만나서 열쇠를 나눠 가질 수도 없고요.</p><p>답은 <b>잠그는 열쇠와 푸는 열쇠를 다르게</b> 하는 거예요. 쇼핑몰이 <b>열린 자물쇠</b>를 누구에게나 나눠 주고, 그 자물쇠의 열쇠는 혼자 가져요. 이게 [[공개키 암호]]예요.</p><pre>쇼핑몰 ── 열린 자물쇠(공개키) ──→ 민수   누가 봐도 괜찮아요\n민수: 대칭 열쇠를 상자에 넣고 그 자물쇠로 잠금\n민수 ── 잠긴 상자 ──→ 쇼핑몰\n쇼핑몰: 혼자 가진 열쇠(개인키)로 열기\n\n엿보는 사람: 자물쇠와 잠긴 상자만 봐요 → 못 열어요</pre><p>또 하나의 방법은 열쇠를 아예 보내지 않고, 둘이 <b>같은 열쇠를 각자 만드는</b> 거예요. 작은 수로 해 볼게요. <code>pow(g, a, p)</code> 는 <code>g ** a % p</code> 와 같은데, 수가 아주 커도 빨리 계산해요.</p><pre>p, g = 23, 5          # 모두에게 공개\na = 6                 # 민수만 아는 수\nb = 15                # 쇼핑몰만 아는 수\nA = pow(g, a, p)      # 민수가 보냄(공개)\nB = pow(g, b, p)      # 쇼핑몰이 보냄(공개)\nprint(A, B)           # 8 19\nprint(pow(B, a, p))   # 2 — 민수가 만든 열쇠\nprint(pow(A, b, p))   # 2 — 쇼핑몰이 만든 열쇠, 같아요</pre><p>엿보는 사람은 23, 5, 8, 19 를 다 봐요. 그래도 열쇠 2 를 만들려면 a 나 b 가 필요해요. 「5 를 몇 번 곱하면 23 으로 나눈 나머지가 8 이 되나」 를 풀어야 하는데, 이렇게 작은 수는 다 넣어 보면 되지만 진짜는 수백 자리 수라서 못 풀어요. HTTPS 도 이런 방법(ECDHE)으로 열쇠를 만들어요.</p>`,
      example: { code: `p, g = 23, 5\na, b = 6, 15\nA = pow(g, a, p)\nB = pow(g, b, p)\nprint("공개된 것:", p, g, A, B)\nprint("민수의 열쇠:", pow(B, a, p))\nprint("쇼핑몰의 열쇠:", pow(A, b, p))\n\nprint("엿보는 사람이 a 를 다 넣어 보기")\nfor x in range(1, p):\n    if pow(g, x, p) == A:\n        print("  a 는", x, "→ 열쇠", pow(B, x, p), "(수가 작아서 뚫려요)")\n        break` } },
    { title: "작은 RSA pow(m, e, n) · 공개키 (e, n)", html: `<p>공개키 암호의 대표가 RSA 예요. 누구에게나 주는 <b>공개키 (e, n)</b> 과 나만 가지는 <b>개인키 d</b> 가 있어요. 공개키로 잠근 건 개인키로만 풀려요. 장난감 크기로 만들어 볼게요.</p><pre>p, q = 61, 53              # 비밀 소수 두 개\nn = p * q                  # 공개\nphi = (p - 1) * (q - 1)    # 비밀\ne = 17                     # 공개\nd = pow(e, -1, phi)        # 개인키\nprint(n, phi, d)           # 3233 3120 2753\n\nm = 65                     # 보낼 수(글자 "A" 의 번호)\nc = pow(m, e, n)           # 공개키로 잠금\nprint(c)                   # 2790\nprint(pow(c, d, n))        # 65 — 개인키로 풀면 제자리</pre><ul><li><code>pow(e, -1, phi)</code> 는 「e 를 곱해서 phi 로 나눈 나머지가 1 이 되는 수」 예요. 17 × 2753 = 46801 = 3120 × 15 + 1</li><li>e 로 거듭제곱하고 d 로 또 거듭제곱하면 원래 수로 돌아와요. 왜 그런지는 수학(오일러의 정리)이라, 여기서는 「그렇게 되도록 고른 수」 로 받아들여요</li><li>n 보다 작은 수만 잠글 수 있어요. 글자는 <code>ord</code> 로 번호를 만들어 하나씩 잠가요(예제)</li></ul><p><b>왜 안전할까요?</b> d 를 만들려면 phi 가, phi 를 만들려면 p 와 q 가 필요해요. 공개된 n 에서 p, q 를 찾는 것(소인수 분해)이 어려워서 안전해요. 3233 은 금방 나뉘지만, 진짜 n 은 2048비트(617자리)라서 못 나눠요.</p><p><b>서명</b>은 거꾸로 써요. 개인키로 잠근 걸 누구나 공개키로 풀어 보고, 풀리면 「정말 그 사람이 잠갔구나」 를 알아요. HTTPS 의 인증서가 이걸 써요.</p>`,
      example: { code: `p, q = 61, 53\nn = p * q\nphi = (p - 1) * (q - 1)\ne = 17\nd = pow(e, -1, phi)\nprint("공개키 (e, n) =", (e, n), " 개인키 d =", d)\n\nword = "HI!"\nlocked = [pow(ord(ch), e, n) for ch in word]\nprint("잠근 수:", locked)\nprint("푼 글:", "".join(chr(pow(c, d, n)) for c in locked))\n\nsig = pow(65, d, n)\nprint("서명:", sig, "→ 공개키로 풀면", pow(sig, e, n))\n\nfor f in range(2, n):\n    if n % f == 0:\n        print("n 을 나눠 보기:", f, "×", n // f, "— 작은 n 은 바로 뚫려요")\n        break` } },
    { title: "HTTPS 자물쇠 = 공개키 + 대칭 + 해시", html: `<p>주소창의 자물쇠(https)는 지금까지 본 것들을 <b>함께</b> 써요.</p><table class="kb"><tbody><tr><th>단계</th><th>쓰는 것</th><th>하는 일</th></tr><tr><td>① 상대 확인</td><td>인증서 서명(공개키) + 해시</td><td>믿을 만한 기관이 서명한 인증서로 「진짜 그 사이트」 인지 확인</td></tr><tr><td>② 열쇠 만들기</td><td>열쇠 나눠 갖기(ECDHE)</td><td>둘만 아는 대칭 열쇠를 각자 만들기</td></tr><tr><td>③ 주고받기</td><td>대칭 암호(AES · ChaCha20)</td><td>본문을 빠르게 잠그고 풀기</td></tr><tr><td>④ 안 바뀌었나</td><td>열쇠로 만든 확인 값(태그)</td><td>중간에서 한 바이트라도 바꾸면 알아챔</td></tr></tbody></table><p>공개키 암호는 느려서 처음에 열쇠를 만들 때만 쓰고, 많은 데이터는 빠른 대칭 암호로 주고받아요. 예제는 이 흐름을 장난감으로 한 번에 돌려요. 작은 수로 열쇠를 나눠 갖고, 그 수를 sha256 해서 열쇠 바이트를 만들고([[레슨:C16]]), XOR 로 잠그고, 확인 값을 붙여요.</p><p>파이썬에서 <code>https://</code> 주소를 부르면(<code>requests</code> 등) 이 모든 걸 알아서 해요. 우리가 할 일은 <b>http 가 아니라 https 를 쓰는 것</b>, 인증서 경고가 뜨면 넘어가지 않는 거예요.</p><div class="bk-warn"><b>직접 만든 암호로 진짜 비밀을 지키지 않기</b> — 이 레슨의 카이사르 · XOR · 작은 RSA 는 원리를 보는 장난감이에요. 진짜 통신은 HTTPS, 파일을 잠글 때는 검증된 라이브러리(<code>cryptography</code> 패키지 등)를 써요. 비밀번호는 잠그는 게 아니라 <b>해시로</b> 저장해요 → [[레슨:C18]].</div>`,
      example: { code: `import hashlib\nfrom itertools import cycle\n\ndef xor(data, key):\n    return bytes(b ^ k for b, k in zip(data, cycle(key)))\n\ndef tag(key, data):\n    return hashlib.sha256(key + data).hexdigest()[:16]\n\n# ② 열쇠 나눠 갖기(장난감 크기)\np, g = 23, 5\nA, B = pow(g, 6, p), pow(g, 15, p)\nshared = pow(B, 6, p)\nkey = hashlib.sha256(str(shared).encode()).digest()\nprint("둘이 만든 수:", shared, pow(A, 15, p))\n\n# ③ 대칭으로 잠그고 ④ 확인 값 붙이기\nlocked = xor("주문: 책 1권".encode(), key)\nt = tag(key, locked)\nprint("보내는 것:", locked.hex(), t)\n\n# 받는 쪽\nprint("확인 값 맞나:", tag(key, locked) == t)\nprint("풀기:", xor(locked, key).decode())\n\n# 중간에서 한 바이트를 바꾸면\nbad = bytes([locked[0] ^ 1]) + locked[1:]\nprint("바뀐 걸 받으면 확인 값 맞나:", tag(key, bad) == t)` } },
  ],
  summary: ["카이사르 · XOR 은 같은 열쇠로 잠그고 푸는 대칭 암호 — 열쇠가 짧거나 적으면 다 넣어 보기로 뚫린다", "열쇠를 건네는 문제는 공개키(열린 자물쇠)와 열쇠 나눠 갖기로 — 작은 RSA 는 pow(m, e, n) · pow(c, d, n)", "HTTPS = 공개키로 확인 · 열쇠 만들기 + 대칭으로 주고받기 — 진짜는 검증된 라이브러리"] },
{ id: 'C18', ch: 5, n: 18, title: "비밀번호 저장하기", mode: 'text',
  tutorSummary: "비밀번호는 그대로(평문) 저장하지 않는다 — 새어 나가면 다른 사이트까지 뚫림. sha256 지문만 저장해도 부족: 같은 비밀번호 = 같은 지문(누가 같은지 보임), 많이 쓰는 비밀번호 목록을 미리 해시해 둔 표로 찾는 사전 공격, sha256 은 너무 빨라서 수억 개도 금방. 소금(salt): 사람마다 다른 무작위 바이트를 비밀번호 앞에 붙여 해시하고 소금도 함께 저장(비밀 아님) → 같은 비밀번호도 다른 지문, 미리 만든 표가 소용없음. 느린 해시: hashlib.scrypt(pw.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32) — 이 교과서는 빨리 돌게 n=2**14(한 번 약 0.04초 · 16MB), 실제 서비스는 n=2**17(maxmem 함께) 또는 pbkdf2_hmac 600,000번 이상. 소금은 secrets.token_bytes(16)(random 은 씨앗을 알면 맞힘), 시험할 때만 고정 바이트. 비교는 hmac.compare_digest(같은 시간). JSON 에는 salt.hex() · hash.hex() 로, 읽을 때 bytes.fromhex.",
  terms: {"사전 공격": "많이 쓰는 비밀번호 목록을 하나씩 해시해서 새어 나간 지문과 비교하는 공격. 미리 표로 만들어 두면 찾기만 하면 된다", "소금": "비밀번호마다 다르게 붙이는 무작위 바이트(salt). 지문과 함께 저장하며 비밀은 아니다. 같은 비밀번호도 지문이 달라진다", "느린 해시": "일부러 시간과 메모리를 많이 쓰게 만든 비밀번호용 해시(scrypt · PBKDF2 · Argon2). 넣어 보기 공격을 느리게 한다"},
  pages: [
    { title: "평문 금지 · sha256 만으로는 뚫려요", html: `<p>회원 비밀번호를 <b>그대로</b> 파일에 저장하면, 그 파일이 한 번 새어 나가는 순간 모든 사람의 비밀번호가 보여요. 사람들은 여러 사이트에 같은 비밀번호를 쓰니 다른 사이트까지 뚫려요. 그래서 비밀번호는 <b>서버도 모르게</b> 저장해요.</p><p>[[레슨:C16]] 의 해시를 쓰면 어떨까요? 가입할 때 지문만 저장하고, 로그인할 때 입력한 비밀번호의 지문을 만들어 비교해요. 되돌릴 수 없으니 안전해 보이지만 구멍이 있어요.</p><pre>import hashlib\n\ndef sha(pw):\n    return hashlib.sha256(pw.encode()).hexdigest()\n\nusers = {"민수": sha("123456"), "영희": sha("sunflower7"), "철수": sha("123456")}\nprint(users["민수"] == users["철수"])   # True — 둘이 같은 비밀번호인 게 보여요</pre><p>더 큰 구멍은 [[사전 공격]]이에요. 사람들이 많이 쓰는 비밀번호 목록을 미리 해시해서 표로 만들어 두면, 새어 나간 지문을 표에서 <b>찾기만</b> 하면 돼요.</p><pre>common = ["123456", "password", "qwerty", "iloveyou", "sunflower7"]\ntable = {sha(pw): pw for pw in common}   # 지문 → 비밀번호 표\nfor name, h in users.items():\n    print(name, table.get(h, "못 찾음"))</pre><pre>민수 123456\n영희 sunflower7\n철수 123456</pre><p>게다가 sha256 은 <b>너무 빨라요</b>. 파이썬으로도 1초에 수백만 번, 그래픽 카드로는 수십억 번 해요. 목록에 비밀번호가 수억 개 있어도 금방 다 넣어 봐요. 다음 두 쪽에서 이 구멍들을 막아요.</p>`,
      example: { code: `import hashlib\n\ndef sha(pw):\n    return hashlib.sha256(pw.encode()).hexdigest()\n\nusers = {"민수": sha("123456"), "영희": sha("sunflower7"),\n         "철수": sha("123456"), "지은": sha("x9#Lq!2vRt&m")}\nfor name, h in users.items():\n    print(name, h[:16])\nprint("민수와 철수 지문이 같아요?", users["민수"] == users["철수"])\n\ncommon = ["123456", "password", "qwerty", "iloveyou", "sunflower7"]\ntable = {sha(pw): pw for pw in common}\nprint("사전 공격:")\nfor name, h in users.items():\n    print(" ", name, table.get(h, "못 찾음"))` } },
    { title: "소금 salt + 비밀번호 · 같아도 다른 지문", html: `<p>[[소금]](salt)은 사람마다 다르게 만드는 <b>무작위 바이트</b>예요. 비밀번호 앞에 붙여서 해시하고, 소금은 지문 옆에 <b>함께 저장</b>해요. 소금은 비밀이 아니에요. 로그인할 때 같은 소금을 붙여야 같은 지문이 나오니까요.</p><pre>import hashlib\n\ndef salted(salt, pw):\n    return hashlib.sha256(salt + pw.encode()).hexdigest()\n\nsalt_minsu = b"q8Zr2LmX0vTb5NcW"    # 시험용 고정 소금 — 진짜는 secrets.token_bytes(16)\nsalt_chulsu = b"Hn4sV0pYc7Ke1DwA"\nprint(salted(salt_minsu, "123456")[:16])\nprint(salted(salt_chulsu, "123456")[:16])</pre><p>둘 다 비밀번호가 <code>123456</code> 인데 지문이 달라요. 이제 저장하는 건 이 세 칸이에요.</p><table class="kb"><tbody><tr><th>이름</th><th>소금</th><th>지문</th></tr><tr><td>민수</td><td>q8Zr2LmX…</td><td>sha256(소금 + 비밀번호)</td></tr><tr><td>철수</td><td>Hn4sV0pY…</td><td>sha256(소금 + 비밀번호)</td></tr></tbody></table><ul><li>같은 비밀번호여도 지문이 달라서 <b>누가 같은 비밀번호인지</b> 안 보여요</li><li>미리 만든 「지문 → 비밀번호」 표가 <b>소용없어요</b>. 공격자는 사람마다 그 사람의 소금을 붙여 목록을 처음부터 다시 해시해야 해요</li><li>소금은 16바이트쯤, 사람마다 · 비밀번호를 바꿀 때마다 새로 만들어요</li></ul><p>그래도 공격자가 한 사람만 노린다면? 그 사람의 소금을 붙여 목록을 돌리면 되고, sha256 은 여전히 빨라요. 그래서 해시 자체를 <b>느리게</b> 만들어요.</p>`,
      example: { code: `import hashlib\n\ndef salted(salt, pw):\n    return hashlib.sha256(salt + pw.encode()).hexdigest()\n\nusers = {\n    "민수": b"q8Zr2LmX0vTb5NcW",\n    "철수": b"Hn4sV0pYc7Ke1DwA",\n}\nfor name, salt in users.items():\n    print(name, "소금", salt.hex()[:12], "지문", salted(salt, "123456")[:16])\n\ncommon = ["123456", "password", "qwerty"]\ntable = {hashlib.sha256(pw.encode()).hexdigest(): pw for pw in common}\nh = salted(users["민수"], "123456")\nprint("미리 만든 표로 찾기:", table.get(h, "못 찾음"))\nprint("민수 소금을 붙여 다시 넣어 보기:",\n      [pw for pw in common if salted(users["민수"], pw) == h])` } },
    { title: "느린 해시 hashlib.scrypt(…, n=2**14)", html: `<p>비밀번호용 해시는 일부러 <b>느리고 메모리를 많이 쓰게</b> 만든 [[느린 해시]]를 써요. 파이썬에는 <code>hashlib.scrypt</code> 가 들어 있어요.</p><pre>import hashlib\n\nsalt = b"q8Zr2LmX0vTb5NcW"   # 시험용 고정 소금\nkey = hashlib.scrypt("sunflower7".encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)\nprint(len(key))          # 32\nprint(key.hex()[:16])    # 6efe926d323c53c0</pre><table class="kb"><tbody><tr><th>값</th><th>뜻</th></tr><tr><td><code>n=2**14</code></td><td>일의 양. 2의 거듭제곱으로, 두 배로 하면 시간과 메모리도 두 배</td></tr><tr><td><code>r=8, p=1</code></td><td>한 번에 섞는 덩어리 크기 · 나란히 할 개수. 보통 이대로</td></tr><tr><td><code>dklen=32</code></td><td>결과 바이트 수</td></tr></tbody></table><p>메모리는 128 × n × r 바이트 = 약 16MB 를 써요. 그래픽 카드로 한꺼번에 많이 돌리기도 어려워요.</p><table class="kb"><tbody><tr><th></th><th>한 번</th><th>1억 개 넣어 보기</th></tr><tr><td>sha256</td><td>약 0.0000003초</td><td>30초쯤</td></tr><tr><td>scrypt(n=2**14)</td><td>약 0.04초</td><td>46일쯤</td></tr></tbody></table><p>로그인하는 사람에게 0.04초는 아무것도 아니지만, 넣어 보는 공격자에게는 십만 배 넘게 오래 걸려요. 내 PC 의 시간은 예제가 재 줘요.</p><div class="bk-warn"><b>진짜 서비스는 값을 더 크게</b> — 이 교과서는 예제가 빨리 돌게 <code>n=2**14</code> 를 써요. 실제 서비스는 <code>n=2**17</code> 쯤(메모리 128MB 라서 <code>maxmem=2**28</code> 도 함께 줘요)으로, 로그인 한 번이 서버에서 0.1초쯤 걸리게 골라요. <code>hashlib.pbkdf2_hmac("sha256", pw, salt, 600000)</code> 도 같은 일을 하는데, 반복 수는 60만 번 이상이에요. 많이 쓰는 Argon2 · bcrypt 는 따로 까는 패키지예요.</div>`,
      example: { code: `import hashlib\nimport time\n\nsalt = b"q8Zr2LmX0vTb5NcW"\npw = "sunflower7".encode()\n\nt = time.perf_counter()\nfor i in range(100000):\n    hashlib.sha256(salt + pw).digest()\nfast = (time.perf_counter() - t) / 100000\n\nt = time.perf_counter()\nkey = hashlib.scrypt(pw, salt=salt, n=2**14, r=8, p=1, dklen=32)\nslow = time.perf_counter() - t\n\nprint("scrypt 지문:", key.hex())\nprint(f"sha256 한 번: {fast:.7f}초")\nprint(f"scrypt 한 번: {slow:.3f}초")\nprint("scrypt 가 천 배 넘게 느려요?", slow > fast * 1000)\nprint(f"1억 개 넣어 보기: sha256 {fast * 1e8:.0f}초, scrypt {slow * 1e8 / 86400:.0f}일")` } },
    { title: "hmac.compare_digest · secrets.token_bytes", html: `<p><b>비교는 <code>hmac.compare_digest</code></b> 로 해요. <code>==</code> 는 앞에서부터 비교하다 다른 바이트를 만나면 바로 멈춰요. 그래서 걸린 시간이 「앞에서 몇 바이트가 맞았나」 를 아주 조금 흘려요. <code>compare_digest(a, b)</code> 는 늘 끝까지 비교해서 시간이 같아요.</p><p><b>소금은 <code>secrets</code></b> 로 만들어요. <code>random</code> 은 씨앗을 알면 다음 값을 맞힐 수 있어서 게임 · 시뮬레이션용이에요. <code>secrets</code> 는 운영체제가 모은 진짜 무작위를 써요.</p><pre>import secrets\n\nprint(len(secrets.token_bytes(16)))   # 16 — 소금 · 열쇠(바이트)\nprint(len(secrets.token_hex(16)))     # 32 — 16바이트를 16진 글자로\nprint(secrets.token_urlsafe(12))      # 임시 비밀번호 · 초대 코드 — 실행할 때마다 달라요</pre><p>지금까지를 모으면 비밀번호 저장은 이렇게 돼요. bytes 는 JSON 에 못 넣어서 <code>.hex()</code> 로 글자로 바꿔 저장하고, 읽을 때 <code>bytes.fromhex(…)</code> 로 되돌려요.</p><pre>import hashlib, hmac, json\n\ndef hash_pw(pw, salt):\n    return hashlib.scrypt(pw.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)\n\ndef make_record(pw, salt):          # 가입: 진짜는 salt = secrets.token_bytes(16)\n    return {"salt": salt.hex(), "hash": hash_pw(pw, salt).hex()}\n\ndef check(pw, record):              # 로그인\n    salt = bytes.fromhex(record["salt"])\n    return hmac.compare_digest(hash_pw(pw, salt), bytes.fromhex(record["hash"]))\n\nusers = {"민수": make_record("sunflower7", b"q8Zr2LmX0vTb5NcW")}\nwith open("users.json", "w", encoding="utf-8") as f:\n    json.dump(users, f, ensure_ascii=False, indent=2)\n\nprint(check("sunflower7", users["민수"]))   # True\nprint(check("sunflower", users["민수"]))    # False</pre><p>파일에는 이름 · 소금 · 지문만 있고 <b>비밀번호는 어디에도 없어요</b>. 만들어 보기 「비밀번호 금고」 가 이 모양이에요.</p>`,
      example: { code: `import hashlib, hmac, json, random, secrets\n\nrandom.seed(42)\nprint("random 씨앗 42:", random.randint(0, 999999))\nrandom.seed(42)\nprint("같은 씨앗 다시:", random.randint(0, 999999), "— 씨앗을 알면 맞혀요")\nprint("secrets 소금 길이:", len(secrets.token_bytes(16)))\n\ndef hash_pw(pw, salt):\n    return hashlib.scrypt(pw.encode(), salt=salt, n=2**14, r=8, p=1, dklen=32)\n\ndef make_record(pw, salt):\n    return {"salt": salt.hex(), "hash": hash_pw(pw, salt).hex()}\n\ndef check(pw, record):\n    salt = bytes.fromhex(record["salt"])\n    return hmac.compare_digest(hash_pw(pw, salt), bytes.fromhex(record["hash"]))\n\nusers = {"민수": make_record("sunflower7", b"q8Zr2LmX0vTb5NcW")}\nwith open("users.json", "w", encoding="utf-8") as f:\n    json.dump(users, f, ensure_ascii=False, indent=2)\n\nwith open("users.json", encoding="utf-8") as f:\n    print(f.read())\n    f.seek(0)\n    saved = json.load(f)\nprint("sunflower7 →", check("sunflower7", saved["민수"]))\nprint("sunflower  →", check("sunflower", saved["민수"]))` } },
  ],
  summary: ["비밀번호는 그대로 저장하지 않는다 — sha256 지문만으로도 같은 비밀번호가 보이고 사전 공격에 뚫린다", "사람마다 다른 소금을 붙이고 느린 해시(hashlib.scrypt)로 — 소금은 지문 옆에 함께 저장", "소금은 secrets.token_bytes(16), 비교는 hmac.compare_digest — JSON 에는 .hex() 로"] },
{ id: 'CB4', ch: 5, boss: true, title: "만들어 보기: 비밀번호 금고", mode: 'text',
  tutorSummary: "챕터 5 묶기 — 명령(가입 · 로그인 · 바꾸기 · 끝)을 한 줄씩 받아 vault.json 에 이름마다 소금(hex) · scrypt 지문(hex) · 틀린 횟수만 저장. 가입은 이미 있는 이름 · 8자 미만 거절, 로그인은 hmac.compare_digest 로 비교하고 3번 틀리면 잠김(맞으면 0 으로), 없는 이름과 틀린 비밀번호는 같은 말로 답함. 바꾸기는 옛 비밀번호 확인 후 새 소금 + 새 지문. 시험에서는 소금을 test-salt-0001 처럼 정해진 값으로(진짜는 secrets.token_bytes(16)). 마지막은 내 금고 파일로 사전 공격 — 느린 해시도 약한 비밀번호는 못 지킨다.",
  pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
