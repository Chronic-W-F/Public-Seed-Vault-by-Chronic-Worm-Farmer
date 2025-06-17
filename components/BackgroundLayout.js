export default function BackgroundLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/vault-bg.png')", // make sure the file name matches!
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-white/80 backdrop-blur-sm w-full">
        <div className="w-full max-w-4xl px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
