import { Meilisearch } from "meilisearch";

const host = process.env.MEILISEARCH_HOST;
const adminApiKey = process.env.MEILISEARCH_ADMIN_API_KEY;

export const searchClient =
  host && adminApiKey ? new Meilisearch({ host, apiKey: adminApiKey }) : null;

type BookIndexDoc = {
  id: string;
  title: string;
  authorName: string;
  genre: string;
  language: string;
};

type StoryIndexDoc = {
  id: string;
  title: string;
  summary?: string | null;
  published: boolean;
};

async function safe(op: () => Promise<unknown>) {
  try {
    if (!searchClient) return;
    await op();
  } catch {
    // Must never break main DB operations
  }
}

export async function indexBook(book: BookIndexDoc) {
  await safe(async () => {
    const index = searchClient!.index("books");
    await index.updateFilterableAttributes(["genre", "language"]);
    await index.addDocuments([book]);
  });
}

export async function removeBook(id: string) {
  await safe(async () => {
    const index = searchClient!.index("books");
    await index.deleteDocument(id);
  });
}

export async function indexStory(story: StoryIndexDoc) {
  await safe(async () => {
    const index = searchClient!.index("stories");
    await index.addDocuments([story]);
  });
}

export async function removeStory(id: string) {
  await safe(async () => {
    const index = searchClient!.index("stories");
    await index.deleteDocument(id);
  });
}

export async function searchAll(query: string) {
  if (!searchClient) return { books: [], stories: [] };

  const [books, stories] = await Promise.all([
    searchClient.index("books").search(query),
    searchClient.index("stories").search(query),
  ]);

  return { books: books.hits, stories: stories.hits };
}
