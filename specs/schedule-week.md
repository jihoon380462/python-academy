# 이번 주 시간표 — 11/2(월) ~ 11/5(목) · Fable 절약 모드

**상황**: Fable 주간 한도 90% 소진 → 목요일까지 Fable 은 쉰다. 이 기간 **모든 작업은 Opus 네 팀 + ChatGPT(아트)** 가 한다. Fable 은 목요일에 돌아와 `[core]` 커밋 검토(workflow 4절)와 수학 M2 core 를 한다.

## 0. 이번 주 임시 규칙 (workflow 1절·8절의 예외, 11/5까지)

1. **릴리스 당번 = 유지보수팀(Opus)**. 배포 권한이 Fable 이상이지만, 이번 주는 **사용자 지시로** 유지보수팀이 대신 한다. 절차는 4절. 사용자가 GitHub 에서 PR 「Merge」 버튼을 누르는 것도 같은 효과(그 뒤 릴리스 커밋만 유지보수팀).
2. **아래 3절의 `[core]` 항목은 Opus 가 해도 된다** — 파일·함수·바꿀 내용이 전부 적혀 있으므로 workflow 1절 "지시서에 파일과 단계가 적힌 core 수정"에 해당. 커밋 접두 `[core]`, 적힌 범위 밖은 건드리지 않는다. 적힌 대로 해도 안 되면 QA.md 에 「Fable 재확인」으로 남기고 넘어간다.
3. 수학 `courses/math/content.js` 는 콘텐츠팀이 **영역 4·2 노드 추가(C10)** 로 쓴다(Fable M2 core 는 목요일 이후). 단 새 그림 kind·새 문제 type 은 만들지 않는다 — 기존 16종으로 되는 노드만.

## 1. 시간표 (팀별 · 하루 단위, 릴리스 창은 매일 18:00)

