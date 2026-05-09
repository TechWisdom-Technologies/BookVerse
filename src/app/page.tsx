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
  PenTool,
  Award,
  Clock,
  Zap,
  ChevronRight,
  Play,
  Download,
  Bookmark,
} from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";

export const dynamic = "force-dynamic";

// Category data
const categories = [
  { name: "Fiction", count: "2,450+", icon: BookOpen, color: "from-rose-500 to-pink-600" },
  { name: "Mystery", count: "1,200+", icon: Search, color: "from-orange-600 to-orange-700" },
  { name: "Romance", count: "3,100+", icon: Heart, color: "from-rose-400 to-red-500" },
  { name: "Sci-Fi", count: "890+", icon: Sparkles, color: "from-cyan-500 to-blue-600" },
  { name: "Fantasy", count: "1,500+", icon: Star, color: "from-amber-500 to-orange-600" },
  { name: "Biography", count: "760+", icon: Users, color: "from-emerald-500 to-teal-600" },
];

// Testimonials data
const testimonials = [
  { name: "Sarah Mitchell", role: "Avid Reader", quote: "BookVerse transformed my reading habits. I've discovered so many amazing authors!", avatar: "SM" },
  { name: "James Chen", role: "Book Club Leader", quote: "The community features are incredible. Our book club has grown exponentially.", avatar: "JC" },
  { name: "Emily Rodriguez", role: "Aspiring Writer", quote: "As an author, this platform helped me reach readers I never thought possible.", avatar: "ER" },
];

// Features data
const features = [
  { icon: Library, title: "Vast Library", desc: "Access 10,000+ books across all genres" },
  { icon: Download, title: "Offline Reading", desc: "Download books to read anywhere" },
  { icon: Bookmark, title: "Smart Lists", desc: "Organize your reading journey" },
  { icon: Zap, title: "Lightning Fast", desc: "Instant book access, no waiting" },
];

