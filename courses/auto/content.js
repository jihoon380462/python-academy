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
{ id: 'J0', ch: 0, n: 0, title: '업무 자동화 첫걸음', mode: 'text', draft: true,
  tutorSummary: '고를 일 · 안전 세 원칙 · 준비',
  pages: AUTO_TODO('고를 일 · 안전 세 원칙 · 준비'), summary: ["고를 일", "안전 세 원칙", "준비"] },
{ id: 'J1', ch: 1, n: 1, title: '이름 한꺼번에 바꾸기 · 날짜로 정리', mode: 'text', draft: true,
  tutorSummary: '규칙 함수 · 충돌 검사 · 되돌리기',
  pages: AUTO_TODO('규칙 함수 · 충돌 검사 · 되돌리기'), summary: ["규칙 함수", "충돌 검사", "되돌리기"] },
{ id: 'J2', ch: 1, n: 2, title: '백업: 복사 · 비교 · 정리', mode: 'text', draft: true,
  tutorSummary: 'copy2 · copytree · filecmp',
  pages: AUTO_TODO('copy2 · copytree · filecmp'), summary: ["copy2", "copytree", "filecmp"] },
{ id: 'J3', ch: 1, n: 3, title: '압축: zipfile', mode: 'text',
  tutorSummary: "zipfile 로 묶고 · 보고 · 풀기. zipfile.ZipFile(path, \"w\", compression=zipfile.ZIP_DEFLATED) — compression 을 빼면 ZIP_STORED(담기만). \"w\" 는 덮어쓰기, \"a\" 는 뒤에 더하기(같은 이름이면 하나 더 생기고 Duplicate name 경고, read 는 마지막 것), 기본 \"r\". 늘 with. zf.write(p, arcname=p.relative_to(src).as_posix()) — arcname 을 빼면 내 PC 경로(Users/me/AppData/…)가 통째로 들어가는 함정, as_posix 로 / 구분, src.rglob(\"*\") 에서 is_file 만, zip 은 원본 폴더 밖에(안에 두면 자기 자신이 들어감 — out.resolve().is_relative_to(src.resolve())). zf.writestr(이름, 글자). 보기: namelist()(넣은 순서 → sorted) · infolist() 의 filename · file_size · compress_size · compress_type · getinfo · zf.read(name) 은 바이트 → decode(\"utf-8\"), 없는 이름은 KeyError. jpg · png · zip 은 거의 안 줄고 아주 작은 파일은 늘기도 함 → 크기는 참 · 거짓으로만. 풀기: extractall(새 빈 폴더 — 같은 이름은 덮어씀) · extract · testzip()(괜찮으면 None, 아니면 처음 망가진 이름 — 파일마다 적힌 CRC-32 지문, J2 의 sha256 과 같은 생각) · is_zipfile · BadZipFile(\"File is not a zip file\", \"Bad CRC-32\"). read_bytes · write_bytes. 암호 zip 은 푸는 것만 pwd=b\"1234\"(만들기는 표준에 없음 — 7-Zip, AES 는 NotImplementedError). 한글 이름이 ░▀└√ 처럼 깨지는 zip(옛 Windows 기본 압축 = cp949, utf-8 표시 없음 → 파이썬은 cp437 로 읽음) → ZipFile(path, metadata_encoding=\"cp949\")(3.11+, 읽기만 — \"w\" 면 ValueError), 깨진 이름으론 read 가 KeyError. shutil.make_archive(확장자 뺀 이름, \"zip\", root_dir=폴더)(\".zip\" 을 주면 .zip.zip) · unpack_archive — 고를 수 없음 → fnmatch.fnmatch(name.lower(), pattern.lower())(* · ? · Windows 는 대소문자 무시) 와 rel.parts 의 . 조각(숨김 폴더)으로 직접 골라 담기. glob 도 같은 모양(문서_????-??-??.zip). tar 는 리눅스 U14.",
  pages: [
    { title: "ZipFile(…, \"w\") · write(p, arcname=…)", html: `<p>[[레슨:J2]] 에서 폴더를 복사해 백업했죠. 이번엔 여러 파일을 <b>zip 파일 하나</b>로 묶어요. 메일에 붙이기 쉽고, 크기가 줄고, 날짜마다 파일 하나로 쌓기도 좋아요. 표준 모듈 <code>zipfile</code> 하나면 돼요.</p>
<table class="kb"><tbody><tr><th>코드</th><th>하는 일</th></tr><tr><td><code>zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED)</code></td><td>새 zip 만들기. 같은 이름이 있으면 <b>묻지 않고 덮어써요</b></td></tr><tr><td><code>zipfile.ZipFile(path, "a")</code></td><td>있는 zip 뒤에 더 넣기</td></tr><tr><td><code>zipfile.ZipFile(path)</code></td><td>읽기(<code>"r"</code> 이 기본)</td></tr><tr><td><code>zf.write(p, arcname="거래처/연락처.txt")</code></td><td>파일 p 를 넣고, zip 안에서는 그 이름으로</td></tr><tr><td><code>zf.writestr("메모.txt", "글")</code></td><td>파일 없이 글자(또는 바이트)를 바로 넣기</td></tr></tbody></table>
<p>늘 <code>with</code> 로 열어요. with 를 나올 때 zip 의 목차가 마저 써져요. 목차가 빠진 zip 은 열리지 않아요.</p>
<div class="bk-warn"><b>compression 을 빼면 압축을 안 해요</b> — 기본값은 <code>ZIP_STORED</code>(담기만)예요. 크기를 줄이려면 <code>compression=zipfile.ZIP_DEFLATED</code> 를 꼭 적어요.</div>
<p><b>arcname 함정</b>: <code>zf.write(p)</code> 처럼 arcname 을 빼면 zip 안의 이름이 <b>p 의 경로 그대로</b>예요. Windows 라면 <code>Users/me/AppData/Local/Temp/tmpab12cd/다운로드/회의 메모.txt</code> 처럼 내 PC 의 폴더가 통째로 들어가요. 받는 사람이 풀면 폴더가 일곱 겹이고, 내 사용자 이름까지 보여요. 그래서 원본 폴더 기준 <b>상대 경로</b>를 arcname 으로 줘요.</p>
<pre>from pathlib import Path

src = Path("다운로드")
p = src / "거래처" / "연락처.txt"
rel = p.relative_to(src)
print(rel.as_posix())   # 거래처/연락처.txt</pre>
<ul><li><code>p.relative_to(src)</code> — p 에서 앞의 src 부분을 떼어 낸 나머지 경로</li><li><code>.as_posix()</code> — 구분 글자를 <code>/</code> 로. Windows 경로는 <code>\\</code> 로 이어지지만, zip 안의 이름은 늘 <code>/</code> 예요</li><li><code>src.rglob("*")</code> — 안쪽 폴더까지 전부. <code>src.glob("**/*")</code> 와 같아요(복습: <a href="../python/#lesson/L27" target="_blank" rel="noopener">파이썬 교과서 「폴더와 파일 정리: pathlib · shutil」 ↗</a>)</li><li>rglob 은 폴더도 주니까 <code>p.is_file()</code> 인 것만 넣어요</li></ul>
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
<p>예제는 zip 을 일부러 망가뜨려 봐요. <code>p.read_bytes()</code> 는 파일을 통째로 바이트로 읽고, <code>p.write_bytes(b)</code> 는 바이트를 통째로 써요(<code>read_text</code> · <code>write_text</code> 의 바이트판). 압축하지 않고 담은 zip 이라 안에 <code>photo-2</code> 가 그대로 들어 있어서, 그 한 곳만 바꿔요.</p>
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
<p>한계는 <b>고를 수 없다</b>는 거예요. <code>~$</code> 임시 파일 · <code>Thumbs.db</code> · <code>.venv</code> 까지 다 들어가요. 고르려면 첫 쪽처럼 직접 돌면서 이름 모양으로 걸러요. <code>fnmatch.fnmatch(이름, 모양)</code> 은 [[레슨:J2]] 의 <code>ignore_patterns</code> 와 같은 모양 규칙을 이름 하나에 맞춰 봐요.</p>
<table class="kb"><tbody><tr><th>모양</th><th>뜻</th><th>맞는 예</th></tr><tr><td><code>*</code></td><td>아무 글자 몇 개든(0개도)</td><td><code>*.tmp</code> → <code>임시.tmp</code></td></tr><tr><td><code>?</code></td><td>아무 글자 딱 하나</td><td><code>문서_????-??-??.zip</code> → <code>문서_2026-11-08.zip</code></td></tr><tr><td><code>~$*</code></td><td><code>~$</code> 로 시작</td><td><code>~$견적서 최종.docx</code></td></tr></tbody></table>
<p><code>glob</code> 도 같은 모양 규칙을 써요. <code>dest.glob("문서_????-??-??.zip")</code> 은 폴더에서 날짜 이름 백업만 골라 줘요.</p>
<p>숨김 폴더(<code>.git</code> · <code>.venv</code> 처럼 이름이 <code>.</code> 으로 시작)는 경로의 조각마다 봐야 해요. <code>rel.parts</code> 는 경로를 조각 튜플로 줘요.</p>
<pre>from pathlib import Path

rel = Path(".venv/Lib/site.py")
print(rel.parts)   # ('.venv', 'Lib', 'site.py')
print(rel.name)    # site.py</pre>
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
            return "숨김"
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
  tutorSummary: "만들어 보기: 매일 쓰는 백업 도구 backup.py — ① 넣을 파일 고르기(~$* · *.tmp · Thumbs.db · 숨김 폴더, fnmatch · rel.parts) ② manifest.json(상대 경로 → size · sha256)으로 지난번과 비교, 같으면 건너뜀 ③ 문서_2026-11-08.zip 만들고 다시 열어 namelist · testzip 확인 ④ dest.glob(\"문서_????-??-??.zip\") 으로 최근 n개만(미리 보기 먼저) ⑤ backup(src, dest, today, keep=7, dry_run=False) + main(argv, today=date(2026, 11, 8)) · 끝 코드 · 요약. JB4 가 backup() 을 다시 씀.", pages: [], summary: [] },
{ id: 'J4', ch: 2, n: 4, title: 'PDF 읽기 · 글자 꺼내기', mode: 'text',
  tutorSummary: "pypdf 로 PDF 읽기. r = PdfReader(path) · len(r.pages) · r.pages[0](0부터) · page.extract_text()(쪽 글자 str, 줄은 \\n) · r.metadata.title · .author(reportlab 기본값 untitled · anonymous, 없으면 None). 옛 PyPDF2 블로그 코드: PdfFileReader → PdfReader, numPages → len(r.pages), getPage(0) → pages[0], extractText → extract_text, getDocumentInfo → metadata, isEncrypted → is_encrypted, PdfFileMerger · PdfMerger → PdfWriter().append, addPage → add_page, rotateClockwise → rotate, mergePage → merge_page, addBookmark → add_outline_item (옛 이름은 ImportError · AttributeError). PDF 는 좌표에 글자를 그릴 뿐이라 빈칸 · 줄 · 순서를 pypdf 가 짐작 → 버전 · 프로그램마다 다름 → \" \".join(text.split()) 로 고른 뒤 정규식(L20B)으로 이름표 다음 값만: 거래처:\\s*(\\w+) · 청구\\s*번호:\\s*(INV-\\d{4}-\\d{4}) · 청구일:\\s*(\\d{4}-\\d{2}-\\d{2}) · 합계\\s*금액:\\s*([0-9,]+)\\s*원 → parse_invoice(text) 가 {거래처, 번호, 날짜(date.fromisoformat), 금액(int(s.replace(\",\", \"\")))} 또는 None. 줄 번호로 꺼내지 않기. 스캔본은 extract_text() 가 에러 없이 \"\" → if not text.strip(), OCR(Tesseract · ocrmypdf)은 이름만. 암호 PDF: PdfReader 는 열리지만 쪽을 읽으면 FileNotDecryptedError → r.is_encrypted → r.decrypt(pw)(틀려도 에러 없이 0, 맞으면 1 · 2) → open_pdf(path, password) 가 못 풀면 None. AES 는 cryptography 필요(DependencyError). 권한 암호만 있으면 그냥 읽힘. 폴더째: read_invoices(folder, password) → (날짜 순 rows, 못 읽은 (이름, 까닭)) → csv.DictWriter + utf-8-sig + newline=\"\"(L29). 엑셀은 files 코스 F8, 표 꺼내기 pdfplumber 는 이름만.",
  terms: { "스캔본": "종이를 스캐너로 찍어 만든 PDF. 쪽마다 사진 한 장이라 꺼낼 글자가 없어요", "OCR": "사진 속 글자를 읽어 진짜 글자로 바꾸는 일(광학 문자 인식). Tesseract · ocrmypdf 같은 프로그램이 해요" },
  pages: [
    { title: "PdfReader(p) · len(r.pages) · r.pages[0]", html: `<p>매달 거래처에서 청구서 PDF 가 와요. 하나씩 열어 거래처 · 번호 · 금액을 옮겨 적는 일을 파이썬에게 맡겨 봐요. 이번 레슨은 PDF 를 <b>읽는</b> 쪽(글자 꺼내기)이고, [[레슨:J5]] 는 <b>고쳐 쓰는</b> 쪽(합치기 · 나누기)이에요. 둘 다 시작하기에서 깐 <code>pypdf</code> 를 써요.</p>
<p>연습 재료는 <code>make_invoices(폴더)</code> 가 만드는 청구서 6개예요. 모두 2쪽짜리예요(1쪽 청구 내용, 2쪽 입금 계좌 · 문의).</p>
<table class="kb"><tbody><tr><th>파일</th><th>모양</th></tr><tr><td><code>청구서_햇살문구.pdf</code> · <code>바다인쇄</code> · <code>숲속목재</code> · <code>별빛흙방</code></td><td>보통 PDF — 글자가 그대로 꺼내져요</td></tr><tr><td><code>청구서_한빛택배.pdf</code></td><td>스캔본 흉내 — 1쪽에 글자가 없어요</td></tr><tr><td><code>청구서_달빛가죽.pdf</code></td><td>암호 <code>1234</code> 가 걸려 있어요</td></tr></tbody></table>
<pre>from pypdf import PdfReader

r = PdfReader("청구서_햇살문구.pdf")
print(len(r.pages))        # 2
page = r.pages[0]          # 첫 쪽은 0번 — 사람이 말하는 「1쪽」
print(r.metadata.title)    # untitled</pre>
<ul><li><code>r.pages</code> — 쪽들. 리스트처럼 <code>len(r.pages)</code> · <code>r.pages[0]</code> · <code>for page in r.pages</code> 가 돼요</li><li><code>r.metadata</code> — 문서 정보. <code>.title</code>(제목) · <code>.author</code>(만든 사람). 연습 재료는 reportlab 의 기본값 <code>untitled</code> · <code>anonymous</code> 예요. 칸이 비어 있으면 <code>None</code>, 정보가 아예 없는 PDF 는 <code>r.metadata</code> 가 <code>None</code> 이에요</li></ul>
<div class="bk-warn"><b>블로그 코드는 옛 이름일 때가 많아요</b> — 검색하면 <code>PyPDF2</code> 의 <code>PdfFileReader</code> · <code>PdfMerger</code> 가 많이 나와요. PyPDF2 는 이름을 다시 <code>pypdf</code> 로 바꿔 이어 만들고 있고, 옛 PyPDF2 는 더 고치지 않아요. <code>pip install PyPDF2</code> 하지 말고 아래 표로 새 이름을 찾아 바꿔요.</div>
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
<ul><li>찍은 뒤 확인: 다시 열어 그 쪽 글자에 <code>"입금 완료" in text</code> 가 참인지 봐요. 도장 글자도 PDF 글자라서 <code>extract_text()</code> 에 섞여 나와요</li><li>도장 쪽과 찍을 쪽의 크기가 같아야 자리가 맞아요(둘 다 A4)</li><li>보이는 모양(색 · 위치 · 한글이 네모로 깨지지 않는지)은 Edge 나 Acrobat 으로 열어 눈으로 봐요. Acrobat 이 「아시아 글꼴 팩」 을 설치하라고 물으면 설치해요</li><li>표 · 문단이 있는 긴 문서는 reportlab 의 platypus(이름만)로 만들어요. 이 교과서의 문서는 워드로 만들어요([[레슨:J6]])</li></ul>`,
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
{ id: 'J6', ch: 2, n: 6, title: '워드 문서 만들기', mode: 'text', draft: true,
  tutorSummary: 'Document · run · 표',
  pages: AUTO_TODO('Document · run · 표'), summary: ["Document", "run", "표"] },
{ id: 'J7', ch: 2, n: 7, title: '워드 읽고 고치기 · 틀 채우기', mode: 'text', draft: true,
  tutorSummary: 'run 쪼개짐 · 틀 채우기 · PDF 로',
  pages: AUTO_TODO('run 쪼개짐 · 틀 채우기 · PDF 로'), summary: ["run 쪼개짐", "틀 채우기", "PDF 로"] },
{ id: 'JB2', ch: 2, boss: true, title: '만들어 보기: 청구서 정리기', mode: 'text', draft: true,
  tutorSummary: '만들어 보기: 청구서 정리기', pages: [], summary: [] },
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
{ id: 'J10', ch: 3, n: 10, title: '이메일 보내기', mode: 'text', draft: true,
  tutorSummary: 'SMTP · 앱 비밀번호 · 가짜 서버',
  pages: AUTO_TODO('SMTP · 앱 비밀번호 · 가짜 서버'), summary: ["SMTP", "앱 비밀번호", "가짜 서버"] },
{ id: 'JB3', ch: 3, boss: true, title: '만들어 보기: 수료증 · 안내 메일 발송기', mode: 'text', draft: true,
  tutorSummary: '만들어 보기: 수료증 · 안내 메일 발송기', pages: [], summary: [] },
{ id: 'J11', ch: 4, n: 11, title: '맛보기: 클립보드 · 키보드 · 마우스', mode: 'text', draft: true,
  tutorSummary: 'pyperclip · pyautogui · 언제 피하나',
  pages: AUTO_TODO('pyperclip · pyautogui · 언제 피하나'), summary: ["pyperclip", "pyautogui", "언제 피하나"] },
{ id: 'J12', ch: 4, n: 12, title: '혼자 돌아가는 스크립트', mode: 'text', draft: true,
  tutorSummary: '__file__ 기준 · 회전 로그 · 잠금',
  pages: AUTO_TODO('__file__ 기준 · 회전 로그 · 잠금'), summary: ["__file__ 기준", "회전 로그", "잠금"] },
{ id: 'J13', ch: 4, n: 13, title: '정해진 시간에 돌리기', mode: 'text', draft: true,
  tutorSummary: '작업 스케줄러 · next_run · 놓친 실행',
  pages: AUTO_TODO('작업 스케줄러 · next_run · 놓친 실행'), summary: ["작업 스케줄러", "next_run", "놓친 실행"] },
{ id: 'JB4', ch: 4, boss: true, title: '만들어 보기: 월요일 아침 자동 비서', mode: 'text', draft: true,
  tutorSummary: '만들어 보기: 월요일 아침 자동 비서', pages: [], summary: [] },
];
const PROBLEMS = []; // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
