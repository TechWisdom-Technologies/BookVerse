import { Meilisearch } from "meilisearch";

const host = process.env.MEILISEARCH_HOST;
const adminApiKey = process.env.MEILISEARCH_ADMIN_API_KEY;

export const searchClient =
  host && adminApiKey ? new Meilisearch({ host, apiKey: adminApiKey }) : null;

export type BookIndexDoc = {
  id: string;
  _type: "book";
  title: string;
  authorName: string;
  genre: string;
  language: string;
  description?: string | null;
  coverUrl?: string | null;
  fileType?: string;
  createdAt: string;
  downloadCount: number;
};

export type StoryIndexDoc = {
  id: string;
  _type: "story";
  title: string;
  summary?: string | null;
  authorName: string;
  published: boolean;
  coverUrl?: string | null;
  createdAt: string;
  viewCount: number;
};

export type SearchResult = BookIndexDoc | StoryIndexDoc;

async function safe<T>(op: () => Promise<T>): Promise<T | null> {
  try {
    if (!searchClient) return null;
    return await op();
  } catch (error) {
    // Must never break main DB operations
    console.error("Meilisearch error:", error);
    return null;
  }
}

export async function initializeIndexes() {
  if (!searchClient) return;

  try {
    // Initialize books index
    const booksIndex = searchClient.index("books");
    await booksIndex.updateSettings({
      searchableAttributes: ["title", "authorName", "genre", "description"],
      filterableAttributes: ["genre", "language", "fileType"],
      sortableAttributes: ["createdAt", "downloadCount"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
      ],
    });

    // Initialize stories index
    const storiesIndex = searchClient.index("stories");
    await storiesIndex.updateSettings({
      searchableAttributes: ["title", "summary", "authorName"],
      filterableAttributes: ["published"],
      sortableAttributes: ["createdAt", "viewCount"],
      rankingRules: [
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
      ],
    });

    console.log("Meilisearch indexes initialized");
  } catch (error) {
    console.error("Failed to initialize Meilisearch indexes:", error);
  }
}

export async function indexBook(book: Omit<BookIndexDoc, "_type">) {
  await safe(async () => {
    const index = searchClient!.index("books");
    await index.addDocuments([{ ...book, _type: "book" }]);
  });
}

export async function removeBook(id: string) {
  await safe(async () => {
    const index = searchClient!.index("books");
    await index.deleteDocument(id);
  });
}

export async function indexStory(story: Omit<StoryIndexDoc, "_type">) {
  await safe(async () => {
    const index = searchClient!.index("stories");
    await index.addDocuments([{ ...story, _type: "story" }]);
  });
}

export async function removeStory(id: string) {
  await safe(async () => {
    const index = searchClient!.index("stories");
    await index.deleteDocument(id);
  });
}

interface SearchOptions {
  type?: "all" | "books" | "stories";
  page?: number;
  limit?: number;
}

interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  meilisearchAvailable: boolean;
}

export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const { type = "all", page = 1, limit = 12 } = options;
  const offset = (page - 1) * limit;

  // Try Meilisearch first
  if (searchClient) {
    try {
      const results: SearchResult[] = [];
      let total = 0;

      if (type === "all" || type === "books") {
        const booksRes = await searchClient.index("books").search(query, {
          limit: type === "all" ? Math.ceil(limit / 2) : limit,
          offset: type === "all" ? 0 : offset,
        });
        results.push(...(booksRes.hits as BookIndexDoc[]));
        if (type === "books") total = booksRes.estimatedTotalHits || 0;
      }

      if (type === "all" || type === "stories") {
        const storiesRes = await searchClient.index("stories").search(query, {
          filter: "published = true",
          limit: type === "all" ? Math.ceil(limit / 2) : limit,
          offset: type === "all" ? 0 : offset,
        });
        results.push(...(storiesRes.hits as StoryIndexDoc[]));
        if (type === "stories") total = storiesRes.estimatedTotalHits || 0;
      }

      if (type === "all") {
        total = results.length;
      }

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        results,
        total,
        page,
        totalPages,
        meilisearchAvailable: true,
      };
    } catch (error) {
      console.error("Meilisearch search failed, falling back to Prisma:", error);
    }
  }

  // Fallback: Meilisearch not available
  return {
    results: [],
    total: 0,
    page,
    totalPages: 0,
    meilisearchAvailable: false,
  };
}
