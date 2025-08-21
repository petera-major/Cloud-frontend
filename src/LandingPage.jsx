import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 to-rose-600 bg-clip-text text-transparent">
          Welcome to InfraWatch
        </h1>
        <p className="text-lg text-slate-400 mb-6">
          Real-time monitoring for your cloud services. Uptime summaries, service checks, and performance insights in one place.
        </p>

        <Link to="/dashboard">
          <button className="bg-gradient-to-r from-orange-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 transition">
            Enter Dashboard
          </button>
        </Link>
      </div>

      <div className="mt-16 grid sm:grid-cols-3 gap-6 text-center max-w-4xl w-full">
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur">
          <h3 className="text-lg font-semibold mb-2 text-orange-400">Uptime Monitoring</h3>
          <p className="text-sm text-slate-400">Track the health of your services with auto-checks and status updates.</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur">
          <h3 className="text-lg font-semibold mb-2 text-rose-400">Alert Summaries</h3>
          <p className="text-sm text-slate-400">View 24-hour uptime percentages and receive real-time status changes.</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur">
          <h3 className="text-lg font-semibold mb-2 text-emerald-400">Simple Setup</h3>
          <p className="text-sm text-slate-400">Add new checks instantly with custom URLs and check intervals.</p>
        </div>
      </div>

      <footer className="mt-20 text-xs text-slate-500">
        Built by Petera M.
      </footer>
    </div>
  );
}
