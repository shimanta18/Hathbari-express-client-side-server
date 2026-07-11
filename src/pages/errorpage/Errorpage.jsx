export default function ChainGPT404() {
  const particles = Array.from({ length: 25 });

  return (
    <div className="min-h-screen bg-[#050816] relative overflow-hidden flex items-center justify-center text-white">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#3b82f640,transparent_50%)]" />

      {/* Floating particles */}
      {particles.map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-cyan-400 opacity-60 animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Main Card */}
      <div className="relative z-10 w-[92%] max-w-6xl bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[40px] p-8 md:p-14 shadow-2xl">
        <div className="grid md:grid-cols-2 items-center gap-10">
          {/* Left Side */}
          <div>
            <div className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm mb-6">
              AI SYSTEM MESSAGE
            </div>

            <h1 className="text-7xl md:text-9xl font-black leading-none">
              4<span className="text-cyan-400">0</span>4
            </h1>

            <h2 className="text-3xl font-bold mt-6">
              Lost in the AI Universe
            </h2>

            <p className="text-gray-400 mt-5 leading-relaxed max-w-md">
              The page you are searching for seems disconnected from the neural network. Let's get you back on track.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-semibold hover:scale-105 transition">
                Return Home
              </button>

              <button className="px-6 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition">
                Contact Support
              </button>
            </div>
          </div>

          {/* Right Side Graphic */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-[340px] h-[340px] rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="absolute w-[280px] h-[280px] rounded-full border border-cyan-400/30" />
              <div className="absolute w-[220px] h-[220px] rounded-full border border-cyan-300/30" />

              <div className="w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_80px_#06b6d4] flex items-center justify-center">
                <span className="text-5xl">🤖</span>
              </div>

              <div className="absolute top-4 right-10 bg-white/10 px-3 py-2 rounded-xl text-sm backdrop-blur-lg border border-white/10">
                Error Detected
              </div>

              <div className="absolute bottom-6 left-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-xl text-cyan-300 text-sm">
                Reconnecting...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
