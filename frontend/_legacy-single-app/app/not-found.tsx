import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-3xl font-bold text-white mb-2">404 - Page Not Found</h2>
      <p className="text-slate-400 mb-6">The page you are looking for does not exist.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors"
      >
        Return to Home
      </Link>
    </div>
  );
}
