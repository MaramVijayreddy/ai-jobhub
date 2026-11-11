-- ============================================================
-- AI JobHub — Supabase SQL Setup (Updated)
-- Run this in your Supabase project → SQL Editor → New Query
-- ============================================================

-- 1. Create or alter the jobs table
create table if not exists public.jobs (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  company       text not null,
  location      text not null,
  type          text not null check (type in ('fresher', 'experienced', 'both', 'internship')),
  is_remote     boolean not null default false,
  batch         text,                        -- e.g. '2023, 2024, 2025' or 'Any Batch'
  salary        text,                        -- e.g. '₹8–15 LPA' or '₹30,000/mo'
  description   text not null,               -- Complete JD
  requirements  text,                        -- Skills & criteria
  apply_link    text not null,               -- Original company apply URL
  resume_prompt text,                        -- LaTeX prompt written by Admin for this JD
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- In case table already existed, add missing columns safely:
alter table public.jobs add column if not exists is_remote boolean not null default false;
alter table public.jobs add column if not exists batch text;
alter table public.jobs drop constraint if exists jobs_type_check;
alter table public.jobs add constraint jobs_type_check check (type in ('fresher', 'experienced', 'both', 'internship'));

-- 2. Trigger for updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function public.set_updated_at();

-- 3. Row Level Security (RLS)
alter table public.jobs enable row level security;

-- Public read policy (anyone can read active jobs)
drop policy if exists "Public can view active jobs" on public.jobs;
create policy "Public can view active jobs"
  on public.jobs for select
  using (is_active = true);

-- Policy for managing jobs:
-- Allows authenticated users OR service role to insert, update, delete
drop policy if exists "Admin can do everything" on public.jobs;
create policy "Admin can do everything"
  on public.jobs for all
  using (true)
  with check (true);

-- 4. Initial Seed Job
insert into public.jobs (
  title, company, location, type, is_remote, batch, salary, description, requirements, apply_link, resume_prompt
) values (
  'Junior AI / ML Engineer',
  'Google Cloud India',
  'Bengaluru, Karnataka',
  'both',
  true,
  '2023, 2024, 2025, 2026 Batch',
  '₹14–22 LPA',
  'We are seeking a high-energy Junior AI / Machine Learning Engineer to design, build, and deploy foundational LLM workflows, retrieval-augmented generation (RAG) pipelines, and intelligent AI agents.

Key Responsibilities:
• Work on scalable AI pipelines and integrate fine-tuned open-source & commercial LLMs.
• Build real-time inference microservices and optimize model response times.
• Collaborate with cross-functional product and backend engineering teams.',
  '• B.Tech / B.E / M.Tech in CS, IT, AI or related disciplines.
• Strong hands-on coding in Python (FastAPI, PyTorch, LangChain, Hugging Face).
• Solid understanding of vector databases, embeddings, and prompt engineering.
• Good foundation in data structures and cloud deployment (GCP/AWS).',
  'https://careers.google.com',
  'Act as an elite Silicon Valley ATS Resume Architect and Principal AI Recruiter. 

Using this Job Description:
- Role: Junior AI / ML Engineer at Google Cloud India (Bengaluru / Remote)
- Requirements: Python, LLM workflows, RAG, LangChain, PyTorch, Vector DBs, Cloud.
- Target Batch: 2023-2026 Grad.

Craft a high-converting, single-page, ATS-optimized LaTeX resume. 
- Use the modern "Jake''s Resume" or clean moderncv template.
- Highlight metrics-driven bullet points with the Google XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]").
- Align all technical skills and project descriptions strictly to the keywords in this JD.
- Provide full, ready-to-compile LaTeX code wrapped in ```latex codeblocks.'
) on conflict do nothing;
