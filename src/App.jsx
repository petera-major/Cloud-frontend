import { useEffect, useState } from "react";

//backend api base url
const API = import.meta.env.VITE_API_BASE || "https://cloud-backend-production-0eac.up.railway.app";

//global theme styles for UI
const THEME = {
  grad: "from-orange-500 to-rose-600",
  glow: "shadow-rose-600/30",
  dot: "bg-orange-400",
  focus: "focus:ring-orange-400/50",
};

//displays the service check (healthy/unhealthy etc)
const StatusBadge = ({ status }) => {
  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1";
  if (status === "healthy")
    return (
      <span className={`${base} bg-emerald-500/10 text-emerald-300 ring-emerald-500/20`}>
        <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
        healthy
      </span>
    );
  if (status === "unhealthy")
    return (
      <span className={`${base} bg-rose-500/10 text-rose-300 ring-rose-500/20`}>
        <span className="size-1.5 rounded-full bg-rose-400 shadow-[0_0_6px_theme(colors.rose.400)]" />
        unhealthy
      </span>
    );
  return (
    <span className={`${base} bg-slate-500/10 text-slate-300 ring-slate-500/20`}>
      <span className="size-1.5 rounded-full bg-slate-400" />
      unknown
    </span>
  );
};

export default function App() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", url: "", intervalMs: 30000 });
  const [summaries, setSummaries] = useState({});
  const [error, setError] = useState("");

  const fetchChecks = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/api/checks`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setChecks(data);
    } catch (e) {
      setChecks([]);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  //load checks and auto refreshes ever 15 secs
  useEffect(() => {
    fetchChecks();
    const id = setInterval(fetchChecks, 15000);
    return () => clearInterval(id);
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const body = {
        name: form.name.trim(),
        url: form.url.trim(),
        intervalMs: Math.max(10000, Number(form.intervalMs || 30000)),
        expectedStatus: 200,
      };
      const res = await fetch(`${API}/api/checks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.error || "Failed to create");
      setForm({ name: "", url: "", intervalMs: 30000 });
      fetchChecks();
    } catch (err) {
      setError(err.message);
    }
  };

  const loadSummary = async (id) => {
    const res = await fetch(`${API}/api/checks/${id}/summary`);
    const data = await res.json();
    setSummaries((s) => ({ ...s, [id]: data }));
  };

  const remove = async (id) => {
    await fetch(`${API}/api/checks/${id}`, { method: "DELETE" });
    fetchChecks();
  };

  return (
    <div className="relative min-h-screen text-slate-200 bg-slate-950">
      <div className="pointer-events-none absolute inset-0 
        bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.12),transparent_40%),radial-gradient(ellipse_at_bottom,rgba(244,63,94,0.10),transparent_40%)]" />

      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${THEME.dot} shadow-[0_0_12px_currentColor]`} />
            <h1 className="text-lg font-semibold tracking-tight">InfraWatch</h1>
          </div>
          <button
            onClick={fetchChecks}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition"
            title="Refresh"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M4 4v6h6M20 20v-6h-6M20 8a8 8 0 10-3 6.3" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-lg shadow-black/20">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-300">
            Add Check
          </h2>
          {error && (
            <p className="mb-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-5">
            <input
              className={`sm:col-span-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${THEME.focus}`}
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className={`sm:col-span-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 placeholder:text-slate-500 focus:outline-none focus:ring-2 ${THEME.focus}`}
              placeholder="https://example.com/"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
            />
            <input
              className={`sm:col-span-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 focus:outline-none focus:ring-2 ${THEME.focus}`}
              type="number"
              min={10000}
              step={1000}
              value={form.intervalMs}
              onChange={(e) => setForm({ ...form, intervalMs: e.target.value })}
              title="Interval (ms)"
            />
            <div className="sm:col-span-5">
              <button
                type="submit"
                className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${THEME.grad}
                  px-4 py-2 font-medium text-white shadow-lg ${THEME.glow} hover:brightness-110 transition`}
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                  <path d="M11 21h-1l1-7H7l6-11h1l-1 7h4l-6 11Z" />
                </svg>
                Create
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Checks
          </h2>

          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : checks.length === 0 ? (
            <p className="text-sm text-slate-400">No checks yet.</p>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {checks.map((c) => (
                <li
                  key={c._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-lg shadow-black/20 hover:-translate-y-0.5 hover:shadow-xl transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold tracking-tight">{c.name}</h3>
                        <StatusBadge status={c.lastStatus} />
                      </div>
                      <p className="mt-0.5 font-mono text-[13px] text-slate-400 break-all">{c.url}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        Every {(c.intervalMs / 1000).toFixed(0)}s
                        {c.lastLatencyMs != null && <> · Last latency: {c.lastLatencyMs}ms</>}
                      </p>
                    </div>

                    <button
                      onClick={() => remove(c._id)}
                      className="rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition"
                      title="Delete"
                    >
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m3 0V5a2 2 0 012-2h4a2 2 0 012 2v2M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      onClick={() => loadSummary(c._id)}
                      className="text-xs rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 hover:bg-white/10 transition"
                    >
                      Uptime (24h)
                    </button>
                    {summaries[c._id] && (
                      <span className="text-xs text-slate-300">
                        Uptime: {summaries[c._id].uptimePct}% · Checks: {summaries[c._id].totalChecks} · Up: {summaries[c._id].up}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-500">
        Built by Petera M.
      </footer>
    </div>
  );
}
