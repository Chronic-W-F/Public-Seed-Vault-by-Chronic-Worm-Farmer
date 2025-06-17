export default function BackgroundLayout({ children }) {
  return (
    <div
      className="bg-[url('/vault-bg.png')] bg-cover bg-center bg-no-repeat min-h-screen w-full flex flex-col"
    >
      <div className="min-h-screen w-full bg-white/80 backdrop-blur-sm flex flex-col">
        <main className="flex-grow flex items-center justify-center w-full px-4 py-8">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
