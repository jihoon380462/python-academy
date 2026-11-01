#!/usr/bin/env bash
# 소스 조각(src/)을 합쳐 단일 HTML을 만들고 배포 파일(index.html, python_academy.html)에 복사한다.
set -e
cd "$(dirname "$0")"
cat src/00_head.html src/10_config.js src/20_content_a.js src/21_content_b.js src/22_problems_a.js src/23_problems_b.js src/24_content_misc.js src/30_engine.js src/31_sync.js src/40_ui_core.js src/41_ui_editors.js src/42_ui_views_main.js src/43_ui_views_more.js src/99_tail.html > python_academy.html
cat src/*.js > /tmp/_pa_all.js && node --check /tmp/_pa_all.js && echo "JS 문법 OK"
cp python_academy.html index.html
echo "빌드 완료: $(grep -o "APP_VERSION: '[0-9.]*'" src/10_config.js)"
