import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createNotification, createNotificationsBatch } from '../../src/lib/notifications';
import { prisma } from '@/lib/prisma';

describe('Notifications Service', () => {
  const originalEnv = process.env;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID = 'test-app-id';
    process.env.ONESIGNAL_REST_API_KEY = 'test-api-key';
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';

    originalFetch = global.fetch;
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    process.env = originalEnv;
    global.fetch = originalFetch;
  });

  describe('createNotification', () => {
    it('saves notification to DB and sends push via OneSignal', async () => {
      (prisma.notification.create as any).mockResolvedValue({ id: 'notif123' });

      const result = await createNotification({
        userId: 'user1',
        type: 'COMMENT',
        title: 'New Comment',
        message: 'You got a comment',
        link: '/story/1'
      });

      expect(result).toEqual({ id: 'notif123' });
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId: 'user1',
          type: 'COMMENT',
          title: 'New Comment',
          message: 'You got a comment',
          link: '/story/1',
        }
      });
      
      expect(global.fetch).toHaveBeenCalledWith('https://onesignal.com/api/v1/notifications', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Basic test-api-key',
        }),
        body: JSON.stringify({
          app_id: 'test-app-id',
          include_external_user_ids: ['user1'],
          headings: { en: 'New Comment' },
          contents: { en: 'You got a comment' },
          url: 'http://localhost:3000/story/1'
        })
      }));
    });

    it('skips OneSignal if env vars are missing', async () => {
      delete process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      (prisma.notification.create as any).mockResolvedValue({ id: 'notif123' });

      await createNotification({
        userId: 'user1',
        type: 'SYSTEM',
        title: 'Hi',
        message: 'Hello'
      });

      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('catches and logs fetch errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      (prisma.notification.create as any).mockResolvedValue({ id: 'notif123' });

      await createNotification({
        userId: 'user1',
        type: 'SYSTEM',
        title: 'Hi',
        message: 'Hello'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to send OneSignal push notification', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });

  describe('createNotificationsBatch', () => {
    it('returns immediately if userIds array is empty', async () => {
      await createNotificationsBatch({
        userIds: [],
        type: 'TEST',
        title: 'Hi',
        message: 'Hello'
      });

      expect(prisma.notification.createMany).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('batches DB insert and sends to OneSignal in chunks', async () => {
      // Create 2005 user IDs (will require 2 chunks for OneSignal)
      const userIds = Array.from({ length: 2005 }, (_, i) => `user${i}`);

      await createNotificationsBatch({
        userIds,
        type: 'ANNOUNCEMENT',
        title: 'Big Update',
        message: 'V2 is here',
        link: '/update'
      });

      expect(prisma.notification.createMany).toHaveBeenCalledWith({
        data: expect.any(Array),
        skipDuplicates: true
      });

      // Fetch should be called twice (2000 users, then 5 users)
      expect(global.fetch).toHaveBeenCalledTimes(2);

      // Verify the second chunk
      expect(global.fetch).toHaveBeenNthCalledWith(2, 'https://onesignal.com/api/v1/notifications', expect.objectContaining({
        body: expect.stringContaining('"include_external_user_ids":["user2000","user2001","user2002","user2003","user2004"]')
      }));
    });

    it('logs DB insert errors but continues to OneSignal', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (prisma.notification.createMany as any).mockRejectedValue(new Error('DB Down'));

      await createNotificationsBatch({
        userIds: ['user1'],
        type: 'TEST',
        title: 'Hi',
        message: 'Hello'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to batch insert notifications to DB', expect.any(Error));
      expect(global.fetch).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('logs OneSignal batch errors', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await createNotificationsBatch({
        userIds: ['user1'],
        type: 'TEST',
        title: 'Hi',
        message: 'Hello'
      });

      expect(consoleSpy).toHaveBeenCalledWith('Failed to batch send OneSignal push notifications', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});
