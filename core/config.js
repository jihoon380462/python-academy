// =====================================================================
// === CONFIG ===  (수치·CDN 주소·모델명. 수정을 맡길 때 APP_VERSION을 올린다)
// =====================================================================
const CONFIG = {
  APP_VERSION: '2.36.0',
  HUB_PATH: '../../index.html',             // 코스 페이지에서 허브로 (상대 경로)
  SCHEMA_VERSION: 2,                      // 2 = academy.* 조각 저장 (core/storage.js)
  // 문제·레슨 id 로 코스를 알아내는 규칙 (QA #67: 기기 연동이 섞어 놓은 기록을 제자리로 — Store.untangle·Sync). 새 코스·새 id 모양을 만들면 여기에도 (validate 가 검사)
  COURSE_ID_PATTERNS: { python: '^(L|B|X)\\d+[A-Z]?([PD]\\d+)?$', algo: '^(A|AB|E)\\d+[A-Z]?([PD]\\d+)?$', math: '^M\\d+_', 'terminal-git': '^(T|TB)\\d+(P\\d+)?$', vim: '^(V|VB)\\d+(P\\d+)?$', github: '^(G|GB)\\d+(P\\d+)?$', sql: '^(S|SB)\\d+(P\\d+)?$', web: '^(W|WB)\\d+[A-Z]?(P\\d+)?$', api: '^(H|HB)\\d+(P\\d+)?$', linux: '^(U|UB)\\d+(P\\d+)?$', os: '^(K|KB)\\d+(P\\d+)?$', asm: '^(R|RB)\\d+(P\\d+)?$', cs: '^(C|CB)\\d+(P\\d+)?$', llm: '^(N|NB)\\d+(P\\d+)?$', debug: '^(D|DB)\\d+(P\\d+)?$', data: '^(P|PB)\\d+(P\\d+)?$', oop: '^(O|OB)\\d+(P\\d+)?$', ml: '^(I|IB)\\d+(P\\d+)?$', ai: '^(Z|ZB)\\d+(P\\d+)?$' },
  COURSES: [                              // 허브 코스 카드 순서. path는 허브 기준 상대 경로
    { id: 'python', short: '파이썬', name: '파이썬', icon: '🐍', desc: '문법 설명을 읽고 VS Code 에서 직접 만들어 보는 파이썬 교과서', path: 'courses/python/', color: '#2bb673', ready: true, lessons: 70, book: true /* v2.10.1: 교과서 코스 — 허브 카드는 문제 수 대신 「읽은 레슨」(lessons = 열린 레슨 수, check_book 이 맞는지 검사) */ },
    { id: 'algo', short: '알고리즘', name: '알고리즘·자료구조', icon: '🧭', desc: '그림으로 돌아가는 모습을 보며 읽고, VS Code 에서 직접 풀어 보는 알고리즘 교과서 — 코딩테스트 입문까지', path: 'courses/algo/', color: '#2196f3', ready: true, lessons: 36, book: true, bookNote: '그림으로 보기 · 모의고사 15문제' /* v2.15.0 N5: 교과서 */ },
    { id: 'terminal-git', short: '터미널·Git', name: '터미널·Git', icon: '🎧', desc: 'Git Bash 에서 직접 쳐 보는 터미널·Git 교과서', path: 'courses/terminal-git/', color: '#607d8b', ready: true, book: true, bookNote: '명령어 편 + Git 편 · 실제 GitHub 까지', lessons: 20 /* v2.10.0 명령어 편 T0~T5·TB1 + v2.12.0 Git 편 T6~TB3 */ },
    { id: 'github', short: 'GitHub', name: 'GitHub', icon: '🐙', desc: '내 진짜 GitHub 계정으로 저장소·Pull Request·Actions·Pages — 협업하고 공개하는 교과서', path: 'courses/github/', color: '#8250df', ready: true, book: true, lessons: 22, bookNote: '터미널·Git 다음 · PR·Actions·Pages 까지 내 계정으로' /* v2.16.0 N6 설계 specs/github-course.md — 챕터 1 부터 */ },
    { id: 'sql', short: 'SQL', name: '데이터베이스(SQL)', icon: '🗄️', desc: 'DB Browser 에서 동네 카페 데이터로 직접 쿼리하는 SQL 교과서', path: 'courses/sql/', color: '#f4511e', ready: true, book: true, bookNote: 'SELECT 부터 JOIN·설계·파이썬 sqlite3 까지', lessons: 17 /* v2.13.0 S0~S13 + 보스 3 */ },
    { id: 'math', short: '수학', name: '수학 공간', icon: '📐', desc: '프로그래머 수학 — 그림을 만지며 규칙을 찾고, VS Code 에서 파이썬으로 계산해 보는 교과서', path: 'courses/math/', color: '#e91e63', ready: true, lessons: 45, space: true, book: true, bookNote: '그림 만지기 · 영역 순서 자유', hubLabel: '언제든 들어와도 돼요' /* v2.18.0 N12: 교과서 */ },
    { id: 'vim', short: 'Vim', name: 'Vim 에디터', icon: '⌨', desc: 'Windows Vim 설치·단축키부터 파이썬 자동 들여쓰기·F5 실행·자동완성까지', path: 'courses/vim/', color: '#019833', ready: true, book: true, space: true, bookNote: '공용 도구 — 어느 코스를 하다가도 펴 보면 돼요', lessons: 14 /* v2.11.0 사용자 「공용에 windows 버전 vim 에디터 … 교과서」 */ },
    { id: 'linux', short: '리눅스', name: '리눅스(우분투)', icon: '🐧', desc: '내 PC 의 VirtualBox 에 우분투를 설치하고 apt·권한·서비스·SSH 를 직접 해 보는 교과서', path: 'courses/linux/', color: '#e95420', ready: true, book: true, space: true, bookNote: '공용 — 운영체제 · 어셈블리어 교과서의 연습장', lessons: 18 /* v2.21.0 T9 설계 specs/linux-course.md — 챕터 1 부터 */ },
    { id: 'os', short: '운영체제', name: '운영체제', icon: '⚙️', desc: '리눅스 교과서의 우분투 VM 에서 프로세스·시그널·파이프·스레드·메모리를 작은 파이썬 코드로 직접 일으켜 보는 교과서', path: 'courses/os/', color: '#4f6bed', ready: true, book: true, space: true, bookNote: '공용 — 우분투에서 직접 일으켜 보기 · 끝은 내 미니 셸 완성', lessons: 21 /* v2.23.0 T2 설계 specs/os-course.md — 챕터 1(K0~K5 · KB1) · v2.23.1 챕터 2(K6~K9 · KB2) · v2.23.2 챕터 3(K10~K13 · KB3) · v2.24.0 챕터 4(K14~K16 · KB4) 완성 */ },
    { id: 'asm', short: '어셈블리', name: '어셈블리어', icon: '🧩', desc: '리눅스 교과서의 우분투 VM 에서 x86-64 NASM 으로 레지스터·시스템 콜·스택·함수를 직접 써 보고 C 와 섞어 보는 교과서', path: 'courses/asm/', color: '#6d4c41', ready: true, book: true, space: true, bookNote: '공용 — 우분투에서 x86-64 NASM · 끝엔 C 와 섞기', lessons: 21 /* v2.31.0 어셈블리어 교과서(T10) 완성 — 21 전부(레슨은 서브 에이전트 6개가 동시에, Opus 검수) */ },
    { id: 'cs', short: 'CS', name: 'CS', icon: '💻', desc: '비트 · 회로 · CPU · 메모리 · 운영체제 맛보기 · 네트워크 · 보안을 작은 파이썬 코드로 직접 흉내 내며 이해하는 교과서', path: 'courses/cs/', color: '#3f51b5', ready: true, book: true, space: true, bookNote: '공용 — 컴퓨터가 실제로 어떻게 돌아가나', lessons: 23 /* v2.32.0 CS 교과서(T1) 완성 — 23 전부(레슨은 서브 에이전트 4개가 동시에, Opus 검수) */ },
    { id: 'llm', short: 'LLM', name: 'LLM 기초', icon: '🤖', desc: '다음 글자 맞히기부터 어텐션까지 — numpy 로 아주 작은 언어 모델을 직접 만들어 보는 교과서', path: 'courses/llm/', color: '#8e24aa', ready: true, book: true, space: true, bookNote: '공용 — 아주 작은 언어 모델을 직접', lessons: 20 /* v2.32.0 LLM 기초 교과서(T11) 완성 — 20 전부(레슨은 서브 에이전트 4개가 동시에, Opus 검수) */ },
    { id: 'web', short: '웹', name: '웹', icon: '🌐', desc: 'VS Code 와 브라우저로 화면을 만드는 웹 교과서', path: 'courses/web/', color: '#8e24aa', ready: true, book: true, bookNote: 'HTML · CSS · JavaScript 를 제대로 — 혼자 화면을 끝까지', lessons: 34 /* v2.26.0 웹 교과서 완성 — 34레슨 전부(specs/web-course.md) */ },
    { id: 'api', short: 'HTTP·API', name: 'HTTP·API·SDK', icon: '🔌', desc: 'curl 과 requests 로 남의 API 를 부르고, 내 API 서버와 그 SDK 까지 만드는 교과서', path: 'courses/api/', color: '#00897b', ready: true, book: true, bookNote: '남의 API 부르기 → 내 API 만들기 → 내 SDK 만들기', lessons: 21 /* v2.28.1 HTTP·API·SDK 교과서 완성 — 21 전부(specs/http-api-course.md) */ },
    { id: 'debug', short: '디버깅', name: '디버깅·테스트', icon: '🐞', desc: '트레이스백 · 범위 좁히기 · 디버거 · pytest · TDD · 회귀 테스트를 내 VS Code 에서 직접 해 보는 교과서', path: 'courses/debug/', color: '#e65100', ready: true, book: true, bookNote: '파이썬 다음 — 버그 잡기와 테스트 습관', lessons: 18 /* v2.33.0 디버깅·테스트 교과서 완성 — 18 전부 */ },
    { id: 'data', short: '데이터', name: '데이터 분석', icon: '📊', desc: 'pandas 로 표 데이터를 읽고 정리 · 요약하고 matplotlib 로 그려 분석 보고서까지 쓰는 교과서', path: 'courses/data/', color: '#0277bd', ready: true, book: true, bookNote: '파이썬 다음 — pandas · matplotlib', lessons: 18 /* v2.33.0 데이터 분석 교과서 완성 — 18 전부 */ },
    { id: 'oop', short: '설계', name: '객체지향·설계', icon: '🧱', desc: '캡슐화 · 합성 · 다형성 · 설계 원칙 · 디자인 패턴 · 리팩터링으로 고치기 쉬운 파이썬 코드를 짜는 교과서', path: 'courses/oop/', color: '#5d4037', ready: true, book: true, bookNote: '파이썬 다음 — 클래스를 나누는 법', lessons: 17 /* v2.33.0 객체지향·설계 교과서 완성 — 17 전부 */ },
    { id: 'ml', short: '머신러닝', name: 'AI·머신러닝 기초', icon: '🧠', desc: '선형 회귀 · 경사하강 · k-NN · 로지스틱 회귀 · 결정 트리 · 평가 지표 · k-평균을 numpy 와 scikit-learn 으로 직접 만드는 교과서', path: 'courses/ml/', color: '#00695c', ready: true, book: true, bookNote: '파이썬 다음 — numpy · scikit-learn', lessons: 16 /* v2.33.0 AI·머신러닝 기초 교과서 완성 — 16 전부 */ },
    { id: 'ai', short: 'AI 협업', name: 'AI와 협업', icon: '🤝', desc: '좋은 요청 · 단계 나누기 · AI 코드 검증 · 환각 알아보기 · 개인정보 · 저작권까지 AI 도구와 일하는 법을 익히는 교과서', path: 'courses/ai/', color: '#ad1457', ready: true, book: true, bookNote: '파이썬 다음 — AI 도구 잘 쓰기', lessons: 16 /* v2.33.0 AI와 협업 교과서 완성 — 16 전부 */ },
  ],

  // --- 외부 라이브러리 (버전 고정) ---
  PYODIDE_VERSION: '0.27.5',
  PYODIDE_URL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
  PYODIDE_INDEX: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',

  // --- 실행 ---
  RUN_TIMEOUT_MS: 5000,
  MAX_OUTPUT_LINES: 2000,
  MAX_OUTPUT_CHARS: 1000000,               // 한 번 실행 출력 상한(글자) — 넘으면 멈춤(QA #123 무한 출력 대비). 큰 입력 만들기·정답 기대값 계산은 상한 없음
  TRACE_MAX_STEPS: 500,
  ALGO: { traceMaxSteps: 5000, slowdown: 3, benchBaselineMs: 350, mockMinutes: 60, mockCount: 3, mockBonusXp: 150 }, // 알고리즘 코스: 시각화 추적 단계, Pyodide/CPython 배율, 기기 벤치 기준(ms), 모의고사
  MAX_CODE_SAVE_BYTES: 10240,

  // --- 수식 (수학 교과서 — 없어도 글자 수식으로 대체) ---
  KATEX: { css: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css', js: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js' },
  // v2.19.0 N13: XP·레벨·하루 목표·복습·선생님(Claude API)·CodeMirror 설정은 옛 문제집 화면과 함께 archive/classic/core/config.js

};

