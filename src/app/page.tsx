import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookGrid } from "@/components/books/BookGrid";
import type { Book } from "@prisma/client";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { Suspense } from "react";

async function getCurrentUserId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("firebase-token")?.value;
    if (!token) return null;
    const decoded = await adminAuth.verifyIdToken(token);
    const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid }, select: { id: true } });
    return user?.id ?? null;
  } catch { return null; }
}
import {
  BookOpen,
  Search,
  Heart,
  Star,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Users,
  Library,
  Award,
  Clock,
  Zap,
  Download,
  Bookmark,
  Activity,
  Compass,
  Globe,
  Flame
} from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { StoryGrid } from "@/components/stories/StoryGrid";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { AnimatedStats } from "@/components/home/AnimatedStats";

export const dynamic = "force-dynamic";

const categoriesBase = [
  { name: "Fiction", icon: BookOpen, color: "text-zinc-400" },
  { name: "Mystery", icon: Search, color: "text-zinc-400" },
  { name: "Romance", icon: Heart, color: "text-zinc-400" },
  { name: "Sci-Fi", icon: Sparkles, color: "text-zinc-400" },
  { name: "Fantasy", icon: Star, color: "text-zinc-400" },
  { name: "Biography", icon: Users, color: "text-zinc-400" },
];

const features = [
  { icon: Library, title: "Archive", desc: "Access 10,000+ volumes instantly." },
  { icon: Download, title: "Offline", desc: "Read your favorite stories anywhere." },
  { icon: Bookmark, title: "Library", desc: "Track your reading progress easily." },
  { icon: Zap, title: "Speed", desc: "Lightning fast reading experience." },
];

