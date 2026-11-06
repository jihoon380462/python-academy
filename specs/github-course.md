# GitHub 교과서 — 설계 (N6, v2.15.4 · 2026-11-06 Opus)

> 사용자: 「T8 GitHub 가장 중요」(11/3) · 「2」(= N6 GitHub 심화 코스 설계, 11/6).
> 이 문서는 **설계**예요. 만들 때(구현) 이 문서를 그대로 따르고, 바뀌는 건 여기를 먼저 고쳐요.
> 출발점: `TODO.md` 「예정 코스」 T8 칸 · 지금 있는 터미널·Git 교과서(T0~T16·TB1~TB3) · 웹 교과서 W13(GitHub Pages).

---

## 1. 한 줄로

**「혼자 만든 코드」를 「남이 보고 같이 고치는 프로젝트」로.** 내 **진짜 GitHub 계정**으로 저장소를 꾸미고, Pull Request 로 협업하고, Actions 로 자동 검사를 걸고, Pages·Releases 로 세상에 내놓아요. 이 사이트(python-academy)가 운영되는 방식(브랜치 → PR → `verify` 초록 체크 → squash 병합 → Pages 자동 배포)이 마지막 보스예요.

## 2. 다른 교과서와의 경계 (겹침 정리 — 꼭 지킬 것)

| 주제 | 터미널·Git 교과서 (이미 있음) | **GitHub 교과서 (새로)** | 웹 교과서 (이미 있음) |
| --- | --- | --- | --- |
| Git 명령(add·commit·branch·merge·rebase·stash·복구) | ✅ 전부 — 여기가 기준 | 다시 가르치지 않음. 「필요한 문법」 이 터미널 레슨 쪽으로 링크 | — |
| 원격 개념 · push · pull · clone | ✅ T11(폴더로 만든 「가짜 GitHub」) | 진짜 GitHub 에서 **다시 한 번만** (G1 에서 짧게) | — |
| 계정 만들기 · 첫 push 로그인 · fork · PR 흐름 「처음 맛보기」 | ✅ T16(4쪽) — **다리 역할로 그대로 둠** | T16 을 했다고 보고 **그 다음부터**. G0 첫 쪽에 「T16 을 안 했으면 먼저」 경고 | — |
| PR 리뷰·병합 방식·PR 충돌·Issues·Projects | 개념만(T16 ④) | ✅ 여기가 기준 | — |
| GitHub Pages 「브랜치에서 배포」 | — | 복습 1쪽 + **Actions 로 배포**·404·저장소 주소 | ✅ W13 이 기준(사이트 만들기 → 올리기) |
| Actions · 브랜치 보호(Rulesets) · 비밀값 · Releases | 비밀(.env) 커밋 사고 복구만(T15 ⑤) | ✅ 여기가 기준 | — |

- 터미널·Git 교과서는 **「내 컴퓨터의 Git」**, GitHub 교과서는 **「GitHub 이라는 웹 서비스와 협업」**. 두 코스를 합치지 않아요 — 이미 터미널 교과서가 20레슨이라 합치면 너무 길고, 「로컬만 먼저」 배우고 싶은 사람도 있어요.
- T16 의 내용은 옮기지 않아요(링크로 연결). GitHub 교과서 G1 은 T16 을 **복습 2분짜리 + 다른 점(HTTPS 로그인 창·SSH 키)** 만.

## 3. 연습 방법 (교과서 원칙 그대로)

- 연습은 **사용자의 진짜 도구**: 브라우저의 **github.com**(내 계정) + **Git Bash** + **VS Code**. 사이트 안 시뮬레이터는 만들지 않아요(교과서 원칙: 「내 PC 도구에서」, 사용자 11/6).
- **계정은 하나만**: GitHub 이용약관에 「한 사람은 무료 개인 계정을 하나만」 이 있어요. 그래서 「두 번째 계정으로 친구 흉내」 는 안 하고,
  - PR·리뷰는 **혼자서 두 역할**(작성자 ↔ 리뷰어)로 연습해요. 단 **내가 연 PR 은 내가 Approve 할 수 없어요**(GitHub 규칙) → 리뷰는 「Comment」·줄 코멘트·Suggestion 으로 연습하고, Approve 가 필요한 규칙(Rulesets 의 「Require approvals」)은 **0명**으로 두는 법을 가르쳐요.
  - 남의 저장소에 기여하는 연습은 **공개 연습 저장소**(첫 기여용으로 유명한 `firstcontributions/first-contributions` — 구현할 때 지금도 PR 을 받는지 확인) 또는 **이 사이트 저장소에 이슈 하나 남기기**(사용자 본인 저장소라 fork 는 못 함 — 이슈·토론만).
