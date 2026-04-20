import { Check } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { SignInCard } from "../SignInCard";

export const dynamic = "force-dynamic";

const BENEFITS = [
  "Browse 200+ county surplus funds lists across 10 states",
  "Search by state, population, and keywords",
  "Direct links to official county surplus funds pages",
  "View claim rules, deadlines, and statutes per county",
  "Free OSINT tools: people search, address, phone & email lookup",
  "Upgrade to Pro for CSV exports, vetted data, and priority alerts",
];

export default async function SignUpPage({
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
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 rounded-xl bg-gray-50 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500">
            Free account includes:
          </p>
          <ul className="space-y-2">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-2 text-sm text-gray-600">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <SignInCard
          mode="signup"
          callbackUrl={callbackUrl}
          error={params.error}
          emailProviderEnabled={emailProviderEnabled}
        />
      </div>
    </div>
  );
}

function sanitizeCallback(raw: string | undefined): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}
