
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


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

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

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

exports.Prisma.AuthorSubscriptionScalarFieldEnum = {
  id: 'id',
  subscriberId: 'subscriberId',
  authorId: 'authorId',
  tier: 'tier',
  monthlyPrice: 'monthlyPrice',
  renewalDate: 'renewalDate',
  subscribedAt: 'subscribedAt',
  updatedAt: 'updatedAt'
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

exports.ChapterStatus = exports.$Enums.ChapterStatus = {
  DRAFT: 'DRAFT',
  BETA: 'BETA',
  PUBLISHED: 'PUBLISHED'
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
  AuthorSubscription: 'AuthorSubscription',
  StoryPromotion: 'StoryPromotion',
  GiftMembership: 'GiftMembership',
  Universe: 'Universe'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