- 화면 이름은 **어느 화면 → 어느 칸 → 무슨 글자**까지(사용자 선호). GitHub 화면은 자주 바뀌니
  - 레슨마다 「이 쪽의 화면 이름은 2026-11 기준」 한 줄을 맨 아래 작게,
  - 구현할 때 **docs.github.com 으로 하나씩 확인**하고(웹 검색), 바뀐 게 있으면 QA 문서에 적어요.
- 영어 화면 기준 + 괄호에 한국어 뜻(GitHub 은 한국어 화면이 없어요). 예: **「Settings」(설정) → 「Pages」 → 「Build and deployment」 → 「Source」 칸**.

## 4. 「먼저 꼭」 경고 (prereq — 필수 사항 강조, 사용자 「필수 사항은 강조하고」)

| 위치 | 제목 | 내용 · 버튼 |
| --- | --- | --- |
| 목차 챕터 1 위 · G0 1쪽 | 먼저 꼭! 터미널·Git 교과서 레슨 6(Git 설정)·레슨 16(실제 GitHub 첫 push) | 이름·이메일 설정과 첫 push 로그인이 안 돼 있으면 G1 부터 막혀요. 버튼 「터미널·Git 교과서 레슨 16 보기」 — **다른 코스로 가는 버튼이라 돌아오는 길이 필요**(3-8): 같은 탭 이동 대신 ① 이 교과서 「시작하기」 에 T16 핵심을 요약해 두고 거기로 가는 버튼(돌아오기 있음), ② 전체 레슨은 「새 탭으로 열기」 링크 |
| G1 1쪽 | 꼭! 2단계 인증(2FA) 켜기 | 코드를 올리는 계정은 GitHub 이 2FA 를 요구해요. **Settings → Password and authentication → Two-factor authentication → Enable**, 복구 코드(Recovery codes)를 **꼭 저장**. 안 하면 어느 날 「2FA 를 켜야 계속할 수 있어요」 로 막혀요 |
| G1 2쪽 | 이메일 비공개 | **Settings → Emails → ☑ Keep my email addresses private** + Git 에 `…@users.noreply.github.com` 주소 쓰기(`git config --global user.email`). 공개 저장소의 커밋에는 이메일이 그대로 남아요 |
| 챕터 4 위 · G16 1쪽 | 비밀값은 절대 커밋하지 않기 | 토큰·비밀번호·`.env` 는 `.gitignore` 에. 실수로 올렸으면 **지우는 게 아니라 그 토큰을 폐기(revoke)** 가 먼저(T15 ⑤ 와 연결) |
| G14 1쪽 | Actions 는 공개 저장소에서 무료 | 비공개 저장소는 한 달 무료 시간이 있어요. 연습 저장소는 공개로 |

## 5. 목차 (챕터 4 + 한 걸음 더 · 레슨 17 + 보스 4)

레슨 id 는 `G0`~`G16`, 보스 `GB1`~`GB4`. 쪽 수는 2~4쪽(설명 + 예제), 마지막 쪽은 「🛠 만들어 보기」.

### 챕터 1 · 내 저장소를 제대로

