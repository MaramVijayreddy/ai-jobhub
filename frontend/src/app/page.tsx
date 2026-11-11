'use client';

import { useState, useEffect } from 'react';
import { Job } from '../lib/types';
import JobCard from '../components/JobCard';

const categories = [
  {
    emoji: '🎓',
    label: 'Fresher Jobs',
    desc: 'Entry-level roles for 0–2 years of experience and graduating batches',
    href: '/jobs/fresher',
    bg: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8',
  },
  {
    emoji: '💼',
    label: 'Experienced Jobs',
    desc: 'Mid to senior roles for seasoned professionals',
    href: '/jobs/experienced',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#15803d',
  },
  {
    emoji: '🌐',
    label: 'Remote Jobs',
    desc: 'Work from anywhere — India or abroad',
    href: '/jobs/remote',
    bg: '#faf5ff',
    border: '#e9d5ff',
    text: '#7c3aed',
  },
  {
    emoji: '📋',
    label: 'Internships',
    desc: 'Paid & unpaid internships for students and graduates',
    href: '/jobs/internship',
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#b45309',
  },
];

export default function Home() {
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        if (Array.isArray(data)) {
          setRecentJobs(data.slice(0, 3));
        }
      } catch {
        setRecentJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #6d28d9 100%)',
        }}
        className="text-white py-20 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-widest">
            🇮🇳 India&apos;s AI Job Discovery & LaTeX Resume Platform
          </span>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-6">
            Discover Verified AI Jobs &<br />
            <span className="text-yellow-300">Generate Perfect LaTeX Resumes</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Browse jobs posted directly by admins. Get customized prompts tailored to each job description for ChatGPT LaTeX resumes, and apply through verified company links.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/jobs"
              className="bg-yellow-400 text-blue-900 font-extrabold px-8 py-4 rounded-xl text-base hover:bg-yellow-300 transition shadow-lg"
            >
              Browse All Jobs →
            </a>
            <a
              href="/jobs/fresher"
              className="bg-white/10 border border-white/40 text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/20 transition"
            >
              🎓 Fresher Openings
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-black text-blue-700">100%</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Verified Links</div>
          </div>
          <div>
            <div className="text-3xl font-black text-purple-700">LaTeX</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Resume Prompts</div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-600">Free</div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">For All Job Seekers</div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Explore by Category</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Choose your category to find matching openings and batch eligibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <a
              key={cat.href}
              href={cat.href}
              style={{
                backgroundColor: cat.bg,
                borderColor: cat.border,
              }}
              className="border-2 rounded-2xl p-6 block hover:shadow-lg transition-all duration-200 group"
            >
              <div className="text-4xl mb-4">{cat.emoji}</div>
              <h3
                className="text-lg font-bold mb-2 group-hover:underline"
                style={{ color: cat.text }}
              >
                {cat.label}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed">{cat.desc}</p>
              <div className="mt-4 text-xs font-bold" style={{ color: cat.text }}>
                Explore Openings →
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Recent Jobs Section ── */}
      <section className="bg-gray-100/60 py-16 border-t border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Hot Opportunities</span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">Recently Added Job Openings</h2>
            </div>
            <a href="/jobs" className="text-sm font-bold text-blue-700 hover:underline">
              View All ({recentJobs.length}+) →
            </a>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 font-medium">Loading recent jobs...</div>
          ) : recentJobs.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl text-center text-gray-500">No jobs posted yet.</div>
          ) : (
            <div className="flex flex-col gap-4">
              {recentJobs.map((job) => (
                <JobCard key={job.id} job={job} accentColor="#2563eb" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Feature Highlight: AI LaTeX Prompt ── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-purple-900 text-white rounded-3xl p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 bg-purple-800/80 px-3 py-1 rounded-full">
              Exclusive AI Feature
            </span>
            <h2 className="text-3xl font-black mt-4 mb-3">
              Tailored LaTeX Resume Prompts for Every JD
            </h2>
            <p className="text-purple-200 text-sm leading-relaxed mb-6">
              Never send a generic resume again. With one click on any job posting, copy a prompt specially engineered by our admin for that job description. Paste it into ChatGPT to get a 100% matched, compile-ready LaTeX resume in seconds.
            </p>
            <a
              href="/jobs"
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-extrabold px-6 py-3 rounded-xl text-sm transition shadow-md"
            >
              Try with a Job Listing →
            </a>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-xs font-mono text-purple-100 max-w-sm">
            <div className="text-yellow-300 font-bold mb-2">✨ Prompt Preview:</div>
            <p className="opacity-90 leading-relaxed">
              &quot;Act as an elite ATS Resume Architect. Using this Job Description, generate a single-page LaTeX resume...&quot;
            </p>
            <div className="mt-4 pt-3 border-t border-white/20 text-emerald-300 font-semibold text-[11px]">
              ✔ 1-Click Copy Button included on every job page!
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
