"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Channel = "SMS" | "EMAIL";

interface Props {
  caseId: string;
  defaultPhone?: string | null;
  defaultEmail?: string | null;
}

/**
 * Send-and-log panel: fires an outbound SMS or email through the configured
 * provider. On both success and failure it creates a ContactLog row; on
 * failure it also seeds a FOLLOW_UP task. The UI surfaces the provider result
 * so operators can see exactly what happened.
 */
export function SendContactPanel({ caseId, defaultPhone, defaultEmail }: Props) {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("SMS");
  const [to, setTo] = useState<string>(defaultPhone ?? "");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<
    | null
    | {
        ok: boolean;
        status: string;
        providerError: string | null;
        externalId: string | null;
        followUpTaskCreated: boolean;
      }
  >(null);

  function switchChannel(next: Channel) {
    setChannel(next);
    setResult(null);
    setTo(next === "SMS" ? defaultPhone ?? "" : defaultEmail ?? "");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const payload: Record<string, unknown> = {
        channel,
        to: to.trim(),
        body: body.trim(),
      };
      if (channel === "EMAIL" && subject.trim()) payload.subject = subject.trim();

      const res = await fetch(`/api/v1/cases/${caseId}/contacts/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        setResult({
          ok: false,
          status: "failed",
          providerError: json?.error ?? "request failed",
          externalId: null,
          followUpTaskCreated: false,
        });
        return;
      }
      const data = json?.data ?? {};
      setResult({
        ok: !!data?.send?.ok,
        status: data?.send?.status ?? "unknown",
        providerError: data?.send?.providerError ?? null,
        externalId: data?.send?.externalId ?? null,
        followUpTaskCreated: !!data?.followUpTaskCreated,
      });
      if (data?.send?.ok) {
        setBody("");
        setSubject("");
      }
      router.refresh();
    } catch (e) {
      setResult({
        ok: false,
        status: "failed",
        providerError: e instanceof Error ? e.message : "send failed",
        externalId: null,
        followUpTaskCreated: false,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-1.5">
        {(["SMS", "EMAIL"] as Channel[]).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => switchChannel(c)}
            className={`rounded-full px-3 py-1 text-xs ${
              channel === c
                ? "bg-black text-white"
                : "border bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {c === "SMS" ? "SMS" : "Email"}
          </button>
        ))}
      </div>

      <label className="block text-xs">
        <span className="mb-1 block text-zinc-500">
          {channel === "SMS" ? "Phone (E.164 preferred)" : "Email"}
        </span>
        <input
          type={channel === "SMS" ? "tel" : "email"}
          value={to}
          onChange={(e) => setTo(e.target.value)}
          required
          placeholder={channel === "SMS" ? "+15551234567" : "name@example.com"}
          className="w-full rounded-lg border px-2 py-1.5 text-sm"
        />
      </label>

      {channel === "EMAIL" && (
        <label className="block text-xs">
          <span className="mb-1 block text-zinc-500">Subject</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            maxLength={200}
            className="w-full rounded-lg border px-2 py-1.5 text-sm"
          />
        </label>
      )}

      <label className="block text-xs">
        <span className="mb-1 block text-zinc-500">Message</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          maxLength={5000}
          className="w-full rounded-lg border px-2 py-1.5 text-sm"
          placeholder={
            channel === "SMS"
              ? "Keep it short — SMS is billed per segment"
              : "What do you want to tell the claimant?"
          }
        />
      </label>

      {result && (
        <div
          className={`rounded-lg border p-2 text-xs ${
            result.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="font-medium">
            {result.ok ? "Sent" : "Not delivered"} · status: {result.status}
          </div>
          {result.providerError && <div>Provider: {result.providerError}</div>}
          {result.externalId && <div>External id: {result.externalId}</div>}
          {!result.ok && result.followUpTaskCreated && (
            <div>Follow-up task created for retry.</div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy || !to.trim() || !body.trim()}
          className="rounded-lg bg-black px-4 py-1.5 text-xs text-white disabled:opacity-50"
        >
          {busy ? "Sending…" : `Send ${channel === "SMS" ? "SMS" : "email"}`}
        </button>
      </div>
    </form>
  );
}
