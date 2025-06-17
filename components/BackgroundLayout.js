export default function BackgroundLayout({ children }) {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Vault Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('/vault-bg.png')" }}
      />

      {/* White translucent overlay + content */}
      <div className="relative z-10 flex flex-col min-h-screen w-full bg-white/80 backdrop-blur-sm">
        <main className="flex-grow flex items-center justify-center w-full px-4 py-8">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
