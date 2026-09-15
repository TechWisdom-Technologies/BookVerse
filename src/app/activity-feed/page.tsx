'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  BookOpen,
  Award,
  Heart,
  Loader2,
  ArrowLeft,
  Clock,
  Filter,
  Search,
  X,
  ChevronDown,
  Tag,
  Calendar,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'story_published' | 'achievement_earned' | 'tip_received';
  timestamp: string;
  actor: {
    id: string;
    username: string;
    displayName?: string;
    avatarUrl?: string;
  };
  content: any;
  description: string;
}

// ── Filter types ──
type TypeFilter = 'all' | 'story_published' | 'achievement_earned' | 'tip_received';
type DateFilter = 'all' | 'today' | 'week' | 'month';

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'story_published', label: 'Stories' },
  { value: 'achievement_earned', label: 'Achievements' },
  { value: 'tip_received', label: 'Tips' },
];

const DATE_OPTIONS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

// ── Dropdown component ──
function FilterDropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  options: { value: string; label: string }[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest rounded border transition-all ${
          value !== 'all'
            ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white'
            : 'bg-white dark:bg-zinc-950 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600'
        }`}
      >
        <Icon className="w-3 h-3" />
        {selected?.label || label}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 min-w-[180px] bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded shadow-xl z-50">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                value === opt.value
                  ? 'text-zinc-900 dark:text-white bg-zinc-50 dark:bg-zinc-900'
                  : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Truncate text helper ──
function truncateText(text: string, maxLength: number) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export default function ActivityFeedPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login?redirect=/activity-feed'); return; }
    const fetchFeed = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/activity-feed');
        if (res.ok) {
          const data = await res.json();
          setActivities(data.activities);
          if (typeof window !== 'undefined') {
            localStorage.setItem('lastVisitedFeedAt', new Date().toISOString());
            window.dispatchEvent(new Event('feed-visited'));
          }
        }
      } finally { setLoading(false); }
    };
    fetchFeed();
  }, [user, authLoading, router]);

  // Client-side filtering
  const filteredActivities = useMemo(() => {
    let result = activities;

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter((a) => a.type === typeFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      let dateFrom: Date;
      switch (dateFilter) {
        case 'today':
          dateFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          dateFrom = new Date(0);
      }
      result = result.filter((a) => new Date(a.timestamp) >= dateFrom);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        const actorName = (a.actor.displayName || a.actor.username || '').toLowerCase();
        const desc = (a.description || '').toLowerCase();
        const title = (a.content?.title || a.content?.achievementName || '').toLowerCase();
        const summary = (a.content?.summary || '').toLowerCase();
        return actorName.includes(q) || desc.includes(q) || title.includes(q) || summary.includes(q);
      });
    }

    return result;
  }, [activities, typeFilter, dateFilter, searchQuery]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'story_published': return <BookOpen className="w-3.5 h-3.5 text-zinc-300" />;
      case 'achievement_earned': return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'tip_received': return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      default: return <BookOpen className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  const getActivityLink = (activity: Activity) => {
    return activity.type === 'story_published' ? `/stories/${activity.content.id}` : `/profile/${activity.actor.username}`;
  };

  const activeFilterCount = [typeFilter !== 'all', dateFilter !== 'all', searchQuery.trim() !== ''].filter(Boolean).length;

  const resetFilters = () => {
    setTypeFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
      <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
    </div>
  );

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Back Home
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Recent Activity.</h1>
              <p className="text-xs text-zinc-500 font-medium">See what the readers and writers you follow are doing.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded">
            Live Updates
          </div>
        </header>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search activity by name, story title, or keyword..."
            className="w-full px-5 py-3.5 pl-11 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded text-xs font-bold outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-300 mr-2">
            <Filter className="w-3.5 h-3.5" />
            Filters
          </div>

          <FilterDropdown
            label="Type"
            icon={Tag}
            options={TYPE_OPTIONS}
            value={typeFilter}
            onChange={(v) => setTypeFilter(v as TypeFilter)}
          />
          <FilterDropdown
            label="Date"
            icon={Calendar}
            options={DATE_OPTIONS}
            value={dateFilter}
            onChange={(v) => setDateFilter(v as DateFilter)}
          />

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X className="w-3 h-3" />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Activity List */}
        {filteredActivities.length === 0 ? (
          <div className="py-40 text-center border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
            {activeFilterCount > 0 ? (
              <div className="space-y-4">
                <Filter className="w-6 h-6 text-zinc-200 mx-auto" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">
                  No activity matches your filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white underline transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : activities.length === 0 ? (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 mb-8">No activity found yet.</p>
                <Link href="/universes" className="px-8 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest rounded transition-all">
                  Find People to Follow
                </Link>
              </div>
            ) : (
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 italic">No results found.</p>
            )}
          </div>
        ) : (
          <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
            <div className="divide-y divide-zinc-50 dark:divide-zinc-900">
              {filteredActivities.map(activity => (
                <Link
                  key={activity.id}
                  href={getActivityLink(activity)}
                  className="flex gap-4 p-6 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-all group"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 overflow-hidden border border-zinc-100 dark:border-zinc-800 shrink-0">
                    {activity.actor.avatarUrl ? (
                      <img src={activity.actor.avatarUrl} alt="" className="w-full h-full object-cover transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[10px] text-zinc-300">
                        {activity.actor.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1 min-w-0">
                        <p className="text-[11px] text-zinc-900 dark:text-zinc-100">
                          <span className="font-bold uppercase">{activity.actor.displayName || activity.actor.username}</span>
                          <span className="text-zinc-500 ml-2 italic lowercase">{activity.description}</span>
                        </p>

                        {/* Story card with description */}
                        {activity.type === 'story_published' && (
                          <div className="mt-3 p-4 rounded border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
                            <div className="flex gap-3">
                              {activity.content.coverUrl && (
                                <div className="w-12 h-16 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                                  <img src={activity.content.coverUrl} alt="" className="w-full h-full object-cover" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <BookOpen className="w-3 h-3 text-zinc-300 shrink-0" />
                                  <p className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase tracking-widest truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                    {activity.content.title}
                                  </p>
                                </div>
                                {activity.content.genre && (
                                  <span className="inline-block text-[8px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded mb-2">
                                    {activity.content.genre}
                                  </span>
                                )}
                                {(activity.content.summary || activity.content.description) && (
                                  <p className="text-[10px] text-zinc-400 leading-relaxed italic line-clamp-2">
                                    {truncateText(activity.content.summary || activity.content.description, 160)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {activity.type === 'achievement_earned' && (
                          <div className="flex items-center gap-2 mt-2">
                            <Award className="w-3 h-3 text-amber-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                              {activity.content.achievementName}
                            </p>
                          </div>
                        )}

                        {activity.type === 'tip_received' && activity.content.storyTitle && (
                          <div className="flex items-center gap-2 mt-2">
                            <Heart className="w-3 h-3 text-rose-400" />
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                              ${activity.content.amount} for &quot;{activity.content.storyTitle}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="shrink-0 transition-opacity">{getIcon(activity.type)}</div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                      <Clock className="w-2.5 h-2.5 text-zinc-200" />
                      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 font-mono">
                        {new Date(activity.timestamp).toLocaleDateString()} • {formatTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}M`;
  if (hours < 24) return `${hours}H`;
  if (days < 7) return `${days}D`;
  return date.toLocaleDateString();
}
