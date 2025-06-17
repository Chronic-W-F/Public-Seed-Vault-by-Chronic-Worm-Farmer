export default function BackgroundLayout({ children }) {
  return (
    <div
      style={{
        backgroundImage: "url('/vauexport default function BackgroundLayout({ children }) {
  return (
    <div
      style={{
        backgroundImage: "url('/vault-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden', // prevent scrollbars from white gaps
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          minHeight: '100vh',
          width: '100vw', // force full width on mobile
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          boxSizing: 'border-box', // prevents padding from breaking width
        }}
      >
        <div style={{ width: '100%', maxWidth: '1024px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
lt-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(4px)',
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1024px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
