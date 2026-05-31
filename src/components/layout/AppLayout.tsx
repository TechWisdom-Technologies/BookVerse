"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AiLibrarianWidget } from "@/components/shared/AiLibrarianWidget";
import { DevPhaseModal } from "@/components/shared/DevPhaseModal";
import { AdminInstructionModal } from "@/components/shared/AdminInstructionModal";
import { OfflineDetector } from "@/components/shared/OfflineDetector";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith("/admin");
  const isOfflinePath = pathname?.startsWith("/offline-stories");

  if (isAdminPath) {
    return (
      <>
        <div className="flex-1">{children}</div>
        <OfflineDetector />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      {!isOfflinePath && <Footer />}
      <DevPhaseModal />
      <AdminInstructionModal />
      <AiLibrarianWidget />
      <OfflineDetector />
    </>
  );
}
