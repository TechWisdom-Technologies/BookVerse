import type { Role, FileType, ReactionType } from "@prisma/client";

export type { Role, FileType, ReactionType };

export interface ApiError {
  error: string;
}

export interface ApiOk<T> {
  data: T;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface PublicUser {
  id: string;
  username: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  role: Role;
}

export interface BookDTO {
  id: string;
  title: string;
  authorName: string;
  coverUrl?: string | null;
  fileUrl: string;
  fileType: FileType;
  genre: string;
  language: string;
  description?: string | null;
  downloadCount: number;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoryDTO {
  id: string;
  title: string;
  coverUrl?: string | null;
  summary?: string | null;
  authorId: string;
  viewCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchResult {
  type: "book" | "story";
  id: string;
  title: string;
  subtitle?: string;
  coverUrl?: string | null;
}

