'use client';

import { useState, useEffect } from 'react';
import { Job } from '../../../lib/types';
import JobCard from '../../../components/JobCard';

export default function FresherJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFresherJobs = async () => {
      try {
        const res = await fetch('/api/jobs?type=fresher');
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFresherJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 mb-10 shadow-sm">
        <span className="text-4xl mb-3 block">🎓</span>
        <h1 className="text-3xl font-black mb-2">Fresher & Entry-Level AI Jobs</h1>
        <p className="text-emerald-100 text-sm max-w-xl">
          Verified job openings for 0–2 years of experience and graduating batches (2023, 2024, 2025, 2026).
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-medium">Loading fresher jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Fresher Jobs Found</h3>
          <p className="text-sm text-gray-500 mb-4">Check back soon or post one from the admin portal!</p>
          <a href="/jobs" className="text-emerald-700 font-bold text-sm hover:underline">
            View All Other Jobs →
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} accentColor="#059669" />
          ))}
        </div>
      )}
    </div>
  );
}
