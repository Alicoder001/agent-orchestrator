import type { ShellCapabilityView, SidecarJobView } from "./types";

const SIDECAR = "http://127.0.0.1:17071";

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export async function getHealth(): Promise<{
  ok: boolean;
  runningJobs: number;
  totalJobs: number;
}> {
  const res = await fetch(`${SIDECAR}/health`);
  return readJson(res);
}

export async function getShells(): Promise<ShellCapabilityView[]> {
  const res = await fetch(`${SIDECAR}/shells`);
  const data = await readJson<{ capabilities: ShellCapabilityView[] }>(res);
  return data.capabilities;
}

export async function runCommand(payload: {
  command: string;
  profile?: string;
  cwd?: string;
  wslDistribution?: string;
}): Promise<{ jobId: string; profile: string; status: string }> {
  const res = await fetch(`${SIDECAR}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return readJson(res);
}

export async function getJob(jobId: string): Promise<SidecarJobView> {
  const res = await fetch(`${SIDECAR}/jobs/${encodeURIComponent(jobId)}`);
  const data = await readJson<{ job: SidecarJobView }>(res);
  return data.job;
}

export async function killJob(jobId: string): Promise<void> {
  const res = await fetch(`${SIDECAR}/jobs/${encodeURIComponent(jobId)}/kill`, {
    method: "POST",
  });
  await readJson(res);
}
