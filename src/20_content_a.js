// =====================================================================
// === CONTENT ===  (레슨·문제·힌트·뱃지·에러 사전·용어집. 전부 데이터)
// =====================================================================
/*
문제 데이터 스키마 (PROBLEMS 배열의 원소)
  id        string  필수. 고유 id. 예: 'L1P1'  (레슨 L1의 1번 문제)
  lesson    string  필수. 소속 레슨 id ('L0'..'L18', 보스는 'B1'..'B5')
  type      string  필수. 'quiz' | 'fill' | 'bug' | 'parsons' | 'block' | 'code'
  title     string  필수. 문제 제목
  prompt    string  필수. 지문 (HTML 허용, <code> 사용 가능)
  tags      string[] 필수. 개념 태그 1~3개 ('출력','변수','계산','조건','반복','리스트','함수','문자열','딕셔너리','클래스','예외','파일','모듈','오개념')
  hints     string[3] 필수. 힌트 3단계 (방향 → 구체 → 거의 정답)
  xp        number  선택. 생략 시 CONFIG.XP[type]
  boss      bool    선택. 보스 문제(HP 바 연출, 테스트 5개 이상)
  project   {steps:string[]} 선택. 미니 프로젝트 체크리스트. 클리어 시 "내 작품"에 저장
  dual      bool    선택. Parsons/텍스트 선택 가능 (텍스트로 풀면 XP 1.5배)
  vary      object  선택. 복습 변형 파라미터. 예: {n:[2,9]} (정수 범위) 또는 {w:['사과','배']} (목록)
                    prompt/starter/solution/tests 안의 {{n}} 이 치환되고 기대 출력은 정답 코드를 실행해 계산
  --- type별 필드 ---
  quiz:    quiz:{opts:string[4], ans:number(0~3), why:string}
  fill:    fill:{code:string('___1___' 자리), blanks:[{a:string[], opt?:string[]}], why:string}
  bug:     bug:{code:string, bugLine:number(1부터), solution:string, tests:TEST[]}
  parsons: parsons:{solution:string, distractors?:string[]}
  block:   starter?:string, solution:string, tests:TEST[], inputExample?:string
  code:    starter?:string, solution:string, tests:TEST[], inputExample?:string, turtle?:bool, ignoreCase?:bool
  TEST = {input?:string(줄바꿈으로 여러 줄), output:string} | {call:string, ret:string(repr)}
  마지막 테스트 1개는 화면에 숨김(하드코딩 방지). 거북이 문제(turtle:true)는 정답 코드의 선분 목록과 비교.

예시:
  { id:'L1P1', lesson:'L1', type:'block', title:'첫 인사', prompt:'<code>안녕, 파이썬!</code>을 출력하세요.',
    tags:['출력'], hints:['print를 쓰세요','print("안녕, 파이썬!")','print("안녕, 파이썬!")'],
    solution:'print("안녕, 파이썬!")', tests:[{output:'안녕, 파이썬!'}] }

레슨 데이터 스키마 (LESSONS 배열)
  id, ch(챕터 번호), n(레슨 번호; 보스는 없음), title, minutes, mode('read'|'block'|'parsons'|'text'),
  boss(bool), blocks(string[] 이 레슨에서 새로 열리는 블록; 누적됨), tutorSummary, terms(object 용어→설명),
  pages:[{title, html, example?:{code, trace?:bool}}], summary:string[3]
*/

