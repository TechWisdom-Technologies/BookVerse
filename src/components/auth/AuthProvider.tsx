"use client";

import { createContext, useContext } from "react";
import type { User } from "firebase/auth";
import { useAuth as useAuthHook } from "@/hooks/useAuth";

type AuthContextValue = ReturnType<typeof useAuthHook> & { user: User | null };

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useAuthHook();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

