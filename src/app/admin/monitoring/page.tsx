"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Activity, ShieldAlert, Database, Users, Server, Clock, AlertCircle, CheckCircle2, XCircle, Wallet, Flame, TrendingUp, AlertTriangle, Bug } from "lucide-react";
import Link from "next/link";

interface MonitoringData {
  tierDistribution: { tier: string, count: number }[];
  onboarding: { totalUsers: number, startedQuizzes: number, completedQuizzes: number };
  activeDbConnections: number;
  recentRateLimits: any[];
  recentCronLogs: any[];
  recentFailedWebhooks: any[];
  recentSlowApis: any[];
  recentCrashes: any[];
  engagement: {
    dau: number;
    mau: number;
    readingMinutesToday: number;
  };
  financials: {
    authorPayoutQueue: number;
  };
}

export default function MonitoringDashboard() {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/monitoring")
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Activity className="w-6 h-6 animate-pulse text-zinc-400" />
      </div>
    );
  }

  // Calculate conic gradient for pie chart
  const totalTiers = data.tierDistribution.reduce((acc, t) => acc + t.count, 0);
  let accumulatedPercent = 0;
  
  const colors: Record<string, string> = {
    FREE: "#71717a", // zinc-500
    AUTHOR: "#3b82f6", // blue-500
    PRO: "#a855f7", // purple-500
    CREATOR: "#f59e0b", // amber-500
  };

  const conicStops = data.tierDistribution.map(t => {
    const percent = (t.count / totalTiers) * 100;
    const color = colors[t.tier] || "#52525b";
    const stop = `${color} ${accumulatedPercent}% ${accumulatedPercent + percent}%`;
    accumulatedPercent += percent;
    return stop;
  }).join(", ");

  const maxFunnel = data.onboarding.totalUsers || 1;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Admin Registry
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">System Vitals & Monitoring</h1>
              <p className="text-sm text-zinc-500 max-w-xl font-medium">Real-time health, security, and usage telemetry.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1.5 border border-emerald-100 dark:border-emerald-500/20 rounded-md">
            <Activity className="w-3.5 h-3.5" />
            Systems Nominal
          </div>
        </header>

        {/* Top KPI row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4 text-zinc-500 dark:text-zinc-400">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Active Users</h3>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold">{data.engagement.dau.toLocaleString()}</p>
              <p className="text-xs text-zinc-500 mb-1">DAU</p>
            </div>
            <p className="text-xs text-zinc-500 mt-2">{data.engagement.mau.toLocaleString()} MAU (30d)</p>
          </div>
          
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4 text-zinc-500 dark:text-zinc-400">
              <Flame className="w-5 h-5 text-orange-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Global Reading</h3>
            </div>
            <p className="text-3xl font-bold">{data.engagement.readingMinutesToday.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-2">Total minutes read today</p>
          </div>
          
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4 text-zinc-500 dark:text-zinc-400">
              <Wallet className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest">Payout Queue</h3>
            </div>
            <p className="text-3xl font-bold">৳{data.financials.authorPayoutQueue.toLocaleString()}</p>
            <p className="text-xs text-zinc-500 mt-2">Total owed to Authors</p>
          </div>

          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3 mb-4 text-zinc-500 dark:text-zinc-400">
              <Database className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-widest">DB Connections</h3>
            </div>
            <p className="text-3xl font-bold">{data.activeDbConnections}</p>
            <p className="text-xs text-zinc-500 mt-2">Active Postgres Backend Connections</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Tier Distribution Pie Chart */}
          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 w-full mb-8">Tier Distribution</h3>
            
            <div className="relative w-48 h-48 rounded-full mb-8" 
                 style={{ background: `conic-gradient(${conicStops})` }}>
              <div className="absolute inset-4 bg-zinc-50 dark:bg-zinc-900 rounded-full"></div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              {data.tierDistribution.map(t => (
                <div key={t.tier} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 rounded border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[t.tier] || "#52525b" }}></div>
                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{t.tier}</span>
                  </div>
                  <span className="text-sm font-medium">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Onboarding Funnel */}
          <div className="p-8 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8">Onboarding Funnel</h3>
            
            <div className="flex-1 flex items-end justify-around gap-4 h-48 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              
              <div className="w-16 md:w-24 bg-blue-500/20 rounded-t border-t border-x border-blue-500/40 relative group"
                   style={{ height: `${(data.onboarding.totalUsers / maxFunnel) * 100}%` }}>
                <div className="absolute -top-6 w-full text-center text-xs font-bold text-blue-600 dark:text-blue-400">
                  {data.onboarding.totalUsers}
                </div>
              </div>

              <div className="w-16 md:w-24 bg-purple-500/20 rounded-t border-t border-x border-purple-500/40 relative group"
                   style={{ height: `${(data.onboarding.startedQuizzes / maxFunnel) * 100}%` }}>
                <div className="absolute -top-6 w-full text-center text-xs font-bold text-purple-600 dark:text-purple-400">
                  {data.onboarding.startedQuizzes}
                </div>
              </div>

              <div className="w-16 md:w-24 bg-emerald-500/20 rounded-t border-t border-x border-emerald-500/40 relative group"
                   style={{ height: `${(data.onboarding.completedQuizzes / maxFunnel) * 100}%` }}>
                <div className="absolute -top-6 w-full text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {data.onboarding.completedQuizzes}
                </div>
              </div>
            </div>

            <div className="flex justify-around mt-4">
              <span className="text-xs font-medium text-zinc-500 w-16 md:w-24 text-center leading-tight">Registered Users</span>
              <span className="text-xs font-medium text-zinc-500 w-16 md:w-24 text-center leading-tight">Started Quiz</span>
              <span className="text-xs font-medium text-zinc-500 w-16 md:w-24 text-center leading-tight">Completed Quiz</span>
            </div>
          </div>
        </div>

        {/* Logs Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Failed Webhooks */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Failed Webhooks</h3>
            </div>
            
            <div className="space-y-3 flex-1">
              {data.recentFailedWebhooks.length === 0 ? (
                <p className="text-xs text-zinc-500">No failed webhooks logged.</p>
              ) : data.recentFailedWebhooks.map(log => (
                <div key={log.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-zinc-950 border border-orange-100 dark:border-orange-900/30 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400">{log.provider}</span>
                    <span className="text-[10px] text-zinc-400">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="text-xs text-zinc-600 dark:text-zinc-300 break-all">{log.errorMessage}</span>
                  {log.transactionId && (
                    <span className="text-[10px] font-mono text-zinc-500">TxID: {log.transactionId}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Crash Reports */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <Bug className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Global Crash Reports</h3>
            </div>
            
            <div className="space-y-3 flex-1 overflow-auto">
              {data.recentCrashes.length === 0 ? (
                <p className="text-xs text-zinc-500">No crashes logged.</p>
              ) : data.recentCrashes.map(log => (
                <div key={log.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-900/30 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">{log.url || 'Unknown Route'}</span>
                    <span className="text-[10px] text-zinc-400">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300 break-all">{log.errorMessage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Logs Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cron Logs */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <Server className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Cron Jobs</h3>
            </div>
            
            <div className="space-y-3 flex-1">
              {data.recentCronLogs.length === 0 ? (
                <p className="text-xs text-zinc-500">No cron jobs logged yet.</p>
              ) : data.recentCronLogs.map(log => (
                <div key={log.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {log.status === 'SUCCESS' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className="text-xs font-bold">{log.jobName}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[10px]">
                      <Clock className="w-3 h-3" />
                      {log.durationMs}ms
                    </div>
                    {log.errorMessage && (
                      <span className="text-[10px] text-red-400 truncate max-w-[150px]">{log.errorMessage}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slow API Logs */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Slow API Routes ({'>'}3s)</h3>
            </div>
            
            <div className="space-y-3 flex-1">
              {data.recentSlowApis.length === 0 ? (
                <p className="text-xs text-zinc-500">No slow API requests logged.</p>
              ) : data.recentSlowApis.map(log => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 border border-amber-100 dark:border-amber-900/30 rounded">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">{log.method}</span>
                      <span className="text-xs font-mono font-medium">{log.url}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <span className="text-sm font-bold text-amber-500">{log.durationMs}ms</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Limits */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <ShieldAlert className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Rate Limit Violations</h3>
            </div>
            
            <div className="space-y-3 flex-1">
              {data.recentRateLimits.length === 0 ? (
                <p className="text-xs text-zinc-500">No violations logged.</p>
              ) : data.recentRateLimits.map(violation => (
                <div key={violation.id} className="flex items-center justify-between p-3 bg-white dark:bg-zinc-950 border border-red-100 dark:border-red-900/30 rounded">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-medium">{violation.ipAddress}</span>
                      <span className="text-[10px] text-zinc-500">{violation.route}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400">{new Date(violation.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
