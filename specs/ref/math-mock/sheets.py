# 시안 모음 판 만들기 — 시안 화면(dist/index.html 의 여러 상태)을 틀에 넣어 나란히 놓은 HTML 과, 찍기 작업 목록(JSON)을 써요.
# 쓰는 법(build.py 다음에): python3 specs/ref/math-mock/sheets.py → .out/sheets/*.html · .out/sheets/jobs.json
#   찍기: node specs/ref/math-mock/shot.mjs specs/ref/math-mock/.out/sheets/jobs.json → .out/shots/*.png
import json, pathlib

here = pathlib.Path(__file__).resolve().parent
out = here / '.out' / 'sheets'; out.mkdir(parents=True, exist_ok=True)
shots = here / '.out' / 'shots'; shots.mkdir(parents=True, exist_ok=True)
APP = '../dist/index.html?bare=1&'

CSS = '''
html,body{margin:0;background:#070a10;color:#eef2f8;font-family:-apple-system,"Pretendard","Noto Sans KR","Noto Sans CJK KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;word-break:keep-all}
.sh{display:inline-block;padding:38px 44px 46px}
h1{margin:0 0 6px;font-size:31px;font-weight:800;letter-spacing:-.01em}
.sub{margin:0 0 28px;color:#a3aec0;font-size:17px;line-height:1.5}
.rl{margin:26px 0 12px;font-size:18px;font-weight:800;color:#7cb4ff}.rl:first-of-type{margin-top:0}
.row{display:flex;gap:34px;align-items:stretch}
.fr{display:flex;flex-direction:column;justify-content:flex-end;gap:12px}
.cap b{display:block;font-size:22px;font-weight:800}
.cap span{display:block;margin-top:3px;color:#a3aec0;font-size:15px;line-height:1.5}
.ph{width:390px;height:844px;border:1px solid #3d4a60;border-radius:28px;overflow:clip;background:#0c111b}
.ph iframe{display:block;width:390px;height:844px;border:0}
.pc{border:1px solid #3d4a60;border-radius:12px;overflow:clip;background:#0c111b}
.pc iframe{display:block;width:1440px;height:900px;border:0;transform-origin:0 0}
'''


def frame(f):
    cap = f'<div class="cap"><b>{f["label"]}</b><span>{f["desc"]}</span></div>' if f.get('label') else ''
    if f.get('kind') == 'pc':
        sc = f.get('scale', .6); w, h = round(1440 * sc), round(900 * sc)
        return f'<div class="fr" style="width:{w}px">{cap}<div class="pc" style="width:{w}px;height:{h}px"><iframe src="{APP}{f["q"]}" style="transform:scale({sc})" scrolling="no" title="{f.get("label", "PC 화면")}"></iframe></div></div>'
    return f'<div class="fr" style="width:392px">{cap}<div class="ph"><iframe src="{APP}{f["q"]}" scrolling="no" title="{f.get("label", "폰 화면")}"></iframe></div></div>'


def sheet(name, title, sub, rows, width):
    body = ''.join((f'<div class="rl">{r["label"]}</div>' if r.get('label') else '') + f'<div class="row">{"".join(frame(f) for f in r["frames"])}</div>' for r in rows)
    (out / f'{name}.html').write_text(f'<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>{title}</title><style>{CSS}</style></head><body><div class="sh"><h1>{title}</h1><p class="sub">{sub}</p>{body}</div></body></html>', encoding='utf-8')
    return {'url': 'file://' + str(out / f'{name}.html'), 'out': str(shots / f'{name}.png'), 'viewport': {'w': width, 'h': 2300, 'dpr': 2}, 'clip': '.sh', 'wait': 2500}


