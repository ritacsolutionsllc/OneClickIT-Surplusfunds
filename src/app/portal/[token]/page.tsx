import { notFound } from "next/navigation";

import { resolvePortalToken } from "@/modules/portal/server/tokens";
import {
  agreementPortalDisplay,
  summarizePortalAgreements,
  tokenExpiryInfo,
  type PortalAgreementTone,
} from "@/modules/agreements/status";
import { SignForm } from "./SignForm";

export const dynamic = "force-dynamic";

const TONE_PILL: Record<PortalAgreementTone, string> = {
  signed: "bg-emerald-100 text-emerald-700",
  awaiting: "bg-blue-100 text-blue-700",
  closed: "bg-zinc-100 text-zinc-600",
};

const TONE_BODY: Record<PortalAgreementTone, string> = {
  signed: "bg-emerald-50 text-emerald-800",
  awaiting: "bg-zinc-50 text-zinc-700",
  closed: "bg-zinc-50 text-zinc-600",
};

/**
 * Public claimant portal. No auth — the token IS the auth.
 * Rendered as an RSC so sensitive data never leaves the server.
 */
export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const resolved = await resolvePortalToken(token);
  if (!resolved) notFound();

  const { claim } = resolved;
  const summary = summarizePortalAgreements(claim.agreements);
  const expiry = tokenExpiryInfo(resolved.tokenRow.expiresAt);
  const fmt = (n: number | null | undefined) =>
    n != null
      ? n.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : "—";

  return (
    <main className="min-h-screen bg-zinc-50 py-10 px-4">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="rounded-2xl bg-white border p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Your case
              </p>
              <h1 className="mt-1 text-2xl font-semibold">{claim.ownerName}</h1>
              <p className="mt-1 text-sm text-zinc-600">
                {claim.countyName}, {claim.state}
                {claim.propertyAddr ? ` — ${claim.propertyAddr}` : ""}
              </p>
            </div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {claim.status}
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-zinc-500">Surplus</dt>
              <dd className="mt-0.5 font-medium">{fmt(claim.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Parcel</dt>
              <dd className="mt-0.5 font-medium">{claim.parcelId ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Type</dt>
              <dd className="mt-0.5 font-medium">{claim.surplusType}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">Deadline</dt>
              <dd className="mt-0.5 font-medium">
                {claim.deadlineDate
                  ? new Date(claim.deadlineDate).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </header>

        {summary.total > 0 && (
          <div
            className={`rounded-2xl border p-4 text-sm shadow-sm ${
              summary.allSigned
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : summary.awaiting > 0
                  ? "border-blue-200 bg-blue-50 text-blue-800"
                  : "border-zinc-200 bg-white text-zinc-700"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium">{summary.progressLabel}</span>
              <span className="text-xs">
                {summary.signed}/{summary.total} complete
              </span>
            </div>
          </div>
        )}

        {expiry.level !== "ok" && (
          <div
            className={`rounded-2xl border p-4 text-sm shadow-sm ${
              expiry.level === "critical" || expiry.level === "expired"
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-amber-200 bg-amber-50 text-amber-800"
            }`}
          >
            {expiry.label}{" "}
            {expiry.level !== "expired" &&
              "Contact your case agent if you need more time."}
          </div>
        )}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Agreements</h2>
          {claim.agreements.length === 0 ? (
            <div className="rounded-2xl border bg-white p-6 text-sm text-zinc-500 shadow-sm">
              No agreements have been shared yet. Your case agent will send
              them here when they&rsquo;re ready.
            </div>
          ) : (
            claim.agreements.map((a) => {
              const display = agreementPortalDisplay(a);
              return (
                <article
                  key={a.id}
                  className="rounded-2xl border bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold">
                        {a.type.replaceAll("_", " ")}
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Sent{" "}
                        {a.sentAt
                          ? new Date(a.sentAt).toLocaleDateString()
                          : new Date(a.createdAt).toLocaleDateString()}
                        {a.feePercent != null ? ` · Fee ${a.feePercent}%` : ""}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${TONE_PILL[display.tone]}`}
                    >
                      {display.label}
                    </span>
                  </div>

                  <details className="text-sm">
                    <summary className="cursor-pointer text-blue-700 hover:underline">
                      View full document
                    </summary>
                    <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-lg border bg-zinc-50 p-3 text-xs font-mono">
                      {a.renderedText ?? "(no text)"}
                    </pre>
                  </details>

                  {display.tone === "signed" ? (
                    <p
                      className={`rounded-lg px-4 py-3 text-sm ${TONE_BODY.signed}`}
                    >
                      {display.message}
                      {a.signedAt ? (
                        <>
                          {" "}
                          <span className="text-xs opacity-80">
                            Signed{" "}
                            {new Date(a.signedAt).toLocaleString()}
                          </span>
                        </>
                      ) : null}
                    </p>
                  ) : display.canSign && expiry.level !== "expired" ? (
                    <div className={`rounded-lg border p-4 ${TONE_BODY.awaiting}`}>
                      <p className="mb-3 text-sm">{display.message}</p>
                      <SignForm
                        token={token}
                        agreementId={a.id}
                        defaultName={claim.claimant?.fullName ?? claim.ownerName}
                      />
                    </div>
                  ) : (
                    <p
                      className={`rounded-lg px-4 py-3 text-sm ${TONE_BODY.closed}`}
                    >
                      {display.message}
                    </p>
                  )}
                </article>
              );
            })
          )}
        </section>

        <footer className="pt-4 text-center text-xs text-zinc-500">
          This link expires{" "}
          {new Date(resolved.tokenRow.expiresAt).toLocaleDateString()}. If you
          need a new link, contact your case agent.
        </footer>
      </div>
    </main>
  );
}
