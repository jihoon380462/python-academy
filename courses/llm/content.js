// courses/llm/content.js — 「LLM 기초 교과서」 (v2.32.0, 사용자 공용 코스 T11 「원리 + 아주 작은 모델 — 이런 느낌으로 움직인다」 11/6 · 「1번진행」 11/7). 설계: specs/llm-course.md
// 교과서 모드. 연습은 내 PC 의 VS Code + 파이썬 + numpy. example.code = 파이썬(check_book 이 python3 + numpy 로 실제 실행). 무작위는 늘 seed 고정.
const COURSE = { id: 'llm', name: 'LLM 기초', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 LLM 기초 을 작은 파이썬 코드로 직접 만들어 보며 가르치는 선생님이다. 원리를 말한 뒤 꼭 코드가 찍는 값으로 보여 준다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#8e24aa' },
  { ch: 1, name: '숫자 세기 모델', color: '#4f6bed' },
  { ch: 2, name: '배우는 모델', color: '#2ea043' },
  { ch: 3, name: '어텐션과 트랜스포머', color: '#d97706' },
  { ch: 4, name: '내 작은 언어 모델', color: '#c62828' },
];
const LLM_TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }]; // v2.32.0 뼈대: 아직 안 채운 레슨 — draft:true 라 목차에 「준비 중」
const LESSONS = [
{ id: 'N0', ch: 0, n: 0, title: 'LLM 은 다음 글자 맞히기', mode: 'text',
  tutorSummary: "LLM 은 지금까지의 글을 보고 다음 글자(정확히는 토큰)를 맞히는 일을 아주 크게 한 것 — 휴대폰 자동 완성과 같은 일. 글 자체가 문제집: 앞부분 text[:i] 가 문제, text[i] 가 정답이라 사람이 정답을 달 필요가 없고, 글자 n 개면 문제 n - 1 개. 가장 쉬운 맞히기는 세기: counts[nxt] = counts.get(nxt, 0) + 1 로 「이 글자 다음에 무엇이 몇 번」, 횟수 / 합 = 확률(합은 1). 글 짓기 = ① 확률 표 ② 하나 고르기(지금은 1등 max(probs, key=probs.get)) ③ 이어 붙이고 다시. 표에 있으면 이상한 말도 지어낸다(그럴듯한 다음 글자일 뿐). 학습 글은 text = open(\"data.txt\", encoding=\"utf-8\").read(). 이 교과서의 길: 세기(챕터 1) → 배우기(2, numpy) → 어텐션 · 트랜스포머(3) → 내 작은 언어 모델(4).",
  terms: { "LLM": "대형 언어 모델(Large Language Model). 아주 많은 글로 「다음 토큰 맞히기」 를 배운 아주 큰 언어 모델 — ChatGPT · Claude 같은 것", "언어 모델": "앞에 나온 글을 보고, 다음에 올 글자(토큰)마다 확률을 매기는 프로그램", "확률": "얼마나 자주 일어날지를 0 ~ 1 사이 수로 나타낸 것. 일어날 수 있는 경우를 모두 더하면 1" },
  pages: [
    { title: "자동 완성 · text[:i] → text[i]", html: `<p>휴대폰 자판에서 「오늘은 비가」 까지 치면 위에 「와요」 「많이」 같은 말이 떠요. <b>자동 완성</b>이에요. 휴대폰은 지금까지 친 글을 보고 <b>다음에 올 말</b>을 맞혀요.</p>\n<p>ChatGPT · Claude 같은 [[LLM]] 도 같은 일을 해요. 지금까지의 글을 보고 다음 글자를 하나 맞혀 붙이고, 붙인 글을 다시 보고 또 하나 맞혀 붙여요. 이걸 수백 번 되풀이하면 대답 한 편이 돼요. 그러니까 LLM 은 <b>「다음 글자 맞히기」 를 아주 크게, 아주 잘 하는 [[언어 모델]]</b>이에요(정확히는 글자 대신 [[레슨:N1]] 의 「토큰」 이지만, 지금은 글자라고 생각해도 돼요).</p>\n<p>맞히기 문제는 어디서 올까요? <b>글 자체가 문제집</b>이에요. 글의 앞부분 <code>text[:i]</code> 가 문제, 바로 다음 글자 <code>text[i]</code> 가 정답이에요.</p>\n<pre>text = "비가 오면"\nprint(text[:1], text[1])   # 비 가\nprint(text[:3], text[3])   # 비가  오\nprint(len(text) - 1)       # 4 — 문제 수</pre>\n<p>사람이 정답을 달아 줄 필요가 없어요. 글만 있으면 문제가 저절로 생겨요. 그래서 큰 LLM 은 인터넷 · 책의 엄청난 글을 그대로 문제집으로 써요. 띄어쓰기와 마침표도 글자예요 — 모델은 「여기서 띄어 쓸까?」 도 맞혀야 해요. 예제는 정답을 <code>[ ]</code> 안에 찍어서 띄어쓰기 정답도 보이게 했어요.</p>`,
      example: { code: `text = "비가 오면 우산을 쓴다."\nfor i in range(1, len(text)):\n    print(text[:i], "→", f"[{text[i]}]")\nprint("문제 수:", len(text) - 1)` } },
    { title: "다음 글자 세기 · counts.get(nxt, 0) + 1", html: `<p>그럼 어떻게 맞힐까요? 가장 쉬운 방법은 <b>세기</b>예요. 글에서 「쓰」 다음에 무엇이 왔는지 모두 세면, 다음에도 그게 올 거라고 짐작할 수 있죠.</p>\n<pre>counts = {}\nfor i in range(len(text) - 1):\n    if text[i] == ch:\n        nxt = text[i + 1]\n        counts[nxt] = counts.get(nxt, 0) + 1</pre>\n<p><code>counts.get(nxt, 0)</code> 은 「지금까지 센 수, 처음이면 0」 이에요(<a href="../python/#lesson/L10" target="_blank" rel="noopener">파이썬 교과서 「딕셔너리」 ↗</a>). 예제의 짧은 글(문장 넷)에서 세어 보면 이래요.</p>\n<table class="kb"><tbody><tr><th>앞 글자</th><th>다음 글자 · 횟수</th><th>맞히기</th></tr>\n<tr><td><code>"쓰"</code></td><td>고 2</td><td>쉬워요 — 늘 「고」</td></tr>\n<tr><td><code>"다"</code></td><td>. 4</td><td>쉬워요 — 늘 마침표</td></tr>\n<tr><td><code>" "</code></td><td>우 · 쓴 · 쓰 · 간 · 모 2, 오 · 학 · 해 · 뜨 · 공 1</td><td>어려워요 — 새 낱말이 시작되는 자리</td></tr></tbody></table>\n<p>횟수를 전체 합으로 나누면 [[확률]]이 돼요. 띄어쓰기 다음은 15 번, 그중 「우」 가 2 번이니 2 / 15 ≈ 0.13 이에요. 확률을 모두 더하면 1 이에요. 이렇게 <b>「다음 글자마다 확률」 을 매긴 표</b>가 언어 모델의 속마음이에요.</p>\n<p class="muted small">글자를 <code>repr(nxt)</code> 로 찍으면 따옴표가 붙어서 띄어쓰기 <code>' '</code> 도 눈에 보여요.</p>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\n\ndef next_counts(text, ch):\n    counts = {}\n    for i in range(len(text) - 1):\n        if text[i] == ch:\n            nxt = text[i + 1]\n            counts[nxt] = counts.get(nxt, 0) + 1\n    return counts\n\nprint(next_counts(text, "쓰"))\nprint(next_counts(text, "다"))\nc = next_counts(text, " ")\nprint(c)\ntotal = sum(c.values())\nfor nxt, n in c.items():\n    print(repr(nxt), n, "번 →", round(n / total, 2))` } },
    { title: "고르고 이어 붙이기 · max(probs, key=probs.get)", html: `<p>확률 표가 있으면 글을 지을 수 있어요. 세 단계를 되풀이해요.</p>\n<table class="kb"><tbody><tr><th>단계</th><th>하는 일</th><th>코드</th></tr>\n<tr><td>① 확률 표</td><td>마지막 글자를 보고 다음 글자마다 확률</td><td><code>probs = table[text[-1]]</code></td></tr>\n<tr><td>② 고르기</td><td>하나 고르기 — 지금은 1등</td><td><code>max(probs, key=probs.get)</code></td></tr>\n<tr><td>③ 이어 붙이기</td><td>붙이고 ① 로</td><td><code>text = text + best</code></td></tr></tbody></table>\n<p><code>max(probs, key=probs.get)</code> 은 「값(확률)이 가장 큰 열쇠(글자)」 예요. <code>sorted(probs, key=probs.get, reverse=True)</code> 는 확률이 큰 글자부터 줄 세운 리스트고요(<a href="../python/#lesson/L12C" target="_blank" rel="noopener">파이썬 교과서 「정렬과 복사」 ↗</a> 의 key).</p>\n<pre>probs = {"온": 0.5, "와": 0.3, "많": 0.2}\nprint(max(probs, key=probs.get))                     # 온\nprint(sorted(probs, key=probs.get, reverse=True))    # ['온', '와', '많']</pre>\n<p>예제의 표는 손으로 썼어요. 「비」 에서 시작해 한 글자씩 붙이면 「비가 온다.」 가 돼요. 진짜 모델은 이 표를 <b>글에서 세거나(챕터 1) 배워서(챕터 2 ~ 4)</b> 만들어요. 늘 1등만 고르면 같은 말만 되풀이하는 문제가 있는데, 그건 [[레슨:N3]] 에서 「뽑기」 로 풀어요.</p>\n<div class="bk-warn"><b>LLM 은 「아는 것」 이 아니라 「그럴듯한 다음 글자」 를 말해요</b> — 표에 「가 → 방」 이 있으면 「비가방」 같은 이상한 말도 지을 수 있어요. 큰 LLM 이 가끔 그럴듯한 거짓말을 지어내는 것도 같은 까닭이에요([[레슨:N15]]).</div>`,
      example: { code: `table = {\n    "비": {"가": 1.0},\n    "가": {" ": 0.8, "방": 0.2},\n    " ": {"온": 0.5, "와": 0.3, "많": 0.2},\n    "온": {"다": 1.0},\n    "다": {".": 1.0},\n}\nprobs = table[" "]\nprint(max(probs, key=probs.get))\nprint(sorted(probs, key=probs.get, reverse=True))\n\ntext = "비"\nwhile text[-1] in table:\n    probs = table[text[-1]]\n    best = max(probs, key=probs.get)\n    text = text + best\n    print(f"[{text}]")` } },
    { title: "글 하나 = 문제 len(text) - 1 개 · 이 교과서의 길", html: `<p>글자가 n 개인 글에는 맞히기 문제가 n − 1 개 있어요. 이 교과서의 학습 글 <code>data.txt</code>(시작하기 2)는 821 글자라 문제가 820 개예요. 큰 LLM 은 10 조(10 ** 13) 개쯤의 토큰으로 배워요 — 같은 일을 엄청 크게 한 거예요.</p>\n<p>만들어 보기에서는 학습 글을 늘 이렇게 읽어요. <code>data.txt</code> 가 .py 파일과 같은 폴더에 있어야 해요(<a href="../python/#lesson/L17" target="_blank" rel="noopener">파이썬 교과서 「파일 읽기 · 쓰기」 ↗</a>).</p>\n<pre>text = open("data.txt", encoding="utf-8").read()</pre>\n<p>이 교과서는 아주 작은 언어 모델을 <b>처음부터 직접</b> 만들어요.</p>\n<table class="kb"><tbody><tr><th>챕터</th><th>만드는 것</th><th>배우는 것</th></tr>\n<tr><td>1 숫자 세기 모델</td><td>글자 짝을 세는 모델 → 내 첫 글 생성기</td><td>토큰 · 확률 · 뽑기 · 손실 (파이썬만)</td></tr>\n<tr><td>2 배우는 모델</td><td>세지 않고 <b>배워서</b> 맞히는 모델</td><td>numpy · 임베딩 · 경사하강</td></tr>\n<tr><td>3 어텐션과 트랜스포머</td><td>앞 글자 여럿 중 어디를 볼지 고르는 장치</td><td>어텐션 · Q · K · V · 트랜스포머 블록</td></tr>\n<tr><td>4 내 작은 언어 모델</td><td>앞 3 글자를 보고 배우는 모델</td><td>학습 고리 · 역전파 · 큰 LLM 과 비교</td></tr></tbody></table>\n<p>목표는 「완벽하게」 가 아니라 <b>「아, 이런 느낌으로 움직이는구나」</b> 예요. 수학은 사칙연산이면 시작할 수 있고, 필요한 건 그때그때 설명해요. 다음 레슨 [[레슨:N1]] 에서 글을 조각(토큰)으로 자르는 것부터 해요.</p>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다."\nprint("글자 수", len(text))\nprint("맞히기 문제 수", len(text) - 1)\n\npairs = [(text[:i], text[i]) for i in range(1, len(text))]\nprint(pairs[0])\nprint(pairs[1])\nprint(pairs[-1])\n\nbig = 10 ** 13\nprint("큰 LLM 의 학습 글:", f"{big:,}", "토큰쯤")\nprint("이 글의", f"{big // len(text):,}", "배")` } },
  ],
  summary: ["LLM 은 지금까지의 글을 보고 다음 글자(토큰)를 맞히는 일을 아주 크게 한 것 — 자동 완성처럼", "글 자체가 문제집: 앞부분 text[:i] 가 문제, text[i] 가 정답 · 세면 확률 표가 된다", "글 짓기 = 확률 표 → 하나 고르기 → 이어 붙이고 다시"] },
{ id: 'N1', ch: 1, n: 1, title: '토큰: 글을 조각으로', mode: 'text',
  tutorSummary: "모델은 글을 토큰으로 잘라 읽는다. 글자 단위(어휘가 작고 글이 김) · 낱말 단위(글은 짧지만 「우산을 · 우산이」 처럼 어휘가 폭발, 처음 보는 낱말은 못 씀) · 하위 낱말 BPE(둘의 중간, 큰 LLM 이 씀, 어휘 수만 ~ 십수만). 이 교과서는 한글 음절 하나 = 토큰 하나(학습 글 어휘 130 개). 어휘: chars = sorted(set(text)), stoi = {ch: i for i, ch in enumerate(chars)}, itos = {i: ch for ch, i in stoi.items()}, V = len(chars) — 교과서 끝까지 같은 네 줄. encode = [stoi[ch] for ch in s], decode = \"\".join(itos[i] for i in ids). 어휘에 없는 글자는 KeyError — ch in stoi 로 확인. BPE 한 단계: Counter(zip(tokens, tokens[1:])).most_common(1) 의 짝을 merge 로 하나로 합치고 되풀이, 합친 순서를 규칙으로 저장.",
  terms: { "토큰": "모델이 한 번에 하나씩 읽고 맞히는 글 조각. 글자 하나일 수도, 낱말이나 낱말 조각일 수도 있다", "어휘": "모델이 아는 토큰 전부의 목록. 토큰마다 번호가 있고, 크기를 V 라고 쓴다", "BPE": "Byte Pair Encoding. 가장 자주 붙어 나오는 두 조각을 하나로 합치는 일을 되풀이해 하위 낱말 어휘를 만드는 방법" },
  pages: [
    { title: "글자 · 낱말 · 조각 — list(text) · text.split()", html: `<p>모델은 글을 통째로 보지 못해요. 먼저 작은 조각인 [[토큰]]으로 잘라서, 토큰 하나씩 읽고 다음 토큰을 맞혀요. 자르는 방법은 크게 셋이에요.</p>\n<table class="kb"><tbody><tr><th>방법</th><th>「우산을 쓴다.」</th><th>좋은 점 · 나쁜 점</th></tr>\n<tr><td>글자</td><td>우 · 산 · 을 · ' ' · 쓴 · 다 · .</td><td>어휘가 작아요. 대신 글이 길어져요(토큰이 많음)</td></tr>\n<tr><td>낱말</td><td>우산을 · 쓴다.</td><td>글은 짧아요. 대신 「우산을 · 우산이 · 우산에」 가 다 다른 낱말이라 어휘가 엄청 커지고, 처음 보는 낱말은 못 써요</td></tr>\n<tr><td>하위 낱말(BPE)</td><td>우산 · 을 · ' 쓴' · 다. (예)</td><td>둘의 중간. 자주 나오는 조각은 통째로, 드문 건 잘게. 큰 LLM 이 쓰는 방법(어휘 수만 ~ 십수만 개)</td></tr></tbody></table>\n<pre>text = "우산을 쓴다."\nprint(list(text))     # ['우', '산', '을', ' ', '쓴', '다', '.']\nprint(text.split())   # ['우산을', '쓴다.']</pre>\n<p>예제의 글은 글자로 자르면 27 토큰(13 종류), 낱말로 자르면 7 토큰(6 종류)이에요. 「우산을」 과 「우산이」 가 벌써 다른 낱말이죠. 글이 길어질수록 낱말 종류는 끝없이 늘어나요.</p>\n<p>이 교과서는 <b>글자 하나 = 토큰 하나</b>로 해요. 어휘가 작아서(학습 글에서 130 개) 결과를 눈으로 읽기 쉬워요. 하위 낱말은 3 쪽에서 맛만 봐요.</p>\n<div class="bk-warn"><b>파이썬에서 「우」 는 한 글자</b> — <code>len("우")</code> 는 1 이에요. 하지만 컴퓨터 안에서는 UTF-8 로 3 바이트라서, 바이트에서 출발하는 큰 LLM 의 토크나이저에서는 한국어 글이 같은 뜻의 영어 글보다 토큰을 더 많이 쓰는 일이 흔해요.</div>`,
      example: { code: `text = "우산을 쓴다. 우산을 쓰고 간다. 우산이 젖었다."\nchars = list(text)\nwords = text.split()\nprint(chars[:6])\nprint(words)\nprint("글자 토큰", len(chars), "개 · 종류", len(set(chars)))\nprint("낱말 토큰", len(words), "개 · 종류", len(set(words)))\nprint(len("우"), len("우".encode("utf-8")))` } },
    { title: "어휘와 번호 · stoi · itos", html: `<p>모델은 글자가 아니라 <b>숫자</b>로 계산해요. 그래서 글에 나오는 글자를 모아 [[어휘]]를 만들고, 글자마다 번호를 붙여요.</p>\n<pre>chars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)</pre>\n<table class="kb"><tbody><tr><th>이름</th><th>뜻</th></tr>\n<tr><td><code>chars</code></td><td>글에 나온 글자를 한 번씩, 정렬해서(늘 같은 순서)</td></tr>\n<tr><td><code>stoi</code></td><td>string to integer — 글자 → 번호. <code>stoi["우"]</code></td></tr>\n<tr><td><code>itos</code></td><td>integer to string — 번호 → 글자. <code>itos[18]</code></td></tr>\n<tr><td><code>V</code></td><td>어휘 크기(vocabulary size)</td></tr></tbody></table>\n<p>이 네 줄은 <b>교과서 끝까지 똑같이</b> 써요. 글 → 번호 리스트가 <code>encode</code>, 번호 → 글이 <code>decode</code> 예요.</p>\n<pre>def encode(s):\n    return [stoi[ch] for ch in s]\n\ndef decode(ids):\n    return "".join(itos[i] for i in ids)</pre>\n<p>예제의 짧은 글은 어휘가 24 개라 <code>encode("우산을 쓴다.")</code> 는 <code>[18, 13, 20, 0, 15, 7, 1]</code> 이에요. 띄어쓰기 <code>' '</code> 가 0 번이에요 — 정렬하면 기호가 한글보다 앞에 와요. 학습 글 data.txt 에서는 줄바꿈 <code>'\\n'</code> 이 0 번이에요.</p>\n<div class="bk-warn"><b>어휘에 없는 글자는 KeyError</b> — 학습 글에 없던 「눈」 은 <code>stoi["눈"]</code> 에서 멈춰요. 미리 <code>"눈" in stoi</code> 로 확인하세요(없으면 <code>"눈" not in stoi</code> 가 True). 모델은 배운 적 없는 글자는 읽지도 쓰지도 못해요. 큰 LLM 은 바이트까지 쪼갤 수 있는 BPE 를 써서 어떤 글자든 받아요.</div>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\n\nprint(V)\nprint(chars)\nprint(stoi["우"], itos[18])\n\ndef encode(s):\n    return [stoi[ch] for ch in s]\n\ndef decode(ids):\n    return "".join(itos[i] for i in ids)\n\nids = encode("우산을 쓴다.")\nprint(ids)\nprint(decode(ids))\nprint(decode(encode(text)) == text)\nprint("눈" in stoi)` } },
    { title: "BPE 한 단계 · most_common(1) 짝 합치기", html: `<p>하위 낱말 토큰은 [[BPE]] 로 만들어요. 생각보다 단순해요.</p>\n<ol><li>글자 하나씩으로 시작해요.</li><li>붙어 있는 두 토큰의 짝을 모두 세요 — <code>Counter(zip(tokens, tokens[1:]))</code></li><li>가장 많은 짝 <code>most_common(1)</code> 을 새 토큰 하나로 합쳐요.</li><li>2 로 돌아가 되풀이해요.</li></ol>\n<p><code>zip(tokens, tokens[1:])</code> 은 이웃한 둘을 짝지어 줘요: (우, 산) (산, 을) (을, ' ') …. <code>Counter</code> 는 같은 짝이 몇 번인지 세어 주고요(<a href="../python/#lesson/L16C" target="_blank" rel="noopener">파이썬 교과서 「표준 라이브러리 Counter」 ↗</a>).</p>\n<pre>from collections import Counter\ntokens = list("우산을 쓴다. 우산을 쓰고")\npairs = Counter(zip(tokens, tokens[1:]))\nprint(pairs.most_common(1))   # [(('우', '산'), 2)]</pre>\n<p>합치기는 리스트를 앞에서부터 보며, 그 짝을 만나면 둘을 붙여 하나로 넣어요(예제의 <code>merge</code>). 예제에서는 「다 + .」 → 「다.」, 「다. + ' '」 → 「다. 」, 「우 + 산」 → 「우산」 … 다섯 번 합치면 「우산을 」 이 통째로 토큰 하나가 되고, 토큰이 37 개에서 24 개로 줄어요.</p>\n<p>진짜 BPE 는 이걸 수만 번 해서 어휘를 만들고, <b>합친 순서</b>를 규칙 목록으로 저장해 둬요. 새 글이 들어오면 같은 순서로 합쳐서 토큰으로 바꿔요. 이 교과서의 모델은 다시 글자 토큰으로 돌아가요 — 원리는 똑같고 눈으로 읽기 쉬우니까요.</p>`,
      example: { code: `from collections import Counter\n\ntext = "우산을 쓴다. 우산을 쓰고 간다. 모자를 쓴다. 모자를 쓰고 간다."\n\ndef merge(tokens, pair):\n    out = []\n    i = 0\n    while i < len(tokens):\n        if i + 1 < len(tokens) and (tokens[i], tokens[i + 1]) == pair:\n            out.append(tokens[i] + tokens[i + 1])\n            i += 2\n        else:\n            out.append(tokens[i])\n            i += 1\n    return out\n\ntokens = list(text)\nprint("처음", len(tokens), "개")\nfor step in range(1, 6):\n    pairs = Counter(zip(tokens, tokens[1:]))\n    pair, n = pairs.most_common(1)[0]\n    tokens = merge(tokens, pair)\n    print(step, "단계:", pair, n, "번 →", len(tokens), "개")\nprint(tokens)` } },
  ],
  summary: ["토큰 = 모델이 읽는 조각 — 글자 · 낱말 · 하위 낱말(BPE), 이 교과서는 글자 하나", "chars = sorted(set(text)) · stoi · itos · V 네 줄로 글자 ↔ 번호", "BPE 는 가장 많은 짝 most_common(1) 을 합치는 일을 되풀이"] },
{ id: 'N2', ch: 1, n: 2, title: '바이그램: 앞 글자만 보고', mode: 'text',
  tutorSummary: "바이그램 = 바로 앞 글자 하나만 보고 다음 글자를 맞히는 가장 단순한 언어 모델. Counter(zip(text, text[1:])) 로 (앞, 다음) 짝 세기. 표로: counts = [[0] * V for _ in range(V)] 에 counts[stoi[a]][stoi[b]] += 1 — 줄 = 앞 글자, 칸 = 다음 글자(챕터 2 에서 numpy 배열이 됨). [[0] * V] * V 는 같은 줄을 V 번 가리켜서 안 됨. 확률 = row[j] / sum(row), 한 줄의 합은 1, 0 인 칸은 한 번도 안 나온 짝. 이어 쓰기: row.index(max(row)) 로 1등(욕심쟁이) — 금방 「간다. 간다.」 · 「나는 나는」 처럼 같은 말을 되풀이.",
  terms: { "바이그램": "바로 앞 토큰 하나만 보고 다음 토큰을 맞히는 가장 단순한 언어 모델. 「둘씩 묶음(bi-gram)」 이라는 뜻", "욕심쟁이": "greedy. 늘 확률이 가장 큰 1등만 고르는 방법. 맞히기에는 좋지만 글을 지으면 같은 말을 되풀이하기 쉽다" },
  pages: [
    { title: "짝 세기 · Counter(zip(text, text[1:]))", html: `<p>[[레슨:N0]] 에서는 글자 하나를 정해 놓고 그다음을 셌어요. 이번엔 <b>모든 글자를 한꺼번에</b> 세요. 글에서 붙어 있는 (앞, 다음) 두 글자 짝을 모두 세는 거예요. 이렇게 바로 앞 글자 하나만 보고 다음 글자를 맞히는 모델을 [[바이그램]]이라고 해요.</p>\n<pre>text = "비가 오면"\nprint(list(zip(text, text[1:])))   # [('비', '가'), ('가', ' '), (' ', '오'), ('오', '면')]</pre>\n<p><code>text[1:]</code> 은 한 칸 밀린 글이라 <code>zip</code> 으로 나란히 놓으면 (앞, 다음) 짝이 돼요. 짝의 수는 문제 수와 같은 <code>len(text) - 1</code> 이에요. 이걸 <code>Counter</code> 에 넣으면 짝마다 횟수가 나와요(<a href="../python/#lesson/L16C" target="_blank" rel="noopener">파이썬 교과서 「표준 라이브러리 Counter」 ↗</a>). 짧은 글에서도 「우 → 산」 「다 → .」 처럼 꼭 붙어 다니는 짝이 보여요.</p>`,
      example: { code: `from collections import Counter\n\ntext = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다."\nprint(list(zip(text, text[1:]))[:4])\npairs = Counter(zip(text, text[1:]))\nprint(len(pairs), "가지 짝")\nfor (a, b), n in pairs.most_common(5):\n    print(repr(a), "→", repr(b), n, "번")` } },
    { title: "V × V 표 · counts[i][j] += 1", html: `<p>짝 횟수를 <b>표 한 장</b>으로 놓아요. 줄 = 앞 글자, 칸 = 다음 글자, 칸 안 = 횟수예요. 글자 대신 번호(<code>stoi</code>)로 줄과 칸을 찾아요.</p>\n<pre>counts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1</pre>\n<p>예제의 짧은 글로 만든 24 × 24 표의 한 귀퉁이예요.</p>\n<table class="kb"><tbody><tr><th>앞 ↓ · 다음 →</th><th>' '</th><th>.</th><th>고</th><th>우</th></tr>\n<tr><td>'쓰'</td><td>0</td><td>0</td><td>2</td><td>0</td></tr>\n<tr><td>'다'</td><td>0</td><td>4</td><td>0</td><td>0</td></tr>\n<tr><td>'을'</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>\n<tr><td>' '</td><td>0</td><td>0</td><td>0</td><td>2</td></tr></tbody></table>\n<p>줄 하나 <code>counts[stoi["쓰"]]</code> 가 「쓰」 다음에 올 글자들의 횟수예요. 예제처럼 0 이 아닌 칸만 골라 찍으면 읽기 쉬워요. <b>이 표가 바이그램 모델의 전부</b>예요 — 챕터 2 에서는 같은 표를 numpy 배열로 만들고, 세는 대신 배워서 채워요.</p>\n<div class="bk-warn"><b><code>[[0] * V] * V</code> 는 안 돼요</b> — 같은 줄 하나를 V 번 가리키는 거라, 한 칸을 더하면 모든 줄이 같이 바뀌어요(<a href="../python/#lesson/L12C" target="_blank" rel="noopener">파이썬 교과서 「정렬과 복사」 ↗</a> 의 「복사가 아니다」). 줄마다 새 리스트를 만드는 <code>[[0] * V for _ in range(V)]</code> 로 쓰세요.</div>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\nprint(V, "×", V, "표")\nfor ch in ["쓰", "다", " "]:\n    row = counts[stoi[ch]]\n    print(repr(ch), {itos[j]: n for j, n in enumerate(row) if n > 0})` } },
    { title: "확률 = row[j] / sum(row)", html: `<p>줄 하나의 횟수를 그 줄의 합으로 나누면 [[확률]]이 돼요. 「띄어쓰기 다음에 「우」 가 올 확률」 = 「띄어쓰기 다음 「우」 횟수」 ÷ 「띄어쓰기 다음 전부」 예요.</p>\n<pre>row = [2, 1, 1]\ntotal = sum(row)\nprobs = [n / total for n in row]\nprint(probs)        # [0.5, 0.25, 0.25]\nprint(sum(probs))   # 1.0</pre>\n<p>줄마다 확률을 모두 더하면 1 이에요. 예제의 짧은 글에서 띄어쓰기 다음은 15 번, 그중 「우」 가 2 번이라 0.133 이에요. 0 인 칸은 「이 글에서는 한 번도 안 나온 짝」 이에요 — [[레슨:N4]] 에서 이게 문제가 돼요.</p>\n<p class="muted small">다음 글자가 하나도 없는 줄(글의 맨 끝에만 나온 글자)은 합이 0 이라 나눌 수 없어요. 학습 글 data.txt 에는 그런 글자가 없어요.</p>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\nrow = counts[stoi[" "]]\ntotal = sum(row)\nprobs = [n / total for n in row]\nprint(total, round(sum(probs), 3))\nfor j, p in enumerate(probs):\n    if p > 0:\n        print(repr(itos[j]), round(p, 3))` } },
    { title: "1등만 이어 쓰기 · row.index(max(row))", html: `<p>표로 글을 지어 봐요. 마지막 글자의 줄을 꺼내고, 가장 큰 칸의 번호 <code>row.index(max(row))</code> 를 글자로 바꿔 붙여요. 이걸 되풀이해요.</p>\n<pre>out = "해"\nfor _ in range(25):\n    row = counts[stoi[out[-1]]]\n    j = row.index(max(row))\n    out = out + itos[j]</pre>\n<p>예제를 돌리면 「해가 」 다음부터 「간다. 간다. 간다.」 만 되풀이해요. 띄어쓰기 다음에 올 수 있는 글자는 10 가지인데, 늘 1등(횟수가 같으면 번호가 앞인 「간」)만 고르니까요. 이렇게 늘 1등만 고르는 방법을 [[욕심쟁이]]라고 해요. 맞히기 시험에서는 1등을 말하는 게 가장 잘 맞지만, 글을 지을 때는 지루해요. [[레슨:N3]] 에서 확률대로 <b>뽑아서</b> 풀어요.</p>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\nout = "해"\nfor _ in range(25):\n    row = counts[stoi[out[-1]]]\n    j = row.index(max(row))\n    out = out + itos[j]\nprint(out)` } },
  ],
  summary: ["바이그램 = 앞 글자 하나만 보고 다음 글자 — Counter(zip(text, text[1:])) 로 짝 세기", "V × V 표 counts[i][j] 의 줄 하나를 sum(row) 로 나누면 확률(합 1)", "1등만 row.index(max(row)) 로 이어 쓰면 금방 같은 말을 되풀이"] },
{ id: 'N3', ch: 1, n: 3, title: '확률에서 뽑기 · 온도', mode: 'text',
  tutorSummary: "1등만(row.index(max(row))) 고르면 같은 줄에서 늘 같은 글자라 고리처럼 같은 말 반복. random.choices(range(V), weights=row)[0] 로 확률대로 뽑기 — 가중치는 합이 1 이 아니어도 됨(횟수 그대로), k=1000 이면 여러 개. random.seed(0) 으로 늘 같은 결과(실제 챗봇은 seed 를 고정하지 않아 대답이 매번 다름). 앞 글자 하나만 보니 「쓰고 쓰고」 같은 엉터리도 섞이지만 원래 글에 없던 새 문장이 나온다. 온도 T: w = [p ** (1 / T) ...] 를 합으로 나눔 — T < 1 날카롭게(무난 · 반복), T > 1 평평하게(다양 · 엉뚱), T → 0 은 욕심쟁이. 큰 LLM 의 temperature 설정이 이것(점수를 T 로 나누고 소프트맥스 = 같은 계산).",
  terms: { "온도": "temperature. 뽑기 전에 확률을 날카롭게(T 가 1 보다 작으면) 또는 평평하게(1 보다 크면) 바꾸는 손잡이", "seed": "무작위 수를 만드는 출발점. 같은 seed 로 시작하면 「무작위」 가 늘 같은 순서로 나온다" },
  pages: [
    { title: "max(row) 만 고르면 · 같은 말만 빙빙", html: `<p>[[레슨:N2]] 의 욕심쟁이 이어 쓰기는 어디서 시작하든 금방 같은 곳에 빠져요. 「비」 에서도, 「해」 에서도, 「모」 에서도 결국 「간다. 간다. 간다.」 예요.</p>\n<p>까닭은 <b>같은 줄에서는 늘 같은 글자</b>를 고르기 때문이에요. 한 번 왔던 글자에 다시 오면 그다음도 늘 같으니, 고리처럼 빙빙 돌아요. 학습 글 data.txt 로 해 보면 「나는 나는 나는 …」 이 돼요.</p>\n<p>하지만 표에는 더 많은 이야기가 들어 있어요. 띄어쓰기 다음 후보는 10 개나 되는데 그중 하나만 써 온 거예요. 사람도 늘 가장 흔한 말만 하지는 않죠. 그래서 LLM 은 <b>확률대로 뽑아요</b> — 흔한 글자는 자주, 드문 글자는 가끔.</p>`,
      example: { code: `text = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\ndef greedy(start, n):\n    out = start\n    for _ in range(n):\n        row = counts[stoi[out[-1]]]\n        out = out + itos[row.index(max(row))]\n    return out\n\nfor start in ["비", "해", "모"]:\n    print(greedy(start, 20))\nrow = counts[stoi[" "]]\nprint("띄어쓰기 다음 후보", sum(1 for n in row if n > 0), "개")` } },
    { title: "random.choices(…, weights=row) · seed", html: `<p><code>random.choices(후보들, weights=가중치)</code> 는 가중치에 비례해서 하나를 뽑아요. 결과는 리스트라서 <code>[0]</code> 으로 꺼내요. <code>k=10</code> 을 주면 10 개를 뽑아요.</p>\n<pre>import random\nrandom.seed(0)\nc = random.choices(["온", "와", "많"], weights=[5, 3, 2])[0]</pre>\n<p>가중치 5 · 3 · 2 는 확률 0.5 · 0.3 · 0.2 와 같은 뜻이에요 — <b>합이 1 이 아니어도</b> 알아서 비율로 봐요. 그래서 짝 세기 표의 줄(횟수)을 그대로 넣어도 돼요. <code>random.choices(range(V), weights=row)[0]</code> 은 다음 글자의 번호예요.</p>\n<p>예제에서 1000 번 뽑으면 「온」 508 · 「와」 302 · 「많」 190 번 — 거의 확률대로 나와요. 뽑은 것들을 세는 데는 <code>Counter</code> 가 편해요.</p>\n<div class="bk-warn"><b>seed 를 고정하면 늘 같은 결과</b> — <code>random.seed(0)</code> 을 먼저 부르면 「무작위」 가 매번 같은 순서로 나와요(<a href="../python/#lesson/L16" target="_blank" rel="noopener">파이썬 교과서 「모듈과 random」 ↗</a>). 이 교과서는 출력 예와 똑같이 나오게 늘 [[seed]]를 고정해요. 실제 챗봇은 seed 를 고정하지 않아서 같은 질문에도 대답이 매번 조금씩 달라요.</div>`,
      example: { code: `import random\nfrom collections import Counter\n\ncands = ["온", "와", "많"]\nweights = [5, 3, 2]\nrandom.seed(0)\nprint(random.choices(cands, weights=weights)[0])\nprint(random.choices(cands, weights=weights, k=10))\n\nrandom.seed(0)\nprint(random.choices(cands, weights=weights)[0])\n\nrandom.seed(0)\npicks = random.choices(cands, weights=weights, k=1000)\nprint(Counter(picks))` } },
    { title: "뽑아서 이어 쓰기 · weights=counts[i]", html: `<p>욕심쟁이의 <code>row.index(max(row))</code> 자리에 뽑기를 넣으면 끝이에요.</p>\n<pre>random.seed(0)\nout = "비"\nfor _ in range(60):\n    row = counts[stoi[out[-1]]]\n    j = random.choices(range(V), weights=row)[0]\n    out = out + itos[j]</pre>\n<p>예제의 짧은 글(문장 넷)로 지어 보면 「우산을 학교에 쓰고 해가 뜨면 간다.」 처럼 <b>원래 글에 없던 문장</b>이 나와요. 짝 하나하나는 글에 있던 것이지만, 이어 붙인 문장은 새것이에요. 앞 글자 하나만 보니까 「쓰고 쓰고 쓰고」 같은 엉터리도 섞여요 — 더 멀리 보는 모델은 챕터 3 · 4 에서 만들어요.</p>\n<p>seed 를 1, 2 로 바꿔 돌려 보세요. 매번 다른 글이 나와요.</p>`,
      example: { code: `import random\n\ntext = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\nrandom.seed(0)\nout = "비"\nfor _ in range(60):\n    row = counts[stoi[out[-1]]]\n    j = random.choices(range(V), weights=row)[0]\n    out = out + itos[j]\nprint(out)\nfor s in out.split(". "):\n    s = s.strip(".") + "."\n    print("원래 글에 있음" if s in text else "새 문장", s)` } },
    { title: "온도 · p ** (1 / T)", html: `<p>뽑기가 너무 엉뚱하거나 너무 뻔하면 [[온도]] T 로 조절해요. 확률마다 <code>p ** (1 / T)</code> 를 하고, 다시 합으로 나눠 합을 1 로 맞춰요.</p>\n<pre>def with_temp(row, T):\n    w = [n ** (1 / T) for n in row]\n    s = sum(w)\n    return [x / s for x in w]\n\nprint([round(x, 2) for x in with_temp([0.6, 0.3, 0.1], 0.5)])   # [0.78, 0.2, 0.02]\nprint([round(x, 2) for x in with_temp([0.6, 0.3, 0.1], 2.0)])   # [0.47, 0.33, 0.19]</pre>\n<table class="kb"><tbody><tr><th>온도</th><th>확률</th><th>지은 글</th></tr>\n<tr><td>T &lt; 1 (예 0.3)</td><td>1등이 더 커져요 — 날카롭게</td><td>무난하지만 되풀이가 늘어요. T 가 0 에 가까우면 욕심쟁이</td></tr>\n<tr><td>T = 1</td><td>그대로</td><td>표가 센 그대로</td></tr>\n<tr><td>T &gt; 1 (예 3)</td><td>꼴찌들이 커져요 — 평평하게</td><td>다양하지만 엉뚱해요</td></tr></tbody></table>\n<p>예제는 같은 확률에서 온도마다 20 번씩 뽑아 비교해요. 짝 세기 표의 줄(횟수)에 바로 써도 같은 결과예요. 큰 LLM 서비스의 「temperature」 설정이 바로 이거예요 — 속에서는 [[레슨:N5]] 의 소프트맥스 전에 점수를 T 로 나누는데, 계산해 보면 똑같아요.</p>`,
      example: { code: `import random\n\ndef with_temp(row, T):\n    w = [n ** (1 / T) for n in row]\n    s = sum(w)\n    return [x / s for x in w]\n\ncands = ["온", "와", "많"]\np = [0.6, 0.3, 0.1]\nfor T in [0.3, 1.0, 3.0]:\n    w = with_temp(p, T)\n    random.seed(0)\n    picks = random.choices(cands, weights=w, k=20)\n    print(T, [round(x, 2) for x in w], "".join(picks))` } },
  ],
  summary: ["1등만 고르면 같은 말만 빙빙 — 확률대로 뽑는다", "random.choices(range(V), weights=row)[0] · random.seed(0) 으로 늘 같게", "온도 p ** (1 / T): 낮으면 무난 · 반복, 높으면 다양 · 엉뚱"] },
{ id: 'N4', ch: 1, n: 4, title: '얼마나 잘 맞히나: 손실', mode: 'text',
  tutorSummary: "모델이 정답 글자에 준 확률 p 로 손실 -log(p): p = 1 이면 0, 작을수록 커짐(0.5 → 0.693, 0.01 → 4.605, 0 → 무한대). 확률을 곱하는 대신 log 를 더한다. 모든 문제의 평균 = 교차 엔트로피(언어 모델의 성적표, 낮을수록 좋음, 학습 = 이걸 줄이기). 퍼플렉서티 = math.exp(loss) = 「평균 몇 개 중에서 헷갈리나」, 찍기(모든 글자 같은 확률)는 손실 log(V) · 퍼플렉서티 V. 외운 글로 재면 너무 좋게 나옴 → 앞 90% 학습 · 뒤 10% 검증. 처음 보는 짝은 p = 0 → math.log(0) 은 ValueError(math domain error). 스무딩: (횟수 + α) / (합 + α · V) — +1 이 기본, α 는 검증 손실로 고른다(data.txt 에서는 0.1 이 1 · 0.01 보다 낫다). 맞힌 비율은 자신감을 못 봐서 학습에는 손실을 쓴다.",
  terms: { "손실": "loss. 모델이 얼마나 못 맞히는지를 나타낸 수. 정답에 준 확률 p 로 -log(p) 를 계산하고, 낮을수록 좋다", "교차 엔트로피": "cross entropy. 모든 문제의 손실 -log(p) 를 평균 낸 것. 언어 모델의 성적표", "퍼플렉서티": "perplexity. math.exp(손실). 모델이 평균 몇 개 중에서 헷갈리는지 — 1 이면 늘 확신, V 면 아무것도 모름", "스무딩": "smoothing. 표의 모든 칸에 작은 수 α 를 더해 확률 0 을 없애는 것. α = 1 이면 +1 스무딩" },
  pages: [
    { title: "정답에 준 확률 · -math.log(p)", html: `<p>모델이 얼마나 잘 맞히는지 숫자 하나로 재고 싶어요. 「맞혔다 / 틀렸다」 만 세면 아까워요. 정답 글자에 확률 0.9 를 준 모델과 0.4 를 준 모델은 둘 다 1 등으로 맞혔어도 자신감이 다르니까요.</p>\n<p>그래서 <b>정답 글자에 준 확률 p</b> 를 봐요. p 는 클수록 좋은데, 이걸 「작을수록 좋은 벌점」 으로 바꾼 게 [[손실]] <code>-math.log(p)</code> 예요.</p>\n<pre>import math\nprint(round(-math.log(0.9), 3))    # 0.105\nprint(round(-math.log(0.5), 3))    # 0.693\nprint(round(-math.log(0.01), 3))   # 4.605</pre>\n<table class="kb"><tbody><tr><th>정답에 준 확률 p</th><th>손실 −log p</th><th>뜻</th></tr>\n<tr><td>1</td><td>0</td><td>확신하고 맞힘 — 벌점 없음</td></tr>\n<tr><td>0.5</td><td>0.693</td><td>반반</td></tr>\n<tr><td>0.01</td><td>4.605</td><td>「거의 안 온다」 고 했는데 왔음 — 큰 벌점</td></tr>\n<tr><td>0</td><td>무한대</td><td>「절대 안 온다」 고 했는데 왔음</td></tr></tbody></table>\n<p>왜 log 일까요? 글 전체의 확률은 문제마다의 확률을 <b>곱한</b> 거예요. 곱하면 금방 0.0000… 이 되지만, log 를 하면 곱이 <b>덧셈</b>이 돼요: −log(0.5 × 0.5) = −log 0.5 − log 0.5. 그래서 문제마다 손실을 더하기만 하면 돼요(<a href="../math/#lesson/M1_log" target="_blank" rel="noopener">수학 공간 「거꾸로 묻기 — 로그」 ↗</a>).</p>`,
      example: { code: `import math\n\nfor p in [0.9, 0.5, 0.1, 0.01]:\n    print(p, round(-math.log(p), 3))\n\nprint(round(-math.log(0.5) - math.log(0.5), 3), round(-math.log(0.5 * 0.5), 3))` } },
    { title: "평균 손실 = 교차 엔트로피 · math.exp(loss)", html: `<p>모든 문제(짝)의 손실을 평균 내면 [[교차 엔트로피]]예요. 언어 모델의 성적표이고, <b>낮을수록 잘 맞혀요</b>. 챕터 2 ~ 4 에서 모델을 「학습시킨다」 는 건 바로 이 숫자를 줄이는 거예요.</p>\n<pre>losses = []\nfor a, b in zip(text, text[1:]):\n    losses.append(-math.log(prob(a, b)))\nloss = sum(losses) / len(losses)</pre>\n<p>손실은 감이 잘 안 오니 <code>math.exp(loss)</code> 로 되돌린 [[퍼플렉서티]]도 봐요. 「평균 몇 개 중에서 헷갈리나」 예요. 예제의 짧은 글은 손실 0.602 · 퍼플렉서티 1.83 — 바이그램이 「대충 두 개 중 하나」 까지 좁혀요. 아무것도 모르고 24 글자 중에 찍으면 손실 <code>math.log(24)</code> = 3.178, 퍼플렉서티 24 예요.</p>\n<div class="bk-warn"><b>외운 글로 재면 너무 좋게 나와요</b> — 예제는 표를 만든 글로 다시 쟀어요. 시험 문제를 미리 보고 치는 셈이죠. 진짜 실력은 <b>처음 보는 글</b>로 재요. 글의 앞 90% 로 표를 만들고(학습), 뒤 10% 로 손실을 재요(검증). 그러면 다음 쪽의 문제가 생겨요.</div>`,
      example: { code: `import math\n\ntext = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\ndef prob(a, b):\n    row = counts[stoi[a]]\n    return row[stoi[b]] / sum(row)\n\nprint(round(prob("우", "산"), 3), round(prob(" ", "우"), 3))\n\nlosses = []\nfor a, b in zip(text, text[1:]):\n    losses.append(-math.log(prob(a, b)))\nloss = sum(losses) / len(losses)\nprint("문제", len(losses), "개")\nprint("손실", round(loss, 3))\nprint("퍼플렉서티", round(math.exp(loss), 2))\nprint("찍기", round(math.log(V), 3), "·", V)` } },
    { title: "확률 0 → 스무딩 · (n + alpha) / (합 + alpha * V)", html: `<p>처음 보는 글에는 표에 없던 짝이 나와요. 예제의 글에는 「오 → 고」 짝이 없어서, 「비가 오고 …」 의 「고」 에 준 확률이 0 이에요. <code>math.log(0)</code> 은 계산이 안 돼요.</p>\n<pre>import math\ntry:\n    math.log(0)\nexcept ValueError as e:\n    print(e)   # math domain error</pre>\n<p>손실이 무한대라는 뜻이에요. 한 번 못 봤다고 「절대 안 온다」 고 하면 안 되죠. 그래서 모든 칸에 조금씩 더해요 — [[스무딩]]이에요.</p>\n<pre>p = (row[j] + alpha) / (sum(row) + alpha * V)</pre>\n<p>줄의 모든 칸(V 개)에 α 를 더했으니 합에는 α × V 를 더해요. 그래야 줄의 합이 여전히 1 이에요. α = 1 이 가장 흔한 「+1 스무딩」 이에요.</p>\n<table class="kb"><tbody><tr><th>α</th><th>처음 보는 짝</th><th>아는 짝</th></tr>\n<tr><td>크게 (1)</td><td>넉넉히 받아 줘요</td><td>확률을 많이 떼어 줘서 손실이 올라요</td></tr>\n<tr><td>작게 (0.01)</td><td>아주 작은 확률 → 큰 벌점</td><td>원래 표와 거의 같아요</td></tr></tbody></table>\n<p>예제의 문장은 처음 보는 짝이 하나뿐이라 α 가 작을수록 손실이 낮아요. 학습 글 data.txt 의 검증 부분은 처음 보는 짝이 많아서 α = 0.1 이 1 이나 0.01 보다 나아요(만들어 보기 2). 이렇게 <b>α 는 검증 손실로 골라요</b>. 챕터 2 의 배우는 모델은 스무딩이 따로 필요 없어요 — 소프트맥스는 늘 0 보다 큰 확률을 주거든요.</p>`,
      example: { code: `import math\n\ntext = "비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ncounts = [[0] * V for _ in range(V)]\nfor a, b in zip(text, text[1:]):\n    i, j = stoi[a], stoi[b]\n    counts[i][j] += 1\n\ntest = "비가 오고 우산을 쓴다."\n\ndef loss_of(s, alpha):\n    total = 0\n    for a, b in zip(s, s[1:]):\n        row = counts[stoi[a]]\n        p = (row[stoi[b]] + alpha) / (sum(row) + alpha * V)\n        total += -math.log(p)\n    return total / (len(s) - 1)\n\nprint(counts[stoi["오"]][stoi["고"]])\ntry:\n    print(loss_of(test, 0))\nexcept ValueError as e:\n    print("에러:", e)\nfor alpha in [1, 0.1, 0.01]:\n    print(alpha, round(loss_of(test, alpha), 3), round(loss_of(text, alpha), 3))` } },
  ],
  summary: ["손실 = 정답에 준 확률의 -log(p) — 확신하고 맞히면 0, 틀릴수록 커진다", "평균 손실 = 교차 엔트로피(낮을수록 좋음), math.exp(loss) = 퍼플렉서티", "처음 보는 짝의 확률 0 은 스무딩 (n + α) / (합 + α·V) 으로 — α 는 검증 손실로"] },
{ id: 'NB1', ch: 1, boss: true, title: '만들어 보기: 내 첫 글 생성기', mode: 'text',
  tutorSummary: "챕터 1 묶기 — data.txt 로 어휘(stoi · itos) · V × V 짝 세기 표, 온도 0.8 뽑기(random.seed(0))로 「나」 에서 100 글자 짓기, 같은 글의 손실 · 퍼플렉서티. 그다음 Bigram 클래스(alpha 스무딩 · prob · loss · generate)로 묶어 앞 90% 학습 · 뒤 10% 검증 손실을 재고, 스무딩한 표에 높은 온도를 주면 130 글자 모두에 깔린 작은 확률이 커져 아무 글자나 나오는 걸 본다. 마지막은 내 글로 바꿔 보기. 챕터 2 의 배우는 바이그램이 이 세기 모델의 손실과 비교된다.", pages: [], summary: [] },
{ id: 'N5', ch: 2, n: 5, title: 'numpy 맛보기', mode: 'text',
  tutorSummary: 'numpy 는 숫자 표(배열)를 한꺼번에 계산한다. import numpy as np, np.array(리스트) · a.shape(모양, (2, 3) = 2줄 3칸) · m[1, 2] · m[:, 0] · np.zeros((2, 3)) · np.eye(3)(대각선만 1, 줄 하나가 원-핫). 모양이 같으면 + - * / 가 칸끼리, 숫자 하나와는 모든 칸에. np.exp · np.log 도 칸마다, np.round(배열, 3) 으로 짧게. sum · max 는 전부를 하나로, axis=1 이면 줄마다 · axis=0 이면 칸마다, keepdims=True 로 (2, 1) 모양을 남겨 counts / counts.sum(axis=1, keepdims=True) 가 줄마다 합 1 인 확률 표. @ 는 행렬 곱: 벡터끼리는 내적, 행렬은 결과 칸마다 A 의 줄 · B 의 칸 내적, (2, 3) @ (3, 2) → (2, 2) 가운데가 같아야(다르면 ValueError), .T 는 전치. 소프트맥스: 점수를 exp 해서 합으로 나누면 확률(합 1). 큰 점수는 exp 가 inf → nan 이 되니 가장 큰 점수를 먼저 뺀다(결과는 같음). axis=-1 · keepdims=True 로 줄마다. np.argmax 는 가장 큰 칸 번호, float(…) 은 numpy 수를 파이썬 수로. 온도는 softmax(z / T).',
  terms: { '배열': 'numpy 의 숫자 표. np.array(…) 로 만들고, 모든 칸이 같은 종류의 숫자다', '모양': 'shape. 배열이 몇 줄 몇 칸인지. (3,) 은 숫자 3개 한 줄, (2, 3) 은 2줄 3칸', '소프트맥스': '점수 여러 개를 0 ~ 1 사이 확률로 바꾸는 식. exp 해서 합으로 나눈다. 다 더하면 1' },
  pages: [
    { title: 'np.array([1, 2, 3]) · a.shape 는 모양', html: `<p>챕터 1 에서는 확률 표를 딕셔너리로 만들었어요([[레슨:N2]]). 이제부터는 숫자가 수천 · 수만 개라서 <b>numpy</b> 를 써요. 숫자 표를 한꺼번에, 빨리 계산해 주는 라이브러리예요. 챕터 위의 「먼저 꼭」 대로 설치하고, 파일 맨 위에 <code>import numpy as np</code> 를 써요. <code>np</code> 는 모두가 쓰는 줄임 이름이에요.</p><pre>import numpy as np\n\nnums = [1, 2, 3]\nprint(nums * 2)   # [1, 2, 3, 1, 2, 3] — 리스트는 이어 붙이기\na = np.array([1, 2, 3])\nprint(a * 2)      # [2 4 6] — 배열은 칸마다 곱하기\nprint(a.shape)    # (3,)</pre><p><code>np.array(리스트)</code> 로 만든 [[배열]]은 쉼표 없이 찍혀요. <code>a.shape</code> 는 배열의 [[모양]]이에요. <code>(3,)</code> 은 「숫자 3개 한 줄」 이에요. 리스트를 넣은 리스트를 주면 줄과 칸이 있는 표가 돼요.</p><pre>m = np.array([[1, 2, 3], [4, 5, 6]])\nprint(m.shape)   # (2, 3) — 2줄 3칸\nprint(m[1])      # [4 5 6] — 1번 줄\nprint(m[1, 2])   # 6 — 1번 줄의 2번 칸\nprint(m[:, 0])   # [1 4] — 모든 줄의 0번 칸</pre><p>번호는 리스트처럼 0 부터예요. <code>m[1][2]</code> 대신 <code>m[1, 2]</code> 처럼 쉼표로 줄 · 칸을 한 번에 쓰고, <code>:</code> 는 「전부」 예요. 처음부터 만드는 표도 있어요.</p><ul><li><code>np.zeros((2, 3))</code> — 0 으로 채운 2줄 3칸. 괄호가 두 겹이에요(모양을 튜플로 줘요)</li><li><code>np.eye(3)</code> — 대각선만 1 인 3줄 3칸. 줄 하나를 꺼낸 <code>np.eye(3)[1]</code> 은 <code>[0. 1. 0.]</code> — 한 칸만 1 이에요. 다음 레슨의 「원-핫」 이에요. 번호 리스트 <code>idx = [2, 0]</code> 를 주면 <code>np.eye(3)[idx]</code> 처럼 여러 줄을 한꺼번에 꺼내요</li></ul><table class="kb"><tbody><tr><th>모양</th><th>이 교과서에서</th></tr><tr><td><code>(3,)</code></td><td>숫자 한 줄 — 벡터. 예: 글자 하나 다음에 올 글자들의 확률</td></tr><tr><td><code>(2, 3)</code></td><td>줄 × 칸 — 행렬</td></tr><tr><td><code>(130, 130)</code></td><td>학습 글의 서로 다른 글자 130개 × 130개 — 바이그램 표 한 장</td></tr></tbody></table><p class="muted small">점만 찍힌 <code>0.</code> 은 소수 <code>0.0</code> 이에요. 배열은 모든 칸이 같은 종류라서, 소수 배열은 칸마다 점이 붙어요.</p>`,
      example: { code: `import numpy as np\n\nnums = [1, 2, 3]\nprint(nums * 2)\na = np.array([1, 2, 3])\nprint(a * 2)\nprint(a.shape)\n\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(m)\nprint(m.shape)\nprint(m[1])\nprint(m[1, 2])\nprint(m[:, 0])\n\nprint(np.zeros((2, 3)))\nprint(np.eye(3))\nprint(np.eye(3)[1])\nidx = [2, 0]\nprint(np.eye(3)[idx])` } },
    { title: '칸마다 a * b · np.exp · sum(axis=1)', html: `<p>모양이 같은 배열끼리 <code>+ - * /</code> 를 하면 <b>같은 자리 칸끼리</b> 계산해요. 숫자 하나와 계산하면 모든 칸에 해요. for 문이 필요 없어요.</p><pre>import numpy as np\n\na = np.array([1.0, 2.0, 3.0])\nb = np.array([10.0, 20.0, 30.0])\nprint(a + b)   # [11. 22. 33.]\nprint(a * b)   # [10. 40. 90.]\nprint(a / 2)   # [0.5 1.  1.5]</pre><p><code>np.exp</code> · <code>np.log</code> 도 칸마다 해요. <code>np.log</code> 는 [[레슨:N4]] 의 손실 <code>-log(p)</code> 에 쓰던 그 로그예요. 소수가 길게 나오면 <code>np.round(배열, 3)</code> 으로 셋째 자리까지만 봐요.</p><pre>print(np.round(np.exp(a), 3))   # [ 2.718  7.389 20.086]\nprint(np.round(np.log(a), 3))   # [0.    0.693 1.099]</pre><p><code>sum</code> · <code>max</code> 는 그냥 쓰면 전부를 하나로 모아요. <b>줄마다</b> 모으려면 <code>axis=1</code>, 칸마다(세로로)는 <code>axis=0</code> 이에요.</p><pre>counts = np.array([[3, 1, 0], [1, 1, 2]])\nprint(counts.sum())         # 8\nprint(counts.sum(axis=1))   # [4 4] — 줄마다 합\nprint(counts.sum(axis=0))   # [4 2 2] — 칸마다 합</pre><p>이 표를 「앞 글자 2개 × 다음 글자 3개」 의 횟수 표라고 해 봐요. 확률은 횟수 / 그 줄의 합이었죠([[레슨:N2]]). <code>keepdims=True</code> 를 붙이면 합이 <code>(2,)</code> 가 아니라 <code>(2, 1)</code> 모양으로 남아서, 줄마다 <b>자기 줄의 합</b>으로 나눠져요.</p><pre>P = counts / counts.sum(axis=1, keepdims=True)\nprint(P)</pre><pre>[[0.75 0.25 0.  ]\n [0.25 0.25 0.5 ]]</pre><p>줄마다 더하면 1 — 딕셔너리로 세던 확률 표를 한 줄로 만들었어요. numpy 는 이렇게 「표 전체에 한 번에」 가 기본이에요.</p>`,
      example: { code: `import numpy as np\n\na = np.array([1.0, 2.0, 3.0])\nb = np.array([10.0, 20.0, 30.0])\nprint(a + b)\nprint(a * b)\nprint(a / 2)\nprint(np.round(np.exp(a), 3))\nprint(np.round(np.log(a), 3))\nprint(a.sum(), a.max())\n\ncounts = np.array([[3, 1, 0], [1, 1, 2]])\nprint(counts.sum())\nprint(counts.sum(axis=1))\nprint(counts.sum(axis=0))\nprint(counts.sum(axis=1, keepdims=True))\nP = counts / counts.sum(axis=1, keepdims=True)\nprint(P)\nprint(P.sum(axis=1))` } },
    { title: 'A @ B 는 행렬 곱 · 가운데 숫자가 같아야', html: `<p><code>@</code> 는 <b>행렬 곱</b>이에요. 먼저 벡터 두 개부터: 같은 자리끼리 곱해서 모두 더해요. 이것을 <b>내적</b>이라고 해요(<a href="../math/#lesson/M5_dot" target="_blank" rel="noopener">수학 공간 「내적」 ↗</a>).</p><pre>import numpy as np\n\nx = np.array([1, 2, 3])\ny = np.array([4, 5, 6])\nprint(x @ y)   # 32 — 1×4 + 2×5 + 3×6</pre><p>행렬끼리 곱하면 결과의 칸 하나하나가 <b>A 의 줄 하나 · B 의 칸(세로) 하나</b>의 내적이에요.</p><pre>A = np.array([[1, 2, 3],\n              [4, 5, 6]])   # (2, 3)\nB = np.array([[1, 0],\n              [0, 1],\n              [1, 1]])      # (3, 2)\nprint(A @ B)</pre><pre>[[ 4  5]\n [10 11]]</pre><p>왼쪽 위 4 는 A 의 0번 줄 <code>[1, 2, 3]</code> 과 B 의 0번 칸 <code>[1, 0, 1]</code> 의 내적 1 + 0 + 3 이에요. 모양 규칙은 이것 하나만 기억하면 돼요.</p><table class="kb"><tbody><tr><th>곱</th><th>결과 모양</th></tr><tr><td><code>(2, 3) @ (3, 2)</code></td><td><code>(2, 2)</code> — 가운데 3 이 같아서 되고, 바깥 둘이 남아요</td></tr><tr><td><code>(3,) @ (3, 4)</code></td><td><code>(4,)</code> — 벡터 하나에 표를 곱하면 숫자 4개</td></tr><tr><td><code>(2, 3) @ (2, 3)</code></td><td>에러 — 가운데 3 과 2 가 달라요</td></tr></tbody></table><p>가운데가 다르면 이런 에러가 나요. <code>A.T</code> 는 줄과 칸을 바꾼 표(전치)라서 <code>(2, 3)</code> 이 <code>(3, 2)</code> 가 돼요. 모양을 맞출 때 자주 써요.</p><pre>ValueError: matmul: Input operand 1 has a mismatch in its core dimension 0, …</pre><p>표의 둘째 줄이 다음 레슨에서 모델이 하는 일이에요. 글자 하나를 나타내는 숫자 줄 <code>(3,)</code> 에 가중치 표 <code>(3, 4)</code> 를 곱하면 다음 글자 4개의 <b>점수</b>가 나와요. 더 궁금하면 <a href="../math/#lesson/M5_compose" target="_blank" rel="noopener">수학 공간 「행렬 곱과 순서」 ↗</a>.</p>`,
      example: { code: `import numpy as np\n\nx = np.array([1, 2, 3])\ny = np.array([4, 5, 6])\nprint(x @ y)\n\nA = np.array([[1, 2, 3], [4, 5, 6]])\nB = np.array([[1, 0], [0, 1], [1, 1]])\nC = A @ B\nprint(C)\nprint(A.shape, "@", B.shape, "→", C.shape)\n\nv = np.array([1, 0, 2])\nprint(v @ B)\nprint(A.T.shape)\ntry:\n    A @ A\nexcept ValueError:\n    print("에러: 가운데 숫자가 달라요", A.shape, A.shape)` } },
    { title: 'softmax(z) — 점수를 확률로 · 큰 수 빼기', html: `<p>모델이 내놓는 건 다음 글자마다의 <b>점수</b>예요. 아무 수나 될 수 있어요 — 음수도, 아주 큰 수도. 이걸 확률(0 ~ 1, 다 더하면 1)로 바꾸는 식이 [[소프트맥스]]예요.</p><ol><li><code>np.exp(z)</code> — 모든 점수를 양수로. 큰 점수는 훨씬 더 커져요</li><li>그 합으로 나누기 — 다 더하면 1</li></ol><pre>import numpy as np\n\nz = np.array([2.0, 1.0, 0.1])\ne = np.exp(z)\np = e / e.sum()\nprint(np.round(p, 3))   # [0.659 0.242 0.099]</pre><p>점수 순서는 그대로고(2.0 이 1등), 차이가 확률로 바뀌었어요. 그런데 점수가 크면 문제가 생겨요. <code>np.exp(1000)</code> 은 너무 커서 <code>inf</code>(무한대)가 되고, <code>inf / inf</code> 는 <code>nan</code>(숫자가 아님)이에요.</p><pre>import numpy as np\n\nbig = np.array([1000.0, 999.0])\ne = np.exp(big)\nprint(e)             # [inf inf]\nprint(e / e.sum())   # [nan nan]</pre><p>해결은 간단해요. <b>가장 큰 점수를 모두에서 빼고</b> exp 해요. 모든 점수에서 같은 수를 빼도 확률은 똑같아요 — 위아래가 같은 비율로 줄어서 나누면 지워져요. 가장 큰 점수가 0 이 되니 exp 가 1 을 넘지 않아요. 이 교과서는 앞으로 늘 이 함수를 써요.</p><pre>def softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)</pre><p><code>axis=-1</code> 은 「마지막 축」 이에요. 2줄짜리 표를 넣으면 <b>줄마다</b> 따로 소프트맥스를 해요. 글자 여러 개의 점수를 한꺼번에 넣으면 줄마다 확률이 나와요.</p><pre>two = np.array([[2.0, 1.0, 0.1],\n                [0.0, 0.0, 0.0]])\nprint(np.round(softmax(two), 3))</pre><pre>[[0.659 0.242 0.099]\n [0.333 0.333 0.333]]</pre><ul><li>점수가 모두 같으면 확률도 모두 같아요(1/3)</li><li><code>np.argmax(p)</code> — 가장 큰 칸의 <b>번호</b>. 위 첫 줄이면 0</li><li><code>float(…)</code> — numpy 숫자 하나를 보통 파이썬 숫자로. 손실처럼 숫자 하나를 찍을 때 <code>round(float(p.sum()), 3)</code> 처럼 써요</li><li><b>온도</b> — [[레슨:N3]] 에서 횟수 n 을 <code>n ** (1/T)</code> 로 바꿔 합으로 나눴죠. 점수를 <code>z = log(n)</code> 으로 두면 그게 바로 <code>softmax(z / T)</code> 예요. T 가 1 보다 작으면 날카롭게, 크면 평평하게 — 예제 마지막 세 줄</li></ul>`,
      example: { code: `import numpy as np\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\nz = np.array([2.0, 1.0, 0.1])\np = softmax(z)\nprint(np.round(p, 3))\nprint(round(float(p.sum()), 3))\nprint("1등 칸", int(np.argmax(p)))\n\nprint(np.round(softmax(np.array([1000.0, 999.0])), 3))\n\ntwo = np.array([[2.0, 1.0, 0.1], [0.0, 0.0, 0.0]])\nprint(np.round(softmax(two), 3))\n\nfor T in [0.5, 1.0, 2.0]:\n    print("온도", T, np.round(softmax(z / T), 3))\n\nn = np.array([3.0, 1.0])\nT = 0.5\nprint("N3 방식", np.round(n ** (1 / T) / (n ** (1 / T)).sum(), 3))\nprint("softmax", np.round(softmax(np.log(n) / T), 3))` } },
  ],
  summary: ['np.array 는 숫자 표 — shape 로 몇 줄 몇 칸인지 보고, m[1, 2] 로 칸을 꺼낸다', '칸마다 계산 · sum(axis=1, keepdims=True) 는 줄마다 · @ 는 행렬 곱(가운데 숫자가 같아야)', 'softmax 는 가장 큰 점수를 빼고 exp 해서 합으로 나눈다 — 점수가 합 1 인 확률이 된다'] },
{ id: 'N6', ch: 2, n: 6, title: '임베딩: 글자를 벡터로', mode: 'text',
  tutorSummary: '글자 번호는 크기를 뜻하지 않아서 벡터로 바꾼다. 원-핫 np.eye(V)[ix] 는 번호 자리만 1. 원-핫 @ E 는 E 의 ix 번 줄과 같아서 실제로는 E[ix] 로 꺼낸다 — E(V × D) 가 임베딩 표, 처음엔 rng = np.random.default_rng(0) 의 rng.normal(size=(V, D)) 로 무작위, 학습으로 고친다. 번호 리스트 E[idx] 는 여러 줄을 한꺼번에. np.allclose 로 같은지 확인. 코사인 유사도 = a @ b / (np.linalg.norm(a) * np.linalg.norm(b)), 1 같은 방향 · 0 상관없음 · -1 반대. 학습하면 쓰임이 비슷한 글자(을 · 를 · 은 — 늘 뒤에 띄어쓰기)의 벡터가 비슷해진다. 로짓 = E[ix] @ W(D × V) — 다음 글자마다 점수, softmax 하면 확률. 무작위 E · W 는 엉뚱한 글자를 고른다(고 → 이), 정답 확률을 올리게 숫자를 고치는 것이 학습. np.argmax · np.argsort(-probs)[:3].',
  terms: { '원-핫': '글자 번호 자리만 1 이고 나머지는 0 인 벡터. 길이는 어휘 크기 V. np.eye(V)[ix]', '임베딩': '글자마다 정한 짧은 숫자 줄(벡터). 이 줄들을 모은 표 E 는 V 줄 × D 칸이고, 학습하며 고친다', '코사인 유사도': '두 벡터가 같은 방향을 보는지 재는 값. 1 이면 같은 방향, 0 이면 상관없음, -1 이면 반대', '로짓': '소프트맥스에 넣기 전의 점수. 다음 글자마다 하나씩 있고, 음수도 된다' },
  pages: [
    { title: '원-핫 @ E 는 E[ix] — 표에서 줄 꺼내기', html: `<p>모델은 글자를 그대로 계산할 수 없어요. [[레슨:N1]] 에서 글자마다 번호를 줬죠(<code>stoi</code>). 그런데 번호는 크기를 뜻하지 않아요 — 6번 글자가 2번 글자의 세 배는 아니에요. 그래서 번호를 <b>벡터</b>(숫자 줄)로 바꿔요.</p><p>가장 쉬운 방법은 [[원-핫]]이에요. 길이 V(어휘 크기)의 0 벡터에서 그 글자 번호 자리만 1. 지난 레슨의 <code>np.eye(V)[ix]</code> 예요.</p><pre>import numpy as np\n\ntext = "고양이가 밥을 먹는다"\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\nix = stoi["밥"]\nprint(V, ix)           # 10 6\nprint(np.eye(V)[ix])   # [0. 0. 0. 0. 0. 0. 1. 0. 0. 0.]</pre><p>원-핫은 길고(어휘가 130개면 130칸) 거의 다 0 이에요. 그래서 글자마다 <b>짧은 숫자 줄</b>(여기선 3칸)을 하나씩 정해 표 <code>E</code> 에 모아 둬요. 이 줄이 그 글자의 [[임베딩]]이에요. 처음엔 무작위 숫자로 채우고, 학습하면서 고쳐 가요([[레슨:N8]]).</p><pre>rng = np.random.default_rng(0)\nE = rng.normal(size=(V, 3))   # 글자 10개 × 3칸\nprint(np.round(np.eye(V)[ix] @ E, 3))   # [ 0.412  1.043 -0.129]\nprint(np.round(E[ix], 3))               # [ 0.412  1.043 -0.129]</pre><p>원-핫에 E 를 곱하면(<code>(10,) @ (10, 3)</code>) 1 이 있는 자리의 줄만 남아요 — <b>E 에서 ix 번 줄을 꺼낸 것</b>과 같아요. 그래서 실제로는 곱하지 않고 <code>E[ix]</code> 로 꺼내요. 번호 리스트를 주면 여러 줄을 한꺼번에 꺼내요.</p><pre>idx = [stoi[ch] for ch in "고양이"]\nprint(idx)            # [2, 7, 9]\nprint(E[idx].shape)   # (3, 3) — 글자 3개 × 3칸</pre><ul><li><code>rng.normal(size=(V, 3))</code> — 0 근처의 무작위 소수로 채운 표. <code>np.random.default_rng(0)</code> 처럼 seed 를 정하면 늘 같은 숫자가 나와요([[레슨:N3]] 의 <code>random.seed</code> 와 같은 뜻)</li><li><code>np.allclose(a, b)</code> — 두 배열이 (아주 작은 소수 오차를 빼고) 같은지 True · False 로. 예제에서 「원-핫 @ E」 와 「E[idx]」 가 같은지 확인해요</li></ul>`,
      example: { code: `import numpy as np\n\ntext = "고양이가 밥을 먹는다"\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\nprint(V, chars)\n\nix = stoi["밥"]\nprint(ix, np.eye(V)[ix])\n\nrng = np.random.default_rng(0)\nE = rng.normal(size=(V, 3))\nprint(E.shape)\nprint(np.round(np.eye(V)[ix] @ E, 3))\nprint(np.round(E[ix], 3))\n\nidx = [stoi[ch] for ch in "고양이"]\nprint(idx, E[idx].shape)\nprint(np.round(E[idx], 3))\nprint(np.allclose(np.eye(V)[idx] @ E, E[idx]))` } },
    { title: '비슷하면 같은 방향 · 코사인 유사도', html: `<p>벡터로 바꾸면 좋은 점이 있어요. 「비슷하다」 를 숫자로 잴 수 있어요. 두 벡터가 <b>같은 방향</b>을 보면 비슷한 거예요. 이걸 재는 게 [[코사인 유사도]] — 내적을 두 길이로 나눈 값이에요(<a href="../math/#lesson/M5_dot" target="_blank" rel="noopener">수학 공간 「내적」 ↗</a> · <a href="../math/#lesson/M5_norm" target="_blank" rel="noopener">「정규화」 ↗</a>).</p><pre>import numpy as np\n\ndef cosine(a, b):\n    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))\n\n#                 달다 둥글다 바퀴\napple = np.array([0.9, 0.8, 0.0])\npear = np.array([0.8, 0.9, 0.0])\ncar = np.array([0.0, 0.1, 0.9])\nprint(round(float(cosine(apple, pear)), 3))   # 0.993 — 거의 같은 방향\nprint(round(float(cosine(apple, car)), 3))    # 0.073 — 거의 상관없음</pre><p><code>np.linalg.norm(a)</code> 는 벡터의 길이예요(<code>[3, 4]</code> 면 5). 길이로 나누니까 크기는 빼고 <b>방향만</b> 비교해요. 값은 -1 ~ 1 이에요.</p><table class="kb"><tbody><tr><th>값</th><th>뜻</th></tr><tr><td>1</td><td>같은 방향 — 아주 비슷</td></tr><tr><td>0</td><td>직각 — 상관없음</td></tr><tr><td>-1</td><td>반대 방향</td></tr></tbody></table><p>위 벡터는 사람이 「달다 · 둥글다 · 바퀴」 로 손수 정했어요. 언어 모델의 임베딩은 칸마다 이름이 없어요. 대신 학습하면서 <b>쓰임이 비슷한 글자끼리 벡터가 비슷해져요</b>. 예를 들어 학습 글에서 「을」 「를」 「은」 뒤에는 늘 띄어쓰기가 와요. 다음 글자를 맞히는 데는 셋이 같은 일을 하니, 학습이 끝나면 셋의 줄이 같은 방향이 돼요 — 챕터 끝 만들어 보기에서 직접 재 봐요.</p>`,
      example: { code: `import numpy as np\n\ndef cosine(a, b):\n    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))\n\napple = np.array([0.9, 0.8, 0.0])\npear = np.array([0.8, 0.9, 0.0])\ncar = np.array([0.0, 0.1, 0.9])\nprint("사과 · 배    ", round(float(cosine(apple, pear)), 3))\nprint("사과 · 자동차", round(float(cosine(apple, car)), 3))\nprint("사과 · 사과  ", round(float(cosine(apple, apple)), 3))\nprint("사과 · -사과 ", round(float(cosine(apple, -apple)), 3))\nprint("[3, 4] 의 길이", round(float(np.linalg.norm(np.array([3.0, 4.0]))), 3))\nprint("길이가 달라도", round(float(cosine(apple, 10 * pear)), 3))` } },
    { title: '로짓 = E[ix] @ W → softmax → 확률', html: `<p>이제 글자 벡터로 <b>다음 글자 점수</b>를 만들어요. 가중치 표 <code>W</code>(D 줄 × V 칸)를 곱하면 — 지난 레슨의 <code>(3,) @ (3, 10)</code> — 다음 글자 V 개마다 점수가 하나씩 나와요. 이 점수를 [[로짓]]이라고 해요. 소프트맥스를 하면 확률이에요.</p><pre>x = E[stoi["고"]]               # (3,)\nW = rng.normal(size=(3, V))     # (3, 10)\nlogits = x @ W                  # (10,) — 다음 글자마다 점수\nprobs = softmax(logits)         # (10,) — 합 1</pre><table class="kb"><tbody><tr><th>무엇</th><th>모양</th></tr><tr><td>글자 번호 <code>ix</code></td><td>숫자 하나</td></tr><tr><td>임베딩 <code>E[ix]</code></td><td><code>(D,)</code> = (3,)</td></tr><tr><td>로짓 <code>E[ix] @ W</code></td><td><code>(V,)</code> = (10,)</td></tr><tr><td>확률 <code>softmax(logits)</code></td><td><code>(V,)</code>, 합 1</td></tr></tbody></table><p>예제를 실행하면 <code>고 → 이 0.401</code> — 「고」 다음 글자로 「이」 에 가장 큰 확률을 줘요. 이 글에서 「고」 다음은 「양」 인데요. E 와 W 가 아직 무작위라서 엉뚱한 거예요. <b>E 와 W 의 숫자를 고쳐서 「양」 의 확률을 올리는 것</b> — 그게 학습이에요. 얼마나 틀렸는지는 손실 <code>-np.log(p)</code>([[레슨:N4]])로 재고, 다음 레슨에서 손실을 줄이는 방법(경사하강)을 배워요.</p><ul><li><code>np.argmax(probs)</code> — 확률이 가장 큰 칸 번호. <code>itos</code> 로 글자로 되돌려요</li><li><code>np.argsort(-probs)[:3]</code> — 확률이 큰 순서대로 칸 번호 3개. argsort 는 작은 순서라서 <code>-</code> 를 붙여 뒤집어요</li><li>글자 여러 개를 한꺼번에: <code>E[idx] @ W</code> 는 <code>(3, 3) @ (3, 10)</code> → <code>(3, 10)</code>, 줄마다 한 글자의 로짓</li></ul>`,
      example: { code: `import numpy as np\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ntext = "고양이가 밥을 먹는다"\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\n\nrng = np.random.default_rng(0)\nE = rng.normal(size=(V, 3))\nW = rng.normal(size=(3, V))\n\nx = E[stoi["고"]]\nlogits = x @ W\nprobs = softmax(logits)\nprint(x.shape, W.shape, logits.shape)\nprint(np.round(logits, 2))\nprint(np.round(probs, 3))\nbest = int(np.argmax(probs))\nprint("고 →", itos[best], round(float(probs[best]), 3))\nfor i in np.argsort(-probs)[:3]:\n    print("  ", itos[int(i)], round(float(probs[i]), 3))\np = probs[stoi["양"]]\nprint("정답 양:", round(float(p), 3), "손실", round(float(-np.log(p)), 3))\n\nidx = [stoi[ch] for ch in "고양이"]\nprint((E[idx] @ W).shape)` } },
  ],
  summary: ['글자 번호 → 원-핫, 원-핫 @ E 는 E[ix] — 임베딩 표에서 줄을 꺼낸다', '코사인 유사도로 두 벡터가 같은 방향인지 잰다 — 학습하면 쓰임이 비슷한 글자가 비슷해진다', 'E[ix] @ W 가 다음 글자 점수(로짓), softmax 하면 확률 — 정답 확률을 올리는 게 학습'] },
{ id: 'N7', ch: 2, n: 7, title: '학습 = 손실 줄이기: 경사하강', mode: 'text',
  tutorSummary: '학습 = 손실을 줄이는 숫자 찾기. 숫자 하나 w, 손실 f(w) = (w - 3) ** 2 로 연습. 기울기는 w 를 h 만큼 올리고 내려 본 손실 차이 / 2h — slope(f, w) = (f(w + h) - f(w - h)) / (2 * h). 부호는 방향(음수면 w 를 키우기), 크기는 가파름, 바닥에서 0. 경사하강: w = w - lr * grad 를 되풀이, 바닥 근처에선 걸음이 저절로 작아짐. 학습률 lr: 0.01 은 느림, 0.1 알맞음, 0.9 지그재그, 1.1 은 점점 멀리 튐 — 손실이 커지거나 nan 이면 lr 을 10배 줄인다, 알맞은 lr 은 문제마다 다름. 여러 변수는 하나씩 조금 바꿔 재는 num_grad(f, w)(np.zeros_like), 직선 y = a·x + b 맞추기로 손실 표. 변수마다 손실을 두 번씩 계산해서 느리니, 큰 모델은 기울기를 식으로 구하고 수치 기울기는 검사에만 쓴다.',
  terms: { '기울기': 'w 를 아주 조금 바꿨을 때 손실이 얼마나 바뀌나. 음수면 w 를 키울 때 손실이 줄고, 양수면 w 를 줄일 때 손실이 준다', '학습률': 'lr(learning rate). 기울기 반대로 한 번에 얼마나 움직일지 정하는 수. 너무 크면 튀고 너무 작으면 느리다', '경사하강': 'w = w - lr * 기울기 를 되풀이해 손실을 줄이는 방법. 비탈(경사)을 따라 내려간다(하강)' },
  pages: [
    { title: 'slope(f, w) — 조금 바꿔 보고 재는 기울기', html: `<p>학습은 「손실을 줄이는 숫자 찾기」 예요. 지난 레슨의 E · W 에는 숫자가 많으니, 먼저 숫자 <b>하나</b>로 연습해요. 손실이 <code>f(w) = (w - 3) ** 2</code> 라고 해 봐요. w = 3 이면 손실 0 — 정답이에요. 하지만 컴퓨터는 답을 몰라요. 할 수 있는 건 「w 를 조금 바꾸면 손실이 어떻게 되나」 재 보기예요.</p><pre>def f(w):\n    return (w - 3) ** 2\n\ndef slope(f, w, h=0.0001):\n    return (f(w + h) - f(w - h)) / (2 * h)\n\nprint(round(slope(f, 0), 3))   # -6.0\nprint(round(slope(f, 5), 3))   # 4.0</pre><p>w 를 h 만큼 올린 손실과 내린 손실의 차이를, 움직인 거리 2h 로 나눴어요. 이게 [[기울기]] — 그래프에서 그 자리의 비탈이에요(<a href="../math/#lesson/M4_tangent" target="_blank" rel="noopener">수학 공간 「미분 = 접선의 기울기」 ↗</a>). 함수 <code>slope</code> 는 f 를 인자로 받아서, 어떤 손실 함수에도 쓸 수 있어요.</p><table class="kb"><tbody><tr><th>w</th><th>손실 f(w)</th><th>기울기</th><th>뜻</th></tr><tr><td>0</td><td>9</td><td>-6</td><td>w 를 키우면 손실이 줄어요</td></tr><tr><td>1</td><td>4</td><td>-4</td><td>아직 키워야 해요. 비탈이 완만해졌어요</td></tr><tr><td>3</td><td>0</td><td>0</td><td>바닥 — 더 갈 곳이 없어요</td></tr><tr><td>5</td><td>4</td><td>4</td><td>w 를 줄여야 손실이 줄어요</td></tr></tbody></table><p>기울기의 <b>부호</b>는 방향, <b>크기</b>는 비탈이 얼마나 가파른지예요. 바닥에서 멀수록 가팔라요.</p>`,
      example: { code: `def f(w):\n    return (w - 3) ** 2\n\ndef slope(f, w, h=0.0001):\n    return (f(w + h) - f(w - h)) / (2 * h)\n\nprint("w  손실  기울기")\nfor w in [0, 1, 3, 5]:\n    print(w, f(w), round(slope(f, w), 3))` } },
    { title: 'w = w - lr * grad — 기울기 반대로 조금씩', html: `<p>기울기가 음수면 w 를 키우고, 양수면 줄이면 돼요. 한 줄로 쓰면 <b>기울기의 반대 방향으로 조금</b> 움직이기예요.</p><pre>w = w - lr * grad</pre><p><code>lr</code> 은 [[학습률]](learning rate) — 한 번에 얼마나 움직일지예요. 이걸 되풀이하는 게 [[경사하강]]이에요. 비탈(경사)을 따라 내려가요(하강).</p><pre>w = 0.0\nlr = 0.1\nfor step in range(21):\n    if step % 5 == 0:\n        print(step, round(w, 3), round(f(w), 3))\n    grad = slope(f, w)\n    w = w - lr * grad</pre><pre>0 0.0 9.0\n5 2.017 0.966\n10 2.678 0.104\n15 2.894 0.011\n20 2.965 0.001</pre><p>손실이 9 → 0.966 → 0.104 → … 로 줄고 w 는 3 에 다가가요. 정답 3 을 한 번도 알려 주지 않았는데요! 바닥에 가까울수록 기울기가 작아져서 걸음도 저절로 작아져요.</p><p>이게 학습의 전부예요. LLM 은 w 가 하나가 아니라 수십억 개이고, f 가 「다음 글자를 얼마나 못 맞히나(손실)」 일 뿐이에요.</p>`,
      example: { code: `def f(w):\n    return (w - 3) ** 2\n\ndef slope(f, w, h=0.0001):\n    return (f(w + h) - f(w - h)) / (2 * h)\n\nw = 0.0\nlr = 0.1\nprint("걸음 w 손실")\nfor step in range(21):\n    if step % 5 == 0:\n        print(step, round(w, 3), round(f(w), 3))\n    grad = slope(f, w)\n    w = w - lr * grad` } },
    { title: '학습률 lr 비교 · 크면 튀고 작으면 느려요', html: `<p>lr 만 바꿔서 20걸음씩 가 봐요. 모두 w = 0 에서 시작해요.</p><pre>for lr in [0.01, 0.1, 0.9, 1.1]:\n    w = 0.0\n    for step in range(20):\n        w = w - lr * slope(f, w)\n    print(lr, round(w, 3), round(f(w), 3))</pre><table class="kb"><tbody><tr><th>lr</th><th>20걸음 뒤 w</th><th>손실</th><th>모습</th></tr><tr><td>0.01</td><td>0.997</td><td>4.011</td><td>너무 작아요 — 아직 한참 멀어요</td></tr><tr><td>0.1</td><td>2.965</td><td>0.001</td><td>알맞아요</td></tr><tr><td>0.9</td><td>2.965</td><td>0.001</td><td>바닥을 건너뛰며 지그재그로 도착: 5.4 → 1.08 → 4.536 → …</td></tr><tr><td>1.1</td><td>-112.013</td><td>13227.944</td><td>너무 커요 — 바닥을 넘을 때마다 더 멀리 튀어요</td></tr></tbody></table><div class="bk-warn"><b>학습이 안 되면 학습률부터</b> — 손실이 줄지 않고 점점 커지거나 <code>nan</code> 이 되면 lr 이 너무 커요. <b>10배 줄여서</b> 다시 해 보세요. 반대로 손실이 너무 천천히 줄면 lr 을 키워 봐요.</div><p>알맞은 lr 은 문제마다 달라요. 이 문제는 0.1 이 좋지만, 다음 레슨의 바이그램은 10 ~ 50 이 좋아요. 그래서 몇 개 해 보고 손실 표를 보며 골라요.</p>`,
      example: { code: `def f(w):\n    return (w - 3) ** 2\n\ndef slope(f, w, h=0.0001):\n    return (f(w + h) - f(w - h)) / (2 * h)\n\nprint("lr   w   손실")\nfor lr in [0.01, 0.1, 0.9, 1.1]:\n    w = 0.0\n    for step in range(20):\n        w = w - lr * slope(f, w)\n    print(lr, round(w, 3), round(f(w), 3))\n\nprint("lr 0.9 의 첫 다섯 걸음")\nw = 0.0\nfor step in range(5):\n    w = w - 0.9 * slope(f, w)\n    print(round(w, 3))` } },
    { title: '여러 변수 num_grad(f, w) · 손실 표', html: `<p>변수가 여러 개면 <b>하나씩</b> 조금 바꿔 보고 각각의 기울기를 재요. 나머지는 그대로 두고요. 결과는 변수마다 하나씩, w 와 모양이 같은 배열이에요.</p><pre>def num_grad(f, w, h=0.0001):\n    g = np.zeros_like(w)\n    for i in range(len(w)):\n        old = w[i]\n        w[i] = old + h\n        up = f(w)\n        w[i] = old - h\n        down = f(w)\n        w[i] = old\n        g[i] = (up - down) / (2 * h)\n    return g</pre><p><code>np.zeros_like(w)</code> 는 w 와 같은 모양의 0 배열이에요. 연습으로 점 4개 (1, 3) · (2, 5) · (3, 7) · (4, 9) 를 지나는 직선 <code>y = a·x + b</code> 를 찾아봐요. w = [a, b] 이고, 손실은 「예측 - 정답」 제곱의 평균이에요.</p><pre>xs = np.array([1.0, 2.0, 3.0, 4.0])\nys = np.array([3.0, 5.0, 7.0, 9.0])\n\ndef loss(w):\n    pred = w[0] * xs + w[1]\n    return ((pred - ys) ** 2).mean()\n\nw = np.array([0.0, 0.0])\nfor step in range(501):\n    if step % 100 == 0:\n        print(step, np.round(w, 3), round(float(loss(w)), 4))\n    w = w - 0.05 * num_grad(loss, w)</pre><pre>0 [0. 0.] 41.0\n100 [2.022 0.937] 0.0007\n200 [2.005 0.986] 0.0\n…\n500 [2. 1.] 0.0</pre><p>a = 2, b = 1 — 정답 <code>y = 2x + 1</code> 을 찾았어요. 코드는 변수 하나일 때와 똑같이 <code>w = w - lr * 기울기</code> 예요.</p><p>그런데 이 방법은 변수 하나마다 손실을 두 번씩 계산해요. 바이그램 W 는 130 × 130 = 16,900 칸이라 한 걸음에 손실을 33,800 번 — 너무 느려요. 그래서 다음 레슨에서는 기울기를 <b>식으로 한 번에</b> 구하고, 수치 기울기는 「식이 맞는지 검사」 에만 써요.</p>`,
      example: { code: `import numpy as np\n\ndef num_grad(f, w, h=0.0001):\n    g = np.zeros_like(w)\n    for i in range(len(w)):\n        old = w[i]\n        w[i] = old + h\n        up = f(w)\n        w[i] = old - h\n        down = f(w)\n        w[i] = old\n        g[i] = (up - down) / (2 * h)\n    return g\n\nxs = np.array([1.0, 2.0, 3.0, 4.0])\nys = np.array([3.0, 5.0, 7.0, 9.0])\n\ndef loss(w):\n    pred = w[0] * xs + w[1]\n    return ((pred - ys) ** 2).mean()\n\nw = np.array([0.0, 0.0])\nprint("처음 기울기", np.round(num_grad(loss, w), 3))\nprint("걸음 [a, b] 손실")\nfor step in range(501):\n    if step % 100 == 0:\n        print(step, np.round(w, 3), round(float(loss(w)), 4))\n    w = w - 0.05 * num_grad(loss, w)` } },
  ],
  summary: ['기울기 = w 를 조금 바꿨을 때 손실이 얼마나 바뀌나 — (f(w + h) - f(w - h)) / (2 * h)', '경사하강 w = w - lr * 기울기 를 되풀이하면 손실이 줄어든다', '학습률이 너무 크면 튀고(nan) 너무 작으면 느리다 — 손실 표를 보고 10배씩 고른다'] },
{ id: 'N8', ch: 2, n: 8, title: '신경망 바이그램을 학습시키기', mode: 'text',
  tutorSummary: '세던 바이그램을 학습으로. 모델은 가중치 표 W(V × V) 한 장, W[x] 는 앞 글자 x 다음 글자마다의 로짓(임베딩 표와 가중치를 합친 셈). xs = data[:-1], ys = data[1:] 로 짝을 나란히. probs = softmax(W[xs]) (N × V), probs[np.arange(N), ys] 는 줄마다 정답 칸, 손실 = -np.log(…).mean(). W 가 0 이면 손실 = log V. 기울기 한 줄 유도: -log softmax(z)[y] = -z[y] + log Σ exp(z), 미분하면 p[j] - (j 가 정답이면 1) → dz = probs - onehot, 정답 점수는 올리고 나머지는 준 확률만큼 내린다. 평균이라 ÷ N, dW = X.T @ dlogits(X = np.eye(V)[xs], 같은 앞 글자 줄끼리 모아 더함). 수치 기울기와 같은지 기울기 검사. W -= lr * dW 를 되풀이(lr 10 ~ 50)하면 손실이 세기 모델 손실(이 글에서 가장 낮은 바이그램 손실)로 다가가고, softmax(W[x]) 가 세기 확률 표와 거의 같아진다. 세기는 앞 글자 하나에서 끝나지만 학습 고리는 그대로 두고 가운데만 바꿔 문맥 MLP · 트랜스포머로 커진다.',
  terms: { '가중치': '모델 안에서 학습이 고치는 숫자들. 신경망 바이그램에서는 표 W 한 장(V × V)', '기울기 검사': '식으로 구한 기울기가 수치 기울기와 같은지 몇 칸 골라 비교하는 것. 손으로 기울기 식을 쓸 때 꼭 한다', '세기 모델': '챕터 1 의 바이그램 — 짝을 세서 횟수 / 합으로 만든 확률 표' },
  pages: [
    { title: 'W[xs] → softmax → 손실 · W 한 장이 모델', html: `<p>챕터 1 의 바이그램은 짝을 <b>세서</b> 확률 표를 만들었어요([[레슨:N2]]). 이번엔 같은 일을 <b>학습</b>으로 해요. 모델은 [[가중치]] 표 <code>W</code> 한 장(V 줄 × V 칸)이에요. <code>W[x]</code> 는 「앞 글자가 x 일 때 다음 글자마다의 점수(로짓)」 줄이에요. 지난 레슨의 <code>E[ix] @ W</code> 에서 임베딩 표와 가중치 표를 하나로 합친 셈이에요.</p><p>먼저 글을 번호로 바꾸고([[레슨:N1]] 의 <code>stoi</code>), 짝을 두 배열로 나란히 둬요. <code>xs[i]</code> 다음에 <code>ys[i]</code> 가 와요.</p><pre>text = "나는 밥을 먹는다. 너는 물을 마신다. 나는 책을 읽는다."\ndata = [stoi[ch] for ch in text]\nxs = np.array(data[:-1])   # 앞 글자들\nys = np.array(data[1:])    # 그다음 글자들 — 정답\nN = len(xs)                # 짝 31개, 어휘 V = 14</pre><p>이제 짝 N 개를 한꺼번에 계산해요.</p><pre>W = np.zeros((V, V))\nprobs = softmax(W[xs])              # (N, V) — 짝마다 다음 글자 확률\np_right = probs[np.arange(N), ys]   # 짝마다 정답 글자의 확률\nloss = -np.log(p_right).mean()\nprint(round(float(loss), 3))        # 2.639</pre><ul><li><code>W[xs]</code> — 번호 리스트로 줄 꺼내기([[레슨:N6]]). 짝 N 개의 점수 줄이 한꺼번에 <code>(N, V)</code></li><li><code>probs[np.arange(N), ys]</code> — 0번 줄의 <code>ys[0]</code> 칸, 1번 줄의 <code>ys[1]</code> 칸, … 처럼 줄마다 정답 칸을 하나씩. <code>np.arange(N)</code> 은 <code>[0, 1, …, N-1]</code></li><li><code>-np.log(…).mean()</code> — [[레슨:N4]] 의 교차 엔트로피 손실</li></ul><p>W 가 전부 0 이면 점수가 모두 같아서 확률도 모두 1/V 예요. 손실은 <code>log(V)</code> = log 14 ≈ 2.639 — 「아무것도 모르는 모델」 의 손실이에요. 이제 이 손실을 경사하강으로 줄여요.</p>`,
      example: { code: `import numpy as np\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ntext = "나는 밥을 먹는다. 너는 물을 마신다. 나는 책을 읽는다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\n\ndata = [stoi[ch] for ch in text]\nxs = np.array(data[:-1])\nys = np.array(data[1:])\nN = len(xs)\nprint("어휘", V, "짝", N)\nprint("첫 짝", itos[int(xs[0])], "→", itos[int(ys[0])])\n\nW = np.zeros((V, V))\nprobs = softmax(W[xs])\nprint(W[xs].shape, probs.shape)\np_right = probs[np.arange(N), ys]\nprint(np.round(p_right[:3], 3))\nloss = -np.log(p_right).mean()\nprint("손실", round(float(loss), 3))\nprint("log V", round(float(np.log(V)), 3))` } },
    { title: '기울기 probs - onehot · 수치로 검사', html: `<p>W 칸마다 수치 기울기를 재면 너무 느려요([[레슨:N7]]). 다행히 소프트맥스 + 교차 엔트로피는 기울기가 아주 간단해요.</p><p><b>한 줄 유도</b> — 점수 z, 정답 y 일 때 손실은 <code>-log(exp(z[y]) / Σ exp(z))</code> = <code>-z[y] + log(Σ exp(z))</code> 예요. z[j] 로 미분하면 뒤쪽 <code>log(Σ exp(z))</code> 에서 <code>exp(z[j]) / Σ exp(z)</code> = p[j] — 소프트맥스 그 자체가 나오고, 앞쪽 <code>-z[y]</code> 에서 j 가 정답일 때만 -1 이 나와요. 합치면:</p><pre>dz = probs - onehot</pre><p>뜻도 쉬워요. 정답 칸은 <code>p - 1</code>(음수) → 경사하강이 그 점수를 <b>올려요</b>. 나머지 칸은 <code>p</code>(양수) → 그 글자에 준 확률만큼 <b>내려요</b>. 정답에 이미 확률 1 을 줬다면 기울기는 0 — 고칠 게 없어요. 정말 맞는지 [[레슨:N7]] 의 수치 기울기와 나란히 찍어 봐요.</p><pre>z = np.array([2.0, 1.0, 0.1])\ny = 0\nprint(np.round(softmax(z) - np.eye(3)[y], 3))   # [-0.341  0.242  0.099]\n# 수치 기울기도                                   [-0.341  0.242  0.099]</pre><p>짝이 N 개면 손실이 평균이라 <code>/ N</code> 을 해요. 그리고 W 의 기울기는 <b>같은 앞 글자의 줄끼리 모아 더해요</b>. 원-핫 표 <code>X = np.eye(V)[xs]</code>(N × V)의 전치를 곱하면 한 번에 돼요.</p><pre>dlogits = probs.copy()\ndlogits[np.arange(N), ys] -= 1   # probs - onehot\ndlogits /= N\nX = np.eye(V)[xs]\ndW = X.T @ dlogits               # (V, N) @ (N, V) → (V, V)</pre><p><code>probs.copy()</code> 는 probs 를 그대로 두고 복사본을 고치려고 써요. 예제는 무작위 W 에서 몇 칸을 골라 이 dW 와 수치 기울기를 나란히 찍어요. 둘이 소수 다섯째 자리까지 같아요 — 이렇게 식을 수치로 확인하는 게 [[기울기 검사]]예요. 손으로 기울기 식을 쓸 때는 꼭 해요(챕터 4).</p>`,
      example: { code: `import numpy as np\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\nz = np.array([2.0, 1.0, 0.1])\ny = 0\nprint("식  ", np.round(softmax(z) - np.eye(3)[y], 3))\n\ndef loss_of(z):\n    return -np.log(softmax(z)[y])\n\nh = 0.0001\nnum = np.zeros(3)\nfor j in range(3):\n    zp = z.copy()\n    zp[j] += h\n    zm = z.copy()\n    zm[j] -= h\n    num[j] = (loss_of(zp) - loss_of(zm)) / (2 * h)\nprint("수치", np.round(num, 3))\n\ntext = "나는 밥을 먹는다. 너는 물을 마신다. 나는 책을 읽는다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nxs = np.array(data[:-1])\nys = np.array(data[1:])\nN = len(xs)\n\ndef full_loss(W):\n    probs = softmax(W[xs])\n    return -np.log(probs[np.arange(N), ys]).mean()\n\nrng = np.random.default_rng(0)\nW = rng.normal(size=(V, V))\nprobs = softmax(W[xs])\ndlogits = probs.copy()\ndlogits[np.arange(N), ys] -= 1\ndlogits /= N\nX = np.eye(V)[xs]\ndW = X.T @ dlogits\nprint("dW", dW.shape)\nfor a, b in [("나", "는"), ("나", "밥"), ("는", "다")]:\n    i, j = stoi[a], stoi[b]\n    Wp = W.copy()\n    Wp[i, j] += h\n    Wm = W.copy()\n    Wm[i, j] -= h\n    num = (full_loss(Wp) - full_loss(Wm)) / (2 * h)\n    print(a, "→", b, "식", f"{dW[i, j]:.5f}", "수치", f"{num:.5f}")` } },
    { title: 'W -= lr * dW 되풀이 · 세기 모델로 다가가요', html: `<p>이제 [[레슨:N7]] 의 경사하강 고리 그대로예요 — 확률 → 손실 → 기울기 → <code>W -= lr * dW</code> → 되풀이.</p><pre>W = np.zeros((V, V))\nlr = 10\nfor step in range(201):\n    probs = softmax(W[xs])\n    loss = -np.log(probs[np.arange(N), ys]).mean()\n    if step % 40 == 0:\n        print(step, round(float(loss), 3))\n    dlogits = probs.copy()\n    dlogits[np.arange(N), ys] -= 1\n    dlogits /= N\n    W -= lr * (X.T @ dlogits)</pre><table class="kb"><tbody><tr><th>걸음</th><th>손실</th></tr><tr><td>0</td><td>2.639</td></tr><tr><td>40</td><td>0.695</td></tr><tr><td>80</td><td>0.668</td></tr><tr><td>120</td><td>0.66</td></tr><tr><td>160</td><td>0.656</td></tr><tr><td>200</td><td>0.654</td></tr><tr><td><b>세기 모델</b></td><td><b>0.645</b></td></tr></tbody></table><p>[[세기 모델]](짝을 세서 나눈 확률 표, 스무딩 없이)의 손실도 같은 글로 재면 0.645 예요. 학습한 손실이 그쪽으로 다가가요. 스무딩 없는 세기 모델은 <b>그 글에서 손실이 가장 낮은 바이그램</b>이에요 — 「횟수 / 합」 이 바로 그 답이라는 게 알려져 있어요. 그래서 학습은 그 밑으로는 못 내려가고, 오래 할수록 가까워져요.</p><p>그런데 「배운 글에서 잘 맞히기」 만으로는 부족해요. 챕터 끝 만들어 보기에서는 글을 학습 90% · 검증 10% 로 나눠, 처음 보는 글에서 챕터 1 의 스무딩한 세기 모델과 겨뤄 봐요.</p><div class="bk-warn"><b>lr 이 10?</b> — [[레슨:N7]] 의 0.1 보다 훨씬 크죠. 여기서는 기울기를 N 으로 나눠서 칸마다 받는 몫이 작아서 큰 lr 이 알맞아요. 알맞은 값은 문제마다 달라요. 손실이 튀거나 <code>nan</code> 이면 10배 줄여요.</div>`,
      example: { code: `import numpy as np\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ntext = "나는 밥을 먹는다. 너는 물을 마신다. 나는 책을 읽는다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nxs = np.array(data[:-1])\nys = np.array(data[1:])\nN = len(xs)\nX = np.eye(V)[xs]\n\ncounts = np.zeros((V, V))\nfor a, b in zip(xs, ys):\n    counts[a, b] += 1\nP = counts / counts.sum(axis=1, keepdims=True)\ncount_loss = -np.log(P[xs, ys]).mean()\n\nW = np.zeros((V, V))\nlr = 10\nprint("걸음 손실")\nfor step in range(201):\n    probs = softmax(W[xs])\n    loss = -np.log(probs[np.arange(N), ys]).mean()\n    if step % 40 == 0:\n        print(step, round(float(loss), 3))\n    dlogits = probs.copy()\n    dlogits[np.arange(N), ys] -= 1\n    dlogits /= N\n    W -= lr * (X.T @ dlogits)\nprint("세기 모델", round(float(count_loss), 3))` } },
    { title: 'softmax(W[x]) ≈ 세기 표 — 그럼 왜 학습?', html: `<p>학습한 W 에서 「는」 줄을 소프트맥스하면, 세서 만든 확률 표의 「는」 줄과 거의 같아요. 이 글에서 「는」 다음은 띄어쓰기가 3번, 「다」 가 2번이에요.</p><table class="kb"><tbody><tr><th>「는」 다음</th><th>세기</th><th>학습 200걸음</th></tr><tr><td>띄어쓰기</td><td>0.6</td><td>0.597</td></tr><tr><td>다</td><td>0.4</td><td>0.397</td></tr><tr><td>책(「는」 뒤에 한 번도 안 나옴)</td><td>0</td><td>0.00045</td></tr></tbody></table><p>학습한 W 로도 챕터 1 처럼 글을 지을 수 있어요. 앞 글자의 줄 <code>softmax(W[ix])</code> 가 다음 글자 확률이니, <code>random.choices(range(V), weights=p)[0]</code>([[레슨:N3]])로 뽑아 이어 붙이면 돼요 — 예제의 마지막 줄.</p><p>세기는 한 번도 안 나온 글자에 0 을 주고, 학습은 아주 작은 확률을 남겨요. 그래서 [[레슨:N4]] 의 스무딩을 따로 안 해도 손실이 무한대가 되지 않아요.</p><p>그럼 왜 굳이 학습을 할까요? 세기는 <b>앞 글자 하나</b>일 때만 잘 돼요. 앞 3글자를 보려면 짝이 130 × 130 × 130 = 2,197,000 가지 — 대부분 한 번도 안 나와서 셀 수가 없어요. 학습은 다르게 커져요.</p><pre>앞 글자 → 벡터 → 가중치 곱 → softmax → 손실\n                         ↑\n      W -= lr * dW  ←  기울기(probs - onehot 에서 시작)</pre><p>이 고리는 그대로 두고 <b>가운데만</b> 더 똑똑하게 바꾸면 돼요 — 앞 글자 여러 개를 이어 붙이고(문맥 MLP), 어디를 볼지 고르고(어텐션). 챕터 3 · 4 가 그 길이에요. ChatGPT 도 이 고리를 아주 크게 돌린 거예요.</p>`,
      example: { code: `import numpy as np\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ntext = "나는 밥을 먹는다. 너는 물을 마신다. 나는 책을 읽는다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nxs = np.array(data[:-1])\nys = np.array(data[1:])\nN = len(xs)\nX = np.eye(V)[xs]\n\ncounts = np.zeros((V, V))\nfor a, b in zip(xs, ys):\n    counts[a, b] += 1\nP = counts / counts.sum(axis=1, keepdims=True)\n\nW = np.zeros((V, V))\nfor step in range(200):\n    probs = softmax(W[xs])\n    dlogits = probs.copy()\n    dlogits[np.arange(N), ys] -= 1\n    dlogits /= N\n    W -= 10 * (X.T @ dlogits)\n\nrow = stoi["는"]\ncols = [stoi[" "], stoi["다"]]\nprint("는 다음 [띄어쓰기, 다]")\nprint("세기", np.round(P[row][cols], 3))\nprint("학습", np.round(softmax(W[row])[cols], 3))\nbook = stoi["책"]\nprint("는 다음 책 — 세기", P[row, book], "· 학습", f"{softmax(W[row])[book]:.5f}")\nfor ch in "나밥먹":\n    ix = stoi[ch]\n    print(ch, "다음 1등 — 세기", itos[int(np.argmax(P[ix]))], "· 학습", itos[int(np.argmax(W[ix]))])\n\nimport random\nrandom.seed(0)\nix = stoi["나"]\nout = "나"\nfor _ in range(20):\n    p = softmax(W[ix])\n    ix = random.choices(range(V), weights=p)[0]\n    out += itos[ix]\nprint("뽑아 쓰기:", out)` } },
  ],
  summary: ['모델은 W 한 장 — W[xs] → softmax → 정답 확률의 -log 평균이 손실', '기울기는 probs - onehot(÷ N), dW = X.T @ dlogits — 수치 기울기로 검사한다', '경사하강을 되풀이하면 손실이 세기 모델 손실에 다가간다 — 이 고리가 큰 모델까지 그대로'] },
{ id: 'NB2', ch: 2, boss: true, title: '만들어 보기: 학습하는 바이그램', mode: 'text',
  tutorSummary: '챕터 2 묶기 — data.txt 를 앞 90% 학습 · 뒤 10% 검증으로 나누고, 학습 부분으로 W(V × V)를 경사하강으로 학습(W 는 0 에서, lr 50, 300걸음). 50걸음마다 학습 · 검증 손실 표 — 학습 손실은 계속 줄지만 검증 손실은 50걸음쯤(3.318)이 가장 낮고 다시 올라간다(외우기). 챕터 1 의 세기 모델(스무딩 α = 0.1: 학습 2.166 · 검증 3.492)과 비교 — 검증은 학습한 모델이 조금 낫다. 학습한 W 로 글 짓기(1등만은 「나는 공원에 공원에」 되풀이 · random.seed(0) 뽑기), 스무딩 없는 세기 표와 다음 글자 상위 3개 나란히 · 을 · 를 · 은 줄의 코사인 유사도 1, 학습률 1 · 10 · 50 비교.', pages: [], summary: [] },
{ id: 'N9', ch: 3, n: 9, title: '앞 글자 여러 개 보기: 문맥', mode: 'text',
  tutorSummary: '바이그램은 바로 앞 한 글자만 봐서 「고」 다음이 프 · 양 · 빈칸 중 무엇인지 못 고른다 — 앞 3글자 「가 고」 를 보면 「프」 로 확실. 세기 표로 앞 3글자를 하면 어휘³ 칸이라 너무 크고 대부분 0 → 신경망으로. 문맥 창: for i in range(len(ids) - 3): X.append(ids[i:i + 3]) · Y.append(ids[i + 3]) — 글자 L개면 문제 L-3개, 맨 앞 3글자는 정답 자리로 못 씀. 문맥 MLP 순전파: E[X] (N, 3, d) → .reshape(N, 3 * d) → @ W1 + b1 → np.tanh (N, H) → @ W2 + b2 → 로짓 (N, V) → softmax → 정답 확률의 -log 평균. tanh 는 -1~1 로 누르는 휘어진 함수 — 없으면 두 층이 행렬 한 장(W1 @ W2)과 같다. 역전파: 끝에서부터 dlogits = probs - onehot, y = x @ W 이면 dW = x.T @ dy · dx = dy @ W.T, h = tanh(a) 이면 da = dh * (1 - h ** 2). 기울기 모양 = 가중치 모양. 수치 기울기((올림 - 내림) / 2eps)와 같으면 맞다. 학습 고리는 챕터 4(N13 · N14).',
  terms: { '문맥': '다음 글자를 맞힐 때 보는 앞 글자들. 이 교과서의 MLP 는 앞 3글자를 본다', 'MLP': '행렬 곱 → 휘는 함수(tanh) → 행렬 곱 처럼 층을 쌓은 가장 기본적인 신경망. 가운데 층을 은닉층이라고 한다', '역전파': '손실에서 시작해 층을 거꾸로 거슬러 가며 가중치마다 기울기를 구하는 방법. 곱셈 · tanh 마다 규칙이 한 줄씩 있다' },
  pages: [
    { title: 'text[i - 3:i] == "가 고" · 한 글자로는 부족', html: `<p>바이그램([[레슨:N2]] · [[레슨:N8]])은 <b>바로 앞 한 글자</b>만 보고 다음 글자를 맞혀요. 그런데 한 글자만으로는 모자랄 때가 많아요. 짧은 글에서 「고」 다음에 무엇이 오는지 세어 봐요.</p>
<pre>for i in range(3, len(text)):
    if text[i - 1] == "고":        # 바로 앞 한 글자
        one[text[i]] += 1
    if text[i - 3:i] == "가 고":   # 앞 세 글자
        three[text[i]] += 1</pre>
<table class="kb"><tbody><tr><th>앞에서 본 것</th><th>다음 글자 횟수</th></tr><tr><td><code>"고"</code> 한 글자</td><td>프 2 · 양 2 · 빈칸 2 — 셋이 똑같아서 못 골라요</td></tr><tr><td><code>"가 고"</code> 세 글자</td><td>프 2 — 「배가 고프다」 로 확실해요</td></tr></tbody></table>
<p>「먹<b>고</b> 」, 「<b>고</b>양이」, 「배가 <b>고</b>프다」 의 고는 모두 같은 글자라서, 앞 한 글자만 보면 셋을 구별할 수 없어요. 앞을 더 보면 헷갈림이 확 줄어요. 다음 글자를 맞힐 때 보는 앞 글자들을 [[문맥]]이라고 해요.</p>
<p>그럼 세기 표를 「앞 3글자 → 다음 글자」 로 늘리면 될까요? 학습 글의 어휘는 130개쯤이라 앞 3글자 조합만 이만큼이에요.</p>
<pre>print(130 ** 3)   # 2197000</pre>
<p>칸이 2백만 개가 넘는데 학습 글은 800글자쯤이라, 거의 모든 칸이 0 이에요. 한 번도 못 본 조합은 아예 못 맞혀요. 그래서 세기 대신 <b>신경망</b>을 써요. 글자마다 벡터([[레슨:N6]])를 꺼내 이어 붙여 넣으면, 비슷한 글자는 비슷한 벡터라서 처음 보는 조합도 그럴듯하게 맞힐 수 있어요.</p>`,
      example: { code: `from collections import Counter

text = "배가 고프면 집에 간다. 고양이는 밥을 먹고 잠을 잔다. 나도 밥을 먹고 숙제를 한다. 배가 고프다. 고양이가 운다."

one = Counter()
three = Counter()
for i in range(3, len(text)):
    if text[i - 1] == "고":
        one[text[i]] += 1
    if text[i - 3:i] == "가 고":
        three[text[i]] += 1

print("'고' 다음:", dict(one))
print("'가 고' 다음:", dict(three))
print("앞 3글자 조합 수:", 130 ** 3)` } },
    { title: 'X.append(ids[i:i + 3]) · 문맥 창 만들기', html: `<p>글을 번호로 바꾼 뒤([[레슨:N1]]), <b>3글자짜리 창</b>을 한 칸씩 밀며 「문맥 3글자 → 정답 1글자」 짝을 만들어요. 바이그램에서 (앞 글자, 다음 글자) 짝을 만든 것과 같은데, 앞을 3글자로 늘린 거예요.</p>
<pre>X, Y = [], []
for i in range(len(ids) - 3):
    X.append(ids[i:i + 3])   # 문맥: i, i+1, i+2 번째
    Y.append(ids[i + 3])     # 정답: 바로 다음 글자</pre>
<p>「나는 밥을 먹는다.」 로 만들면 이렇게 돼요(예제 출력).</p>
<pre>'나는 ' → '밥'
'는 밥' → '을'
'밥을 ' → '먹'
…
'먹는다' → '.'</pre>
<ul><li>글자가 L 개면 문제는 <code>L - 3</code> 개예요. 맨 앞 3글자는 앞에 3글자가 없어서 정답 자리로 못 써요. 큰 모델은 글 앞에 「시작」 표시를 채워 넣어서 첫 글자도 맞혀 봐요</li><li>numpy 로 바꾸면 <code>X</code> 는 모양 <code>(N, 3)</code>, <code>Y</code> 는 <code>(N,)</code> — 문제 N 개, 문제마다 번호 3개와 정답 1개예요</li><li>창을 3 이 아니라 5 · 10 으로 늘리면 더 멀리 봐요. 그만큼 입력이 길어지는데, 이 문제는 다음 레슨의 어텐션이 풀어요</li></ul>`,
      example: { code: `import numpy as np

text = "나는 밥을 먹는다."
chars = sorted(set(text))
stoi = {ch: i for i, ch in enumerate(chars)}
itos = {i: ch for ch, i in stoi.items()}
ids = [stoi[ch] for ch in text]
print("번호:", ids)

X, Y = [], []
for i in range(len(ids) - 3):
    X.append(ids[i:i + 3])
    Y.append(ids[i + 3])

print(len(ids), "글자 →", len(X), "문제")
for x, y in zip(X, Y):
    ctx = "".join(itos[j] for j in x)
    print(x, "→", y, "   ", repr(ctx), "→", repr(itos[y]))

X = np.array(X)
Y = np.array(Y)
print("X 모양", X.shape, "· Y 모양", Y.shape)` } },
    { title: 'E[X].reshape(N, 3 * d) → np.tanh → 로짓', html: `<p>이제 문맥 3글자를 다음 글자 점수(로짓)로 바꾸는 [[MLP]] 를 만들어요. 한 줄씩, 모양(shape)을 따라가요. 글자 하나는 <code>d = 8</code> 칸 벡터, 은닉층은 <code>H = 32</code> 칸이에요.</p>
<table class="kb"><tbody><tr><th>단계</th><th>코드</th><th>모양</th></tr>
<tr><td>문맥 번호</td><td><code>X</code></td><td>(N, 3)</td></tr>
<tr><td>임베딩 꺼내기</td><td><code>emb = E[X]</code></td><td>(N, 3, d)</td></tr>
<tr><td>옆으로 이어 붙이기</td><td><code>x = emb.reshape(N, 3 * d)</code></td><td>(N, 24)</td></tr>
<tr><td>은닉층</td><td><code>h = np.tanh(x @ W1 + b1)</code></td><td>(N, 24) @ (24, 32) → (N, 32)</td></tr>
<tr><td>로짓</td><td><code>logits = h @ W2 + b2</code></td><td>(N, 32) @ (32, V) → (N, V)</td></tr>
<tr><td>확률</td><td><code>probs = softmax(logits)</code></td><td>(N, V) — 줄마다 합 1</td></tr></tbody></table>
<ul><li><code>E[X]</code> — [[레슨:N6]] 의 <code>E[idx]</code> 를 번호 표 통째로 해요. 번호마다 줄을 꺼내서 (N, 3) 이 (N, 3, d) 가 돼요</li><li><code>.reshape(N, 3 * d)</code> — 글자 세 개의 벡터 8칸 × 3 을 <b>옆으로 이어</b> 24칸 한 줄로 만들어요. 그래서 「몇 번째 글자였는지」 가 칸 자리로 남아요</li><li>손실은 [[레슨:N4]] 그대로 — 정답 글자 확률의 <code>-log</code> 평균이에요</li></ul>
<p><b>tanh 는 왜 넣나요?</b> <code>np.tanh</code> 는 어떤 수든 -1 과 1 사이로 눌러 주는 <b>휘어진</b> 함수예요.</p>
<pre>import numpy as np

a = np.array([-3.0, -1.0, 0.0, 1.0, 3.0])
t = np.tanh(a)
print(np.round(t, 3))   # [-0.995 -0.762  0.     0.762  0.995]</pre>
<p>tanh 가 없으면 <code>x @ W1 @ W2</code> 는 <code>x @ (W1 @ W2)</code> 와 같아서, 두 층이 행렬 한 장과 똑같아져요. 중간에 한 번 휘어 줘야 「앞이 『가 고』 일 때만 『프』」 같은 <b>조합</b>을 배울 수 있어요.</p>
<div class="bk-warn"><b>아직 학습 전이에요</b> — 가중치가 무작위라 손실이 「모든 글자를 똑같은 확률로」 찍을 때(<code>log(V)</code>)와 비슷하거나 더 나빠요. 이 모델을 학습시키는 건 챕터 4([[레슨:N14]])예요.</div>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

text = "나는 밥을 먹는다. 나는 물을 마신다. 나는 책을 읽는다."
chars = sorted(set(text))
stoi = {ch: i for i, ch in enumerate(chars)}
V = len(chars)
ids = [stoi[ch] for ch in text]
n = len(ids) - 3
X = np.array([ids[i:i + 3] for i in range(n)])
Y = np.array([ids[i + 3] for i in range(n)])
N = len(X)

d, H = 8, 32
rng = np.random.default_rng(0)
E = rng.normal(0, 1, (V, d))
W1 = rng.normal(0, 0.2, (3 * d, H))
b1 = np.zeros(H)
W2 = rng.normal(0, 0.1, (H, V))
b2 = np.zeros(V)

emb = E[X]
x = emb.reshape(N, 3 * d)
h = np.tanh(x @ W1 + b1)
logits = h @ W2 + b2
probs = softmax(logits)

print("X       ", X.shape)
print("E[X]    ", emb.shape)
print("이어 붙임", x.shape)
print("은닉 h   ", h.shape)
print("로짓     ", logits.shape)
print(f"h 는 {h.min():.3f} ~ {h.max():.3f} 사이")

p_right = probs[np.arange(N), Y]
loss = -np.log(p_right).mean()
print(f"손실 {loss:.3f} · 모두 같은 확률이면 {np.log(V):.3f}")
count = E.size + W1.size + b1.size + W2.size + b2.size
print("가중치 수", count)` } },
    { title: 'dW = x.T @ dy · 역전파 맛보기', html: `<p>학습하려면 가중치마다 기울기가 필요해요([[레슨:N7]]). 수치로 재면 가중치 하나마다 순전파를 한 번씩 더 해야 해서, 가중치가 수천 개면 너무 느려요. 그래서 손실에서 출발해 <b>뒤에서부터 거꾸로</b> 한 층씩 기울기를 넘겨 줘요. 이걸 [[역전파]]라고 해요.</p>
<table class="kb"><tbody><tr><th>순전파에서 한 일</th><th>역전파 한 줄</th></tr>
<tr><td><code>p = softmax(logits)</code> · 손실</td><td><code>dlogits = p - onehot</code>([[레슨:N8]] 그대로)</td></tr>
<tr><td><code>y = x @ W</code></td><td><code>dW = x.T @ dy</code> · <code>dx = dy @ W.T</code></td></tr>
<tr><td><code>h = np.tanh(a)</code></td><td><code>da = dh * (1 - h ** 2)</code></td></tr>
<tr><td><code>y = x + b</code></td><td><code>db = dy.sum(axis=0)</code></td></tr></tbody></table>
<p>작은 2층 망(입력 4칸 → 은닉 3칸 → 글자 5개)에서 해 봐요. 순전파의 중간값(<code>h</code>)을 남겨 두었다가 거꾸로 써요.</p>
<pre>dlogits = p - onehot       # (1, 5)
dW2 = h.T @ dlogits        # (3, 1) @ (1, 5) → (3, 5)
dh = dlogits @ W2.T        # (1, 5) @ (5, 3) → (1, 3)
da = dh * (1 - h ** 2)     # tanh 의 미분
dW1 = x.T @ da             # (4, 1) @ (1, 3) → (4, 3)</pre>
<ul><li><b>기울기의 모양 = 가중치의 모양</b>이에요. dW2 는 W2 처럼 (3, 5). 어디에 <code>.T</code> 를 붙일지 헷갈리면 모양이 맞게 붙이면 돼요</li><li><code>1 - h ** 2</code> 는 tanh 의 기울기예요. h 가 ±1 에 가까우면(꽉 눌렸으면) 기울기가 0 에 가까워져요</li><li>맞게 구했는지는 수치 기울기 <code>(올렸을 때 - 내렸을 때) / (2 * eps)</code> 와 비교해서 확인해요. 예제는 두 칸을 비교하고, 기울기 반대로 한 걸음 가서 손실이 줄어드는 것까지 봐요</li></ul>
<div class="bk-warn"><b>손으로 미분하는 건 문맥 MLP 까지</b> — 이 교과서에서 학습까지 하는 모델은 이 MLP 예요(챕터 4 [[레슨:N14]]). 다음 레슨부터의 어텐션 · 트랜스포머는 <b>순전파만</b> 만들어요. 큰 모델도 같은 규칙으로 학습하는데, PyTorch 같은 도구가 이 규칙을 자동으로 적용해 줘요(자동 미분).</div>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

rng = np.random.default_rng(0)
x = rng.normal(0, 1, (1, 4))
W1 = rng.normal(0, 0.5, (4, 3))
W2 = rng.normal(0, 0.5, (3, 5))
y = 2

def loss_of(W1, W2):
    h = np.tanh(x @ W1)
    p = softmax(h @ W2)
    return -np.log(p[0, y])

a = x @ W1
h = np.tanh(a)
logits = h @ W2
p = softmax(logits)
loss = -np.log(p[0, y])

onehot = np.zeros((1, 5))
onehot[0, y] = 1
dlogits = p - onehot
dW2 = h.T @ dlogits
dh = dlogits @ W2.T
da = dh * (1 - h ** 2)
dW1 = x.T @ da

print(f"손실 {loss:.4f}")
print("dW2 모양", dW2.shape, "· dW1 모양", dW1.shape)

eps = 1e-5
for name, W, dW, i, j in [("W2", W2, dW2, 1, 2), ("W1", W1, dW1, 0, 0)]:
    old = W[i, j]
    W[i, j] = old + eps
    up = loss_of(W1, W2)
    W[i, j] = old - eps
    down = loss_of(W1, W2)
    W[i, j] = old
    num = (up - down) / (2 * eps)
    print(f"{name}[{i}, {j}] 손으로 {dW[i, j]:.4f} · 수치로 {num:.4f}")

W1 -= 0.5 * dW1
W2 -= 0.5 * dW2
print(f"한 걸음 뒤 손실 {loss_of(W1, W2):.4f}")` } },
  ],
  summary: ['한 글자로는 부족 — 앞 3글자 창으로 (문맥, 정답) 짝을 만든다', 'E[X] 를 이어 붙여 tanh 은닉층 → 로짓 (N, V)', '역전파는 뒤에서부터 — dW = x.T @ dy, 기울기 모양 = 가중치 모양'] },
{ id: 'N10', ch: 3, n: 10, title: '어텐션: 어디를 볼지 고르기', mode: 'text',
  tutorSummary: '문맥 MLP 는 앞 3글자를 이어 붙여서 더 멀리 보려면 입력이 계속 길어진다. 다른 길: 앞 글자들의 벡터를 섞어 하나로 — 가장 쉬운 섞기는 평균, 비율을 정하면 가중 평균 w @ v ((T,) @ (T, d) → (d,), w 의 합은 1). 어텐션: 질문 q 와 열쇠 k 의 내적(닮을수록 큼) = 점수 k @ q (T,), softmax 로 비율 w, 값 v 를 w @ v 로 섞는다. 글 전체에서는 자리마다 질문 — 점수 행렬 x @ x.T (T, T). 자리 t 는 0..t 만 봐야 함(뒤는 정답이라 반칙): np.tril(np.ones((T, T))) 를 줄 합으로 나누면 앞만 평균, 점수로 하려면 mask = np.triu(np.ones((T, T), dtype=bool), k=1) 자리를 -np.inf 로 → exp(-inf) = 0 이라 softmax 뒤 비율 0. 점수가 모두 0 이면 앞만 평균과 같다. 이번 레슨은 글자 벡터 x 를 q · k · v 로 그대로 씀 — 따로 만드는 건 N11.',
  terms: { '어텐션': '자리마다 「다른 자리를 얼마나 볼지」 점수를 매기고, 그 비율로 값들을 섞는 가중 평균. 점수는 질문(q)과 열쇠(k)의 내적', '마스크': '뒤쪽(아직 안 온) 자리의 점수를 -inf 로 바꿔, 소프트맥스 뒤 비율이 0 이 되게 가리는 것' },
  pages: [
    { title: 'w @ v · 평균 → 가중 평균', html: `<p>문맥 MLP([[레슨:N9]])는 앞 3글자를 이어 붙였어요. 더 멀리(앞 100글자) 보려면 입력이 100글자만큼 길어지고, 「어느 글자가 중요한지」 도 자리로만 알아요. 다른 생각을 해 봐요. 앞 글자들의 벡터를 <b>섞어서 한 줄</b>로 만드는 거예요. 가장 쉬운 섞기는 평균이에요.</p>
<pre>import numpy as np

v = np.array([[1.0, 0.0], [0.0, 1.0], [4.0, 4.0]])   # 글자 3개의 벡터 (3, 2)
avg = v.mean(axis=0)
print(np.round(avg, 3))   # [1.667 1.667]
w = np.array([0.1, 0.1, 0.8])                          # 비율 — 합이 1
print(w @ v)              # [3.3 3.3]</pre>
<table class="kb"><tbody><tr><th>계산</th><th>모양</th><th>뜻</th></tr>
<tr><td><code>v.mean(axis=0)</code></td><td>(3, 2) → (2,)</td><td>셋을 똑같이 1/3 씩</td></tr>
<tr><td><code>w @ v</code></td><td>(3,) @ (3, 2) → (2,)</td><td>0.1 · 0.1 · 0.8 씩 — 셋째를 많이</td></tr></tbody></table>
<p><code>w @ v</code> 는 <code>0.1 * v[0] + 0.1 * v[1] + 0.8 * v[2]</code> 예요. 비율의 합이 1 이면 이것도 평균의 한 가지라서 <b>가중 평균</b>이라고 해요. 평균은 비율이 모두 1/3 인 가중 평균이에요.</p>
<p>그럼 비율은 누가 정할까요? 고정해 두면 안 돼요. 「이를 닦<b>고</b>」 에서는 앞의 「닦」 을, 「공원에 <b>가</b>」 에서는 「공원」 을 많이 봐야 하죠. 비율을 <b>그때그때 계산</b>하는 것이 [[어텐션]]이에요.</p>`,
      example: { code: `import numpy as np

v = np.array([[1.0, 0.0], [0.0, 1.0], [4.0, 4.0]])
avg = v.mean(axis=0)
print("평균      ", np.round(avg, 3))

same = np.ones(3) / 3
print("1/3 씩     ", np.round(same @ v, 3))

w = np.array([0.1, 0.1, 0.8])
total = w.sum()
print(f"비율 합      {total:.3f}")
print("가중 평균  ", np.round(w @ v, 3))
print("손으로     ", np.round(0.1 * v[0] + 0.1 * v[1] + 0.8 * v[2], 3))` } },
    { title: 'k @ q → softmax → w @ v', html: `<p>비율은 이렇게 정해요. 자리마다 세 가지를 생각해요.</p>
<table class="kb"><tbody><tr><th>이름</th><th>뜻</th></tr>
<tr><td><b>q</b> 질문(query)</td><td>「나는 지금 이런 걸 찾아요」</td></tr>
<tr><td><b>k</b> 열쇠(key)</td><td>「나는 이런 글자예요」 — 자리마다 하나</td></tr>
<tr><td><b>v</b> 값(value)</td><td>「나를 보면 이걸 줄게요」 — 자리마다 하나</td></tr></tbody></table>
<p>질문과 열쇠가 <b>닮을수록</b> 그 자리의 값을 많이 가져와요. 닮은 정도는 내적이에요 — 방향이 같으면 크고, 다르면 0 이나 음수예요(<a href="../math/#lesson/M5_dot" target="_blank" rel="noopener">수학 공간 「같은 방향을 보고 있나 — 내적」 ↗</a>). 점수를 softmax([[레슨:N5]])로 비율로 바꿔서 섞어요.</p>
<pre>import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

k = np.array([[1.0, 0.0], [0.0, 1.0], [0.7, 0.7]])     # 열쇠 (T, d)
v = np.array([[10.0, 0.0], [0.0, 10.0], [5.0, 5.0]])   # 값 (T, d)
q = np.array([2.0, 0.0])                               # 질문 (d,)
scores = k @ q
print(scores)              # [2.  0.  1.4]
w = softmax(scores)
print(np.round(w, 3))      # [0.594 0.08  0.326]
out = w @ v
print(np.round(out, 3))    # [7.567 2.433]</pre>
<table class="kb"><tbody><tr><th>단계</th><th>코드</th><th>모양 (T=3, d=2)</th></tr>
<tr><td>점수</td><td><code>scores = k @ q</code></td><td>(3, 2) @ (2,) → (3,)</td></tr>
<tr><td>비율</td><td><code>w = softmax(scores)</code></td><td>(3,) — 합 1</td></tr>
<tr><td>섞기</td><td><code>out = w @ v</code></td><td>(3,) @ (3, 2) → (2,)</td></tr></tbody></table>
<p>질문 <code>[2, 0]</code> 은 첫째 열쇠 <code>[1, 0]</code> 과 방향이 같아서 첫째를 가장 많이(0.594) 봐요. 예제처럼 질문을 <code>[0, 2]</code> 로 바꾸면 이번엔 둘째를 가장 많이 봐요. <b>질문이 바뀌면 보는 곳이 바뀌어요</b> — 「어디를 볼지 고르기」 예요.</p>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

k = np.array([[1.0, 0.0], [0.0, 1.0], [0.7, 0.7]])
v = np.array([[10.0, 0.0], [0.0, 10.0], [5.0, 5.0]])

for q in [np.array([2.0, 0.0]), np.array([0.0, 2.0])]:
    scores = k @ q
    w = softmax(scores)
    out = w @ v
    print("질문", q, "→ 점수", np.round(scores, 3))
    best = w.argmax()
    print("   비율", np.round(w, 3), "· 가장 많이 보는 자리", best)
    print("   결과", np.round(out, 3))` } },
    { title: 'np.tril(np.ones((T, T))) · 앞 글자만 평균', html: `<p>글 하나에서는 <b>자리마다</b> 이걸 해요. 그런데 규칙이 하나 있어요. 자리 t 에서 다음 글자를 맞힐 때는 <b>0 ~ t 자리만</b> 볼 수 있어요. t+1 자리는 바로 그 정답이라서, 보면 반칙이에요.</p>
<p>먼저 비율을 「앞 글자들 똑같이」 로 해 봐요. 아래 삼각형(<code>np.tril</code>)에 1 을 채우고, 줄마다 합으로 나누면 돼요.</p>
<pre>import numpy as np

T = 4
tri = np.tril(np.ones((T, T)))
w = tri / tri.sum(axis=1, keepdims=True)
print(np.round(w, 3))</pre>
<pre>[[1.    0.    0.    0.   ]
 [0.5   0.5   0.    0.   ]
 [0.333 0.333 0.333 0.   ]
 [0.25  0.25  0.25  0.25 ]]</pre>
<p>줄 t 가 「자리 t 가 각 자리를 보는 비율」 이에요. 자리 0 은 자기만, 자리 3 은 넷을 1/4 씩 — 오른쪽 위는 모두 0 이라 뒤를 안 봐요. 이 비율 표 하나를 글자 벡터에 곱하면 <b>모든 자리의 평균이 한 번에</b> 나와요.</p>
<table class="kb"><tbody><tr><th>계산</th><th>모양</th></tr>
<tr><td><code>w</code></td><td>(T, T) — 줄마다 합 1</td></tr>
<tr><td><code>x</code> 글자 벡터</td><td>(T, d)</td></tr>
<tr><td><code>out = w @ x</code></td><td>(T, T) @ (T, d) → (T, d) — 줄 t = x[0] ~ x[t] 의 평균</td></tr></tbody></table>
<p>행렬 곱은 <code>(a, b) @ (b, c) → (a, c)</code> — 가운데 수가 같아야 하고, 바깥 두 수가 결과 모양이에요(<a href="../math/#lesson/M5_compose" target="_blank" rel="noopener">수학 공간 「연달아 변형하기 — 행렬 곱」 ↗</a>).</p>`,
      example: { code: `import numpy as np

T = 4
x = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [3.0, 3.0]])
tri = np.tril(np.ones((T, T)))
w = tri / tri.sum(axis=1, keepdims=True)
print("비율 w")
print(np.round(w, 3))

out = w @ x
print("w @ x", w.shape, "@", x.shape, "→", out.shape)
print(np.round(out, 3))
first3 = x[:3].mean(axis=0)
print("자리 2 = 앞 3개 평균:", np.round(first3, 3))` } },
    { title: 'scores[mask] = -np.inf · 미래 가리기', html: `<p>이번엔 비율을 점수로 정해요. 자리마다 질문을 하나씩 하니까 점수도 표가 돼요. 이번 레슨에서는 글자 벡터 <code>x</code> 를 질문 · 열쇠 · 값으로 <b>그대로</b> 써요(따로 만드는 건 [[레슨:N11]]).</p>
<pre>scores = x @ x.T                                  # (T, d) @ (d, T) → (T, T)
mask = np.triu(np.ones((T, T), dtype=bool), k=1)  # 대각선 위쪽만 True
scores[mask] = -np.inf                            # 뒤쪽 자리 가리기
w = softmax(scores)                               # 줄마다 비율 (T, T)
out = w @ x                                       # (T, T) @ (T, d) → (T, d)</pre>
<ul><li><code>scores[t, j]</code> 는 「자리 t 의 질문 · 자리 j 의 열쇠」 내적이에요</li><li><code>np.triu(…, k=1)</code> 은 대각선 <b>바로 위부터</b> 오른쪽 위 삼각형이에요. 자리 t 보다 뒤인 j 가 모두 True</li><li>그 자리를 <code>-np.inf</code>(음의 무한대)로 바꾸면, softmax 의 <code>exp</code> 가 0 을 줘서 비율이 정확히 0 이 돼요. 이게 [[마스크]]예요</li></ul>
<pre>import numpy as np

print(np.exp(-np.inf))   # 0.0</pre>
<p>점수를 모두 0 으로 두고 마스크를 씌우면, 앞 쪽의 「앞 글자만 평균」 과 <b>똑같은</b> 비율이 나와요(예제 마지막 줄). 어텐션은 그 평균을 「점수로 비율을 정하는」 것으로 바꾼 거예요.</p>
<div class="bk-warn"><b>-inf 대신 0 으로 가리면 안 돼요</b> — 점수 0 은 「보통」 이라 exp(0) = 1 만큼 봐요. 꼭 <code>-np.inf</code>(또는 아주 큰 음수)로 바꿔야 비율이 0 이 돼요. 대각선(자기 자신)은 늘 남아 있어서 줄 전체가 -inf 가 되지는 않아요.</div>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

T = 4
x = np.array([[1.0, 0.0], [0.0, 1.0], [1.0, 1.0], [3.0, 3.0]])

scores = x @ x.T
mask = np.triu(np.ones((T, T), dtype=bool), k=1)
print("마스크(True = 가림)")
print(mask)
scores[mask] = -np.inf
w = softmax(scores)
print("비율 w")
print(np.round(w, 3))
out = w @ x
print("결과", out.shape)
print(np.round(out, 3))

zero = np.zeros((T, T))
zero[mask] = -np.inf
tri = np.tril(np.ones((T, T)))
avg = tri / tri.sum(axis=1, keepdims=True)
wz = softmax(zero)
print("점수 0 + 마스크 = 앞만 평균?", np.allclose(wz, avg))` } },
  ],
  summary: ['어텐션 = 비율을 그때그때 정하는 가중 평균 w @ v', '점수는 질문 q 와 열쇠 k 의 내적 → softmax 로 비율', '뒤쪽 자리는 -inf 마스크로 가려 비율 0 — 앞만 본다'] },
{ id: 'N11', ch: 3, n: 11, title: '셀프 어텐션 Q · K · V', mode: 'text',
  tutorSummary: 'N10 처럼 글자 벡터 x 를 질문 · 열쇠 · 값으로 그대로 쓰면 자기 자신과 가장 닮아 자기만 보고, 「찾는 것」 과 「나는 이런 것」 이 같아야 한다. 그래서 가중치 세 장: q = x @ Wq · k = x @ Wk · v = x @ Wv ((T, d) @ (d, dk) → (T, dk)), 가중치는 학습으로 정해진다. 코드에서는 소문자 q · k · v(V 는 어휘 크기). 점수 q @ k.T 는 (T, T), 내적은 dk 칸을 더한 것이라 dk 가 크면 점수가 √dk 배쯤 퍼진다 → softmax 가 한 자리만 1 이 되어 버림 → np.sqrt(dk) 로 나눈다. 셀프 어텐션 = softmax(q @ k.T / √dk + 마스크) @ v: (T, d) → q·k·v (T, dk) → 점수 (T, T) → 비율 (T, T) 줄마다 합 1 → 결과 (T, dk). (a, b) @ (b, c) → (a, c), 모양이 헷갈리면 줄마다 .shape. 멀티 헤드는 이름만: 작은 머리 여러 개를 따로 해서 np.concatenate(axis=-1) 로 이어 붙이고 @ Wo. 같은 입력에서 Q·K·V 를 다 만들어서 「셀프」.',
  terms: { '셀프 어텐션': '한 글 안의 자리들이 서로를 보는 어텐션. 같은 입력 x 에서 질문 · 열쇠 · 값을 모두 만든다', '멀티 헤드': '셀프 어텐션을 작은 것(머리) 여러 개로 따로 하고, 결과를 옆으로 이어 붙이는 것. 머리마다 다른 관계를 볼 수 있다' },
  pages: [
    { title: 'q = x @ Wq · k = x @ Wk · v = x @ Wv', html: `<p>[[레슨:N10]] 에서는 글자 벡터 <code>x</code> 를 질문 · 열쇠 · 값으로 <b>그대로</b> 썼어요. 그러면 두 가지가 곤란해요.</p>
<ul><li>내적은 자기 자신과 가장 큰 경우가 많아서, 자리마다 <b>자기만</b> 보기 쉬워요([[레슨:N10]] 마지막 예제의 마지막 줄 <code>[0. 0. 0. 1.]</code>)</li><li>「내가 찾는 것」 과 「나는 이런 글자」 가 늘 같아야 해요. 「조사는 앞의 받침 있는 글자를 찾는다」 처럼 찾는 것과 가진 것이 다를 수 없어요</li></ul>
<p>그래서 <code>x</code> 에 <b>서로 다른 가중치 세 장</b>을 곱해 역할마다 벡터를 따로 만들어요. 같은 입력에서 셋을 다 만들어 서로를 보니까 [[셀프 어텐션]]이라고 해요.</p>
<table class="kb"><tbody><tr><th>이름</th><th>코드</th><th>모양 (T=4, d=8, dk=4)</th></tr>
<tr><td>질문 Q</td><td><code>q = x @ Wq</code></td><td>(4, 8) @ (8, 4) → (4, 4)</td></tr>
<tr><td>열쇠 K</td><td><code>k = x @ Wk</code></td><td>(4, 8) @ (8, 4) → (4, 4)</td></tr>
<tr><td>값 V</td><td><code>v = x @ Wv</code></td><td>(4, 8) @ (8, 4) → (4, 4)</td></tr></tbody></table>
<ul><li><code>Wq · Wk · Wv</code> 는 학습으로 정해지는 가중치예요. 학습하면서 「무엇을 찾을지 · 무엇이라고 알릴지 · 무엇을 건넬지」 를 스스로 배워요. 여기서는 seed 고정 무작위 값이에요</li><li><code>dk</code> 는 질문 · 열쇠 벡터의 칸 수예요. <code>d</code> 와 같아도 되고 작아도 돼요</li><li>식에서는 대문자 Q · K · V 로 쓰는데, 코드에서는 <b>소문자</b> <code>q, k, v</code> 로 써요. 대문자 <code>V</code> 는 이미 어휘 크기로 쓰고 있어서요</li></ul>`,
      example: { code: `import numpy as np

T, d, dk = 4, 8, 4
rng = np.random.default_rng(0)
x = rng.normal(0, 1, (T, d))
Wq = rng.normal(0, 0.5, (d, dk))
Wk = rng.normal(0, 0.5, (d, dk))
Wv = rng.normal(0, 0.5, (d, dk))

q = x @ Wq
k = x @ Wk
v = x @ Wv
print("x", x.shape, "@ Wq", Wq.shape, "→ q", q.shape)
print("k", k.shape, "· v", v.shape)

same = x @ x.T
print("x 그대로: 줄마다 가장 큰 점수 자리", same.argmax(axis=1))
qk = q @ k.T
print("q · k 따로: 줄마다 가장 큰 점수 자리", qk.argmax(axis=1))` } },
    { title: 'q @ k.T / np.sqrt(dk) · 왜 √dk 로 나누나', html: `<p>모든 자리의 질문과 모든 자리의 열쇠를 한 번에 내적하면 점수 표가 나와요.</p>
<table class="kb"><tbody><tr><th>계산</th><th>모양</th></tr>
<tr><td><code>k.T</code></td><td>(T, dk) → (dk, T) — 줄과 칸을 바꿈</td></tr>
<tr><td><code>q @ k.T</code></td><td>(T, dk) @ (dk, T) → (T, T)</td></tr></tbody></table>
<p>그런데 내적은 dk 칸을 곱해 <b>더한</b> 것이라, 칸이 많을수록 점수가 커져요(대략 √dk 배로 퍼져요). 점수가 크면 softmax 가 한 자리에만 거의 1 을 줘요.</p>
<pre>import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

small = np.array([1.0, 2.0, 3.0])
p = softmax(small)
print(np.round(p, 3))    # [0.09  0.245 0.665]
p4 = softmax(small * 4)
print(np.round(p4, 3))   # [0.    0.018 0.982]</pre>
<p>점수가 4배가 됐을 뿐인데 한 자리만 보게 됐어요. 그러면 다른 자리는 거의 못 보고, 학습할 때 기울기도 0 에 가까워져요. 그래서 점수를 <code>np.sqrt(dk)</code> 로 나눠 크기를 맞춰요. 예제는 dk 를 1 · 4 · 16 으로 바꿔 가며 점수가 퍼진 정도(표준편차)를 재요 — 나누면 dk 와 상관없이 1 근처예요.</p>`,
      example: { code: `import numpy as np

rng = np.random.default_rng(0)
T = 8
for dk in [1, 4, 16]:
    q = rng.normal(0, 1, (T, dk))
    k = rng.normal(0, 1, (T, dk))
    scores = q @ k.T
    scaled = scores / np.sqrt(dk)
    print(f"dk={dk:2d} 점수 퍼짐 {scores.std():.2f} → 나누면 {scaled.std():.2f}")` } },
    { title: 'softmax(q @ k.T / √dk + 마스크) @ v', html: `<p>셀프 어텐션을 함수 하나로 묶어요. [[레슨:N10]] 의 마스크까지 넣으면 끝이에요.</p>
<pre>def self_attention(x, Wq, Wk, Wv):
    T = len(x)
    q = x @ Wq
    k = x @ Wk
    v = x @ Wv
    dk = k.shape[-1]
    scores = q @ k.T / np.sqrt(dk)
    mask = np.triu(np.ones((T, T), dtype=bool), k=1)
    scores[mask] = -np.inf
    w = softmax(scores)
    return w @ v, w</pre>
<table class="kb"><tbody><tr><th>단계</th><th>코드</th><th>모양 (T=5, d=8, dk=4)</th></tr>
<tr><td>입력</td><td><code>x</code></td><td>(5, 8)</td></tr>
<tr><td>질문 · 열쇠 · 값</td><td><code>x @ Wq</code> …</td><td>(5, 8) @ (8, 4) → (5, 4)</td></tr>
<tr><td>점수</td><td><code>q @ k.T / np.sqrt(dk)</code></td><td>(5, 4) @ (4, 5) → (5, 5)</td></tr>
<tr><td>마스크</td><td><code>scores[mask] = -np.inf</code></td><td>(5, 5)</td></tr>
<tr><td>비율</td><td><code>w = softmax(scores)</code></td><td>(5, 5) — 줄마다 합 1</td></tr>
<tr><td>결과</td><td><code>w @ v</code></td><td>(5, 5) @ (5, 4) → (5, 4)</td></tr></tbody></table>
<p>모양만 따라가면 안 헷갈려요. 행렬 곱 <code>(a, b) @ (b, c) → (a, c)</code> 는 <b>가운데 수가 같아야</b> 해요. 에러 <code>matmul: Input operand 1 has a mismatch</code> 가 나면 줄마다 <code>print(q.shape)</code> 를 찍어 보고 <code>.T</code> 가 빠졌는지 봐요.</p>
<p>예제는 비율 표 <code>w</code> 를 찍어요. 오른쪽 위는 0(마스크), 줄마다 합은 1 이고, 이번엔 자리마다 <b>여러 자리를 나눠서</b> 봐요.</p>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def self_attention(x, Wq, Wk, Wv):
    T = len(x)
    q = x @ Wq
    k = x @ Wk
    v = x @ Wv
    dk = k.shape[-1]
    scores = q @ k.T / np.sqrt(dk)
    mask = np.triu(np.ones((T, T), dtype=bool), k=1)
    scores[mask] = -np.inf
    w = softmax(scores)
    return w @ v, w

T, d, dk = 5, 8, 4
rng = np.random.default_rng(0)
x = rng.normal(0, 1, (T, d))
Wq = rng.normal(0, 0.5, (d, dk))
Wk = rng.normal(0, 0.5, (d, dk))
Wv = rng.normal(0, 0.5, (d, dk))

out, w = self_attention(x, Wq, Wk, Wv)
print("입력", x.shape, "→ 결과", out.shape)
print("비율 w (줄 = 보는 자리, 칸 = 보이는 자리)")
print(np.round(w, 2))
rows = w.sum(axis=1)
print("줄마다 합", np.round(rows, 3))` } },
    { title: 'np.concatenate(…, axis=-1) · 멀티 헤드', html: `<p>실제 모델은 셀프 어텐션을 <b>여러 개</b> 따로 해요. 하나하나를 머리(head)라고 하고, 이걸 [[멀티 헤드]] 어텐션이라고 해요. 이 교과서는 이름과 모양만 봐요.</p>
<pre>h1, _ = self_attention(x, Wq1, Wk1, Wv1)   # (T, 4)
h2, _ = self_attention(x, Wq2, Wk2, Wv2)   # (T, 4)
both = np.concatenate([h1, h2], axis=-1)   # (T, 8) — 옆으로 이어 붙임
out = both @ Wo                            # (T, 8) @ (8, 8) → (T, 8)</pre>
<ul><li>머리마다 가중치가 달라서 <b>다른 관계</b>를 볼 수 있어요. 한 머리는 바로 앞 글자, 다른 머리는 띄어쓰기 뒤 첫 글자를 보는 식이에요(학습하면서 저절로 나뉘어요)</li><li>머리 칸 수 × 머리 수 = d 로 맞추는 게 보통이에요. d=8 을 머리 2개 × 4칸으로</li><li>마지막 <code>@ Wo</code> 는 이어 붙인 것을 다시 섞는 가중치예요. 결과가 입력과 같은 (T, d) 라서 다음 층에 그대로 넣을 수 있어요</li></ul>
<p>GPT-2 의 가장 작은 모델은 머리가 12개예요. 다음 레슨과 만들어 보기는 간단하게 <b>머리 하나</b>로 해요.</p>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def self_attention(x, Wq, Wk, Wv):
    T = len(x)
    q = x @ Wq
    k = x @ Wk
    v = x @ Wv
    dk = k.shape[-1]
    scores = q @ k.T / np.sqrt(dk)
    mask = np.triu(np.ones((T, T), dtype=bool), k=1)
    scores[mask] = -np.inf
    w = softmax(scores)
    return w @ v, w

T, d, dk = 5, 8, 4
rng = np.random.default_rng(0)
x = rng.normal(0, 1, (T, d))
heads = []
for name in ["머리 1", "머리 2"]:
    Wq = rng.normal(0, 0.5, (d, dk))
    Wk = rng.normal(0, 0.5, (d, dk))
    Wv = rng.normal(0, 0.5, (d, dk))
    h, w = self_attention(x, Wq, Wk, Wv)
    print(name, h.shape, "· 마지막 자리가 보는 비율", np.round(w[-1], 2))
    heads.append(h)

both = np.concatenate(heads, axis=-1)
Wo = rng.normal(0, 0.5, (d, d))
out = both @ Wo
print("이어 붙임", both.shape, "→ @ Wo →", out.shape)` } },
  ],
  summary: ['x 에 Wq · Wk · Wv 를 곱해 질문 · 열쇠 · 값을 따로 만든다', 'softmax(q @ k.T / √dk + 마스크) @ v — √dk 로 나눠 한쪽 쏠림을 막는다', '모양: (T, d) → 점수 (T, T) → 결과 (T, dk), 머리 여러 개는 이어 붙인다'] },
{ id: 'N12', ch: 3, n: 12, title: '트랜스포머 블록 한 층', mode: 'text',
  tutorSummary: '어텐션은 가중 평균이라 순서를 모른다 — 「가나다」 와 「나가다」 의 마지막 자리 결과가 똑같다. 그래서 자리 번호마다 벡터 한 줄(위치 임베딩 P, (T_MAX, d))을 글자 임베딩에 더한다: x = E[ids] + P[:T] (T, d). T_MAX 가 한 번에 보는 최대 길이(문맥 길이). 잔차 x = x + f(x): 원래 값에 고친 만큼만 더해서 정보가 남고 깊어도 학습이 잘 된다. 레이어 정규화: 자리마다 칸들의 평균 0 · 표준편차 1 ((x - mu) / np.sqrt(var + 1e-5), 진짜는 학습되는 γ · β 도 곱하고 더함). 블록: x = x + attention(layer_norm(x)) → x = x + mlp(layer_norm(x)), MLP 는 자리마다 따로 (T, d) @ (d, 4d) → tanh → @ (4d, d). 어텐션 = 자리끼리 주고받기, MLP = 자리마다 곱씹기. 블록은 (T, d) → (T, d) 라 몇 층이든 쌓는다. 가중치는 층마다 딕셔너리 하나(make_layer). 끝에 layer_norm → @ Wout (d, V) → 로짓 (T, V) → softmax = 자리마다 다음 글자 확률, 마스크 덕에 T 개 문제를 한 번에 반칙 없이. GPT-2 small: 12층 · d 768 · 머리 12 · 문맥 1024 · 어휘 50257 · 약 1억 2천만 개. 여기서는 순전파만 — 무작위 가중치라 엉뚱, 학습은 자동 미분(PyTorch), 이 교과서는 문맥 MLP 로 학습(N13 · N14).',
  terms: { '위치 임베딩': '자리 번호마다 벡터 한 줄. 글자 임베딩에 더해서 「몇 번째 자리인지」 를 알려 준다', '잔차 연결': 'x = x + f(x) 처럼 원래 값에 고친 만큼만 더하는 것. 층을 많이 쌓아도 원래 정보와 기울기가 잘 지나간다', '레이어 정규화': '자리마다 벡터 칸들의 평균을 0, 표준편차를 1 로 맞추는 것. 층을 지나며 값이 너무 커지거나 작아지지 않게 한다', '트랜스포머': '어텐션과 MLP 를 잔차 · 정규화로 묶은 블록을 여러 층 쌓은 모델. GPT 가 이 구조다' },
  pages: [
    { title: 'x = E[ids] + P[:T] · 위치 임베딩', html: `<p>어텐션은 가중 평균이에요. 평균은 <b>섞는 순서와 상관없어서</b>, 어텐션만으로는 글자 순서를 몰라요. 「가나다」 와 「나가다」 에서 마지막 자리 「다」 는 둘 다 {가, 나, 다} 를 보니까 결과가 똑같아요(예제 첫 줄 <code>True</code>). 「개가 사람을 문다」 와 「사람이 개를 문다」 를 구별 못 하면 큰일이죠.</p>
<p>그래서 <b>자리 번호마다</b> 벡터를 한 줄씩 두고 글자 임베딩에 더해요. 이게 [[위치 임베딩]]이에요.</p>
<pre>E = rng.normal(0, 1, (V, d))       # 글자마다 한 줄
P = rng.normal(0, 1, (T_MAX, d))   # 자리마다 한 줄
x = E[ids] + P[:T]                 # 같은 글자라도 자리가 다르면 다른 벡터</pre>
<table class="kb"><tbody><tr><th>계산</th><th>모양 (T=3, d=8, T_MAX=8)</th></tr>
<tr><td><code>E[ids]</code></td><td>(V, d) 에서 3줄 → (3, 8)</td></tr>
<tr><td><code>P[:T]</code></td><td>(8, 8) 에서 앞 3줄 → (3, 8)</td></tr>
<tr><td><code>E[ids] + P[:T]</code></td><td>(3, 8) + (3, 8) → (3, 8)</td></tr></tbody></table>
<ul><li><code>T_MAX</code> 는 한 번에 볼 수 있는 가장 긴 글이에요(<b>문맥 길이</b>). P 가 그만큼만 있어서 더 긴 글은 앞을 잘라 넣어요. 큰 모델이 말하는 「문맥 창 몇만 토큰」 이 바로 이 수예요</li><li>P 도 E 처럼 학습되는 표예요(GPT 방식). 처음 트랜스포머 논문은 sin · cos 로 만든 고정 값을 썼어요</li></ul>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def attention(x, Wq, Wk, Wv):
    T = len(x)
    q = x @ Wq
    k = x @ Wk
    v = x @ Wv
    scores = q @ k.T / np.sqrt(k.shape[-1])
    mask = np.triu(np.ones((T, T), dtype=bool), k=1)
    scores[mask] = -np.inf
    return softmax(scores) @ v

chars = ["가", "나", "다"]
stoi = {ch: i for i, ch in enumerate(chars)}
V, d, T_MAX = 3, 8, 8
rng = np.random.default_rng(0)
E = rng.normal(0, 1, (V, d))
P = rng.normal(0, 1, (T_MAX, d))
Wq = rng.normal(0, 0.5, (d, d))
Wk = rng.normal(0, 0.5, (d, d))
Wv = rng.normal(0, 0.5, (d, d))

a = [stoi[ch] for ch in "가나다"]
b = [stoi[ch] for ch in "나가다"]
out_a = attention(E[a], Wq, Wk, Wv)
out_b = attention(E[b], Wq, Wk, Wv)
print("위치 없이: 마지막 자리 같음?", np.allclose(out_a[-1], out_b[-1]))

T = len(a)
x_a = E[a] + P[:T]
x_b = E[b] + P[:T]
print("x 모양", x_a.shape)
out_a = attention(x_a, Wq, Wk, Wv)
out_b = attention(x_b, Wq, Wk, Wv)
print("위치 더하면: 마지막 자리 같음?", np.allclose(out_a[-1], out_b[-1]))` } },
    { title: 'x = x + attention(layer_norm(x))', html: `<p>어텐션 한 번으로 끝나지 않고 여러 층을 쌓으려면, 두 가지 장치가 필요해요.</p>
<p><b>1. 잔차 연결</b> — 어텐션 결과로 x 를 <b>바꿔 치우지 않고 더해요</b>: <code>x = x + attention(…)</code>. 원래 글자 정보가 그대로 남고, 어텐션은 「고칠 만큼」 만 더해요. 층이 많아도 <code>x</code> 가 곧장 지나가는 길이 있어서 학습이 잘 돼요. 이걸 [[잔차 연결]]이라고 해요.</p>
<p><b>2. 레이어 정규화</b> — 층을 지날수록 값이 점점 커지거나 작아지면 softmax · tanh 가 한쪽으로 쏠려요. 그래서 들어가기 전에 <b>자리마다</b> 칸들을 평균 0, 표준편차 1 로 맞춰요. 이게 [[레이어 정규화]]예요.</p>
<pre>import numpy as np

def layer_norm(x):
    mu = x.mean(axis=-1, keepdims=True)
    var = x.var(axis=-1, keepdims=True)
    return (x - mu) / np.sqrt(var + 1e-5)

x = np.array([[1.0, 2.0, 3.0, 4.0], [10.0, 0.0, 10.0, 0.0]])
y = layer_norm(x)
print(np.round(y, 3))</pre>
<pre>[[-1.342 -0.447  0.447  1.342]
 [ 1.    -1.     1.    -1.   ]]</pre>
<ul><li><code>axis=-1</code> 은 「마지막 축(칸) 방향」 — 줄(자리)마다 따로 평균을 내요. 모양은 (T, d) 그대로예요</li><li><code>1e-5</code> 는 분산이 0 일 때 0 으로 나누지 않게 더하는 아주 작은 수예요</li><li>진짜 모델은 결과에 학습되는 γ(곱) · β(더하기)를 한 번 더 적용해요. 처음 값이 1 과 0 이라 여기서는 뺐어요</li></ul>`,
      example: { code: `import numpy as np

def layer_norm(x):
    mu = x.mean(axis=-1, keepdims=True)
    var = x.var(axis=-1, keepdims=True)
    return (x - mu) / np.sqrt(var + 1e-5)

x = np.array([[1.0, 2.0, 3.0, 4.0], [10.0, 0.0, 10.0, 0.0]])
y = layer_norm(x)
print(np.round(y, 3))
mean = np.round(y.mean(axis=-1), 3) + 0.0
std = np.round(y.std(axis=-1), 3)
print("줄마다 평균", mean, "· 표준편차", std)

change = np.array([[0.1, -0.1, 0.0, 0.2], [0.0, 0.3, 0.0, -0.3]])
res = x + change
print("잔차: 원래 + 고칠 만큼")
print(res)` } },
    { title: 'def block(x, w): · 어텐션 + MLP', html: `<p>트랜스포머의 블록 한 층은 이 두 줄이에요.</p>
<pre>def block(x, w):
    x = x + attention(layer_norm(x), w)   # 자리끼리 정보를 주고받고
    x = x + mlp(layer_norm(x), w)         # 자리마다 받은 걸 곱씹어요
    return x

def mlp(x, w):
    h = np.tanh(x @ w["W1"])   # (T, d) @ (d, 4d) → (T, 4d)
    return h @ w["W2"]         # (T, 4d) @ (4d, d) → (T, d)</pre>
<ul><li><b>어텐션</b>은 자리끼리 보는 일, <b>MLP</b> 는 자리마다 <b>따로</b> 하는 일이에요. MLP 는 [[레슨:N9]] 의 은닉층과 같은 모양(행렬 곱 → tanh → 행렬 곱)이에요. 보통 가운데 칸을 4배(4d)로 넓혀요</li><li>두 줄 다 「정규화 → 계산 → 잔차로 더하기」 예요</li><li>층마다 가중치가 따로라서, 한 층의 가중치를 딕셔너리 하나에 담아요: <code>w["Wq"]</code> · <code>w["W1"]</code> …</li></ul>
<table class="kb"><tbody><tr><th>단계</th><th>모양 (T=5, d=8)</th></tr>
<tr><td>들어오는 x</td><td>(5, 8)</td></tr>
<tr><td><code>attention(layer_norm(x), w)</code></td><td>(5, 8) → 비율 (5, 5) → (5, 8)</td></tr>
<tr><td><code>mlp(layer_norm(x), w)</code></td><td>(5, 8) → (5, 32) → (5, 8)</td></tr>
<tr><td>나가는 x</td><td>(5, 8) — 들어온 모양 그대로</td></tr></tbody></table>
<p>나가는 모양이 들어온 모양과 같아서, 블록을 <b>몇 층이든</b> 이어 쌓을 수 있어요. 진짜 GPT 는 tanh 대신 비슷하게 생긴 GELU 를 쓰고, 머리 여러 개 · 출력 가중치(Wo)도 있지만 뼈대는 같아요.</p>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def layer_norm(x):
    mu = x.mean(axis=-1, keepdims=True)
    var = x.var(axis=-1, keepdims=True)
    return (x - mu) / np.sqrt(var + 1e-5)

def attention(x, w):
    T = len(x)
    q = x @ w["Wq"]
    k = x @ w["Wk"]
    v = x @ w["Wv"]
    scores = q @ k.T / np.sqrt(k.shape[-1])
    mask = np.triu(np.ones((T, T), dtype=bool), k=1)
    scores[mask] = -np.inf
    return softmax(scores) @ v

def mlp(x, w):
    h = np.tanh(x @ w["W1"])
    return h @ w["W2"]

def block(x, w):
    x = x + attention(layer_norm(x), w)
    x = x + mlp(layer_norm(x), w)
    return x

T, d = 5, 8
rng = np.random.default_rng(0)
w = {
    "Wq": rng.normal(0, d ** -0.5, (d, d)),
    "Wk": rng.normal(0, d ** -0.5, (d, d)),
    "Wv": rng.normal(0, d ** -0.5, (d, d)),
    "W1": rng.normal(0, d ** -0.5, (d, 4 * d)),
    "W2": rng.normal(0, (4 * d) ** -0.5, (4 * d, d)),
}
for name, W in w.items():
    print(name, W.shape)

x = rng.normal(0, 1, (T, d))
y = block(x, w)
print("블록:", x.shape, "→", y.shape)
y2 = block(y, w)
print("한 번 더:", y.shape, "→", y2.shape)` } },
    { title: 'layer_norm(x) @ Wout · 쌓기 = GPT', html: `<p>이제 전부 이어요. 글자 번호가 들어가서 <b>자리마다 다음 글자 확률</b>이 나와요.</p>
<pre>def forward(ids):
    T = len(ids)
    x = E[ids] + P[:T]          # (T, d)
    for w in layers:            # 블록을 층 수만큼
        x = block(x, w)         # (T, d) → (T, d)
    x = layer_norm(x)
    logits = x @ Wout           # (T, d) @ (d, V) → (T, V)
    return softmax(logits)      # 줄 t = 자리 t 다음 글자 확률</pre>
<ul><li>한 번 순전파로 <b>T 개의 문제</b>를 한꺼번에 풀어요. 줄 0 은 「첫 글자 다음」, 줄 1 은 「두 글자 다음」 …</li><li>마스크 덕에 줄 t 는 0 ~ t 자리만 봐서 반칙이 없어요. 그래서 학습할 때도 T 개를 동시에 맞혀 볼 수 있어요</li><li>확률이 큰 글자 몇 개를 보려면 <code>np.argsort(-p)[:3]</code> — 마이너스를 붙여서 <b>큰 것부터</b> 줄 세운 번호의 앞 3개예요(예제는 1등만 찍어요)</li><li>마지막 줄(자리 T-1)의 확률에서 뽑아([[레슨:N3]]) 글 뒤에 붙이고 다시 넣으면 글이 이어져요 — GPT 가 글을 쓰는 방법이에요</li></ul>
<p>이렇게 블록을 쌓은 모델이 [[트랜스포머]]이고, GPT 가 이 구조예요. 크기만 달라요.</p>
<table class="kb"><tbody><tr><th></th><th>이 교과서</th><th>GPT-2 가장 작은 것</th></tr>
<tr><td>층(블록) 수</td><td>2</td><td>12</td></tr><tr><td>벡터 칸 수 d</td><td>8 ~ 16</td><td>768</td></tr><tr><td>머리 수</td><td>1</td><td>12</td></tr><tr><td>문맥 길이 T_MAX</td><td>8</td><td>1024</td></tr><tr><td>어휘 V</td><td>글자 수십 ~ 130</td><td>50257 토큰</td></tr><tr><td>가중치 수</td><td>수천</td><td>약 1억 2천만</td></tr></tbody></table>
<div class="bk-warn"><b>순전파만 만들어요</b> — 가중치가 무작위라 확률이 엉뚱해요. 이 구조가 「어떻게 자리마다 앞을 보며 확률을 내는지」 를 보는 거예요. 학습은 [[레슨:N9]] 의 역전파 규칙을 층마다 적용하는 같은 고리인데, 손으로 쓰기엔 너무 길어서 실제로는 PyTorch 같은 자동 미분 도구가 해요. 이 교과서는 챕터 4 에서 문맥 MLP 로 학습 고리를 끝까지 만들어요([[레슨:N13]] · [[레슨:N14]]).</div>`,
      example: { code: `import numpy as np

def softmax(z):
    z = z - z.max(axis=-1, keepdims=True)
    e = np.exp(z)
    return e / e.sum(axis=-1, keepdims=True)

def layer_norm(x):
    mu = x.mean(axis=-1, keepdims=True)
    var = x.var(axis=-1, keepdims=True)
    return (x - mu) / np.sqrt(var + 1e-5)

def attention(x, w):
    T = len(x)
    q = x @ w["Wq"]
    k = x @ w["Wk"]
    v = x @ w["Wv"]
    scores = q @ k.T / np.sqrt(k.shape[-1])
    mask = np.triu(np.ones((T, T), dtype=bool), k=1)
    scores[mask] = -np.inf
    return softmax(scores) @ v

def mlp(x, w):
    h = np.tanh(x @ w["W1"])
    return h @ w["W2"]

def block(x, w):
    x = x + attention(layer_norm(x), w)
    x = x + mlp(layer_norm(x), w)
    return x

text = "나는 밥을 먹는다. 나는 물을 마신다."
chars = sorted(set(text))
stoi = {ch: i for i, ch in enumerate(chars)}
itos = {i: ch for ch, i in stoi.items()}
V = len(chars)

d, T_MAX = 8, 8
rng = np.random.default_rng(0)
E = rng.normal(0, 1, (V, d))
P = rng.normal(0, 1, (T_MAX, d))

def make_layer():
    return {
        "Wq": rng.normal(0, d ** -0.5, (d, d)),
        "Wk": rng.normal(0, d ** -0.5, (d, d)),
        "Wv": rng.normal(0, d ** -0.5, (d, d)),
        "W1": rng.normal(0, d ** -0.5, (d, 4 * d)),
        "W2": rng.normal(0, (4 * d) ** -0.5, (4 * d, d)),
    }

layers = [make_layer(), make_layer()]
Wout = rng.normal(0, d ** -0.5, (d, V))

def forward(ids):
    T = len(ids)
    x = E[ids] + P[:T]
    for w in layers:
        x = block(x, w)
    x = layer_norm(x)
    logits = x @ Wout
    return softmax(logits)

ids = [stoi[ch] for ch in "나는 밥을"]
probs = forward(ids)
print("어휘", V, "· 넣은 글자", len(ids), "→ 확률", probs.shape)
for t in range(len(ids)):
    best = int(probs[t].argmax())
    seen = "".join(itos[i] for i in ids[:t + 1])
    print(repr(seen), "다음 →", repr(itos[best]), f"{probs[t, best]:.3f}")` } },
  ],
  summary: ['위치 임베딩 P[:T] 를 더해 순서를 알린다', '블록 = x + 어텐션(정규화(x)) → x + MLP(정규화(x)), 모양은 (T, d) 그대로', '블록을 쌓고 @ Wout 하면 자리마다 다음 글자 확률 — GPT 의 뼈대'] },
{ id: 'NB3', ch: 3, boss: true, title: '만들어 보기: 미니 트랜스포머 순전파', mode: 'text',
  tutorSummary: '챕터 3 묶기 — data.txt 로 어휘(V = 130), rng = np.random.default_rng(0) 로 정해진 순서대로 가중치(E (V, 16) · P (8, 16) · 층마다 Wq · Wk · Wv (16, 16) · W1 (16, 64) · W2 (64, 16) 2층 · Wout (16, V)), 문장 「고양이는 밥을」(7글자)을 넣어 위치 임베딩 → 블록 2층(x + 어텐션(정규화) · x + MLP(정규화)) → 정규화 → @ Wout → softmax 로 자리마다 다음 글자 확률 상위 3개(np.argsort(-p)[:3]). 학습 안 한 무작위 가중치라 예측은 엉뚱 — 구조가 도는지 본다. 마스크 확인: 뒤 글자(밥 → 물)를 바꾸면 앞 자리 0~4 의 확률은 그대로(np.allclose), 바꾼 자리부터만 달라진다. 마스크를 빼면 앞 자리도 달라진다 = 미래를 엿봄.', pages: [], summary: [] },
{ id: 'N13', ch: 4, n: 13, title: '학습 고리 만들기', mode: 'text',
  tutorSummary: '글(번호 목록)을 앞 90% 학습 · 뒤 10% 검증으로 나눈다(섞지 않고 뒤를 뗀다). 검증은 갱신에 안 쓰고 손실만 잰다 — 처음 보는 글을 얼마나 맞히나. 배치 = rng.integers 로 학습 짝 몇 개만 뽑아 한 걸음. 학습 고리: 배치 뽑기 → 순전파(softmax(W[x])) → 손실 → 역전파(probs - onehot, np.add.at) → 갱신(W -= lr * dW) → 반복, 가끔 학습 · 검증 손실을 찍는다. 학습 손실은 계속 내려가도 검증 손실이 다시 오르면 과적합(외우기) — 검증 손실이 가장 낮던 매개변수를 W.copy() 로 챙겨 두고 거기서 멈춘다(조기 종료). 손잡이: 학습률 · 걸음 수 · 배치 크기 · 모델 크기.',
  terms: { '검증 데이터': '학습(갱신)에는 쓰지 않고 남겨 둔 글. 모델이 처음 보는 글을 얼마나 잘 맞히는지 재는 시험지', '배치': '한 걸음에 쓰는 학습 예 묶음. 전체 대신 몇 개만 무작위로 뽑아 빨리, 자주 갱신한다', '과적합': '학습 글을 외워서 학습 손실은 계속 내려가는데 처음 보는 글(검증)의 손실은 오히려 오르는 것' },
  pages: [
    { title: 'data[:n] · data[n:] · 학습과 검증', html: `<p>지금까지는 손실을 <b>학습한 그 글로</b> 쟀어요. 그런데 시험 문제를 미리 보고 외우면 점수는 높아도 진짜 실력은 모르죠. 모델도 같아요. 본 글을 외우기만 해도 학습 손실은 내려가요.</p>\n<p>그래서 글을 둘로 나눠요. 앞부분으로만 배우고, 뒷부분은 <b>시험지</b>로 남겨 둬요. 이 시험지가 [[검증 데이터]]예요.</p>\n<table class="kb"><tbody><tr><th>코드</th><th>쓰임</th></tr><tr><td><code>n = int(len(data) * 0.9)</code></td><td>나누는 자리 — 전체 길이의 90%</td></tr><tr><td><code>train = data[:n]</code></td><td>학습 — 기울기를 구하고 갱신하는 데 써요</td></tr><tr><td><code>val = data[n:]</code></td><td>검증 — 갱신에는 안 쓰고 손실만 재요</td></tr></tbody></table>\n<p>검증 글은 모델이 한 번도 못 본 글이에요. 그래서 검증 손실이 낮으면 「처음 보는 글도 잘 맞힌다」 는 뜻이에요. 예제는 짧은 글 107글자를 96 · 11 로 나눠요.</p>\n<div class="bk-warn"><b>섞지 말고 뒤를 떼요</b> — 글자를 무작위로 섞어서 나누면 같은 문장의 앞뒤가 양쪽에 들어가서 시험지가 새요. 이 교과서는 늘 <b>앞 90% 학습 · 뒤 10% 검증</b>이에요.</div>`,
      example: { code: `text = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\n\ndata = [stoi[ch] for ch in text]   # 글 전체를 번호로\nn = int(len(data) * 0.9)           # 앞 90% 가 학습\ntrain = data[:n]\nval = data[n:]                     # 뒤 10% 는 검증 — 학습에 안 써요\n\nprint("어휘", V, "전체", len(data), "학습", len(train), "검증", len(val))\nprint("검증 글:", "".join(itos[i] for i in val))` } },
    { title: 'rng.integers(…) · 배치 뽑기', html: `<p>[[레슨:N8]] 에서는 학습 글의 짝을 <b>전부</b> 써서 한 걸음을 갔어요. 글이 짧으면 괜찮지만, 큰 모델의 글은 수천억 토큰이라 한 걸음에 다 못 써요.</p>\n<p>그래서 한 걸음마다 짝을 <b>몇 개만 무작위로</b> 뽑아요. 이 묶음이 [[배치]]예요.</p>\n<pre>rng = np.random.default_rng(0)\nidx = rng.integers(0, len(xs), size=6)   # 0 ~ len(xs)-1 에서 자리 6개\nx, y = xs[idx], ys[idx]                   # 그 자리의 앞 글자 · 다음 글자</pre>\n<table class="kb"><tbody><tr><th></th><th>전체 한 번에</th><th>배치</th></tr><tr><td><b>기울기</b></td><td>정확해요</td><td>조금 흔들려요(뽑을 때마다 달라서)</td></tr><tr><td><b>한 걸음</b></td><td>느려요</td><td>빨라요 — 같은 시간에 훨씬 많이 걸어요</td></tr><tr><td><b>큰 모델</b></td><td>불가능</td><td>늘 이렇게 해요</td></tr></tbody></table>\n<p><code>xs[idx]</code> 처럼 numpy 배열에 <b>번호 목록</b>을 넣으면 그 자리들만 한 번에 꺼내요. seed 를 0 으로 고정해서 늘 같은 자리가 뽑혀요 — 진짜 학습에서는 seed 를 안 정해도 돼요.</p>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\ndata = [stoi[ch] for ch in text]\nn = int(len(data) * 0.9)\ntrain = data[:n]\n\nxs = np.array(train[:-1])   # 앞 글자\nys = np.array(train[1:])    # 그다음 글자(정답)\nprint("학습 짝", len(xs))\n\nrng = np.random.default_rng(0)\nidx = rng.integers(0, len(xs), size=6)   # 0 ~ len(xs)-1 에서 6개\nprint(idx)\nfor i in idx:\n    print(repr(itos[int(xs[i])]), "→", repr(itos[int(ys[i])]))\nx, y = xs[idx], ys[idx]                   # 배치 하나\nprint(x.shape, y.shape)` } },
    { title: '순전파 → 손실 → 역전파 → 갱신', html: `<p>배치까지 있으면 학습 고리가 다 모였어요. 한 걸음은 늘 이 다섯 단계예요.</p>\n<table class="kb"><tbody><tr><th>단계</th><th>코드</th></tr><tr><td>① 배치 뽑기</td><td><code>idx = rng.integers(0, len(xs), size=16)</code></td></tr><tr><td>② 순전파</td><td><code>probs = softmax(W[x])</code></td></tr><tr><td>③ 손실</td><td><code>-np.log(probs[np.arange(16), y]).mean()</code></td></tr><tr><td>④ 역전파</td><td><code>g = probs - onehot</code> → <code>np.add.at(dW, x, g / 16)</code></td></tr><tr><td>⑤ 갱신</td><td><code>W -= lr * dW</code></td></tr></tbody></table>\n<p>모델은 [[레슨:N8]] 의 신경망 바이그램(표 <code>W</code> 한 장)이에요. ④ 의 <code>np.add.at(dW, x, g / 16)</code> 은 「<code>dW</code> 의 <code>x</code> 번째 줄마다 <code>g</code> 를 <b>더하기</b>」 예요. 배치에 같은 글자가 두 번 뽑히면 그 줄에 기울기를 두 번 더해야 해서, 그냥 <code>dW[x] = …</code> 대신 이걸 써요.</p>\n<p>표에는 배치 손실 대신 <b>학습 글 전체 · 검증 글 전체</b>로 다시 잰 손실을 20걸음마다 찍어요. 배치 손실은 뽑을 때마다 흔들려서 보기 어렵거든요.</p>\n<table class="kb"><tbody><tr><th>걸음</th><th>학습 손실</th><th>검증 손실</th></tr><tr><td>0</td><td>3.537</td><td>3.562</td></tr><tr><td>20</td><td>2.652</td><td>3.172</td></tr><tr><td>40</td><td>2.089</td><td>2.968</td></tr><tr><td>60</td><td>1.731</td><td>2.890</td></tr><tr><td>80</td><td>1.482</td><td>2.907</td></tr><tr><td>100</td><td>1.320</td><td>2.933</td></tr></tbody></table>\n<p>둘 다 내려가다가, 검증 손실은 60걸음쯤부터 멈칫해요. 다음 쪽에서 더 오래 돌려 봐요.</p>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nn = int(len(data) * 0.9)\ntrain, val = data[:n], data[n:]\nxs, ys = np.array(train[:-1]), np.array(train[1:])\nvx, vy = np.array(val[:-1]), np.array(val[1:])\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ndef loss_of(W, x, y):\n    probs = softmax(W[x])\n    return -np.log(probs[np.arange(len(y)), y]).mean()\n\nrng = np.random.default_rng(0)\nW = np.zeros((V, V))   # 신경망 바이그램: 표 W 한 장\nlr = 2.0\nfor step in range(101):\n    idx = rng.integers(0, len(xs), size=16)   # ① 배치 뽑기\n    x, y = xs[idx], ys[idx]\n    probs = softmax(W[x])                     # ② 순전파\n    loss = -np.log(probs[np.arange(16), y]).mean()   # ③ 손실\n    g = probs.copy()                          # ④ 역전파: probs - onehot\n    g[np.arange(16), y] -= 1\n    dW = np.zeros_like(W)\n    np.add.at(dW, x, g / 16)\n    W -= lr * dW                              # ⑤ 갱신\n    if step % 20 == 0:\n        print(step, f"{loss_of(W, xs, ys):.3f}", f"{loss_of(W, vx, vy):.3f}")` } },
    { title: '검증 손실이 오르면 과적합', html: `<p>같은 학습을 400걸음까지 돌리면 이렇게 돼요.</p>\n<table class="kb"><tbody><tr><th>걸음</th><th>학습 손실</th><th>검증 손실</th></tr><tr><td>0</td><td>3.537</td><td>3.562</td></tr><tr><td>50</td><td>1.896</td><td>2.905</td></tr><tr><td>100</td><td>1.320</td><td>2.933</td></tr><tr><td>150</td><td>1.072</td><td>3.026</td></tr><tr><td>200</td><td>0.971</td><td>3.081</td></tr><tr><td>250</td><td>0.913</td><td>3.136</td></tr><tr><td>300</td><td>0.871</td><td>3.187</td></tr><tr><td>350</td><td>0.857</td><td>3.248</td></tr><tr><td>400</td><td>0.840</td><td>3.293</td></tr></tbody></table>\n<p>학습 손실은 끝까지 내려가는데, 검증 손실은 60걸음쯤에서 가장 낮고 그 뒤로 <b>올라가요</b>. 모델이 「다음 글자를 맞히는 법」 이 아니라 <b>학습 글 자체를 외우기</b> 시작한 거예요. 이게 [[과적합]]이에요.</p>\n<p>그래서 걸을 때마다 검증 손실을 재고, 가장 낮았던 때의 <code>W</code> 를 챙겨 둬요(조기 종료).</p>\n<pre>if v &lt; best:\n    best, best_step, best_W = v, step, W.copy()</pre>\n<div class="bk-warn"><b>W.copy() 를 꼭</b> — <code>best_W = W</code> 만 쓰면 같은 배열을 가리키는 이름이 하나 더 생길 뿐이라, <code>W</code> 가 바뀌면 <code>best_W</code> 도 같이 바뀌어요.</div>\n<p>학습 고리에는 사람이 정하는 손잡이가 넷 있어요.</p>\n<table class="kb"><tbody><tr><th>손잡이</th><th>크면</th><th>작으면</th></tr><tr><td><b>학습률</b> <code>lr</code></td><td>빨리 내려가지만 튀거나 nan</td><td>안전하지만 느려요</td></tr><tr><td><b>걸음 수</b></td><td>외우기(과적합)</td><td>덜 배워요</td></tr><tr><td><b>배치 크기</b></td><td>기울기가 고르고 한 걸음이 느려요</td><td>흔들리지만 빨라요</td></tr><tr><td><b>모델 크기</b></td><td>더 많이 배울 수 있지만 글이 적으면 금방 외워요</td><td>금방 한계</td></tr></tbody></table>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nn = int(len(data) * 0.9)\ntrain, val = data[:n], data[n:]\nxs, ys = np.array(train[:-1]), np.array(train[1:])\nvx, vy = np.array(val[:-1]), np.array(val[1:])\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ndef loss_of(W, x, y):\n    probs = softmax(W[x])\n    return -np.log(probs[np.arange(len(y)), y]).mean()\n\nrng = np.random.default_rng(0)\nW = np.zeros((V, V))\nlr = 2.0\nbest, best_step, best_W = 99.0, 0, W.copy()\nfor step in range(401):\n    idx = rng.integers(0, len(xs), size=16)\n    x, y = xs[idx], ys[idx]\n    g = softmax(W[x])\n    g[np.arange(16), y] -= 1\n    dW = np.zeros_like(W)\n    np.add.at(dW, x, g / 16)\n    W -= lr * dW\n    v = loss_of(W, vx, vy)\n    if v < best:                 # 검증 손실이 가장 낮았던 W 를 챙겨 둬요\n        best, best_step, best_W = v, step, W.copy()\n    if step % 50 == 0:\n        print(step, f"{loss_of(W, xs, ys):.3f}", f"{v:.3f}")\nprint("가장 낮은 검증 손실", f"{best:.3f}", "걸음", best_step)` } },
  ],
  summary: ['앞 90% 로 배우고 뒤 10% 로 시험', '배치 → 순전파 → 손실 → 역전파 → 갱신을 되풀이', '검증 손실이 오르면 외우는 중 — 가장 낮던 때를 챙긴다'] },
{ id: 'N14', ch: 4, n: 14, title: '문맥 MLP 언어 모델 학습', mode: 'text',
  tutorSummary: '레슨 N9 의 문맥 MLP 를 학습까지. X(B,3) → E[X] (B,3,d) → reshape (B,3d) → tanh(@W1+b1) h (B,H) → @W2+b2 로짓 (B,V) → softmax → 손실. 첫 손실은 log(V) 근처. 역전파를 numpy 로 손수: dlogits = (probs - onehot)/B, dW2 = h.T @ dlogits, db2 = 합, dh = dlogits @ W2.T, dpre = dh * (1 - h**2), dW1 = emb.T @ dpre, db1 = 합, demb = dpre @ W1.T, np.add.at(dE, X, …). 규칙: y = a @ W 면 dW = a.T @ dy, da = dy @ W.T. 기울기 모양 = 매개변수 모양. 기울기 검사: 칸 몇 개를 ±ε 바꿔 잰 수치 기울기와 비교, 차이 < 1e-6. 고장 난 층 아래가 다 틀린다. 학습 후 같은 검증 정답을 세기 바이그램(α 0.1, 검증 짝마다)과 비교 — data.txt 에서 3.492 → 2.816. 크기 · 초기값은 N9 와 같게(d 8 · H 32, E 1 · W1 0.2 · W2 0.1, 편향 0).',
  terms: { '역전파': '손실에서 출발해 층을 거꾸로 지나며 각 매개변수의 기울기를 구하는 방법. 층마다 「위에서 내려온 기울기 × 이 층의 미분」 을 한다', '기울기 검사': '역전파로 구한 기울기가 맞는지, 숫자를 조금 바꿔 보고 잰 수치 기울기와 비교해 확인하는 것', '매개변수': '학습으로 바뀌는 숫자들. 이 모델에서는 E · W1 · b1 · W2 · b2' },
  pages: [
    { title: 'E[X].reshape(B, 3*d) · 3글자 → 다음', html: `<p>[[레슨:N9]] 에서 순전파까지 만든 문맥 MLP 를 이제 <b>학습</b>시켜요. 모델이 하는 일은 「앞 3글자를 보고 다음 글자 맞히기」 예요. 바이그램은 앞 <b>1</b>글자만 봤죠.</p>\n<table class="kb"><tbody><tr><th>단계</th><th>코드</th><th>모양</th></tr><tr><td>문맥</td><td><code>X</code></td><td>(B, 3)</td></tr><tr><td>임베딩 꺼내기</td><td><code>E[X]</code></td><td>(B, 3, d)</td></tr><tr><td>옆으로 이어 붙이기</td><td><code>emb = E[X].reshape(B, C * d)</code></td><td>(B, 24)</td></tr><tr><td>은닉층</td><td><code>h = np.tanh(emb @ W1 + b1)</code></td><td>(B, 32)</td></tr><tr><td>점수(로짓)</td><td><code>logits = h @ W2 + b2</code></td><td>(B, V)</td></tr><tr><td>확률 · 손실</td><td><code>softmax</code> → <code>-np.log(…).mean()</code></td><td>(B, V) → 숫자 하나</td></tr></tbody></table>\n<p>B 는 예의 개수, C = 3 은 문맥 길이, d = 8 은 임베딩 크기, H = 32 는 은닉층 크기예요. 학습으로 바뀌는 [[매개변수]]는 <code>E</code> · <code>W1</code> · <code>b1</code> · <code>W2</code> · <code>b2</code> 다섯 개예요.</p>\n<p>처음 손실을 보면 학습 전 상태를 알 수 있어요. 아무것도 모르는 모델은 모든 글자에 같은 확률 1/V 를 줘서 손실이 <code>log(V)</code> 예요. 초기값은 [[레슨:N9]] 와 같아요 — <code>E</code> 는 표준편차 1, <code>W1</code> 은 0.2, <code>W2</code> 는 0.1 로 작게, 편향은 0. <code>W2</code> 가 작아서 첫 손실이 그 근처예요.</p>\n<pre>'오늘은' → ' '\nX (104, 3) emb (104, 24) h (104, 32) probs (104, 36)\n첫 손실 3.692 · 아무것도 모를 때 log(V) = 3.584</pre>\n<p class="muted small">문맥은 [[레슨:N9]] 처럼 3글자 창을 한 칸씩 밀며 만들어요: <code>X = [data[i:i + 3] …]</code>, <code>Y = [data[i + 3] …]</code>.</p>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nitos = {i: ch for ch, i in stoi.items()}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\n\nC, d, H = 3, 8, 32          # 문맥 3글자 · 임베딩 8 · 은닉 32\nX = np.array([data[i:i + C] for i in range(len(data) - C)])   # 앞 3글자\nY = np.array([data[i + C] for i in range(len(data) - C)])         # 다음 글자\nprint(repr("".join(itos[int(i)] for i in X[0])), "→", repr(itos[int(Y[0])]))\n\nrng = np.random.default_rng(0)\nE = rng.normal(0, 1, (V, d))\nW1 = rng.normal(0, 0.2, (C * d, H))\nb1 = np.zeros(H)\nW2 = rng.normal(0, 0.1, (H, V))\nb2 = np.zeros(V)\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\nB = len(X)\nemb = E[X].reshape(B, C * d)   # 3글자 임베딩을 옆으로 이어 붙이기\nh = np.tanh(emb @ W1 + b1)     # 은닉층\nlogits = h @ W2 + b2           # 다음 글자 점수\nprobs = softmax(logits)\nloss = -np.log(probs[np.arange(B), Y]).mean()\nprint("X", X.shape, "emb", emb.shape, "h", h.shape, "probs", probs.shape)\nprint("첫 손실", f"{loss:.3f}", "· 아무것도 모를 때 log(V) =", f"{np.log(V):.3f}")` } },
    { title: 'probs - onehot · 거꾸로 한 층씩', html: `<p>이제 [[역전파]]예요. 손실에서 출발해 순전파를 <b>거꾸로</b> 한 줄씩 지나요. 줄마다 쓰는 규칙은 넷뿐이에요.</p>\n<table class="kb"><tbody><tr><th>순전파</th><th>역전파</th></tr><tr><td><code>y = a @ W</code></td><td><code>dW = a.T @ dy</code> · <code>da = dy @ W.T</code></td></tr><tr><td><code>y = a + b</code> (모든 줄에 b)</td><td><code>db = dy.sum(axis=0)</code></td></tr><tr><td><code>h = np.tanh(z)</code></td><td><code>dz = dh * (1 - h ** 2)</code></td></tr><tr><td><code>E[X]</code> (줄 꺼내기)</td><td><code>np.add.at(dE, X, d)</code> (꺼낸 줄로 돌려보내 더하기)</td></tr></tbody></table>\n<p>맨 위는 [[레슨:N8]] 에서 본 <code>probs - onehot</code> 이에요. 손실을 B 개의 평균으로 냈으니 B 로 나눠요.</p>\n<pre>dlogits = probs.copy()\ndlogits[np.arange(B), Y] -= 1        # probs - onehot\ndlogits /= B\ndW2 = h.T @ dlogits                   # (H, V)\ndb2 = dlogits.sum(axis=0)             # (V,)\ndh = dlogits @ W2.T                   # (B, H)\ndpre = dh * (1 - h ** 2)              # tanh 의 미분\ndW1 = emb.T @ dpre                    # (C*d, H)\ndb1 = dpre.sum(axis=0)                # (H,)\ndemb = dpre @ W1.T                    # (B, C*d)\ndE = np.zeros_like(E)\nnp.add.at(dE, X, demb.reshape(B, C, d))</pre>\n<p>헷갈리면 <b>모양</b>을 보세요. 기울기는 언제나 그 매개변수와 모양이 같아요(<code>dW1</code> 은 <code>W1</code> 처럼 (24, 32)). 모양이 맞게 <code>.T</code> 를 붙이다 보면 식이 거의 저절로 나와요.</p>\n<p>예제는 기울기를 구하고 한 걸음 갱신(<code>p -= 0.5 * g</code>)해서 손실이 3.692 → 3.486 으로 내려가는 걸 보여 줘요.</p>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nC, d, H = 3, 8, 32\nX = np.array([data[i:i + C] for i in range(len(data) - C)])\nY = np.array([data[i + C] for i in range(len(data) - C)])\nB = len(X)\n\nrng = np.random.default_rng(0)\nE = rng.normal(0, 1, (V, d))\nW1 = rng.normal(0, 0.2, (C * d, H))\nb1 = np.zeros(H)\nW2 = rng.normal(0, 0.1, (H, V))\nb2 = np.zeros(V)\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ndef forward():\n    emb = E[X].reshape(B, C * d)\n    h = np.tanh(emb @ W1 + b1)\n    probs = softmax(h @ W2 + b2)\n    loss = -np.log(probs[np.arange(B), Y]).mean()\n    return emb, h, probs, loss\n\nemb, h, probs, loss = forward()\nprint("갱신 전", f"{loss:.3f}")\n\n# 역전파 — 손실에서 거꾸로 한 층씩\ndlogits = probs.copy()\ndlogits[np.arange(B), Y] -= 1        # probs - onehot\ndlogits /= B                          # 평균을 냈으니 B 로 나눠요\ndW2 = h.T @ dlogits                   # (H, V)\ndb2 = dlogits.sum(axis=0)             # (V,)\ndh = dlogits @ W2.T                   # (B, H)\ndpre = dh * (1 - h ** 2)              # tanh 의 미분 = 1 - tanh²\ndW1 = emb.T @ dpre                    # (C*d, H)\ndb1 = dpre.sum(axis=0)                # (H,)\ndemb = dpre @ W1.T                    # (B, C*d)\ndE = np.zeros_like(E)\nnp.add.at(dE, X, demb.reshape(B, C, d))   # 꺼내 쓴 줄로 돌려보내기\n\nfor name, p, g in [("E", E, dE), ("W1", W1, dW1), ("b1", b1, db1), ("W2", W2, dW2), ("b2", b2, db2)]:\n    print(name, p.shape, g.shape)\n    p -= 0.5 * g                      # 갱신: 기울기 반대로 조금\nprint("갱신 후", f"{forward()[3]:.3f}")` } },
    { title: '수치 기울기 vs 역전파 · 기울기 검사', html: `<p>역전파는 한 줄만 틀려도 학습이 이상해지는데, 에러는 안 나요. 그래서 [[기울기 검사]]를 해요. [[레슨:N7]] 의 수치 기울기 — 숫자 하나를 아주 조금 올리고 내려 손실 차이를 재는 것 — 와 비교해요.</p>\n<pre>old = p[i]\np[i] = old + eps\nup = loss_and_grads()[0]\np[i] = old - eps\ndown = loss_and_grads()[0]\np[i] = old                             # 꼭 되돌려 놓기\nnum = (up - down) / (2 * eps)          # 수치 기울기</pre>\n<p>수치 기울기는 느려요. 숫자 하나에 순전파를 두 번 해야 하니, 매개변수 수천 개를 다 재면 순전파가 수천 번이에요. 그래서 <b>칸 몇 개만</b> 골라서 재고, 역전파 값과의 가장 큰 차이가 아주 작은지(<code>&lt; 1e-6</code>) 봐요.</p>\n<pre>E 수치 0.003289 역전파 0.003289 같다 True\nW1 수치 0.007730 역전파 0.007730 같다 True\nb1 수치 0.007778 역전파 0.007778 같다 True\nW2 수치 -0.010288 역전파 -0.010288 같다 True\nb2 수치 0.009360 역전파 0.009360 같다 True</pre>\n<p>다섯 개가 다 <code>True</code> 면 역전파가 맞아요. 어딘가 틀리면 <b>틀린 줄 아래쪽 층</b>이 다 <code>False</code> 가 돼요. 예를 들어 <code>(1 - h ** 2)</code> 를 빠뜨리면 <code>W2</code> · <code>b2</code> 는 <code>True</code> 인데 <code>W1</code> · <code>b1</code> · <code>E</code> 가 <code>False</code> 예요.</p>\n<div class="bk-warn"><b>p[i] = old 로 되돌리기</b> — 바꾼 칸을 안 되돌리면 다음 칸을 잴 때 모델이 이미 달라져 있어서 비교가 엉망이 돼요.</div>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nC, d, H = 3, 8, 32\nX = np.array([data[i:i + C] for i in range(len(data) - C)])\nY = np.array([data[i + C] for i in range(len(data) - C)])\nB = len(X)\n\nrng = np.random.default_rng(0)\nE = rng.normal(0, 1, (V, d))\nW1 = rng.normal(0, 0.2, (C * d, H))\nb1 = rng.normal(0, 1, H) * 0.1\nW2 = rng.normal(0, 0.1, (H, V))\nb2 = rng.normal(0, 1, V) * 0.1\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\ndef loss_and_grads():\n    emb = E[X].reshape(B, C * d)\n    h = np.tanh(emb @ W1 + b1)\n    probs = softmax(h @ W2 + b2)\n    loss = -np.log(probs[np.arange(B), Y]).mean()\n    dlogits = probs.copy()\n    dlogits[np.arange(B), Y] -= 1\n    dlogits /= B\n    dh = dlogits @ W2.T\n    dpre = dh * (1 - h ** 2)\n    dE = np.zeros_like(E)\n    np.add.at(dE, X, (dpre @ W1.T).reshape(B, C, d))\n    grads = {"E": dE, "W1": emb.T @ dpre, "b1": dpre.sum(axis=0),\n             "W2": h.T @ dlogits, "b2": dlogits.sum(axis=0)}\n    return loss, grads\n\nloss, grads = loss_and_grads()\neps = 1e-5\nfor name, p in [("E", E), ("W1", W1), ("b1", b1), ("W2", W2), ("b2", b2)]:\n    worst = 0.0\n    for k in range(5):                         # 칸 5개를 골라 재 봐요\n        i = tuple(rng.integers(0, s) for s in p.shape)\n        old = p[i]\n        p[i] = old + eps\n        up = loss_and_grads()[0]\n        p[i] = old - eps\n        down = loss_and_grads()[0]\n        p[i] = old                             # 꼭 되돌려 놓기\n        num = (up - down) / (2 * eps)          # 수치로 잰 기울기\n        worst = max(worst, abs(num - grads[name][i]))\n    print(name, "수치", f"{num:.6f}", "역전파", f"{grads[name][i]:.6f}", "같다", bool(worst < 1e-6))` } },
    { title: 'for step in … · 바이그램과 겨루기', html: `<p>기울기가 맞으니 학습 고리([[레슨:N13]])에 넣고 돌려요. 이번엔 학습 글이 짧아서 배치 대신 <b>전체를 한 배치로</b> 써요.</p>\n<table class="kb"><tbody><tr><th>걸음</th><th>학습 손실</th><th>검증 손실</th></tr><tr><td>0</td><td>3.707</td><td>3.839</td></tr><tr><td>10</td><td>2.443</td><td>3.249</td></tr><tr><td>20</td><td>1.853</td><td>3.074</td></tr><tr><td>30</td><td>1.477</td><td>3.087</td></tr><tr><td>40</td><td>1.201</td><td>3.140</td></tr></tbody></table>\n<p>이제 [[레슨:N4]] 의 세기 바이그램과 겨뤄요. 챕터 1 과 같은 계산이에요 — 학습 부분에서 짝을 세고, 스무딩 <code>alpha = 0.1</code> 을 더해 확률로 바꾼 뒤, 검증 글의 (앞 글자, 다음 글자) 짝마다 손실을 재요.</p>\n<pre>P = (counts + alpha) / (counts.sum(axis=1, keepdims=True) + alpha * V)\nva = np.array(data[n:])\nbig = -np.log(P[va[:-1], va[1:]]).mean()</pre>\n<p class="muted small">문맥 MLP 는 검증 글 안에서 3글자 창을 만들어서 맨 앞 세 글자는 정답이 안 돼요. 그래서 맞히는 정답 수가 조금 달라요(data.txt 에서 82개 · 80개) — 평균이라 비교하는 데는 괜찮아요.</p>\n<p>검증 손실 — 바이그램 3.438 문맥 MLP 3.140 — 앞 3글자를 보는 모델이 처음 보는 글을 더 잘 맞혀요.</p>\n<p>다만 이 글은 160글자쯤이라 40걸음만 지나도 외우기 시작해요. data.txt 로 하면 차이가 더 분명해요(바이그램 3.492 → 문맥 MLP 2.816).</p>\n<p>다 배운 모델로 글을 지을 때도 같은 <code>forward</code> 를 써요. 마지막 3글자 <code>np.array([ctx[-C:]])</code> 를 넣어 확률을 내고, 1등 글자 <code>np.argmax(probs)</code> 를 붙이고, 또 마지막 3글자를 넣고… 를 되풀이해요. 온도를 쓰려면 [[레슨:N3]] 처럼 <code>softmax(logits[0] / T)</code> 를 만들어 <code>random.choices(range(V), weights=probs)</code> 로 뽑아요 — 만들어 보기 4 에서 해요.</p>`,
      example: { code: `import numpy as np\n\ntext = "오늘은 비가 온다. 비가 오면 우산을 쓴다. 우산을 쓰고 학교에 간다. 오늘은 해가 뜬다. 해가 뜨면 모자를 쓴다. 모자를 쓰고 공원에 간다. 공원에는 나무가 많다. 나무 아래에 의자가 있다. 의자에 앉아서 책을 읽는다. 책을 읽으면 시간이 빨리 간다."\nchars = sorted(set(text))\nstoi = {ch: i for i, ch in enumerate(chars)}\nV = len(chars)\ndata = [stoi[ch] for ch in text]\nn = int(len(data) * 0.9)\nC, d, H = 3, 8, 32\n\ndef make(ids):\n    X = np.array([ids[i:i + C] for i in range(len(ids) - C)])\n    Y = np.array([ids[i + C] for i in range(len(ids) - C)])\n    return X, Y\n\nXtr, Ytr = make(data[:n])\nXva, Yva = make(data[n:])\n\ndef softmax(z):\n    z = z - z.max(axis=-1, keepdims=True)\n    e = np.exp(z)\n    return e / e.sum(axis=-1, keepdims=True)\n\nrng = np.random.default_rng(0)\nE = rng.normal(0, 1, (V, d))\nW1 = rng.normal(0, 0.2, (C * d, H))\nb1 = np.zeros(H)\nW2 = rng.normal(0, 0.1, (H, V))\nb2 = np.zeros(V)\n\ndef forward(X):\n    emb = E[X].reshape(len(X), C * d)\n    h = np.tanh(emb @ W1 + b1)\n    return emb, h, softmax(h @ W2 + b2)\n\ndef loss_of(X, Y):\n    probs = forward(X)[2]\n    return -np.log(probs[np.arange(len(Y)), Y]).mean()\n\nB = len(Xtr)\nfor step in range(41):\n    emb, h, probs = forward(Xtr)               # 학습 글 전체를 한 배치로\n    dlogits = probs.copy()\n    dlogits[np.arange(B), Ytr] -= 1\n    dlogits /= B\n    dh = dlogits @ W2.T\n    dpre = dh * (1 - h ** 2)\n    dE = np.zeros_like(E)\n    np.add.at(dE, Xtr, (dpre @ W1.T).reshape(B, C, d))\n    for p, g in [(E, dE), (W1, emb.T @ dpre), (b1, dpre.sum(axis=0)), (W2, h.T @ dlogits), (b2, dlogits.sum(axis=0))]:\n        p -= 0.5 * g\n    if step % 10 == 0:\n        print(step, f"{loss_of(Xtr, Ytr):.3f}", f"{loss_of(Xva, Yva):.3f}")\n\nalpha = 0.1                                    # 세기 바이그램(스무딩 0.1)\ncounts = np.zeros((V, V))\nfor a, b in zip(data[:n], data[1:n]):\n    counts[a, b] += 1\nP = (counts + alpha) / (counts.sum(axis=1, keepdims=True) + alpha * V)\nva = np.array(data[n:])\nbig = -np.log(P[va[:-1], va[1:]]).mean()       # 검증 글의 (앞 글자, 다음 글자) 짝\nprint("검증 손실 — 바이그램", f"{big:.3f}", "문맥 MLP", f"{loss_of(Xva, Yva):.3f}")` } },
  ],
  summary: ['앞 3글자 임베딩을 이어 붙여 tanh 은닉층 → 다음 글자', '역전파는 a.T @ d · d @ W.T · 1 - h² · np.add.at', '기울기 검사로 확인하고 학습하면 바이그램보다 낮다'] },
{ id: 'N15', ch: 4, n: 15, title: '큰 LLM 은 이걸 얼마나 크게', mode: 'text',
  tutorSummary: '큰 LLM 도 같은 「다음 토큰 맞히기 + 교차 엔트로피 + 경사하강」. 크기 비교: 내 모델 6,130 개 · 821글자 · 문맥 3 / GPT-2 small 1억 2400만 · 문맥 1024 / GPT-3 1750억 · 토큰 3000억 · 문맥 2048. 매개변수 어림 = V·d + 문맥·d + 블록 수 × 12·d²(어텐션 4d² + MLP 8d²). 사전학습(많은 글로 다음 토큰) → 미세조정(원하는 말투 · 질문-답 글로 같은 학습) → RLHF(사람이 고른 더 나은 답 쪽으로). 지어내기(환각)는 다음 토큰 맞히기라서 — 확률은 늘 합이 1, 「모름」 칸이 없고 그럴듯한 조각을 이어 붙인다. 최신 정보는 학습 글 이후를 모른다. PyTorch 는 자동 미분(loss.backward())으로 손수 역전파를 대신하고, GPU 는 행렬 곱을 한꺼번에 빨리. 계산량 어림 6 × 매개변수 × 토큰.',
  terms: { '사전학습': '아주 많은 글로 「다음 토큰 맞히기」 를 학습하는 첫 단계. 이 교과서에서 한 학습을 아주 크게 한 것', '미세조정': '사전학습한 모델을 원하는 모양의 글(질문과 답, 말투 등)로 조금 더 학습시키는 것. 방법은 똑같다', 'RLHF': '사람의 피드백으로 하는 강화 학습. 사람이 두 답 중 더 나은 쪽을 고르면, 모델이 그런 답에 더 큰 확률을 주도록 고친다', '환각': '모델이 사실이 아닌 내용을 그럴듯하게 지어내는 것. 다음 토큰을 「그럴듯하게」 고를 뿐 사실인지 확인하지 않아서 생긴다' },
  pages: [
    { title: '매개변수 수 · 내 모델 vs GPT', html: `<p>여기까지 만든 모델과 ChatGPT 같은 큰 LLM 은 <b>하는 일이 같아요</b>. 다음 토큰의 확률을 내고, 교차 엔트로피 손실을 경사하강으로 줄여요. 다른 건 <b>크기</b>예요.</p>\n<table class="kb"><tbody><tr><th></th><th>내 모델(만들어 보기 4)</th><th>GPT-2 small (2019)</th><th>GPT-3 (2020)</th></tr><tr><td><b>매개변수</b></td><td>6,130 개</td><td>약 1억 2400만 개</td><td>약 1750억 개</td></tr><tr><td><b>학습 글</b></td><td>821 글자</td><td>웹 글 약 40GB</td><td>토큰 약 3000억 개</td></tr><tr><td><b>문맥</b></td><td>앞 3글자</td><td>1024 토큰</td><td>2048 토큰</td></tr><tr><td><b>층</b></td><td>은닉층 1개</td><td>트랜스포머 블록 12개</td><td>블록 96개</td></tr></tbody></table>\n<p>요즘 모델은 크기를 밝히지 않는 경우가 많아요. 공개된 것 중에는 매개변수가 수천억 개, 학습 토큰이 십조 개를 넘는 것도 있어요.</p>\n<p>GPT 의 매개변수는 어림으로 셀 수 있어요. 블록 하나([[레슨:N12]])에는 어텐션의 Wq · Wk · Wv · 출력이 d×d 넷(4·d²), MLP 가 d → 4d → d 라서 8·d², 합쳐 <b>12·d²</b> 개가 있어요. 여기에 토큰 · 위치 임베딩을 더해요.</p>\n<pre>block = 12 * d * d\ntotal = V * d + ctx * d + L * block</pre>\n<p>GPT-2 small 은 d = 768, 블록 12개로 124M(1억 2400만)이 나와요. 공개된 크기와 거의 같아요(편향 · 정규화는 작아서 뺐어요).</p>\n<p>내 모델은 조각마다 곱해서 더하면 돼요(<code>V * d</code> 는 <code>E</code> 의 숫자 개수). numpy 배열이 있으면 <code>p.size</code> 가 바로 그 개수예요 — 모양을 다 곱한 값이에요.</p>`,
      example: { code: `def mlp_params(V, C, d, H):          # 내 문맥 MLP(만들어 보기 4)\n    return V * d + C * d * H + H + H * V + V\n\ndef gpt_params(V, ctx, d, L):        # GPT 어림: 임베딩 + 블록 L 개\n    emb = V * d + ctx * d            # 토큰 임베딩 + 위치 임베딩\n    block = 12 * d * d               # 블록 하나: 어텐션 4·d² + MLP 8·d²\n    return emb + L * block\n\nmine = mlp_params(130, 3, 8, 32)\ngpt2 = gpt_params(50257, 1024, 768, 12)\ngpt3 = gpt_params(50257, 2048, 12288, 96)\nprint("내 모델", mine)\nprint("GPT-2 small", f"{gpt2 / 1e6:.0f}M")       # M = 백만\nprint("GPT-3", f"{gpt3 / 1e9:.0f}B")             # B = 십억\nprint("GPT-3 은 내 모델의", f"{gpt3 / mine / 1e4:.0f}만 배")` } },
    { title: '사전학습 → 미세조정 → RLHF', html: `<p>큰 LLM 은 보통 세 단계로 만들어요.</p>\n<table class="kb"><tbody><tr><th>단계</th><th>무엇으로</th><th>무엇을 배우나</th></tr><tr><td><b>[[사전학습]]</b></td><td>웹 · 책 · 코드 같은 아주 많은 글</td><td>다음 토큰 맞히기 — 이 교과서에서 한 그대로. 말투 · 사실 · 문법이 확률 속에 들어가요</td></tr><tr><td><b>[[미세조정]]</b></td><td>사람이 쓴 「질문 → 좋은 답」 글 수만 개</td><td>같은 다음 토큰 학습인데, 글이 질문-답 모양이라 대화하듯 답하게 돼요</td></tr><tr><td><b>[[RLHF]]</b></td><td>사람이 두 답 중 더 나은 쪽을 고른 기록</td><td>사람이 고른 쪽 답에 더 큰 확률을 주도록 고쳐요 — 더 친절하고 안전하게</td></tr></tbody></table>\n<p>미세조정은 새로운 방법이 아니라 <b>데이터만 바꾼</b> 학습이에요. 아래 예제는 세기 모델로 흉내 내요. 「~다」 로 끝나는 글로 센 다음, 「~요」 말투 글을 조금 더 세면 같은 시작에서 다른 말투가 나와요.</p>\n<pre>counts = count_pairs(pre)      # 사전학습\ncounts += count_pairs(tune)    # 미세조정: 원하는 말투의 글을 더</pre>\n<p>큰 모델도 마찬가지예요. 이미 배운 확률을 버리지 않고, 새 글 쪽으로 <b>조금</b> 옮겨요.</p>`,
      example: { code: `from collections import Counter\n\ndef count_pairs(text):\n    return Counter(zip(text, text[1:]))\n\ndef greedy(counts, start, length):\n    out = start\n    for _ in range(length):\n        nxt = [(c, b) for (a, b), c in counts.items() if a == out[-1]]\n        if not nxt:\n            break\n        out += max(nxt)[1]           # 가장 많이 본 다음 글자\n    return out\n\npre = "나는 밥을 먹고 학교에 간다. 동생은 밥을 먹는다. 우리는 밥을 먹고 이를 닦는다. "\ntune = "밥을 먹어요. 물을 마셔요. 책을 읽어요. " * 3\n\ncounts = count_pairs(pre)              # 사전학습: 많은 글로\nprint(greedy(counts, "밥을 먹", 4))\ncounts += count_pairs(tune)            # 미세조정: 원하는 말투의 글을 더\nprint(greedy(counts, "밥을 먹", 4))` } },
    { title: '지어내기 · 다음 글자 맞히기라서', html: `<p>LLM 이 그럴듯한 거짓말을 할 때가 있어요([[환각]]). 이상해 보이지만 「다음 글자 맞히기」 로 생각하면 당연해요.</p>\n<ul><li><b>「모름」 칸이 없어요.</b> softmax 가 내는 확률은 언제나 합이 1 이에요. 모르는 질문에도 가장 그럴듯한 다음 글자를 <b>골라야</b> 해요.</li><li><b>조각을 이어 붙여요.</b> 모델은 「사실인가」 가 아니라 「이 다음에 자주 오던 글자인가」 를 봐요. 따로 본 조각들이 이어지면 글에 없던 문장이 생겨요.</li></ul>\n<p>예제의 학습 글에는 고양이가 공원에 간다는 말이 <b>없어요</b>. 그런데 「고양이는 공」 다음은 「 공」 뒤에 가장 많이 온 「원」, 그다음은 「공원에 간다」 로 이어져요.</p>\n<pre>고양이는 공원에 간다.\n학습 글에 있던 말? False</pre>\n<p>문장은 매끄럽지만 사실인지는 아무도 확인하지 않았어요. 큰 모델도 규모만 클 뿐 같은 이유로 지어내요.</p>\n<table class="kb"><tbody><tr><th>잘하는 것</th><th>못하거나 조심할 것</th></tr><tr><td>글 다듬기 · 요약 · 번역 · 흔한 코드 패턴 — 많이 본 모양을 이어 쓰는 일</td><td>사실 확인(지어내기) · 학습 글 이후의 최신 정보 · 정확한 계산 · 글자 수 세기(토큰 단위로 봐서)</td></tr></tbody></table>\n<p class="muted small">그래서 요즘 서비스는 검색 결과를 문맥에 넣어 주거나 계산기 같은 도구를 쓰게 해요. 그래도 중요한 사실은 직접 확인해야 해요.</p>`,
      example: { code: `from collections import Counter\n\ntext = "고양이는 밥을 먹는다. 나는 공원에 간다. 친구도 공원에 간다. 동생은 공을 찬다."\ncounts = Counter((text[i:i + 2], text[i + 2]) for i in range(len(text) - 2))   # 앞 2글자 → 다음 글자\n\ndef next_probs(ctx):\n    nxt = {b: c for (a, b), c in counts.items() if a == ctx}\n    total = sum(nxt.values())\n    return {b: round(c / total, 2) for b, c in nxt.items()}\n\nprint(next_probs(" 공"))     # 「모름」 칸은 없어요 — 늘 무언가를 골라요\n\nout = "고양이는 공"\nfor _ in range(10):\n    p = next_probs(out[-2:])\n    out += max(p, key=p.get)          # 가장 그럴듯한 글자\n    if out[-1] == ".":\n        break\nprint(out)\nprint("학습 글에 있던 말?", out in text)` } },
    { title: 'PyTorch · GPU · 같은 계산을 빨리', html: `<p>[[레슨:N14]] 에서 손수 쓴 역전파 열두 줄은 큰 모델에서는 사람이 안 써요. <b>PyTorch</b> 같은 라이브러리가 순전파 계산을 기억해 뒀다가 <code>loss.backward()</code> 한 줄로 모든 기울기를 구해 줘요(자동 미분). 하는 계산은 우리가 쓴 것과 같아요.</p>\n<pre>import torch\nE = torch.randn(V, d, requires_grad=True)   # 기울기를 구할 매개변수\n...\nemb = E[X].reshape(B, C * d)\nh = torch.tanh(emb @ W1 + b1)\nloss = torch.nn.functional.cross_entropy(h @ W2 + b2, Y)\nloss.backward()                              # E.grad, W1.grad … 가 채워져요</pre>\n<p><b>GPU</b> 는 행렬 곱 <code>@</code> 처럼 같은 계산을 수천 개씩 <b>한꺼번에</b> 하는 칩이에요. 학습 계산량은 어림으로 <b>6 × 매개변수 × 토큰 수</b> 번이에요. 예제에서 어림해 보면 차이가 보여요.</p>\n<pre>내 모델 4.1e+09 번\nGPT-3 3.2e+23 번\n내 모델을 PC 로 0.4 초\nGPT-3 를 PC 로 100만 년\nGPT-3 를 GPU 1000개로 36 일</pre>\n<p class="muted small">PC · GPU 속도는 아주 거친 어림이에요. 큰 모델은 GPU 수천 개를 몇 주 동안 돌려서 학습해요. 이 교과서는 계산이 다 보이게 numpy 로만 했어요 — 원리는 같고, 크기와 속도만 달라요.</p>`,
      example: { code: `def train_flops(params, tokens):\n    return 6 * params * tokens       # 어림: 토큰 하나에 곱셈·덧셈 약 6 × 매개변수\n\nmine = train_flops(6130, 735 * 150)          # 735개 문맥 × 150걸음\ngpt3 = train_flops(175e9, 300e9)             # 매개변수 1750억 · 토큰 3000억\nprint("내 모델", f"{mine:.1e}", "번")\nprint("GPT-3", f"{gpt3:.1e}", "번")\n\ncpu = 1e10                                   # 어림: 내 PC 가 1초에 100억 번\ngpu = 1e14                                   # 어림: 큰 GPU 하나가 1초에 100조 번\nprint("내 모델을 PC 로", f"{mine / cpu:.1f}", "초")\nprint("GPT-3 를 PC 로", f"{gpt3 / cpu / 3600 / 24 / 365 / 1e4:.0f}만", "년")\nprint("GPT-3 를 GPU 1000개로", f"{gpt3 / (gpu * 1000) / 3600 / 24:.0f}", "일")` } },
  ],
  summary: ['큰 LLM 도 같은 다음 토큰 맞히기를 아주 크게', '사전학습 → 미세조정 → RLHF, 방법은 같고 글이 다르다', '지어내기는 「모름」 칸 없이 그럴듯한 걸 고르기 때문'] },
{ id: 'NB4', ch: 4, boss: true, title: '만들어 보기: 내 작은 언어 모델', mode: 'text',
  tutorSummary: '교과서 묶기 — data.txt 로 앞 3글자 문맥 MLP(d 8 · H 32 · tanh, N9 와 같은 초기값)를 학습(seed 0 · lr 1.0 · 150걸음 · 전체 배치), 25걸음마다 학습/검증 손실, 검증 손실이 가장 낮던 매개변수(52걸음 2.816)를 챙김, 세기 바이그램(α 0.1, 3.492)과 비교, 1등 고르기로 문장 짓기(가장 좋던 모델은 「나는 나는」 되풀이, 끝까지 학습한 모델은 외운 문장을 이어 붙임), 온도 0.5 · 1.5 로 뽑아 짓기. 「완벽하게가 아니라 이런 느낌으로 움직인다」.',
  pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
