'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Job } from '../../../lib/types';
import ResumePromptModal from '../../../components/ResumePromptModal';

export default function JobDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setJob(data);
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center text-gray-400 font-medium">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
        <p className="text-gray-500 mb-6">This job listing may have expired or been removed.</p>
        <a href="/jobs" className="bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm">
          Browse All Jobs
        </a>
      </div>
    );
  }

  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Back to listings */}
      <a
        href="/jobs"
        className="text-blue-600 text-sm font-semibold hover:underline mb-6 inline-flex items-center gap-1.5"
      >
        ← Back to All Jobs
      </a>

      <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
        {/* Hero Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-8 py-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider bg-white/20 text-white">
              {job.type}
            </span>
            {job.is_remote && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-400/30 text-purple-200">
                🌐 Remote
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">{job.title}</h1>
          <p className="text-blue-100 text-xl font-semibold">{job.company}</p>
        </div>

        {/* Highlights Strip */}
        <div className="border-b border-gray-100 px-8 py-4 flex flex-wrap gap-6 text-sm text-gray-600 bg-gray-50/80">
          <span>📍 {job.location}</span>
          {job.batch && (
            <span className="font-semibold text-emerald-700">
              🎓 Eligible Batch: {job.batch}
            </span>
          )}
          {job.salary && (
            <span className="font-bold text-gray-900">
              💰 Salary: {job.salary}
            </span>
          )}
          <span>🗓 Posted: {postedDate}</span>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {/* Action Row */}
          <div className="flex flex-wrap gap-4 mb-10 pb-8 border-b border-gray-100 items-center">
            {/* Primary Apply Button */}
            <a
              href={job.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold px-8 py-3.5 rounded-xl transition shadow-md text-sm flex items-center gap-2"
            >
              <span>Apply on Company Site</span>
              <span>↗</span>
            </a>

            {/* Resume Prompt Modal Button (Only visible if admin included a prompt) */}
            {job.resume_prompt ? (
              <ResumePromptModal prompt={job.resume_prompt} jobTitle={job.title} />
            ) : null}
          </div>

          {/* Job Description (JD) */}
          <div className="mb-10">
            <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
              <span>📄</span> Job Description
            </h2>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-10">
              <h2 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                <span>🎯</span> Requirements & Skills
              </h2>
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                {job.requirements}
              </div>
            </div>
          )}

          {/* Bottom Call to Action Card */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-center">
            <h3 className="text-xl font-black text-gray-900 mb-2">Ready to apply for this role?</h3>
            <p className="text-sm text-gray-600 mb-6 max-w-lg mx-auto">
              Make sure your resume is tailored using our AI Resume Prompt before applying directly on the official company page.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={job.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition shadow-md"
              >
                Apply at {job.company} →
              </a>
              {job.resume_prompt && (
                <ResumePromptModal prompt={job.resume_prompt} jobTitle={job.title} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
