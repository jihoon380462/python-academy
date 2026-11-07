// courses/ml/book.js — 「AI·머신러닝 기초 교과서」 데이터 (v2.33.0, 설계 specs/courses-t3-t7.md). 화면은 core/ui-views-book.js.
// 연습: 내 PC 의 VS Code + 파이썬 + numpy scikit-learn. 예시 답은 check_book 이 python3 로 실제 실행해 출력 예와 비교(파이썬 기본 검사).
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['I0'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 · 준비물 보기',
        title: '먼저 꼭! 파이썬 교과서 「시작하기」 · 가상 환경 · numpy scikit-learn 설치',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 PC 의 VS Code + 파이썬</b> 으로 돌려요. 아직이면 <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 부터. 문법은 파이썬 교과서 챕터 4(클래스 · 예외 · 모듈)까지 알면 편해요. 라이브러리는 가상 환경에 <code>python -m pip install numpy scikit-learn</code> 한 번.' },
    ],
    kicker: '🧠 AI·머신러닝 기초 교과서', hero: '「AI 가 배운다」 = 데이터로 손실 줄이기',
    heroP: '회귀 · 분류 · 군집을 <b>numpy 로 직접</b> 만들어 보고, <b>scikit-learn</b> 으로 같은 걸 짧게 해 봐요. 집값 예측기 · 스팸 분류기 · 손글씨 숫자 분류기를 만들어요.',
    dexName: '머신러닝 도감', dexShort: '도감', dexWhat: '코드·개념', dexHint: '한국어로도 찾기',
    dexExamples: '<code>fit</code>, <code>predict</code>, <code>train_test_split</code>, <code>과적합</code>', dexPlaceholder: '🔍 찾기 …', dexAlt: '',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/" target="_blank" rel="noopener">docs.python.org</a>',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '한눈에', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어 실행해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>ml-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 와 같은 글이 나오면 성공이에요. 「내 화면에서 확인할 것」 은 내 컴퓨터 화면에서 직접 보는 거예요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 파이썬 교과서의 준비 그대로',
    pages: [
      { title: '1. 준비물과 쓰는 법', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요. <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 1~3 을 했다면 거의 준비 끝이에요.</p>
<table class="kb"><tbody><tr><td><b>공부 폴더</b></td><td><code>ml-study</code> 를 만들고 VS Code 로 열어요</td></tr><tr><td><b>가상 환경</b></td><td><code>python -m venv .venv</code> → 켜기(파이썬 교과서 「pip 와 가상 환경」)</td></tr><tr><td><b>라이브러리</b></td><td>공부 폴더의 가상 환경에서 <code>python -m pip install numpy scikit-learn</code>(파이썬 교과서 「pip 와 가상 환경」)</td></tr></tbody></table>`,
        example: { label: '예제 명령 — VS Code 터미널에서', shell: 'mkdir ml-study\ncd ml-study\npython -m venv .venv\npython -m pip install numpy scikit-learn' } },
    ],
  },
  builtins: [],
  tasks: {},
};
