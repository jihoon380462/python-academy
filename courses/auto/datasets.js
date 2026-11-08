// courses/auto/datasets.js — 「파이썬 업무 자동화」 교과서의 연습 재료(v2.42.0). content.js 보다 먼저 읽어서 레슨 예제(example.prep)와 만들어 보기(prep) 둘 다 써요.
// SAMPLES_PY = samples.py 원문(가상의 「햇살 공방」 — 저작권 없음). 예제 · 답은 from samples import … 로 임시 폴더 안에 가짜 파일을 만들어 써요.
// JS 템플릿 글자라 \\ 와 \${ 를 이스케이프해 넣었어요(실제 samples.py 에는 \ 와 ${ 그대로).
const SAMPLES_PY = `# samples.py — 「파이썬 업무 자동화」 교과서의 연습 재료(가상의 「햇살 공방」 사무 일, 무작위 없음).
# 공부 폴더에 저장해 두고, 예제와 문제에서 from samples import … 로 써요.
# 내 진짜 파일은 건드리지 않아요 — 함수에 넘긴 폴더(보통 임시 폴더) 안에만 만들어요.
import os
import zipfile
from datetime import datetime
from email.message import EmailMessage
from email.utils import formataddr
from pathlib import Path

ROSTER_CSV = """이름,이메일,수업,수강료,수료일
김하늘,sky@example.com,가죽 공예,180000,2026-10-31
이도윤,doyun@example.com,목공 기초,240000,2026-10-31
박서준,,도자기,210000,2026-10-31
최유나,yuna@example.com,가죽 공예,180000,2026-10-31
정민지,minji@example.com,캘리그라피,150000,2026-11-07
한지우,jiwoo@example.com,목공 기초,240000,2026-11-07
오세린,serin@example.com,도자기,210000,2026-11-07
윤가람,garam@example.com,캘리그라피,150000,2026-11-07
"""

# 「다운로드」 폴더 흉내: (이름, 내용, 수정 시각)
DOWNLOADS = [
    ("IMG_0001.JPG", b"photo-1", datetime(2026, 10, 3, 9, 12)),
    ("IMG_0002.jpg", b"photo-2", datetime(2026, 10, 3, 9, 15)),
    ("스크린샷 2026-10-05.png", b"screen", datetime(2026, 10, 5, 14, 0)),
    ("견적서 최종.docx", b"docx-final", datetime(2026, 10, 7, 11, 30)),
    ("~$견적서 최종.docx", b"lock", datetime(2026, 10, 7, 11, 31)),
    ("Thumbs.db", b"thumbs", datetime(2026, 10, 7, 11, 32)),
    ("청구서_10월.PDF", b"pdf-oct", datetime(2026, 10, 31, 18, 0)),
    ("회의 메모.txt", "회의는 월요일 10시".encode("utf-8"), datetime(2026, 11, 2, 10, 5)),
    ("수강생 명단.csv", ROSTER_CSV.encode("utf-8-sig"), datetime(2026, 11, 2, 10, 20)),
    ("IMG_0003.jpg", b"photo-3", datetime(2026, 11, 3, 16, 40)),
    ("발표 자료.pptx", b"pptx", datetime(2026, 11, 4, 8, 55)),
    ("임시.tmp", b"tmp", datetime(2026, 11, 4, 9, 0)),
]


def make_files(folder):
    """folder 안에 다운로드 폴더 흉내 파일 12개를 만들고, 수정 시각을 고정해요."""
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    for name, data, when in DOWNLOADS:
        p = folder / name
        p.write_bytes(data)
        ts = when.timestamp()
        os.utime(p, (ts, ts))
    return sorted(folder.iterdir())


def _font():
    from reportlab.pdfbase import pdfmetrics
    from reportlab.pdfbase.cidfonts import UnicodeCIDFont
    pdfmetrics.registerFont(UnicodeCIDFont("HYGothic-Medium"))  # 글꼴 파일 없이 한글
    return "HYGothic-Medium"


def make_pdf(path, pages, password=None):
    """pages 의 글자(쪽마다 여러 줄 글자 하나)로 PDF 를 만들어요. 빈 글자면 빈 쪽(스캔본 흉내)."""
    from reportlab.pdfgen import canvas
    font = _font()
    c = canvas.Canvas(str(path), invariant=1)  # invariant: 만든 날짜를 넣지 않아 늘 같은 파일
    for text in pages:
        c.setFont(font, 14)
        y = 780
        for line in text.splitlines():
            c.drawString(60, y, line)
            y -= 24
        c.showPage()
    c.save()
    if password:
        from pypdf import PdfReader, PdfWriter
        w = PdfWriter(clone_from=PdfReader(path))
        w.encrypt(password, algorithm="AES-256")
        with open(path, "wb") as f:
            w.write(f)
    return Path(path)


# 거래처 청구서: (파일 이름, 거래처, 번호, 청구일, 금액, 종류) — 종류: 보통 · 스캔 · 암호
INVOICES = [
    ("청구서_햇살문구.pdf", "햇살문구", "INV-2026-1001", "2026-10-05", 125000, "보통"),
    ("청구서_바다인쇄.pdf", "바다인쇄", "INV-2026-1002", "2026-10-08", 342000, "보통"),
    ("청구서_숲속목재.pdf", "숲속목재", "INV-2026-1003", "2026-10-12", 1280000, "보통"),
    ("청구서_한빛택배.pdf", "한빛택배", "INV-2026-1004", "2026-10-15", 56500, "스캔"),
    ("청구서_달빛가죽.pdf", "달빛가죽", "INV-2026-1005", "2026-10-21", 890000, "암호"),
    ("청구서_별빛흙방.pdf", "별빛흙방", "INV-2026-1006", "2026-10-27", 410000, "보통"),
]


def make_invoices(folder):
    """folder 안에 청구서 PDF 6개. 하나는 글자 없는 스캔본, 하나는 암호 1234."""
    folder = Path(folder)
    folder.mkdir(parents=True, exist_ok=True)
    for name, who, no, day, amount, kind in INVOICES:
        text = f"청구서\\n거래처: {who}\\n청구 번호: {no}\\n청구일: {day}\\n합계 금액: {amount:,}원\\n받는 곳: 햇살 공방"
        if kind == "스캔":
            text = ""
        make_pdf(folder / name, [text, "입금 계좌: 햇살은행 123-456-7890\\n문의: 02-000-0000"],
                 password="1234" if kind == "암호" else None)
    return sorted(folder.glob("*.pdf"))


def make_template_docx(path):
    """수료증 워드 틀. \${이름} 은 일부러 두 run(\${ + 이름})으로 쪼개 둬요 — Word 가 실제로 이렇게 쪼개요."""
    from docx import Document
    doc = Document()
    doc.add_heading("수료증", level=1)
    p = doc.add_paragraph()
    p.add_run("\${")
    p.add_run("이름}")
    p.add_run(" 님은 햇살 공방의 ")
    r = p.add_run("\${수업}")
    r.bold = True
    p.add_run(" 과정을 마쳤기에 이 증서를 드립니다.")
    doc.add_paragraph("수료일: \${수료일}")
    doc.add_paragraph("햇살 공방 대표 김햇살")
    doc.save(path)
    return Path(path)


class _Cp949Info(zipfile.ZipInfo):
    def _encodeFilenameFlags(self):  # 옛 Windows 압축처럼 utf-8 표시 없이 cp949 바이트로
        return self.filename.encode("cp949"), self.flag_bits & ~0x800


def make_windows_zip(path):
    """한글 파일 이름이 cp949 로 든 zip(Windows 기본 압축 · 옛 프로그램이 만든 것 흉내)."""
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as zf:
        for name, text in [("견적서.txt", "견적 합계 125,000원"), ("사진/공방 입구.txt", "사진 대신 글자")]:
            info = _Cp949Info(name, date_time=(2026, 10, 7, 11, 30, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            zf.writestr(info, text.encode("utf-8"))
    return Path(path)


def make_eml(path):
    """견적서 PDF 가 첨부된 받은 메일 한 통(.eml)."""
    pdf = Path(path).with_name("_견적서.pdf")
    make_pdf(pdf, ["견적서\\n거래처: 숲속목재\\n합계 금액: 1,280,000원"])
    msg = EmailMessage()
    msg["From"] = formataddr(("숲속목재 김목수", "wood@example.com"))
    msg["To"] = formataddr(("햇살 공방", "hello@example.com"))
    msg["Subject"] = "10월 원목 견적서 보내드립니다"
    msg.set_content("안녕하세요, 숲속목재입니다.\\n요청하신 견적서를 첨부합니다.")
    msg.add_attachment(pdf.read_bytes(), maintype="application", subtype="pdf", filename="견적서_숲속목재.pdf")
    pdf.unlink()
    Path(path).write_bytes(msg.as_bytes())
    return Path(path)


class FakeSMTP:
    """진짜로 보내지 않고 기록만 하는 가짜 메일 서버(smtplib.SMTP 처럼 with 로도 써요)."""

    def __init__(self, fail=()):
        self.sent = []          # 보낸 메일 (받는 사람, 제목)
        self.fail = set(fail)   # 이 주소로 보내면 일부러 실패
        self.user = None

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        return False

    def login(self, user, password):
        self.user = user

    def send_message(self, msg):
        to = msg["To"]
        if any(addr in to for addr in self.fail):
            raise OSError(f"보내기 실패: {to}")
        self.sent.append((to, msg["Subject"]))
        return {}

    def quit(self):
        pass
`;
const SAMPLES_PREP = { name: 'samples.py', text: SAMPLES_PY, fold: '연습 재료 — 시작하기 2 에서 이미 저장했으면 건너뛰어요' };
