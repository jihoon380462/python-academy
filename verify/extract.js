const fs=require('fs'), vm=require('vm');
const src=['20_content_a.js','21_content_b.js','22_problems_a.js','23_problems_b.js','24_content_misc.js'].map(f=>fs.readFileSync('/home/claude/src/'+f,'utf8')).join('\n');
const ctx={}; vm.createContext(ctx);
vm.runInContext(src+'\n;this.__out={LESSONS,PROBLEMS,BADGES,ERRORS,GLOSSARY};', ctx);
const {LESSONS,PROBLEMS,BADGES,ERRORS,GLOSSARY}=ctx.__out;
function defaults(p){const o={};if(p.vary)for(const k in p.vary)o[k]=p.vary[k][0];return o;}
function inst(p){ if(!p.vary) return p; const params=defaults(p); const keys=Object.keys(params), vals=keys.map(k=>params[k]); const sub=s=>typeof s!=='string'?s:s.replace(/\{\{([^}]+)\}\}/g,(m,e)=>String(new Function(...keys,'return ('+e+')')(...vals))); const q=JSON.parse(JSON.stringify(p)); q.prompt=sub(q.prompt); q.solution=sub(q.solution); q.starter=sub(q.starter); q.hints=q.hints.map(sub); if(q.tests) q.tests=q.tests.map(t=>({...t,input:sub(t.input),output:sub(t.output),call:sub(t.call),ret:sub(t.ret)})); return q; }
const out=PROBLEMS.map(inst).map(p=>({id:p.id,lesson:p.lesson,type:p.type,title:p.title,boss:!!p.boss,dual:!!p.dual,turtle:!!p.turtle,xp:p.xp||null,solution:p.type==='bug'?p.bug.solution:(p.solution||(p.parsons&&p.parsons.solution)||null),tests:p.type==='bug'?p.bug.tests:(p.tests||[]),parsons:p.parsons?{solution:p.parsons.solution,distractors:p.parsons.distractors||[]}:null,quiz:p.quiz||null,fill:p.fill||null,hints:p.hints,tags:p.tags,vary:!!p.vary}));
fs.writeFileSync('/home/claude/verify/problems.json',JSON.stringify(out,null,1));
const ex=[]; LESSONS.forEach(l=>(l.pages||[]).forEach((pg,i)=>{ if(pg.example) ex.push({lesson:l.id,page:i,code:pg.example.code,stdin:pg.example.stdin||''}); }));
fs.writeFileSync('/home/claude/verify/examples.json',JSON.stringify(ex,null,1));
console.log('problems',out.length,'lessons',LESSONS.length,'examples',ex.length,'badges',BADGES.length,'errors',ERRORS.length,'glossary',Object.keys(GLOSSARY).length);
const byType={}; out.forEach(p=>byType[p.type]=(byType[p.type]||0)+1); console.log(byType);
