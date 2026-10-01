"use client";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
export { useAuth };

const VALID_THEMES = ['light', 'dark', 'rose', 'amoled', 'cyberpunk', 'mint', 'neon', 'earth', 'canvas', 'vintage', 'oceanic', 'royal', 'system'];

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const currentTheme = localStorage.getItem('theme');
      if (currentTheme && !VALID_THEMES.includes(currentTheme)) {
        localStorage.removeItem('theme');
        // Force reload or re-render to apply system default
        document.documentElement.className = document.documentElement.className.replace(currentTheme, '').trim();
      }
    } catch (e) {}
  }, []);

  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      themes={['light', 'dark', 'rose', 'amoled', 'cyberpunk', 'mint', 'neon', 'earth', 'canvas', 'vintage', 'oceanic', 'royal']}
      value={{ light: 'light', dark: 'dark', rose: 'rose', amoled: 'amoled', cyberpunk: 'cyberpunk', mint: 'mint', neon: 'neon', earth: 'earth', canvas: 'canvas', vintage: 'vintage', oceanic: 'oceanic', royal: 'royal' }}
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
