import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI JobHub',
  description: 'Find your next AI-powered job in India and remote opportunities.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-blue-700 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a href="/" className="text-2xl font-extrabold tracking-tight">
              AI <span className="text-yellow-300">JobHub</span>
            </a>
            <nav className="hidden md:flex gap-8 text-sm font-medium">
              <a href="/" className="hover:text-yellow-300 transition">Home</a>
              <a href="/jobs" className="hover:text-yellow-300 transition">All Jobs</a>
              <a href="/jobs/fresher" className="hover:text-yellow-300 transition">Fresher</a>
              <a href="/jobs/experienced" className="hover:text-yellow-300 transition">Experienced</a>
              <a href="/jobs/remote" className="hover:text-yellow-300 transition">Remote</a>
              <a href="/jobs/internship" className="hover:text-yellow-300 transition">Internship</a>
            </nav>
            <a
              href="/admin"
              className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition"
            >
              Admin
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-8">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-semibold text-white text-lg mb-1">AI JobHub</p>
            <p className="text-sm mb-4">India&apos;s platform for AI-era job opportunities.</p>
            <div className="flex justify-center gap-6 text-sm mb-4">
              <a href="/jobs" className="hover:text-white transition">All Jobs</a>
              <a href="/jobs/fresher" className="hover:text-white transition">Fresher</a>
              <a href="/jobs/remote" className="hover:text-white transition">Remote</a>
              <a href="/jobs/internship" className="hover:text-white transition">Internship</a>
            </div>
            <p className="text-xs text-gray-500">© {new Date().getFullYear()} AI JobHub. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
