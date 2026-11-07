// courses/ai/book.js — 「AI와 협업 교과서」 데이터 (v2.33.0, 설계 specs/courses-t3-t7.md). 화면은 core/ui-views-book.js.
// 연습: 내 PC 의 VS Code + 파이썬. 예시 답은 check_book 이 python3 로 실제 실행해 출력 예와 비교(파이썬 기본 검사).
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['Z0'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 · 준비물 보기',
        title: '먼저 꼭! 파이썬 교과서 「시작하기」 · 가상 환경',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 PC 의 VS Code + 파이썬</b> 으로 돌려요. 아직이면 <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 부터. 문법은 파이썬 교과서 챕터 4(클래스 · 예외 · 모듈)까지 알면 편해요.' },
    ],
    kicker: '🤝 AI와 협업 교과서', hero: 'AI 에게 잘 시키고, 의심하고, 책임 있게',
    heroP: '챗봇 · 코딩 도우미와 <b>같이 일하는 법</b> — 좋은 요청을 쓰고, AI 가 준 코드를 <b>테스트로 검증</b>하고, 개인정보 · 저작권을 지키며 쓰는 법을 익혀요. 어떤 AI 도구를 써도 돼요.',
    dexName: 'AI 협업 도감', dexShort: '도감', dexWhat: '코드·개념', dexHint: '한국어로도 찾기',
    dexExamples: '<code>help()</code>, <code>dir()</code>, <code>assert</code>, <code>환각</code>', dexPlaceholder: '🔍 찾기 …', dexAlt: '',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/" target="_blank" rel="noopener">docs.python.org</a>',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '한눈에', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어 실행해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>ai-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 와 같은 글이 나오면 성공이에요. 「내 화면에서 확인할 것」 은 내 컴퓨터 화면에서 직접 보는 거예요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 파이썬 교과서의 준비 그대로',
    pages: [
      { title: '1. 준비물과 쓰는 법', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요. <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 1~3 을 했다면 거의 준비 끝이에요.</p>
<table class="kb"><tbody><tr><td><b>공부 폴더</b></td><td><code>ai-study</code> 를 만들고 VS Code 로 열어요</td></tr><tr><td><b>가상 환경</b></td><td><code>python -m venv .venv</code> → 켜기(파이썬 교과서 「pip 와 가상 환경」)</td></tr></tbody></table>`,
        example: { label: '예제 명령 — VS Code 터미널에서', shell: 'mkdir ai-study\ncd ai-study\npython -m venv .venv' } },
    ],
  },
  builtins: [],
  tasks: {},
};
