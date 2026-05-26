"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RedirectNewsletterPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/author/newsletter");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );
}
