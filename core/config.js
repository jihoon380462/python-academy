// =====================================================================
// === CONFIG ===  (수치·CDN 주소·모델명. 수정을 맡길 때 APP_VERSION을 올린다)
// =====================================================================
const CONFIG = {
  APP_VERSION: '2.15.4',
  HUB_PATH: '../../index.html',             // 코스 페이지에서 허브로 (상대 경로)
  SCHEMA_VERSION: 2,                      // 2 = academy.* 조각 저장 (core/storage.js)
  // 문제·레슨 id 로 코스를 알아내는 규칙 (QA #67: 기기 연동이 섞어 놓은 기록을 제자리로 — Store.untangle·Sync). 새 코스·새 id 모양을 만들면 여기에도 (validate 가 검사)
  COURSE_ID_PATTERNS: { python: '^(L|B|X)\\d+[A-Z]?([PD]\\d+)?$', algo: '^(A|AB|E)\\d+([PD]\\d+)?$', math: '^M\\d+_', 'terminal-git': '^(T|TB)\\d+(P\\d+)?$', vim: '^(V|VB)\\d+(P\\d+)?$', sql: '^(S|SB)\\d+(P\\d+)?$', web: '^(W|WB)\\d+(P\\d+)?$' },
  COURSES: [                              // 허브 코스 카드 순서. path는 허브 기준 상대 경로
    { id: 'python', name: '파이썬', icon: '🐍', desc: '문법 설명을 읽고 VS Code 에서 직접 만들어 보는 파이썬 교과서', path: 'courses/python/', color: '#2bb673', ready: true, total: 170, lessons: 45, book: true /* v2.10.1: 교과서 코스 — 허브 카드는 문제 수 대신 「읽은 레슨」(lessons = 열린 레슨 수, check_book 이 맞는지 검사) */ },
    { id: 'algo', name: '알고리즘·자료구조', icon: '🧭', desc: '그림으로 돌아가는 모습을 보며 읽고, VS Code 에서 직접 풀어 보는 알고리즘 교과서 — 코딩테스트 입문까지', path: 'courses/algo/', color: '#2196f3', ready: true, total: 145, lessons: 32, book: true, bookNote: '그림으로 보기 · 모의고사 15문제' /* v2.15.0 N5: 교과서 */, requires: null /* v2.9.0: 파이썬이 교과서(채점 없음)가 되어 보스 클리어로 여는 잠금을 없앰 */ },
    { id: 'terminal-git', name: '터미널·Git', icon: '🎧', desc: 'Git Bash 에서 직접 쳐 보는 터미널·Git 교과서', path: 'courses/terminal-git/', color: '#607d8b', ready: true, book: true, bookNote: '명령어 편 + Git 편 · 실제 GitHub 까지', total: 0, lessons: 20 /* v2.10.0 명령어 편 T0~T5·TB1 + v2.12.0 Git 편 T6~TB3 */, requires: null /* v2.9.0: 파이썬이 교과서(채점 없음)가 되어 보스 클리어로 여는 잠금을 없앰 */ },
    { id: 'sql', name: '데이터베이스(SQL)', icon: '🗄️', desc: 'DB Browser 에서 동네 카페 데이터로 직접 쿼리하는 SQL 교과서', path: 'courses/sql/', color: '#f4511e', phase: 3, ready: true, book: true, bookNote: 'SELECT 부터 JOIN·설계·파이썬 sqlite3 까지', total: 0, lessons: 17 /* v2.13.0 S0~S13 + 보스 3 */, requires: null /* v2.9.0: 파이썬이 교과서(채점 없음)가 되어 보스 클리어로 여는 잠금을 없앰 */ },
    { id: 'math', name: '수학 공간', icon: '📐', desc: '프로그래머 수학 — 그림을 만지며 배우고, 계산은 파이썬이', path: 'courses/math/', color: '#e91e63', ready: true, total: 180, lessons: 45, space: true, map: 'graph', hubLabel: '언제든 들어와도 돼요' },
    { id: 'vim', name: 'Vim 에디터', icon: '⌨', desc: 'Windows Vim 설치·단축키부터 파이썬 자동 들여쓰기·F5 실행·자동완성까지', path: 'courses/vim/', color: '#019833', ready: true, book: true, space: true, bookNote: '공용 도구 — 어느 코스를 하다가도', total: 0, lessons: 14 /* v2.11.0 사용자 「공용에 windows 버전 vim 에디터 … 교과서」 */ },
    { id: 'web', name: '웹·HTTP·API', icon: '🌐', desc: 'VS Code 와 브라우저로 만들고 인터넷에 올리는 웹 교과서', path: 'courses/web/', color: '#8e24aa', requires: null /* v2.9.0: 파이썬이 교과서(채점 없음)가 되어 보스 클리어로 여는 잠금을 없앰 */, phase: 4, ready: true, book: true, bookNote: 'HTML·CSS·JS 부터 fetch·API·GitHub Pages 배포까지', total: 0, lessons: 17 /* v2.14.0 W0~W13 + 보스 3 */ },
  ],

  // --- 외부 라이브러리 (버전 고정) ---
  PYODIDE_VERSION: '0.27.5',
  PYODIDE_URL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
  PYODIDE_INDEX: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
  PYODIDE_SIZE_MB: 10,
  CM: {
    core: 'https://cdn.jsdelivr.net/npm/codemirror@6.0.1/+esm',
    python: 'https://cdn.jsdelivr.net/npm/@codemirror/lang-python@6.2.1/+esm',
    view: 'https://cdn.jsdelivr.net/npm/@codemirror/view@6/+esm',
    state: 'https://cdn.jsdelivr.net/npm/@codemirror/state@6/+esm',
    commands: 'https://cdn.jsdelivr.net/npm/@codemirror/commands@6/+esm',
    language: 'https://cdn.jsdelivr.net/npm/@codemirror/language@6/+esm',
  },

  // --- 실행 ---
  RUN_TIMEOUT_MS: 5000,
  MAX_OUTPUT_LINES: 2000,
  MAX_OUTPUT_CHARS: 1000000,               // 한 번 실행 출력 상한(글자) — 넘으면 멈춤(QA #123 무한 출력 대비). 큰 입력 만들기·정답 기대값 계산은 상한 없음
  TRACE_MAX_STEPS: 500,
  PROJECT_EXTRA_XP: 10, // 실전 프로젝트 「더 만들어 보기」 항목당 (채점 없음, 한 번만)
  ALGO: { traceMaxSteps: 5000, slowdown: 3, benchBaselineMs: 350, mockMinutes: 60, mockCount: 3, mockBonusXp: 150 }, // 알고리즘 코스: 시각화 추적 단계, Pyodide/CPython 배율, 기기 벤치 기준(ms), 모의고사
  MAX_CODE_SAVE_BYTES: 10240,
  STORAGE_WARN_BYTES: 4 * 1024 * 1024,     // 저장 용량 경고 (설정에 정리 버튼)

  // --- XP / 레벨 ---
  XP: { quiz: 10, fill: 15, bug: 20, parsons: 20, code: 30, num: 20, match: 20, pair: 20, mission: 25, sql: 25, web: 25 }, // num·match·pair: 수학 공간 유형 (v2.3.0) · mission·sql·web: 새 코스 유형 (v2.7.0)
  KATEX: { css: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css', js: 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js' }, // 수학 공간 수식 (없어도 글자 수식으로 대체)
  HINT_XP_MULT: [1, 0.7, 0.4, 0],        // 힌트 0,1,2,3단계 사용 시 배율 (정답 보기 = 0)
  FIRST_TRY_BONUS: 0.5,                   // 첫 시도 클리어 +50%
  COMBO_MULT: [[10, 2], [5, 1.5], [3, 1.2]],
  MAX_LEVEL: 50,
  xpForLevel: (L) => 30 + 4 * L,          // L -> L+1 에 필요한 XP (레벨 40 누적 ≈ 4,290)
  TITLES: ['코드 새싹', '출력 견습생', '변수 수집가', '조건 분기사', '반복의 달인', '함수 장인', '자료 정리사', '예외 사냥꾼', '객체 설계자', '파이썬 마스터'],
  MASCOT_STAGES: [1, 10, 20, 30, 40, 50],

  // --- 일일 / 스트릭 / 복습 ---
  DAILY_GOAL_OPTIONS: [3, 5, 10],
  DAILY_GOAL_BONUS: 30,
  REVIEW_BONUS: 20,                       // 복습 3개 완료 보너스
  REVIEW_INTERVALS: [1, 3, 7, 14, 30],    // 일
  REVIEW_SIZE: 5,                         // 복습 한 번에 고르는 문제 수 (Review.plan)
  BOSS_XP_RATIO: 0.5,
  DAILY_CHALLENGE_MULT: 2,
  CHECKUP_SIZE: 10, CHECKUP_PASS: 0.8, CHECKUP_BONUS: 40,
  REVIEW_XP_BONUS_PER: 5,
  DRILL_XP: 5, // ⌨ 타자 연습(DRILLS) 한 문제 기본 XP — 사용자 요청 11/3: 초반 문법을 손에 익히는 선택 연습
  DRILL_BATCH: 5, // 타자 연습 한 번에 몇 문제씩
  POLISH_XP: 10,

  // --- 선생님 (Claude API) ---
  TUTOR: {
    enabled: false, // v2.2.5: 선생님(Claude API) 기능 전체 끔 — 버튼·설정 카드·리뷰 숨김. 켜려면 true (사용자 결정 2026-11-02)
    url: 'https://api.anthropic.com/v1/messages',
    version: '2023-06-01',
    defaultModel: 'claude-haiku-5-5',
    altModel: 'claude-sonnet-5-5',
    maxTokens: 1024,
    consoleUrl: 'https://console.anthropic.com',
  },
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
  chips: ['뭐가 틀렸어요?', '이 에러가 무슨 뜻이에요?', '다른 방법도 있어요?', '이 개념 다시 설명해 주세요'],
  learned: '이번에 배운 것', example: '따라 하기', tryIt: '실행해 보기',
  confirmReset: '정말 모든 진행을 초기화할까요? 되돌릴 수 없어요.', confirmReset2: '정말요? 레벨·뱃지·코드가 모두 사라져요.',
  importConfirm: '불러오면 지금 진행이 덮어써져요. 계속할까요?', exported: '진행 파일을 내려받았어요.',
  dailyGoal: '일일 목표', goalDone: '오늘 목표 달성!', reviewDone: '기억 유지! 복습 완료',
  savedWork: '내 작품에 저장했어요', nameWork: '작품 이름을 지어 주세요',
  hintLabel: ['방향', '구체', '거의 정답'], steps: '단계', star: '별',
  needAllHints: '힌트 3개를 모두 본 뒤에 열 수 있어요.', seeAnswerConfirm: '정답을 보면 이 문제의 XP와 별은 0이 돼요. 그래도 볼까요?',
  tutorSystem: `너는 프로그래밍을 처음 배우는 한국어 사용자를 가르치는 친절한 파이썬 선생님이야.
규칙:
1. 쉬운 말, 짧은 문장, 비유를 먼저 써. 전문 용어는 한 문장으로 풀어 써.
2. 정답 코드를 통째로 주지 마. 질문을 되묻거나, 어디서 막혔는지 짚어 주거나, 다음 한 줄만 안내해.
3. 사용자 코드에 에러가 있으면 에러 메시지를 사람 말로 풀고 어느 줄을 보라고 알려 줘.
4. 현재 레슨 범위를 벗어난 개념은 "그건 나중에 배워요"라고 미루고 지금 범위 안에서 설명해.
5. 답은 300자 안팎, 코드 예시는 3줄 이내. 마크다운 코드 블록을 써도 돼.
6. 사용자가 이미 "정답 보기"를 열었다면(맥락에 표시됨) 전체 코드 설명도 허용해.`,
  tutorSystemFree: `너는 프로그래밍을 처음 배우는 한국어 사용자를 돕는 친절한 파이썬 선생님이야. 지금은 자유 질문 중이라 완성 코드를 보여 줘도 돼. 쉬운 말, 짧은 문장, 비유를 먼저 쓰고 전문 용어는 한 문장으로 풀어 써. 답은 400자 안팎.`,
};
