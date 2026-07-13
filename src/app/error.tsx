'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[2M Pharmacy Error]', error);
  }, [error]);

  return (
    <div
      className="min-h-screen flex items-center justify-center py-20"
      style={{ background: 'var(--color-page-bg)' }}
    >
      <div className="container-2m max-w-lg text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-black text-[var(--color-text-primary)] mb-3">
          Something went wrong
        </h1>
        <p className="text-[var(--color-text-secondary)] mb-8 text-sm leading-relaxed">
          An unexpected error occurred. Our team has been notified. Please try
          again or return to the homepage.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="btn btn-primary px-6"
          >
            Try Again
          </button>
          <Link href="/" className="btn btn-ghost px-6">
            Go Home
          </Link>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left bg-red-50 border border-red-200 rounded-xl p-4">
            <summary className="text-xs font-bold text-red-600 cursor-pointer">
              Error Details (dev only)
            </summary>
            <pre className="text-[10px] text-red-700 mt-2 overflow-auto">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
