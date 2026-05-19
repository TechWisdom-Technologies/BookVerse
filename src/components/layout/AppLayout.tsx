"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AiLibrarianWidget } from "@/components/shared/AiLibrarianWidget";
import { DevPhaseModal } from "@/components/shared/DevPhaseModal";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");

  if (isAdminPath) {
    return <div className="flex-1">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <DevPhaseModal />
      <AiLibrarianWidget />
    </>
  );
}
