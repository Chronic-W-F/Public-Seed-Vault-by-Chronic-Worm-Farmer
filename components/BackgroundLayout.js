export default function BackgroundLayout({ children }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/vault-bg.png')",
        backgroundSize: 'cover',
      }}
    >
      <div className="min-h-screen flex items-center justify-center w-full bg-white/80 backdrop-blur-sm">
        <div className="w-full max-w-4xl p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
