// shared/errors.js — 에러 한국어 사전 (전 코스 공유; 언어별 섹션은 코스가 늘면 추가)
const ERRORS = [
  { name:'SyntaxError', title:'문법 오류', why:'파이썬이 읽을 수 없는 모양의 코드예요. 괄호·콜론·따옴표가 빠졌거나 짝이 맞지 않을 때 가장 많이 나요.', bad:'print("안녕)\nif x > 3\n    print(x)', fix:'따옴표와 괄호는 항상 짝으로, if/for/while/def 줄 끝에는 콜론(:)을 붙이세요.\nprint("안녕")\nif x > 3:\n    print(x)' },
  { name:'IndentationError', title:'들여쓰기 오류', why:'줄 앞 공백이 규칙에 맞지 않아요. 콜론 뒤 줄은 반드시 들여쓰고, 같은 묶음은 같은 칸수여야 해요.', bad:'if x > 3:\nprint(x)', fix:'콜론 다음 줄은 공백 4칸 들여쓰기:\nif x > 3:\n    print(x)' },
  { name:'NameError', title:'이름 오류', why:'정의한 적 없는 이름(변수·함수)을 썼어요. 오타이거나, 따옴표를 빠뜨려 글자가 이름으로 읽힌 경우예요.', bad:'name = "민수"\nprint(nmae)\nprint(안녕)', fix:'이름을 정확히 맞추고, 글자는 따옴표로 감싸세요.\nprint(name)\nprint("안녕")' },
  { name:'TypeError', title:'종류 오류', why:'서로 다른 종류의 값을 섞어 썼어요. 가장 흔한 건 글자와 숫자를 더하는 것이에요.', bad:'age = input()\nprint(age + 1)', fix:'int()로 숫자로 바꾼 뒤 계산하거나, str()로 글자로 바꿔 이어 붙이세요.\nprint(int(age) + 1)' },
  { name:'ValueError', title:'값 오류', why:'종류는 맞는데 값이 이상해요. int("abc")처럼 숫자로 바꿀 수 없는 글자를 바꾸려 할 때 나요.', bad:'n = int("abc")', fix:'숫자 모양의 글자만 int()로 바꿀 수 있어요. try/except ValueError로 받아 주면 안전해요.' },
  { name:'IndexError', title:'번호 오류', why:'리스트에 없는 번호를 꺼냈어요. 인덱스는 0부터 시작하므로 3개짜리 리스트의 마지막은 2예요.', bad:'a = [1, 2, 3]\nprint(a[3])', fix:'마지막은 a[2] 또는 a[-1]이에요. len(a)보다 작은 번호만 쓰세요.' },
  { name:'KeyError', title:'키 오류', why:'딕셔너리에 없는 키를 대괄호로 꺼냈어요. CSV를 읽을 때 나면 파일의 열 이름(첫 줄)이 코드의 이름과 다른 거예요.', bad:'d = {"a": 1}\nprint(d["b"])', fix:'d.get("b", 0)처럼 get을 쓰거나, if "b" in d: 로 먼저 확인하세요.' },
  { name:'ZeroDivisionError', title:'0으로 나눔', why:'0으로 나눌 수는 없어요. 나누는 수가 변수라면 0이 들어온 거예요.', bad:'print(10 / 0)', fix:'나누기 전에 if b != 0: 으로 확인하거나 except ZeroDivisionError로 받으세요.' },
  { name:'AttributeError', title:'속성 오류', why:'그 값에 없는 메서드나 속성을 불렀어요. 리스트에 upper()를 쓰거나 메서드 이름에 오타가 있을 때 나요.', bad:'nums = [1, 2]\nnums.add(3)', fix:'리스트에 추가는 append예요. 값의 종류에 맞는 메서드인지 확인하세요.\nnums.append(3)' },
  { name:'ModuleNotFoundError', title:'모듈 없음', why:'import한 이름의 모듈이 없어요. 오타이거나 설치되지 않은 모듈이에요.', bad:'import ramdom', fix:'이름을 확인하세요: import random' },
  { name:'RecursionError', title:'재귀 깊이 초과', why:'함수가 자기 자신을 끝없이 불렀어요. 멈추는 조건이 없는 재귀예요.', bad:'def f():\n    f()\nf()', fix:'자기 자신을 부르는 함수에는 반드시 멈추는 조건(if n == 0: return)을 두세요.' },
  { name:'UnboundLocalError', title:'지역 변수 오류', why:'함수 안에서 바깥 변수를 바꾸려 했어요. 함수 안에서 대입하면 새 지역 변수로 취급돼요.', bad:'count = 0\ndef up():\n    count += 1', fix:'값을 return해서 바깥에서 받거나, 꼭 필요하면 global count 를 선언하세요.' },
  { name:'FileNotFoundError', title:'파일 없음', why:'읽으려는 파일이 없어요. 이름이 틀렸거나 아직 만들지 않은 파일이에요.', bad:'open("없는파일.txt")', fix:'먼저 "w"로 만들거나 try/except FileNotFoundError로 받으세요.' },
  { name:'EOFError', title:'입력 부족', why:'input()을 불렀는데 읽을 입력값이 더 없어요. 이 앱에서는 입력값 칸의 줄 수가 부족할 때 나요.', bad:'a = input()\nb = input()  # 입력값 칸에 한 줄만 있음', fix:'입력값 칸에 input() 횟수만큼 줄을 적어 주세요.' },
  { name:'StopIteration', title:'반복 끝', why:'next()로 더 꺼낼 게 없는 곳에서 꺼냈어요. 초보 단계에서는 보기 드물어요.', bad:'it = iter([1])\nnext(it)\nnext(it)', fix:'for 문을 쓰면 자동으로 끝을 처리해 줘요.' },
  { name:'무한루프', title:'무한루프 (에러는 아니에요)', why:'반복이 끝나는 조건이 영원히 안 만들어져요. 보통 while 안에서 조건을 바꾸는 줄을 깜빡했을 때예요. 이 앱은 5초 뒤 강제로 멈춰요.', bad:'i = 0\nwhile i < 3:\n    print(i)', fix:'반복 안에서 조건이 바뀌게 하세요.\nwhile i < 3:\n    print(i)\n    i += 1' },
];

