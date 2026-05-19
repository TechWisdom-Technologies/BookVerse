"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  ArrowLeft, 
  Trash2, 
  Shield, 
  UserX, 
  RefreshCw, 
  Save, 
  Loader2, 
  Globe, 
  Lock, 
  Users, 
  AlertTriangle 
} from 'lucide-react';
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
      avatarUrl?: string;
    };
  }>;
}

export default function ClubSettingsPage({ params }: { params: Promise<{ clubId: string }> }) {
  const { clubId } = use(params);
  const router = useRouter();
  
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dissolving, setDissolving] = useState(false);
  const [bans, setBans] = useState<any[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [maxMembers, setMaxMembers] = useState(50);

  useEffect(() => {
    fetchClub();
    fetchBans();
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
    if (!name.trim()) {
      toast.error('Club name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, isPrivate, maxMembers }),
      });
      if (res.ok) {
        toast.success('Club settings saved successfully! ✨');
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
        toast.success('Member removed successfully');
        fetchClub();
      }
    } catch (error) {
      toast.error('Failed to kick member');
    }
  };

  const fetchBans = async () => {
    try {
      const res = await fetch(`/api/clubs/${clubId}/bans`);
      if (res.ok) {
        const data = await res.json();
        setBans(data.bans || []);
      }
    } catch (error) {
      console.error('Error fetching bans:', error);
    }
  };

  const handleBanMember = async (userId: string) => {
    const reason = prompt('Specify a reason for banning this member (optional):');
    if (reason === null) return; // cancelled
    
    try {
      const res = await fetch(`/api/clubs/${clubId}/manage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban', userId, reason }),
      });
      if (res.ok) {
        toast.success('Member banned successfully ✨');
        fetchClub();
        fetchBans();
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to ban member');
      }
    } catch (error) {
      toast.error('Failed to ban member');
    }
  };

  const handleUnbanUser = async (userId: string) => {
    if (!confirm('Unban this user?')) return;
    try {
      const res = await fetch(`/api/clubs/${clubId}/manage?userId=${userId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('User unbanned successfully ✨');
        fetchBans();
      } else {
        toast.error('Failed to unban user');
      }
    } catch (error) {
      toast.error('Failed to unban user');
    }
  };

  const handleDissolveClub = async () => {
    const doubleCheck = confirm('WARNING: Are you absolutely sure you want to permanently dissolve this club? All discussions, records, and member parameters will be deleted forever.');
    if (!doubleCheck) return;
    
    try {
      setDissolving(true);
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Club dissolved successfully');
        router.push('/clubs');
      } else {
        toast.error('Failed to dissolve club');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setDissolving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-300" />
      </div>
    );
  }

  if (!club) return null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-32">
      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Portal Header */}
        <header className="mb-12 pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Return to Club
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight mb-1 uppercase">Manage Club.</h1>
              <p className="text-xs text-zinc-500 font-medium">{club.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 border border-zinc-100 dark:border-zinc-800 rounded shadow-sm">
            <Settings className="w-3.5 h-3.5 text-zinc-300" />
            Control Hub
          </div>
        </header>

        {/* Unified Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left / Middle: Main General Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Information Card */}
            <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 dark:bg-white" />
              
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-300" />
                General Configuration
              </h2>

              <form onSubmit={handleUpdateClub} className="space-y-8">
                
                {/* Title */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Club Title</label>
                    <span className="text-[9px] font-mono text-zinc-400">{name.length}/100</span>
                  </div>
                  <input 
                    type="text" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    maxLength={100}
                    required
                    className="w-full px-5 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs font-medium"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Manifesto Description</label>
                    <span className="text-[9px] font-mono text-zinc-400">{description.length}/500</span>
                  </div>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={500}
                    rows={5}
                    className="w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-xs leading-relaxed resize-none font-medium"
                  />
                </div>

                {/* Access Selection Toggles */}
                <div className="space-y-3">
                  <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">Privacy Level</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Public Toggle Card */}
                    <button
                      type="button"
                      onClick={() => setIsPrivate(false)}
                      className={`group flex items-start gap-4 p-5 border rounded text-left transition-all duration-300 ${
                        !isPrivate 
                          ? 'border-zinc-950 dark:border-white bg-zinc-50/50 dark:bg-zinc-900/10 shadow-sm' 
                          : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-900 dark:hover:border-white bg-transparent'
                      }`}
                    >
                      <div className={`p-2.5 rounded transition-colors ${
                        !isPrivate 
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white'
                      }`}>
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Public Sector</div>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Open access. Anyone can join or inspect discussions.</p>
                      </div>
                    </button>

                    {/* Private Toggle Card */}
                    <button
                      type="button"
                      onClick={() => setIsPrivate(true)}
                      className={`group flex items-start gap-4 p-5 border rounded text-left transition-all duration-300 ${
                        isPrivate 
                          ? 'border-zinc-950 dark:border-white bg-zinc-50/50 dark:bg-zinc-900/10 shadow-sm' 
                          : 'border-zinc-100 dark:border-zinc-900 hover:border-zinc-900 dark:hover:border-white bg-transparent'
                      }`}
                    >
                      <div className={`p-2.5 rounded transition-colors ${
                        isPrivate 
                          ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900' 
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white'
                      }`}>
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 dark:text-white">Private Sanctuary</div>
                        <p className="text-[10px] text-zinc-400 font-medium italic">Private join code required to authenticate members.</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Max Members Limit */}
                <div className="space-y-2">
                  <label htmlFor="maxMembers" className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 ml-1">
                    Maximum Members Limit
                  </label>
                  <select
                    id="maxMembers"
                    name="maxMembers"
                    value={maxMembers}
                    onChange={e => setMaxMembers(parseInt(e.target.value))}
                    className="w-full px-4 py-3.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded outline-none focus:border-zinc-900 dark:focus:border-white transition-all text-[11px] font-bold uppercase tracking-widest text-zinc-500 cursor-pointer"
                  >
                    <option value="10">10 MEMBERS</option>
                    <option value="25">25 MEMBERS</option>
                    <option value="50">50 MEMBERS</option>
                    <option value="100">100 MEMBERS</option>
                    <option value="250">250 MEMBERS</option>
                    <option value="500">500 MEMBERS</option>
                  </select>
                </div>

                {/* Submit Change Button */}
                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded shadow-sm"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Persisting settings...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Save Configuration
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>

            {/* Roster Management Card */}
            <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-900 dark:bg-white" />
              
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-300" />
                Active Member Roster
              </h2>

              <div className="space-y-4">
                {club.members.map(member => (
                  <div key={member.userId} className="flex items-center justify-between p-4 rounded border border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 group hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center font-bold text-[10px] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                        {member.user.avatarUrl ? (
                          <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          member.user.username[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-white block mb-0.5">{member.user.displayName || member.user.username}</p>
                        <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest leading-none">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {member.role === 'MEMBER' && (
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleKickMember(member.userId)}
                          className="p-2 text-zinc-400 hover:text-rose-500 hover:bg-rose-500/5 rounded transition-all"
                          title="Kick member"
                        >
                          <UserX className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleBanMember(member.userId)}
                          className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 rounded transition-all"
                          title="Ban member from club"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Banned Registry Card */}
            <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500" />
              
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Banned Registry ({bans.length})
              </h2>

              {bans.length === 0 ? (
                <p className="text-[10px] text-zinc-400 font-medium italic">No users are currently banned from this club.</p>
              ) : (
                <div className="space-y-4">
                  {bans.map(ban => (
                    <div key={ban.userId} className="flex items-center justify-between p-4 rounded border border-zinc-100 dark:border-zinc-900 bg-red-500/[0.01] group hover:border-red-300 dark:hover:border-red-950 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center font-bold text-[10px] border border-zinc-100 dark:border-zinc-800 overflow-hidden">
                          {ban.user.avatarUrl ? (
                            <img src={ban.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            ban.user.username[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-zinc-900 dark:text-white block mb-0.5">{ban.user.displayName || ban.user.username}</p>
                          <p className="text-[9px] text-zinc-400 font-medium">
                            <span className="font-bold text-red-500/80 uppercase tracking-widest mr-1">Reason:</span>
                            {ban.reason}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleUnbanUser(ban.userId)}
                        className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-900 dark:hover:bg-white text-zinc-400 hover:text-white dark:hover:text-zinc-900 text-[9px] font-bold uppercase tracking-widest rounded border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all"
                      >
                        Unban
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Action Columns */}
          <div className="space-y-8">
            
            {/* Access Code Management */}
            <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl p-8 bg-zinc-900 dark:bg-zinc-950 text-white shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-zinc-100 dark:bg-zinc-800" />
              
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-4 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5" />
                Access Control
              </h2>
              <p className="text-[10px] text-zinc-400 mb-6 leading-relaxed italic">
                Reset your private club join code. Existing members will stay joined, but new joins must use the fresh code.
              </p>

              <div className="bg-white/5 dark:bg-zinc-900/50 p-4 rounded border border-white/10 dark:border-zinc-900 text-center mb-6">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 block mb-1">Active Join Code</span>
                <span className="text-xl font-mono font-bold tracking-[0.15em] text-zinc-100">{club.joinCode || '-------'}</span>
              </div>

              <button 
                onClick={handleGenerateJoinCode}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate Join Code
              </button>
            </div>

            {/* Danger Zone */}
            <div className="border border-rose-500/10 rounded-xl p-8 bg-rose-500/5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[3px] bg-rose-500" />
              
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                Danger Zone
              </h2>
              <p className="text-[10px] text-zinc-500 mb-6 leading-relaxed italic">
                Permanently dissolve this book club. This operation will purge all threads, discussion history, messages, and rosters. This action is irreversible.
              </p>

              <button 
                onClick={handleDissolveClub}
                disabled={dissolving}
                className="w-full py-3.5 bg-transparent hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 text-[10px] font-bold uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2"
              >
                {dissolving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Dissolving Archive...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Dissolve Book Club
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}
