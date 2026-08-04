(() => {
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const getAttempts=()=>{try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}};
  const getScores=()=>{try{return JSON.parse(localStorage.getItem('teachme-ca-game-scores')||'{}')}catch{return{}}};

  const path={
    Mathematics:[
      {standard:'5.NBT.B.5',title:'Multiply multi-digit whole numbers'},
      {standard:'5.NF.A.1',title:'Add and subtract fractions'},
      {standard:'5.NF.B.4',title:'Multiply fractions'},
      {standard:'5.MD.C.5',title:'Understand volume'},
      {standard:'5.G.A.1',title:'Graph points on a coordinate plane'}
    ],
    'Language Arts':[
      {standard:'RL.5.1',title:'Use evidence from literature'},
      {standard:'RI.5.2',title:'Determine main ideas'},
      {standard:'L.5.4',title:'Understand vocabulary in context'},
      {standard:'W.5.1',title:'Write an opinion with reasons'},
      {standard:'SL.5.1',title:'Participate in discussions'}
    ],
    Science:[
      {standard:'5-LS1-1',title:'Matter and energy in organisms'},
      {standard:'5-PS1-1',title:'Model matter as particles'},
      {standard:'5-ESS1-1',title:'Explain patterns in stars'},
      {standard:'5-ESS2-1',title:'Earth systems interactions'},
      {standard:'3-5-ETS1-1',title:'Define an engineering problem'}
    ]
  };

  function progress(){
    const attempts=getAttempts();
    const games=getScores();
    const math=Math.min(100,attempts.length*20);
    const ela=Math.min(100,((games['word-builder']||0)+(games['main-idea']||0))*10);
    const science=Math.min(100,(games['science-sort']||0)*10);
    return{Mathematics:math,'Language Arts':ela,Science:science};
  }

  function stepState(index,percent){
    const threshold=index*20;
    if(percent>=threshold+20)return'complete';
    if(percent>=threshold)return'current';
    return'locked';
  }

  function subjectCard(subject,items,percent){
    const icon=subject==='Mathematics'?'➗':subject==='Language Arts'?'📖':'🔬';
    return `<article class="card ca-path-card"><header><div><span class="badge">${subject}</span><h3>${icon} Grade 5 Learning Path</h3></div><strong>${percent}%</strong></header><div class="ca-path-track">${items.map((item,index)=>{const state=stepState(index,percent);return `<button class="ca-path-step ${state}" data-subject="${subject}" data-standard="${item.standard}" ${state==='locked'?'disabled':''}><span>${state==='complete'?'✓':index+1}</span><div><b>${item.title}</b><small>${item.standard}</small></div></button>`}).join('')}</div></article>`;
  }

  function enhance(){
    const user=getUser();
    if(!user||user.role!=='student')return;
    const content=document.querySelector('.content');
    const hero=content?.querySelector('.hero');
    if(!content||!hero||content.querySelector('.ca-learning-path'))return;
    const p=progress();
    const section=document.createElement('section');
    section.className='ca-learning-path';
    section.innerHTML=`<div class="section"><h3>Grade 5 California Learning Path</h3><span class="small">Complete each standard in order</span></div><div class="grid g3">${Object.entries(path).map(([subject,items])=>subjectCard(subject,items,p[subject])).join('')}</div>`;
    content.append(section);
    section.querySelectorAll('.ca-path-step:not([disabled])').forEach(button=>button.onclick=()=>{
      const assignmentButton=document.querySelector('.nav button[data-page="assignments"]');
      assignmentButton?.click();
    });
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
