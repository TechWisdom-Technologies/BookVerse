'use client';

import { Zap } from 'lucide-react';

export function PromotionBadge({ tier, endDate }: { tier: string; endDate: string }) {
  const tierColors: Record<string, string> = {
    FEATURED: 'from-blue-400 to-blue-600',
    PROMOTED: 'from-purple-400 to-purple-600',
    TRENDING: 'from-orange-400 to-orange-600',
  };

  const daysLeft = Math.ceil(
    (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`bg-gradient-to-r ${tierColors[tier]} text-white px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold`}>
      <Zap className="w-3 h-3" />
      <span>{tier}</span>
      {daysLeft > 0 && <span className="ml-1">({daysLeft}d left)</span>}
    </div>
  );
}
