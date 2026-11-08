# GitHub 교과서 — 설계

GitHub 교과서(`courses/github/`, 설계 번호 N6)의 설계 기록이에요. v2.15.4 · 11/6 Opus.

- 만들 때(구현) 이 문서를 그대로 따르고, 바뀌는 건 여기를 먼저 고쳐요.
- 출발점: `TODO.md` 「예정 코스」 T8 칸 · 그때 있던 터미널·Git 교과서(T0~T16 · TB1~TB3) · 웹 교과서 W13(GitHub Pages).

## 지금 상태

| 항목 | 값 |
|---|---|
| 상태 | ✅ 끝남 — v2.16.0 ~ **v2.17.0**, 교차 QA v2.17.2 (8절) |
| 레슨 | **22** = G0~G16 17개 + 보스 GB1~GB4 + 한 걸음 더 G17 |
| 허브 묶음 | 🧰 개발 도구 (터미널·Git → GitHub → Vim) — v2.40.0 부터 |
| 9절 질문 | Q1~Q4 모두 제안대로 (사용자 결정, v2.16.0) |

### 어디서 왔나

- 사용자가 예정 코스 중 T8 GitHub 이 가장 중요하다고 했어요(11/3).
- 사용자가 N6 GitHub 심화 코스 설계를 골랐어요(11/6).

---

## 1. 한 줄로

**「혼자 만든 코드」를 「남이 보고 같이 고치는 프로젝트」로.**

- 내 **진짜 GitHub 계정**으로 저장소를 꾸며요.
- Pull Request 로 협업하고, Actions 로 자동 검사를 걸어요.
- Pages · Releases 로 세상에 내놓아요.
- 마지막 보스는 이 사이트(python-academy)가 운영되는 방식이에요: 브랜치 → PR → `verify` 초록 체크 → squash 병합 → Pages 자동 배포.

## 2. 다른 교과서와의 경계 (겹침 정리 — 꼭 지킬 것)

| 주제 | 터미널·Git 교과서 (이미 있음) | **GitHub 교과서 (새로)** | 웹 교과서 (이미 있음) |
| --- | --- | --- | --- |
| Git 명령(add·commit·branch·merge·rebase·stash·복구) | ✅ 전부 — 여기가 기준 | 다시 가르치지 않음. 「필요한 문법」 이 터미널 레슨 쪽으로 링크 | — |
| 원격 개념 · push · pull · clone | ✅ T11(폴더로 만든 「가짜 GitHub」) | 진짜 GitHub 에서 **다시 한 번만** (G1 에서 짧게) | — |
| 계정 만들기 · 첫 push 로그인 · fork · PR 흐름 「처음 맛보기」 | ✅ T16(4쪽) — **다리 역할로 그대로 둠** | T16 을 했다고 보고 **그 다음부터**. G0 첫 쪽에 「T16 을 안 했으면 먼저」 경고 | — |
| PR 리뷰·병합 방식·PR 충돌·Issues·Projects | 개념만(T16 ④) | ✅ 여기가 기준 | — |
| GitHub Pages 「브랜치에서 배포」 | — | 복습 1쪽 + **Actions 로 배포** · 404 · 저장소 주소 | ✅ W13 이 기준(사이트 만들기 → 올리기) |
| Actions · 브랜치 보호(Rulesets) · 비밀값 · Releases | 비밀(.env) 커밋 사고 복구만(T15 ⑤) | ✅ 여기가 기준 | — |

- 터미널·Git 교과서는 **「내 컴퓨터의 Git」**, GitHub 교과서는 **「GitHub 이라는 웹 서비스와 협업」**.
- 두 코스를 합치지 않아요.
  - 터미널 교과서가 이미 20 레슨이라 합치면 너무 길어요.
  - 「로컬만 먼저」 배우고 싶은 사람도 있어요.
- T16 의 내용은 옮기지 않고 링크로 이어요. G1 은 T16 을 **2분짜리 복습 + 다른 점(HTTPS 로그인 창 · SSH 키)** 만 다뤄요.

## 3. 연습 방법 (교과서 원칙 그대로)

### 도구

