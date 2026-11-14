# 시안 파일 하나로 묶기 — 사이트의 진짜 CSS(core/ui.css)와 아이콘(core/ui-core.js)을 그대로 넣어요.
# 쓰는 법(저장소 맨 위에서): python3 specs/ref/math-mock/build.py → specs/ref/math-mock/.out/dist/index.html (혼자서 열리는 파일 하나)
# 만든 파일은 모두 .out/ 에 나와요(.gitignore). 저장소에는 소스만 둬요 — 설명은 specs/math-course.md 4절
import json, pathlib, re, sys

here = pathlib.Path(__file__).resolve().parent
repo = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else here.parents[2]  # specs/ref/math-mock → 저장소 맨 위
src = here / 'src'
css = (repo / 'core' / 'ui.css').read_text(encoding='utf-8')
ui = (repo / 'core' / 'ui-core.js').read_text(encoding='utf-8')
m = re.search(r'icon\(name\) \{ const P = (\{.*?\}); return `<svg class="ico"', ui, re.S)
assert m, '아이콘 표를 못 찾았어요(core/ui-core.js 의 icon 모양이 바뀜)'
icons = m.group(1)
toc = json.loads((here / 'toc.json').read_text(encoding='utf-8'))
assert sum(len(c['lessons']) for c in toc) == 35, '목차 초안의 레슨 수가 35가 아니에요'
# toc.json 은 TODO.md 1-1 「목차 초안」 을 옮긴 사본이에요. 초안이 바뀌었는데 사본이 낡으면 여기서 멈춰요(LESSON R15)
todo = (repo / 'TODO.md').read_text(encoding='utf-8')
stale = [f"{l['n']}. {l['title']} — {l['sub']}" for c in toc for l in c['lessons'] if f"{l['n']}. {l['title']} — {l['sub']}" not in todo]
stale += [f"챕터 {c['ch']} · {c['name']}" for c in toc if f"챕터 {c['ch']} · {c['name']}" not in todo]
assert not stale, 'toc.json 이 TODO.md 목차 초안과 달라요: ' + ' | '.join(stale[:5])
mock_css = (src / 'mock.css').read_text(encoding='utf-8')
lesson = (src / 'lesson.js').read_text(encoding='utf-8')
app = (src / 'app.js').read_text(encoding='utf-8')
for name, js in (('lesson.js', lesson), ('app.js', app)):
    assert '</script' not in js, name + ' 안에 스크립트 닫는 글자가 있어요'
html = f'''<!DOCTYPE html>
<html lang="ko" data-theme="dark" data-font="1" class="book-mode">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<link rel="icon" href="data:,">
<title>수학 교과서 화면 시안</title>
<style>
{css}
</style>
<style>
{mock_css}
</style>
</head>
<body data-course="math">
<div id="mkSw"></div>
<div id="topbar"></div>
<div id="view"></div>
<script>
const ICON_P = {icons};
const TOC = {json.dumps(toc, ensure_ascii=False)};
</script>
<script>
{lesson}
</script>
<script>
{app}
</script>
</body>
</html>
'''
out = here / '.out' / 'dist'
out.mkdir(parents=True, exist_ok=True)
(out / 'index.html').write_text(html, encoding='utf-8')
print(f'.out/dist/index.html {len(html.encode("utf-8")) // 1024}KB (사이트 CSS {len(css) // 1024}KB 포함)')
