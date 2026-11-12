// vocab/decks/index.js — 덱 목록. 적힌 순서가 화면 순서예요. 노트는 덱마다 따로 파일에 넣어요: vocab/decks/<덱 id>*.js
//   id        카드 id 의 첫 칸이라 한 번 정하면 바꾸지 않아요(바꾸면 그 덱의 복습 기록이 끊겨요)
//   tpl       이 덱의 노트가 만드는 카드 종류: r 읽기(영어 → 뜻) · l 듣기(소리 → 뜻) · t 쓰기(뜻 → 철자). 노트에 tpl 을 적으면 그 노트만 따로
//   newPerDay 하루에 새로 꺼내는 카드 수의 기본값(사용자가 설정에서 바꿀 수 있어요)
//   credit    출처 표기. 덱 개요 화면 아래에 보여요(공개 목록을 쓴 덱은 꼭 — vocab/sources/README.md)
//   sample    정식 목록이 들어오기 전 표본이라는 표시. 정식으로 채우면 지워요(tools/check_vocab.mjs 가 검사)
//   노트가 하나도 없는 덱은 화면에 「준비 중」 으로 나와요. 채우는 법과 품질 기준: specs/vocab.md
VocabDecks.add({ id: 'base', name: '기초 일반 단어', desc: '영어 글과 말의 뼈대가 되는, 가장 자주 쓰이는 단어', tpl: ['r'], newPerDay: 10,
  credit: '단어와 차례: New General Service List 1.2 · NGSL-Spoken 1.2 (Browne, Culligan & Phillips) — CC BY-SA 4.0. 뜻과 예문은 이 사이트가 썼어요.' });
VocabDecks.add({ id: 'slang', name: '속어 · 거친 말', desc: '미국에서 들으면 알아들어야 하는 말 — 욕 · 비하어 · 성 · 마약 · 술 · 범죄와 사기 · 일상 속어', tpl: ['r', 'l'], newPerDay: 5 });
VocabDecks.add({ id: 'listen', name: '듣기', desc: '강의에서 들리는 말 — 기호와 코드 읽는 법 · 강의 말버릇 · 외래어와 소리가 다른 단어', tpl: ['l'], newPerDay: 5 });
VocabDecks.add({ id: 'dev', name: '개발 단어', desc: '코드 · 에러 · git · 터미널 · 웹 · DB 에서 만나는 말 — 개념의 영어 이름 · 개발 뜻이 따로 있는 말 · 줄임말 · 접사', tpl: ['r'], newPerDay: 5 });
VocabDecks.add({ id: 'acad', name: '학술 단어', desc: '대학 강의와 논문에 자주 나오는 단어', tpl: ['r'], newPerDay: 5 });
