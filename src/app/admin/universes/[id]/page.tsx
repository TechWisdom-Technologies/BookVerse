"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, ArrowLeft, Globe, User, BookOpen, Layers, Users, ShieldAlert, Check, X, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface Collaborator {
  id: string;
  universeId: string;
  userId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

interface Story {
  id: string;
  title: string;
  coverUrl: string | null;
  published: boolean;
  viewCount: number;
  genre: string | null;
  seriesId: string | null;
  author: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

interface Series {
  id: string;
  name: string;
  description: string | null;
  coverUrl: string | null;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
  };
  _count: {
    stories: number;
  };
}

export default function UniverseDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const [universe, setUniverse] = useState<any | null>(null);
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"stories" | "collaborators" | "series">("stories");
  const router = useRouter();

  useEffect(() => {
    fetchUniverse();
  }, [id]);

  const fetchUniverse = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/universes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUniverse(data.universe);
        setSeriesList(data.seriesList || []);
      } else {
        toast.error("Failed to load universe data");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication failure");
    } finally {
      setLoading(false);
    }
  };

  const doDelete = async () => {
    if (!confirm("Permanently delete this universe? This removes the universe record and dissociates all member stories. This cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/universes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universeId: id }),
      });
      if (res.ok) {
        toast.success("Universe deleted successfully");
        router.push("/admin/universes");
      } else {
        toast.error("Failed to delete universe");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network communication failure");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCollaboratorStatus = async (userId: string, newStatus: "ACCEPTED" | "REJECTED") => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/universes/${id}/collaborators/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Collaborator status updated to ${newStatus}`);
        fetchUniverse();
      } else {
        toast.error("Failed to update status");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to modify invitation state");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!confirm("Remove this collaborator from the universe? All stories written by this collaborator in this universe will also be deleted.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/universes/${id}/collaborators/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Collaborator and their associated stories removed");
        fetchUniverse();
      } else {
        toast.error("Failed to remove collaborator");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to remove collaborator");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Loading Universe Docket...</span>
        </div>
      </div>
    );
  }

  if (!universe) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-12 text-center">
        <div>
          <ShieldAlert className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">Universe Not Found</h2>
          <Link href="/admin/universes" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 hover:underline">
            Back to Hub
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link href="/admin/universes" className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-3 h-3" />
            Back to Universes
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-zinc-150 dark:border-zinc-900">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-1 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded">
                <Globe className="w-4 h-4" />
              </span>
              <h1 className="text-xl font-bold tracking-tight uppercase">{universe.name}</h1>
            </div>
            <p className="text-xs text-zinc-500 font-medium">Universe Oversight Details & Collaboration Registry.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={doDelete}
              disabled={actionLoading}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge Universe
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Metadata Column */}
          <div className="space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                Universe Dossier
              </h3>
              
              <div className="space-y-6">
                {universe.coverUrl && (
                  <div className="relative aspect-[3/2] w-full overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                    <img src={universe.coverUrl} alt={universe.name} className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Genre Classification</span>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white uppercase mt-0.5">{universe.genre}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Description / Lore Outline</span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed whitespace-pre-wrap">{universe.description || "No lore records found."}</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-zinc-400">Created At</span>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">{new Date(universe.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner/Creator Card */}
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-lg bg-white dark:bg-zinc-950 p-6 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Originating Archivist / Creator
              </h3>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
                  {universe.user?.avatarUrl ? (
                    <img src={universe.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300"><User className="w-5 h-5" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase truncate">
                    {universe.user?.displayName || universe.user?.username}
                  </p>
                  <p className="text-[10px] text-zinc-400 truncate">
                    @{universe.user?.username || "unknown"}
                  </p>
                  {universe.user?.email && (
                    <p className="text-[9px] text-zinc-400 truncate mt-0.5 font-mono">
                      {universe.user.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Detailed Tabbed Section */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tabs */}
            <div className="flex border-b border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950 p-1 rounded-t-lg border-t border-x border-zinc-250/20">
              <button
                onClick={() => setActiveTab("stories")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 ${
                  activeTab === "stories"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Stories ({universe.stories?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("collaborators")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 ${
                  activeTab === "collaborators"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Collaborations ({universe.collaborators?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("series")}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 ${
                  activeTab === "series"
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm"
                    : "text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Series ({seriesList.length})
              </button>
            </div>

            {/* Tab Panels */}
            <div className="border border-zinc-200 dark:border-zinc-900 rounded-b-lg bg-white dark:bg-zinc-950 overflow-hidden min-h-[400px]">
              
              {/* STORIES TAB */}
              {activeTab === "stories" && (
                <div className="p-6">
                  {!universe.stories || universe.stories.length === 0 ? (
                    <div className="py-24 text-center">
                      <BookOpen className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No member stories registered.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {universe.stories.map((story: Story) => (
                        <div key={story.id} className="flex items-center justify-between gap-4 p-4 border border-zinc-100 dark:border-zinc-900/80 rounded bg-zinc-50/30 dark:bg-zinc-900/10 group hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative h-12 w-9 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                              {story.coverUrl ? (
                                <img src={story.coverUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-10"><FileText className="w-4 h-4" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase truncate max-w-[240px] md:max-w-md">
                                {story.title}
                              </h4>
                              <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                                Author: @{story.author.username}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 rounded font-mono">
                                  {story.viewCount.toLocaleString()} Views
                                </span>
                                {story.published ? (
                                  <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded">
                                    Published
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded">
                                    Draft / Takedown
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            href={`/stories/${story.id}`}
                            target="_blank"
                            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white text-[9px] font-bold uppercase tracking-widest rounded transition-all bg-white dark:bg-zinc-900 shrink-0"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* COLLABORATIONS TAB */}
              {activeTab === "collaborators" && (
                <div className="p-6">
                  {!universe.collaborators || universe.collaborators.length === 0 ? (
                    <div className="py-24 text-center">
                      <Users className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No collaboration registry data.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {universe.collaborators.map((collab: Collaborator) => (
                        <div key={collab.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-zinc-100 dark:border-zinc-900/80 rounded bg-zinc-50/30 dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0">
                              {collab.user.avatarUrl ? (
                                <img src={collab.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-300"><User className="w-4 h-4" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-zinc-900 dark:text-white uppercase truncate">
                                {collab.user.displayName || collab.user.username}
                              </p>
                              <p className="text-[10px] text-zinc-400 truncate">
                                @{collab.user.username}
                              </p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded ${
                                  collab.status === "ACCEPTED"
                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                    : collab.status === "REJECTED"
                                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse"
                                }`}>
                                  {collab.status}
                                </span>
                                <span className="text-[9px] text-zinc-400 font-mono">Invited {new Date(collab.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                            {collab.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() => handleUpdateCollaboratorStatus(collab.user.id, "ACCEPTED")}
                                  disabled={actionLoading}
                                  className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/5 transition-all border border-zinc-200 dark:border-zinc-800 hover:border-emerald-550/20 rounded"
                                  title="Approve Collaboration Invite"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleUpdateCollaboratorStatus(collab.user.id, "REJECTED")}
                                  disabled={actionLoading}
                                  className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 transition-all border border-zinc-200 dark:border-zinc-800 hover:border-rose-550/20 rounded"
                                  title="Reject Invite"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleRemoveCollaborator(collab.user.id)}
                              disabled={actionLoading}
                              className="p-1.5 text-zinc-450 hover:text-rose-500 hover:bg-rose-500/5 border border-zinc-200 dark:border-zinc-800 hover:border-rose-550/20 rounded transition-all"
                              title="Delete/Remove Collaborator"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SERIES TAB */}
              {activeTab === "series" && (
                <div className="p-6">
                  {seriesList.length === 0 ? (
                    <div className="py-24 text-center">
                      <Layers className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">No associated story series discovered.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {seriesList.map((series: Series) => (
                        <div key={series.id} className="flex items-center justify-between gap-4 p-4 border border-zinc-100 dark:border-zinc-900/80 rounded bg-zinc-50/30 dark:bg-zinc-900/10 hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="relative h-12 w-9 overflow-hidden rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shrink-0">
                              {series.coverUrl ? (
                                <img src={series.coverUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center opacity-10"><Layers className="w-4 h-4" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase truncate">
                                {series.name}
                              </h4>
                              {series.description && (
                                <p className="text-[10px] text-zinc-500 truncate max-w-[200px] md:max-w-md mt-0.5">
                                  {series.description}
                                </p>
                              )}
                              <div className="flex gap-2 mt-2">
                                <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 rounded font-mono">
                                  {series._count?.stories || 0} Stories
                                </span>
                                <span className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-zinc-400 border border-zinc-200 dark:border-zinc-800 rounded font-mono">
                                  Created by @{series.user.username}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            href={`/series/${series.id}`}
                            target="_blank"
                            className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white text-[9px] font-bold uppercase tracking-widest rounded transition-all bg-white dark:bg-zinc-900 shrink-0"
                          >
                            View
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}
