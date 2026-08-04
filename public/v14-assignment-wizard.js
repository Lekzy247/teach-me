(() => {
  const KEY='teachme-teacher-tools-v1';
  const user=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{"classes":[],"questions":[],"assignments":[],"goals":[]}')}catch{return{classes:[],questions:[],assignments:[],goals:[]}}};
  const write=data=>localStorage.setItem(KEY,JSON.stringify(data));
  const token=()=>localStorage.getItem('tm-token')||'';

  async function saveAssignment(payload){
    try{
      const response=await fetch('/api/assignments',{method:'POST',headers:{'Content-Type':'application/json',...(token()?{Authorization:`Bearer ${token()}`}:{})},body:JSON.stringify(payload)});
      const result=await response.json();
      if(!response.ok)throw new Error(result.error||'Unable to save');
      return result;
    }catch{
      const store=read();
      const item={id:`asg_${Date.now()}`,...payload,status:'assigned'};
      store.assignments.push(item);write(store);return item;
    }
  }

  function wizard(){
    const store=read();
    const classes=store.classes.length?store.classes:[{id:'class_1',name:'Grade 5 Explorers'}];
    return `<section class="card v14-wizard">
      <div class="v14-head"><div><span class="badge">Simple assignment wizard</span><h3>Create an assignment</h3><p>Complete four short steps.</p></div><span class="v14-step-label">Step <b>1</b> of 4</span></div>
      <div class="v14-progress"><span style="width:25%"></span></div>
      <form>
        <div class="v14-step active" data-step="1">
          <h4>1. Choose subject and grade</h4>
          <label>Subject</label><select name="subject"><option>Mathematics</option><option>Language Arts</option><option>Science</option></select>
          <label>Grade</label><select name="grade"><option>TK</option><option>Kindergarten</option>${Array.from({length:12},(_,i)=>`<option>Grade ${i+1}</option>`).join('')}</select>
        </div>
        <div class="v14-step" data-step="2">
          <h4>2. Describe the assignment</h4>
          <label>Title</label><input name="title" required placeholder="Fraction Review">
          <label>Skill</label><input name="skill" placeholder="Add fractions with unlike denominators">
        </div>
        <div class="v14-step" data-step="3">
          <h4>3. Set class and timing</h4>
          <label>Class</label><select name="classId">${classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join('')}</select>
          <label>Due date</label><input name="due" type="date">
          <div class="row"><div><label>Questions</label><input name="questionCount" type="number" min="1" max="20" value="20"></div><div><label>Seconds per question</label><input name="secondsPerQuestion" type="number" min="30" max="600" value="180"></div></div>
        </div>
        <div class="v14-step" data-step="4">
          <h4>4. Review and publish</h4>
          <div class="notice v14-summary">Your assignment is ready to review.</div>
        </div>
        <div class="v14-actions"><button type="button" class="btn soft" data-back disabled>Back</button><button type="button" class="btn primary" data-next>Next</button><button type="submit" class="btn primary" data-publish hidden>Publish assignment</button></div>
      </form>
    </section>`;
  }

  function enhance(){
    const current=user();if(!current||!['teacher','admin'].includes(current.role))return;
    const content=document.querySelector('.content');
    const title=content?.querySelector('.page h2')?.textContent?.trim();
    if(title!=='Assignments'||content.querySelector('.v14-wizard'))return;
    content.insertAdjacentHTML('afterbegin',wizard());
    const root=content.querySelector('.v14-wizard'),form=root.querySelector('form');let step=1;
    const show=()=>{root.querySelectorAll('.v14-step').forEach(x=>x.classList.toggle('active',Number(x.dataset.step)===step));root.querySelector('.v14-step-label b').textContent=step;root.querySelector('.v14-progress span').style.width=`${step*25}%`;root.querySelector('[data-back]').disabled=step===1;root.querySelector('[data-next]').hidden=step===4;root.querySelector('[data-publish]').hidden=step!==4;if(step===4){const d=Object.fromEntries(new FormData(form));root.querySelector('.v14-summary').innerHTML=`<b>${d.title||'Untitled assignment'}</b><br>${d.subject} · ${d.grade}<br>${d.questionCount} questions · ${d.secondsPerQuestion} seconds each${d.due?`<br>Due ${d.due}`:''}`}};
    root.querySelector('[data-next]').onclick=()=>{if(step===2&&!form.title.value.trim()){form.title.focus();return}step=Math.min(4,step+1);show()};
    root.querySelector('[data-back]').onclick=()=>{step=Math.max(1,step-1);show()};
    form.onsubmit=async event=>{event.preventDefault();const raw=Object.fromEntries(new FormData(form));const payload={...raw,questionCount:Number(raw.questionCount),secondsPerQuestion:Number(raw.secondsPerQuestion)};await saveAssignment(payload);root.innerHTML='<div class="notice"><b>Assignment published.</b><br>It is now available in this demo.</div>'};
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',enhance);
})();
