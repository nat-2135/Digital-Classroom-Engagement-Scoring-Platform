export const LoadingSkeletons = ({ count = 3 }) => (
    <div>
        {Array.from({ length: count }).map((_, i) => (
            <div key={i} style={{
                background: '#f3f4f6',
                borderRadius: 12, height: 100,
                marginBottom: 16,
                animation: 'shimmer 1.5s infinite'
            }} />
        ))}
    </div>
);

export const ErrorRetry = ({ onRetry, message }) => (
    <div style={{ textAlign: 'center', padding: 60 }}>
        <span style={{ fontSize: 48 }}>⚠️</span>
        <h3 style={{ color: '#ef4444', marginTop: 12, fontFamily: 'DM Sans, sans-serif' }}>
            {message || 'Failed to load data'}
        </h3>
        <button onClick={onRetry} style={{
            marginTop: 16, padding: '10px 24px',
            background: '#059669', color: '#fff',
            border: 'none', borderRadius: 8,
            cursor: 'pointer', fontSize: 14,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 500
        }}>Try Again</button>
    </div>
);