| id | 제목 | 쪽(주요 내용) | 만들어 보기 |
| --- | --- | --- | --- |
| G0 | GitHub 은 무엇을 해 주나 | ① Git(내 컴퓨터) vs GitHub(웹 서비스) 그림 · ② GitHub 화면 둘러보기: Code · Issues · Pull requests · Actions · Settings 탭 · ③ 이 교과서 쓰는 법(혼자 두 역할) | 내 프로필 주소·저장소 목록 확인 체크리스트 |
| G1 | 계정 다듬기와 로그인 방식 | ① 2FA(필수) · ② 이메일 비공개 + noreply 주소 · ③ HTTPS + Git Credential Manager(T16 복습) vs **SSH 키**(`ssh-keygen -t ed25519`, **Settings → SSH and GPG keys → New SSH key**) | SSH 키로 push 해 보기(`git remote set-url origin git@github.com:…`) |
| G2 | 저장소 만들기 제대로 | ① **New repository** 화면의 칸마다(Repository name · Public/Private · ☑ Add a README · Add .gitignore: Python · Choose a license: MIT) · ② 라이선스가 왜 필요한가(없으면 「남이 써도 된다」 가 아님) · ③ 이미 있는 내 폴더를 빈 저장소에 올리기(T11·T16 연결) | 파이썬 프로젝트 저장소 만들기(README·.gitignore·LICENSE 3개 확인) |
| G3 | 웹에서 고치고 기록 보기 | ① 파일 연필(✏)로 고치기 → **Commit changes** 창(메시지·「Commit directly to the main branch」 vs 「Create a new branch」) · ② **History**·커밋 하나의 diff · **Blame** · ③ github.dev(저장소에서 `.` 키) · ④ 웹에서 고친 뒤 내 컴퓨터는 `git pull` 이 필요(안 하면 push 거절 — T11 연결) | 웹에서 README 고치고 로컬에서 pull |
| G4 | README 를 문서답게 (Markdown) | ① 제목 `#` · 목록 · **코드 블록 ```python** · 링크·이미지 · 표 · 체크박스 `- [ ]` · ② Preview 탭 · ③ 좋은 README 의 순서(무엇·설치·실행·예시 화면·라이선스) | 내 프로젝트 README 다시 쓰기(확인할 것 목록) |
| **GB1** | 🛠 내 파이썬 프로젝트 공개 | 파이썬 교과서 보스(B1~B7 중 하나)를 저장소로 — README(실행 방법·예시 출력)·.gitignore·LICENSE·의미 있는 커밋 3개 | |

### 챕터 2 · Pull Request 로 협업

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| G5 | 브랜치에서 PR 열기 | ① 왜 main 에 바로 안 올리나(이 사이트 예) · ② 로컬 `git switch -c` → push → 노란 띠 **Compare & pull request** · ③ PR 화면: base ← compare, 제목·설명(무엇·왜·확인 방법), **Draft** | 첫 PR(설명 3줄 양식) |
| G6 | 코드 리뷰 | ① **Files changed** 탭 · 줄 번호 옆 **+** 로 줄 코멘트 · ② **Suggestion**(```suggestion 블록 → 작성자가 **Commit suggestion**) · ③ **Review changes**: Comment / Approve / Request changes — 내 PR 은 Approve 불가 · ④ 리뷰 반영은 같은 브랜치에 커밋 추가 → PR 에 자동으로 붙음 | 내 PR 에 줄 코멘트 2개 + Suggestion 1개 → 반영 |
| G7 | 병합 세 가지와 뒷정리 | ① **Create a merge commit / Squash and merge / Rebase and merge** — 히스토리 그림 비교(T14 rebase 연결) · ② **Delete branch** · ③ 로컬 뒷정리 `git switch main` · `git pull` · `git branch -d` · `git fetch --prune` | squash 로 합치고 로컬 정리(확인 명령: `git log --oneline -3`, `git branch`) |
| G8 | PR 에 충돌이 나면 | ① 「This branch has conflicts that must be resolved」 · ② 웹 **Resolve conflicts** 편집기(마커는 T13 과 같음) · ③ 로컬에서: `git switch 내브랜치` → `git merge main` → 해결 → push | 일부러 충돌 만들고 웹에서 풀기 / 로컬에서 풀기 |
| G9 | Issues 로 할 일 관리 | ① 이슈 쓰기(재현 방법·기대·실제 — 파이썬 L22 버그 보고와 연결) · ② Labels · Assignees · Milestone · ③ PR 설명에 `Closes #3` → 병합되면 이슈 자동 닫힘 · ④ 이슈 템플릿(`.github/ISSUE_TEMPLATE/`) | 이슈 → 브랜치 → `Closes #n` PR |
| G10 | Projects 보드 | ① **Projects → New project → Board** · ② Todo / In Progress / Done 칸 · ③ 이슈·PR 을 카드로 · 자동으로 칸 옮기기(Workflows) 맛보기 | 내 프로젝트 보드에 카드 5장 |
| **GB2** | 🛠 혼자 하는 협업 한 바퀴 | 이슈 2개 → 브랜치 2개 → PR 2개(리뷰 코멘트·Suggestion 반영) → 하나는 충돌 해결 → squash → 이슈 자동 닫힘 → 보드가 Done | |

