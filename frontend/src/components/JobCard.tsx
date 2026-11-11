import { Job } from '../lib/types';

const badgeStyle: Record<string, { bg: string; text: string; label: string }> = {
  fresher:     { bg: '#dcfce7', text: '#15803d', label: 'Fresher' },
  experienced: { bg: '#dbeafe', text: '#1d4ed8', label: 'Experienced' },
  both:        { bg: '#fef3c7', text: '#b45309', label: 'Fresher & Experienced' },
  internship:  { bg: '#f3e8ff', text: '#7c3aed', label: 'Internship' },
};

interface JobCardProps {
  job: Job;
  accentColor?: string;
}

export default function JobCard({ job, accentColor = '#1d4ed8' }: JobCardProps) {
  const badge = badgeStyle[job.type] ?? { bg: '#f3f4f6', text: '#374151', label: job.type };
  const timeAgo = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <a
      href={`/jobs/${job.id}`}
      className="bg-white border border-gray-200 rounded-xl p-6 block hover:shadow-lg transition-all duration-200 group"
      style={{ borderLeftWidth: 5, borderLeftColor: accentColor }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Header Row: Title + Badges */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
              {job.title}
            </h2>
            <span
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
            {job.is_remote && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                🌐 Remote
              </span>
            )}
            {!job.is_active && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-600">
                Draft / Inactive
              </span>
            )}
          </div>

          {/* Company */}
          <p className="text-blue-600 font-semibold text-base mb-3">{job.company}</p>

          {/* Meta Information Tags */}
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-gray-600">
            <span>📍 {job.location}</span>
            {job.batch && (
              <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                🎓 Batch: {job.batch}
              </span>
            )}
            {job.salary && (
              <span className="font-semibold text-gray-900">
                💰 {job.salary}
              </span>
            )}
            {job.resume_prompt && (
              <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1">
                ✨ Resume Prompt Ready
              </span>
            )}
            <span className="text-gray-400">🗓 {timeAgo}</span>
          </div>
        </div>

        {/* View Details CTA */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <span className="text-sm font-bold group-hover:translate-x-1 transition-transform" style={{ color: accentColor }}>
            View & Apply →
          </span>
        </div>
      </div>
    </a>
  );
}
