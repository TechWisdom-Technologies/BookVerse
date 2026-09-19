"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Cpu, ImageIcon, MessageSquareText, Shield, Loader2, Activity, Clock } from "lucide-react";
import Link from "next/link";

interface MetricData {
  tokens: number;
  operations: number;
  duration: number;
}

interface Limits {
  rpm: number;
  rph: number;
  rpd: number;
  rpw: number;
  rpm_month: number;
}

interface TokenMetric {
  provider: string;
  type: string;
  limits: Limits;
  minute: MetricData;
  hour: MetricData;
  day: MetricData;
  week: MetricData;
  month: MetricData;
  total: MetricData;
}

export default function AIMetricsPage() {
  const [metrics, setMetrics] = useState<TokenMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch("/api/admin/ai-metrics");
        if (res.ok) {
          const data = await res.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error("Failed to fetch AI metrics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
    // Poll every 10 seconds to show "per minute" live usage
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const getProviderIcon = (provider: string) => {
    if (provider === "GEMINI" || provider === "GROQ") return <MessageSquareText className="w-4 h-4" />;
    if (provider === "CLOUDFLARE_AI" || provider === "POLLINATIONS") return <ImageIcon className="w-4 h-4" />;
    return <Cpu className="w-4 h-4" />;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return "0s";
    if (ms < 1000) return `${ms}ms`;
    const s = ms / 1000;
    if (s < 60) return `${s.toFixed(1)}s`;
    const m = Math.floor(s / 60);
    const rs = Math.floor(s % 60);
    return `${m}m ${rs}s`;
  };

  const TimeframeProgress = ({ label, used, limit }: { label: string, used: number, limit: number }) => {
    const percentage = Math.min(100, Math.max(0, (used / limit) * 100));
    const isCritical = percentage >= 90;
    const isWarning = percentage >= 75 && !isCritical;
    
    return (
      <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold tracking-wider uppercase text-[9px] text-zinc-500">{label}</span>
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            {formatNumber(used)} / {formatNumber(limit)} <span className="text-zinc-400 font-normal">ops</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} 
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Admin Oversight
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">AI Telemetry</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Granular operations tracking, real-time rate limits, and multi-key capacity mapping.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 border border-emerald-100 dark:border-emerald-900/50 rounded-md">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            Live Sync Active
          </div>
        </header>

        {/* Global Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-900 mb-12 rounded-xl overflow-hidden shadow-sm">
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Text Tokens (All Time)</span>
              <MessageSquareText className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800" />
            </div>
            <p className="text-4xl font-bold tracking-tight">
              {formatNumber(metrics.filter(m => m.type === "TEXT").reduce((acc, curr) => acc + curr.total.tokens, 0))}
            </p>
          </div>
          <div className="p-8 bg-white dark:bg-zinc-950 flex flex-col justify-between group">
            <div className="flex items-center justify-between mb-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Total Image Gens (All Time)</span>
              <ImageIcon className="w-3.5 h-3.5 text-zinc-200 dark:text-zinc-800" />
            </div>
            <p className="text-4xl font-bold tracking-tight">
              {formatNumber(metrics.filter(m => m.type === "IMAGE").reduce((acc, curr) => acc + curr.total.operations, 0))}
            </p>
          </div>
        </div>

        {/* Detailed Provider Breakdown */}
        <section>
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-zinc-50 dark:border-zinc-900">
            <Shield className="w-4 h-4 text-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400">API Rate Limit Monitoring</h2>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {metrics.map((metric, i) => {
              return (
                <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                  
                  {/* Provider Header */}
                  <div className="p-6 border-b border-zinc-100 dark:border-zinc-800/60 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="flex items-center gap-3">
                      <div className="text-zinc-500 bg-white dark:bg-zinc-900 p-2 rounded-md shadow-sm border border-zinc-100 dark:border-zinc-800">
                        {getProviderIcon(metric.provider)}
                      </div>
                      <div>
                        <h3 className="font-bold tracking-tight">{metric.provider}</h3>
                        <span className="text-[10px] font-medium text-zinc-500">{metric.type} API cluster</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Total Time
                      </span>
                      <span className="text-sm font-medium">{formatDuration(metric.total?.duration || 0)}</span>
                    </div>
                  </div>

                  {/* Limits Grid */}
                  <div className="p-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Operations (Requests) Quotas</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <TimeframeProgress label="Per Minute (RPM)" used={metric.minute?.operations || 0} limit={metric.limits?.rpm || 1} />
                      <TimeframeProgress label="Per Hour (RPH)" used={metric.hour?.operations || 0} limit={metric.limits?.rph || 1} />
                      <TimeframeProgress label="Per Day (RPD)" used={metric.day?.operations || 0} limit={metric.limits?.rpd || 1} />
                      <TimeframeProgress label="Per Week (RPW)" used={metric.week?.operations || 0} limit={metric.limits?.rpw || 1} />
                    </div>
                  </div>
                  
                  {/* Tokens Footer */}
                  {metric.type === "TEXT" && (
                    <div className="bg-zinc-50 dark:bg-zinc-900/30 p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
                      <span className="text-zinc-500 font-medium">Tokens Consumed (Last 30 Days)</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">{formatNumber(metric.month?.tokens || 0)}</span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
