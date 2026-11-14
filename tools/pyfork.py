#!/usr/bin/env python3
"""tools/pyfork.py — 무거운 모듈을 한 번만 불러 둔 파이썬에서, 예제마다 fork 한 새 프로세스로 `python3 main.py` 처럼 실행해요.
check_book.mjs 가 써요(11/15 CI 2단계, LESSON.md U16).

왜
  check_book 은 예제마다 python3 를 새로 띄워요. 데이터 분석(pandas 0.44초) · 머신러닝(scikit-learn 1.2초) 예제는
  코드 실행보다 모듈 불러오기가 더 오래 걸려서 교과서 하나에 90초 넘게 걸렸어요.

어떻게
  serve: 모듈을 미리 불러 두고 유닉스 소켓에서 기다려요. 소켓 파일이 보이면 준비 끝이에요(다 불러온 뒤에 만들어요).
  run:   자기 stdin · stdout · stderr 를 소켓으로 넘겨요(SCM_RIGHTS). 서버는 요청마다 fork 한 자식에서 그 파일을 실행하고,
         run 은 자식의 종료 코드로 끝나요. 그래서 부르는 쪽(execFileSync)에는 `python3 main.py` 와 같은 출력 · 종료 코드가 보여요.
  자식은 작업 폴더 · sys.argv · sys.path[0] · __main__ 모듈 · 트레이스백(이 도구의 줄은 빼고) · 문법 에러 · sys.exit · atexit ·
  스레드 기다리기를 `python3 main.py` 와 같게 맞춰요. 예제마다 새 프로세스라 앞 예제의 변수 · 파일 · 설정이 남지 않아요.
  이어받는 것은 미리 불러 둔 모듈(sys.modules)뿐이에요.

쓰는 법
  python3 tools/pyfork.py serve <소켓> <모듈> [<모듈> …]
  python3 tools/pyfork.py run <소켓> <제한 초> main.py [인자 …]
  서버는 2분 동안 요청이 없으면 스스로 끝나요(부른 쪽이 죽어도 남지 않게).
"""
import json
import os
import signal
import socket
import struct
import sys

IDLE = 120  # 초


def _send(conn, obj, fds=()):
    data = json.dumps(obj).encode()
    msg = struct.pack('!I', len(data)) + data
    if fds:
        socket.send_fds(conn, [msg], list(fds))
    else:
        conn.sendall(msg)


def _recv(conn, maxfds=0):
    fds = []
    if maxfds:
        buf, fds, _flags, _addr = socket.recv_fds(conn, 65536, maxfds)
    else:
        buf = conn.recv(65536)
    if not buf:
        return None, fds
    while len(buf) < 4 or len(buf) < 4 + struct.unpack('!I', buf[:4])[0]:
        more = conn.recv(65536)
        if not more:
            raise EOFError('메시지가 끊김')
        buf += more
    n = struct.unpack('!I', buf[:4])[0]
    return json.loads(buf[4:4 + n]), fds


def _exit_code(e):
    # python3 의 SystemExit 처리와 같게: None → 0, 정수 → 그 값, 그 밖 → 글을 stderr 에 쓰고 1
    c = e.code
    if c is None:
        return 0
    if isinstance(c, int):
        return c & 0xFF
    try:
        sys.stderr.write(str(c) + '\n')
    except Exception:
        pass
    return 1


def _run_main(argv):
    """`python3 argv[0] argv[1:]` 처럼 실행하고 종료 코드를 돌려줘요."""
    import atexit
    import builtins
    import importlib.machinery
    import threading
    import types
    path = os.path.abspath(argv[0])  # python3 main.py 도 __file__ · 트레이스백은 절대 경로(3.9~)
    sys.argv = list(argv)
    sys.path[0] = os.path.dirname(path)
    mod = types.ModuleType('__main__')
    mod.__dict__.update({'__file__': path, '__cached__': None, '__builtins__': builtins, '__spec__': None, '__package__': None,
                         '__loader__': importlib.machinery.SourceFileLoader('__main__', path)})
    sys.modules['__main__'] = mod
    rc = 0
    try:
        with open(path, 'rb') as f:
            src = f.read()
        exec(compile(src, path, 'exec', dont_inherit=True), mod.__dict__)
    except SystemExit as e:
        rc = _exit_code(e)
    except BaseException as e:  # noqa: B036 — 실행한 코드의 에러는 python3 처럼 트레이스백으로
        tb = e.__traceback__
        while tb is not None and tb.tb_frame.f_code.co_filename != path:
            tb = tb.tb_next  # 이 도구의 줄(exec 부른 곳)은 빼요. 문법 에러는 남는 줄이 없어 python3 처럼 머리글 없이 나와요
        e.__traceback__ = tb  # 3.12~ 의 excepthook 은 넘긴 tb 가 아니라 예외에 붙은 트레이스백을 써요
        sys.__excepthook__(type(e), e, tb)
        rc = 1
    try:
        threading._shutdown()  # python3 도 끝나기 전에 데몬이 아닌 스레드를 기다려요
    except Exception:
        pass
    try:
        atexit._run_exitfuncs()
    except Exception:
        pass
    return rc


