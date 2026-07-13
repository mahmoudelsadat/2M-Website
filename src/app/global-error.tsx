'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('Critical application error:', error);
  return (
    <html>
      <body style={{ background: '#F8F7F4', fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '480px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏥</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1C1917', marginBottom: '0.75rem' }}>
            2M Pharmacy — Critical Error
          </h1>
          <p style={{ color: '#6B6560', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.7 }}>
            A critical error occurred. Please refresh the page or try again later.
          </p>
          <button
            onClick={reset}
            style={{ background: 'var(--color-brand-primary)', color: '#fff', border: 'none', borderRadius: '10px', padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}
