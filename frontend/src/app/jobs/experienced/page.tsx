'use client';

import { useState, useEffect } from 'react';
import { Job } from '../../../lib/types';
import JobCard from '../../../components/JobCard';

export default function ExperiencedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs?type=experienced');
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white rounded-3xl p-8 mb-10 shadow-sm">
        <span className="text-4xl mb-3 block">💼</span>
        <h1 className="text-3xl font-black mb-2">Experienced AI & Tech Jobs</h1>
        <p className="text-blue-100 text-sm max-w-xl">
          Mid to senior roles, engineering leads, and AI researchers across top tier tech firms.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400 font-medium">Loading experienced jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Experienced Jobs Found</h3>
          <p className="text-sm text-gray-500 mb-4">Check back soon or post one from the admin portal!</p>
          <a href="/jobs" className="text-blue-700 font-bold text-sm hover:underline">
            View All Other Jobs →
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} accentColor="#2563eb" />
          ))}
        </div>
      )}
    </div>
  );
}
