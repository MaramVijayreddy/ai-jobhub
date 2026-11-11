'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'fresher', // 'fresher' | 'experienced' | 'both' | 'internship'
    is_remote: false,
    batch: '', // e.g. "2023, 2024, 2025 Batch"
    salary: '', // e.g. "₹8–15 LPA"
    apply_link: '',
    description: '',
    requirements: '',
    resume_prompt: '',
    is_active: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Helper button: Auto-generate a prompt template for the Admin!
  const generatePromptTemplate = () => {
    const targetType =
      formData.type === 'fresher'
        ? 'Fresher / Entry-Level Candidate'
        : formData.type === 'both'
        ? 'Fresher and Experienced Professional'
        : formData.type === 'internship'
        ? 'Student / Intern'
        : 'Experienced Professional';

    const prompt = `Act as an elite Silicon Valley ATS Resume Architect and Principal Technical Recruiter.

Using the official Job Description below:
- Target Role: ${formData.title || '[Job Title]'}
- Company: ${formData.company || '[Company Name]'}
- Location: ${formData.location || 'India'} ${formData.is_remote ? '(Remote)' : ''}
- Target Candidates: ${targetType}
${formData.batch ? `- Eligible Batches: ${formData.batch}` : ''}
${formData.salary ? `- Compensation: ${formData.salary}` : ''}

Key Responsibilities & Description:
${formData.description || '[Insert key roles]'}

Requirements & Skills:
${formData.requirements || '[Insert key technical skills]'}

INSTRUCTIONS FOR GENERATING THE RESUME:
1. Write a 1-page, high-impact, ATS-optimized LaTeX resume matching this JD.
2. Structure the resume with sections: Summary, Technical Skills, Professional Experience / Internships, Key Projects, and Education.
3. Every bullet point must strictly follow the Google XYZ formula: "Accomplished [X], as measured by [Y], by doing [Z]" with quantifiable metrics.
4. Naturally weave all high-priority keywords from the JD into the skills and bullet points.
5. Provide the output in clean, compilation-ready LaTeX code wrapped in \`\`\`latex codeblocks, using the clean moderncv or Jake's Resume layout.`;

    setFormData((prev) => ({ ...prev, resume_prompt: prompt }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const adminKey = localStorage.getItem('ai_jobhub_admin_key') || '';
      const res = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post job');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while posting the job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <a href="/admin" className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1">
          ← Back to Admin Dashboard
        </a>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          Admin Job Creator
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-8">
          <h1 className="text-2xl font-extrabold mb-1">Post a New Job Opportunity</h1>
          <p className="text-blue-100 text-sm">
            Fill in the details below. Once posted, it immediately appears on AI JobHub for job seekers.
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="m-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="m-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm font-semibold">
            🎉 Job successfully posted! Redirecting to Dashboard...
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Row 1: Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Junior AI / ML Engineer"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                required
                placeholder="e.g. Google India / Startup"
                value={formData.company}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Location & Remote Checkbox */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. Bengaluru, Karnataka or Pan India"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                <input
                  type="checkbox"
                  name="is_remote"
                  checked={formData.is_remote}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-800">
                  🌐 Is this a Remote Job? (Work from home)
                </span>
              </label>
            </div>
          </div>

          {/* Row 3: Target Audience & Passout Batches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Who can apply? (Category) <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
              >
                <option value="fresher">🎓 Fresher (0–2 years)</option>
                <option value="experienced">💼 Experienced (2+ years)</option>
                <option value="both">🚀 Both (Freshers & Experienced)</option>
                <option value="internship">📋 Internship (Students / Recent Grads)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Eligible Batches (Years of Pass-out)
              </label>
              <input
                type="text"
                name="batch"
                placeholder="e.g. 2023, 2024, 2025, 2026 Batch or Any"
                value={formData.batch}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Specify graduation years eligible to apply.</p>
            </div>
          </div>

          {/* Row 4: Salary & Official Apply Link */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Salary / CTC / Stipend
              </label>
              <input
                type="text"
                name="salary"
                placeholder="e.g. ₹10–18 LPA or ₹30,000/mo"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Official Application Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="apply_link"
                required
                placeholder="https://company.com/careers/apply-here"
                value={formData.apply_link}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Direct company link where applicant submits resume.</p>
            </div>
          </div>

          {/* Row 5: Job Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Job Description (JD) <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Detailed job overview, role responsibilities, what the candidate will be doing..."
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 6: Requirements & Skills */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Key Requirements & Eligibility Criteria
            </label>
            <textarea
              name="requirements"
              rows={4}
              placeholder="Required skills, qualifications, degrees, experience with tech stacks..."
              value={formData.requirements}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Row 7: AI LaTeX Resume Prompt (The core admin feature!) */}
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <label className="text-sm font-extrabold text-purple-900 flex items-center gap-1.5">
                  ✨ Custom LaTeX Resume Prompt for this JD
                </label>
                <p className="text-xs text-purple-700 mt-0.5">
                  Job seekers will copy this prompt to generate an ATS-ready LaTeX resume in ChatGPT!
                </p>
              </div>
              <button
                type="button"
                onClick={generatePromptTemplate}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-sm whitespace-nowrap self-start sm:self-auto"
              >
                🪄 Auto-Generate Template Prompt
              </button>
            </div>

            <textarea
              name="resume_prompt"
              rows={6}
              placeholder="Write or auto-generate the custom ChatGPT prompt that instructs AI to generate an ATS-tailored LaTeX resume for this specific JD..."
              value={formData.resume_prompt}
              onChange={handleChange}
              className="w-full border border-purple-300 rounded-xl p-4 text-xs font-mono bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-800"
            />
          </div>

          {/* Row 8: Active Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-gray-700 cursor-pointer">
              Publish immediately on live website (Checked = Visible to public)
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-6 border-t border-gray-200 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-3.5 px-6 rounded-xl text-base transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Posting Job...' : '🚀 Post Job to AI JobHub'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-3.5 border border-gray-300 rounded-xl text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
