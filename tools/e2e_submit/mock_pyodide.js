// 가짜 Pyodide — 동기 XHR 로 로컬 서버의 CPython 을 부름 (워커·메인 스레드 둘 다)
(function(){
  function sx(path,obj){ const x=new XMLHttpRequest(); x.open('POST','http://127.0.0.1:8766'+path,false); x.send(JSON.stringify(obj)); return JSON.parse(x.responseText); }
  const enc=new TextEncoder();
  self.loadPyodide=async function(){
    let out=null, err=null, stdin=null;
    const emit=(t)=>{ if(t&&out) out.write(enc.encode(t)); };
    return {
      setStdout(o){out=o}, setStderr(o){err=o}, setStdin(o){stdin=o},
      runPython(code){ const r=sx('/__py/run',{code}); emit(r.out); if(r.error) throw new Error(r.error); return r.v; },
      FS:{ writeFile(n,t){ sx('/__py/fs',{op:'w',name:n,text:t}); },
           unlink(n){ const r=sx('/__py/fs',{op:'rm',name:n}); if(r.error) throw new Error(r.error); },
           readFile(n){ const r=sx('/__py/fs',{op:'r',name:n}); if(r.error) throw new Error(r.error); return r.text; } },
      globals:{ get(name){ const f=(...args)=>{ const lines=[]; if(stdin){ let l; while(lines.length<5000000 && (l=stdin.stdin())!==null) lines.push(l); } const r=sx('/__py/call',{name,args,stdin:lines.join('')}); emit(r.out); if(r.error) throw new Error(r.error); return r.ret; }; f.destroy=()=>{}; return f; } },
    };
  };
})();
