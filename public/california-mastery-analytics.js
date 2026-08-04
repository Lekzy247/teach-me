(() => {
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const getAttempts=()=>{try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}};

  function buildMastery(){
    const stats={};
    getAttempts().forEach(attempt=>{
      const standards=attempt.standards||[];
      const total=Math.max(1,attempt.answers?.length||20);
      const percent=Math.round((Number(attempt.score||0)/total)*100);
      standards.forEach(code=>{
        const item=stats[code]||{code,attempts:0,totalPercent:0,lastPercent:0,subject:attempt.subject||'Practice'};
        item.attempts+=1;
        item.totalPercent+=percent;
        item.lastPercent=percent;
        item.subject=attempt.subject||item.subject;
        stats[code]=item;
      });
    });
    return Object.values(stats).map(item=>({...item,average:Math.round(item.totalPercent/item.attempts),status:item.totalPercent/item.attempts>=80?'Mastered':item.totalPercent/item.attempts>=60?'Approaching':'Needs support'})).sort((a,b)=>a.average-b.average);
  }

  function render(){
    const rows=buildMastery();
    if(!rows.length)return'<div class="ca-preview-empty">Complete a practice session to generate standards mastery analytics.</div>';
    const mastered=rows.filter(r=>r.status==='Mastered').length;
    const approaching=rows.filter(r=>r.status==='Approaching').length;
    const support=rows.filter(r=>r.status==='Needs support').length;
    return `<section class="card ca-analytics"><div class="section"><div><span class="badge">California Grade 5</span><h3>Standards Mastery Analytics</h3></div><span class="small">Updated from completed practice</span></div><div class="v11-kpi-grid"><article class="v11-kpi"><span>Mastered</span><strong>${mastered}</strong><small>80% or higher</small></article><article class="v11-kpi"><span>Approaching</span><strong>${approaching}</strong><small>60–79%</small></article><article class="v11-kpi"><span>Needs support</span><strong>${support}</strong><small>Below 60%</small></article><article class="v11-kpi"><span>Standards practiced</span><strong>${rows.length}</strong><small>Across all subjects</small></article></div><div class="ca-mastery-list">${rows.map(row=>`<article><div><span class="badge">${row.code}</span><h4>${row.subject}</h4><small>${row.attempts} practice session${row.attempts===1?'':'s'}</small></div><div class="ca-mastery-meter"><div><i style="width:${row.average}%"></i></div><b>${row.average}%</b><span class="ca-status ${row.status==='Mastered'?'mastered':row.status==='Approaching'?'approaching':'support'}">${row.status}</span></div></article>`).join('')}</div><div class="notice"><b>Recommended focus:</b> ${rows[0].code} currently has the lowest demonstrated mastery at ${rows[0].average}%.</div></section>`;
  }

  function enhance(){
    const user=getUser();
    if(!user||!['teacher','admin','parent','student'].includes(user.role))return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(!content||content.querySelector('.ca-analytics'))return;
    if(!['Progress','Reports','Parent Progress','Students'].includes(title))return;
    content.insertAdjacentHTML('afterbegin',render());
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
