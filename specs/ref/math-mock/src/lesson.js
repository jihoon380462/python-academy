// 시안용 레슨 내용 — 레슨 1 「약수와 배수」(챕터 1 소인수분해). 세 가지 쪽 짜임이 모두 이 내용을 그대로 써요.
// 짜임: 왜 배우나(장면) → 개념 한 단계씩 → 예제 풀이(단계 전부) → 연습 문제 → 자주 하는 실수 (TODO 1-1)
const FIG = {
  // 점 total 개를 per 개씩 묶기 — 딱 맞는 묶음은 파랑, 남는 점은 주황
  dots(total, per) {
    const full = Math.floor(total / per), left = total % per, d = 18, pad = 7, gap = 10;
    const bw = per * d + pad * 2, bh = d + pad * 2; let x = 0, out = '';
    for (let g = 0; g < full; g++) { out += `<rect class="fg-box" x="${x + .5}" y=".5" width="${bw - 1}" height="${bh - 1}" rx="9"/>`; for (let i = 0; i < per; i++) out += `<circle class="fg-dot" cx="${x + pad + d / 2 + i * d}" cy="${bh / 2}" r="6"/>`; x += bw + gap; }
    if (left) { const lw = left * d + pad * 2; out += `<rect class="fg-box left" x="${x + .5}" y=".5" width="${lw - 1}" height="${bh - 1}" rx="9"/>`; for (let i = 0; i < left; i++) out += `<circle class="fg-dot left" cx="${x + pad + d / 2 + i * d}" cy="${bh / 2}" r="6"/>`; x += lw + gap; }
    const w = x - gap;
    return `<svg class="fg" viewBox="0 0 ${w} ${bh}" width="${w}" height="${bh}" role="img" aria-label="점 ${total}개를 ${per}개씩 묶으면 ${full}묶음${left ? `이고 ${left}개가 남아요` : '으로 딱 맞아요'}">${out}</svg>`;
  },
  // 약수 짝 — 수를 한 줄로 놓고 곱해서 n 이 되는 짝끼리 호로 이어요
  pairs(nums, n) {
    // 호의 높이는 짝이 바깥일수록 높게(안쪽 짝 14, 그 바깥은 22씩 더) — 호끼리 겹치지 않게
    const step = 46, r = 15, lv = Math.floor(nums.length / 2) - 1, w = step * (nums.length - 1) + r * 2 + 4, top = 11 + 11 * Math.max(0, lv), h = top + r * 2 + 4; let out = '';
    const cx = (i) => 2 + r + i * step;
    for (let i = 0, j = nums.length - 1; i < j; i++, j--) { const a = cx(i), b = cx(j); out += `<path class="fg-arc" d="M${a} ${top} Q ${(a + b) / 2} ${top - 14 - 22 * (lv - i)} ${b} ${top}"/>`; }
    if (nums.length % 2) { const m = cx((nums.length - 1) / 2); out += `<path class="fg-arc" d="M${m - 7} ${top} Q ${m} ${top - 16} ${m + 7} ${top}"/>`; }
    nums.forEach((v, i) => { out += `<circle class="fg-num" cx="${cx(i)}" cy="${top + r + 2}" r="${r}"/><text class="fg-t" x="${cx(i)}" y="${top + r + 7}" text-anchor="middle">${v}</text>`; });
    return `<svg class="fg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${n}의 약수 ${nums.join(', ')}. 곱해서 ${n}이 되는 수끼리 짝이에요">${out}</svg>`;
  },
  // 수직선 위에서 k 씩 뛰기 — k 의 배수
  jumps(k, upto) {
    const s = 19, x0 = 12, y = 44, w = x0 * 2 + s * upto, h = 70; let out = `<line class="fg-axis" x1="${x0}" y1="${y}" x2="${w - 4}" y2="${y}"/>`;
    for (let i = 0; i <= upto; i++) { const m = i % k === 0 && i > 0; out += `<line class="fg-axis" x1="${x0 + i * s}" y1="${y - (m ? 5 : 3)}" x2="${x0 + i * s}" y2="${y + (m ? 5 : 3)}"/>`; if (m || i === 0) out += `<text class="fg-t ${m ? 'on' : 'dim'}" x="${x0 + i * s}" y="${y + 21}" text-anchor="middle">${i}</text>`; }
    for (let i = 0; i + k <= upto; i += k) { const a = x0 + i * s, b = x0 + (i + k) * s; out += `<path class="fg-arc" d="M${a} ${y - 6} Q ${(a + b) / 2} ${y - 40} ${b} ${y - 6}"/><text class="fg-t small" x="${(a + b) / 2}" y="${y - 28}" text-anchor="middle">+${k}</text>`; }
    return `<svg class="fg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="0에서 ${k}씩 뛰면 ${Array.from({ length: Math.floor(upto / k) }, (_, i) => (i + 1) * k).join(', ')}에 닿아요">${out}</svg>`;
  },
};
const eq = (s) => `<div class="mx-eq">${s}</div>`;
const m = (s) => `<span class="mx-m">${s}</span>`; // 줄 중간에서 끊기지 않는 식 한 덩어리
// 나눗셈 한 줄 — 몫과 나머지는 손으로 적지 않고 여기서 계산해요(LESSON R10)
const dv = (a, b) => m(`${a} ÷ ${b} = ${Math.floor(a / b)}, 나머지 ${a % b}`);
const pair = (a, b) => m(`짝 (${a}, ${b})`);
// 약수 찾기의 풀이 한 줄: n 을 a 로 나눠 보고, 나누어떨어지면 짝을 적어요
const tryDiv = (n, a, lead) => `${lead == null ? `<b>${a}</b>: ` : lead}${dv(n, a)} → ${n % a === 0 ? pair(a, n / a) : '약수가 아니에요'}`;
const LESSON = {
  n: 1, ch: 1, chName: '소인수분해', title: '약수와 배수', sub: '나누어떨어진다는 뜻', next: { n: 2, title: '소수와 합성수' },
  // 설명 덩어리 — A 는 한 쪽씩, B 는 한 절씩, C 는 카드 한 장씩
  parts: [
    { id: 'why', kind: 'why', short: '나누어떨어진다', title: '나누어떨어진다: 나머지가 0',
      scene: '귤 12개를 봉지에 <b>똑같이</b> 나눠 담으려고 해요. 한 봉지에 3개씩 담으면 딱 맞고, 5개씩 담으면 2개가 남아요. 이렇게 「딱 맞게 나눠지는가」 를 따지는 것이 이 레슨의 전부예요.',
      html: () => `<div class="mx-figs"><figure class="mx-fig">${FIG.dots(12, 3)}<figcaption><b>3개씩</b> — 4봉지, 남는 것 없음</figcaption></figure><figure class="mx-fig">${FIG.dots(12, 5)}<figcaption><b>5개씩</b> — 2봉지, <span class="mx-left">2개 남음</span></figcaption></figure></div>
<p>나눗셈을 하면 <b>몫</b>과 <b>나머지</b>가 나와요. 위 두 그림을 식으로 쓰면 이래요.</p>
${eq('12 ÷ 3 = 4, 나머지 <b>0</b>')}${eq('12 ÷ 5 = 2, 나머지 <b class="mx-left">2</b>')}
<p>둘째 식에서 앞의 2가 <b>몫</b>(가득 찬 봉지 수)이고, 뒤의 2가 <b>나머지</b>(남은 귤)예요. 5개씩 2봉지를 채우면 10개를 쓰고(${m('5 × 2 = 10')}), 3봉지를 채우기에는 모자라요(${m('5 × 3 = 15')}). 그래서 몫은 2, 남은 ${m('12 − 10 = 2')} 가 나머지예요.</p>
<p>나머지가 0이면 <b>나누어떨어진다</b>고 해요. 12는 3으로 나누어떨어지고, 5로는 나누어떨어지지 않아요.</p>
<p class="muted small">이 레슨에서 「수」 는 1, 2, 3, … 처럼 물건을 셀 때 쓰는 수(자연수)예요.</p>` },
    { id: 'div', kind: 'concept', short: '약수', title: '약수: 나누어떨어지게 하는 수',
      html: () => `<p>12를 어떤 수로 나눴을 때 나머지가 0이면, 그 수를 <b>12의 약수</b>라고 해요. 12를 1, 2, 3, …, 12로 차례로 나눠 보면 찾을 수 있어요.</p>
<div class="mx-nums" role="img" aria-label="12를 1부터 12까지로 나눠 보면 1, 2, 3, 4, 6, 12로 나눌 때 나머지가 0이에요">${Array.from({ length: 12 }, (_, i) => 12 % (i + 1)).map((r, i) => `<span class="mx-num ${r ? '' : 'on'}"><b>${i + 1}</b><small>${r ? '나머지 ' + r : '딱 맞음'}</small></span>`).join('')}</div>
${eq('12의 약수: 1, 2, 3, 4, 6, 12')}
<p>12보다 큰 수로는 나눠 볼 필요가 없어요. 귤 12개를 한 봉지에 13개씩 담으려 하면 한 봉지도 못 채우니까요.</p>
<p>어떤 수든 <b>1</b>과 <b>자기 자신</b>은 늘 약수예요. 1개씩 담으면 남는 것이 없고, 한 봉지에 전부 담아도 남는 것이 없으니까요. 12로 보면 ${m('12 ÷ 1 = 12')} 와 ${m('12 ÷ 12 = 1')} 이고, 둘 다 나머지가 0이에요.</p>
<p>1의 약수는 1 하나뿐이에요. 1과 자기 자신이 같은 수라서요.</p>` },
    { id: 'mul', kind: 'concept', short: '배수', title: '배수: 몇 배 한 수',
      html: () => `<p>3에 1, 2, 3, 4, … 를 차례로 곱한 수를 <b>3의 배수</b>라고 해요.</p>
${eq([1, 2, 3, 4].map(k => m(`3 × ${k} = ${3 * k}`)).join(' <span class="muted">·</span> ') + ' <span class="muted">· …</span>')}
<div class="mx-figs"><figure class="mx-fig wide">${FIG.jumps(3, 15)}<figcaption>0에서 3씩 뛰면 닿는 수가 3의 배수예요. 0은 출발점이고, 처음 닿는 3부터가 배수예요.</figcaption></figure></div>
<p>약수는 몇 개로 끝나지만(12의 약수는 6개), 배수는 끝없이 이어져요.</p>
<p>어떤 수가 3의 배수인지 알고 싶으면 <b>3으로 나눠 봐요</b>. 나누어떨어지면 3의 배수예요.</p>
${eq(dv(12, 3) + ' → ' + m('12는 3의 배수'))}
<p>왜 나눗셈으로 알 수 있을까요? ${dv(12, 3)} 은 「3개씩 4묶음이면 딱 12개」 라는 뜻이에요. 곱셈으로 쓰면 ${m('12 = 3 × 4')}, 곧 3에 4를 곱한 수예요.</p>
${eq(dv(14, 3) + ' → ' + m('14는 3의 배수가 아니에요'))}` },
    { id: 'rel', kind: 'concept', short: '약수와 배수의 관계', title: '약수와 배수의 관계: 12 = 3 × 4',
      html: () => `<p>나눗셈식 ${dv(12, 3)} 과 곱셈식 ${m('12 = 3 × 4')} 는 <b>같은 사실을 두 가지로 쓴 것</b>이에요. 이 곱셈식 하나에 약수와 배수가 다 들어 있어요.</p>
<div class="mx-rel" role="img" aria-label="12 = 3 × 4 에서 3과 4는 12의 약수이고, 12는 3의 배수이면서 4의 배수예요"><div class="mx-rel-eq"><span class="mx-rel-a">12</span><span>=</span><span class="mx-rel-b">3</span><span>×</span><span class="mx-rel-b">4</span></div><div class="mx-rel-l"><span>12는 3의 <b>배수</b>, 4의 <b>배수</b></span><span>3과 4는 12의 <b>약수</b></span></div></div>
<p>${m('12 = 3 × 4')} 이면 12는 3으로도, 4로도 나누어떨어져요(${m('12 ÷ 3 = 4')}, ${m('12 ÷ 4 = 3')}). 그래서 3과 4는 12의 약수이고, 12는 3의 배수이면서 4의 배수예요. 아래 두 문장은 같은 말이에요.</p>
${eq(m('3은 12의 약수') + ' <span class="muted">— 같은 말 —</span> ' + m('12는 3의 배수'))}
<p>이렇게 곱해서 12가 되는 두 수를 이 교과서에서는 <b>짝</b>이라고 부를게요. 12의 짝은 셋이고, 짝의 두 수는 모두 12의 약수예요.</p>
${eq([[1, 12], [2, 6], [3, 4]].map(([a, b]) => m(`${a} × ${b} = 12`)).join(' <span class="muted">·</span> ') + ' → 짝 ' + [[1, 12], [2, 6], [3, 4]].map(([a, b]) => m(`(${a}, ${b})`)).join(', '))}
<p>12의 약수는 12와 같거나 12보다 작고, 3의 배수는 3과 같거나 3보다 커요. 그래서 「3은 12의 배수」 는 틀린 말이에요. 12의 배수라면 12보다 작을 수 없으니까요. <span class="muted">(크기가 맞는다고 다 약수 · 배수인 것은 아니에요. 그건 나눠 봐야 알아요.)</span></p>` },
    { id: 'ex1', kind: 'example', short: '예제 1', title: '예제 1: 18의 약수 모두 구하기',
      q: '18의 약수를 모두 구하세요.',
      lead: '곱해서 18이 되는 <b>짝</b>을 작은 수부터 찾아요. 18을 1, 2, 3, … 으로 차례로 나눠서, 나누어떨어지면 나눈 수와 몫이 짝이에요. 짝 하나를 찾으면 약수를 두 개 얻어요.',
      steps: [tryDiv(18, 1, '<b>1</b>로 나눠요. '), tryDiv(18, 2), tryDiv(18, 3), tryDiv(18, 4), tryDiv(18, 5), `<b>6</b>: ${pair(3, 6)}의 큰 쪽에서 이미 나온 수예요. <b>여기서 멈춰요</b>`, '찾은 짝의 수를 작은 것부터 늘어놓으면 1, 2, 3, 6, 9, 18'],
      why: `<b>왜 6에서 멈춰도 되나요?</b> 짝의 작은 쪽이 ${m('1 → 2 → 3')} 으로 커지는 동안, 큰 쪽은 ${m('18 → 9 → 6')} 으로 작아졌어요. 6은 큰 쪽에서 이미 나온 수라, 작은 쪽과 큰 쪽이 만난 거예요. 6보다 큰 약수가 있다면 그 짝은 3보다 작은 수, 곧 1이나 2여야 해요. 그런데 1의 짝 18과 2의 짝 9는 이미 찾았어요. 그래서 새 약수는 더 나오지 않아요.`,
      after: () => `<div class="mx-figs"><figure class="mx-fig">${FIG.pairs([1, 2, 3, 6, 9, 18], 18)}<figcaption>곱해서 18이 되는 수끼리 이은 그림</figcaption></figure></div>`,
      answer: '18의 약수는 1, 2, 3, 6, 9, 18' },
    { id: 'ex2', kind: 'example', short: '예제 2', title: '예제 2: 16의 약수 — 짝의 두 수가 같을 때',
      q: '16의 약수를 모두 구하세요.',
      lead: '예제 1과 같은 방법이에요. 이번에는 짝의 두 수가 같은 경우가 나와요.',
      steps: [tryDiv(16, 1), tryDiv(16, 2), tryDiv(16, 3), `${tryDiv(16, 4)}. 두 수가 같으니 4는 <b>한 번만</b> 적어요`, '작은 쪽과 큰 쪽이 4에서 만났으니 <b>여기서 멈춰요</b>', '작은 것부터 늘어놓으면 1, 2, 4, 8, 16'],
      why: '<b>멈추는 때를 한 문장으로</b>: 나눠 볼 차례인 수가 큰 쪽에서 이미 나온 수이거나(예제 1의 6), 짝의 두 수가 같아지면(예제 2의 4) 멈춰요.',
      after: () => `<div class="mx-figs"><figure class="mx-fig">${FIG.pairs([1, 2, 4, 8, 16], 16)}<figcaption>4는 자기 자신과 짝이라 한 번만 나와요</figcaption></figure></div>`,
      answer: '16의 약수는 1, 2, 4, 8, 16' },
    { id: 'ex3', kind: 'example', short: '예제 3', title: '예제 3: 배수인지 확인하기',
      q: '56과 58은 7의 배수인가요?',
      lead: '7의 배수인지 알고 싶으면 7로 나눠 봐요.',
      steps: [`${dv(56, 7)} → 나누어떨어져요`, `그래서 56은 7의 배수예요 (${m('56 = 7 × 8')})`, `${dv(58, 7)} → 나누어떨어지지 않아요`, `그래서 58은 7의 배수가 아니에요 (${m('7 × 8 = 56')} 과 ${m('7 × 9 = 63')} 사이에 있어요)`],
      answer: '56은 7의 배수, 58은 7의 배수가 아니에요' },
  ],
  practice: [
    { title: '약수 모두 구하기', q: '20의 약수를 모두 구하세요.', answer: '1, 2, 4, 5, 10, 20', see: 'ex1',
      steps: [tryDiv(20, 1), tryDiv(20, 2), tryDiv(20, 3), tryDiv(20, 4), '다음 수 5는 큰 쪽에서 이미 나왔으니 멈춰요', '작은 것부터 늘어놓으면 1, 2, 4, 5, 10, 20'] },
    { title: '약수가 둘뿐인 수', q: '7의 약수를 모두 구하세요.', answer: '1, 7', see: 'ex1',
      steps: [tryDiv(7, 1), `2, 3, 4, 5, 6 으로 나누면 모두 나머지가 생겨요 (${[2, 3, 4, 5, 6].map(a => dv(7, a)).join(' <span class="muted">·</span> ')})`, '다음 수 7은 큰 쪽에서 이미 나왔으니 멈춰요', '약수는 1과 7, 둘뿐이에요. 이런 수는 다음 레슨에서 다시 만나요'] },
    { title: '배수 고르기', q: '다음 수 가운데 6의 배수를 모두 고르세요.<div class="mx-eq">14 &nbsp; 18 &nbsp; 24 &nbsp; 32 &nbsp; 42</div>', answer: '18, 24, 42', see: 'ex3',
      steps: [14, 18, 24, 32, 42].map(n => `${dv(n, 6)} → ${n % 6 === 0 ? '6의 배수' : '아니에요'}`) },
    { title: '약수의 개수', q: '36의 약수는 모두 몇 개인가요?', answer: '9개 (1, 2, 3, 4, 6, 9, 12, 18, 36)', see: 'ex2',
      steps: [tryDiv(36, 1), tryDiv(36, 2), tryDiv(36, 3), tryDiv(36, 4), tryDiv(36, 5), `${tryDiv(36, 6)}. 두 수가 같으니 6은 한 번만 적고 멈춰요`, '짝 4개에서 약수 8개, 거기에 6 하나 → 모두 9개'] },
    { title: '약수인가 배수인가', q: '15는 45의 약수인가요, 배수인가요? 그렇게 답한 까닭을 식으로 써 보세요.', answer: `약수 — ${dv(45, 15)} (또는 ${m('45 = 15 × 3')})`, see: 'rel',
      steps: ['15는 45보다 작으니 45의 배수일 수는 없어요', `${dv(45, 15)} → 15로 나누어떨어져요`, `그래서 15는 45의 약수예요 (${m('45 = 15 × 3')})`, '같은 말을 거꾸로 하면: 45는 15의 배수예요'] },
    { title: '쿠키 나눠 담기', home: true, q: '쿠키 24개를 상자에 <b>남김없이 똑같이</b> 나눠 담으려고 해요. 한 상자에 담을 수 있는 개수를 모두 구하세요. <span class="muted">(한 상자에 모두 담아도, 1개씩 담아도 돼요.)</span>', answer: '1, 2, 3, 4, 6, 8, 12, 24개', see: 'why',
      steps: ['「남김없이 똑같이」 = 나누어떨어진다 → 24의 약수를 구하면 돼요', tryDiv(24, 1), tryDiv(24, 2), tryDiv(24, 3), tryDiv(24, 4), `${dv(24, 5)} → 5개씩은 안 돼요`, '다음 수 6은 큰 쪽에서 이미 나왔으니 멈춰요', '작은 것부터 늘어놓으면 1, 2, 3, 4, 6, 8, 12, 24'] },
  ],
  mistakes: [
    { t: '1과 자기 자신을 빼먹어요', bad: '12의 약수: 2, 3, 4, 6', good: '12의 약수: 1, 2, 3, 4, 6, 12', tip: `짝 찾기를 <b>1부터</b> 시작하면 ${pair(1, 12)}가 맨 먼저 나와서 빠지지 않아요.` },
    { t: '약수와 배수를 거꾸로 말해요', bad: '3은 12의 배수', good: '3은 12의 약수, 12는 3의 배수', tip: '12의 배수는 12보다 작을 수 없어요. 3은 12보다 작으니 12의 배수가 아니에요.' },
    { t: '짝의 두 수가 같을 때 두 번 적어요', bad: '36의 약수: 1, 2, 3, 4, 6, 6, 9, 12, 18, 36', good: '36의 약수: 1, 2, 3, 4, 6, 9, 12, 18, 36', tip: `${m('36 = 6 × 6')} 처럼 짝의 두 수가 같으면 한 번만 적어요.` },
  ],
};