// 에러 한 줄 풀이 (에러 피드백용)
const ERROR_HINTS = {
  SyntaxError: '문법이 이상해요. 괄호·따옴표 짝이나 줄 끝 콜론(:)을 확인하세요.',
  IndentationError: '들여쓰기가 틀렸어요. 콜론 뒤 줄은 공백 4칸, 같은 묶음은 같은 칸수예요.',
  TabError: '탭과 공백이 섞였어요. 공백 4칸으로 통일하세요.',
  NameError: '그런 이름이 없어요. 오타이거나 따옴표를 빠뜨린 글자일 수 있어요.',
  TypeError: '값의 종류가 안 맞아요. 글자와 숫자를 섞어 계산하진 않았나요?',
  ValueError: '값이 이상해요. 숫자가 아닌 글자를 int()로 바꾸려 하지 않았나요?',
  IndexError: '없는 번호를 꺼냈어요. 인덱스는 0부터 시작해요.',
  KeyError: '딕셔너리에 없는 키예요. get()을 쓰거나 in으로 확인하세요.',
  ZeroDivisionError: '0으로 나눴어요.',
  AttributeError: '그 값에는 그런 메서드가 없어요. 이름을 확인하세요.',
  ModuleNotFoundError: '그런 모듈이 없어요. import 이름을 확인하세요.',
  RecursionError: '함수가 자기 자신을 끝없이 불렀어요.',
  UnboundLocalError: '함수 안에서 바깥 변수를 바꾸려 했어요.',
  FileNotFoundError: '그 파일이 없어요. 먼저 만들었는지 확인하세요.',
  EOFError: '입력값이 부족해요. 입력값 칸을 확인하세요.',
  ImportError: '가져올 수 없는 이름이에요.',
};

// 용어집 (레슨의 [[용어]] 와 연결)
