"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
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
  Calendar
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
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
  user: UserProfile;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<SubscriptionTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleAction = async (id: string, action: "APPROVE" | "DECLINE") => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success(`Transaction ${action === "APPROVE" ? "Approved" : "Declined"} successfully!`);
        // Update local state status
        setTransactions(prev =>
          prev.map(t => (t.id === id ? { ...t, status: action === "APPROVE" ? "APPROVED" : "DECLINED" } : t))
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-300" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by TxnID, Mobile, User..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900 dark:focus:border-white transition-all"
            />
          </div>

          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>{transactions.filter(t => t.status === "PENDING").length} Pending Audits</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{transactions.filter(t => t.status === "APPROVED").length} Approved</span>
            </div>
          </div>
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
                    <tr key={txn.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-10 w-10 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                            {txn.user.avatarUrl ? (
                              <Image src={txn.user.avatarUrl} alt="" fill className="object-cover transition-all" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-350 uppercase">
                                {txn.user.username.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase">
                              {txn.user.displayName || txn.user.username}
                            </p>
                            <p className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest mt-0.5">@{txn.user.username}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded font-mono ${
                              txn.plan === "CREATOR"
                                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"
                                : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            }`}>
                              {txn.plan}
                            </span>
                            <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-widest">
                              ({txn.duration}M)
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-350 dark:text-zinc-200">
                            ৳{txn.amount.toLocaleString()} BDT
                          </p>
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
                        ) : (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                            Processed
                          </span>
                        )}
                      </td>
                    </tr>
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
