import { prisma } from "@/lib/prisma";

export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  // 1. Save to database
  const notification = await prisma.notification.create({
    data: {
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
    },
  });

  // 2. Send Push Notification via OneSignal
  const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const ONE_SIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

  if (ONE_SIGNAL_APP_ID && ONE_SIGNAL_REST_API_KEY) {
    try {
      await fetch("https://onesignal.com/api/v1/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
        },
        body: JSON.stringify({
          app_id: ONE_SIGNAL_APP_ID,
          include_external_user_ids: [data.userId],
          headings: { en: data.title },
          contents: { en: data.message },
          url: data.link ? `${process.env.NEXT_PUBLIC_APP_URL || ''}${data.link}` : undefined,
        }),
      });
    } catch (error) {
      console.error("Failed to send OneSignal push notification", error);
    }
  }

  return notification;
}

export async function createNotificationsBatch(data: {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  link?: string;
}) {
  if (data.userIds.length === 0) return;

  // 1. Batch save to database
  try {
    const notificationsData = data.userIds.map((userId) => ({
      userId,
      type: data.type,
      title: data.title,
      message: data.message,
      link: data.link,
    }));
    await prisma.notification.createMany({
      data: notificationsData,
      skipDuplicates: true,
    });
  } catch (error) {
    console.error("Failed to batch insert notifications to DB", error);
  }

  // 2. Batch send Push Notification via OneSignal
  const ONE_SIGNAL_APP_ID = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
  const ONE_SIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY;

  if (ONE_SIGNAL_APP_ID && ONE_SIGNAL_REST_API_KEY) {
    try {
      // OneSignal allows max 2000 external_user_ids per request
      const chunkSize = 2000;
      for (let i = 0; i < data.userIds.length; i += chunkSize) {
        const chunk = data.userIds.slice(i, i + chunkSize);
        await fetch("https://onesignal.com/api/v1/notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${ONE_SIGNAL_REST_API_KEY}`,
          },
          body: JSON.stringify({
            app_id: ONE_SIGNAL_APP_ID,
            include_external_user_ids: chunk,
            headings: { en: data.title },
            contents: { en: data.message },
            url: data.link ? `${process.env.NEXT_PUBLIC_APP_URL || ''}${data.link}` : undefined,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to batch send OneSignal push notifications", error);
    }
  }
}
