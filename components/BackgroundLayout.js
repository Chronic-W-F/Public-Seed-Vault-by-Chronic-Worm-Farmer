export default function BackgroundLayout({ children }) {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/vault-bg.png')" }}
    >
      <div className="min-h-screen w-full flex flex-col justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex-grow flex items-center justify-center w-full p-4">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
