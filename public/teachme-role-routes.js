(() => {
  const readUser=()=>{try{return JSON.parse(localStorage.getItem('tm-user')||'null')}catch{return null}};
  const allowedRoles=['student','teacher','parent','admin'];
  const routeForRole=role=>allowedRoles.includes(role)?role:'student';
  const currentRoute=()=>location.hash.replace(/^#\/?/,'').split('/')[0]||'home';

  function syncRoleRoute(){
    const user=readUser();
    if(!user){
      document.body.removeAttribute('data-app-role');
      return;
    }
    const role=routeForRole(user.role);
    document.body.dataset.appRole=role;
    document.title=`${role.charAt(0).toUpperCase()+role.slice(1)} | Teach Me California`;
    if(['home','login',''].includes(currentRoute())){
      history.replaceState({route:role},'',`${location.pathname}${location.search}#/${role}`);
    }
  }

  function restoreDashboardFromRoute(){
    const user=readUser();
    if(!user)return;
    const route=currentRoute();
    const role=routeForRole(user.role);
    if(allowedRoles.includes(route)&&route!==role){
      history.replaceState({route:role},'',`${location.pathname}${location.search}#/${role}`);
    }
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(()=>{
    syncRoleRoute();
    restoreDashboardFromRoute();
  }));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',()=>{syncRoleRoute();restoreDashboardFromRoute()});
  window.addEventListener('hashchange',restoreDashboardFromRoute);
})();
