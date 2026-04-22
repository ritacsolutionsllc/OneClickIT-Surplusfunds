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

/**
 * Quick-log panel for a contact attempt. Sends straight to
 * POST /api/v1/cases/:id/contacts, then refreshes the RSC so the new log
 * appears in the timeline + contact list immediately.
 *
 * If the server auto-seeds a follow-up task (because the status maps to a
 * failed attempt), we surface that as a toast so operators know without
 * needing to scan the task list.
 */
type SmsCapability = {
  enabled: boolean;
  testMode: boolean;
  claimantPhone: string | null;
};

export function ContactActions({
  caseId,
  sms,
}: {
  caseId: string;
  sms?: SmsCapability;
}) {
  const router = useRouter();
  const [channel, setChannel] = useState<Channel>("CALL");
  const [direction, setDirection] = useState<Direction>("outbound");
  const [status, setStatus] = useState("");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [smsBody, setSmsBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const canSendSms =
    channel === "SMS" &&
    direction === "outbound" &&
    sms?.enabled === true &&
    Boolean(sms.claimantPhone);

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
      if (json.followUpTaskCreated) {
        setToast("Follow-up task scheduled");
      } else {
        setToast("Contact logged");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "log failed");
    } finally {
      setBusy(false);
    }
  }

  async function sendSms() {
    if (!smsBody.trim()) {
      setError("Enter a message to send");
      return;
    }
    setBusy(true);
    setError(null);
    setToast(null);
    try {
      const res = await fetch(`/api/v1/cases/${caseId}/send-sms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: smsBody.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        setSmsBody("");
        setToast(
          json.testMode
            ? `SMS queued in test mode (sid ${json.sid})`
            : `SMS sent (sid ${json.sid})`,
        );
        router.refresh();
        return;
      }
      const msg =
        json.error ??
        (json.success === false ? "Twilio rejected the send" : "send failed");
      if (json.contactLogId) {
        setError(`${msg}. Attempt logged${json.followUpTaskCreated ? "; follow-up scheduled" : ""}.`);
        router.refresh();
      } else {
        setError(msg);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "send failed");
    } finally {
      setBusy(false);
    }
  }

  function pickChannel(next: Channel) {
    setChannel(next);
    // Reset status so stale options from the previous channel don't stick.
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

      {channel === "SMS" && direction === "outbound" && sms?.enabled && (
        <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-2">
          <div className="flex items-center justify-between text-[11px] text-sky-800">
            <span>
              Send via Twilio
              {sms.claimantPhone ? ` → ${sms.claimantPhone}` : " (no phone on file)"}
            </span>
            {sms.testMode && (
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-900">
                TEST MODE
              </span>
            )}
          </div>
          <textarea
            value={smsBody}
            onChange={(e) => setSmsBody(e.target.value)}
            rows={3}
            maxLength={1600}
            placeholder="Message body…"
            className="mt-2 w-full rounded-lg border px-2 py-1.5 text-sm"
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">{smsBody.length}/1600</span>
            <button
              type="button"
              onClick={sendSms}
              disabled={busy || !canSendSms || !smsBody.trim()}
              className="rounded-lg bg-sky-600 px-3 py-1 text-xs text-white disabled:opacity-50"
            >
              {busy ? "Sending…" : "Send SMS"}
            </button>
          </div>
          {!canSendSms && !sms.claimantPhone && (
            <p className="mt-1 text-[10px] text-amber-700">
              Add a phone number to the claimant to enable send.
            </p>
          )}
        </div>
      )}

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
