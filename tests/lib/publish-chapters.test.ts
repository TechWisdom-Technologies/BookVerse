import { describe, it, expect, vi, beforeEach } from 'vitest';
import { publishScheduledChapters } from '../../src/lib/publish-chapters';
import { prisma } from '@/lib/prisma';
import { createNotificationsBatch } from '@/lib/notifications';

vi.mock('@/lib/notifications', () => ({
  createNotificationsBatch: vi.fn(),
}));

describe('Publish Chapters Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty array if no scheduled chapters are due', async () => {
    (prisma.scheduledChapter.findMany as any).mockResolvedValue([]);
    const result = await publishScheduledChapters();
    expect(result).toEqual([]);
    expect(prisma.storyChapter.updateMany).not.toHaveBeenCalled();
  });

  it('publishes scheduled chapter and deletes schedule entry', async () => {
    (prisma.scheduledChapter.findMany as any).mockResolvedValue([
      { id: 'sch1', storyId: 's1', chapterNumber: 1, notifyFollowers: false }
    ]);

    (prisma.storyChapter.updateMany as any).mockResolvedValue({ count: 1 });

    const result = await publishScheduledChapters();
    
    expect(result).toEqual([{ storyId: 's1', chapterNumber: 1, published: true }]);
    
    expect(prisma.storyChapter.updateMany).toHaveBeenCalledWith({
      where: { storyId: 's1', chapterNumber: 1, status: { not: 'PUBLISHED' } },
      data: { status: 'PUBLISHED' }
    });
    
    expect(prisma.scheduledChapter.delete).toHaveBeenCalledWith({
      where: { id: 'sch1' }
    });
  });

  it('notifies followers if requested', async () => {
    (prisma.scheduledChapter.findMany as any).mockResolvedValue([
      { id: 'sch1', storyId: 's1', chapterNumber: 1, notifyFollowers: true }
    ]);
    (prisma.storyChapter.updateMany as any).mockResolvedValue({ count: 1 });
    (prisma.storyChapter.findFirst as any).mockResolvedValue({ title: 'The Beginning' });
    (prisma.story.findUnique as any).mockResolvedValue({
      id: 's1',
      title: 'My Story',
      authorId: 'auth1',
      author: { displayName: 'John Doe', username: 'john' }
    });
    (prisma.follow.findMany as any).mockResolvedValue([
      { followerId: 'user1' },
      { followerId: 'user2' }
    ]);

    await publishScheduledChapters();

    expect(createNotificationsBatch).toHaveBeenCalledWith({
      userIds: ['user1', 'user2'],
      type: 'STORY_POST',
      title: 'New Chapter Released!',
      message: 'John Doe just released "The Beginning" of "My Story"',
      link: '/stories/s1'
    });
  });

  it('catches and logs errors without crashing', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (prisma.scheduledChapter.findMany as any).mockRejectedValue(new Error('DB connection failed'));

    const result = await publishScheduledChapters();
    
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith('Error executing publishScheduledChapters:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
