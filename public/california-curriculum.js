(() => {
  const KEY='teachme-teacher-tools-v1';
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"classes":[],"questions":[],"assignments":[],"goals":[]}')}catch{return{classes:[],questions:[],assignments:[],goals:[]}}};
  const write=data=>localStorage.setItem(KEY,JSON.stringify(data));

  function renderQuestions(items){
    if(!items.length)return '<div class="ca-preview-empty">Choose a grade and subject, then select Preview Questions.</div>';
    return `<div class="ca-preview-list">${items.map((item,index)=>`<article class="ca-preview-item"><header><b>${index+1}. ${item.standard}</b><span class="badge">${item.skill}</span></header><div>${item.prompt}</div><ol type="A">${item.options.map(option=>`<li>${option}</li>`).join('')}</ol></article>`).join('')}</div>`;
  }

  function enhance(){
    const current=getUser();
    if(!current||!['teacher','admin'].includes(current.role)||!window.TeachMeStandardsBank)return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(title!=='Question Bank'||content.querySelector('.ca-curriculum'))return;

    const grades=['TK','Kindergarten',...Array.from({length:12},(_,i)=>`Grade ${i+1}`)];
    const section=document.createElement('section');
    section.className='card ca-curriculum';
    section.innerHTML=`
      <span class="badge">California Standards</span>
      <h3>Curriculum Question Builder</h3>
      <p>Create an original 20-question set aligned to California standards.</p>
      <div class="ca-curriculum-controls">
        <div><label>Grade</label><select data-grade>${grades.map(g=>`<option>${g}</option>`).join('')}</select></div>
        <div><label>Subject</label><select data-subject><option>Mathematics</option><option>Language Arts</option><option>Science</option></select></div>
        <button class="btn primary" data-preview>Preview 20 Questions</button>
      </div>
      <div data-results>${renderQuestions([])}</div>
      <button class="btn soft" data-save hidden>Save to Question Bank</button>
    `;
    content.prepend(section);
    let currentQuestions=[];
    section.querySelector('[data-preview]').onclick=()=>{
      currentQuestions=window.TeachMeStandardsBank.generate(section.querySelector('[data-grade]').value,section.querySelector('[data-subject]').value,20);
      section.querySelector('[data-results]').innerHTML=renderQuestions(currentQuestions);
      section.querySelector('[data-save]').hidden=!currentQuestions.length;
    };
    section.querySelector('[data-save]').onclick=()=>{
      const store=read();
      const existing=new Set(store.questions.map(q=>`${q.grade}|${q.subject}|${q.prompt}`));
      const added=currentQuestions.filter(q=>!existing.has(`${q.grade}|${q.subject}|${q.prompt}`));
      store.questions.push(...added);
      write(store);
      section.querySelector('[data-save]').textContent=`Saved ${added.length} Questions`;
      setTimeout(()=>section.querySelector('[data-save]').textContent='Save to Question Bank',1800);
    };
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
