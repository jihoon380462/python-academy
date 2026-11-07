// courses/vim/content.js — 공용 「Vim 에디터 교과서」 (v2.11.0, 사용자 요청 2026-11-06 「공용에 windows 버전 vim 에디터 설치 및 사용법 그리고 단축키 교과서 만들어, 파이썬과 연결하고 자동 띄어쓰기 및 자동완성 기능까지」)
// 처음부터 교과서 모드(book.js + core/ui-views-book.js). 문제·채점 없음(PROBLEMS 빈 배열). 연습은 사용자 PC 의 gVim(Windows).
// 레슨 쪽 example.code = 따라 칠 키(설명 주석 포함). 「만들어 보기」·준비 명령·단축키 도감은 book.js. 검사: node tools/check_book.mjs (진짜 vim 으로 키를 넣어 결과 파일 비교)
const COURSE = { id: 'vim', name: 'Vim 에디터', runner: 'none', bench: false,
  tutorPersona: '너는 Vim 을 처음 보는 학생에게 Windows 의 gVim 을 가르치는 선생님이다. 키는 「무엇을 하는지 → 어떻게 치는지 → 잘못 치면 어떻게 되는지」 순서로 설명한다.' };
const CHAPTERS = [
  { ch: 1, name: '기본기 — 모드와 단축키', color: '#019833' },
  { ch: 2, name: '파이썬과 연결', color: '#3776ab' },
];
// _vimrc 내용(레슨 6·10 의 예제 상자와 book.js 「만들어 보기」 가 같이 씀 — 한곳에서 고치기). check_book 이 기본 설정을 진짜 vim 으로 읽어 에러가 없는지 본다
const VIMRC_BASE_TEXT = "\" ~/_vimrc — 파이썬 아카데미 Vim 교과서 기본 설정 (레슨 6~9)\n\" 위치: C:\\Users\\내이름\\_vimrc  ·  고친 뒤 :w 하고 :source %\nunlet! skip_defaults_vim\nsource $VIMRUNTIME/defaults.vim   \" Vim 권장 기본값(구문 색·마우스·검색 미리보기·마지막 위치 기억)\n\n\" ---- 글자·화면 (레슨 6)\nset encoding=utf-8                \" 한글이 깨지지 않게\nset fileencodings=utf-8,cp949     \" 파일 열 때 utf-8 먼저, 안 되면 옛 한글(cp949)\nset number                        \" 줄 번호\nset clipboard=unnamed             \" y·p 가 Windows 클립보드와 통하게\nset nobackup noundofile           \" 파일~ · .un~ 찌꺼기 파일 만들지 않기\nset ignorecase smartcase hlsearch \" 찾기: 소문자면 대소문자 무시, 찾은 곳 칠하기 (레슨 5)\nif has('gui_running')\n  set guifont=Consolas:h12\n  set guifontwide=Malgun_Gothic:h12  \" 한글은 맑은 고딕\nendif\n\n\" ---- 파이썬 자동 들여쓰기 (레슨 7)\nfiletype plugin indent on         \" .py 를 알아보고 : 뒤 들여쓰기, return 뒤 내어쓰기\nset autoindent                    \" Enter 치면 윗줄 깊이로\nset expandtab                     \" Tab 키 = 스페이스\nset tabstop=4 shiftwidth=4 softtabstop=4\n\n\" ---- 파이썬 실행 (레슨 8): F5 저장+실행, F6 위 창(터미널)에서 실행(input 있는 프로그램)\naugroup py_run\n  autocmd!\n  autocmd FileType python nnoremap <buffer> <F5> :w<CR>:!python %<CR>\n  autocmd FileType python nnoremap <buffer> <F6> :w<CR>:terminal python %<CR>\naugroup END\n\n\" ---- 기본 자동완성 (레슨 9): Ctrl+n / Ctrl+p\nset completeopt=menuone";
const VIMRC_PLUG_TEXT = "\" ---- 플러그인 자동완성 (레슨 10) — _vimrc 맨 아래에 붙이기\n\" 먼저 vim-plug(plug.vim)를 C:\\Users\\내이름\\vimfiles\\autoload\\ 에 설치\ncall plug#begin()\nPlug 'prabirshrestha/vim-lsp'\nPlug 'mattn/vim-lsp-settings'\nPlug 'prabirshrestha/asyncomplete.vim'\nPlug 'prabirshrestha/asyncomplete-lsp.vim'\ncall plug#end()\n\n\" 자동완성 목록: Tab / Shift+Tab 으로 고르고 Enter 로 정하기 (목록이 없으면 Tab 은 그대로)\ninoremap <expr> <Tab>   pumvisible() ? \"\\<C-n>\" : \"\\<Tab>\"\ninoremap <expr> <S-Tab> pumvisible() ? \"\\<C-p>\" : \"\\<S-Tab>\"\ninoremap <expr> <CR>    pumvisible() ? asyncomplete#close_popup() : \"\\<CR>\"\n\n\" 언어 서버가 켜진 파일에서 쓸 키: K 설명 · gd 정의로 · F2 이름 바꾸기 · ]g [g 다음/이전 문제\nfunction! s:on_lsp_buffer_enabled() abort\n  setlocal omnifunc=lsp#complete\n  setlocal signcolumn=yes\n  nmap <buffer> K <plug>(lsp-hover)\n  nmap <buffer> gd <plug>(lsp-definition)\n  nmap <buffer> <F2> <plug>(lsp-rename)\n  nmap <buffer> ]g <plug>(lsp-next-diagnostic)\n  nmap <buffer> [g <plug>(lsp-previous-diagnostic)\nendfunction\naugroup lsp_install\n  autocmd!\n  autocmd User lsp_buffer_enabled call s:on_lsp_buffer_enabled()\naugroup END";
const LESSONS = [
// ================= 챕터 1 기본기 =================
{ id: 'V0', ch: 1, n: 0, title: '모드, 그리고 빠져나오기', mode: 'text', tutorSummary: '노멀·입력·명령줄·비주얼 모드. 켜면 노멀 모드. i 로 입력, Esc 로 노멀. :w :q :wq :q!.',
  pages: [
    { title: 'Vim 은 왜 다를까: 모드', html: `<p>메모장이나 VS Code 는 키를 누르면 그 글자가 바로 써지죠. Vim 은 <b>모드</b>가 있어서, 같은 키가 모드에 따라 다른 일을 해요.</p>
<table class="kb"><tbody><tr><td><b>노멀 모드</b></td><td>켜면 처음 있는 곳. 키가 전부 <b>명령</b>이에요 — <code>j</code> 는 아래로, <code>x</code> 는 한 글자 지우기, <code>dd</code> 는 한 줄 지우기</td></tr><tr><td><b>입력 모드</b></td><td>글자를 쓰는 모드. 노멀에서 <code>i</code> 를 누르면 들어가고, 아래에 <code>-- INSERT --</code>(한국어면 <code>-- 끼워넣기 --</code>)가 보여요</td></tr><tr><td><b>명령줄 모드</b></td><td>노멀에서 <code>:</code> 를 치면 맨 아래에 커서가 가요. <code>:w</code>(저장) 같은 긴 명령을 쳐요</td></tr><tr><td><b>비주얼 모드</b></td><td>노멀에서 <code>v</code> — 마우스로 끄는 것처럼 영역을 골라요(레슨 4)</td></tr></tbody></table>
<p>모든 모드에서 <kbd>Esc</kbd> 를 누르면 <b>노멀 모드로 돌아와요</b>. 헷갈리면 일단 <kbd>Esc</kbd> 두 번. 이게 Vim 의 첫째 규칙이에요.</p>
<p>왜 이렇게 만들었을까요? 코드를 고칠 때는 <b>쓰는 시간보다 옮겨 다니고 고치는 시간이 훨씬 길어요</b>. 노멀 모드에서는 마우스·방향키 없이 손가락을 글쇠 위에 둔 채로 「세 줄 지워」「이 단어 바꿔」 를 두세 글자로 해요.</p>`, example: { code: 'i          ← 입력 모드로 (아래에 -- INSERT --)\n안녕 Vim    ← 글자 쓰기\nEsc        ← 노멀 모드로 돌아오기\nx          ← 커서 글자 하나 지우기\nu          ← 방금 한 일 되돌리기' } },
    { title: '저장하고 나가기: :w · :q · :wq · :q!', html: `<p>「Vim 에서 못 나가요」 는 유명한 농담이에요. 나가는 법은 전부 <b>노멀 모드에서 <code>:</code></b> 로 시작해요. 친 뒤 <kbd>Enter</kbd>.</p>
<table class="kb"><tbody><tr><td><code>:w</code></td><td>저장(write)</td></tr><tr><td><code>:q</code></td><td>나가기(quit). 저장 안 한 게 있으면 거절해요</td></tr><tr><td><code>:wq</code></td><td>저장하고 나가기 (<code>:x</code> · <code>ZZ</code> 도 같아요)</td></tr><tr><td><code>:q!</code></td><td><b>저장하지 않고</b> 나가기 — 고친 걸 버려요</td></tr><tr><td><code>:w 이름.txt</code></td><td>다른 이름으로 저장</td></tr><tr><td><code>:e 파일</code></td><td>파일 열기(edit). 없는 파일이면 새로 만들어요(<code>:w</code> 할 때 생겨요)</td></tr></tbody></table>
<pre class="code">E37: No write since last change (add ! to override)</pre>
<p>이 빨간 줄은 「고친 걸 저장 안 했어요. 그래도 나가려면 <code>!</code> 를 붙이세요」 예요. 저장하려면 <code>:wq</code>, 버리려면 <code>:q!</code>.</p>
<div class="bk-warn"><b>갇혔다 싶으면</b>: <kbd>Esc</kbd> 두세 번 → <code>:q!</code> → <kbd>Enter</kbd>. 어떤 상태에서든 빠져나와요.</div>`, example: { code: ':w         ← 저장\n:wq        ← 저장하고 나가기\n:q!        ← 저장하지 않고 나가기\n:e ~/vim-study/play.txt   ← 연습 파일 열기' } },
    { title: 'gVim · 터미널 Vim · 한글 입력', html: `<p>Windows 에서 Vim 을 여는 곳은 세 군데예요. 이 교과서는 <b>gVim</b> 기준이에요.</p>
<table class="kb"><tbody><tr><td><b>gVim</b> (시작 메뉴 → <b>Vim 9.2</b> 폴더 → <b>gVim</b>)</td><td>창이 있는 Vim. 메뉴·마우스·한글 글꼴이 편하고, 노멀 모드로 나오면 <b>한글 입력을 알아서 꺼 줘요</b></td></tr><tr><td><code>vim</code> (명령 프롬프트·PowerShell)</td><td>설치 때 <b>Command line support</b> 의 「Vim launchers」·「Add to PATH」(예전 판은 「Create .bat files」)를 켜면 어디서나 <code>vim 파일</code> 로 열려요. 같은 설정 파일(<code>_vimrc</code>)을 써요</td></tr><tr><td><code>vim</code> (Git Bash 안)</td><td>Git for Windows 가 따로 넣어 둔 <b>다른</b> Vim 이에요. 설정 파일도 따로(<code>~/.vimrc</code>). 커밋 메시지 쓸 때 열리는 게 이것</td></tr></tbody></table>
<p><b>한글 입력 주의</b>: 터미널에서 연 Vim 은 한글 입력 상태로 <kbd>Esc</kbd> 를 누르면 노멀 모드 명령이 <code>ㅓ</code>·<code>ㅇ</code> 처럼 한글로 들어가 안 먹혀요. 그럴 땐 <kbd>한/영</kbd> 키로 영어로 바꾸고 다시. gVim 은 이걸 알아서 해 줘요.</p>
<p>모르는 게 있으면 <code>:help 단어</code> — 예: <code>:help :w</code>, <code>:help dd</code>. 도움말 창은 <code>:q</code> 로 닫아요.</p>`, example: { code: ':help dd     ← dd 의 도움말\n:q          ← 도움말 창 닫기\n:version    ← 버전과 설정 파일 위치' } },
  ],
  summary: ['켜면 노멀 모드 — 키가 명령', 'i 로 입력, Esc 로 노멀', ':w 저장 · :q 나가기 · :wq · :q! 버리고 나가기'] },
{ id: 'V1', ch: 1, n: 1, title: '움직이기', mode: 'text', tutorSummary: 'hjkl, w b e, 0 ^ $, gg G nG, Ctrl+d/u, f문자 ; , %. 숫자를 앞에 붙이면 반복.',
  pages: [
    { title: 'h j k l 과 숫자 붙이기', html: `<p>방향키도 되지만, Vim 사람들은 손을 안 움직이려고 <b>h j k l</b> 을 써요.</p>
<table class="kb"><tbody><tr><td><code>h</code></td><td>← 왼쪽</td></tr><tr><td><code>j</code></td><td>↓ 아래 (j 가 아래로 처진 모양)</td></tr><tr><td><code>k</code></td><td>↑ 위</td></tr><tr><td><code>l</code></td><td>→ 오른쪽</td></tr></tbody></table>
<p>명령 앞에 <b>숫자</b>를 붙이면 그만큼 반복해요. <code>5j</code> = 아래로 5줄, <code>3l</code> = 오른쪽으로 3칸. 이 「숫자 + 명령」 은 거의 모든 명령에 통해요(<code>3dd</code> = 3줄 지우기).</p>
<p class="muted small"><code>:set number</code> 로 줄 번호를 켜면 몇 줄 갈지 세기 쉬워요(레슨 6 에서 설정 파일에 넣어요).</p>`, example: { code: 'j j j      ← 아래로 한 줄씩\n5j         ← 아래로 5줄\nk          ← 위로\n3l         ← 오른쪽 3칸\nh          ← 왼쪽' } },
    { title: '단어와 줄: w · b · e · 0 · ^ · $', html: `<table class="kb"><tbody><tr><td><code>w</code></td><td>다음 <b>단어</b> 처음으로 (word)</td></tr><tr><td><code>b</code></td><td>앞 단어 처음으로 (back)</td></tr><tr><td><code>e</code></td><td>단어 끝으로 (end)</td></tr><tr><td><code>0</code></td><td>줄 맨 앞 (0번째 칸)</td></tr><tr><td><code>^</code></td><td>줄의 첫 <b>글자</b> (들여쓰기 공백 건너뛰기 — 코드에서 편함)</td></tr><tr><td><code>$</code></td><td>줄 맨 끝</td></tr></tbody></table>
<p>대문자 <code>W</code> <code>B</code> <code>E</code> 는 띄어쓰기만 단어 경계로 봐요. <code>print("hi")</code> 에서 <code>w</code> 는 <code>(</code>·<code>"</code> 마다 멈추지만 <code>W</code> 는 통째로 건너뛰어요.</p>`, example: { code: 'w w w      ← 단어씩 오른쪽\nb          ← 한 단어 뒤로\ne          ← 단어 끝\n$          ← 줄 끝\n0          ← 줄 맨 앞\n^          ← 첫 글자(들여쓰기 다음)' } },
    { title: '파일 안에서 멀리: gg · G · 숫자G · Ctrl+d/u', html: `<table class="kb"><tbody><tr><td><code>gg</code></td><td>파일 <b>맨 위</b></td></tr><tr><td><code>G</code></td><td>파일 <b>맨 아래</b></td></tr><tr><td><code>12G</code> 또는 <code>:12</code></td><td><b>12번째 줄</b>로 — 에러 메시지의 「line 12」 로 바로 갈 때</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>d</kbd> · <kbd>Ctrl</kbd>+<kbd>u</kbd></td><td>반 화면 아래(down) · 위(up)</td></tr><tr><td><code>%</code></td><td>짝 괄호로 — <code>(</code> 위에서 누르면 짝 <code>)</code> 로</td></tr><tr><td><code>''</code></td><td>(작은따옴표 두 번) 방금 뛰기 전 자리로 돌아가기</td></tr></tbody></table>
<p>파이썬 에러가 <code>File "a.py", line 12</code> 라고 하면 Vim 에서 <code>12G</code> 한 번이면 그 줄이에요.</p>`, example: { code: 'G          ← 맨 아래\ngg         ← 맨 위\n5G         ← 5번째 줄\n:3         ← 3번째 줄 (Enter)\nCtrl+d     ← 반 화면 아래' } },
    { title: '한 줄 안에서 찾아가기: f · t · ; · ,', html: `<p>줄 안의 특정 글자로 한 번에 가요.</p>
<table class="kb"><tbody><tr><td><code>f(</code></td><td>오른쪽에서 처음 나오는 <code>(</code> <b>위로</b> (find)</td></tr><tr><td><code>t(</code></td><td><code>(</code> <b>바로 앞</b>까지 (till)</td></tr><tr><td><code>F(</code></td><td>왼쪽으로 찾기</td></tr><tr><td><code>;</code> · <code>,</code></td><td>방금 찾은 걸 다음 · 이전으로 반복</td></tr></tbody></table>
<p><code>x = add(1, 2)</code> 에서 <code>f,</code> 하면 쉼표로, <code>f(</code> 하면 괄호로 한 번에 가요. 다음 레슨들의 「지우기·바꾸기」 와 합치면 <code>dt)</code>(<code>)</code> 앞까지 지우기) 같은 강력한 명령이 돼요.</p>`, example: { code: 'f(         ← ( 위로\nf,         ← , 위로\n;          ← 다음 , 로\nt)         ← ) 바로 앞까지\n0          ← 줄 앞으로 돌아가기' } },
  ],
  summary: ['hjkl, 숫자를 붙이면 반복', 'w b e 단어 · 0 ^ $ 줄', 'gg G 12G · f( 로 글자 찾아가기'] },
{ id: 'V2', ch: 1, n: 2, title: '입력하기', mode: 'text', tutorSummary: 'i a I A o O 로 입력 모드 들어가기. Esc 로 나오기. 입력 중 Ctrl+w(단어 지우기).',
  pages: [
    { title: 'i · a · I · A: 어디서부터 쓸까', html: `<table class="kb"><tbody><tr><td><code>i</code></td><td>커서 <b>앞</b>에서부터 쓰기 (insert)</td></tr><tr><td><code>a</code></td><td>커서 <b>뒤</b>에서부터 쓰기 (append)</td></tr><tr><td><code>I</code></td><td>줄의 첫 글자 앞에서 (들여쓰기 다음)</td></tr><tr><td><code>A</code></td><td>줄 <b>맨 끝</b>에서 — 코드 줄 끝에 <code>:</code> 붙일 때 가장 많이 써요</td></tr></tbody></table>
<p>다 쓰면 <kbd>Esc</kbd>. 입력 모드에서 방향키로 돌아다니지 말고, <kbd>Esc</kbd> → 노멀에서 이동 → 다시 <code>i</code>/<code>A</code> 가 Vim 의 리듬이에요.</p>`, example: { code: 'A:Esc      ← 줄 끝에 : 붙이기 (A, :, Esc)\nI# Esc     ← 줄 앞에 "# " (주석으로)\nffaxEsc    ← f 위로 가서 그 뒤에 x' } },
    { title: 'o · O: 새 줄 열기', html: `<table class="kb"><tbody><tr><td><code>o</code></td><td>아래에 <b>새 줄</b>을 열고 입력 모드 (open)</td></tr><tr><td><code>O</code></td><td>위에 새 줄</td></tr></tbody></table>
<p>줄 끝으로 가서 Enter 를 치는 것과 같지만 커서가 어디 있든 한 키로 돼요. 파이썬에서 <code>o</code> 를 누르면 <b>윗줄 들여쓰기를 이어서</b> 열어 줘요(레슨 7 설정을 하면 <code>:</code> 뒤에서는 한 칸 더 들어가요).</p>
<p>입력 모드에서 쓸 만한 키: <kbd>Ctrl</kbd>+<kbd>w</kbd> 앞 단어 지우기 · <kbd>Ctrl</kbd>+<kbd>u</kbd> 줄 앞까지 지우기 · <kbd>Backspace</kbd>.</p>`, example: { code: 'o- 운동Esc     ← 아래에 새 줄 "- 운동"\nOTITLEEsc      ← 위에 새 줄 "TITLE"' } },
    { title: 'Esc 가 멀면, 그리고 자주 하는 실수', html: `<ul><li><kbd>Esc</kbd> 대신 <kbd>Ctrl</kbd>+<kbd>[</kbd> 도 똑같이 노멀 모드로 가요(손이 덜 움직여요).</li>
<li>노멀 모드인 줄 모르고 글을 치면 명령이 마구 실행돼요. 예: <code>hello</code> 를 치면 <code>h</code> 왼쪽, <code>e</code> 단어 끝, <code>l</code>, <code>l</code>, <code>o</code> → 새 줄이 열리고 입력 모드. 이상하게 됐으면 <kbd>Esc</kbd> 후 <code>u</code> 로 되돌려요.</li>
<li>입력 모드인 줄 모르고 <code>:wq</code> 를 치면 글자로 써져요. 화면 아래 <code>-- INSERT --</code> 가 있으면 먼저 <kbd>Esc</kbd>.</li></ul>
<p>「지금 무슨 모드지?」 는 <b>화면 맨 아래 줄</b>을 봐요. 아무것도 없으면 노멀, <code>-- INSERT --</code> 면 입력, <code>-- VISUAL --</code> 면 비주얼.</p>`, example: { code: 'Esc Esc    ← 확실히 노멀로\nu          ← 실수 되돌리기\nCtrl+r     ← 되돌린 걸 다시' } },
  ],
  summary: ['i 앞 · a 뒤 · I 줄 앞 · A 줄 끝', 'o 아래 새 줄 · O 위 새 줄', '모드가 헷갈리면 화면 맨 아래를 보고 Esc'] },
{ id: 'V3', ch: 1, n: 3, title: '지우기·바꾸기·되돌리기', mode: 'text', tutorSummary: 'x dd D, 연산자(d c y) + 이동(w $ t) 문법, cw ciw ci" cc C r, u Ctrl+r, . 반복.',
  pages: [
    { title: 'x · dd · D · u · Ctrl+r', html: `<table class="kb"><tbody><tr><td><code>x</code></td><td>커서 글자 하나 지우기</td></tr><tr><td><code>dd</code></td><td>한 <b>줄</b> 지우기 (<code>3dd</code> = 3줄)</td></tr><tr><td><code>D</code></td><td>커서부터 줄 끝까지 지우기</td></tr><tr><td><code>r</code>글자</td><td>커서 글자 하나를 그 글자로 바꾸기 (<code>r0</code>)</td></tr><tr><td><code>u</code></td><td>되돌리기 (undo) — 몇 번이든</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>r</kbd></td><td>되돌린 걸 다시 (redo)</td></tr></tbody></table>
<p>지운 것은 사라지지 않고 Vim 의 「주머니(레지스터)」 에 들어가요. 그래서 <code>dd</code> 로 지운 줄을 <code>p</code> 로 붙일 수 있어요 = <b>잘라내기</b>(레슨 4).</p>`, example: { code: 'x          ← 글자 하나 지우기\ndd         ← 줄 지우기\nu          ← 되돌리기\nCtrl+r     ← 다시\n3dd        ← 3줄 지우기' } },
    { title: 'Vim 의 문법: 연산자 + 이동', html: `<p>Vim 명령은 <b>「무엇을 할지(연산자) + 어디까지(이동)」</b> 로 조립돼요. 외울 게 확 줄어요.</p>
<table class="kb"><tbody><tr><td><b>연산자</b></td><td><code>d</code> 지우기 · <code>c</code> 지우고 입력(change) · <code>y</code> 복사(yank) · <code>&gt;</code> 들여쓰기</td></tr><tr><td><b>이동</b></td><td><code>w</code> 단어 · <code>$</code> 줄 끝 · <code>t)</code> ) 앞까지 · <code>G</code> 끝까지 · <code>j</code> 아랫줄까지</td></tr></tbody></table>
<p>그래서 <code>dw</code> = 단어 지우기, <code>d$</code> = 줄 끝까지 지우기, <code>dt)</code> = <code>)</code> 앞까지 지우기, <code>dG</code> = 끝까지 전부, <code>yw</code> = 단어 복사, <code>cw</code> = 단어 바꾸기. 연산자를 두 번 쓰면 「한 줄」 이에요: <code>dd</code> <code>cc</code> <code>yy</code> <code>&gt;&gt;</code>.</p>`, example: { code: 'dw         ← 단어 지우기\nd$         ← 줄 끝까지\ndt)        ← ) 앞까지\ncw새말Esc   ← 단어를 "새말"로\ncc         ← 줄 통째로 다시 쓰기' } },
    { title: '안쪽 고르기: ciw · ci" · ci(', html: `<p>커서가 단어나 따옴표 <b>한가운데</b> 있어도 통째로 고르는 「안쪽(inner)」 이동이 있어요. 코드 고칠 때 가장 많이 써요.</p>
<table class="kb"><tbody><tr><td><code>ciw</code></td><td>커서가 있는 <b>단어</b>를 바꾸기 (change inner word)</td></tr><tr><td><code>ci"</code></td><td><code>"</code> 안쪽 글자를 바꾸기 — <code>print("안녕")</code> 에서 따옴표 안만</td></tr><tr><td><code>ci(</code></td><td>괄호 안쪽 바꾸기 — 함수 인자 통째로</td></tr><tr><td><code>diw</code> · <code>da"</code></td><td>지우기. <code>a</code> 는 따옴표·괄호까지 같이(around)</td></tr></tbody></table>
<p><code>color = 'red'</code> 의 아무 곳에서나 <code>ci'</code> → <code>blue</code> → <kbd>Esc</kbd> 하면 <code>color = 'blue'</code>. 커서가 따옴표 앞에 있어도 그 줄의 첫 따옴표 쌍을 찾아가요.</p>`, example: { code: "ciwhelloEsc   ← 단어를 hello 로\nci\"안녕Esc     ← \"...\" 안을 안녕으로\nci(a, bEsc     ← (...) 안을 a, b 로\nda\"           ← 따옴표까지 지우기" } },
    { title: '. 으로 반복하기', html: `<p><code>.</code>(점) 은 <b>방금 한 고치기를 한 번 더</b> 해요. Vim 에서 가장 시간을 아껴 주는 키예요.</p>
<pre class="code">TODO 빨래
TODO 설거지
TODO 청소</pre>
<p>첫 줄에서 <code>cw</code> → <code>DONE</code> → <kbd>Esc</kbd> 한 번 한 다음, <code>j0.</code>(아래 줄 앞으로 가서 반복) 을 두 번이면 세 줄이 다 <code>DONE</code> 이 돼요.</p>
<p>「똑같은 고치기를 여러 군데」 → 한 번 하고, 옮겨 가서 <code>.</code>. 여러 번이 아니라 수십 곳이면 레슨 5 의 <code>:%s</code> 가 더 빨라요.</p>`, example: { code: 'cwDONEEsc   ← 첫 TODO 를 DONE 으로\nj0.        ← 아래 줄 앞에서 반복\nj0.        ← 또' } },
  ],
  summary: ['x 글자 · dd 줄 · D 줄 끝까지 · u 되돌리기', '연산자(d c y >) + 이동(w $ t) = 명령', 'ciw · ci" 안쪽 바꾸기 · . 으로 반복'] },
{ id: 'V4', ch: 1, n: 4, title: '복사·붙여넣기와 비주얼 모드', mode: 'text', tutorSummary: 'yy yw p P, dd p 로 옮기기. v V Ctrl+v 로 골라서 d y > I. 클립보드 "+y "+p, Ctrl+R +.',
  pages: [
    { title: 'yy · p · P: 복사와 붙여넣기', html: `<table class="kb"><tbody><tr><td><code>yy</code></td><td>한 줄 복사 (yank)</td></tr><tr><td><code>yw</code> · <code>y$</code></td><td>단어 · 줄 끝까지 복사</td></tr><tr><td><code>p</code></td><td>커서 <b>뒤(아래)</b>에 붙여 넣기 (put)</td></tr><tr><td><code>P</code></td><td>커서 <b>앞(위)</b>에 붙여 넣기</td></tr></tbody></table>
<p>줄을 복사했으면 줄 단위로(아래/위 줄에), 단어를 복사했으면 글자 단위로(커서 옆에) 붙어요.</p>
<p><b>잘라내기</b>는 따로 없어요 — <code>dd</code> 로 지우면 그게 곧 잘라내기예요. 그래서 <code>ddp</code> = 「이 줄을 아래 줄과 바꾸기」 예요.</p>`, example: { code: 'yy         ← 줄 복사\np          ← 아래에 붙이기\nddp        ← 이 줄과 아래 줄 바꾸기\n3yy        ← 3줄 복사' } },
    { title: '비주얼 모드: v · V · Ctrl+v', html: `<p>먼저 <b>고르고</b> 나서 명령하고 싶을 때 써요. 고른 다음 <code>d</code>(지우기) <code>y</code>(복사) <code>c</code>(바꾸기) <code>&gt;</code> <code>&lt;</code>(들여쓰기) 를 누르면 고른 곳에 적용돼요.</p>
<table class="kb"><tbody><tr><td><code>v</code></td><td>글자 단위로 고르기 — 움직이는 만큼</td></tr><tr><td><code>V</code></td><td><b>줄</b> 단위로 고르기 — 코드 블록을 고를 때</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>v</kbd></td><td><b>세로 네모</b>로 고르기 — 여러 줄 앞에 한꺼번에 쓰기</td></tr><tr><td><code>gv</code></td><td>방금 골랐던 곳 다시 고르기</td></tr></tbody></table>
<p>여러 줄 주석 달기: <kbd>Ctrl</kbd>+<kbd>v</kbd> → <code>jj</code>(세 줄) → <code>I</code> → <code># </code> → <kbd>Esc</kbd>. Esc 를 누르는 순간 세 줄 앞에 다 <code># </code> 가 생겨요.</p>
<p class="muted small">설치 때 「Remap a few keys」 를 골랐다면 <kbd>Ctrl</kbd>+<kbd>v</kbd> 가 붙여 넣기가 돼요. 그땐 <kbd>Ctrl</kbd>+<kbd>q</kbd> 가 세로 고르기예요(시작하기 1 에서 「Do not remap keys」 를 권하는 이유).</p>`, example: { code: 'Vjj>       ← 세 줄 골라 들여쓰기\nvey        ← 단어 하나 골라 복사\nCtrl+v jj I# Esc   ← 세 줄 앞에 "# "' } },
    { title: 'Windows 클립보드와 주고받기', html: `<p>Vim 의 <code>y</code> <code>p</code> 는 Vim 안의 주머니를 써요. 브라우저·메모장과 주고받으려면 <b>클립보드 주머니 <code>+</code></b> 를 이름으로 불러요.</p>
<table class="kb"><tbody><tr><td><code>"+yy</code></td><td>이 줄을 <b>Windows 클립보드로</b> 복사 → 다른 프로그램에서 <kbd>Ctrl</kbd>+<kbd>V</kbd></td></tr><tr><td><code>"+p</code></td><td>Windows 클립보드 내용을 붙여 넣기 (이 교과서의 📋 복사 → Vim 에서 <code>"+p</code>)</td></tr><tr><td>입력 모드에서 <kbd>Ctrl</kbd>+<kbd>r</kbd> <kbd>+</kbd></td><td>클립보드 붙여 넣기 (명령줄 <code>:</code> 에서도 됨 — 준비 명령 붙일 때)</td></tr><tr><td><code>:set clipboard=unnamed</code></td><td>그냥 <code>y</code>·<code>p</code> 가 늘 Windows 클립보드를 쓰게(레슨 6 설정 파일에 넣어요)</td></tr></tbody></table>
<p>gVim 은 메뉴 <b>편집(Edit) → 붙여넣기(Paste)</b> 로도 돼요.</p>`, example: { code: '"+yy        ← 줄을 Windows 클립보드로\n"+p         ← 클립보드에서 붙이기\n:Ctrl+r +   ← 명령줄에 클립보드 붙이기' } },
  ],
  summary: ['yy 복사 · p 아래 · P 위 · dd p 옮기기', 'v 글자 · V 줄 · Ctrl+v 세로 고르기', '"+y "+p 로 Windows 클립보드'] },
{ id: 'V5', ch: 1, n: 5, title: '찾기와 바꾸기', mode: 'text', tutorSummary: '/ ? n N *, :s/a/b/ :s///g :%s///g :%s///gc, ignorecase smartcase hlsearch :noh.',
  pages: [
    { title: '/ 로 찾기 · n · N · *', html: `<table class="kb"><tbody><tr><td><code>/단어</code> <kbd>Enter</kbd></td><td>아래로 찾기</td></tr><tr><td><code>?단어</code> <kbd>Enter</kbd></td><td>위로 찾기</td></tr><tr><td><code>n</code> · <code>N</code></td><td>다음 · 이전 찾은 곳</td></tr><tr><td><code>*</code></td><td>커서가 있는 <b>단어</b>를 바로 찾기 — 변수가 어디 쓰였나 볼 때</td></tr><tr><td><code>:noh</code></td><td>찾은 곳 칠하기 끄기</td></tr></tbody></table>
<p>찾은 다음 바로 고칠 수 있어요: <code>/버그</code> <kbd>Enter</kbd> → <code>cw</code> → <code>고침</code> → <kbd>Esc</kbd> → <code>n</code> → <code>.</code> → <code>n</code> → <code>.</code> … (찾기 + 반복).</p>`, example: { code: '/greet     ← greet 찾기 (Enter)\nn          ← 다음\nN          ← 이전\n*          ← 커서 단어 찾기\n:noh       ← 칠하기 끄기' } },
    { title: ':s 로 바꾸기', html: `<p>모양: <code>:범위s/찾을말/바꿀말/옵션</code></p>
<table class="kb"><tbody><tr><td><code>:s/cat/dog/</code></td><td><b>이 줄</b>의 첫 cat 하나만</td></tr><tr><td><code>:s/cat/dog/g</code></td><td>이 줄의 cat <b>전부</b> (global)</td></tr><tr><td><code>:%s/cat/dog/g</code></td><td><b>파일 전체</b>의 cat 전부 (<code>%</code> = 모든 줄)</td></tr><tr><td><code>:%s/cat/dog/gc</code></td><td>하나하나 <b>물어보고</b> (confirm) — <code>y</code> 바꾸기 · <code>n</code> 건너뛰기 · <code>a</code> 나머지 전부 · <code>q</code> 그만</td></tr><tr><td><code>:3,7s/a/b/g</code></td><td>3~7번째 줄에서만</td></tr></tbody></table>
<p>비주얼 모드로 줄을 고른 뒤 <code>:</code> 를 치면 <code>:'&lt;,'&gt;</code> 가 자동으로 붙어요 = 「고른 줄에서만」.</p>
<div class="bk-warn">변수 이름 바꾸기에 <code>:%s/i/n/g</code> 를 하면 <code>print</code> 의 i 까지 바뀌어요. <b>단어 통째로만</b>은 <code>:%s/\\&lt;i\\&gt;/n/g</code>(<code>\\&lt;</code> <code>\\&gt;</code> = 단어 경계), 또는 <code>gc</code> 로 확인하며.</div>`, example: { code: ':s/cat/dog/g        ← 이 줄 전부\n:%s/cat/dog/g       ← 파일 전체\n:%s/cat/dog/gc      ← 물어보며 (y/n/a/q)\n:%s/\\<i\\>/n/g      ← 단어 i 만' } },
    { title: '대소문자와 찾기 설정', html: `<table class="kb"><tbody><tr><td><code>:set ignorecase</code></td><td>대소문자 무시하고 찾기</td></tr><tr><td><code>:set smartcase</code></td><td>(ignorecase 와 같이) 찾는 말에 대문자가 있으면 그때만 구분 — 둘 다 켜 두는 게 편해요</td></tr><tr><td><code>:set hlsearch</code></td><td>찾은 곳 전부 칠하기</td></tr><tr><td><code>:set incsearch</code></td><td>치는 동안 미리 찾아 보여 주기</td></tr><tr><td><code>/print\\c</code></td><td>이번 한 번만 대소문자 무시</td></tr></tbody></table>
<p>이 <code>:set</code> 들은 Vim 을 끄면 사라져요. 늘 켜 두려면 레슨 6 의 설정 파일 <code>_vimrc</code> 에 적어요.</p>`, example: { code: ':set ignorecase smartcase\n:set hlsearch\n/Greet     ← 대문자가 있어 구분해서 찾기' } },
  ],
  summary: ['/ 찾기 · n N · * 커서 단어', ':s/a/b/g 이 줄 · :%s/a/b/g 전체 · gc 물어보며', 'ignorecase + smartcase · :noh'] },
{ id: 'VB1', ch: 1, boss: true, title: '보스: 기본기로 파일 고치기', mode: 'text', pages: [], summary: [], tutorSummary: '챕터 1 의 이동·입력·지우기·복사·바꾸기를 합쳐 실제 파일 고치기.' },
// ================= 챕터 2 파이썬과 연결 =================
{ id: 'V6', ch: 2, n: 6, title: '설정 파일 _vimrc', mode: 'text', tutorSummary: 'Windows 의 사용자 설정 파일은 C:\\Users\\이름\\_vimrc. :e ~/_vimrc 로 만들고 :source % 로 적용. defaults.vim, number, encoding, clipboard, 글꼴.',
  pages: [
    { title: '_vimrc 는 어디에, 어떻게 만드나', html: `<p>Vim 은 켤 때마다 <b>설정 파일</b>을 읽어요. Windows 에서 내 설정 파일은 <b><code>C:\\Users\\내이름\\_vimrc</code></b>(Vim 에서 <code>~/_vimrc</code>) 예요. 이름이 점 대신 <b>밑줄</b>로 시작해요.</p>
<div class="bk-step-box"><b>① 열기</b><br>gVim 에서 <code>:e ~/_vimrc</code> <kbd>Enter</kbd>. 없으면 빈 파일이 열려요(새로 만드는 것).</div>
<div class="bk-step-box"><b>② 쓰기</b><br>다음 쪽의 설정을 📋 복사 → Vim 노멀 모드에서 <code>"+p</code>(또는 메뉴 <b>편집 → 붙여넣기</b>).</div>
<div class="bk-step-box"><b>③ 저장하고 바로 적용</b><br><code>:w</code> → <code>:source %</code>(<code>%</code> = 지금 파일). 다음부터는 켤 때 자동으로 읽어요.</div>
<div class="bk-step-box"><b>④ 확인</b><br><code>:echo $MYVIMRC</code> 가 <code>C:\\Users\\내이름\\_vimrc</code> 를 보여 주면 그 파일을 쓰는 중이에요.</div>
<div class="bk-warn"><b><code>C:\\Program Files\\Vim\\_vimrc</code> 는 고치지 마세요.</b> 설치 프로그램이 만든 기본 파일이에요(관리자 권한이 필요하고, 다시 설치하면 덮어써져요). 내 <code>~/_vimrc</code> 가 생기면 Vim 은 그쪽만 읽어요 — 그래서 내 파일 첫 줄에서 Vim 기본값(<code>defaults.vim</code>)을 직접 불러와요.</div>`, example: { code: ':e ~/_vimrc       ← 설정 파일 열기(없으면 새로)\n"+p               ← 복사한 설정 붙이기\n:w                ← 저장\n:source %         ← 지금 바로 적용\n:echo $MYVIMRC    ← 어느 파일을 쓰는지' } },
    { title: '기본 설정 한 줄씩', html: `<p>아래가 이 교과서의 기본 <code>_vimrc</code> 예요(📋 복사). <code>"</code> 로 시작하는 줄·부분은 설명(주석)이라 Vim 이 무시해요. 레슨 7·8 의 들여쓰기·실행 설정도 이미 들어 있어요.</p>
<table class="kb"><tbody><tr><td><code>source $VIMRUNTIME/defaults.vim</code></td><td>Vim 이 권하는 기본값 — 구문 색, 마우스, 치는 동안 찾기, 마지막 위치 기억</td></tr><tr><td><code>set encoding=utf-8</code> · <code>fileencodings</code></td><td>한글이 깨지지 않게. 옛 한글 파일(cp949)도 열기</td></tr><tr><td><code>set number</code></td><td>줄 번호 — 에러의 line N 찾기</td></tr><tr><td><code>set clipboard=unnamed</code></td><td><code>y</code>·<code>p</code> 가 Windows 클립보드와 바로 통하게</td></tr><tr><td><code>set guifont=Consolas:h12</code> · <code>guifontwide</code></td><td>gVim 글꼴. 한글은 맑은 고딕</td></tr><tr><td><code>set nobackup noundofile</code></td><td>폴더에 <code>파일~</code>·<code>.un~</code> 같은 찌꺼기 파일을 안 만들게</td></tr></tbody></table>
<p>설정 하나만 시험해 보고 싶으면 파일에 쓰지 말고 <code>:set number</code> 처럼 바로 쳐 봐요. 끄기는 <code>:set nonumber</code>, 지금 값 보기는 <code>:set number?</code>.</p>`, example: { code: VIMRC_BASE_TEXT } },
  ],
  summary: ['내 설정 파일 = C:\\Users\\이름\\_vimrc (:e ~/_vimrc)', ':w 후 :source % 로 바로 적용', ':set 이름 / :set no이름 / :set 이름?'] },
{ id: 'V7', ch: 2, n: 7, title: '자동 들여쓰기 (파이썬)', mode: 'text', tutorSummary: 'filetype plugin indent on, autoindent, expandtab, tabstop/shiftwidth/softtabstop=4. 파이썬은 : 뒤 자동 들여쓰기, return 뒤 자동 내어쓰기. >> << . :retab.',
  pages: [
    { title: '파이썬에서 Enter 를 치면', html: `<p>파이썬은 <b>들여쓰기가 문법</b>이라 한 칸만 틀려도 <code>IndentationError</code> 가 나요. Vim 은 설정만 하면 VS Code 처럼 알아서 맞춰 줘요(<code>_vimrc</code> 에 이미 들어 있어요).</p>
<pre class="code">def add(a, b):█      ← Enter
    █                ← 4칸 들어가서 시작 (: 뒤라서)
    return a + b█    ← Enter
█                    ← return 뒤라 다시 바깥으로</pre>
<table class="kb"><tbody><tr><td><code>filetype plugin indent on</code></td><td>파일 종류(.py)를 알아보고 그 언어의 들여쓰기 규칙을 켜기 — <code>:</code> 뒤 들여쓰기, <code>return</code>·<code>break</code> 뒤 내어쓰기</td></tr><tr><td><code>set autoindent</code></td><td>Enter 를 치면 윗줄과 같은 깊이로 시작</td></tr></tbody></table>
<p>파이썬 파일(<code>.py</code>)을 열어야 켜져요. 확인: <code>:set filetype?</code> → <code>filetype=python</code>.</p>`, example: { code: ':set filetype?      ← filetype=python 이면 OK\n:set autoindent?\nodef f():Enter     ← 다음 줄이 4칸 들어가는지 보기' } },
    { title: '탭 대신 스페이스 4칸', html: `<p>파이썬 공식 권장(PEP 8)은 <b>들여쓰기 = 스페이스 4칸</b>이에요. 탭과 스페이스가 섞이면 <code>TabError</code> 가 나요.</p>
<table class="kb"><tbody><tr><td><code>set expandtab</code></td><td><kbd>Tab</kbd> 키를 누르면 스페이스로 바꿔 넣기</td></tr><tr><td><code>set tabstop=4</code></td><td>(이미 있는) 탭 글자를 4칸 너비로 보이기</td></tr><tr><td><code>set shiftwidth=4</code></td><td>자동 들여쓰기·<code>&gt;&gt;</code> 한 번 = 4칸</td></tr><tr><td><code>set softtabstop=4</code></td><td><kbd>Tab</kbd>·<kbd>Backspace</kbd> 가 4칸씩 — 스페이스인데도 한 번에 지워져요</td></tr><tr><td><code>:retab</code></td><td>파일의 탭 글자를 지금 설정(스페이스 4칸)으로 바꾸기</td></tr><tr><td><code>:set list</code></td><td>탭(<code>^I</code>)과 줄 끝(<code>$</code>)을 눈에 보이게 — 섞였는지 확인. 끄기 <code>:set nolist</code></td></tr></tbody></table>
<p class="muted small">Vim 의 파이썬 설정은 원래 이 값을 쓰지만, 다른 파일(.txt 등)에서도 같게 하려고 <code>_vimrc</code> 에 적어 둬요.</p>`, example: { code: ':set list      ← 탭이 ^I 로 보임\n:retab         ← 탭을 스페이스 4칸으로\n:set nolist' } },
    { title: '들여쓰기 고치기: >> · << · 비주얼 >', html: `<table class="kb"><tbody><tr><td><code>&gt;&gt;</code></td><td>이 줄 한 단계(4칸) 들여쓰기</td></tr><tr><td><code>&lt;&lt;</code></td><td>한 단계 내어쓰기</td></tr><tr><td><code>3&gt;&gt;</code></td><td>이 줄부터 3줄</td></tr><tr><td><code>V</code> → <code>j</code>… → <code>&gt;</code></td><td>고른 줄들. <code>.</code> 으로 한 단계 더</td></tr><tr><td>입력 모드 <kbd>Ctrl</kbd>+<kbd>t</kbd> · <kbd>Ctrl</kbd>+<kbd>d</kbd></td><td>쓰는 중에 한 단계 들여·내어쓰기</td></tr></tbody></table>
<p>코드를 <code>if</code> 안으로 넣을 때: 윗줄에 <code>if 조건:</code> 을 쓰고, 넣을 줄들을 <code>V</code> 로 고른 뒤 <code>&gt;</code>.</p>
<div class="bk-warn">C·자바에서 쓰는 <code>gg=G</code>(파일 전체 자동 정렬)는 파이썬에서는 쓰지 마세요. 파이썬은 들여쓰기가 곧 뜻이라 Vim 이 「어디까지가 if 안인지」 를 알 수 없어 망가질 수 있어요.</div>`, example: { code: '>>         ← 한 단계 들여쓰기\n<<         ← 내어쓰기\nVjj>       ← 세 줄 들여쓰기\n.          ← 한 단계 더' } },
  ],
  summary: ['filetype plugin indent on + autoindent = 파이썬 자동 들여쓰기', 'expandtab · tabstop=4 · shiftwidth=4 · softtabstop=4', '>> << · V 로 골라 > · :retab'] },
{ id: 'V8', ch: 2, n: 8, title: '파이썬 실행하기', mode: 'text', tutorSummary: ':!python %, F5 = :w + :!python %, F6 = :terminal python % (input 있는 프로그램), :term, 에러 line N → nG.',
  pages: [
    { title: ':!python % — Vim 에서 바로 실행', html: `<p><code>:!</code> 뒤에 쓰면 Vim 밖의 명령을 실행해요. <code>%</code> 는 <b>지금 파일 이름</b>으로 바뀌어요.</p>
<pre class="code">:w            ← 먼저 저장! (저장 안 하면 옛날 내용이 실행돼요)
:!python %    ← python hello.py 를 실행</pre>
<p>gVim 에서는 검은 창이 잠깐 열려 결과를 보여 주고 <code>Hit any key to close this window...</code>(아무 키나 누르면 닫힘)가 나와요.</p>
<table class="kb"><tbody><tr><td><code>'python' is not recognized…</code></td><td>Windows 가 python 을 못 찾음 → 파이썬 교과서 시작하기 1 의 <b>Add python.exe to PATH</b>. 설치 뒤 gVim 을 껐다 켜요</td></tr><tr><td><code>can't open file … No such file</code></td><td>파일을 아직 저장하지 않았어요(<code>:w 이름.py</code>)</td></tr><tr><td><code>File "hello.py", line 3</code></td><td>Vim 으로 돌아와 <code>3G</code> — 그 줄로</td></tr></tbody></table>`, example: { code: ':e ~/vim-study/hello.py\nOprint("안녕, Vim")Esc\n:w\n:!python %' } },
    { title: 'F5 한 번으로: 저장하고 실행', html: `<p>매번 <code>:w</code> <code>:!python %</code> 를 치기 번거로우니 <b>키 하나에 묶어요</b>(키 매핑). 기본 <code>_vimrc</code> 에 이미 들어 있어요.</p>
<pre class="code">augroup py_run
  autocmd!
  autocmd FileType python nnoremap &lt;buffer&gt; &lt;F5&gt; :w&lt;CR&gt;:!python %&lt;CR&gt;
  autocmd FileType python nnoremap &lt;buffer&gt; &lt;F6&gt; :w&lt;CR&gt;:terminal python %&lt;CR&gt;
augroup END</pre>
<table class="kb"><tbody><tr><td><code>autocmd FileType python</code></td><td>파이썬 파일을 열 때만</td></tr><tr><td><code>nnoremap &lt;F5&gt; …</code></td><td>노멀 모드에서 F5 = 뒤의 키를 친 것과 같게. <code>&lt;CR&gt;</code> = Enter</td></tr><tr><td><code>&lt;buffer&gt;</code></td><td>그 파일에서만</td></tr><tr><td><code>augroup … autocmd!</code></td><td><code>:source</code> 를 여러 번 해도 겹쳐 쌓이지 않게</td></tr></tbody></table>
<p>이제 파이썬 파일에서 <kbd>F5</kbd> = 저장 + 실행.</p>`, example: { code: 'F5         ← 저장하고 실행\nF6         ← 저장하고 아래 터미널 창에서 실행(input 용)' } },
    { title: 'input() 이 있는 프로그램: :terminal', html: `<p><code>:!python %</code> 로도 입력은 되지만, 입력하고 결과를 함께 오래 보려면 <b>Vim 안의 터미널 창</b>이 편해요.</p>
<table class="kb"><tbody><tr><td><code>:terminal python %</code> (<kbd>F6</kbd>)</td><td>창이 위아래로 나뉘고 <b>위</b> 창에서 프로그램이 돌아요(코드는 아래 창). 거기서 입력을 쳐요</td></tr><tr><td><code>:term</code></td><td>그냥 명령 프롬프트 창 하나 열기 — <code>pip install</code> 같은 걸 칠 때</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>w</kbd> <kbd>w</kbd></td><td>위아래 창 오가기</td></tr><tr><td><code>:q</code> · 프로그램이 끝난 창에서</td><td>터미널 창 닫기 (프로그램이 도는 중이면 <code>exit</code> 나 <kbd>Ctrl</kbd>+<kbd>c</kbd> 먼저)</td></tr></tbody></table>
<p>코드 창과 결과 창을 나란히 두고 「고치고 → <kbd>F6</kbd> → 확인」 을 반복하면 VS Code 의 실행 버튼과 같은 흐름이에요.</p>`, example: { code: 'F6           ← 위 창에서 실행 (입력 받기)\nCtrl+w w     ← 코드 창으로 돌아오기\n:term        ← 명령 프롬프트 창' } },
  ],
  summary: [':w 후 :!python % (% = 지금 파일)', 'F5 저장+실행 · F6 :terminal 로 실행(input)', '에러 line N → NG'] },
{ id: 'V9', ch: 2, n: 9, title: '자동완성 1 — Vim 기본기', mode: 'text', tutorSummary: '입력 모드 Ctrl+n Ctrl+p(열린 파일의 낱말), Ctrl+x Ctrl+f(파일 이름), Ctrl+x Ctrl+l(줄). completeopt.',
  pages: [
    { title: 'Ctrl+n · Ctrl+p: 이미 쓴 낱말 완성', html: `<p>플러그인 없이도 Vim 은 <b>열려 있는 파일에 이미 있는 낱말</b>로 자동완성을 해요. 긴 변수 이름을 두 번째부터는 앞 몇 글자만 치면 돼요.</p>
<table class="kb"><tbody><tr><td>입력 모드 <kbd>Ctrl</kbd>+<kbd>n</kbd></td><td>다음 후보 (next) — 목록이 뜨고 첫 후보가 들어가요</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>p</kbd></td><td>이전 후보 (previous)</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>y</kbd> · <kbd>Ctrl</kbd>+<kbd>e</kbd></td><td>이걸로 정하기 · 취소</td></tr><tr><td>그냥 계속 치기</td><td>고른 후보가 들어간 채로 이어 써져요</td></tr></tbody></table>
<pre class="code">student_scores = [90, 80]
print(stu█      ← Ctrl+n
print(student_scores█</pre>
<p>오타를 줄이는 데 효과가 커요. 단, 파이썬 문법을 아는 건 아니라서 <code>random.</code> 뒤에 함수 목록을 보여 주지는 못해요 — 그건 다음 레슨(LSP).</p>`, example: { code: 'ostudent_scores = [90, 80]Esc\noprint(stuCtrl+n)Esc      ← student_scores 로 완성' } },
    { title: 'Ctrl+x 모드: 파일 이름·줄 완성', html: `<p>입력 모드에서 <kbd>Ctrl</kbd>+<kbd>x</kbd> 를 누르고 다음 키로 「무엇으로 완성할지」 를 골라요.</p>
<table class="kb"><tbody><tr><td><kbd>Ctrl</kbd>+<kbd>x</kbd> <kbd>Ctrl</kbd>+<kbd>f</kbd></td><td><b>파일 이름</b> — <code>open("da</code> 다음에 누르면 <code>data.csv</code></td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>x</kbd> <kbd>Ctrl</kbd>+<kbd>l</kbd></td><td><b>줄 통째로</b> — 비슷한 줄을 다시 쓸 때</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>x</kbd> <kbd>Ctrl</kbd>+<kbd>o</kbd></td><td>언어에 맞는 완성(omni). 다음 레슨의 LSP 를 깔면 여기에 파이썬 문법 완성이 연결돼요</td></tr></tbody></table>
<p>후보 목록 모양은 <code>completeopt</code> 로 정해요. 기본 <code>_vimrc</code> 의 <code>set completeopt=menuone</code> 은 「후보가 하나여도 목록을 보여 주기」. 다음 레슨의 플러그인(asyncomplete)을 깔면 치는 동안 저절로 뜨는 목록에 맞게 이 값을 알아서 바꿔요.</p>`, example: { code: 'oopen("daCtrl+x Ctrl+f    ← 파일 이름 완성\nCtrl+x Ctrl+l             ← 줄 완성' } },
  ],
  summary: ['Ctrl+n / Ctrl+p 열린 파일의 낱말로', 'Ctrl+x Ctrl+f 파일 이름 · Ctrl+x Ctrl+l 줄', '파이썬 문법을 아는 완성은 LSP(다음 레슨)'] },
{ id: 'V10', ch: 2, n: 10, title: '자동완성 2 — 플러그인과 LSP', mode: 'text', tutorSummary: 'vim-plug 설치(PowerShell iwr 또는 Git Bash curl), Plug vim-lsp·vim-lsp-settings·asyncomplete·asyncomplete-lsp, :PlugInstall, .py 에서 :LspInstallServer pylsp-all, Tab/Enter 매핑, gd K F2, :LspStatus.',
  pages: [
    { title: 'LSP 가 뭐고 무엇이 필요한가', html: `<p><b>LSP(Language Server Protocol)</b> 는 「파이썬을 잘 아는 도우미 프로그램(언어 서버)」 과 편집기가 대화하는 약속이에요. VS Code 의 똑똑한 자동완성도 이걸로 돼요. Vim 에 플러그인 몇 개를 깔면 같은 도우미를 쓸 수 있어요.</p>
<ul><li><code>random.</code> 을 치면 <code>randint</code>·<code>choice</code>… 목록이 <b>저절로</b> 떠요</li><li>함수 이름 위에서 <code>K</code> → 설명, <code>gd</code> → 만든 곳으로 가기</li><li>틀린 코드에 표시(빨간 <code>E&gt;</code>·<code>W&gt;</code>)</li></ul>
<p><b>미리 있어야 하는 것</b> (둘 다 다른 교과서 시작하기에서 설치해요):</p>
<table class="kb"><tbody><tr><td><b>Git</b></td><td>플러그인을 받아 와요 — 터미널·Git 교과서 시작하기 1 (Git for Windows)</td></tr><tr><td><b>파이썬</b> (PATH 추가)</td><td>파이썬 언어 서버(pylsp)를 깔고 돌려요 — 파이썬 교과서 시작하기 1</td></tr></tbody></table>
<p>확인: 명령 프롬프트에서 <code>git --version</code> 과 <code>python --version</code> 이 둘 다 버전을 보여 주면 준비 완료.</p>`, example: { code: 'git --version      ← 명령 프롬프트에서\npython --version' } },
    { title: '① vim-plug 설치 (플러그인 관리자)', html: `<p><b>vim-plug</b> 는 플러그인을 이름만 적으면 받아 주는 관리자예요. 파일 하나(<code>plug.vim</code>)를 <code>C:\\Users\\내이름\\vimfiles\\autoload\\</code> 에 넣으면 설치 끝이에요.</p>
<div class="bk-step-box"><b>PowerShell 로</b> (<kbd>Win</kbd> → <code>powershell</code> → <b>Windows PowerShell</b>) — 아래 두 줄짜리 명령을 통째로 붙여 넣고 Enter:<pre>iwr -useb https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim |\`
    ni $HOME/vimfiles/autoload/plug.vim -Force</pre></div>
<div class="bk-step-box"><b>또는 Git Bash 로</b> (같은 자리에 받아요):<pre>curl -fLo ~/vimfiles/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim</pre></div>
<p>탐색기에서 <code>C:\\Users\\내이름\\vimfiles\\autoload\\plug.vim</code> 이 보이면 성공이에요.</p>
<p class="muted small">Git Bash 안의 vim 은 다른 Vim 이라 이 설정을 안 읽어요(<code>~/.vim</code>·<code>~/.vimrc</code>). 이 교과서는 gVim 기준이에요.</p>`, example: { code: 'iwr -useb https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim |`\n    ni $HOME/vimfiles/autoload/plug.vim -Force' } },
    { title: '② 플러그인 적고 :PlugInstall', html: `<p><code>_vimrc</code> 맨 아래에 이 덩어리를 붙여 넣어요(📋). 플러그인 네 개예요.</p>
<table class="kb"><tbody><tr><td><code>prabirshrestha/vim-lsp</code></td><td>Vim 이 언어 서버와 대화하는 부분</td></tr><tr><td><code>mattn/vim-lsp-settings</code></td><td>언어 서버를 명령 하나로 설치·설정</td></tr><tr><td><code>prabirshrestha/asyncomplete.vim</code></td><td>치는 동안 저절로 뜨는 자동완성 목록</td></tr><tr><td><code>prabirshrestha/asyncomplete-lsp.vim</code></td><td>그 목록에 언어 서버의 후보를 넣기</td></tr></tbody></table>
<p>저장(<code>:w</code>) → <code>:source %</code> → <code>:PlugInstall</code>. 옆에 창이 열리고 네 줄이 <code>- Finishing ... Done!</code> 이 되면 끝. 그 창은 <code>:q</code>.</p>
<p>아래의 키 설정: 목록이 떴을 때 <kbd>Tab</kbd>·<kbd>Shift</kbd>+<kbd>Tab</kbd> 으로 고르고 <kbd>Enter</kbd> 로 정해요. 목록이 없을 땐 Tab 은 그대로 들여쓰기예요.</p>`, example: { code: VIMRC_PLUG_TEXT } },
    { title: '③ 파이썬 언어 서버 설치와 쓰는 법', html: `<div class="bk-step-box"><b>설치 (한 번만)</b><br>gVim 으로 아무 <code>.py</code> 파일을 열고 <code>:LspInstallServer pylsp-all</code> <kbd>Enter</kbd>. 잠깐 내려받고 「Installed pylsp-all」 이 나오면 끝. 파일을 다시 열면(<code>:e</code>) 켜져요. 확인: <code>:LspStatus</code> → <code>pylsp-all: running</code>.</div>
<table class="kb"><tbody><tr><td>치는 동안</td><td>목록이 저절로 떠요 → <kbd>Tab</kbd> 고르기 · <kbd>Enter</kbd> 정하기 · 그냥 계속 치면 무시</td></tr><tr><td><code>K</code></td><td>커서 단어의 설명(함수 사용법) 창</td></tr><tr><td><code>gd</code></td><td>그 이름을 만든 곳(def)으로 가기. 돌아오기 <kbd>Ctrl</kbd>+<kbd>o</kbd></td></tr><tr><td><kbd>F2</kbd></td><td>이름 바꾸기 — 그 변수·함수를 쓰는 곳이 다 같이 바뀌어요</td></tr><tr><td><code>]g</code> · <code>[g</code></td><td>다음 · 이전 문제(에러·경고) 있는 곳</td></tr><tr><td><code>:LspDocumentFormat</code></td><td>코드 모양 정리(띄어쓰기·줄바꿈을 PEP 8 에 맞게)</td></tr></tbody></table>
<div class="bk-warn"><b>안 될 때</b><ul><li><code>E117: Unknown function: plug#begin</code> → ① 의 plug.vim 이 자리에 없어요.</li><li><code>:PlugInstall</code> 이 실패 → <code>git --version</code> 이 되는지, gVim 을 껐다 켰는지.</li><li>LspInstallServer 가 실패 → <code>python --version</code> 이 되는지(PATH). 다시 설치는 같은 명령을 한 번 더.</li><li>목록이 안 뜸 → <code>:LspStatus</code> 가 running 인지, 파일이 <code>.py</code> 인지(<code>:set filetype?</code>).</li></ul></div>`, example: { code: ':LspInstallServer pylsp-all   ← 한 번만\n:LspStatus                    ← running 확인\nK                             ← 설명\ngd                            ← 만든 곳으로\nF2                            ← 이름 바꾸기' } },
  ],
  summary: ['vim-plug 설치 → _vimrc 에 Plug 4줄 → :PlugInstall', '.py 에서 :LspInstallServer pylsp-all', '치면 목록 · Tab 고르기 · K 설명 · gd 정의로 · F2 이름 바꾸기'] },
{ id: 'V11', ch: 2, n: 11, title: '창·탭·여러 파일', mode: 'text', tutorSummary: ':e :sp :vsp Ctrl+w hjkl w, :q, :only, :tabnew gt gT, :ls :b, :Ex / :Lexplore 파일 탐색기, :wa :qa.',
  pages: [
    { title: '창 나누기: :sp · :vsp · Ctrl+w', html: `<table class="kb"><tbody><tr><td><code>:sp 파일</code></td><td>위아래로 나눠 열기 (split). 파일을 빼면 같은 파일을 두 곳에서</td></tr><tr><td><code>:vsp 파일</code></td><td>좌우로 나눠 열기 — 함수 정의와 쓰는 곳을 나란히</td></tr><tr><td><kbd>Ctrl</kbd>+<kbd>w</kbd> <kbd>h</kbd>/<kbd>j</kbd>/<kbd>k</kbd>/<kbd>l</kbd></td><td>그 방향 창으로 (<kbd>Ctrl</kbd>+<kbd>w</kbd> <kbd>w</kbd> = 다음 창)</td></tr><tr><td><code>:q</code> · <code>:only</code></td><td>이 창 닫기 · 이 창만 남기기</td></tr><tr><td><code>:wa</code> · <code>:qa</code> · <code>:wqa</code></td><td>전부 저장 · 전부 닫기 · 전부 저장하고 닫기</td></tr></tbody></table>
<p>창마다 따로 움직이지만 <code>y</code>·<code>p</code> 주머니는 같이 써요. 한 창에서 <code>yy</code> → <kbd>Ctrl</kbd>+<kbd>w</kbd> <kbd>j</kbd> → <code>p</code> 로 파일 사이 복사.</p>`, example: { code: ':vsp ~/vim-study/play.txt   ← 좌우로\nCtrl+w l     ← 오른쪽 창으로\nCtrl+w h     ← 왼쪽 창으로\n:only        ← 하나만 남기기' } },
    { title: '탭과 버퍼: :tabnew · gt · :ls · :b', html: `<table class="kb"><tbody><tr><td><code>:tabnew 파일</code></td><td>새 탭에 열기</td></tr><tr><td><code>gt</code> · <code>gT</code></td><td>다음 · 이전 탭</td></tr><tr><td><code>:ls</code></td><td>열어 둔 파일(버퍼) 목록과 번호</td></tr><tr><td><code>:b 2</code> · <code>:b 이름</code></td><td>그 파일로 바꾸기 (이름은 앞 몇 글자 + <kbd>Tab</kbd>)</td></tr><tr><td><code>:e #</code> · <kbd>Ctrl</kbd>+<kbd>^</kbd></td><td>바로 전 파일로 왔다 갔다</td></tr></tbody></table>
<p>Vim 은 한 번 연 파일을 닫지 않고 기억해 둬요(버퍼). 그래서 <code>:ls</code> 로 보고 <code>:b</code> 로 오가는 게 탭보다 많이 쓰여요.</p>`, example: { code: ':tabnew ~/_vimrc   ← 새 탭에\ngt                 ← 탭 오가기\n:ls                ← 연 파일 목록\n:b 1               ← 1번 파일로' } },
    { title: '파일 탐색기: :Ex · :Lexplore', html: `<p>Vim 에는 파일 탐색기(netrw)가 들어 있어요.</p>
<table class="kb"><tbody><tr><td><code>:Ex</code></td><td>지금 파일이 있는 폴더를 이 창에 보이기 (Explore)</td></tr><tr><td><code>:Lexplore</code></td><td>왼쪽에 탐색기 창을 세로로 — VS Code 의 탐색기처럼</td></tr><tr><td><kbd>Enter</kbd> · <code>-</code></td><td>열기 · 위 폴더로</td></tr><tr><td><code>%</code> · <code>d</code></td><td>(탐색기 안에서) 새 파일 · 새 폴더</td></tr><tr><td><code>:cd ~/vim-study</code> · <code>:pwd</code></td><td>Vim 의 작업 폴더 바꾸기 · 보기 (<code>:e</code>·<code>:!python</code> 이 여기 기준)</td></tr></tbody></table>
<p>프로젝트를 열 때: <code>:cd 프로젝트폴더</code> → <code>:Lexplore</code> → 파일 골라 <kbd>Enter</kbd>.</p>`, example: { code: ':cd ~/vim-study\n:Lexplore      ← 왼쪽 탐색기\n:Ex            ← 이 창에 탐색기' } },
  ],
  summary: [':sp :vsp + Ctrl+w hjkl', ':tabnew gt · :ls :b', ':Ex :Lexplore 탐색기 · :wa :qa'] },
{ id: 'VB2', ch: 2, boss: true, title: '보스: Vim 으로 파이썬 프로그램 만들기', mode: 'text', pages: [], summary: [], tutorSummary: '자동 들여쓰기·자동완성·F5 실행으로 작은 파이썬 프로그램을 Vim 에서만 만들기.' },
];
const PROBLEMS = []; // v2.19.0 N13: 이 코스의 옛 문제는 archive/classic/courses/vim/content.js // 교과서 전용 코스 — 문제·채점 없음(「만들어 보기」는 book.js)
