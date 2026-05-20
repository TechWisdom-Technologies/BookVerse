
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/wasm.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.2.1
 * Query Engine version: 4123509d24aa4dede1e864b46351bf2790323b69
 */
Prisma.prismaVersion = {
  client: "6.2.1",
  engine: "4123509d24aa4dede1e864b46351bf2790323b69"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}





/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  firebaseUid: 'firebaseUid',
  email: 'email',
  username: 'username',
  displayName: 'displayName',
  avatarUrl: 'avatarUrl',
  bio: 'bio',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  dateOfBirth: 'dateOfBirth',
  membershipTier: 'membershipTier',
  membershipExpiry: 'membershipExpiry',
  subGenres: 'subGenres',
  mood: 'mood',
  contentWarnings: 'contentWarnings',
  ageRating: 'ageRating',
  tags: 'tags',
  reactionCount: 'reactionCount',
  description: 'description'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  title: 'title',
  message: 'message',
  link: 'link',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.BookScalarFieldEnum = {
  id: 'id',
  title: 'title',
  authorName: 'authorName',
  coverUrl: 'coverUrl',
  fileUrl: 'fileUrl',
  fileType: 'fileType',
  genre: 'genre',
  language: 'language',
  description: 'description',
  downloadCount: 'downloadCount',
  uploadedById: 'uploadedById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookReviewScalarFieldEnum = {
  id: 'id',
  bookId: 'bookId',
  userId: 'userId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.BookSaveScalarFieldEnum = {
  id: 'id',
  bookId: 'bookId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.StoryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  coverUrl: 'coverUrl',
  summary: 'summary',
  description: 'description',
  authorId: 'authorId',
  viewCount: 'viewCount',
  reactionCount: 'reactionCount',
  published: 'published',
  genre: 'genre',
  universeId: 'universeId',
  sequenceNumber: 'sequenceNumber',
  subGenres: 'subGenres',
  mood: 'mood',
  contentWarnings: 'contentWarnings',
  ageRating: 'ageRating',
  tags: 'tags',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoryChapterScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  title: 'title',
  content: 'content',
  chapterNumber: 'chapterNumber',
  chapterOrder: 'chapterOrder',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoryReactionScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  userId: 'userId',
  reactionType: 'reactionType',
  createdAt: 'createdAt'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  content: 'content',
  authorId: 'authorId',
  storyId: 'storyId',
  bookId: 'bookId',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FollowScalarFieldEnum = {
  id: 'id',
  followerId: 'followerId',
  followingId: 'followingId',
  createdAt: 'createdAt'
};

exports.Prisma.ReadingLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  storyId: 'storyId',
  date: 'date',
  pagesRead: 'pagesRead',
  minutes: 'minutes',
  readTime: 'readTime',
  sessionsToCompletion: 'sessionsToCompletion',
  createdAt: 'createdAt'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  icon: 'icon',
  points: 'points',
  createdAt: 'createdAt'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  achievementId: 'achievementId',
  earnedAt: 'earnedAt'
};

exports.Prisma.ClubScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  coverUrl: 'coverUrl',
  ownerId: 'ownerId',
  genre: 'genre',
  isPrivate: 'isPrivate',
  maxMembers: 'maxMembers',
  joinCode: 'joinCode',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClubMemberScalarFieldEnum = {
  id: 'id',
  clubId: 'clubId',
  userId: 'userId',
  role: 'role',
  joinedAt: 'joinedAt'
};

exports.Prisma.ClubBanScalarFieldEnum = {
  id: 'id',
  clubId: 'clubId',
  userId: 'userId',
  reason: 'reason',
  bannedAt: 'bannedAt',
  bannedBy: 'bannedBy'
};

exports.Prisma.ClubDiscussionScalarFieldEnum = {
  id: 'id',
  clubId: 'clubId',
  authorId: 'authorId',
  title: 'title',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BetaReaderScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  userId: 'userId',
  createdAt: 'createdAt'
};

exports.Prisma.NewsletterSubscriberScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  subscriberId: 'subscriberId',
  createdAt: 'createdAt'
};

