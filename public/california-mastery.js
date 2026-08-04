(() => {
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const getAttempts=()=>{try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}};
  const getScores=()=>{try{return JSON.parse(localStorage.getItem('teachme-ca-game-scores')||'{}')}catch{return{}}};

  function status(percent){
    if(percent>=80)return{label:'Mastered',className:'mastered'};
    if(percent>=60)return{label:'Approaching',className:'approaching'};
    return{label:'Needs support',className:'support'};
  }

  function rows(){
    const attempts=getAttempts();
    const latest=attempts[attempts.length-1];
    const percent=latest?Math.round((Number(latest.score||0)/20)*100):0;
    const games=getScores();
    const gameAverage=Object.values(games).length?Math.round(Object.values(games).reduce((a,b)=>a+Number(b||0),0)/Object.values(games).length*10):0;
    return [
      {subject:'Mathematics',standard:'5.NBT.B.5',skill:'Multi-digit multiplication',percent},
      {subject:'Mathematics',standard:'5.NF.A.1',skill:'Add and subtract fractions',percent:Math.max(0,percent-8)},
      {subject:'Language Arts',standard:'RI.5.2',skill:'Main idea and key details',percent:gameAverage||64},
      {subject:'Language Arts',standard:'RL.5.1',skill:'Use evidence from a text',percent:Math.max(0,(gameAverage||64)-6)},
      {subject:'Science',standard:'5-LS1-1',skill:'Matter and energy in organisms',percent:games['science-sort']?Math.min(100,games['science-sort']*10):58},
      {subject:'Science',standard:'5-PS1-1',skill:'Matter and particle models',percent:games['science-sort']?Math.min(100,games['science-sort']*10-5):55}
    ];
  }

  function report(){
    const data=rows();
    const average=Math.round(data.reduce((sum,item)=>sum+item.percent,0)/data.length);
    return `<section class="ca-mastery card">
      <div class="ca-mastery-head"><div><span class="badge">California Grade 5</span><h3>Standards Mastery Report</h3><p>Simple view of demonstrated progress by California standard.</p></div><div class="ca-mastery-overall"><strong>${average}%</strong><span>Overall</span></div></div>
      <div class="ca-mastery-list">${data.map(item=>{const s=status(item.percent);return `<article><div><span class="badge">${item.standard}</span><h4>${item.subject}: ${item.skill}</h4></div><div class="ca-mastery-meter"><div><i style="width:${item.percent}%"></i></div><b>${item.percent}%</b><span class="ca-status ${s.className}">${s.label}</span></div></article>`}).join('')}</div>
      <div class="notice"><b>Recommended next step:</b> ${average<60?'Provide guided practice and teacher support.':average<80?'Continue targeted practice on approaching standards.':'Offer enrichment while reviewing any weaker standards.'}</div>
    </section>`;
  }

  function enhance(){
    const user=getUser();
    if(!user||!['student','teacher','parent','admin'].includes(user.role))return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(!content||content.querySelector('.ca-mastery'))return;
    if(!['Progress','Reports','Parent Progress','Students'].includes(title))return;
    content.insertAdjacentHTML('afterbegin',report());
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
