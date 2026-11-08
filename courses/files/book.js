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
      { title: '2. 글자 데이터 파일 넷 · orders.json 먼저', html: `<p>JSON 쪽 레슨은 아래 <b>네 파일</b>로 연습해요. 이 교과서가 만든 가상 데이터라 마음껏 써도 돼요. 네 파일은 그 파일을 쓰는 레슨 예제와 「만들어 보기」 에 <b>준비 파일</b>로 그때그때 나오니, 거기서 📋 복사해 공부 폴더에 같은 이름으로 저장하세요(인코딩 UTF-8). 여기서는 가장 자주 쓰는 <code>orders.json</code> 하나만 먼저 저장해 두면 돼요.</p>
<table class="kb"><tbody><tr><td><code>settings.json</code></td><td>메모 앱 설정 — 사용자가 손으로 고쳐서 틀린 값이 섞여 있어요</td></tr><tr><td><code>orders.json</code></td><td>가상 온라인 서점 「주문 목록 API」 응답을 저장한 것 — 3겹 중첩 · 시각 글자 · 금액 글자</td></tr><tr><td><code>events.jsonl</code></td><td>앱 사용 기록 40줄 — 빈 줄 하나, 깨진 줄 하나가 숨어 있어요</td></tr><tr><td><code>config.toml</code></td><td>사진 정리 도구의 설정 파일 — 주석 · 표 · 날짜 · 배열</td></tr></tbody></table>`,
        example: { label: 'orders.json — 이 내용을 그대로 저장', shell: BOOKSHOP_JSON } },
      { title: '3. 엑셀 예제는 스크립트로 만들어요', html: `<p>엑셀(.xlsx)은 글자 파일이 아니라서 「이 내용을 붙여 넣으세요」 로 줄 수 없어요. 그래서 <b>엑셀을 만드는 파이썬 스크립트</b>를 줘요. 공부 폴더에 <code>make_samples.py</code> 로 저장하고 터미널에서 한 번 실행하세요(openpyxl 을 깐 가상 환경에서).</p>
<pre>python make_samples.py</pre>
<p>그러면 <code>빵집_매출.xlsx</code> · <code>지점/</code> 폴더의 세 파일 · <code>가계부_카드내역.xlsx</code> · <code>가계부_카드내역_10월.xlsx</code> 가 생겨요. 엑셀을 쓰는 법을 배우고 나서([[레슨:F8]]) 이 스크립트를 다시 읽어 보면 그대로 연습 교재가 돼요.</p>`,
        example: { label: 'make_samples.py — 저장하고 python make_samples.py 로 한 번 실행', shell: MAKE_SAMPLES_PY } },
    ],
  },
  builtins: [],
  tasks: {
    F0: [
      { title: "같은 표, 다른 형식 — 출력 예측", text: "빵집 매출 두 줄을 CSV 와 JSON 으로 적어 각자 읽었어요. 실행하기 전에 다섯 줄의 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 「CSV 의 칸은 무슨 종류였지?」 를 떠올리면 돼요.", needs: [["csv.DictReader(CSV_TEXT.splitlines())", "F0/0", "글자 CSV 를 줄마다 나눠 읽기 — 칸은 늘 글자"], ["json.loads(JSON_TEXT)", "F0/0", "글자 JSON 읽기 — 숫자는 숫자로"]], predict: true, explain: "<p>CSV 는 칸이 <b>늘 글자</b>라서 <code>rows_csv[0][\"qty\"]</code> 는 <code>'3'</code> 이에요. 글자에 <code>* 2</code> 를 하면 두 번 이어 붙여 <code>33</code> 이 돼요. JSON 의 <code>3</code> 은 숫자라 <code>6</code> 이에요. 그래서 두 딕셔너리는 <code>'qty': '3'</code> 과 <code>'qty': 3</code> 이 달라 <code>False</code> 예요. CSV 쪽을 <code>int()</code> 로 바꿔 더하면 합은 같아서 마지막은 <code>True</code> 예요.</p>", io: [{ output: "33\n6\nstr int\nFalse\nTrue" }], answer: "import csv\nimport json\n\nCSV_TEXT = \"\"\"item,qty\n소금빵,3\n라테,2\n\"\"\"\nJSON_TEXT = '[{\"item\": \"소금빵\", \"qty\": 3}, {\"item\": \"라테\", \"qty\": 2}]'\n\nlines = CSV_TEXT.splitlines()\nrows_csv = list(csv.DictReader(lines))\nrows_json = json.loads(JSON_TEXT)\nprint(rows_csv[0][\"qty\"] * 2)\nprint(rows_json[0][\"qty\"] * 2)\nprint(type(rows_csv[1][\"qty\"]).__name__, type(rows_json[1][\"qty\"]).__name__)\nprint(rows_csv[0] == rows_json[0])\ncsv_total = sum(int(row[\"qty\"]) for row in rows_csv)\njson_total = sum(row[\"qty\"] for row in rows_json)\nprint(csv_total == json_total)" },
      { title: "준비가 다 됐나 — 점검 스크립트", text: "공부 폴더에서 돌리면 준비가 다 됐는지 알려 주는 <code>check_ready.py</code> 를 만드세요. ① 파이썬이 3.11 이상인지 <code>True</code> / <code>False</code> 로 ② <code>openpyxl</code> 을 불러올 수 있는지 — 없으면 설치 명령까지 ③ 아래 열 파일 가운데 몇 개가 있는지, 빠진 게 있으면 그 이름을, 없으면 <code>모두 있어요</code> 를 출력해요.<br>파일: <code>settings.json</code> · <code>orders.json</code> · <code>events.jsonl</code> · <code>config.toml</code> · <code>빵집_매출.xlsx</code> · <code>지점/강남.xlsx</code> · <code>지점/홍대.xlsx</code> · <code>지점/판교.xlsx</code> · <code>가계부_카드내역.xlsx</code> · <code>가계부_카드내역_10월.xlsx</code><br>아래 준비 파일 넷을 저장하고 시작하기 3 의 <code>make_samples.py</code> 를 돌렸다면 출력 예와 같아요. 파일 하나를 잠깐 다른 이름으로 바꾸고 다시 돌려 「없는 파일」 줄도 확인해 봐요.", needs: [["sys.version_info >= (3, 11)", "F0/1", "내 파이썬이 3.11 이상인가"], ["try: import openpyxl / except ModuleNotFoundError:", "F0/1", "불러오기가 실패하면 — 설치 안 됨 · 가상 환경 꺼짐"], ["Path(name).exists()", "F0/1", "그 파일이 있으면 True"], ["[name for name in NEED if not Path(name).exists()]", "F0/1", "없는 것만 모으기"]], prep: [SAMPLES_PREP, { name: "settings.json", text: SETTINGS_JSON }, { name: "orders.json", text: BOOKSHOP_JSON }, { name: "events.jsonl", text: EVENTS_JSONL }, { name: "config.toml", text: APP_TOML }], io: [{ output: "파이썬 3.11 이상: True\nopenpyxl: 있어요\n파일 10개 중 10개 있어요\n모두 있어요" }], answer: "import sys\nfrom pathlib import Path\n\nprint(\"파이썬 3.11 이상:\", sys.version_info >= (3, 11))\n\ntry:\n    import openpyxl\n    print(\"openpyxl: 있어요\")\nexcept ModuleNotFoundError:\n    print(\"openpyxl: 없어요 — python -m pip install openpyxl\")\n\nNEED = [\"settings.json\", \"orders.json\", \"events.jsonl\", \"config.toml\",\n        \"빵집_매출.xlsx\", \"지점/강남.xlsx\", \"지점/홍대.xlsx\", \"지점/판교.xlsx\",\n        \"가계부_카드내역.xlsx\", \"가계부_카드내역_10월.xlsx\"]\nmissing = [name for name in NEED if not Path(name).exists()]\nprint(f\"파일 {len(NEED)}개 중 {len(NEED) - len(missing)}개 있어요\")\nif missing:\n    print(\"없는 파일:\", \", \".join(missing))\nelse:\n    print(\"모두 있어요\")" },
      { title: "엑셀 파일을 글자로 읽으면 — 에러 읽기", text: "<code>빵집_매출.xlsx</code> 안을 메모장처럼 보려고 아래 코드를 <code>peek.py</code> 로 돌렸더니 이렇게 멈춰요(바이트 번호는 파일마다 달라요).<pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\peek.py\", line 2, in &lt;module&gt;\n    text = f.read()\n  File \"&lt;frozen codecs&gt;\", line 322, in decode\nUnicodeDecodeError: 'utf-8' codec can't decode byte 0x92 in position 10: invalid start byte</pre>몇 번째 줄에서 · 무슨 에러가 · 왜 났는지 먼저 말해 보세요. 그다음 파일 이름을 받아 글자 파일이면 첫 줄을, 아니면 <code>글자 파일이 아니에요</code> 와 맨 앞 두 바이트를 출력하는 <code>peek(path)</code> 로 고치고, <code>settings.json</code> · <code>빵집_매출.xlsx</code> · <code>config.toml</code> 을 차례로 살펴보세요.", needs: [["except UnicodeDecodeError:", "F0/1", "utf-8 글자로 못 읽으면"], ["open(path, \"rb\")", "F0/1", "바이트로 열기 — 엑셀은 글자 파일이 아니에요"], ["f.read(2)", "F0/1", "맨 앞 두 바이트"], ["text.splitlines()[0]", "F0/0", "첫 줄"]], given: "with open(\"빵집_매출.xlsx\", encoding=\"utf-8\") as f:\n    text = f.read()\nprint(text[:20])", prep: [SAMPLES_PREP, { name: "settings.json", text: SETTINGS_JSON }, { name: "config.toml", text: APP_TOML }], io: [{ output: "settings.json: 글자 파일 — 첫 줄 {\n빵집_매출.xlsx: 글자 파일이 아니에요 — 맨 앞 b'PK'\nconfig.toml: 글자 파일 — 첫 줄 # 사진 정리기 설정 — 사람이 직접 고치는 파일이라 주석을 달 수 있어요" }], answer: "def peek(path):\n    try:\n        with open(path, encoding=\"utf-8\") as f:\n            text = f.read()\n        print(f\"{path}: 글자 파일 — 첫 줄 {text.splitlines()[0]}\")\n    except UnicodeDecodeError:\n        with open(path, \"rb\") as f:\n            head = f.read(2)\n        print(f\"{path}: 글자 파일이 아니에요 — 맨 앞 {head}\")\n\nfor name in [\"settings.json\", \"빵집_매출.xlsx\", \"config.toml\"]:\n    peek(name)" },
      { title: "폴더의 파일마다 쓸 도구", text: "공부 폴더 <b>맨 위</b>(하위 폴더 안은 빼고)의 파일을 이름 순서로 돌며, 형식을 아는 파일만 <code>orders.json → json</code> 처럼 쓸 도구를 출력하세요. 끝에는 확장자마다 몇 개인지 <code>.json 2개</code> 처럼 확장자 순서로 출력해요. 확장자 → 도구 표는 딕셔너리 하나로 만들어요(<code>.json</code> → <code>json</code>, <code>.jsonl</code> → <code>json (한 줄씩)</code>, <code>.csv</code> → <code>csv</code>, <code>.xlsx</code> → <code>openpyxl</code>, <code>.toml</code> → <code>tomllib</code>). <code>.py</code> 같은 다른 파일과 폴더는 건너뛰어요. 폴더에 JSON 파일을 더 만들어 두었다면 그만큼 더 나와요.", needs: [["sorted(Path(\".\").glob(\"*\"))", "F0/1", "이 폴더만 이름 순서로"], ["p.suffix · p.name", "F0/1", "확장자 · 파일 이름"], ["TOOLS = {\".json\": \"json\", …}", "F0/0", "형식 → 도구 표"]], prep: [SAMPLES_PREP, { name: "settings.json", text: SETTINGS_JSON }, { name: "orders.json", text: BOOKSHOP_JSON }, { name: "events.jsonl", text: EVENTS_JSONL }, { name: "config.toml", text: APP_TOML }], io: [{ output: "config.toml → tomllib\nevents.jsonl → json (한 줄씩)\norders.json → json\nsettings.json → json\n가계부_카드내역.xlsx → openpyxl\n가계부_카드내역_10월.xlsx → openpyxl\n빵집_매출.xlsx → openpyxl\n.json 2개\n.jsonl 1개\n.toml 1개\n.xlsx 3개" }], answer: "from pathlib import Path\n\nTOOLS = {\".json\": \"json\", \".jsonl\": \"json (한 줄씩)\", \".csv\": \"csv\",\n         \".xlsx\": \"openpyxl\", \".toml\": \"tomllib\"}\n\ncounts = {}\nfor p in sorted(Path(\".\").glob(\"*\")):\n    if not p.is_file() or p.suffix not in TOOLS:\n        continue\n    print(p.name, \"→\", TOOLS[p.suffix])\n    counts[p.suffix] = counts.get(p.suffix, 0) + 1\n\nfor suffix, n in sorted(counts.items()):\n    print(f\"{suffix} {n}개\")" },
    ],
    F1: [
      { title: "옵션을 바꿔 가며 — 출력 예측", text: "같은 딕셔너리를 옵션만 바꿔 <code>dumps</code> 하고, 글자 둘을 <code>loads</code> 해요. 실행하기 전에 다섯 줄을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 빈칸 · 키 순서 · 한글 모양을 하나씩 봐요.", needs: [["json.dumps(data, sort_keys=True)", "F1/2", "키를 abc 순으로"], ["separators=(\",\", \":\")", "F1/2", "빈칸 없이 가장 짧게"], ["ensure_ascii=False", "F1/2", "한글 그대로(빼면 \\uac00)"], ["{\"x\": 1, \"x\": 2}", "F1/4", "같은 키 두 번 — 마지막만 남아요"]], predict: true, explain: "<p>① 옵션이 없으면 넣은 순서 그대로, 쉼표 · 쌍점 뒤에 빈칸, 한글은 <code>&#92;uac00</code> 같은 기호예요. <code>None</code> 은 <code>null</code>. ② <code>sort_keys</code> 로 <code>a · b · c</code> 순서가 되고, <code>separators</code> 로 빈칸이 다 빠져요(한글은 여전히 기호). ③ <code>ensure_ascii=False</code> 라 <code>\"가\"</code> 가 그대로예요. ④ 같은 키 <code>x</code> 는 에러 없이 마지막 <code>2</code> 만 남고, <code>true</code> 는 <code>True</code> 로 돌아와요. ⑤ 튜플은 JSON 배열이 되니 돌아오면 리스트예요.</p>", io: [{ output: "{\"b\": [1, 2], \"a\": \"\\uac00\", \"c\": null}\n{\"a\":\"\\uac00\",\"b\":[1,2],\"c\":null}\n{\"a\": \"가\", \"b\": [1, 2], \"c\": null}\n{'x': 2, 'y': True}\n[1, 2]" }], answer: "import json\n\ndata = {\"b\": [1, 2], \"a\": \"가\", \"c\": None}\nprint(json.dumps(data))\nprint(json.dumps(data, sort_keys=True, separators=(\",\", \":\")))\nprint(json.dumps(data, ensure_ascii=False, sort_keys=True))\nprint(json.loads('{\"x\": 1, \"x\": 2, \"y\": true}'))\npair = json.dumps((1, 2))\nprint(json.loads(pair))" },
      { title: "손으로 고친 설정이 안 열려요", text: "메모 앱 설정을 손으로 고쳤더니 프로그램이 이렇게 멈춰요(맨 아래 줄만 옮겼어요).<pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\settings_check.py\", line 9, in &lt;module&gt;\n    settings = json.loads(TEXT)\n  …(json 모듈 안쪽 줄 몇 개)…\njson.decoder.JSONDecodeError: Expecting ',' delimiter: line 4 column 3 (char 41)</pre>에러 글의 줄 · 칸을 보고 <b>진짜 실수가 어디인지</b> 찾아 <code>TEXT</code> 만 고치세요(코드는 그대로). 하나를 고치고 다시 돌리면 다음 에러가 나와요 — 하나씩 고쳐요. 다 고치면 <code>16 True ko</code> 가 나와요.", needs: [["e.lineno · e.colno · e.msg", "F1/3", "몇 번째 줄 · 칸 · 까닭 — 에러 자리는 실수 바로 뒤"], ["{\"theme\": \"dark\"} — 큰따옴표만", "F1/1", "작은따옴표 키는 JSON 이 아니에요"]], given: "import json\n\nTEXT = \"\"\"{\n  \"theme\": \"dark\",\n  \"font_size\": 16\n  \"language\": \"ko\",\n  'autosave': true\n}\"\"\"\nsettings = json.loads(TEXT)\nprint(settings[\"font_size\"], settings[\"autosave\"], settings[\"language\"])", io: [{ output: "16 True ko" }], answer: "import json\n\nTEXT = \"\"\"{\n  \"theme\": \"dark\",\n  \"font_size\": 16,\n  \"language\": \"ko\",\n  \"autosave\": true\n}\"\"\"\nsettings = json.loads(TEXT)\nprint(settings[\"font_size\"], settings[\"autosave\"], settings[\"language\"])" },
      { title: "깨진 곳 짚어 주기 — check_json(path)", text: "파일 이름을 받아 JSON 이 괜찮으면 <code>settings.json: 문제없어요 (맨 위 키 7개)</code> 를, 깨졌으면 줄 · 칸 · 까닭을 한 줄로 보이고 <b>그 줄과 바로 앞 줄</b>을 줄 번호와 함께 보여 주는 <code>check_json(path)</code> 를 만드세요. 줄 번호는 세 칸 오른쪽 맞춤(<code>f\"{n:&gt;3}\"</code>)이에요. 준비 파일 셋을 차례로 검사해요 — <code>empty.json</code> 은 빈 파일이라 보여 줄 줄이 없어요.", needs: [["Path(path).read_text(encoding=\"utf-8\")", "F1/3", "글자를 먼저 얻어야 에러 줄도 보여 줄 수 있어요"], ["except json.JSONDecodeError as e:", "F1/1", "깨진 JSON 받기"], ["e.lineno · e.colno · e.msg", "F1/3", "자리와 까닭"], ["text.splitlines()", "F1/3", "줄마다 나눈 리스트 — lines[e.lineno - 1] 이 그 줄"]], prep: [{ name: "settings.json", text: SETTINGS_JSON }, { name: "todo.json", text: "{\n  \"title\": \"장보기\",\n  \"items\": [\"우유\", \"달걀\"]\n  \"done\": false\n}\n" }, { name: "empty.json", text: "" }], io: [{ output: "settings.json: 문제없어요 (맨 위 키 7개)\ntodo.json: 4번째 줄 3번째 칸 — Expecting ',' delimiter\n    3 |   \"items\": [\"우유\", \"달걀\"]\n    4 |   \"done\": false\nempty.json: 1번째 줄 1번째 칸 — Expecting value" }], answer: "import json\nfrom pathlib import Path\n\ndef check_json(path):\n    text = Path(path).read_text(encoding=\"utf-8\")\n    try:\n        data = json.loads(text)\n    except json.JSONDecodeError as e:\n        print(f\"{path}: {e.lineno}번째 줄 {e.colno}번째 칸 — {e.msg}\")\n        lines = text.splitlines()\n        for n in (e.lineno - 1, e.lineno):\n            if 1 <= n <= len(lines):\n                print(f\"  {n:>3} | {lines[n - 1]}\")\n        return None\n    print(f\"{path}: 문제없어요 (맨 위 키 {len(data)}개)\")\n    return data\n\nfor name in [\"settings.json\", \"todo.json\", \"empty.json\"]:\n    check_json(name)" },
      { title: "같은 키 두 번 — 사라진 값 찾기", text: "빵집 가격표 <code>prices.json</code> 을 여럿이 손으로 고치다 같은 키를 두 번 적었어요. 그냥 읽은 결과를 먼저 출력하고, <code>object_pairs_hook</code> 으로 다시 읽어 같은 키를 <b>모두</b> 찾아 <code>소금빵: 3200 → 3500</code> 처럼 출력하세요. 첫 하나에서 멈추지 말고 리스트에 모아요. 안쪽 <code>{…}</code> 도 함수가 불린다는 걸 떠올려요.", needs: [["json.loads(text, object_pairs_hook=find_dupes)", "F1/4", "객체마다 (키, 값) 쌍 리스트로 불려요"], ["for key, value in pairs:", "F1/4", "쌍을 하나씩"], ["if key in d:", "F1/4", "이미 나온 키"]], prep: [{ name: "prices.json", text: "{\n  \"빵\": {\"소금빵\": 3200, \"크루아상\": 3800, \"소금빵\": 3500},\n  \"음료\": {\"라테\": 4800, \"아메리카노\": 4000},\n  \"빵\": {\"식빵\": 4500}\n}\n" }], io: [{ output: "그냥 읽으면: {'빵': {'식빵': 4500}, '음료': {'라테': 4800, '아메리카노': 4000}}\n같은 키 2개\n  소금빵: 3200 → 3500\n  빵: {'소금빵': 3500, '크루아상': 3800} → {'식빵': 4500}" }], answer: "import json\n\ndupes = []\n\ndef find_dupes(pairs):\n    d = {}\n    for key, value in pairs:\n        if key in d:\n            dupes.append(f\"{key}: {d[key]} → {value}\")\n        d[key] = value\n    return d\n\nwith open(\"prices.json\", encoding=\"utf-8\") as f:\n    text = f.read()\nprint(\"그냥 읽으면:\", json.loads(text))\njson.loads(text, object_pairs_hook=find_dupes)\nprint(f\"같은 키 {len(dupes)}개\")\nfor line in dupes:\n    print(\" \", line)" },
      { title: "NaN 이 든 파일을 웹 페이지가 못 읽어요", text: "반 평균을 저장한 <code>avg.json</code> 을 웹 페이지(자바스크립트)가 못 읽는대요. 아래 코드가 만든 파일을 열어 보면 <code>NaN</code> 이 있어요. ① 점수가 없는 사람의 평균은 <code>None</code> 으로 바꾸고 ② 저장할 때 <code>allow_nan=False</code> 를 줘서, 다음에 누가 NaN 을 넣으면 저장하는 순간 멈추게 하세요. 출력은 파일 내용과, 다시 읽은 영희의 값이에요.", needs: [["allow_nan=False", "F1/4", "NaN 을 넣으면 ValueError"], ["float(\"nan\") → NaN", "F1/4", "파이썬은 써 주지만 JSON 이 아니에요"], ["None → null", "F1/0", "값 없음은 null 로"]], given: "import json\n\nscores = {\"민수\": [90, 80], \"영희\": [], \"철수\": [70]}\n\ndef average(nums):\n    if not nums:\n        return float(\"nan\")\n    return sum(nums) / len(nums)\n\navg = {}\nfor name, nums in scores.items():\n    avg[name] = average(nums)\nwith open(\"avg.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(avg, f, ensure_ascii=False)\nwith open(\"avg.json\", encoding=\"utf-8\") as f:\n    print(f.read())", io: [{ output: "{\"민수\": 85.0, \"영희\": null, \"철수\": 70.0}\n영희: None" }], answer: "import json\n\nscores = {\"민수\": [90, 80], \"영희\": [], \"철수\": [70]}\n\ndef average(nums):\n    if not nums:\n        return None\n    return sum(nums) / len(nums)\n\navg = {}\nfor name, nums in scores.items():\n    avg[name] = average(nums)\nwith open(\"avg.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(avg, f, ensure_ascii=False, allow_nan=False)\nwith open(\"avg.json\", encoding=\"utf-8\") as f:\n    print(f.read())\nwith open(\"avg.json\", encoding=\"utf-8\") as f:\n    print(\"영희:\", json.load(f)[\"영희\"])" },
    ],
    F2: [
      { title: "dig 는 무엇을 돌려줄까 — 출력 예측", text: "<code>orders.json</code> 을 읽어 <code>dig</code> 를 여섯 번 불러요. 실행하기 전에 여섯 줄을 먼저 예상해 보세요. 「에러가 나서 default 가 나오는지」, 「값이 있어서(그게 <code>None</code> 이라도) 그대로 나오는지」 를 나눠 생각해요. <code>orders.json</code> 은 시작하기 2 에서 열어 볼 수 있어요.", needs: [["dig(data, *path, default=None)", "F2/2", "KeyError · IndexError · TypeError 면 default"], ["orders[-1]", "F2/0", "리스트는 번호로 — -1 은 맨 끝"]], predict: true, explain: "<p>① <code>page</code> 는 맨 위 키라 <code>1</code>. ② <code>-1</code> 은 마지막 주문(A-1004)이고 그 첫 책은 <code>하루 10분 SQL</code>. ③ A-1003 의 <code>address</code> 는 <code>None</code> 이라 <code>None[\"city\"]</code> 에서 <code>TypeError</code> → <code>default</code> 인 <code>None</code>. ④ A-1003 의 <code>email</code> 은 키가 <b>있고</b> 값이 <code>null</code> 이에요. 에러가 안 나니 <code>default</code> 가 아니라 그 값 <code>None</code> 이 그대로 나와요. ⑤ 리스트에 글자 키 <code>\"A-1001\"</code> 을 쓰면 <code>TypeError</code> 라 <code>default</code>. ⑥ <code>\"ok\"[0]</code> 은 글자의 첫 글자라 에러 없이 <code>o</code> 예요 — 글자도 번호로 꺼내지니까요.</p>", prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "1\n하루 10분 SQL\nNone\nNone\n번호로 찾아요\no" }], answer: "import json\n\ndef dig(data, *path, default=None):\n    cur = data\n    for key in path:\n        try:\n            cur = cur[key]\n        except (KeyError, IndexError, TypeError):\n            return default\n    return cur\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    data = json.load(f)\n\nprint(dig(data, \"page\"))\nprint(dig(data, \"data\", \"orders\", -1, \"items\", 0, \"title\"))\nprint(dig(data, \"data\", \"orders\", 2, \"customer\", \"address\", \"city\"))\nprint(dig(data, \"data\", \"orders\", 2, \"customer\", \"email\", default=\"(없음)\"))\nprint(dig(data, \"data\", \"orders\", \"A-1001\", default=\"번호로 찾아요\"))\nprint(dig(data, \"status\", 0))" },
      { title: "주문 한 줄 요약", text: "<code>orders.json</code>(서점 주문 목록)의 주문마다 <code>A-1001 김하늘 서울 마포구 3권</code> 처럼 주문 번호 · 이름 · 도시 · 구 · 권수를 한 줄로 출력하세요. 주소가 <code>null</code> 인 주문은 도시 · 구 자리에 <code>주소 없음</code> 이에요. 주소는 <code>dig</code> 로 꺼내고, 꼭 있어야 하는 주문 번호 · 이름은 대괄호로 꺼내요.", needs: [["dig(data, *path, default=None)", "F2/2", "길이 막히면 default"], ["data[\"data\"][\"orders\"]", "F2/0", "한 겹에 대괄호 하나"], ["sum(item[\"qty\"] for item in order[\"items\"])", "F2/3", "그 주문의 권수"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "A-1001 김하늘 서울 마포구 3권\nA-1002 이도윤 성남 분당구 1권\nA-1003 박서준 주소 없음 3권\nA-1004 최유나 서울 강남구 3권" }], answer: "import json\n\ndef dig(data, *path, default=None):\n    cur = data\n    for key in path:\n        try:\n            cur = cur[key]\n        except (KeyError, IndexError, TypeError):\n            return default\n    return cur\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    data = json.load(f)\n\nfor order in data[\"data\"][\"orders\"]:\n    city = dig(order, \"customer\", \"address\", \"city\")\n    district = dig(order, \"customer\", \"address\", \"district\")\n    where = f\"{city} {district}\" if city else \"주소 없음\"\n    books = sum(item[\"qty\"] for item in order[\"items\"])\n    print(order[\"id\"], order[\"customer\"][\"name\"], where, f\"{books}권\")" },
      { title: "세 번째 주문에서 멈춰요", text: "<code>orders.json</code> 에서 도시마다 주문이 몇 건인지 세려는데 이렇게 멈춰요.<pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\cities.py\", line 8, in &lt;module&gt;\n    city = order.get(\"customer\", {}).get(\"address\", {}).get(\"city\", \"모름\")\n           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\nAttributeError: 'NoneType' object has no attribute 'get'</pre>몇 번째 주문에서 · 왜 멈췄는지 먼저 말해 보세요. 힌트: <code>.get(\"address\", {})</code> 의 <code>{}</code> 는 언제 쓰이나요? 그다음 주소가 <code>null</code> 이어도 <code>모름</code> 으로 세도록 고치세요.", needs: [["order[\"customer\"].get(\"address\") or {}", "F2/1", "없거나 None 이면 빈 딕셔너리"], ["address.get(\"city\", \"모름\")", "F2/1", "키가 없을 때의 기본값"], ["count.get(city, 0) + 1", "F2/1", "세기(파이썬 교과서 「딕셔너리 돌기와 세기」)"]], given: "import json\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    orders = json.load(f)[\"data\"][\"orders\"]\n\ncount = {}\nfor order in orders:\n    city = order.get(\"customer\", {}).get(\"address\", {}).get(\"city\", \"모름\")\n    count[city] = count.get(city, 0) + 1\nprint(count)", prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "{'서울': 2, '성남': 1, '모름': 1}" }], answer: "import json\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    orders = json.load(f)[\"data\"][\"orders\"]\n\ncount = {}\nfor order in orders:\n    address = order.get(\"customer\", {}).get(\"address\") or {}\n    city = address.get(\"city\", \"모름\")\n    count[city] = count.get(city, 0) + 1\nprint(count)" },
      { title: "결제된 주문만 — match 모양으로", text: "<code>orders.json</code> 의 주문을 <code>match</code> 의 딕셔너리 모양으로 나눠 출력하세요. 결제된 주문은 <code>A-1001 결제 3권 — 파이썬 첫걸음, 엑셀 업무 노트</code> 처럼 권수와 책 제목들을, 취소된 주문은 <code>A-1003 취소 — 세지 않아요</code>, 그 밖의 상태는 <code>모르는 상태</code> 예요. 마지막에 결제된 책이 모두 몇 권인지 출력해요.", needs: [["case {\"status\": \"paid\", \"items\": items}:", "F2/3", "모양이 맞으면 items 에 담아 줘요"], ["case _:", "F2/3", "그 밖의 모든 것"], ["[item[\"title\"] for item in items]", "F2/3", "한 칸씩 모으기"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "A-1001 결제 3권 — 파이썬 첫걸음, 엑셀 업무 노트\nA-1002 결제 1권 — 데이터 정리의 기술\nA-1003 취소 — 세지 않아요\nA-1004 결제 3권 — 하루 10분 SQL, 엑셀 업무 노트, 그림으로 보는 네트워크\n결제된 책 모두 7권" }], answer: "import json\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    orders = json.load(f)[\"data\"][\"orders\"]\n\ntotal = 0\nfor order in orders:\n    match order:\n        case {\"status\": \"paid\", \"items\": items}:\n            books = sum(item[\"qty\"] for item in items)\n            total += books\n            titles = \", \".join([item[\"title\"] for item in items])\n            print(f\"{order['id']} 결제 {books}권 — {titles}\")\n        case {\"status\": \"cancelled\"}:\n            print(f\"{order['id']} 취소 — 세지 않아요\")\n        case _:\n            print(f\"{order['id']} 모르는 상태\")\nprint(f\"결제된 책 모두 {total}권\")" },
      { title: "처음 보는 설정 파일 — outline 출력 예측", text: "메모 앱 설정 <code>settings.json</code> 을 <code>outline</code> 으로 살펴봐요. 실행하기 전에 <code>settings.json</code> 을 열어 보고, 몇 줄이 어떤 들여쓰기로 나올지 먼저 예상해 보세요. 다 맞혔다면, 출력에서 「이 값은 이 종류가 아닐 것 같은데?」 싶은 줄도 찾아봐요.", needs: [["outline(data, depth=0)", "F2/4", "키 · 종류를 나무처럼 — 재귀"], ["isinstance(data, dict)", "F2/4", "딕셔너리면 키마다"], ["type(value).__name__", "F2/4", "종류 이름 글자"]], predict: true, explain: "<p>맨 위 키 일곱 개가 들여쓰기 없이 나오고, 딕셔너리인 <code>editor</code> 아래로 두 칸 들여 <code>tab_size</code> · <code>word_wrap</code>, 리스트인 <code>recent_files</code> 아래로 첫 원소 하나만 <code>[0]: str (모두 3개)</code> 예요. 글자 · 숫자 · <code>bool</code> 은 더 들어가지 않아요. 눈여겨볼 줄: <code>font_size: str</code> 는 숫자여야 할 것 같고, <code>word_wrap: str</code> 은 참/거짓이어야 할 것 같죠. 사용자가 손으로 고친 흔적이에요 — 이런 값을 골라내는 검사는 [[레슨:F6]] 에서 해요.</p>", prep: [{ name: "settings.json", text: SETTINGS_JSON }], io: [{ output: "theme: str\nfont_size: str\nlanguage: str\nautosave: bool\nautosave_minutes: int\neditor: dict\n  tab_size: int\n  word_wrap: str\nrecent_files: list\n  [0]: str (모두 3개)" }], answer: "import json\n\ndef outline(data, depth=0):\n    pad = \"  \" * depth\n    if isinstance(data, dict):\n        for key, value in data.items():\n            print(f\"{pad}{key}: {type(value).__name__}\")\n            outline(value, depth + 1)\n    elif isinstance(data, list) and data:\n        print(f\"{pad}[0]: {type(data[0]).__name__} (모두 {len(data)}개)\")\n        outline(data[0], depth + 1)\n\nwith open(\"settings.json\", encoding=\"utf-8\") as f:\n    settings = json.load(f)\noutline(settings)" },
    ],
    F3: [
      { title: "parse_float · default · fromtimestamp — 출력 예측", text: "같은 글을 두 가지로 읽고, 날짜 · Decimal 을 <code>default=str</code> 로 저장하고, 유닉스 시간 0 을 날짜로 바꿔요. 실행하기 전에 다섯 줄을 먼저 예상해 보세요.", needs: [["json.loads(text, parse_float=Decimal)", "F3/3", "소수를 Decimal 로 읽기 — 정수는 int"], ["json.dumps(data, default=str)", "F3/4", "못 바꾸는 값은 str() 로"], ["datetime.fromtimestamp(ts, timezone.utc)", "F3/2", "1970-01-01 UTC 부터 지난 초"]], predict: true, explain: "<p>① float 끼리는 <code>1.1 * 3</code> 이 <code>3.3000000000000003</code> 이에요(어림 오차). ② <code>parse_float=Decimal</code> 로 읽은 <code>1.10</code> 은 글자 그대로 <code>Decimal(\"1.10\")</code> 이라 3 을 곱하면 자리 수까지 지켜 <code>3.30</code>. ③ 정수 <code>3</code> 은 <code>parse_float</code> 와 상관없이 <code>int</code>. ④ <code>default=str</code> 은 Decimal 을 <code>\"1.10\"</code>, 날짜를 <code>\"2026-09-03\"</code> 글자로 바꿔요. ⑤ 유닉스 시간 0 은 1970년 1월 1일 0시(UTC)예요.</p>", io: [{ output: "3.3000000000000003\n3.30\nint\n{\"p\": \"1.10\", \"d\": \"2026-09-03\"}\n1970-01-01" }], answer: "import json\nfrom datetime import date, datetime, timezone\nfrom decimal import Decimal\n\ntext = '{\"price\": 1.10, \"qty\": 3}'\na = json.loads(text)\nb = json.loads(text, parse_float=Decimal)\nprint(a[\"price\"] * a[\"qty\"])\nprint(b[\"price\"] * b[\"qty\"])\nprint(type(b[\"qty\"]).__name__)\nmixed = {\"p\": b[\"price\"], \"d\": date(2026, 9, 3)}\nprint(json.dumps(mixed, default=str))\nprint(datetime.fromtimestamp(0, timezone.utc).date())" },
      { title: "일기 저장이 안 돼요 — 반쯤 쓴 파일", text: "일기를 <code>diary.json</code> 에 저장하려는데 이렇게 멈춰요(가운데 줄은 줄였어요).<pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\diary.py\", line 9, in &lt;module&gt;\n    json.dump(diary, f, ensure_ascii=False, indent=2)\n  …(json 모듈 안쪽 줄 여러 개)…\nTypeError: Object of type date is not JSON serializable</pre>무엇이 JSON 으로 못 바뀌었는지 먼저 말해 보세요. 멈춘 뒤 <code>diary.json</code> 을 열어 보면 <code>[ { \"day\":</code> 까지만 쓰다 만 글이 들어 있어요 — <code>json.dump</code> 는 바꾸면서 바로 써서예요. <code>to_json</code> 을 만들어 <code>default=</code> 로 고치고, 다시 읽은 날짜는 <code>date</code> 로 되돌려 <code>2026-09-03 (목) 비 — 우산을 챙겼다</code> 처럼 요일과 함께 출력하세요. 요일은 <code>day.weekday()</code>(월요일 0)로 <code>\"월화수목금토일\"</code> 에서 꺼내요.", needs: [["json.dump(diary, f, default=to_json)", "F3/4", "못 바꾸는 값을 만날 때마다 to_json"], ["o.isoformat()", "F3/0", "날짜 → ISO 글자"], ["date.fromisoformat(entry[\"day\"])", "F3/0", "되돌리기는 내가"]], given: "import json\nfrom datetime import date\n\ndiary = [\n    {\"day\": date(2026, 9, 3), \"weather\": \"비\", \"text\": \"우산을 챙겼다\"},\n    {\"day\": date(2026, 9, 4), \"weather\": \"맑음\", \"text\": \"공원 산책\"},\n]\nwith open(\"diary.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(diary, f, ensure_ascii=False, indent=2)\n\nwith open(\"diary.json\", encoding=\"utf-8\") as f:\n    back = json.load(f)\nfor entry in back:\n    print(entry[\"day\"], entry[\"weather\"])", io: [{ output: "2026-09-03 (목) 비 — 우산을 챙겼다\n2026-09-04 (금) 맑음 — 공원 산책" }], answer: "import json\nfrom datetime import date, datetime\nfrom decimal import Decimal\n\ndef to_json(o):\n    if isinstance(o, (date, datetime)):\n        return o.isoformat()\n    if isinstance(o, Decimal):\n        return str(o)\n    raise TypeError(f\"JSON 으로 못 바꿔요: {type(o).__name__}\")\n\ndiary = [\n    {\"day\": date(2026, 9, 3), \"weather\": \"비\", \"text\": \"우산을 챙겼다\"},\n    {\"day\": date(2026, 9, 4), \"weather\": \"맑음\", \"text\": \"공원 산책\"},\n]\nwith open(\"diary.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(diary, f, ensure_ascii=False, indent=2, default=to_json)\n\nwith open(\"diary.json\", encoding=\"utf-8\") as f:\n    back = json.load(f)\nfor entry in back:\n    day = date.fromisoformat(entry[\"day\"])\n    print(f\"{day} ({'월화수목금토일'[day.weekday()]}) {entry['weather']} — {entry['text']}\")" },
      { title: "주문 시각을 두 시계로", text: "<code>orders.json</code> 의 주문 시각(<code>ordered_at</code>)을 한국 시계와 UTC 시계로 나란히 <code>A-1001 한국 09-03 14:05 · UTC 09-03 05:05</code> 처럼 출력하세요. 두 시계의 날짜가 다르면 끝에 <code> ← 날짜가 달라요</code> 를 붙여요. 그다음 「날짜별 주문 수」 를 한국 날짜로 한 번, UTC 날짜로 한 번 세어 <code>한국 날짜별: 09-03 2건, …</code> 처럼 출력해요. 어느 시계로 세느냐에 따라 하루 매출이 달라지는 걸 확인해요.", needs: [["datetime.fromisoformat(order[\"ordered_at\"])", "F3/1", "+09:00 이 붙은 시각 읽기"], ["t.astimezone(timezone.utc)", "F3/1", "같은 순간을 UTC 시계로"], ["t.date()", "F3/1", "날짜만 떼기"], ["t.strftime(\"%m-%d %H:%M\")", "F3/1", "보여 줄 모양"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "A-1001 한국 09-03 14:05 · UTC 09-03 05:05\nA-1002 한국 09-03 21:40 · UTC 09-03 12:40\nA-1003 한국 09-04 09:15 · UTC 09-04 00:15\nA-1004 한국 09-05 00:30 · UTC 09-04 15:30 ← 날짜가 달라요\n한국 날짜별: 09-03 2건, 09-04 1건, 09-05 1건\nUTC 날짜별: 09-03 2건, 09-04 2건" }], answer: "import json\nfrom datetime import datetime, timezone\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    orders = json.load(f)[\"data\"][\"orders\"]\n\nby_kst = {}\nby_utc = {}\nfor order in orders:\n    t = datetime.fromisoformat(order[\"ordered_at\"])\n    utc = t.astimezone(timezone.utc)\n    mark = \" ← 날짜가 달라요\" if utc.date() != t.date() else \"\"\n    print(f\"{order['id']} 한국 {t.strftime('%m-%d %H:%M')} · UTC {utc.strftime('%m-%d %H:%M')}{mark}\")\n    k = t.strftime(\"%m-%d\")\n    u = utc.strftime(\"%m-%d\")\n    by_kst[k] = by_kst.get(k, 0) + 1\n    by_utc[u] = by_utc.get(u, 0) + 1\n\n\ndef per_day(counts):\n    parts = [f\"{d} {n}건\" for d, n in sorted(counts.items())]\n    return \", \".join(parts)\n\n\nprint(\"한국 날짜별:\", per_day(by_kst))\nprint(\"UTC 날짜별:\", per_day(by_utc))" },
      { title: "주문 금액을 Decimal 로", text: "<code>orders.json</code> 의 금액(<code>price</code>)은 <code>\"18000.00\"</code> 같은 글자예요. 주문마다 <code>가격 × 수량</code> 을 <code>Decimal</code> 로 더해 <code>A-1001 43000.00</code> 처럼 출력하고(취소된 주문은 뒤에 <code>(취소 — 빼요)</code>), 결제된 주문만 더한 합계를 출력하세요. 마지막 줄에는 합계를 JSON 으로 저장할 두 모양 — 글자(<code>paid_total</code>)와 정수 원(<code>paid_won</code>) — 을 <code>json.dumps</code> 로 보여 줘요.", needs: [["Decimal(item[\"price\"])", "F3/3", "글자 금액 → Decimal"], ["sum(Decimal(…) * item[\"qty\"] for item in …)", "F3/3", "Decimal 과 정수를 곱해 더하기"], ["str(total) · int(total)", "F3/3", "저장 모양 둘"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "A-1001 43000.00\nA-1002 22000.00\nA-1003 54000.00 (취소 — 빼요)\nA-1004 47800.00\n결제 합계 112800.00\nJSON 으로: {\"paid_total\": \"112800.00\", \"paid_won\": 112800}" }], answer: "import json\nfrom decimal import Decimal\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    orders = json.load(f)[\"data\"][\"orders\"]\n\npaid = Decimal(\"0\")\nfor order in orders:\n    total = sum(Decimal(item[\"price\"]) * item[\"qty\"] for item in order[\"items\"])\n    if order[\"status\"] == \"paid\":\n        paid += total\n        print(order[\"id\"], total)\n    else:\n        print(order[\"id\"], total, \"(취소 — 빼요)\")\nprint(\"결제 합계\", paid)\nsaved = json.dumps({\"paid_total\": str(paid), \"paid_won\": int(paid)})\nprint(\"JSON 으로:\", saved)" },
      { title: "보고서 저장 → 되살리기", text: "하루 매출 보고서 딕셔너리를 <code>report.json</code> 으로 저장하고, 다시 읽어 원래 종류(<code>date</code> · <code>datetime</code> · <code>Decimal</code>)로 되살리는 <code>load_report(path)</code> 를 만드세요. 저장은 <code>default=to_json</code> · 한글 그대로 · 두 칸 들여쓰기예요. 파일 내용을 출력하고, 되살린 것이 원래와 같은지 <code>True</code> 로 확인한 다음, 되살린 금액에 배송비 <code>Decimal(\"2500\")</code> 을 더해 출력해요.<pre>KST = timezone(timedelta(hours=9))\nreport = {\n    \"day\": date(2026, 9, 3),\n    \"made_at\": datetime(2026, 9, 4, 9, 0, tzinfo=KST),\n    \"total\": Decimal(\"65000.00\"),\n    \"items\": [{\"title\": \"파이썬 첫걸음\", \"amount\": Decimal(\"18000.00\")},\n              {\"title\": \"엑셀 업무 노트\", \"amount\": Decimal(\"47000.00\")}],\n}</pre>", needs: [["json.dump(report, f, default=to_json)", "F3/4", "섞인 날짜 · 돈을 함수 하나로"], ["datetime.fromisoformat(d[\"made_at\"])", "F3/1", "+09:00 까지 되살아나요"], ["Decimal(d[\"total\"])", "F3/4", "되돌리기는 내가 — 어느 칸인지 아는 곳에서"]], io: [{ output: "{\n  \"day\": \"2026-09-03\",\n  \"made_at\": \"2026-09-04T09:00:00+09:00\",\n  \"total\": \"65000.00\",\n  \"items\": [\n    {\n      \"title\": \"파이썬 첫걸음\",\n      \"amount\": \"18000.00\"\n    },\n    {\n      \"title\": \"엑셀 업무 노트\",\n      \"amount\": \"47000.00\"\n    }\n  ]\n}\nTrue\n배송비까지 67500.00" }], answer: "import json\nfrom datetime import date, datetime, timezone, timedelta\nfrom decimal import Decimal\n\nKST = timezone(timedelta(hours=9))\n\ndef to_json(o):\n    if isinstance(o, (date, datetime)):\n        return o.isoformat()\n    if isinstance(o, Decimal):\n        return str(o)\n    raise TypeError(f\"JSON 으로 못 바꿔요: {type(o).__name__}\")\n\n\ndef load_report(path):\n    with open(path, encoding=\"utf-8\") as f:\n        d = json.load(f)\n    d[\"day\"] = date.fromisoformat(d[\"day\"])\n    d[\"made_at\"] = datetime.fromisoformat(d[\"made_at\"])\n    d[\"total\"] = Decimal(d[\"total\"])\n    for item in d[\"items\"]:\n        item[\"amount\"] = Decimal(item[\"amount\"])\n    return d\n\nreport = {\n    \"day\": date(2026, 9, 3),\n    \"made_at\": datetime(2026, 9, 4, 9, 0, tzinfo=KST),\n    \"total\": Decimal(\"65000.00\"),\n    \"items\": [{\"title\": \"파이썬 첫걸음\", \"amount\": Decimal(\"18000.00\")},\n              {\"title\": \"엑셀 업무 노트\", \"amount\": Decimal(\"47000.00\")}],\n}\nwith open(\"report.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(report, f, ensure_ascii=False, indent=2, default=to_json)\n\nwith open(\"report.json\", encoding=\"utf-8\") as f:\n    print(f.read())\nback = load_report(\"report.json\")\nprint(back == report)\nprint(\"배송비까지\", back[\"total\"] + Decimal(\"2500\"))" },
    ],
    F4: [
      { title: "asdict 와 **d — 출력 예측", text: "<p>장바구니 dataclass 를 JSON 으로 저장했다가 되살려요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 마지막 두 줄이 왜 다른지가 이 문제의 핵심이에요.</p>", needs: [["asdict(cart)", "F4/0", "안쪽 dataclass 까지 딕셔너리로"], ["Cart(**d)", "F4/2", "한 겹만 풀림 — 안쪽은 딕셔너리 그대로"], ["[Item(**x) for x in d[\"items\"]]", "F4/2", "중첩은 손으로 되살리기"]], predict: true, io: [{ output: "{'title': '소금빵', 'qty': 2}\n{\"owner\": \"하늘\", \"items\": [{\"title\": \"소금빵\", \"qty\": 2}, {\"title\": \"라테\", \"qty\": 1}]}\n{'title': '라테', 'qty': 1}\nFalse\nItem(title='라테', qty=1)\nTrue" }], answer: "from dataclasses import dataclass, asdict\nimport json\n\n\n@dataclass\nclass Item:\n    title: str\n    qty: int\n\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list[Item]\n\n\ncart = Cart(\"하늘\", [Item(\"소금빵\", 2), Item(\"라테\", 1)])\nd = asdict(cart)\nprint(d[\"items\"][0])\ntext = json.dumps(d, ensure_ascii=False)\nprint(text)\n\nback = Cart(**json.loads(text))\nprint(back.items[1])\nprint(back == cart)\n\nfixed = Cart(back.owner, [Item(**x) for x in back.items])\nprint(fixed.items[1])\nprint(fixed == cart)", explain: "<p><code>asdict</code> 는 안쪽 Item 까지 딕셔너리로 바꿔서 첫 줄은 <code>{'title': '소금빵', 'qty': 2}</code>, JSON 글자도 딕셔너리 · 리스트 모양 그대로예요. <code>Cart(**d)</code> 는 <b>한 겹만</b> 풀어서 <code>back.items</code> 에는 딕셔너리가 그대로 들어가요. 그래서 셋째 줄은 <code>Item(…)</code> 이 아니라 딕셔너리이고, Item 과 딕셔너리는 같지 않아서 <code>back == cart</code> 는 <code>False</code> 예요. 안쪽을 <code>Item(**x)</code> 로 되살리면 칸끼리 같아져서 마지막은 <code>True</code> 예요.</p>" },
      { title: "🏠 독서 기록 — 1판 파일을 2판으로", text: "<p>작년에 만든 독서 기록 파일 <code>reading.json</code>(아래 준비 파일)은 <b>1판</b>이에요. 책 제목과 다 읽은 날만 있어요. 올해 판(2판)에는 별점 <code>stars</code>(1~5, 모르면 0) 칸을 더했어요.</p><ul><li>dataclass <code>Reading(title: str, finished: date, stars: int = 0)</code> 를 만들고, <code>to_dict()</code> 메서드와 <code>@classmethod from_dict(cls, d)</code> 짝을 두세요. 1판에는 <code>stars</code> 가 없어요</li><li>파일을 읽어 판 번호와 권수를 <code>옛 파일: 1판, 2권</code> 처럼 출력하세요</li><li>새 책 <code>Reading(\"하루 10분 SQL\", date(2026, 9, 7), 5)</code> 를 더하고 <code>{\"version\": 2, \"books\": [...]}</code> 모양으로 <code>reading.json</code> 에 다시 저장하세요</li><li>다시 읽어 되살린 리스트가 저장하기 전 리스트와 같은지 <b>왕복 시험</b>을 하고, 책마다 출력 예처럼 찍으세요(별점 0 은 「별점 없음」)</li></ul>", needs: [["def to_dict(self):", "F4/4", "저장할 딕셔너리 — 날짜는 isoformat"], ["@classmethod  def from_dict(cls, d):", "F4/4", "딕셔너리 → 객체, 클래스 이름으로 부름"], ["d.get(\"stars\", 0)", "F4/4", "옛 판에 없는 칸 채우기"], ["date.fromisoformat(d[\"finished\"])", "F4/2", "날짜 글자 → date"], ["assert back == books", "F4/4", "왕복 시험"]], prep: [{ name: "reading.json", text: "{\n  \"version\": 1,\n  \"books\": [\n    {\"title\": \"파이썬 첫걸음\", \"finished\": \"2025-11-02\"},\n    {\"title\": \"엑셀 업무 노트\", \"finished\": \"2026-01-15\"}\n  ]\n}\n" }], io: [{ output: "옛 파일: 1판, 2권\n새 파일: 2판, 3권 — 왕복 시험 통과\n2025-11-02 파이썬 첫걸음 별점 없음\n2026-01-15 엑셀 업무 노트 별점 없음\n2026-09-07 하루 10분 SQL ★★★★★" }], answer: "from dataclasses import dataclass\nfrom datetime import date\nimport json\n\n\n@dataclass\nclass Reading:\n    title: str\n    finished: date\n    stars: int = 0\n\n    def to_dict(self):\n        return {\"title\": self.title, \"finished\": self.finished.isoformat(), \"stars\": self.stars}\n\n    @classmethod\n    def from_dict(cls, d):\n        return cls(\n            title=d[\"title\"],\n            finished=date.fromisoformat(d[\"finished\"]),\n            stars=d.get(\"stars\", 0),\n        )\n\n\nwith open(\"reading.json\", encoding=\"utf-8\") as f:\n    data = json.load(f)\nbooks = [Reading.from_dict(d) for d in data[\"books\"]]\nprint(f\"옛 파일: {data['version']}판, {len(books)}권\")\n\nnew = Reading(\"하루 10분 SQL\", date(2026, 9, 7), 5)\nbooks.append(new)\nout = {\"version\": 2, \"books\": [b.to_dict() for b in books]}\nwith open(\"reading.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(out, f, ensure_ascii=False, indent=2)\n\nwith open(\"reading.json\", encoding=\"utf-8\") as f:\n    data = json.load(f)\nback = [Reading.from_dict(d) for d in data[\"books\"]]\nassert back == books, \"왕복 시험 실패\"\nprint(f\"새 파일: {data['version']}판, {len(back)}권 — 왕복 시험 통과\")\nfor b in back:\n    stars = \"★\" * b.stars if b.stars else \"별점 없음\"\n    print(b.finished, b.title, stars)" },
      { title: "고치기 — 되살렸더니 전부 None", text: "<p>모임 일정을 꼬리표(<code>__type__</code>)로 저장하고 <code>object_hook</code> 으로 되살리는 코드예요(아래 고칠 코드). 저장은 잘 되는데 읽자마자 이렇게 멈춰요.</p><pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\main.py\", line 23, in &lt;module&gt;\n    print(back[\"name\"])\n          ~~~~^^^^^^^^\nTypeError: 'NoneType' object is not subscriptable</pre><p>먼저 말해 보세요. <code>back</code> 이 왜 <code>None</code> 일까요? (힌트: <code>untag</code> 는 몇 번 불리고, 꼬리표가 아닌 딕셔너리에서는 무엇을 돌려주나요?) 한 줄을 더해 고쳐서 출력 예처럼 나오게 하세요.</p>", needs: [["json.loads(text, object_hook=untag)", "F4/3", "딕셔너리마다 불리는 함수"], ["return d", "F4/3", "꼬리표가 아니면 그대로 돌려주기"]], given: "import json\nfrom datetime import date\n\n\ndef tag(o):\n    if isinstance(o, date):\n        return {\"__type__\": \"date\", \"value\": o.isoformat()}\n    raise TypeError(f\"JSON 으로 못 바꿔요: {type(o).__name__}\")\n\n\ndef untag(d):\n    if d.get(\"__type__\") == \"date\":\n        return date.fromisoformat(d[\"value\"])\n\n\nplan = {\n    \"name\": \"독서 모임\",\n    \"meet\": [date(2026, 9, 6), date(2026, 9, 20)],\n    \"place\": {\"name\": \"마포 도서관\", \"since\": date(2026, 3, 2)},\n}\ntext = json.dumps(plan, default=tag, ensure_ascii=False)\nback = json.loads(text, object_hook=untag)\nprint(back[\"name\"])\nfor day in back[\"meet\"]:\n    print(day.strftime(\"%m월 %d일\"), type(day).__name__)\nprint(back[\"place\"][\"since\"].year)\nprint(back == plan)", io: [{ output: "독서 모임\n09월 06일 date\n09월 20일 date\n2026\nTrue" }], answer: "import json\nfrom datetime import date\n\n\ndef tag(o):\n    if isinstance(o, date):\n        return {\"__type__\": \"date\", \"value\": o.isoformat()}\n    raise TypeError(f\"JSON 으로 못 바꿔요: {type(o).__name__}\")\n\n\ndef untag(d):\n    if d.get(\"__type__\") == \"date\":\n        return date.fromisoformat(d[\"value\"])\n    return d\n\n\nplan = {\n    \"name\": \"독서 모임\",\n    \"meet\": [date(2026, 9, 6), date(2026, 9, 20)],\n    \"place\": {\"name\": \"마포 도서관\", \"since\": date(2026, 3, 2)},\n}\ntext = json.dumps(plan, default=tag, ensure_ascii=False)\nback = json.loads(text, object_hook=untag)\nprint(back[\"name\"])\nfor day in back[\"meet\"]:\n    print(day.strftime(\"%m월 %d일\"), type(day).__name__)\nprint(back[\"place\"][\"since\"].year)\nprint(back == plan)" },
      { title: "에러 읽기 — unexpected keyword argument 'isbn'", text: "<p>서점 API 응답 <code>orders.json</code>(아래 준비 파일)의 상품을 dataclass <code>Item</code> 으로 되살려 주문마다 권수와 금액을 내려고 해요. 내가 쓸 칸(제목 · 값 · 수량)만 클래스에 적었는데, 돌리면 이렇게 멈춰요.</p><pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\main.py\", line 17, in &lt;module&gt;\n    items = [Item(**x) for x in o[\"items\"]]\n             ^^^^^^^^^\nTypeError: Item.__init__() got an unexpected keyword argument 'isbn'</pre><p>먼저 말해 보세요. <b>몇 번째 줄</b>에서, <b>무슨 에러</b>가, <b>왜</b> 났나요? (응답의 상품 딕셔너리에는 키가 몇 개이고, <code>Item</code> 의 칸은 몇 개인가요?) 쓸 키만 골라 넣도록 고치고, 값은 글자 <code>\"18000.00\"</code> 이니 <code>Decimal</code> 로 바꿔서 출력 예처럼 나오게 하세요.</p>", needs: [["Item(title=x[\"title\"], price=Decimal(x[\"price\"]), qty=x[\"qty\"])", "F4/2", "남이 주는 데이터는 쓸 키만"], ["@dataclass", "F4/0", "칸만 적는 클래스"], ["Decimal(\"18000.00\")", "F3/3", "돈은 Decimal"]], given: "from dataclasses import dataclass\nfrom decimal import Decimal\nimport json\n\n\n@dataclass\nclass Item:\n    title: str\n    price: Decimal\n    qty: int\n\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    resp = json.load(f)\n\nfor o in resp[\"data\"][\"orders\"]:\n    items = [Item(**x) for x in o[\"items\"]]\n    books = sum(it.qty for it in items)\n    amount = sum(it.price * it.qty for it in items)\n    print(o[\"id\"], f\"{books}권\", f\"{amount:,}원\")", prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "A-1001 3권 43,000.00원\nA-1002 1권 22,000.00원\nA-1003 3권 54,000.00원\nA-1004 3권 47,800.00원" }], answer: "from dataclasses import dataclass\nfrom decimal import Decimal\nimport json\n\n\n@dataclass\nclass Item:\n    title: str\n    price: Decimal\n    qty: int\n\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    resp = json.load(f)\n\nfor o in resp[\"data\"][\"orders\"]:\n    items = [Item(title=x[\"title\"], price=Decimal(x[\"price\"]), qty=x[\"qty\"]) for x in o[\"items\"]]\n    books = sum(it.qty for it in items)\n    amount = sum(it.price * it.qty for it in items)\n    print(o[\"id\"], f\"{books}권\", f\"{amount:,}원\")" },
    ],
    F5: [
      { title: "\"w\" 와 \"a\", 그리고 \"\\n\" — 출력 예측", text: "<p>기록을 두 가지로 써 봐요. <code>save_w</code> 는 <code>\"w\"</code> 로 열고 줄 끝을 붙이고, <code>save_a</code> 는 <code>\"a\"</code> 로 열지만 <code>\"\\n\"</code> 을 빼먹었어요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요.</p>", needs: [["open(path, \"a\", encoding=\"utf-8\")", "F5/1", "있던 내용 뒤에 이어 쓰기"], ["json.dumps(rec, ensure_ascii=False) + \"\\n\"", "F5/1", "한 줄에 하나 — 줄 끝을 꼭"], ["except json.JSONDecodeError as e:", "F1/3", "e.msg · e.colno 로 까닭과 자리"]], predict: true, io: [{ output: "{\"n\": 3}\n{\"n\": 1}{\"n\": 2}{\"n\": 3}\nExtra data 9" }], answer: "import json\nfrom pathlib import Path\n\n\ndef save_w(path, rec):\n    with open(path, \"w\", encoding=\"utf-8\") as f:\n        f.write(json.dumps(rec) + \"\\n\")\n\n\ndef save_a(path, rec):\n    with open(path, \"a\", encoding=\"utf-8\") as f:\n        f.write(json.dumps(rec))\n\n\nfor name in [\"w.jsonl\", \"a.jsonl\"]:\n    Path(name).unlink(missing_ok=True)\n\nfor n in [1, 2, 3]:\n    save_w(\"w.jsonl\", {\"n\": n})\n    save_a(\"a.jsonl\", {\"n\": n})\n\nwith open(\"w.jsonl\", encoding=\"utf-8\") as f:\n    print(f.read(), end=\"\")\nwith open(\"a.jsonl\", encoding=\"utf-8\") as f:\n    line = f.read()\nprint(line)\ntry:\n    json.loads(line)\nexcept json.JSONDecodeError as e:\n    print(e.msg, e.colno)", explain: "<p><code>\"w\"</code> 는 열 때마다 파일을 비워서 세 번 써도 마지막 <code>{\"n\": 3}</code> 한 줄만 남아요. <code>\"a\"</code> 는 뒤에 이어 쓰지만 줄 끝이 없어서 세 기록이 <b>한 줄에 붙어요</b>: <code>{\"n\": 1}{\"n\": 2}{\"n\": 3}</code>. 이 줄을 <code>json.loads</code> 하면 첫 JSON 이 끝난 뒤에 글자가 더 있어서 <code>Extra data</code> 이고, 자리는 9번째 글자(둘째 <code>{</code>)예요.</p>" },
      { title: "🏠 걷기 기록장 — 이어 쓰고 다시 읽기", text: "<p>날마다 걸음 수를 <code>walk.jsonl</code> 에 한 줄씩 쌓아요. 이미 두 날이 들어 있고, 끝에 빈 줄이 하나 있어요(아래 준비 파일).</p><ul><li><code>2026-09-01 6200</code> 처럼 <code>날짜 걸음</code> 을 한 줄씩 입력받아 <code>끝</code> 이 나올 때까지 <code>{\"day\": …, \"steps\": …}</code> 로 이어 쓰세요. 다 쓰면 <code>2줄 더했어요</code></li><li>그다음 파일 전체를 제너레이터로 다시 읽어(빈 줄은 건너뛰기) 날 수 · 모두 몇 걸음 · 하루 평균(정수로 반올림) · 가장 많이 걸은 날을 출력하세요</li><li>다시 실행하면 기록이 쌓여요. 출력 예는 준비 파일에서 처음 실행했을 때예요</li></ul>", needs: [["append_jsonl(path, rec)", "F5/1", "\"a\" 로 열고 dumps + \"\\n\""], ["def read_jsonl(path):  …  yield json.loads(line)", "F5/2", "한 줄씩 읽는 제너레이터"], ["if not line.strip(): continue", "F5/2", "빈 줄 건너뛰기"], ["days = list(read_jsonl(\"walk.jsonl\"))", "F5/2", "다 모을 땐 list() 로"]], prep: [{ name: "walk.jsonl", text: "{\"day\": \"2026-08-30\", \"steps\": 8100}\n{\"day\": \"2026-08-31\", \"steps\": 4300}\n\n" }], io: [{ input: "2026-09-01 6200\n2026-09-02 11000\n끝", output: "2줄 더했어요\n모두 4일 29,600걸음\n하루 평균 7,400걸음\n가장 많이 걸은 날: 2026-09-02 11,000걸음" }], answer: "import json\n\n\ndef append_jsonl(path, rec):\n    with open(path, \"a\", encoding=\"utf-8\") as f:\n        f.write(json.dumps(rec, ensure_ascii=False) + \"\\n\")\n\n\ndef read_jsonl(path):\n    with open(path, encoding=\"utf-8\") as f:\n        for line in f:\n            if not line.strip():\n                continue\n            yield json.loads(line)\n\n\nadded = 0\nwhile True:\n    line = input()\n    if line == \"끝\":\n        break\n    day, steps = line.split()\n    append_jsonl(\"walk.jsonl\", {\"day\": day, \"steps\": int(steps)})\n    added += 1\nprint(f\"{added}줄 더했어요\")\n\ndays = list(read_jsonl(\"walk.jsonl\"))\ntotal = sum(r[\"steps\"] for r in days)\nbest = max(days, key=lambda r: r[\"steps\"])\nprint(f\"모두 {len(days)}일 {total:,}걸음\")\nprint(f\"하루 평균 {round(total / len(days)):,}걸음\")\nprint(f\"가장 많이 걸은 날: {best['day']} {best['steps']:,}걸음\")" },
      { title: "사용 기록에서 검색어 세기 — 깨진 줄은 번호만", text: "<p>메모 앱의 사용 기록 <code>events.jsonl</code>(아래 준비 파일, 40줄)에는 빈 줄 하나와 깨진 줄 하나가 숨어 있어요. 멈추지 말고 끝까지 읽어서</p><ul><li><code>읽은 기록 38개 · 깨진 줄 1개</code> 처럼 건수를, 깨진 줄마다 <code>  27번 줄: …</code> 처럼 파일의 줄 번호와 <code>e.msg</code> 를</li><li><code>search</code> 기록의 검색어 <code>query</code> 를 세어 많은 것부터 <code>검색어 json: 7번</code> 처럼(복습: <a href=\"../python/#lesson/L16E\" target=\"_blank\" rel=\"noopener\">파이썬 교과서 「표준 라이브러리 둘러보기」 ↗</a> 의 <code>Counter</code>)</li><li><code>save</code> 기록의 <code>size_kb</code> 를 더해 <code>저장 12번 · 모두 304 KB</code> 처럼</li></ul><p>출력하세요. 깨진 줄이 어디인지는 VS Code 에서 파일을 열어 그 줄 번호로 가서 직접 확인해 봐요.</p>", needs: [["for n, line in enumerate(f, 1):", "F5/3", "줄 번호를 1부터"], ["except json.JSONDecodeError as e:  bad.append((n, e.msg))", "F5/3", "깨진 줄은 번호와 까닭만 남기고 계속"], ["yield rec", "F5/3", "잘 읽은 줄만 내보내기"]], prep: [{ name: "events.jsonl", text: EVENTS_JSONL }], io: [{ output: "읽은 기록 38개 · 깨진 줄 1개\n  27번 줄: Expecting ',' delimiter\n검색어 json: 7번\n검색어 차트: 6번\n저장 12번 · 모두 304 KB" }], answer: "import json\nfrom collections import Counter\n\n\ndef read_jsonl(path, bad):\n    with open(path, encoding=\"utf-8\") as f:\n        for n, line in enumerate(f, 1):\n            if not line.strip():\n                continue\n            try:\n                rec = json.loads(line)\n            except json.JSONDecodeError as e:\n                bad.append((n, e.msg))\n                continue\n            yield rec\n\n\nbad = []\nrecs = list(read_jsonl(\"events.jsonl\", bad))\nprint(f\"읽은 기록 {len(recs)}개 · 깨진 줄 {len(bad)}개\")\nfor n, why in bad:\n    print(f\"  {n}번 줄: {why}\")\n\nqueries = Counter(r[\"query\"] for r in recs if r[\"event\"] == \"search\")\nfor q, k in queries.most_common():\n    print(f\"검색어 {q}: {k}번\")\n\nsizes = [r[\"size_kb\"] for r in recs if r[\"event\"] == \"save\"]\nprint(f\"저장 {len(sizes)}번 · 모두 {sum(sizes)} KB\")" },
      { title: "에러 읽기 — Expecting value: line 2 column 1", text: "<p>메모 기록 <code>memo.jsonl</code>(아래 준비 파일)을 읽는 코드예요. 어제 메모장으로 파일을 열어 한 줄을 지웠는데, 그 뒤로 이렇게 멈춰요.</p><pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\main.py\", line 6, in &lt;module&gt;\n    notes.append(json.loads(line))\n                 ^^^^^^^^^^^^^^^^\n  File \"C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\json\\__init__.py\", line 346, in loads\n    return _default_decoder.decode(s)\n           ^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\json\\decoder.py\", line 337, in decode\n    obj, end = self.raw_decode(s, idx=_w(s, 0).end())\n               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n  File \"C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\json\\decoder.py\", line 355, in raw_decode\n    raise JSONDecodeError(\"Expecting value\", s, err.value) from None\njson.decoder.JSONDecodeError: Expecting value: line 2 column 1 (char 1)</pre><p>먼저 말해 보세요. 마지막 줄은 「2번째 줄 1번째 글자에서 값을 기대했다」 고 해요. 그런데 파일의 2번째 줄은 멀쩡해요. 이 <code>line 2</code> 는 무엇의 2번째 줄일까요? (궁금하면 <code>json.loads</code> 앞에 <code>print(repr(line))</code> 을 넣어 봐요. 멈추기 바로 전에 찍힌 글자가 범인이에요.) 빈 줄은 건너뛰게 고치고, 메모마다 출력 예처럼 찍으세요.</p>", needs: [["if not line.strip(): continue", "F5/2", "빈 줄 건너뛰기"], ["e.lineno", "F5/3", "넘긴 글자 안의 줄 번호 — 파일의 줄 번호가 아님"], ["for line in f:", "F5/2", "한 줄씩"]], given: "import json\n\nnotes = []\nwith open(\"memo.jsonl\", encoding=\"utf-8\") as f:\n    for line in f:\n        notes.append(json.loads(line))\n\nfor note in notes:\n    mark = \"✔\" if note[\"done\"] else \"·\"\n    print(mark, note[\"text\"])\nprint(len(notes), \"개\")", prep: [{ name: "memo.jsonl", text: "{\"text\": \"우유 사기\", \"done\": true}\n{\"text\": \"엑셀 보고서 보내기\", \"done\": false}\n\n{\"text\": \"책 반납\", \"done\": false}\n" }], io: [{ output: "✔ 우유 사기\n· 엑셀 보고서 보내기\n· 책 반납\n3 개" }], answer: "import json\n\nnotes = []\nwith open(\"memo.jsonl\", encoding=\"utf-8\") as f:\n    for line in f:\n        if not line.strip():\n            continue\n        notes.append(json.loads(line))\n\nfor note in notes:\n    mark = \"✔\" if note[\"done\"] else \"·\"\n    print(mark, note[\"text\"])\nprint(len(notes), \"개\")" },
    ],
    F6: [
      { title: "통과할까 — 출력 예측", text: "<p>상품 하나를 손으로 검사해 봐요. 실행하기 전에 줄마다 <code>True</code> · <code>False</code> 나 리스트를 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 넷째 줄은 에러가 날까요?</p>", needs: [["missing = REQUIRED - item.keys()", "F6/0", "없는 키 — 집합 차"], ["isinstance(v, int) and not isinstance(v, bool)", "F6/1", "bool 먼저 거르기"], ["v in range(1, 100001)", "F6/2", "범위 — 정수만 들어 있음"]], predict: true, io: [{ output: "[]\nTrue\nFalse\nFalse\nTrue\n['memo']" }], answer: "REQUIRED = {\"title\", \"price\", \"qty\"}\nitem = {\"title\": \"엑셀 업무 노트\", \"price\": \"12500\", \"qty\": True, \"memo\": \"\"}\n\nmissing = REQUIRED - item.keys()\nprint(sorted(missing))\nprint(isinstance(item[\"qty\"], int))\nprint(isinstance(item[\"qty\"], int) and not isinstance(item[\"qty\"], bool))\nprint(item[\"price\"] in range(1, 100001))\nprint(len(item[\"memo\"]) <= 100)\nextra = item.keys() - REQUIRED\nprint(sorted(extra))", explain: "<p>필수 키는 셋 다 있어서 <code>[]</code> 예요. <code>True</code> 는 bool 인데 bool 은 int 의 한 종류라 <code>isinstance(True, int)</code> 는 <code>True</code>, bool 을 먼저 거르면 <code>False</code> 예요. 값 <code>\"12500\"</code> 은 글자라서 정수만 든 range 안에 없어요 — 에러가 아니라 <code>False</code> 라서, 종류를 먼저 안 보면 「범위 밖」 이라는 엉뚱한 까닭이 나와요. 빈 글자의 길이는 0 이라 <code>True</code>, 남는 키는 <code>['memo']</code> 예요.</p>" },
      { title: "🏠 동아리 가입 신청서 검사", text: "<p>동아리 가입 신청서가 웹 폼에서 <code>signup.json</code>(아래 준비 파일)으로 모였어요. 사람마다 규칙표로 검사해서, 틀린 곳을 <b>모아서</b> 경로와 함께 출력하세요. 경로는 <code>[1].age</code> 처럼 「몇 번째 사람의 어느 칸」 이에요.</p><table class=\"kb\"><tbody><tr><th>칸</th><th>규칙</th></tr><tr><td>name</td><td>글자, 1~20 글자</td></tr><tr><td>age</td><td>정수 14~99(bool 은 안 돼요)</td></tr><tr><td>level</td><td>초급 · 중급 · 고급 중 하나</td></tr><tr><td>email</td><td>글자, <code>@</code> 가 들어 있어야</td></tr><tr><td>agree</td><td><code>true</code> 만(동의해야 가입)</td></tr></tbody></table><p><code>name</code> 길이와 <code>email</code> 의 <code>@</code> 는 규칙표 밖에서 따로 보면 돼요. 마지막에 <code>4명 중 1명 통과: 김하늘</code> 처럼 출력하세요.</p>", needs: [["RULES = {\"age\": (int, range(14, 100)), …}", "F6/4", "규칙표"], ["check(person, RULES, f\"[{i}].\")", "F6/4", "사람마다 경로를 붙여 검사"], ["errors += …", "F6/3", "첫 에러에서 멈추지 않고 모으기"], ["1 <= len(name) <= 20", "F6/2", "글자 길이"], ["isinstance(value, bool) and kind is not bool", "F6/2", "True 가 정수로 통과하지 않게"]], prep: [{ name: "signup.json", text: "[\n  {\"name\": \"김하늘\", \"age\": 27, \"level\": \"중급\", \"email\": \"sky@example.com\", \"agree\": true},\n  {\"name\": \"이도윤\", \"age\": \"31\", \"level\": \"고수\", \"email\": \"doyun@example.com\", \"agree\": true},\n  {\"name\": \"\", \"age\": 15, \"level\": \"초급\", \"email\": \"seojun.example.com\", \"agree\": false},\n  {\"name\": \"최유나\", \"age\": true, \"level\": \"초급\", \"agree\": true}\n]\n" }], io: [{ output: "[1].age: 종류가 int 여야 해요(지금 str '31')\n[1].level: 고급, 중급, 초급 중 하나여야 해요(지금 '고수')\n[2].name: 1~20 글자여야 해요\n[2].agree: 동의해야 가입할 수 있어요\n[2].email: @ 가 있어야 해요(지금 'seojun.example.com')\n[3].email: 꼭 있어야 해요\n[3].age: 종류가 int 여야 해요(지금 bool True)\n4명 중 1명 통과: 김하늘" }], answer: "import json\n\n\ndef allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f\"{allowed.start}~{allowed.stop - 1} 사이여야\"\n    names = sorted(str(x) for x in allowed)\n    return \", \".join(names) + \" 중 하나여야\"\n\n\ndef check_value(value, kind, allowed):\n    \"\"\"맞으면 None, 틀리면 까닭(글자)\"\"\"\n    if isinstance(value, bool) and kind is not bool:\n        return f\"종류가 {kind.__name__} 여야 해요(지금 bool {value})\"\n    if not isinstance(value, kind):\n        return f\"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})\"\n    if allowed is not None and value not in allowed:\n        return f\"{allowed_text(allowed)} 해요(지금 {value!r})\"\n    return None\n\n\ndef check(data, rules, where=\"\"):\n    errors = []\n    for key in sorted(rules.keys() - data.keys()):\n        errors.append(f\"{where}{key}: 꼭 있어야 해요\")\n    for key, rule in rules.items():\n        if key not in data:\n            continue\n        path = where + key\n        value = data[key]\n        if isinstance(rule, dict):\n            if isinstance(value, dict):\n                errors += check(value, rule, path + \".\")\n            else:\n                errors.append(f\"{path}: 묶음(dict)이어야 해요(지금 {type(value).__name__} {value!r})\")\n            continue\n        why = check_value(value, *rule)\n        if why:\n            errors.append(f\"{path}: {why}\")\n    return errors\n\n\nRULES = {\n    \"name\": (str, None),\n    \"age\": (int, range(14, 100)),\n    \"level\": (str, {\"초급\", \"중급\", \"고급\"}),\n    \"email\": (str, None),\n    \"agree\": (bool, None),\n}\n\nwith open(\"signup.json\", encoding=\"utf-8\") as f:\n    people = json.load(f)\n\npassed = []\nfor i, person in enumerate(people):\n    where = f\"[{i}].\"\n    errors = check(person, RULES, where)\n    name = person.get(\"name\")\n    if isinstance(name, str) and not 1 <= len(name) <= 20:\n        errors.append(f\"{where}name: 1~20 글자여야 해요\")\n    if person.get(\"agree\") is False:\n        errors.append(f\"{where}agree: 동의해야 가입할 수 있어요\")\n    email = person.get(\"email\")\n    if isinstance(email, str) and \"@\" not in email:\n        errors.append(f\"{where}email: @ 가 있어야 해요(지금 {email!r})\")\n    for e in errors:\n        print(e)\n    if not errors:\n        passed.append(name)\nprint(f\"{len(people)}명 중 {len(passed)}명 통과: {', '.join(passed)}\")" },
      { title: "고치기 — True 가 숫자로 통과하고, 하나만 알려 줘요", text: "<p>설정 검사 코드예요(아래 고칠 코드). 사용자가 설정을 이렇게 고쳐 왔어요: <code>font_size</code> 에 <code>true</code>, <code>autosave_minutes</code> 에 <code>0</code>, <code>theme</code> 에 <code>\"Dark\"</code>. 그런데 돌리면</p><pre>font_size: 8~40 사이여야 해요(지금 True)</pre><p>한 줄만 나와요. 틀린 데가 둘 있어요. ① 까닭이 엉뚱해요 — <code>True</code> 는 범위가 아니라 <b>종류</b>가 틀렸어요. ② 첫 에러에서 <code>return</code> 해서 나머지 둘을 못 봐요. 이 레슨의 <code>check_value</code> 와 규칙표로 고쳐서, 셋을 한 번에 출력 예처럼 보여 주세요.</p>", needs: [["isinstance(value, bool) and kind is not bool", "F6/2", "bool 먼저 거르기"], ["errors.append(…)", "F6/3", "모아서 한 번에"], ["check_value(value, *rule)", "F6/4", "규칙표의 (종류, 고를 값) 을 풀어 넘기기"]], given: "def check(s):\n    if not isinstance(s[\"font_size\"], int):\n        return \"font_size: 숫자여야 해요\"\n    if s[\"font_size\"] not in range(8, 41):\n        return f\"font_size: 8~40 사이여야 해요(지금 {s['font_size']})\"\n    if s[\"autosave_minutes\"] not in range(1, 61):\n        return f\"autosave_minutes: 1~60 사이여야 해요(지금 {s['autosave_minutes']})\"\n    if s[\"theme\"] not in {\"light\", \"dark\"}:\n        return f\"theme: light 나 dark 여야 해요(지금 {s['theme']!r})\"\n    return \"문제 없음\"\n\n\nsettings = {\"theme\": \"Dark\", \"font_size\": True, \"autosave_minutes\": 0}\nprint(check(settings))", io: [{ output: "font_size: 종류가 int 여야 해요(지금 bool True)\nautosave_minutes: 1~60 사이여야 해요(지금 0)\ntheme: dark, light 중 하나여야 해요(지금 'Dark')" }], answer: "def allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f\"{allowed.start}~{allowed.stop - 1} 사이여야\"\n    names = sorted(str(x) for x in allowed)\n    return \", \".join(names) + \" 중 하나여야\"\n\n\ndef check_value(value, kind, allowed):\n    if isinstance(value, bool) and kind is not bool:\n        return f\"종류가 {kind.__name__} 여야 해요(지금 bool {value})\"\n    if not isinstance(value, kind):\n        return f\"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})\"\n    if allowed is not None and value not in allowed:\n        return f\"{allowed_text(allowed)} 해요(지금 {value!r})\"\n    return None\n\n\nRULES = {\n    \"font_size\": (int, range(8, 41)),\n    \"autosave_minutes\": (int, range(1, 61)),\n    \"theme\": (str, {\"light\", \"dark\"}),\n}\n\n\ndef check(s):\n    errors = []\n    for key, rule in RULES.items():\n        why = check_value(s[key], *rule)\n        if why:\n            errors.append(f\"{key}: {why}\")\n    return errors\n\n\nsettings = {\"theme\": \"Dark\", \"font_size\": True, \"autosave_minutes\": 0}\nerrors = check(settings)\nif errors:\n    for e in errors:\n        print(e)\nelse:\n    print(\"문제 없음\")" },
      { title: "서점 API 응답 검사 — data.orders[2].customer.email", text: "<p>서점 API 응답 <code>orders.json</code>(아래 준비 파일)을 쓰기 전에 검사해요. 주문마다 아래 규칙표로 보고, 상품은 하나씩 <code>ITEM_RULES</code> 로 봐요. 경로는 응답 맨 위에서부터 <code>data.orders[0].items[1].qty</code> 처럼 붙여요.</p><pre>ORDER_RULES = {\n    \"id\": (str, None),\n    \"status\": (str, {\"paid\", \"cancelled\", \"shipped\"}),\n    \"customer\": {\n        \"name\": (str, None),\n        \"email\": (str, None),\n        \"address\": {\"city\": (str, None), \"zip\": (str, None)},\n    },\n    \"items\": (list, None),\n}\nITEM_RULES = {\"title\": (str, None), \"price\": (str, None), \"qty\": (int, range(1, 100))}</pre><p>① 모든 주문을 검사해 <code>주문 4건 검사 — 고칠 곳 2개</code> 와 에러 줄들을 출력하세요. ② 살펴보니 <b>취소된 주문은 개인정보를 지워서</b> <code>null</code> 이 되는 게 정상이었어요. 그래서 <code>status</code> 가 <code>\"cancelled\"</code> 인 주문은 <code>customer</code> 를 검사하지 않게 해서 다시 돌려, <code>취소 주문의 고객 칸은 빼고 — 고칠 곳 0개</code> 를 출력하세요.</p>", needs: [["check(o, ORDER_RULES, f\"data.orders[{i}].\")", "F6/4", "경로를 이어 붙여 검사"], ["check(item, ITEM_RULES, f\"{where}items[{k}].\")", "F6/4", "리스트 안의 것들은 하나씩"], ["for i, o in enumerate(orders):", "F6/3", "번호를 같이 받아 경로에"], ["{k: v for k, v in rules.items() if k != \"customer\"}", "F6/4", "딕셔너리도 [x for …] 처럼 {키: 값 for …} 로 만들어요 — customer 만 뺀 새 규칙표"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "주문 4건 검사 — 고칠 곳 2개\n  data.orders[2].customer.email: 종류가 str 여야 해요(지금 NoneType None)\n  data.orders[2].customer.address: 묶음(dict)이어야 해요(지금 NoneType None)\n취소 주문의 고객 칸은 빼고 — 고칠 곳 0개" }], answer: "import json\n\n\ndef allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f\"{allowed.start}~{allowed.stop - 1} 사이여야\"\n    names = sorted(str(x) for x in allowed)\n    return \", \".join(names) + \" 중 하나여야\"\n\n\ndef check_value(value, kind, allowed):\n    \"\"\"맞으면 None, 틀리면 까닭(글자)\"\"\"\n    if isinstance(value, bool) and kind is not bool:\n        return f\"종류가 {kind.__name__} 여야 해요(지금 bool {value})\"\n    if not isinstance(value, kind):\n        return f\"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})\"\n    if allowed is not None and value not in allowed:\n        return f\"{allowed_text(allowed)} 해요(지금 {value!r})\"\n    return None\n\n\ndef check(data, rules, where=\"\"):\n    errors = []\n    for key in sorted(rules.keys() - data.keys()):\n        errors.append(f\"{where}{key}: 꼭 있어야 해요\")\n    for key, rule in rules.items():\n        if key not in data:\n            continue\n        path = where + key\n        value = data[key]\n        if isinstance(rule, dict):\n            if isinstance(value, dict):\n                errors += check(value, rule, path + \".\")\n            else:\n                errors.append(f\"{path}: 묶음(dict)이어야 해요(지금 {type(value).__name__} {value!r})\")\n            continue\n        why = check_value(value, *rule)\n        if why:\n            errors.append(f\"{path}: {why}\")\n    return errors\n\n\nORDER_RULES = {\n    \"id\": (str, None),\n    \"status\": (str, {\"paid\", \"cancelled\", \"shipped\"}),\n    \"customer\": {\n        \"name\": (str, None),\n        \"email\": (str, None),\n        \"address\": {\"city\": (str, None), \"zip\": (str, None)},\n    },\n    \"items\": (list, None),\n}\nITEM_RULES = {\"title\": (str, None), \"price\": (str, None), \"qty\": (int, range(1, 100))}\n\n\ndef check_orders(orders, skip_cancelled_customer):\n    errors = []\n    for i, o in enumerate(orders):\n        where = f\"data.orders[{i}].\"\n        rules = ORDER_RULES\n        if skip_cancelled_customer and o.get(\"status\") == \"cancelled\":\n            rules = {k: v for k, v in ORDER_RULES.items() if k != \"customer\"}\n        errors += check(o, rules, where)\n        for k, item in enumerate(o.get(\"items\", [])):\n            errors += check(item, ITEM_RULES, f\"{where}items[{k}].\")\n    return errors\n\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    resp = json.load(f)\norders = resp[\"data\"][\"orders\"]\n\nerrors = check_orders(orders, False)\nprint(f\"주문 {len(orders)}건 검사 — 고칠 곳 {len(errors)}개\")\nfor e in errors:\n    print(\" \", e)\n\nerrors = check_orders(orders, True)\nprint(f\"취소 주문의 고객 칸은 빼고 — 고칠 곳 {len(errors)}개\")" },
    ],
    FB1: [
      { title: "기본 설정 + 사용자 설정 깊게 합치기", text: "<p>메모 앱을 만드는 회사에 들어왔다고 해 봐요. 첫 일은 <b>사용자 설정</b>과 <b>서점 제휴 API 응답</b>, <b>사용 기록</b>을 정리하는 거예요. 준비 파일은 공부 폴더의 <code>settings.json</code> · <code>orders.json</code> · <code>events.jsonl</code> 이에요(문제마다 아래에 다시 나와요).</p><p>앱에는 기본 설정 <code>DEFAULTS</code> 가 있고, 사용자는 바꾸고 싶은 것만 <code>settings.json</code>(아래 준비 파일)에 적어요. 두 딕셔너리를 합치는 <code>merge(defaults, user)</code> 를 만드세요.</p><pre>DEFAULTS = {\n    \"theme\": \"light\",\n    \"font_size\": 12,\n    \"language\": \"ko\",\n    \"autosave\": True,\n    \"autosave_minutes\": 5,\n    \"editor\": {\"tab_size\": 4, \"word_wrap\": False, \"line_numbers\": True},\n    \"recent_files\": [],\n}</pre><ul><li>사용자 값이 있으면 사용자 값, 없으면 기본값</li><li>둘 다 딕셔너리인 칸(예: <code>editor</code>)은 통째로 바꾸지 말고 <b>안쪽까지</b> 합쳐요 — 사용자 파일에 없는 <code>line_numbers</code> 는 기본값이 남아야 해요(재귀, 복습: <a href=\"../python/#lesson/L32\" target=\"_blank\" rel=\"noopener\">파이썬 교과서 「재귀: 나를 부르는 함수」 ↗</a>)</li><li><code>DEFAULTS</code> 는 바뀌면 안 돼요. <code>copy.deepcopy</code> 로 복사해서 써요(복습: <a href=\"../python/#lesson/L25\" target=\"_blank\" rel=\"noopener\">파이썬 교과서 「collections 더: defaultdict · deque · namedtuple」 ↗</a> 의 <code>deepcopy</code>)</li><li>합친 결과를 <code>json.dumps(…, ensure_ascii=False, indent=2)</code> 로 출력하고, 마지막에 <code>DEFAULTS[\"editor\"]</code> 를 찍어 그대로인지 보여 주세요</li></ul><p>틀린 값(대문자 · 글자 숫자)은 아직 고치지 않아요. 그건 ② 에서 해요.</p>", needs: [["isinstance(value, dict)", "F6/1", "딕셔너리 칸인지"], ["def merge(defaults, user):  …  merge(result[key], value)", "F6/4", "안쪽은 자기를 다시 불러 — check 와 같은 재귀 모양"], ["json.load(f)", "F1/0", "settings.json 읽기"]], prep: [{ name: "settings.json", text: SETTINGS_JSON }], io: [{ output: "{\n  \"theme\": \"Dark\",\n  \"font_size\": \"14\",\n  \"language\": \"ko\",\n  \"autosave\": true,\n  \"autosave_minutes\": 0,\n  \"editor\": {\n    \"tab_size\": 4,\n    \"word_wrap\": \"yes\",\n    \"line_numbers\": true\n  },\n  \"recent_files\": [\n    \"장보기.txt\",\n    \"회의록.txt\",\n    \"일기.txt\"\n  ]\n}\n기본값 editor: {'tab_size': 4, 'word_wrap': False, 'line_numbers': True}" }], answer: "import copy\nimport json\n\nDEFAULTS = {\n    \"theme\": \"light\",\n    \"font_size\": 12,\n    \"language\": \"ko\",\n    \"autosave\": True,\n    \"autosave_minutes\": 5,\n    \"editor\": {\"tab_size\": 4, \"word_wrap\": False, \"line_numbers\": True},\n    \"recent_files\": [],\n}\n\n\ndef merge(defaults, user):\n    result = copy.deepcopy(defaults)\n    for key, value in user.items():\n        if isinstance(value, dict) and isinstance(result.get(key), dict):\n            result[key] = merge(result[key], value)\n        else:\n            result[key] = value\n    return result\n\n\nwith open(\"settings.json\", encoding=\"utf-8\") as f:\n    user = json.load(f)\n\nmerged = merge(DEFAULTS, user)\nprint(json.dumps(merged, ensure_ascii=False, indent=2))\nprint(\"기본값 editor:\", DEFAULTS[\"editor\"])" },
      { title: "설정 검사 → 틀린 값만 기본값으로 되돌려 저장", text: "<p>① 의 합친 설정을 규칙표로 검사해요. 규칙표는 [[레슨:F6]] 의 것에 <code>editor.line_numbers</code> 를 더한 거예요.</p><pre>RULES = {\n    \"theme\": (str, {\"light\", \"dark\"}),\n    \"font_size\": (int, range(8, 41)),\n    \"language\": (str, {\"ko\", \"en\"}),\n    \"autosave\": (bool, None),\n    \"autosave_minutes\": (int, range(1, 61)),\n    \"editor\": {\n        \"tab_size\": (int, {2, 4, 8}),\n        \"word_wrap\": (bool, None),\n        \"line_numbers\": (bool, None),\n    },\n    \"recent_files\": (list, None),\n}</pre><ul><li>[[레슨:F6]] 의 <code>check</code> 로 틀린 곳을 모아 <code>틀린 값 4개</code> 와 에러 줄을 출력하세요</li><li>틀린 칸만 <code>DEFAULTS</code> 의 값으로 되돌리는 <code>fix(data, defaults, rules, where=\"\")</code> 를 만들어, 되돌린 경로를 <code>기본값으로 되돌림: theme, font_size, …</code> 처럼 출력하세요(안쪽 규칙표는 재귀)</li><li>고친 설정을 <code>settings_fixed.json</code> 에 <code>sort_keys=True</code> · <code>indent=2</code> · 한글 그대로 저장하세요</li><li>저장한 파일을 다시 읽어 검사한 결과(<code>[]</code>)와 파일 내용을 출력하세요</li></ul><p>사용자가 정한 맞는 값(예: 언어 · 최근 파일)은 그대로 남아야 해요.</p>", needs: [["check(data, RULES)", "F6/4", "규칙표로 모아서 검사"], ["check_value(value, *rule)", "F6/4", "한 칸 검사 — 틀리면 까닭, 맞으면 None"], ["json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)", "F1/2", "키 순서가 늘 같게 저장"]], prep: [{ name: "settings.json", text: SETTINGS_JSON }], io: [{ output: "틀린 값 4개\n  theme: dark, light 중 하나여야 해요(지금 'Dark')\n  font_size: 종류가 int 여야 해요(지금 str '14')\n  autosave_minutes: 1~60 사이여야 해요(지금 0)\n  editor.word_wrap: 종류가 bool 여야 해요(지금 str 'yes')\n기본값으로 되돌림: theme, font_size, autosave_minutes, editor.word_wrap\n다시 검사: []\n{\n  \"autosave\": true,\n  \"autosave_minutes\": 5,\n  \"editor\": {\n    \"line_numbers\": true,\n    \"tab_size\": 4,\n    \"word_wrap\": false\n  },\n  \"font_size\": 12,\n  \"language\": \"ko\",\n  \"recent_files\": [\n    \"장보기.txt\",\n    \"회의록.txt\",\n    \"일기.txt\"\n  ],\n  \"theme\": \"light\"\n}" }], answer: "import copy\nimport json\n\nDEFAULTS = {\n    \"theme\": \"light\",\n    \"font_size\": 12,\n    \"language\": \"ko\",\n    \"autosave\": True,\n    \"autosave_minutes\": 5,\n    \"editor\": {\"tab_size\": 4, \"word_wrap\": False, \"line_numbers\": True},\n    \"recent_files\": [],\n}\n\n\ndef merge(defaults, user):\n    result = copy.deepcopy(defaults)\n    for key, value in user.items():\n        if isinstance(value, dict) and isinstance(result.get(key), dict):\n            result[key] = merge(result[key], value)\n        else:\n            result[key] = value\n    return result\n\n\nRULES = {\n    \"theme\": (str, {\"light\", \"dark\"}),\n    \"font_size\": (int, range(8, 41)),\n    \"language\": (str, {\"ko\", \"en\"}),\n    \"autosave\": (bool, None),\n    \"autosave_minutes\": (int, range(1, 61)),\n    \"editor\": {\n        \"tab_size\": (int, {2, 4, 8}),\n        \"word_wrap\": (bool, None),\n        \"line_numbers\": (bool, None),\n    },\n    \"recent_files\": (list, None),\n}\n\n\ndef allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f\"{allowed.start}~{allowed.stop - 1} 사이여야\"\n    names = sorted(str(x) for x in allowed)\n    return \", \".join(names) + \" 중 하나여야\"\n\n\ndef check_value(value, kind, allowed):\n    \"\"\"맞으면 None, 틀리면 까닭(글자)\"\"\"\n    if isinstance(value, bool) and kind is not bool:\n        return f\"종류가 {kind.__name__} 여야 해요(지금 bool {value})\"\n    if not isinstance(value, kind):\n        return f\"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})\"\n    if allowed is not None and value not in allowed:\n        return f\"{allowed_text(allowed)} 해요(지금 {value!r})\"\n    return None\n\n\ndef check(data, rules, where=\"\"):\n    errors = []\n    for key in sorted(rules.keys() - data.keys()):\n        errors.append(f\"{where}{key}: 꼭 있어야 해요\")\n    for key, rule in rules.items():\n        if key not in data:\n            continue\n        path = where + key\n        value = data[key]\n        if isinstance(rule, dict):\n            if isinstance(value, dict):\n                errors += check(value, rule, path + \".\")\n            else:\n                errors.append(f\"{path}: 묶음(dict)이어야 해요(지금 {type(value).__name__} {value!r})\")\n            continue\n        why = check_value(value, *rule)\n        if why:\n            errors.append(f\"{path}: {why}\")\n    return errors\n\n\ndef fix(data, defaults, rules, where=\"\"):\n    changed = []\n    for key, rule in rules.items():\n        path = where + key\n        if isinstance(rule, dict):\n            if not isinstance(data.get(key), dict):\n                data[key] = copy.deepcopy(defaults[key])\n                changed.append(path)\n            else:\n                changed += fix(data[key], defaults[key], rule, path + \".\")\n        elif key not in data or check_value(data[key], *rule):\n            data[key] = copy.deepcopy(defaults[key])\n            changed.append(path)\n    return changed\n\n\nwith open(\"settings.json\", encoding=\"utf-8\") as f:\n    user = json.load(f)\nsettings = merge(DEFAULTS, user)\n\nerrors = check(settings, RULES)\nprint(f\"틀린 값 {len(errors)}개\")\nfor e in errors:\n    print(\" \", e)\n\nchanged = fix(settings, DEFAULTS, RULES)\nprint(\"기본값으로 되돌림:\", \", \".join(changed))\n\nwith open(\"settings_fixed.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(settings, f, ensure_ascii=False, indent=2, sort_keys=True)\n\nwith open(\"settings_fixed.json\", encoding=\"utf-8\") as f:\n    text = f.read()\nagain = check(json.loads(text), RULES)\nprint(\"다시 검사:\", again)\nprint(text)" },
      { title: "서점 API 응답에서 주문 요약", text: "<p><code>orders.json</code>(아래 준비 파일)은 서점 「주문 목록 API」 의 응답을 저장한 거예요. 주문은 <code>data.orders</code> 안에 있고, 주문마다 <code>customer</code> · <code>items</code> 가 겹쳐 있어요. 주문마다 한 줄로 요약하세요.</p><table class=\"kb\"><tbody><tr><th>칸</th><th>어떻게</th></tr><tr><td>날짜</td><td><code>ordered_at</code> 의 <b>한국 시각 날짜</b>. <code>datetime.fromisoformat(…).date()</code></td></tr><tr><td>고객</td><td><code>customer.name</code></td></tr><tr><td>권수</td><td><code>items</code> 의 <code>qty</code> 합</td></tr><tr><td>금액</td><td><code>price</code> 는 <code>\"18000.00\"</code> 글자예요. <code>Decimal</code> 로 바꿔 <code>× qty</code> 를 더하고, <code>43,000.00원</code> 처럼 쉼표</td></tr></tbody></table><p>취소된 주문(<code>status</code> 가 <code>\"cancelled\"</code>)은 끝에 <code>(취소)</code> 를 붙이고, 마지막 줄에 취소를 뺀 <code>결제 합계</code> 를 출력하세요. 복습: [[레슨:F3]] 의 시각 · 시간대 · Decimal.</p><div class=\"bk-warn\"><b>A-1004 의 날짜</b> — <code>2026-09-05T00:30:00+09:00</code> 은 UTC 로 바꾸면 9월 4일 15:30 이에요. 고객이 주문한 날은 한국 날짜 9월 5일이라, 시간대를 바꾸지 말고 그대로 <code>.date()</code> 해요.</div>", needs: [["resp[\"data\"][\"orders\"]", "F2/0", "응답 안으로 찾아 들어가기"], ["Decimal(it[\"price\"]) * it[\"qty\"]", "F3/3", "글자 금액 → Decimal"], ["datetime.fromisoformat(o[\"ordered_at\"]).date()", "F3/1", "+09:00 시각 글자 → 한국 날짜"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "A-1001 2026-09-03 김하늘 3권 43,000.00원\nA-1002 2026-09-03 이도윤 1권 22,000.00원\nA-1003 2026-09-04 박서준 3권 54,000.00원 (취소)\nA-1004 2026-09-05 최유나 3권 47,800.00원\n결제 합계 112,800.00원" }], answer: "import json\nfrom datetime import datetime\nfrom decimal import Decimal\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    resp = json.load(f)\n\npaid_total = Decimal(\"0\")\nfor o in resp[\"data\"][\"orders\"]:\n    day = datetime.fromisoformat(o[\"ordered_at\"]).date()\n    books = sum(it[\"qty\"] for it in o[\"items\"])\n    amount = sum(Decimal(it[\"price\"]) * it[\"qty\"] for it in o[\"items\"])\n    mark = \" (취소)\" if o[\"status\"] == \"cancelled\" else \"\"\n    print(f\"{o['id']} {day} {o['customer']['name']} {books}권 {amount:,}원{mark}\")\n    if o[\"status\"] != \"cancelled\":\n        paid_total += amount\nprint(f\"결제 합계 {paid_total:,}원\")" },
      { title: "요약을 dataclass 로 — 저장하고 왕복 시험", text: "<p>③ 의 요약을 다른 팀에 파일로 넘기기로 했어요. 요약 한 줄을 dataclass 로 만드세요.</p><pre>@dataclass\nclass Summary:\n    id: str\n    day: date\n    customer: str\n    books: int\n    amount: Decimal\n    cancelled: bool</pre><ul><li><code>to_dict()</code> — 날짜는 ISO 글자, 금액은 <code>str(Decimal)</code>(복습: [[레슨:F3]] — 소수점이 그대로 남게)</li><li><code>@classmethod from_dict(cls, d)</code> — 그 반대</li><li>요약 넷을 <code>{\"version\": 1, \"orders\": [...]}</code> 모양으로 <code>summary.json</code> 에 저장(한글 그대로 · <code>indent=2</code>)</li><li>다시 읽어 되살린 리스트가 처음과 같은지 <code>assert</code> 하고 <code>왕복 시험 통과: 4건</code>, 파일의 첫 요약 딕셔너리, 되살린 마지막 요약을 출력하세요</li></ul>", needs: [["def to_dict(self):", "F4/4", "저장할 딕셔너리"], ["@classmethod  def from_dict(cls, d):", "F4/4", "딕셔너리 → 객체"], ["assert back == summaries", "F4/4", "왕복 시험"], ["\"version\": 1", "F4/4", "나중에 칸이 늘 때를 위해"], ["str(amount)  Decimal(d[\"amount\"])", "F3/3", "돈은 글자로 저장 · Decimal 로 되살리기"]], prep: [{ name: "orders.json", text: BOOKSHOP_JSON }], io: [{ output: "왕복 시험 통과: 4건\n{'id': 'A-1001', 'day': '2026-09-03', 'customer': '김하늘', 'books': 3, 'amount': '43000.00', 'cancelled': False}\nSummary(id='A-1004', day=datetime.date(2026, 9, 5), customer='최유나', books=3, amount=Decimal('47800.00'), cancelled=False)" }], answer: "from dataclasses import dataclass\nfrom datetime import date, datetime\nfrom decimal import Decimal\nimport json\n\n\n@dataclass\nclass Summary:\n    id: str\n    day: date\n    customer: str\n    books: int\n    amount: Decimal\n    cancelled: bool\n\n    def to_dict(self):\n        return {\n            \"id\": self.id,\n            \"day\": self.day.isoformat(),\n            \"customer\": self.customer,\n            \"books\": self.books,\n            \"amount\": str(self.amount),\n            \"cancelled\": self.cancelled,\n        }\n\n    @classmethod\n    def from_dict(cls, d):\n        return cls(\n            id=d[\"id\"],\n            day=date.fromisoformat(d[\"day\"]),\n            customer=d[\"customer\"],\n            books=d[\"books\"],\n            amount=Decimal(d[\"amount\"]),\n            cancelled=d[\"cancelled\"],\n        )\n\n\nwith open(\"orders.json\", encoding=\"utf-8\") as f:\n    resp = json.load(f)\n\nsummaries = []\nfor o in resp[\"data\"][\"orders\"]:\n    summaries.append(Summary(\n        id=o[\"id\"],\n        day=datetime.fromisoformat(o[\"ordered_at\"]).date(),\n        customer=o[\"customer\"][\"name\"],\n        books=sum(it[\"qty\"] for it in o[\"items\"]),\n        amount=sum(Decimal(it[\"price\"]) * it[\"qty\"] for it in o[\"items\"]),\n        cancelled=o[\"status\"] == \"cancelled\",\n    ))\n\nout = {\"version\": 1, \"orders\": [s.to_dict() for s in summaries]}\nwith open(\"summary.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(out, f, ensure_ascii=False, indent=2)\n\nwith open(\"summary.json\", encoding=\"utf-8\") as f:\n    data = json.load(f)\nback = [Summary.from_dict(d) for d in data[\"orders\"]]\nassert back == summaries, \"왕복 시험 실패\"\nprint(f\"왕복 시험 통과: {len(back)}건\")\nprint(data[\"orders\"][0])\nprint(back[-1])" },
      { title: "사용 기록 세기 + 처리 기록 이어 쓰기", text: "<p>마지막으로 사용 기록 <code>events.jsonl</code>(아래 준비 파일)을 종류(<code>event</code>)별로 세요. 빈 줄은 건너뛰고, 깨진 줄은 <b>줄 번호와 까닭만 남기고</b> 계속 읽어요.</p><ul><li>종류별 건수를 많은 것부터 출력 예 모양으로(종류는 6칸 왼쪽 맞춤 · 건수는 3칸 — <code>f\"{kind:6} {n:3}\"</code>)</li><li>깨진 줄은 <code>깨진 줄 27: Expecting ',' delimiter</code> 처럼</li><li>이번 처리를 <code>log.jsonl</code> 에 한 줄 이어 쓰세요: <code>{\"job\": \"events 세기\", \"read\": 38, \"broken\": [27], \"counts\": {…}}</code></li><li><code>log.jsonl</code> 을 다시 읽어 <code>log.jsonl: 1줄</code> 과 마지막 기록의 <code>job</code> · <code>read</code> 를 출력하세요</li></ul><p>다시 실행하면 log.jsonl 이 한 줄씩 늘어요(출력 예는 처음 실행했을 때예요). 파일을 VS Code 로 열어 한 줄에 기록 하나씩인지 봐요.</p>", needs: [["def read_jsonl(path, bad):", "F5/3", "깨진 줄은 번호만 남기고 계속"], ["append_jsonl(path, rec)", "F5/1", "\"a\" 로 열고 dumps + \"\\n\""], ["if not line.strip(): continue", "F5/2", "빈 줄 건너뛰기"], ["for rec in read_jsonl(\"events.jsonl\", bad):", "F5/4", "한 줄씩 받아 세기"]], prep: [{ name: "events.jsonl", text: EVENTS_JSONL }], io: [{ output: "search  13\nsave    12\nopen     7\nclose    6\n깨진 줄 27: Expecting ',' delimiter\nlog.jsonl: 1줄\nevents 세기 38" }], answer: "import json\nfrom collections import Counter\n\n\ndef read_jsonl(path, bad):\n    with open(path, encoding=\"utf-8\") as f:\n        for n, line in enumerate(f, 1):\n            if not line.strip():\n                continue\n            try:\n                rec = json.loads(line)\n            except json.JSONDecodeError as e:\n                bad.append((n, e.msg))\n                continue\n            yield rec\n\n\ndef append_jsonl(path, rec):\n    with open(path, \"a\", encoding=\"utf-8\") as f:\n        f.write(json.dumps(rec, ensure_ascii=False) + \"\\n\")\n\n\nbad = []\ncounts = Counter()\nfor rec in read_jsonl(\"events.jsonl\", bad):\n    counts[rec[\"event\"]] += 1\n\nfor kind, n in counts.most_common():\n    print(f\"{kind:6} {n:3}\")\nfor n, why in bad:\n    print(f\"깨진 줄 {n}: {why}\")\n\nread = sum(counts.values())\nappend_jsonl(\"log.jsonl\", {\"job\": \"events 세기\", \"read\": read, \"broken\": [n for n, _ in bad], \"counts\": dict(counts)})\n\nlog_bad = []\nlogs = list(read_jsonl(\"log.jsonl\", log_bad))\nprint(f\"log.jsonl: {len(logs)}줄\")\nprint(logs[-1][\"job\"], logs[-1][\"read\"])" },
    ],
    F7: [
      { title: "읽기만 했는데 칸이 늘었다 — 출력 예측", text: "제목을 병합한 작은 회비 장부를 만들고 다시 열어 찍어요. 만드는 앞부분(<code>Workbook()</code> · <code>append</code> · <code>save</code>)은 [[레슨:F8]] 에서 배우니, 다시 연 뒤를 보면 돼요. 돌리기 전에 여섯 줄의 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 병합 칸의 값, 빈 칸의 값, 그리고 <b>마지막 줄의 <code>max_row</code> · <code>max_column</code></b> 이 왜 처음과 다른지 생각해요.", needs: [["ws.merge_cells(\"A1:B1\")", "F7/3", "병합 — 값은 왼쪽 위에만"], ["type(ws[\"B1\"]).__name__", "F7/3", "MergedCell"], ["ws.max_row · ws.max_column", "F7/3", "읽기만 해도 칸이 생겨요"], ["ws.cell(row=4, column=2).value", "F7/1", "번호로 셀 하나"]], predict: true, io: [{ output: "4 2\n회비 장부 None MergedCell\nNone\nNone\n6 4" }], answer: "from openpyxl import Workbook, load_workbook\n\nwb = Workbook()\nws = wb.active\nws[\"A1\"] = \"회비 장부\"\nws.merge_cells(\"A1:B1\")\nws.append([\"이름\", \"금액\"])\nws.append([\"민수\", 5000])\nws.append([\"영희\", None])\nwb.save(\"회비.xlsx\")\n\nws = load_workbook(\"회비.xlsx\").active\nprint(ws.max_row, ws.max_column)\nprint(ws[\"A1\"].value, ws[\"B1\"].value, type(ws[\"B1\"]).__name__)\nprint(ws.cell(row=4, column=2).value)\nprint(ws[\"D6\"].value)\nprint(ws.max_row, ws.max_column)", explain: "<p>1행은 <code>ws[\"A1\"]</code> 에 쓴 제목이에요. <code>append</code> 는 그 아래 2 · 3 · 4행에 붙어서 처음엔 <code>4 2</code>(A1:B4)예요. 병합된 <code>B1</code> 은 <code>MergedCell</code> 이라 값이 <code>None</code>, 값은 왼쪽 위 <code>A1</code> 에만 있어요. <code>B4</code> 는 일부러 <code>None</code> 을 넣은 칸이고, <code>D6</code> 은 표 밖의 빈 칸이라 둘 다 <code>None</code> 이에요.</p><p>마지막 줄이 핵심이에요. <code>ws[\"D6\"].value</code> 를 <b>읽기만</b> 했는데 openpyxl 이 그 칸을 만들어서 <code>max_row</code> 가 6, <code>max_column</code> 이 4(D)로 늘었어요. 그래서 표의 끝은 <code>max_row</code> 대신 값이 있는 줄로 판단해요.</p>" },
      { title: "🏠 9월 케이크만 골라 읽기 — read_only", text: "<code>빵집_매출.xlsx</code> 의 「9월」 시트를 <code>read_only=True</code> 로 열어요. 분류가 「케이크」 인 줄만 <code>날짜 품목 수량개</code> 모양으로 찍고, 마지막에 케이크 매출 합계(단가 × 수량)를 찍어요. 머리줄(1행)로 딕셔너리를 만들어 <code>r[\"분류\"]</code> 처럼 <b>이름으로</b> 꺼내고, 날짜는 <code>datetime</code> 이니 날짜만 찍어요. 다 읽으면 파일을 닫아요.", needs: [["load_workbook(\"빵집_매출.xlsx\", read_only=True)", "F7/4", "읽기만 — 빠르고 가볍게"], ["ws.iter_rows(min_row=2, values_only=True)", "F7/2", "2행부터 값 튜플"], ["dict(zip(header, row))", "F7/2", "머리줄 이름으로 꺼내기"], ["r[\"날짜\"].date()", "F7/1", "datetime → 날짜만"], ["wb.close()", "F7/4", "read_only 는 다 읽고 닫기"]], prep: [SAMPLES_PREP], io: [{ output: "2026-09-04 딸기케이크 4개\n2026-09-11 치즈케이크 3개\n2026-09-16 딸기케이크 2개\n2026-09-23 치즈케이크 1개\n2026-09-28 딸기케이크 4개\n케이크 매출: 346000" }], answer: "from openpyxl import load_workbook\n\nwb = load_workbook(\"빵집_매출.xlsx\", read_only=True)\nws = wb[\"9월\"]\nheader = [c.value for c in ws[1]]\ntotal = 0\nfor row in ws.iter_rows(min_row=2, values_only=True):\n    r = dict(zip(header, row))\n    if r[\"분류\"] != \"케이크\":\n        continue\n    print(r[\"날짜\"].date(), r[\"품목\"], f\"{r['수량']}개\")\n    total += r[\"단가\"] * r[\"수량\"]\nwb.close()\nprint(\"케이크 매출:\", total)" },
      { title: "고치기 — 카드 내역 날짜 찍기", text: "카드사에서 받은 <code>가계부_카드내역.xlsx</code>(시트 「이용내역」)의 이용일 · 가맹점 · 금액을 찍으려는데, 돌리면 <code>AttributeError: 'str' object has no attribute 'date'</code> 가 나요. 엑셀에서 파일을 열어 모양을 보고 고쳐요. ① 1 · 2행은 병합 제목, 3행은 빈 줄, 4행이 머리줄이에요 ② 중간의 빈 줄은 건너뛰어요 ③ 맨 아래 「합계」 줄에서 멈춰요 ④ 날짜 두 칸은 <code>46270</code> 같은 숫자예요. 금액은 아직 글자 그대로 찍어요(숫자로 바꾸는 건 [[레슨:FB3]] 에서).", needs: [["ws.iter_rows(min_row=5, values_only=True)", "F7/2", "머리줄 다음부터"], ["if day is None: continue", "F7/3", "빈 줄 건너뛰기"], ["isinstance(day, (int, float))", "F7/4", "숫자 날짜 가려내기"], ["from_excel(46270)", "F7/4", "숫자 → datetime"], ["day.date()", "F7/1", "날짜만"]], prep: [SAMPLES_PREP], given: "from openpyxl import load_workbook\n\nwb = load_workbook(\"가계부_카드내역.xlsx\")\nws = wb[\"이용내역\"]\nfor day, shop, kind, amount in ws.iter_rows(min_row=2, values_only=True):\n    print(day.date(), shop, amount)", io: [{ output: "2026-09-01 동네마트 32,400원\n2026-09-02 버스·지하철 1,500원\n2026-09-03 김밥천국 8,000원\n2026-09-05 온라인서점 21,600원\n2026-09-08 약국 6,300원\n2026-09-12 동네마트 45,900원\n2026-09-14 영화관 14,000원\n2026-09-17 버스·지하철 1,500원\n2026-09-20 온라인서점 -21,600원\n2026-09-25 통신사 33,000원\n2026-09-28 카페 4,800원\n2026-09-30 동네마트 27,350원" }], answer: "from openpyxl import load_workbook\nfrom openpyxl.utils.datetime import from_excel\n\nwb = load_workbook(\"가계부_카드내역.xlsx\")\nws = wb[\"이용내역\"]\nfor day, shop, kind, amount in ws.iter_rows(min_row=5, values_only=True):\n    if day is None:            # 중간 빈 줄\n        continue\n    if day == \"합계\":           # 맨 아래 합계 줄\n        break\n    if isinstance(day, (int, float)):\n        day = from_excel(day)  # 46270 같은 숫자 날짜\n    print(day.date(), shop, amount)" },
      { title: "머리줄 이름으로 열 글자 찾기", text: "열 순서가 파일마다 다를 수 있어서, 머리줄(1행)에서 이름이 같은 칸을 찾아 <b>열 글자</b>를 돌려주는 <code>find_col(ws, name)</code> 을 만들어요. 없는 이름이면 <code>None</code>. <code>빵집_매출.xlsx</code> 의 「8월」 에서 「수량」 · 「단가」 · 「할인」 을 찾아 찍고, 찾은 수량 열 글자로 범위 글자(예: <code>\"E2:E21\"</code>)를 만들어 <code>ws[범위]</code> 로 수량 합계를 구해요. 끝 줄 번호는 <code>ws.max_row</code> 로 계산해요.", needs: [["ws.cell(row=1, column=col).value", "F7/1", "머리줄 칸 하나씩"], ["get_column_letter(col)", "F7/1", "번호 → 열 글자"], ["ws[f\"{c}2:{c}{ws.max_row}\"]", "F7/2", "범위 — 줄마다 셀 튜플"], ["row[0].value", "F7/2", "한 열 범위는 칸 하나짜리 줄"]], prep: [SAMPLES_PREP], io: [{ output: "수량 → E\n단가 → D\n할인 → None\n범위: E2:E21 20 줄\n8월 수량 합계: 189" }], answer: "from openpyxl import load_workbook\nfrom openpyxl.utils import get_column_letter\n\n\ndef find_col(ws, name):\n    for col in range(1, ws.max_column + 1):\n        if ws.cell(row=1, column=col).value == name:\n            return get_column_letter(col)\n    return None\n\n\nwb = load_workbook(\"빵집_매출.xlsx\")\nws = wb[\"8월\"]\nfor name in [\"수량\", \"단가\", \"할인\"]:\n    print(name, \"→\", find_col(ws, name))\n\nc = find_col(ws, \"수량\")\ncells = ws[f\"{c}2:{c}{ws.max_row}\"]\nprint(\"범위:\", f\"{c}2:{c}{ws.max_row}\", len(cells), \"줄\")\nprint(\"8월 수량 합계:\", sum(row[0].value for row in cells))" },
    ],
    F8: [
      { title: "append 는 어디에 붙나 — 출력 예측", text: "칸에 바로 쓰기와 <code>append</code> 를 섞고, 시트 순서도 바꿔요. 돌리기 전에 출력 일곱 줄을 적어 보고 VS Code 에서 맞혀 보세요. <code>append</code> 가 몇 행에 붙는지, <code>ws.cell(row=1, …)</code> 로 1행에 쓴 뒤의 <code>append</code> 는 어디로 가는지가 핵심이에요.", needs: [["ws[\"C3\"] = \"메모\"", "F8/1", "칸에 바로"], ["ws.append([\"가\", \"나\"])", "F8/1", "맨 아래 다음 줄"], ["ws.cell(row=1, column=1, value=\"제목\")", "F8/1", "번호로 쓰기"], ["wb.move_sheet(\"앞\", offset=-2)", "F8/3", "앞으로 두 칸"]], predict: true, io: [{ output: "5 3\n('제목', None, None)\n(None, None, None)\n(None, None, '메모')\n('가', '나', None)\n('다', None, None)\n['앞', 'Sheet', '뒤']" }], answer: "from openpyxl import Workbook\n\nwb = Workbook()\nws = wb.active\nws[\"C3\"] = \"메모\"\nws.append([\"가\", \"나\"])\nws.cell(row=1, column=1, value=\"제목\")\nws.append([\"다\"])\nprint(ws.max_row, ws.max_column)\nfor row in ws.iter_rows(values_only=True):\n    print(row)\n\nwb.create_sheet(\"뒤\")\nwb.create_sheet(\"앞\")\nwb.move_sheet(\"앞\", offset=-2)\nprint(wb.sheetnames)", explain: "<p><code>append</code> 는 「지금까지 쓴 맨 아래 줄」 다음에 붙어요. <code>C3</code> 에 먼저 썼으니 <code>[\"가\", \"나\"]</code> 는 4행이에요. 그다음 <code>ws.cell(row=1, …)</code> 로 1행에 써도 맨 아래 줄은 여전히 4행이라, <code>[\"다\"]</code> 는 5행에 붙어요. 그래서 <code>5 3</code>, 비어 있는 2행도 <code>(None, None, None)</code> 으로 나와요.</p><p>시트는 <code>Sheet</code> · <code>뒤</code> · <code>앞</code> 순서로 생겼고, <code>앞</code> 을 앞으로 두 칸 옮기면 맨 앞이에요.</p>" },
      { title: "🏠 동아리 회원 명단 만들기 — 앞자리 0 지키기", text: "회원 셋의 이름 · 전화번호 · 가입일 · 회비를 「회원」 시트에 써서 <code>회원.xlsx</code> 로 저장해요. 전화번호는 <code>\"01012345678\"</code> 처럼 앞자리 0 이 살아야 하고, 가입일은 <code>date</code>, 회비는 숫자로 넣어요. 저장한 뒤 <b>다시 열어서</b> 시트 이름, 줄마다 이름 · 전화번호 · 전화번호의 종류 · 가입일 · 회비, 마지막에 회비 합계를 찍어요. 회원은 김하늘(01012345678, 2026-03-02, 20000) · 이도윤(01098765432, 2026-03-09, 20000) · 박서준(01055500123, 2026-09-01, 10000)이에요.", needs: [["wb = Workbook()", "F8/0", "새 통합 문서"], ["ws.title = \"회원\"", "F8/0", "시트 이름"], ["ws.append([...])", "F8/0", "한 줄씩"], ["\"01012345678\"", "F8/2", "앞자리 0 은 글자로"], ["wb.save(\"회원.xlsx\") → load_workbook", "F8/0", "저장하고 다시 열어 확인"]], io: [{ output: "['회원']\n김하늘 01012345678 str 2026-03-02 20000\n이도윤 01098765432 str 2026-03-09 20000\n박서준 01055500123 str 2026-09-01 10000\n회비 합계: 50000" }], answer: "from datetime import date\nfrom openpyxl import Workbook, load_workbook\n\nmembers = [\n    (\"김하늘\", \"01012345678\", date(2026, 3, 2), 20000),\n    (\"이도윤\", \"01098765432\", date(2026, 3, 9), 20000),\n    (\"박서준\", \"01055500123\", date(2026, 9, 1), 10000),\n]\n\nwb = Workbook()\nws = wb.active\nws.title = \"회원\"\nws.append([\"이름\", \"전화번호\", \"가입일\", \"회비\"])\nfor m in members:\n    ws.append(list(m))\nwb.save(\"회원.xlsx\")\n\nwb = load_workbook(\"회원.xlsx\")\nprint(wb.sheetnames)\nws = wb[\"회원\"]\nfor name, phone, joined, fee in ws.iter_rows(min_row=2, values_only=True):\n    print(name, phone, type(phone).__name__, joined.date(), fee)\nrows = ws.iter_rows(min_row=2, values_only=True)\nprint(\"회비 합계:\", sum(row[3] for row in rows))", checks: [{"text": "<code>회원.xlsx</code> 를 엑셀에서 열면 전화번호가 <code>01012345678</code> 로 보여요(앞의 0 이 그대로). 칸 구석에 초록 삼각형이 보여도 괜찮아요"}, {"text": "회비 열을 골랐을 때 엑셀 아래 상태 표시줄에 「합계: 50,000」 이 보여요(숫자로 들어갔다는 뜻)"}] },
      { title: "고치기 — 배송 목록의 빈 시트 · 우편번호 · 날짜", text: "서점 주문 셋으로 배송 목록 <code>배송.xlsx</code> 를 만드는 코드예요. 돌려 보면 문제가 넷이에요. ① 맨 앞에 빈 <code>Sheet</code> 시트가 남아요 ② 우편번호 <code>04001</code> 이 <code>4001</code> 이 됐어요 ③ 주문일이 글자라 엑셀에서 날짜 순 정렬이 안 돼요 ④ 금액이 <code>\"43,000원\"</code> 글자라 엑셀이 더하지 못해요. 넷 다 고쳐서, 다시 열어 찍은 결과가 출력 예와 같게 해요.", needs: [["wb.remove(wb[\"Sheet\"])", "F8/3", "처음 시트 지우기"], ["\"04001\" 그대로", "F8/2", "앞자리 0 은 글자로"], ["date(2026, 9, 3) 그대로", "F8/2", "날짜는 date 로 — 다시 읽으면 datetime"], ["43000 그대로", "F8/2", "금액은 숫자로"]], given: "from datetime import date\nfrom openpyxl import Workbook, load_workbook\n\norders = [\n    (\"A-1001\", \"김하늘\", \"04001\", date(2026, 9, 3), 43000),\n    (\"A-1002\", \"이도윤\", \"13529\", date(2026, 9, 3), 22000),\n    (\"A-1004\", \"최유나\", \"06236\", date(2026, 9, 5), 47800),\n]\n\nwb = Workbook()\nws = wb.create_sheet(\"배송\")\nws.append([\"주문번호\", \"고객\", \"우편번호\", \"주문일\", \"금액\"])\nfor oid, name, zipcode, day, total in orders:\n    ws.append([oid, name, int(zipcode), str(day), f\"{total:,}원\"])\nwb.save(\"배송.xlsx\")\n\nwb = load_workbook(\"배송.xlsx\")\nprint(wb.sheetnames)\nfor row in wb[\"배송\"].iter_rows(min_row=2, values_only=True):\n    print(row)", io: [{ output: "['배송']\n('A-1001', '김하늘', '04001', datetime.datetime(2026, 9, 3, 0, 0), 43000)\n('A-1002', '이도윤', '13529', datetime.datetime(2026, 9, 3, 0, 0), 22000)\n('A-1004', '최유나', '06236', datetime.datetime(2026, 9, 5, 0, 0), 47800)" }], answer: "from datetime import date\nfrom openpyxl import Workbook, load_workbook\n\norders = [\n    (\"A-1001\", \"김하늘\", \"04001\", date(2026, 9, 3), 43000),\n    (\"A-1002\", \"이도윤\", \"13529\", date(2026, 9, 3), 22000),\n    (\"A-1004\", \"최유나\", \"06236\", date(2026, 9, 5), 47800),\n]\n\nwb = Workbook()\nws = wb.create_sheet(\"배송\")\nwb.remove(wb[\"Sheet\"])            # 처음 있던 빈 시트 지우기\nws.append([\"주문번호\", \"고객\", \"우편번호\", \"주문일\", \"금액\"])\nfor oid, name, zipcode, day, total in orders:\n    ws.append([oid, name, zipcode, day, total])   # 우편번호는 글자, 날짜 · 금액은 그 종류 그대로\nwb.save(\"배송.xlsx\")\n\nwb = load_workbook(\"배송.xlsx\")\nprint(wb.sheetnames)\nfor row in wb[\"배송\"].iter_rows(min_row=2, values_only=True):\n    print(row)" },
      { title: "음료만 새 파일로 — 저장 실패도 알려 주기", text: "<code>빵집_매출.xlsx</code> 의 「9월」 에서 분류가 「음료」 인 줄만 골라, 같은 머리줄을 단 새 통합 문서(시트 이름 「음료」)에 옮겨 <code>음료_9월.xlsx</code> 로 저장해요. 저장은 <code>save_safely(wb, path)</code> 함수로 해요 — 저장되면 <code>저장했어요: 파일이름</code> 을 찍고 <code>True</code>, Windows 에서 엑셀이 그 파일을 열고 있어 <code>PermissionError</code> 가 나면 「엑셀에서 닫고 다시 실행하세요」 를 찍고 <code>False</code>. 저장됐을 때만 다시 열어서 시트 이름 · 줄 수 · 앞 세 줄의 날짜 · 품목 · 매출(단가 × 수량)을 찍어요.", needs: [["load_workbook(\"빵집_매출.xlsx\")[\"9월\"]", "F7/0", "읽을 시트"], ["ws.append(list(row))", "F8/0", "고른 줄 옮기기"], ["except PermissionError:", "F8/4", "엑셀이 열고 있을 때"], ["wb.save(path)", "F8/4", "저장"], ["load_workbook(\"음료_9월.xlsx\")", "F8/0", "다시 열어 확인"]], prep: [SAMPLES_PREP], io: [{ output: "저장했어요: 음료_9월.xlsx\n['음료']\n5 줄\n2026-09-02 아메리카노 72000\n2026-09-07 라테 14400\n2026-09-14 아메리카노 8000" }], answer: "from openpyxl import Workbook, load_workbook\n\n\ndef save_safely(wb, path):\n    try:\n        wb.save(path)\n    except PermissionError:\n        print(f\"저장 못 했어요: {path} 를 엑셀에서 닫고 다시 실행하세요\")\n        return False\n    print(\"저장했어요:\", path)\n    return True\n\n\nsrc = load_workbook(\"빵집_매출.xlsx\")[\"9월\"]\nheader = [c.value for c in src[1]]\n\nwb = Workbook()\nws = wb.active\nws.title = \"음료\"\nws.append(header)\nfor row in src.iter_rows(min_row=2, values_only=True):\n    if row[2] == \"음료\":\n        ws.append(list(row))\n\nif save_safely(wb, \"음료_9월.xlsx\"):\n    back = load_workbook(\"음료_9월.xlsx\")\n    print(back.sheetnames)\n    rows = list(back[\"음료\"].iter_rows(min_row=2, values_only=True))\n    print(len(rows), \"줄\")\n    for d, name, kind, price, qty in rows[:3]:\n        print(d.date(), name, price * qty)", checks: [{"text": "<code>음료_9월.xlsx</code> 를 엑셀에서 <b>연 채로</b> 한 번 더 돌리면, 트레이스백 대신 「저장 못 했어요: 음료_9월.xlsx 를 엑셀에서 닫고 다시 실행하세요」 한 줄만 나와요(Windows)"}, {"text": "<code>try</code> / <code>except</code> 를 잠깐 빼고 같은 상태로 돌리면 마지막 줄이 <code>PermissionError: [Errno 13] Permission denied: '음료_9월.xlsx'</code> 예요"}, {"text": "엑셀을 닫고 다시 돌리면 저장되고, 다시 연 파일에 음료 다섯 줄이 있어요"}] },
    ],
    F9: [
      { title: "보통으로 열기 · data_only 로 열기 — 출력 예측", text: "숫자 둘, 수식 하나, 「=」 가 없는 글자 하나를 넣고 두 가지로 다시 열어요. 마지막엔 <code>data_only=True</code> 로 연 것을 그대로 다른 이름으로 저장해 봐요. 돌리기 전에 네 줄의 출력을 적어 보고 VS Code 에서 맞혀 보세요.", needs: [["ws[\"A3\"] = \"=A1+A2\"", "F9/0", "수식은 「=」 로 시작하는 글자"], ["load_workbook(\"계산.xlsx\", data_only=True)", "F9/1", "저장해 둔 값 — openpyxl 파일이면 None"], ["cell.data_type", "F9/0", "'f' 는 수식"], ["data_only 로 연 것을 save", "F9/3", "수식이 사라져요"]], predict: true, io: [{ output: "=A1+A2 A1+A2\n10 None A1+A2\nf s\n10 None" }], answer: "from openpyxl import Workbook, load_workbook\n\nwb = Workbook()\nws = wb.active\nws[\"A1\"] = 10\nws[\"A2\"] = 20\nws[\"A3\"] = \"=A1+A2\"\nws[\"A4\"] = \"A1+A2\"\nwb.save(\"계산.xlsx\")\n\na = load_workbook(\"계산.xlsx\").active\nb = load_workbook(\"계산.xlsx\", data_only=True).active\nprint(a[\"A3\"].value, a[\"A4\"].value)\nprint(b[\"A1\"].value, b[\"A3\"].value, b[\"A4\"].value)\nprint(a[\"A3\"].data_type, a[\"A4\"].data_type)\n\nload_workbook(\"계산.xlsx\", data_only=True).save(\"계산_사본.xlsx\")\nc = load_workbook(\"계산_사본.xlsx\").active\nprint(c[\"A1\"].value, c[\"A3\"].value)", explain: "<p><code>\"=A1+A2\"</code> 는 <code>=</code> 로 시작해서 수식(<code>data_type</code> <code>'f'</code>), <code>\"A1+A2\"</code> 는 그냥 글자(<code>'s'</code>)예요. 보통으로 열면 둘 다 넣은 글자 그대로 나와요.</p><p><code>data_only=True</code> 로 열면 숫자 · 글자 칸은 같지만, 수식 칸은 엑셀이 계산해 둔 값을 찾는데 openpyxl 이 만든 파일에는 그 값이 없어서 <code>None</code> 이에요. 그 상태로 저장한 사본은 A3 에 수식도 값도 없어서, 보통으로 열어도 <code>None</code> 이에요.</p>" },
      { title: "🏠 빵집 7월 시트에 매출 수식 넣기", text: "<code>빵집_매출.xlsx</code> 를 열어 「7월」 시트의 F 열에 매출을 수식으로 넣어요. F1 은 <code>매출</code>, 2행부터 끝 줄까지 <code>=D2*E2</code> 처럼 단가 × 수량, 끝 줄 다음 줄에는 A 열 <code>합계</code> 와 F 열 <code>=SUM(F2:F끝줄)</code>. 끝 줄 번호는 손으로 적지 말고 계산해요. 원본은 두고 <code>7월_매출.xlsx</code> 로 저장한 뒤, 다시 열어 시트 이름 · F1 · F2 · F21 · A22 · F22 를 찍고, 같은 합계를 파이썬으로 계산해 찍어요.", needs: [["last = ws.max_row", "F9/0", "끝 줄 번호 계산"], ["ws[f\"F{r}\"] = f\"=D{r}*E{r}\"", "F9/0", "줄마다 수식 글자"], ["f\"=SUM(F2:F{last})\"", "F9/0", "합계 수식"], ["wb.save(\"7월_매출.xlsx\")", "F8/1", "있는 파일을 고쳐 다른 이름으로"], ["ws.iter_rows(min_col=4, max_col=5, values_only=True)", "F7/2", "파이썬으로 같은 합계"]], prep: [SAMPLES_PREP], io: [{ output: "['7월', '8월', '9월']\nF1 매출\nF2 =D2*E2\nF21 =D21*E21\nA22 합계\nF22 =SUM(F2:F21)\n파이썬 합계: 957400" }], answer: "from openpyxl import load_workbook\n\nwb = load_workbook(\"빵집_매출.xlsx\")\nws = wb[\"7월\"]\nlast = ws.max_row                       # 데이터 마지막 줄(21)\n\nws[\"F1\"] = \"매출\"\nfor r in range(2, last + 1):\n    ws[f\"F{r}\"] = f\"=D{r}*E{r}\"\nws[f\"A{last + 1}\"] = \"합계\"\nws[f\"F{last + 1}\"] = f\"=SUM(F2:F{last})\"\nwb.save(\"7월_매출.xlsx\")                 # 원본은 두고 다른 이름으로\n\n# 다시 열어 확인 — 수식 글자 + 파이썬 계산\nwb = load_workbook(\"7월_매출.xlsx\")\nws = wb[\"7월\"]\nprint(wb.sheetnames)\nfor addr in [\"F1\", \"F2\", \"F21\", \"A22\", \"F22\"]:\n    print(addr, ws[addr].value)\ntotal = sum(price * qty for price, qty in ws.iter_rows(min_row=2, max_row=last, min_col=4, max_col=5, values_only=True))\nprint(\"파이썬 합계:\", total)", checks: [{"text": "<code>7월_매출.xlsx</code> 를 엑셀에서 열면 F 열에 매출이, F22 에 출력의 「파이썬 합계」 와 같은 <code>957400</code> 이 보여요"}, {"text": "F22 칸을 누르면 수식 입력줄에 <code>=SUM(F2:F21)</code> 이 보여요"}] },
      { title: "고치기 — 합계가 None, 수식도 사라졌어요", text: "작은 매출 보고서를 만들고(1번 부분), 2번 부분에서 지금 합계를 찍은 뒤 라테 매출을 <code>19200</code> 으로 고쳐 저장해요. 그런데 합계가 <code>None</code> 으로 찍히고, 저장한 파일의 B4 수식까지 사라졌어요. 1번 부분은 그대로 두고 2번 부분을 고쳐요: 고쳐서 저장할 파일은 <b>보통으로</b> 열고, 합계는 B2 · B3 값을 파이썬으로 더해서 찍어요. 저장한 뒤 다시 열어 B4 수식이 살아 있는지, 고친 뒤 합계가 얼마인지 찍어요.", needs: [["load_workbook(\"보고서.xlsx\")", "F9/3", "고칠 땐 보통으로 열기"], ["data_only=True 의 None", "F9/1", "openpyxl 은 계산하지 않아요"], ["sum(ws[f\"B{r}\"].value for r in range(2, 4))", "F9/2", "② 값은 파이썬이 계산"], ["ws[\"B4\"].value", "F9/0", "다시 읽으면 수식 글자"]], given: "from openpyxl import Workbook, load_workbook\n\n# 1) 보고서 만들기 — 이 부분은 고치지 않아요\nwb = Workbook()\nws = wb.active\nws.append([\"품목\", \"매출\"])\nws.append([\"소금빵\", 25600])\nws.append([\"라테\", 14400])\nws[\"A4\"] = \"합계\"\nws[\"B4\"] = \"=SUM(B2:B3)\"\nwb.save(\"보고서.xlsx\")\n\n# 2) 합계를 찍고, 라테 매출을 고쳐 다시 저장\nwb = load_workbook(\"보고서.xlsx\", data_only=True)\nws = wb.active\nprint(\"고치기 전 합계:\", ws[\"B4\"].value)\nws[\"B3\"] = 19200\nwb.save(\"보고서.xlsx\")\n\nws = load_workbook(\"보고서.xlsx\").active\nprint(\"B4:\", ws[\"B4\"].value)", io: [{ output: "고치기 전 합계: 40000\nB4: =SUM(B2:B3)\n고친 뒤 합계: 44800" }], answer: "from openpyxl import Workbook, load_workbook\n\n# 1) 보고서 만들기 — 이 부분은 고치지 않아요\nwb = Workbook()\nws = wb.active\nws.append([\"품목\", \"매출\"])\nws.append([\"소금빵\", 25600])\nws.append([\"라테\", 14400])\nws[\"A4\"] = \"합계\"\nws[\"B4\"] = \"=SUM(B2:B3)\"\nwb.save(\"보고서.xlsx\")\n\n# 2) 고칠 거라 보통으로 열고, 합계는 파이썬이 계산\nwb = load_workbook(\"보고서.xlsx\")\nws = wb.active\ntotal = sum(ws[f\"B{r}\"].value for r in [2, 3])\nprint(\"고치기 전 합계:\", total)\nws[\"B3\"] = 19200\nwb.save(\"보고서.xlsx\")\n\nws = load_workbook(\"보고서.xlsx\").active\nprint(\"B4:\", ws[\"B4\"].value)\ntotal = sum(ws[f\"B{r}\"].value for r in [2, 3])\nprint(\"고친 뒤 합계:\", total)" },
      { title: "엑셀에서 한 번 저장하면 — 값이 보이는지", text: "해결 ③을 직접 해 봐요. 처음 돌리면 <code>엑셀확인.xlsx</code> 가 없으니 수식이 든 파일(D2:D4 는 <code>=B2*C2</code> …, D5 는 <code>=SUM(D2:D4)</code>)을 만들고 안내를 찍어요. 파일이 있으면 만들지 않아요(<code>Path(\"엑셀확인.xlsx\").exists()</code> — <a href=\"../python/#lesson/L17C\" target=\"_blank\" rel=\"noopener\">파이썬 교과서 「JSON 으로 저장하기」 ↗</a> 에서 본 그 모양). 그다음 <code>data_only=True</code> 로 열어 D2 ~ D5 의 값을 찍고, 같은 값을 파이썬으로 계산해 찍어요. 처음 돌리면 <code>None</code> 넷이 나와요(출력 예). 이제 엑셀에서 파일을 열고 저장한 뒤 <b>다시</b> 돌려 봐요.", needs: [["f\"=B{r}*C{r}\"", "F9/0", "줄마다 수식"], ["load_workbook(path, data_only=True)", "F9/1", "계산해 둔 값 읽기"], ["data_only=True 로 다시 실행", "F9/2", "③ 엑셀에서 저장한 뒤엔 값이 보여요"]], io: [{ output: "만들었어요: 엑셀확인.xlsx — 엑셀에서 열고 저장한 뒤 다시 실행하세요\nD2 None\nD3 None\nD4 None\nD5 None\n파이썬 계산: [25600, 14400, 54000] 94000" }], answer: "from pathlib import Path\nfrom openpyxl import Workbook, load_workbook\n\npath = Path(\"엑셀확인.xlsx\")\nsales = [(\"소금빵\", 3200, 8), (\"라테\", 4800, 3), (\"식빵\", 4500, 12)]\n\nif not path.exists():\n    wb = Workbook()\n    ws = wb.active\n    ws.append([\"품목\", \"단가\", \"수량\", \"매출\"])\n    for r, row in enumerate(sales, start=2):\n        ws.append(list(row) + [f\"=B{r}*C{r}\"])\n    ws[\"D5\"] = \"=SUM(D2:D4)\"\n    wb.save(path)\n    print(\"만들었어요:\", path.name, \"— 엑셀에서 열고 저장한 뒤 다시 실행하세요\")\n\nws = load_workbook(path, data_only=True).active\nfor r in range(2, 6):\n    print(f\"D{r}\", ws[f\"D{r}\"].value)\nprint(\"파이썬 계산:\", [p * q for _, p, q in sales], sum(p * q for _, p, q in sales))", checks: [{"text": "엑셀(또는 LibreOffice Calc)에서 <code>엑셀확인.xlsx</code> 를 열면 D 열에 <code>25600</code> · <code>14400</code> · <code>54000</code>, D5 에 <code>94000</code> 이 보여요"}, {"text": "엑셀에서 저장하고 닫은 뒤 다시 돌리면, 「만들었어요」 줄 없이 D2 ~ D5 에 <code>None</code> 대신 파이썬 계산과 같은 숫자가 찍혀요(LibreOffice 는 저장할 때 xlsx 형식 유지를 골라요)"}, {"text": "<code>엑셀확인.xlsx</code> 를 지우고 다시 돌리면 처음처럼 <code>None</code> 이 나와요 — openpyxl 이 새로 만든 파일이라서"}] },
    ],
    F10: [
      { title: "보이는 모양과 값 — 출력 예측", text: "<p>네 칸에 값과 숫자 모양을 넣고 저장했다가 다시 읽어요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 엑셀 화면에는 칸마다 무엇이 보일지도 같이 생각해 봐요.</p>", needs: [["c.number_format = \"0.0%\"", "F10/1", "값은 그대로, 모양만"], ["f\"{n:,}원\"", "F10/1", "이렇게 만든 건 글자"], ["for c in ws[\"A\"]:", "F10/1", "열 하나의 칸들"]], io: [{ output: "A1 0.257 0.0%\nA2 1234500 #,##0\"원\"\nA3 '1,234,500원' General\nA4 25.7 0.0%\n3 1234525.957" }], answer: "from openpyxl import Workbook, load_workbook\n\nwb = Workbook()\nws = wb.active\nws[\"A1\"] = 0.257\nws[\"A1\"].number_format = \"0.0%\"\nws[\"A2\"] = 1234500\nws[\"A2\"].number_format = '#,##0\"원\"'\nws[\"A3\"] = f\"{1234500:,}원\"\nws[\"A4\"] = 25.7\nws[\"A4\"].number_format = \"0.0%\"\nwb.save(\"모양.xlsx\")\n\nws = load_workbook(\"모양.xlsx\").active\nfor c in ws[\"A\"]:\n    print(c.coordinate, repr(c.value), c.number_format)\nnums = [c.value for c in ws[\"A\"] if isinstance(c.value, (int, float))]\ntotal = sum(nums)\nprint(len(nums), round(total, 3))", predict: true, explain: "<p><code>number_format</code> 은 모양만 정해서, 다시 읽은 값은 넣은 그대로예요(<code>0.257</code> · <code>1234500</code>). 엑셀에는 <b>25.7%</b> · <b>1,234,500원</b> 으로 보여요.</p><p>A3 은 <code>f\"{1234500:,}원\"</code> 으로 만든 <b>글자</b>라 모양이 <code>General</code>(정하지 않음)이고, 엑셀에서도 왼쪽에 붙은 글자예요. 그래서 숫자만 모으면 빠져서 3개예요. A4 는 25.7 에 <code>\"0.0%\"</code> 를 줘서 엑셀에 <b>2570.0%</b> 로 보여요. 비율은 0.257 처럼 넣어야 해요. 합은 0.257 + 1234500 + 25.7 = <code>1234525.957</code> 이에요.</p>" },
      { title: "🏠 빵집 9월 시트 꾸미기", text: "<p><code>빵집_매출.xlsx</code>(아래 준비 파일로 만들어요)의 「9월」 시트를 사장님이 보기 좋게 꾸며서 <code>9월_꾸밈.xlsx</code> 로 저장하세요.</p><ul><li>F 열에 머리줄 <code>매출</code> 과, 줄마다 <code>단가 × 수량</code> 값(파이썬이 계산한 숫자)을 넣어요</li><li>머리줄: 굵은 흰 글씨, 파란 바탕 <code>4472C4</code>, 가운데 맞춤</li><li>머리줄을 뺀 날짜(A 열)는 <code>mm-dd</code>, 단가 · 매출(D · F 열)은 <code>#,##0</code></li><li>열 너비 A~F 는 <code>10 · 14 · 8 · 10 · 8 · 12</code>, 머리줄 틀 고정, 필터 단추</li></ul><p>저장한 뒤 다시 열어 출력 예처럼 확인을 찍어요.</p>", needs: [["c.font = Font(bold=True, color=\"FFFFFF\")", "F10/0", "굵게 · 글자색"], ["c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")", "F10/0", "칠하기 — \"solid\" 꼭"], ["c.alignment = Alignment(horizontal=\"center\")", "F10/0", "가운데 맞춤"], ["for c in ws[\"A\"][1:]:  c.number_format = \"mm-dd\"", "F10/1", "머리줄 빼고 열 전체에 모양"], ["ws.column_dimensions[\"A\"].width = 10", "F10/2", "열 너비"], ["ws.freeze_panes = \"A2\"", "F10/2", "머리줄 고정"], ["ws.auto_filter.ref = ws.dimensions", "F10/2", "필터 단추"], ["load_workbook(\"9월_꾸밈.xlsx\")[\"9월\"]", "F10/4", "다시 열어 서식 찍기"]], prep: [SAMPLES_PREP], io: [{ output: "머리줄: ['날짜', '품목', '분류', '단가', '수량', '매출']\n굵게: True | 글자색: 00FFFFFF | 칠: 004472C4 | 맞춤: center\nA2: 2026-09-01 mm-dd\nF2: 41800 #,##0\n너비: [10.0, 14.0, 8.0, 10.0, 8.0, 12.0]\n틀 고정: A2 | 필터: A1:F21" }], answer: "from openpyxl import load_workbook\nfrom openpyxl.styles import Font, PatternFill, Alignment\n\nwb = load_workbook(\"빵집_매출.xlsx\")\nws = wb[\"9월\"]\nws[\"F1\"] = \"매출\"\nfor r in range(2, ws.max_row + 1):\n    price = ws.cell(row=r, column=4).value\n    qty = ws.cell(row=r, column=5).value\n    ws.cell(row=r, column=6, value=price * qty)\n\nfor c in ws[1]:\n    c.font = Font(bold=True, color=\"FFFFFF\")\n    c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")\n    c.alignment = Alignment(horizontal=\"center\")\nfor c in ws[\"A\"][1:]:\n    c.number_format = \"mm-dd\"\nfor col in [\"D\", \"F\"]:\n    for c in ws[col][1:]:\n        c.number_format = \"#,##0\"\nfor col, w in {\"A\": 10, \"B\": 14, \"C\": 8, \"D\": 10, \"E\": 8, \"F\": 12}.items():\n    ws.column_dimensions[col].width = w\nws.freeze_panes = \"A2\"\nws.auto_filter.ref = ws.dimensions\nwb.save(\"9월_꾸밈.xlsx\")\n\nws = load_workbook(\"9월_꾸밈.xlsx\")[\"9월\"]\nh = ws[\"A1\"]\nprint(\"머리줄:\", [c.value for c in ws[1]])\nprint(\"굵게:\", h.font.b, \"| 글자색:\", h.font.color.rgb, \"| 칠:\", h.fill.fgColor.rgb, \"| 맞춤:\", h.alignment.horizontal)\nprint(\"A2:\", ws[\"A2\"].value.date(), ws[\"A2\"].number_format)\nprint(\"F2:\", ws[\"F2\"].value, ws[\"F2\"].number_format)\nprint(\"너비:\", [ws.column_dimensions[c].width for c in \"ABCDEF\"])\nprint(\"틀 고정:\", ws.freeze_panes, \"| 필터:\", ws.auto_filter.ref)", checks: [{"text": "엑셀(또는 LibreOffice Calc)에서 <code>9월_꾸밈.xlsx</code> 를 열면 「9월」 시트 머리줄이 파란 바탕에 흰 굵은 글씨예요"}, {"text": "아래로 스크롤해도 머리줄이 붙어 있고, 머리줄 칸마다 ▼ 필터 단추가 있어요"}, {"text": "A2 가 <code>09-01</code>, F2 가 <code>41,800</code> 으로 보여요(수식 입력줄에는 41800)"}] },
      { title: "에러 읽기 — Style objects are immutable", text: "<p>모임 회비 장부예요. 머리줄을 굵게 하고, 회비가 0 인 사람의 이름 칸을 연분홍 <code>FFC7CE</code> 로 칠하려고 했어요. 돌리면 이렇게 멈춰요.</p><pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\main.py\", line 12, in &lt;module&gt;\n    c.font.bold = True\n    ^^^^^^^^^^^\n  …(openpyxl 안쪽 줄은 줄였어요)…\nAttributeError: Style objects are immutable and cannot be changed.Reassign the style with a copy</pre><p>먼저 말해 보세요. <b>몇 번째 줄</b>에서, <b>무슨 에러</b>가, <b>왜</b> 났나요? 그 줄을 고치면 에러는 없어지는데, 확인 코드가 찍는 걸 보면 지우 칸이 아직 <b>안 칠해져</b> 있어요(엑셀에서 열어도 흰색). 그것까지 고쳐서 출력 예처럼 나오게 하세요.</p>", needs: [["c.font = Font(bold=True)", "F10/0", "서식은 새로 만들어 통째로"], ["PatternFill(\"solid\", fgColor=\"FFC7CE\")", "F10/0", "\"solid\" 가 없으면 fill_type 이 None"], ["c.fill.fill_type · c.fill.fgColor.rgb", "F10/4", "다시 읽어 칠 확인"]], given: "from openpyxl import Workbook, load_workbook\nfrom openpyxl.styles import Font, PatternFill\n\nwb = Workbook()\nws = wb.active\nws.append([\"이름\", \"회비\"])\nws.append([\"민수\", 30000])\nws.append([\"지우\", 0])\nws.append([\"하늘\", 30000])\n\nfor c in ws[1]:\n    c.font.bold = True\nfor row in ws.iter_rows(min_row=2):\n    if row[1].value == 0:\n        row[0].fill = PatternFill(fgColor=\"FFC7CE\")\nwb.save(\"회비.xlsx\")\n\nws = load_workbook(\"회비.xlsx\").active\nprint(\"머리줄 굵게:\", [c.font.b for c in ws[1]])\nfor row in ws.iter_rows(min_row=2):\n    print(row[0].value, row[0].fill.fill_type, row[0].fill.fgColor.rgb)", io: [{ output: "머리줄 굵게: [True, True]\n민수 None 00000000\n지우 solid 00FFC7CE\n하늘 None 00000000" }], answer: "from openpyxl import Workbook, load_workbook\nfrom openpyxl.styles import Font, PatternFill\n\nwb = Workbook()\nws = wb.active\nws.append([\"이름\", \"회비\"])\nws.append([\"민수\", 30000])\nws.append([\"지우\", 0])\nws.append([\"하늘\", 30000])\n\nfor c in ws[1]:\n    c.font = Font(bold=True)\nfor row in ws.iter_rows(min_row=2):\n    if row[1].value == 0:\n        row[0].fill = PatternFill(\"solid\", fgColor=\"FFC7CE\")\nwb.save(\"회비.xlsx\")\n\nws = load_workbook(\"회비.xlsx\").active\nprint(\"머리줄 굵게:\", [c.font.b for c in ws[1]])\nfor row in ws.iter_rows(min_row=2):\n    print(row[0].value, row[0].fill.fill_type, row[0].fill.fgColor.rgb)" },
      { title: "🏠 한 주 걸음 수 — 막대 차트", text: "<p>휴대폰 앱에서 옮겨 적은 한 주 걸음 수예요. <code>걸음.xlsx</code> 의 「걸음」 시트에 <code>요일 · 걸음 수</code> 표를 쓰세요.</p><pre>steps = [(\"월\", 6240), (\"화\", 8120), (\"수\", 4310), (\"목\", 10050),\n         (\"금\", 7480), (\"토\", 12900), (\"일\", 3020)]</pre><ul><li>머리줄은 굵게 + 연두 바탕 <code>E2EFDA</code>, 걸음 수는 <code>#,##0</code></li><li>D2 에 막대 차트: 제목 <code>이번 주 걸음 수</code>, 세로축 이름 <code>걸음</code>, 막대 이름은 요일, 범례는 머리줄의 <code>걸음 수</code></li></ul><p>저장한 뒤 다시 열어 요일 · 모양 · 합계 · 하루 평균(반올림한 정수) · 1만 걸음을 넘긴 요일을 찍고, zip 목록으로 차트가 들어 있는지 찍으세요.</p>", needs: [["chart = BarChart()  chart.title = \"…\"", "F10/3", "막대 차트 만들기"], ["Reference(ws, min_col=2, min_row=1, max_row=8)", "F10/3", "데이터는 머리줄부터"], ["chart.add_data(data, titles_from_data=True)", "F10/3", "첫 칸이 범례 이름"], ["chart.set_categories(cats)", "F10/3", "막대 이름은 2행부터"], ["ws.add_chart(chart, \"D2\")", "F10/3", "차트 놓을 자리"], ["zipfile.ZipFile(p).namelist()", "F10/4", "차트 파일이 들어 있나"]], io: [{ output: "요일: 월 화 수 목 금 토 일\n모양: #,##0 | 칠: 00E2EFDA\n합계 52,120걸음 · 하루 평균 7,446걸음\n1만 걸음 넘은 날: 목 토\n차트 들어 있음: True" }], answer: "import zipfile\nfrom openpyxl import Workbook, load_workbook\nfrom openpyxl.styles import Font, PatternFill\nfrom openpyxl.chart import BarChart, Reference\n\nsteps = [(\"월\", 6240), (\"화\", 8120), (\"수\", 4310), (\"목\", 10050),\n         (\"금\", 7480), (\"토\", 12900), (\"일\", 3020)]\n\nwb = Workbook()\nws = wb.active\nws.title = \"걸음\"\nws.append([\"요일\", \"걸음 수\"])\nfor row in steps:\n    ws.append(row)\nfor c in ws[1]:\n    c.font = Font(bold=True)\n    c.fill = PatternFill(\"solid\", fgColor=\"E2EFDA\")\nfor c in ws[\"B\"][1:]:\n    c.number_format = \"#,##0\"\n\nchart = BarChart()\nchart.title = \"이번 주 걸음 수\"\nchart.y_axis.title = \"걸음\"\ndata = Reference(ws, min_col=2, min_row=1, max_row=8)\ncats = Reference(ws, min_col=1, min_row=2, max_row=8)\nchart.add_data(data, titles_from_data=True)\nchart.set_categories(cats)\nws.add_chart(chart, \"D2\")\nwb.save(\"걸음.xlsx\")\n\nws = load_workbook(\"걸음.xlsx\")[\"걸음\"]\ndays = [c.value for c in ws[\"A\"][1:]]\nnums = [c.value for c in ws[\"B\"][1:]]\nprint(\"요일:\", \" \".join(days))\nprint(\"모양:\", ws[\"B2\"].number_format, \"| 칠:\", ws[\"A1\"].fill.fgColor.rgb)\ntotal = sum(nums)\navg = round(total / len(nums))\nprint(f\"합계 {total:,}걸음 · 하루 평균 {avg:,}걸음\")\nbig = [d for d, n in zip(days, nums) if n >= 10000]\nprint(\"1만 걸음 넘은 날:\", \" \".join(big))\nwith zipfile.ZipFile(\"걸음.xlsx\") as z:\n    print(\"차트 들어 있음:\", \"xl/charts/chart1.xml\" in z.namelist())", checks: [{"text": "엑셀에서 <code>걸음.xlsx</code> 를 열면 D2 근처에 막대 7개(월~일)가 있어요"}, {"text": "토요일 막대가 가장 높고 일요일 막대가 가장 낮아요"}, {"text": "차트 위에 「이번 주 걸음 수」, 범례에 「걸음 수」 가 보여요"}] },
    ],
    F11: [
      { title: "시트 끼우기와 돌기 — 출력 예측", text: "<p>시트 넷을 만들고, 그중 「요약」 을 맨 앞에 끼워요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 처음 보이는 시트(<code>wb.active</code>)가 무엇일지, <code>for ws in wb</code> 가 어떤 순서로 도는지 생각해 봐요.</p>", needs: [["wb.create_sheet(\"요약\", 0)", "F11/3", "0 = 맨 앞 자리"], ["wb.active", "F11/3", "「몇 번째 시트」 로 기억"], ["for ws in wb:", "F11/0", "sheetnames 순서로 돌기"], ["ws.title.endswith(\"월\")", "F11/0", "메모 시트 거르기"]], io: [{ output: "['요약', '7월', '8월', '메모']\n요약\n7월 2 줄 116800\n8월 1 줄 54000" }], answer: "from openpyxl import Workbook\n\nwb = Workbook()\nwb.active.title = \"7월\"\nwb.create_sheet(\"8월\")\nwb.create_sheet(\"메모\")\nwb.create_sheet(\"요약\", 0)\nprint(wb.sheetnames)\nprint(wb.active.title)\n\nwb[\"7월\"].append([\"품목\", \"매출\"])\nwb[\"7월\"].append([\"소금빵\", 25600])\nwb[\"7월\"].append([\"라테\", 91200])\nwb[\"8월\"].append([\"품목\", \"매출\"])\nwb[\"8월\"].append([\"식빵\", 54000])\nfor ws in wb:\n    if not ws.title.endswith(\"월\"):\n        continue\n    total = sum(r[1] for r in ws.iter_rows(min_row=2, values_only=True))\n    print(ws.title, ws.max_row - 1, \"줄\", total)", predict: true, explain: "<p><code>create_sheet(\"요약\", 0)</code> 은 맨 앞 자리에 끼워서 순서가 <code>['요약', '7월', '8월', '메모']</code> 가 돼요. <code>wb.active</code> 는 시트를 「0번째」 로 기억하고 있어서, 맨 앞에 끼우면 처음 보이는 시트가 <b>요약</b>으로 바뀌어요(처음엔 7월이었어요).</p><p><code>for ws in wb</code> 는 이 순서로 돌지만 「요약」 · 「메모」 는 「월」 로 끝나지 않아서 건너뛰어요. 7월은 2줄(25600 + 91200 = 116800), 8월은 1줄(54000)이에요.</p>" },
      { title: "🏠 세 지점 9월 매출을 한 파일로", text: "<p><code>지점</code> 폴더에 강남 · 홍대 · 판교의 9월 매출 파일이 있어요(아래 첫 준비 파일로 만들어요). 판교만 열 순서가 달라요. 그리고 누가 엑셀로 강남 파일을 열어 둔 채라 잠금 파일 <code>~$강남.xlsx</code> 도 있어요(두 번째 준비 파일이 흉내 내요).</p><ul><li>폴더의 <code>.xlsx</code> 를 이름 순서로 돌며, <code>~$</code> 파일은 <code>건너뜀: ~$강남.xlsx</code> 를 찍고 건너뛰어요</li><li>머리줄 이름으로 <code>날짜 · 품목 · 분류 · 단가 · 수량</code> 순서에 맞추고, 맨 앞에 출처(확장자를 뺀 파일 이름)를 붙여요</li><li>파일마다 <code>강남: 6줄 351,200원</code> 처럼 줄 수와 매출(단가 × 수량 합)을 찍어요</li><li><code>9월_전지점.xlsx</code> 에 「전체」 시트(출처 + 다섯 열)와, 맨 앞에 「요약」 시트(<code>출처 · 줄 수 · 매출</code> 머리줄, 지점마다 한 줄, 마지막에 <code>합계</code> 줄)를 써요</li></ul><p>저장한 뒤 다시 열어 시트 순서, 요약 시트의 줄들, 전체 시트에서 판교의 첫 줄을 찍으세요.</p>", needs: [["for p in sorted(Path(\"지점\").glob(\"*.xlsx\")):", "F11/1", "폴더의 엑셀을 이름 순서로"], ["if p.name.startswith(\"~$\"): continue", "F11/1", "잠금 파일 건너뛰기"], ["[rec.get(c) for c in COLUMNS]", "F11/2", "머리줄 이름으로 열 맞추기"], ["ws.append([\"출처\"] + COLUMNS)", "F11/3", "맨 앞에 출처 열"], ["out.create_sheet(\"요약\", 0)", "F11/3", "요약 시트를 맨 앞에"]], prep: [SAMPLES_PREP, {"name": "지점/~$강남.xlsx", "text": "이 파일은 진짜 엑셀이 아니에요. 엑셀이 강남.xlsx 를 열고 있을 때 생기는 잠금 파일 ~$강남.xlsx 를 흉내 낸 거예요.\n"}], io: [{ output: "건너뜀: ~$강남.xlsx\n강남: 6줄 351,200원\n판교: 6줄 304,500원\n홍대: 6줄 357,000원\n['요약', '전체']\n('출처', '줄 수', '매출')\n('강남', 6, 351200)\n('판교', 6, 304500)\n('홍대', 6, 357000)\n('합계', 18, 1012700)\n판교 첫 줄: 판교 2026-09-04 딸기케이크 케이크 32000 4" }], answer: "from pathlib import Path\nfrom openpyxl import Workbook, load_workbook\n\nCOLUMNS = [\"날짜\", \"품목\", \"분류\", \"단가\", \"수량\"]\n\n\ndef read_table(ws, source):\n    it = ws.iter_rows(values_only=True)\n    header = [str(h).strip() for h in next(it)]\n    missing = [c for c in COLUMNS if c not in header]\n    if missing:\n        print(f\"경고: {source} 파일에 {', '.join(missing)} 열이 없어요\")\n    out = []\n    for row in it:\n        rec = dict(zip(header, row))\n        out.append([source] + [rec.get(c) for c in COLUMNS])\n    return out\n\n\nall_rows = []\nsummary = []\nfor p in sorted(Path(\"지점\").glob(\"*.xlsx\")):\n    if p.name.startswith(\"~$\"):\n        print(\"건너뜀:\", p.name)\n        continue\n    rows = read_table(load_workbook(p).active, p.stem)\n    total = sum(r[4] * r[5] for r in rows)\n    print(f\"{p.stem}: {len(rows)}줄 {total:,}원\")\n    all_rows += rows\n    summary.append([p.stem, len(rows), total])\n\nout = Workbook()\nws = out.active\nws.title = \"전체\"\nws.append([\"출처\"] + COLUMNS)\nfor r in all_rows:\n    ws.append(r)\ns = out.create_sheet(\"요약\", 0)\ns.append([\"출처\", \"줄 수\", \"매출\"])\nfor r in summary:\n    s.append(r)\ns.append([\"합계\", len(all_rows), sum(r[2] for r in summary)])\nout.save(\"9월_전지점.xlsx\")\n\nwb = load_workbook(\"9월_전지점.xlsx\")\nprint(wb.sheetnames)\nfor row in wb[\"요약\"].iter_rows(values_only=True):\n    print(row)\nfor row in wb[\"전체\"].iter_rows(min_row=2, values_only=True):\n    if row[0] == \"판교\":\n        print(\"판교 첫 줄:\", row[0], row[1].date(), *row[2:])\n        break", checks: [{"text": "엑셀에서 <code>9월_전지점.xlsx</code> 를 열면 「요약」 시트가 먼저 보여요"}, {"text": "「전체」 시트에서 판교 줄들도 날짜 · 품목 · 분류 · 단가 · 수량 칸에 맞는 값이 들어 있어요"}] },
      { title: "에러 읽기 — 판교에서 TypeError", text: "<p>지점 파일마다 매출 합계를 찍으려고 했어요(아래 준비 파일). 강남은 잘 나오는데 그다음에 이렇게 멈춰요.</p><pre>Traceback (most recent call last):\n  File \"C:\\Users\\me\\files-study\\main.py\", line 8, in &lt;module&gt;\n    total += row[3] * row[4]\nTypeError: unsupported operand type(s) for +=: 'int' and 'str'</pre><p>먼저 말해 보세요. <b>몇 번째 줄</b>에서, <b>무슨 에러</b>가, <b>왜</b> 났나요? 멈춘 파일의 머리줄을 찍어 보면(<code>print(next(ws.iter_rows(values_only=True)))</code>) 실마리가 보여요. 판교에서 <code>row[3] * row[4]</code> 는 무엇과 무엇을 곱할까요? 열 순서와 상관없이 맞게 나오도록 고치세요.</p>", needs: [["dict(zip(header, row))", "F11/0", "줄을 머리줄 이름표로"], ["header = next(it)", "F11/0", "첫 줄 꺼내기"], ["rec.get(c)", "F11/2", "자리 대신 이름으로"]], given: "from pathlib import Path\nfrom openpyxl import load_workbook\n\nfor p in sorted(Path(\"지점\").glob(\"*.xlsx\")):\n    ws = load_workbook(p).active\n    total = 0\n    for row in ws.iter_rows(min_row=2, values_only=True):\n        total += row[3] * row[4]\n    print(f\"{p.stem}: {total:,}원\")", prep: [SAMPLES_PREP], io: [{ output: "강남: 351,200원\n판교: 304,500원\n홍대: 357,000원" }], answer: "from pathlib import Path\nfrom openpyxl import load_workbook\n\nfor p in sorted(Path(\"지점\").glob(\"*.xlsx\")):\n    if p.name.startswith(\"~$\"):\n        continue\n    ws = load_workbook(p).active\n    it = ws.iter_rows(values_only=True)\n    header = next(it)\n    total = 0\n    for row in it:\n        rec = dict(zip(header, row))\n        total += rec[\"단가\"] * rec[\"수량\"]\n    print(f\"{p.stem}: {total:,}원\")" },
      { title: "새 지점 분당 — 빠진 열 경고 · 분류 채우기", text: "<p>새로 연 분당 지점이 보낸 파일에는 <code>분류</code> 열이 없어요. 아래 두 번째 준비 파일 <code>add_bundang.py</code> 를 한 번 실행하면 <code>지점/분당.xlsx</code> 가 생겨요. 네 지점을 다 합쳐 <b>분류별 매출</b>을 구하세요.</p><ul><li>빠진 열이 있으면 <code>경고: 분당 파일에 분류 열이 없어요</code> 를 찍고 계속해요</li><li>다 읽은 뒤, 분류가 있는 줄들로 <code>품목 → 분류</code> 표를 만들어 분류가 빈 줄을 채워요. 표에도 없는 품목은 <code>미정</code> 으로 두고 <code>경고: 분당 마들렌 의 분류를 몰라서 미정</code> 을 찍어요</li><li>분류별 매출(단가 × 수량)을 큰 것부터 <code>케이크 467,500원</code> 처럼 찍고, 마지막에 <code>모두 22줄 1,169,100원</code> 처럼 줄 수와 합계를 찍어요</li></ul>", needs: [["missing = [c for c in COLUMNS if c not in header]", "F11/2", "빠진 열 찾기"], ["print(f\"경고: {source} 파일에 … 열이 없어요\")", "F11/2", "멈추지 말고 경고"], ["[rec.get(c) for c in COLUMNS]", "F11/2", "빠진 칸은 None"], ["for p in sorted(Path(\"지점\").glob(\"*.xlsx\")):", "F11/1", "폴더의 파일 돌기"]], prep: [SAMPLES_PREP, {"name": "add_bundang.py", "text": "# add_bundang.py — 새 지점 분당이 보낸 파일을 만들어요(분류 열이 없어요). 한 번 실행하세요.\nfrom datetime import date\nfrom pathlib import Path\nfrom openpyxl import Workbook\n\nPath(\"지점\").mkdir(exist_ok=True)\nwb = Workbook()\nws = wb.active\nws.title = \"9월\"\nws.append([\"날짜\", \"품목\", \"단가\", \"수량\"])\nws.append([date(2026, 9, 3), \"소금빵\", 3200, 9])\nws.append([date(2026, 9, 6), \"라테\", 4800, 7])\nws.append([date(2026, 9, 12), \"딸기케이크\", 32000, 2])\nws.append([date(2026, 9, 18), \"마들렌\", 2500, 12])\nwb.save(\"지점/분당.xlsx\")\nprint(\"만들었어요: 지점/분당.xlsx\")\n", "run": true}], io: [{ output: "경고: 분당 파일에 분류 열이 없어요\n경고: 분당 마들렌 의 분류를 몰라서 미정\n케이크 467,500원\n빵 450,800원\n음료 220,800원\n미정 30,000원\n모두 22줄 1,169,100원" }], answer: "from pathlib import Path\nfrom openpyxl import load_workbook\n\nCOLUMNS = [\"날짜\", \"품목\", \"분류\", \"단가\", \"수량\"]\n\n\ndef read_table(ws, source):\n    it = ws.iter_rows(values_only=True)\n    header = [str(h).strip() for h in next(it)]\n    missing = [c for c in COLUMNS if c not in header]\n    if missing:\n        print(f\"경고: {source} 파일에 {', '.join(missing)} 열이 없어요\")\n    out = []\n    for row in it:\n        rec = dict(zip(header, row))\n        out.append([source] + [rec.get(c) for c in COLUMNS])\n    return out\n\n\nall_rows = []\nfor p in sorted(Path(\"지점\").glob(\"*.xlsx\")):\n    if p.name.startswith(\"~$\"):\n        continue\n    all_rows += read_table(load_workbook(p).active, p.stem)\n\nkind_of = {}\nfor r in all_rows:\n    if r[3] is not None:\n        kind_of[r[2]] = r[3]\nfor r in all_rows:\n    if r[3] is None:\n        r[3] = kind_of.get(r[2], \"미정\")\n        if r[3] == \"미정\":\n            print(f\"경고: {r[0]} {r[2]} 의 분류를 몰라서 미정\")\n\nby_kind = {}\nfor r in all_rows:\n    by_kind[r[3]] = by_kind.get(r[3], 0) + r[4] * r[5]\nfor kind, total in sorted(by_kind.items(), key=lambda kv: kv[1], reverse=True):\n    print(f\"{kind} {total:,}원\")\ngrand = sum(by_kind.values())\nprint(f\"모두 {len(all_rows)}줄 {grand:,}원\")" },
    ],
    FB2: [
      { title: "월별 매출 합계", text: "<p>빵집 사장님의 3분기 매출 보고서를 만들어요. <code>빵집_매출.xlsx</code>(아래 준비 파일)에는 「7월 · 8월 · 9월」 시트가 있고, 시트마다 <code>날짜 · 품목 · 분류 · 단가 · 수량</code> 20줄이에요. 매출 칸은 없어서 <code>단가 × 수량</code> 으로 구해요.</p><p>모든 시트를 읽어 줄마다 딕셔너리(머리줄 다섯 칸 + <code>월</code> · <code>매출</code>)로 만든 리스트를 돌려주는 함수 <code>read_sales(path)</code> 를 만드세요. 그걸로 줄 수, 월별 매출, 석 달 합계, 가장 많이 판 달, 8월 → 9월 늘어난 비율(소수 첫째 자리)을 출력 예처럼 찍으세요. 비율 앞의 부호는 <code>f\"{up:+.1f}%\"</code> 처럼 <code>+</code> 를 넣으면 늘면 <code>+</code>, 줄면 <code>-</code> 가 붙어요. <code>read_sales</code> 는 ②~⑤ 에서도 그대로 써요.</p>", needs: [["for ws in load_workbook(path):", "F11/0", "시트를 순서대로"], ["it = ws.iter_rows(values_only=True)", "F7/2", "셀 대신 값 튜플로 한 줄씩"], ["header = next(it)", "F11/0", "첫 줄 = 머리줄"], ["rec = dict(zip(header, row))  rec[\"월\"] = ws.title", "F11/0", "시트 이름을 칸으로"]], prep: [SAMPLES_PREP], io: [{ output: "모두 60줄\n7월    957,400원\n8월    864,900원\n9월  1,015,800원\n합계  2,838,100원\n가장 많이 판 달: 9월\n8월 → 9월 +17.4%" }], answer: "from openpyxl import load_workbook\n\n\ndef read_sales(path):\n    rows = []\n    for ws in load_workbook(path):\n        it = ws.iter_rows(values_only=True)\n        header = next(it)\n        for row in it:\n            rec = dict(zip(header, row))\n            rec[\"월\"] = ws.title\n            rec[\"매출\"] = rec[\"단가\"] * rec[\"수량\"]\n            rows.append(rec)\n    return rows\n\n\nrows = read_sales(\"빵집_매출.xlsx\")\nprint(f\"모두 {len(rows)}줄\")\nby_month = {}\nfor r in rows:\n    by_month[r[\"월\"]] = by_month.get(r[\"월\"], 0) + r[\"매출\"]\nfor month, total in by_month.items():\n    print(f\"{month} {total:>10,}원\")\ngrand = sum(by_month.values())\nprint(f\"합계 {grand:>10,}원\")\nprint(\"가장 많이 판 달:\", max(by_month, key=lambda m: by_month[m]))\nup = (by_month[\"9월\"] - by_month[\"8월\"]) / by_month[\"8월\"] * 100\nprint(f\"8월 → 9월 {up:+.1f}%\")" },
      { title: "분류별 합계 · 품목 TOP 3", text: "<p>① 의 <code>read_sales</code> 로 읽은 줄들로 두 가지를 찍으세요.</p><ul><li>분류별 매출을 큰 것부터, 석 달 합계에서 차지하는 비율(소수 첫째 자리)과 함께 — <code>빵 1,523,200원 (53.7%)</code></li><li>매출이 큰 품목 TOP 3 을 팔린 개수와 함께 — <code>1. 딸기케이크 768,000원 (24개)</code></li></ul>", needs: [["for ws in load_workbook(path):", "F11/0", "시트를 순서대로(① 그대로)"], ["rec = dict(zip(header, row))", "F11/0", "줄을 이름표로"]], prep: [SAMPLES_PREP], io: [{ output: "[분류별]\n빵 1,523,200원 (53.7%)\n케이크 852,500원 (30.0%)\n음료 462,400원 (16.3%)\n[품목 TOP 3]\n1. 딸기케이크 768,000원 (24개)\n2. 식빵 540,000원 (120개)\n3. 크루아상 387,600원 (102개)" }], answer: "from openpyxl import load_workbook\n\n\ndef read_sales(path):\n    rows = []\n    for ws in load_workbook(path):\n        it = ws.iter_rows(values_only=True)\n        header = next(it)\n        for row in it:\n            rec = dict(zip(header, row))\n            rec[\"월\"] = ws.title\n            rec[\"매출\"] = rec[\"단가\"] * rec[\"수량\"]\n            rows.append(rec)\n    return rows\n\n\nrows = read_sales(\"빵집_매출.xlsx\")\ngrand = sum(r[\"매출\"] for r in rows)\n\nby_kind = {}\nfor r in rows:\n    by_kind[r[\"분류\"]] = by_kind.get(r[\"분류\"], 0) + r[\"매출\"]\nprint(\"[분류별]\")\nfor kind, total in sorted(by_kind.items(), key=lambda kv: kv[1], reverse=True):\n    print(f\"{kind} {total:,}원 ({total / grand * 100:.1f}%)\")\n\nmoney = {}\ncount = {}\nfor r in rows:\n    money[r[\"품목\"]] = money.get(r[\"품목\"], 0) + r[\"매출\"]\n    count[r[\"품목\"]] = count.get(r[\"품목\"], 0) + r[\"수량\"]\nprint(\"[품목 TOP 3]\")\ntop = sorted(money, key=lambda name: money[name], reverse=True)[:3]\nfor rank, name in enumerate(top, 1):\n    print(f\"{rank}. {name} {money[name]:,}원 ({count[name]}개)\")" },
      { title: "「요약」 시트 — 월 × 분류 표 · SUM 수식", text: "<p>새 통합 문서 <code>매출_보고서.xlsx</code> 에 「요약」 시트를 만들어요.</p><ul><li>머리줄 <code>월 · 빵 · 음료 · 케이크 · 합계</code>, 그 아래 달마다 한 줄. 분류별 값은 파이썬이 계산한 숫자예요</li><li>합계 열(E)은 수식 <code>=SUM(B2:D2)</code> …, 맨 아래 <code>합계</code> 줄은 열마다 <code>=SUM(B2:B4)</code> … 수식이에요(복습: [[레슨:F9]])</li><li>머리줄은 굵은 흰 글씨 + 파란 바탕 <code>4472C4</code> + 가운데, 합계 줄은 굵게, 숫자 칸은 <code>#,##0</code></li><li>열 너비 A 는 8, B~E 는 13. 틀 고정은 <code>B2</code>(머리줄과 월 열)</li></ul><p>표 만들기는 함수 <code>write_summary(ws, rows)</code>(달 이름 리스트를 돌려줌)로 묶어요. 저장한 뒤 다시 열어 표 · 서식을 찍고, <code>data_only=True</code> 로 연 E5 와 파이썬이 계산한 석 달 합계를 나란히 찍으세요.</p>", needs: [["ws.append([m] + 값들 + [f\"=SUM(B{i}:D{i})\"])", "F9/0", "수식은 글자로 — 다시 읽어도 글자"], ["c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")", "F10/0", "머리줄 칠하기"], ["for c in ws[\"B\"][1:]:  c.number_format = \"#,##0\"", "F10/1", "숫자 칸에 모양 — 값은 그대로"], ["ws.freeze_panes = \"B2\"", "F10/2", "머리줄 + A 열 고정"], ["load_workbook(p, data_only=True)", "F9/1", "openpyxl 이 만든 파일의 수식 값은 None"]], prep: [SAMPLES_PREP], io: [{ output: "('월', '빵', '음료', '케이크', '합계')\n('7월', 465800, 209600, 282000, '=SUM(B2:D2)')\n('8월', 522000, 118400, 224500, '=SUM(B3:D3)')\n('9월', 535400, 134400, 346000, '=SUM(B4:D4)')\n('합계', '=SUM(B2:B4)', '=SUM(C2:C4)', '=SUM(D2:D4)', '=SUM(E2:E4)')\n머리줄: True 004472C4 | 합계 줄 굵게: True | 모양: #,##0\n너비: 8.0 13.0 | 틀 고정: B2\ndata_only 로 연 E5: None\n파이썬 합계: 2,838,100" }], answer: "from openpyxl import Workbook, load_workbook\nfrom openpyxl.styles import Font, PatternFill, Alignment\n\n\ndef read_sales(path):\n    rows = []\n    for ws in load_workbook(path):\n        it = ws.iter_rows(values_only=True)\n        header = next(it)\n        for row in it:\n            rec = dict(zip(header, row))\n            rec[\"월\"] = ws.title\n            rec[\"매출\"] = rec[\"단가\"] * rec[\"수량\"]\n            rows.append(rec)\n    return rows\n\n\nKINDS = [\"빵\", \"음료\", \"케이크\"]\n\n\ndef write_summary(ws, rows):\n    months = []\n    table = {}\n    for r in rows:\n        if r[\"월\"] not in months:\n            months.append(r[\"월\"])\n        key = (r[\"월\"], r[\"분류\"])\n        table[key] = table.get(key, 0) + r[\"매출\"]\n\n    ws.append([\"월\"] + KINDS + [\"합계\"])\n    for i, m in enumerate(months, 2):\n        ws.append([m] + [table.get((m, k), 0) for k in KINDS] + [f\"=SUM(B{i}:D{i})\"])\n    last = len(months) + 1\n    ws.append([\"합계\"] + [f\"=SUM({col}2:{col}{last})\" for col in \"BCDE\"])\n\n    for c in ws[1]:\n        c.font = Font(bold=True, color=\"FFFFFF\")\n        c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")\n        c.alignment = Alignment(horizontal=\"center\")\n    for c in ws[ws.max_row]:\n        c.font = Font(bold=True)\n    for row in ws.iter_rows(min_row=2, min_col=2):\n        for c in row:\n            c.number_format = \"#,##0\"\n    ws.column_dimensions[\"A\"].width = 8\n    for col in \"BCDE\":\n        ws.column_dimensions[col].width = 13\n    ws.freeze_panes = \"B2\"\n    return months\n\n\nrows = read_sales(\"빵집_매출.xlsx\")\nwb = Workbook()\nws = wb.active\nws.title = \"요약\"\nwrite_summary(ws, rows)\nwb.save(\"매출_보고서.xlsx\")\n\nws = load_workbook(\"매출_보고서.xlsx\")[\"요약\"]\nfor row in ws.iter_rows(values_only=True):\n    print(row)\nprint(\"머리줄:\", ws[\"A1\"].font.b, ws[\"A1\"].fill.fgColor.rgb, \"| 합계 줄 굵게:\", ws[\"A5\"].font.b, \"| 모양:\", ws[\"B2\"].number_format)\nprint(\"너비:\", ws.column_dimensions[\"A\"].width, ws.column_dimensions[\"E\"].width, \"| 틀 고정:\", ws.freeze_panes)\nv = load_workbook(\"매출_보고서.xlsx\", data_only=True)[\"요약\"]\nprint(\"data_only 로 연 E5:\", v[\"E5\"].value)\nprint(f\"파이썬 합계: {sum(r['매출'] for r in rows):,}\")", checks: [{"text": "엑셀에서 <code>매출_보고서.xlsx</code> 를 열면 E5 에 <code>2,838,100</code> 이 보여요 — 파이썬 합계와 같아요"}, {"text": "머리줄이 파란 바탕 흰 글씨이고, 오른쪽 · 아래로 스크롤해도 머리줄과 월 열이 남아 있어요"}] },
      { title: "분류를 쌓은 월별 막대 차트", text: "<p>③ 의 「요약」 시트에 막대 차트를 더해요. 달마다 막대 하나, 그 안을 분류별로 쌓은 막대예요(<code>chart.grouping = \"stacked\"</code> · <code>chart.overlap = 100</code>).</p><ul><li>데이터는 B1:D4(머리줄부터, 계열 셋 = 빵 · 음료 · 케이크), 막대 이름은 A2:A4 — 합계 줄 · 합계 열은 넣지 않아요</li><li>제목 <code>3분기 월별 매출</code>, 세로축 <code>원</code>, 크기 18 × 9, 자리 <code>G2</code></li></ul><p>차트는 함수 <code>add_chart(ws, n_months)</code> 로 묶어요. 저장한 뒤 다시 열어 시트 이름과 머리줄을 찍고, zip 목록에서 차트 파일 · 그림 자리 파일(<code>xl/drawings/</code>)을 찍으세요.</p>", needs: [["Reference(ws, min_col=2, max_col=4, min_row=1, max_row=4)", "F10/3", "여러 열 = 계열 여러 개"], ["chart.grouping = \"stacked\"  chart.overlap = 100", "F10/3", "한 막대에 쌓기"], ["chart.set_categories(cats)", "F10/3", "막대 이름"], ["ws.add_chart(chart, \"G2\")", "F10/3", "차트 자리"], ["zipfile.ZipFile(p).namelist()", "F10/4", "차트 파일 확인"]], prep: [SAMPLES_PREP], io: [{ output: "['요약'] ['월', '빵', '음료', '케이크', '합계']\n차트: ['xl/charts/chart1.xml']\n그림 자리: ['xl/drawings/drawing1.xml']" }], answer: "import zipfile\nfrom openpyxl import Workbook, load_workbook\nfrom openpyxl.styles import Font, PatternFill, Alignment\nfrom openpyxl.chart import BarChart, Reference\n\n\ndef read_sales(path):\n    rows = []\n    for ws in load_workbook(path):\n        it = ws.iter_rows(values_only=True)\n        header = next(it)\n        for row in it:\n            rec = dict(zip(header, row))\n            rec[\"월\"] = ws.title\n            rec[\"매출\"] = rec[\"단가\"] * rec[\"수량\"]\n            rows.append(rec)\n    return rows\n\n\nKINDS = [\"빵\", \"음료\", \"케이크\"]\n\n\ndef write_summary(ws, rows):\n    months = []\n    table = {}\n    for r in rows:\n        if r[\"월\"] not in months:\n            months.append(r[\"월\"])\n        key = (r[\"월\"], r[\"분류\"])\n        table[key] = table.get(key, 0) + r[\"매출\"]\n\n    ws.append([\"월\"] + KINDS + [\"합계\"])\n    for i, m in enumerate(months, 2):\n        ws.append([m] + [table.get((m, k), 0) for k in KINDS] + [f\"=SUM(B{i}:D{i})\"])\n    last = len(months) + 1\n    ws.append([\"합계\"] + [f\"=SUM({col}2:{col}{last})\" for col in \"BCDE\"])\n\n    for c in ws[1]:\n        c.font = Font(bold=True, color=\"FFFFFF\")\n        c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")\n        c.alignment = Alignment(horizontal=\"center\")\n    for c in ws[ws.max_row]:\n        c.font = Font(bold=True)\n    for row in ws.iter_rows(min_row=2, min_col=2):\n        for c in row:\n            c.number_format = \"#,##0\"\n    ws.column_dimensions[\"A\"].width = 8\n    for col in \"BCDE\":\n        ws.column_dimensions[col].width = 13\n    ws.freeze_panes = \"B2\"\n    return months\n\n\ndef add_chart(ws, n_months):\n    chart = BarChart()\n    chart.title = \"3분기 월별 매출\"\n    chart.y_axis.title = \"원\"\n    chart.grouping = \"stacked\"\n    chart.overlap = 100\n    data = Reference(ws, min_col=2, max_col=4, min_row=1, max_row=n_months + 1)\n    cats = Reference(ws, min_col=1, min_row=2, max_row=n_months + 1)\n    chart.add_data(data, titles_from_data=True)\n    chart.set_categories(cats)\n    chart.width = 18\n    chart.height = 9\n    ws.add_chart(chart, \"G2\")\n\n\nrows = read_sales(\"빵집_매출.xlsx\")\nwb = Workbook()\nws = wb.active\nws.title = \"요약\"\nmonths = write_summary(ws, rows)\nadd_chart(ws, len(months))\nwb.save(\"매출_보고서.xlsx\")\n\nwb = load_workbook(\"매출_보고서.xlsx\")\nprint(wb.sheetnames, [c.value for c in wb[\"요약\"][1]])\nwith zipfile.ZipFile(\"매출_보고서.xlsx\") as z:\n    names = z.namelist()\nprint(\"차트:\", [n for n in names if n.startswith(\"xl/charts/\")])\nprint(\"그림 자리:\", [n for n in names if n.startswith(\"xl/drawings/\") and n.endswith(\".xml\")])", checks: [{"text": "엑셀에서 「요약」 시트를 열면 G2 근처에 막대 셋(7월 · 8월 · 9월)이 있고, 9월 막대가 가장 높아요"}, {"text": "막대마다 빵 · 음료 · 케이크가 다른 색으로 쌓여 있고, 범례에 세 분류 이름이 보여요"}, {"text": "차트 위에 「3분기 월별 매출」, 세로축에 「원」 이 보여요"}] },
      { title: "보고서 함수 make_report · 다시 읽어 검사", text: "<p>마지막으로 ①~④ 를 함수 하나로 묶어요. 나중에 「정해진 시간에 보고서 만들기」 처럼 다른 프로그램이 <code>from report import make_report</code> 로 불러 쓸 수 있게, 파일 이름은 <code>report.py</code> 로 하고 맨 아래 실행 부분은 <code>if __name__ == \"__main__\":</code> 안에 둬요.</p><ul><li><code>make_report(src, dst)</code> — <code>src</code> 를 읽어 <code>dst</code> 에 「요약」 시트(③ · ④ 그대로)와 「품목」 시트를 쓰고, <code>{\"월별\": {…}, \"합계\": …, \"TOP3\": [품목, 품목, 품목]}</code> 딕셔너리를 돌려줘요</li><li>「품목」 시트: <code>순위 · 품목 · 분류 · 수량 · 매출</code>, 매출 큰 순, TOP 3 줄은 연노랑 <code>FFF2CC</code>, 머리줄 꾸밈 · 매출 <code>#,##0</code> · 틀 고정 · 필터</li><li><code>check_report(dst, result)</code> — 다시 열어 검사해요: 시트 순서, E5 수식 글자, <code>data_only=True</code> 로 연 E5 가 <code>None</code>, 요약 표 B2:D4 값의 합이 <code>result[\"합계\"]</code> 와 같은지, 품목 시트 1~3위, 차트 파일. 다르면 <code>assert</code> 로 멈추고, 다 맞으면 찍은 뒤 <code>검사 통과</code></li></ul><p>그다음 엑셀에서 직접 열어 아래 ☐ 를 확인해요. 수식 칸의 값은 엑셀이 열 때 계산하니까, 파이썬 합계와 같은지는 눈으로 봐요.</p>", needs: [["for ws in load_workbook(path):", "F11/0", "시트마다 읽기"], ["wb.create_sheet(\"품목\")", "F8/3", "시트 더하기 — 자리를 안 주면 맨 뒤"], ["PatternFill(\"solid\", fgColor=\"FFF2CC\")", "F10/0", "TOP 3 줄 칠하기"], ["ws.auto_filter.ref = ws.dimensions", "F10/2", "필터 단추"], ["load_workbook(dst, data_only=True)[\"요약\"][\"E5\"].value", "F9/1", "아직 계산 안 된 수식은 None"], ["\"xl/charts/chart1.xml\" in z.namelist()", "F10/4", "차트 파일 확인"]], prep: [SAMPLES_PREP], io: [{ output: "7월 957,400원\n8월 864,900원\n9월 1,015,800원\n시트 순서: ['요약', '품목']\nE5 수식: =SUM(E2:E4)\ndata_only 로 연 E5: None (엑셀에서 열어 저장하기 전)\n표 값의 합: 2,838,100 | 파이썬 합계: 2,838,100\n품목 1~3위: 딸기케이크 · 식빵 · 크루아상 | 칠: 00FFF2CC\n차트 파일: True\n검사 통과" }], answer: "\"\"\"report.py — 빵집 매출 엑셀 → 3분기 보고서 엑셀.\n다른 프로그램에서: from report import make_report\"\"\"\nimport zipfile\nfrom openpyxl import Workbook, load_workbook\nfrom openpyxl.styles import Font, PatternFill, Alignment\nfrom openpyxl.chart import BarChart, Reference\n\n\ndef read_sales(path):\n    rows = []\n    for ws in load_workbook(path):\n        it = ws.iter_rows(values_only=True)\n        header = next(it)\n        for row in it:\n            rec = dict(zip(header, row))\n            rec[\"월\"] = ws.title\n            rec[\"매출\"] = rec[\"단가\"] * rec[\"수량\"]\n            rows.append(rec)\n    return rows\n\n\nKINDS = [\"빵\", \"음료\", \"케이크\"]\n\n\ndef write_summary(ws, rows):\n    months = []\n    table = {}\n    for r in rows:\n        if r[\"월\"] not in months:\n            months.append(r[\"월\"])\n        key = (r[\"월\"], r[\"분류\"])\n        table[key] = table.get(key, 0) + r[\"매출\"]\n\n    ws.append([\"월\"] + KINDS + [\"합계\"])\n    for i, m in enumerate(months, 2):\n        ws.append([m] + [table.get((m, k), 0) for k in KINDS] + [f\"=SUM(B{i}:D{i})\"])\n    last = len(months) + 1\n    ws.append([\"합계\"] + [f\"=SUM({col}2:{col}{last})\" for col in \"BCDE\"])\n\n    for c in ws[1]:\n        c.font = Font(bold=True, color=\"FFFFFF\")\n        c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")\n        c.alignment = Alignment(horizontal=\"center\")\n    for c in ws[ws.max_row]:\n        c.font = Font(bold=True)\n    for row in ws.iter_rows(min_row=2, min_col=2):\n        for c in row:\n            c.number_format = \"#,##0\"\n    ws.column_dimensions[\"A\"].width = 8\n    for col in \"BCDE\":\n        ws.column_dimensions[col].width = 13\n    ws.freeze_panes = \"B2\"\n    return months\n\n\ndef add_chart(ws, n_months):\n    chart = BarChart()\n    chart.title = \"3분기 월별 매출\"\n    chart.y_axis.title = \"원\"\n    chart.grouping = \"stacked\"\n    chart.overlap = 100\n    data = Reference(ws, min_col=2, max_col=4, min_row=1, max_row=n_months + 1)\n    cats = Reference(ws, min_col=1, min_row=2, max_row=n_months + 1)\n    chart.add_data(data, titles_from_data=True)\n    chart.set_categories(cats)\n    chart.width = 18\n    chart.height = 9\n    ws.add_chart(chart, \"G2\")\n\n\ndef write_items(ws, rows):\n    money = {}\n    count = {}\n    kind_of = {}\n    for r in rows:\n        money[r[\"품목\"]] = money.get(r[\"품목\"], 0) + r[\"매출\"]\n        count[r[\"품목\"]] = count.get(r[\"품목\"], 0) + r[\"수량\"]\n        kind_of[r[\"품목\"]] = r[\"분류\"]\n    ranked = sorted(money, key=lambda name: money[name], reverse=True)\n    ws.append([\"순위\", \"품목\", \"분류\", \"수량\", \"매출\"])\n    for rank, name in enumerate(ranked, 1):\n        ws.append([rank, name, kind_of[name], count[name], money[name]])\n    for c in ws[1]:\n        c.font = Font(bold=True, color=\"FFFFFF\")\n        c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")\n        c.alignment = Alignment(horizontal=\"center\")\n    for r in range(2, 5):\n        for c in ws[r]:\n            c.fill = PatternFill(\"solid\", fgColor=\"FFF2CC\")\n    for c in ws[\"E\"][1:]:\n        c.number_format = \"#,##0\"\n    for col, w in {\"A\": 6, \"B\": 14, \"C\": 8, \"D\": 8, \"E\": 12}.items():\n        ws.column_dimensions[col].width = w\n    ws.freeze_panes = \"A2\"\n    ws.auto_filter.ref = ws.dimensions\n    return ranked[:3]\n\n\ndef make_report(src, dst):\n    rows = read_sales(src)\n    wb = Workbook()\n    ws = wb.active\n    ws.title = \"요약\"\n    months = write_summary(ws, rows)\n    add_chart(ws, len(months))\n    top3 = write_items(wb.create_sheet(\"품목\"), rows)\n    wb.save(dst)\n    by_month = {m: sum(r[\"매출\"] for r in rows if r[\"월\"] == m) for m in months}\n    return {\"월별\": by_month, \"합계\": sum(by_month.values()), \"TOP3\": top3}\n\n\ndef check_report(dst, result):\n    wb = load_workbook(dst)\n    print(\"시트 순서:\", wb.sheetnames)\n    assert wb.sheetnames == [\"요약\", \"품목\"]\n    s = wb[\"요약\"]\n    print(\"E5 수식:\", s[\"E5\"].value)\n    assert s[\"E5\"].value == \"=SUM(E2:E4)\"\n    e5 = load_workbook(dst, data_only=True)[\"요약\"][\"E5\"].value\n    print(\"data_only 로 연 E5:\", e5, \"(엑셀에서 열어 저장하기 전)\")\n    assert e5 is None\n    cells = sum(c.value for row in s[\"B2:D4\"] for c in row)\n    print(f\"표 값의 합: {cells:,} | 파이썬 합계: {result['합계']:,}\")\n    assert cells == result[\"합계\"]\n    top = [wb[\"품목\"].cell(row=r, column=2).value for r in range(2, 5)]\n    print(\"품목 1~3위:\", \" · \".join(top), \"| 칠:\", wb[\"품목\"][\"B2\"].fill.fgColor.rgb)\n    assert top == result[\"TOP3\"]\n    with zipfile.ZipFile(dst) as z:\n        has_chart = \"xl/charts/chart1.xml\" in z.namelist()\n    print(\"차트 파일:\", has_chart)\n    assert has_chart\n    print(\"검사 통과\")\n\n\nif __name__ == \"__main__\":\n    result = make_report(\"빵집_매출.xlsx\", \"매출_보고서.xlsx\")\n    for month, total in result[\"월별\"].items():\n        print(f\"{month} {total:,}원\")\n    check_report(\"매출_보고서.xlsx\", result)", checks: [{"text": "엑셀(또는 LibreOffice Calc)에서 <code>매출_보고서.xlsx</code> 를 열면 「요약」 시트가 먼저 보이고, E5 에 <code>2,838,100</code> 이 보여요 — check_report 가 찍은 파이썬 합계와 같아요"}, {"text": "「요약」 시트 G2 근처에 분류를 쌓은 막대 셋이 있고, 9월 막대가 가장 높아요"}, {"text": "「품목」 시트의 1~3위 줄이 연노랑이고, 「분류」 필터 단추로 케이크만 골라 볼 수 있어요"}, {"text": "엑셀에서 저장하고 닫은 뒤 <code>print(load_workbook(\"매출_보고서.xlsx\", data_only=True)[\"요약\"][\"E5\"].value)</code> 만 따로 돌리면 이번엔 <code>2838100</code> 이 나와요(엑셀이 계산해 저장해 둔 값)"}] },
    ],
    F12: [
      { title: "CSV 와 엑셀에서 돌아온 값 — 출력 예측",
        text: `<p>기록 한 건을 CSV 와 엑셀에 한 번씩 넣었다가 꺼내요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. <code>"007"</code> · <code>3</code> · <code>None</code> · 날짜가 각각 어떻게 돌아오는지 눈여겨봐요.</p>`,
        needs: [["csv.DictWriter(f, fieldnames=list(rec))", "F12/0", "CSV 에 쓰면 값이 다 글자"], ["load_workbook(\"t.xlsx\").active", "F12/0", "다시 열어 종류 보기"], ["back[\"수량\"] + \"개\"", "F12/0", "글자끼리는 + 로 이어 붙음"]],
        predict: true,
        io: [{ output: `{'코드': '007', '수량': '3', '할인': '0.5', '배송': '', '날짜': '2026-09-03'}
False 3개
A1 '007'
B1 3
C1 0.5
D1 None
E1 datetime.datetime(2026, 9, 3, 0, 0)` }],
        answer: `import csv
from datetime import date
from openpyxl import Workbook, load_workbook

rec = {"코드": "007", "수량": 3, "할인": 0.5, "배송": None, "날짜": date(2026, 9, 3)}

with open("t.csv", "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(rec))
    w.writeheader()
    w.writerow(rec)
with open("t.csv", encoding="utf-8", newline="") as f:
    back = next(csv.DictReader(f))
print(back)
print(back["배송"] is None, back["수량"] + "개")

wb = Workbook()
ws = wb.active
cells = list(rec.values())
ws.append(cells)
wb.save("t.xlsx")
ws = load_workbook("t.xlsx").active
for cell in ws[1]:
    print(cell.coordinate, repr(cell.value))
`,
        explain: `<p>CSV 는 값을 <b>모두 글자로</b> 써요. 그래서 다시 읽으면 <code>'3'</code> · <code>'0.5'</code> · <code>'2026-09-03'</code> 이고, <code>None</code> 은 빈 글자 <code>''</code> 로 돌아와서 <code>is None</code> 이 <code>False</code> 예요. 수량도 글자라 <code>+ "개"</code> 가 돼요(숫자였다면 <code>TypeError</code>). 엑셀은 종류를 지켜요. 글자로 넣은 <code>'007'</code> 은 글자 그대로, <code>3</code> · <code>0.5</code> 는 숫자, 빈칸은 <code>None</code>. 다만 날짜는 <code>date</code> 가 아니라 <code>datetime.datetime(2026, 9, 3, 0, 0)</code> 으로 돌아와요 — 그래서 엑셀 → CSV 에서 <code>v.date()</code> 가 필요해요.</p>` },
      { title: "🏠 빵집 9월 매출 — 엑셀 → CSV → JSON",
        text: `<p>빵집 사장님이 <code>빵집_매출.xlsx</code> 의 「9월」 시트를 회계 프로그램에 넣을 <b>CSV</b> 와, 주문 앱에 넣을 <b>JSON</b> 으로 달래요(예제 파일은 아래 준비 파일로 만들어요).</p><ul><li><code>9월.csv</code> — 엑셀에서도 한글이 안 깨지게 쓰고, 열은 원래 다섯(날짜 · 품목 · 분류 · 단가 · 수량)에 <code>매출</code>(단가 × 수량)을 더해 여섯이에요. 날짜는 <code>2026-09-01</code> 모양</li><li><code>9월.json</code> — 방금 쓴 <code>9월.csv</code> 를 <b>다시 읽어</b>, 함수표로 단가 · 수량 · 매출은 <code>int</code>, 날짜는 <code>date</code> 로 바꾼 뒤 저장해요(날짜는 ISO 글자, 한글 그대로, 들여쓰기 2)</li></ul><p><code>20줄 → 9월.csv</code>, CSV 파일의 첫 두 줄, <code>20건 → 9월.json</code>, JSON 을 다시 읽은 첫 건, 매출 합계를 출력 예처럼 출력하세요.</p>`,
        needs: [["ws.iter_rows(values_only=True)", "F7/2", "줄마다 값 튜플"], ["open(\"9월.csv\", \"w\", encoding=\"utf-8-sig\", newline=\"\")", "F12/3", "엑셀에서도 열 CSV"], ["v.date().isoformat()", "F12/3", "datetime → 2026-09-01 글자"], ["CONVERT = {\"날짜\": date.fromisoformat, \"단가\": int, …}", "F12/1", "열마다 바꿀 함수표"], ["json.dump(records, f, ensure_ascii=False, indent=2, default=to_json)", "F12/1", "날짜는 ISO 글자로 저장"]],
        prep: [SAMPLES_PREP],
        io: [{ output: `20줄 → 9월.csv
날짜,품목,분류,단가,수량,매출
2026-09-01,크루아상,빵,3800,11,41800
20건 → 9월.json
{'날짜': '2026-09-01', '품목': '크루아상', '분류': '빵', '단가': 3800, '수량': 11, '매출': 41800}
매출 합계 1,015,800원` }],
        answer: `import csv
import json
from datetime import date, datetime
from openpyxl import load_workbook


def cell_text(v):
    if v is None:
        return ""
    if isinstance(v, datetime):
        return v.date().isoformat()
    return v


ws = load_workbook("빵집_매출.xlsx")["9월"]
rows = ws.iter_rows(values_only=True)
header = list(next(rows)) + ["매출"]
count = 0
with open("9월.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(header)
    for day, name, kind, price, qty in rows:
        values = [day, name, kind, price, qty, price * qty]
        w.writerow([cell_text(v) for v in values])
        count += 1
print(f"{count}줄 → 9월.csv")

with open("9월.csv", encoding="utf-8-sig") as f:
    lines = f.read().splitlines()
print(lines[0])
print(lines[1])

CONVERT = {"날짜": date.fromisoformat, "단가": int, "수량": int, "매출": int}


def convert(row, table):
    out = {}
    for key, text in row.items():
        if text == "":
            out[key] = None
        elif key in table:
            out[key] = table[key](text)
        else:
            out[key] = text
    return out


def to_json(o):
    if isinstance(o, date):
        return o.isoformat()
    raise TypeError(f"JSON 으로 못 바꿔요: {type(o).__name__}")


with open("9월.csv", encoding="utf-8-sig", newline="") as f:
    records = [convert(row, CONVERT) for row in csv.DictReader(f)]
with open("9월.json", "w", encoding="utf-8") as f:
    json.dump(records, f, ensure_ascii=False, indent=2, default=to_json)
print(f"{len(records)}건 → 9월.json")

with open("9월.json", encoding="utf-8") as f:
    back = json.load(f)
print(back[0])
total = sum(r["매출"] for r in back)
print(f"매출 합계 {total:,}원")
` },
      { title: "에러 읽기 — dict contains fields not in fieldnames",
        text: `<p>서점 주문 기록을 CSV 로 쓰려는데 이렇게 멈춰요.</p><pre>Traceback (most recent call last):
  File "C:\\Users\\me\\files-study\\main.py", line 13, in &lt;module&gt;
    w.writerows(records)
    ~~~~~~~~~~~^^^^^^^^^
  File "C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\csv.py", line 229, in writerows
  File "C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\csv.py", line 221, in _dict_to_list
ValueError: dict contains fields not in fieldnames: '쿠폰'</pre><p>먼저 말해 보세요. <b>몇 번째 줄</b>에서, <b>무슨 에러</b>가, <b>왜</b> 났나요? (<code>fieldnames</code> 는 누구의 키로 만들었나요? 셋째 · 넷째 기록에는 어떤 키가 더 있나요?) 머리줄을 <b>모든 키의 합집합</b>(처음 나온 순서)으로 고쳐서 출력 예처럼 나오게 하세요. 넷째 기록처럼 <code>책</code> 이 빠진 칸은 빈칸이면 돼요.</p>`,
        needs: [["if key not in header: header.append(key)", "F12/2", "키 합집합 — 처음 나온 순서"], ["csv.DictWriter(f, fieldnames=header)", "F12/2", "빠진 키는 빈칸, 없는 키는 ValueError"]],
        given: `import csv

records = [
    {"이름": "김하늘", "책": "파이썬 첫걸음", "권수": 1},
    {"이름": "이도윤", "책": "데이터 정리의 기술", "권수": 2},
    {"이름": "박서준", "책": "하루 10분 SQL", "권수": 1, "쿠폰": "WELCOME"},
    {"이름": "최유나", "권수": 3, "메모": "선물 포장"},
]

with open("주문.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=list(records[0]))
    w.writeheader()
    w.writerows(records)

with open("주문.csv", encoding="utf-8-sig") as f:
    print(f.read().rstrip())
`,
        io: [{ output: `이름,책,권수,쿠폰,메모
김하늘,파이썬 첫걸음,1,,
이도윤,데이터 정리의 기술,2,,
박서준,하루 10분 SQL,1,WELCOME,
최유나,,3,,선물 포장` }],
        answer: `import csv

records = [
    {"이름": "김하늘", "책": "파이썬 첫걸음", "권수": 1},
    {"이름": "이도윤", "책": "데이터 정리의 기술", "권수": 2},
    {"이름": "박서준", "책": "하루 10분 SQL", "권수": 1, "쿠폰": "WELCOME"},
    {"이름": "최유나", "권수": 3, "메모": "선물 포장"},
]

header = []
for rec in records:
    for key in rec:
        if key not in header:
            header.append(key)

with open("주문.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=header)
    w.writeheader()
    w.writerows(records)

with open("주문.csv", encoding="utf-8-sig") as f:
    print(f.read().rstrip())
` },
      { title: "고치기 — 왕복 시험이 깨져요",
        text: `<p>CSV → 엑셀 → CSV 를 돌리고 처음과 같은지 보는 왕복 시험이에요. 돌리면 <code>다름:</code> 줄이 둘 찍히고 <code>AssertionError: 왕복이 달라요</code> 로 멈춰요.</p><p>어느 열이 어떻게 달라졌는지 먼저 읽어 보세요. 빈칸(<code>메모</code>)은 괜찮은데 왜 날짜만 달라졌을까요? <b>엑셀 → CSV</b> 쪽을 고쳐서(원본 · 왕복 시험 코드는 그대로) 출력 예처럼 <code>왕복 OK</code> 가 나오게 하세요.</p>`,
        needs: [["v.date().isoformat()", "F12/3", "datetime 에서 날짜만 ISO 글자로"], ["w.writerow([cell_text(v) for v in row])", "F12/3", "칸마다 바꿔서 쓰기"], ["Path(\"왕복.csv\").read_text(encoding=\"utf-8-sig\").splitlines()", "F12/4", "글자로 줄마다 비교"]],
        given: `import csv
from datetime import date
from pathlib import Path
from openpyxl import Workbook, load_workbook

Path("원본.csv").write_text(
    "날짜,품목,수량,메모\\n2026-09-03,소금빵,3,\\n2026-09-04,라테,2,포장\\n",
    encoding="utf-8",
)
TABLE = {"날짜": date.fromisoformat, "수량": int}

# CSV → 엑셀
wb = Workbook()
ws = wb.active
with open("원본.csv", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    ws.append(reader.fieldnames)
    for row in reader:
        values = []
        for key, text in row.items():
            if text == "":
                values.append(None)
            elif key in TABLE:
                values.append(TABLE[key](text))
            else:
                values.append(text)
        ws.append(values)
wb.save("중간.xlsx")

# 엑셀 → CSV
ws = load_workbook("중간.xlsx").active
with open("왕복.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    for row in ws.iter_rows(values_only=True):
        w.writerow(row)

# 왕복 시험
a = Path("원본.csv").read_text(encoding="utf-8-sig").splitlines()
b = Path("왕복.csv").read_text(encoding="utf-8-sig").splitlines()
for x, y in zip(a, b):
    if x != y:
        print("다름:", x, "|", y)
assert a == b, "왕복이 달라요"
print("왕복 OK")
for line in b:
    print(line)
`,
        io: [{ output: `왕복 OK
날짜,품목,수량,메모
2026-09-03,소금빵,3,
2026-09-04,라테,2,포장` }],
        answer: `import csv
from datetime import date, datetime
from pathlib import Path
from openpyxl import Workbook, load_workbook

Path("원본.csv").write_text(
    "날짜,품목,수량,메모\\n2026-09-03,소금빵,3,\\n2026-09-04,라테,2,포장\\n",
    encoding="utf-8",
)
TABLE = {"날짜": date.fromisoformat, "수량": int}

# CSV → 엑셀
wb = Workbook()
ws = wb.active
with open("원본.csv", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    ws.append(reader.fieldnames)
    for row in reader:
        values = []
        for key, text in row.items():
            if text == "":
                values.append(None)
            elif key in TABLE:
                values.append(TABLE[key](text))
            else:
                values.append(text)
        ws.append(values)
wb.save("중간.xlsx")

# 엑셀 → CSV


def cell_text(v):
    if v is None:
        return ""
    if isinstance(v, datetime):
        return v.date().isoformat()
    return v


ws = load_workbook("중간.xlsx").active
with open("왕복.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    for row in ws.iter_rows(values_only=True):
        w.writerow([cell_text(v) for v in row])

# 왕복 시험
a = Path("원본.csv").read_text(encoding="utf-8-sig").splitlines()
b = Path("왕복.csv").read_text(encoding="utf-8-sig").splitlines()
for x, y in zip(a, b):
    if x != y:
        print("다름:", x, "|", y)
assert a == b, "왕복이 달라요"
print("왕복 OK")
for line in b:
    print(line)
` },
    ],
    F13: [
      { title: "에러 읽기 — 'NoneType' object is not subscriptable",
        text: `<p>주문마다 배송 도시를 찍으려는데, 두 줄을 찍고 이렇게 멈춰요.</p><pre>Traceback (most recent call last):
  File "C:\\Users\\me\\files-study\\main.py", line 8, in &lt;module&gt;
    print(order["id"], address["city"], address["district"])
                       ~~~~~~~^^^^^^^^
TypeError: 'NoneType' object is not subscriptable</pre><p>먼저 말해 보세요. <b>몇 번째 줄</b>에서, <b>무슨 에러</b>가, <b>왜</b> 났나요? (두 줄은 찍혔으니 세 번째 주문이 문제예요. <code>orders.json</code> 에서 A-1003 의 <code>address</code> 는 무엇인가요? <code>None["city"]</code> 는 될까요?) 주문을 <code>flatten</code> 으로 펴고 열 목록 <code>["id", "customer.address.city", "customer.address.district"]</code> 로 칸을 꺼내도록 고쳐서, 주소가 없으면 <code>-</code> 가 나오게 하세요.</p>`,
        needs: [["flat.update(flatten(value, name + \".\"))", "F13/0", "딕셔너리면 안으로 들어가 펴기"], ["row.get(col)", "F13/1", "없는 열은 None — 에러가 아님"]],
        prep: [{ name: 'orders.json', text: BOOKSHOP_JSON }],
        given: `import json

with open("orders.json", encoding="utf-8") as f:
    data = json.load(f)

for order in data["data"]["orders"]:
    address = order["customer"]["address"]
    print(order["id"], address["city"], address["district"])
`,
        io: [{ output: `A-1001 서울 마포구
A-1002 성남 분당구
A-1003 - -
A-1004 서울 강남구` }],
        answer: `import json


def flatten(d, prefix=""):
    flat = {}
    for key, value in d.items():
        name = prefix + key
        if isinstance(value, dict):
            flat.update(flatten(value, name + "."))
        else:
            flat[name] = value
    return flat


with open("orders.json", encoding="utf-8") as f:
    data = json.load(f)

COLUMNS = ["id", "customer.address.city", "customer.address.district"]
for order in data["data"]["orders"]:
    row = flatten(order)
    cells = []
    for col in COLUMNS:
        value = row.get(col)
        cells.append("-" if value is None else str(value))
    print(" ".join(cells))
` },
      { title: "어떤 칸이 남을까 — 출력 예측",
        text: `<p>주문 하나를 <code>flatten</code> 으로 펴요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. <code>None</code> · 빈 딕셔너리 <code>{}</code> · 리스트가 각각 어떻게 되는지 눈여겨봐요.</p>`,
        needs: [["flatten(d, prefix=\"\")", "F13/0", "딕셔너리만 안으로 들어감"], ["isinstance(value, dict)", "F13/0", "None 은 딕셔너리가 아님"]],
        predict: true,
        io: [{ output: `id → B-1
customer.name → 민수
customer.address → None
items → [{'title': '모모', 'qty': 1}]
pay.card.brand → ◇◇
pay.card.last4 → 0012
6 칸` }],
        answer: `def flatten(d, prefix=""):
    flat = {}
    for key, value in d.items():
        name = prefix + key
        if isinstance(value, dict):
            flat.update(flatten(value, name + "."))
        else:
            flat[name] = value
    return flat


order = {
    "id": "B-1",
    "customer": {"name": "민수", "address": None, "tags": {}},
    "items": [{"title": "모모", "qty": 1}],
    "pay": {"card": {"brand": "◇◇", "last4": "0012"}},
}
flat = flatten(order)
for key, value in flat.items():
    print(key, "→", value)
print(len(flat), "칸")
`,
        explain: `<p><code>flatten</code> 은 값이 <b>딕셔너리일 때만</b> 안으로 들어가요. <code>address</code> 는 <code>None</code> 이라 <code>customer.address → None</code> 한 칸이 돼요(A-1003 과 같아요). <code>items</code> 는 리스트라 들어가지 않고 리스트 통째로 한 칸이에요. 놓치기 쉬운 건 <code>tags: {}</code> 예요 — 딕셔너리라 안으로 들어가는데 안이 비어서 <b>칸이 하나도 안 생겨요</b>. 그래서 <code>customer.tags</code> 는 사라지고 모두 6 칸이에요. 표에 꼭 있어야 하는 열이면 열 목록을 먼저 정해 두는 까닭이에요.</p>` },
      { title: "🏠 서점 주문 상품표 — 줄로 늘려 엑셀로",
        text: `<p>서점 사장님이 「어떤 책이 얼마나 팔렸는지」 엑셀로 보고 싶대요. 같은 폴더의 <code>orders.json</code>(아래 준비 파일)을 <b>상품 하나에 한 줄</b>로 늘려서 <code>주문_상품.xlsx</code> 의 「상품」 시트에 쓰세요.</p><ul><li>열은 <code>주문번호 · 주문일 · 고객 · 도시 · 제목 · 단가 · 수량 · 금액</code></li><li>취소된 주문(<code>status</code> 가 <code>paid</code> 가 아님)은 빼고 <code>취소 1건 뺌</code> 을 출력해요</li><li>주문일은 <code>ordered_at</code> 의 앞 10글자(한국 날짜)를 <code>date</code> 로, 단가는 글자 금액을 <code>Decimal</code> 로 읽어 정수 원으로, 금액 = 단가 × 수량</li><li>주소가 <code>null</code> 이어도 멈추지 않게 써요(지금 데이터에서는 취소 주문이지만, 다음 달엔 아닐 수 있어요)</li></ul><p>저장한 뒤 <b>다시 열어</b> 머리줄과 줄마다 <code>A-1001 2026-09-03 김하늘 서울 파이썬 첫걸음 18,000 × 1 = 18,000</code> 처럼 찍고, 마지막에 줄 수와 금액 합계를 출력하세요.</p>`,
        needs: [["for item in order[\"items\"]:", "F13/2", "주문 1 × 상품 n → n 줄"], ["Decimal(item[\"price\"]) * item[\"qty\"]", "F13/2", "글자 금액을 정확하게"], ["customer[\"address\"] or {}", "F13/1", "None 이면 빈 딕셔너리로"], ["ws.append([...])", "F8/0", "한 줄 쓰기"], ["load_workbook(\"주문_상품.xlsx\")[\"상품\"]", "F8/0", "다시 열어 확인"]],
        prep: [{ name: 'orders.json', text: BOOKSHOP_JSON }],
        io: [{ output: `취소 1건 뺌
주문번호 주문일 고객 도시 제목 단가 수량 금액
A-1001 2026-09-03 김하늘 서울 파이썬 첫걸음 18,000 × 1 = 18,000
A-1001 2026-09-03 김하늘 서울 엑셀 업무 노트 12,500 × 2 = 25,000
A-1002 2026-09-03 이도윤 성남 데이터 정리의 기술 22,000 × 1 = 22,000
A-1004 2026-09-05 최유나 서울 하루 10분 SQL 15,800 × 1 = 15,800
A-1004 2026-09-05 최유나 서울 엑셀 업무 노트 12,500 × 1 = 12,500
A-1004 2026-09-05 최유나 서울 그림으로 보는 네트워크 19,500 × 1 = 19,500
6줄 · 금액 합계 112,800원` }],
        answer: `import json
from datetime import date
from decimal import Decimal
from openpyxl import Workbook, load_workbook

with open("orders.json", encoding="utf-8") as f:
    orders = json.load(f)["data"]["orders"]

HEADER = ["주문번호", "주문일", "고객", "도시", "제목", "단가", "수량", "금액"]
wb = Workbook()
ws = wb.active
ws.title = "상품"
ws.append(HEADER)
skipped = 0
for order in orders:
    if order["status"] != "paid":
        skipped += 1
        continue
    customer = order["customer"]
    address = customer["address"] or {}
    day = date.fromisoformat(order["ordered_at"][:10])
    for item in order["items"]:
        price = Decimal(item["price"])
        money = price * item["qty"]
        ws.append([order["id"], day, customer["name"], address.get("city"),
                   item["title"], int(price), item["qty"], int(money)])
wb.save("주문_상품.xlsx")
print(f"취소 {skipped}건 뺌")

ws = load_workbook("주문_상품.xlsx")["상품"]
print(" ".join(cell.value for cell in ws[1]))
total = 0
for oid, day, name, city, title, price, qty, money in ws.iter_rows(min_row=2, values_only=True):
    print(oid, day.date(), name, city, title, f"{price:,} × {qty} = {money:,}")
    total += money
print(f"{ws.max_row - 1}줄 · 금액 합계 {total:,}원")
` },
      { title: "두 표를 다시 묶기 — 주문 표 + 상품 표 → JSON",
        text: `<p>다른 가게에서 주문을 <b>두 표</b>로 받았어요(아래 준비 파일 둘). <code>주문.csv</code> 는 주문 하나에 한 줄인데 열 이름이 펴 둔 점 키예요. <code>상품.csv</code> 는 상품 하나에 한 줄이고 <code>order_id</code> 로 주문을 가리켜요.</p><ul><li>주문 줄은 <code>unflatten</code> 으로 다시 중첩하고(빈 글자는 <code>None</code>), <code>"items": []</code> 를 붙여요</li><li>상품 줄은 <code>order_id</code> 로 주문을 찾아 <code>items</code> 에 <code>{"title", "price"(정수), "qty"(정수)}</code> 로 넣어요</li><li>주문 표에 없는 주문번호를 가리키는 상품 줄은 넣지 말고 <code>주문 표에 없는 주문번호: A-1009 (하루 10분 SQL)</code> 을 출력해요 — 잇다가 짝이 없는 줄이에요</li></ul><p>그다음 주문마다 <code>json.dumps(order, ensure_ascii=False)</code> 한 줄씩, 마지막에 <code>3 주문 · 4 상품</code> 을 출력하세요.</p>`,
        needs: [["here = here.setdefault(part, {})", "F13/4", "없으면 만들고 들어가기"], ["by_id = {o[\"id\"]: o for o in orders}", "F13/3", "주문번호 → 주문 딕셔너리로 잇기"], ["csv.DictReader(f)", "F12/0", "줄마다 딕셔너리(값은 글자)"], ["json.dumps(order, ensure_ascii=False)", "F12/0", "한글 그대로 한 줄 JSON"]],
        prep: [{ name: "주문.csv", text: `id,customer.name,customer.address.city
A-1001,김하늘,서울
A-1002,이도윤,성남
A-1003,박서준,
` }, { name: "상품.csv", text: `order_id,title,price,qty
A-1001,파이썬 첫걸음,18000,1
A-1001,엑셀 업무 노트,12500,2
A-1002,데이터 정리의 기술,22000,1
A-1003,파이썬 첫걸음,18000,3
A-1009,하루 10분 SQL,15800,1
` }],
        io: [{ output: `주문 표에 없는 주문번호: A-1009 (하루 10분 SQL)
{"id": "A-1001", "customer": {"name": "김하늘", "address": {"city": "서울"}}, "items": [{"title": "파이썬 첫걸음", "price": 18000, "qty": 1}, {"title": "엑셀 업무 노트", "price": 12500, "qty": 2}]}
{"id": "A-1002", "customer": {"name": "이도윤", "address": {"city": "성남"}}, "items": [{"title": "데이터 정리의 기술", "price": 22000, "qty": 1}]}
{"id": "A-1003", "customer": {"name": "박서준", "address": {"city": null}}, "items": [{"title": "파이썬 첫걸음", "price": 18000, "qty": 3}]}
3 주문 · 4 상품` }],
        answer: `import csv
import json


def unflatten(flat):
    nested = {}
    for key, value in flat.items():
        parts = key.split(".")
        here = nested
        for part in parts[:-1]:
            here = here.setdefault(part, {})
        here[parts[-1]] = value
    return nested


with open("주문.csv", encoding="utf-8", newline="") as f:
    order_rows = list(csv.DictReader(f))
with open("상품.csv", encoding="utf-8", newline="") as f:
    item_rows = list(csv.DictReader(f))

orders = []
for row in order_rows:
    flat = {}
    for key, text in row.items():
        flat[key] = None if text == "" else text
    order = unflatten(flat)
    order["items"] = []
    orders.append(order)

by_id = {o["id"]: o for o in orders}
for row in item_rows:
    order = by_id.get(row["order_id"])
    if order is None:
        print(f"주문 표에 없는 주문번호: {row['order_id']} ({row['title']})")
        continue
    order["items"].append({"title": row["title"], "price": int(row["price"]), "qty": int(row["qty"])})

for order in orders:
    print(json.dumps(order, ensure_ascii=False))
count = sum(len(o["items"]) for o in orders)
print(len(orders), "주문 ·", count, "상품")
` },
    ],
    F14: [
      { title: "TOML 의 종류 — 출력 예측",
        text: `<p>동네 책방 설정을 TOML 글자로 읽어요. 실행하기 전에 출력을 먼저 예상해 보고, VS Code 에서 돌려 맞았는지 확인해 보세요. 따옴표 없는 날짜, <code>12500.0</code>, 따옴표로 감싼 키, 두 번 나온 <code>&#91;&#91;shelves&#93;&#93;</code> 를 눈여겨봐요.</p>`,
        needs: [["tomllib.loads(TEXT)", "F14/0", "글자로 가진 TOML 읽기"], ["type(value).__name__", "F14/2", "종류 이름 — date · float · list · dict"], ["conf[\"shelves\"][1]", "F14/0", "배열 표 = 딕셔너리 리스트"]],
        predict: true,
        io: [{ output: `name str
open date
rating int
price float
tags list
zip code str
owner dict
shelves list
9 04001
{'name': '만화', 'size': 3}
김하늘 2` }],
        answer: `import tomllib

TEXT = """
name = "동네 책방"
open = 2026-09-01
rating = 4
price = 12500.0
tags = ["책", "커피"]
"zip code" = "04001"

[owner]
name = "김하늘"

[[shelves]]
name = "소설"

[[shelves]]
name = "만화"
size = 3
"""

conf = tomllib.loads(TEXT)
for key, value in conf.items():
    print(key, type(value).__name__)
print(conf["open"].month, conf["zip code"])
print(conf["shelves"][1])
print(conf["owner"]["name"], len(conf["shelves"]))
`,
        explain: `<p>키는 쓴 차례대로 나와요. <code>open = 2026-09-01</code> 은 따옴표가 없어서 글자가 아니라 <code>date</code> 예요 — 그래서 <code>.month</code> 가 <code>9</code>. <code>12500.0</code> 은 소수점이 있어 <code>float</code>, <code>4</code> 는 <code>int</code>, <code>"04001"</code> 은 따옴표가 있어 앞자리 0 이 남는 <code>str</code> 이에요. 빈칸이 든 키는 <code>"zip code"</code> 처럼 따옴표로 감싸요. <code>[owner]</code> 는 <code>dict</code>, 두 번 쓴 배열 표 <code>shelves</code> 는 딕셔너리 둘의 <code>list</code> 이고, 둘째에만 <code>size</code> 가 있어도 괜찮아요.</p>` },
      { title: "에러 읽기 — File must be opened in binary mode",
        text: `<p>사진 정리기 설정 <code>config.toml</code>(아래 준비 파일)을 읽으려는데 이렇게 멈춰요.</p><pre>Traceback (most recent call last):
  File "C:\\Users\\me\\files-study\\main.py", line 4, in &lt;module&gt;
    config = tomllib.load(f)
  File "C:\\Users\\me\\AppData\\Local\\Programs\\Python\\Python315\\Lib\\tomllib\\_parser.py", line 71, in load
TypeError: File must be opened in binary mode, e.g. use &#96;open('foo.toml', 'rb')&#96;</pre><p>먼저 말해 보세요. <b>몇 번째 줄</b>에서, <b>무슨 에러</b>가, <b>왜</b> 났나요? (JSON 은 이렇게 열어도 되는데 TOML 은 왜 안 될까요? 에러 글 끝에 고칠 방법이 적혀 있어요.) 고쳐서 출력 예처럼 나오게 하세요.</p>`,
        needs: [["open(\"config.toml\", \"rb\")", "F14/1", "바이트 모드로 열기 — encoding 없이"], ["tomllib.load(f)", "F14/1", "TOML 파일 읽기"]],
        prep: [{ name: 'config.toml', text: APP_TOML }],
        given: `import tomllib

with open("config.toml", encoding="utf-8") as f:
    config = tomllib.load(f)

print(config["title"], "v", config["version"])
print("원본 폴더:", config["source"]["folder"])
print("확장자:", ", ".join(config["source"]["extensions"]))
print("규칙", len(config["rules"]), "개")
`,
        io: [{ output: `사진 정리기 v 3
원본 폴더: 사진/원본
확장자: .jpg, .png, .heic
규칙 2 개` }],
        answer: `import tomllib

with open("config.toml", "rb") as f:
    config = tomllib.load(f)

print(config["title"], "v", config["version"])
print("원본 폴더:", config["source"]["folder"])
print("확장자:", ", ".join(config["source"]["extensions"]))
print("규칙", len(config["rules"]), "개")
` },
      { title: "🏠 사진 정리기 — 설정대로 옮길 곳 정하기",
        text: `<p>사진 정리 도구를 만들어요. 같은 폴더의 <code>config.toml</code>(아래 준비 파일)을 읽고, 파일마다 <b>옮길 폴더</b>를 정해 출력하세요(진짜로 옮기지는 않아요).</p><ul><li>맨 위에 <code>사진 정리기 v3 · 2026-09-01 부터</code> — 제목 · 판 · 시작한 날</li><li>확장자(소문자로 바꿔서)가 <code>[source] extensions</code> 에 없으면 <code>건너뜀(사진 아님)</code></li><li>크기가 <code>[output] max_size_mb</code> 보다 크면 <code>건너뜀(25.5MB 넘음)</code></li><li><code>&#91;&#91;rules&#93;&#93;</code> 를 차례로 보며 <code>match</code> 에서 <code>*</code> 를 뗀 글자로 이름이 시작하면 <code>[output] folder</code> + <code>/</code> + <code>move_to</code>, 맞는 규칙이 없으면 <code>[output] folder</code></li></ul><p>파일은 <code>[("Screenshot_0901.png", 1.2), ("KakaoTalk_20260902_1.jpg", 3.4), ("IMG_1234.HEIC", 4.8), ("가족여행.jpg", 31.0), ("회의록.txt", 0.1)]</code>(이름, MB) 이에요. 규칙 · 폴더 이름을 코드에 직접 쓰지 말고 다 설정에서 꺼내세요 — 설정만 고치면 동작이 바뀌어야 해요.</p>`,
        needs: [["with open(\"config.toml\", \"rb\") as f:", "F14/1", "TOML 은 바이트 모드"], ["for rule in config[\"rules\"]:", "F14/1", "배열 표는 딕셔너리 리스트"], ["Path(name).suffix.lower()", "F14/4", "확장자 — 소문자로 바꿔 비교"]],
        prep: [{ name: 'config.toml', text: APP_TOML }],
        io: [{ output: `사진 정리기 v3 · 2026-09-01 부터
Screenshot_0901.png → 사진/정리/스크린샷
KakaoTalk_20260902_1.jpg → 사진/정리/메신저
IMG_1234.HEIC → 사진/정리
가족여행.jpg → 건너뜀(25.5MB 넘음)
회의록.txt → 건너뜀(사진 아님)` }],
        answer: `import tomllib
from pathlib import Path

with open("config.toml", "rb") as f:
    config = tomllib.load(f)


def destination(name, size_mb, config):
    ext = Path(name).suffix.lower()
    if ext not in config["source"]["extensions"]:
        return "건너뜀(사진 아님)"
    if size_mb > config["output"]["max_size_mb"]:
        return f'건너뜀({config["output"]["max_size_mb"]}MB 넘음)'
    folder = config["output"]["folder"]
    for rule in config["rules"]:
        prefix = rule["match"].replace("*", "")
        if name.startswith(prefix):
            return f'{folder}/{rule["move_to"]}'
    return folder


print(f'{config["title"]} v{config["version"]} · {config["started"]} 부터')
files = [("Screenshot_0901.png", 1.2), ("KakaoTalk_20260902_1.jpg", 3.4),
         ("IMG_1234.HEIC", 4.8), ("가족여행.jpg", 31.0), ("회의록.txt", 0.1)]
for name, size_mb in files:
    print(name, "→", destination(name, size_mb, config))
` },
      { title: "TOML → JSON 으로 바꾸고 왕복 확인",
        text: `<p>사진 정리기 설정을 웹 화면(브라우저)에서도 보여 주려고 해요. 브라우저는 TOML 을 못 읽으니 <b>JSON</b> 으로 바꿔 줘요 — 사람이 쓰는 설정은 TOML, 프로그램끼리 주고받는 데이터는 JSON 이에요.</p><ul><li><code>config.toml</code>(아래 준비 파일)을 읽어 <code>config.json</code> 으로 저장해요. 한글 그대로, 들여쓰기 2</li><li>TOML 의 날짜 <code>started</code> 는 JSON 에 없는 종류라, <code>default=</code> 함수로 ISO 글자로 바꿔요(복습: [[레슨:F3]])</li><li>JSON 글자를 출력한 뒤, <code>config.json</code> 을 다시 읽어 <code>started</code> 의 종류와 값을 출력하고, <code>date.fromisoformat</code> 으로 되돌려 TOML 에서 읽은 딕셔너리와 <b>같은지</b> <code>assert</code> 해요. 같으면 <code>왕복 OK</code></li></ul><p>JSON 쪽에는 TOML 의 주석이 남지 않는다는 것도 확인해 보세요.</p>`,
        needs: [["tomllib.load(f)", "F14/1", "TOML 읽기"], ["json.dumps(config, ensure_ascii=False, indent=2, default=to_json)", "F3/4", "JSON 에 없는 종류는 default 로"], ["date.fromisoformat(back[\"started\"])", "F3/0", "ISO 글자 → date"], ["assert back == config", "F4/4", "왕복 시험"]],
        prep: [{ name: 'config.toml', text: APP_TOML }],
        io: [{ output: `{
  "title": "사진 정리기",
  "version": 3,
  "debug": false,
  "started": "2026-09-01",
  "source": {
    "folder": "사진/원본",
    "extensions": [
      ".jpg",
      ".png",
      ".heic"
    ]
  },
  "output": {
    "folder": "사진/정리",
    "max_size_mb": 25.5,
    "keep_original": true
  },
  "rules": [
    {
      "name": "스크린샷",
      "match": "Screenshot*",
      "move_to": "스크린샷"
    },
    {
      "name": "메신저",
      "match": "KakaoTalk_*",
      "move_to": "메신저"
    }
  ]
}
str 2026-09-01
왕복 OK` }],
        answer: `import json
import tomllib
from datetime import date

with open("config.toml", "rb") as f:
    config = tomllib.load(f)


def to_json(o):
    if isinstance(o, date):
        return o.isoformat()
    raise TypeError(f"JSON 으로 못 바꿔요: {type(o).__name__}")


text = json.dumps(config, ensure_ascii=False, indent=2, default=to_json)
with open("config.json", "w", encoding="utf-8") as f:
    f.write(text + "\\n")
print(text)

with open("config.json", encoding="utf-8") as f:
    back = json.load(f)
print(type(back["started"]).__name__, back["started"])
back["started"] = date.fromisoformat(back["started"])
assert back == config
print("왕복 OK")
` },
    ],
    FB3: [
      { title: "카드 내역 엑셀 — 지저분한 표 읽기",
        text: `<p>카드사에서 내려받은 엑셀 가계부를 다섯 문제에 나눠 다뤄요. ① 지저분한 표 읽기 → ② 깨끗한 JSON 으로 저장 + 검사 → ③ JSON 으로 합계 → ④ 엑셀 보고서 · CSV 내보내기 → ⑤ 다음 달 파일을 겹치지 않게 더하기. 이 만들어 보기의 중심은 <b>형식 사이의 흐름</b>(지저분한 엑셀 → 검사한 JSON → 보기 좋은 엑셀 · CSV)이에요. 합계 내는 논리(③)는 파이썬 교과서 실전 4 에서 한 것과 같아요.</p><p>예제 파일 <code>가계부_카드내역.xlsx</code>(아래 준비 파일로 만들어요)의 「이용내역」 시트는 복습: [[레슨:F7]] 문제 3 「카드 내역 날짜 찍기」 에서 본 그 파일이에요 — 1 · 2행 병합 제목, 3행 빈 줄, 4행 머리줄 <code>이용일 · 가맹점 · 분류 · 이용금액</code>, 중간 빈 줄, 맨 아래 합계 줄, 숫자 날짜 두 칸. 그때는 <code>min_row=5</code> 로 행 번호를 외우고, 합계 줄에서 멈추고, 금액은 글자 그대로 찍었어요. 이번엔 <b>기록으로</b> 바꿔요.</p><ul><li>머리줄은 행 번호를 외우지 말고 <b>첫 칸이 <code>이용일</code> 인 줄</b>로 찾아요(카드사가 제목 줄을 하나 더 넣어도 안 깨지게)</li><li>빈 줄은 [[레슨:F7]] 의 <code>any(v is not None for v in row)</code> 로 가려 건너뛰고, 몇 줄인지 세요</li><li>합계 줄에서 멈추지 말고 금액을 챙겨 두었다가, 계산한 합계와 맞춰 봐요</li><li>금액 <code>"32,400원"</code> · <code>"-21,600원"</code>(환불)은 글자 → 정수 <code>32400</code> · <code>-21600</code></li><li>날짜는 [[레슨:F7]] 의 <code>to_date</code> 로 <code>date</code> 로. 하나만 바꿔요 — 날짜가 아닌 값이면 <code>None</code> 대신 <code>ValueError</code> 를 내서, 이상한 칸이 조용히 지나가지 않게 해요</li></ul><p>출력 예처럼 머리줄을 찾은 행, 건너뛴 빈 줄 수, 기록마다 한 줄, 마지막에 건수 · 계산한 합계 · 합계 줄의 금액이 같은지 출력하세요.</p>`,
        needs: [["ws.iter_rows(values_only=True)", "F7/2", "줄마다 값 튜플"], ["enumerate(…, 1)", "F5/3", "번호를 1부터 — 행 번호"], ["any(v is not None for v in row)", "F7/3", "값이 하나도 없으면 빈 줄"], ["dict(zip(header, row))", "F7/2", "머리줄과 짝지어 딕셔너리로"], ["from_excel(46270).date()", "F7/4", "엑셀 날짜 번호 → date"], ["value.date()", "F7/4", "datetime 에서 날짜만"]],
        prep: [SAMPLES_PREP],
        io: [{ output: `머리줄: 4행 ['이용일', '가맹점', '분류', '이용금액']
빈 줄 1개 건너뜀
2026-09-01 동네마트 식비 32,400
2026-09-02 버스·지하철 교통 1,500
2026-09-03 김밥천국 식비 8,000
2026-09-05 온라인서점 문화 21,600
2026-09-08 약국 건강 6,300
2026-09-12 동네마트 식비 45,900
2026-09-14 영화관 문화 14,000
2026-09-17 버스·지하철 교통 1,500
2026-09-20 온라인서점 문화 -21,600
2026-09-25 통신사 통신 33,000
2026-09-28 카페 식비 4,800
2026-09-30 동네마트 식비 27,350
12건 · 계산 174,750원 · 합계 줄 174,750원 → 같아요` }],
        answer: `from datetime import date, datetime
from openpyxl import load_workbook
from openpyxl.utils.datetime import from_excel


def won(text):
    return int(text.replace(",", "").replace("원", ""))


def to_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, (int, float)):
        return from_excel(value).date()  # 46270 같은 엑셀 날짜 번호
    raise ValueError(f"날짜가 아니에요: {value!r}")  # F7 의 to_date 는 None — 여기선 멈춰요


ws = load_workbook("가계부_카드내역.xlsx")["이용내역"]
header = None
records = []
blank = 0
total_line = None
for r, row in enumerate(ws.iter_rows(values_only=True), 1):
    if header is None:
        if row[0] == "이용일":
            header = list(row)
            print(f"머리줄: {r}행 {header}")
        continue
    if not any(v is not None for v in row):
        blank += 1
        continue
    if row[0] == "합계":
        total_line = won(row[3])
        continue
    rec = dict(zip(header, row))
    records.append({"날짜": to_date(rec["이용일"]), "가맹점": rec["가맹점"],
                    "분류": rec["분류"], "금액": won(rec["이용금액"])})

print(f"빈 줄 {blank}개 건너뜀")
for rec in records:
    print(rec["날짜"], rec["가맹점"], rec["분류"], f'{rec["금액"]:,}')
total = sum(rec["금액"] for rec in records)
same = "같아요" if total == total_line else "달라요!"
print(f"{len(records)}건 · 계산 {total:,}원 · 합계 줄 {total_line:,}원 → {same}")
` },
      { title: "깨끗한 가계부.json — 검사하고 저장",
        text: `<p>① 처럼 카드 내역을 읽어(이번엔 함수 <code>read_card(path)</code> 로 묶고, 날짜는 ISO 글자 <code>"2026-09-05"</code> 로), <b>검사를 통과했을 때만</b> <code>가계부.json</code> 으로 저장하세요. 모양은 <code>{"version": 1, "records": [...]}</code> — 나중에 칸이 늘면 판 번호로 알아봐요([[레슨:F4]]). 한글 그대로, 들여쓰기 2.</p><p>검사는 [[레슨:F6]] 의 <code>check_item(item, where)</code> 모양 그대로, 함수 <code>check(rec, where)</code> 가 <b>틀린 곳 목록</b>을 돌려줘요(첫 에러에서 멈추지 않고 모아서). 칸이 넷뿐이라 규칙표 <code>RULES</code> 없이 <code>if</code> 로 써요.</p><ul><li>필수 키 <code>날짜 · 가맹점 · 분류 · 금액</code> — 빠지면 그 목록만 돌려줘요(집합 차 <code>REQUIRED - rec.keys()</code>)</li><li>날짜는 <code>date.fromisoformat</code> 이 읽을 수 있는 글자</li><li>금액은 정수(<code>True</code> 도 <code>int</code> 로 통과하니 <code>bool</code> 을 먼저 걸러요), 0 은 안 돼요(환불은 음수라 괜찮아요)</li><li>분류는 <code>식비 · 교통 · 문화 · 건강 · 통신</code> 중 하나</li></ul><p>검사기도 시험해요. 저장하기 전에 일부러 틀린 기록 셋(출력 예 참고 — 날짜 · 분류 · 금액 글자, 금액 <code>True</code>, 키 빠짐)을 넣어 보고 걸리는지 출력하세요. 진짜 기록이 걸리면 저장하지 않고 멈춰요. 저장한 뒤엔 다시 읽어 판 · 건수와 넷째 기록(숫자였던 날짜)을 출력하세요.</p>`,
        needs: [["REQUIRED - rec.keys()", "F6/0", "빠진 키 = 키 집합의 차"], ["isinstance(money, bool) or not isinstance(money, int)", "F6/1", "True 도 int — bool 먼저"], ["errors += check(rec, f\"records[{i}]\")", "F6/3", "경로를 붙여 모으기"], ["except (TypeError, ValueError):", "F12/1", "날짜 글자가 틀리면 ValueError"], ["to_date(rec[\"이용일\"]).isoformat()", "F3/0", "date → ISO 글자"], ["json.dump({\"version\": 1, \"records\": records}, f, ensure_ascii=False, indent=2)", "F12/1", "한글 그대로 저장"]],
        prep: [SAMPLES_PREP],
        io: [{ output: `검사기 시험:
  tests[0].날짜: 2026-09-01 모양이어야 해요 ('2026-09-31')
  tests[0].금액: 정수(원)여야 해요 ('4,800원')
  tests[0].분류: ['건강', '교통', '문화', '식비', '통신'] 중 하나여야 해요 ('간식')
  tests[1].금액: 정수(원)여야 해요 (True)
  tests[2]: 빠진 키 ['가맹점', '분류']
검사 통과 12건
다시 읽음: 1 12 건
{"날짜": "2026-09-05", "가맹점": "온라인서점", "분류": "문화", "금액": 21600}` }],
        answer: `import json
from datetime import date, datetime
from openpyxl import load_workbook
from openpyxl.utils.datetime import from_excel


def won(text):
    return int(text.replace(",", "").replace("원", ""))


def to_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, (int, float)):
        return from_excel(value).date()  # 46270 같은 엑셀 날짜 번호
    raise ValueError(f"날짜가 아니에요: {value!r}")  # F7 의 to_date 는 None — 여기선 멈춰요


def read_card(path):
    ws = load_workbook(path)["이용내역"]
    header = None
    records = []
    for row in ws.iter_rows(values_only=True):
        if header is None:
            if row[0] == "이용일":
                header = list(row)
            continue
        if not any(v is not None for v in row) or row[0] == "합계":
            continue
        rec = dict(zip(header, row))
        records.append({"날짜": to_date(rec["이용일"]).isoformat(), "가맹점": rec["가맹점"],
                        "분류": rec["분류"], "금액": won(rec["이용금액"])})
    return records


REQUIRED = {"날짜", "가맹점", "분류", "금액"}
KINDS = {"식비", "교통", "문화", "건강", "통신"}


def check(rec, where):
    missing = REQUIRED - rec.keys()
    if missing:
        return [f"{where}: 빠진 키 {sorted(missing)}"]
    errors = []
    try:
        date.fromisoformat(rec["날짜"])
    except (TypeError, ValueError):
        errors.append(f"{where}.날짜: 2026-09-01 모양이어야 해요 ({rec['날짜']!r})")
    money = rec["금액"]
    if isinstance(money, bool) or not isinstance(money, int):
        errors.append(f"{where}.금액: 정수(원)여야 해요 ({money!r})")
    elif money == 0:
        errors.append(f"{where}.금액: 0원은 기록하지 않아요")
    if rec["분류"] not in KINDS:
        errors.append(f"{where}.분류: {sorted(KINDS)} 중 하나여야 해요 ({rec['분류']!r})")
    return errors


# 검사기부터 시험: 틀린 기록은 틀렸다고 해야 해요
tests = [
    {"날짜": "2026-09-31", "가맹점": "카페", "분류": "간식", "금액": "4,800원"},
    {"날짜": "2026-09-01", "가맹점": "카페", "분류": "식비", "금액": True},
    {"날짜": "2026-09-01", "금액": 4800},
]
print("검사기 시험:")
for i, rec in enumerate(tests):
    for e in check(rec, f"tests[{i}]"):
        print(" ", e)

records = read_card("가계부_카드내역.xlsx")
errors = []
for i, rec in enumerate(records):
    errors += check(rec, f"records[{i}]")
if errors:
    for e in errors:
        print(e)
    raise SystemExit("검사에 걸려서 저장하지 않았어요")
print(f"검사 통과 {len(records)}건")

with open("가계부.json", "w", encoding="utf-8") as f:
    json.dump({"version": 1, "records": records}, f, ensure_ascii=False, indent=2)

with open("가계부.json", encoding="utf-8") as f:
    book = json.load(f)
print("다시 읽음:", book["version"], len(book["records"]), "건")
print(json.dumps(book["records"][3], ensure_ascii=False))
` },
      { title: "JSON 에서 월 · 분류별 합계",
        text: `<p>같은 폴더에 ② 가 만든 <code>가계부.json</code>(아래 준비 파일)이 있어요. 모양은 <code>{"version": 1, "records": [{"날짜": "2026-09-01", "가맹점": …, "분류": …, "금액": 32400}, …]}</code> 이에요.</p><p>엑셀이 아니라 <b>검사를 마친 JSON</b> 에서 합계를 내요. 집계는 복습: <a href="../python/#lesson/X4" target="_blank" rel="noopener">파이썬 교과서 「실전 4: 가계부 분석기」 ↗</a> 와 같아요 — 월은 <code>rec["날짜"][:7]</code>, 합계는 <code>d.get(k, 0) + 금액</code>. 다른 점은 둘이에요.</p><ul><li>금액이 벌써 정수라 <code>int()</code> 가 없어요. 바꾸기 · 검사는 ② 에서 끝났으니까요</li><li>월마다 분류별 합계를 두 겹 딕셔너리 <code>{월: {분류: 금액}}</code> 에 모아요. 처음 보는 월이면 빈 딕셔너리를 만드는 <code>setdefault</code>([[레슨:F13]]) 가 편해요</li><li>월은 차례대로, 분류는 큰 금액 순으로 출력하고, 마지막에 환불(음수) 기록을 출력하세요. 문화비에서 환불이 빠졌는지 확인해 봐요</li></ul><p>⑤ 에서 10월이 더해져도 이 코드는 그대로 돌아가요.</p>`,
        needs: [["kinds = by_month.setdefault(month, {})", "F13/4", "처음 보는 월이면 새 딕셔너리"]],
        prep: [{ name: "가계부.json", text: `{
  "version": 1,
  "records": [
    {
      "날짜": "2026-09-01",
      "가맹점": "동네마트",
      "분류": "식비",
      "금액": 32400
    },
    {
      "날짜": "2026-09-02",
      "가맹점": "버스·지하철",
      "분류": "교통",
      "금액": 1500
    },
    {
      "날짜": "2026-09-03",
      "가맹점": "김밥천국",
      "분류": "식비",
      "금액": 8000
    },
    {
      "날짜": "2026-09-05",
      "가맹점": "온라인서점",
      "분류": "문화",
      "금액": 21600
    },
    {
      "날짜": "2026-09-08",
      "가맹점": "약국",
      "분류": "건강",
      "금액": 6300
    },
    {
      "날짜": "2026-09-12",
      "가맹점": "동네마트",
      "분류": "식비",
      "금액": 45900
    },
    {
      "날짜": "2026-09-14",
      "가맹점": "영화관",
      "분류": "문화",
      "금액": 14000
    },
    {
      "날짜": "2026-09-17",
      "가맹점": "버스·지하철",
      "분류": "교통",
      "금액": 1500
    },
    {
      "날짜": "2026-09-20",
      "가맹점": "온라인서점",
      "분류": "문화",
      "금액": -21600
    },
    {
      "날짜": "2026-09-25",
      "가맹점": "통신사",
      "분류": "통신",
      "금액": 33000
    },
    {
      "날짜": "2026-09-28",
      "가맹점": "카페",
      "분류": "식비",
      "금액": 4800
    },
    {
      "날짜": "2026-09-30",
      "가맹점": "동네마트",
      "분류": "식비",
      "금액": 27350
    }
  ]
}` }],
        io: [{ output: `2026-09 모두 174,750원
  식비  118,450원
  통신   33,000원
  문화   14,000원
  건강    6,300원
  교통    3,000원
환불: 2026-09-20 온라인서점 -21,600원` }],
        answer: `import json

with open("가계부.json", encoding="utf-8") as f:
    records = json.load(f)["records"]

by_month = {}
for rec in records:
    month = rec["날짜"][:7]
    kinds = by_month.setdefault(month, {})
    kinds[rec["분류"]] = kinds.get(rec["분류"], 0) + rec["금액"]

for month, kinds in sorted(by_month.items()):
    print(f"{month} 모두 {sum(kinds.values()):,}원")
    for kind, money in sorted(kinds.items(), key=lambda kv: -kv[1]):
        print(f"  {kind} {money:>8,}원")

for rec in records:
    if rec["금액"] < 0:
        print(f"환불: {rec['날짜']} {rec['가맹점']} {rec['금액']:,}원")
` },
      { title: "가계부 보고서 엑셀 + CSV 내보내기",
        text: `<p>같은 폴더에 ② 가 만든 <code>가계부.json</code>(아래 준비 파일)이 있어요. 모양은 <code>{"version": 1, "records": [{"날짜": "2026-09-01", "가맹점": …, "분류": …, "금액": 32400}, …]}</code> 이에요.</p><p>가족에게 보여 줄 <code>가계부_보고서.xlsx</code> 와, 다른 가계부 앱에 넣을 <code>가계부.csv</code> 를 만들어요.</p><ul><li>「요약」 시트(맨 앞) — 머리줄 <code>분류 · 금액</code>, 분류별 합계를 큰 순으로, 맨 아래 <code>합계</code> 줄은 <code>=SUM(B2:B6)</code> 수식([[레슨:F9]]). 머리줄은 흰 굵은 글씨에 파란 바탕 <code>4472C4</code>, 금액은 <code>#,##0</code>, A · B 열 너비 10 · 12([[레슨:F10]])</li><li>「요약」 의 D2 에 분류별 막대 차트 「분류별 지출」</li><li>「원본」 시트 — 기록 전부, 날짜는 <code>date</code> 로 바꿔 넣어 엑셀이 날짜로 알아보게, 머리줄 틀 고정</li><li><code>가계부.csv</code> — 엑셀에서 열어도 한글이 안 깨지게, 날짜는 ISO 글자 그대로</li></ul><p>그다음 이 코스의 습관대로 <b>다시 열어</b> 확인해요. 시트 순서, 요약 줄들(수식 글자 그대로), 파이썬으로 계산한 합계, 머리줄 굵기 · 색 · 금액 모양 · 너비, 원본 줄 수 · 틀 고정 · 날짜 모양, 차트 파일이 있는지(<code>.xlsx</code> 는 zip — [[레슨:F10]]), CSV 맨 앞 BOM 과 줄 수를 출력 예처럼 출력하세요. 겉모양은 엑셀에서 열어 봐요.</p>`,
        needs: [["Font(bold=…, color=\"FFFFFF\")  PatternFill(\"solid\", fgColor=\"4472C4\")", "F10/0", "머리줄 꾸미기"], ["c.number_format = \"#,##0\"", "F10/1", "값은 그대로, 보이는 모양만"], ["ws.freeze_panes = \"A2\"", "F10/2", "머리줄 틀 고정"], ["chart = BarChart()", "F10/3", "막대 차트 — Reference · add_data · set_categories · add_chart"], ["z.namelist()", "F10/4", "zip 목록에 xl/charts/chart1.xml"], ["f\"=SUM(B2:B{last})\"", "F9/0", "합계 줄은 수식 글자"], ["date.fromisoformat(rec[\"날짜\"])", "F12/2", "날짜 글자 → date 로 넣어야 엑셀 날짜"], ["csv.DictWriter(f, fieldnames=[…])", "F12/2", "딕셔너리 리스트를 CSV 로"], ["open(\"가계부.csv\", \"w\", encoding=\"utf-8-sig\", newline=\"\")", "F12/3", "엑셀에서 열 CSV"]],
        prep: [{ name: "가계부.json", text: `{
  "version": 1,
  "records": [
    {
      "날짜": "2026-09-01",
      "가맹점": "동네마트",
      "분류": "식비",
      "금액": 32400
    },
    {
      "날짜": "2026-09-02",
      "가맹점": "버스·지하철",
      "분류": "교통",
      "금액": 1500
    },
    {
      "날짜": "2026-09-03",
      "가맹점": "김밥천국",
      "분류": "식비",
      "금액": 8000
    },
    {
      "날짜": "2026-09-05",
      "가맹점": "온라인서점",
      "분류": "문화",
      "금액": 21600
    },
    {
      "날짜": "2026-09-08",
      "가맹점": "약국",
      "분류": "건강",
      "금액": 6300
    },
    {
      "날짜": "2026-09-12",
      "가맹점": "동네마트",
      "분류": "식비",
      "금액": 45900
    },
    {
      "날짜": "2026-09-14",
      "가맹점": "영화관",
      "분류": "문화",
      "금액": 14000
    },
    {
      "날짜": "2026-09-17",
      "가맹점": "버스·지하철",
      "분류": "교통",
      "금액": 1500
    },
    {
      "날짜": "2026-09-20",
      "가맹점": "온라인서점",
      "분류": "문화",
      "금액": -21600
    },
    {
      "날짜": "2026-09-25",
      "가맹점": "통신사",
      "분류": "통신",
      "금액": 33000
    },
    {
      "날짜": "2026-09-28",
      "가맹점": "카페",
      "분류": "식비",
      "금액": 4800
    },
    {
      "날짜": "2026-09-30",
      "가맹점": "동네마트",
      "분류": "식비",
      "금액": 27350
    }
  ]
}` }],
        io: [{ output: `['요약', '원본']
('분류', '금액')
('식비', 118450)
('통신', 33000)
('문화', 14000)
('건강', 6300)
('교통', 3000)
('합계', '=SUM(B2:B6)')
파이썬 합계 174,750
머리줄 True 004472C4 · 금액 모양 #,##0 · 너비 12.0
원본 12 줄 · 틀 고정 A2 · 날짜 2026-09-01 yyyy-mm-dd
차트 파일: True
CSV 맨 앞 BOM: True
12 줄 → 날짜,가맹점,분류,금액 | 2026-09-05,온라인서점,문화,21600` }],
        answer: `import csv
import json
import zipfile
from datetime import date
from openpyxl import Workbook, load_workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.styles import Font, PatternFill

with open("가계부.json", encoding="utf-8") as f:
    records = json.load(f)["records"]

totals = {}
for rec in records:
    totals[rec["분류"]] = totals.get(rec["분류"], 0) + rec["금액"]
kinds = sorted(totals, key=lambda k: -totals[k])

wb = Workbook()
summary = wb.active
summary.title = "요약"
summary.append(["분류", "금액"])
for kind in kinds:
    summary.append([kind, totals[kind]])
last = summary.max_row
summary.append(["합계", f"=SUM(B2:B{last})"])
for cell in summary[1]:
    cell.font = Font(bold=True, color="FFFFFF")
    cell.fill = PatternFill("solid", fgColor="4472C4")
for r in range(2, last + 2):
    summary[f"B{r}"].number_format = "#,##0"
summary.column_dimensions["A"].width = 10
summary.column_dimensions["B"].width = 12

chart = BarChart()
chart.title = "분류별 지출"
data = Reference(summary, min_col=2, min_row=1, max_row=last)
cats = Reference(summary, min_col=1, min_row=2, max_row=last)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
summary.add_chart(chart, "D2")

raw = wb.create_sheet("원본")
raw.append(["날짜", "가맹점", "분류", "금액"])
for rec in records:
    raw.append([date.fromisoformat(rec["날짜"]), rec["가맹점"], rec["분류"], rec["금액"]])
raw.freeze_panes = "A2"
wb.save("가계부_보고서.xlsx")

with open("가계부.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["날짜", "가맹점", "분류", "금액"])
    w.writeheader()
    w.writerows(records)

# 다시 열어 확인
wb = load_workbook("가계부_보고서.xlsx")
print(wb.sheetnames)
ws = wb["요약"]
for row in ws.iter_rows(values_only=True):
    print(row)
print("파이썬 합계", f"{sum(totals.values()):,}")
print("머리줄", ws["A1"].font.b, ws["A1"].fill.fgColor.rgb, "· 금액 모양", ws["B2"].number_format, "· 너비", ws.column_dimensions["B"].width)
ws = wb["원본"]
print("원본", ws.max_row - 1, "줄 · 틀 고정", ws.freeze_panes, "· 날짜", ws["A2"].value.date(), ws["A2"].number_format)
with zipfile.ZipFile("가계부_보고서.xlsx") as z:
    names = z.namelist()
print("차트 파일:", "xl/charts/chart1.xml" in names)

with open("가계부.csv", "rb") as f:
    print("CSV 맨 앞 BOM:", f.read(3) == b"\\xef\\xbb\\xbf")
with open("가계부.csv", encoding="utf-8-sig") as f:
    lines = f.read().splitlines()
print(len(lines) - 1, "줄 →", lines[0], "|", lines[4])
`,
        checks: [{ text: `<code>가계부_보고서.xlsx</code> 를 엑셀(또는 LibreOffice Calc)에서 열면 「요약」 이 맨 앞이고, 머리줄이 파란 바탕에 흰 굵은 글씨예요` }, { text: `금액이 <code>118,450</code> 처럼 쉼표로 보이고, 합계 칸에 파이썬 합계와 같은 <code>174,750</code> 이 보여요` }, { text: `D2 쯤에 분류 다섯 개의 막대 차트 「분류별 지출」 이 있어요` }, { text: `「원본」 시트의 날짜가 <code>2026-09-01</code> 모양이고, 아래로 내려도 머리줄이 남아 있어요` }, { text: `<code>가계부.csv</code> 를 엑셀에서 더블클릭으로 열어도 한글이 안 깨져요` }] },
      { title: "다음 달 카드 내역 더하기 — 겹침 막기",
        text: `<p>한 달 뒤 <code>가계부_카드내역_10월.xlsx</code>(아래 준비 파일로 만들어요)를 내려받았어요. 그런데 조회 기간이 <code>2026-09-28 ~ 2026-10-31</code> 이라 <b>앞 두 건이 9월 파일과 같은 건</b>이에요. 그냥 붙이면 9월 28일 카페 · 9월 30일 동네마트가 두 번 들어가요. 실수로 같은 파일을 두 번 넣을 수도 있고요.</p><ul><li><code>add_card(path)</code> — <code>가계부.json</code> 을 읽고(없으면 빈 가계부), 카드 파일을 읽어 <b>아직 없는 건만</b> 더해 날짜 순으로 다시 저장해요. 읽기는 ② 의 <code>read_card</code> 그대로예요</li><li>같은 건인지는 <b>열쇠</b> <code>(날짜, 가맹점, 금액)</code> 튜플로 봐요. 이미 있는 열쇠를 집합에 모아 두고, 새 기록의 열쇠가 그 안에 있으면 건너뛰어요</li><li>파일마다 <code>몇 건 중 몇 건 더함 · 겹침 몇 건 → 모두 몇 건</code> 을 출력해요</li></ul><p>연습이라 처음에 <code>가계부.json</code> 을 지우고 시작해서, 9월 → 10월 → 10월(한 번 더) 차례로 넣으세요. 마지막에 월별 합계를 출력해요. 9월 합계가 ① 의 합계 줄과 같은지 봐요.</p><div class="bk-warn"><b>열쇠는 약속이에요</b> — 같은 날 같은 가게에서 같은 금액을 두 번 쓰면(버스를 두 번 탄 날) 이 열쇠로는 한 건으로 합쳐져요. 진짜 카드 내역에는 <b>승인번호</b> 칸이 있어서 그걸 열쇠로 쓰면 정확해요. 내 데이터에 무엇이 「하나뿐인 값」 인지 먼저 찾아보는 게 겹침 막기의 시작이에요.</div>`,
        needs: [["if key_of(rec) in seen:", "F12/2", "이미 본 것은 건너뛰기 — 키 합집합과 같은 모양"], ["json.dump({\"version\": 1, \"records\": records}, f, ensure_ascii=False, indent=2)", "F12/1", "날짜 순으로 다시 저장"]],
        prep: [SAMPLES_PREP],
        io: [{ output: `가계부_카드내역.xlsx: 12건 중 12건 더함 · 겹침 0건 → 모두 12건
가계부_카드내역_10월.xlsx: 7건 중 5건 더함 · 겹침 2건 → 모두 17건
가계부_카드내역_10월.xlsx: 7건 중 0건 더함 · 겹침 7건 → 모두 17건
2026-09 174,750원
2026-10 92,200원` }],
        answer: `import json
from pathlib import Path
from datetime import date, datetime
from openpyxl import load_workbook
from openpyxl.utils.datetime import from_excel


def won(text):
    return int(text.replace(",", "").replace("원", ""))


def to_date(value):
    if isinstance(value, datetime):
        return value.date()
    if isinstance(value, (int, float)):
        return from_excel(value).date()  # 46270 같은 엑셀 날짜 번호
    raise ValueError(f"날짜가 아니에요: {value!r}")  # F7 의 to_date 는 None — 여기선 멈춰요


def read_card(path):
    ws = load_workbook(path)["이용내역"]
    header = None
    records = []
    for row in ws.iter_rows(values_only=True):
        if header is None:
            if row[0] == "이용일":
                header = list(row)
            continue
        if not any(v is not None for v in row) or row[0] == "합계":
            continue
        rec = dict(zip(header, row))
        records.append({"날짜": to_date(rec["이용일"]).isoformat(), "가맹점": rec["가맹점"],
                        "분류": rec["분류"], "금액": won(rec["이용금액"])})
    return records


STORE = Path("가계부.json")


def load_store():
    if not STORE.exists():
        return []
    with STORE.open(encoding="utf-8") as f:
        return json.load(f)["records"]


def save_store(records):
    records = sorted(records, key=lambda rec: rec["날짜"])
    with STORE.open("w", encoding="utf-8") as f:
        json.dump({"version": 1, "records": records}, f, ensure_ascii=False, indent=2)


def key_of(rec):
    return (rec["날짜"], rec["가맹점"], rec["금액"])


def add_card(path):
    records = load_store()
    seen = set()
    for rec in records:
        seen.add(key_of(rec))
    new = read_card(path)
    added = []
    for rec in new:
        if key_of(rec) in seen:
            continue
        seen.add(key_of(rec))
        added.append(rec)
    save_store(records + added)
    print(f"{path}: {len(new)}건 중 {len(added)}건 더함 · 겹침 {len(new) - len(added)}건 → 모두 {len(records) + len(added)}건")


STORE.unlink(missing_ok=True)  # 연습: 빈 가계부에서 시작
add_card("가계부_카드내역.xlsx")
add_card("가계부_카드내역_10월.xlsx")
add_card("가계부_카드내역_10월.xlsx")  # 실수로 한 번 더

by_month = {}
for rec in load_store():
    month = rec["날짜"][:7]
    by_month[month] = by_month.get(month, 0) + rec["금액"]
for month, money in by_month.items():
    print(month, f"{money:,}원")
` },
      { title: "복습 — 🏠 가계부 설정은 TOML 로 · 예산 알림",
        text: `<p>가계부 프로그램에 설정 파일을 붙여요. 사람이 손으로 고치는 설정이라 JSON 이 아니라 TOML 로 해요(복습: [[레슨:F14]] 의 형식 고르기). 같은 폴더의 <code>가계부.toml</code>(아래 준비 파일)을 읽어 출력 예처럼 찍으세요.</p><ul><li>파일은 <code>"rb"</code> 로 열어 <code>tomllib.load(f)</code> 로 읽어요. 첫 줄은 주인 이름과 <code>start</code> 의 종류 이름 · ISO 글자, 둘째 줄은 카드 파일 이름이에요</li><li><code>[budget]</code> 표를 차례로 돌며, ③ 에서 구한 9월 분류별 합계(아래 <code>spent</code>)가 예산의 몇 % 인지 소수 첫째 자리까지 찍어요. 금액은 8칸 오른쪽 맞춤(<code>{used:&gt;8,}</code>), 비율은 <code>{ratio:5.1f}%</code></li><li><code>&#91;&#91;alerts&#93;&#93;</code> 는 딕셔너리 리스트예요. 비율(<code>ratio</code>)이 큰 알림부터 보고, 처음으로 넘은(같아도 넘은 걸로) 알림 이름을 줄 끝에 붙여요. 넘은 게 없으면 아무것도 안 붙여요</li><li>마지막에 한글 키를 따옴표 없이 쓴 <code>[budget]</code> 두 줄을 <code>tomllib.loads</code> 로 읽어 에러를 찍어요</li></ul><p>TOML 에서 따옴표 없는 키는 영어 · 숫자 · <code>_</code> · <code>-</code> 만 돼요. 그래서 한글 키는 <code>"식비" = 100000</code> 처럼 따옴표로 감싸요.</p><pre>spent = {"식비": 118450, "통신": 33000, "문화": 14000, "건강": 6300, "교통": 3000}</pre>`,
        needs: [["with open(\"가계부.toml\", \"rb\") as f:", "F14/1", "TOML 은 바이트 모드로"], ["tomllib.load(f)", "F14/1", "파일에서 딕셔너리로"], ["conf[\"start\"].isoformat()", "F14/2", "따옴표 없는 날짜는 date"], ["conf[\"alerts\"]", "F14/0", "배열 표 = 딕셔너리 리스트"], ["except tomllib.TOMLDecodeError as e:", "F14/2", "문법이 틀리면 줄 · 칸이 붙은 에러"]],
        prep: [{ name: "가계부.toml", text: `# 가계부 설정 — 사람이 고치는 파일이라 주석을 달 수 있어요
owner = "김하늘"
start = 2026-09-01
card_file = "가계부_카드내역.xlsx"

[budget]   # 분류별 한 달 예산(원) — 한글 키는 따옴표로
"식비" = 100000
"교통" = 10000
"문화" = 15000
"건강" = 10000
"통신" = 33000

[[alerts]]
name = "주의"
ratio = 0.8

[[alerts]]
name = "넘음"
ratio = 1.0
` }],
        io: [{ output: `김하늘 님 가계부 · date 2026-09-01
카드 파일: 가계부_카드내역.xlsx
식비  118,450 /  100,000원 118.5% 넘음
교통    3,000 /   10,000원  30.0%
문화   14,000 /   15,000원  93.3% 주의
건강    6,300 /   10,000원  63.0%
통신   33,000 /   33,000원 100.0% 넘음
TOMLDecodeError: Invalid statement (at line 2, column 1)` }],
        answer: `import tomllib

with open("가계부.toml", "rb") as f:
    conf = tomllib.load(f)

start = conf["start"]
print(conf["owner"], "님 가계부 ·", type(start).__name__, start.isoformat())
print("카드 파일:", conf["card_file"])

# ③ 에서 구한 2026-09 분류별 합계
spent = {"식비": 118450, "통신": 33000, "문화": 14000, "건강": 6300, "교통": 3000}

alerts = sorted(conf["alerts"], key=lambda a: -a["ratio"])
for kind, limit in conf["budget"].items():
    used = spent.get(kind, 0)
    ratio = used / limit * 100
    mark = ""
    for a in alerts:
        if ratio >= a["ratio"] * 100:
            mark = a["name"]
            break
    print(f"{kind} {used:>8,} / {limit:>8,}원 {ratio:5.1f}% {mark}".rstrip())

try:
    tomllib.loads("[budget]\\n식비 = 100000\\n")
except tomllib.TOMLDecodeError as e:
    print("TOMLDecodeError:", e)
` },
    ],
  },
};