### 챕터 3 · 세상에 내놓기

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| G11 | fork 와 오픈소스 첫 기여 | ① fork = 내 계정으로 복사 · ② `git clone` 내 fork → `git remote add upstream …` · `git fetch upstream` · **Sync fork** 버튼 · ③ CONTRIBUTING.md·이슈 「good first issue」 읽기 · ④ 기여 PR 의 예절(작게·설명·테스트) | 연습 저장소에 첫 기여 PR(구현 때 저장소 확정) |
| G12 | GitHub Pages 두 가지 방법 | ① 복습: **Settings → Pages → Source: Deploy from a branch**(웹 W13 이 자세히 — 링크) · ② **Source: GitHub Actions**(이 사이트 방식) · ③ 주소 규칙 `아이디.github.io/저장소` · 404 페이지 · 바뀌는 데 1~2분 | 파이썬 프로젝트 README 를 Pages 로(또는 웹 교과서 결과물) |
| G13 | 태그와 Releases | ① `git tag v1.0.0` · `git push origin v1.0.0` · ② **Releases → Draft a new release** → 태그 고르기 · **Generate release notes** · ③ 버전 번호 규칙(이 사이트 v2.15.3 처럼 큰·중간·작은) | v1.0.0 릴리스 |
| **GB3** | 🛠 포트폴리오 공개 | 저장소 2개(파이썬 프로젝트 + 웹 사이트) README 정리 · Pages 주소 · v1.0.0 릴리스 · 프로필 README(`아이디/아이디` 저장소) | |

### 챕터 4 · 자동화와 안전

| id | 제목 | 쪽 | 만들어 보기 |
| --- | --- | --- | --- |
| G14 | Actions 첫 워크플로 | ① `.github/workflows/test.yml` 한 줄씩: `on: [push, pull_request]` · `jobs:` · `runs-on: ubuntu-latest` · `actions/checkout` · `actions/setup-python` · `run: python -m pytest`(파이썬 L21 테스트와 연결) · ② **Actions** 탭에서 실행 기록 읽기 · 빨간 ✗ 를 눌러 로그의 맨 아래 줄 찾기(파이썬 L22 트레이스백 읽기와 같은 요령) | 테스트가 도는 워크플로 + 일부러 깨뜨려 빨간 ✗ 보기 |
| G15 | PR 에 초록 체크 + 보호 규칙 | ① PR 의 **Checks** 칸 · ② **Settings → 왼쪽 「Code, planning, and automation」 → Rules → Rulesets → New ruleset → New branch ruleset**: 「Ruleset name」 · 「Disabled」 단추 → **Active** · 「Target branches」 → **Add a target** → Include default branch · ☑ **Require a pull request before merging**(추가 설정의 승인 수는 **0** — 혼자라서) · ☑ **Require status checks to pass before merging**(위 워크플로의 job 이름) · ☑ **Block force pushes**(기본으로 켜짐) → **Create** <span>(2026-11 docs.github.com 「Creating rulesets for a repository」·「Available rules for rulesets」 기준. 왼쪽 메뉴의 「Rules」 글자와 승인 수 칸 이름은 구현 때 실제 화면으로 다시 확인)</span> · ③ 이제 main 에 바로 push 하면 거절 — 그 에러 글 읽기 | 보호 규칙 켜고 「바로 push 거절 → PR 로 통과」 |
| G16 | 비밀 지키기 | ① `.env`·토큰은 `.gitignore` · ② **Settings → Secrets and variables → Actions → New repository secret** → 워크플로에서 `${{ secrets.이름 }}` · ③ **Push protection**(토큰을 올리려 하면 GitHub 이 막음) · ④ 올려 버렸으면: 토큰 **폐기가 먼저**, 그다음 기록에서 지우기(T15 ⑤) · ⑤ Dependabot alerts 맛보기 | 비밀값을 Actions 에서 쓰기(출력은 `***` 로 가려짐 확인) |
| **GB4** | 🛠 이 사이트처럼 운영하기 | 내 저장소를 python-academy 운영 방식 그대로: 보호 규칙 + 테스트 워크플로(verify) + PR → 초록 체크 → squash → Pages 자동 배포. 이 사이트의 `.github/workflows/pages.yml`·`ci.yml` 을 읽는 쪽 포함 | |

### 한 걸음 더 (선택)

| id | 제목 | 내용 |
| --- | --- | --- |
| G17 | 터미널에서 GitHub: `gh` | `gh auth login` · `gh repo create` · `gh pr create --fill` · `gh pr checks` · `gh pr merge --squash` — 챕터 2~4 를 명령 한 줄로 |

