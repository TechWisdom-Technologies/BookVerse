"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ReactNode } from "react";
import dynamic from "next/dynamic";

const AiLibrarianWidget = dynamic(() => import("@/components/shared/AiLibrarianWidget").then(m => m.AiLibrarianWidget), { ssr: false });
const DevPhaseModal = dynamic(() => import("@/components/shared/DevPhaseModal").then(m => m.DevPhaseModal), { ssr: false });
const AdminInstructionModal = dynamic(() => import("@/components/shared/AdminInstructionModal").then(m => m.AdminInstructionModal), { ssr: false });
const OfflineDetector = dynamic(() => import("@/components/shared/OfflineDetector").then(m => m.OfflineDetector), { ssr: false });

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
