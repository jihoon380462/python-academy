#!/usr/bin/env bash
# tools/ci_changes.sh — CI(ci.yml)에서 이 PR 이 문서(.md)만 바꿨는지 보고 `heavy=true|false` 한 줄을 찍어요(11/15, LESSON U16).
#   쓰는 법(ci.yml): `bash tools/ci_changes.sh >> "$GITHUB_OUTPUT"` → 무거운 단계에 `if: steps.diff.outputs.heavy == 'true'`
# - pull_request 실행은 actions/checkout 이 refs/pull/N/merge(merge 커밋)를 받아요. `fetch-depth: 2` 면 HEAD^1 = main 끝, HEAD^2 = PR 머리.
#   `git diff HEAD^1 HEAD` = 이 PR 을 머지하면 main 에서 바뀌는 파일이에요.
# - heavy=false 는 바뀐 파일이 하나 이상이고 **모두 .md** 일 때뿐. merge 커밋이 아니거나(workflow_dispatch) 바뀐 파일이 없거나
#   .md 가 아닌 파일이 하나라도 있으면 heavy=true(전부 돌림).
# - 왜 .md 만: .md 를 읽는 검사는 validate_content · check_vocab 뿐이고 둘은 늘 돌아요.
#   무거운 검사(check_book · run_solutions · regress · run_web_solutions)와 사이트 코드는 .md 를 읽지 않아요.
#   새 검사가 .md 를 읽게 되면 그 검사는 「늘 도는 단계」 에 두세요.
# - 사람이 읽는 설명은 stderr(실행 기록)로, 결과 한 줄만 stdout 으로.
set -u
heavy=true
if git rev-parse -q --verify 'HEAD^2' >/dev/null; then
  files=$(git -c core.quotepath=false diff --name-only 'HEAD^1' HEAD)
  n=$(printf '%s\n' "$files" | grep -c .)
  echo "이 PR 이 바꾼 파일 ${n}개:" >&2
  printf '%s\n' "$files" | sed 's/^/  /' >&2
  if [ "$n" -gt 0 ] && ! printf '%s\n' "$files" | grep -qv '\.md$'; then heavy=false; fi
else
  echo "merge 커밋이 아니에요(workflow_dispatch 등) — 전부 돌려요" >&2
fi
if [ "$heavy" = false ]; then echo "→ 문서(.md)만 바뀜: 무거운 검사(check_book · run_solutions · regress · web)를 건너뛰어요" >&2
else echo "→ 문서 말고도 바뀜: 전부 돌려요" >&2; fi
echo "heavy=$heavy"
