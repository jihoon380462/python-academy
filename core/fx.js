// core/fx.js — 효과음(Audio)·진동(Haptic)·색종이(Confetti)·마스코트 SVG
// ---------- 효과음 (Web Audio 합성) ----------
const Audio = {
  ctx: null, get on() { return Store.data.settings.sound; },
  wave() { const s = INVENTORY.sound.find(x => x.id === Store.data.settings.soundSet); return s ? s.wave : 'sine'; },
  _ctx() { if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (this.ctx.state === 'suspended') this.ctx.resume(); return this.ctx; },
  tone(freq, dur = 0.12, type = null, vol = 0.18, delay = 0, slide = 0) { if (!this.on) return; const c = this._ctx(); if (!c) return; const o = c.createOscillator(), g = c.createGain(); o.type = type || this.wave(); const t = c.currentTime + delay; o.frequency.setValueAtTime(freq, t); if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t + dur); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + dur + 0.02); },
  click() { this.tone(900, 0.05, 'square', 0.06); },
  pass() { this.tone(660, 0.08); this.tone(880, 0.1, null, 0.18, 0.08); },
  clear() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.15, null, 0.2, i * 0.09)); this.tone(1319, 0.35, null, 0.2, 0.36); },
  combo(n) { this.tone(440 + Math.min(n, 15) * 60, 0.1, 'triangle', 0.15); },
  levelUp() { [392, 523, 659, 784, 1047, 1319].forEach((f, i) => this.tone(f, 0.18, null, 0.2, i * 0.1)); this.tone(1568, 0.5, null, 0.2, 0.62); },
  badge() { this.tone(1200, 0.08, 'triangle', 0.15); this.tone(1800, 0.14, 'triangle', 0.15, 0.07); },
  boss() { [262, 330, 392, 523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, null, 0.22, i * 0.11)); this.tone(1319, 0.7, null, 0.22, 0.8); },
  wrong() { this.tone(180, 0.18, 'sawtooth', 0.12, 0, -60); },
  hit() { this.tone(120, 0.12, 'square', 0.15, 0, -50); },
  type() { this.tone(1500, 0.02, 'square', 0.02); },
};
const Haptic = { tap(ms = 20) { if (Store.data.settings.vibrate && navigator.vibrate) try { navigator.vibrate(ms); } catch (e) {} } };

// ---------- 색종이 ----------
const Confetti = {
  canvas: null, ctx: null, parts: [], raf: null,
  init() { this.canvas = $('#confetti'); this.ctx = this.canvas.getContext('2d'); const rs = () => { this.canvas.width = innerWidth; this.canvas.height = innerHeight; }; addEventListener('resize', rs); rs(); },
  colors() { const c = INVENTORY.confetti.find(x => x.id === Store.data.settings.confetti); return c ? c.colors : INVENTORY.confetti[0].colors; },
  burst(n = 120, x = null, y = null) { const anim = Store.data.settings.anim; if (anim === 0 || !Game.showGame()) return; n = Math.round(n * (anim === 1 ? 0.4 : 1)); const cols = this.colors(); const cx = x ?? innerWidth / 2, cy = y ?? innerHeight * 0.4; for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, sp = 4 + Math.random() * 9; this.parts.push({ x: cx, y: cy, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, g: 0.18, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3, c: cols[i % cols.length], life: 90 + Math.random() * 60 }); } if (!this.raf) this.loop(); },
  rain(n = 200) { const anim = Store.data.settings.anim; if (anim === 0 || !Game.showGame()) return; const cols = this.colors(); for (let i = 0; i < n; i++) this.parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * 0.5, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, g: 0.03, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.2, c: cols[i % cols.length], life: 200 + Math.random() * 100 }); if (!this.raf) this.loop(); },
  loop() { const c = this.ctx; const step = () => { c.clearRect(0, 0, this.canvas.width, this.canvas.height); this.parts = this.parts.filter(p => p.life > 0 && p.y < innerHeight + 30); for (const p of this.parts) { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.r += p.vr; p.life--; c.save(); c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.globalAlpha = Math.min(1, p.life / 30); c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore(); } if (this.parts.length) this.raf = requestAnimationFrame(step); else { this.raf = null; c.clearRect(0, 0, this.canvas.width, this.canvas.height); } }; this.raf = requestAnimationFrame(step); },
};


