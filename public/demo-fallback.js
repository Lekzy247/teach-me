(() => {
  const realFetch = window.fetch.bind(window);
  const DEMO_PASSWORD = 'TeachMe123!';
  const users = {
    'student@teachme.demo': { id: 'u_student', name: 'Maya Johnson', role: 'student', grade: 'Grade 5' },
    'teacher@teachme.demo': { id: 'u_teacher', name: 'Ms. Williams', role: 'teacher', grade: 'Grade 5' },
    'admin@teachme.demo': { id: 'u_admin', name: 'Jordan Lee', role: 'admin', grade: '' },
    'parent@teachme.demo': { id: 'u_parent', name: 'Avery Johnson', role: 'parent', grade: '' }
  };

  const classes = [{ id: 'class_1', name: 'Grade 5 Explorers', grade: 'Grade 5', code: 'TM5A72', studentIds: ['u_student'] }];
  const assignments = [{ id: 'asg_1', classId: 'class_1', title: 'Fraction Foundations', subject: 'Mathematics', skill: 'Add fractions with unlike denominators', due: '2026-08-10', questionCount: 20, secondsPerQuestion: 180, status: 'assigned' }];
  const questions = Array.from({ length: 20 }, (_, i) => ({
    id: `asg_1_q${i + 1}`,
    prompt: ['What is 3/4 + 1/8?', 'Which fraction equals 2/3?', 'What is 48 ÷ 6?', 'What is 25% of 80?', 'A rectangle is 7 cm by 4 cm. What is its area?'][i % 5],
    options: [
      ['4/12', '7/8', '1', '5/8'],
      ['4/6', '3/5', '5/8', '6/10'],
      ['6', '7', '8', '9'],
      ['10', '20', '25', '40'],
      ['11 cm²', '22 cm²', '28 cm²', '35 cm²']
    ][i % 5]
  }));

  function response(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
  }

  function tokenUser(headers) {
    const auth = headers?.get?.('authorization') || headers?.get?.('Authorization') || '';
    const token = auth.replace(/^Bearer\s+/i, '');
    if (!token.startsWith('demo:')) return null;
    return users[token.slice(5)] || null;
  }

  function dashboard(user) {
    const base = {
      school: { id: 'school_1', name: 'Teach Me Academy', plan: 'Demo' },
      user,
      users: Object.values(users),
      classes,
      assignments,
      attempts: JSON.parse(localStorage.getItem('teachme-demo-attempts') || '[]'),
      goals: [{ id: 'goal_1', studentId: 'u_student', title: 'Complete 3 practice sessions', target: 3, progress: 0, due: '2026-08-31' }],
      portfolioItems: [],
      notifications: [{ id: 'note_1', userId: user.id, title: 'Welcome to Teach Me', message: 'Your demo account is ready.' }],
      skills: [], standards: [], questionBank: [], drafts: [], lessonPlans: [], aiPolicies: { maxDailyMessages: 30, gradedWorkMode: 'hints_only', teacherVisibility: true }
    };
    if (user.role === 'parent') base.attempts = JSON.parse(localStorage.getItem('teachme-demo-attempts') || '[]');
    return base;
  }

  window.fetch = async function patchedFetch(input, init = {}) {
    const url = typeof input === 'string' ? input : input.url;
    const method = (init.method || 'GET').toUpperCase();

    try {
      const result = await realFetch(input, init);
      const type = result.headers.get('content-type') || '';
      if (result.ok && type.includes('application/json')) return result;
      if (!url.startsWith('/api/')) return result;
    } catch (error) {
      if (!url.startsWith('/api/')) throw error;
    }

    if (url === '/api/login' && method === 'POST') {
      const payload = JSON.parse(init.body || '{}');
      const email = String(payload.email || '').toLowerCase();
      const user = users[email];
      if (!user || payload.password !== DEMO_PASSWORD) return response({ error: 'Invalid demo email or password' }, 401);
      return response({ token: `demo:${email}`, user: { ...user, email } });
    }

    const headers = new Headers(init.headers || {});
    const user = tokenUser(headers);
    if (!user) return response({ error: 'Authentication required' }, 401);

    if (url === '/api/dashboard' && method === 'GET') return response(dashboard(user));
    if (url === '/api/health' && method === 'GET') return response({ ok: true, version: 'static-demo', storage: 'browser' });
    if (url === '/api/assignments/asg_1/questions' && method === 'GET') return response({ assignment: assignments[0], questions, draft: null });
    if (url === '/api/attempts' && method === 'POST') {
      const payload = JSON.parse(init.body || '{}');
      const attempt = { id: `att_${Date.now()}`, assignmentId: payload.assignmentId, studentId: user.id, answers: payload.answers || [], score: 0, status: 'submitted', submittedAt: new Date().toISOString(), teacherScore: null, feedback: '' };
      const attempts = JSON.parse(localStorage.getItem('teachme-demo-attempts') || '[]');
      attempts.push(attempt);
      localStorage.setItem('teachme-demo-attempts', JSON.stringify(attempts));
      return response(attempt, 201);
    }
    if (url === '/api/ai' && method === 'POST') {
      const payload = JSON.parse(init.body || '{}');
      const text = String(payload.message || '');
      const answer = /answer|solve it for me/i.test(text)
        ? 'I can give you a hint, but I will not complete graded work. Show me your first step.'
        : 'Tell me the subject and concept. I will explain it step by step and check your understanding.';
      return response({ response: answer, mode: 'static-demo' });
    }
    if (/^\/api\/attempts\/[^/]+\/grade$/.test(url) && method === 'PATCH') return response({ ok: true });

    return response({ error: 'This demo feature requires the live server.' }, 501);
  };
})();
