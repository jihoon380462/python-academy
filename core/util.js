// core/util.js — DOM·날짜·문자열 유틸 (전 페이지 공통)
// ---------- 유틸 ----------
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const esc = (s) => String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const todayKey = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const daysBetween = (a, b) => Math.round((new Date(b+'T00:00:00') - new Date(a+'T00:00:00')) / 86400000);
const addDays = (key, n) => { const d = new Date(key+'T00:00:00'); d.setDate(d.getDate()+n); return todayKey(d); };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = () => Math.random().toString(36).slice(2, 10);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }; // 제자리 섞기 (타자 연습·더 복습하기)
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const byteLen = (s) => new TextEncoder().encode(s).length;
function loadScript(src) { return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('load fail: ' + src)); document.head.appendChild(s); }); }
// 아트 리소스 경로 (docs/IMAGES.md): 허브(루트)와 코스 페이지(courses/<id>/)에서 같은 이름으로 쓴다
function assetUrl(name) { return (location.pathname.includes('/courses/') ? '../../' : '') + 'assets/img/' + name; }