def _child(req, fds):
    code = 1
    try:
        for i, fd in enumerate(fds[:3]):
            os.dup2(fd, i)
        for fd in fds:
            if fd > 2:
                os.close(fd)
        os.chdir(req['cwd'])
        if req.get('timeout'):
            signal.alarm(int(req['timeout']))  # 부르는 쪽 제한 시간보다 조금 길게 — 무한 반복이면 스스로 끝나요
        code = _run_main(req['argv'])
    except BaseException:
        import traceback
        traceback.print_exc()
        code = 70
    finally:
        for s in (sys.stdout, sys.stderr):
            try:
                s.flush()
            except Exception:
                pass
        os._exit(code)


def serve(sock_path, mods):
    import importlib
    try:
        for m in mods:
            importlib.import_module(m)
    except BaseException:  # 못 불러오면 <소켓>.fail 을 만들어 부른 쪽이 바로 알게(stderr 는 경고만 있어도 차서 신호로 못 써요)
        import traceback
        traceback.print_exc()
        open(sock_path + '.fail', 'w').close()
        sys.exit(1)
    for s in (sys.stdout, sys.stderr):
        s.flush()  # 자식이 서버의 출력 버퍼를 이어받지 않게
    srv = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    tmp = sock_path + '.tmp'
    srv.bind(tmp)
    srv.listen(8)
    os.rename(tmp, sock_path)  # 한 번에 나타나요 — 보이면 준비 끝
    srv.settimeout(IDLE)
    while True:
        try:
            conn, _ = srv.accept()
        except socket.timeout:
            break
        conn.settimeout(None)
        try:
            req, fds = _recv(conn, 3)
            if req is None:
                continue
            if req.get('cmd') == 'stop':
                break
            pid = os.fork()
            if pid == 0:
                srv.close()
                conn.close()
                _child(req, fds)
            for fd in fds:
                os.close(fd)  # 서버가 쥐고 있으면 부르는 쪽이 출력 끝(EOF)을 못 봐요
            _, status = os.waitpid(pid, 0)
            try:
                _send(conn, {'code': os.waitstatus_to_exitcode(status)})
            except OSError:
                pass  # 부르는 쪽이 이미 끝남(제한 시간)
        except Exception as e:  # 서버는 계속 돌아요
            try:
                _send(conn, {'error': repr(e)})
            except Exception:
                pass
        finally:
            conn.close()
    try:
        os.unlink(sock_path)
    except OSError:
        pass


def run(sock_path, timeout, argv):
    c = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
    c.connect(sock_path)
    _send(c, {'cwd': os.getcwd(), 'argv': argv, 'timeout': timeout}, fds=[0, 1, 2])
    res, _ = _recv(c)
    if not res or 'error' in res:
        os.write(2, f'pyfork: 서버 에러 {res}\n'.encode())
        os._exit(70)
    code = res['code']
    if code < 0:  # 시그널로 끝남 — 같은 시그널로 끝내요
        signal.signal(-code, signal.SIG_DFL)
        os.kill(os.getpid(), -code)
    os._exit(code)


if __name__ == '__main__':
    if len(sys.argv) >= 3 and sys.argv[1] == 'serve':
        serve(sys.argv[2], sys.argv[3:])
    elif len(sys.argv) >= 5 and sys.argv[1] == 'run':
        run(sys.argv[2], int(sys.argv[3]), sys.argv[4:])
    else:
        sys.exit(__doc__)
