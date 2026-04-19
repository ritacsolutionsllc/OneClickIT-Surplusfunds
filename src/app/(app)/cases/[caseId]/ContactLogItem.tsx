"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export interface ContactLogItemData {
  id: string;
  channel: string;
  direction: string;
  status: string | null;
  notes: string | null;
  duration: number | null;
  createdAt: string | Date;
}

/**
 * Rows in the contact-log list. Supports inline delete (admin / author only,
 * enforced server-side). Kept tiny — add an edit modal later if needed.
 */
export function ContactLogItem({ log }: { log: ContactLogItemData }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    if (!confirm("Delete this contact log?")) return;
    setBusy(true);
    try {
      await fetch(`/api/v1/contacts/${log.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="rounded-xl border bg-zinc-50 p-3 space-y-1 text-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-zinc-700">
            {log.channel}
          </span>
          <span className="text-xs text-zinc-500">
            {log.direction}
            {log.status ? ` · ${log.status}` : ""}
            {log.duration ? ` · ${log.duration}s` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <time className="text-[11px] text-zinc-500">
            {new Date(log.createdAt).toLocaleString()}
          </time>
          <button
            onClick={() => void remove()}
            disabled={busy}
            className="text-[10px] text-red-600 hover:underline disabled:opacity-50"
            title="Delete"
          >
            {busy ? "…" : "×"}
          </button>
        </div>
      </div>
      {log.notes ? (
        <p className="whitespace-pre-wrap text-xs text-zinc-700">{log.notes}</p>
      ) : null}
    </article>
  );
}
