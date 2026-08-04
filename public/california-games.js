(() => {
  const SCORE_KEY='teachme-ca-game-scores';
  const getUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const scores=()=>{try{return JSON.parse(localStorage.getItem(SCORE_KEY)||'{}')}catch{return{}}};
  const saveScore=(game,value)=>{const all=scores();all[game]=Math.max(all[game]||0,value);localStorage.setItem(SCORE_KEY,JSON.stringify(all))};
  const shuffle=a=>a.map(v=>[Math.random(),v]).sort((x,y)=>x[0]-y[0]).map(x=>x[1]);

  const games=[
    {id:'math-sprint',icon:'⚡',title:'Math Sprint',subject:'Mathematics',standard:'5.NBT.B.5',description:'Solve quick multiplication and number sense questions.'},
    {id:'word-builder',icon:'🔤',title:'Word Builder',subject:'Language Arts',standard:'L.3.4',description:'Match vocabulary words to their meanings.'},
    {id:'main-idea',icon:'📖',title:'Main Idea Match',subject:'Language Arts',standard:'RI.4.2',description:'Read a short passage and choose the main idea.'},
    {id:'science-sort',icon:'🔬',title:'Science Sort',subject:'Science',standard:'3-LS4-3',description:'Classify living things and Earth materials.'}
  ];

  function gameCards(){
    const best=scores();
    return `<section class="ca-games-section">
      <div class="section"><h3>California Learning Games</h3><span class="small">Short games aligned to California standards</span></div>
      <div class="grid g4">${games.map(g=>`<article class="card ca-game-card"><div class="ca-game-icon">${g.icon}</div><span class="badge">${g.standard}</span><h3>${g.title}</h3><p>${g.description}</p><p class="small">Best score: ${best[g.id]||0}</p><button class="btn primary" data-game="${g.id}">Play</button></article>`).join('')}</div>
    </section>`;
  }

  function modalShell(game){return `<div class="ca-game-modal"><div class="ca-game-dialog card"><button class="ca-close" aria-label="Close">×</button><span class="badge">${game.standard}</span><h2>${game.icon} ${game.title}</h2><div class="ca-game-body"></div></div></div>`}
  function openGame(id){const game=games.find(g=>g.id===id);document.body.insertAdjacentHTML('beforeend',modalShell(game));const modal=document.querySelector('.ca-game-modal:last-child');modal.querySelector('.ca-close').onclick=()=>modal.remove();if(id==='math-sprint')mathSprint(modal,game);if(id==='word-builder')wordBuilder(modal,game);if(id==='main-idea')mainIdea(modal,game);if(id==='science-sort')scienceSort(modal,game)}

  function quizEngine(modal,game,questions){let i=0,score=0;const body=modal.querySelector('.ca-game-body');const show=()=>{if(i>=questions.length){saveScore(game.id,score);body.innerHTML=`<div class="ca-result"><div class="ca-result-icon">🏆</div><h3>You scored ${score} out of ${questions.length}</h3><p>Best score: ${scores()[game.id]}</p><button class="btn primary" data-again>Play again</button></div>`;body.querySelector('[data-again]').onclick=()=>quizEngine(modal,game,shuffle(questions));return}const q=questions[i];body.innerHTML=`<div class="ca-game-progress">Question ${i+1} of ${questions.length}</div><h3>${q.prompt}</h3><div class="ca-game-options">${shuffle(q.options).map(o=>`<button data-answer="${encodeURIComponent(o)}">${o}</button>`).join('')}</div><div class="ca-feedback"></div>`;body.querySelectorAll('[data-answer]').forEach(btn=>btn.onclick=()=>{const answer=decodeURIComponent(btn.dataset.answer),correct=answer===q.correct;if(correct)score++;body.querySelectorAll('[data-answer]').forEach(b=>b.disabled=true);const feedback=body.querySelector('.ca-feedback');feedback.className=`ca-feedback ${correct?'correct':'incorrect'}`;feedback.innerHTML=correct?'Correct! Great job.':`Good try. The correct answer is <b>${q.correct}</b>.`;setTimeout(()=>{i++;show()},850)})};show()}

  function mathSprint(modal,game){const questions=Array.from({length:10},(_,i)=>{const a=4+i,b=2+(i%7),answer=a*b;return{prompt:`What is ${a} × ${b}?`,correct:String(answer),options:[String(answer),String(answer+a),String(Math.max(1,answer-b)),String(a+b)]}});quizEngine(modal,game,questions)}
  function wordBuilder(modal,game){quizEngine(modal,game,[
    {prompt:'Which word means “very large”?',correct:'enormous',options:['enormous','tiny','silent','quickly']},
    {prompt:'Which word means “to examine carefully”?',correct:'inspect',options:['inspect','ignore','scatter','whisper']},
    {prompt:'Which word means “able to be trusted”?',correct:'reliable',options:['reliable','fragile','ancient','narrow']},
    {prompt:'Which word means “to make something better”?',correct:'improve',options:['improve','remove','delay','divide']},
    {prompt:'Which word means “full of energy”?',correct:'active',options:['active','empty','gentle','distant']}
  ])}
  function mainIdea(modal,game){quizEngine(modal,game,[
    {prompt:'Lena waters the class garden every morning. She pulls weeds and checks the soil. The plants are growing well. What is the main idea?',correct:'Lena takes care of the class garden.',options:['Lena takes care of the class garden.','The class is studying weather.','The garden has no plants.','Lena visits the garden once a year.']},
    {prompt:'The school library added audiobooks, graphic novels, and a quiet study area. More students now visit after school. What is the main idea?',correct:'New library choices encouraged more students to visit.',options:['New library choices encouraged more students to visit.','The library removed all books.','Students only visit before school.','Graphic novels are the only books available.']},
    {prompt:'Sea otters eat animals that feed on kelp. When otters are healthy, kelp forests can grow. What is the main idea?',correct:'Sea otters help protect kelp forests.',options:['Sea otters help protect kelp forests.','Kelp forests grow without animals.','Sea otters only eat plants.','All ocean animals live in kelp.']}
  ])}
  function scienceSort(modal,game){quizEngine(modal,game,[
    {prompt:'Which item is a living thing?',correct:'oak tree',options:['oak tree','granite rock','glass cup','metal spoon']},
    {prompt:'Which animal is best adapted to a dry desert?',correct:'kangaroo rat',options:['kangaroo rat','trout','polar bear','frog']},
    {prompt:'Which material was formed from once-living organisms?',correct:'coal',options:['coal','glass','aluminum foil','plastic ruler']},
    {prompt:'Which organism is a producer?',correct:'grass',options:['grass','hawk','mushroom','rabbit']},
    {prompt:'Which trait helps a duck move through water?',correct:'webbed feet',options:['webbed feet','sharp claws','thick fur','long horns']}
  ])}

  function enhance(){const current=getUser();if(!current||current.role!=='student')return;const content=document.querySelector('.content');const hero=content?.querySelector('.hero');if(!content||!hero||content.querySelector('.ca-games-section'))return;content.insertAdjacentHTML('beforeend',gameCards());content.querySelectorAll('[data-game]').forEach(btn=>btn.onclick=()=>openGame(btn.dataset.game))}
  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(document.documentElement,{childList:true,subtree:true});window.addEventListener('load',enhance);
})();
