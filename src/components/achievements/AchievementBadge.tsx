'use client';

import { Trophy, Zap, Star, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  points: number;
}

interface AchievementBadgeProps {
  achievement: Achievement;
  earned?: boolean;
  earnedAt?: Date | null;
}

export function AchievementBadge({ achievement, earned = false, earnedAt }: AchievementBadgeProps) {
  const getIcon = () => {
    switch (achievement.icon?.toLowerCase()) {
      case 'trophy':
        return <Trophy className="w-8 h-8" />;
      case 'fire':
        return <Zap className="w-8 h-8" />;
      case 'star':
        return <Star className="w-8 h-8" />;
      default:
        return <Trophy className="w-8 h-8" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
        earned
          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-300 cursor-default'
          : 'bg-gray-50 border-gray-300 opacity-50'
      }`}
      title={achievement.description}
    >
      <div className={`p-3 rounded-full mb-2 ${earned ? 'bg-yellow-200' : 'bg-gray-200'}`}>
        {earned ? getIcon() : <Lock className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-sm font-semibold text-center text-gray-900 mb-1">
        {achievement.name}
      </h3>
      <p className="text-xs text-gray-600 text-center mb-2">{achievement.points} pts</p>
      {earned && earnedAt && (
        <p className="text-xs text-gray-500">
          {new Date(earnedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
