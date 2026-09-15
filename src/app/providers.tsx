"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
export { useAuth };

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      themes={['light', 'dark', 'custom', 'rose', 'amoled', 'cyberpunk', 'mint', 'eink', 'neon']}
      value={{ light: 'light', dark: 'dark', custom: 'custom', rose: 'rose', amoled: 'amoled', cyberpunk: 'cyberpunk', mint: 'mint', eink: 'eink', neon: 'neon' }}
    >
      <AuthProvider>{children}</AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "rounded border border-zinc-100 bg-white text-zinc-900 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 text-[10px] font-bold uppercase tracking-widest",
          style: {
            padding: '12px 16px',
          }
        }}
      />
    </ThemeProvider>
  );
}
