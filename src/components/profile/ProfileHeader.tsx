"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "./FollowButton";
import { NewsletterSubscribeButton } from "./NewsletterSubscribeButton";
import { BookOpen, Award, BarChart3, Settings, Mail, Phone, Calendar, Tag, MapPin, Globe } from "lucide-react";

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    bio: string | null;
    role: string;
    membershipTier?: string | null;
    phoneNumber?: string | null;
    email?: string | null;
    dateOfBirth?: Date | string | null;
    address?: string | null;
    nationality?: string | null;
    subGenres?: string[];
    socialLinks?: { platform: string; url: string }[] | null;
    createdAt: Date | string;
    _count: {
      followers: number;
      following: number;
    };
    isFollowing: boolean;
    isSubscribed?: boolean;
    isOwnProfile: boolean;
  };
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [avatarError, setAvatarError] = useState(false);
  const displayName = user.displayName || user.username;

  const PLATFORMS = {
    facebook: { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Logo_de_Facebook.png" },
    x: { name: "X (Twitter)", logo: "https://images.seeklogo.com/logo-png/49/2/twitter-x-logo-png_seeklogo-492396.png" },
    instagram: { name: "Instagram", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
    youtube: { name: "YouTube", logo: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png" },
    tiktok: { name: "TikTok", logo: "https://img.magnific.com/premium-psd/tiktok-logo_1131634-487.jpg?semt=ais_hybrid&w=740&q=80" },
    linkedin: { name: "LinkedIn", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
    portfolio: { name: "Portfolio", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
    other: { name: "Other", logo: "https://img.magnific.com/premium-vector/purple-gradiend-social-media-logo_197792-1883.jpg?semt=ais_hybrid&w=740&q=80" },
  };

  return (
    <div className="relative">
      {/* Simple Header Background */}
      <div className="h-40 w-full bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-900 rounded-xl overflow-hidden" />

      <div className="flex flex-col md:flex-row items-center md:items-end gap-10 -mt-16 px-6 md:px-12 relative z-10">
        {/* Profile Image & Socials */}
        <div className="shrink-0 flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-xl overflow-hidden border-4 border-white dark:border-zinc-950 shadow-2xl bg-white dark:bg-zinc-900">
              {user.avatarUrl && !avatarError ? (
                <img
                  src={user.avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-200 dark:text-zinc-800 uppercase">
                  {displayName[0]}
                </div>
              )}
            </div>
            {user.role === "AUTHOR" && (
              <div className="absolute -bottom-2 -right-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-2 rounded shadow-xl border-2 border-white dark:border-zinc-950">
                <BookOpen className="w-4 h-4" />
              </div>
            )}
          </div>
          
          {user.socialLinks && user.socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {user.socialLinks.map((link, idx) => {
                const platformInfo = PLATFORMS[link.platform as keyof typeof PLATFORMS];
                return (
                  <a 
                    key={idx} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-6 h-6 rounded-full shadow-sm hover:scale-110 transition-transform overflow-hidden block"
                    title={platformInfo?.name || link.platform}
                  >
                    <img 
                      src={platformInfo?.logo || PLATFORMS.other.logo} 
                      alt={platformInfo?.name || link.platform} 
                      className="w-full h-full object-cover bg-white"
                    />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* User Info & Actions */}
        <div className="flex-1 w-full pb-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white mb-1 uppercase">
                {displayName}
              </h1>
              <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 mb-6 tracking-widest">@{user.username}</p>
              {user.bio && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed italic">
                  &quot;{user.bio}&quot;
                </p>
              )}

              {/* Additional Author Details */}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                {user.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.phoneNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
                {user.dateOfBirth && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>{formatDate(user.dateOfBirth)}</span>
                  </div>
                )}
                {user.nationality && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-zinc-400" />
                    <span>{user.nationality}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-zinc-400" />
                    <span>{user.address}</span>
                  </div>
                )}
              </div>
              
              {user.subGenres && user.subGenres.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {user.subGenres.map(genre => (
                    <span key={genre} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                      <Tag className="w-3 h-3" />
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              {user.isOwnProfile ? (
                <Link
                  href="/settings"
                  className="px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold uppercase tracking-[0.2em] rounded transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-[150px]"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Edit Profile
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <FollowButton targetUserId={user.id} isFollowing={user.isFollowing} />
                  <NewsletterSubscribeButton 
                    authorId={user.id} 
                    initialIsSubscribed={!!user.isSubscribed} 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Simple Stats Bar */}
          <div className="mt-10 flex flex-wrap justify-center md:justify-start items-center gap-x-12 gap-y-6 pt-8 border-t border-zinc-50 dark:border-zinc-900">
            <Link href={`/profile/${user.username}?tab=followers`} className="flex flex-col group">
              <span className="text-base font-bold text-zinc-900 dark:text-white leading-none tracking-tighter">{user._count.followers}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mt-1.5 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Followers</span>
            </Link>

            <Link href={`/profile/${user.username}?tab=following`} className="flex flex-col group">
              <span className="text-base font-bold text-zinc-900 dark:text-white leading-none tracking-tighter">{user._count.following}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mt-1.5 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Following</span>
            </Link>

            <div className="flex flex-col">
              <span className="text-base font-bold text-zinc-900 dark:text-white leading-none tracking-tighter">{formatDate(user.createdAt)}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-300 dark:text-zinc-600 mt-1.5">Member Since</span>
            </div>

            <div className="flex gap-4 ml-auto">
              <Link href="/achievements" className="p-2.5 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-colors">
                <Award className="h-4 w-4 text-zinc-300" />
              </Link>
              <Link href="/reading-stats" className="p-2.5 bg-zinc-50 dark:bg-zinc-900 rounded border border-zinc-100 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-colors">
                <BarChart3 className="h-4 w-4 text-zinc-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
