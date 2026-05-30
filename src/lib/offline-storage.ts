/**
 * OfflineStorageManager — IndexedDB wrapper for saving stories offline.
 * Stories expire automatically after 7 days.
 * Cover images are compressed and stored as Base64 Data URLs.
 */

const DB_NAME = "bookverse_offline";
const DB_VERSION = 1;
const STORE_NAME = "offline_stories";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export interface OfflineStory {
  id: string;
  title: string;
  author: string;
  authorUsername: string;
  description: string;
  coverImage: string; // Base64 Data URL
  chapters: OfflineChapter[];
  savedAt: number;
  expiresAt: number;
}

export interface OfflineChapter {
  id: string;
  title: string;
  chapterOrder: number;
  htmlContent: string;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB is not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("expiresAt", "expiresAt", { unique: false });
        store.createIndex("savedAt", "savedAt", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Compress and convert an image URL to a Base64 Data URL using Canvas.
 * Reduces file size by ~80-90% compared to the original.
 */
export async function compressImageToBase64(
  imageUrl: string,
  maxWidth = 400,
  quality = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ratio = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas context unavailable"));
        return;
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/webp", quality);
      resolve(dataUrl);
    };

    img.onerror = () => {
      // If CORS fails, return a placeholder
      resolve("");
    };

    img.src = imageUrl;
  });
}

/** Save a story for offline reading. */
export async function saveStoryOffline(story: Omit<OfflineStory, "savedAt" | "expiresAt">): Promise<void> {
  const db = await openDB();
  const now = Date.now();

  const record: OfflineStory = {
    ...story,
    savedAt: now,
    expiresAt: now + SEVEN_DAYS_MS,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put(record);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** Get a single offline story by ID. */
export async function getOfflineStory(id: string): Promise<OfflineStory | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.get(id);
    request.onsuccess = () => {
      const story = request.result as OfflineStory | undefined;
      if (story && story.expiresAt > Date.now()) {
        resolve(story);
      } else {
        // Expired — clean it up silently
        if (story) {
          deleteOfflineStory(id).catch(() => {});
        }
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}

/** Get all non-expired offline stories. */
export async function getAllOfflineStories(): Promise<OfflineStory[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => {
      const all = request.result as OfflineStory[];
      const now = Date.now();
      const valid = all.filter((s) => s.expiresAt > now);
      resolve(valid);
    };
    request.onerror = () => reject(request.error);
  });
}

/** Delete a single offline story. */
export async function deleteOfflineStory(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** Delete all offline stories. */
export async function clearAllOfflineStories(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

/** Purge all expired stories. Called automatically on app boot / page visit. */
export async function purgeExpiredStories(): Promise<number> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    let purgedCount = 0;

    request.onsuccess = () => {
      const all = request.result as OfflineStory[];
      const now = Date.now();
      for (const story of all) {
        if (story.expiresAt <= now) {
          store.delete(story.id);
          purgedCount++;
        }
      }
      tx.oncomplete = () => resolve(purgedCount);
    };
    request.onerror = () => reject(request.error);
  });
}

/** Check if a story is already saved offline. */
export async function isStorySavedOffline(id: string): Promise<boolean> {
  const story = await getOfflineStory(id);
  return story !== null;
}

/** Estimate total storage used by offline stories (in bytes). */
export async function getOfflineStorageSize(): Promise<number> {
  const stories = await getAllOfflineStories();
  let totalBytes = 0;
  for (const story of stories) {
    totalBytes += new Blob([JSON.stringify(story)]).size;
  }
  return totalBytes;
}

/** Format bytes to human-readable string. */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Get remaining time before expiration as a human-readable string. */
export function getExpirationLabel(expiresAt: number): string {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return "Expired";

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h বাকি`;
  if (hours > 0) return `${hours}h বাকি`;
  return "Soon";
}