- 연습은 **사용자의 진짜 도구**로 해요: 브라우저의 **github.com**(내 계정) + **Git Bash** + **VS Code**.
- 사이트 안 시뮬레이터는 만들지 않아요. 연습은 내 PC 도구에서 한다는 교과서 원칙이에요(사용자 결정, 11/6).

### 계정은 하나만

GitHub 이용약관에 「한 사람은 무료 개인 계정을 하나만」 이 있어요. 그래서 두 번째 계정으로 친구 흉내를 내지 않아요.

- **PR · 리뷰는 혼자서 두 역할**(작성자 ↔ 리뷰어)로 연습해요.
  - 단 **내가 연 PR 은 내가 Approve 할 수 없어요**(GitHub 규칙).
  - 그래서 리뷰는 「Comment」 · 줄 코멘트 · Suggestion 으로 연습해요.
  - Approve 가 필요한 규칙(Rulesets 의 「Require approvals」)은 **0명**으로 두는 법을 가르쳐요.
- **남의 저장소에 기여하는 연습**은 둘 중 하나로:
  - **공개 연습 저장소** — 첫 기여용으로 유명한 `firstcontributions/first-contributions`. 11/6 에도 PR 을 받는 것을 확인했어요(CHANGELOG v2.16.2).
  - **이 사이트 저장소에 이슈 하나 남기기** — 사용자 본인 저장소라 fork 는 못 해요. 이슈 · 토론만.

### 화면 이름

- **어느 화면 → 어느 칸 → 무슨 글자**까지 적어요(사용자 선호).
- GitHub 화면은 자주 바뀌어요.
  - 레슨마다 맨 아래에 작게 「이 쪽의 화면 이름은 2026-11 기준」 한 줄.
  - 구현할 때 **docs.github.com 으로 하나씩 확인**하고(웹 검색), 바뀐 게 있으면 QA 문서에 적어요.
- 영어 화면 기준 + 괄호에 한국어 뜻. GitHub 은 한국어 화면이 없어요.
  - 예: **「Settings」(설정) → 「Pages」 → 「Build and deployment」 → 「Source」 칸**.

## 4. 「먼저 꼭」 경고 (prereq — 필수 사항 강조)

필수 사항은 눈에 띄게 강조해요(사용자 선호).

| 위치 | 제목 |
| --- | --- |
| 목차 챕터 1 위 · G0 1쪽 | 먼저 꼭! 터미널·Git 교과서 레슨 6(Git 설정) · 레슨 16(실제 GitHub 첫 push) |
| G1 1쪽 | 꼭! 2단계 인증(2FA) 켜기 |
| G1 2쪽 | 이메일 비공개 |
| 챕터 4 위 · G16 1쪽 | 비밀값은 절대 커밋하지 않기 |
| G14 1쪽 | Actions 는 공개 저장소에서 무료 |

내용 · 버튼:

- **터미널·Git 레슨 6 · 16**: 이름 · 이메일 설정과 첫 push 로그인이 안 돼 있으면 G1 부터 막혀요.
  - 버튼 「터미널·Git 교과서 레슨 16 보기」. 다른 코스로 가는 버튼이라 **돌아오는 길이 필요**해요(3-8).
  - 그래서 같은 탭 이동 대신 두 가지를 둬요.
    1. 이 교과서 「시작하기」 에 T16 핵심을 요약해 두고 거기로 가는 버튼(돌아오기 있음)
    2. 전체 레슨은 「새 탭으로 열기」 링크
- **2FA**: 코드를 올리는 계정은 GitHub 이 2FA 를 요구해요.
  - **Settings → Password and authentication → Two-factor authentication → Enable**.
  - 복구 코드(Recovery codes)를 **꼭 저장**.
  - 안 하면 어느 날 「2FA 를 켜야 계속할 수 있어요」 로 막혀요.
- **이메일 비공개**: **Settings → Emails → ☑ Keep my email addresses private**.
  - Git 에는 `…@users.noreply.github.com` 주소를 써요(`git config --global user.email`).
  - 공개 저장소의 커밋에는 이메일이 그대로 남아요.
- **비밀값**: 토큰 · 비밀번호 · `.env` 는 `.gitignore` 에.
  - 실수로 올렸으면 **지우는 게 아니라 그 토큰을 폐기(revoke)** 가 먼저(T15 ⑤ 와 연결).
