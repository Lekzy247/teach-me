(() => {
  const KEY = 'teachme-teacher-tools-v1';
  const read = () => {
    try { return JSON.parse(localStorage.getItem(KEY) || '{"classes":[],"questions":[],"assignments":[],"goals":[]}'); }
    catch { return { classes: [], questions: [], assignments: [], goals: [] }; }
  };
  const write = data => localStorage.setItem(KEY, JSON.stringify(data));
  const user = () => {
    try { return JSON.parse(localStorage.getItem('tm-user') || 'null'); }
    catch { return null; }
  };
  const token = () => localStorage.getItem('tm-token') || '';

  async function send(path, payload) {
    try {
      const response = await fetch(path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token() ? { Authorization: `Bearer ${token()}` } : {})
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed');
      return result;
    } catch {
      return null;
    }
  }

  function notice(text) {
    const node = document.createElement('div');
    node.className = 'toast';
    node.textContent = text;
    document.body.append(node);
    setTimeout(() => node.remove(), 2400);
  }

  function field(label, input) {
    return `<label>${label}</label>${input}`;
  }

  function panel(title, body) {
    return `<section class="card teacher-builder" style="margin-top:18px"><h3>${title}</h3>${body}</section>`;
  }

  function localCards(type, renderer) {
    const items = read()[type] || [];
    if (!items.length) return '';
    return `<div class="section"><h3>Created in this demo</h3></div><div class="grid g3 teacher-local-${type}">${items.map(renderer).join('')}</div>`;
  }

  function enhanceClasses(content) {
    if (content.querySelector('.teacher-class-builder')) return;
    content.insertAdjacentHTML('beforeend', panel('Create a class', `
      <form class="teacher-class-builder">
        <div class="row">
          <div>${field('Class name','<input name="name" required placeholder="Grade 6 Innovators">')}</div>
          <div>${field('Grade','<select name="grade"><option>TK</option><option>Kindergarten</option>${Array.from({length:12},(_,i)=>`<option>Grade ${i+1}</option>`).join('')}</select>')}</div>
        </div>
        <button class="btn primary" style="margin-top:14px">Create class</button>
      </form>
      ${localCards('classes', item => `<div class="card"><h3>${item.name}</h3><p>${item.grade}</p><span class="badge">Code ${item.code}</span></div>`)}
    `));
    const form = content.querySelector('.teacher-class-builder');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      let created = await send('/api/classes', data);
      if (!created) {
        created = { id: `class_${Date.now()}`, ...data, code: Math.random().toString(36).slice(2,8).toUpperCase(), studentIds: [] };
        const store = read(); store.classes.push(created); write(store);
      }
      notice(`Class created: ${created.name}`);
      form.reset();
      refresh();
    });
  }

  function enhanceQuestions(content) {
    if (content.querySelector('.teacher-question-builder')) return;
    content.insertAdjacentHTML('beforeend', panel('Create an original question', `
      <form class="teacher-question-builder">
        <div class="row">
          <div>${field('Subject','<select name="subject"><option>Mathematics</option><option>Language Arts</option><option>Science</option></select>')}</div>
          <div>${field('Grade','<select name="grade">${Array.from({length:13},(_,i)=>`<option>${i===0?'TK':`Grade ${i}`}</option>`).join('')}</select>')}</div>
        </div>
        ${field('Question','<textarea name="prompt" required placeholder="Enter the question"></textarea>')}
        <div class="row">
          <div>${field('Option A','<input name="a" required>')}</div><div>${field('Option B','<input name="b" required>')}</div>
          <div>${field('Option C','<input name="c" required>')}</div><div>${field('Option D','<input name="d" required>')}</div>
        </div>
        <div class="row">
          <div>${field('Correct option','<select name="correctIndex"><option value="0">A</option><option value="1">B</option><option value="2">C</option><option value="3">D</option></select>')}</div>
          <div>${field('Hint','<input name="hint" placeholder="A helpful clue">')}</div>
        </div>
        <button class="btn primary" style="margin-top:14px">Save question</button>
      </form>
      ${localCards('questions', item => `<div class="card"><span class="badge">${item.subject}</span><h3>${item.prompt}</h3><p class="small">${item.grade}</p></div>`)}
    `));
    const form = content.querySelector('.teacher-question-builder');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const raw = Object.fromEntries(new FormData(form));
      const payload = { subject: raw.subject, grade: raw.grade, prompt: raw.prompt, options: [raw.a,raw.b,raw.c,raw.d], correctIndex: Number(raw.correctIndex), hint: raw.hint };
      let created = await send('/api/question-bank', payload);
      if (!created) {
        created = { id: `q_${Date.now()}`, ...payload };
        const store = read(); store.questions.push(created); write(store);
      }
      notice('Question saved');
      form.reset();
      refresh();
    });
  }

  function enhanceAssignments(content) {
    if (content.querySelector('.teacher-assignment-builder')) return;
    const store = read();
    const classOptions = store.classes.length ? store.classes.map(c=>`<option value="${c.id}">${c.name}</option>`).join('') : '<option value="class_1">Grade 5 Explorers</option>';
    content.insertAdjacentHTML('beforeend', panel('Create an assignment', `
      <form class="teacher-assignment-builder">
        <div class="row">
          <div>${field('Title','<input name="title" required placeholder="Science Review">')}</div>
          <div>${field('Class',`<select name="classId">${classOptions}</select>`)}</div>
        </div>
        <div class="row">
          <div>${field('Subject','<select name="subject"><option>Mathematics</option><option>Language Arts</option><option>Science</option></select>')}</div>
          <div>${field('Skill','<input name="skill" placeholder="Fractions, main idea, ecosystems...">')}</div>
        </div>
        <div class="row">
          <div>${field('Due date','<input name="due" type="date">')}</div>
          <div>${field('Questions','<input name="questionCount" type="number" min="1" max="20" value="20">')}</div>
          <div>${field('Seconds per question','<input name="secondsPerQuestion" type="number" min="30" max="600" value="180">')}</div>
        </div>
        <button class="btn primary" style="margin-top:14px">Publish assignment</button>
      </form>
      ${localCards('assignments', item => `<div class="card"><span class="badge">${item.subject}</span><h3>${item.title}</h3><p>${item.skill||'General practice'}</p><p class="small">${item.questionCount} questions</p></div>`)}
    `));
    const form = content.querySelector('.teacher-assignment-builder');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const raw = Object.fromEntries(new FormData(form));
      const payload = { ...raw, questionCount: Number(raw.questionCount), secondsPerQuestion: Number(raw.secondsPerQuestion) };
      let created = await send('/api/assignments', payload);
      if (!created) {
        created = { id: `asg_${Date.now()}`, ...payload, status: 'assigned' };
        const next = read(); next.assignments.push(created); write(next);
      }
      notice('Assignment published');
      form.reset();
      refresh();
    });
  }

  function enhanceGoals(content) {
    if (content.querySelector('.teacher-goal-builder')) return;
    content.insertAdjacentHTML('beforeend', panel('Set a student goal', `
      <form class="teacher-goal-builder">
        <div class="row">
          <div>${field('Student','<select name="studentId"><option value="u_student">Maya Johnson</option></select>')}</div>
          <div>${field('Goal','<input name="title" required placeholder="Complete 4 science sessions">')}</div>
        </div>
        <div class="row">
          <div>${field('Target','<input name="target" type="number" min="1" value="4">')}</div>
          <div>${field('Due date','<input name="due" type="date">')}</div>
        </div>
        <button class="btn primary" style="margin-top:14px">Save goal</button>
      </form>
      ${localCards('goals', item => `<div class="card"><h3>${item.title}</h3><p>0 / ${item.target}</p><p class="small">Due ${item.due||'Not set'}</p></div>`)}
    `));
    const form = content.querySelector('.teacher-goal-builder');
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const raw = Object.fromEntries(new FormData(form));
      const payload = { ...raw, target: Number(raw.target) };
      let created = await send('/api/goals', payload);
      if (!created) {
        created = { id: `goal_${Date.now()}`, ...payload, progress: 0 };
        const store = read(); store.goals.push(created); write(store);
      }
      notice('Goal saved');
      form.reset();
      refresh();
    });
  }

  function refresh() {
    document.querySelector('.nav button.active')?.click();
  }

  function enhance() {
    const currentUser = user();
    if (!currentUser || !['teacher','admin'].includes(currentUser.role)) return;
    const content = document.querySelector('.content');
    const title = content?.querySelector('.page h2')?.textContent?.trim();
    if (!content || !title) return;
    if (title === 'Classes') enhanceClasses(content);
    if (title === 'Question Bank') enhanceQuestions(content);
    if (title === 'Assignments') enhanceAssignments(content);
    if (title === 'Learning Goals') enhanceGoals(content);
  }

  const observer = new MutationObserver(() => requestAnimationFrame(enhance));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('load', enhance);
})();
