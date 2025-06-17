export default function BackgroundLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url('/vault-bg.jpg')" }} // Change if you're using .png
    >
      <div className="min-h-screen w-full bg-white/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
