export type JobType = 'fresher' | 'experienced' | 'both' | 'internship';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  is_remote: boolean;
  batch: string | null;           // e.g. "2023, 2024, 2025" or "Any Batch"
  salary: string | null;          // e.g. "₹8–15 LPA" or "₹30,000/month"
  description: string;            // Full JD text
  requirements: string | null;    // Skills / qualifications
  apply_link: string;             // Direct company application URL
  resume_prompt: string | null;   // Admin-provided prompt for ChatGPT LaTeX resume
  is_active: boolean;             // Published vs Hidden
  created_at: string;
  updated_at?: string;
}

export interface JobFormData {
  title: string;
  company: string;
  location: string;
  type: JobType;
  is_remote: boolean;
  batch: string;
  salary: string;
  description: string;
  requirements: string;
  apply_link: string;
  resume_prompt: string;
  is_active: boolean;
}
