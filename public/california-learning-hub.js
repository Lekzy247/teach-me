(() => {
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const attempts=()=>{try{return JSON.parse(localStorage.getItem('teachme-demo-attempts')||'[]')}catch{return[]}};
  const games=()=>{try{return JSON.parse(localStorage.getItem('teachme-ca-game-scores')||'{}')}catch{return{}}};

  const subjects=[
    {name:'Mathematics',icon:'∑',page:'assignments',accent:'#3973e8',text:'Fractions, operations, measurement, and geometry'},
    {name:'Language Arts',icon:'Aa',page:'assignments',accent:'#ff7d66',text:'Reading, vocabulary, evidence, and writing'},
    {name:'Science',icon:'⚗',page:'assignments',accent:'#18a875',text:'Matter, organisms, Earth systems, and engineering'}
  ];

  function stats(){
    const all=attempts();
    const normalized=all.map(a=>({subject:a.subject||'Mathematics',percent:Math.round((Number(a.score||0)/Math.max(1,a.answers?.length||20))*100),date:a.submittedAt||''}));
    const by={Mathematics:[], 'Language Arts':[], Science:[]};
    normalized.forEach(x=>{if(by[x.subject])by[x.subject].push(x.percent)});
    const avg=name=>by[name].length?Math.round(by[name].reduce((a,b)=>a+b,0)/by[name].length):0;
    return {all,normalized,math:avg('Mathematics'),ela:avg('Language Arts'),science:avg('Science')};
  }

  function nextRecommendation(s){
    const candidates=[
      {subject:'Mathematics',percent:s.math,standard:'5.NF.A.1',title:'Add and subtract fractions'},
      {subject:'Language Arts',percent:s.ela,standard:'RI.5.2',title:'Main ideas and key details'},
      {subject:'Science',percent:s.science,standard:'5-PS1-1',title:'Matter and particle models'}
    ].sort((a,b)=>a.percent-b.percent);
    const item=candidates[0];
    if(item.percent===0)return {...item,label:'Start here',note:'No completed practice yet'};
    if(item.percent<60)return {...item,label:'Review',note:'Needs guided support'};
    if(item.percent<80)return {...item,label:'Keep practicing',note:'Approaching mastery'};
    return {...item,label:'Challenge yourself',note:'Ready for enrichment'};
  }

  function styles(){
    if(document.querySelector('#tm-learning-hub-style'))return;
    const style=document.createElement('style');style.id='tm-learning-hub-style';style.textContent=`
      .tm-learning-hub{display:grid;gap:22px}.tm-hub-hero{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;align-items:center;padding:28px;border-radius:26px;background:linear-gradient(135deg,#eef6ff,#f5fff9);border:1px solid #dce8f5}.tm-hub-hero h2{font-size:34px;margin:8px 0}.tm-hub-hero p{color:#60738c;font-size:16px;line-height:1.6}.tm-hub-badge-row{display:flex;gap:9px;flex-wrap:wrap;margin:18px 0}.tm-hub-badge-row span{border-radius:999px;background:#fff;padding:8px 12px;font-size:12px;font-weight:900;box-shadow:0 5px 14px rgba(35,75,132,.08)}.tm-hub-hero-art{display:grid;place-items:center}.tm-hub-ring{width:170px;height:170px;border-radius:50%;background:conic-gradient(#18a875 0 var(--score),#e4ebf3 var(--score) 100%);display:grid;place-items:center;position:relative}.tm-hub-ring:after{content:"";position:absolute;inset:15px;background:#fff;border-radius:50%}.tm-hub-ring div{position:relative;z-index:1;text-align:center}.tm-hub-ring strong{font-size:36px;display:block}.tm-hub-grid{display:grid;grid-template-columns:1.25fr .75fr;gap:22px}.tm-hub-card{background:#fff;border:1px solid #e0e8f2;border-radius:20px;padding:22px;box-shadow:0 9px 26px rgba(35,75,132,.07)}.tm-hub-card h3{margin:0 0 14px}.tm-today-list{display:grid;gap:10px}.tm-today-item{display:grid;grid-template-columns:36px 1fr auto;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid #edf2f7}.tm-today-item:last-child{border-bottom:0}.tm-today-item span:first-child{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#eef4ff;color:#3973e8;font-weight:1000}.tm-today-item.done span:first-child{background:#e8f8f1;color:#16865f}.tm-today-item small{display:block;color:#6a7c92;margin-top:3px}.tm-subject-hub-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.tm-hub-subject{border:1px solid #e2e8f1;border-radius:18px;background:#fff;padding:18px;text-align:left;cursor:pointer;transition:.2s}.tm-hub-subject:hover{transform:translateY(-2px);box-shadow:0 12px 24px rgba(35,75,132,.1)}.tm-hub-subject .icon{width:50px;height:50px;display:grid;place-items:center;border-radius:15px;color:#fff;font-size:23px;font-weight:1000;margin-bottom:12px}.tm-hub-subject p{color:#687a90;min-height:54px}.tm-rec-card{background:linear-gradient(135deg,#173153,#3973e8);color:#fff;border-radius:20px;padding:22px}.tm-rec-card .badge{background:rgba(255,255,255,.15);color:#fff}.tm-rec-card p{color:#dce8ff;line-height:1.55}.tm-progress-bars{display:grid;gap:14px}.tm-progress-row{display:grid;grid-template-columns:100px 1fr 46px;align-items:center;gap:12px}.tm-progress-row .bar{height:12px;background:#e9eef5;border-radius:999px;overflow:hidden}.tm-progress-row .bar i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#3973e8,#18a875)}.tm-ai-entry{display:grid;grid-template-columns:52px 1fr auto;gap:14px;align-items:center;border-radius:18px;padding:18px;background:#f7faff;border:1px solid #e1e9f4}.tm-ai-icon{width:52px;height:52px;border-radius:16px;background:#eef4ff;display:grid;place-items:center;font-size:25px}.tm-hub-mini-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.tm-hub-mini{padding:16px;border:1px solid #e2e9f2;border-radius:16px;background:#fff}.tm-hub-mini strong{font-size:24px;display:block}@media(max-width:900px){.tm-hub-hero,.tm-hub-grid{grid-template-columns:1fr}.tm-subject-hub-grid,.tm-hub-mini-grid{grid-template-columns:1fr}.tm-hub-hero-art{display:none}}@media(max-width:620px){.tm-progress-row{grid-template-columns:80px 1fr 42px}.tm-ai-entry{grid-template-columns:44px 1fr}.tm-ai-entry button{grid-column:1/-1}}
    `;document.head.append(style);
  }

  function view(){
    const user=getUser();const s=stats();const overall=s.normalized.length?Math.round(s.normalized.reduce((n,x)=>n+x.percent,0)/s.normalized.length):0;const rec=nextRecommendation(s);const gameCount=Object.keys(games()).length;
    const plan=[
      {icon:'✓',title:'Warm-up review',note:'5 minutes',done:s.all.length>0},
      {icon:'2',title:`${rec.standard} mini lesson`,note:rec.title,done:false},
      {icon:'3',title:'20-question practice',note:`${rec.subject} · about 20 minutes`,done:false},
      {icon:'4',title:'Learning game',note:'Short skill reinforcement',done:false},
      {icon:'5',title:'Exit ticket',note:'Check today’s understanding',done:false}
    ];
    return `<section class="tm-learning-hub">
      <div class="tm-hub-hero"><div><span class="badge">California Grade 5</span><h2>Good ${new Date().getHours()<12?'morning':new Date().getHours()<17?'afternoon':'evening'}, ${user.name.split(' ')[0]}!</h2><p>Continue your California learning path, strengthen one important standard, and finish today with a quick mastery check.</p><div class="tm-hub-badge-row"><span>🔥 ${Math.max(1,s.all.length)} day learning streak</span><span>🏆 ${gameCount} game achievements</span><span>📘 ${s.all.length} completed sessions</span></div><button class="btn primary" data-hub-page="assignments">Continue learning</button></div><div class="tm-hub-hero-art"><div class="tm-hub-ring" style="--score:${overall}%"><div><strong>${overall}%</strong><span>Overall mastery</span></div></div></div></div>
      <div class="tm-hub-grid"><div class="tm-hub-card"><h3>Today’s learning plan</h3><div class="tm-today-list">${plan.map(item=>`<div class="tm-today-item ${item.done?'done':''}"><span>${item.done?'✓':item.icon}</span><div><b>${item.title}</b><small>${item.note}</small></div><button class="btn soft" data-hub-page="${item.title.includes('game')?'dashboard':item.title.includes('mini')?'ai':'assignments'}">${item.done?'Done':'Start'}</button></div>`).join('')}</div></div><div class="tm-rec-card"><span class="badge">Recommended next</span><h3>${rec.title}</h3><p><b>${rec.standard}</b><br>${rec.note}. This is the best place to focus next based on current practice results.</p><button class="btn yellow" data-hub-page="assignments">${rec.label}</button></div></div>
      <div class="tm-hub-card"><div class="section"><h3>Choose a subject</h3><span class="small">Fresh 20-question California practice</span></div><div class="tm-subject-hub-grid">${subjects.map(subject=>`<button class="tm-hub-subject" data-hub-page="${subject.page}"><span class="icon" style="background:${subject.accent}">${subject.icon}</span><h3>${subject.name}</h3><p>${subject.text}</p><b style="color:${subject.accent}">Start practice →</b></button>`).join('')}</div></div>
      <div class="tm-hub-grid"><div class="tm-hub-card"><h3>Weekly mastery</h3><div class="tm-progress-bars">${[['Mathematics',s.math],['Language Arts',s.ela],['Science',s.science]].map(([name,value])=>`<div class="tm-progress-row"><b>${name}</b><div class="bar"><i style="width:${value}%"></i></div><strong>${value}%</strong></div>`).join('')}</div></div><div class="tm-hub-card"><h3>Learning snapshot</h3><div class="tm-hub-mini-grid"><div class="tm-hub-mini"><strong>${s.all.length}</strong><span>Sessions</span></div><div class="tm-hub-mini"><strong>${gameCount}</strong><span>Games</span></div><div class="tm-hub-mini"><strong>${overall}%</strong><span>Average</span></div></div></div></div>
      <div class="tm-ai-entry"><div class="tm-ai-icon">AI</div><div><h3>Ask the AI Teacher</h3><p class="small">Get a hint, another example, or a step-by-step explanation without giving away graded answers.</p></div><button class="btn primary" data-hub-page="ai">Ask for help</button></div>
    </section>`;
  }

  function enhance(){
    const user=getUser();if(!user||user.role!=='student')return;
    const content=document.querySelector('.content');if(!content)return;
    const title=content.querySelector('.page h2')?.textContent?.trim();
    const hasDashboardHero=content.querySelector('.hero');
    if(title&&title!=='Dashboard')return;
    if(!hasDashboardHero||content.querySelector('.tm-learning-hub'))return;
    styles();content.innerHTML=view();
    content.querySelectorAll('[data-hub-page]').forEach(button=>button.onclick=()=>document.querySelector(`.nav button[data-page="${button.dataset.hubPage}"]`)?.click());
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',enhance);
})();