| | 월 11/2 (오후) | 화 11/3 | 수 11/4 | 목 11/5 |
| --- | --- | --- | --- | --- |
| **QA팀** | 2회전: 알고·수학 정적 전수 검사(퀴즈 ans·why·수식·숫자 답 재계산) → QA.md | 2회전 마무리 + v2.3.8 재검(전날 릴리스분) | 3회전: C6~C8·C10 신규 콘텐츠 + core 수정 15건 재현 확인 | 4회전: 전체 회귀 + 사용자 브라우저 확인 항목 정리 → Fable 인수인계 표 |
| **유지보수팀** | 3절 core 항목 **A그룹(#4·#6·#7·#9·#10·#11·#15, 한 줄짜리)** → `fix/core-a` PR · 18:00 릴리스 당번 | 3절 **B그룹(#1·#2·#8·#12·#14, 함수 하나)** + **D그룹(#34·#35 사용자 제보)** → PR · QA 2회전 열림 항목 · 릴리스 | 3절 **C그룹(#3 모의고사·#5·#13·#32)** · QA 3회전 항목 · 릴리스 | 남은 열림 전부 · 릴리스 · HANDOFF 상태판을 Fable 용으로 정리 |
| **콘텐츠팀** | C6 파이썬 L9~L18 힌트 점검 → PR | C7 알고 힌트 점검 → PR · C8 알고 실전 연습 6문제 → PR | **C10 수학 영역 4 노드 6개**(아래 5절) → PR | **C10 수학 영역 2 노드 4개** → PR · C9 난이도 표기 |
| **아트팀** | A0 90장 전수 재검수 → IMAGES.md 메모 PR | A1 6차 요청서: 영역 4·2 아이콘 2 + 영역 뱃지 2 + (자리 생기면) 노드 아이콘 — IMAGES.md 3절 | ChatGPT 납품 검수 → `art/6차` PR | 반려분 재검수 · 7차 요청서 초안(레슨 머리 그림 자리는 Fable 에게 제안만) |
| **ChatGPT** | — | 6차 생성 시작 | 납품 | 반려분 재생성 |
| **사용자** | GitHub main 보호 규칙 켜기(workflow 8절 6) · 18:00 PR 머지 확인 | 블록 문제·KaTeX·모의고사 시간을 실제 폰에서 한 번(QA #13·#14) | 폰 QA | Fable 호출: 「목요일 인수인계 읽고 M2 시작」 |

하루 흐름: 오전 각 팀 브랜치 작업 → 오후 PR → **18:00 유지보수팀이 초록 PR 병합·릴리스(4절)** → 저녁 QA 가 새 버전 재검. PR 이 빨간색이면 낸 팀이 고친다(병합 금지).

## 2. 병렬 규칙 (충돌 방지)

- 같은 파일·같은 줄 금지: 힌트 줄은 콘텐츠팀(C6·C7)만, 지문·정답·테스트·문구는 유지보수팀. core 파일은 3절 항목 외 금지.
- `courses/math/content.js`: 콘텐츠팀 C10 은 **파일 끝 `LESSONS`·`PROBLEMS` 배열 안 마지막에 추가**, 유지보수 #32·#13 은 기존 줄 수정 → 자동 병합됨.
- `core/config.js` 의 total/lessons 숫자는 PR 마다 바뀐다 → 충돌 나면 **실제 수(validate 가 알려 줌)** 로 맞춘다.
- 릴리스 커밋만 `APP_VERSION`·`sw.js`·HTML `?v=` 를 바꾼다(팀 PR 은 금지).

## 3. 유지보수팀에게 위임하는 `[core]` 수정 (QA.md 1회전, 파일·내용 지정)

A그룹 — 한 줄:
- **#4** `core/ui-core.js` `go(...)`: `Store.data.last = {...}` 바로 뒤에 `Store.save();` 추가.
- **#6** `core/visualize.js` `player(...)` 끝 `const ro = new ResizeObserver(() => render(1));` → `const ro = new ResizeObserver(() => { if (!host.isConnected) { ro.disconnect(); return; } render(1); });`
- **#7** `core/engine.js` `Grader.checkNum` 2배 규칙 두 줄(`near(v, target * 2)`, `near(v, target / 2)`)에 조건 `(Math.abs(target) > 2 || !Number.isInteger(target)) &&` 를 앞에 붙인다.
- **#9** `core/ui.css` 끝에 `[data-contrast="1"] .btn.danger{color:#1d2230}` 추가.
- **#10** `core/ui.css` 끝에 `.ch-title span{word-break:keep-all}.ch-toggle{white-space:nowrap}` 추가.
- **#11** `core/ui.css` 끝에 `.hc.soon .hc-body{flex-direction:column;align-items:flex-start;gap:4px}` 추가.
- **#15** `core/ui-views-main.js` `runCode` 안 `a.download = st.upload && st.upload.origName ? b.dataset.dl.replace(...)` : 올린 파일 이름(확장자 뺀 것)이 결과 파일 이름(확장자 뺀 것)과 같으면 접미사 없이 `b.dataset.dl` 그대로.

B그룹 — 함수 하나:
- **#1** `core/figure.js` `Fig.kinds.sieve.draw` 마지막 `return \`${N}까지 소수는 ${primes.length}개\``: 체를 끝까지 돌린 진짜 소수 수로. 함수 앞부분에 `const full = []; const g2 = new Array(N + 1).fill(0); for (let q = 2; q <= N; q++) { if (g2[q]) continue; full.push(q); for (let k = q * q; k <= N; k += q) g2[k] = 1; }` 를 두고 `full.length` 를 쓴다. 안내 문구의 「지금까지 소수 n개 확인」은 그대로.
- **#2** `core/ui-views-math.js` `MathUI.plain(latex)`: 치환 순서·누락 수정 — ① 맨 앞에서 `\left`·`\right` 제거, `\quad`·`\qquad`·`\,`·`\;`·`\ ` → 공백, `\bmod` → ` mod `, `\cdots`·`\ldots` → `…`, `\operatorname{X}` → `X`, `\text{X}` → `X`, `\binom{n}{r}` → `C(n, r)`, `\hat{v}` → `v̂`, `\iff` → `⇔`, `\Rightarrow` → `⇒`, `\lfloor`/`\rfloor` → `⌊`/`⌋`, `\gcd`·`\det`·`\min`·`\max` → 글자 그대로 ② `\frac{a}{b}` 치환을 `while (/\\frac\{/.test(s))` 로 반복(중첩) ③ 그 뒤에 기존 `\le`·`\ge` 등. 확인: M1_mod·M1_gcd·M3_perm·M3_normal·M5_rotate 의 2쪽 수식 폴백이 읽히는지(KaTeX 막힌 환경에서).
- **#8** `sw.js` `message` 핸들러 `status`: `a` 를 `Math.min((await shell.keys()).length, ASSETS.length)` 로.
- **#12** 문구 3곳: `core/config.js` math 의 `hubLabel` 값을 `'언제든 들어와도 돼요'` 로 · `core/hub.js` `contLabel` 의 `` `${esc(lastCourse.name)} 코스 이어서 하기` `` 를 `lastCourse.space ? `${…} 이어서 하기` : 기존` 으로 · `core/ui-views-main.js` `onClear` 의 `'레슨 완료! '`·`'레슨 완료! 지도로'` 를 `Game.isGraph() ? '노드 완료! ' : '레슨 완료! '` 식으로.
- **#14** `core/ui-editors.js` `Blocks.setup()` 의 `Blockly.Msg.` 줄에 `Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF = '아니고 만약'; Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE = '아니면';` 추가 → 그 뒤 파이썬 L4P1·L4P5 힌트의 「다른 경우」「아니라면」을 「아니고 만약」「아니면」으로.

C그룹 — 조금 큼:
- **#3** `core/ui-views-main.js` `Views.problem`: `const inMock = !!(session && session.mock);` 를 `st` 선언 근처에 두고 ① `renderMode` 의 세 곳 `Coach.mount(...)` 를 `inMock ? null : Coach.mount(...)` ② `render()` 의 `#btnAnswer` 버튼을 `inMock` 이면 그리지 않음(힌트 버튼은 유지) ③ `fb('#fbHint'…)`·`fbDesc` 는 그대로. 확인: AB4 모의고사 시작 → 1번 문제에 따라하기·정답 보기 없음, 끝낸 뒤 일반 문제에는 다시 있음.
- **#5** `core/ui-views-more.js` DOMContentLoaded 의 `goHash` 에서 `UI.go('lesson', { lessonId: id, page: 0 })` 를 `page: (Store.data.lessons[id] || {}).page || 0` 로(레슨이 저장한 진행 쪽 복원). 허브 링크는 그대로.
- **#13** 콘텐츠: `courses/python/content.js` L5P6 힌트 2 를 블록 5칸 전제 없이 — 「출력 블록 하나에 글자 합치기(f"{n} x {i} = {n * i}") 블록을 넣으세요」 식으로(정답 코드와 같은 출력이 나오게).
- **#32** 콘텐츠: `courses/math/content.js` M5_dist 첫 그림 `vecs` 의 `label` 을 레슨 글과 같게 `'A'`·`'B'`, 안내 문구(`b − a`)도 `B − A` 로 맞추거나 레슨 글을 소문자로 — 한쪽으로 통일.

D그룹 — 사용자 플레이 제보(11/2 14:30, 수학 탐구 퀴즈):
- **#34 탐구 퀴즈 잠금 조건** `core/ui-views-math.js` `MathUI.modeExplore`: 지금은 그림을 아무렇게나 움직이면 보기가 열림. 문제에 `unlockWhen: (p) => 조건` 함수가 있으면 **그 조건이 참이 될 때만** 열리게 — `onChange: (np) => { if (p.unlockWhen && !p.unlockWhen(np)) return; …보기 활성… }`, 게이트 문구도 `p.unlockText || '🎚 먼저 위 그림을 움직여 보세요 — 그래야 보기가 열려요'`. 콘텐츠: `courses/math/content.js` 의 M1_mod_q2 에 `unlockWhen: (p) => p.n % p.m === 0, unlockText: '🎚 n을 m의 배수로 맞추면 보기가 열려요'` 추가. 같은 식으로 지문이 "~로 맞춰 보세요"인 탐구 퀴즈(M1_gcd_q2 서로소 `gcd(p.a,p.b)===1`, M1_seq_q2 `p.r === 1`, M3_cond_q2 `p.pab === p.pa * p.pb / 100`, M5_add_q1 정반대, M5_dot_q1 내적 0 등 — 조건을 쓸 수 있는 것만)에도 붙인다. `tools/validate_content.mjs` 에 `unlockWhen` 이 있으면 함수인지 검사 한 줄.
- **#35 모바일에서 그림 글자 잘림** `core/figure.js` `Fig.kinds.modring.draw`: 오른쪽 설명(`${n} = ${m} × …`, `12칸 원을 1바퀴 돌고 11칸 더`)이 폰 폭(390px)에서 캔버스 밖으로 나감. `W < 480` 이면 원을 위쪽 가운데(cx = W/2, R 작게)에 두고 글자 네 줄을 원 아래에 가운데 정렬로 쌓는다. 다른 kind 도 같은 규칙으로 점검(euclid·floatline·montecarlo·cells 의 오른쪽 글자).

각 그룹 = 브랜치 하나(`fix/core-a` 등) = PR 하나. 커밋 제목 `[core] QA #4 #6 #7 …: 한 줄 수정 7건`. PR 본문에 항목 번호와 확인 방법. QA.md 해당 행 상태를 「닫힘 [core] PR#n (Fable 검토 대기)」로.

## 4. 릴리스 당번 절차 (유지보수팀, 매일 18:00)

1. `git fetch origin && git switch main && git reset --hard origin/main`
2. `gh api "repos/jihoon380462/python-academy/pulls?state=open" -q '.[] | "\(.number) \(.head.ref) \(.title)"'` 로 열린 PR 확인. 각 PR 의 `PR Check` 가 초록인지: `gh api "repos/jihoon380462/python-academy/commits/<브랜치 최신 sha>/check-runs" -q '.check_runs[] | "\(.name) \(.conclusion)"'`. 빨간 PR 은 건너뛰고 낸 팀에 알린다(QA.md 맨 위 「릴리스 메모」).
3. 초록 PR 을 순서대로 `git merge --no-edit origin/<브랜치>` (충돌 나면 2절 규칙으로 해결 — `core/config.js` 숫자는 validate 가 말해 주는 실제 수).
4. 게이트: `node tools/validate_content.mjs && node tools/extract.mjs tools/.out && python3 tools/run_solutions.py && node tools/test_shell.mjs && python3 tools/regress.py` — 하나라도 실패하면 **배포하지 않는다**. 원인 PR 을 되돌리고(`git reset --hard origin/main` 후 그 PR 빼고 다시) 낸 팀에 알린다.
5. 릴리스 커밋: `core/config.js` `APP_VERSION` 패치 +1 → `node tools/stamp.mjs` → CHANGELOG `## 미배포` 아래 항목들을 `## vX.Y.Z — 날짜 (릴리스 당번 Opus)` 머리글 아래로 옮기고 `## 미배포` 는 비워 둠 → HANDOFF 0절 상태판 「현재 버전」「마지막 작업 (Opus·유지보수 릴리스)」 → `git commit -m "vX.Y.Z: 릴리스 — PR #n, #m"` → `git push origin main` (main 보호가 켜져 있으면 `release/vX.Y.Z` 브랜치로 PR 을 내고 사용자가 Merge).
6. `gh run list --workflow "Deploy to GitHub Pages" --limit 1` 이 `completed success` 인지 확인. 실패면 `gh run view <id> --log-failed` 를 QA.md 릴리스 메모에 붙이고 멈춘다.
7. 사용자에게 보고: 버전, 들어간 PR 번호, 확인할 화면.

## 5. 콘텐츠팀 C10 — 수학 영역 4·2 노드 (기존 그림 종류만, Fable M2 의 콘텐츠 선행분)

`CHAPTERS` 에 `{ ch: 4, name: '함수·변화·미적분', color: '#9c27b0', icon: '📈' }`, `{ ch: 2, name: '논리·집합·증명', color: '#00acc1', icon: '🔗' }` 추가(`MAP_DECOR` 도). `shared/badges.js` 에 `math_area_4`·`math_area_2` 뱃지(기존 math_area_1 과 같은 꼴). 노드는 M1 과 같은 스키마(첫 그림·observe 2~3·탐구 퀴즈 2·숫자 답 1·코드 1). 수치는 반드시 코드로 계산해 `answer.value` 를 넣고 `run_solutions` 로 확인.

| 노드 id | 제목(질문형) / 부제 | 그림 kind·구성 | prereq |
| --- | --- | --- | --- |
| M4_linear | 얼마나 빨리 변하나 / 일차함수와 기울기 | `plot` fns `a*x+b`, params a·b, probe | — |
| M4_quad | 던진 공은 왜 포물선인가 / 이차함수 | `plot` fns `a*x*x+b*x+c`, marks 꼭짓점 `-b/(2*a)` | M4_linear |
| M4_explog | 두 배씩 vs 반씩 / 지수·로그 함수 | `plot` fns `pow(b,x)`, `log(x)/log(b)`, `x` (M1_log 그림 재사용 가능) | M1_power |
| M4_trig | 돌면서 오르내리기 / 삼각함수와 단위원 | `unitcircle` params deg | M5_vec |
| M4_limit | 가까이 갈수록 / 극한의 수치 체험 | `plot` fns `sin(x)/x`, probe x → 0 근처 값 읽기, 또는 `(1+1/x)^x` | M4_linear |
| M4_tangent | 그 순간의 기울기 / 미분 = 접선 | `plot` fns `x*x`, 접선 `2*a*x - a*a`(param a), 할선 `(pow(a+h,2)-a*a)/h*(x-a)+a*a`(param h) — h 를 0 으로 보내며 접선에 붙는 것 | M4_limit |
| M2_set | 겹치는 것, 합치는 것 / 집합 연산 | `venn` (params pa·pb·pab) — 합·교·차집합과 파이썬 `set` 연산 | — |
| M2_logic | 참과 거짓의 조합 / 명제와 진리표 | `bits`(bits: 2 또는 3) 로 p·q 비트 토글 → 코드에서 and/or/not 표 출력 | — |
| M2_func | 짝이 하나씩 / 함수·일대일·역함수 | `plot` fns `a*x+b` 와 역함수 `(x-b)/a`, `x` 점선 대칭 | M4_linear |
| M2_pigeon | 비둘기가 상자보다 많으면 / 비둘기집 원리 | `cells` count 12·cols 4 classify 로 상자(색)·비둘기 수 param | — |

적분·수치미분·경사하강·귀납법(도미노)·모순법은 새 그림 kind(surface·steps·넓이 칠하기)가 필요 → Fable M2. 목록에 없는 노드는 만들지 않는다.

## 6. 목요일 Fable 인수인계 (QA팀 4회전이 정리)

- QA.md: 열림 중 「Fable 재확인」·「Fable」 담당만 모아 맨 위에 표. `[core]` PR 번호 목록(검토 대상).
- HANDOFF 상태판: 이번 주 릴리스 버전들과 들어간 PR.
- IMAGES.md: 6차 결과, 7차 초안.
- 콘텐츠: C10 으로 들어간 노드 목록 → Fable 이 M2 core(새 그림 4종 + 나머지 노드 + 색 동기화)를 그 위에 얹는다.
