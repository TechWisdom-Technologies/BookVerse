import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookGrid } from "@/components/books/BookGrid";
import type { Book } from "@prisma/client";
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
  Compass
} from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { StoryGrid } from "@/components/stories/StoryGrid";

export const dynamic = "force-dynamic";

const categories = [
  { name: "Fiction", count: "2.4K", icon: BookOpen, color: "text-zinc-400" },
  { name: "Mystery", count: "1.2K", icon: Search, color: "text-zinc-400" },
  { name: "Romance", count: "3.1K", icon: Heart, color: "text-zinc-400" },
  { name: "Sci-Fi", count: "0.8K", icon: Sparkles, color: "text-zinc-400" },
  { name: "Fantasy", count: "1.5K", icon: Star, color: "text-zinc-400" },
  { name: "Biography", count: "0.7K", icon: Users, color: "text-zinc-400" },
];

const features = [
  { icon: Library, title: "Archive", desc: "Access 10,000+ volumes instantly." },
  { icon: Download, title: "Offline", desc: "Read your favorite stories anywhere." },
  { icon: Bookmark, title: "Library", desc: "Track your reading progress easily." },
  { icon: Zap, title: "Speed", desc: "Lightning fast reading experience." },
];

export default async function HomePage() {
  try {
    const [featured, recent, trending, stories, promotedStories] = await Promise.all([
      prisma.book.findMany({ take: 6, orderBy: { downloadCount: "desc" }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
      prisma.book.findMany({ take: 6, orderBy: { createdAt: "desc" }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
      prisma.book.findMany({ take: 4, orderBy: { createdAt: "desc" }, where: { downloadCount: { gte: 100 } }, select: { id: true, title: true, authorName: true, coverUrl: true, genre: true, downloadCount: true, _count: { select: { reviews: true } } } }),
      prisma.story.findMany({ take: 8, where: { published: true }, orderBy: { viewCount: "desc" }, select: { id: true, title: true, coverUrl: true, summary: true, viewCount: true, createdAt: true, author: { select: { id: true, username: true, displayName: true, avatarUrl: true } }, _count: { select: { chapters: true, reactions: true, comments: true } } } }),
      prisma.storyPromotion.findMany({
        take: 8,
        where: {
          status: "ACTIVE",
          endDate: { gt: new Date() },
          story: { published: true },
        },
        orderBy: [{ tier: "desc" }, { endDate: "asc" }],
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
              _count: { select: { chapters: true, reactions: true, comments: true } },
            },
          },
        },
      }),
    ]);

    const addRatings = async <T extends Pick<Book, "id">>(books: T[]) => {
      return Promise.all(books.map(async (book) => {
        const reviews = await prisma.bookReview.findMany({ where: { bookId: book.id }, select: { rating: true } });
        const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
        return { ...book, averageRating: avgRating };
      }));
    };

    const [featuredWithRatings, recentWithRatings, trendingWithRatings] = await Promise.all([addRatings(featured), addRatings(recent), addRatings(trending)]);
    const formattedStories = stories.map(story => ({ ...story, createdAt: story.createdAt.toISOString() }));
    const formattedPromotedStories = promotedStories.map(({ story }) => ({ ...story, createdAt: story.createdAt.toISOString() }));

    return (
      <main className="overflow-x-hidden bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
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
                <Link href="/stories" className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all underline-offset-8 hover:underline">
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
              {categories.map((cat) => (
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
              <div className="flex items-center gap-2 mb-10 pb-4 border-b border-zinc-50 dark:border-zinc-900 italic">
                <TrendingUp className="w-4 h-4 text-zinc-200" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Trending Books</h2>
              </div>
              <BookGrid books={trendingWithRatings} />
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
