#!/usr/bin/env node
// tools/stamp.mjs — 모든 HTML의 ?v=... 를 core/config.js의 APP_VERSION으로 맞춘다 (푸시 전 실행; validate_content가 불일치를 잡음)
import fs from 'node:fs'; import path from 'node:path';
import { ROOT } from './load_content.mjs';
const ver = (fs.readFileSync(path.join(ROOT, 'core/config.js'), 'utf8').match(/APP_VERSION:\s*'([^']+)'/) || [])[1];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'legacy' || e.name === 'archive' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
let n = 0; for (const f of walk(ROOT)) { const s = fs.readFileSync(f, 'utf8'); const t = s.replace(/\?v=[0-9.]+/g, '?v=' + ver); if (t !== s) { fs.writeFileSync(f, t); n++; } }
console.log(`stamp v${ver}: ${n}개 파일 갱신`);
// sw.js: VERSION 과 미리 캐시할 같은 출처 파일 목록(ASSETS) 갱신 — 오프라인 캐시(v2.2.6)
const swPath = path.join(ROOT, 'sw.js');
if (fs.existsSync(swPath)) {
  const assets = []; const add = (rel) => assets.push(rel.replace(/\\/g, '/'));
  add('index.html'); for (const f of fs.readdirSync(path.join(ROOT, 'core'))) if (f.endsWith('.js') || f.endsWith('.css')) add('core/' + f); for (const f of fs.readdirSync(path.join(ROOT, 'core/runners'))) add('core/runners/' + f); // archive/ 는 넣지 않음(v2.19.0 N13)
  for (const f of fs.readdirSync(path.join(ROOT, 'shared'))) if (f.endsWith('.js')) add('shared/' + f);
  for (const d of fs.readdirSync(path.join(ROOT, 'courses'))) { const cd = path.join(ROOT, 'courses', d); if (!fs.statSync(cd).isDirectory()) continue; for (const f of ['index.html', 'content.js', 'course.json', 'book.js', 'datasets.js']) if (fs.existsSync(path.join(cd, f))) add(`courses/${d}/${f}`); }
  if (fs.existsSync(path.join(ROOT, 'assets/img'))) for (const f of fs.readdirSync(path.join(ROOT, 'assets/img'))) if (/\.(png|webp|svg)$/.test(f)) add('assets/img/' + f);
  const list = assets.map(a => a.endsWith('.html') || a.endsWith('.json') ? a : a + '?v=' + ver);
  let sw = fs.readFileSync(swPath, 'utf8'); const t = sw.replace(/const VERSION = '[^']*';/, `const VERSION = '${ver}';`).replace(/const ASSETS = \[[\s\S]*?\];/, 'const ASSETS = ' + JSON.stringify(list) + ';');
  if (t !== sw) { fs.writeFileSync(swPath, t); console.log(`stamp sw.js: v${ver}, 미리 캐시 ${list.length}개`); }
}
