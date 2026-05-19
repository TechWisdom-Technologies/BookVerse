"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { z } from "zod";
import { MailCheck } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getFriendlyAuthErrorMessage } from "@/lib/auth-errors";

const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export function ForgotPasswordForm({ redirectUrl = "/" }: { redirectUrl?: string }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(result.data.email);
      setSuccess("Reset link sent. Check your email inbox and spam folder.");
    } catch (err) {
      setError(getFriendlyAuthErrorMessage(err, "Failed to send reset email."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950">
      <div className="mb-10 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">
          <MailCheck className="w-3.5 h-3.5" />
          Password Reset
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 uppercase">
          Reset Password.
        </h1>
        <p className="text-xs text-zinc-500 font-medium italic">
          Enter your account email and we will send you a reset link.
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

        {error && (
          <div className="p-4 border border-rose-500/10 bg-rose-500/5 text-[10px] font-bold text-rose-500 rounded uppercase tracking-widest">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 border border-emerald-500/10 bg-emerald-500/5 text-[10px] font-bold text-emerald-600 rounded uppercase tracking-widest">
            {success}
          </div>
        )}

        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded hover:opacity-90 disabled:opacity-50 transition-all"
          >
            {submitting ? "Sending..." : "Send Reset Link"}
          </button>
        </div>
      </form>

      <p className="mt-12 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
        Remembered your password?{" "}
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
