"use client";

import { useEffect, useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useAuth } from "@/components/auth/AuthProvider";
import { Loader2, UserPlus } from "lucide-react";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";
import { Turnstile, type BoundTurnstileObject } from "react-turnstile";

const signupSchema = z
  .object({
    email: z.string().email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function SignupForm({ redirectUrl = "/" }: { redirectUrl?: string }) {
  const router = useRouter();
  const { user, loading, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const boundTurnstileRef = useRef<BoundTurnstileObject | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectUrl);
    }
  }, [loading, redirectUrl, router, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const result = signupSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check the form fields.");
      return;
    }

    setSubmitting(true);
    try {
      await signUp(result.data.email, result.data.password);
    } catch (err) {
      setError(getFriendlyAuthErrorMessage(err, "Failed to create account."));
      setSubmitting(false);
      setCaptchaToken(null);
      boundTurnstileRef.current?.reset();
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(getFriendlyAuthErrorMessage(err, "Failed to sign up with Google."));
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
          <UserPlus className="w-3.5 h-3.5" />
          Create Account
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 uppercase">
          Join BookVerse.
        </h1>
        <p className="text-xs text-zinc-500 font-medium italic">
          Create an account to read, save, and share your own stories.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Email Address
          </label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"
            placeholder="At least 8 characters"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
            Confirm Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="w-full px-5 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-sm text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all shadow-sm"
            placeholder="Repeat your password"
          />
        </div>

        {error && (
          <div className="p-4 border border-rose-500/10 bg-rose-500/5 text-[10px] font-bold text-rose-500 rounded uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="space-y-4 pt-2">
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="flex justify-center">
              <Turnstile
                sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                onSuccess={(token, _preClearance, boundTurnstile) => {
                  setCaptchaToken(token);
                  boundTurnstileRef.current = boundTurnstile;
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={() => setCaptchaToken(null)}
                theme="auto"
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading || submitting || (!captchaToken && !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)}
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {loading || submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Account"}
          </button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-50 dark:border-zinc-900" />
            </div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300">
              <span className="bg-white dark:bg-zinc-950 px-4">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading || submitting}
            className="w-full py-4 bg-transparent border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
        </div>
      </form>

      <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        Already registered?{" "}
        <Link
          href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ""}`}
          className="text-zinc-900 dark:text-white hover:underline underline-offset-8 transition-colors ml-1"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}