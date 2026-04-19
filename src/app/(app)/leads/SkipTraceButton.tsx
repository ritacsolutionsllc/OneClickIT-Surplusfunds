"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SkipTraceButton({
  leadId,
  alreadyEnriched,
}: {
  leadId: string;
  alreadyEnriched: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      await fetch(`/api/v1/leads/${leadId}/skiptrace`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: alreadyEnriched }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={() => void run()}
      disabled={busy}
      className="rounded-lg border px-2 py-1 text-[10px] hover:bg-zinc-100 disabled:opacity-50"
      title={alreadyEnriched ? "Re-run enrichment" : "Run skip trace"}
    >
      {busy ? "…" : alreadyEnriched ? "↻ Re-enrich" : "Skip trace"}
    </button>
  );
}
