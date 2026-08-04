# Teach Me V8

Teach Me is a TK–12 learning platform for Mathematics, Language Arts, and Science. The current school-pilot build includes student, teacher, parent, and administrator experiences; timed practice; a digital show-your-work canvas; teacher grading; progress tracking; goals; portfolios; notifications; reports; and a safeguarded AI tutor.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm start
```

Open `http://localhost:8080`.

## Demo accounts

All demo accounts use password `TeachMe123!`.

- Student: `student@teachme.demo`
- Teacher: `teacher@teachme.demo`
- Administrator: `admin@teachme.demo`
- Parent: `parent@teachme.demo`

## Test

```bash
npm test
```

## Deploy to Render

This repository includes `render.yaml`.

1. Sign in to Render.
2. Select **New +** → **Blueprint**.
3. Connect GitHub and choose `Lekzy247/teach-me`.
4. Render will detect `render.yaml`.
5. Create the service.
6. After deployment, open `/api/health` to confirm the server is healthy.

The included JSON storage is suitable for demonstration and pilot testing only. Render's ephemeral filesystem may reset data during redeploys. For production, migrate persistence to PostgreSQL or Supabase using `database/schema.sql`.

## Environment variables

Copy `.env.example` and configure:

- `SESSION_SECRET`: long random value used to sign sessions.
- `OPENAI_API_KEY`: optional future AI integration.
- `SUPABASE_URL`: production database project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase credential.

Never expose service-role keys in browser code.

## Current scope

- Role-based authentication
- Classes and enrollment codes
- Skill-based assignments
- Up to 20 questions per session
- Three-minute default timer per question
- Digital show-your-work canvas
- Automatic scoring and teacher feedback
- Student goals and portfolios
- Parent progress visibility
- Lesson plans, reports, and notifications
- AI tutor limits and graded-work safeguards

## Production roadmap

1. Replace JSON persistence with Supabase/PostgreSQL.
2. Replace demo authentication with Supabase Auth.
3. Add object storage for student work images.
4. Add real OpenAI tutoring through a server-only API route.
5. Add school onboarding, billing, audit logging, and FERPA/COPPA controls.
