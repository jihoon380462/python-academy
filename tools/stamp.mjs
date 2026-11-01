#!/usr/bin/env node
// tools/stamp.mjs — 모든 HTML의 ?v=... 를 core/config.js의 APP_VERSION으로 맞춘다 (푸시 전 실행; validate_content가 불일치를 잡음)
import fs from 'node:fs'; import path from 'node:path';
import { ROOT } from './load_content.mjs';
const ver = (fs.readFileSync(path.join(ROOT, 'core/config.js'), 'utf8').match(/APP_VERSION:\s*'([^']+)'/) || [])[1];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'legacy' ? [] : e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []);
let n = 0; for (const f of walk(ROOT)) { const s = fs.readFileSync(f, 'utf8'); const t = s.replace(/\?v=[0-9.]+/g, '?v=' + ver); if (t !== s) { fs.writeFileSync(f, t); n++; } }
console.log(`stamp v${ver}: ${n}개 파일 갱신`);
