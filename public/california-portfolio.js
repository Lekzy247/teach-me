(() => {
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const attempts=()=>{try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}};
  const games=()=>{try{return JSON.parse(localStorage.getItem('teachme-ca-game-scores')||'{}')}catch{return{}}};
  const lessons=()=>{try{return JSON.parse(localStorage.getItem('teachme-california-lessons')||'[]')}catch{return[]}};

  function render(){
    const work=attempts().slice().reverse();
    const gameScores=games();
    const savedLessons=lessons();
    const best=work.length?Math.max(...work.map(item=>Math.round((Number(item.score||0)/Math.max(1,item.answers?.length||20))*100))):0;
    return `<section class="card ca-portfolio">
      <div class="section"><div><span class="badge">California Grade 5</span><h3>Student Learning Portfolio</h3></div><span class="small">Practice, feedback, and achievements</span></div>
      <div class="v11-kpi-grid">
        <article class="v11-kpi"><span>Practice sessions</span><strong>${work.length}</strong><small>Completed work</small></article>
        <article class="v11-kpi"><span>Best score</span><strong>${best}%</strong><small>Across all subjects</small></article>
        <article class="v11-kpi"><span>Game achievements</span><strong>${Object.keys(gameScores).length}</strong><small>Games with saved scores</small></article>
        <article class="v11-kpi"><span>Linked lessons</span><strong>${savedLessons.length}</strong><small>Teacher-created lessons</small></article>
      </div>
      <div class="section"><h3>Recent evidence</h3></div>
      <div class="ca-preview-list">${work.length?work.slice(0,10).map(item=>{
        const total=Math.max(1,item.answers?.length||20);
        const percent=Math.round((Number(item.score||0)/total)*100);
        return `<article class="ca-preview-item"><header><b>${item.subject||'Practice'}</b><span class="badge">${percent}%</span></header><p>${new Date(item.submittedAt||Date.now()).toLocaleDateString()} · ${item.score||0}/${total} correct</p><p><b>Standards:</b> ${[...new Set(item.standards||[])].join(', ')||'Not recorded'}</p><p><b>Teacher feedback:</b> ${item.feedback||'No feedback yet.'}</p></article>`;
      }).join(''):'<div class="ca-preview-empty">No portfolio evidence yet. Complete a practice session to begin.</div>'}</div>
      <div class="section"><h3>Game achievements</h3></div>
      <div class="grid g4">${Object.keys(gameScores).length?Object.entries(gameScores).map(([name,score])=>`<article class="card"><span class="badge">Achievement</span><h4>${name.replaceAll('-',' ')}</h4><strong>${score}</strong><p class="small">Best saved score</p></article>`).join(''):'<div class="ca-preview-empty">Play a California learning game to earn an achievement.</div>'}</div>
    </section>`;
  }

  function enhance(){
    const user=getUser();
    if(!user||!['student','parent','teacher','admin'].includes(user.role))return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(!content||content.querySelector('.ca-portfolio'))return;
    if(!['Portfolio','Progress','Parent Progress'].includes(title))return;
    content.insertAdjacentHTML('afterbegin',render());
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
