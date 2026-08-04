(() => {
  const ATTEMPTS_KEY='teachme-demo-attempts';
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const readAttempts=()=>{try{return JSON.parse(localStorage.getItem(ATTEMPTS_KEY)||'[]')}catch{return[]}};
  const saveAttempts=data=>localStorage.setItem(ATTEMPTS_KEY,JSON.stringify(data));

  const subjects=[
    {name:'Mathematics',icon:'➗',text:'Numbers, fractions, operations, measurement, and geometry.'},
    {name:'Language Arts',icon:'📖',text:'Reading, vocabulary, main idea, evidence, and language.'},
    {name:'Science',icon:'🔬',text:'Life science, physical science, Earth science, and engineering.'}
  ];

  function selector(){
    return `<section class="card ca-practice-selector">
      <div><span class="badge">California Grade 5</span><h3>Choose Today’s Practice</h3><p>Each session contains 20 original questions with up to three minutes per question.</p></div>
      <div class="ca-practice-subjects">${subjects.map(subject=>`<button data-subject="${subject.name}"><span>${subject.icon}</span><b>${subject.name}</b><small>${subject.text}</small></button>`).join('')}</div>
    </section>`;
  }

  function launch(subject){
    if(!window.TeachMeStandardsBank)return;
    const questions=window.TeachMeStandardsBank.generate('5',subject,20);
    let index=0,score=0,selected=[],remaining=180,timer=null;
    document.body.insertAdjacentHTML('beforeend',`<div class="ca-practice-modal"><div class="ca-practice-dialog card"><button class="ca-close" aria-label="Close">×</button><div class="ca-practice-content"></div></div></div>`);
    const modal=document.querySelector('.ca-practice-modal:last-child');
    const body=modal.querySelector('.ca-practice-content');
    const close=()=>{clearInterval(timer);modal.remove()};
    modal.querySelector('.ca-close').onclick=close;

    const finish=()=>{
      clearInterval(timer);
      const attempt={id:`practice_${Date.now()}`,assignmentId:`ca-${subject.toLowerCase().replaceAll(' ','-')}`,studentId:getUser()?.id||'u_student',subject,answers:selected,score,status:'submitted',submittedAt:new Date().toISOString(),standards:questions.map(q=>q.standard)};
      const attempts=readAttempts();attempts.push(attempt);saveAttempts(attempts);
      const percent=Math.round(score/questions.length*100);
      body.innerHTML=`<div class="ca-result"><div class="ca-result-icon">${percent>=80?'🏆':percent>=60?'🌟':'📘'}</div><h2>${subject} Practice Complete</h2><p>You answered <b>${score} of ${questions.length}</b> questions correctly.</p><p><b>${percent}%</b> overall score</p><button class="btn primary" data-close-result>Return to assignments</button></div>`;
      body.querySelector('[data-close-result]').onclick=close;
    };

    const show=()=>{
      clearInterval(timer);
      if(index>=questions.length){finish();return;}
      remaining=180;
      const q=questions[index];
      body.innerHTML=`
        <div class="ca-practice-head"><div><span class="badge">${q.standard}</span><h3>${subject} · Question ${index+1} of ${questions.length}</h3></div><strong data-time>03:00</strong></div>
        <div class="ca-practice-progress"><span style="width:${index/questions.length*100}%"></span></div>
        <h2>${q.prompt}</h2>
        <div class="ca-practice-options">${q.options.map((option,i)=>`<button data-choice="${i}">${option}</button>`).join('')}</div>
        <div class="ca-practice-feedback"></div>
        <button class="btn soft" data-hint>Show hint</button>
      `;
      const clock=body.querySelector('[data-time]');
      timer=setInterval(()=>{
        remaining--;
        clock.textContent=`${String(Math.floor(remaining/60)).padStart(2,'0')}:${String(remaining%60).padStart(2,'0')}`;
        if(remaining<=0){clearInterval(timer);selected.push({questionId:q.id,selectedIndex:null,timedOut:true});index++;show();}
      },1000);
      body.querySelector('[data-hint]').onclick=()=>{body.querySelector('.ca-practice-feedback').innerHTML=`<div class="notice">Think about the skill: <b>${q.skill}</b>. Eliminate choices that do not fit the question.</div>`};
      body.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>{
        clearInterval(timer);
        const choice=Number(button.dataset.choice),correct=choice===q.correctIndex;
        if(correct)score++;
        selected.push({questionId:q.id,selectedIndex:choice,standard:q.standard,secondsUsed:180-remaining});
        body.querySelectorAll('[data-choice]').forEach(b=>b.disabled=true);
        button.classList.add(correct?'correct':'incorrect');
        const feedback=body.querySelector('.ca-practice-feedback');
        feedback.innerHTML=correct?'<div class="ca-feedback correct">Correct. Well done!</div>':`<div class="ca-feedback incorrect">Not quite. The correct answer is <b>${q.options[q.correctIndex]}</b>.</div>`;
        setTimeout(()=>{index++;show()},900);
      });
    };
    show();
  }

  function enhance(){
    const user=getUser();if(!user||user.role!=='student')return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(title!=='Assignments'||content.querySelector('.ca-practice-selector'))return;
    content.insertAdjacentHTML('afterbegin',selector());
    content.querySelectorAll('[data-subject]').forEach(button=>button.onclick=()=>launch(button.dataset.subject));
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',enhance);
})();
