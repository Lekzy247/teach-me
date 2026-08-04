alter table assignments add column if not exists subject text default 'Mathematics';
alter table assignments add column if not exists skill_name text;

create table if not exists lesson_plans (
  id uuid primary key default gen_random_uuid(),
  class_id uuid references classes(id) on delete cascade,
  creator_id uuid references profiles(id),
  title text not null,
  subject text not null,
  objective text,
  lesson_date date,
  duration_minutes integer default 45,
  materials text,
  activities jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

create table if not exists parent_links (
  parent_id uuid references profiles(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  primary key(parent_id,student_id)
);

create table if not exists ai_policies (
  school_id uuid primary key references schools(id) on delete cascade,
  max_daily_messages integer default 30,
  graded_work_mode text default 'hints_only',
  teacher_visibility boolean default true,
  blocked_topics jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

alter table lesson_plans enable row level security;
alter table parent_links enable row level security;
alter table ai_policies enable row level security;
