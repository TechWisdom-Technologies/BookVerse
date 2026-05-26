"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Loader2,
  Search,
  Trash2,
  Eye,
  CheckCircle,
  HelpCircle,
  Clock,
  AlertCircle,
  XCircle,
  Mail,
  User,
  ExternalLink,
  ChevronRight,
  Headphones,
  Filter
} from "lucide-react";
import toast from "react-hot-toast";

interface SupportTicket {
  id: string;
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, [page, search, statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/support?page=${page}&status=${statusFilter}&search=${encodeURIComponent(search)}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
        setTotalPages(data.totalPages);
        
        // Auto-select first ticket if none is selected
        if (data.tickets.length > 0 && !selectedTicket) {
          setSelectedTicket(data.tickets[0]);
        }
      } else {
        toast.error("Failed to load support tickets");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
    try {
      const res = await fetch(`/api/admin/support`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id, status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        toast.success(`Ticket marked as ${newStatus}`);
        
        // Update local state
        setTickets(tickets.map(t => t.id === id ? updated.ticket : t));
        if (selectedTicket?.id === id) {
          setSelectedTicket(updated.ticket);
        }
      } else {
        toast.error("Failed to update ticket status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this support ticket?")) return;
    try {
      const res = await fetch(`/api/admin/support`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: id }),
      });
      if (res.ok) {
        toast.success("Ticket deleted");
        const remaining = tickets.filter(t => t.id !== id);
        setTickets(remaining);
        if (selectedTicket?.id === id) {
          setSelectedTicket(remaining.length > 0 ? remaining[0] : null);
        }
      } else {
        toast.error("Failed to delete ticket");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication error");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-[8px] font-bold uppercase tracking-widest border border-rose-500/10">Open</span>;
      case "IN_PROGRESS":
        return <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase tracking-widest border border-amber-500/10">In Progress</span>;
      case "RESOLVED":
        return <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-widest border border-emerald-500/10">Resolved</span>;
      case "CLOSED":
        return <span className="px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-500 text-[8px] font-bold uppercase tracking-widest border border-zinc-500/10">Closed</span>;
      default:
        return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "billing": return "Billing & Premium";
      case "account": return "Account Issues";
      case "bug": return "Bug Report";
      case "creator": return "Creator Tools";
      default: return "General Inquiry";
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex items-end justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight mb-1">Support Desk Inquiries</h1>
            <p className="text-xs text-zinc-500 font-medium">Manage user inquiries, technical assistance logs, and ticket triaging workflows.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 font-mono">
            <Headphones className="w-3.5 h-3.5 text-zinc-300" /> Triage Operational
          </div>
        </header>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-300" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, msg..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white outline-none focus:border-zinc-900"
              onKeyDown={(e) => e.key === 'Enter' && setPage(1)}
            />
          </div>

          <div className="flex flex-wrap gap-1">
            {[
              { val: "ALL", label: "All Tickets" },
              { val: "OPEN", label: "Open" },
              { val: "IN_PROGRESS", label: "In Progress" },
              { val: "RESOLVED", label: "Resolved" },
              { val: "CLOSED", label: "Closed" }
            ].map((t) => (
              <button
                key={t.val}
                onClick={() => { setStatusFilter(t.val); setPage(1); }}
                className={`px-4 py-2 rounded text-[9px] font-bold uppercase tracking-widest transition-all ${
                  statusFilter === t.val
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Inbox List (Left Column) */}
          <div className="lg:col-span-5 space-y-4">
            {loading && tickets.length === 0 ? (
              <div className="py-20 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-zinc-100 dark:border-zinc-900 rounded bg-zinc-50/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No support tickets found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-5 border rounded transition-all duration-300 flex items-start gap-4 relative overflow-hidden group ${
                      selectedTicket?.id === t.id
                        ? "bg-zinc-50 dark:bg-zinc-900 border-zinc-900 dark:border-white shadow-sm"
                        : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    {/* Category color bar */}
                    <div className={`absolute top-0 left-0 w-[3px] h-full ${
                      t.status === "OPEN" ? "bg-rose-500" :
                      t.status === "IN_PROGRESS" ? "bg-amber-500" :
                      t.status === "RESOLVED" ? "bg-emerald-500" : "bg-zinc-400"
                    }`} />

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[120px]">
                          {getCategoryLabel(t.category)}
                        </span>
                        <span className="text-[8px] font-bold text-zinc-300 font-mono">
                          {new Date(t.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase truncate group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                        {t.subject}
                      </h4>
                      
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[9px] text-zinc-400 truncate max-w-[150px]">
                          By: {t.name}
                        </span>
                        <div>{getStatusBadge(t.status)}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-zinc-200 mt-5 transition-transform ${selectedTicket?.id === t.id ? "translate-x-1 text-zinc-900 dark:text-white" : ""}`} />
                  </button>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-50 dark:border-zinc-900">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ticket Viewer Detail Panel (Right Column) */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl bg-white dark:bg-zinc-950 p-8 shadow-sm space-y-8 relative overflow-hidden">
                {/* Header Action Border */}
                <div className={`absolute top-0 left-0 w-full h-[3px] ${
                  selectedTicket.status === "OPEN" ? "bg-rose-500" :
                  selectedTicket.status === "IN_PROGRESS" ? "bg-amber-500" :
                  selectedTicket.status === "RESOLVED" ? "bg-emerald-500" : "bg-zinc-400"
                }`} />

                {/* Ticket Details Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-zinc-50 dark:border-zinc-900 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400 text-[9px] font-bold uppercase tracking-widest border border-zinc-100 dark:border-zinc-800">
                        {getCategoryLabel(selectedTicket.category)}
                      </span>
                      {getStatusBadge(selectedTicket.status)}
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-tight text-zinc-900 dark:text-white pt-1">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  
                  <div className="text-[10px] text-zinc-400 font-mono text-left md:text-right uppercase">
                    Logged: {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                </div>

                {/* User info card */}
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-900 rounded space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold border border-zinc-200 dark:border-zinc-700">
                      <User className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase">{selectedTicket.name}</div>
                      <a href={`mailto:${selectedTicket.email}`} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {selectedTicket.email}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Core message */}
                <div className="space-y-2">
                  <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">Detailed Message</h4>
                  <div className="p-6 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-900 rounded text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 whitespace-pre-wrap font-medium">
                    {selectedTicket.message}
                  </div>
                </div>

                {/* Actions Hub */}
                <div className="pt-6 border-t border-zinc-50 dark:border-zinc-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedTicket.status !== "IN_PROGRESS" && selectedTicket.status !== "RESOLVED" && selectedTicket.status !== "CLOSED" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, "IN_PROGRESS")}
                        className="px-4 py-2 border border-amber-500/10 bg-amber-500/5 hover:bg-amber-500/10 text-[9px] font-bold text-amber-500 rounded uppercase tracking-widest transition-colors flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" /> Mark In Progress
                      </button>
                    )}
                    {selectedTicket.status !== "RESOLVED" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, "RESOLVED")}
                        className="px-4 py-2 border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 text-[9px] font-bold text-emerald-500 rounded uppercase tracking-widest transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Mark Resolved
                      </button>
                    )}
                    {selectedTicket.status !== "CLOSED" && (
                      <button
                        onClick={() => handleUpdateStatus(selectedTicket.id, "CLOSED")}
                        className="px-4 py-2 border border-zinc-500/10 bg-zinc-500/5 hover:bg-zinc-500/10 text-[9px] font-bold text-zinc-400 rounded uppercase tracking-widest transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Close Ticket
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(selectedTicket.id)}
                    className="px-4 py-2 border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 text-[9px] font-bold text-rose-500 rounded uppercase tracking-widest transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Purge Log
                  </button>
                </div>

              </div>
            ) : (
              <div className="border border-dashed border-zinc-100 dark:border-zinc-900 rounded-xl bg-zinc-50/10 p-20 text-center">
                <HelpCircle className="w-8 h-8 text-zinc-200 mx-auto mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Select a ticket from the list to view its full details.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
