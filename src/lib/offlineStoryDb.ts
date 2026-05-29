/**
 * Offline Story Storage — IndexedDB Layer
 *
 * Stores stories and chapters locally so they can be read without internet.
 * Stories automatically expire after 7 days.
 *
 * Database: "bookverse-offline" v1
 * Stores:
 *   - stories: { id, title, summary, coverUrl, coverBase64, authorName, authorUsername, authorAvatarUrl, chapterCount, savedAt, expiresAt }
 *   - chapters: { storyId, chapterId, title, chapterOrder, htmlContent, rawContent, readingTimeMin }
 */

const DB_NAME = "bookverse-offline";
const DB_VERSION = 1;
const STORIES_STORE = "stories";
const CHAPTERS_STORE = "chapters";
const EXPIRATION_DAYS = 7;

// ── Types ──────────────────────────────────────────────────────────

export interface OfflineStory {
  id: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  coverBase64: string | null;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  chapterCount: number;
  savedAt: number; // timestamp ms
  expiresAt: number; // timestamp ms
}

export interface OfflineChapter {
  storyId: string;
  chapterId: string;
  title: string;
  chapterOrder: number;
  htmlContent: string | null;
  rawContent: unknown;
  readingTimeMin: number;
}

export interface SaveStoryInput {
  id: string;
  title: string;
  summary: string | null;
  coverUrl: string | null;
  authorName: string;
  authorUsername: string;
  authorAvatarUrl: string | null;
  chapters: {
    id: string;
    title: string;
    chapterOrder: number;
    htmlContent: string | null;
    rawContent: unknown;
    readingTimeMin: number;
  }[];
}

// ── Database Connection ────────────────────────────────────────────

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(STORIES_STORE)) {
        db.createObjectStore(STORIES_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(CHAPTERS_STORE)) {
        const chaptersStore = db.createObjectStore(CHAPTERS_STORE, {
          keyPath: ["storyId", "chapterId"],
        });
        chaptersStore.createIndex("byStory", "storyId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ── Image caching helper ───────────────────────────────────────────

async function imageToBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ── Save ───────────────────────────────────────────────────────────

export async function saveStoryOffline(input: SaveStoryInput): Promise<void> {
  const db = await openDb();
  const now = Date.now();
  const expiresAt = now + EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

  // Cache cover image as base64
  let coverBase64: string | null = null;
  if (input.coverUrl) {
    coverBase64 = await imageToBase64(input.coverUrl);
  }

  const story: OfflineStory = {
    id: input.id,
    title: input.title,
    summary: input.summary,
    coverUrl: input.coverUrl,
    coverBase64,
    authorName: input.authorName,
    authorUsername: input.authorUsername,
    authorAvatarUrl: input.authorAvatarUrl,
    chapterCount: input.chapters.length,
    savedAt: now,
    expiresAt,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORIES_STORE, CHAPTERS_STORE], "readwrite");
    const storiesStore = tx.objectStore(STORIES_STORE);
    const chaptersStore = tx.objectStore(CHAPTERS_STORE);

    storiesStore.put(story);

    for (const ch of input.chapters) {
      const chapter: OfflineChapter = {
        storyId: input.id,
        chapterId: ch.id,
        title: ch.title,
        chapterOrder: ch.chapterOrder,
        htmlContent: ch.htmlContent,
        rawContent: ch.rawContent,
        readingTimeMin: ch.readingTimeMin,
      };
      chaptersStore.put(chapter);
    }

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ── Remove ─────────────────────────────────────────────────────────

export async function removeOfflineStory(storyId: string): Promise<void> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORIES_STORE, CHAPTERS_STORE], "readwrite");
    const storiesStore = tx.objectStore(STORIES_STORE);
    const chaptersStore = tx.objectStore(CHAPTERS_STORE);

    storiesStore.delete(storyId);

    // Delete all chapters for this story using the index
    const index = chaptersStore.index("byStory");
    const cursorReq = index.openCursor(IDBKeyRange.only(storyId));
    cursorReq.onsuccess = () => {
      const cursor = cursorReq.result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ── List all (with auto-cleanup of expired) ────────────────────────

export async function getOfflineStories(): Promise<OfflineStory[]> {
  const db = await openDb();
  const now = Date.now();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORIES_STORE, CHAPTERS_STORE], "readwrite");
    const storiesStore = tx.objectStore(STORIES_STORE);
    const chaptersStore = tx.objectStore(CHAPTERS_STORE);
    const stories: OfflineStory[] = [];
    const expiredIds: string[] = [];

    const request = storiesStore.getAll();
    request.onsuccess = () => {
      for (const story of request.result as OfflineStory[]) {
        if (story.expiresAt <= now) {
          // Expired — mark for cleanup
          expiredIds.push(story.id);
          storiesStore.delete(story.id);

          // Delete associated chapters
          const index = chaptersStore.index("byStory");
          const cursorReq = index.openCursor(IDBKeyRange.only(story.id));
          cursorReq.onsuccess = () => {
            const cursor = cursorReq.result;
            if (cursor) {
              cursor.delete();
              cursor.continue();
            }
          };
        } else {
          stories.push(story);
        }
      }
    };

    tx.oncomplete = () => {
      db.close();
      // Sort newest saved first
      stories.sort((a, b) => b.savedAt - a.savedAt);
      resolve(stories);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ── Get single story with chapters ─────────────────────────────────

export async function getOfflineStory(
  storyId: string
): Promise<{ story: OfflineStory; chapters: OfflineChapter[] } | null> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORIES_STORE, CHAPTERS_STORE], "readonly");
    const storiesStore = tx.objectStore(STORIES_STORE);
    const chaptersStore = tx.objectStore(CHAPTERS_STORE);

    let story: OfflineStory | null = null;
    const chapters: OfflineChapter[] = [];

    const storyReq = storiesStore.get(storyId);
    storyReq.onsuccess = () => {
      story = storyReq.result ?? null;
      if (story && story.expiresAt <= Date.now()) {
        story = null; // expired
      }
    };

    const index = chaptersStore.index("byStory");
    const chapReq = index.getAll(IDBKeyRange.only(storyId));
    chapReq.onsuccess = () => {
      chapters.push(...(chapReq.result as OfflineChapter[]));
    };

    tx.oncomplete = () => {
      db.close();
      if (!story) {
        resolve(null);
        return;
      }
      chapters.sort((a, b) => a.chapterOrder - b.chapterOrder);
      resolve({ story, chapters });
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

// ── Get single chapter ─────────────────────────────────────────────

export async function getOfflineChapter(
  storyId: string,
  chapterId: string
): Promise<OfflineChapter | null> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(CHAPTERS_STORE, "readonly");
    const store = tx.objectStore(CHAPTERS_STORE);
    const request = store.get([storyId, chapterId]);

    request.onsuccess = () => {
      db.close();
      resolve((request.result as OfflineChapter) ?? null);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// ── Check if saved ─────────────────────────────────────────────────

export async function isStorySaved(storyId: string): Promise<boolean> {
  const db = await openDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORIES_STORE, "readonly");
    const store = tx.objectStore(STORIES_STORE);
    const request = store.get(storyId);

    request.onsuccess = () => {
      db.close();
      const story = request.result as OfflineStory | undefined;
      if (!story) {
        resolve(false);
        return;
      }
      // Check if expired
      resolve(story.expiresAt > Date.now());
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// ── Time remaining helper ──────────────────────────────────────────

export function getTimeRemaining(expiresAt: number): string {
  const now = Date.now();
  const diff = expiresAt - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
}