// =====================================================================
// === I18N ===  (UI 문구. 코드와 파이썬 키워드만 영어)
// =====================================================================
const T = {
  appName: '파이썬 아카데미',
  home: '홈', run: '실행', runAll: '제출하기', stepRun: '한 줄씩 보기', hint: '힌트', answer: '정답 보기',
  askTutor: '선생님에게 물어보기', next: '다음', prev: '이전', back: '뒤로', close: '닫기', save: '저장', load: '불러오기',
  settings: '설정', badges: '뱃지', profile: '프로필', inventory: '보관함', works: '내 작품',
  glossary: '용어집', errorDict: '에러 사전', weakness: '약점 분석', review: '복습', dailyChallenge: '오늘의 도전',
  timeAttack: '타임 어택', checkup: '종합 점검', level: '레벨', xp: 'XP', streak: '연속 학습', combo: '콤보',
  stdin: '입력값', output: '출력', tests: '테스트', passed: '통과', failed: '실패', clear: '클리어!', locked: '잠김',
  loadingPy: '파이썬 엔진을 준비하고 있어요', loadFail: '이 앱은 처음 실행할 때 인터넷 연결이 필요해요. 연결을 확인한 뒤 다시 시도해 주세요.',
  retry: '다시 시도', timeout: '코드가 끝나지 않고 계속 돌고 있어요. while 조건이나 반복 횟수를 확인해 보세요.',
  needInput: (n) => `입력값 칸에 ${n}번째 값이 필요해요.`,
  tooLong: '…(너무 많아 생략)',
  firstTry: '첫 시도 클리어!', levelUp: '레벨 업!', newTitle: '새 칭호', badgeGet: '뱃지 획득',
  bossDefeated: '보스 격파!', chapterOpen: '다음 챕터가 열렸어요', noKey: '설정에서 API 키를 넣으면 선생님에게 물어볼 수 있어요.',
  keyBad: '키가 올바르지 않아요. 설정에서 다시 확인해 주세요.', rateLimit: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.',
  netErr: '인터넷 연결을 확인해 주세요.', keyOk: '연결 성공! 선생님과 대화할 수 있어요.',
  learned: '이번에 배운 것', example: '따라 하기', tryIt: '실행해 보기',
  confirmReset: '정말 모든 진행을 초기화할까요? 되돌릴 수 없어요.', confirmReset2: '정말요? 레벨·뱃지·코드가 모두 사라져요.',
  importConfirm: '불러오면 지금 진행이 덮어써져요. 계속할까요?', exported: '진행 파일을 내려받았어요.',
  dailyGoal: '일일 목표', goalDone: '오늘 목표 달성!', reviewDone: '기억 유지! 복습 완료',
  savedWork: '내 작품에 저장했어요', nameWork: '작품 이름을 지어 주세요',
  hintLabel: ['방향', '구체', '거의 정답'], steps: '단계', star: '별',
  needAllHints: '힌트 3개를 모두 본 뒤에 열 수 있어요.', seeAnswerConfirm: '정답을 보면 이 문제의 XP와 별은 0이 돼요. 그래도 볼까요?',
};
