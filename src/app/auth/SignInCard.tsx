"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import Button from "@/components/ui/Button";

/**
 * NextAuth surfaces auth failures via a `?error=<code>` param on the
 * redirect back to the custom sign-in page. Previously the UI ignored
 * these entirely, so a misconfigured OAuth client or a DB outage looked
 * exactly like "nothing happened" to the user.
 *
 * Mapping is intentionally short and operator-friendly — the goal is to
 * make the root cause obvious without leaking stack traces.
 * Reference: https://next-auth.js.org/configuration/pages#error-codes
 */
const ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "Auth is not configured on the server. Ask the admin to set NEXTAUTH_SECRET, NEXTAUTH_URL, and Google OAuth credentials.",
  AccessDenied: "Access denied — this account isn't allowed to sign in.",
  Verification:
    "The sign-in link has expired or was already used. Please request a new one.",
  OAuthSignin:
    "Couldn't start the Google sign-in. Google OAuth credentials may be missing or invalid.",
  OAuthCallback:
    "Google rejected the sign-in callback. The redirect URI in Google Console likely doesn't match this environment's NEXTAUTH_URL.",
  OAuthCreateAccount:
    "Couldn't create your account. Check the database connection.",
  EmailCreateAccount:
    "Couldn't create your account via email. Check the database connection.",
  Callback: "Sign-in callback failed. Check the server logs for details.",
  OAuthAccountNotLinked:
    "An account already exists with this email but was created with a different sign-in method.",
  EmailSignin:
    "Couldn't send the magic-link email. Check EMAIL_SERVER / EMAIL_FROM.",
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "Please sign in to access that page.",
  Default: "Something went wrong signing in. Please try again.",
};

export interface SignInCardProps {
  mode: "signin" | "signup";
  callbackUrl: string;
  error?: string;
  emailProviderEnabled: boolean;
}

export function SignInCard({
  mode,
  callbackUrl,
  error,
  emailProviderEnabled,
}: SignInCardProps) {
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const [email, setEmail] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const errorMessage =
    localError ?? (error ? (ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default) : null);

  async function onGoogle() {
    setBusy("google");
    setLocalError(null);
    setInfo(null);
    try {
      // Let NextAuth drive the navigation. If it resolves synchronously with
      // an { error } payload (happens when the server rejects the request
      // before redirecting), surface it instead of silently swallowing.
      const res = await signIn("google", { callbackUrl });
      if (res?.error) {
        setLocalError(ERROR_MESSAGES[res.error] ?? ERROR_MESSAGES.Default);
      }
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : "sign-in failed");
    } finally {
      setBusy(null);
    }
  }

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setBusy("email");
    setLocalError(null);
    setInfo(null);
    try {
      const res = await signIn("email", {
        email: email.trim(),
        callbackUrl,
        redirect: false,
      });
      if (res?.error) {
        setLocalError(ERROR_MESSAGES[res.error] ?? ERROR_MESSAGES.Default);
      } else {
        setInfo(`Check ${email.trim()} for a sign-in link.`);
        setEmail("");
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "sign-in failed");
    } finally {
      setBusy(null);
    }
  }

  const heading = mode === "signup" ? "Create your account" : "Welcome back";
  const sub =
    mode === "signup"
      ? "Join the surplus funds intelligence platform"
      : "Sign in to your surplus funds dashboard";
  const googleLabel =
    mode === "signup" ? "Sign up with Google" : "Sign in with Google";

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mb-3 flex justify-center">
          <Image
            src="/surplusfunds_favicon.png"
            alt="Surplus Funds"
            width={48}
            height={48}
            className="h-12 w-12"
          />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{heading}</h1>
        <p className="text-sm text-gray-500">{sub}</p>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}
      {info && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700"
        >
          {info}
        </div>
      )}

      <div className="space-y-3">
        <Button
          className="w-full"
          variant="primary"
          loading={busy === "google"}
          disabled={busy !== null}
          onClick={onGoogle}
        >
          {googleLabel}
        </Button>
      </div>

      {emailProviderEnabled && (
        <>
          <div className="my-4 flex items-center gap-3 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-200" />
            <span>or use email</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <form onSubmit={onEmail} className="space-y-2">
            <label className="block text-xs">
              <span className="mb-1 block text-gray-500">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border px-2 py-2 text-sm"
                disabled={busy !== null}
              />
            </label>
            <Button
              type="submit"
              variant="outline"
              className="w-full"
              loading={busy === "email"}
              disabled={busy !== null || !email.trim()}
            >
              Email me a sign-in link
            </Button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              Sign up free
            </Link>
          </>
        )}
      </p>

      <p className="mt-4 text-center text-xs text-gray-400">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-gray-600">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </Link>
        . No legal claims are made on your behalf.
      </p>
    </div>
  );
}
