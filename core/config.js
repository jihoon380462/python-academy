// =====================================================================
// === CONFIG ===  (수치·CDN 주소·모델명. 수정을 맡길 때 APP_VERSION을 올린다)
// =====================================================================
const CONFIG = {
  APP_VERSION: '2.0.1',
  HUB_PATH: '../../index.html',             // 코스 페이지에서 허브로 (상대 경로)
  SCHEMA_VERSION: 2,                      // 2 = academy.* 조각 저장 (core/storage.js)
  COURSES: [                              // 허브 코스 카드 순서. path는 허브 기준 상대 경로
    { id: 'python', name: '파이썬', icon: '🐍', desc: '블록에서 텍스트까지, 브라우저에서 진짜 파이썬', path: 'courses/python/', color: '#2bb673', ready: true },
    { id: 'algo', name: '알고리즘·자료구조', icon: '🧭', desc: '코드가 돌아가는 모습을 눈으로 보며, 코딩테스트 입문까지', requires: { course: 'python', boss: 'B3', label: '파이썬 챕터 3까지 끝내면 열려요' }, phase: 1 },
    { id: 'terminal-git', name: '터미널·Git', icon: '🎧', desc: '검은 창이 무섭지 않게. 가상 터미널과 Git 시뮬레이터', phase: 2 },
    { id: 'sql', name: '데이터베이스(SQL)', icon: '🗄️', desc: '동네 카페 데이터로 배우는 진짜 SQLite', phase: 3 },
    { id: 'web', name: '웹·HTTP·API', icon: '🌐', desc: '내가 만든 걸 남에게 보여주려면', requires: { course: 'python', boss: 'B2', label: '파이썬 챕터 2까지 끝내면 열려요' }, phase: 4 },
  ],

  // --- 외부 라이브러리 (버전 고정) ---
  PYODIDE_VERSION: '0.27.5',
  PYODIDE_URL: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js',
  PYODIDE_INDEX: 'https://cdn.jsdelivr.net/pyodide/v0.27.5/full/',
  PYODIDE_SIZE_MB: 10,
  BLOCKLY: {
    core: 'https://unpkg.com/blockly@11.2.2/blockly.min.js',
    python: 'https://unpkg.com/blockly@11.2.2/python_compressed.js',
    ko: 'https://unpkg.com/blockly@11.2.2/msg/ko.js',
  },
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
  TRACE_MAX_STEPS: 500,
  MAX_CODE_SAVE_BYTES: 10240,
  STORAGE_WARN_BYTES: 4 * 1024 * 1024,     // 저장 용량 경고 (설정에 정리 버튼)
  HUB: { minutesPerProblem: 4 },           // 허브 '남은 시간' 추정치 (문제당 분)

  // --- XP / 레벨 ---
  XP: { quiz: 10, fill: 15, bug: 20, parsons: 20, block: 25, code: 30 },
  HINT_XP_MULT: [1, 0.7, 0.4, 0],        // 힌트 0,1,2,3단계 사용 시 배율 (정답 보기 = 0)
  TEXT_MODE_MULT: 1.5,                    // Parsons/텍스트 선택 가능 문제를 텍스트로 풀면
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
  PLAYGROUND_XP: 5, PLAYGROUND_XP_DAILY_MAX: 50,
  BOSS_XP_RATIO: 0.5,
  DAILY_CHALLENGE_MULT: 2,
  CHECKUP_SIZE: 10, CHECKUP_PASS: 0.8, CHECKUP_BONUS: 40,
  REVIEW_XP_BONUS_PER: 5,
  POLISH_XP: 10,

  // --- 선생님 (Claude API) ---
  TUTOR: {
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
  settings: '설정', badges: '뱃지', profile: '프로필', inventory: '보관함', playground: '놀이터', works: '내 작품',
  glossary: '용어집', errorDict: '에러 사전', weakness: '약점 분석', review: '복습', dailyChallenge: '오늘의 도전',
  timeAttack: '타임 어택', checkup: '종합 점검', level: '레벨', xp: 'XP', streak: '연속 학습', combo: '콤보',
  stdin: '입력값', output: '출력', tests: '테스트', passed: '통과', failed: '실패', clear: '클리어!', locked: '잠김',
  loadingPy: '파이썬 엔진을 준비하고 있어요', loadFail: '이 앱은 처음 실행할 때 인터넷 연결이 필요해요. 연결을 확인한 뒤 다시 시도해 주세요.',
  retry: '다시 시도', timeout: '코드가 끝나지 않고 계속 돌고 있어요. while 조건이나 반복 횟수를 확인해 보세요.',
  needInput: (n) => `입력값 칸에 ${n}번째 값이 필요해요.`,
  tooLong: '…(너무 많아 생략)',
  toText: '텍스트로 직접 고치기', toTextConfirm: '텍스트로 바꾸면 이 문제는 다시 블록으로 돌아올 수 없어요. 바꿀까요?',
  parsonsOrText: '어떤 방식으로 풀까요?', byParsons: 'Parsons로 풀기', byText: '텍스트로 풀기 (XP 1.5배)',
  firstTry: '첫 시도 클리어!', levelUp: '레벨 업!', newTitle: '새 칭호', badgeGet: '뱃지 획득',
  bossDefeated: '보스 격파!', chapterOpen: '다음 챕터가 열렸어요', noKey: '설정에서 API 키를 넣으면 선생님에게 물어볼 수 있어요.',
  keyBad: '키가 올바르지 않아요. 설정에서 다시 확인해 주세요.', rateLimit: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.',
  netErr: '인터넷 연결을 확인해 주세요.', keyOk: '연결 성공! 선생님과 대화할 수 있어요.',
  chips: ['뭐가 틀렸어요?', '이 에러가 무슨 뜻이에요?', '다른 방법도 있어요?', '이 개념 다시 설명해 주세요'],
  minutes: (m) => `약 ${m}분`, learned: '이번에 배운 것', example: '따라 하기', tryIt: '실행해 보기', toPlayground: '놀이터로 가져가기',
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
  tutorSystemFree: `너는 프로그래밍을 처음 배우는 한국어 사용자를 돕는 친절한 파이썬 선생님이야. 지금은 놀이터에서 자유롭게 코드를 만드는 중이라 완성 코드를 보여 줘도 돼. 쉬운 말, 짧은 문장, 비유를 먼저 쓰고 전문 용어는 한 문장으로 풀어 써. 답은 400자 안팎.`,
};
