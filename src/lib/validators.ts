import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1),
  authorName: z.string().min(1),
  coverUrl: z.string().optional().nullable(),
  fileUrl: z.string().min(1),
  fileType: z.enum(["PDF", "EPUB"]),
  genre: z.string().min(1),
  language: z.string().min(1).default("English"),
  description: z.string().optional().nullable(),
});

export const storySchema = z.object({
  title: z.string().min(1),
  coverUrl: z.string().optional().nullable(),
  summary: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
  published: z.boolean().optional(),
  universeId: z.string().optional().nullable(),
  seriesId: z.string().optional().nullable(),
  sequenceNumber: z.number().int().min(1).optional().nullable(),
  subGenres: z.array(z.string()).optional(),
  mood: z.string().optional().nullable(),
  contentWarnings: z.array(z.string()).optional(),
  ageRating: z.number().int().optional().nullable(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional().nullable(),
});

export const chapterSchema = z.object({
  title: z.string().min(1),
  content: z.unknown().optional().nullable(),
  chapterOrder: z.number().int().min(1),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional().nullable(),
});

export const commentSchema = z.object({
  content: z.string().min(1),
  parentId: z.string().optional().nullable(),
});

export const profileSchema = z.object({
  displayName: z.string().min(1).max(50).optional().nullable(),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  bio: z.string().max(500).optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  description: z.string().max(1000).optional().nullable(),
  mood: z.string().max(50).optional().nullable(),
  subGenres: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  phoneNumber: z.string().optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  nationality: z.string().max(100).optional().nullable(),
  instructionSeen: z.boolean().optional(),
  readingFont: z.enum(["sans", "serif", "dyslexic"]).optional(),
  readerTheme: z.enum(["white", "sepia", "cream", "charcoal", "black"]).optional(),
  readingProgressSync: z.boolean().optional(),
  bkashNumber: z.string()
    .refine((val) => val === "" || /^01[3-9]\d{8}$/.test(val), {
      message: "Invalid bKash number. Must be a valid 11-digit Bangladeshi mobile number or empty."
    })
    .optional()
    .nullable(),
  nagadNumber: z.string()
    .refine((val) => val === "" || /^01[3-9]\d{8}$/.test(val), {
      message: "Invalid Nagad number. Must be a valid 11-digit Bangladeshi mobile number or empty."
    })
    .optional()
    .nullable(),
});

