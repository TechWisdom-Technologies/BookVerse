import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookGrid } from "@/components/books/BookGrid";
import type { Book } from "@prisma/client";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

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
import { HomeSearchBar } from "@/components/home/HomeSearchBar";

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
    const [featured, recent, universes, stories, promotedStories, activePromotions] = await Promise.all([
      prisma.book.findMany({ take: 8, orderBy: { downloadCount: "desc" }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
      prisma.book.findMany({ take: 8, orderBy: { createdAt: "desc" }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
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
      prisma.story.findMany({ take: 8, where: { published: true }, orderBy: { viewCount: "desc" }, select: { id: true, title: true, coverUrl: true, summary: true, viewCount: true, createdAt: true, author: { select: { id: true, username: true, displayName: true, avatarUrl: true } }, _count: { select: { chapters: true, reactions: true, comments: true } } } }),
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

    const addRatings = async <T extends Pick<Book, "id">>(books: T[]) => {
      return Promise.all(books.map(async (book) => {
        const reviews = await prisma.bookReview.findMany({ where: { bookId: book.id }, select: { rating: true } });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return { ...book, averageRating: avgRating };
      }));
    };

    const [featuredWithRatings, recentWithRatings] = await Promise.all([addRatings(featured), addRatings(recent)]);
    
    const categoriesWithCounts = await Promise.all(
      categoriesBase.map(async (cat) => {
        const [bookCount, storyCount] = await Promise.all([
          prisma.book.count({ where: { genre: { contains: cat.name, mode: 'insensitive' } } }),
          prisma.story.count({ where: { genre: { contains: cat.name, mode: 'insensitive' } } })
        ]);
        const total = bookCount + storyCount;
        return {
          ...cat,
          count: total > 1000 ? (total / 1000).toFixed(1) + 'K' : total.toString(),
        };
      })
    );
    
    const formattedStories = stories.map(story => {
      const activePromo = activePromotions.find((ap: { storyId: string; tier: string }) => ap.storyId === story.id);
      return {
        ...story,
        createdAt: story.createdAt.toISOString(),
        isTrendingPromo: activePromo?.tier === 'TRENDING',
        isPromotedPromo: activePromo?.tier === 'PROMOTED',
        isFeaturedPromo: activePromo?.tier === 'FEATURED'
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
          isPromotedPromo: true
        });
      }
    });

    const formattedPromotedStories = Array.from(uniquePromotedMap.values())
      .sort((a: any, b: any) => {
        // 1. Budget (cost) descending
        if (b.cost !== a.cost) return b.cost - a.cost;
        // 2. Quality score descending
        if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
        // 3. Oldest promotion first (startDate ascending)
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      })
      .slice(0, 8);

    return (
      <main className="relative overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
        <HomeSearchBar />
        <HeroSection />

        {/* Library Stats */}
        <section className="px-6 -mt-8 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-4 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded py-6 shadow-sm">
              {[
                { label: 'Books', val: '10K+' },
                { label: 'Authors', val: '500+' },
                { label: 'Readers', val: '50K+' },
                { label: 'Downloads', val: '1M+' }
              ].map((s, i) => (
                <div key={i} className="text-center border-r last:border-0 border-zinc-50 dark:border-zinc-900">
                  <div className="text-xl font-bold tracking-tighter">{s.val}</div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Books */}
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-12 pb-6 border-b border-zinc-50 dark:border-zinc-900">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                  <Award className="w-4 h-4" /> Recommended
                </div>
                <h2 className="text-xl font-bold tracking-tight uppercase">Editor&apos;s Choice.</h2>
              </div>
              <Link href="/library" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:underline underline-offset-8 transition-all flex items-center gap-2">
                Browse All <ArrowRight className="w-4 h-4 text-zinc-300" />
              </Link>
            </div>
            <BookGrid books={featuredWithRatings} />
          </div>
        </section>

        {/* Latest Stories */}
        {formattedPromotedStories.length > 0 && (
          <section className="py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-end justify-between mb-16">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                    <Zap className="w-4 h-4" /> Promoted Stories
                  </div>
                  <h2 className="text-xl font-bold tracking-tight uppercase">Spotlight Reads.</h2>
                </div>
                <Link href="/stories/promoted" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all underline-offset-8 hover:underline">
                  Explore More
                </Link>
              </div>
              <StoryGrid stories={formattedPromotedStories} />
            </div>
          </section>
        )}

        {/* Latest Stories */}
        <section className="py-32 px-6 border-y border-zinc-50 dark:border-zinc-900 bg-zinc-50/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300">
                  <Activity className="w-4 h-4" /> Latest Stories
                </div>
                <h2 className="text-xl font-bold tracking-tight uppercase">Community Feed.</h2>
              </div>
              <Link href="/stories" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all underline-offset-8 hover:underline">
                View Stories
              </Link>
            </div>
            <StoryGrid stories={formattedStories} />
          </div>
        </section>

        {/* Categories */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-16 justify-center">
              <Compass className="w-4 h-4 text-zinc-200" />
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-300">Browse by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 shadow-sm">
              {categoriesWithCounts.map((cat) => (
                <Link key={cat.name} href={`/library?genre=${cat.name}`} className="p-10 bg-white dark:bg-zinc-950 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all text-center group">
                  <cat.icon className={`w-5 h-5 mx-auto mb-6 opacity-20 group-hover:opacity-100 transition-all duration-500`} />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{cat.name}</h3>
                  <p className="text-[9px] font-bold text-zinc-200 dark:text-zinc-800 font-mono italic">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending & New */}
        <section className="py-32 px-6 border-t border-zinc-50 dark:border-zinc-900">
          <div className="max-w-7xl mx-auto space-y-32">
            <div>
              <div className="flex items-end justify-between mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900">
                <div className="flex items-center gap-2 italic">
                  <Globe className="w-4 h-4 text-zinc-300" />
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Explore Worlds</h2>
                </div>
                <Link href="/universes" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-900 dark:text-white hover:underline underline-offset-8 transition-all flex items-center gap-2">
                  Browse Universes <ArrowRight className="w-4 h-4 text-zinc-300" />
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
            <div>
              <div className="flex items-center gap-2 mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900 italic">
                <Clock className="w-4 h-4 text-zinc-200" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">New Arrivals</h2>
              </div>
              <BookGrid books={recentWithRatings} />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-32 px-6 bg-zinc-950 text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-16">
            {features.map((f) => (
              <div key={f.title} className="space-y-6">
                <f.icon className="w-5 h-5 text-zinc-700" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">{f.title}</h3>
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed italic">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join Us */}
        <section className="py-48 px-6 text-center border-t border-zinc-50 dark:border-zinc-900 bg-white dark:bg-zinc-950">
          <div className="max-w-2xl mx-auto space-y-12">
            <h2 className="text-3xl font-bold tracking-tight uppercase">Start Your Journey.</h2>
            <p className="text-[11px] text-zinc-400 max-w-sm mx-auto font-medium italic leading-relaxed">Join our global community and discover stories that move you.</p>
            <div className="flex items-center justify-center gap-6">
              <Link href="/signup" className="px-12 py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:opacity-90 shadow-md border border-zinc-900 dark:border-white">Join Now</Link>
              <Link href="/library" className="px-12 py-3.5 border border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-100 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900">Browse Library</Link>
            </div>
          </div>
        </section>
      </main>
    );
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 animate-pulse italic">Platform Offline</p>
      </main>
    );
  }
}
