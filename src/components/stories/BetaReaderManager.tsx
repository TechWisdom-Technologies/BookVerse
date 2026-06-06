"use client";

import { useState } from "react";
import { Users, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface BetaReader {
  id: string;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    displayName: string | null;
  };
}

export function BetaReaderManager({ storyId, betaReaders, setBetaReaders }: { storyId: string, betaReaders: BetaReader[], setBetaReaders: React.Dispatch<React.SetStateAction<BetaReader[]>> }) {
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const addBetaReader = async () => {
    if (!newUsername.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/beta-readers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add beta reader");
      toast.success("Beta reader added!");
      setNewUsername("");
      
      // Refresh list
      const refreshRes = await fetch(`/api/stories/${storyId}/beta-readers`);
      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        setBetaReaders(refreshData.betaReaders || []);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeBetaReader = async (userId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stories/${storyId}/beta-readers`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to remove beta reader");
      }
      toast.success("Beta reader removed");
      
      // Update local state
      setBetaReaders(prev => prev.filter(r => r.user?.id !== userId));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 p-6 space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <Users className="h-4 w-4" />
        Beta Readers
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text" 
          value={newUsername} 
          onChange={(e) => setNewUsername(e.target.value)} 
          placeholder="Enter username" 
          className="flex-1 rounded border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs" 
        />
        <button 
          onClick={addBetaReader} 
          disabled={loading || !newUsername.trim()} 
          className="px-3 py-2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-2 max-h-36 overflow-auto border border-zinc-50 dark:border-zinc-900 rounded-lg p-2">
        {betaReaders.length === 0 ? (
          <p className="text-xs text-zinc-400 italic text-center py-4">No beta readers yet.</p>
        ) : betaReaders.map((reader) => (
          <div key={reader.id} className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50 p-2 rounded">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                {reader.user?.displayName || reader.user?.username || "Reader"}
              </span>
              <span className="text-[10px] text-zinc-400">@{reader.user?.username}</span>
            </div>
            <button 
              onClick={() => reader.user?.id && removeBetaReader(reader.user.id)}
              disabled={loading}
              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
