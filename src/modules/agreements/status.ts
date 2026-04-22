import type { AgreementStatus } from "@prisma/client";

/**
 * Display classification for the claimant portal. Pure logic — kept free of
 * Prisma/React so the rules are easy to unit-test and reuse from any surface
 * (portal, email template, notification copy) without duplicating strings.
 */

export type PortalAgreementTone = "signed" | "awaiting" | "closed";

export interface PortalAgreementDisplay {
  tone: PortalAgreementTone;
  label: string;
  message: string;
  canSign: boolean;
}

export interface PortalAgreementStatusInput {
  status: AgreementStatus;
  sentAt?: Date | string | null;
  signedAt?: Date | string | null;
}

export function agreementPortalDisplay(
  input: PortalAgreementStatusInput,
): PortalAgreementDisplay {
  switch (input.status) {
    case "SIGNED":
      return {
        tone: "signed",
        label: "Signed",
        message: "Thanks — a copy has been saved to your case file.",
        canSign: false,
      };
    case "SENT":
    case "VIEWED":
      return {
        tone: "awaiting",
        label: "Awaiting your signature",
        message: "Review the document below and type your name to sign.",
        canSign: true,
      };
    case "DECLINED":
      return {
        tone: "closed",
        label: "Declined",
        message:
          "This agreement was declined. Contact your case agent if that was a mistake.",
        canSign: false,
      };
    case "EXPIRED":
      return {
        tone: "closed",
        label: "Expired",
        message:
          "This agreement has expired. Your case agent can send a fresh copy.",
        canSign: false,
      };
    case "DRAFT":
    default:
      return {
        tone: "closed",
        label: "Not yet available",
        message: "This agreement has not been shared yet.",
        canSign: false,
      };
  }
}

export interface PortalAgreementsSummary {
  total: number;
  signed: number;
  awaiting: number;
  closed: number;
  allSigned: boolean;
  progressLabel: string;
}

/**
 * Roll up the visible agreements into a single progress header. "Visible"
 * means agreements the portal would render — we assume DRAFT rows are
 * filtered out upstream, so any caller that wants to hide them should do so
 * before calling this.
 */
export function summarizePortalAgreements(
  agreements: ReadonlyArray<PortalAgreementStatusInput>,
): PortalAgreementsSummary {
  let signed = 0;
  let awaiting = 0;
  let closed = 0;
  for (const a of agreements) {
    const d = agreementPortalDisplay(a);
    if (d.tone === "signed") signed++;
    else if (d.tone === "awaiting") awaiting++;
    else closed++;
  }
  const total = agreements.length;
  const allSigned = total > 0 && signed === total;

  let progressLabel: string;
  if (total === 0) progressLabel = "No agreements shared yet";
  else if (allSigned) progressLabel = "All agreements signed";
  else if (awaiting === 0) progressLabel = `${signed} of ${total} signed`;
  else progressLabel = `${signed} of ${total} signed · ${awaiting} awaiting you`;

  return { total, signed, awaiting, closed, allSigned, progressLabel };
}

export type TokenExpiryLevel = "ok" | "soon" | "critical" | "expired";

export interface TokenExpiryInfo {
  level: TokenExpiryLevel;
  daysLeft: number;
  label: string;
}

const MS_PER_DAY = 86_400_000;

/**
 * Compute how close a portal link is to expiring. `soon` fires at ≤7 days,
 * `critical` at ≤1 day, `expired` once the expiry has passed. daysLeft is
 * a whole-day ceiling so "18 hours left" still renders as "1 day".
 */
export function tokenExpiryInfo(
  expiresAt: Date | string,
  now: Date = new Date(),
): TokenExpiryInfo {
  const expiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  if (diffMs <= 0) {
    return { level: "expired", daysLeft: 0, label: "This link has expired." };
  }
  const daysLeft = Math.max(1, Math.ceil(diffMs / MS_PER_DAY));
  if (diffMs <= MS_PER_DAY) {
    return {
      level: "critical",
      daysLeft,
      label: "This link expires within a day.",
    };
  }
  if (daysLeft <= 7) {
    return {
      level: "soon",
      daysLeft,
      label: `This link expires in ${daysLeft} days.`,
    };
  }
  return {
    level: "ok",
    daysLeft,
    label: `This link expires in ${daysLeft} days.`,
  };
}