- **Actions 요금**: 비공개 저장소는 한 달 무료 시간이 있어요. 연습 저장소는 공개로.

참고: 화면 이름은 구현 때 docs.github.com 원문으로 다시 대조했어요(CHANGELOG v2.16.0). 예: 2FA 는 「Access → Password and authentication → Enable two-factor authentication」. 위 경로는 설계 때 적은 그대로예요.

## 5. 목차 (챕터 4 + 한 걸음 더 · 레슨 17 + 보스 4 + G17 = 22)

- 레슨 id: `G0`~`G16`, 보스 `GB1`~`GB4`, 한 걸음 더 `G17`.
- 쪽 수는 2~4쪽(설명 + 예제), 마지막 쪽은 「🛠 만들어 보기」.

### 챕터 1 · 내 저장소를 제대로

#### G0 · GitHub 은 무엇을 해 주나

1. Git(내 컴퓨터) vs GitHub(웹 서비스) 그림.
2. GitHub 화면 둘러보기: Code · Issues · Pull requests · Actions · Settings 탭.
3. 이 교과서 쓰는 법(혼자 두 역할).

- 🛠 내 프로필 주소 · 저장소 목록 확인 체크리스트

#### G1 · 계정 다듬기와 로그인 방식

1. 2FA(필수).
2. 이메일 비공개 + noreply 주소.
3. HTTPS + Git Credential Manager(T16 복습) vs **SSH 키**.
   - `ssh-keygen -t ed25519`
   - **Settings → SSH and GPG keys → New SSH key**

- 🛠 SSH 키로 push 해 보기(`git remote set-url origin git@github.com:…`)

#### G2 · 저장소 만들기 제대로

1. **New repository** 화면의 칸마다: Repository name · Public/Private · ☑ Add a README · Add .gitignore: Python · Choose a license: MIT.
2. 라이선스가 왜 필요한가. 없으면 「남이 써도 된다」 가 아니에요.
3. 이미 있는 내 폴더를 빈 저장소에 올리기(T11 · T16 연결).

- 🛠 파이썬 프로젝트 저장소 만들기(README · .gitignore · LICENSE 3개 확인)

#### G3 · 웹에서 고치고 기록 보기

1. 파일 연필(✏)로 고치기 → **Commit changes** 창: 메시지 · 「Commit directly to the main branch」 vs 「Create a new branch」.
2. **History** · 커밋 하나의 diff · **Blame**.
3. github.dev(저장소에서 `.` 키).
4. 웹에서 고친 뒤 내 컴퓨터는 `git pull` 이 필요해요. 안 하면 push 거절(T11 연결).

- 🛠 웹에서 README 고치고 로컬에서 pull

#### G4 · README 를 문서답게 (Markdown)

1. 제목 `#` · 목록 · **코드 블록 ```python** · 링크 · 이미지 · 표 · 체크박스 `- [ ]`.
2. Preview 탭.
3. 좋은 README 의 순서: 무엇 · 설치 · 실행 · 예시 화면 · 라이선스.

- 🛠 내 프로젝트 README 다시 쓰기(확인할 것 목록)

#### GB1 · 🛠 내 파이썬 프로젝트 공개

- 파이썬 교과서 보스(B1~B7 중 하나)를 저장소로.
- README(실행 방법 · 예시 출력) · .gitignore · LICENSE · 의미 있는 커밋 3개.

### 챕터 2 · Pull Request 로 협업

#### G5 · 브랜치에서 PR 열기

1. 왜 main 에 바로 안 올리나(이 사이트 예).
2. 로컬 `git switch -c` → push → 노란 띠 **Compare & pull request**.
3. PR 화면: base ← compare, 제목 · 설명(무엇 · 왜 · 확인 방법), **Draft**.

- 🛠 첫 PR(설명 3줄 양식)

#### G6 · 코드 리뷰

1. **Files changed** 탭 · 줄 번호 옆 **+** 로 줄 코멘트.
2. **Suggestion**: ```suggestion 블록 → 작성자가 **Commit suggestion**.
3. **Review changes**: Comment / Approve / Request changes. 내 PR 은 Approve 불가.
4. 리뷰 반영은 같은 브랜치에 커밋 추가 → PR 에 저절로 붙음.

