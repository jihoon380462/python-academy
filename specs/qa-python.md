# 파이썬 교과서 QA 지시서 (2026-11-08 · v2.43.1)

파이썬 교과서(`courses/python`, 100 레슨)만 검수하는 방의 안내예요. 다른 교과서는 범위 밖이에요.

## 1. 목표

**처음 배우는 사람이 앞에서부터 차례로 읽고 따라 할 수 있나**를 봐요. 「맞나」 만 보지 말고 「막히나」 를 봐요.

- 설명이 **단계를 건너뛰지 않나**
- 예제 출력이 실제와 같나
- 아직 안 배운 문법이 튀어나오지 않나
- 「🛠 만들어 보기」 를 「필요한 코드」 칩만 보고 혼자 할 수 있나
- 폰(390px)에서 읽기 편한가

## 2. 순서

1. **자동 검사부터** — 기계가 잡는 건 기계로 먼저 잡아요.
   ```
   node tools/check_book.mjs python          # 예시 답 · 본문 예제를 진짜로 실행해 출력 비교 (약 1분)
   node tools/check_level.mjs --course python # 안 배운 문법 · 한 문제에 새 문법 3개+ · 첫 문제가 무거움
   python3 tools/qa_screens.py --w 390 --h 844 --out /tmp/qa_m python   # 폰: 모든 쪽 측정 + 캡처
   ```
2. **챕터 하나씩 읽기** — 챕터 0 → 11 차례로. 레슨의 모든 쪽 → 만들어 보기 → 예시 답 순서로 읽어요.
   - 아래 3절 점검표로 봐요.
   - 폰 캡처(`/tmp/qa_m/python/`)를 같이 눈으로 봐요.
3. **찾으면 그 자리에서 고치기** — 미루지 않아요(5절).
4. **챕터마다 짧게 보고** — 한국어로, 진행률 % 와 함께.

## 3. 점검표 (11/8 실제로 나온 실수에서 뽑음)

| 볼 것 | 실제로 있었던 예 |
|---|---|
| **설명이 단계를 건너뛰나** | 레슨 15 「못 찾으면 -1 이라는 걸 잊으면 엉뚱하게 잘려요. "minsu"[:-1] 은 mins」 — at 이 -1 이 된다는 단계가 빠짐 (사용자 「이 말은 내가 난독이냐?」) |
| **새 문법 설명이 충분한가** — 무엇을 돌려주나 · 비슷한 것과 차이 · 경계(없을 때 · 빈 것) · 실제 실행 결과 | 레슨 14 `partition` 을 「(앞, 자른 글자, 뒤) 세 칸」 한 줄로만 설명 |
| **안 배운 문법** — 그 레슨까지의 본문에 없는 것(접힌 「💡 더 알아보기」 는 배운 걸로 안 쳐요) | `check_level` 이 잡아요. 오탐도 있어요(예: `sorted({… for …})` 를 제너레이터식으로 읽음) |
| **출력 주석 · 출력 예가 실제와 같나** | 집합을 그대로 출력하면 순서가 매번 달라요 → `sorted()` |
| **레슨 번호** — 화면 번호와 id 가 달라요 | id `L24` 는 화면에서 **레슨 60**, `L9` 는 레슨 14. 글에 「레슨 n」 을 쓸 때는 화면 번호. 링크는 `[[레슨:L9]]` 처럼 id 로 쓰면 화면 번호로 보여요 |
| **문제 번호** — 글의 ①②는 화면 배지 번호와 같아야 | 「① 의 결과」 가 다른 문제를 가리키던 것(`check_book` ⑬ 이 일부 잡음) |
| **말투 · 쓰면 안 되는 말** | 해요체. 「이 앱」 · 「채점」 · 「입력창」 · 「종이에 적어」 금지 |
| **폰 화면** | 가로 넘침 · 제목 3줄 넘음 · 코드 칩 글자가 칸을 넘음 |

## 4. 화면 한 쪽만 직접 보기

```python
# /tmp 에 저장해서 python3 로 실행. 레슨 id 와 쪽 번호(0부터)를 바꿔 써요.
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox', '--allow-file-access-from-files'])
    pg = b.new_page(viewport={'width': 390, 'height': 1500})
    pg.goto('file:///home/user/python-academy/courses/python/index.html'); pg.wait_for_timeout(900)
    pg.evaluate("document.querySelectorAll('.modal-ov').forEach(e=>e.remove())")
    pg.evaluate("UI.go('lesson',{lessonId:'L9B',page:2})"); pg.wait_for_timeout(600)
    pg.screenshot(path='/tmp/shot.png'); b.close()
```

레슨 id ↔ 화면 번호 표: `node -e "const vm=require('vm'),fs=require('fs');const x={};vm.createContext(x);vm.runInContext(fs.readFileSync('courses/python/content.js','utf8').replace(/^const (\w+)/mg,'var \$1'),x);x.LESSONS.forEach(l=>console.log(l.id,l.n,l.title))"`

## 5. 고칠 때 지킬 것

- **쪽을 더하거나 지우거나 순서를 바꾸지 마요.** 쪽 번호가 바뀌면 「필요한 코드」 칩이 깨져요. 새 쪽이 꼭 필요하면 레슨 **맨 끝**에만.
- 본문은 `courses/python/content.js` 의 JS 템플릿 글자 안이에요. 백틱 · `${` 금지. 화면에 `\n` 글자를 보이려면 `\\n`.
- 고치는 방법: 셸 `sed` 말고 python 스크립트 파일로, 바꿀 글자가 정확히 한 번 있는지 `assert` 한 뒤 바꿔요(`LESSON.md` R7).
- 예제 · 예시 답을 바꾸면 **실제로 돌려서** 출력을 맞춰요.
- 고친 뒤: `node tools/check_book.mjs python` · `node tools/check_nesting.mjs python` · `node tools/validate_content.mjs` · `node tools/check_level.mjs --gate` 모두 통과.
- 배포는 `HANDOFF.md` 2절 순서대로: 버전 올리기 → PR → CI → 머지 → 배포 두 작업 확인.
- 고친 실수의 원인이 반복될 만하면 `LESSON.md` 에 적어요.
- 범위는 `courses/python` 만. 다른 교과서 문제를 보면 고치지 말고 보고만 해요.