## 6. 「만들어 보기」 모양과 검사

- 문제마다 지금 교과서와 같은 모양: 문장 문제 · **필요한 문법/화면**(실제 명령·실제 화면 이름) · 예시 답(단계 목록) · **「확인할 것」 ☐ 목록**(웹 교과서의 `checks` 와 같은 칸, 글만).
- 확인할 것은 **사용자가 자기 화면에서 볼 수 있는 것**으로: 「PR 화면 맨 위가 보라색 **Merged**」, 「Actions 탭에 초록 ✓」, 「`git log --oneline -3` 맨 위가 `Squash … (#2)`」, 「`https://아이디.github.io/저장소/` 가 열림」.
- **로컬 Git 부분은 자동 검사**: 터미널 교과서처럼 `setup` + `answer` + `check` 를 bash 로(원격은 로컬 bare 저장소로 대신). 예: G7 뒷정리, G8 로컬 충돌, G11 upstream 동기화, G13 태그.
- **GitHub 웹 화면 부분은 자동 검사 불가** → `noRun` + checks 필수(check_book: `BOOK.check = 'github'` 이면 checks 없는 문제는 실패). 대신 구현 PR 에서 **docs.github.com 으로 화면 이름 대조표**를 남겨요(쪽마다 「확인한 문서 주소」).
- 선택(나중에): 사용자가 저장소 주소를 붙여 넣으면 **공개 GitHub API**(로그인 없이)로 「README·LICENSE 있음 · 열린/병합된 PR 수 · 최근 Actions 결과」 를 읽어 체크 표시 — 교과서 원칙(채점 없음)과 부딪히지 않게 「내 저장소 점검」 버튼 하나로만. 구현은 2단계(사용자 결정 후).

## 7. 도감 · 시작하기 · 허브

- **시작하기 4쪽**: ① 준비물(터미널·Git 교과서 레슨 6·16 요약 — 이름·이메일·첫 push) · ② 2FA 와 이메일 비공개(필수) · ③ 연습 저장소 하나 만들기(`github-study`, Public) · ④ 이 교과서 쓰는 법(혼자 두 역할, 화면 이름 기준일).
- **도감**: 「GitHub 화면 도감」 — 쪽 제목을 실제 화면 경로/명령으로(예: `Settings → Pages → Source`, `Closes #3`, `${{ secrets.X }}`). 도구 상자 = 자주 쓰는 Markdown 문법 + `.github/` 폴더 파일들(workflows·ISSUE_TEMPLATE·pull_request_template.md·CODEOWNERS 맛보기).
- **허브**: 「코스」 칸에서 터미널·Git 바로 다음. 카드 「🐙 GitHub · 📖 교과서 · 읽은 레슨 n/21 · 내 계정으로 PR·Actions·Pages」. `CONFIG.COURSES` 에 `book: true`, `requires: 'terminal-git'` 는 **잠금이 아니라 카드 안내 글**로만(교과서엔 잠금 없음).

## 8. 만들 순서 (구현 계획)

1. `courses/github/` 뼈대(content.js 의 LESSONS·CHAPTERS · book.js · index.html · course.json) + 허브 카드 + check_book `github` 검사 + regress 절 — **v2.16.0**: 시작하기 + 챕터 1(G0~G4·GB1)
2. 챕터 2(G5~G10·GB2) — v2.16.x
3. 챕터 3·4(G11~G16·GB3·GB4) + G17 — v2.17.0
4. 단계마다: docs.github.com 대조 · 폰 390/PC QA · 문서(site-intent 코스 표·TODO·CHANGELOG·HANDOFF)

## 9. 정할 것 (사용자 결정 — 구현 전에 물어볼 것)

| # | 질문 | 제안(기본값) |
| --- | --- | --- |
| Q1 | 남의 저장소 기여 연습(G11)을 어디에? | 공개 연습 저장소(`firstcontributions/first-contributions`, 지금도 받는지 확인) |
| Q2 | `gh` 명령(G17)을 넣을까? | 「한 걸음 더」 로 넣음(선택) |
| Q3 | 「내 저장소 점검」 버튼(공개 API 로 읽기)을 만들까? | 2단계에서. 처음엔 「확인할 것」 목록만 |
| Q4 | 코스 이름 | 「GitHub」(허브 카드), 교과서 제목 「GitHub 교과서: 내 계정으로 협업하고 공개하기」 |
