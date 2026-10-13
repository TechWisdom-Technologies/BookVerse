"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogIn, X, ArrowRight, UserPlus } from "lucide-react";

// ─── Context ────────────────────────────────────────────────────────
interface SignInModalContextValue {
  /**
   * Show the sign-in required modal.
   * @param message  — Custom message shown in the modal body.
   * @param redirect — Where to redirect after login (defaults to current page).
   */
  requireSignIn: (message?: string, redirect?: string) => void;
}

const SignInModalContext = createContext<SignInModalContextValue | null>(null);

export function useSignInModal() {
  const ctx = useContext(SignInModalContext);
  if (!ctx) throw new Error("useSignInModal must be used within SignInModalProvider");
  return ctx;
}

// ─── Provider ───────────────────────────────────────────────────────
export function SignInModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [redirect, setRedirect] = useState<string>("");
  const primaryRef = useRef<HTMLAnchorElement>(null);

  const requireSignIn = useCallback((msg?: string, redirectTo?: string) => {
    setMessage(
      msg || "You need to be signed in to perform this action. Please log in or create an account to continue."
    );
    setRedirect(redirectTo || (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/"));
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Escape to close, lock background scroll, focus primary action
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => primaryRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, close]);

  const encoded = encodeURIComponent(redirect);

  return (
    <SignInModalContext.Provider value={{ requireSignIn }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={close}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="signin-modal-title"
            aria-describedby="signin-modal-desc"
            className="relative w-full max-w-sm overflow-hidden rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl text-center animate-in zoom-in-95 fade-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-500 to-transparent" />

            {/* Close Button */}
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Icon */}
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-lg bg-zinc-200 dark:bg-zinc-700 rotate-6 transition-transform" />
                <div className="relative w-16 h-16 rounded-lg bg-zinc-900 dark:bg-white flex items-center justify-center text-white dark:text-zinc-900 shadow-lg">
                  <LogIn className="w-6 h-6" />
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="h-px w-6 bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                    Sign In Required
                  </span>
                  <span className="h-px w-6 bg-zinc-200 dark:bg-zinc-700" />
                </div>
                <h3
                  id="signin-modal-title"
                  className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white"
                >
                  Sign in to Continue
                </h3>
                <p
                  id="signin-modal-desc"
                  className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto"
                >
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <Link
                  ref={primaryRef}
                  href={`/login?redirect=${encoded}`}
                  onClick={close}
                  className="group w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all hover:opacity-90 hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-900 dark:focus-visible:ring-white dark:focus-visible:ring-offset-zinc-900"
                >
                  <span>Log In Now</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href={`/signup?redirect=${encoded}`}
                  onClick={close}
                  className="w-full py-3 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-[11px] font-bold uppercase tracking-widest rounded-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Create an Account</span>
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40">
              <button
                type="button"
                onClick={close}
                className="w-full py-3.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </SignInModalContext.Provider>
  );
}
