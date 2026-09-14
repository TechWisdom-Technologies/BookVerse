const fs = require('fs');
const file = 'd:/Running works/Book v1.3.1/bookverse/src/app/author/analytics/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const startMark = '{/* ========================================== */}\\n        {/* NEW FEATURE: Promotion Analytics Engine */}';
const endMark = '{/* Top Performers List */}';

const startIndex = content.indexOf('{/* ========================================== */}');
let blockStart = content.indexOf('{/* NEW FEATURE: Promotion Analytics Engine */}', startIndex);
if(blockStart === -1) blockStart = startIndex; // fallback
else blockStart = startIndex;

const endIdx = content.indexOf(endMark);

const replacement = \        {/* ========================================== */}
        {/* Promotion Campaign Analytics */}
        {/* ========================================== */}
        {promotionAnalytics && promotionAnalytics.length > 0 && (
          <section className="mb-16 animate-fade-in">
            <div className="flex items-center gap-2 mb-8 pb-2 border-b border-zinc-100 dark:border-zinc-900">
              <TrendingUp className="w-4 h-4 text-zinc-400" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Promotion Campaign Analytics</h2>
            </div>

            {/* Summary Stats Grid — matches Global Stats pattern */}
            {(() => {
              const totalSpent = promotionAnalytics.reduce((s, p) => s + p.cost, 0);
              const totalPromoViews = promotionAnalytics.reduce((s, p) => s + p.promotionViews, 0);
              const totalPromoEngagements = promotionAnalytics.reduce((s, p) => s + p.totalEngagements, 0);
              const totalFollowersGained = promotionAnalytics.reduce((s, p) => s + p.followersGained, 0);
              const totalTipsEarned = promotionAnalytics.reduce((s, p) => s + p.tipsEarned, 0);
              const totalReadMin = promotionAnalytics.reduce((s, p) => s + p.totalReadingMinutes, 0);
              const avgCpv = totalPromoViews > 0 ? (totalSpent / totalPromoViews).toFixed(2) : '0.00';
              return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 rounded-3xl overflow-hidden mb-8 shadow-sm">
                  {[
                    { label: 'Total Ad Spend', value: \\\?\\\\ },
                    { label: 'Promotion Views', value: totalPromoViews.toLocaleString() },
                    { label: 'Total Engagements', value: totalPromoEngagements.toLocaleString() },
                    { label: 'Avg Cost Per View', value: \\\?\\\\ },
                  ].map((s, i) => (
                    <div key={i} className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between min-h-[140px]">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">{s.label}</span>
                      <div className="text-2xl font-black tracking-tight">{s.value}</div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Individual Campaign Deep-Dive — matches Cohort Retention pattern */}
            <div className="p-8 border border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-950 rounded-3xl shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/40">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Campaign Deep-Dive</h3>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={selectedPromotion}
                    onChange={(e) => setSelectedPromotion(e.target.value)}
                    className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-[10px] font-bold uppercase px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[250px]"
                  >
                    {promotionAnalytics.map((promo) => (
                      <option key={promo.id} value={promo.id}>
                        {promo.storyTitle} ({new Date(promo.startDate).toLocaleDateString()})
                      </option>
                    ))}
                  </select>
                  <span className="text-[9px] font-black tracking-wider text-indigo-500 font-mono">{promotionAnalytics.length} Campaign{promotionAnalytics.length > 1 ? 's' : ''}</span>
                </div>
              </div>

              {promotionAnalytics.filter(p => p.id === selectedPromotion).map((promo) => {
                const isEnded = new Date(promo.endDate) < new Date() || promo.status === 'ENDED';
                const isActive = promo.status === 'ACTIVE' && !isEnded;
                const isPending = promo.status === 'PENDING';
                const displayStatus = isEnded ? 'ENDED' : promo.status;
                const totalReactionCount = promo.positiveReactions + promo.negativeReactions;
                const negativePercent = totalReactionCount > 0 ? parseFloat((100 - promo.sentimentScore).toFixed(1)) : 0;

                return (
                  <div key={promo.id} className="space-y-6">

                    {/* Campaign Identity Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className={\\\	ext-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md \\\\}>{promo.tier}</span>
                        <h4 className="text-sm font-bold truncate text-zinc-900 dark:text-white max-w-xs" title={promo.storyTitle}>{promo.storyTitle}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
                          {new Date(promo.startDate).toLocaleDateString()} — {new Date(promo.endDate).toLocaleDateString()} ({promo.campaignDays}d)
                        </span>
                        <span className={\\\	ext-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md \\\\}>{displayStatus}</span>
                        <span className={\\\	ext-[9px] font-black uppercase tracking-widest \\\\}>ROI: {promo.roiRating}</span>
                      </div>
                    </div>

                    {/* Primary Metrics — 4-column grid matching cost cards pattern */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Campaign Cost</span>
                        <span className="text-xl font-black font-mono">?{promo.cost.toLocaleString()}</span>
                      </div>
                      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Views Generated</span>
                        <span className="text-xl font-black font-mono">{promo.promotionViews.toLocaleString()}</span>
                      </div>
                      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Cost Per View</span>
                        <span className={\\\	ext-xl font-black font-mono \\\\}>
                          ?{promo.costPerView}
                        </span>
                      </div>
                      <div className="p-4 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl">
                        <span className="block text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Cost Per Engagement</span>
                        <span className={\\\	ext-xl font-black font-mono \\\\}>
                          ?{promo.costPerEngagement}
                        </span>
                      </div>
                    </div>

                    {/* Engagement & Conversion Metrics — 2-column card layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                      {/* Left: Engagement Breakdown */}
                      <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl space-y-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Engagement Breakdown</span>
                        <div className="space-y-3">
                          {[
                            { label: 'Daily Velocity', value: \\\\\\\, unit: 'engagements/day', color: promo.dailyEngagementVelocity > 5 ? 'text-emerald-500' : promo.dailyEngagementVelocity > 0 ? 'text-amber-500' : 'text-zinc-400' },
                            { label: 'Interaction Rate', value: \\\\%\\\, unit: 'of viewers engaged', color: promo.interactionRate > 5 ? 'text-emerald-500' : promo.interactionRate > 0 ? 'text-indigo-500' : 'text-zinc-400' },
                            { label: 'Reactions', value: \\\\\\\, unit: 'during campaign', color: promo.reactionsGenerated > 0 ? 'text-indigo-500' : 'text-zinc-400' },
                            { label: 'Comments', value: \\\\\\\, unit: 'during campaign', color: promo.commentsGenerated > 0 ? 'text-indigo-500' : 'text-zinc-400' },
                            { label: 'Inline Comments', value: \\\\\\\, unit: 'deep engagement', color: promo.inlineCommentsCount > 0 ? 'text-emerald-500' : 'text-zinc-400' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900/10 last:border-0">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">{item.label}</span>
                                <span className="text-[7px] text-zinc-400 font-medium">{item.unit}</span>
                              </div>
                              <span className={\\\	ext-sm font-black font-mono \\\\}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Growth & Retention */}
                      <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl space-y-4">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 block">Growth & Retention</span>
                        <div className="space-y-3">
                          {[
                            { label: 'Followers Gained', value: \\\+\\\\, unit: 'during campaign period', color: promo.followersGained > 0 ? 'text-emerald-500' : 'text-zinc-400' },
                            { label: 'Tips Earned', value: \\\?\\\\, unit: \\\\ tip\\\\, color: promo.tipsEarned > 0 ? 'text-amber-500' : 'text-zinc-400' },
                            { label: 'Library Saves', value: \\\\\\\, unit: 'readers saved to shelf', color: promo.librarySaves > 0 ? 'text-indigo-500' : 'text-zinc-400' },
                            { label: 'Reach Expansion', value: \\\\\\\, unit: 'shares logged', color: promo.promoShares > 0 ? 'text-indigo-500' : 'text-zinc-400' },
                            { label: 'Reading Time', value: \\\\ min\\\, unit: \\\?\/min attention cost\\\, color: promo.totalReadingMinutes > 0 ? 'text-emerald-500' : 'text-zinc-400' },
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-900/10 last:border-0">
                              <div>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">{item.label}</span>
                                <span className="text-[7px] text-zinc-400 font-medium">{item.unit}</span>
                              </div>
                              <span className={\\\	ext-sm font-black font-mono \\\\}>{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Sentiment Conversion Bar */}
                    <div className="p-5 bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Campaign Sentiment</span>
                        {totalReactionCount > 0 ? (
                          <span className="text-[9px] font-black font-mono">
                            <span className="text-emerald-500">{promo.sentimentScore}% Positive</span>
                            <span className="text-zinc-300 dark:text-zinc-700 mx-1.5">·</span>
                            <span className="text-rose-400">{negativePercent}% Negative</span>
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-zinc-400 italic">No reactions recorded during campaign</span>
                        )}
                      </div>
                      {totalReactionCount > 0 && (
                        <>
                          <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
                            <div className="h-full bg-emerald-500 rounded-l-full transition-all duration-500" style={{ width: \\\\%\\\ }} />
                            <div className="h-full bg-rose-400 rounded-r-full transition-all duration-500" style={{ width: \\\\%\\\ }} />
                          </div>
                          <div className="flex justify-between text-[7px] font-bold uppercase tracking-widest text-zinc-400">
                            <span>?? {promo.positiveReactions} positive</span>
                            <span>?? {promo.negativeReactions} negative</span>
                          </div>
                        </>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </section>
        )}
;

content = content.substring(0, blockStart) + replacement + content.substring(endIdx);
fs.writeFileSync(file, content, 'utf8');
console.log('Success');
