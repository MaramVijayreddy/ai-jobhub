'use client';

import { useState } from 'react';

interface ResumePromptModalProps {
  prompt: string;
  jobTitle: string;
}

export default function ResumePromptModal({ prompt, jobTitle }: ResumePromptModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers
      const el = document.createElement('textarea');
      el.value = prompt;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition text-sm"
      >
        ✨ Get Resume Prompt
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          {/* Modal */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
            {/* Header */}
            <div className="bg-purple-600 text-white px-6 py-4 flex justify-between items-start">
              <div>
                <p className="text-purple-200 text-xs font-medium mb-1">Resume Prompt for</p>
                <h3 className="text-lg font-bold">{jobTitle}</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-purple-200 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-purple-50 border-b border-purple-100 px-6 py-3">
              <p className="text-purple-800 text-sm font-medium">
                📋 Copy this prompt → paste into <strong>ChatGPT</strong> → get a LaTeX resume tailored to this JD
              </p>
            </div>

            {/* Prompt text */}
            <div className="p-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto font-mono">
                {prompt}
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleCopy}
                  className={`flex-1 font-bold py-3 rounded-xl text-sm transition ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {copied ? '✅ Copied to Clipboard!' : '📋 Copy Prompt'}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-600 text-sm hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-3 text-center">
                Paste this into ChatGPT, Claude, or Gemini to generate a professional LaTeX resume.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
