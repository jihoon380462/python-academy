// courses/files/book.js — 「데이터 파일 다루기 교과서」 데이터 (v2.41.0, 설계 specs/courses-python-next.md). 화면은 core/ui-views-book.js.
// 예제 데이터 상수(SETTINGS_JSON · BOOKSHOP_JSON · EVENTS_JSONL · APP_TOML · MAKE_SAMPLES_PY · SAMPLES_PREP)는 datasets.js(content.js 보다 먼저 읽음 — 레슨 예제도 씀).
// 연습: 내 PC 의 VS Code + 파이썬 + openpyxl. 예시 답은 check_book 이 python3 로 실제 실행해 출력 예와 비교(파이썬 기본 검사).
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['F0'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 · 준비물 보기',
        title: '먼저 꼭! 가상 환경 · openpyxl 설치 · 예제 파일 만들기',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 PC 의 VS Code + 파이썬</b> 으로 돌려요. 파이썬 교과서 100 레슨을 마친 사람을 위한 교과서예요. 가상 환경에 <code>python -m pip install openpyxl</code> 한 번, 그리고 시작하기 2 · 3 의 예제 파일을 공부 폴더에 만들어 두세요.' },
    ],
    kicker: '🗂️ 데이터 파일 다루기 교과서', hero: 'JSON 과 엑셀을 파이썬으로 읽고, 고치고, 내보내기',
    heroP: '앱 설정 · API 응답 · 쌓이는 기록 · 엑셀 표처럼 <b>실제로 받는 데이터 파일</b>을 파이썬으로 읽고 · 검사하고 · 바꾸고, 사람이 보기 좋은 <b>엑셀 보고서</b>로 내보내요. 데이터는 이 교과서가 만든 가상 서점 주문 · 빵집 매출 · 카드 내역이에요.',
    dexName: '데이터 파일 도감', dexShort: '도감', dexWhat: '코드·개념', dexHint: '한국어로도 찾기',
    dexExamples: '<code>json.loads</code>, <code>load_workbook</code>, <code>iter_rows</code>, <code>data_only</code>', dexPlaceholder: '🔍 찾기 …', dexAlt: '',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/library/json.html" target="_blank" rel="noopener">json</a> · <a href="https://openpyxl.readthedocs.io/" target="_blank" rel="noopener">openpyxl 문서</a>',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '한눈에', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어 실행해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>files-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 와 같은 글이 나오면 성공이에요. 「내 화면에서 확인할 것」 은 엑셀(또는 LibreOffice Calc)에서 직접 열어 보는 거예요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 가상 환경 · openpyxl · 예제 파일',
    pages: [
      { title: '1. 준비물과 쓰는 법', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요. <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 를 했다면 거의 준비 끝이에요.</p>
<table class="kb"><tbody><tr><td><b>공부 폴더</b></td><td><code>files-study</code> 를 만들고 VS Code 로 열어요</td></tr><tr><td><b>가상 환경</b></td><td><code>python -m venv .venv</code> → 켜기(<a href="../python/#lesson/L16D" target="_blank" rel="noopener">파이썬 교과서 「pip 와 가상 환경」 ↗</a>)</td></tr><tr><td><b>라이브러리</b></td><td><code>python -m pip install openpyxl</code> 하나뿐이에요(pandas 는 안 써요)</td></tr><tr><td><b>파이썬</b></td><td>3.11 이상(설정 파일 TOML 을 읽는 <code>tomllib</code> 이 3.11 부터 들어 있어요)</td></tr><tr><td><b>표 프로그램</b></td><td>만든 엑셀을 눈으로 볼 프로그램. 엑셀이 없으면 무료 <b>LibreOffice Calc</b> 를 깔거나, 웹용 Excel(마이크로소프트 계정 필요)을 써요</td></tr></tbody></table>`,
        example: { label: '예제 명령 — VS Code 터미널에서', shell: 'mkdir files-study\ncd files-study\npython -m venv .venv\npython -m pip install openpyxl' } },
      { title: '2. 글자 데이터 파일 넷', html: `<p>JSON 쪽 레슨은 아래 <b>네 파일</b>로 연습해요. 📋 복사해서 공부 폴더에 같은 이름으로 저장하세요(인코딩 UTF-8). 이 교과서가 만든 가상 데이터라 마음껏 써도 돼요. 「만들어 보기」 에도 필요한 파일이 그때그때 다시 나와요.</p>
<table class="kb"><tbody><tr><td><code>settings.json</code></td><td>메모 앱 설정 — 사용자가 손으로 고쳐서 틀린 값이 섞여 있어요</td></tr><tr><td><code>orders.json</code></td><td>가상 온라인 서점 「주문 목록 API」 응답을 저장한 것 — 3겹 중첩 · 시각 글자 · 금액 글자</td></tr><tr><td><code>events.jsonl</code></td><td>앱 사용 기록 40줄 — 빈 줄 하나, 깨진 줄 하나가 숨어 있어요</td></tr><tr><td><code>config.toml</code></td><td>사진 정리 도구의 설정 파일 — 주석 · 표 · 날짜 · 배열</td></tr></tbody></table>`,
        example: { label: 'orders.json — 이 내용을 그대로 저장(나머지 셋은 쓰는 레슨에서)', shell: BOOKSHOP_JSON } },
      { title: '3. 엑셀 예제는 스크립트로 만들어요', html: `<p>엑셀(.xlsx)은 글자 파일이 아니라서 「이 내용을 붙여 넣으세요」 로 줄 수 없어요. 그래서 <b>엑셀을 만드는 파이썬 스크립트</b>를 줘요. 공부 폴더에 <code>make_samples.py</code> 로 저장하고 터미널에서 한 번 실행하세요(openpyxl 을 깐 가상 환경에서).</p>
<pre>python make_samples.py</pre>
<p>그러면 <code>빵집_매출.xlsx</code> · <code>지점/</code> 폴더의 세 파일 · <code>가계부_카드내역.xlsx</code> · <code>가계부_카드내역_10월.xlsx</code> 가 생겨요. 엑셀을 쓰는 법을 배우고 나서([[레슨:F8]]) 이 스크립트를 다시 읽어 보면 그대로 연습 교재가 돼요.</p>`,
        example: { label: 'make_samples.py — 저장하고 python make_samples.py 로 한 번 실행', shell: MAKE_SAMPLES_PY } },
    ],
  },
  builtins: [],
  tasks: {},
};
