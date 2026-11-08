// courses/files/datasets.js — 「데이터 파일 다루기」 교과서의 예제 데이터(v2.41.0). content.js 보다 먼저 읽어서 레슨 예제(example.prep)와 만들어 보기(prep) 둘 다 써요.
// 원본: 이 파일이 원본이에요. 고치면 check_book 이 make_samples.py 를 실제로 돌려 확인해요.
// 가상 데이터(이 교과서가 만든 것 — 저작권 없음). 문제는 prep: [{ name: 'orders.json', text: BOOKSHOP_JSON }] 처럼 준비 파일로 주고,
// 엑셀이 필요한 문제는 SAMPLES_PREP(make_samples.py 를 쓰고 한 번 실행 — 화면에서는 접혀 있음)를 prep 배열에 넣어요.
const SETTINGS_JSON = `{
  "theme": "Dark",
  "font_size": "14",
  "language": "ko",
  "autosave": true,
  "autosave_minutes": 0,
  "editor": {
    "tab_size": 4,
    "word_wrap": "yes"
  },
  "recent_files": ["장보기.txt", "회의록.txt", "일기.txt"]
}
`;
const BOOKSHOP_JSON = `{
  "status": "ok",
  "page": 1,
  "total_pages": 1,
  "data": {
    "orders": [
      {
        "id": "A-1001",
        "ordered_at": "2026-09-03T14:05:00+09:00",
        "status": "paid",
        "customer": {
          "name": "김하늘",
          "email": "sky@example.com",
          "address": {"city": "서울", "district": "마포구", "zip": "04001"}
        },
        "items": [
          {"isbn": "9791100000011", "title": "파이썬 첫걸음", "price": "18000.00", "qty": 1},
          {"isbn": "9791100000028", "title": "엑셀 업무 노트", "price": "12500.00", "qty": 2}
        ]
      },
      {
        "id": "A-1002",
        "ordered_at": "2026-09-03T21:40:00+09:00",
        "status": "paid",
        "customer": {
          "name": "이도윤",
          "email": "doyun@example.com",
          "address": {"city": "성남", "district": "분당구", "zip": "13529"}
        },
        "items": [
          {"isbn": "9791100000035", "title": "데이터 정리의 기술", "price": "22000.00", "qty": 1}
        ]
      },
      {
        "id": "A-1003",
        "ordered_at": "2026-09-04T09:15:00+09:00",
        "status": "cancelled",
        "customer": {"name": "박서준", "email": null, "address": null},
        "items": [
          {"isbn": "9791100000011", "title": "파이썬 첫걸음", "price": "18000.00", "qty": 3}
        ]
      },
      {
        "id": "A-1004",
        "ordered_at": "2026-09-05T00:30:00+09:00",
        "status": "paid",
        "customer": {
          "name": "최유나",
          "email": "yuna@example.com",
          "address": {"city": "서울", "district": "강남구", "zip": "06236"}
        },
        "items": [
          {"isbn": "9791100000042", "title": "하루 10분 SQL", "price": "15800.00", "qty": 1},
          {"isbn": "9791100000028", "title": "엑셀 업무 노트", "price": "12500.00", "qty": 1},
          {"isbn": "9791100000059", "title": "그림으로 보는 네트워크", "price": "19500.00", "qty": 1}
        ]
      }
    ]
  }
}
`;
const EVENTS_JSONL = `{"t": "2026-09-01T09:00:00+09:00", "user": "u01", "event": "open"}
{"t": "2026-09-01T10:07:00+09:00", "user": "u04", "event": "search", "query": "json"}
{"t": "2026-09-01T11:14:00+09:00", "user": "u03", "event": "save", "size_kb": 22}
{"t": "2026-09-01T12:21:00+09:00", "user": "u02", "event": "search", "query": "차트"}
{"t": "2026-09-01T13:28:00+09:00", "user": "u01", "event": "save", "size_kb": 32}
{"t": "2026-09-01T14:35:00+09:00", "user": "u04", "event": "close"}
{"t": "2026-09-01T15:42:00+09:00", "user": "u03", "event": "open"}
{"t": "2026-09-01T16:49:00+09:00", "user": "u02", "event": "search", "query": "차트"}
{"t": "2026-09-01T17:56:00+09:00", "user": "u01", "event": "save", "size_kb": 12}
{"t": "2026-09-01T18:03:00+09:00", "user": "u04", "event": "search", "query": "json"}
{"t": "2026-09-02T09:10:00+09:00", "user": "u03", "event": "save", "size_kb": 22}
{"t": "2026-09-02T10:17:00+09:00", "user": "u02", "event": "close"}
{"t": "2026-09-02T11:24:00+09:00", "user": "u01", "event": "open"}
{"t": "2026-09-02T12:31:00+09:00", "user": "u04", "event": "search", "query": "json"}
{"t": "2026-09-02T13:38:00+09:00", "user": "u03", "event": "save", "size_kb": 42}
{"t": "2026-09-02T14:45:00+09:00", "user": "u02", "event": "search", "query": "차트"}
{"t": "2026-09-02T15:52:00+09:00", "user": "u01", "event": "save", "size_kb": 12}

{"t": "2026-09-02T16:59:00+09:00", "user": "u04", "event": "close"}
{"t": "2026-09-02T17:06:00+09:00", "user": "u03", "event": "open"}
{"t": "2026-09-02T18:13:00+09:00", "user": "u02", "event": "search", "query": "차트"}
{"t": "2026-09-03T09:20:00+09:00", "user": "u01", "event": "save", "size_kb": 32}
{"t": "2026-09-03T10:27:00+09:00", "user": "u04", "event": "search", "query": "json"}
{"t": "2026-09-03T11:34:00+09:00", "user": "u03", "event": "save", "size_kb": 42}
{"t": "2026-09-03T12:41:00+09:00", "user": "u02", "event": "close"}
{"t": "2026-09-03T13:48:00+09:00", "user": "u01", "event": "open"}
{"t": "2026-09-03T12:00:00+09:00", "user": "u02", "event": "save", "size_kb": 3
{"t": "2026-09-03T14:55:00+09:00", "user": "u04", "event": "search", "query": "json"}
{"t": "2026-09-03T15:02:00+09:00", "user": "u03", "event": "save", "size_kb": 22}
{"t": "2026-09-03T16:09:00+09:00", "user": "u02", "event": "search", "query": "차트"}
{"t": "2026-09-03T17:16:00+09:00", "user": "u01", "event": "save", "size_kb": 32}
{"t": "2026-09-03T18:23:00+09:00", "user": "u04", "event": "close"}
{"t": "2026-09-04T09:30:00+09:00", "user": "u03", "event": "open"}
{"t": "2026-09-04T10:37:00+09:00", "user": "u02", "event": "search", "query": "차트"}
{"t": "2026-09-04T11:44:00+09:00", "user": "u01", "event": "save", "size_kb": 12}
{"t": "2026-09-04T12:51:00+09:00", "user": "u04", "event": "search", "query": "json"}
{"t": "2026-09-04T13:58:00+09:00", "user": "u03", "event": "save", "size_kb": 22}
{"t": "2026-09-04T14:05:00+09:00", "user": "u02", "event": "close"}
{"t": "2026-09-04T15:12:00+09:00", "user": "u01", "event": "open"}
{"t": "2026-09-04T16:19:00+09:00", "user": "u04", "event": "search", "query": "json"}
`;
const APP_TOML = `# 사진 정리기 설정 — 사람이 직접 고치는 파일이라 주석을 달 수 있어요
title = "사진 정리기"
version = 3
debug = false
started = 2026-09-01

[source]
folder = "사진/원본"
extensions = [".jpg", ".png", ".heic"]

[output]
folder = "사진/정리"
max_size_mb = 25.5
keep_original = true

[[rules]]
name = "스크린샷"
match = "Screenshot*"
move_to = "스크린샷"

[[rules]]
name = "메신저"
match = "KakaoTalk_*"
move_to = "메신저"
`;
const MAKE_SAMPLES_PY = `# make_samples.py — 「데이터 파일 다루기」 교과서의 엑셀 예제를 만들어요(가짜 데이터, 무작위 없음).
# 공부 폴더에 저장하고 터미널에서 python make_samples.py 를 한 번 실행하세요.
from datetime import date
from pathlib import Path
from openpyxl import Workbook

# 품목 · 분류 · 단가
ITEMS = [("소금빵", "빵", 3200), ("크루아상", "빵", 3800), ("식빵", "빵", 4500),
         ("단팥빵", "빵", 2800), ("아메리카노", "음료", 4000), ("라테", "음료", 4800),
         ("치즈케이크", "케이크", 6500), ("딸기케이크", "케이크", 32000)]
HEADER = ["날짜", "품목", "분류", "단가", "수량"]


def sales_rows(month, count):
    """month 월의 매출 count 줄 — 규칙으로 만든 고정 데이터"""
    rows = []
    for i in range(count):
        name, kind, price = ITEMS[(i * 3 + month) % len(ITEMS)]
        qty = 2 + (i * 7 + month * 3) % 18
        if kind == "케이크":
            qty = 1 + qty % 4
        rows.append([date(2026, month, 1 + i * 3 // 2), name, kind, price, qty])
    return rows


# 1) 빵집_매출.xlsx — 시트 「7월」 「8월」 「9월」, 시트마다 20줄
wb = Workbook()
wb.remove(wb.active)  # 처음부터 있는 빈 시트 지우기
for month in (7, 8, 9):
    ws = wb.create_sheet(f"{month}월")
    ws.append(HEADER)
    for row in sales_rows(month, 20):
        ws.append(row)
wb.save("빵집_매출.xlsx")

# 2) 지점/강남.xlsx · 홍대.xlsx · 판교.xlsx — 같은 모양인데 판교만 열 순서가 달라요
Path("지점").mkdir(exist_ok=True)
for k, branch in enumerate(["강남", "홍대", "판교"]):
    wb = Workbook()
    ws = wb.active
    ws.title = "9월"
    rows = sales_rows(9, 6 + k)[k:]
    if branch == "판교":
        ws.append(["품목", "날짜", "수량", "단가", "분류"])
        for d, name, kind, price, qty in rows:
            ws.append([name, d, qty, price, kind])
    else:
        ws.append(HEADER)
        for row in rows:
            ws.append(row)
    wb.save(f"지점/{branch}.xlsx")

# 3) 가계부_카드내역.xlsx — 카드사에서 내려받은 모양을 흉내 낸 지저분한 파일
CARD_9 = [
    (date(2026, 9, 1), "동네마트", "식비", "32,400원"),
    (date(2026, 9, 2), "버스·지하철", "교통", "1,500원"),
    (date(2026, 9, 3), "김밥천국", "식비", "8,000원"),
    (46270, "온라인서점", "문화", "21,600원"),  # 날짜가 숫자로(엑셀 날짜 번호 = 2026-09-05)
    (date(2026, 9, 8), "약국", "건강", "6,300원"),
    None,  # 중간 빈 줄
    (date(2026, 9, 12), "동네마트", "식비", "45,900원"),
    (date(2026, 9, 14), "영화관", "문화", "14,000원"),
    (46282, "버스·지하철", "교통", "1,500원"),  # 2026-09-17
    (date(2026, 9, 20), "온라인서점", "문화", "-21,600원"),  # 주문 취소(환불)
    (date(2026, 9, 25), "통신사", "통신", "33,000원"),
    (date(2026, 9, 28), "카페", "식비", "4,800원"),
    (date(2026, 9, 30), "동네마트", "식비", "27,350원"),
]
CARD_10 = [  # 10월 파일 — 앞 두 줄은 9월 파일과 같은 건(겹쳐 내려받음)
    (date(2026, 9, 28), "카페", "식비", "4,800원"),
    (date(2026, 9, 30), "동네마트", "식비", "27,350원"),
    (date(2026, 10, 2), "버스·지하철", "교통", "1,500원"),
    (date(2026, 10, 5), "동네마트", "식비", "38,200원"),
    (date(2026, 10, 9), "영화관", "문화", "15,000원"),
    (date(2026, 10, 15), "약국", "건강", "4,500원"),
    (date(2026, 10, 25), "통신사", "통신", "33,000원"),
]


def won(text):
    return int(text.replace(",", "").replace("원", ""))


def card_file(path, period, rows):
    wb = Workbook()
    ws = wb.active
    ws.title = "이용내역"
    ws.append(["◇◇카드 이용내역"])
    ws.merge_cells("A1:D1")
    ws.append([f"조회기간: {period}"])
    ws.merge_cells("A2:D2")
    ws.append([])
    ws.append(["이용일", "가맹점", "분류", "이용금액"])
    for row in rows:
        ws.append(list(row) if row else [])
    total = sum(won(r[3]) for r in rows if r)
    ws.append(["합계", None, None, f"{total:,}원"])
    wb.save(path)


card_file("가계부_카드내역.xlsx", "2026-09-01 ~ 2026-09-30", CARD_9)
card_file("가계부_카드내역_10월.xlsx", "2026-09-28 ~ 2026-10-31", CARD_10)

print("만든 파일:")
for p in sorted(Path(".").rglob("*.xlsx")):
    print(" ", p.as_posix())
`;
const SAMPLES_PREP = { name: 'make_samples.py', text: MAKE_SAMPLES_PY, run: true, fold: '엑셀 예제 만들기 — 시작하기 3 에서 이미 했으면 건너뛰어요' };