export default async function HomePage() {
  try {
    // Fetch books data
    const [featured, recent, trending] = await Promise.all([
      prisma.book.findMany({
        take: 6,
        orderBy: { downloadCount: "desc" },
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
      }),
      prisma.book.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
      }),
      prisma.book.findMany({
        take: 4,
        orderBy: { createdAt: "desc" },
        where: { downloadCount: { gte: 100 } },
        select: {
          id: true,
          title: true,
          authorName: true,
          coverUrl: true,
          genre: true,
          downloadCount: true,
          _count: { select: { reviews: true } },
        },
      }),
    ]);

    // Calculate ratings
    const addRatings = async <T extends Pick<Book, "id">>(books: T[]) => {
      return Promise.all(
        books.map(async (book) => {
          const reviews = await prisma.bookReview.findMany({
            where: { bookId: book.id },
            select: { rating: true },
          });
          const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
          return { ...book, averageRating: avgRating };
        })
      );
    };

    const [featuredWithRatings, recentWithRatings, trendingWithRatings] = await Promise.all([
      addRatings(featured),
      addRatings(recent),
      addRatings(trending),
    ]);

    return (
      <main className="overflow-x-hidden bg-[#FDFDFC] dark:bg-[#0A0A0A]">
        {/* SECTION 1: Hero - Premium Animated Design */}
        <HeroSection />

        {/* SECTION 2: Stats Bar */}
        <section className="relative z-20 px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-200 dark:divide-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200 dark:border-white/10 py-6">
              <div className="text-center px-4">
                <div className="text-3xl font-black text-zinc-900 dark:text-white">10K+</div>
                <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">Stories</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-brand">500+</div>
                <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">Authors</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-orange-500">50K+</div>
                <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">Readers</div>
              </div>
              <div className="text-center px-4">
                <div className="text-3xl font-black text-violet-500">1M+</div>
                <div className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-widest">Reads</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: Featured Books */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-brand/10 text-brand text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
                  <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Editor&apos;s Choice</span>
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">Featured Masterpieces.</h2>
                <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-zinc-500 font-medium">Handpicked stories that have captivated thousands of readers. Discover your next obsession.</p>
              </div>
              <Link
                href="/library"
                className="group inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-bold text-lg hover:bg-brand hover:text-white hover:scale-105 hover:shadow-xl hover:shadow-brand/20 transition-all duration-300"
              >
                Explore All <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <BookGrid books={featuredWithRatings} />
          </div>
        </section>

        {/* SECTION 4: Categories (Bento Grid Style) */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-zinc-900/30 border-y border-zinc-200/50 dark:border-zinc-800/50 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 sm:w-96 h-64 sm:h-96 bg-brand/5 rounded-full blur-[64px] sm:blur-[100px]" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 sm:w-96 h-64 sm:h-96 bg-violet-500/5 rounded-full blur-[64px] sm:blur-[100px]" />
          
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 sm:mb-6">Explore by Genre.</h2>
              <p className="text-lg sm:text-xl font-medium text-zinc-500 max-w-2xl mx-auto">Find your perfect read from our carefully curated collection of genres, tailored to every mood and moment.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/library?genre=${cat.name}`}
                  className="group relative overflow-hidden rounded-[2rem] p-6 sm:p-8 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 hover:border-brand dark:hover:border-brand shadow-xl shadow-zinc-200/20 dark:shadow-none hover:-translate-y-2 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                      <cat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-300 dark:text-zinc-700 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-brand transition-all duration-500" />
                  </div>
                  
                  <div className="mt-8 sm:mt-12 relative z-10">
                    <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-2 sm:mb-3">{cat.name}</h3>
                    <div className="inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm font-bold tracking-wide text-zinc-600 dark:text-zinc-300 uppercase">
                      {cat.count} stories
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 & 6: Trending & New Arrivals */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative">
          <div className="mx-auto max-w-7xl space-y-24 sm:space-y-40">
            {/* Trending */}
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Rising Fast</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">Trending Now.</h2>
                </div>
              </div>
              <BookGrid books={trendingWithRatings} />
            </div>

            {/* New Arrivals */}
            <div>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Just Published</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight">New Arrivals.</h2>
                </div>
                <Link
                  href="/library?sort=newest"
                  className="group inline-flex items-center justify-center w-full md:w-auto gap-2 text-zinc-500 dark:text-zinc-400 font-bold hover:text-brand dark:hover:text-brand transition-colors text-base sm:text-lg bg-zinc-100 md:bg-transparent dark:bg-zinc-900 md:dark:bg-transparent py-3 md:py-0 rounded-full md:rounded-none"
                >
                  View All <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <BookGrid books={recentWithRatings} />
            </div>
          </div>
        </section>

        {/* SECTION 7: Features */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-zinc-950 text-white relative overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] mx-4 sm:mx-8 mb-20 sm:mb-32 shadow-2xl shadow-zinc-900/50">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand via-zinc-900 to-black pointer-events-none" />
          
          <div className="mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-16 sm:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-6 sm:mb-8">Why Readers Love Us.</h2>
              <p className="text-xl sm:text-2xl text-zinc-400 max-w-3xl mx-auto font-medium">Everything you need for the perfect reading experience, engineered to perfection.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="group relative p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-500">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-brand to-orange-500 flex items-center justify-center text-white mb-8 sm:mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-brand/20">
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">{feature.title}</h3>
                  <p className="text-zinc-400 text-base sm:text-lg leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8: Testimonials */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative mb-16 sm:mb-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 sm:mb-24">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-zinc-900 dark:text-white tracking-tight mb-4 sm:mb-6">Community Voices.</h2>
              <p className="text-lg sm:text-xl text-zinc-500 font-medium">Join thousands of satisfied book lovers</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="p-8 sm:p-10 rounded-[2rem] sm:rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 shadow-xl sm:shadow-2xl shadow-zinc-200/30 dark:shadow-none hover:-translate-y-2 sm:hover:-translate-y-4 transition-transform duration-500">
                  <div className="flex items-center gap-1 sm:gap-1.5 mb-6 sm:mb-8">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-lg sm:text-xl text-zinc-700 dark:text-zinc-300 mb-8 sm:mb-10 font-medium leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-4 sm:gap-5 border-t border-zinc-100 dark:border-zinc-800 pt-6 sm:pt-8">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-brand to-orange-600 flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9: CTA - Join Community */}
        <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 mb-20 sm:mb-32">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-[2.5rem] sm:rounded-[4rem] bg-gradient-to-br from-brand to-orange-600 p-8 sm:p-16 md:p-24 text-center shadow-2xl shadow-brand/30">
              {/* Animated mesh gradient background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-[96px] sm:blur-[128px]" />
                <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-black rounded-full blur-[96px] sm:blur-[128px]" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center mb-8 sm:mb-10 shadow-2xl">
                  <PenTool className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                </div>
                <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight mb-6 sm:mb-8">Ready to Start Reading?</h2>
                <p className="text-lg sm:text-2xl text-white/90 font-medium mb-10 sm:mb-16 max-w-3xl">
                  Join our community of book lovers and discover stories that will stay with you forever.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-brand rounded-full font-black text-lg sm:text-xl hover:scale-105 transition-all duration-300 shadow-xl"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    href="/library"
                    className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-transparent text-white border-2 sm:border-4 border-white/30 rounded-full font-black text-lg sm:text-xl hover:bg-white/10 transition-all duration-300"
                  >
                    Browse Library
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error("HomePage error:", error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500">Unable to load content</p>
        </div>
      </main>
    );
  }
}