const getUniverseGraphic = (name: string) => {
  const colors = [
    "from-indigo-600 via-purple-600 to-pink-600",
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-rose-500 via-pink-600 to-purple-700",
    "from-amber-500 via-orange-600 to-rose-700",
    "from-violet-600 via-fuchsia-600 to-pink-700"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default async function HomePage() {
  try {
    const currentUserId = await getCurrentUserId();
    const [featured, recent, universes, stories, promotedStories, activePromotions] = await Promise.all([
      prisma.book.findMany({ take: 8, where: { isFeatured: true }, orderBy: { downloadCount: "desc" }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
      prisma.book.findMany({ take: 8, where: { isNewArrival: true }, orderBy: { createdAt: "desc" }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
      prisma.universe.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
          stories: {
            select: {
              viewCount: true,
            },
          },
          _count: {
            select: {
              stories: true,
            },
          },
        },
      }),
      prisma.story.findMany({ take: 8, where: { published: true }, orderBy: { viewCount: "desc" }, select: { id: true, title: true, coverUrl: true, summary: true, viewCount: true, createdAt: true, series: { select: { name: true } }, universe: { select: { name: true } }, sequenceNumber: true, author: { select: { id: true, username: true, displayName: true, avatarUrl: true } }, _count: { select: { chapters: true, reactions: true, comments: true } } } }),
      prisma.storyPromotion.findMany({
        where: {
          tier: "PROMOTED",
          status: "ACTIVE",
          endDate: { gt: new Date() },
          story: { published: true },
        },
        include: {
          story: {
            select: {
              id: true,
              title: true,
              coverUrl: true,
              summary: true,
              viewCount: true,
              createdAt: true,
              series: { select: { name: true } },
              universe: { select: { name: true } },
              sequenceNumber: true,
              author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
              _count: {
                select: {
                  chapters: true,
                  reactions: true,
                  comments: true,
                  inlineComments: true,
                  shareActivities: true
                }
              },
            },
          },
        },
      }),
      prisma.storyPromotion.findMany({
        where: {
          status: "ACTIVE",
          endDate: { gt: new Date() },
        },
        select: {
          storyId: true,
          tier: true
        }
      })
    ]);

    const [topUsers, totalUsers, totalBooks, totalStories, totalReadTimeAggr] = await Promise.all([
      prisma.user.findMany({
        take: 4,
        orderBy: {
          followers: {
            _count: "desc"
          }
        },
        select: {
          id: true,
          avatarUrl: true
        }
      }),
      prisma.user.count(),
      prisma.book.count(),
      prisma.story.count(),
      prisma.readingLog.aggregate({ _sum: { minutes: true } })
    ]);

    const totalReadTime = totalReadTimeAggr._sum.minutes || 0;

    const addRatings = async <T extends Pick<Book, "id">>(books: T[]) => {
      return Promise.all(books.map(async (book) => {
        const reviews = await prisma.bookReview.findMany({ where: { bookId: book.id }, select: { rating: true } });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return { ...book, averageRating: avgRating };
      }));
    };

    const [featuredWithRatings, recentWithRatings] = await Promise.all([addRatings(featured), addRatings(recent)]);

    const [bookGenres, storyGenres] = await Promise.all([
      prisma.book.groupBy({ by: ['genre'], _count: { genre: true } }),
      prisma.story.groupBy({ by: ['genre'], _count: { genre: true } })
    ]);

    const genreMap = new Map<string, number>();
    
    const addGenres = (genres: { genre: string | null, _count: { genre: number } }[]) => {
      genres.forEach(g => {
        if (!g.genre) return;
        const parts = g.genre.split(',').map((p: string) => p.trim()).filter(Boolean);
        parts.forEach((p: string) => {
          // Capitalize first letter for consistency
          const normalized = p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
          genreMap.set(normalized, (genreMap.get(normalized) || 0) + g._count.genre);
        });
      });
    };

    addGenres(bookGenres);
    addGenres(storyGenres);

    const storyGenresList = [
      "Action", "Adventure", "Comedy", "Contemporary", "Drama", "Dystopian", "Fantasy", "Fiction", 
      "Historical", "Horror", "Mystery", "Paranormal", "Poetry", "Romance", "Science Fiction", "Slice of Life", "Supernatural", "Thriller"
    ];

    const topGenres = storyGenresList.map(genre => {
      return [genre, genreMap.get(genre) || 0] as [string, number];
    });

    const categoriesWithCounts = topGenres.map(([name, count], index) => {
      return {
        name,
        count: count >= 1000 ? (count / 1000).toFixed(1).replace(/\.0$/, "") + 'K+' : count.toString(),
      };
    });

    const formattedStories = stories.map(story => {
      const storyPromos = activePromotions.filter((ap: { storyId: string; tier: string }) => ap.storyId === story.id);
      const hasTrending = storyPromos.some(p => p.tier === 'TRENDING');
      const hasPromoted = storyPromos.some(p => p.tier === 'PROMOTED');
      const hasFeatured = storyPromos.some(p => p.tier === 'FEATURED');

      return {
        ...story,
        createdAt: story.createdAt.toISOString(),
        isTrendingPromo: hasTrending,
        isPromotedPromo: !hasTrending && hasPromoted,
        isFeaturedPromo: !hasTrending && !hasPromoted && hasFeatured
      };
    });

    // Deduplicate and sort promoted stories by budget (cost) and quality criteria
    const uniquePromotedMap = new Map();
    promotedStories.forEach((p) => {
      const story = p.story;
      const reactions = story._count.reactions || 0;
      const comments = story._count.comments || 0;
      const inlineComments = story._count.inlineComments || 0;
      const shares = story._count.shareActivities || 0;
      const qualityScore = reactions + comments + inlineComments + shares;

      if (!uniquePromotedMap.has(story.id)) {
        uniquePromotedMap.set(story.id, {
          ...story,
          createdAt: story.createdAt.toISOString(),
          cost: p.cost,
          startDate: p.startDate,
          qualityScore,
          tiers: new Set([p.tier])
        });
      } else {
        const existing = uniquePromotedMap.get(story.id);
        existing.tiers.add(p.tier);
        if (p.cost > existing.cost) existing.cost = p.cost;
      }
    });

    const formattedPromotedStories = Array.from(uniquePromotedMap.values())
      .sort((a: any, b: any) => {
        if (b.cost !== a.cost) return b.cost - a.cost;
        if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
        if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      })
      .slice(0, 8)
      .map((story) => {
        const hasTrending = story.tiers.has('TRENDING');
        const hasPromoted = story.tiers.has('PROMOTED');
        const hasFeatured = story.tiers.has('FEATURED');
        const { tiers, ...rest } = story;

        return {
          ...rest,
          isTrendingPromo: hasTrending,
          isPromotedPromo: !hasTrending && hasPromoted,
          isFeaturedPromo: !hasTrending && !hasPromoted && hasFeatured
        };
      });

    return (
      <main className="relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
        <HeroSection topUsers={topUsers} totalUsers={totalUsers} />

        {/* Library Stats */}
        <section className="px-6 -mt-8 relative z-20">
          <div className="max-w-4xl mx-auto">
            <AnimatedStats stats={[
              { label: 'Books', value: totalBooks },
              { label: 'Stories', value: totalStories },
              { label: 'Readers', value: totalUsers },
              { label: 'Minutes Read', value: totalReadTime }
            ]} />
          </div>
        </section>

        {/* Quick Genre Filter */}
        <section className="px-6 mt-12 mb-8 w-full max-w-7xl mx-auto relative z-20">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mask-edges">
            <Link 
              href="/stories"
              className="whitespace-nowrap px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md"
            >
              All
            </Link>
            {topGenres.map(([name]) => (
              <Link 
                key={name}
                href={`/stories?genre=${encodeURIComponent(name)}`}
                className="whitespace-nowrap px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm hover:shadow"
              >
                {name}
              </Link>
            ))}
            <Link 
              href="/search"
              className="whitespace-nowrap px-5 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm hover:shadow flex items-center gap-1.5"
            >
              <Search className="w-3 h-3" /> More
            </Link>
          </div>
        </section>

        {/* Featured Books */}
        {featuredWithRatings.length > 0 && (
          <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12 pb-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm">
                    <Award className="w-3 h-3" /> Recommended
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white flex items-center gap-4">
                    Editor&apos;s Choice
                    <span className="hidden md:block h-[2px] w-24 bg-zinc-900 dark:bg-white opacity-10 rounded-full"></span>
                  </h2>
                </div>
                <Link href="/library" className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  Browse All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <BookGrid books={featuredWithRatings} />
            </div>
          </section>
        )}

        {/* Latest Stories */}
        {formattedPromotedStories.length > 0 && (
          <section className="py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12 pb-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm">
                    <Zap className="w-3 h-3" /> Promoted Stories
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white flex items-center gap-4">
                    Spotlight Reads
                    <span className="hidden md:block h-[2px] w-24 bg-zinc-900 dark:bg-white opacity-10 rounded-full"></span>
                  </h2>
                </div>
                <Link href="/stories/promoted" className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  Explore <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <StoryGrid stories={formattedPromotedStories} />
            </div>
          </section>
        )}

        {/* Latest Stories */}
        <section className="py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10">
          <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-12 pb-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm">
                    <Activity className="w-3 h-3" /> Latest Stories
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white flex items-center gap-4">
                    Community Feed
                    <span className="hidden md:block h-[2px] w-24 bg-zinc-900 dark:bg-white opacity-10 rounded-full"></span>
                  </h2>
                </div>
                <Link href="/stories" className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            <StoryGrid stories={formattedStories} />
          </div>
        </section>

        {/* Categories */}
        <section className="py-32 px-6">
          <CategoryGrid categories={categoriesWithCounts} />
        </section>

        {/* Trending & New */}
        <section className="py-32 px-6 border-t border-zinc-50 dark:border-zinc-900">
          <div className="max-w-7xl mx-auto space-y-32">
            <div>
              <div className="flex items-end justify-between mb-12 pb-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-sm bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 shadow-sm">
                    <Globe className="w-3 h-3" /> Explore Universes
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase text-zinc-900 dark:text-white flex items-center gap-4">
                    Explore Worlds
                    <span className="hidden md:block h-[2px] w-24 bg-zinc-900 dark:bg-white opacity-10 rounded-full"></span>
                  </h2>
                </div>
                <Link href="/universes" className="group flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  Browse All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {universes.map((u) => {
                  const totalReads = u.stories.reduce((acc, s) => acc + s.viewCount, 0);
                  return (
                    <Link
                      key={u.id}
                      href={`/universes/${u.id}`}
                      className="group flex flex-col border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all relative overflow-hidden shadow-sm"
                    >
                      {/* Universe Cover */}
                      <div className="h-40 w-full overflow-hidden relative">
                        {u.coverUrl ? (
                          <img
                            src={u.coverUrl}
                            alt=""
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${getUniverseGraphic(u.name)} flex flex-col items-center justify-center p-4 text-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,transparent_60%)] animate-pulse duration-1000" />
                            <Compass className="w-8 h-8 text-white/90 drop-shadow-md mb-1 relative z-10" />
                            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.3em] text-white/80 relative z-10 drop-shadow-sm">
                              {u.genre}
                            </span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-zinc-950 via-transparent to-transparent opacity-60" />
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3 relative z-10 flex-1 flex flex-col">
                        <div className="flex items-center justify-between">
                          <span className="px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[8px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                            {u.genre}
                          </span>
                          <div className="flex items-center gap-1 text-zinc-400 dark:text-zinc-500 text-[8px] font-bold uppercase tracking-widest">
                            <Flame className="w-2.5 h-2.5" />
                            {totalReads} Reads
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xs font-bold mb-1 tracking-tight group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors uppercase line-clamp-1">
                            {u.name}
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                            {u.description || 'No description provided.'}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-zinc-50 dark:border-zinc-900 flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-[7px] font-bold overflow-hidden border border-zinc-100 dark:border-zinc-800">
                              {u.user.avatarUrl ? (
                                <img src={u.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                u.user.username[0].toUpperCase()
                              )}
                            </div>
                            <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[80px]">{u.user.displayName || u.user.username}</span>
                          </div>

                          <div className="flex items-center gap-1 text-[8px] font-bold text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors uppercase tracking-[0.2em]">
                            <BookOpen className="w-3 h-3" />
                            {u._count?.stories || 0} Stories
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            {recentWithRatings.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900 italic">
                  <Clock className="w-4 h-4 text-zinc-200" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">New Arrivals</h2>
                </div>
                <BookGrid books={recentWithRatings} />
              </div>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-32 px-6 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {features.map((f) => (
              <div key={f.title} className="space-y-6">
                <f.icon className="w-5 h-5 text-zinc-700" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{f.title}</h3>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed italic">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us or Newsletter */}
        <section className="py-48 px-6 text-center border-t border-zinc-50 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <div className="max-w-2xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold tracking-tight uppercase">Start Your Journey.</h2>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto font-medium italic leading-relaxed">
              {currentUserId 
                ? "Stay updated with our latest stories, authors, and news. Subscribe to our newsletter."
                : "Join our global community and discover stories that move you."}
            </p>
            <div className="flex items-center justify-center gap-6">
              {currentUserId ? (
                <>
                  <a href="#newsletter" className="px-12 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:opacity-90 shadow-md border border-zinc-900 dark:border-white">Subscribe Now</a>
                  <Link href="/library" className="px-12 py-3.5 border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900">Browse Library</Link>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-12 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:opacity-90 shadow-md border border-zinc-900 dark:border-white">Join Now</Link>
                  <Link href="/library" className="px-12 py-3.5 border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900">Browse Library</Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("HomePage Data Fetching Error:", error);
    // Re-throw so error.tsx boundary handles this with proper offline UI
    // (includes network detection, offline stories link, retry button)
    throw error;
  }
}
