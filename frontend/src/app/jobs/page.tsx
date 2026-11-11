'use client';

import { useState, useEffect } from 'react';
import { Job } from '../../lib/types';
import JobCard from '../../components/JobCard';

export default function AllJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchJobs();
  }, [typeFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let url = '/api/jobs';
      const params = new URLSearchParams();
      if (typeFilter !== 'all') {
        params.set('type', typeFilter);
      }
      if (searchTerm) {
        params.set('search', searchTerm);
      }
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
          Explore All AI Jobs
        </h1>
        <p className="text-gray-500 text-base">
          Browse verified job listings across India. Copy custom prompts for ChatGPT LaTeX resumes and apply directly.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-10 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by role, company, skills, or batch (e.g. 2025)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[240px] border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm bg-white font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="fresher">🎓 Fresher Jobs</option>
          <option value="experienced">💼 Experienced Jobs</option>
          <option value="remote">🌐 Remote Jobs</option>
          <option value="internship">📋 Internships</option>
        </select>

        <button
          type="submit"
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition shadow-sm"
        >
          Search Jobs
        </button>
      </form>

      {/* Listings */}
      {loading ? (
        <div className="py-20 text-center text-gray-400 font-medium">
          Loading active job listings...
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-gray-800 mb-1">No Jobs Match Your Filter</h3>
          <p className="text-sm text-gray-500 mb-4">Try clearing your search term or checking another category.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setTypeFilter('all');
            }}
            className="text-blue-700 font-bold text-sm hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} accentColor="#1d4ed8" />
          ))}
        </div>
      )}
    </div>
  );
}
