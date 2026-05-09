'use client';

import { useEffect, useState } from 'react';
import { Zap, Trophy, Users, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Challenge {
  id: string;
  title: string;
  description: string;
  genre: string;
  targetBooks: number;
  startDate: string;
  endDate: string;
  participants: Array<any>;
}

export default function ReadingChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ACTIVE');
  const [participatedIds, setParticipatedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchChallenges();
  }, [filter]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reading-challenges?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setChallenges(data);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (challengeId: string) => {
    try {
      const res = await fetch(`/api/reading-challenges/${challengeId}/participate`, {
        method: 'POST',
      });

      if (res.ok) {
        setParticipatedIds((prev) => new Set([...prev, challengeId]));
        toast.success('Joined challenge! 🎉');
        fetchChallenges();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to join challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast.error('An error occurred');
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900">Reading Challenges</h1>
          </div>
          <p className="text-gray-600 text-lg">Join the community and challenge yourself to read more</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-8 flex-wrap">
          {['ACTIVE', 'UPCOMING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Challenges Grid */}
        {challenges.length === 0 ? (
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No challenges found</h2>
            <p className="text-gray-600">Check back later for more reading challenges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => {
              const isParticipating = participatedIds.has(challenge.id);
              const daysLeft = getDaysRemaining(challenge.endDate);

              return (
                <div
                  key={challenge.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden"
                >
                  {/* Badge */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">{challenge.genre}</span>
                    </div>
                    {daysLeft > 0 && (
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {daysLeft}d left
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
                      {challenge.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{challenge.description}</p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-blue-600">{challenge.targetBooks}</p>
                        <p className="text-xs text-gray-600">Books</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-600" />
                          <p className="text-2xl font-bold text-purple-600">
                            {challenge.participants.length}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600">Joined</p>
                      </div>
                    </div>

                    {/* Action */}
                    {isParticipating ? (
                      <button
                        disabled
                        className="w-full bg-green-100 text-green-700 font-semibold py-2 px-4 rounded-lg cursor-default flex items-center justify-center gap-2"
                      >
                        ✓ Participating
                      </button>
                    ) : (
                      <button
                        onClick={() => handleParticipate(challenge.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Join Challenge
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Join</h3>
              <p className="text-gray-600">Pick a challenge and join the community</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Read</h3>
              <p className="text-gray-600">Read the specified number of books</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Complete</h3>
              <p className="text-gray-600">Track your progress and earn badges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
