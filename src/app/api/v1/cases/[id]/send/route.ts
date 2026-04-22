import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { handleError } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactSchema } from "@/modules/outbound/schemas";
import { sendAndLogContact } from "@/modules/outbound/server/send-contact";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/v1/cases/:id/send
 *
 * Dispatches an outbound SMS (Twilio) or email (Resend) for a case and always
 * writes a ContactLog row capturing the attempt. See
 * src/modules/outbound/server/send-contact.ts for the full contract.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Rate limit per user — sending real SMS/email costs money and sending the
    // same claimant 100 messages in 60 seconds is always a bug.
    const rl = rateLimit(`send-contact:${session.user.id}`, 30, 60_000);
    if (!rl.success) {
      return NextResponse.json(
        { error: "rate limit exceeded — try again in a minute" },
        { status: 429, headers: { "X-RateLimit-Remaining": "0" } },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
    }
    const parsed = sendContactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation failed", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { id } = await context.params;
    const result = await sendAndLogContact(id, parsed.data, {
      userId: session.user.id,
      role: session.user.role,
    });

    if ("notFound" in result) {
      return NextResponse.json({ error: "case not found" }, { status: 404 });
    }
    if ("forbidden" in result) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if ("missingRecipient" in result) {
      return NextResponse.json(
        {
          error:
            result.channel === "SMS"
              ? "no phone number on file for claimant"
              : "no email address on file for claimant",
        },
        { status: 422 },
      );
    }

    // Provider-level failures are surfaced in the payload (status + error),
    // but we still 200 so the client can reveal the audit row inline. Only
    // a missing ContactLog write is considered a hard 5xx condition.
    if (result.contactLogError) {
      return NextResponse.json(
        {
          success: false,
          error: "contact-log write failed after provider call",
          provider: result.provider,
          providerStatus: result.status,
          providerError: result.error,
          externalId: result.externalId,
          contactLogError: result.contactLogError,
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: result.ok,
        data: result.contactLog,
        provider: result.provider,
        status: result.status,
        externalId: result.externalId,
        error: result.error,
        followUpTaskCreated: result.followUpTaskCreated,
      },
      { status: result.ok ? 201 : 200 },
    );
  } catch (e) {
    return handleError(e);
  }
}
