"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithRedirect,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

type SyncedUser = {
  id: string;
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  role: string;
  membershipTier?: string | null;
  membershipExpiry?: Date | string | null;
  _count?: {
    followers: number;
    following: number;
    stories: number;
  };
};

function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`, "Path=/", "SameSite=Lax"];
  if (maxAgeSeconds != null) parts.push(`Max-Age=${maxAgeSeconds}`);
  if (window.location.protocol === "https:") parts.push("Secure");
  document.cookie = parts.join("; ");
}

function clearCookie(name: string) {
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<SyncedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        clearCookie("firebase-token");
        setDbUser(null);
        setLoading(false);
        return;
      }

      try {
        const token = await u.getIdToken();
        setCookie("firebase-token", token, 60 * 60 * 24 * 7);
        const response = await fetch("/api/auth/sync", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          const payload = (await response.json()) as { user?: SyncedUser, needsOnboarding?: boolean };
          setDbUser(payload.user ?? null);
          
          // Redirect to onboarding if needed
          if (payload.needsOnboarding && window.location.pathname !== '/onboarding') {
            window.location.href = '/onboarding';
          }
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback((email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to send reset email.");
    }
  }, []);

  const signInWithGoogle = useCallback(() => {
    return signInWithPopup(auth, googleProvider).catch((error: unknown) => {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String((error as { code?: unknown }).code)
          : "";

      if (
        code === "auth/popup-blocked" ||
        code === "auth/popup-closed-by-user" ||
        code === "auth/cancelled-popup-request"
      ) {
        return signInWithRedirect(auth, googleProvider);
      }

      throw error;
    });
  }, []);

  const signOut = useCallback(async () => {
    clearCookie("firebase-token");
    setDbUser(null);
    await fbSignOut(auth);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch("/api/auth/sync", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const payload = (await response.json()) as { user?: SyncedUser };
        setDbUser(payload.user ?? null);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  }, [user]);

  return useMemo(
    () => ({ user, dbUser, loading, signIn, signUp, resetPassword, signInWithGoogle, signOut, refreshUser }),
    [user, dbUser, loading, signIn, signUp, resetPassword, signInWithGoogle, signOut, refreshUser]
  );
}

