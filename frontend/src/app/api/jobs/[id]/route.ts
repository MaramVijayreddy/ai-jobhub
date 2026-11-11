import { createClient } from '../../../../lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (!error && data) {
        return NextResponse.json(data);
      }
    } catch {
      // Continue to fallback
    }
  }

  // Check fallback matching
  const FALLBACK_SEEDS: Record<string, any> = {
    'seed-1': {
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
    '1': {
      id: '1',
      title: 'AI Engineer',
      company: 'Google India',
      location: 'Bangalore, Karnataka',
      type: 'experienced',
      is_remote: false,
      batch: 'Any Batch',
      salary: '₹25–40 LPA',
      description: `We are looking for a talented AI Engineer to join our team in Bangalore.\n\nYou will be working on cutting-edge machine learning models, building scalable AI systems, and collaborating with world-class engineers.`,
      requirements: `• 3+ years of experience in AI/ML\n• Strong Python skills\n• Experience with PyTorch or TensorFlow`,
      apply_link: 'https://careers.google.com',
      resume_prompt: `Act as a Staff AI Engineer at Google. Craft an ATS-ready single-page LaTeX resume tailored to this Google AI Engineer JD. Focus on distributed ML training, production inference, and Python.`,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    '2': {
      id: '2',
      title: 'ML Intern',
      company: 'Flipkart',
      location: 'Remote',
      type: 'internship',
      is_remote: true,
      batch: '2025, 2026 Batch',
      salary: '₹25,000/mo',
      description: `Join Flipkart as a Machine Learning Intern to build recommendation engines.`,
      requirements: `• Python, PyTorch, Linear Algebra, Machine Learning fundamentals.`,
      apply_link: 'https://flipkartcareers.com',
      resume_prompt: `Act as a hiring manager at Flipkart. Generate a LaTeX resume for an ML Intern highlighting Kaggle competitions, machine learning projects, and strong coursework.`,
      is_active: true,
      created_at: new Date().toISOString(),
    },
    '3': {
      id: '3',
      title: 'Data Analyst (Fresher)',
      company: 'Infosys',
      location: 'Pune',
      type: 'fresher',
      is_remote: false,
      batch: '2024, 2025 Batch',
      salary: '₹5–8 LPA',
      description: `Entry-level Data Analyst role working with enterprise clients.`,
      requirements: `• SQL, Excel, Python, PowerBI / Tableau.`,
      apply_link: 'https://infosys.com/careers',
      resume_prompt: `Create a clean ATS LaTeX resume for a Fresher Data Analyst position at Infosys highlighting SQL queries, Python data analysis, and dashboard projects.`,
      is_active: true,
      created_at: new Date().toISOString(),
    },
  };

  const fallback = FALLBACK_SEEDS[id];
  if (fallback) {
    return NextResponse.json(fallback);
  }

  return NextResponse.json({ error: 'Job not found' }, { status: 404 });
}
