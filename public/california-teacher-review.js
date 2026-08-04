(() => {
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const attempts=()=>{try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}};

  function latestRows(){
    const all=attempts().slice().reverse();
    if(!all.length)return '<div class="ca-preview-empty">No submitted practice yet.</div>';
    return all.slice(0,8).map(item=>{
      const total=Array.isArray(item.answers)&&item.answers.length?item.answers.length:20;
      const percent=Math.round((Number(item.score||0)/total)*100);
      return `<article class="ca-review-row"><div><span class="badge">${item.subject||'Practice'}</span><h4>${item.studentId==='u_student'?'Maya Johnson':'Student'}</h4><small>${new Date(item.submittedAt||Date.now()).toLocaleDateString()}</small></div><div><strong>${item.score||0}/${total}</strong><span>${percent}%</span></div><button class="btn soft" data-review-id="${item.id}">Review</button></article>`;
    }).join('');
  }

  function panel(){
    return `<section class="card ca-teacher-review"><div class="section"><div><span class="badge">California Practice</span><h3>Recent Student Submissions</h3></div><span class="small">Review scores and standards practiced</span></div><div class="ca-review-list">${latestRows()}</div><div class="ca-review-detail" hidden></div></section>`;
  }

  function openDetail(root,id){
    const item=attempts().find(attempt=>attempt.id===id);
    if(!item)return;
    const detail=root.querySelector('.ca-review-detail');
    const standards=[...new Set(item.standards||[])];
    detail.hidden=false;
    detail.innerHTML=`<div class="notice"><b>${item.subject||'Practice'} submission</b><br>Score: ${item.score||0}/${item.answers?.length||20}<br>Standards: ${standards.length?standards.join(', '):'Not recorded'}<br><label style="display:block;margin-top:10px">Teacher feedback</label><textarea data-feedback placeholder="Add a short comment"></textarea><button class="btn primary" data-save-feedback>Save feedback</button></div>`;
    detail.querySelector('[data-save-feedback]').onclick=()=>{
      const all=attempts();
      const target=all.find(attempt=>attempt.id===id);
      if(target){target.feedback=detail.querySelector('[data-feedback]').value;localStorage.setItem('teachme-demo-attempts',JSON.stringify(all));}
      detail.querySelector('[data-save-feedback]').textContent='Saved';
    };
  }

  function enhance(){
    const user=getUser();
    if(!user||!['teacher','admin'].includes(user.role))return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(!content||content.querySelector('.ca-teacher-review'))return;
    if(!['Students','Reports','Grading'].includes(title))return;
    content.insertAdjacentHTML('afterbegin',panel());
    const root=content.querySelector('.ca-teacher-review');
    root.querySelectorAll('[data-review-id]').forEach(button=>button.onclick=()=>openDetail(root,button.dataset.reviewId));
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