- 🛠 내 PR 에 줄 코멘트 2개 + Suggestion 1개 → 반영

#### G7 · 합치는 방법 세 가지와 뒷정리

- 제목: v2.17.2 에 「병합」 → 본문과 같은 「합치기」 로 바꿈.

1. **Create a merge commit / Squash and merge / Rebase and merge** — 히스토리 그림 비교(T14 rebase 연결).
2. **Delete branch**.
3. 로컬 뒷정리: `git switch main` · `git pull` · `git branch -d` · `git fetch --prune`.
   - 구현 때 순서를 `fetch --prune` 먼저로 바꿨어요(CHANGELOG v2.16.1).

- 🛠 squash 로 합치고 로컬 정리(확인 명령: `git log --oneline -3`, `git branch`)

#### G8 · PR 에 충돌이 나면

1. 「This branch has conflicts that must be resolved」.
2. 웹 **Resolve conflicts** 편집기(마커는 T13 과 같음).
3. 로컬에서: `git switch 내브랜치` → `git merge main` → 해결 → push.

- 🛠 일부러 충돌 만들고 웹에서 풀기 / 로컬에서 풀기

#### G9 · Issues 로 할 일 관리

1. 이슈 쓰기: 재현 방법 · 기대 · 실제(파이썬 L22 버그 보고와 연결).
2. Labels · Assignees · Milestone.
3. PR 설명에 `Closes #3` → 병합되면 이슈가 저절로 닫힘.
4. 이슈 템플릿(`.github/ISSUE_TEMPLATE/`).

- 🛠 이슈 → 브랜치 → `Closes #n` PR

#### G10 · Projects 보드

1. **Projects → New project → Board**.
2. Todo / In Progress / Done 칸.
3. 이슈 · PR 을 카드로 · 자동으로 칸 옮기기(Workflows) 맛보기.

- 🛠 내 프로젝트 보드에 카드 5장

#### GB2 · 🛠 혼자 하는 협업 한 바퀴

- 이슈 2개 → 브랜치 2개 → PR 2개(리뷰 코멘트 · Suggestion 반영)
- → 하나는 충돌 해결 → squash → 이슈가 저절로 닫힘 → 보드가 Done.

### 챕터 3 · 세상에 내놓기

#### G11 · fork 와 오픈소스 첫 기여

1. fork = 내 계정으로 복사.
2. `git clone` 내 fork → `git remote add upstream …` · `git fetch upstream` · **Sync fork** 버튼.
3. CONTRIBUTING.md · 이슈 「good first issue」 읽기.
4. 기여 PR 의 예절: 작게 · 설명 · 테스트.

- 🛠 연습 저장소에 첫 기여 PR. 저장소는 `firstcontributions/first-contributions` 로 정함(9절 Q1)

#### G12 · GitHub Pages 두 가지 방법

1. 복습: **Settings → Pages → Source: Deploy from a branch**. 웹 W13 이 자세히(링크).
2. **Source: GitHub Actions** — 이 사이트 방식.
3. 주소 규칙 `아이디.github.io/저장소` · 404 페이지 · 바뀌는 데 1~2분.

- 🛠 파이썬 프로젝트 README 를 Pages 로(또는 웹 교과서 결과물)

#### G13 · 태그와 Releases

1. `git tag v1.0.0` · `git push origin v1.0.0`.
2. **Releases → Draft a new release** → 태그 고르기 · **Generate release notes**.
3. 버전 번호 규칙: 이 사이트 v2.15.3 처럼 큰 · 중간 · 작은.

- 🛠 v1.0.0 릴리스

#### GB3 · 🛠 포트폴리오 공개

- 저장소 2개(파이썬 프로젝트 + 웹 사이트) README 정리 · Pages 주소 · v1.0.0 릴리스.
- 프로필 README(`아이디/아이디` 저장소).

### 챕터 4 · 자동화와 안전

#### G14 · Actions 첫 워크플로

