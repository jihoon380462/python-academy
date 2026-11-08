// 쓰기: cd <저장소 루트> && node qa-reports/2026-11-08-python/tools/dump_book.js <출력폴더>
// 화면에 나오는 파이썬 교과서 본문(book.js 바꿔치기 적용)을 챕터별 텍스트(ch0.txt …)로 뽑는다. 읽기 전용.
const vm=require('vm'),fs=require('fs');
const x={};vm.createContext(x);
vm.runInContext(fs.readFileSync('courses/python/content.js','utf8').replace(/^(const|let) (\w+)/mg,'var $2'),x);
const bsrc=fs.readFileSync('courses/python/book.js','utf8').replace(/^(const|let) (\w+)/mg,'var $2');
vm.runInContext(bsrc,x);
const B=x.BOOK, L=x.LESSONS, CH=x.CHAPTERS;
const strip=h=>String(h).replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g,(m,c)=>'\n```\n'+c.replace(/<\/?[a-zA-Z][^>]*>/g,'')+'\n```\n').replace(/<\/(p|li|h\d|div|tr)>/g,'\n').replace(/<br\s*\/?>/g,'\n').replace(/<\/?[a-zA-Z][^>]*>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&amp;/g,'&').replace(/\n{3,}/g,'\n\n');
const out={};
for(const l of L){
  const pages=(B.lessonPages||{})[l.id]||l.pages||[];
  let s=`\n######## [${l.id}] 화면 레슨 ${l.n} · ${l.title} (챕터 ${l.ch}${l.boss?' · 만들어 보기':''}${l.mock?' · 모의':''})\n`;
  pages.forEach((pg,i)=>{const o=(B.pages||{})[`${l.id}/${i}`];let html=(o&&o.html)||pg.html||'';((o&&o.rep)||[]).forEach(([a,b])=>{html=html.split(a).join(b)});
    const t=(o&&o.title)||(B.titles||{})[`${l.id}/${i}`]||pg.title||'';
    s+=`\n--- 쪽 ${i}: ${t}\n${strip(html)}`;
    const ex=(o&&o.example)||pg.example; if(ex&&ex.code) s+=`\n[예제 코드]\n${ex.code}\n`+(ex.output!=null?`[예제 출력] ${ex.output}\n`:'');});
  const tasks=(B.tasks||{})[l.id]||[];
  tasks.forEach((t,i)=>{s+=`\n=== 문제 ${i+1}: ${t.title}${t.predict?' (출력 예측)':''}\n${strip(t.text||'')}\n필요 칩: ${JSON.stringify(t.needs||t.req||'')}\n`+(t.io?`입출력: ${JSON.stringify(t.io)}\n`:'')+(t.answer?`예시 답:\n${t.answer}\n`:'')+(t.explain?`해설: ${strip(t.explain)}\n`:'');});
  (out[l.ch]=out[l.ch]||[]).push(s);
}
fs.mkdirSync(process.argv[2],{recursive:true});
for(const [c,a] of Object.entries(out)){fs.writeFileSync(`${process.argv[2]}/ch${c}.txt`,a.join('\n'));}
console.log(CH.map(c=>`${c.id??c.n??''} ${c.title||c.name||JSON.stringify(c).slice(0,60)}`).join('\n'));
