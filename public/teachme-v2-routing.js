(() => {
  const loggedIn=()=>{try{return Boolean(JSON.parse(localStorage.getItem('tm-user')||'null'))}catch{return false}};
  const normalizeRoute=()=>location.hash.replace(/^#\/?/,'').split('?')[0]||'home';

  function openLoginRoute(push=true){
    if(loggedIn())return;
    const modal=document.querySelector('.tm-login-modal');
    if(!modal)return;
    if(push&&normalizeRoute()!=='login')history.pushState({route:'login'},'',`${location.pathname}${location.search}#/login`);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('tm-auth-open');
    document.title='Sign in | Teach Me California';
    setTimeout(()=>document.querySelector('#email')?.focus(),80);
  }

  function closeLoginRoute(push=true){
    const modal=document.querySelector('.tm-login-modal');
    modal?.classList.remove('open');
    modal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('tm-auth-open');
    if(push&&normalizeRoute()==='login')history.pushState({route:'home'},'',`${location.pathname}${location.search}#/`);
    document.title='Teach Me California';
  }

  function applyRoute(){
    if(loggedIn())return;
    if(normalizeRoute()==='login')openLoginRoute(false);else closeLoginRoute(false);
  }

  document.addEventListener('click',event=>{
    const open=event.target.closest('[data-open-login]');
    if(open){event.preventDefault();event.stopImmediatePropagation();openLoginRoute(true);return;}
    const close=event.target.closest('.tm-modal-close');
    if(close){event.preventDefault();event.stopImmediatePropagation();closeLoginRoute(true);}
  },true);

  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&normalizeRoute()==='login')closeLoginRoute(true)});
  window.addEventListener('popstate',applyRoute);
  window.addEventListener('hashchange',applyRoute);

  const observer=new MutationObserver(()=>{
    if(loggedIn()){
      document.body.classList.remove('tm-auth-open');
      return;
    }
    requestAnimationFrame(applyRoute);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',applyRoute);
})();
