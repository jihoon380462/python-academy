# .claude/hooks/korean_reply.py — Stop 훅: 이번 턴에 쓴 글 중 한글 없이 영어로만 된 덩어리가 있으면 끝내지 못하게 막음 (LESSON.md U1)
# 2026-11-08: 영어로 답하는 실수가 다섯 번 넘게 되풀이되어, 규칙(CLAUDE.md 2절) 대신 검사로 막음.
# 입력(stdin): Stop 훅 JSON(transcript_path · stop_hook_active). 출력: 막을 때만 {"decision":"block","reason":…}
import json, re, sys

HANGUL = re.compile(r'[가-힣]')
LATIN = re.compile(r'[A-Za-z]')

def texts_of(entry):
    msg = entry.get('message') or {}
    c = msg.get('content')
    if isinstance(c, str): return [c]
    return [b.get('text', '') for b in (c or []) if isinstance(b, dict) and b.get('type') == 'text']

def is_real_user(entry):
    """사람이 친 말(도구 결과가 아닌 user 줄)"""
    if entry.get('type') != 'user': return False
    c = (entry.get('message') or {}).get('content')
    if isinstance(c, str): return True
    return any(isinstance(b, dict) and b.get('type') == 'text' for b in (c or []))

def english_only(t):
    t = re.sub(r'```.*?```', '', t, flags=re.S)   # 코드 상자는 빼고
    t = re.sub(r'`[^`]*`', '', t)                  # 인라인 코드도 빼고
    t = re.sub(r'https?://\S+', '', t)
    return len(LATIN.findall(t)) >= 15 and not HANGUL.search(t)

def main():
    try: data = json.load(sys.stdin)
    except Exception: return
    if data.get('stop_hook_active'): return   # 한 번 막은 뒤 다시 쓰는 중이면 또 막지 않음(끝없는 반복 방지)
    lines = []
    try:
        with open(data.get('transcript_path') or '', encoding='utf-8') as f:
            for line in f:
                try: lines.append(json.loads(line))
                except Exception: pass
    except Exception: return
    start = 0
    for i, e in enumerate(lines):
        if is_real_user(e): start = i + 1
    bad = [t.strip() for e in lines[start:] if e.get('type') == 'assistant' for t in texts_of(e) if t.strip() and english_only(t)]
    if bad:
        print(json.dumps({'decision': 'block', 'reason': '이 저장소의 모든 글은 한국어예요(CLAUDE.md 2절, LESSON.md U1). 이번 턴에 영어로만 쓴 글이 있어요: 「' + bad[-1][:120] + '」 — 같은 내용을 한국어로 다시 써서 답을 마치세요.'}, ensure_ascii=False))

main()
