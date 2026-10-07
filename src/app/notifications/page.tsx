import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NotificationsClientView from "@/components/notifications/NotificationsClientView";

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/notifications');
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return <NotificationsClientView initialNotifications={notifications as any} />;
}
