import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { handleError } from "@/lib/api-utils";
import { updateContactLogSchema } from "@/modules/outbound/schemas";
import {
  deleteContactLog,
  updateContactLog,
} from "@/modules/outbound/server/log-contact";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface RouteContext {
  params: { id: string };
}

export async function PATCH(request: NextRequest, context: RouteContext) {
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
    const parsed = updateContactLogSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation failed", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const result = await updateContactLog(context.params.id, parsed.data, {
      userId: session.user.id,
      role: session.user.role,
    });
    if ("notFound" in result) {
      return NextResponse.json({ error: "contact log not found" }, { status: 404 });
    }
    if ("forbidden" in result) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: true, data: result.contactLog });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const result = await deleteContactLog(context.params.id, {
      userId: session.user.id,
      role: session.user.role,
    });
    if ("notFound" in result) {
      return NextResponse.json({ error: "contact log not found" }, { status: 404 });
    }
    if ("forbidden" in result) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return handleError(e);
  }
}
