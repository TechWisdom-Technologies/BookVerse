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
  description?: string | null;
  mood?: string | null;
  subGenres?: string[];
  tags?: string[];
  adminInstruction?: string | null;
  instructionSeen?: boolean;
  readingFont?: string;
  readerTheme?: string;
  readingProgressSync?: boolean;
  phoneNumber?: string | null;
  bkashNumber?: string | null;
  nagadNumber?: string | null;
  _count?: {
    followers: number;
    following: number;
    stories: number;
  };
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<SyncedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setDbUser(null);
        setLoading(false);
        
        const protectedPages = [
          "/write",
          "/upload",
          "/admin",
          "/shelf",
          "/profile/edit",
          "/settings",
          "/wallet",
        ];
        const pathname = window.location.pathname;
        const isProtectedPage = protectedPages.some((p) => pathname.startsWith(p));
        if (isProtectedPage) {
          window.location.href = `/login?redirect=${encodeURIComponent(pathname)}`;
        }
        return;
      }

      try {
        const token = await u.getIdToken();
        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const payload = (await response.json()) as { user?: SyncedUser, needsOnboarding?: boolean };
          setDbUser(payload.user ?? null);
          
          // Redirect to onboarding if needed
          if (payload.needsOnboarding && window.location.pathname !== '/onboarding') {
            window.location.href = '/onboarding';
          }
        }
      } catch (error) {
        console.error("Auth sync error:", error);
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

  const resetPassword = useCallback(async (email: string, captchaToken?: string) => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, captchaToken }),
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
    setDbUser(null);
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (error) {
      console.error("Failed to sign out on server:", error);
    }
    await fbSignOut(auth);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

