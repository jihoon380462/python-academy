// courses/files/content.js — 「데이터 파일 다루기 교과서」 (v2.41.0, 사용자 「1」 → 설계 순서대로 만들기). 설계: specs/courses-python-next.md
// 교과서 모드. 연습은 내 PC 의 VS Code + 파이썬 + openpyxl. example.code = 파이썬(check_book 이 python3 로 실제 실행).
const COURSE = { id: 'files', name: '데이터 파일 다루기', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 JSON · 엑셀 같은 데이터 파일을 파이썬으로 다루는 법을 작은 코드로 직접 해 보며 가르치는 선생님이다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#6d4c41' },
  { ch: 1, name: 'JSON 깊게', color: '#4f6bed' },
  { ch: 2, name: '엑셀(openpyxl)', color: '#2ea043' },
  { ch: 3, name: '서로 바꾸기', color: '#d97706' },
];
const FILES_TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }]; // v2.41.0 뼈대 — draft:true 라 목차에 「준비 중」
const LESSONS = [
{ id: 'F0', ch: 0, n: 0, title: '데이터 파일 한눈에', mode: 'text', draft: true,
  tutorSummary: 'JSON · JSONL · CSV · 엑셀 · TOML · 준비',
  pages: FILES_TODO('JSON · JSONL · CSV · 엑셀 · TOML · 준비'), summary: ["JSON", "JSONL", "CSV"] },
{ id: 'F1', ch: 1, n: 1, title: 'JSON 다시 보기 · 깨진 JSON', mode: 'text', draft: true,
  tutorSummary: 'dumps · loads · JSONDecodeError',
  pages: FILES_TODO('dumps · loads · JSONDecodeError'), summary: ["dumps", "loads", "JSONDecodeError"] },
{ id: 'F2', ch: 1, n: 2, title: '중첩 구조에서 꺼내기', mode: 'text', draft: true,
  tutorSummary: '경로 · dig · match',
  pages: FILES_TODO('경로 · dig · match'), summary: ["경로", "dig", "match"] },
{ id: 'F3', ch: 1, n: 3, title: 'JSON 에 없는 값: 날짜 · 돈', mode: 'text', draft: true,
  tutorSummary: 'isoformat · 시간대 · Decimal',
  pages: FILES_TODO('isoformat · 시간대 · Decimal'), summary: ["isoformat", "시간대", "Decimal"] },
{ id: 'F4', ch: 1, n: 4, title: '내 클래스 저장 · 되살리기', mode: 'text',
  tutorSummary: "dataclass 객체는 json.dumps 에 바로 못 넣는다(TypeError: Object of type Order is not JSON serializable). dataclasses.asdict(o) 는 안쪽 dataclass · 리스트까지 딕셔너리로 바꾸지만 date · Decimal 은 그대로 둔다. 그래서 F3 의 default= 함수에 if is_dataclass(o): return asdict(o) 를 더하면 함수 하나로 안쪽 date · Decimal 까지 글자가 된다(모르는 값은 raise TypeError). 되살리기 Book(**d)(H15 의 Todo(**data))는 한 겹만 풀어서 안쪽 items 는 딕셔너리 리스트 그대로 — 중첩은 손으로 Order(items=[Item(**x) for x in d[\"items\"]]), 날짜는 date.fromisoformat. 모르는 키가 있으면 TypeError: Item.__init__() got an unexpected keyword argument 라 남이 주는 데이터는 쓸 키만 골라 넣는다. json.loads(s, object_hook=f) 의 f 는 딕셔너리를 하나 다 읽을 때마다(안쪽부터) 불리고 돌려준 값이 그 자리에 들어간다 — 꼬리표 {\"__type__\": \"date\", \"value\": \"2026-09-03\"} 를 보고 date 로, 아니면 return d(빼먹으면 None). 클래스 안에 to_dict 메서드와 @classmethod from_dict(cls, d) 짝을 두고 왕복 시험: text = json.dumps(o.to_dict()); assert Order.from_dict(json.loads(text)) == o. 저장 모양에 \"version\": 2 를 넣어 두면 칸이 늘어도 d.get(\"memo\", \"\") 처럼 옛 판을 가려 읽는다.",
  terms: { "왕복 시험": "객체 → JSON → 객체 로 한 바퀴 돌려, 되살린 것이 처음과 같은지 assert 로 확인하는 시험" },
  pages: [
    { title: "asdict(o) — 안쪽까지 딕셔너리로", html: `<p>복습: <a href="../python/#lesson/L15E" target="_blank" rel="noopener">파이썬 교과서 「클래스 4: 클래스 속성 · property · dataclass」 ↗</a> 의 <code>@dataclass</code> 는 칸만 적으면 <code>__init__</code> · <code>__repr__</code> · <code>==</code> 를 만들어 줘요. 그런데 이 객체를 <code>json.dumps</code> 에 바로 넣으면 멈춰요.</p><pre>json.dumps(order)\n# TypeError: Object of type Order is not JSON serializable</pre><p>JSON 은 딕셔너리 · 리스트 · 글자 · 숫자 · true/false · null 만 알아요. 그래서 먼저 딕셔너리로 바꿔요. <code>dataclasses.asdict(o)</code> 가 그 일을 해요.</p><pre>from dataclasses import dataclass, asdict\nimport json\n\n@dataclass\nclass Item:\n    title: str\n    qty: int\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list[Item]\n\ncart = Cart("하늘", [Item("소금빵", 2), Item("라테", 1)])\nd = asdict(cart)\nprint(d["items"][0])   # {'title': '소금빵', 'qty': 2}\nprint(json.dumps(d, ensure_ascii=False))   # {"owner": "하늘", "items": [{"title": "소금빵", "qty": 2}, {"title": "라테", "qty": 1}]}</pre><ul><li><b>안쪽까지</b> 바꿔요 — 칸에 다른 dataclass 나 그 리스트가 있어도 전부 딕셔너리 · 리스트가 돼요</li><li>돌려준 것은 새 딕셔너리라 고쳐도 원래 객체는 그대로예요</li><li>다만 <code>date</code> · <code>Decimal</code> 같은 값은 <b>그대로</b> 둬요. 그래서 아래 예제처럼 날짜 칸이 있으면, asdict 한 딕셔너리를 <code>json.dumps</code> 에 넣어도 멈춰요. 다음 쪽에서 받아요</li></ul>`,
      example: { code: `from dataclasses import dataclass, asdict\nfrom datetime import date\nimport json\n\n\n@dataclass\nclass Item:\n    title: str\n    price: int\n    qty: int\n\n\n@dataclass\nclass Order:\n    id: str\n    ordered_on: date\n    items: list[Item]\n\n\norder = Order("A-1001", date(2026, 9, 3), [Item("파이썬 첫걸음", 18000, 1), Item("엑셀 업무 노트", 12500, 2)])\n\ntry:\n    json.dumps(order)\nexcept TypeError as e:\n    print("그냥 넣으면:", e)\n\nd = asdict(order)\nprint(type(d).__name__, type(d["items"][0]).__name__)\nprint(d["items"][1])\nprint(d["ordered_on"])\nprint(repr(d["ordered_on"]))\n` } },
    { title: "default= 에서 is_dataclass(o)", html: `<p>복습: [[레슨:F3]] 에서 <code>json.dumps(data, default=to_json)</code> 으로 date · Decimal 을 글자로 바꿨어요. <code>default=</code> 함수는 json 이 <b>모르는 값을 만날 때마다</b> 불려요. 여기에 dataclass 도 넣으면 asdict 를 미리 부르지 않아도 돼요.</p><pre>from dataclasses import asdict, is_dataclass\nfrom datetime import date\nfrom decimal import Decimal\n\ndef to_json(o):\n    if is_dataclass(o):\n        return asdict(o)\n    if isinstance(o, date):\n        return o.isoformat()\n    if isinstance(o, Decimal):\n        return str(o)\n    raise TypeError(f"JSON 으로 못 바꿔요: {type(o).__name__}")</pre><ul><li><code>is_dataclass(o)</code> — dataclass 객체면 True 예요</li><li>asdict 가 돌려준 딕셔너리 안에 date · Decimal 이 남아 있으면, json 이 그 값마다 <code>to_json</code> 을 <b>다시</b> 불러요. 그래서 함수 하나로 몇 겹 안이든 다 돼요</li><li>모르는 값은 꼭 <code>raise TypeError</code> — 아무것도 안 돌려주면 None 이 돌아가서 <code>null</code> 로 몰래 저장돼요</li></ul>`,
      example: { code: `from dataclasses import dataclass, asdict, is_dataclass\nfrom datetime import date\nfrom decimal import Decimal\nimport json\n\n\ndef to_json(o):\n    if is_dataclass(o):\n        return asdict(o)\n    if isinstance(o, date):\n        return o.isoformat()\n    if isinstance(o, Decimal):\n        return str(o)\n    raise TypeError(f"JSON 으로 못 바꿔요: {type(o).__name__}")\n\n\n@dataclass\nclass Item:\n    title: str\n    price: Decimal\n    qty: int\n\n\n@dataclass\nclass Order:\n    id: str\n    ordered_on: date\n    items: list[Item]\n\n\norder = Order("A-1001", date(2026, 9, 3),\n              [Item("파이썬 첫걸음", Decimal("18000.00"), 1), Item("엑셀 업무 노트", Decimal("12500.00"), 2)])\ntext = json.dumps(order, default=to_json, ensure_ascii=False, indent=2)\nprint(text)\n\ntry:\n    json.dumps({"tags": {"신간", "할인"}}, default=to_json)\nexcept TypeError as e:\n    print("집합은:", e)\n` } },
    { title: "되살리기 Book(**d) · 중첩은 손으로", html: `<p>거꾸로, JSON 에서 읽은 딕셔너리를 객체로 되살려요. 키 이름이 칸 이름과 같으면 <code>Book(**d)</code> 한 줄이에요(복습: <a href="../api/#lesson/H15" target="_blank" rel="noopener">API 교과서 「내 SDK 만들기 2: 숨겨 주는 것들」 ↗</a> 의 <code>Todo(**data)</code>).</p><pre>from dataclasses import dataclass\nimport json\n\n@dataclass\nclass Book:\n    title: str\n    price: int\n\nd = json.loads('{"title": "파이썬 첫걸음", "price": 18000}')\nb = Book(**d)\nprint(b)   # Book(title='파이썬 첫걸음', price=18000)</pre><p>하지만 <code>**d</code> 는 <b>한 겹만</b> 풀어요. 안쪽 items 는 딕셔너리 리스트 그대로 들어가요. 에러가 안 나서 더 위험해요. <code>cart.items[0].title</code> 처럼 쓰는 순간에야 <code>AttributeError</code> 로 멈춰요.</p><pre>from dataclasses import dataclass\nimport json\n\n@dataclass\nclass Item:\n    title: str\n    qty: int\n\n@dataclass\nclass Cart:\n    owner: str\n    items: list[Item]\n\nd = json.loads('{"owner": "하늘", "items": [{"title": "라테", "qty": 1}]}')\nback = Cart(**d)\nprint(type(back.items[0]).__name__)   # dict</pre><p>그래서 중첩은 손으로 되살려요. 안쪽 것마다 <code>Item(**x)</code> 를 불러요. 날짜 글자도 여기서 <code>date.fromisoformat</code> 으로 돌려놔요.</p><pre>cart = Cart(owner=d["owner"], items=[Item(**x) for x in d["items"]])\nprint(type(cart.items[0]).__name__)   # Item</pre><div class="bk-warn"><b>모르는 키가 하나라도 있으면 멈춰요</b> — API 가 칸을 하나 더 보내면 <code>Item(**x)</code> 는 <code>TypeError: Item.__init__() got an unexpected keyword argument</code> 예요. 남이 주는 데이터는 <code>Item(title=x["title"], price=x["price"], qty=x["qty"])</code> 처럼 <b>쓸 키만 골라</b> 넣어요.</div>`,
      example: { code: `from dataclasses import dataclass, asdict\nfrom datetime import date\nimport json\n\n\n@dataclass\nclass Item:\n    title: str\n    price: int\n    qty: int\n\n\n@dataclass\nclass Order:\n    id: str\n    ordered_on: date\n    items: list[Item]\n\n\ntext = """{"id": "A-1001", "ordered_on": "2026-09-03",\n "items": [{"title": "파이썬 첫걸음", "price": 18000, "qty": 1},\n           {"title": "엑셀 업무 노트", "price": 12500, "qty": 2}]}"""\nd = json.loads(text)\n\nlazy = Order(**d)\nprint("한 겹만:", type(lazy.ordered_on).__name__, type(lazy.items[0]).__name__)\n\norder = Order(\n    id=d["id"],\n    ordered_on=date.fromisoformat(d["ordered_on"]),\n    items=[Item(**x) for x in d["items"]],\n)\nprint("손으로:", type(order.ordered_on).__name__, type(order.items[0]).__name__)\nprint(order.items[1])\nprint(order.ordered_on.strftime("%m월 %d일"))\n\nextra = {"title": "하루 10분 SQL", "price": 15800, "qty": 1, "discount": 1000}\ntry:\n    Item(**extra)\nexcept TypeError as e:\n    print("모르는 키:", e)\nsafe = Item(title=extra["title"], price=extra["price"], qty=extra["qty"])\nprint(safe)\n` } },
    { title: "object_hook= — 딕셔너리마다 불리는 함수", html: `<p><code>json.loads(s, object_hook=함수)</code> 를 주면, json 이 <b>딕셔너리를 하나 다 읽을 때마다</b> 그 딕셔너리를 함수에 넘겨요. 함수가 돌려준 값이 그 자리에 들어가요. 안쪽 딕셔너리부터 불려요.</p><pre>import json\n\ndef show(d):\n    print("만남:", d)\n    return d\n\njson.loads('{"a": {"b": 1}, "c": [{"d": 2}]}', object_hook=show)</pre><p>실행하면 이렇게 찍혀요. 맨 바깥 딕셔너리가 마지막이에요.</p><pre>만남: {'b': 1}\n만남: {'d': 2}\n만남: {'a': {'b': 1}, 'c': [{'d': 2}]}</pre><p>이걸로 <b>꼬리표</b>를 붙여 저장했다가 되살려요. 저장할 때 날짜를 <code>{"__type__": "date", "value": "2026-09-03"}</code> 같은 딕셔너리로 쓰고, 읽을 때 그 꼬리표를 보고 date 로 돌려놔요. 날짜가 몇 겹 안에 있든 다 돼요.</p><pre>from datetime import date\n\ndef tag(o):              # 저장할 때 — default=\n    if isinstance(o, date):\n        return {"__type__": "date", "value": o.isoformat()}\n    raise TypeError(f"JSON 으로 못 바꿔요: {type(o).__name__}")\n\ndef untag(d):            # 읽을 때 — object_hook=\n    if d.get("__type__") == "date":\n        return date.fromisoformat(d["value"])\n    return d</pre><ul><li>꼬리표가 아니면 꼭 <code>return d</code> — 빼먹으면 함수가 None 을 돌려줘서 모든 딕셔너리가 None 이 돼요</li><li><code>__type__</code> 은 정해진 이름이 아니라 약속이에요. 진짜 데이터에 나올 리 없는 이름으로 골라요</li><li>「이 칸은 날짜」 라고 내가 알면 꼬리표 없이 그 칸만 바꾸는 게 더 단순해요(앞 쪽). 꼬리표는 날짜가 <b>어디에 나올지 모를 때</b> 써요</li></ul>`,
      example: { code: `import json\nfrom datetime import date\n\n\ndef tag(o):\n    if isinstance(o, date):\n        return {"__type__": "date", "value": o.isoformat()}\n    raise TypeError(f"JSON 으로 못 바꿔요: {type(o).__name__}")\n\n\ndef untag(d):\n    if d.get("__type__") == "date":\n        return date.fromisoformat(d["value"])\n    return d\n\n\nplan = {\n    "name": "독서 모임",\n    "meet": [date(2026, 9, 6), date(2026, 9, 20)],\n    "place": {"name": "마포 도서관", "since": date(2026, 3, 2)},\n}\ntext = json.dumps(plan, default=tag, ensure_ascii=False)\nprint(text)\n\nback = json.loads(text, object_hook=untag)\nprint(back["meet"][1], type(back["meet"][1]).__name__)\nprint(back["place"]["since"].year)\nprint(back == plan)\n` } },
    { title: "to_dict · from_dict 짝과 왕복 시험", html: `<p>되살리는 코드가 여기저기 흩어지면, 칸이 바뀔 때 한 곳을 놓쳐요. 그래서 클래스 안에 <b>짝</b>으로 둬요. <code>to_dict()</code> 는 저장할 딕셔너리를, <code>from_dict(d)</code> 는 그 딕셔너리로 객체를 만들어요.</p><pre>from dataclasses import dataclass, asdict\nfrom datetime import date\n\n@dataclass\nclass Item:\n    title: str\n    price: int\n    qty: int\n\n@dataclass\nclass Order:\n    id: str\n    ordered_on: date\n    items: list[Item]\n    memo: str = ""                     # 2판에서 더한 칸\n\n    def to_dict(self):\n        return {\n            "version": 2,\n            "id": self.id,\n            "ordered_on": self.ordered_on.isoformat(),\n            "items": [asdict(it) for it in self.items],\n            "memo": self.memo,\n        }\n\n    @classmethod\n    def from_dict(cls, d):\n        return cls(\n            id=d["id"],\n            ordered_on=date.fromisoformat(d["ordered_on"]),\n            items=[Item(**x) for x in d["items"]],\n            memo=d.get("memo", ""),    # 1판 파일엔 memo 가 없어요\n        )</pre><p><code>@classmethod</code> 는 객체 없이 <code>Order.from_dict(d)</code> 처럼 <b>클래스 이름으로</b> 부르는 메서드예요. 첫 매개변수 <code>cls</code> 에 클래스 자신(Order)이 들어와서 <code>cls(…)</code> 가 새 객체를 만들어요(더 자세히: <a href="../oop/#lesson/O11" target="_blank" rel="noopener">설계 교과서 「팩토리 · 빌더」 ↗</a>).</p><p>[[왕복 시험]]은 객체 → 딕셔너리 → JSON 글자 → 딕셔너리 → 객체 로 한 바퀴 돌려서 처음과 같은지 보는 거예요. dataclass 의 <code>==</code> 는 칸끼리 비교라 <code>assert</code> 한 줄이면 돼요.</p><pre>text = json.dumps(order.to_dict(), ensure_ascii=False)\nback = Order.from_dict(json.loads(text))\nassert back == order, "왕복 시험 실패"</pre><p>저장 모양에 <code>"version": 2</code> 를 넣어 두는 까닭은 <b>나중에 칸이 늘 때</b>예요. 위 Order 는 2판에서 <code>memo</code> 칸을 더했어요. 판 번호가 있으면 옛 파일인지 바로 알고, <code>d.get("memo", "")</code> 처럼 없는 칸을 채워 읽어요. 내가 모르는 더 새 판이면 멈추게 할 수도 있어요(아래 예제).</p>`,
      example: { code: `from dataclasses import dataclass, asdict\nfrom datetime import date\nimport json\n\n\n@dataclass\nclass Item:\n    title: str\n    price: int\n    qty: int\n\n\n@dataclass\nclass Order:\n    id: str\n    ordered_on: date\n    items: list[Item]\n    memo: str = ""\n\n    def to_dict(self):\n        return {\n            "version": 2,\n            "id": self.id,\n            "ordered_on": self.ordered_on.isoformat(),\n            "items": [asdict(it) for it in self.items],\n            "memo": self.memo,\n        }\n\n    @classmethod\n    def from_dict(cls, d):\n        if d.get("version", 1) > 2:\n            raise ValueError(f"모르는 판이에요: {d['version']}")\n        return cls(\n            id=d["id"],\n            ordered_on=date.fromisoformat(d["ordered_on"]),\n            items=[Item(**x) for x in d["items"]],\n            memo=d.get("memo", ""),\n        )\n\n\norder = Order("A-1001", date(2026, 9, 3), [Item("파이썬 첫걸음", 18000, 1)], memo="선물 포장")\n\ntext = json.dumps(order.to_dict(), ensure_ascii=False)\nprint(text)\nback = Order.from_dict(json.loads(text))\nassert back == order, "왕복 시험 실패"\nprint("왕복 시험 통과")\n\nold = {"id": "A-0999", "ordered_on": "2026-08-30", "items": [{"title": "하루 10분 SQL", "price": 15800, "qty": 1}]}\nprint(Order.from_dict(old))\n` } },
  ],
  summary: ["asdict(o) 는 안쪽까지 딕셔너리로 — default= 함수에서 is_dataclass(o) 면 asdict, date · Decimal 은 같은 함수가 글자로", "Book(**d) 는 한 겹만 — 중첩은 [Item(**x) for x in d[\"items\"]] 로 손으로, 모르는 키는 TypeError 라 남의 데이터는 쓸 키만", "object_hook 은 딕셔너리마다 불림(꼬리표면 date, 아니면 return d) · to_dict / from_dict 짝 + 왕복 assert + \"version\""] },
{ id: 'F5', ch: 1, n: 5, title: 'JSON Lines: 한 줄에 하나씩', mode: 'text',
  tutorSummary: "JSON Lines(.jsonl)는 한 줄에 JSON 값 하나 — 파일 전체는 JSON 이 아니라 json.loads(전체) 는 JSONDecodeError: Extra data. JSON 하나(리스트)는 하나 더하려면 통째로 읽고 다시 써야 하지만 JSONL 은 끝에 한 줄 붙이기. 이어 쓰기 append_jsonl: open(path, \"a\", encoding=\"utf-8\") 에 f.write(json.dumps(rec, ensure_ascii=False) + \"\\n\") — \"w\" 는 열자마자 비움, \"\\n\" 을 빼면 다음 기록이 같은 줄에 붙음, indent 를 주면 여러 줄이 돼서 JSONL 이 아님. 읽기는 제너레이터 read_jsonl(path)(L18C 복습): for line in f 로 한 줄씩, if not line.strip(): continue 로 빈 줄 건너뛰기(json.loads(\"\\n\") 은 Expecting value), yield json.loads(line). 깨진 줄은 for n, line in enumerate(f, 1) + try/except json.JSONDecodeError as e: bad.append((n, e.msg)); continue — 파일 줄 번호는 n(e.lineno 는 늘 1). 제너레이터라 break 하면 나머지는 안 읽음. 언제 JSONL: 기록 · 로그 · 쌓이는 데이터 · AI 학습 데이터, 설정 · 한 번에 주는 응답은 JSON 하나. pandas 는 pd.read_json(lines=True) 이름만.",
  terms: { "JSON Lines": "한 줄에 JSON 값 하나씩 적은 글자 파일(.jsonl). 기록을 끝에 한 줄씩 붙이고, 한 줄씩 읽는다" },
  pages: [
    { title: ".jsonl — 한 줄에 JSON 하나", html: `<p>[[JSON Lines]](<code>.jsonl</code>)는 <b>한 줄에 JSON 값 하나</b>씩 적은 글자 파일이에요. 이 교과서의 <code>events.jsonl</code> 앞 세 줄이에요.</p><pre>{"t": "2026-09-01T09:00:00+09:00", "user": "u01", "event": "open"}\n{"t": "2026-09-01T10:07:00+09:00", "user": "u04", "event": "search", "query": "json"}\n{"t": "2026-09-01T11:14:00+09:00", "user": "u03", "event": "save", "size_kb": 22}</pre><p>파일 전체는 JSON 이 아니에요. 줄 하나하나가 JSON 이에요. 그래서 <code>json.load</code> 로 통째로 읽으면 첫 줄 뒤에서 <code>Extra data</code> 에러가 나요.</p><p>같은 기록을 JSON 하나로 쓰면 <code>[ … ]</code> 리스트 하나예요. 기록을 하나 더하려면 파일을 <b>통째로 읽고 · 붙이고 · 통째로 다시 써야</b> 해요. JSONL 은 <b>맨 뒤에 한 줄 붙이기</b>만 하면 돼요.</p><table class="kb"><tbody><tr><th></th><th>JSON 하나</th><th>JSONL</th></tr><tr><td>하나 더하기</td><td>통째로 읽고 다시 쓰기</td><td>끝에 한 줄 붙이기</td></tr><tr><td>읽기</td><td>통째로 <code>json.load</code></td><td>한 줄씩</td></tr><tr><td>한 줄이 깨지면</td><td>파일 전체를 못 읽어요</td><td>그 줄만 건너뛰어요</td></tr><tr><td>잘 맞는 곳</td><td>설정 · 한 번에 주고받는 응답</td><td>기록 · 로그 · 쌓이는 데이터</td></tr></tbody></table><p>앱 사용 기록, 서버 로그, AI 학습 데이터도 흔히 이 모양이에요.</p>`,
      example: { code: `import json\n\nrecords = [\n    {"user": "u01", "event": "open"},\n    {"user": "u04", "event": "search", "query": "차트"},\n    {"user": "u01", "event": "save", "size_kb": 22},\n]\n\nlines = [json.dumps(r, ensure_ascii=False) for r in records]\ntext = "\\n".join(lines) + "\\n"\nprint(text)\n\nfor line in text.splitlines():\n    rec = json.loads(line)\n    print(rec["event"], end=" ")\nprint()\n\ntry:\n    json.loads(text)\nexcept json.JSONDecodeError as e:\n    print("통째로 읽으면:", e.msg, "— 줄", e.lineno)\n` } },
    { title: "이어 쓰기 open(…, \"a\") + dumps + \"\\n\"", html: `<p>기록을 더할 때는 파일을 <code>"a"</code>(append, 이어 쓰기)로 열어요. <code>"w"</code> 는 열자마자 내용을 비우지만 <code>"a"</code> 는 <b>있던 내용 뒤에</b> 써요. 파일이 없으면 새로 만들어요.</p><pre>import json\n\ndef append_jsonl(path, rec):\n    with open(path, "a", encoding="utf-8") as f:\n        f.write(json.dumps(rec, ensure_ascii=False) + "\\n")</pre><ul><li><code>json.dumps</code> 는 글자를 돌려줘요. 끝에 <code>"\\n"</code> 을 꼭 붙여요. 빼면 다음 기록이 같은 줄에 붙어서 그 줄이 깨져요</li><li><code>indent=</code> 는 <b>주지 마세요</b>. 들여 쓰면 기록 하나가 여러 줄이 돼서 JSONL 이 아니에요</li><li><code>ensure_ascii=False</code> 로 한글을 그대로 — 에디터로 열어 봐도 읽혀요</li><li>파일을 열고 · 한 줄 쓰고 · 바로 닫아요. 프로그램이 중간에 꺼져도 앞의 기록은 남아요</li></ul>`,
      example: { code: `import json\nfrom pathlib import Path\n\n\ndef append_jsonl(path, rec):\n    with open(path, "a", encoding="utf-8") as f:\n        f.write(json.dumps(rec, ensure_ascii=False) + "\\n")\n\n\nlog = Path("log.jsonl")\nlog.unlink(missing_ok=True)  # 예제를 몇 번 돌려도 같게 — 처음부터\n\nappend_jsonl(log, {"t": "2026-09-05T09:00:00+09:00", "job": "설정 읽기", "ok": True})\nappend_jsonl(log, {"t": "2026-09-05T09:00:02+09:00", "job": "주문 요약", "ok": True, "count": 4})\nappend_jsonl(log, {"t": "2026-09-05T09:00:03+09:00", "job": "기록 세기", "ok": False, "error": "깨진 줄 1개"})\n\nwith open(log, encoding="utf-8") as f:\n    text = f.read()\nprint(text, end="")\nlines = text.splitlines()\nprint("줄 수:", len(lines))\n` } },
    { title: "한 줄씩 읽기 read_jsonl(path) — 제너레이터", html: `<p>복습: <a href="../python/#lesson/L18C" target="_blank" rel="noopener">파이썬 교과서 「반복자와 제너레이터」 ↗</a> 에서 <code>for line in f</code> 는 큰 파일도 한 줄씩 읽고, <code>yield</code> 로 하나씩 내보내는 함수를 만들었어요. JSONL 읽기가 딱 그 모양이에요.</p><pre>import json\n\ndef read_jsonl(path):\n    with open(path, encoding="utf-8") as f:\n        for line in f:\n            if not line.strip():\n                continue                  # 빈 줄은 건너뛰기\n            yield json.loads(line)</pre><ul><li>줄 끝의 <code>\\n</code> 은 <code>json.loads</code> 가 공백으로 보고 넘겨요. 따로 떼지 않아도 돼요</li><li>빈 줄(고치다 엔터를 한 번 더 친 줄)은 <code>json.loads</code> 가 <code>JSONDecodeError: Expecting value</code> 라서 먼저 걸러요</li><li>제너레이터라 <b>쓰는 만큼만</b> 읽어요. 100만 줄이어도 메모리에는 한 줄씩만 올라와요. 큰 JSON 하나는 <code>json.load</code> 가 통째로 읽어야 해요</li></ul>`,
      example: { code: `import json\n\nSAMPLE = """{"day": "2026-09-01", "steps": 6200}\n{"day": "2026-09-02", "steps": 11000}\n\n{"day": "2026-09-03", "steps": 4300}\n"""\nwith open("walk.jsonl", "w", encoding="utf-8") as f:\n    f.write(SAMPLE)\n\n\ndef read_jsonl(path):\n    with open(path, encoding="utf-8") as f:\n        for line in f:\n            if not line.strip():\n                continue\n            yield json.loads(line)\n\n\ngen = read_jsonl("walk.jsonl")\nprint(type(gen).__name__)\nprint(next(gen))\n\ntotal = 0\nfor rec in read_jsonl("walk.jsonl"):\n    total += rec["steps"]\nprint("모두", total)\n\ndays = list(read_jsonl("walk.jsonl"))\nprint(len(days), "일")\n\ntry:\n    json.loads("\\n")\nexcept json.JSONDecodeError as e:\n    print("빈 줄을 그냥 읽으면:", e.msg)\n` } },
    { title: "깨진 줄: enumerate(f, 1) + JSONDecodeError", html: `<p>쌓이는 파일은 가끔 깨져요. 쓰던 중에 프로그램이 꺼지면 마지막 줄이 반만 남고, 사람이 손으로 고치다 따옴표를 틀리기도 해요. 한 줄 때문에 전부 멈추면 안 되니, <b>그 줄 번호만 남기고 계속</b> 읽어요.</p><pre>import json\n\ndef read_jsonl(path, bad):\n    with open(path, encoding="utf-8") as f:\n        for n, line in enumerate(f, 1):\n            if not line.strip():\n                continue\n            try:\n                rec = json.loads(line)\n            except json.JSONDecodeError as e:\n                bad.append((n, e.msg))    # 줄 번호와 까닭만 남기고\n                continue                  # 다음 줄로\n            yield rec</pre><ul><li><code>enumerate(f, 1)</code> — 줄 번호를 1부터 세요. VS Code 왼쪽의 줄 번호와 같아서 바로 찾아가요</li><li><code>e.lineno</code> 는 <code>json.loads</code> 에 <b>넘긴 글자 안</b>의 줄 번호라 1 이나 2(줄 끝 <code>\\n</code> 뒤)예요. 파일의 줄 번호는 <code>n</code> 이고, 무엇이 틀렸는지는 <code>e.msg</code> 예요(복습: [[레슨:F1]])</li><li>제너레이터는 다 읽은 뒤 값을 돌려주기 어려워요. 그래서 깨진 줄 목록 <code>bad</code> 를 밖에서 받아 채워요</li><li><code>yield rec</code> 는 <code>try</code> 밖에 둬요. 잘 읽은 줄만 내보내요</li></ul>`,
      example: { code: `import json\n\nSAMPLE = """{"job": "백업", "ok": true}\n{"job": "정리", "ok": true}\n{"job": "보고서", "ok": false, "error": "시트 없음"}\n\n{"job": "백업", "ok": tru\n{"job": "정리", 'ok': true}\n{"job": "보고서", "ok": true}\n"""\nwith open("jobs.jsonl", "w", encoding="utf-8") as f:\n    f.write(SAMPLE)\n\n\ndef read_jsonl(path, bad):\n    with open(path, encoding="utf-8") as f:\n        for n, line in enumerate(f, 1):\n            if not line.strip():\n                continue\n            try:\n                rec = json.loads(line)\n            except json.JSONDecodeError as e:\n                bad.append((n, e.msg))\n                continue\n            yield rec\n\n\nbad = []\nrecs = list(read_jsonl("jobs.jsonl", bad))\nprint("읽은 기록", len(recs), "개")\nfor n, why in bad:\n    print(f"  {n}번 줄 건너뜀: {why}")\nok = [r for r in recs if r["ok"]]\nprint("성공", len(ok), "/ 실패", len(recs) - len(ok))\n` } },
    { title: "찾으면 break — 필요한 만큼만 읽기", html: `<p>제너레이터로 읽으면 찾는 것을 만나는 순간 <code>break</code> 로 멈출 수 있어요. 남은 줄은 아예 읽지 않아요. 큰 JSON 하나라면 첫 기록 하나를 보려 해도 파일 전체를 읽어야 해요. 아래 예제는 준비 파일 <code>events.jsonl</code>(40줄)에서 처음 나온 40 KB 넘는 저장만 찾아요.</p><p>그래서 형식은 이렇게 골라요.</p><table class="kb"><tbody><tr><th>이럴 때</th><th>이 형식</th></tr><tr><td>앱 설정 · 한 번에 주고받는 API 응답</td><td>JSON 하나(<code>settings.json</code> · <code>orders.json</code>)</td></tr><tr><td>계속 쌓이는 기록 · 로그</td><td>JSONL(<code>events.jsonl</code>)</td></tr><tr><td>줄마다 따로 처리하거나 나눠 보내는 데이터</td><td>JSONL</td></tr><tr><td>사람에게 표로 보여 줄 것</td><td>CSV · 엑셀(챕터 2 · 3)</td></tr></tbody></table><p>pandas 로도 돼요 — <code>pd.read_json("events.jsonl", lines=True)</code> 한 줄이면 표가 돼요(<a href="../data/#lesson/P1" target="_blank" rel="noopener">데이터 분석 교과서 「DataFrame · read_csv」 ↗</a>). 이 교과서는 pandas 없이 해요.</p>`,
      example: { code: `import json\n\n\ndef read_jsonl(path, bad):\n    with open(path, encoding="utf-8") as f:\n        for n, line in enumerate(f, 1):\n            if not line.strip():\n                continue\n            try:\n                rec = json.loads(line)\n            except json.JSONDecodeError as e:\n                bad.append((n, e.msg))\n                continue\n            yield rec\n\n\nbad = []\ncount = 0\nfor rec in read_jsonl("events.jsonl", bad):\n    count += 1\n    if rec["event"] == "save" and rec["size_kb"] >= 40:\n        print("처음 나온 큰 저장:", rec["t"], rec["user"], rec["size_kb"], "KB")\n        break\nprint(count, "개만 읽고 멈췄어요")\nprint("그때까지 깨진 줄:", bad)\n`, prep: [{ name: 'events.jsonl', text: EVENTS_JSONL }] } },
  ],
  summary: ["JSONL = 한 줄에 JSON 하나 — 더하기는 끝에 한 줄, 통째로 json.loads 하면 Extra data", "이어 쓰기 open(path, \"a\") 에 json.dumps(rec, ensure_ascii=False) + \"\\n\" — indent 는 주지 않기", "읽기는 제너레이터: 빈 줄 건너뛰고, enumerate(f, 1) + JSONDecodeError 로 깨진 줄 번호만 남기고 계속"] },
{ id: 'F6', ch: 1, n: 6, title: '값 검사: 필수 키 · 종류 · 범위', mode: 'text',
  tutorSummary: "손으로 고친 설정 · 남이 준 응답은 바라는 모양이라는 보장이 없어서, 쓰기 전에 검사해 어디가 왜 틀렸는지 알려 준다. 필수 키 REQUIRED - d.keys()(집합 차, L11B 복습), 모르는 키(오타) d.keys() - KNOWN, sorted 로 늘 같은 순서. 종류 isinstance(L18G 복습) — isinstance(True, int) 가 True(bool 은 int 의 한 종류)라 bool 을 먼저 거른다: isinstance(v, int) and not isinstance(v, bool). 14.0 은 float, \"14\" 는 str. 범위 v in range(8, 41)(8~40, 정수만), 고를 수 있는 값 v in {\"light\", \"dark\"}(대소문자 다름), 글자 길이 1 <= len(s) <= 20 — 종류를 먼저 봐야 \"14\" in range(…) 가 False 로 엉뚱한 까닭이 안 나온다. check_value(value, kind, allowed) 는 맞으면 None, 틀리면 까닭 글자. 첫 에러에서 멈추지 말고 errors 리스트에 모아 한 번에, 경로를 붙여 \"items[2].price: 0 보다 커야 해요\". 규칙표 RULES = {\"theme\": (str, {\"light\", \"dark\"}), \"font_size\": (int, range(8, 41)), \"editor\": {안쪽 규칙표}} 와 check(data, rules, where=\"\") 하나 — 빠진 키는 rules.keys() - data.keys(), 값이 딕셔너리 규칙이면 자기를 다시 불러 path + \".\", 아니면 check_value(value, *rule). 리스트는 check(item, ITEM_RULES, f\"items[{i}].\") 로. 더 큰 도구는 Pydantic(API H11), JSON Schema 는 이름만.",
  terms: { "규칙표": "칸 이름 → (종류, 고를 수 있는 값) 을 적은 딕셔너리. 검사 함수 하나가 이 표를 읽어 모든 칸을 검사한다" },
  pages: [
    { title: "필수 키 REQUIRED - d.keys()", html: `<p>사람이 손으로 고친 설정 파일, 남이 보내 준 API 응답은 <b>내 코드가 바라는 모양이라는 보장이 없어요</b>. 쓰기 전에 검사하면, 엉뚱한 곳에서 <code>KeyError</code> · <code>TypeError</code> 로 멈추는 대신 「어디가 왜 틀렸는지」 를 알려 줄 수 있어요.</p><p>먼저 꼭 있어야 할 키예요. <code>d.keys()</code> 는 집합처럼 빼기가 돼요(복습: <a href="../python/#lesson/L11B" target="_blank" rel="noopener">파이썬 교과서 「집합: 중복 제거」 ↗</a>).</p><pre>REQUIRED = {"theme", "font_size", "language"}\nKNOWN = REQUIRED | {"autosave", "editor"}\n\nuser = {"theme": "dark", "fontsize": 14, "autosave": True}\nmissing = REQUIRED - user.keys()\nunknown = user.keys() - KNOWN\nprint(sorted(missing))   # ['font_size', 'language']\nprint(sorted(unknown))   # ['fontsize']</pre><ul><li><code>REQUIRED - user.keys()</code> — 있어야 하는데 <b>없는</b> 키</li><li><code>user.keys() - KNOWN</code> — 내가 <b>모르는</b> 키. <code>fontsize</code> 같은 오타를 잡아요</li><li>집합은 순서가 없어서 <code>sorted</code> 로 늘 같은 순서로 보여 줘요</li></ul>`,
      example: { code: `import json\n\ntext = """{"theme": "dark", "fontsize": 14, "autosave": true,\n "editor": {"tab_size": 4}}"""\nuser = json.loads(text)\n\nREQUIRED = {"theme", "font_size", "language"}\nKNOWN = REQUIRED | {"autosave", "editor"}\n\nmissing = REQUIRED - user.keys()\nunknown = user.keys() - KNOWN\nprint("없는 키:", sorted(missing))\nprint("모르는 키:", sorted(unknown))\nfor key in sorted(missing):\n    print(f"{key}: 꼭 있어야 해요")\nfor key in sorted(unknown):\n    print(f"{key}: 모르는 키예요(오타일까요?)")\n` } },
    { title: "종류 isinstance · bool 먼저 거르기", html: `<p>복습: <a href="../python/#lesson/L18G" target="_blank" rel="noopener">파이썬 교과서 「타입 힌트 2: | None · 클래스 · isinstance」 ↗</a> 의 <code>isinstance(값, 타입)</code> 으로 종류를 봐요. JSON 에서 온 값은 <code>str</code> · <code>int</code> · <code>float</code> · <code>bool</code> · <code>list</code> · <code>dict</code> · <code>None</code> 중 하나예요.</p><pre>print(isinstance("14", int))   # False\nprint(isinstance(14, int))     # True\nprint(isinstance(True, int))   # True</pre><p>셋째 줄이 함정이에요. 파이썬에서 <code>bool</code> 은 <code>int</code> 의 한 종류라서 <code>True</code> 도 int 로 통과해요. 설정에 <code>"font_size": true</code> 라고 잘못 적어도 못 잡아요. 그래서 <b>bool 을 먼저</b> 걸러요.</p><pre>def is_int(v):\n    return isinstance(v, int) and not isinstance(v, bool)\n\nprint(is_int(14), is_int(True), is_int(14.0))   # True False False</pre><ul><li><code>14.0</code> 은 float 이에요. JSON 에 <code>14.0</code> 으로 적혀 있으면 정수 칸이라도 float 으로 와요</li><li><code>"14"</code> 는 글자예요. 검사는 「틀렸다」 고 알려 주는 일이에요. 몰래 <code>int()</code> 로 바꿔 주면, 어디가 틀렸는지 아무도 모르게 돼요</li></ul>`,
      example: { code: `import json\n\ntext = """{"font_size": 14, "zoom": 1.5, "autosave": true, "lines": 14.0,\n "tab": "4", "memo": null, "recent": ["a.txt"], "editor": {}}"""\ndata = json.loads(text)\n\n\ndef is_int(v):\n    return isinstance(v, int) and not isinstance(v, bool)\n\n\nfor key, value in data.items():\n    kind = type(value).__name__\n    print(key, kind, "| isinstance(v, int):", isinstance(value, int), "| is_int:", is_int(value))\n` } },
    { title: "범위 range · 고를 값 {…} · 글자 길이 len", html: `<pre>size = 14\ntheme = "Dark"\nname = ""\nprint(size in range(8, 41))          # True\nprint(theme in {"light", "dark"})    # False\nprint(1 &lt;= len(name) &lt;= 20)          # False\nprint("14" in range(8, 41))          # False</pre><ul><li><code>range(8, 41)</code> 은 8 ~ 40 이에요. 끝 수는 안 들어가요. 정수만 들어 있어서 <code>14.5 in range(8, 41)</code> 은 False</li><li>고를 수 있는 값은 집합 <code>{"light", "dark"}</code> — 대소문자가 다르면 다른 글자예요(<code>"Dark"</code> ✗)</li><li>글자 길이는 <code>len</code> 으로 위아래를 같이 — <code>1 &lt;= len(name) &lt;= 20</code></li><li><b>종류를 먼저</b> 봐요. <code>"14" in range(8, 41)</code> 은 에러 없이 False 라서 「범위 밖」 이라는 엉뚱한 까닭이 나와요</li></ul><p>셋을 차례로 보는 함수 <code>check_value</code> 예요. 맞으면 <code>None</code>, 틀리면 <b>까닭 글자</b>를 돌려줘요. 다음 쪽부터 이 함수를 써요.</p><pre>def allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f"{allowed.start}~{allowed.stop - 1} 사이여야"\n    names = sorted(str(x) for x in allowed)\n    return ", ".join(names) + " 중 하나여야"\n\ndef check_value(value, kind, allowed):\n    """맞으면 None, 틀리면 까닭(글자)"""\n    if isinstance(value, bool) and kind is not bool:\n        return f"종류가 {kind.__name__} 여야 해요(지금 bool {value})"\n    if not isinstance(value, kind):\n        return f"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})"\n    if allowed is not None and value not in allowed:\n        return f"{allowed_text(allowed)} 해요(지금 {value!r})"\n    return None</pre>`,
      example: { code: `def allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f"{allowed.start}~{allowed.stop - 1} 사이여야"\n    names = sorted(str(x) for x in allowed)\n    return ", ".join(names) + " 중 하나여야"\n\n\ndef check_value(value, kind, allowed):\n    """맞으면 None, 틀리면 까닭(글자)"""\n    if isinstance(value, bool) and kind is not bool:\n        return f"종류가 {kind.__name__} 여야 해요(지금 bool {value})"\n    if not isinstance(value, kind):\n        return f"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})"\n    if allowed is not None and value not in allowed:\n        return f"{allowed_text(allowed)} 해요(지금 {value!r})"\n    return None\n\n\nsize = range(8, 41)\nprint(check_value(14, int, size))\nprint(check_value("14", int, size))\nprint(check_value(True, int, size))\nprint(check_value(99, int, size))\nprint(check_value("Dark", str, {"light", "dark"}))\nprint(check_value(4, int, {2, 4, 8}))\nprint(check_value("yes", bool, None))\n\nname = "김하늘"\nif not 1 <= len(name) <= 20:\n    print("name: 1~20 글자여야 해요")\nelse:\n    print("name 통과:", len(name), "글자")\n` } },
    { title: "모아서 한 번에 — items[2].price 경로 붙이기", html: `<p>첫 에러에서 <code>raise</code> 하면, 사용자는 하나 고치고 → 다시 돌리고 → 다음 에러를 보고 … 를 되풀이해요. 검사는 <b>끝까지 돌며 에러를 리스트에 모아</b> 한 번에 보여 줘요. 그리고 에러마다 <b>어디인지</b> 경로를 붙여요.</p><pre>order = {"id": "A-1001", "items": [\n    {"title": "파이썬 첫걸음", "price": 18000, "qty": 1},\n    {"title": "", "price": 12500, "qty": 0},\n    {"title": "하루 10분 SQL", "price": -500, "qty": 1},\n]}\n\nerrors = []\nfor i, item in enumerate(order["items"]):\n    where = f"items[{i}]"\n    if not 1 &lt;= len(item["title"]) &lt;= 50:\n        errors.append(f"{where}.title: 1~50 글자여야 해요")\n    if item["qty"] &lt; 1:\n        errors.append(f"{where}.qty: 1 이상이어야 해요")\n    if item["price"] &lt;= 0:\n        errors.append(f"{where}.price: 0 보다 커야 해요")\nprint(len(errors))   # 3</pre><p>모은 에러를 한 줄씩 찍으면 이래요.</p><pre>items[1].title: 1~50 글자여야 해요\nitems[1].qty: 1 이상이어야 해요\nitems[2].price: 0 보다 커야 해요</pre><ul><li>경로는 JSON 안에서 찾아가는 길 그대로예요. <code>items[1].qty</code> 면 「items 의 1번(둘째) 것의 qty」 — [[레슨:F2]] 의 경로 읽기와 같은 표기라 고칠 곳을 바로 찾아요</li><li><code>enumerate</code> 로 번호를 같이 받아야 경로에 넣을 수 있어요</li><li>에러가 없으면 빈 리스트 <code>[]</code> 예요. <code>if errors:</code> 로 가려요</li></ul>`,
      example: { code: `import json\n\ntext = """{"id": "A-1001", "items": [\n  {"title": "파이썬 첫걸음", "price": 18000, "qty": 1},\n  {"title": "", "price": 12500, "qty": 0},\n  {"title": "하루 10분 SQL", "price": -500, "qty": 1}\n]}"""\norder = json.loads(text)\n\n\ndef check_item(item, where):\n    errors = []\n    if not 1 <= len(item["title"]) <= 50:\n        errors.append(f"{where}.title: 1~50 글자여야 해요")\n    if item["qty"] < 1:\n        errors.append(f"{where}.qty: 1 이상이어야 해요")\n    if item["price"] <= 0:\n        errors.append(f"{where}.price: 0 보다 커야 해요")\n    return errors\n\n\nerrors = []\nfor i, item in enumerate(order["items"]):\n    errors += check_item(item, f"items[{i}]")\n\nif errors:\n    print(f"고칠 곳 {len(errors)}개:")\n    for e in errors:\n        print(" ", e)\nelse:\n    print("문제 없음")\n\nprint(check_item(order["items"][0], "items[0]"))\n` } },
    { title: "규칙표 RULES 와 check(data, rules)", html: `<p>칸이 많아지면 if 가 끝없이 늘어요. 규칙을 <b>표(딕셔너리)</b>로 적고, 표를 읽어 검사하는 함수 하나를 둬요. 칸이 늘면 표에 한 줄만 더하면 돼요. 이게 [[규칙표]]예요.</p><pre>RULES = {\n    "theme": (str, {"light", "dark"}),\n    "font_size": (int, range(8, 41)),\n    "language": (str, {"ko", "en"}),\n    "autosave": (bool, None),\n    "autosave_minutes": (int, range(1, 61)),\n    "editor": {                              # 안쪽 규칙표\n        "tab_size": (int, {2, 4, 8}),\n        "word_wrap": (bool, None),\n    },\n    "recent_files": (list, None),\n}</pre><ul><li>값 자리는 <code>(종류, 고를 수 있는 값)</code> 이에요. 고를 값은 <code>range</code> · 집합, 아무거나 되면 <code>None</code></li><li>값 자리가 딕셔너리면 <b>안쪽 규칙표</b>예요. <code>check</code> 가 자기를 다시 불러 <code>editor.</code> 경로를 붙여요(복습: <a href="../python/#lesson/L32" target="_blank" rel="noopener">파이썬 교과서 「재귀: 나를 부르는 함수」 ↗</a>)</li></ul><pre>def check(data, rules, where=""):\n    errors = []\n    for key in sorted(rules.keys() - data.keys()):\n        errors.append(f"{where}{key}: 꼭 있어야 해요")\n    for key, rule in rules.items():\n        if key not in data:\n            continue\n        path = where + key\n        value = data[key]\n        if isinstance(rule, dict):                    # 안쪽 규칙표\n            if isinstance(value, dict):\n                errors += check(value, rule, path + ".")\n            else:\n                errors.append(f"{path}: 묶음(dict)이어야 해요(지금 {type(value).__name__} {value!r})")\n            continue\n        why = check_value(value, *rule)               # (종류, 고를 값) 을 풀어 넘기기\n        if why:\n            errors.append(f"{path}: {why}")\n    return errors</pre><p><code>check_value</code> 는 앞 쪽 함수예요. <code>check_value(value, *rule)</code> 의 <code>*</code> 는 튜플 <code>(int, range(8, 41))</code> 을 풀어 두 인자로 넘겨요. 준비 파일 <code>settings.json</code> 을 검사하면 이렇게 나와요(아래 예제).</p><pre>theme: dark, light 중 하나여야 해요(지금 'Dark')\nfont_size: 종류가 int 여야 해요(지금 str '14')\nautosave_minutes: 1~60 사이여야 해요(지금 0)\neditor.word_wrap: 종류가 bool 여야 해요(지금 str 'yes')</pre><ul><li>리스트 안의 것들은 하나씩 <code>check(item, ITEM_RULES, f"items[{i}].")</code> 로 불러 경로를 이어 붙여요</li><li>고친 설정을 저장할 때는 복습: [[레슨:F1]] 의 <code>json.dump(data, f, ensure_ascii=False, indent=2, sort_keys=True)</code> — 키 순서가 늘 같아서 고친 곳만 눈에 띄어요</li><li>더 큰 도구: 웹 API 에서는 Pydantic 이 타입 힌트로 이 검사를 해 줘요(<a href="../api/#lesson/H11" target="_blank" rel="noopener">API 교과서 「입력 받기: 경로 · 쿼리 · 본문」 ↗</a>). 여러 언어가 같이 쓰는 규칙 형식으로 JSON Schema 도 있어요(이름만)</li></ul>`,
      example: { code: `import json\n\n\ndef allowed_text(allowed):\n    if isinstance(allowed, range):\n        return f"{allowed.start}~{allowed.stop - 1} 사이여야"\n    names = sorted(str(x) for x in allowed)\n    return ", ".join(names) + " 중 하나여야"\n\n\ndef check_value(value, kind, allowed):\n    if isinstance(value, bool) and kind is not bool:\n        return f"종류가 {kind.__name__} 여야 해요(지금 bool {value})"\n    if not isinstance(value, kind):\n        return f"종류가 {kind.__name__} 여야 해요(지금 {type(value).__name__} {value!r})"\n    if allowed is not None and value not in allowed:\n        return f"{allowed_text(allowed)} 해요(지금 {value!r})"\n    return None\n\n\ndef check(data, rules, where=""):\n    errors = []\n    for key in sorted(rules.keys() - data.keys()):\n        errors.append(f"{where}{key}: 꼭 있어야 해요")\n    for key, rule in rules.items():\n        if key not in data:\n            continue\n        path = where + key\n        value = data[key]\n        if isinstance(rule, dict):\n            if isinstance(value, dict):\n                errors += check(value, rule, path + ".")\n            else:\n                errors.append(f"{path}: 묶음(dict)이어야 해요(지금 {type(value).__name__} {value!r})")\n            continue\n        why = check_value(value, *rule)\n        if why:\n            errors.append(f"{path}: {why}")\n    return errors\n\n\nRULES = {\n    "theme": (str, {"light", "dark"}),\n    "font_size": (int, range(8, 41)),\n    "language": (str, {"ko", "en"}),\n    "autosave": (bool, None),\n    "autosave_minutes": (int, range(1, 61)),\n    "editor": {\n        "tab_size": (int, {2, 4, 8}),\n        "word_wrap": (bool, None),\n    },\n    "recent_files": (list, None),\n}\n\nwith open("settings.json", encoding="utf-8") as f:\n    settings = json.load(f)\n\nerrors = check(settings, RULES)\nprint(f"settings.json — 고칠 곳 {len(errors)}개")\nfor e in errors:\n    print(" ", e)\n\ngood = {"theme": "dark", "font_size": 14, "language": "ko", "autosave": True,\n        "autosave_minutes": 5, "editor": {"tab_size": 4, "word_wrap": False}, "recent_files": []}\nprint("고친 설정:", check(good, RULES))\nprint(check({"theme": "light", "editor": 4}, RULES)[:3])\n`, prep: [{ name: 'settings.json', text: SETTINGS_JSON }] } },
  ],
  summary: ["필수 키는 REQUIRED - d.keys(), 오타는 d.keys() - KNOWN — 집합 차를 sorted 로", "isinstance(True, int) 는 True 라 bool 먼저 거르기 · 종류 → 범위 range / 고를 값 {…} / len 순서로", "에러는 모아서 경로를 붙여 한 번에 — 규칙표 RULES 와 check(data, rules, where) 하나로, 안쪽 표는 재귀"] },
{ id: 'FB1', ch: 1, boss: true, title: '만들어 보기: 앱 설정과 API 응답 정리', mode: 'text',
  tutorSummary: "만들어 보기(F1~F6 종합): ① 기본 설정 DEFAULTS 와 사용자 settings.json 을 재귀로 깊게 합치기 merge(defaults, user)(defaults 는 안 바뀌게) ② 규칙표 RULES 와 check 로 틀린 값 목록을 경로와 함께 출력하고, 틀린 값만 기본값으로 되돌려 sort_keys=True 로 settings_fixed.json 저장 후 다시 검사 ③ orders.json(서점 API 저장본)에서 주문마다 날짜(한국 시각 그대로 .date()) · 고객 · 권수 · 금액(Decimal) 요약, 취소 주문 빼고 합계 ④ 요약을 dataclass 로 바꿔 to_dict / from_dict 로 summary.json 저장 → 되살려 왕복 assert ⑤ events.jsonl 을 깨진 줄은 줄 번호만 남기고 건너뛰며 종류별로 세고, 처리 기록을 log.jsonl 에 이어 쓰기",
  pages: [], summary: [] },
{ id: 'F7', ch: 2, n: 7, title: '엑셀 읽기: 통합 문서 · 시트 · 셀', mode: 'text',
  tutorSummary: 'openpyxl 로 엑셀(.xlsx) 읽기. 세 겹: 통합 문서 wb = load_workbook("빵집_매출.xlsx") → 시트 wb["7월"] · wb.active · wb.sheetnames(없는 이름은 KeyError) → 셀 ws["B2"].value · ws.cell(row=2, column=3)(행·열은 1부터). 열 글자 ↔ 번호 get_column_letter(3) == "C" · column_index_from_string("E") == 5 (openpyxl.utils). 범위 ws["A1:C3"] 은 줄마다 셀 튜플. 많은 줄은 ws.iter_rows(min_row=2, values_only=True) 로 값 튜플, 머리줄 [c.value for c in ws[1]] 과 dict(zip(header, row)) 로 이름으로 꺼내기. 읽은 값: 숫자 int/float · 글자 str · 날짜는 datetime(날짜만이어도 00:00 이 붙음, .date()) · 빈 칸 None. 함정: ws.max_row · max_column 은 서식만 있는 빈 칸까지, 빈 칸을 읽기만 해도 칸이 생겨 늘어남 → any(v is not None for v in row) 로 거르기. 병합 칸은 왼쪽 위에만 값, 나머지는 MergedCell(값 None, 쓰면 AttributeError), ws.merged_cells.ranges. 날짜가 46270 같은 숫자면 openpyxl.utils.datetime.from_excel(46270) == datetime(2026, 9, 5). .xls(옛 형식) · .csv 는 InvalidFileException. 큰 파일은 load_workbook(…, read_only=True) — iter_rows 로 차례로 읽기만, 저장 ✗(TypeError), merged_cells 없음, 끝나면 wb.close().',
  terms: { '통합 문서': '엑셀 파일 하나(.xlsx). 안에 시트가 여러 장 들어 있어요 — openpyxl 의 Workbook', '시트': '통합 문서 안의 표 한 장. 엑셀 아래쪽 탭에 이름이 보여요 — openpyxl 의 Worksheet', '셀': '시트의 칸 하나. B2 처럼 열 글자 + 행 번호로 불러요 — openpyxl 의 Cell', '병합 칸': '여러 칸을 하나로 합친 칸. 값은 왼쪽 위 칸에만 있고, 나머지는 openpyxl 에서 MergedCell 이에요' },
  pages: [
    { title: 'load_workbook · wb.sheetnames · wb["7월"]', html: `<p>[[레슨:F6]] 까지는 글자 파일(JSON)을 다뤘어요. 이번 챕터는 엑셀 파일(.xlsx)이에요. 엑셀 파일은 글자 파일이 아니라서 <code>open()</code> 으로 읽으면 알 수 없는 기호만 나와요. 그래서 시작하기 1 에서 깐 <b>openpyxl</b> 을 써요.</p>
<p>엑셀 파일 하나를 [[통합 문서]], 그 안의 표 한 장을 [[시트]], 칸 하나를 [[셀]] 이라고 해요. openpyxl 도 이 세 겹 그대로예요.</p>
<table class="kb"><tbody><tr><th>엑셀</th><th>openpyxl</th><th>꺼내는 코드</th></tr><tr><td>통합 문서</td><td><code>Workbook</code></td><td><code>wb = load_workbook("빵집_매출.xlsx")</code></td></tr><tr><td>시트</td><td><code>Worksheet</code></td><td><code>wb["7월"]</code> · <code>wb.active</code>(저장할 때 열려 있던 시트)</td></tr><tr><td>셀</td><td><code>Cell</code></td><td><code>ws["B2"]</code> → 값은 <code>.value</code></td></tr></tbody></table>
<pre>from openpyxl import load_workbook

wb = load_workbook("빵집_매출.xlsx")
print(wb.sheetnames)    # ['7월', '8월', '9월']
ws = wb["7월"]
print(ws.dimensions)    # A1:E21 — A1 부터 E21 까지 쓰인 표</pre>
<ul><li><code>wb.sheetnames</code> — 시트 이름 리스트, 엑셀 아래쪽 탭 순서 그대로예요</li><li><code>ws.max_row</code> · <code>ws.max_column</code> — 마지막 줄 번호 · 마지막 열 번호. 머리줄도 한 줄이라 7월은 <code>21</code> 줄 = 머리줄 1 + 데이터 20 이에요</li><li>없는 시트 이름은 <code>KeyError: 'Worksheet 10월 does not exist.'</code></li><li>파일이 없으면 <code>FileNotFoundError</code> — 파일 이름은 VS Code 터미널의 현재 폴더에서 찾아요(<a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩」 ↗</a>)</li></ul>`,
      example: { code: `from openpyxl import load_workbook

wb = load_workbook("빵집_매출.xlsx")
print(wb.sheetnames)
print("열려 있던 시트:", wb.active.title)

for name in wb.sheetnames:
    ws = wb[name]
    print(name, ws.dimensions, "데이터", ws.max_row - 1, "줄")

try:
    wb["10월"]
except KeyError as e:
    print("KeyError:", e)`, prep: [SAMPLES_PREP] } },
    { title: 'ws["B2"].value · ws.cell(row=2, column=3)', html: `<p>셀 하나를 꺼내는 길은 둘이에요. 엑셀에서 보이는 주소 그대로 <code>ws["B2"]</code>, 아니면 번호로 <code>ws.cell(row=2, column=3)</code>. 번호 쪽은 반복문에서 편해요. 둘 다 <code>Cell</code> 이고 값은 <code>.value</code> 에 있어요.</p>
<pre>from openpyxl.utils import get_column_letter, column_index_from_string

print(get_column_letter(3))             # C
print(column_index_from_string("E"))    # 5
print(get_column_letter(27))            # AA</pre>
<div class="bk-warn"><b>행 · 열은 1부터</b> — 엑셀처럼 <code>row=1</code> 이 첫 줄, <code>column=1</code> 이 A 열이에요. 파이썬 리스트처럼 0 을 넣으면 <code>ValueError: Row or column values must be at least 1</code>.</div>
<p>셀에 든 값은 엑셀 칸의 종류대로 파이썬 값이 돼요.</p>
<table class="kb"><tbody><tr><th>엑셀 칸</th><th><code>.value</code></th><th>예(빵집_매출 7월 2행)</th></tr><tr><td>숫자</td><td><code>int</code> · 소수면 <code>float</code></td><td><code>32000</code></td></tr><tr><td>글자</td><td><code>str</code></td><td><code>'딸기케이크'</code></td></tr><tr><td>날짜</td><td><code>datetime</code> — 날짜만 넣었어도 시각 00:00 이 붙어요. 날짜만 쓰려면 <code>.date()</code></td><td><code>datetime(2026, 7, 1, 0, 0)</code></td></tr><tr><td>빈 칸</td><td><code>None</code></td><td>F2(표 밖)</td></tr></tbody></table>
<p>셀은 자기 주소도 알아요: <code>c.coordinate</code>(<code>'A2'</code>) · <code>c.row</code>(<code>2</code>) · <code>c.column</code>(<code>1</code>). 날짜 다루기는 <a href="../python/#lesson/L19" target="_blank" rel="noopener">파이썬 교과서 「날짜 2: 글자 ↔ 날짜 · 비교」 ↗</a> 를 복습하세요.</p>`,
      example: { code: `from openpyxl import load_workbook
from openpyxl.utils import get_column_letter

wb = load_workbook("빵집_매출.xlsx")
ws = wb["7월"]

print(ws["B2"].value, ws["D2"].value)
c = ws.cell(row=2, column=1)
print(c.coordinate, c.row, c.column)
print(c.value, "→", c.value.date())

# 2행을 열마다: 열 글자 · 머리줄 이름 · 값 · 종류
for col in range(1, ws.max_column + 1):
    name = ws.cell(row=1, column=col).value
    v = ws.cell(row=2, column=col).value
    print(get_column_letter(col), name, repr(v), type(v).__name__)`, prep: [SAMPLES_PREP] } },
    { title: 'ws.iter_rows(min_row=2, values_only=True)', html: `<p>여러 칸은 범위로 꺼내요. <code>ws["A1:C3"]</code> 은 <b>줄마다 묶인</b> 셀 튜플이에요(줄 셋 × 칸 셋). 한 열만 잡아도 <code>ws["E2:E4"]</code> 는 칸 하나짜리 줄 셋이에요. 줄 하나는 <code>ws[1]</code>(첫 줄의 셀들).</p>
<p>표 전체는 <code>iter_rows</code> 로 한 줄씩 돌아요. <code>values_only=True</code> 를 주면 셀 대신 <b>값 튜플</b>이 나와요.</p>
<table class="kb"><tbody><tr><th>인자</th><th>뜻</th></tr><tr><td><code>min_row=2</code></td><td>2행부터(머리줄 건너뛰기)</td></tr><tr><td><code>max_row=5</code></td><td>5행까지</td></tr><tr><td><code>min_col=4, max_col=5</code></td><td>D~E 열만(번호로)</td></tr><tr><td><code>values_only=True</code></td><td>값만. 빼면 <code>Cell</code> 튜플</td></tr></tbody></table>
<pre>header = [c.value for c in ws[1]]
records = [dict(zip(header, row)) for row in ws.iter_rows(min_row=2, values_only=True)]
print(records[0]["품목"], records[0]["수량"])</pre>
<p>머리줄 이름과 <code>zip</code> 해서 딕셔너리로 만들면 <code>row[4]</code> 대신 <code>r["수량"]</code> 처럼 <b>이름으로</b> 꺼내요. 열 순서가 다른 파일이 와도 코드가 그대로예요. <code>csv.DictReader</code> 와 같은 생각이에요(<a href="../python/#lesson/L29" target="_blank" rel="noopener">파이썬 교과서 「csv 모듈 제대로」 ↗</a>).</p>
<p>표를 통째로 분석할 거면 pandas 의 <code>pd.read_excel</code> 도 있어요 — <a href="../data/" target="_blank" rel="noopener">데이터 분석 교과서 ↗</a> 의 <code>read_csv</code> 와 같은 모양이에요. 이 교과서는 openpyxl 로 칸 하나하나를 직접 다뤄요.</p>`,
      example: { code: `from openpyxl import load_workbook

wb = load_workbook("빵집_매출.xlsx")
ws = wb["7월"]

for row in ws["A1:C3"]:
    print([c.coordinate for c in row])
print([[c.value for c in row] for row in ws["E2:E4"]])

header = [c.value for c in ws[1]]
print(header)
records = [dict(zip(header, row)) for row in ws.iter_rows(min_row=2, values_only=True)]
print(len(records), "줄")
for r in records[:3]:
    print(r["날짜"].date(), r["품목"], r["단가"] * r["수량"])

cakes = [r["품목"] for r in records if r["분류"] == "케이크"]
print("케이크", len(cakes), "줄:", cakes)`, prep: [SAMPLES_PREP] } },
    { title: 'max_row 의 빈 줄 · 병합 칸 MergedCell', html: `<p>남이 만든 엑셀에는 함정이 숨어 있어요. 둘을 먼저 봐요.</p>
<p><b>① <code>ws.max_row</code> 는 「값이 있는 마지막 줄」 이 아니에요.</b> openpyxl 이 아는 마지막 칸이에요. 누가 엑셀에서 아래쪽 빈 칸에 서식만 칠해 두면 그 줄까지 세요. 게다가 openpyxl 은 빈 칸을 <code>ws["E3"].value</code> 처럼 <b>읽기만 해도</b> 그 칸을 만들어서 <code>max_row</code> · <code>max_column</code> 이 늘어요. 그래서 <code>iter_rows</code> 끝에 <code>(None, None, None)</code> 줄이 따라 나와요. 값이 하나라도 있는 줄만 남기세요.</p>
<pre>rows = [r for r in ws.iter_rows(min_row=2, values_only=True)
        if any(v is not None for v in r)]</pre>
<p><b>② [[병합 칸]]은 왼쪽 위에만 값이 있어요.</b> 엑셀에서 A1:C1 을 합쳐 제목을 달면, 값은 <code>A1</code> 에만 있고 <code>B1</code> · <code>C1</code> 은 <code>MergedCell</code> 이에요. 값은 <code>None</code> 이고, 거기에 쓰면 <code>AttributeError: 'MergedCell' object attribute 'value' is read-only</code>. 어디가 합쳐졌는지는 <code>ws.merged_cells.ranges</code> 에 있어요.</p>
<p>예제는 이런 파일을 직접 흉내 내 만들어요. <code>ws.merge_cells("A1:C1")</code> 이 엑셀의 「병합하고 가운데 맞춤」 이고, <code>number_format</code> 한 줄은 「빈 칸에 서식만 있는」 모양을 만들려고 넣었어요(꾸미기는 [[레슨:F10]]). 진짜로는 카드사에서 받은 <code>가계부_카드내역.xlsx</code> 가 딱 이 모양이에요 — 1 · 2행이 병합 제목, 4행이 머리줄이에요.</p>`,
      example: { code: `from openpyxl import Workbook, load_workbook

# 1) 함정이 든 파일 흉내 내기
wb = Workbook()
ws = wb.active
ws["A1"] = "9월 매출"
ws.merge_cells("A1:C1")         # 제목 칸 병합
ws.append(["품목", "단가", "수량"])
ws.append(["소금빵", 3200, 8])
ws.append(["라테", 4800, 3])
ws["A10"].number_format = "0"   # 값 없이 서식만 있는 칸
wb.save("함정.xlsx")

# 2) 다시 읽기
ws = load_workbook("함정.xlsx").active
print("max_row:", ws.max_row)
rows = [r for r in ws.iter_rows(min_row=3, values_only=True)
        if any(v is not None for v in r)]
print("값이 있는 줄:", len(rows), rows)

print(type(ws["A1"]).__name__, ws["A1"].value)
print(type(ws["B1"]).__name__, ws["B1"].value)
print([str(r) for r in ws.merged_cells.ranges])
try:
    ws["B1"] = "덮어쓰기"
except AttributeError as e:
    print("AttributeError:", e)

print("max_column:", ws.max_column)
x = ws["E3"].value              # 빈 칸을 읽기만 했는데
print(x, "max_column:", ws.max_column)` } },
    { title: '46270 → from_excel · .xls · read_only=True', html: `<p><b>③ 날짜가 숫자로 나올 때.</b> 엑셀은 날짜를 「1900년 1월 1일부터 센 날 수」 로 저장하고, 칸 서식으로 날짜처럼 보여 줘요. 서식이 빠진 칸은 <code>46270</code> 같은 숫자로 읽혀요. <code>from_excel</code> 이 되돌려 줘요. 소수 부분은 시각이에요(<code>.5</code> = 낮 12시).</p>
<pre>from openpyxl.utils.datetime import from_excel

print(from_excel(46270))      # 2026-09-05 00:00:00
print(from_excel(46270.5))    # 2026-09-05 12:00:00</pre>
<p>한 열에 <code>datetime</code> 과 숫자가 섞여 있으면 <code>isinstance</code> 로 갈라요(<a href="../python/#lesson/L18G" target="_blank" rel="noopener">파이썬 교과서 「isinstance」 ↗</a>).</p>
<pre>def to_date(v):
    if isinstance(v, datetime):
        return v.date()
    if isinstance(v, (int, float)):
        return from_excel(v).date()
    return None</pre>
<p><b>④ <code>.xls</code> 는 못 열어요.</b> openpyxl 은 2007년 이후 형식(<code>.xlsx</code>)만 읽어요. 옛 <code>.xls</code> 는 <code>InvalidFileException: openpyxl does not support the old .xls file format…</code> 이 나요. 엑셀에서 「다른 이름으로 저장 → Excel 통합 문서(*.xlsx)」 로 바꿔서 쓰세요. <code>.csv</code> 도 <code>load_workbook</code> 으로는 안 열려요 — <code>csv</code> 모듈로 읽어요.</p>
<p><b>⑤ 큰 파일은 <code>read_only=True</code>.</b> 몇 만 줄짜리는 <code>load_workbook</code> 이 전부 메모리에 올려서 느려요. 읽기만 할 거면 <code>load_workbook("큰파일.xlsx", read_only=True)</code> 로 여세요.</p>
<table class="kb"><tbody><tr><th></th><th>보통</th><th><code>read_only=True</code></th></tr><tr><td>속도 · 메모리</td><td>전부 올림</td><td>빠르고 가벼움</td></tr><tr><td>읽기</td><td>아무 칸이나</td><td><code>iter_rows</code> 로 위에서부터 차례로가 맞아요</td></tr><tr><td>값 바꾸기 · 저장</td><td>돼요</td><td>✗ <code>TypeError: Workbook is read-only</code></td></tr><tr><td>병합 정보</td><td><code>ws.merged_cells</code></td><td>없어요</td></tr><tr><td>끝나면</td><td>—</td><td><code>wb.close()</code> — 파일을 붙잡고 있지 않게</td></tr></tbody></table>`,
      example: { code: `from datetime import datetime
from openpyxl import Workbook, load_workbook
from openpyxl.utils.datetime import from_excel
from openpyxl.utils.exceptions import InvalidFileException

# 날짜 칸 하나가 숫자로 들어간 파일 흉내 내기
wb = Workbook()
ws = wb.active
ws.append(["이용일", "가맹점"])
ws.append([datetime(2026, 9, 3), "김밥천국"])
ws.append([46270, "온라인서점"])
wb.save("날짜.xlsx")


def to_date(v):
    if isinstance(v, datetime):
        return v.date()
    if isinstance(v, (int, float)):
        return from_excel(v).date()
    return None


ws = load_workbook("날짜.xlsx").active
for day, shop in ws.iter_rows(min_row=2, values_only=True):
    print(repr(day), "→", to_date(day), shop)

# .xls 는 못 열어요(이름만 .xls 인 가짜 파일로 시험)
with open("옛파일.xls", "wb") as f:
    f.write(b"old")
try:
    load_workbook("옛파일.xls")
except InvalidFileException as e:
    print("InvalidFileException:", e)

# read_only=True — 읽기만
wb = load_workbook("날짜.xlsx", read_only=True)
ws = wb.active
print(type(ws).__name__)
for row in ws.iter_rows(min_row=2, values_only=True):
    print(row)
try:
    wb.save("고친.xlsx")
except TypeError as e:
    print("TypeError:", e)
wb.close()` } },
  ],
  summary: ['엑셀은 통합 문서 → 시트 → 셀 세 겹: load_workbook(파일) · wb["7월"] · ws["B2"].value 나 ws.cell(row=2, column=3) — 행 · 열은 1부터', '표는 ws.iter_rows(min_row=2, values_only=True) 로 값 튜플을 받고, 머리줄과 dict(zip(header, row)) 로 이름으로 꺼내요 — 날짜는 datetime, 빈 칸은 None', '함정: max_row 는 빈 칸까지 셈(any 로 거르기) · 병합 칸은 왼쪽 위만 값(MergedCell) · 숫자 날짜는 from_excel · .xls 는 못 엶 · 큰 파일은 read_only=True 후 wb.close()'] },
{ id: 'F8', ch: 2, n: 8, title: '새로 만들어 쓰기', mode: 'text',
  tutorSummary: 'openpyxl 로 엑셀 만들기. wb = Workbook() 은 처음부터 시트 하나(이름 "Sheet", wb.active)가 있다 → ws.title = "9월". 한 줄씩 ws.append([...]) — 지금까지 쓴 맨 아래 줄 다음에 붙음, ws.append([]) 는 빈 줄. 자리를 정해 ws["A1"] = 값 · ws.cell(row=r, column=c, value=v)(셀을 돌려줌). wb.save("이름.xlsx") 는 묻지 않고 덮어씀. 습관: 저장 → load_workbook 으로 다시 열어 찍기. 값은 종류 그대로: 숫자는 int/float(「1,500원」 글자는 엑셀이 계산 못 함), 날짜는 date/datetime(다시 읽으면 datetime), 앞자리 0(전화번호 "01012345678" · 우편번호 "04001")은 글자로 — int 로 바꾸면 0이 사라짐. 시트: wb.create_sheet("8월") 은 맨 뒤에(같은 이름이면 "8월1"), wb.move_sheet("8월", offset=-1) 로 앞으로, wb.remove(wb["Sheet"]) 은 시트 객체로 지움, 이름에 / ? * [ ] : 는 ValueError. Windows 에서 엑셀이 그 파일을 열고 있으면 wb.save 가 PermissionError: [Errno 13] Permission denied → try/except PermissionError 로 「엑셀을 닫고 다시」 안내. 있는 파일도 load_workbook → 고치기 → 다른 이름으로 save.',
  pages: [
    { title: 'Workbook() · ws.append([...]) · wb.save', html: `<p>이번엔 거꾸로 엑셀 파일을 <b>만들어요</b>. 새 [[통합 문서]]는 <code>Workbook()</code> 이에요. 처음부터 시트가 하나(이름 <code>"Sheet"</code>) 들어 있어서 <code>wb.active</code> 로 바로 써요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>wb = Workbook()</code></td><td>새 통합 문서(시트 <code>Sheet</code> 하나)</td></tr><tr><td><code>ws.title = "9월"</code></td><td>시트 이름 바꾸기</td></tr><tr><td><code>ws.append([값, 값, …])</code></td><td>리스트 하나 = 한 줄. 지금까지 쓴 <b>맨 아래 줄 다음</b>에 붙어요</td></tr><tr><td><code>ws.append([])</code></td><td>빈 줄 하나</td></tr><tr><td><code>wb.save("주문.xlsx")</code></td><td>파일로 저장</td></tr></tbody></table>
<div class="bk-warn"><b>save 는 묻지 않고 덮어써요</b> — 같은 이름의 파일이 있으면 그냥 바뀌어요. 받은 원본을 고칠 때는 <code>load_workbook</code> 으로 열어 고친 뒤 <b>다른 이름</b>으로 저장하는 게 안전해요.</div>
<p>이 교과서의 습관: <b>저장했으면 <code>load_workbook</code> 으로 다시 열어 찍어 보기.</b> 내가 넣은 값이 정말 그 칸에, 그 종류로 들어갔는지 확인돼요. 그다음 엑셀에서 열어 눈으로 봐요(☐).</p>`,
      example: { code: `from datetime import date
from openpyxl import Workbook, load_workbook

wb = Workbook()
ws = wb.active
print(wb.sheetnames)
ws.title = "9월"
ws.append(["날짜", "품목", "수량"])
ws.append([date(2026, 9, 1), "소금빵", 8])
ws.append([date(2026, 9, 1), "라테", 3])
ws.append([])
ws.append([date(2026, 9, 2), "식빵", 5])
wb.save("주문.xlsx")

# 습관: 다시 열어서 확인
wb2 = load_workbook("주문.xlsx")
print(wb2.sheetnames)
for row in wb2["9월"].iter_rows(values_only=True):
    print(row)` } },
    { title: 'ws["A1"] = … · ws.cell(row, column, value)', html: `<p><code>append</code> 는 줄 단위예요. 칸을 콕 집어 쓰려면 둘 중 하나예요.</p>
<pre>ws["E1"] = "합계"
ws.cell(row=2, column=5, value=25600)</pre>
<p><code>ws.cell(…, value=…)</code> 는 값을 쓰고 그 셀을 돌려줘요. 번호로 쓰니까 반복문과 잘 맞아요.</p>
<pre>for r, (name, price) in enumerate(prices.items(), start=2):
    ws.cell(row=r, column=1, value=name)
    ws.cell(row=r, column=2, value=price)</pre>
<div class="bk-warn"><b>append 는 맨 아래 다음 줄</b> — <code>ws["C3"]</code> 에 먼저 썼다면 그다음 <code>append</code> 는 1행이 아니라 4행에 들어가요. 머리줄을 칸마다 쓰고 나서 <code>append</code> 하면 그 아래로 잘 이어지고요.</div>
<p>있는 파일을 고칠 때도 똑같아요. <code>wb = load_workbook("빵집_매출.xlsx")</code> 로 열고, 칸에 쓰고, <code>wb.save("빵집_매출_고침.xlsx")</code> 처럼 다른 이름으로 저장해요.</p>`,
      example: { code: `from openpyxl import Workbook, load_workbook

prices = {"소금빵": 3200, "크루아상": 3800, "라테": 4800}

wb = Workbook()
ws = wb.active
ws.title = "가격표"
ws["A1"] = "품목"
ws["B1"] = "단가"
for r, (name, price) in enumerate(prices.items(), start=2):
    ws.cell(row=r, column=1, value=name)
    ws.cell(row=r, column=2, value=price)
c = ws.cell(row=1, column=3, value="메모")
print(c.coordinate, c.value)
ws.append(["단팥빵", 2800])   # 맨 아래 다음 줄(5행)
wb.save("가격표.xlsx")

ws = load_workbook("가격표.xlsx")["가격표"]
for row in ws.iter_rows(values_only=True):
    print(row)` } },
    { title: '숫자 · 날짜는 그대로, "01012345678" 은 글자로', html: `<p>엑셀에 넣는 값은 <b>종류</b>가 중요해요. 엑셀은 숫자 칸만 더하고 정렬해요.</p>
<table class="kb"><tbody><tr><th>넣은 값</th><th>다시 읽으면</th><th>엑셀에서</th></tr><tr><td><code>1500</code></td><td><code>1500</code> int</td><td>숫자 — 합계 · 정렬 돼요</td></tr><tr><td><code>"1,500원"</code></td><td><code>'1,500원'</code> str</td><td>글자 — <code>SUM</code> 이 못 더해요</td></tr><tr><td><code>date(2026, 9, 1)</code></td><td><code>datetime(2026, 9, 1, 0, 0)</code></td><td>날짜 — 날짜 순 정렬 · 날짜 계산</td></tr><tr><td><code>"2026-09-01"</code></td><td><code>'2026-09-01'</code> str</td><td>그냥 글자</td></tr><tr><td><code>"01012345678"</code></td><td><code>'01012345678'</code> str</td><td>앞자리 0 이 그대로</td></tr><tr><td><code>int("01012345678")</code></td><td><code>1012345678</code></td><td>0 이 사라져요</td></tr></tbody></table>
<ul><li>금액 · 수량은 <b>숫자로</b> 넣어요. 「원」 · 쉼표 같은 보이는 모양은 칸 서식이 맡아요([[레슨:F10]])</li><li>날짜는 <code>date</code> · <code>datetime</code> 그대로 넣어요. 다시 읽으면 늘 <code>datetime</code> 이에요</li><li><b>전화번호 · 우편번호 · 상품 코드</b>는 숫자가 아니라 이름표예요. 더할 일이 없죠. 글자로 넣어야 앞자리 0(<code>"01012345678"</code> · <code>"00123"</code> · 우편번호 <code>"04001"</code>)이 살아요</li></ul>
<p>엑셀은 「숫자처럼 생긴 글자」 칸에 작은 초록 삼각형 경고를 띄우기도 해요. 일부러 글자로 넣은 거라 그대로 두면 돼요.</p>`,
      example: { code: `from datetime import date
from openpyxl import Workbook, load_workbook

rows = [
    ["숫자", 1500],
    ["글자 금액", "1,500원"],
    ["날짜", date(2026, 9, 1)],
    ["날짜 글자", "2026-09-01"],
    ["전화번호", "01012345678"],
    ["전화번호 int", int("01012345678")],
    ["우편번호", "04001"],
]
wb = Workbook()
ws = wb.active
for row in rows:
    ws.append(row)
wb.save("종류.xlsx")

ws = load_workbook("종류.xlsx").active
for name, v in ws.iter_rows(values_only=True):
    print(name, repr(v), type(v).__name__)` } },
    { title: 'wb.create_sheet · wb.move_sheet · wb.remove', html: `<p>시트를 더하고, 순서를 바꾸고, 지워요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>wb.create_sheet("8월")</code></td><td>새 시트를 <b>맨 뒤에</b>. 만든 시트를 돌려줘요. 같은 이름이 있으면 <code>8월1</code> 처럼 바뀌어요</td></tr><tr><td><code>wb.move_sheet("8월", offset=-1)</code></td><td>지금 자리에서 앞으로 1칸(음수 = 앞, 양수 = 뒤)</td></tr><tr><td><code>wb.remove(wb["Sheet"])</code></td><td>지우기 — 이름이 아니라 <b>시트</b>를 넘겨요</td></tr><tr><td><code>wb.sheetnames</code></td><td>지금 순서 확인</td></tr></tbody></table>
<ul><li><code>Workbook()</code> 이 처음 준 <code>Sheet</code> 를 안 쓸 거면 지우세요. 안 그러면 빈 시트가 맨 앞에 남아요</li><li>시트 이름에 <code>/ \\ ? * [ ] :</code> 는 못 써요 — <code>ValueError: Invalid character / found in sheet title</code>. 31자를 넘기면 경고가 나고, 어떤 프로그램은 못 열어요</li></ul>`,
      example: { code: `from openpyxl import Workbook, load_workbook

wb = Workbook()
for name in ["7월", "9월", "8월"]:
    ws = wb.create_sheet(name)
    ws.append(["날짜", "품목", "수량"])
print(wb.sheetnames)

wb.move_sheet("8월", offset=-1)
print(wb.sheetnames)

wb.remove(wb["Sheet"])
print(wb.sheetnames)

dup = wb.create_sheet("8월")
print(dup.title)
wb.remove(dup)

try:
    wb.create_sheet("9/30")
except ValueError as e:
    print("ValueError:", e)

wb.save("월별.xlsx")
print(load_workbook("월별.xlsx").sheetnames)` } },
    { title: 'wb.save 의 PermissionError · 다시 열어 확인', html: `<p>Windows 에서 <b>엑셀이 그 파일을 열고 있으면</b> 파이썬이 같은 파일에 저장하지 못해요. 엑셀이 파일을 잠가 두거든요.</p>
<pre>Traceback (most recent call last):
  File "C:\\Users\\me\\files-study\\report.py", line 12, in &lt;module&gt;
    wb.save("보고서.xlsx")
  …
PermissionError: [Errno 13] Permission denied: '보고서.xlsx'</pre>
<p>마지막 줄만 보면 돼요. 「권한이 없다」 지만 진짜 까닭은 거의 늘 <b>엑셀에서 그 파일이 열려 있어서</b>예요. 엑셀을 닫고 다시 실행하면 돼요. 자주 돌리는 스크립트라면 알아듣게 알려 주세요.</p>
<pre>try:
    wb.save(path)
except PermissionError:
    print(f"{path} 를 엑셀에서 닫고 다시 실행하세요")</pre>
<p>Mac 에서는 이 에러가 안 날 수도 있어요. 대신 열려 있는 창은 옛 내용 그대로라, 닫고 다시 열어야 새 내용이 보여요.</p>
<div class="bk-warn"><b>읽어 보기</b> — 시작하기 3 의 <code>make_samples.py</code> 를 다시 읽어 보세요. 엑셀을 만드는 코드는 이 레슨에서 배운 것뿐이에요(<code>Workbook()</code> · <code>wb.remove(wb.active)</code> · <code>create_sheet</code> · <code>ws.title</code> · <code>append</code> · <code>append([])</code> · <code>save</code>). 병합 <code>merge_cells</code> 하나만 [[레슨:F7]] 에서 봤어요.</div>`,
      example: { code: `from openpyxl import Workbook, load_workbook


def save_safely(wb, path):
    try:
        wb.save(path)
    except PermissionError:
        print(f"저장 못 했어요: {path} 를 엑셀에서 닫고 다시 실행하세요")
        return False
    print("저장했어요:", path)
    return True


def show(path):
    wb = load_workbook(path)
    for name in wb.sheetnames:
        print("[" + name + "]")
        for row in wb[name].iter_rows(values_only=True):
            print(" ", row)


wb = Workbook()
ws = wb.active
ws.title = "요약"
ws.append(["분류", "수량"])
ws.append(["빵", 52])
ws.append(["음료", 21])
if save_safely(wb, "보고서.xlsx"):
    show("보고서.xlsx")` } },
  ],
  summary: ['Workbook() 에는 시트 Sheet 가 하나 있어요 — ws.title 로 이름을 바꾸고, ws.append([...]) 로 한 줄씩 · ws["A1"] = 값 · ws.cell(row, column, value) 로 칸마다 써요', '숫자 · 날짜는 그 종류 그대로 넣고, 전화번호 · 우편번호처럼 앞자리 0 이 있는 것은 글자로 넣어요 — 저장하면 load_workbook 으로 다시 열어 확인', '시트는 create_sheet · move_sheet · remove(시트) 로 다루고, Windows 에서 엑셀이 파일을 열고 있으면 save 가 PermissionError — 닫고 다시 실행'] },
{ id: 'F9', ch: 2, n: 9, title: '수식과 값: data_only 함정', mode: 'text',
  tutorSummary: '엑셀 수식은 "=" 로 시작하는 글자로 넣는다: ws["D5"] = "=SUM(D2:D4)" · 줄마다 f"=B{r}*C{r}" · 끝 줄은 데이터를 다 쓴 뒤 last = ws.max_row 로 f"=SUM(D2:D{last})". 함수 이름은 한국어 엑셀에서도 영어(SUM · AVERAGE · IF), 인자 구분은 쉼표, 수식 속 글자는 큰따옴표라 파이썬에서는 작은따옴표로 감싼다. 다시 읽으면 수식 글자 그대로(data_type "f"). load_workbook(…, data_only=True) 는 엑셀이 마지막으로 계산해 저장해 둔 값을 읽을 뿐 — openpyxl 은 계산하지 않으므로 openpyxl 로 만든 파일은 아직 계산된 적이 없어 None. 해결 셋: ① 값을 파이썬이 계산해 쓰기(엑셀에서 고쳐도 안 바뀜) ② 수식은 넣고 같은 값을 파이썬으로 계산해 따로 검사(이 교과서의 길) ③ 엑셀 · LibreOffice 에서 한 번 열어 저장하면 data_only=True 에 값이 보임(☐). 또 하나의 함정: data_only=True 로 연 통합 문서를 save 하면 수식이 사라짐 — 고쳐서 저장할 땐 보통으로 연다. openpyxl 은 수식 글자를 검사하지 않음 → from openpyxl.utils import FORMULAE 로 함수 이름 확인("SUMM" 은 없음, 엑셀에서 #NAME?), 최근 함수는 _xlfn. 이 필요.',
  terms: { '계산해 둔 값': '엑셀이 파일을 저장할 때 수식 옆에 같이 적어 두는 「마지막 계산 결과」. data_only=True 가 읽는 값이에요' },
  pages: [
    { title: 'ws["D5"] = "=SUM(D2:D4)" · f"=B{r}*C{r}"', html: `<p>엑셀 수식도 <b>글자로</b> 넣어요. <code>=</code> 로 시작하는 글자면 openpyxl 이 수식으로 저장하고, 엑셀이 파일을 열 때 계산해요.</p>
<pre>ws["D2"] = "=B2*C2"
ws["D5"] = "=SUM(D2:D4)"</pre>
<p>줄마다 같은 수식이면 f-string 으로 행 번호만 바꿔요. 합계 줄은 데이터를 다 쓴 다음 <b>마지막 줄 번호를 계산해서</b> 넣어요. 줄 수가 바뀌어도 코드는 그대로예요.</p>
<pre>last = ws.max_row                      # 데이터 마지막 줄
for r in range(2, last + 1):
    ws[f"D{r}"] = f"=B{r}*C{r}"
ws[f"D{last + 1}"] = f"=SUM(D2:D{last})"</pre>
<ul><li>함수 이름은 <b>한국어 엑셀에서도 영어</b>예요: <code>SUM</code> · <code>AVERAGE</code> · <code>COUNT</code> · <code>MAX</code> · <code>IF</code></li><li>인자 사이는 <b>쉼표</b>예요. 화면에서 세미콜론을 쓰는 나라 설정이라도 파일 안에는 쉼표로 적혀요</li><li>수식 속 글자는 큰따옴표라, 파이썬에서는 작은따옴표로 감싸요: <code>f'=IF(C{r}&gt;=10,"예","")'</code></li></ul>
<p>다시 읽으면 <b>수식 글자 그대로</b> 나와요. 계산된 값이 아니에요. 셀의 <code>data_type</code> 이 <code>'f'</code>(formula)예요.</p>`,
      example: { code: `from openpyxl import Workbook, load_workbook

sales = [("소금빵", 3200, 8), ("라테", 4800, 3), ("식빵", 4500, 12)]

wb = Workbook()
ws = wb.active
ws.title = "9월"
ws.append(["품목", "단가", "수량", "매출", "많이 팔림"])
for row in sales:
    ws.append(list(row))

last = ws.max_row
for r in range(2, last + 1):
    ws[f"D{r}"] = f"=B{r}*C{r}"
    ws[f"E{r}"] = f'=IF(C{r}>=10,"예","")'
ws[f"A{last + 1}"] = "합계"
ws[f"D{last + 1}"] = f"=SUM(D2:D{last})"
wb.save("수식.xlsx")

ws = load_workbook("수식.xlsx")["9월"]
for row in ws.iter_rows(min_row=2, values_only=True):
    print(row)
print(ws["D5"].value, ws["D5"].data_type, ws["B2"].data_type)` } },
    { title: 'load_workbook(data_only=True) 의 None', html: `<p>「수식 말고 계산된 값을 읽고 싶다」 면 <code>load_workbook(파일, data_only=True)</code> 로 열어요. 그런데 openpyxl 로 방금 만든 파일을 이렇게 열면 수식 칸이 <b><code>None</code></b> 이에요.</p>
<p>까닭: <b>openpyxl 은 수식을 계산하지 않아요.</b> 엑셀은 파일을 저장할 때 수식과 함께 [[계산해 둔 값]]을 같이 적어 둬요. <code>data_only=True</code> 는 그 적어 둔 값을 읽을 뿐이에요. openpyxl 이 만든 파일은 엑셀이 한 번도 계산한 적이 없으니 적힌 값이 없어요.</p>
<table class="kb"><tbody><tr><th>마지막에 저장한 프로그램</th><th>보통으로 열기</th><th><code>data_only=True</code></th></tr><tr><td>openpyxl</td><td><code>'=SUM(D2:D4)'</code></td><td><code>None</code></td></tr><tr><td>엑셀 · LibreOffice</td><td><code>'=SUM(D2:D4)'</code></td><td>계산해 둔 값(예: <code>94000</code>)</td></tr></tbody></table>
<p>수식이 아닌 칸(숫자 · 글자 · 날짜)은 어느 쪽으로 열어도 같아요. 달라지는 건 수식 칸뿐이에요.</p>`,
      example: { code: `from openpyxl import Workbook, load_workbook

wb = Workbook()
ws = wb.active
ws.append(["품목", "단가", "수량", "매출"])
ws.append(["소금빵", 3200, 8, "=B2*C2"])
ws.append(["라테", 4800, 3, "=B3*C3"])
ws["D4"] = "=SUM(D2:D3)"
wb.save("값.xlsx")

ws_f = load_workbook("값.xlsx").active
ws_v = load_workbook("값.xlsx", data_only=True).active
for addr in ["A2", "B2", "D2", "D4"]:
    print(addr, repr(ws_f[addr].value), repr(ws_v[addr].value))` } },
    { title: '해결 셋: 파이썬 계산 · 수식 + 검사 · 엑셀', html: `<p>그럼 수식의 값은 어떻게 알까요? 길이 셋이에요.</p>
<table class="kb"><tbody><tr><th>길</th><th>어떻게</th><th>좋은 점 · 아쉬운 점</th></tr><tr><td>① 값만 쓰기</td><td>파이썬이 <code>price * qty</code> 를 계산해서 숫자로 넣어요</td><td>어디서 열어도 값이 보여요. 대신 엑셀에서 수량을 고쳐도 매출이 안 바뀌어요</td></tr><tr><td>② 수식 + 파이썬 검사</td><td>수식은 넣고, <b>같은 값을 파이썬으로 따로 계산</b>해 찍거나 비교해요</td><td>엑셀에서는 살아 있는 수식, 파이썬에서는 확인된 숫자. 이 교과서의 문제들이 이렇게 해요</td></tr><tr><td>③ 엑셀에서 한 번 저장</td><td>만든 파일을 엑셀(LibreOffice)에서 열고 저장해요</td><td>그다음부터 <code>data_only=True</code> 에 값이 보여요. 사람 손이 필요해서 자동으로는 못 해요(☐)</td></tr></tbody></table>
<p>②는 이렇게 해요. 수식 글자가 맞는 범위를 가리키는지 <code>assert</code> 로 보고, 합계는 파이썬이 계산해요.</p>
<pre>assert ws[f"D{last + 1}"].value == f"=SUM(D2:D{last})"
total = sum(price * qty for _, price, qty in sales)
print("엑셀 합계 칸이 보여 줄 값:", total)</pre>
<p>③에서 LibreOffice 는 저장할 때 「형식 유지」 를 물어요. <b>Excel 2007-365 형식(.xlsx) 사용</b>을 고르세요.</p>`,
      example: { code: `from openpyxl import Workbook, load_workbook

sales = [("소금빵", 3200, 8), ("라테", 4800, 3), ("식빵", 4500, 12)]

wb = Workbook()
ws = wb.active
ws.append(["품목", "단가", "수량", "매출(값)", "매출(수식)"])
for r, (name, price, qty) in enumerate(sales, start=2):
    ws.append([name, price, qty, price * qty, f"=B{r}*C{r}"])   # ① 값 · ② 수식
last = ws.max_row
ws[f"E{last + 1}"] = f"=SUM(E2:E{last})"
wb.save("해결.xlsx")

ws = load_workbook("해결.xlsx").active
print(ws["D2"].value, ws["E2"].value)
assert ws[f"E{last + 1}"].value == f"=SUM(E2:E{last})"
total = sum(price * qty for _, price, qty in sales)
print("합계 수식:", ws[f"E{last + 1}"].value)
print("엑셀 합계 칸이 보여 줄 값:", total)

ws_v = load_workbook("해결.xlsx", data_only=True).active
print("data_only:", ws_v["D2"].value, ws_v["E2"].value, ws_v[f"E{last + 1}"].value)` } },
    { title: 'data_only=True 로 저장하면 수식이 사라져요', html: `<p>함정이 하나 더 있어요. <code>data_only=True</code> 로 연 통합 문서는 수식 대신 <b>값만</b> 들고 있어요(openpyxl 이 만든 파일이면 그 값도 <code>None</code>). 그걸 <code>save</code> 하면 수식이 <b>지워진 채로</b> 저장돼요.</p>
<ul><li><code>data_only=True</code> 는 값을 <b>읽기만</b> 할 때</li><li>고쳐서 저장할 때는 보통으로 연 것(<code>load_workbook(파일)</code>)</li><li>둘 다 필요하면 두 번 열어요: 값 읽기용 하나, 고치기용 하나</li></ul>
<p>또 openpyxl 은 수식 글자를 <b>검사하지 않아요</b>. <code>"=SUMM(D2:D4)"</code> 처럼 틀려도 그대로 저장되고, 엑셀에서 열어야 <code>#NAME?</code> 이 보여요. openpyxl 이 아는 함수 이름은 <code>FORMULAE</code> 에 있어요.</p>
<pre>from openpyxl.utils import FORMULAE

print("SUM" in FORMULAE)        # True
print("SUMM" in FORMULAE)       # False
print("AVERAGE" in FORMULAE)    # True</pre>
<p><code>XLOOKUP</code> · <code>IFS</code> 처럼 최근에 생긴 함수는 이 목록에 없어요. 그런 함수는 파일 안에 <code>_xlfn.</code> 을 붙여 적어야 엑셀이 알아봐요(<code>"=_xlfn.IFS(…)"</code>). 이 교과서는 <code>SUM</code> · <code>AVERAGE</code> · <code>IF</code> 같은 오래된 함수만 써요.</p>`,
      example: { code: `from openpyxl import Workbook, load_workbook
from openpyxl.utils import FORMULAE

wb = Workbook()
ws = wb.active
ws.append(["품목", "매출"])
ws.append(["소금빵", 25600])
ws.append(["라테", 14400])
ws["A4"] = "합계"
ws["B4"] = "=SUM(B2:B3)"
wb.save("원본.xlsx")

# data_only=True 로 열어 「그대로」 다른 이름으로 저장하면
load_workbook("원본.xlsx", data_only=True).save("사본.xlsx")
print("원본 B4:", load_workbook("원본.xlsx").active["B4"].value)
print("사본 B4:", load_workbook("사본.xlsx").active["B4"].value)

for name in ["SUM", "SUMM", "AVERAGE", "IF", "XLOOKUP"]:
    print(name, name in FORMULAE)` } },
  ],
  summary: ['수식은 "=" 로 시작하는 글자로 넣어요 — f"=B{r}*C{r}" · f"=SUM(D2:D{last})", 함수 이름은 영어 · 구분은 쉼표, 다시 읽으면 수식 글자 그대로', 'openpyxl 은 수식을 계산하지 않아요 — data_only=True 는 엑셀이 저장해 둔 값을 읽을 뿐이라, openpyxl 로 만든 파일은 None', '해결은 ① 파이썬이 계산한 값 쓰기 ② 수식 + 파이썬 계산으로 검사 ③ 엑셀에서 한 번 열어 저장 — 그리고 data_only=True 로 연 것을 save 하면 수식이 사라져요'] },
{ id: 'F10', ch: 2, n: 10, title: "꾸미기: 서식 · 차트 맛보기", mode: 'text',
  tutorSummary: "openpyxl 꾸미기. 서식은 칸의 값을 바꾸지 않고 보이는 모양만 정한다. from openpyxl.styles import Font, PatternFill, Border, Side, Alignment — c.font = Font(bold=True, color=\"FFFFFF\") · c.fill = PatternFill(\"solid\", fgColor=\"4472C4\")(\"solid\" 를 빼면 fill_type 이 None 이라 안 칠해짐) · c.border = Border(bottom=Side(\"thin\")) · c.alignment = Alignment(horizontal=\"center\"). 머리줄은 for c in ws[1]:. 서식 객체는 고쳐 쓸 수 없다: c.font.bold = True 는 AttributeError(Style objects are immutable) — 새 Font 를 통째로 넣는다(정하지 않은 것은 기본값으로 돌아감). 색은 \"RRGGBB\", 다시 읽으면 \"004472C4\" 여덟 자리. 숫자 모양 c.number_format = \"#,##0\" · '#,##0\"원\"' · \"0.0%\"(값 0.358 → 35.8%, 35.8 을 넣으면 3580.0%) · \"yyyy-mm-dd\" · \"mm-dd\" — 값은 그대로라 합계 · 정렬 · 차트가 된다. f\"{n:,}원\" 글자를 넣으면 숫자가 아니다. 열 하나 전체는 ws[\"B\"], 머리줄 빼고 ws[\"B\"][1:]. 보기: ws.column_dimensions[\"A\"].width = 12(한글은 넉넉히) · ws.row_dimensions[1].height · ws.freeze_panes = \"A2\"(준 칸의 위 줄 · 왼쪽 열이 고정, \"B2\" 는 1행 + A 열, None 은 풀기) · ws.auto_filter.ref = ws.dimensions(머리줄에 필터 단추). 차트: from openpyxl.chart import BarChart, Reference — Reference(ws, min_col, min_row, max_col, max_row), data 는 머리줄부터 + add_data(data, titles_from_data=True), set_categories(cats) 는 2행부터, chart.title · chart.y_axis.title, 쌓기 chart.grouping = \"stacked\" + chart.overlap = 100, ws.add_chart(chart, \"D2\"), 크기 chart.width · height(cm). LineChart · PieChart 도 같은 방법. 확인: 다시 load_workbook 해서 font.b · fill.fgColor.rgb · number_format · width · freeze_panes 찍기, .xlsx 는 zip 이라 zipfile.ZipFile(p).namelist() 에 xl/charts/chart1.xml 이 있으면 차트가 들어 있다(ws._charts 같은 밑줄 이름은 쓰지 않음). 색 · 차트 모양 · 수식 결과는 엑셀(LibreOffice)에서 열어 눈으로.",
  terms: {"서식": "칸의 값은 그대로 두고 보이는 모양(글꼴 · 색 · 테두리 · 숫자 모양)만 정한 것", "틀 고정": "아래 · 옆으로 스크롤해도 위 몇 줄 · 왼쪽 몇 열이 화면에 붙어 있게 하는 엑셀 기능"},
  pages: [
    { title: "머리줄 꾸미기 Font · PatternFill", html: `<p>복습: [[레슨:F8]] 에서 <code>Workbook()</code> · <code>append</code> · <code>save</code> 로 표를 만들었어요. 이번엔 사람이 보기 좋게 꾸며요. 꾸미기([[서식]])는 칸의 값을 바꾸지 않고 <b>보이는 모양</b>만 정해요.</p>
<pre>from openpyxl.styles import Font, PatternFill, Border, Side, Alignment

for c in ws[1]:                       # 1행(머리줄)의 칸들
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor="4472C4")
    c.border = Border(bottom=Side("thin"))
    c.alignment = Alignment(horizontal="center")</pre>
<table class="kb"><tbody><tr><th>무엇</th><th>쓰는 법</th><th>자주 쓰는 값</th></tr>
<tr><td>글꼴</td><td><code>c.font = Font(…)</code></td><td><code>bold=True</code> · <code>italic=True</code> · <code>size=12</code> · <code>color="C00000"</code></td></tr>
<tr><td>칠하기</td><td><code>c.fill = PatternFill("solid", fgColor=…)</code></td><td><code>"4472C4"</code>(파랑) · <code>"FFF2CC"</code>(연노랑)</td></tr>
<tr><td>테두리</td><td><code>c.border = Border(bottom=Side("thin"))</code></td><td><code>left</code> · <code>right</code> · <code>top</code> · <code>bottom</code>, 굵기 <code>"thin"</code> · <code>"medium"</code> · <code>"thick"</code></td></tr>
<tr><td>맞춤</td><td><code>c.alignment = Alignment(…)</code></td><td><code>horizontal="center"</code> · <code>"right"</code>, <code>wrap_text=True</code>(칸 안에서 줄 바꿈)</td></tr></tbody></table>
<ul><li><code>ws[1]</code> 은 1행의 칸들이에요. 머리줄을 꾸밀 때 for 로 돌아요</li><li>색은 <code>"RRGGBB"</code> 16진수 여섯 자리예요. 다시 읽으면 앞에 <code>00</code> 이 붙은 여덟 자리 <code>"004472C4"</code> 로 나와요</li><li>같은 서식을 여러 칸에 줄 때는 <code>HEAD = Font(bold=True)</code> 처럼 한 번 만들어 같이 써도 돼요</li></ul>
<div class="bk-warn"><b>"solid" 를 빼면 안 칠해져요</b> — <code>PatternFill(fgColor="FFC000")</code> 은 에러가 없지만 칠하는 방식 <code>fill_type</code> 이 <code>None</code> 이라 엑셀에서 아무 색도 안 보여요.</div>
<div class="bk-warn"><b>서식은 고쳐 쓸 수 없어요</b> — <code>c.font.bold = True</code> 는 <code>AttributeError: Style objects are immutable</code> 이에요. 늘 <code>c.font = Font(bold=True)</code> 처럼 새로 만들어 통째로 넣어요. 새 Font 는 정하지 않은 것(크기 · 색)을 기본값으로 돌려요.</div>`,
      example: { code: `from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font, PatternFill, Border, Side, Alignment

wb = Workbook()
ws = wb.active
ws.append(["품목", "분류", "매출"])
ws.append(["소금빵", "빵", 262400])
ws.append(["라테", "음료", 206400])

for c in ws[1]:
    c.font = Font(bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor="4472C4")
    c.border = Border(bottom=Side("thin"))
    c.alignment = Alignment(horizontal="center")
ws["A3"].fill = PatternFill(fgColor="FFC000")   # "solid" 를 빼면?
wb.save("꾸밈.xlsx")

ws = load_workbook("꾸밈.xlsx").active
for name in ["A1", "A2", "A3"]:
    c = ws[name]
    print(name, c.value, "| 굵게", c.font.b, "| 칠", c.fill.fill_type, c.fill.fgColor.rgb)
print("A1 글자색:", ws["A1"].font.color.rgb)
print("A1 아래 줄:", ws["A1"].border.bottom.style, "| 맞춤:", ws["A1"].alignment.horizontal)

try:
    ws["A2"].font.bold = True
except AttributeError as e:
    print("AttributeError:", e)` } },
    { title: "number_format = \"#,##0\" — 값은 그대로", html: `<p>[[서식]]의 하나인 <code>number_format</code> 은 숫자 · 날짜가 <b>어떻게 보일지</b>만 정해요. 칸 안의 값은 그대로라서 엑셀에서 합계 · 정렬 · 차트가 그대로 돼요.</p>
<table class="kb"><tbody><tr><th>number_format</th><th>넣은 값</th><th>엑셀에 보이는 모양</th></tr>
<tr><td><code>"#,##0"</code></td><td><code>1015800</code></td><td>1,015,800</td></tr>
<tr><td><code>'#,##0"원"'</code></td><td><code>1015800</code></td><td>1,015,800원</td></tr>
<tr><td><code>"0.0%"</code></td><td><code>0.358</code></td><td>35.8%</td></tr>
<tr><td><code>"yyyy-mm-dd"</code></td><td><code>date(2026, 9, 1)</code></td><td>2026-09-01</td></tr>
<tr><td><code>"mm-dd"</code></td><td><code>date(2026, 9, 1)</code></td><td>09-01</td></tr></tbody></table>
<pre>for c in ws["B"]:                     # B 열 전체(머리줄 칸까지)
    c.number_format = "#,##0"
for c in ws["C"][1:]:                 # 머리줄은 빼고
    c.number_format = "0.0%"</pre>
<ul><li><code>ws["B"]</code> 는 B 열의 칸들이에요. <code>[1:]</code> 로 머리줄을 빼요. 글자 칸(머리줄)에 숫자 모양을 줘도 아무 일 없어요</li><li>모양 안에 글자를 넣을 땐 큰따옴표로 감싸요: <code>'#,##0"원"'</code>. 파이썬 쪽은 작은따옴표로 감싸면 편해요</li><li>비율은 <code>0.358</code> 을 넣고 <code>"0.0%"</code> 로 보여요. <code>35.8</code> 을 넣으면 3580.0% 가 돼요</li><li>날짜를 넣으면 openpyxl 이 <code>"yyyy-mm-dd"</code> 를 알아서 줘요. 다시 읽으면 <code>datetime</code> 이에요(복습: [[레슨:F7]])</li></ul>
<div class="bk-warn"><b>f"{n:,}원" 글자를 넣지 마세요</b> — <code>"1,015,800원"</code> 은 숫자가 아니라 글자예요. 엑셀에서 왼쪽에 붙고, 더하기 · 정렬이 안 돼요. 카드사 파일이 이런 모양이라 다시 읽을 때 고생해요([[레슨:FB3]]). 값은 숫자로 넣고, 모양은 <code>number_format</code> 으로 줘요.</div>`,
      example: { code: `from datetime import date
from openpyxl import Workbook, load_workbook

wb = Workbook()
ws = wb.active
ws.append(["날짜", "매출", "비율", "글자로 넣은 매출"])
ws.append([date(2026, 9, 1), 1015800, 0.358, f"{1015800:,}원"])
ws.append([date(2026, 9, 2), 864900, 0.305, f"{864900:,}원"])

for c in ws["A"][1:]:
    c.number_format = "mm-dd"
for c in ws["B"][1:]:
    c.number_format = '#,##0"원"'
for c in ws["C"][1:]:
    c.number_format = "0.0%"
wb.save("모양.xlsx")

ws = load_workbook("모양.xlsx").active
for c in ws[2]:
    print(c.coordinate, repr(c.value), "|", c.number_format)
print("B 열 합계:", sum(c.value for c in ws["B"][1:]))
print("D 열 값의 종류:", type(ws["D2"].value).__name__)` } },
    { title: "열 너비 · freeze_panes · 필터 단추", html: `<p>표가 길어지면 보는 법도 정해 줘요. 열 너비 · [[틀 고정]] · 필터 단추예요. 다 시트(<code>ws</code>)에 정해요.</p>
<pre>ws.column_dimensions["A"].width = 12     # A 열 너비(글자 수쯤)
ws.row_dimensions[1].height = 24         # 1행 높이(포인트)
ws.freeze_panes = "A2"                   # 1행 고정
ws.auto_filter.ref = ws.dimensions       # 머리줄에 필터 단추</pre>
<ul><li><b>너비</b> — 숫자는 대략 영어 글자 몇 개가 들어가는지예요. 한글은 한 글자가 두 칸쯤이라 넉넉히 줘요. 열이 많으면 <code>get_column_letter(i)</code> 로 열 글자를 만들어 for 로 돌아요(복습: [[레슨:F7]])</li><li><b>틀 고정</b> — 준 칸의 <b>위 줄들과 왼쪽 열들</b>이 고정돼요. <code>"A2"</code> 는 1행, <code>"B2"</code> 는 1행과 A 열, <code>None</code> 은 풀기예요</li><li><b>필터</b> — <code>ws.dimensions</code> 는 값이 든 범위 글자(<code>"A1:E31"</code>)예요. 그 범위의 머리줄에 ▼ 단추가 생겨서, 엑셀에서 「빵만 보기」 같은 걸 할 수 있어요. 단추만 다는 것이고 파이썬이 줄을 거르는 건 아니에요</li></ul>`,
      example: { code: `from openpyxl import Workbook, load_workbook
from openpyxl.utils import get_column_letter

wb = Workbook()
ws = wb.active
ws.append(["날짜", "품목", "분류", "단가", "수량"])
for day in range(1, 31):
    ws.append([f"9월 {day}일", "소금빵", "빵", 3200, day % 7 + 3])

widths = [12, 14, 8, 10, 8]
for i, w in enumerate(widths, 1):
    ws.column_dimensions[get_column_letter(i)].width = w
ws.row_dimensions[1].height = 24
ws.freeze_panes = "A2"
ws.auto_filter.ref = ws.dimensions
wb.save("보기.xlsx")

ws = load_workbook("보기.xlsx").active
print("너비:", [ws.column_dimensions[get_column_letter(i)].width for i in range(1, 6)])
print("1행 높이:", ws.row_dimensions[1].height)
print("틀 고정:", ws.freeze_panes)
print("필터:", ws.auto_filter.ref, "| 표 범위:", ws.dimensions)` } },
    { title: "차트 맛보기 BarChart · Reference", html: `<p>엑셀 차트는 「어느 칸들을 그릴지」 를 가리켜서 만들어요. 값을 복사하지 않아서, 엑셀에서 숫자를 고치면 막대도 따라 바뀌어요.</p>
<pre>from openpyxl.chart import BarChart, Reference

chart = BarChart()
chart.title = "월별 매출"
chart.y_axis.title = "원"
data = Reference(ws, min_col=2, min_row=1, max_row=4)   # B1:B4 — 머리줄부터
cats = Reference(ws, min_col=1, min_row=2, max_row=4)   # A2:A4 — 막대 이름
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
ws.add_chart(chart, "D2")</pre>
<ul><li><code>Reference(ws, min_col, min_row, max_col, max_row)</code> — 칸 범위를 번호로 줘요. <code>max_col</code> 을 빼면 열 하나예요</li><li><code>titles_from_data=True</code> — 범위의 첫 칸(B1 「매출」)을 계열 이름(범례)으로 써요. 그래서 <code>data</code> 는 <b>머리줄부터</b>, <code>cats</code> 는 <b>2행부터</b>예요. <code>cats</code> 를 1행부터 잡으면 첫 막대 이름이 「월」 이 되고 하나씩 밀려요</li><li><code>min_col=2, max_col=4</code> 처럼 여러 열을 주면 열마다 계열이 하나씩 생겨요(분류마다 다른 색 막대)</li><li>계열을 한 막대에 쌓으려면 <code>chart.grouping = "stacked"</code> 와 <code>chart.overlap = 100</code></li><li><code>ws.add_chart(chart, "D2")</code> — 차트의 왼쪽 위를 D2 칸에 놓아요. 크기는 <code>chart.width = 18</code> · <code>chart.height = 9</code>(cm)</li><li>선 그래프 <code>LineChart</code> · 원 그래프 <code>PieChart</code> 도 import 만 바꾸면 같은 방법이에요</li></ul>`,
      example: { code: `from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference

wb = Workbook()
ws = wb.active
ws.title = "요약"
ws.append(["월", "매출"])
for row in [["7월", 957400], ["8월", 864900], ["9월", 1015800]]:
    ws.append(row)

chart = BarChart()
chart.title = "월별 매출"
chart.y_axis.title = "원"
data = Reference(ws, min_col=2, min_row=1, max_row=4)
cats = Reference(ws, min_col=1, min_row=2, max_row=4)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
ws.add_chart(chart, "D2")
wb.save("차트.xlsx")

print("그릴 값:", data)
print("막대 이름:", cats)
print("저장했어요: 차트.xlsx")` } },
    { title: "zipfile 로 차트 확인 · 다시 읽어 찍기", html: `<p>이 코스의 습관이에요. <b>저장 → 다시 열어 찍기 → 엑셀에서 열어 눈으로 ☐</b>. 서식도 다시 읽으면 파이썬으로 확인할 수 있어요.</p>
<table class="kb"><tbody><tr><th>확인할 것</th><th>다시 읽어 찍기</th></tr>
<tr><td>굵게 · 글자색</td><td><code>c.font.b</code> · <code>c.font.color.rgb</code></td></tr>
<tr><td>칠하기</td><td><code>c.fill.fill_type</code> · <code>c.fill.fgColor.rgb</code></td></tr>
<tr><td>숫자 모양</td><td><code>c.number_format</code></td></tr>
<tr><td>너비 · 틀 고정 · 필터</td><td><code>ws.column_dimensions["A"].width</code> · <code>ws.freeze_panes</code> · <code>ws.auto_filter.ref</code></td></tr>
<tr><td>수식</td><td><code>c.value</code> 는 수식 글자 <code>"=SUM(B2:B3)"</code>, <code>data_only=True</code> 로 열면 <code>None</code>(복습: [[레슨:F9]])</td></tr>
<tr><td>차트</td><td>zip 목록에 <code>xl/charts/chart1.xml</code></td></tr></tbody></table>
<p>차트는 왜 zip 으로 볼까요? <code>.xlsx</code> 는 사실 <b>zip 압축 파일</b>이에요. 안에 시트마다 xml 글자 파일이 들어 있고, 차트가 하나 들어가면 <code>xl/charts/chart1.xml</code> 이 생겨요. 파이썬에 들어 있는 <code>zipfile</code> 로 목록을 봐요.</p>
<pre>import zipfile

with zipfile.ZipFile("확인.xlsx") as z:
    names = z.namelist()
print("xl/charts/chart1.xml" in names)</pre>
<ul><li>openpyxl 의 <code>ws._charts</code> 처럼 밑줄로 시작하는 이름은 속사정이라 판이 바뀌면 달라질 수 있어요. 그래서 파일 자체를 봐요</li><li>파일 이름 끝을 <code>.zip</code> 으로 바꿔 탐색기에서 열어 봐도 같은 폴더들이 보여요(다 보면 다시 <code>.xlsx</code> 로)</li></ul>
<p>색이 알맞은지, 막대가 그럴듯한지, 수식 칸에 맞는 합계가 보이는지는 파이썬이 못 봐요. 엑셀(또는 LibreOffice Calc)에서 열어 <b>눈으로</b> 확인해요. 「만들어 보기」 의 「내 화면에서 확인할 것」 ☐ 이 그거예요.</p>`,
      example: { code: `import zipfile
from openpyxl import Workbook, load_workbook
from openpyxl.styles import Font
from openpyxl.chart import BarChart, Reference

wb = Workbook()
ws = wb.active
ws.append(["월", "매출"])
ws.append(["7월", 957400])
ws.append(["8월", 864900])
ws["A4"] = "합계"
ws["B4"] = "=SUM(B2:B3)"
ws["A1"].font = Font(bold=True)
for c in ws["B"][1:]:
    c.number_format = "#,##0"
chart = BarChart()
chart.add_data(Reference(ws, min_col=2, min_row=1, max_row=3), titles_from_data=True)
ws.add_chart(chart, "D2")
wb.save("확인.xlsx")


def check(path):
    ws = load_workbook(path).active
    print("A1 굵게:", ws["A1"].font.b)
    print("B2 모양:", ws["B2"].number_format)
    print("B4 수식:", ws["B4"].value)
    print("B4 값(data_only):", load_workbook(path, data_only=True).active["B4"].value)
    print("파이썬 합계:", ws["B2"].value + ws["B3"].value)
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
    print("차트 파일:", [n for n in names if n.startswith("xl/charts/")])
    print("시트 파일:", [n for n in names if n.startswith("xl/worksheets/sheet")])


check("확인.xlsx")` } },
  ],
  summary: ["서식은 보이는 모양만 — c.font = Font(bold=True) · PatternFill(\"solid\", fgColor=…) 처럼 늘 새로 만들어 통째로 넣어요(\"solid\" 를 빼면 안 칠해져요)", "number_format(\"#,##0\" · \"0.0%\" · \"yyyy-mm-dd\")은 값을 그대로 두니 숫자는 숫자로 넣어요 — 보기는 column_dimensions · freeze_panes · auto_filter", "차트는 Reference(데이터는 머리줄부터 · 이름은 2행부터) + add_chart — 확인은 다시 읽어 찍기 + zip 목록의 xl/charts/chart1.xml, 겉모양은 엑셀에서 ☐"] },
{ id: 'F11', ch: 2, n: 11, title: "여러 시트 · 여러 파일 합치기", mode: 'text',
  tutorSummary: "여러 시트 · 여러 파일을 한 표로. for ws in wb: 는 wb.sheetnames 순서로 시트를 준다 — it = ws.iter_rows(values_only=True), header = next(it), 나머지 줄은 dict(zip(header, row)) 에 rec[\"월\"] = ws.title 처럼 시트 이름을 값으로 더한다. 메모 시트는 if not ws.title.endswith(\"월\"): continue. 여러 파일: for p in sorted(Path(\"지점\").glob(\"*.xlsx\")):(glob 은 순서가 없어 sorted, p.stem 이 출처 이름, 하위 폴더까지는 rglob). Windows 에서 엑셀이 파일을 열고 있으면 같은 폴더에 숨은 잠금 파일 ~$강남.xlsx 가 생긴다(엑셀이 갑자기 꺼지면 남음) — 진짜 엑셀이 아니라 load_workbook 하면 zipfile.BadZipFile: File is not a zip file 이므로 p.name.startswith(\"~$\") 면 건너뛴다. 열 순서가 다른 파일(판교: 품목 · 날짜 · 수량 · 단가 · 분류)은 자리(row[3])로 꺼내면 엉뚱한 값이 들어가거나 TypeError — 머리줄 이름으로 맞춘다: COLUMNS 를 정하고 [rec.get(c) for c in COLUMNS], 머리줄 글자는 str(h).strip(). 빠진 열은 멈추지 말고 경고만 하고 None(엑셀에서 빈칸). 합친 결과는 새 통합 문서의 「전체」 시트에 맨 앞 「출처」 열과 함께, 요약은 wb.create_sheet(\"요약\", 0)(0 = 맨 앞). wb.active 는 「몇 번째 시트」 라서 맨 앞에 끼우면 끼운 시트가 처음 보인다. 요약의 합계는 파이썬이 계산한 값으로(수식이면 data_only 로도 None). pandas 로는 pd.read_excel(sheet_name=None) + pd.concat — 데이터 분석 교과서 P5.",
  terms: {"출처": "합친 표에서 그 줄이 어느 파일 · 시트에서 왔는지 적어 둔 칸", "잠금 파일": "엑셀이 파일을 열고 있는 동안 같은 폴더에 만드는 숨은 파일(~$이름.xlsx). 진짜 엑셀 파일이 아니다"},
  pages: [
    { title: "for ws in wb: — 시트 이름을 「월」 칸으로", html: `<p>복습: [[레슨:F7]] 의 <code>iter_rows(values_only=True)</code> 와 <code>dict(zip(header, row))</code> 예요. 이번엔 시트 <b>여러 개</b>를 한 번에 읽어 한 표로 모아요. 빵집 파일처럼 「7월 · 8월 · 9월」 시트가 같은 모양일 때예요.</p>
<pre>rows = []
for ws in wb:                            # 시트를 순서대로
    it = ws.iter_rows(values_only=True)
    header = next(it)                    # 첫 줄 = 머리줄
    for row in it:
        rec = dict(zip(header, row))
        rec["월"] = ws.title             # 시트 이름을 값으로
        rows.append(rec)</pre>
<ul><li><code>for ws in wb:</code> 는 <code>wb.sheetnames</code> 순서대로 시트를 하나씩 줘요. 이름만 필요하면 <code>wb.sheetnames</code> 예요</li><li><code>next(it)</code> 는 줄을 하나 꺼내요. 머리줄을 꺼내고 나면 <code>for row in it</code> 은 2행부터 돌아요(<a href="../python/#lesson/L18C" target="_blank" rel="noopener">파이썬 교과서 「반복자와 제너레이터」 ↗</a>)</li><li>시트 이름이 곧 데이터예요. 합치면 어느 시트에서 왔는지 사라지니까 <code>rec["월"] = ws.title</code> 로 칸을 하나 더 만들어 둬요</li><li>메모 · 설명 시트가 섞여 있으면 걸러요: <code>if not ws.title.endswith("월"): continue</code></li></ul>`,
      example: { code: `from openpyxl import Workbook, load_workbook

wb = Workbook()
wb.active.title = "7월"
wb.create_sheet("8월")
wb.create_sheet("메모")
wb["7월"].append(["품목", "수량"])
wb["7월"].append(["소금빵", 8])
wb["7월"].append(["라테", 19])
wb["8월"].append(["품목", "수량"])
wb["8월"].append(["소금빵", 10])
wb["메모"].append(["8월 15일은 쉬는 날"])
wb.save("월별.xlsx")

wb = load_workbook("월별.xlsx")
print("시트:", wb.sheetnames)
rows = []
for ws in wb:
    if not ws.title.endswith("월"):
        print("건너뜀:", ws.title)
        continue
    it = ws.iter_rows(values_only=True)
    header = next(it)
    for row in it:
        rec = dict(zip(header, row))
        rec["월"] = ws.title
        rows.append(rec)
for rec in rows:
    print(rec)` } },
    { title: "glob(\"*.xlsx\") · ~$ 잠금 파일 건너뛰기", html: `<p>지점마다 파일을 따로 받는 일이 많아요. <code>지점</code> 폴더의 엑셀을 다 돌 때는 pathlib 의 <code>glob</code> 을 써요(복습: <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a>).</p>
<pre>from pathlib import Path

for p in sorted(Path("지점").glob("*.xlsx")):
    if p.name.startswith("~$"):
        print("건너뜀:", p.name)
        continue
    ws = load_workbook(p).active
    print(p.stem, ws.max_row - 1, "줄")</pre>
<ul><li><code>sorted</code> — glob 이 주는 순서는 정해져 있지 않아요. 늘 같은 순서로 돌게 정렬해요</li><li><code>p.stem</code> 은 확장자를 뺀 이름(<code>"강남"</code>)이에요. [[출처]] 칸에 그대로 써요</li><li>하위 폴더까지 다 찾으려면 <code>rglob("*.xlsx")</code> 예요</li></ul>
<div class="bk-warn"><b>~$ 로 시작하는 파일</b> — Windows 에서 엑셀이 <code>강남.xlsx</code> 를 열고 있으면, 같은 폴더에 숨은 [[잠금 파일]] <code>~$강남.xlsx</code> 가 생겨요. 엑셀을 닫으면 사라지지만, 엑셀이 갑자기 꺼지면 남기도 해요. 이름은 <code>.xlsx</code> 인데 진짜 엑셀이 아니라서 <code>load_workbook</code> 하면 <code>zipfile.BadZipFile: File is not a zip file</code> 이에요. 이름만 보고 건너뛰어요.</div>`,
      example: { code: `from pathlib import Path
from openpyxl import Workbook, load_workbook

folder = Path("지점")
folder.mkdir(exist_ok=True)
for name, qty in [("강남", 11), ("홍대", 18)]:
    wb = Workbook()
    wb.active.append(["품목", "수량"])
    wb.active.append(["소금빵", qty])
    wb.save(folder / f"{name}.xlsx")
(folder / "~$강남.xlsx").write_text("엑셀이 열려 있을 때 생기는 잠금 파일 흉내", encoding="utf-8")

for p in sorted(folder.glob("*.xlsx")):
    if p.name.startswith("~$"):
        print("건너뜀:", p.name)
        continue
    ws = load_workbook(p).active
    print(p.stem, "|", p.name, "| 수량", ws["B2"].value)

try:
    load_workbook(folder / "~$강남.xlsx")
except Exception as e:
    print("안 건너뛰면:", type(e).__name__, "-", e)` } },
    { title: "COLUMNS 순서로 열 맞추기 · 빠진 열 경고", html: `<p>판교 파일만 열 순서가 <code>품목 · 날짜 · 수량 · 단가 · 분류</code> 예요. 자리로(<code>row[1]</code>) 꺼내면 판교에서는 품목 자리에 날짜가 들어와요. 에러도 안 나서 더 무서워요. 그래서 <b>머리줄 이름으로</b> 꺼내요.</p>
<pre>COLUMNS = ["날짜", "품목", "분류", "단가", "수량"]

def read_table(ws, source):
    it = ws.iter_rows(values_only=True)
    header = [str(h).strip() for h in next(it)]
    missing = [c for c in COLUMNS if c not in header]
    if missing:
        print(f"경고: {source} 파일에 {', '.join(missing)} 열이 없어요")
    out = []
    for row in it:
        rec = dict(zip(header, row))
        out.append([source] + [rec.get(c) for c in COLUMNS])
    return out</pre>
<ul><li>내가 원하는 열 순서 <code>COLUMNS</code> 를 정해 두고, 줄마다 이름표(딕셔너리)를 만든 뒤 그 순서로 다시 줄 세워요. 파일의 열 순서와 상관없어져요</li><li><code>str(h).strip()</code> — 머리줄에 <code>" 수량 "</code> 처럼 빈칸이 붙어 오는 일이 흔해요</li><li>빠진 열에서 멈추지 말고 <b>경고</b>만 하고, <code>rec.get(c)</code> 로 <code>None</code>(엑셀에서 빈칸)을 넣어요. 어느 파일에 무엇이 빠졌는지 한 번에 보여요</li><li><code>COLUMNS</code> 에 없는 열(예: 「메모」)은 버려져요. 필요하면 그것도 알려 줘요</li></ul>`,
      example: { code: `from openpyxl import Workbook

COLUMNS = ["날짜", "품목", "분류", "단가", "수량"]


def read_table(ws, source):
    it = ws.iter_rows(values_only=True)
    header = [str(h).strip() for h in next(it)]
    missing = [c for c in COLUMNS if c not in header]
    if missing:
        print(f"경고: {source} 파일에 {', '.join(missing)} 열이 없어요")
    out = []
    for row in it:
        rec = dict(zip(header, row))
        out.append([source] + [rec.get(c) for c in COLUMNS])
    return out


wb = Workbook()
a = wb.active
a.append(["날짜", "품목", "분류", "단가", "수량"])
a.append(["09-01", "크루아상", "빵", 3800, 11])
b = wb.create_sheet()
b.append(["품목", "날짜", "수량", "단가", "분류"])
b.append(["식빵", "09-05", 14, 4500, "빵"])
c = wb.create_sheet()
c.append(["날짜", "품목", "단가", " 수량 "])
c.append(["09-07", "라테", 4800, 3])

row = next(b.iter_rows(min_row=2, values_only=True))
print("판교를 자리로 꺼낸 품목:", row[1])
for source, ws in [("강남", a), ("판교", b), ("분당", c)]:
    for r in read_table(ws, source):
        print(r)` } },
    { title: "「출처」 열 · create_sheet(\"요약\", 0)", html: `<p>합친 결과는 새 통합 문서에 써요. 모든 줄 맨 앞에 [[출처]] 칸을 두고, 맨 앞에는 한눈에 보는 요약 시트를 둬요.</p>
<pre>out = Workbook()
ws = out.active
ws.title = "전체"
ws.append(["출처"] + COLUMNS)
for r in all_rows:
    ws.append(r)

summary = out.create_sheet("요약", 0)    # 0 = 맨 앞 자리
summary.append(["출처", "줄 수", "매출"])
for r in summary_rows:
    summary.append(r)
out.save("합친.xlsx")</pre>
<ul><li><code>create_sheet(이름, 자리)</code> — 자리 <code>0</code> 은 맨 앞이에요. 빼면 맨 뒤예요</li><li>파일을 열면 처음 보이는 시트는 <code>wb.active</code> 예요. 「몇 번째 시트」 로 기억해서, 맨 앞에 끼우면 끼운 시트가 처음 보여요</li><li>요약의 합계는 파이썬이 계산한 값으로 써요. 수식으로 넣으면 다시 읽을 때 <code>data_only=True</code> 로도 <code>None</code> 이에요(복습: [[레슨:F9]])</li><li>출처 칸이 있으면 이상한 줄을 봤을 때 어느 파일을 열어 볼지 바로 알아요</li></ul>
<p>pandas 로도 돼요 — <code>pd.read_excel(…, sheet_name=None)</code> 로 시트를 다 읽고 <code>pd.concat</code> 으로 이어요. <a href="../data/#lesson/P5" target="_blank" rel="noopener">데이터 분석 교과서 「합치기 merge · concat」 ↗</a></p>`,
      example: { code: `from openpyxl import Workbook, load_workbook

tables = {
    "강남": [["크루아상", 3800, 11], ["아메리카노", 4000, 18]],
    "홍대": [["식빵", 4500, 14]],
}
out = Workbook()
ws = out.active
ws.title = "전체"
ws.append(["출처", "품목", "단가", "수량"])
summary_rows = []
for source, rows in tables.items():
    total = 0
    for name, price, qty in rows:
        ws.append([source, name, price, qty])
        total += price * qty
    summary_rows.append([source, len(rows), total])

summary = out.create_sheet("요약", 0)
summary.append(["출처", "줄 수", "매출"])
for r in summary_rows:
    summary.append(r)
summary.append(["합계", sum(r[1] for r in summary_rows), sum(r[2] for r in summary_rows)])
out.save("합친.xlsx")

wb = load_workbook("합친.xlsx")
print(wb.sheetnames, "| 처음 보이는 시트:", wb.active.title)
for row in wb["요약"].iter_rows(values_only=True):
    print(row)
print("전체 시트 3행:", [c.value for c in wb["전체"][3]])` } },
  ],
  summary: ["for ws in wb: 로 시트를 돌고, 합칠 땐 rec[\"월\"] = ws.title 처럼 시트 · 파일 이름을 칸으로 남겨요", "sorted(Path(\"지점\").glob(\"*.xlsx\")) 로 파일을 돌되 ~$ 잠금 파일은 이름만 보고 건너뛰어요(안 그러면 BadZipFile)", "열 순서는 믿지 말고 머리줄 이름으로 맞추고(빠진 열은 경고 + 빈칸), 결과는 「출처」 열 + create_sheet(\"요약\", 0)"] },
{ id: 'FB2', ch: 2, boss: true, title: "만들어 보기: 월별 매출 보고서", mode: 'text', pages: [], summary: [],
  tutorSummary: "챕터 2 만들어 보기. 빵집_매출.xlsx(시트 7월 · 8월 · 9월, 날짜 · 품목 · 분류 · 단가 · 수량 20줄씩, 매출 = 단가 × 수량)로 3분기 매출 보고서를 만든다. ① read_sales(path) — for ws in wb + dict(zip(header, row)) + 월 · 매출 칸, 월별 합계(7월 957,400 · 8월 864,900 · 9월 1,015,800 · 합계 2,838,100) ② 분류별 합계(빵 · 케이크 · 음료)와 비율, 품목 매출 TOP 3(딸기케이크 · 식빵 · 크루아상) ③ 매출_보고서.xlsx 「요약」 시트: 월 × 분류 표(값은 파이썬 계산) + 합계 열 =SUM(B2:D2) · 합계 줄 =SUM(B2:B4) 수식 + 머리줄 색 · #,##0 · 열 너비 · 틀 고정 B2, 다시 읽어 찍고 data_only=True 의 E5 는 None ④ 분류를 쌓은 월별 막대 차트(grouping stacked · overlap 100, G2), zip 목록의 xl/charts/chart1.xml 로 확인 ⑤ make_report(src, dst) 함수(report.py, if __name__ == \"__main__\")로 묶어 「요약」 + 「품목」(순위 · TOP 3 칠) 시트를 쓰고 결과 딕셔너리를 돌려줌, check_report 로 다시 읽어 시트 순서 · 수식 글자 · data_only None · 파이썬 합계 · TOP 3 · 차트 파일을 assert, 그리고 엑셀에서 열어 ☐(색 · 차트 · 수식 결과가 파이썬 합계와 같은지). 업무 자동화 교과서가 make_report 를 불러 쓴다." },
{ id: 'F12', ch: 3, n: 12, title: 'JSON ↔ CSV ↔ 엑셀', mode: 'text', draft: true,
  tutorSummary: '잃는 것 · 바꿀 함수표 · 왕복',
  pages: FILES_TODO('잃는 것 · 바꿀 함수표 · 왕복'), summary: ["잃는 것", "바꿀 함수표", "왕복"] },
{ id: 'F13', ch: 3, n: 13, title: '중첩 JSON 을 표로 펴기', mode: 'text', draft: true,
  tutorSummary: 'flatten · 줄로 늘리기 · 두 표',
  pages: FILES_TODO('flatten · 줄로 늘리기 · 두 표'), summary: ["flatten", "줄로 늘리기", "두 표"] },
{ id: 'F14', ch: 3, n: 14, title: 'TOML 맛보기 · 형식 고르기', mode: 'text', draft: true,
  tutorSummary: 'tomllib · rb · 형식 고르기 표',
  pages: FILES_TODO('tomllib · rb · 형식 고르기 표'), summary: ["tomllib", "rb", "형식 고르기 표"] },
{ id: 'FB3', ch: 3, boss: true, title: '만들어 보기: 가계부 엑셀 → JSON → 보고서', mode: 'text', draft: true,
  tutorSummary: '만들어 보기: 가계부 엑셀 → JSON → 보고서', pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