A = {'label': 'A · 쪽 넘기기', 'desc': '지금 교과서와 같은 틀이에요. 번호 탭을 눌러 한 쪽에 한 덩어리씩 보고, 마지막 탭이 연습 문제예요.'}
B = {'label': 'B · 한 장 스크롤', 'desc': '레슨 전체가 한 쪽이에요. 위의 차례 줄이 따라 내려오며 지금 어디인지 알려 줘요.'}
C = {'label': 'C · 단계 카드', 'desc': '「다음 단계」 를 누르면 카드가 하나씩 아래에 이어 붙어요. 예제 풀이도 한 줄씩 펴요.'}
jobs = [
    sheet('1-lesson-layout-phone', '① 레슨 쪽 짜임 — 폰', '같은 레슨(레슨 1 「약수와 배수」)을 세 가지 짜임으로 그렸어요. 윗줄은 개념을 읽을 때, 아랫줄은 예제 풀이를 볼 때예요.', [
        {'label': '개념을 읽을 때 — 「약수」', 'frames': [dict(A, q='s=lesson&v=A&p=1'), dict(B, q='s=lesson&v=B'), dict(C, q='s=lesson&v=C&step=2&at=c-div')]},
        {'label': '예제 풀이를 볼 때 — 「예제 1」', 'frames': [{'q': 's=lesson&v=A&p=4'}, {'q': 's=lesson&v=B&at=sec-ex1'}, {'q': 's=lesson&v=C&step=5&lines=3&at=c-ex1'}]},
    ], 1340),
    sheet('2-lesson-layout-pc', '① 레슨 쪽 짜임 — PC', '같은 세 가지를 PC(1440 × 900) 화면으로 본 모습이에요.', [
        {'frames': [dict(A, kind='pc', q='s=lesson&v=A&p=1')]}, {'frames': [dict(B, kind='pc', q='s=lesson&v=B')]}, {'frames': [dict(C, kind='pc', q='s=lesson&v=C&step=3&at=c-mul')]},
    ], 980),
    sheet('3-answer-check-phone', '② 연습 문제 답 확인 — 폰', '손으로 푼 다음 답을 어떻게 확인하느냐의 세 가지예요. 셋 다 1번 문제를 눌러 본 상태로 그렸어요.', [
        {'frames': [
            {'label': '가 · 한꺼번에', 'desc': '「답과 풀이 보기」 하나예요. 지금 교과서의 「예시 답 보기」 와 같은 방식이에요.', 'q': 's=lesson&v=A&p=7&k=1&demo=1&at=task-0'},
            {'label': '나 · 답 먼저, 풀이 따로', 'desc': '「답만 보기」 로 답만 맞춰 보고, 틀렸을 때만 「풀이 보기」 를 눌러요.', 'q': 's=lesson&v=A&p=7&k=2&demo=1&at=task-0'},
            {'label': '다 · 풀이 한 줄씩', 'desc': '막힌 데까지만 한 줄씩 펴고, 다음 줄은 직접 해 봐요. 답만 보기도 따로 있어요.', 'q': 's=lesson&v=A&p=7&k=3&demo=1&at=task-0'},
        ]},
    ], 1340),
    sheet('4-toc-phone-pc', '③ 목차 — 폰과 PC', '중1 범위 35 레슨(챕터 9개)의 목차예요. 레슨 제목은 개념 이름이고, 그 아래에 한 줄 설명이 붙어요.', [
        {'label': '폰', 'frames': [
            {'label': 'ㄱ · 펼친 목록', 'desc': '지금 교과서 목차와 같은 틀이에요. 모든 레슨이 처음부터 보여요.', 'q': 's=toc&t=1'},
            {'label': 'ㄴ · 챕터 접기', 'desc': '챕터만 먼저 보이고, 누르면 그 챕터의 레슨이 펴져요.', 'q': 's=toc&t=2'},
        ]},
        {'label': 'PC', 'frames': [{'kind': 'pc', 'scale': .44, 'q': 's=toc&t=1'}, {'kind': 'pc', 'scale': .44, 'q': 's=toc&t=2'}]},
    ], 1420),
]
(out / 'jobs.json').write_text(json.dumps(jobs, ensure_ascii=False, indent=1), encoding='utf-8')
print('모음 판', len(jobs), '장:', ', '.join(pathlib.Path(j['out']).name for j in jobs))
