"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, ArrowLeft, Trash2, Shield, UserX, RefreshCw, Save, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Club {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  isPrivate: boolean;
  joinCode?: string;
  maxMembers: number;
  members: Array<{
    userId: string;
    role: string;
    user: {
      id: string;
      username: string;
      displayName?: string;
    };
  }>;
}

export default function ClubSettingsPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const router = useRouter();
  
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState(50);

  useEffect(() => {
    fetchClub();
  }, [clubId]);

  const fetchClub = async () => {
    try {
      const res = await fetch(`/api/clubs/${clubId}`);
      if (res.ok) {
        const data = await res.json();
        setClub(data);
        setName(data.name);
        setDescription(data.description || '');
        setIsPrivate(data.isPrivate);
        setMaxMembers(data.maxMembers || 50);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load club settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isPrivate, maxMembers }),
      });
      if (res.ok) {
        toast.success('Club updated successfully! ✨');
        router.push(`/clubs/${clubId}`);
      } else {
        toast.error('Failed to update club');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateJoinCode = async () => {
    try {
      const res = await fetch(`/api/clubs/${clubId}/manage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_code' }),
      });
      if (res.ok) {
        const data = await res.json();
        setClub(prev => prev ? { ...prev, joinCode: data.joinCode } : null);
        toast.success('New join code generated! 🔑');
      }
    } catch (error) {
      toast.error('Failed to generate code');
    }
  };

  const handleKickMember = async (userId: string) => {
    if (!confirm('Kick this member from the club?')) return;
    try {
      const res = await fetch(`/api/clubs/${clubId}/manage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'kick', targetUserId: userId }),
      });
      if (res.ok) {
        toast.success('Member removed');
        fetchClub();
      }
    } catch (error) {
      toast.error('Failed to kick member');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFDFC] dark:bg-[#0A0A0A]">
        <Loader className="w-8 h-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!club) return null;

  return (
    <main className="min-h-screen bg-[#FDFDFC] dark:bg-[#0A0A0A] pt-16 pb-32">
      <div className="mx-auto max-w-[1000px] px-6">
        
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Manage Club.</h1>
            <p className="text-zinc-500 font-medium">{club.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-brand" />
                General Information
              </h2>
              
              <form onSubmit={handleUpdateClub} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Club Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:ring-2 focus:ring-brand outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-zinc-500 mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border-transparent focus:ring-2 focus:ring-brand outline-none resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-2xl">
                  <div>
                    <p className="font-bold">Private Club</p>
                    <p className="text-sm text-zinc-500">Requires a join code to enter</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`w-14 h-8 rounded-full transition-colors relative ${isPrivate ? 'bg-brand' : 'bg-zinc-300 dark:bg-zinc-700'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${isPrivate ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <button 
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-brand text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-brand/20 transition-all"
                >
                  {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </form>
            </div>

            {/* Members Management */}
            <div className="bg-white dark:bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Member Roster
              </h2>
              <div className="space-y-4">
                {club.members.map(member => (
                  <div key={member.userId} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs">
                        {member.user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">{member.user.displayName || member.user.username}</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{member.role}</p>
                      </div>
                    </div>
                    {member.role === 'MEMBER' && (
                      <button 
                        onClick={() => handleKickMember(member.userId)}
                        className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"
                      >
                        <UserX className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panels */}
          <div className="space-y-8">
            {/* Access Control */}
            <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-[2.5rem] text-white">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-brand">
                <RefreshCw className="w-5 h-5" />
                Access Control
              </h2>
              <p className="text-zinc-400 text-sm mb-6 font-medium">Generate a new join code to reset access for your private club.</p>
              
              <div className="bg-white/10 rounded-2xl p-4 mb-6 text-center">
                <p className="text-xs uppercase font-black tracking-widest text-zinc-500 mb-1">Current Join Code</p>
                <p className="text-2xl font-mono font-bold tracking-widest text-brand">{club.joinCode || '------'}</p>
              </div>

              <button 
                onClick={handleGenerateJoinCode}
                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Code
              </button>
            </div>

            {/* Danger Zone */}
            <div className="p-8 rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-rose-500">
                <Trash2 className="w-5 h-5" />
                Danger Zone
              </h2>
              <p className="text-zinc-500 text-sm mb-6 font-medium">Permanently dissolve this club and all its discussions.</p>
              <button 
                className="w-full py-4 bg-rose-500 text-white rounded-full font-bold text-sm hover:bg-rose-600 transition-all"
              >
                Dissolve Club
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
