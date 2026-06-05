"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  ArrowLeft,
  ShieldCheck,
  Check,
  X,
  AlertCircle,
  Megaphone,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Globe,
  Mail,
  Receipt,
  Info
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface StoryAuthor {
  id: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}

interface PromotionData {
  id: string;
  storyId: string;
  tier: string;
  startDate: string;
  endDate: string;
  cost: number;
  senderNumber: string | null;
  transactionId: string | null;
  status: "PENDING" | "ACTIVE" | "DECLINED" | "ENDED" | "PAUSED";
  createdAt: string;
  story: {
    id: string;
    title: string;
    coverUrl: string | null;
    author: StoryAuthor;
  };
  gatewayFee?: number | null;
  chargedAmount?: number | null;
  paymentMethod?: string | null;
  invoiceId?: string | null;
  ipAddress?: string | null;
  country?: string | null;
  email?: string | null;
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions);
      } else {
        toast.error("Failed to fetch promotions registry");
      }
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      toast.error("Error fetching promotions");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "APPROVE" | "DECLINE") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(`Promotion ${action === "APPROVE" ? "Approved & Activated" : "Declined"} successfully!`);
        setPromotions(prev =>
          prev.map(p => (p.id === id ? { ...p, status: action === "APPROVE" ? "ACTIVE" : "DECLINED" } : p))
        );
      } else {
        const err = await res.json();
        toast.error(err.error || `Failed to ${action.toLowerCase()} promotion`);
      }
    } catch (error) {
      console.error(`Error processing promotion action ${action}:`, error);
      toast.error("Network communication failure");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredPromotions = promotions.filter(p => {
    const q = search.toLowerCase();
    return (
      (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
      (p.senderNumber && p.senderNumber.includes(q)) ||
      p.story.title.toLowerCase().includes(q) ||
      p.story.author.username.toLowerCase().includes(q) ||
      p.story.author.email.toLowerCase().includes(q) ||
      (p.story.author.displayName && p.story.author.displayName.toLowerCase().includes(q)) ||
      p.tier.toLowerCase().includes(q)
    );
  });

  const tierColor = (tier: string) => {
    switch (tier) {
      case "FEATURED": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "TRENDING": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
      case "PROMOTED": return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20";
      default: return "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20";
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Oversight Hub
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1">Promotion Payment Audit.</h1>
              <p className="text-xs text-zinc-500 font-medium">Verify story promotion payments (bkash/Nagad), confirm txnID, and activate promotions.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-300" />
            Audit Mode Active
          </div>
        </header>

        {/* Search & Stats */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by TxnID, Mobile, Story, Author..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{promotions.filter(p => p.status === "PENDING").length} Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{promotions.filter(p => p.status === "ACTIVE").length} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>{promotions.filter(p => p.status === "DECLINED").length} Declined</span>
            </div>
          </div>
        </div>

        {/* Audit Table */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="py-40 text-center">
              <AlertCircle className="w-6 h-6 text-zinc-300 mx-auto mb-3" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No promotion payment records detected.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Story / Author</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Tier / Cost</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment Wallet</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Transaction ID</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Submitted At</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {filteredPromotions.map((promo) => (
                    <React.Fragment key={promo.id}>
                    <tr className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-8 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                            {promo.story.coverUrl ? (
                              <img src={promo.story.coverUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Megaphone className="w-3 h-3 text-zinc-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-zinc-900 dark:text-white truncate max-w-[180px]">
                              {promo.story.title}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest mt-0.5">
                              @{promo.story.author.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-mono ${tierColor(promo.tier)}`}>
                            {promo.tier}
                          </span>
                          <p className="text-[10px] font-bold text-zinc-350 dark:text-zinc-200">
                            ৳{promo.cost.toLocaleString()} BDT
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                        {promo.senderNumber || <span className="text-zinc-300 italic">N/A</span>}
                      </td>

                      <td className="py-4 px-6">
                        {promo.transactionId ? (
                          <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-900 dark:text-white uppercase select-all bg-zinc-50 dark:bg-zinc-900/60 px-2 py-1 border border-zinc-100 dark:border-zinc-800 rounded">
                            {promo.transactionId}
                          </span>
                        ) : (
                          <span className="text-[10px] text-zinc-300 italic">No TxnID</span>
                        )}
                      </td>

                      <td className="py-4 px-6 text-[10px] font-mono font-bold text-zinc-450">
                        {formatDate(promo.createdAt)}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${
                          promo.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : promo.status === "DECLINED"
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                            : promo.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            : "bg-zinc-500/10 text-zinc-500 border border-zinc-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            promo.status === "ACTIVE"
                              ? "bg-emerald-500"
                              : promo.status === "DECLINED"
                              ? "bg-rose-500"
                              : promo.status === "PENDING"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-zinc-500"
                          }`} />
                          {promo.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {promo.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAction(promo.id, "APPROVE")}
                              disabled={processingId !== null}
                              title="Approve & Activate Promotion"
                              className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all border border-zinc-100 dark:border-zinc-850 hover:border-emerald-500/30 rounded"
                            >
                              {processingId === promo.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleAction(promo.id, "DECLINE")}
                              disabled={processingId !== null}
                              title="Decline Promotion"
                              className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-zinc-100 dark:border-zinc-850 hover:border-rose-500/30 rounded"
                            >
                              {processingId === promo.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <X className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                            Processed
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedId(expandedId === promo.id ? null : promo.id)}
                          className="ml-4 p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          {expandedId === promo.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === promo.id && (
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-900">
                        <td colSpan={7} className="p-0">
                          <div className="px-6 py-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              <Info className="w-3.5 h-3.5" />
                              Payment Telemetry Data
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Globe className="w-3 h-3"/> IP Address</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300">{promo.ipAddress || "Unknown"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Country</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300">{promo.country || "Unknown"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Mail className="w-3 h-3"/> Billing Email</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300 truncate" title={promo.email || promo.story.author.email || ""}>{promo.email || promo.story.author.email || "Unknown"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Receipt className="w-3 h-3"/> Invoice ID</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300">{promo.invoiceId || "N/A"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Payment Gateway</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300 uppercase">{promo.paymentMethod || "Manual"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Gateway Fee</div>
                                <div className="text-xs font-mono text-rose-600 dark:text-rose-400">৳{promo.gatewayFee || "0"} BDT</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Total Charged</div>
                                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">৳{promo.chargedAmount || promo.cost} BDT</div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