// ---------- 마스코트 SVG ----------
const MASCOT_COLORS = ['#3cb371', '#ff8c42', '#5b8def'];
function mascotSVG({ stage = 0, mood = 'normal', color = 0, accessory = 'none', size = 64 } = {}) {
  const c = MASCOT_COLORS[color % MASCOT_COLORS.length]; const dark = '#1f4d33';
  const eyes = mood === 'happy' ? `<path d="M22 30 q4 -5 8 0" stroke="${dark}" stroke-width="2.5" fill="none"/><path d="M38 30 q4 -5 8 0" stroke="${dark}" stroke-width="2.5" fill="none"/>`
    : mood === 'confused' ? `<circle cx="26" cy="30" r="3" fill="${dark}"/><circle cx="42" cy="30" r="2" fill="${dark}"/><path d="M36 20 q6 -4 8 2" stroke="${dark}" stroke-width="2" fill="none"/>`
    : `<circle cx="26" cy="30" r="3" fill="${dark}"/><circle cx="42" cy="30" r="3" fill="${dark}"/><circle cx="27" cy="29" r="1" fill="#fff"/><circle cx="43" cy="29" r="1" fill="#fff"/>`;
  const mouth = mood === 'happy' ? `<path d="M28 40 q6 6 12 0" stroke="${dark}" stroke-width="2" fill="none"/>` : mood === 'confused' ? `<path d="M30 42 q4 -3 8 0" stroke="${dark}" stroke-width="2" fill="none"/>` : `<path d="M30 40 q4 3 8 0" stroke="${dark}" stroke-width="2" fill="none"/>`;
  const tongue = `<path d="M34 46 l0 6 l-3 3 M34 52 l3 3" stroke="#e05" stroke-width="2" fill="none"/>`;
  let body;
  if (stage === 0) body = `<ellipse cx="34" cy="38" rx="18" ry="22" fill="#f4f1de" stroke="#cbbf9a" stroke-width="2"/><path d="M22 36 l6 6 l5 -8 l6 7 l5 -6" stroke="#cbbf9a" stroke-width="2" fill="none"/><circle cx="28" cy="30" r="2" fill="${dark}"/><circle cx="40" cy="30" r="2" fill="${dark}"/>`;
  else body = `<path d="M12 58 q-8 -14 8 -18 q12 -3 10 -14" stroke="${c}" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="34" cy="34" rx="18" ry="16" fill="${c}"/><ellipse cx="34" cy="36" rx="12" ry="8" fill="rgba(255,255,255,.25)"/>${eyes}${mouth}${stage >= 1 ? tongue : ''}`;
  let hat = '';
  if (stage >= 2 && stage < 3) hat = `<circle cx="26" cy="30" r="6" stroke="#333" stroke-width="2" fill="none"/><circle cx="42" cy="30" r="6" stroke="#333" stroke-width="2" fill="none"/><path d="M32 30 h4" stroke="#333" stroke-width="2"/>`;
  if (stage >= 3) hat += `<path d="M18 40 q-10 18 2 28 l10 -10 l-4 -16 z" fill="#c0392b" opacity=".9"/>`;
  if (stage >= 4) hat += `<path d="M22 20 l4 -10 l8 8 l8 -8 l4 10 z" fill="#f1c40f" stroke="#b8860b" stroke-width="1.5"/>`;
  if (stage >= 5) body = body.replace(new RegExp(c, 'g'), '#e6b800');
  const acc = {
    glasses: `<circle cx="26" cy="30" r="6" stroke="#2c3e50" stroke-width="2" fill="rgba(135,206,250,.3)"/><circle cx="42" cy="30" r="6" stroke="#2c3e50" stroke-width="2" fill="rgba(135,206,250,.3)"/><path d="M32 30 h4" stroke="#2c3e50" stroke-width="2"/>`,
    cap: `<path d="M16 22 q18 -14 36 0 l0 4 l-36 0 z" fill="#e74c3c"/><path d="M48 26 l10 0 l-2 4 l-8 0 z" fill="#c0392b"/>`,
    bow: `<path d="M44 16 l8 -5 l0 10 z M44 16 l-8 -5 l0 10 z" fill="#ff69b4"/><circle cx="44" cy="16" r="2" fill="#c2185b"/>`,
    scarf: `<path d="M18 46 q16 8 32 0 l0 6 q-16 8 -32 0 z" fill="#e67e22"/><path d="M40 50 l6 12" stroke="#e67e22" stroke-width="6" stroke-linecap="round"/>`,
    tophat: `<rect x="22" y="4" width="24" height="16" fill="#222"/><rect x="16" y="18" width="36" height="4" fill="#222"/><rect x="22" y="14" width="24" height="3" fill="#c0392b"/>`,
    wizard: `<path d="M34 -2 l16 24 l-32 0 z" fill="#5b3ea8"/><circle cx="36" cy="10" r="2" fill="#ffd700"/><circle cx="30" cy="16" r="1.5" fill="#ffd700"/>`,
    headphone: `<path d="M16 32 q0 -22 18 -22 q18 0 18 22" stroke="#333" stroke-width="3" fill="none"/><rect x="12" y="28" width="8" height="12" rx="3" fill="#333"/><rect x="48" y="28" width="8" height="12" rx="3" fill="#333"/>`,
    flower: `<circle cx="48" cy="18" r="3" fill="#ff6b6b"/><circle cx="52" cy="14" r="3" fill="#ff6b6b"/><circle cx="44" cy="14" r="3" fill="#ff6b6b"/><circle cx="48" cy="10" r="3" fill="#ff6b6b"/><circle cx="48" cy="14" r="2.5" fill="#ffd93d"/>`,
    halo: `<ellipse cx="34" cy="8" rx="14" ry="4" stroke="#ffd700" stroke-width="3" fill="none"/>`,
    gradcap: `<path d="M10 18 l24 -10 l24 10 l-24 10 z" fill="#1d2230"/><rect x="24" y="20" width="20" height="8" fill="#1d2230"/><path d="M52 20 l0 10" stroke="#ffd166" stroke-width="2"/><circle cx="52" cy="31" r="2.5" fill="#ffd166"/>`,
    crown2: `<path d="M20 20 l5 -12 l9 8 l9 -8 l5 12 z" fill="#ffd700" stroke="#b8860b"/><circle cx="25" cy="10" r="2" fill="#e74c3c"/><circle cx="34" cy="14" r="2" fill="#3498db"/><circle cx="43" cy="10" r="2" fill="#2ecc71"/>`,
  }[accessory] || '';
  return `<svg class="mascot" viewBox="0 0 68 68" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${body}${hat}${acc}</svg>`;
}
function myMascot(opts = {}) { const d = Store.data; return mascotSVG({ stage: Game.mascotStage(Game.level().level), color: d.mascotColor, accessory: d.settings.accessory, ...opts }); }