1. `.github/workflows/test.yml` 한 줄씩:
   - `on: [push, pull_request]` · `jobs:` · `runs-on: ubuntu-latest`
   - `actions/checkout` · `actions/setup-python`
   - `run: python -m pytest`(파이썬 L21 테스트와 연결)
2. **Actions** 탭에서 실행 기록 읽기.
   - 빨간 ✗ 를 눌러 로그의 맨 아래 줄 찾기. 파이썬 L22 트레이스백 읽기와 같은 요령이에요.

- 🛠 테스트가 도는 워크플로 + 일부러 깨뜨려 빨간 ✗ 보기

#### G15 · PR 에 초록 체크 + 보호 규칙

1. PR 의 **Checks** 칸.
2. 보호 규칙 만들기. 화면 순서:
   1. **Settings** → 왼쪽 「Code, planning, and automation」 → **Rulesets** → (다시) **Rulesets**
   2. **New ruleset → New branch ruleset**
   3. 「Ruleset name」 · 「Disabled」 단추 → **Active**
   4. 「Target branches」 → **Add a target** → Include default branch
   5. ☑ **Require a pull request before merging** — 추가 설정의 승인 수는 **0**(혼자라서)
   6. ☑ **Require status checks to pass before merging** — 위 워크플로의 job 이름
   7. ☑ **Block force pushes** — 기본으로 켜짐
   8. **Create**
   - 출처: 2026-11 docs.github.com 「Creating rulesets for a repository」 reusables 대조.
   - v2.17.0 구현 때 확인: 왼쪽 메뉴는 「Rulesets」, 대상 추가 단추는 「Add target」.
3. 이제 main 에 바로 push 하면 거절돼요. 그 에러 글 읽기.

- 🛠 보호 규칙 켜고 「바로 push 거절 → PR 로 통과」

#### G16 · 비밀 지키기

1. `.env` · 토큰은 `.gitignore`.
2. **Settings → Secrets and variables → Actions → New repository secret** → 워크플로에서 `${{ secrets.이름 }}`.
3. **Push protection**: 토큰을 올리려 하면 GitHub 이 막아요.
4. 올려 버렸으면: 토큰 **폐기가 먼저**, 그다음 기록에서 지우기(T15 ⑤).
5. Dependabot alerts 맛보기.

- 🛠 비밀값을 Actions 에서 쓰기(출력은 `***` 로 가려짐 확인)

#### GB4 · 🛠 이 사이트처럼 운영하기

- 내 저장소를 python-academy 운영 방식 그대로: 보호 규칙 + 테스트 워크플로(verify) + PR → 초록 체크 → squash → Pages 자동 배포.
- 이 사이트의 `.github/workflows/pages.yml` · `ci.yml` 을 읽는 쪽도 포함.

### 한 걸음 더 (선택)

#### G17 · 터미널에서 GitHub: `gh`

- `gh auth login` · `gh repo create` · `gh pr create --fill` · `gh pr checks` · `gh pr merge --squash`.
- 챕터 2~4 를 명령 한 줄로.

## 6. 「만들어 보기」 모양과 검사

- **모양**: 지금 교과서와 같아요.
  - 문장 문제 · **필요한 문법/화면**(실제 명령 · 실제 화면 이름) · 예시 답(단계 목록)
  - **「확인할 것」 ☐ 목록** — 웹 교과서의 `checks` 와 같은 칸, 글만.
- **확인할 것은 사용자가 자기 화면에서 볼 수 있는 것**으로 써요. 예:
  - 「PR 화면 맨 위가 보라색 **Merged**」
  - 「Actions 탭에 초록 ✓」
  - 「`git log --oneline -3` 맨 위가 `Squash … (#2)`」
  - 「`https://아이디.github.io/저장소/` 가 열림」
- **로컬 Git 부분은 자동 검사**: 터미널 교과서처럼 `setup` + `answer` + `check` 를 bash 로. 원격은 로컬 bare 저장소로 대신해요.
  - 예: G7 뒷정리 · G8 로컬 충돌 · G11 upstream 동기화 · G13 태그.
- **GitHub 웹 화면 부분은 자동 검사 불가** → `noRun` + checks 필수.
  - check_book: `BOOK.check = 'github'` 이면 checks 없는 문제는 실패.
  - 대신 구현 PR 에서 **docs.github.com 으로 화면 이름 대조표**를 남겨요(쪽마다 「확인한 문서 주소」).
