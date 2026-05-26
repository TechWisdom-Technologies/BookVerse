"use client";

import { useEffect, useState, use } from "react";
import { Loader2, Trash2, ShieldAlert, ArrowLeft, Calendar, FileText, CheckCircle, Scale, Eye, User, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface NoticeDetails {
  id: string;
  storyId: string;
  originalWorkTitle: string;
  originalWorkAuthor: string | null;
  copyrightHolder: string;
  description: string | null;
  status: "SUBMITTED" | "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  submittedByUser: {
    id: string;
    username: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  } | null;
}

interface StoryDetails {
  id: string;
  title: string;
  coverUrl: string | null;
  published: boolean;
  viewCount: number;
  author: {
    id: string;
    username: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

export default function DMCADetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [notice, setNotice] = useState<NoticeDetails | null>(null);
  const [story, setStory] = useState<StoryDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dmca/${id}`);
      if (res.ok) {
        const data = await res.json();
        setNotice(data.notice);
        setStory(data.story);
      } else {
        toast.error("Failed to retrieve notice details");
      }
    } catch (e) {
      console.error(e);
      toast.error("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: "ACKNOWLEDGED" | "RESOLVED" | "DISMISSED") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/dmca`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId: id, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Claim status updated to ${newStatus}`);
        if (newStatus === "RESOLVED") {
          toast.success("Disputed story has been successfully taken offline.");
        }
        fetchNotice();
      } else {
        toast.error("Failed to update claim status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication failed");
    } finally {
      setActionLoading(false);
    }
  };

  const doDelete = async () => {
    if (!confirm("Permanently delete this DMCA notice from history? This action is irreversible.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/dmca`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noticeId: id }),
      });

      if (res.ok) {
        toast.success("DMCA notice deleted successfully");
        router.push("/admin/dmca");
      } else {
        toast.error("Failed to delete notice");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Loading Docket Data...</span>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-12 text-center">
        <div>
          <ShieldAlert className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Claim Record Not Found</h2>
          <Link href="/admin/dmca" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:underline">
            Back to Registry
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link href="/admin/dmca" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to DMCA Registry
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-1 bg-red-500/10 text-red-500 rounded border border-red-500/20">
                <Scale className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold tracking-tight uppercase">DMCA Docket Claim.</h1>
            </div>
            <p className="text-xs text-zinc-500 font-medium">Verify claim details, review original works, and take automated moderation action.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => updateStatus("ACKNOWLEDGED")}
              disabled={actionLoading || notice.status === "ACKNOWLEDGED" || notice.status === "RESOLVED"}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 rounded hover:border-zinc-950 dark:hover:border-white transition-all disabled:opacity-50"
            >
              Acknowledge
            </button>
            
            <button
              onClick={() => updateStatus("RESOLVED")}
              disabled={actionLoading || notice.status === "RESOLVED"}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50"
            >
              Execute Takedown
            </button>

            <button
              onClick={() => updateStatus("DISMISSED")}
              disabled={actionLoading || notice.status === "DISMISSED" || notice.status === "RESOLVED"}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold uppercase tracking-widest bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 rounded hover:border-zinc-950 dark:hover:border-white transition-all disabled:opacity-50"
            >
              Dismiss Claim
            </button>

            <button
              onClick={doDelete}
              disabled={actionLoading}
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 transition-all border border-zinc-200 dark:border-zinc-800 hover:border-red-500/20 rounded"
              title="Delete Docket"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Legal Affidavit Block */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
              <div className="bg-zinc-50 dark:bg-zinc-900/60 px-6 py-4 border-b border-zinc-150 dark:border-zinc-900 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5 font-mono">
                  <FileText className="w-3.5 h-3.5" />
                  Docket #{notice.id.slice(-8).toUpperCase()}
                </span>
                
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest rounded ${
                  notice.status === "RESOLVED"
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : notice.status === "DISMISSED"
                    ? "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                    : notice.status === "ACKNOWLEDGED"
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}>
                  {notice.status}
                </span>
              </div>

              {/* Legal Document Style */}
              <div className="p-8 space-y-8 font-serif">
                <div className="text-center space-y-1 pb-6 border-b border-dashed border-zinc-200 dark:border-zinc-800">
                  <h2 className="text-base font-bold uppercase tracking-widest font-sans">Affidavit of Infringement Claim</h2>
                  <p className="text-[10px] text-zinc-400 font-sans tracking-wide">SUBMITTED PURSUANT TO 17 U.S.C. § 512(C)</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-700 dark:text-zinc-300 font-sans">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Copyright Holder</span>
                    <p className="font-semibold text-zinc-900 dark:text-white text-[11px]">{notice.copyrightHolder}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Date Submitted</span>
                    <p className="font-semibold text-zinc-900 dark:text-white text-[11px]">{new Date(notice.createdAt).toLocaleDateString()} {new Date(notice.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Original Work Title</span>
                    <p className="font-semibold text-zinc-900 dark:text-white text-[11px]">{notice.originalWorkTitle}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Original Work Author</span>
                    <p className="font-semibold text-zinc-900 dark:text-white text-[11px]">{notice.originalWorkAuthor || "—"}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <span className="block text-[9px] font-sans font-bold uppercase tracking-wider text-zinc-400">Statement of Infringement Description</span>
                  <div className="text-xs md:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded border border-zinc-100 dark:border-zinc-800 whitespace-pre-wrap">
                    {notice.description || "No accompanying descriptions provided."}
                  </div>
                </div>

                <div className="space-y-3 pt-6 border-t border-zinc-100 dark:border-zinc-900 font-sans">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Good Faith Declarations</span>
                  <div className="text-[10px] text-zinc-400 space-y-2 leading-relaxed">
                    <p>1. I have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</p>
                    <p>2. The information in this notification is accurate, and under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of an exclusive right that is allegedly infringed.</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-dashed border-zinc-200 dark:border-zinc-800 flex justify-between items-end font-sans">
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-zinc-400">Claimant Signature</span>
                    <p className="text-xs font-bold font-mono tracking-wider italic text-zinc-700 dark:text-zinc-300 mt-1 uppercase">/s/ {notice.copyrightHolder}</p>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] font-bold uppercase tracking-wider text-zinc-400 font-sans">Authorized Submitter</span>
                    <p className="text-[11px] font-bold text-zinc-900 dark:text-white mt-1">@{notice.submittedByUser?.username || "anonymous"}</p>
                    <p className="text-[9px] text-zinc-400">{notice.submittedByUser?.email || ""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Moderation Story Status & Submitter Card */}
          <div className="space-y-6">
            
            {/* Target Story Panel */}
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5" />
                Target Disputed Content
              </h3>

              {story ? (
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-14 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                      {story.coverUrl ? (
                        <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white leading-snug uppercase">
                        {story.title}
                      </h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                        Author: @{story.author.username}
                      </p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        {story.published ? (
                          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded">
                            Active & Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded">
                            Offline / Taken Down
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 space-y-2 text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    <div className="flex justify-between">
                      <span>Story View Count</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{story.viewCount.toLocaleString()} views</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Author Email</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300 font-mono text-[9px]">{story.author.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900 flex gap-2">
                    <Link
                      href={`/stories/${story.id}`}
                      target="_blank"
                      className="w-full text-center px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-[9px] font-bold uppercase tracking-widest rounded hover:border-zinc-950 dark:hover:border-white transition-all"
                    >
                      Inspect Story
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 rounded">
                  <XCircle className="w-5 h-5 text-zinc-300 mx-auto mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Disputed Story Deleted from DB</p>
                </div>
              )}
            </div>

            {/* Submitter User Profile */}
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Authorized Claim Submitter
              </h3>

              {notice.submittedByUser ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-50 border border-zinc-200 shrink-0">
                    {notice.submittedByUser.avatarUrl ? (
                      <img src={notice.submittedByUser.avatarUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-400">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase truncate">
                      {notice.submittedByUser.displayName || notice.submittedByUser.username}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate">
                      @{notice.submittedByUser.username}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-[10px] font-semibold text-zinc-400">Anonymous Submitter Profile</div>
              )}
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
