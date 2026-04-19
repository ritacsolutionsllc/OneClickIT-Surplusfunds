"use client";

import { useCallback, useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  type: string;
  priority: string;
  dueDate: string | null;
  completedAt: string | null;
  notes: string | null;
  claim?: {
    id: string;
    ownerName: string;
    countyName: string;
    state: string;
  } | null;
  lead?: { id: string; ownerName: string } | null;
  assignee?: { id: string; name: string | null; email: string | null } | null;
};

export default function TasksPage() {
  const [overdue, setOverdue] = useState<Task[]>([]);
  const [today, setToday] = useState<Task[]>([]);
  const [upcoming, setUpcoming] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [overdueRes, todayRes, upcomingRes] = await Promise.all([
        fetch("/api/v1/tasks/overdue", { cache: "no-store" }),
        fetch("/api/v1/tasks/due-today", { cache: "no-store" }),
        fetch("/api/v1/tasks?status=open&limit=50", { cache: "no-store" }),
      ]);
      if (!overdueRes.ok || !todayRes.ok || !upcomingRes.ok) {
        throw new Error("Failed to load tasks");
      }
      const [oJson, tJson, uJson] = await Promise.all([
        overdueRes.json(),
        todayRes.json(),
        upcomingRes.json(),
      ]);
      setOverdue(oJson.data ?? []);
      setToday(tJson.data ?? []);
      const overdueIds = new Set<string>((oJson.data ?? []).map((t: Task) => t.id));
      const todayIds = new Set<string>((tJson.data ?? []).map((t: Task) => t.id));
      setUpcoming(
        (uJson.data ?? []).filter(
          (t: Task) => !overdueIds.has(t.id) && !todayIds.has(t.id),
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function toggle(id: string, done: boolean) {
    const res = await fetch(`/api/v1/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: done }),
    });
    if (res.ok) await load();
  }

  if (loading) return <div className="p-6 text-sm text-zinc-500">Loading tasks…</div>;
  if (error) return <div className="p-6 text-sm text-red-600">{error}</div>;

  return (
    <main className="p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Open work across all cases you own or are assigned to.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Column title="Overdue" count={overdue.length} tone="red">
          {overdue.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={toggle} tone="red" />
          ))}
          {!overdue.length && <Empty>No overdue tasks.</Empty>}
        </Column>

        <Column title="Due Today" count={today.length} tone="amber">
          {today.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={toggle} tone="amber" />
          ))}
          {!today.length && <Empty>Nothing due today.</Empty>}
        </Column>

        <Column title="Upcoming / Open" count={upcoming.length} tone="zinc">
          {upcoming.map((t) => (
            <TaskCard key={t.id} task={t} onToggle={toggle} tone="zinc" />
          ))}
          {!upcoming.length && <Empty>No other open tasks.</Empty>}
        </Column>
      </div>
    </main>
  );
}

type Tone = "red" | "amber" | "zinc";
const toneStyles: Record<Tone, { header: string; count: string }> = {
  red: { header: "text-red-700", count: "bg-red-100 text-red-800" },
  amber: { header: "text-amber-700", count: "bg-amber-100 text-amber-800" },
  zinc: { header: "text-zinc-700", count: "bg-zinc-100 text-zinc-700" },
};

function Column({
  title,
  count,
  tone,
  children,
}: {
  title: string;
  count: number;
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <h2 className={`text-sm font-semibold ${toneStyles[tone].header}`}>
          {title}
        </h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs ${toneStyles[tone].count}`}
        >
          {count}
        </span>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function TaskCard({
  task,
  onToggle,
  tone,
}: {
  task: Task;
  onToggle: (id: string, done: boolean) => void;
  tone: Tone;
}) {
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const borderTone =
    tone === "red" ? "border-red-200" : tone === "amber" ? "border-amber-200" : "";
  return (
    <article className={`rounded-xl border ${borderTone} bg-zinc-50 p-3 space-y-2`}>
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={!!task.completedAt}
          onChange={(e) => onToggle(task.id, e.target.checked)}
          className="mt-1"
        />
        <div className="flex-1">
          <div className="text-sm font-medium">{task.title}</div>
          <div className="text-xs text-zinc-500">
            {task.type} · {task.priority}
            {due ? ` · due ${due.toLocaleDateString()}` : ""}
          </div>
        </div>
      </div>

      {task.claim ? (
        <a
          href={`/cases/${task.claim.id}`}
          className="block rounded bg-white px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
        >
          → Case: {task.claim.ownerName} ({task.claim.countyName}, {task.claim.state})
        </a>
      ) : task.lead ? (
        <a
          href={`/leads`}
          className="block rounded bg-white px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100"
        >
          → Lead: {task.lead.ownerName}
        </a>
      ) : null}

      {task.notes ? (
        <p className="text-xs text-zinc-600 whitespace-pre-wrap">{task.notes}</p>
      ) : null}
    </article>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-zinc-500">{children}</p>;
}
