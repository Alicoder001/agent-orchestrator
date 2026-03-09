export interface ShellCapabilityView {
  profile: { id: string; label?: string };
  available: boolean;
  resolvedPath: string | null;
  reason?: string;
}

export interface SidecarJobView {
  id: string;
  profile: string;
  command: string;
  cwd?: string;
  status: "running" | "exited" | "killed" | "failed";
  startedAt: string;
  finishedAt?: string;
  exitCode?: number | null;
  stdout: string;
  stderr: string;
}

export interface TaskItem {
  id: string;
  title: string;
  state: "todo" | "running" | "done" | "failed";
  command: string;
  jobId?: string;
}
