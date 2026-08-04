(() => {
  const svg = `
    <div class="tm-svg-stage" role="img" aria-label="Student learning with Teach Me on a laptop">
      <svg viewBox="0 0 720 520" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eaf5ff"/><stop offset="1" stop-color="#e8fff7"/></linearGradient>
          <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#3973e8"/><stop offset="1" stop-color="#2452b8"/></linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#234a7a" flood-opacity=".18"/></filter>
        </defs>
        <rect x="38" y="38" width="644" height="430" rx="54" fill="url(#bg)"/>
        <circle cx="610" cy="110" r="52" fill="#fff3c9"/>
        <circle cx="105" cy="405" r="42" fill="#d9efff"/>
        <path d="M80 170c42-52 88-55 128-10" fill="none" stroke="#b7d8ff" stroke-width="14" stroke-linecap="round"/>
        <path d="M542 410c38-40 72-42 105-9" fill="none" stroke="#b8ebd8" stroke-width="14" stroke-linecap="round"/>

        <g filter="url(#shadow)">
          <rect x="255" y="92" width="360" height="240" rx="24" fill="#173153"/>
          <rect x="272" y="110" width="326" height="204" rx="14" fill="#fff"/>
          <rect x="290" y="128" width="126" height="18" rx="9" fill="#dfeaff"/>
          <rect x="290" y="162" width="288" height="60" rx="14" fill="#f4f8ff"/>
          <rect x="306" y="177" width="190" height="12" rx="6" fill="#3973e8"/>
          <rect x="306" y="198" width="116" height="10" rx="5" fill="#bdd2fa"/>
          <rect x="290" y="240" width="132" height="52" rx="12" fill="#e9f8f2"/>
          <rect x="446" y="240" width="132" height="52" rx="12" fill="#fff3df"/>
          <circle cx="315" cy="266" r="10" fill="#18a875"/>
          <path d="M310 266l4 4 8-10" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="334" y="258" width="72" height="8" rx="4" fill="#7ac9a9"/>
          <circle cx="471" cy="266" r="10" fill="#ffbd4a"/>
          <rect x="490" y="258" width="72" height="8" rx="4" fill="#e8b559"/>
          <path d="M235 334h400l-35 32H270z" fill="#c9d8eb"/>
          <rect x="355" y="338" width="160" height="9" rx="4.5" fill="#99afca"/>
        </g>

        <g class="tm-student-figure">
          <circle cx="185" cy="210" r="66" fill="#6f442c"/>
          <path d="M126 209c2-60 38-94 87-82 30 8 49 31 52 65-28-11-48-30-59-55-12 29-38 53-80 72z" fill="#263c61"/>
          <circle cx="185" cy="215" r="52" fill="#a9653e"/>
          <circle cx="168" cy="210" r="4" fill="#173153"/><circle cx="205" cy="210" r="4" fill="#173153"/>
          <path d="M172 234c11 10 25 10 36 0" fill="none" stroke="#6b3827" stroke-width="4" stroke-linecap="round"/>
          <path d="M110 470c2-107 28-169 75-169s76 62 79 169" fill="#3973e8"/>
          <path d="M138 326l47 48 48-48" fill="#fff" opacity=".9"/>
          <path d="M232 359c54-23 86-32 122-34" fill="none" stroke="#a9653e" stroke-width="24" stroke-linecap="round"/>
          <circle cx="358" cy="324" r="14" fill="#a9653e"/>
        </g>

        <g class="tm-float-card tm-float-one" filter="url(#shadow)">
          <rect x="474" y="48" width="170" height="70" rx="18" fill="#fff"/>
          <circle cx="505" cy="83" r="18" fill="#e9f8f2"/>
          <path d="M497 83l6 6 11-15" fill="none" stroke="#18a875" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="532" y="72" width="88" height="9" rx="4.5" fill="#3973e8"/>
          <rect x="532" y="91" width="64" height="7" rx="3.5" fill="#bdd2fa"/>
        </g>

        <g class="tm-float-card tm-float-two" filter="url(#shadow)">
          <rect x="470" y="370" width="180" height="78" rx="18" fill="#fff"/>
          <circle cx="505" cy="409" r="20" fill="#fff3df"/>
          <path d="M505 394l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z" fill="#ffbd4a"/>
          <rect x="538" y="397" width="82" height="9" rx="4.5" fill="#173153"/>
          <rect x="538" y="417" width="58" height="7" rx="3.5" fill="#9fb1c8"/>
        </g>
      </svg>
      <div class="tm-live-chip tm-live-ai"><span>AI</span><b>Guided hint ready</b></div>
      <div class="tm-live-chip tm-live-score"><span>84%</span><b>Weekly mastery</b></div>
    </div>`;

  function install(){
    const art=document.querySelector('.tm-public-home .tm-hero-art');
    if(!art||art.querySelector('.tm-svg-stage'))return;
    art.innerHTML=svg;
    const style=document.createElement('style');
    style.textContent=`
      .tm-svg-stage{position:relative;width:100%;min-height:450px;display:grid;place-items:center}
      .tm-svg-stage svg{width:100%;max-width:700px;height:auto;overflow:visible}
      .tm-student-figure{transform-origin:185px 470px;animation:tmStudentFloat 5s ease-in-out infinite}
      .tm-float-one{animation:tmCardFloat 4.5s ease-in-out infinite}
      .tm-float-two{animation:tmCardFloat 4.5s ease-in-out infinite 1.2s}
      .tm-live-chip{position:absolute;display:flex;align-items:center;gap:9px;background:#fff;border:1px solid rgba(57,115,232,.12);border-radius:16px;padding:10px 14px;box-shadow:0 16px 34px rgba(35,75,132,.16);font-size:13px;color:#183153;animation:tmChipFloat 4s ease-in-out infinite}
      .tm-live-chip span{display:grid;place-items:center;min-width:38px;height:38px;padding:0 8px;border-radius:12px;background:#eef4ff;color:#3973e8;font-weight:1000}
      .tm-live-chip b{white-space:nowrap}
      .tm-live-ai{left:1%;top:16%;animation-delay:.4s}.tm-live-score{right:0;bottom:13%;animation-delay:1.3s}
      @keyframes tmStudentFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
      @keyframes tmCardFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}
      @keyframes tmChipFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
      @media (prefers-reduced-motion:reduce){.tm-student-figure,.tm-float-one,.tm-float-two,.tm-live-chip{animation:none}}
      @media(max-width:620px){.tm-svg-stage{min-height:330px}.tm-live-chip{transform:scale(.86);transform-origin:center}.tm-live-ai{left:-5%;top:10%}.tm-live-score{right:-5%;bottom:7%}}
    `;
    document.head.append(style);
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(install));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',install);
})();
