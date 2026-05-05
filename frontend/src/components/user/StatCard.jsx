export default function StatCard({ icon, title, value }) {
  return (
    <div className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
      
      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition duration-500 blur-xl"></div>

      <div className="relative">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {title}
          </span>

          <div className="text-indigo-400">{icon}</div>
        </div>

        <div className="text-2xl font-semibold text-white">
          {value}
        </div>
      </div>
    </div>
  );
}