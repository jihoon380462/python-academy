#!/usr/bin/env python3
"""tools/asm_book_run.py — 어셈블리어 교과서(BOOK.check = 'asm') 예시 답 · 예제를 진짜로 빌드하고 실행 (v2.31.0, 설계 specs/asm-course.md 6절)

stdin: JSON {code, stdin?, echoExit?}  →  stdout: JSON {out, exit, error?, stage?}
- code 가 여러 파일이면 줄 하나로 나눔:  「; ==== 파일: add.asm ====」 · 「// ==== 파일: main.c ====」 (그 줄 아래가 그 파일)
  나누는 줄이 없으면 main.asm 하나.
- .asm → nasm -f elf64 -g -F dwarf,  .c → gcc -c -O0 -g
- 링크: .c 가 있거나 어느 .asm 에 「global main」 이 있으면 gcc -no-pie, 아니면 ld  (학습자가 우분투에서 치는 명령과 같음)
- 실행: ./prog (stdin 은 그대로, 5초 제한). echoExit 이면 터미널의 「./prog; echo $?」 처럼 출력 바로 뒤에 종료 코드 숫자를 붙임
"""
import json, os, re, subprocess, sys, tempfile

MARK = re.compile(r'^(?:;|//)\s*====\s*파일:\s*(\S+)\s*====\s*$', re.M)


def split_files(code):
    ms = list(MARK.finditer(code))
    if not ms:
        return [('main.asm', code)]
    files = []
    for i, m in enumerate(ms):
        end = ms[i + 1].start() if i + 1 < len(ms) else len(code)
        files.append((m.group(1), code[m.end():end].lstrip('\n')))
    return files


def run(req):
    code = req['code']
    with tempfile.TemporaryDirectory(prefix='asm-') as d:
        files = split_files(code)
        objs, has_c, has_main = [], False, False
        for name, src in files:
            p = os.path.join(d, name)
            with open(p, 'w', encoding='utf-8') as f:
                f.write(src if src.endswith('\n') else src + '\n')
            if name.endswith('.asm'):
                if re.search(r'^\s*global\s+main\b', src, re.M):
                    has_main = True
                o = name[:-4] + '.o'
                r = subprocess.run(['nasm', '-f', 'elf64', '-g', '-F', 'dwarf', name, '-o', o], cwd=d, capture_output=True, text=True)
                if r.returncode:
                    return {'error': (r.stderr or r.stdout).strip(), 'stage': 'nasm ' + name}
                objs.append(o)
            elif name.endswith('.c'):
                has_c = True
                o = name[:-2] + '.o'
                r = subprocess.run(['gcc', '-c', '-O0', '-g', name, '-o', o], cwd=d, capture_output=True, text=True)
                if r.returncode:
                    return {'error': (r.stderr or r.stdout).strip(), 'stage': 'gcc -c ' + name}
                objs.append(o)
            # 그 밖의 파일(입력 .txt 등)은 그대로 둠
        link = ['gcc', '-no-pie', *objs, '-o', 'prog'] if (has_c or has_main) else ['ld', *objs, '-o', 'prog']
        r = subprocess.run(link, cwd=d, capture_output=True, text=True)
        if r.returncode:
            return {'error': (r.stderr or r.stdout).strip(), 'stage': ' '.join(link[:2])}
        try:
            r = subprocess.run(['./prog'], cwd=d, input=req.get('stdin') or '', capture_output=True, text=True, timeout=5)
        except subprocess.TimeoutExpired:
            return {'error': '5초 안에 안 끝남(끝나지 않는 반복?)', 'stage': 'run'}
        code_ = r.returncode
        if code_ < 0:  # 시그널로 죽음 — 터미널은 128+시그널 번호 (Segmentation fault 면 139)
            return {'error': f'시그널 {-code_} 로 멈춤' + (' (Segmentation fault)' if code_ == -11 else ''), 'stage': 'run', 'out': r.stdout}
        out = r.stdout
        if req.get('echoExit'):
            out = out + str(code_) + '\n'
        return {'out': out, 'exit': code_}


if __name__ == '__main__':
    print(json.dumps(run(json.load(sys.stdin)), ensure_ascii=False))
