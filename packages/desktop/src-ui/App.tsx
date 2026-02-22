import { useEffect, useMemo, useState } from "react";
import { getHealth, getJob, getShells, killJob, runCommand } from "./api";
import type { ShellCapabilityView, SidecarJobView } from "./types";

const QUICK_COMMANDS = ["pnpm typecheck", "pnpm test", "git status", "ls"];

export function App() {
  const [health, setHealth] = useState<{ ok: boolean; runningJobs: number; totalJobs: number } | null>(
    null,
  );
  const [shells, setShells] = useState<ShellCapabilityView[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>("windows-powershell");
  const [command, setCommand] = useState("");
  const [activeJob, setActiveJob] = useState<SidecarJobView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const availableProfiles = useMemo(
    () => shells.filter((s) => s.available).map((s) => s.profile.id),
    [shells],
  );

  async function refreshHealth() {
    try {
      setHealth(await getHealth());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Server bilan aloqa bo'lmadi");
    }
  }

  async function refreshShells() {
    try {
      const data = await getShells();
      setShells(data);
      if (!data.some((x) => x.profile.id === selectedProfile && x.available)) {
        const first = data.find((x) => x.available)?.profile.id;
        if (first) setSelectedProfile(first);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Shell ro'yxatini olishda xato");
    }
  }

  useEffect(() => {
    void refreshHealth();
    void refreshShells();
    const t = setInterval(() => void refreshHealth(), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!activeJob) return;
    const t = setInterval(() => {
      void getJob(activeJob.id)
        .then((job) => {
          setActiveJob(job);
          setIsRunning(job.status === "running");
        })
        .catch(() => {});
    }, 900);
    return () => clearInterval(t);
  }, [activeJob]);

  async function executeCommand(cmd: string) {
    const cleaned = cmd.trim();
    if (!cleaned) return;
    try {
      setError(null);
      setIsRunning(true);
      const run = await runCommand({ command: cleaned, profile: selectedProfile });
      const job = await getJob(run.jobId);
      setActiveJob(job);
      setIsRunning(job.status === "running");
      await refreshHealth();
    } catch (err) {
      setIsRunning(false);
      setError(err instanceof Error ? err.message : "Buyruqni ishga tushirib bo'lmadi");
    }
  }

  async function stopActiveJob() {
    if (!activeJob) return;
    await killJob(activeJob.id);
    setIsRunning(false);
    setActiveJob(await getJob(activeJob.id));
    await refreshHealth();
  }

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Agent Orchestrator Desktop</h1>
          <p>Faqat 3 qadam: Shell tanlang, buyruq yozing, Run bosing.</p>
        </div>
        <div className={`badge ${health?.ok ? "ok" : "bad"}`}>
          {health?.ok ? "Ulangan" : "Ulanmagan"}
        </div>
      </header>

      <main className="main">
        {error && <div className="error">{error}</div>}

        <section className="card">
          <h2>1) Shell tanlash</h2>
          <div className="row">
            <select value={selectedProfile} onChange={(e) => setSelectedProfile(e.target.value)}>
              {availableProfiles.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <button type="button" onClick={() => void refreshShells()}>
              Yangilash
            </button>
          </div>
        </section>

        <section className="card">
          <h2>2) Buyruq</h2>
          <div className="row">
            <input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Masalan: pnpm typecheck"
              onKeyDown={(e) => {
                if (e.key === "Enter") void executeCommand(command);
              }}
            />
          </div>
          <div className="quick">
            {QUICK_COMMANDS.map((item) => (
              <button key={item} type="button" onClick={() => setCommand(item)} className="ghost">
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>3) Ishga tushirish</h2>
          <div className="row">
            <button type="button" onClick={() => void executeCommand(command)} disabled={isRunning}>
              {isRunning ? "Ishlayapti..." : "Run"}
            </button>
            <button type="button" onClick={() => void stopActiveJob()} disabled={!isRunning}>
              Stop
            </button>
          </div>
          <div className="statusline">
            <span>Running: {health?.runningJobs ?? 0}</span>
            <span>Total: {health?.totalJobs ?? 0}</span>
            {activeJob && <span>Status: {activeJob.status}</span>}
          </div>
        </section>

        <section className="card">
          <h2>Natija</h2>
          {activeJob ? (
            <div className="terminal">
              <div className="terminal-meta">
                <span>{activeJob.profile}</span>
                <span>{activeJob.command}</span>
                <span>exit: {activeJob.exitCode ?? "-"}</span>
              </div>
              <pre>{activeJob.stdout || "(hozircha natija yo'q)"}</pre>
              {activeJob.stderr && <pre className="stderr">{activeJob.stderr}</pre>}
            </div>
          ) : (
            <p>Hali buyruq ishga tushirilmagan.</p>
          )}
        </section>
      </main>
    </div>
  );
}
