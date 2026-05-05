export default function GradientBackground({ children }) {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">

      {/* Main Gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
           background:"linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)"
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-500/20 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-purple-500/20 opacity-20 rounded-full blur-3xl"></div>
      <div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-indigo-500/20 opacity-20 rounded-full blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}