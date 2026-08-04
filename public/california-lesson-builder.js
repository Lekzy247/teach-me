(() => {
  const KEY='teachme-california-lessons';
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
  const write=data=>localStorage.setItem(KEY,JSON.stringify(data));

  const standards={
    Mathematics:[
      ['5.NBT.B.5','Multiply multi-digit whole numbers'],
      ['5.NF.A.1','Add and subtract fractions'],
      ['5.NF.B.4','Multiply fractions'],
      ['5.MD.C.5','Understand volume'],
      ['5.G.A.1','Graph points on a coordinate plane']
    ],
    'Language Arts':[
      ['RL.5.1','Use evidence from literature'],
      ['RI.5.2','Determine main ideas'],
      ['L.5.4','Vocabulary in context'],
      ['W.5.1','Opinion writing'],
      ['SL.5.1','Collaborative discussions']
    ],
    Science:[
      ['5-LS1-1','Matter and energy in organisms'],
      ['5-PS1-1','Model matter as particles'],
      ['5-ESS1-1','Patterns in stars'],
      ['5-ESS2-1','Earth systems interactions'],
      ['3-5-ETS1-1','Define an engineering problem']
    ]
  };

  function standardOptions(subject){
    return standards[subject].map(([code,title])=>`<option value="${code}|${title}">${code} — ${title}</option>`).join('');
  }

  function lessonTemplate(subject,standard,title){
    const objective=`Students will demonstrate understanding of ${title.toLowerCase()} using grade-appropriate reasoning and evidence.`;
    const success=`Students can explain the concept, complete guided examples, and answer an exit-ticket question independently.`;
    const warmup=subject==='Mathematics'?'Solve one related review problem and explain the strategy.':subject==='Language Arts'?'Read a short paragraph and identify one important detail.':'Observe a simple phenomenon and record one question.';
    const mini=subject==='Mathematics'?'Model the skill with one worked example, think aloud, and check the answer.':subject==='Language Arts'?'Model how to annotate a text and connect details to the main idea.':'Introduce the phenomenon, identify evidence, and connect it to the science concept.';
    return {objective,success,warmup,mini,guided:'Complete three examples together. Ask students to explain each step or piece of evidence.',independent:'Students complete a short standards-aligned practice set independently.',exit:'One question that directly measures the selected standard.',intervention:'Use visuals, sentence frames, smaller steps, and one teacher-led example.',extension:'Ask students to create a new example, defend their reasoning, or apply the concept in a new context.'};
  }

  function savedLessons(){
    const lessons=read();
    if(!lessons.length)return '<div class="ca-preview-empty">No saved lessons yet.</div>';
    return `<div class="ca-lesson-list">${lessons.slice().reverse().map(item=>`<article class="ca-preview-item"><header><b>${item.standard}</b><span class="badge">${item.subject}</span></header><h4>${item.title}</h4><p>${item.objective}</p><small>${item.duration} minutes</small></article>`).join('')}</div>`;
  }

  function builder(){
    return `<section class="card ca-lesson-builder">
      <span class="badge">California Grade 5</span>
      <h3>Lesson Builder</h3>
      <p>Create a simple standards-aligned lesson plan.</p>
      <form>
        <div class="row">
          <div><label>Subject</label><select name="subject" data-subject><option>Mathematics</option><option>Language Arts</option><option>Science</option></select></div>
          <div><label>Standard</label><select name="standard" data-standard>${standardOptions('Mathematics')}</select></div>
          <div><label>Duration</label><select name="duration"><option>30</option><option selected>45</option><option>60</option></select></div>
        </div>
        <label>Lesson title</label><input name="title" required placeholder="Grade 5 standards lesson">
        <div class="row">
          <div><label>Learning objective</label><textarea name="objective"></textarea></div>
          <div><label>Success criteria</label><textarea name="success"></textarea></div>
        </div>
        <div class="row">
          <div><label>Warm-up</label><textarea name="warmup"></textarea></div>
          <div><label>Mini lesson</label><textarea name="mini"></textarea></div>
        </div>
        <div class="row">
          <div><label>Guided practice</label><textarea name="guided"></textarea></div>
          <div><label>Independent practice</label><textarea name="independent"></textarea></div>
        </div>
        <div class="row">
          <div><label>Exit ticket</label><textarea name="exit"></textarea></div>
          <div><label>Intervention support</label><textarea name="intervention"></textarea></div>
        </div>
        <label>Extension activity</label><textarea name="extension"></textarea>
        <div class="ca-lesson-actions"><button type="button" class="btn soft" data-fill>Generate outline</button><button class="btn primary">Save lesson</button></div>
      </form>
      <div class="section"><h3>Saved lessons</h3></div>
      <div data-saved>${savedLessons()}</div>
    </section>`;
  }

  function enhance(){
    const user=getUser();
    if(!user||!['teacher','admin'].includes(user.role))return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(!content||content.querySelector('.ca-lesson-builder'))return;
    if(!['Lesson Plans','Lessons'].includes(title))return;
    content.insertAdjacentHTML('afterbegin',builder());
    const root=content.querySelector('.ca-lesson-builder');
    const form=root.querySelector('form');
    const subject=form.querySelector('[data-subject]');
    const standard=form.querySelector('[data-standard]');
    subject.onchange=()=>{standard.innerHTML=standardOptions(subject.value)};
    root.querySelector('[data-fill]').onclick=()=>{
      const [code,skill]=standard.value.split('|');
      const plan=lessonTemplate(subject.value,code,skill);
      form.title.value=`${skill} Lesson`;
      Object.entries(plan).forEach(([key,value])=>{if(form.elements[key])form.elements[key].value=value});
    };
    form.onsubmit=event=>{
      event.preventDefault();
      const data=Object.fromEntries(new FormData(form));
      const [code,skill]=data.standard.split('|');
      const lessons=read();
      lessons.push({id:`lesson_${Date.now()}`,...data,standard:code,skill,createdAt:new Date().toISOString()});
      write(lessons);
      root.querySelector('[data-saved]').innerHTML=savedLessons();
      form.reset();
      subject.dispatchEvent(new Event('change'));
    };
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
