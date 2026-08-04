(() => {
  function user(){try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}}
  function attempts(){try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}}
  function go(page){document.querySelector(`.nav button[data-page="${page}"]`)?.click()}

  function enhance(){
    const current=user();
    if(!current||current.role!=='student')return;
    const content=document.querySelector('.content');
    const hero=content?.querySelector('.hero');
    if(!content||!hero||content.querySelector('.v13-simple-home'))return;

    const done=attempts().length;
    const block=document.createElement('section');
    block.className='v13-simple-home';
    block.innerHTML=`
      <div class="section"><h3>Start here</h3><span class="small">Simple daily learning plan</span></div>
      <div class="grid g3">
        <article class="card">
          <span class="badge">Continue learning</span>
          <h3>Fraction Foundations</h3>
          <p>Pick up where you stopped and complete today's practice.</p>
          <button class="btn primary" data-go="assignments">Continue</button>
        </article>
        <article class="card">
          <span class="badge">Daily practice</span>
          <h3>20 questions</h3>
          <p>Three minutes per question with space to show your work.</p>
          <button class="btn soft" data-go="assignments">Start practice</button>
        </article>
        <article class="card">
          <span class="badge">Need help?</span>
          <h3>Ask AI Teacher</h3>
          <p>Get a simple explanation or a hint without giving away graded answers.</p>
          <button class="btn soft" data-go="ai">Ask for help</button>
        </article>
      </div>
      <div class="section"><h3>Recent activity</h3></div>
      <div class="card">
        ${done?`<p><b>${done}</b> practice session${done===1?'':'s'} completed.</p><button class="btn soft" data-go="progress">View progress</button>`:`<p>No completed practice yet. Start your first session today.</p><button class="btn primary" data-go="assignments">Start now</button>`}
      </div>
    `;
    content.append(block);
    block.querySelectorAll('[data-go]').forEach(button=>button.onclick=()=>go(button.dataset.go));
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
