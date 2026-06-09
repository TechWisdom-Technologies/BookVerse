import Link from "next/link";
import { ArrowLeft, Megaphone, Sparkles, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StoryGrid } from "@/components/stories/StoryGrid";

export const dynamic = "force-dynamic";

export default async function PromotedStoriesPage() {
  try {
    const promotions = await prisma.storyPromotion.findMany({
      where: {
        tier: "PROMOTED",
        status: "ACTIVE",
        endDate: { gt: new Date() },
        story: { published: true }
      },
      include: {
        story: {
          include: {
            author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
            _count: {
              select: {
                chapters: true,
                reactions: true,
                comments: true,
                inlineComments: true,
                shareActivities: true
              }
            }
          }
        }
      }
    });

    const uniquePromotedMap = new Map();
    promotions.forEach((p) => {
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
        // keep the highest cost
        if (p.cost > existing.cost) existing.cost = p.cost;
      }
    });

    const sortedStories = Array.from(uniquePromotedMap.values())
      .sort((a, b) => {
        if (b.cost !== a.cost) return b.cost - a.cost;
        if (b.viewCount !== a.viewCount) return b.viewCount - a.viewCount;
        if (b.qualityScore !== a.qualityScore) return b.qualityScore - a.qualityScore;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      });

    const serializedStories = sortedStories.map((story) => {
      return {
        ...story,
        isTrendingPromo: false,
        isPromotedPromo: true,
        isFeaturedPromo: false
      };
    });

    return (
      <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          {/* Simple Header */}
          <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="space-y-4 relative z-10">
              <Link href="/stories" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-3 h-3" />
                Community Stories
              </Link>
              <div>
                <h1 className="text-2xl font-black tracking-tight mb-1 uppercase flex items-center gap-2">
                  Spotlight Reads <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                </h1>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Premium promoted stories spotlighted by their authors on BookVerse.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded-xl relative z-10">
              <Megaphone className="w-3.5 h-3.5 text-indigo-500" />
              Spotlight active
            </div>
          </header>

          {serializedStories.length === 0 ? (
            <div className="text-center py-32 border border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl bg-zinc-50/5">
              <Trophy className="w-12 h-12 text-zinc-300 dark:text-zinc-800 mx-auto mb-4" />
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-400">No Spotlight Stories Active</h2>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-2 leading-relaxed font-sans">Promote your stories using customizable budgets to spotlight them in this high-velocity showcase section!</p>
            </div>
          ) : (
            <div className="min-h-[400px]">
              <StoryGrid stories={serializedStories} />
            </div>
          )}

        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching spotlight reads:', error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 animate-pulse italic">Spotlight Offline</p>
      </main>
    );
  }
}
