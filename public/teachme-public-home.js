(() => {
  const hasUser=()=>{try{return Boolean(JSON.parse(localStorage.getItem('tm-user')||'null'))}catch{return false}};
  const subjectCopy={
    elementary:[['➗','Mathematics','Build number sense, fractions, measurement, and problem-solving confidence.','#3973e8'],['📖','Language Arts','Strengthen reading comprehension, vocabulary, grammar, and writing.','#ff7d66'],['🔬','Science','Explore life, physical, Earth, and engineering concepts through inquiry.','#18a875']],
    middle:[['📐','Mathematics','Practice ratios, equations, geometry, functions, and data analysis.','#3973e8'],['🕵️','Language Arts','Analyze texts, arguments, evidence, vocabulary, and written responses.','#ff7d66'],['🧪','Science','Investigate matter, ecosystems, forces, Earth systems, and design.','#18a875']],
    high:[['📊','Mathematics','Prepare for Algebra, Geometry, advanced functions, and applied modeling.','#3973e8'],['✍️','Language Arts','Develop literary analysis, research, argument, and academic writing.','#ff7d66'],['🧬','Science','Study Biology, Chemistry, Physics, Earth Science, and engineering.','#18a875']]
  };

  function subjects(key='elementary'){
    return subjectCopy[key].map(([icon,title,text,color])=>`<article class="tm-subject-card" style="--accent:${color}"><div class="tm-subject-icon">${icon}</div><h3>${title}</h3><p>${text}</p><a href="#" data-open-login>Explore ${title} →</a></article>`).join('');
  }

  function page(){return `<div class="tm-public-home">
    <nav class="tm-site-nav">
      <a class="tm-brand" href="#top"><span class="tm-brand-mark">T</span><span>Teach Me</span></a>
      <div class="tm-nav-links"><a href="#subjects">Learning</a><a href="#teachers">For teachers</a><a href="#families">For families</a><a href="#standards">California standards</a></div>
      <div class="tm-nav-actions"><button class="tm-btn tm-btn-outline" data-open-login>Sign in</button><button class="tm-btn tm-btn-primary" data-open-login>Start learning</button></div>
    </nav>

    <main id="top">
      <section class="tm-hero">
        <div class="tm-hero-copy">
          <span class="tm-eyebrow">⭐ California-aligned learning for TK–12</span>
          <h1>Every student can <span>learn with confidence.</span></h1>
          <p>Teach Me combines standards-based practice, AI-guided instruction, educational games, and teacher feedback in one welcoming learning environment.</p>
          <div class="tm-hero-actions"><button class="tm-btn tm-btn-primary" data-open-login>Start a free demo</button><a class="tm-btn tm-btn-outline" href="#subjects">Explore subjects</a></div>
          <div class="tm-hero-note">No credit card required · Student, teacher, parent, and administrator demos</div>
        </div>
        <div class="tm-hero-art" aria-label="Teach Me student learning dashboard illustration">
          <div class="tm-learning-card tm-main-card">
            <div class="tm-card-top"><div class="tm-student"><div class="tm-avatar">👧🏽</div><div><strong>Welcome, Maya!</strong><small>Grade 5 learner</small></div></div><div class="tm-progress-ring"><span>78%</span></div></div>
            <div class="tm-question-box"><span class="tm-eyebrow">5.NF.A.1 · Fractions</span><h3>What is 3/4 + 1/8?</h3><div class="tm-answer-grid"><span>4/12</span><span>7/8</span><span>1</span><span>5/8</span></div></div>
          </div>
          <div class="tm-learning-card tm-mini-card tm-badge-card"><div class="tm-icon-circle">🏆</div><div><strong>Skill mastered!</strong><small>Multi-digit multiplication</small></div></div>
          <div class="tm-learning-card tm-mini-card tm-ai-card"><div class="tm-icon-circle">🤖</div><div><strong>AI Teacher</strong><small>Try finding a common denominator.</small></div></div>
          <div class="tm-learning-card tm-mini-card tm-chart-card"><div class="tm-icon-circle">📈</div><div><strong>Weekly growth</strong><small>+14% mastery</small></div></div>
        </div>
      </section>

      <section class="tm-trust-strip">
        <article class="tm-trust-item"><div class="tm-big-icon">🎯</div><h3>Personalized practice</h3><p>Fresh 20-question sessions adapt to grade, subject, and demonstrated skill needs.</p></article>
        <article class="tm-trust-item"><div class="tm-big-icon">🧑🏽‍🏫</div><h3>Teacher connected</h3><p>Teachers create lessons, review student work, return feedback, and monitor mastery.</p></article>
        <article class="tm-trust-item"><div class="tm-big-icon">🛡️</div><h3>Learning-first AI</h3><p>Age-appropriate tutoring provides hints and explanations without completing graded work.</p></article>
      </section>

      <section class="tm-section tm-subject-band" id="subjects">
        <div class="tm-section-heading"><h2>Learning for every grade</h2><p>Explore Mathematics, Language Arts, and Science through original activities aligned with California expectations.</p></div>
        <div class="tm-grade-tabs"><button class="active" data-grade-tab="elementary">TK–5</button><button data-grade-tab="middle">Grades 6–8</button><button data-grade-tab="high">Grades 9–12</button></div>
        <div class="tm-subject-grid" data-subject-grid>${subjects()}</div>
      </section>

      <section class="tm-section" id="teachers">
        <div class="tm-feature-wrap">
          <div class="tm-feature-visual"><div class="tm-dashboard-mock"><span class="tm-eyebrow">Teacher overview</span><h3>Standards mastery</h3><div class="tm-mock-row"><b>Math</b><div class="tm-bar"><i style="width:82%"></i></div><strong>82%</strong></div><div class="tm-mock-row"><b>ELA</b><div class="tm-bar"><i style="width:71%"></i></div><strong>71%</strong></div><div class="tm-mock-row"><b>Science</b><div class="tm-bar"><i style="width:64%"></i></div><strong>64%</strong></div><div class="notice"><b>Suggested focus:</b><br>5-PS1-1 · Matter and particle models</div></div></div>
          <div><span class="tm-eyebrow">Made for educators</span><h2>Teach, assign, review, and support.</h2><div class="tm-feature-list"><article class="tm-feature-item"><span>📅</span><div><h3>California lesson builder</h3><p>Create objectives, guided practice, independent work, interventions, and exit tickets.</p></div></article><article class="tm-feature-item"><span>📝</span><div><h3>Standards-based assignments</h3><p>Build original question sets with timers, hints, explanations, and student workspaces.</p></div></article><article class="tm-feature-item"><span>📊</span><div><h3>Actionable mastery reports</h3><p>See mastered, approaching, and support-needed standards at a glance.</p></div></article></div><button class="tm-btn tm-btn-primary" data-open-login>Open teacher demo</button></div>
        </div>
      </section>

      <section class="tm-section tm-proof" id="standards">
        <div class="tm-section-heading"><h2>Built around meaningful learning</h2><p>Teach Me connects daily activity to clear instructional outcomes for students, teachers, and families.</p></div>
        <div class="tm-proof-grid"><article class="tm-proof-card"><div class="tm-proof-icon">🏫</div><h3>California focused</h3><p>Practice is organized around California mathematics, ELA, and science standards.</p></article><article class="tm-proof-card"><div class="tm-proof-icon">✏️</div><h3>Show your thinking</h3><p>Students can draw, calculate, take notes, and demonstrate how they reached an answer.</p></article><article class="tm-proof-card"><div class="tm-proof-icon">🎮</div><h3>Purposeful games</h3><p>Short learning games reinforce vocabulary, fluency, comprehension, and science concepts.</p></article></div>
      </section>

      <section class="tm-section" id="families"><div class="tm-testimonial"><div class="tm-quote-mark">“</div><div class="tm-quote">Teach Me helps children understand what they are learning, while giving adults a clear view of progress and the next skill to practice.</div><div class="tm-quote-author">Designed for students, educators, and families</div></div></section>

      <section class="tm-final-cta"><h2>Help every learner move forward.</h2><p>Explore the Teach Me California demo as a student, teacher, parent, or administrator.</p><button class="tm-btn tm-btn-white" data-open-login>Start the demo</button></section>
    </main>

    <footer class="tm-footer"><div><div class="tm-brand" style="color:#fff"><span class="tm-brand-mark">T</span><span>Teach Me</span></div><p>California-aligned practice, AI teaching, games, feedback, and progress tracking for TK–12 learners.</p></div><div><h4>Learning</h4><a href="#subjects">Subjects</a><a href="#standards">Standards</a><a href="#teachers">Teacher tools</a></div><div><h4>Users</h4><a href="#" data-open-login>Students</a><a href="#" data-open-login>Teachers</a><a href="#" data-open-login>Families</a></div><div><h4>Demo</h4><a href="#" data-open-login>Sign in</a><a href="#top">Back to top</a></div></footer>

    <div class="tm-login-modal" aria-hidden="true"><div class="tm-login-panel"><button class="tm-modal-close" aria-label="Close">×</button><div id="app-login-content"></div></div></div>
  </div>`}

  function showLogin(){
    const modal=document.querySelector('.tm-login-modal');
    const host=document.querySelector('#app-login-content');
    const original=document.querySelector('#app');
    if(!modal||!host||!original)return;
    const login=original.querySelector('.login');
    if(login&&!host.contains(login))host.append(login);
    modal.classList.add('open');modal.setAttribute('aria-hidden','false');
  }

  function install(){
    if(hasUser()||document.querySelector('.tm-public-home'))return;
    const app=document.querySelector('#app');
    const login=app?.querySelector('.login');
    if(!app||!login)return;
    const holder=document.createElement('div');holder.append(login);
    app.innerHTML=page();
    document.querySelector('#app-login-content').append(holder.firstElementChild);
    document.querySelectorAll('[data-open-login]').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();showLogin()}));
    const modal=document.querySelector('.tm-login-modal');
    document.querySelector('.tm-modal-close').onclick=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};
    modal.addEventListener('click',event=>{if(event.target===modal)document.querySelector('.tm-modal-close').click()});
    document.querySelectorAll('[data-grade-tab]').forEach(button=>button.onclick=()=>{document.querySelectorAll('[data-grade-tab]').forEach(item=>item.classList.remove('active'));button.classList.add('active');document.querySelector('[data-subject-grid]').innerHTML=subjects(button.dataset.gradeTab);document.querySelectorAll('[data-subject-grid] [data-open-login]').forEach(link=>link.onclick=event=>{event.preventDefault();showLogin()})});
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(install));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',install);
})();