const LESSONS = [
{ id:'L0', ch:0, n:0, title:'프로그래밍이란', minutes:5, mode:'read',
  tutorSummary:'프로그래밍은 컴퓨터에게 순서대로 할 일을 적어 주는 것. 코드는 위에서 아래로 실행되고, 에러는 실패가 아니라 컴퓨터가 보내는 힌트다.',
  pages:[
    { title:'버튼을 눌러 보세요', html:`<p>이 앱에서는 <b>진짜 파이썬</b>이 바로 실행돼요. 아래 코드는 화면에 <code>안녕!</code>이라고 말하라는 뜻이에요.</p><p>아무것도 몰라도 괜찮아요. 일단 <b>실행해 보기</b> 버튼을 눌러 보세요.</p>`,
      example:{ code:`print("안녕!")` } },
    { title:'프로그래밍이란', html:`<p>[[프로그래밍]]은 컴퓨터에게 <b>할 일을 순서대로 적어 주는 것</b>이에요. 요리 레시피와 비슷해요. "물을 끓인다 → 면을 넣는다 → 3분 기다린다"처럼요.</p><p>그 레시피를 컴퓨터가 알아듣는 말로 쓴 것이 [[코드]]이고, 우리가 쓸 말이 [[파이썬]]이에요. 파이썬은 사람이 쓰는 영어 문장과 가장 닮은 컴퓨터 언어라서 처음 배우기 좋아요.</p>` },
    { title:'코드는 위에서 아래로', html:`<p>컴퓨터는 코드를 <b>맨 윗줄부터 한 줄씩 차례대로</b> 실행해요. 아래 예제는 세 줄이니까 세 번 말해요. 순서를 바꾸면 말하는 순서도 바뀌어요.</p><p>직접 줄 순서를 바꿔서 실행해 보세요. 예제 코드는 마음껏 고쳐도 돼요.</p>`,
      example:{ code:`print("첫 번째")\nprint("두 번째")\nprint("세 번째")` } },
    { title:'에러는 실패가 아니에요', html:`<p>코드를 잘못 쓰면 컴퓨터가 빨간 글씨로 [[에러]]를 보여 줘요. 겁먹지 마세요. <b>에러는 실패가 아니라 컴퓨터가 보내는 힌트</b>예요. "여기가 이상해요"라고 알려 주는 거죠.</p><p>아래 예제는 일부러 따옴표를 하나 빠뜨렸어요. 실행해서 에러를 구경한 다음, 따옴표를 채워 다시 실행해 보세요. 에러를 만나는 것도 뱃지 조건이랍니다.</p>`,
      example:{ code:`print("따옴표를 빠뜨렸어요)` } },
    { title:'이 앱 사용법', html:`<p><b>지도</b>에서 레슨을 고르고, <b>설명</b>을 읽은 뒤 <b>문제</b>를 풀어요. 문제를 풀면 XP를 얻고 레벨이 올라요.</p><ul><li>막히면 <b>힌트</b> 버튼 (별이 조금 줄어요)</li><li>더 막히면 <b>선생님에게 물어보기</b> (설정에서 API 키 필요, 벌점 없음)</li><li>매일 조금씩 풀면 <b>스트릭</b>(며칠 연속으로 했는지) 불꽃이 커져요</li></ul><p>그럼 퀴즈 3개로 몸을 풀어 볼까요?</p>` },
  ],
  summary:['프로그래밍은 컴퓨터에게 할 일을 순서대로 적는 것','코드는 위에서 아래로 한 줄씩 실행된다','에러는 실패가 아니라 힌트'] },

{ id:'L1', ch:1, n:1, title:'print로 말하기', minutes:10, mode:'block', blocks:['text_print','text','text_join'],
  tutorSummary:'print()는 괄호 안의 내용을 화면에 보여 준다. 글자(문자열)는 따옴표로 감싼다. print를 여러 번 쓰면 여러 줄이 나온다.',
  pages:[
    { title:'print는 말하기', html:`<p>[[print]]는 "이걸 화면에 보여 줘"라는 명령이에요. 괄호 <code>( )</code> 안에 보여 줄 내용을 넣어요. (print는 '프린트'라고 읽고, '찍어 내다'라는 뜻이에요)</p><p>글자를 보여 주고 싶으면 반드시 <b>따옴표</b>로 감싸야 해요. 따옴표로 감싼 글자를 [[문자열]](글자를 줄줄이 이어 놓은 것)이라고 불러요. 따옴표는 큰따옴표 <code>"</code>와 작은따옴표 <code>'</code> 둘 다 돼요. 단, 시작과 끝은 같은 종류여야 해요.</p>`,
      example:{ code:`print("오늘 날씨 좋다")\nprint('작은따옴표도 돼요')` } },
    { title:'따옴표가 없으면?', html:`<p>따옴표 없이 <code>print(안녕)</code>이라고 쓰면 컴퓨터는 "안녕"을 글자가 아니라 <b>어떤 것의 이름</b>으로 생각해요. 그런 이름은 만든 적이 없으니 "그런 이름 몰라요"라는 뜻의 <code>NameError</code>가 나요.</p><p>반대로 숫자는 따옴표가 없어도 돼요. <code>print(7)</code>은 7을 보여 줘요.</p>`,
      example:{ code:`print(7)\nprint("7")\nprint(안녕)` } },
    { title:'여러 줄, 여러 개', html:`<p>print를 여러 번 쓰면 줄이 바뀌면서 차례로 나와요. 하나의 print 안에 쉼표로 여러 개를 넣으면 <b>띄어쓰기 한 칸</b>으로 이어져서 한 줄에 나와요.</p><p>블록 모드에서는 <b>출력</b> 블록을 위아래로 쌓으면 돼요. 블록을 움직이면 오른쪽 코드가 같이 바뀌는 걸 꼭 지켜보세요.</p>`,
      example:{ code:`print("사과")\nprint("배")\nprint("사과", "배", "포도")` } },
  ],
  summary:['print(내용)은 화면에 내용을 보여 준다','글자는 따옴표로 감싼다 (문자열)','print를 쌓으면 줄이 바뀐다'] },

{ id:'L2', ch:1, n:2, title:'변수: 이름표 붙이기', minutes:12, mode:'block', blocks:['variables_set','variables_get','math_number','math_arithmetic','py_change'],
  tutorSummary:'변수는 값을 담는 이름표 붙은 상자. 이름 = 값 으로 만들고, 이름을 쓰면 안의 값이 나온다. 다시 대입하면 값이 바뀐다. 숫자와 문자열은 다른 종류다.',
  terms:{ '변수':'값을 담아 두고 이름으로 꺼내 쓰는 상자' },
  pages:[
    { title:'이름표 붙인 상자', html:`<p>[[변수]]는 <b>값을 넣어 두는 상자에 이름표를 붙인 것</b>이에요. <code>name = "민수"</code>라고 쓰면 "민수"라는 글자를 상자에 넣고 name이라는 이름표를 붙여요.</p><p>여기서 <code>=</code>는 "같다"가 아니라 <b>"오른쪽 값을 왼쪽 이름에 넣어라"</b>라는 뜻이에요. 그래서 왼쪽에는 항상 이름이 와요.</p>`,
      example:{ code:`name = "민수"\nprint(name)\nprint("name")` } },
    { title:'숫자와 글자', html:`<p>변수에는 숫자도 넣을 수 있어요. <code>age = 12</code>처럼요. 숫자는 따옴표가 없어요.</p><p><code>12</code>와 <code>"12"</code>는 달라요. 앞은 계산할 수 있는 <b>숫자</b>, 뒤는 그냥 모양만 숫자인 <b>글자</b>예요. 아래 예제의 마지막 줄을 보세요. 글자끼리 더하면 옆에 이어 붙어요.</p>`,
      example:{ code:`age = 12\nprint(age + 1)\ntext = "12"\nprint(text + "1")` } },
    { title:'값 바꾸기', html:`<p>같은 이름에 다시 넣으면 <b>이전 값은 사라지고 새 값이 들어가요</b>. 상자는 하나, 내용물만 바뀌는 거예요.</p><p><code>x = x + 1</code>은 "지금 x에 1을 더한 값을 다시 x에 넣어라"예요. 수학에서는 말이 안 되지만 프로그래밍에서는 아주 흔한 문장이에요. 줄여서 <code>x += 1</code>이라고도 써요.</p>`,
      example:{ code:`x = 5\nprint(x)\nx = x + 1\nprint(x)\nx += 10\nprint(x)` } },
  ],
  summary:['변수는 값을 담는 이름표 상자','= 는 오른쪽 값을 왼쪽 이름에 넣는 것','다시 넣으면 값이 바뀐다 (x = x + 1)'] },

{ id:'L3', ch:1, n:3, title:'계산하기와 input', minutes:15, mode:'block', blocks:['math_modulo','py_floordiv','py_input','py_int','py_str','py_float'],
  tutorSummary:'사칙연산 + - * /, 나머지 %, 몫 //, 거듭제곱 **. input()은 사용자가 입력한 글자(문자열)를 돌려준다. 숫자로 계산하려면 int()로 바꿔야 한다.',
  terms:{ '형 변환':'값의 종류를 바꾸는 것. int("3")은 글자 "3"을 숫자 3으로 바꾼다' },
  pages:[
    { title:'계산기처럼', html:`<p>파이썬은 계산기예요. <code>+</code>는 더하기, <code>-</code>는 빼기, <code>*</code>는 곱하기, <code>/</code>는 나누기예요. 곱하기는 x가 아니라 <b>별표 <code>*</code></b>를 써요.</p><p>별표 두 개 <code>**</code>는 "같은 수를 여러 번 곱하기"예요. <code>2 ** 3</code>은 2를 세 번 곱한 것(2×2×2)이라서 8이에요.</p>`,
      example:{ code:`print(3 + 4)\nprint(10 - 7)\nprint(6 * 7)\nprint(2 ** 10)` } },
    { title:'나머지와 몫', html:`<p>나누기 <code>/</code>는 결과에 항상 소수점이 붙어요. <code>7 / 2</code>는 3.5이고, <code>8 / 2</code>도 4가 아니라 <b>4.0</b>이 나와요.</p><p>초등학교 나눗셈처럼 "7 나누기 2는 <b>3</b>, <b>1</b> 남음"으로 보고 싶을 때가 있죠. 그 <b>3(몫)</b>만 원하면 <code>//</code>, <b>1(나머지)</b>만 원하면 <code>%</code>를 써요. 나머지는 짝수·홀수를 구분할 때 아주 자주 써요. <code>n % 2</code>가 0이면(2로 나눠서 남는 게 없으면) 짝수예요.</p>`,
      example:{ code:`print(7 / 2)\nprint(7 // 2)\nprint(7 % 2)\nprint(8 / 2)` } },
    { title:'input: 사용자에게 묻기', html:`<p>[[input]]('인풋', 들어오는 것)은 사용자가 키보드로 적은 것을 받아 와요. <code>name = input()</code>처럼 변수에 담아 쓰죠. 이 앱에서는 에디터 아래 <b>입력값 칸</b>에 미리 적어 둔 내용을 한 줄씩 읽어요.</p><p>중요한 점: input이 가져온 값은 <b>항상 글자(문자열)</b>예요. 7을 입력해도 숫자 7이 아니라 글자 "7"이에요. 숫자로 계산하려면 <code>int()</code>('인트', 정수)로 감싸서 숫자로 바꿔 줘야 해요. 이렇게 값의 종류를 바꾸는 걸 [[형 변환]]이라고 해요.</p>`,
      example:{ code:`n = input()\nprint(n + n)\nm = int(n)\nprint(m + m)`, stdin:'7' } },
  ],
  summary:['+ - * / 와 나머지 %, 몫 //','input()은 항상 문자열을 돌려준다','숫자로 쓰려면 int()로 바꾼다'] },

{ id:'L4', ch:1, n:4, title:'조건문: 만약에', minutes:15, mode:'block', blocks:['controls_if','logic_compare','logic_operation','logic_negate','logic_boolean'],
  tutorSummary:'if 조건: 으로 조건이 참일 때만 실행. elif로 다른 조건, else로 나머지. 비교는 == != < > <= >=, 논리는 and or not. 콜론 뒤 줄은 들여쓰기.',
  terms:{ '조건문':'조건이 맞을 때만 어떤 코드를 실행하게 하는 문장 (if)', '들여쓰기':'줄 앞에 공백 4칸을 넣어 "이 줄은 위 문장에 속한다"고 표시하는 것' },
  pages:[
    { title:'만약 ~라면', html:`<p>[[조건문]] <code>if</code>('이프', 만약)는 "만약 ~라면 이걸 해라"예요. <code>if 조건:</code> 다음 줄부터 <b>앞에 빈칸 4칸(스페이스 키 4번)을 넣어 들여쓴 줄</b>이, 조건이 맞을 때(참일 때)만 실행돼요.</p><p>이 [[들여쓰기]]가 파이썬의 핵심 규칙이에요. 들여쓴 줄은 if에 속하고, 들여쓰기를 다시 없애면 if 밖이에요. 줄 끝의 콜론 <code>:</code>(쌍점, Shift+;)을 빠뜨리면 에러가 나요.</p>`,
      example:{ code:`age = 15\nif age >= 13:\n    print("청소년이에요")\nprint("이 줄은 항상 나와요")` } },
    { title:'아니면 (elif, else)', html:`<p>조건이 안 맞을 때(거짓일 때) 할 일은 <code>else:</code>('엘스', 아니면)에 써요. 조건이 여러 개면 중간에 <code>elif 조건:</code>('엘리프', 아니고 만약)을 넣어요. 위에서부터 검사해서 <b>처음 맞는 하나만</b> 실행돼요.</p>`,
      example:{ code:`score = 85\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("C")` } },
    { title:'비교와 논리', html:`<p>비교할 때는 <code>== != &lt; &gt; &lt;= &gt;=</code>를 써요. <b>같다는 <code>==</code> (등호 두 개)</b>예요. 등호 하나 <code>=</code>는 변수에 넣는 것이었죠.</p><p>조건 두 개를 묶을 땐 <code>and</code>(그리고: 둘 다 맞아야), <code>or</code>(또는: 하나라도 맞으면), 뒤집을 땐 <code>not</code>(아니다)을 써요.</p>`,
      example:{ code:`x = 7\nprint(x == 7)\nprint(x > 10)\nprint(x > 0 and x < 10)\nprint(not x == 7)` } },
  ],
  summary:['if 조건: 아래 들여쓴 줄이 참일 때 실행','elif / else 로 갈래를 나눈다','같다는 == (두 개), 넣기는 = (한 개)'] },

{ id:'B1', ch:1, boss:true, title:'보스: 숫자 맞히기 1단계', minutes:10, mode:'block', pages:[], summary:[],
  tutorSummary:'input으로 받은 수를 int로 바꾸고, 비밀 숫자 7과 비교해 정답/더 커요/더 작아요를 출력하는 조건 분기 종합.' },

{ id:'L5', ch:2, n:5, title:'for와 range: 반복하기', minutes:15, mode:'block', blocks:['py_for_range','controls_repeat_ext'],
  tutorSummary:'for i in range(n): 은 n번 반복하며 i가 0부터 n-1까지 변한다. range(a,b)는 a부터 b-1, range(a,b,step)은 step씩. 반복 안의 코드는 들여쓴다.',
  terms:{ '반복문':'같은 일을 여러 번 되풀이하게 하는 문장 (for, while)', 'range':'연속된 숫자를 만들어 주는 것. range(5)는 0,1,2,3,4' },
  pages:[
    { title:'같은 일을 여러 번', html:`<p>"안녕"을 100번 출력하려고 print를 100줄 쓰면 손이 아프죠. [[반복문]] <code>for</code>를 쓰면 한 번만 써도 돼요.</p><p><code>for i in range(3):</code>은 "i를 0, 1, 2로 바꿔 가며 아래 들여쓴 줄을 3번 실행해라"예요. i는 반복 때마다 바뀌는 변수예요.</p>`,
      example:{ code:`for i in range(3):\n    print("안녕", i)`, trace:true } },
    { title:'range 자세히', html:`<p><code>range(5)</code>는 0, 1, 2, 3, 4예요. <b>5는 들어가지 않아요!</b> 0부터 시작해서 5 바로 앞에서 끝나요. 이걸 헷갈려서 생기는 버그가 정말 많아요.</p><p><code>range(1, 6)</code>은 1부터 5까지, <code>range(0, 10, 2)</code>는 0부터 2씩 뛰어 8까지예요. 세 번째 값이 "몇 칸씩 뛸지"예요.</p>`,
      example:{ code:`for i in range(5):\n    print(i)\nprint("---")\nfor i in range(1, 6):\n    print(i)\nprint("---")\nfor i in range(0, 10, 2):\n    print(i)` } },
    { title:'거북이에게 명령하기', html:`<p><code>import turtle</code>을 쓰면 화면에 거북이가 나타나요. <code>turtle.forward(100)</code>은 앞으로 100만큼 가고, <code>turtle.left(90)</code>은 왼쪽으로 90도 돌아요. 펜을 들고 가니까 지나간 자리에 선이 남죠.</p><p>정사각형은 "앞으로 가고 90도 돌기"를 4번 하면 돼요. 반복문이 딱이죠?</p>`,
      example:{ code:`import turtle\nfor i in range(4):\n    turtle.forward(100)\n    turtle.left(90)` } },
  ],
  summary:['for i in range(n): 은 n번 반복','range(5)는 0~4, 5는 없다','range(시작, 끝, 간격)'] },

{ id:'L6', ch:2, n:6, title:'while: 조건 반복', minutes:15, mode:'block', blocks:['controls_whileUntil','controls_flow_statements'],
  tutorSummary:'while 조건: 은 조건이 참인 동안 반복. 안에서 조건이 바뀌지 않으면 무한루프. break로 즉시 탈출, continue로 다음 반복으로 건너뜀.',
  terms:{ '무한루프':'끝나는 조건이 없어서 영원히 도는 반복. 보통 조건을 바꾸는 줄을 깜빡해서 생긴다' },
  pages:[
    { title:'~하는 동안 반복', html:`<p><code>for</code>는 횟수가 정해졌을 때, <code>while</code>은 <b>"조건이 참인 동안"</b> 계속 반복할 때 써요. 몇 번 돌지 모를 때 좋아요.</p><p><code>while n &lt; 3:</code>은 n이 3보다 작은 동안 반복해요. 반복 안에서 n을 키워야 언젠가 조건이 거짓이 되어 멈춰요.</p>`,
      example:{ code:`n = 0\nwhile n < 3:\n    print("n은", n)\n    n = n + 1\nprint("끝")`, trace:true } },
    { title:'무한루프 탈출', html:`<p>반복 안에서 조건을 바꾸는 줄을 깜빡하면 영원히 돌아요. 이게 [[무한루프]]예요. 이 앱은 5초가 지나면 강제로 멈추고 알려 줘요.</p><p>일부러 <code>while True:</code>로 무한히 돌게 한 뒤 <code>break</code>로 빠져나오는 방법도 자주 써요. "끝"이라고 입력할 때까지 받는 프로그램이 그 예예요.</p>`,
      example:{ code:`while True:\n    word = input()\n    if word == "끝":\n        break\n    print("입력:", word)\nprint("종료")`, stdin:'사과\n배\n끝' } },
    { title:'continue', html:`<p><code>continue</code>는 "이번 회차는 여기서 그만하고 다음 회차로 넘어가라"예요. 홀수만 건너뛰고 짝수만 출력할 때 이렇게 써요.</p>`,
      example:{ code:`for i in range(6):\n    if i % 2 == 1:\n        continue\n    print(i)` } },
  ],
  summary:['while 조건: 은 조건이 참인 동안 반복','조건을 바꾸지 않으면 무한루프','break는 탈출, continue는 다음 회차로'] },

{ id:'L7', ch:2, n:7, title:'리스트: 여러 개를 한 줄로', minutes:15, mode:'block', blocks:['lists_create_with','lists_length','py_index','py_append','py_pop','controls_forEach'],
  tutorSummary:'리스트는 [a, b, c]처럼 여러 값을 순서대로 담는 상자. 인덱스는 0부터. append로 끝에 추가, pop으로 꺼내기, len으로 개수. for x in 리스트: 로 하나씩 꺼낸다.',
  terms:{ '리스트':'여러 값을 순서대로 담는 묶음. 대괄호 [ ]로 만든다', '인덱스':'리스트 안에서의 번호. 0부터 시작한다' },
  pages:[
    { title:'줄줄이 담기', html:`<p>과일 세 개를 변수 세 개에 담으면 번거롭죠. [[리스트]]는 <b>여러 값을 한 줄로 담는 상자</b>예요. 대괄호 안에 쉼표로 나열해요.</p><p>리스트 안의 각 값은 번호가 있어요. 이걸 [[인덱스]]라고 하는데, <b>0부터 시작</b>해요. 첫 번째가 0, 두 번째가 1이에요. 마지막은 -1로도 꺼낼 수 있어요.</p>`,
      example:{ code:`fruits = ["사과", "배", "포도"]\nprint(fruits[0])\nprint(fruits[2])\nprint(fruits[-1])` } },
    { title:'추가하고 꺼내기', html:`<p><code>리스트.append(값)</code>은 끝에 값을 붙여요. <code>리스트.pop()</code>은 마지막 값을 꺼내서 돌려주고 리스트에서 지워요. <code>len(리스트)</code>는 몇 개 들어 있는지 알려 줘요.</p>`,
      example:{ code:`nums = [1, 2]\nnums.append(3)\nprint(nums)\nlast = nums.pop()\nprint(last)\nprint(nums)\nprint(len(nums))`, trace:true } },
    { title:'리스트 하나씩 돌기', html:`<p><code>for x in 리스트:</code>는 리스트의 값을 앞에서부터 하나씩 x에 담으며 반복해요. range 없이 바로 쓸 수 있어서 편해요.</p><p>리스트 값은 <code>리스트[번호] = 새값</code>으로 바꿀 수 있어요.</p>`,
      example:{ code:`animals = ["개", "고양이", "토끼"]\nfor a in animals:\n    print(a, "좋아")\nanimals[1] = "햄스터"\nprint(animals)` } },
  ],
  summary:['리스트 = [값, 값, 값], 인덱스는 0부터','append로 추가, pop으로 꺼내기, len으로 개수','for x in 리스트: 로 하나씩'] },

{ id:'L8', ch:2, n:8, title:'함수: 레시피 만들기', minutes:18, mode:'block', blocks:['procedures_defnoreturn','procedures_defreturn','procedures_callnoreturn','procedures_callreturn','procedures_ifreturn'],
  tutorSummary:'def 이름(매개변수): 로 함수를 정의하고 이름()으로 호출. return으로 값을 돌려준다. return 뒤의 코드는 실행되지 않는다. return이 없으면 None.',
  terms:{ '함수':'여러 줄의 코드에 이름을 붙여 묶어 둔 것. 이름만 부르면 그 코드가 실행된다', '매개변수':'함수를 부를 때 넘겨 주는 재료를 받는 변수 (parameter)', 'return':'함수가 계산한 결과를 부른 쪽에 돌려주는 것' },
  pages:[
    { title:'코드에 이름 붙이기', html:`<p>[[함수]]는 <b>레시피</b>예요. "라면 끓이기" 레시피를 한 번 써 두면, 다음부터는 "라면 끓이기!"라고 부르기만 하면 되죠.</p><p><code>def 이름():</code>으로 레시피를 쓰고(정의), <code>이름()</code>으로 불러요(호출). 정의만 하면 아무 일도 안 일어나요. <b>불러야</b> 실행돼요.</p>`,
      example:{ code:`def hello():\n    print("안녕하세요!")\n    print("반가워요")\n\nhello()\nhello()` } },
    { title:'재료 넘기기', html:`<p>괄호 안에 [[매개변수]]를 두면 부를 때마다 다른 재료를 넘길 수 있어요. <code>def greet(name):</code>에서 name이 매개변수예요. <code>greet("민수")</code>라고 부르면 name에 "민수"가 들어가요.</p>`,
      example:{ code:`def greet(name, times):\n    for i in range(times):\n        print(name, "안녕!")\n\ngreet("민수", 2)\ngreet("영희", 1)`, trace:true } },
    { title:'결과 돌려주기', html:`<p>[[return]]은 함수가 계산한 <b>결과를 돌려주는 것</b>이에요. <code>result = add(2, 3)</code>처럼 돌려받은 값을 변수에 담아요.</p><p>주의! <b>return을 만나면 함수는 그 자리에서 끝나요.</b> return 아래 줄은 실행되지 않아요. return이 없는 함수는 <code>None</code>(아무것도 없음)을 돌려줘요.</p>`,
      example:{ code:`def add(a, b):\n    return a + b\n    print("이 줄은 절대 실행 안 돼요")\n\nresult = add(2, 3)\nprint(result)\nprint(add(10, 20))` } },
  ],
  summary:['def 이름(): 으로 정의, 이름()으로 호출','매개변수로 재료를 받는다','return은 결과를 돌려주고 함수를 끝낸다'] },

{ id:'B2', ch:2, boss:true, title:'보스: 숫자 맞히기 게임 완성', minutes:15, mode:'parsons', pages:[], summary:[],
  tutorSummary:'미니 프로젝트 1. while 반복, 조건문, 시도 횟수 변수, 입력 형 변환을 합쳐 숫자 맞히기 게임을 완성한다.' },
];
