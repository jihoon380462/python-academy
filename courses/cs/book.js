// courses/cs/book.js — 「CS 교과서」 데이터 (v2.32.0, 설계 specs/cs-course.md). 화면은 core/ui-views-book.js.
// 연습: 내 PC 의 VS Code + 파이썬(파이썬 교과서와 같은 설치). 예시 답은 check_book 이 python3 로 실제 실행해 출력 예와 비교(파이썬 기본 검사).
// 무작위 · 시간 · 네트워크가 끼면 출력이 바뀜 → 소금 · 열쇠는 고정값으로 시험(본문에 「진짜로는 secrets」), 소켓은 localhost + 빈 포트(0).
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['C0', 'CB1'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 · 준비물 보기',
        title: '먼저 꼭! 파이썬 교과서 「시작하기」 1~3',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 PC 의 VS Code + 파이썬</b> 으로 돌려요. 아직이면 <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 부터. 문법은 파이썬 교과서 챕터 3(문자열 · 리스트 · 딕셔너리 · 함수)까지면 충분해요.' },
      { lessons: ['C15', 'CB3'], chapters: [4],
        title: '서버 프로그램은 두 터미널에서',
        html: '서버를 먼저 켜 두고(터미널 1), <b>다른 터미널</b>(VS Code 터미널 오른쪽 위 <b>+</b>)에서 클라이언트를 켜요. Windows 방화벽 창이 뜨면 「개인 네트워크」 만 허용 — 이 교과서는 내 컴퓨터 안(<code>127.0.0.1</code>)만 써요.' },
      { lessons: ['C16', 'C17', 'C18', 'CB4'], chapters: [5],
        title: '직접 만든 암호로 진짜 비밀을 지키지 않기',
        html: '이 챕터의 카이사르 · XOR · 작은 RSA 는 <b>원리를 보는 장난감</b>이에요. 진짜 비밀번호 · 개인 정보는 검증된 것만: <code>hashlib.scrypt</code> · <code>secrets</code> · HTTPS(TLS).' },
    ],
    kicker: '💻 CS 교과서 · 공용', hero: '컴퓨터는 실제로 어떻게 돌아갈까',
    heroP: '코드는 짤 줄 아는데 그 아래는 잘 모른다면 — <b>비트 → 회로 → CPU → 메모리 → 운영체제 → 네트워크 → 보안</b> 을 작은 파이썬 코드로 직접 흉내 내며 이해해요. 게이트로 덧셈기를, 장난감 CPU 를, 내 컴퓨터 안의 채팅을, 비밀번호 금고를 만들어요.',
    dexName: 'CS 도감', dexShort: '도감', dexWhat: '코드·개념', dexHint: '「캐시」「패킷」 처럼 한국어로도 찾기',
    dexExamples: '<code>encode</code>, <code>struct.pack</code>, <code>socket</code>, <code>sha256</code>', dexPlaceholder: '🔍 찾기 — UTF-8, 게이트, 캐시, TCP, 해시 …', dexAlt: '「글자를 바이트로」 대신 <code>encode</code>',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/library/" target="_blank" rel="noopener">표준 라이브러리</a>(struct · socket · hashlib · secrets)',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '진법 · UTF-8 · 속도 · 계층', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어 실행해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>cs-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 와 같은 글이 나오면 성공이에요. 「내 화면에서 확인할 것」 이 있는 문제는 내 컴퓨터 화면(작업 관리자 · 터미널)에서 직접 보는 거예요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 파이썬 교과서의 준비 그대로',
    pages: [
      { title: '준비물과 쓰는 법', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요. <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 1~3(파이썬 설치 · VS Code · 첫 파일 실행)을 했다면 <b>준비 끝</b>이에요. 새로 깔 것은 없어요 — 쓰는 모듈(<code>struct</code> · <code>socket</code> · <code>hashlib</code> · <code>secrets</code> …)은 전부 파이썬에 들어 있어요.</p>
<ol><li>공부 폴더 <code>cs-study</code> 를 만들고 VS Code 로 열어요.</li><li>레슨의 예제를 📋 복사해 <code>.py</code> 파일로 저장하고 ▷ 로 실행해요.</li><li>이 교과서의 「그림」 은 대부분 <b>코드가 찍는 표</b>예요. 진리표 · CPU 한 단계 · 캐시 적중 표를 직접 찍어 보며 이해해요. 숫자를 바꿔 다시 돌려 보세요.</li></ol>
<div class="bk-step-box"><b>운영체제 · 어셈블리어를 더 깊이 보고 싶으면</b><br>이 교과서는 「한눈에」 까지예요. 진짜 프로세스 · 메모리는 <a href="../os/" target="_blank" rel="noopener">운영체제 교과서 ↗</a>, 진짜 CPU 명령은 <a href="../asm/" target="_blank" rel="noopener">어셈블리어 교과서 ↗</a>(둘 다 우분투 VM).</div>`,
        example: { label: '예제 코드 — 첫 실행 확인', code: 'import sys\nprint("파이썬", sys.version.split()[0])\nprint("2 + 3 =", 2 + 3)' } },
    ],
  },
  builtins: [],
  tasks: {},
};
