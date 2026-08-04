(() => {
  const NOTES_KEY='teachme-v12-notes';
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const saveNotes=value=>localStorage.setItem(NOTES_KEY,value);
  const getNotes=()=>localStorage.getItem(NOTES_KEY)||'';

  function workspace(){
    return `<section class="v12-shell">
      <aside class="v12-left card">
        <span class="badge">Learning workspace</span>
        <h3>Fraction Foundations</h3>
        <p class="small">Goal: add fractions with unlike denominators.</p>
        <div class="v12-objectives">
          <button class="active">1. Find a common denominator</button>
          <button>2. Rename each fraction</button>
          <button>3. Add the numerators</button>
          <button>4. Simplify the answer</button>
        </div>
        <div class="notice"><b>AI hint</b><br>Start by finding the least common multiple of 4 and 8.</div>
      </aside>
      <main class="v12-center card">
        <div class="v12-question-head"><div><span class="badge">Mathematics</span><h2>What is 3/4 + 1/8?</h2></div><span class="timer">03:00</span></div>
        <div class="v12-answer-grid">
          <button>4/12</button><button>7/8</button><button>1</button><button>5/8</button>
        </div>
        <div class="v12-tool-tabs">
          <button class="active" data-tool="draw">✏️ Draw</button>
          <button data-tool="grid"># Grid</button>
          <button data-tool="numberline">↔ Number line</button>
          <button data-tool="fractions">◫ Fraction blocks</button>
        </div>
        <div class="v12-board-wrap">
          <canvas id="v12-board" width="1000" height="420"></canvas>
          <div class="v12-board-controls">
            <button class="btn soft" data-action="undo">Undo</button>
            <button class="btn soft" data-action="redo">Redo</button>
            <button class="btn soft" data-action="clear">Clear</button>
            <label>Pen <input type="range" min="1" max="12" value="3" id="v12-width"></label>
          </div>
        </div>
      </main>
      <aside class="v12-right">
        <section class="card">
          <div class="v12-panel-title"><h3>Calculator</h3><span>🧮</span></div>
          <input id="v12-calc-display" readonly value="0">
          <div class="v12-calc">${['7','8','9','÷','4','5','6','×','1','2','3','−','0','.','=','+'].map(v=>`<button data-calc="${v}">${v}</button>`).join('')}</div>
        </section>
        <section class="card">
          <div class="v12-panel-title"><h3>My notes</h3><span>🗒️</span></div>
          <textarea id="v12-notes" placeholder="Write a reminder or strategy...">${getNotes()}</textarea>
          <small class="small">Saved automatically on this device.</small>
        </section>
        <section class="card">
          <div class="v12-panel-title"><h3>Ask AI Teacher</h3><span>🤖</span></div>
          <p class="small">Get a hint without revealing the final answer.</p>
          <button class="btn primary" data-open-ai>Open AI Teacher</button>
        </section>
      </aside>
    </section>`;
  }

  function bindBoard(root){
    const canvas=root.querySelector('#v12-board');
    if(!canvas)return;
    const ctx=canvas.getContext('2d');
    let drawing=false,last=null,history=[],redo=[];
    const snapshot=()=>history.push(canvas.toDataURL());
    const restore=data=>{const img=new Image();img.onload=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0)};img.src=data};
    const point=e=>{const r=canvas.getBoundingClientRect(),p=e.touches?e.touches[0]:e;return{x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height}};
    const start=e=>{snapshot();redo=[];drawing=true;last=point(e);e.preventDefault()};
    const move=e=>{if(!drawing)return;const p=point(e);ctx.lineWidth=Number(root.querySelector('#v12-width').value);ctx.lineCap='round';ctx.strokeStyle='#1d2a45';ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;e.preventDefault()};
    const end=()=>drawing=false;
    canvas.onmousedown=canvas.ontouchstart=start;canvas.onmousemove=canvas.ontouchmove=move;canvas.onmouseup=canvas.onmouseleave=canvas.ontouchend=end;
    root.querySelector('[data-action="clear"]').onclick=()=>{snapshot();ctx.clearRect(0,0,canvas.width,canvas.height)};
    root.querySelector('[data-action="undo"]').onclick=()=>{if(!history.length)return;redo.push(canvas.toDataURL());restore(history.pop())};
    root.querySelector('[data-action="redo"]').onclick=()=>{if(!redo.length)return;history.push(canvas.toDataURL());restore(redo.pop())};
    root.querySelectorAll('[data-tool]').forEach(button=>button.onclick=()=>{root.querySelectorAll('[data-tool]').forEach(x=>x.classList.remove('active'));button.classList.add('active');if(button.dataset.tool==='grid'){ctx.save();ctx.strokeStyle='#dce4f1';ctx.lineWidth=1;for(let x=0;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke()}for(let y=0;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke()}ctx.restore()}if(button.dataset.tool==='numberline'){ctx.save();ctx.strokeStyle='#3157d5';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(100,210);ctx.lineTo(900,210);ctx.stroke();for(let i=0;i<=8;i++){const x=100+i*100;ctx.beginPath();ctx.moveTo(x,195);ctx.lineTo(x,225);ctx.stroke();ctx.fillText(String(i),x-4,250)}ctx.restore()}if(button.dataset.tool==='fractions'){ctx.save();for(let i=0;i<8;i++){ctx.fillStyle=i<6?'#3157d5':'#e8edf8';ctx.fillRect(180+i*75,130,62,90);ctx.strokeRect(180+i*75,130,62,90)}ctx.restore()}});
  }

  function bindCalc(root){
    const display=root.querySelector('#v12-calc-display');let expr='';
    root.querySelectorAll('[data-calc]').forEach(button=>button.onclick=()=>{const v=button.dataset.calc;if(v==='='){try{const safe=expr.replaceAll('÷','/').replaceAll('×','*').replaceAll('−','-');if(!/^[0-9+\-*/.() ]+$/.test(safe))throw new Error();expr=String(Function(`"use strict";return (${safe})`)())}catch{expr='Error'}}else expr+=v;display.value=expr||'0'});
  }

  function enhance(){
    const user=getUser();if(!user||user.role!=='student')return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(title!=='Assignments'||content.querySelector('.v12-launch'))return;
    const launch=document.createElement('section');launch.className='card v12-launch';launch.innerHTML=`<div><span class="badge">New in V12</span><h3>Interactive Learning Workspace</h3><p>Use scratch paper, fraction blocks, calculator, notes, and AI hints in one screen.</p></div><button class="btn primary">Launch workspace</button>`;
    content.prepend(launch);
    launch.querySelector('button').onclick=()=>{content.innerHTML=workspace();bindBoard(content);bindCalc(content);content.querySelector('#v12-notes').addEventListener('input',e=>saveNotes(e.target.value));content.querySelector('[data-open-ai]').onclick=()=>document.querySelector('.nav button[data-page="ai"]')?.click()};
  }
  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',enhance);
})();
