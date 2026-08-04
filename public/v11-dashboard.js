(() => {
  const BADGES = [
    { icon: '🔥', name: '3-Day Streak' },
    { icon: '🧠', name: 'Problem Solver' },
    { icon: '📚', name: 'Book Builder' },
    { icon: '🌟', name: 'Rising Star' }
  ];

  function getUser() {
    try { return JSON.parse(localStorage.getItem('tm-user') || 'null'); }
    catch { return null; }
  }

  function getAttempts() {
    try { return JSON.parse(localStorage.getItem('teachme-demo-attempts') || '[]'); }
    catch { return []; }
  }

  function xpData() {
    const attempts = getAttempts();
    const xp = Math.max(120, attempts.length * 180 + 120);
    const level = Math.floor(xp / 500) + 1;
    const within = xp % 500;
    const streak = Math.max(3, Math.min(14, attempts.length + 3));
    return { attempts, xp, level, within, streak, coins: 240 + attempts.length * 45 };
  }

  function studentDashboard(content) {
    if (content.querySelector('.v11-student-dashboard')) return;
    const { attempts, xp, level, within, streak, coins } = xpData();
    const hero = content.querySelector('.hero');
    if (hero) {
      hero.classList.add('v11-hero');
      hero.querySelector('div:last-child')?.replaceChildren(document.createTextNode('🏫🚀'));
    }

    const block = document.createElement('section');
    block.className = 'v11-student-dashboard';
    block.innerHTML = `
      <div class="v11-kpi-grid">
        <article class="v11-kpi"><span>Level</span><strong>${level}</strong><small>${xp} total XP</small></article>
        <article class="v11-kpi"><span>Learning streak</span><strong>${streak} days</strong><small>Keep the momentum going</small></article>
        <article class="v11-kpi"><span>Coins</span><strong>${coins}</strong><small>Earn rewards by practicing</small></article>
        <article class="v11-kpi"><span>Sessions</span><strong>${attempts.length}</strong><small>Completed practice sessions</small></article>
      </div>
      <div class="v11-layout">
        <article class="card v11-path-card">
          <div class="v11-card-title"><div><span class="badge">Today's path</span><h3>Continue your learning journey</h3></div><span class="v11-illustration">🧑‍🎓📘</span></div>
          <div class="v11-path-item"><div class="v11-subject math">➗</div><div><strong>Fraction Foundations</strong><p>Mathematics · 20 questions</p></div><button class="btn primary" data-v11-page="assignments">Continue</button></div>
          <div class="v11-path-item"><div class="v11-subject ela">📖</div><div><strong>Main Idea Practice</strong><p>Language Arts · Recommended next</p></div><button class="btn soft" data-v11-page="ai">Ask AI Teacher</button></div>
          <div class="v11-path-item"><div class="v11-subject science">🔬</div><div><strong>Ecosystems Explorer</strong><p>Science · Coming soon</p></div><button class="btn soft" disabled>Preview</button></div>
        </article>
        <article class="card v11-level-card">
          <div class="v11-card-title"><div><span class="badge">Progress</span><h3>Level ${level}</h3></div><span class="v11-level-orb">${level}</span></div>
          <p>${500 - within} XP until Level ${level + 1}</p>
          <div class="v11-progress"><span style="width:${Math.max(8, within / 5)}%"></span></div>
          <h4>Recent badges</h4>
          <div class="v11-badges">${BADGES.map(b => `<div title="${b.name}"><span>${b.icon}</span><small>${b.name}</small></div>`).join('')}</div>
        </article>
      </div>
      <div class="section"><h3>Subject mastery</h3><span class="small">Personalized from practice activity</span></div>
      <div class="grid g3">
        ${masteryCard('Mathematics','➗',72,'Fractions and number sense')}
        ${masteryCard('Language Arts','📖',64,'Reading comprehension')}
        ${masteryCard('Science','🔬',58,'Life and Earth science')}
      </div>
    `;
    content.append(block);
    content.querySelectorAll('[data-v11-page]').forEach(button => {
      button.addEventListener('click', () => document.querySelector(`.nav button[data-page="${button.dataset.v11Page}"]`)?.click());
    });
  }

  function masteryCard(subject, icon, value, skill) {
    return `<article class="card v11-mastery"><div class="v11-card-title"><span class="v11-subject-icon">${icon}</span><span class="badge">${value}% mastery</span></div><h3>${subject}</h3><p>${skill}</p><div class="v11-progress"><span style="width:${value}%"></span></div><button class="btn soft" data-v11-page="assignments">Practice now</button></article>`;
  }

  function teacherDashboard(content) {
    if (content.querySelector('.v11-teacher-dashboard')) return;
    const tools = (() => {
      try { return JSON.parse(localStorage.getItem('teachme-teacher-tools-v1') || '{}'); }
      catch { return {}; }
    })();
    const createdClasses = tools.classes?.length || 0;
    const createdAssignments = tools.assignments?.length || 0;
    const block = document.createElement('section');
    block.className = 'v11-teacher-dashboard';
    block.innerHTML = `
      <div class="v11-kpi-grid">
        <article class="v11-kpi"><span>Active classes</span><strong>${Math.max(1, createdClasses)}</strong><small>Ready for instruction</small></article>
        <article class="v11-kpi"><span>Students</span><strong>24</strong><small>Across current classes</small></article>
        <article class="v11-kpi"><span>Assignments</span><strong>${Math.max(1, createdAssignments)}</strong><small>Published this term</small></article>
        <article class="v11-kpi"><span>Needs support</span><strong>4</strong><small>Students flagged by trends</small></article>
      </div>
      <div class="v11-layout">
        <article class="card">
          <div class="v11-card-title"><div><span class="badge">Teacher command center</span><h3>Quick actions</h3></div><span class="v11-illustration">👩‍🏫📊</span></div>
          <div class="v11-action-grid">
            ${action('classes','🏫','Create class','Set up a roster and class code')}
            ${action('questionbank','🧠','Build questions','Author original practice content')}
            ${action('assignments','📝','Publish assignment','Set questions, due date, and timer')}
            ${action('goals','🎯','Set learning goal','Create a focused student target')}
          </div>
        </article>
        <article class="card">
          <span class="badge">AI recommendation</span>
          <h3>Prioritize fraction intervention</h3>
          <p>Four students are likely to benefit from a short small-group review on unlike denominators before the next assignment.</p>
          <button class="btn primary" data-v11-page="students">Review students</button>
          <button class="btn soft" data-v11-page="lessons">Build lesson</button>
        </article>
      </div>
      <div class="section"><h3>Class performance</h3><span class="small">Pilot dashboard preview</span></div>
      <div class="card v11-chart-card">
        <div class="v11-bars">
          ${bar('Fractions',68)}${bar('Reading',76)}${bar('Science',61)}${bar('Writing',72)}
        </div>
      </div>
    `;
    content.append(block);
    content.querySelectorAll('[data-v11-page]').forEach(button => button.addEventListener('click', () => document.querySelector(`.nav button[data-page="${button.dataset.v11Page}"]`)?.click()));
  }

  function action(page, icon, title, text) {
    return `<button class="v11-action" data-v11-page="${page}"><span>${icon}</span><strong>${title}</strong><small>${text}</small></button>`;
  }

  function bar(label, value) {
    return `<div><span>${label}</span><div><i style="width:${value}%"></i></div><strong>${value}%</strong></div>`;
  }

  function enhance() {
    const current = getUser();
    const content = document.querySelector('.content');
    const heading = content?.querySelector('.hero h2, .page h2')?.textContent || '';
    if (!current || !content || !/welcome|overview/i.test(heading)) return;
    if (current.role === 'student') studentDashboard(content);
    if (['teacher','admin'].includes(current.role)) teacherDashboard(content);
  }

  const observer = new MutationObserver(() => requestAnimationFrame(enhance));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', enhance);
})();
