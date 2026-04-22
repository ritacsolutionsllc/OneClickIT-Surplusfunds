import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { handleError } from "@/lib/api-utils";
import { sendSmsSchema } from "@/modules/outbound/schemas";
import { sendSmsForCase } from "@/modules/outbound/server/send-sms";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
    }
    const parsed = sendSmsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation failed", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const { id } = await context.params;
    const result = await sendSmsForCase(id, parsed.data, {
      userId: session.user.id,
      role: session.user.role,
    });

    if ("notFound" in result) {
      return NextResponse.json({ error: "case not found" }, { status: 404 });
    }
    if ("forbidden" in result) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    if ("notConfigured" in result) {
      return NextResponse.json(
        {
          error:
            "Twilio is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER.",
        },
        { status: 503 },
      );
    }
    if ("missingRecipient" in result) {
      return NextResponse.json(
        { error: "no recipient phone number on the claimant and none provided" },
        { status: 400 },
      );
    }
    if (result.ok) {
      return NextResponse.json(
        {
          success: true,
          sid: result.sid,
          status: result.status,
          to: result.to,
          testMode: result.testMode,
          contactLogId: result.contactLogId,
        },
        { status: 201 },
      );
    }
    // Send failed but we still logged + possibly auto-scheduled a follow-up.
    return NextResponse.json(
      {
        success: false,
        error: result.error,
        code: result.code,
        testMode: result.testMode,
        contactLogId: result.contactLogId,
        followUpTaskCreated: result.followUpTaskCreated,
      },
      { status: 502 },
    );
  } catch (e) {
    return handleError(e);
  }
}
