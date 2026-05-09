'use client';

import { useEffect, useState } from 'react';
import { AchievementBadge } from './AchievementBadge';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  points: number;
}

interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
  achievement: Achievement;
}

interface AchievementsDisplayProps {
  userId: string;
  maxDisplay?: number;
}

export function AchievementsDisplay({ userId, maxDisplay = 6 }: AchievementsDisplayProps) {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);

        // Fetch all available achievements
        const allRes = await fetch('/api/achievements');
        if (allRes.ok) {
          const allData = await allRes.json();
          setAllAchievements(allData);
        }

        // Fetch user's achievements
        const userRes = await fetch(`/api/achievements/user/${userId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUserAchievements(userData.achievements);
          setTotalPoints(userData.totalPoints);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchAchievements();
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading achievements...</div>;
  }

  const earnedIds = new Set(userAchievements.map(ua => ua.achievementId));
  const earnedAchievements = userAchievements.slice(0, maxDisplay);
  const displayAchievements = [
    ...earnedAchievements.map(ua => ua.achievement),
    ...allAchievements
      .filter(a => !earnedIds.has(a.id))
      .slice(0, maxDisplay - earnedAchievements.length),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Points</p>
          <p className="text-2xl font-bold text-yellow-600">{totalPoints}</p>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        {userAchievements.length} of {allAchievements.length} unlocked
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayAchievements.map(achievement => {
          const earned = earnedIds.has(achievement.id);
          const earnedData = userAchievements.find(ua => ua.achievementId === achievement.id);
          return (
            <AchievementBadge
              key={achievement.id}
              achievement={achievement}
              earned={earned}
              earnedAt={earnedData?.earnedAt}
            />
          );
        })}
      </div>
    </div>
  );
}
