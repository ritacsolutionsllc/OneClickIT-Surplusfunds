"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CONTACT_STATUS_OPTIONS } from "@/modules/outbound/follow-up";

const CHANNELS = [
  { key: "CALL", label: "Call" },
  { key: "SMS", label: "SMS" },
  { key: "EMAIL", label: "Email" },
  { key: "MAIL", label: "Mail" },
  { key: "IN_PERSON", label: "In-person" },
] as const;

type Channel = (typeof CHANNELS)[number]["key"];
type Direction = "outbound" | "inbound";
type Mode = "log" | "send";

/**
 * Unified contact panel with two modes:
 *   - Log: quick-record an attempt operators made themselves (call, in-person, etc).
 *   - Send: dispatch SMS via Twilio or email via Resend, which always writes a
 *     ContactLog for us server-side.
 *
 * Both modes refresh the RSC so the timeline + contact list pick up the new row
 * immediately, and surface auto-seeded follow-up tasks in the success toast.
 */
export function ContactActions({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("log");

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-lg border bg-zinc-50 p-0.5 text-xs">
        <button
          type="button"
          onClick={() => setMode("log")}
          className={`flex-1 rounded-md px-2 py-1 ${
            mode === "log" ? "bg-white shadow-sm" : "text-zinc-600"
          }`}
        >
          Log attempt
        </button>
        <button
          type="button"
          onClick={() => setMode("send")}
          className={`flex-1 rounded-md px-2 py-1 ${
            mode === "send" ? "bg-white shadow-sm" : "text-zinc-600"
          }`}
        >
          Send message
        </button>
      </div>

      {mode === "log" ? (
        <LogForm caseId={caseId} onLogged={() => router.refresh()} />
      ) : (
        <SendForm caseId={caseId} onSent={() => router.refresh()} />
      )}
    </div>
  );
}

function LogForm({
  caseId,
  onLogged,
}: {
  caseId: string;
  onLogged: () => void;
}) {
  const [channel, setChannel] = useState<Channel>("CALL");
  const [direction, setDirection] = useState<Direction>("outbound");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setToast(null);
    try {
      const body: Record<string, unknown> = { channel, direction };
      if (status.trim()) body.status = status.trim();
      if (notes.trim()) body.notes = notes.trim();
      const durNum = Number(duration);
      if (duration && Number.isFinite(durNum) && durNum > 0) {
        body.duration = Math.floor(durNum);
      }

      const res = await fetch(`/api/v1/cases/${caseId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "log failed");

      setStatus("");
      setDuration("");
      setNotes("");
      setToast(
        json.followUpTaskCreated ? "Follow-up task scheduled" : "Contact logged",
      );
      onLogged();
    } catch (e) {
      setError(e instanceof Error ? e.message : "log failed");
    } finally {
      setBusy(false);
    }
  }

  function pickChannel(next: Channel) {
    setChannel(next);
    setStatus("");
  }

  const showDuration = channel === "CALL";
  const statusOptions = CONTACT_STATUS_OPTIONS[channel] ?? [];

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {CHANNELS.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => pickChannel(c.key)}
            className={`rounded-full px-3 py-1 text-xs ${
              channel === c.key
                ? "bg-black text-white"
                : "border bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs">
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={direction === "outbound"}
            onChange={() => setDirection("outbound")}
          />
          Outbound
        </label>
        <label className="flex items-center gap-1.5">
          <input
            type="radio"
            checked={direction === "inbound"}
            onChange={() => setDirection("inbound")}
          />
          Inbound
        </label>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {statusOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setStatus(opt === status ? "" : opt)}
            className={`rounded-full px-2.5 py-0.5 text-[11px] ${
              status === opt
                ? "bg-zinc-900 text-white"
                : "border bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {opt.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="block text-xs">
          <span className="mb-1 block text-zinc-500">Result</span>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="custom result…"
            className="w-full rounded-lg border px-2 py-1.5 text-sm"
          />
        </label>
        {showDuration && (
          <label className="block text-xs">
            <span className="mb-1 block text-zinc-500">Duration (sec)</span>
            <input
              type="number"
              min={0}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border px-2 py-1.5 text-sm"
            />
          </label>
        )}
      </div>

      <label className="block text-xs">
        <span className="mb-1 block text-zinc-500">Notes</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border px-2 py-1.5 text-sm"
          placeholder="What happened? Next step?"
        />
      </label>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}
      {toast && !error && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
          {toast}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-black px-4 py-1.5 text-xs text-white disabled:opacity-50"
        >
          {busy ? "Logging…" : `Log ${CHANNELS.find((c) => c.key === channel)?.label.toLowerCase()}`}
        </button>
      </div>
    </form>
  );
}

type SendChannel = "SMS" | "EMAIL";

function SendForm({
  caseId,
  onSent,
}: {
  caseId: string;
  onSent: () => void;
}) {
  const [channel, setChannel] = useState<SendChannel>("SMS");
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setToast(null);
    try {
      const payload: Record<string, unknown> = { channel, body };
      if (to.trim()) payload.to = to.trim();
      if (channel === "EMAIL" && subject.trim()) payload.subject = subject.trim();

      const res = await fetch(`/api/v1/cases/${caseId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error ?? "send failed");
      }

      if (json.success) {
        const providerLabel = json.provider === "dry-run" ? " (dry-run)" : "";
        setToast(
          json.followUpTaskCreated
            ? `Sent${providerLabel} · follow-up scheduled`
            : `Sent${providerLabel}`,
        );
        setBody("");
        if (channel === "EMAIL") setSubject("");
      } else {
        // Provider reported failure; the ContactLog row was still written.
        const reason = json.error ?? "provider failure";
        setError(`Logged as failed: ${reason}`);
      }
      onSent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "send failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex gap-1.5">
        {(["SMS", "EMAIL"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setChannel(c)}
            className={`rounded-full px-3 py-1 text-xs ${
              channel === c
                ? "bg-black text-white"
                : "border bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
            }`}
          >
            {c === "SMS" ? "Send SMS" : "Send email"}
          </button>
        ))}
      </div>

      <label className="block text-xs">
        <span className="mb-1 block text-zinc-500">
          {channel === "SMS" ? "To (phone, optional)" : "To (email, optional)"}
        </span>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={
            channel === "SMS"
              ? "Leave blank to use claimant on file"
              : "Leave blank to use claimant on file"
          }
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
            className="w-full rounded-lg border px-2 py-1.5 text-sm"
            required
          />
        </label>
      )}

      <label className="block text-xs">
        <span className="mb-1 block text-zinc-500">
          {channel === "SMS" ? "Message" : "Body"}
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={channel === "SMS" ? 3 : 6}
          maxLength={1900}
          className="w-full rounded-lg border px-2 py-1.5 text-sm"
          required
        />
        <span className="mt-1 block text-[10px] text-zinc-400">
          {body.length}/1900
        </span>
      </label>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
          {error}
        </div>
      )}
      {toast && !error && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-2 text-xs text-emerald-700">
          {toast}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={busy || !body.trim()}
          className="rounded-lg bg-black px-4 py-1.5 text-xs text-white disabled:opacity-50"
        >
          {busy
            ? "Sending…"
            : channel === "SMS"
              ? "Send SMS"
              : "Send email"}
        </button>
      </div>
    </form>
  );
}
