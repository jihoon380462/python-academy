// courses/data/book.js — 「데이터 분석 교과서」 데이터 (v2.33.0, 설계 specs/courses-t3-t7.md). 화면은 core/ui-views-book.js.
// 연습: 내 PC 의 VS Code + 파이썬 + pandas matplotlib. 예시 답은 check_book 이 python3 로 실제 실행해 출력 예와 비교(파이썬 기본 검사).
// 가상 데이터(이 교과서가 만든 것 — 저작권 없음). 만들어 보기는 prep: { name: 'cafe.csv', text: CAFE_CSV } 처럼 같은 파일을 준비
const CAFE_CSV = `날짜,지점,메뉴,분류,가격,수량
2026-10-01,강남,치즈케이크,디저트,5500,9
2026-10-01,강남,카페라테,커피,4500,6
2026-10-01,강남,녹차라테,차,4800,4
2026-10-01,홍대,카페라테,커피,4500,5
2026-10-01,홍대,바닐라라테,커피,5000,9
2026-10-01,홍대,레몬차,차,4200,4
2026-10-01,판교,아메리카노,커피,4000,7
2026-10-01,판교,딸기스무디,음료,5800,2
2026-10-01,판교,녹차라테,차,4800,3
2026-10-02,강남,카페라테,커피,4500,6
2026-10-02,강남,레몬차,차,4200,8
2026-10-02,강남,녹차라테,차,4800,4
2026-10-02,홍대,녹차라테,차,4800,7
2026-10-02,홍대,치즈케이크,디저트,5500,3
2026-10-02,홍대,크루아상,디저트,3500,7
2026-10-02,판교,크루아상,디저트,3500,2
2026-10-02,판교,아메리카노,커피,4000,8
2026-10-02,판교,카페라테,커피,4500,5
2026-10-03,강남,레몬차,차,4200,8
2026-10-03,강남,녹차라테,차,4800,4
2026-10-03,강남,카페라테,커피,4500,10
2026-10-03,홍대,레몬차,차,4200,7
2026-10-03,홍대,딸기스무디,음료,5800,6
2026-10-03,홍대,치즈케이크,디저트,5500,10
2026-10-03,판교,녹차라테,차,4800,6
2026-10-03,판교,바닐라라테,커피,5000,9
2026-10-03,판교,아메리카노,커피,4000,4
2026-10-04,강남,아메리카노,커피,4000,9
2026-10-04,강남,레몬차,차,4200,9
2026-10-04,강남,카페라테,커피,4500,10
2026-10-04,홍대,크루아상,디저트,3500,9
2026-10-04,홍대,딸기스무디,음료,5800,10
2026-10-04,홍대,바닐라라테,커피,5000,11
2026-10-04,판교,치즈케이크,디저트,5500,3
2026-10-04,판교,바닐라라테,커피,5000,9
2026-10-04,판교,카페라테,커피,4500,5
2026-10-05,강남,카페라테,커피,4500,10
2026-10-05,강남,레몬차,차,4200,7
2026-10-05,강남,바닐라라테,커피,5000,8
2026-10-05,홍대,딸기스무디,음료,5800,3
2026-10-05,홍대,바닐라라테,커피,5000,5
2026-10-05,홍대,레몬차,차,4200,7
2026-10-05,판교,크루아상,디저트,3500,3
2026-10-05,판교,카페라테,커피,4500,7
2026-10-05,판교,바닐라라테,커피,5000,7
2026-10-06,강남,아메리카노,커피,4000,10
2026-10-06,강남,치즈케이크,디저트,5500,8
2026-10-06,강남,딸기스무디,음료,5800,6
2026-10-06,홍대,치즈케이크,디저트,5500,7
2026-10-06,홍대,딸기스무디,음료,5800,6
2026-10-06,홍대,바닐라라테,커피,5000,9
2026-10-06,판교,딸기스무디,음료,5800,4
2026-10-06,판교,아메리카노,커피,4000,7
2026-10-06,판교,크루아상,디저트,3500,7
2026-10-07,강남,카페라테,커피,4500,11
2026-10-07,강남,아메리카노,커피,4000,8
2026-10-07,강남,치즈케이크,디저트,5500,9
2026-10-07,홍대,딸기스무디,음료,5800,6
2026-10-07,홍대,바닐라라테,커피,5000,10
2026-10-07,홍대,치즈케이크,디저트,5500,5
2026-10-07,판교,아메리카노,커피,4000,5
2026-10-07,판교,녹차라테,차,4800,6
2026-10-07,판교,바닐라라테,커피,5000,4
2026-10-08,강남,딸기스무디,음료,5800,6
2026-10-08,강남,아메리카노,커피,4000,7
2026-10-08,강남,카페라테,커피,4500,11
2026-10-08,홍대,녹차라테,차,4800,6
2026-10-08,홍대,딸기스무디,음료,5800,3
2026-10-08,홍대,크루아상,디저트,3500,4
2026-10-08,판교,딸기스무디,음료,5800,4
2026-10-08,판교,녹차라테,차,4800,3
2026-10-08,판교,레몬차,차,4200,5
2026-10-09,강남,레몬차,차,4200,6
2026-10-09,강남,치즈케이크,디저트,5500,9
2026-10-09,강남,녹차라테,차,4800,7
2026-10-09,홍대,녹차라테,차,4800,4
2026-10-09,홍대,카페라테,커피,4500,6
2026-10-09,홍대,아메리카노,커피,4000,6
2026-10-09,판교,녹차라테,차,4800,6
2026-10-09,판교,아메리카노,커피,4000,5
2026-10-09,판교,딸기스무디,음료,5800,4
2026-10-10,강남,레몬차,차,4200,7
2026-10-10,강남,아메리카노,커피,4000,10
2026-10-10,강남,카페라테,커피,4500,8
2026-10-10,홍대,치즈케이크,디저트,5500,10
2026-10-10,홍대,카페라테,커피,4500,12
2026-10-10,홍대,딸기스무디,음료,5800,11
2026-10-10,판교,아메리카노,커피,4000,8
2026-10-10,판교,녹차라테,차,4800,5
2026-10-10,판교,치즈케이크,디저트,5500,5
2026-10-11,강남,크루아상,디저트,3500,7
2026-10-11,강남,녹차라테,차,4800,9
2026-10-11,강남,아메리카노,커피,4000,9
2026-10-11,홍대,아메리카노,커피,4000,9
2026-10-11,홍대,카페라테,커피,4500,11
2026-10-11,홍대,딸기스무디,음료,5800,7
2026-10-11,판교,카페라테,커피,4500,4
2026-10-11,판교,바닐라라테,커피,5000,4
2026-10-11,판교,레몬차,차,4200,2
2026-10-12,강남,바닐라라테,커피,5000,8
2026-10-12,강남,레몬차,차,4200,8
2026-10-12,강남,아메리카노,커피,4000,6
2026-10-12,홍대,카페라테,커피,4500,9
2026-10-12,홍대,크루아상,디저트,3500,6
2026-10-12,홍대,딸기스무디,음료,5800,4
2026-10-12,판교,레몬차,차,4200,4
2026-10-12,판교,바닐라라테,커피,5000,7
2026-10-12,판교,딸기스무디,음료,5800,2
2026-10-13,강남,카페라테,커피,4500,9
2026-10-13,강남,크루아상,디저트,3500,7
2026-10-13,강남,녹차라테,차,4800,7
2026-10-13,홍대,레몬차,차,4200,3
2026-10-13,홍대,아메리카노,커피,4000,10
2026-10-13,홍대,카페라테,커피,4500,7
2026-10-13,판교,레몬차,차,4200,3
2026-10-13,판교,녹차라테,차,4800,6
2026-10-13,판교,치즈케이크,디저트,5500,2
2026-10-14,강남,녹차라테,차,4800,5
2026-10-14,강남,레몬차,차,4200,9
2026-10-14,강남,바닐라라테,커피,5000,10
2026-10-14,홍대,아메리카노,커피,4000,7
2026-10-14,홍대,크루아상,디저트,3500,8
2026-10-14,홍대,레몬차,차,4200,3
2026-10-14,판교,레몬차,차,4200,3
2026-10-14,판교,딸기스무디,음료,5800,4
2026-10-14,판교,바닐라라테,커피,5000,5
`;
const SURVEY_CSV = `응답번호,이름,나이,지점,만족도,방문일,한마디
1,김민수,29,강남,5,2026-10-02,커피가 맛있어요
2,이영희,34,홍대점,4,2026/10/03,자리가 좁아요
3,박철수,,강남, 3 ,2026-10-03,
4,최지우,41,판교,5,10월 4일,케이크 최고
5,정하늘,스물여덟,홍대,4,2026-10-05,음악이 좋아요
6,김민수,29,강남,5,2026-10-02,커피가 맛있어요
7,한소희,23, 판교 ,다섯,2026-10-06,친절해요
8,오세훈,52,GANGNAM,2,2026-10-06,너무 비싸요
9,윤아름,31,홍대,4,2026-10-07,
10,장도윤,27,판교점,,2026-10-08,와이파이가 느려요
11,임수빈,38,강남,1,2026-10-08,주문이 늦게 나왔어요
12,서지호,999,홍대,5,2026-10-09,또 올게요
13,강다은,26,판교,4,2026-10-10,디저트가 맛있어요
14,조민재,45,강남점,3,2026-10-11,보통이에요
15,배수지,33,홍대,5,2026.10.12,분위기 최고
16,신동엽,-1,판교,4,2026-10-12,주차가 불편해요
17,권나래,30,강남,4,2026-10-13,라테 추천해요
18,황보름,36,홍대,3 ,2026-10-13,조금 시끄러워요
19,이영희,34,홍대점,4,2026/10/03,자리가 좁아요
20,문채원,28,판교,5,2026-10-14,
`;
const BOOK = {
  meta: {
    prereq: [
      { lessons: ['P0'], chapters: [0], ref: 'SETUP/0', btn: '시작하기 · 준비물 보기',
        title: '먼저 꼭! 파이썬 교과서 「시작하기」 · 가상 환경 · pandas matplotlib 설치',
        html: '이 교과서의 예제와 「만들어 보기」 는 전부 <b>내 PC 의 VS Code + 파이썬</b> 으로 돌려요. 아직이면 <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 부터. 문법은 파이썬 교과서 챕터 4(클래스 · 예외 · 모듈)까지 알면 편해요. 라이브러리는 가상 환경에 <code>python -m pip install pandas matplotlib</code> 한 번.' },
    ],
    kicker: '📊 데이터 분석 교과서', hero: '표를 읽고, 정리하고, 그려서 답하기',
    heroP: '<b>pandas</b> 로 표 데이터를 읽고 · 정리하고 · 요약하고 <b>matplotlib</b> 로 그려서, 질문에 근거 있는 답을 써요. 데이터는 이 교과서가 만든 가상 카페 매출과 지저분한 설문이에요.',
    dexName: '데이터 분석 도감', dexShort: '도감', dexWhat: '코드·개념', dexHint: '한국어로도 찾기',
    dexExamples: '<code>read_csv</code>, <code>groupby</code>, <code>fillna</code>, <code>plt.savefig</code>', dexPlaceholder: '🔍 찾기 …', dexAlt: '',
    dexDocs: '파이썬 공식 문서 <a href="https://docs.python.org/ko/3/" target="_blank" rel="noopener">docs.python.org</a>',
    dexRun: '코드는 📋 복사해서 VS Code 의 .py 파일에 붙여 실행할 수 있고', builtinsName: '자주 보는 표', builtinsSub: '한눈에', builtinsChip: '📋 자주 보는 표',
    copyToast: '📋 복사했어요. VS Code 의 .py 파일에 붙여 넣어 실행해요',
    exampleLabel: '예제 코드 — VS Code 의 .py 파일로 실행',
    makeIntro: 'VS Code 에서 공부 폴더(<code>data-study</code>)에 파일(예: <code>{file}</code>)을 만들고 직접 짜 보세요. 「출력 예」 와 같은 글이 나오면 성공이에요. 「내 화면에서 확인할 것」 은 내 컴퓨터 화면에서 직접 보는 거예요.',
    makeTail: '막히면 「필요한 코드」 를 눌러 설명을 다시 보고, 그래도 막히면 맨 아래 예시 답을 펴 보세요. 예시 답과 달라도 같은 결과가 나오면 맞아요.',
    fileExt: '.py', prepLabel: '준비 파일 — .py 파일과 같은 폴더에', answerLabel: '예시 답', needsLabel: '필요한 코드', checkLabel: '확인 코드', outLabel: '출력 예', checksLabel: '내 화면에서 확인할 것',
  },
  setup: {
    title: '시작하기: 파이썬 교과서의 준비 그대로',
    pages: [
      { title: '1. 준비물과 쓰는 법', html: `<p>이 교과서는 <b>내 PC 의 VS Code + 파이썬</b> 으로 해요. <a href="../python/" target="_blank" rel="noopener">파이썬 교과서 「시작하기」 ↗</a> 1~3 을 했다면 거의 준비 끝이에요.</p>
<table class="kb"><tbody><tr><td><b>공부 폴더</b></td><td><code>data-study</code> 를 만들고 VS Code 로 열어요</td></tr><tr><td><b>가상 환경</b></td><td><code>python -m venv .venv</code> → 켜기(파이썬 교과서 「pip 와 가상 환경」)</td></tr><tr><td><b>라이브러리</b></td><td>공부 폴더의 가상 환경에서 <code>python -m pip install pandas matplotlib</code>(파이썬 교과서 「pip 와 가상 환경」)</td></tr></tbody></table>`,
        example: { label: '예제 명령 — VS Code 터미널에서', shell: 'mkdir data-study\ncd data-study\npython -m venv .venv\npython -m pip install pandas matplotlib' } },
      { title: '2. 데이터 파일 cafe.csv · survey.csv', html: `<p>이 교과서는 <b>두 파일</b>로 연습해요. 아래 내용을 📋 복사해서 공부 폴더에 저장하세요(인코딩 UTF-8). 이 교과서가 만든 가상 데이터라 마음껏 써도 돼요.</p><ul><li><code>cafe.csv</code> — 카페 세 지점의 2주 매출(날짜 · 지점 · 메뉴 · 분류 · 가격 · 수량, 126줄)</li><li><code>survey.csv</code> — 손님 설문 20줄. <b>일부러 지저분해요</b>(빠진 값 · 글자로 쓴 나이 · 「홍대점」 과 「홍대」 · 중복) — 챕터 2 에서 정리해요</li></ul>`,
        example: { label: 'cafe.csv — 이 내용을 그대로 저장', shell: CAFE_CSV } },
      { title: '3. survey.csv', html: `<p>설문 파일이에요. 같은 폴더에 <code>survey.csv</code> 로 저장하세요.</p>`,
        example: { label: 'survey.csv — 이 내용을 그대로 저장', shell: SURVEY_CSV } },
    ],
  },
  builtins: [],
  tasks: {
    P0: [
      {"title": "설치 확인 — 준비 완료", "text": "공부 폴더의 가상 환경에 pandas 와 matplotlib 을 설치하고, 둘 다 불러와지는지 확인하는 파일을 만드세요. 둘 다 되면 <code>pandas 준비 완료</code> · <code>matplotlib 준비 완료</code> 를 출력해요. 버전 숫자는 컴퓨터마다 달라서 출력 예에 없어요 — 내 화면에서 따로 확인해요.", "needs": [["import pandas as pd", "P0/3", "pandas 를 pd 라는 이름으로 불러오기"], ["python -m pip install pandas matplotlib", "P0/3", "가상 환경을 켠 터미널에서 한 번"]], "io": [{"output": "pandas 준비 완료\nmatplotlib 준비 완료"}], "checks": [{"text": "VS Code 터미널 앞에 `(.venv)` 가 보이는 상태에서 설치했다"}, {"text": "`print(pd.__version__)` 을 더 넣어 내 pandas 버전(2.x 또는 3.x)을 확인했다"}], "answer": "import pandas as pd\nimport matplotlib\n\nprint(\"pandas 준비 완료\")\nprint(\"matplotlib 준비 완료\")"},
      {"title": "파이썬만으로 총매출", "text": "pandas 없이 파이썬의 <code>csv</code> 모듈로 같은 폴더의 <code>cafe.csv</code> 를 읽어, 판매 기록이 몇 줄인지와 총매출(가격 × 수량을 모두 더한 값)을 출력하세요. 가격 · 수량은 글자로 읽히니 <code>int()</code> 로 바꿔요.", "needs": [["csv.DictReader(f)", "P0/2", "한 줄을 열 이름 → 값 딕셔너리로"], ["int(row[\"가격\"]) * int(row[\"수량\"])", "P0/1", "쪼갠 값은 글자 — 숫자로 바꿔 곱하기"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "판매 기록 126 줄\n총매출 3833600 원"}], "answer": "import csv\n\ncount = 0\ntotal = 0\nwith open(\"cafe.csv\", encoding=\"utf-8\") as f:\n    for row in csv.DictReader(f):\n        count += 1\n        total += int(row[\"가격\"]) * int(row[\"수량\"])\n\nprint(\"판매 기록\", count, \"줄\")\nprint(\"총매출\", total, \"원\")"},
      {"title": "지점별 매출과 한 줄 결론", "text": "질문 「어느 지점이 제일 많이 팔았나?」 에 답해요. <code>csv</code> 모듈과 딕셔너리로 지점마다 매출을 더하고, 지점 이름 · 매출을 한 줄씩(처음 나온 차례대로) 출력하세요. 마지막 줄에는 <code>결론: 강남 지점이 1494000원으로 1등이에요</code> 처럼 결론을 문장으로 써요.", "needs": [["total.get(지점, 0) + 값", "P0/2", "딕셔너리에 지점마다 더해 쌓기"], ["max(total, key=total.get)", "P0/2", "값이 가장 큰 키 찾기"], ["csv.DictReader(f)", "P0/2", "CSV 를 딕셔너리로 한 줄씩"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "강남 1494000\n홍대 1391700\n판교 947900\n결론: 강남 지점이 1494000원으로 1등이에요"}], "answer": "import csv\n\ntotal = {}\nwith open(\"cafe.csv\", encoding=\"utf-8\") as f:\n    for row in csv.DictReader(f):\n        money = int(row[\"가격\"]) * int(row[\"수량\"])\n        total[row[\"지점\"]] = total.get(row[\"지점\"], 0) + money\n\nfor name, money in total.items():\n    print(name, money)\nbest = max(total, key=total.get)\nprint(f\"결론: {best} 지점이 {total[best]}원으로 1등이에요\")"},
    ],
    P1: [
      {"title": "카페 표 크기 재기", "text": "<code>cafe.csv</code> 를 pandas 로 읽어 <code>행 126 · 열 6</code> 처럼 표의 크기를 출력하고, 다음 줄에 열 이름 리스트를 출력하세요.", "needs": [["pd.read_csv(\"cafe.csv\")", "P1/1", "CSV 파일을 DataFrame 으로"], ["rows, cols = df.shape", "P1/2", "(행 수, 열 수) 튜플 — 괄호 없음"], ["list(df.columns)", "P1/2", "열 이름 리스트"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "행 126 · 열 6\n['날짜', '지점', '메뉴', '분류', '가격', '수량']"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nrows, cols = df.shape\nprint(f\"행 {rows} · 열 {cols}\")\nprint(list(df.columns))"},
      {"title": "처음 · 끝 훑어보기", "text": "<code>cafe.csv</code> 의 앞 3줄과 뒤 2줄을 출력하세요. 사이에 <code>...</code> 한 줄을 넣어 구분해요. 표는 <code>to_string()</code> 으로 찍어요.", "needs": [["df.head(3)", "P1/2", "앞 3줄"], ["df.tail(2)", "P1/2", "뒤 2줄"], ["print(df.to_string())", "P1/0", "표를 자르지 않고 출력"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "           날짜  지점     메뉴   분류    가격  수량\n0  2026-10-01  강남  치즈케이크  디저트  5500   9\n1  2026-10-01  강남   카페라테   커피  4500   6\n2  2026-10-01  강남   녹차라테    차  4800   4\n...\n             날짜  지점     메뉴  분류    가격  수량\n124  2026-10-14  판교  딸기스무디  음료  5800   4\n125  2026-10-14  판교  바닐라라테  커피  5000   5"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nprint(df.head(3).to_string())\nprint(\"...\")\nprint(df.tail(2).to_string())"},
      {"title": "숫자 열만 골라 범위 보기", "text": "<code>cafe.csv</code> 에서 숫자 열만 골라 그 이름 리스트를 출력하고, 숫자 열마다 <code>가격: 3500 ~ 5800</code> 처럼 가장 작은 값과 큰 값을 출력하세요. 글자 열은 pandas 버전마다 dtype 이름이 달라서(str / object) 숫자 쪽으로 골라요.", "needs": [["df.select_dtypes(include=\"number\")", "P1/3", "숫자 열만 남긴 표"], ["df[\"가격\"].min()  df[\"가격\"].max()", "P1/0", "Series 의 가장 작은 · 큰 값"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "['가격', '수량']\n가격: 3500 ~ 5800\n수량: 2 ~ 12"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nnums = df.select_dtypes(include=\"number\")\nprint(list(nums.columns))\nfor col in nums.columns:\n    print(f\"{col}: {df[col].min()} ~ {df[col].max()}\")"},
      {"title": "괄호를 잘못 붙였어요 — 고치기", "text": "아래 코드는 첫 줄에서 <code>TypeError: 'tuple' object is not callable</code> 로 멈춰요. 그 줄을 고치면 이번엔 표 대신 <code>&lt;bound method …&gt;</code> 가 찍혀요. 어디에 괄호가 있어야 하고 어디엔 없어야 하는지 고쳐서 크기와 앞 2줄이 나오게 하세요.", "needs": [["df.shape", "P1/2", "속성 — 괄호 없음"], ["df.head(2)", "P1/2", "메서드 — 괄호 필요"]], "given": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nprint(df.shape())\nprint(df.head)", "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "(126, 6)\n           날짜  지점     메뉴   분류    가격  수량\n0  2026-10-01  강남  치즈케이크  디저트  5500   9\n1  2026-10-01  강남   카페라테   커피  4500   6"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nprint(df.shape)\nprint(df.head(2).to_string())"},
    ],
    P2: [
      {"title": "홍대에서 10잔 이상 팔린 기록", "text": "<code>cafe.csv</code> 에서 지점이 홍대이고 수량이 10 이상인 행만 골라 날짜 · 메뉴 · 수량 열을 인덱스 없이 출력하세요. 마지막 줄에 <code>모두 ○줄</code> 모양으로 줄 수도 출력해요.", "needs": [["df[(df[\"지점\"] == \"홍대\") & (df[\"수량\"] >= 10)]", "P2/2", "두 조건을 & 로 — 조건마다 괄호"], ["df[[\"날짜\", \"메뉴\", \"수량\"]]", "P2/0", "여러 열 고르기 — 괄호 두 겹"], ["to_string(index=False)", "P1/0", "인덱스 없이 출력"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "        날짜    메뉴  수량\n2026-10-03 치즈케이크  10\n2026-10-04 딸기스무디  10\n2026-10-04 바닐라라테  11\n2026-10-07 바닐라라테  10\n2026-10-10 치즈케이크  10\n2026-10-10  카페라테  12\n2026-10-10 딸기스무디  11\n2026-10-11  카페라테  11\n2026-10-13 아메리카노  10\n모두 9줄"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nhd = df[(df[\"지점\"] == \"홍대\") & (df[\"수량\"] >= 10)]\nprint(hd[[\"날짜\", \"메뉴\", \"수량\"]].to_string(index=False))\nprint(f\"모두 {len(hd)}줄\")"},
      {"title": "강남 · 판교의 디저트", "text": "지점이 강남 또는 판교이고 분류가 디저트인 판매 기록이 몇 줄인지, 그 수량을 모두 더하면 몇 개인지 출력하세요. 지점 조건은 <code>isin</code> 으로 써요. 그다음 줄에는 <b>홍대가 아닌</b> 모든 기록의 줄 수를 <code>~</code> 로 구해 출력해요.", "needs": [["df[\"지점\"].isin([\"강남\", \"판교\"])", "P2/2", "이 중 하나"], ["~(df[\"지점\"] == \"홍대\")", "P2/2", "아니다"], ["df[마스크][\"수량\"].sum()", "P2/2", "거른 표의 열 합"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "디저트 기록 12 줄\n디저트 수량 71 개\n홍대 아닌 기록 84 줄"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nmask = df[\"지점\"].isin([\"강남\", \"판교\"]) & (df[\"분류\"] == \"디저트\")\ndessert = df[mask]\nprint(\"디저트 기록\", len(dessert), \"줄\")\nprint(\"디저트 수량\", dessert[\"수량\"].sum(), \"개\")\nnot_hd = df[~(df[\"지점\"] == \"홍대\")]\nprint(\"홍대 아닌 기록\", len(not_hd), \"줄\")"},
      {"title": "마지막 날 판교 — loc", "text": "<code>df.loc</code> 한 번으로 날짜가 <code>2026-10-14</code> 이고 지점이 판교인 행의 메뉴 · 가격 · 수량만 골라 출력하세요(인덱스는 그대로 둬요). 그다음 같은 <code>loc</code> 모양으로 그 행들의 수량을 0 으로 바꾼 뒤(그날 판교 기록이 잘못됐다고 해요), 판교 전체 수량 합을 출력하세요.", "needs": [["df.loc[조건, [\"메뉴\", \"가격\", \"수량\"]]", "P2/3", "행과 열을 한 번에"], ["df.loc[조건, \"수량\"] = 0", "P2/3", "조건에 맞는 칸의 값 바꾸기"], ["(df[\"날짜\"] == \"2026-10-14\") & (df[\"지점\"] == \"판교\")", "P2/2", "조건 두 개"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "        메뉴    가격  수량\n123    레몬차  4200   3\n124  딸기스무디  5800   4\n125  바닐라라테  5000   5\n판교 수량 합: 192"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nlast = (df[\"날짜\"] == \"2026-10-14\") & (df[\"지점\"] == \"판교\")\nprint(df.loc[last, [\"메뉴\", \"가격\", \"수량\"]].to_string())\ndf.loc[last, \"수량\"] = 0\nprint(\"판교 수량 합:\", df.loc[df[\"지점\"] == \"판교\", \"수량\"].sum())"},
      {"title": "and 로 쓴 조건 — 고치기", "text": "첫 주(<code>2026-10-07</code> 까지) 강남의 커피 기록만 보려고 했는데 <code>ValueError: The truth value of a Series is ambiguous</code> 로 멈춰요. 조건을 pandas 방식으로 고쳐서 몇 줄인지와 수량 합을 출력하세요.", "needs": [["(조건1) & (조건2) & (조건3)", "P2/2", "and 대신 & · 조건마다 괄호"], ["df[\"날짜\"] <= \"2026-10-07\"", "P2/1", "같은 모양의 날짜 글자는 비교로 고를 수 있어요"]], "given": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nweek1 = df[df[\"날짜\"] <= \"2026-10-07\" and df[\"지점\"] == \"강남\" and df[\"분류\"] == \"커피\"]\nprint(len(week1), \"줄\")\nprint(\"수량 합\", week1[\"수량\"].sum())", "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "10 줄\n수량 합 88"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nweek1 = df[(df[\"날짜\"] <= \"2026-10-07\") & (df[\"지점\"] == \"강남\") & (df[\"분류\"] == \"커피\")]\nprint(len(week1), \"줄\")\nprint(\"수량 합\", week1[\"수량\"].sum())"},
    ],
    P3: [
      {"title": "매출 상위 5줄", "text": "<code>cafe.csv</code> 에 <code>매출</code>(가격 × 수량) 열을 만들고, 매출이 큰 기록 5줄의 날짜 · 지점 · 메뉴 · 매출을 인덱스 없이 출력하세요. 매출이 같으면 날짜가 빠른 것이 먼저 오게 해요.", "needs": [["df[\"매출\"] = df[\"가격\"] * df[\"수량\"]", "P3/1", "계산 열 — 행마다 한 번에"], ["sort_values([\"매출\", \"날짜\"], ascending=[False, True])", "P3/0", "큰 것부터, 같으면 날짜 순"], [".head(5)", "P1/2", "앞 5줄"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "        날짜 지점    메뉴    매출\n2026-10-10 홍대 딸기스무디 63800\n2026-10-04 홍대 딸기스무디 58000\n2026-10-03 홍대 치즈케이크 55000\n2026-10-04 홍대 바닐라라테 55000\n2026-10-10 홍대 치즈케이크 55000"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\ntop = df.sort_values([\"매출\", \"날짜\"], ascending=[False, True]).head(5)\nprint(top[[\"날짜\", \"지점\", \"메뉴\", \"매출\"]].to_string(index=False))"},
      {"title": "가격 등급 붙이기 — apply", "text": "가격이 5000 이상이면 <code>비쌈</code>, 4500 이상이면 <code>보통</code>, 그보다 싸면 <code>쌈</code> 을 돌려주는 함수 <code>grade(price)</code> 를 만들고 <code>apply</code> 로 <code>등급</code> 열을 만드세요. 등급마다 기록이 몇 줄인지 <code>비쌈 ○줄</code> 모양으로 출력해요(비쌈 · 보통 · 쌈 차례).", "needs": [["df[\"가격\"].apply(grade)", "P3/3", "값마다 내 함수를 불러 새 열로"], ["(df[\"등급\"] == \"비쌈\").sum()", "P3/1", "True 의 개수 = 조건에 맞는 줄 수"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "비쌈 44줄\n보통 36줄\n쌈 46줄"}], "answer": "import pandas as pd\n\ndef grade(price):\n    if price >= 5000:\n        return \"비쌈\"\n    if price >= 4500:\n        return \"보통\"\n    return \"쌈\"\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"등급\"] = df[\"가격\"].apply(grade)\nfor g in [\"비쌈\", \"보통\", \"쌈\"]:\n    print(f\"{g} {(df['등급'] == g).sum()}줄\")"},
      {"title": "지점 이름을 영어로 — map", "text": "해외 본사에 보낼 표예요. <code>{\"강남\": \"Gangnam\", \"홍대\": \"Hongdae\", \"판교\": \"Pangyo\"}</code> 로 <code>branch</code> 열을 만들고, 마지막 날(<code>2026-10-14</code>) 기록만 branch 는 알파벳 순, 같은 branch 안에서는 수량이 큰 것부터 정렬해 branch · 메뉴 · 수량을 인덱스 없이 출력하세요.", "needs": [["df[\"지점\"].map({\"강남\": \"Gangnam\", …})", "P3/2", "바꿔 쓰기 표로 새 열"], ["sort_values([\"branch\", \"수량\"], ascending=[True, False])", "P3/0", "여러 열로 정렬"], ["df[df[\"날짜\"] == \"2026-10-14\"]", "P2/1", "조건으로 행 거르기"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": " branch    메뉴  수량\nGangnam 바닐라라테  10\nGangnam   레몬차   9\nGangnam  녹차라테   5\nHongdae  크루아상   8\nHongdae 아메리카노   7\nHongdae   레몬차   3\n Pangyo 바닐라라테   5\n Pangyo 딸기스무디   4\n Pangyo   레몬차   3"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\neng = {\"강남\": \"Gangnam\", \"홍대\": \"Hongdae\", \"판교\": \"Pangyo\"}\ndf[\"branch\"] = df[\"지점\"].map(eng)\nday = df[df[\"날짜\"] == \"2026-10-14\"]\nday = day.sort_values([\"branch\", \"수량\"], ascending=[True, False])\nprint(day[[\"branch\", \"메뉴\", \"수량\"]].to_string(index=False))"},
      {"title": "많이 사면 할인 — axis=1", "text": "한 기록의 수량이 10 이상이면 그 기록의 매출을 10% 깎아 주는 행사를 했다면 얼마나 줄었을까요? 행 하나를 받아 결제 금액을 돌려주는 함수 <code>pay(row)</code> 를 만들어 <code>apply(pay, axis=1)</code> 로 <code>결제</code> 열을 만들고, 원래 총매출 · 할인 뒤 총매출 · 차이를 정수로 출력하세요.", "needs": [["df.apply(pay, axis=1)", "P3/3", "행마다 함수 — row[\"수량\"] 처럼 읽기"], ["df[\"매출\"] = df[\"가격\"] * df[\"수량\"]", "P3/1", "원래 매출은 열끼리 곱하기"], ["round(값)", "P3/1", "소수를 정수로 반올림"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "원래 3833600\n할인 뒤 3749170\n차이 84430"}], "answer": "import pandas as pd\n\ndef pay(row):\n    money = row[\"가격\"] * row[\"수량\"]\n    if row[\"수량\"] >= 10:\n        return money * 0.9\n    return money\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\ndf[\"결제\"] = df.apply(pay, axis=1)\nbefore = int(df[\"매출\"].sum())\nafter = round(df[\"결제\"].sum())\nprint(\"원래\", before)\nprint(\"할인 뒤\", after)\nprint(\"차이\", before - after)"},
    ],
    P4: [
      {"title": "지점별 총매출 순위", "text": "<code>cafe.csv</code> 로 지점마다 총매출(가격 × 수량의 합)을 구해 큰 것부터 출력하세요. 다음 줄에 <code>1등 강남 · 꼴찌 판교</code> 처럼 1등과 꼴찌 지점을 출력해요.", "needs": [["df.groupby(\"지점\")[\"매출\"].sum()", "P4/0", "지점마다 매출 합"], [".sort_values(ascending=False)", "P4/0", "큰 것부터"], ["by.idxmax()  by.idxmin()", "P4/0", "가장 큰 · 작은 값의 이름"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "지점\n강남    1494000\n홍대    1391700\n판교     947900\n1등 강남 · 꼴찌 판교"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\nby = df.groupby(\"지점\")[\"매출\"].sum().sort_values(ascending=False)\nprint(by.to_string())\nprint(f\"1등 {by.idxmax()} · 꼴찌 {by.idxmin()}\")"},
      {"title": "메뉴 성적표 — agg", "text": "메뉴마다 총수량 · 평균수량(한 기록에 몇 잔) · 판매일(팔린 날짜 가짓수)을 한 표로 만들어, 총수량이 많은 것부터 출력하세요. 평균은 소수 첫째 자리까지예요.", "needs": [["agg(총수량=(\"수량\", \"sum\"), …)", "P4/1", "열 이름을 정하며 여러 계산"], ["(\"날짜\", \"nunique\")", "P4/1", "서로 다른 날짜의 가짓수"], [".round(1)", "P4/1", "소수 첫째 자리까지"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "       총수량  평균수량  판매일\n메뉴\n카페라테   152   8.0   12\n아메리카노  135   7.5   13\n바닐라라테  115   7.7    9\n레몬차    103   5.7   12\n녹차라테    92   5.4   10\n딸기스무디   88   5.2   12\n치즈케이크   80   6.7    9\n크루아상    60   6.0    9"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ntable = df.groupby(\"메뉴\").agg(\n    총수량=(\"수량\", \"sum\"),\n    평균수량=(\"수량\", \"mean\"),\n    판매일=(\"날짜\", \"nunique\"),\n)\ntable = table.sort_values(\"총수량\", ascending=False)\nprint(table.round(1).to_string())"},
      {"title": "지점 × 분류 매출 표", "text": "지점과 분류 두 열로 묶어 매출 합을 구하고, <code>unstack</code> 으로 행은 지점 · 열은 분류인 가로세로 표를 출력하세요. 그다음 지점마다 커피가 그 지점 매출의 몇 %인지 <code>강남 커피 48.9%</code> 모양으로 출력해요.", "needs": [["df.groupby([\"지점\", \"분류\"])[\"매출\"].sum()", "P4/2", "두 열로 묶기"], [".unstack()", "P4/2", "안쪽 인덱스를 열로"], ["table.loc[\"강남\", \"커피\"]", "P2/3", "행 이름 · 열 이름으로 한 칸"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "분류     디저트      음료       차      커피\n지점\n강남  241500   69600  452400  730500\n판교   97000  116000  239400  495500\n홍대  311500  324800  182400  573000\n강남 커피 48.9%\n판교 커피 52.3%\n홍대 커피 41.2%"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\ntable = df.groupby([\"지점\", \"분류\"])[\"매출\"].sum().unstack()\nprint(table.to_string())\nfor name in table.index:\n    share = table.loc[name, \"커피\"] / table.loc[name].sum() * 100\n    print(f\"{name} 커피 {share:.1f}%\")"},
      {"title": "분류마다 몇 줄? — value_counts", "text": "판매 기록이 분류마다 몇 줄인지 <code>value_counts</code> 로 출력하고, 비율(%)도 소수 첫째 자리까지 출력하세요. 그다음 줄 수가 아니라 <b>잔 수</b>(수량 합)로는 분류 순위가 어떻게 되는지 큰 것부터 출력해서 두 결과를 비교해요.", "needs": [["df[\"분류\"].value_counts()", "P4/3", "값마다 줄 수 — 많은 것부터"], ["value_counts(normalize=True)", "P4/3", "개수 대신 비율"], ["df.groupby(\"분류\")[\"수량\"].sum()", "P4/0", "줄 수가 아니라 잔 수"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "분류\n커피     52\n차      35\n디저트    22\n음료     17\n분류\n커피     41.3\n차      27.8\n디저트    17.5\n음료     13.5\n분류\n커피     402\n차      195\n디저트    140\n음료      88"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nprint(df[\"분류\"].value_counts().to_string())\nprint((df[\"분류\"].value_counts(normalize=True) * 100).round(1).to_string())\ncups = df.groupby(\"분류\")[\"수량\"].sum().sort_values(ascending=False)\nprint(cups.to_string())"},
    ],
    P5: [
      {"title": "원가를 붙여 메뉴별 이익", "text": "예시 답처럼 메뉴 원가 표 <code>cost</code> 를 코드 안에 만들고, <code>cafe.csv</code> 에 <code>merge</code> 로 붙이세요. 합친 뒤 행 수가 그대로인지 출력하고, 이익 = (가격 − 원가) × 수량 을 메뉴마다 더해 큰 것부터 출력하세요.", "needs": [["pd.merge(df, cost, on=\"메뉴\")", "P5/1", "열쇠 열로 옆으로 붙이기"], ["len(df), len(both)", "P5/1", "합친 뒤 행 수 확인"], ["groupby(\"메뉴\")[\"이익\"].sum()", "P4/0", "메뉴마다 합"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "126 줄 → 126 줄\n메뉴\n카페라테     456000\n아메리카노    418500\n바닐라라테    368000\n레몬차      309000\n녹차라테     285200\n딸기스무디    281600\n치즈케이크    208000\n크루아상     126000"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ncost = pd.DataFrame({\n    \"메뉴\": [\"아메리카노\", \"카페라테\", \"바닐라라테\", \"녹차라테\", \"레몬차\", \"딸기스무디\", \"치즈케이크\", \"크루아상\"],\n    \"원가\": [900, 1500, 1800, 1700, 1200, 2600, 2900, 1400],\n})\nboth = pd.merge(df, cost, on=\"메뉴\")\nprint(len(df), \"줄 →\", len(both), \"줄\")\nboth[\"이익\"] = (both[\"가격\"] - both[\"원가\"]) * both[\"수량\"]\nprofit = both.groupby(\"메뉴\")[\"이익\"].sum().sort_values(ascending=False)\nprint(profit.to_string())"},
      {"title": "지점 정보 붙이기 — 새 지점은 NaN", "text": "지점 정보 표(지점 · 좌석)에는 아직 문을 안 연 <code>잠실</code>(좌석 40)도 있어요. 지점마다 총매출을 구한 표를 만들고, <b>지점 정보 표를 왼쪽</b>에 두고 <code>how=\"left\"</code> 로 붙이세요. 좌석당 매출(총매출 ÷ 좌석, 반올림)도 열로 만들어 출력해요. 잠실은 매출이 없으니 NaN 으로 남고, NaN 이 섞인 열은 <code>1494000.0</code> 처럼 소수로 보여요.", "needs": [["pd.merge(info, total, on=\"지점\", how=\"left\")", "P5/2", "왼쪽 표를 전부 남기기 — 짝 없으면 NaN"], [".reset_index()", "P4/2", "groupby 결과의 인덱스를 보통 열로"], ["(합친표[\"총매출\"] / 합친표[\"좌석\"]).round()", "P3/1", "열끼리 나누고 반올림"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "지점  좌석       총매출     좌석당\n강남  60 1494000.0 24900.0\n홍대  45 1391700.0 30927.0\n판교  30  947900.0 31597.0\n잠실  40       NaN     NaN"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\ntotal = df.groupby(\"지점\")[\"매출\"].sum().reset_index()\ntotal = total.rename(columns={\"매출\": \"총매출\"})\n\ninfo = pd.DataFrame({\n    \"지점\": [\"강남\", \"홍대\", \"판교\", \"잠실\"],\n    \"좌석\": [60, 45, 30, 40],\n})\nboth = pd.merge(info, total, on=\"지점\", how=\"left\")\nboth[\"좌석당\"] = (both[\"총매출\"] / both[\"좌석\"]).round()\nprint(both.to_string(index=False))"},
      {"title": "새 날 매출 이어 붙이기 — concat", "text": "<code>2026-10-15</code> 강남 기록 3줄이 따로 왔어요(아래 예시 답의 <code>new</code> 표). <code>concat</code> 으로 <code>cafe.csv</code> 아래에 이어 붙여 새 표의 크기와 마지막 4줄을 출력하고, 날짜가 몇 가지인지 출력하세요.", "needs": [["pd.concat([df, new], ignore_index=True)", "P5/3", "같은 열의 표를 위아래로 · 새 번호"], ["df[\"날짜\"].nunique()", "P2/0", "서로 다른 값의 가짓수"], ["df.tail(4)", "P1/2", "뒤 4줄"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "(129, 6)\n             날짜  지점     메뉴   분류    가격  수량\n125  2026-10-14  판교  바닐라라테   커피  5000   5\n126  2026-10-15  강남   카페라테   커피  4500   9\n127  2026-10-15  강남    레몬차    차  4200   5\n128  2026-10-15  강남   크루아상  디저트  3500   6\n날짜 15 가지"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\nnew = pd.DataFrame({\n    \"날짜\": [\"2026-10-15\", \"2026-10-15\", \"2026-10-15\"],\n    \"지점\": [\"강남\", \"강남\", \"강남\"],\n    \"메뉴\": [\"카페라테\", \"레몬차\", \"크루아상\"],\n    \"분류\": [\"커피\", \"차\", \"디저트\"],\n    \"가격\": [4500, 4200, 3500],\n    \"수량\": [9, 5, 6],\n})\nwhole = pd.concat([df, new], ignore_index=True)\nprint(whole.shape)\nprint(whole.tail(4).to_string())\nprint(\"날짜\", whole[\"날짜\"].nunique(), \"가지\")"},
      {"title": "열쇠 이름이 달라요 — 고치기", "text": "메뉴 표의 열쇠 열 이름이 <code>메뉴명</code> 이라서 아래 코드는 <code>KeyError: '메뉴'</code> 로 멈춰요. <code>left_on</code> · <code>right_on</code> 이나 <code>rename</code> 으로 고쳐서, 커피 분류 메뉴마다 칼로리 × 수량의 합(총칼로리)을 큰 것부터 출력하세요.", "needs": [["pd.merge(df, kcal, left_on=\"메뉴\", right_on=\"메뉴명\")", "P5/2", "열쇠 이름이 다를 때"], ["kcal.rename(columns={\"메뉴명\": \"메뉴\"})", "P5/2", "아니면 이름을 먼저 맞추기"], ["groupby(\"메뉴\")[\"칼로리합\"].sum()", "P4/0", "메뉴마다 합"]], "given": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ncoffee = df[df[\"분류\"] == \"커피\"]\nkcal = pd.DataFrame({\n    \"메뉴명\": [\"아메리카노\", \"카페라테\", \"바닐라라테\"],\n    \"칼로리\": [10, 180, 250],\n})\nboth = pd.merge(coffee, kcal, on=\"메뉴\")\nboth[\"칼로리합\"] = both[\"칼로리\"] * both[\"수량\"]\nprint(both.groupby(\"메뉴\")[\"칼로리합\"].sum().sort_values(ascending=False).to_string())", "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "메뉴\n바닐라라테    28750\n카페라테     27360\n아메리카노     1350"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ncoffee = df[df[\"분류\"] == \"커피\"]\nkcal = pd.DataFrame({\n    \"메뉴명\": [\"아메리카노\", \"카페라테\", \"바닐라라테\"],\n    \"칼로리\": [10, 180, 250],\n})\nkcal = kcal.rename(columns={\"메뉴명\": \"메뉴\"})\nboth = pd.merge(coffee, kcal, on=\"메뉴\")\nboth[\"칼로리합\"] = both[\"칼로리\"] * both[\"수량\"]\nprint(both.groupby(\"메뉴\")[\"칼로리합\"].sum().sort_values(ascending=False).to_string())"},
    ],
    PB1: [
      {"title": "지점 성적표", "text": "카페 사장님이 「지점마다 얼마나 팔았는지 한 표로」 보고 싶어 해요. <code>cafe.csv</code> 로 지점마다 총매출 · 총수량 · 영업일(날짜 가짓수) · 하루평균(총매출 ÷ 영업일, 반올림해서 정수)을 한 표로 만들어 총매출이 큰 것부터 출력하세요. 마지막 줄에 <code>세 지점 합계 3833600원</code> 처럼 전체 합도 출력해요.", "needs": [["df.groupby(\"지점\").agg(총매출=(\"매출\", \"sum\"), …)", "P4/1", "이름 붙인 여러 계산"], ["(\"날짜\", \"nunique\")", "P4/1", "영업일 = 날짜 가짓수"], ["(표[\"총매출\"] / 표[\"영업일\"]).round().astype(int)", "P3/1", "열끼리 나누고 반올림"], ["sort_values(\"총매출\", ascending=False)", "P3/0", "큰 것부터"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "        총매출  총수량  영업일    하루평균\n지점\n강남  1494000  329   14  106714\n홍대  1391700  292   14   99407\n판교   947900  204   14   67707\n세 지점 합계 3833600원"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\ntable = df.groupby(\"지점\").agg(\n    총매출=(\"매출\", \"sum\"),\n    총수량=(\"수량\", \"sum\"),\n    영업일=(\"날짜\", \"nunique\"),\n)\ntable[\"하루평균\"] = (table[\"총매출\"] / table[\"영업일\"]).round().astype(int)\ntable = table.sort_values(\"총매출\", ascending=False)\nprint(table.to_string())\nprint(f\"세 지점 합계 {table['총매출'].sum()}원\")"},
      {"title": "메뉴 순위와 비중", "text": "메뉴마다 매출 합을 구해 큰 것부터 <code>순위</code>(1, 2, 3 …) · 메뉴 · 매출 · 비중(전체 매출의 %, 소수 첫째 자리) 표를 인덱스 없이 출력하세요. 그다음 <code>상위 3개 메뉴가 매출의 ○%</code> 모양으로 상위 3개 메뉴의 비중 합을 출력해요.", "needs": [["df.groupby(\"메뉴\")[\"매출\"].sum().reset_index()", "P4/2", "평평한 표로"], ["표[\"비중\"] = (표[\"매출\"] / 표[\"매출\"].sum() * 100).round(1)", "P3/1", "전체에서 차지하는 %"], ["표[\"순위\"] = range(1, len(표) + 1)", "P3/1", "정렬한 뒤 차례 번호 열"], [".head(3)", "P1/2", "상위 3개"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": " 순위    메뉴     매출   비중\n  1  카페라테 684000 17.8\n  2 바닐라라테 575000 15.0\n  3 아메리카노 540000 14.1\n  4 딸기스무디 510400 13.3\n  5  녹차라테 441600 11.5\n  6 치즈케이크 440000 11.5\n  7   레몬차 432600 11.3\n  8  크루아상 210000  5.5\n상위 3개 메뉴가 매출의 46.9%"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\nmenu = df.groupby(\"메뉴\")[\"매출\"].sum().reset_index()\nmenu = menu.sort_values(\"매출\", ascending=False)\nmenu[\"비중\"] = (menu[\"매출\"] / menu[\"매출\"].sum() * 100).round(1)\nmenu[\"순위\"] = range(1, len(menu) + 1)\nprint(menu[[\"순위\", \"메뉴\", \"매출\", \"비중\"]].to_string(index=False))\ntop3 = menu.head(3)[\"매출\"].sum() / menu[\"매출\"].sum() * 100\nprint(f\"상위 3개 메뉴가 매출의 {top3:.1f}%\")"},
      {"title": "요일별 매출 — 요일 표를 merge", "text": "「주말에 더 잘 팔까?」 를 확인해요. <code>cafe.csv</code> 에는 요일이 없어서 날짜 → 요일 표를 직접 만들어 붙여요. 2026-10-01 이 목요일이니 14일의 요일을 차례로 적고(요일 번호 0 = 월 … 6 = 일도 같이), <code>merge</code> 로 붙인 뒤 요일마다 매출 합을 <b>월요일부터</b> 출력하세요. 마지막에 주말(토 · 일) 하루 평균과 평일 하루 평균 매출을 정수로 출력해요. 날짜 글자에서 요일을 자동으로 뽑는 법은 [[레슨:P7]] 에서 배워요.", "needs": [["pd.merge(df, days, on=\"날짜\")", "P5/1", "날짜를 열쇠로 요일 붙이기"], ["groupby([\"번호\", \"요일\"])[\"매출\"].sum()", "P4/2", "번호까지 묶어 월~일 차례로"], ["df[\"요일\"].isin([\"토\", \"일\"])", "P2/2", "주말만"], ["weekend[\"날짜\"].nunique()", "P2/0", "하루 평균은 날 수로 나누기"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "126 줄 → 126 줄\n요일     매출\n 월 508900\n 화 547900\n 수 553300\n 목 465100\n 금 466400\n 토 668500\n 일 623500\n주말 하루 평균 323000원 · 평일 하루 평균 254160원"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\n\nnames = [\"목\", \"금\", \"토\", \"일\", \"월\", \"화\", \"수\"] * 2\nnums = [3, 4, 5, 6, 0, 1, 2] * 2\ndates = [f\"2026-10-{d:02d}\" for d in range(1, 15)]\ndays = pd.DataFrame({\"날짜\": dates, \"요일\": names, \"번호\": nums})\n\nboth = pd.merge(df, days, on=\"날짜\")\nprint(len(df), \"줄 →\", len(both), \"줄\")\nweek = both.groupby([\"번호\", \"요일\"])[\"매출\"].sum().reset_index()\nprint(week[[\"요일\", \"매출\"]].to_string(index=False))\n\nweekend = both[both[\"요일\"].isin([\"토\", \"일\"])]\nweekday = both[~both[\"요일\"].isin([\"토\", \"일\"])]\nwe = weekend[\"매출\"].sum() / weekend[\"날짜\"].nunique()\nwd = weekday[\"매출\"].sum() / weekday[\"날짜\"].nunique()\nprint(f\"주말 하루 평균 {round(we)}원 · 평일 하루 평균 {round(wd)}원\")"},
      {"title": "지점마다 1등 메뉴와 한 줄 결론", "text": "지점마다 매출이 가장 큰 메뉴 하나와 그 매출을 인덱스 없이 출력하세요(지점은 가나다 순). 마지막에 분석을 두 줄로 정리해요: 가장 많이 번 지점과 그 금액, 그리고 가장 적게 번 지점이 1등 지점의 몇 %인지(소수 첫째 자리). 결과는 출력 예와 같은 문장으로 써요.", "needs": [["groupby([\"지점\", \"메뉴\"])[\"매출\"].sum().reset_index()", "P4/2", "지점 × 메뉴 평평한 표"], ["sort_values([\"지점\", \"매출\"], ascending=[True, False])", "P3/0", "지점 순, 그 안에서 매출 큰 것부터"], ["groupby(\"지점\").head(1)", "P4/2", "지점마다 첫 줄 = 1등"], ["by.idxmax()  by.max()", "P4/0", "1등 지점 이름과 값"]], "prep": {"name": "cafe.csv", "text": CAFE_CSV}, "io": [{"output": "지점    메뉴     매출\n강남  카페라테 364500\n판교 바닐라라테 225000\n홍대 딸기스무디 324800\n결론 1: 강남 지점이 1494000원으로 가장 많이 팔았어요\n결론 2: 판교 지점은 강남 지점의 63.4% 예요"}], "answer": "import pandas as pd\n\ndf = pd.read_csv(\"cafe.csv\")\ndf[\"매출\"] = df[\"가격\"] * df[\"수량\"]\n\npair = df.groupby([\"지점\", \"메뉴\"])[\"매출\"].sum().reset_index()\npair = pair.sort_values([\"지점\", \"매출\"], ascending=[True, False])\nprint(pair.groupby(\"지점\").head(1).to_string(index=False))\n\nby = df.groupby(\"지점\")[\"매출\"].sum()\nbest, worst = by.idxmax(), by.idxmin()\nprint(f\"결론 1: {best} 지점이 {by.max()}원으로 가장 많이 팔았어요\")\nprint(f\"결론 2: {worst} 지점은 {best} 지점의 {by.min() / by.max() * 100:.1f}% 예요\")"},
    ],
  },
};
