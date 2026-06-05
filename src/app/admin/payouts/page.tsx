"use client";

import React, { useState, useEffect } from "react";
import {
  Loader2,
  Search,
  Wallet,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";

interface AuthorWithBalance {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  walletBalance: number;
  bkashNumber: string | null;
  nagadNumber: string | null;
}

export default function AdminPayoutsPage() {
  const [authors, setAuthors] = useState<AuthorWithBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Form State per author row
  const [transactionIds, setTransactionIds] = useState<Record<string, string>>({});
  const [sentNumbers, setSentNumbers] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payouts");
      if (res.ok) {
        const data = await res.json();
        setAuthors(data);
      } else {
        toast.error("Failed to load author balances.");
      }
    } catch (err) {
      toast.error("An error occurred while loading data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayout = async (authorId: string) => {
    const transactionId = transactionIds[authorId]?.trim();
    const sentToNumber = sentNumbers[authorId]?.trim();

    if (!transactionId || !sentToNumber) {
      toast.error("Please enter both the Transaction Code and the Phone Number.");
      return;
    }

    setProcessingId(authorId);
    try {
      const res = await fetch("/api/admin/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId,
          transactionId,
          sentToNumber,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Payout logged and author notified!");
        // Remove the author from the list
        setAuthors((prev) => prev.filter((a) => a.id !== authorId));
        
        // Clear input states
        const newTxns = { ...transactionIds };
        delete newTxns[authorId];
        setTransactionIds(newTxns);

        const newNums = { ...sentNumbers };
        delete newNums[authorId];
        setSentNumbers(newNums);
      } else {
        toast.error(data.error || "Failed to process payout.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredAuthors = authors.filter(
    (author) =>
      author.username.toLowerCase().includes(search.toLowerCase()) ||
      author.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
              <Wallet className="w-6 h-6 text-emerald-500" />
              Author Payouts
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-lg">
              Manage month-end payouts for authors. Only authors with a wallet balance greater than ৳0 are shown here.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search authors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-white placeholder:text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
              <p className="text-sm font-medium">Loading balances...</p>
            </div>
          ) : filteredAuthors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                All Payouts Cleared!
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                There are currently no authors with a pending wallet balance. 
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                      Author
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                      Wallet Balance
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">
                      Saved Accounts
                    </th>
                    <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap min-w-[300px]">
                      Send Payout
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {filteredAuthors.map((author) => (
                    <tr key={author.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="relative h-11 w-11 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shrink-0">
                            {author.avatarUrl ? (
                              <img src={author.avatarUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-zinc-400 text-sm">
                                {author.username.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                              {author.displayName || author.username}
                            </p>
                            <p className="text-[11px] font-medium text-zinc-500 truncate mt-0.5">
                              @{author.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 inline-block">
                          ৳{author.walletBalance.toLocaleString()} BDT
                        </span>
                      </td>

                      <td className="py-5 px-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 w-12">bKash</span>
                            <span className="text-zinc-900 dark:text-zinc-200 font-bold select-all">{author.bkashNumber || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-mono">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 w-12">Nagad</span>
                            <span className="text-zinc-900 dark:text-zinc-200 font-bold select-all">{author.nagadNumber || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-5 px-6">
                        <div className="flex items-center gap-2 max-w-sm">
                          <input
                            type="text"
                            placeholder="Txn ID (e.g. 7A8B9C)"
                            value={transactionIds[author.id] || ""}
                            onChange={(e) => setTransactionIds({...transactionIds, [author.id]: e.target.value})}
                            className="w-1/2 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-white font-mono placeholder:font-sans"
                          />
                          <input
                            type="text"
                            placeholder="Sent to..."
                            value={sentNumbers[author.id] || ""}
                            onChange={(e) => setSentNumbers({...sentNumbers, [author.id]: e.target.value})}
                            className="w-1/2 px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all dark:text-white font-mono placeholder:font-sans"
                          />
                          <button
                            onClick={() => handlePayout(author.id)}
                            disabled={processingId === author.id}
                            className="flex-shrink-0 p-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Send Payout"
                          >
                            {processingId === author.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </button>
                        </div>
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
