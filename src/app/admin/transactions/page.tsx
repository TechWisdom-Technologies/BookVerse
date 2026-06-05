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
  TrendingUp,
  CreditCard,
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

interface UserProfile {
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  membershipTier: string | null;
  role: string;
}

interface SubscriptionTransaction {
  id: string;
  userId: string;
  plan: string;
  duration: number;
  amount: number;
  senderNumber: string;
  transactionId: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "REJECTED";
  createdAt: string;
  user: UserProfile;
  details?: {
    type: "TIP" | "GIFT" | "PROMOTION";
    receiverName?: string;
    receiverUsername?: string;
    storyTitle?: string | null;
    recipientEmail?: string;
    tier?: string;
  } | null;
  gatewayFee?: number | null;
  chargedAmount?: number | null;
  paymentMethod?: string | null;
  invoiceId?: string | null;
  ipAddress?: string | null;
  country?: string | null;
  email?: string | null;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
      } else {
        toast.error("Failed to fetch transactions registry");
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Error fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: "APPROVE" | "DECLINE" | "REFUND") => {
    setProcessingId(id);
    try {
      const url = action === "REFUND" ? `/api/admin/transactions/${id}/refund` : `/api/admin/transactions/${id}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "REFUND" ? {} : { action }),
      });

      if (res.ok) {
        toast.success(`Transaction ${action === "APPROVE" ? "Approved" : action === "REFUND" ? "Refunded" : "Declined"} successfully!`);
        // Update local state status
        setTransactions(prev =>
          prev.map(t => (t.id === id ? { ...t, status: action === "APPROVE" ? "APPROVED" : action === "REFUND" ? "REJECTED" : "DECLINED" } : t))
        );
      } else {
        const err = await res.json();
        toast.error(err.error || `Failed to ${action.toLowerCase()} transaction`);
      }
    } catch (error) {
      console.error(`Error processing transaction action ${action}:`, error);
      toast.error("Network communication failure");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter transactions based on search term (Transaction ID, mobile number, user email/username)
  const filteredTransactions = transactions.filter(t => {
    const q = search.toLowerCase();
    return (
      t.transactionId.toLowerCase().includes(q) ||
      t.senderNumber.includes(q) ||
      t.user.email.toLowerCase().includes(q) ||
      t.user.username.toLowerCase().includes(q) ||
      (t.user.displayName && t.user.displayName.toLowerCase().includes(q))
    );
  });

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Minimal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-3 h-3" />
              Oversight Hub
            </Link>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1">Subscription Payment Audit.</h1>
              <p className="text-xs text-zinc-500 font-medium">Verify direct mobile payments (bkash/Nagad), confirm txnID, and authorize premium memberships.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <ShieldCheck className="w-3 h-3 text-zinc-300" />
            Audit Mode Active
          </div>
        </header>

        {/* Surgical Search & Stats overview */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by TxnID, Mobile, User..."
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-lg border border-amber-200 dark:border-amber-500/20">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{transactions.filter(t => t.status === "PENDING").length} Pending</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{transactions.filter(t => t.status === "APPROVED").length} Approved</span>
            </div>
          </div>
        </div>

        {/* Fiscal Treasury Dashboards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Revenue Logged", value: `৳${transactions.filter(t => t.status === "APPROVED").reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`, icon: CreditCard },
            { label: "Pending Pipeline", value: `৳${transactions.filter(t => t.status === "PENDING").reduce((acc, t) => acc + t.amount, 0).toLocaleString()}`, icon: TrendingUp },
            { label: "Transaction Volume", value: transactions.length.toLocaleString(), icon: Calendar },
            { label: "Approval Rate", value: transactions.length ? `${((transactions.filter(t => t.status === "APPROVED").length / transactions.length) * 100).toFixed(1)}%` : "0%", icon: Check },
          ].map((stat, i) => (
            <div key={i} className="p-6 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-zinc-900/40 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-zinc-400 dark:text-zinc-600" />
              </div>
              <div className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Audit Table */}
        <div className="border border-zinc-100 dark:border-zinc-900 rounded bg-white dark:bg-zinc-950 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-40">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-300" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-40 text-center">
              <AlertCircle className="w-6 h-6 text-zinc-300 mx-auto mb-3" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No payment transaction records detected.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">User / Account</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Upgrade Option</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Payment Wallet</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Transaction ID</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Submitted At</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {filteredTransactions.map((txn) => (
                    <React.Fragment key={txn.id}>
                    <tr className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                            {txn.user.avatarUrl ? (
                              <img src={txn.user.avatarUrl} alt="" className="absolute inset-0 w-full h-full object-cover transition-all" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-zinc-400 uppercase">
                                {txn.user.username.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wide">
                              {txn.user.displayName || txn.user.username}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">@{txn.user.username}</p>
                              {txn.user.membershipTier && (
                                <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                                  txn.user.membershipTier === 'CREATOR' ? 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20' :
                                  txn.user.membershipTier === 'PRO' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                                  'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                                }`}>
                                  Current: {txn.user.membershipTier}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {txn.plan === "TIP" ? (
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                Author Tip
                              </span>
                            ) : txn.plan.startsWith("GIFT_") ? (
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                                Gift {txn.plan.replace("GIFT_", "")}
                              </span>
                            ) : txn.plan.startsWith("PROMOTION_") ? (
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                                Promo {txn.plan.replace("PROMOTION_", "")}
                              </span>
                            ) : (
                              <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-mono ${
                                txn.plan === "CREATOR"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                              }`}>
                                {txn.plan}
                              </span>
                            )}
                            
                            {!txn.plan.startsWith("PROMOTION_") && txn.plan !== "TIP" && (
                              <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest font-mono">
                                ({txn.duration}M)
                              </span>
                            )}
                          </div>
                          
                          {txn.details?.type === "TIP" && (
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                              To: <span className="font-bold text-amber-600 dark:text-amber-400 uppercase">@{txn.details.receiverUsername}</span>
                              {txn.details.storyTitle && (
                                <span className="block text-[9px] text-zinc-400 dark:text-zinc-500 italic max-w-[180px] truncate">Story: "{txn.details.storyTitle}"</span>
                              )}
                            </div>
                          )}

                          {txn.details?.type === "GIFT" && (
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
                              To Email: <span className="font-bold text-zinc-950 dark:text-zinc-100 font-mono select-all">{txn.details.recipientEmail}</span>
                            </div>
                          )}

                          {txn.details?.type === "PROMOTION" && (
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight max-w-[185px] truncate">
                              Story: <span className="font-bold text-zinc-900 dark:text-zinc-100 italic">"{txn.details.storyTitle}"</span>
                            </div>
                          )}

                          <div className="mt-1 flex flex-col">
                            <span className="text-[11px] font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                              ৳{txn.amount.toLocaleString()} BDT
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">
                        {txn.senderNumber}
                      </td>

                      <td className="py-4 px-6">
                        <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-900 dark:text-white uppercase select-all bg-zinc-50 dark:bg-zinc-900/60 px-2 py-1 border border-zinc-100 dark:border-zinc-800 rounded">
                          {txn.transactionId}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-[10px] font-mono font-bold text-zinc-450">
                        {formatDate(txn.createdAt)}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest rounded ${
                          txn.status === "APPROVED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : txn.status === "DECLINED"
                            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                            : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            txn.status === "APPROVED"
                              ? "bg-emerald-500"
                              : txn.status === "DECLINED"
                              ? "bg-rose-500"
                              : "bg-amber-500 animate-pulse"
                          }`} />
                          {txn.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        {txn.status === "PENDING" ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAction(txn.id, "APPROVE")}
                              disabled={processingId !== null}
                              title="Approve Transaction"
                              className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all border border-zinc-100 dark:border-zinc-850 hover:border-emerald-500/30 rounded"
                            >
                              {processingId === txn.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleAction(txn.id, "DECLINE")}
                              disabled={processingId !== null}
                              title="Decline Transaction"
                              className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-zinc-100 dark:border-zinc-850 hover:border-rose-500/30 rounded"
                            >
                              {processingId === txn.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <X className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        ) : txn.status === "APPROVED" ? (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-500">
                            Approved
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                            {txn.status}
                          </span>
                        )}
                        <button
                          onClick={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
                          className="ml-4 p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                          {expandedId === txn.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === txn.id && (
                      <tr className="bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-100 dark:border-zinc-900">
                        <td colSpan={7} className="p-0">
                          <div className="px-6 py-4 animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                <Info className="w-3.5 h-3.5" />
                                Payment Telemetry Data
                              </div>
                              {txn.status === "APPROVED" && (
                                <button
                                  onClick={() => {
                                    if (window.confirm("Are you sure you want to refund this payment? This action is irreversible and the money will be sent back.")) {
                                      handleAction(txn.id, "REFUND");
                                    }
                                  }}
                                  disabled={processingId !== null}
                                  title="Refund Transaction"
                                  className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 transition-all border border-rose-500/20 rounded flex items-center gap-2"
                                >
                                  {processingId === txn.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                                  ) : (
                                    "Issue Full Refund"
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Globe className="w-3 h-3"/> IP Address</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300">{txn.ipAddress || "Unknown"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Country</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300">{txn.country || "Unknown"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Mail className="w-3 h-3"/> Billing Email</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300 truncate" title={txn.email || ""}>{txn.email || "Unknown"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><Receipt className="w-3 h-3"/> Invoice ID</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300">{txn.invoiceId || "N/A"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Payment Gateway</div>
                                <div className="text-xs font-mono text-zinc-900 dark:text-zinc-300 uppercase">{txn.paymentMethod || "Manual"}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Gateway Fee</div>
                                <div className="text-xs font-mono text-rose-600 dark:text-rose-400">৳{txn.gatewayFee || "0"} BDT</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Total Charged</div>
                                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400">৳{txn.chargedAmount || txn.amount} BDT</div>
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
