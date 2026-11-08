// courses/auto/book.js — 「파이썬 업무 자동화 교과서」 데이터 (v2.42.0, 설계 specs/courses-python-next.md). 화면은 core/ui-views-book.js.
// 연습 재료(SAMPLES_PY · SAMPLES_PREP)는 datasets.js. 연습: 내 PC 의 VS Code + 파이썬 + pypdf · python-docx · reportlab · cryptography.
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['J0'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 · 준비물 보기',
        title: '먼저 꼭! 가상 환경 · 패키지 넷 · 연습 재료 samples.py',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 PC 의 VS Code + 파이썬</b> 으로 돌려요. 파이썬 교과서 100 레슨을 마친 사람을 위한 교과서예요. 가상 환경에 <code>python -m pip install pypdf python-docx reportlab cryptography</code> 한 번, 그리고 시작하기 2 의 <code>samples.py</code> 를 공부 폴더에 저장해 두세요.' },
    ],
    kicker: '📎 파이썬 업무 자동화 교과서', hero: '귀찮은 사무 일을 파이썬에게',
    heroP: '파일 이름 바꾸기 · 백업 · 압축, PDF 합치기 · 워드 문서 채우기, 명단으로 문서와 메일 대량 만들기, 그리고 그 일을 <b>정해진 시간에 사람 없이</b> 돌리기까지. 무대는 가상의 작은 가게 「햇살 공방」 의 사무 일이에요.',
    dexName: '업무 자동화 도감', dexShort: '도감', dexWhat: '코드·개념', dexHint: '한국어로도 찾기',
    dexExamples: '<code>shutil.copy2</code>, <code>PdfWriter</code>, <code>Document</code>, <code>EmailMessage</code>', dexPlaceholder: '🔍 찾기 …', dexAlt: '',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/" target="_blank" rel="noopener">docs.python.org</a> · <a href="https://pypdf.readthedocs.io/" target="_blank" rel="noopener">pypdf</a> · <a href="https://python-docx.readthedocs.io/" target="_blank" rel="noopener">python-docx</a>',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '한눈에', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어 실행해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>auto-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 와 같은 글이 나오면 성공이에요. 「내 화면에서 확인할 것」 은 만든 파일을 Word · PDF 보기 · 메일 앱 · 작업 스케줄러에서 직접 열어 보는 거예요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 가상 환경 · 패키지 · 연습 재료',
    pages: [
      { title: '1. 준비물과 쓰는 법', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요.</p>
<table class="kb"><tbody><tr><td><b>공부 폴더</b></td><td><code>auto-study</code> 를 만들고 VS Code 로 열어요</td></tr><tr><td><b>가상 환경</b></td><td><code>python -m venv .venv</code> → 켜기(<a href="../python/#lesson/L16D" target="_blank" rel="noopener">파이썬 교과서 「pip 와 가상 환경」 ↗</a>)</td></tr><tr><td><b>패키지 넷</b></td><td><code>pypdf</code>(PDF 읽기 · 합치기) · <code>python-docx</code>(워드) · <code>reportlab</code>(새 PDF 만들기) · <code>cryptography</code>(PDF 암호)</td></tr><tr><td><b>볼 프로그램</b></td><td>워드(또는 한컴오피스 · LibreOffice) · PDF 보기(Edge 등) · 메일 앱(.eml 열어 보기)</td></tr></tbody></table>
<div class="bk-warn"><b>설치 이름 ≠ import 이름</b> — 워드 패키지는 <code>pip install python-docx</code> 로 깔고 코드에서는 <code>import docx</code> 예요. <code>pip install docx</code> 는 다른 옛 패키지라 깔면 에러가 나요.</div>`,
        example: { label: '예제 명령 — VS Code 터미널에서', shell: 'mkdir auto-study\ncd auto-study\npython -m venv .venv\npython -m pip install pypdf python-docx reportlab cryptography\npython -m pip list' } },
      { title: '2. 연습 재료 samples.py', html: `<p>이 교과서의 예제와 문제는 내 진짜 파일 대신 <b>가짜 파일</b>로 연습해요. 아래 <code>samples.py</code> 를 공부 폴더에 저장해 두면, 예제가 <code>from samples import make_files</code> 처럼 불러서 <b>임시 폴더 안에</b> 가짜 파일을 만들어 써요.</p>
<table class="kb"><tbody><tr><td><code>make_files(폴더)</code></td><td>「다운로드」 폴더 흉내 파일 12개(사진 · 문서 · <code>~$</code> 임시 파일 · <code>Thumbs.db</code> · 대문자 확장자 · 이름에 빈칸)</td></tr><tr><td><code>make_invoices(폴더)</code></td><td>거래처 청구서 PDF 6개(하나는 글자 없는 스캔본, 하나는 암호 <code>1234</code>)</td></tr><tr><td><code>make_pdf(경로, 쪽 글자들)</code></td><td>쪽마다 글자를 넣은 PDF</td></tr><tr><td><code>make_template_docx(경로)</code></td><td>수료증 워드 틀(<code>&#36;&#123;이름&#125;</code> 자리)</td></tr><tr><td><code>make_windows_zip(경로)</code></td><td>한글 이름이 깨져 보이는 zip</td></tr><tr><td><code>make_eml(경로)</code></td><td>첨부가 든 받은 메일 한 통</td></tr><tr><td><code>ROSTER_CSV</code></td><td>수강생 8명 명단(한 명은 이메일이 비어 있어요)</td></tr><tr><td><code>FakeSMTP</code></td><td>보내지 않고 기록만 하는 가짜 메일 서버</td></tr></tbody></table>`,
        example: { label: 'samples.py — 이 내용을 그대로 저장', shell: SAMPLES_PY } },
    ],
  },
  builtins: [],
  tasks: {},
};
