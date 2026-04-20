import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { SignInCard } from "../SignInCard";

export const dynamic = "force-dynamic";

/**
 * Server-rendered wrapper around `SignInCard`. Two reasons this lives in an RSC:
 *
 *  1. If the user already has a session, skip the page entirely and send them
 *     to the intended destination. Avoids the "why is the sign-in page
 *     flashing when I'm already logged in?" UX bug.
 *  2. NextAuth redirects failures back here with `?error=<code>`. Reading
 *     `searchParams` server-side means the UI renders the operator message on
 *     first paint instead of after a client effect hydrates.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const [session, params] = await Promise.all([
    getServerSession(authOptions),
    searchParams,
  ]);

  const callbackUrl = sanitizeCallback(params.callbackUrl);
  if (session?.user?.id) redirect(callbackUrl);

  const emailProviderEnabled = authOptions.providers.some(
    (p) => p.id === "email",
  );

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <SignInCard
        mode="signin"
        callbackUrl={callbackUrl}
        error={params.error}
        emailProviderEnabled={emailProviderEnabled}
      />
    </div>
  );
}

/**
 * Only accept same-origin relative paths. Prevents the sign-in flow from
 * being abused as an open redirect (e.g. `/auth/signin?callbackUrl=//evil.com`).
 */
function sanitizeCallback(raw: string | undefined): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}
