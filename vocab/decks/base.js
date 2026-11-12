// vocab/decks/base.js — 「기초 일반 단어」 덱의 노트. 지금은 카드 모양과 품질의 본보기인 표본 10개예요(정식으로 채우기: specs/vocab.md 6절 W1).
// 단어와 차례의 출처: New General Service List 1.2 · NGSL-Spoken 1.2 (Browne, Culligan & Phillips) — CC BY-SA 4.0 (vocab/sources/README.md).
//   뜻 · 예문 · 쓰임은 이 사이트가 직접 쓴 것이고, 목록을 바탕으로 만든 이 덱도 같은 CC BY-SA 4.0 조건을 따라요.
// 노트 한 줄의 칸
//   id     노트 id(영어 소문자 · 숫자 · 하이픈). 덱 안에서 겹치지 않고, 한 번 내보낸 뒤에는 바꾸지 않아요(복습 기록의 열쇠)
//   w      카드에 보이는 단어
//   rank   이 덱에서 배우는 차례. 기초 덱은 차례표(vocab/sources/base-order.tsv)의 no · id · word 를 그대로 써요(tools/check_vocab.mjs 가 대조)
//   ko     뜻 목록 [[품사, 뜻], …] — 가장 흔한 뜻부터 1~3개. 품사: n v adj adv prep conj pron det aux num int phr abbr sym affix
//   ex     예문 목록 [[영어, 한국어], …] — 1~2개. 첫 예문에는 w(또는 forms 의 한 모양)가 들어 있어야 해요
//   forms  예문에 나오는 다른 모양(복수 · 과거 등). 예문에서 그 낱말을 굵게 보여 줘요. 차례표의 forms 칸을 그대로 써도 돼요
//   note   쓰임 한 줄(자주 붙는 짝, 헷갈리는 점) · say 읽어 줄 글자가 w 와 다를 때 · pron 소리 적기 · tpl 이 노트만 카드 종류를 달리할 때
VocabDecks.notes('base', [
  { id: 'whether', w: 'whether', rank: 215, ko: [['conj', '~인지 (아닌지)']], ex: [["I don't know whether he will come.", '그가 올지 안 올지 모르겠어요.']] },
  { id: 'example', w: 'example', rank: 295, ko: [['n', '예, 본보기']], ex: [['Can you give me an example?', '예를 하나 들어 줄래요?']], forms: ['examples'], note: 'for example: 예를 들어' },
  { id: 'provide', w: 'provide', rank: 422, ko: [['v', '제공하다, 주다']], ex: [['The hotel provides free towels.', '그 호텔은 수건을 무료로 제공해요.']], forms: ['provides', 'provided', 'providing'] },
  { id: 'allow', w: 'allow', rank: 440, ko: [['v', '허락하다, ~하게 해 주다']], ex: [['This ticket allows you to enter the museum.', '이 표가 있으면 박물관에 들어갈 수 있어요.']], forms: ['allows', 'allowed', 'allowing'], note: 'allow A to B: A가 B할 수 있게 해 주다' },
  { id: 'include', w: 'include', rank: 477, ko: [['v', '포함하다']], ex: [['The price includes breakfast.', '가격에 아침 식사가 포함돼 있어요.']], forms: ['includes', 'included', 'including'], note: 'including A: A를 포함해서' },
  { id: 'result', w: 'result', rank: 546, ko: [['n', '결과'], ['v', '(결과로) 생기다']], ex: [['The result was better than I expected.', '결과는 내가 기대한 것보다 좋았어요.']], forms: ['results', 'resulted', 'resulting'], note: 'as a result: 그 결과' },
  { id: 'available', w: 'available', rank: 599, ko: [['adj', '쓸 수 있는, 구할 수 있는']], ex: [['Tickets are available online.', '표는 온라인에서 살 수 있어요.']], note: '사람에게 쓰면: 시간이 되는' },
  { id: 'instead', w: 'instead', rank: 631, ko: [['adv', '대신에']], ex: [['There was no coffee, so I had tea instead.', '커피가 없어서 대신 차를 마셨어요.']], note: 'instead of A: A 대신' },
  { id: 'several', w: 'several', rank: 680, ko: [['det', '몇몇의, 여러']], ex: [['I have read this book several times.', '나는 이 책을 여러 번 읽었어요.']] },
  { id: 'require', w: 'require', rank: 709, ko: [['v', '필요로 하다, 요구하다']], ex: [['This job requires a lot of patience.', '이 일에는 인내심이 많이 필요해요.']], forms: ['requires', 'required', 'requiring'], note: 'required: 꼭 있어야 하는(필수)' },
]);
