import { createClient } from '../../../lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { Job } from '../../../lib/types';

// Fallback seed jobs in case Supabase is not yet connected
const FALLBACK_JOBS: Job[] = [
  {
    id: 'seed-1',
    title: 'Junior AI / ML Engineer',
    company: 'Google Cloud India',
    location: 'Bengaluru, Karnataka',
    type: 'both',
    is_remote: true,
    batch: '2023, 2024, 2025, 2026 Batch',
    salary: '₹14–22 LPA',
    description: `We are seeking a high-energy Junior AI / Machine Learning Engineer to design, build, and deploy foundational LLM workflows, retrieval-augmented generation (RAG) pipelines, and intelligent AI agents.

Key Responsibilities:
• Work on scalable AI pipelines and integrate fine-tuned open-source & commercial LLMs.
• Build real-time inference microservices and optimize model response times.
• Collaborate with cross-functional product and backend engineering teams.`,
    requirements: `• B.Tech / B.E / M.Tech in CS, IT, AI or related disciplines.
• Strong hands-on coding in Python (FastAPI, PyTorch, LangChain, Hugging Face).
• Solid understanding of vector databases, embeddings, and prompt engineering.
• Good foundation in data structures and cloud deployment (GCP/AWS).`,
    apply_link: 'https://careers.google.com',
    resume_prompt: `Act as an elite Silicon Valley ATS Resume Architect and Principal AI Recruiter. 

Using this Job Description:
- Role: Junior AI / ML Engineer at Google Cloud India (Bengaluru / Remote)
- Requirements: Python, LLM workflows, RAG, LangChain, PyTorch, Vector DBs, Cloud.
- Target Batch: 2023-2026 Grad.

Craft a high-converting, single-page, ATS-optimized LaTeX resume. 
- Use the modern "Jake's Resume" or clean moderncv template.
- Highlight metrics-driven bullet points with the Google XYZ formula ("Accomplished [X], as measured by [Y], by doing [Z]").
- Align all technical skills and project descriptions strictly to the keywords in this JD.
- Provide full, ready-to-compile LaTeX code wrapped in \`\`\`latex codeblocks.`,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'seed-2',
    title: 'Associate Software Engineer - Frontend',
    company: 'Swiggy',
    location: 'Hyderabad, Telangana',
    type: 'fresher',
    is_remote: false,
    batch: '2024, 2025 Batch',
    salary: '₹8–12 LPA',
    description: `Join our consumer tech engineering team building high-performance web and mobile web interfaces for millions of daily active users.`,
    requirements: `• Strong command of React, Next.js, TypeScript, and modern CSS.
• Understanding of web performance, DOM manipulation, and responsive UI.
• Passion for building delightful, snappy user interfaces.`,
    apply_link: 'https://careers.swiggy.com',
    resume_prompt: `Act as a Senior Frontend Recruiter. Create an ATS-ready single-page LaTeX resume tailored for an Associate Frontend Engineer at Swiggy. Emphasize React, TypeScript, Next.js, Tailwind CSS, API integration, and performance optimization projects. Output only valid, ready-to-compile LaTeX.`,
    is_active: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'seed-3',
    title: 'Senior Python & Backend Engineer',
    company: 'Razorpay',
    location: 'Bengaluru / Remote',
    type: 'experienced',
    is_remote: true,
    batch: 'Any Batch',
    salary: '₹22–35 LPA',
    description: `Architect and scale distributed fintech systems handling billions of dollars in transaction volume with 99.999% uptime.`,
    requirements: `• 3+ years experience with Python / Go / Node.js and distributed systems.
• Deep expertise in PostgreSQL, Redis, Kafka, and microservices architecture.
• Strong system design and reliability engineering skills.`,
    apply_link: 'https://razorpay.com/jobs',
    resume_prompt: `Act as a Fintech Tech Lead. Create an ATS-optimized single-page LaTeX resume for a Senior Backend Engineer at Razorpay. Highlight high-throughput systems, database optimization, microservices, Kafka, Redis, and cloud infrastructure. Use the Jake's Resume format in LaTeX.`,
    is_active: true,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'seed-4',
    title: 'GenAI & NLP Research Intern',
    company: 'Flipkart',
    location: 'Remote (India)',
    type: 'internship',
    is_remote: true,
    batch: '2025, 2026, 2027 Batch',
    salary: '₹35,000 / month',
    description: `6-month internship working directly with Flipkart's applied AI research group on catalog search, recommendation LLMs, and conversational agents.`,
    requirements: `• Enrolled in B.Tech / M.Tech / MS in Computer Science or related degree.
• Familiarity with transformers, PyTorch, Hugging Face, and prompt evaluation.
• Strong problem-solving and algorithmic thinking.`,
    apply_link: 'https://flipkartcareers.com',
    resume_prompt: `Act as an AI Research Director. Create an academic and project-focused ATS LaTeX resume for a GenAI & NLP Research Intern at Flipkart. Emphasize hands-on ML projects, transformer architectures, PyTorch, research publications/hackathons, and high GPA. Output clean LaTeX code.`,
    is_active: true,
    created_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const search = searchParams.get('search')?.toLowerCase();
  const remoteOnly = searchParams.get('remote') === 'true';

  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (type === 'fresher') {
        query = query.in('type', ['fresher', 'both']);
      } else if (type === 'experienced') {
        query = query.in('type', ['experienced', 'both']);
      } else if (type === 'internship') {
        query = query.eq('type', 'internship');
      } else if (type === 'remote') {
        query = query.eq('is_remote', true);
      }

      if (remoteOnly) {
        query = query.eq('is_remote', true);
      }

      if (search) {
        query = query.or(
          `title.ilike.%${search}%,company.ilike.%${search}%,location.ilike.%${search}%,batch.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch {
      // Fallback
    }
  }

  // Filter fallback jobs
  let results = [...FALLBACK_JOBS];

  if (type === 'fresher') {
    results = results.filter((j) => j.type === 'fresher' || j.type === 'both');
  } else if (type === 'experienced') {
    results = results.filter((j) => j.type === 'experienced' || j.type === 'both');
  } else if (type === 'internship') {
    results = results.filter((j) => j.type === 'internship');
  } else if (type === 'remote') {
    results = results.filter((j) => j.is_remote);
  }

  if (remoteOnly) {
    results = results.filter((j) => j.is_remote);
  }

  if (search) {
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(search) ||
        j.company.toLowerCase().includes(search) ||
        j.location.toLowerCase().includes(search) ||
        (j.batch && j.batch.toLowerCase().includes(search))
    );
  }

  return NextResponse.json(results);
}
