'use client';

import Link from 'next/link';
import { Users, Lock } from 'lucide-react';

interface ClubCardProps {
  id: string;
  name: string;
  description?: string;
  genre?: string;
  isPrivate: boolean;
  memberCount: number;
  ownerName: string;
  coverUrl?: string;
}

export function ClubCard({
  id,
  name,
  description,
  genre,
  isPrivate,
  memberCount,
  ownerName,
  coverUrl,
}: ClubCardProps) {
  return (
    <Link href={`/clubs/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
        {coverUrl && (
          <div
            className="h-40 bg-gradient-to-br from-blue-400 to-purple-500"
            style={{
              backgroundImage: `url(${coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        {!coverUrl && (
          <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500" />
        )}

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{name}</h3>
            {isPrivate && <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 ml-2" />}
          </div>

          {genre && (
            <p className="text-sm text-blue-600 font-medium mb-2">{genre}</p>
          )}

          {description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{memberCount} members</span>
            </div>
            <span className="text-xs">by {ownerName}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
