// courses/llm/book.js — 「LLM 기초 교과서」 데이터 (v2.32.0, 설계 specs/llm-course.md). 화면은 core/ui-views-book.js.
// 연습: 내 PC 의 VS Code + 파이썬 + numpy(가상 환경). 예시 답은 check_book 이 python3 + numpy 로 실제 실행해 출력 예와 비교(파이썬 기본 검사).
// 학습 글은 하나: LLM_TEXT(이 교과서가 직접 쓴 짧은 한국어 글 — 저작권 없음). 만들어 보기는 prep: { name: 'data.txt', text: LLM_TEXT } 로 같은 파일을 준비.
// 무작위는 늘 seed 고정(random.seed(0) · np.random.default_rng(0)), 소수는 round(…, 3) 처럼 잘라서 출력 — 버전 · CPU 에 따라 끝자리가 흔들리지 않게.
const LLM_TEXT = `아침에 일어나면 창문을 연다. 창문을 열면 바람이 들어온다. 바람이 들어오면 방이 시원해진다.
나는 물을 한 잔 마신다. 물을 마시고 세수를 한다. 세수를 하고 밥을 먹는다.
오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다.
오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다.
공원에는 나무가 많다. 나무 아래에 의자가 있다. 의자에 앉아서 책을 읽는다.
책을 읽으면 시간이 빨리 간다. 시간이 빨리 가면 배가 고프다. 배가 고프면 집에 간다.
집에 가면 고양이가 기다린다. 고양이는 나를 보면 운다. 나는 고양이에게 밥을 준다.
고양이는 밥을 먹고 잠을 잔다. 나도 밥을 먹고 숙제를 한다. 숙제를 하고 일기를 쓴다.
일기에는 오늘 한 일을 쓴다. 오늘은 공원에 갔다. 공원에서 친구를 만났다.
친구와 함께 공을 찼다. 공을 차고 물을 마셨다. 물을 마시고 다시 공을 찼다.
저녁에는 엄마가 국을 끓인다. 국을 끓이면 집에 냄새가 난다. 냄새가 나면 동생이 부엌에 온다.
동생은 국을 좋아한다. 나는 밥을 좋아한다. 우리는 함께 밥을 먹는다.
밥을 먹고 이를 닦는다. 이를 닦고 잠옷을 입는다. 잠옷을 입고 불을 끈다.
불을 끄면 방이 어둡다. 방이 어두우면 별이 보인다. 별을 보면 잠이 온다.
내일은 무엇을 할까. 내일은 비가 올까. 비가 오면 집에서 책을 읽는다.
해가 뜨면 친구와 공원에 간다. 공원에 가면 나무 아래에서 책을 읽는다.
나는 책을 좋아한다. 책을 읽으면 모르는 것을 알게 된다. 모르는 것을 알면 기분이 좋다.
기분이 좋으면 노래를 부른다. 노래를 부르면 고양이가 운다. 고양이가 울면 나는 웃는다.
`;
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['N0', 'NB1'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 1 · 준비물 보기',
        title: '먼저 꼭! 파이썬 교과서 — 리스트 · 딕셔너리 · 함수 · 클래스, 그리고 가상 환경',
        html: '이 교과서의 코드는 <b>파이썬</b>이에요. 파이썬 교과서 챕터 3 · 4(리스트 · 딕셔너리 · 함수 · 클래스)와 <a href="../python/#lesson/L16D" target="_blank" rel="noopener">파이썬 교과서 「pip 와 가상 환경」 ↗</a> 을 먼저 보고 오면 편해요. 수학은 사칙연산이면 시작할 수 있어요 — 필요한 건 그때그때 설명해요.' },
      { lessons: ['N5', 'NB2'], chapters: [2], ref: 'SETUP/0', btn: '시작하기 1 · numpy 설치 보기',
        title: '먼저 꼭! numpy 를 설치해요',
        html: '챕터 2 부터는 <code>numpy</code> 를 써요. VS Code 터미널(가상 환경을 켠 채)에서 한 번: <code>python -m pip install numpy</code>. 확인: <code>python -c "import numpy; print(numpy.__version__)"</code> 이 버전을 찍으면 준비 끝.' },
      { lessons: ['N7', 'NB2', 'NB4'], chapters: [],
        title: '학습이 안 되면 학습률부터 줄여요',
        html: '손실이 <code>nan</code> 이 되거나 점점 커지면 학습률(<code>lr</code>)이 너무 큰 거예요. 10배 줄여서 다시 해 보세요.' },
    ],
    kicker: '🤖 LLM 기초 교과서 · 공용', hero: '다음 글자 맞히기로 만드는 아주 작은 언어 모델',
    heroP: 'ChatGPT 같은 LLM 은 사실 <b>「다음 글자 맞히기」</b> 를 아주 크게 한 거예요. 글자 세기부터 시작해 확률 · 손실 · 경사하강 · 어텐션 · 트랜스포머까지, <b>numpy 로 처음부터 직접</b> 만들어 보고, 마지막엔 내가 학습시킨 작은 모델이 그럴듯한 문장을 지어내게 해요 — 「완벽하게가 아니라 이런 느낌으로 움직인다」 까지.',
    dexName: 'LLM 도감', dexShort: '도감', dexWhat: '코드·식', dexHint: '「손실」「어텐션」 처럼 한국어로도 찾기',
    dexExamples: '<code>softmax</code>, <code>@</code>, <code>random.choices</code>, <code>어텐션</code>', dexPlaceholder: '🔍 찾기 — softmax, 손실, 임베딩, 어텐션 …', dexAlt: '「점수 → 확률」 대신 <code>softmax</code>',
    dexDocs: '<a href="https://numpy.org/doc/stable/" target="_blank" rel="noopener">numpy 문서</a> · 수학은 <a href="../math/" target="_blank" rel="noopener">수학 공간 ↗</a>(벡터 · 확률)',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 식', builtinsSub: '소프트맥스 · 손실 · 경사하강 · 어텐션', builtinsChip: '🧮 자주 보는 식',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어요 — 학습 글이 필요한 코드는 같은 폴더에 data.txt 가 있어야 해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>llm-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 학습 글이 필요한 문제는 같은 폴더에 <code>data.txt</code>(시작하기 2)가 있어야 해요. 무작위는 seed 를 고정해서, 같은 코드면 「출력 예」 와 똑같이 나와요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 파이썬 · numpy · 학습 글 준비',
    pages: [
      { title: '1. 준비물: 파이썬 · 가상 환경 · numpy', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요. 파이썬 교과서의 「시작하기」 1~3 을 했다면 거의 준비 끝이에요.</p>
<table class="kb"><tbody><tr><td><b>파이썬 · VS Code</b></td><td>파이썬 교과서 「시작하기」 1~3 그대로</td></tr><tr><td><b>공부 폴더</b></td><td><code>llm-study</code> 폴더를 만들고 VS Code 로 열어요</td></tr><tr><td><b>가상 환경</b></td><td>그 폴더에서 <code>python -m venv .venv</code> → 켜기(파이썬 교과서 「pip 와 가상 환경」)</td></tr><tr><td><b>numpy</b></td><td>챕터 2 부터 필요해요: <code>python -m pip install numpy</code> · 확인 <code>python -c "import numpy; print(numpy.__version__)"</code></td></tr></tbody></table>
<p class="muted small">PyTorch 같은 큰 라이브러리는 쓰지 않아요. 계산이 하나하나 다 보이게 numpy 로만 만들어요 — 큰 모델은 같은 계산을 빨리 하는 도구를 쓸 뿐이에요(마지막 레슨).</p>`,
        example: { label: '예제 명령 — VS Code 터미널에서', shell: 'mkdir llm-study\ncd llm-study\npython -m venv .venv\npython -m pip install numpy\npython -c "import numpy; print(numpy.__version__)"' } },
      { title: '2. 학습 글 data.txt', html: `<p>이 교과서의 모델은 모두 <b>같은 글 하나</b>로 배워요. 아래 글을 📋 복사해서 공부 폴더에 <code>data.txt</code> 로 저장하세요(VS Code 에서 새 파일 → 붙여 넣기 → 저장, 인코딩은 UTF-8). 이 교과서가 직접 쓴 글이라 마음껏 써도 돼요.</p>
<p>짧고 비슷한 문장이 되풀이되죠? 작은 모델도 「다음에 무엇이 오나」 를 배울 수 있게 일부러 그렇게 썼어요. 내 글로 바꿔 넣어도 되지만, 그러면 출력 예와 숫자가 달라져요.</p>`,
        example: { label: 'data.txt — 이 내용을 그대로 저장', shell: LLM_TEXT } },
    ],
  },
  builtins: [],
  tasks: {},
};
