import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { handleError } from "@/lib/api-utils";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactSchema } from "@/modules/outbound/schemas";
import { sendAndLogContact } from "@/modules/outbound/server/send";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

/**
 * Send-and-log outbound SMS or email. Always creates a ContactLog row — even
 * when the provider send fails — so the attempt is auditable. On failure an
 * idempotent FOLLOW_UP task is also seeded so the operator can retry.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    // Per-user cap to prevent accidental blast via a stuck UI or misused token.
    const limited = rateLimit(`contact-send:${session.user.id}`, 30, 60_000);
    if (!limited.success) {
      return NextResponse.json(
        { error: "rate limit exceeded" },
        { status: 429 },
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

    const result = await sendAndLogContact(context.params.id, parsed.data, {
      userId: session.user.id,
      role: session.user.role,
    });
    if ("notFound" in result) {
      return NextResponse.json({ error: "case not found" }, { status: 404 });
    }
    if ("forbidden" in result) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    // Send succeeded OR failed with logged attempt. Either way, 200 with
    // send.ok flag so the UI can render the real outcome.
    return NextResponse.json(
      {
        success: result.send.ok,
        data: {
          contactLog: result.contactLog,
          send: result.send,
          followUpTaskCreated: result.followUpTaskCreated,
        },
      },
      { status: result.send.ok ? 200 : 202 },
    );
  } catch (e) {
    return handleError(e);
  }
}