- **선택(나중에) — 「내 저장소 점검」 버튼**:
  - 사용자가 저장소 주소를 붙여 넣으면 **공개 GitHub API**(로그인 없이)로 읽어 체크 표시해요: README · LICENSE 있음 · 열린/병합된 PR 수 · 최근 Actions 결과.
  - 교과서 원칙(채점 없음)과 부딪히지 않게 버튼 하나로만.
  - 9절 Q3 대로 2단계로 미뤘어요. 지금 사이트에는 없어요(코드 검색으로 확인).

## 7. 도감 · 시작하기 · 허브

- **시작하기 4쪽**:
  1. 준비물 — 터미널·Git 교과서 레슨 6 · 16 요약(이름 · 이메일 · 첫 push)
  2. 2FA 와 이메일 비공개(필수)
  3. 연습 저장소 하나 만들기(`github-study`, Public)
  4. 이 교과서 쓰는 법(혼자 두 역할, 화면 이름 기준일)
- **도감**: 「GitHub 화면 도감」.
  - 쪽 제목을 실제 화면 경로/명령으로. 예: `Settings → Pages → Source` · `Closes #3` · `${{ secrets.X }}`.
  - 도구 상자 = 자주 쓰는 Markdown 문법 + `.github/` 폴더 파일들(workflows · ISSUE_TEMPLATE · pull_request_template.md · CODEOWNERS 맛보기).
- **허브**:
  - 처음 계획: 「코스」 칸에서 터미널·Git 바로 다음.
  - 카드: 「🐙 GitHub · 📖 교과서 · 읽은 레슨 n/22 · 내 계정으로 PR·Actions·Pages」. 정정: 설계 때는 n/21 로 적었어요. G17 까지 22 예요(CHANGELOG v2.17.0).
  - `CONFIG.COURSES` 에 `book: true`.
  - `requires: 'terminal-git'` 는 **잠금이 아니라 카드 안내 글**로만. 교과서엔 잠금이 없어요.
  - 지금은 🧰 개발 도구 묶음(지금 상태 표).

## 8. 만들 순서 (구현 계획)

| 단계 | 내용 | 실제 배포 |
|---|---|---|
| 1 | 뼈대 + 허브 카드 + check_book `github` 검사 + regress 절 + 시작하기 + 챕터 1(G0~G4 · GB1) | ✅ v2.16.0 |
| 2 | 챕터 2(G5~G10 · GB2) | ✅ v2.16.1 |
| 3-1 | 챕터 3(G11~G13 · GB3) | ✅ v2.16.2 |
| 3-2 | 챕터 4(G14~G16 · GB4) + G17 | ✅ v2.17.0 |
| — | 교차 QA | ✅ v2.17.2 |

- 뼈대: `courses/github/` 의 content.js(LESSONS · CHAPTERS) · book.js · index.html · course.json.
- 처음 계획은 챕터 3·4 를 함께 v2.17.0 에 내는 것이었어요. 실제로는 챕터 3 을 v2.16.2 에 먼저 냈어요.
- 단계마다: docs.github.com 대조 · 폰 390/PC QA · 문서(site-intent 코스 표 · TODO · CHANGELOG · HANDOFF).

## 9. 정할 것 (사용자 결정 — 구현 전에 물어볼 것)

✅ 사용자가 Q1~Q4 모두 제안대로 정했어요(v2.16.0).

| # | 질문 | 제안(= 결정) |
| --- | --- | --- |
| Q1 | 남의 저장소 기여 연습(G11)을 어디에? | 공개 연습 저장소(`firstcontributions/first-contributions`, 지금도 받는지 확인) |
| Q2 | `gh` 명령(G17)을 넣을까? | 「한 걸음 더」 로 넣음(선택) |
| Q3 | 「내 저장소 점검」 버튼(공개 API 로 읽기)을 만들까? | 2단계에서. 처음엔 「확인할 것」 목록만 |
| Q4 | 코스 이름 | 「GitHub」(허브 카드), 교과서 제목 「GitHub 교과서: 내 계정으로 협업하고 공개하기」 |
