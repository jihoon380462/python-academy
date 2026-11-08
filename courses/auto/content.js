// courses/auto/content.js — 「파이썬 업무 자동화 교과서」 (v2.42.0, 설계 순서대로 만들기 두 번째). 설계: specs/courses-python-next.md
// 교과서 모드. 연습은 내 PC 의 VS Code + 파이썬 + pypdf · python-docx · reportlab. example.code = 파이썬(check_book 이 python3 로 실제 실행). 연습 재료는 datasets.js 의 SAMPLES_PY.
const COURSE = { id: 'auto', name: '파이썬 업무 자동화', runner: 'python', bench: false,
  tutorPersona: '너는 파이썬을 아는 성인에게 파일 · 문서 · 메일 같은 사무 일을 파이썬으로 자동화하는 법을 작은 코드로 직접 해 보며 가르치는 선생님이다.' };
const CHAPTERS = [
  { ch: 0, name: '시작', color: '#6d4c41' },
  { ch: 1, name: '파일 · 폴더 일괄 처리', color: '#4f6bed' },
  { ch: 2, name: '문서: PDF · 워드', color: '#2ea043' },
  { ch: 3, name: '글자 · 템플릿 · 메일', color: '#d97706' },
  { ch: 4, name: '사람 손 대신 · 정해진 때에', color: '#8e44ad' },
];
const AUTO_TODO = (t) => [{ title: '준비 중', html: `<p>TODO: ${t}</p>` }]; // v2.42.0 뼈대
const LESSONS = [
{ id: 'J0', ch: 0, n: 0, title: '업무 자동화 첫걸음', mode: 'text',
  tutorSummary: "코스 첫 레슨. 무대는 가상의 가게 「햇살 공방」 의 사무 일. 자동화할 일 고르기: 자주 · 규칙대로 · 오래 걸리는 일 — 시간은 곱해서(한 번 5분 × 주 5번 × 52주 = 1300분 ≈ 21시간, minutes * per_week * 52 // 60). 사람이 판단할 일(상담 · 사과 메일 · 금액 확인)은 남기고 프로그램은 모으기 · 정리 · 초안까지. 엑셀은 이 코스가 아니라 데이터 파일 다루기 교과서(F7 · F8), 표는 csv. 안전 세 원칙: ① 원본은 읽기만(파이썬이 지운 파일은 휴지통에 안 감) ② 결과는 새 폴더에(정리본/ · outbox/ · 백업/날짜/) ③ 미리 보기 먼저(dry run) — 파이썬 L27 · X7(--dry-run 정리기)은 다시 가르치지 않고 링크, 연습은 tempfile.TemporaryDirectory() 임시 폴더 + p.name 만 출력, 원본을 바꿔야 하는 이름 바꾸기는 되돌리기 기록(J1). 준비: 가상 환경에 python -m pip install pypdf python-docx reportlab cryptography → pip list 로 확인, 설치 이름 python-docx ≠ import docx(pip install docx 는 옛 패키지), importlib.import_module(\"docx\") 는 이름을 글자로 받는 import(없으면 ModuleNotFoundError). 연습 재료 samples.py(시작하기 2)를 .py 파일과 같은 폴더에 — import 는 실행한 파일의 폴더에서 찾음, 아니면 No module named 'samples'. make_files(폴더) 는 다운로드 흉내 12개(~$ 임시 · Thumbs.db · 임시.tmp · 대문자 확장자 · 빈칸, 수정 시각 고정)를 만들고 이름 순 경로 리스트를 돌려줌. 프로그램의 기본 모양: main(argv=None, today=None) + argparse(위치 인자 src dst, --dry-run action=\"store_true\") + parse_args(argv) + today 가 None 이면 date.today()(시험은 today=date(2026, 11, 8)) + 없는 폴더면 stderr 안내 후 return 1 + plan() 으로 할 일 목록만 만들고 dry_run 이면 보여 주고 return 0, 아니면 실행하며 log.info + 맨 아래 if __name__ == \"__main__\": logging.basicConfig(filename=…) · sys.exit(main()). 예제는 쓸모 있는 파일만 결과/모음_2026-11-08 로 복사하는 collect.py.",
  terms: { "미리 보기": "실제로 바꾸지 않고 무엇을 할지 목록만 보여 주는 실행. 영어로 dry run. 명령 줄 프로그램에서는 흔히 --dry-run 옵션이에요" },
  pages: [
    { title: "5분 × 5번 × 52주 = 21시간", html: `<p>파이썬 교과서를 다 배웠으면 이제 <b>내 일</b>에 써 볼 차례예요. 이 교과서의 무대는 가상의 작은 가게 「햇살 공방」 이에요. 공방의 사무 일 — 다운로드 폴더 정리 · 백업 · 청구서 PDF · 수료증 · 안내 메일 — 을 파이썬에게 맡겨요.</p>
<p>무엇을 맡길지는 세 가지를 물어서 골라요.</p>
<table class="kb"><tbody><tr><th>물음</th><th>그렇다는 뜻</th></tr><tr><td><b>자주</b> 하나요?</td><td>매일 · 매주 하는 일. 한 해에 한 번이면 손으로 해요</td></tr><tr><td><b>규칙대로</b> 하나요?</td><td>「빈칸은 _ 로」 「10월 청구서는 PDF 하나로」 처럼 규칙을 말로 적을 수 있어요</td></tr><tr><td><b>오래</b> 걸리나요?</td><td>한 번은 짧아도 쌓이면 길어요</td></tr></tbody></table>
<p>걸리는 시간은 곱해서 세요. 한 번 5분 × 한 주 5번 × 52주면 1300분, 한 해에 <b>21시간</b>이 넘어요. 프로그램을 만드는 데 서너 시간이 들어도 남는 장사예요.</p>
<pre>minutes = 5 * 5 * 52
print(minutes)          # 1300
print(minutes // 60)    # 21 — 시간
print(minutes % 60)     # 40 — 남은 분</pre>
<div class="bk-warn"><b>사람이 판단할 일은 남겨 두기</b> — 수강 상담 전화, 거래처에 보낼 사과 메일, 「이 청구서 금액이 맞나?」 같은 일은 규칙으로 못 적어요. 프로그램은 <b>모으고 · 정리하고 · 초안을 만드는</b> 데까지 하고, 마지막 확인과 결정은 사람이 해요.</div>
<p>이 교과서의 순서예요.</p>
<table class="kb"><tbody><tr><th>챕터</th><th>공방의 일</th></tr><tr><td>1 파일 · 폴더</td><td>이름 한꺼번에 바꾸기 · 날짜 폴더로 정리 · 백업 · 압축</td></tr><tr><td>2 PDF · 워드</td><td>청구서에서 금액 꺼내기 · PDF 합치기 · 보고서 워드 만들기</td></tr><tr><td>3 템플릿 · 메일</td><td>명단으로 수료증과 안내 메일 대량 만들기 · 보내기</td></tr><tr><td>4 정해진 때에</td><td>월요일 9시에 사람 없이 혼자 돌기</td></tr></tbody></table>
<p>엑셀 파일은 이 교과서에서 다루지 않아요. 엑셀을 읽고 쓰는 법은 <a href="../files/#lesson/F7" target="_blank" rel="noopener">데이터 파일 다루기 교과서 「엑셀 읽기: 통합 문서 · 시트 · 셀」 ↗</a> 에 있고, 여기서 표는 csv 로 주고받아요.</p>`,
      example: { code: `jobs = [
    # (일, 한 번에 걸리는 분, 한 주에 몇 번, 규칙대로 되나)
    ("다운로드 폴더 정리", 5, 5, True),
    ("청구서 PDF 모아 합치기", 20, 1, True),
    ("수료증 만들어 메일 보내기", 4, 8, True),
    ("수강 상담 전화", 10, 15, False),
]

for name, minutes, per_week, by_rule in jobs:
    hours = minutes * per_week * 52 // 60
    if by_rule:
        verdict = "자동화 후보"
    else:
        verdict = "사람이 할 일"
    print(f"{name}: 한 해 {hours}시간 → {verdict}")` } },
    { title: "원본은 읽기만 · 새 폴더에 · 미리 보기 먼저", html: `<p>자동화 프로그램은 한 번에 파일 수십 개를 바꿔요. 실수도 수십 개가 한꺼번에 나요. 그래서 이 교과서의 모든 프로그램은 <b>안전 세 원칙</b>을 지켜요.</p>
<table class="kb"><tbody><tr><th>원칙</th><th>왜 · 어떻게</th></tr><tr><td><b>① 원본은 읽기만</b></td><td>원본 파일은 열어 읽기만 하고 옮기거나 · 지우거나 · 덮어쓰지 않아요. 파이썬으로 지운 파일은 휴지통에 가지 않고 바로 사라져요</td></tr><tr><td><b>② 결과는 새 폴더에</b></td><td><code>정리본/</code> · <code>outbox/</code> · <code>백업/2026-11-08/</code> 처럼 새 폴더에 만들어요. 마음에 안 들면 그 폴더만 지우면 끝이에요</td></tr><tr><td><b>③ 미리 보기 먼저</b></td><td>무엇을 할지 목록부터 출력해서 눈으로 보고, 맞으면 그때 진짜로 해요([[미리 보기]], dry run)</td></tr></tbody></table>
<p>복습: 파일 고르기 · 복사 · 옮기기 · 지우기와 <code>DRY_RUN</code> 변수는 <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a>, 그걸 <code>--dry-run</code> 옵션으로 만든 정리기는 <a href="../python/#lesson/X7" target="_blank" rel="noopener">파이썬 교과서 「실전 7: 다운로드 폴더 정리기」 ↗</a> 에서 이미 만들었어요. 이 교과서는 확장자별 정리를 다시 만들지 않고 그다음 — 이름 규칙 · 날짜별 정리 · 백업 — 으로 넘어가요.</p>
<p>연습도 늘 <b>임시 폴더</b>에서 해요. <code>tempfile.TemporaryDirectory()</code> 안에 가짜 파일을 만들어 쓰고, with 를 나오면 폴더째 사라져요(복습: <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a> 첫 쪽). 경로는 실행할 때마다 달라서 출력에는 <code>p.name</code> 만 찍어요.</p>
<div class="bk-warn"><b>원본을 바꿔야 하는 일은?</b> — 이름 바꾸기처럼 원본 자리에서 바꿔야 하는 일도 있어요. 그때는 미리 보기에 더해 <b>되돌리기 기록</b>을 남겨요([[레슨:J1]]).</div>`,
      example: { code: `import shutil
import tempfile
from pathlib import Path
from samples import make_files


def is_junk(p):
    return p.name.startswith("~$") or p.name == "Thumbs.db" or p.suffix.lower() == ".tmp"


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "다운로드"
    make_files(src)
    before = sorted(p.name for p in src.iterdir())

    # ③ 미리 보기 먼저: 할 일 목록만 만들어 보여 주기
    todo = []
    for p in sorted(src.iterdir()):
        if not is_junk(p):
            todo.append(p)
    print("[미리 보기] 복사할 파일", len(todo), "개")
    for p in todo:
        print("  ", p.name)

    # ② 결과는 새 폴더에
    out = base / "정리본"
    out.mkdir()
    for p in todo:
        shutil.copy(p, out)        # ① 원본은 읽기만 — 옮기지도 지우지도 않아요

    after = sorted(p.name for p in src.iterdir())
    made = sorted(out.iterdir())
    print("원본 폴더 그대로:", before == after, len(after), "개")
    print("정리본 폴더:", len(made), "개")`, prep: [SAMPLES_PREP] } },
    { title: "pip list · make_files(tmp)", html: `<p>준비는 두 가지예요. 자세한 순서는 이 교과서 맨 앞 <b>시작하기 1 · 2</b> 에 있어요.</p>
<p><b>① 패키지 넷.</b> 공부 폴더 <code>auto-study</code> 의 가상 환경을 켜고(복습: <a href="../python/#lesson/L16D" target="_blank" rel="noopener">파이썬 교과서 「pip 와 가상 환경」 ↗</a>) 한 번 깔아요. 다 깔렸는지는 <code>pip list</code> 로 봐요. 목록에 네 이름이 보이면 돼요(버전 숫자는 PC 마다 달라요).</p>
<pre>python -m pip install pypdf python-docx reportlab cryptography
python -m pip list</pre>
<div class="bk-warn"><b>설치 이름 ≠ import 이름</b> — 워드 패키지는 <code>pip install python-docx</code> 로 깔고 코드에서는 <code>import docx</code> 예요. <code>pip install docx</code> 는 다른 옛 패키지라서 깔면 <code>import docx</code> 에서 에러가 나요. 잘못 깔았으면 <code>pip uninstall docx</code> 후 다시 깔아요.</div>
<p>코드 안에서 확인할 수도 있어요. <code>importlib.import_module("docx")</code> 는 <code>import docx</code> 와 같은데, 모듈 이름을 <b>글자로</b> 받아서 반복문으로 여러 개를 차례로 불러 볼 수 있어요. 없으면 <code>ModuleNotFoundError</code> 예요(복습: <a href="../python/#lesson/L13" target="_blank" rel="noopener">파이썬 교과서 「예외 처리」 ↗</a>).</p>
<pre>import importlib

for module in ["pypdf", "docx", "reportlab", "cryptography"]:
    try:
        importlib.import_module(module)
        print("OK", module)
    except ModuleNotFoundError:
        print("없음", module)</pre>
<p><b>② 연습 재료 <code>samples.py</code>.</b> 시작하기 2 의 내용을 그대로 <code>samples.py</code> 로 저장해요. 예제와 문제는 내 진짜 파일 대신, <code>from samples import make_files</code> 로 불러 <b>임시 폴더 안에</b> 가짜 파일을 만들어 써요. 맨 먼저 쓸 <code>make_files(폴더)</code> 는 「다운로드」 폴더 흉내 파일 12개를 만들고, 만든 파일 경로를 이름 순 리스트로 돌려줘요. 사진 · 문서 사이에 워드 임시 파일 <code>~$견적서 최종.docx</code> · Windows 의 그림 미리 보기 파일 <code>Thumbs.db</code> · <code>임시.tmp</code>, 대문자 확장자 <code>.JPG</code> · <code>.PDF</code>, 이름에 빈칸이 섞여 있어요. 수정 시각도 2026년 10~11월로 고정돼 있어요.</p>
<div class="bk-warn"><b>samples.py 는 .py 파일 옆에</b> — <code>import</code> 는 터미널의 현재 폴더가 아니라 <b>실행한 .py 파일이 있는 폴더</b>에서 찾아요. 다른 폴더에 두면 <code>ModuleNotFoundError: No module named 'samples'</code> 예요. 이 교과서의 .py 파일은 모두 <code>auto-study</code> 에, <code>samples.py</code> 와 나란히 만들어요. 실행한 파일이 있는 폴더는 <code>Path(__file__).parent</code> 예요(복습: <a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩」 ↗</a>) — <code>(Path(__file__).parent / "samples.py").exists()</code> 로 옆에 있는지 물을 수 있어요.</div>`,
      example: { code: `import tempfile
from samples import make_files

with tempfile.TemporaryDirectory() as tmp:
    files = make_files(tmp)          # 임시 폴더 안에 가짜 파일 12개
    print(len(files), "개 만들었어요")
    for p in files:
        print(p.name)`, prep: [SAMPLES_PREP] } },
    { title: "main(argv, today) · --dry-run", html: `<p>이 교과서의 프로그램은 모두 같은 모양이에요. 파이썬 교과서에서 배운 셋을 합친 모양이에요.</p>
<ul><li><code>main(argv=None)</code> + argparse — 명령 줄에서도, 코드에서 <code>main(["원본", "결과", "--dry-run"])</code> 처럼 리스트로도 불러요(복습: <a href="../python/#lesson/L19B" target="_blank" rel="noopener">파이썬 교과서 「명령 줄 프로그램: sys.argv · argparse」 ↗</a>). <code>--dry-run</code> 처럼 값 없이 켜고 끄는 옵션은 <code>action="store_true"</code>(복습: <a href="../python/#lesson/X7" target="_blank" rel="noopener">파이썬 교과서 「실전 7: 다운로드 폴더 정리기」 ↗</a>)</li><li><code>return 0</code> · <code>return 1</code> 과 <code>sys.exit(main())</code> — 끝 코드. 에러 안내는 <code>file=sys.stderr</code>(복습: <a href="../python/#lesson/L19C" target="_blank" rel="noopener">파이썬 교과서 「명령 줄 프로그램 2: 하위 명령 · 끝 코드」 ↗</a>)</li><li><code>log.info(…)</code> — 한 일을 기록으로 남겨요(복습: <a href="../python/#lesson/L31" target="_blank" rel="noopener">파이썬 교과서 「logging 맛보기」 ↗</a>). 혼자 돌아가는 스크립트는 기록을 파일에 남기고 오래된 기록을 돌려 써요([[레슨:J12]])</li></ul>
<p>새로 붙는 건 둘이에요.</p>
<ul><li><b>계획과 실행 나누기</b> — <code>plan()</code> 은 할 일 목록만 만들고 아무것도 바꾸지 않아요. <code>--dry-run</code> 이면 그 목록을 보여 주고 끝, 아니면 목록대로 해요. 미리 보기와 진짜가 <b>같은 목록</b>을 써서, 본 그대로 돼요</li><li><b>오늘 날짜를 인자로</b> — <code>main(argv=None, today=None)</code>. 비어 있으면 <code>date.today()</code> 를 쓰고, 시험할 땐 <code>today=date(2026, 11, 8)</code> 을 넘겨요. 그래야 언제 돌려도 결과가 같아서 맞는지 확인할 수 있어요</li></ul>
<pre>def main(argv=None, today=None):
    parser = argparse.ArgumentParser(prog="collect")
    parser.add_argument("src")
    parser.add_argument("dst")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)
    if today is None:
        today = date.today()
    ...                      # 계획 → 미리 보기면 보여 주고 return 0 → 아니면 실행
    return 0


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, filename="collect.log", encoding="utf-8",
                        format="%(asctime)s %(levelname)s %(message)s")
    sys.exit(main())</pre>
<p>예제는 쓸모 있는 파일만 <code>결과/모음_2026-11-08/</code> 로 복사하는 <code>collect.py</code> 예요. 맨 아래의 진짜 시작 부분 대신, 임시 폴더에서 미리 보기 → 진짜 → 없는 폴더 순서로 <code>main</code> 을 불러 시험해요. 이 책 예제는 기록이 화면에 같이 보이게 <code>stream=sys.stdout</code> 으로 해 뒀어요.</p>`,
      example: { code: `import argparse
import logging
import shutil
import sys
import tempfile
from datetime import date
from pathlib import Path
from samples import make_files

log = logging.getLogger("collect")


def is_junk(p):
    return p.name.startswith("~$") or p.name == "Thumbs.db" or p.suffix.lower() == ".tmp"


def plan(src):
    """할 일 목록만 만들어요 — 아무것도 바꾸지 않아요."""
    todo = []
    for p in sorted(src.iterdir()):
        if p.is_file() and not is_junk(p):
            todo.append(p)
    return todo


def main(argv=None, today=None):
    parser = argparse.ArgumentParser(prog="collect")
    parser.add_argument("src", help="원본 폴더(읽기만 해요)")
    parser.add_argument("dst", help="결과를 둘 폴더")
    parser.add_argument("--dry-run", action="store_true", help="복사하지 않고 미리 보기만")
    args = parser.parse_args(argv)
    if today is None:
        today = date.today()
    src = Path(args.src)
    if not src.is_dir():
        print(f"원본 폴더가 없어요: {args.src}", file=sys.stderr)
        return 1
    out = Path(args.dst) / f"모음_{today.isoformat()}"
    todo = plan(src)
    if args.dry_run:
        for p in todo:
            print("[미리 보기] 복사:", p.name)
        print(f"미리 보기 끝 — {len(todo)}개를 {out.name} 에 복사할 거예요")
        return 0
    out.mkdir(parents=True, exist_ok=True)
    for p in todo:
        shutil.copy(p, out)
        log.info("복사 %s", p.name)
    print(f"{len(todo)}개를 {out.name} 에 복사했어요")
    return 0


# 연습: 임시 폴더에서 미리 보기 → 진짜 → 없는 폴더
logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s", stream=sys.stdout)
with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_files(base / "다운로드")
    src = str(base / "다운로드")
    dst = str(base / "결과")
    day = date(2026, 11, 8)
    code = main([src, dst, "--dry-run"], today=day)
    print("끝 코드", code, "· 결과 폴더가 생겼나:", (base / "결과").exists())
    code = main([src, dst], today=day)
    print("끝 코드", code)
    code = main([str(base / "없는폴더"), dst], today=day)
    print("끝 코드", code)`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["자동화할 일은 자주 · 규칙대로 · 오래 걸리는 일 — 한 번 5분 × 주 5번 × 52주 = 한 해 21시간, 사람이 판단할 일은 남겨요", "안전 세 원칙: 원본은 읽기만 · 결과는 새 폴더에 · 미리 보기 먼저 — 연습은 늘 임시 폴더에서, samples.py 의 make_files(tmp) 로 가짜 파일을 만들어요", "기본 모양은 main(argv=None, today=None) + argparse 의 --dry-run + plan() 으로 목록 먼저 + log.info + return 0 · 1 과 sys.exit(main())"] },
{ id: 'J1', ch: 1, n: 1, title: '이름 한꺼번에 바꾸기 · 날짜로 정리', mode: 'text',
  tutorSummary: "파이썬 L27(rename · shutil.move) · X7(확장자별 정리기)은 다시 가르치지 않고 링크. 규칙을 함수로: rule(p, i) 가 새 이름을 돌려줌 — 번호 f\"공방_{i:03}{p.suffix.lower()}\", 앞뒤 붙이기 f\"…{p.stem}…\", re.sub(r\"^IMG_\", \"사진_\", p.name). safe_name(text): re.sub(r'[<>:\"/\\\\|?*\\s]+', \"_\", text).strip(\"_\") — Windows 금지 글자 9개와 빈칸을 _ 하나로. 순서: plan(files, rule) → [(원래, 새)](그대로인 것 뺌, i 는 1부터) → preview(pairs) 「전 → 후」 표 → conflicts(pairs) 빈 리스트일 때만 바꾸기. 충돌 둘: 새 이름끼리 겹침(Counter 로 str(new).lower() 를 세어 2 이상) · 이미 있는 다른 파일(names_in(new.parent) — 폴더 이름을 소문자로 모은 set, 이번에 바꿀 원래 파일이면 충돌 아님). Windows · Mac 은 대소문자를 같게 봐서 IMG_0001.JPG 가 있으면 Path(\"IMG_0001.jpg\").exists() 가 True — exists() 대신 소문자 비교로 어느 OS 든 같은 답. 맞바꾸기 함정: a→b, b→a 나 번호 밀기 01→02, 02→03 을 차례로 rename 하면 Windows 는 FileExistsError, Mac · 리눅스는 말없이 덮어씀 → apply(pairs) 두 단계(① 모두 __바꾸는중{i}__원래이름 으로 rename ② shutil.move 로 새 자리, mkdir(parents=True, exist_ok=True)). 되돌리기: save_log 로 rename_log.csv(utf-8-sig, newline=\"\", 열 원래 · 새, 전체 경로, 바꾸는 폴더 밖에) · undo(log_path) 는 (새, 원래) 로 뒤집어 conflicts → apply, 문제 있으면 False. rename_files(pairs, log_path, dry_run=False) = preview → conflicts(있으면 「멈춤 —」 출력 후 False) → dry_run 이면 False → apply → save_log → True. 날짜: p.stat().st_mtime(타임스탬프) → datetime.fromtimestamp(ts)(내 PC 시각대), datetime 은 date + 시분초, strftime(\"%Y-%m-%d\"), datetime(…).timestamp(), os.utime(p, (ts, ts)) 로 수정 시각 정하기(samples 가 고정해 둠). dated_name(p, i) → 2026-10-03_IMG_0001.jpg, month_folder(base, p) → base/2026/10/이름 으로 짝을 만들어 conflicts → apply. YYYY-MM-DD 는 이름 순 = 날짜 순. 결과 찍기: base.glob(\"**/*\") + p.relative_to(base).as_posix(). 수정 시각 ≠ 찍은 날(EXIF 는 이름만).",
  terms: { "충돌": "이름을 바꾸거나 옮길 때 새 이름이 다른 파일과 겹치는 것. 그대로 두면 덮어쓰거나 에러가 나서, 바꾸기 전에 먼저 찾아요", "타임스탬프": "1970년 1월 1일 0시(세계 표준시)부터 센 초. 파일의 수정 시각 st_mtime 이 이 모양이에요" },
  pages: [
    { title: "new_name(p, i) · f\"{i:03}\" · re.sub", html: `<p>복습: 이름 하나 바꾸기 <code>p.rename(새 경로)</code> 와 옮기기 <code>shutil.move</code> 는 <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a>, 확장자별 정리는 <a href="../python/#lesson/X7" target="_blank" rel="noopener">파이썬 교과서 「실전 7: 다운로드 폴더 정리기」 ↗</a> 에서 했어요. 이번엔 이름 <b>수십 개를 규칙대로</b> 한꺼번에 바꿔요. 공방의 다운로드 폴더 이름은 제각각이에요 — <code>IMG_0001.JPG</code> · <code>견적서 최종.docx</code> · <code>스크린샷 2026-10-05.png</code>.</p>
<p>먼저 <b>규칙을 함수 하나로</b> 떼요. 파일 <code>p</code> 와 차례 번호 <code>i</code> 를 받아 새 이름(글자)을 돌려주는 함수예요. 규칙만 바꿔 끼우면 나머지 코드(미리 보기 · 검사 · 바꾸기)는 그대로 써요(함수를 값처럼 넘기기 — 복습: <a href="../python/#lesson/L18" target="_blank" rel="noopener">파이썬 교과서 「람다 · 함수를 값처럼」 ↗</a>).</p>
<table class="kb"><tbody><tr><th>규칙</th><th>함수 안</th><th>예</th></tr><tr><td>번호 붙이기</td><td><code>f"공방_{i:03}{p.suffix.lower()}"</code></td><td><code>IMG_0001.JPG</code> → <code>공방_001.jpg</code></td></tr><tr><td>앞 · 뒤에 붙이기</td><td><code>f"2026_{p.stem}_최종{p.suffix}"</code></td><td><code>견적.docx</code> → <code>2026_견적_최종.docx</code></td></tr><tr><td>일부 바꾸기</td><td><code>re.sub(r"^IMG_", "사진_", p.name)</code></td><td><code>IMG_0001.JPG</code> → <code>사진_0001.JPG</code></td></tr></tbody></table>
<p><code>{i:03}</code> 은 세 자리로 맞추고 빈 자리는 0 으로 채워요(복습: <a href="../python/#lesson/L9C" target="_blank" rel="noopener">파이썬 교과서 「서식 출력: 칸 맞추기 · 소수 · 쉼표」 ↗</a>). <code>001 · 002 · … · 010</code> 이라야 이름 순으로 늘어놓았을 때 <code>10</code> 이 <code>2</code> 앞에 오지 않아요. <code>re.sub(패턴, 바꿀 글자, 글)</code> 은 모양으로 찾아 바꿔요(복습: <a href="../python/#lesson/L20B" target="_blank" rel="noopener">파이썬 교과서 「정규식 2: 찾아 꺼내기 · 줄 처음과 끝」 ↗</a>).</p>
<p>그리고 이름에 <b>못 쓰는 글자</b>를 미리 바꿔 두는 함수가 하나 더 있으면 좋아요. Windows 는 <code>&lt; &gt; : " / \\ | ? *</code> 아홉 글자를 파일 이름에 못 써요. 빈칸은 쓸 수는 있지만 명령 줄에서 따옴표가 필요해서 <code>_</code> 로 바꿔 두면 편해요.</p>
<pre>def safe_name(text):
    text = re.sub(r'[&lt;&gt;:"/\\\\|?*\\s]+', "_", text)
    return text.strip("_")

print(safe_name("10월 회의: 결정 사항?"))    # 10월_회의_결정_사항</pre>
<ul><li>대괄호 <code>[…]</code> 는 「이 글자들 중 하나」, 뒤의 <code>+</code> 는 「하나 이상 이어진 것」 이라서 <code>: </code> 처럼 붙어 있는 두 글자도 <code>_</code> 하나가 돼요. <code>\\\\</code> 는 역슬래시 한 글자, <code>\\s</code> 는 빈칸이에요</li><li><code>strip("_")</code> 은 앞뒤 끝의 <code>_</code> 를 떼요(<code>"?"</code> 로 끝났던 자리)</li></ul>`,
      example: { code: `import re
from pathlib import Path


def safe_name(text):
    """Windows 가 못 쓰는 글자 9개와 빈칸 → _ (여러 개가 붙어 있으면 _ 하나)"""
    text = re.sub(r'[<>:"/\\\\|?*\\s]+', "_", text)
    return text.strip("_")


def new_name(p, i):
    """규칙 하나 = 함수 하나: 공방_001.jpg 처럼 번호 붙이기"""
    return f"공방_{i:03}{p.suffix.lower()}"


print(safe_name("10월 회의: 결정 사항?"))
print(safe_name("  견적서 최종 (2).docx "))
print(safe_name('A/S 접수 "급함" <꼭>'))

files = [Path("IMG_0001.JPG"), Path("IMG_0002.jpg"), Path("스크린샷 2026-10-05.png")]
for i, p in enumerate(files):
    print(p.name, "→", new_name(p, i + 1))

print(re.sub(r"^IMG_", "사진_", "IMG_0001.JPG"))
print(f"2026_{Path('견적.docx').stem}_최종.docx")` } },
    { title: "plan · preview · conflicts", html: `<p>규칙이 생겼으면 <b>바로 바꾸지 않아요</b>. 순서는 늘 셋이에요: ① 바꿀 목록 만들기 → ② 미리 보기 표 → ③ 충돌 검사. 문제가 하나라도 있으면 하나도 바꾸지 않고 멈춰요. 반쯤 바꾸다 멈추면 고치기가 더 어려워요.</p>
<pre>pairs = plan(files, new_name)     # [(원래 경로, 새 경로), …]
preview(pairs)                    # IMG_0001.JPG  →  공방_001.jpg …
problems = conflicts(pairs)       # 빈 리스트면 바꿔도 돼요</pre>
<p><code>plan</code> 은 파일마다 규칙을 불러 <code>(원래, 새)</code> 짝 리스트를 만들어요. 이름이 그대로인 파일은 빼요. [[충돌]]은 두 가지예요.</p>
<table class="kb"><tbody><tr><th>충돌</th><th>예</th><th>찾는 법</th></tr><tr><td>새 이름끼리 겹침</td><td>두 파일이 둘 다 <code>사진.jpg</code> 가 됨</td><td><code>Counter</code> 로 새 이름을 세어 2 이상(복습: <a href="../python/#lesson/L16E" target="_blank" rel="noopener">파이썬 교과서 「표준 라이브러리 둘러보기」 ↗</a>)</td></tr><tr><td>이미 있는 다른 파일</td><td>지난번에 만든 <code>공방_001.jpg</code> 가 폴더에 있음</td><td>그 폴더의 이름들에 새 이름이 있는지</td></tr></tbody></table>
<p><code>Counter(str(new).lower() for old, new in pairs)</code> 의 괄호 안은 제너레이터 식이에요(복습: <a href="../python/#lesson/L18C" target="_blank" rel="noopener">파이썬 교과서 「반복자와 제너레이터」 ↗</a>). 단, 이미 있는 파일이 <b>이번에 바꿀 원래 파일 중 하나</b>면 충돌이 아니에요 — 곧 다른 이름으로 비켜 줄 테니까요(맞바꾸기는 다음 쪽).</p>
<div class="bk-warn"><b>Windows 는 대소문자를 같게 봐요</b> — Windows(그리고 Mac 기본 설정)에서는 <code>IMG_0001.JPG</code> 가 있으면 <code>Path("IMG_0001.jpg").exists()</code> 도 <code>True</code> 예요. 같은 파일이거든요. 그래서 <code>exists()</code> 로 검사하면 확장자만 소문자로 바꾸는 규칙이 「이미 있어요」 로 막히고, 리눅스에서는 반대로 <code>img.jpg</code> 와 <code>IMG.JPG</code> 가 따로 있을 수 있어요. 이 교과서는 <code>names_in(folder)</code> 로 폴더의 이름을 <b>소문자로 모아</b> 직접 비교해서, 어느 컴퓨터에서나 같은 답을 내요.</div>`,
      example: { code: `import re
import tempfile
from collections import Counter
from pathlib import Path
from samples import make_files

def safe_name(text):
    """Windows 가 못 쓰는 글자 9개와 빈칸 → _ (여러 개가 붙어 있으면 _ 하나)"""
    text = re.sub(r'[<>:"/\\\\|?*\\s]+', "_", text)
    return text.strip("_")

def plan(files, rule):
    """[(원래 경로, 새 경로)] — rule(p, i) 가 새 이름을 돌려줘요(i 는 1부터). 그대로인 것은 빼요"""
    pairs = []
    for i, p in enumerate(files):
        new = p.parent / rule(p, i + 1)
        if new != p:
            pairs.append((p, new))
    return pairs


def preview(pairs):
    for old, new in pairs:
        print(f"  {old.name}  →  {new.name}")
    print(f"바꿀 파일 {len(pairs)}개")

def names_in(folder):
    """폴더 안의 이름들(소문자로) — Windows 처럼 대소문자를 같게 보려고"""
    names = set()
    if folder.is_dir():
        for q in folder.iterdir():
            names.add(q.name.lower())
    return names


def conflicts(pairs):
    """바꾸기 전에 막을 것 두 가지: 새 이름끼리 겹침 · 이미 있는 다른 파일"""
    olds = set()
    for old, new in pairs:
        olds.add(str(old).lower())
    counts = Counter(str(new).lower() for old, new in pairs)
    problems = []
    for old, new in pairs:
        key = str(new).lower()
        if counts[key] > 1:
            problems.append(f"새 이름이 겹쳐요: {old.name} → {new.name}")
        elif key not in olds and new.name.lower() in names_in(new.parent):
            problems.append(f"이미 있어요: {new.name}")
    return problems

def is_junk(p):
    return p.name.startswith("~$") or p.name == "Thumbs.db" or p.suffix.lower() == ".tmp"


with tempfile.TemporaryDirectory() as tmp:
    src = Path(tmp) / "다운로드"
    files = make_files(src)
    keep = []
    for p in files:
        if not is_junk(p):
            keep.append(p)

    def tidy(p, i):                       # 규칙 ①: 빈칸은 _, 확장자는 소문자
        return safe_name(p.stem) + p.suffix.lower()

    pairs = plan(keep, tidy)
    preview(pairs)
    print("충돌:", conflicts(pairs))       # IMG_0001.JPG → .jpg 도 문제없어요

    def photo(p, i):                       # 규칙 ②: 사진은 사진_001.jpg …
        return f"사진_{i:03}{p.suffix.lower()}"

    photos = []
    for p in keep:
        if p.suffix.lower() == ".jpg":
            photos.append(p)
    (src / "사진_001.jpg").write_text("지난번 것", encoding="utf-8")   # 지난번에 만든 파일이 남아 있다면
    pairs = plan(photos, photo)
    for msg in conflicts(pairs):
        print(msg)

    def same(p, i):                        # 규칙 ③: 실수 — 모두 같은 이름
        return "사진.jpg"

    pairs = plan(photos, same)
    for msg in conflicts(pairs):
        print(msg)`, prep: [SAMPLES_PREP] } },
    { title: "맞바꾸기 함정 → 임시 이름으로 두 단계", html: `<p>검사를 통과한 목록을 <code>for old, new in pairs: old.rename(new)</code> 로 차례로 바꾸면 될까요? 짝이 서로 얽혀 있으면 안 돼요.</p>
<table class="kb"><tbody><tr><th>목록</th><th>차례로 바꾸면</th></tr><tr><td>맞바꾸기 <code>발표1 → 발표2</code>, <code>발표2 → 발표1</code></td><td>첫 줄에서 <code>발표2</code> 가 이미 있어요</td></tr><tr><td>번호 밀기 <code>01 → 02</code>, <code>02 → 03</code></td><td>첫 줄에서 <code>02</code> 가 이미 있어요</td></tr></tbody></table>
<p>이때 무슨 일이 나는지는 운영 체제마다 달라요. <b>Windows</b> 는 <code>FileExistsError</code> 로 첫 줄에서 멈춰요 — 반만 바뀌진 않았지만 일은 안 됐어요. <b>Mac · 리눅스</b> 는 에러 없이 <code>발표2</code> 를 <b>덮어써서</b> 그 내용이 사라져요. 둘 다 원치 않아요.</p>
<p>답은 <b>두 단계</b>예요. ① 바꿀 파일을 모두 아무도 안 쓰는 임시 이름(<code>__바꾸는중0__발표1.pptx</code>)으로 비켜 놓고 ② 임시 이름에서 새 이름으로 옮겨요. ①이 끝나면 원래 이름들이 모두 비어 있어서, 맞바꾸기든 번호 밀기든 안전해요.</p>
<pre>def apply(pairs):
    temps = []
    for i, pair in enumerate(pairs):
        old, new = pair
        tmp = old.parent / f"__바꾸는중{i}__{old.name}"
        old.rename(tmp)                  # ① 비켜 놓기
        temps.append((tmp, new))
    for tmp, new in temps:
        new.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(tmp, new)            # ② 새 자리로</pre>
<ul><li>②에서 <code>rename</code> 대신 <code>shutil.move</code> 를 쓰면 새 자리가 다른 폴더 · 다른 드라이브여도 돼요(날짜 폴더로 옮기기는 마지막 쪽). <code>mkdir(parents=True, exist_ok=True)</code> 는 <code>2026/10</code> 처럼 중간 폴더까지 한 번에 만들어요</li><li><code>apply</code> 앞에는 늘 <code>conflicts</code> 를 먼저 불러요. <code>apply</code> 는 검사하지 않아요</li></ul>`,
      example: { code: `import re
import shutil
import tempfile
from collections import Counter
from pathlib import Path

def names_in(folder):
    """폴더 안의 이름들(소문자로) — Windows 처럼 대소문자를 같게 보려고"""
    names = set()
    if folder.is_dir():
        for q in folder.iterdir():
            names.add(q.name.lower())
    return names


def conflicts(pairs):
    """바꾸기 전에 막을 것 두 가지: 새 이름끼리 겹침 · 이미 있는 다른 파일"""
    olds = set()
    for old, new in pairs:
        olds.add(str(old).lower())
    counts = Counter(str(new).lower() for old, new in pairs)
    problems = []
    for old, new in pairs:
        key = str(new).lower()
        if counts[key] > 1:
            problems.append(f"새 이름이 겹쳐요: {old.name} → {new.name}")
        elif key not in olds and new.name.lower() in names_in(new.parent):
            problems.append(f"이미 있어요: {new.name}")
    return problems

def apply(pairs):
    """두 단계로 바꿔요: ① 모두 임시 이름으로 ② 임시 이름 → 새 이름"""
    temps = []
    for i, pair in enumerate(pairs):
        old, new = pair
        tmp = old.parent / f"__바꾸는중{i}__{old.name}"
        old.rename(tmp)
        temps.append((tmp, new))
    for tmp, new in temps:
        new.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(tmp, new)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    (base / "발표1.pptx").write_text("인사", encoding="utf-8")
    (base / "발표2.pptx").write_text("본론", encoding="utf-8")

    swap = [(base / "발표1.pptx", base / "발표2.pptx"),
            (base / "발표2.pptx", base / "발표1.pptx")]
    print("충돌:", conflicts(swap))      # 서로 비켜 주니까 충돌이 아니에요
    apply(swap)
    for p in sorted(base.iterdir()):
        print(p.name, p.read_text(encoding="utf-8"))

    for n in [1, 2, 3]:
        (base / f"사진_{n:03}.jpg").write_text(f"{n}번 사진", encoding="utf-8")
    shift = []
    for n in [1, 2, 3]:                  # 번호를 하나씩 밀어서 001 자리를 비우기
        shift.append((base / f"사진_{n:03}.jpg", base / f"사진_{n + 1:03}.jpg"))
    print("충돌:", conflicts(shift))
    apply(shift)
    for p in sorted(base.glob("사진_*.jpg")):
        print(p.name, p.read_text(encoding="utf-8"))` } },
    { title: "rename_log.csv · undo(log_path)", html: `<p>이름 바꾸기는 원본 자리에서 바꾸는 일이라 「결과는 새 폴더에」 원칙을 못 지켜요. 대신 <b>되돌리기 기록</b>을 남겨요. 무엇을 무엇으로 바꿨는지 csv 로 적어 두면, 그 기록을 거꾸로 읽어 원래대로 돌려놓을 수 있어요.</p>
<pre>원래,새
C:\\Users\\me\\Downloads\\IMG_0001.JPG,C:\\Users\\me\\Downloads\\IMG_0001.jpg
C:\\Users\\me\\Downloads\\견적서 최종.docx,C:\\Users\\me\\Downloads\\견적서_최종.docx</pre>
<ul><li>기록은 <b>전체 경로</b>로 적어요. 그래야 어느 폴더에서 <code>undo</code> 를 돌려도 같은 파일을 찾아요</li><li>엑셀에서도 열어 보게 <code>encoding="utf-8-sig"</code> · <code>newline=""</code> 로 써요(복습: <a href="../python/#lesson/L29" target="_blank" rel="noopener">파이썬 교과서 「csv 모듈 제대로」 ↗</a>)</li><li>기록 파일은 <b>바꾸는 폴더 밖에</b> 둬요. 안에 두면 다음번 목록에 기록 파일까지 끼어요</li></ul>
<p><code>undo</code> 는 기록을 읽어 <code>(새, 원래)</code> 로 뒤집은 목록을 만들고, 앞에서 만든 <code>conflicts</code> → <code>apply</code> 를 그대로 써요. 바꾼 뒤에 누가 같은 이름으로 새 파일을 만들었으면 검사에서 멈춰요.</p>
<p>지금까지의 순서를 함수 하나로 묶으면 <code>rename_files(pairs, log_path, dry_run=False)</code> 예요: 미리 보기 → 충돌 검사(있으면 멈춤) → 미리 보기 모드면 여기서 끝 → <code>apply</code> → 기록. [[레슨:J0]] 의 <code>--dry-run</code> 을 여기에 이어 주면 돼요.</p>`,
      example: { code: `import csv
import re
import shutil
import tempfile
from collections import Counter
from pathlib import Path
from samples import make_files

def safe_name(text):
    """Windows 가 못 쓰는 글자 9개와 빈칸 → _ (여러 개가 붙어 있으면 _ 하나)"""
    text = re.sub(r'[<>:"/\\\\|?*\\s]+', "_", text)
    return text.strip("_")

def plan(files, rule):
    """[(원래 경로, 새 경로)] — rule(p, i) 가 새 이름을 돌려줘요(i 는 1부터). 그대로인 것은 빼요"""
    pairs = []
    for i, p in enumerate(files):
        new = p.parent / rule(p, i + 1)
        if new != p:
            pairs.append((p, new))
    return pairs


def preview(pairs):
    for old, new in pairs:
        print(f"  {old.name}  →  {new.name}")
    print(f"바꿀 파일 {len(pairs)}개")

def names_in(folder):
    """폴더 안의 이름들(소문자로) — Windows 처럼 대소문자를 같게 보려고"""
    names = set()
    if folder.is_dir():
        for q in folder.iterdir():
            names.add(q.name.lower())
    return names


def conflicts(pairs):
    """바꾸기 전에 막을 것 두 가지: 새 이름끼리 겹침 · 이미 있는 다른 파일"""
    olds = set()
    for old, new in pairs:
        olds.add(str(old).lower())
    counts = Counter(str(new).lower() for old, new in pairs)
    problems = []
    for old, new in pairs:
        key = str(new).lower()
        if counts[key] > 1:
            problems.append(f"새 이름이 겹쳐요: {old.name} → {new.name}")
        elif key not in olds and new.name.lower() in names_in(new.parent):
            problems.append(f"이미 있어요: {new.name}")
    return problems

def apply(pairs):
    """두 단계로 바꿔요: ① 모두 임시 이름으로 ② 임시 이름 → 새 이름"""
    temps = []
    for i, pair in enumerate(pairs):
        old, new = pair
        tmp = old.parent / f"__바꾸는중{i}__{old.name}"
        old.rename(tmp)
        temps.append((tmp, new))
    for tmp, new in temps:
        new.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(tmp, new)

def save_log(pairs, log_path):
    with open(log_path, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["원래", "새"])
        for old, new in pairs:
            w.writerow([str(old), str(new)])


def rename_files(pairs, log_path, dry_run=False):
    """미리 보기 → 충돌 검사 → (진짜면) 바꾸고 기록. 바꿨으면 True"""
    preview(pairs)
    problems = conflicts(pairs)
    for msg in problems:
        print("멈춤 —", msg)
    if problems or dry_run:
        return False
    apply(pairs)
    save_log(pairs, log_path)
    return True


def undo(log_path):
    """rename_log.csv 를 거꾸로(새 → 원래) 되돌려요"""
    with open(log_path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    back = []
    for row in rows:
        back.append((Path(row["새"]), Path(row["원래"])))
    problems = conflicts(back)
    for msg in problems:
        print("되돌리지 못해요 —", msg)
    if problems:
        return False
    apply(back)
    return True

def is_junk(p):
    return p.name.startswith("~$") or p.name == "Thumbs.db" or p.suffix.lower() == ".tmp"


def tidy(p, i):
    return safe_name(p.stem) + p.suffix.lower()


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "다운로드"
    log_path = base / "rename_log.csv"       # 바꾸는 폴더 밖에
    files = make_files(src)
    before = sorted(p.name for p in src.iterdir())
    keep = []
    for p in files:
        if not is_junk(p):
            keep.append(p)
    pairs = plan(keep, tidy)

    print("바꿨나:", rename_files(pairs, log_path, dry_run=True))   # 미리 보기만
    print("바꿨나:", rename_files(pairs, log_path))
    now = sorted(p.name for p in src.iterdir())
    print(now[:5])

    with open(log_path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    print("기록", len(rows), "줄 — 첫 줄:", Path(rows[0]["원래"]).name, "→", Path(rows[0]["새"]).name)

    print("되돌렸나:", undo(log_path))
    after = sorted(p.name for p in src.iterdir())
    print("처음과 같나:", before == after)`, prep: [SAMPLES_PREP] } },
    { title: "st_mtime → fromtimestamp · 2026/10", html: `<p>사진 · 문서를 <b>날짜로</b> 정리하려면 파일마다 날짜가 있어야 해요. 파일의 <b>수정 시각</b>은 <code>p.stat().st_mtime</code> 에 있어요. 1970년 1월 1일부터 센 초([[타임스탬프]])라서 <code>1791...</code> 같은 큰 수예요. 사람이 읽는 시각으로 바꾸려면 <code>datetime</code> 을 써요.</p>
<p>복습: <a href="../python/#lesson/L16B" target="_blank" rel="noopener">파이썬 교과서 「날짜: datetime 맛보기」 ↗</a> · <a href="../python/#lesson/L19" target="_blank" rel="noopener">파이썬 교과서 「날짜 2: 글자 ↔ 날짜 · 비교」 ↗</a> 의 <code>date</code> 는 날짜만이었어요. <code>datetime</code> 은 날짜에 <b>시 · 분 · 초</b>까지 붙은 값이에요. 쓰는 법은 거의 같아요.</p>
<pre>from datetime import datetime

d = datetime(2026, 10, 3, 9, 12)
print(d)                          # 2026-10-03 09:12:00
print(d.strftime("%Y-%m-%d"))     # 2026-10-03
print(d.strftime("%Y"), d.strftime("%m"))   # 2026 10
print(d.date())                   # 2026-10-03</pre>
<table class="kb"><tbody><tr><th>바꾸기</th><th>코드</th></tr><tr><td>타임스탬프 → 시각</td><td><code>datetime.fromtimestamp(p.stat().st_mtime)</code> — 내 PC 의 시각대(한국 시각)로</td></tr><tr><td>시각 → 타임스탬프</td><td><code>datetime(2026, 10, 3, 9, 12).timestamp()</code></td></tr><tr><td>파일의 수정 시각 정하기</td><td><code>os.utime(p, (ts, ts))</code> — 앞은 열어 본 시각, 뒤가 수정 시각. <code>samples.py</code> 의 <code>make_files</code> 가 이걸로 날짜를 고정해 둬요</td></tr></tbody></table>
<p>이제 규칙 함수 둘을 만들어요. <code>dated_name</code> 은 이름 앞에 날짜를 붙이는 규칙(<code>2026-10-03_IMG_0001.jpg</code>)이라 <code>plan</code> 에 그대로 넣어요. <code>month_folder</code> 는 <b>옮길 자리</b>(<code>정리/2026/10/IMG_0001.JPG</code>)를 돌려줘서, 짝을 직접 만들어 <code>conflicts</code> → <code>apply</code> 에 넘겨요. <code>YYYY-MM-DD</code> 처럼 큰 단위부터 두 자리로 맞춘 날짜는 <b>이름 순 = 날짜 순</b>이에요.</p>
<p>옮긴 결과는 <code>base.glob("**/*")</code> 로 안쪽 폴더까지 다 돌며 찍어요. <code>p.relative_to(base)</code> 는 <code>base</code> 에서부터의 경로(<code>정리/2026/10/IMG_0001.JPG</code>)이고, <code>.as_posix()</code> 는 Windows 에서도 <code>/</code> 로 잇는 글자예요. 임시 폴더 경로 없이 짧게, 어느 PC 에서나 같은 모양으로 찍혀요.</p>
<div class="bk-warn"><b>수정 시각 ≠ 찍은 날</b> — 카톡 · 메일로 받거나 다른 PC 에서 복사해 오면 수정 시각이 그날로 바뀔 수 있어요. 사진을 찍은 날은 사진 파일 안의 EXIF 정보에 따로 있어요(Pillow 같은 패키지로 읽어요, 이 교과서는 이름만).</div>`,
      example: { code: `import os
import re
import shutil
import tempfile
from collections import Counter
from datetime import datetime
from pathlib import Path
from samples import make_files

def safe_name(text):
    """Windows 가 못 쓰는 글자 9개와 빈칸 → _ (여러 개가 붙어 있으면 _ 하나)"""
    text = re.sub(r'[<>:"/\\\\|?*\\s]+', "_", text)
    return text.strip("_")

def plan(files, rule):
    """[(원래 경로, 새 경로)] — rule(p, i) 가 새 이름을 돌려줘요(i 는 1부터). 그대로인 것은 빼요"""
    pairs = []
    for i, p in enumerate(files):
        new = p.parent / rule(p, i + 1)
        if new != p:
            pairs.append((p, new))
    return pairs


def preview(pairs):
    for old, new in pairs:
        print(f"  {old.name}  →  {new.name}")
    print(f"바꿀 파일 {len(pairs)}개")

def names_in(folder):
    """폴더 안의 이름들(소문자로) — Windows 처럼 대소문자를 같게 보려고"""
    names = set()
    if folder.is_dir():
        for q in folder.iterdir():
            names.add(q.name.lower())
    return names


def conflicts(pairs):
    """바꾸기 전에 막을 것 두 가지: 새 이름끼리 겹침 · 이미 있는 다른 파일"""
    olds = set()
    for old, new in pairs:
        olds.add(str(old).lower())
    counts = Counter(str(new).lower() for old, new in pairs)
    problems = []
    for old, new in pairs:
        key = str(new).lower()
        if counts[key] > 1:
            problems.append(f"새 이름이 겹쳐요: {old.name} → {new.name}")
        elif key not in olds and new.name.lower() in names_in(new.parent):
            problems.append(f"이미 있어요: {new.name}")
    return problems

def apply(pairs):
    """두 단계로 바꿔요: ① 모두 임시 이름으로 ② 임시 이름 → 새 이름"""
    temps = []
    for i, pair in enumerate(pairs):
        old, new = pair
        tmp = old.parent / f"__바꾸는중{i}__{old.name}"
        old.rename(tmp)
        temps.append((tmp, new))
    for tmp, new in temps:
        new.parent.mkdir(parents=True, exist_ok=True)
        shutil.move(tmp, new)

def modified(p):
    """수정 시각(내 PC 시각으로)"""
    ts = p.stat().st_mtime
    return datetime.fromtimestamp(ts)


def dated_name(p, i):
    """규칙: 2026-10-03_IMG_0001.jpg"""
    day = modified(p).strftime("%Y-%m-%d")
    return f"{day}_{safe_name(p.stem)}{p.suffix.lower()}"


def month_folder(base, p):
    """옮길 자리: base/2026/10/이름"""
    d = modified(p)
    return base / d.strftime("%Y") / d.strftime("%m") / p.name

def is_junk(p):
    return p.name.startswith("~$") or p.name == "Thumbs.db" or p.suffix.lower() == ".tmp"


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "다운로드"
    files = make_files(src)
    keep = []
    for p in files:
        if not is_junk(p):
            keep.append(p)
    for p in keep[:3]:
        print(p.name, modified(p))

    preview(plan(keep, dated_name))          # 규칙: 이름 앞에 날짜

    memo = src / "새 메모.txt"                # 수정 시각을 직접 정해 보기
    memo.write_text("연습", encoding="utf-8")
    ts = datetime(2026, 9, 30, 18, 0).timestamp()
    os.utime(memo, (ts, ts))
    keep.append(memo)

    pairs = []
    for p in keep:                           # 옮기기: 정리/2026/10/이름
        pairs.append((p, month_folder(base / "정리", p)))
    print("충돌:", conflicts(pairs))
    apply(pairs)
    for p in sorted((base / "정리").glob("**/*")):
        if p.is_file():
            print(p.relative_to(base).as_posix())`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["규칙은 rule(p, i) 함수 하나로 — 번호 f\"{i:03}\" · 앞뒤 붙이기 · re.sub, Windows 금지 글자 9개와 빈칸은 safe_name 으로 _", "바꾸기 전에 plan → preview → conflicts(새 이름끼리는 Counter, 있던 파일은 소문자 이름 비교) — 맞바꾸기 · 번호 밀기는 임시 이름을 거치는 apply 두 단계로", "rename_log.csv 에 원래 → 새 를 남기면 undo 로 되돌려요 — 날짜 정리는 st_mtime → datetime.fromtimestamp → 2026-10-03_ 이름이나 2026/10 폴더"] },
{ id: 'J2', ch: 1, n: 2, title: '백업: 복사 · 비교 · 정리', mode: 'text',
  tutorSummary: "파이썬 L27(shutil.copy · move · rmtree)은 링크만. 백업은 shutil.copy2(a, b) — 내용 + 수정 시각까지(copy 는 시각이 지금으로). p.stat().st_size(바이트) · st_mtime(타임스탬프, J1). copy2 도 Windows 권한 · 주인은 안 가져감. 폴더 통째: shutil.copytree(src, dst, dirs_exist_ok=True(없으면 이미 있을 때 FileExistsError), ignore=shutil.ignore_patterns(\"*.tmp\", \"~$*\", \"Thumbs.db\", \"__pycache__\")) — 패턴은 Windows dir 같은 * 모양(정규식 아님), 내 코드에서는 fnmatch.fnmatch(이름, 패턴). 결과 찍기 dst.glob(\"**/*\") + relative_to(dst).as_posix(). 바뀐 것만 복사: 빠른 검사 changed(src, dst) — 없거나 st_size 다르거나 st_mtime 차이 > 2초(USB FAT 는 2초 단위), 확실한 검사 filecmp.cmp(a, b, shallow=False)(shallow 기본 True 는 크기 · 시각이 같으면 내용을 안 봄). copy_changed(src_dir, dst_dir, patterns=SKIP, dry_run=False) 는 src_dir.glob(\"**/*\") 를 돌며 rel = p.relative_to(src_dir), skipped(rel, patterns)(rel.parts 의 조각마다 fnmatch — 폴더 __pycache__ 안도), changed 면 target.parent.mkdir(parents=True, exist_ok=True) + copy2, 복사한 rel.as_posix() 리스트를 돌려줌(dry_run 이면 목록만). 두 폴더 비교 filecmp.dircmp(a, b): left_only · right_only · diff_files · common_dirs, 바로 안만(subdirs[이름] 으로 들어감), 빠른 검사. 날짜 이름 백업(2026-11-08/ · 문서_2026-11-08.zip): YYYY-MM-DD 는 이름 순 = 날짜 순, 덮어쓰기 백업은 어제 지운 파일도 사라짐. 최근 n개만 남기기: old_backups(root, keep, prefix=\"\") 는 re.search(r\"\\d{4}-\\d{2}-\\d{2}\", 이름) 이 있고 prefix 로 시작하는 것만 (날짜, 이름) 튜플로 sort, cut = max(len - keep, 0), 앞쪽 cut 개 = 지울 것(오래된 것부터), 날짜 없는 파일은 안 건드림 — dated[:-keep] 은 keep=0 이면 [:0] 이라 안 지워지는 함정. prune_backups(root, keep, prefix, dry_run) 은 [미리 보기] 지울 백업 출력 또는 폴더는 rmtree · 파일은 unlink. shutil.disk_usage(경로).total · used · free(바이트, 값은 PC 마다 달라 ☐). 중복 찾기: 크기로 먼저 defaultdict(list) 로 묶고, 둘 이상인 크기만 hashlib.sha256(p.read_bytes()).hexdigest()(해시는 CS C16 링크, read_bytes 는 바이트로 통째 읽기)로 다시 묶어 둘 이상인 묶음 — 보여 주기만, 지울 쪽은 사람이.",
  terms: { "백업": "원본이 망가지거나 지워져도 되살릴 수 있게 다른 곳에 복사해 두는 것. 날짜별로 여러 개를 남겨 두면 며칠 전 상태로도 돌아갈 수 있어요" },
  pages: [
    { title: "shutil.copy2 vs copy — 수정 시각까지", html: `<p>복습: 파일 하나 복사 <code>shutil.copy(원본, 폴더)</code> 와 옮기기 · 지우기는 <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a> 에서 했어요. [[백업]]은 복사인데, 그냥 복사와 다른 점이 하나 있어요. <b>수정 시각</b>도 같이 가져가야 해요. 그래야 나중에 「원본이 바뀌었나?」 를 시각으로 비교하고, 백업 폴더에서도 날짜 순으로 볼 수 있어요.</p>
<table class="kb"><tbody><tr><th></th><th><code>shutil.copy(a, b)</code></th><th><code>shutil.copy2(a, b)</code></th></tr><tr><td>내용</td><td>복사</td><td>복사</td></tr><tr><td>수정 시각</td><td><b>지금</b>으로 바뀜</td><td>원본 그대로</td></tr><tr><td>쓰는 곳</td><td>새로 만드는 결과물</td><td><b>백업</b></td></tr></tbody></table>
<p>연습 파일은 <code>p.write_text("글", encoding="utf-8")</code>(복습: <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a>) 말고 <code>p.write_bytes(b"photo-1")</code> 로도 만들어요. 사진 · PDF 처럼 글자가 아닌 파일은 <b>바이트</b>로 쓰고 읽어요(<code>p.read_bytes()</code>). <code>samples.py</code> 도 이렇게 가짜 사진을 만들어요.</p>
<p>파일 정보는 <code>p.stat()</code> 하나로 꺼내요. <code>st_size</code> 는 바이트 크기, <code>st_mtime</code> 은 수정 시각(타임스탬프 — [[레슨:J1]] 마지막 쪽)이에요.</p>
<pre>info = p.stat()
print(info.st_size)       # 바이트 수
print(datetime.fromtimestamp(info.st_mtime))   # 수정 시각</pre>
<div class="bk-warn"><b>copy2 도 다 가져가진 않아요</b> — Windows 의 파일 주인 · 보안 설정 같은 것은 복사되지 않아요. 사무 문서 백업에는 상관없지만, 프로그램 폴더를 통째로 옮길 때는 Windows 탐색기나 <code>robocopy</code> 를 써요.</div>`,
      example: { code: `import shutil
import tempfile
from datetime import datetime
from pathlib import Path
from samples import make_files

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "문서"
    make_files(src)
    out = base / "USB"
    out.mkdir()

    p = src / "회의 메모.txt"
    shutil.copy(p, out / "copy.txt")
    shutil.copy2(p, out / "copy2.txt")

    for q in [p, out / "copy.txt", out / "copy2.txt"]:
        info = q.stat()
        when = datetime.fromtimestamp(info.st_mtime)
        print(q.name, info.st_size, "바이트 · 2026-11-02 그대로?", when.date().isoformat() == "2026-11-02")`, prep: [SAMPLES_PREP] } },
    { title: "copytree · ignore_patterns(\"~$*\")", html: `<p>폴더 하나를 <b>안쪽 폴더까지 통째로</b> 복사하는 건 <code>shutil.copytree(원본 폴더, 새 폴더)</code> 예요. 파일마다 <code>copy2</code> 로 복사해서 수정 시각도 그대로예요.</p>
<pre>shutil.copytree(src, dst, dirs_exist_ok=True,
                ignore=shutil.ignore_patterns("*.tmp", "~$*", "Thumbs.db", "__pycache__"))</pre>
<table class="kb"><tbody><tr><th>인자</th><th>뜻</th></tr><tr><td><code>dirs_exist_ok=True</code></td><td>새 폴더가 이미 있어도 그 안에 복사(같은 이름 파일은 덮어씀). 빼면 <code>FileExistsError</code></td></tr><tr><td><code>ignore=shutil.ignore_patterns(…)</code></td><td>이름이 패턴에 맞는 파일 · 폴더는 건너뜀</td></tr></tbody></table>
<p>패턴의 <code>*</code> 는 「아무 글자나 몇 개든」 이에요. <code>"*.tmp"</code> 는 <code>.tmp</code> 로 끝나는 이름, <code>"~$*"</code> 는 <code>~$</code> 로 시작하는 이름(워드 · 엑셀이 열려 있는 동안 생기는 임시 파일), <code>"Thumbs.db"</code> 는 그 이름 하나, <code>"__pycache__"</code> 는 파이썬이 만드는 폴더예요. 정규식이 아니라 Windows 의 <code>dir *.txt</code> 와 같은 모양이에요.</p>
<p>복사된 결과는 <code>dst.glob("**/*")</code> 로 안쪽까지 돌며 <code>p.relative_to(dst).as_posix()</code> 로 찍어요([[레슨:J1]] 마지막 쪽). 같은 패턴 검사를 내 코드에서 쓰려면 <code>fnmatch.fnmatch(이름, 패턴)</code> 이에요 — <code>ignore_patterns</code> 가 안에서 쓰는 함수예요. 다음 쪽에서 써요.</p>
<pre>import fnmatch

print(fnmatch.fnmatch("~$견적.docx", "~$*"))    # True
print(fnmatch.fnmatch("견적.docx", "~$*"))      # False</pre>`,
      example: { code: `import shutil
import tempfile
from pathlib import Path
from samples import make_files

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "문서"
    make_files(src)
    (src / "사진").mkdir()
    shutil.copy2(src / "IMG_0001.JPG", src / "사진" / "공방 입구.jpg")
    (src / "__pycache__").mkdir()
    (src / "__pycache__" / "x.pyc").write_bytes(b"pyc")

    dst = base / "USB" / "문서"
    skip = shutil.ignore_patterns("*.tmp", "~$*", "Thumbs.db", "__pycache__")
    shutil.copytree(src, dst, dirs_exist_ok=True, ignore=skip)

    names = []
    for p in sorted(dst.glob("**/*")):
        names.append(p.relative_to(dst).as_posix())
    print(len(names), "개:", names)

    shutil.copytree(src, dst, dirs_exist_ok=True, ignore=skip)   # 한 번 더 — 덮어써요
    try:
        shutil.copytree(src, dst, ignore=skip)                   # dirs_exist_ok 를 빼면
    except FileExistsError as e:
        print("FileExistsError — 이미 있는 폴더라서 멈췄어요")`, prep: [SAMPLES_PREP] } },
    { title: "바뀐 것만 — st_mtime · filecmp.cmp", html: `<p><code>copytree</code> 는 매번 <b>전부</b> 복사해요. 사진 몇 기가가 든 폴더를 매일 그러면 오래 걸려요. 백업 도구는 <b>새 파일 · 바뀐 파일만</b> 복사해요. 「바뀌었나」 는 두 단계로 봐요.</p>
<table class="kb"><tbody><tr><th></th><th>빠른 검사</th><th>확실한 검사</th></tr><tr><td>무엇을</td><td>크기 <code>st_size</code> + 수정 시각 <code>st_mtime</code></td><td>내용을 한 바이트씩</td></tr><tr><td>코드</td><td><code>changed(src, dst)</code>(아래)</td><td><code>filecmp.cmp(a, b, shallow=False)</code></td></tr><tr><td>속도</td><td>파일을 안 열어서 빨라요</td><td>두 파일을 다 읽어요</td></tr><tr><td>놓치는 것</td><td>크기와 시각이 같은데 내용만 다른 드문 경우</td><td>없어요</td></tr></tbody></table>
<ul><li><code>copy2</code> 로 복사했으니 바뀌지 않았으면 시각이 같아요. 원본을 고치면 크기나 시각이 달라져요</li><li>USB 메모리(FAT32 · exFAT)는 시각을 2초 단위로 적어서 <code>copy2</code> 로도 1초쯤 어긋나요. 그래서 2초 안쪽 차이는 같다고 봐요. <code>abs(x)</code> 는 부호를 뗀 크기라서, 어느 쪽이 더 늦든 차이만 봐요</li><li><code>filecmp.cmp(a, b)</code> 는 <code>shallow</code> 를 빼면 <code>True</code> — 크기 · 시각이 같으면 내용을 안 보고 「같다」 고 해요. 확실히 보려면 <code>shallow=False</code></li></ul>
<p>둘을 합친 <code>copy_changed(src_dir, dst_dir)</code> 는 원본의 모든 파일을 돌며 ① 건너뛸 이름이면 넘기고 ② <code>changed</code> 면 <code>copy2</code> 해요. 상대 경로 <code>rel</code> 을 그대로 백업 쪽에 붙여서(<code>dst_dir / rel</code>) 폴더 구조가 같게 돼요. <code>rel.parts</code> 는 경로를 조각으로 나눈 튜플(<code>('사진', '입구.jpg')</code>)이라 <code>__pycache__</code> 폴더 안의 파일도 걸러요. 미리 보기면 목록만 돌려줘요.</p>
<p>두 폴더를 한눈에 비교하는 <code>filecmp.dircmp(a, b)</code> 도 있어요: <code>left_only</code>(왼쪽에만) · <code>right_only</code>(오른쪽에만) · <code>diff_files</code>(둘 다 있는데 다름) · <code>common_dirs</code>(둘 다 있는 폴더). 바로 안의 것만 보고, 안쪽 폴더는 <code>c.subdirs["사진"]</code> 으로 들어가요. 내용 비교는 <code>filecmp.cmp</code> 의 빠른 검사와 같아요.</p>`,
      example: { code: `import filecmp
import fnmatch
import os
import shutil
import tempfile
from pathlib import Path
from samples import make_files

SKIP = ["*.tmp", "~$*", "Thumbs.db", "__pycache__"]


def skipped(rel, patterns=SKIP):
    """상대 경로의 어느 한 조각이라도 패턴에 맞으면 True(폴더 __pycache__ 안의 파일도)"""
    for part in rel.parts:
        for pattern in patterns:
            if fnmatch.fnmatch(part, pattern):
                return True
    return False

def changed(src, dst):
    """dst 가 없거나 크기 · 수정 시각이 다르면 True(빠른 검사)"""
    if not dst.exists():
        return True
    a = src.stat()
    b = dst.stat()
    if a.st_size != b.st_size:
        return True
    return abs(a.st_mtime - b.st_mtime) > 2      # USB(FAT) 는 2초 단위라 그 안은 같다고 봐요

def copy_changed(src_dir, dst_dir, patterns=SKIP, dry_run=False):
    """새 파일 · 바뀐 파일만 copy2. 복사한(미리 보기면 복사할) 상대 경로 리스트를 돌려줘요"""
    done = []
    for p in sorted(src_dir.glob("**/*")):
        rel = p.relative_to(src_dir)
        if not p.is_file() or skipped(rel, patterns):
            continue
        target = dst_dir / rel
        if not changed(p, target):
            continue
        done.append(rel.as_posix())
        if not dry_run:
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, target)
    return done


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "문서"
    dst = base / "USB" / "문서"
    make_files(src)

    todo = copy_changed(src, dst, dry_run=True)
    print("미리 보기:", len(todo), "개")
    done = copy_changed(src, dst)
    print("1번째:", len(done), "개 복사")
    print("2번째:", copy_changed(src, dst))

    (src / "회의 메모.txt").write_text("회의는 화요일 10시로 바뀜", encoding="utf-8")
    (src / "견적서 v2.docx").write_bytes(b"docx-v2")
    print("3번째:", copy_changed(src, dst))

    # 크기 · 시각이 같은데 내용만 다르면?
    a = src / "IMG_0002.jpg"
    b = dst / "IMG_0002.jpg"
    a.write_bytes(b"photo-X")                   # 같은 7바이트
    ts = b.stat().st_mtime
    os.utime(a, (ts, ts))                       # 시각도 같게
    print("빠른 검사 changed:", changed(a, b))
    print("filecmp.cmp:", filecmp.cmp(a, b), "/ shallow=False:", filecmp.cmp(a, b, shallow=False))

    (dst / "옛날 견적.docx").write_bytes(b"old")
    (src / "청구서_10월.PDF").write_bytes(b"pdf-oct-fixed")
    c = filecmp.dircmp(src, dst)
    print("원본에만:", sorted(c.left_only))
    print("백업에만:", sorted(c.right_only))
    print("다름:", sorted(c.diff_files))`, prep: [SAMPLES_PREP] } },
    { title: "문서_2026-11-08 · 최근 n개만 남기기", html: `<p>백업을 매일 같은 폴더에 덮어쓰면, 어제 실수로 지운 파일이 오늘 백업에서도 사라져요. 그래서 백업은 <b>날짜 이름</b>으로 하나씩 쌓아요: <code>백업/2026-11-08/</code> · <code>백업/문서_2026-11-08.zip</code>([[레슨:J3]] 의 zip). 그럼 며칠 전 상태로도 돌아갈 수 있어요.</p>
<p><code>YYYY-MM-DD</code> 는 큰 단위부터 두 자리로 맞춰서 <b>이름 순 = 날짜 순</b>이에요. 대신 계속 쌓이면 디스크가 차니까 <b>최근 n개만 남기고</b> 지워요. 지우기라서 [[레슨:J0]] 의 원칙대로 지울 목록을 먼저 보여 줘요.</p>
<pre>old = old_backups(backup_root, keep=7)     # 지울 것: 오래된 것부터
prune_backups(backup_root, 7, dry_run=True) # [미리 보기] 지울 백업: …
prune_backups(backup_root, 7)               # 진짜로</pre>
<ul><li>이름에서 날짜는 <code>re.search(r"\\d{4}-\\d{2}-\\d{2}", 이름)</code> 으로 찾아요(복습: <a href="../python/#lesson/L20B" target="_blank" rel="noopener">파이썬 교과서 「정규식 2: 찾아 꺼내기 · 줄 처음과 끝」 ↗</a>). 날짜가 없는 파일 · 폴더(<code>메모.txt</code>)는 <b>절대 건드리지 않아요</b></li><li><code>(날짜, 이름)</code> 튜플 리스트를 <code>sort()</code> 하면 날짜 순이에요. 이름 앞부분이 달라도(<code>문서_</code> · <code>사진_</code>) 날짜로 줄 서요. 한 폴더에 여러 백업을 둘 땐 <code>prefix="문서_"</code> 로 하나만 골라요</li><li>몇 개를 지울지는 <code>max(len(dated) - keep, 0)</code> — 백업이 아직 keep 개보다 적으면 0개예요. <code>dated[:-keep]</code> 으로 쓰면 <code>keep=0</code> 일 때 <code>[:-0]</code> = <code>[:0]</code> 이라 하나도 안 지워지는 함정이 있어요</li><li>폴더 백업은 <code>shutil.rmtree</code>, 파일(zip) 백업은 <code>unlink</code> 로 지워요</li></ul>
<p>지우기 전에 남은 공간을 보고 싶으면 <code>shutil.disk_usage(경로)</code> 예요. <code>total</code> · <code>used</code> · <code>free</code> 가 바이트로 나와요. 값은 PC 마다 달라서 이 교과서는 찍지 않아요 — 내 PC 에서 <code>u.free // 2**30</code>(GB) 를 찍어 보세요.</p>
<pre>u = shutil.disk_usage(".")
print(u.free // 2**30, "GB 남음")</pre>`,
      example: { code: `import re
import shutil
import tempfile
from pathlib import Path

def old_backups(root, keep, prefix=""):
    """root 안의 날짜 이름 백업(2026-11-08 · 문서_2026-11-08.zip) 가운데
    최근 keep 개를 뺀 나머지 = 지울 것, 오래된 것부터"""
    dated = []
    for p in root.iterdir():
        m = re.search(r"\\d{4}-\\d{2}-\\d{2}", p.name)
        if m and p.name.startswith(prefix):
            dated.append((m.group(), p.name))
    dated.sort()
    cut = max(len(dated) - keep, 0)
    old = []
    for day, name in dated[:cut]:
        old.append(root / name)
    return old


def prune_backups(root, keep, prefix="", dry_run=False):
    """지울 목록을 먼저 보여 주고(미리 보기면 거기까지) 지워요"""
    old = old_backups(root, keep, prefix)
    for p in old:
        if dry_run:
            print("[미리 보기] 지울 백업:", p.name)
        elif p.is_dir():
            shutil.rmtree(p)
            print("지웠어요:", p.name)
        else:
            p.unlink()
            print("지웠어요:", p.name)
    return old


with tempfile.TemporaryDirectory() as tmp:
    root = Path(tmp) / "백업"
    root.mkdir()
    for day in ["2026-11-01", "2026-11-03", "2026-10-28", "2026-11-08", "2026-11-05"]:
        (root / day).mkdir()                                 # 폴더 백업
        (root / f"문서_{day}.zip").write_bytes(b"zip")        # 파일 백업
    (root / "메모.txt").write_text("날짜 없는 파일", encoding="utf-8")

    old = old_backups(root, 3, prefix="문서_")
    print("지울 zip:", [p.name for p in old])
    print("keep=9:", old_backups(root, 9, prefix="문서_"))

    prune_backups(root, 3, prefix="문서_", dry_run=True)   # 미리 보기 먼저
    prune_backups(root, 3, prefix="문서_")
    prune_backups(root, 2, prefix="2026-")                # 폴더 백업은 2개만
    left = sorted(p.name for p in root.iterdir())
    print("남은 것:", left)

    u = shutil.disk_usage(root)
    print("공간 정보는 바이트 정수:", type(u.free).__name__, u.free > 0)`, prep: [SAMPLES_PREP] } },
    { title: "중복 파일 찾기 — 크기로 묶고 sha256", html: `<p>백업 전에 같은 파일이 여기저기 복사돼 있으면 공간만 차지해요. <code>IMG_0001.JPG</code> 와 <code>IMG_0001 (1).JPG</code> 처럼요. <b>내용이 똑같은</b> 파일을 찾아요. 이름은 믿을 수 없어서 내용으로 봐요.</p>
<p>내용 비교에는 파일의 지문 sha256 을 써요. 내용이 같으면 지문이 같고, 한 바이트만 달라도 완전히 달라져요. 해시가 무엇인지는 <a href="../cs/#lesson/C16" target="_blank" rel="noopener">CS 교과서 「해시: 데이터의 지문」 ↗</a> 에서 배워요. 여기서는 한 줄이면 돼요.</p>
<pre>hashlib.sha256(p.read_bytes()).hexdigest()   # 64글자 지문</pre>
<p><code>p.read_bytes()</code> 는 파일을 바이트로 통째로 읽어요(이 레슨 첫 쪽). 그런데 모든 파일을 다 읽어 지문을 내면 느려요. 그래서 두 단계로 해요.</p>
<ol><li><b>크기로 먼저 묶기</b> — 크기가 다르면 절대 같은 파일이 아니에요. <code>st_size</code> 는 파일을 안 열어서 빨라요. <code>defaultdict(list)</code> 로 크기별로 모아요(복습: <a href="../python/#lesson/L25" target="_blank" rel="noopener">파이썬 교과서 「collections 더: defaultdict · deque · namedtuple」 ↗</a>)</li><li><b>같은 크기끼리만 지문</b> — 둘 이상인 묶음만 sha256 으로 다시 묶어요</li></ol>
<p>찾은 묶음은 <b>보여 주기만</b> 해요. 어느 쪽을 지울지는 사람이 정해요(어느 폴더의 것이 「진짜」 인지는 프로그램이 몰라요). 아주 큰 파일(동영상)은 <code>read_bytes</code> 로 통째로 읽지 말고 조금씩 읽어 지문에 더해요 — <a href="../cs/#lesson/C16" target="_blank" rel="noopener">CS 교과서 「해시: 데이터의 지문」 ↗</a> 에 그 방법이 있어요.</p>`,
      example: { code: `import hashlib
import shutil
import tempfile
from collections import defaultdict
from pathlib import Path
from samples import make_files

def file_hash(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def duplicates(folder):
    """내용이 똑같은 파일 묶음들 — 크기로 먼저 묶고, 같은 크기끼리만 sha256"""
    by_size = defaultdict(list)
    for p in sorted(folder.glob("**/*")):
        if p.is_file():
            by_size[p.stat().st_size].append(p)
    groups = []
    for size in sorted(by_size):
        same_size = by_size[size]
        if len(same_size) < 2:
            continue
        by_hash = defaultdict(list)
        for p in same_size:
            by_hash[file_hash(p)].append(p)
        for same in by_hash.values():
            if len(same) > 1:
                groups.append(same)
    return groups


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_files(base)
    (base / "사진").mkdir()
    shutil.copy2(base / "IMG_0001.JPG", base / "IMG_0001 (1).JPG")
    shutil.copy2(base / "IMG_0001.JPG", base / "사진" / "공방 입구.jpg")

    sizes = defaultdict(list)
    for p in sorted(base.glob("**/*")):
        if p.is_file():
            sizes[p.stat().st_size].append(p.name)
    print("7바이트 파일:", sizes[7])

    print(file_hash(base / "IMG_0001.JPG")[:16])
    print(file_hash(base / "IMG_0002.jpg")[:16])

    for group in duplicates(base):
        names = []
        for p in group:
            names.append(p.relative_to(base).as_posix())
        print("같은 내용:", names)`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["백업은 수정 시각까지 가져가는 shutil.copy2, 폴더 통째는 copytree(…, dirs_exist_ok=True, ignore=shutil.ignore_patterns(\"~$*\", …))", "바뀐 것만 복사: 크기 st_size + 수정 시각 st_mtime 으로 빠르게, 확실히는 filecmp.cmp(a, b, shallow=False) — 두 폴더는 dircmp 의 left_only · right_only · diff_files", "날짜 이름(YYYY-MM-DD) 백업은 이름 순 = 날짜 순 — 최근 n개만 남기기는 지울 목록을 먼저 보여 주고, 중복 파일은 크기로 묶은 뒤 sha256 으로"] },
{ id: 'J3', ch: 1, n: 3, title: '압축: zipfile', mode: 'text',
  tutorSummary: "zipfile 로 묶고 · 보고 · 풀기. zipfile.ZipFile(path, \"w\", compression=zipfile.ZIP_DEFLATED) — compression 을 빼면 ZIP_STORED(담기만). \"w\" 는 덮어쓰기, \"a\" 는 뒤에 더하기(같은 이름이면 하나 더 생기고 Duplicate name 경고, read 는 마지막 것), 기본 \"r\". 늘 with. zf.write(p, arcname=p.relative_to(src).as_posix()) — arcname 을 빼면 내 PC 경로(Users/me/AppData/…)가 통째로 들어가는 함정, as_posix 로 / 구분, src.rglob(\"*\") 에서 is_file 만, zip 은 원본 폴더 밖에(안에 두면 자기 자신이 들어감 — out.resolve().is_relative_to(src.resolve())). zf.writestr(이름, 글자). 보기: namelist()(넣은 순서 → sorted) · infolist() 의 filename · file_size · compress_size · compress_type · getinfo · zf.read(name) 은 바이트 → decode(\"utf-8\"), 없는 이름은 KeyError. jpg · png · zip 은 거의 안 줄고 아주 작은 파일은 늘기도 함 → 크기는 참 · 거짓으로만. 풀기: extractall(새 빈 폴더 — 같은 이름은 덮어씀) · extract · testzip()(괜찮으면 None, 아니면 처음 망가진 이름 — 파일마다 적힌 CRC-32 지문, J2 의 sha256 과 같은 생각) · is_zipfile · BadZipFile(\"File is not a zip file\", \"Bad CRC-32\"). read_bytes · write_bytes. 암호 zip 은 푸는 것만 pwd=b\"1234\"(만들기는 표준에 없음 — 7-Zip, AES 는 NotImplementedError). 한글 이름이 ░▀└√ 처럼 깨지는 zip(옛 Windows 기본 압축 = cp949, utf-8 표시 없음 → 파이썬은 cp437 로 읽음) → ZipFile(path, metadata_encoding=\"cp949\")(3.11+, 읽기만 — \"w\" 면 ValueError), 깨진 이름으론 read 가 KeyError. shutil.make_archive(확장자 뺀 이름, \"zip\", root_dir=폴더)(\".zip\" 을 주면 .zip.zip) · unpack_archive — 고를 수 없음 → fnmatch.fnmatch(name.lower(), pattern.lower())(* · ? · Windows 는 대소문자 무시) 와 rel.parts 의 . 조각(숨김 폴더)으로 직접 골라 담기. glob 도 같은 모양(문서_????-??-??.zip). tar 는 리눅스 U14.",
  pages: [
    { title: "ZipFile(…, \"w\") · write(p, arcname=…)", html: `<p>[[레슨:J2]] 에서 폴더를 복사해 백업했죠. 이번엔 여러 파일을 <b>zip 파일 하나</b>로 묶어요. 메일에 붙이기 쉽고, 크기가 줄고, 날짜마다 파일 하나로 쌓기도 좋아요. 표준 모듈 <code>zipfile</code> 하나면 돼요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED)</code></td><td>새 zip 만들기. 같은 이름이 있으면 <b>묻지 않고 덮어써요</b></td></tr><tr><td><code>zipfile.ZipFile(path, "a")</code></td><td>있는 zip 뒤에 더 넣기</td></tr><tr><td><code>zipfile.ZipFile(path)</code></td><td>읽기(<code>"r"</code> 이 기본)</td></tr><tr><td><code>zf.write(p, arcname="거래처/연락처.txt")</code></td><td>파일 p 를 넣고, zip 안에서는 그 이름으로</td></tr><tr><td><code>zf.writestr("메모.txt", "글")</code></td><td>파일 없이 글자(또는 바이트)를 바로 넣기</td></tr></tbody></table>
<p>늘 <code>with</code> 로 열어요. with 를 나올 때 zip 의 목차가 마저 써져요. 목차가 빠진 zip 은 열리지 않아요.</p>
<div class="bk-warn"><b>compression 을 빼면 압축을 안 해요</b> — 기본값은 <code>ZIP_STORED</code>(담기만)예요. 크기를 줄이려면 <code>compression=zipfile.ZIP_DEFLATED</code> 를 꼭 적어요.</div>
<p><b>arcname 함정</b>: <code>zf.write(p)</code> 처럼 arcname 을 빼면 zip 안의 이름이 <b>p 의 경로 그대로</b>예요. Windows 라면 <code>Users/me/AppData/Local/Temp/tmpab12cd/다운로드/회의 메모.txt</code> 처럼 내 PC 의 폴더가 통째로 들어가요. 받는 사람이 풀면 폴더가 일곱 겹이고, 내 사용자 이름까지 보여요. 그래서 원본 폴더 기준 <b>상대 경로</b>를 arcname 으로 줘요.</p>
<ul><li>복습: <code>p.relative_to(src).as_posix()</code> 는 [[레슨:J1]] 마지막 쪽에서 본 「src 에서부터의 경로를 <code>/</code> 로 이은 글자」 예요(<code>거래처/연락처.txt</code>). zip 안의 이름은 Windows 에서도 늘 <code>/</code> 라서 딱 맞아요</li><li><code>src.rglob("*")</code> — 안쪽 폴더까지 전부. [[레슨:J1]] · [[레슨:J2]] 에서 쓴 <code>src.glob("**/*")</code> 와 같아요</li><li>rglob 은 폴더도 주니까 <code>p.is_file()</code> 인 것만 넣어요</li></ul>
<div class="bk-warn"><b>zip 은 원본 폴더 밖에</b> — <code>다운로드/다운로드.zip</code> 처럼 원본 안에 만들면, rglob 이 만드는 중인 zip 자신까지 찾아 넣어요. 결과는 늘 다른 폴더에 둬요(안전 원칙 「결과는 새 폴더에」, [[레슨:J0]]). 원본 안인지는 <code>out.resolve().is_relative_to(src.resolve())</code> 로 물어요. <code>resolve()</code> 는 <code>..</code> 같은 것을 풀어 진짜 전체 경로로 바꾸고, <code>is_relative_to(폴더)</code> 는 그 폴더 안이면 <code>True</code> 예요.</div>`,
      example: { code: `import tempfile
import zipfile
from pathlib import Path
from samples import make_files

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "다운로드"
    make_files(src)
    (src / "거래처").mkdir()
    (src / "거래처" / "연락처.txt").write_text("숲속목재 02-000-0000", encoding="utf-8")

    out = base / "다운로드.zip"          # 원본 폴더 밖에 만들어요
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(src.rglob("*")):
            if p.is_file():
                name = p.relative_to(src).as_posix()
                zf.write(p, arcname=name)

    with zipfile.ZipFile(out) as zf:
        names = sorted(zf.namelist())
    print(len(names), "개를 담았어요")
    for name in names:
        print(" ", name)

    # arcname 을 빼면?
    bad = base / "잘못.zip"
    with zipfile.ZipFile(bad, "w") as zf:
        zf.write(src / "회의 메모.txt")
    with zipfile.ZipFile(bad) as zf:
        wrong = zf.namelist()[0]
    print("그냥 파일 이름인가:", wrong == "회의 메모.txt")
    print("앞에 내 PC 폴더가 붙었나:", wrong.endswith("/다운로드/회의 메모.txt"))
    inside = out.resolve().is_relative_to(src.resolve())
    print("zip 이 원본 안인가:", inside)
`, prep: [SAMPLES_PREP] } },
    { title: "namelist() · infolist() · zf.read(name)", html: `<p>zip 을 다 풀지 않고도 안을 볼 수 있어요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>zf.namelist()</code></td><td>안에 든 이름 리스트(넣은 순서 — 찍을 땐 <code>sorted</code>)</td></tr><tr><td><code>zf.infolist()</code></td><td>이름마다 정보 묶음(<code>ZipInfo</code>) 리스트</td></tr><tr><td><code>info.filename</code></td><td>zip 안의 이름</td></tr><tr><td><code>info.file_size</code> · <code>info.compress_size</code></td><td>원래 크기 · 압축된 크기(바이트)</td></tr><tr><td><code>info.compress_type</code></td><td>압축 방식 — <code>zipfile.ZIP_DEFLATED</code> 또는 <code>ZIP_STORED</code></td></tr><tr><td><code>zf.getinfo(name)</code></td><td>이름 하나의 정보</td></tr><tr><td><code>zf.read(name)</code></td><td>그 파일 하나만 꺼내 <b>바이트</b>로</td></tr></tbody></table>
<p><code>zf.read</code> 는 바이트(<code>b'...'</code>)를 줘요. 글자로 바꾸는 건 <code>data.decode("utf-8")</code> 이에요. 글자를 바이트로 바꾸는 <code>encode</code> 의 반대예요.</p>
<p>압축이 얼마나 되는지는 파일마다 달라요.</p>
<ul><li>글자 · csv · 워드 문서처럼 같은 모양이 되풀이되는 파일은 많이 줄어요</li><li><b>jpg · png · mp4 · zip</b> 은 이미 압축된 파일이라 거의 안 줄어요. 사진을 zip 해도 크기는 그대로예요</li><li>몇 바이트짜리 아주 작은 파일은 오히려 <b>늘기도</b> 해요(압축 정보가 붙어서)</li></ul>
<p>그래서 크기는 정확한 바이트 대신 「반 넘게 줄었나」 처럼 참 · 거짓으로 봐요. 압축된 크기는 파이썬 버전마다 조금씩 달라요.</p>
<div class="bk-warn"><b>없는 이름이면 KeyError</b> — zip 에 없는 이름을 주면 <code>KeyError: "There is no item named '견적.txt' in the archive"</code> 예요. 폴더 안 파일은 <code>"메모/할 일.txt"</code> 처럼 폴더 이름까지 적어요.</div>`,
      example: { code: `import tempfile
import zipfile
from pathlib import Path

memo = "회의는 월요일 10시\\n" * 300

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    inner = base / "안쪽.zip"
    with zipfile.ZipFile(inner, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("회의록.txt", memo)

    out = base / "자료.zip"
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("회의록.txt", memo)
        zf.write(inner, arcname="받은 압축.zip")
        zf.writestr("메모/할 일.txt", "견적서 보내기")

    with zipfile.ZipFile(out) as zf:
        print(zf.namelist())
        for info in zf.infolist():
            half = info.compress_size < info.file_size / 2
            print(f"{info.filename}: 반 넘게 줄었나 {half}")
        print("회의록 원래 크기:", zf.getinfo("회의록.txt").file_size, "바이트")
        print("압축 방식:", zf.getinfo("회의록.txt").compress_type == zipfile.ZIP_DEFLATED)

        data = zf.read("메모/할 일.txt")
        print(data[:6])
        print("풀지 않고 읽기:", data.decode("utf-8"))
`, prep: [SAMPLES_PREP] } },
    { title: "extractall(새 폴더) · testzip() · pwd=", html: `<p>이번엔 풀고, 망가지지 않았는지 검사해요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>zf.extractall(새 폴더)</code></td><td>전부 풀기. 폴더가 없으면 만들어요</td></tr><tr><td><code>zf.extract(name, 폴더)</code></td><td>하나만 풀기</td></tr><tr><td><code>zf.testzip()</code></td><td>전부 읽어 보며 검사. 괜찮으면 <code>None</code>, 아니면 처음 망가진 파일 이름</td></tr><tr><td><code>zipfile.is_zipfile(path)</code></td><td>zip 파일이 맞나 <code>True</code> / <code>False</code></td></tr></tbody></table>
<div class="bk-warn"><b>풀기는 늘 새 빈 폴더에</b> — <code>extractall</code> 은 같은 이름의 파일이 있으면 묻지 않고 덮어써요. 남이 보낸 zip 은 <code>받은_자료/견적_2026-11-08</code> 처럼 새 폴더를 만들어 풀어요. 파이썬은 <code>../</code> 같은 위험한 이름을 걸러 내고 풀지만, 원본이 있는 폴더에 바로 푸는 건 피해요.</div>
<p>testzip 은 어떻게 망가진 걸 알까요? zip 은 파일마다 <b>CRC-32</b> 라는 짧은 지문을 같이 적어 둬요. testzip 은 내용을 다시 읽어 지문을 계산하고 맞춰 봐요. [[레슨:J2]] 에서 중복 파일을 찾은 <code>hashlib.sha256(p.read_bytes()).hexdigest()</code> 와 같은 생각이에요. CRC 는 더 짧고, 우연한 고장을 찾는 데 써요(지문 이야기: <a href="../cs/#lesson/C16" target="_blank" rel="noopener">CS 교과서 「해시: 데이터의 지문」 ↗</a>).</p>
<p>예제는 zip 을 일부러 망가뜨려 봐요. 파일을 바이트로 통째 읽고 쓰는 <code>read_bytes</code> · <code>write_bytes</code> 는 [[레슨:J2]] 첫 쪽에서 봤어요. 압축하지 않고 담은 zip 이라 안에 <code>photo-2</code> 가 그대로 들어 있어서, 그 한 곳만 바꿔요.</p>
<p>zip 이 아닌 파일을 열면 <code>zipfile.BadZipFile: File is not a zip file</code> 이에요. 내려받다 끊긴 zip 도 이렇게 나와요.</p>
<p><b>암호 걸린 zip</b> 은 푸는 것만 돼요.</p>
<pre>with zipfile.ZipFile("받은_자료.zip") as zf:
    zf.extractall("받은_자료", pwd=b"1234")   # 암호는 바이트로</pre>
<ul><li>암호를 <b>거는</b> 기능은 표준 zipfile 에 없어요. 7-Zip 같은 프로그램으로 걸어요</li><li>파이썬이 푸는 건 옛 방식(ZipCrypto)뿐이에요. 7-Zip 에서 AES-256 으로 건 zip 은 <code>NotImplementedError</code> 가 나요 → 7-Zip 으로 풀거나 바깥 패키지(pyzipper)를 써요</li><li>암호는 코드에 적지 말고 실행할 때 물어요(<code>getpass</code>, [[레슨:J10]])</li></ul>`,
      example: { code: `import tempfile
import zipfile
from pathlib import Path
from samples import make_files

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "다운로드"
    files = make_files(src)

    out = base / "사진.zip"
    with zipfile.ZipFile(out, "w") as zf:      # 압축 없이 담기만(ZIP_STORED)
        for p in files:
            if p.name.startswith("IMG"):
                zf.write(p, arcname=p.name)

    with zipfile.ZipFile(out) as zf:
        print("검사:", zf.testzip())
        zf.extractall(base / "풀기")
    got = sorted((base / "풀기").iterdir())
    print("풀린 파일:", [p.name for p in got])

    data = out.read_bytes()
    out.write_bytes(data.replace(b"photo-2", b"photo-X"))   # 일부러 한 곳 망가뜨리기
    with zipfile.ZipFile(out) as zf:
        print("검사:", zf.testzip())
        try:
            zf.read("IMG_0002.jpg")
        except zipfile.BadZipFile as e:
            print("BadZipFile:", e)

    memo = src / "회의 메모.txt"
    print("zip 인가:", zipfile.is_zipfile(out), zipfile.is_zipfile(memo))
    try:
        zipfile.ZipFile(memo)
    except zipfile.BadZipFile as e:
        print("BadZipFile:", e)
`, prep: [SAMPLES_PREP] } },
    { title: "metadata_encoding=\"cp949\" — 깨진 한글 이름", html: `<p>거래처가 보낸 zip 을 파이썬으로 열었더니 이름이 <code>░▀└√╝¡.txt</code> 처럼 이상한 그림 글자예요. 내용이 망가진 게 아니라 <b>이름을 읽는 글자 규칙</b>이 달라서예요.</p>
<ul><li>zip 안의 이름은 바이트로 적혀요. 요즘 프로그램은 「이 이름은 utf-8 이에요」 표시를 붙여요. 파이썬의 <code>zf.write</code> 도 한글 이름엔 이 표시를 붙여요</li><li>옛 Windows 기본 압축(「압축(ZIP) 폴더」)이나 옛 압축 프로그램은 표시 없이 <b>cp949</b>(한국어 Windows 의 글자 규칙)로 적어요</li><li>표시가 없으면 파이썬은 zip 표준의 옛 규칙 cp437(옛 미국 DOS 글자)로 읽어요 → 그림 글자</li></ul>
<p>파이썬 3.11 부터는 이름을 읽을 규칙을 정해 줄 수 있어요.</p>
<pre>zipfile.ZipFile(path, metadata_encoding="cp949")</pre>
<ul><li>이름만 cp949 로 읽어요. 파일 <b>내용</b>은 그대로라, <code>decode</code> 는 그 파일이 쓴 규칙대로 해요(예제의 글자는 utf-8)</li><li>읽기에서만 돼요. <code>"w"</code> · <code>"a"</code> 와 같이 주면 <code>ValueError</code> 예요</li><li>3.10 이하라면 이름마다 <code>name.encode("cp437").decode("cp949")</code> 로 되돌리는 옛 방법이 블로그에 많아요</li><li>Mac 에서 만든 zip 은 한글이 <code>ㅎㅏㄴㄱㅡㄹ</code> 처럼 자모로 풀려 보이기도 해요. 이건 다른 문제(유니코드 정규화)라 cp949 로는 안 고쳐져요</li></ul>
<div class="bk-warn"><b>깨진 이름으로는 못 찾아요</b> — 기본으로 열면 <code>zf.read("견적서.txt")</code> 가 <code>KeyError</code> 예요. zip 안의 이름은 <code>░▀└√╝¡.txt</code> 니까요. 그대로 <code>extractall</code> 하면 깨진 이름의 파일이 생기고요. 이름이 이상하면 먼저 cp949 로 다시 열어 <code>namelist()</code> 를 확인해요.</div>`,
      example: { code: `import tempfile
import zipfile
from pathlib import Path
from samples import make_windows_zip

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    p = make_windows_zip(base / "공방_자료.zip")

    with zipfile.ZipFile(p) as zf:                              # 기본으로 열면
        names = sorted(zf.namelist())
        print(names)
        try:
            zf.read("견적서.txt")
        except KeyError as e:
            print("KeyError:", e)

    with zipfile.ZipFile(p, metadata_encoding="cp949") as zf:   # 이름은 cp949 로
        names = sorted(zf.namelist())
        print(names)
        print(zf.read("견적서.txt").decode("utf-8"))
        zf.extractall(base / "풀기")

    for q in sorted((base / "풀기").rglob("*")):
        print("풀림:", q.relative_to(base / "풀기").as_posix())

    try:
        zipfile.ZipFile(base / "새.zip", "w", metadata_encoding="cp949")
    except ValueError as e:
        print("ValueError:", e)
`, prep: [SAMPLES_PREP] } },
    { title: "make_archive 한 줄 · fnmatch 로 빼고 담기", html: `<p>폴더 하나를 통째로 zip 으로 만드는 일은 <code>shutil</code> 한 줄이면 돼요.</p>
<pre>import shutil

made = shutil.make_archive("백업/다운로드", "zip", root_dir="다운로드")
shutil.unpack_archive("백업/다운로드.zip", "풀기")</pre>
<ul><li>첫 칸은 확장자를 <b>뺀</b> 이름이에요. <code>.zip</code> 은 저절로 붙어서, <code>"다운로드.zip"</code> 을 주면 <code>다운로드.zip.zip</code> 이 돼요</li><li><code>root_dir</code> 기준 상대 경로로 들어가요(arcname 걱정 없음). 돌려준 값은 만든 파일의 경로 글자예요</li><li><code>"zip"</code> 대신 <code>"gztar"</code> 면 <code>.tar.gz</code> 예요. tar 는 <a href="../linux/#lesson/U14" target="_blank" rel="noopener">리눅스 교과서 「예약 작업」 ↗</a></li><li><code>unpack_archive(파일, 폴더)</code> 는 확장자를 보고 알아서 풀어요</li></ul>
<p>한계는 <b>고를 수 없다</b>는 거예요. <code>~$</code> 임시 파일 · <code>Thumbs.db</code> · <code>.venv</code> 까지 다 들어가요. 고르려면 첫 쪽처럼 직접 돌면서 이름 모양으로 걸러요. 복습: [[레슨:J2]] 의 <code>skipped</code> 처럼 <code>fnmatch.fnmatch(이름, 모양)</code> 으로 맞춰 봐요. 여기서는 빼는 까닭을 돌려주는 <code>skip_reason</code> 으로 조금 바꾸고, 대소문자도 맞춰요(아래). 모양에는 <code>?</code> 도 있어요.</p>
<table class="kb"><tbody><tr><th>모양</th><th>뜻</th><th>맞는 예</th></tr><tr><td><code>*</code></td><td>아무 글자 몇 개든(0개도)</td><td><code>*.tmp</code> → <code>임시.tmp</code></td></tr><tr><td><code>?</code></td><td>아무 글자 딱 하나</td><td><code>문서_????-??-??.zip</code> → <code>문서_2026-11-08.zip</code></td></tr><tr><td><code>~$*</code></td><td><code>~$</code> 로 시작</td><td><code>~$견적서 최종.docx</code></td></tr></tbody></table>
<p><code>glob</code> 도 같은 모양 규칙을 써요. <code>dest.glob("문서_????-??-??.zip")</code> 은 폴더에서 날짜 이름 백업만 골라 줘요.</p>
<p>숨김 폴더(<code>.git</code> · <code>.venv</code> 처럼 이름이 <code>.</code> 으로 시작)는 경로의 조각마다 봐야 해요. 조각 튜플은 [[레슨:J2]] 에서 본 <code>rel.parts</code> 예요(<code>Path(".venv/Lib/site.py").parts</code> → <code>('.venv', 'Lib', 'site.py')</code>).</p>
<div class="bk-warn"><b>대소문자</b> — Windows 의 fnmatch 는 대소문자를 안 가리고(<code>THUMBS.DB</code> 도 걸려요), 리눅스 · Mac 은 가려요. 어디서나 같게 하려면 둘 다 <code>.lower()</code> 로 맞춰 비교해요.</div>`,
      example: { code: `import fnmatch
import shutil
import tempfile
import zipfile
from pathlib import Path
from samples import make_files

SKIP = ["~$*", "*.tmp", "Thumbs.db"]


def skip_reason(rel):
    for part in rel.parts:
        if part.startswith("."):
            return "숨김 폴더"
    for pattern in SKIP:
        if fnmatch.fnmatch(rel.name.lower(), pattern.lower()):
            return pattern
    return None


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = base / "다운로드"
    make_files(src)
    (src / ".venv").mkdir()
    (src / ".venv" / "pyvenv.cfg").write_text("version = 3.12", encoding="utf-8")

    made = shutil.make_archive(str(base / "한줄"), "zip", root_dir=src)
    with zipfile.ZipFile(made) as zf:
        names = sorted(zf.namelist())
    print("make_archive:", Path(made).name, len(names), "개")
    print(" ", names[:5])

    out = base / "골라서.zip"
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(src.rglob("*")):
            if not p.is_file():
                continue
            rel = p.relative_to(src)
            why = skip_reason(rel)
            if why:
                print("뺌:", rel.as_posix(), "←", why)
                continue
            zf.write(p, arcname=rel.as_posix())
    with zipfile.ZipFile(out) as zf:
        names = zf.namelist()
    print("골라서:", len(names), "개")

    shutil.unpack_archive(out, base / "풀기")
    back = sorted((base / "풀기").iterdir())
    print("풀어 보면:", len(back), "개")
`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["zip 만들기는 ZipFile(경로, \"w\", compression=ZIP_DEFLATED) 와 zf.write(p, arcname=p.relative_to(src).as_posix()) — arcname 을 빼면 내 PC 경로가 통째로 들어가고, zip 은 원본 폴더 밖에 둬요", "풀지 않고 namelist() · infolist() · zf.read(name) 으로 보고, 풀기는 새 빈 폴더에 extractall, 검사는 testzip()(괜찮으면 None) — jpg · zip 은 압축해도 거의 안 줄어요", "한글 이름이 그림 글자로 깨지면 ZipFile(path, metadata_encoding=\"cp949\"), 한 줄 묶기는 shutil.make_archive, 골라 담기는 fnmatch 와 rel.parts 로 직접 해요"] },
{ id: 'JB1', ch: 1, boss: true, title: '만들어 보기: 매일 쓰는 백업 도구', mode: 'text',
  tutorSummary: "만들어 보기: 매일 쓰는 백업 도구 backup.py — ① 넣을 파일 고르기(~$* · *.tmp · Thumbs.db · 숨김 폴더, fnmatch · rel.parts) ② manifest.json(상대 경로 → size · sha256)으로 지난번과 비교, 같으면 건너뜀 ③ 문서_2026-11-08.zip 만들고 다시 열어 namelist · testzip 확인 ④ dest.glob(\"문서_????-??-??.zip\") 으로 최근 n개만(미리 보기 먼저) ⑤ backup(src, dest, today, keep=7, dry_run=False) + main(argv, today=date(2026, 11, 8)) · 끝 코드(에러 안내는 stderr) · 요약. JB4 가 이 백업을 짧게 다시 씀.", pages: [], summary: [] },
{ id: 'J4', ch: 2, n: 4, title: 'PDF 읽기 · 글자 꺼내기', mode: 'text',
  tutorSummary: "pypdf 로 PDF 읽기. r = PdfReader(path) · len(r.pages) · r.pages[0](0부터) · page.extract_text()(쪽 글자 str, 줄은 \\n) · r.metadata.title · .author(reportlab 기본값 untitled · anonymous, 없으면 None). 옛 PyPDF2 블로그 코드: PdfFileReader → PdfReader, numPages → len(r.pages), getPage(0) → pages[0], extractText → extract_text, getDocumentInfo → metadata, isEncrypted → is_encrypted, PdfFileMerger · PdfMerger → PdfWriter().append, addPage → add_page, rotateClockwise → rotate, mergePage → merge_page, addBookmark → add_outline_item (옛 이름은 ImportError · AttributeError). PDF 는 좌표에 글자를 그릴 뿐이라 빈칸 · 줄 · 순서를 pypdf 가 짐작 → 버전 · 프로그램마다 다름 → \" \".join(text.split()) 로 고른 뒤 정규식(L20B)으로 이름표 다음 값만: 거래처:\\s*(\\w+) · 청구\\s*번호:\\s*(INV-\\d{4}-\\d{4}) · 청구일:\\s*(\\d{4}-\\d{2}-\\d{2}) · 합계\\s*금액:\\s*([0-9,]+)\\s*원 → parse_invoice(text) 가 {거래처, 번호, 날짜(date.fromisoformat), 금액(int(s.replace(\",\", \"\")))} 또는 None. 줄 번호로 꺼내지 않기. 스캔본은 extract_text() 가 에러 없이 \"\" → if not text.strip(), OCR(Tesseract · ocrmypdf)은 이름만. 암호 PDF: PdfReader 는 열리지만 쪽을 읽으면 FileNotDecryptedError → r.is_encrypted → r.decrypt(pw)(틀려도 에러 없이 0, 맞으면 1 · 2) → open_pdf(path, password) 가 못 풀면 None. AES 는 cryptography 필요(DependencyError). 권한 암호만 있으면 그냥 읽힘. 폴더째: read_invoices(folder, password) → (날짜 순 rows, 못 읽은 (이름, 까닭)) → csv.DictWriter + utf-8-sig + newline=\"\"(L29). 엑셀은 files 코스 F8, 표 꺼내기 pdfplumber 는 이름만.",
  terms: { "스캔본": "종이를 스캐너로 찍어 만든 PDF. 쪽마다 사진 한 장이라 꺼낼 글자가 없어요", "OCR": "사진 속 글자를 읽어 진짜 글자로 바꾸는 일(광학 문자 인식). Tesseract · ocrmypdf 같은 프로그램이 해요" },
  pages: [
    { title: "PdfReader(p) · len(r.pages) · r.pages[0]", html: `<p>챕터 1 에서는 파일을 <b>통째로</b> 다뤘어요. 이름을 바꾸고, 복사하고, zip 으로 묶었죠([[레슨:JB1]]). 챕터 2 는 파일 <b>안</b>을 열어요. 첫 재료는 PDF 예요.</p>
<p>매달 거래처에서 청구서 PDF 가 와요. 하나씩 열어 거래처 · 번호 · 금액을 옮겨 적는 일을 파이썬에게 맡겨 봐요. 이번 레슨은 PDF 를 <b>읽는</b> 쪽(글자 꺼내기)이고, [[레슨:J5]] 는 <b>고쳐 쓰는</b> 쪽(합치기 · 나누기)이에요. 둘 다 시작하기에서 깐 <code>pypdf</code> 를 써요.</p>
<p>연습 재료는 <code>make_invoices(폴더)</code> 가 만드는 청구서 6개예요. 모두 2쪽짜리예요(1쪽 청구 내용, 2쪽 입금 계좌 · 문의).</p>
<table class="kb"><tbody><tr><th>파일</th><th>모양</th></tr><tr><td><code>청구서_햇살문구.pdf</code> · <code>바다인쇄</code> · <code>숲속목재</code> · <code>별빛흙방</code></td><td>보통 PDF — 글자가 그대로 꺼내져요</td></tr><tr><td><code>청구서_한빛택배.pdf</code></td><td>스캔본 흉내 — 1쪽에 글자가 없어요</td></tr><tr><td><code>청구서_달빛가죽.pdf</code></td><td>암호 <code>1234</code> 가 걸려 있어요</td></tr></tbody></table>
<pre>from pypdf import PdfReader

r = PdfReader("청구서_햇살문구.pdf")
print(len(r.pages))        # 2
page = r.pages[0]          # 첫 쪽은 0번 — 사람이 말하는 「1쪽」
print(r.metadata.title)    # untitled</pre>
<ul><li><code>r.pages</code> — 쪽들. 리스트처럼 <code>len(r.pages)</code> · <code>r.pages[0]</code> · <code>for page in r.pages</code> 가 돼요</li><li><code>r.metadata</code> — 문서 정보 <code>.title</code>(제목) · <code>.author</code>(만든 사람). 연습 재료는 reportlab 기본값 <code>untitled</code> · <code>anonymous</code> 예요. 정보가 없으면 <code>None</code></li></ul>
<div class="bk-warn"><b>블로그 코드는 옛 이름일 때가 많아요</b> — 검색하면 <code>PyPDF2</code> 의 <code>PdfFileReader</code> · <code>PdfMerger</code> 가 많이 나와요. PyPDF2 는 <code>pypdf</code> 로 이름을 바꿔 이어 만들고, 옛것은 더 고치지 않아요. <code>pip install PyPDF2</code> 하지 말고 아래 표로 새 이름을 찾아요.</div>
<table class="kb"><tbody><tr><th>옛 코드(PyPDF2)</th><th>지금(pypdf)</th></tr><tr><td><code>import PyPDF2</code></td><td><code>from pypdf import PdfReader, PdfWriter</code></td></tr><tr><td><code>PdfFileReader(open(p, "rb"))</code></td><td><code>PdfReader(p)</code> — 경로를 그대로</td></tr><tr><td><code>r.numPages</code> · <code>r.getNumPages()</code></td><td><code>len(r.pages)</code></td></tr><tr><td><code>r.getPage(0)</code></td><td><code>r.pages[0]</code></td></tr><tr><td><code>page.extractText()</code></td><td><code>page.extract_text()</code></td></tr><tr><td><code>r.getDocumentInfo()</code> · <code>r.documentInfo</code></td><td><code>r.metadata</code></td></tr><tr><td><code>r.isEncrypted</code></td><td><code>r.is_encrypted</code></td></tr><tr><td><code>PdfFileWriter()</code> · <code>w.addPage(page)</code></td><td><code>PdfWriter()</code> · <code>w.add_page(page)</code></td></tr><tr><td><code>PdfFileMerger()</code> · <code>PdfMerger()</code> 의 <code>append</code></td><td><code>PdfWriter()</code> 의 <code>w.append(p)</code> — 합치는 전용 클래스는 없어졌어요</td></tr><tr><td><code>page.rotateClockwise(90)</code> · <code>page.mergePage(stamp)</code> · <code>w.addBookmark(…)</code></td><td><code>page.rotate(90)</code> · <code>page.merge_page(stamp)</code> · <code>w.add_outline_item(…)</code></td></tr></tbody></table>
<p>옛 이름을 그대로 쓰면 <code>ImportError: cannot import name 'PdfFileReader' from 'pypdf'</code> 나 <code>AttributeError: 'PdfReader' object has no attribute 'getPage'</code> 로 멈춰요. 뒤쪽 세 줄([[레슨:J5]] 에서 배울 것)은 미리 보기만 해 두세요.</p>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader
from samples import make_invoices

with tempfile.TemporaryDirectory() as tmp:
    paths = make_invoices(tmp)
    print(len(paths), "개")
    for p in paths:
        print(" ", p.name)

    r = PdfReader(Path(tmp) / "청구서_햇살문구.pdf")
    print("쪽 수:", len(r.pages))
    page = r.pages[0]                 # 첫 쪽은 0번
    print(type(page).__name__)
    print("제목:", r.metadata.title)
    print("만든 사람:", r.metadata.author)

    try:
        r.getPage(0)                  # 블로그에서 본 옛 이름
    except AttributeError as e:
        print("AttributeError:", e)`, prep: [SAMPLES_PREP] } },
    { title: "page.extract_text() · \" \".join(t.split())", html: `<p><code>page.extract_text()</code> 는 그 쪽의 글자를 <b>글자(str) 하나</b>로 돌려줘요. 줄은 <code>\\n</code> 으로 이어져 있어요. 문서 전체는 <code>for page in r.pages</code> 로 쪽마다 꺼내요.</p>
<p>그런데 PDF 에는 「문단」 이나 「줄」 이 없어요. 「이 글자를 이 자리(좌표)에 그려라」 만 들어 있어서, 낱말 사이 빈칸과 줄바꿈은 pypdf 가 자리를 보고 <b>짐작</b>해요. 그래서 다른 프로그램이 만든 PDF 에서는 이런 일이 흔해요.</p>
<ul><li>빈칸이 둘 셋으로 늘거나, 낱말 가운데에 줄바꿈이 들어가요</li><li>표나 두 단 글은 칸 순서가 섞여 나와요</li><li>같은 파일도 pypdf 버전마다 빈칸이 조금씩 달라요</li></ul>
<p>그래서 꺼내자마자 <b>빈칸을 고르게</b> 해 둬요. <code>split()</code> 은 빈칸 · 줄바꿈 · 탭을 모두 「사이」 로 보고 자르니까, 다시 <code>" ".join</code> 하면 빈칸 하나로 이어진 한 줄이 돼요.</p>
<pre>messy = "합계   금액:\\n  56,500 원 "
print(messy.split())   # ['합계', '금액:', '56,500', '원']
clean = " ".join(messy.split())
print(clean)           # 합계 금액: 56,500 원</pre>
<p><b>글자가 없는 PDF.</b> 종이를 스캐너로 찍은 [[스캔본]]은 쪽마다 사진 한 장이에요. 사람 눈에는 글자가 보여도 PDF 안에는 글자가 없어서, <code>extract_text()</code> 가 <b>에러 없이 빈 글자</b> <code>""</code> 를 돌려줘요. 조용히 지나가니 직접 검사해요: <code>if not text.strip():</code>.</p>
<p>사진 속 글자를 읽어 내는 일은 [[OCR]] 이 해요(Tesseract · ocrmypdf 같은 프로그램, Acrobat 의 「스캔 및 OCR」). 이 교과서에서는 OCR 을 하지 않고, 스캔본은 「못 읽음」 목록에 넣어 사람이 보게 해요.</p>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader
from samples import make_invoices

with tempfile.TemporaryDirectory() as tmp:
    make_invoices(tmp)

    r = PdfReader(Path(tmp) / "청구서_햇살문구.pdf")
    text = r.pages[0].extract_text()
    clean = " ".join(text.split())
    print(clean)

    # 스캔본: 첫 쪽에 글자가 없어요
    r = PdfReader(Path(tmp) / "청구서_한빛택배.pdf")
    for i, page in enumerate(r.pages, 1):
        text = page.extract_text()
        if not text.strip():
            print(i, "쪽: 글자 없음 — 스캔본?")
        else:
            clean = " ".join(text.split())
            print(i, "쪽:", clean)

# 다른 프로그램이 만든 PDF 에서 흔한 모양: 빈칸 여럿 · 엉뚱한 줄바꿈
messy = "청구 번호:\\n  INV-2026-1004\\n\\n합계   금액:  56,500 원 "
print(repr(messy))
clean = " ".join(messy.split())
print(repr(clean))`, prep: [SAMPLES_PREP] } },
    { title: "re.search(…).group(1) → int · date", html: `<p>고른 글자에서 필요한 값만 정규식으로 꺼내요(복습: <a href="../python/#lesson/L20B" target="_blank" rel="noopener">파이썬 교과서 「정규식 2: 찾아 꺼내기 · 줄 처음과 끝」 ↗</a>). 값마다 「이름표 + 괄호」 패턴을 하나씩 두고 <code>re.search(…).group(1)</code> 로 괄호 안만 가져와요.</p>
<table class="kb"><tbody><tr><th>값</th><th>패턴</th><th>찾는 모양</th></tr><tr><td>거래처</td><td><code>거래처:\\s*(\\w+)</code></td><td>콜론 뒤 낱말 하나</td></tr><tr><td>번호</td><td><code>청구\\s*번호:\\s*(INV-\\d{4}-\\d{4})</code></td><td><code>INV-2026-1001</code></td></tr><tr><td>날짜</td><td><code>청구일:\\s*(\\d{4}-\\d{2}-\\d{2})</code></td><td><code>2026-10-05</code></td></tr><tr><td>금액</td><td><code>합계\\s*금액:\\s*([0-9,]+)\\s*원</code></td><td><code>125,000</code>(쉼표 포함)</td></tr></tbody></table>
<p><code>\\s*</code> 는 「빈칸이 없거나 여럿」 이에요. 앞 쪽에서 본 흐트러진 빈칸에도, <code>청구번호</code> 처럼 붙어 나온 글자에도 맞아요.</p>
<pre>import re
from datetime import date

PATTERNS = {
    "거래처": r"거래처:\\s*(\\w+)",
    "번호": r"청구\\s*번호:\\s*(INV-\\d{4}-\\d{4})",
    "날짜": r"청구일:\\s*(\\d{4}-\\d{2}-\\d{2})",
    "금액": r"합계\\s*금액:\\s*([0-9,]+)\\s*원",
}


def parse_invoice(text):
    """청구서 첫 쪽 글자 → 거래처 · 번호 · 날짜(date) · 금액(int) 딕셔너리. 하나라도 없으면 None"""
    text = " ".join(text.split())
    info = {}
    for key, pattern in PATTERNS.items():
        m = re.search(pattern, text)
        if m is None:
            return None
        info[key] = m.group(1)
    info["날짜"] = date.fromisoformat(info["날짜"])
    info["금액"] = int(info["금액"].replace(",", ""))
    return info


info = parse_invoice("거래처: 햇살문구\\n청구 번호: INV-2026-1001\\n청구일: 2026-10-05\\n합계 금액: 125,000원")
print(info["거래처"])    # 햇살문구
print(info["금액"])      # 125000
print(info["날짜"])      # 2026-10-05
print(parse_invoice(""))    # None</pre>
<ul><li>꺼낸 값은 모두 <b>글자</b>예요. 금액은 쉼표를 빼고 <code>int(s.replace(",", ""))</code>, 날짜는 <code>date.fromisoformat(s)</code>(복습: <a href="../python/#lesson/L19" target="_blank" rel="noopener">파이썬 교과서 「날짜 2: 글자 ↔ 날짜 · 비교」 ↗</a>)로 바꿔야 더하고 비교할 수 있어요</li><li>하나라도 못 찾으면 <code>None</code> 을 돌려줘요. <code>m.group(1)</code> 을 바로 하면 <code>AttributeError: 'NoneType' object has no attribute 'group'</code> 로 멈추니까 <code>m is None</code> 을 먼저 봐요</li></ul>
<div class="bk-warn"><b>줄 번호로 꺼내지 마세요</b> — <code>text.splitlines()[3]</code> 처럼 「넷째 줄이 날짜」 라고 정하면, 줄 순서가 섞여 나온 PDF 에서 엉뚱한 값을 조용히 가져와요. 이름표(<code>청구일:</code>)로 찾으면 순서가 바뀌어도 맞아요.</div>`,
      example: { code: `import re
import tempfile
from datetime import date
from pathlib import Path
from pypdf import PdfReader
from samples import make_invoices

PATTERNS = {
    "거래처": r"거래처:\\s*(\\w+)",
    "번호": r"청구\\s*번호:\\s*(INV-\\d{4}-\\d{4})",
    "날짜": r"청구일:\\s*(\\d{4}-\\d{2}-\\d{2})",
    "금액": r"합계\\s*금액:\\s*([0-9,]+)\\s*원",
}


def parse_invoice(text):
    """청구서 첫 쪽 글자 → 거래처 · 번호 · 날짜(date) · 금액(int) 딕셔너리. 하나라도 없으면 None"""
    text = " ".join(text.split())
    info = {}
    for key, pattern in PATTERNS.items():
        m = re.search(pattern, text)
        if m is None:
            return None
        info[key] = m.group(1)
    info["날짜"] = date.fromisoformat(info["날짜"])
    info["금액"] = int(info["금액"].replace(",", ""))
    return info


with tempfile.TemporaryDirectory() as tmp:
    make_invoices(tmp)
    r = PdfReader(Path(tmp) / "청구서_숲속목재.pdf")
    info = parse_invoice(r.pages[0].extract_text())
    print(info)
    print(info["거래처"], info["날짜"].month, "월", f"{info['금액']:,}원")

    r = PdfReader(Path(tmp) / "청구서_한빛택배.pdf")
    info = parse_invoice(r.pages[0].extract_text())
    print(info)

# 줄 순서가 바뀌고 빈칸이 흐트러져도 이름표로 찾아요
messy = "합계   금액:\\n 56,500 원\\n청구일: 2026-10-15\\n거래처:  한빛택배\\n청구번호: INV-2026-1004"
print(parse_invoice(messy))`, prep: [SAMPLES_PREP] } },
    { title: "r.is_encrypted · r.decrypt(\"1234\")", html: `<p>암호가 걸린 PDF 도 <code>PdfReader(path)</code> 까지는 열려요. 쪽을 읽으려는 순간 멈춰요.</p>
<pre>r = PdfReader("청구서_달빛가죽.pdf")
print(r.is_encrypted)   # True
len(r.pages)            # FileNotDecryptedError: File has not been decrypted</pre>
<p>그래서 순서가 정해져 있어요: <code>r.is_encrypted</code> 로 보고 → <code>r.decrypt(암호)</code> 로 푼 다음 → 읽기.</p>
<ul><li><code>decrypt</code> 는 틀려도 <b>에러가 나지 않아요</b>. 맞으면 참인 값(1 · 2), 틀리면 거짓인 값(0)을 돌려줘요. 그래서 <code>if not r.decrypt(pw):</code> 로 「틀렸다」 를 알아요</li><li>암호는 코드에 적지 말고 <b>인자</b>로 받아요. 프로그램이 실행될 때 사람에게 묻는 건 [[레슨:JB2]] 에서 해요</li><li>인쇄 · 복사만 막은 PDF(「열기 암호」 없이 「권한 암호」 만)는 <code>is_encrypted</code> 가 <code>True</code> 여도 그냥 읽혀요. pypdf 가 빈 암호로 먼저 풀어 보거든요</li><li>요즘 PDF 암호(AES)를 풀려면 <code>cryptography</code> 패키지가 있어야 해요. 없으면 <code>DependencyError: cryptography&gt;=3.1 is required for AES algorithm</code> — 시작하기의 패키지 넷을 다시 깔아요</li></ul>
<p>여는 일을 함수 하나로 묶어 두면 폴더를 돌 때 편해요. 못 열면 <code>None</code> 이에요.</p>
<pre>def open_pdf(path, password=""):
    """PDF 를 열고, 암호가 걸렸으면 풀어요. 못 풀면 None"""
    r = PdfReader(path)
    if r.is_encrypted and not r.decrypt(password):
        return None
    return r</pre>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader
from pypdf.errors import FileNotDecryptedError
from samples import make_invoices


def open_pdf(path, password=""):
    """PDF 를 열고, 암호가 걸렸으면 풀어요. 못 풀면 None"""
    r = PdfReader(path)
    if r.is_encrypted and not r.decrypt(password):
        return None
    return r


with tempfile.TemporaryDirectory() as tmp:
    make_invoices(tmp)
    path = Path(tmp) / "청구서_달빛가죽.pdf"

    r = PdfReader(path)
    print("암호:", r.is_encrypted)
    try:
        print(len(r.pages))
    except FileNotDecryptedError as e:
        print("FileNotDecryptedError:", e)

    ok = r.decrypt("0000")
    print("0000 →", bool(ok))
    ok = r.decrypt("1234")
    print("1234 →", bool(ok))
    print("쪽 수:", len(r.pages))
    clean = " ".join(r.pages[0].extract_text().split())
    print(clean)

    for p in sorted(Path(tmp).glob("*.pdf")):
        r = open_pdf(p, "1234")
        if r is None:
            print(p.name, "→ 못 엶")
        else:
            print(p.name, "→", len(r.pages), "쪽")
    print(open_pdf(path, "0000"))`, prep: [SAMPLES_PREP] } },
    { title: "폴더의 PDF 들 → 청구서.csv · 못 읽은 목록", html: `<p>이제 앞 쪽의 두 함수 <code>parse_invoice</code> · <code>open_pdf</code> 를 합쳐 <b>폴더째</b> 읽어요. 읽은 청구서는 날짜 순으로 줄 세우고(복습: <a href="../python/#lesson/L12C" target="_blank" rel="noopener">파이썬 교과서 「정렬과 복사」 ↗</a>), 못 읽은 파일은 <b>까닭과 함께 따로</b> 모아요.</p>
<pre>def read_invoices(folder, password=""):
    """폴더의 청구서 PDF 를 모두 읽어 (읽은 것들, 못 읽은 것들)"""
    rows, failed = [], []
    for p in sorted(Path(folder).glob("*.pdf")):
        r = open_pdf(p, password)
        if r is None:
            failed.append((p.name, "암호가 맞지 않아요"))
            continue
        info = parse_invoice(r.pages[0].extract_text())
        if info is None:
            failed.append((p.name, "글자를 못 찾았어요(스캔본?)"))
            continue
        info["파일"] = p.name
        rows.append(info)
    rows.sort(key=lambda x: x["날짜"])
    return rows, failed</pre>
<p>못 읽은 파일을 조용히 건너뛰면 안 돼요. 합계가 모자란데 아무도 몰라요. 「못 읽은 파일: 2개」 를 꼭 찍어서 사람이 직접 열어 보게 해요.</p>
<p>모은 값은 csv 로 저장해요(복습: <a href="../python/#lesson/L29" target="_blank" rel="noopener">파이썬 교과서 「csv 모듈 제대로」 ↗</a>). 엑셀에서 바로 열 거라서 <code>encoding="utf-8-sig"</code>, 줄 사이 빈 줄이 안 생기게 <code>newline=""</code> 이에요. <code>DictWriter</code> 는 딕셔너리를 <code>fieldnames</code> 순서대로 써 주고, <code>date</code> 는 <code>2026-10-05</code> 글자로 들어가요.</p>
<pre>with open("청구서_10월.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["날짜", "거래처", "번호", "금액", "파일"])
    w.writeheader()
    w.writerows(rows)</pre>
<ul><li>예제는 암호를 주지 않고 돌려요. 그래서 달빛가죽이 「못 읽음」 에 들어가요. <code>read_invoices(폴더, "1234")</code> 로 바꿔 돌려 보세요</li><li>엑셀 파일(.xlsx)로 바로 쓰고 싶으면 <a href="../files/#lesson/F8" target="_blank" rel="noopener">데이터 파일 다루기 교과서 「새로 만들어 쓰기」 ↗</a> 를 보세요. 이 교과서는 csv 까지만 해요</li><li>PDF 속 <b>표</b>를 칸대로 꺼내야 하면 <code>pdfplumber</code> 라는 패키지가 있어요(이름만 알아 두세요). <code>extract_text()</code> 는 표도 한 줄 글자로 줘요</li></ul>`,
      example: { code: `import csv
import re
import tempfile
from datetime import date
from pathlib import Path
from pypdf import PdfReader
from samples import make_invoices

PATTERNS = {
    "거래처": r"거래처:\\s*(\\w+)",
    "번호": r"청구\\s*번호:\\s*(INV-\\d{4}-\\d{4})",
    "날짜": r"청구일:\\s*(\\d{4}-\\d{2}-\\d{2})",
    "금액": r"합계\\s*금액:\\s*([0-9,]+)\\s*원",
}


def parse_invoice(text):
    text = " ".join(text.split())
    info = {}
    for key, pattern in PATTERNS.items():
        m = re.search(pattern, text)
        if m is None:
            return None
        info[key] = m.group(1)
    info["날짜"] = date.fromisoformat(info["날짜"])
    info["금액"] = int(info["금액"].replace(",", ""))
    return info


def open_pdf(path, password=""):
    r = PdfReader(path)
    if r.is_encrypted and not r.decrypt(password):
        return None
    return r


def read_invoices(folder, password=""):
    """폴더의 청구서 PDF 를 모두 읽어 (읽은 것들, 못 읽은 것들)"""
    rows, failed = [], []
    for p in sorted(Path(folder).glob("*.pdf")):
        r = open_pdf(p, password)
        if r is None:
            failed.append((p.name, "암호가 맞지 않아요"))
            continue
        info = parse_invoice(r.pages[0].extract_text())
        if info is None:
            failed.append((p.name, "글자를 못 찾았어요(스캔본?)"))
            continue
        info["파일"] = p.name
        rows.append(info)
    rows.sort(key=lambda x: x["날짜"])
    return rows, failed


with tempfile.TemporaryDirectory() as tmp:
    make_invoices(Path(tmp) / "청구서")
    rows, failed = read_invoices(Path(tmp) / "청구서")   # 암호를 안 줌

    out = Path(tmp) / "청구서_10월.csv"
    with open(out, "w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["날짜", "거래처", "번호", "금액", "파일"])
        w.writeheader()
        w.writerows(rows)

    with open(out, encoding="utf-8-sig", newline="") as f:
        for row in csv.reader(f):
            print(row)
    total = sum(x["금액"] for x in rows)
    print(f"{len(rows)}건 합계 {total:,}원")
    print("못 읽은 파일:")
    for name, why in failed:
        print(" ", name, "—", why)`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["PdfReader(path) 로 열어 len(r.pages) · r.pages[0](0부터) · page.extract_text() · r.metadata.title — 블로그의 PdfFileReader · getPage · PdfMerger 는 옛 PyPDF2 이름이라 표에서 새 이름으로 바꿔요", "꺼낸 글자는 빈칸 · 줄 · 순서가 흐트러질 수 있어 \" \".join(text.split()) 로 고르고, 정규식 이름표로 값만 꺼내 금액은 int(s.replace(\",\", \"\")) · 날짜는 date.fromisoformat 으로 바꿔요", "스캔본은 에러 없이 빈 글자, 암호 PDF 는 r.is_encrypted → r.decrypt(pw)(틀리면 0) — 못 읽은 파일은 까닭과 함께 따로 모으고, 읽은 값은 utf-8-sig csv 로 저장해요"] },
{ id: 'J5', ch: 2, n: 5, title: 'PDF 합치기 · 나누기 · 고치기', mode: 'text',
  tutorSummary: "pypdf 로 PDF 쓰기 · 고치기. w = PdfWriter() → w.append(p)(통째로) · w.append(p, pages=(0, 2))(range 처럼 0 · 1) · pages=[3, 2](그 번호 그 순서) · w.add_page(r.pages[i]) → w.write(새 경로)(원본 덮어쓰기 금지). 옛 PdfMerger 는 없음. 암호 파일은 푼 PdfReader 를 append. 합친 파일엔 원래 제목이 안 따라옴. 확인은 늘 다시 열어 쪽 수 · first_words(path)(쪽마다 첫 낱말) · rotation · 책갈피 · is_encrypted · metadata.title. merge_pdfs(paths, out). 사람의 쪽 범위 parse_pages(\"1-3,5\", n) → [0, 1, 2, 4]: 쉼표로 나눠 strip, - 면 범위 아니면 한 쪽, range(start, end + 1), k - 1 은 한 곳에서만, 0 · 없는 쪽 · 거꾸로는 ValueError(int() 실패도 ValueError). 고르기 pages=parse_pages(…), 빼기 keep = [i for i in range(n) if i not in drop], 순서 바꾸기 add_page 반복. 나누기 split_pdf: 쪽마다 새 PdfWriter, 이름 f\"{stem}_p{i:02}.pdf\"(enumerate(…, 1), 두 자리라 이름 순 = 쪽 순). 회전 w.pages[i].rotate(90): 시계 방향 · 90 배수(아니면 ValueError) · 더해짐 · page.rotation 으로 확인. 책갈피 w.add_outline_item(이름, 쪽 0부터) — 합칠 때 start = len(w.pages), 확인 r.outline · o.title · r.get_destination_page_number(o), parent= 로 안쪽. merge_with_bookmarks(items, out, title=None). 메타데이터 w.add_metadata({\"/Title\": …}) → r.metadata.title. 암호 w.encrypt(pw, algorithm=\"AES-256\")(빼면 옛 RC4), PdfWriter(clone_from=path), 암호 PDF 는 소금값 때문에 바이트가 매번 달라 비교 금지. 도장: reportlab canvas.Canvas(str(path), invariant=1) · registerFont(UnicodeCIDFont(\"HYGothic-Medium\")) · setFont · setFillColorRGB · drawString(x, y, 글자)(왼쪽 아래 (0,0), pt, A4 595×842) · showPage · save → page.merge_page(stamp)(over=False 면 밑에) → \"입금 완료\" in text 로 확인. 겉모양은 Edge · Acrobat 으로(아시아 글꼴 팩).",
  terms: { "책갈피": "PDF 보기 왼쪽 창에 뜨는 목차. 누르면 그 쪽으로 가요 — pypdf 에서는 outline", "메타데이터": "문서 안에 든 문서 정보(제목 · 만든 사람 · 만든 프로그램). 본문에는 안 보이고 파일 속성 · 탭 제목에 보여요" },
  pages: [
    { title: "PdfWriter() · w.append(p) · w.write(out)", html: `<p>읽기는 <code>PdfReader</code>, 쓰기는 <code>PdfWriter</code> 예요. 빈 PDF(<code>w = PdfWriter()</code>)를 하나 만들고, 쪽을 붙인 다음, <code>w.write(새 경로)</code> 로 저장해요. 합치는 전용 클래스였던 옛 <code>PdfMerger</code> 는 없어졌어요([[레슨:J4]] 의 옛 이름 표).</p>
<table class="kb"><tbody><tr><th>코드</th><th>붙는 쪽</th></tr><tr><td><code>w.append(p)</code></td><td>파일 통째로 — 맨 뒤에 이어 붙어요</td></tr><tr><td><code>w.append(p, pages=(0, 2))</code></td><td><code>range(0, 2)</code> 처럼 0 · 1번(2 앞까지)</td></tr><tr><td><code>w.append(p, pages=[3, 2])</code></td><td>리스트는 그 번호 그대로, 그 순서로</td></tr><tr><td><code>w.add_page(page)</code></td><td>쪽 하나(<code>r.pages[i]</code>)</td></tr></tbody></table>
<pre>from pypdf import PdfReader, PdfWriter

w = PdfWriter()
w.append("안내문.pdf")
w.append("신청서.pdf")
w.write("합본.pdf")</pre>
<p><b>확인은 늘 다시 열어서</b> 해요. 쓴 파일을 <code>PdfReader</code> 로 다시 열어 쪽 수와 쪽마다 첫 낱말을 찍으면, 순서가 맞는지 눈으로 볼 수 있어요. 예제의 <code>first_words(path)</code> 가 그 일을 해요. 이 레슨 내내 써요.</p>
<ul><li>암호 걸린 파일은 경로 대신 <b>푼 PdfReader</b> 를 넣어요: <code>r = PdfReader(p)</code> → <code>r.decrypt("1234")</code> → <code>w.append(r)</code></li><li>합친 새 파일에는 원래 파일의 제목(메타데이터)이 따라오지 않아요. 제목 달기는 이 레슨 넷째 쪽에서 해요</li></ul>
<div class="bk-warn"><b>원본과 같은 이름으로 쓰지 마세요</b> — <code>w.write(p)</code> 는 묻지 않고 덮어써요. 원본은 읽기만, 결과는 새 이름 · 새 폴더에([[레슨:J0]] 의 안전 원칙).</div>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from samples import make_pdf


def first_words(path):
    """다시 열어서 쪽마다 첫 낱말 — 빈 쪽은 (빈 쪽)"""
    words = []
    for page in PdfReader(path).pages:
        parts = page.extract_text().split()
        if parts:
            words.append(parts[0])
        else:
            words.append("(빈 쪽)")
    return words


def merge_pdfs(paths, out):
    """paths 의 PDF 를 차례대로 이어 붙여 out 하나로"""
    w = PdfWriter()
    for p in paths:
        w.append(p)
    w.write(out)
    return out


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    guide = make_pdf(base / "안내문.pdf", ["표지 11월 수업 안내", "가죽 공예 매주 화요일", "목공 기초 매주 목요일", "도자기 매주 토요일"])
    form = make_pdf(base / "신청서.pdf", ["신청서 이름 연락처 수업"])
    print(first_words(guide), first_words(form))

    out = merge_pdfs([guide, form], base / "합본.pdf")
    r = PdfReader(out)
    print(out.name, len(r.pages), "쪽", first_words(out))

    w = PdfWriter()
    w.append(guide, pages=(0, 2))       # 0 · 1번 쪽(2 는 빼고)
    w.append(form)
    w.append(guide, pages=[3, 2])       # 리스트는 그 번호 그대로, 그 순서로
    w.write(base / "골라_합치기.pdf")
    print(first_words(base / "골라_합치기.pdf"))`, prep: [SAMPLES_PREP] } },
    { title: "\"1-3,5\" → [0, 1, 2, 4] · 고르기 · 빼기", html: `<p>사람은 「1~3쪽이랑 5쪽 주세요」 라고 해요. 인쇄 창에 적는 것처럼 글자로 쓰면 <code>"1-3,5"</code> 예요. 그런데 파이썬의 쪽 번호는 <b>0부터</b>라서 그대로 쓰면 한 쪽씩 밀려요. 바꾸는 함수를 한 번 만들어 두면 고르기 · 빼기 · 순서 바꾸기에 다 써요.</p>
<pre>def parse_pages(spec, n):
    """사람이 쓴 쪽 범위("1-3,5") → 0부터 센 번호 리스트([0, 1, 2, 4]). n 은 전체 쪽 수"""
    result = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-")
            start, end = int(a), int(b)
        else:
            start = int(part)
            end = start
        if not 1 &lt;= start &lt;= end &lt;= n:
            raise ValueError(f"쪽 범위가 잘못됐어요: {part} (1~{n}쪽)")
        for k in range(start, end + 1):
            result.append(k - 1)        # 사람은 1쪽부터, 파이썬은 0번부터
    return result


print(parse_pages("1-3,5", 5))       # [0, 1, 2, 4]
print(parse_pages(" 4 , 1-2 ", 5))   # [3, 0, 1]</pre>
<ul><li>쉼표로 나눠 조각마다 <code>strip()</code> — 사람은 빈칸을 아무 데나 넣어요</li><li><code>-</code> 가 있으면 범위, 없으면 한 쪽. 끝 쪽까지 넣으려고 <code>range(start, end + 1)</code></li><li>마지막에 <code>k - 1</code> — 여기 한 곳에서만 1을 빼요. 다른 코드는 0부터 번호만 다뤄요</li><li><code>0</code> · 없는 쪽 · 거꾸로 범위(<code>3-1</code>)는 <code>ValueError</code> 로 알려요(복습: <a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a>). 숫자가 아닌 글자(<code>1~3</code>)도 <code>int()</code> 가 <code>ValueError</code> 를 내니, 부르는 쪽은 <code>except ValueError</code> 하나로 받아요</li></ul>
<p>번호 리스트가 생기면 세 가지가 다 쉬워요.</p>
<table class="kb"><tbody><tr><th>하고 싶은 일</th><th>코드</th></tr><tr><td>고르기</td><td><code>w.append(src, pages=parse_pages("1,3-4", n))</code></td></tr><tr><td>빼기</td><td><code>keep = [i for i in range(n) if i not in drop]</code> → <code>pages=keep</code></td></tr><tr><td>순서 바꾸기</td><td><code>for i in parse_pages("5,1-4", n): w.add_page(r.pages[i])</code></td></tr></tbody></table>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from samples import make_pdf


def parse_pages(spec, n):
    """사람이 쓴 쪽 범위("1-3,5") → 0부터 센 번호 리스트([0, 1, 2, 4]). n 은 전체 쪽 수"""
    result = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-")
            start, end = int(a), int(b)
        else:
            start = int(part)
            end = start
        if not 1 <= start <= end <= n:
            raise ValueError(f"쪽 범위가 잘못됐어요: {part} (1~{n}쪽)")
        for k in range(start, end + 1):
            result.append(k - 1)        # 사람은 1쪽부터, 파이썬은 0번부터
    return result


def first_words(path):
    words = []
    for page in PdfReader(path).pages:
        parts = page.extract_text().split()
        if parts:
            words.append(parts[0])
        else:
            words.append("(빈 쪽)")
    return words


print(parse_pages("1-3,5", 5))
print(parse_pages(" 4 , 1-2 ", 5))
for bad in ["0", "6", "3-1", "1~3"]:
    try:
        parse_pages(bad, 5)
    except ValueError as e:
        print("ValueError:", e)

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = make_pdf(base / "안내문.pdf", ["표지", "가죽 공예", "목공 기초", "도자기", "캘리그라피"])
    n = len(PdfReader(src).pages)

    w = PdfWriter()
    w.append(src, pages=parse_pages("1,3-4", n))      # 고르기
    w.write(base / "고른_쪽.pdf")

    drop = parse_pages("2", n)                        # 빼기
    keep = [i for i in range(n) if i not in drop]
    w = PdfWriter()
    w.append(src, pages=keep)
    w.write(base / "뺀_쪽.pdf")

    r = PdfReader(src)                                # 순서 바꾸기 — 한 쪽씩 add_page
    w = PdfWriter()
    for i in parse_pages("5,1-4", n):
        w.add_page(r.pages[i])
    w.write(base / "바꾼_순서.pdf")

    for name in ["고른_쪽.pdf", "뺀_쪽.pdf", "바꾼_순서.pdf"]:
        print(name, first_words(base / name))`, prep: [SAMPLES_PREP] } },
    { title: "한 쪽씩 _p01.pdf · page.rotate(90)", html: `<p><b>나누기</b>는 쪽마다 새 <code>PdfWriter</code> 를 하나씩 만들어 그 쪽만 넣고 저장하면 돼요. 이름 끝에 <code>_p01</code> 처럼 쪽 번호를 붙여요.</p>
<pre>for i, page in enumerate(r.pages, 1):
    w = PdfWriter()
    w.add_page(page)
    w.write(out_dir / f"{path.stem}_p{i:02}.pdf")</pre>
<ul><li><code>enumerate(…, 1)</code> — 파일 이름은 사람이 보니까 1부터</li><li><code>f"{i:02}"</code> — 두 자리로 0 을 채워요(복습: <a href="../python/#lesson/L9C" target="_blank" rel="noopener">파이썬 교과서 「서식 출력: 칸 맞추기 · 소수 · 쉼표」 ↗</a>). <code>_p2</code> · <code>_p10</code> 이면 이름 순 정렬에서 <code>_p10</code> 이 <code>_p2</code> 앞에 와요. <code>_p02</code> · <code>_p10</code> 이면 이름 순 = 쪽 순이에요</li></ul>
<p><b>돌리기</b>는 <code>page.rotate(90)</code> 이에요. 스캔하다 옆으로 누운 쪽을 세울 때 써요.</p>
<ul><li><b>시계 방향</b>으로 돌아요. 반대로 돌리려면 <code>rotate(270)</code></li><li>90 의 배수만 돼요. <code>rotate(45)</code> 는 <code>ValueError: Rotation angle must be a multiple of 90</code></li><li>돌린 각도는 <b>더해져요</b>. <code>rotate(90)</code> 을 두 번 하면 180 이에요</li><li>돌릴 쪽은 writer 에 넣은 쪽이에요: <code>w.pages[1].rotate(90)</code>. 확인은 다시 열어 <code>page.rotation</code> 을 찍어요</li></ul>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from samples import make_pdf


def split_pdf(path, out_dir):
    """한 쪽씩 따로 저장: 안내문.pdf → 안내문_p01.pdf, 안내문_p02.pdf, …"""
    path = Path(path)
    out_dir = Path(out_dir)
    out_dir.mkdir(exist_ok=True)
    outs = []
    for i, page in enumerate(PdfReader(path).pages, 1):
        w = PdfWriter()
        w.add_page(page)
        out = out_dir / f"{path.stem}_p{i:02}.pdf"
        w.write(out)
        outs.append(out)
    return outs


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    src = make_pdf(base / "안내문.pdf", ["표지", "가죽 공예", "목공 기초", "도자기"])
    for out in split_pdf(src, base / "쪽마다"):
        r = PdfReader(out)
        print(out.name, len(r.pages), "쪽", r.pages[0].extract_text().split()[0])

    # 회전: 2쪽은 시계 방향 90도, 3쪽은 거꾸로(180도)
    w = PdfWriter()
    for page in PdfReader(src).pages:
        w.add_page(page)
    w.pages[1].rotate(90)
    w.pages[2].rotate(90)
    w.pages[2].rotate(90)               # 더해져요: 90 + 90 = 180
    try:
        w.pages[3].rotate(45)
    except ValueError as e:
        print("ValueError:", e)
    w.write(base / "돌린.pdf")

    r = PdfReader(base / "돌린.pdf")
    print([page.rotation for page in r.pages])`, prep: [SAMPLES_PREP] } },
    { title: "add_outline_item · add_metadata · encrypt", html: `<p>합친 파일을 쓰기 좋게 다듬는 세 가지예요. 모두 <code>w.write</code> <b>전에</b> 해요.</p>
<p><b>① [[책갈피]]</b> — PDF 보기 왼쪽의 「책갈피」 창에 뜨는 목록이에요. 누르면 그 쪽으로 가요. <code>w.add_outline_item("햇살문구", 0)</code> 처럼 이름과 쪽 번호(0부터)를 줘요. 합치면서 다는 게 제일 쉬워요: 붙이기 직전의 <code>len(w.pages)</code> 가 그 파일이 시작하는 쪽이에요.</p>
<pre>for src, name in items:
    start = len(w.pages)          # 이 파일이 시작하는 쪽(0부터)
    w.append(src)
    w.add_outline_item(name, start)</pre>
<p>확인: 다시 열어 <code>r.outline</code>(책갈피 리스트)을 돌며 <code>o.title</code> 과 <code>r.get_destination_page_number(o)</code>(0부터 쪽 번호)를 찍어요. 책갈피 안에 책갈피를 넣으려면 <code>add_outline_item(…, parent=위_책갈피)</code> 예요.</p>
<p><b>② [[메타데이터]]</b> — <code>w.add_metadata({"/Title": "10월 청구서 모음", "/Author": "햇살 공방"})</code>. 이름 앞에 <code>/</code> 가 붙어요. 제목은 Edge 탭 · 파일 속성에 보여요. 확인은 <code>r.metadata.title</code>.</p>
<p><b>③ 암호</b> — <code>w.encrypt("암호", algorithm="AES-256")</code> 을 맨 마지막에. <code>algorithm</code> 을 빼면 옛 방식(RC4)이라 쉽게 뚫려요. 꼭 적어요. 이미 있는 파일에 암호만 걸 때는 <code>PdfWriter(clone_from=path)</code> 로 통째로(책갈피 · 메타데이터까지) 복사해 와요.</p>
<div class="bk-warn"><b>암호 PDF 는 바이트로 비교하지 마세요</b> — 같은 파일 · 같은 암호로 두 번 만들어도 안에 넣는 무작위 값(소금값)이 달라 바이트가 매번 달라요. 확인은 다시 열어 <code>is_encrypted</code> · <code>decrypt</code> · 쪽 수 · 제목으로 해요. 그리고 암호를 잊으면 아무도 못 열어요 — 원본은 따로 두세요.</div>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from samples import make_invoices


def merge_with_bookmarks(items, out, title=None):
    """items = [(PDF, 책갈피 이름), …] 을 이어 붙이고, 파일마다 첫 쪽에 책갈피"""
    w = PdfWriter()
    for src, name in items:
        start = len(w.pages)            # 이 파일이 시작하는 쪽(0부터)
        w.append(src)
        w.add_outline_item(name, start)
    if title:
        w.add_metadata({"/Title": title})
    w.write(out)
    return out


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_invoices(base)
    items = [
        (base / "청구서_햇살문구.pdf", "햇살문구"),
        (base / "청구서_바다인쇄.pdf", "바다인쇄"),
        (base / "청구서_숲속목재.pdf", "숲속목재"),
    ]
    out = merge_with_bookmarks(items, base / "모음.pdf", title="10월 청구서 모음")

    r = PdfReader(out)
    print(len(r.pages), "쪽 · 제목:", r.metadata.title)
    for o in r.outline:
        print("책갈피", o.title, "→", r.get_destination_page_number(o) + 1, "쪽")

    # 암호 걸기: 통째로 복사해 와서(clone_from) 마지막에 encrypt
    w = PdfWriter(clone_from=out)
    w.encrypt("sun-2026", algorithm="AES-256")
    w.write(base / "모음_암호.pdf")

    r = PdfReader(base / "모음_암호.pdf")
    print("암호:", r.is_encrypted)
    ok = r.decrypt("1234")
    print("틀린 암호:", bool(ok))
    ok = r.decrypt("sun-2026")
    print("맞는 암호:", bool(ok))
    print(len(r.pages), "쪽 · 제목:", r.metadata.title)
    print([o.title for o in r.outline])`, prep: [SAMPLES_PREP] } },
    { title: "reportlab 도장 → page.merge_page(stamp)", html: `<p>「입금 완료」 도장이나 「대외비」 워터마크는 <b>글자 한 줄만 있는 PDF 한 쪽</b>을 만들어 다른 쪽 위에 겹치는 거예요. 그 한 쪽은 <code>reportlab</code> 으로 만들어요. 연습 재료 <code>samples.py</code> 의 <code>make_pdf</code> 도 이 방법으로 PDF 를 만들어요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>pdfmetrics.registerFont(UnicodeCIDFont("HYGothic-Medium"))</code></td><td>한글 글꼴 등록 — 글꼴 파일 없이 돼요(PDF 보기에 든 글꼴을 빌려 써요)</td></tr><tr><td><code>c = canvas.Canvas(str(path), invariant=1)</code></td><td>새 PDF. <code>invariant=1</code> 은 만든 날짜를 넣지 않아 늘 같은 파일</td></tr><tr><td><code>c.setFont("HYGothic-Medium", 32)</code> · <code>c.setFillColorRGB(0.85, 0.1, 0.1)</code></td><td>글꼴과 크기 · 글자 색(0~1)</td></tr><tr><td><code>c.drawString(400, 60, "입금 완료")</code></td><td>(x, y) 자리에 글자. <b>왼쪽 아래가 (0, 0)</b>, 단위는 pt(1/72 인치), A4 는 595 × 842</td></tr><tr><td><code>c.showPage()</code> · <code>c.save()</code></td><td>한 쪽 끝 · 파일로 저장</td></tr></tbody></table>
<p>도장 쪽을 <code>PdfReader</code> 로 열어 그 쪽을 꺼낸 다음, 찍을 쪽마다 <code>page.merge_page(stamp)</code> 해요. 기본은 <b>위에</b> 찍어요. <code>merge_page(stamp, over=False)</code> 면 <b>밑에</b> 깔려서 본문 글자가 워터마크를 가리지 않아요.</p>
<ul><li>찍은 뒤 확인: 다시 열어 그 쪽 글자에 <code>"입금 완료" in text</code> 가 참인지 봐요. 도장 글자도 PDF 글자라서 <code>extract_text()</code> 에 섞여 나와요</li><li>도장 쪽과 찍을 쪽의 크기가 같아야 자리가 맞아요(둘 다 A4). 쪽 크기는 <code>page.mediabox.width</code> · <code>.height</code>(pt)로 찍어 봐요</li><li>보이는 모양(색 · 위치 · 한글이 네모로 깨지지 않는지)은 Edge 나 Acrobat 으로 열어 눈으로 봐요. Acrobat 이 「아시아 글꼴 팩」 을 설치하라고 물으면 설치해요</li><li>표 · 문단이 있는 긴 문서는 reportlab 의 platypus(이름만)로 만들어요. 이 교과서의 문서는 워드로 만들어요([[레슨:J6]])</li></ul>`,
      example: { code: `import tempfile
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfgen import canvas
from samples import make_invoices


def make_stamp(path, text):
    """오른쪽 아래에 빨간 글자 하나만 있는 A4 한 쪽 — 도장으로 써요"""
    pdfmetrics.registerFont(UnicodeCIDFont("HYGothic-Medium"))   # 글꼴 파일 없이 한글
    c = canvas.Canvas(str(path), invariant=1)
    c.setFont("HYGothic-Medium", 32)
    c.setFillColorRGB(0.85, 0.1, 0.1)                            # 빨강(0~1)
    c.drawString(400, 60, text)                                  # 왼쪽 아래가 (0, 0)
    c.showPage()                                                 # 한 쪽 끝
    c.save()
    return Path(path)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_invoices(base)
    stamp_pdf = make_stamp(base / "도장.pdf", "입금 완료")
    stamp = PdfReader(stamp_pdf).pages[0]
    print("도장 쪽 크기:", round(stamp.mediabox.width), "x", round(stamp.mediabox.height))

    w = PdfWriter()
    w.append(base / "청구서_햇살문구.pdf")
    w.pages[0].merge_page(stamp)        # 첫 쪽 위에 도장 쪽을 겹쳐 찍기
    w.write(base / "청구서_햇살문구_입금완료.pdf")

    r = PdfReader(base / "청구서_햇살문구_입금완료.pdf")
    for i, page in enumerate(r.pages, 1):
        text = " ".join(page.extract_text().split())
        print(i, "쪽 도장:", "입금 완료" in text)`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["w = PdfWriter() 에 w.append(p) · w.append(p, pages=(0, 2)) · w.add_page(page) 로 쪽을 붙이고 w.write(새 이름) — 확인은 늘 다시 열어 쪽 수와 쪽마다 첫 낱말을 찍어요", "사람의 쪽 범위 \"1-3,5\" 는 parse_pages 로 0부터 번호 [0, 1, 2, 4] 로 바꿔 고르기 · 빼기 · 순서 바꾸기에 쓰고, 나누기는 쪽마다 새 PdfWriter(_p01), 회전은 rotate(90)(시계 방향 · 더해짐)", "write 전에 책갈피 add_outline_item(이름, 쪽) · 제목 add_metadata({\"/Title\": …}) · 암호 encrypt(pw, algorithm=\"AES-256\"), 도장은 reportlab 으로 만든 한 쪽을 page.merge_page(stamp) 로 겹쳐요"] },
{ id: 'J6', ch: 2, n: 6, title: "워드 문서 만들기", mode: 'text',
  tutorSummary: "python-docx(설치 python-docx, import docx)로 워드 만들기. Document() · add_heading(글, level=1)(스타일 Heading 1, level=0 은 Title) · add_paragraph(글, style=\"List Bullet\") · save(같은 이름 덮어씀, Word 가 열고 있으면 PermissionError) → Document(path) 로 다시 열어 paragraphs 의 text · style.name 찍기. 문단 = run 여럿: p.add_run(글) 의 bold · italic · underline(None = 스타일 따름) · font.size = Pt(14) · font.color.rgb = RGBColor(0xC0,0x39,0x2B). 한글 글꼴 함정: font.name 은 ascii · hAnsi 칸만 바꿔서 한글은 그대로 → r._element.rPr.rFonts.set(qn(\"w:eastAsia\"), \"맑은 고딕\"), 문서 전체는 doc.styles[\"Normal\"] 에 한 번(set_korean_font). 제목 스타일은 테마 글꼴이라 틀 문서로 시작하는 게 쉬움. 표: add_table(rows=1, cols=3) · style = \"Table Grid\"(한국어 화면 이름 「표 구분선」 을 쓰면 KeyError) · rows[0].cells · add_row().cells · cell(r, c).text · 칸에는 글자만(int 는 TypeError: 'int' object is not iterable → f\"{n:,}원\"). 쪽: add_page_break · sections[0].left_margin = Cm(2)(다시 읽으면 2.00025 → round) · header/footer.paragraphs[0].text · add_picture(겉모양 ☐). .doc · .hwp 는 zip 이 아니라 BadZipFile → 프로그램에서 docx 로 저장.",
  terms: { "run": "워드 문단 안에서 같은 서식(굵게 · 크기 · 색)이 이어지는 글자 조각. 문단 하나는 run 여러 개로 되어 있고, p.text 는 run 글자를 이어 붙인 것" },
  pages: [
    { title: "Document() · add_heading · add_paragraph", html: `<p>이번엔 워드 문서(<code>.docx</code>)를 파이썬으로 <b>만들어요</b>. 패키지 이름은 <code>python-docx</code> 고, 코드에서는 <code>from docx import Document</code> 예요(설치 이름과 import 이름이 달라요 — 시작하기 1).</p>
<p>워드 문서는 위에서 아래로 늘어선 <b>문단(paragraph)</b>의 줄이에요. 제목도 한 문단, 글머리 기호 한 줄도 한 문단이에요. 그리고 문단마다 <b>스타일</b>(제목 1 · 보통 · 글머리 기호 …)이 하나씩 붙어 있어요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>doc = Document()</code></td><td>빈 새 문서</td></tr><tr><td><code>doc.add_heading("제목", level=1)</code></td><td>제목 문단(스타일 <code>Heading 1</code>). <code>level=2</code> 는 작은 제목, <code>level=0</code> 은 문서 제목 <code>Title</code></td></tr><tr><td><code>doc.add_paragraph("글")</code></td><td>보통 문단(스타일 <code>Normal</code>)</td></tr><tr><td><code>doc.add_paragraph("글", style="List Bullet")</code></td><td>글머리 기호 문단</td></tr><tr><td><code>doc.save(path)</code></td><td>저장 — 같은 이름이 있으면 묻지 않고 덮어써요</td></tr><tr><td><code>Document(path)</code></td><td>있는 문서 열기</td></tr><tr><td><code>doc.paragraphs</code></td><td>문단 리스트. <code>p.text</code> 글자 · <code>p.style.name</code> 스타일 이름</td></tr></tbody></table>
<p>이 교과서의 습관 그대로예요. <b>저장했으면 <code>Document(path)</code> 로 다시 열어 찍어 봐요.</b> 문단 글자와 스타일 이름이 넣은 대로인지 확인되고, 겉모양(글꼴 · 간격 · 테두리)은 그다음 Word 로 열어 눈으로 봐요.</p>
<p>예제는 임시 폴더에 저장해서 끝나면 지워져요(복습: <a href="../python/#lesson/L21" target="_blank" rel="noopener">파이썬 교과서 「테스트 작성: 내 함수 검사하기」 ↗</a> 의 <code>TemporaryDirectory</code>). 만든 문서를 Word 로 열어 보고 싶으면 <code>folder = Path(tmp)</code> 를 <code>folder = Path("결과")</code> 로 바꾸고 <code>folder.mkdir(exist_ok=True)</code> 한 줄을 더해 돌려요.</p>
<div class="bk-warn"><b>Word 가 그 파일을 열고 있으면</b> — Windows 에서 <code>doc.save</code> 가 <code>PermissionError: [Errno 13] Permission denied</code> 로 멈춰요. Word 를 닫고 다시 돌려요. 엑셀과 똑같아요(<a href="../files/#lesson/F8" target="_blank" rel="noopener">데이터 파일 다루기 교과서 「새로 만들어 쓰기」 ↗</a>).</div>`,
      example: { code: `import tempfile
from pathlib import Path
from docx import Document

with tempfile.TemporaryDirectory() as tmp:
    folder = Path(tmp)          # Word 로 열어 보려면 Path("결과") 로 바꿔요
    path = folder / "11월_안내.docx"

    doc = Document()
    doc.add_heading("햇살 공방 11월 안내", level=1)
    doc.add_paragraph("11월에는 수업 넷이 새로 열려요.")
    doc.add_paragraph("가죽 공예 · 목공 기초", style="List Bullet")
    doc.add_paragraph("도자기 · 캘리그라피", style="List Bullet")
    doc.add_paragraph("신청은 공방 전화로 받아요.")
    doc.save(path)

    # 습관: 다시 열어서 확인
    again = Document(path)
    print("문단", len(again.paragraphs), "개")
    for p in again.paragraphs:
        print(f"{p.style.name:12} | {p.text}")` } },
    { title: "p.add_run() · bold · Pt(14) · RGBColor", html: `<p>한 문단 안에서 <b>일부만</b> 굵게 · 크게 · 다른 색으로 하려면 [[run]] 을 써요. run 은 「같은 서식이 이어지는 글자 조각」 이에요. 문단 하나 = run 여러 개예요.</p>
<pre>p = doc.add_paragraph("수업료는 ")
r = p.add_run("11월 7일까지")
r.bold = True
p.add_run(" 내 주세요.")</pre>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>r.bold = True</code> · <code>r.italic</code> · <code>r.underline</code></td><td>굵게 · 기울임 · 밑줄</td></tr><tr><td><code>r.font.size = Pt(14)</code></td><td>크기(포인트). <code>from docx.shared import Pt</code>. 다시 읽을 때는 <code>r.font.size.pt</code> → <code>14.0</code></td></tr><tr><td><code>r.font.color.rgb = RGBColor(0xC0, 0x39, 0x2B)</code></td><td>글자 색 — 빨강 · 초록 · 파랑(0~255). 16진수 <code>0xC0</code> 로 쓰면 Word 의 색 코드 <code>C0392B</code> 와 같아 보기 편해요</td></tr><tr><td><code>p.runs</code></td><td>문단의 run 리스트</td></tr></tbody></table>
<p><code>bold</code> 는 값이 셋이에요. <code>True</code>(굵게) · <code>False</code>(굵게 아님) · <code>None</code>(따로 정하지 않음 = 스타일을 따름). 다시 열어 찍었을 때 <code>None</code> 이면 「안 정했다」 는 뜻이에요. 크기 · 색도 안 정했으면 <code>None</code> 이에요.</p>
<p><code>add_paragraph("글")</code> 은 run 하나짜리 문단을 만들어 줘요. 문단의 글자 <code>p.text</code> 는 run 글자를 이어 붙인 것이에요. 이 「글자가 run 여러 개에 나뉘어 있다」 는 점이 [[레슨:J7]] 에서 틀을 채울 때 함정이 돼요.</p>`,
      example: { code: `import tempfile
from pathlib import Path
from docx import Document
from docx.shared import Pt, RGBColor

with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "회비.docx"
    doc = Document()
    p = doc.add_paragraph("11월 회비는 ")
    r = p.add_run("30,000원")
    r.bold = True
    r.font.size = Pt(14)
    r.font.color.rgb = RGBColor(0xC0, 0x39, 0x2B)
    p.add_run("이에요. ")
    r = p.add_run("7일까지")
    r.underline = True
    p.add_run(" 내 주세요.")
    doc.save(path)

    p = Document(path).paragraphs[0]
    print(p.text)
    print("run", len(p.runs), "개")
    for r in p.runs:
        size = r.font.size.pt if r.font.size else None
        print(repr(r.text), r.bold, r.underline, size, r.font.color.rgb)` } },
    { title: "한글 글꼴: font.name + w:eastAsia", html: `<p>글꼴을 맑은 고딕으로 바꾸려고 <code>r.font.name = "맑은 고딕"</code> 만 쓰면 — 영어 · 숫자만 맑은 고딕이 되고 <b>한글은 그대로</b>예요. 에러도 없고, 다시 읽은 <code>r.font.name</code> 도 <code>'맑은 고딕'</code> 이라 더 헷갈려요.</p>
<p>까닭은 이래요. 워드는 run 하나에 글꼴을 <b>네 칸</b>으로 나눠 적어요.</p>
<table class="kb"><tbody><tr><th>칸</th><th>쓰는 글자</th><th><code>font.name</code> 이 바꾸나</th></tr><tr><td><code>w:ascii</code></td><td>영어 · 숫자</td><td>예</td></tr><tr><td><code>w:hAnsi</code></td><td>그 밖의 유럽 글자</td><td>예</td></tr><tr><td><code>w:eastAsia</code></td><td><b>한글</b> · 한자 · 일본 글자</td><td><b>아니요</b></td></tr><tr><td><code>w:cs</code></td><td>아랍 글자 등</td><td>아니요</td></tr></tbody></table>
<p>그래서 한글 칸은 직접 적어요. python-docx 에 이 칸을 바꾸는 기능이 따로 없어서, 문서 속 XML 에 바로 써요. <code>_element</code> 처럼 밑줄로 시작하는 이름은 「속 부품」 이라는 뜻인데, 이 한 줄은 다들 쓰는 방법이에요.</p>
<pre>from docx.oxml.ns import qn

r.font.name = "맑은 고딕"                                  # 영어 칸 (글꼴 칸 rFonts 도 만들어 줌)
r._element.rPr.rFonts.set(qn("w:eastAsia"), "맑은 고딕")   # 한글 칸</pre>
<p>순서가 중요해요. <code>font.name</code> 을 먼저 써야 <code>rFonts</code> 가 생겨요. run 마다 이렇게 하면 끝이 없으니, 보통은 <b>문서 전체에 한 번</b> — 모든 문단이 따르는 기본 스타일 <code>doc.styles["Normal"]</code> 에 적어요(스타일은 <code>.element</code> 로 속을 봐요).</p>
<pre>def set_korean_font(doc, name="맑은 고딕", size=11):
    normal = doc.styles["Normal"]
    normal.font.name = name
    normal.font.size = Pt(size)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), name)</pre>
<div class="bk-warn"><b>글꼴은 눈으로 확인</b> — 다시 열어 찍을 수 있는 건 「적어 둔 글꼴 이름」 까지예요. 정말 그 글꼴로 보이는지는 Word 에서 한글을 골라 글꼴 칸을 봐요. 그 PC 에 없는 글꼴이면 다른 글꼴로 바뀌어 보여요. 그리고 제목(<code>Heading 1</code> …) 스타일은 테마 글꼴을 따로 써서 Normal 을 바꿔도 제목의 한글은 그대로일 수 있어요. 겉모양을 많이 맞춰야 하면 Word 에서 꾸며 둔 빈 문서를 <code>Document("틀.docx")</code> 로 열어 시작하는 게 훨씬 쉬워요.</div>`,
      example: { code: `import tempfile
from pathlib import Path
from docx import Document
from docx.oxml.ns import qn
from docx.shared import Pt


def fonts_of(rpr):
    """글자 서식(rPr)의 네 글꼴 칸 가운데 적혀 있는 것만"""
    found = {}
    if rpr is None or rpr.rFonts is None:
        return found
    for key in ["ascii", "hAnsi", "eastAsia", "cs"]:
        value = rpr.rFonts.get(qn("w:" + key))
        if value:
            found[key] = value
    return found


def set_korean_font(doc, name="맑은 고딕", size=11):
    """문서 전체(Normal 스타일)의 글꼴을 영어 · 한글 둘 다 name 으로"""
    normal = doc.styles["Normal"]
    normal.font.name = name
    normal.font.size = Pt(size)
    normal.element.rPr.rFonts.set(qn("w:eastAsia"), name)


doc = Document()
r = doc.add_paragraph().add_run("햇살 공방 Sunny Studio")
r.font.name = "맑은 고딕"
print("font.name 만:", r.font.name, fonts_of(r._element.rPr))
r._element.rPr.rFonts.set(qn("w:eastAsia"), "맑은 고딕")
print("eastAsia 까지:", fonts_of(r._element.rPr))

print("Normal 처음:", fonts_of(doc.styles["Normal"].element.rPr))
set_korean_font(doc)
with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "글꼴.docx"
    doc.save(path)
    normal = Document(path).styles["Normal"]
    print("다시 연 Normal:", fonts_of(normal.element.rPr), normal.font.size.pt)` } },
    { title: "add_table · \"Table Grid\" · add_row().cells", html: `<p>표는 <code>add_table</code> 로 만들고, 한 줄씩 더해 가요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>t = doc.add_table(rows=1, cols=3)</code></td><td>1줄 3칸 표(첫 줄을 머리줄로)</td></tr><tr><td><code>t.style = "Table Grid"</code></td><td>칸마다 테두리. 안 정하면 테두리 없는 표예요</td></tr><tr><td><code>t.rows[0].cells</code></td><td>첫 줄의 칸 리스트 → <code>cells[0].text = "이름"</code></td></tr><tr><td><code>cells = t.add_row().cells</code></td><td>맨 아래에 줄을 더하고, 그 줄의 칸들</td></tr><tr><td><code>t.cell(r, c).text</code></td><td>r 줄 c 칸(0부터)</td></tr><tr><td><code>len(t.rows)</code> · <code>len(t.columns)</code></td><td>줄 수 · 칸 수</td></tr><tr><td><code>doc.tables</code></td><td>문서 안의 표 리스트(다시 열었을 때)</td></tr></tbody></table>
<p>칸 안의 글자도 문단이에요. 머리줄을 굵게 하려면 <code>cell.paragraphs[0].runs[0].bold = True</code> 처럼 그 칸 문단의 run 을 고쳐요.</p>
<ul><li>칸에는 <b>글자만</b> 넣어요. <code>cell.text = 180000</code> 은 <code>TypeError: 'int' object is not iterable</code> 이에요. 엑셀과 달리 워드 표의 칸은 늘 글자라서, 금액은 <code>f"{fee:,}원"</code> 처럼 모양을 만들어 넣어요(복습: <a href="../python/#lesson/L9C" target="_blank" rel="noopener">파이썬 교과서 「서식 출력: 칸 맞추기 · 소수 · 쉼표」 ↗</a>)</li><li>명단을 csv 에서 읽을 때는 <code>encoding="utf-8-sig"</code> · <code>newline=""</code>(복습: <a href="../python/#lesson/L29" target="_blank" rel="noopener">파이썬 교과서 「csv 모듈 제대로」 ↗</a>)</li></ul>
<div class="bk-warn"><b>스타일 이름은 영어로</b> — 한국어 Word 화면에서는 「표 구분선」 · 「제목 1」 · 「목록 글머리 기호」 처럼 보이지만, 파이썬에서는 영어 이름 <code>"Table Grid"</code> · <code>"Heading 1"</code> · <code>"List Bullet"</code> 이에요. 화면에 보이는 한국어 이름을 쓰면 <code>KeyError: "no style with name '표 구분선'"</code> 이 나요.</div>`,
      example: { code: `import csv
import tempfile
from pathlib import Path
from docx import Document
from samples import ROSTER_CSV

with tempfile.TemporaryDirectory() as tmp:
    folder = Path(tmp)
    src = folder / "명단.csv"
    src.write_text(ROSTER_CSV, encoding="utf-8-sig")
    with open(src, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))[:4]

    doc = Document()
    doc.add_heading("10월 수료생", level=1)
    t = doc.add_table(rows=1, cols=3)
    t.style = "Table Grid"
    for cell, name in zip(t.rows[0].cells, ["이름", "수업", "수강료"]):
        cell.text = name
        cell.paragraphs[0].runs[0].bold = True
    total = 0
    for row in rows:
        fee = int(row["수강료"])
        total += fee
        cells = t.add_row().cells
        cells[0].text = row["이름"]
        cells[1].text = row["수업"]
        cells[2].text = f"{fee:,}원"      # 칸에는 글자만
    cells = t.add_row().cells
    cells[0].text = "합계"
    cells[2].text = f"{total:,}원"
    doc.save(folder / "수료생.docx")

    t = Document(folder / "수료생.docx").tables[0]
    print(t.style.name, len(t.rows), "줄", len(t.columns), "칸")
    for row in t.rows:
        print([c.text for c in row.cells])
    print("머리줄 굵게:", t.cell(0, 0).paragraphs[0].runs[0].bold)`, prep: [SAMPLES_PREP] } },
    { title: "add_page_break · 여백 Cm(2) · 머리글 · 바닥글", html: `<p>마지막은 쪽 설정이에요. 쪽 나누기 · 여백 · 머리글 · 바닥글이에요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>doc.add_page_break()</code></td><td>여기서 다음 쪽으로(글자 없는 문단이 하나 생겨요)</td></tr><tr><td><code>s = doc.sections[0]</code></td><td>구역 = 쪽 설정 묶음. 새 문서에는 하나예요</td></tr><tr><td><code>s.left_margin = Cm(2)</code></td><td>왼쪽 여백. <code>right_margin</code> · <code>top_margin</code> · <code>bottom_margin</code> 도 같아요. <code>from docx.shared import Cm</code></td></tr><tr><td><code>s.header.paragraphs[0].text = "…"</code></td><td>머리글(모든 쪽 위)</td></tr><tr><td><code>s.footer.paragraphs[0].text = "…"</code></td><td>바닥글(모든 쪽 아래)</td></tr><tr><td><code>doc.add_picture("logo.png", width=Cm(4))</code></td><td>그림 넣기(새 문단으로). 크기 · 자리는 Word 에서 눈으로 봐요</td></tr></tbody></table>
<ul><li>다시 읽은 여백이 <code>2.00025</code> 처럼 조금 달라요. 워드는 길이를 「1/20 포인트」 단위 정수로 저장해서 cm 가 딱 떨어지지 않아요. 찍을 때는 <code>round(s.left_margin.cm, 1)</code></li><li>쪽 번호를 넣는 기능은 python-docx 에 없어요. 쪽 번호가 필요하면 Word 에서 바닥글에 쪽 번호를 넣은 틀 문서로 시작해요</li><li>마지막 쪽 뒤에 <code>add_page_break()</code> 를 하면 빈 쪽이 하나 더 생겨요. 예제처럼 마지막은 빼요</li></ul>
<div class="bk-warn"><b>.doc · .hwp 는 못 열어요</b> — python-docx 는 <code>.docx</code> 만 읽어요. <code>.docx</code> 는 속이 zip 파일([[레슨:J3]] 의 그 zip)인데, 옛 Word 의 <code>.doc</code> 와 한글의 <code>.hwp</code> 는 zip 이 아니라서 <code>Document("견적.doc")</code> 는 <code>BadZipFile: File is not a zip file</code> 로 멈춰요. 프로그램에서 docx 로 저장해서 열어요([[레슨:J7]] 의 마지막 쪽).</div>`,
      example: { code: `import tempfile
from pathlib import Path
from docx import Document
from docx.shared import Cm

with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "수업_계획.docx"
    doc = Document()
    s = doc.sections[0]
    s.left_margin = Cm(2)
    s.right_margin = Cm(2)
    s.header.paragraphs[0].text = "햇살 공방 · 수업 계획"
    s.footer.paragraphs[0].text = "공방 안에서만 보기"

    for name in ["가죽 공예", "목공 기초", "도자기"]:
        doc.add_heading(name, level=1)
        doc.add_paragraph(f"{name} 수업은 4주 과정이에요.")
        if name != "도자기":           # 마지막 뒤에는 쪽을 안 나눠요
            doc.add_page_break()
    doc.save(path)

    again = Document(path)
    s = again.sections[0]
    print("머리글:", s.header.paragraphs[0].text)
    print("바닥글:", s.footer.paragraphs[0].text)
    print("왼쪽 여백:", s.left_margin.cm, "→", round(s.left_margin.cm, 1), "cm")
    for p in again.paragraphs:
        print(f"{p.style.name:10} |", repr(p.text))` } },
  ],
  summary: ["Document() 에 add_heading · add_paragraph(style=…) · add_table 로 문단과 표를 더하고 save — 저장하면 Document(path) 로 다시 열어 text · style.name · 표 칸을 찍어 확인해요", "문단 안 일부의 서식은 run 으로(bold · Pt · RGBColor), 한글 글꼴은 font.name 만으로 안 되고 w:eastAsia 칸까지 — 문서 전체는 Normal 스타일에 한 번", "스타일 이름은 영어(\"Table Grid\" · \"List Bullet\"), 표 칸에는 글자만, 쪽은 add_page_break · sections[0] 의 여백 · 머리글 · 바닥글 — .doc · .hwp 는 docx 로 저장해서 열어요"] },
{ id: 'J7', ch: 2, n: 7, title: "워드 읽고 고치기 · 틀 채우기", mode: 'text',
  tutorSummary: "있는 워드 읽고 고치기. doc.paragraphs 는 본문만 → 표 칸(tables → rows → cells → paragraphs) · 머리글 · 바닥글(sections → header/footer.paragraphs)까지 모으는 all_paragraphs(doc). 자리 이름은 re.findall(r\"\\$\\{(.+?)\\}\", p.text). 틀 채우기 함정 둘: ① run 쪼개짐 — Word 가 맞춤법 검사 · 고친 기록 · 나중에 고쳐 친 글자마다 run 을 나눠서 ${이름} 이 ${ + 이름} 두 run(make_template_docx) → run 마다 replace 는 안 바뀜 ② p.text = … 는 run 을 다 지우고 서식 없는 run 하나 → 굵은 ${수업} 의 굵게가 사라짐. 해결 fill_paragraph: run 이 ${ 를 열고 안 닫았으면(is_open, 끝이 $ 여도) 다음 run 글자를 끌어와 잇고 끌어온 run 은 비운 뒤 run 마다 replace(이어 붙인 자리는 첫 run 서식). fill_docx(doc, values) 는 all_paragraphs 를 다 채우고 남은 ${…} 이름 리스트를 돌려줌. 틀은 그대로 두고 새 이름으로 저장, 사람마다 Document(틀) 을 새로 열기(한 번만 열면 모두 첫 사람 이름). 열어 둔 표에 줄 더하기 doc.tables[0].add_row().cells. PDF 로: Word 있으면 docx2pdf convert, 없으면 soffice --headless --convert-to pdf --outdir(subprocess, Windows 는 전체 경로) — 둘 다 ☐. HWP 는 직접 안 열고 한글에서 「다른 이름으로 저장」 → PDF(J4 · J5) 나 docx(J6 · J7). .hwp 를 Document 로 열면 BadZipFile, .hwpx 도 못 엶.",
  pages: [
    { title: "all_paragraphs(doc): 본문 · 표 · 머리글까지", html: `<p>이번엔 있는 워드 문서를 <b>읽고 고쳐요</b>. 첫 일은 글자가 있는 곳을 빠짐없이 도는 거예요. 그런데 <code>doc.paragraphs</code> 는 <b>본문 문단만</b> 줘요. 표 칸 안의 글자, 머리글 · 바닥글의 글자는 따로 있어요.</p>
<table class="kb"><tbody><tr><th>글자가 있는 곳</th><th>도는 법</th></tr><tr><td>본문</td><td><code>doc.paragraphs</code></td></tr><tr><td>표 칸</td><td><code>doc.tables</code> → <code>t.rows</code> → <code>row.cells</code> → <code>cell.paragraphs</code></td></tr><tr><td>머리글 · 바닥글</td><td><code>doc.sections</code> → <code>s.header.paragraphs</code> · <code>s.footer.paragraphs</code></td></tr></tbody></table>
<p>그래서 이 셋을 한 리스트로 모으는 함수를 하나 만들어 두고 계속 써요.</p>
<pre>def all_paragraphs(doc):
    """본문 · 표 칸 · 머리글 · 바닥글의 문단을 모두 모아 돌려줘요."""
    ps = list(doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                ps.extend(cell.paragraphs)
    for s in doc.sections:
        ps.extend(s.header.paragraphs)
        ps.extend(s.footer.paragraphs)
    return ps</pre>
<ul><li><code>ps.extend(리스트)</code> 는 리스트를 통째로 이어 붙여요(<code>append</code> 는 하나씩)</li><li>틀이 바라는 자리 이름은 문단 글자에서 정규식으로 찾아요: <code>re.findall(r"\\$\\{(.+?)\\}", p.text)</code>. <code>$</code> · <code>{</code> 는 정규식에서 뜻이 있는 글자라 <code>\\</code> 를 붙여요. <code>.+?</code> 의 <code>?</code> 는 「되도록 짧게」 예요. 빼면 <code>\${이름} 님 \${수업}</code> 에서 <code>이름} 님 \${수업</code> 을 한 덩어리로 잡아요(복습: <a href="../python/#lesson/L20B" target="_blank" rel="noopener">파이썬 교과서 「정규식 2: 찾아 꺼내기 · 줄 처음과 끝」 ↗</a>)</li><li>병합한 칸은 <code>row.cells</code> 에 두 번 나올 수 있어요. 바꾸기는 두 번째엔 바꿀 게 없어서 괜찮지만, 셀 때는 주의해요</li><li>글상자(텍스트 상자) 속 글자는 이 셋에 없어요. 틀에는 글상자를 쓰지 않는 게 좋아요</li></ul>`,
      example: { code: `import re
import tempfile
from pathlib import Path
from docx import Document

def all_paragraphs(doc):
    """본문 · 표 칸 · 머리글 · 바닥글의 문단을 모두 모아 돌려줘요."""
    ps = list(doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                ps.extend(cell.paragraphs)
    for s in doc.sections:
        ps.extend(s.header.paragraphs)
        ps.extend(s.footer.paragraphs)
    return ps


with tempfile.TemporaryDirectory() as tmp:
    path = Path(tmp) / "견적_틀.docx"
    doc = Document()                       # 연습용 틀: 본문 · 표 · 머리글에 자리가 있어요
    doc.sections[0].header.paragraphs[0].text = "\${거래처} 귀하"
    doc.add_heading("견적서", level=1)
    doc.add_paragraph("견적일: \${견적일}")
    t = doc.add_table(rows=2, cols=2)
    t.cell(0, 0).text = "품목"
    t.cell(0, 1).text = "금액"
    t.cell(1, 0).text = "\${품목}"
    t.cell(1, 1).text = "\${금액}"
    doc.save(path)

    doc = Document(path)
    print("본문 문단만:", len(doc.paragraphs), "개")
    ps = all_paragraphs(doc)
    print("all_paragraphs:", len(ps), "개")
    names = []
    for p in ps:
        for name in re.findall(r"\\$\\{(.+?)\\}", p.text):
            names.append(name)
    print("자리:", names)` } },
    { title: "\"${\" + \"이름}\": run 쪼개짐 · p.text 함정", html: `<p>틀의 <code>\${이름}</code> 을 사람 이름으로 바꾸는 건 쉬워 보여요. 그런데 두 가지 함정이 있어요. 연습 재료의 수료증 틀 <code>make_template_docx</code> 로 직접 봐요.</p>
<p><b>함정 1 — run 쪼개짐.</b> 문단 글자는 <code>\${이름} 님은 …</code> 인데, run 을 찍어 보면 <code>['\${', '이름}', …]</code> 처럼 <b>두 run 에 나뉘어</b> 있어요. 그래서 run 마다 <code>replace("\${이름}", …)</code> 하면 어느 run 에도 <code>\${이름}</code> 이 통째로 없어서 안 바뀌어요. 에러도 안 나요.</p>
<p>일부러 만든 게 아니에요. <b>Word 가 실제로 이렇게 쪼개요.</b> 맞춤법 검사 밑줄이 생겼다 사라질 때, 고친 기록을 남길 때, 나중에 몇 글자만 고쳐 쳤을 때, 한/영 전환을 할 때마다 run 을 나눠요. 화면에서는 똑같이 보여서 사람은 몰라요.</p>
<p><b>함정 2 — <code>p.text = …</code>.</b> 그럼 문단 글자를 통째로 바꾸면? <code>\${이름}</code> 은 바뀌어요. 하지만 <code>p.text</code> 에 쓰면 python-docx 가 run 을 다 지우고 <b>서식 없는 run 하나</b>로 새로 만들어요. 그래서 굵게 해 둔 <code>\${수업}</code> 의 굵게가 사라져요.</p>
<table class="kb"><tbody><tr><th>방법</th><th><code>\${이름}</code>(쪼개짐)</th><th><code>\${수업}</code>(굵게)</th></tr><tr><td>run 마다 바꾸기</td><td>✗ 안 바뀜</td><td>○ 바뀌고 굵게 남음</td></tr><tr><td><code>p.text = …</code></td><td>○ 바뀜</td><td>✗ 굵게가 사라짐</td></tr></tbody></table>
<p>두 장점을 다 가지는 방법은 다음 쪽에서 만들어요.</p>`,
      example: { code: `import tempfile
from pathlib import Path
from docx import Document
from samples import make_template_docx

with tempfile.TemporaryDirectory() as tmp:
    tpl = make_template_docx(Path(tmp) / "수료증_틀.docx")

    doc = Document(tpl)
    p = doc.paragraphs[1]
    print(p.text)
    print([r.text for r in p.runs])

    # 시도 1: run 마다 바꾸기 → \${이름} 은 run 둘에 걸쳐 있어서 못 찾아요
    for r in p.runs:
        r.text = r.text.replace("\${이름}", "김하늘").replace("\${수업}", "가죽 공예")
    print("시도 1:", p.text)

    # 시도 2: 문단 글자 통째로 → 바뀌긴 하는데 run 이 하나로 합쳐져 굵게가 사라져요
    doc = Document(tpl)
    p = doc.paragraphs[1]
    print("굵은 run:", [r.text for r in p.runs if r.bold])
    p.text = p.text.replace("\${이름}", "김하늘").replace("\${수업}", "가죽 공예")
    print("시도 2:", p.text)
    print("run", len(p.runs), "개, 굵게:", p.runs[0].bold)`, prep: [SAMPLES_PREP] } },
    { title: "fill_docx(doc, values): 끊긴 자리만 잇기", html: `<p>생각은 이래요. run 마다 바꾸되, <b>어떤 run 이 <code>\${</code> 를 열고 안 닫았으면</b> 다음 run 글자를 끌어와 이어 붙여요. 끌어온 run 은 비워요. 그러면 쪼개진 자리는 한 run 에 모여서 바뀌고, 쪼개지지 않은 자리(굵은 <code>\${수업}</code>)는 제 run 그대로 바뀌어 서식이 남아요.</p>
<table class="kb"><tbody><tr><th>run</th><th>처음</th><th>잇기</th><th>바꾸기</th></tr><tr><td>0</td><td><code>\${</code></td><td><code>\${이름}</code></td><td><code>김하늘</code></td></tr><tr><td>1</td><td><code>이름}</code></td><td>(빈 글자)</td><td>(빈 글자)</td></tr><tr><td>3 (굵게)</td><td><code>\${수업}</code></td><td>그대로</td><td><b><code>가죽 공예</code></b></td></tr></tbody></table>
<pre>def is_open(s):
    """\${ 를 열고 아직 } 로 안 닫았으면 True (끝이 $ 하나여도 열린 것으로)"""
    if s.endswith("$"):
        return True
    return "\${" in s and "}" not in s.split("\${")[-1]


def fill_paragraph(p, values):
    runs = p.runs
    for i, r in enumerate(runs):
        j = i + 1
        while is_open(r.text) and j &lt; len(runs):
            r.text = r.text + runs[j].text    # 다음 run 글자를 끌어와 잇고
            runs[j].text = ""                 # 끌어온 run 은 비워요
            j += 1
        for key, value in values.items():
            r.text = r.text.replace("\${" + key + "}", str(value))


def fill_docx(doc, values):
    """doc 의 \${이름} 자리를 values 로 채우고, 못 채운 자리 이름 리스트를 돌려줘요."""
    left = []
    for p in all_paragraphs(doc):
        fill_paragraph(p, values)
        for name in re.findall(r"\\$\\{(.+?)\\}", p.text):
            if name not in left:
                left.append(name)
    return left</pre>
<ul><li><code>is_open</code>: 마지막 <code>\${</code> 뒤에 <code>}</code> 가 없으면 「열려 있음」. Word 가 <code>$</code> 와 <code>{</code> 사이를 쪼갤 수도 있어서, 끝이 <code>$</code> 인 run 도 열린 것으로 봐요</li><li>이어 붙인 자리의 서식은 <b>첫 run 의 서식</b>을 따라요. 틀을 만들 때 자리 하나는 같은 서식으로 쳐 두면 돼요</li><li><code>str(value)</code> 라서 숫자도 넣을 수 있지만, 금액 · 날짜 모양은 넘기기 전에 만들어요(<code>f"{n:,}원"</code>)</li><li>다 바꾼 뒤 남은 <code>\${…}</code> 를 찾아 <b>돌려줘요</b>. 값을 빠뜨렸거나 자리 이름에 오타가 있으면 여기 나와요. 남은 게 있으면 저장하지 않고 알리는 게 안전해요</li></ul>
<div class="bk-warn"><b>틀은 그대로 두고 새 이름으로</b> — <code>fill_docx</code> 는 열어 둔 <code>doc</code> 을 바꿔요. 저장은 늘 <code>수료증_김하늘.docx</code> 처럼 새 이름으로 하고, 틀 파일에는 저장하지 않아요. 틀을 덮어쓰면 다음 사람부터 채울 자리가 없어요.</div>`,
      example: { code: `import re
import tempfile
from pathlib import Path
from docx import Document
from samples import make_template_docx

def all_paragraphs(doc):
    """본문 · 표 칸 · 머리글 · 바닥글의 문단을 모두 모아 돌려줘요."""
    ps = list(doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                ps.extend(cell.paragraphs)
    for s in doc.sections:
        ps.extend(s.header.paragraphs)
        ps.extend(s.footer.paragraphs)
    return ps

def is_open(s):
    """\${ 를 열고 아직 } 로 안 닫았으면 True (끝이 $ 하나여도 열린 것으로)"""
    if s.endswith("$"):
        return True
    return "\${" in s and "}" not in s.split("\${")[-1]


def fill_paragraph(p, values):
    runs = p.runs
    for i, r in enumerate(runs):
        j = i + 1
        while is_open(r.text) and j < len(runs):
            r.text = r.text + runs[j].text    # 다음 run 글자를 끌어와 잇고
            runs[j].text = ""                 # 끌어온 run 은 비워요
            j += 1
        for key, value in values.items():
            r.text = r.text.replace("\${" + key + "}", str(value))


def fill_docx(doc, values):
    """doc 의 \${이름} 자리를 values 로 채우고, 못 채운 자리 이름 리스트를 돌려줘요."""
    left = []
    for p in all_paragraphs(doc):
        fill_paragraph(p, values)
        for name in re.findall(r"\\$\\{(.+?)\\}", p.text):
            if name not in left:
                left.append(name)
    return left


with tempfile.TemporaryDirectory() as tmp:
    tpl = make_template_docx(Path(tmp) / "수료증_틀.docx")
    doc = Document(tpl)
    left = fill_docx(doc, {"이름": "김하늘", "수업": "가죽 공예"})
    print("못 채운 자리:", left)
    out = Path(tmp) / "수료증_김하늘.docx"
    doc.save(out)

    p = Document(out).paragraphs[1]
    print(p.text)
    for r in p.runs:
        if r.text:
            print(repr(r.text), r.bold)`, prep: [SAMPLES_PREP] } },
    { title: "사람마다 Document(틀) · 새 이름 · 표에 줄", html: `<p>여러 장을 만들 때 가장 흔한 실수는 <b>틀을 한 번만 열어 두고</b> 사람마다 채우는 거예요.</p>
<pre>doc = Document(tpl)                 # ✗ 한 번만 열면
for name, course in people:
    fill_docx(doc, {"이름": name, "수업": course})
    doc.save(f"수료증_{name}.docx")  # 둘째 사람부터 이미 「김하늘」 이 들어간 문서</pre>
<p>첫 사람을 채운 순간 <code>\${이름}</code> 자리가 사라져요. 둘째 · 셋째 파일도 전부 김하늘이에요. 에러도 없어요. 그래서 <b>사람마다 <code>Document(tpl)</code> 로 틀을 새로 열어요.</b> 파일을 다시 읽는 건 금방이에요.</p>
<p>열어 둔 문서의 표에 줄을 더하는 건 [[레슨:J6]] 그대로예요. <code>doc.tables[0].add_row().cells</code> 로 줄을 더하고 칸에 글자를 넣은 뒤 저장해요. 예제는 발급 대장 표에 한 줄씩 더해요.</p>
<p>그리고 저장한 파일을 다시 열어 <b>사람마다 이름이 다른지</b>, 틀은 그대로인지 찍어 봐요. 「다 김하늘」 실수는 이렇게 찍어 봐야 보여요.</p>`,
      example: { code: `import re
import tempfile
from pathlib import Path
from docx import Document
from samples import make_template_docx

def all_paragraphs(doc):
    """본문 · 표 칸 · 머리글 · 바닥글의 문단을 모두 모아 돌려줘요."""
    ps = list(doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                ps.extend(cell.paragraphs)
    for s in doc.sections:
        ps.extend(s.header.paragraphs)
        ps.extend(s.footer.paragraphs)
    return ps

def is_open(s):
    """\${ 를 열고 아직 } 로 안 닫았으면 True (끝이 $ 하나여도 열린 것으로)"""
    if s.endswith("$"):
        return True
    return "\${" in s and "}" not in s.split("\${")[-1]


def fill_paragraph(p, values):
    runs = p.runs
    for i, r in enumerate(runs):
        j = i + 1
        while is_open(r.text) and j < len(runs):
            r.text = r.text + runs[j].text    # 다음 run 글자를 끌어와 잇고
            runs[j].text = ""                 # 끌어온 run 은 비워요
            j += 1
        for key, value in values.items():
            r.text = r.text.replace("\${" + key + "}", str(value))


def fill_docx(doc, values):
    """doc 의 \${이름} 자리를 values 로 채우고, 못 채운 자리 이름 리스트를 돌려줘요."""
    left = []
    for p in all_paragraphs(doc):
        fill_paragraph(p, values)
        for name in re.findall(r"\\$\\{(.+?)\\}", p.text):
            if name not in left:
                left.append(name)
    return left


people = [("김하늘", "가죽 공예"), ("이도윤", "목공 기초"), ("박서준", "도자기")]

with tempfile.TemporaryDirectory() as tmp:
    folder = Path(tmp)
    tpl = make_template_docx(folder / "수료증_틀.docx")

    log = Document()                       # 발급 대장: 머리줄만 있는 표
    t = log.add_table(rows=1, cols=3)
    for cell, head in zip(t.rows[0].cells, ["번호", "이름", "파일"]):
        cell.text = head
    log.save(folder / "발급_대장.docx")

    log = Document(folder / "발급_대장.docx")
    for i, (name, course) in enumerate(people, start=1):
        doc = Document(tpl)                # 사람마다 틀을 새로 열어요
        fill_docx(doc, {"이름": name, "수업": course, "수료일": "2026년 10월 31일"})
        out = folder / f"수료증_{name}.docx"
        doc.save(out)
        cells = log.tables[0].add_row().cells      # 열어 둔 표에 줄 더하기
        cells[0].text = str(i)
        cells[1].text = name
        cells[2].text = out.name
    log.save(folder / "발급_대장.docx")

    names = sorted(p.name for p in folder.glob("*.docx"))
    print(names)
    for name, course in people:
        print(Document(folder / f"수료증_{name}.docx").paragraphs[1].text[:20])
    print("틀:", Document(tpl).paragraphs[1].text[:20])
    for row in Document(folder / "발급_대장.docx").tables[0].rows:
        print([c.text for c in row.cells])`, prep: [SAMPLES_PREP] } },
    { title: "PDF 로 바꾸기 · 한글(HWP)은 저장해서", html: `<p>워드 → PDF, 한글 → 워드 같은 <b>형식 바꾸기는 파이썬이 직접 하지 않고 그 형식을 아는 프로그램에게 맡겨요.</b></p>
<p><b>워드 → PDF.</b> 둘 중 하나예요.</p>
<table class="kb"><tbody><tr><th>내 PC</th><th>쓰는 것</th></tr><tr><td>Word 가 깔려 있음(Windows · macOS)</td><td><code>pip install docx2pdf</code> → <code>convert("수료증", "pdf")</code>(폴더째) — 뒤에서 Word 를 몰래 켜서 저장해요</td></tr><tr><td>Word 가 없음</td><td>LibreOffice(무료)의 <code>soffice --headless --convert-to pdf --outdir pdf 파일.docx</code> 를 <code>subprocess.run</code> 으로(복습: <a href="../python/#lesson/L28" target="_blank" rel="noopener">파이썬 교과서 「환경 변수와 다른 프로그램: os · subprocess」 ↗</a>)</td></tr></tbody></table>
<pre>import subprocess
from docx2pdf import convert

convert("수료증", "pdf")                        # Word 가 있을 때

files = sorted(Path("수료증").glob("*.docx"))
cmd = pdf_command(files, Path("pdf"))
subprocess.run(cmd, check=True)                # LibreOffice 로</pre>
<ul><li>Windows 에서 <code>soffice</code> 는 보통 PATH 에 없어요. <code>C:\\Program Files\\LibreOffice\\program\\soffice.exe</code> 처럼 전체 경로를 첫 칸에 써요</li><li>LibreOffice 창이 하나라도 열려 있으면 <code>--headless</code> 변환이 조용히 아무것도 안 할 때가 있어요. 창을 다 닫고 돌려요</li><li>둘 다 이 교과서의 예제로는 돌리지 않아요(Word · LibreOffice 가 있어야 해서). 명령 리스트를 만드는 <code>pdf_command</code> 까지만 예제에서 돌리고, 진짜 바꾸기는 내 PC 에서 해 봐요. 만든 PDF 는 [[레슨:J4]] 의 <code>PdfReader</code> 로 다시 열어 쪽 수 · 글자를 확인해요</li></ul>
<p><b>한글(HWP) 문서는?</b> 파이썬으로 <code>.hwp</code> 를 직접 열지 않아요. 공식 파이썬 라이브러리가 없고, 한컴오피스를 원격 조종하는 방법은 Windows + 한컴오피스가 있어야 하고 깨지기 쉬워요. 대신 <b>한글 프로그램에서 「파일 → 다른 이름으로 저장」 → 파일 형식을 고르면</b> 이 교과서의 도구를 그대로 써요.</p>
<table class="kb"><tbody><tr><th>저장할 형식</th><th>그다음</th></tr><tr><td>PDF(<code>.pdf</code>)</td><td>글자 꺼내기 · 합치기 · 나누기 — [[레슨:J4]] · [[레슨:J5]]</td></tr><tr><td>MS Word 문서(<code>.docx</code>)</td><td><code>Document(path)</code> · <code>all_paragraphs</code> · <code>fill_docx</code> — [[레슨:J6]] · 이 레슨</td></tr></tbody></table>
<ul><li>복습: <code>.hwp</code> 를 그냥 <code>Document()</code> 로 열면 <code>BadZipFile</code> 이에요([[레슨:J6]] 의 마지막 쪽). 요즘 한글의 <code>.hwpx</code> 는 zip 이긴 하지만 워드 형식이 아니라서 역시 못 열어요</li><li>docx 로 바꾸면 글자 · 문단 · 표는 대개 잘 넘어와요. 글상자 · 그리기 개체 · 한글만의 쪽 모양은 달라질 수 있어서, 처음 한 번은 Word 로 열어 눈으로 봐요</li><li>받은 한글 문서가 많으면 한글 프로그램의 「일괄 변환」 기능(버전마다 이름이 조금 달라요)으로 폴더째 docx · PDF 로 바꿀 수 있어요</li></ul>`,
      example: { code: `import tempfile
import zipfile
from pathlib import Path
from docx import Document


def pdf_command(docx_files, outdir):
    """LibreOffice 로 PDF 를 만드는 명령 리스트(subprocess.run 에 그대로 넘겨요)"""
    cmd = ["soffice", "--headless", "--convert-to", "pdf", "--outdir", Path(outdir).as_posix()]
    for p in docx_files:
        cmd.append(Path(p).as_posix())
    return cmd


files = [Path("수료증_김하늘.docx"), Path("수료증_이도윤.docx")]
cmd = pdf_command(files, Path("pdf"))
print(cmd)

with tempfile.TemporaryDirectory() as tmp:
    hwp = Path(tmp) / "공방_안내문.hwp"
    hwp.write_text("HWP Document File")   # 한글 파일 흉내(zip 이 아닌 파일)
    try:
        Document(hwp)
    except zipfile.BadZipFile as e:
        print("BadZipFile:", e)

    saved = Path(tmp) / "공방_안내문.docx"           # 한글에서 「다른 이름으로 저장」 한 docx 흉내
    doc = Document()
    doc.add_heading("겨울 방학 특강", level=1)
    doc.add_paragraph("12월 22일부터 2주 동안 열려요.")
    doc.save(saved)
    for p in Document(saved).paragraphs:
        print(p.style.name, "|", p.text)` } },
  ],
  summary: ["doc.paragraphs 는 본문만이라, 표 칸 · 머리글 · 바닥글까지 모으는 all_paragraphs(doc) 로 돌아요", "Word 는 ${이름} 을 run 여러 개로 쪼개고, p.text = … 는 서식을 지워요 — fill_docx 는 끊긴 자리만 이어 붙여 바꾸고 남은 자리를 돌려줘요", "틀은 사람마다 새로 열고 새 이름으로 저장해요. PDF 로 바꾸기는 docx2pdf · LibreOffice 에, 한글(HWP)은 한글에서 PDF · docx 로 저장해서 다뤄요"] },
{ id: 'JB2', ch: 2, boss: true, title: '만들어 보기: 청구서 정리기', mode: 'text',
  tutorSummary: '만들어 보기: 청구서 정리기 — make_invoices 의 청구서 PDF 6개(스캔본 하나 · 암호 1234 하나)에서 read_invoice(PdfReader · decrypt · extract_text · 정규식)로 거래처 · 번호 · 청구일 · 금액을 뽑고(못 읽은 것은 까닭과 함께 따로, 암호는 input 으로 물어 다시), 청구일 순 모음 PDF(PdfWriter.append · 거래처 책갈피 add_outline_item · /Title), 보고서 틀(run 이 쪼개진 ${작성자})을 fill_docx 로 채운 워드 보고서(맑은 고딕 · 표 · 합계 · 못 읽은 파일), 다시 열어 assert 로 검사하는 check_outputs, csv(utf-8-sig) 까지 main(folder, out, today) 하나로', pages: [], summary: [] },
{ id: 'J8', ch: 3, n: 8, title: '템플릿으로 문서 대량 만들기', mode: 'text',
  tutorSummary: "string.Template 으로 틀 하나 × 명단 → 사람마다 문서. 자리 $name · ${name}, 진짜 $ 는 $$, substitute(값들)는 빠지면 KeyError · safe_substitute 는 빠진 자리를 그대로 남김(사람에게 줄 글은 substitute). 한글 자리 이름은 기본으로 안 됨: 기본 idpattern 이 (?a:[_a-z][_a-z0-9]*) 라 $이름 → ValueError: Invalid placeholder in string: line 1, col 1. class KTemplate(Template): idpattern = r\"[^\\W\\d]\\w*\" 로 자식 클래스(클래스 속성, 만든 뒤 Template.idpattern = … 은 안 먹음). 한글은 뒤 말까지 이름: $이름님 → KeyError: '이름님', 영문 $name님 도 KTemplate 에선 name님 → 늘 ${이름}님. t.get_identifiers() 로 틀이 바라는 자리, t.is_valid(). f-string 은 파일 속 틀에 못 쓰고, str.format 은 {m.__dict__} 처럼 속성까지 꺼내고 CSS 중괄호에 깨짐. 명단 csv(DictReader, utf-8-sig) → 전부 검사(check: 비어 있는 칸을 모두 모아 알리고 하나도 안 만듦) → 만들기. 값 서식은 넣기 전에(f\"{n:,}\", date.fromisoformat), 파일 이름은 re.sub 로 안전하게(J1), HTML 틀은 값마다 html.escape, 워드 틀은 p.text 를 합쳐 채우고 첫 run 에 넣고 나머지 run 비우기(J7, 서식은 첫 run 을 따라감).",
  terms: { "틀": "바꿀 자리만 비워 둔 글. 같은 모양의 글을 사람마다 만들 때 써요(템플릿)", "자리 이름": "틀 안의 $이름 · ${이름} 처럼 값이 들어갈 곳에 붙인 이름(placeholder)" },
  pages: [
    { title: "Template(\"${name}님\").substitute(…)", html: `<p>안내문 · 영수증 · 수료증처럼 <b>모양은 같고 이름 · 금액만 다른 글</b>은 [[틀]] 하나와 명단으로 한꺼번에 만들어요. 파이썬 표준의 <code>string.Template</code> 이 이 일을 해요. 틀 안의 <code>$name</code> · <code>\${name}</code> 이 값이 들어갈 [[자리 이름]]이에요.</p>
<table class="kb"><tbody><tr><th>쓰는 법</th><th>뜻</th></tr><tr><td><code>$name</code></td><td>자리 하나. 기본은 영문 · 숫자 · 밑줄 이름만</td></tr><tr><td><code>\${name}</code></td><td>같은 자리. 중괄호가 이름의 끝을 분명히 해 줘요</td></tr><tr><td><code>$$</code></td><td>진짜 <code>$</code> 한 글자</td></tr><tr><td><code>t.substitute(값들)</code></td><td>채우기 — 값이 하나라도 빠지면 <code>KeyError</code></td></tr><tr><td><code>t.safe_substitute(값들)</code></td><td>빠진 자리는 <code>\${fee}</code> 그대로 남기고 채우기</td></tr></tbody></table>
<pre>from string import Template

t = Template("\${name}님, 수강료는 \${fee}원이에요.")
print(t.substitute(name="Kim", fee="180,000"))
print(t.substitute({"name": "Lee", "fee": "240,000"}))
print(t.safe_substitute(name="Park"))</pre>
<p>값은 <code>name="Kim"</code> 처럼 키워드로 줘도 되고, 딕셔너리 하나로 줘도 돼요. csv 한 줄이 딕셔너리라서 이 교과서는 주로 딕셔너리로 넘겨요. 틀 원문은 <code>t.template</code> 에 그대로 있어요.</p>
<div class="bk-warn"><b>남에게 줄 글은 substitute</b> — <code>safe_substitute</code> 는 에러 없이 끝나서 편해 보이지만, 「<code>\${fee}</code>원이에요」 가 찍힌 안내문이 그대로 나가요. 사람에게 보낼 문서는 <code>substitute</code> 로 만들고, 빠진 값은 에러로 알아채세요. <code>safe_substitute</code> 는 틀을 두 번에 나눠 채울 때만 써요.</div>`,
      example: { code: `from string import Template

t = Template("$name 님, \${course} 수강료는 \${fee}원이에요. (해외 카드는 $$135)")
print(t.substitute(name="Kim", course="가죽 공예", fee="180,000"))

values = {"name": "Lee", "course": "목공 기초", "fee": "240,000"}
print(t.substitute(values))

try:
    t.substitute(name="Park")
except KeyError as e:
    print("KeyError:", e)

print(t.safe_substitute(name="Park"))
print(t.template)` } },
    { title: "class KTemplate(Template): idpattern = …", html: `<p>공방 직원이 쓰는 틀은 자리 이름도 한글이 편해요. 명단 csv 의 머리줄이 「이름 · 수업 · 수료일」 이니까요. 그런데 기본 <code>Template</code> 은 한글 자리 이름을 못 읽어요.</p>
<pre>Template("$이름 님").substitute({"이름": "김하늘"})
# ValueError: Invalid placeholder in string: line 1, col 1</pre>
<p>기본 이름 규칙 <code>Template.idpattern</code> 이 <code>(?a:[_a-z][_a-z0-9]*)</code> 라서예요. <code>(?a:…)</code> 는 「영문(ASCII) 글자만」 이라는 뜻이에요. 그래서 <code>$</code> 뒤의 「이름」 을 자리로 못 읽고 「잘못된 자리」 로 봐요. 에러의 <code>line 1, col 1</code> 이 그 <code>$</code> 가 있는 줄 · 칸이에요(둘 다 1부터).</p>
<p>고치는 길은 <code>Template</code> 을 물려받아 <b>클래스 속성 <code>idpattern</code> 하나만 바꾼</b> 자식 클래스예요(복습: 상속은 <a href="../python/#lesson/L15" target="_blank" rel="noopener">파이썬 교과서 「클래스 2: 메서드와 상속」 ↗</a>, 클래스 속성은 <a href="../python/#lesson/L15E" target="_blank" rel="noopener">파이썬 교과서 「클래스 4: 클래스 속성 · property · dataclass」 ↗</a>).</p>
<pre>class KTemplate(Template):
    idpattern = r"[^\\W\\d]\\w*"</pre>
<table class="kb"><tbody><tr><th>조각</th><th>뜻</th></tr><tr><td><code>\\w</code></td><td>글자 · 숫자 · 밑줄 — 파이썬 정규식은 한글도 글자로 봐요(복습: <a href="../python/#lesson/L20" target="_blank" rel="noopener">파이썬 교과서 「정규표현식 맛보기」 ↗</a>)</td></tr><tr><td><code>\\W</code> · <code>\\d</code></td><td><code>\\w</code> 가 아닌 것 · 숫자</td></tr><tr><td><code>[^…]</code></td><td>대괄호 맨 앞의 <code>^</code> 는 「안에 적은 것이 <b>아닌</b> 한 글자」</td></tr><tr><td><code>[^\\W\\d]</code></td><td><code>\\W</code> 도 숫자도 아닌 글자 = 숫자를 뺀 글자 · 밑줄. 그래서 자리 이름은 숫자로 시작하지 못해요</td></tr><tr><td><code>\\w*</code></td><td>그 뒤로 글자 · 숫자 · 밑줄 0개 이상</td></tr></tbody></table>
<div class="bk-warn"><b>나중에 바꾸면 안 먹어요</b> — <code>Template.idpattern = …</code> 처럼 만든 뒤에 바꾸면 그대로 <code>ValueError</code> 예요. <code>Template</code> 은 클래스를 만들 때 패턴을 한 번 만들어 둬요. 그래서 꼭 <code>class</code> 문 안에 적어요.</div>
<p><b>함정 하나 더: 한글은 뒤에 붙는 말까지 이름이에요.</b> <code>$이름님</code> 의 자리 이름은 「이름」 이 아니라 「이름님」 이에요. 「님」 도 글자니까요. 그래서 <code>KeyError: '이름님'</code>. 영문 틀에서는 <code>$name님</code> 이 됐어요(「님」 이 영문이 아니라 거기서 끊겨서). 그런데 <code>KTemplate</code> 에서는 그것도 「name님」 으로 읽혀요. 규칙 하나로 끝내요: <b>자리는 늘 <code>\${이름}</code> 처럼 중괄호로.</b></p>`,
      example: { code: `from string import Template

row = {"이름": "김하늘", "수업": "가죽 공예"}

try:
    Template("$이름 님, 안녕하세요").substitute(row)
except ValueError as e:
    print("ValueError:", e)
print(Template.idpattern)


class KTemplate(Template):
    idpattern = r"[^\\W\\d]\\w*"   # 첫 글자는 숫자 말고 글자 · 밑줄, 그다음은 \\w


print(KTemplate("$이름 님, 안녕하세요").substitute(row))

try:
    KTemplate("$이름님, 안녕하세요").substitute(row)
except KeyError as e:
    print("KeyError:", e)
print(KTemplate("\${이름}님, \${수업} 과정").substitute(row))` } },
    { title: "t.get_identifiers() · 왜 format 이 아닌가", html: `<p>틀은 보통 코드 밖 파일에 있어요. 직원이 메모장이나 워드로 고치니까요. 그러면 코드는 틀이 어떤 자리를 바라는지 미리 몰라요. <code>t.get_identifiers()</code> 가 틀의 자리 이름을 나온 순서대로 리스트로 줘요. <code>t.is_valid()</code> 는 잘못된 자리가 없으면 <code>True</code> 예요(둘 다 파이썬 3.11 부터).</p>
<pre>t = KTemplate("\${이름}님, \${수업} 과정은 \${요일}에 시작해요.")
print(t.get_identifiers())    # ['이름', '수업', '요일']
row = {"이름": "김하늘", "수업": "가죽 공예"}
print([k for k in t.get_identifiers() if k not in row])    # ['요일']</pre>
<p>그럼 f-string 이나 <code>str.format</code> 은 왜 안 쓸까요? <code>"{이름}님".format(이름="김하늘")</code> 처럼 글자의 <code>.format(…)</code> 메서드는 <code>{이름}</code> 자리를 채워요. f-string 과 같은 생각인데, 틀을 나중에 받는다는 점이 달라요.</p>
<table class="kb"><tbody><tr><th></th><th>틀이 파일에 있을 때</th><th>남이 쓴 틀일 때</th></tr><tr><td>f-string</td><td>✗ 코드 안에 적은 글자에서만 돼요. 파일에서 읽은 글자는 그냥 글자예요</td><td>—</td></tr><tr><td><code>str.format</code></td><td>돼요</td><td>✗ <code>{m.__dict__}</code> 처럼 점으로 객체 속 값까지 꺼내요. HTML 틀의 CSS <code>p { color: red }</code> 같은 중괄호도 에러가 나요</td></tr><tr><td><code>Template</code></td><td>돼요</td><td>✓ 이름 하나만 바꿔 넣어요. 점 · 대괄호 · 호출은 그냥 글자로 남아요</td></tr></tbody></table>
<p>예제의 <code>other.format(m=m)</code> 이 남이 보낸 틀 하나로 전화번호까지 꺼내는 걸 보세요. <code>Template</code> 은 같은 틀에서 <code>$m</code> 만 바꾸고 <code>.__dict__</code> 는 글자로 둬요.</p>`,
      example: { code: `import tempfile
from pathlib import Path
from string import Template


class KTemplate(Template):
    idpattern = r"[^\\W\\d]\\w*"


with tempfile.TemporaryDirectory() as tmp:
    form = Path(tmp) / "안내_틀.txt"   # 직원이 메모장으로 쓴 틀이라고 해 봐요
    form.write_text("\${이름}님, \${수업} 과정은 \${요일} \${시각}에 시작해요.\\n준비물: \${준비물}\\n", encoding="utf-8")

    t = KTemplate(form.read_text(encoding="utf-8"))
    print(t.get_identifiers())
    print(t.is_valid())

    row = {"이름": "김하늘", "수업": "가죽 공예", "요일": "토요일"}
    missing = [k for k in t.get_identifiers() if k not in row]
    print("명단에 없는 칸:", missing)


# str.format 은 틀 안에서 점(.)으로 속성까지 꺼낼 수 있어요
class Member:
    def __init__(self, name, phone):
        self.name = name
        self.phone = phone


m = Member("김하늘", "010-1234-5678")
other = "{m.name}님 안녕하세요 {m.__dict__}"     # 남이 보낸 틀
print(other.format(m=m))
print(KTemplate("$m.__dict__ 님").safe_substitute(m="김하늘"))` } },
    { title: "명단 × 틀: 먼저 전부 검사하고 만들기", html: `<p>이제 명단 csv(복습: <a href="../python/#lesson/L29" target="_blank" rel="noopener">파이썬 교과서 「csv 모듈 제대로」 ↗</a>) × 틀 → 사람마다 파일 하나예요. 순서가 중요해요.</p>
<ol><li><b>전부 읽기</b> — <code>list(csv.DictReader(f))</code></li><li><b>전부 검사</b> — 문제를 하나도 빠짐없이 모아서 한 번에 알려요</li><li><b>문제가 없을 때만 만들기</b></li><li><b>다시 열어 확인</b></li></ol>
<p>만들면서 검사하면, 넷째 사람에서 멈췄을 때 세 개만 만들어진 반쪽 결과가 남아요. 고쳐서 다시 돌리면 어느 게 새 것인지 헷갈리고, 메일이라면([[레슨:J10]]) 앞사람들에게 두 번 가요. 검사는 틀이 바라는 자리(<code>get_identifiers()</code>)마다 그 칸이 비었는지 봐요. 명단의 박서준은 이메일 칸이 비어 있어요.</p>
<p><b>값 서식은 틀에 넣기 전에.</b> 틀은 글자를 끼워 넣기만 해요. <code>180000</code> → <code>180,000</code> 은 <code>f"{n:,}"</code>(복습: <a href="../python/#lesson/L9C" target="_blank" rel="noopener">파이썬 교과서 「서식 출력: 칸 맞추기 · 소수 · 쉼표」 ↗</a>), <code>"2026-10-31"</code> → 「2026년 10월 31일」 은 <code>date.fromisoformat</code>(복습: <a href="../python/#lesson/L19" target="_blank" rel="noopener">파이썬 교과서 「날짜 2: 글자 ↔ 날짜 · 비교」 ↗</a>)으로 바꿔서 넘겨요. 예제처럼 <code>prepare(row)</code> 함수로 떼고, <code>dict(row)</code> 로 복사해서 원래 줄은 그대로 둬요.</p>
<p><b>파일 이름은 안전하게.</b> 수업 이름의 빈칸이나 이름에 섞일 수 있는 <code>/</code> · <code>:</code> 는 Windows 파일 이름에 못 쓰거나 불편해요. [[레슨:J1]] 처럼 <code>re.sub</code> 로 <code>_</code> 로 바꿔요. 예제에 <code>safe_name</code> 을 다시 적어 뒀어요.</p>
<p>명단이 엑셀 파일이면 읽는 부분만 바꿔요 — <a href="../files/#lesson/F7" target="_blank" rel="noopener">데이터 파일 다루기 교과서 「엑셀 읽기: 통합 문서 · 시트 · 셀」 ↗</a>. 그다음 순서는 같아요.</p>`,
      example: { code: `import csv
import re
import tempfile
from datetime import date
from pathlib import Path
from string import Template

from samples import make_files


class KTemplate(Template):
    idpattern = r"[^\\W\\d]\\w*"


FORM = """\${이름}님, 안녕하세요. 햇살 공방이에요.
\${수업} 과정 수료를 축하드려요.
수료일: \${수료일} · 수강료: \${수강료}원
수료증은 메일(\${이메일})로 보내 드릴게요.
"""


def safe_name(s):
    """Windows 파일 이름에 못 쓰는 글자 9개와 빈칸을 _ 로"""
    return re.sub(r'[<>:"/\\\\|?*\\s]', "_", s)


def check(rows, t):
    """만들기 전에 전부 검사 — 문제를 모두 모아 돌려줘요"""
    problems = []
    for i, row in enumerate(rows):
        for k in t.get_identifiers():
            if not row.get(k):
                problems.append(f"{i + 2}줄 {row['이름']}: '{k}' 칸이 비었어요")
    return problems


def prepare(row):
    """값 서식은 틀에 넣기 전에 — 원래 row 는 그대로 두고 새 딕셔너리로"""
    v = dict(row)
    v["수강료"] = f"{int(row['수강료']):,}"
    d = date.fromisoformat(row["수료일"])
    v["수료일"] = f"{d.year}년 {d.month}월 {d.day}일"
    return v


def make_all(rows, t, out):
    problems = check(rows, t)
    if problems:
        for p in problems:
            print("  ✗", p)
        print("  → 하나도 만들지 않았어요")
        return 0
    out.mkdir(exist_ok=True)
    for row in rows:
        name = safe_name(f"수료안내_{row['수업']}_{row['이름']}.txt")
        text = t.substitute(prepare(row))
        (out / name).write_text(text, encoding="utf-8")
    return len(rows)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_files(base / "다운로드")
    with open(base / "다운로드" / "수강생 명단.csv", encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    t = KTemplate(FORM)
    out = base / "안내문"

    print("1번째:", make_all(rows, t, out), "개")
    rows[2]["이메일"] = "seojun@example.com"      # 명단을 고치고 다시
    print("2번째:", make_all(rows, t, out), "개")

    names = sorted(p.name for p in out.iterdir())
    print(names[:3])
    print((out / names[0]).read_text(encoding="utf-8"))`, prep: [SAMPLES_PREP] } },
    { title: "HTML 틀은 html.escape · 워드 틀은 run 합치기", html: `<p><b>HTML 틀</b>(메일 본문 [[레슨:J9]] · 웹 페이지)에 값을 그대로 넣으면, 값 속의 <code>&lt;</code> · <code>&amp;</code> 가 태그로 읽혀서 글이 깨지거나 남이 넣은 태그가 실행돼요. 값마다 <code>html.escape</code> 를 거쳐서 넣어요(복습: <a href="../python/#lesson/X17" target="_blank" rel="noopener">파이썬 교과서 「실전 17: 내 웹 페이지」 ↗</a>). 틀 자체는 escape 하지 않아요. 틀의 태그는 진짜 태그니까요.</p>
<pre>safe = {}
for k, v in row.items():
    safe[k] = html.escape(v)    # 값만, 하나씩
print(KTemplate(FORM).substitute(safe))</pre>
<p><b>워드 틀</b>은 [[레슨:J7]] 에서 본 run 쪼개짐이 함정이에요. <code>make_template_docx</code> 의 <code>\${이름}</code> 은 <code>\${</code> + <code>이름}</code> 두 run 이라서 run 마다 바꾸면 자리를 못 찾아요. 문단 글자 <code>p.text</code> 를 합쳐 <code>KTemplate</code> 로 채운 뒤 첫 run 에 넣고, 나머지 run 은 비워요. 틀 파일은 그대로 두고 새 이름으로 저장해요.</p>
<p>이 짧은 판은 문단 글자가 모두 첫 run 의 서식을 따라가요. 그래서 굵게였던 <code>\${수업}</code> 도 보통 글씨가 돼요. 만든 파일을 Word 로 열어 직접 보고, 서식을 살리는 법은 [[레슨:J7]] 을 다시 보세요.</p>`,
      example: { code: `import html
import tempfile
from pathlib import Path
from string import Template

from docx import Document
from samples import make_template_docx


class KTemplate(Template):
    idpattern = r"[^\\W\\d]\\w*"


# ① HTML 틀 — 값마다 html.escape
FORM = "<p>\${이름}님의 신청 수업: <b>\${수업}</b></p>"
row = {"이름": "김하늘", "수업": "가죽 <중급> & 염색"}
print(KTemplate(FORM).substitute(row))

safe = {}
for k, v in row.items():
    safe[k] = html.escape(v)
print(KTemplate(FORM).substitute(safe))


# ② 워드 틀 — 문단 글자를 합쳐 바꾼 뒤 첫 run 에 넣고 나머지 run 은 비우기
def fill_paragraph(p, values):
    if "$" not in p.text:
        return
    new = KTemplate(p.text).substitute(values)
    p.runs[0].text = new
    for r in p.runs[1:]:
        r.text = ""


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    form = make_template_docx(base / "수료증_틀.docx")
    doc = Document(form)
    print(KTemplate(doc.paragraphs[1].text).get_identifiers())

    values = {"이름": "김하늘", "수업": "가죽 공예", "수료일": "2026년 10월 31일"}
    for p in doc.paragraphs:
        fill_paragraph(p, values)
    doc.save(base / "수료증_김하늘.docx")       # 틀은 그대로, 새 이름으로

    for p in Document(base / "수료증_김하늘.docx").paragraphs:
        print(p.style.name, "|", p.text)
    print("틀은 그대로:", Document(form).paragraphs[2].text)`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["string.Template 의 ${이름} 자리를 substitute(딕셔너리)로 채워요 — 빠진 값은 KeyError 로 알아채고, 진짜 $ 는 $$", "한글 자리 이름은 class KTemplate(Template): idpattern = r\"[^\\W\\d]\\w*\" 로 — 뒤에 붙는 말까지 이름이 되니 늘 ${이름}님 처럼 중괄호", "명단 × 틀은 먼저 전부 검사(get_identifiers 의 칸이 비었는지)하고 그다음 만들어요 — 값 서식 · 파일 이름 · html.escape 는 넣기 전에"] },
{ id: 'J9', ch: 3, n: 9, title: '이메일 메시지 만들기 · 읽기', mode: 'text',
  tutorSummary: "email.message.EmailMessage 로 메일 한 통 만들기(보내기는 J10). 머리글 msg[\"From\"] · [\"To\"] · [\"Cc\"] · [\"Subject\"](한글 그대로), 같은 머리글을 또 넣으면 ValueError: There may be at most 1 To headers in a message → del msg[\"To\"] 또는 사람마다 새 EmailMessage. 이름 + 주소는 email.utils.formataddr((\"김하늘\", addr)) — 한글은 =?utf-8?b?…?= 로 바뀌고 읽을 땐 한글, 이름에 쉼표가 있으면 직접 이은 글자는 두 사람으로 읽힘. parseaddr 은 거꾸로 (이름, 주소). 본문 set_content(글) + add_alternative(html, subtype=\"html\"), walk() · get_content_type(): text/plain → multipart/alternative → (첨부) multipart/mixed. get_body(preferencelist=(\"plain\",)) · 빼면 html 먼저, get_content() 끝에 \\n. 첨부: p.read_bytes() 로 bytes → add_attachment(data, maintype=\"application\", subtype=\"pdf\", filename=\"수료증_김하늘.pdf\"), mimetypes.guess_type 은 Windows 레지스트리마다 달라 내 표 TYPES + application/octet-stream, 첨부 한도 보통 20~25MB(base64 로 1.3배쯤). .eml 저장 p.write_bytes(msg.as_bytes()) → open(p, \"rb\") + BytesParser(policy=policy.default).parse(f)(policy 빼면 compat32 라 제목 인코딩 그대로 · get_body 없음) 로 다시 읽어 To · Subject · 본문 · 첨부 이름 · 바이트 == 확인. as_string() 은 제목 인코딩 · 무작위 boundary 라 비교 금지. 함수 make_message(sender, to, subject, body, attachments=(), html=None) 를 J10 · JB3 가 다시 씀. 받은 메일: iter_attachments() · get_filename() · get_content()(application 은 bytes) → Path(name).name 으로 이름만 떼어 write_bytes. imaplib 은 이름만.",
  terms: { "머리글": "메일 맨 위의 From · To · Subject 같은 줄(header). 보낸 사람 · 받는 사람 · 제목이 여기 있어요", "MIME 종류": "메일 조각(본문 · 첨부)이 무엇인지 나타내는 이름. text/plain · text/html · application/pdf 처럼 큰 종류/작은 종류로 적어요", "바이트": "글자로 풀지 않은 파일 내용 그대로(bytes). PDF · 그림 · 워드 파일은 바이트로 읽고 써요" },
  pages: [
    { title: "EmailMessage() · formataddr((이름, 주소))", html: `<p>메일 한 통은 [[머리글]](누가 · 누구에게 · 제목)과 본문으로 돼 있어요. 표준 <code>email.message.EmailMessage</code> 로 만들고, 머리글은 딕셔너리처럼 <code>msg["To"] = …</code> 로 넣어요. 실제로 보내는 건 [[레슨:J10]] 이에요. 이 레슨은 만들고 · 파일로 저장하고 · 다시 읽기까지예요.</p>
<table class="kb"><tbody><tr><th>머리글</th><th>뜻</th></tr><tr><td><code>From</code></td><td>보낸 사람</td></tr><tr><td><code>To</code></td><td>받는 사람 — 여럿이면 쉼표로 이어요</td></tr><tr><td><code>Cc</code></td><td>참조 — 받는 사람 모두에게 보여요</td></tr><tr><td><code>Subject</code></td><td>제목 — 한글을 그대로 넣으면 돼요</td></tr></tbody></table>
<p>받는 사람 이름까지 넣으려면 <code>email.utils.formataddr((이름, 주소))</code> 를 써요. 괄호가 두 겹인 건 (이름, 주소) <b>튜플 하나</b>를 넘기기 때문이에요. 한글 이름은 메일 머리글 규칙대로 <code>=?utf-8?b?…?=</code> 모양으로 바꿔 줘요. 읽을 때는 다시 한글로 보여요. 거꾸로 <code>parseaddr("김하늘 &lt;sky@example.com&gt;")</code> 는 <code>('김하늘', 'sky@example.com')</code> 튜플을 줘요.</p>
<div class="bk-warn"><b>같은 머리글을 또 넣으면 에러</b> — 딕셔너리와 달리 덮어쓰지 않아요. <code>ValueError: There may be at most 1 To headers in a message</code>. 바꾸려면 <code>del msg["To"]</code> 로 먼저 지우거나, 사람마다 <code>EmailMessage()</code> 를 새로 만들어요.</div>
<div class="bk-warn"><b>이름에 쉼표가 있으면</b> — <code>"햇살 공방, 본점 &lt;hello@…&gt;"</code> 처럼 직접 이은 글자는 쉼표에서 나뉘어 <b>두 사람</b>으로 읽혀요. <code>formataddr</code> 는 이름을 알맞게 감싸 줘서 한 사람이에요. 그래서 이름 · 주소는 늘 <code>formataddr</code> 로 이어요.</div>`,
      example: { code: `from email.message import EmailMessage
from email.utils import formataddr, parseaddr

msg = EmailMessage()
msg["From"] = formataddr(("햇살 공방", "hello@example.com"))
msg["To"] = formataddr(("김하늘", "sky@example.com"))
msg["Cc"] = "doyun@example.com, yuna@example.com"
msg["Subject"] = "10월 수료를 축하드려요"

print(formataddr(("김하늘", "sky@example.com")))   # 머리글에 들어가는 꼴
print(msg["To"])                                   # 읽을 때는 다시 한글
print(msg["Subject"])
print(msg.keys())
print(parseaddr("김하늘 <sky@example.com>"))

# 같은 머리글을 또 넣으면 에러 — 바꾸려면 먼저 지워요
try:
    msg["To"] = "doyun@example.com"
except ValueError as e:
    print("ValueError:", e)
del msg["To"]
msg["To"] = formataddr(("이도윤", "doyun@example.com"))
print(msg["To"])

# 이름에 쉼표가 있으면? 직접 이으면 두 사람으로 읽혀요
a = EmailMessage()
a["To"] = "햇살 공방, 본점 <hello@example.com>"
b = EmailMessage()
b["To"] = formataddr(("햇살 공방, 본점", "hello@example.com"))
print(len(a["To"].addresses), "명 /", len(b["To"].addresses), "명")` } },
    { title: "set_content(글) + add_alternative(html)", html: `<p><code>msg.set_content(글)</code> 이 글자 본문이에요. 메일 앱에서 굵게 · 문단으로 보일 HTML 본문은 <code>msg.add_alternative(html, subtype="html")</code> 로 <b>더해요</b>. 둘 다 있으면 메일 앱은 HTML 을 보여 주고, HTML 을 못 보여 주는 앱이나 설정은 글자 본문을 보여 줘요. 그래서 글자 본문도 늘 같이 넣어요. HTML 에 명단 값을 넣을 때는 [[레슨:J8]] 의 <code>html.escape</code> 를 잊지 마세요.</p>
<p>본문을 더할 때마다 메일 속 모양이 바뀌어요. <code>msg.walk()</code> 는 메일 안의 조각(part)을 바깥부터 차례로 돌고, 조각마다 <code>get_content_type()</code> 이 [[MIME 종류]]를 알려 줘요. <code>is_multipart()</code> 는 조각이 여럿인지예요.</p>
<table class="kb"><tbody><tr><th>지금까지 넣은 것</th><th>메일 전체의 종류</th></tr><tr><td><code>set_content</code> 만</td><td><code>text/plain</code> — 조각 하나</td></tr><tr><td>+ <code>add_alternative</code></td><td><code>multipart/alternative</code> — 같은 내용의 두 모양(<code>text/plain</code> · <code>text/html</code>)</td></tr><tr><td>+ <code>add_attachment</code>(다음 쪽)</td><td><code>multipart/mixed</code> — 본문 + 첨부</td></tr></tbody></table>
<p>본문을 꺼낼 때는 <code>msg.get_body(preferencelist=("plain",))</code> 가 글자 본문 조각이에요. 인자를 빼면 HTML 조각을 먼저 골라요. 조각의 <code>get_content()</code> 가 글자를 꺼내 주는데, 끝에 줄바꿈 <code>\\n</code> 이 하나 붙어 있어요.</p>`,
      example: { code: `from email.message import EmailMessage

msg = EmailMessage()
msg["From"] = "hello@example.com"
msg["To"] = "sky@example.com"
msg["Subject"] = "수료 안내"

msg.set_content("김하늘님, 수료를 축하드려요.\\n수료증은 다음 주에 보내 드려요.")
print(msg.get_content_type(), msg.is_multipart())

msg.add_alternative("<p>김하늘님, <b>수료</b>를 축하드려요.</p><p>수료증은 다음 주에 보내 드려요.</p>", subtype="html")
print(msg.get_content_type(), msg.is_multipart())
for part in msg.walk():
    print(" ", part.get_content_type())

plain = msg.get_body(preferencelist=("plain",))
body = plain.get_content()
print(repr(body))
print(msg.get_body().get_content_type())    # 고르지 않으면 html 먼저` } },
    { title: "add_attachment(data, …, filename=…)", html: `<p>PDF · 그림 · 워드 파일은 글자 파일이 아니라서 [[바이트]](<code>bytes</code>)로 다뤄요. <code>p.read_bytes()</code> 는 파일 전체를 바이트로 읽고, <code>p.write_bytes(data)</code> 는 바이트를 파일로 써요. <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a> 의 <code>read_text</code> · <code>write_text</code> 의 바이트 판이에요. 바이트 값은 <code>b'%PDF-'</code> 처럼 앞에 <code>b</code> 가 붙어 찍혀요.</p>
<pre>msg.add_attachment(data, maintype="application", subtype="pdf", filename="수료증_김하늘.pdf")</pre>
<p><code>maintype</code> · <code>subtype</code> 은 MIME 종류 <code>application/pdf</code> 를 <code>/</code> 로 나눈 두 조각이에요. <code>filename</code> 은 받는 사람에게 보일 첨부 이름이고, 한글 그대로 돼요.</p>
<p>확장자로 종류를 알려 주는 표준 <code>mimetypes.guess_type("a.pdf")</code> 도 있어요. 그런데 Windows 에서는 PC 에 깔린 프로그램(레지스트리)에 따라 답이 달라요(<code>.hwp</code> · <code>.csv</code> 같은 것). 자동화 프로그램은 어느 PC 에서나 같게 돌아야 하니, <b>내 표</b>를 두고 표에 없으면 <code>application/octet-stream</code>(「그냥 바이트」)으로 붙여요.</p>
<table class="kb"><tbody><tr><th>확장자</th><th>MIME 종류</th></tr><tr><td><code>.pdf</code></td><td><code>application/pdf</code></td></tr><tr><td><code>.docx</code></td><td><code>application/vnd.openxmlformats-officedocument.wordprocessingml.document</code></td></tr><tr><td><code>.zip</code></td><td><code>application/zip</code></td></tr><tr><td><code>.jpg</code> · <code>.png</code></td><td><code>image/jpeg</code> · <code>image/png</code></td></tr><tr><td>그 밖</td><td><code>application/octet-stream</code></td></tr></tbody></table>
<div class="bk-warn"><b>첨부 크기 한도</b> — 메일 서비스마다 한 통에 보통 20~25MB 쯤이에요. 넘으면 거절되거나 「대용량 첨부」 링크로 바뀌어요. 게다가 첨부는 메일 안에서 글자(base64)로 바뀌어 1.3배쯤 커져요. 붙이기 전에 <code>p.stat().st_size</code> 를 더해서 한도보다 넉넉히 아래인지 확인해요.</div>`,
      example: { code: `import tempfile
from email.message import EmailMessage
from pathlib import Path

from samples import make_pdf

TYPES = {                       # 내 표 — PC 마다 달라지지 않게
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".zip": "application/zip",
    ".jpg": "image/jpeg",
    ".png": "image/png",
}
MAX_BYTES = 20 * 1024 * 1024    # 20MB — 메일 서비스 한도(보통 20~25MB)보다 조금 아래


def mime_of(name):
    t = TYPES.get(Path(name).suffix.lower(), "application/octet-stream")
    maintype, subtype = t.split("/")
    return maintype, subtype


print(mime_of("수료증_김하늘.pdf"))
print(mime_of("사진.JPG"))
print(mime_of("작품.hwp"))

with tempfile.TemporaryDirectory() as tmp:
    pdf = make_pdf(Path(tmp) / "수료증_김하늘.pdf", ["수료증\\n김하늘\\n가죽 공예"])
    data = pdf.read_bytes()             # 파일 → 바이트 통째로
    print(type(data).__name__, data[:5], len(data) < MAX_BYTES)

    msg = EmailMessage()
    msg["To"] = "sky@example.com"
    msg["Subject"] = "수료증을 보내 드려요"
    msg.set_content("수료증을 첨부해요.")
    maintype, subtype = mime_of(pdf.name)
    msg.add_attachment(data, maintype=maintype, subtype=subtype, filename=pdf.name)

    print(msg.get_content_type())
    for part in msg.walk():
        print(" ", part.get_content_type(), part.get_filename())`, prep: [SAMPLES_PREP] } },
    { title: ".eml 로 저장 → BytesParser 로 다시 읽기", html: `<p>보내기 전에 메일을 파일로 저장해 두면 메일 앱으로 열어 눈으로 볼 수 있어요. <code>msg.as_bytes()</code> 가 메일 원문 바이트예요. <code>write_bytes</code> 로 <code>.eml</code> 파일에 쓰면, Outlook · Thunderbird · Windows 메일 같은 앱에서 두 번 눌러 열려요.</p>
<p>다시 읽을 때는 <code>BytesParser(policy=policy.default).parse(f)</code> 예요. 파일은 바이트로 열어요 — <code>open(path, "rb")</code> 의 <code>b</code> 가 바이트예요.</p>
<div class="bk-warn"><b>policy=policy.default 를 꼭</b> — 빼면 옛 방식(compat32)으로 읽어서 제목이 <code>=?utf-8?b?…?=</code> 그대로고, <code>get_body</code> · <code>iter_attachments</code> 가 없어요.</div>
<p>예제는 메일 만들기를 함수 <code>make_message(sender, to, subject, body, attachments=(), html=None)</code> 하나로 묶었어요. [[레슨:J10]] 의 보내기와 [[레슨:JB3]] 의 발송기가 이 함수를 그대로 다시 써요.</p>
<div class="bk-warn"><b>원문(as_string)을 그대로 비교하지 마세요</b> — 제목이 <code>=?utf-8?b?…?=</code> 로 바뀌어 있고, 본문과 첨부 사이 경계 글자(<code>boundary</code>)가 만들 때마다 무작위예요. 내용이 같은 메일 두 통도 원문은 달라요. 확인은 늘 <b>다시 읽어서</b> 받는 사람 · 제목 · 본문 · 첨부 이름 · 첨부 바이트 <code>==</code> 로 해요. <code>Date</code> · <code>Message-ID</code> 머리글도 넣지 않았어요. 보낼 때 메일 서버가 붙여 주는 경우가 많아요.</div>`,
      example: { code: `import tempfile
from email import policy
from email.message import EmailMessage
from email.parser import BytesParser
from email.utils import formataddr
from pathlib import Path

from samples import make_pdf

TYPES = {".pdf": "application/pdf", ".zip": "application/zip", ".jpg": "image/jpeg", ".png": "image/png",
         ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}


def mime_of(name):
    t = TYPES.get(Path(name).suffix.lower(), "application/octet-stream")
    maintype, subtype = t.split("/")
    return maintype, subtype


def make_message(sender, to, subject, body, attachments=(), html=None):
    """메일 한 통 — sender · to 는 formataddr 로 만든 글자, attachments 는 파일 경로들"""
    msg = EmailMessage()
    msg["From"] = sender
    msg["To"] = to
    msg["Subject"] = subject
    msg.set_content(body)
    if html:
        msg.add_alternative(html, subtype="html")
    for path in attachments:
        path = Path(path)
        maintype, subtype = mime_of(path.name)
        msg.add_attachment(path.read_bytes(), maintype=maintype, subtype=subtype, filename=path.name)
    return msg


def save_eml(msg, path):
    Path(path).write_bytes(msg.as_bytes())        # 바이트 → 파일


def read_eml(path):
    with open(path, "rb") as f:                   # "rb" = 바이트로 읽기
        return BytesParser(policy=policy.default).parse(f)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    pdf = make_pdf(base / "수료증_김하늘.pdf", ["수료증\\n김하늘"])
    msg = make_message(formataddr(("햇살 공방", "hello@example.com")),
                       formataddr(("김하늘", "sky@example.com")),
                       "10월 수료를 축하드려요",
                       "김하늘님, 수료를 축하드려요.\\n수료증을 첨부해요.",
                       attachments=[pdf])

    outbox = base / "outbox"
    outbox.mkdir()
    save_eml(msg, outbox / "김하늘.eml")
    names = sorted(p.name for p in outbox.iterdir())
    print(names)

    back = read_eml(outbox / "김하늘.eml")        # 다시 읽어 확인
    print("받는 사람:", back["To"])
    print("제목:", back["Subject"])
    body = back.get_body(preferencelist=("plain",)).get_content()
    print("본문:", repr(body))
    for part in back.iter_attachments():
        print("첨부:", part.get_filename(), part.get_content() == pdf.read_bytes())

    raw = msg.as_string()
    print("=?utf-8?b?" in raw, "boundary=" in raw)
    again = make_message("hello@example.com", "sky@example.com", "같은 메일", "본문", attachments=[pdf])
    twin = make_message("hello@example.com", "sky@example.com", "같은 메일", "본문", attachments=[pdf])
    print(again.as_bytes() == twin.as_bytes())     # 내용이 같아도 원문은 달라요`, prep: [SAMPLES_PREP] } },
    { title: "받은 메일: iter_attachments() 로 첨부 꺼내기", html: `<p>거꾸로, 받은 메일에서 첨부를 꺼내요. 메일 앱에서 메일을 <code>.eml</code> 로 저장하거나 폴더로 끌어다 놓으면 파일이 돼요. 연습 재료 <code>make_eml</code> 이 숲속목재가 보낸 견적서 메일 한 통을 만들어 줘요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>뜻</th></tr><tr><td><code>parseaddr(msg["From"])</code></td><td>보낸 사람 (이름, 주소)</td></tr><tr><td><code>msg.iter_attachments()</code></td><td>첨부 조각만 차례로</td></tr><tr><td><code>part.get_filename()</code></td><td>첨부 이름</td></tr><tr><td><code>part.get_content()</code></td><td>첨부 내용 — <code>application/…</code> · <code>image/…</code> 는 <code>bytes</code>, <code>text/…</code> 는 <code>str</code></td></tr></tbody></table>
<div class="bk-warn"><b>남이 정한 첨부 이름</b> — 첨부 이름은 보낸 사람이 정해요. <code>../../</code> 처럼 폴더가 섞여 오면 엉뚱한 곳에 써질 수 있어서, <code>Path(이름).name</code> 으로 이름 부분만 떼어 써요. 이름이 같은 첨부가 둘이면 덮어쓰니, 그럴 땐 [[레슨:J1]] 처럼 이름을 바꿔요.</div>
<p>꺼낸 PDF 를 읽는 건 [[레슨:J4]] 의 <code>PdfReader</code> 예요. 받은편지함을 직접 여는 <code>imaplib</code> 은 이름만 알아 두세요. 이 교과서는 저장한 <code>.eml</code> 로 다뤄요.</p>`,
      example: { code: `import tempfile
from email import policy
from email.parser import BytesParser
from email.utils import parseaddr
from pathlib import Path

from pypdf import PdfReader
from samples import make_eml

with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_eml(base / "받은메일.eml")
    with open(base / "받은메일.eml", "rb") as f:
        msg = BytesParser(policy=policy.default).parse(f)

    name, addr = parseaddr(msg["From"])
    print("보낸 사람:", name, "/", addr)
    print("제목:", msg["Subject"])
    print(msg.get_body(preferencelist=("plain",)).get_content().strip())

    save = base / "받은첨부"
    save.mkdir()
    for part in msg.iter_attachments():
        name = Path(part.get_filename()).name    # 폴더 부분은 떼고 이름만
        data = part.get_content()                # application/… 은 bytes
        print("첨부:", name, part.get_content_type(), type(data).__name__)
        (save / name).write_bytes(data)

    for p in sorted(save.iterdir()):
        r = PdfReader(p)
        text = " ".join(r.pages[0].extract_text().split())
        print(p.name, len(r.pages), "쪽 |", text)`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["EmailMessage 에 msg[\"To\"] = formataddr((이름, 주소)) · Subject(한글 그대로)를 넣어요 — 같은 머리글은 두 번 못 넣으니 사람마다 새 메시지", "본문은 set_content(글) + add_alternative(html, subtype=\"html\"), 첨부는 read_bytes() 한 바이트를 add_attachment(…, maintype, subtype, filename) 로 — 종류는 내 표로", "write_bytes(msg.as_bytes()) 로 .eml 저장 → BytesParser(policy=policy.default) 로 다시 읽어 받는 사람 · 제목 · 본문 · 첨부를 확인해요 — 원문 비교는 안 돼요"] },
{ id: 'J10', ch: 3, n: 10, title: '이메일 보내기', mode: 'text',
  tutorSummary: "smtplib 로 내 메일 계정의 SMTP 서버에 로그인해 EmailMessage 를 보낸다. 465 는 smtplib.SMTP_SSL(host, 465, timeout=30), 587 은 smtplib.SMTP(host, 587) 뒤 server.starttls() 를 login 보다 먼저 — 포트와 짝을 맞춘다. with 가 끝나면 quit. server.login(아이디, 앱 비밀번호) → server.send_message(msg) 는 To · Cc · Bcc 모두에게 보내고 Bcc 머리는 빼 준다. Gmail: smtp.gmail.com, 아이디 = 주소 전체, Google 계정 관리 → 보안 → 2단계 인증 켜기 → 계정 검색 칸에 「앱 비밀번호」 → 앱 이름 → 만들기 → 16글자 복사(다시 못 봄), SMTP 는 따로 켤 것 없음, Workspace 계정은 관리자가 막을 수 있음. 네이버: smtp.naver.com, 아이디 = @ 앞부분, 메일 환경설정 → POP3/IMAP 설정 → IMAP/SMTP 설정 → 사용함 → 저장, 2단계 인증이면 네이버 내정보 → 보안설정 → 2단계 인증 관리 → 애플리케이션 비밀번호 관리 → 직접 입력 → 생성하기. 메뉴 이름은 바뀔 수 있음. From 은 로그인한 내 주소. 에러: SMTPAuthenticationError 535(비밀번호 · 설정), socket.gaierror(서버 이름 철자), ssl.SSLError WRONG_VERSION_NUMBER(587 에 SMTP_SSL), TimeoutError(네트워크가 막음) — 모두 OSError 갈래. 비밀번호는 코드 밖: os.environ.get(\"MAIL_PASSWORD\")(PowerShell $env:MAIL_PASSWORD=\"…\", L28) 또는 from getpass import getpass → getpass(\"…\") 는 치는 글자가 안 보이는 input, 앱 비밀번호 빈칸은 replace 로 빼기, 찍지 않기, .env 는 API 교과서 H7. 보내는 부분을 함수로 떼고 서버를 인자로(deliver(msg, server=None, outbox=None)): None 이면 outbox/ 에 .eml 만(미리 보기), 시험은 send_message 만 있는 가짜 서버(samples 의 FakeSMTP: sent · login · with · fail=). 순서: 미리 보기 → 가짜 → 나에게 한 통 → 모두. 여러 명: 한 명에 한 통, 사이에 time.sleep(delay)(시험은 0), 실패는 except OSError as e 로 적어 두고 continue, 보낸 다음에 sent.csv 에 \"a\" 로 한 줄(mark_sent) · done.add — 다시 돌리면 이미 보낸 주소는 건너뛰어 실패한 사람만 다시. 광고는 동의 + (광고), 하루 한도, 명단 · sent.csv 는 개인정보. 받기는 imaplib(이름만).",
  terms: {"SMTP":"메일을 보내는 약속이자 그 일을 하는 서버. 내 메일 계정의 SMTP 서버에 로그인해서 메일을 맡기면 받는 사람 쪽으로 전해 줘요","앱 비밀번호":"메일 서비스가 프로그램용으로 따로 만들어 주는 비밀번호. 진짜 비밀번호 대신 쓰고, 새어 나가면 그것만 지우면 돼요"},
  pages: [
    { title: "SMTP_SSL(host, 465) · send_message", html: `<p>[[레슨:J9]] 에서 만든 <code>EmailMessage</code> 를 이제 진짜로 보내요. 메일을 받아서 상대에게 전해 주는 곳이 [[SMTP]] 서버예요. 파이썬 표준 모듈 <code>smtplib</code> 로 <b>내 메일 계정의 SMTP 서버</b>에 로그인해서 메일을 맡기면 돼요.</p>
<pre>import os
import smtplib
from email.message import EmailMessage

ME = "내아이디@gmail.com"                # 내 주소로 바꿔요
pw = os.environ.get("MAIL_PASSWORD")    # 앱 비밀번호 — 코드에 적지 않아요(3쪽)

msg = EmailMessage()
msg["From"] = ME
msg["To"] = ME                          # 첫 발송은 늘 나에게
msg["Subject"] = "파이썬에서 보낸 첫 메일"
msg.set_content("잘 도착했나요?")

with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as server:
    server.login(ME, pw)
    server.send_message(msg)
print("보냈어요")</pre>
<p>서버에 붙는 방법은 둘이에요. 둘 다 비밀번호가 오가기 전에 연결을 암호화해요. <b>포트 번호와 짝을 맞춰야</b> 해요.</p>
<table class="kb"><tbody><tr><th>포트</th><th>코드</th><th>뜻</th></tr><tr><td><code>465</code></td><td><code>smtplib.SMTP_SSL(host, 465)</code></td><td>처음부터 암호화된 연결</td></tr><tr><td><code>587</code></td><td><code>smtplib.SMTP(host, 587)</code> → <code>server.starttls()</code></td><td>보통 연결로 붙은 뒤 암호화로 바꾸기 — <code>login</code> 보다 먼저</td></tr></tbody></table>
<pre>with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as server:
    server.starttls()          # 여기서부터 암호화
    server.login(ME, pw)
    server.send_message(msg)</pre>
<table class="kb"><tbody><tr><th>메일</th><th>서버 이름</th><th>포트</th><th>login 아이디</th></tr><tr><td>Gmail</td><td><code>smtp.gmail.com</code></td><td>465 · 587</td><td>주소 전체(<code>…@gmail.com</code>)</td></tr><tr><td>네이버</td><td><code>smtp.naver.com</code></td><td>465 · 587</td><td>네이버 아이디(<code>@naver.com</code> 앞부분)</td></tr><tr><td>회사 · 학교 메일</td><td colspan="3">담당자에게 서버 이름 · 포트 · 로그인 방법을 물어요. 바깥 프로그램의 로그인을 막아 둔 곳이 많아요</td></tr></tbody></table>
<ul><li><code>From</code> 은 <b>로그인한 내 주소</b>로 써요. 다른 주소를 쓰면 네이버는 거절하고, Gmail 은 내 주소로 바꿔 버려요</li><li><code>with</code> 가 끝나면 연결을 닫는 <code>server.quit()</code> 을 대신 불러 줘요</li><li><code>send_message(msg)</code> 는 <code>To</code> · <code>Cc</code> · <code>Bcc</code> 의 주소 모두에게 보내요. <code>Bcc</code> 는 받는 사람 목록에만 넣고 <b>나가는 메일의 머리에서는 빼 줘요</b>. 그래서 받는 사람끼리 Bcc 주소를 못 봐요</li><li><code>timeout=30</code> — 서버가 30초 동안 대답이 없으면 <code>TimeoutError</code> 로 멈춰요. 빼면 한없이 기다릴 수 있어요</li><li>로그인이 틀리면 <code>smtplib.SMTPAuthenticationError</code> 예요(2쪽 표)</li><li>받은 메일함을 읽는 쪽은 표준 <code>imaplib</code> 모듈이 있어요. 이 교과서에서는 이름만 알아 둬요</li></ul>
<div class="bk-warn"><b>이 쪽의 코드는 진짜로 보내요</b> — 그래서 실행 예제 없이 글로만 두었어요. 처음에는 꼭 <code>To</code> 를 <b>내 주소</b>로 두고, 받은편지함(스팸함 아님)에 오는지 본 다음에 남에게 보내요. 시험은 4쪽의 가짜 서버로 해요.</div>` },
    { title: "smtp.gmail.com · 네이버 앱 비밀번호", html: `<p>SMTP 서버에 로그인할 때는 평소 비밀번호 대신 [[앱 비밀번호]]를 써요. 메일 서비스가 프로그램용으로 따로 만들어 주는 비밀번호예요. 새어 나가도 그것만 지우면 되고, 내 진짜 비밀번호는 프로그램에 한 번도 들어가지 않아요.</p>
<p><b>Gmail</b> — 앱 비밀번호만 만들면 돼요. SMTP 는 따로 켤 것이 없어요.</p>
<ol><li><b>2단계 인증 켜기</b>: 브라우저에서 Google 오른쪽 위 내 사진 → 「Google 계정 관리」 → 왼쪽 메뉴 「보안」 → 「Google에 로그인하는 방법」 칸의 「2단계 인증」 → 안내대로 휴대전화를 등록하고 켜요. 앱 비밀번호는 2단계 인증을 켠 계정에만 나와요</li><li><b>앱 비밀번호 화면 찾기</b>: 「Google 계정 관리」 화면 맨 위의 검색 칸(「Google 계정 검색」)에 <code>앱 비밀번호</code> 를 쳐서 「앱 비밀번호」 화면으로 가요</li><li><b>만들기</b>: 「앱 이름」 칸에 <code>햇살 공방 파이썬</code> 처럼 알아볼 이름을 쓰고 「만들기」</li><li><b>복사</b>: 창에 뜬 16글자(4글자씩 네 묶음)를 바로 복사해 두고 「완료」. 이 창을 닫으면 다시 볼 수 없어요. 잃어버리면 같은 화면에서 지우고 새로 만들어요</li></ol>
<p>검색해도 「앱 비밀번호」 가 안 나오면 2단계 인증이 꺼져 있거나, 회사 · 학교 계정(Google Workspace)이라 관리자가 막아 둔 거예요.</p>
<p><b>네이버</b> — SMTP 를 켜고, 2단계 인증을 쓰면 앱 비밀번호도 만들어요.</p>
<ol><li><b>SMTP 켜기</b>: 네이버 메일(mail.naver.com) 왼쪽 아래 「환경설정」 → 위쪽 「POP3/IMAP 설정」 → 「IMAP/SMTP 설정」 탭 → 「IMAP/SMTP 사용」 칸을 「사용함」 → 맨 아래 「저장」. 같은 화면 아래에 SMTP 서버 <code>smtp.naver.com</code> 과 포트 <code>465</code> 가 적혀 있어요</li><li><b>앱 비밀번호</b>: 네이버 첫 화면의 내 이름 → 「네이버 내정보」 → 「보안설정」 → 「2단계 인증」 의 「관리」 → 아래쪽 「애플리케이션 비밀번호 관리」 → 종류 칸에서 「직접 입력」, 이름 칸에 <code>파이썬</code> → 「생성하기」 → 나온 비밀번호를 복사해요</li><li>2단계 인증을 안 켰다면 네이버 로그인 비밀번호로도 들어가져요. 하지만 그러면 진짜 비밀번호가 프로그램에 들어가니, 2단계 인증 + 앱 비밀번호를 권해요</li><li>login 아이디는 네이버 아이디(<code>@naver.com</code> 앞부분)예요</li></ol>
<p>메뉴 이름과 자리는 서비스가 화면을 고치면서 바뀔 수 있어요(2026년 11월 기준). 안 보이면 계정 설정 화면의 검색 칸에 「앱 비밀번호」 · 「SMTP」 를 쳐 보세요.</p>
<p>설정이 틀리면 트레이스백 마지막 줄이 이렇게 나와요.</p>
<table class="kb"><tbody><tr><th>마지막 줄</th><th>까닭 · 고칠 곳</th></tr><tr><td><code>smtplib.SMTPAuthenticationError: (535, …)</code></td><td>아이디 · 앱 비밀번호가 틀림, 2단계 인증이나 네이버 「IMAP/SMTP 사용」 이 꺼짐</td></tr><tr><td><code>socket.gaierror: [Errno 11001] getaddrinfo failed</code></td><td>서버 이름 철자(<code>smtp.gmial.com</code>) · 인터넷 연결</td></tr><tr><td><code>ssl.SSLError: [SSL: WRONG_VERSION_NUMBER] …</code></td><td>587 에 <code>SMTP_SSL</code> 을 씀 — 465 로 바꾸거나 <code>SMTP</code> + <code>starttls()</code></td></tr><tr><td><code>TimeoutError: timed out</code></td><td>회사 · 학교 · 카페 네트워크가 465 · 587 을 막음, 또는 465 에 <code>SMTP</code> 를 씀</td></tr></tbody></table>` },
    { title: "os.environ.get(…) · getpass() 비밀번호", html: `<p>앱 비밀번호도 비밀번호예요. <b>코드에 적지 않아요</b>. .py 파일은 남에게 보내고 GitHub 에 올리는 파일이니까요(복습: <a href="../python/#lesson/L28" target="_blank" rel="noopener">파이썬 교과서 「환경 변수와 다른 프로그램: os · subprocess」 ↗</a>). 코드 밖에서 받는 길이 둘이에요.</p>
<table class="kb"><tbody><tr><th>방법</th><th>코드</th><th>언제</th></tr><tr><td>환경 변수</td><td><code>os.environ.get("MAIL_PASSWORD")</code></td><td>터미널에서 <code>$env:MAIL_PASSWORD="…"</code> 로 정해 두고 여러 번 돌릴 때. 그 터미널 창에서만 살아요</td></tr><tr><td>물어보기</td><td><code>getpass("앱 비밀번호: ")</code></td><td>그때그때 쳐 넣을 때. <code>input()</code> 처럼 받지만 <b>치는 글자가 화면에 안 보여요</b></td></tr></tbody></table>
<pre>from getpass import getpass

pw = getpass("앱 비밀번호(화면에 안 보여요): ")</pre>
<p><code>getpass</code> 는 표준 모듈 <code>getpass</code> 의 함수예요. VS Code 아래 터미널에서 돌리면 커서만 깜빡이고 아무것도 안 찍혀요. 그래도 들어가고 있어요. 다 치고 Enter 를 눌러요.</p>
<ul><li>둘을 합쳐 「환경 변수에 있으면 그것, 없으면 물어보기」 로 쓰면 편해요. 아래 예제의 <code>get_password</code> 예요</li><li>묻는 함수 <code>ask</code> 를 인자로 받으니, 시험할 때는 가짜 함수를 넘겨요. 4쪽의 가짜 서버와 같은 생각이에요</li><li>Gmail 앱 비밀번호의 빈칸(4글자씩 띄운 것)은 <code>.replace(" ", "")</code> 로 빼고 써요</li><li>비밀번호는 <code>print</code> 로도, 로그 파일([[레슨:J12]])에도 찍지 않아요. 확인이 필요하면 앞 몇 글자와 길이만</li><li>예약해서 혼자 도는 스크립트([[레슨:J13]])는 물어볼 사람이 없어서 환경 변수만 써요</li><li>비밀번호를 <code>.env</code> 파일에 두는 방법은 <a href="../api/#lesson/H7" target="_blank" rel="noopener">HTTP·API·SDK 교과서 「인증: API 키와 토큰」 ↗</a> 에 있어요</li></ul>
<div class="bk-warn"><b>코드에 적어 올렸다면</b> — 지워도 Git 기록에 남아요. 그 앱 비밀번호를 2쪽의 같은 화면에서 바로 지우고 새로 만들어요. 앱 비밀번호만 지우면 되는 게 앱 비밀번호의 좋은 점이에요.</div>`,
      example: { code: `import os
from getpass import getpass


def get_password(name="MAIL_PASSWORD", ask=getpass):
    """환경 변수에 있으면 그것을, 없으면 물어봐요. 앱 비밀번호의 빈칸은 빼요."""
    pw = os.environ.get(name)
    if pw:
        print(name, "환경 변수에서 읽었어요")
    else:
        pw = ask("메일 앱 비밀번호(화면에 안 보여요): ")
    return pw.replace(" ", "")


# ① 환경 변수가 있을 때 — 터미널에서 정한 것처럼 흉내(진짜 비밀번호는 여기 적지 않아요)
os.environ["MAIL_PASSWORD"] = "abcd efgh ijkl mnop"
pw = get_password()
print("앞 네 글자만:", pw[:4] + "…", "· 길이", len(pw))

# ② 없을 때 — getpass 대신 가짜 ask 를 넘겨 시험
del os.environ["MAIL_PASSWORD"]


def fake_ask(prompt):
    print("물어봄 →", prompt)
    return "wxyz 1234 wxyz 1234"


pw = get_password(ask=fake_ask)
print("앞 네 글자만:", pw[:4] + "…", "· 길이", len(pw))` } },
    { title: "deliver(msg, server) — 가짜 서버로 시험", html: `<p>진짜 서버로 시험하면 시험할 때마다 메일이 나가요. 그래서 <b>보내는 부분을 함수로 떼고, 서버를 인자로 받아요</b>. 함수는 받은 서버가 진짜인지 몰라요. <code>send_message</code> 만 있으면 돼요. 시험할 때는 기록만 하는 가짜 서버를 넘겨요(가짜 객체: <a href="../debug/#lesson/D10" target="_blank" rel="noopener">디버깅·테스트 교과서 「예외 · 가짜 객체 테스트」 ↗</a>).</p>
<pre>def deliver(msg, server=None, outbox=None):
    if server is None:                       # 미리 보기 — 파일로만
        addr = parseaddr(msg["To"])[1]
        (outbox / f"{addr}.eml").write_bytes(msg.as_bytes())
        return "저장"
    server.send_message(msg)                 # 진짜든 가짜든 똑같이
    return "보냄"</pre>
<table class="kb"><tbody><tr><th>단계</th><th>넘기는 것</th><th>확인</th></tr><tr><td>① 미리 보기</td><td><code>server=None</code>, <code>outbox=폴더</code></td><td><code>outbox/</code> 의 <code>.eml</code> 을 다시 읽어 찍고, 메일 앱으로 열어 봐요([[레슨:J9]])</td></tr><tr><td>② 시험</td><td>가짜 서버 <code>FakeSMTP()</code></td><td><code>server.sent</code> 에 (받는 사람, 제목)이 쌓여요</td></tr><tr><td>③ 나에게 한 통</td><td>진짜 서버, <code>To</code> = 내 주소</td><td>받은편지함에서 눈으로</td></tr><tr><td>④ 모두에게</td><td>진짜 서버</td><td>5쪽의 <code>sent.csv</code></td></tr></tbody></table>
<p>가짜 서버는 직접 만들 수 있어요. <code>send_message</code> 가 메일을 받아 리스트에 적기만 하면 끝이에요. 연습 재료의 <code>FakeSMTP</code> 는 여기에 <code>login</code> · <code>quit</code> · <code>with</code> 와 <code>fail=(주소들)</code>(그 주소면 일부러 <code>OSError</code>)을 더한 거예요. 진짜로 보낼 때는 같은 <code>deliver</code> 에 진짜 서버를 넘겨요.</p>
<pre>with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as server:
    server.login(ME, get_password())
    deliver(msg, server)</pre>
<p><code>parseaddr</code> 는 <code>"김하늘 &lt;sky@example.com&gt;"</code> 을 <code>("김하늘", "sky@example.com")</code> 으로 나눠요([[레슨:J9]]). 미리 보기 파일 이름에 주소만 써요.</p>`,
      example: { code: `import tempfile
from email import policy
from email.message import EmailMessage
from email.parser import BytesParser
from email.utils import formataddr, parseaddr
from pathlib import Path

from samples import FakeSMTP


def make_mail(name, addr):
    msg = EmailMessage()
    msg["From"] = formataddr(("햇살 공방", "hello@example.com"))
    msg["To"] = formataddr((name, addr))
    msg["Subject"] = f"{name}님, 11월 수업 안내예요"
    msg.set_content(f"{name}님, 안녕하세요.\\n11월 수업은 매주 토요일 10시예요.")
    return msg


def deliver(msg, server=None, outbox=None):
    """server 를 받으면 보내고, None 이면 outbox 폴더에 .eml 로만 저장(미리 보기)."""
    if server is None:
        addr = parseaddr(msg["To"])[1]
        path = outbox / f"{addr}.eml"
        path.write_bytes(msg.as_bytes())
        return "저장"
    server.send_message(msg)
    return "보냄"


class MySMTP:
    """직접 만든 가짜 서버 — send_message 만 있으면 deliver 가 쓸 수 있어요."""

    def __init__(self):
        self.sent = []

    def send_message(self, msg):
        self.sent.append((msg["To"], msg["Subject"]))


msg = make_mail("김하늘", "sky@example.com")

# ① 미리 보기: 서버 없이 outbox/ 에 저장하고 다시 읽기
with tempfile.TemporaryDirectory() as tmp:
    outbox = Path(tmp) / "outbox"
    outbox.mkdir()
    print(deliver(msg, outbox=outbox))
    for p in sorted(outbox.iterdir()):
        with open(p, "rb") as f:
            back = BytesParser(policy=policy.default).parse(f)
        print(" ", p.name, "|", back["Subject"])

# ② 내가 만든 가짜 서버
mine = MySMTP()
print(deliver(msg, mine), mine.sent)

# ③ samples.py 의 FakeSMTP — with · login 까지 진짜 smtplib 처럼
with FakeSMTP() as server:
    server.login("hello@example.com", "가짜 비밀번호")
    print(deliver(msg, server), server.user, server.sent)`, prep: [SAMPLES_PREP] } },
    { title: "한 명씩 · time.sleep · 실패 기록 · sent.csv", html: `<p>명단의 여러 사람에게 보낼 때 규칙은 넷이에요.</p>
<ol><li><b>한 명에 한 통</b> — <code>To</code> 에 여러 주소를 넣으면 받는 사람끼리 서로 주소가 보여요(개인정보). 이름이 들어간 안내는 사람마다 한 통씩 만들어 보내요</li><li><b>사이에 쉬기</b> — 한꺼번에 몰아 보내면 스팸으로 의심받아 막힐 수 있어요. 한 통 보내고 <code>time.sleep(delay)</code>(복습: <a href="../python/#lesson/L26" target="_blank" rel="noopener">파이썬 교과서 「시간 재기: time」 ↗</a>). <code>delay</code> 를 인자로 두면 시험에서는 <code>0</code> 을 넘겨 바로 끝나요</li><li><b>실패는 적어 두고 계속</b> — 한 사람 주소가 틀렸다고 나머지가 못 받으면 안 돼요. <code>smtplib</code> 의 에러도, 연결 에러(<code>TimeoutError</code> · <code>socket.gaierror</code>)도 모두 <code>OSError</code> 의 갈래라서 <code>except OSError as e:</code> 하나로 잡혀요. <code>type(e).__name__</code> 은 그 에러의 종류 이름(<code>SMTPAuthenticationError</code> 같은 것)이에요</li><li><b><code>sent.csv</code> 로 두 번 안 보내기</b> — 보낸 <b>바로 그때</b> 한 줄씩 더해요(<code>"a"</code> 모드). 다시 돌리면 거기 있는 주소는 건너뛰니, 실패한 사람에게만 다시 가요. 중간에 프로그램이 멈춰도 보낸 데까지는 남아요</li></ol>
<pre>for name, addr in people:
    if addr in done:
        continue                       # 이미 보냄
    try:
        server.send_message(make_mail(name, addr))
    except OSError as e:
        failed.append(addr)            # 적어 두고
        continue                       # 다음 사람
    mark_sent(sent_path, addr, …)      # 보낸 다음에 기록
    done.add(addr)
    time.sleep(delay)</pre>
<p><code>mark_sent</code> 는 <b>보낸 다음에</b> 불러요. 보내기 전에 적으면, 실패한 사람도 「보냄」 으로 남아 영영 못 받아요.</p>
<div class="bk-warn"><b>보내기 전에 꼭</b> — ① 받는 사람이 받기로 한 안내만 보내요. 광고 메일은 미리 동의를 받아야 하고 제목 앞에 <code>(광고)</code> 를 붙여야 해요. ② 메일 서비스마다 하루에 보낼 수 있는 수가 정해져 있어요. 넘기면 계정이 한동안 막혀요. 많으면 며칠에 나눠요. ③ 명단 · <code>sent.csv</code> · <code>outbox/</code> 는 개인정보예요. 공유 폴더나 GitHub 에 올리지 않아요.</div>`,
      example: { code: `import csv
import tempfile
import time
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

from samples import FakeSMTP

PEOPLE = [("김하늘", "sky@example.com"), ("이도윤", "doyun@example.com"),
          ("최유나", "yuna@example.com"), ("정민지", "minji@example.com")]


def make_mail(name, addr):
    msg = EmailMessage()
    msg["From"] = formataddr(("햇살 공방", "hello@example.com"))
    msg["To"] = formataddr((name, addr))
    msg["Subject"] = f"{name}님, 11월 수업 안내예요"
    msg.set_content(f"{name}님, 안녕하세요.\\n11월 수업은 매주 토요일 10시예요.")
    return msg


def load_sent(path):
    """sent.csv 에 적힌 주소들(없으면 빈 set)."""
    done = set()
    if path.exists():
        with open(path, encoding="utf-8-sig", newline="") as f:
            for row in csv.DictReader(f):
                done.add(row["이메일"])
    return done


def mark_sent(path, addr, subject):
    """보낸 즉시 한 줄 더하기 — 중간에 멈춰도 여기까지는 남아요."""
    new = not path.exists()
    with open(path, "a", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["이메일", "제목"])
        w.writerow([addr, subject])


def send_batch(server, people, sent_path, delay=1.0):
    done = load_sent(sent_path)
    sent, failed, skipped = [], [], []
    for name, addr in people:
        if addr in done:
            skipped.append(addr)
            continue
        msg = make_mail(name, addr)
        try:
            server.send_message(msg)
        except OSError as e:          # smtplib 의 에러도 모두 OSError 갈래
            failed.append(addr)
            print("  실패 —", type(e).__name__, e)
            continue                  # 멈추지 않고 다음 사람
        mark_sent(sent_path, addr, msg["Subject"])
        done.add(addr)                # 명단에 같은 주소가 또 있어도 한 번만
        sent.append(addr)
        time.sleep(delay)             # 한 통 보내고 잠깐 쉬기
    print(f"  보냄 {len(sent)} · 실패 {len(failed)} · 건너뜀 {len(skipped)}")
    return failed


with tempfile.TemporaryDirectory() as tmp:
    sent_path = Path(tmp) / "sent.csv"
    print("첫 번째 실행")
    with FakeSMTP(fail=["yuna@example.com"]) as server:
        send_batch(server, PEOPLE, sent_path, delay=0)
    print("두 번째 실행(같은 명령 그대로)")
    with FakeSMTP() as server:
        send_batch(server, PEOPLE, sent_path, delay=0)
        print("  이번에 간 메일:", server.sent)
    print(sent_path.read_text(encoding="utf-8-sig"), end="")`, prep: [SAMPLES_PREP] } },
  ],
  summary: ["진짜 발송은 smtplib.SMTP_SSL(host, 465) 또는 SMTP(host, 587) + starttls() 에 login(아이디, 앱 비밀번호) → send_message(msg) — Gmail 은 2단계 인증 뒤 앱 비밀번호, 네이버는 환경설정에서 IMAP/SMTP 사용함","비밀번호는 코드 밖에 — os.environ.get(\"MAIL_PASSWORD\") 로 읽고 없으면 getpass() 로 물어보며, 찍지도 올리지도 않아요","보내는 함수는 서버를 인자로 받아 가짜 서버로 시험하고, 여러 명은 한 통씩 · sleep · 실패는 적고 계속 · 보낸 다음 sent.csv 에 적어 두 번 안 보내요"] },
{ id: 'JB3', ch: 3, boss: true, title: '만들어 보기: 수료증 · 안내 메일 발송기', mode: 'text',
  tutorSummary: "만들어 보기: ROSTER_CSV 명단 → ① 명단 검사(빈 이메일 · 모양 · 겹침, 먼저 알리고 건너뛰기 또는 strict 면 멈춤) ② 사람마다 수료증 워드(틀의 쪼개진 ${이름} run 만 이어 붙여 KTemplate 로 채우기 — 굵게 유지, 남은 ${…} 검사) + reportlab PDF 판 ③ 사람마다 EmailMessage(본문 · 제목은 KTemplate, 수료증 PDF 첨부) ④ 미리 보기: outbox/ 에 .eml, 다시 읽어 받는 사람 · 첨부 이름 · 첨부 바이트 비교 ⑤ --send 는 서버를 인자로 받아 FakeSMTP 로 보내고 sent.csv 기록, 다시 돌리면 이미 보낸 사람 건너뜀, 실패 있으면 끝 코드 1 ⑥ 진짜 SMTP 로 --send --to-me 나에게 한 통(☐).", pages: [], summary: [] },
{ id: 'J11', ch: 4, n: 11, title: '맛보기: 클립보드 · 키보드 · 마우스', mode: 'text',
  tutorSummary: '화면 자동화 맛보기. 먼저 파일 · API 길(엑셀은 files 코스 openpyxl, 웹은 api 코스 requests, 메일 J10, PDF · 워드 J5 · J6)을 찾고, 화면 자동화(클립보드 · 키보드 · 마우스)는 그 길이 없는 옛 프로그램에만 — 해상도 · 배율 · 창 위치 · 알림 창 · 한글 입력기 · 느린 PC 에 따라 깨지니 짧게, 사람이 지켜볼 때만, 예약 스크립트(J12)에는 넣지 않는다. pyperclip · pyautogui 는 이 레슨에서만 쓰는 선택 설치(python -m pip install pyperclip pyautogui), 화면 있는 PC 에서만 돈다. 클립보드: 표준 tkinter 는 root = tk.Tk(); root.withdraw(); root.clipboard_get()(비었거나 그림이면 tk.TclError) · clipboard_clear() + clipboard_append(text) + root.update() 뒤 destroy, pyperclip 은 paste() · copy(text). 프로그램 모양은 읽기 → 정리 함수(글자 → 글자, 따로 시험) → 쓰기. 엑셀 · 웹 표를 복사한 글자는 칸 사이 \\t · 줄 끝 \\r\\n · 숫자는 보이는 모양 그대로 글자("125,000") · 따옴표/줄바꿈 든 칸은 "…" 로 감쌈 → text.splitlines()(\\r\\n · \\n 다 줄 끝, 끝에 빈 줄 안 만듦) → csv.reader(lines, delimiter="\\t")(감싼 칸도 풂, split("\\t") 은 따옴표가 남음), 칸은 strip, "".join(cells) 가 빈 글자인 줄은 버림, csv.writer(f).writerows(rows) 로 utf-8-sig · newline="" 저장. 칸 안 줄바꿈(Alt+Enter)은 splitlines 가 끊어서 줄바꿈이 빠짐 → 그런 표는 엑셀에서 csv 로 저장. 전화번호: d = re.sub(r"\\D", "", s)(\\D = 숫자가 아닌 글자) → 82 로 시작하면 "0" + d[2:] → 02 로 시작하고 9 · 10자리면 d[:2]-d[2:-4]-d[-4:], 0 으로 시작하고 10 · 11자리면 d[:3]-d[3:-4]-d[-4:], 그 밖은 None(억지로 맞추지 말고 사람이 보게), int 로 바꾸면 앞 0 이 사라짐. pyautogui: FAILSAFE = True(기본, 마우스를 화면 모서리로 → 다음 동작에서 FailSafeException) · PAUSE = 0.5 · size() · position() · moveTo(x, y, duration=) · click() · write("abc")(한글 ✗) · press("enter") · hotkey("ctrl", "v") — 한글은 pyperclip.copy 후 붙여 넣기. 결과 열어 주기: webbrowser.open(주소) · os.startfile(경로)(Windows 만, Mac open · 리눅스 xdg-open 은 subprocess). 브라우저 자동화 Playwright · Selenium 은 이름만.',
  terms: { '화면 자동화': '사람 대신 프로그램이 마우스를 움직이고 키를 눌러 다른 프로그램을 다루게 하는 것. 파일 · API 길이 없을 때 쓰는 마지막 수단이에요', '클립보드': 'Ctrl+C 로 복사한 것이 잠깐 머무는 곳. Ctrl+V 로 붙여 넣어요. 모든 프로그램이 같이 써요' },
  pages: [
    { title: 'pip install pyperclip pyautogui · 언제 피하나', html: `<p>지금까지는 파일(폴더 · zip · PDF · 워드 · 메일)을 <b>직접</b> 만들고 읽었어요. 이번 레슨은 그 길이 없을 때 쓰는 <b>사람 손 흉내</b>를 맛만 봐요: 클립보드(복사 · 붙여 넣기) · 키보드 · 마우스.</p>
<p>먼저 물어요. 「파일이나 API 로 할 수 있나?」 대부분은 돼요.</p>
<table class="kb"><tbody><tr><th>하려는 일</th><th>먼저 볼 길</th></tr>
<tr><td>엑셀 값 읽기 · 쓰기</td><td>파일을 직접 — <a href="../files/#lesson/F7" target="_blank" rel="noopener">데이터 파일 다루기 교과서 「엑셀 읽기: 통합 문서 · 시트 · 셀」 ↗</a></td></tr>
<tr><td>웹 서비스의 자료 받기 · 올리기</td><td>그 서비스의 API — <a href="../api/#lesson/H5" target="_blank" rel="noopener">HTTP·API·SDK 교과서 「requests 기본기」 ↗</a></td></tr>
<tr><td>메일 보내기</td><td>[[레슨:J10]] 의 <code>smtplib</code></td></tr>
<tr><td>PDF · 워드 만들기</td><td>[[레슨:J5]] · [[레슨:J6]]</td></tr>
<tr><td>파일 · API 가 없는 옛 프로그램에 값 넣기</td><td>그때 처음으로 [[화면 자동화]]</td></tr></tbody></table>
<p>화면 자동화는 <b>마지막 수단</b>이에요. 잘 깨지거든요.</p>
<ul><li>화면 해상도 · 배율(125% · 150%)이 바뀌면 누를 좌표가 틀려요</li><li>창 위치 · 크기가 달라지거나 알림 창 · 업데이트 창이 앞에 뜨면 엉뚱한 곳을 눌러요</li><li>한글 입력기가 한 · 영 어느 쪽인지에 따라 친 글자가 달라져요</li><li>PC 가 느리면 창이 뜨기 전에 키부터 눌러요</li><li>도는 동안 사람은 마우스 · 키보드를 못 써요. 화면이 잠기면 멈춰요</li></ul>
<p>그래서 이 레슨의 방법은 <b>짧게, 내가 지켜볼 때만</b> 써요. 사람 없이 혼자 도는 스크립트([[레슨:J12]])에는 넣지 않아요.</p>
<div class="bk-warn"><b>선택 설치 — 이 레슨에서만</b> — <code>pyperclip</code>(클립보드) · <code>pyautogui</code>(키보드 · 마우스)는 이 레슨에서만 써요. 다른 레슨과 만들어 보기에는 필요 없어서 시작하기의 패키지 넷에 넣지 않았어요. 해 보고 싶으면 가상 환경에서 아래 명령으로 깔아요. 둘 다 화면이 있는 내 PC 에서만 돌아요.</div>`,
      example: { label: '예제 명령 — VS Code 터미널에서(선택 설치, 이 레슨에서만)', shell: `python -m pip install pyperclip pyautogui
python -m pip list` } },
    { title: 'pyperclip.paste() · copy() · tkinter 클립보드', html: `<p>[[클립보드]]는 Ctrl+C 로 복사한 것이 잠깐 머무는 곳이에요. 파이썬에서 읽고 쓰는 길이 둘 있어요.</p>
<p><b>① 표준 tkinter</b> — 따로 깔지 않아도 돼요(창 만들기는 <a href="../python/#lesson/X14" target="_blank" rel="noopener">파이썬 교과서 「실전 14: tkinter 계산기」 ↗</a>). 창이 하나 있어야 해서, 숨긴 창을 만들어 쓰고 바로 닫아요.</p>
<pre>import tkinter as tk


def get_clip():
    root = tk.Tk()
    root.withdraw()              # 빈 창이 뜨지 않게 숨기기
    try:
        return root.clipboard_get()
    except tk.TclError:          # 비었거나 글자가 아님(그림 · 파일을 복사했을 때)
        return ""
    finally:
        root.destroy()


def set_clip(text):
    root = tk.Tk()
    root.withdraw()
    root.clipboard_clear()
    root.clipboard_append(text)
    root.update()                # 클립보드에 넘길 틈을 주기
    root.destroy()</pre>
<p><b>② pyperclip</b>(선택 설치) — 두 줄이면 돼요. Windows · Mac · 리눅스에서 같은 코드예요.</p>
<pre>import pyperclip

text = pyperclip.paste()          # 클립보드의 글자(비었으면 빈 글자)
pyperclip.copy(text.upper())      # 클립보드를 이 글자로 바꾸기</pre>
<ul><li>읽은 값은 <b>보통 str</b> 이에요. 엑셀에서 복사했으면 칸 사이에 탭 <code>\\t</code>, 줄 끝에 <code>\\r\\n</code> 이 들어 있어요(다음 쪽)</li><li>tkinter 로 넣은 글자는 프로그램이 끝나면 사라지는 PC(특히 리눅스)도 있어요. 이 점은 pyperclip 이 믿을 만해요</li><li>클립보드는 모든 프로그램이 같이 써요. 내 프로그램이 바꾸면 사람이 복사해 둔 것이 사라지니, 바꿨다고 꼭 알려 주세요</li></ul>
<p>클립보드 프로그램은 늘 이 모양이에요. 읽기 → <b>정리 함수</b> → 쓰기.</p>
<pre>text = pyperclip.paste()
new_text = clean(text)            # ← 이 부분만 떼어 시험해요
pyperclip.copy(new_text)</pre>
<p>클립보드는 시험하기 어렵지만, 가운데 <code>clean</code> 은 글자를 받아 글자를 돌려주는 보통 함수예요. 다음 두 쪽에서 이런 정리 함수를 만들어요.</p>
<div class="bk-warn"><b>이 쪽의 코드는 내 PC 에서만</b> — 클립보드는 화면이 있는 PC 에 붙어 있어요. 화면 없는 서버에서는 <code>TclError</code> 나 <code>PyperclipException</code> 이 나요. 그래서 이 쪽은 돌릴 예제 없이 코드만 보여 줘요. VS Code 에 붙여 직접 돌려 보세요.</div>` },
    { title: 'csv.reader(lines, delimiter="\\t") · 복사한 표', html: `<p>엑셀 · 구글 시트 · 웹 페이지의 표를 골라 Ctrl+C 하면 클립보드에는 이런 글자가 들어가요.</p>
<pre>"거래처\\t청구 번호\\t합계 금액\\r\\n햇살문구\\tINV-2026-1001\\t125,000\\r\\n"</pre>
<ul><li>칸 사이는 탭 <code>\\t</code>, 줄 끝은 <code>\\r\\n</code>(Windows), 마지막 줄 뒤에도 줄바꿈이 붙어요</li><li>숫자 · 날짜는 <b>화면에 보이는 모양 그대로의 글자</b>예요 — <code>"125,000"</code> · <code>"2026-10-05"</code>. 계산하려면 <code>int(s.replace(",", ""))</code></li><li>칸 안에 따옴표 · 줄바꿈이 있으면 그 칸은 <code>"…"</code> 로 감싸여요</li></ul>
<p>먼저 <code>text.splitlines()</code> 로 줄마다 나눠요. <code>split("\\n")</code> 과 달리 <code>\\r\\n</code> · <code>\\n</code> 을 다 줄 끝으로 보고, 맨 끝 줄바꿈 뒤에 빈 줄을 하나 더 만들지 않아요. 나눈 줄 리스트는 복습: <a href="../python/#lesson/L29" target="_blank" rel="noopener">파이썬 교과서 「csv 모듈 제대로」 ↗</a> 의 <code>csv.reader(f, delimiter="\\t")</code> 에 파일 대신 그대로 넣어요. <code>csv.reader</code> 는 줄 리스트도 받고, <code>"…"</code> 로 감싼 칸도 풀어 줘요.</p>
<ul><li>빈 줄 · 탭만 있는 줄도 따라와요. 칸을 다 이어 붙인 <code>"".join(cells)</code> 가 빈 글자면 버려요</li><li>복사하다 칸 앞뒤에 빈칸이 붙기 쉬워요. <code>c.strip()</code></li><li>정리한 줄은 <code>csv.writer(f).writerows(rows)</code> 로 저장해요. 엑셀에서 열 파일이니 <code>encoding="utf-8-sig"</code> · <code>newline=""</code>(L29)</li></ul>
<div class="bk-warn"><b>split("\\t") 만으로는 모자라요</b> — 감싼 칸 <code>"주차 가능, 2층"</code> 의 따옴표가 그대로 남아요. 또 엑셀 칸 안의 줄바꿈(Alt+Enter)은 <code>splitlines()</code> 가 먼저 끊어 버려서, 칸은 하나로 다시 붙지만 줄바꿈이 빠져요(<code>"두 줄메모"</code>). 그런 칸이 많은 표는 엑셀에서 csv 로 저장해 파일로 읽는 게 나아요.</div>`,
      example: { code: `import csv
import tempfile
from pathlib import Path

# 엑셀에서 표를 골라 Ctrl+C 하면 클립보드에 이런 글자가 들어가요(pyperclip.paste() 가 돌려주는 값)
CLIP = "거래처\\t청구 번호\\t합계 금액\\r\\n햇살문구\\tINV-2026-1001\\t125,000\\r\\n바다인쇄 \\tINV-2026-1002\\t342,000\\r\\n\\r\\n숲속목재\\tINV-2026-1003\\t1,280,000\\r\\n"


def clip_rows(text):
    """복사한 표 글자 → 줄마다 칸 리스트(빈 줄은 빼고, 칸 앞뒤 빈칸은 지우고)"""
    lines = text.splitlines()
    rows = []
    for row in csv.reader(lines, delimiter="\\t"):
        cells = [c.strip() for c in row]
        if "".join(cells):            # 칸을 다 이어도 빈 글자면 빈 줄
            rows.append(cells)
    return rows


print(CLIP.splitlines()[:2])
rows = clip_rows(CLIP)
for r in rows:
    print(r)

with tempfile.TemporaryDirectory() as tmp:
    out = Path(tmp) / "청구_목록.csv"
    with open(out, "w", encoding="utf-8-sig", newline="") as f:
        csv.writer(f).writerows(rows)

    with open(out, encoding="utf-8-sig", newline="") as f:
        back = list(csv.DictReader(f))
    total = 0
    for r in back:
        total += int(r["합계 금액"].replace(",", ""))
    print(out.name, len(back), "줄, 합계", f"{total:,}원")` } },
    { title: 're.sub(r"\\D", "", s) · 전화번호 모양', html: `<p>여러 곳에서 복사해 온 전화번호는 모양이 제각각이에요: <code>010.1234.5678</code> · <code>010 9876 5432</code> · <code>(02) 345-6789</code> · <code>+82 10-5555-0123</code>. 받아 쓸 곳(문자 발송 · 명단)은 한 모양 <code>010-1234-5678</code> 을 바라요. 두 단계로 맞춰요.</p>
<ol><li><b>숫자만 남기기</b> — <code>re.sub(r"\\D", "", s)</code>. <code>\\d</code> 가 숫자 한 글자였죠(복습: <a href="../python/#lesson/L20B" target="_blank" rel="noopener">파이썬 교과서 「정규식 2: 찾아 꺼내기 · 줄 처음과 끝」 ↗</a>). 대문자 <code>\\D</code> 는 그 반대, <b>숫자가 아닌</b> 한 글자예요. 그걸 빈 글자로 바꾸니 숫자만 남아요</li><li><b>앞자리와 길이로 다시 끊기</b> — 서울 <code>02</code> 는 두 자리 + 3~4자리 + 4자리, 나머지(<code>010</code> · <code>031</code> · <code>051</code> …)는 세 자리 + 3~4자리 + 4자리예요. 끝 네 자리는 늘 <code>d[-4:]</code>, 가운데는 <code>d[2:-4]</code> · <code>d[3:-4]</code></li></ol>
<table class="kb"><tbody><tr><th>복사해 온 글자</th><th>숫자만</th><th>맞춘 모양</th></tr>
<tr><td><code>010.1234.5678</code></td><td><code>01012345678</code></td><td><code>010-1234-5678</code></td></tr>
<tr><td><code>(02) 345-6789</code></td><td><code>023456789</code></td><td><code>02-345-6789</code></td></tr>
<tr><td><code>+82 10-5555-0123</code></td><td><code>821055550123</code> → 앞 <code>82</code> 를 <code>0</code> 으로</td><td><code>010-5555-0123</code></td></tr>
<tr><td><code>1234-5678</code></td><td><code>12345678</code></td><td><code>None</code> — 모르는 모양</td></tr></tbody></table>
<ul><li><b>모르는 모양은 고치지 말고 <code>None</code></b> — 자릿수가 모자란 번호를 억지로 맞추면 틀린 번호가 돼요. 그런 줄은 그대로 두고 「사람이 볼 것」 으로 따로 알려요. 판단은 사람 몫이에요([[레슨:J0]])</li><li>전화번호를 <code>int</code> 로 바꾸지 마세요. 앞의 0 이 사라져요</li><li>이 함수도 글자 → 글자라서, 클립보드 없이 여러 모양을 넣어 시험할 수 있어요</li></ul>`,
      example: { code: `import re


def fix_phone(s):
    """여러 모양의 전화번호 → 010-1234-5678 모양. 모르는 모양이면 None"""
    d = re.sub(r"\\D", "", s)          # 숫자가 아닌 것을 모두 지우기
    if d.startswith("82"):            # +82 10 … (나라 번호) → 010 …
        d = "0" + d[2:]
    if d.startswith("02") and len(d) in (9, 10):     # 서울 02
        return d[:2] + "-" + d[2:-4] + "-" + d[-4:]
    if d.startswith("0") and len(d) in (10, 11):     # 010 · 031 · 051 …
        return d[:3] + "-" + d[3:-4] + "-" + d[-4:]
    return None


for s in ["010.1234.5678", "010 9876 5432", "(02) 345-6789", "02-3456-7890",
          "+82 10-5555-0123", "031)123-4567", "01012345678", "1234-5678", "연락처 없음"]:
    print(f"{s:>18} → {fix_phone(s)}")

# 복사한 여러 줄을 한 줄씩 고치고, 모르는 모양은 그대로 두고 따로 알려 주기
text = "김하늘 010.1234.5678\\n이도윤 +82 10 9876 5432\\n박서준 1234-5678\\n"
fixed, unknown = [], []
for line in text.splitlines():
    parts = line.split()
    name = parts[0]
    phone = " ".join(parts[1:])
    new = fix_phone(phone)
    if new is None:
        unknown.append(name)
        fixed.append(line)
    else:
        fixed.append(name + " " + new)
print("\\n".join(fixed))
print("사람이 볼 것:", unknown)` } },
    { title: 'pyautogui.hotkey("ctrl", "v") · os.startfile', html: `<p><code>pyautogui</code>(선택 설치)는 마우스를 움직이고 누르고, 키를 쳐요. 맛만 봐요. 메모장을 하나 열어 두고 돌려 보세요.</p>
<pre>import time

import pyautogui
import pyperclip

pyautogui.FAILSAFE = True      # 기본값 — 마우스를 화면 모서리로 밀면 멈춰요
pyautogui.PAUSE = 0.5          # 동작마다 0.5초 쉬기(창이 따라올 틈)

print(pyautogui.size())        # 화면 크기 — 예: Size(width=1920, height=1080)
print(pyautogui.position())    # 지금 마우스 자리 — 누를 좌표 찾기

print("3초 안에 메모장을 클릭해 두세요")
time.sleep(3)
pyautogui.write("Hello 2026", interval=0.05)   # 영어 · 숫자 · 기호만
pyautogui.press("enter")
pyperclip.copy("햇살 공방 수강생 여러분, 안녕하세요")
pyautogui.hotkey("ctrl", "v")                 # 한글은 클립보드로 붙여 넣기</pre>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr>
<tr><td><code>pyautogui.size()</code> · <code>position()</code></td><td>화면 크기 · 지금 마우스 자리(왼쪽 위가 <code>(0, 0)</code>)</td></tr>
<tr><td><code>moveTo(500, 300, duration=0.5)</code> · <code>click()</code> · <code>click(500, 300)</code></td><td>옮기기 · 누르기</td></tr>
<tr><td><code>write("abc")</code> · <code>press("enter")</code></td><td>글자 치기 · 키 하나</td></tr>
<tr><td><code>hotkey("ctrl", "v")</code></td><td>함께 누르기(Mac 은 <code>"command"</code>)</td></tr></tbody></table>
<div class="bk-warn"><b>비상 정지 FAILSAFE 를 끄지 마세요</b> — 프로그램이 엉뚱하게 움직이면 마우스를 화면 모서리(보통 왼쪽 위)로 세게 밀어요. 다음 동작을 하려는 순간 <code>pyautogui.FailSafeException</code> 으로 멈춰요. 터미널에서 Ctrl+C 도 돼요. <code>FAILSAFE = False</code> 로 끄면 멈출 길이 없어져요.</div>
<p><b>한글은 <code>write</code> 로 못 쳐요.</b> <code>write</code> 는 키를 하나씩 누르는 흉내라서, 키보드에 없는 한글은 빠지거나 입력기 상태에 따라 영어로 쳐져요. 한글은 클립보드에 넣고 <code>hotkey("ctrl", "v")</code> 로 붙여 넣어요.</p>
<p><b>다 만든 파일 · 페이지 열어 주기</b> — 결과를 사람에게 바로 보여 줄 땐 키보드 흉내보다 이쪽이 훨씬 튼튼해요.</p>
<pre>import os
import webbrowser

webbrowser.open("https://docs.python.org/ko/3/")   # 기본 브라우저로
os.startfile("청구_정리.docx")     # Windows: 더블 클릭처럼 연결된 프로그램(Word)으로
os.startfile("outbox")             # 폴더면 탐색기로</pre>
<ul><li><code>os.startfile</code> 은 Windows 에만 있어요. Mac 은 <code>subprocess.run(["open", 경로])</code>, 리눅스는 <code>["xdg-open", 경로]</code>(<a href="../python/#lesson/L28" target="_blank" rel="noopener">파이썬 교과서 「환경 변수와 다른 프로그램: os · subprocess」 ↗</a>)</li><li>사람 없이 혼자 도는 스크립트([[레슨:J12]])에서는 열지 마세요. 볼 사람이 없어요</li><li>웹 페이지를 클릭 · 입력으로 다루는 일은 브라우저 자동화 도구 <b>Playwright</b> · <b>Selenium</b> 이 따로 있어요. 이름만 알아 두고, 될 수 있으면 그 서비스의 API 를 먼저 찾아요(<a href="../api/#lesson/H5" target="_blank" rel="noopener">HTTP·API·SDK 교과서 「requests 기본기」 ↗</a>)</li></ul>` },
  ],
  summary: ['화면 자동화는 마지막 수단 — 파일 · API 길을 먼저 찾고, pyperclip · pyautogui 는 이 레슨에서만 쓰는 선택 설치로 내가 지켜볼 때만 써요', '클립보드 프로그램은 읽기(pyperclip.paste) → 정리 함수 → 쓰기(copy) 모양이고, 가운데 정리 함수(복사한 표 \\t → csv.reader · 전화번호 re.sub(r"\\D", "", s))만 떼어 시험해요', 'pyautogui 는 FAILSAFE(마우스를 모서리로 = 비상 정지)를 켜 두고, 한글은 write 대신 클립보드 + hotkey("ctrl", "v") — 결과는 webbrowser.open · os.startfile 로 열어 줘요'] },
{ id: 'J12', ch: 4, n: 12, title: '혼자 돌아가는 스크립트', mode: 'text',
  tutorSummary: '예약으로 사람 없이 돌 스크립트 만들기(등록은 J13). 달라지는 셋: 현재 폴더가 다름(작업 스케줄러 「시작 위치」 를 비우면 C:\\Windows\\System32) → HERE = Path(__file__).parent 기준(L17B), input() 은 대답할 사람이 없음(창이 없으면 에러, stdin 이 비면 EOFError) → 설정 파일로, print · 트레이스백은 아무도 안 봄 → 로그 파일 · 끝 코드. subprocess.run([sys.executable, 스크립트], cwd=폴더, stdin=subprocess.DEVNULL) 로 다른 폴더에서 실행해 확인. 시험하기 쉽게 main(argv=None, base=None, now=None), base = HERE if base is None else Path(base). 설정: config.toml(TOML — key = 값, \'글자\' · "글자", true/false, [묶음] 은 딕셔너리 안 딕셔너리, # 주석), tomllib(3.11+, 읽기만) — load_config(path) 는 read_text(encoding="utf-8-sig")(BOM 도) → tomllib.loads, 파일 없음 · tomllib.TOMLDecodeError 는 내 예외 ConfigError 로. tomllib.load(f) 는 open(path, "rb"). 함정: 큰따옴표 안 \\ 는 탈출 — "C:\\Users\\me" 는 TOMLDecodeError: Invalid hex value (at line 2, column 18), "D:\\new\\temp" 는 에러 없이 줄바꿈 · 탭 → Windows 경로는 작은따옴표 \'C:\\Users\\me\' 또는 슬래시. 없어도 되는 값은 cfg.get("days", 7). 로그: basicConfig(L31) 대신 부품 — log = logging.getLogger(name), log.setLevel(logging.INFO), h = RotatingFileHandler(path, maxBytes=…, backupCount=3, encoding="utf-8")(from logging.handlers, 넘기 전에 .1 · .2 · .3 으로 밀고 더 오래된 건 지움), h.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s")), log.addHandler(h). setup_log 는 먼저 close_log(핸들러 removeHandler + close)로 두 번 달림(줄 중복) 막기, 끝나면 close_log(Windows 는 열린 파일 못 지움). 예제는 시각 없는 LOG_FORMAT. log.exception("…") 은 except 안에서 ERROR + 트레이스백, log.error("%s", e) 는 한 줄. 잠금: open(lock, "x") 는 없을 때만 만들기(있으면 FileExistsError) — exists() 로 묻고 만들면 사이에 끼어듦. take_lock 은 시작 시각 now.isoformat() 을 적음. @contextmanager run_lock(lock, now, stale=timedelta(hours=6)): 이미 있으면 적힌 시각을 fromisoformat(깨졌으면 ValueError → 오래된 것), now - started < stale 이면 AlreadyRunning(내 예외), 아니면 지우고 다시 잡고 지운 글자를 yield(as old), try: yield finally: unlink(missing_ok=True) 로 에러가 나도 풂. now 를 인자로 받아 datetime(2026, 11, 9, 9, 0) 으로 시험. 끝 코드: 작업 스케줄러 「마지막 실행 결과」 0x0 · 0x1, main 이 0 · 1 을 돌려주고 sys.exit(main()) (L19C). 잘 끝남 0, AlreadyRunning 은 WARNING + 0, ConfigError 는 ERROR 한 줄 + 1, 그 밖 Exception 은 맨 바깥 한 곳에서 log.exception + 1, finally 에서 close_log, 실패하면 notify(제목, 본문)으로 나에게 알림(J10 메일), now = datetime.now() if now is None else now.',
  terms: { '예약 실행': '사람이 없을 때 정해진 시각에 프로그램이 저절로 돌게 하는 것. Windows 는 작업 스케줄러, 리눅스 · Mac 은 cron 이 불러 줘요', '돌려 쓰는 로그': '로그 파일이 정한 크기를 넘으면 새 파일로 바꾸고, 옛 파일은 몇 개만 남기고 지우는 방식(rotating log). 로그가 끝없이 커지지 않아요', '핸들러': '로그 줄을 어디로 보낼지 정하는 부품. 파일 · 화면 · 메일 등. 로거에 여러 개를 달 수 있어요', '잠금 파일': '「지금 돌고 있어요」 표시로 만들어 두는 파일. 있으면 두 번째 실행은 건너뛰고, 끝나면 지워요' },
  pages: [
    { title: 'Path(__file__).parent 기준 · input() 금지', html: `<p>[[레슨:J13]] 에서 스크립트를 작업 스케줄러에 걸어 <b>사람 없이</b> 돌릴 거예요. 그 전에 스크립트를 「혼자 돌아도 되는 모양」 으로 고쳐요. VS Code 에서 내가 돌릴 때와 셋이 달라요.</p>
<table class="kb"><tbody><tr><th>VS Code 에서 내가 돌릴 때</th><th>[[예약 실행]]으로 혼자 돌 때</th><th>그래서</th></tr>
<tr><td>현재 폴더 = 공부 폴더</td><td>현재 폴더가 달라요. 작업 스케줄러의 「시작 위치」 를 비우면 <code>C:\\Windows\\System32</code></td><td>파일은 <code>Path(__file__).parent</code> 기준</td></tr>
<tr><td><code>input()</code> 에 내가 대답</td><td>대답할 사람이 없어요. 창이 없으면 에러, 창이 있으면 영영 기다려요</td><td>물어볼 값은 설정 파일로(다음 쪽)</td></tr>
<tr><td>print · 빨간 트레이스백을 내가 봐요</td><td>아무도 안 봐요. 창이 떠도 끝나면 바로 닫혀요</td><td>로그 파일 · 끝 코드(이 레슨 뒤쪽)</td></tr></tbody></table>
<pre>from pathlib import Path

HERE = Path(__file__).parent          # 이 .py 파일이 있는 폴더
config_path = HERE / "config.toml"    # 어디서 실행해도 같은 파일
log_path = HERE / "weekly.log"</pre>
<p>복습: 상대 경로는 .py 파일이 아니라 <b>현재 폴더</b> 기준이에요(<a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩」 ↗</a>). 예제는 스크립트를 임시 폴더에 만들고 <code>subprocess.run</code>(<a href="../python/#lesson/L28" target="_blank" rel="noopener">파이썬 교과서 「환경 변수와 다른 프로그램: os · subprocess」 ↗</a>)으로 <b>다른 폴더에서</b> 실행해 봐요. 처음 보는 인자가 둘 있어요.</p>
<ul><li><code>cwd=폴더</code> — 그 폴더를 현재 폴더로 삼아 실행해요. 작업 스케줄러의 「시작 위치」 칸과 같아요</li><li><code>stdin=subprocess.DEVNULL</code> — 입력을 하나도 주지 않아요. 그러면 <code>input()</code> 은 기다리지 않고 <code>EOFError</code> 를 내요</li></ul>
<div class="bk-warn"><b>시험하기 쉽게 base 인자로</b> — 진짜로 돌 때는 <code>HERE</code> 를 쓰고, 시험할 때는 임시 폴더를 넘기게 <code>main(argv=None, base=None, now=None)</code> 처럼 받아요. 첫 줄은 <code>base = HERE if base is None else Path(base)</code>. 지금 시각 <code>now</code> 도 같은 방식이에요(이 레슨 마지막 쪽).</div>`,
      example: { code: `import subprocess
import sys
import tempfile
from pathlib import Path

# 예약으로 돌 스크립트 흉내 — 상대 경로와 __file__ 기준, 그리고 input()
JOB = '''from pathlib import Path

HERE = Path(__file__).parent
print("현재 폴더:", Path.cwd().name)
print("Path('config.toml') 있나:", Path("config.toml").exists())
print("HERE / 'config.toml' 있나:", (HERE / "config.toml").exists())
try:
    answer = input("계속할까요? ")
except EOFError:
    print("input(): EOFError — 대답할 사람이 없어요")
'''

with tempfile.TemporaryDirectory() as tmp:
    app = Path(tmp) / "auto-study"
    other = Path(tmp) / "System32"       # 작업 스케줄러의 「시작 위치」 를 비우면 여기서 돌아요
    app.mkdir()
    other.mkdir()
    (app / "job.py").write_text(JOB, encoding="utf-8")
    (app / "config.toml").write_text("keep = 7\\n", encoding="utf-8")

    for where in [app, other]:
        r = subprocess.run([sys.executable, str(app / "job.py")], cwd=where,
                           stdin=subprocess.DEVNULL, capture_output=True, text=True)
        print(f"--- {where.name} 에서 실행 (끝 코드 {r.returncode})")
        print(r.stdout.strip())` } },
    { title: 'tomllib.loads · Windows 경로는 \'작은따옴표\'', html: `<p>폴더 경로 · 남길 백업 수 · 받는 사람처럼 <b>바뀔 수 있는 값</b>은 코드에 박지 말고 설정 파일에 둬요. 메모장으로 고치기 쉬운 TOML 형식의 <code>config.toml</code> 을 써요. 파이썬 3.11 부터 표준 <code>tomllib</code> 로 읽어요(읽기만 — 쓰는 기능은 없어요).</p>
<pre># config.toml — 월요일 아침 자동 비서 설정
keep = 7                  # 숫자
send_mail = false         # true · false

[folders]                 # 묶음 — 딕셔너리 안의 딕셔너리
downloads = 'C:\\Users\\me\\Downloads'
documents = 'C:\\Users\\me\\Documents\\공방'

[mail]
to = ["me@example.com"]   # 리스트</pre>
<table class="kb"><tbody><tr><th>TOML</th><th>읽으면</th></tr>
<tr><td><code>keep = 7</code></td><td><code>cfg["keep"]</code> 이 <code>7</code>(int)</td></tr>
<tr><td><code>'글자'</code> · <code>"글자"</code></td><td>str</td></tr>
<tr><td><code>true</code> · <code>false</code></td><td><code>True</code> · <code>False</code></td></tr>
<tr><td><code>["a", "b"]</code></td><td>list</td></tr>
<tr><td><code>[folders]</code> 아래 줄들</td><td><code>cfg["folders"]["downloads"]</code></td></tr>
<tr><td><code># …</code></td><td>주석 — JSON 과 달리 설명을 적어 둘 수 있어요</td></tr></tbody></table>
<pre>class ConfigError(Exception):
    pass


def load_config(path):
    """config.toml → 딕셔너리. 없거나 글이 틀리면 ConfigError"""
    path = Path(path)
    try:
        text = path.read_text(encoding="utf-8-sig")
    except FileNotFoundError:
        raise ConfigError(f"설정 파일이 없어요: {path.name}")
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError as e:
        raise ConfigError(f"{path.name} 의 글이 틀렸어요: {e}")</pre>
<ul><li><code>tomllib.loads(글자)</code> 로 읽어요. 파일을 바로 읽는 <code>tomllib.load(f)</code> 도 있는데, 그땐 <code>open(path, "rb")</code>(바이트로 열기)여야 해요. 이 교과서는 <code>read_text(encoding="utf-8-sig")</code> — 옛 메모장이 파일 앞에 BOM 을 붙여 저장해도 읽혀요(L29)</li><li>파일이 없거나 글이 틀리면 내 예외 <code>ConfigError</code> 로 바꿔 던져요(<a href="../python/#lesson/L15C" target="_blank" rel="noopener">파이썬 교과서 「내 예외 만들기: raise」 ↗</a>). 부르는 쪽은 이 하나만 잡으면 돼요</li><li>없어도 되는 값은 <code>cfg.get("days", 7)</code> 처럼 기본값으로 꺼내요</li></ul>
<div class="bk-warn"><b>Windows 경로는 작은따옴표</b> — TOML 의 큰따옴표 글자는 파이썬처럼 <code>\\</code> 를 탈출 글자로 읽어요. <code>"C:\\Users\\me"</code> 는 <code>\\U</code>(글자 번호) 자리에 <code>sers…</code> 가 와서 <code>TOMLDecodeError: Invalid hex value (at line 2, column 18)</code>. 더 나쁜 건 <code>"D:\\new\\temp"</code> — <code>\\n</code> · <code>\\t</code> 는 맞는 탈출 글자라 <b>에러 없이</b> 줄바꿈 · 탭이 들어가요. 작은따옴표 <code>'C:\\Users\\me'</code> 는 쓴 그대로예요. 슬래시로 쓴 <code>"C:/Users/me"</code> 도 Windows 가 알아들어요.</div>
<p>에러의 <code>at line 2, column 18</code> 은 「2번째 줄 18번째 글자」 예요. 메모장 아래 상태 표시줄의 줄 · 열로 찾아가요.</p>
<p>예제는 TOML 글을 파이썬 글자로 적으려고 <code>r&#39;&#39;&#39;…&#39;&#39;&#39;</code> 를 써요. 따옴표 셋은 여러 줄 글자, 앞의 <code>r</code> 은 정규식에서 본 <code>r"…"</code> 처럼 <code>\\</code> 를 파이썬이 건드리지 않고 그대로 두는 표시예요. 그래야 TOML 쪽에 <code>\\</code> 가 그대로 가요.</p>`,
      example: { code: `import tempfile
import tomllib
from pathlib import Path


class ConfigError(Exception):
    pass


def load_config(path):
    """config.toml → 딕셔너리. 없거나 글이 틀리면 ConfigError"""
    path = Path(path)
    try:
        text = path.read_text(encoding="utf-8-sig")   # 메모장이 붙인 BOM 도 벗겨요
    except FileNotFoundError:
        raise ConfigError(f"설정 파일이 없어요: {path.name}")
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError as e:
        raise ConfigError(f"{path.name} 의 글이 틀렸어요: {e}")


GOOD = r'''# 월요일 아침 자동 비서 설정
keep = 7                 # 남길 백업 수
send_mail = false

[folders]
downloads = 'C:\\Users\\me\\Downloads'
documents = 'C:\\Users\\me\\Documents\\공방'

[mail]
to = ["me@example.com"]
'''
BAD = r'''[folders]
downloads = "C:\\Users\\me\\Downloads"
'''
QUIET = r'''backup = "D:\\new\\temp"'''

with tempfile.TemporaryDirectory() as tmp:
    p = Path(tmp) / "config.toml"
    try:
        load_config(p)
    except ConfigError as e:
        print("ConfigError:", e)

    p.write_text(GOOD, encoding="utf-8")
    cfg = load_config(p)
    print(cfg)
    print(cfg["keep"] + 1, type(cfg["send_mail"]).__name__, cfg["mail"]["to"][0])
    print(cfg["folders"]["downloads"])
    print("days:", cfg.get("days", 7))         # 없는 키는 기본값

    # ① 큰따옴표 안의 \\U 는 글자 번호 탈출(\\U0001F600 같은)로 읽혀서 에러
    p.write_text(BAD, encoding="utf-8")
    try:
        load_config(p)
    except ConfigError as e:
        print("ConfigError:", e)

# ② 더 나쁜 경우: \\n · \\t 는 맞는 탈출 글자라 에러 없이 줄바꿈 · 탭이 들어가요
value = tomllib.loads(QUIET)["backup"]
print("줄바꿈이 들어갔나:", "\\n" in value, "| 글자 수:", len(value))` } },
    { title: 'RotatingFileHandler · log.exception', html: `<p>복습: <a href="../python/#lesson/L31" target="_blank" rel="noopener">파이썬 교과서 「logging 맛보기」 ↗</a> 에서 <code>basicConfig(filename="app.log", …)</code> 로 파일에 남겼어요. 몇 달 · 몇 년 혼자 도는 스크립트에는 둘이 더 필요해요.</p>
<ul><li><b>파일이 끝없이 커지지 않게</b> — [[돌려 쓰는 로그]] <code>RotatingFileHandler</code></li><li><b>에러의 트레이스백까지 남기기</b> — 터미널을 아무도 안 보니까 로그에: <code>log.exception</code></li></ul>
<p><code>basicConfig</code> 는 한 줄로 다 정하는 지름길이었어요. 이번에는 부품을 직접 이어요.</p>
<table class="kb"><tbody><tr><th>부품</th><th>하는 일</th></tr>
<tr><td><code>log = logging.getLogger("weekly")</code></td><td>이름 붙은 로거(L31)</td></tr>
<tr><td><code>log.setLevel(logging.INFO)</code></td><td>INFO 이상만 남기기 — basicConfig 의 <code>level=</code></td></tr>
<tr><td><code>RotatingFileHandler(path, maxBytes=1_000_000, backupCount=3, encoding="utf-8")</code></td><td>[[핸들러]]. 파일이 1MB 를 넘기 전에 <code>weekly.log</code> 를 <code>weekly.log.1</code> 로 밀고 새로 시작해요. 옛 파일은 <code>.1</code> · <code>.2</code> · <code>.3</code> 셋까지만, 더 오래된 건 지워요</td></tr>
<tr><td><code>h.setFormatter(logging.Formatter(fmt))</code></td><td>줄 모양 — basicConfig 의 <code>format=</code></td></tr>
<tr><td><code>log.addHandler(h)</code> · <code>log.removeHandler(h)</code> · <code>h.close()</code></td><td>로거에 달기 · 떼기 · 파일 닫기</td></tr></tbody></table>
<pre>from logging.handlers import RotatingFileHandler

LOG_FORMAT = "%(levelname)s %(message)s"   # 진짜 스크립트는 "%(asctime)s %(levelname)s %(message)s"


def close_log(log):
    """로거에 단 파일을 닫고 떼기 — Windows 는 열린 파일을 못 지워요"""
    for h in list(log.handlers):
        log.removeHandler(h)
        h.close()


def setup_log(path, name="job", fmt=LOG_FORMAT, max_bytes=1_000_000, backups=3):
    """path 에 돌려 쓰는 로그 파일을 단 로거. 다시 불러도 줄이 두 번 남지 않아요"""
    log = logging.getLogger(name)
    close_log(log)
    log.setLevel(logging.INFO)
    h = RotatingFileHandler(path, maxBytes=max_bytes, backupCount=backups, encoding="utf-8")
    h.setFormatter(logging.Formatter(fmt))
    log.addHandler(h)
    return log</pre>
<ul><li><code>1_000_000</code> 은 <code>1000000</code> 이에요. 숫자 사이 밑줄은 읽기 쉽게 끊어 쓴 것뿐이에요</li><li><code>setup_log</code> 가 먼저 <code>close_log</code> 를 부르는 까닭 — 같은 이름의 로거에 핸들러를 두 번 달면 <b>줄이 두 번씩</b> 남아요</li><li>끝나면 꼭 <code>close_log(log)</code>. Windows 는 열려 있는 파일을 지우거나 이름을 못 바꿔서, 임시 폴더를 지울 때 <code>PermissionError</code> 가 나요</li><li>예제는 늘 같은 출력이 나오게 <code>%(asctime)s</code>(시각)를 뺐어요. 진짜 스크립트는 시각을 꼭 넣으세요</li></ul>
<p><code>log.exception("…")</code> 은 <code>except</code> 블록 안에서 불러요. ERROR 단계로 한 줄 남기고, 그 아래에 <b>트레이스백 전체</b>를 붙여요. <code>log.error("%s", e)</code> 는 에러 한 줄뿐이에요. 예상 못 한 버그는 트레이스백이 있어야 어느 줄인지 알아요.</p>
<pre>try:
    each = total // people
except ZeroDivisionError:
    log.exception("1인당 금액 계산 실패")   # ERROR 줄 + Traceback … + ZeroDivisionError: …</pre>`,
      example: { code: `import logging
import tempfile
from logging.handlers import RotatingFileHandler
from pathlib import Path

LOG_FORMAT = "%(levelname)s %(message)s"   # 진짜 스크립트는 "%(asctime)s %(levelname)s %(message)s"


def close_log(log):
    """로거에 단 파일을 닫고 떼기 — Windows 는 열린 파일을 못 지워요"""
    for h in list(log.handlers):
        log.removeHandler(h)
        h.close()


def setup_log(path, name="job", fmt=LOG_FORMAT, max_bytes=1_000_000, backups=3):
    """path 에 돌려 쓰는 로그 파일을 단 로거. 다시 불러도 줄이 두 번 남지 않아요"""
    log = logging.getLogger(name)
    close_log(log)
    log.setLevel(logging.INFO)
    h = RotatingFileHandler(path, maxBytes=max_bytes, backupCount=backups, encoding="utf-8")
    h.setFormatter(logging.Formatter(fmt))
    log.addHandler(h)
    return log


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)

    # ① 돌려 쓰기: 100바이트를 넘기 전에 새 파일로, 옛 파일은 .1 · .2 로 밀려요
    log = setup_log(base / "job.log", max_bytes=100, backups=2)
    for i in range(1, 11):
        log.info("%02d번째 실행 끝", i)         # %02d = 두 자리 숫자(01, 02 …)
    close_log(log)
    for p in sorted(base.iterdir()):
        lines = p.read_text(encoding="utf-8").splitlines()
        print(p.name, len(lines), "줄:", lines[0], "…", lines[-1])

    # ② log.exception — except 안에서 부르면 트레이스백까지 남겨요
    log = setup_log(base / "error.log")
    classes = {"가죽 공예": (540000, 3), "도자기": (0, 0)}   # 수업: (수강료 합계, 수강생 수)
    for name, pair in classes.items():
        total, people = pair
        try:
            log.info("%s 1인당 %d원", name, total // people)
        except ZeroDivisionError:
            log.exception("%s 1인당 금액 계산 실패", name)
    log.info("다음 일로 넘어가요")
    close_log(log)

    lines = (base / "error.log").read_text(encoding="utf-8").splitlines()
    print("error.log:")
    for line in lines:
        if not line.startswith(" "):     # 들여 쓴 줄(파일 경로 · 코드)은 PC 마다 달라서 빼고 찍어요
            print("  ", line)` } },
    { title: 'open(lock, "x") · @contextmanager 잠금', html: `<p>월요일 9시에 시작한 일이 길어져 아직 도는데, 누가 「지금 실행」 을 또 누르면? 둘이 같은 zip 에 쓰고 같은 파일을 옮겨서 엉망이 돼요. 그래서 시작할 때 [[잠금 파일]]을 만들고, 이미 있으면 멈춰요.</p>
<p>열기 모드 <code>"x"</code> 는 「<b>없을 때만</b> 새로 만들기」 예요. 이미 있으면 <code>FileExistsError</code>. <code>"w"</code> 처럼 덮어쓰지 않아요.</p>
<pre>def take_lock(lock, now):
    with open(lock, "x", encoding="utf-8") as f:
        f.write(now.isoformat())</pre>
<div class="bk-warn"><b>exists() 로 묻고 만들면 안 돼요</b> — <code>if not lock.exists(): lock.write_text(…)</code> 는 묻는 순간과 만드는 순간 사이에 다른 하나가 끼어들 수 있어요. <code>"x"</code> 는 운영체제가 묻기와 만들기를 <b>한 번에</b> 해서 둘 중 하나만 이겨요.</div>
<p>잠금은 꼭 풀어야 해요. 일하다 에러가 나서 안 지우면 다음 주부터 영영 「이미 도는 중」 이에요. 복습: <a href="../python/#lesson/L34" target="_blank" rel="noopener">파이썬 교과서 「with 직접 만들기: 컨텍스트 매니저」 ↗</a> 의 <code>@contextmanager</code> 로 감싸고, <code>try: yield … finally:</code> 에서 지워요.</p>
<pre>class AlreadyRunning(Exception):
    pass


@contextmanager
def run_lock(lock, now, stale=timedelta(hours=6)):
    """두 번 겹쳐 돌지 않게. 돌고 있으면 AlreadyRunning, stale 보다 오래된 잠금은 지우고 그 글자를 as 로"""
    lock = Path(lock)
    old = None
    try:
        take_lock(lock, now)
    except FileExistsError:
        text = lock.read_text(encoding="utf-8").strip()
        try:
            started = datetime.fromisoformat(text)
        except ValueError:
            started = None
        if started is not None and now - started &lt; stale:
            raise AlreadyRunning(f"이미 돌고 있어요({text} 시작)")
        old = text or "(빈 잠금)"
        lock.unlink()
        take_lock(lock, now)
    try:
        yield old
    finally:
        lock.unlink(missing_ok=True)</pre>
<ul><li>이미 도는 중이면 <code>yield</code> 전에 내 예외 <code>AlreadyRunning</code> 을 던져요. with 블록은 아예 돌지 않아요</li><li><b>남은 잠금</b> — 도는 중에 전원이 꺼지면 <code>finally</code> 도 못 돌아 잠금이 남아요. 그래서 잠금에 시작 시각을 적어 두고, <code>now - started</code> 가 <code>stale</code>(기본 6시간)을 넘으면 오래된 것으로 보고 지운 뒤 시작해요. 지운 잠금의 글자를 <code>as old</code> 로 돌려줘서 로그에 남겨요</li><li>잠금이 비었거나 깨졌으면(쓰다가 꺼짐) <code>fromisoformat</code> 이 <code>ValueError</code> — 그것도 오래된 것으로 봐요</li><li>지금 시각은 <code>now</code> 인자로 받아요. 그래서 6시간을 기다리지 않고 <code>datetime(2026, 11, 9, 9, 0)</code> 을 넘겨 시험해요</li></ul>`,
      example: { code: `import tempfile
from contextlib import contextmanager
from datetime import datetime, timedelta
from pathlib import Path


class AlreadyRunning(Exception):
    pass


def take_lock(lock, now):
    with open(lock, "x", encoding="utf-8") as f:   # "x": 없을 때만 새로 만들기, 있으면 FileExistsError
        f.write(now.isoformat())


@contextmanager
def run_lock(lock, now, stale=timedelta(hours=6)):
    """두 번 겹쳐 돌지 않게. 돌고 있으면 AlreadyRunning, stale 보다 오래된 잠금은 지우고 그 글자를 as 로"""
    lock = Path(lock)
    old = None
    try:
        take_lock(lock, now)
    except FileExistsError:
        text = lock.read_text(encoding="utf-8").strip()
        try:
            started = datetime.fromisoformat(text)
        except ValueError:                  # 쓰다가 전원이 꺼져 비었거나 깨진 잠금
            started = None
        if started is not None and now - started < stale:
            raise AlreadyRunning(f"이미 돌고 있어요({text} 시작)")
        old = text or "(빈 잠금)"
        lock.unlink()
        take_lock(lock, now)
    try:
        yield old
    finally:
        lock.unlink(missing_ok=True)       # 에러가 나도 잠금을 풀어요


now = datetime(2026, 11, 9, 9, 0)
with tempfile.TemporaryDirectory() as tmp:
    lock = Path(tmp) / "weekly.lock"

    # ① 보통: 들어가면 생기고, 나오면 지워져요
    with run_lock(lock, now) as old:
        print("① 안:", lock.exists(), lock.read_text(encoding="utf-8"), old)
        # ② 도는 중에 하나가 더 시작하면
        try:
            with run_lock(lock, now + timedelta(minutes=3)):
                print("여기는 안 와요")
        except AlreadyRunning as e:
            print("② AlreadyRunning:", e)
    print("① 나온 뒤:", lock.exists())

    # ③ 블록 안에서 에러가 나도 finally 가 잠금을 지워요
    try:
        with run_lock(lock, now):
            raise ValueError("청구서 폴더가 비었어요")
    except ValueError as e:
        print("③ ValueError:", e, "| 잠금 남았나:", lock.exists())

    # ④ 지난주에 전원이 꺼져 남은 잠금 — 6시간보다 오래돼서 지우고 시작
    lock.write_text("2026-11-02T09:00:00", encoding="utf-8")
    with run_lock(lock, now) as old:
        print("④ 지운 잠금:", old, "| 새 잠금:", lock.read_text(encoding="utf-8"))
    print("④ 나온 뒤:", lock.exists())` } },
    { title: 'sys.exit(main()) · 끝 코드 · now 인자', html: `<p>작업 스케줄러는 스크립트가 끝나며 남긴 끝 코드를 「마지막 실행 결과」 칸에 <code>0x0</code>(성공) · <code>0x1</code>(실패)로 보여 줘요([[레슨:J13]]). 복습: <a href="../python/#lesson/L19C" target="_blank" rel="noopener">파이썬 교과서 「명령 줄 프로그램 2: 하위 명령 · 끝 코드」 ↗</a> — <code>main</code> 이 0 · 1 을 돌려주고, 맨 아래 <code>sys.exit(main())</code> 이 그 수를 끝 코드로 남겨요.</p>
<p>혼자 도는 스크립트의 <code>main</code> 은 일어난 일마다 로그와 끝 코드를 정해 둬요.</p>
<table class="kb"><tbody><tr><th>일어난 일</th><th>로그</th><th>끝 코드</th></tr>
<tr><td>잘 끝남</td><td>INFO 시작 · 결과</td><td><code>0</code></td></tr>
<tr><td>다른 하나가 도는 중 <code>AlreadyRunning</code></td><td>WARNING 건너뜀</td><td><code>0</code> — 실패가 아니라 할 일이 없었던 것</td></tr>
<tr><td>설정이 틀림 <code>ConfigError</code></td><td>ERROR 한 줄 — 내가 고칠 설정이라 트레이스백은 필요 없어요</td><td><code>1</code> + 알림</td></tr>
<tr><td>예상 못 한 에러(그 밖의 <code>Exception</code>)</td><td><code>log.exception</code> — 트레이스백까지</td><td><code>1</code> + 알림</td></tr></tbody></table>
<pre>def main(argv=None, base=None, now=None, notify=None):
    base = HERE if base is None else Path(base)        # 스크립트 폴더 기준
    now = datetime.now() if now is None else now       # 시험할 땐 now 를 넘겨요
    parser = argparse.ArgumentParser(prog="weekly.py")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    log = setup_log(base / "weekly.log", name="weekly")
    code = 1
    try:
        cfg = load_config(base / "config.toml")
        with run_lock(base / "weekly.lock", now) as old:
            if old:
                log.warning("오래된 잠금(%s)을 지우고 시작해요", old)
            mode = " (미리 보기)" if args.dry_run else ""
            log.info("시작 %s%s", now.strftime("%Y-%m-%d %H:%M"), mode)
            folder = base / cfg["folders"]["downloads"]
            names = recent_files(folder, now, cfg.get("days", 7))
            log.info("지난 %d일 새 파일 %d개: %s", cfg.get("days", 7), len(names), ", ".join(names))
        code = 0
    except AlreadyRunning as e:
        log.warning("%s — 이번에는 건너뛰어요", e)
        code = 0
    except ConfigError as e:
        log.error("%s", e)                       # 내가 고칠 설정 — 트레이스백은 필요 없어요
    except Exception:
        log.exception("예상 못 한 에러로 멈췄어요")   # 버그 — 트레이스백까지
    finally:
        close_log(log)
    if code != 0 and notify:
        notify("[weekly.py] 실패", "weekly.log 를 열어 보세요")
    return code


if __name__ == "__main__":
    sys.exit(main())</pre>
<ul><li>맨 바깥의 <code>except Exception:</code> — 평소에는 잡을 에러를 좁게 쓰지만, 혼자 도는 스크립트의 <b>맨 바깥 한 곳</b>만은 다 잡아 로그에 남겨요. 안 그러면 트레이스백이 아무도 안 보는 화면으로 가요</li><li><code>finally: close_log(log)</code> — 어느 길로 나가도 로그 파일을 닫아요</li><li><b>실패하면 나에게 알림</b> — 로그는 내가 열어 봐야 보여요. 실패했을 때만 [[레슨:J10]] 의 메일 보내기로 나에게 한 통 보내게 <code>notify</code> 함수를 넘겨요. 예제는 찍기만 하는 가짜를 넘겨요</li><li><code>now = datetime.now() if now is None else now</code> — 진짜로 돌 때만 지금 시각을 쓰고, 시험할 땐 <code>now</code> 를 넘겨요. 「지난 7일」 같은 계산이 늘 같은 답이 나와요. 수정 시각 읽기는 [[레슨:J1]]</li></ul>`,
      example: { code: `import tempfile
from samples import make_files
import argparse
import logging
import sys
import tomllib
from contextlib import contextmanager
from datetime import datetime, timedelta
from logging.handlers import RotatingFileHandler
from pathlib import Path

HERE = Path(__file__).parent
LOG_FORMAT = "%(levelname)s %(message)s"   # 진짜 스크립트는 "%(asctime)s %(levelname)s %(message)s"


class ConfigError(Exception):
    pass


class AlreadyRunning(Exception):
    pass


def load_config(path):
    """config.toml → 딕셔너리. 없거나 글이 틀리면 ConfigError"""
    path = Path(path)
    try:
        text = path.read_text(encoding="utf-8-sig")
    except FileNotFoundError:
        raise ConfigError(f"설정 파일이 없어요: {path.name}")
    try:
        return tomllib.loads(text)
    except tomllib.TOMLDecodeError as e:
        raise ConfigError(f"{path.name} 의 글이 틀렸어요: {e}")


def close_log(log):
    """로거에 단 파일을 닫고 떼기 — Windows 는 열린 파일을 못 지워요"""
    for h in list(log.handlers):
        log.removeHandler(h)
        h.close()


def setup_log(path, name="job", fmt=LOG_FORMAT, max_bytes=1_000_000, backups=3):
    """path 에 돌려 쓰는 로그 파일을 단 로거. 다시 불러도 줄이 두 번 남지 않아요"""
    log = logging.getLogger(name)
    close_log(log)
    log.setLevel(logging.INFO)
    h = RotatingFileHandler(path, maxBytes=max_bytes, backupCount=backups, encoding="utf-8")
    h.setFormatter(logging.Formatter(fmt))
    log.addHandler(h)
    return log


def take_lock(lock, now):
    with open(lock, "x", encoding="utf-8") as f:
        f.write(now.isoformat())


@contextmanager
def run_lock(lock, now, stale=timedelta(hours=6)):
    """두 번 겹쳐 돌지 않게. 돌고 있으면 AlreadyRunning, stale 보다 오래된 잠금은 지우고 그 글자를 as 로"""
    lock = Path(lock)
    old = None
    try:
        take_lock(lock, now)
    except FileExistsError:
        text = lock.read_text(encoding="utf-8").strip()
        try:
            started = datetime.fromisoformat(text)
        except ValueError:
            started = None
        if started is not None and now - started < stale:
            raise AlreadyRunning(f"이미 돌고 있어요({text} 시작)")
        old = text or "(빈 잠금)"
        lock.unlink()
        take_lock(lock, now)
    try:
        yield old
    finally:
        lock.unlink(missing_ok=True)
def recent_files(folder, now, days):
    """folder 에서 지난 days 일 안에 바뀐 파일 이름(복습: 수정 시각 — 레슨 J1)"""
    since = now - timedelta(days=days)
    names = []
    for p in sorted(folder.iterdir()):
        when = datetime.fromtimestamp(p.stat().st_mtime)
        if p.is_file() and when >= since:
            names.append(p.name)
    return names


def main(argv=None, base=None, now=None, notify=None):
    base = HERE if base is None else Path(base)        # 스크립트 폴더 기준
    now = datetime.now() if now is None else now       # 시험할 땐 now 를 넘겨요
    parser = argparse.ArgumentParser(prog="weekly.py")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args(argv)

    log = setup_log(base / "weekly.log", name="weekly")
    code = 1
    try:
        cfg = load_config(base / "config.toml")
        with run_lock(base / "weekly.lock", now) as old:
            if old:
                log.warning("오래된 잠금(%s)을 지우고 시작해요", old)
            mode = " (미리 보기)" if args.dry_run else ""
            log.info("시작 %s%s", now.strftime("%Y-%m-%d %H:%M"), mode)
            folder = base / cfg["folders"]["downloads"]
            names = recent_files(folder, now, cfg.get("days", 7))
            log.info("지난 %d일 새 파일 %d개: %s", cfg.get("days", 7), len(names), ", ".join(names))
        code = 0
    except AlreadyRunning as e:
        log.warning("%s — 이번에는 건너뛰어요", e)
        code = 0
    except ConfigError as e:
        log.error("%s", e)                       # 내가 고칠 설정 — 트레이스백은 필요 없어요
    except Exception:
        log.exception("예상 못 한 에러로 멈췄어요")   # 버그 — 트레이스백까지
    finally:
        close_log(log)
    if code != 0 and notify:
        notify("[weekly.py] 실패", "weekly.log 를 열어 보세요")
    return code


def show_log(base):
    for line in (base / "weekly.log").read_text(encoding="utf-8").splitlines():
        if not line.startswith(" "):
            print("   ", line)


def alert(subject, body):           # 진짜는 나에게 메일(레슨 J10) — 여기서는 찍기만
    print("  [알림]", subject)


with tempfile.TemporaryDirectory() as tmp:
    base = Path(tmp)
    make_files(base / "Downloads")
    now = datetime(2026, 11, 9, 9, 0)    # 월요일 아침 9시

    cfg = base / "config.toml"
    cfg.write_text("days = 7\\n[folders]\\ndownloads = 'Downloads'\\n", encoding="utf-8")
    print("① 보통:", main([], base, now, notify=alert))

    (base / "weekly.lock").write_text("2026-11-09T08:58:00", encoding="utf-8")
    print("② 다른 하나가 도는 중:", main([], base, now, notify=alert))
    (base / "weekly.lock").unlink()

    cfg.write_text('[folders]\\ndownloads = "C:\\\\Users\\\\me\\\\Downloads"\\n', encoding="utf-8")
    print("③ 설정 글이 틀림:", main([], base, now, notify=alert))

    cfg.write_text("days = '7'\\n[folders]\\ndownloads = 'Downloads'\\n", encoding="utf-8")
    print("④ 숫자 자리에 글자:", main(["--dry-run"], base, now, notify=alert))
    show_log(base)
    print("남은 잠금:", (base / "weekly.lock").exists())


# 진짜로 돌릴 때(작업 스케줄러가 부를 때)는 맨 아래 두 줄:
# if __name__ == "__main__":
#     sys.exit(main())`, prep: [SAMPLES_PREP] } },
  ],
  summary: ['예약으로 혼자 돌면 현재 폴더 · input() · 화면이 달라져요 — 파일은 Path(__file__).parent 기준, 값은 config.toml(tomllib, Windows 경로는 작은따옴표), 결과는 로그 파일로', '로그는 RotatingFileHandler 로 크기를 넘기 전에 돌려 쓰고, 예상 못 한 에러는 맨 바깥 except 에서 log.exception 으로 트레이스백까지 남겨요 — 끝나면 close_log', '두 번 겹쳐 돌지 않게 open(lock, "x") 잠금을 @contextmanager 로 감싸 finally 에서 지우고, main 은 0 · 1 을 돌려 sys.exit(main()) — 시각은 now 인자로 받아 시험해요'] },
{ id: 'J13', ch: 4, n: 13, title: '정해진 시간에 돌리기', mode: 'text',
  tutorSummary: "정해진 시간에 스크립트 돌리기. Windows 작업 스케줄러(taskschd.msc) → 기본 작업 만들기 → 트리거(매주 월 09:00) → 동작 「프로그램 시작」: 프로그램/스크립트 = 가상 환경의 .venv\\Scripts\\pythonw.exe(창 없음, print 는 어디에도 안 나가 로그 파일이 유일한 기록, 경로는 sys.executable 로 확인), 인수 = weekly.py, 시작 위치 = 스크립트 폴더(비우면 C:\\Windows\\System32 에서 돌아 스크립트를 못 찾아 0x2). 「실행」 → F5 → 마지막 실행 결과 0x0(끝 코드 0) · 0x1(return 1 · 잡지 못한 에러) · 0x2(파일 못 찾음 · argparse 거절) · 0x41301(도는 중) · 0x41303(아직 안 돎). 「모든 작업 기록 사용」 으로 기록 탭 켜기. 속성: 조건 탭 AC 전원 칸 해제(노트북), 설정 탭 「예약된 시작 시간을 놓친 경우 가능한 대로 빨리 작업 시작」 체크, 이미 실행 중이면 새 인스턴스 시작 안 함, 오래 돌면 중지. 명령: schtasks /Create /SC WEEKLY /D MON /ST 09:00 /TN \"햇살공방\\월요일비서\" /TR \"pythonw.exe 전체경로 스크립트 전체경로\" /F · /Query /V /FO LIST · /Run · /Delete /F — schtasks 에는 시작 위치가 없어 전체 경로 + Path(__file__).parent 기준. macOS · 리눅스는 cron(리눅스 교과서 U14), PATH 가 짧아 sys.executable 의 절대 경로를 적는다. 파이썬 쪽은 표준만: next_run(now, \"09:00\", weekdays={0, 1, 2, 3, 4}) — 오늘 그 시각에서 시작해 t <= now 이거나 요일이 아니면 timedelta(days=1) 씩, 월말은 calendar.monthrange(연, 월) = (1일의 요일, 날 수), 마지막 평일은 말일에서 주말을 거꾸로 건너뜀. 놓친 실행: last_run.json 에 마지막 성공 시각(isoformat · datetime.fromisoformat), due(last, now) = last 가 None 이거나 next_run(last) <= now, 놓친 횟수 missed, 따라잡기는 한 번에 기간을 넓혀서. while True + time.sleep 이나 schedule 패키지는 프로그램이 계속 켜져 있어야 해서 맛보기만 — 기다리기는 OS, 판단은 파이썬.",
  terms: {"작업 스케줄러": "Windows 에 들어 있는 예약 실행 프로그램(taskschd.msc). 정한 때에 프로그램을 대신 실행해 줘요", "트리거": "작업을 언제 시작할지 정한 조건 — 매일 · 매주 · 매월 · 로그온할 때 등", "동작": "트리거가 오면 할 일. 파이썬 스크립트는 늘 「프로그램 시작」 이에요"},
  pages: [
    { title: "taskschd.msc → 기본 작업 만들기 · 시작 위치",
      html: `<p>[[레슨:J12]] 에서 사람 없이 혼자 도는 스크립트를 만들었어요. 이번엔 그 스크립트를 <b>정해진 때에 불러 주는 쪽</b>이에요. Windows 에는 [[작업 스케줄러]]가 들어 있어요. 시작 메뉴에서 「작업 스케줄러」 를 찾거나, <kbd>Win</kbd>+<kbd>R</kbd> 을 누르고 <code>taskschd.msc</code> 를 쳐요.</p>
<p>오른쪽 「동작」 창의 <b>「기본 작업 만들기…」</b> 를 누르면 마법사가 한 화면씩 물어요. 화면마다 넣을 칸은 이래요(예: 공부 폴더가 <code>C:\\Users\\me\\auto-study</code> 일 때).</p>
<table class="kb"><tbody><tr><th>화면</th><th>칸</th><th>넣을 것</th></tr><tr><td>기본 작업 만들기</td><td>이름 · 설명</td><td><code>햇살 공방 월요일 비서</code></td></tr><tr><td>[[트리거]]</td><td>매일 · 매주 · 매월 · 컴퓨터 시작 시 · 로그온할 때</td><td>매주</td></tr><tr><td>주간</td><td>시작(날짜 · 시각) · 요일</td><td><code>오전 9:00:00</code> · 월요일</td></tr><tr><td>[[동작]]</td><td>프로그램 시작 · (나머지는 옛 기능)</td><td>프로그램 시작</td></tr><tr><td rowspan="3">프로그램 시작</td><td>프로그램/스크립트</td><td><code>C:\\Users\\me\\auto-study\\.venv\\Scripts\\pythonw.exe</code></td></tr><tr><td>인수 추가(옵션)</td><td><code>weekly.py</code></td></tr><tr><td><b>시작 위치(옵션)</b></td><td><code>C:\\Users\\me\\auto-study</code></td></tr><tr><td>마침</td><td>「마침을 클릭할 때 이 작업의 속성 대화 상자 열기」</td><td>체크 — 다음 쪽의 설정으로 이어져요</td></tr></tbody></table>
<p><b>프로그램 칸은 <code>python</code> 이 아니라 가상 환경 안의 파이썬 파일</b>이에요. 작업 스케줄러는 VS Code 가 켜 준 가상 환경을 몰라요. <code>python</code> 만 쓰면 다른 파이썬이 불려 와서 <code>ModuleNotFoundError: No module named 'pypdf'</code> 로 멈춰요. 경로는 VS Code 터미널에서 가상 환경을 켠 채로 <code>sys.executable</code> 을 찍으면 나와요(아래 예제 명령).</p>
<p>그 폴더에는 <code>python.exe</code> 옆에 <b><code>pythonw.exe</code></b> 가 있어요. 같은 파이썬인데 <b>검은 창을 띄우지 않아요</b>. <code>python.exe</code> 로 걸면 월요일 9시마다 검은 창이 떴다 사라져서 일하다 놀라요. 대신 <code>pythonw.exe</code> 는 <code>print</code> 가 어디에도 안 나가요. 그래서 [[레슨:J12]] 의 로그 파일이 유일한 기록이에요.</p>
<div class="bk-warn"><b>시작 위치 칸을 비우면</b> — 작업이 <code>C:\\Windows\\System32</code> 에서 돌아요. 인수의 <code>weekly.py</code> 를 거기서 찾다가 못 찾아 파이썬이 끝 코드 2 로 끝나요(다음 쪽의 <code>0x2</code>). 스크립트 안의 <code>open("config.toml")</code> 같은 상대 경로도 거기서 찾아요. 시작 위치를 꼭 채우고, 스크립트 안은 늘 <code>Path(__file__).parent</code> 기준으로(<a href="../python/#lesson/L17B" target="_blank" rel="noopener">파이썬 교과서 「파일 2: 경로 · 인코딩」 ↗</a> · [[레슨:J12]]).</div>
<p>처음 등록하면 이것만은 눈으로 봐요.</p>
<ul><li>☐ 「동작」 탭의 프로그램 칸이 <code>.venv\\Scripts\\pythonw.exe</code> 로 끝나요</li><li>☐ 시작 위치 칸이 스크립트가 있는 폴더예요(비어 있지 않아요)</li><li>☐ 시험은 트리거를 「지금부터 2분 뒤」 로 잡거나, 다음 쪽의 「실행」 으로 바로 해요 — 월요일까지 기다리지 않아요</li></ul>`,
      example: { label: "예제 명령 — VS Code 터미널에서, 가상 환경을 켠 채로", shell: `python -c "import sys; print(sys.executable)"
# C:\\Users\\me\\auto-study\\.venv\\Scripts\\python.exe 처럼 나와요
# 작업 스케줄러에는 같은 폴더의 pythonw.exe 를 넣어요` } },
    { title: "「실행」 → 마지막 실행 결과 0x0",
      html: `<p>작업을 만들었으면 바로 돌려 봐요. 왼쪽 「작업 스케줄러 라이브러리」 에서 작업을 고르고, 오른쪽 「선택한 항목」 의 <b>「실행」</b>(또는 오른쪽 클릭 → 실행)을 눌러요. 끝나면 <kbd>F5</kbd> 로 새로 고치고, 가운데 목록의 <b>「마지막 실행 결과」</b> 칸을 봐요.</p>
<table class="kb"><tbody><tr><th>마지막 실행 결과</th><th>뜻</th><th>볼 곳</th></tr><tr><td><code>0x0</code></td><td>끝 코드 0 — 잘 끝났어요</td><td>로그에 「끝」 줄</td></tr><tr><td><code>0x1</code></td><td>끝 코드 1 — 스크립트가 <code>return 1</code> 했거나, 잡지 못한 에러로 멈췄어요</td><td>로그의 트레이스백([[레슨:J12]])</td></tr><tr><td><code>0x2</code></td><td>끝 코드 2 — 파이썬이 스크립트 파일을 못 찾았거나, argparse 가 인자를 거절했어요</td><td>시작 위치 · 인수 칸(<a href="../python/#lesson/L19C" target="_blank" rel="noopener">파이썬 교과서 「명령 줄 프로그램 2」 ↗</a>)</td></tr><tr><td><code>0x41301</code></td><td>지금 도는 중</td><td>잠시 뒤 F5</td></tr><tr><td><code>0x41303</code></td><td>아직 한 번도 안 돌았어요</td><td>트리거 시각</td></tr><tr><td><code>0x8007…</code> 처럼 긴 값</td><td>작업 스케줄러가 프로그램을 띄우지도 못했어요(프로그램 칸 경로 오타 등)</td><td>아래 「기록」 탭</td></tr></tbody></table>
<p>끝 코드는 [[레슨:J12]] 에서 <code>sys.exit(main())</code> 으로 돌려준 그 숫자예요. 사람이 안 보는 프로그램이 「잘 됐는지」 를 알리는 유일한 길이라, 실패하면 꼭 1 을 돌려줘야 해요.</p>
<p>아래쪽 탭 「기록」 에는 언제 시작해서 언제 끝났는지가 남아요. 처음엔 꺼져 있어요(「기록(사용 안 함)」). 오른쪽 「동작」 창의 <b>「모든 작업 기록 사용」</b> 을 한 번 누르면 켜져요(관리자 권한).</p>
<p>작업을 두 번 눌러 속성을 열면 탭마다 고칠 곳이 있어요. Windows 버전에 따라 말이 조금 다를 수 있어요.</p>
<table class="kb"><tbody><tr><th>탭</th><th>칸</th><th>권하는 값</th></tr><tr><td>일반</td><td>「사용자가 로그온할 때만 실행」 · 「사용자의 로그온 여부에 관계없이 실행」</td><td>처음엔 앞쪽(기본). 뒤쪽은 Windows 비밀번호를 묻고, 내 네트워크 드라이브가 안 보일 수 있어요</td></tr><tr><td>조건</td><td>「컴퓨터의 AC 전원이 켜져 있는 경우에만 작업 시작」</td><td>노트북이면 <b>체크 해제</b> — 배터리로 쓰는 날은 안 돌아요</td></tr><tr><td>설정</td><td>「예약된 시작 시간을 놓친 경우 가능한 대로 빨리 작업 시작」</td><td><b>체크</b> — 9시에 PC 가 꺼져 있었으면 켜진 뒤 곧 돌아요</td></tr><tr><td>설정</td><td>「작업이 이미 실행 중이면 다음 규칙 적용」</td><td>「새 인스턴스 시작 안 함」(기본). 그래도 잠금 파일([[레슨:J12]])은 둬요 — 내가 VS Code 에서 손으로 돌리는 것까지는 못 막으니까요</td></tr><tr><td>설정</td><td>「다음 시간 이상 작업이 실행되면 중지」</td><td>기본 3일 → 1시간쯤으로 줄여요. 멈춰 버린 스크립트가 다음 주까지 남지 않게</td></tr></tbody></table>
<ul><li>☐ 「실행」 → F5 → 마지막 실행 결과가 <code>0x0</code> 이에요</li><li>☐ 스크립트 폴더에 로그 파일이 생겼고, 맨 끝 줄이 방금 시각이에요</li><li>☐ 「다음 실행 시간」 칸이 다음 월요일 오전 9:00 이에요</li></ul>` },
    { title: "schtasks /Create · cron 은 절대 경로",
      html: `<p>화면 대신 <b>명령 한 줄</b>로 등록할 수도 있어요. PC 를 바꿨을 때 다시 만들기 쉽고, 무엇을 넣었는지 글로 남아요. VS Code 터미널(PowerShell)이나 명령 프롬프트에서 <code>schtasks</code> 를 써요.</p>
<pre>schtasks /Create /SC WEEKLY /D MON /ST 09:00 /TN "햇살공방\\월요일비서" /TR "C:\\Users\\me\\auto-study\\.venv\\Scripts\\pythonw.exe C:\\Users\\me\\auto-study\\weekly.py" /F
schtasks /Query /TN "햇살공방\\월요일비서" /V /FO LIST
schtasks /Run /TN "햇살공방\\월요일비서"
schtasks /Delete /TN "햇살공방\\월요일비서" /F</pre>
<table class="kb"><tbody><tr><th>옵션</th><th>뜻</th></tr><tr><td><code>/SC</code></td><td>얼마나 자주 — <code>DAILY</code> · <code>WEEKLY</code> · <code>MONTHLY</code> · <code>ONLOGON</code>(로그온할 때)</td></tr><tr><td><code>/D</code></td><td>요일 — <code>MON</code> · <code>TUE</code> … 여럿은 <code>MON,WED,FRI</code></td></tr><tr><td><code>/ST</code></td><td>시작 시각 <code>09:00</code>(24시간)</td></tr><tr><td><code>/TN</code></td><td>작업 이름. <code>햇살공방\\월요일비서</code> 처럼 <code>\\</code> 를 넣으면 라이브러리에 「햇살공방」 폴더가 생겨 내 작업끼리 모여요</td></tr><tr><td><code>/TR</code></td><td>돌릴 명령 — 프로그램과 인수를 <b>따옴표 하나 안에</b></td></tr><tr><td><code>/F</code></td><td>만들 때는 같은 이름을 덮어쓰기, 지울 때는 묻지 않기</td></tr><tr><td><code>/SC MONTHLY /MO LASTDAY /M *</code></td><td>매달 마지막 날</td></tr></tbody></table>
<p><code>/Query … /V /FO LIST</code> 는 작업 하나를 자세히 보여 줘요. 「마지막 결과」 · 「다음 실행 시간」 · 「실행할 작업」 줄을 보면 화면의 칸과 같아요. <code>/Run</code> 은 화면의 「실행」 이에요.</p>
<div class="bk-warn"><b>schtasks 에는 시작 위치 칸이 없어요</b> — 이렇게 만든 작업은 <code>C:\\Windows\\System32</code> 에서 돌아요. 그래서 <code>/TR</code> 안의 스크립트는 꼭 <b>전체 경로</b>로 쓰고, 스크립트 안은 <code>Path(__file__).parent</code> 기준이어야 해요. 경로에 빈칸이 있으면(<code>C:\\Users\\김 햇살\\…</code>) 따옴표 안에 따옴표를 또 넣어야 해서 헷갈려요 — 그럴 땐 앞 쪽의 화면으로 등록하세요.</div>
<p><b>macOS · 리눅스는 cron</b> 이에요. <code>crontab -e</code> 의 「분 시 일 월 요일」 문법과 함정은 <a href="../linux/#lesson/U14" target="_blank" rel="noopener">리눅스 교과서 「예약 작업」 ↗</a> 에서 배워요. 파이썬 쪽에서 챙길 것은 하나예요. cron 은 PATH 가 아주 짧아서 <code>python</code> 이라고만 쓰면 못 찾거나 다른 파이썬을 불러요. 가상 환경을 켜고 <code>sys.executable</code> 이 찍어 준 <b>절대 경로</b>를 그대로 적어요.</p>
<pre>0 9 * * 1  /home/me/auto-study/.venv/bin/python /home/me/auto-study/weekly.py</pre>
<ul><li>☐ <code>schtasks /Query /TN "햇살공방\\월요일비서" /V /FO LIST</code> 의 「실행할 작업」 이 <code>pythonw.exe</code> 와 스크립트 전체 경로예요</li><li>☐ <code>schtasks /Run</code> 뒤 화면에서 F5 → 마지막 실행 결과 <code>0x0</code></li></ul>`,
      example: { label: "예제 명령 — Windows 터미널에서(경로는 내 것으로)", shell: `schtasks /Create /SC WEEKLY /D MON /ST 09:00 /TN "햇살공방\\월요일비서" /TR "C:\\Users\\me\\auto-study\\.venv\\Scripts\\pythonw.exe C:\\Users\\me\\auto-study\\weekly.py" /F
schtasks /Run /TN "햇살공방\\월요일비서"
schtasks /Query /TN "햇살공방\\월요일비서" /V /FO LIST
schtasks /Delete /TN "햇살공방\\월요일비서" /F` } },
    { title: "next_run(now, \"09:00\", weekdays) · 월말",
      html: `<p>시각을 맞춰 불러 주는 건 작업 스케줄러인데, 파이썬도 시각을 계산할 일이 있어요. ① 로그에 「다음 실행: 11-16 (월) 09:00」 을 남기기 ② 다음 쪽의 「놓친 실행」 판단 ③ 「그달 마지막 평일」 처럼 스케줄러 칸으로는 못 정하는 규칙. 바깥 패키지 없이 <code>datetime</code> 과 <code>timedelta</code> 면 돼요.</p>
<p>복습: <code>date</code> 는 날짜만, <code>datetime</code> 은 날짜 + 시각이에요(<a href="../python/#lesson/L16B" target="_blank" rel="noopener">파이썬 교과서 「날짜: datetime 맛보기」 ↗</a>). <code>datetime(2026, 11, 9, 9, 0)</code> 처럼 시 · 분까지 넣고, <code>.year</code> · <code>.month</code> · <code>.day</code> · <code>.hour</code> · <code>.minute</code> 로 조각을, <code>.date()</code> 로 날짜만 꺼내요. <code>+ timedelta(days=1)</code> 로 하루 뒤, 둘을 빼면 <code>timedelta</code>, <code>&lt;</code> · <code>&lt;=</code> 로 비교해요. <code>.weekday()</code> 는 월요일 0 ~ 일요일 6 이에요.</p>
<pre>def next_run(now, at, weekdays=(0, 1, 2, 3, 4, 5, 6)):
    h, m = at.split(":")
    t = datetime(now.year, now.month, now.day, int(h), int(m))
    while t &lt;= now or t.weekday() not in weekdays:
        t += timedelta(days=1)
    return t</pre>
<ul><li>오늘의 그 시각에서 시작해요. 이미 지났거나 요일이 아니면 하루씩 뒤로 — 많아야 7번 돌아요</li><li><code>&lt;=</code> 가 중요해요. 9시 딱에 돈 스크립트가 「다음은 언제?」 를 물으면 지금이 아니라 <b>다음</b> 차례여야 해요</li><li><code>weekdays={0, 1, 2, 3, 4}</code> 는 평일, <code>{0}</code> 은 월요일만. 집합이든 튜플이든 <code>in</code> 으로 확인해요</li></ul>
<p><b>월말</b>은 달마다 날 수가 달라요. <code>calendar.monthrange(연, 월)</code> 이 <code>(1일의 요일, 그달 날 수)</code> 를 돌려줘요. 윤년 2월 29일도 알아서 세요.</p>
<pre>import calendar

first, days = calendar.monthrange(2026, 2)
print(first, days)    # 6 28</pre>
<p>2026년 2월 1일은 일요일(6)이고 28일까지 있다는 뜻이에요. 작업 스케줄러는 「매월 → 마지막 날」 은 되지만 「마지막 <b>평일</b>」 은 없어요. 그럴 땐 작업을 매일 같은 시각에 걸고, 스크립트가 맨 앞에서 <code>if today != month_end_workday(…): return 0</code> 으로 「오늘은 내 차례가 아님」 을 스스로 판단해요.</p>`,
      example: { code: `import calendar
from datetime import date, datetime, timedelta

DAYS = ["월", "화", "수", "목", "금", "토", "일"]


def next_run(now, at, weekdays=(0, 1, 2, 3, 4, 5, 6)):
    """now 보다 뒤인 첫 실행 시각. at 은 "09:00", weekdays 는 월=0 … 일=6."""
    h, m = at.split(":")
    t = datetime(now.year, now.month, now.day, int(h), int(m))
    while t <= now or t.weekday() not in weekdays:
        t += timedelta(days=1)
    return t


def show(t):
    return t.strftime("%m-%d") + f" ({DAYS[t.weekday()]}) " + t.strftime("%H:%M")


WORKDAYS = {0, 1, 2, 3, 4}
for now in [datetime(2026, 11, 6, 18, 0),    # 금요일 저녁
            datetime(2026, 11, 7, 10, 0),    # 토요일
            datetime(2026, 11, 9, 8, 59),    # 월요일 8시 59분
            datetime(2026, 11, 9, 9, 0)]:    # 월요일 9시 딱
    t = next_run(now, "09:00", weekdays=WORKDAYS)
    print(show(now), "→", show(t))

start = datetime(2026, 11, 9, 9, 0)
monday = next_run(start, "09:00", weekdays={0})
print("매주 월요일:", show(monday), "/", (monday - start).days, "일 뒤")


def month_end_workday(year, month):
    """그달 마지막 평일 — 말일이 토 · 일이면 금요일로 당겨요."""
    first, last_day = calendar.monthrange(year, month)
    d = date(year, month, last_day)
    while d.weekday() >= 5:
        d -= timedelta(days=1)
    return d


first, last_day = calendar.monthrange(2026, 11)
print("2026년 11월 1일:", DAYS[first], "/ 말일:", last_day)
for month in [2, 5, 10, 11]:
    d = month_end_workday(2026, month)
    print(f"2026년 {month}월 마감:", d, DAYS[d.weekday()])
` } },
    { title: "due(last, now) · last_run.json",
      html: `<p>월요일 9시에 노트북이 꺼져 있었다면? 앞의 「놓친 경우 가능한 대로 빨리」 가 켜진 뒤 한 번 불러 줘요. 하지만 그 칸이 꺼져 있거나, 두 주 내내 휴가였거나, 내가 「실행」 을 두 번 누르면요? <b>스크립트가 스스로 판단</b>하게 해요.</p>
<ul><li>마지막으로 <b>성공한</b> 때를 <code>last_run.json</code> 에 적어요. 실패하면 적지 않아서 다음에 다시 해요</li><li>돌 때마다 <code>due(last, now)</code> — 지난번 다음 차례가 이미 지났으면 할 차례예요</li><li>할 차례가 아니면 조용히 끝 코드 0. 그래서 작업 스케줄러는 「매주 월 9시」 에 「로그온할 때」 트리거를 하나 더 넉넉히 걸어 둬도 돼요</li><li>두 주를 놓쳤어도 <b>한 번만</b> 돌아요. 대신 기간을 「지난번부터 지금까지」 로 잡아 두 주 몫을 한꺼번에 해요([[레슨:JB4]])</li></ul>
<p>JSON 은 <code>datetime</code> 을 그대로 못 담아서 글자로 바꿔 넣어요. <code>now.isoformat()</code> → <code>"2026-11-09T09:00:00"</code>, 되돌리기는 <code>datetime.fromisoformat(글자)</code> — <code>date</code> 에서 쓰던 짝 그대로예요(<a href="../python/#lesson/L19" target="_blank" rel="noopener">파이썬 교과서 「날짜 2: 글자 ↔ 날짜 · 비교」 ↗</a>).</p>
<p><b>그냥 파이썬이 기다리면 안 되나요?</b> <code>time.sleep</code>(<a href="../python/#lesson/L26" target="_blank" rel="noopener">파이썬 교과서 「시간 재기: time」 ↗</a>)으로 다음 차례까지 자는 모양은 이래요. 맛보기만 해요.</p>
<pre>while True:                         # 맛보기 — 이 창이 계속 떠 있어야 해요
    now = datetime.now()
    t = next_run(now, "09:00", weekdays={0})
    print("다음 실행:", t)
    wait = t - now
    time.sleep(wait.total_seconds())    # timedelta → 초
    run_job()</pre>
<p>창을 닫거나, PC 를 다시 켜거나, <code>run_job()</code> 에서 에러가 한 번 나면 그걸로 끝이에요. 절전에서 깨어나면 시계가 어긋나기도 해요. 바깥 패키지 <code>schedule</code> 도 결국 <code>while True: schedule.run_pending(); time.sleep(1)</code> 처럼 <b>프로그램이 계속 켜져 있어야</b> 해서 같은 처지예요. 그래서 이 교과서는 이렇게 나눠요 — <b>기다리기는 OS 에게</b>(작업 스케줄러 · cron), <b>판단은 파이썬이</b>(<code>next_run</code> · <code>due</code>).</p>`,
      example: { code: `import json
import tempfile
from datetime import datetime, timedelta
from pathlib import Path

AT = "09:00"
DAYS = {0}          # 매주 월요일


def next_run(now, at, weekdays=(0, 1, 2, 3, 4, 5, 6)):
    h, m = at.split(":")
    t = datetime(now.year, now.month, now.day, int(h), int(m))
    while t <= now or t.weekday() not in weekdays:
        t += timedelta(days=1)
    return t


def due(last, now):
    """지난번(last) 다음 예약 시각이 벌써 지났으면 True — 한 번도 안 돌았으면(None) True."""
    if last is None:
        return True
    return next_run(last, AT, DAYS) <= now


def missed(last, now):
    """last 다음부터 now 까지 지나간 예약 시각 수."""
    n = 0
    t = next_run(last, AT, DAYS)
    while t <= now:
        n += 1
        t = next_run(t, AT, DAYS)
    return n


def load_last(path):
    if not path.exists():
        return None
    with open(path, encoding="utf-8") as f:
        return datetime.fromisoformat(json.load(f)["last_run"])


def save_last(path, when):
    with open(path, "w", encoding="utf-8") as f:
        json.dump({"last_run": when.isoformat()}, f)


with tempfile.TemporaryDirectory() as tmp:
    state = Path(tmp) / "last_run.json"
    last = load_last(state)
    monday = datetime(2026, 11, 9, 9, 0)
    print("처음:", last, "→ 할 차례?", due(last, monday))

    save_last(state, datetime(2026, 10, 26, 9, 0))    # 마지막으로 돈 때
    print(state.read_text(encoding="utf-8"))
    last = load_last(state)
    for now in [datetime(2026, 11, 2, 8, 0),          # 월요일 아침 8시
                datetime(2026, 11, 10, 8, 30)]:       # 지난 두 월요일에 PC 가 꺼져 있었음
        print(now, "할 차례?", due(last, now), "놓친 횟수:", missed(last, now))

    save_last(state, datetime(2026, 11, 10, 8, 30))   # 따라잡기 한 번 하고 기록
    last = load_last(state)
    later = datetime(2026, 11, 10, 8, 31)
    print("다시 돌리면:", due(last, later))
    print("다음 차례:", next_run(last, AT, DAYS))
` } },
  ],
  summary: ["작업 스케줄러: 기본 작업 만들기 → 트리거 → 「프로그램 시작」 에 가상 환경의 pythonw.exe · 스크립트 · 시작 위치(비우면 System32 에서 돎) — 「실행」 해서 마지막 실행 결과 0x0 을 봐요", "명령으로는 schtasks /Create /SC WEEKLY /D MON /ST 09:00 /TN … /TR …(시작 위치가 없으니 전체 경로), 리눅스 · macOS 는 cron 에 sys.executable 의 절대 경로", "파이썬은 판단만: next_run(now, \"09:00\", weekdays) · 월말 calendar.monthrange · last_run.json 과 due(last, now) 로 놓친 실행 따라잡기 — while + sleep 으로 기다리지 않아요"] },
{ id: 'JB4', ch: 4, boss: true, title: '만들어 보기: 월요일 아침 자동 비서', mode: 'text',
  tutorSummary: '만들어 보기: 월요일 아침 자동 비서', pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
