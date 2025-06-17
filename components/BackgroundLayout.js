export default function BackgroundLayout({ children }) {
  return (
    <div
      style={{
        backgroundImage: "url('/vault-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(4px)',
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', maxWidth: '1024px' }}>
  <h1 style={{
    fontSize: '2.5rem',
    fontWeight: '900',
    letterSpacing: '0.05em',
    fontFamily: "'Oswald', sans-serif",
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#1a1a1a',
    textTransform: 'uppercase',
  }}>
    Chronic Seed Vault
  </h1>
  {children}
</div>

      </div>
    </div>
  );
}