exports.Prisma.TipScalarFieldEnum = {
  id: 'id',
  amount: 'amount',
  currency: 'currency',
  senderId: 'senderId',
  receiverId: 'receiverId',
  storyId: 'storyId',
  message: 'message',
  stripeSessionId: 'stripeSessionId',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.BookAnnotationScalarFieldEnum = {
  id: 'id',
  bookId: 'bookId',
  userId: 'userId',
  type: 'type',
  pageNumber: 'pageNumber',
  content: 'content',
  highlightColor: 'highlightColor',
  highlightedText: 'highlightedText',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ScheduledChapterScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  chapterNumber: 'chapterNumber',
  releaseDateTime: 'releaseDateTime',
  notifyFollowers: 'notifyFollowers',
  createdBy: 'createdBy',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InlineCommentScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  paragraphId: 'paragraphId',
  content: 'content',
  authorId: 'authorId',
  spoilerAlert: 'spoilerAlert',
  parentId: 'parentId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShareActivityScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  platform: 'platform',
  sharedBy: 'sharedBy',
  createdAt: 'createdAt'
};

exports.Prisma.OnboardingQuizScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  genrePreferences: 'genrePreferences',
  readingLevel: 'readingLevel',
  favoriteAuthors: 'favoriteAuthors',
  completed: 'completed',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContentReportScalarFieldEnum = {
  id: 'id',
  reportedBy: 'reportedBy',
  storyId: 'storyId',
  reason: 'reason',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DMCANoticeScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  originalWorkTitle: 'originalWorkTitle',
  originalWorkAuthor: 'originalWorkAuthor',
  copyrightHolder: 'copyrightHolder',
  description: 'description',
  submittedBy: 'submittedBy',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.StoryPromotionScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  tier: 'tier',
  startDate: 'startDate',
  endDate: 'endDate',
  cost: 'cost',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.GiftMembershipScalarFieldEnum = {
  id: 'id',
  code: 'code',
  tier: 'tier',
  duration: 'duration',
  sentBy: 'sentBy',
  recipientEmail: 'recipientEmail',
  redeemById: 'redeemById',
  value: 'value',
  expiresAt: 'expiresAt',
  redeemedAt: 'redeemedAt',
  status: 'status',
  createdAt: 'createdAt'
};

exports.Prisma.UniverseScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  genre: 'genre',
  coverUrl: 'coverUrl',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionTransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  plan: 'plan',
  duration: 'duration',
  amount: 'amount',
  senderNumber: 'senderNumber',
  transactionId: 'transactionId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  VISITOR: 'VISITOR',
  MEMBER: 'MEMBER',
  AUTHOR: 'AUTHOR',
  ADMIN: 'ADMIN'
};

exports.FileType = exports.$Enums.FileType = {
  PDF: 'PDF',
  EPUB: 'EPUB'
};

exports.ReactionType = exports.$Enums.ReactionType = {
  LIKE: 'LIKE',
  LOVE: 'LOVE',
  FIRE: 'FIRE',
  CRY: 'CRY',
  WOW: 'WOW'
};

exports.ClubRole = exports.$Enums.ClubRole = {
  MEMBER: 'MEMBER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
};

exports.ChapterStatus = exports.$Enums.ChapterStatus = {
  DRAFT: 'DRAFT',
  BETA: 'BETA',
  PUBLISHED: 'PUBLISHED'
};

exports.TipStatus = exports.$Enums.TipStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.AnnotationType = exports.$Enums.AnnotationType = {
  BOOKMARK: 'BOOKMARK',
  HIGHLIGHT: 'HIGHLIGHT',
  NOTE: 'NOTE'
};

exports.Prisma.ModelName = {
  User: 'User',
  Notification: 'Notification',
  Book: 'Book',
  BookReview: 'BookReview',
  BookSave: 'BookSave',
  Story: 'Story',
  StoryChapter: 'StoryChapter',
  StoryReaction: 'StoryReaction',
  Comment: 'Comment',
  Follow: 'Follow',
  ReadingLog: 'ReadingLog',
  Achievement: 'Achievement',
  UserAchievement: 'UserAchievement',
  Club: 'Club',
  ClubMember: 'ClubMember',
  ClubBan: 'ClubBan',
  ClubDiscussion: 'ClubDiscussion',
  BetaReader: 'BetaReader',
  NewsletterSubscriber: 'NewsletterSubscriber',
  Tip: 'Tip',
  BookAnnotation: 'BookAnnotation',
  ScheduledChapter: 'ScheduledChapter',
  InlineComment: 'InlineComment',
  ShareActivity: 'ShareActivity',
  OnboardingQuiz: 'OnboardingQuiz',
  ContentReport: 'ContentReport',
  DMCANotice: 'DMCANotice',
  StoryPromotion: 'StoryPromotion',
  GiftMembership: 'GiftMembership',
  Universe: 'Universe',
  SubscriptionTransaction: 'SubscriptionTransaction'
};
/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\RAJ\\Desktop\\Book v1.1.0\\bookverse\\src\\generated\\client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [
      "driverAdapters"
    ],
    "sourceFilePath": "C:\\Users\\RAJ\\Desktop\\Book v1.1.0\\bookverse\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../../../prisma",
  "clientVersion": "6.2.1",
  "engineVersion": "4123509d24aa4dede1e864b46351bf2790323b69",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider        = \"prisma-client-js\"\n  previewFeatures = [\"driverAdapters\"]\n  output          = \"../src/generated/client\"\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DIRECT_URL\")\n}\n\nenum Role {\n  VISITOR\n  MEMBER\n  AUTHOR\n  ADMIN\n}\n\nenum FileType {\n  PDF\n  EPUB\n}\n\nenum ReactionType {\n  LIKE\n  LOVE\n  FIRE\n  CRY\n  WOW\n}\n\nenum ClubRole {\n  MEMBER\n  MODERATOR\n  ADMIN\n}\n\nenum ChapterStatus {\n  DRAFT\n  BETA\n  PUBLISHED\n}\n\nenum TipStatus {\n  PENDING\n  COMPLETED\n  FAILED\n}\n\nmodel User {\n  id          String   @id @default(cuid())\n  firebaseUid String   @unique @map(\"firebase_uid\")\n  email       String   @unique\n  username    String   @unique\n  displayName String?  @map(\"display_name\")\n  avatarUrl   String?  @map(\"avatar_url\")\n  bio         String?\n  role        Role     @default(MEMBER)\n  createdAt   DateTime @default(now()) @map(\"created_at\")\n  updatedAt   DateTime @updatedAt @map(\"updated_at\")\n\n  books          Book[]\n  bookReviews    BookReview[]\n  bookSaves      BookSave[]\n  universes      Universe[]\n  stories        Story[]\n  storyReactions StoryReaction[]\n  comments       Comment[]\n  followers      Follow[]        @relation(\"following\")\n  following      Follow[]        @relation(\"follower\")\n\n  readingLogs     ReadingLog[]\n  achievements    UserAchievement[]\n  clubMemberships ClubMember[]\n  clubDiscussions ClubDiscussion[]\n  clubsOwned      Club[]            @relation(\"club_owner\")\n  clubBans        ClubBan[]\n\n  betaReads             BetaReader[]\n  newsletterSubscribers NewsletterSubscriber[] @relation(\"AuthorNewsletters\")\n  newsletterSubs        NewsletterSubscriber[] @relation(\"NewsletterSubscriptions\")\n\n  tipsSent     Tip[] @relation(\"TipsSent\")\n  tipsReceived Tip[] @relation(\"TipsReceived\")\n\n  // New fields for enhanced features\n  dateOfBirth      DateTime? @map(\"date_of_birth\")\n  membershipTier   String?   @map(\"membership_tier\")\n  membershipExpiry DateTime? @map(\"membership_expiry\")\n  subGenres        String[]  @default([])\n  mood             String?\n  contentWarnings  String[]  @default([])\n  ageRating        Int?      @default(0)\n  tags             String[]  @default([])\n  reactionCount    Int       @default(0) @map(\"reaction_count\")\n  description      String?\n\n  // Relationships to new models\n  annotations       BookAnnotation[]\n  scheduledChapters ScheduledChapter[]\n  inlineComments    InlineComment[]\n  shareActivities   ShareActivity[]\n\n  giftsSent                GiftMembership[]          @relation(\"sender\")\n  giftsReceived            GiftMembership[]          @relation(\"receiver\")\n  onboardingQuiz           OnboardingQuiz?\n  contentReports           ContentReport[]           @relation(\"reporter\")\n  dmcaNotices              DMCANotice[]              @relation(\"dmca_submitter\")\n  notifications            Notification[]            @relation(\"user_notifications\")\n  subscriptionTransactions SubscriptionTransaction[]\n\n  @@map(\"users\")\n}\n\nmodel Notification {\n  id        String   @id @default(cuid())\n  userId    String   @map(\"user_id\")\n  type      String // e.g., \"REACT\", \"COMMENT\", \"REPLY\", \"STORY_POST\", \"DISCUSSION\"\n  title     String\n  message   String\n  link      String?\n  isRead    Boolean  @default(false) @map(\"is_read\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  user User @relation(\"user_notifications\", fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@map(\"notifications\")\n}\n\nmodel Book {\n  id            String   @id @default(cuid())\n  title         String\n  authorName    String   @map(\"author_name\")\n  coverUrl      String?  @map(\"cover_url\")\n  fileUrl       String   @map(\"file_url\")\n  fileType      FileType @map(\"file_type\")\n  genre         String\n  language      String   @default(\"English\")\n  description   String?\n  downloadCount Int      @default(0) @map(\"download_count\")\n  uploadedById  String   @map(\"uploaded_by_id\")\n  createdAt     DateTime @default(now()) @map(\"created_at\")\n  updatedAt     DateTime @updatedAt @map(\"updated_at\")\n\n  uploadedBy  User             @relation(fields: [uploadedById], references: [id], onDelete: Cascade)\n  reviews     BookReview[]\n  saves       BookSave[]\n  comments    Comment[]\n  annotations BookAnnotation[]\n\n  @@index([genre])\n  @@index([uploadedById])\n  @@map(\"books\")\n}\n\nmodel BookReview {\n  id        String   @id @default(cuid())\n  bookId    String   @map(\"book_id\")\n  userId    String   @map(\"user_id\")\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  book Book @relation(fields: [bookId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([bookId, userId])\n  @@map(\"book_reviews\")\n}\n\nmodel BookSave {\n  id        String   @id @default(cuid())\n  bookId    String   @map(\"book_id\")\n  userId    String   @map(\"user_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  book Book @relation(fields: [bookId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([bookId, userId])\n  @@map(\"book_saves\")\n}\n\nmodel Story {\n  id              String   @id @default(cuid())\n  title           String\n  coverUrl        String?  @map(\"cover_url\")\n  summary         String?\n  description     String?\n  authorId        String   @map(\"author_id\")\n  viewCount       Int      @default(0) @map(\"view_count\")\n  reactionCount   Int      @default(0) @map(\"reaction_count\")\n  published       Boolean  @default(false)\n  genre           String?\n  universeId      String?  @map(\"universe_id\")\n  sequenceNumber  Int?     @map(\"sequence_number\")\n  subGenres       String[] @default([])\n  mood            String?\n  contentWarnings String[] @default([])\n  ageRating       Int?     @default(0)\n  tags            String[] @default([])\n  createdAt       DateTime @default(now()) @map(\"created_at\")\n  updatedAt       DateTime @updatedAt @map(\"updated_at\")\n\n  author      User            @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  universe    Universe?       @relation(\"story_universe\", fields: [universeId], references: [id], onDelete: SetNull)\n  chapters    StoryChapter[]\n  reactions   StoryReaction[]\n  comments    Comment[]\n  betaReaders BetaReader[]\n  tips        Tip[]\n\n  // New relationships\n  inlineComments  InlineComment[]\n  shareActivities ShareActivity[]\n  promotions      StoryPromotion[]\n\n  @@index([authorId])\n  @@index([published])\n  @@index([universeId])\n  @@map(\"stories\")\n}\n\nmodel StoryChapter {\n  id            String        @id @default(cuid())\n  storyId       String        @map(\"story_id\")\n  title         String\n  content       Json?\n  chapterNumber Int           @map(\"chapter_number\")\n  chapterOrder  Int           @map(\"chapter_order\")\n  status        ChapterStatus @default(PUBLISHED)\n  createdAt     DateTime      @default(now()) @map(\"created_at\")\n  updatedAt     DateTime      @updatedAt @map(\"updated_at\")\n\n  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)\n\n  @@unique([storyId, chapterOrder])\n  @@map(\"story_chapters\")\n}\n\nmodel StoryReaction {\n  id           String       @id @default(cuid())\n  storyId      String       @map(\"story_id\")\n  userId       String       @map(\"user_id\")\n  reactionType ReactionType @map(\"reaction_type\")\n  createdAt    DateTime     @default(now()) @map(\"created_at\")\n\n  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([storyId, userId])\n  @@map(\"story_reactions\")\n}\n\nmodel Comment {\n  id        String   @id @default(cuid())\n  content   String\n  authorId  String   @map(\"author_id\")\n  storyId   String?  @map(\"story_id\")\n  bookId    String?  @map(\"book_id\")\n  parentId  String?  @map(\"parent_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  author  User      @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  story   Story?    @relation(fields: [storyId], references: [id], onDelete: Cascade)\n  book    Book?     @relation(fields: [bookId], references: [id], onDelete: Cascade)\n  parent  Comment?  @relation(\"CommentReplies\", fields: [parentId], references: [id], onDelete: Cascade)\n  replies Comment[] @relation(\"CommentReplies\")\n\n  @@index([storyId])\n  @@index([bookId])\n  @@index([parentId])\n  @@map(\"comments\")\n}\n\nmodel Follow {\n  id          String   @id @default(cuid())\n  followerId  String   @map(\"follower_id\")\n  followingId String   @map(\"following_id\")\n  createdAt   DateTime @default(now()) @map(\"created_at\")\n\n  follower  User @relation(\"follower\", fields: [followerId], references: [id], onDelete: Cascade)\n  following User @relation(\"following\", fields: [followingId], references: [id], onDelete: Cascade)\n\n  @@unique([followerId, followingId])\n  @@map(\"follows\")\n}\n\n// --- Gamification Models (Batch 2) ---\n\nmodel ReadingLog {\n  id                   String   @id @default(cuid())\n  userId               String   @map(\"user_id\")\n  storyId              String?  @map(\"story_id\")\n  date                 DateTime @db.Date\n  pagesRead            Int      @default(0) @map(\"pages_read\")\n  minutes              Int      @default(0)\n  readTime             Int?     @map(\"read_time\")\n  sessionsToCompletion Boolean? @map(\"sessions_to_completion\")\n  createdAt            DateTime @default(now()) @map(\"created_at\")\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, date])\n  @@index([userId])\n  @@map(\"reading_logs\")\n}\n\nmodel Achievement {\n  id          String   @id @default(cuid())\n  name        String   @unique\n  description String\n  icon        String?\n  points      Int      @default(10)\n  createdAt   DateTime @default(now()) @map(\"created_at\")\n\n  users UserAchievement[]\n\n  @@map(\"achievements\")\n}\n\nmodel UserAchievement {\n  id            String   @id @default(cuid())\n  userId        String   @map(\"user_id\")\n  achievementId String   @map(\"achievement_id\")\n  earnedAt      DateTime @default(now()) @map(\"earned_at\")\n\n  user        User        @relation(fields: [userId], references: [id], onDelete: Cascade)\n  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)\n\n  @@unique([userId, achievementId])\n  @@map(\"user_achievements\")\n}\n\n// --- Book Clubs & Communities Models (Batch 2) ---\n\nmodel Club {\n  id          String   @id @default(cuid())\n  name        String   @unique\n  description String?\n  coverUrl    String?  @map(\"cover_url\")\n  ownerId     String   @map(\"owner_id\")\n  genre       String?\n  isPrivate   Boolean  @default(false) @map(\"is_private\")\n  maxMembers  Int?     @map(\"max_members\")\n  joinCode    String?  @unique @map(\"join_code\")\n  createdAt   DateTime @default(now()) @map(\"created_at\")\n  updatedAt   DateTime @updatedAt @map(\"updated_at\")\n\n  owner       User             @relation(\"club_owner\", fields: [ownerId], references: [id], onDelete: Cascade)\n  members     ClubMember[]\n  discussions ClubDiscussion[]\n  bannedUsers ClubBan[]\n\n  @@index([ownerId])\n  @@index([joinCode])\n  @@map(\"clubs\")\n}\n\nmodel ClubMember {\n  id       String   @id @default(cuid())\n  clubId   String   @map(\"club_id\")\n  userId   String   @map(\"user_id\")\n  role     ClubRole @default(MEMBER)\n  joinedAt DateTime @default(now()) @map(\"joined_at\")\n\n  club Club @relation(fields: [clubId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([clubId, userId])\n  @@map(\"club_members\")\n}\n\nmodel ClubBan {\n  id       String   @id @default(cuid())\n  clubId   String   @map(\"club_id\")\n  userId   String   @map(\"user_id\")\n  reason   String?\n  bannedAt DateTime @default(now()) @map(\"banned_at\")\n  bannedBy String   @map(\"banned_by\")\n\n  club Club @relation(fields: [clubId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([clubId, userId])\n  @@index([clubId])\n  @@map(\"club_bans\")\n}\n\nmodel ClubDiscussion {\n  id        String   @id @default(cuid())\n  clubId    String   @map(\"club_id\")\n  authorId  String   @map(\"author_id\")\n  title     String\n  content   String\n  createdAt DateTime @default(now()) @map(\"created_at\")\n  updatedAt DateTime @updatedAt @map(\"updated_at\")\n\n  club   Club @relation(fields: [clubId], references: [id], onDelete: Cascade)\n  author User @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  @@index([clubId])\n  @@index([authorId])\n  @@map(\"club_discussions\")\n}\n\n// --- Creator Tools Models (Batch 3) ---\n\nmodel BetaReader {\n  id        String   @id @default(cuid())\n  storyId   String   @map(\"story_id\")\n  userId    String   @map(\"user_id\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)\n  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([storyId, userId])\n  @@map(\"beta_readers\")\n}\n\nmodel NewsletterSubscriber {\n  id           String   @id @default(cuid())\n  authorId     String   @map(\"author_id\")\n  subscriberId String   @map(\"subscriber_id\")\n  createdAt    DateTime @default(now()) @map(\"created_at\")\n\n  author     User @relation(\"AuthorNewsletters\", fields: [authorId], references: [id], onDelete: Cascade)\n  subscriber User @relation(\"NewsletterSubscriptions\", fields: [subscriberId], references: [id], onDelete: Cascade)\n\n  @@unique([authorId, subscriberId])\n  @@map(\"newsletter_subscribers\")\n}\n\n// --- Monetisation Models (Batch 4) ---\n\nmodel Tip {\n  id              String    @id @default(cuid())\n  amount          Int\n  currency        String    @default(\"usd\")\n  senderId        String?   @map(\"sender_id\")\n  receiverId      String    @map(\"receiver_id\")\n  storyId         String?   @map(\"story_id\")\n  message         String?\n  stripeSessionId String?   @unique @map(\"stripe_session_id\")\n  status          TipStatus @default(PENDING)\n  createdAt       DateTime  @default(now()) @map(\"created_at\")\n\n  sender   User?  @relation(\"TipsSent\", fields: [senderId], references: [id], onDelete: SetNull)\n  receiver User   @relation(\"TipsReceived\", fields: [receiverId], references: [id], onDelete: Cascade)\n  story    Story? @relation(fields: [storyId], references: [id], onDelete: SetNull)\n\n  @@index([receiverId])\n  @@map(\"tips\")\n}\n\n// --- Deep Gap Analysis Features (Wave 5) ---\n\nenum AnnotationType {\n  BOOKMARK\n  HIGHLIGHT\n  NOTE\n}\n\nmodel BookAnnotation {\n  id              String         @id @default(cuid())\n  bookId          String         @map(\"book_id\")\n  userId          String         @map(\"user_id\")\n  type            AnnotationType\n  pageNumber      Int            @map(\"page_number\")\n  content         String?\n  highlightColor  String?        @map(\"highlight_color\")\n  highlightedText String?        @map(\"highlighted_text\")\n  createdAt       DateTime       @default(now()) @map(\"created_at\")\n  updatedAt       DateTime       @updatedAt @map(\"updated_at\")\n\n  book Book @relation(fields: [bookId], references: [id], onDelete: Cascade)\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([bookId, userId])\n  @@map(\"book_annotations\")\n}\n\nmodel ScheduledChapter {\n  id              String   @id @default(cuid())\n  storyId         String   @map(\"story_id\")\n  chapterNumber   Int      @map(\"chapter_number\")\n  releaseDateTime DateTime @map(\"release_date_time\")\n  notifyFollowers Boolean  @default(true) @map(\"notify_followers\")\n  createdBy       String   @map(\"created_by\")\n  createdAt       DateTime @default(now()) @map(\"created_at\")\n  updatedAt       DateTime @updatedAt @map(\"updated_at\")\n\n  user User @relation(fields: [createdBy], references: [id], onDelete: Cascade)\n\n  @@index([storyId])\n  @@map(\"scheduled_chapters\")\n}\n\nmodel InlineComment {\n  id           String   @id @default(cuid())\n  storyId      String   @map(\"story_id\")\n  paragraphId  String   @map(\"paragraph_id\")\n  content      String\n  authorId     String   @map(\"author_id\")\n  spoilerAlert Boolean  @default(false) @map(\"spoiler_alert\")\n  parentId     String?  @map(\"parent_id\")\n  createdAt    DateTime @default(now()) @map(\"created_at\")\n  updatedAt    DateTime @updatedAt @map(\"updated_at\")\n\n  story   Story           @relation(fields: [storyId], references: [id], onDelete: Cascade)\n  author  User            @relation(fields: [authorId], references: [id], onDelete: Cascade)\n  parent  InlineComment?  @relation(\"CommentThread\", fields: [parentId], references: [id], onDelete: Cascade)\n  replies InlineComment[] @relation(\"CommentThread\")\n\n  @@index([storyId])\n  @@index([authorId])\n  @@map(\"inline_comments\")\n}\n\nmodel ShareActivity {\n  id        String   @id @default(cuid())\n  storyId   String   @map(\"story_id\")\n  platform  String // Twitter, Instagram, Facebook, TikTok\n  sharedBy  String?  @map(\"shared_by\")\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)\n  user  User? @relation(fields: [sharedBy], references: [id], onDelete: SetNull)\n\n  @@index([storyId])\n  @@map(\"share_activities\")\n}\n\nmodel OnboardingQuiz {\n  id               String   @id @default(cuid())\n  userId           String   @unique @map(\"user_id\")\n  genrePreferences String[]\n  readingLevel     String?  @default(\"INTERMEDIATE\")\n  favoriteAuthors  String[]\n  completed        Boolean  @default(false)\n  createdAt        DateTime @default(now()) @map(\"created_at\")\n  updatedAt        DateTime @updatedAt @map(\"updated_at\")\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"onboarding_quizzes\")\n}\n\nmodel ContentReport {\n  id         String   @id @default(cuid())\n  reportedBy String   @map(\"reported_by\")\n  storyId    String   @map(\"story_id\")\n  reason     String // COPYRIGHTED, EXPLICIT, HATE_SPEECH, HARASSMENT, OTHER\n  status     String   @default(\"PENDING\") // PENDING, REVIEWED, RESOLVED, DISMISSED\n  createdAt  DateTime @default(now()) @map(\"created_at\")\n  updatedAt  DateTime @updatedAt @map(\"updated_at\")\n\n  reporter User @relation(\"reporter\", fields: [reportedBy], references: [id], onDelete: Cascade)\n\n  @@index([storyId])\n  @@map(\"content_reports\")\n}\n\nmodel DMCANotice {\n  id                 String   @id @default(cuid())\n  storyId            String   @map(\"story_id\")\n  originalWorkTitle  String   @map(\"original_work_title\")\n  originalWorkAuthor String?  @map(\"original_work_author\")\n  copyrightHolder    String   @map(\"copyright_holder\")\n  description        String?\n  submittedBy        String   @map(\"submitted_by\")\n  status             String   @default(\"SUBMITTED\") // SUBMITTED, ACKNOWLEDGED, RESOLVED, DISMISSED\n  createdAt          DateTime @default(now()) @map(\"created_at\")\n\n  submittedByUser User @relation(\"dmca_submitter\", fields: [submittedBy], references: [id], onDelete: Cascade)\n\n  @@index([storyId])\n  @@map(\"dmca_notices\")\n}\n\nmodel StoryPromotion {\n  id        String   @id @default(cuid())\n  storyId   String   @map(\"story_id\")\n  tier      String // FEATURED, PROMOTED, TRENDING\n  startDate DateTime @map(\"start_date\")\n  endDate   DateTime @map(\"end_date\")\n  cost      Float\n  status    String   @default(\"ACTIVE\") // ACTIVE, ENDED, PAUSED\n  createdAt DateTime @default(now()) @map(\"created_at\")\n\n  story Story @relation(fields: [storyId], references: [id], onDelete: Cascade)\n\n  @@index([storyId])\n  @@map(\"story_promotions\")\n}\n\nmodel GiftMembership {\n  id             String    @id @default(cuid())\n  code           String    @unique\n  tier           String // PRO, CREATOR\n  duration       Int // in months\n  sentBy         String    @map(\"sent_by\")\n  recipientEmail String    @map(\"recipient_email\")\n  redeemById     String?   @map(\"redeemed_by\")\n  value          Float\n  expiresAt      DateTime  @map(\"expires_at\")\n  redeemedAt     DateTime? @map(\"redeemed_at\")\n  status         String    @default(\"PENDING\") // PENDING, REDEEMED, EXPIRED\n  createdAt      DateTime  @default(now()) @map(\"created_at\")\n\n  sentByUser     User  @relation(\"sender\", fields: [sentBy], references: [id], onDelete: Cascade)\n  redeemedByUser User? @relation(\"receiver\", fields: [redeemById], references: [id], onDelete: SetNull)\n\n  @@index([sentBy])\n  @@map(\"gift_memberships\")\n}\n\nmodel Universe {\n  id          String   @id @default(cuid())\n  name        String\n  description String?\n  genre       String   @default(\"Fiction\")\n  coverUrl    String?  @map(\"cover_url\")\n  userId      String   @map(\"user_id\")\n  createdAt   DateTime @default(now()) @map(\"created_at\")\n  updatedAt   DateTime @updatedAt @map(\"updated_at\")\n\n  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)\n  stories Story[] @relation(\"story_universe\")\n\n  @@index([userId])\n  @@map(\"universes\")\n}\n\nmodel SubscriptionTransaction {\n  id            String   @id @default(cuid())\n  userId        String   @map(\"user_id\")\n  plan          String // PRO or CREATOR\n  duration      Int // in months\n  amount        Float\n  senderNumber  String   @map(\"sender_number\")\n  transactionId String   @unique @map(\"transaction_id\")\n  status        String   @default(\"PENDING\") // PENDING, APPROVED, DECLINED\n  createdAt     DateTime @default(now()) @map(\"created_at\")\n  updatedAt     DateTime @updatedAt @map(\"updated_at\")\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@map(\"subscription_transactions\")\n}\n",
  "inlineSchemaHash": "e71e7adc4dc8c0c2cf96d3539926eec55ad0c92240288558adc4e2b5c94fbbe3",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"firebaseUid\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"firebase_uid\"},{\"name\":\"email\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"username\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"displayName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"display_name\"},{\"name\":\"avatarUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"avatar_url\"},{\"name\":\"bio\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"Role\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"books\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToUser\"},{\"name\":\"bookReviews\",\"kind\":\"object\",\"type\":\"BookReview\",\"relationName\":\"BookReviewToUser\"},{\"name\":\"bookSaves\",\"kind\":\"object\",\"type\":\"BookSave\",\"relationName\":\"BookSaveToUser\"},{\"name\":\"universes\",\"kind\":\"object\",\"type\":\"Universe\",\"relationName\":\"UniverseToUser\"},{\"name\":\"stories\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"StoryToUser\"},{\"name\":\"storyReactions\",\"kind\":\"object\",\"type\":\"StoryReaction\",\"relationName\":\"StoryReactionToUser\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToUser\"},{\"name\":\"followers\",\"kind\":\"object\",\"type\":\"Follow\",\"relationName\":\"following\"},{\"name\":\"following\",\"kind\":\"object\",\"type\":\"Follow\",\"relationName\":\"follower\"},{\"name\":\"readingLogs\",\"kind\":\"object\",\"type\":\"ReadingLog\",\"relationName\":\"ReadingLogToUser\"},{\"name\":\"achievements\",\"kind\":\"object\",\"type\":\"UserAchievement\",\"relationName\":\"UserToUserAchievement\"},{\"name\":\"clubMemberships\",\"kind\":\"object\",\"type\":\"ClubMember\",\"relationName\":\"ClubMemberToUser\"},{\"name\":\"clubDiscussions\",\"kind\":\"object\",\"type\":\"ClubDiscussion\",\"relationName\":\"ClubDiscussionToUser\"},{\"name\":\"clubsOwned\",\"kind\":\"object\",\"type\":\"Club\",\"relationName\":\"club_owner\"},{\"name\":\"clubBans\",\"kind\":\"object\",\"type\":\"ClubBan\",\"relationName\":\"ClubBanToUser\"},{\"name\":\"betaReads\",\"kind\":\"object\",\"type\":\"BetaReader\",\"relationName\":\"BetaReaderToUser\"},{\"name\":\"newsletterSubscribers\",\"kind\":\"object\",\"type\":\"NewsletterSubscriber\",\"relationName\":\"AuthorNewsletters\"},{\"name\":\"newsletterSubs\",\"kind\":\"object\",\"type\":\"NewsletterSubscriber\",\"relationName\":\"NewsletterSubscriptions\"},{\"name\":\"tipsSent\",\"kind\":\"object\",\"type\":\"Tip\",\"relationName\":\"TipsSent\"},{\"name\":\"tipsReceived\",\"kind\":\"object\",\"type\":\"Tip\",\"relationName\":\"TipsReceived\"},{\"name\":\"dateOfBirth\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"date_of_birth\"},{\"name\":\"membershipTier\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"membership_tier\"},{\"name\":\"membershipExpiry\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"membership_expiry\"},{\"name\":\"subGenres\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"mood\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contentWarnings\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ageRating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reactionCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"reaction_count\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"annotations\",\"kind\":\"object\",\"type\":\"BookAnnotation\",\"relationName\":\"BookAnnotationToUser\"},{\"name\":\"scheduledChapters\",\"kind\":\"object\",\"type\":\"ScheduledChapter\",\"relationName\":\"ScheduledChapterToUser\"},{\"name\":\"inlineComments\",\"kind\":\"object\",\"type\":\"InlineComment\",\"relationName\":\"InlineCommentToUser\"},{\"name\":\"shareActivities\",\"kind\":\"object\",\"type\":\"ShareActivity\",\"relationName\":\"ShareActivityToUser\"},{\"name\":\"giftsSent\",\"kind\":\"object\",\"type\":\"GiftMembership\",\"relationName\":\"sender\"},{\"name\":\"giftsReceived\",\"kind\":\"object\",\"type\":\"GiftMembership\",\"relationName\":\"receiver\"},{\"name\":\"onboardingQuiz\",\"kind\":\"object\",\"type\":\"OnboardingQuiz\",\"relationName\":\"OnboardingQuizToUser\"},{\"name\":\"contentReports\",\"kind\":\"object\",\"type\":\"ContentReport\",\"relationName\":\"reporter\"},{\"name\":\"dmcaNotices\",\"kind\":\"object\",\"type\":\"DMCANotice\",\"relationName\":\"dmca_submitter\"},{\"name\":\"notifications\",\"kind\":\"object\",\"type\":\"Notification\",\"relationName\":\"user_notifications\"},{\"name\":\"subscriptionTransactions\",\"kind\":\"object\",\"type\":\"SubscriptionTransaction\",\"relationName\":\"SubscriptionTransactionToUser\"}],\"dbName\":\"users\"},\"Notification\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"type\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"link\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isRead\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_read\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"user_notifications\"}],\"dbName\":\"notifications\"},\"Book\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorName\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"author_name\"},{\"name\":\"coverUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"cover_url\"},{\"name\":\"fileUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"file_url\"},{\"name\":\"fileType\",\"kind\":\"enum\",\"type\":\"FileType\",\"dbName\":\"file_type\"},{\"name\":\"genre\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"language\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"downloadCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"download_count\"},{\"name\":\"uploadedById\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"uploaded_by_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"uploadedBy\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BookToUser\"},{\"name\":\"reviews\",\"kind\":\"object\",\"type\":\"BookReview\",\"relationName\":\"BookToBookReview\"},{\"name\":\"saves\",\"kind\":\"object\",\"type\":\"BookSave\",\"relationName\":\"BookToBookSave\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"BookToComment\"},{\"name\":\"annotations\",\"kind\":\"object\",\"type\":\"BookAnnotation\",\"relationName\":\"BookToBookAnnotation\"}],\"dbName\":\"books\"},\"BookReview\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"book_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"rating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"comment\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToBookReview\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BookReviewToUser\"}],\"dbName\":\"book_reviews\"},\"BookSave\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"book_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToBookSave\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BookSaveToUser\"}],\"dbName\":\"book_saves\"},\"Story\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"coverUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"cover_url\"},{\"name\":\"summary\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"author_id\"},{\"name\":\"viewCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"view_count\"},{\"name\":\"reactionCount\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"reaction_count\"},{\"name\":\"published\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"genre\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"universeId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"universe_id\"},{\"name\":\"sequenceNumber\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"sequence_number\"},{\"name\":\"subGenres\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"mood\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contentWarnings\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"ageRating\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"tags\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"StoryToUser\"},{\"name\":\"universe\",\"kind\":\"object\",\"type\":\"Universe\",\"relationName\":\"story_universe\"},{\"name\":\"chapters\",\"kind\":\"object\",\"type\":\"StoryChapter\",\"relationName\":\"StoryToStoryChapter\"},{\"name\":\"reactions\",\"kind\":\"object\",\"type\":\"StoryReaction\",\"relationName\":\"StoryToStoryReaction\"},{\"name\":\"comments\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentToStory\"},{\"name\":\"betaReaders\",\"kind\":\"object\",\"type\":\"BetaReader\",\"relationName\":\"BetaReaderToStory\"},{\"name\":\"tips\",\"kind\":\"object\",\"type\":\"Tip\",\"relationName\":\"StoryToTip\"},{\"name\":\"inlineComments\",\"kind\":\"object\",\"type\":\"InlineComment\",\"relationName\":\"InlineCommentToStory\"},{\"name\":\"shareActivities\",\"kind\":\"object\",\"type\":\"ShareActivity\",\"relationName\":\"ShareActivityToStory\"},{\"name\":\"promotions\",\"kind\":\"object\",\"type\":\"StoryPromotion\",\"relationName\":\"StoryToStoryPromotion\"}],\"dbName\":\"stories\"},\"StoryChapter\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"Json\"},{\"name\":\"chapterNumber\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"chapter_number\"},{\"name\":\"chapterOrder\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"chapter_order\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"ChapterStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"StoryToStoryChapter\"}],\"dbName\":\"story_chapters\"},\"StoryReaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"reactionType\",\"kind\":\"enum\",\"type\":\"ReactionType\",\"dbName\":\"reaction_type\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"StoryToStoryReaction\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"StoryReactionToUser\"}],\"dbName\":\"story_reactions\"},\"Comment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"author_id\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"book_id\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"parent_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"CommentToUser\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"CommentToStory\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToComment\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentReplies\"},{\"name\":\"replies\",\"kind\":\"object\",\"type\":\"Comment\",\"relationName\":\"CommentReplies\"}],\"dbName\":\"comments\"},\"Follow\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"followerId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"follower_id\"},{\"name\":\"followingId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"following_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"follower\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"follower\"},{\"name\":\"following\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"following\"}],\"dbName\":\"follows\"},\"ReadingLog\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"date\",\"kind\":\"scalar\",\"type\":\"DateTime\"},{\"name\":\"pagesRead\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"pages_read\"},{\"name\":\"minutes\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"readTime\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"read_time\"},{\"name\":\"sessionsToCompletion\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"sessions_to_completion\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ReadingLogToUser\"}],\"dbName\":\"reading_logs\"},\"Achievement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"icon\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"points\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"users\",\"kind\":\"object\",\"type\":\"UserAchievement\",\"relationName\":\"AchievementToUserAchievement\"}],\"dbName\":\"achievements\"},\"UserAchievement\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"achievementId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"achievement_id\"},{\"name\":\"earnedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"earned_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UserToUserAchievement\"},{\"name\":\"achievement\",\"kind\":\"object\",\"type\":\"Achievement\",\"relationName\":\"AchievementToUserAchievement\"}],\"dbName\":\"user_achievements\"},\"Club\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"coverUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"cover_url\"},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"owner_id\"},{\"name\":\"genre\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"isPrivate\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"is_private\"},{\"name\":\"maxMembers\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"max_members\"},{\"name\":\"joinCode\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"join_code\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"owner\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"club_owner\"},{\"name\":\"members\",\"kind\":\"object\",\"type\":\"ClubMember\",\"relationName\":\"ClubToClubMember\"},{\"name\":\"discussions\",\"kind\":\"object\",\"type\":\"ClubDiscussion\",\"relationName\":\"ClubToClubDiscussion\"},{\"name\":\"bannedUsers\",\"kind\":\"object\",\"type\":\"ClubBan\",\"relationName\":\"ClubToClubBan\"}],\"dbName\":\"clubs\"},\"ClubMember\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clubId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"club_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"role\",\"kind\":\"enum\",\"type\":\"ClubRole\"},{\"name\":\"joinedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"joined_at\"},{\"name\":\"club\",\"kind\":\"object\",\"type\":\"Club\",\"relationName\":\"ClubToClubMember\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ClubMemberToUser\"}],\"dbName\":\"club_members\"},\"ClubBan\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clubId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"club_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bannedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"banned_at\"},{\"name\":\"bannedBy\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"banned_by\"},{\"name\":\"club\",\"kind\":\"object\",\"type\":\"Club\",\"relationName\":\"ClubToClubBan\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ClubBanToUser\"}],\"dbName\":\"club_bans\"},\"ClubDiscussion\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"clubId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"club_id\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"author_id\"},{\"name\":\"title\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"club\",\"kind\":\"object\",\"type\":\"Club\",\"relationName\":\"ClubToClubDiscussion\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ClubDiscussionToUser\"}],\"dbName\":\"club_discussions\"},\"BetaReader\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"BetaReaderToStory\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BetaReaderToUser\"}],\"dbName\":\"beta_readers\"},\"NewsletterSubscriber\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"author_id\"},{\"name\":\"subscriberId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"subscriber_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"AuthorNewsletters\"},{\"name\":\"subscriber\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"NewsletterSubscriptions\"}],\"dbName\":\"newsletter_subscribers\"},\"Tip\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"currency\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"senderId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"sender_id\"},{\"name\":\"receiverId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"receiver_id\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"message\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"stripeSessionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"stripe_session_id\"},{\"name\":\"status\",\"kind\":\"enum\",\"type\":\"TipStatus\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"sender\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TipsSent\"},{\"name\":\"receiver\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"TipsReceived\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"StoryToTip\"}],\"dbName\":\"tips\"},\"BookAnnotation\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"bookId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"book_id\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"type\",\"kind\":\"enum\",\"type\":\"AnnotationType\"},{\"name\":\"pageNumber\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"page_number\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"highlightColor\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"highlight_color\"},{\"name\":\"highlightedText\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"highlighted_text\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"book\",\"kind\":\"object\",\"type\":\"Book\",\"relationName\":\"BookToBookAnnotation\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"BookAnnotationToUser\"}],\"dbName\":\"book_annotations\"},\"ScheduledChapter\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"chapterNumber\",\"kind\":\"scalar\",\"type\":\"Int\",\"dbName\":\"chapter_number\"},{\"name\":\"releaseDateTime\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"release_date_time\"},{\"name\":\"notifyFollowers\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"notify_followers\"},{\"name\":\"createdBy\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"created_by\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ScheduledChapterToUser\"}],\"dbName\":\"scheduled_chapters\"},\"InlineComment\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"paragraphId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"paragraph_id\"},{\"name\":\"content\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"authorId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"author_id\"},{\"name\":\"spoilerAlert\",\"kind\":\"scalar\",\"type\":\"Boolean\",\"dbName\":\"spoiler_alert\"},{\"name\":\"parentId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"parent_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"InlineCommentToStory\"},{\"name\":\"author\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"InlineCommentToUser\"},{\"name\":\"parent\",\"kind\":\"object\",\"type\":\"InlineComment\",\"relationName\":\"CommentThread\"},{\"name\":\"replies\",\"kind\":\"object\",\"type\":\"InlineComment\",\"relationName\":\"CommentThread\"}],\"dbName\":\"inline_comments\"},\"ShareActivity\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"platform\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"sharedBy\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"shared_by\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"ShareActivityToStory\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ShareActivityToUser\"}],\"dbName\":\"share_activities\"},\"OnboardingQuiz\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"genrePreferences\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"readingLevel\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"favoriteAuthors\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"completed\",\"kind\":\"scalar\",\"type\":\"Boolean\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"OnboardingQuizToUser\"}],\"dbName\":\"onboarding_quizzes\"},\"ContentReport\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"reportedBy\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"reported_by\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"reason\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"reporter\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"reporter\"}],\"dbName\":\"content_reports\"},\"DMCANotice\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"originalWorkTitle\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"original_work_title\"},{\"name\":\"originalWorkAuthor\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"original_work_author\"},{\"name\":\"copyrightHolder\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"copyright_holder\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"submittedBy\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"submitted_by\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"submittedByUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"dmca_submitter\"}],\"dbName\":\"dmca_notices\"},\"StoryPromotion\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"storyId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"story_id\"},{\"name\":\"tier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"startDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"start_date\"},{\"name\":\"endDate\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"end_date\"},{\"name\":\"cost\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"story\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"StoryToStoryPromotion\"}],\"dbName\":\"story_promotions\"},\"GiftMembership\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"code\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"tier\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"duration\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"sentBy\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"sent_by\"},{\"name\":\"recipientEmail\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"recipient_email\"},{\"name\":\"redeemById\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"redeemed_by\"},{\"name\":\"value\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"expiresAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"expires_at\"},{\"name\":\"redeemedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"redeemed_at\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"sentByUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"sender\"},{\"name\":\"redeemedByUser\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"receiver\"}],\"dbName\":\"gift_memberships\"},\"Universe\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"name\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"description\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"genre\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"coverUrl\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"cover_url\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"UniverseToUser\"},{\"name\":\"stories\",\"kind\":\"object\",\"type\":\"Story\",\"relationName\":\"story_universe\"}],\"dbName\":\"universes\"},\"SubscriptionTransaction\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"user_id\"},{\"name\":\"plan\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"duration\",\"kind\":\"scalar\",\"type\":\"Int\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"senderNumber\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"sender_number\"},{\"name\":\"transactionId\",\"kind\":\"scalar\",\"type\":\"String\",\"dbName\":\"transaction_id\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"created_at\"},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"type\":\"DateTime\",\"dbName\":\"updated_at\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"SubscriptionTransactionToUser\"}],\"dbName\":\"subscription_transactions\"}},\"enums\":{},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = {
  getRuntime: () => require('./query_engine_bg.js'),
  getQueryEngineWasmModule: async () => {
    const loader = (await import('#wasm-engine-loader')).default
    const engine = (await loader).default
    return engine 
  }
}

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

