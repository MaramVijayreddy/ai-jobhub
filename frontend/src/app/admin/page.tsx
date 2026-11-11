'use client';

import { useState, useEffect } from 'react';
import { Job } from '../../lib/types';

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Check existing session
  useEffect(() => {
    const savedKey = localStorage.getItem('ai_jobhub_admin_key');
    if (savedKey) {
      setIsAdmin(true);
      fetchJobs(savedKey);
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    // Save key in localStorage and cookie
    localStorage.setItem('ai_jobhub_admin_key', passcode);
    document.cookie = `ai_jobhub_admin_key=${passcode}; path=/; max-age=86400`;
    setIsAdmin(true);
    setLoginError('');
    fetchJobs(passcode);
  };

  const handleLogout = () => {
    localStorage.removeItem('ai_jobhub_admin_key');
    document.cookie = 'ai_jobhub_admin_key=; path=/; max-age=0';
    setIsAdmin(false);
    setJobs([]);
  };

  const fetchJobs = async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/jobs', {
        headers: { 'x-admin-key': key },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setIsAdmin(false);
          setLoginError('Invalid Admin Passcode.');
          localStorage.removeItem('ai_jobhub_admin_key');
        } else {
          // If Supabase not connected yet, show public fallback jobs
          const fallbackRes = await fetch('/api/jobs');
          const fallbackData = await fallbackRes.json();
          setJobs(fallbackData);
        }
      } else {
        const data = await res.json();
        setJobs(data);
      }
    } catch {
      // Fetch fallback
      try {
        const fallbackRes = await fetch('/api/jobs');
        const fallbackData = await fallbackRes.json();
        setJobs(fallbackData);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (job: Job) => {
    const key = localStorage.getItem('ai_jobhub_admin_key') || '';
    const newStatus = !job.is_active;

    try {
      const res = await fetch(`/api/admin/jobs/${job.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': key,
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) => (j.id === job.id ? { ...j, is_active: newStatus } : j))
        );
        setActionMessage(`Status updated for "${job.title}"`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch {
      // Local update for preview
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, is_active: newStatus } : j))
      );
    }
  };

  const deleteJob = async (jobId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const key = localStorage.getItem('ai_jobhub_admin_key') || '';
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { 'x-admin-key': key },
      });

      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setActionMessage(`Job "${title}" deleted.`);
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  // 1. Render Login Screen if not logged in
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl text-center">
          <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🔐
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-sm mb-6">
            Enter your admin password to manage job postings and resume prompts.
          </p>

          {loginError && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-semibold">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter Admin Password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold p-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-md"
            >
              Sign In as Admin
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6">
            Authorized administrator access only.
          </p>
        </div>
      </div>
    );
  }

  // 2. Render Admin Dashboard
  const activeCount = jobs.filter((j) => j.is_active).length;
  const draftCount = jobs.length - activeCount;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your live job postings, custom AI resume prompts, and application links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/admin/jobs/new"
            className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition flex items-center gap-2"
          >
            <span>+</span> Post a New Job
          </a>
          <button
            onClick={handleLogout}
            className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-4 py-3 rounded-xl text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Listings</p>
          <p className="text-3xl font-black text-gray-900 mt-1">{jobs.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Active (Public)</p>
          <p className="text-3xl font-black text-green-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Drafts / Inactive</p>
          <p className="text-3xl font-black text-amber-500 mt-1">{draftCount}</p>
        </div>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm font-semibold">
          ℹ️ {actionMessage}
        </div>
      )}

      {/* Jobs Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-gray-800 text-base">Your Job Postings</h2>
          <span className="text-xs text-gray-500 font-medium">{jobs.length} items found</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 font-medium">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <h3 className="text-lg font-bold text-gray-800 mb-1">No Jobs Posted Yet</h3>
            <p className="text-sm text-gray-500 mb-6">Start by posting your first job opportunity!</p>
            <a
              href="/admin/jobs/new"
              className="bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm"
            >
              Post a Job Now
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-bold text-gray-500 uppercase bg-gray-50/50">
                  <th className="py-3.5 px-6">Job Title & Company</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Eligible Batch</th>
                  <th className="py-3.5 px-6">Resume Prompt</th>
                  <th className="py-3.5 px-6 text-center">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-gray-900">{job.title}</div>
                      <div className="text-xs text-gray-500 font-medium">
                        {job.company} • 📍 {job.location} {job.is_remote && '(Remote)'}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize bg-blue-50 text-blue-700">
                        {job.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-xs font-medium">
                      {job.batch || 'Any Batch'}
                    </td>
                    <td className="py-4 px-6">
                      {job.resume_prompt ? (
                        <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          ✨ Ready
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => toggleJobStatus(job)}
                        className={`text-xs font-bold px-3 py-1 rounded-full cursor-pointer transition ${
                          job.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {job.is_active ? '● Active' : '○ Hidden'}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <a
                        href={`/jobs/${job.id}`}
                        target="_blank"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        View Live
                      </a>
                      <button
                        onClick={() => deleteJob(job.id, job.title)}
                        className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
