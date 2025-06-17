export default function BackgroundLayout({ children }) {
  return (
    <div className="relative min-h-screen w-full">
      {/* Vault Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: "url('/vault-bg.png')", // Make sure file name matches
          backgroundSize: 'cover',
        }}
      />

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-screen w-full bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-4xl p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
