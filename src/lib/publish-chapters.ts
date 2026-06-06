import { prisma } from "@/lib/prisma";
import { createNotificationsBatch } from "@/lib/notifications";

export async function publishScheduledChapters() {
  try {
    const now = new Date();
    // 1. Fetch scheduled chapters that are ready to be released
    const scheduled = await prisma.scheduledChapter.findMany({
      where: {
        releaseDateTime: {
          lte: now,
        },
      },
    });

    if (scheduled.length === 0) return [];

    const results = [];

    for (const item of scheduled) {
      // 2. Find and update matching chapter status to PUBLISHED
      const updatedChapters = await prisma.storyChapter.updateMany({
        where: {
          storyId: item.storyId,
          chapterNumber: item.chapterNumber,
          status: {
            not: "PUBLISHED",
          },
        },
        data: {
          status: "PUBLISHED",
        },
      });

      // 3. Delete the scheduled chapter entry IMMEDIATELY
      // This prevents the infinite loop crash if notifications fail or timeout
      await prisma.scheduledChapter.delete({
        where: { id: item.id },
      });

      if (updatedChapters.count > 0) {
        // Find details to notify followers
        const chapter = await prisma.storyChapter.findFirst({
          where: {
            storyId: item.storyId,
            chapterNumber: item.chapterNumber,
          },
          select: {
            title: true,
          },
        });

        const story = await prisma.story.findUnique({
          where: { id: item.storyId },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        });

        if (story && item.notifyFollowers) {
          const authorName = story.author.displayName || story.author.username;
          const followers = await prisma.follow.findMany({
            where: { followingId: story.authorId },
          });

          if (followers.length > 0) {
            const followerIds = followers.map((f) => f.followerId);
            
            await createNotificationsBatch({
              userIds: followerIds,
              type: "STORY_POST",
              title: "New Chapter Released!",
              message: `${authorName} just released "${chapter?.title || `Chapter ${item.chapterNumber}`}" of "${story.title}"`,
              link: `/stories/${story.id}`,
            });
          }
        }

        results.push({
          storyId: item.storyId,
          chapterNumber: item.chapterNumber,
          published: true,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error executing publishScheduledChapters:", error);
    return [];
  }
}
